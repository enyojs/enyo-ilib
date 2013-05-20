/*
 * ilibglobal.js - define the ilib name space
 * 
 * Copyright © 2012-2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @namespace The global namespace that contains all ilib functions and classes.
 */
var ilib = ilib || {};

/**
 * Return the current version of ilib.
 * 
 * @return {string} a version string for this instance of ilib
 */
ilib.getVersion = function () {
    // increment this for each release
    return "1.3";
};

/*
 * Place where resources and such are eventually assigned.
 */
ilib.data = {
    norm: {
        nfc: {},
        nfd: {},
        nfkd: {},
        ccc: {}
    }
};

if (typeof(window) !== 'undefined') {
	window["ilib"] = ilib;
}

// export ilib for use as a module in nodejs
if (typeof(exports) !== 'undefined') {
	exports.ilib = ilib;
}

/**
 * @private
 * @static
 * Return the name of the platform
 */
ilib._getPlatform = function () {
	if (!ilib._platform) {
		if (typeof(window) !== 'undefined' && typeof(PalmSystem) === 'undefined') {
			ilib._platform = "browser";
		} else if (typeof(PalmSystem) !== 'undefined') {
			ilib._platform = "webos";
		} else if (typeof(environment) !== 'undefined') {
			ilib._platform = "rhino";
		} else if (typeof(process) !== 'undefined') {
			ilib._platform = "nodejs";
		} else {
			ilib._platform = "unknown";
		}
	}	
	return ilib._platform;
};

/**
 * @static
 * Sets the default locale for all of ilib. This locale will be used
 * when no explicit locale is passed to any ilib class. If the default
 * locale is not set, ilib will attempt to use the locale of the
 * environment it is running in, if it can find that. If not, it will
 * default to the locale "en-US".<p>
 * 
 * Depends directive: !depends ilibglobal.js
 * 
 * @param {string} spec the locale specifier for the default locale
 */
ilib.setLocale = function (spec) {
    ilib.locale = spec || ilib.locale;
};

/**
 * @static
 * Return the default locale for all of ilib if one has been set. This 
 * locale will be used when no explicit locale is passed to any ilib 
 * class. If the default
 * locale is not set, ilib will attempt to use the locale of the
 * environment it is running in, if it can find that. If not, it will
 * default to the locale "en-US".<p>
 * 
 * Depends directive: !depends ilibglobal.js 
 * 
 * @return {string} the locale specifier for the default locale
 */
ilib.getLocale = function () {
	if (typeof(ilib.locale) === 'undefined') {
		if (typeof(navigator) !== 'undefined' && typeof(navigator.language) !== 'undefined') {
			// running in a browser
			ilib.locale = navigator.language;  // FF/Opera/Chrome/Webkit
			if (!ilib.locale) {
				// IE on Windows
				var lang = typeof(navigator.browserLanguage) !== 'undefined' ? 
					navigator.browserLanguage : 
					(typeof(navigator.userLanguage) !== 'undefined' ? 
						navigator.userLanguage : 
						(typeof(navigator.systemLanguage) !== 'undefined' ?
							navigator.systemLanguage :
							undefined));
				if (lang) {
					// for some reason, MS uses lower case region tags
					ilib.locale = lang.substring(0,3) + lang.substring(3,5).toUpperCase();
				}
			}
		} else if (typeof(PalmSystem) !== 'undefined' && typeof(PalmSystem.locales) !== 'undefined') {
			// webOS
			ilib.locale = PalmSystem.locales.UI;
		} else if (typeof(environment) !== 'undefined' && typeof(environment.user) !== 'undefined') {
			// running under rhino
			ilib.locale = environment.user.language + '-' + environment.user.country;
		} else if (typeof(process) !== 'undefined' && typeof(process.env) !== 'undefined') {
			// running under nodejs
			var lang = process.env.LANG || process.env.LC_ALL;
			// the LANG variable on unix is in the form "lang_REGION.CHARSET"
			// where language and region are the correct ISO codes separated by
			// an underscore. This translate it back to the BCP-47 form.
			ilib.locale = lang.substring(0,2).toLowerCase() + '-' + lang.substring(3,5).toUpperCase();
		}
			 
		ilib.locale = ilib.locale || 'en-US';
	}
    return ilib.locale;
};

/**
 * @static
 * Sets the default time zone for all of ilib. This time zone will be used when
 * no explicit time zone is passed to any ilib class. If the default time zone
 * is not set, ilib will attempt to use the time zone of the
 * environment it is running in, if it can find that. If not, it will
 * default to the the UTC zone "Etc/UTC".<p>
 * 
 * Depends directive: !depends ilibglobal.js
 * 
 * @param {string} tz the name of the time zone to set as the default time zone
 */
ilib.setTimeZone = function (tz) {
    ilib.tz = tz || ilib.tz;
};

/**
 * @static
 * Return the default time zone for all of ilib if one has been set. This 
 * time zone will be used when no explicit time zone is passed to any ilib 
 * class. If the default time zone
 * is not set, ilib will attempt to use the locale of the
 * environment it is running in, if it can find that. If not, it will
 * default to the the UTC zone "Etc/UTC".<p>
 * 
 * Depends directive: !depends ilibglobal.js
 * 
 * @return {string} the default time zone for ilib
 */
ilib.getTimeZone = function() {
	if (typeof(ilib.tz) === 'undefined') {
		if (typeof(navigator) !== 'undefined' && typeof(navigator.timezone) !== 'undefined') {
			// running in a browser
			ilib.tz = navigator.timezone;
		} else	if (typeof(PalmSystem) !== 'undefined' && typeof(PalmSystem.timezone) !== 'undefined') {
			// running in webkit on webOS
			ilib.tz = PalmSystem.timezone;
		} else if (typeof(environment) !== 'undefined' && typeof(environment.user) !== 'undefined') {
			// running under rhino
			ilib.tz = environment.user.timezone;
		} else if (typeof(process) !== 'undefined' && typeof(process.env) !== 'undefined') {
			// running in nodejs
			ilib.tz = process.env.TZ;
		}
		
		ilib.tz = ilib.tz || "Etc/UTC"; 
	}

    return ilib.tz;
};

/**
 * @static
 * Define a callback function for loading missing locale data or resources.
 * If this copy of ilib is assembled without including the required locale data
 * or resources, then that data can be lazy loaded dynamically when it is 
 * needed by calling this callback function. Each ilib class will first
 * check for the existence of data under ilib.data, and if it is not there, 
 * it will attempt to load it by calling this loader function, and then place
 * it there.<p>
 * 
 * Suggested implementations of the callback function might be to load files 
 * directly from disk under nodejs or rhino, or within web pages, to load 
 * files from the server with XHR calls.<p>
 * 
 * The expected API for the call back is:
 * 
 * <pre>
 * function(paths, sync, params, callback) {}
 * </pre>
 * 
 * The first parameter to the callback
 * function, paths, is an array of relative paths within the ilib dir structure for the 
 * requested data. These paths will already have the locale spec integrated 
 * into them, so no further tweaking needs to happen to load the data. Simply
 * load the named files. The second
 * parameter tells the loader whether to load the files synchronously or asynchronously.
 * If the sync parameters is false, then the onLoad function must also be specified.
 * The third parameter gives extra parameters to the loader passed from the calling
 * code. This may contain any property/value pairs.  The last parameter, callback,
 * is a callback function to call when all of the data is finishing loading. Make
 * sure to call the callback with the context of "this" so that the caller has their 
 * context back again.<p>
 * 
 * The loader function must be able to operate either synchronously or asychronously. 
 * If the loader function is called with an undefined callback function, it is
 * expected to load the data synchronously, convert it to javascript
 * objects, and return the array of json objects as the return value of the 
 * function. If the loader 
 * function is called with a callback function, it may load the data 
 * synchronously or asynchronously (doesn't matter which) as long as it calls
 * the callback function with the data converted to a javascript objects
 * when it becomes available. If a particular file could not be loaded, the 
 * loader function should put undefined into the corresponding entry in the
 * results array. 
 * Note that it is important that all the data is loaded before the callback
 * is called.<p>
 * 
 * An example implementation for nodejs might be:
 * 
 * <pre>
 * function loadFiles(context, paths, results, callback) {
 *    if (paths.length > 0) {
 *        var file = paths.shift();
 *        fs.readFile(file, "utf-8", function(err, json) {
 *            results.push(err ? undefined : JSON.parse(json));
 *            if (paths.length > 0) {
 *                loadFiles(context, paths, results, callback);
 *            } else {
 *                callback.call(context, results);
 *            }
 *        });
 *     }
 * }
 * // bind to "this" so that "this" is relative to your own instance
 * ilib.setLoaderCallback(ilib.bind(this, function(paths, sync, params, callback) {
 *    if (sync) {
 *        var ret = [];
 *        // synchronous
 *        paths.forEach(function (path) {
 *            var json = fs.readFileSync(path, "utf-8");
 *            ret.push(json ? JSON.parse(json) : undefined);
 *        });
 *        
 *        return ret;
 *    }
 *
 *    // asynchronous
 *    var results = [];
 *    loadFiles(this, paths, results, callback);
 * }));
 * </pre>
 * 
 * @param {function(Array.<string>,Boolean,Object,function(Object))} loader function to call to 
 * load the requested data.
 * @return {boolean} true if the loader was installed correctly, or false
 * if not
 */
ilib.setLoaderCallback = function(loader) {
    // only a basic check
    if (typeof(loader) !== 'function') {
        return false;
    }
    ilib._load = loader;
    return true;
};

/*
 * locale.js - Locale specifier definition
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js

/**
 * @class
 * Create a new locale instance. Locales are specified either with a specifier string 
 * that follows the BCP-47 convention (roughly: "language-region-script-variant") or 
 * with 4 parameters that specify the language, region, variant, and script individually.<p>
 * 
 * The language is given as an ISO 639-1 two-letter, lower-case language code. You
 * can find a full list of these codes at 
 * <a href="http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes">http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes</a><p>
 * 
 * The region is given as an ISO 3166-1 two-letter, upper-case region code. You can
 * find a full list of these codes at 
 * <a href="http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2</a>.<p>
 * 
 * The variant is any string that does not contain a dash which further differentiates
 * locales from each other.<p>
 * 
 * The script is given as the ISO 15924 four-letter script code. In some locales,
 * text may be validly written in more than one script. For example, Serbian is often
 * written in both Latin and Cyrillic, though not usually mixed together. You can find a
 * full list of these codes at 
 * <a href="http://en.wikipedia.org/wiki/ISO_15924#List_of_codes">http://en.wikipedia.org/wiki/ISO_15924#List_of_codes</a>.<p>
 * 
 * As an example in ilib, the script can be used in the date formatter. Dates formatted 
 * in Serbian could have day-of-week names or month names written in the Latin
 * or Cyrillic script. Often one script is default such that sr-SR-Latn is the same
 * as sr-SR so the script code "Latn" can be left off of the locale spec.<p> 
 * 
 * Each part is optional, and an empty string in the specifier before or after a 
 * dash or as a parameter to the constructor denotes an unspecified value. In this
 * case, many of the ilib functions will treat the locale as generic. For example
 * the locale "en-" is equivalent to "en" and to "en--" and denotes a locale
 * of "English" with an unspecified region and variant, which typically matches
 * any region or variant.<p>
 * 
 * Without any arguments to the constructor, this function returns the locale of
 * the host Javascript engine.<p>
 * 
 * Depends directive: !depends locale.js
 * 
 * @constructor
 * @param {?string=} language the ISO 639 2-letter code for the language, or a full 
 * locale spec in BCP-47 format
 * @param {string=} region the ISO 3166 2-letter code for the region
 * @param {string=} variant the name of the variant of this locale, if any
 * @param {string=} script the ISO 15924 code of the script for this locale, if any
 */
ilib.Locale = function(language, region, variant, script) {
	if (typeof(region) === 'undefined') {
		var spec = language || ilib.getLocale();
		var parts = spec.split('-');
        for ( var i = 0; i < parts.length; i++ ) {
        	if (ilib.Locale._isLanguageCode(parts[i])) {
    			/** 
    			 * @private
    			 * @type {string|undefined}
    			 */
        		this.language = parts[i];
        	} else if (ilib.Locale._isRegionCode(parts[i])) {
    			/** 
    			 * @private
    			 * @type {string|undefined}
    			 */
        		this.region = parts[i];
        	} else if (ilib.Locale._isScriptCode(parts[i])) {
    			/** 
    			 * @private
    			 * @type {string|undefined}
    			 */
        		this.script = parts[i];
        	} else {
    			/** 
    			 * @private
    			 * @type {string|undefined}
    			 */
        		this.variant = parts[i];
        	}
        }
        this.language = this.language || undefined;
        this.region = this.region || undefined;
        this.script = this.script || undefined;
        this.variant = this.variant || undefined;
	} else {
		if (language) {
			language = language.trim();
			this.language = language.length > 0 ? language.toLowerCase() : undefined;
		} else {
			this.language = undefined;
		}
		if (region) {
			region = region.trim();
			this.region = region.length > 0 ? region.toUpperCase() : undefined;
		} else {
			this.region = undefined;
		}
		if (variant) {
			variant = variant.trim();
			this.variant = variant.length > 0 ? variant : undefined;
		} else {
			this.variant = undefined;
		}
		if (script) {
			script = script.trim();
			this.script = script.length > 0 ? script : undefined;
		} else {
			this.script = undefined;
		}
	}
	this.spec = this.language || "";
	
	if (this.script) {
		if (this.spec.length > 0) {
			this.spec += "-";
		}
		this.spec += this.script;
	}
	
	if (this.region) {
		if (this.spec.length > 0) {
			this.spec += "-";
		}
		this.spec += this.region;
	}
	
	if (this.variant) {
		if (this.spec.length > 0) {
			this.spec += "-";
		}
		this.spec += this.variant;
	}
};

/**
 * @private
 * Tell whether or not the str does not start with a lower case ASCII char.
 * @param {string} str the char to check
 * @return {boolean} true if the char is not a lower case ASCII char
 */
ilib.Locale._notLower = function(str) {
	// do this with ASCII only so we don't have to depend on the CType functions
	var ch = str.charCodeAt(0);
	return ch < 97 || ch > 122;
};

/**
 * @private
 * Tell whether or not the str does not start with an upper case ASCII char.
 * @param {string} str the char to check
 * @return {boolean} true if the char is a not an upper case ASCII char
 */
ilib.Locale._notUpper = function(str) {
	// do this with ASCII only so we don't have to depend on the CType functions
	var ch = str.charCodeAt(0);
	return ch < 65 || ch > 90;
};

/**
 * @private
 * Tell whether or not the str does not start with a digit char.
 * @param {string} str the char to check
 * @return {boolean} true if the char is a not an upper case ASCII char
 */
ilib.Locale._notDigit = function(str) {
	// do this with ASCII only so we don't have to depend on the CType functions
	var ch = str.charCodeAt(0);
	return ch < 48 || ch > 57;
};

/**
 * @private
 * Tell whether or not the given string has the correct syntax to be 
 * an ISO 639 language code.
 * 
 * @param {string} str the string to parse
 * @return {boolean} true if the string could syntactically be a language code.
 */
ilib.Locale._isLanguageCode = function(str) {
	if (typeof(str) === 'undefined' || str.length < 2 || str.length > 3) {
		return false;
	}

	for (var i = 0; i < str.length; i++) {
		if (ilib.Locale._notLower(str.charAt(i))) {
			return false;
		}
	}
	
	return true;
};

/**
 * @private
 * Tell whether or not the given string has the correct syntax to be 
 * an ISO 3166 2-letter region code or M.49 3-digit region code.
 * 
 * @param {string} str the string to parse
 * @return {boolean} true if the string could syntactically be a language code.
 */
ilib.Locale._isRegionCode = function (str) {
	if (typeof(str) === 'undefined' || str.length < 2 || str.length > 3) {
		return false;
	}
	
	if (str.length === 2) {
		for (var i = 0; i < str.length; i++) {
			if (ilib.Locale._notUpper(str.charAt(i))) {
				return false;
			}
		}
	} else {
		for (var i = 0; i < str.length; i++) {
			if (ilib.Locale._notDigit(str.charAt(i))) {
				return false;
			}
		}
	}
	
	return true;
};

/**
 * @private
 * Tell whether or not the given string has the correct syntax to be 
 * an ISO 639 language code.
 * 
 * @param {string} str the string to parse
 * @return {boolean} true if the string could syntactically be a language code.
 */
ilib.Locale._isScriptCode = function(str)
{
	if (typeof(str) === 'undefined' || str.length !== 4 || ilib.Locale._notUpper(str.charAt(0))) {
		return false;
	}
	
	for (var i = 1; i < 4; i++) {
		if (ilib.Locale._notLower(str.charAt(i))) {
			return false;
		}
	}
	
	return true;
};

ilib.Locale.prototype = {
	/**
	 * Return the ISO 639 language code for this locale. 
	 * @return {string|undefined} the language code for this locale 
	 */
	getLanguage: function() {
		return this.language;
	},
	
	/**
	 * Return the ISO 3166 region code for this locale.
	 * @return {string|undefined} the region code of this locale
	 */
	getRegion: function() {
		return this.region;
	},
	
	/**
	 * Return the ISO 15924 script code for this locale
	 * @return {string|undefined} the script code of this locale
	 */
	getScript: function () {
		return this.script;
	},
	
	/**
	 * Return the variant code for this locale
	 * @return {string|undefined} the variant code of this locale, if any
	 */
	getVariant: function() {
		return this.variant;
	},
	
	/**
	 * Return the whole locale specifier as a string.
	 * @return {string} the locale specifier
	 */
	getSpec: function() {
		return this.spec;
	},
	
	/**
	 * Express this locale object as a string. Currently, this simply calls the getSpec
	 * function to represent the locale as its specifier.
	 * 
	 * @return {string} the locale specifier
	 */
	toString: function() {
		return this.getSpec();
	},
	
	/**
	 * Return true if the the other locale is exactly equal to the current one.
	 * @return {boolean} whether or not the other locale is equal to the current one 
	 */
	equals: function(other) {
		return this.language === other.language &&
			this.region === other.region &&
			this.script === other.script &&
			this.variant === other.variant;
	},

	/**
	 * Return true if the current locale is the special pseudo locale.
	 * @return {boolean} true if the current locale is the special pseudo locale
	 */
	isPseudo: function () {
		return (this.language === 'zxx' && this.region === 'XX');
	}
};

// static functions
/**
 * @private
 */
ilib.Locale.locales = [
	""
];

/**
 * Return the list of available locales that this iLib file was assembled
 * with. The list that this file was assembled with may be much smaller
 * than the list of all available locales in the iLib repository. The
 * assembly tool will automatically fill in the list.
 * 
 * @return {Array.<string>} this is an array of locale specs for which 
 * this iLib file has locale data for
 */
ilib.Locale.getAvailableLocales = function () {
	return ilib.Locale.locales;
};
/*
 * date.js - Represent a date in any calendar. This class is subclassed for each calendar.
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends ilibglobal.js */

/**
 * @class
 * Construct a new date object. Each parameter is a numeric value, but its 
 * accepted range can vary depending on the subclass of this date. For example,
 * Gregorian months can be from 1 to 12, whereas months in the Hebrew calendar
 * can be from 1 to 13.<p>
 * 
 * Depends directive: !depends date.js
 * 
 * @constructor
 * @param {Object=} options The date components to initialize this date with
 */
ilib.Date = function(options) {
	this.year = options && options.year || 0;
	this.month = options && options.month || 1;
	this.day = options && options.day || 1;
	this.hour = options && options.hour || 0;
	this.minute = options && options.minute || 0;
	this.second = options && options.second || 0;
	this.millisecond = options && options.millisecond || 0;
};

/**
 * Factory method to create a new instance of a date subclass.<p>
 * 
 * The options parameter can be an object that contains the following
 * properties:
 * 
 * <ul>
 * <li><i>type</i> - specify the type of the date desired. The
 * list of valid values changes depending on which calendars are 
 * defined. When assembling your iliball.js, include those date type 
 * you wish to use in your program or web page, and they will register 
 * themselves with this factory method. The "gregorian",
 * and "julian" calendars are all included by default, as they are the
 * standard calendars for much of the world.
 * </ul>
 * 
 * The options object is also passed down to the date constructor, and 
 * thus can contain the same properties as the date object being instantiated.
 *  
 * @param {Object=} options options controlling the construction of this instance, or
 * undefined to use the default options
 * @return {ilib.Date} an instance of a calendar object of the appropriate type 
 */
ilib.Date.newInstance = function(options) {
	var locale = options && options.locale,
		type = options && options.type,
		cons;

	if (!locale) {
		locale = new ilib.Locale();	// default locale
	}
	
	if (!type) {
		var info = new ilib.LocaleInfo(locale);
		type = info.getCalendar();
	}

	cons = ilib.Date._constructors[type];
	
	// pass the same options through to the constructor so the subclass
	// has the ability to do something with if it needs to
	return cons && new cons(options);
};

/* place for the subclasses to put their constructors so that the factory method
 * can find them. Do this to add your date after it's defined: 
 * ilib.Date._constructors["mytype"] = ilib.Date.MyTypeConstructor;
 */
ilib.Date._constructors = {};

ilib.Date.prototype = {
	getType: function() {
		return "ilib.Date";
	},
	
	getDays: function() {
		return this.day;
	},
	getMonths: function() {
		return this.month;
	},
	getYears: function() {
		return this.year;
	},
	
	getHours: function() {
		return this.hour;
	},
	getMinutes: function() {
		return this.minute;
	},
	getSeconds: function() {
		return this.second;
	},
	getMilliseconds: function() {
		return this.millisecond;
	},

	setDays: function(day) {
		this.day = day;
	},
	setMonths: function(month) {
		this.month = month;
	},
	setYears: function(year) {
		this.year = year;
	},
	
	setHours: function(hour) {
		this.hour = hour;
	},
	setMinutes: function(minute) {
		this.minute = minute;
	},
	setSeconds: function(second) {
		this.second = second;
	},
	setMilliseconds: function(milli) {
		this.millisecond = milli;
	}
};

/*
 * util/utils.js - Misc utility routines
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js

/**
 * If Function.prototype.bind does not exist in this JS engine, this
 * function reimplements it in terms of older JS functions.
 * bind() doesn't exist in many older browsers.
 * 
 * @param {Object} scope object that the method should operate on
 * @param {function(?)} method method to call
 * @return {function(?)|undefined} function that calls the given method 
 * in the given scope with all of its arguments properly attached, or
 * undefined if there was a problem with the arguments
 */
ilib.bind = function(scope, method/*, bound arguments*/){
	if (!scope || !method) {
		return undefined;
	}
	
	/** @protected 
	 * @param {Arguments} inArrayLike
	 * @param {number=} inOffset
	 */
	function cloneArray(inArrayLike, inOffset) {
		var arr = [];
		for(var i = inOffset || 0, l = inArrayLike.length; i<l; i++){
			arr.push(inArrayLike[i]);
		}
		return arr;
	}

	if (typeof(method) === 'function') {
		var func, args = cloneArray(arguments, 2);
		if (typeof(method.bind) === 'function') {
			func = method.bind.apply(method, [scope].concat(args));
		} else {
			func = function() {
				var nargs = cloneArray(arguments);
				// invoke with collected args
				return method.apply(scope, args.concat(nargs));
			};
		}
		return func;
	}
	return undefined;
};

/**
 * Binary search a sorted array for a particular target value.
 * If the exact value is not found, it returns the index of the smallest 
 * entry that is greater than the given target value.<p> 
 * 
 * The comparator
 * parameter is a function that knows how to compare elements of the 
 * array and the target. The function should return a value greater than 0
 * if the array element is greater than the target, a value less than 0 if
 * the array element is less than the target, and 0 if the array element 
 * and the target are equivalent.<p>
 * 
 * If the comparator function is not specified, this function assumes
 * the array and the target are numeric values and should be compared 
 * as such.<p>
 * 
 * Depends directive: !depends utils.js
 * 
 * 
 * @param {*} target element being sought 
 * @param {Array} arr the array being searched
 * @param {?function(*,*)=} comparator a comparator that is appropriate for comparing two entries
 * in the array  
 * @return the index of the array into which the value would fit if 
 * inserted, or -1 if given array is not an array or the target is not 
 * a number
 */
ilib.bsearch = function(target, arr, comparator) {
	if (typeof(arr) === 'undefined' || !arr || typeof(target) === 'undefined') {
		return -1;
	}
	
	var high = arr.length - 1,
		low = 0,
		mid = 0,
		value,
		cmp = comparator || ilib.bsearch.numbers;
	
	while (low <= high) {
		mid = Math.floor((high+low)/2);
		value = cmp(arr[mid], target);
		if (value > 0) {
			high = mid - 1;
		} else if (value < 0) {
			low = mid + 1;
		} else {
			return mid;
		}
	}
	
	return low;
};

/**
 * @private
 * Returns whether or not the given element is greater than, less than,
 * or equal to the given target.<p>
 * 
 * Depends directive: !depends utils.js
 * 
 * @param {number} element the element being tested
 * @param {number} target the target being sought
 */
ilib.bsearch.numbers = function(element, target) {
	return element - target;
};

/**
 * Do a proper modulo function. The Javascript % operator will give the truncated
 * division algorithm, but for calendrical calculations, we need the Euclidean
 * division algorithm where the remainder of any division, whether the dividend
 * is negative or not, is always a positive number between 0 and the modulus.<p>
 * 
 * Depends directive: !depends utils.js
 * 
 * @param {number} dividend the number being divided
 * @param {number} modulus the number dividing the dividend. This should always be a positive number.
 * @return the remainder of dividing the dividend by the modulus.  
 */
ilib.mod = function (dividend, modulus) {
	if (modulus == 0) {
		return 0;
	}
	var x = dividend % modulus;
	return (x < 0) ? x + modulus : x;
};

/**
 * Merge the properties of object2 into object1 in a deep manner and return a merged
 * object. If the property exists in both objects, the value in object2 will overwrite 
 * the value in object1. If a property exists in object1, but not in object2, its value
 * will not be touched. If a property exists in object2, but not in object1, it will be 
 * added to the merged result.<p>
 * 
 * Name1 and name2 are for creating debug output only. They are not necessary.<p>
 * 
 * Depends directive: !depends utils.js
 * 
 * @param {*} object1 the object to merge into
 * @param {*} object2 the object to merge
 * @param {string=} name1 name of the object being merged into
 * @param {string=} name2 name of the object being merged in
 * @return {Object} the merged object
 */
ilib.merge = function (object1, object2, name1, name2) {
	var prop = undefined,
		newObj = {};
	for (prop in object1) {
		if (prop && typeof(object1[prop]) !== 'undefined') {
			newObj[prop] = object1[prop];
		}
	}
	for (prop in object2) {
		if (prop && typeof(object2[prop]) !== 'undefined') {
			if (object1[prop] instanceof Array && object2[prop] instanceof Array) {
				newObj[prop] = new Array();
				newObj[prop] = newObj[prop].concat(object1[prop]);
				newObj[prop] = newObj[prop].concat(object2[prop]);
			} else if (typeof(object1[prop]) === 'object' && typeof(object2[prop]) === 'object') {
				newObj[prop] = ilib.merge(object1[prop], object2[prop]);
			} else {
				// for debugging. Used to determine whether or not json files are overriding their parents unnecessarily
				if (name1 && name2 && newObj[prop] == object2[prop]) {
					console.log("Property " + prop + " in " + name1 + " is being overridden by the same value in " + name2);
				}
				newObj[prop] = object2[prop];
			}
		}
	}
	return newObj;
};

/**
 * Find and merge all the locale data for a particular prefix in the given locale
 * and return it as a single javascript object. This merges the data in the 
 * correct order:
 * 
 * <ol>
 * <li>shared data (usually English)
 * <li>data for language
 * <li>data for language + region
 * <li>data for language + region + script
 * <li>data for language + region + script + variant
 * </ol>
 * 
 * It is okay for any of the above to be missing. This function will just skip the 
 * missing data. However, if everything except the shared data is missing, this 
 * function returns undefined, allowing the caller to go and dynamically load the
 * data instead.
 *  
 * @param {string} prefix prefix under ilib.data of the data to merge
 * @param {ilib.Locale} locale locale of the data being sought
 * @return {Object?} the merged locale data
 */
ilib.mergeLocData = function (prefix, locale) {
	var data = undefined;
	var loc = locale || new ilib.Locale();
	var foundLocaleData = false;
	var property = prefix;
	data = ilib.data[prefix] || {};
	
	if (loc.getLanguage()) {
		property = prefix + '_' + loc.getLanguage();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property]);
		}
	}
	
	if (loc.getRegion()) {
		property = prefix + '_' + loc.getRegion();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property]);
		}
	}
	
	if (loc.getLanguage()) {
		property = prefix + '_' + loc.getLanguage();
		
		if (loc.getScript()) {
			property = prefix + '_' + loc.getLanguage() + '_' + loc.getScript();
			if (ilib.data[property]) {
				foundLocaleData = true;
				data = ilib.merge(data, ilib.data[property]);
			}
		}
		
		if (loc.getRegion()) {
			property = prefix + '_' + loc.getLanguage() + '_' + loc.getRegion();
			if (ilib.data[property]) {
				foundLocaleData = true;
				data = ilib.merge(data, ilib.data[property]);
			}
		}
		
	}
	
	if (loc.getRegion() && loc.getVariant()) {
		property = prefix + '_' + loc.getLanguage() + '_' + loc.getVariant();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property]);
		}
	}

	if (loc.getLanguage() && loc.getScript() && loc.getRegion()) {
		property = prefix + '_' + loc.getLanguage() + '_' + loc.getScript() + '_' + loc.getRegion();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property]);
		}
	}

	if (loc.getLanguage() && loc.getRegion() && loc.getVariant()) {
		property = prefix + '_' + loc.getLanguage() + '_' + loc.getRegion() + '_' + loc.getVariant();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property]);
		}
	}

	if (loc.getLanguage() && loc.getScript() && loc.getRegion() && loc.getVariant()) {
		property = prefix + '_' + loc.getLanguage() + '_' + loc.getScript() + '_' + loc.getRegion() + '_' + loc.getVariant();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property]);
		}
	}

	return foundLocaleData ? data : undefined;
};

/**
 * Return an array of relative path names for the json
 * files that represent the data for the given locale. Only
 * language and region are top-level directories.<p>
 * 
 * Note that to prevent the situation where a directory for
 * a language exists next to the directory for a region where
 * the language code and region code differ only by case, the 
 * plain region directories are located under the special 
 * "undefined" language directory which has the ISO code "und".
 * The reason is that some platforms have case-insensitive 
 * file systems, and you cannot have 2 directories with the 
 * same name which only differ by case. For example, "es" is
 * the ISO 639 code for the language "Spanish" and "ES" is
 * the ISO 3166 code for the region "Spain", so both the
 * directories cannot exist underneath "locale". The region
 * therefore will be loaded from "und/ES" instead.<p>  
 * 
 * Variations
 * 
 * only language and region specified:
 * 
 * language
 * region
 * language/region
 * 
 * only language and script specified:
 * 
 * language
 * language/script
 * 
 * only script and region specified:
 * 
 * region
 * 
 * only region and variant specified:
 * 
 * region
 * region/variant
 *
 * only language, script, and region specified:
 * 
 * language
 * region
 * language/script
 * language/region
 * language/script/region
 * 
 * only language, region, and variant specified:
 * 
 * language
 * region
 * language/region
 * region/variant
 * language/region/variant
 * 
 * all parts specified:
 * 
 * language
 * region
 * language/script
 * language/region
 * region/variant
 * language/script/region
 * language/region/variant
 * language/script/region/variant
 * 
 * @param {ilib.Locale} locale load the json files for this locale
 * @param {string?} basename the base name of each json file to load
 * @return {Array.<string>} An array of relative path names
 * for the json files that contain the locale data
 */
ilib.getLocFiles = function(locale, basename) {
	var dir = "";
	var files = [];
	var filename = basename || "resources";
	filename += ".json";
	var loc = locale || new ilib.Locale();
	
	var language = loc.getLanguage();
	var region = loc.getRegion();
	var script = loc.getScript();
	var variant = loc.getVariant();
	
	files.push(filename); // generic shared file
	
	if (language) {
		dir = language + "/";
		files.push(dir + filename);
	}
	
	if (region) {
		dir = "und/" + region + "/";
		files.push(dir + filename);
	}
	
	if (language) {
		if (script) {
			dir = language + "/" + script + "/";
			files.push(dir + filename);
		}
		if (region) {
			dir = language + "/" + region + "/";
			files.push(dir + filename);
		}
	}
	
	if (region && variant) {
		dir = "und/" + region + "/" + variant + "/";
		files.push(dir + filename);
	}

	if (language && script && region) {
		dir = language + "/" + script + "/" + region + "/";
		files.push(dir + filename);
	}

	if (language && region && variant) {
		dir = language + "/" + region + "/" + variant + "/";
		files.push(dir + filename);
	}

	if (language && script && region && variant) {
		dir = language + "/" + script + "/" + region + "/" + variant + "/";
		files.push(dir + filename);
	}
	
	return files;
};

/**
 * Return true if the given object has no properties.<p>
 * 
 * Depends directive: !depends utils.js
 * 
 * @param {Object} obj the object to check
 * @return {boolean} true if the given object has no properties, false otherwise
 */
ilib.isEmpty = function (obj) {
	var prop = undefined;
	
	if (!obj) {
		return true;
	}
	
	for (prop in obj) {
		if (prop && obj[prop]) {
			return false;
		}
	}
	return true;
};


/**
 * Perform a shallow copy of the source object to the target object. This only 
 * copies the assignments of the source properties to the target properties, 
 * but not recursively from there.<p>
 * 
 * Depends directive: !depends utils.js
 * 
 * @param {Object} source the source object to copy properties from
 * @param {Object} target the target object to copy properties into
 */
ilib.shallowCopy = function (source, target) {
	var prop = undefined;
	if (source && target) {
		for (prop in source) {
			if (prop !== undefined && source[prop]) {
				target[prop] = source[prop];
			}
		}
	}
};

/**
 * Return the sign of the given number. If the sign is negative, this function
 * returns -1. If the sign is positive or zero, this function returns 1.
 * @param {number} num the number to test
 * @return {number} -1 if the number is negative, and 1 otherwise
 */
ilib.signum = function (num) {
	var n = num;
	if (typeof(num) === 'string') {
		n = parseInt(num, 10);
	} else if (typeof(num) !== 'number') {
		return 1;
	}
	return (n < 0) ? -1 : 1;
};


/**
 * @private
 */
ilib._roundFnc = {
	/**
	 * @private
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	floor: function (num) {
		return Math.floor(num);
	},
	
	/**
	 * @private
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	ceiling: function (num) {
		return Math.ceil(num);
	},
	
	/**
	 * @private
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	down: function (num) {
		return (num < 0) ? Math.ceil(num) : Math.floor(num);
	},
	
	/**
	 * @private
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	up: function (num) {
		return (num < 0) ? Math.floor(num) : Math.ceil(num);
	},
	
	/**
	 * @private
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	halfup: function (num) {
		return (num < 0) ? Math.ceil(num - 0.5) : Math.floor(num + 0.5);
	},
	
	/**
	 * @private
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	halfdown: function (num) {
		return (num < 0) ? Math.floor(num + 0.5) : Math.ceil(num - 0.5);
	},
	
	/**
	 * @private
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	halfeven: function (num) {
		return (Math.floor(num) % 2 === 0) ? Math.ceil(num - 0.5) : Math.floor(num + 0.5);
	},
	
	/**
	 * @private
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	halfodd: function (num) {
		return (Math.floor(num) % 2 !== 0) ? Math.ceil(num - 0.5) : Math.floor(num + 0.5);
	}
};


/**
 * Find locale data or load it in. If the data with the given name is preassembled, it will
 * find the data in ilib.data. If the data is not preassembled but there is a loader function,
 * this function will call it to load the data. Otherwise, the callback will be called with
 * undefined as the data. This function will create a cache under the given class object.
 * If data was successfully loaded, it will be set into the cache so that future access to 
 * the same data for the same locale is much quicker. 
 * 
 * @param {Object} object The class attempting to load data. The cache is stored inside of here.
 * @param {ilib.Locale} locale The locale to use to find or load the data.
 * @param {string} name The name of the locale data to load.
 * @param {boolean} sync Whether or not to load the data synchronouslyo
 * @param {Object} params An object with parameters to pass to the loader function
 * @param {function(?)=} callback Call back function to call when the data is available.
 */
ilib.loadData = function(object, locale, name, sync, params, callback) {
	if (!object.cache) {
		object.cache = {};
	}

	var spec = locale.getSpec().replace(/-/g, '_');
	if (typeof(object.cache[spec]) === 'undefined') {
		var data = ilib.mergeLocData(name, locale);
		if (data) {
			object.cache[spec] = data;
			callback(data);
		} else if (typeof(ilib._load) === 'function') {
			// the data is not preassembled, so attempt to load it dynamically
			var files = ilib.getLocFiles(locale, name);
			
			ilib._load(files, sync, params, ilib.bind(this, function(arr) {
				data = {};
				for (var i = 0; i < arr.length; i++) {
					if (typeof(arr[i]) !== 'undefined') {
						data = ilib.merge(data, arr[i]);
					}
				}
				
				callback(data);
			}));
		} else {
			// no data other than the generic shared data
			callback(data);
		}
	} else {
		callback(object.cache[spec]);
	}
};


ilib.data.plurals = {
    "version": {
        "@number": "$Revision: 7657 $"
    },
    "generation": {
        "@date": "$Date: 2012-08-29 13:20:56 -0500 (Wed, 29 Aug 2012) $"
    },
    "plurals": {
        "az": "",
        "bm": "",
        "bo": "",
        "dz": "",
        "fa": "",
        "id": "",
        "ig": "",
        "ii": "",
        "hu": "",
        "ja": "",
        "jv": "",
        "ka": "",
        "kde": "",
        "kea": "",
        "km": "",
        "kn": "",
        "ko": "",
        "lo": "",
        "ms": "",
        "my": "",
        "sah": "",
        "ses": "",
        "sg": "",
        "th": "",
        "to": "",
        "tr": "",
        "vi": "",
        "wo": "",
        "yo": "",
        "zh": "",
        "af": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ak": {
            "one": {
                "inrange": [
                    "n",
                    [
                        [0,1]
                    ]
                ]
            }
        },
        "am": {
            "one": {
                "inrange": [
                    "n",
                    [
                        [0,1]
                    ]
                ]
            }
        },
        "ar": {
            "few": {
                "inrange": [
                    {
                        "mod": [
                            "n",
                            100
                        ]
                    },
                    [
                        [3,10]
                    ]
                ]
            },
            "many": {
                "inrange": [
                    {
                        "mod": [
                            "n",
                            100
                        ]
                    },
                    [
                        [11,99]
                    ]
                ]
            },
            "one": {
                "is": [
                    "n",
                    1
                ]
            },
            "two": {
                "is": [
                    "n",
                    2
                ]
            },
            "zero": {
                "is": [
                    "n",
                    0
                ]
            }
        },
        "asa": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ast": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "be": {
            "few": {
                "and": [
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            [
                                [2,4]
                            ]
                        ]
                    },
                    {
                        "notin": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [12,14]
                            ]
                        ]
                    }
                ]
            },
            "many": {
                "or": [
                    {
                        "or": [
                            {
                                "is": [
                                    {
                                        "mod": [
                                            "n",
                                            10
                                        ]
                                    },
                                    0
                                ]
                            },
                            {
                                "inrange": [
                                    {
                                        "mod": [
                                            "n",
                                            10
                                        ]
                                    },
                                    [
                                        [5,9]
                                    ]
                                ]
                            }
                        ]
                    },
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [11,14]
                            ]
                        ]
                    }
                ]
            },
            "one": {
                "and": [
                    {
                        "is": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            1
                        ]
                    },
                    {
                        "isnot": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            11
                        ]
                    }
                ]
            }
        },
        "bem": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "bez": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "bg": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "bh": {
            "one": {
                "inrange": [
                    "n",
                    [
                        [0,1]
                    ]
                ]
            }
        },
        "bn": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "br": {
            "few": {
                "and": [
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            [
                                [3,4],
                                9
                            ]
                        ]
                    },
                    {
                        "notin": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [10,19],
                                [70,79],
                                [90,99]
                            ]
                        ]
                    }
                ]
            },
            "many": {
                "and": [
                    {
                        "isnot": [
                            "n",
                            0
                        ]
                    },
                    {
                        "is": [
                            {
                                "mod": [
                                    "n",
                                    1000000
                                ]
                            },
                            0
                        ]
                    }
                ]
            },
            "one": {
                "and": [
                    {
                        "is": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            1
                        ]
                    },
                    {
                        "notin": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                11,
                                71,
                                91
                            ]
                        ]
                    }
                ]
            },
            "two": {
                "and": [
                    {
                        "is": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            2
                        ]
                    },
                    {
                        "notin": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                12,
                                72,
                                92
                            ]
                        ]
                    }
                ]
            }
        },
        "brx": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "bs": {
            "few": {
                "and": [
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            [
                                [2,4]
                            ]
                        ]
                    },
                    {
                        "notin": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [12,14]
                            ]
                        ]
                    }
                ]
            },
            "many": {
                "or": [
                    {
                        "or": [
                            {
                                "is": [
                                    {
                                        "mod": [
                                            "n",
                                            10
                                        ]
                                    },
                                    0
                                ]
                            },
                            {
                                "inrange": [
                                    {
                                        "mod": [
                                            "n",
                                            10
                                        ]
                                    },
                                    [
                                        [5,9]
                                    ]
                                ]
                            }
                        ]
                    },
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [11,14]
                            ]
                        ]
                    }
                ]
            },
            "one": {
                "and": [
                    {
                        "is": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            1
                        ]
                    },
                    {
                        "isnot": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            11
                        ]
                    }
                ]
            }
        },
        "ca": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "cgg": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "chr": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ckb": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "cs": {
            "few": {
                "inrange": [
                    "n",
                    [
                        [2,4]
                    ]
                ]
            },
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "cy": {
            "few": {
                "is": [
                    "n",
                    3
                ]
            },
            "many": {
                "is": [
                    "n",
                    6
                ]
            },
            "one": {
                "is": [
                    "n",
                    1
                ]
            },
            "two": {
                "is": [
                    "n",
                    2
                ]
            },
            "zero": {
                "is": [
                    "n",
                    0
                ]
            }
        },
        "da": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "de": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "dv": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ee": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "el": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "en": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "eo": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "es": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "et": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "eu": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ff": {
            "one": {
                "and": [
                    {
                        "within": [
                            "n",
                            [
                                [0,2]
                            ]
                        ]
                    },
                    {
                        "isnot": [
                            "n",
                            2
                        ]
                    }
                ]
            }
        },
        "fi": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "fil": {
            "one": {
                "inrange": [
                    "n",
                    [
                        [0,1]
                    ]
                ]
            }
        },
        "fo": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "fr": {
            "one": {
                "and": [
                    {
                        "within": [
                            "n",
                            [
                                [0,2]
                            ]
                        ]
                    },
                    {
                        "isnot": [
                            "n",
                            2
                        ]
                    }
                ]
            }
        },
        "fur": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "fy": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ga": {
            "few": {
                "inrange": [
                    "n",
                    [
                        [3,6]
                    ]
                ]
            },
            "many": {
                "inrange": [
                    "n",
                    [
                        [7,10]
                    ]
                ]
            },
            "one": {
                "is": [
                    "n",
                    1
                ]
            },
            "two": {
                "is": [
                    "n",
                    2
                ]
            }
        },
        "gd": {
            "few": {
                "inrange": [
                    "n",
                    [
                        [
                            [3,10]
                        ],
                        [
                            [13,19]
                        ]
                    ]
                ]
            },
            "one": {
                "inrange": [
                    "n",
                    [
                        1,
                        11
                    ]
                ]
            },
            "two": {
                "inrange": [
                    "n",
                    [
                        2,
                        12
                    ]
                ]
            }
        },
        "gl": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "gsw": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "gu": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "guw": {
            "one": {
                "inrange": [
                    "n",
                    [
                        [0,1]
                    ]
                ]
            }
        },
        "gv": {
            "one": {
                "or": [
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            [
                                [1,2]
                            ]
                        ]
                    },
                    {
                        "is": [
                            {
                                "mod": [
                                    "n",
                                    20
                                ]
                            },
                            0
                        ]
                    }
                ]
            }
        },
        "ha": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "haw": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "he": {
            "many": {
                "and": [
                    {
                        "isnot": [
                            "n",
                            0
                        ]
                    },
                    {
                        "is": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            0
                        ]
                    }
                ]
            },
            "one": {
                "is": [
                    "n",
                    1
                ]
            },
            "two": {
                "is": [
                    "n",
                    2
                ]
            }
        },
        "hi": {
            "one": {
                "inrange": [
                    "n",
                    [
                        0,
                        1
                    ]
                ]
            }
        },
        "hr": {
            "few": {
                "and": [
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            [
                                [2,4]
                            ]
                        ]
                    },
                    {
                        "notin": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [12,14]
                            ]
                        ]
                    }
                ]
            },
            "many": {
                "or": [
                    {
                        "or": [
                            {
                                "is": [
                                    {
                                        "mod": [
                                            "n",
                                            10
                                        ]
                                    },
                                    0
                                ]
                            },
                            {
                                "inrange": [
                                    {
                                        "mod": [
                                            "n",
                                            10
                                        ]
                                    },
                                    [
                                        [5,9]
                                    ]
                                ]
                            }
                        ]
                    },
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [11,14]
                            ]
                        ]
                    }
                ]
            },
            "one": {
                "and": [
                    {
                        "is": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            1
                        ]
                    },
                    {
                        "isnot": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            11
                        ]
                    }
                ]
            }
        },
        "is": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "it": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "iu": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            },
            "two": {
                "is": [
                    "n",
                    2
                ]
            }
        },
        "jgo": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "jmc": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "kab": {
            "one": {
                "and": [
                    {
                        "within": [
                            "n",
                            [
                                [0,2]
                            ]
                        ]
                    },
                    {
                        "isnot": [
                            "n",
                            2
                        ]
                    }
                ]
            }
        },
        "kaj": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "kcg": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "kk": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "kkj": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "kl": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ks": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ksb": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ksh": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            },
            "zero": {
                "is": [
                    "n",
                    0
                ]
            }
        },
        "ku": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "kw": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            },
            "two": {
                "is": [
                    "n",
                    2
                ]
            }
        },
        "ky": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "lag": {
            "one": {
                "and": [
                    {
                        "and": [
                            {
                                "within": [
                                    "n",
                                    [
                                        [0,2]
                                    ]
                                ]
                            },
                            {
                                "isnot": [
                                    "n",
                                    0
                                ]
                            }
                        ]
                    },
                    {
                        "isnot": [
                            "n",
                            2
                        ]
                    }
                ]
            },
            "zero": {
                "is": [
                    "n",
                    0
                ]
            }
        },
        "lb": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "lg": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ln": {
            "one": {
                "inrange": [
                    "n",
                    [
                        [0,1]
                    ]
                ]
            }
        },
        "lt": {
            "few": {
                "and": [
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            [
                                [2,9]
                            ]
                        ]
                    },
                    {
                        "notin": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [11,19]
                            ]
                        ]
                    }
                ]
            },
            "one": {
                "and": [
                    {
                        "is": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            1
                        ]
                    },
                    {
                        "notin": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [11,19]
                            ]
                        ]
                    }
                ]
            }
        },
        "lv": {
            "one": {
                "and": [
                    {
                        "is": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            1
                        ]
                    },
                    {
                        "isnot": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            11
                        ]
                    }
                ]
            },
            "zero": {
                "is": [
                    "n",
                    0
                ]
            }
        },
        "mas": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "mg": {
            "one": {
                "inrange": [
                    "n",
                    [
                        [0,1]
                    ]
                ]
            }
        },
        "mgo": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "mk": {
            "one": {
                "and": [
                    {
                        "is": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            1
                        ]
                    },
                    {
                        "isnot": [
                            "n",
                            11
                        ]
                    }
                ]
            }
        },
        "ml": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "mn": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "mo": {
            "few": {
                "or": [
                    {
                        "is": [
                            "n",
                            0
                        ]
                    },
                    {
	                    "and": [
	                        {
	                        	"isnot": [
	                        		"n",
	                        		1
	                        	]
	                        },
		                    {
		                        "inrange": [
		                            {
		                                "mod": [
		                                    "n",
		                                    100
		                                ]
		                            },
		                            [
		                                [1,19]
		                            ]
		                        ]
		                    }
		                ]
                    }
                ]
            },
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "mr": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "mt": {
            "few": {
                "or": [
                    {
                        "is": [
                            "n",
                            0
                        ]
                    },
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [2,10]
                            ]
                        ]
                    }
                ]
            },
            "many": {
                "inrange": [
                    {
                        "mod": [
                            "n",
                            100
                        ]
                    },
                    [
                        [11,19]
                    ]
                ]
            },
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "nah": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "naq": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            },
            "two": {
                "is": [
                    "n",
                    2
                ]
            }
        },
        "nb": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "nd": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ne": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "nl": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "nn": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "nnh": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "no": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "nr": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "nso": {
            "one": {
                "inrange": [
                    "n",
                    [
                        [0,1]
                    ]
                ]
            }
        },
        "ny": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "nyn": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "om": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "or": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "os": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "pa": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "pap": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "pl": {
            "few": {
                "and": [
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            [
                                [2,4]
                            ]
                        ]
                    },
                    {
                        "notin": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [12,14]
                            ]
                        ]
                    }
                ]
            },
            "one": {
                "is": [
                    "n",
                    1
                ]
            },
            "many": {
                "or": [
                   {
                       "and": [
                           {
                               "isnot": [
                                   "n",
                                   1
                               ]
                           },
                           {
                               "inrange": [
                                   {
                                       "mod": [
                                           "n",
                                           10
                                       ]
                                   },
                                   [[0,1]]
                               ]
                           }
                       ]
                   },
                   {
                       "or": [
                           {
                               "inrange": [
                                   {
                                       "mod": [
                                           "n",
                                           10
                                       ]
                                   },
                                   [[5,9]]
                               ]
                           },
                           {
                               "inrange": [
                                   {
                                       "mod": [
                                           "n",
                                           100
                                       ]
                                   },
                                   [[12,14]]
                               ]
                           }
                       ]
                   }
               ]
           }
        },
        "ps": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "pt": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "rm": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ro": {
            "few": {
                "or": [
                    {
                        "is": [
                            "n",
                            0
                        ]
                    },
                    {
	                    "and": [
	                        {
	                        	"isnot": [
	                        		"n",
	                        		1
	                        	]
	                        },
		                    {
		                        "inrange": [
		                            {
		                                "mod": [
		                                    "n",
		                                    100
		                                ]
		                            },
		                            [
		                                [1,19]
		                            ]
		                        ]
		                    }
		                ]
                    }
                ]
            },
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "rof": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ru": {
            "few": {
                "and": [
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            [
                                [2,4]
                            ]
                        ]
                    },
                    {
                        "notin": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [12,14]
                            ]
                        ]
                    }
                ]
            },
            "many": {
                "or": [
                    {
                        "or": [
                            {
                                "is": [
                                    {
                                        "mod": [
                                            "n",
                                            10
                                        ]
                                    },
                                    0
                                ]
                            },
                            {
                                "inrange": [
                                    {
                                        "mod": [
                                            "n",
                                            10
                                        ]
                                    },
                                    [
                                        [5,9]
                                    ]
                                ]
                            }
                        ]
                    },
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [11,14]
                            ]
                        ]
                    }
                ]
            },
            "one": {
                "and": [
                    {
                        "is": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            1
                        ]
                    },
                    {
                        "isnot": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            11
                        ]
                    }
                ]
            }
        },
        "rwk": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "saq": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "se": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            },
            "two": {
                "is": [
                    "n",
                    2
                ]
            }
        },
        "seh": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "sh": {
            "few": {
                "and": [
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            [
                                [2,4]
                            ]
                        ]
                    },
                    {
                        "notin": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [12,14]
                            ]
                        ]
                    }
                ]
            },
            "many": {
                "or": [
                    {
                        "or": [
                            {
                                "is": [
                                    {
                                        "mod": [
                                            "n",
                                            10
                                        ]
                                    },
                                    0
                                ]
                            },
                            {
                                "inrange": [
                                    {
                                        "mod": [
                                            "n",
                                            10
                                        ]
                                    },
                                    [
                                        [5,9]
                                    ]
                                ]
                            }
                        ]
                    },
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [11,14]
                            ]
                        ]
                    }
                ]
            },
            "one": {
                "and": [
                    {
                        "is": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            1
                        ]
                    },
                    {
                        "isnot": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            11
                        ]
                    }
                ]
            }
        },
        "shi": {
            "few": {
                "inrange": [
                    "n",
                    [
                        [2,10]
                    ]
                ]
            },
            "one": {
                "within": [
                    "n",
                    [
                        [0,1]
                    ]
                ]
            }
        },
        "sk": {
            "few": {
                "inrange": [
                    "n",
                    [
                        [2,4]
                    ]
                ]
            },
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "sl": {
            "few": {
                "inrange": [
                    {
                        "mod": [
                            "n",
                            100
                        ]
                    },
                    [
                        [3,4]
                    ]
                ]
            },
            "one": {
                "is": [
                    {
                        "mod": [
                            "n",
                            100
                        ]
                    },
                    1
                ]
            },
            "two": {
                "is": [
                    {
                        "mod": [
                            "n",
                            100
                        ]
                    },
                    2
                ]
            }
        },
        "sma": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            },
            "two": {
                "is": [
                    "n",
                    2
                ]
            }
        },
        "smi": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            },
            "two": {
                "is": [
                    "n",
                    2
                ]
            }
        },
        "smj": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            },
            "two": {
                "is": [
                    "n",
                    2
                ]
            }
        },
        "smn": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            },
            "two": {
                "is": [
                    "n",
                    2
                ]
            }
        },
        "sms": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            },
            "two": {
                "is": [
                    "n",
                    2
                ]
            }
        },
        "sn": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "so": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "sq": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "sr": {
            "few": {
                "and": [
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            [
                                [2,4]
                            ]
                        ]
                    },
                    {
                        "notin": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [12,14]
                            ]
                        ]
                    }
                ]
            },
            "many": {
                "or": [
                    {
                        "or": [
                            {
                                "is": [
                                    {
                                        "mod": [
                                            "n",
                                            10
                                        ]
                                    },
                                    0
                                ]
                            },
                            {
                                "inrange": [
                                    {
                                        "mod": [
                                            "n",
                                            10
                                        ]
                                    },
                                    [
                                        [5,9]
                                    ]
                                ]
                            }
                        ]
                    },
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [11,14]
                            ]
                        ]
                    }
                ]
            },
            "one": {
                "and": [
                    {
                        "is": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            1
                        ]
                    },
                    {
                        "isnot": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            11
                        ]
                    }
                ]
            }
        },
        "ss": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ssy": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "st": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "sv": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "sw": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "syr": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ta": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "te": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "teo": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ti": {
            "one": {
                "inrange": [
                    "n",
                    [
                        [0,1]
                    ]
                ]
            }
        },
        "tig": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "tk": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "tl": {
            "one": {
                "inrange": [
                    "n",
                    [
                        [0,1]
                    ]
                ]
            }
        },
        "tn": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ts": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "tzm": {
            "one": {
                "or": [
                    {
                        "inrange": [
                            "n",
                            [
                                [0,1]
                            ]
                        ]
                    },
                    {
                        "inrange": [
                            "n",
                            [
                                [11,99]
                            ]
                        ]
                    }
                ]
            }
        },
        "uk": {
            "few": {
                "and": [
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            [
                                [2,4]
                            ]
                        ]
                    },
                    {
                        "notin": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [12,14]
                            ]
                        ]
                    }
                ]
            },
            "many": {
                "or": [
                    {
                        "or": [
                            {
                                "is": [
                                    {
                                        "mod": [
                                            "n",
                                            10
                                        ]
                                    },
                                    0
                                ]
                            },
                            {
                                "inrange": [
                                    {
                                        "mod": [
                                            "n",
                                            10
                                        ]
                                    },
                                    [
                                        [5,9]
                                    ]
                                ]
                            }
                        ]
                    },
                    {
                        "inrange": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            [
                                [11,14]
                            ]
                        ]
                    }
                ]
            },
            "one": {
                "and": [
                    {
                        "is": [
                            {
                                "mod": [
                                    "n",
                                    10
                                ]
                            },
                            1
                        ]
                    },
                    {
                        "isnot": [
                            {
                                "mod": [
                                    "n",
                                    100
                                ]
                            },
                            11
                        ]
                    }
                ]
            }
        },
        "ur": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "ve": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "vo": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "vun": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "wa": {
            "one": {
                "inrange": [
                    "n",
                    [
                        [0,1]
                    ]
                ]
            }
        },
        "wae": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "xh": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "xog": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        },
        "zu": {
            "one": {
                "is": [
                    "n",
                    1
                ]
            }
        }
    }
};
/*
 * strings.js - ilib string subclass definition
 * 
 * Copyright © 2012-2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js util/utils.js locale.js

// !data plurals

/**
 * @class
 * Create a new string instance. This string inherits from the Javascript
 * String class, and adds two more methods, fmt and fmtChoice. It can be
 * used anywhere that a normal Javascript string is used. The formatting
 * methods are of course most useful when localizing strings in an app
 * or web site in combination with the ilib.ResBundle class.<p>
 * 
 * Depends directive: !depends strings.js
 * 
 * @constructor
 * @param {string|ilib.String=} string initialize this instance with this string 
 */
ilib.String = function (string) {
	if (typeof(string) === 'object') {
		this.str = string.str;
	} else if (typeof(string) === 'string') {
		this.str = new String(string);
	} else {
		this.str = "";
	}
	this.length = this.str.length;
	this.cpLength = -1;
	this.localeSpec = ilib.getLocale();
};

/**
 * @private
 * @static
 * 
 * Return true if the given character is a Unicode surrogate character,
 * either high or low.
 * 
 * @param {string} ch character to check
 * @return {boolean} true if the character is a surrogate
 */
ilib.String._isSurrogate = function (ch) {
	var n = ch.charCodeAt(0);
	return ((n >= 0xDC00 && n <= 0xDFFF) || (n >= 0xD800 && n <= 0xDBFF));
};

/**
 * @private
 * @static
 * 
 * Return true if the given character is a leading Jamo (Choseong) character.
 * 
 * @param {number} n code point to check
 * @return {boolean} true if the character is a leading Jamo character, 
 * false otherwise
 */
ilib.String._isJamoL = function (n) {
	return (n >= 0x1100 && n <= 0x1112);
};

/**
 * @private
 * @static
 * 
 * Return true if the given character is a vowel Jamo (Jungseong) character.
 * 
 * @param {number} n code point to check
 * @return {boolean} true if the character is a vowel Jamo character, 
 * false otherwise
 */
ilib.String._isJamoV = function (n) {
	return (n >= 0x1161 && n <= 0x1175);
};

/**
 * @private
 * @static
 * 
 * Return true if the given character is a trailing Jamo (Jongseong) character.
 * 
 * @param {number} n code point to check
 * @return {boolean} true if the character is a trailing Jamo character, 
 * false otherwise
 */
ilib.String._isJamoT = function (n) {
	return (n >= 0x11A8 && n <= 0x11C2);
};

/**
 * @private
 * @static
 * 
 * Return true if the given character is a precomposed Hangul character.
 * 
 * @param {number} n code point to check
 * @return {boolean} true if the character is a precomposed Hangul character, 
 * false otherwise
 */
ilib.String._isHangul = function (n) {
	return (n >= 0xAC00 && n <= 0xD7A3);
};

/**
 * @static
 * Convert a UCS-4 code point to a Javascript string. The codepoint can be any valid 
 * UCS-4 Unicode character, including supplementary characters. Standard Javascript
 * only supports supplementary characters using the UTF-16 encoding, which has 
 * values in the range 0x0000-0xFFFF. String.fromCharCode() will only
 * give you a string containing 16-bit characters, and will not properly convert 
 * the code point for a supplementary character (which has a value > 0xFFFF) into 
 * two UTF-16 surrogate characters. Instead, it will just just give you whatever
 * single character happens to be the same as your code point modulo 0x10000, which
 * is almost never what you want.<p> 
 * 
 * Similarly, that means if you use String.charCodeAt()
 * you will only retrieve a 16-bit value, which may possibly be a single
 * surrogate character that is part of a surrogate pair representing a character
 * in the supplementary plane. It will not give you a code point. Use 
 * ilib.String.codePointAt() to access code points in a string, or use 
 * an iterator to walk through the code points in a string. 
 * 
 * @param {number} codepoint UCS-4 code point to convert to a character
 * @return {string} a string containing the character represented by the codepoint
 */
ilib.String.fromCodePoint = function (codepoint) {
	if (codepoint < 0x10000) {
		return String.fromCharCode(codepoint);
	} else {
		var high = Math.floor(codepoint / 0x10000) - 1;
		var low = codepoint & 0xFFFF;
		
		return String.fromCharCode(0xD800 | ((high & 0x000F) << 6) |  ((low & 0xFC00) >> 10)) +
			String.fromCharCode(0xDC00 | (low & 0x3FF));
	}
};

/**
 * @private
 * @static
 *
 * Algorithmically decompose a precomposed Korean syllabic Hangul 
 * character into its individual combining Jamo characters. The given 
 * character must be in the range of Hangul characters U+AC00 to U+D7A3.
 * 
 * @param {number} cp code point of a Korean Hangul character to decompose
 * @return {string} the decomposed string of Jamo characters
 */
ilib.String._decomposeHangul = function (cp) {
	var sindex = cp - 0xAC00;
	var result = String.fromCharCode(0x1100 + sindex / 588) + 
			String.fromCharCode(0x1161 + (sindex % 588) / 28);
	var t = sindex % 28;
	if (t !== 0) {
		result += String.fromCharCode(0x11A7 + t);
	}
	return result;
};

/**
 * @private
 * @static
 *
 * Algorithmically compose an L and a V combining Jamo characters into
 * a precomposed Korean syllabic Hangul character. Both should already
 * be in the proper ranges for L and V characters. 
 * 
 * @param {number} lead the code point of the lead Jamo character to compose
 * @param {number} trail the code point of the trailing Jamo character to compose
 * @return {string} the composed Hangul character
 */
ilib.String._composeJamoLV = function (lead, trail) {
	var lindex = lead - 0x1100;
	var vindex = trail - 0x1161;
	return ilib.String.fromCodePoint(0xAC00 + (lindex * 21 + vindex) * 28);
};

/**
 * @private
 * @static
 *
 * Algorithmically compose a Hangul LV and a combining Jamo T character 
 * into a precomposed Korean syllabic Hangul character. 
 * 
 * @param {number} lead the code point of the lead Hangul character to compose
 * @param {number} trail the code point of the trailing Jamo T character to compose
 * @return {string} the composed Hangul character
 */
ilib.String._composeJamoLVT = function (lead, trail) {
	return ilib.String.fromCodePoint(lead + (trail - 0x11A7));
};

/**
 * @private
 * @static
 * 
 * Expand one character according to the given canonical and 
 * compatibility mappings.
 * @param {string} ch character to map
 * @param {Object} canon the canonical mappings to apply
 * @param {Object=} compat the compatibility mappings to apply, or undefined
 * if only the canonical mappings are needed
 * @return {string} the mapped character
 */
ilib.String._expand = function (ch, canon, compat) {
	var i, 
		expansion = "",
		n = ch.charCodeAt(0);
	if (ilib.String._isHangul(n)) {
		expansion = ilib.String._decomposeHangul(n);
	} else {
		var result = canon[ch];
		if (!result && compat) {
			result = compat[ch];
		}
		if (result && result !== ch) {
			for (i = 0; i < result.length; i++) {
				expansion += ilib.String._expand(result[i], canon, compat);
			}
		} else {
			expansion = ch;
		}
	}
	return expansion;
};

/**
 * @private
 * @static
 * 
 * Compose one character out of a leading character and a 
 * trailing character. If the characters are Korean Jamo, they
 * will be composed algorithmically. If they are any other
 * characters, they will be looked up in the nfc tables.
 
 * @param {string} lead leading character to compose
 * @param {string} trail the trailing character to compose
 * @return {string} the fully composed character, or undefined if
 * there is no composition for those two characters
 */
ilib.String._compose = function (lead, trail) {
	var first = lead.charCodeAt(0);
	var last = trail.charCodeAt(0);
	if (ilib.String._isHangul(first) && ilib.String._isJamoT(last)) {
		return ilib.String._composeJamoLVT(first, last);
	} else if (ilib.String._isJamoL(first) && ilib.String._isJamoV(last)) {
		return ilib.String._composeJamoLV(first, last);
	}

	var c = lead + trail;
	return (ilib.data.norm.nfc && ilib.data.norm.nfc[c]);
};

/**
 * @private
 * @static
 */
ilib.String._fncs = {
	/**
	 * @private
	 * @param {Object} obj
	 * @return {string|undefined}
	 */
	firstProp: function (obj) {
		for (var p in obj) {
			if (p && obj[p]) {
				return p;
			}
		}
		return undefined; // should never get here
	},
	
	/**
	 * @private
	 * @param {Object} obj
	 * @param {number} n
	 * @return {?}
	 */
	getValue: function (obj, n) {
		if (typeof(obj) === 'object') {
			var subrule = ilib.String._fncs.firstProp(obj);
			return ilib.String._fncs[subrule](obj[subrule], n);
		} else if (typeof(obj) === 'string') {
			return n;
		} else {
			return obj;
		}
	},
	
	/**
	 * @private
	 * @param {number} n
	 * @param {Array.<number|Array.<number>>} range
	 * @return {boolean}
	 */
	matchRangeContinuous: function(n, range) {
		for (var num in range) {
			if (typeof(num) !== 'undefined' && typeof(range[num]) !== 'undefined') {
				var obj = /** @type {Object|null|undefined} */ range[num];
				if (typeof(obj) === 'number') {
					if (n === range[num]) {
						return true;
					}
				} else if (Object.prototype.toString.call(obj) === '[object Array]') {
					if (n >= obj[0] && n <= obj[1]) {
						return true;
					}
				}
			}
		}
		return false;
	},

	/**
	 * @private
	 * @param {number} n
	 * @param {Array.<number|Array.<number>>} range
	 * @return {boolean}
	 */
	matchRange: function(n, range) {
		if (Math.floor(n) !== n) {
			return false;
		}
		return ilib.String._fncs.matchRangeContinuous(n, range);
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	is: function(rule, n) {
		var left = ilib.String._fncs.getValue(rule[0], n);
		var right = ilib.String._fncs.getValue(rule[1], n);
		return left == right;
		// return ilib.String._fncs.getValue(rule[0]) == ilib.String._fncs.getValue(rule[1]);
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	isnot: function(rule, n) {
		return ilib.String._fncs.getValue(rule[0], n) != ilib.String._fncs.getValue(rule[1], n);
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	inrange: function(rule, n) {
		return ilib.String._fncs.matchRange(ilib.String._fncs.getValue(rule[0], n), rule[1]);
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	notin: function(rule, n) {
		return !ilib.String._fncs.matchRange(ilib.String._fncs.getValue(rule[0], n), rule[1]);
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	within: function(rule, n) {
		return ilib.String._fncs.matchRangeContinuous(ilib.String._fncs.getValue(rule[0], n), rule[1]);		
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {number}
	 */
	mod: function(rule, n) {
		return ilib.mod(ilib.String._fncs.getValue(rule[0], n), ilib.String._fncs.getValue(rule[1], n));
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {number}
	 */
	n: function(rule, n) {
		return n;
	},
	
	/**
	 * @private
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	or: function(rule, n) {
		return ilib.String._fncs.getValue(rule[0], n) || ilib.String._fncs.getValue(rule[1], n);
	},
	
	/**
	 * @param {Object} rule
	 * @param {number} n
	 * @return {boolean}
	 */
	and: function(rule, n) {
		return ilib.String._fncs.getValue(rule[0], n) && ilib.String._fncs.getValue(rule[1], n);
	}
};

ilib.String.prototype = {
	/**
	 * @private
	 * Return the length of this string in characters. This function defers to the regular
	 * Javascript string class in order to perform the length function. Please note that this
	 * method is a real method, whereas the length property of Javascript strings is 
	 * implemented by native code and appears as a property.<p>
	 * 
	 * Example:
	 * 
	 * <pre>
	 * var str = new ilib.String("this is a string");
	 * console.log("String is " + str._length() + " characters long.");
	 * </pre>
	 */
	_length: function () {
		return this.str.length;
	},
	
	/**
	 * Format this string instance as a message, replacing the parameters with 
	 * the given values.<p>
	 * 
	 * The string can contain any text that a regular Javascript string can
	 * contain. Replacement parameters have the syntax:
	 * 
	 * <pre>
	 * {name}
	 * </pre>
	 * 
	 * Where "name" can be any string surrounded by curly brackets. The value of 
	 * "name" is taken from the parameters argument.<p>
	 * 
	 * Example:
	 * 
	 * <pre>
	 * var str = new ilib.String("There are {num} objects.");
	 * console.log(str.format({
	 *   num: 12
	 * });
	 * </pre>
	 * 
	 * Would give the output:
	 * 
	 * <pre>
	 * There are 12 objects.
	 * </pre>
	 * 
	 * If a property is missing from the parameter block, the replacement
	 * parameter substring is left untouched in the string, and a different
	 * set of parameters may be applied a second time. This way, different
	 * parts of the code may format different parts of the message that they
	 * happen to know about.<p>
	 * 
	 * Example:
	 * 
	 * <pre>
	 * var str = new ilib.String("There are {num} objects in the {container}.");
	 * console.log(str.format({
	 *   num: 12
	 * });
	 * </pre>
	 * 
	 * Would give the output:<p>
	 * 
	 * <pre>
	 * There are 12 objects in the {container}.
	 * </pre>
	 * 
	 * The result can then be formatted again with a different parameter block that
	 * specifies a value for the container property.
	 * 
	 * @param params a Javascript object containing values for the replacement 
	 * parameters in the current string
	 * @return a new ilib.String instance with as many replacement parameters filled
	 * out as possible with real values.
	 */
	format: function (params) {
		var formatted = this.str;
		if (params) {
			for (var p in params) {
				if (typeof(params[p]) !== 'undefined') {
					formatted = formatted.replace("\{"+p+"\}", params[p]);
				}
			}
		}
		return formatted.toString();
	},
	
	/**
	 * Format a string as one of a choice of strings dependent on the value of
	 * a particular argument index.<p>
	 * 
	 * The syntax of the choice string is as follows. The string contains a
	 * series of choices separated by a vertical bar character "|". Each choice
	 * has a value or range of values to match followed by a hash character "#"
	 * followed by the string to use if the variable matches the criteria.<p>
	 * 
	 * Example string:
	 * 
	 * <pre>
	 * var num = 2;
	 * var str = new ilib.String("0#There are no objects.|1#There is one object.|2#There are {number} objects.");
	 * console.log(str.formatChoice(num, {
	 *   number: num
	 * }));
	 * </pre>
	 * 
	 * Gives the output:
	 * 
	 * <pre>
	 * "There are 2 objects."
	 * </pre>
	 * 
	 * The strings to format may contain replacement variables that will be formatted
	 * using the format() method above and the params argument as a source of values
	 * to use while formatting those variables.<p>
	 * 
	 * If the criterion for a particular choice is empty, that choice will be used
	 * as the default one for use when none of the other choice's criteria match.<p>
	 * 
	 * Example string:
	 * 
	 * <pre>
	 * var num = 22;
	 * var str = new ilib.String("0#There are no objects.|1#There is one object.|#There are {number} objects.");
	 * console.log(str.formatChoice(num, {
	 *   number: num
	 * }));
	 * </pre>
	 * 
	 * Gives the output:
	 * 
	 * <pre>
	 * "There are 22 objects."
	 * </pre>
	 * 
	 * If multiple choice patterns can match a given argument index, the first one 
	 * encountered in the string will be used. If no choice patterns match the 
	 * argument index, then the default choice will be used. If there is no default
	 * choice defined, then this method will return an empty string.<p>
	 * 
	 * <b>Special Syntax</b><p>
	 * 
	 * For any choice format string, all of the patterns in the string should be
	 * of a single type: numeric, boolean, or string/regexp. The type of the 
	 * patterns is determined by the type of the argument index parameter.<p>
	 * 
	 * If the argument index is numeric, then some special syntax can be used 
	 * in the patterns to match numeric ranges.<p>
	 * 
	 * <ul>
	 * <li><i>&gt;x</i> - match any number that is greater than x 
	 * <li><i>&gt;=x</i> - match any number that is greater than or equal to x
	 * <li><i>&lt;x</i> - match any number that is less than x
	 * <li><i>&lt;=x</i> - match any number that is less than or equal to x
	 * <li><i>start-end</i> - match any number in the range [start,end)
	 * <li><i>zero</i> - match any number in the class "zero". (See below for
	 * a description of number classes.)
	 * <li><i>one</i> - match any number in the class "one"
	 * <li><i>two</i> - match any number in the class "two"
	 * <li><i>few</i> - match any number in the class "few"
	 * <li><i>many</i> - match any number in the class "many"
	 * </ul>
	 * 
	 * A number class defines a set of numbers that receive a particular syntax
	 * in the strings. For example, in Slovenian, integers ending in the digit
	 * "1" are in the "one" class, including 1, 21, 31, ... 101, 111, etc.
	 * Similarly, integers ending in the digit "2" are in the "two" class. 
	 * Integers ending in the digits "3" or "4" are in the "few" class, and
	 * every other integer is handled by the default string.<p>
	 * 
	 * The definition of what numbers are included in a class is locale-dependent.
	 * They are defined in the data file plurals.json. If your string is in a
	 * different locale than the default for ilib, you should call the setLocale()
	 * method of the string instance before calling this method.<p> 
	 * 
	 * <b>Other Pattern Types</b><p>
	 * 
	 * If the argument index is a boolean, the string values "true" and "false" 
	 * may appear as the choice patterns.<p>
	 * 
	 * If the argument index is of type string, then the choice patterns may contain
	 * regular expressions, or static strings as degenerate regexps.
	 * 
	 * @param {*} argIndex The index into the choice array of the current parameter
	 * @param {Object} params The hash of parameter values that replace the replacement 
	 * variables in the string
	 * @throws "syntax error in choice format pattern: " if there is a syntax error
	 * @return {string} the formatted string
	 */
	formatChoice: function(argIndex, params) {
		var choices = this.str.split("|");
		var type = typeof(argIndex);
		var limits = [];
		var strings = [];
		var i;
		var parts;
		var limit;
		var arg;
		var result = undefined;
		var defaultCase = "";
	
		if (this.str.length === 0) {
			// nothing to do
			return "";
		}
		
		// first parse all the choices
		for (i = 0; i < choices.length; i++) {		
			parts = choices[i].split("#");		
			if (parts.length > 2) {
				limits[i] = parts[0];
				parts = parts.shift();			
				strings[i] = parts.join("#");
			} else if (parts.length === 2) {
				limits[i] = parts[0];
				strings[i] = parts[1];
			} else {
				// syntax error
				throw "syntax error in choice format pattern: " + choices[i];
			}		
		}
		
		// then apply the argument index
		for (i = 0; i < limits.length; i++) {
			if (limits[i].length === 0) {
				// this is default case
				defaultCase = new ilib.String(strings[i]);			
			} else {
				switch (type) {
					case 'number':
						arg = parseInt(argIndex, 10);
											
						if (limits[i].substring(0,2) === "<=") {						
							limit = parseFloat(limits[i].substring(2));
							if (arg <= limit) {
								result = new ilib.String(strings[i]);
								i = limits.length;
							}
						} else if (limits[i].substring(0,2) === ">=") {						
							limit = parseFloat(limits[i].substring(2));
							if (arg >= limit) {
								result = new ilib.String(strings[i]);
								i = limits.length;
							}
						} else if (limits[i].charAt(0) === "<") {						
							limit = parseFloat(limits[i].substring(1));
							if (arg < limit) {
								result = new ilib.String(strings[i]);
								i = limits.length;
							}
						} else if (limits[i].charAt(0) === ">") {						
							limit = parseFloat(limits[i].substring(1));
							if (arg > limit) {
								result = new ilib.String(strings[i]);
								i = limits.length;
							}
						} else {
							this.locale = this.locale || new ilib.Locale(this.localeSpec);
							switch (limits[i]) {
								case "zero":
								case "one":
								case "two":
								case "few":
								case "many":
									// CLDR locale-dependent number classes
									var rule = ilib.data.plurals.plurals[this.locale.getLanguage()][limits[i]];
									if (ilib.String._fncs.getValue(rule, arg)) {
										result = new ilib.String(strings[i]);
										i = limits.length;
									}
									break;
								default:
									var dash = limits[i].indexOf("-");
									if (dash !== -1) {							
										// range
										var start = limits[i].substring(0, dash);
										var end = limits[i].substring(dash+1);							
										if (arg >= parseInt(start, 10) && arg <= parseInt(end, 10)) {								
											result = new ilib.String(strings[i]);
											i = limits.length;
										}
									} else if (arg === parseInt(limits[i], 10)) {							
										// exact amount
										result = new ilib.String(strings[i]);
										i = limits.length;
									}
									break;
							}
						}
						break;
					case 'boolean':					
						if (limits[i] === "true" && argIndex === true) {						
							result = new ilib.String(strings[i]);
							i = limits.length;
						} else if (limits[i] === "false" && argIndex === false) {						
							result = new ilib.String(strings[i]);
							i = limits.length;
						}
						break;
					case 'string':					
						var regexp = new RegExp(limits[i], "i");
						if (regexp.test(argIndex)) {
							result = new ilib.String(strings[i]);
							i = limits.length;
						}
						break;
					case 'object':
						throw "syntax error: fmtChoice parameter for the argument index cannot be an object";
				}
			}
		}
		
		if (!result) {		
			result = defaultCase || new ilib.String("");
		}
		
		result = result.format(params);
		
		return result.toString();
	},
	
	/**
	 * Perform the Unicode Normalization Algorithm upon the string and return 
	 * the resulting new string. The current string is not modified.
	 * 
	 * <h2>Forms</h2>
	 * 
	 * The forms of possible normalizations are defined by the <a 
	 * href="http://www.unicode.org/reports/tr15/">Unicode Standard
	 * Annex (UAX) 15</a>. The form parameter is a string that may have one 
	 * of the following values:
	 * 
	 * <ul>
	 * <li>nfd - Canonical decomposition. This decomposes characters into
	 * their exactly equivalent forms. For example, "&uuml;" would decompose
	 * into a "u" followed by the combining diaeresis character. 
	 * <li>nfc - Canonical decomposition followed by canonical composition.
	 * This decomposes and then recomposes character into their shortest
	 * exactly equivalent forms by recomposing as many combining characters
	 * as possible. For example, "&uuml;" followed by a combining 
	 * macron character would decompose into a "u" followed by the combining 
	 * macron characters the combining diaeresis character, and then be recomposed into
	 * the u with macron and diaeresis "&#x1E7B;" character. The reason that
	 * the "nfc" form decomposes and then recomposes is that combining characters
	 * have a specific order under the Unicode Normalization Algorithm, and
	 * partly composed characters such as the "&uuml;" followed by combining
	 * marks may change the order of the combining marks when decomposed and
	 * recomposed.
	 * <li>nfkd - Compatibility decomposition. This decomposes characters
	 * into compatible forms that may not be exactly equivalent semantically,
	 * as well as performing canonical decomposition as well.
	 * For example, the "&oelig;" ligature character decomposes to the two
	 * characters "oe" because they are compatible even though they are not 
	 * exactly the same semantically. 
	 * <li>nfkc - Compatibility decomposition followed by canonical composition.
	 * This decomposes characters into compatible forms, then recomposes
	 * characters using the canonical composition. That is, it breaks down
	 * characters into the compatible forms, and then recombines all combining
	 * marks it can with their base characters. For example, the character
	 * "&#x01FD;" would be normalized to "a&eacute;" by first decomposing
	 * the character into "a" followed by "e" followed by the combining acute accent
	 * combining mark, and then recomposed to an "a" followed by the "e"
	 * with acute accent.
	 * </ul>
	 * 
	 * <h2>Operation</h2>
	 * 
	 * Two strings a and b can be said to be canonically equivalent if 
	 * normalize(a) = normalize(b)
	 * under the nfc normalization form. Two strings can be said to be compatible if
	 * normalize(a) = normalize(b) under the nfkc normalization form.<p>
	 * 
	 * The canonical normalization is often used to see if strings are 
	 * equivalent to each other, and thus is useful when implementing parsing 
	 * algorithms or exact matching algorithms. It can also be used to ensure
	 * that any string output produces a predictable sequence of characters.<p>
	 * 
	 * Compatibility normalization 
	 * does not always preserve the semantic meaning of all the characters, 
	 * although this is sometimes the behaviour that you are after. It is useful, 
	 * for example, when doing searches of user-input against text in documents 
	 * where the matches are supposed to "fuzzy". In this case, both the query
	 * string and the document string would be mapped to their compatibility 
	 * normalized forms, and then compared.<p>
	 * 
	 * Compatibility normalization also does not guarantee round-trip conversion
	 * to and from legacy character sets as the normalization is "lossy". It is 
	 * akin to doing a lower- or upper-case conversion on text -- after casing,
	 * you cannot tell what case each character is in the original string. It is 
	 * good for matching and searching, but it rarely good for output because some 
	 * distinctions or meanings in the original text have been lost.<p>
	 * 
	 * Note that W3C normalization for HTML also escapes and unescapes
	 * HTML character entities such as "&amp;uuml;" for u with diaeresis. This
	 * method does not do such escaping or unescaping. If normalization is required
	 * for HTML strings with entities, unescaping should be performed on the string 
	 * prior to calling this method.<p>
	 * 
	 * <h2>Data</h2>
	 * 
	 * Normalization requires a fair amount of mapping data, much of which you may 
	 * not need for the characters expected in your texts. It is possible to assemble
	 * a copy of ilib that saves space by only including normalization data for 
	 * those scripts that you expect to encounter in your data.<p>
	 * 
	 * The normalization data is organized by normalization form and within there
	 * by script. To include the normalization data for a particular script with
	 * a particular normalization form, use the directive:
	 * 
	 * <pre><code>
	 * !depends &lt;form&gt;/&lt;script&gt;.js
	 * </code></pre>
	 * 
	 * Where &lt;form&gt is the normalization form ("nfd", "nfc", "nfkd", or "nfkc"), and
	 * &lt;script&gt; is the ISO 15924 code for the script you would like to
	 * support. Example: to load in the NFC data for Cyrillic, you would use:
	 * 
	 * <pre><code>
	 * !depends nfc/Cyrl.js
	 * </code></pre>
	 * 
	 * Note that because certain normalization forms include others in their algorithm, 
	 * their data also depends on the data for the other forms. For example, if you 
	 * include the "nfc" data for a script, you will automatically get the "nfd" data 
	 * for that same script as well because the NFC algorithm does NFD normalization 
	 * first. Here are the dependencies:<p>
	 * 
	 * <ul>
	 * <li>NFD -> no dependencies
	 * <li>NFC -> NFD
	 * <li>NFKD -> NFD
	 * <li>NFKC -> NFKD, NFD, NFC
	 * </ul>
	 * 
	 * A special value for the script dependency is "all" which will cause the data for 
	 * all scripts
	 * to be loaded for that normalization form. This would be useful if you know that
	 * you are going to normalize a lot of multilingual text or cannot predict which scripts
	 * will appear in the input. Because the NFKC form depends on all others, you can 
	 * get all of the data for all forms automatically by depending on "nfkc/all.js".
	 * Note that the normalization data for practically all script automatically depend
	 * on data for the Common script (code "Zyyy") which contains all of the characters
	 * that are commonly used in many different scripts. Examples of characters in the
	 * Common script are the ASCII punctuation characters, or the ASCII Arabic 
	 * numerals "0" through "9".<p>
	 * 
	 * By default, none of the data for normalization is automatically 
	 * included in the preassembled iliball.js file. 
	 * If you would like to normalize strings, you must assemble
	 * your own copy of ilib and explicitly include the normalization data
	 * for those scripts as per the instructions above. This normalization method will 
	 * produce output, even without the normalization data. However, the output will be 
	 * simply the same thing as its input for all scripts 
	 * except Korean Hangul and Jamo, which are decomposed and recomposed 
	 * algorithmically and therefore do not rely on data.<p>
	 * 
	 * If characters are encountered for which there are no normalization data, they
	 * will be passed through to the output string unmodified.
	 * 
	 * @param {string} form The normalization form requested
	 * @return {ilib.String} a new instance of an ilib.String that has been normalized
	 * according to the requested form. The current instance is not modified.
	 */
	normalize: function (form) {
		var i;
		
		if (typeof(form) !== 'string' || this.str.length === 0) {
			return new ilib.String(this.str);
		}
		
		var nfc = false,
			nfkd = false;
		
		switch (form) {
		default:
			break;
			
		case "nfc":
			nfc = true;
			break;
			
		case "nfkd":
			nfkd = true;
			break;
			
		case "nfkc":
			nfkd = true;
			nfc = true;
			break;
		}

		// decompose
		var decomp = "";
		
		if (nfkd) {
			var ch, it = this.charIterator();
			while (it.hasNext()) {
				ch = it.next();
				decomp += ilib.String._expand(ch, ilib.data.norm.nfd, ilib.data.norm.nfkd);
			}
		} else {
			var ch, it = this.charIterator();
			while (it.hasNext()) {
				ch = it.next();
				decomp += ilib.String._expand(ch, ilib.data.norm.nfd);
			}
		}

		// now put the combining marks in a fixed order by 
		// sorting on the combining class
		function compareByCCC(left, right) {
			return ilib.data.norm.ccc[left] - ilib.data.norm.ccc[right]; 
		}
		
		function ccc(c) {
			return ilib.data.norm.ccc[c] || 0;
		}
			
		var dstr = new ilib.String(decomp);
		var it = dstr.charIterator();
		var cpArray = [];

		// easier to deal with as an array of chars
		while (it.hasNext()) {
			cpArray.push(it.next());
		}
		
		i = 0;
		while (i < cpArray.length) {
			if (typeof(ilib.data.norm.ccc[cpArray[i]]) !== 'undefined' && ilib.data.norm.ccc[cpArray[i]] !== 0) {
				// found a non-starter... rearrange all the non-starters until the next starter
				var end = i+1;
				while (end < cpArray.length &&
						typeof(ilib.data.norm.ccc[cpArray[end]]) !== 'undefined' && 
						ilib.data.norm.ccc[cpArray[end]] !== 0) {
					end++;
				}
				
				// simple sort of the non-starter chars
				if (end - i > 1) {
					cpArray = cpArray.slice(0,i).concat(cpArray.slice(i, end).sort(compareByCCC), cpArray.slice(end));
				}
			}
			i++;
		}
		
		if (nfc) {
			i = 0;
			while (i < cpArray.length) {
				if (typeof(ilib.data.norm.ccc[cpArray[i]]) === 'undefined' || ilib.data.norm.ccc[cpArray[i]] === 0) {
					// found a starter... find all the non-starters until the next starter. Must include
					// the next starter because under some odd circumstances, two starters sometimes recompose 
					// together to form another character
					var end = i+1;
					var notdone = true;
					while (end < cpArray.length && notdone) {
						if (typeof(ilib.data.norm.ccc[cpArray[end]]) !== 'undefined' && 
							ilib.data.norm.ccc[cpArray[end]] !== 0) {
							if (ccc(cpArray[end-1]) < ccc(cpArray[end])) { 
								// not blocked 
								var testChar = ilib.String._compose(cpArray[i], cpArray[end]);
								if (typeof(testChar) !== 'undefined') {
									cpArray[i] = testChar;
									
									// delete the combining char
									cpArray.splice(end,1);	
									
									// restart the iteration, just in case there is more to recompose with the new char
									end = i;
								}
							}
							end++;
						} else {
							// found the next starter. See if this can be composed with the previous starter
							var testChar = ilib.String._compose(cpArray[i], cpArray[end]);
							if (ccc(cpArray[end-1]) === 0 && typeof(testChar) !== 'undefined') { 
								// not blocked and there is a mapping 
								cpArray[i] = testChar;
								
								// delete the combining char
								cpArray.splice(end,1);
								
								// restart the iteration, just in case there is more to recompose with the new char
								end = i+1;
							} else {
								// finished iterating 
								notdone = false;
							}
						}
					}
				}
				i++;
			}
		}
		
		return new ilib.String(cpArray.length > 0 ? cpArray.join("") : "");
	},
	
	// delegates
	/**
	 * Same as String.toString()
	 * @return {string} this instance as regular Javascript string
	 */
	toString: function () {
		return this.str.toString();
	},
	
	/**
	 * Same as String.valueOf()
	 * @return {string} this instance as a regular Javascript string
	 */
	valueOf: function () {
		return this.str.valueOf();
	},
	
	/**
	 * Same as String.charAt()
	 * @param {number} index the index of the character being sought
	 * @return {ilib.String} the character at the given index
	 */
	charAt: function(index) {
		return new ilib.String(this.str.charAt(index));
	},
	
	/**
	 * Same as String.charCodeAt(). This only reports on 
	 * 2-byte UCS-2 Unicode values, and does not take into
	 * account supplementary characters encoded in UTF-16.
	 * If you would like to take account of those characters,
	 * use codePointAt() instead.
	 * @param {number} index the index of the character being sought
	 * @return {number} the character code of the character at the 
	 * given index in the string 
	 */
	charCodeAt: function(index) {
		return this.str.charCodeAt(index);
	},
	
	/**
	 * Same as String.concat()
	 * @param {string} strings strings to concatenate to the current one
	 * @return {ilib.String} a concatenation of the given strings
	 */
	concat: function(strings) {
		return new ilib.String(this.str.concat(strings));
	},
	
	/**
	 * Same as String.indexOf()
	 * @param {string} searchValue string to search for
	 * @param {number} start index into the string to start searching, or
	 * undefined to search the entire string
	 * @return {number} index into the string of the string being sought,
	 * or -1 if the string is not found 
	 */
	indexOf: function(searchValue, start) {
		return this.str.indexOf(searchValue, start);
	},
	
	/**
	 * Same as String.lastIndexOf()
	 * @param {string} searchValue string to search for
	 * @param {number} start index into the string to start searching, or
	 * undefined to search the entire string
	 * @return {number} index into the string of the string being sought,
	 * or -1 if the string is not found 
	 */
	lastIndexOf: function(searchValue, start) {
		return this.str.lastIndexOf(searchValue, start);
	},
	
	/**
	 * Same as String.match()
	 * @param {string} regexp the regular expression to match
	 * @return {Array.<string>} an array of matches
	 */
	match: function(regexp) {
		return this.str.match(regexp);
	},
	
	/**
	 * Same as String.replace()
	 * @param {string} searchValue a regular expression to search for
	 * @param {string} newValue the string to replace the matches with
	 * @return {ilib.String} a new string with all the matches replaced
	 * with the new value
	 */
	replace: function(searchValue, newValue) {
		return new ilib.String(this.str.replace(searchValue, newValue));
	},
	
	/**
	 * Same as String.search()
	 * @param {string} regexp the regular expression to search for
	 * @return {number} position of the match, or -1 for no match
	 */
	search: function(regexp) {
		return this.str.search(regexp);
	},
	
	/**
	 * Same as String.slice()
	 * @param {number} start first character to include in the string
	 * @param {number} end include all characters up to, but not including
	 * the end character
	 * @return {ilib.String} a slice of the current string
	 */
	slice: function(start, end) {
		return new ilib.String(this.str.slice(start, end));
	},
	
	/**
	 * Same as String.split()
	 * @param {string} separator regular expression to match to find
	 * separations between the parts of the text
	 * @param {number} limit maximum number of items in the final 
	 * output array. Any items beyond that limit will be ignored.
	 * @return {Array.<string>} the parts of the current string split 
	 * by the separator
	 */
	split: function(separator, limit) {
		return this.str.split(separator, limit);
	},
	
	/**
	 * Same as String.substr()
	 * @param {number} start the index of the character that should 
	 * begin the returned substring
	 * @param {number} length the number of characters to return after
	 * the start character.
	 * @return {ilib.String} the requested substring 
	 */
	substr: function(start, length) {
		return new ilib.String(this.str.substr(start, length));
	},
	
	/**
	 * Same as String.substring()
	 * @param {number} from the index of the character that should 
	 * begin the returned substring
	 * @param {number} to the index where to stop the extraction. If
	 * omitted, extracts the rest of the string
	 * @return {ilib.String} the requested substring 
	 */
	substring: function(from, to) {
		return this.str.substring(from, to);
	},
	
	/**
	 * Same as String.toLowerCase(). Note that this method is
	 * not locale-sensitive. 
	 * @return {ilib.String} a string with the first character
	 * lower-cased
	 */
	toLowerCase: function() {
		return this.str.toLowerCase();
	},
	
	/**
	 * Same as String.toUpperCase(). Note that this method is
	 * not locale-sensitive. Use toLocaleUpperCase() instead
	 * to get locale-sensitive behaviour. 
	 * @return {ilib.String} a string with the first character
	 * upper-cased
	 */
	toUpperCase: function() {
		return this.str.toUpperCase();
	},
	
	/**
	 * @private
	 * Convert the character or the surrogate pair at the given
	 * index into the string to a Unicode UCS-4 code point.
	 * @param {number} index index into the string
	 * @return {number} code point of the character at the
	 * given index into the string
	 */
	_toCodePoint: function (index) {
		if (this.str.length === 0) {
			return -1;
		}
		var code = -1, high = this.str.charCodeAt(index);
		if (high >= 0xD800 && high <= 0xDBFF) {
			if (this.str.length > index+1) {
				var low = this.str.charCodeAt(index+1);
				if (low >= 0xDC00 && low <= 0xDFFF) {
					code = (((high & 0x3C0) >> 6) + 1) << 16 |
						(((high & 0x3F) << 10) | (low & 0x3FF));
				}
			}
		} else {
			code = high;
		}
		
		return code;
	},
	
	/**
	 * Return an iterator that will step through all of the characters
	 * in the string one at a time and return their code points, taking 
	 * care to step through the surrogate pairs in UTF-16 encoding 
	 * properly.<p>
	 * 
	 * The standard Javascript String's charCodeAt() method only
	 * returns information about a particular 16-bit character in the 
	 * UTF-16 encoding scheme.
	 * If the index is pointing to a low- or high-surrogate character,
	 * it will return a code point of the surrogate character rather 
	 * than the code point of the character 
	 * in the supplementary planes that the two surrogates together 
	 * encode.<p>
	 * 
	 * The iterator instance returned has two methods, hasNext() which
	 * returns true if the iterator has more code points to iterate through,
	 * and next() which returns the next code point as a number.<p>
	 * 
	 * @return {Object} an iterator 
	 * that iterates through all the code points in the string
	 */
	iterator: function() {
		/**
		 * @constructor
		 */
		function _iterator (istring) {
			this.index = 0;
			this.hasNext = function () {
				return (this.index < istring.str.length);
			};
			this.next = function () {
				if (this.index < istring.str.length) {
					var num = istring._toCodePoint(this.index);
					this.index += ((num > 0xFFFF) ? 2 : 1);
				} else {
					num = -1;
				}
				return num;
			};
		};
		return new _iterator(this);
	},

	/**
	 * Return an iterator that will step through all of the characters
	 * in the string one at a time, taking 
	 * care to step through the surrogate pairs in UTF-16 encoding 
	 * properly.<p>
	 * 
	 * The standard Javascript String's charAt() method only
	 * returns information about a particular 16-bit character in the 
	 * UTF-16 encoding scheme.
	 * If the index is pointing to a low- or high-surrogate character,
	 * it will return that surrogate character rather 
	 * than the surrogate pair which represents a character 
	 * in the supplementary planes.<p>
	 * 
	 * The iterator instance returned has two methods, hasNext() which
	 * returns true if the iterator has more characters to iterate through,
	 * and next() which returns the next character.<p>
	 * 
	 * @return {Object} an iterator 
	 * that iterates through all the characters in the string
	 */
	charIterator: function() {
		/**
		 * @constructor
		 */
		function _chiterator (istring) {
			this.index = 0;
			this.hasNext = function () {
				return (this.index < istring.str.length);
			};
			this.next = function () {
				var ch;
				if (this.index < istring.str.length) {
					ch = istring.str.charAt(this.index);
					if (ilib.String._isSurrogate(ch) && 
							this.index+1 < istring.str.length && 
							ilib.String._isSurrogate(istring.str.charAt(this.index+1))) {
						this.index++;
						ch += istring.str.charAt(this.index);
					}
					this.index++;
				}
				return ch;
			};
		};
		return new _chiterator(this);
	},
	
	/**
	 * Return the code point at the given index when the string is viewed 
	 * as an array of code points. If the index is beyond the end of the
	 * array of code points or if the index is negative, -1 is returned.
	 * @param {number} index index of the code point 
	 * @return {number} code point of the character at the given index into
	 * the string
	 */
	codePointAt: function (index) {
		if (index < 0) {
			return -1;
		}
		var count,
			it = this.iterator(),
			ch;
		for (count = index; count >= 0 && it.hasNext(); count--) {
			ch = it.next();
		}
		return (count < 0) ? ch : -1;
	},
	
	/**
	 * Set the locale to use when processing choice formats. The locale
	 * affects how number classes are interpretted. In some cultures,
	 * the limit "few" maps to "any integer that ends in the digits 2 to 9" and
	 * in yet others, "few" maps to "any integer that ends in the digits
	 * 3 or 4".
	 * @param {ilib.Locale|string} locale locale to use when processing choice
	 * formats with this string
	 */
	setLocale: function (locale) {
		if (typeof(locale) === 'object') {
			this.locale = locale;
		} else {
			this.localeSpec = locale;
		}
	},
	
	/**
	 * Return the number of code points in this string. This may be different
	 * than the number of characters, as the UTF-16 encoding that Javascript
	 * uses for its basis returns surrogate pairs separately. Two 2-byte 
	 * surrogate characters together make up one character/code point in 
	 * the supplementary character planes. If your string contains no
	 * characters in the supplementary planes, this method will return the
	 * same thing as the length() method.
	 * @return {number} the number of code points in this string
	 */
	codePointLength: function () {
		if (this.cpLength === -1) {
			var it = this.iterator();
			this.cpLength = 0;
			while (it.hasNext()) { 
				this.cpLength++;
				it.next();
			};
		}
		return this.cpLength;	
	}
};
ilib.data.localeinfo = {
	"clock": "24",
	"currencyFormats": {
		"common": "{s}{n}",
		"iso": "{s} {n}"
	},
	"units": "metric",
	"calendar": "gregorian",
	"firstDayOfWeek": 0,
	"currency": "USD",
	"timezone": "Etc/UTC",
	"numfmt": {
		"decimalChar": ",",
		"groupChar": ".",
		"groupSize": 3,
		"pctFmt": "{n}%",
		"pctChar": "%",
		"roundingMode": "halfdown"
	},
	"locale": "."
}
;
ilib.data.likelylocales = {"aa":"aa-Latn-ET","ab":"ab-Cyrl-GE","ady":"ady-Cyrl-RU","af":"af-Latn-ZA","agq":"agq-Latn-CM","ak":"ak-Latn-GH","am":"am-Ethi-ET","ar":"ar-Arab-EG","as":"as-Beng-IN","asa":"asa-Latn-TZ","ast":"ast-Latn-ES","av":"av-Cyrl-RU","ay":"ay-Latn-BO","az":"az-Latn-AZ","az-Arab":"az-Arab-IR","az-IR":"az-Arab-IR","ba":"ba-Cyrl-RU","bas":"bas-Latn-CM","be":"be-Cyrl-BY","bem":"bem-Latn-ZM","bez":"bez-Latn-TZ","bg":"bg-Cyrl-BG","bi":"bi-Latn-VU","bm":"bm-Latn-ML","bn":"bn-Beng-BD","bo":"bo-Tibt-CN","br":"br-Latn-FR","brx":"brx-Deva-IN","bs":"bs-Latn-BA","byn":"byn-Ethi-ER","ca":"ca-Latn-ES","cch":"cch-Latn-NG","ce":"ce-Cyrl-RU","ceb":"ceb-Latn-PH","cgg":"cgg-Latn-UG","ch":"ch-Latn-GU","chk":"chk-Latn-FM","chr":"chr-Cher-US","ckb":"ckb-Arab-IQ","cs":"cs-Latn-CZ","csb":"csb-Latn-PL","cy":"cy-Latn-GB","da":"da-Latn-DK","dav":"dav-Latn-KE","de":"de-Latn-DE","dje":"dje-Latn-NE","dua":"dua-Latn-CM","dv":"dv-Thaa-MV","dyo":"dyo-Latn-SN","dz":"dz-Tibt-BT","ebu":"ebu-Latn-KE","ee":"ee-Latn-GH","efi":"efi-Latn-NG","el":"el-Grek-GR","en":"en-Latn-US","eo":"eo-Latn-001","es":"es-Latn-ES","et":"et-Latn-EE","eu":"eu-Latn-ES","ewo":"ewo-Latn-CM","fa":"fa-Arab-IR","ff":"ff-Latn-SN","fi":"fi-Latn-FI","fil":"fil-Latn-PH","fj":"fj-Latn-FJ","fo":"fo-Latn-FO","fr":"fr-Latn-FR","fur":"fur-Latn-IT","fy":"fy-Latn-NL","ga":"ga-Latn-IE","gaa":"gaa-Latn-GH","gag":"gag-Latn-MD","gd":"gd-Latn-GB","gil":"gil-Latn-KI","gl":"gl-Latn-ES","gn":"gn-Latn-PY","gsw":"gsw-Latn-CH","gu":"gu-Gujr-IN","guz":"guz-Latn-KE","gv":"gv-Latn-GB","gv-Latn":"gv-Latn-IM","ha":"ha-Latn-NG","haw":"haw-Latn-US","he":"he-Hebr-IL","hi":"hi-Deva-IN","hil":"hil-Latn-PH","ho":"ho-Latn-PG","hr":"hr-Latn-HR","ht":"ht-Latn-HT","hu":"hu-Latn-HU","hy":"hy-Armn-AM","ia":"ia-Latn-001","id":"id-Latn-ID","ig":"ig-Latn-NG","ii":"ii-Yiii-CN","ilo":"ilo-Latn-PH","inh":"inh-Cyrl-RU","is":"is-Latn-IS","it":"it-Latn-IT","ja":"ja-Jpan-JP","jgo":"jgo-Latn-CM","jmc":"jmc-Latn-TZ","jv":"jv-Latn-ID","ka":"ka-Geor-GE","kab":"kab-Latn-DZ","kaj":"kaj-Latn-NG","kam":"kam-Latn-KE","kbd":"kbd-Cyrl-RU","kcg":"kcg-Latn-NG","kde":"kde-Latn-TZ","kea":"kea-Latn-CV","kg":"kg-Latn-CD","kha":"kha-Latn-IN","khq":"khq-Latn-ML","ki":"ki-Latn-KE","kj":"kj-Latn-NA","kk":"kk-Cyrl-KZ","kkj":"kkj-Latn-CM","kl":"kl-Latn-GL","kln":"kln-Latn-KE","km":"km-Khmr-KH","kn":"kn-Knda-IN","ko":"ko-Kore-KR","koi":"koi-Cyrl-RU","kok":"kok-Deva-IN","kos":"kos-Latn-FM","kpe":"kpe-Latn-LR","kpv":"kpv-Cyrl-RU","krc":"krc-Cyrl-RU","ks":"ks-Arab-IN","ksb":"ksb-Latn-TZ","ksf":"ksf-Latn-CM","ksh":"ksh-Latn-DE","ku":"ku-Latn-TR","ku-Arab":"ku-Arab-IQ","ku-IQ":"ku-Arab-IQ","kum":"kum-Cyrl-RU","kv":"kv-Cyrl-RU","kw":"kw-Latn-GB","ky":"ky-Cyrl-KG","la":"la-Latn-VA","lag":"lag-Latn-TZ","lah":"lah-Arab-PK","lb":"lb-Latn-LU","lbe":"lbe-Cyrl-RU","lez":"lez-Cyrl-RU","lg":"lg-Latn-UG","ln":"ln-Latn-CD","lo":"lo-Laoo-LA","lt":"lt-Latn-LT","lu":"lu-Latn-CD","lua":"lua-Latn-CD","luo":"luo-Latn-KE","luy":"luy-Latn-KE","lv":"lv-Latn-LV","mai":"mai-Deva-IN","mas":"mas-Latn-KE","mdf":"mdf-Cyrl-RU","mdh":"mdh-Latn-PH","mer":"mer-Latn-KE","mfe":"mfe-Latn-MU","mg":"mg-Latn-MG","mgh":"mgh-Latn-MZ","mgo":"mgo-Latn-CM","mh":"mh-Latn-MH","mi":"mi-Latn-NZ","mk":"mk-Cyrl-MK","ml":"ml-Mlym-IN","mn":"mn-Cyrl-MN","mn-CN":"mn-Mong-CN","mn-Mong":"mn-Mong-CN","mr":"mr-Deva-IN","ms":"ms-Latn-MY","mt":"mt-Latn-MT","mua":"mua-Latn-CM","my":"my-Mymr-MM","myv":"myv-Cyrl-RU","na":"na-Latn-NR","naq":"naq-Latn-NA","nb":"nb-Latn-NO","nd":"nd-Latn-ZW","nds":"nds-Latn-DE","ne":"ne-Deva-NP","niu":"niu-Latn-NU","nl":"nl-Latn-NL","nmg":"nmg-Latn-CM","nn":"nn-Latn-NO","nnh":"nnh-Latn-CM","nr":"nr-Latn-ZA","nso":"nso-Latn-ZA","nus":"nus-Latn-SD","ny":"ny-Latn-MW","nyn":"nyn-Latn-UG","oc":"oc-Latn-FR","om":"om-Latn-ET","or":"or-Orya-IN","os":"os-Cyrl-GE","pa":"pa-Guru-IN","pa-Arab":"pa-Arab-PK","pa-PK":"pa-Arab-PK","pag":"pag-Latn-PH","pap":"pap-Latn-AN","pau":"pau-Latn-PW","pl":"pl-Latn-PL","pon":"pon-Latn-FM","ps":"ps-Arab-AF","pt":"pt-Latn-BR","qu":"qu-Latn-PE","rm":"rm-Latn-CH","rn":"rn-Latn-BI","ro":"ro-Latn-RO","rof":"rof-Latn-TZ","ru":"ru-Cyrl-RU","rw":"rw-Latn-RW","rwk":"rwk-Latn-TZ","sa":"sa-Deva-IN","sah":"sah-Cyrl-RU","saq":"saq-Latn-KE","sat":"sat-Latn-IN","sbp":"sbp-Latn-TZ","sd":"sd-Arab-IN","se":"se-Latn-NO","seh":"seh-Latn-MZ","ses":"ses-Latn-ML","sg":"sg-Latn-CF","shi":"shi-Tfng-MA","shi-MA":"shi-Latn-MA","si":"si-Sinh-LK","sid":"sid-Latn-ET","sk":"sk-Latn-SK","sl":"sl-Latn-SI","sm":"sm-Latn-WS","sn":"sn-Latn-ZW","so":"so-Latn-SO","sq":"sq-Latn-AL","sr":"sr-Cyrl-RS","sr-ME":"sr-Latn-ME","ss":"ss-Latn-ZA","ssy":"ssy-Latn-ER","st":"st-Latn-ZA","su":"su-Latn-ID","sv":"sv-Latn-SE","sw":"sw-Latn-TZ","swc":"swc-Latn-CD","ta":"ta-Taml-IN","te":"te-Telu-IN","teo":"teo-Latn-UG","tet":"tet-Latn-TL","tg":"tg-Cyrl-TJ","th":"th-Thai-TH","ti":"ti-Ethi-ET","tig":"tig-Ethi-ER","tk":"tk-Latn-TM","tkl":"tkl-Latn-TK","tl":"tl-Latn-PH","tn":"tn-Latn-ZA","to":"to-Latn-TO","tpi":"tpi-Latn-PG","tr":"tr-Latn-TR","trv":"trv-Latn-TW","ts":"ts-Latn-ZA","tsg":"tsg-Latn-PH","tt":"tt-Cyrl-RU","tvl":"tvl-Latn-TV","twq":"twq-Latn-NE","ty":"ty-Latn-PF","tyv":"tyv-Cyrl-RU","tzm":"tzm-Latn-MA","udm":"udm-Cyrl-RU","ug":"ug-Arab-CN","uk":"uk-Cyrl-UA","uli":"uli-Latn-FM","und":"en-Latn-US","AD":"ca-Latn-AD","AE":"ar-Arab-AE","AF":"fa-Arab-AF","AL":"sq-Latn-AL","AM":"hy-Armn-AM","AN":"pap-Latn-AN","AO":"pt-Latn-AO","AR":"es-Latn-AR","Arab":"ar-Arab-EG","Arab-CN":"ug-Arab-CN","Arab-IN":"ur-Arab-IN","Arab-NG":"ha-Arab-NG","Arab-PK":"ur-Arab-PK","Armi":"arc-Armi-IR","Armn":"hy-Armn-AM","AS":"sm-Latn-AS","AT":"de-Latn-AT","Avst":"ae-Avst-IR","AW":"nl-Latn-AW","AX":"sv-Latn-AX","AZ":"az-Latn-AZ","BA":"bs-Latn-BA","Bali":"ban-Bali-ID","Bamu":"bax-Bamu-CM","Batk":"bbc-Batk-ID","BD":"bn-Beng-BD","BE":"nl-Latn-BE","Beng":"bn-Beng-BD","BF":"fr-Latn-BF","BG":"bg-Cyrl-BG","BH":"ar-Arab-BH","BI":"rn-Latn-BI","BJ":"fr-Latn-BJ","BL":"fr-Latn-BL","BN":"ms-Latn-BN","BO":"es-Latn-BO","Bopo":"zh-Bopo-TW","BR":"pt-Latn-BR","Brah":"pra-Brah-IN","Brai":"und-Brai-FR","BT":"dz-Tibt-BT","Bugi":"bug-Bugi-ID","Buhd":"bku-Buhd-PH","BY":"be-Cyrl-BY","Cakm":"ccp-Cakm-BD","Cans":"cr-Cans-CA","Cari":"xcr-Cari-TR","CD":"sw-Latn-CD","CF":"fr-Latn-CF","CG":"fr-Latn-CG","CH":"de-Latn-CH","Cham":"cjm-Cham-VN","Cher":"chr-Cher-US","CI":"fr-Latn-CI","CL":"es-Latn-CL","CM":"fr-Latn-CM","CN":"zh-Hans-CN","CO":"es-Latn-CO","Copt":"cop-Copt-EG","CP":"fr-Latn-CP","Cprt":"grc-Cprt-CY","CR":"es-Latn-CR","CU":"es-Latn-CU","CV":"pt-Latn-CV","CY":"el-Grek-CY","Cyrl":"ru-Cyrl-RU","Cyrl-BA":"sr-Cyrl-BA","Cyrl-GE":"ab-Cyrl-GE","CZ":"cs-Latn-CZ","DE":"de-Latn-DE","Deva":"hi-Deva-IN","DJ":"aa-Latn-DJ","DK":"da-Latn-DK","DO":"es-Latn-DO","DZ":"ar-Arab-DZ","EA":"es-Latn-EA","EC":"es-Latn-EC","EE":"et-Latn-EE","EG":"ar-Arab-EG","Egyp":"egy-Egyp-EG","EH":"ar-Arab-EH","ER":"ti-Ethi-ER","ES":"es-Latn-ES","Ethi":"am-Ethi-ET","FI":"fi-Latn-FI","FM":"chk-Latn-FM","FO":"fo-Latn-FO","FR":"fr-Latn-FR","GA":"fr-Latn-GA","GE":"ka-Geor-GE","Geor":"ka-Geor-GE","GF":"fr-Latn-GF","GH":"ak-Latn-GH","GL":"kl-Latn-GL","Glag":"cu-Glag-BG","GN":"fr-Latn-GN","Goth":"got-Goth-UA","GP":"fr-Latn-GP","GQ":"es-Latn-GQ","GR":"el-Grek-GR","Grek":"el-Grek-GR","GT":"es-Latn-GT","Gujr":"gu-Gujr-IN","Guru":"pa-Guru-IN","GW":"pt-Latn-GW","Hang":"ko-Hang-KR","Hani":"zh-Hans-CN","Hano":"hnn-Hano-PH","Hans":"zh-Hans-CN","Hant":"zh-Hant-TW","Hebr":"he-Hebr-IL","Hira":"ja-Hira-JP","HK":"zh-Hant-HK","HN":"es-Latn-HN","HR":"hr-Latn-HR","HT":"ht-Latn-HT","HU":"hu-Latn-HU","IC":"es-Latn-IC","ID":"id-Latn-ID","IL":"he-Hebr-IL","IN":"hi-Deva-IN","IQ":"ar-Arab-IQ","IR":"fa-Arab-IR","IS":"is-Latn-IS","IT":"it-Latn-IT","Ital":"ett-Ital-IT","Java":"jv-Java-ID","JO":"ar-Arab-JO","JP":"ja-Jpan-JP","Jpan":"ja-Jpan-JP","Kali":"eky-Kali-MM","Kana":"ja-Kana-JP","KG":"ky-Cyrl-KG","KH":"km-Khmr-KH","Khar":"pra-Khar-PK","Khmr":"km-Khmr-KH","KM":"ar-Arab-KM","Knda":"kn-Knda-IN","Kore":"ko-Kore-KR","KP":"ko-Kore-KP","KR":"ko-Kore-KR","Kthi":"bh-Kthi-IN","KW":"ar-Arab-KW","KZ":"ru-Cyrl-KZ","LA":"lo-Laoo-LA","Lana":"nod-Lana-TH","Laoo":"lo-Laoo-LA","Latn-CN":"za-Latn-CN","Latn-CY":"tr-Latn-CY","Latn-DZ":"fr-Latn-DZ","Latn-ER":"aa-Latn-ER","Latn-KM":"fr-Latn-KM","Latn-MA":"fr-Latn-MA","Latn-MK":"sq-Latn-MK","Latn-MR":"fr-Latn-MR","Latn-SY":"fr-Latn-SY","Latn-TN":"fr-Latn-TN","LB":"ar-Arab-LB","Lepc":"lep-Lepc-IN","LI":"de-Latn-LI","Limb":"lif-Limb-IN","Linb":"grc-Linb-GR","Lisu":"lis-Lisu-CN","LK":"si-Sinh-LK","LS":"st-Latn-LS","LT":"lt-Latn-LT","LU":"fr-Latn-LU","LV":"lv-Latn-LV","LY":"ar-Arab-LY","Lyci":"xlc-Lyci-TR","Lydi":"xld-Lydi-TR","MA":"ar-Arab-MA","Mand":"myz-Mand-IR","MC":"fr-Latn-MC","MD":"ro-Latn-MD","ME":"sr-Latn-ME","Merc":"xmr-Merc-SD","Mero":"xmr-Mero-SD","MF":"fr-Latn-MF","MG":"mg-Latn-MG","MK":"mk-Cyrl-MK","ML":"bm-Latn-ML","Mlym":"ml-Mlym-IN","MM":"my-Mymr-MM","MN":"mn-Cyrl-MN","MO":"zh-Hant-MO","Mong":"mn-Mong-CN","MQ":"fr-Latn-MQ","MR":"ar-Arab-MR","MT":"mt-Latn-MT","Mtei":"mni-Mtei-IN","MU":"mfe-Latn-MU","MV":"dv-Thaa-MV","MX":"es-Latn-MX","MY":"ms-Latn-MY","Mymr":"my-Mymr-MM","MZ":"pt-Latn-MZ","NA":"kj-Latn-NA","NC":"fr-Latn-NC","NE":"ha-Latn-NE","NI":"es-Latn-NI","Nkoo":"man-Nkoo-GN","NL":"nl-Latn-NL","NO":"nb-Latn-NO","NP":"ne-Deva-NP","Ogam":"sga-Ogam-IE","Olck":"sat-Olck-IN","OM":"ar-Arab-OM","Orkh":"otk-Orkh-MN","Orya":"or-Orya-IN","Osma":"so-Osma-SO","PA":"es-Latn-PA","PE":"es-Latn-PE","PF":"fr-Latn-PF","PG":"tpi-Latn-PG","PH":"fil-Latn-PH","Phag":"lzh-Phag-CN","Phli":"pal-Phli-IR","Phnx":"phn-Phnx-LB","PK":"ur-Arab-PK","PL":"pl-Latn-PL","Plrd":"hmd-Plrd-CN","PM":"fr-Latn-PM","PR":"es-Latn-PR","Prti":"xpr-Prti-IR","PS":"ar-Arab-PS","PT":"pt-Latn-PT","PW":"pau-Latn-PW","PY":"gn-Latn-PY","QA":"ar-Arab-QA","RE":"fr-Latn-RE","Rjng":"rej-Rjng-ID","RO":"ro-Latn-RO","RS":"sr-Cyrl-RS","RU":"ru-Cyrl-RU","Runr":"non-Runr-SE","RW":"rw-Latn-RW","SA":"ar-Arab-SA","Samr":"smp-Samr-IL","Sarb":"xsa-Sarb-YE","Saur":"saz-Saur-IN","SC":"fr-Latn-SC","SD":"ar-Arab-SD","SE":"sv-Latn-SE","Shaw":"en-Shaw-GB","Shrd":"sa-Shrd-IN","SI":"sl-Latn-SI","Sinh":"si-Sinh-LK","SJ":"nb-Latn-SJ","SK":"sk-Latn-SK","SM":"it-Latn-SM","SN":"fr-Latn-SN","SO":"so-Latn-SO","Sora":"srb-Sora-IN","SR":"nl-Latn-SR","ST":"pt-Latn-ST","Sund":"su-Sund-ID","SV":"es-Latn-SV","SY":"ar-Arab-SY","Sylo":"syl-Sylo-BD","Syrc":"syr-Syrc-SY","Tagb":"tbw-Tagb-PH","Takr":"doi-Takr-IN","Tale":"tdd-Tale-CN","Talu":"khb-Talu-CN","Taml":"ta-Taml-IN","Tavt":"blt-Tavt-VN","TD":"fr-Latn-TD","Telu":"te-Telu-IN","Tfng":"shi-Tfng-TN","TG":"fr-Latn-TG","Tglg":"fil-Tglg-PH","TH":"th-Thai-TH","Thaa":"dv-Thaa-MV","Thai":"th-Thai-TH","Tibt":"bo-Tibt-CN","TJ":"tg-Cyrl-TJ","TK":"tkl-Latn-TK","TL":"pt-Latn-TL","TM":"tk-Latn-TM","TN":"ar-Arab-TN","TO":"to-Latn-TO","TR":"tr-Latn-TR","TV":"tvl-Latn-TV","TW":"zh-Hant-TW","TZ":"sw-Latn-TZ","UA":"uk-Cyrl-UA","UG":"sw-Latn-UG","Ugar":"uga-Ugar-SY","UY":"es-Latn-UY","UZ":"uz-Cyrl-UZ","VA":"la-Latn-VA","Vaii":"vai-Vaii-LR","VE":"es-Latn-VE","VN":"vi-Latn-VN","VU":"bi-Latn-VU","WF":"fr-Latn-WF","WS":"sm-Latn-WS","Xpeo":"peo-Xpeo-IR","Xsux":"akk-Xsux-IQ","YE":"ar-Arab-YE","Yiii":"ii-Yiii-CN","YT":"fr-Latn-YT","ur":"ur-Arab-PK","uz":"uz-Cyrl-UZ","uz-AF":"uz-Arab-AF","uz-Arab":"uz-Arab-AF","vai":"vai-Vaii-LR","ve":"ve-Latn-ZA","vi":"vi-Latn-VN","vo":"vo-Latn-001","vun":"vun-Latn-TZ","wae":"wae-Latn-CH","wal":"wal-Ethi-ET","war":"war-Latn-PH","wo":"wo-Latn-SN","xh":"xh-Latn-ZA","xog":"xog-Latn-UG","yap":"yap-Latn-FM","yav":"yav-Latn-CM","yi":"yi-Hebr-IL","yo":"yo-Latn-NG","za":"za-Latn-CN","zh":"zh-Hans-CN","zh-Hani":"zh-Hans-CN","zh-Hant":"zh-Hant-TW","zh-HK":"zh-Hant-HK","zh-MO":"zh-Hant-MO","zh-TW":"zh-Hant-TW","zu":"zu-Latn-ZA"}
;
/*
 * localeinfo.js - Encode locale-specific defaults
 * 
 * Copyright © 2012-2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js locale.js

// !data localeinfo likelylocales

/**
 * @class
 * Create a new locale info instance. Locale info instances give information about
 * the default settings for a particular locale. These settings may be overridden
 * by various parts of the code, and should be used as a fall-back setting of last
 * resort. <p>
 * 
 * The optional options object holds extra parameters if they are necessary. The
 * current list of supported options are:
 * 
 * <ul>
 * <li>onLoad - a callback function to call when the locale info object is fully 
 * loaded. When the onLoad option is given, the localeinfo object will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
 * 
 * <li>sync - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * If this copy of ilib is pre-assembled and all the data is already available, 
 * or if the data was already previously loaded, then this constructor will call
 * the onLoad callback immediately when the initialization is done. 
 * If the onLoad option is not given, this class will only attempt to load any
 * missing locale data synchronously.
 * 
 * Depends directive: !depends localeinfo.js
 * 
 * @constructor
 * @see {ilib.setLoaderCallback} for information about registering a loader callback
 * function
 * @param {ilib.Locale|string=} locale the locale for which the info is sought, or undefined for
 * @param {Object=} options the locale for which the info is sought, or undefined for
 * the current locale
 */
ilib.LocaleInfo = function(locale, options) {
	var sync = true;
	
	/* these are all the defaults. Essentially, en-US */
	this.info = ilib.data.localeinfo;
	this.loadParams = {};
	
	switch (typeof(locale)) {
		case "string":
			this.locale = new ilib.Locale(locale);
			break;
		default:
		case "undefined":
			this.locale = new ilib.Locale();
			break;
		case "object":
			this.locale = locale;
			break;
	}
	
	if (options) {
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		if (typeof(options.loadParams) !== 'undefined') {
			this.loadParams = options.loadParams;
		}
	}

	if (!ilib.LocaleInfo.cache) {
		ilib.LocaleInfo.cache = {};
	}

	ilib.loadData(ilib.LocaleInfo, this.locale, "localeinfo", sync, this.loadParams, ilib.bind(this, function (info) {
		if (!info) {
			info = ilib.data.localeinfo;
			var spec = this.locale.getSpec().replace(/-/g, "_");
			ilib.LocaleInfo.cache[spec] = info;
		}
		this.info = info;
		if (options && typeof(options.onLoad) === 'function') {
			options.onLoad(this);
		}
	}));
};

ilib.LocaleInfo.prototype = {
	/**
	 * Return whether this locale commonly uses the 12- or the 24-hour clock.
	 *  
	 * @returns {string} "12" if the locale commonly uses a 12-hour clock, or "24"
	 * if the locale commonly uses a 24-hour clock. 
	 */
	getClock: function() {
		return this.info.clock;
	},

	/**
	 * Return the locale that this info object was created with.
	 * @returns {ilib.Locale} The locale spec of the locale used to construct this info instance
	 */
	getLocale: function () {
		return this.locale;
	},
	
	/**
	 * Return the name of the measuring system that is commonly used in the given locale.
	 * Valid values are "uscustomary", "imperial", and "metric".
	 * 
	 * @returns {string} The name of the measuring system commonly used in the locale
	 */
	getUnits: function () {
		return this.info.units;
	},
	
	/**
	 * Return the name of the calendar that is commonly used in the given locale.
	 * 
	 * @returns {string} The name of the calendar commonly used in the locale
	 */
	getCalendar: function () {
		return this.info.calendar;
	},
	
	/**
	 * Return the day of week that starts weeks in the current locale. Days are still
	 * numbered the standard way with 0 for Sunday through 6 for Saturday, but calendars 
	 * should be displayed and weeks calculated with the day of week returned from this 
	 * function as the first day of the week.
	 * 
	 * @returns {number} the day of the week that starts weeks in the current locale.
	 */
	getFirstDayOfWeek: function () {
		return this.info.firstDayOfWeek;
	},
	
	/**
	 * Return the default time zone for this locale. Many locales span across multiple
	 * time zones. In this case, the time zone with the largest population is chosen
	 * to represent the locale. This is obviously not that accurate, but then again,
	 * this method's return value should only be used as a default anyways.
	 * @returns {string} the default time zone for this locale.
	 */
	getTimeZone: function () {
		return this.info.timezone;
	},
	
	/**
	 * Return the decimal separator for formatted numbers in this locale.
	 * @returns {string} the decimal separator char
	 */
	getDecimalSeparator: function () {
		return this.info.numfmt.decimalChar;
	},
	
	/**
	 * Return the separator character used to separate groups of digits on the 
	 * integer side of the decimal character.
	 * @returns {string} the grouping separator char
	 */
	getGroupingSeparator: function () {
		return this.info.numfmt.groupChar;
	},
	
	/**
	 * Return the minimum number of digits grouped together on the integer side. 
	 * In western European cultures, groupings are in 1000s, so the number of digits
	 * is 3. In other cultures, the groupings are in 10000s so the number is 4.
	 * @returns {number} the number of digits in a grouping, or 0 for no grouping
	 */
	getGroupingDigits: function () {
		return this.info.numfmt.groupSize;
	},
	
	/**
	 * Return the format template used to format percentages in this locale.
	 * @returns {string} the format template for formatting percentages
	 */
	getPercentageFormat: function () {
		return this.info.numfmt.pctFmt;
	},
	
	/**
	 * Return the symbol used for percentages in this locale.
	 * @returns {string} the symbol used for percentages in this locale
	 */
	getPercentageSymbol: function () {
		return this.info.numfmt.pctChar || "%";
	},

	/**
	 * Return an object containing the format templates for formatting currencies
	 * in this locale. The object has a number of properties in it that each are
	 * a particular style of format. Normally, this contains a "common" and an "iso"
	 * style, but may contain others in the future.
	 * @returns {Object} an object containing the format templates for currencies
	 */
	getCurrencyFormats: function () {
		return this.info.currencyFormats;
	},

	/**
	 * Return the currency that is legal in the locale, or which is most commonly 
	 * used in regular commerce.
	 * @returns {string} the ISO 4217 code for the currency of this locale
	 */
	getCurrency: function () {
		return this.info.currency;
	},
	
	/**
	 * If this locale typically uses a different type of rounding for numeric
	 * formatting other than halfdown, especially for currency, then it can be 
	 * specified in the localeinfo. If the locale uses the default, then this 
	 * method returns undefined. The locale's rounding method overrides the 
	 * rounding method for the currency itself, which can sometimes shared 
	 * between various locales so it is less specific.
	 * @returns {string} the name of the rounding mode typically used in this
	 * locale, or "halfdown" if the locale does not override the default
	 */
	getRoundingMode: function () {
		return this.info.numfmt.roundingMode;
	},
	
	/**
	 * Return the default script used to write text in the language of this 
	 * locale. Text for most languages is written in only one script, but there
	 * are some languages where the text can be written in a number of scripts,
	 * depending on a variety of things such as the region, ethnicity, religion, 
	 * etc. of the author. This method returns the default script for the
	 * locale, in which the language is most commonly written.<p> 
	 * 
	 * The script is returned as an ISO 15924 4-letter code.
	 * 
	 * @returns {string} the ISO 15924 code for the default script used to write
	 * text in this locale 
	 */
	getDefaultScript: function() {
		return (this.info.scripts) ? this.info.scripts[0] : "Latn";
	},
	
	/**
	 * Return the script used for the current locale. If the current locale
	 * explicitly defines a script, then this script is returned. If not, then 
	 * the default script for the locale is returned.
	 * 
	 * @see ilib.LocaleInfo.getDefaultScript
	 * @returns {string} the ISO 15924 code for the script used to write
	 * text in this locale
	 */
	getScript: function() {
		return this.locale.getScript() || this.getDefaultScript(); 
	},
	
	/**
	 * Return an array of script codes which are used to write text in the current
	 * language. Text for most languages is written in only one script, but there
	 * are some languages where the text can be written in a number of scripts,
	 * depending on a variety of things such as the region, ethnicity, religion, 
	 * etc. of the author. This method returns an array of script codes in which 
	 * the language is commonly written.
	 * 
	 * @returns {Array.<string>} an array of ISO 15924 codes for the scripts used 
	 * to write text in this language
	 */
	getAllScripts: function() {
		return this.info.scripts || ["Latn"];
	},
	
	/**
	 * Return an ilib.Locale instance that is fully specified based on partial information
	 * given to the constructor of this locale info instance. For example, if the locale
	 * spec given to this locale info instance is simply "ru" (for the Russian language), 
	 * then it will fill in the missing region and script tags and return a locale with 
	 * the specifier "ru-RU-Cyrl". (ie. Russian language, Russian Federation, Cyrillic).
	 * Any one or two of the language, script, or region parts may be left unspecified,
	 * and the other one or two parts will be filled in automatically. If this
	 * class has no information about the given locale, then the locale of this
	 * locale info instance is returned unchanged.
	 * 
	 * @returns {ilib.Locale} the most likely completion of the partial locale given
	 * to the constructor of this locale info instance
	 */
	getLikelyLocale: function () {
		if (typeof(ilib.data.likelylocales[this.locale.getSpec()]) === 'undefined') {
			return this.locale;
		}
		
		return new ilib.Locale(ilib.data.likelylocales[this.locale.getSpec()]);
	}
};

/*
 * calendar.js - Represent a calendar object.
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends
ilibglobal.js
locale.js
localeinfo.js
*/

/**
 * Interface that all calendars must implement.
 * 
 * Depends directive: !depends calendar.js
 * 
 * @interface
 * @protected
 */
ilib.Cal = function() {
};

/**
 * Factory method to create a new instance of a calendar subclass.<p>
 * 
 * The options parameter can be an object that contains the following
 * properties:
 * 
 * <ul>
 * <li><i>type</i> - specify the type of the calendar desired. The
 * list of valid values changes depending on which calendars are 
 * defined. When assembling your iliball.js, include those calendars 
 * you wish to use in your program or web page, and they will register 
 * themselves with this factory method. The "official", "gregorian",
 * and "julian" calendars are all included by default, as they are the
 * standard calendars for much of the world.
 * <li><i>locale</i> - some calendars vary depending on the locale.
 * For example, the "official" calendar transitions from a Julian-style
 * calendar to a Gregorian-style calendar on a different date for
 * each country, as the governments of those countries decided to
 * adopt the Gregorian calendar at different times. 
 * </ul>
 * 
 * If a locale is specified, but no type, then the calendar that is default for
 * the locale will be instantiated and returned. If neither the type nor
 * the locale are specified, then the calendar for the default locale will
 * be used. 
 * 
 * @param {Object=} options options controlling the construction of this instance, or
 * undefined to use the default options
 * @return {ilib.Cal} an instance of a calendar object of the appropriate type
 */
ilib.Cal.newInstance = function (options) {
	var locale = options && options.locale,
	type = options && options.type,
	cons;

	if (!locale) {
		locale = new ilib.Locale();	// default locale
	}
	
	if (!type) {
		var info = new ilib.LocaleInfo(locale);
		type = info.getCalendar();
	}
	
	cons = ilib.Cal._constructors[type];
	
	// pass the same options through to the constructor so the subclass
	// has the ability to do something with if it needs to
	return cons && new cons(options);
};

/* place for the subclasses to put their constructors so that the factory method
 * can find them. Do this to add your calendar after it's defined: 
 * ilib.Cal._constructors["mytype"] = ilib.Cal.MyTypeConstructor;
 */
ilib.Cal._constructors = {};

/**
 * Return an array of known calendar types that the factory method can instantiate.
 * 
 * @return {Array.<string>} an array of calendar types
 */
ilib.Cal.getCalendars = function () {
	var arr = [],
		c;
	
	for (c in ilib.Cal._constructors) {
		if (c && ilib.Cal._constructors[c]) {
			arr.push(c); // code like a pirate
		}
	}
	
	return arr;
};

ilib.Cal.prototype = {
	/**
	 * Return the type of this calendar.
	 * 
	 * @return {string} the name of the type of this calendar 
	 */
	getType: function() {
		throw "Cannot call methods of abstract class ilib.Cal";
	},
	
	/**
	 * Return the number of months in the given year. The number of months in a year varies
	 * for some luni-solar calendars because in some years, an extra month is needed to extend the 
	 * days in a year to an entire solar year. The month is represented as a 1-based number
	 * where 1=first month, 2=second month, etc.
	 * 
	 * @param {number} year a year for which the number of months is sought
	 * @return {number} The number of months in the given year
	 */
	getNumMonths: function(year) {
		throw "Cannot call methods of abstract class ilib.Cal";
	},
	
	/**
	 * Return the number of days in a particular month in a particular year. This function
	 * can return a different number for a month depending on the year because of things
	 * like leap years.
	 * 
	 * @param {number} month the month for which the length is sought
	 * @param {number} year the year within which that month can be found
	 * @return {number} the number of days within the given month in the given year
	 */
	getMonLength: function(month, year) {
		throw "Cannot call methods of abstract class ilib.Cal";
	},
	
	/**
	 * Return true if the given year is a leap year in this calendar.
	 * The year parameter may be given as a number.
	 * 
	 * @param {number} year the year for which the leap year information is being sought
	 * @return {boolean} true if the given year is a leap year
	 */
	isLeapYear: function(year) {
		throw "Cannot call methods of abstract class ilib.Cal";
	}
};

/*
 * julianday.js - A Julian date object.
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends locale.js */

/**
 * @class
 * A Julian Day class. A Julian Day is a date based on the Julian Day count
 * of time invented by Joseph Scaliger in 1583 for use with astronomical calculations. 
 * Do not confuse it with a date in the Julian calendar, which it has very
 * little in common with. The naming is unfortunately close, and comes from history.<p>
 * 
 * Depends directive: !depends julianday.js
 * 
 * @constructor
 * @param {number} num the Julian Day expressed as a floating point number 
 */
ilib.JulianDay = function(num) {
	this.jd = num;
	this.days = Math.floor(this.jd);
	this.frac = num - this.days;
};

ilib.JulianDay.prototype = {
	/**
	 * Return the integral portion of this Julian Day instance. This corresponds to
	 * the number of days since the beginning of the epoch.
	 * 
	 * @return {number} the integral portion of this Julian Day
	 */
	getDays: function() {
		return this.days;
	},
	
	/**
	 * Set the date of this Julian Day instance.
	 * 
	 * @param {number} days the julian date expressed as a floating point number
	 */
	setDays: function(days) {
		this.days = Math.floor(days);
		this.jd = this.days + this.frac;
	},
	
	/**
	 * Return the fractional portion of this Julian Day instance. This portion 
	 * corresponds to the time of day for the instance.
	 */
	getDayFraction: function() {
		return this.frac;
	},
	
	/**
	 * Set the fractional part of the Julian Day. The fractional part represents
	 * the portion of a fully day. Julian dates start at noon, and proceed until
	 * noon of the next day. That would mean midnight is represented as a fractional
	 * part of 0.5.
	 * 
	 * @param {number} fraction The fractional part of the Julian date
	 */
	setDayFraction: function(fraction) {
		var t = Math.floor(fraction);
		this.frac = fraction - t;
		this.jd = this.days + this.frac;
	},
	
	/** 
	 * Return the Julian Day expressed as a floating point number.
	 * @return {number} the Julian Day as a number
	 */
	getDate: function () {
		return this.jd;
	},
	
	/**
	 * Set the date of this Julian Day instance.
	 * 
	 * @param {number} num the numeric Julian Day to set into this instance
	 */
	setDate: function (num) {
		this.jd = num;
	},
	
	/**
	 * Add an offset to the current date instance. The offset should be expressed in
	 * terms of Julian days. That is, each integral unit represents one day of time, and
	 * fractional part represents a fraction of a regular 24-hour day.
	 * 
	 * @param {number} offset an amount to add (or subtract) to the current result instance.
	 */
	addDate: function(offset) {
		if (typeof(offset) === 'number') {
			this.jd += offset;
			this.days = Math.floor(this.jd);
			this.frac = this.jd - this.days;
		}
	}
};

/*
 * gregorian.js - Represent a Gregorian calendar object.
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/* !depends calendar.js locale.js date.js julianday.js util/utils.js */

/**
 * @class
 * Construct a new Gregorian calendar object. This class encodes information about
 * a Gregorian calendar.<p>
 * 
 * Depends directive: !depends gregorian.js
 * 
 * @constructor
 * @implements ilib.Cal
 */
ilib.Cal.Gregorian = function() {
	this.type = "gregorian";
};

/**
 * @private
 * @const
 * @type Array.<number> 
 * the lengths of each month 
 */
ilib.Cal.Gregorian.monthLengths = [
	31,  /* Jan */
	28,  /* Feb */
	31,  /* Mar */
	30,  /* Apr */
	31,  /* May */
	30,  /* Jun */
	31,  /* Jul */
	31,  /* Aug */
	30,  /* Sep */
	31,  /* Oct */
	30,  /* Nov */
	31   /* Dec */
];

/**
 * Return the number of months in the given year. The number of months in a year varies
 * for some luni-solar calendars because in some years, an extra month is needed to extend the 
 * days in a year to an entire solar year. The month is represented as a 1-based number
 * where 1=first month, 2=second month, etc.
 * 
 * @param {number} year a year for which the number of months is sought
 * @return {number} The number of months in the given year
 */
ilib.Cal.Gregorian.prototype.getNumMonths = function(year) {
	return 12;
};

/**
 * Return the number of days in a particular month in a particular year. This function
 * can return a different number for a month depending on the year because of things
 * like leap years.
 * 
 * @param {number} month the month for which the length is sought
 * @param {number} year the year within which that month can be found
 * @return {number} the number of days within the given month in the given year
 */
ilib.Cal.Gregorian.prototype.getMonLength = function(month, year) {
	if (month !== 2 || !this.isLeapYear(year)) {
		return ilib.Cal.Gregorian.monthLengths[month-1];
	} else {
		return 29;
	}
};

/**
 * Return true if the given year is a leap year in the Gregorian calendar.
 * The year parameter may be given as a number, or as a GregDate object.
 * @param {number|ilib.Date.GregDate} year the year for which the leap year information is being sought
 * @return {boolean} true if the given year is a leap year
 */
ilib.Cal.Gregorian.prototype.isLeapYear = function(year) {
	var y = (typeof(year) === 'number' ? year : year.getYears());
	var centuries = ilib.mod(y, 400);
	return (ilib.mod(y, 4) === 0 && centuries !== 100 && centuries !== 200 && centuries !== 300);
};

/**
 * Return the type of this calendar.
 * 
 * @return {string} the name of the type of this calendar 
 */
ilib.Cal.Gregorian.prototype.getType = function() {
	return this.type;
};

/**
 * Return a date instance for this calendar type using the given
 * options.
 * @param {Object} options options controlling the construction of 
 * the date instance
 * @return {ilib.Date} a date appropriate for this calendar type
 */
ilib.Cal.Gregorian.prototype.newDateInstance = function (options) {
	return new ilib.Date.GregDate(options);
};

/* register this calendar for the factory method */
ilib.Cal._constructors["gregorian"] = ilib.Cal.Gregorian;

/*
 * gregoriandate.js - Represent a date in the Gregorian calendar
 * 
 * Copyright © 2012-2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends date.js calendar/gregorian.js util/utils.js localeinfo.js julianday.js */

/**
 * @class
 * 
 * Construct a new Gregorian date object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970.
 * 
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 * 
 * <li><i>year</i> - any integer, including 0
 * 
 * <li><i>month</i> - 1 to 12, where 1 means January, 2 means February, etc.
 * 
 * <li><i>day</i> - 1 to 31
 * 
 * <li><i>hour</i> - 0 to 23. A formatter is used to display 12 hour clocks, but this representation 
 * is always done with an unambiguous 24 hour representation
 * 
 * <li><i>minute</i> - 0 to 59
 * 
 * <li><i>second</i> - 0 to 59
 * 
 * <li><i>millisecond</i> - 0 to 999
 * 
 * <li><i>timezone</i> - the ilib.TimeZone instance or time zone name as a string 
 * of this gregorian date. The date/time is kept in the local time. The time zone
 * is used later if this date is formatted according to a different time zone and
 * the difference has to be calculated, or when the date format has a time zone
 * component in it.
 * 
 * <li><i>locale</i> - locale for this gregorian date. If the time zone is not 
 * given, it can be inferred from this locale. For locales that span multiple
 * time zones, the one with the largest population is chosen as the one that 
 * represents the locale. 
 * </ul>
 *
 * If the constructor is called with another Gregorian date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above 
 * from <i>unixtime</i> through <i>millisecond</i> are present, then the date 
 * components are 
 * filled in with the current date at the time of instantiation. Note that if
 * you do not give the time zone when defaulting to the current time and the 
 * time zone for all of ilib was not set with <i>ilib.setTimeZone()</i>, then the
 * time zone will default to UTC ("Universal Time, Coordinated" or "Greenwich 
 * Mean Time").<p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * Depends directive: !depends gregoriandate.js
 * 
 * @constructor
 * @extends ilib.Date
 * @param {Object=} params parameters that govern the settings and behaviour of this Gregorian date
 */
ilib.Date.GregDate = function(params) {
	this.cal = new ilib.Cal.Gregorian();

	if (params) {
		if (params.timezone) {
			this.timezone = params.timezone;
		}
		if (params.locale) {
			this.locale = (typeof(params.locale) === 'string') ? new ilib.Locale(params.locale) : params.locale;
			if (!this.timezone) {
				var li = new ilib.LocaleInfo(this.locale);
				this.timezone = li.getTimeZone(); 
			}
		}
		
		if (typeof(params.unixtime) != 'undefined') {
			this.setTime(parseInt(params.unixtime, 10));
		} else if (typeof(params.julianday) != 'undefined') {
			this.setJulianDay(parseFloat(params.julianday));
		} else if (params.year || params.month || params.day || params.hour ||
				params.minute || params.second || params.millisecond ) {
			this.year = parseInt(params.year, 10) || 0;
			this.month = parseInt(params.month, 10) || 1;
			this.day = parseInt(params.day, 10) || 1;
			this.hour = parseInt(params.hour, 10) || 0;
			this.minute = parseInt(params.minute, 10) || 0;
			this.second = parseInt(params.second, 10) || 0;
			this.millisecond = parseInt(params.millisecond, 10) || 0;
		} else if (typeof(params.rd) != 'undefined') {
			// private parameter. Do not document this!
			this.setRd(params.rd);
		} else {
			// Date.getTime() gets unix time in UTC
			var now = new Date();
			this.setTime(now.getTime() - now.getTimezoneOffset()*60000);
		}
	} else {
		// Date.getTime() gets unix time in UTC
		var now = new Date();
		this.setTime(now.getTime() - now.getTimezoneOffset()*60000);
	}
};

ilib.Date.GregDate.prototype = new ilib.Date();
ilib.Date.GregDate.prototype.parent = ilib.Date;
ilib.Date.GregDate.prototype.constructor = ilib.Date.GregDate;

/**
 * @private
 * @const
 * @type Array.<number>
 * the cumulative lengths of each month, for a non-leap year 
 */
ilib.Date.GregDate.cumMonthLengths = [
    0,   /* Jan */
	31,  /* Feb */
	59,  /* Mar */
	90,  /* Apr */
	120, /* May */
	151, /* Jun */
	181, /* Jul */
	212, /* Aug */
	243, /* Sep */
	273, /* Oct */
	304, /* Nov */
	334, /* Dec */
	365
];

/**
 * @private
 * @const
 * @type Array.<number>
 * the cumulative lengths of each month, for a leap year 
 */
ilib.Date.GregDate.cumMonthLengthsLeap = [
	0,   /* Jan */
	31,  /* Feb */
	60,  /* Mar */
	91,  /* Apr */
	121, /* May */
	152, /* Jun */
	182, /* Jul */
	213, /* Aug */
	244, /* Sep */
	274, /* Oct */
	305, /* Nov */
	335, /* Dec */
	366
];

/**
 * @private
 * @const
 * @type number
 * the difference between a zero Julian day and the first Gregorian date. 
 */
ilib.Date.GregDate.epoch = 1721424.5;

/**
 * @private
 * Return the Rata Die (fixed day) number of the given date.
 * 
 * @param {Object} date the date components to calculate
 * @return {number} the rd date as a number
 */
ilib.Date.GregDate.prototype.calcRataDie = function(date) {
	var years = 365 * (date.year - 1) +
		Math.floor((date.year-1)/4) -
		Math.floor((date.year-1)/100) +
		Math.floor((date.year-1)/400);
	var dayInYear = (date.month > 1 ? ilib.Date.GregDate.cumMonthLengths[date.month-1] : 0) +
		date.day +
		(this.cal.isLeapYear(date.year) && date.month > 2 ? 1 : 0);
	var rdtime = (date.hour * 3600000 +
		date.minute * 60000 +
		date.second * 1000 +
		date.millisecond) / 
		86400000; 
	/*
	debug("getRataDie: converting " +  JSON.stringify(this));
	debug("getRataDie: year is " +  years);
	debug("getRataDie: day in year is " +  dayInYear);
	debug("getRataDie: rdtime is " +  rdtime);
	debug("getRataDie: rd is " +  (years + dayInYear + rdtime));
	*/
	return years + dayInYear + rdtime;
};

/**
 * @private
 * Return the Rata Die (fixed day) number of this date.
 * 
 * @return {number} the rd date as a number
 */
ilib.Date.GregDate.prototype.getRataDie = function() {
	return this.calcRataDie(this);
};

/**
 * @private
 * Calculate date components for the given RD date.
 * @param {number} rd the RD date to calculate components for
 * @return {Object} object containing the component fields
 */
ilib.Date.GregDate.prototype.calcComponents = function (rd) {
	var days400,
		days100,
		days4,
		days1,
		day,
		years400,
		years100,
		years4,
		years1,
		year,
		month,
		remainder,
		jdstart,
		cumulative,
		ret = {};
	
	years400 = Math.floor((rd - 1) / 146097);
	days400 = ilib.mod((rd - 1), 146097);
	years100 = Math.floor(days400 / 36524);
	days100 = ilib.mod(days400, 36524);
	years4 = Math.floor(days100 / 1461);
	days4 = ilib.mod(days100, 1461);
	years1 = Math.floor(days4 / 365);
	days1 = ilib.mod(days4, 365) + 1;

	/*
	console.log("rd starts out " + rd);
	console.log("years400 is " + years400);
	console.log("days400 is " + days400);
	console.log("years100 is " + years100);
	console.log("days100 is " + days100);
	console.log("years4 is " + years4);
	console.log("days4 is " + days4);
	console.log("years1 is " + years1);
	console.log("days1 is " + days1);
	*/
	
	ret.year = 400 * years400 + 100 * years100 + 4 * years4 + years1;
	if (years100 !== 4 && years1 !== 4) {
		ret.year++;
	}
	ret.month = 1;
	ret.day = 1;
	ret.hour = 0;
	ret.minute = 0;
	ret.second = 0;
	ret.millisecond = 0;
	
	remainder = rd - this.calcRataDie(ret) + 1;
	
	cumulative = this.cal.isLeapYear(ret.year) ? 
		ilib.Date.GregDate.cumMonthLengthsLeap : 
		ilib.Date.GregDate.cumMonthLengths; 
	
	ret.month = ilib.bsearch(Math.floor(remainder), cumulative);
	remainder = remainder - cumulative[ret.month-1];
	
	ret.day = Math.floor(remainder);
	remainder -= ret.day;
	// now convert to milliseconds for the rest of the calculation
	remainder = Math.round(remainder * 86400000);
	
	ret.hour = Math.floor(remainder/3600000);
	remainder -= ret.hour * 3600000;
	
	ret.minute = Math.floor(remainder/60000);
	remainder -= ret.minute * 60000;
	
	ret.second = Math.floor(remainder/1000);
	remainder -= ret.second * 1000;
	
	ret.millisecond = remainder;
	
	return ret;
};

/**
 * @private
 * Set the date components of this instance based on the given rd.
 * @param {number} rd the rata die date to set
 */
ilib.Date.GregDate.prototype.setRd = function (rd) {
	var fields = this.calcComponents(rd);
	
	/**
	 * Year in the Gregorian calendar.
	 * @type number
	 */
	this.year = fields.year;
	
	/**
	 * The month number, ranging from 1 (January) to 12 (December).
	 * @type number
	 */
	this.month = fields.month;
	
	/**
	 * The day of the month. This ranges from 1 to 31.
	 * @type number
	 */
	this.day = fields.day;
	
	/**
	 * The hour of the day. This can be a number from 0 to 23, as times are
	 * stored unambiguously in the 24-hour clock.
	 * @type number
	 */
	this.hour = fields.hour;
	
	/**
	 * The minute of the hours. Ranges from 0 to 59.
	 * @type number
	 */
	this.minute = fields.minute;
	
	/**
	 * The second of the minute. Ranges from 0 to 59.
	 * @type number
	 */
	this.second = fields.second;
	
	/**
	 * The millisecond of the second. Ranges from 0 to 999.
	 * @type number
	 */
	this.millisecond = fields.millisecond;
};

/**
 * Set the date of this instance using a Julian Day.
 * @param {number} date the Julian Day to use to set this date
 */
ilib.Date.GregDate.prototype.setJulianDay = function (date) {
	var jd = (typeof(date) === 'number') ? new ilib.JulianDay(date) : date,
		rd;	// rata die -- # of days since the beginning of the calendar
	
	rd = jd.getDate() - ilib.Date.GregDate.epoch; 	// Julian Days start at noon
	this.setRd(rd);
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 * 
 * @return {number} the day of the week
 */
ilib.Date.GregDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.getRataDie());
	return ilib.mod(rd, 7);
};

/**
 * @private
 * Return the rd of the particular day of the week on or before the given rd.
 * eg. The Sunday on or before the given rd.
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the reference date
 * @return {number} the day of the week
 */
ilib.Date.GregDate.prototype.onOrBeforeRd = function(rd, dayOfWeek) {
	return rd - ilib.mod(Math.floor(rd) - dayOfWeek, 7);
};

/**
 * @private
 * Return the rd of the particular day of the week on or before the given rd.
 * eg. The Sunday on or before the given rd.
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the reference date
 * @return {number} the day of the week
 */
ilib.Date.GregDate.prototype.onOrAfterRd = function(rd, dayOfWeek) {
	return this.onOrBeforeRd(rd+6, dayOfWeek);
};

/**
 * @private
 * Return the rd of the particular day of the week before the given rd.
 * eg. The Sunday before the given rd.
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the reference date
 * @return {number} the day of the week
 */
ilib.Date.GregDate.prototype.beforeRd = function(rd, dayOfWeek) {
	return this.onOrBeforeRd(rd-1, dayOfWeek);
};

/**
 * @private
 * Return the rd of the particular day of the week after the given rd.
 * eg. The Sunday after the given rd.
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the reference date
 * @return {number} the day of the week
 */
ilib.Date.GregDate.prototype.afterRd = function(rd, dayOfWeek) {
	return this.onOrBeforeRd(rd+7, dayOfWeek);
};

/**
 * @private
 * Return the rd of the first Sunday of the given ISO year.
 * @param {number} year the year for which the first Sunday is being sought
 * @return the rd of the first Sunday of the ISO year
 */
ilib.Date.GregDate.prototype.firstSunday = function (year) {
	var jan1 = this.calcRataDie({
		year: year,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	});
	var firstThu = this.onOrAfterRd(jan1, 4);
	return this.beforeRd(firstThu, 0);
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week before the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week before the current date that is being sought
 * @return {ilib.Date.GregDate} the date being sought
 */
ilib.Date.GregDate.prototype.before = function (dow) {
	return new ilib.Date.GregDate({rd: this.beforeRd(this.getRataDie(), dow)});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week after the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week after the current date that is being sought
 * @return {ilib.Date.GregDate} the date being sought
 */
ilib.Date.GregDate.prototype.after = function (dow) {
	return new ilib.Date.GregDate({rd: this.afterRd(this.getRataDie(), dow)});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week on or before the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week on or before the current date that is being sought
 * @return {ilib.Date.GregDate} the date being sought
 */
ilib.Date.GregDate.prototype.onOrBefore = function (dow) {
	return new ilib.Date.GregDate({rd: this.onOrBeforeRd(this.getRataDie(), dow)});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week on or after the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week on or after the current date that is being sought
 * @return {ilib.Date.GregDate} the date being sought
 */
ilib.Date.GregDate.prototype.onOrAfter = function (dow) {
	return new ilib.Date.GregDate({rd: this.onOrAfterRd(this.getRataDie(), dow)});
};

/**
 * Return the ISO 8601 week number in the current year for the current date. The week
 * number ranges from 1 to 53, as some years have 53 weeks assigned to them, and most
 * only 52.
 * 
 * @return {number} the week number for the current date
 */
ilib.Date.GregDate.prototype.getWeekOfYear = function() {
	var rd = Math.floor(this.getRataDie()),
		yearStart = this.firstSunday(this.year),
		nextYear;
	
	// if we have a January date, it may be in this ISO year or the previous year
	if (rd < yearStart) {
		yearStart = this.firstSunday(this.year-1);
	} else if (this.month == 12 && this.day > 25) {
		// if we have a late December date, it may be in this ISO year, or the next year
		nextYear = this.firstSunday(this.year+1);
		if (rd >= nextYear) {
			yearStart = nextYear;
		}
	}
	
	return Math.floor((rd-yearStart)/7) + 1;
};

/**
 * Return the ordinal day of the year. Days are counted from 1 and proceed linearly up to 
 * 365, regardless of months or weeks, etc. That is, January 1st is day 1, and 
 * December 31st is 365 in regular years, or 366 in leap years.
 * @return {number} the ordinal day of the year
 */
ilib.Date.GregDate.prototype.getDayOfYear = function() {
	var cumulativeMap = this.cal.isLeapYear(this.year) ? 
		ilib.Date.GregDate.cumMonthLengthsLeap : 
		ilib.Date.GregDate.cumMonthLengths; 
		
	return cumulativeMap[this.month-1] + this.day;
};

/**
 * Return the ordinal number of the week within the month. The first week of a month is
 * the first one that contains 4 or more days in that month. If any days precede this
 * first week, they are marked as being in week 0. This function returns values from 0
 * through 6.<p>
 * 
 * The locale is a required parameter because different locales that use the same 
 * Gregorian calendar consider different days of the week to be the beginning of
 * the week. This can affect the week of the month in which some days are located.
 * 
 * @param {ilib.Locale|string} locale the locale or locale spec to use when figuring out 
 * the first day of the week
 * @return {number} the ordinal number of the week within the current month
 */
ilib.Date.GregDate.prototype.getWeekOfMonth = function(locale) {
	var li = new ilib.LocaleInfo(locale),
		first = this.calcRataDie({
			year: this.year,
			month: this.month,
			day: 1,
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0
		}),
		rd = this.getRataDie(),
		weekStart = this.onOrAfterRd(first, li.getFirstDayOfWeek());
	if (weekStart - first > 3) {
		// if the first week has 4 or more days in it of the current month, then consider
		// that week 1. Otherwise, it is week 0. To make it week 1, move the week start
		// one week earlier.
		weekStart -= 7;
	}
	return Math.floor((rd - weekStart) / 7) + 1;
};

/**
 * Return the era for this date as a number. The value for the era for Gregorian 
 * calendars is -1 for "before the common era" (BCE) and 1 for "the common era" (CE). 
 * BCE dates are any date before Jan 1, 1 CE. In the proleptic Gregorian calendar, 
 * there is a year 0, so any years that are negative or zero are BCE. In the Julian
 * calendar, there is no year 0. Instead, the calendar goes straight from year -1 to 
 * 1.
 * @return {number} 1 if this date is in the common era, -1 if it is before the 
 * common era 
 */
ilib.Date.GregDate.prototype.getEra = function() {
	return (this.year < 1) ? -1 : 1;
};

/**
 * Return the unix time equivalent to this Gregorian date instance. Unix time is
 * the number of milliseconds since midnight on Jan 1, 1970. This method only
 * returns a valid number for dates between midnight, Jan 1, 1970 and  
 * Jan 19, 2038 at 3:14:07am when the unix time runs out. If this instance 
 * encodes a date outside of that range, this method will return -1. This method
 * returns the time in the local time zone, not in UTC.
 * 
 * @return {number} a number giving the unix time, or -1 if the date is outside the
 * valid unix time range
 */
ilib.Date.GregDate.prototype.getTime = function() {
	var rd = this.calcRataDie({
		year: this.year,
		month: this.month,
		day: this.day,
		hour: this.hour,
		minute: this.minute,
		second: this.second,
		millisecond: 0
	});

	// earlier than Jan 1, 1970
	// or later than Jan 19, 2038 at 3:14:07am
	if (rd < 719163 || rd > 744018.134803241) { 
		return -1;
	}

	// avoid the rounding errors in the floating point math by only using
	// the whole days from the rd, and then calculating the milliseconds directly
	var seconds = Math.floor(rd - 719163) * 86400 + 
		this.hour * 3600 +
		this.minute * 60 +
		this.second;
	var millis = seconds * 1000 + this.millisecond;
	
	return millis;
};

/**
 * Set the time of this instance according to the given unix time. Unix time is
 * the number of milliseconds since midnight on Jan 1, 1970.
 * 
 * @param {number} millis the unix time to set this date to in milliseconds 
 */
ilib.Date.GregDate.prototype.setTime = function(millis) {
	var rd = 719163 + millis / 86400000;
	this.setRd(rd);
};

/**
 * Return a Javascript Date object that is equivalent to this Gregorian date
 * object.
 * 
 * @return {Date|undefined} a javascript Date object
 */
ilib.Date.GregDate.prototype.getJSDate = function() {
	var unix = this.getTime();
	return (unix === -1) ? undefined : new Date(unix); 
};

/**
 * Return the Julian Day equivalent to this calendar date as a number.
 * This returns the julian day in the local time zone.
 * 
 * @return {number} the julian date equivalent of this date
 */
ilib.Date.GregDate.prototype.getJulianDay = function() {
	return this.getRataDie() + ilib.Date.GregDate.epoch;
};

/**
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
ilib.Date.GregDate.prototype.getCalendar = function() {
	return "gregorian";
};

/**
 * Return the time zone associated with this Gregorian date, or 
 * undefined if none was specified in the constructor.
 * 
 * @return {string|undefined} the name of the time zone for this date instance
 */
ilib.Date.GregDate.prototype.getTimeZone = function() {
	return this.timezone;
};

/**
 * Set the time zone associated with this Gregorian date.
 * @param {string} tzName the name of the time zone to set into this date instance,
 * or "undefined" to unset the time zone 
 */
ilib.Date.GregDate.prototype.setTimeZone = function (tzName) {
	if (!tzName || tzName === "") {
		// same as undefining it
		this.timezone = undefined;
	} else if (typeof(tzName) === 'string') {
		this.timezone = tzName;
	}
};

// register with the factory method
ilib.Date._constructors["gregorian"] = ilib.Date.GregDate;
ilib.data.timezones = {"Europe/Sofia":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Africa/Douala":{"o":"1:0","f":"WAT"},"America/Dawson":{"o":"-8:0","f":"P{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Asia/Bangkok":{"o":"7:0","f":"ICT"},"Asia/Yerevan":{"o":"4:0","f":"AMT"},"America/Bogota":{"o":"-5:0","f":"CO{c}T","e":{"m":4,"r":"4","t":"0:0"},"s":{"m":5,"r":"3","t":"0:0","v":"1:0","c":"S"}},"Asia/Colombo":{"o":"5:30","f":"IST"},"Africa/Kampala":{"o":"3:0","f":"EAT"},"Africa/Blantyre":{"o":"2:0","f":"CAT"},"Europe/Volgograd":{"o":"4:0","f":"VOLT"},"Atlantic/St_Helena":{"o":"0:0","f":"GMT"},"Africa/Malabo":{"o":"1:0","f":"WAT"},"Asia/Nicosia":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/Resolute":{"o":"-6:0","f":"C{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Danmarkshavn":{"o":"0:0","f":"GMT"},"America/Regina":{"o":"-6:0","f":"CST"},"America/Anguilla":{"o":"-4:0","f":"AST"},"Asia/Amman":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l5","t":"0:0","z":"s"},"s":{"m":3,"r":"l4","t":"24:0","v":"1:0","c":"S"}},"Europe/Brussels":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Europe/Simferopol":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/Argentina/Ushuaia":{"o":"-3:0","f":"ART"},"America/North_Dakota/Center":{"o":"-6:0","f":"C{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Indian/Kerguelen":{"o":"5:0","f":"TFT"},"Europe/Istanbul":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Pacific/Chuuk":{"o":"10:0","f":"CHUT"},"Etc/UTC":{"o":"0:0","f":"UTC"},"America/Bahia_Banderas":{"o":"-6:0","f":"C{c}T","e":{"m":10,"r":"l0","t":"2:0","c":"S"},"s":{"m":4,"r":"0>1","t":"2:0","v":"1:0","c":"D"}},"Pacific/Rarotonga":{"o":"-10:0","f":"CK{c}T","e":{"m":3,"r":"0>1","t":"0:0"},"s":{"m":10,"r":"l0","t":"0:0","v":"0:30","c":"HS"}},"Asia/Hebron":{"o":"2:0","f":"EET"},"Australia/Broken_Hill":{"o":"9:30","f":"CST","s":{"m":10,"r":"0>1","t":"2:0","z":"s","v":"1:0"},"e":{"m":4,"r":"0>1","t":"2:0","z":"s"}},"PST8PDT":{"o":"-8:0","f":"P{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Antarctica/Casey":{"o":"8:0","f":"WST"},"Europe/Stockholm":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Africa/Bamako":{"o":"0:0","f":"GMT"},"America/St_Johns":{"o":"-3:30","f":"N{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Africa/Dar_es_Salaam":{"o":"3:0","f":"EAT"},"Asia/Novosibirsk":{"o":"7:0","f":"NOVT"},"America/Argentina/Tucuman":{"o":"-3:0","f":"AR{c}T","e":{"m":3,"r":"0>15","t":"0:0"},"s":{"m":10,"r":"0>15","t":"0:0","v":"1:0","c":"S"}},"Asia/Sakhalin":{"o":"11:0","f":"SAKT"},"America/Curacao":{"o":"-4:0","f":"AST"},"Europe/Budapest":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Africa/Tunis":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"2:0","z":"s"},"s":{"m":3,"r":"l0","t":"2:0","z":"s","v":"1:0","c":"S"}},"Pacific/Guam":{"o":"10:0","f":"ChST"},"Africa/Asmara":{"o":"3:0","f":"EAT"},"Africa/Maseru":{"o":"2:0","f":"SAST"},"America/Asuncion":{"o":"-4:0","f":"PY{c}T","e":{"m":4,"r":"0>8","t":"0:0"},"s":{"m":10,"r":"0>1","t":"0:0","v":"1:0","c":"S"}},"America/Indiana/Winamac":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Europe/Vaduz":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Asia/Ulaanbaatar":{"o":"8:0","f":"ULA{c}T","s":{"m":3,"r":"l6","t":"2:0","v":"1:0","c":"S"},"e":{"m":9,"r":"l6","t":"2:0"}},"Asia/Vientiane":{"o":"7:0","f":"ICT"},"Africa/Niamey":{"o":"1:0","f":"WAT"},"America/Thunder_Bay":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Asia/Brunei":{"o":"8:0","f":"BNT"},"Africa/Djibouti":{"o":"3:0","f":"EAT"},"Asia/Tbilisi":{"o":"4:0","f":"GET"},"America/Merida":{"o":"-6:0","f":"C{c}T","e":{"m":10,"r":"l0","t":"2:0","c":"S"},"s":{"m":4,"r":"0>1","t":"2:0","v":"1:0","c":"D"}},"America/Recife":{"o":"-3:0","f":"BRT"},"Indian/Reunion":{"o":"4:0","f":"RET"},"Asia/Oral":{"o":"5:0","f":"ORAT"},"Africa/Lusaka":{"o":"2:0","f":"CAT"},"America/Tortola":{"o":"-4:0","f":"AST"},"Africa/Ouagadougou":{"o":"0:0","f":"GMT"},"Asia/Kuching":{"o":"8:0","f":"MYT"},"America/Tegucigalpa":{"o":"-6:0","f":"C{c}T","e":{"m":8,"r":"1>1","t":"0:0","c":"S"},"s":{"m":5,"r":"0>1","t":"0:0","v":"1:0","c":"D"}},"Asia/Novokuznetsk":{"o":"7:0","f":"NOVT"},"Asia/Bishkek":{"o":"6:0","f":"KGT"},"Europe/Vilnius":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/Moncton":{"o":"-4:0","f":"A{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Maceio":{"o":"-3:0","f":"BRT"},"Africa/Dakar":{"o":"0:0","f":"GMT"},"America/Belize":{"o":"-6:0","f":"C{c}T","e":{"m":2,"r":"12","t":"0:0","c":"S"},"s":{"m":12,"r":"18","t":"0:0","v":"1:0","c":"D"}},"Etc/GMT":{"o":"0:0","f":"GMT"},"America/Cuiaba":{"o":"-4:0","f":"AM{c}T","e":{"m":2,"r":"0>15","t":"0:0"},"s":{"m":10,"r":"0>15","t":"0:0","v":"1:0","c":"S"}},"Asia/Tashkent":{"o":"5:0","f":"UZT"},"Atlantic/Canary":{"o":"0:0","f":"WE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/Rankin_Inlet":{"o":"-6:0","f":"C{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Asia/Jerusalem":{"o":"2:0","f":"I{c}T","e":{"m":9,"r":"13","t":"2:0","c":"S"},"s":{"m":3,"r":"5>26","t":"2:0","v":"1:0","c":"D"}},"Antarctica/Rothera":{"o":"-3:0","f":"ROTT"},"Indian/Cocos":{"o":"6:30","f":"CCT"},"America/Glace_Bay":{"o":"-4:0","f":"A{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Atlantic/Cape_Verde":{"o":"-1:0","f":"CVT"},"America/Cambridge_Bay":{"o":"-7:0","f":"M{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Indian/Mauritius":{"o":"4:0","f":"MU{c}T","e":{"m":3,"r":"l0","t":"2:0"},"s":{"m":10,"r":"l0","t":"2:0","v":"1:0","c":"S"}},"Etc/GMT-14":{"o":"14:0","f":"GMT-14"},"Australia/Brisbane":{"o":"10:0","f":"EST","e":{"m":3,"r":"0>1","t":"2:0","z":"s"},"s":{"m":10,"r":"l0","t":"2:0","z":"s","v":"1:0"}},"Etc/GMT-13":{"o":"13:0","f":"GMT-13"},"Etc/GMT-12":{"o":"12:0","f":"GMT-12"},"Etc/GMT-11":{"o":"11:0","f":"GMT-11"},"America/Grenada":{"o":"-4:0","f":"AST"},"Etc/GMT-10":{"o":"10:0","f":"GMT-10"},"Antarctica/Vostok":{"o":"6:0","f":"VOST"},"Etc/GMT+11":{"o":"-11:0","f":"GMT+11"},"Etc/GMT+12":{"o":"-12:0","f":"GMT+12"},"Pacific/Auckland":{"o":"12:0","f":"NZ{c}T","e":{"m":4,"r":"0>1","t":"2:0","z":"s","c":"S"},"s":{"m":9,"r":"l0","t":"2:0","z":"s","v":"1:0","c":"D"}},"Antarctica/DumontDUrville":{"o":"10:0","f":"DDUT"},"Etc/GMT+10":{"o":"-10:0","f":"GMT+10"},"Africa/Nairobi":{"o":"3:0","f":"EAT"},"Pacific/Norfolk":{"o":"11:30","f":"NFT"},"Europe/Paris":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Asia/Irkutsk":{"o":"9:0","f":"IRKT"},"Pacific/Apia":{"o":"13:0","f":"WST"},"America/Caracas":{"o":"-4:30","f":"VET"},"Pacific/Chatham":{"o":"12:45","f":"CHA{c}T","e":{"m":4,"r":"0>1","t":"2:45","z":"s","c":"S"},"s":{"m":9,"r":"l0","t":"2:45","z":"s","v":"1:0","c":"D"}},"Africa/Maputo":{"o":"2:0","f":"CAT"},"America/Metlakatla":{"o":"-8:0","f":"MeST"},"Atlantic/South_Georgia":{"o":"-2:0","f":"GST"},"Asia/Baghdad":{"o":"3:0","f":"A{c}T","e":{"m":10,"r":"1","t":"3:0","z":"s","c":"S"},"s":{"m":4,"r":"1","t":"3:0","z":"s","v":"1:0","c":"D"}},"Pacific/Saipan":{"o":"10:0","f":"ChST"},"Asia/Dhaka":{"o":"6:0","f":"BD{c}T","e":{"m":12,"r":"31","t":"23:59"},"s":{"m":6,"r":"19","t":"23:0","v":"1:0","c":"S"}},"Asia/Singapore":{"o":"8:0","f":"SGT"},"Africa/Cairo":{"o":"2:0","f":"EE{c}T","e":{"m":9,"r":"l4","t":"23:0","z":"s"},"s":{"m":9,"r":"10","t":"0:0","v":"1:0","c":"S"}},"Europe/Belgrade":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Europe/Moscow":{"o":"4:0","f":"MSK"},"America/Inuvik":{"o":"-7:0","f":"M{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Pacific/Funafuti":{"o":"12:0","f":"TVT"},"Africa/Bissau":{"o":"0:0","f":"GMT"},"Atlantic/Faroe":{"o":"0:0","f":"WE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Asia/Taipei":{"o":"8:0","f":"C{c}T","e":{"m":9,"r":"30","t":"0:0","c":"S"},"s":{"m":6,"r":"30","t":"0:0","v":"1:0","c":"D"}},"America/Argentina/Catamarca":{"o":"-3:0","f":"ART"},"Pacific/Majuro":{"o":"12:0","f":"MHT"},"EET":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Indian/Comoro":{"o":"3:0","f":"EAT"},"America/Manaus":{"o":"-4:0","f":"AMT"},"Asia/Shanghai":{"o":"8:0","f":"C{c}T","s":{"m":4,"r":"0>10","t":"0:0","v":"1:0","c":"D"},"e":{"m":9,"r":"0>11","t":"0:0","c":"S"}},"America/Indiana/Vevay":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Australia/Hobart":{"o":"10:0","f":"EST","e":{"m":4,"r":"0>1","t":"2:0","z":"s"},"s":{"m":10,"r":"0>1","t":"2:0","z":"s","v":"1:0"}},"Asia/Dili":{"o":"9:0","f":"TLT"},"America/Indiana/Marengo":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Asia/Aqtobe":{"o":"5:0","f":"AQTT"},"Australia/Sydney":{"o":"10:0","f":"EST","s":{"m":10,"r":"0>1","t":"2:0","z":"s","v":"1:0"},"e":{"m":4,"r":"0>1","t":"2:0","z":"s"}},"Indian/Chagos":{"o":"6:0","f":"IOT"},"America/Phoenix":{"o":"-7:0","f":"MST"},"Europe/Luxembourg":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Asia/Makassar":{"o":"8:0","f":"CIT"},"Asia/Phnom_Penh":{"o":"7:0","f":"ICT"},"Australia/Currie":{"o":"10:0","f":"EST","e":{"m":4,"r":"0>1","t":"2:0","z":"s"},"s":{"m":10,"r":"0>1","t":"2:0","z":"s","v":"1:0"}},"America/Argentina/Cordoba":{"o":"-3:0","f":"AR{c}T","e":{"m":3,"r":"0>15","t":"0:0"},"s":{"m":10,"r":"0>15","t":"0:0","v":"1:0","c":"S"}},"America/Cancun":{"o":"-6:0","f":"C{c}T","e":{"m":10,"r":"l0","t":"2:0","c":"S"},"s":{"m":4,"r":"0>1","t":"2:0","v":"1:0","c":"D"}},"Asia/Baku":{"o":"4:0","f":"AZ{c}T","e":{"m":10,"r":"l0","t":"5:0"},"s":{"m":3,"r":"l0","t":"4:0","v":"1:0","c":"S"}},"Asia/Seoul":{"o":"9:0","f":"K{c}T","e":{"m":10,"r":"0>8","t":"0:0","c":"S"},"s":{"m":5,"r":"0>8","t":"0:0","v":"1:0","c":"D"}},"WET":{"o":"0:0","f":"WE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Antarctica/McMurdo":{"o":"12:0","f":"NZ{c}T","e":{"m":4,"r":"0>1","t":"2:0","z":"s","c":"S"},"s":{"m":9,"r":"l0","t":"2:0","z":"s","v":"1:0","c":"D"}},"America/Lima":{"o":"-5:0","f":"PE{c}T","e":{"m":4,"r":"1","t":"0:0"},"s":{"m":1,"r":"1","t":"0:0","v":"1:0","c":"S"}},"Atlantic/Stanley":{"o":"-3:0","f":"FKST"},"Europe/Rome":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/Dawson_Creek":{"o":"-7:0","f":"MST"},"Europe/Helsinki":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Asia/Anadyr":{"o":"12:0","f":"ANAT"},"America/Matamoros":{"o":"-6:0","f":"C{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Argentina/San_Juan":{"o":"-3:0","f":"ART"},"America/Denver":{"o":"-7:0","f":"M{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Australia/Eucla":{"o":"8:45","f":"CWST","e":{"m":3,"r":"l0","t":"2:0","z":"s"},"s":{"m":10,"r":"l0","t":"2:0","z":"s","v":"1:0"}},"America/Detroit":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Campo_Grande":{"o":"-4:0","f":"AM{c}T","e":{"m":2,"r":"0>15","t":"0:0"},"s":{"m":10,"r":"0>15","t":"0:0","v":"1:0","c":"S"}},"America/Indiana/Tell_City":{"o":"-6:0","f":"C{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Hermosillo":{"o":"-7:0","f":"MST"},"America/Boise":{"o":"-7:0","f":"M{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Whitehorse":{"o":"-8:0","f":"P{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/St_Kitts":{"o":"-4:0","f":"AST"},"America/Pangnirtung":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"MET":{"o":"1:0","f":"ME{c}T","e":{"m":10,"r":"l0","t":"2:0","z":"s"},"s":{"m":3,"r":"l0","t":"2:0","z":"s","v":"1:0","c":"S"}},"Asia/Tehran":{"o":"3:30","f":"IR{c}T","e":{"m":9,"r":"21","t":"0:0","c":"S"},"s":{"m":3,"r":"21","t":"0:0","v":"1:0","c":"D"}},"Asia/Almaty":{"o":"6:0","f":"ALMT"},"America/Santa_Isabel":{"o":"-8:0","f":"P{c}T","e":{"m":10,"r":"l0","t":"2:0","c":"S"},"s":{"m":4,"r":"0>1","t":"2:0","v":"1:0","c":"D"}},"America/Chicago":{"o":"-6:0","f":"C{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Asia/Ho_Chi_Minh":{"o":"7:0","f":"ICT"},"America/Boa_Vista":{"o":"-4:0","f":"AMT"},"America/Mazatlan":{"o":"-7:0","f":"M{c}T","e":{"m":10,"r":"l0","t":"2:0","c":"S"},"s":{"m":4,"r":"0>1","t":"2:0","v":"1:0","c":"D"}},"America/Indiana/Petersburg":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Iqaluit":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Africa/Algiers":{"o":"1:0","f":"CET"},"America/Araguaina":{"o":"-3:0","f":"BRT"},"America/St_Lucia":{"o":"-4:0","f":"AST"},"Pacific/Kiritimati":{"o":"14:0","f":"LINT"},"Asia/Yakutsk":{"o":"10:0","f":"YAKT"},"Indian/Mahe":{"o":"4:0","f":"SCT"},"Asia/Hong_Kong":{"o":"8:0","f":"HK{c}T","e":{"m":10,"r":"0>16","t":"3:30"},"s":{"m":5,"r":"0>8","t":"3:30","v":"1:0","c":"S"}},"America/Panama":{"o":"-5:0","f":"EST"},"America/Scoresbysund":{"o":"-1:0","f":"EG{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Europe/Gibraltar":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/Aruba":{"o":"-4:0","f":"AST"},"Asia/Muscat":{"o":"4:0","f":"GST"},"Africa/Freetown":{"o":"0:0","f":"{c}","e":{"m":9,"r":"1","t":"0:0","c":"GMT"},"s":{"m":6,"r":"1","t":"0:0","v":"1:0","c":"SLST"}},"America/Argentina/San_Luis":{"o":"-4:0","f":"WAR{c}T","s":{"m":10,"r":"0>8","t":"0:0","v":"1:0","c":"S"},"e":{"m":3,"r":"0>8","t":"0:0"}},"America/Paramaribo":{"o":"-3:0","f":"SRT"},"Australia/Lindeman":{"o":"10:0","f":"EST","e":{"m":3,"r":"0>1","t":"2:0","z":"s"},"s":{"m":10,"r":"l0","t":"2:0","z":"s","v":"1:0"}},"Asia/Hovd":{"o":"7:0","f":"HOV{c}T","s":{"m":3,"r":"l6","t":"2:0","v":"1:0","c":"S"},"e":{"m":9,"r":"l6","t":"2:0"}},"America/Bahia":{"o":"-3:0","f":"BR{c}T","e":{"m":2,"r":"0>15","t":"0:0"},"s":{"m":10,"r":"0>15","t":"0:0","v":"1:0","c":"S"}},"Pacific/Pohnpei":{"o":"11:0","f":"PONT"},"Pacific/Guadalcanal":{"o":"11:0","f":"SBT"},"Australia/Perth":{"o":"8:0","f":"WST","e":{"m":3,"r":"l0","t":"2:0","z":"s"},"s":{"m":10,"r":"l0","t":"2:0","z":"s","v":"1:0"}},"Pacific/Pago_Pago":{"o":"-11:0","f":"SST"},"Antarctica/Syowa":{"o":"3:0","f":"SYOT"},"America/Edmonton":{"o":"-7:0","f":"M{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Los_Angeles":{"o":"-8:0","f":"P{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Creston":{"o":"-7:0","f":"MST"},"Africa/Nouakchott":{"o":"0:0","f":"GMT"},"America/Noronha":{"o":"-2:0","f":"FNT"},"Asia/Riyadh89":{"o":"3:7","f":"zzz"},"Asia/Riyadh88":{"o":"3:7","f":"zzz"},"America/La_Paz":{"o":"-4:0","f":"BOT"},"America/Dominica":{"o":"-4:0","f":"AST"},"Asia/Riyadh87":{"o":"3:7","f":"zzz"},"Antarctica/Macquarie":{"o":"11:0","f":"MIST"},"MST7MDT":{"o":"-7:0","f":"M{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Africa/Ceuta":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Africa/El_Aaiun":{"o":"0:0","f":"WET"},"Europe/Andorra":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Africa/Luanda":{"o":"1:0","f":"WAT"},"Africa/Addis_Ababa":{"o":"3:0","f":"EAT"},"America/Atikokan":{"o":"-5:0","f":"EST"},"America/Argentina/Salta":{"o":"-3:0","f":"ART"},"Asia/Beirut":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l0","t":"0:0"},"s":{"m":3,"r":"l0","t":"0:0","v":"1:0","c":"S"}},"Pacific/Nauru":{"o":"12:0","f":"NRT"},"Africa/Brazzaville":{"o":"1:0","f":"WAT"},"America/Guadeloupe":{"o":"-4:0","f":"AST"},"Africa/Bangui":{"o":"1:0","f":"WAT"},"Asia/Kamchatka":{"o":"12:0","f":"PETT"},"Asia/Aqtau":{"o":"5:0","f":"AQTT"},"America/Eirunepe":{"o":"-4:0","f":"AMT"},"Antarctica/Palmer":{"o":"-4:0","f":"CL{c}T","s":{"m":10,"r":"0>9","t":"4:0","z":"u","v":"1:0","c":"S"},"e":{"m":3,"r":"0>9","t":"3:0","z":"u"}},"Africa/Lubumbashi":{"o":"2:0","f":"CAT"},"Asia/Kolkata":{"o":"5:30","f":"IST"},"Pacific/Galapagos":{"o":"-6:0","f":"GALT"},"America/Monterrey":{"o":"-6:0","f":"C{c}T","e":{"m":10,"r":"l0","t":"2:0","c":"S"},"s":{"m":4,"r":"0>1","t":"2:0","v":"1:0","c":"D"}},"Europe/London":{"o":"0:0","f":"GMT/BST","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Europe/Samara":{"o":"4:0","f":"SAMT"},"Europe/Monaco":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/Indiana/Indianapolis":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Atlantic/Bermuda":{"o":"-4:0","f":"A{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Indian/Christmas":{"o":"7:0","f":"CXT"},"Pacific/Tarawa":{"o":"12:0","f":"GILT"},"America/Yakutat":{"o":"-9:0","f":"AK{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Europe/Vienna":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/St_Vincent":{"o":"-4:0","f":"AST"},"America/Port-au-Prince":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/New_York":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Africa/Mogadishu":{"o":"3:0","f":"EAT"},"Asia/Qatar":{"o":"3:0","f":"AST"},"Pacific/Niue":{"o":"-11:0","f":"NUT"},"Africa/Gaborone":{"o":"2:0","f":"CAT"},"America/Antigua":{"o":"-4:0","f":"AST"},"Australia/Lord_Howe":{"o":"10:30","f":"LHST","s":{"m":10,"r":"0>1","t":"2:0","v":"0:30"},"e":{"m":4,"r":"0>1","t":"2:0"}},"Europe/Lisbon":{"o":"0:0","f":"WE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/Montevideo":{"o":"-3:0","f":"UY{c}T","e":{"m":3,"r":"0>8","t":"2:0"},"s":{"m":10,"r":"0>1","t":"2:0","v":"1:0","c":"S"}},"Europe/Zurich":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/Winnipeg":{"o":"-6:0","f":"C{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Guyana":{"o":"-4:0","f":"GYT"},"America/Santarem":{"o":"-3:0","f":"BRT"},"Asia/Macau":{"o":"8:0","f":"C{c}T","s":{"m":4,"r":"0>10","t":"0:0","v":"1:0","c":"D"},"e":{"m":9,"r":"0>11","t":"0:0","c":"S"}},"Europe/Dublin":{"o":"0:0","f":"GMT/IST","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Asia/Vladivostok":{"o":"11:0","f":"VLAT"},"Europe/Zaporozhye":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Indian/Mayotte":{"o":"3:0","f":"EAT"},"America/Tijuana":{"o":"-8:0","f":"P{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Africa/Ndjamena":{"o":"1:0","f":"WAT"},"Pacific/Tahiti":{"o":"-10:0","f":"TAHT"},"Africa/Monrovia":{"o":"0:0","f":"GMT"},"Asia/Qyzylorda":{"o":"6:0","f":"QYZT"},"Europe/Copenhagen":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/Thule":{"o":"-4:0","f":"A{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Europe/Amsterdam":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Asia/Thimphu":{"o":"6:0","f":"BTT"},"America/Chihuahua":{"o":"-7:0","f":"M{c}T","e":{"m":10,"r":"l0","t":"2:0","c":"S"},"s":{"m":4,"r":"0>1","t":"2:0","v":"1:0","c":"D"}},"America/Yellowknife":{"o":"-7:0","f":"M{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Africa/Windhoek":{"o":"1:0","f":"WA{c}T","e":{"m":4,"r":"0>1","t":"2:0"},"s":{"m":9,"r":"0>1","t":"2:0","v":"1:0","c":"S"}},"Antarctica/Davis":{"o":"7:0","f":"DAVT"},"America/Cayman":{"o":"-5:0","f":"EST"},"Europe/Berlin":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Asia/Omsk":{"o":"7:0","f":"OMST"},"Africa/Kinshasa":{"o":"1:0","f":"WAT"},"Asia/Kathmandu":{"o":"5:45","f":"NPT"},"Europe/Chisinau":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Asia/Choibalsan":{"o":"8:0","f":"CHO{c}T","s":{"m":3,"r":"l6","t":"2:0","v":"1:0","c":"S"},"e":{"m":9,"r":"l6","t":"2:0"}},"Etc/UCT":{"o":"0:0","f":"UCT"},"CET":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"2:0","z":"s"},"s":{"m":3,"r":"l0","t":"2:0","z":"s","v":"1:0","c":"S"}},"Europe/Prague":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/Toronto":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Africa/Harare":{"o":"2:0","f":"CAT"},"America/Montserrat":{"o":"-4:0","f":"AST"},"Pacific/Honolulu":{"o":"-10:0","f":"HST"},"America/Miquelon":{"o":"-3:0","f":"PM{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Africa/Sao_Tome":{"o":"0:0","f":"GMT"},"America/Kentucky/Louisville":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Asia/Pyongyang":{"o":"9:0","f":"KST"},"America/Porto_Velho":{"o":"-4:0","f":"AMT"},"America/Costa_Rica":{"o":"-6:0","f":"C{c}T","e":{"m":3,"r":"15","t":"0:0","c":"S"},"s":{"m":1,"r":"6>15","t":"0:0","v":"1:0","c":"D"}},"America/Fortaleza":{"o":"-3:0","f":"BRT"},"America/Mexico_City":{"o":"-6:0","f":"C{c}T","e":{"m":10,"r":"l0","t":"2:0","c":"S"},"s":{"m":4,"r":"0>1","t":"2:0","v":"1:0","c":"D"}},"America/El_Salvador":{"o":"-6:0","f":"C{c}T","e":{"m":9,"r":"l0","t":"0:0","c":"S"},"s":{"m":5,"r":"0>1","t":"0:0","v":"1:0","c":"D"}},"Europe/Kaliningrad":{"o":"3:0","f":"FET"},"Asia/Kashgar":{"o":"8:0","f":"C{c}T","s":{"m":4,"r":"0>10","t":"0:0","v":"1:0","c":"D"},"e":{"m":9,"r":"0>11","t":"0:0","c":"S"}},"Asia/Damascus":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l5","t":"0:0"},"s":{"m":3,"r":"l5","t":"0:0","v":"1:0","c":"S"}},"America/Port_of_Spain":{"o":"-4:0","f":"AST"},"America/Kentucky/Monticello":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"CST6CDT":{"o":"-6:0","f":"C{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Halifax":{"o":"-4:0","f":"A{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Asia/Karachi":{"o":"5:0","f":"PK{c}T","e":{"m":11,"r":"1","t":"0:0"},"s":{"m":4,"r":"15","t":"0:0","v":"1:0","c":"S"}},"America/North_Dakota/Beulah":{"o":"-6:0","f":"C{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"EST5EDT":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Managua":{"o":"-6:0","f":"C{c}T","e":{"m":10,"r":"0>1","t":"1:0","c":"S"},"s":{"m":4,"r":"30","t":"2:0","v":"1:0","c":"D"}},"Pacific/Wallis":{"o":"12:0","f":"WFT"},"America/Nome":{"o":"-9:0","f":"AK{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Africa/Bujumbura":{"o":"2:0","f":"CAT"},"America/Rio_Branco":{"o":"-4:0","f":"AMT"},"America/Santiago":{"o":"-4:0","f":"CL{c}T","s":{"m":10,"r":"0>9","t":"4:0","z":"u","v":"1:0","c":"S"},"e":{"m":3,"r":"0>9","t":"3:0","z":"u"}},"America/Vancouver":{"o":"-8:0","f":"P{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Asia/Bahrain":{"o":"3:0","f":"AST"},"America/Indiana/Vincennes":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Pacific/Enderbury":{"o":"13:0","f":"PHOT"},"Pacific/Wake":{"o":"12:0","f":"WAKT"},"Europe/Oslo":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/Guatemala":{"o":"-6:0","f":"C{c}T","e":{"m":10,"r":"1","t":"0:0","c":"S"},"s":{"m":4,"r":"30","t":"0:0","v":"1:0","c":"D"}},"America/Montreal":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Asia/Dubai":{"o":"4:0","f":"GST"},"Asia/Harbin":{"o":"8:0","f":"C{c}T","s":{"m":4,"r":"0>10","t":"0:0","v":"1:0","c":"D"},"e":{"m":9,"r":"0>11","t":"0:0","c":"S"}},"Africa/Johannesburg":{"o":"2:0","f":"SAST","e":{"m":3,"r":"0>15","t":"2:0"},"s":{"m":9,"r":"0>15","t":"2:0","v":"1:0"}},"Europe/Tallinn":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/Ojinaga":{"o":"-7:0","f":"M{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Europe/Uzhgorod":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/Barbados":{"o":"-4:0","f":"A{c}T","e":{"m":9,"r":"25","t":"2:0","c":"S"},"s":{"m":4,"r":"0>15","t":"2:0","v":"1:0","c":"D"}},"Asia/Urumqi":{"o":"8:0","f":"C{c}T","s":{"m":4,"r":"0>10","t":"0:0","v":"1:0","c":"D"},"e":{"m":9,"r":"0>11","t":"0:0","c":"S"}},"Asia/Gaza":{"o":"2:0","f":"EET"},"Atlantic/Azores":{"o":"-1:0","f":"AZO{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Asia/Kuwait":{"o":"3:0","f":"AST"},"Africa/Lagos":{"o":"1:0","f":"WAT"},"Africa/Porto-Novo":{"o":"1:0","f":"WAT"},"Africa/Accra":{"o":"0:0","f":"{c}","e":{"m":12,"r":"31","t":"0:0","c":"GMT"},"s":{"m":9,"r":"1","t":"0:0","v":"0:20","c":"GHST"}},"Pacific/Port_Moresby":{"o":"10:0","f":"PGT"},"America/Blanc-Sablon":{"o":"-4:0","f":"AST"},"Africa/Juba":{"o":"3:0","f":"EAT"},"America/Indiana/Knox":{"o":"-6:0","f":"C{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Europe/Kiev":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Pacific/Noumea":{"o":"11:0","f":"NC{c}T","e":{"m":3,"r":"2","t":"2:0","z":"s"},"s":{"m":12,"r":"1","t":"2:0","z":"s","v":"1:0","c":"S"}},"Asia/Dushanbe":{"o":"5:0","f":"TJT"},"HST":{"o":"-10:0","f":"HST"},"America/Jamaica":{"o":"-5:0","f":"EST"},"Asia/Tokyo":{"o":"9:0","f":"J{c}T","s":{"m":5,"r":"0>1","t":"2:0","v":"1:0","c":"D"},"e":{"m":9,"r":"6>8","t":"2:0","c":"S"}},"Indian/Maldives":{"o":"5:0","f":"MVT"},"Africa/Abidjan":{"o":"0:0","f":"GMT"},"Pacific/Pitcairn":{"o":"-8:0","f":"PST"},"Europe/Malta":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Atlantic/Reykjavik":{"o":"0:0","f":"GMT"},"Europe/Madrid":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Asia/Magadan":{"o":"12:0","f":"MAGT"},"Asia/Kabul":{"o":"4:30","f":"AFT"},"America/Argentina/Rio_Gallegos":{"o":"-3:0","f":"ART"},"Australia/Melbourne":{"o":"10:0","f":"EST","s":{"m":10,"r":"0>1","t":"2:0","z":"s","v":"1:0"},"e":{"m":4,"r":"0>1","t":"2:0","z":"s"}},"Indian/Antananarivo":{"o":"3:0","f":"EAT"},"Asia/Pontianak":{"o":"7:0","f":"WIT"},"Africa/Mbabane":{"o":"2:0","f":"SAST"},"Pacific/Kwajalein":{"o":"12:0","f":"MHT"},"Africa/Banjul":{"o":"0:0","f":"GMT"},"America/Argentina/Jujuy":{"o":"-3:0","f":"ART"},"America/Anchorage":{"o":"-9:0","f":"AK{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Argentina/La_Rioja":{"o":"-3:0","f":"ART"},"Africa/Tripoli":{"o":"2:0","f":"EET"},"Africa/Khartoum":{"o":"3:0","f":"EAT"},"Pacific/Marquesas":{"o":"-9:30","f":"MART"},"Asia/Rangoon":{"o":"6:30","f":"MMT"},"Europe/Bucharest":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Europe/Athens":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/Puerto_Rico":{"o":"-4:0","f":"AST"},"America/Swift_Current":{"o":"-6:0","f":"CST"},"America/Nassau":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Havana":{"o":"-5:0","f":"C{c}T","s":{"m":3,"r":"0>8","t":"0:0","z":"s","v":"1:0","c":"D"},"e":{"m":10,"r":"l0","t":"0:0","z":"s","c":"S"}},"Asia/Jayapura":{"o":"9:0","f":"EIT"},"Pacific/Gambier":{"o":"-9:0","f":"GAMT"},"America/Argentina/Mendoza":{"o":"-3:0","f":"ART"},"America/Rainy_River":{"o":"-6:0","f":"C{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Belem":{"o":"-3:0","f":"BRT"},"America/Sao_Paulo":{"o":"-3:0","f":"BR{c}T","e":{"m":2,"r":"0>15","t":"0:0"},"s":{"m":10,"r":"0>15","t":"0:0","v":"1:0","c":"S"}},"Pacific/Easter":{"o":"-6:0","f":"EAS{c}T","s":{"m":10,"r":"0>9","t":"4:0","z":"u","v":"1:0","c":"S"},"e":{"m":3,"r":"0>9","t":"3:0","z":"u"}},"America/Menominee":{"o":"-6:0","f":"C{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Juneau":{"o":"-9:0","f":"AK{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Pacific/Fakaofo":{"o":"14:0","f":"TKT"},"America/Martinique":{"o":"-4:0","f":"AST"},"Africa/Conakry":{"o":"0:0","f":"GMT"},"America/North_Dakota/New_Salem":{"o":"-6:0","f":"C{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Adak":{"o":"-10:0","f":"HA{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"America/Godthab":{"o":"-3:0","f":"WG{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Africa/Libreville":{"o":"1:0","f":"WAT"},"Pacific/Kosrae":{"o":"11:0","f":"KOST"},"America/St_Thomas":{"o":"-4:0","f":"AST"},"Etc/GMT+7":{"o":"-7:0","f":"GMT+7"},"Etc/GMT+6":{"o":"-6:0","f":"GMT+6"},"Europe/Minsk":{"o":"3:0","f":"FET"},"Etc/GMT+5":{"o":"-5:0","f":"GMT+5"},"Etc/GMT+4":{"o":"-4:0","f":"GMT+4"},"Pacific/Efate":{"o":"11:0","f":"VU{c}T","e":{"m":1,"r":"0>23","t":"0:0"},"s":{"m":10,"r":"0>23","t":"0:0","v":"1:0","c":"S"}},"Etc/GMT+3":{"o":"-3:0","f":"GMT+3"},"MST":{"o":"-7:0","f":"MST"},"Etc/GMT+2":{"o":"-2:0","f":"GMT+2"},"Etc/GMT+1":{"o":"-1:0","f":"GMT+1"},"Asia/Yekaterinburg":{"o":"6:0","f":"YEKT"},"Pacific/Tongatapu":{"o":"13:0","f":"TO{c}T","e":{"m":1,"r":"l0","t":"2:0"},"s":{"m":11,"r":"0>1","t":"2:0","v":"1:0","c":"S"}},"Europe/Riga":{"o":"2:0","f":"EE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/Guayaquil":{"o":"-5:0","f":"ECT"},"America/Grand_Turk":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Asia/Manila":{"o":"8:0","f":"PH{c}T","e":{"m":9,"r":"21","t":"0:0"},"s":{"m":3,"r":"22","t":"0:0","v":"1:0","c":"S"}},"Asia/Jakarta":{"o":"7:0","f":"WIT"},"Asia/Ashgabat":{"o":"5:0","f":"TMT"},"Africa/Kigali":{"o":"2:0","f":"CAT"},"America/Santo_Domingo":{"o":"-4:0","f":"AST"},"America/Argentina/Buenos_Aires":{"o":"-3:0","f":"AR{c}T","e":{"m":3,"r":"0>15","t":"0:0"},"s":{"m":10,"r":"0>15","t":"0:0","v":"1:0","c":"S"}},"Antarctica/Mawson":{"o":"5:0","f":"MAWT"},"EST":{"o":"-5:0","f":"EST"},"America/Goose_Bay":{"o":"-4:0","f":"A{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Europe/Tirane":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"America/Nipigon":{"o":"-5:0","f":"E{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Asia/Chongqing":{"o":"8:0","f":"C{c}T","s":{"m":4,"r":"0>10","t":"0:0","v":"1:0","c":"D"},"e":{"m":9,"r":"0>11","t":"0:0","c":"S"}},"America/Cayenne":{"o":"-3:0","f":"GFT"},"Asia/Samarkand":{"o":"5:0","f":"UZT"},"Pacific/Fiji":{"o":"12:0","f":"FJ{c}T","e":{"m":1,"r":"22","t":"3:0"},"s":{"m":10,"r":"23","t":"2:0","v":"1:0","c":"S"}},"Australia/Darwin":{"o":"9:30","f":"CST","e":{"m":3,"r":"l0","t":"2:0"},"s":{"m":10,"r":"3","t":"2:0","v":"1:0"}},"Etc/GMT-1":{"o":"1:0","f":"GMT-1"},"Australia/Adelaide":{"o":"9:30","f":"CST","s":{"m":10,"r":"0>1","t":"2:0","z":"s","v":"1:0"},"e":{"m":4,"r":"0>1","t":"2:0","z":"s"}},"Etc/GMT-5":{"o":"5:0","f":"GMT-5"},"Etc/GMT-4":{"o":"4:0","f":"GMT-4"},"Asia/Riyadh":{"o":"3:0","f":"AST"},"Etc/GMT-3":{"o":"3:0","f":"GMT-3"},"Etc/GMT-2":{"o":"2:0","f":"GMT-2"},"Asia/Aden":{"o":"3:0","f":"AST"},"Etc/GMT-9":{"o":"9:0","f":"GMT-9"},"Asia/Krasnoyarsk":{"o":"8:0","f":"KRAT"},"Africa/Casablanca":{"o":"0:0","f":"WE{c}T","e":{"m":9,"r":"l0","t":"3:0"},"s":{"m":4,"r":"l0","t":"2:0","v":"1:0","c":"S"}},"Etc/GMT-8":{"o":"8:0","f":"GMT-8"},"Pacific/Johnston":{"o":"-10:0","f":"HST"},"Etc/GMT-7":{"o":"7:0","f":"GMT-7"},"Pacific/Midway":{"o":"-11:0","f":"SST"},"Etc/GMT-6":{"o":"6:0","f":"GMT-6"},"Etc/GMT+8":{"o":"-8:0","f":"GMT+8"},"Etc/GMT+9":{"o":"-9:0","f":"GMT+9"},"Pacific/Palau":{"o":"9:0","f":"PWT"},"Asia/Kuala_Lumpur":{"o":"8:0","f":"MYT"},"Europe/Warsaw":{"o":"1:0","f":"CE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}},"Africa/Lome":{"o":"0:0","f":"GMT"},"America/Sitka":{"o":"-9:0","f":"AK{c}T","e":{"m":11,"r":"0>1","t":"2:0","c":"S"},"s":{"m":3,"r":"0>8","t":"2:0","v":"1:0","c":"D"}},"Atlantic/Madeira":{"o":"0:0","f":"WE{c}T","e":{"m":10,"r":"l0","t":"1:0","z":"u"},"s":{"m":3,"r":"l0","t":"1:0","z":"u","v":"1:0","c":"S"}}};
/*
 * timezone.js - Definition of a time zone class
 * 
 * Copyright © 2012-2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
!depends 
ilibglobal.js 
locale.js
localeinfo.js
util/utils.js
calendar/gregoriandate.js
*/

// !data localeinfo timezones

/**
 * @class Create a time zone information instance. 
 * 
 * This class reports and transforms
 * information about particular time zones.<p>
 * 
 * The options parameter may contain any of the following properties:
 * 
 * <ul>
 * <li><i>id</i> - The id of the requested time zone such as "Europe/London" or 
 * "America/Los_Angeles". These are taken from the IANA time zone database. (See
 * http://www.iana.org/time-zones for more information.) <p>
 * 
 * There is one special 
 * time zone that is not taken from the IANA database called simply "local". In
 * this case, this class will attempt to discover the current time zone and
 * daylight savings time settings by calling standard Javascript classes to 
 * determine the offsets from UTC. 
 * 
 * <li><i>locale</i> - The locale for this time zone.
 * 
 * <li><i>offset</i> - Choose the time zone based on the offset from UTC given in
 * number of minutes (negative is west, positive is east).
 * 
 * <li><i>onLoad</i> - a callback function to call when the data is fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the data is loaded, the onLoad function is called with the current 
 * instance as a parameter. 
 * 
 * <li>sync - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 * </ul>
 * 
 * There is currently no way in the ECMAscript
 * standard to tell which exact time zone is currently in use. Choosing the
 * id "locale" or specifying an explicit offset will not give a specific time zone, 
 * as it is impossible to tell with certainty which zone the offsets 
 * match.<p>
 * 
 * When the id "local" is given or the offset option is specified, this class will
 * have the following behaviours:
 * <ul>
 * <li>The display name will always be given as the RFC822 style, no matter what
 * style is requested
 * <li>The id will also be returned as the RFC822 style display name
 * <li>When the offset is explicitly given, this class will assume the time zone 
 * does not support daylight savings time, and the offsets will be calculated 
 * the same way year round.
 * <li>When the offset is explicitly given, the inDaylightSavings() method will 
 * always return false.
 * <li>When the id "local" is given, this class will attempt to determine the 
 * daylight savings time settings by examining the offset from UTC on Jan 1
 * and June 1 of the current year. If they are different, this class assumes
 * that the local time zone uses DST. When the offset for a particular date is
 * requested, it will use the built-in Javascript support to determine the 
 * offset for that date.
 * </ul> 
 * 
 * If a more specific time zone is 
 * needed with display names and known start/stop times for DST, use the "id" 
 * property instead to specify the time zone exactly. You can perhaps ask the
 * user which time zone they prefer so that your app does not need to guess.<p>
 * 
 * If the id and the offset are both not given, the default time zone for the 
 * locale is retrieved from
 * the locale info. If the locale is not specified, the default locale for the
 * library is used.<p>
 * 
 * Because this class was designed for use in web sites, and the vast majority
 * of dates and times being formatted are recent date/times, this class is simplified
 * by not implementing historical time zones. That is, when governments change the 
 * time zone rules for a particular zone, only the latest such rule is implemented 
 * in this class. That means that determining the offset for a date that is prior 
 * to the last change may give the wrong result. Historical time zone calculations
 * may be implemented in a later version of iLib if there is enough demand for it,
 * but it would entail a much larger set of time zone data that would have to be
 * loaded.  
 * 
 * Depends directive: !depends timezone.js
 * 
 * @constructor
 * @param {Object} options Options guiding the construction of this time zone instance
 */
ilib.TimeZone = function(options) {
	var sync = true;
	this.locale = new ilib.Locale();
	this.isLocal = false;
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		if (options.id) {
			if (options.id === 'local') {
				this.isLocal = true;
				
				// use standard Javascript Date to figure out the time zone offsets
				var now = new Date(), 
					jan1 = new Date(now.getFullYear(), 0, 1),  // months in std JS Date object are 0-based
					jun1 = new Date(now.getFullYear(), 5, 1);
				
				// Javascript's method returns the offset backwards, so we have to
				// take the negative to get the correct offset
				this.offsetJan1 = -jan1.getTimezoneOffset();
				this.offsetJun1 = -jun1.getTimezoneOffset();
				// the offset of the standard time for the time zone is always the one that is largest of 
				// the two, no matter whether you are in the northern or southern hemisphere
				this.offset = Math.max(this.offsetJan1, this.offsetJun1);
				this.id = this.getDisplayName(undefined, undefined);
			} else {
				this.id = options.id;
			}
		} else if (options.offset) {
			this.offset = (typeof(options.offset) === 'string') ? parseInt(options.offset, 10) : options.offset;
			this.id = this.getDisplayName(undefined, undefined);
		}
		
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
	}

	//console.log("timezone: locale is " + this.locale);
	
	if (!this.id) {
		var li = new ilib.LocaleInfo(this.locale, {
			sync: sync,
			onLoad: ilib.bind(this, function (li) {
				this.id = li.getTimeZone() || "Etc/UTC";
				this._inittz();
				
				if (options && typeof(options.onLoad) === 'function') {
					options.onLoad(this);
				}
			})
		});
	} else {
		this._inittz();
		if (options && typeof(options.onLoad) === 'function') {
			options.onLoad(this);
		}
	}

	//console.log("localeinfo is: " + JSON.stringify(this.locinfo));
	//console.log("id is: " + JSON.stringify(this.id));
};

ilib.TimeZone.prototype._inittz = function () {
	/** 
	 * @private
	 * @type {{o:string,f:string,e:Object.<{m:number,r:string,t:string,z:string}>,s:Object.<{m:number,r:string,t:string,z:string,v:string,c:string}>}} 
	 */
	this.zone = ilib.data.timezones[this.id];
	if (!this.zone && !this.offset) {
		this.id = "Etc/UTC";
		this.zone = ilib.data.timezones[this.id];
	}
};

/**
 * Return an array of available zone ids that the constructor knows about.
 * @return {Array.<string>} an array of zone id strings
 */
ilib.TimeZone.getAvailableIds = function () {
	var tz, ids = [];
	
	// special zone meaning "the local time zone according to the JS engine we are running upon"
	ids.push("local"); 
	
	for (tz in ilib.data.timezones) {
		if (tz) {
			ids.push(tz);
		}
	}
	
	return ids;
};

/**
 * Return the id used to uniquely identify this time zone.
 * @return {string} a unique id for this time zone
 */
ilib.TimeZone.prototype.getId = function () {
	return this.id;
};

/**
 * Return the abbreviation that is used for the current time zone on the given date.
 * The date may be in DST or during standard time, and many zone names have different
 * abbreviations depending on whether or not the date is falls within DST.<p>
 * 
 * There are two styles that are supported:
 * 
 * <ol>
 * <li>standard - returns the 3 to 5 letter abbreviation of the time zone name such 
 * as "CET" for "Central European Time" or "PDT" for "Pacific Daylight Time"
 * <li>rfc822 - returns an RFC 822 style time zone specifier, which specifies more
 * explicitly what the offset is from UTC
 * </ol>
 *  
 * @param {ilib.Date=} date a date to determine if it is in daylight time or standard time
 * @param {string=} style one of "standard" or "rfc822". Default if not specified is "standard"
 * @return {string} the name of the time zone, abbreviated according to the style 
 */
ilib.TimeZone.prototype.getDisplayName = function (date, style) {
	style = (this.isLocal || typeof(this.zone) === 'undefined') ? "rfc822" : (style || "standard");
	switch (style) {
		default:
		case 'standard':
			if (this.zone.f && this.zone.f !== "zzz") {
				if (this.zone.f.indexOf("{c}") !== -1) {
					var letter = "";
					letter = this.inDaylightTime(date) ? this.zone.s.c : this.zone.e.c; 
					var temp = new ilib.String(this.zone.f);
					return temp.format({c: letter || ""});
				}
				return this.zone.f;
			} else {
				var temp = "GMT" + this.zone.o;
				if (this.inDaylightTime(date)) {
					temp += "+" + this.zone.s.v;
				}
				return temp;
			}
			break;
		case 'rfc822':
			var offset = this.getOffset(date), // includes the DST if applicable
				ret = "UTC",
				hour = offset.h || 0,
				minute = offset.m || 0;
			
			ret += (hour > 0) ? "+" : "-";
			if (Math.abs(hour) < 10) {
				ret += "0";
			}
			ret += (hour < 0) ? -hour : hour;
			if (minute < 10) {
				ret += "0";
			}
			ret += minute;
			return ret; 
	}
};

/**
 * @private
 * Convert the offset string to an object with an h, m, and possibly s property
 * to indicate the hours, minutes, and seconds.
 * 
 * @param {string} str the offset string to convert to an object
 * @return {Object.<{h:number,m:number,s:number}>} an object giving the offset for the zone at 
 * the given date/time, in hours, minutes, and seconds
 */
ilib.TimeZone.prototype._offsetStringToObj = function (str) {
	var offsetParts = (typeof(str) === 'string') ? str.split(":") : [],
		ret = {h:0},
		temp;
	
	if (offsetParts.length > 0) {
		ret.h = parseInt(offsetParts[0], 10);
		if (offsetParts.length > 1) {
			temp = parseInt(offsetParts[1], 10);
			if (temp) {
				ret.m = temp;
			}
			if (offsetParts.length > 2) {
				temp = parseInt(offsetParts[2], 10);
				if (temp) {
					ret.s = temp;
				}
			}
		}
	}

	return ret;
};

/**
 * Returns the offset of this time zone from UTC at the given date/time. If daylight saving 
 * time is in effect at the given date/time, this method will return the offset value 
 * adjusted by the amount of daylight saving.
 * @param {ilib.Date=} date the date for which the offset is needed
 * @return {Object.<{h:number,m:number}>} an object giving the offset for the zone at 
 * the given date/time, in hours, minutes, and seconds  
 */
ilib.TimeZone.prototype.getOffset = function (date) {
	var offset = this.getOffsetMillis(date)/60000;
	
	var hours = ilib._roundFnc.down(offset/60),
		minutes = Math.abs(offset) - Math.abs(hours)*60;

	var ret = {
		h: hours
	};
	if (minutes != 0) {
		ret.m = minutes;
	}
	return ret;
};

/**
 * Returns the offset of this time zone from UTC at the given date/time expressed in 
 * milliseconds. If daylight saving 
 * time is in effect at the given date/time, this method will return the offset value 
 * adjusted by the amount of daylight saving. Negative numbers indicate offsets west
 * of UTC and conversely, positive numbers indicate offset east of UTC.
 *  
 * @param {ilib.Date=} date the date for which the offset is needed, or null for the
 * present date
 * @return {number} the number of milliseconds of offset from UTC that the given date is
 */
ilib.TimeZone.prototype.getOffsetMillis = function (date) {
	var ret;
	
	if (this.isLocal) {
		var d = (!date) ? new Date() : new Date(date.getTime());
		return -d.getTimezoneOffset() * 60 * 1000;
	} 
	
	if (typeof(this.dstSavings) === 'undefined') {
		this._calcDSTSavings();
	}
	
	if (typeof(this.offset) === 'undefined') {
		this._calcOffset();
	}
	
	ret = this.offset;
	
	if (date && this.inDaylightTime(date)) {
		ret += this.dstSavings;
	}
	
	return ret * 60 * 1000;
};

/**
 * Returns the offset of this time zone from UTC at the given date/time. If daylight saving 
 * time is in effect at the given date/time, this method will return the offset value 
 * adjusted by the amount of daylight saving.
 * @param {ilib.Date=} date the date for which the offset is needed
 * @return {string} the offset for the zone at the given date/time as a string in the 
 * format "h:m:s" 
 */
ilib.TimeZone.prototype.getOffsetStr = function (date) {
	var offset = this.getOffset(date),
		ret;
	
	ret = offset.h;
	if (typeof(offset.m) !== 'undefined') {
		ret += ":" + offset.m;
		if (typeof(offset.s) !== 'undefined') {
			ret += ":" + offset.s;
		}
	} else {
		ret += ":0";
	}
	
	return ret;
};

/**
 * Gets the offset from UTC for this time zone.
 * @return {Object.<{h:number,m:number,s:number}>} an object giving the offset from 
 * UTC for this time zone, in hours, minutes, and seconds 
 */
ilib.TimeZone.prototype.getRawOffset = function () {
	var offset = this.getRawOffsetMillis()/60000;

	var hours = ilib._roundFnc.down(offset/60),
		minutes = Math.abs(offset) - Math.abs(hours)*60;
	
	var ret = {
		h: hours
	};
	if (minutes != 0) {
		ret.m = minutes;
	}
	return ret;
};

/**
 * Gets the offset from UTC for this time zone expressed in milliseconds. Negative numbers
 * indicate zones west of UTC, and positive numbers indicate zones east of UTC.
 * 
 * @return {number} an number giving the offset from 
 * UTC for this time zone in milliseconds 
 */
ilib.TimeZone.prototype.getRawOffsetMillis = function () {
	if (typeof(this.offset) === 'undefined') {
		this._calcOffset();
	}
	return this.offset * 60 * 1000;
};

/**
 * Gets the offset from UTC for this time zone.
 * @return {string} the offset from UTC for this time zone, in the format "h:m:s" 
 */
ilib.TimeZone.prototype.getRawOffsetStr = function () {
	if (this.isLocal) {
		var off = this.getRawOffset();
		return off.h + ":" + off.m;
	} else if (typeof(this.offset) !== 'undefined') { 
		// have to check against undefined instead of just "if (this.offset)" because the 
		// offset could legally be equal to zero
		return this.getOffsetStr(undefined);
	}
	return this.zone && this.zone.o || "0:0";
};

/**
 * Return the amount of time in hours:minutes that the clock is advanced during
 * daylight savings time.
 * @return {Object.<{h:number,m:number,s:number}>} the amount of time that the 
 * clock advances for DST in hours, minutes, and seconds 
 */
ilib.TimeZone.prototype.getDSTSavings = function () {
	if (this.isLocal) {
		// take the absolute because the difference in the offsets may be positive or
		// negative, depending on the hemisphere
		var savings = Math.abs(this.offsetJan1 - this.offsetJun1);
		var hours = ilib._roundFnc.down(savings/60),
			minutes = savings - hours*60;
		return {
			h: hours,
			m: minutes
		};
	} else if (this.zone && this.zone.s) {
		return this._offsetStringToObj(this.zone.s.v);	// this.zone.start.savings
	}
	return {h:0};
};

/**
 * Return the amount of time in hours:minutes that the clock is advanced during
 * daylight savings time.
 * @return {string} the amount of time that the clock advances for DST in the
 * format "h:m:s"
 */
ilib.TimeZone.prototype.getDSTSavingsStr = function () {
	if (this.isLocal) {
		var savings = this.getDSTSavings();
		return savings.h + ":" + savings.m;
	} else if (typeof(this.offset) === 'undefined' && this.zone && this.zone.s) {
		return this.zone.s.v;	// this.zone.start.savings
	}
	return "0:0";
};

/**
 * @private
 * return the rd of the start of DST transition for the given year
 * @param {Object} rule set of rules
 * @param {number} year year to check
 * @return {number} the rd of the start of DST for the year
 */
ilib.TimeZone.prototype._calcRuleStart = function (rule, year) {
	var type, 
		weekday = 0, 
		day, 
		refDay, 
		cal, 
		rd, 
		hour = 0, 
		minute = 0, 
		second = 0,
		time,
		i;
	
	if (rule.r.charAt(0) == 'l' || rule.r.charAt(0) == 'f') {
		cal = ilib.Cal.newInstance({type: "gregorian"});
		type = rule.r.charAt(0);
		weekday = parseInt(rule.r.substring(1), 10);
		day = (type === 'l') ? cal.getMonLength(rule.m, year) : 1;
		//console.log("_calcRuleStart: Calculating the " + 
		//		(rule.r.charAt(0) == 'f' ? "first " : "last ") + weekday + 
		//		" of month " + rule.m);
	} else {
		type = "=";
		
		i = rule.r.indexOf('<');
		if (i == -1) {
			i = rule.r.indexOf('>');
		}
		
		if (i != -1) {
			type = rule.r.charAt(i);
			weekday = parseInt(rule.r.substring(0, i), 10);
			day = parseInt(rule.r.substring(i+1), 10); 
			//console.log("_calcRuleStart: Calculating the " + weekday + 
			//		type + day + " of month " + rule.m);
		} else {
			day = parseInt(rule.r, 10);
			//console.log("_calcRuleStart: Calculating the " + day + " of month " + rule.m);
		}
	}

	if (rule.t) {
		time = rule.t.split(":");
		hour = parseInt(time[0], 10);
		if (time.length > 1) {
			minute = parseInt(time[1], 10);
			if (time.length > 2) {
				second = parseInt(time[2], 10);
			}
		}
	}
	//console.log("calculating rd of " + year + "/" + rule.m + "/" + day);
	refDay = new ilib.Date.GregDate({
		year: year, 
		month: rule.m, 
		day: day, 
		hour: hour, 
		minute: minute, 
		second: second
	});
	rd = refDay.getRataDie();
	//console.log("rd is " + rd);
	
	switch (type) {
		case 'l':
		case '<':
			//console.log("returning " + refDay.onOrBeforeRd(rd, weekday));
			return refDay.onOrBeforeRd(rd, weekday);		
		case 'f':
		case '>':
			//console.log("returning " + refDay.onOrAfterRd(rd, weekday));
			return refDay.onOrAfterRd(rd, weekday);		
		default:
			//console.log("returning rd unchanged");
			return rd;
	}
};

/**
 * @private
 */
ilib.TimeZone.prototype._calcDSTSavings = function () {
	var saveParts = this.getDSTSavings();
	
	/**
	 * @private
	 * @type {number} savings in minutes when DST is in effect 
	 */
	this.dstSavings = (Math.abs(saveParts.h || 0) * 60 + (saveParts.m || 0)) * ilib.signum(saveParts.h || 0);
};

/**
 * @private
 */
ilib.TimeZone.prototype._calcOffset = function () {
	if (this.zone.o) {
		var offsetParts = this._offsetStringToObj(this.zone.o);
		/**
		 * @private
		 * @type {number} raw offset from UTC without DST, in minutes
		 */
		this.offset = (Math.abs(offsetParts.h || 0) * 60 + (offsetParts.m || 0)) * ilib.signum(offsetParts.h || 0);
	}
};

/**
 * Returns whether or not the given date is in daylight saving time for the current
 * zone. Note that daylight savings time is observed for the summer. Because
 * the seasons are reversed, daylight savings time in the southern hemisphere usually
 * runs from the end of the year through New Years into the first few months of the
 * next year. This method will correctly calculate the start and end of DST for any
 * location.
 * 
 * @param {ilib.Date=} date a date for which the info about daylight time is being sought,
 * or undefined to tell whether we are currently in daylight savings time
 * @return {boolean} true if the given date is in DST for the current zone, and false
 * otherwise.
 */
ilib.TimeZone.prototype.inDaylightTime = function (date) {
	var rd, startRd, endRd;
	
	// if we aren't using daylight time in this zone, then where are never in daylight
	// time, no matter what the date is
	if (!this.useDaylightTime()) {
		return false;
	}
	
	if (this.isLocal) {
		var d = new Date(date ? date.getTime() : undefined);
		// the DST offset is always the one that is closest to negative infinity, no matter 
		// if you are in the northern or southern hemisphere
		var dst = Math.min(this.offsetJan1, this.offsetJun1);
		return (-d.getTimezoneOffset() === dst);
	}
	
	if (!date) {
		date = ilib.Date.newInstance(); // right now
	}
	
	rd = date.getRataDie();
	startRd = this._calcRuleStart(this.zone.s, date.year);
	endRd = this._calcRuleStart(this.zone.e, date.year);
	
	// In the northern hemisphere, the start comes first some time in spring (Feb-Apr), 
	// then the end some time in the fall (Sept-Nov). In the southern
	// hemisphere, it is the other way around because the seasons are reversed. Standard
	// time is still in the winter, but the winter months are May-Aug, and daylight 
	// savings time usually starts Aug-Oct of one year and runs through Mar-May of the 
	// next year.
	
	if (startRd < endRd) {
		// northern hemisphere
		return (rd >= startRd && rd < endRd) ? true : false;
	} else {
		// southern hemisphere
		return (rd >= startRd || rd < endRd) ? true : false;
	}
};

/**
 * Returns true if this time zone switches to daylight savings time at some point
 * in the year, and false otherwise.
 * @return {boolean} true if the time zone uses daylight savings time
 */
ilib.TimeZone.prototype.useDaylightTime = function () {
	// this zone uses daylight savings time iff there is a rule defining when to start
	// and when to stop the DST
	return (this.isLocal && this.offsetJan1 !== this.offsetJun1) ||
		(typeof(this.zone) !== 'undefined' && 
		typeof(this.zone.s) !== 'undefined' && 
		typeof(this.zone.e) !== 'undefined');
};

ilib.data.pseudomap = {
	"a": "à",
	"c": "ç",
	"d": "ð",
	"e": "ë",
	"g": "ğ",
	"h": "ĥ",
	"i": "í",
	"j": "ĵ",
	"k": "ķ",
	"l": "ľ",
	"n": "ñ",
	"o": "õ",
	"p": "þ",
	"r": "ŕ",
	"s": "š",
	"t": "ţ",
	"u": "ü",
	"w": "ŵ",
	"y": "ÿ",
	"z": "ž",
	"A": "Ã",
	"B": "ß",
	"C": "Ç",
	"D": "Ð",
	"E": "Ë",
	"G": "Ĝ",
	"H": "Ħ",
	"I": "Ï",
	"J": "Ĵ",
	"K": "ĸ",
	"L": "Ľ",
	"N": "Ň",
	"O": "Ø",
	"R": "Ŗ",
	"S": "Š",
	"T": "Ť",
	"U": "Ú",
	"W": "Ŵ",
	"Y": "Ŷ",
	"Z": "Ż"
};
/*
 * resources.js - Resource bundle definition
 * 
 * Copyright © 2012-2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js locale.js strings.js util/utils.js

// !data pseudomap

/**
 * @class
 * Create a new resource bundle instance. The resource bundle loads strings
 * appropriate for a particular locale and provides them via the getString 
 * method.<p>
 * 
 * The options object may contain any (or none) of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - The locale of the strings to load. If not specified, the default
 * locale is the the default for the web page or app in which the bundle is 
 * being loaded.
 * 
 * <li><i>name</i> - Base name of the resource bundle to load. If not specified the default
 * base name is "resources".
 * 
 * <li><i>type</i> - Name the type of strings this bundle contains. Valid values are 
 * "xml", "html", "text", or "raw". The default is "text". If the type is "xml" or "html",
 * then XML/HTML entities and tags are not pseudo-translated. During a real translation, 
 * HTML character entities are translated to their corresponding characters in a source
 * string before looking that string up in the translations. Also, the characters "<", ">",
 * and "&" are converted to entities again in the output, but characters are left as they
 * are. If the type is "xml", "html", or "text" types, then the replacement parameter names
 * are not pseudo-translated as well so that the output can be used for formatting with 
 * the ilib.String class. If the type is raw, all characters are pseudo-translated, 
 * including replacement parameters as well as XML/HTML tags and entities.
 * 
 * <li><i>lengthen</i> - when pseudo-translating the string, tell whether or not to 
 * automatically lengthen the string to simulate "long" languages such as German
 * or French. This is a boolean value. Default is false.
 * 
 * <li><i>missing</i> - what to do when a resource is missing. The choices are:
 * <ul>
 *   <li><i>source</i> - return the source string unchanged
 *   <li><i>pseudo</i> - return the pseudo-translated source string, translated to the
 *   script of the locale if the mapping is available, or just the default Latin 
 *   pseudo-translation if not
 *   <li><i>empty</i> - return the empty string 
 * </ul>
 * The default behaviour is the same as before, which is to return the source string
 * unchanged.
 * 
 * <li><i>onLoad</i> - a callback function to call when the resources are fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two. 
 * 
 * <li>sync - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * The locale option may be given as a locale spec string or as an 
 * ilib.Locale object. If the locale option is not specified, then strings for
 * the default locale will be loaded.<p> 
 * 
 * The name option can be used to put groups of strings together in a
 * single bundle. The strings will then appear together in a JS object in
 * a JS file that can be included before the ilib.<p>
 * 
 * A resource bundle with a particular name is actually a set of bundles
 * that are each specific to a language, a language plus a region, etc. 
 * All bundles with the same base name should
 * contain the same set of source strings, but with different translations for 
 * the given locale. The user of the bundle does not need to be aware of 
 * the locale of the bundle, as long as it contains values for the strings 
 * it needs.<p>
 * 
 * Strings in bundles for a particular locale are inherited from parent bundles
 * that are more generic. In general, the hierarchy is as follows (from 
 * least locale-specific to most locale-specific):
 * 
 * <ol>
 * <li> language
 * <li> region
 * <li> language_script
 * <li> language_region
 * <li> region_variant
 * <li> language_script_region
 * <li> language_region_variant
 * <li> language_script_region_variant
 * </ol>
 * 
 * That is, if the translation for a string does not exist in the current
 * locale, the more-generic parent locale is searched for the string. In the
 * worst case scenario, the string is not found in the base locale's strings. 
 * In this case, the missing option guides this class on what to do. If
 * the missing option is "source", then the original source is returned as 
 * the translation. If it is "empty", the empty string is returned. If it
 * is "pseudo", then the pseudo-translated string that is appropriate for
 * the default script of the locale is returned.<p> 
 * 
 * This allows developers to create code with new or changed strings in it and check in that
 * code without waiting for the translations to be done first. The translated
 * version of the app or web site will still function properly, but will show 
 * a spurious untranslated string here and there until the translations are 
 * done and also checked in.<p>   
 *  
 * The base is whatever language your developers use to code in. For
 * a German web site, strings in the source code may be written in German 
 * for example. Often this base is English, as many web sites are coded in
 * English, but that is not required.<p>
 * 
 * The strings can be extracted with the ilib localization tool (which will be
 * shipped at some future time.) Once the strings
 * have been translated, the set of translated files can be generated with the
 * same tool. The output from the tool can be used as input to the ResBundle
 * object. It is up to the web page or app to make sure the JS file that defines
 * the bundle is included before creating the ResBundle instance.<p>
 * 
 * A special locale "zxx-XX" is used as the pseudo-translation locale because
 * zxx means "no linguistic information" in the ISO 639 standard, and the region 
 * code XX is defined to be user-defined in the ISO 3166 standard. 
 * Pseudo-translation is a locale where the translations are generated on
 * the fly based on the contents of the source string. Characters in the source 
 * string are replaced with other characters and returned. 
 * 
 * Example. If the source string is:
 * 
 * <pre>
 * "This is a string"
 * </pre>
 * 
 * then the pseudo-translated version might look something like this: 
 * 
 * <pre>
 * "Ţħïş ïş á şţřïñĝ"
 * </pre>
 * <p>
 * 
 * Pseudo-translation can be used to test that your app or web site is translatable
 * before an actual translation has happened. These bugs can then be fixed 
 * before the translation starts, avoiding an explosion of bugs later when
 * each language's tester registers the same bug complaining that the same 
 * string is not translated. When pseudo-localizing with
 * the Latin script, this allows the strings to be readable in the UI in the 
 * source language (if somewhat funky-looking), 
 * so that a tester can easily verify that the string is properly externalized 
 * and loaded from a resource bundle without the need to be able to read a
 * foreign language.<p> 
 * 
 * If one of a list of script tags is given in the pseudo-locale specifier, then the
 * pseudo-localization can map characters to very rough transliterations of
 * characters in the given script. For example, zxx-Hebr-XX maps strings to
 * Hebrew characters, which can be used to test your UI in a right-to-left
 * language to catch bidi bugs before a translation is done. Currently, the
 * list of target scripts includes Hebrew (Hebr), Chinese Simplified Han (Hans),
 * and Cyrillic (Cyrl) with more to be added later. If no script is explicitly
 * specified in the locale spec, or if the script is not supported,
 * then the default mapping maps Latin base characters to accented versions of
 * those Latin characters as in the example above.
 *  
 * When the "lengthen" property is set to true in the options, the 
 * pseudotranslation code will add digits to the end of the string to simulate
 * the lengthening that occurs when translating to other languages. The above 
 * example will come out like this:
 * 
 * <pre>
 * "Ţħïş ïş á şţřïñĝ76543210"
 * </pre>
 * 
 * The string is lengthened according to the length of the source string. If
 * the source string is less than 20 characters long, the string is lengthened 
 * by 50%. If the source string is 20-40 
 * characters long, the string is lengthened by 33%. If te string is greater
 * than 40 characters long, the string is lengthened by 20%.<p>
 * 
 * The pseudotranslation always ends a string with the digit "0". If you do
 * not see the digit "0" in the UI for your app, you know that truncation
 * has occurred, and the number you see at the end of the string tells you 
 * how many characters were truncated.<p>
 * 
 * Depends directive: !depends resources.js
 * 
 * @constructor
 * @param {?Object} options Options controlling how the bundle is created
 */
ilib.ResBundle = function (options) {
	var lookupLocale, spec;
	
	this.locale = new ilib.Locale();	// use the default locale
	this.baseName = "strings";
	this.type = "text";
	this.loadParams = {};
	this.missing = "source";
	this.sync = true;
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? 
					new ilib.Locale(options.locale) :
					options.locale;
		}
		if (options.name) {
			this.baseName = options.name;
		}
		if (options.type) {
			this.type = options.type;
		}
		this.lengthen = options.lengthen || false;
		
		if (typeof(options.sync) !== 'undefined') {
			this.sync = (options.sync == true);
		}
		
		if (typeof(options.loadParams) !== 'undefined') {
			this.loadParams = options.loadParams;
		}
		if (typeof(options.missing) !== 'undefined') {
			if (options.missing === "pseudo" || options.missing === "empty") {
				this.missing = options.missing;
			}
		}
	}
	
	this.map = {};

	if (!ilib.ResBundle[this.baseName]) {
		ilib.ResBundle[this.baseName] = {};
	}

	lookupLocale = this.locale.isPseudo() ? new ilib.Locale("en-US") : this.locale;

	ilib.loadData(ilib.ResBundle[this.baseName], lookupLocale, this.baseName, this.sync, this.loadParams, ilib.bind(this, function (map) {
		if (!map) {
			map = ilib.data[this.baseName] || {};
			spec = lookupLocale.getSpec().replace(/-/g, '_');
			ilib.ResBundle[this.baseName].cache[spec] = map;
		}
		this.map = map;
		if (this.locale.isPseudo()) {
			if (!ilib.ResBundle.pseudomap) {
				ilib.ResBundle.pseudomap = {};
			}

			this._loadPseudo(this.locale, options.onLoad);
		} else if (this.missing === "pseudo") {
			if (!ilib.ResBundle.pseudomap) {
				ilib.ResBundle.pseudomap = {};
			}

			new ilib.LocaleInfo(this.locale, {
				sync: this.sync,
				loadParams: this.loadParams,
				onLoad: ilib.bind(this, function (li) {
					var pseudoLocale = new ilib.Locale("zxx", "XX", undefined, li.getDefaultScript());
					this._loadPseudo(pseudoLocale, options.onLoad);
				})
			});
		} else {
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
		}
	}));

	// console.log("Merged resources " + this.locale.toString() + " are: " + JSON.stringify(this.map));
	//if (!this.locale.isPseudo() && ilib.isEmpty(this.map)) {
	//	console.log("Resources for bundle " + this.baseName + " locale " + this.locale.toString() + " are not available.");
	//}
};

ilib.ResBundle.prototype = {
    /**
     * @protected
     */
    _loadPseudo: function (pseudoLocale, onLoad) {
		ilib.loadData(ilib.ResBundle.pseudomap, pseudoLocale, "pseudomap", this.sync, this.loadParams, ilib.bind(this, function (map) {
			if (!map || ilib.isEmpty(map)) {
				map = ilib.data.pseudomap;
				var spec = pseudoLocale.getSpec().replace(/-/g, '_');
				ilib.ResBundle.pseudomap.cache[spec] = map;
			}
			this.pseudomap = map;
			if (typeof(onLoad) === 'function') {
				onLoad(this);
			}	
		}));
    },
    
	/**
	 * Return the locale of this resource bundle.
	 * @return {ilib.Locale} the locale of this resource bundle object 
	 */
	getLocale: function () {
		return this.locale;
	},
	
	/**
	 * Return the name of this resource bundle. This corresponds to the name option
	 * given to the constructor.
	 * @return {string} name of the the current instance
	 */
	getName: function () {
		return this.baseName;
	},
	
	/**
	 * Return the type of this resource bundle. This corresponds to the type option
	 * given to the constructor.
	 * @return {string} type of the the current instance
	 */
	getType: function () {
		return this.type;
	},

	/*
	 * @private
	 * Pseudo-translate a string
	 */
	pseudo: function (str) {
		if (!str) {
			return undefined;
		}
		var ret = "", i;
		for (i = 0; i < str.length; i++) {
			if (this.type !== "raw") {
				if (this.type === "html" || this.type === "xml") {
					if (str.charAt(i) === '<') {
						ret += str.charAt(i++);
						while (i < str.length && str.charAt(i) !== '>') {
							ret += str.charAt(i++);
						}
						if (i < str.length) {
							ret += str.charAt(i++);
						}
					} else if (str.charAt(i) === '&') {
						ret += str.charAt(i++);
						while (i < str.length && str.charAt(i) !== ';' && str.charAt(i) !== ' ') {
							ret += str.charAt(i++);
						}
						if (i < str.length) {
							ret += str.charAt(i++);
						}
					}
				}
				if (i < str.length) { 
					if (str.charAt(i) === '{') {
						ret += str.charAt(i++);
						while (i < str.length && str.charAt(i) !== '}') {
							ret += str.charAt(i++);
						}
						if (i < str.length) {
							ret += str.charAt(i);
						}
					} else {
						ret += this.pseudomap[str.charAt(i)] || str.charAt(i);
					}
				}
			} else {
				ret += this.pseudomap[str.charAt(i)] || str.charAt(i);
			}
		}
		if (this.lengthen) {
			var add;
			if (ret.length <= 20) {
				add = Math.round(ret.length / 2);
			} else if (ret.length > 20 && ret.length <= 40) {
				add = Math.round(ret.length / 3);
			} else {
				add = Math.round(ret.length / 5);
			}
			for (i = add-1; i >= 0; i--) {
				ret += (i % 10);
			}
		}
		if (this.locale.getScript() === "Hans" || this.locale.getScript() === "Hant" ||
				this.locale.getScript() === "Hani" ||
				this.locale.getScript() === "Hrkt" || this.locale.getScript() === "Jpan" ||
				this.locale.getScript() === "Hira" || this.locale.getScript() === "Kana" ) {
			// simulate Asian languages by getting rid of all the spaces
			ret = ret.replace(/ /g, "");
		}
		return ret;
	},
	
	/*
	 * @private
	 * Escape html characters in the output.
	 */
	escapeXml: function (str) {
		str = str.replace(/&/g, '&amp;');
		str = str.replace(/</g, '&lt;');
		str = str.replace(/>/g, '&gt;');
		return str;
	},

	/*
	 * @private
	 * @param {string} str the string to unescape
	 */
	unescapeXml: function (str) {
		str = str.replace(/&amp;/g, '&');
		str = str.replace(/&lt;/g, '<');
		str = str.replace(/&gt;/g, '>');
		return str;
	},
	
	/*
	 * @private
	 * Create a key name out of a source string. All this does so far is 
	 * compress sequences of white space into a single space on the assumption
	 * that this doesn't really change the meaning of the string, and therefore
	 * all such strings that compress to the same thing should share the same
	 * translation.
	 * @param {string} source the source string to make a key out of
	 */
	makeKey: function (source) {
		var key = source.replace(/\s+/gm, ' ');
		return (this.type === "xml" || this.type === "html") ? this.unescapeXml(key) : key;
	},
	
	/**
	 * Return a localized string. If the string is not found in the loaded set of
	 * resources, the original source string is returned. If the key is not given,
	 * then the source string itself is used as the key. In the case where the 
	 * source string is used as the key, the whitespace is compressed down to 1 space
	 * each, and the whitespace at the beginning and end of the string is trimmed.<p>
	 * 
	 * The escape mode specifies what type of output you are escaping the returned
	 * string for. Modes are similar to the types: 
	 * 
	 * <ul>
	 * <li>"html" -- prevents HTML injection by escaping the characters &lt &gt; and &amp;
	 * <li>"xml" -- currently same as "html" mode
	 * <li>"js" -- prevents breaking Javascript syntax by backslash escaping all quote and 
	 * double-quote characters
	 * <li>"attribute" -- meant for HTML attribute values. Currently this is the same as
	 * "js" escape mode.
	 * <li>"default" -- use the type parameter from the constructor as the escape mode as well
	 * <li>"none" or undefined -- no escaping at all.
	 * </ul>
	 * 
	 * The type parameter of the constructor specifies what type of strings this bundle
	 * is operating upon. This allows pseudo-translation and automatic key generation
	 * to happen properly by telling this class how to parse the string. The escape mode 
	 * for this method is different in that it specifies how this string will be used in 
	 * the calling code and therefore how to escape it properly.<p> 
	 * 
	 * For example, a section of Javascript code may be constructing an HTML snippet in a 
	 * string to add to the web page. In this case, the type parameter in the constructor should
	 * be "html" so that the source string can be parsed properly, but the escape mode should
	 * be "js" so that the output string can be used in Javascript without causing syntax
	 * errors.
	 * 
	 * @param {?string=} source the source string to translate
	 * @param {?string=} key optional name of the key, if any
	 * @param {?string=} escapeMode escape mode, if any
	 * @return {ilib.String|undefined} the translation of the given source/key or undefined 
	 * if the translation is not found and the source is undefined 
	 */
	getString: function (source, key, escapeMode) {
		if (!source && !key) return undefined;

		var trans;
		if (this.locale.isPseudo()) {
			var str = source ? source : this.map[key];
			trans = this.pseudo(str || key);
		} else {
			var keyName = key || this.makeKey(source);
			if (typeof(this.map[keyName]) !== 'undefined') {
				trans = this.map[keyName];
			} else if (this.missing === "pseudo") {
				trans = this.pseudo(source || key);
			} else if (this.missing === "empty") {
				trans = "";
			} else {
				trans = source;
			}
		}

		if (escapeMode && escapeMode !== "none") {
			if (escapeMode == "default") {
				escapeMode = this.type;
			}
			if (escapeMode === "xml" || escapeMode === "html") {
				trans = this.escapeXml(trans);
			} else if (escapeMode == "js" || escapeMode === "attribute") {
				trans = trans.replace(/'/g, "\\\'").replace(/"/g, "\\\"");
			}
		}
		return trans === undefined ? undefined : new ilib.String(trans);
	},
	
	/**
	 * Return true if the current bundle contains a translation for the given key and
	 * source. The
	 * getString method will always return a string for any given key and source 
	 * combination, so it cannot be used to tell if a translation exists. Either one
	 * or both of the source and key must be specified. If both are not specified,
	 * this method will return false.
	 * 
	 * @param {?string=} source source string to look up
	 * @param {?string=} key key to look up
	 * @return {boolean} true if this bundle contains a translation for the key, and 
	 * false otherwise
	 */
	containsKey: function(source, key) {
		if (typeof(source) === 'undefined' && typeof(key) === 'undefined') {
			return false;
		}
		
		var keyName = key || this.makeKey(source);
		return typeof(this.map[keyName]) !== 'undefined';
	},
	
	/**
	 * Return the merged resources as an entire object. When loading resources for a
	 * locale that are not just a set of translated strings, but instead an entire 
	 * structured javascript object, you can gain access to that object via this call. This method
	 * will ensure that all the of the parts of the object are correct for the locale.<p>
	 * 
	 * For pre-assembled data, it starts by loading <i>ilib.data[name]</i>, where 
	 * <i>name</i> is the base name for this set of resources. Then, it successively 
	 * merges objects in the base data using progressively more locale-specific data. 
	 * It loads it in this order from <i>ilib.data</i>:
	 * 
	 * <ol>
	 * <li> language
	 * <li> region
	 * <li> language_script
	 * <li> language_region
	 * <li> region_variant
	 * <li> language_script_region
	 * <li> language_region_variant
	 * <li> language_script_region_variant
	 * </ol>
	 * 
	 * For dynamically loaded data, the code attempts to load the same sequence as
	 * above, but with slash path separators instead of underscores.<p>
	 *  
	 * Loading the resources this way allows the program to share resources between all
	 * locales that share a common language, region, or script. As a 
	 * general rule-of-thumb, resources should be as generic as possible in order to
	 * cover as many locales as possible.
	 * 
	 * @return {Object} returns the object that is the basis for this resources instance
	 */
	getResObj: function () {
		return this.map;
	}
};

ilib.data.dateformats = {
	"gregorian": {
		"order": "{date} {time}",
		"date": {
			"dmwy": {
				"s": "EE d/M/yy",
				"m": "EEE d/MM/yyyy",
				"l": "EEE d MMM yyyy",
				"f": "EEEE d MMMM yyyy"
			},
			"dmy": {
				"s": "d/M/yy",
				"m": "d/MM/yyyy",
				"l": "d MMM yyyy",
				"f": "d MMMM yyyy"
			},
			"dmw": {
				"s": "EE d/M",
				"m": "EE d/MM",
				"l": "EEE d MMM",
				"f": "EEEE d MMMM"
			},
			"dm": {
				"s": "d/M",
				"m": "d/MM",
				"l": "d MMM",
				"f": "d MMMM"
			},
			"my": {
				"s": "M/yy",
				"m": "MM/yyyy",
				"l": "MMM yyyy",
				"f": "MMMM yyyy"
			},
			"dw": {
				"s": "EE d",
				"m": "EE d",
				"l": "EEE d",
				"f": "EEEE d"
			},
			"d": "dd",
			"m": {
				"s": "M",
				"m": "MM",
				"l": "MMM",
				"f": "MMMM"
			},
			"y": {
				"s": "yy",
				"m": "yyyy",
				"l": "yyyy",
				"f": "yyyy"
			},
			"n": {
				"s": "N",
				"m": "NN",
				"l": "MMM",
				"f": "MMMM"
			},
			"w": {
				"s": "E",
				"m": "EE",
				"l": "EEE",
				"f": "EEEE"
			}
		},
		"time": {
			"ahmsz": "H:mm:ssa z",
			"ahms": "H:mm:ssa",
			"hmsz": "H:mm:ss z",
			"hms": "H:mm:ss",
			"ahmz": "H:mma z",
			"ahm": "H:mma",
			"hmz": "H:mm z",
			"ah": "Ha",
			"hm": "H:mm",
			"ms": "mm:ss",
			"h": "H",
			"m": "mm",
			"s": "ss"
		},
		"range": {
			"c00": {
				"s": "{st} - {et} {sd}/{sm}/{sy}",
				"m": "{st} - {et}, {sd}/{sm}/{sy}",
				"l": "{st} - {et}, {sd} {sm} {sy}",
				"f": "{st} - {et}, {sd} {sm} {sy}"
			},
			"c01": {
				"s": "{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}",
				"m": "{sd}/{sm} {st} - {ed}/{em} {et}, {sy}",
				"l": "{sd} {st} - {ed} {et}, {sm} {sy}",
				"f": "{sd} {st} - {ed} {et}, {sm} {sy}"
			},
			"c02": {
				"s": "{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}",
				"m": "{sd}/{sm} {st} - {ed}/{em} {et}, {sy}",
				"l": "{sd} {sm} {st} - {ed} {em} {et}, {sy}",
				"f": "{sd} {sm} {st} - {ed} {em} {et}, {sy}"
			},
			"c03": {
				"s": "{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}",
				"m": "{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}",
				"l": "{sd} {sm} {sy} {st} - {ed} {em} {ey} {et}",
				"f": "{sd} {sm} {sy} {st} - {ed} {em} {ey} {et}"
			},
			"c10": {
				"s": "{sd}-{ed}/{sm}/{sy}",
				"m": "{sd}-{ed}/{sm}/{sy}",
				"l": "{sd}-{ed} {sm} {sy}",
				"f": "{sd}-{ed} {sm} {sy}"
			},
			"c11": {
				"s": "{sd}/{sm}-{ed}/{em} {sy}",
				"m": "{sd}/{sm} - {ed}/{em} {sy}",
				"l": "{sd} {sm} - {ed} {em} {sy}",
				"f": "{sd} {sm} - {ed} {em} {sy}"
			},
			"c12": {
				"s": "{sd}/{sm}/{sy}-{ed}/{em}/{ey}",
				"m": "{sd}/{sm}/{sy} - {ed}/{em}/{ey}",
				"l": "{sd} {sm} {sy} - {ed} {em} {ey}",
				"f": "{sd} {sm} {sy} - {ed} {em} {ey}"
			},
			"c20": {
				"s": "{sm}/{sy}-{em}/{ey}",
				"m": "{sm}/{sy} - {em}/{ey}",
				"l": "{sm} {sy} - {em} {ey}",
				"f": "{sm} {sy} - {em} {ey}"
			},
			"c30": "{sy} - {ey}"
		}
	},
	"islamic": "gregorian",
	"hebrew": "gregorian",
	"julian": "gregorian"
};
ilib.data.sysres = {
	"MMMM1": "January",
	"MMM1": "Jan",
	"NN1": "Ja",
	"N1": "J",
	"MMMM2": "February",
	"MMM2": "Feb",
	"NN2": "Fe",
	"N2": "F",
	"MMMM3": "March",
	"MMM3": "Mar",
	"NN3": "Ma",
	"N3": "M",
	"MMMM4": "April",
	"MMM4": "Apr",
	"NN4": "Ap",
	"N4": "A",
	"MMMM5": "May",
	"MMM5": "May",
	"NN5": "Ma",
	"N5": "M",
	"MMMM6": "June",
	"MMM6": "Jun",
	"NN6": "Ju",
	"N6": "J",
	"MMMM7": "July",
	"MMM7": "Jul",
	"NN7": "Ju",
	"N7": "J",
	"MMMM8": "August",
	"MMM8": "Aug",
	"NN8": "Au",
	"N8": "A",
	"MMMM9": "September",
	"MMM9": "Sep",
	"NN9": "Se",
	"N9": "S",
	"MMMM10": "October",
	"MMM10": "Oct",
	"NN10": "Oc",
	"N10": "O",
	"MMMM11": "November",
	"MMM11": "Nov",
	"NN11": "No",
	"N11": "N",
	"MMMM12": "December",
	"MMM12": "Dec",
	"NN12": "De",
	"N12": "D",
	"EEEE0": "Sunday",
	"EEE0": "Sun",
	"EE0": "Su",
	"E0": "S",
	"EEEE1": "Monday",
	"EEE1": "Mon",
	"EE1": "Mo",
	"E1": "M",
	"EEEE2": "Tuesday",
	"EEE2": "Tue",
	"EE2": "Tu",
	"E2": "T",
	"EEEE3": "Wednesday",
	"EEE3": "Wed",
	"EE3": "We",
	"E3": "W",
	"EEEE4": "Thursday",
	"EEE4": "Thu",
	"EE4": "Th",
	"E4": "T",
	"EEEE5": "Friday",
	"EEE5": "Fri",
	"EE5": "Fr",
	"E5": "F",
	"EEEE6": "Saturday",
	"EEE6": "Sat",
	"EE6": "Sa",
	"E6": "S",
	"ordinalChoice": "1#1st|2#2nd|3#3rd|21#21st|22#22nd|23#23rd|31#31st|#{num}th",
	"a0": "AM",
	"a1": "PM",
	"G-1": "BCE",
	"G1": "CE",
	
	"separatorFull": ", ",
	"finalSeparatorFull": ", and ",
	"separatorShort":" ",
	"separatorMedium":" ",
	"separatorLong":", ",
	
	"N1-hebrew": "N",
	"N2-hebrew": "I",
	"N3-hebrew": "S",
	"N4-hebrew": "T",
	"N5-hebrew": "A",
	"N6-hebrew": "E",
	"N7-hebrew": "T",
	"N8-hebrew": "Ḥ",
	"N9-hebrew": "K",
	"N10-hebrew": "T",
	"N11-hebrew": "S",
	"N12-hebrew": "A",
	"N13-hebrew": "A",

	"NN1-hebrew": "Ni",
	"NN2-hebrew": "Iy",
	"NN3-hebrew": "Si",
	"NN4-hebrew": "Ta",
	"NN5-hebrew": "Av",
	"NN6-hebrew": "El",
	"NN7-hebrew": "Ti",
	"NN8-hebrew": "Ḥe",
	"NN9-hebrew": "Ki",
	"NN10-hebrew": "Te",
	"NN11-hebrew": "Sh",
	"NN12-hebrew": "Ad",
	"NN13-hebrew": "A2",

	"MMM1-hebrew": "Nis",
	"MMM2-hebrew": "Iyy",
	"MMM3-hebrew": "Siv",
	"MMM4-hebrew": "Tam",
	"MMM5-hebrew": "Av",
	"MMM6-hebrew": "Elu",
	"MMM7-hebrew": "Tis",
	"MMM8-hebrew": "Ḥes",
	"MMM9-hebrew": "Kis",
	"MMM10-hebrew": "Tev",
	"MMM11-hebrew": "She",
	"MMM12-hebrew": "Ada",
	"MMM13-hebrew": "Ad2",

	"MMMM1-hebrew": "Nisan",
	"MMMM2-hebrew": "Iyyar",
	"MMMM3-hebrew": "Sivan",
	"MMMM4-hebrew": "Tammuz",
	"MMMM5-hebrew": "Av",
	"MMMM6-hebrew": "Elul",
	"MMMM7-hebrew": "Tishri",
	"MMMM8-hebrew": "Ḥeshvan",
	"MMMM9-hebrew": "Kislev",
	"MMMM10-hebrew": "Teveth",
	"MMMM11-hebrew": "Shevat",
	"MMMM12-hebrew": "Adar",
	"MMMM13-hebrew": "Adar II",

	"E0-hebrew": "R",
	"E1-hebrew": "S",
	"E2-hebrew": "S",
	"E3-hebrew": "R",
	"E4-hebrew": "Ḥ",
	"E5-hebrew": "S",
	"E6-hebrew": "S",

	"EE0-hebrew": "ri",
	"EE1-hebrew": "se",
	"EE2-hebrew": "sl",
	"EE3-hebrew": "rv",
	"EE4-hebrew": "ḥa",
	"EE5-hebrew": "si",
	"EE6-hebrew": "sa",

	"EEE0-hebrew": "ris",
	"EEE1-hebrew": "she",
	"EEE2-hebrew": "shl",
	"EEE3-hebrew": "rvi",
	"EEE4-hebrew": "ḥam",
	"EEE5-hebrew": "shi",
	"EEE6-hebrew": "sha",
	
	"EEEE0-hebrew": "yom rishon",
	"EEEE1-hebrew": "yom sheni",
	"EEEE2-hebrew": "yom shlishi",
	"EEEE3-hebrew": "yom r'vi‘i",
	"EEEE4-hebrew": "yom ḥamishi",
	"EEEE5-hebrew": "yom shishi",
	"EEEE6-hebrew": "yom shabbat",

	"N1-islamic": "M",
	"N2-islamic": "Ṣ",
	"N3-islamic": "R",
	"N4-islamic": "R",
	"N5-islamic": "J",
	"N6-islamic": "J",
	"N7-islamic": "R",
	"N8-islamic": "Š",
	"N9-islamic": "R",
	"N10-islamic": "Š",
	"N11-islamic": "Q",
	"N12-islamic": "Ḥ",

	"NN1-islamic": "Mu",
	"NN2-islamic": "Ṣa",
	"NN3-islamic": "Rb",
	"NN4-islamic": "R2",
	"NN5-islamic": "Ju",
	"NN6-islamic": "J2",
	"NN7-islamic": "Ra",
	"NN8-islamic": "Šh",
	"NN9-islamic": "Ra",
	"NN10-islamic": "Ša",
	"NN11-islamic": "Qa",
	"NN12-islamic": "Ḥi",

	"MMM1-islamic": "Muḥ",
	"MMM2-islamic": "Ṣaf",
	"MMM3-islamic": "Rab",
	"MMM4-islamic": "Ra2",
	"MMM5-islamic": "Jum",
	"MMM6-islamic": "Ju2",
	"MMM7-islamic": "Raj",
	"MMM8-islamic": "Šha",
	"MMM9-islamic": "Ram",
	"MMM10-islamic": "Šaw",
	"MMM11-islamic": "Qad",
	"MMM12-islamic": "Ḥij",

	"MMMM1-islamic": "Muḥarram",
	"MMMM2-islamic": "Ṣafar",
	"MMMM3-islamic": "Rabī‘ I",
	"MMMM4-islamic": "Rabī‘ II",
	"MMMM5-islamic": "Jumādā I",
	"MMMM6-islamic": "Jumādā II",
	"MMMM7-islamic": "Rajab",
	"MMMM8-islamic": "Šha'bān",
	"MMMM9-islamic": "Ramaḍān",
	"MMMM10-islamic": "Šawwāl",
	"MMMM11-islamic": "Ḏu al-Qa‘da",
	"MMMM12-islamic": "Ḏu al-Ḥijja",
	
	"E0-islamic": "A",
	"E1-islamic": "I",
	"E2-islamic": "T",
	"E3-islamic": "A",
	"E4-islamic": "K",
	"E5-islamic": "J",
	"E6-islamic": "S",

	"EE0-islamic": "ah",
	"EE1-islamic": "it",
	"EE2-islamic": "th",
	"EE3-islamic": "ar",
	"EE4-islamic": "kh",
	"EE5-islamic": "ju",
	"EE6-islamic": "sa",

	"EEE0-islamic": "aha",
	"EEE1-islamic": "ith",
	"EEE2-islamic": "tha",
	"EEE3-islamic": "arb",
	"EEE4-islamic": "kha",
	"EEE5-islamic": "jum",
	"EEE6-islamic": "sab",
	
	"EEEE0-islamic": "yawn al-ahad",
	"EEEE1-islamic": "yawn al-ithnaya",
	"EEEE2-islamic": "yawn uth-thalathaa",
	"EEEE3-islamic": "yawn al-arba‘a",
	"EEEE4-islamic": "yawn al-khamis",
	"EEEE5-islamic": "yawn al-jum‘a",
	"EEEE6-islamic": "yawn as-sabt"
};
/*
 * datefmt.js - Date formatter definition
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
!depends 
ilibglobal.js 
locale.js 
date.js 
strings.js 
resources.js 
calendar.js
localeinfo.js
timezone.js
*/

// !data dateformats sysres

/**
 * @class
 * 
 * Create a new date formatter instance. The date formatter is immutable once
 * it is created, but can format as many different dates as needed with the same
 * options. Create different date formatter instances for different purposes
 * and then keep them cached for use later if you have more than one date to
 * format.<p>
 * 
 * The options may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - locale to use when formatting the date/time. If the locale is
 * not specified, then the default locale of the app or web page will be used.
 * 
 * <li><i>calendar</i> - the type of calendar to use for this format. The value should
 * be a sting containing the name of the calendar. Currently, the supported
 * types are "gregorian", "julian", "arabic", "hebrew", or "chinese". If the
 * calendar is not specified, then the default calendar for the locale is used. When the
 * calendar type is specified, then the format method must be called with an instance of
 * the appropriate date type. (eg. Gregorian calendar means that the format method must 
 * be called with a GregDate instance.)
 *  
 * <li><i>timezone</i> - time zone to use when formatting times. This may be a time zone
 * instance or a time zone specifier string in RFC 822 format. If not specified, the
 * default time zone for the locale is used. If both the date object and this formatter
 * instance contain time zones and those time zones are different from each other, the 
 * formatter will calculate the offset between the time zones and subtract it from the 
 * date before formatting the result for the current time zone. The theory is that a date
 * object that contains a time zone specifies a specific instant in time that is valid
 * around the world, whereas a date object without one is a local time and can only be
 * used for doing things in the local time zone of the user.
 * 
 * <li><i>type</i> - Specify whether this formatter should format times only, dates only, or
 * both times and dates together. Valid values are "time", "date", and "datetime". Note that
 * in some locales, the standard format uses the order "time followed by date" and in others, 
 * the order is exactly opposite, so it is better to create a single "datetime" formatter 
 * than it is to create a time formatter and a date formatter separately and concatenate the 
 * results. A "datetime" formatter will get the order correct for the locale.<p>
 * 
 * The default type if none is specified in with the type option is "date".
 * 
 * <li><i>length</i> - Specify the length of the format to use. The length is the approximate size of the 
 * formatted string.
 * 
 * <ul>
 * <li><i>short</i> - use a short representation of the time. This is the most compact format possible for the locale.
 * <li><i>medium</i> - use a medium length representation of the time. This is a slightly longer format.
 * <li><i>long</i> - use a long representation of the time. This is a fully specified format, but some of the textual 
 * components may still be abbreviated
 * <li><i>full</i> - use a full representation of the time. This is a fully specified format where all the textual 
 * components are spelled out completely
 * </ul>
 * 
 * eg. The "short" format for an en_US date may be "MM/dd/yy", whereas the long format might be "d MMM, yyyy". In the long
 * format, the month name is textual instead of numeric and is longer, the year is 4 digits instead of 2, and the format 
 * contains slightly more spaces and formatting characters.<p>
 * 
 * Note that the length parameter does not specify which components are to be formatted. Use the "date" and the "time"
 * properties to specify the components. Also, very few of the components of a time format differ according to the length,
 * so this property has little to no affect on time formatting.
 * 
 * <li><i>date</i> - This property tells
 * which components of a date format to use. For example,
 * sometimes you may wish to format a date that only contains the month and date
 * without the year, such as when displaying a person's yearly birthday. The value
 * of this property allows you to specify only those components you want to see in the
 * final output, ordered correctly for the locale. <p>
 * 
 * Valid values are:
 * 
 * <ul>
 * <li><i>dmwy</i> - format all components, weekday, date, month, and year
 * <li><i>dmy</i> - format only date, month, and year
 * <li><i>dmw</i> - format only weekday, date, and month
 * <li><i>dm</i> - format only date and month
 * <li><i>my</i> - format only month and year
 * <li><i>dw</i> - format only the weekday and date
 * <li><i>d</i> - format only the date
 * <li><i>m</i> - format only the month, in numbers for shorter lengths, and letters for 
 * longer lengths
 * <li><i>n</i> - format only the month, in letters only for all lengths
 * <li><i>y</i> - format only the year
 * </ul>
 * Default components, if this property is not specified, is "dmy". This property may be specified
 * but has no affect if the current formatter is for times only.
 * 
 * <li><i>time</i> - This property gives which components of a time format to use. The time will be formatted 
 * correctly for the locale with only the time components requested. For example, a clock might only display 
 * the hour and minute and not need the seconds or the am/pm component. In this case, the time property should be set 
 * to "hm". <p>
 * 
 * Valid values for this property are:
 * 
 * <ul>
 * <li><i>ahmsz</i> - format the hours, minutes, seconds, am/pm (if using a 12 hour clock), and the time zone
 * <li><i>ahms</i> - format the hours, minutes, seconds, and am/pm (if using a 12 hour clock)
 * <li><i>hmsz</i> - format the hours, minutes, seconds, and the time zone
 * <li><i>hms</i> - format the hours, minutes, and seconds
 * <li><i>ahmz</i> - format the hours, minutes, am/pm (if using a 12 hour clock), and the time zone
 * <li><i>ahm</i> - format the hours, minutes, and am/pm (if using a 12 hour clock)
 * <li><i>hmz</i> - format the hours, minutes, and the time zone
 * <li><i>ah</i> - format only the hours and am/pm if using a 12 hour clock
 * <li><i>hm</i> - format only the hours and minutes
 * <li><i>ms</i> - format only the minutes and seconds
 * <li><i>h</i> - format only the hours
 * <li><i>m</i> - format only the minutes
 * <li><i>s</i> - format only the seconds
 * </ul>
 * 
 * If you want to format a length of time instead of a particular instant
 * in time, use the duration formatter object (ilib.DurFmt) instead because this
 * formatter is geared towards instants. A date formatter will make sure that each component of the 
 * time is within the normal range
 * for that component. That is, the minutes will always be between 0 and 59, no matter
 * what is specified in the date to format. A duration format will allow the number
 * of minutes to exceed 59 if, for example, you were displaying the length of
 * a movie of 198 minutes.<p>
 * 
 * Default value if this property is not specified is "hma".
 * 
 * <li><i>clock</i> - specify that the time formatter should use a 12 or 24 hour clock. 
 * Valid values are "12" and "24".<p>
 * 
 * In some locales, both clocks are used. For example, in en_US, the general populace uses
 * a 12 hour clock with am/pm, but in the US military or in nautical or aeronautical or 
 * scientific writing, it is more common to use a 24 hour clock. This property allows you to
 * construct a formatter that overrides the default for the locale.<p>
 * 
 * If this property is not specified, the default is to use the most widely used convention
 * for the locale.
 *  
 * <li><i>template</i> - use the given template string as a fixed format when formatting 
 * the date/time. Valid codes to use in a template string are as follows:
 * 
 * <ul>
 * <li><i>a</i> - am/pm marker
 * <li><i>d</i> - 1 or 2 digit date of month, not padded
 * <li><i>dd</i> - 1 or 2 digit date of month, 0 padded to 2 digits
 * <li><i>O</i> - ordinal representation of the date of month (eg. "1st", "2nd", etc.)
 * <li><i>D</i> - 1 to 3 digit day of year
 * <li><i>DD</i> - 1 to 3 digit day of year, 0 padded to 2 digits
 * <li><i>DDD</i> - 1 to 3 digit day of year, 0 padded to 3 digits
 * <li><i>M</i> - 1 or 2 digit month number, not padded
 * <li><i>MM</i> - 1 or 2 digit month number, 0 padded to 2 digits
 * <li><i>N</i> - 1 character month name abbreviation
 * <li><i>NN</i> - 2 character month name abbreviation
 * <li><i>MMM</i> - 3 character month month name abbreviation
 * <li><i>MMMM</i> - fully spelled out month name
 * <li><i>yy</i> - 2 digit year
 * <li><i>yyyy</i> - 4 digit year
 * <li><i>E</i> - day-of-week name, abbreviated to a single character
 * <li><i>EE</i> - day-of-week name, abbreviated to a max of 2 characters
 * <li><i>EEE</i> - day-of-week name, abbreviated to a max of 3 characters
 * <li><i>EEEE</i> - day-of-week name fully spelled out 
 * <li><i>G</i> - era designator
 * <li><i>w</i> - week number in year
 * <li><i>ww</i> - week number in year, 0 padded to 2 digits
 * <li><i>W</i> - week in month
 * <li><i>h</i> - hour (1 to 12)
 * <li><i>hh</i> - hour (1 to 12), 0 padded to 2 digits
 * <li><i>k</i> - hour (1 to 24)
 * <li><i>kk</i> - hour (1 to 24), 0 padded to 2 digits
 * <li><i>H</i> - hour (0 to 23)
 * <li><i>HH</i> - hour (0 to 23), 0 padded to 2 digits
 * <li><i>K</i> - hour (0 to 11)
 * <li><i>KK</i> - hour (0 to 11), 0 padded to 2 digits
 * <li><i>m</i> - minute in hour
 * <li><i>mm</i> - minute in hour, 0 padded to 2 digits
 * <li><i>s</i> - second in minute
 * <li><i>ss</i> - second in minute, 0 padded to 2 digits
 * <li><i>S</i> - millisecond (1 to 3 digits)
 * <li><i>SSS</i> - millisecond, 0 padded to 3 digits
 * <li><i>z</i> - general time zone
 * <li><i>Z</i> - RFC 822 time zone
 * </ul>
 * 
 * <li>onLoad - a callback function to call when the date format object is fully 
 * loaded. When the onLoad option is given, the DateFmt object will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
 * 
 * <li>sync - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 * </ul>
 * 
 * Any substring containing letters within single or double quotes will be used 
 * as-is in the final output and will not be interpretted for codes as above.<p>
 * 
 * Example: a date format in Spanish might be given as: "'El' d. 'de' MMMM", where
 * the 'El' and the 'de' are left as-is in the output because they are quoted. Typical 
 * output for this example template might be, "El 5. de Mayo".
 * 
 * The following options will be used when formatting a date/time with an explicit
 * template:
 * 
 * <ul>
 * <li>locale - the locale is only used for 
 * translations of things like month names or day-of-week names.
 * <li>calendar - used to translate a date instance into date/time component values 
 * that can be formatted into the template
 * <li>timezone - used to figure out the offset to add or subtract from the time to
 * get the final time component values
 * <li>clock - used to figure out whether to format times with a 12 or 24 hour clock.
 * If this option is specified, it will override the hours portion of a time format.
 * That is, "hh" is switched with "HH" and "kk" is switched with "KK" as appropriate. 
 * If this option is not specified, the 12/24 code in the template will dictate whether 
 * to use the 12 or 24 clock, and the 12/24 default in the locale will be ignored.
 * </ul>
 * 
 * All other options will be ignored and their corresponding getter methods will
 * return the empty string.<p>
 * 
 * Depends directive: !depends datefmt.js
 * 
 * @constructor
 * @param {Object} options options governing the way this date formatter instance works
 */
ilib.DateFmt = function(options) {
	var arr, i, bad, formats, sync = true;
	
	this.locale = new ilib.Locale();
	this.type = "date";
	this.length = "s";
	this.dateComponents = "dmy";
	this.timeComponents = "ahm";
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		if (options.type) {
			if (options.type === 'date' || options.type === 'time' || options.type === 'datetime') {
				this.type = options.type;
			}
		}
		
		if (options.calendar) {
			this.calName = options.calendar;
		}
		
		if (options.length) {
			if (options.length === 'short' ||
				options.length === 'medium' ||
				options.length === 'long' ||
				options.length === 'full') {
				// only use the first char to save space in the json files
				this.length = options.length.charAt(0);
			}
		}
		
		if (options.date) {
			arr = options.date.split("");
			arr.sort(function (left, right) {
				return (left < right) ? -1 : ((right < left) ? 1 : 0);
			});
			bad = false;
			for (i = 0; i < arr.length; i++) {
				if (arr[i] !== 'd' && arr[i] !== 'm' && arr[i] !== 'y' && arr[i] !== 'w' && arr[i] !== 'n') {
					bad = true;
					break;
				}
			}
			if (!bad) {
				this.dateComponents = arr.join("");
			}
		}

		if (options.time) {
			arr = options.time.split("");
			arr.sort(function (left, right) {
				return (left < right) ? -1 : ((right < left) ? 1 : 0);
			});
			this.badTime = false;
			for (i = 0; i < arr.length; i++) {
				if (arr[i] !== 'h' && arr[i] !== 'm' && arr[i] !== 's' && arr[i] !== 'a' && arr[i] !== 'z') {
					this.badTime = true;
					break;
				}
			}
			if (!this.badTime) {
				this.timeComponents = arr.join("");
			}
		}
		
		if (options.clock && (options.clock === '12' || options.clock === '24')) {
			this.clock = options.clock;
		}
		
		if (options.template) {
			// many options are not useful when specifying the template directly, so zero
			// them out.
			this.type = "";
			this.length = "";
			this.dateComponents = "";
			this.timeComponents = "";
			
			this.template = options.template;
		}
		
		if (options.timezone) {
			this.tz = new ilib.TimeZone({
				locale: this.locale, 
				id: options.timezone
			});
		}
		
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
	}

	if (!ilib.DateFmt.cache) {
		ilib.DateFmt.cache = {};
	}

	new ilib.LocaleInfo(this.locale, {
		sync: sync,
		onLoad: ilib.bind(this, function (li) {
			this.locinfo = li;
			
			// get the default calendar name from the locale, and if the locale doesn't define
			// one, use the hard-coded gregorian as the last resort
			this.calName = this.calName || this.locinfo.getCalendar() || "gregorian";
			switch (this.calName) {
				case 'julian':
					this.cal = new ilib.Cal.Julian();
					break;
				default:
					// just use the default Gregorian instead
					this.cal = new ilib.Cal.Gregorian();
					break;
			}

			if (this.timeComponents &&
					(this.clock === '24' || 
					(!this.clock && this.locinfo.getClock() === "24"))) {
				// make sure we don't have am/pm in 24 hour mode unless the user specifically
				// requested it in the time component option
				this.timeComponents = this.timeComponents.replace("a", "");
			}
			
			// load the strings used to translate the components
			new ilib.ResBundle({
				locale: this.locale,
				name: "sysres",
				sync: sync,
				onLoad: ilib.bind(this, function (rb) {
					this.sysres = rb;
					
					if (!this.template) {
						ilib.loadData(ilib.DateFmt, this.locale, "dateformats", sync, this.loadParams, ilib.bind(this, function (formats) {
							if (!formats) {
								formats = ilib.data.dateformats;
								var spec = this.locale.getSpec().replace(/-/g, '_');
								ilib.DateFmt.cache[spec] = formats;
							}
							this._initTemplate(formats);
							this._massageTemplate();
							if (options && typeof(options.onLoad) === 'function') {
								options.onLoad(this);
							}
						}));
					} else {
						this._massageTemplate();
						if (options && typeof(options.onLoad) === 'function') {
							options.onLoad(this);
						}
					}
				})
			});	
		})
	});
};

// used in getLength
ilib.DateFmt.lenmap = {
	"s": "short",
	"m": "medium",
	"l": "long",
	"f": "full"
};

ilib.DateFmt.zeros = "0000";

ilib.DateFmt.prototype = {
	/**
	 * @protected
	 */
	_initTemplate: function (formats) {
		if (formats[this.calName]) {
			/** 
			 * @private
			 * @type {{order:(string|{s:string,m:string,l:string,f:string}),date:Object.<string, (string|{s:string,m:string,l:string,f:string})>,time:Object.<string,(string|{s:string,m:string,l:string,f:string})>,range:Object.<string, (string|{s:string,m:string,l:string,f:string})>}}
			 */
			this.formats = formats[this.calName];
			if (typeof(this.formats) === "string") {
				// alias to another calendar type
				this.formats = formats[this.formats];
			}
			
			this.template = "";
			
			switch (this.type) {
				case "datetime":
					this.template = (this.formats && this._getLengthFormat(this.formats.order, this.length)) || "{date} {time}";
					this.template = this.template.replace("{date}", this._getFormat(this.formats.date, this.dateComponents, this.length));
					this.template = this.template.replace("{time}", this._getFormat(this.formats.time, this.timeComponents, this.length));
					break;
				case "date":
					this.template = this._getFormat(this.formats.date, this.dateComponents, this.length);
					break;
				case "time":
					this.template = this._getFormat(this.formats.time, this.timeComponents, this.length);
					break;
			}
		} else {
			throw "No formats available for calendar " + this.calName + " in locale " + this.locale.toString();
		}
	},
	
	/**
	 * @protected
	 */
	_massageTemplate: function () {
		var i;
		
		if (this.clock && this.template) {
			// explicitly set the hours to the requested type
			var temp = "";
			switch (this.clock) {
				case "24":
					for (i = 0; i < this.template.length; i++) {
						if (this.template.charAt(i) == "'") {
							temp += this.template.charAt(i++);
							while (i < this.template.length && this.template.charAt(i) !== "'") {
								temp += this.template.charAt(i++);
							}
							if (i < this.template.length) {
								temp += this.template.charAt(i);
							}
						} else if (this.template.charAt(i) == 'K') {
							temp += 'k';
						} else if (this.template.charAt(i) == 'h') {
							temp += 'H';
						} else {
							temp += this.template.charAt(i);
						}
					}
					this.template = temp;
					break;
				case "12":
					for (i = 0; i < this.template.length; i++) {
						if (this.template.charAt(i) == "'") {
							temp += this.template.charAt(i++);
							while (i < this.template.length && this.template.charAt(i) !== "'") {
								temp += this.template.charAt(i++);
							}
							if (i < this.template.length) {
								temp += this.template.charAt(i);
							}
						} else if (this.template.charAt(i) == 'k') {
							temp += 'K';
						} else if (this.template.charAt(i) == 'H') {
							temp += 'h';
						} else {
							temp += this.template.charAt(i);
						}
					}
					this.template = temp;
					break;
			}
		}
		
		// tokenize it now for easy formatting
		this.templateArr = this._tokenize(this.template);
	},
    
	/**
	 * @protected
	 * Convert the template into an array of date components separated by formatting chars.
	 * @param {string} template Format template to tokenize into components
	 * @return {Array.<string>} a tokenized array of date format components
	 */
	_tokenize: function (template) {
		var i = 0, start, ch, letter, arr = [];
		
		// console.log("_tokenize: tokenizing template " + template);
		if (template) {
			while (i < template.length) {
				ch = template.charAt(i);
				start = i;
				if (ch === "'") {
					// console.log("found quoted string");
					i++;
					// escaped string - push as-is, then dequote later
					while (i < template.length && template.charAt(i) !== "'") {
						i++;
					}
					if (i < template.length) {
						i++;	// grab the other quote too
					}
				} else if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
					letter = template.charAt(i);
					// console.log("found letters " + letter);
					while (i < template.length && ch === letter) {
						ch = template.charAt(++i);
					}
				} else {
					// console.log("found other");
					while (i < template.length && ch !== "'" && (ch < 'a' || ch > 'z') && (ch < 'A' || ch > 'Z')) {
						ch = template.charAt(++i);
					}
				}
				arr.push(template.substring(start,i));
				// console.log("start is " + start + " i is " + i + " and substr is " + template.substring(start,i));
			}
		}
		return arr;
	},
                          
	/**
	 * @protected
	 * @param {Object.<string, (string|{s:string,m:string,l:string,f:string})>} obj Object to search
	 * @param {string} components Format components to search
	 * @param {string} length Length of the requested format
	 * @return {string|undefined} the requested format
	 */
	_getFormat: function getFormat(obj, components, length) {
		if (typeof(components) !== 'undefined' && obj[components]) {
			return this._getLengthFormat(obj[components], length);
		}
		return undefined;
	},

	/**
	 * @protected
	 * @param {(string|{s:string,m:string,l:string,f:string})} obj Object to search
	 * @param {string} length Length of the requested format
	 * @return {(string|undefined)} the requested format
	 */
	_getLengthFormat: function getLengthFormat(obj, length) {
		if (typeof(obj) === 'string') {
			return obj;
		} else if (obj[length]) {
			return obj[length];
		}
		return undefined;
	},

	/**
	 * Return the locale used with this formatter instance.
	 * @return {ilib.Locale} the ilib.Locale instance for this formatter
	 */
	getLocale: function() {
		return this.locale;
	},
	
	/**
	 * Return the template string that is used to format date/times for this
	 * formatter instance. This will work, even when the template property is not explicitly 
	 * given in the options to the constructor. Without the template option, the constructor 
	 * will build the appropriate template according to the options and use that template
	 * in the format method. 
	 * 
	 * @return {string} the format template for this formatter
	 */
	getTemplate: function() {
		return this.template;
	},
	
	/**
	 * Return the type of this formatter. The type is a string that has one of the following
	 * values: "time", "date", "datetime".
	 * @return {string} the type of the formatter
	 */
	getType: function() {
		return this.type;
	},
	
	/**
	 * Return the name of the calendar used to format date/times for this
	 * formatter instance.
	 * @return {string} the name of the calendar used by this formatter
	 */
	getCalendar: function () {
		return this.cal.getType();
	},
	
	/**
	 * Return the length used to format date/times in this formatter. This is either the
	 * value of the length option to the constructor, or the default value.
	 * 
	 * @return {string} the length of formats this formatter returns
	 */
	getLength: function () {
		return ilib.DateFmt.lenmap[this.length] || "";
	},
	
	/**
	 * Return the date components that this formatter formats. This is either the 
	 * value of the date option to the constructor, or the default value. If this
	 * formatter is a time-only formatter, this method will return the empty 
	 * string. The date component letters may be specified in any order in the 
	 * constructor, but this method will reorder the given components to a standard 
	 * order.
	 * 
	 * @return {string} the date components that this formatter formats
	 */
	getDateComponents: function () {
		return this.dateComponents || "";
	},

	/**
	 * Return the time components that this formatter formats. This is either the 
	 * value of the time option to the constructor, or the default value. If this
	 * formatter is a date-only formatter, this method will return the empty 
	 * string. The time component letters may be specified in any order in the 
	 * constructor, but this method will reorder the given components to a standard 
	 * order.
	 * 
	 * @return {string} the time components that this formatter formats
	 */
	getTimeComponents: function () {
		return this.timeComponents || "";
	},

	/**
	 * Return the time zone used to format date/times for this formatter
	 * instance.
	 * @return a string naming the time zone
	 */
	getTimeZone: function () {
		// Lazy load the time zone. If it wasn't explicitly set up before, set 
		// it up now, but use the 
		// default TZ for the locale. This way, if the caller never uses the
		// time zone in their format, we never have to load up a TimeZone
		// instance into this formatter.
		if (!this.tz) {
			this.tz = new ilib.TimeZone({locale: this.locale});
		}
		return this.tz;
	},
	
	/**
	 * Return the clock option set in the constructor. If the clock option was
	 * not given, the default from the locale is returned instead.
	 * @return {string} "12" or "24" depending on whether this formatter uses
	 * the 12-hour or 24-hour clock
	 */
	getClock: function () {
		return this.clock || this.locinfo.getClock();
	},
	
	/**
	 * Convert this formatter to a string representation by returning the
	 * format template. This method delegates to getTemplate.
	 * 
	 * @return {string} the format template
	 */
	toString: function() {
		return this.getTemplate();
	},
	
	/*
	 * @private
	 * Left pad the str to the given length of digits with zeros
	 * @param {string} str the string to pad
	 * @param {number} length the desired total length of the output string, padded 
	 */
	_pad: function (str, length) {
		if (typeof(str) !== 'string') {
			str = "" + str;
		}
		return (str.length >= length) ? str : ilib.DateFmt.zeros.substring(0,length-str.length) + str;
	},
	
	/*
	 * @private
	 * Format a date according to a sequence of components. 
	 * @param {ilib.Date} date a date/time object to format
	 * @param {Array.<string>} templateArr an array of components to format
	 * @return {string} the formatted date
	 */
	_formatTemplate: function (date, templateArr) {
		var i, key, temp, tz, str = "";
		for (i = 0; i < templateArr.length; i++) {
			switch (templateArr[i]) {
				case 'd':
					str += (date.day || 1);
					break;
				case 'dd':
					str += this._pad(date.day || 1, 2);
					break;
				case 'yy':
					temp = "" + (date.year || 1);
					str += this._pad(temp.substring(2,4), 2);
					break;
				case 'yyyy':
					str += this._pad(date.year || 1, 4);
					break;
				case 'M':
					str += (date.month || 1);
					break;
				case 'MM':
					str += this._pad(date.month || 1, 2);
					break;

				case 'h':
					temp = (date.hour || 0) % 12;
					if (temp == 0) {
						temp = "12";
					}
					str += temp; 
					break;
				case 'hh':
					temp = (date.hour || 0) % 12;
					if (temp == 0) {
						temp = "12";
					}
					str += this._pad(temp, 2);
					break;
				case 'K':
					temp = (date.hour || 0) % 12;
					str += temp; 
					break;
				case 'KK':
					temp = (date.hour || 0) % 12;
					str += this._pad(temp, 2);
					break;

				case 'H':
					str += (date.hour || 0);
					break;
				case 'HH':
					str += this._pad(date.hour || 0, 2);
					break;
				case 'k':
					str += (date.hour == 0 ? "24" : date.hour);
					break;
				case 'kk':
					temp = (date.hour == 0 ? "24" : date.hour);
					str += this._pad(temp, 2);
					break;

				case 'm':
					str += (date.minute || 0);
					break;
				case 'mm':
					str += this._pad(date.minute || 0, 2);
					break;
				case 's':
					str += (date.minute || 0);
					break;
				case 'ss':
					str += this._pad(date.second || 0, 2);
					break;
				case 'S':
					str += (date.millisecond || 0);
					break;
				case 'SSS':
					str += this._pad(date.millisecond || 0, 3);
					break;

				case 'N':
				case 'NN':
				case 'MMM':
				case 'MMMM':
					key = templateArr[i] + (date.month || 1);
					str += (this.sysres.getString(undefined, key + "-" + this.calName) || this.sysres.getString(undefined, key));
					break;

				case 'E':
				case 'EE':
				case 'EEE':
				case 'EEEE':
					key = templateArr[i] + date.getDayOfWeek();
					//console.log("finding " + key + " in the resources");
					str += (this.sysres.getString(undefined, key + "-" + this.calName) || this.sysres.getString(undefined, key));
					break;
					
				case 'a':
					if (this.locale.getLanguage() === 'zh') {
						if (date.hour < 6) {
							key = "azh0";
						} else if (date.hour < 9) {
							key = "azh1";
						} else if (date.hour < 12) {
							key = "azh2";
						} else if (date.hour < 13) {
							key = "azh3";
						} else if (date.hour < 18) {
							key = "azh4";
						} else if (date.hour < 21) {
							key = "azh5";
						} else {
							key = "azh6";
						}
					} else {
						key = date.hour < 12 ? "a0" : "a1";
					}
					//console.log("finding " + key + " in the resources");
					str += (this.sysres.getString(undefined, key + "-" + this.calName) || this.sysres.getString(undefined, key));
					break;
					
				case 'w':
					str += date.getWeekOfYear();
					break;
				case 'ww':
					str += this._pad(date.getWeekOfYear(), 2);
					break;

				case 'D':
					str += date.getDayOfYear();
					break;
				case 'DD':
					str += this._pad(date.getDayOfYear(), 2);
					break;
				case 'DDD':
					str += this._pad(date.getDayOfYear(), 3);
					break;
				case 'W':
					str += date.getWeekOfMonth(this.locale);
					break;

				case 'G':
					key = "G" + date.getEra();
					str += (this.sysres.getString(undefined, key + "-" + this.calName) || this.sysres.getString(undefined, key));
					break;

				case 'O':
					temp = this.sysres.getString("1#1st|2#2nd|3#3rd|21#21st|22#22nd|23#23rd|31#31st|#{num}th", "ordinalChoice");
					str += temp.formatChoice(date.day, {num: date.day});
					break;
					
				case 'z': // general time zone
					tz = this.getTimeZone(); // lazy-load the tz
					str += tz.getDisplayName(date, "standard");
					break;
				case 'Z': // RFC 822 time zone
					tz = this.getTimeZone(); // lazy-load the tz
					str += tz.getDisplayName(date, "rfc822");
					break;

				default:
					str += templateArr[i].replace(/'/g, "");
					break;
			}
		}
		return str;
	},
	
	/**
	 * Format a particular date instance according to the settings of this
	 * formatter object. The type of the date instance being formatted must 
	 * correspond exactly to the calendar type with which this formatter was 
	 * constructed. If the types are not compatible, this formatter will
	 * produce bogus results.
	 * 
	 * @param {ilib.Date} date a date to format
	 * @return {string} the formatted version of the given date instance
	 */
	format: function (date) {
		if (!date.getCalendar || date.getCalendar() !== this.calName) {
			throw "Wrong date type passed to ilib.DateFmt.format()";
		}
		
		// convert to the time zone of this formatter before formatting
		if (date.timezone && this.tz) {
			// console.log("Differing time zones " + date.timezone + " and " + this.tz.getId() + ". Converting...");
			
			var datetz = new ilib.TimeZone({
				locale: date.locale,
				id: date.timezone
			});
			
			var dateOffset = datetz.getOffset(date),
				fmtOffset = this.tz.getOffset(date),
				// relative offset in seconds
				offset = (dateOffset.h || 0)*60*60 + (dateOffset.m || 0)*60 + (dateOffset.s || 0) -
					((fmtOffset.h || 0)*60*60 + (fmtOffset.m || 0)*60 + (fmtOffset.s || 0));
			
			//console.log("Date offset is " + JSON.stringify(dateOffset));
			//console.log("Formatter offset is " + JSON.stringify(fmtOffset));
			//console.log("Relative offset is " + offset + " seconds.");
			
			var newDate = ilib.Date.newInstance({
				type: this.calName,
				rd: date.getRataDie() - (offset / 86400) // 86400 seconds in a day
			});
			
			date = newDate;
		}
		return this._formatTemplate(date, this.templateArr);
	},
	
	/**
	 * Return a string that describes a date relative to the given 
	 * reference date. The string returned is text that for the locale that
	 * was specified when the formatter instance was constructed.<p>
	 * 
	 * The date can be in the future relative to the reference date or in
	 * the past, and the formatter will generate the appropriate string.<p>
	 * 
	 * The text used to describe the relative reference depends on the length
	 * of time between the date and the reference. If the time was in the
	 * past, it will use the "ago" phrase, and in the future, it will use
	 * the "in" phrase. Examples:<p>
	 * 
	 * <ul>
	 * <li>within a minute: either "X seconds ago" or "in X seconds"
	 * <li>within an hour: either "X minutes ago" or "in X minutes"
	 * <li>within a day: either "X hours ago" or "in X hours"
	 * <li>within 2 weeks: either "X days ago" or "in X days"
	 * <li>within 12 weeks (~3 months): either "X weeks ago" or "in X weeks"
	 * <li>within two years: either "X months ago" or "in X months"
	 * <li>longer than 2 years: "X years ago" or "in X years"
	 * </ul>
	 * 
	 * @param {ilib.Date} reference a date that the date parameter should be relative to
	 * @param {ilib.Date} date a date being formatted
	 * @throws "Wrong calendar type" when the start or end dates are not the same
	 * calendar type as the formatter itself
	 * @return {string} the formatted relative date
	 */
	formatRelative: function(reference, date) {
		var referenceRd, dateRd, fmt, time, diff, num;
		
		if (typeof(reference) !== 'object' || !reference.getCalendar || reference.getCalendar() !== this.calName ||
			typeof(date) !== 'object' || !date.getCalendar || date.getCalendar() !== this.calName) {
			throw "Wrong calendar type";
		}
		
		referenceRd = reference.getRataDie();
		dateRd = date.getRataDie();
		
		if (dateRd < referenceRd) {
			diff = referenceRd - dateRd;
			fmt = this.sysres.getString("{duration} ago");
		} else {
			diff = dateRd - referenceRd;
			fmt = this.sysres.getString("in {duration}");
		}
		
		if (diff < 0.000694444) {
			num = Math.round(diff * 86400);
			switch (this.length) {
				case 's':
					time = this.sysres.getString("#{num}s");
					break;
				case 'm':
					time = this.sysres.getString("1#1 se|#{num} sec");
					break;
				case 'l':
					time = this.sysres.getString("1#1 sec|#{num} sec");
					break;
				default:
				case 'f':
					time = this.sysres.getString("1#1 second|#{num} seconds");
					break;
			}
		} else if (diff < 0.041666667) {
			num = Math.round(diff * 1440);
			switch (this.length) {
				case 's':
					time = this.sysres.getString("#{num}m", "durationShortMinutes");
					break;
				case 'm':
					time = this.sysres.getString("1#1 mi|#{num} min");
					break;
				case 'l':
					time = this.sysres.getString("1#1 min|#{num} min");
					break;
				default:
				case 'f':
					time = this.sysres.getString("1#1 minute|#{num} minutes");
					break;
			}
		} else if (diff < 1) {
			num = Math.round(diff * 24);
			switch (this.length) {
				case 's':
					time = this.sysres.getString("#{num}h");
					break;
				case 'm':
					time = this.sysres.getString("1#1 hr|#{num} hrs", "durationMediumHours");
					break;
				case 'l':
					time = this.sysres.getString("1#1 hr|#{num} hrs");
					break;
				default:
				case 'f':
					time = this.sysres.getString("1#1 hour|#{num} hours");
					break;
			}
		} else if (diff < 14) {
			num = Math.round(diff);
			switch (this.length) {
				case 's':
					time = this.sysres.getString("#{num}d");
					break;
				case 'm':
					time = this.sysres.getString("1#1 dy|#{num} dys");
					break;
				case 'l':
					time = this.sysres.getString("1#1 day|#{num} days", "durationLongDays");
					break;
				default:
				case 'f':
					time = this.sysres.getString("1#1 day|#{num} days");
					break;
			}
		} else if (diff < 84) {
			num = Math.round(diff/7);
			switch (this.length) {
				case 's':
					time = this.sysres.getString("#{num}w");
					break;
				case 'm':
					time = this.sysres.getString("1#1 wk|#{num} wks", "durationMediumWeeks");
					break;
				case 'l':
					time = this.sysres.getString("1#1 wk|#{num} wks");
					break;
				default:
				case 'f':
					time = this.sysres.getString("1#1 week|#{num} weeks");
					break;
			}
		} else if (diff < 730) {
			num = Math.round(diff/30.4);
			switch (this.length) {
				case 's':
					time = this.sysres.getString("#{num}m", "durationShortMonths");
					break;
				case 'm':
					time = this.sysres.getString("1#1 mo|#{num} mos");
					break;
				case 'l':
					time = this.sysres.getString("1#1 mon|#{num} mons");
					break;
				default:
				case 'f':
					time = this.sysres.getString("1#1 month|#{num} months");
					break;
			}
		} else {
			num = Math.round(diff/365);
			switch (this.length) {
				case 's':
					time = this.sysres.getString("#{num}y");
					break;
				case 'm':
					time = this.sysres.getString("1#1 yr|#{num} yrs", "durationMediumYears");
					break;
				case 'l':
					time = this.sysres.getString("1#1 yr|#{num} yrs");
					break;
				default:
				case 'f':
					time = this.sysres.getString("1#1 year|#{num} years");
					break;
			}
		}
		return fmt.format({duration: time.formatChoice(num, {num: num})});
	}
};

/*
 * datefmt.js - Date formatter definition
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
!depends 
ilibglobal.js 
locale.js 
date.js 
strings.js 
calendar.js
localeinfo.js
timezone.js
datefmt.js
*/

// !data dateformats sysres

/**
 * @class
 * 
 * Create a new date range formatter instance. The date range formatter is immutable once
 * it is created, but can format as many different date ranges as needed with the same
 * options. Create different date range formatter instances for different purposes
 * and then keep them cached for use later if you have more than one range to
 * format.<p>
 * 
 * The options may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - locale to use when formatting the date/times in the range. If the 
 * locale is not specified, then the default locale of the app or web page will be used.
 * 
 * <li><i>calendar</i> - the type of calendar to use for this format. The value should
 * be a sting containing the name of the calendar. Currently, the supported
 * types are "gregorian", "julian", "arabic", "hebrew", or "chinese". If the
 * calendar is not specified, then the default calendar for the locale is used. When the
 * calendar type is specified, then the format method must be called with an instance of
 * the appropriate date type. (eg. Gregorian calendar means that the format method must 
 * be called with a GregDate instance.)
 *  
 * <li><i>timezone</i> - time zone to use when formatting times. This may be a time zone
 * instance or a time zone specifier string in RFC 822 format. If not specified, the
 * default time zone for the locale is used.
 * 
 * <li><i>length</i> - Specify the length of the format to use as a string. The length 
 * is the approximate size of the formatted string.
 * 
 * <ul>
 * <li><i>short</i> - use a short representation of the time. This is the most compact format possible for the locale.
 * <li><i>medium</i> - use a medium length representation of the time. This is a slightly longer format.
 * <li><i>long</i> - use a long representation of the time. This is a fully specified format, but some of the textual 
 * components may still be abbreviated. (eg. "Tue" instead of "Tuesday")
 * <li><i>full</i> - use a full representation of the time. This is a fully specified format where all the textual 
 * components are spelled out completely.
 * </ul>
 * 
 * eg. The "short" format for an en_US range may be "MM/yy - MM/yy", whereas the long format might be 
 * "MMM, yyyy - MMM, yyyy". In the long format, the month name is textual instead of numeric 
 * and is longer, the year is 4 digits instead of 2, and the format contains slightly more 
 * spaces and formatting characters.<p>
 * 
 * Note that the length parameter does not specify which components are to be formatted. The
 * components that are formatted depend on the length of time in the range.
 * 
 * <li><i>clock</i> - specify that formatted times should use a 12 or 24 hour clock if the
 * format happens to include times. Valid values are "12" and "24".<p>
 * 
 * In some locales, both clocks are used. For example, in en_US, the general populace uses
 * a 12 hour clock with am/pm, but in the US military or in nautical or aeronautical or 
 * scientific writing, it is more common to use a 24 hour clock. This property allows you to
 * construct a formatter that overrides the default for the locale.<p>
 * 
 * If this property is not specified, the default is to use the most widely used convention
 * for the locale.
 * <li>onLoad - a callback function to call when the date range format object is fully 
 * loaded. When the onLoad option is given, the DateRngFmt object will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two. 
 * 
 * <li>sync - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 * </ul>
 * <p>
 * 
 * Depends directive: !depends daterangefmt.js
 * 
 * @constructor
 * @param {Object} options options governing the way this date range formatter instance works
 */
ilib.DateRngFmt = function(options) {
	var sync = true;
	this.locale = new ilib.Locale();
	this.length = "s";
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		if (options.length) {
			if (options.length === 'short' ||
				options.length === 'medium' ||
				options.length === 'long' ||
				options.length === 'full') {
				// only use the first char to save space in the json files
				this.length = options.length.charAt(0);
			}
		}
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
	}
	
	var opts = {};
	ilib.shallowCopy(options, opts);
	opts.sync = true;
	/**
	 * @private
	 */
	opts.onLoad = ilib.bind(this, function (fmt) {
		this.dateFmt = fmt;
		if (fmt) {
			this.locinfo = this.dateFmt.locinfo;

			// get the default calendar name from the locale, and if the locale doesn't define
			// one, use the hard-coded gregorian as the last resort
			this.calName = this.calName || this.locinfo.getCalendar() || "gregorian";
			switch (this.calName) {
				case 'julian':
					this.cal = new ilib.Cal.Julian();
					break;
				default:
					// just use the default Gregorian instead
					this.cal = new ilib.Cal.Gregorian();
					break;
			}
			
			this.timeTemplate = this.dateFmt._getFormat(this.dateFmt.formats.time, this.dateFmt.timeComponents, this.length) || "hh:mm";
			this.timeTemplateArr = this.dateFmt._tokenize(this.timeTemplate);
			
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
		}
	});

	// delegate a bunch of the formatting to this formatter
	new ilib.DateFmt(opts);
};

ilib.DateRngFmt.prototype = {
	/**
	 * Return the locale used with this formatter instance.
	 * @return {ilib.Locale} the ilib.Locale instance for this formatter
	 */
	getLocale: function() {
		return this.locale;
	},
	
	/**
	 * Return the name of the calendar used to format date/times for this
	 * formatter instance.
	 * @return {string} the name of the calendar used by this formatter
	 */
	getCalendar: function () {
		return this.dateFmt.getCalendar();
	},
	
	/**
	 * Return the length used to format date/times in this formatter. This is either the
	 * value of the length option to the constructor, or the default value.
	 * 
	 * @return {string} the length of formats this formatter returns
	 */
	getLength: function () {
		return ilib.DateFmt.lenmap[this.length] || "";
	},
	
	/**
	 * Return the time zone used to format date/times for this formatter
	 * instance.
	 * @return {ilib.TimeZone} a string naming the time zone
	 */
	getTimeZone: function () {
		return this.dateFmt.getTimeZone();
	},
	
	/**
	 * Return the clock option set in the constructor. If the clock option was
	 * not given, the default from the locale is returned instead.
	 * @return {string} "12" or "24" depending on whether this formatter uses
	 * the 12-hour or 24-hour clock
	 */
	getClock: function () {
		return this.dateFmt.getClock();
	},
	
	/**
	 * Format a date/time range according to the settings of the current
	 * formatter. The range is specified as being from the "start" date until
	 * the "end" date. <p>
	 * 
	 * The template that the date/time range uses depends on the
	 * length of time between the dates, on the premise that a long date range
	 * which is too specific is not useful. For example, when giving
	 * the dates of the 100 Years War, in most situations it would be more 
	 * appropriate to format the range as "1337 - 1453" than to format it as 
	 * "10:37am November 9, 1337 - 4:37pm July 17, 1453", as the latter format 
	 * is much too specific given the length of time that the range represents.
	 * If a very specific, but long, date range really is needed, the caller 
	 * should format two specific dates separately and put them 
	 * together as you might with other normal strings.<p>
	 * 
	 * The format used for a date range contains the following date components,
	 * where the order of those components is rearranged and the component values 
	 * are translated according to each locale:
	 * 
	 * <ul>
	 * <li>within 3 days: the times of day, dates, months, and years
	 * <li>within 730 days (2 years): the dates, months, and years
	 * <li>within 3650 days (10 years): the months and years
	 * <li>longer than 10 years: the years only 
	 * </ul>
	 * 
	 * In general, if any of the date components share a value between the
	 * start and end date, that component is only given once. For example,
	 * if the range is from November 15, 2011 to November 26, 2011, the 
	 * start and end dates both share the same month and year. The 
	 * range would then be formatted as "November 15-26, 2011". <p>
	 * 
	 * If you want to format a length of time instead of a particular range of
	 * time (for example, the length of an event rather than the specific start time
	 * and end time of that event), then use a duration formatter instance 
	 * (ilib.DurFmt) instead. The formatRange method will make sure that each component 
	 * of the date/time is within the normal range for that component. For example, 
	 * the minutes will always be between 0 and 59, no matter what is specified in 
	 * the date to format, because that is the normal range for minutes. A duration 
	 * format will allow the number of minutes to exceed 59. For example, if you 
	 * were displaying the length of a movie that is 198 minutes long, the minutes
	 * component of a duration could be 198.<p>
	 * 
	 * @param {ilib.Date} start the starting date/time of the range. This must be of 
	 * the same calendar type as the formatter itself. 
	 * @param {ilib.Date} end the ending date/time of the range. This must be of the 
	 * same calendar type as the formatter itself.
	 * @throws "Wrong calendar type" when the start or end dates are not the same
	 * calendar type as the formatter itself
	 * @return {string} a date range formatted for the locale
	 */
	format: function (start, end) {
		var startRd, endRd, fmt = "", yearTemplate, monthTemplate, dayTemplate;
		
		if (typeof(start) !== 'object' || !start.getCalendar || start.getCalendar() !== this.calName ||
			typeof(end) !== 'object' || !end.getCalendar || end.getCalendar() !== this.calName) {
			throw "Wrong calendar type";
		}
		
		startRd = start.getRataDie();
		endRd = end.getRataDie();
		
		// 
		// legend:
		// c00 - difference is less than 3 days. Year, month, and date are same, but time is different
		// c01 - difference is less than 3 days. Year and month are same but date and time are different
		// c02 - difference is less than 3 days. Year is same but month, date, and time are different. (ie. it straddles a month boundary)
		// c03 - difference is less than 3 days. Year, month, date, and time are all different. (ie. it straddles a year boundary)
		// c10 - difference is less than 2 years. Year and month are the same, but date and time are different.
		// c11 - difference is less than 2 years. Year is the same, but month, date, and time are different.
		// c12 - difference is less than 2 years. All fields are different. (ie. straddles a year boundary)
		// c20 - difference is less than 10 years. All fields are different.
		// c30 - difference is more than 10 years. All fields are different.
		//
		
		if (endRd - startRd < 3) {
			if (start.year === end.year) {
				if (start.month === end.month) {
					if (start.day === end.day) {
						fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c00", this.length));
					} else {
						fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c01", this.length));
					}
				} else {
					fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c02", this.length));
				}
			} else {
				fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c03", this.length));
			}
		} else if (endRd - startRd < 730) {
			if (start.year === end.year) {
				if (start.month === end.month) {
					fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c10", this.length));
				} else {
					fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c11", this.length));
				}
			} else {
				fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c12", this.length));
			}
		} else if (endRd - startRd < 3650) {
			fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c20", this.length));
		} else {
			fmt = new ilib.String(this.dateFmt._getFormat(this.dateFmt.formats.range, "c30", this.length));
		}

		yearTemplate = this.dateFmt._tokenize(this.dateFmt._getFormat(this.dateFmt.formats.date, "y", this.length) || "yyyy");
		monthTemplate = this.dateFmt._tokenize(this.dateFmt._getFormat(this.dateFmt.formats.date, "m", this.length) || "MM");
		dayTemplate = this.dateFmt._tokenize(this.dateFmt._getFormat(this.dateFmt.formats.date, "d", this.length) || "dd");
		
		/*
		console.log("fmt is " + fmt.toString());
		console.log("year template is " + yearTemplate);
		console.log("month template is " + monthTemplate);
		console.log("day template is " + dayTemplate);
		*/
		
		return fmt.format({
			sy: this.dateFmt._formatTemplate(start, yearTemplate),
			sm: this.dateFmt._formatTemplate(start, monthTemplate),
			sd: this.dateFmt._formatTemplate(start, dayTemplate),
			st: this.dateFmt._formatTemplate(start, this.timeTemplateArr),
			ey: this.dateFmt._formatTemplate(end, yearTemplate),
			em: this.dateFmt._formatTemplate(end, monthTemplate),
			ed: this.dateFmt._formatTemplate(end, dayTemplate),
			et: this.dateFmt._formatTemplate(end, this.timeTemplateArr)
		});
	}
};

/*
 * hebrew.js - Represent a Hebrew calendar object.
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/* !depends calendar.js locale.js date.js julianday.js util/utils.js */

/**
 * @class
 * Construct a new Hebrew calendar object. This class encodes information about
 * the Hebrew (Jewish) calendar. The Hebrew calendar is a tabular hebrew 
 * calendar where the dates are calculated by arithmetic rules. This differs from 
 * the religious Hebrew calendar which is used to mark the beginning of particular 
 * holidays. The religious calendar depends on the first sighting of the new 
 * crescent moon to determine the first day of the new month. Because humans and 
 * weather are both involved, the actual time of sighting varies, so it is not 
 * really possible to precalculate the religious calendar. Certain groups, such 
 * as the Hebrew Society of North America, decreed in in 2007 that they will use
 * a calendar based on calculations rather than observations to determine the 
 * beginning of lunar months, and therefore the dates of holidays.<p>
 * 
 * Depends directive: !depends hebrew.js
 * 
 * @constructor
 * @implements ilib.Cal
 */
ilib.Cal.Hebrew = function() {
	this.type = "hebrew";
};


/**
 * @private
 * Return the number of days elapsed in the Hebrew calendar before the
 * given year starts.
 * @param {number} year the year for which the number of days is sought
 * @return {number} the number of days elapsed in the Hebrew calendar before the
 * given year starts
 */
ilib.Cal.Hebrew.elapsedDays = function(year) {
	var months = Math.floor(((235*year) - 234)/19);
	var parts = 204 + 793 * ilib.mod(months, 1080);
	var hours = 11 + 12 * months + 793 * Math.floor(months/1080) + 
		Math.floor(parts/1080);
	var days = 29 * months + Math.floor(hours/24);
	return (ilib.mod(3 * (days + 1), 7) < 3) ? days + 1 : days;
};

/**
 * @private
 * Return the number of days that the New Year's (Rosh HaShanah) in the Hebrew 
 * calendar will be corrected for the given year. Corrections are caused because New 
 * Year's is not allowed to start on certain days of the week. To deal with 
 * it, the start of the new year is corrected for the next year by adding a 
 * day to the 8th month (Heshvan) and/or the 9th month (Kislev) in the current
 * year to make them 30 days long instead of 29.
 * 
 * @param {number} year the year for which the correction is sought
 * @param {number} elapsed number of days elapsed up to this year
 * @return {number} the number of days correction in the current year to make sure
 * Rosh HaShanah does not fall on undesirable days of the week
 */
ilib.Cal.Hebrew.newYearsCorrection = function(year, elapsed) {
	var lastYear = ilib.Cal.Hebrew.elapsedDays(year-1),
		thisYear = elapsed,
		nextYear = ilib.Cal.Hebrew.elapsedDays(year+1);
	
	return (nextYear - thisYear) == 356 ? 2 : ((thisYear - lastYear) == 382 ? 1 : 0);
};

/**
 * @private
 * Return the rata die date of the new year for the given hebrew year.
 * @param {number} year the year for which the new year is needed
 * @return {number} the rata die date of the new year
 */
ilib.Cal.Hebrew.newYear = function(year) {
	var elapsed = ilib.Cal.Hebrew.elapsedDays(year); 
	
	return elapsed + ilib.Cal.Hebrew.newYearsCorrection(year, elapsed);
};

/**
 * @private
 * Return the number of days in the given year. Years contain a variable number of
 * days because the date of Rosh HaShanah (New Year's) changes so that it doesn't
 * fall on particular days of the week. Days are added to the months of Heshvan
 * and/or Kislev in the previous year in order to prevent the current year's New
 * Year from being on Sunday, Wednesday, or Friday.
 * 
 * @param {number} year the year for which the length is sought
 * @return {number} number of days in the given year
 */
ilib.Cal.Hebrew.daysInYear = function(year) {
	return ilib.Cal.Hebrew.newYear(year+1) - ilib.Cal.Hebrew.newYear(year);
};

/**
 * @private
 * Return true if the given year contains a long month of Heshvan. That is,
 * it is 30 days instead of 29.
 * 
 * @param {number} year the year in which that month is questioned
 * @return {boolean} true if the given year contains a long month of Heshvan
 */
ilib.Cal.Hebrew.longHeshvan = function(year) {
	return ilib.mod(ilib.Cal.Hebrew.daysInYear(year), 10) === 5;
};

/**
 * @private
 * Return true if the given year contains a long month of Kislev. That is,
 * it is 30 days instead of 29.
 * 
 * @param {number} year the year in which that month is questioned
 * @return {boolean} true if the given year contains a short month of Kislev
 */
ilib.Cal.Hebrew.longKislev = function(year) {
	return ilib.mod(ilib.Cal.Hebrew.daysInYear(year), 10) !== 3;
};

/**
 * @private
 * Return the date of the last day of the month for the given year. The date of
 * the last day of the month is variable because a number of months gain an extra 
 * day in leap years, and it is variable which months gain a day for each leap 
 * year and which do not.
 * 
 * @param {number} month the month for which the number of days is sought
 * @param {number} year the year in which that month is
 * @return {number} the number of days in the given month and year
 */
ilib.Cal.Hebrew.prototype.lastDayOfMonth = function(month, year) {
	switch (month) {
		case 2: 
		case 4: 
		case 6: 
		case 10: 
			return 29;
		case 13:
			return this.isLeapYear(year) ? 29 : 0;
		case 8:
			return ilib.Cal.Hebrew.longHeshvan(year) ? 30 : 29;
		case 9:
			return ilib.Cal.Hebrew.longKislev(year) ? 30 : 29;
		case 12:
		case 1:
		case 3:
		case 5:
		case 7:
		case 11:
			return 30;
		default:
			return 0;
	}
};

/**
 * Return the number of months in the given year. The number of months in a year varies
 * for luni-solar calendars because in some years, an extra month is needed to extend the 
 * days in a year to an entire solar year. The month is represented as a 1-based number
 * where 1=first month, 2=second month, etc.
 * 
 * @param {number} year a year for which the number of months is sought
 */
ilib.Cal.Hebrew.prototype.getNumMonths = function(year) {
	return this.isLeapYear(year) ? 13 : 12;
};

/**
 * Return the number of days in a particular month in a particular year. This function
 * can return a different number for a month depending on the year because of leap years.
 *
 * @param {number} month the month for which the length is sought
 * @param {number} year the year within which that month can be found
 * @returns {number} the number of days within the given month in the given year, or
 * 0 for an invalid month in the year
 */
ilib.Cal.Hebrew.prototype.getMonLength = function(month, year) {
	if (month < 1 || month > 13 || (month == 13 && !this.isLeapYear(year))) {
		return 0;
	}
	return this.lastDayOfMonth(month, year);
};

/**
 * Return true if the given year is a leap year in the Hebrew calendar.
 * The year parameter may be given as a number, or as a HebrewDate object.
 * @param {number|Object} year the year for which the leap year information is being sought
 * @returns {boolean} true if the given year is a leap year
 */
ilib.Cal.Hebrew.prototype.isLeapYear = function(year) {
	var y = (typeof(year) == 'number') ? year : year.year;
	return (ilib.mod(1 + 7 * y, 19) < 7);
};

/**
 * Return the type of this calendar.
 * 
 * @returns {string} the name of the type of this calendar 
 */
ilib.Cal.Hebrew.prototype.getType = function() {
	return this.type;
};

/**
 * Return a date instance for this calendar type using the given
 * options.
 * @param {Object} options options controlling the construction of 
 * the date instance
 * @returns {ilib.Date} a date appropriate for this calendar type
 */
ilib.Cal.Hebrew.prototype.newDateInstance = function (options) {
	return new ilib.Date.HebrewDate(options);
};

/*register this calendar for the factory method */
ilib.Cal._constructors["hebrew"] = ilib.Cal.Hebrew;

/*
 * hebrewdate.js - Represent a date in the Hebrew calendar
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends date.js calendar/hebrew.js util/utils.js */

/**
 * @class
 * 
 * Construct a new civil Hebrew date object. The constructor can be called
 * with a params object that can contain the following properties:<p>
 * 
 * <ul>
 * <li><i>julianday</i> - the Julian Day to set into this date
 * <li><i>year</i> - any integer except 0. Years go from -1 (BCE) to 1 (CE), skipping the zero year
 * <li><i>month</i> - 1 to 12, where 1 means Nisan, 2 means Iyyar, etc.
 * <li><i>day</i> - 1 to 30
 * <li><i>hour</i> - 0 to 23. A formatter is used to display 12 hour clocks, but this representation 
 * is always done with an unambiguous 24 hour representation
 * <li><i>parts</i> - 0 to 1079. Specify the halaqim parts of an hour. Either specify 
 * the parts or specify the minutes, seconds, and milliseconds, but not both. 
 * <li><i>minute</i> - 0 to 59
 * <li><i>second</i> - 0 to 59
 * <li><i>millisecond</i> - 0 to 999
 * <li><i>locale</i> - the ilib.TimeZone instance or time zone name as a string 
 * of this julian date. The date/time is kept in the local time. The time zone
 * is used later if this date is formatted according to a different time zone and
 * the difference has to be calculated, or when the date format has a time zone
 * component in it.
 * <li><i>timezone</i> - the time zone of this instance. If the time zone is not 
 * given, it can be inferred from this locale. For locales that span multiple
 * time zones, the one with the largest population is chosen as the one that 
 * represents the locale. 
 * </ul>
 * 
 * If called with another Hebrew date argument, the date components of the given
 * date are copied into the current one.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above 
 * from <i>julianday</i> through <i>millisecond</i> are present, then the date 
 * components are 
 * filled in with the current date at the time of instantiation. Note that if
 * you do not give the time zone when defaulting to the current time and the 
 * time zone for all of ilib was not set with <i>ilib.setTimeZone()</i>, then the
 * time zone will default to UTC ("Universal Time, Coordinated" or "Greenwich 
 * Mean Time").<p>
 * 
 * Depends directive: !depends hebrewdate.js
 * 
 * @constructor
 * @extends ilib.Date
 * @param {Object=} params parameters that govern the settings and behaviour of this Hebrew date
 */
ilib.Date.HebrewDate = function(params) {
	this.cal = new ilib.Cal.Hebrew();
	
	if (params) {
		if (params.timezone) {
			this.timezone = params.timezone;
		}
		if (params.locale) {
			this.locale = (typeof(params.locale) === 'string') ? new ilib.Locale(params.locale) : params.locale;
			if (!this.timezone) {
				var li = new ilib.LocaleInfo(this.locale);
				this.timezone = li.getTimeZone(); 
			}
		}

		if (typeof(params.unixtime) != 'undefined') {
			this.setTime(parseInt(params.unixtime, 10));
		} else if (typeof(params.julianday) != 'undefined') {
			this.setJulianDay(parseFloat(params.julianday));
		} else if (params.year || params.month || params.day || params.hour ||
				params.minute || params.second || params.millisecond || params.parts ) {
			/**
			 * Year in the Hebrew calendar.
			 * @type number
			 */
			this.year = parseInt(params.year, 10) || 0;

			/**
			 * The month number, ranging from 1 to 13.
			 * @type number
			 */
			this.month = parseInt(params.month, 10) || 1;

			/**
			 * The day of the month. This ranges from 1 to 30.
			 * @type number
			 */
			this.day = parseInt(params.day, 10) || 1;
			
			/**
			 * The hour of the day. This can be a number from 0 to 23, as times are
			 * stored unambiguously in the 24-hour clock.
			 * @type number
			 */
			this.hour = parseInt(params.hour, 10) || 0;

			this.parts = -1;
			
			if (typeof(params.parts) !== 'undefined') {
				/**
				 * The parts (halaqim) of the hour. This can be a number from 0 to 1079.
				 * @type number
				 */
				this.parts = parseInt(params.parts, 10);
				var seconds = parseInt(params.parts, 10) * 3.333333333333;
				this.minute = Math.floor(seconds / 60);
				seconds -= this.minute * 60;
				this.second = Math.floor(seconds);
				this.millisecond = (seconds - this.second);	
			} else {
				/**
				 * The minute of the hours. Ranges from 0 to 59.
				 * @type number
				 */
				this.minute = parseInt(params.minute, 10) || 0;
	
				/**
				 * The second of the minute. Ranges from 0 to 59.
				 * @type number
				 */
				this.second = parseInt(params.second, 10) || 0;
	
				/**
				 * The millisecond of the second. Ranges from 0 to 999.
				 * @type number
				 */
				this.millisecond = parseInt(params.millisecond, 10) || 0;
			}
				
			/**
			 * The day of the year. Ranges from 1 to 383.
			 * @type number
			 */
			this.dayOfYear = parseInt(params.dayOfYear, 10);
		} else if (typeof(params.rd) != 'undefined') {
			// private parameter. Do not document this!
			this.setRd(params.rd);
		} else {
			// Date.getTime() gets unix time in UTC
			var now = new Date();
			this.setTime(now.getTime() - now.getTimezoneOffset()*60000);
		}
	} else {
		// Date.getTime() gets unix time in UTC
		var now = new Date();
		this.setTime(now.getTime() - now.getTimezoneOffset()*60000);
	}
};

ilib.Date.HebrewDate.prototype = new ilib.Date();
ilib.Date.HebrewDate.prototype.parent = ilib.Date;
ilib.Date.HebrewDate.prototype.constructor = ilib.Date.HebrewDate;

/**
 * @private
 * @const
 * @type Array.<number>
 * the cumulative lengths of each month for a non-leap year, without new years corrections
 */
ilib.Date.HebrewDate.cumMonthLengths = [
	176,  /* Nisan */
	206,  /* Iyyar */
	235,  /* Sivan */
	265,  /* Tammuz */
	294,  /* Av */
	324,  /* Elul */
	0,    /* Tishri - Jewish New Year (Rosh HaShanah) starts in month 7 */
	30,   /* Heshvan */
	59,   /* Kislev */
	88,   /* Teveth */
	117,  /* Shevat */
	147   /* Adar I */
];

/**
 * @private
 * @const
 * @type Array.<number>
 * the cumulative lengths of each month for a non-leap year, without new years corrections,
 * that can be used in reverse to map days to months
 */
ilib.Date.HebrewDate.cumMonthLengthsReverse = [
//  [days, monthnumber],                                                
	[0,   7],  /* Tishri - Jewish New Year (Rosh HaShanah) starts in month 7 */
	[30,  8],  /* Heshvan */
	[59,  9],  /* Kislev */
	[88,  10], /* Teveth */
	[117, 11], /* Shevat */
	[147, 12], /* Adar I */
	[176, 1],  /* Nisan */
	[206, 2],  /* Iyyar */
	[235, 3],  /* Sivan */
	[265, 4],  /* Tammuz */
	[294, 5],  /* Av */
	[324, 6],  /* Elul */
	[354, 7]   /* end of year sentinel value */
];

/**
 * @private
 * @const
 * @type Array.<number>
 * the cumulative lengths of each month for a leap year, without new years corrections 
 */
ilib.Date.HebrewDate.cumMonthLengthsLeap = [
	206,  /* Nisan */
	236,  /* Iyyar */
	265,  /* Sivan */
	295,  /* Tammuz */
	324,  /* Av */
	354,  /* Elul */
	0,    /* Tishri - Jewish New Year (Rosh HaShanah) starts in month 7 */
	30,   /* Heshvan */
	59,   /* Kislev */
	88,   /* Teveth */
	117,  /* Shevat */
	147,  /* Adar I */
	177   /* Adar II */
];

/**
 * @private
 * @const
 * @type Array.<number>
 * the cumulative lengths of each month for a leap year, without new years corrections
 * that can be used in reverse to map days to months 
 */
ilib.Date.HebrewDate.cumMonthLengthsLeapReverse = [
//  [days, monthnumber],                                                
	[0,   7],  /* Tishri - Jewish New Year (Rosh HaShanah) starts in month 7 */
	[30,  8],  /* Heshvan */
	[59,  9],  /* Kislev */
	[88,  10], /* Teveth */
	[117, 11], /* Shevat */
	[147, 12], /* Adar I */
	[177, 13], /* Adar II */
	[206, 1],  /* Nisan */
	[236, 2],  /* Iyyar */
	[265, 3],  /* Sivan */
	[295, 4],  /* Tammuz */
	[324, 5],  /* Av */
	[354, 6],  /* Elul */
	[384, 7]   /* end of year sentinel value */
];

/**
 * @private
 * @const
 * @type number
 * Number of days difference between RD 0 of the Gregorian calendar 
 * (Jan 1, 1 Gregorian = JD 1721057.5) and RD 0 of the Hebrew calendar
 * (September 7, -3760 Gregorian = JD 347997.25)
 */
ilib.Date.HebrewDate.GregorianDiff = 1373060.25;

/**
 * @private
 * @const
 * @type number
 * The difference between a zero Julian day and the first day of the Hebrew 
 * calendar: sunset on Monday, Tishri 1, 1 = September 7, 3760 BC Gregorian = JD 347997.25
 */
ilib.Date.HebrewDate.epoch = 347997.25;

/**
 * @private
 * Return the Rata Die (fixed day) number of the given date.
 * 
 * @param {Object} date hebrew date to calculate
 * @return {number} the rd date as a number
 */
ilib.Date.HebrewDate.prototype.calcRataDie = function(date) {
	var elapsed = ilib.Cal.Hebrew.elapsedDays(date.year);
	var days = elapsed +
		ilib.Cal.Hebrew.newYearsCorrection(date.year, elapsed) +
		date.day - 1;
	var i, sum = 0, table;
	
	//console.log("getRataDie: converting " +  JSON.stringify(date));
	//console.log("getRataDie: days is " +  days);
	//console.log("getRataDie: new years correction is " +  ilib.Cal.Hebrew.newYearsCorrection(date.year, elapsed));
	
	table = this.cal.isLeapYear(date.year) ? 
				ilib.Date.HebrewDate.cumMonthLengthsLeap :
				ilib.Date.HebrewDate.cumMonthLengths;
	sum = table[date.month-1];
	
	// gets cumulative without correction, so now add in the correction
	if ((date.month < 7 || date.month > 8) && ilib.Cal.Hebrew.longHeshvan(date.year)) {
		sum++;
	}
	if ((date.month < 7 || date.month > 9) && ilib.Cal.Hebrew.longKislev(date.year)) {
		sum++;
	}
	// console.log("getRataDie: cum days is now " +  sum);
	
	days += sum;
	
	// the date starts at sunset, which we take as 18:00, so the hours from
	// midnight to 18:00 are on the current Gregorian day, and the hours from
	// 18:00 to midnight are on the previous Gregorian day. So to calculate the 
	// number of hours into the current day that this time represents, we have
	// to count from 18:00 to midnight first, and add in 6 hours if the time is
	// less than 18:00
	var time;
	if (date.hour >= 18) {
		time = ((date.hour - 18 || 0) * 3600000 +
			(date.minute || 0) * 60000 +
			(date.second || 0) * 1000 +
			(date.millisecond || 0)) / 
			86400000;
	} else {
		time = 0.25 +	// 6 hours from 18:00 to midnight on the previous gregorian day
				((date.hour || 0) * 3600000 +
				(date.minute || 0) * 60000 +
				(date.second || 0) * 1000 +
				(date.millisecond || 0)) / 
				86400000;
	}
	
	//console.log("getRataDie: rd is " +  (days + time));
	return days + time;
};

/**
 * @private
 * Return the Rata Die (fixed day) number of this date.
 * 
 * @return {number} the rd date as a number
 */
ilib.Date.HebrewDate.prototype.getRataDie = function() {
	return this.calcRataDie(this);
};

/**
 * @private
 * Calculate date components for the given RD date.
 * @return {Object.<{year:number,month:number,day:number,hour:number,minute:number,second:number,millisecond:number}>} object containing the fields
 */
ilib.Date.HebrewDate.prototype.calcComponents = function (rd) {
	var ret = {},
		remainder,
		approximation,
		year,
		month,
		i,
		table,
		target,
		thisNewYear = 0,
		nextNewYear;
	
	// console.log("HebrewDate.calcComponents: calculating for rd " + rd);
	
	// divide by the average number of days per year in the Hebrew calendar
	// to approximate the year, then tweak it to get the real year
	approximation = Math.floor(rd / 365.246822206) + 1;
	
	// console.log("HebrewDate.calcComponents: approx is " + approximation);
	
	// search forward from approximation-1 for the year that actually contains this rd
	year = approximation;
	thisNewYear = ilib.Cal.Hebrew.newYear(year-1);
	nextNewYear = ilib.Cal.Hebrew.newYear(year);
	while (rd >= nextNewYear) {
		year++;
		thisNewYear = nextNewYear;
		nextNewYear = ilib.Cal.Hebrew.newYear(year);
	}
	ret.year = year-1;
	
	// console.log("HebrewDate.calcComponents: year is " + ret.year + " with starting rd " + thisNewYear);
	
	remainder = rd - thisNewYear;
	// console.log("HebrewDate.calcComponents: remainder is " + remainder);

	// take out new years corrections so we get the right month when we look it up in the table
	if (remainder >= 59) {
		if (remainder >= 88) {
			if (ilib.Cal.Hebrew.longKislev(ret.year)) {
				remainder--;
			}
		}
		if (ilib.Cal.Hebrew.longHeshvan(ret.year)) {
			remainder--;
		}
	}
	
	// console.log("HebrewDate.calcComponents: after new years corrections, remainder is " + remainder);
	
	table = this.cal.isLeapYear(ret.year) ? 
			ilib.Date.HebrewDate.cumMonthLengthsLeapReverse :
			ilib.Date.HebrewDate.cumMonthLengthsReverse;
	
	i = 0;
	target = Math.floor(remainder);
	while (i+1 < table.length && target >= table[i+1][0]) {
		i++;
	}
	
	ret.month = table[i][1];
	// console.log("HebrewDate.calcComponents: remainder is " + remainder);
	remainder -= table[i][0];
	
	// console.log("HebrewDate.calcComponents: month is " + ret.month + " and remainder is " + remainder);
	
	ret.day = Math.floor(remainder);
	remainder -= ret.day;
	ret.day++; // days are 1-based
	
	// console.log("HebrewDate.calcComponents: day is " + ret.day + " and remainder is " + remainder);

	// now convert to milliseconds for the rest of the calculation
	remainder = Math.round(remainder * 86400000);
	
	ret.hour = Math.floor(remainder/3600000);
	remainder -= ret.hour * 3600000;
	
	// the hours from 0 to 6 are actually 18:00 to midnight of the previous
	// gregorian day, so we have to adjust for that
	if (ret.hour >= 6) {
		ret.hour -= 6;
	} else {
		ret.hour += 18;
	}
		
	ret.minute = Math.floor(remainder/60000);
	remainder -= ret.minute * 60000;
	
	ret.second = Math.floor(remainder/1000);
	remainder -= ret.second * 1000;
	
	ret.millisecond = remainder;
	
	// console.log("HebrewDate.calcComponent: final result is " + JSON.stringify(ret));
	return ret;
};

/**
 * @private
 * Set the date components of this instance based on the given rd.
 * @param {number} rd the rata die date to set
 */
ilib.Date.HebrewDate.prototype.setRd = function (rd) {
	var fields = this.calcComponents(rd);
	
	this.year = fields.year;
	this.month = fields.month;
	this.day = fields.day;
	this.hour = fields.hour;
	this.minute = fields.minute;
	this.second = fields.second;
	this.millisecond = fields.millisecond;
};

/**
 * Set the date of this instance using a Julian Day.
 * @param {number} date the Julian Day to use to set this date
 */
ilib.Date.HebrewDate.prototype.setJulianDay = function (date) {
	var jd = (typeof(date) === 'number') ? new ilib.JulianDay(date) : date,
		rd;	// rata die -- # of days since the beginning of the calendar
	
	rd = jd.getDate() - ilib.Date.HebrewDate.epoch; 	// Julian Days start at noon
	this.setRd(rd);
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 * 
 * @return {number} the day of the week
 */
ilib.Date.HebrewDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.getRataDie());
	return ilib.mod(rd+1, 7);
};

/**
 * Get the Halaqim (parts) of an hour. There are 1080 parts in an hour, which means
 * each part is 3.33333333 seconds long. This means the number returned may not
 * be an integer.
 * 
 * @return {number} the halaqim parts of the current hour
 */
ilib.Date.HebrewDate.prototype.getHalaqim = function() {
	if (this.parts < 0) {
		// convert to ms first, then to parts
		var h = this.minute * 60000 + this.second * 1000 + this.millisecond;
		this.parts = (h * 0.0003);
	}
	return this.parts;
};

/**
 * @private
 * Return the rd of the particular day of the week on or before the given rd.
 * eg. The Sunday on or before the given rd.
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the reference date
 */
ilib.Date.HebrewDate.prototype.onOrBeforeRd = function(rd, dayOfWeek) {
	return rd - ilib.mod(Math.floor(rd) - dayOfWeek + 1, 7);
};

/**
 * @private
 * Return the rd of the particular day of the week on or before the given rd.
 * eg. The Sunday on or before the given rd.
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the reference date
 */
ilib.Date.HebrewDate.prototype.onOrAfterRd = function(rd, dayOfWeek) {
	return this.onOrBeforeRd(rd+6, dayOfWeek);
};

/**
 * @private
 * Return the rd of the particular day of the week before the given rd.
 * eg. The Sunday before the given rd.
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the reference date
 */
ilib.Date.HebrewDate.prototype.beforeRd = function(rd, dayOfWeek) {
	return this.onOrBeforeRd(rd-1, dayOfWeek);
};

/**
 * @private
 * Return the rd of the particular day of the week after the given rd.
 * eg. The Sunday after the given rd.
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the reference date
 */
ilib.Date.HebrewDate.prototype.afterRd = function(rd, dayOfWeek) {
	return this.onOrBeforeRd(rd+7, dayOfWeek);
};

/**
 * @private
 * Return the rd of the first Sunday of the given ISO year.
 * @return the rd of the first Sunday of the ISO year
 */
ilib.Date.HebrewDate.prototype.firstSunday = function (year) {
	var tishri1 = this.calcRataDie({
		year: year,
		month: 7,
		day: 1,
		hour: 18,
		minute: 0,
		second: 0,
		millisecond: 0
	});
	var firstThu = this.onOrAfterRd(tishri1, 4);
	return this.beforeRd(firstThu, 0);
};

/**
 * Return a new Hebrew date instance that represents the first instance of the 
 * given day of the week before the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week before the current date that is being sought
 * @returns {ilib.Date.HebrewDate} the date being sought
 */
ilib.Date.HebrewDate.prototype.before = function (dow) {
	return new ilib.Date.HebrewDate({rd: this.beforeRd(this.getRataDie(), dow)});
};

/**
 * Return a new Hebrew date instance that represents the first instance of the 
 * given day of the week after the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week after the current date that is being sought
 * @returns {ilib.Date.HebrewDate} the date being sought
 */
ilib.Date.HebrewDate.prototype.after = function (dow) {
	return new ilib.Date.HebrewDate({rd: this.afterRd(this.getRataDie(), dow)});
};

/**
 * Return a new Hebrew date instance that represents the first instance of the 
 * given day of the week on or before the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week on or before the current date that is being sought
 * @returns {ilib.Date.HebrewDate} the date being sought
 */
ilib.Date.HebrewDate.prototype.onOrBefore = function (dow) {
	return new ilib.Date.HebrewDate({rd: this.onOrBeforeRd(this.getRataDie(), dow)});
};

/**
 * Return a new Hebrew date instance that represents the first instance of the 
 * given day of the week on or after the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week on or after the current date that is being sought
 * @returns {ilib.Date.HebrewDate} the date being sought
 */
ilib.Date.HebrewDate.prototype.onOrAfter = function (dow) {
	return new ilib.Date.HebrewDate({rd: this.onOrAfterRd(this.getRataDie(), dow)});
};

/**
 * Return the week number in the current year for the current date. This is calculated
 * in a similar way to the ISO 8601 week for a Gregorian calendar, but is technically
 * not an actual ISO week number. That means in some years, the week starts in the
 * previous calendar year. The week number ranges from 1 to 55.
 * 
 * @return {number} the week number for the current date
 */
ilib.Date.HebrewDate.prototype.getWeekOfYear = function() {
	var rd = this.getRataDie(),
		yearStart = this.firstSunday(this.year),
		nextYear;
	
	// if we have a Tishri date, it may be in this year or the previous year
	if (rd < yearStart) {
		yearStart = this.firstSunday(this.year-1);
	} else if (this.month == 6 && this.day > 23) {
		// if we have a late Elul date, it may be in this year, or the next year
		nextYear = this.firstSunday(this.year+1);
		if (rd >= nextYear) {
			yearStart = nextYear;
		}
	}
	
	return Math.floor((rd-yearStart)/7) + 1;
};

/**
 * Return the ordinal day of the year. Days are counted from 1 and proceed linearly up to 
 * 385, regardless of months or weeks, etc. That is, Tishri 1st is day 1, and 
 * Elul 29 is 385 for a leap year with a long Heshvan and long Kislev.
 * @return {number} the ordinal day of the year
 */
ilib.Date.HebrewDate.prototype.getDayOfYear = function() {
	var table = this.cal.isLeapYear(this.year) ? 
				ilib.Date.HebrewDate.cumMonthLengthsLeap : 
				ilib.Date.HebrewDate.cumMonthLengths;
	var days = table[this.month-1];
	if ((this.month < 7 || this.month > 8) && ilib.Cal.Hebrew.longHeshvan(this.year)) {
		days++;
	}
	if ((this.month < 7 || this.month > 9) && ilib.Cal.Hebrew.longKislev(this.year)) {
		days++;
	}

	return days + this.day;
};

/**
 * Return the ordinal number of the week within the month. The first week of a month is
 * the first one that contains 4 or more days in that month. If any days precede this
 * first week, they are marked as being in week 0. This function returns values from 0
 * through 6.<p>
 * 
 * The locale is a required parameter because different locales that use the same 
 * Hebrew calendar consider different days of the week to be the beginning of
 * the week. This can affect the week of the month in which some days are located.
 * 
 * @param {ilib.Locale|string} locale the locale or locale spec to use when figuring out 
 * the first day of the week
 * @return {number} the ordinal number of the week within the current month
 */
ilib.Date.HebrewDate.prototype.getWeekOfMonth = function(locale) {
	var li = new ilib.LocaleInfo(locale),
		first = this.calcRataDie({
			year: this.year,
			month: this.month,
			day: 1,
			hour: 18,
			minute: 0,
			second: 0,
			millisecond: 0
		}),
		rd = this.getRataDie(),
		weekStart = this.onOrAfterRd(first, li.getFirstDayOfWeek());
	
	if (weekStart - first > 3) {
		// if the first week has 4 or more days in it of the current month, then consider
		// that week 1. Otherwise, it is week 0. To make it week 1, move the week start
		// one week earlier.
		weekStart -= 7;
	}
	return (rd < weekStart) ? 0 : Math.floor((rd - weekStart) / 7) + 1;
};

/**
 * Return the era for this date as a number. The value for the era for Hebrew 
 * calendars is -1 for "before the Hebrew era" and 1 for "the Hebrew era". 
 * Hebrew era dates are any date after Tishri 1, 1, which is the same as
 * September 7, 3760 BC in the Gregorian calendar. 
 * 
 * @return {number} 1 if this date is in the Hebrew era, -1 if it is before the 
 * Hebrew era 
 */
ilib.Date.HebrewDate.prototype.getEra = function() {
	return (this.year < 1) ? -1 : 1;
};

/**
 * Return the unix time equivalent to this Hebrew date instance. Unix time is
 * the number of milliseconds since midnight on Jan 1, 1970 (Gregorian). This method only
 * returns a valid number for dates between midnight, Jan 1, 1970 (Gregorian) and  
 * Jan 19, 2038 at 3:14:07am (Gregorian), when the unix time runs out. If this instance 
 * encodes a date outside of that range, this method will return -1.
 * 
 * @return {number} a number giving the unix time, or -1 if the date is outside the
 * valid unix time range
 */
ilib.Date.HebrewDate.prototype.getTime = function() {
	var jd = this.getJulianDay();
	var unix;

	// not earlier than Jan 1, 1970 (Gregorian)
	// or later than Jan 19, 2038 at 3:14:07am (Gregorian)
	if (jd < 2440587.5 || jd > 2465442.634803241) { 
		return -1;
	}

	// avoid the rounding errors in the floating point math by only using
	// the whole days from the rd, and then calculating the milliseconds directly
	var seconds = Math.floor(jd - 2440587.5) * 86400 +
		this.hour * 3600 + 
		this.minute * 60 +
		this.second;
	var millis = seconds * 1000 + this.millisecond;
	
	return millis;
};

/**
 * Set the time of this instance according to the given unix time. Unix time is
 * the number of milliseconds since midnight on Jan 1, 1970.
 * 
 * @param {number} millis the unix time to set this date to in milliseconds 
 */
ilib.Date.HebrewDate.prototype.setTime = function(millis) {
	var jd = 2440587.5 + millis / 86400000;
	this.setJulianDay(jd);
};

/**
 * Return a Javascript Date object that is equivalent to this Hebrew date
 * object.
 * 
 * @return {Date|undefined} a javascript Date object
 */
ilib.Date.HebrewDate.prototype.getJSDate = function() {
	var unix = this.getTime();
	return (unix === -1) ? undefined : new Date(unix); 
};

/**
 * Return the Julian Day equivalent to this calendar date as a number.
 * 
 * @return {number} the julian date equivalent of this date
 */
ilib.Date.HebrewDate.prototype.getJulianDay = function() {
	return this.getRataDie() + ilib.Date.HebrewDate.epoch;
};

/**
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
ilib.Date.HebrewDate.prototype.getCalendar = function() {
	return "hebrew";
};

/**
 * Return the time zone associated with this Hebrew date, or 
 * undefined if none was specified in the constructor.
 * 
 * @return {string|undefined} the name of the time zone for this date instance
 */
ilib.Date.HebrewDate.prototype.getTimeZone = function() {
	return this.timezone;
};


/**
 * Set the time zone associated with this Hebrew date.
 * @param {string} tzName the name of the time zone to set into this date instance,
 * or "undefined" to unset the time zone 
 */
ilib.Date.HebrewDate.prototype.setTimeZone = function (tzName) {
	if (!tzName || tzName === "") {
		// same as undefining it
		this.timezone = undefined;
	} else if (typeof(tzName) === 'string') {
		this.timezone = tzName;
	}
};

// register with the factory method
ilib.Date._constructors["hebrew"] = ilib.Date.HebrewDate;
/*
 * islamic.js - Represent a Islamic calendar object.
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/* !depends calendar.js locale.js date.js julianday.js util/utils.js */

/**
 * @class
 * Construct a new Islamic calendar object. This class encodes information about
 * the civil Islamic calendar. The civil Islamic calendar is a tabular islamic 
 * calendar where the dates are calculated by arithmetic rules. This differs from 
 * the religious Islamic calendar which is used to mark the beginning of particular 
 * holidays. The religious calendar depends on the first sighting of the new 
 * crescent moon to determine the first day of the new month. Because humans and 
 * weather are both involved, the actual time of sighting varies, so it is not 
 * really possible to precalculate the religious calendar. Certain groups, such 
 * as the Islamic Society of North America, decreed in in 2007 that they will use
 * a calendar based on calculations rather than observations to determine the 
 * beginning of lunar months, and therefore the dates of holidays.<p>
 * 
 * Depends directive: !depends islamic.js
 * 
 * @constructor
 * @implements ilib.Cal
 */
ilib.Cal.Islamic = function() {
	this.type = "islamic";
};

/**
 * @private
 * @const
 * @type Array.<number>
 * the lengths of each month 
 */
ilib.Cal.Islamic.monthLengths = [
	30,  /* Muharram */
	29,  /* Saffar */
	30,  /* Rabi'I */
	29,  /* Rabi'II */
	30,  /* Jumada I */
	29,  /* Jumada II */
	30,  /* Rajab */
	29,  /* Sha'ban */
	30,  /* Ramadan */
	29,  /* Shawwal */
	30,  /* Dhu al-Qa'da */
	29   /* Dhu al-Hijja */
];


/**
 * Return the number of months in the given year. The number of months in a year varies
 * for luni-solar calendars because in some years, an extra month is needed to extend the 
 * days in a year to an entire solar year. The month is represented as a 1-based number
 * where 1=first month, 2=second month, etc.
 * 
 * @param {number} year a year for which the number of months is sought
 */
ilib.Cal.Islamic.prototype.getNumMonths = function(year) {
	return 12;
};

/**
 * Return the number of days in a particular month in a particular year. This function
 * can return a different number for a month depending on the year because of things
 * like leap years.
 *
 * @param {number} month the month for which the length is sought
 * @param {number} year the year within which that month can be found
 * @return {number} the number of days within the given month in the given year
 */
ilib.Cal.Islamic.prototype.getMonLength = function(month, year) {
	if (month !== 12) {
		return ilib.Cal.Islamic.monthLengths[month-1];
	} else {
		return this.isLeapYear(year) ? 30 : 29;
	}
};

/**
 * Return true if the given year is a leap year in the Islamic calendar.
 * The year parameter may be given as a number, or as a IslamicDate object.
 * @param {number} year the year for which the leap year information is being sought
 * @return {boolean} true if the given year is a leap year
 */
ilib.Cal.Islamic.prototype.isLeapYear = function(year) {
	return (ilib.mod((14 + 11 * year), 30) < 11);
};

/**
 * Return the type of this calendar.
 * 
 * @return {string} the name of the type of this calendar 
 */
ilib.Cal.Islamic.prototype.getType = function() {
	return this.type;
};

/**
 * Return a date instance for this calendar type using the given
 * options.
 * @param {Object} options options controlling the construction of 
 * the date instance
 * @return {ilib.Date} a date appropriate for this calendar type
 */
ilib.Cal.Islamic.prototype.newDateInstance = function (options) {
	return new ilib.Date.IslamicDate(options);
};

/*register this calendar for the factory method */
ilib.Cal._constructors["islamic"] = ilib.Cal.Islamic;

/*
 * islamicdate.js - Represent a date in the Islamic calendar
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends date.js calendar/islamic.js util/utils.js */

/**
 * @class
 * 
 * Construct a new civil Islamic date object. The constructor can be called
 * with a params object that can contain the following properties:<p>
 * 
 * <ul>
 * <li><i>julianday</i> - the Julian Day to set into this date
 * <li><i>year</i> - any integer except 0. Years go from -1 (BCE) to 1 (CE), skipping the zero year
 * <li><i>month</i> - 1 to 12, where 1 means Muharram, 2 means Saffar, etc.
 * <li><i>day</i> - 1 to 30
 * <li><i>hour</i> - 0 to 23. A formatter is used to display 12 hour clocks, but this representation 
 * is always done with an unambiguous 24 hour representation
 * <li><i>minute</i> - 0 to 59
 * <li><i>second</i> - 0 to 59
 * <li><i>millisecond</i> - 0 to 999
 * <li><i>locale</i> - the ilib.TimeZone instance or time zone name as a string 
 * of this julian date. The date/time is kept in the local time. The time zone
 * is used later if this date is formatted according to a different time zone and
 * the difference has to be calculated, or when the date format has a time zone
 * component in it.
 * <li><i>timezone</i> - the time zone of this instance. If the time zone is not 
 * given, it can be inferred from this locale. For locales that span multiple
 * time zones, the one with the largest population is chosen as the one that 
 * represents the locale. 
 * </ul>
 * 
 * If called with another Islamic date argument, the date components of the given
 * date are copied into the current one.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above 
 * from <i>julianday</i> through <i>millisecond</i> are present, then the date 
 * components are 
 * filled in with the current date at the time of instantiation. Note that if
 * you do not give the time zone when defaulting to the current time and the 
 * time zone for all of ilib was not set with <i>ilib.setTimeZone()</i>, then the
 * time zone will default to UTC ("Universal Time, Coordinated" or "Greenwich 
 * Mean Time").<p>
 * 
 * Depends directive: !depends islamicdate.js
 * 
 * @constructor
 * @extends ilib.Date
 * @param {Object=} params parameters that govern the settings and behaviour of this Islamic date
 */
ilib.Date.IslamicDate = function(params) {
	this.cal = new ilib.Cal.Islamic();
	
	if (params) {
		if (params.timezone) {
			this.timezone = params.timezone;
		}
		if (params.locale) {
			this.locale = (typeof(params.locale) === 'string') ? new ilib.Locale(params.locale) : params.locale;
			if (!this.timezone) {
				var li = new ilib.LocaleInfo(this.locale);
				this.timezone = li.getTimeZone(); 
			}
		}

		if (typeof(params.unixtime) != 'undefined') {
			this.setTime(parseInt(params.unixtime, 10));
		} else if (typeof(params.julianday) != 'undefined') {
			this.setJulianDay(parseFloat(params.julianday));
		} else if (params.year || params.month || params.day || params.hour ||
				params.minute || params.second || params.millisecond ) {
			/**
			 * Year in the Islamic calendar.
			 * @type number
			 */
			this.year = parseInt(params.year, 10) || 0;

			/**
			 * The month number, ranging from 1 to 12 (December).
			 * @type number
			 */
			this.month = parseInt(params.month, 10) || 1;

			/**
			 * The day of the month. This ranges from 1 to 30.
			 * @type number
			 */
			this.day = parseInt(params.day, 10) || 1;
			
			/**
			 * The hour of the day. This can be a number from 0 to 23, as times are
			 * stored unambiguously in the 24-hour clock.
			 * @type number
			 */
			this.hour = parseInt(params.hour, 10) || 0;

			/**
			 * The minute of the hours. Ranges from 0 to 59.
			 * @type number
			 */
			this.minute = parseInt(params.minute, 10) || 0;

			/**
			 * The second of the minute. Ranges from 0 to 59.
			 * @type number
			 */
			this.second = parseInt(params.second, 10) || 0;

			/**
			 * The millisecond of the second. Ranges from 0 to 999.
			 * @type number
			 */
			this.millisecond = parseInt(params.millisecond, 10) || 0;
			
			/**
			 * The day of the year. Ranges from 1 to 355.
			 * @type number
			 */
			this.dayOfYear = parseInt(params.dayOfYear, 10);
		} else if (typeof(params.rd) != 'undefined') {
			// private parameter. Do not document this!
			this.setRd(params.rd);
		} else {
			// Date.getTime() gets unix time in UTC
			var now = new Date();
			this.setTime(now.getTime() - now.getTimezoneOffset()*60000);
		}
	} else {
		// Date.getTime() gets unix time in UTC
		var now = new Date();
		this.setTime(now.getTime() - now.getTimezoneOffset()*60000);
	}
};

ilib.Date.IslamicDate.prototype = new ilib.Date();
ilib.Date.IslamicDate.prototype.parent = ilib.Date;
ilib.Date.IslamicDate.prototype.constructor = ilib.Date.IslamicDate;

/**
 * @private
 * @const
 * @type Array.<number>
 * the cumulative lengths of each month, for a non-leap year 
 */
ilib.Date.IslamicDate.cumMonthLengths = [
	0,  /* Muharram */
	30,  /* Saffar */
	59,  /* Rabi'I */
	89,  /* Rabi'II */
	118,  /* Jumada I */
	148,  /* Jumada II */
	177,  /* Rajab */
	207,  /* Sha'ban */
	236,  /* Ramadan */
	266,  /* Shawwal */
	295,  /* Dhu al-Qa'da */
	325,  /* Dhu al-Hijja */
	354
];

/**
 * @private
 * @const
 * @type Array.<number>
 * the cumulative lengths of each month, for a leap year 
 */
ilib.Date.IslamicDate.cumMonthLengthsLeap = [
	0,  /* Muharram */
	30,  /* Saffar */
	59,  /* Rabi'I */
	89,  /* Rabi'II */
	118,  /* Jumada I */
	148,  /* Jumada II */
	177,  /* Rajab */
	207,  /* Sha'ban */
	236,  /* Ramadan */
	266,  /* Shawwal */
	295,  /* Dhu al-Qa'da */
	325,  /* Dhu al-Hijja */
	355
];

/**
 * @private
 * @const
 * @type number
 * Number of days difference between RD 0 of the Gregorian calendar and
 * RD 0 of the Islamic calendar. 
 */
ilib.Date.IslamicDate.GregorianDiff = 227015;

/**
 * @private
 * @const
 * @type number
 * The difference between a zero Julian day and the first Islamic date
 * of Friday, July 16, 622 CE Julian. 
 */
ilib.Date.IslamicDate.epoch = 1948439.5;

/**
 * @private
 * Return the Rata Die (fixed day) number of the given date.
 * 
 * @param {Object} date islamic date to calculate
 * @return {number} the rd date as a number
 */
ilib.Date.IslamicDate.prototype.calcRataDie = function(date) {
	var days = (date.year - 1) * 354 +
		Math.ceil(29.5 * (date.month - 1)) +
		date.day +
		Math.floor((3 + 11 * date.year) / 30) - 1;
	var time = (date.hour * 3600000 +
		date.minute * 60000 +
		date.second * 1000 +
		date.millisecond) / 
		86400000; 
	
	//console.log("getRataDie: converting " +  JSON.stringify(date));
	//console.log("getRataDie: days is " +  days);
	//console.log("getRataDie: time is " +  time);
	//console.log("getRataDie: rd is " +  (days + time));
	
	return days + time;
};

/**
 * @private
 * Return the Rata Die (fixed day) number of this date.
 * 
 * @return {number} the rd date as a number
 */
ilib.Date.IslamicDate.prototype.getRataDie = function() {
	return this.calcRataDie(this);
};

/**
 * @private
 * Calculate date components for the given RD date.
 * @return {Object.<{year:number,month:number,day:number,hour:number,minute:number,second:number,millisecond:number}>} object containing the fields
 */
ilib.Date.IslamicDate.prototype.calcComponents = function (rd) {
	var ret = {},
		remainder,
		m;
	
	ret.year = Math.floor((30 * rd + 10646) / 10631);
	
	//console.log("IslamicDate.calcComponent: calculating for rd " + rd);
	//console.log("IslamicDate.calcComponent: year is " + ret.year);
	remainder = rd - this.calcRataDie({
		year: ret.year,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	}) + 1;
	
	ret.dayOfYear = remainder;
	
	//console.log("IslamicDate.calcComponent: remainder is " + remainder);
	
	ret.month = ilib.bsearch(remainder, ilib.Date.IslamicDate.cumMonthLengths);
	remainder -= ilib.Date.IslamicDate.cumMonthLengths[ret.month-1];

	//console.log("IslamicDate.calcComponent: month is " + ret.month + " and remainder is " + remainder);
	
	ret.day = Math.floor(remainder);
	remainder -= ret.day;

	//console.log("IslamicDate.calcComponent: day is " + ret.day + " and remainder is " + remainder);

	// now convert to milliseconds for the rest of the calculation
	remainder = Math.round(remainder * 86400000);
	
	ret.hour = Math.floor(remainder/3600000);
	remainder -= ret.hour * 3600000;
	
	ret.minute = Math.floor(remainder/60000);
	remainder -= ret.minute * 60000;
	
	ret.second = Math.floor(remainder/1000);
	remainder -= ret.second * 1000;
	
	ret.millisecond = remainder;
	
	return ret;
};

/**
 * @private
 * Set the date components of this instance based on the given rd.
 * @param {number} rd the rata die date to set
 */
ilib.Date.IslamicDate.prototype.setRd = function (rd) {
	var fields = this.calcComponents(rd);
	
	this.year = fields.year;
	this.month = fields.month;
	this.day = fields.day;
	this.hour = fields.hour;
	this.minute = fields.minute;
	this.second = fields.second;
	this.millisecond = fields.millisecond;
};

/**
 * Set the date of this instance using a Julian Day.
 * @param {number} date the Julian Day to use to set this date
 */
ilib.Date.IslamicDate.prototype.setJulianDay = function (date) {
	var jd = (typeof(date) === 'number') ? new ilib.JulianDay(date) : date,
		rd;	// rata die -- # of days since the beginning of the calendar
	
	rd = jd.getDate() - ilib.Date.IslamicDate.epoch; 	// Julian Days start at noon
	this.setRd(rd);
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 * 
 * @return {number} the day of the week
 */
ilib.Date.IslamicDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.getRataDie());
	return ilib.mod(rd-2, 7);
};


/**
 * @private
 * Return the rd of the particular day of the week on or before the given rd.
 * eg. The Sunday on or before the given rd.
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the reference date
 */
ilib.Date.IslamicDate.prototype.onOrBeforeRd = function(rd, dayOfWeek) {
	return rd - ilib.mod(Math.floor(rd) - dayOfWeek - 2, 7);
};

/**
 * @private
 * Return the rd of the particular day of the week on or before the given rd.
 * eg. The Sunday on or before the given rd.
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the reference date
 */
ilib.Date.IslamicDate.prototype.onOrAfterRd = function(rd, dayOfWeek) {
	return this.onOrBeforeRd(rd+6, dayOfWeek);
};

/**
 * @private
 * Return the rd of the particular day of the week before the given rd.
 * eg. The Sunday before the given rd.
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the reference date
 */
ilib.Date.IslamicDate.prototype.beforeRd = function(rd, dayOfWeek) {
	return this.onOrBeforeRd(rd-1, dayOfWeek);
};

/**
 * @private
 * Return the rd of the particular day of the week after the given rd.
 * eg. The Sunday after the given rd.
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the reference date
 */
ilib.Date.IslamicDate.prototype.afterRd = function(rd, dayOfWeek) {
	return this.onOrBeforeRd(rd+7, dayOfWeek);
};

/**
 * @private
 * Return the rd of the first Sunday of the given ISO year.
 * @return the rd of the first Sunday of the ISO year
 */
ilib.Date.IslamicDate.prototype.firstSunday = function (year) {
	var jan1 = this.calcRataDie({
		year: year,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	});
	var firstThu = this.onOrAfterRd(jan1, 4);
	return this.beforeRd(firstThu, 0);
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week before the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week before the current date that is being sought
 * @returns {ilib.Date.IslamicDate} the date being sought
 */
ilib.Date.IslamicDate.prototype.before = function (dow) {
	return new ilib.Date.IslamicDate({rd: this.beforeRd(this.getRataDie(), dow)});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week after the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week after the current date that is being sought
 * @returns {ilib.Date.IslamicDate} the date being sought
 */
ilib.Date.IslamicDate.prototype.after = function (dow) {
	return new ilib.Date.IslamicDate({rd: this.afterRd(this.getRataDie(), dow)});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week on or before the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week on or before the current date that is being sought
 * @returns {ilib.Date.IslamicDate} the date being sought
 */
ilib.Date.IslamicDate.prototype.onOrBefore = function (dow) {
	return new ilib.Date.IslamicDate({rd: this.onOrBeforeRd(this.getRataDie(), dow)});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week on or after the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week on or after the current date that is being sought
 * @returns {ilib.Date.IslamicDate} the date being sought
 */
ilib.Date.IslamicDate.prototype.onOrAfter = function (dow) {
	return new ilib.Date.IslamicDate({rd: this.onOrAfterRd(this.getRataDie(), dow)});
};

/**
 * Return the week number in the current year for the current date. This is calculated
 * similar to the ISO 8601 for a Gregorian calendar, but is not an ISO week number. 
 * The week number ranges from 1 to 51.
 * 
 * @return {number} the week number for the current date
 */
ilib.Date.IslamicDate.prototype.getWeekOfYear = function() {
	var rd = Math.floor(this.getRataDie()),
		yearStart = this.firstSunday(this.year),
		nextYear;
	
	// if we have a Muh date, it may be in this year or the previous year
	if (rd < yearStart) {
		yearStart = this.firstSunday(this.year-1);
	} else if (this.month == 12 && this.day > 25) {
		// if we have a late Dhu al'Hijja date, it may be in this year, or the next year
		nextYear = this.firstSunday(this.year+1);
		if (rd >= nextYear) {
			yearStart = nextYear;
		}
	}
	
	return Math.floor((rd-yearStart)/7) + 1;
};

/**
 * Return the ordinal day of the year. Days are counted from 1 and proceed linearly up to 
 * 354 or 355, regardless of months or weeks, etc. That is, Muharran 1st is day 1, and 
 * Dhu al-Hijja 29 is 354.
 * @return {number} the ordinal day of the year
 */
ilib.Date.IslamicDate.prototype.getDayOfYear = function() {
	return ilib.Date.IslamicDate.cumMonthLengths[this.month-1] + this.day;
};

/**
 * Return the ordinal number of the week within the month. The first week of a month is
 * the first one that contains 4 or more days in that month. If any days precede this
 * first week, they are marked as being in week 0. This function returns values from 0
 * through 6.<p>
 * 
 * The locale is a required parameter because different locales that use the same 
 * Islamic calendar consider different days of the week to be the beginning of
 * the week. This can affect the week of the month in which some days are located.
 * 
 * @param {ilib.Locale|string} locale the locale or locale spec to use when figuring out 
 * the first day of the week
 * @return {number} the ordinal number of the week within the current month
 */
ilib.Date.IslamicDate.prototype.getWeekOfMonth = function(locale) {
	var li = new ilib.LocaleInfo(locale),
		first = this.calcRataDie({
			year: this.year,
			month: this.month,
			day: 1,
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0
		}),
		rd = this.getRataDie(),
		weekStart = this.onOrAfterRd(first, li.getFirstDayOfWeek());
	if (weekStart - first > 3) {
		// if the first week has 4 or more days in it of the current month, then consider
		// that week 1. Otherwise, it is week 0. To make it week 1, move the week start
		// one week earlier.
		weekStart -= 7;
	}
	return Math.floor((rd - weekStart) / 7) + 1;
};

/**
 * Return the era for this date as a number. The value for the era for Islamic 
 * calendars is -1 for "before the Islamic era" and 1 for "the Islamic era". 
 * Islamic era dates are any date after Muharran 1, 1, which is the same as
 * July 16, 622 CE in the Gregorian calendar. 
 * 
 * @return {number} 1 if this date is in the common era, -1 if it is before the 
 * common era 
 */
ilib.Date.IslamicDate.prototype.getEra = function() {
	return (this.year < 1) ? -1 : 1;
};

/**
 * Return the unix time equivalent to this Islamic date instance. Unix time is
 * the number of milliseconds since midnight on Jan 1, 1970 Gregorian. This method only
 * returns a valid number for dates between midnight, Jan 1, 1970 and  
 * Jan 19, 2038 at 3:14:07am when the unix time runs out. If this instance 
 * encodes a date outside of that range, this method will return -1.
 * 
 * @return {number} a number giving the unix time, or -1 if the date is outside the
 * valid unix time range
 */
ilib.Date.IslamicDate.prototype.getTime = function() {
	var rd = this.calcRataDie({
		year: this.year,
		month: this.month,
		day: this.day,
		hour: this.hour,
		minute: this.minute,
		second: this.second,
		millisecond: 0
	});
	var unix;

	// earlier than Jan 1, 1970
	// or later than Jan 19, 2038 at 3:14:07am
	if (rd < 492148 || rd > 517003.134803241) { 
		return -1;
	}

	// avoid the rounding errors in the floating point math by only using
	// the whole days from the rd, and then calculating the milliseconds directly
	var seconds = Math.floor(rd - 492148) * 86400 + 
		this.hour * 3600 +
		this.minute * 60 +
		this.second;
	var millis = seconds * 1000 + this.millisecond;
	
	return millis;
};

/**
 * Set the time of this instance according to the given unix time. Unix time is
 * the number of milliseconds since midnight on Jan 1, 1970.
 * 
 * @param {number} millis the unix time to set this date to in milliseconds 
 */
ilib.Date.IslamicDate.prototype.setTime = function(millis) {
	var rd = 492148 + millis / 86400000;
	this.setRd(rd);
};

/**
 * Return a Javascript Date object that is equivalent to this Islamic date
 * object.
 * 
 * @return {Date|undefined} a javascript Date object
 */
ilib.Date.IslamicDate.prototype.getJSDate = function() {
	var unix = this.getTime();
	return (unix === -1) ? undefined : new Date(unix); 
};

/**
 * Return the Julian Day equivalent to this calendar date as a number.
 * 
 * @return {number} the julian date equivalent of this date
 */
ilib.Date.IslamicDate.prototype.getJulianDay = function() {
	return this.getRataDie() + ilib.Date.IslamicDate.epoch;
};

/**
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
ilib.Date.IslamicDate.prototype.getCalendar = function() {
	return "islamic";
};

/**
 * Return the time zone associated with this Islamic date, or 
 * undefined if none was specified in the constructor.
 * 
 * @return {string|undefined} the name of the time zone for this date instance
 */
ilib.Date.IslamicDate.prototype.getTimeZone = function() {
	return this.timezone;
};


/**
 * Set the time zone associated with this Islamic date.
 * @param {string} tzName the name of the time zone to set into this date instance,
 * or "undefined" to unset the time zone 
 */
ilib.Date.IslamicDate.prototype.setTimeZone = function (tzName) {
	if (!tzName || tzName === "") {
		// same as undefining it
		this.timezone = undefined;
	} else if (typeof(tzName) === 'string') {
		this.timezone = tzName;
	}
};

//register with the factory method
ilib.Date._constructors["islamic"] = ilib.Date.IslamicDate;
/*
 * julian.js - Represent a Julian calendar object.
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/* !depends calendar.js locale.js date.js julianday.js util/utils.js */

/**
 * @class
 * Construct a new Julian calendar object. This class encodes information about
 * a Julian calendar.<p>
 * 
 * Depends directive: !depends julian.js
 * 
 * @constructor
 * @implements ilib.Cal
 */
ilib.Cal.Julian = function() {
	this.type = "julian";
};

/* the lengths of each month */
ilib.Cal.Julian.monthLengths = [
	31,  /* Jan */
	28,  /* Feb */
	31,  /* Mar */
	30,  /* Apr */
	31,  /* May */
	30,  /* Jun */
	31,  /* Jul */
	31,  /* Aug */
	30,  /* Sep */
	31,  /* Oct */
	30,  /* Nov */
	31   /* Dec */
];

/**
 * Return the number of months in the given year. The number of months in a year varies
 * for lunar calendars because in some years, an extra month is needed to extend the 
 * days in a year to an entire solar year. The month is represented as a 1-based number
 * where 1=Jaunary, 2=February, etc. until 12=December.
 * 
 * @param {number} year a year for which the number of months is sought
 */
ilib.Cal.Julian.prototype.getNumMonths = function(year) {
	return 12;
};

/**
 * Return the number of days in a particular month in a particular year. This function
 * can return a different number for a month depending on the year because of things
 * like leap years.
 * 
 * @param {number} month the month for which the length is sought
 * @param {number} year the year within which that month can be found
 * @return {number} the number of days within the given month in the given year
 */
ilib.Cal.Julian.prototype.getMonLength = function(month, year) {
	if (month !== 2 || !this.isLeapYear(year)) {
		return ilib.Cal.Julian.monthLengths[month-1];
	} else {
		return 29;
	}
};

/**
 * Return true if the given year is a leap year in the Julian calendar.
 * The year parameter may be given as a number, or as a JulDate object.
 * @param {number|ilib.Date.JulDate} year the year for which the leap year information is being sought
 * @return {boolean} true if the given year is a leap year
 */
ilib.Cal.Julian.prototype.isLeapYear = function(year) {
	var y = (typeof(year) === 'number' ? year : year.year);
	return ilib.mod(y, 4) === ((year > 0) ? 0 : 3);
};

/**
 * Return the type of this calendar.
 * 
 * @return {string} the name of the type of this calendar 
 */
ilib.Cal.Julian.prototype.getType = function() {
	return this.type;
};

/**
 * Return a date instance for this calendar type using the given
 * options.
 * @param {Object} options options controlling the construction of 
 * the date instance
 * @return {ilib.Date} a date appropriate for this calendar type
 */
ilib.Cal.Julian.prototype.newDateInstance = function (options) {
	return new ilib.Date.JulDate(options);
};

/* register this calendar for the factory method */
ilib.Cal._constructors["julian"] = ilib.Cal.Julian;
/*
 * juliandate.js - Represent a date in the Julian calendar
 * 
 * Copyright © 2012-2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends date.js calendar/julian.js util/utils.js localeinfo.js julianday.js */

/**
 * @class
 * 
 * Construct a new date object for the Julian Calendar. The constructor can be called
 * with a parameter object that contains any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970 (Gregorian).
 * <li><i>julianday</i> - the Julian Day to set into this date
 * <li><i>year</i> - any integer except 0. Years go from -1 (BCE) to 1 (CE), skipping the zero 
 * year which doesn't exist in the Julian calendar
 * <li><i>month</i> - 1 to 12, where 1 means January, 2 means February, etc.
 * <li><i>day</i> - 1 to 31
 * <li><i>hour</i> - 0 to 23. A formatter is used to display 12 hour clocks, but this representation 
 * is always done with an unambiguous 24 hour representation
 * <li><i>minute</i> - 0 to 59
 * <li><i>second</i> - 0 to 59
 * <li><i>millisecond<i> - 0 to 999
 * <li><i>locale</i> - the ilib.TimeZone instance or time zone name as a string 
 * of this julian date. The date/time is kept in the local time. The time zone
 * is used later if this date is formatted according to a different time zone and
 * the difference has to be calculated, or when the date format has a time zone
 * component in it.
 * <li><i>timezone</i> - the time zone of this instance. If the time zone is not 
 * given, it can be inferred from this locale. For locales that span multiple
 * time zones, the one with the largest population is chosen as the one that 
 * represents the locale. 
 * </ul>
 * 
 * NB. The <a href="http://en.wikipedia.org/wiki/Julian_date">Julian Day</a> 
 * (ilib.JulianDay) object is a <i>different</i> object than a 
 * <a href="http://en.wikipedia.org/wiki/Julian_calendar">date in
 * the Julian calendar</a> and the two are not to be confused. The Julian Day 
 * object represents time as a number of whole and fractional days since the 
 * beginning of the epoch, whereas a date in the Julian 
 * calendar is a regular date that signifies year, month, day, etc. using the rules
 * of the Julian calendar. The naming of Julian Days and the Julian calendar are
 * unfortunately close, and come from history.<p>
 *  
 * If called with another Julian date argument, the date components of the given
 * date are copied into the current one.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above 
 * from <i>unixtime</i> through <i>millisecond</i> are present, then the date 
 * components are 
 * filled in with the current date at the time of instantiation. Note that if
 * you do not give the time zone when defaulting to the current time and the 
 * time zone for all of ilib was not set with <i>ilib.setTimeZone()</i>, then the
 * time zone will default to UTC ("Universal Time, Coordinated" or "Greenwich 
 * Mean Time").<p>
 * 
 * Depends directive: !depends juliandate.js
 * 
 * @constructor
 * @extends ilib.Date
 * @param {Object=} params parameters that govern the settings and behaviour of this Julian date
 */
ilib.Date.JulDate = function(params) {
	this.cal = new ilib.Cal.Julian();
	
	if (params) {
		if (params.timezone) {
			this.timezone = params.timezone;
		}
		if (params.locale) {
			this.locale = (typeof(params.locale) === 'string') ? new ilib.Locale(params.locale) : params.locale;
			if (!this.timezone) {
				var li = new ilib.LocaleInfo(this.locale);
				this.timezone = li.getTimeZone(); 
			}
		}

		if (typeof(params.unixtime) != 'undefined') {
			this.setTime(parseInt(params.unixtime, 10));
		} else if (typeof(params.julianday) != 'undefined') {
			this.setJulianDay(parseFloat(params.julianday));
		} else if (params.year || params.month || params.day || params.hour ||
				params.minute || params.second || params.millisecond ) {
			/**
			 * Year in the Julian calendar.
			 * @type number
			 */
			this.year = parseInt(params.year, 10) || 0;
			/**
			 * The month number, ranging from 1 (January) to 12 (December).
			 * @type number
			 */
			this.month = parseInt(params.month, 10) || 1;
			/**
			 * The day of the month. This ranges from 1 to 31.
			 * @type number
			 */
			this.day = parseInt(params.day, 10) || 1;
			/**
			 * The hour of the day. This can be a number from 0 to 23, as times are
			 * stored unambiguously in the 24-hour clock.
			 * @type number
			 */
			this.hour = parseInt(params.hour, 10) || 0;
			/**
			 * The minute of the hours. Ranges from 0 to 59.
			 * @type number
			 */
			this.minute = parseInt(params.minute, 10) || 0;
			/**
			 * The second of the minute. Ranges from 0 to 59.
			 * @type number
			 */
			this.second = parseInt(params.second, 10) || 0;
			/**
			 * The millisecond of the second. Ranges from 0 to 999.
			 * @type number
			 */
			this.millisecond = parseInt(params.millisecond, 10) || 0;
		} else if (typeof(params.rd) != 'undefined') {
			// private parameter. Do not document this!
			this.setRd(params.rd);
		} else {
			// Date.getTime() gets unix time in UTC
			var now = new Date();
			this.setTime(now.getTime() - now.getTimezoneOffset()*60000);
		}
	} else {
		// Date.getTime() gets unix time in UTC
		var now = new Date();
		this.setTime(now.getTime() - now.getTimezoneOffset()*60000);
	}
};

ilib.Date.JulDate.prototype = new ilib.Date();
ilib.Date.JulDate.prototype.parent = ilib.Date;
ilib.Date.JulDate.prototype.constructor = ilib.Date.JulDate;

/**
 * @private
 * @const
 * @type Array.<number>
 * the cumulative lengths of each month, for a non-leap year 
 */
ilib.Date.JulDate.cumMonthLengths = [
    0,   /* Jan */
	31,  /* Feb */
	59,  /* Mar */
	90,  /* Apr */
	120, /* May */
	151, /* Jun */
	181, /* Jul */
	212, /* Aug */
	243, /* Sep */
	273, /* Oct */
	304, /* Nov */
	334, /* Dec */
	365
];

/**
 * @private
 * @const
 * @type Array.<number>
 * the cumulative lengths of each month, for a leap year 
 */
ilib.Date.JulDate.cumMonthLengthsLeap = [
	0,   /* Jan */
	31,  /* Feb */
	60,  /* Mar */
	91,  /* Apr */
	121, /* May */
	152, /* Jun */
	182, /* Jul */
	213, /* Aug */
	244, /* Sep */
	274, /* Oct */
	305, /* Nov */
	335, /* Dec */
	366
];

/**
 * @private
 * @const
 * @type number
 * the difference between a zero Julian day and the first Julian date. */
ilib.Date.JulDate.epoch = 1721422.5;

/**
 * @private
 * Return the Rata Die (fixed day) number for the given date.
 * @param {Object} parts the parts to calculate with
 * @return {number} the rd date as a number
 */
ilib.Date.JulDate.prototype.calcRataDie = function(parts) {
	var year = parts.year + ((parts.year < 0) ? 1 : 0);
	var years = 365 * (year - 1) + Math.floor((year-1)/4);
	var dayInYear = (parts.month > 1 ? ilib.Date.JulDate.cumMonthLengths[parts.month-1] : 0) +
	parts.day +
		(this.cal.isLeapYear(parts.year) && parts.month > 2 ? 1 : 0);
	var rdtime = (parts.hour * 3600000 +
		parts.minute * 60000 +
		parts.second * 1000 +
		parts.millisecond) / 
		86400000;
	// the arithmetic is not more accurage than this, so just round it to make nice numbers
	rdtime = Math.round(rdtime*10000000)/10000000; 
	
	/*
	console.log("calcRataDie: converting " +  JSON.stringify(parts));
	console.log("getRataDie: year is " +  years);
	console.log("getRataDie: day in year is " +  dayInYear);
	console.log("getRataDie: rdtime is " +  rdtime);
	console.log("getRataDie: rd is " +  (years + dayInYear + rdtime));
	*/
	
	return years + dayInYear + rdtime;
};

/**
 * @private
 * Return the Rata Die (fixed day) number of this date.
 * 
 * @return {number} the rd date as a number
 */
ilib.Date.JulDate.prototype.getRataDie = function() {
	return this.calcRataDie(this);
};

/**
 * @private
 * Calculate date components for the given RD date.
 * @param {number} rd the RD date to calculate components for
 * @return {Object} object containing the component fields
 */
ilib.Date.JulDate.prototype.calcComponents = function (rd) {
	var year,
		remainder,
		cumulative,
		ret = {};
	
	year = Math.floor((4*(Math.floor(rd)-1) + 1464)/1461);
	
	ret.year = (year <= 0) ? year - 1 : year;
	
	remainder = rd + 1 - this.calcRataDie({
		year: ret.year,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	});
	
	cumulative = this.cal.isLeapYear(ret.year) ? 
		ilib.Date.JulDate.cumMonthLengthsLeap : 
		ilib.Date.JulDate.cumMonthLengths; 
	
	ret.month = ilib.bsearch(Math.floor(remainder), cumulative);
	remainder = remainder - cumulative[ret.month-1];
	
	ret.day = Math.floor(remainder);
	remainder -= ret.day;
	// now convert to milliseconds for the rest of the calculation
	remainder = Math.round(remainder * 86400000);
	
	ret.hour = Math.floor(remainder/3600000);
	remainder -= ret.hour * 3600000;
	
	ret.minute = Math.floor(remainder/60000);
	remainder -= ret.minute * 60000;
	
	ret.second = Math.floor(remainder/1000);
	remainder -= ret.second * 1000;
	
	ret.millisecond = remainder;
	
	return ret;
};

/**
 * @private
 * Set the date components of this instance based on the given rd.
 * @param {number} rd the rata die date to set
 */
ilib.Date.JulDate.prototype.setRd = function (rd) {
	var fields = this.calcComponents(rd);
	
	this.year = fields.year;
	this.month = fields.month;
	this.day = fields.day;
	this.hour = fields.hour;
	this.minute = fields.minute;
	this.second = fields.second;
	this.millisecond = fields.millisecond;
};

/**
 * Set the date of this instance using a Julian Day.
 * @param {number} date the Julian Day to use to set this date
 */
ilib.Date.JulDate.prototype.setJulianDay = function (date) {
	var jd = (typeof(date) === 'number') ? new ilib.JulianDay(date) : date,
		rd;	// rata die -- # of days since the beginning of the calendar
	
	rd = jd.getDate() - ilib.Date.JulDate.epoch; 	// Julian Days start at noon
	this.setRd(rd);
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 * 
 * @return {number} the day of the week
 */
ilib.Date.JulDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.getRataDie());
	return ilib.mod(rd-2, 7);
};

/**
 * @private
 * Return the rd of the particular day of the week on or before the given rd.
 * eg. The Sunday on or before the given rd.
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the reference date
 * @return {number} the day of the week
 */
ilib.Date.JulDate.prototype.onOrBeforeRd = function(rd, dayOfWeek) {
	return rd - ilib.mod(Math.floor(rd) - dayOfWeek - 2, 7);
};

/**
 * @private
 * Return the rd of the particular day of the week on or before the given rd.
 * eg. The Sunday on or before the given rd.
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the reference date
 * @return {number} the day of the week
 */
ilib.Date.JulDate.prototype.onOrAfterRd = function(rd, dayOfWeek) {
	return this.onOrBeforeRd(rd+6, dayOfWeek);
};

/**
 * @private
 * Return the rd of the particular day of the week before the given rd.
 * eg. The Sunday before the given rd.
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the reference date
 * @return {number} the day of the week
 */
ilib.Date.JulDate.prototype.beforeRd = function(rd, dayOfWeek) {
	return this.onOrBeforeRd(rd-1, dayOfWeek);
};

/**
 * @private
 * Return the rd of the particular day of the week after the given rd.
 * eg. The Sunday after the given rd.
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the reference date
 * @return {number} the day of the week
 */
ilib.Date.JulDate.prototype.afterRd = function(rd, dayOfWeek) {
	return this.onOrBeforeRd(rd+7, dayOfWeek);
};

/**
 * @private
 * Return the rd of the first Sunday of the given ISO year.
 * @param {number} year the year for which the first Sunday is being sought
 * @return the rd of the first Sunday of the ISO year
 */
ilib.Date.JulDate.prototype.firstSunday = function (year) {
	var jan1 = this.calcRataDie({
		year: year,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	});
	var firstThu = this.onOrAfterRd(jan1, 4);
	return this.beforeRd(firstThu, 0);
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week before the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week before the current date that is being sought
 * @return {ilib.Date.JulDate} the date being sought
 */
ilib.Date.JulDate.prototype.before = function (dow) {
	return new ilib.Date.JulDate({rd: this.beforeRd(this.getRataDie(), dow)});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week after the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week after the current date that is being sought
 * @return {ilib.Date.JulDate} the date being sought
 */
ilib.Date.JulDate.prototype.after = function (dow) {
	return new ilib.Date.JulDate({rd: this.afterRd(this.getRataDie(), dow)});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week on or before the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week on or before the current date that is being sought
 * @return {ilib.Date.JulDate} the date being sought
 */
ilib.Date.JulDate.prototype.onOrBefore = function (dow) {
	return new ilib.Date.JulDate({rd: this.onOrBeforeRd(this.getRataDie(), dow)});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week on or after the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week on or after the current date that is being sought
 * @return {ilib.Date.JulDate} the date being sought
 */
ilib.Date.JulDate.prototype.onOrAfter = function (dow) {
	return new ilib.Date.JulDate({rd: this.onOrAfterRd(this.getRataDie(), dow)});
};

/**
 * Return the unix time equivalent to this Julian date instance. Unix time is
 * the number of milliseconds since midnight on Jan 1, 1970. This method only
 * returns a valid number for dates between midnight, Jan 1, 1970 and  
 * Jan 19, 2038 at 3:14:07am when the unix time runs out. If this instance 
 * encodes a date outside of that range, this method will return -1.
 * 
 * @return {number} a number giving the unix time, or -1 if the date is outside the
 * valid unix time range
 */
ilib.Date.JulDate.prototype.getTime = function() {
	var rd = this.calcRataDie({
		year: this.year,
		month: this.month,
		day: this.day,
		hour: this.hour,
		minute: this.minute,
		second: this.second,
		millisecond: 0
	});
	var unix;

	// earlier than Jan 1, 1970
	// or later than Jan 19, 2038 at 3:14:07am
	if (rd < 719165 || rd > 744020.134803241) { 
		return -1;
	}

	// avoid the rounding errors in the floating point math by only using
	// the whole days from the rd, and then calculating the milliseconds directly
	var seconds = Math.floor(rd - 719165) * 86400 + 
		this.hour * 3600 +
		this.minute * 60 +
		this.second;
	var millis = seconds * 1000 + this.millisecond;
	
	return millis;
};

/**
 * Set the time of this instance according to the given unix time. Unix time is
 * the number of milliseconds since midnight on Jan 1, 1970.
 * 
 * @param {number} millis the unix time to set this date to in milliseconds 
 */
ilib.Date.JulDate.prototype.setTime = function(millis) {
	var rd = 719165 + millis / 86400000;
	this.setRd(rd);
};

/**
 * Return a Javascript Date object that is equivalent to this Julian date
 * object. If the julian date object represents a date that cannot be represented
 * by a Javascript Date object, the value undefined is returned
 * 
 * @return {Date|undefined} a javascript Date object, or undefined if the date is out of range
 */
ilib.Date.JulDate.prototype.getJSDate = function() {
	var unix = this.getTime();
	return (unix === -1) ? undefined : new Date(unix); 
};

/**
 * Return the Julian Day equivalent to this calendar date as a number.
 * 
 * @return {number} the julian date equivalent of this date
 */
ilib.Date.JulDate.prototype.getJulianDay = function() {
	return this.getRataDie() + ilib.Date.JulDate.epoch;
};

/**
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
ilib.Date.JulDate.prototype.getCalendar = function() {
	return "julian";
};

/**
 * Return the time zone associated with this Julian date, or 
 * undefined if none was specified in the constructor.
 * 
 * @return {string|undefined} the name of the time zone for this date instance
 */
ilib.Date.JulDate.prototype.getTimeZone = function() {
	return this.timezone;
};

/**
 * Set the time zone associated with this Julian date.
 * @param {string} tzName the name of the time zone to set into this date instance,
 * or "undefined" to unset the time zone 
 */
ilib.Date.JulDate.prototype.setTimeZone = function (tzName) {
	if (!tzName || tzName === "") {
		// same as undefining it
		this.timezone = undefined;
	} else if (typeof(tzName) === 'string') {
		this.timezone = tzName;
	}
};

//register with the factory method
ilib.Date._constructors["julian"] = ilib.Date.JulDate;
ilib.data.ctype = {
	"ideograph": [
		[4352,4607],
		[12353,12447],
		[12449,12543],
		[12549,12589],
		[12593,12686],
		[12704,12727],
		[12784,12799],
		[13312,19893],
		[19968,40907],
		[40960,42124],
		[43360,43388],
		[44032,55203],
		[55216,55291],
		[63744,64217],
		[65382,65437],
		[65440,65500]
	],
	
	"ideoother": [
		[12294,12294],
		[12348,12348],
		[12352,12352],
		[12448,12448],
		[12544,12548],
		[12590,12591],
		[12592,12592],
		[12687,12687],
		[12800,13055],
		[13056,13183],
		[13184,13311],
		[40908,40959],
		[42125,42191],
		[43389,43391],
		[55292,55295],
		[64218,64255]
	],

	"ascii": [
		[32, 127]
	],

	"digit": [ 
	    [48, 57]
	],
	
	"xdigit": [ 
	    [48, 57],
	    [65, 70],
	    [97, 102]
	],
	
	"blank": [ 
  	    [9, 9],
	    [32, 32]
	],
	
	"space": [
  		[9, 13],
		[133],
		[8232, 8233]
	],
	

    "latin": [
        [
            0,
            591
        ],
        [
            7680,
            7935
        ],
        [
            11360,
            11391
        ],
        [
            42784,
            43007
        ]
    ],
    "ipa": [
        [
            592,
            687
        ],
        [
            7424,
            7551
        ],
        [
            7552,
            7615
        ]
    ],
    "operators": [
        [
            8704,
            8959
        ],
        [
            10752,
            11007
        ]
    ],
    "greek": [
        [
            880,
            1023
        ],
        [
            7936,
            8191
        ]
    ],
    "cyrillic": [
        [
            1024,
            1327
        ],
        [
            11744,
            11775
        ],
        [
            42560,
            42655
        ]
    ],
    "arabic": [
        [
            1536,
            1791
        ],
        [
            1872,
            1919
        ],
        [
            64336,
            65023
        ],
        [
            65136,
            65279
        ]
    ],
    "devanagari": [
        [
            2304,
            2431
        ],
        [
            43232,
            43263
        ]
    ],
    "myanmar": [
        [
            4096,
            4255
        ],
        [
            43616,
            43647
        ]
    ],
    "hangul": [
        [
            4352,
            4607
        ],
        [
            44032,
            55215
        ],
        [
            43360,
            43391
        ],
        [
            55216,
            55295
        ],
        [
            12592,
            12687
        ]
    ],
    "ethiopic": [
        [
            4608,
            5023
        ],
        [
            11648,
            11743
        ],
        [
            43776,
            43823
        ]
    ],
    "canadian": [
        [
            5120,
            5759
        ],
        [
            6320,
            6399
        ]
    ],
    "combining": [
        [
            768,
            879
        ],
        [
            7616,
            7679
        ],
        [
            8400,
            8447
        ]
    ],
    "arrows": [
        [
            8592,
            8703
        ],
        [
            11008,
            11263
        ],
        [
            10224,
            10239
        ],
        [
            10496,
            10623
        ]
    ],
    "cjk": [
        [
            19968,
            40959
        ],
        [
            13312,
            19903
        ],
        [
            131072,
            173791
        ],
        [
            173824,
            177983
        ],
        [
            177984,
            178207
        ],
        [
            12272,
            12287
        ]
    ],
    "cjkcompatibility": [
        [
            13056,
            13311
        ],
        [
            63744,
            64255
        ],
        [
            65072,
            65103
        ],
        [
            194560,
            195103
        ]
    ],
    "mathematical": [
        [
            119808,
            120831
        ],
        [
            10176,
            10223
        ],
        [
            10624,
            10751
        ]
    ],
    "privateuse": [
        [
            57344,
            63743
        ],
        [
            983040,
            1048575
        ],
        [
            1048576,
            1114111
        ]
    ],
    "variations": [
        [
            65024,
            65039
        ],
        [
            917760,
            917999
        ]
    ],
    "bamum": [
        [
            42656,
            42751
        ],
        [
            92160,
            92735
        ]
    ],
    "georgian": [
        [
            4256,
            4351
        ],
        [
            11520,
            11567
        ]
    ],
    "punctuation": [
        [
            8192,
            8303
        ],
        [
            11776,
            11903
        ]
    ],
    "katakana": [
        [
            12448,
            12543
        ],
        [
            12784,
            12799
        ],
        [
            110592,
            110847
        ]
    ],
    "bopomofo": [
        [
            12544,
            12591
        ],
        [
            12704,
            12735
        ]
    ],
    "enclosedalpha": [
        [
            9312,
            9471
        ],
        [
            127232,
            127487
        ]
    ],
    "cjkradicals": [
        [
            11904,
            12031
        ],
        [
            12032,
            12255
        ]
    ],
    "yi": [
        [
            40960,
            42127
        ],
        [
            42128,
            42191
        ]
    ],
    "linearb": [
        [
            65536,
            65663
        ],
        [
            65664,
            65791
        ]
    ],
    "enclosedcjk": [
        [
            12800,
            13055
        ],
        [
            127488,
            127743
        ]
    ],
    "spacing": [
        [
            688,
            767
        ]
    ],
    "armenian": [
        [
            1328,
            1423
        ]
    ],
    "hebrew": [
        [
            1424,
            1535
        ]
    ],
    "syriac": [
        [
            1792,
            1871
        ]
    ],
    "thaana": [
        [
            1920,
            1983
        ]
    ],
    "nko": [
        [
            1984,
            2047
        ]
    ],
    "samaritan": [
        [
            2048,
            2111
        ]
    ],
    "mandaic": [
        [
            2112,
            2143
        ]
    ],
    "bengali": [
        [
            2432,
            2559
        ]
    ],
    "gurmukhi": [
        [
            2560,
            2687
        ]
    ],
    "gujarati": [
        [
            2688,
            2815
        ]
    ],
    "oriya": [
        [
            2816,
            2943
        ]
    ],
    "tamil": [
        [
            2944,
            3071
        ]
    ],
    "telugu": [
        [
            3072,
            3199
        ]
    ],
    "kannada": [
        [
            3200,
            3327
        ]
    ],
    "malayalam": [
        [
            3328,
            3455
        ]
    ],
    "sinhala": [
        [
            3456,
            3583
        ]
    ],
    "thai": [
        [
            3584,
            3711
        ]
    ],
    "lao": [
        [
            3712,
            3839
        ]
    ],
    "tibetan": [
        [
            3840,
            4095
        ]
    ],
    "cherokee": [
        [
            5024,
            5119
        ]
    ],
    "ogham": [
        [
            5760,
            5791
        ]
    ],
    "runic": [
        [
            5792,
            5887
        ]
    ],
    "tagalog": [
        [
            5888,
            5919
        ]
    ],
    "hanunoo": [
        [
            5920,
            5951
        ]
    ],
    "buhid": [
        [
            5952,
            5983
        ]
    ],
    "tagbanwa": [
        [
            5984,
            6015
        ]
    ],
    "khmer": [
        [
            6016,
            6143
        ]
    ],
    "mongolian": [
        [
            6144,
            6319
        ]
    ],
    "limbu": [
        [
            6400,
            6479
        ]
    ],
    "taile": [
        [
            6480,
            6527
        ]
    ],
    "newtailue": [
        [
            6528,
            6623
        ]
    ],
    "khmersymbols": [
        [
            6624,
            6655
        ]
    ],
    "buginese": [
        [
            6656,
            6687
        ]
    ],
    "taitham": [
        [
            6688,
            6831
        ]
    ],
    "balinese": [
        [
            6912,
            7039
        ]
    ],
    "sundanese": [
        [
            7040,
            7103
        ]
    ],
    "batak": [
        [
            7104,
            7167
        ]
    ],
    "lepcha": [
        [
            7168,
            7247
        ]
    ],
    "olchiki": [
        [
            7248,
            7295
        ]
    ],
    "vedic": [
        [
            7376,
            7423
        ]
    ],
    "supersub": [
        [
            8304,
            8351
        ]
    ],
    "currency": [
        [
            8352,
            8399
        ]
    ],
    "letterlike": [
        [
            8448,
            8527
        ]
    ],
    "numbers": [
        [
            8528,
            8591
        ]
    ],
    "misc": [
        [
            8960,
            9215
        ]
    ],
    "controlpictures": [
        [
            9216,
            9279
        ]
    ],
    "ocr": [
        [
            9280,
            9311
        ]
    ],
    "box": [
        [
            9472,
            9599
        ]
    ],
    "block": [
        [
            9600,
            9631
        ]
    ],
    "geometric": [
        [
            9632,
            9727
        ]
    ],
    "miscsymbols": [
        [
         	9728,
         	9983
        ],
        [
            127744,
            128511
        ]
    ],
    "dingbats": [
        [
            9984,
            10175
        ]
    ],
    "braille": [
        [
            10240,
            10495
        ]
    ],
    "glagolitic": [
        [
            11264,
            11359
        ]
    ],
    "coptic": [
        [
            11392,
            11519
        ]
    ],
    "tifinagh": [
        [
            11568,
            11647
        ]
    ],
    "cjkpunct": [
        [
            12288,
            12351
        ]
    ],
    "hiragana": [
        [
            12352,
            12447
        ]
    ],
    "kanbun": [
        [
            12688,
            12703
        ]
    ],
    "yijing": [
        [
            19904,
            19967
        ]
    ],
    "cjkstrokes": [
        [
            12736,
            12783
        ]
    ],
    "lisu": [
        [
            42192,
            42239
        ]
    ],
    "vai": [
        [
            42240,
            42559
        ]
    ],
    "modifiertone": [
        [
            42752,
            42783
        ]
    ],
    "sylotinagri": [
        [
            43008,
            43055
        ]
    ],
    "indicnumber": [
        [
            43056,
            43071
        ]
    ],
    "phagspa": [
        [
            43072,
            43135
        ]
    ],
    "saurashtra": [
        [
            43136,
            43231
        ]
    ],
    "kayahli": [
        [
            43264,
            43311
        ]
    ],
    "rejang": [
        [
            43312,
            43359
        ]
    ],
    "javanese": [
        [
            43392,
            43487
        ]
    ],
    "cham": [
        [
            43520,
            43615
        ]
    ],
    "taiviet": [
        [
            43648,
            43743
        ]
    ],
    "meeteimayek": [
        [
            43968,
            44031
        ]
    ],
    "presentation": [
        [
            64256,
            64335
        ]
    ],
    "vertical": [
        [
            65040,
            65055
        ]
    ],
    "halfmarks": [
        [
            65056,
            65071
        ]
    ],
    "small": [
        [
            65104,
            65135
        ]
    ],
    "width": [
        [
            65280,
            65519
        ]
    ],
    "specials": [
        [
            65520,
            65535
        ]
    ],
    "aegean": [
        [
            65792,
            65855
        ]
    ],
    "ancient": [
        [
            65936,
            65999
        ]
    ],
    "phaistosdisc": [
        [
            66000,
            66047
        ]
    ],
    "lycian": [
        [
            66176,
            66207
        ]
    ],
    "carian": [
        [
            66208,
            66271
        ]
    ],
    "olditalic": [
        [
            66304,
            66351
        ]
    ],
    "gothic": [
        [
            66352,
            66383
        ]
    ],
    "ugaritic": [
        [
            66432,
            66463
        ]
    ],
    "oldpersian": [
        [
            66464,
            66527
        ]
    ],
    "deseret": [
        [
            66560,
            66639
        ]
    ],
    "shavian": [
        [
            66640,
            66687
        ]
    ],
    "osmanya": [
        [
            66688,
            66735
        ]
    ],
    "cypriot": [
        [
            67584,
            67647
        ]
    ],
    "aramaic": [
        [
            67648,
            67679
        ]
    ],
    "phoenician": [
        [
            67840,
            67871
        ]
    ],
    "lydian": [
        [
            67872,
            67903
        ]
    ],
    "kharoshthi": [
        [
            68096,
            68191
        ]
    ],
    "oldsoutharabian": [
        [
            68192,
            68223
        ]
    ],
    "avestan": [
        [
            68352,
            68415
        ]
    ],
    "parthian": [
        [
            68416,
            68447
        ]
    ],
    "pahlavi": [
        [
            68448,
            68479
        ]
    ],
    "oldturkic": [
        [
            68608,
            68687
        ]
    ],
    "ruminumerals": [
        [
            69216,
            69247
        ]
    ],
    "brahmi": [
        [
            69632,
            69759
        ]
    ],
    "kaithi": [
        [
            69760,
            69839
        ]
    ],
    "cuneiform": [
        [
            73728,
            74751
        ]
    ],
    "cuneiformnumbers": [
        [
            74752,
            74879
        ]
    ],
    "hieroglyphs": [
        [
            77824,
            78895
        ]
    ],
    "byzantine musical": [
        [
            118784,
            119039
        ]
    ],
    "musicalsymbols": [
        [
            119040,
            119295
        ]
    ],
    "taixuanjing": [
        [
            119552,
            119647
        ]
    ],
    "rodnumerals": [
        [
            119648,
            119679
        ]
    ],
    "mahjong": [
        [
            126976,
            127023
        ]
    ],
    "domino": [
        [
            127024,
            127135
        ]
    ],
    "playingcards": [
        [
            127136,
            127231
        ]
    ],
    "emoticons": [
        [
            128512,
            128591
        ]
    ],
    "mapsymbols": [
        [
            128640,
            128767
        ]
    ],
    "alchemic": [
        [
            128768,
            128895
        ]
    ],
    "tags": [
        [
            917504,
            917631
        ]
    ],
    "greeknumbers": [
        [
            65856,
            65935
        ]
    ],
    "greekmusic": [
        [
            119296,
            119375
        ]
    ]
};
/*
 * ctype.js - Character type definitions
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js locale.js

// !data ctype

/**
 * @namespace
 * Provides a set of static routines that return information about characters.
 * These routines emulate the C-library ctype functions. The characters must be 
 * encoded in utf-8, as no other charsets are currently supported. Only the first
 * character of the given string is tested.
 */
ilib.CType = {
	/**
	 * @protected
	 * Actual implementation for withinRange. Searches the given object for ranges.
	 * The range names are taken from the Unicode range names in 
	 * http://www.unicode.org/Public/UNIDATA/extracted/DerivedGeneralCategory.txt
	 * 
	 * <ul>
	 * <li>Cn - Unassigned
	 * <li>Lu - Uppercase_Letter
	 * <li>Ll - Lowercase_Letter
	 * <li>Lt - Titlecase_Letter
	 * <li>Lm - Modifier_Letter
	 * <li>Lo - Other_Letter
	 * <li>mn - Nonspacing_Mark
	 * <li>Me - Enclosing_Mark
	 * <li>Mc - Spacing_Mark
	 * <li>Nd - Decimal_Number
	 * <li>Nl - Letter_Number
	 * <li>No - Other_Number
	 * <li>Zs - Space_Separator
	 * <li>Zl - Line_Separator
	 * <li>Zp - Paragraph_Separator
	 * <li>Cc - Control
	 * <li>Cf - Format
	 * <li>Co - Private_Use
	 * <li>Cs - Surrogate
	 * <li>Pd - Dash_Punctuation
	 * <li>Ps - Open_Punctuation
	 * <li>Pe - Close_Punctuation
	 * <li>Pc - Connector_Punctuation
	 * <li>Po - Other_Punctuation
	 * <li>Sm - Math_Symbol
	 * <li>Sc - Currency_Symbol
	 * <li>Sk - Modifier_Symbol
	 * <li>So - Other_Symbol
	 * <li>Pi - Initial_Punctuation
	 * <li>Pf - Final_Punctuation
	 * </ul>
	 * 
	 * @param {string} ch character to examine
	 * @param {string} rangeName the name of the range to check
	 * @param {Object} obj object containing the character range data
	 * @return {boolean} true if the first character is within the named
	 * range
	 */
	_inRange: function(ch, rangeName, obj) {
		var range, i, num;
		if (!ch || ch.length === 0 || !rangeName || typeof(obj) === 'undefined') {
			return false;
		}
		
		num = new ilib.String(ch).codePointAt(0);
		range = obj[rangeName];
		if (!range) {
			return false;
		}
		
		for (i = 0; i < range.length; i++) {
			if (range[i].length === 1) {
				// single character range
				if (num === range[i][0]) {
					return true;
				}
			} else if (num >= range[i][0] && num <= range[i][1]) {
				// multi-character range
				return true;
			}
		}
		
		return false;
	},
	
	/**
	 * Return whether or not the first character is within the named range
	 * of Unicode characters. The valid list of range names are taken from 
	 * the Unicode 6.0 spec. Only those ranges which have characters in the 
	 * Basic Multilingual Plane (BMP) are supported. Currently, this method 
	 * supports the following range names:
	 * 
	 * <ul>
	 * <li><i>ascii</i> - basic ASCII
	 * <li><i>latin</i> - Latin, Latin Extended Additional, Latin Extended-C, Latin Extended-D
	 * <li><i>armenian</i>
	 * <li><i>greek</i> - Greek, Greek Extended
	 * <li><i>cyrillic</i> - Cyrillic, Cyrillic Extended-A, Cyrillic Extended-B
	 * <li><i>georgian</i> - Georgian, Georgian Supplement
	 * <li><i>glagolitic</i>
	 * <li><i>gothic</i>
	 * <li><i>ogham</i>
	 * <li><i>oldpersian</i>
	 * <li><i>runic</i>
	 * <li><i>ipa</i> - IPA, Phonetic Extensions, Phonetic Extensions Supplement
	 * <li><i>phonetic</i>
	 * <li><i>modifiertone</i> - Modifier Tone Letters
	 * <li><i>spacing</i>
	 * <li><i>diacritics</i>
	 * <li><i>halfmarks</i> - Combining Half Marks
	 * <li><i>small</i> - Small Form Variants
	 * <li><i>bamum</i> - Bamum, Bamum Supplement
	 * <li><i>ethiopic</i> - Ethiopic, Ethiopic Extended, Ethiopic Extended-A
	 * <li><i>nko</i>
	 * <li><i>osmanya</i>
	 * <li><i>tifinagh</i>
	 * <li><i>val</i>
	 * <li><i>arabic</i> - Arabic, Arabic Supplement, Arabic Presentation Forms-A, 
	 * Arabic Presentation Forms-B
	 * <li><i>carlan</i>
	 * <li><i>hebrew</i>
	 * <li><i>mandaic</i>
	 * <li><i>samaritan</i>
	 * <li><i>syriac</i>
	 * <li><i>mongolian</i>
	 * <li><i>phagspa</i>
	 * <li><i>tibetan</i>
	 * <li><i>bengali</i>
	 * <li><i>devanagari</i> - Devanagari, Devanagari Extended
	 * <li><i>gujarati</i>
	 * <li><i>gurmukhi</i>
	 * <li><i>kannada</i>
	 * <li><i>lepcha</i>
	 * <li><i>limbu</i>
	 * <li><i>malayalam</i>
	 * <li><i>meetaimayek</i>
	 * <li><i>olchiki</i>
	 * <li><i>oriya</i>
	 * <li><i>saurashtra</i>
	 * <li><i>sinhala</i>
	 * <li><i>sylotinagri</i> - Syloti Nagri
	 * <li><i>tamil</i>
	 * <li><i>telugu</i>
	 * <li><i>thaana</i>
	 * <li><i>vedic</i>
	 * <li><i>batak</i>
	 * <li><i>balinese</i>
	 * <li><i>buginese</i>
	 * <li><i>cham</i>
	 * <li><i>javanese</i>
	 * <li><i>kayahli</i>
	 * <li><i>khmer</i>
	 * <li><i>lao</i>
	 * <li><i>myanmar</i> - Myanmar, Myanmar Extended-A
	 * <li><i>newtailue</i>
	 * <li><i>rejang</i>
	 * <li><i>sundanese</i>
	 * <li><i>taile</i>
	 * <li><i>taitham</i>
	 * <li><i>taiviet</i>
	 * <li><i>thai</i>
	 * <li><i>buhld</i>
	 * <li><i>hanunoo</i>
	 * <li><i>tagalog</i>
	 * <li><i>tagbanwa</i>
	 * <li><i>bopomofo</i> - Bopomofo, Bopomofo Extended
	 * <li><i>cjk</i> - the CJK unified ideographs (Han), CJK Unified Ideographs
	 *  Extension A, CJK Unified Ideographs Extension B, CJK Unified Ideographs 
	 *  Extension C, CJK Unified Ideographs Extension D, Ideographic Description 
	 *  Characters (=isIdeo())
	 * <li><i>cjkcompatibility</i> - CJK Compatibility, CJK Compatibility 
	 * Ideographs, CJK Compatibility Forms, CJK Compatibility Ideographs Supplement
	 * <li><i>cjkradicals</i> - the CJK radicals, KangXi radicals
	 * <li><i>hangul</i> - Hangul Jamo, Hangul Syllables, Hangul Jamo Extended-A, 
	 * Hangul Jamo Extended-B, Hangul Compatibility Jamo
	 * <li><i>cjkpunct</i> - CJK symbols and punctuation
	 * <li><i>cjkstrokes</i> - CJK strokes
	 * <li><i>hiragana</i>
	 * <li><i>katakana</i> - Katakana, Katakana Phonetic Extensions, Kana Supplement
	 * <li><i>kanbun</i>
	 * <li><i>lisu</i>
	 * <li><i>yi</i> - Yi Syllables, Yi Radicals
	 * <li><i>cherokee</i>
	 * <li><i>canadian</i> - Unified Canadian Aboriginal Syllabics, Unified Canadian 
	 * Aboriginal Syllabics Extended
	 * <li><i>presentation</i> - Alphabetic presentation forms
	 * <li><i>vertical</i> - Vertical Forms
	 * <li><i>width</i> - Halfwidth and Fullwidth Forms
	 * <li><i>punctuation</i> - General punctuation, Supplemental Punctuation
	 * <li><i>box</i> - Box Drawing
	 * <li><i>block</i> - Block Elements
	 * <li><i>letterlike</i> - Letterlike symbols
	 * <li><i>mathematical</i> - Mathematical alphanumeric symbols, Miscellaneous 
	 * Mathematical Symbols-A, Miscellaneous Mathematical Symbols-B
	 * <li><i>enclosedalpha</i> - Enclosed alphanumerics, Enclosed Alphanumeric Supplement
	 * <li><i>enclosedcjk</i> - Enclosed CJK letters and months, Enclosed Ideographic Supplement
	 * <li><i>cjkcompatibility</i> - CJK compatibility
	 * <li><i>apl</i> - APL symbols
	 * <li><i>controlpictures</i> - Control pictures
	 * <li><i>misc</i> - Miscellaneous technical
	 * <li><i>ocr</i> - Optical character recognition (OCR)
	 * <li><i>combining</i> - Combining Diacritical Marks, Combining Diacritical Marks 
	 * for Symbols, Combining Diacritical Marks Supplement
	 * <li><i>digits</i> - ASCII digits (=isDigit())
	 * <li><i>indicnumber</i> - Common Indic Number Forms
	 * <li><i>numbers</i> - Number dorms
	 * <li><i>supersub</i> - Super- and subscripts
	 * <li><i>arrows</i> - Arrows, Miscellaneous Symbols and Arrows, Supplemental Arrows-A,
	 * Supplemental Arrows-B
	 * <li><i>operators</i> - Mathematical operators, supplemental 
	 * mathematical operators 
	 * <li><i>geometric</i> - Geometric shapes
	 * <li><i>ancient</i> - Ancient symbols
	 * <li><i>braille</i> - Braille patterns
	 * <li><i>currency</i> - Currency symbols
	 * <li><i>dingbats</i>
	 * <li><i>gamesymbols</i>
	 * <li><i>yijing</i> - Yijing Hexagram Symbols
	 * <li><i>specials</i>
	 * <li><i>variations</i> - Variation Selectors, Variation Selectors Supplement
	 * <li><i>privateuse</i> - Private Use Area, Supplementary Private Use Area-A, 
	 * Supplementary Private Use Area-B
	 * <li><i>supplementarya</i> - Supplementary private use area-A
	 * <li><i>supplementaryb</i> - Supplementary private use area-B
	 * <li><i>highsurrogates</i> - High Surrogates, High Private Use Surrogates
	 * <li><i>lowsurrogates</i>
	 * <li><i>reserved</i>
	 * <li><i>noncharacters</i>
	 * </ul><p>
	 * 
	 * Depends directive: !depends ctype.js
	 * 
	 * @param {string} ch character to examine
	 * @param {string} rangeName the name of the range to check
	 * @return {boolean} true if the first character is within the named
	 * range
	 */
	withinRange: function(ch, rangeName) {
		if (!rangeName) {
			return false;
		}
		return ilib.CType._inRange(ch, rangeName.toLowerCase(), ilib.data.ctype);
	}
};

/*
 * ctype.isdigit.js - Character type is digit
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ctype.js

// !data ctype

/**
 * Return whether or not the first character is a digit character in the
 * Latin script.<p>
 * 
 * Depends directive: !depends ctype.isdigit.js
 * 
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is a digit character in the
 * Latin script. 
 */
ilib.CType.isDigit = function (ch) {
	return ilib.CType._inRange(ch, 'digit', ilib.data.ctype);
};

ilib.data.ctype_z = {"Zs":[[32],[160],[5760],[6158],[8192,8202],[8239],[8287],[12288]],"Zl":[[8232]],"Zp":[[8233]]};
/*
 * ctype.isspace.js - Character type is space char
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ctype.js

// !data ctype ctype_z

/**
 * Return whether or not the first character is a whitespace character.<p>
 * 
 * Depends directive: !depends ctype.isspace.js
 * 
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is a whitespace character.
 */
ilib.CType.isSpace = function (ch) {
	return ilib.CType._inRange(ch, 'space', ilib.data.ctype) ||
		ilib.CType._inRange(ch, 'Zs', ilib.data.ctype_z) ||
		ilib.CType._inRange(ch, 'Zl', ilib.data.ctype_z) ||
		ilib.CType._inRange(ch, 'Zp', ilib.data.ctype_z);
};

/*
 * numprs.js - Parse a number in any locale
 * 
 * Copyright © 2012-2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
!depends 
ilibglobal.js 
locale.js 
strings.js 
ctype.isdigit.js 
ctype.isspace.js
*/

/**
 * @class
 * Parse a string as a number, ignoring all locale-specific formatting.<p>
 * 
 * This class is different from the standard Javascript parseInt() and parseFloat() 
 * functions in that the number to be parsed can have formatting characters in it 
 * that are not supported by those two
 * functions, and it handles numbers written in other locales properly. For example, 
 * if you pass the string "203,231.23" to the parseFloat() function in Javascript, it 
 * will return you the number 203. The ilib.Number class will parse it correctly and 
 * the value() function will return the number 203231.23. If you pass parseFloat() the 
 * string "203.231,23" with the locale set to de-DE, it will return you 203 again. This
 * class will return the correct number 203231.23 again.<p>
 * 
 * The options object may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - specify the locale of the string to parse. This is used to
 * figure out what the decimal point character is. If not specified, the default locale
 * for the app or browser is used.
 * <li><i>type</i> - specify whether this string should be interpretted as a number,
 * currency, or percentage amount. When the number is interpretted as a currency
 * amount, the getCurrency() method will return something useful, otherwise it will
 * return undefined. If
 * the number is to be interpretted as percentage amount and there is a percentage sign
 * in the string, then the number will be returned
 * as a fraction from the valueOf() method. If there is no percentage sign, then the 
 * number will be returned as a regular number. That is "58.3%" will be returned as the 
 * number 0.583 but "58.3" will be returned as 58.3. Valid values for this property 
 * are "number", "currency", and "percentage". Default if this is not specified is
 * "number".
 * <li><i>onLoad</i> - a callback function to call when the locale data is fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two. 
 * 
 * <li>sync - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 * </ul>
 * <p>
 * 
 * Depends directive: !depends numprs.js
 * 
 * @constructor
 * @param {string|number|Number|ilib.Number|undefined} str a string to parse as a number, or a number value
 * @param {Object} options Options controlling how the instance should be created 
 */
ilib.Number = function (str, options) {
	var i, stripped = "", sync = true;
	
	this.locale = new ilib.Locale();
	this.type = "number";
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		if (options.type) {
			switch (options.type) {
				case "number":
				case "currency":
				case "percentage":
					this.type = options.type;
					break;
				default:
					break;
			}
		}
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
	}
	
	
	new ilib.LocaleInfo(this.locale, {
		sync: sync,
		onLoad: ilib.bind(this, function (li) {
			this.decimal = li.getDecimalSeparator();
			
			switch (typeof(str)) {
			case 'string':
				// stripping should work for all locales, because you just ignore all the
				// formatting except the decimal char
				var unary = true; // looking for the unary minus still?
				this.str = str || "0";
				i = 0;
				for (i = 0; i < this.str.length; i++) {
					if (unary && this.str.charAt(i) === '-') {
						unary = false;
						stripped += this.str.charAt(i);
					} else if (ilib.CType.isDigit(this.str.charAt(i))) {
						stripped += this.str.charAt(i);
						unary = false;
					} else if (this.str.charAt(i) === this.decimal) {
						stripped += "."; // always convert to period
						unary = false;
					} // else ignore
				}
				this.value = parseFloat(stripped);
				break;
			case 'number':
				this.str = "" + str;
				this.value = str;
				break;
				
			case 'object':
				this.value = /** @type {number} */ str.valueOf();
				this.str = "" + this.value;
				break;
				
			case 'undefined':
				this.value = 0;
				this.str = "0";
				break;
			}
			
			switch (this.type) {
				default:
					// don't need to do anything special for other types
					break;
				case "percentage":
					if (this.str.indexOf(li.getPercentageSymbol()) !== -1) {
						this.value /= 100;
					}
					break;
				case "currency":
					stripped = "";
					i = 0;
					while (i < this.str.length &&
						   !ilib.CType.isDigit(this.str.charAt(i)) &&
						   !ilib.CType.isSpace(this.str.charAt(i))) {
						stripped += this.str.charAt(i++);
					}
					if (stripped.length === 0) {
						while (i < this.str.length && 
							   ilib.CType.isDigit(this.str.charAt(i)) ||
							   ilib.CType.isSpace(this.str.charAt(i)) ||
							   this.str.charAt(i) === '.' ||
							   this.str.charAt(i) === ',' ) {
							i++;
						}
						while (i < this.str.length && 
							   !ilib.CType.isDigit(this.str.charAt(i)) &&
							   !ilib.CType.isSpace(this.str.charAt(i))) {
							stripped += this.str.charAt(i++);
						}
					}
					new ilib.Currency({
						locale: this.locale, 
						sign: stripped,
						sync: sync,
						onLoad: ilib.bind(this, function (cur) {
							this.currency = cur;
							if (options && typeof(options.onLoad) === 'function') {
								options.onLoad(this);
							}				
						})
					});
					return;
			}
			
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
		})
	});
};

ilib.Number.prototype = {
	/**
	 * Return the locale for this formatter instance.
	 * @return {ilib.Locale} the locale instance for this formatter
	 */
	getLocale: function () {
		return this.locale;
	},
	
	/**
	 * Return the original string that this number instance was created with.
	 * @return {string} the original string
	 */
	toString: function () {
		return this.str;
	},
	
	/**
	 * If the type of this Number instance is "currency", then the parser will attempt
	 * to figure out which currency this amount represents. The amount can be written
	 * with any of the currency signs or ISO 4217 codes that are currently
	 * recognized by ilib, and the currency signs may occur before or after the
	 * numeric portion of the string. If no currency can be recognized, then the 
	 * default currency for the locale is returned. If multiple currencies can be
	 * recognized (for example if the currency sign is "$"), then this method 
	 * will prefer the one for the current locale. If multiple currencies can be
	 * recognized, but none are used in the current locale, then the first currency
	 * encountered will be used. This may produce random results, though the larger
	 * currencies occur earlier in the list. For example, if the sign found in the
	 * string is "$" and that is not the sign of the currency of the current locale
	 * then the US dollar will be recognized, as it is the largest currency that uses
	 * the "$" as its sign.
	 * 
	 * @return {ilib.Currency|undefined} the currency instance for this amount, or 
	 * undefined if this Number object is not of type currency
	 */
	getCurrency: function () {
		return this.currency;
	},
	
	/**
	 * Return the value of this number object as a primitive number instance.
	 * @return {number} the value of this number instance
	 */
	valueOf: function () {
		return this.value;
	}
};

ilib.data.currency = {
	"USD": {
		"name": "US Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"CHF": {
		"name": "Swiss Franc",
		"decimals": 2,
		"sign": "Fr"
	},
	"RON": {
		"name": "Leu",
		"decimals": 2,
		"sign": "L"
	},
	"RUB": {
		"name": "Russian Ruble",
		"decimals": 2,
		"sign": "руб."
	},
	"SEK": {
		"name": "Swedish Krona",
		"decimals": 2,
		"sign": "kr"
	},
	"GBP": {
		"name": "Pound Sterling",
		"decimals": 2,
		"sign": "£"
	},
	"PKR": {
		"name": "Pakistan Rupee",
		"decimals": 2,
		"sign": "₨"
	},
	"KES": {
		"name": "Kenyan Shilling",
		"decimals": 2,
		"sign": "Sh"
	},
	"AED": {
		"name": "UAE Dirham",
		"decimals": 2,
		"sign": "د.إ"
	},
	"KRW": {
		"name": "Won",
		"decimals": 0,
		"sign": "₩"
	},
	"AFN": {
		"name": "Afghani",
		"decimals": 2,
		"sign": "؋"
	},
	"ALL": {
		"name": "Lek",
		"decimals": 2,
		"sign": "L"
	},
	"AMD": {
		"name": "Armenian Dram",
		"decimals": 2,
		"sign": "դր."
	},
	"ANG": {
		"name": "Netherlands Antillean Guilder",
		"decimals": 2,
		"sign": "ƒ"
	},
	"AOA": {
		"name": "Kwanza",
		"decimals": 2,
		"sign": "Kz"
	},
	"ARS": {
		"name": "Argentine Peso",
		"decimals": 2,
		"sign": "$"
	},
	"AUD": {
		"name": "Australian Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"AWG": {
		"name": "Aruban Florin",
		"decimals": 2,
		"sign": "ƒ"
	},
	"AZN": {
		"name": "Azerbaijanian Manat",
		"decimals": 2,
		"sign": "AZN"
	},
	"BAM": {
		"name": "Convertible Mark",
		"decimals": 2,
		"sign": "КМ"
	},
	"BBD": {
		"name": "Barbados Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"BDT": {
		"name": "Taka",
		"decimals": 2,
		"sign": "৳"
	},
	"BGN": {
		"name": "Bulgarian Lev",
		"decimals": 2,
		"sign": "лв"
	},
	"BHD": {
		"name": "Bahraini Dinar",
		"decimals": 3,
		"sign": ".د.ب"
	},
	"BIF": {
		"name": "Burundi Franc",
		"decimals": 0,
		"sign": "Fr"
	},
	"BMD": {
		"name": "Bermudian Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"BND": {
		"name": "Brunei Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"BOB": {
		"name": "Boliviano",
		"decimals": 2,
		"sign": "Bs."
	},
	"BRL": {
		"name": "Brazilian Real",
		"decimals": 2,
		"sign": "R$"
	},
	"BSD": {
		"name": "Bahamian Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"BTN": {
		"name": "Ngultrum",
		"decimals": 2,
		"sign": "Nu."
	},
	"BWP": {
		"name": "Pula",
		"decimals": 2,
		"sign": "P"
	},
	"BYR": {
		"name": "Belarussian Ruble",
		"decimals": 0,
		"sign": "Br"
	},
	"BZD": {
		"name": "Belize Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"CAD": {
		"name": "Canadian Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"CDF": {
		"name": "Congolese Franc",
		"decimals": 2,
		"sign": "Fr"
	},
	"CLP": {
		"name": "Chilean Peso",
		"decimals": 0,
		"sign": "$"
	},
	"CNY": {
		"name": "Yuan Renminbi",
		"decimals": 2,
		"sign": "元"
	},
	"COP": {
		"name": "Colombian Peso",
		"decimals": 2,
		"sign": "$"
	},
	"CRC": {
		"name": "Costa Rican Colon",
		"decimals": 2,
		"sign": "₡"
	},
	"CUP": {
		"name": "Cuban Peso",
		"decimals": 2,
		"sign": "$"
	},
	"CVE": {
		"name": "Cape Verde Escudo",
		"decimals": 2,
		"sign": "$"
	},
	"CZK": {
		"name": "Czech Koruna",
		"decimals": 2,
		"sign": "Kč"
	},
	"DJF": {
		"name": "Djibouti Franc",
		"decimals": 0,
		"sign": "Fr"
	},
	"DKK": {
		"name": "Danish Krone",
		"decimals": 2,
		"sign": "kr"
	},
	"DOP": {
		"name": "Dominican Peso",
		"decimals": 2,
		"sign": "$"
	},
	"DZD": {
		"name": "Algerian Dinar",
		"decimals": 2,
		"sign": "د.ج"
	},
	"EGP": {
		"name": "Egyptian Pound",
		"decimals": 2,
		"sign": "£"
	},
	"ERN": {
		"name": "Nakfa",
		"decimals": 2,
		"sign": "Nfk"
	},
	"ETB": {
		"name": "Ethiopian Birr",
		"decimals": 2,
		"sign": "Br"
	},
	"EUR": {
		"name": "Euro",
		"decimals": 2,
		"sign": "€"
	},
	"FJD": {
		"name": "Fiji Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"FKP": {
		"name": "Falkland Islands Pound",
		"decimals": 2,
		"sign": "£"
	},
	"GEL": {
		"name": "Lari",
		"decimals": 2,
		"sign": "ლ"
	},
	"GHS": {
		"name": "Cedi",
		"decimals": 2,
		"sign": "₵"
	},
	"GIP": {
		"name": "Gibraltar Pound",
		"decimals": 2,
		"sign": "£"
	},
	"GMD": {
		"name": "Dalasi",
		"decimals": 2,
		"sign": "D"
	},
	"GNF": {
		"name": "Guinea Franc",
		"decimals": 0,
		"sign": "Fr"
	},
	"GTQ": {
		"name": "Quetzal",
		"decimals": 2,
		"sign": "Q"
	},
	"GYD": {
		"name": "Guyana Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"HKD": {
		"name": "Hong Kong Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"HNL": {
		"name": "Lempira",
		"decimals": 2,
		"sign": "L"
	},
	"HRK": {
		"name": "Croatian Kuna",
		"decimals": 2,
		"sign": "kn"
	},
	"HTG": {
		"name": "Gourde",
		"decimals": 2,
		"sign": "G"
	},
	"HUF": {
		"name": "Forint",
		"decimals": 2,
		"sign": "Ft"
	},
	"IDR": {
		"name": "Rupiah",
		"decimals": 2,
		"sign": "Rp"
	},
	"ILS": {
		"name": "New Israeli Sheqel",
		"decimals": 2,
		"sign": "₪"
	},
	"INR": {
		"name": "Indian Rupee",
		"decimals": 2,
		"sign": "₹"
	},
	"IQD": {
		"name": "Iraqi Dinar",
		"decimals": 3,
		"sign": "ع.د"
	},
	"IRR": {
		"name": "Iranian Rial",
		"decimals": 2,
		"sign": "﷼"
	},
	"ISK": {
		"name": "Iceland Krona",
		"decimals": 0,
		"sign": "kr"
	},
	"JMD": {
		"name": "Jamaican Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"JOD": {
		"name": "Jordanian Dinar",
		"decimals": 3,
		"sign": "د.ا"
	},
	"JPY": {
		"name": "Yen",
		"decimals": 0,
		"sign": "¥"
	},
	"KGS": {
		"name": "Som",
		"decimals": 2,
		"sign": "лв"
	},
	"KHR": {
		"name": "Riel",
		"decimals": 2,
		"sign": "៛"
	},
	"KMF": {
		"name": "Comoro Franc",
		"decimals": 0,
		"sign": "Fr"
	},
	"KPW": {
		"name": "North Korean Won",
		"decimals": 2,
		"sign": "₩"
	},
	"KWD": {
		"name": "Kuwaiti Dinar",
		"decimals": 3,
		"sign": "د.ك"
	},
	"KYD": {
		"name": "Cayman Islands Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"KZT": {
		"name": "Tenge",
		"decimals": 2,
		"sign": "₸"
	},
	"LAK": {
		"name": "Kip",
		"decimals": 2,
		"sign": "₭"
	},
	"LBP": {
		"name": "Lebanese Pound",
		"decimals": 2,
		"sign": "ل.ل"
	},
	"LKR": {
		"name": "Sri Lanka Rupee",
		"decimals": 2,
		"sign": "Rs"
	},
	"LRD": {
		"name": "Liberian Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"LSL": {
		"name": "Loti",
		"decimals": 2,
		"sign": "L"
	},
	"LTL": {
		"name": "Lithuanian Litas",
		"decimals": 2,
		"sign": "Lt"
	},
	"LVL": {
		"name": "Latvian Lats",
		"decimals": 2,
		"sign": "Ls"
	},
	"LYD": {
		"name": "Libyan Dinar",
		"decimals": 3,
		"sign": "ل.د"
	},
	"MAD": {
		"name": "Moroccan Dirham",
		"decimals": 2,
		"sign": "د.م."
	},
	"MDL": {
		"name": "Moldovan Leu",
		"decimals": 2,
		"sign": "L"
	},
	"MGA": {
		"name": "Malagasy Ariary",
		"decimals": 2,
		"sign": "Ar"
	},
	"MKD": {
		"name": "Denar",
		"decimals": 2,
		"sign": "ден"
	},
	"MMK": {
		"name": "Kyat",
		"decimals": 2,
		"sign": "K"
	},
	"MNT": {
		"name": "Tugrik",
		"decimals": 2,
		"sign": "₮"
	},
	"MOP": {
		"name": "Pataca",
		"decimals": 2,
		"sign": "P"
	},
	"MRO": {
		"name": "Ouguiya",
		"decimals": 2,
		"sign": "UM"
	},
	"MUR": {
		"name": "Mauritius Rupee",
		"decimals": 2,
		"sign": "₨"
	},
	"MVR": {
		"name": "Rufiyaa",
		"decimals": 2,
		"sign": ".ރ"
	},
	"MWK": {
		"name": "Kwacha",
		"decimals": 2,
		"sign": "MK"
	},
	"MXN": {
		"name": "Mexican Peso",
		"decimals": 2,
		"sign": "$"
	},
	"MYR": {
		"name": "Malaysian Ringgit",
		"decimals": 2,
		"sign": "RM"
	},
	"MZN": {
		"name": "Metical",
		"decimals": 2,
		"sign": "MT"
	},
	"NAD": {
		"name": "Namibia Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"NGN": {
		"name": "Naira",
		"decimals": 2,
		"sign": "₦"
	},
	"NIO": {
		"name": "Cordoba Oro",
		"decimals": 2,
		"sign": "C$"
	},
	"NOK": {
		"name": "Norwegian Krone",
		"decimals": 2,
		"sign": "kr"
	},
	"NPR": {
		"name": "Nepalese Rupee",
		"decimals": 2,
		"sign": "₨"
	},
	"NZD": {
		"name": "New Zealand Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"OMR": {
		"name": "Rial Omani",
		"decimals": 3,
		"sign": "ر.ع."
	},
	"PAB": {
		"name": "Balboa",
		"decimals": 2,
		"sign": "B/."
	},
	"PEN": {
		"name": "Nuevo Sol",
		"decimals": 2,
		"sign": "S/."
	},
	"PGK": {
		"name": "Kina",
		"decimals": 2,
		"sign": "K"
	},
	"PHP": {
		"name": "Philippine Peso",
		"decimals": 2,
		"sign": "₱"
	},
	"PLN": {
		"name": "Zloty",
		"decimals": 2,
		"sign": "zł"
	},
	"PYG": {
		"name": "Guarani",
		"decimals": 0,
		"sign": "₲"
	},
	"QAR": {
		"name": "Qatari Rial",
		"decimals": 2,
		"sign": "ر.ق"
	},
	"RSD": {
		"name": "Serbian Dinar",
		"decimals": 2,
		"sign": "дин."
	},
	"RWF": {
		"name": "Rwanda Franc",
		"decimals": 0,
		"sign": "Fr"
	},
	"SAR": {
		"name": "Saudi Riyal",
		"decimals": 2,
		"sign": "ر.س"
	},
	"SBD": {
		"name": "Solomon Islands Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"SCR": {
		"name": "Seychelles Rupee",
		"decimals": 2,
		"sign": "₨"
	},
	"SDG": {
		"name": "Sudanese Pound",
		"decimals": 2,
		"sign": "£"
	},
	"SGD": {
		"name": "Singapore Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"SHP": {
		"name": "Saint Helena Pound",
		"decimals": 2,
		"sign": "£"
	},
	"SLL": {
		"name": "Leone",
		"decimals": 2,
		"sign": "Le"
	},
	"SOS": {
		"name": "Somali Shilling",
		"decimals": 2,
		"sign": "Sh"
	},
	"SRD": {
		"name": "Surinam Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"SSP": {
		"name": "South Sudanese Pound",
		"decimals": 2,
		"sign": ""
	},
	"STD": {
		"name": "Dobra",
		"decimals": 2,
		"sign": "Db"
	},
	"SYP": {
		"name": "Syrian Pound",
		"decimals": 2,
		"sign": "£"
	},
	"SZL": {
		"name": "Lilangeni",
		"decimals": 2,
		"sign": "L"
	},
	"THB": {
		"name": "Baht",
		"decimals": 2,
		"sign": "฿"
	},
	"TJS": {
		"name": "Somoni",
		"decimals": 2,
		"sign": "ЅМ"
	},
	"TMT": {
		"name": "New Manat",
		"decimals": 2,
		"sign": "m"
	},
	"TND": {
		"name": "Tunisian Dinar",
		"decimals": 3,
		"sign": "د.ت"
	},
	"TOP": {
		"name": "Pa’anga",
		"decimals": 2,
		"sign": "T$"
	},
	"TRY": {
		"name": "Turkish Lira",
		"decimals": 2,
		"sign": "TL"
	},
	"TTD": {
		"name": "Trinidad and Tobago Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"TWD": {
		"name": "New Taiwan Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"TZS": {
		"name": "Tanzanian Shilling",
		"decimals": 2,
		"sign": "Sh"
	},
	"UAH": {
		"name": "Hryvnia",
		"decimals": 2,
		"sign": "₴"
	},
	"UGX": {
		"name": "Uganda Shilling",
		"decimals": 2,
		"sign": "Sh"
	},
	"UYU": {
		"name": "Peso Uruguayo",
		"decimals": 2,
		"sign": "$"
	},
	"UZS": {
		"name": "Uzbekistan Sum",
		"decimals": 2,
		"sign": "лв"
	},
	"VEF": {
		"name": "Bolivar Fuerte",
		"decimals": 2,
		"sign": "Bs F"
	},
	"VND": {
		"name": "Dong",
		"decimals": 0,
		"sign": "₫"
	},
	"VUV": {
		"name": "Vatu",
		"decimals": 0,
		"sign": "Vt"
	},
	"WST": {
		"name": "Tala",
		"decimals": 2,
		"sign": "T"
	},
	"XAF": {
		"name": "CFA Franc BEAC",
		"decimals": 0,
		"sign": "Fr"
	},
	"XCD": {
		"name": "East Caribbean Dollar",
		"decimals": 2,
		"sign": "$"
	},
	"XOF": {
		"name": "CFA Franc BCEAO",
		"decimals": 0,
		"sign": "Fr"
	},
	"XPF": {
		"name": "CFP Franc",
		"decimals": 0,
		"sign": "Fr"
	},
	"YER": {
		"name": "Yemeni Rial",
		"decimals": 2,
		"sign": "﷼"
	},
	"ZAR": {
		"name": "Rand",
		"decimals": 2,
		"sign": "R"
	},
	"ZMK": {
		"name": "Zambian Kwacha",
		"decimals": 2,
		"sign": "ZK"
	},
	"ZWL": {
		"name": "Zimbabwe Dollar",
		"decimals": 2,
		"sign": "$"
	}
}
;
/*
 * currency.js - Currency definition
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js locale.js

// !data currency

/**
 * @class
 * Create a new currency information instance. Instances of this class encode 
 * information about a particular currency.<p>
 * 
 * Note: that if you are looking to format currency for display, please see
 * the number formatting class {ilib.NumFmt}. This class only gives information
 * about currencies.<p> 
 * 
 * The options can contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - specify the locale for this instance
 * <li><i>code</i> - find info on a specific currency with the given ISO 4217 code 
 * <li><i>sign</i> - search for a currency that uses this sign
 * <li><i>onLoad</i> - a callback function to call when the currency data is fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two. 
 * </ul>
 * 
 * When searching for a currency by its sign, this class cannot guarantee 
 * that it will return info about a specific currency. The reason is that currency 
 * signs are sometimes shared between different currencies and the sign is 
 * therefore ambiguous. If you need a 
 * guarantee, find the currency using the code instead.<p>
 * 
 * The way this class finds a currency by sign is the following. If the sign is 
 * unambiguous, then
 * the currency is returned. If there are multiple currencies that use the same
 * sign, and the current locale uses that sign, then the default currency for
 * the current locale is returned. If there are multiple, but the current locale
 * does not use that sign, then the currency with the largest circulation is
 * returned. For example, if you are in the en-GB locale, and the sign is "$",
 * then this class will notice that there are multiple currencies with that
 * sign (USD, CAD, AUD, HKD, MXP, etc.) Since "$" is not used in en-GB, it will 
 * pick the one with the largest circulation, which in this case is the US Dollar
 * (USD).<p>
 * 
 * If neither the code or sign property is set, the currency that is most common 
 * for the locale
 * will be used instead. If the locale is not set, the default locale will be used.
 * If the code is given, but it is not found in the list of known currencies, this
 * constructor will throw an exception. If the sign is given, but it is not found,
 * this constructor will default to the currency for the current locale. If both
 * the code and sign properties are given, then the sign property will be ignored
 * and only the code property used. If the locale is given, but it is not a known
 * locale, this class will default to the default locale instead.<p>
 * 
 * Depends directive: !depends currency.js
 * 
 * @constructor
 * @param options {Object} a set of properties to govern how this instance is constructed.
 * @throws "currency xxx is unknown" when the given currency code is not in the list of 
 * known currencies. xxx is replaced with the requested code.
 */
ilib.Currency = function (options) {
	var sign,
		currInfo,
		currencies = ilib.data.currency;

	if (options) {
		if (options.code) {
			this.code = options.code;
		}
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		if (options.sign) {
			sign = options.sign;
		}
	}
	
	this.locale = this.locale || new ilib.Locale();
	
	new ilib.LocaleInfo(this.locale, {
		onLoad: ilib.bind(this, function (li) {
			this.locinfo = li;
	    	if (this.code) {
	    		currInfo = currencies[this.code];
	    		if (!currInfo) {
	    			throw "currency " + this.code + " is unknown";
	    		}
	    	} else if (sign) {
	    		currInfo = currencies[sign]; // maybe it is really a code...
	    		if (typeof(currInfo) !== 'undefined') {
	    			this.code = sign;
	    		} else {
	    			this.code = this.locinfo.getCurrency();
	    			currInfo = currencies[this.code];
	    			if (currInfo.sign !== sign) {
	    				// current locale does not use the sign, so search for it
	    				for (var cur in currencies) {
	    					if (cur && currencies[cur]) {
	    						currInfo = currencies[cur];
	    						if (currInfo.sign === sign) {
	    							// currency data is already ordered so that the currency with the
	    							// largest circulation is at the beginning, so all we have to do
	    							// is take the first one in the list that matches
	    							this.code = cur;
	    							break;
	    						}
	    					}
	    				}
	    			}
	    		}
	    	}
	    	
	    	if (!currInfo || !this.code) {
	    		this.code = this.locinfo.getCurrency();
	    		currInfo = currencies[this.code];
	    	}
	    	
	    	this.name = currInfo.name;
	    	this.fractionDigits = currInfo.decimals;
	    	this.sign = currInfo.sign;
	    	
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
		})
	});
};

/**
 * @static
 * Return an array of the ids for all ISO 4217 currencies that
 * this copy of ilib knows about.
 * @return {Array.<string>} an array of currency ids that this copy of ilib knows about.
 */
ilib.Currency.getAvailableCurrencies = function() {
	var ret = [],
		cur,
		currencies = new ilib.ResBundle({
			name: "currency"
		}).getResObj();
	
	for (cur in currencies) {
		if (cur && currencies[cur]) {
			ret.push(cur);
		}
	}
	
	return ret;
};

ilib.Currency.prototype = {
	/**
	 * Return the ISO 4217 currency code for this instance.
	 * @return {string} the ISO 4217 currency code for this instance
	 */
	getCode: function () {
		return this.code;
	},
	
	/**
	 * Return the default number of fraction digits that is typically used
	 * with this type of currency.
	 * @return {number} the number of fraction digits for this currency
	 */
	getFractionDigits: function () {
		return this.fractionDigits;
	},
	
	/**
	 * Return the sign commonly used to represent this currency.
	 * @return {string} the sign commonly used to represent this currency
	 */
	getSign: function () {
		return this.sign;
	},
	
	/**
	 * Return the name of the currency in English.
	 * @return {string} the name of the currency in English
	 */
	getName: function () {
		return this.name;
	},
	
	/**
	 * Return the locale for this currency. If the options to the constructor 
	 * included a locale property in order to find the currency that is appropriate
	 * for that locale, then the locale is returned here. If the options did not
	 * include a locale, then this method returns undefined.
	 * @return {ilib.Locale} the locale used in the constructor of this instance,
	 * or undefined if no locale was given in the constructor
	 */
	getLocale: function () {
		return this.locale;
	}
};

/*
 * numfmt.js - Number formatter definition
 * 
 * Copyright © 2012-2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ilibglobal.js locale.js strings.js currency.js


/*
!depends 
ilibglobal.js 
locale.js
localeinfo.js
util/utils.js
currency.js
strings.js
*/

// !data localeinfo currency

/**
 * @class
 * Create a new number formatter instance. Locales differ in the way that digits
 * in a formatted number are grouped, in the way the decimal character is represented, 
 * etc. Use this formatter to get it right for any locale.<p>
 * 
 * This formatter can format plain numbers, currency amounts, and percentage amounts.<p>  
 * 
 * As with all formatters, the recommended
 * practice is to create one formatter and use it multiple times to format various
 * numbers.<p>
 * 
 * The options can contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - use the conventions of the specified locale when figuring out how to
 * format a number.
 * <li><i>type</i> - the type of this formatter. Valid values are "number", "currency", or 
 * "percentage". If this property is not specified, the default is "number".
 * <li><i>currency</i> - the ISO 4217 3-letter currency code to use when the formatter type 
 * is "currency". This property is required for currency formatting. If the type property 
 * is "currency" and the currency property is not specified, the constructor will throw a
 * an exception. 
 * <li><i>maxFractionDigits</i> - the maximum number of digits that should appear in the
 * formatted output after the decimal. A value of -1 means unlimited, and 0 means only print
 * the integral part of the number. 
 * <li><i>minFractionDigits</i> - the minimum number of fractional digits that should
 * appear in the formatted output. If the number does not have enough fractional digits
 * to reach this minimum, the number will be zero-padded at the end to get to the limit.
 * If the type of the formatter is "currency" and this
 * property is not specified, then the minimum fraction digits is set to the normal number
 * of digits used with that currency, which is almost always 0, 2, or 3 digits.
 * <li><i>roundingMode</i> - When the maxFractionDigits or maxIntegerDigits is specified,
 * this property governs how the least significant digits are rounded to conform to that
 * maximum. The value of this property is a string with one of the following values:
 * <ul>
 *   <li><i>up</i> - round away from zero
 *   <li><i>down</i> - round towards zero. This has the effect of truncating the number
 *   <li><i>ceiling</i> - round towards positive infinity
 *   <li><i>floor</i> - round towards negative infinity
 *   <li><i>halfup</i> - round towards nearest neighbour. If equidistant, round up.
 *   <li><i>halfdown</i> - round towards nearest neighbour. If equidistant, round down.
 *   <li><i>halfeven</i> - round towards nearest neighbour. If equidistant, round towards the even neighbour
 *   <li><i>halfodd</i> - round towards nearest neighbour. If equidistant, round towards the odd neighbour
 * </ul>
 * When the type of the formatter is "currency" and the <i>roundingMode</i> property is not
 * set, then the standard legal rounding rules for the locale are followed. If the type
 * is "number" or "percentage" and the <i>roundingMode</i> property is not set, then the 
 * default mode is "halfdown".</i>.
 * 
 * <li><i>style</i> - When the type of this formatter is "currency", the currency amount
 * can be formatted in the following styles: "common" and "iso". The common style is the
 * one commonly used in every day writing where the currency unit is represented using a 
 * symbol. eg. "$57.35" for fifty-seven dollars and thirty five cents. The iso style is 
 * the international style where the currency unit is represented using the ISO 4217 code.
 * eg. "USD 57.35" for the same amount. The default is "common" style if the style is
 * not specified.<p>
 * 
 * When the type of this formatter is "number",
 * the style can be either "standard" or "scientific". A "standard" style means a fully
 * specified floating point number formatted for the locale, whereas "scientific" uses
 * scientific notation for all numbers. That is, 1 integral digit, followed by a number
 * of fractional digits, followed by an "e" which denotes exponentiation, followed digits
 * which give the power of 10 in the exponent. Note that if you specify a maximum number
 * of integral digits, the formatter with a standard style will give you standard 
 * formatting for smaller numbers and scientific notation for larger numbers. The default
 * is standard style if this is not specified.
 *  
 * <li><i>onLoad</i> - a callback function to call when the format data is fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two. 
 * 
 * <li>sync - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 * </ul>
 * <p>
 * 
 * Depends directive: !depends numfmt.js
 * 
 * @constructor
 * @param {Object.<string,*>} options A set of options that govern how the formatter will behave 
 */
ilib.NumFmt = function (options) {
	var sync = true;
	this.locale = new ilib.Locale();
	this.type = "number";
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		if (options.type) {
			if (options.type === 'number' || 
				options.type === 'currency' || 
				options.type === 'percentage') {
				this.type = options.type;
			}
		}
		
		if (options.currency) {
			this.currency = options.currency;
		}
		
		if (typeof(options.maxFractionDigits) === 'number') {
			this.maxFractionDigits = this._toPrimitive(options.maxFractionDigits);
		}
		if (typeof(options.minFractionDigits) === 'number') {
			this.minFractionDigits = this._toPrimitive(options.minFractionDigits);
		}
		if (options.style) {
			this.style = options.style;
		}
		
		this.roundingMode = options.roundingMode;

		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
	}
	
	new ilib.LocaleInfo(this.locale, {
		sync: sync,
		onLoad: ilib.bind(this, function (li) {
			this.localeInfo = li;

			if (this.type === "currency") {
				var templates;
				
				if (!this.currency || typeof(this.currency) != 'string') {
					throw "A currency property is required in the options to the number formatter constructor when the type property is set to currency.";
				}
				
				new ilib.Currency({
					locale: this.locale,
					code: this.currency,
					sync: sync,
					onLoad: ilib.bind(this, function (cur) {
						this.currencyInfo = cur;
						if (this.style !== "common" && this.style !== "iso") {
							this.style = "common";
						}
						
						if (typeof(this.maxFractionDigits) !== 'number' && typeof(this.minFractionDigits) !== 'number') {
							this.minFractionDigits = this.maxFractionDigits = this.currencyInfo.getFractionDigits();
						}
						
						templates = this.localeInfo.getCurrencyFormats();
						this.template = new ilib.String(templates[this.style]);
						this.sign = (this.style === "iso") ? this.currencyInfo.getCode() : this.currencyInfo.getSign();
						
						if (!this.roundingMode) {
							this.roundingMode = this.currencyInfo && this.currencyInfo.roundingMode;
						}

						this._init();
						
						if (options && typeof(options.onLoad) === 'function') {
							options.onLoad(this);
						}
					})
				});
				return;
			} else if (this.type === "percentage") {
				this.template = new ilib.String(this.localeInfo.getPercentageFormat());
			}

			this._init();
			
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
		})
	});
};

/**
 * Return an array of available locales that this formatter can format
 * @return {Array.<ilib.Locale>|undefined} an array of available locales
 */
ilib.NumFmt.getAvailableLocales = function () {
	return undefined;
};

/**
 * @private
 * @const
 * @type string
 */
ilib.NumFmt.zeros = "0000000000000000000000000000000000000000000000000000000000000000000000";


ilib.NumFmt.prototype = {
	/**
	 * @private
	 */
	_init: function () {
		if (this.maxFractionDigits < this.minFractionDigits) {
			this.minFractionDigits = this.maxFractionDigits;
		}		
		
		if (!this.roundingMode) {
			this.roundingMode = this.localeInfo.getRoundingMode();
		}
		
		if (!this.roundingMode) {
			this.roundingMode = "halfdown";
		}
		
		// set up the function, so we only have to figure it out once
		// and not every time we do format()
		this.round = ilib._roundFnc[this.roundingMode];
		if (!this.round) {
			this.roundingMode = "halfdown";
			this.round = ilib._roundFnc[this.roundingMode];
		}
	},
	
	/*
	 * @private
	 */
	_pad: function (str, length, left) {
		return (str.length >= length) ? 
			str : 
			(left ? 
				ilib.NumFmt.zeros.substring(0,length-str.length) + str : 
				str + ilib.NumFmt.zeros.substring(0,length-str.length));  
	},
	
	/**
	 * @private
	 * @param {Number|ilib.Number|string|number} num object, string, or number to convert to a primitive number
	 * @return {number} the primitive number equivalent of the argument
	 */
	_toPrimitive: function (num) {
		var n = 0;
		
		switch (typeof(num)) {
		case 'number':
			n = num;
			break;
		case 'string':
			n = parseFloat(num);
			break;
		case 'object':
			// Number.valueOf() is incorrectly documented as being of type "string" rather than "number", so coerse 
			// the type here to shut the type checker up
			n = /** @type {number} */ num.valueOf();
			break;
		}
		
		return n;
	},
	
	/**
	 * @private
	 * @param {number} num the number to format
	 * @return {string} the formatted number 
	 */
	_formatScientific: function (num) {
		var n = new Number(num);
		var formatted;
		if (typeof(this.maxFractionDigits) !== 'undefined') {
			// if there is fraction digits, round it to the right length first
			// divide or multiply by 10 by manipulating the exponent so as to
			// avoid the rounding errors of floating point numbers
			var e, 
				factor,
				str = n.toExponential(),
				parts = str.split("e"),
				significant = parts[0];
			
			e = parts[1];	
			factor = Math.pow(10, this.maxFractionDigits);
			significant = this.round(significant * factor) / factor;
			formatted = "" + significant + "e" + e;
		} else {
			formatted = n.toExponential(this.minFractionDigits);
		}
		return formatted;
	},
	
	/**
	 * @private 
	 * @param {number} num the number to format
	 * @return {string} the formatted number
	 */ 
	_formatStandard: function (num) {
		var i;
		
		// console.log("_formatNumberStandard: formatting number " + num);
		if (typeof(this.maxFractionDigits) !== 'undefined' && this.maxFractionDigits > -1) {
			var factor = Math.pow(10, this.maxFractionDigits);
			num = this.round(num * factor) / factor;
		}

		var negative = (num < 0);
		if (negative) {
			num = -num;
		}
		
		var parts = ("" + num).split("."),
			integral = parts[0],
			fraction = parts[1],
			cycle,
			groupSize = this.localeInfo.getGroupingDigits(),
			formatted;
		
		
		if (this.minFractionDigits > 0) {
			fraction = this._pad(fraction || "", this.minFractionDigits, false);
		}

		if (groupSize > 0) {
			cycle = ilib.mod(integral.length-1, groupSize);
			formatted = negative ? "-" : "";
			for (i = 0; i < integral.length-1; i++) {
				formatted += integral.charAt(i);
				if (cycle === 0) {
					formatted += this.localeInfo.getGroupingSeparator();
				}
				cycle = ilib.mod(cycle - 1, groupSize);
			}
			formatted += integral.charAt(integral.length-1);
		} else {
			formatted = (negative ? "-" : "") + integral;
		}
		
		if (fraction && (typeof(this.maxFractionDigits) === 'undefined' || this.maxFractionDigits > 0)) {
			formatted += this.localeInfo.getDecimalSeparator();
			formatted += fraction;
		}
		
		// console.log("_formatNumberStandard: returning " + formatted);
		return formatted;
	},
	
	/**
	 * Format a number according to the settings of this number formatter instance.
	 * @param {number|string|Number|ilib.Number} num a floating point number to format
	 * @return {string} a string containing the formatted number
	 */
	format: function (num) {
		var formatted, n;

		if (typeof(num) === 'undefined') {
			return "";
		}
		
		// convert to a real primitive number type
		n = this._toPrimitive(num);
		
		if (this.type === "number") {
			formatted = (this.style === "scientific") ? 
					this._formatScientific(n) : 
					this._formatStandard(n);
		} else {			
			formatted = this.template.format({n: this._formatStandard(n), s: this.sign});
		}
		
		return formatted;
	},
	
	/**
	 * Return the type of formatter. Valid values are "number", "currency", and
	 * "percentage".
	 * 
	 * @return {string} the type of formatter
	 */
	getType: function () {
		return this.type;
	},
	
	/**
	 * Return the locale for this formatter instance.
	 * @return {ilib.Locale} the locale instance for this formatter
	 */
	getLocale: function () {
		return this.locale;
	},
	
	/**
	 * Returns true if this formatter groups together digits in the integral 
	 * portion of a number, based on the options set up in the constructor. In 
	 * most western European cultures, this means separating every 3 digits 
	 * of the integral portion of a number with a particular character.
	 * 
	 * @return {boolean} true if this formatter groups digits in the integral
	 * portion of the number
	 */
	isGroupingUsed: function () {
		var c = this.localeInfo.getGroupingSeparator();
		return (c !== 'undefined' && c.length > 0);
	},
	
	/**
	 * Returns the maximum fraction digits set up in the constructor.
	 * 
	 * @return {number} the maximum number of fractional digits this
	 * formatter will format, or -1 for no maximum
	 */
	getMaxFractionDigits: function () {
		return typeof(this.maxFractionDigits) !== 'undefined' ? this.maxFractionDigits : -1;
	},
	
	/**
	 * Returns the minimum fraction digits set up in the constructor. If
	 * the formatter has the type "currency", then the minimum fraction
	 * digits is the amount of digits that is standard for the currency
	 * in question unless overridden in the options to the constructor.
	 * 
	 * @return {number} the minimum number of fractional digits this
	 * formatter will format, or -1 for no minimum
	 */
	getMinFractionDigits: function () {
		return typeof(this.minFractionDigits) !== 'undefined' ? this.minFractionDigits : -1;
	},

	/**
	 * Returns the ISO 4217 code for the currency that this formatter formats.
	 * IF the typeof this formatter is not "currency", then this method will
	 * return undefined.
	 * 
	 * @return {string} the ISO 4217 code for the currency that this formatter
	 * formats, or undefined if this not a currency formatter
	 */
	getCurrency: function () {
		return this.currencyInfo && this.currencyInfo.getCode();
	},
	
	/**
	 * Returns the rounding mode set up in the constructor. The rounding mode
	 * controls how numbers are rounded when the integral or fraction digits 
	 * of a number are limited.
	 * 
	 * @return {string} the name of the rounding mode used in this formatter
	 */
	getRoundingMode: function () {
		return this.roundingMode;
	},
	
	/**
	 * If this formatter is a currency formatter, then the style determines how the
	 * currency is denoted in the formatted output. This method returns the style
	 * that this formatter will produce. (See the constructor comment for more about
	 * the styles.)
	 * @return {string} the name of the style this formatter will use to format
	 * currency amounts, or "undefined" if this formatter is not a currency formatter
	 */
	getStyle: function () {
		return this.style;
	}
};

/*
 * durfmt.js - Date formatter definition
 * 
 * Copyright © 2012-2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
!depends 
ilibglobal.js 
locale.js 
date.js 
strings.js 
resources.js 
localeinfo.js
*/

// !data dateformats sysres
// !resbundle sysres

/**
 * @class
 * 
 * Create a new duration formatter instance. The duration formatter is immutable once
 * it is created, but can format as many different durations as needed with the same
 * options. Create different duration formatter instances for different purposes
 * and then keep them cached for use later if you have more than one duration to
 * format.<p>
 * 
 * Duration formatters format lengths of time. The duration formatter is meant to format 
 * durations of such things as the length of a song or a movie or a meeting, or the 
 * current position in that song or movie while playing it. If you wish to format a 
 * period of time that has a specific start and end date/time, then use a
 * [ilib.DateRngFmt] instance instead and call its format method.<p>
 *  
 * The options may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - locale to use when formatting the duration. If the locale is
 * not specified, then the default locale of the app or web page will be used.
 * 
 * <li><i>length</i> - Specify the length of the format to use. The length is the approximate size of the 
 * formatted string.
 * 
 * <ul>
 * <li><i>short</i> - use a short representation of the duration. This is the most compact format possible for the locale. eg. 1y 1m 1w 1d 1:01:01
 * <li><i>medium</i> - use a medium length representation of the duration. This is a slightly longer format. eg. 1 yr 1 mo 1 wk 1 dy 1 hr 1 mi 1 se
 * <li><i>long</i> - use a long representation of the duration. This is a fully specified format, but some of the textual 
 * parts may still be abbreviated. eg. 1 yr 1 mo 1 wk 1 day 1 hr 1 min 1 sec
 * <li><i>full</i> - use a full representation of the duration. This is a fully specified format where all the textual 
 * parts are spelled out completely. eg. 1 year, 1 month, 1 week, 1 day, 1 hour, 1 minute and 1 second
 * </ul>
 * 
 * <li><i>style<i> - whether hours, minutes, and seconds should be formatted as a text string
 * or as a regular time as on a clock. eg. text is "1 hour, 15 minutes", whereas clock is "1:15:00". Valid
 * values for this property are "text" or "clock". Default if this property is not specified
 * is "text".
 * 
 * <li><i>onLoad</i> - a callback function to call when the format data is fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two. 
 * 
 * <li>sync - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 * </ul>
 * <p>
 * 
 * Depends directive: !depends durfmt.js
 * 
 * @constructor
 * @param {?Object} options options governing the way this date formatter instance works
 */
ilib.DurFmt = function(options) {
	var sync = true;
	
	this.locale = new ilib.Locale();
	this.length = "short";
	this.style = "text";
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		if (options.length) {
			if (options.length === 'short' ||
				options.length === 'medium' ||
				options.length === 'long' ||
				options.length === 'full') {
				this.length = options.length;
			}
		}
		
		if (options.style) {
			if (options.style === 'text' || options.style === 'clock') {
				this.style = options.style;
			}
		}
		
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
	}
	
	new ilib.ResBundle({
		locale: this.locale,
		name: "sysres",
		sync: sync,
		onLoad: ilib.bind(this, function (sysres) {
			switch (this.length) {
				case 'short':
					this.components = {
						year: sysres.getString("#{num}y"),
						month: sysres.getString("#{num}m", "durationShortMonths"),
						week: sysres.getString("#{num}w"),
						day: sysres.getString("#{num}d"),
						hour: sysres.getString("#{num}h"),
						minute: sysres.getString("#{num}m", "durationShortMinutes"),
						second: sysres.getString("#{num}s"),
						millisecond: sysres.getString("#{num}m", "durationShortMillis"),
						separator: sysres.getString(" ", "separatorShort"),
						finalSeparator: "" // not used at this length
					};
					break;
					
				case 'medium':
					this.components = {
						year: sysres.getString("1#1 yr|#{num} yrs", "durationMediumYears"),
						month: sysres.getString("1#1 mo|#{num} mos"),
						week: sysres.getString("1#1 wk|#{num} wks", "durationMediumWeeks"),
						day: sysres.getString("1#1 dy|#{num} dys"),
						hour: sysres.getString("1#1 hr|#{num} hrs", "durationMediumHours"),
						minute: sysres.getString("1#1 mi|#{num} min"),
						second: sysres.getString("1#1 se|#{num} sec"),
						millisecond: sysres.getString("#{num} ms"),
						separator: sysres.getString(" ", "separatorMedium"),
						finalSeparator: "" // not used at this length
					};
					break;
					
				case 'long':
					this.components = {
						year: sysres.getString("1#1 yr|#{num} yrs"),
						month: sysres.getString("1#1 mon|#{num} mons"),
						week: sysres.getString("1#1 wk|#{num} wks"),
						day: sysres.getString("1#1 day|#{num} days", "durationLongDays"),
						hour: sysres.getString("1#1 hr|#{num} hrs"),
						minute: sysres.getString("1#1 min|#{num} min"),
						second: sysres.getString("1#1 sec|#{num} sec"),
						millisecond: sysres.getString("#{num} ms"),
						separator: sysres.getString(", ", "separatorLong"),
						finalSeparator: "" // not used at this length
					};
					break;
					
				case 'full':
					this.components = {
						year: sysres.getString("1#1 year|#{num} years"),
						month: sysres.getString("1#1 month|#{num} months"),
						week: sysres.getString("1#1 week|#{num} weeks"),
						day: sysres.getString("1#1 day|#{num} days"),
						hour: sysres.getString("1#1 hour|#{num} hours"),
						minute: sysres.getString("1#1 minute|#{num} minutes"),
						second: sysres.getString("1#1 second|#{num} seconds"),
						millisecond: sysres.getString("1#1 millisecond|#{num} milliseconds"),
						separator: sysres.getString(", ", "separatorFull"),
						finalSeparator: sysres.getString(" and ", "finalSeparatorFull")
					};
					break;
			}
			
			if (this.style === 'clock') {
				new ilib.DateFmt({
					locale: this.locale,
					type: "time",
					time: "ms",
					sync: sync,
					onLoad: ilib.bind(this, function (fmtMS) {
						this.timeFmtMS = fmtMS;
						new ilib.DateFmt({
							locale: this.locale,
							type: "time",
							time: "hm",
							sync: sync,
							onLoad: ilib.bind(this, function (fmtHM) {
								this.timeFmtHM = fmtHM;		
								new ilib.DateFmt({
									locale: this.locale,
									type: "time",
									time: "hms",
									sync: sync,
									onLoad: ilib.bind(this, function (fmtHMS) {
										this.timeFmtHMS = fmtHMS;		

										// munge with the template to make sure that the hours are not formatted mod 12
										this.timeFmtHM.template = this.timeFmtHM.template.replace(/hh?/, 'H');
										this.timeFmtHM.templateArr = this.timeFmtHM._tokenize(this.timeFmtHM.template);
										this.timeFmtHMS.template = this.timeFmtHMS.template.replace(/hh?/, 'H');
										this.timeFmtHMS.templateArr = this.timeFmtHMS._tokenize(this.timeFmtHMS.template);
										
										if (options && typeof(options.onLoad) === 'function') {
											options.onLoad(this);
										}
									})
								});
							})
						});
					})
				});
				return;
			}
			
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
		})
	});
};

/**
 * @private
 * @static
 */
ilib.DurFmt.complist = {
	"text": ["year", "month", "week", "day", "hour", "minute", "second", "millisecond"],
	"clock": ["year", "month", "week", "day"]
};

/**
 * Format a duration according to the format template of this formatter instance.<p>
 * 
 * The components parameter should be an object that contains any or all of these 
 * numeric properties:
 * 
 * <ul>
 * <li>year
 * <li>month
 * <li>week
 * <li>day
 * <li>hour
 * <li>minute
 * <li>second
 * </ul>
 * <p>
 *
 * When a property is left out of the components parameter or has a value of 0, it will not
 * be formatted into the output string, except for times that include 0 minutes and 0 seconds.
 * 
 * This formatter will not ensure that numbers for each component property is within the
 * valid range for that component. This allows you to format durations that are longer
 * than normal range. For example, you could format a duration has being "33 hours" rather
 * than "1 day, 9 hours".
 * 
 * @param {Object} components date/time components to be formatted into a duration string
 * @return {ilib.String} a string with the duration formatted according to the style and 
 * locale set up for this formatter instance. If the components parameter is empty or 
 * undefined, an empty string is returned.
 */
ilib.DurFmt.prototype.format = function (components) {
	var i, list, temp, fmt, secondlast = true, str = "";
	
	list = ilib.DurFmt.complist[this.style];
	//for (i = 0; i < list.length; i++) {
	for (i = list.length-1; i >= 0; i--) {
		//console.log("Now dealing with " + list[i]);
		if (typeof(components[list[i]]) !== 'undefined' && components[list[i]] != 0) {
			if (str.length > 0) {
				str = ((this.length === 'full' && secondlast) ? this.components.finalSeparator : this.components.separator) + str;
				secondlast = false;
			}
			str = this.components[list[i]].formatChoice(components[list[i]], {num: components[list[i]]}) + str;
		}
	}

	if (this.style === 'clock') {
		if (typeof(components.hour) !== 'undefined') {
			fmt = (typeof(components.second) !== 'undefined') ? this.timeFmtHMS : this.timeFmtHM;
		} else {
			fmt = this.timeFmtMS;
		}
				
		if (str.length > 0) {
			str += this.components.separator;
		}
		str += fmt._formatTemplate(components, fmt.templateArr);
	}
	
	return new ilib.String(str);
};

/**
 * Return the locale that was used to construct this duration formatter object. If the
 * locale was not given as parameter to the constructor, this method returns the default
 * locale of the system.
 * 
 * @return {ilib.Locale} locale that this duration formatter was constructed with
 */
ilib.DurFmt.prototype.getLocale = function () {
	return this.locale;
};

/**
 * Return the length that was used to construct this duration formatter object. If the
 * length was not given as parameter to the constructor, this method returns the default
 * length. Valid values are "short", "medium", "long", and "full".
 * 
 * @return {string} length that this duration formatter was constructed with
 */
ilib.DurFmt.prototype.getLength = function () {
	return this.length;
};

/**
 * Return the style that was used to construct this duration formatter object. Returns
 * one of "text" or "clock".
 * 
 * @return {string} style that this duration formatter was constructed with
 */
ilib.DurFmt.prototype.getStyle = function () {
	return this.style;
};

ilib.data.ctype_l = {"Lu":[[65,90],[192,214],[216,222],[256],[258],[260],[262],[264],[266],[268],[270],[272],[274],[276],[278],[280],[282],[284],[286],[288],[290],[292],[294],[296],[298],[300],[302],[304],[306],[308],[310],[313],[315],[317],[319],[321],[323],[325],[327],[330],[332],[334],[336],[338],[340],[342],[344],[346],[348],[350],[352],[354],[356],[358],[360],[362],[364],[366],[368],[370],[372],[374],[376,377],[379],[381],[385,386],[388],[390,391],[393,395],[398,401],[403,404],[406,408],[412,413],[415,416],[418],[420],[422,423],[425],[428],[430,431],[433,435],[437],[439,440],[444],[452],[455],[458],[461],[463],[465],[467],[469],[471],[473],[475],[478],[480],[482],[484],[486],[488],[490],[492],[494],[497],[500],[502,504],[506],[508],[510],[512],[514],[516],[518],[520],[522],[524],[526],[528],[530],[532],[534],[536],[538],[540],[542],[544],[546],[548],[550],[552],[554],[556],[558],[560],[562],[570,571],[573,574],[577],[579,582],[584],[586],[588],[590],[880],[882],[886],[902],[904,906],[908],[910,911],[913,929],[931,939],[975],[978,980],[984],[986],[988],[990],[992],[994],[996],[998],[1000],[1002],[1004],[1006],[1012],[1015],[1017,1018],[1021,1071],[1120],[1122],[1124],[1126],[1128],[1130],[1132],[1134],[1136],[1138],[1140],[1142],[1144],[1146],[1148],[1150],[1152],[1162],[1164],[1166],[1168],[1170],[1172],[1174],[1176],[1178],[1180],[1182],[1184],[1186],[1188],[1190],[1192],[1194],[1196],[1198],[1200],[1202],[1204],[1206],[1208],[1210],[1212],[1214],[1216,1217],[1219],[1221],[1223],[1225],[1227],[1229],[1232],[1234],[1236],[1238],[1240],[1242],[1244],[1246],[1248],[1250],[1252],[1254],[1256],[1258],[1260],[1262],[1264],[1266],[1268],[1270],[1272],[1274],[1276],[1278],[1280],[1282],[1284],[1286],[1288],[1290],[1292],[1294],[1296],[1298],[1300],[1302],[1304],[1306],[1308],[1310],[1312],[1314],[1316],[1318],[1329,1366],[4256,4293],[4295],[4301],[7680],[7682],[7684],[7686],[7688],[7690],[7692],[7694],[7696],[7698],[7700],[7702],[7704],[7706],[7708],[7710],[7712],[7714],[7716],[7718],[7720],[7722],[7724],[7726],[7728],[7730],[7732],[7734],[7736],[7738],[7740],[7742],[7744],[7746],[7748],[7750],[7752],[7754],[7756],[7758],[7760],[7762],[7764],[7766],[7768],[7770],[7772],[7774],[7776],[7778],[7780],[7782],[7784],[7786],[7788],[7790],[7792],[7794],[7796],[7798],[7800],[7802],[7804],[7806],[7808],[7810],[7812],[7814],[7816],[7818],[7820],[7822],[7824],[7826],[7828],[7838],[7840],[7842],[7844],[7846],[7848],[7850],[7852],[7854],[7856],[7858],[7860],[7862],[7864],[7866],[7868],[7870],[7872],[7874],[7876],[7878],[7880],[7882],[7884],[7886],[7888],[7890],[7892],[7894],[7896],[7898],[7900],[7902],[7904],[7906],[7908],[7910],[7912],[7914],[7916],[7918],[7920],[7922],[7924],[7926],[7928],[7930],[7932],[7934],[7944,7951],[7960,7965],[7976,7983],[7992,7999],[8008,8013],[8025],[8027],[8029],[8031],[8040,8047],[8120,8123],[8136,8139],[8152,8155],[8168,8172],[8184,8187],[8450],[8455],[8459,8461],[8464,8466],[8469],[8473,8477],[8484],[8486],[8488],[8490,8493],[8496,8499],[8510,8511],[8517],[8579],[11264,11310],[11360],[11362,11364],[11367],[11369],[11371],[11373,11376],[11378],[11381],[11390,11392],[11394],[11396],[11398],[11400],[11402],[11404],[11406],[11408],[11410],[11412],[11414],[11416],[11418],[11420],[11422],[11424],[11426],[11428],[11430],[11432],[11434],[11436],[11438],[11440],[11442],[11444],[11446],[11448],[11450],[11452],[11454],[11456],[11458],[11460],[11462],[11464],[11466],[11468],[11470],[11472],[11474],[11476],[11478],[11480],[11482],[11484],[11486],[11488],[11490],[11499],[11501],[11506],[42560],[42562],[42564],[42566],[42568],[42570],[42572],[42574],[42576],[42578],[42580],[42582],[42584],[42586],[42588],[42590],[42592],[42594],[42596],[42598],[42600],[42602],[42604],[42624],[42626],[42628],[42630],[42632],[42634],[42636],[42638],[42640],[42642],[42644],[42646],[42786],[42788],[42790],[42792],[42794],[42796],[42798],[42802],[42804],[42806],[42808],[42810],[42812],[42814],[42816],[42818],[42820],[42822],[42824],[42826],[42828],[42830],[42832],[42834],[42836],[42838],[42840],[42842],[42844],[42846],[42848],[42850],[42852],[42854],[42856],[42858],[42860],[42862],[42873],[42875],[42877,42878],[42880],[42882],[42884],[42886],[42891],[42893],[42896],[42898],[42912],[42914],[42916],[42918],[42920],[42922],[65313,65338],[66560,66599],[119808,119833],[119860,119885],[119912,119937],[119964],[119966,119967],[119970],[119973,119974],[119977,119980],[119982,119989],[120016,120041],[120068,120069],[120071,120074],[120077,120084],[120086,120092],[120120,120121],[120123,120126],[120128,120132],[120134],[120138,120144],[120172,120197],[120224,120249],[120276,120301],[120328,120353],[120380,120405],[120432,120457],[120488,120512],[120546,120570],[120604,120628],[120662,120686],[120720,120744],[120778]],"Ll":[[97,122],[181],[223,246],[248,255],[257],[259],[261],[263],[265],[267],[269],[271],[273],[275],[277],[279],[281],[283],[285],[287],[289],[291],[293],[295],[297],[299],[301],[303],[305],[307],[309],[311,312],[314],[316],[318],[320],[322],[324],[326],[328,329],[331],[333],[335],[337],[339],[341],[343],[345],[347],[349],[351],[353],[355],[357],[359],[361],[363],[365],[367],[369],[371],[373],[375],[378],[380],[382,384],[387],[389],[392],[396,397],[402],[405],[409,411],[414],[417],[419],[421],[424],[426,427],[429],[432],[436],[438],[441,442],[445,447],[454],[457],[460],[462],[464],[466],[468],[470],[472],[474],[476,477],[479],[481],[483],[485],[487],[489],[491],[493],[495,496],[499],[501],[505],[507],[509],[511],[513],[515],[517],[519],[521],[523],[525],[527],[529],[531],[533],[535],[537],[539],[541],[543],[545],[547],[549],[551],[553],[555],[557],[559],[561],[563,569],[572],[575,576],[578],[583],[585],[587],[589],[591,659],[661,687],[881],[883],[887],[891,893],[912],[940,974],[976,977],[981,983],[985],[987],[989],[991],[993],[995],[997],[999],[1001],[1003],[1005],[1007,1011],[1013],[1016],[1019,1020],[1072,1119],[1121],[1123],[1125],[1127],[1129],[1131],[1133],[1135],[1137],[1139],[1141],[1143],[1145],[1147],[1149],[1151],[1153],[1163],[1165],[1167],[1169],[1171],[1173],[1175],[1177],[1179],[1181],[1183],[1185],[1187],[1189],[1191],[1193],[1195],[1197],[1199],[1201],[1203],[1205],[1207],[1209],[1211],[1213],[1215],[1218],[1220],[1222],[1224],[1226],[1228],[1230,1231],[1233],[1235],[1237],[1239],[1241],[1243],[1245],[1247],[1249],[1251],[1253],[1255],[1257],[1259],[1261],[1263],[1265],[1267],[1269],[1271],[1273],[1275],[1277],[1279],[1281],[1283],[1285],[1287],[1289],[1291],[1293],[1295],[1297],[1299],[1301],[1303],[1305],[1307],[1309],[1311],[1313],[1315],[1317],[1319],[1377,1415],[7424,7467],[7531,7543],[7545,7578],[7681],[7683],[7685],[7687],[7689],[7691],[7693],[7695],[7697],[7699],[7701],[7703],[7705],[7707],[7709],[7711],[7713],[7715],[7717],[7719],[7721],[7723],[7725],[7727],[7729],[7731],[7733],[7735],[7737],[7739],[7741],[7743],[7745],[7747],[7749],[7751],[7753],[7755],[7757],[7759],[7761],[7763],[7765],[7767],[7769],[7771],[7773],[7775],[7777],[7779],[7781],[7783],[7785],[7787],[7789],[7791],[7793],[7795],[7797],[7799],[7801],[7803],[7805],[7807],[7809],[7811],[7813],[7815],[7817],[7819],[7821],[7823],[7825],[7827],[7829,7837],[7839],[7841],[7843],[7845],[7847],[7849],[7851],[7853],[7855],[7857],[7859],[7861],[7863],[7865],[7867],[7869],[7871],[7873],[7875],[7877],[7879],[7881],[7883],[7885],[7887],[7889],[7891],[7893],[7895],[7897],[7899],[7901],[7903],[7905],[7907],[7909],[7911],[7913],[7915],[7917],[7919],[7921],[7923],[7925],[7927],[7929],[7931],[7933],[7935,7943],[7952,7957],[7968,7975],[7984,7991],[8000,8005],[8016,8023],[8032,8039],[8048,8061],[8064,8071],[8080,8087],[8096,8103],[8112,8116],[8118,8119],[8126],[8130,8132],[8134,8135],[8144,8147],[8150,8151],[8160,8167],[8178,8180],[8182,8183],[8458],[8462,8463],[8467],[8495],[8500],[8505],[8508,8509],[8518,8521],[8526],[8580],[11312,11358],[11361],[11365,11366],[11368],[11370],[11372],[11377],[11379,11380],[11382,11387],[11393],[11395],[11397],[11399],[11401],[11403],[11405],[11407],[11409],[11411],[11413],[11415],[11417],[11419],[11421],[11423],[11425],[11427],[11429],[11431],[11433],[11435],[11437],[11439],[11441],[11443],[11445],[11447],[11449],[11451],[11453],[11455],[11457],[11459],[11461],[11463],[11465],[11467],[11469],[11471],[11473],[11475],[11477],[11479],[11481],[11483],[11485],[11487],[11489],[11491,11492],[11500],[11502],[11507],[11520,11557],[11559],[11565],[42561],[42563],[42565],[42567],[42569],[42571],[42573],[42575],[42577],[42579],[42581],[42583],[42585],[42587],[42589],[42591],[42593],[42595],[42597],[42599],[42601],[42603],[42605],[42625],[42627],[42629],[42631],[42633],[42635],[42637],[42639],[42641],[42643],[42645],[42647],[42787],[42789],[42791],[42793],[42795],[42797],[42799,42801],[42803],[42805],[42807],[42809],[42811],[42813],[42815],[42817],[42819],[42821],[42823],[42825],[42827],[42829],[42831],[42833],[42835],[42837],[42839],[42841],[42843],[42845],[42847],[42849],[42851],[42853],[42855],[42857],[42859],[42861],[42863],[42865,42872],[42874],[42876],[42879],[42881],[42883],[42885],[42887],[42892],[42894],[42897],[42899],[42913],[42915],[42917],[42919],[42921],[43002],[64256,64262],[64275,64279],[65345,65370],[66600,66639],[119834,119859],[119886,119892],[119894,119911],[119938,119963],[119990,119993],[119995],[119997,120003],[120005,120015],[120042,120067],[120094,120119],[120146,120171],[120198,120223],[120250,120275],[120302,120327],[120354,120379],[120406,120431],[120458,120485],[120514,120538],[120540,120545],[120572,120596],[120598,120603],[120630,120654],[120656,120661],[120688,120712],[120714,120719],[120746,120770],[120772,120777],[120779]],"Lt":[[453],[456],[459],[498],[8072,8079],[8088,8095],[8104,8111],[8124],[8140],[8188]],"Lm":[[688,705],[710,721],[736,740],[748],[750],[884],[890],[1369],[1600],[1765,1766],[2036,2037],[2042],[2074],[2084],[2088],[2417],[3654],[3782],[4348],[6103],[6211],[6823],[7288,7293],[7468,7530],[7544],[7579,7615],[8305],[8319],[8336,8348],[11388,11389],[11631],[11823],[12293],[12337,12341],[12347],[12445,12446],[12540,12542],[40981],[42232,42237],[42508],[42623],[42775,42783],[42864],[42888],[43000,43001],[43471],[43632],[43741],[43763,43764],[65392],[65438,65439],[94099,94111]],"Lo":[[170],[186],[443],[448,451],[660],[1488,1514],[1520,1522],[1568,1599],[1601,1610],[1646,1647],[1649,1747],[1749],[1774,1775],[1786,1788],[1791],[1808],[1810,1839],[1869,1957],[1969],[1994,2026],[2048,2069],[2112,2136],[2208],[2210,2220],[2308,2361],[2365],[2384],[2392,2401],[2418,2423],[2425,2431],[2437,2444],[2447,2448],[2451,2472],[2474,2480],[2482],[2486,2489],[2493],[2510],[2524,2525],[2527,2529],[2544,2545],[2565,2570],[2575,2576],[2579,2600],[2602,2608],[2610,2611],[2613,2614],[2616,2617],[2649,2652],[2654],[2674,2676],[2693,2701],[2703,2705],[2707,2728],[2730,2736],[2738,2739],[2741,2745],[2749],[2768],[2784,2785],[2821,2828],[2831,2832],[2835,2856],[2858,2864],[2866,2867],[2869,2873],[2877],[2908,2909],[2911,2913],[2929],[2947],[2949,2954],[2958,2960],[2962,2965],[2969,2970],[2972],[2974,2975],[2979,2980],[2984,2986],[2990,3001],[3024],[3077,3084],[3086,3088],[3090,3112],[3114,3123],[3125,3129],[3133],[3160,3161],[3168,3169],[3205,3212],[3214,3216],[3218,3240],[3242,3251],[3253,3257],[3261],[3294],[3296,3297],[3313,3314],[3333,3340],[3342,3344],[3346,3386],[3389],[3406],[3424,3425],[3450,3455],[3461,3478],[3482,3505],[3507,3515],[3517],[3520,3526],[3585,3632],[3634,3635],[3648,3653],[3713,3714],[3716],[3719,3720],[3722],[3725],[3732,3735],[3737,3743],[3745,3747],[3749],[3751],[3754,3755],[3757,3760],[3762,3763],[3773],[3776,3780],[3804,3807],[3840],[3904,3911],[3913,3948],[3976,3980],[4096,4138],[4159],[4176,4181],[4186,4189],[4193],[4197,4198],[4206,4208],[4213,4225],[4238],[4304,4346],[4349,4680],[4682,4685],[4688,4694],[4696],[4698,4701],[4704,4744],[4746,4749],[4752,4784],[4786,4789],[4792,4798],[4800],[4802,4805],[4808,4822],[4824,4880],[4882,4885],[4888,4954],[4992,5007],[5024,5108],[5121,5740],[5743,5759],[5761,5786],[5792,5866],[5888,5900],[5902,5905],[5920,5937],[5952,5969],[5984,5996],[5998,6000],[6016,6067],[6108],[6176,6210],[6212,6263],[6272,6312],[6314],[6320,6389],[6400,6428],[6480,6509],[6512,6516],[6528,6571],[6593,6599],[6656,6678],[6688,6740],[6917,6963],[6981,6987],[7043,7072],[7086,7087],[7098,7141],[7168,7203],[7245,7247],[7258,7287],[7401,7404],[7406,7409],[7413,7414],[8501,8504],[11568,11623],[11648,11670],[11680,11686],[11688,11694],[11696,11702],[11704,11710],[11712,11718],[11720,11726],[11728,11734],[11736,11742],[12294],[12348],[12353,12438],[12447],[12449,12538],[12543],[12549,12589],[12593,12686],[12704,12730],[12784,12799],[13312,19893],[19968,40908],[40960,40980],[40982,42124],[42192,42231],[42240,42507],[42512,42527],[42538,42539],[42606],[42656,42725],[43003,43009],[43011,43013],[43015,43018],[43020,43042],[43072,43123],[43138,43187],[43250,43255],[43259],[43274,43301],[43312,43334],[43360,43388],[43396,43442],[43520,43560],[43584,43586],[43588,43595],[43616,43631],[43633,43638],[43642],[43648,43695],[43697],[43701,43702],[43705,43709],[43712],[43714],[43739,43740],[43744,43754],[43762],[43777,43782],[43785,43790],[43793,43798],[43808,43814],[43816,43822],[43968,44002],[44032,55203],[55216,55238],[55243,55291],[63744,64109],[64112,64217],[64285],[64287,64296],[64298,64310],[64312,64316],[64318],[64320,64321],[64323,64324],[64326,64433],[64467,64829],[64848,64911],[64914,64967],[65008,65019],[65136,65140],[65142,65276],[65382,65391],[65393,65437],[65440,65470],[65474,65479],[65482,65487],[65490,65495],[65498,65500],[65536,65547],[65549,65574],[65576,65594],[65596,65597],[65599,65613],[65616,65629],[65664,65786],[66176,66204],[66208,66256],[66304,66334],[66352,66368],[66370,66377],[66432,66461],[66464,66499],[66504,66511],[66640,66717],[67584,67589],[67592],[67594,67637],[67639,67640],[67644],[67647,67669],[67840,67861],[67872,67897],[67968,68023],[68030,68031],[68096],[68112,68115],[68117,68119],[68121,68147],[68192,68220],[68352,68405],[68416,68437],[68448,68466],[68608,68680],[69635,69687],[69763,69807],[69840,69864],[69891,69926],[70019,70066],[70081,70084],[71296,71338],[73728,74606],[77824,78894],[92160,92728],[93952,94020],[94032],[110592,110593],[126464,126467],[126469,126495],[126497,126498],[126500],[126503],[126505,126514],[126516,126519],[126521],[126523],[126530],[126535],[126537],[126539],[126541,126543],[126545,126546],[126548],[126551],[126553],[126555],[126557],[126559],[126561,126562],[126564],[126567,126570],[126572,126578],[126580,126583],[126585,126588],[126590],[126592,126601],[126603,126619],[126625,126627],[126629,126633],[126635,126651],[131072,173782],[173824,177972],[177984,178205],[194560,195101]]};
/*
 * ctype.islpha.js - Character type is alphabetic
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ctype.js

// !data ctype_l

/**
 * Return whether or not the first character is alphabetic.<p>
 * 
 * Depends directive: !depends ctype.isalnum.js
 * 
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is alphabetic.
 */
ilib.CType.isAlpha = function (ch) {
	return ilib.CType._inRange(ch, 'Lu', ilib.data.ctype_l) ||
		ilib.CType._inRange(ch, 'Ll', ilib.data.ctype_l) ||
		ilib.CType._inRange(ch, 'Lt', ilib.data.ctype_l) ||
		ilib.CType._inRange(ch, 'Lm', ilib.data.ctype_l) ||
		ilib.CType._inRange(ch, 'Lo', ilib.data.ctype_l);
};

/*
 * ctype.isalnum.js - Character type alphanumeric
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ctype.js ctype.isalpha.js ctype.isdigit.js

/**
 * Return whether or not the first character is alphabetic or numeric.<p>
 * 
 * Depends directive: !depends ctype.isalnum.js
 * 
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is alphabetic or numeric
 */
ilib.CType.isAlnum = function isAlnum(ch) {
	return ilib.CType.isAlpha(ch) || ilib.CType.isDigit(ch);
};

/*
 * ctype.isascii.js - Character type is ASCII
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ctype.js

// !data ctype

/**
 * Return whether or not the first character is in the ASCII range.<p>
 * 
 * Depends directive: !depends ctype.isascii.js
 * 
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is in the ASCII range.
 */
ilib.CType.isAscii = function (ch) {
	return ilib.CType._inRange(ch, 'ascii', ilib.data.ctype);
};

/*
 * ctype.isblank.js - Character type is blank
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ctype.js

// !data ctype

/**
 * Return whether or not the first character is a blank character.<p>
 * 
 * Depends directive: !depends ctype.isblank.js
 * 
 * ie. a space or a tab.
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is a blank character.
 */
ilib.CType.isBlank = function (ch) {
	return ilib.CType._inRange(ch, 'blank', ilib.data.ctype);
};

ilib.data.ctype_c = {"Cn":[[888,889],[895,899],[907],[909],[930],[1320,1328],[1367,1368],[1376],[1416],[1419,1422],[1424],[1480,1487],[1515,1519],[1525,1535],[1541],[1564,1565],[1806],[1867,1868],[1970,1983],[2043,2047],[2094,2095],[2111],[2140,2141],[2143,2207],[2209],[2221,2275],[2303],[2424],[2432],[2436],[2445,2446],[2449,2450],[2473],[2481],[2483,2485],[2490,2491],[2501,2502],[2505,2506],[2511,2518],[2520,2523],[2526],[2532,2533],[2556,2560],[2564],[2571,2574],[2577,2578],[2601],[2609],[2612],[2615],[2618,2619],[2621],[2627,2630],[2633,2634],[2638,2640],[2642,2648],[2653],[2655,2661],[2678,2688],[2692],[2702],[2706],[2729],[2737],[2740],[2746,2747],[2758],[2762],[2766,2767],[2769,2783],[2788,2789],[2802,2816],[2820],[2829,2830],[2833,2834],[2857],[2865],[2868],[2874,2875],[2885,2886],[2889,2890],[2894,2901],[2904,2907],[2910],[2916,2917],[2936,2945],[2948],[2955,2957],[2961],[2966,2968],[2971],[2973],[2976,2978],[2981,2983],[2987,2989],[3002,3005],[3011,3013],[3017],[3022,3023],[3025,3030],[3032,3045],[3067,3072],[3076],[3085],[3089],[3113],[3124],[3130,3132],[3141],[3145],[3150,3156],[3159],[3162,3167],[3172,3173],[3184,3191],[3200,3201],[3204],[3213],[3217],[3241],[3252],[3258,3259],[3269],[3273],[3278,3284],[3287,3293],[3295],[3300,3301],[3312],[3315,3329],[3332],[3341],[3345],[3387,3388],[3397],[3401],[3407,3414],[3416,3423],[3428,3429],[3446,3448],[3456,3457],[3460],[3479,3481],[3506],[3516],[3518,3519],[3527,3529],[3531,3534],[3541],[3543],[3552,3569],[3573,3584],[3643,3646],[3676,3712],[3715],[3717,3718],[3721],[3723,3724],[3726,3731],[3736],[3744],[3748],[3750],[3752,3753],[3756],[3770],[3774,3775],[3781],[3783],[3790,3791],[3802,3803],[3808,3839],[3912],[3949,3952],[3992],[4029],[4045],[4059,4095],[4294],[4296,4300],[4302,4303],[4681],[4686,4687],[4695],[4697],[4702,4703],[4745],[4750,4751],[4785],[4790,4791],[4799],[4801],[4806,4807],[4823],[4881],[4886,4887],[4955,4956],[4989,4991],[5018,5023],[5109,5119],[5789,5791],[5873,5887],[5901],[5909,5919],[5943,5951],[5972,5983],[5997],[6001],[6004,6015],[6110,6111],[6122,6127],[6138,6143],[6159],[6170,6175],[6264,6271],[6315,6319],[6390,6399],[6429,6431],[6444,6447],[6460,6463],[6465,6467],[6510,6511],[6517,6527],[6572,6575],[6602,6607],[6619,6621],[6684,6685],[6751],[6781,6782],[6794,6799],[6810,6815],[6830,6911],[6988,6991],[7037,7039],[7156,7163],[7224,7226],[7242,7244],[7296,7359],[7368,7375],[7415,7423],[7655,7675],[7958,7959],[7966,7967],[8006,8007],[8014,8015],[8024],[8026],[8028],[8030],[8062,8063],[8117],[8133],[8148,8149],[8156],[8176,8177],[8181],[8191],[8293,8297],[8306,8307],[8335],[8349,8351],[8379,8399],[8433,8447],[8586,8591],[9204,9215],[9255,9279],[9291,9311],[9984],[11085,11087],[11098,11263],[11311],[11359],[11508,11512],[11558],[11560,11564],[11566,11567],[11624,11630],[11633,11646],[11671,11679],[11687],[11695],[11703],[11711],[11719],[11727],[11735],[11743],[11836,11903],[11930],[12020,12031],[12246,12271],[12284,12287],[12352],[12439,12440],[12544,12548],[12590,12592],[12687],[12731,12735],[12772,12783],[12831],[13055],[19894,19903],[40909,40959],[42125,42127],[42183,42191],[42540,42559],[42648,42654],[42744,42751],[42895],[42900,42911],[42923,42999],[43052,43055],[43066,43071],[43128,43135],[43205,43213],[43226,43231],[43260,43263],[43348,43358],[43389,43391],[43470],[43482,43485],[43488,43519],[43575,43583],[43598,43599],[43610,43611],[43644,43647],[43715,43738],[43767,43776],[43783,43784],[43791,43792],[43799,43807],[43815],[43823,43967],[44014,44015],[44026,44031],[55204,55215],[55239,55242],[55292,55295],[64110,64111],[64218,64255],[64263,64274],[64280,64284],[64311],[64317],[64319],[64322],[64325],[64450,64466],[64832,64847],[64912,64913],[64968,65007],[65022,65023],[65050,65055],[65063,65071],[65107],[65127],[65132,65135],[65141],[65277,65278],[65280],[65471,65473],[65480,65481],[65488,65489],[65496,65497],[65501,65503],[65511],[65519,65528],[65534,65535],[65548],[65575],[65595],[65598],[65614,65615],[65630,65663],[65787,65791],[65795,65798],[65844,65846],[65931,65935],[65948,65999],[66046,66175],[66205,66207],[66257,66303],[66335],[66340,66351],[66379,66431],[66462],[66500,66503],[66518,66559],[66718,66719],[66730,67583],[67590,67591],[67593],[67638],[67641,67643],[67645,67646],[67670],[67680,67839],[67868,67870],[67898,67902],[67904,67967],[68024,68029],[68032,68095],[68100],[68103,68107],[68116],[68120],[68148,68151],[68155,68158],[68168,68175],[68185,68191],[68224,68351],[68406,68408],[68438,68439],[68467,68471],[68480,68607],[68681,69215],[69247,69631],[69710,69713],[69744,69759],[69826,69839],[69865,69871],[69882,69887],[69941],[69956,70015],[70089,70095],[70106,71295],[71352,71359],[71370,73727],[74607,74751],[74851,74863],[74868,77823],[78895,92159],[92729,93951],[94021,94031],[94079,94094],[94112,110591],[110594,118783],[119030,119039],[119079,119080],[119262,119295],[119366,119551],[119639,119647],[119666,119807],[119893],[119965],[119968,119969],[119971,119972],[119975,119976],[119981],[119994],[119996],[120004],[120070],[120075,120076],[120085],[120093],[120122],[120127],[120133],[120135,120137],[120145],[120486,120487],[120780,120781],[120832,126463],[126468],[126496],[126499],[126501,126502],[126504],[126515],[126520],[126522],[126524,126529],[126531,126534],[126536],[126538],[126540],[126544],[126547],[126549,126550],[126552],[126554],[126556],[126558],[126560],[126563],[126565,126566],[126571],[126579],[126584],[126589],[126591],[126602],[126620,126624],[126628],[126634],[126652,126703],[126706,126975],[127020,127023],[127124,127135],[127151,127152],[127167,127168],[127184],[127200,127231],[127243,127247],[127279],[127340,127343],[127387,127461],[127491,127503],[127547,127551],[127561,127567],[127570,127743],[127777,127791],[127798],[127869,127871],[127892,127903],[127941],[127947,127967],[127985,127999],[128063],[128065],[128248],[128253,128255],[128318,128319],[128324,128335],[128360,128506],[128577,128580],[128592,128639],[128710,128767],[128884,131071],[173783,173823],[177973,177983],[178206,194559],[195102,917504],[917506,917535],[917632,917759],[918000,983039],[1048574,1048575],[1114110,1114111]],"Cc":[[0,31],[127,159]],"Cf":[[173],[1536,1540],[1757],[1807],[8203,8207],[8234,8238],[8288,8292],[8298,8303],[65279],[65529,65531],[69821],[119155,119162],[917505],[917536,917631]],"Co":[[57344,63743],[983040,1048573],[1048576,1114109]],"Cs":[[55296,57343]]};
/*
 * ctype.iscntrl.js - Character type is control character
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ctype.js

// !data ctype_c

/**
 * Return whether or not the first character is a control character.<p>
 * 
 * Depends directive: !depends ctype.iscntrl.js
 * 
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is a control character.
 */
ilib.CType.isCntrl = function (ch) {
	return ilib.CType._inRange(ch, 'Cc', ilib.data.ctype_c);
};

/*
 * ctype.isgraph.js - Character type is graph char
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ctype.js ctype.isspace.js ctype.iscntrl.js

/**
 * Return whether or not the first character is any printable character
 * other than space.<p>
 * 
 * Depends directive: !depends ctype.isgraph.js
 * 
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is any printable character
 * other than space. 
 */
ilib.CType.isGraph = function (ch) {
	return typeof(ch) !== 'undefined' && ch.length > 0 && !ilib.CType.isSpace(ch) && !ilib.CType.isCntrl(ch);
};

/*
 * ctype.js - Character type definitions
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ctype.js

// !data ctype

/**
 * Return whether or not the first character is an ideographic character.<p>
 * 
 * Depends directive: !depends ctype.isideo.js
 * 
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is an ideographic character.
 */
ilib.CType.isIdeo = function (ch) {
	return ilib.CType._inRange(ch, 'cjk', ilib.data.ctype) ||
		ilib.CType._inRange(ch, 'cjkradicals', ilib.data.ctype) ||
		ilib.CType._inRange(ch, 'enclosedcjk', ilib.data.ctype) ||
		ilib.CType._inRange(ch, 'cjkpunct', ilib.data.ctype) ||
		ilib.CType._inRange(ch, 'cjkcompatibility', ilib.data.ctype);
	
};

/*
 * ctype.islower.js - Character type is lower case letter
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ctype.js

// !data ctype_l

/**
 * Return whether or not the first character is lower-case. For alphabetic
 * characters in scripts that do not make a distinction between upper- and 
 * lower-case, this function always returns true.<p>
 * 
 * Depends directive: !depends ctype.islower.js
 * 
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is lower-case.
 */
ilib.CType.isLower = function (ch) {
	return ilib.CType._inRange(ch, 'Ll', ilib.data.ctype_l);
};

/*
 * ctype.isprint.js - Character type is printable char
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ctype.js ctype.iscntrl.js

/**
 * Return whether or not the first character is any printable character,
 * including space.<p>
 * 
 * Depends directive: !depends ctype.isprint.js
 * 
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is printable.
 */
ilib.CType.isPrint = function (ch) {
	return typeof(ch) !== 'undefined' && ch.length > 0 && !ilib.CType.isCntrl(ch);
};

ilib.data.ctype_p = {"Pd":[[45],[1418],[1470],[5120],[6150],[8208,8213],[11799],[11802],[11834,11835],[12316],[12336],[12448],[65073,65074],[65112],[65123],[65293]],"Ps":[[40],[91],[123],[3898],[3900],[5787],[8218],[8222],[8261],[8317],[8333],[9001],[10088],[10090],[10092],[10094],[10096],[10098],[10100],[10181],[10214],[10216],[10218],[10220],[10222],[10627],[10629],[10631],[10633],[10635],[10637],[10639],[10641],[10643],[10645],[10647],[10712],[10714],[10748],[11810],[11812],[11814],[11816],[12296],[12298],[12300],[12302],[12304],[12308],[12310],[12312],[12314],[12317],[64830],[65047],[65077],[65079],[65081],[65083],[65085],[65087],[65089],[65091],[65095],[65113],[65115],[65117],[65288],[65339],[65371],[65375],[65378]],"Pe":[[41],[93],[125],[3899],[3901],[5788],[8262],[8318],[8334],[9002],[10089],[10091],[10093],[10095],[10097],[10099],[10101],[10182],[10215],[10217],[10219],[10221],[10223],[10628],[10630],[10632],[10634],[10636],[10638],[10640],[10642],[10644],[10646],[10648],[10713],[10715],[10749],[11811],[11813],[11815],[11817],[12297],[12299],[12301],[12303],[12305],[12309],[12311],[12313],[12315],[12318,12319],[64831],[65048],[65078],[65080],[65082],[65084],[65086],[65088],[65090],[65092],[65096],[65114],[65116],[65118],[65289],[65341],[65373],[65376],[65379]],"Pc":[[95],[8255,8256],[8276],[65075,65076],[65101,65103],[65343]],"Po":[[33,35],[37,39],[42],[44],[46,47],[58,59],[63,64],[92],[161],[167],[182,183],[191],[894],[903],[1370,1375],[1417],[1472],[1475],[1478],[1523,1524],[1545,1546],[1548,1549],[1563],[1566,1567],[1642,1645],[1748],[1792,1805],[2039,2041],[2096,2110],[2142],[2404,2405],[2416],[2800],[3572],[3663],[3674,3675],[3844,3858],[3860],[3973],[4048,4052],[4057,4058],[4170,4175],[4347],[4960,4968],[5741,5742],[5867,5869],[5941,5942],[6100,6102],[6104,6106],[6144,6149],[6151,6154],[6468,6469],[6686,6687],[6816,6822],[6824,6829],[7002,7008],[7164,7167],[7227,7231],[7294,7295],[7360,7367],[7379],[8214,8215],[8224,8231],[8240,8248],[8251,8254],[8257,8259],[8263,8273],[8275],[8277,8286],[11513,11516],[11518,11519],[11632],[11776,11777],[11782,11784],[11787],[11790,11798],[11800,11801],[11803],[11806,11807],[11818,11822],[11824,11833],[12289,12291],[12349],[12539],[42238,42239],[42509,42511],[42611],[42622],[42738,42743],[43124,43127],[43214,43215],[43256,43258],[43310,43311],[43359],[43457,43469],[43486,43487],[43612,43615],[43742,43743],[43760,43761],[44011],[65040,65046],[65049],[65072],[65093,65094],[65097,65100],[65104,65106],[65108,65111],[65119,65121],[65128],[65130,65131],[65281,65283],[65285,65287],[65290],[65292],[65294,65295],[65306,65307],[65311,65312],[65340],[65377],[65380,65381],[65792,65794],[66463],[66512],[67671],[67871],[67903],[68176,68184],[68223],[68409,68415],[69703,69709],[69819,69820],[69822,69825],[69952,69955],[70085,70088],[74864,74867]],"Pi":[[171],[8216],[8219,8220],[8223],[8249],[11778],[11780],[11785],[11788],[11804],[11808]],"Pf":[[187],[8217],[8221],[8250],[11779],[11781],[11786],[11789],[11805],[11809]]};
/*
 * ctype.ispunct.js - Character type is punctuation
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ctype.js

// !data ctype_p

/**
 * Return whether or not the first character is punctuation.<p>
 * 
 * Depends directive: !depends ctype.isprint.js
 * 
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is punctuation.
 */
ilib.CType.isPunct = function (ch) {
	return ilib.CType._inRange(ch, 'Pd', ilib.data.ctype_p) ||
		ilib.CType._inRange(ch, 'Ps', ilib.data.ctype_p) ||
		ilib.CType._inRange(ch, 'Pe', ilib.data.ctype_p) ||
		ilib.CType._inRange(ch, 'Pc', ilib.data.ctype_p) ||
		ilib.CType._inRange(ch, 'Po', ilib.data.ctype_p) ||
		ilib.CType._inRange(ch, 'Pi', ilib.data.ctype_p) ||
		ilib.CType._inRange(ch, 'Pf', ilib.data.ctype_p);
};

/*
 * ctype.isupper.js - Character type is upper-case letter
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ctype.js

// !data ctype_l

/**
 * Return whether or not the first character is upper-case. For alphabetic
 * characters in scripts that do not make a distinction between upper- and 
 * lower-case, this function always returns true.<p>
 * 
 * Depends directive: !depends ctype.isupper.js
 * 
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is upper-case.
 */
ilib.CType.isUpper = function (ch) {
	return ilib.CType._inRange(ch, 'Lu', ilib.data.ctype_l);
};

/*
 * ctype.isdigit.js - Character type is digit
 * 
 * Copyright © 2012, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends ctype.js

// !data ctype

/**
 * Return whether or not the first character is a hexadecimal digit written
 * in the Latin script. (0-9 or A-F)<p>
 * 
 * Depends directive: !depends ctype.isxdigit.js
 * 
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is a hexadecimal digit written
 * in the Latin script.
 */
ilib.CType.isXdigit = function (ch) {
	return ilib.CType._inRange(ch, 'xdigit', ilib.data.ctype);
};

ilib.data.name = {
	"components": {
		"short": {
			"g": 1,
			"f": 1
		},
		"medium": {
			"g": 1,
			"m": 1,
			"f": 1
		},
		"long": {
			"p": 1,
			"g": 1,
			"m": 1,
			"f": 1
		},
		"full": {
			"p": 1,
			"g": 1,
			"m": 1,
			"f": 1,
			"s": 1
		}
	},
	"format": "{prefix} {givenName} {middleName} {familyName}{suffix}",
	"sortByHeadWord": false,
	"nameStyle": "western",
	"conjunctions": {
		"and1": "and",
		"and2": "and",
		"or1": "or",
		"or2": "or"
	},
	"auxillaries": {
		"mac": 1,
		"mc": 1,

		"von": 1,
		"von der": 1,
		"von den": 1,
		"vom": 1,
		"zu": 1,
		"zum": 1,
		"zur": 1,
		"von und zu": 1,

		"van": 1,
		"van der": 1,
        "van de": 1,
        "van der": 1,
        "van den": 1,
        "de": 1,
        "den": 1,
        "vande": 1,
        "vander": 1,
        
        "di": 1,
	    "de": 1,
	    "da": 1,
	    "della": 1,
		"dalla": 1,
		"la": 1,
		"lo": 1,
		"li": 1, 
		"del": 1,
        
        "des": 1,
        "le": 1,
        "les": 1,
		"du": 1,

        "de la": 1,
        "del": 1,
        "de los": 1,
        "de las": 1,

		"do": 1,
		"abu": 1,
		"ibn": 1,
		"bar": 1,
		"ter": 1,
		"ben": 1,
		"bin": 1
	},
	"prefixes": [
		"doctor",
		"dr",
		"mr",
		"mrs",
		"ms",
		"mister",
		"madame",
		"madamoiselle",
		"miss",
		
		"herr",
		"hr",
		"frau",
		"fr",
		"fraulein",
		"frl",
		
		"monsieur",
		"mssr",
		"mdm",
		"mlle",
		
		"señor",
        "señora",
        "señorita",
        "sr",
        "sra",
        "srta",
        
        "meneer",
        "mevrouw"
	],
	"suffixes": [
		",",
		"junior",
		"jr",
		"senior",
		"sr",
		"i",
		"iii",
		"iii",
		"iv",
		"v",
		"vi",
		"vii",
		"viii",
		"ix",
		"x",
		"2nd",
		"3rd",
		"4th",
		"5th",
		"6th",
		"7th",
		"8th",
		"9th",
		"10th",
		"esq",
		"phd",
		"md",
		"ddm",
		"dds"
	]
}
;
/*
 * nameprs.js - Person name parser
 * 
 * Copyright © 2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends 
ilibglobal.js 
locale.js
util/utils.js 
ctype.isalpha.js 
ctype.isideo.js 
ctype.ispunct.js 
ctype.isspace.js 
*/

// !data name

// notes:
// icelandic given names: http://en.wiktionary.org/wiki/Appendix:Icelandic_given_names
// danish approved given names: http://www.familiestyrelsen.dk/samliv/navne/
// http://www.mentalfloss.com/blogs/archives/59277
// other countries with first name restrictions: Norway, China, New Zealand, Japan, Sweden, Germany, Hungary

/**
 * @class
 * A class to parse names of people. Different locales have different conventions when it
 * comes to naming people.<p>
 * 
 * The options can contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - use the rules and conventions of the given locale in order to parse
 * the name
 * <li><i>style</i> - explicitly use the named style to parse the name. Valid values so 
 * far are "western" and "asian". If this property is not specified, then the style will 
 * be gleaned from the name itself. This class will count the total number of Latin or Asian 
 * characters. If the majority of the characters are in one style, that style will be 
 * used to parse the whole name. 
 * <li><i>order</i> - explicitly use the given order for names. In some locales, such
 * as Russian, names may be written equally validly as "givenName familyName" or "familyName
 * givenName". This option tells the parser which order to prefer, and overrides the 
 * default order for the locale. Valid values are "gf" (given-family) or "fg" (family-given).
 * 
 * <li>onLoad - a callback function to call when the name info is fully 
 * loaded and the name has been parsed. When the onLoad option is given, the name object 
 * will attempt to load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
 * 
 * <li>sync - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * When the parser has completed its parsing, it fills in the fields listed below.<p>
 * 
 * For names that include auxilliary words, such as the family name "van der Heijden", all 
 * of the auxilliary words ("van der") will be included in the field.<p>
 * 
 * For names in Spanish locales, it is assumed that the family name is doubled. That is,
 * a person may have a paternal family name followed by a maternal family name. All
 * family names will be listed in the familyName field as normal, separated by spaces. 
 * When formatting the short version of such names, only the paternal family name will 
 * be used.
 * 
 * Depends directive: !depends nameprs.js
 * 
 * @constructor
 * @dict
 * @param {string|ilib.Name=} name the name to parse
 * @param {Object=} options Options governing the construction of this name instance
 */
ilib.Name = function(name, options) {
	var sync = true;
	
	if (typeof(name) === 'object') {
		// copy constructor
		/**
		 * The prefixes for this name
		 * @type string
		 */
		this.prefix = name.prefix;
		/**
		 * The given (personal) name in this name.
		 * @type string
		 */
		this.givenName = name.givenName;
		/**
		 * The middle names used in this name. If there are multiple middle names, they all 
		 * appear in this field separated by spaces. 
		 * @type string
		 */
		this.middleName = name.middleName;
		/**
		 * The family names in this name. If there are multiple family names, they all 
		 * appear in this field separated by spaces.
		 * @type string
		 */
		this.familyName = name.familyName;
		/**
		 * The suffixes for this name. If there are multiple suffixes, they all 
		 * appear in this field separated by spaces.
		 * @type string
		 */
		this.suffix = name.suffix;
		
		// private properties
		this.locale = name.locale;
		this.style = name.style;
		this.order = name.order;
		return;
	}

	this.loadParams = {};
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		if (options.style && (options.style === "asian" || options.style === "western")) {
			this.style = options.style;
		}
		
		if (options.order && (options.order === "gf" || options.order === "fg")) {
			this.order = options.order;
		}
		
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		if (typeof(options.loadParams) !== 'undefined') {
			this.loadParams = options.loadParams;
		}
	}

	if (!ilib.Name.cache) {
		ilib.Name.cache = {};
	}

	this.locale = this.locale || new ilib.Locale();
	
	ilib.loadData(ilib.Name, this.locale, "name", sync, this.loadParams, ilib.bind(this, function (info) {
		if (!info) {
			info = ilib.data.name;
			var spec = this.locale.getSpec().replace(/-/g, "_");
			ilib.Name.cache[spec] = info;
		}
		this.info = info;
		this._init(name);
		if (options && typeof(options.onLoad) === 'function') {
			options.onLoad(this);
		}
	}));
};

/**
 * @static
 * @protected
 */
ilib.Name._isAsianName = function (name) {
	// the idea is to count the number of asian chars and the number
	// of latin chars. If one is greater than the other, choose
	// that style.
	var asian = 0, latin = 0, i;
	
	if (name && name.length > 0) {
		for (i = 0; i < name.length; i++) {
			if (ilib.CType.isAlpha(name.charAt(i))) {
				latin++;
			} else if (ilib.CType.isIdeo(name.charAt(i))) {
				asian++;
			}
		}
		
		return latin < asian;
	}

	return false;
};

/**
 * @static
 * @protected
 * Return true if any Latin letters are found in the string. Return
 * false if all the characters are non-Latin.
 */
ilib.Name._isEuroName = function(name) {
	var c, 
		n = new ilib.String(name),
		it = n.charIterator();
	
	while (it.hasNext()) {
		c = it.next();
		
		if (!ilib.CType.isIdeo(c) && 
			 !ilib.CType.isPunct(c) &&
			 !ilib.CType.isSpace(c)) {
			return true;
		}
	}
	
	return false;
};

ilib.Name.prototype = {
    /**
     * @protected
     */
    _init: function (name) {
    	var parts, prefixArray, prefix, prefixLower,
			suffixArray, suffix, suffixLower,
			asianName, i, info, hpSuffix;

    	if (name) {
    		// for DFISH-12905, pick off the part that the LDAP server automatically adds to our names in HP emails
    		i = name.search(/\s*[,\(\[\{<]/);
    		if (i !== -1) {
    			hpSuffix = name.substring(i);
    			hpSuffix = hpSuffix.replace(/\s+/g, ' ');	// compress multiple whitespaces
    			suffixArray = hpSuffix.split(" ");
    			var conjunctionIndex = this._findLastConjunction(suffixArray);
    			if (conjunctionIndex > -1) {
    				// it's got conjunctions in it, so this is not really a suffix
    				hpSuffix = undefined;
    			} else {
    				name = name.substring(0,i);
    			}
    		}
    		
    		if (this.info.nameStyle === "asian") {
    			asianName = !ilib.Name._isEuroName(name);
    			info = asianName ? this.info : ilib.data.name;
    		} else {
    			asianName = ilib.Name._isAsianName(name);
	    		info = asianName ? ilib.data.name : this.info;
    		}
    		
    		if (asianName) {
    			// all-asian names
    			name = name.replace(/\s+/g, '');	// eliminate all whitespaces
    			parts = name.trim().split('');
    		} else {
    			name = name.replace(/, /g, ' , ');
    			name = name.replace(/\s+/g, ' ');	// compress multiple whitespaces
    			parts = name.trim().split(' ');
    		}
    		
    		// check for prefixes
    		if (parts.length > 1) {
    			for (i = parts.length; i > 0; i--) {
    				prefixArray = parts.slice(0, i);
    				prefix = prefixArray.join(asianName ? '' : ' ');
    				prefixLower = prefix.toLowerCase();
    				prefixLower = prefixLower.replace(/[,\.]/g, '');  // ignore commas and periods
    			
    				if (info.prefixes && info.prefixes.indexOf(prefixLower) > -1) {
    					if (this.prefix) {
    						if (!asianName) {
    							this.prefix += ' ';
    						} 
    						this.prefix += prefix;
    					} else {
    						this.prefix = prefix;
    					}
    					parts = parts.slice(i);
    					i = parts.length;
    				}
    			}
    		}
    		
    		// check for suffixes
    		if (parts.length > 1) {
    			for (i = parts.length; i > 0; i--) {
    				suffixArray = parts.slice(-i);
    				suffix = suffixArray.join(asianName ? '' : ' ');
    				suffixLower = suffix.toLowerCase();
    				suffixLower = suffixLower.replace(/[\.]/g, '');  // ignore periods
    				
    				if (info.suffixes && info.suffixes.indexOf(suffixLower) > -1) {
    					if (this.suffix) {
    						if (!asianName && !ilib.CType.isPunct(this.suffix.charAt(0))) {
    							this.suffix = ' ' + this.suffix;
    						}
    						this.suffix = suffix + this.suffix;
    					} else {
    						this.suffix = suffix;
    					}
    					parts = parts.slice(0, parts.length-i);
    					i = parts.length;
    				}
    			}
    		}
    		
    		if (hpSuffix) {
    			this.suffix = (this.suffix && this.suffix + hpSuffix) || hpSuffix;
    		}

    		// adjoin auxillary words to their headwords
    		if (parts.length > 1 && !asianName ) {
    			parts = this._joinAuxillaries(parts, asianName);
    		}
    		
    		if (asianName) {
    			this._parseAsianName(parts);
    		} else {
    			this._parseWesternName(parts);
    		}
    		
    		this._joinNameArrays();
    	}
    },
    
	/**
	 * @return {number} 
	 *
	_findSequence: function(parts, hash, isAsian) {
		var sequence, sequenceLower, sequenceArray, aux = [], i, ret = {};
		
		if (parts.length > 0 && hash) {
			//console.info("_findSequence: finding sequences");
			for (var start = 0; start < parts.length-1; start++) {
				for ( i = parts.length; i > start; i-- ) {
					sequenceArray = parts.slice(start, i);
					sequence = sequenceArray.join(isAsian ? '' : ' ');
					sequenceLower = sequence.toLowerCase();
					sequenceLower = sequenceLower.replace(/[,\.]/g, '');  // ignore commas and periods
					
					//console.info("_findSequence: checking sequence: '" + sequenceLower + "'");
					
					if ( sequenceLower in hash ) {
						ret.match = sequenceArray;
						ret.start = start;
						ret.end = i;
						return ret;
						//console.info("_findSequence: Found sequence '" + sequence + "' New parts list is " + JSON.stringify(parts));
					}
				}
			}
		}
	
		return undefined;
	},
	*/
	
	/**
	 * @protected
	 */
	_findPrefix: function (parts, names, isAsian) {
		var i, prefix, prefixLower, prefixArray, aux = [];
		
		if (parts.length > 0 && names) {
			for (i = parts.length; i > 0; i--) {
				prefixArray = parts.slice(0, i);
				prefix = prefixArray.join(isAsian ? '' : ' ');
				prefixLower = prefix.toLowerCase();
				prefixLower = prefixLower.replace(/[,\.]/g, '');  // ignore commas and periods
				
				if (prefixLower in names) {
					aux = aux.concat(isAsian ? prefix : prefixArray);
					parts = parts.slice(i);
					i = parts.length + 1;
				}
			}
		}
		
		return aux;
	},

	/**
	 * @protected
	 */
	_findSuffix: function (parts, names, isAsian) {
		var i, j, seq = "";
		
		for (i = 0; i < names.length; i++) {
			if (parts.length >= names[i].length) {
				j = 0;
				while (j < names[i].length && parts[parts.length-j] === names[i][names[i].length-j]) {
					j++;
				}
				if (j >= names[i].length) {
					seq = parts.slice(parts.length-j).join(isAsian ? "" : " ") + (isAsian ? "" : " ") + seq;
					parts = parts.slice(0, parts.length-j);
					i = -1; // restart the search
				}
			}
		}

		this.suffix = seq;
		return parts;
	},

	/**
	 * @protected
	 * Find the last instance of 'and' in the name
	 * @param {Array.<string>} parts
	 * @return {number}
	 */
	_findLastConjunction: function _findLastConjunction(parts) {
		var conjunctionIndex = -1, index, part;
		
		for (index = 0; index < parts.length; index++) {
			part = parts[index];
			if (typeof(part) === 'string') {
				part = part.toLowerCase();
				// also recognize English
				if ("and" === part || "or" === part || "&" === part || "+" === part) {
					conjunctionIndex = index;
				}
				if (this.info.conjunctions.and1 === part || 
					this.info.conjunctions.and2 === part || 
					this.info.conjunctions.or1 === part ||
					this.info.conjunctions.or2 === part || 
					("&" === part) || 
					("+" === part)) {
					conjunctionIndex = index;
				}
			}
		}
		return conjunctionIndex;
	},

	/**
	 * @protected
	 * @param {Array.<string>} parts the current array of name parts
	 * @param {boolean} isAsian true if the name is being parsed as an Asian name
	 * @return {Array.<string>} the remaining parts after the prefixes have been removed
	 */
	_extractPrefixes: function (parts, isAsian) {
		var i = this._findPrefix(parts, this.info.prefixes, isAsian);
		if (i > 0) {
			this.prefix = parts.slice(0, i).join(isAsian ? "" : " ");
			return parts.slice(i);
		}
		// prefixes not found, so just return the array unmodified
		return parts;
	},

	/**
	 * @protected
	 * @param {Array.<string>} parts the current array of name parts
	 * @param {boolean} isAsian true if the name is being parsed as an Asian name
	 * @return {Array.<string>} the remaining parts after the suffices have been removed
	 */
	_extractSuffixes: function (parts, isAsian) {
		var i = this._findSuffix(parts, this.info.suffixes, isAsian);
		if (i > 0) {
			this.suffix = parts.slice(i).join(isAsian ? "" : " ");
			return parts.slice(0,i);
		}
		// suffices not found, so just return the array unmodified
		return parts;
	},
	
	/**
	 * @protected
	 * Adjoin auxillary words to their head words.
	 * @param {Array.<string>} parts the current array of name parts
	 * @param {boolean} isAsian true if the name is being parsed as an Asian name
	 * @return {Array.<string>} the parts after the auxillary words have been plucked onto their head word
	 */
	_joinAuxillaries: function (parts, isAsian) {
		var start, i, prefixArray, prefix, prefixLower;
		
		if (this.info.auxillaries && (parts.length > 2 || this.prefix)) {
			for (start = 0; start < parts.length-1; start++) {
				for (i = parts.length; i > start; i--) {
					prefixArray = parts.slice(start, i);
					prefix = prefixArray.join(' ');
					prefixLower = prefix.toLowerCase();
					prefixLower = prefixLower.replace(/[,\.]/g, '');  // ignore commas and periods
					
					if (prefixLower in this.info.auxillaries) {
						parts.splice(start, i+1-start, prefixArray.concat(parts[i]));
						i = start;
					}
				}
			}
		}
		
		return parts;
	},

	/**
	 * @protected
	 * Recursively join an array or string into a long string.
	 */
	_joinArrayOrString: function _joinArrayOrString(part) {
		var i;
		if (typeof(part) === 'object') {
			for (i = 0; i < part.length; i++) {
				part[i] = this._joinArrayOrString(part[i]);
			}
			var ret = "";
			part.forEach(function (segment) {
				if (ret.length > 0 && !ilib.CType.isPunct(segment.charAt(0))) {
					ret += ' ';
				}
				ret += segment;
			});
			return ret;
		}
		return part;
	},
	
	/**
	 * @protected
	 */
	_joinNameArrays: function _joinNameArrays() {
		var prop;
		for (prop in this) {
			if (this[prop] !== undefined && typeof(this[prop]) === 'object' && this[prop] instanceof Array) {
				this[prop] = this._joinArrayOrString(this[prop]);
			}
		}
	},

	/**
	 * @protected
	 */
	_parseAsianName: function (parts) {
		var familyNameArray = this._findPrefix(parts, this.info.knownFamilyNames, true);
		
		if (familyNameArray && familyNameArray.length > 0) {
			this.familyName = familyNameArray.join('');
			this.givenName = parts.slice(this.familyName.length).join('');
		} else if (this.suffix || this.prefix) {
			this.familyName = parts.join('');
		} else {
			this.givenName = parts.join('');
		}
	},
	
	/**
	 * @protected
	 */
	_parseSpanishName: function (parts) {
		var conjunctionIndex;
		
		if (parts.length === 1) {
			if (this.prefix || typeof(parts[0]) === 'object') {
				this.familyName = parts[0];
			} else {
				this.givenName = parts[0];
			}
		} else if (parts.length === 2) {
			// we do G F
			this.givenName = parts[0];
			this.familyName = parts[1];
		} else if (parts.length === 3) {
			conjunctionIndex = this._findLastConjunction(parts);
			// if there's an 'and' in the middle spot, put everything in the first name
			if (conjunctionIndex === 1) {
				this.givenName = parts;
			} else {
				// else, do G F F
				this.givenName = parts[0];
				this.familyName = parts.slice(1);
			}
		} else if (parts.length > 3) {
			//there are at least 4 parts to this name
			
			conjunctionIndex = this._findLastConjunction(parts);
			if (conjunctionIndex > 0) {
				// if there's a conjunction that's not the first token, put everything up to and 
				// including the token after it into the first name, the last 2 tokens into
				// the family name (if they exist) and everything else in to the middle name
				// 0 1 2 3 4 5
				// G A G
				// G A G F
				// G G A G
				// G A G F F
				// G G A G F
				// G G G A G
				// G A G M F F
				// G G A G F F
				// G G G A G F
				// G G G G A G
				this.givenName = parts.splice(0,conjunctionIndex+2);
				if (parts.length > 1) {
					this.familyName = parts.splice(parts.length-2, 2);
					if ( parts.length > 0 ) {
						this.middleName = parts;
					}
				} else if (parts.length === 1) {
					this.familyName = parts[0];
				}
			} else {
				this.givenName = parts.splice(0,1);
				this.familyName = parts.splice(parts.length-2, 2);
				this.middleName = parts;
			}
		}
	},

	/**
	 * @protected
	 */
	_parseWesternName: function (parts) {
		if (this.locale.getLanguage() === "es") {
			// in spain and mexico, we parse names differently than in the rest of the world 
			// because of the double family names
			this._parseSpanishName(parts);
		} else if (this.locale.getLanguage() === "ru") {
			/*
			 * In Russian, names can be given equally validly as given-family 
			 * or family-given. Use the value of the "order" property of the
			 * constructor options to give the default when the order is ambiguous.
			 */
			// TODO: this._parseRussianName(parts);
		} else {
			/* Western names are parsed as follows, and rules are applied in this 
			 * order:
			 * 
			 * G
			 * G F
			 * G M F
			 * G M M F
			 * P F
			 * P G F 
			 */
			var conjunctionIndex;
			
			if (parts.length === 1) {
				if (this.prefix || typeof(parts[0]) === 'object') {
					// already has a prefix, so assume it goes with the family name like "Dr. Roberts" or
					// it is a name with auxillaries, which is almost always a family name
					this.familyName = parts[0];
				} else {
					this.givenName = parts[0];
				}
			} else if (parts.length === 2) {
				// we do G F
				this.givenName = parts[0];
				this.familyName = parts[1];
			} else if (parts.length >= 3) {
				//find the first instance of 'and' in the name
				conjunctionIndex = this._findLastConjunction(parts);
		
				if (conjunctionIndex > 0) {
					// if there's a conjunction that's not the first token, put everything up to and 
					// including the token after it into the first name, the last token into
					// the family name (if it exists) and everything else in to the middle name
					// 0 1 2 3 4 5
					// G A G M M F
					// G G A G M F
					// G G G A G F
					// G G G G A G
					this.givenName = parts.slice(0,conjunctionIndex+2);
					if (conjunctionIndex + 1 < parts.length - 1) {
						this.familyName = parts.splice(parts.length-1, 1);
						if (conjunctionIndex + 2 < parts.length - 1) {
							this.middleName = parts.slice(conjunctionIndex + 2, parts.length - conjunctionIndex - 3);
						}
					}
				} else {
					this.givenName = parts[0];
					this.middleName = parts.slice(1, parts.length-1);
					this.familyName = parts[parts.length-1];
				}
			}
		}
	},

	/**
	 * When sorting names with auxiliary words (like "van der" or "de los"), determine
	 * which is the "head word" and return a string that can be easily sorted by head
	 * word. In English, names are always sorted by initial characters. In places like
	 * the Netherlands or Germany, family names are sorted by the head word of a list
	 * of names rather than the first element of that name.
	 * @return {string|undefined} a string containing the family name[s] to be used for sorting
	 * in the current locale, or undefined if there is no family name in this object
	 */
	getSortFamilyName: function() {
		var name,
			auxillaries, 
			auxString, 
			parts,
			i;
		
		// no name to sort by
		if (!this.familyName) {
			return undefined;
		}
		
		// first break the name into parts
		if (this.info) {
			if (this.info.sortByHeadWord) {
				if (typeof(this.familyName) === 'string') {
					name = this.familyName.replace(/\s+/g, ' ');	// compress multiple whitespaces
					parts = name.trim().split(' ');
				} else {
					// already split
					parts = /** @type Array */ this.familyName;
				}
				
				auxillaries = this._findPrefix(parts, this.info.auxillaries, false);
				if (auxillaries && auxillaries.length > 0) {
					if (typeof(this.familyName) === 'string') {
						auxString = auxillaries.join(' ');
						name = this.familyName.substring(auxString.length+1) + ', ' + auxString;
					} else {
						name = parts.slice(auxillaries.length).join(' ') + 
							', ' + 
							parts.slice(0,auxillaries.length).join(' ');
					}
				}
			} else if (this.info.knownFamilyNames && this.familyName) {
				parts = this.familyName.split('');
				var familyNameArray = this._findPrefix(parts, this.info.knownFamilyNames, true);
				name = "";
				for (i = 0; i < familyNameArray.length; i++) {
					name += (this.info.knownFamilyNames[familyNameArray[i]] || "");
				}
			}
		}
	
		return name || this.familyName;
	},
	
	getHeadFamilyName: function() {
	},
	
	/** 
	 * @protected
	 * Return a shallow copy of the current instance.
	 */
	clone: function () {
		var other = new ilib.Name();
		ilib.shallowCopy(this, other);
		return other;
	}
};


/*
 * namefmt.js - Format person names for display
 * 
 * Copyright © 2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends 
ilibglobal.js
locale.js
strings.js
nameprs.js
ctype.ispunct.js
*/

// !data name

/**
 * @class
 * Creates a formatter that can format person name instances (ilib.Name) for display to
 * a user. The options may contain the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - Use the conventions of the given locale to construct the name format. 
 * <li><i>style</i> - Format the name with the given style. The value of this property
 * should be one of the following strings: 
 *   <ul>
 *     <li><i>short</i> - Format a short name with just the given and family names.
 *     <li><i>medium</i> - Format a medium-length name with the given, middle, and family names.
 *     <li><i>long</i> - Format a long name with all names available in the given name object, including
 *     prefixes and suffixes.
 *   </ul>
 * <li><i>components</i> - Format the name with the given components in the correct
 * order for those components. Components are encoded as a string of letters representing
 * the desired components:
 *   <ul>
 *     <li><i>p</i> - prefixes
 *     <li><i>g</i> - given name
 *     <li><i>m</i> - middle names
 *     <li><i>f</i> - family name
 *     <li><i>s</i> - suffixes
 *   </ul>
 * <p>
 * 
 * For example, the string "pf" would mean to only format any prefixes and family names 
 * together and leave out all the other parts of the name.<p>
 * 
 * The components can be listed in any order in the string. The <i>components</i> option 
 * overrides the <i>style</i> option if both are specified.
 *
 * <li>onLoad - a callback function to call when the locale info object is fully 
 * loaded. When the onLoad option is given, the localeinfo object will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
 * 
 * <li>sync - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * Formatting names is a locale-dependent function, as the order of the components 
 * depends on the locale. The following explains some of the details:<p>
 * 
 * <ul>
 * <li>In Western countries, the given name comes first, followed by a space, followed 
 * by the family name. In Asian countries, the family name comes first, followed immediately
 * by the given name with no space. But, that format is only used with Asian names written
 * in ideographic characters. In Asian countries, especially ones where both an Asian and 
 * a Western language are used (Hong Kong, Singapore, etc.), the convention is often to 
 * follow the language of the name. That is, Asian names are written in Asian style, and 
 * Western names are written in Western style. This class follows that convention as
 * well. 
 * <li>In other Asian countries, Asian names
 * written in Latin script are written with Asian ordering. eg. "Xu Ping-an" instead
 * of the more Western order "Ping-an Xu", as the order is thought to go with the style
 * that is appropriate for the name rather than the style for the language being written.
 * <li>In some Spanish speaking countries, people often take both their maternal and
 * paternal last names as their own family name. When formatting a short or medium style
 * of that family name, only the paternal name is used. In the long style, all the names
 * are used. eg. "Juan Julio Raul Lopez Ortiz" took the name "Lopez" from his father and 
 * the name "Ortiz" from his mother. His family name would be "Lopez Ortiz". The formatted
 * short style of his name would be simply "Juan Lopez" which only uses his paternal
 * family name of "Lopez".
 * <li>In many Western languages, it is common to use auxillary words in family names. For
 * example, the family name of "Ludwig von Beethoven" in German is "von Beethoven", not 
 * "Beethoven". This class ensures that the family name is formatted correctly with 
 * all auxillary words.   
 * </ul>
 * 
 * Depends directive: !depends namefmt.js
 * 
 * @constructor
 * @param {Object} options A set of options that govern how the formatter will behave
 */
ilib.NameFmt = function(options) {
	var sync = true;
	
	this.style = "short";
	this.loadParams = {};
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		if (options.style) {
			this.style = options.style;
		}
		
		if (options.components) {
			this.components = options.components;
		}
		
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		if (typeof(options.loadParams) !== 'undefined') {
			this.loadParams = options.loadParams;
		}
	}
	
	// set up defaults in case we need them
	this.defaultEuroTemplate = new ilib.String("{prefix} {givenName} {middleName} {familyName}{suffix}");
	this.defaultAsianTemplate = new ilib.String("{prefix}{familyName}{givenName}{middleName}{suffix}");
	this.useFirstFamilyName = false;

	switch (this.style) {
		default:
		case "s":
		case "short":
			this.style = "short";
			break;
		case "m":
		case "medium":
			this.style = "medium";
			break;
		case "l":
		case "long":
			this.style = "long";
			break;
		case "f":
		case "full":
			this.style = "full";
			break;
	}

	if (!ilib.Name.cache) {
		ilib.Name.cache = {};
	}

	this.locale = this.locale || new ilib.Locale();
	
	ilib.loadData(ilib.Name, this.locale, "name", sync, this.loadParams, ilib.bind(this, function (info) {
		if (!info) {
			info = ilib.data.name;
			var spec = this.locale.getSpec().replace(/-/g, "_");
			ilib.Name.cache[spec] = info;
		}
		this.info = info;
		this._init();
		if (options && typeof(options.onLoad) === 'function') {
			options.onLoad(this);
		}
	}));
};

ilib.NameFmt.prototype = {
	/**                          
	 * @protected
	 */
	_init: function() {
		if (this.components) {
			var valids = {"p":1,"g":1,"m":1,"f":1,"s":1},
				arr = this.components.split("");
			this.comps = {};
			for (var i = 0; i < arr.length; i++) {
				if (valids[arr[i].toLowerCase()]) {
					this.comps[arr[i].toLowerCase()] = true;
				}
			}
		} else {
			this.comps = this.info.components[this.style];
		}

		this.template = new ilib.String(this.info.format);
		
		if (this.locale.language === "es" && (this.style !== "long" && this.style !== "full")) {
			this.useFirstFamilyName = true;	// in spanish, they have 2 family names, the maternal and paternal
		}

		this.isAsianLocale = (this.info.nameStyle === "asian");
	},

	/**
	 * @protected
	 * adjoin auxillary words to their head words
	 */
	_adjoinAuxillaries: function (parts, namePrefix) {
		var start, i, prefixArray, prefix, prefixLower;
		
		//console.info("_adjoinAuxillaries: finding and adjoining aux words in " + parts.join(' '));
		
		if ( this.info.auxillaries && (parts.length > 2 || namePrefix) ) {
			for ( start = 0; start < parts.length-1; start++ ) {
				for ( i = parts.length; i > start; i-- ) {
					prefixArray = parts.slice(start, i);
					prefix = prefixArray.join(' ');
					prefixLower = prefix.toLowerCase();
					prefixLower = prefixLower.replace(/[,\.]/g, '');  // ignore commas and periods
					
					//console.info("_adjoinAuxillaries: checking aux prefix: '" + prefixLower + "' which is " + start + " to " + i);
					
					if ( prefixLower in this.info.auxillaries ) {
						//console.info("Found! Old parts list is " + JSON.stringify(parts));
						parts.splice(start, i+1-start, prefixArray.concat(parts[i]));
						//console.info("_adjoinAuxillaries: Found! New parts list is " + JSON.stringify(parts));
						i = start;
					}
				}
			}
		}
		
		//console.info("_adjoinAuxillaries: done. Result is " + JSON.stringify(parts));

		return parts;
	},

	/**
	 * Return the locale for this formatter instance.
	 * @return {ilib.Locale} the locale instance for this formatter
	 */
	getLocale: function () {
		return this.locale;
	},
	
	/**
	 * Return the style of names returned by this formatter
	 * @return {string} the style of names returned by this formatter
	 */
	getStyle: function () {
		return this.style;
	},
	
	/**
	 * Return the list of components used to format names in this formatter
	 * @return {string} the list of components
	 */
	getComponents: function () {
		return this.components;
	},
	
	/**
	 * Format the name for display in the current locale with the options set up
	 * in the constructor of this formatter instance.<p>
	 * 
	 * If the name does not contain all the parts required for the style, those parts
	 * will be left blank.<p>
	 * 
	 * There are two basic styles of formatting: European, and Asian. If this formatter object
	 * is set for European style, but an Asian name is passed to the format method, then this
	 * method will format the Asian name with a generic Asian template. Similarly, if the
	 * formatter is set for an Asian style, and a European name is passed to the format method,
	 * the formatter will use a generic European template.<p>
	 * 
	 * This means it is always safe to format any name with a formatter for any locale. You should
	 * always get something at least reasonable as output.<p>
	 * 
	 * @param {ilib.Name} name the name to format
	 * @return {string|undefined} the name formatted according to the style of this formatter instance
	 */
	format: function(name) {
		var formatted, temp, modified, isAsianName;
		
		if (!name || typeof(name) !== 'object') {
			return undefined;
		}
		
		if ((!name.givenName || ilib.Name._isEuroName(name.givenName)) &&
				 (!name.middleName || ilib.Name._isEuroName(name.middleName)) &&
				 (!name.familyName || ilib.Name._isEuroName(name.familyName))) {
			isAsianName = false;	// this is a euro name, even if the locale is asian
			modified = name.clone();
			
			// handle the case where there is no space if there is punctuation in the suffix like ", Phd". 
			// Otherwise, put a space in to transform "PhD" to " PhD"
			/*
			console.log("suffix is " + modified.suffix);
			if ( modified.suffix ) {
				console.log("first char is " + modified.suffix.charAt(0));
				console.log("isPunct(modified.suffix.charAt(0)) is " + ilib.CType.isPunct(modified.suffix.charAt(0)));
			}
			*/
			if (modified.suffix && ilib.CType.isPunct(modified.suffix.charAt(0)) === false) {
				modified.suffix = ' ' + modified.suffix; 
			}
			
			if (this.useFirstFamilyName && name.familyName) {
				var familyNameParts = modified.familyName.trim().split(' ');
				if (familyNameParts.length > 1) {
					familyNameParts = this._adjoinAuxillaries(familyNameParts, name.prefix);
				}	//in spain and mexico, we parse names differently than in the rest of the world
	
				modified.familyName = familyNameParts[0];
			}
		
			modified._joinNameArrays();
		} else {
			isAsianName = true;
			modified = name;
		}
		
		if (!this.template || isAsianName !== this.isAsianLocale) {
			temp = isAsianName ? this.defaultAsianTemplate : this.defaultEuroTemplate;
		} else {
			temp = this.template;
		}
		
		var parts = {
			prefix: this.comps["p"] && modified.prefix || "",
			givenName: this.comps["g"] && modified.givenName || "",
			middleName: this.comps["m"] && modified.middleName || "",
			familyName: this.comps["f"] && modified.familyName || "",
			suffix: this.comps["s"] && modified.suffix || ""
		};
		
		formatted = temp.format(parts);
		return formatted.replace(/\s+/g, ' ').trim();
	}
};

ilib.data.address = {};
ilib.data.countries = {"afghanistan":"AF","aland islands":"AX","åland islands":"AX","albania":"AL","algeria":"DZ","american samoa":"AS","andorra":"AD","angola":"AO","anguilla":"AI","antigua and barbuda":"AG","antigua & barbuda":"AG","antigua":"AG","barbuda":"AG","argentina":"AR","armenia":"AM","aruba":"AW","australia":"AU","austria":"AT","azerbaijan":"AZ","bahamas":"BS","the bahamas":"BS","bahrain":"BH","bangladesh":"BD","barbados":"BB","belarus":"BY","belgium":"BE","belize":"BZ","benin":"BJ","bermuda":"BM","bhutan":"BT","bolivia, plurinational state of":"BO","plurinational state of bolivia":"BO","bolivia":"BO","bosnia and herzegovina":"BA","bosnia & herzegovina":"BA","bosnia":"BA","herzegovina":"BA","botswana":"BW","bouvet island":"BV","brazil":"BR","british indian ocean territory":"IO","brunei darussalam":"BN","brunei":"BN","bulgaria":"BG","burkina faso":"BF","burundi":"BI","cambodia":"KH","cameroon":"CM","canada":"CA","cape verde":"CV","cape verde islands":"CV","cayman islands":"KY","caymans":"KY","central african republic":"CF","c.a.r.":"CF","car":"CF","chad":"TD","chile":"CL","people's republic of china":"CN","republic of china":"TW","p. r. of china":"CN","p. r. china":"CN","p.r. of china":"CN","pr china":"CN","R.O.C.":"TW","ROC":"TW","prc":"CN","china":"CN","christmas island":"CX","cocos (keeling) islands":"CC","cocos islands":"CC","cocos and keeling islands":"CC","cocos & keeling islands":"CC","colombia":"CO","comoros":"KM","congo":"CD","congo, the democratic republic of the":"CD","congo, democratic republic of the":"CD","the democratic republic of the congo":"CD","democratic republic of the congo":"CD","drc":"CD","cook islands":"CK","costa rica":"CR","cote d'ivoire":"CI","côte d'ivoire":"CI","ivory coast":"CI","croatia":"HR","cuba":"CU","cyprus":"CY","the czech republic":"CZ","czech republic":"CZ","denmark":"DK","djibouti":"DJ","dominica":"DM","dominican republic":"DO","d.r.":"DO","dr":"DO","ecuador":"EC","egypt":"EG","el salvador":"SV","equatorial guinea":"GQ","eritrea":"ER","estonia":"EE","ethiopia":"ET","falkland islands":"FK","falklands":"FK","malvinas":"FK","faroe islands":"FO","faroes":"FO","fiji":"FJ","finland":"FI","france":"FR","french guiana":"GF","french polynesia":"PF","polynesia":"PF","french southern territories":"TF","gabon":"GA","gabonese republic":"GA","gambia":"GM","republic of the gambia":"GM","georgia":"GE","germany":"DE","ghana":"GH","gibraltar":"GI","greece":"GR","greenland":"GL","grenada":"GD","guadeloupe":"GP","guam":"GU","guatemala":"GT","guernsey":"GG","guinea":"GN","guinea-bissau":"GW","republic of guinea-bissau":"GW","guyana":"GY","cooperative republic of guyana":"GY","haiti":"HT","heard island and mcdonald islands":"HM","heard island & mcdonald islands":"HM","heard and mcdonald islands":"HM","heard island":"HM","mcdonald islands":"HM","holy see":"VA","vatican city state":"VA","vatican city":"VA","vatican":"VA","honduras":"HN","hong kong":"HK","hungary":"HU","iceland":"IS","india":"IN","indonesia":"ID","iran, islamic republic of":"IR","islamic republic of iran":"IR","iran":"IR","iraq":"IQ","republic of ireland":"IE","ireland":"IE","éire":"IE","isle of man":"IM","israel":"IL","italy":"IT","jamaica":"JM","japan":"JP","jersey":"JE","jordan":"JO","kazakhstan":"KZ","kenya":"KE","republic of kenya":"KE","kiribati":"KI","korea, democratic people's republic of":"KP","democratic people's republic of korea":"KP","dprk":"KP","north korea":"KP","korea, republic of":"KR","republic of korea":"KR","south korea":"KR","korea":"KR","kuwait":"KW","kyrgyzstan":"KG","lao people's democratic republic":"LA","laos":"LA","latvia":"LV","lebanon":"LB","lesotho":"LS","liberia":"LR","libyan arab jamahiriya":"LY","libya":"LY","liechtenstein":"LI","lithuania":"LT","luxembourg":"LU","macao":"MO","macedonia, the former yugoslav republic of":"MK","macedonia, former yugoslav republic of":"MK","the former yugoslav republic of macedonia":"MK","former yugoslav republic of macedonia":"MK","f.y.r.o.m.":"MK","fyrom":"MK","macedonia":"MK","madagascar":"MG","malawi":"MW","malaysia":"MY","maldives":"MV","mali":"ML","republic of mali":"ML","malta":"MT","marshall islands":"MH","marshalls":"MH","martinique":"MQ","mauritania":"MR","mauritius":"MU","mayotte":"YT","mexico":"MX","micronesia, federated states of":"FM","federated states of micronesia":"FM","micronesia":"FM","moldova, republic of":"MD","republic of moldova":"MD","moldova":"MD","monaco":"MC","mongolia":"MN","montenegro":"ME","montserrat":"MS","morocco":"MA","mozambique":"MZ","myanmar":"MM","namibia":"NA","nauru":"NR","nepal":"NP","holland":"NL","netherlands antilles":"AN","the netherlands":"NL","netherlands":"NL","new caledonia":"NC","new zealand":"NZ","nicaragua":"NI","niger":"NE","nigeria":"NG","norfolk island":"NF","northern mariana islands":"MP","marianas":"MP","norway":"NO","oman":"OM","pakistan":"PK","palau":"PW","palestinian territory, occupied":"PS","occupied palestinian territory":"PS","palestinian territory":"PS","palestinian authority":"PS","palestine":"PS","panama":"PA","papua new guinea":"PG","png":"PG","paraguay":"PY","peru":"PE","the philippines":"PH","philippines":"PH","pitcairn":"PN","poland":"PL","portugal":"PT","puerto rico":"PR","qatar":"QA","reunion":"RE","réunion":"RE","romania":"RO","russian federation":"RU","russia":"RU","rwanda":"RW","saint barthélemy":"BL","saint barthelemy":"BL","saint barts":"BL","st. barthélemy":"BL","st. barthelemy":"BL","st. barts":"BL","st barthélemy":"BL","st barthelemy":"BL","st barts":"BL","saint helena, ascension and tristan da cunha":"SH","saint helena, ascension & tristan da cunha":"SH","saint helena":"SH","st. helena, ascension and tristan da cunha":"SH","st. helena, ascension & tristan da cunha":"SH","st. helena":"SH","st helena, ascension and tristan da cunha":"SH","st helena, ascension & tristan da cunha":"SH","st helena":"SH","ascension":"SH","tristan da cunha":"SH","saint kitts and nevis":"KN","saint kitts & nevis":"KN","saint kitts":"KN","st. kitts and nevis":"KN","st. kitts & nevis":"KN","st. kitts":"KN","st kitts and nevis":"KN","st kitts & nevis":"KN","st kitts":"KN","nevis":"KN","saint lucia":"LC","st. lucia":"LC","st lucia":"LC","saint martin":"MF","st. martin":"MF","st martin":"MF","saint pierre and miquelon":"PM","saint pierre & miquelon":"PM","saint pierre":"PM","st. pierre and miquelon":"PM","st. pierre & miquelon":"PM","st. pierre":"PM","st pierre and miquelon":"PM","st pierre & miquelon":"PM","st pierre":"PM","miquelon":"PM","saint vincent and the grenadines":"VC","saint vincent & the grenadines":"VC","saint vincent":"VC","st. vincent and the grenadines":"VC","st. vincent & the grenadines":"VC","st. vincent":"VC","st vincent and the grenadines":"VC","st vincent & the grenadines":"VC","st vincent":"VC","the grenadines":"VC","grenadines":"VC","samoa":"WS","san marino":"SM","sao tome and principe":"ST","sao tome & principe":"ST","sao tome":"ST","principe":"ST","saudi arabia":"SA","arabia":"SA","senegal":"SN","sénégal":"SN","serbia":"RS","seychelles":"SC","sierra leone":"SL","the republic of singapore":"SG","republic of singapore":"SG","singapore":"SG","slovakia":"SK","slovenia":"SI","solomon islands":"SB","solomons":"SB","somalia":"SO","south africa":"ZA","south georgia and the south sandwich islands":"GS","south georgia & the south sandwich islands":"GS","south georgia":"GS","the south sandwich islands":"GS","south sandwich islands":"GS","spain":"ES","sri lanka":"LK","the sudan":"SD","sudan":"SD","suriname":"SR","svalbard and jan mayen":"SJ","svalbard & jan mayen":"SJ","svalbard":"SJ","jan mayen":"SJ","swaziland":"SZ","sweden":"SE","switzerland":"CH","syrian arab republic":"SY","syria":"SY","taiwan":"TW","tajikistan":"TJ","tanzania, united republic of":"TZ","united republic of tanzania":"TZ","tanzania":"TZ","thailand":"TH","timor-leste":"TL","east timor":"TL","togo":"TG","tokelau":"TK","tonga":"TO","trinidad and tobago":"TT","trinidad & tobago":"TT","trinidad":"TT","tobago":"TT","tunisia":"TN","turkey":"TR","turkmenistan":"TM","turks and caicos islands":"TC","turks & caicos islands":"TC","turks islands":"TC","turk islands":"TC","caicos islands":"TC","caico islands":"TC","tuvalu":"TV","uganda":"UG","ukraine":"UA","united arab emirates":"AE","u.a.e.":"AE","uae":"AE","dubai":"AE","united kingdom":"GB","u.k.":"GB","uk":"GB","great britain":"GB","g.b.":"GB","gb":"GB","england":"GB","scotland":"GB","wales":"GB","united states":"US","united states of america":"US","u.s.a.":"US","usa":"US","united states minor outlying islands":"UM","uruguay":"UY","uzbekistan":"UZ","vanuatu":"VU","venezuela, bolivarian republic of":"VE","bolivarian republic of venezuela":"VE","venezuela":"VE","viet nam":"VN","vietnam":"VN","british virgin islands":"VG","virgin islands, british":"VG","bvis":"VG","b.v.i.":"VG","bvi":"VG","virgin islands, us":"VI","the us virgin islands":"VI","us virgin islands":"VI","virgin islands":"VI","usvi":"VI","wallis and futuna":"WF","wallis & futuna":"WF","wallis":"WF","futuna":"WF","western sahara":"EH","yemen":"YE","zambia":"ZM","zimbabwe":"ZW"};
ilib.data.nativecountries = {"افغانستان":"AF","ålandsøerne":"AX","shqipëri":"AL","algérie":"DZ","الجزائر":"DZ","principat d'andorra":"AD","república de angola":"AO","repubilika ya ngola":"AO","Հայաստան":"AM","österreich":"AT","azərbaycan":"AZ","البحرين":"BH","বাংলাদেশ":"BD","গণপ্রজাতন্ত্রী বাংলাদেশ":"BD","gônoprojatontri bangladesh":"BD","беларусь":"BY","belgië":"BE","la belgique":"BE","belgique":"BE","république du bénin":"BJ","bénin":"BJ","འབྲུག་ཡུལ་":"BT","bulivya mamallaqta":"BO","estado plurinacional de bolivia":"BO","wuliwya suyu":"BO","bosna i hercegovina":"BA","босна и херцеговина":"BA","lefatshe la botswana":"BW","bouvetøya":"BV","brasil":"BR","negara brunei darussalam":"BN","българия":"BG","republika y'u burundi":"BI","république du burundi":"BI","ព្រះរាជាណាចក្រកម្ពុជា":"KH","preăh réachéanachâk kâmpŭchéa":"KH","kâmpŭchéa":"KH","cameroun":"CM","cabo verde":"CV","islas de cabo verde":"CV","république centrafricaine":"CF","ködörösêse tî bêafrîka":"CF","république du tchad":"TD","tchad":"TD","جمهورية تشاد":"TD","ǧumhūriyyat tšād":"TD","tšād":"TD","中华人民共和国中国":"CN","共和國的中國":"TW","台灣的":"TW","中国":"CN","union des comores":"KM","udzima wa komori":"KM","الاتحاد القمري":"KM","al-ittiḥād al-qumurī/qamarī":"KM","république du congo":"CG","repubilika ya kongo":"CG","republiki ya kongó":"CG","kongo":"CG","kongó":"CG","république démocratique du congo":"CD","kūki 'āirani":"CK","cote-d'ivoire":"CI","côte-d'ivoire":"CI","hrvatska":"HR","κυπριακή δημοκρατία":"CY","kypriakí dimokratía":"CY","kıbrıs cumhuriyeti":"CY","česká republika":"CZ","danmark":"DK","جمهورية جيبوتي":"DJ","jumhūriyyat jībūtī":"DJ","république de djibouti":"DJ","jamhuuriyadda jabuuti":"DJ","gabuutih ummuuno":"DJ","jībūtī":"DJ","djibouti":"DJ","jabuuti":"DJ","gabuutih":"DJ","Commonwealth de la Dominique":"DM","Dominique":"DM","república dominicana":"DO","مصر":"EG","república de guinea ecuatorial":"GQ","république de guinée équatoriale":"GQ","guinea ecuatorial":"GQ","guinée équatoriale":"GQ","ሃገረ ኤርትራ":"ER","hagere ertra":"ER","دولة إرتريا":"ER","dawlat iritrīya":"ER","eesti":"EE","የኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ":"ET","ye-ītyōṗṗyā fēdēralāwī dīmōkrāsīyāwī rīpeblīk":"ET","የኢትዮጵያ":"ET","ye-ītyōṗṗyā":"ET","malvinas":"FK","færøerne":"FO","matanitu ko viti":"FJ","fijī ripablik":"FJ","फ़िजी गणराज्य":"FJ","suomi":"FI","guyane française":"GF","polynésie française":"PF","terres australes françaises":"TF","république gabonaise":"GA","საქართველოს":"GE","deutschland":"DE","ελλάδα":"GR","grønland":"GL","république de guinée":"GN","república da guiné-bissau":"GW","haïti":"HT","ayiti":"HT","santa sede":"VA","città del vaticano":"VA","vaticano":"VA","香港的":"HK","magyarország":"HU","ísland":"IS","भारत":"IN","جمهوری اسلامی ایران":"IR","ایران":"IR","العراق":"IQ","éire":"IE","ישראל":"IL","italia":"IT","日本":"JP","الأردن":"JO","Казахстан":"KZ","jamhuri ya kenya":"KE","ribaberiki kiribati":"KI","조선 민주주의 인민 공화국":"KP","북한":"KP","대한민국":"KR","한국":"KR","الكويت":"KW","кыргыз республикасы":"KG","kırgız respublikası":"KG","кыргызская республика":"KG","kyrgyzskaya respublika":"KG","ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ":"LA","sathalanalat paxathipatai paxaxon lao":"LA","latvija":"LV","لبنان":"LB","muso oa lesotho":"LS","ليبيا":"LY","lietuva":"LT","luxemburg":"LU","macau":"MO","澳门":"MO","澳門":"MO","поранешна југословенска република македонија":"MK","македонија":"MK","repoblikan'i madagasikara":"MG","république de madagascar":"MG","chalo cha malawi":"MW","dziko la malaŵi":"MW","malaŵi":"MW","ދިވެހިރާއްޖޭގެ ޖުމްހޫރިއްޔާ":"MV","dhivehi raa'jeyge jumhooriyya":"MV","république du mali":"ML","mali ka fasojamana":"ML","الجمهورية الإسلامية الموريتانية":"MR","al-ǧumhūriyyah al-ʾislāmiyyah al-mūrītāniyyah":"MR","république islamique de mauritanie":"MR","republik bu lislaamu bu gànnaar":"MR","republik moris":"MU","république de maurice":"MU","méxico":"MX","republica moldova":"MD","mongγol ulus":"MN","монгол улс":"MN","mongol uls":"MN","crna gora":"ME","црна гора":"ME","مغربي":"MA","república de moçambique":"MZ","moçambique":"MZ","pyidaunzu thanmăda myăma nainngandaw":"MM","burma":"MM","republiek van namibië":"NA","republik namibia":"NA","namibië":"NA","ripublik naoero":"NR","सङ्घीय लोकतान्त्रिक गणतन्त्र नेपाल":"NP","sanghiya loktāntrik ganatantra nepāl":"NP","nepāl":"NP","nederland":"NL","nouvelle-calédonie":"NC","la calédonie":"NC","calédonie":"NC","aotearoa":"NZ","jamhuriyar nijar":"NE","nijar":"NE","jamhuriyar tarayyar najeriya":"NG","njíkọtá ọchíchìiwú nàịjíríà":"NG","àpapọ̀ olómìnira ilẹ̀ nàìjíríà":"NG","nàịjíríà":"NG","nàìjíríà":"NG","norge":"NO","سلطنة عمان":"OM","پاکستان":"PK","beluu ęr a belau":"PW","belau":"PW","panamá":"PA","independen stet bilong papua niugini":"PG","papua niugini":"PG","perú":"PE","las filipinas":"PH","filipinas":"PH","polska":"PL","قطر":"QA","românia":"RO","русский Федерации":"RU","россия":"RU","repubulika y'u rwanda":"RW","république du rwanda":"RW","saint-barthélemy":"BL","saint barth":"BL","saint-martin":"MF","sint maarten":"MF","saint-pierre-et-miquelon":"PM","malo sa'oloto tuto'atasi o samoa":"WS","san marino":"SM","sao tome and principe":"ST","sao tome & principe":"ST","sao tome":"ST","principe":"ST","السعودية جزيره العرب":"SA","arabia":"SA","senegal":"SN","sénégal":"SN","serbia":"RS","seychelles":"SC","sierra leone":"SL","新加坡共和国":"SG","新加坡的":"SG","slovensko":"SK","slovenija":"SI","solomon islands":"SB","solomons":"SB","somalia":"SO","suid-afrika":"ZA","españa":"ES","sri lanka":"LK","the sudan":"SD","sudan":"SD","suriname":"SR","svalbard and jan mayen":"SJ","svalbard & jan mayen":"SJ","svalbard":"SJ","jan mayen":"SJ","swaziland":"SZ","sverige":"SE","die schweiz":"CH","schweiz":"CH","la suisse":"CH","suisse":"CH","svizzera":"CH","سوريا":"SY","taiwan, province of china":"TW","taiwan":"TW","tajikistan":"TJ","tanzania, united republic of":"TZ","united republic of tanzania":"TZ","tanzania":"TZ","ประเทศไทย":"TH","timor-leste":"TL","east timor":"TL","togo":"TG","tokelau":"TK","tonga":"TO","trinidad and tobago":"TT","trinidad & tobago":"TT","trinidad":"TT","tobago":"TT","تونس":"TN","türkiye":"TR","turkmenistan":"TM","tuvalu":"TV","uganda":"UG","україна":"UA","الامارات العربية المتحدة":"AE","دبي":"AE","albain":"GB","cymru":"GB","uruguay":"UY","uzbekistan":"UZ","vanuatu":"VU","việt nam":"VN","western sahara":"EH","يمني":"YE","zambia":"ZM","zimbabwe":"ZW"};
/**
 * addressprs.js - Represent a mailing address
 * 
 * Copyright © 2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*globals console RegExp */

/* !depends 
ilibglobal.js 
locale.js 
ctype.isideo.js 
ctype.isascii.js
ctype.isdigit.js
*/

// !data address countries nativecountries ctrynames

/**
 * @constructor
 * @class
 * 
 * Create a new Address instance and parse a physical address.<p>
 * 
 * This function parses a physical address written in a free-form string. 
 * It returns an object with a number of properties from the list below 
 * that it may have extracted from that address.<p>
 * 
 * The following is a list of properties that the algorithm will return:<p>
 * 
 * <ul>
 * <li><i>streetAddress</i>: The street address, including house numbers and all.
 * <li><i>locality</i>: The locality of this address (usually a city or town). 
 * <li><i>region</i>: The region where the locality is located. In the US, this
 * corresponds to states. In other countries, this may be provinces,
 * cantons, prefectures, etc. In some smaller countries, there are no
 * such divisions.
 * <li><i>postalCode</i>: Country-specific code for expediting mail. In the US, 
 * this is the zip code.
 * <li><i>country</i>: The country of the address.
 * <li><i>countryCode</i>: The ISO 3166 2-letter region code for the destination
 * country in this address.
 * </ul> 
 * 
 * The above properties will not necessarily appear in the instance. For 
 * any individual property, if the free-form address does not contain 
 * that property or it cannot be parsed out, the it is left out.<p>
 * 
 * The options parameter may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - locale or localeSpec to use to parse the address. If not 
 * specified, this function will use the current ilib locale
 * 
 * <li><i>onLoad</i> - a callback function to call when the address info for the
 * locale is fully loaded and the address has been parsed. When the onLoad 
 * option is given, the address object 
 * will attempt to load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two. 
 * 
 * <li><i>sync</i> - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * When an address cannot be parsed properly, the entire address will be placed
 * into the streetAddress property.<p>
 * 
 * When the freeformAddress is another ilib.Address, this will act like a copy
 * constructor.<p>
 * 
 * Depends directive: !depends addressprs.js
 * 
 * @dict
 * @param {string|ilib.Address} freeformAddress free-form address to parse, or a
 * javascript object containing the fields
 * @param {Object} options options to the parser
 */
ilib.Address = function (freeformAddress, options) {
	var address;

	if (!freeformAddress) {
		return undefined;
	}

	this.sync = true;
	this.loadParams = {};
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		if (typeof(options.sync) !== 'undefined') {
			this.sync = (options.sync == true);
		}
		
		if (options.loadParams) {
			this.loadParams = options.loadParams;
		}
	}

	this.locale = this.locale || new ilib.Locale();
	// initialize from an already parsed object
	if (typeof(freeformAddress) === 'object') {
		/**
		 * The street address, including house numbers and all.
		 * @expose
		 * @type {string|undefined} 
		 */
		this.streetAddress = freeformAddress.streetAddress;
		/**
		 * The locality of this address (usually a city or town).
		 * @expose
		 * @type {string|undefined} 
		 */
		this.locality = freeformAddress.locality;
		/**
		 * The region (province, canton, prefecture, state, etc.) where the address is located.
		 * @expose
		 * @type {string|undefined} 
		 */
		this.region = freeformAddress.region;
		/**
		 * Country-specific code for expediting mail. In the US, this is the zip code.
		 * @expose
		 * @type {string|undefined} 
		 */
		this.postalCode = freeformAddress.postalCode;
		/**
		 * The country of the address.
		 * @expose
		 * @type {string|undefined}
		 */
		this.country = freeformAddress.country;
		if (freeformAddress.countryCode) {
			/**
			 * The 2 or 3 letter ISO 3166 region code for the destination country in this address.
			 * @expose
			 * @type {string} 
			 * 
			 */
			this.countryCode = freeformAddress.countryCode;
		}
		if (freeformAddress.format) {
			/**
			 * @protected
			 * @type {string}
			 */
			this.format = freeformAddress.format;
		}
		return this;
	}

	address = freeformAddress.replace(/[ \t\r]+/g, " ").trim();
	address = address.replace(/[\s\n]+$/, "");
	address = address.replace(/^[\s\n]+/, "");
	//console.log("\n\n-------------\nAddress is '" + address + "'");
	
	this.lines = address.split(/[,，\n]/g);
	this.removeEmptyLines(this.lines);
	
	if (typeof(ilib.Address.ctry) === 'undefined') {
		ilib.Address.ctry = {}; // make sure not to conflict with the address info
	}
	ilib.loadData(ilib.Address.ctry, this.locale, "ctrynames", this.sync, this.loadParams, 
		/** @type function(Object=):undefined */
		ilib.bind(this, /** @type function() */ function(ctrynames) {
			this._determineDest(ctrynames, options.onLoad);
		}
	));
};

/** @protected */
ilib.Address.prototype = {
	/**
	 * @private
	 * @param {Object?} ctrynames
	 */
	_findDest: function (ctrynames) {
		var match;
		
		for (var countryName in ctrynames) {
			if (countryName && countryName !== "generated") {
				// find the longest match in the current table
				// ctrynames contains the country names mapped to region code
				// for efficiency, only test for things longer than the current match
				if (!match || match.text.length < countryName.length) {
					var temp = this._findCountry(countryName);
					if (temp) {
						match = temp;
						this.country = match.text;
						this.countryCode = ctrynames[countryName];
					}
				}
			}
		}
		return match;
	},
	
	/**
	 * @private
	 * @param {Object?} localizedCountries
	 * @param {function(ilib.Address):undefined} callback
	 */
	_determineDest: function (localizedCountries, callback) {
		var match;
		
		/*
		 * First, find the name of the destination country, as that determines how to parse
		 * the rest of the address. For any address, there are three possible ways 
		 * that the name of the country could be written:
		 * 1. In the current language
		 * 2. In its own native language
		 * 3. In English
		 * We'll try all three.
		 */
		var tables = [];
		if (localizedCountries) {
			tables.push(localizedCountries);
		}
		tables.push(ilib.data.nativecountries);
		tables.push(ilib.data.countries);
		
		for (var i = 0; i < tables.length; i++) {
			match = this._findDest(tables[i]);
			
			if (match) {
				this.lines[match.line] = this.lines[match.line].substring(0, match.start) + this.lines[match.line].substring(match.start + match.text.length);

				this._init(callback);
				return;
			}
		}
		
		// no country, so try parsing it as if we were in the same country
		this.country = undefined;
		this.countryCode = this.locale.getRegion();
		this._init(callback);
	},

	/**
	 * @private
	 * @param {function(ilib.Address):undefined} callback
	 */
	_init: function(callback) {
		ilib.loadData(ilib.Address, new ilib.Locale(this.countryCode), "address", this.sync, this.loadParams, 
				/** @type function(Object=):undefined */ ilib.bind(this, function(info) {
			if (!info || ilib.isEmpty(info)) {
				// load the "unknown" locale instead
				ilib.loadData(ilib.Address, new ilib.Locale("XX"), "address", this.sync, this.loadParams, 
						/** @type function(Object=):undefined */ ilib.bind(this, function(info) {
					this.info = info;
					this._parseAddress();
					if (typeof(callback) === 'function') {
						callback(this);
					}	
				}));
			} else {
				this.info = info;
				this._parseAddress();
				if (typeof(callback) === 'function') {
					callback(this);
				}
			}
		}));
	},

	/**
	 * @private
	 */
	_parseAddress: function() {
		// clean it up first
		var i, 
			asianChars = 0, 
			latinChars = 0,
			startAt,
			infoFields,
			field,
			pattern,
			matchFunction,
			match,
			fieldNumber;
		
		// for locales that support both latin and asian character addresses, 
		// decide if we are parsing an asian or latin script address
		if (this.info && this.info.multiformat) {
			for (var j = 0; j < this.lines.length; j++) {
				var line = this.lines[j];
				// TODO: use a char iterator here
				for (i = 0; i < line.length; i++) {
					if (ilib.CType.isIdeo(line.charAt(i))) {
						asianChars++;
					} else if (ilib.CType.isAscii(line.charAt(i)) && !ilib.CType.isDigit(line.charAt(i))) {
						latinChars++;
					}
				}
			}
			
			this.format = (asianChars >= latinChars) ? "asian" : "latin";
			startAt = this.info.startAt[this.format];
			infoFields = this.info.fields[this.format];
			// console.log("multiformat locale: format is now " + this.format);
		} else {
			startAt = (this.info && this.info.startAt) || "end";
			infoFields = this.info.fields;
		}
		this.compare = (startAt === "end") ? this.endsWith : this.startsWith;
		
		//console.log("this.lines is: " + JSON.stringify(this.lines));
		
		for (i = 0; i < infoFields.length && this.lines.length > 0; i++) {
			/** @type {{name:string, line:string, pattern:(string|Array.<string>), matchGroup:number}} */
			field = infoFields[i];
			this.removeEmptyLines(this.lines);
			//console.log("Searching for field " + field.name);
			if (field.pattern) {
				if (typeof(field.pattern) === 'string') {
					pattern = new RegExp(field.pattern, "img");
					matchFunction = this.matchRegExp;
				} else {
					pattern = field.pattern;
					matchFunction = this.matchPattern;
				}
					
				switch (field.line) {
				case 'startAtFirst':
					for (fieldNumber = 0; fieldNumber < this.lines.length; fieldNumber++) {
						match = matchFunction(this, this.lines[fieldNumber], pattern, field.matchGroup, startAt);
						if (match) {
							break;
						}
					}
					break;
				case 'startAtLast':
					for (fieldNumber = this.lines.length-1; fieldNumber >= 0; fieldNumber--) {
						match = matchFunction(this, this.lines[fieldNumber], pattern, field.matchGroup, startAt);
						if (match) {
							break;
						}
					}
					break;
				case 'first':
					fieldNumber = 0;
					match = matchFunction(this, this.lines[fieldNumber], pattern, field.matchGroup, startAt);
					break;
				case 'last':
				default:
					fieldNumber = this.lines.length - 1;
					match = matchFunction(this, this.lines[fieldNumber], pattern, field.matchGroup, startAt);
					break;
				}
				if (match) {
					// console.log("found match for " + field.name + ": " + JSON.stringify(match));
					// console.log("remaining line is " + match.line);
					this.lines[fieldNumber] = match.line;
					this[field.name] = match.match;
				}
			} else {
				// if nothing is given, default to taking the whole field
				this[field.name] = this.lines.splice(fieldNumber,1)[0].trim();
				//console.log("typeof(this[fieldName]) is " + typeof(this[fieldName]) + " and value is " + JSON.stringify(this[fieldName]));
			}
		}
			
		// all the left overs go in the street address field
		this.removeEmptyLines(this.lines);
		if (this.lines.length > 0) {
			//console.log("this.lines is " + JSON.stringify(this.lines) + " and splicing to get streetAddress");
			var joinString = (this.format && this.format === "asian") ? "" : ", ";
			this.streetAddress = this.lines.join(joinString).trim();
		}
		
		this.lines = undefined;
		//console.log("final result is " + JSON.stringify(this));
	},
	
	/**
	 * @protected
	 * Find the named country either at the end or the beginning of the address.
	 */
	_findCountry: function(name) {
		var start = -1, match, line = 0;
		
		if (this.lines.length > 0) {
			start = this.startsWith(this.lines[line], name);
			if (start === -1) {
				line = this.lines.length-1;
				start = this.endsWith(this.lines[line], name);
			}
			if (start !== -1) {
				match = {
					text: this.lines[line].substring(start, start + name.length),
					line: line,
					start: start
				};
			}
		}
		
		return match;
	},
	
	endsWith: function (subject, query) {
		var start = subject.length-query.length,
			i,
			pat;
		//console.log("endsWith: checking " + query + " against " + subject);
		for (i = 0; i < query.length; i++) {
			if (subject.charAt(start+i).toLowerCase() !== query.charAt(i).toLowerCase()) {
				return -1;
			}
		}
		if (start > 0) {
			pat = /\s/;
			if (!pat.test(subject.charAt(start-1))) {
				// make sure if we are not at the beginning of the string, that the match is 
				// not the end of some other word
				return -1;
			}
		}
		return start;
	},
	
	startsWith: function (subject, query) {
		var i;
		// console.log("startsWith: checking " + query + " against " + subject);
		for (i = 0; i < query.length; i++) {
			if (subject.charAt(i).toLowerCase() !== query.charAt(i).toLowerCase()) {
				return -1;
			}
		}
		return 0;
	},
	
	removeEmptyLines: function (arr) {
		var i = 0;
		
		while (i < arr.length) {
			if (arr[i]) {
				arr[i] = arr[i].trim();
				if (arr[i].length === 0) {
					arr.splice(i,1);
				} else {
					i++;
				}
			} else {
				arr.splice(i,1);
			}
		}
	},
	
	matchRegExp: function(address, line, expression, matchGroup, startAt) {
		var lastMatch,
			match,
			ret = {},
			last;
		
		//console.log("searching for regexp " + expression.source + " in line " + line);
		
		match = expression.exec(line);
		if (startAt === 'end') {
			while (match !== null && match.length > 0) {
				//console.log("found matches " + JSON.stringify(match));
				lastMatch = match;
				match = expression.exec(line);
			}
			match = lastMatch;
		}
		
		if (match && match !== null) {
			//console.log("found matches " + JSON.stringify(match));
			matchGroup = matchGroup || 0;
			if (match[matchGroup] !== undefined) {
				ret.match = match[matchGroup].trim();
				last = (startAt === 'end') ? line.lastIndexOf(match[matchGroup]) : line.indexOf(match[matchGroup]); 
				// console.log("last is " + last);
				ret.line = line.slice(0,last);
				if (address.format !== "asian") {
					ret.line += " ";
				}
				ret.line += line.slice(last+match[matchGroup].length);
				ret.line = ret.line.trim();
				//console.log("found match " + ret.match + " from matchgroup " + matchGroup + " and rest of line is " + ret.line);
				return ret;
			}
		//} else {
			//console.log("no match");
		}
		
		return undefined;
	},
	
	matchPattern: function(address, line, pattern, matchGroup) {
		var start,
			j,
			ret = {};
		
		//console.log("searching in line " + line);
		
		// search an array of possible fixed strings
		//console.log("Using fixed set of strings.");
		for (j = 0; j < pattern.length; j++) {
			start = address.compare(line, pattern[j]); 
			if (start !== -1) {
				ret.match = line.substring(start, start+pattern[j].length);
				ret.line = line.substring(0,start).trim();
				//console.log("found match " + ret.match + " and rest of line is " + ret.line);
				return ret;
			}
		}
		
		return undefined;
	}
};
/*
 * addressfmt.js - Format an address
 * 
 * Copyright © 2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends 
ilibglobal.js 
locale.js
addressprs.js
*/

// !data address

/**
 * @constructor
 * @class
 * 
 * Create a new formatter object to format physical addresses in a particular way.
 *
 * The options object may contain the following properties, both of which are optional:
 *
 * <ul>
 * <li><i>locale</i> - the locale to use to format this address. If not specified, it uses the default locale
 * 
 * <li><i>style</i> - the style of this address. The default style for each country usually includes all valid 
 * fields for that country.
 * 
 * <li><i>onLoad</i> - a callback function to call when the address info for the
 * locale is fully loaded and the address has been parsed. When the onLoad 
 * option is given, the address formatter object 
 * will attempt to load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two. 
 * 
 * <li><i>sync</i> - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * Depends directive: !depends addressfmt.js
 * 
 * @param {Object} options options that configure how this formatter should work
 * Returns a formatter instance that can format multiple addresses.
 */
ilib.AddressFmt = function(options) {
	this.sync = true;
	this.styleName = 'default';
	this.loadParams = {};
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		if (typeof(options.sync) !== 'undefined') {
			this.sync = (options.sync == true);
		}
		
		if (options.style) {
			this.styleName = options.style;
		}
		
		if (options.loadParams) {
			this.loadParams = options.loadParams;
		}
	}

	// console.log("Creating formatter for region: " + this.locale.region);
	ilib.loadData(ilib.Address, this.locale, "address", this.sync, this.loadParams, /** @type function(Object?):undefined */ ilib.bind(this, function(info) {
		if (!info || ilib.isEmpty(info)) {
			// load the "unknown" locale instead
			ilib.loadData(ilib.Address, new ilib.Locale("XX"), "address", this.sync, this.loadParams, /** @type function(Object?):undefined */ ilib.bind(this, function(info) {
				this.info = info;
				this._init();
				if (typeof(options.onLoad) === 'function') {
					options.onLoad(this);
				}	
			}));
		} else {
			this.info = info;
			this._init();
			if (typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
		}
	}));
};

/**
 * @private
 */
ilib.AddressFmt.prototype._init = function () {
	this.style = this.info && this.info.formats && this.info.formats[this.styleName];
	
	// use generic default -- should not happen, but just in case...
	this.style = this.style || (this.info && this.info.formats["default"]) || "{streetAddress}\n{locality} {region} {postalCode}\n{country}";
};

/**
 * This function formats a physical address (ilib.Address instance) for display. 
 * Whitespace is trimmed from the beginning and end of final resulting string, and 
 * multiple consecutive whitespace characters in the middle of the string are 
 * compressed down to 1 space character.
 * 
 * If the Address instance is for a locale that is different than the locale for this
 * formatter, then a hybrid address is produced. The country name is located in the
 * correct spot for the current formatter's locale, but the rest of the fields are
 * formatted according to the default style of the locale of the actual address.
 * 
 * Example: a mailing address in China, but formatted for the US might produce the words
 * "People's Republic of China" in English at the last line of the address, and the 
 * Chinese-style address will appear in the first line of the address. In the US, the
 * country is on the last line, but in China the country is usually on the first line.
 *
 * @param {ilib.Address} address Address to format
 * @eturns {string} Returns a string containing the formatted address
 */
ilib.AddressFmt.prototype.format = function (address) {
	var ret, template, other, format;
	
	if (!address) {
		return "";
	}
	// console.log("formatting address: " + JSON.stringify(address));
	if (address.countryCode && 
			address.countryCode !== this.locale.region && 
			ilib.Locale._isRegionCode(this.locale.region) && 
			this.locale.region !== "XX") {
		// we are formatting an address that is sent from this country to another country,
		// so only the country should be in this locale, and the rest should be in the other
		// locale
		// console.log("formatting for another locale. Loading in its settings: " + address.countryCode);
		other = new ilib.AddressFmt({
			locale: new ilib.Locale(address.countryCode), 
			style: this.styleName
		});
		return other.format(address);
	}
	
	format = address.format ? this.style[address.format] : this.style;
	// console.log("Using format: " + format);
	// make sure we have a blank string for any missing parts so that
	// those template parts get blanked out
	var params = {
		country: address.country || "",
		region: address.region || "",
		locality: address.locality || "",
		streetAddress: address.streetAddress || "",
		postalCode: address.postalCode || ""
	};
	template = new ilib.String(format);
	ret = template.format(params);
	ret = ret.replace(/[ \t]+/g, ' ');
	return ret.replace(/\n+/g, '\n').trim();
};

/*
 * collate.js - Collation routines
 * 
 * Copyright © 2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// !depends locale.js ilibglobal.js

// !data collation

/**
 * @class
 * A class that implements a locale-sensitive comparator function 
 * for use with sorting function. The comparator function
 * assumes that the strings it is comparing contain Unicode characters
 * encoded in UTF-16.<p>
 * 
 * Collations usually depend only on the language, because most collation orders 
 * are shared between locales that speak the same language. There are, however, a
 * number of instances where a locale collates differently than other locales
 * that share the same language. There are also a number of instances where a
 * locale collates differently based on the script used. This object can handle
 * these cases automatically if a full locale is specified in the options rather
 * than just a language code.<p>
 * 
 * <h2>Options</h2>
 * 
 * The options parameter can contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - String|Locale. The locale which the comparator function 
 * will collate with. Default: the current iLib locale.
 * 
 * <li><i>level</i> - String. Strength of collator. This is one of "primary", "secondary", 
 * "tertiary", or "quaternary". Default: "primary"
 *   <ol>
 *   <li>primary - Only the primary distinctions between characters are significant.
 *   Another way of saying that is that the collator will be case-, accent-, and 
 *   variation-insensitive, and only distinguish between the base characters
 *   <li>secondary - Both the primary and secondary distinctions between characters
 *   are significant. That is, the collator will be accent- and variation-insensitive
 *   and will distinguish between base characters and character case.
 *   <li>tertiary - The primary, secondary, and tertiary distinctions between
 *   characters are all significant. That is, the collator will be 
 *   variation-insensitive, but accent-, case-, and base-character-sensitive. 
 *   <li>quaternary - All distinctions between characters are significant. That is,
 *   the algorithm is base character-, case-, accent-, and variation-sensitive.
 *   </ol>
 *   
 * <li><i>upperFirst</i> - boolean. When collating case-sensitively in a script that
 * has the concept of case, put upper-case
 * characters first, otherwise lower-case will come first. Default: true
 * 
 * <li><i>reverse</i> - boolean. Return the list sorted in reverse order. When the
 * upperFirst option is also set to true, upper-case characters would then come at 
 * the end of the list. Default: false.
 * 
 * <li><i>scriptOrder</i> - string. When collating strings in multiple scripts,
 * this property specifies what order those scripts should be sorted. The default
 * Unicode Collation Algorithm (UCA) already has a default order for scripts, but
 * this can be tailored via this property. The value of this option is a 
 * space-separated list of ISO 15924 scripts codes. If a code is specified in this
 * property, its default data must be included using the JS assembly tool. If the
 * data is not included, the ordering for the script will be ignored. Default:
 * the default order defined by the UCA. 
 * 
 * <li><i>style</i> - The value of the style parameter is dependent on the locale.
 * For some locales, there are different styles of collating strings depending
 * on what kind of strings are being collated or what the preference of the user 
 * is. For example, in German, there is a phonebook order and a dictionary ordering
 * that sort the same array of strings slightly differently.
 * The static method ilib.Collator.getStyles will return a list of styles that ilib
 * currently knows about for any given locale. If the value of the style option is 
 * not recognized for a locale, it will be ignored. Default style is "standard".<p>
 * 
 * <li>onLoad - a callback function to call when the collator object is fully 
 * loaded. When the onLoad option is given, the collator object will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
 * 
 * <li>sync - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while. 
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * <h2>Operation</h2>
 * 
 * The Collator constructor returns a collator object tailored with the above 
 * options. The object contains an internal compare() method which compares two 
 * strings according to those options. This can be used directly to compare
 * two strings, but is not useful for passing to the javascript sort function
 * because then it will not have its collation data available. Instead, use the 
 * getComparator() method to retrieve a function that is bound to the collator
 * object. (You could also bind it yourself using ilib.bind()). The bound function 
 * can be used with the standard Javascript array sorting algorithm, or as a 
 * comparator with your own sorting algorithm.<p>
 * 
 * Example using the standard Javascript array sorting call with the bound
 * function:<p>
 * 
 * <code>
 * <pre>
 * var arr = ["ö", "oe", "ü", "o", "a", "ae", "u", "ß", "ä"];
 * var collator = ilib.Collator({locale: 'de-DE', style: "dictionary"});
 * arr.sort(collator.getComparator());
 * console.log(JSON.stringify(arr));
 * </pre>
 * </code>
 * <p>
 * 
 * Would give the output:<p>
 * 
 * <code>
 * <pre>
 * ["a", "ae", "ä", "o", "oe", "ö", "ß", "u", "ü"]
 * </pre>
 * </code>
 * 
 * When sorting an array of Javascript objects according to one of the 
 * string properties of the objects, wrap the collator's compare function 
 * in your own comparator function that knows the structure of the objects
 * being sorted:<p>
 * 
 * <code>
 * <pre>
 * var collator = ilib.Collator({locale: 'de-DE'});
 * var myComparator = function (collator) {
 *   var comparator = collator.getComparator();
 *   // left and right are your own objects
 *   return function (left, right) {
 *   	return comparator(left.x.y.textProperty, right.x.y.textProperty);
 *   };
 * };
 * arr.sort(myComparator(collator));
 * </pre>
 * </code>
 * <p>
 * 
 * <h2>Sort Keys</h2>
 * 
 * The collator class also has a method to retrieve the sort key for a
 * string. The sort key is an array of values that represent how each  
 * character in the string should be collated according to the characteristics
 * of the collation algorithm and the given options. Thus, sort keys can be 
 * compared directly value-for-value with other sort keys that were generated 
 * by the same collator, and the resulting ordering is guaranteed to be the 
 * same as if the original strings were compared by the collator.
 * Sort keys generated by different collators are not guaranteed to give
 * any reasonable results when compared together unless the two collators 
 * were constructed with 
 * exactly the same options and therefore end up representing the exact same 
 * collation sequence.<p>
 * 
 * A good rule of thumb is that you would use a sort key if you had 10 or more
 * items to sort or if your array might be resorted arbitrarily. For example, if your 
 * user interface was displaying a table with 100 rows in it, and each row had
 * 4 sortable text columns which could be sorted in acending or descending order,
 * the recommended practice would be to generate a sort key for each of the 4
 * sortable fields in each row and store that in the Javascript representation of the
 * table data. Then, when the user clicks on a column header to resort the
 * table according to that column, the resorting would be relatively quick 
 * because it would only be comparing arrays of values, and not recalculating 
 * the collation values for each character in each string for every comparison.<p>
 * 
 * For tables that are large, it is usually a better idea to do the sorting
 * on the server side, especially if the table is the result of a database
 * query. In this case, the table is usually a view of the cursor of a large
 * results set, and only a few entries are sent to the front end at a time.
 * In order to sort the set efficiently, it should be done on the database
 * level instead.
 * 
 * <h2>Data</h2>
 * 
 * Doing correct collation entails a huge amount of mapping data, much of which is
 * not necessary when collating in one language with one script, which is the most
 * common case. Thus, ilib implements a number of ways to include the data you
 * need or leave out the data you don't need using the JS assembly tool:
 * 
 * <ol>
 * <li>Full multilingual data - if you are sorting multilingual data and need to collate 
 * text written in multiple scripts, you can use the directive "!data collation/ducet" to 
 * load in the full collation data.  This allows the collator to perform the entire 
 * Unicode Collation Algorithm (UCA) based on the Default Unicode Collation Element 
 * Table (DUCET). The data is very large, on the order of multiple megabytes, but 
 * sometimes it is necessary.
 * <li>A few scripts - if you are sorting text written in only a few scripts, you may 
 * want to include only the data for those scripts. Each ISO 15924 script code has its
 * own data available in a separate file, so you can use the data directive to include
 * only the data for the scripts you need. For example, use  
 * "!data collation/Latn" to retrieve the collation information for the Latin script.
 * Because the "ducet" table mentioned in the previous point is a superset of the 
 * tables for all other scripts, you do not need to include explicitly the data for 
 * any particular script when using "ducet". That is, you either include "ducet" or 
 * you include a specific list of scripts.
 * <li>Only one script - if you are sorting text written only in one script, you can
 * either include the data directly as in the previous point, or you can rely on the 
 * locale to include the correct data for you. In this case, you can use the directive
 * "!data collate" to load in the locale's collation data for its most common script.
 * </ol>
 *   
 * With any of the above ways of including the data, the collator will only perform the
 * correct language-sensitive sorting for the given locale. All other scripts will be
 * sorted in the default manner according to the UCA. For example, if you include the
 * "ducet" data and pass in "de-DE" (German for Germany) as the locale spec, then
 * only the Latin script (the default script for German) will be sorted according to
 * German rules. All other scripts in the DUCET, such as Japanese or Arabic, will use 
 * the default UCA collation rules.<p>
 * 
 * If this collator encounters a character for which it has no collation data, it will
 * sort those characters by pure Unicode value after all characters for which it does have
 * collation data. For example, if you only loaded in the German collation data (ie. the
 * data for the Latin script tailored to German) to sort a list of person names, but that
 * list happens to include the names of a few Japanese people written in Japanese 
 * characters, the Japanese names will sort at the end of the list after all German names,
 * and will sort according to the Unicode values of the characters.
 * 
 * @param {Object} options options governing how the resulting comparator 
 * function will operate
 */
ilib.Collator = function(options) {
	// TODO: fill in the collator constructor function
};

ilib.Collator.prototype = {
	/**
	 * Return a comparator function that can compare two strings together
	 * according to the rules of this collator instance. The function 
	 * returns a negative number if the left 
	 * string comes before right, a positive number if the right string comes 
	 * before the left, and zero if left and right are equivalent. If the
	 * reverse property was given as true to the collator constructor, this 
	 * function will
	 * switch the sign of those values to cause sorting to happen in the
	 * reverse order.
	 * 
	 * @return {function(string,string):number} a comparator function that 
	 * can compare two strings together according to the rules of this 
	 * collator instance
	 */
	getComparator: function() {
		// bind the function to this instance so that we have the collation
		// rules available to do the work
		return /** @type function(string,string):number */ ilib.bind(this, this.compare);
	},
	
	/**
	 * Compare two strings together according to the rules of this 
	 * collator instance. Do not use this function directly with 
	 * Array.sort, as it will not have its collation data available
	 * and therefore will not function properly. Use the function
	 * returned by getComparator() instead.
	 * 
	 * @param {string} left the left string to compare
	 * @param {string} right the right string to compare
	 * @return {number} a negative number if left comes before right, a
	 * positive number if right comes before left, and zero if left and 
	 * right are equivalent according to this collator
	 */
	compare: function (left, right) {
		// TODO: fill in the full comparison algorithm here
		return (left < right) ? -1 : ((left > right) ? 1 : 0);
	},
	
	/**
	 * Return a sort key string for the given string. The sort key
	 * string is a list of values that represent each character 
	 * in the original string. The sort key
	 * values for any particular character consists of 3 numbers that
	 * encode the primary, secondary, and tertiary characteristics
	 * of that character. The values of each characteristic are 
	 * modified according to the strength of this collator instance 
	 * to give the correct collation order. The idea is that this
	 * sort key string is directly comparable byte-for-byte to 
	 * other sort key strings generated by this collator without
	 * any further knowledge of the collation rules for the locale.
	 * More formally, if a < b according to the rules of this collation, 
	 * then it is guaranteed that sortkey(a) < sortkey(b) when compared
	 * byte-for-byte. The sort key string can therefore be used
	 * without the collator to sort an array of strings efficiently
	 * because the work of determining the applicability of various
	 * collation rules is done once up-front when generating 
	 * the sort key.<p>
	 * 
	 * The sort key string can be treated as a regular, albeit somewhat
	 * odd-looking, string. That is, it can be pass to regular 
	 * Javascript functions without problems.  
	 * 
	 * @param {string} str the original string to generate the sort key for
	 * @return {string} a sort key string for the given string
	 */
	sortKey: function (str) {
		// TODO: fill in the full sort key algorithm here
		return str;
	}
};

/**
 * Retrieve the list of collation style names that are available for the 
 * given locale. This list varies depending on the locale, and depending
 * on whether or not the data for that locale was assembled into this copy
 * of ilib.
 * 
 * @param {ilib.Locale|string=} locale The locale for which the available
 * styles are being sought
 * @return Array.<string> an array of style names that are available for
 * the given locale
 */
ilib.Collator.getAvailableStyles = function (locale) {
	return [ "standard" ];
};

/**
 * Retrieve the list of ISO 15924 script codes that are available in this
 * copy of ilib. This list varies depending on whether or not the data for 
 * various scripts was assembled into this copy of ilib. If the "ducet"
 * data is assembled into this copy of ilib, this method will report the
 * entire list of scripts as being available. If a collator instance is
 * instantiated with a script code that is not on the list returned by this
 * function, it will be ignored and text in that script will be sorted by
 * numeric Unicode values of the characters.
 * 
 * @return Array.<string> an array of ISO 15924 script codes that are 
 * available
 */
ilib.Collator.getAvailableScripts = function () {
	return [ "Latn" ];
};

/**
 * @license
 * Copyright © 2012-2013, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * ilib.js - metafile that includes all other js files
 */

/* !depends
ilibglobal.js
daterangefmt.js
date.js
calendar/hebrewdate.js
calendar/hebrew.js
calendar/islamic.js
calendar/islamicdate.js
calendar/julian.js
calendar/juliandate.js
calendar/gregorian.js
calendar/gregoriandate.js
numprs.js
numfmt.js
julianday.js
datefmt.js
calendar.js
util/utils.js
locale.js
strings.js
durfmt.js
resources.js
ctype.js
localeinfo.js
daterangefmt.js
ctype.isalnum.js
ctype.isalpha.js
ctype.isascii.js
ctype.isblank.js
ctype.iscntrl.js
ctype.isdigit.js
ctype.isgraph.js
ctype.isideo.js
ctype.islower.js
ctype.isprint.js
ctype.ispunct.js
ctype.isspace.js
ctype.isupper.js
ctype.isxdigit.js
nameprs.js
namefmt.js
addressprs.js
addressfmt.js
collate.js
*/
