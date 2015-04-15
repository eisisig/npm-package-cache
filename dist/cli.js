#! /usr/bin/env node

"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _parser = require("nomnom");

var _parser2 = _interopRequireWildcard(_parser);

var _shell = require("shelljs");

var _shell2 = _interopRequireWildcard(_shell);

var _Manager = require("./manager");

var _Manager2 = _interopRequireWildcard(_Manager);

var _config = require("../config");

var _config2 = _interopRequireWildcard(_config);

_parser2["default"].command("install").option("forceFetch", {
	abbr: "f",
	full: "force-fetch",
	flag: true,
	"default": false,
	help: "don't use the cache and fetch the dependencies"
}).callback(function (opts) {
	_Manager2["default"].install(opts);
}).help("install dependencies");

_parser2["default"].command("clean").callback(function (opts) {
	_shell2["default"].rm("-rf", _config2["default"].cacheDir + "/*");
}).help("clean up the local cache");

_parser2["default"].parse();