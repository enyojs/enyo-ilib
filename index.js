var
	glue = require('./src/glue'),
	ilib = require('./ilib/lib/ilib');

// ensure the locale-specific date types are included
require('./src/dates');

ilib.enyo = glue;
ilib.enyo.version = '2.6.4-rc.16';

module.exports = ilib;
