var
	glue = require('./src/glue'),
	ilib = require('./ilib/lib/ilib');

// ensure the locale-specific date types are included
require('./src/dates');

ilib.enyo = glue;
ilib.enyo.version = '2.6.3-rc.6';

module.exports = ilib;
