/*
 * ilibglobal.js - define the ilib name space
 * 
 * Copyright © 2012-2014, JEDLSoft
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
 * @static
 * @return {string} a version string for this instance of ilib
 */
ilib.getVersion = function () {
    // increment this for each release
    return "10.0"
    ;
};

/**
 * Place where resources and such are eventually assigned.
 */
ilib.data = {
    norm: {
        nfc: {},
        nfd: {},
        nfkd: {},
        ccc: {}
    },
    zoneinfo: {
        "Etc/UTC":{"o":"0:0","f":"UTC"},
        "local":{"f":"local"}
    },
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype_c: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype_l: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype_m: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype_p: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ ctype_z: null,
    /** @type {null|Object.<string,Array.<Array.<number>>>} */ scriptToRange: null,
    /** @type {null|Object.<string,string|Object.<string|Object.<string,string>>>} */ dateformats: null
};

if (typeof(window) !== 'undefined') {
    window["ilib"] = ilib;
}

// export ilib for use as a module in nodejs
if (typeof(exports) !== 'undefined') {
    exports.ilib = ilib;
}

ilib.pseudoLocales = ["zxx-XX"];

/**
 * Sets the pseudo locale. Pseudolocalization (or pseudo-localization) is used for testing
 * internationalization aspects of software. Instead of translating the text of the software
 * into a foreign language, as in the process of localization, the textual elements of an application
 * are replaced with an altered version of the original language.These specific alterations make
 * the original words appear readable, but include the most problematic characteristics of 
 * the world's languages: varying length of text or characters, language direction, and so on.
 * Regular Latin pseudo locale: eu-ES and RTL pseudo locale: ps-AF
 * 
 * @param {string|undefined|null} localename the locale specifier for the pseudo locale
 */
ilib.setAsPseudoLocale = function (localename) {
   if (localename) {
	   ilib.pseudoLocales.push(localename)
   }
};

/**
 * Reset the list of pseudo locales back to the default single locale of zxx-XX.
 */
ilib.clearPseudoLocales = function() {
	ilib.pseudoLocales = ["zxx-XX"];
};

/**
 * Return the name of the platform
 * @private
 * @static
 * @return {string} string naming the platform
 */
ilib._getPlatform = function () {
    if (!ilib._platform) {
        if (typeof(environment) !== 'undefined') {
            ilib._platform = "rhino";
        } else if (typeof(process) !== 'undefined' || typeof(require) !== 'undefined') {
            ilib._platform = "nodejs";
        } else if (typeof(window) !== 'undefined') {
            ilib._platform = (typeof(PalmSystem) !== 'undefined') ? "webos" : "browser";
        } else {
            ilib._platform = "unknown";
        }
    }    
    return ilib._platform;
};

/**
 * If this ilib is running in a browser, return the name of that browser.
 * @private
 * @static
 * @return {string|undefined} the name of the browser that this is running in ("firefox", "chrome", "ie", 
 * "safari", or "opera"), or undefined if this is not running in a browser or if
 * the browser name could not be determined 
 */
ilib._getBrowser = function () {
	var browser = undefined;
	if (ilib._getPlatform() === "browser") {
		if (navigator && navigator.userAgent) {
			if (navigator.userAgent.indexOf("Firefox") > -1) {
				browser = "firefox";
			}
			if (navigator.userAgent.indexOf("Opera") > -1) {
				browser = "opera";
			}
			if (navigator.userAgent.indexOf("Chrome") > -1) {
				browser = "chrome";
			}
			if (navigator.userAgent.indexOf(" .NET") > -1) {
				browser = "ie";
			}
			if (navigator.userAgent.indexOf("Safari") > -1) {
				// chrome also has the string Safari in its userAgen, but the chrome case is 
				// already taken care of above
				browser = "safari";
			}
		}
	}
	return browser;
};

/**
 * Return true if the global variable is defined on this platform.
 * @private
 * @static
 * @return {boolean} true if the global variable is defined on this platform, false otherwise
 */
ilib._isGlobal = function(name) {
    switch (ilib._getPlatform()) {
        case "rhino":
            var top = (function() {
              return (typeof global === 'object') ? global : this;
            })();
            return typeof(top[name]) !== undefined;
        case "nodejs":
            var root = typeof(global) !== 'undefined' ? global : this;
            return root && typeof(root[name]) !== undefined;
            
        default:
            return typeof(window[name]) !== undefined;
    }
};

/**
 * Sets the default locale for all of ilib. This locale will be used
 * when no explicit locale is passed to any ilib class. If the default
 * locale is not set, ilib will attempt to use the locale of the
 * environment it is running in, if it can find that. If not, it will
 * default to the locale "en-US".<p>
 * 
 * Depends directive: !depends ilibglobal.js
 * 
 * @static
 * @param {string|undefined|null} spec the locale specifier for the default locale
 */
ilib.setLocale = function (spec) {
    if (typeof(spec) === 'string' || !spec) {
        ilib.locale = spec;
    }
    // else ignore other data types, as we don't have the dependencies
    // to look into them to find a locale
};

/**
 * Return the default locale for all of ilib if one has been set. This 
 * locale will be used when no explicit locale is passed to any ilib 
 * class. If the default
 * locale is not set, ilib will attempt to use the locale of the
 * environment it is running in, if it can find that. If not, it will
 * default to the locale "en-US".<p>
 * 
 * Depends directive: !depends ilibglobal.js 
 * 
 * @static
 * @return {string} the locale specifier for the default locale
 */
ilib.getLocale = function () {
    if (typeof(ilib.locale) !== 'string') {
        if (typeof(navigator) !== 'undefined' && typeof(navigator.language) !== 'undefined') {
            // running in a browser
            ilib.locale = navigator.language.substring(0,3) + navigator.language.substring(3,5).toUpperCase();  // FF/Opera/Chrome/Webkit
            if (!ilib.locale) {
                // IE on Windows
                var lang = typeof(navigator.browserLanguage) !== 'undefined' ? 
                    navigator.browserLanguage : 
                    (typeof(navigator.userLanguage) !== 'undefined' ? 
                        navigator.userLanguage : 
                        (typeof(navigator.systemLanguage) !== 'undefined' ?
                            navigator.systemLanguage :
                            undefined));
                if (typeof(lang) !== 'undefined' && lang) {
                    // for some reason, MS uses lower case region tags
                    ilib.locale = lang.substring(0,3) + lang.substring(3,5).toUpperCase();
                }
            }
        } else if (typeof(PalmSystem) !== 'undefined' && typeof(PalmSystem.locales) !== 'undefined') {
            // webOS
            if (typeof(PalmSystem.locales.UI) != 'undefined' && PalmSystem.locales.UI.length > 0) {
                ilib.locale = PalmSystem.locales.UI;
            }
        } else if (typeof(environment) !== 'undefined' && typeof(environment.user) !== 'undefined') {
            // running under rhino
            if (typeof(environment.user.language) === 'string' && environment.user.language.length > 0) {
                ilib.locale = environment.user.language;
                if (typeof(environment.user.country) === 'string' && environment.user.country.length > 0) {
                    ilib.locale += '-' + environment.user.country;
                }
            }
        } else if (typeof(process) !== 'undefined' && typeof(process.env) !== 'undefined') {
            // running under nodejs
            var lang = process.env.LANG || process.env.LC_ALL;
            // the LANG variable on unix is in the form "lang_REGION.CHARSET"
            // where language and region are the correct ISO codes separated by
            // an underscore. This translate it back to the BCP-47 form.
            if (lang && lang !== 'undefined') {
                ilib.locale = lang.substring(0,2).toLowerCase() + '-' + lang.substring(3,5).toUpperCase();
            }
        }
             
        ilib.locale = typeof(ilib.locale) === 'string' ? ilib.locale : 'en-US';
    }
    return ilib.locale;
};

/**
 * Sets the default time zone for all of ilib. This time zone will be used when
 * no explicit time zone is passed to any ilib class. If the default time zone
 * is not set, ilib will attempt to use the time zone of the
 * environment it is running in, if it can find that. If not, it will
 * default to the the UTC zone "Etc/UTC".<p>
 * 
 * Depends directive: !depends ilibglobal.js
 * 
 * @static
 * @param {string} tz the name of the time zone to set as the default time zone
 */
ilib.setTimeZone = function (tz) {
    ilib.tz = tz || ilib.tz;
};

/**
 * Return the default time zone for all of ilib if one has been set. This 
 * time zone will be used when no explicit time zone is passed to any ilib 
 * class. If the default time zone
 * is not set, ilib will attempt to use the locale of the
 * environment it is running in, if it can find that. If not, it will
 * default to the the zone "local".<p>
 * 
 * Depends directive: !depends ilibglobal.js
 * 
 * @static
 * @return {string} the default time zone for ilib
 */
ilib.getTimeZone = function() {
    if (typeof(ilib.tz) === 'undefined') {
        if (typeof(navigator) !== 'undefined' && typeof(navigator.timezone) !== 'undefined') {
            // running in a browser
            if (navigator.timezone.length > 0) {
                ilib.tz = navigator.timezone;
            }
        } else if (typeof(PalmSystem) !== 'undefined' && typeof(PalmSystem.timezone) !== 'undefined') {
            // running in webkit on webOS
            if (PalmSystem.timezone.length > 0) {
                ilib.tz = PalmSystem.timezone;
            }
        } else if (typeof(environment) !== 'undefined' && typeof(environment.user) !== 'undefined') {
            // running under rhino
            if (typeof(environment.user.timezone) !== 'undefined' && environment.user.timezone.length > 0) {
                ilib.tz = environment.user.timezone;
            }
        } else if (typeof(process) !== 'undefined' && typeof(process.env) !== 'undefined') {
            // running in nodejs
            if (process.env.TZ && process.env.TZ !== "undefined") {
                ilib.tz = process.env.TZ;
            }
        }
        
        ilib.tz = ilib.tz || "local"; 
    }

    return ilib.tz;
};

/**
 * Defines the interface for the loader class for ilib. The main method of the
 * loader object is loadFiles(), which loads a set of requested locale data files
 * from where-ever it is stored.
 * @interface
 */
ilib.Loader = function() {};

/**
 * Load a set of files from where-ever it is stored.<p>
 * 
 * This is the main function define a callback function for loading missing locale 
 * data or resources.
 * If this copy of ilib is assembled without including the required locale data
 * or resources, then that data can be lazy loaded dynamically when it is 
 * needed by calling this method. Each ilib class will first
 * check for the existence of data under ilib.data, and if it is not there, 
 * it will attempt to load it by calling this method of the laoder, and then place
 * it there.<p>
 * 
 * Suggested implementations of this method might load files 
 * directly from disk under nodejs or rhino, or within web pages, to load 
 * files from the server with XHR calls.<p>
 * 
 * The first parameter to this method, paths, is an array of relative paths within 
 * the ilib dir structure for the 
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
 * var fs = require("fs");
 * 
 * var myLoader = function() {};
 * myLoader.prototype = new ilib.Loader();
 * myLoader.prototype.constructor = myLoader;
 * myLoader.prototype.loadFiles = function(paths, sync, params, callback) {
 *    if (sync) {
 *        var ret = [];
 *        // synchronous load -- just return the result
 *        paths.forEach(function (path) {
 *            var json = fs.readFileSync(path, "utf-8");
 *            ret.push(json ? JSON.parse(json) : undefined);
 *        });
 *        
 *        return ret;
 *    }
 *    this.callback = callback;
 *
 *    // asynchronous
 *    this.results = [];
 *    this._loadFilesAsync(paths);
 * }
 * myLoader.prototype._loadFilesAsync = function (paths) {
 *    if (paths.length > 0) {
 *        var file = paths.shift();
 *        fs.readFile(file, "utf-8", function(err, json) {
 *            this.results.push(err ? undefined : JSON.parse(json));
 *            // call self recursively so that the callback is only called at the end
 *            // when all the files are loaded sequentially
 *            if (paths.length > 0) {
 *                this._loadFilesAsync(paths);
 *            } else {
 *                this.callback(this.results);
 *            }
 *        });
 *     }
 * }
 * 
 * // bind to "this" so that "this" is relative to your own instance
 * ilib.setLoaderCallback(new myLoader());
 * </pre>

 * @param {Array.<string>} paths An array of paths to load from wherever the files are stored 
 * @param {Boolean} sync if true, load the files synchronously, and false means asynchronously
 * @param {Object} params an object with any extra parameters for the loader. These can be 
 * anything. The caller of the ilib class passes these parameters in. Presumably, the code that
 * calls ilib and the code that provides the loader are together and can have a private 
 * agreement between them about what the parameters should contain.
 * @param {function(Object)} callback function to call when the files are all loaded. The 
 * parameter of the callback function is the contents of the files.
 */
ilib.Loader.prototype.loadFiles = function (paths, sync, params, callback) {};

/**
 * Return all files available for loading using this loader instance.
 * This method returns an object where the properties are the paths to
 * directories where files are loaded from and the values are an array
 * of strings containing the relative paths under the directory of each
 * file that can be loaded.<p>
 * 
 * Example:
 *  <pre>
 *  {
 *      "/usr/share/javascript/ilib/locale": [
 *          "dateformats.json",
 *          "aa/dateformats.json",
 *            "af/dateformats.json",
 *            "agq/dateformats.json",
 *            "ak/dateformats.json",
 *            ...
 *          "zxx/dateformats.json"
 *      ]
 *  }
 *  </pre>
 * @returns {Object} a hash containing directory names and
 * paths to file that can be loaded by this loader 
 */
ilib.Loader.prototype.listAvailableFiles = function() {};

/**
 * Return true if the file in the named path is available for loading using
 * this loader. The path may be given as an absolute path, in which case
 * only that file is checked, or as a relative path, in which case, the
 * relative path may appear underneath any of the directories that the loader
 * knows about.
 * @returns {boolean} true if the file in the named path is available for loading, and
 * false otherwise
 */
ilib.Loader.prototype.isAvailable = function(path) {};

/**
 * Set the custom loader used to load ilib's locale data in your environment. 
 * The instance passed in must implement the ilib.Loader interface. See the
 * ilib.Loader class documentation for more information about loaders. 
 * 
 * @static
 * @param {ilib.Loader} loader class to call to access the requested data.
 * @return {boolean} true if the loader was installed correctly, or false
 * if not
 */
ilib.setLoaderCallback = function(loader) {
    // only a basic check
    if ((typeof(loader) === 'object' && loader instanceof ilib.Loader) || 
            typeof(loader) === 'function' || typeof(loader) === 'undefined') {
        // console.log("setting callback loader to " + (loader ? loader.name : "undefined"));
        ilib._load = loader;
        return true;
    }
    return false;
};

/*
 * locale.js - Locale specifier definition
 * 
 * Copyright © 2012-2014, JEDLSoft
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
 * @param {?string|ilib.Locale=} language the ISO 639 2-letter code for the language, or a full 
 * locale spec in BCP-47 format, or another ilib.Locale instance to copy from
 * @param {string=} region the ISO 3166 2-letter code for the region
 * @param {string=} variant the name of the variant of this locale, if any
 * @param {string=} script the ISO 15924 code of the script for this locale, if any
 */
ilib.Locale = function(language, region, variant, script) {
	if (typeof(region) === 'undefined') {
		var spec = language || ilib.getLocale();
		if (typeof(spec) === 'string') {
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
		} else if (typeof(spec) === 'object') {
	        this.language = spec.language || undefined;
	        this.region = spec.region || undefined;
	        this.script = spec.script || undefined;
	        this.variant = spec.variant || undefined;
		}
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
	this._genSpec();
};

// from http://en.wikipedia.org/wiki/ISO_3166-1
ilib.Locale.a2toa3regmap = {
	"AF": "AFG",
	"AX": "ALA",
	"AL": "ALB",
	"DZ": "DZA",
	"AS": "ASM",
	"AD": "AND",
	"AO": "AGO",
	"AI": "AIA",
	"AQ": "ATA",
	"AG": "ATG",
	"AR": "ARG",
	"AM": "ARM",
	"AW": "ABW",
	"AU": "AUS",
	"AT": "AUT",
	"AZ": "AZE",
	"BS": "BHS",
	"BH": "BHR",
	"BD": "BGD",
	"BB": "BRB",
	"BY": "BLR",
	"BE": "BEL",
	"BZ": "BLZ",
	"BJ": "BEN",
	"BM": "BMU",
	"BT": "BTN",
	"BO": "BOL",
	"BQ": "BES",
	"BA": "BIH",
	"BW": "BWA",
	"BV": "BVT",
	"BR": "BRA",
	"IO": "IOT",
	"BN": "BRN",
	"BG": "BGR",
	"BF": "BFA",
	"BI": "BDI",
	"KH": "KHM",
	"CM": "CMR",
	"CA": "CAN",
	"CV": "CPV",
	"KY": "CYM",
	"CF": "CAF",
	"TD": "TCD",
	"CL": "CHL",
	"CN": "CHN",
	"CX": "CXR",
	"CC": "CCK",
	"CO": "COL",
	"KM": "COM",
	"CG": "COG",
	"CD": "COD",
	"CK": "COK",
	"CR": "CRI",
	"CI": "CIV",
	"HR": "HRV",
	"CU": "CUB",
	"CW": "CUW",
	"CY": "CYP",
	"CZ": "CZE",
	"DK": "DNK",
	"DJ": "DJI",
	"DM": "DMA",
	"DO": "DOM",
	"EC": "ECU",
	"EG": "EGY",
	"SV": "SLV",
	"GQ": "GNQ",
	"ER": "ERI",
	"EE": "EST",
	"ET": "ETH",
	"FK": "FLK",
	"FO": "FRO",
	"FJ": "FJI",
	"FI": "FIN",
	"FR": "FRA",
	"GF": "GUF",
	"PF": "PYF",
	"TF": "ATF",
	"GA": "GAB",
	"GM": "GMB",
	"GE": "GEO",
	"DE": "DEU",
	"GH": "GHA",
	"GI": "GIB",
	"GR": "GRC",
	"GL": "GRL",
	"GD": "GRD",
	"GP": "GLP",
	"GU": "GUM",
	"GT": "GTM",
	"GG": "GGY",
	"GN": "GIN",
	"GW": "GNB",
	"GY": "GUY",
	"HT": "HTI",
	"HM": "HMD",
	"VA": "VAT",
	"HN": "HND",
	"HK": "HKG",
	"HU": "HUN",
	"IS": "ISL",
	"IN": "IND",
	"ID": "IDN",
	"IR": "IRN",
	"IQ": "IRQ",
	"IE": "IRL",
	"IM": "IMN",
	"IL": "ISR",
	"IT": "ITA",
	"JM": "JAM",
	"JP": "JPN",
	"JE": "JEY",
	"JO": "JOR",
	"KZ": "KAZ",
	"KE": "KEN",
	"KI": "KIR",
	"KP": "PRK",
	"KR": "KOR",
	"KW": "KWT",
	"KG": "KGZ",
	"LA": "LAO",
	"LV": "LVA",
	"LB": "LBN",
	"LS": "LSO",
	"LR": "LBR",
	"LY": "LBY",
	"LI": "LIE",
	"LT": "LTU",
	"LU": "LUX",
	"MO": "MAC",
	"MK": "MKD",
	"MG": "MDG",
	"MW": "MWI",
	"MY": "MYS",
	"MV": "MDV",
	"ML": "MLI",
	"MT": "MLT",
	"MH": "MHL",
	"MQ": "MTQ",
	"MR": "MRT",
	"MU": "MUS",
	"YT": "MYT",
	"MX": "MEX",
	"FM": "FSM",
	"MD": "MDA",
	"MC": "MCO",
	"MN": "MNG",
	"ME": "MNE",
	"MS": "MSR",
	"MA": "MAR",
	"MZ": "MOZ",
	"MM": "MMR",
	"NA": "NAM",
	"NR": "NRU",
	"NP": "NPL",
	"NL": "NLD",
	"NC": "NCL",
	"NZ": "NZL",
	"NI": "NIC",
	"NE": "NER",
	"NG": "NGA",
	"NU": "NIU",
	"NF": "NFK",
	"MP": "MNP",
	"NO": "NOR",
	"OM": "OMN",
	"PK": "PAK",
	"PW": "PLW",
	"PS": "PSE",
	"PA": "PAN",
	"PG": "PNG",
	"PY": "PRY",
	"PE": "PER",
	"PH": "PHL",
	"PN": "PCN",
	"PL": "POL",
	"PT": "PRT",
	"PR": "PRI",
	"QA": "QAT",
	"RE": "REU",
	"RO": "ROU",
	"RU": "RUS",
	"RW": "RWA",
	"BL": "BLM",
	"SH": "SHN",
	"KN": "KNA",
	"LC": "LCA",
	"MF": "MAF",
	"PM": "SPM",
	"VC": "VCT",
	"WS": "WSM",
	"SM": "SMR",
	"ST": "STP",
	"SA": "SAU",
	"SN": "SEN",
	"RS": "SRB",
	"SC": "SYC",
	"SL": "SLE",
	"SG": "SGP",
	"SX": "SXM",
	"SK": "SVK",
	"SI": "SVN",
	"SB": "SLB",
	"SO": "SOM",
	"ZA": "ZAF",
	"GS": "SGS",
	"SS": "SSD",
	"ES": "ESP",
	"LK": "LKA",
	"SD": "SDN",
	"SR": "SUR",
	"SJ": "SJM",
	"SZ": "SWZ",
	"SE": "SWE",
	"CH": "CHE",
	"SY": "SYR",
	"TW": "TWN",
	"TJ": "TJK",
	"TZ": "TZA",
	"TH": "THA",
	"TL": "TLS",
	"TG": "TGO",
	"TK": "TKL",
	"TO": "TON",
	"TT": "TTO",
	"TN": "TUN",
	"TR": "TUR",
	"TM": "TKM",
	"TC": "TCA",
	"TV": "TUV",
	"UG": "UGA",
	"UA": "UKR",
	"AE": "ARE",
	"GB": "GBR",
	"US": "USA",
	"UM": "UMI",
	"UY": "URY",
	"UZ": "UZB",
	"VU": "VUT",
	"VE": "VEN",
	"VN": "VNM",
	"VG": "VGB",
	"VI": "VIR",
	"WF": "WLF",
	"EH": "ESH",
	"YE": "YEM",
	"ZM": "ZMB",
	"ZW": "ZWE"
};


ilib.Locale.a1toa3langmap = {
	"ab": "abk",
	"aa": "aar",
	"af": "afr",
	"ak": "aka",
	"sq": "sqi",
	"am": "amh",
	"ar": "ara",
	"an": "arg",
	"hy": "hye",
	"as": "asm",
	"av": "ava",
	"ae": "ave",
	"ay": "aym",
	"az": "aze",
	"bm": "bam",
	"ba": "bak",
	"eu": "eus",
	"be": "bel",
	"bn": "ben",
	"bh": "bih",
	"bi": "bis",
	"bs": "bos",
	"br": "bre",
	"bg": "bul",
	"my": "mya",
	"ca": "cat",
	"ch": "cha",
	"ce": "che",
	"ny": "nya",
	"zh": "zho",
	"cv": "chv",
	"kw": "cor",
	"co": "cos",
	"cr": "cre",
	"hr": "hrv",
	"cs": "ces",
	"da": "dan",
	"dv": "div",
	"nl": "nld",
	"dz": "dzo",
	"en": "eng",
	"eo": "epo",
	"et": "est",
	"ee": "ewe",
	"fo": "fao",
	"fj": "fij",
	"fi": "fin",
	"fr": "fra",
	"ff": "ful",
	"gl": "glg",
	"ka": "kat",
	"de": "deu",
	"el": "ell",
	"gn": "grn",
	"gu": "guj",
	"ht": "hat",
	"ha": "hau",
	"he": "heb",
	"hz": "her",
	"hi": "hin",
	"ho": "hmo",
	"hu": "hun",
	"ia": "ina",
	"id": "ind",
	"ie": "ile",
	"ga": "gle",
	"ig": "ibo",
	"ik": "ipk",
	"io": "ido",
	"is": "isl",
	"it": "ita",
	"iu": "iku",
	"ja": "jpn",
	"jv": "jav",
	"kl": "kal",
	"kn": "kan",
	"kr": "kau",
	"ks": "kas",
	"kk": "kaz",
	"km": "khm",
	"ki": "kik",
	"rw": "kin",
	"ky": "kir",
	"kv": "kom",
	"kg": "kon",
	"ko": "kor",
	"ku": "kur",
	"kj": "kua",
	"la": "lat",
	"lb": "ltz",
	"lg": "lug",
	"li": "lim",
	"ln": "lin",
	"lo": "lao",
	"lt": "lit",
	"lu": "lub",
	"lv": "lav",
	"gv": "glv",
	"mk": "mkd",
	"mg": "mlg",
	"ms": "msa",
	"ml": "mal",
	"mt": "mlt",
	"mi": "mri",
	"mr": "mar",
	"mh": "mah",
	"mn": "mon",
	"na": "nau",
	"nv": "nav",
	"nb": "nob",
	"nd": "nde",
	"ne": "nep",
	"ng": "ndo",
	"nn": "nno",
	"no": "nor",
	"ii": "iii",
	"nr": "nbl",
	"oc": "oci",
	"oj": "oji",
	"cu": "chu",
	"om": "orm",
	"or": "ori",
	"os": "oss",
	"pa": "pan",
	"pi": "pli",
	"fa": "fas",
	"pl": "pol",
	"ps": "pus",
	"pt": "por",
	"qu": "que",
	"rm": "roh",
	"rn": "run",
	"ro": "ron",
	"ru": "rus",
	"sa": "san",
	"sc": "srd",
	"sd": "snd",
	"se": "sme",
	"sm": "smo",
	"sg": "sag",
	"sr": "srp",
	"gd": "gla",
	"sn": "sna",
	"si": "sin",
	"sk": "slk",
	"sl": "slv",
	"so": "som",
	"st": "sot",
	"az": "azb",
	"es": "spa",
	"su": "sun",
	"sw": "swa",
	"ss": "ssw",
	"sv": "swe",
	"ta": "tam",
	"te": "tel",
	"tg": "tgk",
	"th": "tha",
	"ti": "tir",
	"bo": "bod",
	"tk": "tuk",
	"tl": "tgl",
	"tn": "tsn",
	"to": "ton",
	"tr": "tur",
	"ts": "tso",
	"tt": "tat",
	"tw": "twi",
	"ty": "tah",
	"ug": "uig",
	"uk": "ukr",
	"ur": "urd",
	"uz": "uzb",
	"ve": "ven",
	"vi": "vie",
	"vo": "vol",
	"wa": "wln",
	"cy": "cym",
	"wo": "wol",
	"fy": "fry",
	"xh": "xho",
	"yi": "yid",
	"yo": "yor",
	"za": "zha",
	"zu": "zul"
};

/**
 * Tell whether or not the str does not start with a lower case ASCII char.
 * @private
 * @param {string} str the char to check
 * @return {boolean} true if the char is not a lower case ASCII char
 */
ilib.Locale._notLower = function(str) {
	// do this with ASCII only so we don't have to depend on the CType functions
	var ch = str.charCodeAt(0);
	return ch < 97 || ch > 122;
};

/**
 * Tell whether or not the str does not start with an upper case ASCII char.
 * @private
 * @param {string} str the char to check
 * @return {boolean} true if the char is a not an upper case ASCII char
 */
ilib.Locale._notUpper = function(str) {
	// do this with ASCII only so we don't have to depend on the CType functions
	var ch = str.charCodeAt(0);
	return ch < 65 || ch > 90;
};

/**
 * Tell whether or not the str does not start with a digit char.
 * @private
 * @param {string} str the char to check
 * @return {boolean} true if the char is a not an upper case ASCII char
 */
ilib.Locale._notDigit = function(str) {
	// do this with ASCII only so we don't have to depend on the CType functions
	var ch = str.charCodeAt(0);
	return ch < 48 || ch > 57;
};

/**
 * Tell whether or not the given string has the correct syntax to be 
 * an ISO 639 language code.
 * 
 * @private
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
 * Tell whether or not the given string has the correct syntax to be 
 * an ISO 3166 2-letter region code or M.49 3-digit region code.
 * 
 * @private
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
 * Tell whether or not the given string has the correct syntax to be 
 * an ISO 639 language code.
 * 
 * @private
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

/**
 * Return the ISO-3166 alpha3 equivalent region code for the given ISO 3166 alpha2
 * region code. If the given alpha2 code is not found, this function returns its
 * argument unchanged.
 * @static
 * @param {string|undefined} alpha2 the alpha2 code to map
 * @return {string|undefined} the alpha3 equivalent of the given alpha2 code, or the alpha2
 * parameter if the alpha2 value is not found
 */
ilib.Locale.regionAlpha2ToAlpha3 = function(alpha2) {
	return ilib.Locale.a2toa3regmap[alpha2] || alpha2;
};

/**
 * Return the ISO-639 alpha3 equivalent language code for the given ISO 639 alpha1
 * language code. If the given alpha1 code is not found, this function returns its
 * argument unchanged.
 * @static
 * @param {string|undefined} alpha1 the alpha1 code to map
 * @return {string|undefined} the alpha3 equivalent of the given alpha1 code, or the alpha1
 * parameter if the alpha1 value is not found
 */
ilib.Locale.languageAlpha1ToAlpha3 = function(alpha1) {
	return ilib.Locale.a1toa3langmap[alpha1] || alpha1;
};

ilib.Locale.prototype = {
	/**
	 * @private
	 */
	_genSpec: function () {
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
	},

	/**
	 * Return the ISO 639 language code for this locale. 
	 * @return {string|undefined} the language code for this locale 
	 */
	getLanguage: function() {
		return this.language;
	},
	
	/**
	 * Return the language of this locale as an ISO-639-alpha3 language code
	 * @return {string|undefined} the alpha3 language code of this locale
	 */
	getLanguageAlpha3: function() {
		return ilib.Locale.languageAlpha1ToAlpha3(this.language);
	},
	
	/**
	 * Return the ISO 3166 region code for this locale.
	 * @return {string|undefined} the region code of this locale
	 */
	getRegion: function() {
		return this.region;
	},
	
	/**
	 * Return the region of this locale as an ISO-3166-alpha3 region code
	 * @return {string|undefined} the alpha3 region code of this locale
	 */
	getRegionAlpha3: function() {
		return ilib.Locale.regionAlpha2ToAlpha3(this.region);
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
		var localeName = this.language + "-" + this.region;
		return ilib.pseudoLocales.indexOf(localeName) > -1;
	}
};

// static functions
/**
 * @private
 */
ilib.Locale.locales = [
	
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
 * localeinfo.js - Encode locale-specific defaults
 * 
 * Copyright © 2012-2014, JEDLSoft
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

// !data localeinfo

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
 * <li><i>onLoad</i> - a callback function to call when the locale info object is fully 
 * loaded. When the onLoad option is given, the localeinfo object will attempt to
 * load any missing locale data using the ilib loader callback.
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
	var sync = true,
	    loadParams = undefined;
	
	/* these are all the defaults. Essentially, en-US */
	/**
	  @private 
	  @type {{
		scripts:Array.<string>,
		timezone:string,
		units:string,
		calendar:string,
		clock:string,
		currency:string,
		firstDayOfWeek:number,
		weekendStart:number,
		weekendEnd:number,
		unitfmt: {long:string,short:string},
		numfmt:Object.<{
			currencyFormats:Object.<{common:string,commonNegative:string,iso:string,isoNegative:string}>,
			script:string,
			decimalChar:string,
			groupChar:string,
			prigroupSize:number,
			secgroupSize:number,
			negativenumFmt:string,
			pctFmt:string,
			negativepctFmt:string,
			pctChar:string,
			roundingMode:string,
			exponential:string,
			digits:string
		}>
	  }}
	*/
	this.info = ilib.LocaleInfo.defaultInfo;
	
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
			loadParams = options.loadParams;
		}
	}

	if (!ilib.LocaleInfo.cache) {
		ilib.LocaleInfo.cache = {};
	}

	ilib.loadData({
		object: ilib.LocaleInfo, 
		locale: this.locale, 
		name: "localeinfo.json", 
		sync: sync, 
		loadParams: loadParams, 
		callback: ilib.bind(this, function (info) {
			if (!info) {
				info = ilib.LocaleInfo.defaultInfo;
				var spec = this.locale.getSpec().replace(/-/g, "_");
				ilib.LocaleInfo.cache[spec] = info;
			}
			this.info = info;
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
		})
	});
};

ilib.LocaleInfo.defaultInfo = /** @type {{
	scripts:Array.<string>,
	timezone:string,
	units:string,
	calendar:string,
	clock:string,
	currency:string,
	firstDayOfWeek:number,
	weekendStart:number,
	weekendEnd:number,
	unitfmt: {long:string,short:string},
	numfmt:Object.<{
		currencyFormats:Object.<{
			common:string,
			commonNegative:string,
			iso:string,
			isoNegative:string
		}>,
		script:string,
		decimalChar:string,
		groupChar:string,
		prigroupSize:number,
		secgroupSize:number,
		negativenumFmt:string,
		pctFmt:string,
		negativepctFmt:string,
		pctChar:string,
		roundingMode:string,
		exponential:string,
		digits:string
	}>
}}*/ ilib.data.localeinfo;
ilib.LocaleInfo.defaultInfo = ilib.LocaleInfo.defaultInfo || {
	"scripts": ["Latn"],
    "timezone": "Etc/UTC",
    "units": "metric",
    "calendar": "gregorian",
    "clock": "24",
    "currency": "USD",
    "firstDayOfWeek": 1,
    "numfmt": {
        "currencyFormats": {
            "common": "{s}{n}",
            "commonNegative": "{s}-{n}",
            "iso": "{s}{n}",
            "isoNegative": "{s}-{n}"
        },
        "script": "Latn",
        "decimalChar": ",",
        "groupChar": ".",
        "prigroupSize": 3,
        "secgroupSize": 0,
        "pctFmt": "{n}%",
        "negativepctFmt": "-{n}%",
        "pctChar": "%",
        "roundingMode": "halfdown",
        "exponential": "e",
        "digits": ""
    }
};

ilib.LocaleInfo.prototype = {
    /**
     * Return the name of the locale's language in English.
     * @returns {string} the name of the locale's language in English
     */
    getLanguageName: function () {
    	return this.info["language.name"];	
    },
    
    /**
     * Return the name of the locale's region in English. If the locale
     * has no region, this returns undefined.
     * 
     * @returns {string|undefined} the name of the locale's region in English
     */
    getRegionName: function () {
    	return this.info["region.name"];	
    },

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
        
        getUnitFormat: function () {
                return this.info.unitfmt;
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
	 * Return the day of week that starts weekend in the current locale. Days are still
	 * numbered the standard way with 0 for Sunday through 6 for Saturday.
	 * 
	 * @returns {number} the day of the week that starts weeks in the current locale.
	 */
	getWeekEndStart: function () {
		return this.info.weekendStart;
	},

	/**
	 * Return the day of week that starts weekend in the current locale. Days are still
	 * numbered the standard way with 0 for Sunday through 6 for Saturday.
	 * 
	 * @returns {number} the day of the week that starts weeks in the current locale.
	 */
	getWeekEndEnd: function () {
		return this.info.weekendEnd;
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
	 * Return the decimal separator for formatted numbers in this locale for native script.
	 * @returns {string} the decimal separator char
	 */
	getNativeDecimalSeparator: function () {
		return (this.info.native_numfmt && this.info.native_numfmt.decimalChar) || this.info.numfmt.decimalChar;
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
	 * Return the separator character used to separate groups of digits on the 
	 * integer side of the decimal character for the native script if present other than the default script.
	 * @returns {string} the grouping separator char
	 */
	getNativeGroupingSeparator: function () {
		return (this.info.native_numfmt && this.info.native_numfmt.groupChar) || this.info.numfmt.groupChar;
	},
	
	/**
	 * Return the minimum number of digits grouped together on the integer side 
	 * for the first (primary) group. 
	 * In western European cultures, groupings are in 1000s, so the number of digits
	 * is 3. 
	 * @returns {number} the number of digits in a primary grouping, or 0 for no grouping
	 */
	getPrimaryGroupingDigits: function () {
		return (typeof(this.info.numfmt.prigroupSize) !== 'undefined' && this.info.numfmt.prigroupSize) || 0;
	},

	/**
	 * Return the minimum number of digits grouped together on the integer side
	 * for the second or more (secondary) group.<p>
	 *   
	 * In western European cultures, all groupings are by 1000s, so the secondary
	 * size should be 0 because there is no secondary size. In general, if this 
	 * method returns 0, then all groupings are of the primary size.<p> 
	 * 
	 * For some other cultures, the first grouping (primary)
	 * is 3 and any subsequent groupings (secondary) are two. So, 100000 would be
	 * written as: "1,00,000".
	 * 
	 * @returns {number} the number of digits in a secondary grouping, or 0 for no 
	 * secondary grouping. 
	 */
	getSecondaryGroupingDigits: function () {
		return this.info.numfmt.secgroupSize || 0;
	},

	/**
	 * Return the format template used to format percentages in this locale.
	 * @returns {string} the format template for formatting percentages
	 */
	getPercentageFormat: function () {
		return this.info.numfmt.pctFmt;
	},

	/**
	 * Return the format template used to format percentages in this locale
	 * with negative amounts.
	 * @returns {string} the format template for formatting percentages
	 */
	getNegativePercentageFormat: function () {
		return this.info.numfmt.negativepctFmt;
	},

	/**
	 * Return the symbol used for percentages in this locale.
	 * @returns {string} the symbol used for percentages in this locale
	 */
	getPercentageSymbol: function () {
		return this.info.numfmt.pctChar || "%";
	},

	/**
	 * Return the symbol used for exponential in this locale.
	 * @returns {string} the symbol used for exponential in this locale
	 */
	getExponential: function () {
		return this.info.numfmt.exponential;
	},

	/**
	 * Return the symbol used for exponential in this locale for native script.
	 * @returns {string} the symbol used for exponential in this locale for native script
	 */
	getNativeExponential: function () {
		return (this.info.native_numfmt && this.info.native_numfmt.exponential) || this.info.numfmt.exponential;
	},

	/**
	 * Return the symbol used for percentages in this locale for native script.
	 * @returns {string} the symbol used for percentages in this locale for native script
	 */
	getNativePercentageSymbol: function () {
		return (this.info.native_numfmt && this.info.native_numfmt.pctChar) || this.info.numfmt.pctChar || "%";
	
	},
	/**
	 * Return the format template used to format negative numbers in this locale.
	 * @returns {string} the format template for formatting negative numbers
	 */
	getNegativeNumberFormat: function () { 
		return this.info.numfmt.negativenumFmt;
	},
	
	/**
	 * Return an object containing the format templates for formatting currencies
	 * in this locale. The object has a number of properties in it that each are
	 * a particular style of format. Normally, this contains a "common" and an "iso"
	 * style, but may contain others in the future.
	 * @returns {Object} an object containing the format templates for currencies
	 */
	getCurrencyFormats: function () {
		return this.info.numfmt.currencyFormats;
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
	 * Return a string that describes the style of digits used by this locale.
	 * Possible return values are:
	 * <ul>
	 * <li><i>western</i> - uses the regular western 10-based digits 0 through 9
	 * <li><i>optional</i> - native 10-based digits exist, but in modern usage,
	 * this locale most often uses western digits
	 * <li><i>native</i> - native 10-based native digits exist and are used
	 * regularly by this locale
	 * <li><i>custom</i> - uses native digits by default that are not 10-based
	 * </ul>
	 * @returns {string} string that describes the style of digits used in this locale
	 */
	getDigitsStyle: function () {
		if (this.info.numfmt.useNative) {
			return "native";
		}
		if (typeof(this.info.native_numfmt) !== 'undefined') {
			return "optional";
		}
		return "western";
	},
	
	/**
	 * Return the digits of the default script if they are defined.
	 * If not defined, the default should be the regular "Arabic numerals"
	 * used in the Latin script. (0-9)
	 * @returns {string|undefined} the digits used in the default script 
	 */
	getDigits: function () {
		return this.info.numfmt.digits;
	},
	
	/**
	 * Return the digits of the native script if they are defined. 
	 * @returns {string|undefined} the digits used in the default script 
	 */
	getNativeDigits: function () {
		return (this.info.numfmt.useNative && this.info.numfmt.digits) || (this.info.native_numfmt && this.info.native_numfmt.digits);
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
	}
};

/*
 * date.js - Represent a date in any calendar. This class is subclassed for each calendar.
 * 
 * Copyright © 2012-2014, JEDLSoft
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

/* !depends ilibglobal.js localeinfo.js */

/**
 * @class
 * Construct a new date object. Each parameter is a numeric value, but its 
 * accepted range can vary depending on the subclass of this date. For example,
 * Gregorian months can be from 1 to 12, whereas months in the Hebrew calendar
 * can be from 1 to 13.<p>
 * 
 * Note that this really calls the newInstance factory method underneath in 
 * order to instantiate the correct subclass of ilib.Date.
 * 
 * Depends directive: !depends date.js
 * 
 * @constructor
 * @param {Object=} options The date components to initialize this date with
 */
ilib.Date = function(options) {
	if (!options || typeof(options.noinstance) === 'undefined') {
		return ilib.Date.newInstance(options);
	}
};

/**
 * Factory method to create a new instance of a date subclass.<p>
 * 
 * The options parameter can be an object that contains the following
 * properties:
 * 
 * <ul>
 * <li><i>type</i> - specify the type/calendar of the date desired. The
 * list of valid values changes depending on which calendars are 
 * defined. When assembling your iliball.js, include those date type 
 * you wish to use in your program or web page, and they will register 
 * themselves with this factory method. The "gregorian",
 * and "julian" calendars are all included by default, as they are the
 * standard calendars for much of the world. If not specified, the type
 * of the date returned is the one that is appropriate for the locale.
 * This property may also be given as "calendar" instead of "type".
 * </ul>
 * 
 * The options object is also passed down to the date constructor, and 
 * thus can contain the the properties as the date object being instantiated.
 * See the documentation for {@link ilib.Date.GregDate}, and other
 * subclasses for more details on other parameter that may be passed in.<p>
 * 
 * Please note that if you do not give the type parameter, this factory
 * method will create a date object that is appropriate for the calendar
 * that is most commonly used in the specified or current ilib locale. 
 * For example, in Thailand, the most common calendar is the Thai solar 
 * calendar. If the current locale is "th-TH" (Thai for Thailand) and you 
 * use this factory method to construct a new date without specifying the
 * type, it will automatically give you back an instance of 
 * {@link ilib.Date.ThaiSolarDate}. This is convenient because you do not 
 * need to know which locales use which types of dates. In fact, you 
 * should always use this factory method to make new date instances unless
 * you know that you specifically need a date in a particular calendar.<p>
 * 
 * Also note that when you pass in the date components such as year, month,
 * day, etc., these components should be appropriate for the given date
 * being instantiated. That is, in our Thai example in the previous
 * paragraph, the year and such should be given as a Thai solar year, not
 * the Gregorian year that you get from the Javascript Date class. In
 * order to initialize a date instance when you don't know what subclass
 * will be instantiated for the locale, use a parameter such as "unixtime" 
 * or "julianday" which are unambiguous and based on UTC time, instead of
 * the year/month/date date components. The date components for that UTC 
 * time will be calculated and the time zone offset will be automatically 
 * factored in.
 *  
 * @param {Object=} options options controlling the construction of this instance, or
 * undefined to use the default options
 * @return {ilib.Date} an instance of a calendar object of the appropriate type 
 */
ilib.Date.newInstance = function(options) {
	var locale = options && options.locale,
		type = options && (options.type || options.calendar),
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

/**
 * Convert JavaScript Date objects and other types into native ilib Dates. This accepts any
 * string or number that can be translated by the JavaScript Date class,
 * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)
 * any JavaScript Date classed object, any ilib.Date subclass, an ilib.JulianDay object, an object
 * containing the normal options to initialize an ilib.Date instance, or null (will 
 * return null or undefined if input is null or undefined). Normal output is 
 * a standard native subclass of the ilib Date object as appropriate for the locale.
 * 
 * @static
 * @private
 * @param  {ilib.Date|Object|ilib.JulianDay|Date|string|number=} inDate The input date object, string or Number.
 * @param  {ilib.String|string=} timezone timezone to use if a new date object is created
 * @return {ilib.Date|null|undefined} an ilib.Date subclass equivalent to the given inDate
 */
ilib.Date._dateToIlib = function(inDate, timezone) {
	if (typeof(inDate) === 'undefined' || inDate === null) {
		return inDate;
	}
	if (inDate instanceof ilib.Date) {
		return inDate;
	}
	if (inDate instanceof Date) {
		return ilib.Date.newInstance({
			unixtime: inDate.getTime(),
			timezone: timezone
		});
	}
	if (inDate instanceof ilib.JulianDay) {
		return ilib.Date.newInstance({
			jd: inDate,
			timezone: timezone
		});
	}
	if (typeof(inDate) === 'number') {
		return ilib.Date.newInstance({
			unixtime: inDate,
			timezone: timezone
		});
	}
	if (typeof(inDate) === 'object') {
		return ilib.Date.newInstance(inDate);
	}
	if (typeof(inDate) === 'string') {
		inDate = new Date(inDate);
	}
	return ilib.Date.newInstance({
		unixtime: inDate.getTime(),
		timezone: timezone
	});
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
	
	/**
	 * Return the unix time equivalent to this date instance. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970 UTC (Gregorian). This 
	 * method only returns a valid number for dates between midnight, 
	 * Jan 1, 1970 UTC (Gregorian) and Jan 19, 2038 at 3:14:07am UTC (Gregorian) when 
	 * the unix time runs out. If this instance encodes a date outside of that range, 
	 * this method will return -1. For date types that are not Gregorian, the point 
	 * in time represented by this date object will only give a return value if it
	 * is in the correct range in the Gregorian calendar as given previously.
	 * 
	 * @return {number} a number giving the unix time, or -1 if the date is outside the
	 * valid unix time range
	 */
	getTime: function() {
		return this.rd.getTime(); 
	},
	
	/**
	 * Return the extended unix time equivalent to this Gregorian date instance. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970 UTC. Traditionally unix time
	 * (or the type "time_t" in C/C++) is only encoded with an unsigned 32 bit integer, and thus 
	 * runs out on Jan 19, 2038. However, most Javascript engines encode numbers well above 
	 * 32 bits and the Date object allows you to encode up to 100 million days worth of time 
	 * after Jan 1, 1970, and even more interestingly, 100 million days worth of time before
	 * Jan 1, 1970 as well. This method returns the number of milliseconds in that extended 
	 * range. If this instance encodes a date outside of that range, this method will return
	 * NaN.
	 * 
	 * @return {number} a number giving the extended unix time, or Nan if the date is outside 
	 * the valid extended unix time range
	 */
	getTimeExtended: function() {
		return this.rd.getTimeExtended();
	},

	/**
	 * Set the time of this instance according to the given unix time. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970.
	 * 
	 * @param {number} millis the unix time to set this date to in milliseconds 
	 */
	setTime: function(millis) {
		this.rd = this.newRd({
			unixtime: millis,
			cal: this.cal
		});
		this._calcDateComponents();
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
		this.day = parseInt(day, 10) || 1;
		this.rd._setDateComponents(this);
	},
	setMonths: function(month) {
		this.month = parseInt(month, 10) || 1;
		this.rd._setDateComponents(this);
	},
	setYears: function(year) {
		this.year = parseInt(year, 10) || 0;
		this.rd._setDateComponents(this);
	},
	
	setHours: function(hour) {
		this.hour = parseInt(hour, 10) || 0;
		this.rd._setDateComponents(this);
	},
	setMinutes: function(minute) {
		this.minute = parseInt(minute, 10) || 0;
		this.rd._setDateComponents(this);
	},
	setSeconds: function(second) {
		this.second = parseInt(second, 10) || 0;
		this.rd._setDateComponents(this);
	},
	setMilliseconds: function(milli) {
		this.millisecond = parseInt(milli, 10) || 0;
		this.rd._setDateComponents(this);
	},
	
	/**
	 * Return a new date instance in the current calendar that represents the first instance 
	 * of the given day of the week before the current date. The day of the week is encoded
	 * as a number where 0 = Sunday, 1 = Monday, etc.
	 * 
	 * @param {number} dow the day of the week before the current date that is being sought
	 * @return {ilib.Date} the date being sought
	 */
	before: function (dow) {
		return this.cal.newDateInstance({
			rd: this.rd.before(dow, this.offset),
			timezone: this.timezone
		});
	},
	
	/**
	 * Return a new date instance in the current calendar that represents the first instance 
	 * of the given day of the week after the current date. The day of the week is encoded
	 * as a number where 0 = Sunday, 1 = Monday, etc.
	 * 
	 * @param {number} dow the day of the week after the current date that is being sought
	 * @return {ilib.Date} the date being sought
	 */
	after: function (dow) {
		return this.cal.newDateInstance({
			rd: this.rd.after(dow, this.offset),
			timezone: this.timezone
		});
	},

	/**
	 * Return a new Gregorian date instance that represents the first instance of the 
	 * given day of the week on or before the current date. The day of the week is encoded
	 * as a number where 0 = Sunday, 1 = Monday, etc.
	 * 
	 * @param {number} dow the day of the week on or before the current date that is being sought
	 * @return {ilib.Date} the date being sought
	 */
	onOrBefore: function (dow) {
		return this.cal.newDateInstance({
			rd: this.rd.onOrBefore(dow, this.offset),
			timezone: this.timezone
		});
	},

	/**
	 * Return a new Gregorian date instance that represents the first instance of the 
	 * given day of the week on or after the current date. The day of the week is encoded
	 * as a number where 0 = Sunday, 1 = Monday, etc.
	 * 
	 * @param {number} dow the day of the week on or after the current date that is being sought
	 * @return {ilib.Date} the date being sought
	 */
	onOrAfter: function (dow) {
		return this.cal.newDateInstance({
			rd: this.rd.onOrAfter(dow, this.offset),
			timezone: this.timezone
		});
	},
	
	/**
	 * Return a Javascript Date object that is equivalent to this date
	 * object.
	 * 
	 * @return {Date|undefined} a javascript Date object
	 */
	getJSDate: function() {
		var unix = this.rd.getTimeExtended();
		return isNaN(unix) ? undefined : new Date(unix); 
	},
	
	/**
	 * Return the Rata Die (fixed day) number of this date.
	 * 
	 * @protected
	 * @return {number} the rd date as a number
	 */
	getRataDie: function() {
		return this.rd.getRataDie();
	},
	
	/**
	 * Set the date components of this instance based on the given rd.
	 * @protected
	 * @param {number} rd the rata die date to set
	 */
	setRd: function (rd) {
		this.rd = this.newRd({
			rd: rd,
			cal: this.cal
		});
		this._calcDateComponents();
	},
	
	/**
	 * Return the Julian Day equivalent to this calendar date as a number.
	 * 
	 * @return {number} the julian date equivalent of this date
	 */
	getJulianDay: function() {
		return this.rd.getJulianDay();
	},
	
	/**
	 * Set the date of this instance using a Julian Day.
	 * @param {number|ilib.JulianDay} date the Julian Day to use to set this date
	 */
	setJulianDay: function (date) {
		this.rd = this.newRd({
			julianday: (typeof(date) === 'object') ? date.getDate() : date,
			cal: this.cal
		});
		this._calcDateComponents();
	},

	/**
	 * Return the time zone associated with this date, or 
	 * undefined if none was specified in the constructor.
	 * 
	 * @return {string|undefined} the name of the time zone for this date instance
	 */
	getTimeZone: function() {
		return this.timezone || "local";
	},
	
	/**
	 * Set the time zone associated with this date.
	 * @param {string=} tzName the name of the time zone to set into this date instance,
	 * or "undefined" to unset the time zone 
	 */
	setTimeZone: function (tzName) {
		if (!tzName || tzName === "") {
			// same as undefining it
			this.timezone = undefined;
			this.tz = undefined;
		} else if (typeof(tzName) === 'string') {
			this.timezone = tzName;
			this.tz = undefined;
			// assuming the same UTC time, but a new time zone, now we have to 
			// recalculate what the date components are
			this._calcDateComponents();
		}
	},
	
	/**
	 * Return the rd number of the first Sunday of the given ISO year.
	 * @protected
	 * @param {number} year the year for which the first Sunday is being sought
	 * @return {number} the rd of the first Sunday of the ISO year
	 */
	firstSunday: function (year) {
		var firstDay = this.newRd({
			year: year,
			month: 1,
			day: 1,
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0,
			cal: this.cal
		});
		var firstThu = this.newRd({
			rd: firstDay.onOrAfter(4),
			cal: this.cal
		});
		return firstThu.before(0);
	},
	
	/**
	 * Return the ISO 8601 week number in the current year for the current date. The week
	 * number ranges from 0 to 55, as some years have 55 weeks assigned to them in some
	 * calendars.
	 * 
	 * @return {number} the week number for the current date
	 */
	getWeekOfYear: function() {
		var rd = Math.floor(this.rd.getRataDie());
		var year = this._calcYear(rd + this.offset);
		var yearStart = this.firstSunday(year);
		var nextYear;
		
		// if we have a January date, it may be in this ISO year or the previous year
		if (rd < yearStart) {
			yearStart = this.firstSunday(year-1);
		} else {
			// if we have a late December date, it may be in this ISO year, or the next year
			nextYear = this.firstSunday(year+1);
			if (rd >= nextYear) {
				yearStart = nextYear;
			}
		}
		
		return Math.floor((rd-yearStart)/7) + 1;
	},
	
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
	getWeekOfMonth: function(locale) {
		var li = new ilib.LocaleInfo(locale);
		
		var first = this.newRd({
			year: this._calcYear(this.rd.getRataDie()+this.offset),
			month: this.getMonths(),
			day: 1,
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0,
			cal: this.cal
		});
		var weekStart = first.onOrAfter(li.getFirstDayOfWeek());
		
		if (weekStart - first.getRataDie() > 3) {
			// if the first week has 4 or more days in it of the current month, then consider
			// that week 1. Otherwise, it is week 0. To make it week 1, move the week start
			// one week earlier.
			weekStart -= 7;
		}
		return Math.floor((this.rd.getRataDie() - weekStart) / 7) + 1;
	}
};

/*
 * util/utils.js - Core utility routines
 * 
 * Copyright © 2012-2014, JEDLSoft
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
 * @param {function(...)} method method to call
 * @return {function(...)|undefined} function that calls the given method 
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
 * @param {boolean=} replace if true, replace the array elements in object1 with those in object2.
 * If false, concatenate array elements in object1 with items in object2.
 * @param {string=} name1 name of the object being merged into
 * @param {string=} name2 name of the object being merged in
 * @return {Object} the merged object
 */
ilib.merge = function (object1, object2, replace, name1, name2) {
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
				if (typeof(replace) !== 'boolean' || !replace) {
					newObj[prop] = new Array();
					newObj[prop] = newObj[prop].concat(object1[prop]);
					newObj[prop] = newObj[prop].concat(object2[prop]);
				} else {
					newObj[prop] = object2[prop];
				}
			} else if (typeof(object1[prop]) === 'object' && typeof(object2[prop]) === 'object') {
				newObj[prop] = ilib.merge(object1[prop], object2[prop], replace);
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
 * @param {boolean=} replaceArrays if true, replace the array elements in object1 with those in object2.
 * If false, concatenate array elements in object1 with items in object2.
 * @param {boolean=} returnOne if true, only return the most locale-specific data. If false,
 * merge all the relevant locale data together.
 * @return {Object?} the merged locale data
 */
ilib.mergeLocData = function (prefix, locale, replaceArrays, returnOne) {
	var data = undefined;
	var loc = locale || new ilib.Locale();
	var foundLocaleData = false;
	var property = prefix;
	var mostSpecific;

	data = ilib.data[prefix] || {};

	mostSpecific = data;

	if (loc.getLanguage()) {
		property = prefix + '_' + loc.getLanguage();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}
	
	if (loc.getRegion()) {
		property = prefix + '_' + loc.getRegion();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}
	
	if (loc.getLanguage()) {
		property = prefix + '_' + loc.getLanguage();
		
		if (loc.getScript()) {
			property = prefix + '_' + loc.getLanguage() + '_' + loc.getScript();
			if (ilib.data[property]) {
				foundLocaleData = true;
				data = ilib.merge(data, ilib.data[property], replaceArrays);
				mostSpecific = ilib.data[property];
			}
		}
		
		if (loc.getRegion()) {
			property = prefix + '_' + loc.getLanguage() + '_' + loc.getRegion();
			if (ilib.data[property]) {
				foundLocaleData = true;
				data = ilib.merge(data, ilib.data[property], replaceArrays);
				mostSpecific = ilib.data[property];
			}
		}		
	}
	
	if (loc.getRegion() && loc.getVariant()) {
		property = prefix + '_' + loc.getLanguage() + '_' + loc.getVariant();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}

	if (loc.getLanguage() && loc.getScript() && loc.getRegion()) {
		property = prefix + '_' + loc.getLanguage() + '_' + loc.getScript() + '_' + loc.getRegion();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}

	if (loc.getLanguage() && loc.getRegion() && loc.getVariant()) {
		property = prefix + '_' + loc.getLanguage() + '_' + loc.getRegion() + '_' + loc.getVariant();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}

	if (loc.getLanguage() && loc.getScript() && loc.getRegion() && loc.getVariant()) {
		property = prefix + '_' + loc.getLanguage() + '_' + loc.getScript() + '_' + loc.getRegion() + '_' + loc.getVariant();
		if (ilib.data[property]) {
			foundLocaleData = true;
			data = ilib.merge(data, ilib.data[property], replaceArrays);
			mostSpecific = ilib.data[property];
		}
	}
	
	return foundLocaleData ? (returnOne ? mostSpecific : data) : undefined;
};

/**
 * Return an array of relative path names for the
 * files that represent the data for the given locale.<p>
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
 * <h4>Variations</h4>
 * 
 * With only language and region specified, the following
 * sequence of paths will be generated:<p>
 * 
 * <pre>
 * language
 * und/region
 * language/region
 * </pre>
 * 
 * With only language and script specified:<p>
 * 
 * <pre>
 * language
 * language/script
 * </pre>
 * 
 * With only script and region specified:<p>
 * 
 * <pre>
 * und/region  
 * </pre>
 * 
 * With only region and variant specified:<p>
 * 
 * <pre>
 * und/region
 * region/variant
 * </pre>
 * 
 * With only language, script, and region specified:<p>
 * 
 * <pre>
 * language
 * und/region
 * language/script
 * language/region
 * language/script/region
 * </pre>
 * 
 * With only language, region, and variant specified:<p>
 * 
 * <pre>
 * language
 * und/region
 * language/region
 * region/variant
 * language/region/variant
 * </pre>
 * 
 * With all parts specified:<p>
 * 
 * <pre>
 * language
 * und/region
 * language/script
 * language/region
 * region/variant
 * language/script/region
 * language/region/variant
 * language/script/region/variant
 * </pre>
 * 
 * @param {ilib.Locale} locale load the files for this locale
 * @param {string?} name the file name of each file to load without
 * any path
 * @return {Array.<string>} An array of relative path names
 * for the files that contain the locale data
 */
ilib.getLocFiles = function(locale, name) {
	var dir = "";
	var files = [];
	var filename = name || "resources.json";
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
		if (prop && typeof(obj[prop]) !== 'undefined') {
			return false;
		}
	}
	return true;
};


/**
 * @private
 */
ilib.hashCode = function(obj) {
	var hash = 0;
	
	function addHash(hash, newValue) {
		// co-prime numbers creates a nicely distributed hash
		hash *= 65543;
		hash += newValue;
		hash %= 2147483647; 
		return hash;
	}
	
	function stringHash(str) {
		var hash = 0;
		for (var i = 0; i < str.length; i++) {
			hash = addHash(hash, str.charCodeAt(i));
		}
		return hash;
	}
	
	switch (typeof(obj)) {
		case 'undefined':
			hash = 0;
			break;
		case 'string':
			hash = stringHash(obj);
			break;
		case 'function':
		case 'number':
		case 'xml':
			hash = stringHash(String(obj));
			break;
		case 'boolean':
			hash = obj ? 1 : 0;
			break;
		case 'object':
			var props = [];
			for (var p in obj) {
				if (obj.hasOwnProperty(p)) {
					props.push(p);
				}
			}
			// make sure the order of the properties doesn't matter
			props.sort();
			for (var i = 0; i < props.length; i++) {
				hash = addHash(hash, stringHash(props[i]));
				hash = addHash(hash, ilib.hashCode(obj[props[i]]));
			}
			break;
	}
	
	return hash;
};


/**
 * Load data using the new loader object or via the old function callback.
 * @private
 */
ilib._callLoadData = function (files, sync, params, callback) {
	// console.log("ilib._callLoadData called");
	if (typeof(ilib._load) === 'function') {
		// console.log("ilib._callLoadData: calling as a regular function");
		return ilib._load(files, sync, params, callback);
	} else if (typeof(ilib._load) === 'object' && ilib._load instanceof ilib.Loader) {
		// console.log("ilib._callLoadData: calling as an object");
		return ilib._load.loadFiles(files, sync, params, callback);
	}
	
	// console.log("ilib._callLoadData: not calling. Type is " + typeof(ilib._load) + " and instanceof says " + (ilib._load instanceof ilib.Loader));
	return undefined;
};

/**
 * Find locale data or load it in. If the data with the given name is preassembled, it will
 * find the data in ilib.data. If the data is not preassembled but there is a loader function,
 * this function will call it to load the data. Otherwise, the callback will be called with
 * undefined as the data. This function will create a cache under the given class object.
 * If data was successfully loaded, it will be set into the cache so that future access to 
 * the same data for the same locale is much quicker.<p>
 * 
 * The parameters can specify any of the following properties:<p>
 * 
 * <ul>
 * <li><i>name</i> - String. The name of the file being loaded. Default: resources.json
 * <li><i>object</i> - Object. The class attempting to load data. The cache is stored inside of here.
 * <li><i>locale</i> - ilib.Locale. The locale for which data is loaded. Default is the current locale.
 * <li><i>nonlocale</i> - boolean. If true, the data being loaded is not locale-specific.
 * <li><i>type</i> - String. Type of file to load. This can be "json" or "other" type. Default: "json" 
 * <li><i>replace</i> - boolean. When merging json objects, this parameter controls whether to merge arrays
 * or have arrays replace each other. If true, arrays in child objects replace the arrays in parent 
 * objects. When false, the arrays in child objects are concatenated with the arrays in parent objects.  
 * <li><i>loadParams</i> - Object. An object with parameters to pass to the loader function
 * <li><i>sync</i> - boolean. Whether or not to load the data synchronously
 * <li><i>callback</i> - function(?)=. callback Call back function to call when the data is available.
 * Data is not returned from this method, so a callback function is mandatory.
 * </ul>
 * 
 * @param {Object} params Parameters configuring how to load the files (see above)
 */
ilib.loadData = function(params) {
	var name = "resources.json",
		object = undefined, 
		locale = new ilib.Locale(ilib.getLocale()), 
		sync = false, 
		type = undefined,
		loadParams = {},
		callback = undefined,
		nonlocale = false,
		replace = false,
		basename;
	
	if (!params || typeof(params.callback) !== 'function') {
		return;
	}

	if (params.name) {
		name = params.name;
	}
	if (params.object) {
		object = params.object;
	}
	if (params.locale) {
		locale = (typeof(params.locale) === 'string') ? new ilib.Locale(params.locale) : params.locale;
	}			
	if (params.type) {
		type = params.type;
	}
	if (params.loadParams) {
		loadParams = params.loadParams;
	}
	if (params.sync) {
		sync = params.sync;
	}
	if (params.nonlocale) {
		nonlocale = !!params.nonlocale;
	}
	if (typeof(params.replace) === 'boolean') {
		replace = params.replace;
	}
	
	callback = params.callback;
	
	if (object && !object.cache) {
		object.cache = {};
	}
	
	if (!type) {
		var dot = name.lastIndexOf(".");
		type = (dot !== -1) ? name.substring(dot+1) : "text";
	}

	var spec = ((!nonlocale && locale.getSpec().replace(/-/g, '_')) || "root") + "," + name + "," + String(ilib.hashCode(loadParams));
	if (!object || typeof(object.cache[spec]) === 'undefined') {
		var data, returnOne = (loadParams && loadParams.returnOne);
		
		if (type === "json") {
			// console.log("type is json");
			basename = name.substring(0, name.lastIndexOf("."));
			if (nonlocale) {
				basename = basename.replace(/\//g, '.').replace(/[\\\+\-]/g, "_");
				data = ilib.data[basename];
			} else {
				data = ilib.mergeLocData(basename, locale, replace, returnOne);
			}
			if (data) {
				// console.log("found assembled data");
				if (object) {
					object.cache[spec] = data;
				}
				callback(data);
				return;
			}
		}
		
		// console.log("ilib._load is " + typeof(ilib._load));
		if (typeof(ilib._load) !== 'undefined') {
			// the data is not preassembled, so attempt to load it dynamically
			var files = nonlocale ? [ name || "resources.json" ] : ilib.getLocFiles(locale, name);
			if (type !== "json") {
				loadParams.returnOne = true;
			}
			
			ilib._callLoadData(files, sync, loadParams, ilib.bind(this, function(arr) {
				if (type === "json") {
					data = ilib.data[basename] || {};
					for (var i = 0; i < arr.length; i++) {
						if (typeof(arr[i]) !== 'undefined') {
							data = loadParams.returnOne ? arr[i] : ilib.merge(data, arr[i], replace);
						}
					}
					
					if (object) {
						object.cache[spec] = data;
					}
					callback(data);
				} else {
					var i = arr.length-1; 
					while (i > -1 && !arr[i]) {
						i--;
					}
					if (i > -1) {
						if (object) {
							object.cache[spec] = arr[i];
						}
						callback(arr[i]);
					} else {
						callback(undefined);
					}
				}
			}));
		} else {
			// no data other than the generic shared data
			if (type === "json") {
				data = ilib.data[basename];
			}
			if (object && data) {
				object.cache[spec] = data;
			}
			callback(data);
		}
	} else {
		callback(object.cache[spec]);
	}
};

/*
 * util/math.js - Misc math utility routines
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

// !depends ilibglobal.js

/**
 * Return the sign of the given number. If the sign is negative, this function
 * returns -1. If the sign is positive or zero, this function returns 1.
 * @static
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
 * @protected
 */
ilib._roundFnc = {
	/**
	 * @static
	 * @protected
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	floor: function (num) {
		return Math.floor(num);
	},
	
	/**
	 * @static
	 * @protected
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	ceiling: function (num) {
		return Math.ceil(num);
	},
	
	/**
	 * @static
	 * @protected
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	down: function (num) {
		return (num < 0) ? Math.ceil(num) : Math.floor(num);
	},
	
	/**
	 * @static
	 * @protected
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	up: function (num) {
		return (num < 0) ? Math.floor(num) : Math.ceil(num);
	},
	
	/**
	 * @static
	 * @protected
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	halfup: function (num) {
		return (num < 0) ? Math.ceil(num - 0.5) : Math.floor(num + 0.5);
	},
	
	/**
	 * @static
	 * @protected
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	halfdown: function (num) {
		return (num < 0) ? Math.floor(num + 0.5) : Math.ceil(num - 0.5);
	},
	
	/**
	 * @static
	 * @protected
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	halfeven: function (num) {
		return (Math.floor(num) % 2 === 0) ? Math.ceil(num - 0.5) : Math.floor(num + 0.5);
	},
	
	/**
	 * @static
	 * @protected
	 * @param {number} num number to round
	 * @return {number} rounded number
	 */
	halfodd: function (num) {
		return (Math.floor(num) % 2 !== 0) ? Math.ceil(num - 0.5) : Math.floor(num + 0.5);
	}
};

/**
 * Do a proper modulo function. The Javascript % operator will give the truncated
 * division algorithm, but for calendrical calculations, we need the Euclidean
 * division algorithm where the remainder of any division, whether the dividend
 * is negative or not, is always a positive number in the range [0, modulus).<p>
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
 * Do a proper adjusted modulo function. The Javascript % operator will give the truncated
 * division algorithm, but for calendrical calculations, we need the Euclidean
 * division algorithm where the remainder of any division, whether the dividend
 * is negative or not, is always a positive number in the range (0, modulus]. The adjusted
 * modulo function differs from the regular modulo function in that when the remainder is
 * zero, the modulus should be returned instead.<p>
 * 
 * Depends directive: !depends utils.js
 * 
 * @param {number} dividend the number being divided
 * @param {number} modulus the number dividing the dividend. This should always be a positive number.
 * @return the remainder of dividing the dividend by the modulus.  
 */
ilib.amod = function (dividend, modulus) {
	if (modulus == 0) {
		return 0;
	}
	var x = dividend % modulus;
	return (x <= 0) ? x + modulus : x;
};

/*
 * strings.js - ilib string subclass definition
 * 
 * Copyright © 2012-2014, JEDLSoft
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

// !depends ilibglobal.js util/utils.js locale.js util/math.js

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
		if (string instanceof ilib.String) {
			this.str = string.str;	
		} else {
			this.str = string.toString();
		}
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
 * Return true if the given character is a Unicode surrogate character,
 * either high or low.
 * 
 * @private
 * @static
 * @param {string} ch character to check
 * @return {boolean} true if the character is a surrogate
 */
ilib.String._isSurrogate = function (ch) {
	var n = ch.charCodeAt(0);
	return ((n >= 0xDC00 && n <= 0xDFFF) || (n >= 0xD800 && n <= 0xDBFF));
};

/**
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
 * @static
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
 * Convert the character or the surrogate pair at the given
 * index into the intrinsic Javascript string to a Unicode 
 * UCS-4 code point.
 * 
 * @param {string} str string to get the code point from
 * @param {number} index index into the string
 * @return {number} code point of the character at the
 * given index into the string
 */
ilib.String.toCodePoint = function(str, index) {
	if (!str || str.length === 0) {
		return -1;
	}
	var code = -1, high = str.charCodeAt(index);
	if (high >= 0xD800 && high <= 0xDBFF) {
		if (str.length > index+1) {
			var low = str.charCodeAt(index+1);
			if (low >= 0xDC00 && low <= 0xDFFF) {
				code = (((high & 0x3C0) >> 6) + 1) << 16 |
					(((high & 0x3F) << 10) | (low & 0x3FF));
			}
		}
	} else {
		code = high;
	}
	
	return code;
};

/**
 * Load the plural the definitions of plurals for the locale.
 * @param {boolean=} sync
 * @param {ilib.Locale|string=} locale
 * @param {Object=} loadParams
 * @param {function(*)=} onLoad
 */
ilib.String.loadPlurals = function (sync, locale, loadParams, onLoad) {
	var loc;
	if (locale) {
		loc = (typeof(locale) === 'string') ? new ilib.Locale(locale) : locale;
	} else {
		loc = new ilib.Locale(ilib.getLocale());
	}
	var spec = loc.getLanguage();
	if (!ilib.data["plurals_" + spec]) {
		ilib.loadData({
			name: "plurals.json",
			object: ilib.String,
			locale: loc,
			sync: sync,
			loadParams: loadParams,
			callback: /** @type function(Object=):undefined */ ilib.bind(this, /** @type function() */ function(plurals) {
				if (!plurals) {
					ilib.String.cache[spec] = {};
				}
				ilib.data["plurals_" + spec] = plurals || {};
				if (onLoad && typeof(onLoad) === 'function') {
					onLoad(ilib.data["plurals_" + spec]);
				}
			})
		});
	} else {
		if (onLoad && typeof(onLoad) === 'function') {
			onLoad(ilib.data["plurals_" + spec]);
		}
	}
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
	 * @private
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
	 * @private
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
			var regex;
			for (var p in params) {
				if (typeof(params[p]) !== 'undefined') {
					regex = new RegExp("\{"+p+"\}", "g");
					formatted = formatted.replace(regex, params[p]);
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
									var ruleset = ilib.data["plurals_" + this.locale.getLanguage()];
									if (ruleset) {
										var rule = ruleset[limits[i]];
										if (ilib.String._fncs.getValue(rule, arg)) {
											result = new ilib.String(strings[i]);
											i = limits.length;
										}
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
	 * Convert the character or the surrogate pair at the given
	 * index into the string to a Unicode UCS-4 code point.
	 * @protected
	 * @param {number} index index into the string
	 * @return {number} code point of the character at the
	 * given index into the string
	 */
	_toCodePoint: function (index) {
		return ilib.String.toCodePoint(this.str, index);
	},
	
	/**
	 * Call the callback with each character in the string one at 
	 * a time, taking care to step through the surrogate pairs in 
	 * the UTF-16 encoding properly.<p>
	 * 
	 * The standard Javascript String's charAt() method only
	 * returns a particular 16-bit character in the 
	 * UTF-16 encoding scheme.
	 * If the index to charAt() is pointing to a low- or 
	 * high-surrogate character,
	 * it will return the surrogate character rather 
	 * than the the character 
	 * in the supplementary planes that the two surrogates together 
	 * encode. This function will call the callback with the full
	 * character, making sure to join two  
	 * surrogates into one character in the supplementary planes
	 * where necessary.<p>
	 * 
	 * @param {function(string)} callback a callback function to call with each
	 * full character in the current string
	 */
	forEach: function(callback) {
		if (typeof(callback) === 'function') {
			var it = this.charIterator();
			while (it.hasNext()) {
				callback(it.next());
			}
		}
	},

	/**
	 * Call the callback with each numeric code point in the string one at 
	 * a time, taking care to step through the surrogate pairs in 
	 * the UTF-16 encoding properly.<p>
	 * 
	 * The standard Javascript String's charCodeAt() method only
	 * returns information about a particular 16-bit character in the 
	 * UTF-16 encoding scheme.
	 * If the index to charCodeAt() is pointing to a low- or 
	 * high-surrogate character,
	 * it will return the code point of the surrogate character rather 
	 * than the code point of the character 
	 * in the supplementary planes that the two surrogates together 
	 * encode. This function will call the callback with the full
	 * code point of each character, making sure to join two  
	 * surrogates into one code point in the supplementary planes.<p>
	 * 
	 * @param {function(string)} callback a callback function to call with each
	 * code point in the current string
	 */
	forEachCodePoint: function(callback) {
		if (typeof(callback) === 'function') {
			var it = this.iterator();
			while (it.hasNext()) {
				callback(it.next());
			}
		}
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
	 * @param {boolean=} sync [optional] whether to load the locale data synchronously 
	 * or not
	 * @param {Object=} loadParams [optional] parameters to pass to the loader function
	 * @param {function(*)=} onLoad [optional] function to call when the loading is done
	 */
	setLocale: function (locale, sync, loadParams, onLoad) {
		if (typeof(locale) === 'object') {
			this.locale = locale;
		} else {
			this.localeSpec = locale;
			this.locale = new ilib.Locale(locale);
		}
		
		ilib.String.loadPlurals(typeof(sync) !== 'undefined' ? sync : true, this.locale, loadParams, onLoad);
	},

	/**
	 * Return the locale to use when processing choice formats. The locale
	 * affects how number classes are interpretted. In some cultures,
	 * the limit "few" maps to "any integer that ends in the digits 2 to 9" and
	 * in yet others, "few" maps to "any integer that ends in the digits
	 * 3 or 4".
	 * @return {string} localespec to use when processing choice
	 * formats with this string
	 */
	getLocale: function () {
		return (this.locale ? this.locale.getSpec() : this.localeSpec) || ilib.getLocale();
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
 * Copyright © 2012-2014, JEDLSoft
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
 * Copyright © 2012-2014, JEDLSoft
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


/* !depends calendar.js locale.js date.js julianday.js util/utils.js util/math.js */

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
 * the lengths of each month 
 * @private
 * @const
 * @type Array.<number> 
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
 * ratadie.js - Represent the RD date number in the calendar
 * 
 * Copyright © 2014, JEDLSoft
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
util/utils.js
util/math.js
julianday.js 
*/

/**
 * @class
 * Construct a new RD date number object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970.
 * 
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 * 
 * <li><i>cycle</i> - any integer giving the number of 60-year cycle in which the date is located.
 * If the cycle is not given but the year is, it is assumed that the year parameter is a fictitious 
 * linear count of years since the beginning of the epoch, much like other calendars. This linear
 * count is never used. If both the cycle and year are given, the year is wrapped to the range 0 
 * to 60 and treated as if it were a year in the regular 60-year cycle.
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
 * <li><i>parts</i> - 0 to 1079. Specify the halaqim parts of an hour. Either specify 
 * the parts or specify the minutes, seconds, and milliseconds, but not both. This is only used
 * in the Hebrew calendar. 
 * 
 * <li><i>minute</i> - 0 to 59
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above are present, then the RD is calculate based on 
 * the current date at the time of instantiation. <p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * Depends directive: !depends ratadie.js
 * 
 * @private
 * @constructor
 * @param {Object=} params parameters that govern the settings and behaviour of this RD date
 */
ilib.Date.RataDie = function(params) {
	if (params) {
		if (typeof(params.date) !== 'undefined') {
			// accept JS Date classes or strings
			var date = params.date;
			if (!(date instanceof Date)) {
				date = new Date(date); // maybe a string initializer?
			}
			this._setTime(date.getTime());
		} else if (typeof(params.unixtime) !== 'undefined') {
			this._setTime(parseInt(params.unixtime, 10));
		} else if (typeof(params.julianday) !== 'undefined') {
			// JD time is defined to be UTC
			this._setJulianDay(parseFloat(params.julianday));
		} else if (params.year || params.month || params.day || params.hour ||
				params.minute || params.second || params.millisecond || params.parts || params.cycle) {
			this._setDateComponents(params);
		} else if (typeof(params.rd) !== 'undefined') {
			this.rd = (typeof(params.rd) === 'object' && params.rd instanceof ilib.Date.RataDie) ? params.rd.rd : params.rd;
		}
	}
	
	/**
	 * @type {number} the Rata Die number of this date for this calendar type
	 */
	if (typeof(this.rd) === 'undefined') {
		var now = new Date();
		this._setTime(now.getTime());
	}
};

/**
 * @private
 * @const
 * @type {number}
 */
ilib.Date.RataDie.gregorianEpoch = 1721424.5;

ilib.Date.RataDie.prototype = {
	/**
	 * @protected
	 * @const
	 * @type {number}
	 * the difference between a zero Julian day and the zero Gregorian date. 
	 */
	epoch: ilib.Date.RataDie.gregorianEpoch,
	
	/**
	 * Set the RD of this instance according to the given unix time. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970.
	 *
	 * @protected
	 * @param {number} millis the unix time to set this date to in milliseconds 
	 */
	_setTime: function(millis) {
		// 2440587.5 is the julian day of midnight Jan 1, 1970, UTC (Gregorian)
		this._setJulianDay(2440587.5 + millis / 86400000);
	},

	/**
	 * Set the date of this instance using a Julian Day.
	 * @protected
	 * @param {number} date the Julian Day to use to set this date
	 */
	_setJulianDay: function (date) {
		var jd = (typeof(date) === 'number') ? new ilib.JulianDay(date) : date;
		// round to the nearest millisecond
		this.rd = ilib._roundFnc.halfup((jd.getDate() - this.epoch) * 86400000) / 86400000;
	},

	/**
	 * Return the rd number of the particular day of the week on or before the 
	 * given rd. eg. The Sunday on or before the given rd.
	 * @protected
	 * @param {number} rd the rata die date of the reference date
	 * @param {number} dayOfWeek the day of the week that is being sought relative 
	 * to the current date
	 * @return {number} the rd of the day of the week
	 */
	_onOrBefore: function(rd, dayOfWeek) {
		return rd - ilib.mod(Math.floor(rd) - dayOfWeek - 2, 7);
	},
	
	/**
	 * Return the rd number of the particular day of the week on or before the current rd.
	 * eg. The Sunday on or before the current rd. If the offset is given, the calculation
	 * happens in wall time instead of UTC. UTC time may be a day before or day behind 
	 * wall time, so it it would give the wrong day of the week if this calculation was
	 * done in UTC time when the caller really wanted wall time. Even though the calculation
	 * may be done in wall time, the return value is nonetheless always given in UTC.
	 * @param {number} dayOfWeek the day of the week that is being sought relative 
	 * to the current date
	 * @param {number=} offset RD offset for the time zone. Zero is assumed if this param is
	 * not given
	 * @return {number} the rd of the day of the week
	 */
	onOrBefore: function(dayOfWeek, offset) {
		offset = offset || 0;
		return this._onOrBefore(this.rd + offset, dayOfWeek) - offset;
	},
	
	/**
	 * Return the rd number of the particular day of the week on or before the current rd.
	 * eg. The Sunday on or before the current rd. If the offset is given, the calculation
	 * happens in wall time instead of UTC. UTC time may be a day before or day behind 
	 * wall time, so it it would give the wrong day of the week if this calculation was
	 * done in UTC time when the caller really wanted wall time. Even though the calculation
	 * may be done in wall time, the return value is nonetheless always given in UTC.
	 * @param {number} dayOfWeek the day of the week that is being sought relative 
	 * to the reference date
	 * @param {number=} offset RD offset for the time zone. Zero is assumed if this param is
	 * not given
	 * @return {number} the day of the week
	 */
	onOrAfter: function(dayOfWeek, offset) {
		offset = offset || 0;
		return this._onOrBefore(this.rd+6+offset, dayOfWeek) - offset;
	},
	
	/**
	 * Return the rd number of the particular day of the week before the current rd.
	 * eg. The Sunday before the current rd. If the offset is given, the calculation
	 * happens in wall time instead of UTC. UTC time may be a day before or day behind 
	 * wall time, so it it would give the wrong day of the week if this calculation was
	 * done in UTC time when the caller really wanted wall time. Even though the calculation
	 * may be done in wall time, the return value is nonetheless always given in UTC.
	 * @param {number} dayOfWeek the day of the week that is being sought relative 
	 * to the reference date
	 * @param {number=} offset RD offset for the time zone. Zero is assumed if this param is
	 * not given
	 * @return {number} the day of the week
	 */
	before: function(dayOfWeek, offset) {
		offset = offset || 0;
		return this._onOrBefore(this.rd-1+offset, dayOfWeek) - offset;
	},
	
	/**
	 * Return the rd number of the particular day of the week after the current rd.
	 * eg. The Sunday after the current rd. If the offset is given, the calculation
	 * happens in wall time instead of UTC. UTC time may be a day before or day behind 
	 * wall time, so it it would give the wrong day of the week if this calculation was
	 * done in UTC time when the caller really wanted wall time. Even though the calculation
	 * may be done in wall time, the return value is nonetheless always given in UTC.
	 * @param {number} dayOfWeek the day of the week that is being sought relative 
	 * to the reference date
	 * @param {number=} offset RD offset for the time zone. Zero is assumed if this param is
	 * not given
	 * @return {number} the day of the week
	 */
	after: function(dayOfWeek, offset) {
		offset = offset || 0;
		return this._onOrBefore(this.rd+7+offset, dayOfWeek) - offset;
	},

	/**
	 * Return the unix time equivalent to this Gregorian date instance. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970 UTC. This method only
	 * returns a valid number for dates between midnight, Jan 1, 1970 and  
	 * Jan 19, 2038 at 3:14:07am when the unix time runs out. If this instance 
	 * encodes a date outside of that range, this method will return -1.
	 * 
	 * @return {number} a number giving the unix time, or -1 if the date is outside the
	 * valid unix time range
	 */
	getTime: function() {
		// earlier than Jan 1, 1970
		// or later than Jan 19, 2038 at 3:14:07am
		var jd = this.getJulianDay();
		if (jd < 2440587.5 || jd > 2465442.634803241) { 
			return -1;
		}
	
		// avoid the rounding errors in the floating point math by only using
		// the whole days from the rd, and then calculating the milliseconds directly
		return Math.round((jd - 2440587.5) * 86400000);
	},

	/**
	 * Return the extended unix time equivalent to this Gregorian date instance. Unix time is
	 * the number of milliseconds since midnight on Jan 1, 1970 UTC. Traditionally unix time
	 * (or the type "time_t" in C/C++) is only encoded with a unsigned 32 bit integer, and thus 
	 * runs out on Jan 19, 2038. However, most Javascript engines encode numbers well above 
	 * 32 bits and the Date object allows you to encode up to 100 million days worth of time 
	 * after Jan 1, 1970, and even more interestingly 100 million days worth of time before
	 * Jan 1, 1970 as well. This method returns the number of milliseconds in that extended 
	 * range. If this instance encodes a date outside of that range, this method will return
	 * NaN.
	 * 
	 * @return {number} a number giving the extended unix time, or NaN if the date is outside 
	 * the valid extended unix time range
	 */
	getTimeExtended: function() {
		var jd = this.getJulianDay();
		
		// test if earlier than Jan 1, 1970 - 100 million days
		// or later than Jan 1, 1970 + 100 million days
		if (jd < -97559412.5 || jd > 102440587.5) { 
			return NaN;
		}
	
		// avoid the rounding errors in the floating point math by only using
		// the whole days from the rd, and then calculating the milliseconds directly
		return Math.round((jd - 2440587.5) * 86400000);
	},

	/**
	 * Return the Julian Day equivalent to this calendar date as a number.
	 * This returns the julian day in UTC.
	 * 
	 * @return {number} the julian date equivalent of this date
	 */
	getJulianDay: function() {
		return this.rd + this.epoch;
	},

	/**
	 * Return the Rata Die (fixed day) number of this RD date.
	 * 
	 * @return {number} the rd date as a number
	 */
	getRataDie: function() {
		return this.rd;
	}
};

/*
 * gregratadie.js - Represent the RD date number in the Gregorian calendar
 * 
 * Copyright © 2014, JEDLSoft
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
date.js
calendar/gregorian.js
calendar/ratadie.js
util/utils.js
util/math.js
julianday.js 
*/

/**
 * @class
 * Construct a new Gregorian RD date number object. The constructor parameters can 
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
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Gregorian date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above are present, then the RD is calculate based on 
 * the current date at the time of instantiation. <p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * Depends directive: !depends gregratadie.js
 * 
 * @private
 * @constructor
 * @extends ilib.Date.RataDie
 * @param {Object=} params parameters that govern the settings and behaviour of this Gregorian RD date
 */
ilib.Date.GregRataDie = function(params) {
	this.cal = params && params.cal || new ilib.Cal.Gregorian();
	/** @type {number|undefined} */
	this.rd = undefined;
	ilib.Date.RataDie.call(this, params);
};

ilib.Date.GregRataDie.prototype = new ilib.Date.RataDie();
ilib.Date.GregRataDie.prototype.parent = ilib.Date.RataDie;
ilib.Date.GregRataDie.prototype.constructor = ilib.Date.GregRataDie;

/**
 * the cumulative lengths of each month, for a non-leap year 
 * @private
 * @const
 * @type Array.<number>
 */
ilib.Date.GregRataDie.cumMonthLengths = [
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
 * the cumulative lengths of each month, for a leap year 
 * @private
 * @const
 * @type Array.<number>
 */
ilib.Date.GregRataDie.cumMonthLengthsLeap = [
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
 * Calculate the Rata Die (fixed day) number of the given date.
 * 
 * @private
 * @param {Object} date the date components to calculate the RD from
 */
ilib.Date.GregRataDie.prototype._setDateComponents = function(date) {
	var year = parseInt(date.year, 10) || 0;
	var month = parseInt(date.month, 10) || 1;
	var day = parseInt(date.day, 10) || 1;
	var hour = parseInt(date.hour, 10) || 0;
	var minute = parseInt(date.minute, 10) || 0;
	var second = parseInt(date.second, 10) || 0;
	var millisecond = parseInt(date.millisecond, 10) || 0;

	var years = 365 * (year - 1) +
		Math.floor((year-1)/4) -
		Math.floor((year-1)/100) +
		Math.floor((year-1)/400);
	
	var dayInYear = (month > 1 ? ilib.Date.GregRataDie.cumMonthLengths[month-1] : 0) +
		day +
		(ilib.Cal.Gregorian.prototype.isLeapYear.call(this.cal, year) && month > 2 ? 1 : 0);
	var rdtime = (hour * 3600000 +
		minute * 60000 +
		second * 1000 +
		millisecond) / 
		86400000; 
	/*
	debug("getRataDie: converting " +  JSON.stringify(this));
	debug("getRataDie: year is " +  years);
	debug("getRataDie: day in year is " +  dayInYear);
	debug("getRataDie: rdtime is " +  rdtime);
	debug("getRataDie: rd is " +  (years + dayInYear + rdtime));
	*/
	
	/**
	 * @type {number|undefined} the RD number of this Gregorian date
	 */
	this.rd = years + dayInYear + rdtime;
};

/**
 * Return the rd number of the particular day of the week on or before the 
 * given rd. eg. The Sunday on or before the given rd.
 * @private
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the current date
 * @return {number} the rd of the day of the week
 */
ilib.Date.GregRataDie.prototype._onOrBefore = function(rd, dayOfWeek) {
	return rd - ilib.mod(Math.floor(rd) - dayOfWeek, 7);
};

/*
 * timezone.js - Definition of a time zone class
 * 
 * Copyright © 2012-2014, JEDLSoft
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
util/math.js
calendar/gregratadie.js
*/

// !data localeinfo zoneinfo

/**
 * @class
 * Create a time zone instance. 
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
	this.sync = true;
	this.locale = new ilib.Locale();
	this.isLocal = false;
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		if (options.id) {
			var id = options.id.toString();
			if (id === 'local') {
				this.isLocal = true;
				
				// use standard Javascript Date to figure out the time zone offsets
				var now = new Date(), 
					jan1 = new Date(now.getFullYear(), 0, 1),  // months in std JS Date object are 0-based
					jun1 = new Date(now.getFullYear(), 5, 1);
				
				// Javascript's method returns the offset backwards, so we have to
				// take the negative to get the correct offset
				this.offsetJan1 = -jan1.getTimezoneOffset();
				this.offsetJun1 = -jun1.getTimezoneOffset();
				// the offset of the standard time for the time zone is always the one that is closest 
				// to negative infinity of the two, no matter whether you are in the northern or southern 
				// hemisphere, east or west
				this.offset = Math.min(this.offsetJan1, this.offsetJun1);
			}
			this.id = id;
		} else if (options.offset) {
			this.offset = (typeof(options.offset) === 'string') ? parseInt(options.offset, 10) : options.offset;
			this.id = this.getDisplayName(undefined, undefined);
		}
		
		if (typeof(options.sync) !== 'undefined') {
			this.sync = !!options.sync;
		}
		
		this.loadParams = options.loadParams;
		this.onLoad = options.onLoad;
	}

	//console.log("timezone: locale is " + this.locale);
	
	if (!this.id) {
		new ilib.LocaleInfo(this.locale, {
			sync: this.sync,
			onLoad: ilib.bind(this, function (li) {
				this.id = li.getTimeZone() || "Etc/UTC";
				this._loadtzdata();
			})
		});
	} else {
		this._loadtzdata();
	}

	//console.log("localeinfo is: " + JSON.stringify(this.locinfo));
	//console.log("id is: " + JSON.stringify(this.id));
};

/*
 * Explanation of the compressed time zone info properties.
 * {
 *     "o": "8:0",      // offset from UTC
 *     "f": "W{c}T",    // standard abbreviation. For time zones that observe DST, the {c} replacement is replaced with the 
 *                      // letter in the e.c or s.c properties below 
 *     "e": {           // info about the end of DST
 *         "j": 78322.5 // Julian day when the transition happens. Either specify the "j" property or all of the "m", "r", and 
 *                      // "t" properties, but not both sets.
 *         "m": 3,      // month that it ends
 *         "r": "l0",   // rule for the day it ends "l" = "last", numbers are Sun=0 through Sat=6. Other syntax is "0>7". 
 *                      // This means the 0-day (Sun) after the 7th of the month. Other possible operators are <, >, <=, >=
 *         "t": "2:0",  // time of day that the DST turns off, hours:minutes
 *         "c": "S"     // character to replace into the abbreviation for standard time 
 *     },
 *     "s": {           // info about the start of DST
 *         "j": 78189.5 // Julian day when the transition happens. Either specify the "j" property or all of the "m", "r", and 
 *                      // "t" properties, but not both sets.
 *         "m": 10,     // month that it starts
 *         "r": "l0",   // rule for the day it starts "l" = "last", numbers are Sun=0 through Sat=6. Other syntax is "0>7".
 *                      // This means the 0-day (Sun) after the 7th of the month. Other possible operators are <, >, <=, >=
 *         "t": "2:0",  // time of day that the DST turns on, hours:minutes
 *         "v": "1:0",  // amount of time saved in hours:minutes
 *         "c": "D"     // character to replace into the abbreviation for daylight time
 *     },
 *     "c": "AU",       // ISO code for the country that contains this time zone
 *     "n": "W. Australia {c} Time"
 *                      // long English name of the zone. The {c} replacement is for the word "Standard" or "Daylight" as appropriate
 * }
 */
ilib.TimeZone.prototype._loadtzdata = function () {
	// console.log("id is: " + JSON.stringify(this.id));
	// console.log("zoneinfo is: " + JSON.stringify(ilib.data.zoneinfo[this.id]));
	if (!ilib.data.zoneinfo[this.id] && typeof(this.offset) === 'undefined') {
		ilib.loadData({
			object: ilib.TimeZone, 
			nonlocale: true,	// locale independent 
			name: "zoneinfo/" + this.id + ".json", 
			sync: this.sync, 
			loadParams: this.loadParams, 
			callback: ilib.bind(this, function (tzdata) {
				if (tzdata && !ilib.isEmpty(tzdata)) {
					ilib.data.zoneinfo[this.id] = tzdata;
				}
				this._initZone();
			})
		});
	} else {
		this._initZone();
	}
};

ilib.TimeZone.prototype._initZone = function() {
	/** 
	 * @private
	 * @type {{o:string,f:string,e:Object.<{m:number,r:string,t:string,z:string}>,s:Object.<{m:number,r:string,t:string,z:string,v:string,c:string}>,c:string,n:string}} 
	 */
	this.zone = ilib.data.zoneinfo[this.id];
	if (!this.zone && typeof(this.offset) === 'undefined') {
		this.id = "Etc/UTC";
		this.zone = ilib.data.zoneinfo[this.id];
	}
	
	this._calcDSTSavings();
	
	if (typeof(this.offset) === 'undefined' && this.zone.o) {
		var offsetParts = this._offsetStringToObj(this.zone.o);
		/**
		 * @private
		 * @type {number} raw offset from UTC without DST, in minutes
		 */
		this.offset = (Math.abs(offsetParts.h || 0) * 60 + (offsetParts.m || 0)) * ilib.signum(offsetParts.h || 0);
	}
	
	if (this.onLoad && typeof(this.onLoad) === 'function') {
		this.onLoad(this);
	}
};

ilib.data.timezone = {};

/**
 * Return an array of available zone ids that the constructor knows about.
 * The country parameter is optional. If it is not given, all time zones will
 * be returned. If it specifies a country code, then only time zones for that
 * country will be returned.
 * 
 * @param {string} country country code for which time zones are being sought
 * @return {Array.<string>} an array of zone id strings
 */
ilib.TimeZone.getAvailableIds = function (country) {
	var tz, ids = [];
	
	if (!ilib.data.timezone.list) {
		ilib.data.timezone.list = [];
		if (ilib._load instanceof ilib.Loader) {
			var hash = ilib._load.listAvailableFiles();
			for (var dir in hash) {
				var files = hash[dir];
				if (typeof(files) === 'object' && files instanceof Array) {
					files.forEach(function (filename) {
						if (filename && filename.match(/^zoneinfo/)) {
							ilib.data.timezone.list.push(filename.replace(/^zoneinfo\//, "").replace(/\.json$/, ""));
						}
					});
				}
			}
		} else {
			for (tz in ilib.data.zoneinfo) {
				if (ilib.data.zoneinfo[tz]) {
					ilib.data.timezone.list.push(tz);
				}
			}
		}
	}
	
	if (!country) {
		// special zone meaning "the local time zone according to the JS engine we are running upon"
		ids.push("local");
		for (tz in ilib.data.timezone.list) {
			if (ilib.data.timezone.list[tz]) {
				ids.push(ilib.data.timezone.list[tz]);
			}
		}
	} else {
		if (!ilib.data.zoneinfo.zonetab) {
			ilib.loadData({
				object: ilib.TimeZone, 
				nonlocale: true,	// locale independent 
				name: "zoneinfo/zonetab.json", 
				sync: true, 
				callback: ilib.bind(this, function (tzdata) {
					if (tzdata) {
						ilib.data.zoneinfo.zonetab = tzdata;
					}
				})
			});
		}
		ids = ilib.data.zoneinfo.zonetab[country];
	}
	
	return ids;
};

/**
 * Return the id used to uniquely identify this time zone.
 * @return {string} a unique id for this time zone
 */
ilib.TimeZone.prototype.getId = function () {
	return this.id.toString();
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
 * <li>long - returns the long name of the zone in English
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
					letter = this.inDaylightTime(date) ? this.zone.s && this.zone.s.c : this.zone.e && this.zone.e.c; 
					var temp = new ilib.String(this.zone.f);
					return temp.format({c: letter || ""});
				}
				return this.zone.f;
			} 
			var temp = "GMT" + this.zone.o;
			if (this.inDaylightTime(date)) {
				temp += "+" + this.zone.s.v;
			}
			return temp;
			break;
		case 'rfc822':
			var offset = this.getOffset(date), // includes the DST if applicable
				ret = "UTC",
				hour = offset.h || 0,
				minute = offset.m || 0;
			
			if (hour !== 0) {
				ret += (hour > 0) ? "+" : "-";
				if (Math.abs(hour) < 10) {
					ret += "0";
				}
				ret += (hour < 0) ? -hour : hour;
				if (minute < 10) {
					ret += "0";
				}
				ret += minute;
			}
			return ret; 
		case 'long':
			if (this.zone.n) {
				if (this.zone.n.indexOf("{c}") !== -1) {
					var str = this.inDaylightTime(date) ? "Daylight" : "Standard"; 
					var temp = new ilib.String(this.zone.n);
					return temp.format({c: str || ""});
				}
				return this.zone.n;
			}
			var temp = "GMT" + this.zone.o;
			if (this.inDaylightTime(date)) {
				temp += "+" + this.zone.s.v;
			}
			return temp;
			break;
	}
};

/**
 * Convert the offset string to an object with an h, m, and possibly s property
 * to indicate the hours, minutes, and seconds.
 * 
 * @private
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
	if (!date) {
		return this.getRawOffset();
	}
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
	
	// check if the dst property is defined -- the intrinsic JS Date object doesn't work so
	// well if we are in the overlap time at the end of DST
	if (this.isLocal && typeof(date.dst) === 'undefined') {
		var d = (!date) ? new Date() : new Date(date.getTime());
		return -d.getTimezoneOffset() * 60000;
	} 
	
	ret = this.offset;
	
	if (date && this.inDaylightTime(date)) {
		ret += this.dstSavings;
	}
	
	return ret * 60000;
};

/**
 * Return the offset in milliseconds when the date has an RD number in wall
 * time rather than in UTC time.
 * @protected
 * @param date the date to check in wall time
 * @returns {number} the number of milliseconds of offset from UTC that the given date is
 */
ilib.TimeZone.prototype._getOffsetMillisWallTime = function (date) {
	var ret;
	
	ret = this.offset;
	
	if (date && this.inDaylightTime(date, true)) {
		ret += this.dstSavings;
	}
	
	return ret * 60000;
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
	var hours = ilib._roundFnc.down(this.offset/60),
		minutes = Math.abs(this.offset) - Math.abs(hours)*60;
	
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
	return this.offset * 60000;
};

/**
 * Gets the offset from UTC for this time zone without DST savings.
 * @return {string} the offset from UTC for this time zone, in the format "h:m:s" 
 */
ilib.TimeZone.prototype.getRawOffsetStr = function () {
	var off = this.getRawOffset();
	return off.h + ":" + (off.m || "0");
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
	} else if (typeof(this.offset) !== 'undefined' && this.zone && this.zone.s) {
		return this.zone.s.v;	// this.zone.start.savings
	}
	return "0:0";
};

/**
 * return the rd of the start of DST transition for the given year
 * @protected
 * @param {Object} rule set of rules
 * @param {number} year year to check
 * @return {number} the rd of the start of DST for the year
 */
ilib.TimeZone.prototype._calcRuleStart = function (rule, year) {
	var type = "=", 
		weekday = 0, 
		day, 
		refDay, 
		cal, 
		hour = 0, 
		minute = 0, 
		second = 0,
		time,
		i;
	
	if (typeof(rule.j) !== 'undefined') {
		refDay = new ilib.Date.GregRataDie({
			julianday: rule.j
		});
	} else {
		if (rule.r.charAt(0) == 'l' || rule.r.charAt(0) == 'f') {
			cal = ilib.Cal.newInstance({type: "gregorian"});
			type = rule.r.charAt(0);
			weekday = parseInt(rule.r.substring(1), 10);
			day = (type === 'l') ? cal.getMonLength(rule.m, year) : 1;
			//console.log("_calcRuleStart: Calculating the " + 
			//		(rule.r.charAt(0) == 'f' ? "first " : "last ") + weekday + 
			//		" of month " + rule.m);
		} else {
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
		refDay = new ilib.Date.GregRataDie({
			year: year, 
			month: rule.m, 
			day: day, 
			hour: hour, 
			minute: minute, 
			second: second
		});
	}
	//console.log("refDay is " + JSON.stringify(refDay));
	var d = refDay.getRataDie();
	
	switch (type) {
		case 'l':
		case '<':
			//console.log("returning " + refDay.onOrBefore(rd, weekday));
			d = refDay.onOrBefore(weekday); 
			break;
		case 'f':
		case '>':
			//console.log("returning " + refDay.onOrAfterRd(rd, weekday));
			d = refDay.onOrAfter(weekday); 
			break;
	}
	return d;
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
ilib.TimeZone.prototype._getDSTStartRule = function (year) {
	// TODO: update this when historic/future zones are supported
	return this.zone.s;
};

/**
 * @private
 */
ilib.TimeZone.prototype._getDSTEndRule = function (year) {
	// TODO: update this when historic/future zones are supported
	return this.zone.e;
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
 * @param {boolean=} wallTime if true, then the given date is in wall time. If false or
 * undefined, it is in the usual UTC time.
 * @return {boolean} true if the given date is in DST for the current zone, and false
 * otherwise.
 */
ilib.TimeZone.prototype.inDaylightTime = function (date, wallTime) {
	var rd, startRd, endRd;

	if (this.isLocal) {
		// check if the dst property is defined -- the intrinsic JS Date object doesn't work so
		// well if we are in the overlap time at the end of DST, so we have to work around that
		// problem by adding in the savings ourselves
		var offset = 0;
		if (typeof(date.dst) !== 'undefined' && !date.dst) {
			offset = this.dstSavings * 60000;
		}
		
		var d = new Date(date ? date.getTimeExtended() + offset: undefined);
		// the DST offset is always the one that is closest to positive infinity, no matter 
		// if you are in the northern or southern hemisphere, east or west
		var dst = Math.max(this.offsetJan1, this.offsetJun1);
		return (-d.getTimezoneOffset() === dst);
	}
	
	if (!date) {
		date = new ilib.Date.GregDate(); // right now
	} else if (!(date instanceof ilib.Date.GregDate)) {
		// convert to Gregorian so that we can tell if it is in DST or not
		date = new ilib.Date.GregDate({
			julianday: date.getJulianDay(),
			timezone: date.getTimeZone()
		});
	}
	
	// if we aren't using daylight time in this zone for the given year, then we are 
	// not in daylight time
	if (!this.useDaylightTime(date.year)) {
		return false;
	}
	
	// this should be a Gregorian RD number now, in UTC
	rd = date.rd.getRataDie();
	
	// these calculate the start/end in local wall time
	var startrule = this._getDSTStartRule(date.year);
	var endrule = this._getDSTEndRule(date.year);
	startRd = this._calcRuleStart(startrule, date.year);
	endRd = this._calcRuleStart(endrule, date.year);
	
	if (wallTime) {
		// rd is in wall time, so we have to make sure to skip the missing time
		// at the start of DST when standard time ends and daylight time begins
		startRd += this.dstSavings/1440;
	} else {
		// rd is in UTC, so we have to convert the start/end to UTC time so 
		// that they can be compared directly to the UTC rd number of the date
		
		// when DST starts, time is standard time already, so we only have
		// to subtract the offset to get to UTC and not worry about the DST savings
		startRd -= this.offset/1440;  
		
		// when DST ends, time is in daylight time already, so we have to
		// subtract the DST savings to get back to standard time, then the
		// offset to get to UTC
		endRd -= (this.offset + this.dstSavings)/1440;
	}
	
	// In the northern hemisphere, the start comes first some time in spring (Feb-Apr), 
	// then the end some time in the fall (Sept-Nov). In the southern
	// hemisphere, it is the other way around because the seasons are reversed. Standard
	// time is still in the winter, but the winter months are May-Aug, and daylight 
	// savings time usually starts Aug-Oct of one year and runs through Mar-May of the 
	// next year.
	if (rd < endRd && endRd - rd <= this.dstSavings/1440 && typeof(date.dst) === 'boolean') {
		// take care of the magic overlap time at the end of DST
		return date.dst;
	}
	if (startRd < endRd) {
		// northern hemisphere
		return (rd >= startRd && rd < endRd) ? true : false;
	} 
	// southern hemisphere
	return (rd >= startRd || rd < endRd) ? true : false;
};

/**
 * Returns true if this time zone switches to daylight savings time at some point
 * in the year, and false otherwise.
 * @param {number} year Whether or not the time zone uses daylight time in the given year. If
 * this parameter is not given, the current year is assumed.
 * @return {boolean} true if the time zone uses daylight savings time
 */
ilib.TimeZone.prototype.useDaylightTime = function (year) {
	
	// this zone uses daylight savings time iff there is a rule defining when to start
	// and when to stop the DST
	return (this.isLocal && this.offsetJan1 !== this.offsetJun1) ||
		(typeof(this.zone) !== 'undefined' && 
		typeof(this.zone.s) !== 'undefined' && 
		typeof(this.zone.e) !== 'undefined');
};

/**
 * Returns the ISO 3166 code of the country for which this time zone is defined.
 * @return {string} the ISO 3166 code of the country for this zone
 */
ilib.TimeZone.prototype.getCountry = function () {
	return this.zone.c;
};
/*
 * resources.js - Resource bundle definition
 * 
 * Copyright © 2012-2014, JEDLSoft
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

// !depends ilibglobal.js locale.js localeinfo.js strings.js util/utils.js

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

	ilib.loadData({
		object: ilib.ResBundle[this.baseName], 
		locale: lookupLocale, 
		name: this.baseName + ".json", 
		sync: this.sync, 
		loadParams: this.loadParams, 
		callback: ilib.bind(this, function (map) {
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
		})
	});

	// console.log("Merged resources " + this.locale.toString() + " are: " + JSON.stringify(this.map));
	//if (!this.locale.isPseudo() && ilib.isEmpty(this.map)) {
	//	console.log("Resources for bundle " + this.baseName + " locale " + this.locale.toString() + " are not available.");
	//}
};

ilib.ResBundle.defaultPseudo = ilib.data.pseudomap || {
	"a": "à",
	"e": "ë",
	"i": "í",
	"o": "õ",
	"u": "ü",
	"y": "ÿ",
	"A": "Ã",
	"E": "Ë",
	"I": "Ï",
	"O": "Ø",
	"U": "Ú",
	"Y": "Ŷ"
};

ilib.ResBundle.prototype = {
    /**
     * @protected
     */
    _loadPseudo: function (pseudoLocale, onLoad) {
		ilib.loadData({
			object: ilib.ResBundle.pseudomap, 
			locale: pseudoLocale, 
			name: "pseudomap.json", 
			sync: this.sync, 
			loadParams: this.loadParams, 
			callback: ilib.bind(this, function (map) {
				if (!map || ilib.isEmpty(map)) {
					map = ilib.ResBundle.defaultPseudo;
					var spec = pseudoLocale.getSpec().replace(/-/g, '_');
					ilib.ResBundle.pseudomap.cache[spec] = map;
				}
				this.pseudomap = map;
				if (typeof(onLoad) === 'function') {
					onLoad(this);
				}	
			})
		});
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
		if (!source && !key) return new ilib.String("");

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
		if (trans === undefined) {
			return undefined;
		} else {
			var ret = new ilib.String(trans);
			ret.setLocale(this.locale.getSpec(), true, this.loadParams); // no callback
			return ret;
		}
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

/*
 * util/jsutils.js - Misc utilities to work around Javascript engine differences
 * 
 * Copyright © 2013-2014, JEDLSoft
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
 * Perform a shallow copy of the source object to the target object. This only 
 * copies the assignments of the source properties to the target properties, 
 * but not recursively from there.<p>
 * 
 * Depends directive: !depends utils.js
 * 
 * @static
 * @param {Object} source the source object to copy properties from
 * @param {Object} target the target object to copy properties into
 */
ilib.shallowCopy = function (source, target) {
	var prop = undefined;
	if (source && target) {
		for (prop in source) {
			if (prop !== undefined && typeof(source[prop]) !== 'undefined') {
				target[prop] = source[prop];
			}
		}
	}
};

/** [Need Comment]
 * 
 */
ilib.deepCopy = function(from, to) {
	var prop;

	for (prop in from) {
		if (prop) {
			if (typeof(from[prop]) === 'object') {
				to[prop] ={};
				ilib.deepCopy(from[prop], to[prop]);
			} else {
				to[prop] = from[prop];
			}
		}
	}
	return to;
};

/**
 * Map a string to the given set of alternate characters. If the target set
 * does not contain a particular character in the input string, then that
 * character will be copied to the output unmapped.
 * 
 * @static
 * @param {string} str a string to map to an alternate set of characters
 * @param {Array.<string>|Object} map a mapping to alternate characters
 * @return {string} the source string where each character is mapped to alternate characters
 */
ilib.mapString = function (str, map) {
	var mapped = "";
	if (map && str) {
		for (var i = 0; i < str.length; i++) {
			var c = str.charAt(i); // TODO use a char iterator?
			mapped += map[c] || c; 
		}
	} else {
		mapped = str;
	}
	return mapped;
};

/**
 * Check if an object is a member of the given array. If this javascript engine
 * support indexOf, it is used directly. Otherwise, this function implements it
 * itself. The idea is to make sure that you can use the quick indexOf if it is
 * available, but use a slower implementation in older engines as well.
 * 
 * @static
 * @param {Array.<Object>} array array to search
 * @param {Object} obj object being sought. This should be of the same type as the
 * members of the array being searched. If not, this function will not return
 * any results.
 * @return {number} index of the object in the array, or -1 if it is not in the array.
 */
ilib.indexOf = function(array, obj) {
	if (!array || !obj) {
		return -1;
	}
	if (typeof(array.indexOf) === 'function') {
		return array.indexOf(obj);
	} else {
		for (var i = 0; i < array.length; i++) {
	        if (array[i] === obj) {
	            return i;
	        }
	    }
	    return -1;
	}
};

/**
 * @static
 * Convert a string into the hexadecimal representation
 * of the Unicode characters in that string.
 * 
 * @param {string} string The string to convert
 * @param {number=} limit the number of digits to use to represent the character (1 to 8)
 * @return {string} a hexadecimal representation of the
 * Unicode characters in the input string
 */
ilib.toHexString = function(string, limit) {
	var i, 
		result = "", 
		lim = (limit && limit < 9) ? limit : 4;
	
	if (!string) {
		return "";
	}
	for (i = 0; i < string.length; i++) {
		var ch = string.charCodeAt(i).toString(16);
		result += "00000000".substring(0, lim-ch.length) + ch;
	}
	return result.toUpperCase();
};

/*
 * datefmt.js - Date formatter definition
 * 
 * Copyright © 2012-2014, JEDLSoft
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
calendar/gregorian.js
util/jsutils.js
*/

// !data dateformats sysres

/**
 * @class
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
 * instance or a time zone specifier from the IANA list of time zone database names 
 * (eg. "America/Los_Angeles"), 
 * the string "local", or a string specifying the offset in RFC 822 format. The IANA
 * list of time zone names can be viewed at 
 * <a href="http://en.wikipedia.org/wiki/List_of_tz_database_time_zones">this page</a>.
 * If the time zone is given as "local", the offset from UTC as given by
 * the Javascript system is used. If the offset is given as an RFC 822 style offset
 * specifier, it will parse that string and use the resulting offset. If the time zone
 * is not specified, the
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
 * <li><i>useNative</i> - the flag used to determine whether to use the native script settings 
 * for formatting the numbers.
 *
 * <li><i>meridiems</i> - string that specifies what style of meridiems to use with this 
 * format. The choices are "default" and "chinese". The "default" style is the simple AM/PM,
 * and the "chinese" style uses 7 different meridiems corresponding to the various parts of 
 * the day. The default if not specified is "default", even for the Chinese locales. 
 *
 * <li><i>onLoad</i> - a callback function to call when the date format object is fully 
 * loaded. When the onLoad option is given, the DateFmt object will attempt to
 * load any missing locale data using the ilib loader callback.
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
	var arr, i, bad, 
		sync = true, 
		loadParams = undefined;
	
	this.locale = new ilib.Locale();
	this.type = "date";
	this.length = "s";
	this.dateComponents = "dmy";
	this.timeComponents = "ahm";
	this.meridiems = "default";
	
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
			if (options.timezone instanceof ilib.TimeZone) {
				this.tz = options.timezone;
			} else {
				this.tz = new ilib.TimeZone({
					locale: this.locale, 
					id: options.timezone
				});
			}
		} else if (options.locale) {
			// if an explicit locale was given, then get the time zone for that locale
			this.tz = new ilib.TimeZone({
				locale: this.locale
			});
		} // else just assume time zone "local"
		
		if (typeof(options.useNative) === 'boolean') {
			this.useNative = options.useNative;
		}
		
		if (typeof(options.meridiems) !== 'undefined' && options.meridiems === "chinese") {
			this.meridiems = options.meridiems;
		}
		
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync === true);
		}
		
		loadParams = options.loadParams;
	}

	if (!ilib.DateFmt.cache) {
		ilib.DateFmt.cache = {};
	}

	new ilib.LocaleInfo(this.locale, {
		sync: sync,
		loadParams: loadParams, 
		onLoad: ilib.bind(this, function (li) {
			this.locinfo = li;
			
			// get the default calendar name from the locale, and if the locale doesn't define
			// one, use the hard-coded gregorian as the last resort
			this.calName = this.calName || this.locinfo.getCalendar() || "gregorian";
			this.cal = ilib.Cal.newInstance({
				type: this.calName
			});
			if (!this.cal) {
				this.cal = new ilib.Cal.Gregorian();
			}

			/*
			if (this.timeComponents &&
					(this.clock === '24' || 
					(!this.clock && this.locinfo.getClock() === "24"))) {
				// make sure we don't have am/pm in 24 hour mode unless the user specifically
				// requested it in the time component option
				this.timeComponents = this.timeComponents.replace("a", "");
			}
			*/

			// load the strings used to translate the components
			new ilib.ResBundle({
				locale: this.locale,
				name: "sysres",
				sync: sync,
				loadParams: loadParams, 
				onLoad: ilib.bind(this, function (rb) {
					this.sysres = rb;
					
					if (!this.template) {
						ilib.loadData({
							object: ilib.DateFmt, 
							locale: this.locale, 
							name: "dateformats.json", 
							sync: sync, 
							loadParams: loadParams, 
							callback: ilib.bind(this, function (formats) {
								if (!formats) {
									formats = ilib.data.dateformats || ilib.DateFmt.defaultFmt;
									var spec = this.locale.getSpec().replace(/-/g, '_');
									ilib.DateFmt.cache[spec] = formats;
								}
								if (typeof(this.clock) === 'undefined') {
									// default to the locale instead
									this.clock = this.locinfo.getClock();
								}
								this._initTemplate(formats);
								this._massageTemplate();
								if (options && typeof(options.onLoad) === 'function') {
									options.onLoad(this);
								}
							})
						});
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

ilib.DateFmt.defaultFmt = {
	"gregorian": {
		"order": "{date} {time}",
		"date": {
			"dmwy": "EEE d/MM/yyyy",
			"dmy": "d/MM/yyyy",
			"dmw": "EEE d/MM",
			"dm": "d/MM",
			"my": "MM/yyyy",
			"dw": "EEE d",
			"d": "dd",
			"m": "MM",
			"y": "yyyy",
			"n": "NN",
			"w": "EEE"
		},
		"time": {
			"12": "h:mm:ssa",
			"24": "H:mm:ss"
		},
		"range": {
			"c00": "{st} - {et}, {sd}/{sm}/{sy}",
			"c01": "{sd}/{sm} {st} - {ed}/{em} {et}, {sy}",
			"c02": "{sd}/{sm} {st} - {ed}/{em} {et}, {sy}",
			"c03": "{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}",
			"c10": "{sd}-{ed}/{sm}/{sy}",
			"c11": "{sd}/{sm} - {ed}/{em} {sy}",
			"c12": "{sd}/{sm}/{sy} - {ed}/{em}/{ey}",
			"c20": "{sm}/{sy} - {em}/{ey}",
			"c30": "{sy} - {ey}"
		}
	},
	"islamic": "gregorian",
	"hebrew": "gregorian",
	"julian": "gregorian",
	"buddhist": "gregorian",
	"persian": "gregorian",
	"persian-algo": "gregorian",
	"han": "gregorian"
};

/**
* @static
* @private
*/
ilib.DateFmt.monthNameLenMap = {
	"short" : "N",
	"medium": "NN",
	"long":   "MMM",
	"full":   "MMMM"
};

/**
* @static
* @private
*/
ilib.DateFmt.weekDayLenMap = {
	"short" : "E",
	"medium": "EE",
	"long":   "EEE",
	"full":   "EEEE"
};

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
					this.template = this.template.replace("{date}", this._getFormat(this.formats.date, this.dateComponents, this.length) || "");
					this.template = this.template.replace("{time}", this._getFormat(this.formats.time[this.clock], this.timeComponents, this.length) || "");
					break;
				case "date":
					this.template = this._getFormat(this.formats.date, this.dateComponents, this.length);
					break;
				case "time":
					this.template = this._getFormat(this.formats.time[this.clock], this.timeComponents, this.length);
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

		var digits;
		// set up the mapping to native or alternate digits if necessary
		if (typeof(this.useNative) === "boolean") {
			if (this.useNative) {
				digits = this.locinfo.getNativeDigits();
				if (digits) {
					this.digits = digits;
				}
			}
		} else if (this.locinfo.getDigitsStyle() === "native") {
			digits = this.locinfo.getNativeDigits();
			if (digits) {
				this.useNative = true;
				this.digits = digits;
			}
		}
	},
    
	/**
	 * Convert the template into an array of date components separated by formatting chars.
	 * @protected
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
		if (typeof(components) !== 'undefined' && obj && obj[components]) {
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
			this.tz = new ilib.TimeZone({id: ilib.getTimeZone()});
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
	 * @private
	 */
	_getTemplate: function (prefix, calendar) {
		if (calendar !== "gregorian") {
			return prefix + "-" + calendar;
		}
		return prefix;
	},

	/**
	 * Returns an array of the months of the year, formatted to the optional length specified.
	 * i.e. ...getMonthsOfYear() OR ...getMonthsOfYear({length: "short"})
	 * <p>
	 * The options parameter may contain any of the following properties:
	 * 
	 * <ul>
	 * <li><i>length</i> - length of the names of the months being sought. This may be one of
	 * "short", "medium", "long", or "full"
	 * <li><i>date</i> - retrieve the names of the months in the date of the given date
	 * <li><i>year</i> - retrieve the names of the months in the given year. In some calendars,
	 * the months have different names depending if that year is a leap year or not.
	 * </ul>
	 * 
	 * @param  {Object=} options an object-literal that contains any of the above properties
	 * @return {Array} an array of the names of all of the months of the year in the current calendar
	 */
	getMonthsOfYear: function(options) {
		var length = (options && options.length) || this.getLength(),
			template = ilib.DateFmt.monthNameLenMap[length],
			months = [undefined],
			date,
			monthCount;
		
		if (options) {
			if (options.date) {
				date = ilib.Date._dateToIlib(options.date); 	
			}
			
			if (options.year) {
				date = ilib.Date.newInstance({year: options.year, month: 1, day: 1, type: this.cal.getType()});
			}
		}
		
		if (!date) {
			date = this.cal.newDateInstance();
		}

		monthCount = this.cal.getNumMonths(date.getYears());
		for (var i = 1; i <= monthCount; i++) {
			months[i] = this.sysres.getString(this._getTemplate(template + i, this.cal.getType())).toString();
		}
		return months;
	},

	/**
	 * Returns an array of the days of the week, formatted to the optional length specified.
	 * i.e. ...getDaysOfWeek() OR ...getDaysOfWeek({length: "short"})
	 * <p>
	 * The options parameter may contain any of the following properties:
	 * 
	 * <ul>
	 * <li><i>length</i> - length of the names of the months being sought. This may be one of
	 * "short", "medium", "long", or "full"
	 * </ul>
	 * @param  {Object=} options an object-literal that contains one key 
	 *                   "length" with the standard length strings
	 * @return {Array} an array of all of the names of the days of the week
	 */
	getDaysOfWeek: function(options) {
		var length = (options && options.length) || this.getLength(),
			template = ilib.DateFmt.weekDayLenMap[length],
			days = [];
		for (var i = 0; i < 7; i++) {
			days[i] = this.sysres.getString(this._getTemplate(template + i, this.cal.getType())).toString();
		}
		return days;
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
		var start = 0;
		if (str.charAt(0) === '-') {
			start++;
		}
		return (str.length >= length+start) ? str : str.substring(0, start) + ilib.DateFmt.zeros.substring(0,length-str.length+start) + str.substring(start);
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
					str += this._pad(date.day || "1", 2);
					break;
				case 'yy':
					temp = "" + ((date.year || 0) % 100);
					str += this._pad(temp, 2);
					break;
				case 'yyyy':
					str += this._pad(date.year || "0", 4);
					break;
				case 'M':
					str += (date.month || 1);
					break;
				case 'MM':
					str += this._pad(date.month || "1", 2);
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
					str += (date.hour || "0");
					break;
				case 'HH':
					str += this._pad(date.hour || "0", 2);
					break;
				case 'k':
					str += (date.hour == 0 ? "24" : date.hour);
					break;
				case 'kk':
					temp = (date.hour == 0 ? "24" : date.hour);
					str += this._pad(temp, 2);
					break;

				case 'm':
					str += (date.minute || "0");
					break;
				case 'mm':
					str += this._pad(date.minute || "0", 2);
					break;
				case 's':
					str += (date.minute || "0");
					break;
				case 'ss':
					str += this._pad(date.second || "0", 2);
					break;
				case 'S':
					str += (date.millisecond || "0");
					break;
				case 'SSS':
					str += this._pad(date.millisecond || "0", 3);
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
					if (this.meridiems === "chinese") {
						if (date.hour < 6) {
							key = "azh0";	// before dawn
						} else if (date.hour < 9) {
							key = "azh1";	// morning
						} else if (date.hour < 12) {
							key = "azh2";	// late morning/day before noon
						} else if (date.hour < 13) {
							key = "azh3";	// noon hour/midday
						} else if (date.hour < 18) {
							key = "azh4";	// afternoon
						} else if (date.hour < 21) {
							key = "azh5";	// evening time/dusk
						} else {
							key = "azh6";	// night time
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

		if (this.digits) {
			str = ilib.mapString(str, this.digits);
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
	 * @param {Date|Number|String|ilib.Date|ilib.JulianDay|null|undefined} dateLike a date-like object to format
	 * @return {string} the formatted version of the given date instance
	 */
	format: function (dateLike) {
		var thisZoneName = this.tz && this.tz.getId() || "local";

		var date = ilib.Date._dateToIlib(dateLike, thisZoneName);
		
		if (!date.getCalendar || !(date instanceof ilib.Date)) {
			throw "Wrong date type passed to ilib.DateFmt.format()";
		}
		
		var dateZoneName = date.timezone || "local";
		
		// convert to the time zone of this formatter before formatting
		if (dateZoneName !== thisZoneName || date.getCalendar() !== this.calName) {
			// console.log("Differing time zones date: " + dateZoneName + " and fmt: " + thisZoneName + ". Converting...");
			// this will recalculate the date components based on the new time zone
			// and/or convert a date in another calendar to the current calendar before formatting it
			var newDate = ilib.Date.newInstance({
				type: this.calName,
				timezone: thisZoneName,
				julianday: date.getJulianDay()
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
	 * @param {Date|Number|String|ilib.Date|ilib.JulianDay|null|undefined} reference a date that the date parameter should be relative to
	 * @param {Date|Number|String|ilib.Date|ilib.JulianDay|null|undefined} date a date being formatted
	 * @throws "Wrong calendar type" when the start or end dates are not the same
	 * calendar type as the formatter itself
	 * @return {string} the formatted relative date
	 */
	formatRelative: function(reference, date) {
		reference = ilib.Date._dateToIlib(reference);
		date = ilib.Date._dateToIlib(date);
		
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
 * Copyright © 2012-2014, JEDLSoft
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
calendar/gregorian.js
util/jsutils.js
*/

// !data dateformats sysres

/**
 * @class
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
 *  
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
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
	var loadParams = undefined;
	this.locale = new ilib.Locale();
	this.length = "s";
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
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
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		loadParams = options.loadParams;
	}
	
	var opts = {};
	ilib.shallowCopy(options, opts);
	opts.sync = sync;
	opts.loadParams = loadParams;
	
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
			this.cal = ilib.Cal.newInstance({
				type: this.calName
			});
			if (!this.cal) {
				this.cal = new ilib.Cal.Gregorian();
			}
			
			this.timeTemplate = this.dateFmt._getFormat(this.dateFmt.formats.time[this.dateFmt.clock], this.dateFmt.timeComponents, this.length) || "hh:mm";
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
		// c10 - difference is less than 2 years. Year and month are the same, but date is different.
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
 * Copyright © 2012-2014, JEDLSoft
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


/* !depends calendar.js locale.js date.js julianday.js util/utils.js util/math.js */

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
 * Return the number of days elapsed in the Hebrew calendar before the
 * given year starts.
 * @private
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
 * Return the number of days that the New Year's (Rosh HaShanah) in the Hebrew 
 * calendar will be corrected for the given year. Corrections are caused because New 
 * Year's is not allowed to start on certain days of the week. To deal with 
 * it, the start of the new year is corrected for the next year by adding a 
 * day to the 8th month (Heshvan) and/or the 9th month (Kislev) in the current
 * year to make them 30 days long instead of 29.
 * 
 * @private
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
 * Return the rata die date of the new year for the given hebrew year.
 * @private
 * @param {number} year the year for which the new year is needed
 * @return {number} the rata die date of the new year
 */
ilib.Cal.Hebrew.newYear = function(year) {
	var elapsed = ilib.Cal.Hebrew.elapsedDays(year); 
	
	return elapsed + ilib.Cal.Hebrew.newYearsCorrection(year, elapsed);
};

/**
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
 * Return true if the given year contains a long month of Heshvan. That is,
 * it is 30 days instead of 29.
 * 
 * @private
 * @param {number} year the year in which that month is questioned
 * @return {boolean} true if the given year contains a long month of Heshvan
 */
ilib.Cal.Hebrew.longHeshvan = function(year) {
	return ilib.mod(ilib.Cal.Hebrew.daysInYear(year), 10) === 5;
};

/**
 * Return true if the given year contains a long month of Kislev. That is,
 * it is 30 days instead of 29.
 * 
 * @private
 * @param {number} year the year in which that month is questioned
 * @return {boolean} true if the given year contains a short month of Kislev
 */
ilib.Cal.Hebrew.longKislev = function(year) {
	return ilib.mod(ilib.Cal.Hebrew.daysInYear(year), 10) !== 3;
};

/**
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
 * Copyright © 2012-2014, JEDLSoft
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
date.js 
calendar/hebrew.js
calendar/ratadie.js
util/utils.js
util/math.js
julianday.js 
*/

/**
 * @class
 * Construct a new Hebrew RD date number object. The constructor parameters can 
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
 * <li><i>parts</i> - 0 to 1079. Specify the halaqim parts of an hour. Either specify 
 * the parts or specify the minutes, seconds, and milliseconds, but not both. 
 * 
 * <li><i>minute</i> - 0 to 59
 * 
 * <li><i>second</i> - 0 to 59
 * 
 * <li><i>millisecond</i> - 0 to 999
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Hebrew date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above are present, then the RD is calculate based on 
 * the current date at the time of instantiation. <p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * Depends directive: !depends hebrewdate.js
 * 
 * @private
 * @constructor
 * @extends ilib.Date.RataDie
 * @param {Object=} params parameters that govern the settings and behaviour of this Hebrew RD date
 */
ilib.Date.HebrewRataDie = function(params) {
	this.cal = params && params.cal || new ilib.Cal.Hebrew();
	this.rd = undefined;
	ilib.Date.RataDie.call(this, params);
};

ilib.Date.HebrewRataDie.prototype = new ilib.Date.RataDie();
ilib.Date.HebrewRataDie.prototype.parent = ilib.Date.RataDie;
ilib.Date.HebrewRataDie.prototype.constructor = ilib.Date.HebrewRataDie;

/**
 * The difference between a zero Julian day and the first day of the Hebrew 
 * calendar: sunset on Monday, Tishri 1, 1 = September 7, 3760 BC Gregorian = JD 347997.25
 * @private
 * @const
 * @type number
 */
ilib.Date.HebrewRataDie.prototype.epoch = 347997.25;

/**
 * Calculate the Rata Die (fixed day) number of the given date from the
 * date components.
 * 
 * @private
 * @param {Object} date the date components to calculate the RD from
 */
ilib.Date.HebrewRataDie.prototype._setDateComponents = function(date) {
	var elapsed = ilib.Cal.Hebrew.elapsedDays(date.year);
	var days = elapsed +
		ilib.Cal.Hebrew.newYearsCorrection(date.year, elapsed) +
		date.day - 1;
	var sum = 0, table;
	
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
	var minute, second, millisecond;
	
	if (typeof(date.parts) !== 'undefined') {
		// The parts (halaqim) of the hour. This can be a number from 0 to 1079.
		var parts = parseInt(date.parts, 10);
		var seconds = parseInt(parts, 10) * 3.333333333333;
		minute = Math.floor(seconds / 60);
		seconds -= minute * 60;
		second = Math.floor(seconds);
		millisecond = (seconds - second);	
	} else {
		minute = parseInt(date.minute, 10) || 0;
		second = parseInt(date.second, 10) || 0;
		millisecond = parseInt(date.millisecond, 10) || 0;
	}
		
	var time;
	if (date.hour >= 18) {
		time = ((date.hour - 18 || 0) * 3600000 +
			(minute || 0) * 60000 +
			(second || 0) * 1000 +
			(millisecond || 0)) / 
			86400000;
	} else {
		time = 0.25 +	// 6 hours from 18:00 to midnight on the previous gregorian day
				((date.hour || 0) * 3600000 +
				(minute || 0) * 60000 +
				(second || 0) * 1000 +
				(millisecond || 0)) / 
				86400000;
	}
	
	//console.log("getRataDie: rd is " +  (days + time));
	this.rd = days + time;
};
	
/**
 * Return the rd number of the particular day of the week on or before the 
 * given rd. eg. The Sunday on or before the given rd.
 * @private
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the current date
 * @return {number} the rd of the day of the week
 */
ilib.Date.HebrewRataDie.prototype._onOrBefore = function(rd, dayOfWeek) {
	return rd - ilib.mod(Math.floor(rd) - dayOfWeek + 1, 7);
};

/**
 * @class
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
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
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

		if (params.year || params.month || params.day || params.hour ||
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
			
			if (typeof(params.dst) === 'boolean') {
				this.dst = params.dst;
			}
			
			this.rd = this.newRd(this);
			
			// add the time zone offset to the rd to convert to UTC
			if (!this.tz) {
				this.tz = new ilib.TimeZone({id: this.timezone});
			}
			// getOffsetMillis requires that this.year, this.rd, and this.dst 
			// are set in order to figure out which time zone rules apply and 
			// what the offset is at that point in the year
			this.offset = this.tz._getOffsetMillisWallTime(this) / 86400000;
			if (this.offset !== 0) {
				this.rd = this.newRd({
					rd: this.rd.getRataDie() - this.offset
				});
			}
		}
	} 
	
	if (!this.rd) {
		this.rd = this.newRd(params);
		this._calcDateComponents();
	}
};

ilib.Date.HebrewDate.prototype = new ilib.Date({noinstance: true});
ilib.Date.HebrewDate.prototype.parent = ilib.Date;
ilib.Date.HebrewDate.prototype.constructor = ilib.Date.HebrewDate;

/**
 * the cumulative lengths of each month for a non-leap year, without new years corrections
 * @private
 * @const
 * @type Array.<number>
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
 * the cumulative lengths of each month for a non-leap year, without new years corrections,
 * that can be used in reverse to map days to months
 * @private
 * @const
 * @type Array.<number>
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
 * the cumulative lengths of each month for a leap year, without new years corrections 
 * @private
 * @const
 * @type Array.<number>
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
 * the cumulative lengths of each month for a leap year, without new years corrections
 * that can be used in reverse to map days to months 
 * 
 * @private
 * @const
 * @type Array.<number>
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
 * Number of days difference between RD 0 of the Hebrew calendar 
 * (Jan 1, 1 Gregorian = JD 1721057.5) and RD 0 of the Hebrew calendar
 * (September 7, -3760 Gregorian = JD 347997.25)
 * @private
 * @const
 * @type number
 */
ilib.Date.HebrewDate.GregorianDiff = 1373060.25;

/**
 * Return a new RD for this date type using the given params.
 * @private
 * @param {Object=} params the parameters used to create this rata die instance
 * @returns {ilib.Date.RataDie} the new RD instance for the given params
 */
ilib.Date.HebrewDate.prototype.newRd = function (params) {
	return new ilib.Date.HebrewRataDie(params);
};

/**
 * Return the year for the given RD
 * @protected
 * @param {number} rd RD to calculate from 
 * @returns {number} the year for the RD
 */
ilib.Date.HebrewDate.prototype._calcYear = function(rd) {
	var year, approximation, nextNewYear;
	
	// divide by the average number of days per year in the Hebrew calendar
	// to approximate the year, then tweak it to get the real year
	approximation = Math.floor(rd / 365.246822206) + 1;
	
	// console.log("HebrewDate._calcYear: approx is " + approximation);
	
	// search forward from approximation-1 for the year that actually contains this rd
	year = approximation;
	nextNewYear = ilib.Cal.Hebrew.newYear(year);
	while (rd >= nextNewYear) {
		year++;
		nextNewYear = ilib.Cal.Hebrew.newYear(year);
	}
	return year - 1;
};

/**
 * Calculate date components for the given RD date.
 * @protected
 */
ilib.Date.HebrewDate.prototype._calcDateComponents = function () {
	var remainder,
		i,
		table,
		target,
		rd = this.rd.getRataDie();
	
	// console.log("HebrewDate.calcComponents: calculating for rd " + rd);

	if (typeof(this.offset) === "undefined") {
		this.year = this._calcYear(rd);
		
		// now offset the RD by the time zone, then recalculate in case we were 
		// near the year boundary
		if (!this.tz) {
			this.tz = new ilib.TimeZone({id: this.timezone});
		}
		this.offset = this.tz.getOffsetMillis(this) / 86400000;
	}

	if (this.offset !== 0) {
		rd += this.offset;
		this.year = this._calcYear(rd);
	}
	
	// console.log("HebrewDate.calcComponents: year is " + this.year + " with starting rd " + thisNewYear);
	
	remainder = rd - ilib.Cal.Hebrew.newYear(this.year);
	// console.log("HebrewDate.calcComponents: remainder is " + remainder);

	// take out new years corrections so we get the right month when we look it up in the table
	if (remainder >= 59) {
		if (remainder >= 88) {
			if (ilib.Cal.Hebrew.longKislev(this.year)) {
				remainder--;
			}
		}
		if (ilib.Cal.Hebrew.longHeshvan(this.year)) {
			remainder--;
		}
	}
	
	// console.log("HebrewDate.calcComponents: after new years corrections, remainder is " + remainder);
	
	table = this.cal.isLeapYear(this.year) ? 
			ilib.Date.HebrewDate.cumMonthLengthsLeapReverse :
			ilib.Date.HebrewDate.cumMonthLengthsReverse;
	
	i = 0;
	target = Math.floor(remainder);
	while (i+1 < table.length && target >= table[i+1][0]) {
		i++;
	}
	
	this.month = table[i][1];
	// console.log("HebrewDate.calcComponents: remainder is " + remainder);
	remainder -= table[i][0];
	
	// console.log("HebrewDate.calcComponents: month is " + this.month + " and remainder is " + remainder);
	
	this.day = Math.floor(remainder);
	remainder -= this.day;
	this.day++; // days are 1-based
	
	// console.log("HebrewDate.calcComponents: day is " + this.day + " and remainder is " + remainder);

	// now convert to milliseconds for the rest of the calculation
	remainder = Math.round(remainder * 86400000);
	
	this.hour = Math.floor(remainder/3600000);
	remainder -= this.hour * 3600000;
	
	// the hours from 0 to 6 are actually 18:00 to midnight of the previous
	// gregorian day, so we have to adjust for that
	if (this.hour >= 6) {
		this.hour -= 6;
	} else {
		this.hour += 18;
	}
		
	this.minute = Math.floor(remainder/60000);
	remainder -= this.minute * 60000;
	
	this.second = Math.floor(remainder/1000);
	remainder -= this.second * 1000;
	
	this.millisecond = Math.floor(remainder);
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 * 
 * @return {number} the day of the week
 */
ilib.Date.HebrewDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.rd.getRataDie() + (this.offset || 0));
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
 * Return the rd number of the first Sunday of the given ISO year.
 * @protected
 * @return the rd of the first Sunday of the ISO year
 */
ilib.Date.HebrewDate.prototype.firstSunday = function (year) {
	var tishri1 = this.newRd({
		year: year,
		month: 7,
		day: 1,
		hour: 18,
		minute: 0,
		second: 0,
		millisecond: 0,
		cal: this.cal
	});
	var firstThu = this.newRd({
		rd: tishri1.onOrAfter(4),
		cal: this.cal
	});
	return firstThu.before(0);
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
		first = this.newRd({
			year: this.year,
			month: this.month,
			day: 1,
			hour: 18,
			minute: 0,
			second: 0,
			millisecond: 0
		}),
		rd = this.rd.getRataDie(),
		weekStart = first.onOrAfter(li.getFirstDayOfWeek());
	
	if (weekStart - first.getRataDie() > 3) {
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
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
ilib.Date.HebrewDate.prototype.getCalendar = function() {
	return "hebrew";
};

// register with the factory method
ilib.Date._constructors["hebrew"] = ilib.Date.HebrewDate;
/*
 * islamic.js - Represent a Islamic calendar object.
 * 
 * Copyright © 2012-2014, JEDLSoft
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


/* !depends calendar.js locale.js date.js julianday.js util/utils.js util/math.js */

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
 * the lengths of each month 
 * @private
 * @const
 * @type Array.<number>
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
 * util/search.js - Misc search utility routines
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

// !depends ilibglobal.js

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
 * @static
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
 * Returns whether or not the given element is greater than, less than,
 * or equal to the given target.<p>
 * 
 * @private
 * @static
 * @param {number} element the element being tested
 * @param {number} target the target being sought
 */
ilib.bsearch.numbers = function(element, target) {
	return element - target;
};

/**
 * Do a bisection search of a function for a particular target value.<p> 
 * 
 * The function to search is a function that takes a numeric parameter, 
 * does calculations, and returns gives a numeric result. The 
 * function should should be smooth and not have any discontinuities 
 * between the low and high values of the parameter.
 *  
 * Depends directive: !depends utils.js
 * 
 * @static
 * @param {number} target value being sought
 * @param {number} low the lower bounds to start searching
 * @param {number} high the upper bounds to start searching
 * @param {number} precision minimum precision to support. Use 0 if you want to use the default.
 * @param {?function(number)=} func function to search 
 * @return an approximation of the input value to the function that gives the desired
 * target output value, correct to within the error range of Javascript floating point 
 * arithmetic, or NaN if there was some error
 */
ilib.bisectionSearch = function(target, low, high, precision, func) {
	if (typeof(target) !== 'number' || 
			typeof(low) !== 'number' || 
			typeof(high) !== 'number' || 
			typeof(func) !== 'function') {
		return NaN;
	}
	
	var mid = 0,
		value,
		pre = precision > 0 ? precision : 1e-13;
	
	function compareSignificantDigits(a, b) {
		var leftParts = a.toExponential().split('e');
		var rightParts = b.toExponential().split('e');
		var left = new Number(leftParts[0]);
		var right = new Number(rightParts[0]);
		
		return leftParts[1] === rightParts[1] && Math.abs(left - right) < pre; 
	}
	
	do {
		mid = (high+low)/2;
		value = func(mid);
		if (value > target) {
			high = mid;
		} else if (value < target) {
			low = mid;
		}
	} while (high - low > pre);
	
	return mid;
};


/*
 * islamicdate.js - Represent a date in the Islamic calendar
 * 
 * Copyright © 2012-2014, JEDLSoft
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
date.js 
calendar/islamic.js 
util/utils.js 
util/search.js
util/math.js
localeinfo.js
julianday.js
*/

/**
 * @class
 * Construct a new Islamic RD date number object. The constructor parameters can 
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
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Islamic date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above are present, then the RD is calculate based on 
 * the current date at the time of instantiation. <p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * Depends directive: !depends islamicdate.js
 * 
 * @private
 * @constructor
 * @extends ilib.Date.RataDie
 * @param {Object=} params parameters that govern the settings and behaviour of this Islamic RD date
 */
ilib.Date.IslamicRataDie = function(params) {
	this.cal = params && params.cal || new ilib.Cal.Islamic();
	this.rd = undefined;
	ilib.Date.RataDie.call(this, params);
};

ilib.Date.IslamicRataDie.prototype = new ilib.Date.RataDie();
ilib.Date.IslamicRataDie.prototype.parent = ilib.Date.RataDie;
ilib.Date.IslamicRataDie.prototype.constructor = ilib.Date.IslamicRataDie;

/**
 * The difference between a zero Julian day and the first Islamic date
 * of Friday, July 16, 622 CE Julian. 
 * @private
 * @const
 * @type number
 */
ilib.Date.IslamicRataDie.prototype.epoch = 1948439.5;

/**
 * Calculate the Rata Die (fixed day) number of the given date from the
 * date components.
 *
 * @protected
 * @param {Object} date the date components to calculate the RD from
 */
ilib.Date.IslamicRataDie.prototype._setDateComponents = function(date) {
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

	this.rd = days + time;
};
	
/**
 * @class
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
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
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
		if (params.locale) {
			this.locale = (typeof(params.locale) === 'string') ? new ilib.Locale(params.locale) : params.locale;
			var li = new ilib.LocaleInfo(this.locale);
			this.timezone = li.getTimeZone(); 
		}
		if (params.timezone) {
			this.timezone = params.timezone;
		}
		
		if (params.year || params.month || params.day || params.hour ||
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

			if (typeof(params.dst) === 'boolean') {
				this.dst = params.dst;
			}
			
			this.rd = this.newRd(this);
			
			// add the time zone offset to the rd to convert to UTC
			if (!this.tz) {
				this.tz = new ilib.TimeZone({id: this.timezone});
			}
			// getOffsetMillis requires that this.year, this.rd, and this.dst 
			// are set in order to figure out which time zone rules apply and 
			// what the offset is at that point in the year
			this.offset = this.tz._getOffsetMillisWallTime(this) / 86400000;
			if (this.offset !== 0) {
				this.rd = this.newRd({
					rd: this.rd.getRataDie() - this.offset
				});
			}
		}
	}

	if (!this.rd) {
		this.rd = this.newRd(params);
		this._calcDateComponents();
	}
};

ilib.Date.IslamicDate.prototype = new ilib.Date({noinstance: true});
ilib.Date.IslamicDate.prototype.parent = ilib.Date;
ilib.Date.IslamicDate.prototype.constructor = ilib.Date.IslamicDate;

/**
 * the cumulative lengths of each month, for a non-leap year 
 * @private
 * @const
 * @type Array.<number>
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
 * Number of days difference between RD 0 of the Gregorian calendar and
 * RD 0 of the Islamic calendar. 
 * @private
 * @const
 * @type number
 */
ilib.Date.IslamicDate.GregorianDiff = 227015;

/**
 * Return a new RD for this date type using the given params.
 * @protected
 * @param {Object=} params the parameters used to create this rata die instance
 * @returns {ilib.Date.RataDie} the new RD instance for the given params
 */
ilib.Date.IslamicDate.prototype.newRd = function (params) {
	return new ilib.Date.IslamicRataDie(params);
};

/**
 * Return the year for the given RD
 * @protected
 * @param {number} rd RD to calculate from 
 * @returns {number} the year for the RD
 */
ilib.Date.IslamicDate.prototype._calcYear = function(rd) {
	return Math.floor((30 * rd + 10646) / 10631);
};

/**
 * Calculate date components for the given RD date.
 * @protected
 */
ilib.Date.IslamicDate.prototype._calcDateComponents = function () {
	var remainder,
		rd = this.rd.getRataDie();
	
	this.year = this._calcYear(rd);

	if (typeof(this.offset) === "undefined") {
		this.year = this._calcYear(rd);
		
		// now offset the RD by the time zone, then recalculate in case we were 
		// near the year boundary
		if (!this.tz) {
			this.tz = new ilib.TimeZone({id: this.timezone});
		}
		this.offset = this.tz.getOffsetMillis(this) / 86400000;
	}

	if (this.offset !== 0) {
		rd += this.offset;
		this.year = this._calcYear(rd);
	}

	//console.log("IslamicDate.calcComponent: calculating for rd " + rd);
	//console.log("IslamicDate.calcComponent: year is " + ret.year);
	var yearStart = this.newRd({
		year: this.year,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	});
	remainder = rd - yearStart.getRataDie() + 1;
	
	this.dayOfYear = remainder;
	
	//console.log("IslamicDate.calcComponent: remainder is " + remainder);
	
	this.month = ilib.bsearch(remainder, ilib.Date.IslamicDate.cumMonthLengths);
	remainder -= ilib.Date.IslamicDate.cumMonthLengths[this.month-1];

	//console.log("IslamicDate.calcComponent: month is " + this.month + " and remainder is " + remainder);
	
	this.day = Math.floor(remainder);
	remainder -= this.day;

	//console.log("IslamicDate.calcComponent: day is " + this.day + " and remainder is " + remainder);

	// now convert to milliseconds for the rest of the calculation
	remainder = Math.round(remainder * 86400000);
	
	this.hour = Math.floor(remainder/3600000);
	remainder -= this.hour * 3600000;
	
	this.minute = Math.floor(remainder/60000);
	remainder -= this.minute * 60000;
	
	this.second = Math.floor(remainder/1000);
	remainder -= this.second * 1000;
	
	this.millisecond = remainder;
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 * 
 * @return {number} the day of the week
 */
ilib.Date.IslamicDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.rd.getRataDie() + (this.offset || 0));
	return ilib.mod(rd-2, 7);
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
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
ilib.Date.IslamicDate.prototype.getCalendar = function() {
	return "islamic";
};

//register with the factory method
ilib.Date._constructors["islamic"] = ilib.Date.IslamicDate;
/*
 * julian.js - Represent a Julian calendar object.
 * 
 * Copyright © 2012-2014, JEDLSoft
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


/* !depends calendar.js locale.js date.js julianday.js util/utils.js util/math.js */

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
 * Copyright © 2012-2014, JEDLSoft
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
date.js 
calendar/julian.js 
util/utils.js
util/search.js 
util/math.js
localeinfo.js 
julianday.js 
*/

/**
 * @class
 * Construct a new Julian RD date number object. The constructor parameters can 
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
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Julian date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above are present, then the RD is calculate based on 
 * the current date at the time of instantiation. <p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * Depends directive: !depends juliandate.js
 * 
 * @private
 * @constructor
 * @extends ilib.Date.RataDie
 * @param {Object=} params parameters that govern the settings and behaviour of this Julian RD date
 */
ilib.Date.JulianRataDie = function(params) {
	this.cal = params && params.cal || new ilib.Cal.Julian();
	this.rd = undefined;
	ilib.Date.RataDie.call(this, params);
};

ilib.Date.JulianRataDie.prototype = new ilib.Date.RataDie();
ilib.Date.JulianRataDie.prototype.parent = ilib.Date.RataDie;
ilib.Date.JulianRataDie.prototype.constructor = ilib.Date.JulianRataDie;

/**
 * The difference between a zero Julian day and the first Julian date
 * of Friday, July 16, 622 CE Julian. 
 * @private
 * @const
 * @type number
 */
ilib.Date.JulianRataDie.prototype.epoch = 1721422.5;

/**
 * Calculate the Rata Die (fixed day) number of the given date from the
 * date components.
 * 
 * @protected
 * @param {Object} date the date components to calculate the RD from
 */
ilib.Date.JulianRataDie.prototype._setDateComponents = function(date) {
	var year = date.year + ((date.year < 0) ? 1 : 0);
	var years = 365 * (year - 1) + Math.floor((year-1)/4);
	var dayInYear = (date.month > 1 ? ilib.Date.JulDate.cumMonthLengths[date.month-1] : 0) +
		date.day +
		(this.cal.isLeapYear(date.year) && date.month > 2 ? 1 : 0);
	var rdtime = (date.hour * 3600000 +
		date.minute * 60000 +
		date.second * 1000 +
		date.millisecond) / 
		86400000;
	
	/*
	console.log("calcRataDie: converting " +  JSON.stringify(parts));
	console.log("getRataDie: year is " +  years);
	console.log("getRataDie: day in year is " +  dayInYear);
	console.log("getRataDie: rdtime is " +  rdtime);
	console.log("getRataDie: rd is " +  (years + dayInYear + rdtime));
	*/
	
	this.rd = years + dayInYear + rdtime;
};

/**
 * @class
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
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
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
		if (params.locale) {
			this.locale = (typeof(params.locale) === 'string') ? new ilib.Locale(params.locale) : params.locale;
			var li = new ilib.LocaleInfo(this.locale);
			this.timezone = li.getTimeZone(); 
		}
		if (params.timezone) {
			this.timezone = params.timezone;
		}
		
		if (params.year || params.month || params.day || params.hour ||
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
			
			/**
			 * The day of the year. Ranges from 1 to 383.
			 * @type number
			 */
			this.dayOfYear = parseInt(params.dayOfYear, 10);
			
			if (typeof(params.dst) === 'boolean') {
				this.dst = params.dst;
			}
			
			this.rd = this.newRd(this);
			
			// add the time zone offset to the rd to convert to UTC
			if (!this.tz) {
				this.tz = new ilib.TimeZone({id: this.timezone});
			}
			// getOffsetMillis requires that this.year, this.rd, and this.dst 
			// are set in order to figure out which time zone rules apply and 
			// what the offset is at that point in the year
			this.offset = this.tz._getOffsetMillisWallTime(this) / 86400000;
			if (this.offset !== 0) {
				this.rd = this.newRd({
					rd: this.rd.getRataDie() - this.offset
				});
			}
		}
	}
	
	if (!this.rd) {
		this.rd = this.newRd(params);
		this._calcDateComponents();
	}
};

ilib.Date.JulDate.prototype = new ilib.Date({noinstance: true});
ilib.Date.JulDate.prototype.parent = ilib.Date;
ilib.Date.JulDate.prototype.constructor = ilib.Date.JulDate;

/**
 * the cumulative lengths of each month, for a non-leap year 
 * @private
 * @const
 * @type Array.<number>
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
 * the cumulative lengths of each month, for a leap year 
 * @private
 * @const
 * @type Array.<number>
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
 * Return a new RD for this date type using the given params.
 * @protected
 * @param {Object=} params the parameters used to create this rata die instance
 * @returns {ilib.Date.RataDie} the new RD instance for the given params
 */
ilib.Date.JulDate.prototype.newRd = function (params) {
	return new ilib.Date.JulianRataDie(params);
};

/**
 * Return the year for the given RD
 * @protected
 * @param {number} rd RD to calculate from 
 * @returns {number} the year for the RD
 */
ilib.Date.JulDate.prototype._calcYear = function(rd) {
	var year = Math.floor((4*(Math.floor(rd)-1) + 1464)/1461);
	
	return (year <= 0) ? year - 1 : year;
};

/**
 * Calculate date components for the given RD date.
 * @protected
 */
ilib.Date.JulDate.prototype._calcDateComponents = function () {
	var remainder,
		cumulative,
		rd = this.rd.getRataDie();
	
	this.year = this._calcYear(rd);

	if (typeof(this.offset) === "undefined") {
		this.year = this._calcYear(rd);
		
		// now offset the RD by the time zone, then recalculate in case we were 
		// near the year boundary
		if (!this.tz) {
			this.tz = new ilib.TimeZone({id: this.timezone});
		}
		this.offset = this.tz.getOffsetMillis(this) / 86400000;
	}

	if (this.offset !== 0) {
		rd += this.offset;
		this.year = this._calcYear(rd);
	}
	
	var jan1 = this.newRd({
		year: this.year,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	});
	remainder = rd + 1 - jan1.getRataDie();
	
	cumulative = this.cal.isLeapYear(this.year) ? 
		ilib.Date.JulDate.cumMonthLengthsLeap : 
		ilib.Date.JulDate.cumMonthLengths; 
	
	this.month = ilib.bsearch(Math.floor(remainder), cumulative);
	remainder = remainder - cumulative[this.month-1];
	
	this.day = Math.floor(remainder);
	remainder -= this.day;
	// now convert to milliseconds for the rest of the calculation
	remainder = Math.round(remainder * 86400000);
	
	this.hour = Math.floor(remainder/3600000);
	remainder -= this.hour * 3600000;
	
	this.minute = Math.floor(remainder/60000);
	remainder -= this.minute * 60000;
	
	this.second = Math.floor(remainder/1000);
	remainder -= this.second * 1000;
	
	this.millisecond = remainder;
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 * 
 * @return {number} the day of the week
 */
ilib.Date.JulDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.rd.getRataDie() + (this.offset || 0));
	return ilib.mod(rd-2, 7);
};

/**
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
ilib.Date.JulDate.prototype.getCalendar = function() {
	return "julian";
};

//register with the factory method
ilib.Date._constructors["julian"] = ilib.Date.JulDate;
/*
 * gregoriandate.js - Represent a date in the Gregorian calendar
 * 
 * Copyright © 2012-2014, JEDLSoft
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
date.js 
calendar/gregorian.js 
util/utils.js
util/search.js
util/math.js
localeinfo.js 
julianday.js
calendar/gregratadie.js
timezone.js
*/

/**
 * @class
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
 * <li><i>dst</i> - boolean used to specify whether the given time components are
 * intended to be in daylight time or not. This is only used in the overlap
 * time when transitioning from DST to standard time, and the time components are 
 * ambiguous. Otherwise at all other times of the year, this flag is ignored.
 * If you specify the date using unix time (UTC) or a julian day, then the time is
 * already unambiguous and this flag does not need to be specified.
 * <p>
 * For example, in the US, the transition out of daylight savings time 
 * in 2014 happens at Nov 2, 2014 2:00am Daylight Time, when the time falls 
 * back to Nov 2, 2014 1:00am Standard Time. If you give a date/time components as 
 * "Nov 2, 2014 1:30am", then there are two 1:30am times in that day, and you would 
 * have to give the standard flag to indicate which of those two you mean. 
 * (dst=true means daylight time, dst=false means standard time).   
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
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
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
	this.timezone = "local";

	if (params) {
		if (params.locale) {
			this.locale = (typeof(params.locale) === 'string') ? new ilib.Locale(params.locale) : params.locale;
			var li = new ilib.LocaleInfo(this.locale);
			this.timezone = li.getTimeZone(); 
		}
		if (params.timezone) {
			this.timezone = params.timezone.toString();
		}
		
		if (params.year || params.month || params.day || params.hour ||
				params.minute || params.second || params.millisecond ) {
			this.year = parseInt(params.year, 10) || 0;
			this.month = parseInt(params.month, 10) || 1;
			this.day = parseInt(params.day, 10) || 1;
			this.hour = parseInt(params.hour, 10) || 0;
			this.minute = parseInt(params.minute, 10) || 0;
			this.second = parseInt(params.second, 10) || 0;
			this.millisecond = parseInt(params.millisecond, 10) || 0;
			if (typeof(params.dst) === 'boolean') {
				this.dst = params.dst;
			}
			this.rd = this.newRd(params);
			
			// add the time zone offset to the rd to convert to UTC
			this.offset = 0;
			if (this.timezone === "local" && typeof(params.dst) === 'undefined') {
				// if dst is defined, the intrinsic Date object has no way of specifying which version of a time you mean
				// in the overlap time at the end of DST. Do you mean the daylight 1:30am or the standard 1:30am? In this
				// case, use the ilib calculations below, which can distinguish between the two properly
				var d = new Date(this.year, this.month-1, this.day, this.hour, this.minute, this.second, this.millisecond);
				this.offset = -d.getTimezoneOffset() / 1440;
			} else {
				if (!this.tz) {
					this.tz = new ilib.TimeZone({id: this.timezone});
				}
				// getOffsetMillis requires that this.year, this.rd, and this.dst 
				// are set in order to figure out which time zone rules apply and 
				// what the offset is at that point in the year
				this.offset = this.tz._getOffsetMillisWallTime(this) / 86400000;
			}
			if (this.offset !== 0) {
				this.rd = this.newRd({
					rd: this.rd.getRataDie() - this.offset
				});
			}
		}
	} 

	if (!this.rd) {
		this.rd = this.newRd(params);
		this._calcDateComponents();
	}
};

ilib.Date.GregDate.prototype = new ilib.Date({noinstance: true});
ilib.Date.GregDate.prototype.parent = ilib.Date;
ilib.Date.GregDate.prototype.constructor = ilib.Date.GregDate;

/**
 * Return a new RD for this date type using the given params.
 * @private
 * @param {Object=} params the parameters used to create this rata die instance
 * @returns {ilib.Date.RataDie} the new RD instance for the given params
 */
ilib.Date.GregDate.prototype.newRd = function (params) {
	return new ilib.Date.GregRataDie(params);
};

/**
 * Calculates the Gregorian year for a given rd number.
 * @private
 * @static
 */
ilib.Date.GregDate._calcYear = function(rd) {
	var days400,
		days100,
		days4,
		years400,
		years100,
		years4,
		years1,
		year;

	years400 = Math.floor((rd - 1) / 146097);
	days400 = ilib.mod((rd - 1), 146097);
	years100 = Math.floor(days400 / 36524);
	days100 = ilib.mod(days400, 36524);
	years4 = Math.floor(days100 / 1461);
	days4 = ilib.mod(days100, 1461);
	years1 = Math.floor(days4 / 365);
	
	year = 400 * years400 + 100 * years100 + 4 * years4 + years1;
	if (years100 !== 4 && years1 !== 4) {
		year++;
	}
	return year;
};

/**
 * @private
 */
ilib.Date.GregDate.prototype._calcYear = function(rd) {
	return ilib.Date.GregDate._calcYear(rd);
};

/**
 * Calculate the date components for the current time zone
 * @private
 */
ilib.Date.GregDate.prototype._calcDateComponents = function () {
	if (this.timezone === "local" && this.rd.getRataDie() >= 719163 && this.rd.getRataDie() <= 744018.134803241) {
		// console.log("using js Date to calculate offset");
		// use the intrinsic JS Date object to do the tz conversion for us, which 
		// guarantees that it follows the system tz database settings 
		var d = new Date(this.rd.getTime());
	
		/**
		 * Year in the Gregorian calendar.
		 * @type number
		 */
		this.year = d.getFullYear();
		
		/**
		 * The month number, ranging from 1 (January) to 12 (December).
		 * @type number
		 */
		this.month = d.getMonth()+1;
		
		/**
		 * The day of the month. This ranges from 1 to 31.
		 * @type number
		 */
		this.day = d.getDate();
		
		/**
		 * The hour of the day. This can be a number from 0 to 23, as times are
		 * stored unambiguously in the 24-hour clock.
		 * @type number
		 */
		this.hour = d.getHours();
		
		/**
		 * The minute of the hours. Ranges from 0 to 59.
		 * @type number
		 */
		this.minute = d.getMinutes();
		
		/**
		 * The second of the minute. Ranges from 0 to 59.
		 * @type number
		 */
		this.second = d.getSeconds();
		
		/**
		 * The millisecond of the second. Ranges from 0 to 999.
		 * @type number
		 */
		this.millisecond = d.getMilliseconds();
		
		this.offset = -d.getTimezoneOffset() / 1440;
	} else {
		// console.log("using ilib to calculate offset. tz is " + this.timezone);
		// console.log("GregDate._calcDateComponents: date is " + JSON.stringify(this) + " parent is " + JSON.stringify(this.parent) + " and parent.parent is " + JSON.stringify(this.parent.parent));
		if (typeof(this.offset) === "undefined") {
			// console.log("calculating offset");
			this.year = this._calcYear(this.rd.getRataDie());
			
			// now offset the RD by the time zone, then recalculate in case we were 
			// near the year boundary
			if (!this.tz) {
				this.tz = new ilib.TimeZone({id: this.timezone});
			}
			this.offset = this.tz.getOffsetMillis(this) / 86400000;
		// } else {
			// console.log("offset is already defined somehow. type is " + typeof(this.offset));
			// console.trace("Stack is this one");
		}
		// console.log("offset is " + this.offset);
		var rd = this.rd.getRataDie();
		if (this.offset !== 0) {
			rd += this.offset;
		}
		this.year = this._calcYear(rd);
		
		var yearStartRd = this.newRd({
			year: this.year,
			month: 1,
			day: 1,
			cal: this.cal
		});
		
		// remainder is days into the year
		var remainder = rd - yearStartRd.getRataDie() + 1;
		
		var cumulative = ilib.Cal.Gregorian.prototype.isLeapYear.call(this.cal, this.year) ? 
			ilib.Date.GregRataDie.cumMonthLengthsLeap : 
			ilib.Date.GregRataDie.cumMonthLengths; 
		
		this.month = ilib.bsearch(Math.floor(remainder), cumulative);
		remainder = remainder - cumulative[this.month-1];
		
		this.day = Math.floor(remainder);
		remainder -= this.day;
		// now convert to milliseconds for the rest of the calculation
		remainder = Math.round(remainder * 86400000);
		
		this.hour = Math.floor(remainder/3600000);
		remainder -= this.hour * 3600000;
		
		this.minute = Math.floor(remainder/60000);
		remainder -= this.minute * 60000;
		
		this.second = Math.floor(remainder/1000);
		remainder -= this.second * 1000;
		
		this.millisecond = Math.floor(remainder);
	}
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 * 
 * @return {number} the day of the week
 */
ilib.Date.GregDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.rd.getRataDie() + (this.offset || 0));
	return ilib.mod(rd, 7);
};

/**
 * Return the ordinal day of the year. Days are counted from 1 and proceed linearly up to 
 * 365, regardless of months or weeks, etc. That is, January 1st is day 1, and 
 * December 31st is 365 in regular years, or 366 in leap years.
 * @return {number} the ordinal day of the year
 */
ilib.Date.GregDate.prototype.getDayOfYear = function() {
	var cumulativeMap = this.cal.isLeapYear(this.year) ? 
		ilib.Date.GregRataDie.cumMonthLengthsLeap : 
		ilib.Date.GregRataDie.cumMonthLengths; 
		
	return cumulativeMap[this.month-1] + this.day;
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
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
ilib.Date.GregDate.prototype.getCalendar = function() {
	return "gregorian";
};

// register with the factory method
ilib.Date._constructors["gregorian"] = ilib.Date.GregDate;
/*
 * thaisolar.js - Represent a Thai solar calendar object.
 * 
 * Copyright © 2013-2014, JEDLSoft
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


/* !depends calendar.js locale.js date.js julianday.js calendar/gregorian.js util/utils.js util/math.js */

/**
 * @class
 * Construct a new Thai solar calendar object. This class encodes information about
 * a Thai solar calendar.<p>
 * 
 * Depends directive: !depends thaisolar.js
 * 
 * @constructor
 * @implements ilib.Cal
 */
ilib.Cal.ThaiSolar = function() {
	this.type = "thaisolar";
};

ilib.Cal.ThaiSolar.prototype = new ilib.Cal.Gregorian();
ilib.Cal.ThaiSolar.prototype.parent = ilib.Cal.Gregorian;
ilib.Cal.ThaiSolar.prototype.constructor = ilib.Cal.ThaiSolar;

/**
 * Return true if the given year is a leap year in the Thai solar calendar.
 * The year parameter may be given as a number, or as a ThaiSolarDate object.
 * @param {number|ilib.Date.ThaiSolarDate} year the year for which the leap year information is being sought
 * @return {boolean} true if the given year is a leap year
 */
ilib.Cal.ThaiSolar.prototype.isLeapYear = function(year) {
	var y = (typeof(year) === 'number' ? year : year.getYears());
	y -= 543;
	var centuries = ilib.mod(y, 400);
	return (ilib.mod(y, 4) === 0 && centuries !== 100 && centuries !== 200 && centuries !== 300);
};

/**
 * Return a date instance for this calendar type using the given
 * options.
 * @param {Object} options options controlling the construction of 
 * the date instance
 * @return {ilib.Date} a date appropriate for this calendar type
 */
ilib.Cal.ThaiSolar.prototype.newDateInstance = function (options) {
	return new ilib.Date.ThaiSolarDate(options);
};

/* register this calendar for the factory method */
ilib.Cal._constructors["thaisolar"] = ilib.Cal.ThaiSolar;
/*
 * thaisolardate.js - Represent a date in the ThaiSolar calendar
 * 
 * Copyright © 2013-2014, JEDLSoft
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
date.js 
calendar/gregorian.js 
util/jsutils.js
*/

/**
 * @class
 * Construct a new Thai solar date object. The constructor parameters can 
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
 * of this Thai solar date. The date/time is kept in the local time. The time zone
 * is used later if this date is formatted according to a different time zone and
 * the difference has to be calculated, or when the date format has a time zone
 * component in it.
 * 
 * <li><i>locale</i> - locale for this Thai solar date. If the time zone is not 
 * given, it can be inferred from this locale. For locales that span multiple
 * time zones, the one with the largest population is chosen as the one that 
 * represents the locale. 
 * </ul>
 *
 * If the constructor is called with another Thai solar date instance instead of
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
 * Depends directive: !depends thaisolardate.js
 * 
 * @constructor
 * @extends ilib.Date.GregDate
 * @param {Object=} params parameters that govern the settings and behaviour of this Thai solar date
 */
ilib.Date.ThaiSolarDate = function(params) {
	var p = params;
	if (params) {
		// there is 198327 days difference between the Thai solar and 
		// Gregorian epochs which is equivalent to 543 years
		p = {};
		ilib.shallowCopy(params, p);
		if (typeof(p.year) !== 'undefined') {
			p.year -= 543;	
		}
		if (typeof(p.rd) !== 'undefined') {
			p.rd -= 198327;
		}
	}
	this.rd = undefined; // clear these out so that the GregDate constructor can set it
	this.offset = undefined;
	//console.log("ThaiSolarDate.constructor: date is " + JSON.stringify(this) + " parent is " + JSON.stringify(this.parent) + " and parent.parent is " + JSON.stringify(this.parent.parent));
	ilib.Date.GregDate.call(this, p);
	this.cal = new ilib.Cal.ThaiSolar();
	// make sure the year is set correctly
	if (params && typeof(params.year) !== 'undefined') {
		this.year = parseInt(params.year, 10);
	}
};

ilib.Date.ThaiSolarDate.prototype = new ilib.Date.GregDate({noinstance: true});
ilib.Date.ThaiSolarDate.prototype.parent = ilib.Date.GregDate.prototype;
ilib.Date.ThaiSolarDate.prototype.constructor = ilib.Date.ThaiSolarDate;

/**
 * the difference between a zero Julian day and the zero Thai Solar date.
 * This is some 543 years before the start of the Gregorian epoch. 
 * @private
 * @const
 * @type number
 */
ilib.Date.ThaiSolarDate.epoch = 1523097.5;

/**
 * Calculate the date components for the current time zone
 * @protected
 */
ilib.Date.ThaiSolarDate.prototype._calcDateComponents = function () {
	// there is 198327 days difference between the Thai solar and 
	// Gregorian epochs which is equivalent to 543 years
	// console.log("ThaiSolarDate._calcDateComponents: date is " + JSON.stringify(this) + " parent is " + JSON.stringify(this.parent) + " and parent.parent is " + JSON.stringify(this.parent.parent));
	this.parent._calcDateComponents.call(this);
	this.year += 543;
};

/**
 * Return the Rata Die (fixed day) number of this date.
 * 
 * @protected
 * @return {number} the rd date as a number
 */
ilib.Date.ThaiSolarDate.prototype.getRataDie = function() {
	// there is 198327 days difference between the Thai solar and 
	// Gregorian epochs which is equivalent to 543 years
	return this.rd.getRataDie() + 198327;
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week before the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week before the current date that is being sought
 * @return {ilib.Date} the date being sought
 */
ilib.Date.ThaiSolarDate.prototype.before = function (dow) {
	return this.cal.newDateInstance({
		rd: this.rd.before(dow, this.offset) + 198327,
		timezone: this.timezone
	});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week after the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week after the current date that is being sought
 * @return {ilib.Date} the date being sought
 */
ilib.Date.ThaiSolarDate.prototype.after = function (dow) {
	return this.cal.newDateInstance({
		rd: this.rd.after(dow, this.offset) + 198327,
		timezone: this.timezone
	});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week on or before the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week on or before the current date that is being sought
 * @return {ilib.Date} the date being sought
 */
ilib.Date.ThaiSolarDate.prototype.onOrBefore = function (dow) {
	return this.cal.newDateInstance({
		rd: this.rd.onOrBefore(dow, this.offset) + 198327,
		timezone: this.timezone
	});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week on or after the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week on or after the current date that is being sought
 * @return {ilib.Date} the date being sought
 */
ilib.Date.ThaiSolarDate.prototype.onOrAfter = function (dow) {
	return this.cal.newDateInstance({
		rd: this.rd.onOrAfter(dow, this.offset) + 198327,
		timezone: this.timezone
	});
};

/**
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
ilib.Date.ThaiSolarDate.prototype.getCalendar = function() {
	return "thaisolar";
};

//register with the factory method
ilib.Date._constructors["thaisolar"] = ilib.Date.ThaiSolarDate;


/*
 * persian.js - Represent a Persian algorithmic calendar object.
 * 
 * Copyright © 2014, JEDLSoft
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


/* !depends calendar.js locale.js date.js julianday.js util/utils.js util/math.js */

/**
 * @class
 * Construct a new Persian algorithmic calendar object. This class encodes information about
 * a Persian algorithmic calendar.<p>
 * 
 * Depends directive: !depends persian.js
 * 
 * @constructor
 * @implements ilib.Cal
 */
ilib.Cal.PersianAlgo = function() {
	this.type = "persian-algo";
};

/**
 * @private
 * @const
 * @type Array.<number> 
 * the lengths of each month 
 */
ilib.Cal.PersianAlgo.monthLengths = [
	31,  // Farvardin
	31,  // Ordibehesht
	31,  // Khordad
	31,  // Tir
	31,  // Mordad
	31,  // Shahrivar
	30,  // Mehr
	30,  // Aban
	30,  // Azar
	30,  // Dey
	30,  // Bahman
	29   // Esfand
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
ilib.Cal.PersianAlgo.prototype.getNumMonths = function(year) {
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
ilib.Cal.PersianAlgo.prototype.getMonLength = function(month, year) {
	if (month !== 12 || !this.isLeapYear(year)) {
		return ilib.Cal.PersianAlgo.monthLengths[month-1];
	} else {
		// Month 12, Esfand, has 30 days instead of 29 in leap years
		return 30;
	}
};

/**
 * Return the equivalent year in the 2820 year cycle that begins on 
 * Far 1, 474. This particular cycle obeys the cycle-of-years formula 
 * whereas the others do not specifically. This cycle can be used as
 * a proxy for other years outside of the cycle by shifting them into 
 * the cycle.   
 * @param {number} year year to find the equivalent cycle year for
 * @returns {number} the equivalent cycle year
 */
ilib.Cal.PersianAlgo.prototype.equivalentCycleYear = function(year) {
	var y = year - (year >= 0 ? 474 : 473);
	return ilib.mod(y, 2820) + 474;
};

/**
 * Return true if the given year is a leap year in the Persian calendar.
 * The year parameter may be given as a number, or as a PersAlgoDate object.
 * @param {number} year the year for which the leap year information is being sought
 * @return {boolean} true if the given year is a leap year
 */
ilib.Cal.PersianAlgo.prototype.isLeapYear = function(year) {
	return (ilib.mod((this.equivalentCycleYear(year) + 38) * 682, 2816) < 682);
};

/**
 * Return the type of this calendar.
 * 
 * @return {string} the name of the type of this calendar 
 */
ilib.Cal.PersianAlgo.prototype.getType = function() {
	return this.type;
};

/**
 * Return a date instance for this calendar type using the given
 * options.
 * @param {Object} options options controlling the construction of 
 * the date instance
 * @return {ilib.Date} a date appropriate for this calendar type
 */
ilib.Cal.PersianAlgo.prototype.newDateInstance = function (options) {
	return new ilib.Date.PersAlgoDate(options);
};

/* register this calendar for the factory method */
ilib.Cal._constructors["persian-algo"] = ilib.Cal.PersianAlgo;

/*
 * persiandate.js - Represent a date in the Persian algorithmic calendar
 * 
 * Copyright © 2014, JEDLSoft
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
date.js 
calendar/persian.js 
util/utils.js
util/search.js
util/math.js
localeinfo.js 
julianday.js 
*/

/**
 * Construct a new Persian RD date number object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970, Gregorian
 * 
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 * 
 * <li><i>year</i> - any integer, including 0
 * 
 * <li><i>month</i> - 1 to 12, where 1 means Farvardin, 2 means Ordibehesht, etc.
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
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Persian date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above are present, then the RD is calculate based on 
 * the current date at the time of instantiation. <p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * Depends directive: !depends persiandate.js
 * 
 * @private
 * @class
 * @constructor
 * @extends ilib.Date.RataDie
 * @param {Object=} params parameters that govern the settings and behaviour of this Persian RD date
 */
ilib.Date.PersAlgoRataDie = function(params) {
	this.cal = params && params.cal || new ilib.Cal.PersianAlgo();
	this.rd = undefined;
	ilib.Date.RataDie.call(this, params);
};

ilib.Date.PersAlgoRataDie.prototype = new ilib.Date.RataDie();
ilib.Date.PersAlgoRataDie.prototype.parent = ilib.Date.RataDie;
ilib.Date.PersAlgoRataDie.prototype.constructor = ilib.Date.PersAlgoRataDie;

/**
 * The difference between a zero Julian day and the first Persian date
 * @private
 * @const
 * @type number
 */
ilib.Date.PersAlgoRataDie.prototype.epoch = 1948319.5;

/**
 * Calculate the Rata Die (fixed day) number of the given date from the
 * date components.
 *
 * @protected
 * @param {Object} date the date components to calculate the RD from
 */
ilib.Date.PersAlgoRataDie.prototype._setDateComponents = function(date) {
	var year = this.cal.equivalentCycleYear(date.year);
	var y = date.year - (date.year >= 0 ? 474 : 473);
	var rdOfYears = 1029983 * Math.floor(y/2820) + 365 * (year - 1) + Math.floor((682 * year - 110) / 2816);
	var dayInYear = (date.month > 1 ? ilib.Date.PersAlgoDate.cumMonthLengths[date.month-1] : 0) + date.day;
	var rdtime = (date.hour * 3600000 +
		date.minute * 60000 +
		date.second * 1000 +
		date.millisecond) /
		86400000;
	
	/*
	// console.log("getRataDie: converting " +  JSON.stringify(this));
	console.log("getRataDie: year is " +  year);
	console.log("getRataDie: rd of years is " +  rdOfYears);
	console.log("getRataDie: day in year is " +  dayInYear);
	console.log("getRataDie: rdtime is " +  rdtime);
	console.log("getRataDie: rd is " +  (rdOfYears + dayInYear + rdtime));
	*/
	
	this.rd = rdOfYears + dayInYear + rdtime;
};

/**
 * Return the rd number of the particular day of the week on or before the 
 * given rd. eg. The Sunday on or before the given rd.
 * @private
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the current date
 * @return {number} the rd of the day of the week
 */
ilib.Date.PersAlgoRataDie.prototype._onOrBefore = function(rd, dayOfWeek) {
	return rd - ilib.mod(Math.floor(rd) - dayOfWeek - 3, 7);
};


/**
 * @class
 * 
 * Construct a new Persian date object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970, Gregorian
 * 
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 * 
 * <li><i>year</i> - any integer, including 0
 * 
 * <li><i>month</i> - 1 to 12, where 1 means Farvardin, 2 means Ordibehesht, etc.
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
 * of this persian date. The date/time is kept in the local time. The time zone
 * is used later if this date is formatted according to a different time zone and
 * the difference has to be calculated, or when the date format has a time zone
 * component in it.
 * 
 * <li><i>locale</i> - locale for this persian date. If the time zone is not 
 * given, it can be inferred from this locale. For locales that span multiple
 * time zones, the one with the largest population is chosen as the one that 
 * represents the locale.
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Persian date instance instead of
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
 * Depends directive: !depends persiandate.js
 * 
 * @constructor
 * @extends ilib.Date
 * @param {Object=} params parameters that govern the settings and behaviour of this Persian date
 */
ilib.Date.PersAlgoDate = function(params) {
	this.cal = new ilib.Cal.PersianAlgo();
	this.timezone = "local";
	
	if (params) {
		if (params.locale) {
			this.locale = (typeof(params.locale) === 'string') ? new ilib.Locale(params.locale) : params.locale;
			var li = new ilib.LocaleInfo(this.locale);
			this.timezone = li.getTimeZone(); 
		}
		if (params.timezone) {
			this.timezone = params.timezone;
		}
		
		if (params.year || params.month || params.day || params.hour ||
				params.minute || params.second || params.millisecond ) {
			/**
			 * Year in the Persian calendar.
			 * @type number
			 */
			this.year = parseInt(params.year, 10) || 0;

			/**
			 * The month number, ranging from 1 to 12
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
			
			/**
			 * The day of the year. Ranges from 1 to 366.
			 * @type number
			 */
			this.dayOfYear = parseInt(params.dayOfYear, 10);

			if (typeof(params.dst) === 'boolean') {
				this.dst = params.dst;
			}
			
			this.rd = this.newRd(this);
			
			// add the time zone offset to the rd to convert to UTC
			if (!this.tz) {
				this.tz = new ilib.TimeZone({id: this.timezone});
			}
			// getOffsetMillis requires that this.year, this.rd, and this.dst 
			// are set in order to figure out which time zone rules apply and 
			// what the offset is at that point in the year
			this.offset = this.tz._getOffsetMillisWallTime(this) / 86400000;
			if (this.offset !== 0) {
				this.rd = this.newRd({
					rd: this.rd.getRataDie() - this.offset
				});
			}
		}
	}

	if (!this.rd) {
		this.rd = this.newRd(params);
		this._calcDateComponents();
	}
};

ilib.Date.PersAlgoDate.prototype = new ilib.Date({noinstance: true});
ilib.Date.PersAlgoDate.prototype.parent = ilib.Date;
ilib.Date.PersAlgoDate.prototype.constructor = ilib.Date.PersAlgoDate;

/**
 * @private
 * @const
 * @type Array.<number>
 * the cumulative lengths of each month, for a non-leap year 
 */
ilib.Date.PersAlgoDate.cumMonthLengths = [
    0,    // Farvardin
	31,   // Ordibehesht
	62,   // Khordad
	93,   // Tir
	124,  // Mordad
	155,  // Shahrivar
	186,  // Mehr
	216,  // Aban
	246,  // Azar
	276,  // Dey
	306,  // Bahman
	336,  // Esfand
	365
];

/**
 * Return a new RD for this date type using the given params.
 * @protected
 * @param {Object=} params the parameters used to create this rata die instance
 * @returns {ilib.Date.RataDie} the new RD instance for the given params
 */
ilib.Date.PersAlgoDate.prototype.newRd = function (params) {
	return new ilib.Date.PersAlgoRataDie(params);
};

/**
 * Return the year for the given RD
 * @protected
 * @param {number} rd RD to calculate from 
 * @returns {number} the year for the RD
 */
ilib.Date.PersAlgoDate.prototype._calcYear = function(rd) {
	var shiftedRd = rd - 173126;
	var numberOfCycles = Math.floor(shiftedRd / 1029983);
	var shiftedDayInCycle = ilib.mod(shiftedRd, 1029983);
	var yearInCycle = (shiftedDayInCycle === 1029982) ? 2820 : Math.floor((2816 * shiftedDayInCycle + 1031337) / 1028522);
	var year = 474 + 2820 * numberOfCycles + yearInCycle;
	return (year > 0) ? year : year - 1;
};

/**
 * @private
 * Calculate date components for the given RD date.
 */
ilib.Date.PersAlgoDate.prototype._calcDateComponents = function () {
	var remainder,
		rd = this.rd.getRataDie();
	
	this.year = this._calcYear(rd);
	
	if (typeof(this.offset) === "undefined") {
		// now offset the RD by the time zone, then recalculate in case we were 
		// near the year boundary
		if (!this.tz) {
			this.tz = new ilib.TimeZone({id: this.timezone});
		}
		this.offset = this.tz.getOffsetMillis(this) / 86400000;
	}
	
	if (this.offset !== 0) {
		rd += this.offset;
		this.year = this._calcYear(rd);
	}
	
	//console.log("PersAlgoDate.calcComponent: calculating for rd " + rd);
	//console.log("PersAlgoDate.calcComponent: year is " + ret.year);
	var yearStart = this.newRd({
		year: this.year,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	});
	remainder = rd - yearStart.getRataDie() + 1;
	
	this.dayOfYear = remainder;
	
	//console.log("PersAlgoDate.calcComponent: remainder is " + remainder);
	
	this.month = ilib.bsearch(remainder, ilib.Date.PersAlgoDate.cumMonthLengths);
	remainder -= ilib.Date.PersAlgoDate.cumMonthLengths[this.month-1];
	
	//console.log("PersAlgoDate.calcComponent: month is " + this.month + " and remainder is " + remainder);
	
	this.day = Math.floor(remainder);
	remainder -= this.day;
	
	//console.log("PersAlgoDate.calcComponent: day is " + this.day + " and remainder is " + remainder);
	
	// now convert to milliseconds for the rest of the calculation
	remainder = Math.round(remainder * 86400000);
	
	this.hour = Math.floor(remainder/3600000);
	remainder -= this.hour * 3600000;
	
	this.minute = Math.floor(remainder/60000);
	remainder -= this.minute * 60000;
	
	this.second = Math.floor(remainder/1000);
	remainder -= this.second * 1000;
	
	this.millisecond = remainder;
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 * 
 * @return {number} the day of the week
 */
ilib.Date.PersAlgoDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.getRataDie());
	return ilib.mod(rd-3, 7);
};

/**
 * Return the ordinal day of the year. Days are counted from 1 and proceed linearly up to 
 * 365, regardless of months or weeks, etc. That is, Farvardin 1st is day 1, and 
 * December 31st is 365 in regular years, or 366 in leap years.
 * @return {number} the ordinal day of the year
 */
ilib.Date.PersAlgoDate.prototype.getDayOfYear = function() {
	return ilib.Date.PersAlgoDate.cumMonthLengths[this.month-1] + this.day;
};

/**
 * Return the era for this date as a number. The value for the era for Persian 
 * calendars is -1 for "before the persian era" (BP) and 1 for "the persian era" (anno 
 * persico or AP). 
 * BP dates are any date before Farvardin 1, 1 AP. In the proleptic Persian calendar, 
 * there is a year 0, so any years that are negative or zero are BP.
 * @return {number} 1 if this date is in the common era, -1 if it is before the 
 * common era 
 */
ilib.Date.PersAlgoDate.prototype.getEra = function() {
	return (this.year < 1) ? -1 : 1;
};

/**
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
ilib.Date.PersAlgoDate.prototype.getCalendar = function() {
	return "persian-algo";
};

// register with the factory method
ilib.Date._constructors["persian-algo"] = ilib.Date.PersAlgoDate;
/*
 * astro.js - Static functions to support astronomical calculations
 * 
 * Copyright © 2014, JEDLSoft
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
date.js
calendar/gregoriandate.js
calendar/gregratadie.js
*/

// !data astro

/*
 * These routines were derived from a public domain set of JavaScript 
 * functions for positional astronomy by John Walker of Fourmilab, 
 * September 1999.
 */

/**
 * Load in all the data needed for astrological calculations.
 * 
 * @param {boolean} sync
 * @param {*} loadParams
 * @param {function(*)|undefined} callback
 */
ilib.Date.initAstro = function(sync, loadParams, callback) {
	if (!ilib.data.astro) {
		ilib.loadData({
			name: "astro.json", // countries in their own language 
			locale: "-", // only need to load the root file 
			nonLocale: true,
			sync: sync, 
			loadParams: loadParams, 
			callback: ilib.bind(this, /** @type function() */ function(astroData) {
				/** 
				 * @type {{
				 *  	_EquinoxpTerms:Array.<number>, 
				 *  	_JDE0tab1000:Array.<number>, 
				 *  	_JDE0tab2000:Array.<number>, 
				 *  	_deltaTtab:Array.<number>,
				 *  	_oterms:Array.<number>,
				 *  	_nutArgMult:Array.<number>, 
				 *  	_nutArgCoeff:Array.<number>, 
				 *  	_nutCoeffA:Array.<number>,
				 *  	_nutCoeffB:Array.<number>,
				 *  	_coeff19th:Array.<number>,
				 *  	_coeff18th:Array.<number>,
				 *  	_solarLongCoeff:Array.<number>, 
				 *  	_solarLongMultipliers:Array.<number>, 
				 *  	_solarLongAddends:Array.<number>, 
				 *  	_meanMoonCoeff:Array.<number>,
				 *  	_elongationCoeff:Array.<number>,
				 *  	_solarAnomalyCoeff:Array.<number>,
				 *  	_lunarAnomalyCoeff:Array.<number>,
				 *  	_moonFromNodeCoeff:Array.<number>,
				 *  	_eCoeff:Array.<number>,
				 *  	_lunarElongationLongCoeff:Array.<number>,
				 *  	_solarAnomalyLongCoeff:Array.<number>,
				 *  	_lunarAnomalyLongCoeff:Array.<number>,
				 *  	_moonFromNodeLongCoeff:Array.<number>,
				 *  	_sineCoeff:Array.<number>,
				 *  	_nmApproxCoeff:Array.<number>,
				 *  	_nmCapECoeff:Array.<number>,
				 *  	_nmSolarAnomalyCoeff:Array.<number>,
				 *  	_nmLunarAnomalyCoeff:Array.<number>,
				 *  	_nmMoonArgumentCoeff:Array.<number>,
				 *  	_nmCapOmegaCoeff:Array.<number>,
				 *  	_nmEFactor:Array.<number>,
				 *  	_nmSolarCoeff:Array.<number>,
				 *  	_nmLunarCoeff:Array.<number>,
				 *  	_nmMoonCoeff:Array.<number>,
				 *  	_nmSineCoeff:Array.<number>,
				 *  	_nmAddConst:Array.<number>,
				 *  	_nmAddCoeff:Array.<number>,
				 *  	_nmAddFactor:Array.<number>,
				 *  	_nmExtra:Array.<number>
				 *  }}
				 */ 	
			 	ilib.data.astro = astroData;
				if (callback && typeof(callback) === 'function') {
					callback(astroData);
				}
			})
		});
	} else {
		if (callback && typeof(callback) === 'function') {
			callback(ilib.data.astro);
		}
	}
};

/**
 * Convert degrees to radians.
 * 
 * @static
 * @param {number} d angle in degrees
 * @return {number} angle in radians 
 */
ilib.Date._dtr = function(d) {
	return (d * Math.PI) / 180.0;
};

/**
 * Convert radians to degrees.
 * 
 * @static
 * @param {number} r angle in radians
 * @return {number} angle in degrees 
 */
ilib.Date._rtd = function(r) {
	return (r * 180.0) / Math.PI;
};

/**
 * Return the cosine of an angle given in degrees.
 * @static
 * @param {number} d angle in degrees
 * @return {number} cosine of the angle.
 */  
ilib.Date._dcos = function(d) {
	return Math.cos(ilib.Date._dtr(d));
};

/**
 * Return the sine of an angle given in degrees.
 * @static
 * @param {number} d angle in degrees
 * @return {number} sine of the angle.
 */  
ilib.Date._dsin = function(d) {
	return Math.sin(ilib.Date._dtr(d));
};

/**
 * Return the tan of an angle given in degrees.
 * @static
 * @param {number} d angle in degrees
 * @return {number} tan of the angle.
 */  
ilib.Date._dtan = function(d) {
	return Math.tan(ilib.Date._dtr(d));
};

/**
 * Range reduce angle in degrees.
 * 
 * @static
 * @param {number} a angle to reduce
 * @return {number} the reduced angle  
 */
ilib.Date._fixangle = function(a) {
	return a - 360.0 * (Math.floor(a / 360.0));
};

/**
 * Range reduce angle in radians.
 * 
 * @static
 * @param {number} a angle to reduce
 * @return {number} the reduced angle  
 */
ilib.Date._fixangr = function(a) {
	return a - (2 * Math.PI) * (Math.floor(a / (2 * Math.PI)));
};

/**
 * Determine the Julian Ephemeris Day of an equinox or solstice.  The "which" 
 * argument selects the item to be computed:
 * 
 * <ul>
 * <li>0   March equinox
 * <li>1   June solstice
 * <li>2   September equinox
 * <li>3   December solstice
 * </ul>
 * 
 * @static
 * @param {number} year Gregorian year to calculate for
 * @param {number} which Which equinox or solstice to calculate
 */
ilib.Date._equinox = function(year, which) {
	var deltaL, i, j, JDE0, JDE, JDE0tab, S, T, W, Y;

	/*  Initialize terms for mean equinox and solstices.  We
	    have two sets: one for years prior to 1000 and a second
	    for subsequent years.  */

	if (year < 1000) {
		JDE0tab = ilib.data.astro._JDE0tab1000;
		Y = year / 1000;
	} else {
		JDE0tab = ilib.data.astro._JDE0tab2000;
		Y = (year - 2000) / 1000;
	}

	JDE0 = JDE0tab[which][0] + (JDE0tab[which][1] * Y)
			+ (JDE0tab[which][2] * Y * Y) + (JDE0tab[which][3] * Y * Y * Y)
			+ (JDE0tab[which][4] * Y * Y * Y * Y);

	//document.debug.log.value += "JDE0 = " + JDE0 + "\n";

	T = (JDE0 - 2451545.0) / 36525;
	//document.debug.log.value += "T = " + T + "\n";
	W = (35999.373 * T) - 2.47;
	//document.debug.log.value += "W = " + W + "\n";
	deltaL = 1 + (0.0334 * ilib.Date._dcos(W)) + (0.0007 * ilib.Date._dcos(2 * W));
	//document.debug.log.value += "deltaL = " + deltaL + "\n";

	//  Sum the periodic terms for time T

	S = 0;
	j = 0;
	for (i = 0; i < 24; i++) {
		S += ilib.data.astro._EquinoxpTerms[j]
				* ilib.Date._dcos(ilib.data.astro._EquinoxpTerms[j + 1] + (ilib.data.astro._EquinoxpTerms[j + 2] * T));
		j += 3;
	}

	//document.debug.log.value += "S = " + S + "\n";
	//document.debug.log.value += "Corr = " + ((S * 0.00001) / deltaL) + "\n";

	JDE = JDE0 + ((S * 0.00001) / deltaL);

	return JDE;
};

/* 
 * The table of observed Delta T values at the beginning of
 * years from 1620 through 2014 as found in astro.json is taken from
 * http://www.staff.science.uu.nl/~gent0113/deltat/deltat.htm
 * and
 * ftp://maia.usno.navy.mil/ser7/deltat.data
 */

/**  
 * Determine the difference, in seconds, between dynamical time and universal time.
 * 
 * @static
 * @param {number} year to calculate the difference for
 * @return {number} difference in seconds between dynamical time and universal time  
 */
ilib.Date._deltat = function (year) {
	var dt, f, i, t;

	if ((year >= 1620) && (year <= 2014)) {
		i = Math.floor(year - 1620);
		f = (year - 1620) - i; /* Fractional part of year */
		dt = ilib.data.astro._deltaTtab[i] + ((ilib.data.astro._deltaTtab[i + 1] - ilib.data.astro._deltaTtab[i]) * f);
	} else {
		t = (year - 2000) / 100;
		if (year < 948) {
			dt = 2177 + (497 * t) + (44.1 * t * t);
		} else {
			dt = 102 + (102 * t) + (25.3 * t * t);
			if ((year > 2000) && (year < 2100)) {
				dt += 0.37 * (year - 2100);
			}
		}
	}
	return dt;
};

/**
 * Calculate the obliquity of the ecliptic for a given
 * Julian date.  This uses Laskar's tenth-degree
 * polynomial fit (J. Laskar, Astronomy and
 * Astrophysics, Vol. 157, page 68 [1986]) which is
 * accurate to within 0.01 arc second between AD 1000
 * and AD 3000, and within a few seconds of arc for
 * +/-10000 years around AD 2000.  If we're outside the
 * range in which this fit is valid (deep time) we
 * simply return the J2000 value of the obliquity, which
 * happens to be almost precisely the mean.
 * 
 * @static
 * @param {number} jd Julian Day to calculate the obliquity for
 * @return {number} the obliquity
 */
ilib.Date._obliqeq = function (jd) {
	var eps, u, v, i;

 	v = u = (jd - 2451545.0) / 3652500.0;

 	eps = 23 + (26 / 60.0) + (21.448 / 3600.0);

 	if (Math.abs(u) < 1.0) {
 		for (i = 0; i < 10; i++) {
 			eps += (ilib.data.astro._oterms[i] / 3600.0) * v;
 			v *= u;
 		}
 	}
 	return eps;
};

/**
 * Return the position of the sun.  We return
 * intermediate values because they are useful in a
 * variety of other contexts.
 * @static
 * @param {number} jd find the position of sun on this Julian Day
 * @return {Object} the position of the sun and many intermediate
 * values
 */
ilib.Date._sunpos = function(jd) {
	var ret = {}, 
		T, T2, T3, Omega, epsilon, epsilon0;

	T = (jd - 2451545.0) / 36525.0;
	//document.debug.log.value += "Sunpos.  T = " + T + "\n";
	T2 = T * T;
	T3 = T * T2;
	ret.meanLongitude = ilib.Date._fixangle(280.46646 + 36000.76983 * T + 0.0003032 * T2);
	//document.debug.log.value += "ret.meanLongitude = " + ret.meanLongitude + "\n";
	ret.meanAnomaly = ilib.Date._fixangle(357.52911 + (35999.05029 * T) - 0.0001537 * T2 - 0.00000048 * T3);
	//document.debug.log.value += "ret.meanAnomaly = " + ret.meanAnomaly + "\n";
	ret.eccentricity = 0.016708634 - 0.000042037 * T - 0.0000001267 * T2;
	//document.debug.log.value += "e = " + e + "\n";
	ret.equationOfCenter = ((1.914602 - 0.004817 * T - 0.000014 * T2) * ilib.Date._dsin(ret.meanAnomaly))
			+ ((0.019993 - 0.000101 * T) * ilib.Date._dsin(2 * ret.meanAnomaly))
			+ (0.000289 * ilib.Date._dsin(3 * ret.meanAnomaly));
	//document.debug.log.value += "ret.equationOfCenter = " + ret.equationOfCenter + "\n";
	ret.sunLongitude = ret.meanLongitude + ret.equationOfCenter;
	//document.debug.log.value += "ret.sunLongitude = " + ret.sunLongitude + "\n";
	//ret.sunAnomaly = ret.meanAnomaly + ret.equationOfCenter;
	//document.debug.log.value += "ret.sunAnomaly = " + ret.sunAnomaly + "\n";
	// ret.sunRadius = (1.000001018 * (1 - (ret.eccentricity * ret.eccentricity))) / (1 + (ret.eccentricity * ilib.Date._dcos(ret.sunAnomaly)));
	//document.debug.log.value += "ret.sunRadius = " + ret.sunRadius + "\n";
	Omega = 125.04 - (1934.136 * T);
	//document.debug.log.value += "Omega = " + Omega + "\n";
	ret.apparentLong = ret.sunLongitude + (-0.00569) + (-0.00478 * ilib.Date._dsin(Omega));
	//document.debug.log.value += "ret.apparentLong = " + ret.apparentLong + "\n";
	epsilon0 = ilib.Date._obliqeq(jd);
	//document.debug.log.value += "epsilon0 = " + epsilon0 + "\n";
	epsilon = epsilon0 + (0.00256 * ilib.Date._dcos(Omega));
	//document.debug.log.value += "epsilon = " + epsilon + "\n";
	//ret.rightAscension = ilib.Date._fixangle(ilib.Date._rtd(Math.atan2(ilib.Date._dcos(epsilon0) * ilib.Date._dsin(ret.sunLongitude), ilib.Date._dcos(ret.sunLongitude))));
	//document.debug.log.value += "ret.rightAscension = " + ret.rightAscension + "\n";
	// ret.declination = ilib.Date._rtd(Math.asin(ilib.Date._dsin(epsilon0) * ilib.Date._dsin(ret.sunLongitude)));
	////document.debug.log.value += "ret.declination = " + ret.declination + "\n";
	ret.inclination = ilib.Date._fixangle(23.4392911 - 0.013004167 * T - 0.00000016389 * T2 + 0.0000005036 * T3);
	ret.apparentRightAscension = ilib.Date._fixangle(ilib.Date._rtd(Math.atan2(ilib.Date._dcos(epsilon) * ilib.Date._dsin(ret.apparentLong), ilib.Date._dcos(ret.apparentLong))));
	//document.debug.log.value += "ret.apparentRightAscension = " + ret.apparentRightAscension + "\n";
	//ret.apparentDeclination = ilib.Date._rtd(Math.asin(ilib.Date._dsin(epsilon) * ilib.Date._dsin(ret.apparentLong)));
	//document.debug.log.value += "ret.apparentDecliation = " + ret.apparentDecliation + "\n";

	// Angular quantities are expressed in decimal degrees
	return ret;
};

/**
 * Calculate the nutation in longitude, deltaPsi, and obliquity, 
 * deltaEpsilon for a given Julian date jd. Results are returned as an object
 * giving deltaPsi and deltaEpsilon in degrees.
 * 
 * @static
 * @param {number} jd calculate the nutation of this Julian Day
 * @return {Object} the deltaPsi and deltaEpsilon of the nutation
 */
ilib.Date._nutation = function(jd) {
	var i, j, 
		t = (jd - 2451545.0) / 36525.0, 
		t2, t3, to10, 
		ta = [], 
		dp = 0, 
		de = 0, 
		ang,
		ret = {};

	t3 = t * (t2 = t * t);

	/*
	 * Calculate angles. The correspondence between the elements of our array
	 * and the terms cited in Meeus are:
	 * 
	 * ta[0] = D ta[0] = M ta[2] = M' ta[3] = F ta[4] = \Omega
	 * 
	 */

	ta[0] = ilib.Date._dtr(297.850363 + 445267.11148 * t - 0.0019142 * t2 + t3 / 189474.0);
	ta[1] = ilib.Date._dtr(357.52772 + 35999.05034 * t - 0.0001603 * t2 - t3 / 300000.0);
	ta[2] = ilib.Date._dtr(134.96298 + 477198.867398 * t + 0.0086972 * t2 + t3 / 56250.0);
	ta[3] = ilib.Date._dtr(93.27191 + 483202.017538 * t - 0.0036825 * t2 + t3 / 327270);
	ta[4] = ilib.Date._dtr(125.04452 - 1934.136261 * t + 0.0020708 * t2 + t3 / 450000.0);

	/*
	 * Range reduce the angles in case the sine and cosine functions don't do it
	 * as accurately or quickly.
	 */

	for (i = 0; i < 5; i++) {
		ta[i] = ilib.Date._fixangr(ta[i]);
	}

	to10 = t / 10.0;
	for (i = 0; i < 63; i++) {
		ang = 0;
		for (j = 0; j < 5; j++) {
			if (ilib.data.astro._nutArgMult[(i * 5) + j] != 0) {
				ang += ilib.data.astro._nutArgMult[(i * 5) + j] * ta[j];
			}
		}
		dp += (ilib.data.astro._nutArgCoeff[(i * 4) + 0] + ilib.data.astro._nutArgCoeff[(i * 4) + 1] * to10) * Math.sin(ang);
		de += (ilib.data.astro._nutArgCoeff[(i * 4) + 2] + ilib.data.astro._nutArgCoeff[(i * 4) + 3] * to10) * Math.cos(ang);
	}

	/*
	 * Return the result, converting from ten thousandths of arc seconds to
	 * radians in the process.
	 */

	ret.deltaPsi = dp / (3600.0 * 10000.0);
	ret.deltaEpsilon = de / (3600.0 * 10000.0);

	return ret;
};

/**
 * Returns the equation of time as a fraction of a day.
 * 
 * @static
 * @param {number} jd the Julian Day of the day to calculate for
 * @return {number} the equation of time for the given day  
 */
ilib.Date._equationOfTime = function(jd) {
	var alpha, deltaPsi, E, epsilon, L0, tau, pos;

	// 2451545.0 is the Julian day of J2000 epoch
	// 365250.0 is the number of days in a Julian millenium
	tau = (jd - 2451545.0) / 365250.0;
	//console.log("equationOfTime.  tau = " + tau);
	L0 = 280.4664567 + (360007.6982779 * tau) + (0.03032028 * tau * tau)
			+ ((tau * tau * tau) / 49931)
			+ (-((tau * tau * tau * tau) / 15300))
			+ (-((tau * tau * tau * tau * tau) / 2000000));
	//console.log("L0 = " + L0);
	L0 = ilib.Date._fixangle(L0);
	//console.log("L0 = " + L0);
	pos = ilib.Date._sunpos(jd);
	alpha = pos.apparentRightAscension;
	//console.log("alpha = " + alpha);
	var nut = ilib.Date._nutation(jd);
	deltaPsi = nut.deltaPsi;
	//console.log("deltaPsi = " + deltaPsi);
	epsilon = ilib.Date._obliqeq(jd) + nut.deltaEpsilon;
	//console.log("epsilon = " + epsilon);
	//console.log("L0 - 0.0057183 = " + (L0 - 0.0057183));
	//console.log("L0 - 0.0057183 - alpha = " + (L0 - 0.0057183 - alpha));
	//console.log("deltaPsi * cos(epsilon) = " + deltaPsi * ilib.Date._dcos(epsilon));
	
	E = L0 - 0.0057183 - alpha + deltaPsi * ilib.Date._dcos(epsilon);
	// if alpha and L0 are in different quadrants, then renormalize
	// so that the difference between them is in the right range
	if (E > 180) {
		E -= 360;
	}
	//console.log("E = " + E);
	// E = E - 20.0 * (Math.floor(E / 20.0));
	E = E * 4;
	//console.log("Efixed = " + E);
	E = E / (24 * 60);
	//console.log("Eday = " + E);

	return E;
};

/**
 * @private
 * @static
 */
ilib.Date._poly = function(x, coefficients) {
	var result = coefficients[0];
	var xpow = x;
	for (var i = 1; i < coefficients.length; i++) {
		result += coefficients[i] * xpow;
		xpow *= x;
	}
	return result;
};

/**
 * Calculate the UTC RD from the local RD given "zone" number of minutes
 * worth of offset.
 * 
 * @static
 * @param {number} local RD of the locale time, given in any calendar
 * @param {number} zone number of minutes of offset from UTC for the time zone 
 * @return {number} the UTC equivalent of the local RD
 */
ilib.Date._universalFromLocal = function(local, zone) {
	return local - zone / 1440;
};

/**
 * Calculate the local RD from the UTC RD given "zone" number of minutes
 * worth of offset.
 * 
 * @static
 * @param {number} local RD of the locale time, given in any calendar
 * @param {number} zone number of minutes of offset from UTC for the time zone 
 * @return {number} the UTC equivalent of the local RD
 */
ilib.Date._localFromUniversal = function(local, zone) {
	return local + zone / 1440;
};

/**
 * @private
 * @static
 * @param {number} c julian centuries of the date to calculate
 * @return {number} the aberration
 */
ilib.Date._aberration = function(c) {
	return 9.74e-05 * ilib.Date._dcos(177.63 + 35999.01847999999 * c) - 0.005575;
};

/**
 * @private
 *
ilib.data.astro._nutCoeffA = [124.90, -1934.134, 0.002063];
ilib.data.astro._nutCoeffB = [201.11, 72001.5377, 0.00057];
*/

/**
 * @private
 * @static
 * @param {number} c julian centuries of the date to calculate
 * @return {number} the nutation for the given julian century in radians
 */
ilib.Date._nutation2 = function(c) {
	var a = ilib.Date._poly(c, ilib.data.astro._nutCoeffA);
	var b = ilib.Date._poly(c, ilib.data.astro._nutCoeffB);
	// return -0.0000834 * ilib.Date._dsin(a) - 0.0000064 * ilib.Date._dsin(b);
	return -0.004778 * ilib.Date._dsin(a) - 0.0003667 * ilib.Date._dsin(b);
};


/**
 * @static
 * @private
 */
ilib.Date._ephemerisCorrection = function(jd) {
	var year = ilib.Date.GregDate._calcYear(jd - 1721424.5);
	
	if (1988 <= year && year <= 2019) {
		return (year - 1933) / 86400;
	}
	
	if (1800 <= year && year <= 1987) {
		var jul1 = new ilib.Date.GregRataDie({
			year: year,
			month: 7,
			day: 1,
			hour: 0,
			minute: 0,
			second: 0
		});
		// 693596 is the rd of Jan 1, 1900
		var theta = (jul1.getRataDie() - 693596) / 36525;
		return ilib.Date._poly(theta, (1900 <= year) ? ilib.data.astro._coeff19th : ilib.data.astro._coeff18th);
	}
	
	if (1620 <= year && year <= 1799) {
		year -= 1600;
		return (196.58333 - 4.0675 * year + 0.0219167 * year * year) / 86400;
	}
	
	// 660724 is the rd of Jan 1, 1810
	var jan1 = new ilib.Date.GregRataDie({
		year: year,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0
	});
	// var x = 0.5 + (jan1.getRataDie() - 660724);
	var x = 0.5 + (jan1.getRataDie() - 660724);
	
	return ((x * x / 41048480) - 15) / 86400;
};

/**
 * @static
 * @private
 */
ilib.Date._ephemerisFromUniversal = function(jd) {
	return jd + ilib.Date._ephemerisCorrection(jd);
};

/**
 * @static
 * @private
 */
ilib.Date._universalFromEphemeris = function(jd) {
	return jd - ilib.Date._ephemerisCorrection(jd);
};

/**
 * @static
 * @private
 */
ilib.Date._julianCenturies = function(jd) {
	// 2451545.0 is the Julian day of J2000 epoch
	// 730119.5 is the Gregorian RD of J2000 epoch
	// 36525.0 is the number of days in a Julian century
	return (ilib.Date._ephemerisFromUniversal(jd) - 2451545.0) / 36525.0;
};

/**
 * Calculate the solar longitude
 * 
 * @static
 * @param {number} jd julian day of the date to calculate the longitude for 
 * @return {number} the solar longitude in degrees
 */
ilib.Date._solarLongitude = function(jd) {
	var c = ilib.Date._julianCenturies(jd),
		longitude = 0,
		len = ilib.data.astro._solarLongCoeff.length,
		row;
	
	for (var i = 0; i < len; i++) {
		longitude += ilib.data.astro._solarLongCoeff[i] * 
			ilib.Date._dsin(ilib.data.astro._solarLongAddends[i] + ilib.data.astro._solarLongMultipliers[i] * c);
	}
	longitude *= 5.729577951308232e-06;
	longitude += 282.77718340000001 + 36000.769537439999 * c;
	longitude += ilib.Date._aberration(c) + ilib.Date._nutation2(c);
	return ilib.Date._fixangle(longitude);
};

/**
 * @static
 * @protected
 * @param {number} jd
 * @return {number}
 */
ilib.Date._lunarLongitude = function (jd) {
	var c = ilib.Date._julianCenturies(jd),
	    meanMoon = ilib.Date._fixangle(ilib.Date._poly(c, ilib.data.astro._meanMoonCoeff)),
	    elongation = ilib.Date._fixangle(ilib.Date._poly(c, ilib.data.astro._elongationCoeff)),
	    solarAnomaly = ilib.Date._fixangle(ilib.Date._poly(c, ilib.data.astro._solarAnomalyCoeff)),
	    lunarAnomaly = ilib.Date._fixangle(ilib.Date._poly(c, ilib.data.astro._lunarAnomalyCoeff)),
	    moonNode = ilib.Date._fixangle(ilib.Date._poly(c, ilib.data.astro._moonFromNodeCoeff)),
	    e = ilib.Date._poly(c, ilib.data.astro._eCoeff);
	
	var sum = 0;
	for (var i = 0; i < ilib.data.astro._lunarElongationLongCoeff.length; i++) {
		var x = ilib.data.astro._solarAnomalyLongCoeff[i];

		sum += ilib.data.astro._sineCoeff[i] * Math.pow(e, Math.abs(x)) * 
			ilib.Date._dsin(ilib.data.astro._lunarElongationLongCoeff[i] * elongation + x * solarAnomaly + 
				ilib.data.astro._lunarAnomalyLongCoeff[i] * lunarAnomaly + 
				ilib.data.astro._moonFromNodeLongCoeff[i] * moonNode);
	}
	var longitude = sum / 1000000;
	var venus = 3958.0 / 1000000 * ilib.Date._dsin(119.75 + c * 131.84899999999999);
	var jupiter = 318.0 / 1000000 * ilib.Date._dsin(53.090000000000003 + c * 479264.28999999998);
	var flatEarth = 1962.0 / 1000000 * ilib.Date._dsin(meanMoon - moonNode);
	
	return ilib.Date._fixangle(meanMoon + longitude + venus + jupiter + flatEarth + ilib.Date._nutation2(c));
};

/**
 * @static
 * @param {number} n
 * @return {number} julian day of the n'th new moon
 */
ilib.Date._newMoonTime = function(n) {
	var k = n - 24724;
	var c = k / 1236.8499999999999;
	var approx = ilib.Date._poly(c, ilib.data.astro._nmApproxCoeff);
	var capE = ilib.Date._poly(c, ilib.data.astro._nmCapECoeff);
	var solarAnomaly = ilib.Date._poly(c, ilib.data.astro._nmSolarAnomalyCoeff);
	var lunarAnomaly = ilib.Date._poly(c, ilib.data.astro._nmLunarAnomalyCoeff);
	var moonArgument = ilib.Date._poly(c, ilib.data.astro._nmMoonArgumentCoeff);
	var capOmega = ilib.Date._poly(c, ilib.data.astro._nmCapOmegaCoeff);
	var correction = -0.00017 * ilib.Date._dsin(capOmega);
	for (var i = 0; i < ilib.data.astro._nmSineCoeff.length; i++) {
		correction = correction + ilib.data.astro._nmSineCoeff[i] * Math.pow(capE, ilib.data.astro._nmEFactor[i]) * 
		ilib.Date._dsin(ilib.data.astro._nmSolarCoeff[i] * solarAnomaly + 
				ilib.data.astro._nmLunarCoeff[i] * lunarAnomaly + 
				ilib.data.astro._nmMoonCoeff[i] * moonArgument);
	}
	var additional = 0;
	for (var i = 0; i < ilib.data.astro._nmAddConst.length; i++) {
		additional = additional + ilib.data.astro._nmAddFactor[i] * 
		ilib.Date._dsin(ilib.data.astro._nmAddConst[i] + ilib.data.astro._nmAddCoeff[i] * k);
	}
	var extra = 0.000325 * ilib.Date._dsin(ilib.Date._poly(c, ilib.data.astro._nmExtra));
	return ilib.Date._universalFromEphemeris(approx + correction + extra + additional + ilib.Date.RataDie.gregorianEpoch);
};

/**
 * @static
 * @param {number} jd
 * @return {number}
 */
ilib.Date._lunarSolarAngle = function(jd) {
	var lunar = ilib.Date._lunarLongitude(jd);
	var solar = ilib.Date._solarLongitude(jd)
	return ilib.Date._fixangle(lunar - solar);
};

/**
 * @static
 * @param {number} jd
 * @return {number}
 */
ilib.Date._newMoonBefore = function (jd) {
	var phase = ilib.Date._lunarSolarAngle(jd);
	// 11.450086114414322 is the julian day of the 0th full moon
	// 29.530588853000001 is the average length of a month
	var guess = Math.round((jd - 11.450086114414322 - ilib.Date.RataDie.gregorianEpoch) / 29.530588853000001 - phase / 360) - 1;
	var current, last;
	current = last = ilib.Date._newMoonTime(guess);
	while (current < jd) {
		guess++;
		last = current;
		current = ilib.Date._newMoonTime(guess);
	}
	return last;
};

/**
 * @static
 * @param {number} jd
 * @return {number}
 */
ilib.Date._newMoonAtOrAfter = function (jd) {
	var phase = ilib.Date._lunarSolarAngle(jd);
	// 11.450086114414322 is the julian day of the 0th full moon
	// 29.530588853000001 is the average length of a month
	var guess = Math.round((jd - 11.450086114414322 - ilib.Date.RataDie.gregorianEpoch) / 29.530588853000001 - phase / 360);
	var current;
	while ((current = ilib.Date._newMoonTime(guess)) < jd) {
		guess++;
	}
	return current;
};

/**
 * @static
 * @param {number} jd JD to calculate from
 * @param {number} longitude longitude to seek 
 * @returns {number} the JD of the next time that the solar longitude 
 * is a multiple of the given longitude
 */
ilib.Date._nextSolarLongitude = function(jd, longitude) {
	var rate = 365.242189 / 360.0;
	var tau = jd + rate * ilib.Date._fixangle(longitude - ilib.Date._solarLongitude(jd));
	var start = Math.max(jd, tau - 5.0);
	var end = tau + 5.0;
	
	return ilib.bisectionSearch(0, start, end, 1e-6, function (l) {
		return 180 - ilib.Date._fixangle(ilib.Date._solarLongitude(l) - longitude);
	});
};

/**
 * Floor the julian day to midnight of the current julian day.
 * 
 * @static
 * @protected
 * @param {number} jd the julian to round
 * @return {number} the jd floored to the midnight of the julian day
 */
ilib.Date._floorToJD = function(jd) {
	return Math.floor(jd - 0.5) + 0.5;
};

/**
 * Floor the julian day to midnight of the current julian day.
 * 
 * @static
 * @protected
 * @param {number} jd the julian to round
 * @return {number} the jd floored to the midnight of the julian day
 */
ilib.Date._ceilToJD = function(jd) {
	return Math.ceil(jd + 0.5) - 0.5;
};

/*
 * persratadie.js - Represent a rata die date in the Persian calendar
 * 
 * Copyright © 2014, JEDLSoft
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
date.js
util/utils.js
util/math.js
calendar/ratadie.js
calendar/astro.js
calendar/gregoriandate.js
*/

/**
 * Construct a new Persian RD date number object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970, Gregorian
 * 
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 * 
 * <li><i>year</i> - any integer, including 0
 * 
 * <li><i>month</i> - 1 to 12, where 1 means Farvardin, 2 means Ordibehesht, etc.
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
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Persian date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above are present, then the RD is calculate based on 
 * the current date at the time of instantiation. <p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * Depends directive: !depends persiandate.js
 * 
 * @private
 * @class
 * @constructor
 * @extends ilib.Date.RataDie
 * @param {Object=} params parameters that govern the settings and behaviour of this Persian RD date
 */
ilib.Date.PersAstroRataDie = function(params) {
	this.rd = undefined;
	ilib.Date.initAstro(
		params && typeof(params.sync) === 'boolean' ? params.sync : true,
		params && params.loadParams,
		ilib.bind(this, function (x) {
			ilib.Date.RataDie.call(this, params);
			if (params && typeof(params.callback) === 'function') {
				params.callback(this);
			}
		})
	);
};

ilib.Date.PersAstroRataDie.prototype = new ilib.Date.RataDie();
ilib.Date.PersAstroRataDie.prototype.parent = ilib.Date.RataDie;
ilib.Date.PersAstroRataDie.prototype.constructor = ilib.Date.PersAstroRataDie;

/**
 * The difference between a zero Julian day and the first Persian date
 * @private
 * @const
 * @type number
 */
ilib.Date.PersAstroRataDie.prototype.epoch = 1948319.5;

/**
 * @protected 
 */
ilib.Date.PersAstroRataDie.prototype._tehranEquinox = function(year) {
    var equJED, equJD, equAPP, equTehran, dtTehran, eot;

    //  March equinox in dynamical time
    equJED = ilib.Date._equinox(year, 0);

    //  Correct for delta T to obtain Universal time
    equJD = equJED - (ilib.Date._deltat(year) / (24 * 60 * 60));

    //  Apply the equation of time to yield the apparent time at Greenwich
    eot = ilib.Date._equationOfTime(equJED) * 360;
    eot = (eot - 20 * Math.floor(eot/20)) / 360;
    equAPP = equJD + eot;

    /*  
     * Finally, we must correct for the constant difference between
     * the Greenwich meridian and the time zone standard for Iran 
     * Standard time, 52 degrees 30 minutes to the East.
     */

    dtTehran = 52.5 / 360;
    equTehran = equAPP + dtTehran;

    return equTehran;
};

/**
 * Calculate the year based on the given Julian day.
 * @protected
 * @param {number} jd the Julian day to get the year for
 * @return {{year:number,equinox:number}} the year and the last equinox
 */
ilib.Date.PersAstroRataDie.prototype._getYear = function(jd) {
	var gd = new ilib.Date.GregDate({julianday: jd});
    var guess = gd.getYears() - 2,
    	nexteq,
    	ret = {};

    //ret.equinox = Math.floor(this._tehranEquinox(guess));
    ret.equinox = this._tehranEquinox(guess);
	while (ret.equinox > jd) {
	    guess--;
	    // ret.equinox = Math.floor(this._tehranEquinox(guess));
	    ret.equinox = this._tehranEquinox(guess);
	}
	nexteq = ret.equinox - 1;
	// if the equinox falls after noon, then the day after that is the start of the 
	// next year, so truncate the JD to get the noon of the day before the day with 
	//the equinox on it, then add 0.5 to get the midnight of that day 
	while (!(Math.floor(ret.equinox) + 0.5 <= jd && jd < Math.floor(nexteq) + 0.5)) {
	    ret.equinox = nexteq;
	    guess++;
	    // nexteq = Math.floor(this._tehranEquinox(guess));
	    nexteq = this._tehranEquinox(guess);
	}
	
	// Mean solar tropical year is 365.24219878 days
	ret.year = Math.round((ret.equinox - this.epoch - 1) / 365.24219878) + 1;
	
	return ret;
};

/**
 * Calculate the Rata Die (fixed day) number of the given date from the
 * date components.
 *
 * @protected
 * @param {Object} date the date components to calculate the RD from
 */
ilib.Date.PersAstroRataDie.prototype._setDateComponents = function(date) {
    var adr, guess, jd;

    // Mean solar tropical year is 365.24219878 days 
    guess = this.epoch + 1 + 365.24219878 * (date.year - 2);
    adr = {year: date.year - 1, equinox: 0};

    while (adr.year < date.year) {
        adr = this._getYear(guess);
        guess = adr.equinox + (365.24219878 + 2);
    }

    jd = Math.floor(adr.equinox) +
            ((date.month <= 7) ?
                ((date.month - 1) * 31) :
                (((date.month - 1) * 30) + 6)
            ) +
    	    (date.day - 1 + 0.5); // add 0.5 so that we convert JDs, which start at noon to RDs which start at midnight
    
	jd += (date.hour * 3600000 +
			date.minute * 60000 +
			date.second * 1000 +
			date.millisecond) /
			86400000;

    this.rd = jd - this.epoch;
};

/**
 * Return the rd number of the particular day of the week on or before the 
 * given rd. eg. The Sunday on or before the given rd.
 * @private
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the current date
 * @return {number} the rd of the day of the week
 */
ilib.Date.PersAstroRataDie.prototype._onOrBefore = function(rd, dayOfWeek) {
	return rd - ilib.mod(Math.floor(rd) - dayOfWeek - 3, 7);
};

/*
 * persianastro.js - Represent a Persian astronomical (Hijjri) calendar object.
 * 
 * Copyright © 2014, JEDLSoft
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
calendar/astro.js 
calendar.js 
locale.js 
date.js 
julianday.js 
util/utils.js
calendar/persratadie.js 
*/

/**
 * @class
 * Construct a new Persian astronomical (Hijjri) calendar object. This class encodes 
 * information about a Persian calendar. This class differs from the 
 * Persian calendar in that the leap years are calculated based on the
 * astronomical observations of the sun in Teheran, instead of calculating
 * the leap years based on a regular cyclical rhythm algorithm.<p>
 * 
 * Depends directive: !depends persianastro.js
 * 
 * @constructor
 * @implements ilib.Cal
 */
ilib.Cal.Persian = function() {
	this.type = "persian";
};

/**
 * @private
 * @const
 * @type Array.<number> 
 * the lengths of each month 
 */
ilib.Cal.Persian.monthLengths = [
	31,  // Farvardin
	31,  // Ordibehesht
	31,  // Khordad
	31,  // Tir
	31,  // Mordad
	31,  // Shahrivar
	30,  // Mehr
	30,  // Aban
	30,  // Azar
	30,  // Dey
	30,  // Bahman
	29   // Esfand
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
ilib.Cal.Persian.prototype.getNumMonths = function(year) {
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
ilib.Cal.Persian.prototype.getMonLength = function(month, year) {
	if (month !== 12 || !this.isLeapYear(year)) {
		return ilib.Cal.Persian.monthLengths[month-1];
	} else {
		// Month 12, Esfand, has 30 days instead of 29 in leap years
		return 30;
	}
};

/**
 * Return true if the given year is a leap year in the Persian astronomical calendar.
 * @param {number} year the year for which the leap year information is being sought
 * @return {boolean} true if the given year is a leap year
 */
ilib.Cal.Persian.prototype.isLeapYear = function(year) {
	var rdNextYear = new ilib.Date.PersAstroRataDie({
		cal: this,
		year: year + 1,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	});
	var rdThisYear = new ilib.Date.PersAstroRataDie({
		cal: this,
		year: year,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	}); 
    return (rdNextYear.getRataDie() - rdThisYear.getRataDie()) > 365;
};

/**
 * Return the type of this calendar.
 * 
 * @return {string} the name of the type of this calendar 
 */
ilib.Cal.Persian.prototype.getType = function() {
	return this.type;
};

/**
 * Return a date instance for this calendar type using the given
 * options.
 * @param {Object} options options controlling the construction of 
 * the date instance
 * @return {ilib.Date} a date appropriate for this calendar type
 */
ilib.Cal.Persian.prototype.newDateInstance = function (options) {
	return new ilib.Date.PersDate(options);
};

/* register this calendar for the factory method */
ilib.Cal._constructors["persian"] = ilib.Cal.Persian;

/*
 * persianastrodate.js - Represent a date in the Persian astronomical (Hijjri) calendar
 * 
 * Copyright © 2014, JEDLSoft
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
date.js
calendar/persratadie.js
calendar/persianastro.js 
util/utils.js
util/search.js
util/math.js
localeinfo.js 
julianday.js 
*/

// !data astro

/**
 * @class
 * 
 * Construct a new Persian astronomical date object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970, Gregorian
 * 
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 * 
 * <li><i>year</i> - any integer, including 0
 * 
 * <li><i>month</i> - 1 to 12, where 1 means Farvardin, 2 means Ordibehesht, etc.
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
 * of this persian date. The date/time is kept in the local time. The time zone
 * is used later if this date is formatted according to a different time zone and
 * the difference has to be calculated, or when the date format has a time zone
 * component in it.
 * 
 * <li><i>locale</i> - locale for this persian date. If the time zone is not 
 * given, it can be inferred from this locale. For locales that span multiple
 * time zones, the one with the largest population is chosen as the one that 
 * represents the locale.
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Persian date instance instead of
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
 * Depends directive: !depends persiandate.js
 * 
 * @constructor
 * @extends ilib.Date
 * @param {Object=} params parameters that govern the settings and behaviour of this Persian date
 */
ilib.Date.PersDate = function(params) {
	this.cal = new ilib.Cal.Persian();
	this.timezone = "local";
	
	if (params) {
		if (params.locale) {
			this.locale = (typeof(params.locale) === 'string') ? new ilib.Locale(params.locale) : params.locale;
			var li = new ilib.LocaleInfo(this.locale);
			this.timezone = li.getTimeZone(); 
		}
		if (params.timezone) {
			this.timezone = params.timezone;
		}
	}
	
	ilib.Date.initAstro(
		params && typeof(params.sync) === 'boolean' ? params.sync : true,
		params && params.loadParams,
		ilib.bind(this, function (x) {
			if (params && (params.year || params.month || params.day || params.hour ||
					params.minute || params.second || params.millisecond)) {
				/**
				 * Year in the Persian calendar.
				 * @type number
				 */
				this.year = parseInt(params.year, 10) || 0;

				/**
				 * The month number, ranging from 1 to 12
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
				
				/**
				 * The day of the year. Ranges from 1 to 366.
				 * @type number
				 */
				this.dayOfYear = parseInt(params.dayOfYear, 10);

				if (typeof(params.dst) === 'boolean') {
					this.dst = params.dst;
				}
				
				this.rd = this.newRd(this);
				
				// add the time zone offset to the rd to convert to UTC
				if (!this.tz) {
					this.tz = new ilib.TimeZone({id: this.timezone});
				}
				// getOffsetMillis requires that this.year, this.rd, and this.dst 
				// are set in order to figure out which time zone rules apply and 
				// what the offset is at that point in the year
				this.offset = this.tz._getOffsetMillisWallTime(this) / 86400000;
				if (this.offset !== 0) {
					this.rd = this.newRd({
						rd: this.rd.getRataDie() - this.offset
					});
				}
			}
			
			if (!this.rd) {
				this.rd = this.newRd(params);
				this._calcDateComponents();
			}
			
			if (params && typeof(params.onLoad) === 'function') {
				params.onLoad(this);
			}
		})
	);
};

ilib.Date.PersDate.prototype = new ilib.Date({noinstance: true});
ilib.Date.PersDate.prototype.parent = ilib.Date;
ilib.Date.PersDate.prototype.constructor = ilib.Date.PersDate;

/**
 * @private
 * @const
 * @type Array.<number>
 * the cumulative lengths of each month, for a non-leap year 
 */
ilib.Date.PersDate.cumMonthLengths = [
    0,    // Farvardin
	31,   // Ordibehesht
	62,   // Khordad
	93,   // Tir
	124,  // Mordad
	155,  // Shahrivar
	186,  // Mehr
	216,  // Aban
	246,  // Azar
	276,  // Dey
	306,  // Bahman
	336,  // Esfand
	366
];

/**
 * Return a new RD for this date type using the given params.
 * @protected
 * @param {Object=} params the parameters used to create this rata die instance
 * @returns {ilib.Date.RataDie} the new RD instance for the given params
 */
ilib.Date.PersDate.prototype.newRd = function (params) {
	return new ilib.Date.PersAstroRataDie(params);
};

/**
 * Return the year for the given RD
 * @protected
 * @param {number} rd RD to calculate from 
 * @returns {number} the year for the RD
 */
ilib.Date.PersDate.prototype._calcYear = function(rd) {
	var julianday = rd + this.rd.epoch;
	return this.rd._getYear(julianday).year;
};

/**
 * @private
 * Calculate date components for the given RD date.
 */
ilib.Date.PersDate.prototype._calcDateComponents = function () {
	var remainder,
		rd = this.rd.getRataDie();
	
	this.year = this._calcYear(rd);
	
	if (typeof(this.offset) === "undefined") {
		// now offset the RD by the time zone, then recalculate in case we were 
		// near the year boundary
		if (!this.tz) {
			this.tz = new ilib.TimeZone({id: this.timezone});
		}
		this.offset = this.tz.getOffsetMillis(this) / 86400000;
	}
	
	if (this.offset !== 0) {
		rd += this.offset;
		this.year = this._calcYear(rd);
	}
	
	//console.log("PersDate.calcComponent: calculating for rd " + rd);
	//console.log("PersDate.calcComponent: year is " + ret.year);
	var yearStart = this.newRd({
		year: this.year,
		month: 1,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	});
	remainder = rd - yearStart.getRataDie() + 1;
	
	this.dayOfYear = remainder;
	
	//console.log("PersDate.calcComponent: remainder is " + remainder);
	
	this.month = ilib.bsearch(Math.floor(remainder), ilib.Date.PersDate.cumMonthLengths);
	remainder -= ilib.Date.PersDate.cumMonthLengths[this.month-1];
	
	//console.log("PersDate.calcComponent: month is " + this.month + " and remainder is " + remainder);
	
	this.day = Math.floor(remainder);
	remainder -= this.day;
	
	//console.log("PersDate.calcComponent: day is " + this.day + " and remainder is " + remainder);
	
	// now convert to milliseconds for the rest of the calculation
	remainder = Math.round(remainder * 86400000);
	
	this.hour = Math.floor(remainder/3600000);
	remainder -= this.hour * 3600000;
	
	this.minute = Math.floor(remainder/60000);
	remainder -= this.minute * 60000;
	
	this.second = Math.floor(remainder/1000);
	remainder -= this.second * 1000;
	
	this.millisecond = remainder;
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 * 
 * @return {number} the day of the week
 */
ilib.Date.PersDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.getRataDie());
	return ilib.mod(rd-3, 7);
};

/**
 * Return the ordinal day of the year. Days are counted from 1 and proceed linearly up to 
 * 365, regardless of months or weeks, etc. That is, Farvardin 1st is day 1, and 
 * December 31st is 365 in regular years, or 366 in leap years.
 * @return {number} the ordinal day of the year
 */
ilib.Date.PersDate.prototype.getDayOfYear = function() {
	return ilib.Date.PersDate.cumMonthLengths[this.month-1] + this.day;
};

/**
 * Return the era for this date as a number. The value for the era for Persian 
 * calendars is -1 for "before the persian era" (BP) and 1 for "the persian era" (anno 
 * persico or AP). 
 * BP dates are any date before Farvardin 1, 1 AP. In the proleptic Persian calendar, 
 * there is a year 0, so any years that are negative or zero are BP.
 * @return {number} 1 if this date is in the common era, -1 if it is before the 
 * common era 
 */
ilib.Date.PersDate.prototype.getEra = function() {
	return (this.year < 1) ? -1 : 1;
};

/**
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
ilib.Date.PersDate.prototype.getCalendar = function() {
	return "persian";
};

// register with the factory method
ilib.Date._constructors["persian"] = ilib.Date.PersDate;
/*
 * han.js - Represent a Han Chinese Lunar calendar object.
 * 
 * Copyright © 2014, JEDLSoft
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

/* !depends calendar.js locale.js date.js julianday.js util/utils.js util/math.js calendar/astro.js */

/**
 * @class
 * Construct a new Han algorithmic calendar object. This class encodes information about
 * a Han algorithmic calendar.<p>
 * 
 * Depends directive: !depends han.js
 * 
 * @constructor
 * @param {Object=} params optional parameters to load the calendrical data
 * @implements ilib.Cal
 */
ilib.Cal.Han = function(params) {
	this.type = "han";
	var sync = params && typeof(params.sync) === 'boolean' ? params.sync : true;
	
	ilib.Date.initAstro(sync, params && params.loadParams, /** @type {function ((Object|null)=): ?} */ ilib.bind(this, function (x) {
		if (params && typeof(params.callback) === 'function') {
			params.callback(this);
		}
	}));
};

/**
 * @protected
 * @static
 * @param {number} year
 * @param {number=} cycle
 * @return {number}
 */
ilib.Cal.Han._getElapsedYear = function(year, cycle) {
	var elapsedYear = year || 0;
	if (typeof(year) !== 'undefined' && year < 61 && typeof(cycle) !== 'undefined') {
		elapsedYear = 60 * cycle + year;
	}
	return elapsedYear;
};

/**
 * @protected
 * @static
 * @param {number} jd julian day to calculate from
 * @param {number} longitude longitude to seek 
 * @returns {number} the julian day of the next time that the solar longitude 
 * is a multiple of the given longitude
 */
ilib.Cal.Han._hanNextSolarLongitude = function(jd, longitude) {
	var tz = ilib.Cal.Han._chineseTZ(jd);
	var uni = ilib.Date._universalFromLocal(jd, tz);
	var sol = ilib.Date._nextSolarLongitude(uni, longitude);
	return ilib.Date._localFromUniversal(sol, tz);
};

/**
 * @protected
 * @static
 * @param {number} jd julian day to calculate from 
 * @returns {number} the major solar term for the julian day
 */
ilib.Cal.Han._majorSTOnOrAfter = function(jd) {
	var tz = ilib.Cal.Han._chineseTZ(jd);
	var uni = ilib.Date._universalFromLocal(jd, tz);
	var next = ilib.Date._fixangle(30 * Math.ceil(ilib.Date._solarLongitude(uni)/30));
	return ilib.Cal.Han._hanNextSolarLongitude(jd, next);
};

/**
 * @protected
 * @static
 * @param {number} year the year for which the leap year information is being sought
 * @param {number=} cycle if the given year < 60, this can specify the cycle. If the
 * cycle is not given, then the year should be given as elapsed years since the beginning
 * of the epoch
 */
ilib.Cal.Han._solsticeBefore = function (year, cycle) {
	var elapsedYear = ilib.Cal.Han._getElapsedYear(year, cycle);
	var gregyear = elapsedYear - 2697;
	var rd = new ilib.Date.GregRataDie({
		year: gregyear-1, 
		month: 12, 
		day: 15, 
		hour: 0, 
		minute: 0, 
		second: 0, 
		millisecond: 0
	});
	return ilib.Cal.Han._majorSTOnOrAfter(rd.getRataDie() + ilib.Date.RataDie.gregorianEpoch);
};

/**
 * @protected
 * @static
 * @param {number} jd julian day to calculate from
 * @returns {number} the current major solar term
 */
ilib.Cal.Han._chineseTZ = function(jd) {
	var year = ilib.Date.GregDate._calcYear(jd - ilib.Date.RataDie.gregorianEpoch);
	return year < 1929 ? 465.6666666666666666 : 480;
};

/**
 * @protected
 * @static
 * @param {number} jd julian day to calculate from 
 * @returns {number} the julian day of next new moon on or after the given julian day date
 */
ilib.Cal.Han._newMoonOnOrAfter = function(jd) {
	var tz = ilib.Cal.Han._chineseTZ(jd);
	var uni = ilib.Date._universalFromLocal(jd, tz);
	var moon = ilib.Date._newMoonAtOrAfter(uni);
	// floor to the start of the julian day
	return ilib.Date._floorToJD(ilib.Date._localFromUniversal(moon, tz)); 
};

/**
 * @protected
 * @static
 * @param {number} jd julian day to calculate from 
 * @returns {number} the julian day of previous new moon before the given julian day date
 */
ilib.Cal.Han._newMoonBefore = function(jd) {
	var tz = ilib.Cal.Han._chineseTZ(jd);
	var uni = ilib.Date._universalFromLocal(jd, tz);
	var moon = ilib.Date._newMoonBefore(uni);
	// floor to the start of the julian day
	return ilib.Date._floorToJD(ilib.Date._localFromUniversal(moon, tz));
};

/**
 * @static
 * @protected
 * @param {number} year the year for which the leap year information is being sought
 * @param {number=} cycle if the given year < 60, this can specify the cycle. If the
 * cycle is not given, then the year should be given as elapsed years since the beginning
 * of the epoch
 */
ilib.Cal.Han._leapYearCalc = function(year, cycle) {
	var ret = {
		elapsedYear: ilib.Cal.Han._getElapsedYear(year, cycle)
	};
	ret.solstice1 = ilib.Cal.Han._solsticeBefore(ret.elapsedYear);
	ret.solstice2 = ilib.Cal.Han._solsticeBefore(ret.elapsedYear+1);
	// ceil to the end of the julian day
	ret.m1 = ilib.Cal.Han._newMoonOnOrAfter(ilib.Date._ceilToJD(ret.solstice1));
	ret.m2 = ilib.Cal.Han._newMoonBefore(ilib.Date._ceilToJD(ret.solstice2));
	
	return ret;
};

/**
 * @protected
 * @static
 * @param {number} jd julian day to calculate from
 * @returns {number} the current major solar term
 */
ilib.Cal.Han._currentMajorST = function(jd) {
	var s = ilib.Date._solarLongitude(ilib.Date._universalFromLocal(jd, ilib.Cal.Han._chineseTZ(jd)));
	return ilib.amod(2 + Math.floor(s/30), 12);
};

/**
 * @protected
 * @static
 * @param {number} jd julian day to calculate from
 * @returns {boolean} true if there is no major solar term in the same year
 */
ilib.Cal.Han._noMajorST = function(jd) {
	return ilib.Cal.Han._currentMajorST(jd) === ilib.Cal.Han._currentMajorST(ilib.Cal.Han._newMoonOnOrAfter(jd+1));
};

/**
 * Return the number of months in the given year. The number of months in a year varies
 * for some luni-solar calendars because in some years, an extra month is needed to extend the 
 * days in a year to an entire solar year. The month is represented as a 1-based number
 * where 1=first month, 2=second month, etc.
 * 
 * @param {number} year a year for which the number of months is sought
 * @param {number=} cycle if the given year < 60, this can specify the cycle. If the
 * cycle is not given, then the year should be given as elapsed years since the beginning
 * of the epoch
 * @return {number} The number of months in the given year
 */
ilib.Cal.Han.prototype.getNumMonths = function(year, cycle) {
	return this.isLeapYear(year, cycle) ? 13 : 12;
};

/**
 * Return the number of days in a particular month in a particular year. This function
 * can return a different number for a month depending on the year because of things
 * like leap years.
 * 
 * @param {number} month the elapsed month for which the length is sought
 * @param {number} year the elapsed year within which that month can be found
 * @return {number} the number of days within the given month in the given year
 */
ilib.Cal.Han.prototype.getMonLength = function(month, year) {
	// distance between two new moons in Nanjing China
	var calc = ilib.Cal.Han._leapYearCalc(year);
	var priorNewMoon = ilib.Cal.Han._newMoonOnOrAfter(calc.m1 + month * 29);
	var postNewMoon = ilib.Cal.Han._newMoonOnOrAfter(priorNewMoon + 1);
	return postNewMoon - priorNewMoon;
};

/**
 * Return the equivalent year in the 2820 year cycle that begins on 
 * Far 1, 474. This particular cycle obeys the cycle-of-years formula 
 * whereas the others do not specifically. This cycle can be used as
 * a proxy for other years outside of the cycle by shifting them into 
 * the cycle.   
 * @param {number} year year to find the equivalent cycle year for
 * @returns {number} the equivalent cycle year
 */
ilib.Cal.Han.prototype.equivalentCycleYear = function(year) {
	var y = year - (year >= 0 ? 474 : 473);
	return ilib.mod(y, 2820) + 474;
};

/**
 * Return true if the given year is a leap year in the Han calendar.
 * If the year is given as a year/cycle combination, then the year should be in the 
 * range [1,60] and the given cycle is the cycle in which the year is located. If 
 * the year is greater than 60, then
 * it represents the total number of years elapsed in the proleptic calendar since
 * the beginning of the Chinese epoch in on 15 Feb, -2636 (Gregorian). In this 
 * case, the cycle parameter is ignored.
 * 
 * @param {number} year the year for which the leap year information is being sought
 * @param {number=} cycle if the given year < 60, this can specify the cycle. If the
 * cycle is not given, then the year should be given as elapsed years since the beginning
 * of the epoch
 * @return {boolean} true if the given year is a leap year
 */
ilib.Cal.Han.prototype.isLeapYear = function(year, cycle) {
	var calc = ilib.Cal.Han._leapYearCalc(year, cycle);
	return Math.round((calc.m2 - calc.m1) / 29.530588853000001) === 12;
};

/**
 * Return the month of the year that is the leap month. If the given year is
 * not a leap year, then this method will return -1.
 * 
 * @param {number} year the year for which the leap year information is being sought
 * @param {number=} cycle if the given year < 60, this can specify the cycle. If the
 * cycle is not given, then the year should be given as elapsed years since the beginning
 * of the epoch
 * @return {number} the number of the month that is doubled in this leap year, or -1
 * if this is not a leap year
 */
ilib.Cal.Han.prototype.getLeapMonth = function(year, cycle) {
	var calc = ilib.Cal.Han._leapYearCalc(year, cycle);
	
	if (Math.round((calc.m2 - calc.m1) / 29.530588853000001) != 12) {
		return -1; // no leap month
	}
	
	// search between rd1 and rd2 for the first month with no major solar term. That is our leap month.
	var month = 0;
	var m = ilib.Cal.Han._newMoonOnOrAfter(calc.m1+1);
	while (!ilib.Cal.Han._noMajorST(m)) {
		month++;
		m = ilib.Cal.Han._newMoonOnOrAfter(m+1);
	}
	
	// return the number of the month that is doubled
	return month; 
};

/**
 * Return the date of Chinese New Years in the given calendar year.
 * 
 * @param {number} year the Chinese year for which the new year information is being sought
 * @param {number=} cycle if the given year < 60, this can specify the cycle. If the
 * cycle is not given, then the year should be given as elapsed years since the beginning
 * of the epoch
 * @return {number} the julian day of the beginning of the given year 
 */
ilib.Cal.Han.prototype.newYears = function(year, cycle) {
	var calc = ilib.Cal.Han._leapYearCalc(year, cycle);
	var m2 = ilib.Cal.Han._newMoonOnOrAfter(calc.m1+1);
	if (Math.round((calc.m2 - calc.m1) / 29.530588853000001) === 12 &&
			(ilib.Cal.Han._noMajorST(calc.m1) || ilib.Cal.Han._noMajorST(m2)) ) {
		return ilib.Cal.Han._newMoonOnOrAfter(m2+1);
	}
	return m2;
};

/**
 * Return the type of this calendar.
 * 
 * @return {string} the name of the type of this calendar 
 */
ilib.Cal.Han.prototype.getType = function() {
	return this.type;
};

/**
 * Return a date instance for this calendar type using the given
 * options.
 * @param {Object} options options controlling the construction of 
 * the date instance
 * @return {ilib.Date} a date appropriate for this calendar type
 */
ilib.Cal.Han.prototype.newDateInstance = function (options) {
	return new ilib.Date.HanDate(options);
};

/* register this calendar for the factory method */
ilib.Cal._constructors["han"] = ilib.Cal.Han;

/*
 * handate.js - Represent a date in the Han algorithmic calendar
 * 
 * Copyright © 2014, JEDLSoft
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
date.js
calendar/gregratadie.js 
calendar/gregoriandate.js 
calendar/han.js
calendar/astro.js 
util/utils.js
util/search.js
util/math.js
localeinfo.js 
julianday.js 
*/

/**
 * Construct a new Han RD date number object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970, Gregorian
 * 
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 * 
 * <li><i>cycle</i> - any integer giving the number of 60-year cycle in which the date is located.
 * If the cycle is not given but the year is, it is assumed that the year parameter is a fictitious 
 * linear count of years since the beginning of the epoch, much like other calendars. This linear
 * count is never used. If both the cycle and year are given, the year is wrapped to the range 0 
 * to 60 and treated as if it were a year in the regular 60-year cycle.
 * 
 * <li><i>year</i> - any integer, including 0
 * 
 * <li><i>month</i> - 1 to 12, where 1 means Farvardin, 2 means Ordibehesht, etc.
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
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Han date instance instead of
 * a parameter block, the other instance acts as a parameter block and its
 * settings are copied into the current instance.<p>
 * 
 * If the constructor is called with no arguments at all or if none of the 
 * properties listed above are present, then the RD is calculate based on 
 * the current date at the time of instantiation. <p>
 * 
 * If any of the properties from <i>year</i> through <i>millisecond</i> are not
 * specified in the params, it is assumed that they have the smallest possible
 * value in the range for the property (zero or one).<p>
 * 
 * Depends directive: !depends handate.js
 * 
 * @private
 * @class
 * @constructor
 * @extends ilib.Date.RataDie
 * @param {Object=} params parameters that govern the settings and behaviour of this Han RD date
 */
ilib.Date.HanRataDie = function(params) {
	this.rd = undefined;
	if (params && params.cal) {
		this.cal = params.cal;
		ilib.Date.RataDie.call(this, params);
		if (params && typeof(params.callback) === 'function') {
			params.callback(this);
		}
	} else {
		new ilib.Cal.Han({
			sync: params && params.sync,
			loadParams: params && params.loadParams,
			callback: ilib.bind(this, function(c) {
				this.cal = c;
				ilib.Date.RataDie.call(this, params);
				if (params && typeof(params.callback) === 'function') {
					params.callback(this);
				}
			})
		});
	}
};

ilib.Date.HanRataDie.prototype = new ilib.Date.RataDie();
ilib.Date.HanRataDie.prototype.parent = ilib.Date.RataDie;
ilib.Date.HanRataDie.prototype.constructor = ilib.Date.HanRataDie;

/**
 * The difference between a zero Julian day and the first Han date
 * which is February 15, -2636 (Gregorian).
 * @private
 * @const
 * @type number
 */
ilib.Date.HanRataDie.epoch = 758325.5;

/**
 * Calculate the Rata Die (fixed day) number of the given date from the
 * date components.
 *
 * @protected
 * @param {Object} date the date components to calculate the RD from
 */
ilib.Date.HanRataDie.prototype._setDateComponents = function(date) {
	var calc = ilib.Cal.Han._leapYearCalc(date.year, date.cycle);
	var m2 = ilib.Cal.Han._newMoonOnOrAfter(calc.m1+1);
	var newYears;
	this.leapYear = (Math.round((calc.m2 - calc.m1) / 29.530588853000001) === 12);
	if (this.leapYear && (ilib.Cal.Han._noMajorST(calc.m1) || ilib.Cal.Han._noMajorST(m2)) ) {
		newYears = ilib.Cal.Han._newMoonOnOrAfter(m2+1);
	} else {
		newYears = m2;
	}

	var priorNewMoon = ilib.Cal.Han._newMoonOnOrAfter(calc.m1 + date.month * 29); // this is a julian day
	this.priorLeapMonth = ilib.Date.HanDate._priorLeapMonth(newYears, ilib.Cal.Han._newMoonBefore(priorNewMoon));
	this.leapMonth = (this.leapYear && ilib.Cal.Han._noMajorST(priorNewMoon) && !this.priorLeapMonth);

	var rdtime = (date.hour * 3600000 +
		date.minute * 60000 +
		date.second * 1000 +
		date.millisecond) /
		86400000;
	
	/*
	console.log("getRataDie: converting " +  JSON.stringify(date) + " to an RD");
	console.log("getRataDie: year is " +  date.year + " plus cycle " + date.cycle);
	console.log("getRataDie: isLeapYear is " +  this.leapYear);
	console.log("getRataDie: priorNewMoon is " +  priorNewMoon);
	console.log("getRataDie: day in month is " +  date.day);
	console.log("getRataDie: rdtime is " +  rdtime);
	console.log("getRataDie: rd is " +  (priorNewMoon + date.day - 1 + rdtime));
	*/
	
	this.rd = priorNewMoon + date.day - 1 + rdtime - ilib.Date.RataDie.gregorianEpoch;
};

/**
 * Return the rd number of the particular day of the week on or before the 
 * given rd. eg. The Sunday on or before the given rd.
 * @private
 * @param {number} rd the rata die date of the reference date
 * @param {number} dayOfWeek the day of the week that is being sought relative 
 * to the current date
 * @return {number} the rd of the day of the week
 */
ilib.Date.HanRataDie.prototype._onOrBefore = function(rd, dayOfWeek) {
	return rd - ilib.mod(Math.floor(rd) - dayOfWeek, 7);
};

/**
 * @class
 * 
 * Construct a new Han date object. The constructor parameters can 
 * contain any of the following properties:
 * 
 * <ul>
 * <li><i>unixtime<i> - sets the time of this instance according to the given 
 * unix time. Unix time is the number of milliseconds since midnight on Jan 1, 1970, Gregorian
 * 
 * <li><i>julianday</i> - sets the time of this instance according to the given
 * Julian Day instance or the Julian Day given as a float
 * 
 * <li><i>cycle</i> - any integer giving the number of 60-year cycle in which the date is located.
 * If the cycle is not given but the year is, it is assumed that the year parameter is a fictitious 
 * linear count of years since the beginning of the epoch, much like other calendars. This linear
 * count is never used. If both the cycle and year are given, the year is wrapped to the range 0 
 * to 60 and treated as if it were a year in the regular 60-year cycle.
 * 
 * <li><i>year</i> - any integer, including 0
 * 
 * <li><i>month</i> - 1 to 12, where 1 means Farvardin, 2 means Ordibehesht, etc.
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
 * of this han date. The date/time is kept in the local time. The time zone
 * is used later if this date is formatted according to a different time zone and
 * the difference has to be calculated, or when the date format has a time zone
 * component in it.
 * 
 * <li><i>locale</i> - locale for this han date. If the time zone is not 
 * given, it can be inferred from this locale. For locales that span multiple
 * time zones, the one with the largest population is chosen as the one that 
 * represents the locale.
 * 
 * <li><i>date</i> - use the given intrinsic Javascript date to initialize this one.
 * </ul>
 *
 * If the constructor is called with another Han date instance instead of
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
 * Depends directive: !depends handate.js
 * 
 * @constructor
 * @extends ilib.Date
 * @param {Object=} params parameters that govern the settings and behaviour of this Han date
 */
ilib.Date.HanDate = function(params) {
	this.timezone = "local";
	if (params) {
		if (params.locale) {
			this.locale = (typeof(params.locale) === 'string') ? new ilib.Locale(params.locale) : params.locale;
			var li = new ilib.LocaleInfo(this.locale);
			this.timezone = li.getTimeZone(); 
		}
		if (params.timezone) {
			this.timezone = params.timezone;
		}
	}
	
	new ilib.Cal.Han({
		sync: params && typeof(params) === 'boolean' ? params.sync : true,
		loadParams: params && params.loadParams,
		callback: ilib.bind(this, function (cal) {
			this.cal = cal;
	
			if (params && (params.year || params.month || params.day || params.hour ||
				params.minute || params.second || params.millisecond || params.cycle || params.cycleYear)) {
				if (typeof(params.cycle) !== 'undefined') {
					/**
					 * Cycle number in the Han calendar.
					 * @type number
					 */
					this.cycle = parseInt(params.cycle, 10) || 0;
					
					var year = (typeof(params.year) !== 'undefined' ? parseInt(params.year, 10) : parseInt(params.cycleYear, 10)) || 0;
					
					/**
					 * Year in the Han calendar.
					 * @type number
					 */
					this.year = ilib.Cal.Han._getElapsedYear(year, this.cycle);
				} else {
					if (typeof(params.year) !== 'undefined') {
						this.year = parseInt(params.year, 10) || 0;
						this.cycle = Math.floor((this.year - 1) / 60);
					} else {
						this.year = this.cycle = 0;
					}
				}	
				
				/**
				 * The month number, ranging from 1 to 13
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
			
				// derived properties
				
				/**
				 * Year in the cycle of the Han calendar
				 * @type number
				 */
				this.cycleYear = ilib.amod(this.year, 60); 

				/**
				 * The day of the year. Ranges from 1 to 384.
				 * @type number
				 */
				this.dayOfYear = parseInt(params.dayOfYear, 10);
	
				if (typeof(params.dst) === 'boolean') {
					this.dst = params.dst;
				}
				
				this.newRd({
					cal: this.cal,
					cycle: this.cycle,
					year: this.year,
					month: this.month,
					day: this.day,
					hour: this.hour,
					minute: this.minute,
					second: this.second,
					millisecond: this.millisecond,
					sync: params && typeof(params.sync) === 'boolean' ? params.sync : true,
					loadParams: params && params.loadParams,
					callback: ilib.bind(this, function (rd) {
						if (rd) {
							this.rd = rd;
							
							// add the time zone offset to the rd to convert to UTC
							if (!this.tz) {
								this.tz = new ilib.TimeZone({id: this.timezone});
							}
							// getOffsetMillis requires that this.year, this.rd, and this.dst 
							// are set in order to figure out which time zone rules apply and 
							// what the offset is at that point in the year
							this.offset = this.tz._getOffsetMillisWallTime(this) / 86400000;
							if (this.offset !== 0) {
								this.rd = this.newRd({
									cal: this.cal,
									rd: this.rd.getRataDie() - this.offset
								});
								this._calcLeap();
							} else {
								// re-use the derived properties from the RD calculations
								this.leapMonth = this.rd.leapMonth;
								this.priorLeapMonth = this.rd.priorLeapMonth;
								this.leapYear = this.rd.leapYear;
							}
						}
						
						if (!this.rd) {
							this.rd = this.newRd(ilib.merge(params || {}, {
								cal: this.cal
							}));
							this._calcDateComponents();
						}
						
						if (params && typeof(params.onLoad) === 'function') {
							params.onLoad(this);
						}
					})
				});
			} else {
				if (!this.rd) {
					this.rd = this.newRd(ilib.merge(params || {}, {
						cal: this.cal
					}));
					this._calcDateComponents();
				}
				
				if (params && typeof(params.onLoad) === 'function') {
					params.onLoad(this);
				}
			}
		})
	});

};

ilib.Date.HanDate.prototype = new ilib.Date({noinstance: true});
ilib.Date.HanDate.prototype.parent = ilib.Date;
ilib.Date.HanDate.prototype.constructor = ilib.Date.HanDate;

/**
 * Return a new RD for this date type using the given params.
 * @protected
 * @param {Object=} params the parameters used to create this rata die instance
 * @returns {ilib.Date.RataDie} the new RD instance for the given params
 */
ilib.Date.HanDate.prototype.newRd = function (params) {
	return new ilib.Date.HanRataDie(params);
};

/**
 * @protected
 * @static
 * @param {number} jd1 first julian day
 * @param {number} jd2 second julian day
 * @returns {boolean} true if there is a leap month earlier in the same year 
 * as the given months 
 */
ilib.Date.HanDate._priorLeapMonth = function(jd1, jd2) {
	return jd2 >= jd1 &&
		(ilib.Date.HanDate._priorLeapMonth(jd1, ilib.Cal.Han._newMoonBefore(jd2)) ||
				ilib.Cal.Han._noMajorST(jd2));
};

/**
 * Return the year for the given RD
 * @protected
 * @param {number} rd RD to calculate from 
 * @returns {number} the year for the RD
 */
ilib.Date.HanDate.prototype._calcYear = function(rd) {
	var gregdate = new ilib.Date.GregDate({
		rd: rd,
		timezone: this.timezone
	});
	var hanyear = gregdate.year + 2697;
	var newYears = this.cal.newYears(hanyear);
	return hanyear - ((rd + ilib.Date.RataDie.gregorianEpoch < newYears) ? 1 : 0);
};

/** 
 * @private 
 * Calculate the leap year and months from the RD.
 */
ilib.Date.HanDate.prototype._calcLeap = function() {
	var jd = this.rd.getRataDie() + ilib.Date.RataDie.gregorianEpoch;
	
	var calc = ilib.Cal.Han._leapYearCalc(this.year);
	var m2 = ilib.Cal.Han._newMoonOnOrAfter(calc.m1+1);
	this.leapYear = Math.round((calc.m2 - calc.m1) / 29.530588853000001) === 12;
	
	var newYears = (this.leapYear &&
		(ilib.Cal.Han._noMajorST(calc.m1) || ilib.Cal.Han._noMajorST(m2))) ?
				ilib.Cal.Han._newMoonOnOrAfter(m2+1) : m2;
	
	var m = ilib.Cal.Han._newMoonBefore(jd + 1);
	this.priorLeapMonth = ilib.Date.HanDate._priorLeapMonth(newYears, ilib.Cal.Han._newMoonBefore(m));
	this.leapMonth = (this.leapYear && ilib.Cal.Han._noMajorST(m) && !this.priorLeapMonth);
};

/**
 * @private
 * Calculate date components for the given RD date.
 */
ilib.Date.HanDate.prototype._calcDateComponents = function () {
	var remainder,
		jd = this.rd.getRataDie() + ilib.Date.RataDie.gregorianEpoch;

	// console.log("HanDate._calcDateComponents: calculating for jd " + jd);

	if (typeof(this.offset) === "undefined") {
		// now offset the jd by the time zone, then recalculate in case we were 
		// near the year boundary
		if (!this.tz) {
			this.tz = new ilib.TimeZone({id: this.timezone});
		}
		this.offset = this.tz.getOffsetMillis(this) / 86400000;
	}
	
	if (this.offset !== 0) {
		jd += this.offset;
	}

	// use the Gregorian calendar objects as a convenient way to short-cut some
	// of the date calculations
	
	var gregyear = ilib.Date.GregDate._calcYear(this.rd.getRataDie());
	this.year = gregyear + 2697;
	var calc = ilib.Cal.Han._leapYearCalc(this.year);
	var m2 = ilib.Cal.Han._newMoonOnOrAfter(calc.m1+1);
	this.leapYear = Math.round((calc.m2 - calc.m1) / 29.530588853000001) === 12;
	var newYears = (this.leapYear &&
		(ilib.Cal.Han._noMajorST(calc.m1) || ilib.Cal.Han._noMajorST(m2))) ?
				ilib.Cal.Han._newMoonOnOrAfter(m2+1) : m2;
	
	// See if it's between Jan 1 and the Chinese new years of that Gregorian year. If
	// so, then the Han year is actually the previous one
	if (jd < newYears) {
		this.year--;
		calc = ilib.Cal.Han._leapYearCalc(this.year);
		m2 = ilib.Cal.Han._newMoonOnOrAfter(calc.m1+1);
		this.leapYear = Math.round((calc.m2 - calc.m1) / 29.530588853000001) === 12;
		newYears = (this.leapYear &&
			(ilib.Cal.Han._noMajorST(calc.m1) || ilib.Cal.Han._noMajorST(m2))) ?
					ilib.Cal.Han._newMoonOnOrAfter(m2+1) : m2;
	}
	// month is elapsed month, not the month number + leap month boolean
	var m = ilib.Cal.Han._newMoonBefore(jd + 1);
	this.month = Math.round((m - calc.m1) / 29.530588853000001);
	
	this.priorLeapMonth = ilib.Date.HanDate._priorLeapMonth(newYears, ilib.Cal.Han._newMoonBefore(m));
	this.leapMonth = (this.leapYear && ilib.Cal.Han._noMajorST(m) && !this.priorLeapMonth);
	
	this.cycle = Math.floor((this.year - 1) / 60);
	this.cycleYear = ilib.amod(this.year, 60);
	this.day = ilib.Date._floorToJD(jd) - m + 1;

	/*
	console.log("HanDate._calcDateComponents: year is " + this.year);
	console.log("HanDate._calcDateComponents: isLeapYear is " + this.leapYear);
	console.log("HanDate._calcDateComponents: cycle is " + this.cycle);
	console.log("HanDate._calcDateComponents: cycleYear is " + this.cycleYear);
	console.log("HanDate._calcDateComponents: month is " + this.month);
	console.log("HanDate._calcDateComponents: isLeapMonth is " + this.leapMonth);
	console.log("HanDate._calcDateComponents: day is " + this.day);
	*/

	// floor to the start of the julian day
	remainder = jd - ilib.Date._floorToJD(jd);
	
	// console.log("HanDate._calcDateComponents: time remainder is " + remainder);
	
	// now convert to milliseconds for the rest of the calculation
	remainder = Math.round(remainder * 86400000);
	
	this.hour = Math.floor(remainder/3600000);
	remainder -= this.hour * 3600000;
	
	this.minute = Math.floor(remainder/60000);
	remainder -= this.minute * 60000;
	
	this.second = Math.floor(remainder/1000);
	remainder -= this.second * 1000;
	
	this.millisecond = remainder;
};

/**
 * Return the year within the Chinese cycle of this date. Cycles are 60 
 * years long, and the value returned from this method is the number of the year 
 * within this cycle. The year returned from getYear() is the total elapsed 
 * years since the beginning of the Chinese epoch and does not include 
 * the cycles. 
 * 
 * @return {number} the year within the current Chinese cycle
 */
ilib.Date.HanDate.prototype.getCycleYears = function() {
	return this.cycleYear;
};

/**
 * Return the Chinese cycle number of this date. Cycles are 60 years long,
 * and the value returned from getCycleYear() is the number of the year 
 * within this cycle. The year returned from getYear() is the total elapsed 
 * years since the beginning of the Chinese epoch and does not include 
 * the cycles. 
 * 
 * @return {number} the current Chinese cycle
 */
ilib.Date.HanDate.prototype.getCycles = function() {
	return this.cycle;
};

/**
 * Return whether the year of this date is a leap year in the Chinese Han 
 * calendar. 
 * 
 * @return {boolean} true if the year of this date is a leap year in the 
 * Chinese Han calendar. 
 */
ilib.Date.HanDate.prototype.isLeapYear = function() {
	return this.leapYear;
};

/**
 * Return whether the month of this date is a leap month in the Chinese Han 
 * calendar.
 * 
 * @return {boolean} true if the month of this date is a leap month in the 
 * Chinese Han calendar.
 */
ilib.Date.HanDate.prototype.isLeapMonth = function() {
	return this.leapMonth;
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 * 
 * @return {number} the day of the week
 */
ilib.Date.HanDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.rd.getRataDie() + (this.offset || 0));
	return ilib.mod(rd, 7);
};

/**
 * Return the ordinal day of the year. Days are counted from 1 and proceed linearly up to 
 * 365, regardless of months or weeks, etc. That is, Farvardin 1st is day 1, and 
 * December 31st is 365 in regular years, or 366 in leap years.
 * @return {number} the ordinal day of the year
 */
ilib.Date.HanDate.prototype.getDayOfYear = function() {
	var newYears = this.cal.newYears(this.year);
	var priorNewMoon = ilib.Cal.Han._newMoonOnOrAfter(newYears + (this.month -1) * 29);
	return priorNewMoon - newYears + this.day;
};

/**
 * Return the era for this date as a number. The value for the era for Han 
 * calendars is -1 for "before the han era" (BP) and 1 for "the han era" (anno 
 * persico or AP). 
 * BP dates are any date before Farvardin 1, 1 AP. In the proleptic Han calendar, 
 * there is a year 0, so any years that are negative or zero are BP.
 * @return {number} 1 if this date is in the common era, -1 if it is before the 
 * common era 
 */
ilib.Date.HanDate.prototype.getEra = function() {
	return (this.year < 1) ? -1 : 1;
};

/**
 * Return the name of the calendar that governs this date.
 * 
 * @return {string} a string giving the name of the calendar
 */
ilib.Date.HanDate.prototype.getCalendar = function() {
	return "han";
};

// register with the factory method
ilib.Date._constructors["han"] = ilib.Date.HanDate;
/*
 * ctype.js - Character type definitions
 * 
 * Copyright © 2012-2014, JEDLSoft
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

// !depends ilibglobal.js locale.js util/search.js

// !data ctype

/**
 * Provides a set of static routines that return information about characters.
 * These routines emulate the C-library ctype functions. The characters must be 
 * encoded in utf-16, as no other charsets are currently supported. Only the first
 * character of the given string is tested.
 * @namespace
 */
ilib.CType = {
	/**
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
	 * <li>Mn - Nonspacing_Mark
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
	 * @protected
	 * @param {number} num code point of the character to examine
	 * @param {string} rangeName the name of the range to check
	 * @param {Object} obj object containing the character range data
	 * @return {boolean} true if the first character is within the named
	 * range
	 */
	_inRange: function(num, rangeName, obj) {
		var range, i;
		if (num < 0 || !rangeName || !obj) {
			return false;
		}
		
		range = obj[rangeName];
		if (!range) {
			return false;
		}
		
		var compare = function(singlerange, target) {
			if (singlerange.length === 1) {
				return singlerange[0] - target;
			} else {
				return target < singlerange[0] ? singlerange[0] - target :
					(target > singlerange[1] ? singlerange[1] - target : 0);
			}
		};
		var result = ilib.bsearch(num, range, compare);
		return result < range.length && compare(range[result], num) === 0;
	},
	
	/**
	 * Return whether or not the first character is within the named range
	 * of Unicode characters. The valid list of range names are taken from 
	 * the Unicode 6.0 spec. Characters in all ranges of Unicode are supported,
	 * including those supported in Javascript via UTF-16. Currently, this method 
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
	 * @param {string|ilib.String|number} ch character or code point to examine
	 * @param {string} rangeName the name of the range to check
	 * @return {boolean} true if the first character is within the named
	 * range
	 */
	withinRange: function(ch, rangeName) {
		if (!rangeName) {
			return false;
		}
		var num;
		switch (typeof(ch)) {
			case 'number':
				num = ch;
				break;
			case 'string':
				num = ilib.String.toCodePoint(ch, 0);
				break;
			case 'undefined':
				return false;
			default:
				num = ch._toCodePoint(0);
				break;
		}

		return ilib.CType._inRange(num, rangeName.toLowerCase(), ilib.data.ctype);
	},
	
	/**
	 * @protected
	 * @param {boolean} sync
	 * @param {Object} loadParams
	 * @param {function(*)|undefined} onLoad
	 */
	_init: function(sync, loadParams, onLoad) {
		ilib.CType._load("ctype", sync, loadParams, onLoad);
	},
	
	/**
	 * @protected
	 * @param {string} name
	 * @param {boolean} sync
	 * @param {Object} loadParams
	 * @param {function(*)|undefined} onLoad
	 */
	_load: function (name, sync, loadParams, onLoad) {
		if (!ilib.data[name]) {
			var loadName = name ? name + ".json" : "ctype.json";
			ilib.loadData({
				name: loadName,
				locale: "-",
				nonlocale: true,
				sync: sync,
				loadParams: loadParams, 
				callback: /** @type function(Object=):undefined */ ilib.bind(this, /** @type function() */ function(ct) {
					ilib.data[name] = ct;
					if (onLoad && typeof(onLoad) === 'function') {
						onLoad(ilib.data[name]);
					}
				})
			});
		} else {
			if (onLoad && typeof(onLoad) === 'function') {
				onLoad(ilib.data[name]);
			}
		}
	}
};

/*
 * ctype.isdigit.js - Character type is digit
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

// !depends ctype.js

// !data ctype

/**
 * Return whether or not the first character is a digit character in the
 * Latin script.<p>
 * 
 * Depends directive: !depends ctype.isdigit.js
 * 
 * @param {string|ilib.String|number} ch character or code point to examine
 * @return {boolean} true if the first character is a digit character in the
 * Latin script. 
 */
ilib.CType.isDigit = function (ch) {
	var num;
	switch (typeof(ch)) {
		case 'number':
			num = ch;
			break;
		case 'string':
			num = ilib.String.toCodePoint(ch, 0);
			break;
		case 'undefined':
			return false;
		default:
			num = ch._toCodePoint(0);
			break;
	}
	return ilib.CType._inRange(num, 'digit', ilib.data.ctype);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
 */
ilib.CType.isDigit._init = function (sync, loadParams, onLoad) {
	ilib.CType._init(sync, loadParams, onLoad);
};

/*
 * ctype.isspace.js - Character type is space char
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

// !depends ctype.js

// !data ctype ctype_z

/**
 * Return whether or not the first character is a whitespace character.<p>
 * 
 * Depends directive: !depends ctype.isspace.js
 * 
 * @param {string|ilib.String|number} ch character or code point to examine
 * @return {boolean} true if the first character is a whitespace character.
 */
ilib.CType.isSpace = function (ch) {
	var num;
	switch (typeof(ch)) {
		case 'number':
			num = ch;
			break;
		case 'string':
			num = ilib.String.toCodePoint(ch, 0);
			break;
		case 'undefined':
			return false;
		default:
			num = ch._toCodePoint(0);
			break;
	}

	return ilib.CType._inRange(num, 'space', ilib.data.ctype) ||
		ilib.CType._inRange(num, 'Zs', ilib.data.ctype_z) ||
		ilib.CType._inRange(num, 'Zl', ilib.data.ctype_z) ||
		ilib.CType._inRange(num, 'Zp', ilib.data.ctype_z);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
 */
ilib.CType.isSpace._init = function (sync, loadParams, onLoad) {
	ilib.CType._load("ctype_z", sync, loadParams, function () {
		ilib.CType._init(sync, loadParams, onLoad);
	});
};

/*
 * numprs.js - Parse a number in any locale
 * 
 * Copyright © 2012-2014, JEDLSoft
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
 * <p>
 * 
 * Depends directive: !depends numprs.js
 * 
 * @constructor
 * @param {string|number|Number|ilib.Number|undefined} str a string to parse as a number, or a number value
 * @param {Object=} options Options controlling how the instance should be created 
 */
ilib.Number = function (str, options) {
	var i, stripped = "", 
		sync = true,
		loadParams,
		onLoad;
	
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
		loadParams = options.loadParams;
		onLoad = options.onLoad;
	}
	
	ilib.CType.isDigit._init(sync, loadParams, /** @type {function()|undefined} */ ilib.bind(this, function() {
		ilib.CType.isSpace._init(sync, loadParams, /** @type {function()|undefined} */ ilib.bind(this, function() {
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
		}));
	}));
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

/*
 * currency.js - Currency definition
 * 
 * Copyright © 2012-2014, JEDLSoft
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
 * <li><i>sync</i> - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while.
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
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
	this.sync = true;
	
	if (options) {
		if (options.code) {
			this.code = options.code;
		}
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		if (options.sign) {
			this.sign = options.sign;
		}
		if (typeof(options.sync) !== 'undefined') {
			this.sync = options.sync;
		}
		if (options.loadParams) {
			this.loadParams = options.loadParams;
		}
	}
	
	this.locale = this.locale || new ilib.Locale();
	if (typeof(ilib.data.currency) === 'undefined') {
		ilib.loadData({
			name: "currency.json",
			object: ilib.Currency, 
			locale: "-",
			sync: this.sync, 
			loadParams: this.loadParams, 
			callback: /** @type function(Object=):undefined */ ilib.bind(this, /** @type function() */ function(currency) {
				ilib.data.currency = currency;
				this._loadLocinfo(options && options.onLoad);
			})
		});
	} else {
		this._loadLocinfo(options && options.onLoad);
	}
};

/**
 * Return an array of the ids for all ISO 4217 currencies that
 * this copy of ilib knows about.
 * 
 * @static
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
	 * @private
	 */
	_loadLocinfo: function(onLoad) {
		new ilib.LocaleInfo(this.locale, {
			onLoad: ilib.bind(this, function (li) {
				var currInfo;
				
				this.locinfo = li;
		    	if (this.code) {
		    		currInfo = ilib.data.currency[this.code];
		    		if (!currInfo) {
		    			throw "currency " + this.code + " is unknown";
		    		}
		    	} else if (this.sign) {
		    		currInfo = ilib.data.currency[this.sign]; // maybe it is really a code...
		    		if (typeof(currInfo) !== 'undefined') {
		    			this.code = this.sign;
		    		} else {
		    			this.code = this.locinfo.getCurrency();
		    			currInfo = ilib.data.currency[this.code];
		    			if (currInfo.sign !== this.sign) {
		    				// current locale does not use the sign, so search for it
		    				for (var cur in ilib.data.currency) {
		    					if (cur && ilib.data.currency[cur]) {
		    						currInfo = ilib.data.currency[cur];
		    						if (currInfo.sign === this.sign) {
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
		    		currInfo = ilib.data.currency[this.code];
		    	}
		    	
		    	this.name = currInfo.name;
		    	this.fractionDigits = currInfo.decimals;
		    	this.sign = currInfo.sign;
		    	
				if (typeof(onLoad) === 'function') {
					onLoad(this);
				}
			})
		});
	},
	
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
 * Copyright © 2012-2014, JEDLSoft
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
util/math.js
currency.js
strings.js
util/jsutils.js
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
 * <li><i>useNative</i> - the flag used to determaine whether to use the native script settings
 * for formatting the numbers .
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
 * When the type of this formatter is "number", the style can be one of the following:
 * <ul>
 *   <li><i>standard - format a fully specified floating point number properly for the locale
 *   <li><i>scientific</i> - use scientific notation for all numbers. That is, 1 integral 
 *   digit, followed by a number of fractional digits, followed by an "e" which denotes 
 *   exponentiation, followed digits which give the power of 10 in the exponent. 
 *   <li><i>native</i> - format a floating point number using the native digits and 
 *   formatting symbols for the script of the locale. 
 *   <li><i>nogrouping</i> - format a floating point number without grouping digits for
 *   the integral portion of the number
 * </ul>
 * Note that if you specify a maximum number
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
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
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
	/** 
	 * @private
	 * @type {string} 
	 */
	this.type = "number";
	var loadParams = undefined;

	if (options) {
		if (options.locale) {
			this.locale = (typeof (options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}

		if (options.type) {
			if (options.type === 'number' ||
				options.type === 'currency' ||
				options.type === 'percentage') {
				this.type = options.type;
			}
		}

		if (options.currency) {
			/** 
			 * @private 
			 * @type {string} 
			 */
			this.currency = options.currency;
		}

		if (typeof (options.maxFractionDigits) === 'number') {
			/** 
			 * @private 
			 * @type {number|undefined} 
			 */
			this.maxFractionDigits = this._toPrimitive(options.maxFractionDigits);
		}
		if (typeof (options.minFractionDigits) === 'number') {
			/** 
			 * @private 
			 * @type {number|undefined} 
			 */
			this.minFractionDigits = this._toPrimitive(options.minFractionDigits);
			// enforce the limits to avoid JS exceptions
			if (this.minFractionDigits < 0) {
				this.minFractionDigits = 0;
			}
			if (this.minFractionDigits > 20) {
				this.minFractionDigits = 20;
			}
		}
		if (options.style) {
			/** 
			 * @private 
			 * @type {string} 
			 */
			this.style = options.style;
		}
		if (typeof(options.useNative) === 'boolean') {
			/** 
			 * @private 
			 * @type {boolean} 
			 * */
			this.useNative = options.useNative;
		}
		/** 
		 * @private 
		 * @type {string} 
		 */
		this.roundingMode = options.roundingMode;

		if (typeof (options.sync) !== 'undefined') {
			/** @type {boolean} */
			sync = (options.sync == true);
		}
		
		loadParams = options.loadParams;
	}

	/** 
	 * @private 
	 * @type {ilib.LocaleInfo|undefined} 
	 */
	this.localeInfo = undefined;
	
	new ilib.LocaleInfo(this.locale, {
		sync: sync,
		loadParams: loadParams,
		onLoad: ilib.bind(this, function (li) {
			/** 
			 * @private 
			 * @type {ilib.LocaleInfo|undefined} 
			 */
			this.localeInfo = li;

			if (this.type === "number") {
				this.templateNegative = new ilib.String(this.localeInfo.getNegativeNumberFormat() || "-{n}");
			} else if (this.type === "currency") {
				var templates;

				if (!this.currency || typeof (this.currency) != 'string') {
					throw "A currency property is required in the options to the number formatter constructor when the type property is set to currency.";
				}

				new ilib.Currency({
					locale: this.locale,
					code: this.currency,
					sync: sync,
					loadParams: loadParams,
					onLoad: ilib.bind(this, function (cur) {
						this.currencyInfo = cur;
						if (this.style !== "common" && this.style !== "iso") {
							this.style = "common";
						}
						
						if (typeof(this.maxFractionDigits) !== 'number' && typeof(this.minFractionDigits) !== 'number') {
							this.minFractionDigits = this.maxFractionDigits = this.currencyInfo.getFractionDigits();
						}

						templates = this.localeInfo.getCurrencyFormats();
						this.template = new ilib.String(templates[this.style] || templates.common);
						this.templateNegative = new ilib.String(templates[this.style + "Negative"] || templates["commonNegative"]);
						this.sign = (this.style === "iso") ? this.currencyInfo.getCode() : this.currencyInfo.getSign();
						
						if (!this.roundingMode) {
							this.roundingMode = this.currencyInfo && this.currencyInfo.roundingMode;
						}

						this._init();

						if (options && typeof (options.onLoad) === 'function') {
							options.onLoad(this);
						}
					})
				});
				return;
			} else if (this.type === "percentage") {
				this.template =  new ilib.String(this.localeInfo.getPercentageFormat() || "{n}%");
				this.templateNegative = new ilib.String(this.localeInfo.getNegativePercentageFormat() || this.localeInfo.getNegativeNumberFormat() + "%");
			}

			this._init();

			if (options && typeof (options.onLoad) === 'function') {
				options.onLoad(this);
			}
		})
	});
};

/**
 * Return an array of available locales that this formatter can format
 * @static
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
	 * Return true if this formatter uses native digits to format the number. If the useNative
	 * option is given to the constructor, then this flag will be honoured. If the useNative
	 * option is not given to the constructor, this this formatter will use native digits if
	 * the locale typically uses native digits.
	 * 
	 *  @return {boolean} true if this formatter will format with native digits, false otherwise
	 */
	getUseNative: function() {
		if (typeof(this.useNative) === "boolean") {
			return this.useNative;
		} 
		return (this.localeInfo.getDigitsStyle() === "native");
	},
	
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
		
		if (this.style === "nogrouping") {
			this.prigroupSize = this.secgroupSize = 0;
		} else {
			this.prigroupSize = this.localeInfo.getPrimaryGroupingDigits();
			this.secgroupSize = this.localeInfo.getSecondaryGroupingDigits();
			this.groupingSeparator = this.getUseNative() ? this.localeInfo.getNativeGroupingSeparator() : this.localeInfo.getGroupingSeparator();
		} 
		this.decimalSeparator = this.getUseNative() ? this.localeInfo.getNativeDecimalSeparator() : this.localeInfo.getDecimalSeparator();
		
		if (this.getUseNative()) {
			var nd = this.localeInfo.getNativeDigits() || this.localeInfo.getDigits();
			if (nd) {
				this.digits = nd.split("");
			}
		}
		
		this.exponentSymbol = this.localeInfo.getExponential() || "e";
	},

	/*
	 * @private
	 */
	_pad: function (str, length, left) {
		return (str.length >= length) ?
			str :
			(left ?
			ilib.NumFmt.zeros.substring(0, length - str.length) + str :
			str + ilib.NumFmt.zeros.substring(0, length - str.length));
	},

	/**
	 * @private
	 * @param {Number|ilib.Number|string|number} num object, string, or number to convert to a primitive number
	 * @return {number} the primitive number equivalent of the argument
	 */
	_toPrimitive: function (num) {
		var n = 0;

		switch (typeof (num)) {
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
	 * Format the number using scientific notation as a positive number. Negative
	 * formatting to be applied later.
	 * @private
	 * @param {number} num the number to format
	 * @return {string} the formatted number
	 */
	_formatScientific: function (num) {
		var n = new Number(num);
		var formatted;
		
		var factor,
			str = n.toExponential(),
			parts = str.split("e"),
			significant = parts[0],
			exponent = parts[1],
			numparts,
			integral,
			fraction;

		if (this.maxFractionDigits > 0) {
			// if there is a max fraction digits setting, round the fraction to 
			// the right length first by dividing or multiplying by powers of 10. 
			// manipulate the fraction digits so as to
			// avoid the rounding errors of floating point numbers
			factor = Math.pow(10, this.maxFractionDigits);
			significant = this.round(significant * factor) / factor;
		}
		numparts = ("" + significant).split(".");
		integral = numparts[0];
		fraction = numparts[1];
		
		if (typeof(this.maxFractionDigits) !== 'undefined') {
			fraction = fraction.substring(0, this.maxFractionDigits);
		}
		if (typeof(this.minFractionDigits) !== 'undefined') {
			fraction = this._pad(fraction || "", this.minFractionDigits, false);
		}
		formatted = integral;
		if (fraction.length) {
			formatted += this.decimalSeparator + fraction;	
		} 
		formatted += this.exponentSymbol + exponent;
		return formatted;
	},

	/**
	 * Formats the number as a positive number. Negative formatting to be applied later.
	 * @private
	 * @param {number} num the number to format
	 * @return {string} the formatted number
	 */
	_formatStandard: function (num) {
		var i;
		var k;
		
		if (typeof(this.maxFractionDigits) !== 'undefined' && this.maxFractionDigits > -1) {
			var factor = Math.pow(10, this.maxFractionDigits);
			num = this.round(num * factor) / factor;
		}

		num = Math.abs(num);

		var parts = ("" + num).split("."),
			integral = parts[0],
			fraction = parts[1],
			cycle,
			formatted;
		
		integral = integral.toString();

		if (this.minFractionDigits > 0) {
			fraction = this._pad(fraction || "", this.minFractionDigits, false);
		}

		if (this.secgroupSize > 0) {
			if (integral.length > this.prigroupSize) {
				var size1 = this.prigroupSize;
				var size2 = integral.length;
				var size3 = size2 - size1;
				integral = integral.slice(0, size3) + this.groupingSeparator + integral.slice(size3);
				var num_sec = integral.substring(0, integral.indexOf(this.groupingSeparator));
				k = num_sec.length;
				while (k > this.secgroupSize) {
					var secsize1 = this.secgroupSize;
					var secsize2 = num_sec.length;
					var secsize3 = secsize2 - secsize1;
					integral = integral.slice(0, secsize3) + this.groupingSeparator + integral.slice(secsize3);
					num_sec = integral.substring(0, integral.indexOf(this.groupingSeparator));
					k = num_sec.length;
				}
			}

			formatted = integral;
		} else if (this.prigroupSize !== 0) {
			cycle = ilib.mod(integral.length - 1, this.prigroupSize);

			formatted = "";

			for (i = 0; i < integral.length - 1; i++) {
				formatted += integral.charAt(i);
				if (cycle === 0) {
					formatted += this.groupingSeparator;
				}
				cycle = ilib.mod(cycle - 1, this.prigroupSize);
			}
			formatted += integral.charAt(integral.length - 1);
		} else {
			formatted = integral;
		}

		if (fraction && (typeof(this.maxFractionDigits) === 'undefined' || this.maxFractionDigits > 0)) {
			formatted += this.decimalSeparator;
			formatted += fraction;
		}
		
		if (this.digits) {
			formatted = ilib.mapString(formatted, this.digits);
		}
		
		return formatted;
	},

	/**
	 * Format a number according to the settings of this number formatter instance.
	 * @param num {number|string|Number|ilib.Number} a floating point number to format
	 * @return {string} a string containing the formatted number
	 */
	format: function (num) {
		var formatted, n;

		if (typeof (num) === 'undefined') {
			return "";
		}

		// convert to a real primitive number type
		n = this._toPrimitive(num);

		if (this.type === "number") {
			formatted = (this.style === "scientific") ?
				this._formatScientific(n) :
				this._formatStandard(n);

			if (num < 0) {
				formatted = this.templateNegative.format({n: formatted});
			}
		} else {
			formatted = this._formatStandard(n);
			var template = (n < 0) ? this.templateNegative : this.template;
			formatted = template.format({
				n: formatted,
				s: this.sign
			});
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
		return (this.groupingSeparator !== 'undefined' && this.groupingSeparator.length > 0);
	},

	/**
	 * Returns the maximum fraction digits set up in the constructor.
	 *
	 * @return {number} the maximum number of fractional digits this
	 * formatter will format, or -1 for no maximum
	 */
	getMaxFractionDigits: function () {
		return typeof (this.maxFractionDigits) !== 'undefined' ? this.maxFractionDigits : -1;
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
		return typeof (this.minFractionDigits) !== 'undefined' ? this.minFractionDigits : -1;
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
 * Copyright © 2012-2014, JEDLSoft
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
util/jsutils.js
*/

// !data dateformats sysres
// !resbundle sysres

/**
 * @class
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
 *<li><i>useNative</i> - the flag used to determaine whether to use the native script settings 
 * for formatting the numbers .
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
 *  
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
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
	var loadParams = undefined;
	
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
		
		if (typeof(options.useNative) === 'boolean') {
			this.useNative = options.useNative;
		}
		
		loadParams = options.loadParams;
	}
	
	new ilib.ResBundle({
		locale: this.locale,
		name: "sysres",
		sync: sync,
		loadParams: loadParams,
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
					loadParams: loadParams,
					useNative: this.useNative,
					onLoad: ilib.bind(this, function (fmtMS) {
						this.timeFmtMS = fmtMS;
						new ilib.DateFmt({
							locale: this.locale,
							type: "time",
							time: "hm",
							sync: sync,
							loadParams: loadParams,
							useNative: this.useNative,
							onLoad: ilib.bind(this, function (fmtHM) {
								this.timeFmtHM = fmtHM;		
								new ilib.DateFmt({
									locale: this.locale,
									type: "time",
									time: "hms",
									sync: sync,
									loadParams: loadParams,
									useNative: this.useNative,
									onLoad: ilib.bind(this, function (fmtHMS) {
										this.timeFmtHMS = fmtHMS;		

										// munge with the template to make sure that the hours are not formatted mod 12
										this.timeFmtHM.template = this.timeFmtHM.template.replace(/hh?/, 'H');
										this.timeFmtHM.templateArr = this.timeFmtHM._tokenize(this.timeFmtHM.template);
										this.timeFmtHMS.template = this.timeFmtHMS.template.replace(/hh?/, 'H');
										this.timeFmtHMS.templateArr = this.timeFmtHMS._tokenize(this.timeFmtHMS.template);
										
										this._init(this.timeFmtHM.locinfo, options && options.onLoad);
									})
								});
							})
						});
					})
				});
				return;
			}

			new ilib.LocaleInfo(this.locale, {
				sync: sync,
				loadParams: loadParams,
				onLoad: ilib.bind(this, function (li) {
					this._init(li, options && options.onLoad);
				})
			});
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
 * @private
 */
ilib.DurFmt.prototype._mapDigits = function(str) {
	if (this.useNative && this.digits) {
		return ilib.mapString(str.toString(), this.digits);
	}
	return str;
};

/**
 * @private
 * @param {ilib.LocaleInfo} locinfo
 * @param {function(ilib.DurFmt)|undefined} onLoad
 */
ilib.DurFmt.prototype._init = function(locinfo, onLoad) {
	var digits;
	if (typeof(this.useNative) === 'boolean') {
		// if the caller explicitly said to use native or not, honour that despite what the locale data says...
		if (this.useNative) {
			digits = locinfo.getNativeDigits();
			if (digits) {
				this.digits = digits;
			}
		}
	} else if (locinfo.getDigitsStyle() === "native") {
		// else if the locale usually uses native digits, then use them 
		digits = locinfo.getNativeDigits();
		if (digits) {
			this.useNative = true;
			this.digits = digits;
		}
	} // else use western digits always

	if (typeof(onLoad) === 'function') {
		onLoad(this);
	}
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
			str = this.components[list[i]].formatChoice(components[list[i]], {num: this._mapDigits(components[list[i]])}) + str;
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

/*
 * ctype.islpha.js - Character type is alphabetic
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

// !depends ctype.js

// !data ctype_l

/**
 * Return whether or not the first character is alphabetic.<p>
 * 
 * Depends directive: !depends ctype.isalnum.js
 * 
 * @param {string|ilib.String|number} ch character or code point to examine
 * @return {boolean} true if the first character is alphabetic.
 */
ilib.CType.isAlpha = function (ch) {
	var num;
	switch (typeof(ch)) {
		case 'number':
			num = ch;
			break;
		case 'string':
			num = ilib.String.toCodePoint(ch, 0);
			break;
		case 'undefined':
			return false;
		default:
			num = ch._toCodePoint(0);
			break;
	}
	return ilib.CType._inRange(num, 'Lu', ilib.data.ctype_l) ||
		ilib.CType._inRange(num, 'Ll', ilib.data.ctype_l) ||
		ilib.CType._inRange(num, 'Lt', ilib.data.ctype_l) ||
		ilib.CType._inRange(num, 'Lm', ilib.data.ctype_l) ||
		ilib.CType._inRange(num, 'Lo', ilib.data.ctype_l);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
 */
ilib.CType.isAlpha._init = function (sync, loadParams, onLoad) {
	ilib.CType._load("ctype_l", sync, loadParams, onLoad);
};



/*
 * ctype.isalnum.js - Character type alphanumeric
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

// !depends ctype.js ctype.isalpha.js ctype.isdigit.js

/**
 * Return whether or not the first character is alphabetic or numeric.<p>
 * 
 * Depends directive: !depends ctype.isalnum.js
 * 
 * @param {string|ilib.String|number} ch character or code point to examine
 * @return {boolean} true if the first character is alphabetic or numeric
 */
ilib.CType.isAlnum = function isAlnum(ch) {
	var num;
	switch (typeof(ch)) {
		case 'number':
			num = ch;
			break;
		case 'string':
			num = ilib.String.toCodePoint(ch, 0);
			break;
		case 'undefined':
			return false;
		default:
			num = ch._toCodePoint(0);
			break;
	}
	return ilib.CType.isAlpha(num) || ilib.CType.isDigit(num);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
 */
ilib.CType.isAlnum._init = function (sync, loadParams, onLoad) {
	ilib.CType.isAlpha._init(sync, loadParams, function () {
		ilib.CType.isDigit._init(sync, loadParams, onLoad);
	});
};

/*
 * ctype.isascii.js - Character type is ASCII
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

// !depends ctype.js

// !data ctype

/**
 * Return whether or not the first character is in the ASCII range.<p>
 * 
 * Depends directive: !depends ctype.isascii.js
 * 
 * @param {string|ilib.String|number} ch character or code point to examine
 * @return {boolean} true if the first character is in the ASCII range.
 */
ilib.CType.isAscii = function (ch) {
	var num;
	switch (typeof(ch)) {
		case 'number':
			num = ch;
			break;
		case 'string':
			num = ilib.String.toCodePoint(ch, 0);
			break;
		case 'undefined':
			return false;
		default:
			num = ch._toCodePoint(0);
			break;
	}
	return ilib.CType._inRange(num, 'ascii', ilib.data.ctype);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
 */
ilib.CType.isAscii._init = function (sync, loadParams, onLoad) {
	ilib.CType._init(sync, loadParams, onLoad);
};

/*
 * ctype.isblank.js - Character type is blank
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

// !depends ctype.js

// !data ctype

/**
 * Return whether or not the first character is a blank character.<p>
 * 
 * Depends directive: !depends ctype.isblank.js
 * 
 * ie. a space or a tab.
 * @param {string|ilib.String|number} ch character or code point to examine
 * @return {boolean} true if the first character is a blank character.
 */
ilib.CType.isBlank = function (ch) {
	var num;
	switch (typeof(ch)) {
		case 'number':
			num = ch;
			break;
		case 'string':
			num = ilib.String.toCodePoint(ch, 0);
			break;
		case 'undefined':
			return false;
		default:
			num = ch._toCodePoint(0);
			break;
	}
	return ilib.CType._inRange(num, 'blank', ilib.data.ctype);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
 */
ilib.CType.isBlank._init = function (sync, loadParams, onLoad) {
	ilib.CType._init(sync, loadParams, onLoad);
};

/*
 * ctype.iscntrl.js - Character type is control character
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

// !depends ctype.js

// !data ctype_c

/**
 * Return whether or not the first character is a control character.<p>
 * 
 * Depends directive: !depends ctype.iscntrl.js
 * 
 * @param {string|ilib.String|number} ch character or code point to examine
 * @return {boolean} true if the first character is a control character.
 */
ilib.CType.isCntrl = function (ch) {
	var num;
	switch (typeof(ch)) {
		case 'number':
			num = ch;
			break;
		case 'string':
			num = ilib.String.toCodePoint(ch, 0);
			break;
		case 'undefined':
			return false;
		default:
			num = ch._toCodePoint(0);
			break;
	}
	return ilib.CType._inRange(num, 'Cc', ilib.data.ctype_c);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
 */
ilib.CType.isCntrl._init = function (sync, loadParams, onLoad) {
	ilib.CType._load("ctype_c", sync, loadParams, onLoad);
};

/*
 * ctype.isgraph.js - Character type is graph char
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

// !depends ctype.js ctype.isspace.js ctype.iscntrl.js

/**
 * Return whether or not the first character is any printable character
 * other than space.<p>
 * 
 * Depends directive: !depends ctype.isgraph.js
 * 
 * @param {string|ilib.String|number} ch character or code point to examine
 * @return {boolean} true if the first character is any printable character
 * other than space. 
 */
ilib.CType.isGraph = function (ch) {
	var num;
	switch (typeof(ch)) {
		case 'number':
			num = ch;
			break;
		case 'string':
			num = ilib.String.toCodePoint(ch, 0);
			break;
		case 'undefined':
			return false;
		default:
			num = ch._toCodePoint(0);
			break;
	}
	return typeof(ch) !== 'undefined' && ch.length > 0 && !ilib.CType.isSpace(num) && !ilib.CType.isCntrl(num);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
 */
ilib.CType.isGraph._init = function (sync, loadParams, onLoad) {
	ilib.CType.isSpace._init(sync, loadParams, function () {
		ilib.CType.isCntrl._init(sync, loadParams, onLoad);
	});
};

/*
 * ctype.js - Character type definitions
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

// !depends ctype.js

// !data ctype

/**
 * Return whether or not the first character is an ideographic character.<p>
 * 
 * Depends directive: !depends ctype.isideo.js
 * 
 * @param {string|ilib.String|number} ch character or code point to examine
 * @return {boolean} true if the first character is an ideographic character.
 */
ilib.CType.isIdeo = function (ch) {
	var num;
	switch (typeof(ch)) {
		case 'number':
			num = ch;
			break;
		case 'string':
			num = ilib.String.toCodePoint(ch, 0);
			break;
		case 'undefined':
			return false;
		default:
			num = ch._toCodePoint(0);
			break;
	}

	return ilib.CType._inRange(num, 'cjk', ilib.data.ctype) ||
		ilib.CType._inRange(num, 'cjkradicals', ilib.data.ctype) ||
		ilib.CType._inRange(num, 'enclosedcjk', ilib.data.ctype) ||
		ilib.CType._inRange(num, 'cjkpunct', ilib.data.ctype) ||
		ilib.CType._inRange(num, 'cjkcompatibility', ilib.data.ctype);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
 */
ilib.CType.isIdeo._init = function (sync, loadParams, onLoad) {
	ilib.CType._init(sync, loadParams, onLoad);
};

/*
 * ctype.islower.js - Character type is lower case letter
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

// !depends ctype.js

// !data ctype_l

/**
 * Return whether or not the first character is lower-case. For alphabetic
 * characters in scripts that do not make a distinction between upper- and 
 * lower-case, this function always returns true.<p>
 * 
 * Depends directive: !depends ctype.islower.js
 * 
 * @param {string|ilib.String|number} ch character or code point to examine
 * @return {boolean} true if the first character is lower-case.
 */
ilib.CType.isLower = function (ch) {
	var num;
	switch (typeof(ch)) {
		case 'number':
			num = ch;
			break;
		case 'string':
			num = ilib.String.toCodePoint(ch, 0);
			break;
		case 'undefined':
			return false;
		default:
			num = ch._toCodePoint(0);
			break;
	}

	return ilib.CType._inRange(num, 'Ll', ilib.data.ctype_l);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
 */
ilib.CType.isLower._init = function (sync, loadParams, onLoad) {
	ilib.CType._load("ctype_l", sync, loadParams, onLoad);
};

/*
 * ctype.isprint.js - Character type is printable char
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

// !depends ctype.js ctype.iscntrl.js

/**
 * Return whether or not the first character is any printable character,
 * including space.<p>
 * 
 * Depends directive: !depends ctype.isprint.js
 * 
 * @param {string|ilib.String|number} ch character or code point to examine
 * @return {boolean} true if the first character is printable.
 */
ilib.CType.isPrint = function (ch) {
	return typeof(ch) !== 'undefined' && ch.length > 0 && !ilib.CType.isCntrl(ch);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
 */
ilib.CType.isPrint._init = function (sync, loadParams, onLoad) {
	ilib.CType.isCntrl._init(sync, loadParams, onLoad);
};

/*
 * ctype.ispunct.js - Character type is punctuation
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

// !depends ctype.js

// !data ctype_p

/**
 * Return whether or not the first character is punctuation.<p>
 * 
 * Depends directive: !depends ctype.isprint.js
 * 
 * @param {string|ilib.String|number} ch character or code point to examine
 * @return {boolean} true if the first character is punctuation.
 */
ilib.CType.isPunct = function (ch) {
	var num;
	switch (typeof(ch)) {
		case 'number':
			num = ch;
			break;
		case 'string':
			num = ilib.String.toCodePoint(ch, 0);
			break;
		case 'undefined':
			return false;
		default:
			num = ch._toCodePoint(0);
			break;
	}

	return ilib.CType._inRange(num, 'Pd', ilib.data.ctype_p) ||
		ilib.CType._inRange(num, 'Ps', ilib.data.ctype_p) ||
		ilib.CType._inRange(num, 'Pe', ilib.data.ctype_p) ||
		ilib.CType._inRange(num, 'Pc', ilib.data.ctype_p) ||
		ilib.CType._inRange(num, 'Po', ilib.data.ctype_p) ||
		ilib.CType._inRange(num, 'Pi', ilib.data.ctype_p) ||
		ilib.CType._inRange(num, 'Pf', ilib.data.ctype_p);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
 */
ilib.CType.isPunct._init = function (sync, loadParams, onLoad) {
	ilib.CType._load("ctype_p", sync, loadParams, onLoad);
};

/*
 * ctype.isupper.js - Character type is upper-case letter
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

// !depends ctype.js

// !data ctype_l

/**
 * Return whether or not the first character is upper-case. For alphabetic
 * characters in scripts that do not make a distinction between upper- and 
 * lower-case, this function always returns true.<p>
 * 
 * Depends directive: !depends ctype.isupper.js
 * 
 * @param {string|ilib.String|number} ch character or code point to examine
 * @return {boolean} true if the first character is upper-case.
 */
ilib.CType.isUpper = function (ch) {
	var num;
	switch (typeof(ch)) {
		case 'number':
			num = ch;
			break;
		case 'string':
			num = ilib.String.toCodePoint(ch, 0);
			break;
		case 'undefined':
			return false;
		default:
			num = ch._toCodePoint(0);
			break;
	}

	return ilib.CType._inRange(num, 'Lu', ilib.data.ctype_l);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
 */
ilib.CType.isUpper._init = function (sync, loadParams, onLoad) {
	ilib.CType._load("ctype_l", sync, loadParams, onLoad);
};

/*
 * ctype.isdigit.js - Character type is digit
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

// !depends ctype.js

// !data ctype

/**
 * Return whether or not the first character is a hexadecimal digit written
 * in the Latin script. (0-9 or A-F)<p>
 * 
 * Depends directive: !depends ctype.isxdigit.js
 * 
 * @param {string|ilib.String|number} ch character or code point to examine
 * @return {boolean} true if the first character is a hexadecimal digit written
 * in the Latin script.
 */
ilib.CType.isXdigit = function (ch) {
	var num;
	switch (typeof(ch)) {
		case 'number':
			num = ch;
			break;
		case 'string':
			num = ilib.String.toCodePoint(ch, 0);
			break;
		case 'undefined':
			return false;
		default:
			num = ch._toCodePoint(0);
			break;
	}

	return ilib.CType._inRange(num, 'xdigit', ilib.data.ctype);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
 */
ilib.CType.isXdigit._init = function (sync, loadParams, onLoad) {
	ilib.CType._init(sync, loadParams, onLoad);
};

/*
 * ctype.isscript.js - Character type is script
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

// !depends ctype.js

// !data scriptToRange

/**
 * Return whether or not the first character in the given string is 
 * in the given script. The script is given as the 4-letter ISO
 * 15924 script code.<p>
 * 
 * Depends directive: !depends ctype.isscript.js
 * 
 * @param {string|ilib.String|number} ch character or code point to examine
 * @param {string} script the 4-letter ISO 15924 to query against
 * @return {boolean} true if the first character is in the given script, and
 * false otherwise
 */
ilib.CType.isScript = function (ch, script) {
	var num;
	switch (typeof(ch)) {
		case 'number':
			num = ch;
			break;
		case 'string':
			num = ilib.String.toCodePoint(ch, 0);
			break;
		case 'undefined':
			return false;
		default:
			num = ch._toCodePoint(0);
			break;
	}

	return ilib.CType._inRange(num, script, ilib.data.scriptToRange);
};

/**
 * @protected
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
 */
ilib.CType.isScript._init = function (sync, loadParams, onLoad) {
	ilib.CType._load("scriptToRange", sync, loadParams, onLoad);
};


/*
 * scriptinfo.js - information about scripts
 * 
 * Copyright © 2012-2014, JEDLSoft
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

// !data scripts

/**
 * @class
 * Create a new script info instance. This class encodes information about
 * scripts, which are sets of characters used in a writing system.<p>
 * 
 * The options object may contain any of the following properties:
 * 
 * <ul>
 * <li><i>onLoad</i> - a callback function to call when the script info object is fully 
 * loaded. When the onLoad option is given, the script info object will attempt to
 * load any missing locale data using the ilib loader callback.
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
 * Depends directive: !depends scriptinfo.js
 * 
 * @constructor
 * @param {string} script The ISO 15924 4-letter identifier for the script
 * @param {Object} options parameters to initialize this matcher 
 */
ilib.ScriptInfo = function(script, options) {
	var sync = true,
	    loadParams = undefined;
	
	this.script = script;
	
	if (options) {
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		if (typeof(options.loadParams) !== 'undefined') {
			loadParams = options.loadParams;
		}
	}

	if (!ilib.ScriptInfo.cache) {
		ilib.ScriptInfo.cache = {};
	}

	if (!ilib.data.scripts) {
		ilib.loadData({
			object: ilib.ScriptInfo, 
			locale: "-", 
			name: "scripts.json", 
			sync: sync, 
			loadParams: loadParams, 
			callback: ilib.bind(this, function (info) {
				if (!info) {
					info = {"Latn":{"nb":215,"nm":"Latin","lid":"Latin","rtl":false,"ime":false,"casing":true}};
					var spec = this.locale.getSpec().replace(/-/g, "_");
					ilib.ScriptInfo.cache[spec] = info;
				}
				ilib.data.scripts = info;
				this.info = script && ilib.data.scripts[script];
				if (options && typeof(options.onLoad) === 'function') {
					options.onLoad(this);
				}
			})
		});
	} else {
		this.info = ilib.data.scripts[script];
	}

};

/**
 * Return an array of all ISO 15924 4-letter identifier script identifiers that
 * this copy of ilib knows about.
 * @static
 * @return {Array.<string>} an array of all script identifiers that this copy of
 * ilib knows about
 */
ilib.ScriptInfo.getAllScripts = function() {
	var ret = [],
		script = undefined,
		scripts = ilib.data.scripts;
	
	for (script in scripts) {
		if (script && scripts[script]) {
			ret.push(script);
		}
	}
	
	return ret;
};

ilib.ScriptInfo.prototype = {
	/**
	 * Return the 4-letter ISO 15924 identifier associated
	 * with this script.
	 * @return {string} the 4-letter ISO code for this script
	 */
	getCode: function () {
		return this.info && this.script;
	},
	
	/**
	 * Get the ISO 15924 code number associated with this
	 * script.
	 * 
	 * @return {number} the ISO 15924 code number
	 */
	getCodeNumber: function () {
		return this.info && this.info.nb || 0;
	},
	
	/**
	 * Get the name of this script in English.
	 * 
	 * @return {string} the name of this script in English
	 */
	getName: function () {
		return this.info && this.info.nm;
	},
	
	/**
	 * Get the long identifier assciated with this script.
	 * 
	 * @return {string} the long identifier of this script
	 */
	getLongCode: function () {
		return this.info && this.info.lid;
	},
	
	/**
	 * Return the usual direction that text in this script is written
	 * in. Possible return values are "rtl" for right-to-left,
	 * "ltr" for left-to-right, and "ttb" for top-to-bottom.
	 * 
	 * @return {string} the usual direction that text in this script is
	 * written in
	 */
	getScriptDirection: function() {
		return (this.info && typeof(this.info.rtl) !== 'undefined' && this.info.rtl) ? "rtl" : "ltr";
	},
	
	/**
	 * Return true if this script typically requires an input method engine
	 * to enter its characters.
	 * 
	 * @return {boolean} true if this script typically requires an IME
	 */
	getNeedsIME: function () {
		return this.info && this.info.ime ? true : false; // converts undefined to false
	},
	
	/**
	 * Return true if this script uses lower- and upper-case characters.
	 * 
	 * @return {boolean} true if this script uses letter case
	 */
	getCasing: function () {
		return this.info && this.info.casing ? true : false; // converts undefined to false
	}
};
/*
 * nameprs.js - Person name parser
 *
 * Copyright © 2013-2014, JEDLSoft
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
util/jsutils.js 
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
 * <li><i>useSpaces</i> - explicitly specifies whether to use spaces or not between the given name , middle name
 * and family name.
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
 * @param {string|ilib.Name=} name the name to parse
 * @param {Object=} options Options governing the construction of this name instance
 */
ilib.Name = function (name, options) {
    var sync = true;

    if (!name || name.length === 0) {
    	return;
    }

    this.loadParams = {};

    if (options) {
        if (options.locale) {
            this.locale = (typeof (options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
        }

        if (options.style && (options.style === "asian" || options.style === "western")) {
            this.style = options.style;
        }

        if (options.order && (options.order === "gmf" || options.order === "fmg" || options.order === "fgm")) {
            this.order = options.order;
        }

        if (typeof (options.sync) !== 'undefined') {
            sync = (options.sync == true);
        }

        if (typeof (options.loadParams) !== 'undefined') {
            this.loadParams = options.loadParams;
        }
    }

    if (!ilib.Name.cache) {
        ilib.Name.cache = {};
    }

	this.locale = this.locale || new ilib.Locale();
	
	ilib.CType.isAlpha._init(sync, this.loadParams, /** @type {function()|undefined} */ ilib.bind(this, function() {
		ilib.CType.isIdeo._init(sync, this.loadParams, /** @type {function()|undefined} */ ilib.bind(this, function() {
			ilib.CType.isPunct._init(sync, this.loadParams, /** @type {function()|undefined} */ ilib.bind(this, function() {
				ilib.CType.isSpace._init(sync, this.loadParams, /** @type {function()|undefined} */ ilib.bind(this, function() {
					ilib.loadData({
						object: ilib.Name, 
						locale: this.locale, 
						name: "name.json", 
						sync: sync, 
						loadParams: this.loadParams, 
						callback: ilib.bind(this, function (info) {
							if (!info) {
								info = ilib.Name.defaultInfo;
								var spec = this.locale.getSpec().replace(/-/g, "_");
								ilib.Name.cache[spec] = info;
							}
                            if (typeof (name) === 'object') {
    							// copy constructor
							    /**
							     * The prefixes for this name
							     * @type {string|Array.<string>}
							     */
							    this.prefix = name.prefix;
							    /**
							     * The given (personal) name in this name.
							     * @type {string|Array.<string>}
							     */
							    this.givenName = name.givenName;
							    /**
							     * The middle names used in this name. If there are multiple middle names, they all
							     * appear in this field separated by spaces.
							     * @type {string|Array.<string>}
							     */
							    this.middleName = name.middleName;
							    /**
							     * The family names in this name. If there are multiple family names, they all
							     * appear in this field separated by spaces.
							     * @type {string|Array.<string>}
							     */
							    this.familyName = name.familyName;
							    /**
							     * The suffixes for this name. If there are multiple suffixes, they all
							     * appear in this field separated by spaces.
							     * @type {string|Array.<string>}
							     */
							    this.suffix = name.suffix;

							    // private properties
							    this.locale = name.locale;
							    this.style = name.style;
							    this.order = name.order;
							    this.useSpaces = name.useSpaces;
							    this.isAsianName = name.isAsianName;
					    	    return;
						    }
							/** 
							 * @type {{
							 *   nameStyle:string,
							 *   order:string,
							 *   prefixes:Array.<string>,
							 *   suffixes:Array.<string>,
							 *   auxillaries:Array.<string>,
							 *   honorifics:Array.<string>,
							 *   knownFamilyNames:Array.<string>,
							 *   noCompoundFamilyNames:boolean,
							 *   sortByHeadWord:boolean
							 * }} */
							this.info = info;
							this._init(name);
							if (options && typeof(options.onLoad) === 'function') {
								options.onLoad(this);
							}
						})
					});					
				}));
			}));
		}));
	}));
};

ilib.Name.defaultInfo = ilib.data.name ||  {
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
		"von": 1,
		"von der": 1,
		"von den": 1,
		"van": 1,
		"van der": 1,
        "van de": 1,
        "van den": 1,
        "de": 1,
        "di": 1,
	    "de": 1,
		"la": 1,
		"lo": 1,
        "des": 1,
        "le": 1,
        "les": 1,
		"du": 1,
        "de la": 1,
        "del": 1,
        "de los": 1,
        "de las": 1
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
		"monsieur",
		"señor",
        "señora",
        "señorita"
	],
	"suffixes": [
		",",
		"junior",
		"jr",
		"senior",
		"sr",
		"i",
		"ii",
		"iii",
		"esq",
		"phd",
		"md"
	],
    "patronymicName":[ ],
    "familyNames":[ ]
};

/**
 * Return true if the given character is in the range of the Han, Hangul, or kana
 * scripts.
 * @static
 * @protected
 */
ilib.Name._isAsianChar = function(c) {
	return ilib.CType.isIdeo(c) ||
		ilib.CType.withinRange(c, "hangul") ||
		ilib.CType.withinRange(c, "hiragana") ||
		ilib.CType.withinRange(c, "katakana");
};


/**
 * @static
 * @protected
 */
ilib.Name._isAsianName = function (name, language) {
    // the idea is to count the number of asian chars and the number
    // of latin chars. If one is greater than the other, choose
    // that style.
    var asian = 0,
        latin = 0,
        i;

    if (name && name.length > 0) {
        for (i = 0; i < name.length; i++) {
        	var c = name.charAt(i);

            if (ilib.Name._isAsianChar(c)) {
                if (language =="ko" || language =="ja" || language =="zh") {
                    return true;
                }
                asian++;
            } else if (ilib.CType.isAlpha(c)) {
                if (!language =="ko" || !language =="ja" || !language =="zh") {
                    return false;
                }
                latin++;
            }
        }

        return latin < asian;
    }

    return false;
};

/**
 * Return true if any Latin letters are found in the string. Return
 * false if all the characters are non-Latin.
 * @static
 * @protected
 */
ilib.Name._isEuroName = function (name, language) {
    var c,
        n = new ilib.String(name),
        it = n.charIterator();

    while (it.hasNext()) {
        c = it.next();

        if (!ilib.Name._isAsianChar(c) && !ilib.CType.isPunct(c) && !ilib.CType.isSpace(c)) {
            return true;
        } else if (ilib.Name._isAsianChar(c) && (language =="ko" || language =="ja" || language =="zh")) {
            return false;
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
            i, info, hpSuffix;
        var currentLanguage = this.locale.getLanguage();

        if (name) {
            // for DFISH-12905, pick off the part that the LDAP server automatically adds to our names in HP emails
            i = name.search(/\s*[,\/\(\[\{<]/);
            if (i !== -1) {
                hpSuffix = name.substring(i);
                hpSuffix = hpSuffix.replace(/\s+/g, ' '); // compress multiple whitespaces
                suffixArray = hpSuffix.split(" ");
                var conjunctionIndex = this._findLastConjunction(suffixArray);
                if (conjunctionIndex > -1) {
                    // it's got conjunctions in it, so this is not really a suffix
                    hpSuffix = undefined;
                } else {
                    name = name.substring(0, i);
                }
            }

            this.isAsianName = ilib.Name._isAsianName(name, currentLanguage);
            if (this.info.nameStyle === "asian" || this.info.order === "fmg" || this.info.order === "fgm") {
                info = this.isAsianName ? this.info : ilib.data.name;
            } else {
                info = this.isAsianName ? ilib.data.name : this.info;
            }

            if (this.isAsianName) {
                // all-asian names
                if (this.useSpaces == false) {
                    name = name.replace(/\s+/g, ''); // eliminate all whitespaces
                }
                parts = name.trim().split('');
            }
            //} 
            else {
                name = name.replace(/, /g, ' , ');
                name = name.replace(/\s+/g, ' '); // compress multiple whitespaces
                parts = name.trim().split(' ');
            }

            // check for prefixes
            if (parts.length > 1) {
                for (i = parts.length; i > 0; i--) {
                    prefixArray = parts.slice(0, i);
                    prefix = prefixArray.join(this.isAsianName ? '' : ' ');
                    prefixLower = prefix.toLowerCase();
                    prefixLower = prefixLower.replace(/[,\.]/g, ''); // ignore commas and periods
                    if (this.info.prefixes &&
                        (this.info.prefixes.indexOf(prefixLower) > -1 || this._isConjunction(prefixLower))) {
                        if (this.prefix) {
                            if (!this.isAsianName) {
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
                    suffix = suffixArray.join(this.isAsianName ? '' : ' ');
                    suffixLower = suffix.toLowerCase();
                    suffixLower = suffixLower.replace(/[\.]/g, ''); // ignore periods
                    if (this.info.suffixes && this.info.suffixes.indexOf(suffixLower) > -1) {
                        if (this.suffix) {
                            if (!this.isAsianName && !ilib.CType.isPunct(this.suffix.charAt(0))) {
                                this.suffix = ' ' + this.suffix;
                            }
                            this.suffix = suffix + this.suffix;
                        } else {
                            this.suffix = suffix;
                        }
                        parts = parts.slice(0, parts.length - i);
                        i = parts.length;
                    }
                }
            }

            if (hpSuffix) {
                this.suffix = (this.suffix && this.suffix + hpSuffix) || hpSuffix;
            }

            // adjoin auxillary words to their headwords
            if (parts.length > 1 && !this.isAsianName) {
                parts = this._joinAuxillaries(parts, this.isAsianName);
            }

            if (this.isAsianName) {
                this._parseAsianName(parts, currentLanguage);
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
     * @param {Array} parts
     * @param {Array} names
     * @param {boolean} isAsian
     * @param {boolean=} noCompoundPrefix
     */
    _findPrefix: function (parts, names, isAsian, noCompoundPrefix) {
        var i, prefix, prefixLower, prefixArray, aux = [];

        if (parts.length > 0 && names) {
            for (i = parts.length; i > 0; i--) {
                prefixArray = parts.slice(0, i);
                prefix = prefixArray.join(isAsian ? '' : ' ');
                prefixLower = prefix.toLowerCase();
                prefixLower = prefixLower.replace(/[,\.]/g, ''); // ignore commas and periods

                if (prefixLower in names) {
                    aux = aux.concat(isAsian ? prefix : prefixArray);
                    if (noCompoundPrefix) {
                    	// don't need to parse further. Just return it as is.
                    	return aux;
                    }
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
                while (j < names[i].length && parts[parts.length - j] === names[i][names[i].length - j]) {
                    j++;
                }
                if (j >= names[i].length) {
                    seq = parts.slice(parts.length - j).join(isAsian ? "" : " ") + (isAsian ? "" : " ") + seq;
                    parts = parts.slice(0, parts.length - j);
                    i = -1; // restart the search
                }
            }
        }

        this.suffix = seq;
        return parts;
    },

    /**
     * @protected
     * Tell whether or not the given word is a conjunction in this language.
     * @param {string} word the word to test
     * @return {boolean} true if the word is a conjunction
     */
    _isConjunction: function _isConjunction(word) {
        return (this.info.conjunctions.and1 === word ||
            this.info.conjunctions.and2 === word ||
            this.info.conjunctions.or1 === word ||
            this.info.conjunctions.or2 === word ||
            ("&" === word) ||
            ("+" === word));
    },

    /**
     * Find the last instance of 'and' in the name
     * @protected
     * @param {Array.<string>} parts
     * @return {number}
     */
    _findLastConjunction: function _findLastConjunction(parts) {
        var conjunctionIndex = -1,
            index, part;

        for (index = 0; index < parts.length; index++) {
            part = parts[index];
            if (typeof (part) === 'string') {
                part = part.toLowerCase();
                // also recognize English
                if ("and" === part || "or" === part || "&" === part || "+" === part) {
                    conjunctionIndex = index;
                }
                if (this._isConjunction(part)) {
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
            return parts.slice(0, i);
        }
        // suffices not found, so just return the array unmodified
        return parts;
    },

    /**
     * Adjoin auxillary words to their head words.
     * @protected
     * @param {Array.<string>} parts the current array of name parts
     * @param {boolean} isAsian true if the name is being parsed as an Asian name
     * @return {Array.<string>} the parts after the auxillary words have been plucked onto their head word
     */
    _joinAuxillaries: function (parts, isAsian) {
        var start, i, prefixArray, prefix, prefixLower;

        if (this.info.auxillaries && (parts.length > 2 || this.prefix)) {
            for (start = 0; start < parts.length - 1; start++) {
                for (i = parts.length; i > start; i--) {
                    prefixArray = parts.slice(start, i);
                    prefix = prefixArray.join(' ');
                    prefixLower = prefix.toLowerCase();
                    prefixLower = prefixLower.replace(/[,\.]/g, ''); // ignore commas and periods

                    if (prefixLower in this.info.auxillaries) {
                        parts.splice(start, i + 1 - start, prefixArray.concat(parts[i]));
                        i = start;
                    }
                }
            }
        }

        return parts;
    },

    /**
     * Recursively join an array or string into a long string.
     * @protected
     */
    _joinArrayOrString: function _joinArrayOrString(part) {
        var i;
        if (typeof (part) === 'object') {
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

            if (this[prop] !== undefined && typeof (this[prop]) === 'object' && this[prop] instanceof Array) {

                this[prop] = this._joinArrayOrString(this[prop]);
            }
        }
    },

    /**
     * @protected
     */
    _parseAsianName: function (parts, language) {
        var familyNameArray = this._findPrefix(parts, this.info.knownFamilyNames, true, this.info.noCompoundFamilyNames);
        var tempFullName = parts.join('');

        if (familyNameArray && familyNameArray.length > 0) {
            this.familyName = familyNameArray.join('');
            this.givenName = parts.slice(this.familyName.length).join('');
            
            //Overide parsing rules if spaces are found in korean
            if (language === "ko" && tempFullName.search(/\s*[/\s]/) > -1 && !this.suffix) {
                this._parseKoreanName(tempFullName);
            }
        } else if (this.locale.getLanguage() === "ja") {
            this._parseJapaneseName(parts);
        } else if (this.suffix || this.prefix) {
            this.familyName = parts.join('');
        } else {
            this.givenName = parts.join('');
        }
    },

    /**
     * @protected
     */
    _parseKoreanName: function (name) {
        var tempName = name;

        var spaceSplit = tempName.split(" ");
        var spceCount = spaceSplit.length;
        var fistSpaceIndex = tempName.indexOf(" ");
        var lastSpaceIndex = tempName.lastIndexOf(" ");

        if (spceCount === 2) {
            this.familyName = spaceSplit[0];
            this.givenName = tempName.slice(fistSpaceIndex, tempName.length);
        } else {
            this.familyName = spaceSplit[0];
            this.middleName = tempName.slice(fistSpaceIndex, lastSpaceIndex);
            this.givenName = tempName.slice(lastSpaceIndex, tempName.length);
        }
        
    },

    /**
     * @protected
     */
    _parseJapaneseName: function (parts) {
    	if (this.suffix && this.suffix.length > 1 && this.info.honorifics.indexOf(this.suffix)>-1) {
    		if (parts.length === 1) {
    			if (ilib.CType.withinRange(parts[0], "cjk")) {
    				this.familyName = parts[0];
    			} else {
    				this.givenName = parts[0];
    			}
    			return;
    		} else if (parts.length === 2) {
    			this.familyName = parts.slice(0,parts.length).join("")
    			return;
    		}
    	}
    	if (parts.length > 1) {
    		var fn = "";                                                                    
    		for (var i = 0; i < parts.length; i++) {
    			if (ilib.CType.withinRange(parts[i], "cjk")) {
    				fn += parts[i];
    			} else if (fn.length > 1 && ilib.CType.withinRange(parts[i], "hiragana")) {
    				this.familyName = fn;
    				this.givenName = parts.slice(i,parts.length).join("");
    				return;
    			} else {
    				break;
    			}
    		}
    	}
    	if (parts.length === 1) {
    		this.familyName = parts[0];
    	} else if (parts.length === 2) {
    		this.familyName = parts[0];
    		this.givenName = parts[1];
    	} else if (parts.length === 3) {
    		this.familyName = parts[0];
    		this.givenName = parts.slice(1,parts.length).join("");
    	} else if (parts.length > 3) {
    		this.familyName = parts.slice(0,2).join("")
    		this.givenName = parts.slice(2,parts.length).join("");
    	}      
    },

    /**
     * @protected
     */
    _parseSpanishName: function (parts) {
        var conjunctionIndex;

        if (parts.length === 1) {
            if (this.prefix || typeof (parts[0]) === 'object') {
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
            ////console.log("@@@@@@@@@@@@@@@@"+conjunctionIndex)
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
                this.givenName = parts.splice(0, conjunctionIndex + 2);
                if (parts.length > 1) {
                    this.familyName = parts.splice(parts.length - 2, 2);
                    if (parts.length > 0) {
                        this.middleName = parts;
                    }
                } else if (parts.length === 1) {
                    this.familyName = parts[0];
                }
            } else {
                this.givenName = parts.splice(0, 1);
                this.familyName = parts.splice(parts.length - 2, 2);
                this.middleName = parts;
            }
        }
    },

    /**
     * @protected
     */
    _parseIndonesianName: function (parts) {
        var conjunctionIndex;

        if (parts.length === 1) {
            //if (this.prefix || typeof(parts[0]) === 'object') {
            //this.familyName = parts[0];
            //} else {
            this.givenName = parts[0];
            //}
            //} else if (parts.length === 2) {
            // we do G F
            //this.givenName = parts[0];
            //this.familyName = parts[1];
        } else if (parts.length >= 2) {
            //there are at least 3 parts to this name

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
                this.givenName = parts.splice(0, conjunctionIndex + 2);
                if (parts.length > 1) {
                    //this.familyName = parts.splice(parts.length-2, 2);
                    //if ( parts.length > 0 ) {
                    this.middleName = parts;
                }
                //} else if (parts.length === 1) {
                //	this.familyName = parts[0];
                //}
            } else {
                this.givenName = parts.splice(0, 1);
                //this.familyName = parts.splice(parts.length-2, 2);
                this.middleName = parts;
            }
        }
    },
    
    /**
     * @protected
     */
    _parseGenericWesternName: function (parts) {
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
            if (this.prefix || typeof (parts[0]) === 'object') {
                // already has a prefix, so assume it goes with the family name like "Dr. Roberts" or
                // it is a name with auxillaries, which is almost always a family name
                this.familyName = parts[0];
            } else {
                this.givenName = parts[0];
            }
        } else if (parts.length === 2) {
            // we do G F
            if (this.info.order == 'fgm') {
                this.givenName = parts[1];
                this.familyName = parts[0];
            } else if (this.info.order == "gmf" || typeof (this.info.order) == 'undefined') {
                this.givenName = parts[0];
                this.familyName = parts[1];
            }
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
                //if(this.order == "gmf") {
                this.givenName = parts.slice(0, conjunctionIndex + 2);

                if (conjunctionIndex + 1 < parts.length - 1) {
                    this.familyName = parts.splice(parts.length - 1, 1);
                    ////console.log(this.familyName);
                    if (conjunctionIndex + 2 < parts.length - 1) {
                        this.middleName = parts.slice(conjunctionIndex + 2, parts.length - conjunctionIndex - 3);
                    }
                } else if (this.order == "fgm") {
                    this.familyName = parts.slice(0, conjunctionIndex + 2);
                    if (conjunctionIndex + 1 < parts.length - 1) {
                        this.middleName = parts.splice(parts.length - 1, 1);
                        if (conjunctionIndex + 2 < parts.length - 1) {
                            this.givenName = parts.slice(conjunctionIndex + 2, parts.length - conjunctionIndex - 3);
                        }
                    }
                }
            } else {
                this.givenName = parts[0];

                this.middleName = parts.slice(1, parts.length - 1);

                this.familyName = parts[parts.length - 1];
            }
        }
    },
    
     /**
     * parse patrinomic name from the russian names 
     * @protected
     * @param {Array.<string>} parts the current array of name parts
     * @return number  index of the part which contains patronymic name
     */
    _findPatronymicName: function(parts) {
    	var index, part;
    	for (index = 0; index < parts.length; index++) {
    		part = parts[index];
    		if (typeof (part) === 'string') {
    			part = part.toLowerCase();

    			var subLength = this.info.patronymicName.length;
    			while(subLength--) {
    				if(part.indexOf(this.info.patronymicName[subLength])!== -1 )
    					return index;
    			}
    		}
    	}
    	return -1;
    },

    /**
	 * find if the given part is patronymic name
	 * 
	 * @protected
	 * @param {string} part string from name parts @
	 * @return number index of the part which contains familyName
	 */
    _isPatronymicName: function(part) {
	    var pName;
	    if ( typeof (part) === 'string') {
		    pName = part.toLowerCase();

		    var subLength = this.info.patronymicName.length;
		    while (subLength--) {
			    if (pName.indexOf(this.info.patronymicName[subLength]) !== -1)
				    return true;
		    }
	    }
	    return false;
    },

    /**
	 * find family name from the russian name
	 * 
	 * @protected
	 * @param {Array.<string>} parts the current array of name parts
	 * @return boolean true if patronymic, false otherwise
	 */
    _findFamilyName: function(parts) {
	    var index, part, substring;
	    for (index = 0; index < parts.length; index++) {
		    part = parts[index];

		    if ( typeof (part) === 'string') {
			    part = part.toLowerCase();
			    var length = part.length - 1;

			    if (this.info.familyName.indexOf(part) !== -1) {
				    return index;
			    } else if (part[length] === 'в' || part[length] === 'н' ||
			        part[length] === 'й') {
				    substring = part.slice(0, -1);
				    if (this.info.familyName.indexOf(substring) !== -1) {
					    return index;
				    }
			    } else if ((part[length - 1] === 'в' && part[length] === 'а') ||
			        (part[length - 1] === 'н' && part[length] === 'а') ||
			        (part[length - 1] === 'а' && part[length] === 'я')) {
				    substring = part.slice(0, -2);
				    if (this.info.familyName.indexOf(substring) !== -1) {
					    return index;
				    }
			    }
		    }
	    }
	    return -1;
    },

    /**
	 * parse russian name
	 * 
	 * @protected
	 * @param {Array.<string>} parts the current array of name parts
	 * @return
	 */
    _parseRussianName: function(parts) {
	    var conjunctionIndex, familyIndex = -1;

	    if (parts.length === 1) {
		    if (this.prefix || typeof (parts[0]) === 'object') {
			    // already has a prefix, so assume it goes with the family name
				// like "Dr. Roberts" or
			    // it is a name with auxillaries, which is almost always a
				// family name
			    this.familyName = parts[0];
		    } else {
			    this.givenName = parts[0];
		    }
	    } else if (parts.length === 2) {
		    // we do G F
		    if (this.info.order === 'fgm') {
			    this.givenName = parts[1];
			    this.familyName = parts[0];
		    } else if (this.info.order === "gmf") {
			    this.givenName = parts[0];
			    this.familyName = parts[1];
		    } else if ( typeof (this.info.order) === 'undefined') {
			    if (this._isPatronymicName(parts[1]) === true) {
				    this.middleName = parts[1];
				    this.givenName = parts[0];
			    } else if ((familyIndex = this._findFamilyName(parts)) !== -1) {
				    if (familyIndex === 1) {
					    this.givenName = parts[0];
					    this.familyName = parts[1];
				    } else {
					    this.familyName = parts[0];
					    this.givenName = parts[1];
				    }

			    } else {
				    this.givenName = parts[0];
				    this.familyName = parts[1];
			    }

		    }
	    } else if (parts.length >= 3) {
		    // find the first instance of 'and' in the name
		    conjunctionIndex = this._findLastConjunction(parts);
		    var patronymicNameIndex = this._findPatronymicName(parts);
		    if (conjunctionIndex > 0) {
			    // if there's a conjunction that's not the first token, put
				// everything up to and
			    // including the token after it into the first name, the last
				// token into
			    // the family name (if it exists) and everything else in to the
				// middle name
			    // 0 1 2 3 4 5
			    // G A G M M F
			    // G G A G M F
			    // G G G A G F
			    // G G G G A G
			    // if(this.order == "gmf") {
			    this.givenName = parts.slice(0, conjunctionIndex + 2);

			    if (conjunctionIndex + 1 < parts.length - 1) {
				    this.familyName = parts.splice(parts.length - 1, 1);
				    // //console.log(this.familyName);
				    if (conjunctionIndex + 2 < parts.length - 1) {
					    this.middleName = parts.slice(conjunctionIndex + 2,
					        parts.length - conjunctionIndex - 3);
				    }
			    } else if (this.order == "fgm") {
				    this.familyName = parts.slice(0, conjunctionIndex + 2);
				    if (conjunctionIndex + 1 < parts.length - 1) {
					    this.middleName = parts.splice(parts.length - 1, 1);
					    if (conjunctionIndex + 2 < parts.length - 1) {
						    this.givenName = parts.slice(conjunctionIndex + 2,
						        parts.length - conjunctionIndex - 3);
					    }
				    }
			    }
		    } else if (patronymicNameIndex !== -1) {
			    this.middleName = parts[patronymicNameIndex];

			    if (patronymicNameIndex === (parts.length - 1)) {
				    this.familyName = parts[0];
				    this.givenName = parts.slice(1, patronymicNameIndex);
			    } else {
				    this.givenName = parts.slice(0, patronymicNameIndex);

				    this.familyName = parts[parts.length - 1];
			    }
		    } else {
			    this.givenName = parts[0];

			    this.middleName = parts.slice(1, parts.length - 1);

			    this.familyName = parts[parts.length - 1];
		    }
	    }
    },
    
    
    /**
     * @protected
     */
    _parseWesternName: function (parts) {

        if (this.locale.getLanguage() === "es" || this.locale.getLanguage() === "pt") {
            // in spain and mexico and portugal, we parse names differently than in the rest of the world 
            // because of the double family names
            this._parseSpanishName(parts);
        } else if (this.locale.getLanguage() === "ru") {
            /*
             * In Russian, names can be given equally validly as given-family
             * or family-given. Use the value of the "order" property of the
             * constructor options to give the default when the order is ambiguous.
             */
            this._parseRussianName(parts);
        } else if (this.locale.getLanguage() === "id") {
            // in indonesia, we parse names differently than in the rest of the world 
            // because names don't have family names usually.
            this._parseIndonesianName(parts);
        } else {
        	this._parseGenericWesternName(parts);
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
    getSortFamilyName: function () {
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
                if (typeof (this.familyName) === 'string') {
                    name = this.familyName.replace(/\s+/g, ' '); // compress multiple whitespaces
                    parts = name.trim().split(' ');
                } else {
                    // already split
                    parts = /** @type Array */ this.familyName;
                }

                auxillaries = this._findPrefix(parts, this.info.auxillaries, false);
                if (auxillaries && auxillaries.length > 0) {
                    if (typeof (this.familyName) === 'string') {
                        auxString = auxillaries.join(' ');
                        name = this.familyName.substring(auxString.length + 1) + ', ' + auxString;
                    } else {
                        name = parts.slice(auxillaries.length).join(' ') +
                            ', ' +
                            parts.slice(0, auxillaries.length).join(' ');
                    }
                }
            } else if (this.info.knownFamilyNames && this.familyName) {
                parts = this.familyName.split('');
                var familyNameArray = this._findPrefix(parts, this.info.knownFamilyNames, true, this.info.noCompoundFamilyNames);
                name = "";
                for (i = 0; i < familyNameArray.length; i++) {
                    name += (this.info.knownFamilyNames[familyNameArray[i]] || "");
                }
            }
        }

        return name || this.familyName;
    },

    getHeadFamilyName: function () {},

    /** 
     * @protected
     * Return a shallow copy of the current instance.
     */
    clone: function () {
        return new ilib.Name(this);
    }
};

/*
 * namefmt.js - Format person names for display
 * 
 * Copyright © 2013-2014, JEDLSoft
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
 *     prefixes.
 *     <li><i>full</i> - Format a long name with all names available in the given name object, including
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
	
	ilib.CType.isPunct._init(sync, this.loadParams, /** @type {function()|undefined} */ ilib.bind(this, function() {
		ilib.loadData({
			object: ilib.Name, 
			locale: this.locale, 
			name: "name.json", 
			sync: sync, 
			loadParams: this.loadParams, 
			callback: ilib.bind(this, function (info) {
				if (!info) {
					info = ilib.Name.defaultInfo;
					var spec = this.locale.getSpec().replace(/-/g, "_");
					ilib.Name.cache[spec] = info;
				}
				this.info = info;
				this._init();
				if (options && typeof(options.onLoad) === 'function') {
					options.onLoad(this);
				}
			})
		});
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
	 * adjoin auxillary words to their head words
	 * @protected
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
		var currentLanguage = this.locale.getLanguage();
		 
		if (!name || typeof(name) !== 'object') {
			return undefined;
		}
		
		if ((typeof(name.isAsianName) === 'boolean' && !name.isAsianName) ||
				ilib.Name._isEuroName([name.givenName, name.middleName, name.familyName].join(""), currentLanguage)) {
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
			if (modified.suffix && currentLanguage === "ko" && this.info.honorifics.indexOf(name.suffix) == -1) {
				modified.suffix = ' ' + modified.suffix; 
			}
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

/**
 * addressprs.js - Represent a mailing address
 * 
 * Copyright © 2013-2014, JEDLSoft
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
 * @class
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
 * @constructor
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
		 * Optional city-specific code for a particular post office, used to expidite
		 * delivery.
		 * @expose
		 * @type {string|undefined} 
		 */
		this.postOffice = freeformAddress.postOffice;
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
			 * private
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
	
	ilib.Address.shared = ilib.Address.shared || {}; 
	if (typeof(ilib.Address.ctry) === 'undefined') {
		ilib.Address.ctry = {}; // make sure not to conflict with the address info
	}
	ilib.CType.isAscii._init(this.sync, this.loadParams, /** @type {function(*)|undefined} */ ilib.bind(this, function() {
		ilib.CType.isIdeo._init(this.sync, this.loadParams, /** @type {function(*)|undefined} */ ilib.bind(this, function() {
			ilib.CType.isDigit._init(this.sync, this.loadParams, /** @type {function(*)|undefined} */ ilib.bind(this, function() {
				if (typeof(ilib.data.nativecountries) === 'undefined') {
					ilib.loadData({
						name: "nativecountries.json", // countries in their own language 
						locale: "-", // only need to load the root file 
						sync: this.sync, 
						loadParams: this.loadParams, 
						callback: /** @type function(Object=):undefined */ ilib.bind(this, /** @type function() */ function(nativecountries) {
							ilib.data.nativecountries = nativecountries;
							this._loadCountries(options && options.onLoad);
						})
					});
				} else {
					this._loadCountries(options && options.onLoad);
				}
			}));
		}));
	}));
};

/** @protected */
ilib.Address.prototype = {
	/**
	 * @private
	 */
	_loadCountries: function(onLoad) {
		if (typeof(ilib.data.countries) === 'undefined') {
			ilib.loadData({
				name: "countries.json", // countries in English
				locale: "-", // only need to load the root file
				sync: this.sync, 
				loadParams: this.loadParams, 
				callback: /** @type function(Object=):undefined */ ilib.bind(this, /** @type function() */ function(countries) {
					ilib.data.countries = countries;
					this._loadCtrynames(onLoad);
				})
			});
		} else {
			this._loadCtrynames(onLoad);
		}
	},

	/**
	 * @private
	 */
	_loadCtrynames: function(onLoad) {
		ilib.loadData({
			name: "ctrynames.json", 
			object: ilib.Address.ctry, 
			locale: this.locale, 
			sync: this.sync, 
			loadParams: this.loadParams, 
			callback: /** @type function(Object=):undefined */ ilib.bind(this, /** @type function() */ function(ctrynames) {
				this._determineDest(ctrynames, onLoad);
			})
		});
	},
	
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
		ilib.loadData({
			object: ilib.Address, 
			locale: new ilib.Locale(this.countryCode), 
			name: "address.json", 
			sync: this.sync, 
			loadParams: this.loadParams,
			callback: /** @type function(Object=):undefined */ ilib.bind(this, function(info) {
				if (!info || ilib.isEmpty(info)) {
					// load the "unknown" locale instead
					ilib.loadData({
						object: ilib.Address, 
						locale: new ilib.Locale("XX"), 
						name: "address.json", 
						sync: this.sync, 
						loadParams: this.loadParams,
						callback: /** @type function(Object=):undefined */ ilib.bind(this, function(info) {
							this.info = info;
							this._parseAddress();
							if (typeof(callback) === 'function') {
								callback(this);
							}	
						})
					});
				} else {
					this.info = info;
					this._parseAddress();
					if (typeof(callback) === 'function') {
						callback(this);
					}
				}
			})
		});
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
				var line = new ilib.String(this.lines[j]);
				var it = line.charIterator();
				while (it.hasNext()) {
					var c = it.next();
					if (ilib.CType.isIdeo(c) || ilib.CType.withinRange(c, "Hangul")) {
						asianChars++;
					} else if (ilib.CType.isAscii(c) && !ilib.CType.isDigit(c)) {
						latinChars++;
					}
				}
			}
			
			this.format = (asianChars >= latinChars) ? "asian" : "latin";
			startAt = this.info.startAt[this.format];
			infoFields = this.info.fields[this.format];
			// //console.log("multiformat locale: format is now " + this.format);
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
					// //console.log("found match for " + field.name + ": " + JSON.stringify(match));
					// //console.log("remaining line is " + match.line);
					this.lines[fieldNumber] = match.line;
					this[field.name] = match.match;
				}
			} else {
				// if nothing is given, default to taking the whole field
				this[field.name] = this.lines.splice(fieldNumber,1)[0].trim();
				//console.log("typeof(this[field.name]) is " + typeof(this[field.name]) + " and value is " + JSON.stringify(this[field.name]));
			}
		}
			
		// all the left overs go in the street address field
		this.removeEmptyLines(this.lines);
		if (this.lines.length > 0) {
			//console.log("this.lines is " + JSON.stringify(this.lines) + " and splicing to get streetAddress");
			// Korea uses spaces between words, despite being an "asian" locale
			var joinString = (this.info.joinString && this.info.joinString[this.format]) || ((this.format && this.format === "asian") ? "" : ", ");
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
			// TODO: use case mapper instead of toLowerCase()
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
		// //console.log("startsWith: checking " + query + " against " + subject);
		for (i = 0; i < query.length; i++) {
			// TODO: use case mapper instead of toLowerCase()
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
				ret.match = ret.match.replace(/^\-|\-+$/, '');
				ret.match = ret.match.replace(/\s+$/, '');
				last = (startAt === 'end') ? line.lastIndexOf(match[matchGroup]) : line.indexOf(match[matchGroup]); 
				//console.log("last is " + last);
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
                            if (start !== 0) {
                                ret.line = line.substring(0,start).trim();
                            } else {
                                ret.line = line.substring(pattern[j].length).trim();
                            }
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
 * Copyright © 2013-2014, JEDLSoft
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
 * @class
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
 * @constructor
 * @param {Object} options options that configure how this formatter should work
 * Returns a formatter instance that can format multiple addresses.
 */
ilib.AddressFmt = function(options) {
	this.sync = true;
	this.styleName = 'default';
	this.loadParams = {};
	this.locale = new ilib.Locale();
	
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
	ilib.loadData({
		name: "address.json",
		object: ilib.Address, 
		locale: this.locale,
		sync: this.sync, 
		loadParams: this.loadParams, 
		callback: /** @type function(Object?):undefined */ ilib.bind(this, function(info) {
			if (!info || ilib.isEmpty(info)) {
				// load the "unknown" locale instead
				ilib.loadData({
					name: "address.json",
					object: ilib.Address, 
					locale: new ilib.Locale("XX"),
					sync: this.sync, 
					loadParams: this.loadParams, 
					callback: /** @type function(Object?):undefined */ ilib.bind(this, function(info) {
						this.info = info;
						this._init();
						if (options && typeof(options.onLoad) === 'function') {
							options.onLoad(this);
						}
					})
				});
			} else {
				this.info = info;
				this._init();
				if (options && typeof(options.onLoad) === 'function') {
					options.onLoad(this);
				}
			}
		})
	});
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
	
	if (typeof(this.style) === 'object') {
		format = this.style[address.format || "latin"];
	} else {
		format = this.style;
	}
	
	// console.log("Using format: " + format);
	// make sure we have a blank string for any missing parts so that
	// those template parts get blanked out
	var params = {
		country: address.country || "",
		region: address.region || "",
		locality: address.locality || "",
		streetAddress: address.streetAddress || "",
		postalCode: address.postalCode || "",
		postOffice: address.postOffice || ""
	};
	template = new ilib.String(format);
	ret = template.format(params);
	ret = ret.replace(/[ \t]+/g, ' ');
	ret = ret.replace("\n ", "\n");
	ret = ret.replace(" \n", "\n");
	return ret.replace(/\n+/g, '\n').trim();
};

/*
 * glyphstring.js - ilib string subclass that allows you to access 
 * whole glyphs at a time
 * 
 * Copyright © 2014, JEDLSoft
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

// !depends strings.js ctype.js
// !data norm ctype_m

/**
 * @class
 * Create a new glyph string instance. This string inherits from 
 * the ilib.String class, and adds methods that allow you to access
 * whole glyphs at a time. <p>
 * 
 * In Unicode, various accented characters can be created by using
 * a base character and one or more combining characters following
 * it. These appear on the screen to the user as a single glyph.
 * For example, the Latin character "a" (U+0061) followed by the
 * combining diaresis character "¨" (U+0308) combine together to
 * form the "a with diaresis" glyph "ä", which looks like a single
 * character on the screen.<p>
 * 
 * The big problem with combining characters for web developers is
 * that many CSS engines do not ellipsize text between glyphs. They
 * only deal with single Unicode characters. So if a particular space 
 * only allows for 4 characters, the CSS engine will truncate a
 * string at 4 Unicode characters and then add the ellipsis (...)
 * character. What if the fourth Unicode character is the "a" and
 * the fifth one is the diaresis? Then a string like "xxxäxxx" that
 * is ellipsized at 4 characters will appear as "xxxa..." on the 
 * screen instead of "xxxä...".<p>
 * 
 * In the Latin script as it is commonly used, it is not so common
 * to form accented characters using combining accents, so the above
 * example is mostly for illustrative purposes. It is not unheard of
 * however. The situation is much, much worse in scripts such as Thai and 
 * Devanagari that normally make very heavy use of combining characters.
 * These scripts do so because Unicode does not include pre-composed 
 * versions of the accented characters like it does for Latin, so 
 * combining accents are the only way to create these accented and 
 * combined versions of the characters.<p>
 * 
 * The solution to thise problem is not to use the the CSS property 
 * "text-overflow: ellipsis" in your web site, ever. Instead, use
 * a glyph string to truncate text between glyphs instead of between
 * characters.<p>
 * 
 * Glyph strings are also useful for truncation, hyphenation, and 
 * line wrapping, as all of these should be done between glyphs instead
 * of between characters.<p>
 * 
 * The options parameter is optional, and may contain any combination
 * of the following properties:<p>
 * 
 * <ul>
 * <li><i>onLoad</i> - a callback function to call when the locale data are
 * fully loaded. When the onLoad option is given, this object will attempt to
 * load any missing locale data using the ilib loader callback.
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
 * 
 * Depends directive: !depends glyphstring.js
 * 
 * @constructor
 * @param {string|ilib.String=} str initialize this instance with this string 
 * @param {Object=} options options governing the way this instance works
 */
ilib.GlyphString = function (str, options) {
	ilib.String.call(this, str);
	
	var sync = true;
	var loadParams = {};
	if (options) {
		if (typeof(options.sync) === 'boolean') {
			sync = options.sync;
		}
		if (options.loadParams) {
			loadParams = options.loadParams;
		}
	}
	
	ilib.CType._load("ctype_m", sync, loadParams, function() {
		if (typeof(ilib.data.norm) === 'undefined' || typeof(ilib.data.norm.ccc) === 'undefined') {
			ilib.loadData({
				object: ilib.GlyphString, 
				locale: "-", 
				name: "norm.json",
				nonlocale: true,
				sync: sync, 
				loadParams: loadParams, 
				callback: ilib.bind(this, function (norm) {
					ilib.data.norm = norm;
					if (options && typeof(options.onLoad) === 'function') {
						options.onLoad(this);
					}
				})
			});
		} else {
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
		}
	});
};

ilib.GlyphString.prototype = new ilib.String();
ilib.GlyphString.parent = ilib.String;
ilib.GlyphString.prototype.constructor = ilib.GlyphString;

//ilib.GlyphString.prototype.iterator = function () {

//};

/**
 * Return true if the given character is a leading Jamo (Choseong) character.
 * 
 * @private
 * @static
 * @param {number} n code point to check
 * @return {boolean} true if the character is a leading Jamo character, 
 * false otherwise
 */
ilib.GlyphString._isJamoL = function (n) {
	return (n >= 0x1100 && n <= 0x1112);
};

/**
 * Return true if the given character is a vowel Jamo (Jungseong) character.
 * 
 * @private
 * @static
 * @param {number} n code point to check
 * @return {boolean} true if the character is a vowel Jamo character, 
 * false otherwise
 */
ilib.GlyphString._isJamoV = function (n) {
	return (n >= 0x1161 && n <= 0x1175);
};

/**
 * Return true if the given character is a trailing Jamo (Jongseong) character.
 * 
 * @private
 * @static
 * @param {number} n code point to check
 * @return {boolean} true if the character is a trailing Jamo character, 
 * false otherwise
 */
ilib.GlyphString._isJamoT = function (n) {
	return (n >= 0x11A8 && n <= 0x11C2);
};

/**
 * Return true if the given character is a precomposed Hangul character.
 * 
 * @private
 * @static
 * @param {number} n code point to check
 * @return {boolean} true if the character is a precomposed Hangul character, 
 * false otherwise
 */
ilib.GlyphString._isHangul = function (n) {
	return (n >= 0xAC00 && n <= 0xD7A3);
};

/**
 * Algorithmically compose an L and a V combining Jamo characters into
 * a precomposed Korean syllabic Hangul character. Both should already
 * be in the proper ranges for L and V characters. 
 * 
 * @private
 * @static
 * @param {number} lead the code point of the lead Jamo character to compose
 * @param {number} trail the code point of the trailing Jamo character to compose
 * @return {string} the composed Hangul character
 */
ilib.GlyphString._composeJamoLV = function (lead, trail) {
	var lindex = lead - 0x1100;
	var vindex = trail - 0x1161;
	return ilib.String.fromCodePoint(0xAC00 + (lindex * 21 + vindex) * 28);
};

/**
 * Algorithmically compose a Hangul LV and a combining Jamo T character 
 * into a precomposed Korean syllabic Hangul character. 
 * 
 * @private
 * @static
 * @param {number} lead the code point of the lead Hangul character to compose
 * @param {number} trail the code point of the trailing Jamo T character to compose
 * @return {string} the composed Hangul character
 */
ilib.GlyphString._composeJamoLVT = function (lead, trail) {
	return ilib.String.fromCodePoint(lead + (trail - 0x11A7));
};

/**
 * Compose one character out of a leading character and a 
 * trailing character. If the characters are Korean Jamo, they
 * will be composed algorithmically. If they are any other
 * characters, they will be looked up in the nfc tables.
 * 
 * @private
 * @static
 * @param {string} lead leading character to compose
 * @param {string} trail the trailing character to compose
 * @return {string} the fully composed character, or undefined if
 * there is no composition for those two characters
 */
ilib.GlyphString._compose = function (lead, trail) {
	var first = lead.charCodeAt(0);
	var last = trail.charCodeAt(0);
	if (ilib.GlyphString._isHangul(first) && ilib.GlyphString._isJamoT(last)) {
		return ilib.GlyphString._composeJamoLVT(first, last);
	} else if (ilib.GlyphString._isJamoL(first) && ilib.GlyphString._isJamoV(last)) {
		return ilib.GlyphString._composeJamoLV(first, last);
	}

	var c = lead + trail;
	return (ilib.data.norm.nfc && ilib.data.norm.nfc[c]);
};

/**
 * Return an iterator that will step through all of the characters
 * in the string one at a time, taking care to step through decomposed 
 * characters and through surrogate pairs in the UTF-16 encoding 
 * as single characters. <p>
 * 
 * The GlyphString class will return decomposed Unicode characters
 * as a single unit that a user might see on the screen as a single
 * glyph. If the 
 * next character in the iteration is a base character and it is 
 * followed by combining characters, the base and all its following 
 * combining characters are returned as a single unit.<p>
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
 * @override
 * @return {Object} an iterator 
 * that iterates through all the characters in the string
 */
ilib.GlyphString.prototype.charIterator = function() {
	var it = ilib.String.prototype.charIterator.call(this);
	
	/**
	 * @constructor
	 */
	function _chiterator (istring) {
		this.index = 0;
		this.spacingCombining = false;
		this.hasNext = function () {
			return !!this.nextChar || it.hasNext();
		};
		this.next = function () {
			var ch = this.nextChar || it.next(),
				prevCcc = ilib.data.norm.ccc[ch],
				nextCcc,
				composed = ch;
			
			this.nextChar = undefined;
			this.spacingCombining = false;
			
			if (ilib.data.norm.ccc && 
					(typeof(ilib.data.norm.ccc[ch]) === 'undefined' || ilib.data.norm.ccc[ch] === 0)) {
				// found a starter... find all the non-starters until the next starter. Must include
				// the next starter because under some odd circumstances, two starters sometimes recompose 
				// together to form another character
				var notdone = true;
				while (it.hasNext() && notdone) {
					this.nextChar = it.next();
					nextCcc = ilib.data.norm.ccc[this.nextChar];
					var codePoint = ilib.String.toCodePoint(this.nextChar, 0);
					// Mn characters are Marks that are non-spacing. These do not take more room than an accent, so they should be 
					// considered part of the on-screen glyph, even if they are non-combining. Mc are marks that are spacing
					// and combining, which means they are part of the glyph, but they cause the glyph to use up more space than
					// just the base character alone.
					var isMn = ilib.CType._inRange(codePoint, "Mn", ilib.data.ctype_m);
					var isMc = ilib.CType._inRange(codePoint, "Mc", ilib.data.ctype_m);
					if (isMn || isMc || (typeof(nextCcc) !== 'undefined' && nextCcc !== 0)) {
						if (isMc) {
							this.spacingCombining = true;
						}
						ch += this.nextChar;
						this.nextChar = undefined;
					} else {
						// found the next starter. See if this can be composed with the previous starter
						var testChar = ilib.GlyphString._compose(composed, this.nextChar);
						if (prevCcc === 0 && typeof(testChar) !== 'undefined') { 
							// not blocked and there is a mapping 
							composed = testChar;
							ch += this.nextChar;
							this.nextChar = undefined;
						} else {
							// finished iterating, leave this.nextChar for the next next() call 
							notdone = false;
						}
					}
					prevCcc = nextCcc;
				}
			}
			return ch;
		};
		// Returns true if the last character returned by the "next" method included
		// spacing combining characters. If it does, then the character was wider than
		// just the base character alone, and the truncation code will not add it.
		this.wasSpacingCombining = function() {
			return this.spacingCombining;
		};
	};
	return new _chiterator(this);
};

/**
 * Truncate the current string at the given number of whole glyphs and return
 * the resulting string.
 * 
 * @param {number} length the number of whole glyphs to keep in the string
 * @return {string} a string truncated to the requested number of glyphs
 */
ilib.GlyphString.prototype.truncate = function(length) {
	var it = this.charIterator();
	var tr = "";
	for (var i = 0; i < length-1 && it.hasNext(); i++) {
		tr += it.next();
	}
	
	/*
	 * handle the last character separately. If it contains spacing combining
	 * accents, then we must assume that it uses up more horizontal space on
	 * the screen than just the base character by itself, and therefore this
	 * method will not truncate enough characters to fit in the given length.
	 * In this case, we have to chop off not only the combining characters, 
	 * but also the base character as well because the base without the
	 * combining accents is considered a different character.
	 */
	if (i < length && it.hasNext()) {
		var c = it.next();
		if (!it.wasSpacingCombining()) {
			tr += c;
		}
	}
	return tr;
};

/**
 * Truncate the current string at the given number of glyphs and add an ellipsis
 * to indicate that is more to the string. The ellipsis forms the last character
 * in the string, so the string is actually truncated at length-1 glyphs.
 * 
 * @param {number} length the number of whole glyphs to keep in the string 
 * including the ellipsis
 * @return {string} a string truncated to the requested number of glyphs
 * with an ellipsis
 */
ilib.GlyphString.prototype.ellipsize = function(length) {
	return this.truncate(length > 0 ? length-1 : 0) + "…";
};


/*
 * normstring.js - ilib normalized string subclass definition
 * 
 * Copyright © 2013-2014, JEDLSoft
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

// !depends strings.js glyphstring.js

/**
 * @class
 * Create a new normalized string instance. This string inherits from 
 * the ilib.GlyphString class, and adds the normalize method. It can be
 * used anywhere that a normal Javascript string is used. <p>
 * 
 * Depends directive: !depends normstring.js
 * 
 * @constructor
 * @param {string|ilib.String=} str initialize this instance with this string 
 */
ilib.NormString = function (str) {
	ilib.GlyphString.call(this, str);
};

ilib.NormString.prototype = new ilib.GlyphString();
ilib.NormString.parent = ilib.GlyphString;
ilib.NormString.prototype.constructor = ilib.NormString;

/**
 * Initialize the normalized string routines statically. This
 * is intended to be called in a dynamic-load version of ilib
 * to load the data need to normalize strings before any instances
 * of ilib.NormString are created.<p>
 * 
 * The options parameter may contain any of the following properties:
 * 
 * <ul>
 * <li><i>form</i> - {string} the normalization form to load
 * <li><i>script</i> - {string} load the normalization for this script. If the 
 * script is given as "all" then the normalization data for all scripts
 * is loaded at the same time
 * <li><i>sync</i> - {boolean} whether to load the files synchronously or not
 * <li><i>loadParams</i> - {Object} parameters to the loader function
 * <li><i>onLoad</i> - {function()} a function to call when the 
 * files are done being loaded
 * </ul>
 * 
 * @param {Object} options an object containing properties that govern 
 * how to initialize the data
 */
ilib.NormString.init = function(options) {
	if (!ilib._load || (typeof(ilib._load) !== 'function' && !(ilib._load instanceof ilib.Loader))) {
		// can't do anything
		return;
	}
	var form = "nfkc";
	var script = "all";
	var sync = true;
	var onLoad = undefined;
	var loadParams = undefined;
	if (options) {
		form = options.form || "nfkc";
		script = options.script || "all";
		sync = typeof(options.sync) !== 'undefined' ? options.sync : true;
		onLoad = typeof(options.onLoad) === 'function' ? options.onLoad : undefined;
		if (options.loadParams) {
			loadParams = options.loadParams;
		}
	}
	var formDependencies = {
		"nfd": ["nfd"],
		"nfc": ["nfd"],
		"nfkd": ["nfkd", "nfd"],
		"nfkc": ["nfkd", "nfd"]
	};
	var files = ["norm.json"];
	var forms = formDependencies[form];
	for (var f in forms) {
		files.push(forms[f] + "/" + script + ".json");
	}
	
	ilib._callLoadData(files, sync, loadParams, function(arr) {
		ilib.data.norm = arr[0];
		for (var i = 1; i < arr.length; i++) {
			if (typeof(arr[i]) !== 'undefined') {
				ilib.data.norm[forms[i-1]] = arr[i];
			}
		}
		
		if (onLoad) {
			onLoad(arr);
		}
	});
};

/**
 * Algorithmically decompose a precomposed Korean syllabic Hangul 
 * character into its individual combining Jamo characters. The given 
 * character must be in the range of Hangul characters U+AC00 to U+D7A3.
 * 
 * @private
 * @static
 * @param {number} cp code point of a Korean Hangul character to decompose
 * @return {string} the decomposed string of Jamo characters
 */
ilib.NormString._decomposeHangul = function (cp) {
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
 * Expand one character according to the given canonical and 
 * compatibility mappings.
 *
 * @private
 * @static
 * @param {string} ch character to map
 * @param {Object} canon the canonical mappings to apply
 * @param {Object=} compat the compatibility mappings to apply, or undefined
 * if only the canonical mappings are needed
 * @return {string} the mapped character
 */
ilib.NormString._expand = function (ch, canon, compat) {
	var i, 
		expansion = "",
		n = ch.charCodeAt(0);
	if (ilib.GlyphString._isHangul(n)) {
		expansion = ilib.NormString._decomposeHangul(n);
	} else {
		var result = canon[ch];
		if (!result && compat) {
			result = compat[ch];
		}
		if (result && result !== ch) {
			for (i = 0; i < result.length; i++) {
				expansion += ilib.NormString._expand(result[i], canon, compat);
			}
		} else {
			expansion = ch;
		}
	}
	return expansion;
};

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
ilib.NormString.prototype.normalize = function (form) {
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
		var ch, it = ilib.String.prototype.charIterator.call(this);
		while (it.hasNext()) {
			ch = it.next();
			decomp += ilib.NormString._expand(ch, ilib.data.norm.nfd, ilib.data.norm.nfkd);
		}
	} else {
		var ch, it = ilib.String.prototype.charIterator.call(this);
		while (it.hasNext()) {
			ch = it.next();
			decomp += ilib.NormString._expand(ch, ilib.data.norm.nfd);
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
		if (typeof(ilib.data.norm.ccc[cpArray[i]]) !== 'undefined' && ccc(cpArray[i]) !== 0) {
			// found a non-starter... rearrange all the non-starters until the next starter
			var end = i+1;
			while (end < cpArray.length &&
					typeof(ilib.data.norm.ccc[cpArray[end]]) !== 'undefined' && 
					ccc(cpArray[end]) !== 0) {
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
							var testChar = ilib.GlyphString._compose(cpArray[i], cpArray[end]);
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
						var testChar = ilib.GlyphString._compose(cpArray[i], cpArray[end]);
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
};
	
/**
 * @override
 * Return an iterator that will step through all of the characters
 * in the string one at a time, taking care to step through decomposed 
 * characters and through surrogate pairs in UTF-16 encoding 
 * properly. <p>
 * 
 * The NormString class will return decomposed Unicode characters
 * as a single unit that a user might see on the screen. If the 
 * next character in the iteration is a base character and it is 
 * followed by combining characters, the base and all its following 
 * combining characters are returned as a single unit.<p>
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
ilib.NormString.prototype.charIterator = function() {
	var it = ilib.String.prototype.charIterator.call(this);
	
	/**
	 * @constructor
	 */
	function _chiterator (istring) {
		/**
		 * @private
		 */
		var ccc = function(c) {
			return ilib.data.norm.ccc[c] || 0;
		};

		this.index = 0;
		this.hasNext = function () {
			return !!this.nextChar || it.hasNext();
		};
		this.next = function () {
			var ch = this.nextChar || it.next(),
				prevCcc = ccc(ch),
				nextCcc,
				composed = ch;
			
			this.nextChar = undefined;
			
			if (ilib.data.norm.ccc && 
					(typeof(ilib.data.norm.ccc[ch]) === 'undefined' || ccc(ch) === 0)) {
				// found a starter... find all the non-starters until the next starter. Must include
				// the next starter because under some odd circumstances, two starters sometimes recompose 
				// together to form another character
				var notdone = true;
				while (it.hasNext() && notdone) {
					this.nextChar = it.next();
					nextCcc = ccc(this.nextChar);
					if (typeof(ilib.data.norm.ccc[this.nextChar]) !== 'undefined' && nextCcc !== 0) {
						ch += this.nextChar;
						this.nextChar = undefined;
					} else {
						// found the next starter. See if this can be composed with the previous starter
						var testChar = ilib.GlyphString._compose(composed, this.nextChar);
						if (prevCcc === 0 && typeof(testChar) !== 'undefined') { 
							// not blocked and there is a mapping 
							composed = testChar;
							ch += this.nextChar;
							this.nextChar = undefined;
						} else {
							// finished iterating, leave this.nextChar for the next next() call 
							notdone = false;
						}
					}
					prevCcc = nextCcc;
				}
			}
			return ch;
		};
	};
	return new _chiterator(this);
};


/*
 * collate.js - Collation routines
 * 
 * Copyright © 2013-2014, JEDLSoft
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

// !depends locale.js ilibglobal.js numprs.js ctype.ispunct.js normstring.js util/math.js

// !data collation

/**
 * @class
 * Represents a buffered source of code points. The input string is first
 * normalized so that combining characters come out in a standardized order.
 * If the "ignorePunctuation" flag is turned on, then punctuation 
 * characters are skipped.
 * 
 * @constructor
 * @private
 * @param {ilib.NormString|string} str a string to get code points from
 * @param {boolean} ignorePunctuation whether or not to ignore punctuation
 * characters
 */
ilib.CodePointSource = function(str, ignorePunctuation) {
	this.chars = [];
	// first convert the string to a normalized sequence of characters
	var s = (typeof(str) === "string") ? new ilib.NormString(str) : str;
	this.it = s.charIterator();
	this.ignorePunctuation = typeof(ignorePunctuation) === "boolean" && ignorePunctuation;
};

/**
 * Return the first num code points in the source without advancing the
 * source pointer. If there are not enough code points left in the
 * string to satisfy the request, this method will return undefined. 
 * 
 * @param {number} num the number of characters to peek ahead
 * @return {string|undefined} a string formed out of up to num code points from
 * the start of the string, or undefined if there are not enough character left
 * in the source to complete the request
 */
ilib.CodePointSource.prototype.peek = function(num) {
	if (num < 1) {
		return undefined;
	}
	if (this.chars.length < num && this.it.hasNext()) {
		for (var i = 0; this.chars.length < 4 && this.it.hasNext(); i++) {
			var c = this.it.next();
			if (c && !this.ignorePunctuation || !ilib.CType.isPunct(c)) {
				this.chars.push(c);
			}
		}
	}
	if (this.chars.length < num) {
		return undefined;
	}
	return this.chars.slice(0, num).join("");
};
/**
 * Advance the source pointer by the given number of code points.
 * @param {number} num number of code points to advance
 */
ilib.CodePointSource.prototype.consume = function(num) {
	if (num > 0) {
		this.peek(num); // for the iterator to go forward if needed
		if (num < this.chars.length) {
			this.chars = this.chars.slice(num);
		} else {
			this.chars = [];
		}
	}
};


/**
 * @class
 * An iterator through a sequence of collation elements. This
 * iterator takes a source of code points, converts them into
 * collation elements, and allows the caller to get single
 * elements at a time.
 * 
 * @constructor
 * @private
 * @param {ilib.CodePointSource} source source of code points to 
 * convert to collation elements
 * @param {Object} map mapping from sequences of code points to
 * collation elements
 * @param {number} keysize size in bits of the collation elements
 */
ilib.ElementIterator = function (source, map, keysize) {
	this.elements = [];
	this.source = source;
	this.map = map;
	this.keysize = keysize;
};

/**
 * @private
 */
ilib.ElementIterator.prototype._fillBuffer = function () {
	var str = undefined;
	
	// peek ahead by up to 4 characters, which may combine
	// into 1 or more collation elements
	for (var i = 4; i > 0; i--) {
		str = this.source.peek(i);
		if (str && this.map[str]) {
			this.elements = this.elements.concat(this.map[str]);
			this.source.consume(i);
			return;
		}
	}
	
	if (str) {
		// no mappings for the first code point, so just use its
		// Unicode code point as a proxy for its sort order. Shift
		// it by the key size so that everything unknown sorts
		// after things that have mappings
		this.elements.push(str.charCodeAt(0) << this.keysize);
		this.source.consume(1);
	} else {
		// end of the string
		return undefined;
	}
};

/**
 * Return true if there are more collation elements left to
 * iterate through.
 * @returns {boolean} true if there are more elements left to
 * iterate through, and false otherwise
 */
ilib.ElementIterator.prototype.hasNext = function () {
	if (this.elements.length < 1) {
		this._fillBuffer();
	}
	return !!this.elements.length;
};

/**
 * Return the next collation element. If more than one collation 
 * element is generated from a sequence of code points 
 * (ie. an "expansion"), then this class will buffer the
 * other elements and return them on subsequent calls to 
 * this method.
 * 
 * @returns {number|undefined} the next collation element or
 * undefined for no more collation elements
 */
ilib.ElementIterator.prototype.next = function () {
	if (this.elements.length < 1) {
		this._fillBuffer();
	}
	var ret = this.elements[0];
	this.elements = this.elements.slice(1);
	return ret;
};


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
 * <li><i>sensitivity</i> - String. Sensitivity or strength of collator. This is one of 
 * "primary", "base", "secondary", "accent", "tertiary", "case", "quaternary", or 
 * "variant". Default: "primary"
 *   <ol>
 *   <li>base or primary - Only the primary distinctions between characters are significant.
 *   Another way of saying that is that the collator will be case-, accent-, and 
 *   variation-insensitive, and only distinguish between the base characters
 *   <li>case or secondary - Both the primary and secondary distinctions between characters
 *   are significant. That is, the collator will be accent- and variation-insensitive
 *   and will distinguish between base characters and character case.
 *   <li>accent or tertiary - The primary, secondary, and tertiary distinctions between
 *   characters are all significant. That is, the collator will be 
 *   variation-insensitive, but accent-, case-, and base-character-sensitive. 
 *   <li>variant or quaternary - All distinctions between characters are significant. That is,
 *   the algorithm is base character-, case-, accent-, and variation-sensitive.
 *   </ol>
 *   
 * <li><i>upperFirst</i> - boolean. When collating case-sensitively in a script that
 * has the concept of case, put upper-case
 * characters first, otherwise lower-case will come first. Warning: some browsers do
 * not implement this feature or at least do not implement it properly, so if you are 
 * using the native collator with this option, you may get different results in different
 * browsers. To guarantee the same results, set useNative to false to use the ilib 
 * collator implementation. This of course will be somewhat slower, but more 
 * predictable. Default: true
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
 * The static method {@link ilib.Collator#getAvailableStyles} will return a list of styles that ilib
 * currently knows about for any given locale. If the value of the style option is 
 * not recognized for a locale, it will be ignored. Default style is "standard".<p>
 * 
 * <li><i>usage</i> - Whether this collator will be used for searching or sorting.
 * Valid values are simply the strings "sort" or "search". When used for sorting,
 * it is good idea if a collator produces a stable sort. That is, the order of the 
 * sorted array of strings should not depend on the order of the strings in the
 * input array. As such, when a collator is supposed to act case insensitively, 
 * it nonetheless still distinguishes between case after all other criteria
 * are satisfied so that strings that are distinguished only by case do not sort
 * randomly. For searching, we would like to match two strings that different only 
 * by case, so the collator must return equals in that situation instead of 
 * further distinguishing by case. Default is "sort".
 * 
 * <li><i>numeric</i> - Treat the left and right strings as if they started with
 * numbers and sort them numerically rather than lexically.
 * 
 * <li><i>ignorePunctuation</i> - Skip punctuation characters when comparing the
 * strings.
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
 * 
 * <li><i>useNative</i> - when this option is true, use the native Intl object
 * provided by the Javascript engine, if it exists, to implement this class. If
 * it doesn't exist, or if this parameter is false, then this class uses a pure 
 * Javascript implementation, which is slower and uses a lot more memory, but 
 * works everywhere that ilib works. Default is "true".
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
 * @constructor
 * @param {Object} options options governing how the resulting comparator 
 * function will operate
 */
ilib.Collator = function(options) {
	var sync = true,
		loadParams = undefined,
		useNative = true;

	// defaults
	/** 
	 * @private
	 * @type {ilib.Locale} 
	 */
	this.locale = new ilib.Locale(ilib.getLocale());
	
	/** @private */
	this.caseFirst = "upper";
	/** @private */
	this.sensitivity = "variant";
	/** @private */
	this.level = 4;
	/** @private */
	this.usage = "sort";
	/** @private */
	this.reverse = false;
	/** @private */
	this.numeric = false;
	/** @private */
	this.style = "standard";
	/** @private */
	this.ignorePunctuation = false;
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		if (options.sensitivity) {
			switch (options.sensitivity) {
				case 'primary':
				case 'base':
					this.sensitivity = "base";
					this.level = 1;
					break;
				case 'secondary':
				case 'case':
					this.sensitivity = "case";
					this.level = 2;
					break;
				case 'tertiary':
				case 'accent':
					this.sensitivity = "accent";
					this.level = 3;
					break;
				case 'quaternary':
				case 'variant':
					this.sensitivity = "variant";
					this.level = 4;
					break;
			}
		}
		if (typeof(options.upperFirst) !== 'undefined') {
			this.caseFirst = options.upperFirst ? "upper" : "lower"; 
		}
		
		if (typeof(options.ignorePunctuation) !== 'undefined') {
			this.ignorePunctuation = options.ignorePunctuation;
		}
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		loadParams = options.loadParams;
		if (typeof(options.useNative) !== 'undefined') {
			useNative = options.useNative;
		}
		
		if (options.usage === "sort" || options.usage === "search") {
			this.usage = options.usage;
		}
		
		if (typeof(options.reverse) === 'boolean') {
			this.reverse = options.reverse;
		}

		if (typeof(options.numeric) === 'boolean') {
			this.numeric = options.numeric;
		}
		
		if (typeof(options.style) === 'string') {
			this.style = options.style;
		}
	}

	if (this.usage === "sort") {
		// produces a stable sort
		this.level = 4;
	}

	if (useNative && typeof(Intl) !== 'undefined' && Intl) {
		// this engine is modern and supports the new Intl object!
		//console.log("implemented natively");
		/** 
		 * @private
		 * @type {{compare:function(string,string)}} 
		 */
		this.collator = new Intl.Collator(this.locale.getSpec(), this);
		
		if (options && typeof(options.onLoad) === 'function') {
			options.onLoad(this);
		}
	} else {
		//console.log("implemented in pure JS");
		if (!ilib.Collator.cache) {
			ilib.Collator.cache = {};
		}

		// else implement in pure Javascript
		ilib.loadData({
			object: ilib.Collator, 
			locale: this.locale, 
			name: "collation.json",
			replace: true,
			sync: sync,
			loadParams: loadParams, 
			callback: ilib.bind(this, function (collation) {
				if (!collation) {
					collation = ilib.data.collation;
					var spec = this.locale.getSpec().replace(/-/g, '_');
					ilib.Collator.cache[spec] = collation;
				}
				this._init(collation);
				new ilib.LocaleInfo(this.locale, {
					sync: sync,
					loadParams: loadParams,
					onLoad: ilib.bind(this, function(li) {
						this.li = li;
						if (this.ignorePunctuation) {
			    			ilib.CType.isPunct._init(sync, loadParams, ilib.bind(this, function() {
								if (options && typeof(options.onLoad) === 'function') {
									options.onLoad(this);
								}
			    			}));
		    			} else {
							if (options && typeof(options.onLoad) === 'function') {
								options.onLoad(this);
							}
		    			}
		    		})
				});
			})
		});
	}
};

ilib.Collator.prototype = {
	/**
	 * @private
	 * Bit pack an array of values into a single number
	 * @param {number|null|Array.<number>} arr array of values to bit pack
	 */
	_pack: function (arr) {
		var value = 0;
		if (arr) {
			if (typeof(arr) === 'number') {
				arr = [ arr ];
			}
			for (var i = 0; i < this.level; i++) {
				if (i > 0) {
					value <<= this.collation.bits[i];	
				}
				if (i === 2 && this.caseFirst === "lower") {
					// sort the lower case first instead of upper
					value = value | (1 - (typeof(arr[i]) !== "undefined" ? arr[i] : 0));
				} else {
					value = value | arr[i];
				}
			}
		}
		return value;
	},
	
	/**
	 * @private
	 * Return the rule packed into an array of collation elements.
	 * @param {Array.<number|null|Array.<number>>} rule
	 * @return {Array.<number>} a bit-packed array of numbers
	 */
	_packRule: function(rule) {
		if (rule[0] instanceof Array) {
			var ret = [];
			for (var i = 0; i < rule.length; i++) {
				ret.push(this._pack(rule[i]));
			}
			return ret;
		} else {
			return [ this._pack(rule) ];
		}
	},
    	
	/**
     * @private
     */
    _init: function(rules) {
    	/** 
    	 * @private
    	 * @type {{scripts:Array.<string>,bits:Array.<number>,maxes:Array.<number>,bases:Array.<number>,map:Object.<string,Array.<number|null|Array.<number>>>}}
    	 */
    	this.collation = rules[this.style];
    	this.map = {};
    	this.keysize = 0;
    	for (var i = 0; i < this.level; i++) {
    		this.keysize += this.collation.bits[i];
    	}
    	var remainder = ilib.mod(this.keysize, 4);
    	this.keysize += (remainder > 0) ? (4 - remainder) : 0; // round to the nearest 4 to find how many bits to use in hex
    	
    	for (var r in this.collation.map) {
    		if (r) {
    			this.map[r] = this._packRule(this.collation.map[r]);
    		}
    	}
    },
    
    /**
     * @private
     */
    _basicCompare: function(left, right) {
		if (this.numeric) {
			var lvalue = new ilib.Number(left, {locale: this.locale});
			var rvalue = new ilib.Number(right, {locale: this.locale});
			if (isNaN(lvalue.valueOf())) {
				if (isNaN(rvalue.valueOf())) {
					return 0;
				}
				return 1;
			} else if (isNaN(rvalue.valueOf())) {
				return -1;
			}
			return lvalue.valueOf() - rvalue.valueOf();
		} else {
			var l = (left instanceof ilib.NormString) ? left : new ilib.NormString(left),
				r = (right instanceof ilib.NormString) ? right : new ilib.NormString(right),
				lelements,
				relements;
				
			// if the reverse sort is on, switch the char sources so that the result comes out swapped
			lelements = new ilib.ElementIterator(new ilib.CodePointSource(l, this.ignorePunctuation), this.map, this.keysize);
			relements = new ilib.ElementIterator(new ilib.CodePointSource(r, this.ignorePunctuation), this.map, this.keysize);
			
			while (lelements.hasNext() && relements.hasNext()) {
				var diff = lelements.next() - relements.next();
				if (diff) {
					return diff;
				}
			}
			if (!lelements.hasNext() && !relements.hasNext()) {
				return 0;
			} else if (lelements.hasNext()) {
				return 1;
			} else {
				return -1;
			}
		}
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
		// last resort: use the "C" locale
		if (this.collator) {
			// implemented by the core engine
			return this.collator.compare(left, right);
		}

		var ret = this._basicCompare(left, right);
		return this.reverse ? -ret : ret;
	},
	
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
	 * @return {function(...)|undefined} a comparator function that 
	 * can compare two strings together according to the rules of this 
	 * collator instance
	 */
	getComparator: function() {
		// bind the function to this instance so that we have the collation
		// rules available to do the work
		if (this.collator) {
			// implemented by the core engine
			return this.collator.compare;
		}
		
		return /** @type function(string,string):number */ ilib.bind(this, this.compare);
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
		if (!str) {
			return "";
		}
		
		if (this.collator) {
			// native, no sort keys available
			return str;
		}
		
		function pad(str, limit) {
			return "0000000000000000".substring(0, limit - str.length) + str;
		}
		
		if (this.numeric) {
			var v = new ilib.Number(str, {locale: this.locale});
			var s = isNaN(v.valueOf()) ? "" : v.valueOf().toString(16);
			return pad(s, 16);	
		} else {
			var n = (typeof(str) === "string") ? new ilib.NormString(str) : str,
				ret = "",
				lelements = new ilib.ElementIterator(new ilib.CodePointSource(n, this.ignorePunctuation), this.map, this.keysize),
				element;
			
			while (lelements.hasNext()) {
				element = lelements.next();
				if (this.reverse) {
					element = (1 << this.keysize) - element;
				}
				ret += pad(element.toString(16), this.keysize/4);	
			}
		}
		return ret;
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

/*
 * all.js - include file for normalization data for a particular script
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
/* WARNING: THIS IS A FILE GENERATED BY gennorm.js. DO NOT EDIT BY HAND. */
// !depends util/utils.js 
// !data norm nfd/all
ilib.data.norm.nfd = ilib.merge(ilib.data.norm.nfd || {}, ilib.data.nfd_all);
ilib.data.nfd_all = undefined;
/*
 * all.js - include file for normalization data for a particular script
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
/* WARNING: THIS IS A FILE GENERATED BY gennorm.js. DO NOT EDIT BY HAND. */
// !depends util/utils.js 
// !depends nfd/all.js
// !data norm

/*
 * all.js - include file for normalization data for a particular script
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
/* WARNING: THIS IS A FILE GENERATED BY gennorm.js. DO NOT EDIT BY HAND. */
// !depends util/utils.js 
// !depends nfd/all.js
// !data norm nfkd/all
ilib.data.norm.nfkd = ilib.merge(ilib.data.norm.nfkd || {}, ilib.data.nfkd_all);
ilib.data.nfkd_all = undefined;
/*
 * all.js - include file for normalization data for a particular script
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
/* WARNING: THIS IS A FILE GENERATED BY gennorm.js. DO NOT EDIT BY HAND. */
// !depends util/utils.js 
// !depends nfd/all.js nfc/all.js nfkd/all.js
// !data norm

/*
 * localematch.js - Locale matcher definition
 * 
 * Copyright © 2013-2014, JEDLSoft
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
// !data likelylocales

/**
 * @class
 * Create a new locale matcher instance. This is used
 * to see which locales can be matched with each other in
 * various ways.<p>
 * 
 * The options object may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - the locale to match
 * 
 * <li><i>onLoad</i> - a callback function to call when the locale matcher object is fully 
 * loaded. When the onLoad option is given, the locale matcher object will attempt to
 * load any missing locale data using the ilib loader callback.
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
 * Depends directive: !depends localematch.js
 * 
 * @constructor
 * @param {Object} options parameters to initialize this matcher 
 */
ilib.LocaleMatcher = function(options) {
	var sync = true,
	    loadParams = undefined;
	
	this.locale = new ilib.Locale();
	
	if (options) {
		if (typeof(options.locale) !== 'undefined') {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		if (typeof(options.loadParams) !== 'undefined') {
			loadParams = options.loadParams;
		}
	}

	if (!ilib.LocaleMatcher.cache) {
		ilib.LocaleMatcher.cache = {};
	}

	if (typeof(ilib.data.likelylocales) === 'undefined') {
		ilib.loadData({
			object: ilib.LocaleMatcher, 
			locale: "-", 
			name: "likelylocales.json", 
			sync: sync, 
			loadParams: loadParams, 
			callback: ilib.bind(this, function (info) {
				if (!info) {
					info = {};
					var spec = this.locale.getSpec().replace(/-/g, "_");
					ilib.LocaleMatcher.cache[spec] = info;
				}
				/** @type {Object.<string,string>} */
				this.info = info;
				if (options && typeof(options.onLoad) === 'function') {
					options.onLoad(this);
				}
			})
		});
	} else {
		this.info = /** @type {Object.<string,string>} */ ilib.data.likelylocales;
	}
};


ilib.LocaleMatcher.prototype = {
	/**
	 * Return the locale used to construct this instance. 
	 * @return {ilib.Locale|undefined} the locale for this matcher
	 */
	getLocale: function() {
		return this.locale;
	},
	
	/**
	 * Return an ilib.Locale instance that is fully specified based on partial information
	 * given to the constructor of this locale matcher instance. For example, if the locale
	 * spec given to this locale matcher instance is simply "ru" (for the Russian language), 
	 * then it will fill in the missing region and script tags and return a locale with 
	 * the specifier "ru-Cyrl-RU". (ie. Russian language, Cyrillic, Russian Federation).
	 * Any one or two of the language, script, or region parts may be left unspecified,
	 * and the other one or two parts will be filled in automatically. If this
	 * class has no information about the given locale, then the locale of this
	 * locale matcher instance is returned unchanged.
	 * 
	 * @returns {ilib.Locale} the most likely completion of the partial locale given
	 * to the constructor of this locale matcher instance
	 */
	getLikelyLocale: function () {
		if (typeof(this.info[this.locale.getSpec()]) === 'undefined') {
			return this.locale;
		}
		
		return new ilib.Locale(this.info[this.locale.getSpec()]);
	}
};


/*
 * casemapper.js - define upper- and lower-case mapper
 * 
 * Copyright © 2014-2015, JEDLSoft
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

// !depends locale.js util/utils.js

/**
 * @class
 * Create a new string mapper instance that maps strings to upper or
 * lower case. This mapping will work for any string as characters 
 * that have no case will be returned unchanged.<p>
 * 
 * The options may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - locale to use when loading the mapper. Some maps are 
 * locale-dependent, and this locale selects the right one. Default if this is
 * not specified is the current locale.
 * 
 * <li><i>direction</i> - "toupper" for upper-casing, or "tolower" for lower-casing.
 * Default if not specified is "toupper".
 * </ul>
 * 
 * Depends directive: !depends casemapper.js
 * 
 * @constructor
 * @param {Object=} options options to initialize this mapper 
 */
ilib.CaseMapper = function (options) {
	this.up = true;
	this.locale = new ilib.Locale();
	
	if (options) {
		if (typeof(options.locale) !== 'undefined') {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		this.up = (!options.direction || options.direction === "toupper");
	}

	this.mapData = this.up ? {
		"ß": "SS",		// German
		'ΐ': 'Ι',		// Greek
		'ά': 'Α',
		'έ': 'Ε',
		'ή': 'Η',
		'ί': 'Ι',
		'ΰ': 'Υ',
		'ϊ': 'Ι',
		'ϋ': 'Υ',
		'ό': 'Ο',
		'ύ': 'Υ',
		'ώ': 'Ω',
		'Ӏ': 'Ӏ',		// Russian and slavic languages
		'ӏ': 'Ӏ'
	} : {
		'Ӏ': 'Ӏ'		// Russian and slavic languages
	};

	switch (this.locale.getLanguage()) {
		case "az":
		case "tr":
		case "crh":
		case "kk":
		case "krc":
		case "tt":
			var lower = "iı";
			var upper = "İI";
			this._setUpMap(lower, upper);
			break;
		case "fr":
			if (this.up && this.locale.getRegion() !== "CA") {
				this._setUpMap("àáâãäçèéêëìíîïñòóôöùúûü", "AAAAACEEEEIIIINOOOOUUUU");
			}
			break;
	}
	
	if (ilib._getBrowser() === "ie") {
		// IE is missing these mappings for some reason
		if (this.up) {
			this.mapData['ς'] = 'Σ';
		}
		this._setUpMap("ⲁⲃⲅⲇⲉⲋⲍⲏⲑⲓⲕⲗⲙⲛⲝⲟⲡⲣⲥⲧⲩⲫⲭⲯⲱⳁⳉⳋ", "ⲀⲂⲄⲆⲈⲊⲌⲎⲐⲒⲔⲖⲘⲚⲜⲞⲠⲢⲤⲦⲨⲪⲬⲮⲰⳀⳈⳊ"); // Coptic
		// Georgian Nuskhuri <-> Asomtavruli
		this._setUpMap("ⴀⴁⴂⴃⴄⴅⴆⴇⴈⴉⴊⴋⴌⴍⴎⴏⴐⴑⴒⴓⴔⴕⴖⴗⴘⴙⴚⴛⴜⴝⴞⴟⴠⴡⴢⴣⴤⴥ", "ႠႡႢႣႤႥႦႧႨႩႪႫႬႭႮႯႰႱႲႳႴႵႶႷႸႹႺႻႼႽႾႿჀჁჂჃჄჅ");	
	}
};

ilib.CaseMapper.prototype = {
	/** 
	 * @private 
	 */
	_charMapper: function(string) {
		if (!string) {
			return string;
		}
		var input = (typeof(string) === 'string') ? new ilib.String(string) : string.toString();
		var ret = "";
		var it = input.charIterator();
		var c;
		
		while (it.hasNext()) {
			c = it.next();
			if (!this.up && c === 'Σ') {
				if (it.hasNext()) {
					c = it.next();
					var code = c.charCodeAt(0);
					// if the next char is not a greek letter, this is the end of the word so use the
					// final form of sigma. Otherwise, use the mid-word form.
					ret += ((code < 0x0388 && code !== 0x0386) || code > 0x03CE) ? 'ς' : 'σ';
					ret += c.toLowerCase();
				} else {
					// no next char means this is the end of the word, so use the final form of sigma
					ret += 'ς';
				}
			} else {
				if (this.mapData[c]) {
					ret += this.mapData[c];
				} else {
					ret += this.up ? c.toUpperCase() : c.toLowerCase();
				}
			}
		}
		
		return ret;
	},

	/** @private */
	_setUpMap: function(lower, upper) {
		var from, to;
		if (this.up) {
			from = lower;
			to = upper;
		} else {
			from = upper;
			to = lower;
		}
		for (var i = 0; i < upper.length; i++) {
			this.mapData[from[i]] = to[i];
		}
	},

	/**
	 * Return the locale that this mapper was constructed with. 
	 * @returns {ilib.Locale} the locale that this mapper was constructed with
	 */
	getLocale: function () {
		return this.locale;
	},
		
	/**
	 * Map a string to lower case in a locale-sensitive manner.
	 * 
	 * @param {string|undefined} string
	 * @return {string|undefined}
	 */
	map: function (string) {
		return this._charMapper(string);
	}
};
/*
 * numplan.js - Represent a phone numbering plan.
 * 
 * Copyright © 2014, JEDLSoft
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
*/

// !data numplan

/**
 * @class
 * Create a numbering plan information instance for a particular country's plan.<p>
 * 
 * The options may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - locale for which the numbering plan is sought. This locale
 * will be mapped to the actual numbering plan, which may be shared amongst a
 * number of countries.
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
 *  
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * Depends directive: !depends phone/numplan.js
 * 
 * @constructor
 * @package
 * @param {Object} options options governing the way this plan is loaded
 */
ilib.NumPlan = function (options) {
	var sync = true,
	    loadParams = {};
	
	this.locale = new ilib.Locale();

	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		if (options.loadParams) {
			loadParams = options.loadParams;
		}
	}	

	ilib.loadData({
		name: "numplan.json",
		object: ilib.NumPlan,
		locale: this.locale,
		sync: sync, 
		loadParams: loadParams, 
		callback: ilib.bind(this, function (npdata) {
			if (!npdata) {
				npdata = {
					"region": "XX",
					"skipTrunk": false,
					"trunkCode": "0",
					"iddCode": "00",
					"dialingPlan": "closed",
					"commonFormatChars": " ()-./",
					"fieldLengths": {
						"areaCode": 0,
						"cic": 0,
						"mobilePrefix": 0,
						"serviceCode": 0
					}
				};
			}

			/** 
			 * @type {{
			 *   region:string,
			 *   skipTrunk:boolean,
			 *   trunkCode:string,
			 *   iddCode:string,
			 *   dialingPlan:string,
			 *   commonFormatChars:string,
			 *   fieldLengths:Object.<string,number>,
			 *   contextFree:boolean,
			 *   findExtensions:boolean,
			 *   trunkRequired:boolean,
			 *   extendedAreaCodes:boolean
			 * }}
			 */
			this.npdata = npdata;
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
		})
	});
};

ilib.NumPlan.prototype = {
	/**
	 * Return the name of this plan. This may be different than the 
	 * name of the region because sometimes multiple countries share 
	 * the same plan.
	 * @return {string} the name of the plan
	 */
	getName: function() {
		return this.npdata.region;
	},

	/**
	 * Return the trunk code of the current plan as a string.
	 * @return {string|undefined} the trunk code of the plan or
	 * undefined if there is no trunk code in this plan
	 */
	getTrunkCode: function() {
		return this.npdata.trunkCode;
	},
	
	/**
	 * Return the international direct dialing code of this plan.
	 * @return {string} the IDD code of this plan
	 */
	getIDDCode: function() {
		return this.npdata.iddCode;	
	},
	
	/**
	 * Return the plan style for this plan. The plan style may be
	 * one of:
	 * 
	 * <ul>
	 * <li>"open" - area codes may be left off if the caller is 
	 * dialing to another number within the same area code
	 * <li>"closed" - the area code must always be specified, even
	 * if calling another number within the same area code
	 * </ul>
	 * 
	 * @return {string} the plan style, "open" or "closed"
	 */
	getPlanStyle: function() {	
		return this.npdata.dialingPlan;
	},
	/** [Need Comment]
	 * Return a contextFree
	 *
	 * @return {boolean}
	 */
	getContextFree: function() {
		return this.npdata.contextFree;
	},
	/** [Need Comment]
	 * Return a findExtensions
	 * 
	 * @return {boolean}
	 */
	getFindExtensions: function() {
		return this.npdata.findExtensions;
	},
	/** [Need Comment]
	 * Return a skipTrunk
	 * 
	 * @return {boolean}
	 */
	getSkipTrunk: function() {
		return this.npdata.skipTrunk;
	},
	/** [Need Comment]
	 * Return a skipTrunk
	 * 
	 * @return {boolean}
	 */
	getTrunkRequired: function() {
		return this.npdata.trunkRequired;
	},
	/**
	 * Return true if this plan uses extended area codes.
	 * @return {boolean} true if the plan uses extended area codes
	 */
	getExtendedAreaCode: function() {
		return this.npdata.extendedAreaCodes;
	},
	/**
	 * Return a string containing all of the common format characters
	 * used to format numbers.
	 * @return {string} the common format characters fused in this locale
	 */
	getCommonFormatChars: function() {
		return this.npdata.commonFormatChars;
	},
	
	/**
	 * Return the length of the field with the given name. If the length
	 * is returned as 0, this means it is variable length.
	 * 
	 * @param {string} field name of the field for which the length is 
	 * being sought
	 * @return {number} if positive, this gives the length of the given 
	 * field. If zero, the field is variable length. If negative, the
	 * field is not known.
	 */
	getFieldLength: function (field) {
		var dataField = this.npdata.fieldLengths;
		
		return dataField[field];
	}
};

/*
 * phoneloc.js - Represent a phone locale object.
 * 
 * Copyright © 2014, JEDLSoft
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
*/

// !data phoneloc

/**
 * @class
 *
 * @param {Object} options Options that govern how this phone locale works
 * @constructor
 * @private
 * @extends ilib.Locale
 */
ilib.Locale.PhoneLoc = function(options) {
	var region,
		mcc,
		cc,
		sync = true,
		loadParams = {},
		locale;
	
	locale = (options && options.locale) || ilib.getLocale();

	this.parent.call(this, locale);
	
	region = this.region;
	
	if (options) {
		if (typeof(options.mcc) !== 'undefined') {
			mcc = options.mcc;
		}
		
		if (typeof(options.countryCode) !== 'undefined') {
			cc = options.countryCode;
		}

		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		if (options.loadParams) {
			loadParams = options.loadParams;
		}
	}

	ilib.loadData({
		name: "phoneloc.json",
		object: ilib.Locale.PhoneLoc,
		nonlocale: true,
		sync: sync, 
		loadParams: loadParams, 
		callback: ilib.bind(this, function (data) {
			/** @type {{mcc2reg:Object.<string,string>,cc2reg:Object.<string,string>,reg2cc:Object.<string,string>,area2reg:Object.<string,string>}} */
			this.mappings = data;
			
			if (typeof(mcc) !== 'undefined') {
				region = this.mappings.mcc2reg[mcc];	
			}

			if (typeof(cc) !== 'undefined') {
				region = this.mappings.cc2reg[cc];
			}

			if (!region) {
				region = "XX";
			}

			this.region = this._normPhoneReg(region);
			this._genSpec();

			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}									
		})
	});
};

ilib.Locale.PhoneLoc.prototype = new ilib.Locale();
ilib.Locale.PhoneLoc.prototype.parent = ilib.Locale;
ilib.Locale.PhoneLoc.prototype.constructor = ilib.Locale.PhoneLoc;

/**
 * Map a mobile carrier code to a region code.
 *
 * @static
 * @package
 * @param {string|undefined} mcc the MCC to map
 * @return {string|undefined} the region code
 */

ilib.Locale.PhoneLoc.prototype._mapMCCtoRegion = function(mcc) {
	if (!mcc) {
		return undefined;
	}
	return this.mappings.mcc2reg && this.mappings.mcc2reg[mcc] || "XX";
};

/**
 * Map a country code to a region code.
 *
 * @static
 * @package
 * @param {string|undefined} cc the country code to map
 * @return {string|undefined} the region code
 */
ilib.Locale.PhoneLoc.prototype._mapCCtoRegion = function(cc) {
	if (!cc) {
		return undefined;
	}
	return this.mappings.cc2reg && this.mappings.cc2reg[cc] || "XX";
};

/**
 * Map a region code to a country code.
 *
 * @static
 * @package
 * @param {string|undefined} region the region code to map
 * @return {string|undefined} the country code
 */
ilib.Locale.PhoneLoc.prototype._mapRegiontoCC = function(region) {
	if (!region) {
		return undefined;
	}
	return this.mappings.reg2cc && this.mappings.reg2cc[region] || "0";
};

/**
 * Map a country code to a region code.
 *
 * @static
 * @package
 * @param {string|undefined} cc the country code to map
 * @param {string|undefined} area the area code within the country code's numbering plan
 * @return {string|undefined} the region code
 */
ilib.Locale.PhoneLoc.prototype._mapAreatoRegion = function(cc, area) {
	if (!cc) {
		return undefined;
	}
	if (cc in this.mappings.area2reg) {
		return this.mappings.area2reg[cc][area] || this.mappings.area2reg[cc]["default"];
	} else {
		return this.mappings.cc2reg[cc];
	}
};

/**
 * Return the region that controls the dialing plan in the given
 * region. (ie. the "normalized phone region".)
 * 
 * @static
 * @package
 * @param {string} region the region code to normalize
 * @return {string} the normalized region code
 */
ilib.Locale.PhoneLoc.prototype._normPhoneReg = function(region) {
	var norm;
	
	// Map all NANP regions to the right region, so that they get parsed using the 
	// correct state table
	switch (region) {
		case "US": // usa
		case "CA": // canada
		case "AG": // antigua and barbuda
		case "BS": // bahamas
		case "BB": // barbados
		case "DM": // dominica
		case "DO": // dominican republic
		case "GD": // grenada
		case "JM": // jamaica
		case "KN": // st. kitts and nevis
		case "LC": // st. lucia
		case "VC": // st. vincent and the grenadines
		case "TT": // trinidad and tobago
		case "AI": // anguilla
		case "BM": // bermuda
		case "VG": // british virgin islands
		case "KY": // cayman islands
		case "MS": // montserrat
		case "TC": // turks and caicos
		case "AS": // American Samoa 
		case "VI": // Virgin Islands, U.S.
		case "PR": // Puerto Rico
		case "MP": // Northern Mariana Islands
		case "T:": // East Timor
		case "GU": // Guam
			norm = "US";
			break;
		
		// these all use the Italian dialling plan
		case "IT": // italy
		case "SM": // san marino
		case "VA": // vatican city
			norm = "IT";
			break;
		
		// all the French dependencies are on the French dialling plan
		case "FR": // france
		case "GF": // french guiana
		case "MQ": // martinique
		case "GP": // guadeloupe, 
		case "BL": // saint barthélemy
		case "MF": // saint martin
		case "RE": // réunion, mayotte
			norm = "FR";
			break;
		default:
			norm = region;
			break;
	}	
	return norm;
};
/*
 * handler.js - Handle phone number parse states
 * 
 * Copyright © 2014, JEDLSoft
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
phone/phoneloc.js
*/

/**
 * @class
 * [Need Comments] globals console ilib PhoneLoc 
 *
 * @private
 * @constructor
 */
ilib.StateHandler = function _StateHandler () {
	return this;
};

ilib.StateHandler.prototype = {
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	processSubscriberNumber: function(number, fields, regionSettings) {
		var last;
		
		last = number.search(/[xwtp,;]/i);	// last digit of the local number

		if (last > -1) {
			if (last > 0) {
				fields.subscriberNumber = number.substring(0, last);
			}
			// strip x's which are there to indicate a break between the local subscriber number and the extension, but
			// are not themselves a dialable character
			fields.extension = number.substring(last).replace('x', '');
		} else {
			if (number.length) {
				fields.subscriberNumber = number;
			}
		}
		
		if (regionSettings.plan.getFieldLength('maxLocalLength') &&
				fields.subscriberNumber &&
				fields.subscriberNumber.length > regionSettings.plan.getFieldLength('maxLocalLength')) {
			fields.invalid = true;
		}
	},
	/**
	 * @private
	 * @param {string} fieldName 
	 * @param {number} length length of phone number
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 * @param {boolean} noExtractTrunk 
	 */
	processFieldWithSubscriberNumber: function(fieldName, length, number, currentChar, fields, regionSettings, noExtractTrunk) {
		var ret, end;
		
		if (length !== undefined && length > 0) {
			// fixed length
			end = length;
			if (regionSettings.plan.getTrunkCode() === "0" && number.charAt(0) === "0") {
				end += regionSettings.plan.getTrunkCode().length;  // also extract the trunk access code
			}
		} else {
			// variable length
			// the setting is the negative of the length to add, so subtract to make it positive
			end = currentChar + 1 - length;
		}
		
		if (fields[fieldName] !== undefined) {
			// we have a spurious recognition, because this number already contains that field! So, just put
			// everything into the subscriberNumber as the default
			this.processSubscriberNumber(number, fields, regionSettings);
		} else {
			fields[fieldName] = number.substring(0, end);
			if (number.length > end) {
				this.processSubscriberNumber(number.substring(end), fields, regionSettings);
			}
		}
		
		ret = {
			number: ""
		};

		return ret;
	},
	/**
	 * @private
	 * @param {string} fieldName 
	 * @param {number} length length of phone number
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	processField: function(fieldName, length, number, currentChar, fields, regionSettings) {
		var ret = {}, end;
		
		if (length !== undefined && length > 0) {
			// fixed length
			end = length;
			if (regionSettings.plan.getTrunkCode() === "0" && number.charAt(0) === "0") {
				end += regionSettings.plan.getTrunkCode().length;  // also extract the trunk access code
			}
		} else {
			// variable length
			// the setting is the negative of the length to add, so subtract to make it positive
			end = currentChar + 1 - length;
		}
		
		if (fields[fieldName] !== undefined) {
			// we have a spurious recognition, because this number already contains that field! So, just put
			// everything into the subscriberNumber as the default
			this.processSubscriberNumber(number, fields, regionSettings);
			ret.number = "";
		} else {
			fields[fieldName] = number.substring(0, end);			
			ret.number = (number.length > end) ? number.substring(end) : "";
		}
		
		return ret;
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	trunk: function(number, currentChar, fields, regionSettings) {
		var ret, trunkLength;
		
		if (fields.trunkAccess !== undefined) {
			// What? We already have one? Okay, put the rest of this in the subscriber number as the default behaviour then.
			this.processSubscriberNumber(number, fields, regionSettings);
			number = "";
		} else {
			trunkLength = regionSettings.plan.getTrunkCode().length;
			fields.trunkAccess = number.substring(0, trunkLength);
			number = (number.length > trunkLength) ? number.substring(trunkLength) : "";
		}
		
		ret = {
			number: number
		};
		
		return ret;
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	plus: function(number, currentChar, fields, regionSettings) {
		var ret = {};
		
		if (fields.iddPrefix !== undefined) {
			// What? We already have one? Okay, put the rest of this in the subscriber number as the default behaviour then.
			this.processSubscriberNumber(number, fields, regionSettings);
			ret.number = "";
		} else {
			// found the idd prefix, so save it and cause the function to parse the next part
			// of the number with the idd table
			fields.iddPrefix = number.substring(0, 1);
	
			ret = {
				number: number.substring(1),
				table: 'idd'    // shared subtable that parses the country code
			};
		}		
		return ret;
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	idd: function(number, currentChar, fields, regionSettings) {
		var ret = {};
		
		if (fields.iddPrefix !== undefined) {
			// What? We already have one? Okay, put the rest of this in the subscriber number as the default behaviour then.
			this.processSubscriberNumber(number, fields, regionSettings);
			ret.number = "";
		} else {
			// found the idd prefix, so save it and cause the function to parse the next part
			// of the number with the idd table
			fields.iddPrefix = number.substring(0, currentChar+1);
	
			ret = {
				number: number.substring(currentChar+1),
				table: 'idd'    // shared subtable that parses the country code
			};
		}
		
		return ret;
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */	
	country: function(number, currentChar, fields, regionSettings) {
		var ret, cc;
		
		// found the country code of an IDD number, so save it and cause the function to 
		// parse the rest of the number with the regular table for this locale
		fields.countryCode = number.substring(0, currentChar+1);
		cc = fields.countryCode.replace(/[wWpPtT\+#\*]/g, ''); // fix for NOV-108200
		// console.log("Found country code " + fields.countryCode + ". Switching to country " + locale.region + " to parse the rest of the number");
		
		ret = {
			number: number.substring(currentChar+1),
			countryCode: cc
		};
		
		return ret;
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	cic: function(number, currentChar, fields, regionSettings) {
		return this.processField('cic', regionSettings.plan.getFieldLength('cic'), number, currentChar, fields, regionSettings);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	service: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.plan.getFieldLength('serviceCode'), number, currentChar, fields, regionSettings, false);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	area: function(number, currentChar, fields, regionSettings) {
		var ret, last, end, localLength;
		
		last = number.search(/[xwtp]/i);	// last digit of the local number
		localLength = (last > -1) ? last : number.length;

		if (regionSettings.plan.getFieldLength('areaCode') > 0) {
			// fixed length
			end = regionSettings.plan.getFieldLength('areaCode');
			if (regionSettings.plan.getTrunkCode() === number.charAt(0)) {
				end += regionSettings.plan.getTrunkCode().length;  // also extract the trunk access code
				localLength -= regionSettings.plan.getTrunkCode().length;
			}
		} else {
			// variable length
			// the setting is the negative of the length to add, so subtract to make it positive
			end = currentChar + 1 - regionSettings.plan.getFieldLength('areaCode');
		}
		
		// substring() extracts the part of the string up to but not including the end character,
		// so add one to compensate
		if (regionSettings.plan.getFieldLength('maxLocalLength') !== undefined) {
			if (fields.trunkAccess !== undefined || fields.mobilePrefix !== undefined ||
					fields.countryCode !== undefined ||
					localLength > regionSettings.plan.getFieldLength('maxLocalLength')) {
				// too long for a local number by itself, or a different final state already parsed out the trunk
				// or mobile prefix, then consider the rest of this number to be an area code + part of the subscriber number
				fields.areaCode = number.substring(0, end);
				if (number.length > end) {
					this.processSubscriberNumber(number.substring(end), fields, regionSettings);
				}
			} else {
				// shorter than the length needed for a local number, so just consider it a local number
				this.processSubscriberNumber(number, fields, regionSettings);
			}
		} else {
			fields.areaCode = number.substring(0, end);
			if (number.length > end) {
				this.processSubscriberNumber(number.substring(end), fields, regionSettings);
			}
		}
		
		// extensions are separated from the number by a dash in Germany
		if (regionSettings.plan.getFindExtensions() !== undefined && fields.subscriberNumber !== undefined) {
			var dash = fields.subscriberNumber.indexOf("-");
			if (dash > -1) {
				fields.subscriberNumber = fields.subscriberNumber.substring(0, dash);
				fields.extension = fields.subscriberNumber.substring(dash+1);
			}
		}

		ret = {
			number: ""
		};

		return ret;
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	none: function(number, currentChar, fields, regionSettings) {
		var ret;
		
		// this is a last resort function that is called when nothing is recognized.
		// When this happens, just put the whole stripped number into the subscriber number
			
		if (number.length > 0) {
			this.processSubscriberNumber(number, fields, regionSettings);
			if (currentChar > 0 && currentChar < number.length) {
				// if we were part-way through parsing, and we hit an invalid digit,
				// indicate that the number could not be parsed properly
				fields.invalid = true;
			}
		}
		
		ret = {
			number:""
		};
		
		return ret;
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	vsc: function(number, currentChar, fields, regionSettings) {
		var ret, length, end;

		if (fields.vsc === undefined) {
			length = regionSettings.plan.getFieldLength('vsc') || 0;
			if (length !== undefined && length > 0) {
				// fixed length
				end = length;
			} else {
				// variable length
				// the setting is the negative of the length to add, so subtract to make it positive
				end = currentChar + 1 - length;
			}
			
			// found a VSC code (ie. a "star code"), so save it and cause the function to 
			// parse the rest of the number with the same table for this locale
			fields.vsc = number.substring(0, end);
			number = (number.length > end) ? "^" + number.substring(end) : "";
		} else {
			// got it twice??? Okay, this is a bogus number then. Just put everything else into the subscriber number as the default
			this.processSubscriberNumber(number, fields, regionSettings);
			number = "";
		}

		// treat the rest of the number as if it were a completely new number
		ret = {
			number: number
		};

		return ret;
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	cell: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('mobilePrefix', regionSettings.plan.getFieldLength('mobilePrefix'), number, currentChar, fields, regionSettings, false);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	personal: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.plan.getFieldLength('personal'), number, currentChar, fields, regionSettings, false);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	emergency: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('emergency', regionSettings.plan.getFieldLength('emergency'), number, currentChar, fields, regionSettings, true);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	premium: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.plan.getFieldLength('premium'), number, currentChar, fields, regionSettings, false);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	special: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.plan.getFieldLength('special'), number, currentChar, fields, regionSettings, false);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	service2: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.plan.getFieldLength('service2'), number, currentChar, fields, regionSettings, false);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	service3: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.plan.getFieldLength('service3'), number, currentChar, fields, regionSettings, false);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	service4: function(number, currentChar, fields, regionSettings) {
		return this.processFieldWithSubscriberNumber('serviceCode', regionSettings.plan.getFieldLength('service4'), number, currentChar, fields, regionSettings, false);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	cic2: function(number, currentChar, fields, regionSettings) {
		return this.processField('cic', regionSettings.plan.getFieldLength('cic2'), number, currentChar, fields, regionSettings);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	cic3: function(number, currentChar, fields, regionSettings) {
		return this.processField('cic', regionSettings.plan.getFieldLength('cic3'), number, currentChar, fields, regionSettings);
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	start: function(number, currentChar, fields, regionSettings) {
		// don't do anything except transition to the next state
		return {
			number: number
		};
	},
	/**
	 * @private
	 * @param {string} number phone number
	 * @param {number} currentChar currentChar to be parsed
	 * @param {Object} fields the fields that have been extracted so far
	 * @param {Object} regionSettings settings used to parse the rest of the number
	 */
	local: function(number, currentChar, fields, regionSettings) {
		// in open dialling plans, we can tell that this number is a local subscriber number because it
		// starts with a digit that indicates as such
		this.processSubscriberNumber(number, fields, regionSettings);
		return {
			number: ""
		};
	}
};

// context-sensitive handler
/**
 * @class
 * @private
 * @constructor
 */
ilib.CSStateHandler = function () {
	return this;
};

ilib.CSStateHandler.prototype = new ilib.StateHandler();
ilib.CSStateHandler.prototype.special = function (number, currentChar, fields, regionSettings) {
	var ret;
	
	// found a special area code that is both a node and a leaf. In
	// this state, we have found the leaf, so chop off the end 
	// character to make it a leaf.
	if (number.charAt(0) === "0") {
		fields.trunkAccess = number.charAt(0);
		fields.areaCode = number.substring(1, currentChar);
	} else {
		fields.areaCode = number.substring(0, currentChar);
	}
	this.processSubscriberNumber(number.substring(currentChar), fields, regionSettings);
	
	ret = {
		number: ""
	};
	
	return ret;
};

/**
 * @class
 * @private
 * @constructor
 */
ilib.USStateHandler = function () {
	return this;
};

ilib.USStateHandler.prototype = new ilib.StateHandler();
ilib.USStateHandler.prototype.vsc = function (number, currentChar, fields, regionSettings) {
	var ret;

	// found a VSC code (ie. a "star code")
	fields.vsc = number;

	// treat the rest of the number as if it were a completely new number
	ret = {
		number: ""
	};

	return ret;
};

/**
 * @protected
 * @static
 */
ilib._handlerFactory = function (locale, plan) {
	if (plan.getContextFree() !== undefined && typeof(plan.getContextFree()) === 'boolean' && plan.getContextFree() === false) {
		return new ilib.CSStateHandler();
	}
	var region = (locale && locale.getRegion()) || "ZZ";
	switch (region) {
	case 'US':
		return new ilib.USStateHandler();
		break;
	default:
		return new ilib.StateHandler();
	}
};
/*
 * phonenum.js - Represent a phone number.
 * 
 * Copyright © 2014, JEDLSoft
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
phone/numplan.js
phone/phoneloc.js
phone/handler.js
*/

// !data states idd mnc

/**
 * @class
 * Create a new phone number instance that parses the phone number parameter for its 
 * constituent parts, and store them as separate fields in the returned object.
 * 
 * The options object may include any of these properties:
 * 
 * <ul>
 * <li><i>locale</i> The locale with which to parse the number. This gives a clue as to which
 * numbering plan to use.
 * <li><i>mcc</i> The mobile carrier code (MCC) associated with the carrier that the phone is 
 * currently connected to, if known. This also can give a clue as to which numbering plan to
 * use
 * <li>onLoad - a callback function to call when this instance is fully 
 * loaded. When the onLoad option is given, this class will attempt to
 * load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the 
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
 * <li>sync - tell whether to load any missing locale data synchronously or 
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while.
 * <li><i>loadParams</i> - an object containing parameters to pass to the 
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object 
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 * 
 * This function is locale-sensitive, and will assume any number passed to it is
 * appropriate for the given locale. If the MCC is given, this method will assume
 * that numbers without an explicit country code have been dialled within the country
 * given by the MCC. This affects how things like area codes are parsed. If the MCC
 * is not given, this method will use the given locale to determine the country
 * code. If the locale is not explicitly given either, then this function uses the 
 * region of current locale as the default.<p>
 * 
 * The input number may contain any formatting characters for the given locale. Each 
 * field that is returned in the json object is a simple string of digits with
 * all formatting and whitespace characters removed.<p>
 * 
 * The number is decomposed into its parts, regardless if the number
 * contains formatting characters. If a particular part cannot be extracted from given 
 * number, the field will not be returned as a field in the object. If no fields can be
 * extracted from the number at all, then all digits found in the string will be 
 * returned in the subscriberNumber field. If the number parameter contains no 
 * digits, an empty object is returned.<p>
 * 
 * This instance can contain any of the following fields after parsing is done:
 * 
 * <ul>
 * <li>vsc - if this number starts with a VSC (Vertical Service Code, or "star code"), this field will contain the star and the code together
 * <li>iddPrefix - the prefix for international direct dialing. This can either be in the form of a plus character or the IDD access code for the given locale
 * <li>countryCode - if this number is an international direct dial number, this is the country code
 * <li>cic - for "dial-around" services (access to other carriers), this is the prefix used as the carrier identification code
 * <li>emergency - an emergency services number
 * <li>mobilePrefix - prefix that introduces a mobile phone number
 * <li>trunkAccess - trunk access code (long-distance access)
 * <li>serviceCode - like a geographic area code, but it is a required prefix for various services
 * <li>areaCode - geographic area codes
 * <li>subscriberNumber - the unique number of the person or company that pays for this phone line
 * <li>extension - in some countries, extensions are dialed directly without going through an operator or a voice prompt system. If the number includes an extension, it is given in this field.
 * <li>invalid - this property is added and set to true if the parser found that the number is invalid in the numbering plan for the country. This method will make its best effort at parsing, but any digits after the error will go into the subscriberNumber field
 * </ul>
 * 
 * The following rules determine how the number is parsed:
 * 
 * <ol>
 * <li>If the number starts with a character that is alphabetic instead of numeric, do
 * not parse the number at all. There is a good chance that it is not really a phone number.
 * In this case, an empty instance will be returned.
 * <li>If the phone number uses the plus notation or explicitly uses the international direct
 * dialing prefix for the given locale, then the country code is identified in 
 * the number. The rules of given locale are used to parse the IDD prefix, and then the rules
 * of the country in the prefix are used to parse the rest of the number.
 * <li>If a country code is provided as an argument to the function call, use that country's
 * parsing rules for the number. This is intended for programs like a Contacts application that 
 * know what the country is of the person that owns the phone number and can pass that on as 
 * a hint.
 * <li>If the appropriate locale cannot be easily determined, default to using the rules 
 * for the current user's region.
 * </ol>
 * 
 * Example: parsing the number "+49 02101345345-78" will give the following properties in the
 * resulting phone number instance:
 * 
 * <pre>
 *      {
 *        iddPrefix: "+",
 *        countryCode: "49",
 *        areaCode: "02101",
 *        subscriberNumber: "345345",
 *        extension: "78"
 *      }
 * </pre>
 *  
 * Note that in this example, because international direct dialing is explicitly used 
 * in the number, the part of this number after the IDD prefix and country code will be 
 * parsed exactly the same way in all locales with German rules (country code 49).
 *  
 * Regions currently supported are:
 *  
 * <ul>
 * <li>NANP (North American Numbering Plan) countries - USA, Canada, Bermuda, various Caribbean nations
 * <li>UK
 * <li>Republic of Ireland
 * <li>Germany
 * <li>France
 * <li>Spain
 * <li>Italy
 * <li>Mexico
 * <li>India
 * <li>People's Republic of China
 * <li>Netherlands
 * <li>Belgium
 * <li>Luxembourg
 * <li>Australia
 * <li>New Zealand
 * <li>Singapore
 * <li>Korea
 * <li>Japan
 * <li>Russia
 * <li>Brazil
 * </ul>
 * 
 * @constructor
 * @param {!string|ilib.PhoneNumber} number A free-form phone number to be parsed, or another phone
 * number instance to copy
 * @param {Object=} options options that guide the parser in parsing the number
 */
ilib.PhoneNumber = function(number, options) {
	var stateData,
		regionSettings;

	this.sync = true;
	this.loadParams = {};
	
	if (!number || (typeof number === "string" && number.length === 0)) {
		return this;
	}

	if (options) {
		if (typeof(options.sync) === 'boolean') {
			this.sync = options.sync;
		}

		if (options.loadParams) {
			this.loadParams = options.loadParams;
		}

		if (typeof(options.onLoad) === 'function') {
			/** 
			 * @private
			 * @type {function(ilib.PhoneNumber)} 
			 */
			this.onLoad = options.onLoad;
		}
	}

	if (typeof number === "object") {
		/**
		 * The vertical service code. These are codes that typically
		 * start with a star or hash, like "*69" for "dial back the 
		 * last number that called me".
		 * @type {string|undefined} 
		 */
		this.vsc = number.vsc;

		/**
		 * The international direct dialing prefix. This is always
		 * followed by the country code. 
		 * @type {string} 
		 */
		this.iddPrefix = number.iddPrefix;
		
		/**
		 * The unique IDD country code for the country where the
		 * phone number is serviced. 
		 * @type {string|undefined} 
		 */
		this.countryCode = number.countryCode;
		
		/**
		 * The digits required to access the trunk. 
		 * @type {string|undefined} 
		 */
		this.trunkAccess = number.trunkAccess;
		
		/**
		 * The carrier identification code used to identify 
		 * alternate long distance or international carriers. 
		 * @type {string|undefined} 
		 */
		this.cic = number.cic;
		
		/**
		 * Identifies an emergency number that is typically
		 * short, such as "911" in North America or "112" in
		 * many other places in the world. 
		 * @type {string|undefined} 
		 */
		this.emergency = number.emergency;
		
		/**
		 * The prefix of the subscriber number that indicates
		 * that this is the number of a mobile phone. 
		 * @type {string|undefined} 
		 */
		this.mobilePrefix = number.mobilePrefix;
		
		/**
		 * The prefix that identifies this number as commercial
		 * service number. 
		 * @type {string|undefined} 
		 */
		this.serviceCode = number.serviceCode;
		
		/**
		 * The area code prefix of a land line number. 
		 * @type {string|undefined} 
		 */
		this.areaCode = number.areaCode;
		
		/**
		 * The unique number associated with the subscriber
		 * of this phone. 
		 * @type {string|undefined} 
		 */
		this.subscriberNumber = number.subscriberNumber;
		
		/**
		 * The direct dial extension number. 
		 * @type {string|undefined} 
		 */
		this.extension = number.extension;
		
		/**
		 * @private
		 * @type {boolean} 
		 */
		this.invalid = number.invalid;

		if (number.plan && number.locale) {
			/** 
			 * @private
			 * @type {ilib.NumPlan} 
			 */
			this.plan = number.plan;
			
			/** 
			 * @private
			 * @type {ilib.Locale.PhoneLoc} 
			 */
			this.locale = number.locale;
	
			/** 
			 * @private
			 * @type {ilib.NumPlan} 
			 */
			this.destinationPlan = number.destinationPlan;
			
			/** 
			 * @private
			 * @type {ilib.Locale.PhoneLoc} 
			 */
			this.destinationLocale = number.destinationLocale;
	
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
			return;
		}
	}

	new ilib.Locale.PhoneLoc({
		locale: options && options.locale,
		mcc: options && options.mcc,
		sync: this.sync,
		loadParams: this.loadParams,
		onLoad: ilib.bind(this, function(loc) {
			this.locale = this.destinationLocale = loc;
			new ilib.NumPlan({
				locale: this.locale,
				sync: this.sync,
				loadParms: this.loadParams,
				onLoad: ilib.bind(this, function (plan) {
					this.plan = this.destinationPlan = plan;
			
					if (typeof number === "object") {
						// the copy constructor code above did not find the locale 
						// or plan before, but now they are loaded, so we can return 
						// already without going further
						return;
					}
					ilib.loadData({
						name: "states.json",
						object: ilib.PhoneNumber,
						locale: this.locale,
						sync: this.sync,
						loadParams: ilib.merge(this.loadParams, {
							returnOne: true
						}),
						callback: ilib.bind(this, function (stdata) {
							if (!stdata) {
								stdata = ilib.PhoneNumber._defaultStates;
							}
		
							stateData = stdata;

							regionSettings = {
								stateData: stateData,
								plan: plan,
								handler: ilib._handlerFactory(this.locale, plan)
							};
							
							// use ^ to indicate the beginning of the number, because certain things only match at the beginning
							number = "^" + number.replace(/\^/g, '');
							number = ilib.PhoneNumber._stripFormatting(number);

							this._parseNumber(number, regionSettings, options);
						})
					});
				})
			});
		})
	});
};

/**
 * Parse an International Mobile Subscriber Identity (IMSI) number into its 3 constituent parts:
 * 
 * <ol>
 * <li>mcc - Mobile Country Code, which identifies the country where the phone is currently receiving 
 * service.
 * <li>mnc - Mobile Network Code, which identifies the carrier which is currently providing service to the phone 
 * <li>msin - Mobile Subscription Identifier Number. This is a unique number identifying the mobile phone on 
 * the network, which usually maps to an account/subscriber in the carrier's database.
 * </ol>
 * 
 * Because this function may need to load data to identify the above parts, you can pass an options
 * object that controls how the data is loaded. The options may contain any of the following properties:
 *
 * <ul>
 * <li>onLoad - a callback function to call when the parsing is done. When the onLoad option is given, 
 * this method will attempt to load the locale data using the ilib loader callback. When it is done
 * (even if the data is already preassembled), the onLoad function is called with the parsing results
 * as a parameter, so this callback can be used with preassembled or dynamic, synchronous or 
 * asynchronous loading or a mix of the above.
 * <li>sync - tell whether to load any missing locale data synchronously or asynchronously. If this 
 * option is given as "false", then the "onLoad" callback must be given, as the results returned from 
 * this constructor will not be usable for a while.
 * <li><i>loadParams</i> - an object containing parameters to pass to the loader callback function 
 * when locale data is missing. The parameters are not interpretted or modified in any way. They are 
 * simply passed along. The object may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 *
 * @static
 * @param {string} imsi IMSI number to parse
 * @param {Object} options options controlling the loading of the locale data
 * @return {{mcc:string,mnc:string,msin:string}|undefined} components of the IMSI number, when the locale data
 * is loaded synchronously, or undefined if asynchronous
 */
ilib.PhoneNumber.parseImsi = function(imsi, options) {
	var sync = true,
		loadParams = {},
		fields = {};
	
	if (!imsi) {
		return undefined;
	}

	if (options) {
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		if (options.loadParams) {
			loadParams = options.loadParams;
		}
	}	

	if (ilib.data.mnc) {
		fields = ilib.PhoneNumber._parseImsi(ilib.data.mnc, imsi);
		
		if (options && typeof(options.onLoad) === 'function') {
			options.onLoad(fields);
		}
	} else {
		ilib.loadData({
			name: "mnc.json", 
			object: ilib.PhoneNumber, 
			nonlocale: true, 
			sync: sync, 
			loadParams: loadParams, 
			callback: ilib.bind(this, function(data) {
				ilib.data.mnc = data;
				fields = ilib.PhoneNumber._parseImsi(data, imsi);
				
				if (options && typeof(options.onLoad) === 'function') {
					options.onLoad(fields);
				}
			})
		});
	}
	return fields;
};


/**
 * @static
 * @protected
 */
ilib.PhoneNumber._parseImsi = function(data, imsi) {
	var ch, 
		i,
		currentState, 
		end, 
		handlerMethod,
		state = 0,
		newState,
		fields = {},
		lastLeaf,
		consumed = 0;
	
	currentState = data;
	if (!currentState) {
		// can't parse anything
		return undefined;
	}
	
	i = 0;
	while (i < imsi.length) {
		ch = ilib.PhoneNumber._getCharacterCode(imsi.charAt(i));
		// console.info("parsing char " + imsi.charAt(i) + " code: " + ch);
		if (ch >= 0) {
			newState = currentState.s && currentState.s[ch];
			
			if (typeof(newState) === 'object') {
				if (typeof(newState.l) !== 'undefined') {
					// save for latter if needed
					lastLeaf = newState;
					consumed = i;
				}
				// console.info("recognized digit " + ch + " continuing...");
				// recognized digit, so continue parsing
				currentState = newState;
				i++;
			} else {
				if ((typeof(newState) === 'undefined' || newState === 0 ||
					(typeof(newState) === 'object' && typeof(newState.l) === 'undefined')) &&
					 lastLeaf) {
					// this is possibly a look-ahead and it didn't work... 
					// so fall back to the last leaf and use that as the
					// final state
					newState = lastLeaf;
					i = consumed;
				}
				
				if ((typeof(newState) === 'number' && newState) ||
					(typeof(newState) === 'object' && typeof(newState.l) !== 'undefined')) {
					// final state
					var stateNumber = typeof(newState) === 'number' ? newState : newState.l;
					handlerMethod = ilib.PhoneNumber._states[stateNumber];

					// console.info("reached final state " + newState + " handler method is " + handlerMethod + " and i is " + i);
	
					// deal with syntactic ambiguity by using the "special" end state instead of "area"
					if ( handlerMethod === "area" ) {
						end = i+1;
					} else {
						// unrecognized imsi, so just assume the mnc is 3 digits
						end = 6;
					}
					
					fields.mcc = imsi.substring(0,3);
					fields.mnc = imsi.substring(3,end);
					fields.msin = imsi.substring(end);
	
					return fields;
				} else {
					// parse error
					if (imsi.length >= 6) {
						fields.mcc = imsi.substring(0,3);
						fields.mnc = imsi.substring(3,6);
						fields.msin = imsi.substring(6);
					}
					return fields;
				}
			}
		} else if (ch === -1) {
			// non-transition character, continue parsing in the same state
			i++;
		} else {
			// should not happen
			// console.info("skipping character " + ch);
			// not a digit, plus, pound, or star, so this is probably a formatting char. Skip it.
			i++;
		}
	}
		
	if (i >= imsi.length && imsi.length >= 6) {
		// we reached the end of the imsi, but did not finish recognizing anything. 
		// Default to last resort and assume 3 digit mnc
		fields.mcc = imsi.substring(0,3);
		fields.mnc = imsi.substring(3,6);
		fields.msin = imsi.substring(6);
	} else {
		// unknown or not enough characters for a real imsi 
		fields = undefined;
	}
		
	// console.info("Globalization.Phone.parseImsi: final result is: " + JSON.stringify(fields));
	return fields;
};

/**
 * @static
 * @private
 */
ilib.PhoneNumber._stripFormatting = function(str) {
	var ret = "";
	var i;

	for (i = 0; i < str.length; i++) {
		if (ilib.PhoneNumber._getCharacterCode(str.charAt(i)) >= -1) {
			ret += str.charAt(i);
		}
	}
	return ret;
};

/**
 * @static
 * @protected
 */
ilib.PhoneNumber._getCharacterCode = function(ch) {
	if (ch >= '0' && ch <= '9') {
			return ch - '0';
		}
	switch (ch) {
	case '+':
		return 10;
	case '*':
		return 11;
	case '#':
		return 12;
	case '^':
		return 13;
	case 'p':		// pause chars
	case 'P':
	case 't':
	case 'T':
	case 'w':
	case 'W':
		return -1;
	case 'x':
	case 'X':
	case ',':
	case ';':		// extension char
		return -1;
	}
	return -2;
};

/**
 * @private
 */
ilib.PhoneNumber._states = [
	"none",
	"unknown",
	"plus",
	"idd",
	"cic",
	"service",
	"cell",
	"area",
	"vsc",
	"country",
	"personal",
	"special",
	"trunk",
	"premium",
	"emergency",
	"service2",
	"service3",
	"service4",
	"cic2",
	"cic3",
	"start",
	"local"
];

/**
 * @private
 */
ilib.PhoneNumber._fieldOrder = [
	"vsc",
	"iddPrefix",
	"countryCode",
	"trunkAccess",
	"cic",
	"emergency",
	"mobilePrefix",
	"serviceCode",
	"areaCode",
	"subscriberNumber",
	"extension"
];

ilib.PhoneNumber._defaultStates = {
	"s": [
        0,
		21,  // 1 -> local
        21,  // 2 -> local
        21,  // 3 -> local
        21,  // 4 -> local
        21,  // 5 -> local
        21,  // 6 -> local
        21,  // 7 -> local
        21,  // 8 -> local
        21,  // 9 -> local
        0,0,0,
	    { // ^
	    	"s": [
				{ // ^0
					"s": [3], // ^00 -> idd
					"l": 12   // ^0  -> trunk
				},
				21,  // ^1 -> local
	            21,  // ^2 -> local
	            21,  // ^3 -> local
	            21,  // ^4 -> local
	            21,  // ^5 -> local
	            21,  // ^6 -> local
	            21,  // ^7 -> local
	            21,  // ^8 -> local
	            21,  // ^9 -> local
	            2    // ^+ -> plus
	        ]
	    }
	]
};

ilib.PhoneNumber.prototype = {
	/**
	 * @protected
	 * @param {string} number
	 * @param {Object} regionData
	 * @param {Object} options
	 * @param {string} countryCode
	 */
	_parseOtherCountry: function(number, regionData, options, countryCode) {
		new ilib.Locale.PhoneLoc({
			locale: this.locale,
			countryCode: countryCode,
			sync: this.sync,
			loadParms: this.loadParams,
			onLoad: ilib.bind(this, function (loc) {
				/*
				 * this.locale is the locale where this number is being parsed,
				 * and is used to parse the IDD prefix, if any, and this.destinationLocale is 
				 * the locale of the rest of this number after the IDD prefix.
				 */
				/** @type {ilib.Locale.PhoneLoc} */
				this.destinationLocale = loc;

				ilib.loadData({
					name: "states.json",
					object: ilib.PhoneNumber,
					locale: this.destinationLocale,
					sync: this.sync,
					loadParams: ilib.merge(this.loadParams, {
						returnOne: true
					}),
					callback: ilib.bind(this, function (stateData) {
						if (!stateData) {
							stateData = ilib.PhoneNumber._defaultStates;
						}
						
						new ilib.NumPlan({
							locale: this.destinationLocale,
							sync: this.sync,
							loadParms: this.loadParams,
							onLoad: ilib.bind(this, function (plan) {
								/*
								 * this.plan is the plan where this number is being parsed,
								 * and is used to parse the IDD prefix, if any, and this.destinationPlan is 
								 * the plan of the rest of this number after the IDD prefix in the 
								 * destination locale.
								 */
								/** @type {ilib.NumPlan} */
								this.destinationPlan = plan;

								var regionSettings = {
									stateData: stateData,
									plan: plan,
									handler: ilib._handlerFactory(this.destinationLocale, plan)
								};
								
								// for plans that do not skip the trunk code when dialing from
								// abroad, we need to treat the number from here on in as if it 
								// were parsing a local number from scratch. That way, the parser
								// does not get confused between parts of the number at the
								// beginning of the number, and parts in the middle.
								if (!plan.getSkipTrunk()) {
									number = '^' + number;
								}
									
								// recursively call the parser with the new states data
								// to finish the parsing
								this._parseNumber(number, regionSettings, options);
							})
						});
					})
				});
			})
		});
	},
	
	/**
	 * @protected
	 * @param {string} number
	 * @param {Object} regionData
	 * @param {Object} options
	 */
	_parseNumber: function(number, regionData, options) {
		var i, ch,
			regionSettings,
			newState,
			dot,
			handlerMethod,
			result,
			currentState = regionData.stateData,
			lastLeaf = undefined,
			consumed = 0;

		regionSettings = regionData;
		dot = 14; // special transition which matches all characters. See AreaCodeTableMaker.java

		i = 0;
		while (i < number.length) {
			ch = ilib.PhoneNumber._getCharacterCode(number.charAt(i));
			if (ch >= 0) {
				// newState = stateData.states[state][ch];
				newState = currentState.s && currentState.s[ch];
				
				if (!newState && currentState.s && currentState.s[dot]) {
					newState = currentState.s[dot];
				}
				
				if (typeof(newState) === 'object' && i+1 < number.length) {
					if (typeof(newState.l) !== 'undefined') {
						// this is a leaf node, so save that for later if needed
						lastLeaf = newState;
						consumed = i;
					}
					// console.info("recognized digit " + ch + " continuing...");
					// recognized digit, so continue parsing
					currentState = newState;
					i++;
				} else {
					if ((typeof(newState) === 'undefined' || newState === 0 ||
						(typeof(newState) === 'object' && typeof(newState.l) === 'undefined')) &&
						 lastLeaf) {
						// this is possibly a look-ahead and it didn't work... 
						// so fall back to the last leaf and use that as the
						// final state
						newState = lastLeaf;
						i = consumed;
						consumed = 0;
						lastLeaf = undefined;
					}
					
					if ((typeof(newState) === 'number' && newState) ||
						(typeof(newState) === 'object' && typeof(newState.l) !== 'undefined')) {
						// final state
						var stateNumber = typeof(newState) === 'number' ? newState : newState.l;
						handlerMethod = ilib.PhoneNumber._states[stateNumber];
						
						if (number.charAt(0) === '^') {
							result = regionSettings.handler[handlerMethod](number.slice(1), i-1, this, regionSettings);
						} else {
							result = regionSettings.handler[handlerMethod](number, i, this, regionSettings);
						}
		
						// reparse whatever is left
						number = result.number;
						i = consumed = 0;
						lastLeaf = undefined;
						
						//console.log("reparsing with new number: " +  number);
						currentState = regionSettings.stateData;
						// if the handler requested a special sub-table, use it for this round of parsing,
						// otherwise, set it back to the regular table to continue parsing
	
						if (result.countryCode !== undefined) {
							this._parseOtherCountry(number, regionData, options, result.countryCode);
							// don't process any further -- let the work be done in the onLoad callbacks
							return;
						} else if (result.table !== undefined) {
							ilib.loadData({
								name: result.table + ".json",
								object: ilib.PhoneNumber,
								nonlocale: true,
								sync: this.sync,
								loadParams: this.loadParams,
								callback: ilib.bind(this, function (data) {
									if (!data) {
										data = ilib.PhoneNumber._defaultStates;
									}
	
									regionSettings = {
										stateData: data,
										plan: regionSettings.plan,
										handler: regionSettings.handler
									};
									
									// recursively call the parser with the new states data
									// to finish the parsing
									this._parseNumber(number, regionSettings, options);
								})
							});
							// don't process any further -- let the work be done in the onLoad callbacks
							return;
						} else if (result.skipTrunk !== undefined) {
							ch = ilib.PhoneNumber._getCharacterCode(regionSettings.plan.getTrunkCode());
							currentState = currentState.s && currentState.s[ch];
						}
					} else {
						handlerMethod = (typeof(newState) === 'number') ? "none" : "local";
						// failed parse. Either no last leaf to fall back to, or there was an explicit
						// zero in the table. Put everything else in the subscriberNumber field as the
						// default place
						if (number.charAt(0) === '^') {
							result = regionSettings.handler[handlerMethod](number.slice(1), i-1, this, regionSettings);
						} else {
							result = regionSettings.handler[handlerMethod](number, i, this, regionSettings);
						}
						break;
					}
				}
			} else if (ch === -1) {
				// non-transition character, continue parsing in the same state
				i++;
			} else {
				// should not happen
				// console.info("skipping character " + ch);
				// not a digit, plus, pound, or star, so this is probably a formatting char. Skip it.
				i++;
			}
		}
		if (i >= number.length && currentState !== regionData.stateData) {
			handlerMethod = (typeof(currentState.l) === 'undefined' || currentState === 0) ? "none" : "local";
			// we reached the end of the phone number, but did not finish recognizing anything. 
			// Default to last resort and put everything that is left into the subscriber number
			//console.log("Reached end of number before parsing was complete. Using handler for method none.")
			if (number.charAt(0) === '^') {
				result = regionSettings.handler[handlerMethod](number.slice(1), i-1, this, regionSettings);
			} else {
				result = regionSettings.handler[handlerMethod](number, i, this, regionSettings);
			}
		}

		// let the caller know we are done parsing
		if (this.onLoad) {
			this.onLoad(this);
		}
	},
	/**
	 * @protected
	 */
	_getPrefix: function() {
		return this.areaCode || this.serviceCode || this.mobilePrefix || "";
	},
	
	/**
	 * @protected
	 */
	_hasPrefix: function() {
		return (this._getPrefix() !== "");
	},
	
	/**
	 * Exclusive or -- return true, if one is defined and the other isn't
	 * @protected
	 */
	_xor : function(left, right) {
		if ((left === undefined && right === undefined ) || (left !== undefined && right !== undefined)) {
			return false;
		} else {
			return true;
		}
	},
	
	/**
	 * return a version of the phone number that contains only the dialable digits in the correct order 
	 * @protected
	 */
	_join: function () {
		var fieldName, formatted = "";
		
		try {
			for (var field in ilib.PhoneNumber._fieldOrder) {
				if (typeof field === 'string' && typeof ilib.PhoneNumber._fieldOrder[field] === 'string') {
					fieldName = ilib.PhoneNumber._fieldOrder[field];
					// console.info("normalize: formatting field " + fieldName);
					if (this[fieldName] !== undefined) {
						formatted += this[fieldName];
					}
				}
			}
		} catch ( e ) {
			//console.warn("caught exception in _join: " + e);
			throw e;
		}
		return formatted;
	},

	/**
	 * This routine will compare the two phone numbers in an locale-sensitive
	 * manner to see if they possibly reference the same phone number.<p>
	 * 
	 * In many places,
	 * there are multiple ways to reach the same phone number. In North America for 
	 * example, you might have a number with the trunk access code of "1" and another
	 * without, and they reference the exact same phone number. This is considered a
	 * strong match. For a different pair of numbers, one may be a local number and
	 * the other a full phone number with area code, which may reference the same 
	 * phone number if the local number happens to be located in that area code. 
	 * However, you cannot say for sure if it is in that area code, so it will 
	 * be considered a somewhat weaker match.<p>
	 *  
	 * Similarly, in other countries, there are sometimes different ways of 
	 * reaching the same destination, and the way that numbers
	 * match depends on the locale.<p>
	 * 
	 * The various phone number fields are handled differently for matches. There
	 * are various fields that do not need to match at all. For example, you may
	 * type equally enter "00" or "+" into your phone to start international direct
	 * dialling, so the iddPrefix field does not need to match at all.<p> 
	 * 
	 * Typically, fields that require matches need to match exactly if both sides have a value 
	 * for that field. If both sides specify a value and those values differ, that is
	 * a strong non-match. If one side does not have a value and the other does, that 
	 * causes a partial match, because the number with the missing field may possibly
	 * have an implied value that matches the other number. For example, the numbers
	 * "650-555-1234" and "555-1234" have a partial match as the local number "555-1234"
	 * might possibly have the same 650 area code as the first number, and might possibly
	 * not. If both side do not specify a value for a particular field, that field is 
	 * considered matching.<p>
	 *  
	 * The values of following fields are ignored when performing matches:
	 * 
	 * <ul>
	 * <li>vsc
	 * <li>iddPrefix
	 * <li>cic
	 * <li>trunkAccess
	 * </ul>
	 * 
	 * The values of the following fields matter if they do not match:
	 *   
	 * <ul>
	 * <li>countryCode - A difference causes a moderately strong problem except for 
	 * certain countries where there is a way to access the same subscriber via IDD 
	 * and via intranetwork dialling
	 * <li>mobilePrefix - A difference causes a possible non-match
	 * <li>serviceCode - A difference causes a possible non-match
	 * <li>areaCode - A difference causes a possible non-match
	 * <li>subscriberNumber - A difference causes a very strong non-match
	 * <li>extension - A difference causes a minor non-match
	 * </ul>
	 *  
	 * @param {string|ilib.PhoneNumber} other other phone number to compare this one to
	 * @return {number} non-negative integer describing the percentage quality of the 
	 * match. 100 means a very strong match (100%), and lower numbers are less and 
	 * less strong, down to 0 meaning not at all a match. 
	 */
	compare: function (other) {
		var match = 100,
			FRdepartments = {"590":1, "594":1, "596":1, "262":1},
			ITcountries = {"378":1, "379":1},
			thisPrefix,
			otherPrefix,
			currentCountryCode = 0;

		if (typeof this.locale.region === "string") {
			currentCountryCode = this.locale._mapRegiontoCC(this.locale.region);
		}
		
		// subscriber number must be present and must match
		if (!this.subscriberNumber || !other.subscriberNumber || this.subscriberNumber !== other.subscriberNumber) {
			return 0;
		}

		// extension must match if it is present
		if (this._xor(this.extension, other.extension) || this.extension !== other.extension) {
			return 0;
		}

		if (this._xor(this.countryCode, other.countryCode)) {
			// if one doesn't have a country code, give it some demerit points, but if the
			// one that has the country code has something other than the current country
			// add even more. Ignore the special cases where you can dial the same number internationally or via 
			// the local numbering system
			switch (this.locale.getRegion()) {
			case 'FR':
				if (this.countryCode in FRdepartments || other.countryCode in FRdepartments) {
					if (this.areaCode !== other.areaCode || this.mobilePrefix !== other.mobilePrefix) {
						match -= 100;
					}
				} else {
					match -= 16;
				}
				break;
			case 'IT':
				if (this.countryCode in ITcountries || other.countryCode in ITcountries) { 
					if (this.areaCode !== other.areaCode) {
						match -= 100;
					}
				} else {
					match -= 16;
				}
				break;
			default:
				match -= 16;
				if ((this.countryCode !== undefined && this.countryCode !== currentCountryCode) || 
					(other.countryCode !== undefined && other.countryCode !== currentCountryCode)) {
					match -= 16;
				}
			}
		} else if (this.countryCode !== other.countryCode) {
			// ignore the special cases where you can dial the same number internationally or via 
			// the local numbering system
			if (other.countryCode === '33' || this.countryCode === '33') {
				// france
				if (this.countryCode in FRdepartments || other.countryCode in FRdepartments) {
					if (this.areaCode !== other.areaCode || this.mobilePrefix !== other.mobilePrefix) {
						match -= 100;
					}
				} else {
					match -= 100;
				}
			} else if (this.countryCode === '39' || other.countryCode === '39') {
				// italy
				if (this.countryCode in ITcountries || other.countryCode in ITcountries) { 
					if (this.areaCode !== other.areaCode) {
						match -= 100;
					}
				} else {
					match -= 100;
				}
			} else {
				match -= 100;
			}
		}

		if (this._xor(this.serviceCode, other.serviceCode)) {
			match -= 20;
		} else if (this.serviceCode !== other.serviceCode) {
			match -= 100;
		}

		if (this._xor(this.mobilePrefix, other.mobilePrefix)) {
			match -= 20;
		} else if (this.mobilePrefix !== other.mobilePrefix) {
			match -= 100;
		}

		if (this._xor(this.areaCode, other.areaCode)) {
			// one has an area code, the other doesn't, so dock some points. It could be a match if the local
			// number in the one number has the same implied area code as the explicit area code in the other number.
			match -= 12;
		} else if (this.areaCode !== other.areaCode) {
			match -= 100;
		}

		thisPrefix = this._getPrefix();
		otherPrefix = other._getPrefix();
		
		if (thisPrefix && otherPrefix && thisPrefix !== otherPrefix) {
			match -= 100;
		}
		
		// make sure we are between 0 and 100
		if (match < 0) {
			match = 0;	
		} else if (match > 100) {
			match = 100;
		}

		return match;
	},
	
	/**
	 * Determine whether or not the other phone number is exactly equal to the current one.<p>
	 *  
	 * The difference between the compare method and the equals method is that the compare 
	 * method compares normalized numbers with each other and returns the degree of match,
	 * whereas the equals operator returns true iff the two numbers contain the same fields
	 * and the fields are exactly the same. Functions and other non-phone number properties
	 * are not compared.
	 * @param {string|ilib.PhoneNumber} other another phone number to compare to this one
	 * @return {boolean} true if the numbers are the same, false otherwise
	 */
	equals: function equals(other) {
		if (other.locale && this.locale && !this.locale.equals(other.locale) && (!this.countryCode || !other.countryCode)) {
			return false;
		}
		
		for (var p in other) {
			if (p !== undefined && this[p] !== undefined && typeof(this[p]) !== 'object') {
				if (other[p] === undefined) {
					/*console.error("PhoneNumber.equals: other is missing property " + p + " which has the value " + this[p] + " in this");
					console.error("this is : " + JSON.stringify(this));
					console.error("other is: " + JSON.stringify(other));*/
					return false;
				}
				if (this[p] !== other[p]) {
					/*console.error("PhoneNumber.equals: difference in property " + p);
					console.error("this is : " + JSON.stringify(this));
					console.error("other is: " + JSON.stringify(other));*/
					return false;
				}
			}
		}
		for (var p in other) {
			if (p !== undefined && other[p] !== undefined && typeof(other[p]) !== 'object') {
				if (this[p] === undefined) {
					/*console.error("PhoneNumber.equals: this is missing property " + p + " which has the value " + other[p] + " in the other");
					console.error("this is : " + JSON.stringify(this));
					console.error("other is: " + JSON.stringify(other));*/
					return false;
				}
				if (this[p] !== other[p]) {
					/*console.error("PhoneNumber.equals: difference in property " + p);
					console.error("this is : " + JSON.stringify(this));
					console.error("other is: " + JSON.stringify(other));*/
					return false;
				}
			}
		}
		return true;
	},
	

	/**
	 * @private
	 * @param {{
	 *   mcc:string,
	 *   defaultAreaCode:string,
	 *   country:string,
	 *   networkType:string,
	 *   assistedDialing:boolean,
	 *   sms:boolean,
	 *   manualDialing:boolean
	 * }} options an object containing options to help in normalizing. 
	 * @param {ilib.PhoneNumber} norm
	 * @param {ilib.Locale.PhoneLoc} homeLocale
	 * @param {ilib.Locale.PhoneLoc} currentLocale
	 * @param {ilib.NumPlan} currentPlan
	 * @param {ilib.Locale.PhoneLoc} destinationLocale
	 * @param {ilib.NumPlan} destinationPlan
	 * @param {boolean} sync
	 * @param {Object|undefined} loadParams
	 */
	_doNormalize: function(options, norm, homeLocale, currentLocale, currentPlan, destinationLocale, destinationPlan, sync, loadParams) {
		var formatted = "";
		
		if (!norm.invalid && options && options.assistedDialing) {
			// don't normalize things that don't have subscriber numbers. Also, don't normalize
			// manually dialed local numbers. Do normalize local numbers in contact entries.
			if (norm.subscriberNumber && 
					(!options.manualDialing ||
					 norm.iddPrefix ||
					 norm.countryCode ||
					 norm.trunkAccess)) {
				// console.log("normalize: assisted dialling normalization of " + JSON.stringify(norm));
				if (currentLocale.getRegion() !== destinationLocale.getRegion()) {
					// we are currently calling internationally
					if (!norm._hasPrefix() && 
							options.defaultAreaCode && 
							destinationLocale.getRegion() === homeLocale.getRegion() &&
							(!destinationPlan.getFieldLength("minLocalLength") || 
								norm.subscriberNumber.length >= destinationPlan.getFieldLength("minLocalLength"))) {
						// area code is required when dialling from international, but only add it if we are dialing
						// to our home area. Otherwise, the default area code is not valid!
						norm.areaCode = options.defaultAreaCode;
						if (!destinationPlan.getSkipTrunk() && destinationPlan.getTrunkCode()) {
							// some phone systems require the trunk access code, even when dialling from international
							norm.trunkAccess = destinationPlan.getTrunkCode();
						}
					}
					
					if (norm.trunkAccess && destinationPlan.getSkipTrunk()) {
						// on some phone systems, the trunk access code is dropped when dialling from international
						delete norm.trunkAccess;
					}
					
					// make sure to get the country code for the destination region, not the current region!
					if (options.sms) {
						if (homeLocale.getRegion() === "US" && currentLocale.getRegion() !== "US") {
							if (destinationLocale.getRegion() !== "US") {
								norm.iddPrefix = "011"; // non-standard code to make it go through the US first
								norm.countryCode = norm.countryCode || homeLocale._mapRegiontoCC(destinationLocale.getRegion());
							} else if (options.networkType === "cdma") {
								delete norm.iddPrefix;
								delete norm.countryCode;
								if (norm.areaCode) {
									norm.trunkAccess = "1";
								}
							} else if (norm.areaCode) {
								norm.iddPrefix = "+";
								norm.countryCode = "1";
								delete norm.trunkAccess;
							}
						} else {
							norm.iddPrefix = (options.networkType === "cdma") ? currentPlan.getIDDCode() : "+";
							norm.countryCode = norm.countryCode || homeLocale._mapRegiontoCC(destinationLocale.region);
						}
					} else if (norm._hasPrefix() && !norm.countryCode) {
						norm.countryCode = homeLocale._mapRegiontoCC(destinationLocale.region);
					}

					if (norm.countryCode && !options.sms) {
						// for CDMA, make sure to get the international dialling access code for the current region, not the destination region
						// all umts carriers support plus dialing
						norm.iddPrefix = (options.networkType === "cdma") ? currentPlan.getIDDCode() : "+";
					}
				} else {
					// console.log("normalize: dialing within the country");
					if (options.defaultAreaCode) {
						if (destinationPlan.getPlanStyle() === "open") {
							if (!norm.trunkAccess && norm._hasPrefix() && destinationPlan.getTrunkCode()) {
								// call is not local to this area code, so you have to dial the trunk code and the area code
								norm.trunkAccess = destinationPlan.getTrunkCode();
							}
						} else {
							// In closed plans, you always have to dial the area code, even if the call is local.
							if (!norm._hasPrefix()) {
								if (destinationLocale.getRegion() === homeLocale.getRegion()) {
									norm.areaCode = options.defaultAreaCode;
									if (destinationPlan.getTrunkRequired() && destinationPlan.getTrunkCode()) {
										norm.trunkAccess = norm.trunkAccess || destinationPlan.getTrunkCode();
									}
								}
							} else {
								if (destinationPlan.getTrunkRequired() && destinationPlan.getTrunkCode()) {
									norm.trunkAccess = norm.trunkAccess || destinationPlan.getTrunkCode();
								}
							}
						}
					}
					
					if (options.sms &&
							homeLocale.getRegion() === "US" && 
							currentLocale.getRegion() !== "US") {
						norm.iddPrefix = "011"; // make it go through the US first
						if (destinationPlan.getSkipTrunk() && norm.trunkAccess) {
							delete norm.trunkAccess;
						}
					} else if (norm.iddPrefix || norm.countryCode) {
						// we are in our destination country, so strip the international dialling prefixes
						delete norm.iddPrefix;
						delete norm.countryCode;
						
						if ((destinationPlan.getPlanStyle() === "open" || destinationPlan.getTrunkRequired()) && destinationPlan.getTrunkCode()) {
							norm.trunkAccess = destinationPlan.getTrunkCode();
						}
					}
				}
			}
		} else if (!norm.invalid) {
			// console.log("normalize: non-assisted normalization");
			if (!norm._hasPrefix() && options && options.defaultAreaCode && destinationLocale.getRegion() === homeLocale.region) {
				norm.areaCode = options.defaultAreaCode;
			}
			
			if (!norm.countryCode && norm._hasPrefix()) {
				norm.countryCode = homeLocale._mapRegiontoCC(destinationLocale.getRegion());
			}

			if (norm.countryCode) {
				if (options && options.networkType && options.networkType === "cdma") {
					norm.iddPrefix = currentPlan.getIDDCode(); 
				} else {
					// all umts carriers support plus dialing
					norm.iddPrefix = "+";
				}
		
				if (destinationPlan.getSkipTrunk() && norm.trunkAccess) {
					delete norm.trunkAccess;
				} else if (!destinationPlan.getSkipTrunk() && !norm.trunkAccess && destinationPlan.getTrunkCode()) {
					norm.trunkAccess = destinationPlan.getTrunkCode();
				}
			}
		}
		
		// console.info("normalize: after normalization, the normalized phone number is: " + JSON.stringify(norm));
		formatted = norm._join();

		return formatted;
	},
	
	/**
	 * @private
	 * @param {{
	 *   mcc:string,
	 *   defaultAreaCode:string,
	 *   country:string,
	 *   networkType:string,
	 *   assistedDialing:boolean,
	 *   sms:boolean,
	 *   manualDialing:boolean
	 * }} options an object containing options to help in normalizing. 
	 * @param {ilib.PhoneNumber} norm
	 * @param {ilib.Locale.PhoneLoc} homeLocale
	 * @param {ilib.Locale.PhoneLoc} currentLocale
	 * @param {ilib.NumPlan} currentPlan
	 * @param {ilib.Locale.PhoneLoc} destinationLocale
	 * @param {ilib.NumPlan} destinationPlan
	 * @param {boolean} sync
	 * @param {Object|undefined} loadParams
	 * @param {function(string)} callback
	 */
	_doReparse: function(options, norm, homeLocale, currentLocale, currentPlan, destinationLocale, destinationPlan, sync, loadParams, callback) {
		var formatted, 
			tempRegion;
		
		if (options &&
				options.assistedDialing &&
				!norm.trunkAccess && 
				!norm.iddPrefix &&
				norm.subscriberNumber && 
				norm.subscriberNumber.length > destinationPlan.getFieldLength("maxLocalLength")) {

			// numbers that are too long are sometimes international direct dialed numbers that
			// are missing the IDD prefix. So, try reparsing it using a plus in front to see if that works.
			new ilib.PhoneNumber("+" + this._join(), {
				locale: this.locale,
				sync: sync,
				loadParms: loadParams,
				onLoad: ilib.bind(this, function (data) {
					tempRegion = (data.countryCode && data.locale._mapCCtoRegion(data.countryCode));

					if (tempRegion && tempRegion !== "unknown" && tempRegion !== "SG") {
						// only use it if it is a recognized country code. Singapore (SG) is a special case.
						norm = data;
						destinationLocale = data.destinationLocale;
						destinationPlan = data.destinationPlan;
					}
					
					formatted = this._doNormalize(options, norm, homeLocale, currentLocale, currentPlan, destinationLocale, destinationPlan, sync, loadParams);
					if (typeof(callback) === 'function') {
						callback(formatted);
					}
				})
			});
		} else if (options && options.assistedDialing && norm.invalid && currentLocale.region !== norm.locale.region) {
			// if this number is not valid for the locale it was parsed with, try again with the current locale
			// console.log("norm is invalid. Attempting to reparse with the current locale");

			new ilib.PhoneNumber(this._join(), {
				locale: currentLocale,
				sync: sync,
				loadParms: loadParams,
				onLoad: ilib.bind(this, function (data) {
					if (data && !data.invalid) {
						norm = data;
					}
					
					formatted = this._doNormalize(options, norm, homeLocale, currentLocale, currentPlan, destinationLocale, destinationPlan, sync, loadParams);
					if (typeof(callback) === 'function') {
						callback(formatted);
					}
				})
			});
		} else {
			formatted = this._doNormalize(options, norm, homeLocale, currentLocale, currentPlan, destinationLocale, destinationPlan, sync, loadParams);
			if (typeof(callback) === 'function') {
				callback(formatted);
			}
		}
	},
	
	/**
	 * This function normalizes the current phone number to a canonical format and returns a
	 * string with that phone number. If parts are missing, this function attempts to fill in 
	 * those parts.<p>
	 * 	  
	 * The options object contains a set of properties that can possibly help normalize
	 * this number by providing "extra" information to the algorithm. The options
	 * parameter may be null or an empty object if no hints can be determined before
	 * this call is made. If any particular hint is not
	 * available, it does not need to be present in the options object.<p>
	 * 
	 * The following is a list of hints that the algorithm will look for in the options
	 * object:
	 * 
	 * <ul>
	 * <li><i>mcc</i> the mobile carrier code of the current network upon which this 
	 * phone is operating. This is translated into an IDD country code. This is 
	 * useful if the number being normalized comes from CNAP (callerid) and the
	 * MCC is known.
	 * <li><i>defaultAreaCode</i> the area code of the phone number of the current
	 * device, if available. Local numbers in a person's contact list are most 
	 * probably in this same area code.
	 * <li><i>country</i> the 2 letter ISO 3166 code of the country if it is
	 * known from some other means such as parsing the physical address of the
	 * person associated with the phone number, or the from the domain name 
	 * of the person's email address
	 * <li><i>networkType</i> specifies whether the phone is currently connected to a
	 * CDMA network or a UMTS network. Valid values are the strings "cdma" and "umts".
	 * If one of those two strings are not specified, or if this property is left off
	 * completely, this method will assume UMTS.
	 * </ul>
	 * 
	 * The following are a list of options that control the behaviour of the normalization:
	 * 
	 * <ul>
	 * <li><i>assistedDialing</i> if this is set to true, the number will be normalized
	 * so that it can dialled directly on the type of network this phone is 
	 * currently connected to. This allows customers to dial numbers or use numbers 
	 * in their contact list that are specific to their "home" region when they are 
	 * roaming and those numbers would not otherwise work with the current roaming 
	 * carrier as they are. The home region is 
	 * specified as the phoneRegion system preference that is settable in the 
	 * regional settings app. With assisted dialling, this method will add or 
	 * remove international direct dialling prefixes and country codes, as well as
	 * national trunk access codes, as required by the current roaming carrier and the
	 * home region in order to dial the number properly. If it is not possible to 
	 * construct a full international dialling sequence from the options and hints given,
	 * this function will not modify the phone number, and will return "undefined".
	 * If assisted dialling is false or not specified, then this method will attempt
	 * to add all the information it can to the number so that it is as fully
	 * specified as possible. This allows two numbers to be compared more easily when
	 * those two numbers were otherwise only partially specified.
	 * <li><i>sms</i> set this option to true for the following conditions: 
	 *   <ul>
	 *   <li>assisted dialing is turned on
	 *   <li>the phone number represents the destination of an SMS message
	 *   <li>the phone is UMTS 
	 *   <li>the phone is SIM-locked to its carrier
	 *   </ul> 
	 * This enables special international direct dialling codes to route the SMS message to
	 * the correct carrier. If assisted dialling is not turned on, this option has no
	 * affect.
	 * <li><i>manualDialing</i> set this option to true if the user is entering this number on
	 * the keypad directly, and false when the number comes from a stored location like a 
	 * contact entry or a call log entry. When true, this option causes the normalizer to 
	 * not perform any normalization on numbers that look like local numbers in the home 
	 * country. If false, all numbers go through normalization. This option only has an effect
	 * when the assistedDialing option is true as well, otherwise it is ignored.
	 * </ul> 
	 * 
	 * If both a set of options and a locale are given, and they offer conflicting
	 * information, the options will take precedence. The idea is that the locale
	 * tells you the region setting that the user has chosen (probably in 
	 * firstuse), whereas the the hints are more current information such as
	 * where the phone is currently operating (the MCC).<p> 
	 * 
	 * This function performs the following types of normalizations with assisted
	 * dialling turned on:
	 * 
	 * <ol>
	 * <li>If the current location of the phone matches the home country, this is a
	 * domestic call.
	 *   <ul> 
	 *   <li>Remove any iddPrefix and countryCode fields, as they are not needed
	 *   <li>Add in a trunkAccess field that may be necessary to call a domestic numbers 
	 *     in the home country
	 *   </ul>
	 * <li> If the current location of the phone does not match the home country,
	 * attempt to form a whole international number.
	 *   <ul>
	 *   <li>Add in the area code if it is missing from the phone number and the area code
	 *     of the current phone is available in the hints
	 *   <li>Add the country dialling code for the home country if it is missing from the 
	 *     phone number
	 *   <li>Add or replace the iddPrefix with the correct one for the current country. The
	 *     phone number will have been parsed with the settings for the home country, so
	 *     the iddPrefix may be incorrect for the
	 *     current country. The iddPrefix for the current country can be "+" if the phone 
	 *     is connected to a UMTS network, and either a "+" or a country-dependent 
	 *     sequences of digits for CDMA networks.
	 *   </ul>
	 * </ol>
	 * 
	 * This function performs the following types of normalization with assisted
	 * dialling turned off:
	 * 
	 * <ul>
	 * <li>Normalize the international direct dialing prefix to be a plus or the
	 * international direct dialling access code for the current country, depending
	 * on the network type.
	 * <li>If a number is a local number (ie. it is missing its area code), 
	 * use a default area code from the hints if available. CDMA phones always know their area 
	 * code, and GSM/UMTS phones know their area code in many instances, but not always 
	 * (ie. not on Vodaphone or Telcel phones). If the default area code is not available, 
	 * do not add it.
	 * <li>In assisted dialling mode, if a number is missing its country code, 
	 * use the current MCC number if
	 * it is available to figure out the current country code, and prepend that 
	 * to the number. If it is not available, leave it off. Also, use that 
	 * country's settings to parse the number instead of the current format 
	 * locale.
	 * <li>For North American numbers with an area code but no trunk access 
	 * code, add in the trunk access code.
	 * <li>For other countries, if the country code is added in step 3, remove the 
	 * trunk access code when required by that country's conventions for 
	 * international calls. If the country requires a trunk access code for 
	 * international calls and it doesn't exist, add one.
	 * </ul>
	 *  
	 * This method modifies the current object, and also returns a string 
	 * containing the normalized phone number that can be compared directly against
	 * other normalized numbers. The canonical format for phone numbers that is 
	 * returned from thhomeLocaleis method is simply an uninterrupted and unformatted string 
	 * of dialable digits.
	 * 
	 * @param {{
	 *   mcc:string,
	 *   defaultAreaCode:string,
	 *   country:string,
	 *   networkType:string,
	 *   assistedDialing:boolean,
	 *   sms:boolean,
	 *   manualDialing:boolean
	 * }} options an object containing options to help in normalizing. 
	 * @return {string|undefined} the normalized string, or undefined if the number
	 * could not be normalized
	 */
	normalize: function(options) {
		var norm,
			sync = true,
			loadParams = {};
			

		if (options) {
			if (typeof(options.sync) !== 'undefined') {
				sync = (options.sync == true);
			}
			
			if (options.loadParams) {
				loadParams = options.loadParams;
			}
		}
		
		// Clone this number, so we don't mess with the original.
		// No need to do this asynchronously because it's a copy constructor which doesn't 
		// load any extra files.
		norm = new ilib.PhoneNumber(this);

		var normalized;
		
		if (options && (typeof(options.mcc) !== 'undefined' || typeof(options.country) !== 'undefined')) {
			new ilib.Locale.PhoneLoc({
				mcc: options.mcc,
				countryCode: options.countryCode,
				locale: this.locale,
				sync: sync,
				loadParams: loadParams,
				onLoad: ilib.bind(this, function(loc) {
					new ilib.NumPlan({
						locale: loc,
						sync: sync,
						loadParms: loadParams,
						onLoad: ilib.bind(this, function (plan) {
							this._doReparse(options, norm, this.locale, loc, plan, this.destinationLocale, this.destinationPlan, sync, loadParams, function (fmt) {
								normalized = fmt;
								
								if (options && typeof(options.onLoad) === 'function') {
									options.onLoad(fmt);
								}
							});
						})
					});
				})
			});
		} else {
			this._doReparse(options, norm, this.locale, this.locale, this.plan, this.destinationLocale, this.destinationPlan, sync, loadParams, function (fmt) {
				normalized = fmt;
				
				if (options && typeof(options.onLoad) === 'function') {
					options.onLoad(fmt);
				}
			});
		}

		// return the value for the synchronous case
		return normalized;
	}
};
/*
 * phonefmt.js - Represent a phone number formatter.
 * 
 * Copyright © 2014, JEDLSoft
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
phone/numplan.js
phone/phonenum.js
*/

// !data phonefmt

/**
 * @class
 * Create a new phone number formatter object that formats numbers according to the parameters.<p>
 * 
 * The options object can contain zero or more of the following parameters:
 *
 * <ul>
 * <li><i>locale</i> locale to use to format this number, or undefined to use the default locale
 * <li><i>style</i> the name of style to use to format numbers, or undefined to use the default style
 * <li><i>mcc</i> the MCC of the country to use if the number is a local number and the country code is not known
 *
 * <li><i>onLoad</i> - a callback function to call when the locale data is fully loaded and the address has been 
 * parsed. When the onLoad option is given, the address formatter object 
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
 * Some regions have more than one style of formatting, and the style parameter
 * selects which style the user prefers. An array of style names that this locale
 * supports can be found by calling {@link ilib.PhoneFmt.getAvailableStyles}. 
 * Example phone numbers can be retrieved for each style by calling 
 * {@link ilib.PhoneFmt.getStyleExample}.
 * <p>
 *
 * If the MCC is given, numbers will be formatted in the manner of the country
 * specified by the MCC. If it is not given, but the locale is, the manner of
 * the country in the locale will be used. If neither the locale or MCC are not given,
 * then the country of the current ilib locale is used. 
 *
 * @constructor
 * @param {Object} options properties that control how this formatter behaves
 */
ilib.PhoneFmt = function(options) {
	this.sync = true;
	this.styleName = 'default',
	this.loadParams = {};

	var locale = new ilib.Locale();

	if (options) {
		if (options.locale) {
			locale = options.locale;
		}

		if (typeof(options.sync) !== 'undefined') {
			this.sync = (options.sync == true);
		}

		if (options.loadParams) {
			this.loadParams = options.loadParams;
		}

		if (options.style) {
			this.style = options.style;
		}
	}

	new ilib.Locale.PhoneLoc({
		locale: locale,
		mcc: options && options.mcc,
		countryCode: options && options.countryCode,
		onLoad: ilib.bind(this, function (data) {
			/** @type {ilib.Locale.PhoneLoc} */
			this.locale = data;

			new ilib.NumPlan({
				locale: this.locale,
				sync: this.sync,
				loadParms: this.loadParams,
				onLoad: ilib.bind(this, function (plan) {
					/** @type {ilib.NumPlan} */
					this.plan = plan;

					ilib.loadData({
						name: "phonefmt.json",
						object: ilib.PhoneFmt,
						locale: this.locale, 
						sync: this.sync,
						loadParams: ilib.merge(this.loadParams, {
							returnOne: true
						}),
						callback: ilib.bind(this, function (fmtdata) {
							this.fmtdata = fmtdata;
							
							if (options && typeof(options.onLoad) === 'function') {
								options.onLoad(this);
							}
						})
					});
				})
			});
		})
	});
};

ilib.PhoneFmt.prototype = {
	/**
	 * 
	 * @protected
	 * @param {string} part
	 * @param {Object} formats
	 * @param {boolean} mustUseAll
	 */
	_substituteDigits: function(part, formats, mustUseAll) {
		var formatString,
			formatted = "",
			partIndex = 0,
			templates,
			i;

		// console.info("Globalization.Phone._substituteDigits: typeof(formats) is " + typeof(formats));
		if (!part) {
			return formatted;
		}

		if (typeof(formats) === "object") {
			templates = (typeof(formats.template) !== 'undefined') ? formats.template : formats;
			if (part.length > templates.length) {
				// too big, so just use last resort rule.
				throw "part " + part + " is too big. We do not have a format template to format it.";
			}
			// use the format in this array that corresponds to the digit length of this
			// part of the phone number
			formatString =  templates[part.length-1];
			// console.info("Globalization.Phone._substituteDigits: formats is an Array: " + JSON.stringify(formats));
		} else {
			formatString = formats;
		}

		for (i = 0; i < formatString.length; i++) {
			if (formatString.charAt(i) === "X") {
				formatted += part.charAt(partIndex);
				partIndex++;
			} else {
				formatted += formatString.charAt(i);
			}
		}
		
		if (mustUseAll && partIndex < part.length-1) {
			// didn't use the whole thing in this format? Hmm... go to last resort rule
			throw "too many digits in " + part + " for format " + formatString;
		}
		
		return formatted;
	},
	
	/**
	 * Returns the style with the given name, or the default style if there
	 * is no style with that name.
	 * @protected
	 * @return {{example:string,whole:Object.<string,string>,partial:Object.<string,string>}|Object.<string,string>}
	 */
	_getStyle: function (name, fmtdata) {
		return fmtdata[name] || fmtdata["default"];
	},

	/**
	 * Do the actual work of formatting the phone number starting at the given
	 * field in the regular field order.
	 * 
	 * @param {!ilib.PhoneNumber} number
	 * @param {{
	 *   partial:boolean,
	 *   style:string,
	 *   mcc:string,
	 *   locale:(string|ilib.Locale),
	 *   sync:boolean,
	 *   loadParams:Object,
	 *   onLoad:function(string)
	 * }} options Parameters which control how to format the number
	 * @param {number} startField
	 */
	_doFormat: function(number, options, startField, locale, fmtdata, callback) {
		var sync = true,
			loadParams = {},
			temp, 
			templates, 
			fieldName, 
			countryCode, 
			isWhole, 
			style,
			formatted = "",
			styleTemplates,
			lastFieldName;
	
		if (options) {
			if (typeof(options.sync) !== 'undefined') {
				sync = (options.sync == true);				
			}
		
			if (options.loadParams) {
				loadParams = options.loadParams;
			}
		}
	
		style = this.style; // default style for this formatter

		// figure out what style to use for this type of number
		if (number.countryCode) {
			// dialing from outside the country
			// check to see if it to a mobile number because they are often formatted differently
			style = (number.mobilePrefix) ? "internationalmobile" : "international";
		} else if (number.mobilePrefix !== undefined) {
			style = "mobile";
		} else if (number.serviceCode !== undefined && typeof(fmtdata["service"]) !== 'undefined') {
			// if there is a special format for service numbers, then use it
			style = "service";
		}

		isWhole = (!options || !options.partial);
		styleTemplates = this._getStyle(style, fmtdata);
		
		// console.log("Style ends up being " + style + " and using subtype " + (isWhole ? "whole" : "partial"));
		styleTemplates = (isWhole ? styleTemplates.whole : styleTemplates.partial) || styleTemplates;

		for (var i = startField; i < ilib.PhoneNumber._fieldOrder.length; i++) {
			fieldName = ilib.PhoneNumber._fieldOrder[i];
			// console.info("format: formatting field " + fieldName + " value: " + number[fieldName]);
			if (number[fieldName] !== undefined) {
				if (styleTemplates[fieldName] !== undefined) {
					templates = styleTemplates[fieldName];
					if (fieldName === "trunkAccess") {
						if (number.areaCode === undefined && number.serviceCode === undefined && number.mobilePrefix === undefined) {
							templates = "X";
						}
					}
					if (lastFieldName && typeof(styleTemplates[lastFieldName].suffix) !== 'undefined') {
						if (fieldName !== "extension" && number[fieldName].search(/[xwtp,;]/i) <= -1) {
							formatted += styleTemplates[lastFieldName].suffix;	
						}
					}
					lastFieldName = fieldName;
					
					// console.info("format: formatting field " + fieldName + " with templates " + JSON.stringify(templates));
					temp = this._substituteDigits(number[fieldName], templates, (fieldName === "subscriberNumber"));
					// console.info("format: formatted is: " + temp);
					formatted += temp;
	
					if (fieldName === "countryCode") {
						// switch to the new country to format the rest of the number
						countryCode = number.countryCode.replace(/[wWpPtT\+#\*]/g, '');	// fix for NOV-108200

						new ilib.Locale.PhoneLoc({
							locale: this.locale,
							sync: sync,							
							loadParms: loadParams,
							countryCode: countryCode,
							onLoad: ilib.bind(this, function (/** @type {ilib.Locale.PhoneLoc} */ locale) {
								ilib.loadData({
									name: "phonefmt.json",
									object: ilib.PhoneFmt,
									locale: locale,
									sync: sync,
									loadParams: ilib.merge(loadParams, {
										returnOne: true
									}),
									callback: ilib.bind(this, function (fmtdata) {
										// console.info("format: switching to region " + locale.region + " and style " + style + " to format the rest of the number ");
										
										var subfmt = "";

										this._doFormat(number, options, i+1, locale, fmtdata, function (subformat) {
											subfmt = subformat;
											if (typeof(callback) === 'function') {
												callback(formatted + subformat);
											}
										});
										
										formatted += subfmt;
									})
								});
							})
						});
						return formatted;
					}
				} else {
					//console.warn("PhoneFmt.format: cannot find format template for field " + fieldName + ", region " + locale.region + ", style " + style);
					// use default of "minimal formatting" so we don't miss parts because of bugs in the format templates
					formatted += number[fieldName];
				}
			}
		}
		
		if (typeof(callback) === 'function') {
			callback(formatted);
		}

		return formatted;
	},
	
	/**
	 * Format the parts of a phone number appropriately according to the settings in 
	 * this formatter instance.
	 *  
	 * The options can contain zero or more of these properties:
	 * 
	 * <ul>
	 * <li><i>partial</i> boolean which tells whether or not this phone number 
	 * represents a partial number or not. The default is false, which means the number 
	 * represents a whole number. 
	 * <li><i>style</i> style to use to format the number, if different from the 
	 * default style or the style specified in the constructor
	 * <li><i>locale</i> The locale with which to parse the number. This gives a clue as to which
     * numbering plan to use.
     * <li><i>mcc</i> The mobile carrier code (MCC) associated with the carrier that the phone is 
     * currently connected to, if known. This also can give a clue as to which numbering plan to
     * use
     * <li><i>onLoad</i> - a callback function to call when the date format object is fully 
     * loaded. When the onLoad option is given, the DateFmt object will attempt to
     * load any missing locale data using the ilib loader callback.
     * When the constructor is done (even if the data is already preassembled), the 
     * onLoad function is called with the current instance as a parameter, so this
     * callback can be used with preassembled or dynamic loading or a mix of the two.
     * <li><i>sync</i> - tell whether to load any missing locale data synchronously or 
     * asynchronously. If this option is given as "false", then the "onLoad"
     * callback must be given, as the instance returned from this constructor will
     * not be usable for a while.
     * <li><i>loadParams</i> - an object containing parameters to pass to the 
     * loader callback function when locale data is missing. The parameters are not
     * interpretted or modified in any way. They are simply passed along. The object 
     * may contain any property/value pairs as long as the calling code is in
     * agreement with the loader callback function as to what those parameters mean.
	 * </ul>
	 *      
	 * The partial parameter specifies whether or not the phone number contains
	 * a partial phone number or if it is a whole phone number. A partial 
	 * number is usually a number as the user is entering it with a dial pad. The
	 * reason is that certain types of phone numbers should be formatted differently
	 * depending on whether or not it represents a whole number. Specifically, SMS
	 * short codes are formatted differently.<p>
	 * 
	 * Example: a subscriber number of "48773" in the US would get formatted as:
	 * 
	 * <ul>
	 * <li>partial: 487-73  (perhaps the user is in the process of typing a whole phone 
	 * number such as 487-7379)
	 * <li>whole:   48773   (this is the entire SMS short code)
	 * </ul>
	 * 
	 * Any place in the UI where the user types in phone numbers, such as the keypad in 
	 * the phone app, should pass in partial: true to this formatting routine. All other 
	 * places, such as the call log in the phone app, should pass in partial: false, or 
	 * leave the partial flag out of the parameters entirely. 
	 * 
	 * @param {!ilib.PhoneNumber} number object containing the phone number to format
	 * @param {{
	 *   partial:boolean,
	 *   style:string,
	 *   mcc:string,
	 *   locale:(string|ilib.Locale),
	 *   sync:boolean,
	 *   loadParams:Object,
	 *   onLoad:function(string)
	 * }} options Parameters which control how to format the number
	 * @return {string} Returns the formatted phone number as a string.
	 */
	format: function (number, options) {
		var formatted = "",
		    callback;

		callback = options && options.onLoad;

		try {
			this._doFormat(number, options, 0, this.locale, this.fmtdata, function (fmt) {
				formatted = fmt;
				
				if (typeof(callback) === 'function') {
					callback(fmt);
				}
			});
		} catch (e) {
			if (typeof(e) === 'string') { 
				// console.warn("caught exception: " + e + ". Using last resort rule.");
				// if there was some exception, use this last resort rule
				formatted = "";
				for (var field in ilib.PhoneNumber._fieldOrder) {
					if (typeof field === 'string' && typeof ilib.PhoneNumber._fieldOrder[field] === 'string' && number[ilib.PhoneNumber._fieldOrder[field]] !== undefined) {
						// just concatenate without any formatting
						formatted += number[ilib.PhoneNumber._fieldOrder[field]];
						if (ilib.PhoneNumber._fieldOrder[field] === 'countryCode') {
							formatted += ' ';		// fix for NOV-107894
						}
					}
				}
			} else {
				throw e;
			}
			
			if (typeof(callback) === 'function') {
				callback(formatted);
			}
		}
		return formatted;
	},
	
	/**
	 * Return an array of names of all available styles that can be used with the current 
	 * formatter.
	 * @return {Array.<string>} an array of names of styles that are supported by this formatter
	 */
	getAvailableStyles: function () {
		var ret = [],
			style;

		if (this.fmtdata) {
			for (style in this.fmtdata) {
				if (this.fmtdata[style].example) {
					ret.push(style);
				}
			}
		}
		return ret;
	},
	
	/**
	 * Return an example phone number formatted with the given style.
	 * 
	 * @param {string|undefined} style style to get an example of, or undefined to use
	 * the current default style for this formatter
	 * @return {string|undefined} an example phone number formatted according to the 
	 * given style, or undefined if the style is not recognized or does not have an 
	 * example 
	 */
	getStyleExample: function (style) {
		return this.fmtdata[style].example || undefined;
	}
};

/*
 * phonegeo.js - Represent a phone number geolocator object.
 * 
 * Copyright © 2014, JEDLSoft
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
phone/numplan.js
phone/phoneloc.js
phone/phonenum.js
*/

// !data iddarea area extarea extstates phoneres

/**
 * @class
 * Create an instance that can geographically locate a phone number.<p>
 * 
 * The location of the number is calculated according to the following rules:
 * 
 * <ol>
 * <li>If the areaCode property is undefined or empty, or if the number specifies a 
 * country code for which we do not have information, then the area property may be 
 * missing from the returned object. In this case, only the country object will be returned.
 * 
 * <li>If there is no area code, but there is a mobile prefix, service code, or emergency 
 * code, then a fixed string indicating the type of number will be returned.
 * 
 * <li>The country object is filled out according to the countryCode property of the phone
 * number. 
 * 
 * <li>If the phone number does not have an explicit country code, the MCC will be used if
 * it is available. The country code can be gleaned directly from the MCC. If the MCC 
 * of the carrier to which the phone is currently connected is available, it should be 
 * passed in so that local phone numbers will look correct.
 * 
 * <li>If the country's dialling plan mandates a fixed length for phone numbers, and a 
 * particular number exceeds that length, then the area code will not be given on the
 * assumption that the number has problems in the first place and we cannot guess
 * correctly.
 * </ol>
 * 
 * The returned area property varies in specificity according
 * to the locale. In North America, the area is no finer than large parts of states
 * or provinces. In Germany and the UK, the area can be as fine as small towns.<p>
 * 
 * If the number passed in is invalid, no geolocation will be performed. If the location
 * information about the country where the phone number is located is not available,
 * then the area information will be missing and only the country will be available.<p>
 * 
 * The options parameter can contain any one of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> The locale parameter is used to load translations of the names of regions and
 * areas if available. For example, if the locale property is given as "en-US" (English for USA), 
 * but the phone number being geolocated is in Germany, then this class would return the the names
 * of the country (Germany) and region inside of Germany in English instead of German. That is, a 
 * phone number in Munich and return the country "Germany" and the area code "Munich"
 * instead of "Deutschland" and "München". The default display locale is the current ilib locale. 
 * If translations are not available, the region and area names are given in English, which should 
 * always be available.
 * <li><i>mcc</i> The mcc of the current mobile carrier, if known.
 * 
 * <li><i>onLoad</i> - a callback function to call when the data for the
 * locale is fully loaded. When the onLoad option is given, this object 
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
 * @constructor
 * @param {Object} options parameters controlling the geolocation of the phone number.
 */
ilib.GeoLocator = function(options) {
	var sync = true,
		loadParams = {},
		locale = ilib.getLocale();

	if (options) {
		if (options.locale) {
			locale = options.locale;
		}

		if (typeof(options.sync) === 'boolean') {
			sync = options.sync;
		}
		
		if (options.loadParams) {
			loadParams = options.loadParams;
		}
	}
	
	new ilib.Locale.PhoneLoc({
		locale: locale,
		mcc: options && options.mcc,
		countryCode: options && options.countryCode,
		sync: sync,
		loadParams: loadParams,
		onLoad: ilib.bind(this, function (loc) {
			this.locale = loc;
			new ilib.NumPlan({
				locale: this.locale,
				sync: sync,
				loadParams: loadParams,
				onLoad: ilib.bind(this, function (plan) {
					this.plan = plan;
					
					new ilib.ResBundle({
						locale: this.locale,
						name: "phoneres",
						sync: sync,
						loadParams: loadParams,
						onLoad: ilib.bind(this, function (rb) {
							this.rb = rb;
							
							ilib.loadData({
								name: "iddarea.json",
								object: ilib.GeoLocator,
								nonlocale: true,
								sync: sync,
								loadParams: loadParams,
								callback: ilib.bind(this, function (data) {
									this.regiondata = data;
									ilib.loadData({
										name: "area.json",
										object: ilib.GeoLocator,
										locale: this.locale,
										sync: sync,
										loadParams: ilib.merge(loadParams, {
											returnOne: true
										}),
										callback: ilib.bind(this, function (areadata) {
											this.areadata = areadata;
		
											if (options && typeof(options.onLoad) === 'function') {
												options.onLoad(this);
											}
										})
									});
								})
							});
						})
					});
				})
			});
		})
	});
};

ilib.GeoLocator.prototype = {
	/**
	 * @private
	 * 
	 * Used for locales where the area code is very general, and you need to add in
	 * the initial digits of the subscriber number in order to get the area
	 * 
	 * @param {string} number
	 * @param {Object} stateTable
	 */
	_parseAreaAndSubscriber: function (number, stateTable) {
		var ch,
			i,
			handlerMethod,
			newState,
			prefix = "",
			consumed,
			lastLeaf,
			currentState,
			dot = 14;	// special transition which matches all characters. See AreaCodeTableMaker.java

		if (!number || !stateTable) {
			// can't parse anything
			return undefined;
		}

		//console.log("GeoLocator._parseAreaAndSubscriber: parsing number " + number);

		currentState = stateTable;
		i = 0;
		while (i < number.length) {
			ch = ilib.PhoneNumber._getCharacterCode(number.charAt(i));
			if (ch >= 0) {
				// newState = stateData.states[state][ch];
				newState = currentState.s && currentState.s[ch];
				
				if (!newState && currentState.s && currentState.s[dot]) {
					newState = currentState.s[dot];
				}
				
				if (typeof(newState) === 'object') {
					if (typeof(newState.l) !== 'undefined') {
						// save for latter if needed
						lastLeaf = newState;
						consumed = i;
					}
					// console.info("recognized digit " + ch + " continuing...");
					// recognized digit, so continue parsing
					currentState = newState;
					i++;
				} else {
					if (typeof(newState) === 'undefined' || newState === 0) {
						// this is possibly a look-ahead and it didn't work... 
						// so fall back to the last leaf and use that as the
						// final state
						newState = lastLeaf;
						i = consumed;
					}
					
					if ((typeof(newState) === 'number' && newState) ||
						(typeof(newState) === 'object' && typeof(newState.l) !== 'undefined')) {
						// final state
						var stateNumber = typeof(newState) === 'number' ? newState : newState.l;
						handlerMethod = ilib.PhoneNumber._states[stateNumber];

						//console.info("reached final state " + newState + " handler method is " + handlerMethod + " and i is " + i);
	
						return (handlerMethod === "area") ? number.substring(0, i+1) : undefined;
					} else {
						// failed parse. Either no last leaf to fall back to, or there was an explicit
						// zero in the table
						break;
					}
				}
			} else if (ch === -1) {
				// non-transition character, continue parsing in the same state
				i++;
			} else {
				// should not happen
				// console.info("skipping character " + ch);
				// not a digit, plus, pound, or star, so this is probably a formatting char. Skip it.
				i++;
			}
		}
		return undefined;
	},
	/**
	 * @private
	 * @param prefix
	 * @param table
	 * @returns
	 */
	_matchPrefix: function(prefix, table)  {
		var i, matchedDot, matchesWithDots = [];

		if (table[prefix]) {
			return table[prefix];
		}
		for (var entry in table) {
			if (entry && typeof(entry) === 'string') {
				i = 0;
				matchedDot = false;
				while (i < entry.length && (entry.charAt(i) === prefix.charAt(i) || entry.charAt(i) === '.')) {
					if (entry.charAt(i) === '.') {
						matchedDot = true;
					}
					i++;
				}
				if (i >= entry.length) {
					if (matchedDot) {
						matchesWithDots.push(entry);
					} else {
						return table[entry];
					}
				}
			}
		}

		// match entries with dots last, so sort the matches so that the entry with the 
		// most dots sorts last. The entry that ends up at the beginning of the list is
		// the best match because it has the fewest dots
		if (matchesWithDots.length > 0) {
			matchesWithDots.sort(function (left, right) {
				return (right < left) ? -1 : ((left < right) ? 1 : 0);
			});
			return table[matchesWithDots[0]];
		}
		
		return undefined;
	},
	/**
	 * @private
	 * @param number
	 * @param data
	 * @param locale
	 * @param plan
	 * @param options
	 * @returns {Object}
	 */
	_getAreaInfo: function(number, data, locale, plan, options) {
		var sync = true,
			ret = {}, 
			countryCode, 
			areaInfo, 
			temp, 
			areaCode, 
			geoTable, 
			tempNumber, 
			prefix;

		if (options && typeof(options.sync) === 'boolean') {
			sync = options.sync;
		}

		prefix = number.areaCode || number.serviceCode;
		geoTable = data;
		
		if (prefix !== undefined) {
			if (plan.getExtendedAreaCode()) {
				// for countries where the area code is very general and large, and you need a few initial
				// digits of the subscriber number in order find the actual area
				tempNumber = prefix + number.subscriberNumber;
				tempNumber = tempNumber.replace(/[wWpPtT\+#\*]/g, '');	// fix for NOV-108200
		
				ilib.loadData({
					name: "extarea.json",
					object: ilib.GeoLocator, 
					locale: locale,
					sync: sync,
					loadParams: ilib.merge((options && options.loadParams) || {}, {returnOne: true}),
					callback: ilib.bind(this, function (data) {
						this.extarea = data;
						ilib.loadData({
							name: "extstates.json",
							object: ilib.GeoLocator, 
							locale: locale,
							sync: sync,
							loadParams: ilib.merge((options && options.loadParams) || {}, {returnOne: true}),
							callback: ilib.bind(this, function (data) {
								this.extstates = data;
								geoTable = this.extarea;
								if (this.extarea && this.extstates) {
									prefix = this._parseAreaAndSubscriber(tempNumber, this.extstates);
								}
								
								if (!prefix) {
									// not a recognized prefix, so now try the general table
									geoTable = this.areadata;
									prefix = number.areaCode || number.serviceCode;					
								}

								if ((!plan.fieldLengths || 
								  plan.getFieldLength('maxLocalLength') === undefined ||
								  !number.subscriberNumber ||
								 	number.subscriberNumber.length <= plan.fieldLengths('maxLocalLength'))) {
								  	areaInfo = this._matchPrefix(prefix, geoTable);
									if (areaInfo && areaInfo.sn && areaInfo.ln) {
										//console.log("Found areaInfo " + JSON.stringify(areaInfo));
										ret.area = {
											sn: this.rb.getString(areaInfo.sn).toString(),
											ln: this.rb.getString(areaInfo.ln).toString()
										};
									}
								}		
							})
						});
					})
				});

			} else if (!plan || 
					plan.getFieldLength('maxLocalLength') === undefined || 
					!number.subscriberNumber ||
					number.subscriberNumber.length <= plan.getFieldLength('maxLocalLength')) {
				if (geoTable) {
					areaCode = prefix.replace(/[wWpPtT\+#\*]/g, '');
					areaInfo = this._matchPrefix(areaCode, geoTable);

					if (areaInfo && areaInfo.sn && areaInfo.ln) {
						ret.area = {
							sn: this.rb.getString(areaInfo.sn).toString(),
							ln: this.rb.getString(areaInfo.ln).toString()
						};
					} else if (number.serviceCode) {
						ret.area = {
							sn: this.rb.getString("Service Number").toString(),
							ln: this.rb.getString("Service Number").toString()
						};
					}
				} else {
					countryCode = number.locale._mapRegiontoCC(this.locale.getRegion());
					if (countryCode !== "0" && this.regiondata) {
						temp = this.regiondata[countryCode];
						if (temp && temp.sn) {
							ret.country = {
								sn: this.rb.getString(temp.sn).toString(),
								ln: this.rb.getString(temp.ln).toString(),
								code: this.locale.getRegion()
							};
						}
					}
				}
			} else {
				countryCode = number.locale._mapRegiontoCC(this.locale.getRegion());
				if (countryCode !== "0" && this.regiondata) {
					temp = this.regiondata[countryCode];
					if (temp && temp.sn) {
						ret.country = {
							sn: this.rb.getString(temp.sn).toString(),
							ln: this.rb.getString(temp.ln).toString(),
							code: this.locale.getRegion()
						};
					}
				}
			}

		} else if (number.mobilePrefix) {
			ret.area = {
				sn: this.rb.getString("Mobile Number").toString(),
				ln: this.rb.getString("Mobile Number").toString()
			};
		} else if (number.emergency) {
			ret.area = {
				sn: this.rb.getString("Emergency Services Number").toString(),
				ln: this.rb.getString("Emergency Services Number").toString()
			};
		}

		return ret;
	},
	/**
	 * Returns a the location of the given phone number, if known. 
	 * The returned object has 2 properties, each of which has an sn (short name) 
	 * and an ln (long name) string. Additionally, the country code, if given,
	 * includes the 2 letter ISO code for the recognized country.
	 *	 	{
	 *			"country": {
	 *	        	"sn": "North America",
	 *            	"ln": "North America and the Caribbean Islands",
	 *				"code": "us"
	 *         	 },
	 *         	 "area": {
	 *       	    "sn": "California",
	 *          	 "ln": "Central California: San Jose, Los Gatos, Milpitas, Sunnyvale, Cupertino, Gilroy"
	 *         	 }
	 *    	 }
	 * 
	 * The location name is subject to the following rules:
	 *
	 * If the areaCode property is undefined or empty, or if the number specifies a 
	 * country code for which we do not have information, then the area property may be 
	 * missing from the returned object. In this case, only the country object will be returned.
	 *
	 * If there is no area code, but there is a mobile prefix, service code, or emergency 
	 * code, then a fixed string indicating the type of number will be returned.
	 * 
	 * The country object is filled out according to the countryCode property of the phone
	 * number. 
	 * 
	 * If the phone number does not have an explicit country code, the MCC will be used if
	 * it is available. The country code can be gleaned directly from the MCC. If the MCC 
	 * of the carrier to which the phone is currently connected is available, it should be 
	 * passed in so that local phone numbers will look correct.
	 * 
	 * If the country's dialling plan mandates a fixed length for phone numbers, and a 
	 * particular number exceeds that length, then the area code will not be given on the
	 * assumption that the number has problems in the first place and we cannot guess
	 * correctly.
	 *
	 * The returned area property varies in specificity according
	 * to the locale. In North America, the area is no finer than large parts of states
	 * or provinces. In Germany and the UK, the area can be as fine as small towns.
	 *
	 * The strings returned from this function are already localized to the 
	 * given locale, and thus are ready for display to the user.
	 *
	 * If the number passed in is invalid, an empty object is returned. If the location
	 * information about the country where the phone number is located is not available,
	 * then the area information will be missing and only the country will be returned.
     *
	 * The options parameter can contain any one of the following properties:
 	 * 
 	 * <ul>
 	 * <li><i>locale</i> The locale parameter is used to load translations of the names of regions and
 	 * areas if available. For example, if the locale property is given as "en-US" (English for USA), 
 	 * but the phone number being geolocated is in Germany, then this class would return the the names
 	 * of the country (Germany) and region inside of Germany in English instead of German. That is, a 
 	 * phone number in Munich and return the country "Germany" and the area code "Munich"
 	 * instead of "Deutschland" and "München". The default display locale is the current ilib locale. 
 	 * If translations are not available, the region and area names are given in English, which should 
 	 * always be available.
 	 * <li><i>mcc</i> The mcc of the current mobile carrier, if known.
 	 * 
 	 * <li><i>onLoad</i> - a callback function to call when the data for the
 	 * locale is fully loaded. When the onLoad option is given, this object 
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
	 * @param {ilib.PhoneNumber} number phone number to locate
	 * @param {Object} options options governing the way this ares is loaded
	 * @return {Object} an object  
	 * that describes the country and the area in that country corresponding to this
	 * phone number. Each of the country and area contain a short name (sn) and long
	 * name (ln) that describes the location.
	 */
	locate: function(number, options) {
		var loadParams = {},
			ret = {}, 
			region, 
			countryCode, 
			temp, 
			plan,
			areaResult,
			phoneLoc = this.locale,
			sync = true;

		if (number === undefined || typeof(number) !== 'object' || !(number instanceof ilib.PhoneNumber)) {
			return ret;
		}

		if (options) {
			if (typeof(options.sync) !== 'undefined') {
				sync = (options.sync == true);
			}
		
			if (options.loadParams) {
				loadParams = options.loadParams;
			}
		}

		// console.log("GeoLocator.locate: looking for geo for number " + JSON.stringify(number));
		region = this.locale.getRegion();
		if (number.countryCode !== undefined && this.regiondata) {
			countryCode = number.countryCode.replace(/[wWpPtT\+#\*]/g, '');
			temp = this.regiondata[countryCode];
			phoneLoc = number.destinationLocale;
			plan = number.destinationPlan;
			ret.country = {
				sn: this.rb.getString(temp.sn).toString(),
				ln: this.rb.getString(temp.ln).toString(),
				code: phoneLoc.getRegion()
			};
		}
		
		if (!plan) {
			plan = this.plan;
		}
		
		ilib.loadData({
			name: "area.json",
			object: ilib.GeoLocator,
			locale: phoneLoc,
			sync: sync,
			loadParams: ilib.merge(loadParams, {
				returnOne: true
			}),
			callback: ilib.bind(this, function (areadata) {
				if (areadata) {
					this.areadata = areadata;	
				}
				areaResult = this._getAreaInfo(number, this.areadata, phoneLoc, plan, options);
				ret = ilib.merge(ret, areaResult);

				if (ret.country === undefined) {
					countryCode = number.locale._mapRegiontoCC(region);
					
					if (countryCode !== "0" && this.regiondata) {
						temp = this.regiondata[countryCode];
						if (temp && temp.sn) {
							ret.country = {
								sn: this.rb.getString(temp.sn).toString(),
								ln: this.rb.getString(temp.ln).toString(),
								code: this.locale.getRegion()
							};
						}
					}
				}
			})
		});
		
		return ret;
	},
	
	/**
	 * Returns a string that describes the ISO-3166-2 country code of the given phone
	 * number.<p> 
	 * 
	 * If the phone number is a local phone number and does not contain
	 * any country information, this routine will return the region for the current
	 * formatter instance.
     *
	 * @param {ilib.PhoneNumber} number An ilib.PhoneNumber instance
	 * @return {string}
	 */
	country: function(number) {
		var countryCode,
			region,
			phoneLoc;

		if (!number || !(number instanceof ilib.PhoneNumber)) {
			return "";
		}

		phoneLoc = number.locale;

		region = (number.countryCode && phoneLoc._mapCCtoRegion(number.countryCode)) ||
			(number.locale && number.locale.region) || 
			phoneLoc.locale.getRegion() ||
			this.locale.getRegion();

		countryCode = number.countryCode || phoneLoc._mapRegiontoCC(region);
		
		if (number.areaCode) {
			region = phoneLoc._mapAreatoRegion(countryCode, number.areaCode);
		} else if (countryCode === "33" && number.serviceCode) {
			// french departments are in the service code, not the area code
			region = phoneLoc._mapAreatoRegion(countryCode, number.serviceCode);
		}		
		return region;
	}
};
/*
 * unit.js - Unit class
 * 
 * Copyright © 2014, JEDLSoft
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
*/


/**
 * @class
 * Create a measurement instance. The measurement is immutable once
 * it is created, but can be converted to other measurements later.<p>
 * 
 * The options may contain any of the following properties:
 * 
 * <ul>
 * <li><i>amount</i> - either a numeric amount for this measurement given
 * as a number of the specified units, or another ilib.Measurement instance 
 * to convert to the requested units. If converting to new units, the type
 * of measure between the other instance's units and the current units
 * must be the same. That is, you can only convert one unit of mass to
 * another. You cannot convert a unit of mass into a unit of length. 
 * 
 * <li><i>unit</i> - units of this measurement. Use the 
 * static call {@link ilib.Measurement.getAvailableUnits}
 * to find out what units this version of ilib supports. If the given unit
 * is not a base unit, the amount will be normalized to the number of base units
 * and stored as that number of base units.
 * For example, if an instance is constructed with 1 kg, this will be converted
 * automatically into 1000 g, as grams are the base unit and kg is merely a 
 * commonly used scale of grams.
 * </ul>
 * 
 * Here are some examples of converting a length into new units. The first method
 * is via the constructor by passing the old measurement in as the amount property.
 * 
 * <pre>
 * var measurement1 = new ilib.Measurement({
 *   amount: 5,
 *   units: "kilometers"
 * });
 * var measurement2 = new ilib.Measurement({
 *   amount: measurement1,
 *   units: "miles"
 * });
 * </pre>
 * 
 * The value in measurement2 will end up being about 3.125 miles.
 * 
 * The second method will be using the convert method.
 * 
 * <pre>
 * var measurement1 = new ilib.Measurement({
 *   amount: 5,
 *   units: "kilometers"
 * });
 * var measurement2 = measurement1.convert("miles");
 * });
 * </pre>
 *
 * The value in measurement2 will again end up being about 3.125 miles.
 * 
 * @constructor 
 * @param {Object} options options that control the construction of this instance
 */
ilib.Measurement = function(options) {
	if (!options || typeof(options.unit) === 'undefined') {
		return undefined;
	}

	this.amount = options.amount || 0;
	var measure = undefined;

	for (var c in ilib.Measurement._constructors) {
		var measurement = ilib.Measurement._constructors[c];
		if (typeof(measurement.aliases[options.unit]) !== 'undefined') {
			measure = c;
			break;
		}
	}

	if (!measure || typeof(measure) === 'undefined') {
		return new ilib.Measurement.Unknown({
			unit: options.unit,
			amount: options.amount
		});                
	} else {
		return new ilib.Measurement._constructors[measure](options);
	}
};

/**
 * @private
 */
ilib.Measurement._constructors = {};

/**
 * Return a list of all possible units that this version of ilib supports.
 * Typically, the units are given as their full names in English. Unit names
 * are case-insensitive.
 * 
 * @static
 * @return {Array.<string>} an array of strings containing names of units available
 */
ilib.Measurement.getAvailableUnits = function () {
	var units = [];
	for (var c in ilib.Measurement._constructors) {
		var measure = ilib.Measurement._constructors[c];
		units = units.concat(measure.getMeasures());
	}
	return units;
};

ilib.Measurement.metricScales = {
	"femto": {"symbol": "f", "scale": -15},
	"pico": {"symbol": "p", "scale": -12},
	"nano": {"symbol": "n", "scale": -9},
	"micro": {"symbol": "µ", "scale": -6},
	"milli": {"symbol": "m", "scale": -3},
	"centi": {"symbol": "c", "scale": -2},
	"deci": {"symbol": "d", "scale": -1},
	"deca": {"symbol": "da", "scale": 1},
	"hecto": {"symbol": "h", "scale": 2},
	"kilo": {"symbol": "k", "scale": 3},
	"mega": {"symbol": "M", "scale": 6},
	"giga": {"symbol": "G", "scale": 9},
	"peta": {"symbol": "P", "scale": 12},
	"exa": {"symbol": "E", "scale": 18}
};

ilib.Measurement.prototype = {
	/**
	 * Return the normalized name of the given units. If the units are
	 * not recognized, this method returns its parameter unmodified.<p>
	 * 
	 * Examples:
	 * 
	 * <ui>
	 * <li>"metres" gets normalized to "meter"<br>
	 * <li>"ml" gets normalized to "milliliter"<br>
	 * <li>"foobar" gets normalized to "foobar" (no change because it is not recognized)
	 * </ul>
	 *  
	 * @param {string} name name of the units to normalize. 
	 * @returns {string} normalized name of the units
	 */
	normalizeUnits: function(name) {
		return this.aliases[name] || name;
	},

	/**
	 * Return the normalized units used in this measurement.
	 * @return {string} name of the unit of measurement 
	 */
	getUnit: function() {
		return this.unit;
	},
     
	/**
	 * Return the units originally used to construct this measurement
	 * before it was normalized.
	 * @return {string} name of the unit of measurement 
	 */
	getOriginalUnit: function() {
		return this.originalUnit;
	},
	
	/**
	 * Return the numeric amount of this measurement.
	 * @return {number} the numeric amount of this measurement
	 */
	getAmount: function() {
		return this.amount;
	},
	
	/**
	 * Return the type of this measurement. Examples are "mass",
	 * "length", "speed", etc. Measurements can only be converted
	 * to measurements of the same type.<p>
	 * 
	 * The type of the units is determined automatically from the 
	 * units. For example, the unit "grams" is type "mass". Use the 
	 * static call {@link ilib.Measurement.getAvailableUnits}
	 * to find out what units this version of ilib supports.
	 * 
	 * @abstract
	 * @return {string} the name of the type of this measurement
	 */
	getMeasure: function() {},
	
	/**
	 * Return a new measurement instance that is converted to a new
	 * measurement unit. Measurements can only be converted
	 * to measurements of the same type.<p>
	 * 
	 * @abstract
	 * @param {string} to The name of the units to convert to
	 * @return {ilib.Measurement|undefined} the converted measurement
	 * or undefined if the requested units are for a different
	 * measurement type
	 */
	convert: function(to) {},     
        
        /**
	 * Scale the measurement unit to an acceptable level. The scaling
	 * happens so that the integer part of the amount is as small as
	 * possible without being below zero. This will result in the 
	 * largest units that can represent this measurement without
	 * fractions. Measurements can only be scaled to other measurements 
	 * of the same type.
	 * 
	 * @abstract
	 * @param {string=} measurementsystem system to use (uscustomary|imperial|metric),
	 * or undefined if the system can be inferred from the current measure
	 * @return {ilib.Measurement} a new instance that is scaled to the 
	 * right level
	 */
	scale: function(measurementsystem) {},
        
	/**
	 * Localize the measurement to the commonly used measurement in that locale, for example
	 * If a user's locale is "en-US" and the measurement is given as "60 kmh", 
	 * the formatted number should be automatically converted to the most appropriate 
	 * measure in the other system, in this case, mph. The formatted result should
	 * appear as "37.3 mph". 
	 * 
	 * @abstract
	 * @param {string} locale current locale string
	 * @returns {ilib.Measurement} a new instance that is converted to locale
	 */
	localize: function(locale) {}
};

/*
 * unitfmt.js - Unit formatter class
 * 
 * Copyright © 2014, JEDLSoft
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
resources.js 
localeinfo.js
strings.js
*/

// !data unitfmt

/**
 * @class
 * Create a new unit formatter instance. The unit formatter is immutable once
 * it is created, but can format as many different strings with different values
 * as needed with the same options. Create different unit formatter instances 
 * for different purposes and then keep them cached for use later if you have 
 * more than one unit string to format.<p>
 * 
 * The options may contain any of the following properties:
 * 
 * <ul>
 * <li><i>locale</i> - locale to use when formatting the units. The locale also
 * controls the translation of the names of the units. If the locale is
 * not specified, then the default locale of the app or web page will be used.
 * 
 * <li><i>autoScale</i> - when true, automatically scale the amount to get the smallest
 * number greater than 1, where possible, possibly by converting units within the locale's
 * measurement system. For example, if the current locale is "en-US", and we have
 * a measurement containing 278 fluid ounces, then the number "278" can be scaled down
 * by converting the units to a larger one such as gallons. The scaled size would be
 * 2.17188 gallons. Since iLib does not have a US customary measure larger than gallons,
 * it cannot scale it down any further. If the amount is less than the smallest measure
 * already, it cannot be scaled down any further and no autoscaling will be applied.
 * Default for the autoScale property is "true", so it only needs to be specified when
 * you want to turn off autoscaling.
 * 
 * <li><i>autoConvert</i> - automatically convert the units to the nearest appropriate
 * measure of the same type in the measurement system used by the locale. For example, 
 * if a measurement of length is given in meters, but the current locale is "en-US" 
 * which uses the US Customary system, then the nearest appropriate measure would be 
 * "yards", and the amount would be converted from meters to yards automatically before
 * being formatted. Default for the autoConvert property is "true", so it only needs to 
 * be specified when you want to turn off autoconversion.
 * 
 * <li><i>maxFractionDigits</i> - the maximum number of digits that should appear in the
 * formatted output after the decimal. A value of -1 means unlimited, and 0 means only print
 * the integral part of the number.
 * 
 * <li><i>minFractionDigits</i> - the minimum number of fractional digits that should
 * appear in the formatted output. If the number does not have enough fractional digits
 * to reach this minimum, the number will be zero-padded at the end to get to the limit.
 * 
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
 * 
 * <li><i>onLoad</i> - a callback function to call when the date format object is fully 
 * loaded. When the onLoad option is given, the UnitFmt object will attempt to
 * load any missing locale data using the ilib loader callback.
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
 * Here is an example of how you might use the unit formatter to format a string with
 * the correct units.<p>
 * 
 * Depends directive: !depends unitfmt.js
 *  
 * @constructor
 * @param {Object} options options governing the way this date formatter instance works
 */
ilib.UnitFmt = function(options) {
	var sync = true, 
		loadParams = undefined;
	
    this.length = "long";
    this.scale  = true;
    this.measurementType = 'undefined';
    this.convert = true;
	this.locale = new ilib.Locale();

    if (options) {
    	if (options.locale) {
    		this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
    	}

    	if (typeof(options.sync) === 'boolean') {
    		sync = options.sync;
    	}

    	if (typeof(options.loadParams) !== 'undefined') {
    		loadParams = options.loadParams;
    	}

    	if (options.length) {
    		this.length = options.length;
    	}

    	if (typeof(options.autoScale) === 'boolean') {
    		this.scale = options.autoScale;
    	}

    	if (typeof(options.autoConvert) === 'boolean') {
    		this.convert = options.autoConvert;
    	}
        
        if (typeof(options.useNative) === 'boolean') {
    		this.useNative = options.useNative;
    	}

    	if (options.measurementSystem) {
    		this.measurementSystem = options.measurementSystem;
    	}
        
        if (typeof (options.maxFractionDigits) === 'number') {
            /** 
             * @private
             * @type {number|undefined} 
             */
            this.maxFractionDigits = options.maxFractionDigits;
        }
        if (typeof (options.minFractionDigits) === 'number') {
            /** 
             * @private
             * @type {number|undefined} 
             */
            this.minFractionDigits = options.minFractionDigits;
        }
        /** 
         * @private
         * @type {string} 
         */
        this.roundingMode = options.roundingMode;
    }

    if (!ilib.UnitFmt.cache) {
    	ilib.UnitFmt.cache = {};
    }

	ilib.loadData({
		object: ilib.UnitFmt, 
		locale: this.locale, 
		name: "unitfmt.json", 
		sync: sync, 
		loadParams: loadParams, 
		callback: ilib.bind(this, function (format) {                      
			var formatted = format;
			this.template = formatted["unitfmt"][this.length];
			if (options && typeof(options.onLoad) === 'function') {
				options.onLoad(this);
			}
		})
	});
};

ilib.UnitFmt.prototype = {
	
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
	 * Convert this formatter to a string representation by returning the
	 * format template. This method delegates to getTemplate.
	 * 
	 * @return {string} the format template
	 */
	toString: function() {
		return this.getTemplate();
	},
    
	/**
	 * Return whether or not this formatter will auto-scale the units while formatting.
	 * @returns {boolean} true if auto-scaling is turned on
	 */
    getScale: function() {
        return this.scale;
    },

    /**
     * Return the measurement system that is used for this formatter.
     * @returns {string} the measurement system used in this formatter
     */
    getMeasurementSystem: function() {
        return this.measurementSystem;
    },

	/**
	 * Format a particular unit instance according to the settings of this
	 * formatter object.
	 * 
	 * @param {ilib.Measurement} measurement measurement to format	 
	 * @return {string} the formatted version of the given date instance
	 */
    format: function (measurement) {
    	var u = this.convert ? measurement.localize(this.locale.getSpec()) : measurement;
    	u = this.scale ? u.scale(this.measurementSystem) : u;
    	var formatted = new ilib.String(this.template[u.getUnit()]);
    	// make sure to use the right plural rules
    	formatted.setLocale(this.locale, true, undefined, undefined);
    	var numFmt = new ilib.NumFmt({
    		locale: this.locale,
    		useNative: this.useNative,
            maxFractionDigits: this.maxFractionDigits,
            minFractionDigits: this.minFractionDigits,
            roundingMode: this.roundingMode
    	});
    	formatted = formatted.formatChoice(u.amount,{n:numFmt.format(u.amount)});
    	return formatted.length > 0 ? formatted : u.amount +" " + u.unit;
    }
};

/*
 * Length.js - Unit conversions for Lengths/lengths
 * 
 * Copyright © 2014, JEDLSoft
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
*/

/**
 * @class
 * Create a new length measurement instance.
 *  
 * @constructor
 * @extends ilib.Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling 
 * the construction of this instance
 */
ilib.Measurement.Length = function (options) {
	this.unit = "meter";
	this.amount = 0;
	this.aliases = ilib.Measurement.Length.aliases; // share this table in all instances
	
	if (options) {
		if (typeof(options.unit) !== 'undefined') {
			this.originalUnit = options.unit;
			this.unit = this.aliases[options.unit] || options.unit;
		}
		
		if (typeof(options.amount) === 'object') {
			if (options.amount.getMeasure() === "length") {
				this.amount = ilib.Measurement.Length.convert(this.unit, options.amount.getUnit(), options.amount.getAmount());
			} else {
				throw "Cannot convert unit " + options.amount.unit + " to a length";
			}
		} else if (typeof(options.amount) !== 'undefined') {
			this.amount = parseFloat(options.amount);
		}
	}
	
	if (typeof(ilib.Measurement.Length.ratios[this.unit]) === 'undefined') {
		throw "Unknown unit: " + options.unit;
	}
};

ilib.Measurement.Length.ratios = {
	/*              index, µm           mm           cm           inch         dm           foot          yard          m             dam            hm              km              mile            nm            Mm             Gm             */ 
	"micrometer":   [ 1,   1,           1e-3,        1e-4,        3.93701e-5,  1e-5,        3.28084e-6,   1.09361e-6,   1e-6,         1e-7,          1e-8,           1e-9,           6.21373e-10,  5.39957e-10,  1e-12,          1e-15           ],
	"millimeter":   [ 2,   1000,        1,           0.1,         0.0393701,   0.01,        0.00328084,   1.09361e-3,   0.001,        1e-4,          1e-5,           1e-6,           6.21373e-7,   5.39957e-7,   1e-9,           1e-12           ],
	"centimeter":   [ 3,   1e4,         10,          1,           0.393701,    0.1,         0.0328084,    0.0109361,    0.01,         0.001,         1e-4,           1e-5,           6.21373e-6,   5.39957e-6,   1e-8,           1e-9            ],
    "inch":         [ 4,   25399.986,   25.399986,   2.5399986,   1,           0.25399986,  0.083333333,  0.027777778,  0.025399986,  2.5399986e-3,  2.5399986e-4,   2.5399986e-5,   1.5783e-5,    1.3715e-5,    2.5399986e-8,   2.5399986e-11   ],
    "decimeter":    [ 5,   1e5,         100,         10,          3.93701,     1,           0.328084,     0.109361,     0.1,          0.01,          0.001,          1e-4,           6.21373e-5,   5.39957e-5,   1e-7,           1e-8            ],
    "foot":         [ 6,   304799.99,   304.79999,   30.479999,   12,          3.0479999,   1,            0.33333333,   0.30479999,   0.030479999,   3.0479999e-3,   3.0479999e-4,   1.89394e-4,   1.64579e-4,   3.0479999e-7,   3.0479999e-10   ],
    "yard":         [ 7,   914402.758,  914.402758,  91.4402758,  36,          9.14402758,  3,            1,            0.914402758,  0.0914402758,  9.14402758e-3,  9.14402758e-4,  5.68182e-4,   4.93737e-4,   9.14402758e-7,  9.14402758e-10  ],
	"meter":        [ 8,   1e6,         1000,        100,         39.3701,     10,          3.28084,      1.09361,      1,            0.1,           0.01,           0.001,          6.213712e-4,  5.39957e-4,   1e-6,           1e-7            ],
	"decameter":    [ 9,   1e7,         1e4,         1000,        393.701,     100,         32.8084,      10.9361,      10,           1,             0.1,            0.01,           6.21373e-3,   5.39957e-3,   1e-5,           1e-6            ],
	"hectometer":   [ 10,  1e8,         1e5,         1e4,         3937.01,     1000,        328.084,      109.361,      100,          10,            1,              0.1,            0.0621373,    0.0539957,    1e-4,           1e-5            ],
	"kilometer":    [ 11,  1e9,         1e6,         1e5,         39370.1,     1e4,         3280.84,      1093.61,      1000,         100,           10,             1,              0.621373,     0.539957,     0.001,          1e-4            ],
    "mile":         [ 12,  1.60934e9,   1.60934e6,   1.60934e5,   63360,       1.60934e4,   5280,         1760,         1609.34,      160.934,       16.0934,        1.60934,        1,            0.868976,     1.60934e-3,     1.60934e-6      ],
    "nauticalmile": [ 13,  1.852e9,     1.852e6,     1.852e5,     72913.4,     1.852e4,     6076.12,      2025.37,      1852,         185.2,         18.52,          1.852,          1.15078,      1,            1.852e-3,       1.852e-6        ],
	"megameter":    [ 14,  1e12,        1e9,         1e6,         3.93701e7,   1e5,         3.28084e6,    1.09361e6,    1e4,          1000,          100,            10,             621.373,      539.957,      1,              0.001           ],        
    "gigameter":    [ 15,  1e15,        1e12,        1e9,         3.93701e10,  1e8,         3.28084e9,    1.09361e9,    1e7,          1e6,           1e5,            1e4,            621373.0,     539957.0,     1000,           1               ]	
};

ilib.Measurement.Length.metricSystem = {
    "micrometer": 1,
    "millimeter": 2,
    "centimeter": 3,
    "decimeter": 5,
    "meter": 8,
    "decameter": 9,
    "hectometer": 10,
    "kilometer": 11,
    "megameter": 14,
    "gigameter": 15
};
ilib.Measurement.Length.imperialSystem = {
    "inch": 4,
    "foot": 6,
    "yard": 7,
    "mile": 12,
    "nauticalmile": 13
};
ilib.Measurement.Length.uscustomarySystem = {
    "inch": 4,
    "foot": 6,
    "yard": 7,
    "mile": 12,
    "nauticalmile": 13
};

ilib.Measurement.Length.metricToUScustomary = {
    "micrometer": "inch",
    "millimeter": "inch",
    "centimeter": "inch",
    "decimeter": "inch",
    "meter": "yard",
    "decameter": "yard",
    "hectometer": "mile",
    "kilometer": "mile",
    "megameter": "nauticalmile",
    "gigameter": "nauticalmile"
};
ilib.Measurement.Length.usCustomaryToMetric = {
    "inch": "centimeter",
    "foot": "centimeter",
    "yard": "meter",
    "mile": "kilometer",
    "nauticalmile": "kilometer"
};

ilib.Measurement.Length.prototype = new ilib.Measurement({});
ilib.Measurement.Length.prototype.parent = ilib.Measurement;
ilib.Measurement.Length.prototype.constructor = ilib.Measurement.Length;

/**
 * Return the type of this measurement. Examples are "mass",
 * "length", "speed", etc. Measurements can only be converted
 * to measurements of the same type.<p>
 * 
 * The type of the units is determined automatically from the 
 * units. For example, the unit "grams" is type "mass". Use the 
 * static call {@link ilib.Measurement.getAvailableUnits}
 * to find out what units this version of ilib supports.
 *  
 * @return {string} the name of the type of this measurement
 */
ilib.Measurement.Length.prototype.getMeasure = function() {
	return "length";
};

/**
 * Localize the measurement to the commonly used measurement in that locale. For example
 * If a user's locale is "en-US" and the measurement is given as "60 kmh", 
 * the formatted number should be automatically converted to the most appropriate 
 * measure in the other system, in this case, mph. The formatted result should
 * appear as "37.3 mph". 
 * 
 * @abstract
 * @param {string} locale current locale string
 * @returns {ilib.Measurement} a new instance that is converted to locale
 */
ilib.Measurement.Length.prototype.localize = function(locale) {
    var to;
    if (locale === "en-US" || locale === "en-GB") {
        to = ilib.Measurement.Length.metricToUScustomary[this.unit] || this.unit;
    } else {
        to = ilib.Measurement.Length.usCustomaryToMetric[this.unit] || this.unit;
    }
    return new ilib.Measurement.Length({
        unit: to,
        amount: this
    });
};

/**
 * Return a new measurement instance that is converted to a new
 * measurement unit. Measurements can only be converted
 * to measurements of the same type.<p>
 *  
 * @param {string} to The name of the units to convert to
 * @return {ilib.Measurement|undefined} the converted measurement
 * or undefined if the requested units are for a different
 * measurement type 
 */
ilib.Measurement.Length.prototype.convert = function(to) {
	if (!to || typeof(ilib.Measurement.Length.ratios[this.normalizeUnits(to)]) === 'undefined') {
		return undefined;
	}
	return new ilib.Measurement({
		unit: to,
		amount: this
	});
};

/**
 * Scale the measurement unit to an acceptable level. The scaling
 * happens so that the integer part of the amount is as small as
 * possible without being below zero. This will result in the 
 * largest units that can represent this measurement without
 * fractions. Measurements can only be scaled to other measurements 
 * of the same type.
 * 
 * @param {string=} measurementsystem system to use (uscustomary|imperial|metric),
 * or undefined if the system can be inferred from the current measure
 * @return {ilib.Measurement} a new instance that is scaled to the 
 * right level
 */
ilib.Measurement.Length.prototype.scale = function(measurementsystem) {
    var mSystem;    
    if (measurementsystem === "metric" || (typeof(measurementsystem) === 'undefined' 
            && typeof(ilib.Measurement.Length.metricSystem[this.unit]) !== 'undefined')) {
        mSystem = ilib.Measurement.Length.metricSystem;
    } else if (measurementsystem === "imperial" || (typeof(measurementsystem) === 'undefined' 
            && typeof(ilib.Measurement.Length.imperialSystem[this.unit]) !== 'undefined')) {
        mSystem = ilib.Measurement.Length.imperialSystem;
    } else if (measurementsystem === "uscustomary" || (typeof(measurementsystem) === 'undefined' 
            && typeof(ilib.Measurement.Length.uscustomarySystem[this.unit]) !== 'undefined')) {
        mSystem = ilib.Measurement.Length.uscustomarySystem;
    } else {
        return new ilib.Measurement.Length({
			unit: this.unit,
			amount: this.amount
		});
    }    
    
    var length = this.amount;
    var munit = this.unit;
    var fromRow = ilib.Measurement.Length.ratios[this.unit];
    
    for (var m in mSystem) {
        var tmp = this.amount * fromRow[mSystem[m]];
        if (tmp < 1) break;
        length = tmp;
        munit = m;
    }
    
    return new ilib.Measurement.Length({
		unit: munit,
		amount: length
    });
};

ilib.Measurement.Length.aliases = {
	"miles": "mile",
	"mile":"mile",
	"nauticalmiles": "nauticalmile",
	"nautical mile": "nauticalmile",
	"nautical miles": "nauticalmile",
	"nauticalmile":"nauticalmile",
	"yards": "yard",
	"yard": "yard",
	"feet": "foot",
	"foot": "foot",
	"inches": "inch",
	"inch": "inch",
	"meters": "meter",
	"metre": "meter",
	"metres": "meter",
	"m": "meter",
	"meter": "meter",        
	"micrometers": "micrometer",
	"micrometres": "micrometer",
	"micrometre": "micrometer",
	"µm": "micrometer",
	"micrometer": "micrometer",
	"millimeters": "millimeter",
	"millimetres": "millimeter",
	"millimetre": "millimeter",
	"mm": "millimeter",
	"millimeter": "millimeter",
	"centimeters": "centimeter",
	"centimetres": "centimeter",
	"centimetre": "centimeter",
	"cm": "centimeter",
	"centimeter": "centimeter",
	"decimeters": "decimeter",
	"decimetres": "decimeter",
	"decimetre": "decimeter",
	"dm": "decimeter",
	"decimeter": "decimeter",
	"decameters": "decameter",
	"decametres": "decameter",
	"decametre": "decameter",
	"dam": "decameter",
	"decameter": "decameter",
	"hectometers": "hectometer",
	"hectometres": "hectometer",
	"hectometre": "hectometer",
	"hm": "hectometer",
	"hectometer": "hectometer",
	"kilometers": "kilometer",
	"kilometres": "kilometer",
	"kilometre": "kilometer",
	"km": "kilometer",
	"kilometer": "kilometer",
	"megameters": "megameter",
	"megametres": "megameter",
	"megametre": "megameter",
	"Mm": "megameter",
	"megameter": "megameter",
	"gigameters": "gigameter",
	"gigametres": "gigameter",
	"gigametre": "gigameter",
	"Gm": "gigameter",
	"gigameter": "gigameter"
};

/**
 * Convert a length to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param length {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
ilib.Measurement.Length.convert = function(to, from, length) {
    from = ilib.Measurement.Length.aliases[from] || from;
    to = ilib.Measurement.Length.aliases[to] || to;
	var fromRow = ilib.Measurement.Length.ratios[from];
	var toRow = ilib.Measurement.Length.ratios[to];
	if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
		return undefined;
	}
	return length * fromRow[toRow[0]];
};

/**
 * @private
 * @static
 */
ilib.Measurement.Length.getMeasures = function () {
	var ret = [];
	for (var m in ilib.Measurement.Length.ratios) {
		ret.push(m);
	}
	return ret;
};

//register with the factory method
ilib.Measurement._constructors["length"] = ilib.Measurement.Length;

/*
 * Speed.js - Unit conversions for Speeds/speeds
 * 
 * Copyright © 2014, JEDLSoft
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
unit.js
*/

/**
 * @class
 * Create a new speed measurement instance.
 * 
 * @constructor
 * @extends ilib.Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling 
 * the construction of this instance
 */
ilib.Measurement.Speed = function (options) {
	this.unit = "meters/second";
	this.amount = 0;
	this.aliases = ilib.Measurement.Speed.aliases; // share this table in all instances
	
	if (options) {
		if (typeof(options.unit) !== 'undefined') {
			this.originalUnit = options.unit;
			this.unit = this.aliases[options.unit] || options.unit;
		}
		
		if (typeof(options.amount) === 'object') {
			if (options.amount.getMeasure() === "speed") {
				this.amount = ilib.Measurement.Speed.convert(this.unit, options.amount.getUnit(), options.amount.getAmount());
			} else {
				throw "Cannot convert units " + options.amount.unit + " to a speed";
			}
		} else if (typeof(options.amount) !== 'undefined') {
			this.amount = parseFloat(options.amount);
		}
	}
	
	if (typeof(ilib.Measurement.Speed.ratios[this.unit]) === 'undefined') {
		throw "Unknown unit: " + options.unit;
	}
};

ilib.Measurement.Speed.ratios = {
	/*                 index, k/h         f/s         miles/h      knot         m/s        km/s         miles/s */
    "kilometer/hour":   [ 1,  1,          0.911344,   0.621371,    0.539957,    0.277778,  2.77778e-4,  1.72603109e-4 ],
	"feet/second":      [ 2,  1.09728,    1,          0.681818,    0.592484,    0.3048,    3.048e-4,    1.89393939e-4 ],  
    "miles/hour":       [ 3,  1.60934,    1.46667,    1,           0.868976,    0.44704,   4.4704e-4,   2.77777778e-4 ],
    "knot":             [ 4,  1.852,      1.68781,    1.15078,     1,           0.514444,  5.14444e-4,  3.19660958e-4 ],
  	"meters/second":    [ 5,  3.6,        3.28084,    2.236936,    1.94384,     1,         0.001,       6.21371192e-4 ],	
    "kilometer/second": [ 6,  3600,       3280.8399,  2236.93629,  1943.84449,  1000,      1,           0.621371192   ],
    "miles/second":     [ 7,  5793.6384,  5280,       3600,        3128.31447,  1609.344,  1.609344,    1             ]
};

ilib.Measurement.Speed.metricSystem = {
    "kilometer/hour": 1,
    "meters/second": 5,
    "kilometer/second": 6
};
ilib.Measurement.Speed.imperialSystem = {
    "feet/second": 2,
    "miles/hour": 3,
    "knot": 4,
    "miles/second": 7
};
ilib.Measurement.Speed.uscustomarySystem = {
    "feet/second": 2,
    "miles/hour": 3,
    "knot": 4,
    "miles/second": 7
};

ilib.Measurement.Speed.metricToUScustomary = {
    "kilometer/hour": "miles/hour",
    "meters/second": "feet/second",
    "kilometer/second": "miles/second"
};
ilib.Measurement.Speed.UScustomaryTometric = {
    "miles/hour": "kilometer/hour",
    "feet/second": "meters/second",
    "miles/second": "kilometer/second",
    "knot": "kilometer/hour"
};

ilib.Measurement.Speed.prototype = new ilib.Measurement({});
ilib.Measurement.Speed.prototype.parent = ilib.Measurement;
ilib.Measurement.Speed.prototype.constructor = ilib.Measurement.Speed;

/**
 * Return the type of this measurement. Examples are "mass",
 * "length", "speed", etc. Measurements can only be converted
 * to measurements of the same type.<p>
 * 
 * The type of the units is determined automatically from the 
 * units. For example, the unit "grams" is type "mass". Use the 
 * static call {@link ilib.Measurement.getAvailableUnits}
 * to find out what units this version of ilib supports.
 *  
 * @return {string} the name of the type of this measurement
 */
ilib.Measurement.Speed.prototype.getMeasure = function() {
	return "speed";
};

/**
 * Return a new measurement instance that is converted to a new
 * measurement unit. Measurements can only be converted
 * to measurements of the same type.<p>
 *  
 * @param {string} to The name of the units to convert to
 * @return {ilib.Measurement|undefined} the converted measurement
 * or undefined if the requested units are for a different
 * measurement type 
 */
ilib.Measurement.Speed.prototype.convert = function(to) {
	if (!to || typeof(ilib.Measurement.Speed.ratios[this.normalizeUnits(to)]) === 'undefined') {
		return undefined;
	}
	return new ilib.Measurement({
		unit: to,
		amount: this
	});
};

/**
 * Scale the measurement unit to an acceptable level. The scaling
 * happens so that the integer part of the amount is as small as
 * possible without being below zero. This will result in the 
 * largest units that can represent this measurement without
 * fractions. Measurements can only be scaled to other measurements 
 * of the same type.
 * 
 * @param {string=} measurementsystem system to use (uscustomary|imperial|metric),
 * or undefined if the system can be inferred from the current measure
 * @return {ilib.Measurement} a new instance that is scaled to the 
 * right level
 */
ilib.Measurement.Speed.prototype.scale = function(measurementsystem) {
	var mSystem;
	if (measurementsystem === "metric" ||
	    (typeof (measurementsystem) === 'undefined' && typeof (ilib.Measurement.Speed.metricSystem[this.unit]) !== 'undefined')) {
		mSystem = ilib.Measurement.Speed.metricSystem;
	} else if (measurementsystem === "imperial" ||
	    (typeof (measurementsystem) === 'undefined' && typeof (ilib.Measurement.Speed.imperialSystem[this.unit]) !== 'undefined')) {
		mSystem = ilib.Measurement.Speed.imperialSystem;
	} else if (measurementsystem === "uscustomary" ||
	    (typeof (measurementsystem) === 'undefined' && typeof (ilib.Measurement.Speed.uscustomarySystem[this.unit]) !== 'undefined')) {
		mSystem = ilib.Measurement.Speed.uscustomarySystem;
	} else {
		return new ilib.Measurement.Speed({
		    unit: this.unit,
		    amount: this.amount
		});
	}

	var speed = this.amount;
	var munit = this.unit;
	var fromRow = ilib.Measurement.Speed.ratios[this.unit];

	for ( var m in mSystem) {
		var tmp = this.amount * fromRow[mSystem[m]];
		if (tmp < 1)
			break;
		speed = tmp;
		munit = m;
	}

	return new ilib.Measurement.Speed({
	    unit: munit,
	    amount: speed
	});
};

/**
 * Localize the measurement to the commonly used measurement in that locale. For example
 * If a user's locale is "en-US" and the measurement is given as "60 kmh", 
 * the formatted number should be automatically converted to the most appropriate 
 * measure in the other system, in this case, mph. The formatted result should
 * appear as "37.3 mph". 
 * 
 * @abstract
 * @param {string} locale current locale string
 * @returns {ilib.Measurement} a new instance that is converted to locale
 */
ilib.Measurement.Speed.prototype.localize = function(locale) {
    var to;
    if (locale === "en-US" || locale === "en-GB") {
        to = ilib.Measurement.Speed.metricToUScustomary[this.unit] || this.unit;
    } else {
        to = ilib.Measurement.Speed.UScustomaryTometric[this.unit] || this.unit;
    }
    return new ilib.Measurement.Speed({
		unit: to,
		amount: this
    });
};

ilib.Measurement.Speed.aliases = {
    "foot/sec": "feet/second",
    "foot/s": "feet/second",
    "feet/s": "feet/second",
    "f/s": "feet/second",
    "feet/second": "feet/second",
    "feet/sec": "feet/second",
    "meter/sec": "meters/second",
    "meter/s": "meters/second",
    "meters/s": "meters/second",
    "metre/sec": "meters/second",
    "metre/s": "meters/second",
    "metres/s": "meters/second",
    "mt/sec": "meters/second",
    "m/sec": "meters/second",
    "mt/s": "meters/second",
    "m/s": "meters/second",
    "mps": "meters/second",
    "meters/second": "meters/second",
    "meters/sec": "meters/second",
    "kilometer/hour": "kilometer/hour",
    "km/hour": "kilometer/hour",
    "kilometers/hour": "kilometer/hour",
    "kmh": "kilometer/hour",
    "km/h": "kilometer/hour",
    "kilometer/h": "kilometer/hour",
    "kilometers/h": "kilometer/hour",
    "km/hr": "kilometer/hour",
    "kilometer/hr": "kilometer/hour",
    "kilometers/hr": "kilometer/hour",
    "kilometre/hour": "kilometer/hour",
    "mph": "miles/hour",
    "mile/hour": "miles/hour",
    "mile/hr": "miles/hour",
    "mile/h": "miles/hour",
    "miles/h": "miles/hour",
    "miles/hr": "miles/hour",
    "miles/hour": "miles/hour",
    "kn": "knot",
    "kt": "knot",
    "kts": "knot",
    "knots": "knot",
    "nm/h": "knot",
    "nm/hr": "knot",
    "nauticalmile/h": "knot",
    "nauticalmile/hr": "knot",
    "nauticalmile/hour": "knot",
    "nauticalmiles/hr": "knot",
    "nauticalmiles/hour": "knot",
    "knot": "knot",
    "kilometer/second": "kilometer/second",
    "kilometer/sec": "kilometer/second",
    "kilometre/sec": "kilometer/second",
    "Kilometre/sec": "kilometer/second",
    "kilometers/second": "kilometer/second",
    "kilometers/sec": "kilometer/second",
    "kilometres/sec": "kilometer/second",
    "Kilometres/sec": "kilometer/second",
    "km/sec": "kilometer/second",
    "Km/s": "kilometer/second",
    "km/s": "kilometer/second",
    "miles/second": "miles/second",
    "miles/sec": "miles/second",
    "miles/s": "miles/second",
    "mile/s": "miles/second",
    "mile/sec": "miles/second",
    "Mile/s": "miles/second"
};

/**
 * Convert a speed to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param speed {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
ilib.Measurement.Speed.convert = function(to, from, speed) {
    from = ilib.Measurement.Speed.aliases[from] || from;
    to = ilib.Measurement.Speed.aliases[to] || to;
	var fromRow = ilib.Measurement.Speed.ratios[from];
	var toRow = ilib.Measurement.Speed.ratios[to];
	if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
		return undefined;
	}	
	var result = speed * fromRow[toRow[0]];
    return result;
};

/**
 * @private
 * @static
 */
ilib.Measurement.Speed.getMeasures = function () {
	var ret = [];
	for (var m in ilib.Measurement.Speed.ratios) {
		ret.push(m);
	}
	return ret;
};

//register with the factory method
ilib.Measurement._constructors["speed"] = ilib.Measurement.Speed;

/*
 * digitalStorage.js - Unit conversions for Digital Storage
 * 
 * Copyright © 2014, JEDLSoft
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
unit.js
*/

/**
 * @class
 * Create a new DigitalStorage measurement instance.
 *  
 * @constructor
 * @extends ilib.Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling 
 * the construction of this instance
 */
ilib.Measurement.DigitalStorage = function (options) {
	this.unit = "bit";
	this.amount = 0;
	this.aliases = ilib.Measurement.DigitalStorage.aliases; // share this table in all instances
	
	if (options) {
		if (typeof(options.unit) !== 'undefined') {
			this.originalUnit = options.unit;
			this.unit = this.aliases[options.unit] || options.unit;
		}
		
		if (typeof(options.amount) === 'object') {
			if (options.amount.getMeasure() === "digitalStorage") {
				this.amount = ilib.Measurement.DigitalStorage.convert(this.unit, options.amount.getUnit(), options.amount.getAmount());
			} else {
				throw "Cannot convert unit " + options.amount.unit + " to a digitalStorage";
			}
		} else if (typeof(options.amount) !== 'undefined') {
			this.amount = parseFloat(options.amount);
		}
	}
	
	if (typeof(ilib.Measurement.DigitalStorage.ratios[this.unit]) === 'undefined') {
		throw "Unknown unit: " + options.unit;
	}
};

ilib.Measurement.DigitalStorage.ratios = {
    /*                 bit             byte            kb              kB              mb              mB              gb               gB               tb               tB               pb               pB   */           
	"bit":      [ 1,   1,              0.125,          0.0009765625,   1.220703125e-4, 9.536743164e-7, 1.192092896e-7, 9.313225746e-10, 1.164153218e-10, 9.094947017e-13, 1.136868377e-13, 8.881784197e-16, 1.110223025e-16 ],
    "byte":     [ 2,   8,              1,              0.0078125,      0.0009765625,   7.629394531e-6, 9.536743164e-7, 7.450580597e-9,  9.313225746e-10, 7.275957614e-12, 9.094947017e-13, 7.105427358e-15, 8.881784197e-16 ],
    "kilobit":  [ 3,   1024,           128,            1,              0.125,          0.0009765625,   1.220703125e-4, 9.536743164e-7,  1.192092896e-7,  9.313225746e-10, 1.164153218e-10, 9.094947017e-13, 1.136868377e-13 ],
    "kilobyte": [ 4,   8192,           1024,           8,              1,              0.0078125,      0.0009765625,   7.629394531e-6,  9.536743164e-7,  7.450580597e-9,  9.313225746e-10, 7.275957614e-12, 9.094947017e-13 ],
    "megabit":  [ 5,   1048576,        131072,         1024,           128,            1,              0.125,          0.0009765625,    1.220703125e-4,  9.536743164e-7,  1.192092896e-7,  9.313225746e-10, 1.164153218e-10 ],
    "megabyte": [ 6,   8388608,        1048576,        8192,           1024,           8,              1,              0.0078125,       0.0009765625,    7.629394531e-6,  9.536743164e-7,  7.450580597e-9,  9.313225746e-10 ],
    "gigabit":  [ 7,   1073741824,     134217728,      1048576,        131072,         1024,           128,            1,               0.125,           0.0009765625,    1.220703125e-4,  9.536743164e-7,  1.192092896e-7  ],
    "gigabyte": [ 8,   8589934592,     1073741824,     8388608,        1048576,        8192,           1024,           8,               1,               0.0078125,       0.0009765625,    7.629394531e-6,  9.536743164e-7  ],
    "terabit":  [ 9,   1.099511628e12, 137438953472,   1073741824,     134217728,      1048576,        131072,         1024,            128,             1,               0.125,           0.0009765625,    1.220703125e-4  ],
    "terabyte": [ 10,  8.796093022e12, 1.099511628e12, 8589934592,     1073741824,     8388608,        1048576,        8192,            1024,            8,               1,               0.0078125,       0.0009765625    ],
    "petabit":  [ 11,  1.125899907e15, 1.407374884e14, 1.099511628e12, 137438953472,   1073741824,     134217728,      1048576,         131072,          1024,            128,             1,               0.125           ],
    "petabyte": [ 12,  9.007199255e15, 1.125899907e15, 8.796093022e12, 1.099511628e12, 8589934592,     1073741824,     8388608,         1048576,         8192,            1024,            8,               1               ]
};
ilib.Measurement.DigitalStorage.prototype = new ilib.Measurement({});
ilib.Measurement.DigitalStorage.prototype.parent = ilib.Measurement;
ilib.Measurement.DigitalStorage.prototype.constructor = ilib.Measurement.DigitalStorage;

/**
 * Return the type of this measurement. Examples are "mass",
 * "length", "speed", etc. Measurements can only be converted
 * to measurements of the same type.<p>
 * 
 * The type of the units is determined automatically from the 
 * units. For example, the unit "grams" is type "mass". Use the 
 * static call {@link ilib.Measurement.getAvailableUnits}
 * to find out what units this version of ilib supports.
 *  
 * @return {string} the name of the type of this measurement
 */
ilib.Measurement.DigitalStorage.prototype.getMeasure = function() {
	return "digitalStorage";
};

/**
 * Return a new measurement instance that is converted to a new
 * measurement unit. Measurements can only be converted
 * to measurements of the same type.<p>
 *  
 * @param {string} to The name of the units to convert to
 * @return {ilib.Measurement|undefined} the converted measurement
 * or undefined if the requested units are for a different
 * measurement type
 * 
 */
ilib.Measurement.DigitalStorage.prototype.convert = function(to) {
	if (!to || typeof(ilib.Measurement.DigitalStorage.ratios[this.normalizeUnits(to)]) === 'undefined') {
		return undefined;
	}
	return new ilib.Measurement({
		unit: to,
		amount: this
	});
};

/**
 * Localize the measurement to the commonly used measurement in that locale. For example
 * If a user's locale is "en-US" and the measurement is given as "60 kmh", 
 * the formatted number should be automatically converted to the most appropriate 
 * measure in the other system, in this case, mph. The formatted result should
 * appear as "37.3 mph". 
 * 
 * @abstract
 * @param {string} locale current locale string
 * @returns {ilib.Measurement} a new instance that is converted to locale
 */
ilib.Measurement.DigitalStorage.prototype.localize = function(locale) {
    return new ilib.Measurement.DigitalStorage({
        unit: this.unit,
        amount: this.amount
    });
};

/**
 * Scale the measurement unit to an acceptable level. The scaling
 * happens so that the integer part of the amount is as small as
 * possible without being below zero. This will result in the 
 * largest units that can represent this measurement without
 * fractions. Measurements can only be scaled to other measurements 
 * of the same type.
 * 
 * @param {string=} measurementsystem system to use (uscustomary|imperial|metric),
 * or undefined if the system can be inferred from the current measure
 * @return {ilib.Measurement} a new instance that is scaled to the 
 * right level
 */
ilib.Measurement.DigitalStorage.prototype.scale = function(measurementsystem) {
    
    var fromRow = ilib.Measurement.DigitalStorage.ratios[this.unit];    
    var dStorage = this.amount;
    var munit = this.unit;
    var i=1;
    
    for (var m in ilib.Measurement.DigitalStorage.ratios) {
        var tmp = this.amount * fromRow[i];
        if (tmp < 1) break;
        dStorage = tmp;
        munit = m;
        ++i
    }
    
    return new ilib.Measurement.DigitalStorage({
	unit: munit,
	amount: dStorage
    });    
};

ilib.Measurement.DigitalStorage.aliases = {
    "bits": "bit",
    "bit": "bit",
    "Bits": "bit",
    "Bit": "bit",
    "byte": "byte",
    "bytes": "byte",
    "Byte": "byte",
    "Bytes": "byte",
    "kilobits": "kilobit",
    "Kilobits": "kilobit",
    "KiloBits": "kilobit",
    "kiloBits": "kilobit",
    "kilobit": "kilobit",
    "Kilobit": "kilobit",
    "kiloBit": "kilobit",
    "KiloBit": "kilobit",
    "kb": "kilobit",
    "Kb": "kilobit",
    "kilobyte": "kilobyte",
    "Kilobyte": "kilobyte",
    "kiloByte": "kilobyte",
    "KiloByte": "kilobyte",
    "kilobytes": "kilobyte",
    "Kilobytes": "kilobyte",
    "kiloBytes": "kilobyte",
    "KiloBytes": "kilobyte",
    "kB": "kilobyte",
    "KB": "kilobyte",
    "megabit": "megabit",
    "Megabit": "megabit",
    "megaBit": "megabit",
    "MegaBit": "megabit",
    "megabits": "megabit",
    "Megabits": "megabit",
    "megaBits": "megabit",
    "MegaBits": "megabit",
    "Mb": "megabit",
    "mb": "megabit",
    "megabyte": "megabyte",
    "Megabyte": "megabyte",
    "megaByte": "megabyte",
    "MegaByte": "megabyte",
    "megabytes": "megabyte",
    "Megabytes": "megabyte",
    "megaBytes": "megabyte",
    "MegaBytes": "megabyte",
    "MB": "megabyte",
    "mB": "megabyte",
    "gigabit": "gigabit",
    "Gigabit": "gigabit",
    "gigaBit": "gigabit",
    "GigaBit": "gigabit",
    "gigabits": "gigabit",
    "Gigabits": "gigabit",
    "gigaBits": "gigabyte",
    "GigaBits": "gigabit",
    "Gb": "gigabit",
    "gb": "gigabit",
    "gigabyte": "gigabyte",
    "Gigabyte": "gigabyte",
    "gigaByte": "gigabyte",
    "GigaByte": "gigabyte",
    "gigabytes": "gigabyte",
    "Gigabytes": "gigabyte",
    "gigaBytes": "gigabyte",
    "GigaBytes": "gigabyte",
    "GB": "gigabyte",
    "gB": "gigabyte",
    "terabit": "terabit",
    "Terabit": "terabit",
    "teraBit": "terabit",
    "TeraBit": "terabit",
    "terabits": "terabit",
    "Terabits": "terabit",
    "teraBits": "terabit",
    "TeraBits": "terabit",
    "tb": "terabit",
    "Tb": "terabit",
    "terabyte": "terabyte",
    "Terabyte": "terabyte",
    "teraByte": "terabyte",
    "TeraByte": "terabyte",
    "terabytes": "terabyte",
    "Terabytes": "terabyte",
    "teraBytes": "terabyte",
    "TeraBytes": "terabyte",
    "TB": "terabyte",
    "tB": "terabyte",
    "petabit": "petabit",
    "Petabit": "petabit",
    "petaBit": "petabit",
    "PetaBit": "petabit",
    "petabits": "petabit",
    "Petabits": "petabit",
    "petaBits": "petabit",
    "PetaBits": "petabit",
    "pb": "petabit",
    "Pb": "petabit",
    "petabyte": "petabyte",
    "Petabyte": "petabyte",
    "petaByte": "petabyte",
    "PetaByte": "petabyte",
    "petabytes": "petabyte",
    "Petabytes": "petabyte",
    "petaBytes": "petabyte",
    "PetaBytes": "petabyte",
    "PB": "petabyte",
    "pB": "petabyte"
};

/**
 * Convert a digitalStorage to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param digitalStorage {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
ilib.Measurement.DigitalStorage.convert = function(to, from, digitalStorage) {
    from = ilib.Measurement.DigitalStorage.aliases[from] || from;
    to = ilib.Measurement.DigitalStorage.aliases[to] || to;
	var fromRow = ilib.Measurement.DigitalStorage.ratios[from];
	var toRow = ilib.Measurement.DigitalStorage.ratios[to];
	if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
		return undefined;
	}	
	var result = digitalStorage * fromRow[toRow[0]];
    return result;
};

/**
 * @private
 * @static
 */
ilib.Measurement.DigitalStorage.getMeasures = function () {
	var ret = [];
	for (var m in ilib.Measurement.DigitalStorage.ratios) {
		ret.push(m);
	}
	return ret;
};

//register with the factory method
ilib.Measurement._constructors["digitalStorage"] = ilib.Measurement.DigitalStorage;

/*
 * temperature.js - Unit conversions for Temperature/temperature
 * 
 * Copyright © 2014, JEDLSoft
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
unit.js
*/

/**
 * @class
 * Create a new Temperature measurement instance.
 *  
 * @constructor
 * @extends ilib.Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling 
 * the construction of this instance
 */
ilib.Measurement.Temperature = function (options) {
	this.unit = "celsius";
	this.amount = 0;
	this.aliases = ilib.Measurement.Temperature.aliases; // share this table in all instances

	if (options) {
		if (typeof(options.unit) !== 'undefined') {
			this.originalUnit = options.unit;
			this.unit = this.aliases[options.unit] || options.unit;
		}

		if (typeof(options.amount) === 'object') {
			if (options.amount.getMeasure() === "temperature") {
				this.amount = ilib.Measurement.Temperature.convert(this.unit, options.amount.getUnit(), options.amount.getAmount());
			} else {
				throw "Cannot convert unit " + options.amount.unit + " to a temperature";
			}
		} else if (typeof(options.amount) !== 'undefined') {
			this.amount = parseFloat(options.amount);
		}
	}
};

ilib.Measurement.Temperature.prototype = new ilib.Measurement({});
ilib.Measurement.Temperature.prototype.parent = ilib.Measurement;
ilib.Measurement.Temperature.prototype.constructor = ilib.Measurement.Temperature;

/**
 * Return the type of this measurement. Examples are "mass",
 * "length", "speed", etc. Measurements can only be converted
 * to measurements of the same type.<p>
 * 
 * The type of the units is determined automatically from the 
 * units. For example, the unit "grams" is type "mass". Use the 
 * static call {@link ilib.Measurement.getAvailableUnits}
 * to find out what units this version of ilib supports.
 *  
 * @return {string} the name of the type of this measurement
 */
ilib.Measurement.Temperature.prototype.getMeasure = function() {
	return "temperature";
};

ilib.Measurement.Temperature.aliases = {
    "Celsius": "celsius",
    "celsius": "celsius",
    "C": "celsius",
    "centegrade": "celsius",
    "Centegrade": "celsius",
    "centigrade": "celsius",
    "Centigrade": "celsius",
    "fahrenheit": "fahrenheit",
    "Fahrenheit": "fahrenheit",
    "F": "fahrenheit",
    "kelvin": "kelvin",
    "K": "kelvin",
    "Kelvin": "kelvin",
    "°F": "fahrenheit",
    "℉": "fahrenheit",
    "℃": "celsius",
    "°C": "celsius"
};

/**
 * Return a new measurement instance that is converted to a new
 * measurement unit. Measurements can only be converted
 * to measurements of the same type.<p>
 *  
 * @param {string} to The name of the units to convert to
 * @return {ilib.Measurement|undefined} the converted measurement
 * or undefined if the requested units are for a different
 * measurement type 
 */
ilib.Measurement.Temperature.prototype.convert = function(to) {
	if (!to || typeof(ilib.Measurement.Temperature.ratios[this.normalizeUnits(to)]) === 'undefined') {
		return undefined;
	}
	return new ilib.Measurement({
		unit: to,
		amount: this
	});
};

/**
 * Convert a temperature to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param temperature {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
ilib.Measurement.Temperature.convert = function(to, from, temperature) {
	var result = 0;
	from = ilib.Measurement.Temperature.aliases[from] || from;
	to = ilib.Measurement.Temperature.aliases[to] || to;
	if (from === to)
		return temperature;

	else if (from === "celsius") {
		if (to === "fahrenheit") {
			result = ((temperature * 9 / 5) + 32);
		} else if (to === "kelvin") {
			result = (temperature + 273.15);
		}

	} else if (from === "fahrenheit") {
		if (to === "celsius") {
			result = ((5 / 9 * (temperature - 32)));
		} else if (to === "kelvin") {
			result = ((temperature + 459.67) * 5 / 9);
		}
	} else if (from === "kelvin") {
		if (to === "celsius") {
			result = (temperature - 273.15);
		} else if (to === "fahrenheit") {
			result = ((temperature * 9 / 5) - 459.67);
		}
	}

	return result;
};

/**
 * Scale the measurement unit to an acceptable level. The scaling
 * happens so that the integer part of the amount is as small as
 * possible without being below zero. This will result in the 
 * largest units that can represent this measurement without
 * fractions. Measurements can only be scaled to other measurements 
 * of the same type.
 * 
 * @param {string=} measurementsystem system to use (uscustomary|imperial|metric),
 * or undefined if the system can be inferred from the current measure
 * @return {ilib.Measurement} a new instance that is scaled to the 
 * right level
 */
ilib.Measurement.Temperature.prototype.scale = function(measurementsystem) {
    return new ilib.Measurement.Temperature({
        unit: this.unit,
        amount: this.amount
    }); 
};

/**
 * @private
 * @static
 */
ilib.Measurement.Temperature.getMeasures = function () {
	return ["celsius", "kelvin", "fahrenheit"];
};
ilib.Measurement.Temperature.metricToUScustomary = {
	"celsius": "fahrenheit"
};
ilib.Measurement.Temperature.usCustomaryToMetric = {
	"fahrenheit": "celsius"
};

/**
 * Localize the measurement to the commonly used measurement in that locale. For example
 * If a user's locale is "en-US" and the measurement is given as "60 kmh", 
 * the formatted number should be automatically converted to the most appropriate 
 * measure in the other system, in this case, mph. The formatted result should
 * appear as "37.3 mph". 
 * 
 * @abstract
 * @param {string} locale current locale string
 * @returns {ilib.Measurement} a new instance that is converted to locale
 */
ilib.Measurement.Temperature.prototype.localize = function(locale) {
    var to;
    if (locale === "en-US" ) {
        to = ilib.Measurement.Temperature.metricToUScustomary[this.unit] || this.unit;
    } else {
        to = ilib.Measurement.Temperature.usCustomaryToMetric[this.unit] || this.unit;
    }
    return new ilib.Measurement.Temperature({
        unit: to,
        amount: this
    });
};
//register with the factory method
ilib.Measurement._constructors["temperature"] = ilib.Measurement.Temperature;

/*
 * Unknown.js - Dummy unit conversions for unknown types
 * 
 * Copyright © 2014, JEDLSoft
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
unit.js
*/

/**
 * @class
 * Create a new unknown measurement instance.
 * 
 * @constructor
 * @extends ilib.Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling 
 * the construction of this instance
 */
ilib.Measurement.Unknown = function (options) {
	if (options) {
		this.unit = options.unit;
		this.amount = options.amount;
	}
};

ilib.Measurement.Unknown.prototype = new ilib.Measurement({});
ilib.Measurement.Unknown.prototype.parent = ilib.Measurement;
ilib.Measurement.Unknown.prototype.constructor = ilib.Measurement.Unknown;

ilib.Measurement.Unknown.aliases = {
	"unknown":"unknown"
};


/**
 * Return the type of this measurement. Examples are "mass",
 * "length", "speed", etc. Measurements can only be converted
 * to measurements of the same type.<p>
 * 
 * The type of the units is determined automatically from the 
 * units. For example, the unit "grams" is type "mass". Use the 
 * static call {@link ilib.Measurement.getAvailableUnits}
 * to find out what units this version of ilib supports.
 *  
 * @return {string} the name of the type of this measurement
 */
ilib.Measurement.Unknown.prototype.getMeasure = function() {
	return "unknown";
};

/**
 * Return a new measurement instance that is converted to a new
 * measurement unit. Measurements can only be converted
 * to measurements of the same type.<p>
 *  
 * @param {string} to The name of the units to convert to
 * @return {ilib.Measurement|undefined} the converted measurement
 * or undefined if the requested units are for a different
 * measurement type 
 */
ilib.Measurement.Unknown.prototype.convert = function(to) {
	return undefined;
};

/**
 * Convert a unknown to another measure.
 * @static
 * @param {string} to unit to convert to
 * @param {string} from unit to convert from
 * @param {number} unknown amount to be convert
 * @returns {number|undefined} the converted amount
 */
ilib.Measurement.Unknown.convert = function(to, from, unknown) {
    return undefined;
};

/**
 * Localize the measurement to the commonly used measurement in that locale. For example
 * If a user's locale is "en-US" and the measurement is given as "60 kmh", 
 * the formatted number should be automatically converted to the most appropriate 
 * measure in the other system, in this case, mph. The formatted result should
 * appear as "37.3 mph". 
 * 
 * @abstract
 * @param {string} locale current locale string
 * @returns {ilib.Measurement} a new instance that is converted to locale
 */
ilib.Measurement.Unknown.prototype.localize = function(locale) {
    return new ilib.Measurement.Unknown({
        unit: this.unit,
        amount: this.amount
    });
};

/**
 * Scale the measurement unit to an acceptable level. The scaling
 * happens so that the integer part of the amount is as small as
 * possible without being below zero. This will result in the 
 * largest units that can represent this measurement without
 * fractions. Measurements can only be scaled to other measurements 
 * of the same type.
 * 
 * @param {string=} measurementsystem system to use (uscustomary|imperial|metric),
 * or undefined if the system can be inferred from the current measure
 * @return {ilib.Measurement} a new instance that is scaled to the 
 * right level
 */
ilib.Measurement.Unknown.prototype.scale = function(measurementsystem) {
    return new ilib.Measurement.Unknown({
        unit: this.unit,
        amount: this.amount
    }); 
};

/**
 * @private
 * @static
 */
ilib.Measurement.Unknown.getMeasures = function () {
	return [];
};

//register with the factory method
ilib.Measurement._constructors["unknown"] = ilib.Measurement.Unknown;


/*
 * Time.js - Unit conversions for Times/times
 * 
 * Copyright © 2014, JEDLSoft
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
unit.js
*/

/**
 * @class
 * Create a new time measurement instance.
 * 
 * @constructor
 * @extends ilib.Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling 
 * the construction of this instance
 */
ilib.Measurement.Time = function (options) {
	this.unit = "ns";
	this.amount = 0;
	this.aliases = ilib.Measurement.Time.aliases; // share this table in all instances
	
	if (options) {
		if (typeof(options.unit) !== 'undefined') {
			this.originalUnit = options.unit;
			this.unit = this.aliases[options.unit] || options.unit;
		}
		
		if (typeof(options.amount) === 'object') {
			if (options.amount.getMeasure() === "time") {
				this.amount = ilib.Measurement.Time.convert(this.unit, options.amount.getUnit(), options.amount.getAmount());
			} else {
				throw "Cannot convert units " + options.amount.unit + " to a time";
			}
		} else if (typeof(options.amount) !== 'undefined') {
			this.amount = parseFloat(options.amount);
		}
	}
	
	if (typeof(ilib.Measurement.Time.ratios[this.unit]) === 'undefined') {
		throw "Unknown unit: " + options.unit;
	}
};

ilib.Measurement.Time.ratios = {
	/*              index  nsec        msec        mlsec       sec        min          hour          day           week         month        year         decade        century    */           
	"nanosecond":   [ 1,   1,          0.001,      1e-6,       1e-9,      1.6667e-11,  2.7778e-13,   1.1574e-14,   1.6534e-15,  3.8027e-16,  3.1689e-17,  3.1689e-18,   3.1689e-19  ],  
	"microsecond":  [ 2,   1000,       1,          0.001,      1e-6,      1.6667e-8,   2.7778e-10,   1.1574e-11,   1.6534e-12,  3.8027e-13,  3.1689e-14,  3.1689e-15,   3.1689e-16  ],  
	"millisecond":  [ 3,   1e+6,       1000,       1,          0.001,     1.6667e-5,   2.7778e-7,    1.1574e-8,    1.6534e-9,   3.8027e-10,  3.1689e-11,  3.1689e-12,   3.1689e-13  ],
	"second":       [ 4,   1e+9,       1e+6,       1000,       1,         0.0166667,   0.000277778,  1.1574e-5,    1.6534e-6,   3.8027e-7,   3.1689e-8,   3.1689e-9,    3.1689e-10  ],
	"minute":       [ 5,   6e+10,      6e+7,       60000,      60,        1,           0.0166667,    0.000694444,  9.9206e-5,   2.2816e-5,   1.9013e-6,   1.9013e-7,    1.9013e-8   ],
    "hour":         [ 6,   3.6e+12,    3.6e+9,     3.6e+6,     3600,      60,          1,            0.0416667,    0.00595238,  0.00136895,  0.00011408,  1.1408e-5,    1.1408e-6   ],
    "day":          [ 7,   8.64e+13,   8.64e+10,   8.64e+7,    86400,     1440,        24,           1,            0.142857,    0.0328549,   0.00273791,  0.000273791,  2.7379e-5   ],
    "week":         [ 8,   6.048e+14,  6.048e+11,  6.048e+8,   604800,    10080,       168,          7,            1,           0.229984,    0.0191654,   0.00191654,   0.000191654 ],
    "month":        [ 9,   2.63e+15,   2.63e+12,   2.63e+9,    2.63e+6,   43829.1,     730.484,      30.4368,      4.34812,     1,           0.0833333,   0.00833333,   0.000833333 ],
    "year":         [ 10,  3.156e+16,  3.156e+13,  3.156e+10,  3.156e+7,  525949,      8765.81,      365.242,      52.1775,     12,          1,           0.1,          0.01        ],
    "decade":       [ 11,  3.156e+17,  3.156e+14,  3.156e+11,  3.156e+8,  5.259e+6,    87658.1,      3652.42,      521.775,     120,         10,          1,            0.1         ],
    "century":      [ 12,  3.156e+18,  3.156e+18,  3.156e+12,  3.156e+9,  5.259e+7,    876581,       36524.2,      5217.75,     1200,        100,         10,           1           ]
};

ilib.Measurement.Time.prototype = new ilib.Measurement({});
ilib.Measurement.Time.prototype.parent = ilib.Measurement;
ilib.Measurement.Time.prototype.constructor = ilib.Measurement.Time;

/**
 * Return the type of this measurement. Examples are "mass",
 * "length", "speed", etc. Measurements can only be converted
 * to measurements of the same type.<p>
 * 
 * The type of the units is determined automatically from the 
 * units. For example, the unit "grams" is type "mass". Use the 
 * static call {@link ilib.Measurement.getAvailableUnits}
 * to find out what units this version of ilib supports.
 *  
 * @return {string} the name of the type of this measurement
 */
ilib.Measurement.Time.prototype.getMeasure = function() {
	return "time";
};

/**
 * Return a new measurement instance that is converted to a new
 * measurement unit. Measurements can only be converted
 * to measurements of the same type.<p>
 *  
 * @param {string} to The name of the units to convert to
 * @return {ilib.Measurement|undefined} the converted measurement
 * or undefined if the requested units are for a different
 * measurement type 
 */
ilib.Measurement.Time.prototype.convert = function(to) {
	if (!to || typeof(ilib.Measurement.Time.ratios[this.normalizeUnits(to)]) === 'undefined') {
		return undefined;
	}
	return new ilib.Measurement({
		unit: to,
		amount: this
	});
};

ilib.Measurement.Time.aliases = {
    "ns": "nanosecond",
    "NS": "nanosecond",
    "nS": "nanosecond",
    "Ns": "nanosecond",
    "Nanosecond": "nanosecond",
    "Nanoseconds": "nanosecond",
    "nanosecond": "nanosecond",
    "nanoseconds": "nanosecond",
    "NanoSecond": "nanosecond",
    "NanoSeconds": "nanosecond",
    "μs": "microsecond",
    "μS": "microsecond",
    "microsecond": "microsecond",
    "microseconds": "microsecond",
    "Microsecond": "microsecond",
    "Microseconds": "microsecond",
    "MicroSecond": "microsecond",
    "MicroSeconds": "microsecond",
    "ms": "millisecond",
    "MS": "millisecond",
    "mS": "millisecond",
    "Ms": "millisecond",
    "millisecond": "millisecond",
    "milliseconds": "millisecond",
    "Millisecond": "millisecond",
    "Milliseconds": "millisecond",
    "MilliSecond": "millisecond",
    "MilliSeconds": "millisecond",
    "s": "second",
    "S": "second",
    "sec": "second",
    "second": "second",
    "seconds": "second",
    "Second": "second",
    "Seconds": "second",
    "min": "minute",
    "Min": "minute",
    "minute": "minute",
    "minutes": "minute",
    "Minute": "minute",
    "Minutes": "minute",
    "h": "hour",
    "H": "hour",
    "hr": "hour",
    "Hr": "hour",
    "hR": "hour",
    "HR": "hour",
    "hour": "hour",
    "hours": "hour",
    "Hour": "hour",
    "Hours": "hour",
    "Hrs": "hour",
    "hrs": "hour",
    "day": "day",
    "days": "day",
    "Day": "day",
    "Days": "day",
    "week": "week",
    "weeks": "week",
    "Week": "week",
    "Weeks": "week",
    "month": "month",
    "Month": "month",
    "months": "month",
    "Months": "month",
    "year": "year",
    "years": "year",
    "Year": "year",
    "Years": "year",
    "yr": "year",
    "Yr": "year",
    "yrs": "year",
    "Yrs": "year",
    "decade": "decade",
    "decades": "decade",
    "Decade": "decade",
    "Decades": "decade",
    "century": "century",
    "centuries": "century",
    "Century": "century",
    "Centuries": "century"
};

/**
 * Convert a time to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param time {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
ilib.Measurement.Time.convert = function(to, from, time) {
    from = ilib.Measurement.Time.aliases[from] || from;
    to = ilib.Measurement.Time.aliases[to] || to;
    var fromRow = ilib.Measurement.Time.ratios[from];
    var toRow = ilib.Measurement.Time.ratios[to];
    if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
        return undefined;
    }	
    return time * fromRow[toRow[0]];
};

/**
 * Localize the measurement to the commonly used measurement in that locale. For example
 * If a user's locale is "en-US" and the measurement is given as "60 kmh", 
 * the formatted number should be automatically converted to the most appropriate 
 * measure in the other system, in this case, mph. The formatted result should
 * appear as "37.3 mph". 
 * 
 * @abstract
 * @param {string} locale current locale string
 * @returns {ilib.Measurement} a new instance that is converted to locale
 */
ilib.Measurement.Time.prototype.localize = function(locale) {
    return new ilib.Measurement.Time({
        unit: this.unit,
        amount: this.amount
    });
};

/**
 * Scale the measurement unit to an acceptable level. The scaling
 * happens so that the integer part of the amount is as small as
 * possible without being below zero. This will result in the 
 * largest units that can represent this measurement without
 * fractions. Measurements can only be scaled to other measurements 
 * of the same type.
 * 
 * @param {string=} measurementsystem system to use (uscustomary|imperial|metric),
 * or undefined if the system can be inferred from the current measure
 * @return {ilib.Measurement} a new instance that is scaled to the 
 * right level
 */
ilib.Measurement.Time.prototype.scale = function(measurementsystem) {

    var fromRow = ilib.Measurement.Time.ratios[this.unit];
    var time = this.amount;
    var munit = this.unit;
    var i=1;

    for (var m in ilib.Measurement.Time.ratios) {
        var tmp = this.amount * fromRow[i];
        if (tmp < 1) break;
        time = tmp;
        munit = m;
        ++i
    }

    return new ilib.Measurement.Time({
        unit: munit,
        amount: time
    });
};
/**
 * @private
 * @static
 */
ilib.Measurement.Time.getMeasures = function () {
	var ret = [];
	for (var m in ilib.Measurement.Time.ratios) {
		ret.push(m);
	}
	return ret;
};

//register with the factory method
ilib.Measurement._constructors["time"] = ilib.Measurement.Time;

/*
 * Mass.js - Unit conversions for Mass/mass
 * 
 * Copyright © 2014, JEDLSoft
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
*/

/**
 * @class
 * Create a new mass measurement instance.
 *
 * @constructor
 * @extends ilib.Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling 
 * the construction of this instance
 */
ilib.Measurement.Mass = function (options) {
	this.unit = "ns";
	this.amount = 0;
	this.aliases = ilib.Measurement.Mass.aliases; // share this table in all instances
	
	if (options) {
		if (typeof(options.unit) !== 'undefined') {
			this.originalUnit = options.unit;
			this.unit = this.aliases[options.unit] || options.unit;
		}
		
		if (typeof(options.amount) === 'object') {
			if (options.amount.getMeasure() === "mass") {
				this.amount = ilib.Measurement.Mass.convert(this.unit, options.amount.getUnit(), options.amount.getAmount());
			} else {
				throw "Cannot convert units " + options.amount.unit + " to a mass";
			}
		} else if (typeof(options.amount) !== 'undefined') {
			this.amount = parseFloat(options.amount);
		}
	}
	
	if (typeof(ilib.Measurement.Mass.ratios[this.unit]) === 'undefined') {
		throw "Unknown unit: " + options.unit;
	}
};

ilib.Measurement.Mass.ratios = {
	/*             index  µg          mg         g          oz          lp           kg          st            sh ton       mt ton        ln ton      */           
	"microgram":   [ 1,   1,          0.001,     1e-6,      3.5274e-8,  2.2046e-9,   1e-9,       1.5747e-10,   1.1023e-12,  1e-12,        9.8421e-13   ],  
	"milligram":   [ 2,   1000,       1,         0.001,     3.5274e-5,  2.2046e-6,   1e-6,       1.5747e-7,    1.1023e-9,   1e-9,         9.8421e-10   ],  
	"gram":        [ 3,   1e+6,       1000,      1,         0.035274,   0.00220462,  0.001,      0.000157473,  1.1023e-6,   1e-6,         9.8421e-7    ],
	"ounce":       [ 4,   2.835e+7,   28349.5,   28.3495,   1,          0.0625,      0.0283495,  0.00446429,   3.125e-5,    2.835e-5,     2.7902e-5    ],
	"pound":       [ 5,   4.536e+8,   453592,    453.592,   16,         1,           0.453592,   0.0714286,    0.0005,      0.000453592,  0.000446429  ],
    "kilogram":    [ 6,   1e+9,       1e+6,      1000,      35.274,     2.20462,     1,          0.157473,     0.00110231,  0.001,        0.000984207  ],
    "stone":       [ 7,   6.35e+9,    6.35e+6,   6350.29,   224,        14,          6.35029,    1,            0.007,       0.00635029,   0.00625      ],
    "short ton":   [ 8,   9.072e+11,  9.072e+8,  907185,    32000,      2000,        907.185,    142.857,      1,           0.907185,     0.892857     ],
    "metric ton":  [ 9,   1e+12,      1e+9,      1e+6,      35274,      2204.62,     1000,       157.473,      1.10231,     1,            0.984207     ],
    "long ton":    [ 10,  1.016e+12,  1.016e+9,  1.016e+6,  35840,      2240,        1016.05,    160,          1.12,        1.01605,      1            ]
};

ilib.Measurement.Mass.metricSystem = {
    "microgram": 1,
    "milligram": 2,
    "gram": 3,
    "kilogram": 6,
    "metric ton": 9
};
ilib.Measurement.Mass.imperialSystem = {
    "ounce": 4,
    "pound": 5,
    "stone": 7,
    "long ton": 10
};
ilib.Measurement.Mass.uscustomarySystem = {
    "ounce": 4,
    "pound": 5,
    "short ton": 8
};

ilib.Measurement.Mass.metricToUScustomary = {
    "microgram": "ounce",
    "milligram": "ounce",
    "gram": "ounce",
    "kilogram": "pound",
    "metric ton": "long ton"
};
ilib.Measurement.Mass.metricToImperial = {
    "microgram": "ounce",
    "milligram": "ounce",
    "gram": "ounce",
    "kilogram": "pound",
    "metric ton": "short ton"
};

ilib.Measurement.Mass.imperialToMetric = {
    "ounce": "gram",
    "pound": "kilogram",
    "stone": "kilogram",
    "short ton": "metric ton"
};
ilib.Measurement.Mass.imperialToUScustomary = {
    "ounce": "ounce",
    "pound": "pound",
    "stone": "stone",
    "short ton": "long ton"
};

ilib.Measurement.Mass.uScustomaryToImperial = {
    "ounce": "ounce",
    "pound": "pound",
    "stone": "stone",
    "long ton": "short ton"
};
ilib.Measurement.Mass.uScustomarylToMetric = {
    "ounce": "gram",
    "pound": "kilogram",
    "stone": "kilogram",
    "long ton": "metric ton"
};


ilib.Measurement.Mass.prototype = new ilib.Measurement({});
ilib.Measurement.Mass.prototype.parent = ilib.Measurement;
ilib.Measurement.Mass.prototype.constructor = ilib.Measurement.Mass;

/**
 * Localize the measurement to the commonly used measurement in that locale. For example
 * If a user's locale is "en-US" and the measurement is given as "60 kmh", 
 * the formatted number should be automatically converted to the most appropriate 
 * measure in the other system, in this case, mph. The formatted result should
 * appear as "37.3 mph". 
 * 
 * @abstract
 * @param {string} locale current locale string
 * @returns {ilib.Measurement} a new instance that is converted to locale
 */
ilib.Measurement.Mass.prototype.localize = function(locale) {
	var to;
	if (locale === "en-US") {
		to = ilib.Measurement.Mass.metricToUScustomary[this.unit] ||
		    ilib.Measurement.Mass.imperialToUScustomary[this.unit] || this.unit;
	} else if (locale === "en-GB") {
		to = ilib.Measurement.Mass.metricToImperial[this.unit] ||
		    ilib.Measurement.Mass.uScustomaryToImperial[this.unit] || this.unit;
	} else {
		to = ilib.Measurement.Mass.uScustomarylToMetric[this.unit] ||
		    ilib.Measurement.Mass.imperialToUScustomary[this.unit] || this.unit;
	}
	return new ilib.Measurement.Mass({
	    unit: to,
	    amount: this
	});
};

/**
 * Return the type of this measurement. Examples are "mass",
 * "length", "speed", etc. Measurements can only be converted
 * to measurements of the same type.<p>
 * 
 * The type of the units is determined automatically from the 
 * units. For example, the unit "grams" is type "mass". Use the 
 * static call {@link ilib.Measurement.getAvailableUnits}
 * to find out what units this version of ilib supports.
 *  
 * @return {string} the name of the type of this measurement
 */
ilib.Measurement.Mass.prototype.getMeasure = function() {
	return "mass";
};

/**
 * Return a new measurement instance that is converted to a new
 * measurement unit. Measurements can only be converted
 * to measurements of the same type.<p>
 *  
 * @param {string} to The name of the units to convert to
 * @return {ilib.Measurement|undefined} the converted measurement
 * or undefined if the requested units are for a different
 * measurement type 
 */
ilib.Measurement.Mass.prototype.convert = function(to) {
	if (!to || typeof(ilib.Measurement.Mass.ratios[this.normalizeUnits(to)]) === 'undefined') {
		return undefined;
	}
	return new ilib.Measurement({
		unit: to,
		amount: this
	});
};

ilib.Measurement.Mass.aliases = {
    "µg":"microgram",
    "microgram":"microgram",
    "mcg":"microgram",  
    "milligram":"milligram",
    "mg":"milligram",
    "milligrams":"milligram",
    "Milligram":"milligram",
    "Milligrams":"milligram",
    "MilliGram":"milligram",
    "MilliGrams":"milligram",
    "g":"gram",
    "gram":"gram",
    "grams":"gram",
    "Gram":"gram",
    "Grams":"gram",
    "ounce":"ounce",
    "oz":"ounce",
    "Ounce":"ounce",
    "℥":"ounce",
    "pound":"pound",
    "poundm":"pound",
    "℔":"pound",
    "lb":"pound",
    "pounds":"pound",
    "Pound":"pound",
    "Pounds":"pound",
    "kilogram":"kilogram",
    "kg":"kilogram",
    "kilograms":"kilogram",
    "kilo grams":"kilogram",
    "kilo gram":"kilogram",
    "Kilogram":"kilogram",    
    "Kilograms":"kilogram",
    "KiloGram":"kilogram",
    "KiloGrams":"kilogram",
    "Kilo gram":"kilogram",
    "Kilo grams":"kilogram",
    "Kilo Gram":"kilogram",
    "Kilo Grams":"kilogram",
    "stone":"stone",
    "st":"stone",
    "stones":"stone",
    "Stone":"stone",
    "short ton":"short ton",
    "Short ton":"short ton",
    "Short Ton":"short ton",
    "metric ton":"metric ton",
    "metricton":"metric ton",
    "t":"metric ton",
    "tonne":"metric ton",
    "Tonne":"metric ton",
    "Metric Ton":"metric ton",
    "MetricTon":"metric ton",    
    "long ton":"long ton",
    "longton":"long ton",
    "Longton":"long ton",
    "Long ton":"long ton",
    "Long Ton":"long ton",
    "ton":"long ton",
    "Ton":"long ton"
};

/**
 * Convert a mass to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param mass {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
ilib.Measurement.Mass.convert = function(to, from, mass) {
    from = ilib.Measurement.Mass.aliases[from] || from;
    to = ilib.Measurement.Mass.aliases[to] || to;
    var fromRow = ilib.Measurement.Mass.ratios[from];
    var toRow = ilib.Measurement.Mass.ratios[to];
    if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
        return undefined;
    }	
    return mass * fromRow[toRow[0]];    
};

/**
 * Scale the measurement unit to an acceptable level. The scaling
 * happens so that the integer part of the amount is as small as
 * possible without being below zero. This will result in the 
 * largest units that can represent this measurement without
 * fractions. Measurements can only be scaled to other measurements 
 * of the same type.
 * 
 * @param {string=} measurementsystem system to use (uscustomary|imperial|metric),
 * or undefined if the system can be inferred from the current measure
 * @return {ilib.Measurement} a new instance that is scaled to the 
 * right level
 */
ilib.Measurement.Mass.prototype.scale = function(measurementsystem) {
    var mSystem;    
    if (measurementsystem === "metric" || (typeof(measurementsystem) === 'undefined' 
            && typeof(ilib.Measurement.Mass.metricSystem[this.unit]) !== 'undefined')) {
        mSystem = ilib.Measurement.Mass.metricSystem;
    } else if (measurementsystem === "imperial" || (typeof(measurementsystem) === 'undefined' 
            && typeof(ilib.Measurement.Mass.imperialSystem[this.unit]) !== 'undefined')) {
        mSystem = ilib.Measurement.Mass.imperialSystem;
    } else if (measurementsystem === "uscustomary" || (typeof(measurementsystem) === 'undefined' 
            && typeof(ilib.Measurement.Mass.uscustomarySystem[this.unit]) !== 'undefined')) {
        mSystem = ilib.Measurement.Mass.uscustomarySystem;
    } else {
        return new ilib.Measurement.Mass({
			unit: this.unit,
			amount: this.amount
		});
    }    
    
    var mass = this.amount;
    var munit = this.amount;
    var fromRow = ilib.Measurement.Mass.ratios[this.unit];
    
    for (var m in mSystem) {
        var tmp = this.amount * fromRow[mSystem[m]];
        if (tmp < 1) break;
        mass = tmp;
        munit = m;
    }
    
    return new ilib.Measurement.Mass({
		unit: munit,
		amount: mass
    });
};

/**
 * @private
 * @static
 */
ilib.Measurement.Mass.getMeasures = function () {
	var ret = [];
	for (var m in ilib.Measurement.Mass.ratios) {
		ret.push(m);
	}
	return ret;
};

//register with the factory method
ilib.Measurement._constructors["mass"] = ilib.Measurement.Mass;

/*
 * area.js - Unit conversions for Area
 * 
 * Copyright © 2014, JEDLSoft
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
unit.js
*/

/**
 * @class
 * Create a new area measurement instance.
 * @constructor
 * @extends ilib.Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling 
 * the construction of this instance
 */
ilib.Measurement.Area = function (options) {
	this.unit = "square km";
	this.amount = 0;
	this.aliases = ilib.Measurement.Area.aliases; // share this table in all instances
	
	if (options) {
		if (typeof(options.unit) !== 'undefined') {
			this.originalUnit = options.unit;
			this.unit = this.aliases[options.unit] || options.unit;
		}
		
		if (typeof(options.amount) === 'object') {
			if (options.amount.getMeasure() === "area") {
				this.amount = ilib.Measurement.Area.convert(this.unit, options.amount.getUnit(), options.amount.getAmount());
			} else {
				throw "Cannot convert unit " + options.amount.unit + " to area";
			}
		} else if (typeof(options.amount) !== 'undefined') {
			this.amount = parseFloat(options.amount);
		}
	}
	
	if (typeof(ilib.Measurement.Area.ratios[this.unit]) === 'undefined') {
		throw "Unknown unit: " + options.unit;
	}
};

ilib.Measurement.Area.ratios = {
    /*               index		square cm,		square meter,   hectare,   	square km, 	, square inch 	square foot, 		square yard, 	  	  		acre,			square mile			        */
    "square centimeter":[1,   	1,				0.0001,			1e-8,	    1e-10,        0.15500031,	0.00107639104,		0.000119599005,			2.47105381e-8,		3.86102159e-11 		],
    "square meter": 	[2,   	10000,			1,              1e-4,       1e-6,         1550,    	 	10.7639,    	  	1.19599,   				0.000247105,		3.861e-7     	    ],
    "hectare":      	[3,	 	100000000,  	10000,          1,          0.01,         1.55e+7, 	  	107639,     	 	11959.9,   				2.47105	,			0.00386102    	    ],
    "square km":    	[4,	  	10000000000, 	1e+6,          	100,        1,	          1.55e+9, 	  	1.076e+7,   	 	1.196e+6,  				247.105 ,   		0.386102     	    ],
    "square inch":  	[5,	  	6.4516,			0.00064516,     6.4516e-8,  6.4516e-10,   1,			0.000771605,	  	0.0007716051, 			1.5942e-7,			2.491e-10    	    ],
    "square foot":  	[6,		929.0304,		0.092903,       9.2903e-6,  9.2903e-8,    144,			1,          	  	0.111111,  				2.2957e-5,			3.587e-8    		],
    "square yard":  	[7,		8361.2736,		0.836127,       8.3613e-5,  8.3613e-7,    1296,    	  	9,          	  	1,         				0.000206612,		3.2283e-7    	    ],
    "acre":         	[8,		40468564.2,		4046.86,        0.404686,   0.00404686,   6.273e+6,	  	43560,      	  	4840,      				1,		    		0.0015625    	    ],
    "square mile":  	[9,	   	2.58998811e+10,	2.59e+6,        258.999,    2.58999,      4.014e+9,	 	2.788e+7,   	  	3.098e+6,  				640,     			1   	     		]
}

ilib.Measurement.Area.prototype = new ilib.Measurement({});
ilib.Measurement.Area.prototype.parent = ilib.Measurement;
ilib.Measurement.Area.prototype.constructor = ilib.Measurement.Area;

/**
 * Return the type of this measurement. Examples are "mass",
 * "length", "speed", etc. Measurements can only be converted
 * to measurements of the same type.<p>
 * 
 * The type of the units is determined automatically from the 
 * units. For example, the unit "grams" is type "mass". Use the 
 * static call {@link ilib.Measurement.getAvailableUnits}
 * to find out what units this version of ilib supports.
 *  
 * @return {string} the name of the type of this measurement
 */
ilib.Measurement.Area.prototype.getMeasure = function() {
	return "area";
}; 

/**
 * Return a new measurement instance that is converted to a new
 * measurement unit. Measurements can only be converted
 * to measurements of the same type.<p>
 *  
 * @param {string} to The name of the units to convert to
 * @return {ilib.Measurement|undefined} the converted measurement
 * or undefined if the requested units are for a different
 * measurement type
 * 
 */
ilib.Measurement.Area.prototype.convert = function(to) {
	if (!to || typeof(ilib.Measurement.Area.ratios[this.normalizeUnits(to)]) === 'undefined') {
		return undefined;
	}
	return new ilib.Measurement({
		unit: to, 
		amount: this
	});
};

ilib.Measurement.Area.aliases = {
    "square centimeter":"square centimeter",
    "square cm":"square centimeter",
    "sq cm":"square centimeter",
    "Square Cm":"square centimeter",
    "square Centimeters":"square centimeter",
    "square Centimeter":"square centimeter",
    "square Centimetre":"square centimeter",
    "square Centimetres":"square centimeter",
    "square centimeters":"square centimeter",
    "Square km": "square km",
	"Square kilometre":"square km",
	"square kilometer":"square km",
	"square kilometre":"square km",
	"square kilometers":"square km",
	"square kilometres":"square km",
        "square km":"square km",
	"sq km":"square km",
	"km2":"square km",
	"Hectare":"hectare",
	"hectare":"hectare",
	"ha":"hectare",
	"Square meter": "square meter",
	"Square meters":"square meter",
	"square meter": "square meter",
	"square meters":"square meter",
	"Square metre": "square meter",
	"Square metres":"square meter",
	"square metres": "square meter",
	"Square Metres":"square meter",
	"sqm":"square meter",
	"m2": "square meter",
	"Square mile":"square mile",
	"Square miles":"square mile",
	"square mile":"square mile",
	"square miles":"square mile",
	"square mi":"square mile",
	"Square mi":"square mile",
	"sq mi":"square mile",
	"mi2":"square mile",
	"Acre": "acre",
	"acre": "acre",
	"Acres":"acre",
	"acres":"acre",
	"Square yard": "square yard",
	"Square yards":"square yard",
	"square yard": "square yard",
	"square yards":"square yard",
	"yd2":"square yard",
	"Square foot": "square foot",
	"square foot": "square foot",
	"Square feet": "square foot",
	"Square Feet": "square foot",
	"sq ft":"square foot",
	"ft2":"square foot",
	"Square inch":"square inch",
	"square inch":"square inch",
	"Square inches":"square inch",
	"square inches":"square inch",
	"in2":"square inch"
};

/**
 * Convert a Area to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param area {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
ilib.Measurement.Area.convert = function(to, from, area) {
    from = ilib.Measurement.Area.aliases[from] || from;
    to = ilib.Measurement.Area.aliases[to] || to;
	var fromRow = ilib.Measurement.Area.ratios[from];
	var toRow = ilib.Measurement.Area.ratios[to];
	if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
		return undefined;
	}
	return area* fromRow[toRow[0]];
};

/**
 * @private
 * @static
 */
ilib.Measurement.Area.getMeasures = function () {
	var ret = [];
	for (var m in ilib.Measurement.Area.ratios) {
		ret.push(m);
	}
	return ret;
};

ilib.Measurement.Area.metricSystem = {
	"square centimeter" : 1,
	"square meter" : 2,
	"hectare" : 3,
	"square km" : 4
};
ilib.Measurement.Area.imperialSystem = {
	"square inch" : 5,
	"square foot" : 6,
	"square yard" : 7,
	"acre" : 8,
	"square mile" : 9
};
ilib.Measurement.Area.uscustomarySystem = {
	"square inch" : 5,
	"square foot" : 6,
	"square yard" : 7,
	"acre" : 8,
	"square mile" : 9
};

ilib.Measurement.Area.metricToUScustomary = {
	"square centimeter" : "square inch",
	"square meter" : "square yard",
	"hectare" : "acre",
	"square km" : "square mile"
};
ilib.Measurement.Area.usCustomaryToMetric = {
	"square inch" : "square centimeter",
	"square foot" : "square meter",
	"square yard" : "square meter",
	"acre" : "hectare",
	"square mile" : "square km"
};


/**
 * Scale the measurement unit to an acceptable level. The scaling
 * happens so that the integer part of the amount is as small as
 * possible without being below zero. This will result in the 
 * largest units that can represent this measurement without
 * fractions. Measurements can only be scaled to other measurements 
 * of the same type.
 * 
 * @param {string=} measurementsystem system to use (uscustomary|imperial|metric),
 * or undefined if the system can be inferred from the current measure
 * @return {ilib.Measurement} a new instance that is scaled to the 
 * right level
 */
ilib.Measurement.Area.prototype.scale = function(measurementsystem) {
    var fromRow = ilib.Measurement.Area.ratios[this.unit];
    var mSystem;

    if (measurementsystem === "metric" || (typeof(measurementsystem) === 'undefined'
        && typeof(ilib.Measurement.Area.metricSystem[this.unit]) !== 'undefined')) {
        mSystem = ilib.Measurement.Area.metricSystem;
    }

    else  if (measurementsystem === "uscustomary" || (typeof(measurementsystem) === 'undefined'
        && typeof(ilib.Measurement.Area.metricSystem[this.unit]) !== 'undefined')) {
        mSystem = ilib.Measurement.Area.uscustomarySystem;
    }

    else if (measurementsystem === "imperial" || (typeof(measurementsystem) === 'undefined'
        && typeof(ilib.Measurement.Area.metricSystem[this.unit]) !== 'undefined')) {
        mSystem = ilib.Measurement.Area.imperialSystem;
    }

    var area = this.amount;
    var munit = this.unit;

    for (var m in mSystem) {
        var tmp = this.amount * fromRow[mSystem[m]];
        if (tmp < 1) break;
        area = tmp;
        munit = m;
    }

    return new ilib.Measurement.Area({
        unit: munit,
        amount: area
    });
};

/**
 * Localize the measurement to the commonly used measurement in that locale. For example
 * If a user's locale is "en-US" and the measurement is given as "60 kmh", 
 * the formatted number should be automatically converted to the most appropriate 
 * measure in the other system, in this case, mph. The formatted result should
 * appear as "37.3 mph". 
 * 
 * @abstract
 * @param {string} locale current locale string
 * @returns {ilib.Measurement} a new instance that is converted to locale
 */
ilib.Measurement.Area.prototype.localize = function(locale) {
    var to;
    if (locale === "en-US" || locale === "en-GB") {
        to = ilib.Measurement.Area.metricToUScustomary[this.unit] || this.unit;
    } else {
        to = ilib.Measurement.Area.usCustomaryToMetric[this.unit] || this.unit;
    }
    return new ilib.Measurement.Area({
        unit: to,
        amount: this
    });
};


//register with the factory method
ilib.Measurement._constructors["area"] = ilib.Measurement.Area;

/*
 * fuelconsumption.js - Unit conversions for FuelConsumption
 *
 * Copyright © 2014, JEDLSoft
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
*/
/**
 * @class
 * Create a new fuelconsumption measurement instance.
 * 
 * @constructor
 * @extends ilib.Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling
 * the construction of this instance
 */
ilib.Measurement.FuelConsumption = function(options) {
    this.unit = "km/liter";
    this.amount = 0;
    this.aliases = ilib.Measurement.FuelConsumption.aliases; // share this table in all instances

    if (options) {
        if (typeof(options.unit) !== 'undefined') {
            this.originalUnit = options.unit;
            this.unit = this.aliases[options.unit] || options.unit;
        }

        if (typeof(options.amount) === 'object') {
            if (options.amount.getMeasure() === "fuelconsumption") {
                this.amount = ilib.Measurement.FuelConsumption.convert(this.unit, options.amount.getUnit(), options.amount.getAmount());
            } else {
                throw "Cannot convert unit " + options.amount.unit + " to fuelconsumption";
            }
        } else if (typeof(options.amount) !== 'undefined') {
            this.amount = parseFloat(options.amount);
        }
    }
};


ilib.Measurement.FuelConsumption.ratios = [
    "km/liter",
    "liter/100km",
    "mpg",
    "mpg(imp)"
];

ilib.Measurement.FuelConsumption.prototype = new ilib.Measurement({});
ilib.Measurement.FuelConsumption.prototype.parent = ilib.Measurement;
ilib.Measurement.FuelConsumption.prototype.constructor = ilib.Measurement.FuelConsumption;

/**
 * Return the type of this measurement. Examples are "mass",
 * "length", "speed", etc. Measurements can only be converted
 * to measurements of the same type.<p>
 * 
 * The type of the units is determined automatically from the 
 * units. For example, the unit "grams" is type "mass". Use the 
 * static call {@link ilib.Measurement.getAvailableUnits}
 * to find out what units this version of ilib supports.
 *  
 * @return {string} the name of the type of this measurement
 */
ilib.Measurement.FuelConsumption.prototype.getMeasure = function() {
    return "fuelconsumption";
};

/**
 * Return a new measurement instance that is converted to a new
 * measurement unit. Measurements can only be converted
 * to measurements of the same type.<p>
 *  
 * @param {string} to The name of the units to convert to
 * @return {ilib.Measurement|undefined} the converted measurement
 * or undefined if the requested units are for a different
 * measurement type 
 */
ilib.Measurement.FuelConsumption.prototype.convert = function(to) {
    if (!to || typeof(ilib.Measurement.FuelConsumption.ratios[this.normalizeUnits(to)]) === 'undefined') {
        return undefined;
    }
    return new ilib.Measurement({
        unit: to,
        amount: this
    });
};
/*["km/liter", "liter/100km", "mpg", "mpg(imp)"*/
ilib.Measurement.FuelConsumption.aliases = {
    "Km/liter": "km/liter",
    "KM/Liter": "km/liter",
    "KM/L": "km/liter",
    "Kilometers Per Liter": "km/liter",
    "kilometers per liter": "km/liter",
    "km/l": "km/liter",
    "Kilometers/Liter": "km/liter",
    "Kilometer/Liter": "km/liter",
    "kilometers/liter": "km/liter",
    "kilometer/liter": "km/liter",
    "km/liter": "km/liter",
    "Liter/100km": "liter/100km",
    "Liters/100km": "liter/100km",
    "Liter/100kms": "liter/100km",
    "Liters/100kms": "liter/100km",
    "liter/100km": "liter/100km",
    "liters/100kms": "liter/100km",
    "liters/100km": "liter/100km",
    "liter/100kms": "liter/100km",
    "Liter/100KM": "liter/100km",
    "Liters/100KM": "liter/100km",
    "L/100km": "liter/100km",
    "L/100KM": "liter/100km",
    "l/100KM": "liter/100km",
    "l/100km": "liter/100km",
    "l/100kms": "liter/100km",
    "MPG(US)": "mpg",
    "USMPG ": "mpg",
    "mpg": "mpg",
    "mpgUS": "mpg",
    "mpg(US)": "mpg",
    "mpg(us)": "mpg",
    "mpg-us": "mpg",
    "mpg Imp": "mpg(imp)",
    "MPG(imp)": "mpg(imp)",
    "mpg(imp)": "mpg(imp)",
    "mpg-imp": "mpg(imp)"
};

ilib.Measurement.FuelConsumption.metricToUScustomary = {
    "km/liter": "mpg",
    "liter/100km": "mpg"
};
ilib.Measurement.FuelConsumption.metricToImperial = {
    "km/liter": "mpg(imp)",
    "liter/100km": "mpg(imp)"
};

ilib.Measurement.FuelConsumption.imperialToMetric = {
	"mpg(imp)": "km/liter"
};
ilib.Measurement.FuelConsumption.imperialToUScustomary = {
	"mpg(imp)": "mpg"
};

ilib.Measurement.FuelConsumption.uScustomaryToImperial = {
	"mpg": "mpg(imp)"
};
ilib.Measurement.FuelConsumption.uScustomarylToMetric = {
	"mpg": "km/liter"
};

/**
 * Localize the measurement to the commonly used measurement in that locale. For example
 * If a user's locale is "en-US" and the measurement is given as "60 kmh", 
 * the formatted number should be automatically converted to the most appropriate 
 * measure in the other system, in this case, mph. The formatted result should
 * appear as "37.3 mph". 
 * 
 * @abstract
 * @param {string} locale current locale string
 * @returns {ilib.Measurement} a new instance that is converted to locale
 */
ilib.Measurement.FuelConsumption.prototype.localize = function(locale) {
	var to;
	if (locale === "en-US") {
		to = ilib.Measurement.FuelConsumption.metricToUScustomary[this.unit] ||
		    ilib.Measurement.FuelConsumption.imperialToUScustomary[this.unit] ||
		    this.unit;
	} else if (locale === "en-GB") {
		to = ilib.Measurement.FuelConsumption.metricToImperial[this.unit] ||
		    ilib.Measurement.FuelConsumption.uScustomaryToImperial[this.unit] ||
		    this.unit;
	} else {
		to = ilib.Measurement.FuelConsumption.uScustomarylToMetric[this.unit] ||
		    ilib.Measurement.FuelConsumption.imperialToUScustomary[this.unit] ||
		    this.unit;
	}
	return new ilib.Measurement.FuelConsumption({
	    unit: to,
	    amount: this
	});
};

/**
 * Convert a FuelConsumption to another measure.
 * 
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param fuelConsumption {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
ilib.Measurement.FuelConsumption.convert = function(to, from, fuelConsumption) {
    from = ilib.Measurement.FuelConsumption.aliases[from] || from;
    to = ilib.Measurement.FuelConsumption.aliases[to] || to;
    var returnValue = 0;

    switch (from) {
        case "km/liter":
            switch (to) {
                case "km/liter":
                    returnValue = fuelConsumption * 1;
                    break;
                case "liter/100km":
                    returnValue = 100 / fuelConsumption;
                    break;
                case "mpg":
                    returnValue = fuelConsumption * 2.35215;
                    break;
                case "mpg(imp)":
                    returnValue = fuelConsumption * 2.82481;
                    break;
            }
            break;
        case "liter/100km":
            switch (to) {
                case "km/liter":
                    returnValue = 100 / fuelConsumption;
                    break;
                case "liter/100km":
                    returnValue = fuelConsumption * 1;
                    break;
                case "mpg":
                    returnValue = 235.215 / fuelConsumption;
                    break;
                case "mpg(imp)":
                    returnValue = 282.481 / fuelConsumption;
                    break;
            }
            break;
        case "mpg":
            switch (to) {
                case "km/liter":
                    returnValue = fuelConsumption * 0.425144;
                    break;
                case "liter/100km":
                    returnValue = 235.215 / fuelConsumption;
                    break;
                case "mpg":
                    returnValue = 1 * fuelConsumption;
                    break;
                case "mpg(imp)":
                    returnValue = 1.20095 * fuelConsumption;
                    break;
            }
            break;
        case "mpg(imp)":
            switch (to) {
                case "km/liter":
                    returnValue = fuelConsumption * 0.354006;
                    break;
                case "liter/100km":
                    returnValue = 282.481 / fuelConsumption;
                    break;
                case "mpg":
                    returnValue = 0.832674 * fuelConsumption;
                    break;
                case "mpg(imp)":
                    returnValue = 1 * fuelConsumption;
                    break;
            }
            break;
    }
    return returnValue;
};

/**
 * Scale the measurement unit to an acceptable level. The scaling
 * happens so that the integer part of the amount is as small as
 * possible without being below zero. This will result in the 
 * largest units that can represent this measurement without
 * fractions. Measurements can only be scaled to other measurements 
 * of the same type.
 * 
 * @param {string=} measurementsystem system to use (uscustomary|imperial|metric),
 * or undefined if the system can be inferred from the current measure
 * @return {ilib.Measurement} a new instance that is scaled to the 
 * right level
 */
ilib.Measurement.FuelConsumption.prototype.scale = function(measurementsystem) {
    return new ilib.Measurement.FuelConsumption({
        unit: this.unit,
        amount: this.amount
    }); 
};

/**
 * @private
 * @static
 */
ilib.Measurement.FuelConsumption.getMeasures = function() {
    var ret = [];
    ret.push("km/liter");
    ret.push("liter/100km");
    ret.push("mpg");
    ret.push("mpg(imp)");
    
    return ret;
};

//register with the factory method
ilib.Measurement._constructors["fuelconsumption"] = ilib.Measurement.FuelConsumption;

/*
 * volume.js - Unit conversions for volume
 * 
 * Copyright © 2014, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
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
unit.js
*/

/**
 * @class
 * Create a new Volume measurement instance.
 * 
 * @constructor
 * @extends ilib.Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling 
 * the construction of this instance
 */
ilib.Measurement.Volume = function (options) {
	this.unit = "cubic meter";
	this.amount = 0;
	this.aliases = ilib.Measurement.Volume.aliases; // share this table in all instances
	
	if (options) {
		if (typeof(options.unit) !== 'undefined') {
			this.originalUnit = options.unit;
			this.unit = this.aliases[options.unit] || options.unit;
		}
		
		if (typeof(options.amount) === 'object') {
			if (options.amount.getMeasure() === "volume") {
				this.amount = ilib.Measurement.Volume.convert(this.unit, options.amount.getUnit(), options.amount.getAmount());
			} else {
				throw "Cannot convert unit " + options.amount.unit + " to a volume";
			}
		} else if (typeof(options.amount) !== 'undefined') {
			this.amount = parseFloat(options.amount);
		}
	}
	
	if (typeof(ilib.Measurement.Volume.ratios[this.unit]) === 'undefined') {
		throw "Unknown unit: " + options.unit;
	}
};

ilib.Measurement.Volume.ratios = {
    /*                 index, tsp,      tbsp,          cubic inch  us ounce, cup,        pint,       quart,      gallon,      cubic foot,  milliliter  liter,      cubic meter, imperial tsp,  imperial tbsp, imperial ounce,  imperial pint,  imperial quart, imperial gal, */
    "tsp" :            [1,    1,        0.333333,      0.300781,   0.166667, 0.0208333,  0.0104167,  0.00130208, 0.00130208,  0.000174063, 4.92892,    0.00492892, 4.9289e-6,   0.832674,      0.277558,      0.173474,        0.00867369,     0.00433684,     0.00108421          ],
    "tbsp":            [2,    3,        1,             0.902344,   0.5,      0.0625,     0.0312,     0.015625,   0.00390625,  0.00052219,  14.7868,    0.0147868,  1.4787e-5,   2.49802,       0.832674,      0.520421,        0.0260211,      0.0130105,      0.00325263          ],
    "cubic inch":      [3,    3.32468,  1.10823,       1,          0.554113, 0.0692641,  0.034632,   0.017316,   0.004329,    0.000578704, 16.3871,    0.0163871,  1.6387e-5,   2.76837,       0.92279,       0.576744,        0.0288372,      0.0144186,      0.00360465          ],
    "us ounce":        [4,    6,        2,             1.80469,    1,        0.125,      0.0625,     0.0078125,  0.0078125,   0.00104438,  29.5735,    0.0295735,  2.9574e-5,   4.99604,       1.04084,       1.04084,         0.0520421,      0.0260211,      0.00650526          ],
    "cup":             [5,    48,       16,            14.4375,    8,        1,          0.5,        0.25,       0.0625,      0.00835503,  236.588,    0.236588,   0.000236588, 39.9683,       13.3228,       8.32674,         0.416337,       0.208168,       0.0520421           ],
    "pint":            [6,    96,       32,            28.875,     16,       2,          1,          0.5,        0.125,       0.0167101,   473.176,    0.473176,   0.000473176, 79.9367,       26.6456,       16.6535,         0.832674,       0.416337,       0.104084            ],
    "quart":           [7,    192,      64,            57.75,      32,       4,          2,          1,          0.25,        0.0334201,   946.353,    0.946353,   0.000946353, 159.873,       53.2911,       33.307,          1.66535,        0.832674,       0.208168            ],
    "gallon":          [8,    768,      256,           231,        128,      16,         8,          4,          1,           0.133681,    3785.41,    3.78541,    0.00378541,  639.494,       213.165,       133.228,         6.66139,        3.3307,         0.832674            ],
    "cubic foot":      [9,    5745.04,  1915.01,       1728,       957.506,  119.688,    59.8442,    29.9221,    7.48052,     1,           28316.8,    28.3168,    0.0283168,   4783.74,       1594.58,       996.613,         49.8307,        24.9153,        6.22883             ],
    "milliliter":      [10,   0.202884, 0.067628,      0.0610237,  0.033814, 0.00422675, 0.00211338, 0.00105669, 0.000264172, 3.5315e-5,   1,          0.001,      1e-6,        0.168936,      0.0563121,     0.0351951,       0.00175975,     0.000879877,    0.000219969         ],
    "liter":           [11,   202.884,  67.628,        61.0237,    33.814,   4.22675,    2.11338,    1.05669,    0.264172,    0.0353147,   1000,       1,          0.001,       56.3121,       56.3121,       35.191,          1.75975,        0.879877,       0.219969            ],
    "cubic meter":     [12,   202884,   67628,         61023.7,    33814,    4226.75,    2113.38,    1056.69,    264.172,     35.3147,     1e+6,       1000,       1,           168936,        56312.1,       35195.1,         1759.75,        879.877,        219.969             ],
    "imperial tsp":    [13,   1.20095,  0.200158,      0.361223,   0.600475, 0.0250198,  0.0125099,  0.00625495, 0.00156374,  0.000209041, 5.91939,    0.00591939, 5.9194e-6,   1,             0.333333,      0.208333,        0.0104167,      0.00520833,     0.00130208          ],
    "imperial tbsp":   [14,   3.60285,  1.20095,       1.08367,    0.600475, 0.0750594,  0.0375297,  0.0187649,  0.00469121,  0.000627124, 17.7582,    0.0177582,  1.7758e-5,   3,             1,             0.625,           0.03125,        0.015625,       0.00390625          ],
    "imperial ounce":  [15,   5.76456,  1.92152,       1.73387,    0.96076,  0.120095,   0.0600475,  0.0300238,  0.00750594,  0.0010034,   28.4131,    0.0284131,  2.8413e-5,   4.8,           1.6,           1,               0.05,           0.025,          0.00625             ],
    "imperial pint":   [16,   115.291,  38.4304,       34.6774,    19.2152,  2.4019,     1.20095,    0.600475,   0.150119,    0.020068,    568.261,    0.568261,   0.000568261, 96,            32,            20,              1,              0.5,            0.125               ],
    "imperial quart":  [17,   230.582,  76.8608,       69.3549,    38.4304,  4.8038,     2.4019,     1.20095,    0.300238,    0.0401359,   1136.52,    1.13652,    0.00113652,  192,           64,            40,              2,              1,              0.25                ],
    "imperial gallon": [18,   922.33,   307.443,       277.42,     153.722,  19.2152,    9.6076,     4.8038,     1.20095,     0.160544,    4546.09,    4.54609,    0.00454609,  768,           256,           160,             8,              4,              1                   ]
};

ilib.Measurement.Volume.prototype = new ilib.Measurement({});
ilib.Measurement.Volume.prototype.parent = ilib.Measurement;
ilib.Measurement.Volume.prototype.constructor = ilib.Measurement.Volume;

/**
 * Return the type of this measurement. Examples are "mass",
 * "length", "speed", etc. Measurements can only be converted
 * to measurements of the same type.<p>
 * 
 * The type of the units is determined automatically from the 
 * units. For example, the unit "grams" is type "mass". Use the 
 * static call {@link ilib.Measurement.getAvailableUnits}
 * to find out what units this version of ilib supports.
 *  
 * @return {string} the name of the type of this measurement
 */
ilib.Measurement.Volume.prototype.getMeasure = function() {
	return "volume";
};

/**
 * Return a new measurement instance that is converted to a new
 * measurement unit. Measurements can only be converted
 * to measurements of the same type.<p>
 *  
 * @param {string} to The name of the units to convert to
 * @return {ilib.Measurement|undefined} the converted measurement
 * or undefined if the requested units are for a different
 * measurement type 
 */
ilib.Measurement.Volume.prototype.convert = function(to) {
	if (!to || typeof(ilib.Measurement.Volume.ratios[this.normalizeUnits(to)]) === 'undefined') {
		return undefined;
	}
	return new ilib.Measurement({
		unit: to,
		amount: this
	});
};

ilib.Measurement.Volume.aliases = {
    "US gal": "gallon",
    "US gallon": "gallon",
    "US Gal": "gallon",
    "US Gallons": "gallon",
    "Gal(US)": "gallon",
    "gal(US)": "gallon",
    "gallon": "gallon",
    "quart": "quart",
    "US quart": "quart",
    "US quarts": "quart",
    "US Quart": "quart",
    "US Quarts": "quart",
    "US qt": "quart",
    "Qt(US)": "quart",
    "qt(US)": "quart",
    "US pint": "pint",
    "US Pint": "pint",
    "pint": "pint",
    "pint(US)": "pint",
    "Pint(US)": "pint",
    "US cup": "cup",
    "US Cup": "cup",
    "cup(US)": "cup",
    "Cup(US)": "cup",
    "cup": "cup",
    "us ounce": "us ounce",
    "US ounce": "us ounce",
    "℥": "us ounce",
    "US Oz": "us ounce",
    "oz(US)": "us ounce",
    "Oz(US)": "us ounce",
    "US tbsp": "tbsp",
    "tbsp": "tbsp",
    "tbsp(US)": "tbsp",
    "US tablespoon": "tbsp",
    "US tsp": "tsp",
    "tsp(US)": "tsp",
    "tsp": "tsp",
    "Cubic meter": "cubic meter",
    "cubic meter": "cubic meter",
    "Cubic metre": "cubic meter",
    "cubic metre": "cubic meter",
    "m3": "cubic meter",
    "Liter": "liter",
    "Liters": "liter",
    "liter": "liter",
    "L": "liter",
    "l": "liter",
    "Milliliter": "milliliter",
    "ML": "milliliter",
    "ml": "milliliter",
    "milliliter": "milliliter",
    "mL": "milliliter",
    "Imperial gal": "imperial gallon",
    "imperial gallon": "imperial gallon",
    "Imperial gallon": "imperial gallon",
    "gallon(imperial)": "imperial gallon",
    "gal(imperial)": "imperial gallon",
    "Imperial quart": "imperial quart",
    "imperial quart": "imperial quart",
    "Imperial Quart": "imperial quart",
    "IMperial qt": "imperial quart",
    "qt(Imperial)": "imperial quart",
    "quart(imperial)": "imperial quart",
    "Imperial pint": "imperial pint",
    "imperial pint": "imperial pint",
    "pint(Imperial)": "imperial pint",
    "imperial oz": "imperial ounce",
    "imperial ounce": "imperial ounce",
    "Imperial Ounce": "imperial ounce",
    "Imperial tbsp": "imperial tbsp",
    "imperial tbsp": "imperial tbsp",
    "tbsp(Imperial)": "imperial tbsp",
    "Imperial tsp": "imperial tsp",
    "imperial tsp": "imperial tsp",
    "tsp(Imperial)": "imperial tsp",
    "Cubic foot": "cubic foot",
    "cubic foot": "cubic foot",
    "Cubic Foot": "cubic foot",
    "Cubic feet": "cubic foot",
    "cubic Feet": "cubic foot",
    "cubic ft": "cubic foot",
    "ft3": "cubic foot",
    "Cubic inch": "cubic inch",
    "Cubic inches": "cubic inch",
    "cubic inches": "cubic inch",
    "cubic inch": "cubic inch",
    "cubic in": "cubic inch",
    "cu in": "cubic inch",
    "cu inch": "cubic inch",
    "inch³": "cubic inch",
    "in³": "cubic inch",
    "inch^3": "cubic inch",
    "in^3": "cubic inch",
    "c.i": "cubic inch",
    "CI": "cubic inch",
    "cui": "cubic inch"
};

/**
 * Convert a volume to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param volume {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
ilib.Measurement.Volume.convert = function(to, from, volume) {
    from = ilib.Measurement.Volume.aliases[from] || from;
    to = ilib.Measurement.Volume.aliases[to] || to;
	var fromRow = ilib.Measurement.Volume.ratios[from];
	var toRow = ilib.Measurement.Volume.ratios[to];
	if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
		return undefined;
	}	
	var result = volume * fromRow[toRow[0]];
    return result;
};

/**
 * @private
 * @static
 */
ilib.Measurement.Volume.getMeasures = function () {
	var ret = [];
	for (var m in ilib.Measurement.Volume.ratios) {
		ret.push(m);
	}
	return ret;
};
ilib.Measurement.Volume.metricSystem = {
    "milliliter": 10,
    "liter": 11,
    "cubic meter": 12
};
ilib.Measurement.Volume.imperialSystem = {
    "imperial tsp": 13,
    "imperial tbsp": 14,
    "imperial ounce": 15,
    "imperial pint": 16,
    "imperial quart": 17,
    "imperial gallon": 18
};
ilib.Measurement.Volume.uscustomarySystem = {
    "tsp": 1,
    "tbsp": 2,
    "cubic inch": 3,
    "us ounce": 4,
    "cup": 5,
    "pint": 6,
    "quart": 7,
    "gallon": 8,
    "cubic foot": 9
};

ilib.Measurement.Volume.metricToUScustomary = {
    "milliliter": "tsp",
    "liter": "quart",
    "cubic meter": "cubic foot"
};
ilib.Measurement.Volume.metricToImperial = {
    "milliliter": "imperial tsp",
    "liter": "imperial quart",
    "cubic meter": "imperial gallon"
};

ilib.Measurement.Volume.imperialToMetric = {
    "imperial tsp": "milliliter",
    "imperial tbsp": "milliliter",
    "imperial ounce": "milliliter",
    "imperial pint": "liter",
    "imperial quart": "liter",
    "imperial gallon": "cubic meter"
};
ilib.Measurement.Volume.imperialToUScustomary = {
    "imperial tsp": "tsp",
    "imperial tbsp": "tbsp",
    "imperial ounce": "us ounce",
    "imperial pint": "pint",
    "imperial quart": "quart",
    "imperial gallon": "gallon"
};

ilib.Measurement.Volume.uScustomaryToImperial = {
    "tsp": "imperial tsp",
    "tbsp": "imperial tbsp",
    "cubic inch": "imperial tbsp",
    "us ounce": "imperial ounce",
    "cup": "imperial ounce",
    "pint": "imperial pint",
    "quart": "imperial quart",
    "gallon": "imperial gallon",
    "cubic foot": "imperial gallon"
};
ilib.Measurement.Volume.uScustomarylToMetric = {
    "tsp": "milliliter",
    "tbsp": "milliliter",
    "cubic inch": "milliliter",
    "us ounce": "milliliter",
    "cup": "milliliter",
    "pint": "liter",
    "quart": "liter",
    "gallon": "cubic meter",
    "cubic foot": "cubic meter"
};

/**
 * Localize the measurement to the commonly used measurement in that locale. For example
 * If a user's locale is "en-US" and the measurement is given as "60 kmh", 
 * the formatted number should be automatically converted to the most appropriate 
 * measure in the other system, in this case, mph. The formatted result should
 * appear as "37.3 mph". 
 * 
 * @abstract
 * @param {string} locale current locale string
 * @returns {ilib.Measurement} a new instance that is converted to locale
 */
ilib.Measurement.Volume.prototype.localize = function(locale) {
	var to;
	if (locale === "en-US") {
		to = ilib.Measurement.Volume.metricToUScustomary[this.unit] ||
		    ilib.Measurement.Volume.imperialToUScustomary[this.unit] ||
		    this.unit;
	} else if (locale === "en-GB") {
		to = ilib.Measurement.Volume.metricToImperial[this.unit] ||
		    ilib.Measurement.Volume.uScustomaryToImperial[this.unit] ||
		    this.unit;
	} else {
		to = ilib.Measurement.Volume.uScustomarylToMetric[this.unit] ||
		    ilib.Measurement.Volume.imperialToUScustomary[this.unit] ||
		    this.unit;
	}
	return new ilib.Measurement.Volume({
	    unit: to,
	    amount: this
	});
};

/**
 * Scale the measurement unit to an acceptable level. The scaling
 * happens so that the integer part of the amount is as small as
 * possible without being below zero. This will result in the 
 * largest units that can represent this measurement without
 * fractions. Measurements can only be scaled to other measurements 
 * of the same type.
 * 
 * @param {string=} measurementsystem system to use (uscustomary|imperial|metric),
 * or undefined if the system can be inferred from the current measure
 * @return {ilib.Measurement} a new instance that is scaled to the 
 * right level
 */
ilib.Measurement.Volume.prototype.scale = function(measurementsystem) {
    var fromRow = ilib.Measurement.Volume.ratios[this.unit];
    var mSystem;

    if (measurementsystem === "metric"|| (typeof(measurementsystem) === 'undefined'
        && typeof(ilib.Measurement.Volume.metricSystem[this.unit]) !== 'undefined')) {
        mSystem = ilib.Measurement.Volume.metricSystem;
    } else if (measurementsystem === "uscustomary" || (typeof(measurementsystem) === 'undefined'
        && typeof(ilib.Measurement.Volume.uscustomarySystem[this.unit]) !== 'undefined')) {
        mSystem = ilib.Measurement.Volume.uscustomarySystem;
    } else if (measurementsystem === "imperial"|| (typeof(measurementsystem) === 'undefined'
        && typeof(ilib.Measurement.Volume.imperialSystem[this.unit]) !== 'undefined')) {
        mSystem = ilib.Measurement.Volume.imperialSystem;
    }

    var volume = this.amount;
    var munit = this.unit;

    for (var m in mSystem) {
        var tmp = this.amount * fromRow[mSystem[m]];
        if (tmp < 1) break;
        volume = tmp;
        munit = m;
    }

    return new ilib.Measurement.Volume({
        unit: munit,
        amount: volume
    });
};



//register with the factory method
ilib.Measurement._constructors["volume"] = ilib.Measurement.Volume;


/*
 * Energy.js - Unit conversions for Energys/energys
 *
 * Copyright © 2014, JEDLSoft
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
*/

/**
 * @class
 * Create a new energy measurement instance.
 * 
 * @constructor
 * @extends ilib.Measurement
 * @param options {{unit:string,amount:number|string|undefined}} Options controlling
 * the construction of this instance
 */
ilib.Measurement.Energy = function (options) {
	this.unit = "ns";
	this.amount = 0;
	this.aliases = ilib.Measurement.Energy.aliases; // share this table in all instances

	if (options) {
		if (typeof(options.unit) !== 'undefined') {
			this.originalUnit = options.unit;
			this.unit = this.aliases[options.unit] || options.unit;
		}

		if (typeof(options.amount) === 'object') {
			if (options.amount.getMeasure() === "energy") {
				this.amount = ilib.Measurement.Energy.convert(this.unit, options.amount.getUnit(), options.amount.getAmount());
			} else {
				throw "Cannot convert units " + options.amount.unit + " to a energy";
			}
		} else if (typeof(options.amount) !== 'undefined') {
			this.amount = parseFloat(options.amount);
		}
	}

	if (typeof(ilib.Measurement.Energy.ratios[this.unit]) === 'undefined') {
		throw "Unknown unit: " + options.unit;
	}
};

ilib.Measurement.Energy.ratios = {
   /*                index mJ          J           BTU               kJ          Wh                Cal               MJ             kWh                gJ             MWh                 GWh         */
    "millijoule":   [ 1,   1,          0.001,      9.4781707775e-7,  1e-6,       2.7777777778e-7,  2.3884589663e-7,  1.0e-9,        2.7777777778e-10,  1.0e-12,       2.7777777778e-13,   2.7777777778e-16  ],
    "joule":        [ 2,   1000,       1,          9.4781707775e-4,  0.001,      2.7777777778e-4,  2.3884589663e-4,  1.0e-6,        2.7777777778e-7,   1.0e-9,        2.7777777778e-10,   2.7777777778e-13  ],
    "BTU":          [ 3,   1055055.9,  1055.0559,  1,                1.0550559,  0.29307108333,    0.25199577243,    1.0550559e-3,  2.9307108333e-4,   1.0550559e-6,  2.9307108333e-7,    2.9307108333e-10  ],
    "kilojoule":    [ 4,   1000000,    1000,       0.94781707775,    1,          0.27777777778,    0.23884589663,    0.001,         2.7777777778e-4,   1.0e-6,        2.7777777778e-7,    2.7777777778e-10  ],
    "watt hour":    [ 5,   3.6e+6,     3600,       3.4121414799,     3.6,        1,                0.85984522786,    0.0036,        0.001,             3.6e-6,        1.0e-6,             1.0e-9            ],
    "calorie":      [ 6,   4.868e+5,   4186.8,     3.9683205411,     4.1868,     1.163,            1,                4.1868e-3,     1.163e-3,          4.1868e-6,     1.163e-6,           1.163e-9          ],
    "megajoule":    [ 7,   1e+9,       1e+6,       947.81707775,     1000,       277.77777778,     238.84589663,     1,             0.27777777778,     0.001,         2.7777777778e-4,    2.7777777778e-7   ],
    "kilowatt hour":[ 8,   3.6e+9,     3.6e+6,     3412.1414799,     3600,       1000,             859.84522786,     3.6,           1,                 3.6e-3,        0.001,              1e-6              ],
    "gigajoule":    [ 9,   1e+12,      1e+9,       947817.07775,     1e+6,       277777.77778,     238845.89663,     1000,          277.77777778,      1,             0.27777777778,      2.7777777778e-4   ],
    "megawatt hour":[ 10,  3.6e+12,    3.6e+9,     3412141.4799,     3.6e+6,     1e+6,             859845.22786,     3600,          1000,              3.6,           1,                  0.001             ],
    "gigawatt hour":[ 11,  3.6e+15,    3.6e+12,    3412141479.9,     3.6e+9,     1e+9,             859845227.86,     3.6e+6,        1e+6,              3600,          1000,               1                 ]
};

ilib.Measurement.Energy.prototype = new ilib.Measurement({});
ilib.Measurement.Energy.prototype.parent = ilib.Measurement;
ilib.Measurement.Energy.prototype.constructor = ilib.Measurement.Energy;

/**
 * Return the type of this measurement. Examples are "mass",
 * "length", "speed", etc. Measurements can only be converted
 * to measurements of the same type.<p>
 * 
 * The type of the units is determined automatically from the 
 * units. For example, the unit "grams" is type "mass". Use the 
 * static call {@link ilib.Measurement.getAvailableUnits}
 * to find out what units this version of ilib supports.
 *  
 * @return {string} the name of the type of this measurement
 */
ilib.Measurement.Energy.prototype.getMeasure = function() {
	return "energy";
};

/**
 * Return a new measurement instance that is converted to a new
 * measurement unit. Measurements can only be converted
 * to measurements of the same type.<p>
 *  
 * @param {string} to The name of the units to convert to
 * @return {ilib.Measurement|undefined} the converted measurement
 * or undefined if the requested units are for a different
 * measurement type 
 */
ilib.Measurement.Energy.prototype.convert = function(to) {
	if (!to || typeof(ilib.Measurement.Energy.ratios[this.normalizeUnits(to)]) === 'undefined') {
		return undefined;
	}
	return new ilib.Measurement({
		unit: to,
		amount: this
	});
};

ilib.Measurement.Energy.aliases = {
    "milli joule": "millijoule",
    "millijoule": "millijoule",
    "MilliJoule": "millijoule",
    "milliJ": "millijoule",
    "joule": "joule",
    "J": "joule",
    "j": "joule",
    "Joule": "joule",
    "Joules": "joule",
    "joules": "joule",
    "BTU": "BTU",
    "btu": "BTU",
    "British thermal unit": "BTU",
    "british thermal unit": "BTU",
    "kilo joule": "kilojoule",
    "kJ": "kilojoule",
    "kj": "kilojoule",
    "Kj": "kilojoule",
    "kiloJoule": "kilojoule",
    "kilojoule": "kilojoule",
    "kjoule": "kilojoule",
    "watt hour": "watt hour",
    "Wh": "watt hour",
    "wh": "watt hour",
    "watt-hour": "watt hour",
    "calorie": "calorie",
    "Cal": "calorie",
    "cal": "calorie",
    "Calorie": "calorie",
    "calories": "calorie",
    "mega joule": "megajoule",
    "MJ": "megajoule",
    "megajoule": "megajoule",
    "megajoules": "megajoule",
    "Megajoules": "megajoule",
    "megaJoules": "megajoule",
    "MegaJoules": "megajoule",
    "megaJoule": "megajoule",
    "MegaJoule": "megajoule",
    "kilo Watt hour": "kilowatt hour",
    "kWh": "kilowatt hour",
    "kiloWh": "kilowatt hour",
    "KiloWh": "kilowatt hour",
    "KiloWatt-hour": "kilowatt hour",
    "kilowatt hour": "kilowatt hour",
    "kilowatt-hour": "kilowatt hour",
    "KiloWatt-hours": "kilowatt hour",
    "kilowatt-hours": "kilowatt hour",
    "Kilo Watt-hour": "kilowatt hour",
    "Kilo Watt-hours": "kilowatt hour",
    "giga joule": "gigajoule",
    "gJ": "gigajoule",
    "GJ": "gigajoule",
    "GigaJoule": "gigajoule",
    "gigaJoule": "gigajoule",
    "gigajoule": "gigajoule",   
    "GigaJoules": "gigajoule",
    "gigaJoules": "gigajoule",
    "Gigajoules": "gigajoule",
    "gigajoules": "gigajoule",
    "mega watt hour": "megawatt hour",
    "MWh": "megawatt hour",
    "MegaWh": "megawatt hour",
    "megaWh": "megawatt hour",
    "megaWatthour": "megawatt hour",
    "megaWatt-hour": "megawatt hour",
    "mega Watt-hour": "megawatt hour",
    "megaWatt hour": "megawatt hour",
    "megawatt hour": "megawatt hour",
    "mega Watt hour": "megawatt hour",
    "giga watt hour": "gigawatt hour",
    "gWh": "gigawatt hour",
    "GWh": "gigawatt hour",
    "gigaWh": "gigawatt hour",
    "gigaWatt-hour": "gigawatt hour",
    "gigawatt-hour": "gigawatt hour",
    "gigaWatt hour": "gigawatt hour",
    "gigawatt hour": "gigawatt hour",
    "gigawatthour": "gigawatt hour"
};

/**
 * Convert a energy to another measure.
 * @static
 * @param to {string} unit to convert to
 * @param from {string} unit to convert from
 * @param energy {number} amount to be convert
 * @returns {number|undefined} the converted amount
 */
ilib.Measurement.Energy.convert = function(to, from, energy) {
    from = ilib.Measurement.Energy.aliases[from] || from;
    to = ilib.Measurement.Energy.aliases[to] || to;
    var fromRow = ilib.Measurement.Energy.ratios[from];
    var toRow = ilib.Measurement.Energy.ratios[to];
    if (typeof(from) === 'undefined' || typeof(to) === 'undefined') {
        return undefined;
    }
    return energy * fromRow[toRow[0]];
};

/**
 * @private
 * @static
 */
ilib.Measurement.Energy.getMeasures = function () {
	var ret = [];
	for (var m in ilib.Measurement.Energy.ratios) {
		ret.push(m);
	}
	return ret;
};

ilib.Measurement.Energy.metricJouleSystem = {
    "millijoule": 1,
    "joule": 2,
    "kilojoule": 4,
    "megajoule": 7,
    "gigajoule": 9
};
ilib.Measurement.Energy.metricWattHourSystem = {
    "watt hour": 5,
    "kilowatt hour": 8,
    "megawatt hour": 10,
    "gigawatt hour": 11
};

ilib.Measurement.Energy.imperialSystem = {
	"BTU": 3
};
ilib.Measurement.Energy.uscustomarySystem = {
	"calorie": 6
};

ilib.Measurement.Energy.metricToImperial = {
    "millijoule": "BTU",
    "joule": "BTU",
    "kilojoule": "BTU",
    "megajoule": "BTU",
    "gigajoule": "BTU"
};
ilib.Measurement.Energy.imperialToMetric = {
	"BTU": "joule"
};

/**
 * Localize the measurement to the commonly used measurement in that locale. For example
 * If a user's locale is "en-US" and the measurement is given as "60 kmh", 
 * the formatted number should be automatically converted to the most appropriate 
 * measure in the other system, in this case, mph. The formatted result should
 * appear as "37.3 mph". 
 * 
 * @abstract
 * @param {string} locale current locale string
 * @returns {ilib.Measurement} a new instance that is converted to locale
 */
ilib.Measurement.Energy.prototype.localize = function(locale) {
	var to;
	if (locale === "en-GB") {
		to = ilib.Measurement.Energy.metricToImperial[this.unit] || this.unit;
	} else {
		to = ilib.Measurement.Energy.imperialToMetric[this.unit] || this.unit;
	}

	return new ilib.Measurement.Energy({
	    unit: to,
	    amount: this
	});
};

/**
 * Scale the measurement unit to an acceptable level. The scaling
 * happens so that the integer part of the amount is as small as
 * possible without being below zero. This will result in the 
 * largest units that can represent this measurement without
 * fractions. Measurements can only be scaled to other measurements 
 * of the same type.
 * 
 * @param {string=} measurementsystem system to use (uscustomary|imperial|metric),
 * or undefined if the system can be inferred from the current measure
 * @return {ilib.Measurement} a new instance that is scaled to the 
 * right level
 */
ilib.Measurement.Energy.prototype.scale = function(measurementsystem) {
    var fromRow = ilib.Measurement.Energy.ratios[this.unit];
    var mSystem;

    if ((measurementsystem === "metric" && typeof(ilib.Measurement.Energy.metricJouleSystem[this.unit]) !== 'undefined')|| (typeof(measurementsystem) === 'undefined'
        && typeof(ilib.Measurement.Energy.metricJouleSystem[this.unit]) !== 'undefined')) {
        mSystem = ilib.Measurement.Energy.metricJouleSystem;
    }
    else if ((measurementsystem === "metric" && typeof(ilib.Measurement.Energy.metricWattHourSystem[this.unit]) !== 'undefined')|| (typeof(measurementsystem) === 'undefined'
        && typeof(ilib.Measurement.Energy.metricWattHourSystem[this.unit]) !== 'undefined')) {
        mSystem = ilib.Measurement.Energy.metricWattHourSystem;
    }

    else  if (measurementsystem === "uscustomary" || (typeof(measurementsystem) === 'undefined'
        && typeof(ilib.Measurement.Energy.uscustomarySystem[this.unit]) !== 'undefined')) {
        mSystem = ilib.Measurement.Energy.uscustomarySystem;
    }
    else if (measurementsystem === "imperial"|| (typeof(measurementsystem) === 'undefined'
        && typeof(ilib.Measurement.Energy.imperialSystem[this.unit]) !== 'undefined')) {
        mSystem = ilib.Measurement.Energy.imperialSystem;
    }

    var energy = this.amount;
    var munit = this.unit;

    for (var m in mSystem) {
        var tmp = this.amount * fromRow[mSystem[m]];
        if (tmp < 1) break;
        energy = tmp;
        munit = m;
    }

    return new ilib.Measurement.Energy({
        unit: munit,
        amount: energy
    });
};
//register with the factory method
ilib.Measurement._constructors["energy"] = ilib.Measurement.Energy;

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
 * ilib-full-inc.js - metafile that includes all other js files
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
calendar/thaisolar.js
calendar/thaisolardate.js
calendar/persian.js
calendar/persiandate.js
calendar/persianastro.js
calendar/persianastrodate.js
calendar/han.js
calendar/handate.js
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
ctype.isscript.js
scriptinfo.js
nameprs.js
namefmt.js
addressprs.js
addressfmt.js
collate.js
nfkc/all.js
localematch.js
normstring.js
maps/casemapper.js
glyphstring.js
phone/phonefmt.js
phone/phonegeo.js
phone/phonenum.js
unit.js
unitfmt.js
units/length.js
units/speed.js
units/digitalStorage.js
units/temperature.js
units/unknown.js
units/time.js
units/mass.js
units/area.js
units/fuelConsumption.js
units/volume.js	
units/energy.js
*/

