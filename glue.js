(function() {
	/**
	 * Load the list of files asynchronously. This uses recursion in
	 * order to create a queue of files that will be loaded serially.
	 * Each layer, starting at the bottom, loads a file and then loads
	 * the layer on top of it. The very top file on the stack will have
	 * zero files to load, so instead it will be the one to call the
	 * callback to notify the caller that all the content is loaded.
	 *
	 * @param {Object} context function to call this method in the context of
	 * @param {Array.<string>} paths array of strings containing relative paths for required locale data files
	 * @param {Array} results empty array in which to place the resulting json when it is loaded from a file
	 * @param {Object} params An object full of parameters that the caller is passing to this function to help load the files
	 * @param {function(Array.<Object>)} callback callback to call when this function is finished attempting
	 * to load all the files that exist and can be loaded
	 */
	function loadFiles(context, paths, results, params, callback) {
		var root = "resources/";
		if (params && typeof(params.root) !== "undefined") {
			root = params.root + '/';
		}
		if (paths.length > 0) {
			var path = paths.shift();
			var ajax = new enyo.Ajax({url: enyo.path.rewrite("$lib/enyo-ilib/ilib/locale/" + path), cacheBust: false});
			//console.log("moondemo2: browser/async: attempting to load lib/enyo-ilib/ilib/locale/" + path);
			var resultFunc = function(inSender, json) {
                // console.log("moondemo2: " + (!inSender.failed && json ? "success" : "failed"));
				results.push(!inSender.failed && (typeof(json) === 'object') ? json : undefined);
				if (paths.length > 0) {
					loadFiles(context, paths, results, params, callback);
				} else {
					// only the bottom item on the stack will call
					// the callback
					callback.call(context, results);
				}
			};
			ajax.response(this, resultFunc);
			ajax.error(this, function(inSender, json) {
				// not there? Try the standard place instead
				var file = root + path;
				// console.log("moondemo2: browser/async: attempting to load " + file);
				var ajax2 = new enyo.Ajax({url: file, cacheBust: false});

				ajax2.response(this, resultFunc);
				ajax2.error(this, resultFunc);
				ajax2.go();
			});
			ajax.go();
		}
	}

	ilib.setLoaderCallback(enyo.bind(this, function(paths, sync, params, callback) {
		if (sync) {
			var ret = [];
			var root = "resources/";
			if (params && typeof(params.root) !== "undefined") {
				root = params.root + '/';
			}
			// synchronous
			enyo.forEach(paths, function (path) {
				// console.log("browser/sync: attempting to load lib/enyo-ilib/ilib/locale/" + path);
				var ajax = new enyo.Ajax({
					url: enyo.path.rewrite("$lib/enyo-ilib/ilib/locale/" + path),
					sync: true, cacheBust: false
				});

				var handler = function(inSender, json) {
                    // console.log((!inSender.failed && json ? "success" : "failed"));
					ret.push(!inSender.failed && (typeof(json) === 'object') ? json : undefined);
				};
				ajax.response(this, handler);
				ajax.error(this, function(inSender, json) {
					// console.log("browser/sync: Now attempting to load " + root + path);
					var ajax2 = new enyo.Ajax({
						url: root + path,
						sync: true, cacheBust: false
					});
					ajax2.response(this, handler);
					ajax2.error(this, handler);
					ajax2.go();
				});
				ajax.go();
			}, this);

			if (typeof(callback) === 'function') {
				callback.call(this, ret);
			}
			return ret;
		}

		// asynchronous
		var results = [];
		loadFiles(this, paths, results, params, callback);
	}));

	if (typeof(window.UILocale) !== 'undefined') {
		// this is a hack until GF-1581 is fixed
		ilib.setLocale(window.UILocale);
	}

	// enyo.updateI18NClasses should be called after every setLocale, but there isn't such a callback in current version
    enyo.updateI18NClasses = function updateBodyClasses() {
        var li = new ilib.LocaleInfo(); // for the current locale
        var locale = li.getLocale();
		var base = "enyo-locale-";

        // Remove old style definitions (hack style becouse enyo.dom doesn't have methods like enyo.dom.getBodyClasses, enyo.dom.removeBodyClass)
        if (document && document.body && document.body.className && document.body.className) {
            document.body.className = document.body.className.replace(new RegExp('(^|\\s)'+ base +'[^\\s]*', 'g'), '');
        }

        // We use the non-latin fonts for these languages (even though their scripts are technically considered latin)
        var nonLatinLanguageOverrides = ["bs", "cs", "hr", "hu", "lv", "lt", "pl", "ro", "sr", "sl", "tr", "vi"];
        // We use the latin fonts (with non-Latin fallback) for these languages (even though their scripts are non-latin)
        var latinLanguageOverrides = ["ko"];
		var scriptName = li.getScript();
		if ((scriptName !== "Latn" || enyo.indexOf(locale.getLanguage(), nonLatinLanguageOverrides) !== -1) &&
			(enyo.indexOf(locale.getLanguage(), latinLanguageOverrides) < 0)) {
			// allow enyo to define other fonts for non-Latin languages, or for certain
			// Latin-based languages where the characters with some accents don't appear in the
			// regular fonts, creating a strange "ransom note" look with a mix of fonts in the
			// same word. So, treat it like a non-Latin language in order to get all the characters
			// to display with the same font.
			enyo.dom.addBodyClass(base + "non-latin");
		}
		if (scriptName !== 'Latn' && scriptName !== 'Cyrl' && scriptName !== 'Grek') {
			// GF-45884: allow enyo to avoid setting italic fonts for those scripts that do not 
			// commonly use italics
			enyo.dom.addBodyClass(base + "non-italic");
		}

		// allow enyo to apply right-to-left styles to the app and widgets if necessary
		var script = new ilib.ScriptInfo(scriptName);
		if (script.getScriptDirection() === "rtl") {
			enyo.dom.addBodyClass(base + "right-to-left");
			if (enyo.Control) {
				enyo.Control.prototype.rtl = true;
			}
		}

		// allow enyo or the apps to give CSS classes that are specific to the language, country, or script
		if (locale.getLanguage()) {
			enyo.dom.addBodyClass(base + locale.getLanguage());
			if (locale.getScript()) {
				enyo.dom.addBodyClass(base + locale.getLanguage() + "-" + locale.getScript());
				if (locale.getRegion()) {
					enyo.dom.addBodyClass(base + locale.getLanguage() + "-" + locale.getScript() + "-" + locale.getRegion());
				}
			} else if (locale.getRegion()) {
				enyo.dom.addBodyClass(base + locale.getLanguage() + "-" + locale.getRegion());
			}
		}
		if (locale.getScript()) {
			enyo.dom.addBodyClass(base + locale.getScript());
		}
		if (locale.getRegion()) {
			enyo.dom.addBodyClass(base + locale.getRegion());
		}
		// Recreate the case mappers to use the just-recently-set locale
	 	enyo.setCaseMappers();
   };
})();

/*
 * Reset the $L function to use ilib instead of the dummy function that enyo
 * comes with by default.
 */
$L = function (string) {
	var str;
	if (!$L.rb) {
		$L.setLocale();
	}
	if (typeof(string) === 'string') {
		if (!$L.rb) {
			return string;
		}
		str = $L.rb.getString(string);
	} else if (typeof(string) === 'object') {
		if (typeof(string.key) !== 'undefined' && typeof(string.value) !== 'undefined') {
			if (!$L.rb) {
				return string.value;
			}
			str = $L.rb.getString(string.value, string.key);
		} else {
			str = "";
		}
	} else {
		str = string;
	}
	return str.toString();
};

/**
 * Set the locale for the strings that $L loads. This may reload the
 * string resources if necessary.
 * @param {string} spec the locale specifier
 */
$L.setLocale = function (spec) {
	var locale = new ilib.Locale(spec);
	if (!$L.rb || spec !== $L.rb.getLocale().getSpec()) {
		$L.rb = new ilib.ResBundle({
			locale: locale,
			type: "html",
			name: "strings",
			sync: true,
			lengthen: true		// if pseudo-localizing, this tells it to lengthen strings
		});
	}
};

/**
 * Set CaseMapper object references to ilib's current locale (its most recently set, by default)
 */
enyo.setCaseMappers = function() {
	enyo.toLowerCase.mapper = new ilib.CaseMapper({direction: "tolower"});
	enyo.toUpperCase.mapper = new ilib.CaseMapper({direction: "toupper"});
};

/**
 * Override Enyo's toLowerCase and toUpperCase methods with these fancy ones
 * that call iLib's locale-safe case mapper.
 */
enyo.toLowerCase = function(inString) {
	if (inString != null) {
		return enyo.toLowerCase.mapper.map(inString.toString());
	}
	return inString;
};
enyo.toUpperCase = function(inString) {
	if (inString != null) {
		return enyo.toUpperCase.mapper.map(inString.toString());
	}
	return inString;
};

/**
 * This Enyo hook lets us know that the system locale has changed and gives
 * us a chance to update the iLib locale before Enyo broadcasts its
 * `onlocalechange` signal.
 * Provide an inLocale string, like "en-US" or "ja-JP", to conveniently set
 * that locale immediately. Provide nothing, and reset the locale back to the
 * browser's default language.
 */
(function(originalUpdateLocale) {
	enyo.updateLocale = function(inLocale) {
		ilib.setLocale(inLocale || navigator.language);
		$L.setLocale(inLocale || navigator.language);
		enyo.updateI18NClasses();
		originalUpdateLocale();
	};
})(enyo.updateLocale);

// we go ahead and run this once during loading of iLib settings are valid
// during the loads of later libraries.
enyo.updateLocale(null, true);
