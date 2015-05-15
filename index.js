var
	glue = require('./lib/glue'),
	ilib = require('./ilib/lib/ilib');

ilib.enyo = glue;
ilib.enyo.version = '2.6.0-pre.5-dev';

module.exports = ilib;