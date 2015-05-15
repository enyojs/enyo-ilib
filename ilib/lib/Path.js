/*
 * Path.js - minimal pure js implementation of the nodejs path module
 * 
 * Copyright © 2015, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Path = {
	dirname: function(pathname) {
		pathname = pathname.replace(/\\/g, "/");
		var i = pathname.lastIndexOf("/");
		return i !== -1 ? pathname.substring(0,i) : pathname;
	},
	
	normalize: function(pathname) {
		if (pathname) {
			pathname = pathname.replace(/\\/g, "/");
			pathname = pathname.replace(/\/\//g, "/");
			pathname = pathname.replace(/\/[^/]*[^\./]\/\.\./g, "/.");
			pathname = pathname.replace(/\/\//g, "/");
			pathname = pathname.replace(/\/\.\//g, "/");
			pathname = pathname.replace(/^\.\//, "");
			pathname = pathname.replace(/\/\//g, "/");
			pathname = pathname.replace(/\/\.$/, "/");
			pathname = pathname.replace(/\/\//g, "/");
			if (pathname.length > 1) pathname = pathname.replace(/\/$/, "");
			if (pathname.length === 0) pathname = '.';
		}
		return pathname;
	},
	
	join: function() {
		var arr = [];
		for (var i = 0; i < arguments.length; i++) {
			arr.push(arguments[i] && arguments[i].length > 0 ? arguments[i] : ".");
		}
		return Path.normalize(arr.join("/"));
	}
};

module.exports = Path;
