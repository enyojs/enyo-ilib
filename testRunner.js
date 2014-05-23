/*
 * testSuite.js - top level test suite
 * 
 * Copyright © 2013, JEDLSoft
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

var util = require("util");

var JsUnit = require("./testcli/runner.js");

var runner = new JsUnit.TestRunner("/usr/share/javascript/jsunit");

var suites = [
	"test/testSuite.js"
];

// override the possible node environment to make the tests uniform
process.env.TZ = "";
process.env.LANG = "";
process.env.LC_ALL = "";

for (suite in suites) {
	var ts = new JsUnit.TestSuite(suites[suite]);
	runner.addSuite(ts);
}

runner.runTests();
