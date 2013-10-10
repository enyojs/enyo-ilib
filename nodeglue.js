/* jshint node: true */
// pass the ilib definition to our callers
exports.ilib = require("./ilib/js/ilib-dyn-standard.js").ilib;

var path = require("path"),
	fs = require("fs");
// var util = require("util");

exports.ilib._load = (function () {
	var base = path.normalize(path.join(__dirname, "ilib/locale"));

	if (!fs.existsSync(path.join(base, "localeinfo.json"))) {
		base = "/usr/palm/ilib/locale";
	}

	function nextFile(context, root, paths, results, callback, json) {
		//util.print("node loader:  " + (json ? "succeeded" : "failed") + "\n");
		results.push(json ? JSON.parse(json) : undefined);
		if (paths.length > 0) {
			loadFiles(context, root, paths, results, callback);
		} else {
			// only call the callback at the end of the chain of files
			if (typeof(callback) === 'function') {
				callback(results);
			}
		}
	}

	function loadFiles(context, root, paths, results, callback) {
		if (paths.length > 0) {
			var filename = paths.shift();
			var filepath = path.join(root, filename);
			//util.print("node loader: attempting sync load " + filepath + "\n");
			fs.readFile(filepath, "utf-8", function(err, json) {
				if (err) {
					filepath = path.join("resources", filename);
					//util.print("node loader: attempting sync load " + filepath + "\n");
					fs.readFile(filepath, "utf-8", function(err, json) {
						nextFile(context, root, paths, results, callback, err ? undefined : json);
					});
				} else {
					nextFile(context, root, paths, results, callback, json);
				}
			});
		}
	}
	return function(paths, sync, params, callback) {
		var root = (params && params.root) ? path.normalize(params.root) : base;

		//util.print("node loader: attempting to load paths " + JSON.stringify(paths) + "\n");
		if (sync) {
			var ret = [];

			// synchronous
			paths.forEach(function (p) {
				var filepath = path.join(root, p);
				//util.print("node loader: attempting sync load " + filepath + "\n");
				var json;
				if (fs.existsSync(filepath)) {
					json = fs.readFileSync(filepath, "utf-8");
				} else {
					filepath = path.join(root, "resources", p);
					//util.print("node loader: attempting sync load " + filepath + "\n");
					if (fs.existsSync(filepath)) {
						json = fs.readFileSync(filepath, "utf-8");
					}
				}
				//util.print("node loader:  " + (json ? "succeeded" : "failed") + "\n");
				ret.push(json ? JSON.parse(json) : undefined);
			});

			// only call the callback at the end of the chain of files
			if (typeof(callback) === 'function') {
				callback(ret);
			}

			return ret;
		}

		// asynchronous
		var results = [];
		loadFiles(this, root, paths, results, callback);
	};
})();

exports.$L = (function() {
	var lfunc = function (string) {
		var str;
		if (typeof(string) === 'string') {
			if (!$L.rb) {
				return string;
			}
			str = $L.rb.getString(string);
		} else if (typeof(string) === 'object') {
			if (typeof(string.key) !== 'undefined' && typeof(string.value) !== 'undefined') {
				if (!$L.rb) {
					return string.value;
				}
				str = $L.rb.getString(string.value, string.key);
			} else {
				str = "";
			}
		} else {
			str = string;
		}
		return str.toString();
	};
	lfunc.rb = new exports.ilib.ResBundle({
		type: "html",
		name: "strings",
		lengthen: true		// if pseudo-localizing, this tells it to lengthen strings
	});
	//util.print("node loader: the resource bundle is now " + JSON.stringify(lfunc.rb) + "\n");
	return lfunc;
})();


