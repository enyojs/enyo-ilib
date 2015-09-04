var
	glue = require('./src/glue'),
	ilib = require('./ilib/lib/ilib');

// ensure the locale-specific date types are included
require('./src/dates');

// patch the circular dependencies between ilib date and calendar objects
require('./src/patch');

ilib.enyo = glue;
ilib.enyo.version = '2.6.0-pre.15.4';

module.exports = ilib;
