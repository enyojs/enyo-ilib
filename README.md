enyo-ilib
=========

Enyo and nodejs wrapper for ilib globalization/internationalization library.

Both enyo and nodejs wrappers define the $L function used to wrap localizable strings and perform
translations.

Enyo
----

To use this in an enyo application, put this library in your enyo libs directory, then edit your package.js:

enyo.depends(
	"$lib/enyo-ilib",
	<rest of your dependencies>
);

Now the "ilib" namespace is available to use in your app.

Nodejs
------

To use this under nodejs, check out this module under your nodejs app/service. Then, in your js, do:

var ilibmodule = require("./enyo-ilib");
var ilib = ilibmodule.ilib;
var $L = ilibmodule.$L;

Now the ilib namespace is available to use as normal.

