#! /usr/bin/env node
'use strict';

var parser = require('nomnom');
var shell = require('shelljs');
var Manager = require('./lib/manager');
var config = require('./config');

parser.command('install')
	.option('forceFetch', {
		abbr: 'f',
		full: 'force-fetch',
		flag: true,
		default: false,
		help: 'don\'t use the cache and fetch the dependencies'
	})
	.callback(function ( opts ) {
		Manager.install(opts);
	})
	.help("install dependencies");

parser.command('list')
	.callback(function ( opts ) {
		var cache = Manager.getCache();
		console.log(cache.join('\n'));
	})
	.help('list all files in cache folder');

parser.command('clean')
	.callback(function ( opts ) {
		shell.rm('-rf', config.cacheDir + '/*');
	})
	.help('clean up the local cache');

parser.parse();
