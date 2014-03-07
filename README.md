# enyo-ilib

Enyo and nodejs wrapper for ilib globalization/internationalization library.

Both Enyo and nodejs wrappers define the $L function used to wrap localizable
strings and perform translations.

## Enyo

To use this in an Enyo application, put this library in your Enyo libs
directory, then edit your package.js:

    enyo.depends(
        "$lib/enyo-ilib",
	<rest of your dependencies>
    );

Now the "ilib" namespace is available to use in your app.

If you want the core (resources and string translation) or full versions, you should instead use

    enyo.depends(
        "$lib/enyo-ilib/core-package.js",
	<rest of your dependencies>
    );

or

    enyo.depends(
        "$lib/enyo-ilib/full-package.js",
	<rest of your dependencies>
    );


## nodejs

To use this under nodejs, check out this module under your nodejs app/service. Then, in your js, do:

    var ilibmodule = require("./enyo-ilib");
    var ilib = ilibmodule.ilib;
    var $L = ilibmodule.$L;

Now the ilib namespace is available to use as normal.

## Copyright and License Information

Unless otherwise specified, all content, including all source code files and
documentation files in this repository are:

Copyright (c) 2014 LG Electronics

Unless otherwise specified or set forth in the NOTICE file, all content,
including all source code files and documentation files in this repository are:
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this content except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

This work is based on the Apache-2.0 licensed [iLib](http://sourceforge.net/projects/i18nlib/)
from [JEDLsoft](http://jedlsoft.com/index.html).
