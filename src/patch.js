var
	IDate = require('../ilib/lib/IDate');

var calendars = {
	"gregorian": require('../ilib/lib/GregorianCal'),
	"coptic": require('../ilib/lib/CopticCal'),
	"ethiopic": require('../ilib/lib/EthiopicCal'),
	"gregorian": require('../ilib/lib/GregorianCal'),
	"han": require('../ilib/lib/HanCal'),
	"hebrew": require('../ilib/lib/HebrewCal'),
	"islamic": require('../ilib/lib/IslamicCal'),
	"julian": require('../ilib/lib/JulianCal'),
	"persian": require('../ilib/lib/PersianCal'),
	"persian-algo": require('../ilib/lib/PersianAlgoCal'),
	"thaisolar": require('../ilib/lib/ThaiSolarCal')
};

IDate.newDateInstance = function (type, r) {
	var ctor = IDate._constructors[type];
	return ctor && new ctor(r);
};

Object.keys(calendars).forEach(function (key) {
	var c = calendars[key];
	c.prototype.newDateInstance = function (options) {
		return IDate.newDateInstance(key, options);
	};
});