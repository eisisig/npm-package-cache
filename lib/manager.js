'use strict';

var fs = require('fs');
var md5 = require('MD5');
var path = require('path');
var glob = require('glob');
var shell = require('shelljs');
var Logger = require('./logger');
var config = require('../config');

var Manager = function () {};

Manager.prototype.install = function ( opts ) {

	this.requirements();

	//return console.log(opts);

	var hash = this.hashFile();
	var archive = this.search(hash);

	if ( !opts.forceFetch && archive ) {
		Logger.success('Cache archive found');
		this.extract(archive);
	}
	else {
		Logger.info('No cache file found. Will install packages');
		this.npmInstall(opts);
	}

};

Manager.prototype.requirements = function () {

	Logger.info('checking if cache folder ' + config.cacheDir + ' exists');

	if ( !fs.existsSync(config.cacheDir) ) {
		Logger.info('creating cache folder');
		shell.mkdir('-p', config.cacheDir);
	}
	else {
		Logger.success('cache folder exists')
	}

};

Manager.prototype.search = function ( hash ) {

	var cache = this.getCache();

	if ( !cache.length ) { return false; }

	Logger.info('Found archives ' + cache.join(', '));

	var pattern = config.cacheDir + '/' + hash + '.7z';

	pattern = pattern.replace(/\\/g, '/');

	Logger.info('Searching for file: ' + pattern);

	var file = cache.indexOf(pattern);

	return file !== -1 && cache[file];
};

Manager.prototype.npmInstall = function ( opts ) {

	var self = this;
	var command = 'npm install';

	command += opts.production ? ' --production' : '';

	if ( opts.production ) Logger.info('Using --production flag');

	command += opts.forceFetch ? ' --force' : '';

	Logger.info('Command: ' + command);

	shell.exec(command, function ( code, output ) {
		if ( code !== 0 ) {
			Logger.error('something went wrong when installing npm packages');
		}
		else {
			self.archive();
		}
	});

};

Manager.prototype.getCache = function () {
	return glob.sync(config.cacheDir + '/*.7z');
};

Manager.prototype.hashFile = function () {

	var shrinkWrapJson = path.resolve(process.cwd(), 'npm-shrinkwrap.json');
	var packageJson = path.resolve(process.cwd(), 'package.json');

	if ( fs.existsSync(shrinkWrapJson) ) {
		var hash = md5(fs.readFileSync(shrinkWrapJson));
		Logger.info('Using npm-shrinkwrap.json - ' + shrinkWrapJson + ' - ' + hash)
		return hash;
	}
	else {
		var hash = md5(fs.readFileSync(packageJson));
		Logger.info('Using pacakge.json - ' + packageJson + ' - ' + hash)
		return hash;
	}

};

Manager.prototype.archive = function () {

	var hash = this.hashFile();

	Logger.info('archiving file ' + hash);

	shell.exec('7za a ' + config.cacheDir + '/' + hash + ' ' + config.packageFolder, function ( code ) {
		if ( code !== 0 ) {
			Logger.error('something went wrong when archiving file');
		}
		else {
			Logger.success('file has been archived to cache folder');
		}
	});

};

Manager.prototype.extract = function ( file ) {

	Logger.info('Extracting file: ' + file);

	shell.exec('7za x ' + file + ' -aoa', function ( code ) {
		if ( code !== 0 ) {
			Logger.error('something went wrong (╯︵╰,)');
		}
		else {
			Logger.success('(╯°□°）╯ YEAH!');
		}
	});

};

module.exports = new Manager();
//
//export default class Manager {
//
//	static install ( opts ) {
//
//		this.checkCacheFolder();
//
//		let hash = this.getFileHash();
//		let archive = this.getCachedArchive(hash);
//
//		Logger.info('Archive ' + archive);
//
//		if ( opts.forceFetch ) {
//			Logger.info('FORCE installing npm packages');
//			this.installPackages(true);
//		} else {
//			if ( archive ) {
//				Logger.success('found a cache file');
//				this.extract(archive);
//			} else {
//				Logger.info('install npm packages');
//				this.installPackages();
//			}
//		}
//
//	}
//
//	static checkCacheFolder () {
//
//		Logger.info('checking if cache folder ' + config.cacheDir + ' exists');
//
//		if ( !fs.existsSync(config.cacheDir) ) {
//			Logger.info('creating cache folder');
//			shell.mkdir('-p', config.cacheDir);
//		} else {
//			Logger.success('cache folder exists')
//		}
//
//	}
//
//	static installPackages ( force = false ) {
//
//		let command = force ? 'npm update --force' : 'npm update';
//
//		shell.exec(command, ( code, output ) => {
//			if ( code !== 0 ) {
//				Logger.error('something went wrong when installing npm packages');
//			} else {
//				this.archive();
//			}
//		});
//
//	}
//
//	static getCachedArchive ( hash ) {
//
//		let archives = this.getArchives() || [];
//
//		Logger.info('Found archives ' + archives.join(', '));
//
//		let pattern = config.cacheDir + '/' + hash + '.7z';
//
//		Logger.info('Searching for file: ' + pattern);
//
//		let file = archives.indexOf(pattern);
//
//		return file !== -1 && archives[file];
//
//	}
//
//	static getArchives () {
//		Logger.info('Cahce dir: ' + config.cacheDir);
//		return glob.sync(config.cacheDir + '/*.7z');
//	}
//
//	static archive () {
//
//		let hash = this.getFileHash();
//
//		Logger.info('archiving file ' + hash);
//
//		shell.exec('7za a ' + config.cacheDir + '/' + hash + ' ' + config.packageFolder, ( code ) => {
//			if ( code !== 0 ) {
//				Logger.error('something went wrong when archiving file');
//			} else {
//				Logger.success('file has been archived to cache folder');
//			}
//		});
//
//	}
//
//	static extract ( file ) {
//
//		Logger.info('extracting cache file');
//
//		shell.exec('7za x ' + file + ' -aoa', ( code ) => {
//			if ( code !== 0 ) {
//				Logger.error('something went wrong');
//			} else {
//				Logger.success('cache file extracted');
//			}
//		});
//
//	}
//
//	static getFileHash () {
//
//		let isShrinkWrapped = path.resolve(process.cwd(), 'npm-shrinkwrap.json');
//
//		if ( fs.existsSync(isShrinkWrapped) ) {
//			Logger.info('Using npm-shrinkwrap.json - ' + isShrinkWrapped)
//			return this.hashFile(isShrinkWrapped);
//		} else {
//			let packageFile = path.resolve(process.cwd(), 'package.json');
//			Logger.info('Using pacakge.json - ' + packageFile)
//			return this.hashFile(packageFile);
//		}
//		return md5(fs.readFileSync(file));
//	}
//
//	static hashFile ( file ) {
//	}
//
//}
