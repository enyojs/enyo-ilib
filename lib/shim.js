module.exports = function (ilib) {
	ilib.String = require('../ilib/lib/IString');
	ilib.DurFmt = require('../ilib/lib/DurationFmt');
	ilib.DateFmt = require('../ilib/lib/DateFmt');
	ilib.NumFmt = require('../ilib/lib/NumFmt');
	ilib.LocaleInfo = require('../ilib/lib/LocaleInfo');
	ilib.Locale = require('../ilib/lib/Locale');
	ilib.Date = {
		newInstance: require('../ilib/lib/DateFactory')
	};
	ilib.loadData = require('../ilib/lib/Utils').loadData;
};