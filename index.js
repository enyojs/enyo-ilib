var
	glue = require('./lib/glue'),
	ilib = require('./ilib/js/ilib-dyn-standard').ilib;

ilib.enyo = glue(ilib);
ilib.enyo.version = '2.6.0-pre.5-dev';

module.exports = ilib;