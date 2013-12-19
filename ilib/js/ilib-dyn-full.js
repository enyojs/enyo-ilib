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
    return "4.0"
    ;
};

/**
 * Place where resources and such are eventually assigned.
 * @dict
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
 * @private
 * @static
 * Return true if the global variable is defined on this platform.
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
	if (typeof(spec) === 'string') {
		ilib.locale = spec;
	}
    // else ignore other data types, as we don't have the dependencies
	// to look into them to find a locale
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
	if (typeof(ilib.locale) !== 'string') {
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
 * default to the the zone "local".<p>
 * 
 * Depends directive: !depends ilibglobal.js
 * 
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
    if (typeof(loader) === 'function' || typeof(loader) === 'undefined') {
    	// console.log("setting callback loader to " + (loader ? loader.name : "undefined"));
        ilib._load = loader;
        return true;
    }
    return false;
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

/**
 * @static
 * Return the ISO-3166 alpha3 equivalent region code for the given ISO 3166 alpha2
 * region code. If the given alpha2 code is not found, this function returns its
 * argument unchanged.
 * @param {string|undefined} alpha2 the alpha2 code to map
 * @return {string|undefined} the alpha3 equivalent of the given alpha2 code, or the alpha2
 * parameter if the alpha2 value is not found
 */
ilib.Locale.regionAlpha2ToAlpha3 = function(alpha2) {
	return ilib.Locale.a2toa3regmap[alpha2] || alpha2;
};

/**
 * @static
 * Return the ISO-639 alpha3 equivalent language code for the given ISO 639 alpha1
 * language code. If the given alpha1 code is not found, this function returns its
 * argument unchanged.
 * @param {string|undefined} alpha1 the alpha1 code to map
 * @return {string|undefined} the alpha3 equivalent of the given alpha1 code, or the alpha1
 * parameter if the alpha1 value is not found
 */
ilib.Locale.languageAlpha1ToAlpha3 = function(alpha1) {
	return ilib.Locale.a1toa3langmap[alpha1] || alpha1;
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
		return (this.language === 'zxx' && this.region === 'XX');
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
	/** @type {{
		scripts:Array.<string>,
		timezone:string,
		units:string,
		calendar:string,
		clock:string,
		currency:string,
		firstDayOfWeek:number,
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
	}}*/
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
		return this.info.native_numfmt && this.info.native_numfmt.digits;
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

/* !depends ilibglobal.js localeinfo.js */

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
 * util/utils.js - Core utility routines
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
 * <li><i>type</i> - String. Type of file to load. This can be "json" or "other" type. Default: "json" 
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
		type,
		loadParams = {},
		callback = undefined;
	
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
	
	callback = params.callback;
	
	if (object && !object.cache) {
		object.cache = {};
	}
	
	if (!type) {
		var dot = name.lastIndexOf(".");
		type = (dot !== -1) ? name.substring(dot+1) : "text";
	}

	var spec = (locale.getSpec().replace(/-/g, '_') || "root") + "," + name + "," + String(ilib.hashCode(loadParams));
	if (!object || typeof(object.cache[spec]) === 'undefined') {
		var data;
		
		if (type === "json") {
			var basename = name.substring(0, name.lastIndexOf("."));
			data = ilib.mergeLocData(basename, locale);
			if (data) {
				if (object) {
					object.cache[spec] = data;
				}
				callback(data);
				return;
			}
		}
		
		if (typeof(ilib._load) === 'function') {
			// the data is not preassembled, so attempt to load it dynamically
			var files = ilib.getLocFiles(locale, name);
			if (type !== "json") {
				loadParams.returnOne = true;
			}
			
			ilib._load(files, sync, loadParams, ilib.bind(this, function(arr) {
				if (type === "json") {
					data = ilib.data[basename] || {};
					for (var i = 0; i < arr.length; i++) {
						if (typeof(arr[i]) !== 'undefined') {
							data = ilib.merge(data, arr[i]);
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
 * Load the plural the definitions of plurals for the locale.
 * @param {ilib.Locale|string} locale
 * @param {boolean} sync
 * @param {Object} loadParams
 * @param {function(*)|undefined} onLoad
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
	 * @param {boolean} sync [optional] whether to load the locale data synchronously 
	 * or not
	 * @param {Object} loadParams [optional] parameters to pass to the loader function
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

/* !depends 
date.js 
calendar/gregorian.js 
util/utils.js
util/search.js 
localeinfo.js 
julianday.js 
*/

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
			// JD time is defined to be UTC
			this.timezone = "Etc/UTC";
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
			// RD time is defined to be UTC
			this.setRd(params.rd);
		} else {
			var now = new Date();
			this.setTime(now.getTime());
		}
	} else {
		var now = new Date();
		this.setTime(now.getTime());
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
 * the difference between a zero Julian day and the zero Gregorian date. 
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
	// explicitly call the gregorian leap year calculator so that it doesn't conflict
	// with the calculator of possible subclasses 
	var dayInYear = (date.month > 1 ? ilib.Date.GregDate.cumMonthLengths[date.month-1] : 0) +
		date.day +
		(ilib.Cal.Gregorian.prototype.isLeapYear.call(this.cal, date.year) && date.month > 2 ? 1 : 0);
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
		years400,
		years100,
		years4,
		years1,
		remainder,
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
	
	// explicitly call the gregorian rd calculator instead of any 
	// possible overloaded ones from subclasses
	remainder = rd - ilib.Date.GregDate.prototype.calcRataDie.call(this, ret) + 1;
	
	cumulative = ilib.Cal.Gregorian.prototype.isLeapYear.call(this.cal, ret.year) ? 
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
 * @return {ilib.Date} the date being sought
 */
ilib.Date.GregDate.prototype.before = function (dow) {
	return this.cal.newDateInstance({rd: this.beforeRd(this.getRataDie(), dow)});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week after the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week after the current date that is being sought
 * @return {ilib.Date} the date being sought
 */
ilib.Date.GregDate.prototype.after = function (dow) {
	return this.cal.newDateInstance({rd: this.afterRd(this.getRataDie(), dow)});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week on or before the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week on or before the current date that is being sought
 * @return {ilib.Date} the date being sought
 */
ilib.Date.GregDate.prototype.onOrBefore = function (dow) {
	return this.cal.newDateInstance({rd: this.onOrBeforeRd(this.getRataDie(), dow)});
};

/**
 * Return a new Gregorian date instance that represents the first instance of the 
 * given day of the week on or after the current date. The day of the week is encoded
 * as a number where 0 = Sunday, 1 = Monday, etc.
 * 
 * @param {number} dow the day of the week on or after the current date that is being sought
 * @return {ilib.Date} the date being sought
 */
ilib.Date.GregDate.prototype.onOrAfter = function (dow) {
	return this.cal.newDateInstance({rd: this.onOrAfterRd(this.getRataDie(), dow)});
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
	return this.timezone || "local";
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
util/math.js
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
			}
			this.id = options.id;
		} else if (options.offset) {
			this.offset = (typeof(options.offset) === 'string') ? parseInt(options.offset, 10) : options.offset;
			this.id = this.getDisplayName(undefined, undefined);
		}
		
		if (typeof(options.sync) !== 'undefined') {
			this.sync = options.sync;
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

ilib.data.defaultZones = {
	"Etc/UTC":{"o":"0:0","f":"UTC"}
};

ilib.TimeZone.prototype._loadtzdata = function () {
	if (!ilib.data.timezones) {
		ilib.loadData({
			object: ilib.TimeZone, 
			locale: "-",	// locale independent 
			name: "timezones.json", 
			sync: this.sync, 
			loadParams: this.loadParams, 
			callback: ilib.bind(this, function (tzdata) {
				ilib.data.timezones = tzdata || ilib.data.defaultZones;
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
	this.zone = ilib.data.timezones[this.id];
	if (!this.zone && typeof(this.offset) === 'undefined') {
		this.id = "Etc/UTC";
		this.zone = ilib.data.timezones[this.id];
	}
	
	if (this.onLoad && typeof(this.onLoad) === 'function') {
		this.onLoad(this);
	}
};

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
	
	if (!country) {
		// special zone meaning "the local time zone according to the JS engine we are running upon"
		ids.push("local");
	}
	
	for (tz in ilib.data.timezones) {
		if (tz && (!country || ilib.data.timezones[tz].c === country)) {
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
					letter = this.inDaylightTime(date) ? this.zone.s.c : this.zone.e.c; 
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
	} 
	// southern hemisphere
	return (rd >= startRd || rd < endRd) ? true : false;
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
 * @static
 * 
 * Map a string to the given set of alternate characters. If the target set
 * does not contain a particular character in the input string, then that
 * character will be copied to the output unmapped.
 * 
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
 * @static
 * 
 * Check if an object is a memory of the given array. This works in older
 * browsers as well.
 * 
 * @param {Array.<Object>} array array to search
 * @param {Object} obj object to search for
 * @return {number} index of the object in the array, or -1 if it is not in the array
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
localeinfo.js
calendar/gregorian.js
util/jsutils.js
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
 *<li><i>useNative</i> - the flag used to determaine whether to use the native script settings 
 * for formatting the numbers .
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
	var arr, i, bad, 
		sync = true, 
		loadParams = undefined;
	
	this.locale = new ilib.Locale();
	this.type = "date";
	this.length = "s";
	this.dateComponents = "dmy";
	this.timeComponents = "ahm";
	this.useNative= false;
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
		} else if (options.locale) {
			// if an explicit locale was given, then get the time zone for that locale
			this.tz = new ilib.TimeZone({
				locale: this.locale
			});
		} // else just assume time zone "local"
		
		if (typeof(options.useNative) !== 'undefined') {
			this.useNative = options.useNative;
		}
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		loadParams = options.loadParams;
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
									formats = ilib.DateFmt.defaultFmt;
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

ilib.DateFmt.defaultFmt = ilib.data.dateformats || {
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
	"buddhist": "gregorian"
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

		// set up the mapping to native or alternate digits if necessary
		var digits = this.locinfo.getDigits();
		if (digits && digits != "0123456789") {
			this.digits = digits;
		}
		if (this.useNative) {
			digits = this.locinfo.getNativeDigits();
			if (digits) {
				this.digits = digits;
			}
		}
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
					if (this.locale.getLanguage() === 'zh') {
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
	 * @param {ilib.Date} date a date to format
	 * @return {string} the formatted version of the given date instance
	 */
	format: function (date) {
		if (!date.getCalendar || date.getCalendar() !== this.calName) {
			throw "Wrong date type passed to ilib.DateFmt.format()";
		}
		
		var thisZoneName = this.tz && this.tz.getId() || "local";
		var dateZoneName = date.timezone || "local";
		
		// convert to the time zone of this formatter before formatting
		if (dateZoneName !== thisZoneName) {
			// console.log("Differing time zones date: " + dateZoneName + " and fmt: " + thisZoneName + ". Converting...");
			
			var datetz = new ilib.TimeZone({
				locale: date.locale,
				id: dateZoneName
			});
			var thistz = this.tz || new ilib.TimeZone({
				locale: date.locale,
				id: thisZoneName
			});
			
			var dateOffset = datetz.getOffset(date),
				fmtOffset = thistz.getOffset(date),
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
calendar/gregorian.js
util/jsutils.js
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
	opts.sync = sync;
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
			// JD time is defined to be UTC
			this.timezone = "Etc/UTC";
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
			var now = new Date();
			this.setTime(now.getTime());
		}
	} else {
		var now = new Date();
		this.setTime(now.getTime());
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
	return this.timezone || "local";
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

/* !depends 
date.js 
calendar/islamic.js 
util/utils.js 
util/search.js
localeinfo.js
julianday.js
*/

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
			// JD time is defined to be UTC
			this.timezone = "Etc/UTC";
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
			var now = new Date();
			this.setTime(now.getTime());
		}
	} else {
		var now = new Date();
		this.setTime(now.getTime());
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
	return this.timezone || "local";
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

/* !depends 
date.js 
calendar/julian.js 
util/utils.js
util/search.js 
localeinfo.js 
julianday.js 
*/

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
			// JD time is defined to be UTC
			this.timezone = "Etc/UTC";
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
			var now = new Date();
			this.setTime(now.getTime());
		}
	} else {
		var now = new Date();
		this.setTime(now.getTime());
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
	return this.timezone || "local";
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
/*
 * thaisolar.js - Represent a Thai solar calendar object.
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


/* !depends calendar.js locale.js date.js julianday.js calendar/gregorian.js util/utils.js */

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
date.js
calendar/gregoriandate.js
calendar/thaisolar.js
util/utils.js
util/search.js 
localeinfo.js 
julianday.js 
*/

/**
 * @class
 * 
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
	ilib.Date.GregDate.call(this, params);
	this.cal = new ilib.Cal.ThaiSolar();
};

ilib.Date.ThaiSolarDate.prototype = new ilib.Date.GregDate();
ilib.Date.ThaiSolarDate.prototype.parent = ilib.Date.GregDate.prototype;
ilib.Date.ThaiSolarDate.prototype.constructor = ilib.Date.ThaiSolarDate;

/**
 * @private
 * @const
 * @type number
 * the difference between a zero Julian day and the zero Thai Solar date.
 * This is some 543 years before the start of the Gregorian epoch. 
 */
ilib.Date.ThaiSolarDate.epoch = 1523097.5;

/**
 * @private
 * Return the Rata Die (fixed day) number for the given date.
 * @param {Object} parts the parts to calculate with
 * @return {number} the rd date as a number
 */
ilib.Date.ThaiSolarDate.prototype.calcRataDie = function(parts) {
	var gregorianRd = this.parent.calcRataDie.call(this, {
		year: parts.year - 543,
		month: parts.month,
		day: parts.day,
		hour: parts.hour,
		minute: parts.minute,
		second: parts.second,
		millisecond: parts.millisecond
	});
	// there is 198327 days difference between the Thai solar and 
	// Gregorian epochs which is equivalent to 543 years
	return gregorianRd + 198327;
};

/**
 * @private
 * Calculate date components for the given RD date.
 * @param {number} rd the RD date to calculate components for
 * @return {Object} object containing the component fields
 */
ilib.Date.ThaiSolarDate.prototype.calcComponents = function (rd) {
	// there is 198327 days difference between the Thai solar and 
	// Gregorian epochs which is equivalent to 543 years
	var gregorianComponents = this.parent.calcComponents.call(this, rd - 198327);
	
	gregorianComponents.year += 543;
	return gregorianComponents;
};

/**
 * Set the date of this instance using a Julian Day.
 * @param {number} date the Julian Day to use to set this date
 */
ilib.Date.ThaiSolarDate.prototype.setJulianDay = function (date) {
	var jd = (typeof(date) === 'number') ? new ilib.JulianDay(date) : date,
		rd;	// rata die -- # of days since the beginning of the calendar
	
	rd = jd.getDate() - ilib.Date.ThaiSolarDate.epoch; 	// Julian Days start at noon
	this.setRd(rd);
};

/**
 * Return the day of the week of this date. The day of the week is encoded
 * as number from 0 to 6, with 0=Sunday, 1=Monday, etc., until 6=Saturday.
 * 
 * @return {number} the day of the week
 */
ilib.Date.ThaiSolarDate.prototype.getDayOfWeek = function() {
	var rd = Math.floor(this.getRataDie() - 198327);
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
ilib.Date.ThaiSolarDate.prototype.onOrBeforeRd = function(rd, dayOfWeek) {
	return rd - ilib.mod(Math.floor(rd - 198327) - dayOfWeek, 7);
};

/**
 * Return the unix time equivalent to this ThaiSolar date instance. Unix time is
 * the number of milliseconds since midnight on Jan 1, 1970. This method only
 * returns a valid number for dates between midnight, Jan 1, 1970 and  
 * Jan 19, 2038 at 3:14:07am when the unix time runs out. If this instance 
 * encodes a date outside of that range, this method will return -1.
 * 
 * @return {number} a number giving the unix time, or -1 if the date is outside the
 * valid unix time range
 */
ilib.Date.ThaiSolarDate.prototype.getTime = function() {
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
	if (rd < 917490 || rd > 942345.134803241) { 
		return -1;
	}

	// avoid the rounding errors in the floating point math by only using
	// the whole days from the rd, and then calculating the milliseconds directly
	var seconds = Math.floor(rd - 917490) * 86400 + 
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
ilib.Date.ThaiSolarDate.prototype.setTime = function(millis) {
	var rd = 917490 + millis / 86400000;
	this.setRd(rd);
};

/**
 * Return the Julian Day equivalent to this calendar date as a number.
 * 
 * @return {number} the julian date equivalent of this date
 */
ilib.Date.ThaiSolarDate.prototype.getJulianDay = function() {
	return this.getRataDie() + ilib.Date.ThaiSolarDate.epoch;
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

// !depends ilibglobal.js locale.js

// !data ctype

/**
 * @namespace
 * Provides a set of static routines that return information about characters.
 * These routines emulate the C-library ctype functions. The characters must be 
 * encoded in utf-16, as no other charsets are currently supported. Only the first
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
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is a digit character in the
 * Latin script. 
 */
ilib.CType.isDigit = function (ch) {
	return ilib.CType._inRange(ch, 'digit', ilib.data.ctype);
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
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is a whitespace character.
 */
ilib.CType.isSpace = function (ch) {
	return ilib.CType._inRange(ch, 'space', ilib.data.ctype) ||
		ilib.CType._inRange(ch, 'Zs', ilib.data.ctype_z) ||
		ilib.CType._inRange(ch, 'Zl', ilib.data.ctype_z) ||
		ilib.CType._inRange(ch, 'Zp', ilib.data.ctype_z);
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
 * @param {Object} options Options controlling how the instance should be created 
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
 * When the type of this formatter is "number",
 * the style can be either "standard" or "scientific" or "native". A "standard" style means
 * a fully specified floating point number formatted for the locale, whereas "scientific" uses
 * scientific notation for all numbers. That is, 1 integral digit, followed by a number
 * of fractional digits, followed by an "e" which denotes exponentiation, followed digits
 * which give the power of 10 in the exponent. The native style will format a floating point
 * number using the native digits and formatting symbols for the script of the locale. Note
 * that if you specify a maximum number
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
	/** @type {string} */
	this.type = "number";
	this.useNative = false;

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
			/** @type {string} */
			this.currency = options.currency;
		}

		if (typeof (options.maxFractionDigits) === 'number') {
			/** @type {number|undefined} */
			this.maxFractionDigits = this._toPrimitive(options.maxFractionDigits);
		}
		if (typeof (options.minFractionDigits) === 'number') {
			/** @type {number|undefined} */
			this.minFractionDigits = this._toPrimitive(options.minFractionDigits);
		}
		if (options.style) {
			/** @type {string} */
			this.style = options.style;
		}
		if (options.useNative) {
			this.useNative = options.useNative;
		}
		/** @type {string} */
		this.roundingMode = options.roundingMode;

		if (typeof (options.sync) !== 'undefined') {
			/** @type {boolean} */
			sync = (options.sync == true);
		}
	}

	/** @type {ilib.LocaleInfo|undefined} */
	this.localeInfo = undefined;
	
	new ilib.LocaleInfo(this.locale, {
		sync: sync,
		onLoad: ilib.bind(this, function (li) {
			/** @type {ilib.LocaleInfo|undefined} */
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
 * @static
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
		
		this.prigroupSize = this.localeInfo.getPrimaryGroupingDigits(),
		this.secgroupSize = this.localeInfo.getSecondaryGroupingDigits(),
		this.groupingSeparator = this.useNative ? this.localeInfo.getNativeGroupingSeparator() : this.localeInfo.getGroupingSeparator();
		this.decimalSeparator = this.useNative ? this.localeInfo.getNativeDecimalSeparator() : this.localeInfo.getDecimalSeparator();
		
		if (this.useNative) {
			var nd = this.localeInfo.getNativeDigits() || this.localeInfo.getDigits();
			if (nd) {
				this.digits = nd.split("");
			}
		} else {
			var digitsStr = this.localeInfo.getDigits();
			if (digitsStr && digitsStr !== "0123456789") {
				this.digits = digitsStr.split("");
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
	 * @private
	 * Format the number using scientific notation as a positive number. Negative
	 * formatting to be applied later.
	 * @param {number} num the number to format
	 * @return {string} the formatted number
	 */
	_formatScientific: function (num) {
		var n = new Number(num);
		var formatted;
		if (typeof (this.maxFractionDigits) !== 'undefined') {
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
			formatted = "" + significant + this.exponentSymbol + e;
		} else {
			formatted = n.toExponential(this.minFractionDigits);
			if (this.exponentSymbol !== 'e') {
				formatted = formatted.replace(/e/, this.exponentSymbol);
			}
		}
		return formatted;
	},

	/**
	 * @private
	 * Formats the number as a positive number. Negative formatting to be applied later.
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
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is alphabetic or numeric
 */
ilib.CType.isAlnum = function isAlnum(ch) {
	return ilib.CType.isAlpha(ch) || ilib.CType.isDigit(ch);
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
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is in the ASCII range.
 */
ilib.CType.isAscii = function (ch) {
	return ilib.CType._inRange(ch, 'ascii', ilib.data.ctype);
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
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is a blank character.
 */
ilib.CType.isBlank = function (ch) {
	return ilib.CType._inRange(ch, 'blank', ilib.data.ctype);
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
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is a control character.
 */
ilib.CType.isCntrl = function (ch) {
	return ilib.CType._inRange(ch, 'Cc', ilib.data.ctype_c);
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
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is any printable character
 * other than space. 
 */
ilib.CType.isGraph = function (ch) {
	return typeof(ch) !== 'undefined' && ch.length > 0 && !ilib.CType.isSpace(ch) && !ilib.CType.isCntrl(ch);
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
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is lower-case.
 */
ilib.CType.isLower = function (ch) {
	return ilib.CType._inRange(ch, 'Ll', ilib.data.ctype_l);
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
 * @param {string} ch character to examine
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
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is upper-case.
 */
ilib.CType.isUpper = function (ch) {
	return ilib.CType._inRange(ch, 'Lu', ilib.data.ctype_l);
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
 * @param {string} ch character to examine
 * @return {boolean} true if the first character is a hexadecimal digit written
 * in the Latin script.
 */
ilib.CType.isXdigit = function (ch) {
	return ilib.CType._inRange(ch, 'xdigit', ilib.data.ctype);
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
 * scriptinfo.js - information about scripts
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
 * @static
 * Return an array of all ISO 15924 4-letter identifier script identifiers that
 * this copy of ilib knows about.
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
	]
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
    			info = asianName ? this.info : ilib.Name.defaultInfo;
    		} else {
    			asianName = ilib.Name._isAsianName(name);
	    		info = asianName ? ilib.Name.defaultInfo : this.info;
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
						if (typeof(options.onLoad) === 'function') {
							options.onLoad(this);
						}
					})
				});
			} else {
				this.info = info;
				this._init();
				if (typeof(options.onLoad) === 'function') {
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
 * @constructor
 * 
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
 *   <li>accent or secondary - Both the primary and secondary distinctions between characters
 *   are significant. That is, the collator will be accent- and variation-insensitive
 *   and will distinguish between base characters and character case.
 *   <li>case or tertiary - The primary, secondary, and tertiary distinctions between
 *   characters are all significant. That is, the collator will be 
 *   variation-insensitive, but accent-, case-, and base-character-sensitive. 
 *   <li>variant or quaternary - All distinctions between characters are significant. That is,
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
	var sync = true,
		loadParams = undefined;

	// defaults
	/** @type ilib.Locale */
	this.locale = new ilib.Locale(ilib.getLocale());
	this.caseFirst = "upper";
	this.sensitivity = "case";
	
	if (options) {
		if (options.locale) {
			this.locale = (typeof(options.locale) === 'string') ? new ilib.Locale(options.locale) : options.locale;
		}
		if (options.sensitivity) {
			switch (options.sensitivity) {
				case 'primary':
				case 'base':
					this.sensitivity = "base";
					break;
				case 'secondary':
				case 'accent':
					this.sensitivity = "accent";
					break;
				case 'tertiary':
				case 'case':
					this.sensitivity = "case";
					break;
				case 'quaternary':
				case 'variant':
					this.sensitivity = "variant";
					break;
			}
		}
		if (typeof(options.upperFirst) !== 'undefined') {
			/** @type string */
			this.caseFirst = options.upperFirst ? "upper" : "lower"; 
		}
		
		if (typeof(options.ignorePunctuation) !== 'undefined') {
			/** @type boolean */
			this.ignorePunctuation = options.ignorePunctuation;
		}
		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}
		
		loadParams = options.loadParams;
	}

	if (typeof(Intl) !== 'undefined' && Intl) {
		// this engine is modern and supports the new Intl object!
		//console.log("implemented natively");
		/** @type {{compare:function(string,string)}} */
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
			name: "collrules.json", 
			sync: sync, 
			loadParams: loadParams, 
			callback: ilib.bind(this, function (collation) {
				/*
				// TODO: fill in the collator constructor function
				if (!collation) {
					collation = ilib.data.ducet;
					var spec = this.locale.getSpec().replace(/-/g, '_');
					ilib.Collator.cache[spec] = collation;
				}
				console.log("this is " + JSON.stringify(this));
				this._init(collation);
				if (options && typeof(options.onLoad) === 'function') {
					options.onLoad(this);
				}
				*/
			})
		});
	}
};

ilib.Collator.prototype = {
    /**
     * @private
     */
    init: function(rules) {
    	
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
		// last resort: use the "C" locale
		if (this.collator) {
			// implemented by the core engine
			return this.collator.compare(left, right);
		}
		
		return (left < right) ? -1 : ((left > right) ? 1 : 0);
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
// !data norm.ccc nfd/all
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
// !data norm.ccc nfc/all
ilib.data.norm.nfc = ilib.merge(ilib.data.norm.nfc || {}, ilib.data.nfc_all);
ilib.data.nfc_all = undefined;
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
// !data norm.ccc nfkd/all
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
// !data norm.ccc

/*
 * localematch.js - Locale matcher definition
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

	if (!ilib.data.likelylocales) {
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
				this.info = info;
				if (options && typeof(options.onLoad) === 'function') {
					options.onLoad(this);
				}
			})
		});
	} else {
		this.info = ilib.data.likelylocales;
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
 * normstring.js - ilib normalized string subclass definition
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

// !depends strings.js

/**
 * @class
 * Create a new normalized string instance. This string inherits from 
 * the ilib.String class, and adds the normalize method. It can be
 * used anywhere that a normal Javascript string is used. <p>
 * 
 * Depends directive: !depends normstring.js
 * 
 * @constructor
 * @param {string|ilib.String=} str initialize this instance with this string 
 */
ilib.NormString = function (str) {
	ilib.NormString.baseConstructor.call(this, str);
	
};
ilib.NormString.prototype = new ilib.String();
ilib.NormString.prototype.constructor = ilib.NormString;
ilib.NormString.baseConstructor = ilib.String;
ilib.NormString.superClass = ilib.String.prototype;


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
	if (!ilib._load || typeof(ilib._load) !== 'function') {
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
		"nfc": ["nfc", "nfd"],
		"nfkd": ["nfkd", "nfd"],
		"nfkc": ["nfkd", "nfd", "nfc"]
	};
	var files = ["norm.ccc.json"];
	var forms = formDependencies[form];
	for (var f in forms) {
		files.push(forms[f] + "/" + script + ".json");
	}
	
	ilib._load(files, sync, loadParams, function(arr) {
		ilib.data.norm.ccc = arr[0];
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
 * @private
 * @static
 * 
 * Return true if the given character is a leading Jamo (Choseong) character.
 * 
 * @param {number} n code point to check
 * @return {boolean} true if the character is a leading Jamo character, 
 * false otherwise
 */
ilib.NormString._isJamoL = function (n) {
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
ilib.NormString._isJamoV = function (n) {
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
ilib.NormString._isJamoT = function (n) {
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
ilib.NormString._isHangul = function (n) {
	return (n >= 0xAC00 && n <= 0xD7A3);
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
ilib.NormString._composeJamoLV = function (lead, trail) {
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
ilib.NormString._composeJamoLVT = function (lead, trail) {
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
ilib.NormString._expand = function (ch, canon, compat) {
	var i, 
		expansion = "",
		n = ch.charCodeAt(0);
	if (ilib.NormString._isHangul(n)) {
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
ilib.NormString._compose = function (lead, trail) {
	var first = lead.charCodeAt(0);
	var last = trail.charCodeAt(0);
	if (ilib.NormString._isHangul(first) && ilib.NormString._isJamoT(last)) {
		return ilib.NormString._composeJamoLVT(first, last);
	} else if (ilib.NormString._isJamoL(first) && ilib.NormString._isJamoV(last)) {
		return ilib.NormString._composeJamoLV(first, last);
	}

	var c = lead + trail;
	return (ilib.data.norm.nfc && ilib.data.norm.nfc[c]);
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
		var ch, it = this.charIterator();
		while (it.hasNext()) {
			ch = it.next();
			decomp += ilib.NormString._expand(ch, ilib.data.norm.nfd, ilib.data.norm.nfkd);
		}
	} else {
		var ch, it = this.charIterator();
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
							var testChar = ilib.NormString._compose(cpArray[i], cpArray[end]);
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
						var testChar = ilib.NormString._compose(cpArray[i], cpArray[end]);
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
scriptinfo.js
nameprs.js
namefmt.js
addressprs.js
addressfmt.js
collate.js
nfkc/all.js
localematch.js
normstring.js
*/
