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
		if (paths.length > 0) {
			var path = paths.shift();
			var file = "lib/enyo-ilib/ilib/locale/" + path;
			var ajax = new enyo.Ajax({url: file});
			//console.log("moondemo2: browser/async: attempting to load lib/enyo-ilib/ilib/locale/" + path);
			var resultFunc = function(inSender, json) {
				//console.log("moondemo2: " + (json ? "success" : "failed"));
				results.push((typeof(json) === 'object') ? json : undefined);
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
				//console.log("moondemo2: browser/async: attempting to load resources/" + path);
				// not there? Try the standard place instead
				var file = "resources/" + path;
				var ajax2 = new enyo.Ajax({url: file});
				
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
			// synchronous
			paths.forEach(function (path) {
				// console.log("browser/sync: attempting to load lib/enyo-ilib/ilib/locale/" + path);
				var ajax = new enyo.Ajax({
					url: "lib/enyo-ilib/ilib/locale/" + path,
					sync: true
				});
	
				var handler = function(inSender, json) {
					// console.log((json ? "success" : "failed"));
					ret.push((typeof(json) === 'object') ? json : undefined);
				};
				ajax.response(this, handler);
				ajax.error(this, function(inSender, json) {
					// console.log("browser/sync: Now attempting to load resources/" + path);
					var ajax2 = new enyo.Ajax({
						url: "resources/" + path,
						sync: true
					});
					ajax2.response(this, handler);
					ajax2.error(this, handler);
					ajax2.go();
				});
				ajax.go();
			});
		
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

	// This is temporary special code for webOS to be able to test apps with a font that works
	// in other locales. 
	var li = new ilib.LocaleInfo(); // for the current locale
	var locale = li.getLocale();
	enyo.ready(function () {
		var base = " enyo-locale-";
		if (li.getScript() !== "Latn" || locale.getLanguage() === "vi") {
			// allow enyo to define other fonts for non-Latin languages, or Vietnamese which
			// is Latin-based, but the characters with multiple accents don't appear in the
			// regular fonts, creating a strange "ransom note" look with a mix of fonts in the
			// same word. So, treat it like a non-Latin language in order to get all the characters
			// to display with the same font.
			enyo.dom.getFirstElementByTagName("body").className += base + "non-latin";
		}
		
		// allow enyo to apply right-to-left styles to the app and widgets if necessary
		// uncomment when script info is available in ilib
		//var script = new ilib.ScriptInfo(li.getDefaultScript());
		//if (script.getScriptDirection() === "rtl") {
		//	enyo.dom.getFirstElementByTagName("body").className += base + "rtl";
		//}
		
		// allow enyo or the apps to give CSS classes that are specific to the language, country, or script
		if (locale.getLanguage()) {
			enyo.dom.getFirstElementByTagName("body").className += base + locale.getLanguage();
			if (locale.getScript()) {
				enyo.dom.getFirstElementByTagName("body").className += base + locale.getLanguage() + "-" + locale.getScript();
				if (locale.getRegion()) {
					enyo.dom.getFirstElementByTagName("body").className += base + locale.getLanguage() + "-" + locale.getScript() + "-" + locale.getRegion();
				}
			} else if (locale.getRegion()) {
				enyo.dom.getFirstElementByTagName("body").className += base + locale.getLanguage() + "-" + locale.getRegion();
			} 
		}
		if (locale.getScript()) {
			enyo.dom.getFirstElementByTagName("body").className += base + locale.getScript();
		}			
		if (locale.getRegion()) {
			enyo.dom.getFirstElementByTagName("body").className += base + locale.getRegion();
		}
	});
})();

/*
 * Reset the $L function to use ilib instead of the dummy function that enyo
 * comes with by default.
 */
$L = (function() {
	var lfunc = function (string) {
		var str = $L.rb.getString(string); 
		return str.toString();
	};
	var locale = new ilib.Locale();
	lfunc.rb = new ilib.ResBundle({
		type: "html",
		name: "strings",
		missing: locale.getLanguage() === "en" ? "source" : "pseudo",
		lengthen: true		// if pseudo-localizing, this tells it to lengthen strings
	});
	return lfunc;
})();

/**
 * Set the locale for the strings that $L loads. This may reload the 
 * string resources if necessary.
 */
$L.setLocale = function (spec) {
	if (spec !== $L.rb.getLocale().getSpec()) {
		$L.rb = new ilib.ResBundle({
			locale: spec,
			type: "html",
			name: "strings",
			missing: locale.getLanguage() === "en" ? "source" : "pseudo",
			lengthen: true		// if pseudo-localizing, this tells it to lengthen strings
		});
	}
};
