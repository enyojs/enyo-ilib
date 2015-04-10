var
	glue = require('./lib/glue');

var enyoIlib = {
	register: function (ilib) {
		glue(ilib);
		enyoIlib.ilib = ilib;
		return enyoIlib;
	},
	ilib: null,
	version: '2.6.0-pre.5-dev'
};

module.exports = enyoIlib;