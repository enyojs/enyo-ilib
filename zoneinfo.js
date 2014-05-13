/*
 * zoneinfo.js - represent a binary zone info file
 * 
 * Copyright © 2014 LG Electronics, Inc.
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

var _platform;
(function () {
	if (typeof(enyo) !== 'undefined') {
		_platform = "enyo";
	} else if (typeof(environment) !== 'undefined') {
		_platform = "rhino";
	} else if (typeof(process) !== 'undefined' || typeof(require) !== 'undefined') {
		_platform = "nodejs";
	} else if (typeof(window) !== 'undefined') {
		_platform = (typeof(PalmSystem) !== 'undefined') ? "webos" : "browser";
	} else {
		_platform = "unknown";
	}
})();

/**
 * @constructor
 * Represents a binary zone info file of the sort that the Unix Zone Info Compiler
 * produces.
 * @param {string} path path to the file to be loaded
 * @param {number} year year of the zone info rules needed
 */
var ZoneInfoFile = function (path) {
	var that = this;
	switch (_platform) {
		case "enyo":
			var ajax = new enyo.Ajax({
				xhrFields: {
					responseType:"arraybuffer"
				}, 
				url: path
			});
			ajax.response(function(s, r) {
				var byteArray = new Uint8Array(r);
				console.log("ZoneInfoFile bytes received: " + byteArray.length);
				that._parseInfo(byteArray);
			});
			
			ajax.go();
			break;
		case "nodejs":
			break;
		default:
			// use normal web techniques
			var req = new XMLHttpRequest();
			req.open("GET", "file:" + path, false);
			req.responseType = "arraybuffer";
			req.onload = function(e) {
				var byteArray = new Uint8Array(req.response);
				console.log("ZoneInfoFile bytes received: " + byteArray.length);
				that._parseInfo(byteArray);
			};
			req.send();
			break;
	}
};

/**
 * @private
 * Parse the binary buffer to find the zone info
 * @param buffer
 */
ZoneInfoFile.prototype._parseInfo = function(buffer) {
	var packed = new PackedBuffer(buffer);
    this.tzinfo = {};
    
	// The time zone information files used by tzset(3)
	// begin with the magic characters "TZif" to identify
	// them as time zone information files, followed by
	// sixteen bytes reserved for future use, followed by
	// six four-byte values of type long, written in a
	// ''standard'' byte order (the high-order byte
	// of the value is written first).
	if (packed.getString(4) != "TZif") {
		throw "file format not recognized";
	} else {
		// ignore 16 bytes
		packed.skip(16);
		
		// The number of UTC/local indicators stored in the file.
		var _ttisgmtct = packed.getLongs(1);
		// The number of standard/wall indicators stored in the file.
		var _ttisstdct = packed.getLongs(1);
		// The number of leap seconds for which data is
		// stored in the file.
		var _leapct = packed.getLongs(1);
		// The number of "transition times" for which data
		// is stored in the file.
		var _timect = packed.getLongs(1);
		// The number of "local time types" for which data
		// is stored in the file (must not be zero).
		var _typect = packed.getLongs(1);
		// The number of characters of "time zone
		// abbreviation strings" stored in the file.
		var _charct = packed.getLongs(1);

		this.tzinfo = {
			trans_list: null,
			trans_idx: null,
			ttinfo_list: null,
			ttinfo_std: null,
			ttinfo_dst: null,
			ttinfo_before: null
		};

		// The above header is followed by tzh_timecnt four-byte
		// values of type long, sorted in ascending order.
		// These values are written in ``standard'' byte order.
		// Each is used as a transition time (as returned by
		// time(2)) at which the rules for computing local time
		// change.
		if (_timect) {
			this.tzinfo.trans_list = packed.getLongs(_timect);
		} else {
			this.tzinfo.trans_list = [];
		}

		// Next come tzh_timecnt one-byte values of type unsigned
		// char; each one tells which of the different types of
		// ``local time'' types described in the file is associated
		// with the same-indexed transition time. These values
		// serve as indices into an array of ttinfo structures that
		// appears next in the file.
		if (_timect) {
			this.tzinfo.trans_idx = packed.getUnsignedBytes(_timect);
		} else {
			this.tzinfo.trans_idx = [];
		}

		// Each ttinfo structure is written as a four-byte value
		// for tt_gmtoff of type long, in a standard byte
		// order, followed by a one-byte value for tt_isdst
		// and a one-byte value for tt_abbrind. In each
		// structure, tt_gmtoff gives the number of
		// seconds to be added to UTC, tt_isdst tells whether
		// tm_isdst should be set by localtime(3), and
		// tt_abbrind serves as an index into the array of
		// time zone abbreviation characters that follow the
		// ttinfo structure(s) in the file.

		var _ttinfo = [];
		for (var i = 0; i < _typect; i++) {
			_ttinfo.push(packed.getLongs(1));
			_ttinfo.push(packed.getBytes(2));
		}

		var _abbr = packed.getUnsignedBytes(_charct).toString('ascii');
		
		// Then there are tzh_leapcnt pairs of four-byte
		// values, written in standard byte order; the
		// first value of each pair gives the time (as
		// returned by time(2)) at which a leap second
		// occurs; the second gives the total number of
		// leap seconds to be applied after the given time.
		// The pairs of values are sorted in ascending order
		// by time.

		if (_leapct) {
			_leap = packed.getLongs(_leapct * 2);
		}

		// Then there are tzh_ttisstdcnt standard/wall
		// indicators, each stored as a one-byte value;
		// they tell whether the transition times associated
		// with local time types were specified as standard
		// time or wall clock time, and are used when
		// a time zone file is used in handling POSIX-style
		// time zone environment variables.
		var _isstd = null;
		if (_ttisstdct) {
			_isstd = packed.getBytes(_ttisstdct);
		}

		// Finally, there are tzh_ttisgmtcnt UTC/local
		// indicators, each stored as a one-byte value;
		// they tell whether the transition times associated
		// with local time types were specified as UTC or
		// local time, and are used when a time zone file
		// is used in handling POSIX-style time zone envi-
		// ronment variables.
		var _isgmt = null;
		if (_ttisgmtct) {
			_isgmt = packed.getBytes(_ttisgmtct);
		}

		// finished reading

		this.tzinfo.ttinfo_list = [];
		enyo.forEach(_ttinfo, function (item, index) {
			item[0] = Math.floor(item[0] / 60);

			this.tzinfo.ttinfo_list.push({
				offset: item[0],
				isdst: item[1],
				abbr: _abbr.slice(item[2], _abbr.indexOf('\x00',item[2])),
				isstd: _ttisstdct > index && _isstd[index] != 0,
				isgmt: _ttisgmtct > index && _isgmt[index] != 0
			});
		}, this);

		// Replace ttinfo indexes for ttinfo objects.
		this.tzinfo.trans_idx = this.tzinfo.trans_idx.map(function (item) {
			return this.tzinfo.ttinfo_list[item];
		});
		
		// Set standard, dst, and before ttinfos. before will be
		// used when a given time is before any transitions,
		// and will be set to the first non-dst ttinfo, or to
		// the first dst, if all of them are dst.
		if (this.tzinfo.ttinfo_list.length) {
			if (!this.tzinfo.trans_list.length) {
				this.tzinfo.ttinfo_std = this.tzinfo.ttinfo_first = this.tzinfo.ttinfo_list[0];
			} else {
				for (var j = _timect - 1; j > -1; j--) {
					var tti = this.tzinfo.trans_idx[j];
					if (!this.tzinfo.ttinfo_std && !tti.isdst) {
						this.tzinfo.ttinfo_std = tti;
					} else if (!this.tzinfo.ttinfo_dst && tti.isdst) {
						this.tzinfo.ttinfo_dst = tti;
					}

					if (this.tzinfo.ttinfo_dst && this.tzinfo.ttinfo_std)
						break;
				}

				if (this.tzinfo.ttinfo_dst && !this.tzinfo.ttinfo_std) {
					this.tzinfo.ttinfo_std = this.tzinfo.ttinfo_dst;
				}

				for (var k in this.tzinfo.ttinfo_list) {
					if (!this.tzinfo.ttinfo_list[k].isdst) {
						this.tzinfo.ttinfo_before = this.tzinfo.ttinfo_list[k];
						break;
					}
				}

				if (!this.tzinfo.ttinfo_before) {
					this.tzinfo.ttinfo_before = this.tzinfo.ttinfo_list[0];
				}
			}
		}

		/*
		 * Now fix transition times to become relative to wall time. I'm
		 * not sure about this. In my tests, the tz source file is setup to
		 * wall time, and in the binary file isstd and isgmt are off, so it
		 * should be in wall time. OTOH, it's always in gmt time. Let me know
		 * if you have comments about this.
		 */
		var laststdoffset = 0;
		this.tzinfo._trans_list = list(this.tzinfo._trans_list);
		for (var i = 0; i < this.tzinfo._trans_list.length; i++ ) {
			var tti = this.tzinfo._trans_idx[i];
			if (!tti.isdst) {
				// This is std time.
				this.tzinfo._trans_list[i] += tti.offset;
				laststdoffset = tti.offset; 
			} else {
				// This is dst time. Convert to std. 
				this.tzinfo._trans_list[i] += laststdoffset;
				this.tzinfo._trans_list = tuple(this.tzinfo._trans_list);
			}
		}
	}
};

/**
 * Return whether or not this zone uses DST in the given year.
 * 
 * @param {number} year the Gregorian year to test
 * @returns {boolean} true if the zone uses DST in the given year
 */
ZoneInfoFile.prototype.usesDST = function(year) {
	
};

/**
 * Return the raw offset from UTC that this zone uses in the given year.
 * 
 * @param {number} year the Gregorian year to test
 * @returns {number} offset from from UTC in number of minutes. Negative
 * numbers are west of Greenwich, positive are east of Greenwich 
 */
ZoneInfoFile.prototype.getRawOffset = function(year) {
	
};

/**
 * If this zone uses DST in the given year, return the DST savings 
 * in use. If the zone does not use DST in the given year, this
 * method will return 0.
 * 
 * @param {number} year the Gregorian year to test
 * @returns {number} number of minutes in DST savings if the zone 
 * uses DST in the given year, or zero otherwise
 */
ZoneInfoFile.prototype.getDSTSavings = function(year) {
	
};

/**
 * Return the start date/time of DST if this zone uses 
 * DST in the given year.
 * 
 * @param {number} year the Gregorian year to test
 * @returns {number} unixtime representation of the start
 * of DST in the given year, or -1 if the zone does not
 * use DST in the given year
 */
ZoneInfoFile.prototype.getDSTStartDate = function(year) {
	
};

/**
 * Return the end date/time of DST if this zone uses 
 * DST in the given year.
 * 
 * @param {number} year the Gregorian year to test
 * @returns {number} unixtime representation of the end
 * of DST in the given year, or -1 if the zone does not
 * use DST in the given year
 */
ZoneInfoFile.prototype.getDSTEndDate = function(year) {
	
};

/**
 * Return the abbreviation used by this zone in standard
 * time.
 * 
 * @param {number} year the Gregorian year to test
 * @returns {string} a string representing the abbreviation
 * used in this time zone during standard time
 */
ZoneInfoFile.prototype.getAbbreviation = function(year) {
	
};

/**
 * Return the abbreviation used by this zone in daylight
 * time. If the zone does not use DST in the given year,
 * this returns the same thing as getAbbreviation().
 * 
 * @param {number} year the Gregorian year to test
 * @returns {string} a string representing the abbreviation
 * used in this time zone during daylight time
 */
ZoneInfoFile.prototype.getDSTAbbreviation = function(year) {
	
};
