(function() {
	/**
	 * Load the list of files asynchronously. This uses recursion in
	 * order to create a queue of files that will be loaded serially.
	 * Each layer, starting at the bottom, loads a file and then loads
	 * the layer on top of it. The very top file on the stack will have 
	 * zero files to load, so instead it will be the one to call the 
	 * callback to notify the caller that all the content is loaded.
	 * 
	 * @param {Object} context function to call this method in the context of
	 * @param {Array.<string>} paths array of strings containing relative paths for required locale data files 
	 * @param {Array} results empty array in which to place the resulting json when it is loaded from a file
	 * @param {Object} params An object full of parameters that the caller is passing to this function to help load the files
	 * @param {function(Array.<Object>)} callback callback to call when this function is finished attempting 
	 * to load all the files that exist and can be loaded
	 */
	function loadFiles(context, paths, results, params, callback) {
		if (paths.length > 0) {
			var path = paths.shift();
			var file = "lib/enyo-ilib/ilib/locale/" + path;
			var ajax = new enyo.Ajax({url: file});
			var resultFunc = function(inSender, json) {
				results.push((typeof(json) === 'object') ? json : undefined);
				if (paths.length > 0) {
					loadFiles(context, paths, results, params, callback);
				} else {
					// only the bottom item on the stack will call 
					// the callback
					callback.call(context, results);
				}
			};
			ajax.response(this, resultFunc);
			ajax.error(this, function(inSender, json) {
				// not there? Try the standard place instead
				var file = "resources/" + path;
				var ajax2 = new enyo.Ajax({url: file});
				
				ajax2.response(this, resultFunc);
				ajax2.error(this, resultFunc);
				ajax2.go();
			});
			ajax.go();
		}
	}
	
	ilib.setLoaderCallback(enyo.bind(this, function(paths, sync, params, callback) {
		if (sync) {
			var ret = [];
			// synchronous
			if (ilib._getPlatform() === "webos") {
				// running on a webos device
				paths.forEach(function (path) {
					var json;
					try {
						jsonString = palmGetResource("/usr/palm/applications/com.palm.app.moondemo2/lib/enyo-ilib/ilib/locale/" + path, "const json");		// get the object from the shared cache
						json = (typeof(jsonString) === 'string') ? JSON.parse(jsonString) : jsonString;
					} catch ( e1 ) {
						json = undefined;
					}
					if (!json) {
						try {
							jsonString = palmGetResource("/usr/palm/applications/com.palm.app.moondemo2/resources/" + path, "const json");		// get the object from the shared cache
							json = (typeof(jsonString) === 'string') ? JSON.parse(jsonString) : jsonString;
						} catch ( e2 ) {
							json = undefined;
						}
					}
					ret.push(json);
				});
			} else {
				// running on the desktop build or the browser
				paths.forEach(function (path) {
					// console.log("browser/sync: attempting to load lib/enyo-ilib/ilib/locale/" + path);
					var ajax = new enyo.Ajax({
						url: "lib/enyo-ilib/ilib/locale/" + path,
						sync: true
					});
		
					var handler = function(inSender, json) {
						// console.log((json ? "success" : "failed"));
						ret.push((typeof(json) === 'object') ? json : undefined);
					};
					ajax.response(this, handler);
					ajax.error(this, function(inSender, json) {
						// console.log("browser/sync: Now attempting to load resources/" + path);
						var ajax2 = new enyo.Ajax({
							url: "resources/" + path,
							sync: true
						});
						ajax2.response(this, handler);
						ajax2.error(this, handler);
						ajax2.go();
					});
					ajax.go();
				});
			}
			
			if (typeof(callback) === 'function') {
				callback.call(this, ret);
			}
			return ret;
		}
	
		// asynchronous
		var results = [];
		loadFiles(this, paths, results, params, callback);
	}));
})();

/*
 * Reset the $L function to use ilib instead of the dummy function that enyo
 * comes with by default.
 */
$L = (function() {
	if (typeof(window.UILocale) !== 'undefined') {
		// this is a hack until GF-1581 is fixed
		ilib.setLocale(window.UILocale);
	}
	var lfunc = function (string) {
		var str = $L.rb.getString(string); 
		return str.toString();
	};
	lfunc.rb = new ilib.ResBundle({
		type: "html",
		name: "strings",
		lengthen: true		// if pseudo-localizing, this tells it to lengthen strings
	});
	return lfunc;
})();

/**
 * Set the locale for the strings that $L loads. This may reload the 
 * string resources if necessary.
 */
$L.setLocale = function (spec) {
	if (spec !== $L.rb.getLocale().getSpec()) {
		$L.rb = new ilib.ResBundle({
			locale: spec,
			type: "html",
			name: "strings",
			lengthen: true		// if pseudo-localizing, this tells it to lengthen strings
		});
	}
};
