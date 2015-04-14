#! /usr/bin/env node
'use strict';

import parser from 'nomnom';
import shell from 'shelljs';
import Manager from './manager';
import config from '../config';

parser.command('install')
	.option('forceFetch', {
		abbr: 'f',
		full: 'force-fetch',
		flag: true,
		default: false,
		help: 'don\'t use the cache and fetch the dependencies'
	})
	.callback(function ( opts ) {
		let manager = new Manager();
		manager.install(opts);
	})
	.help("install dependencies");

parser.command('clean')
	.callback(function ( opts ) {
		shell.rm('-rf', config.cacheDir + '/*');
	})
	.help('clean up the local cache');

parser.parse();
