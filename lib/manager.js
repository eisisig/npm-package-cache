'use strict';

import fs from 'fs';
import md5 from 'MD5';
import path from 'path';
import glob from 'glob';
import shell from 'shelljs';
import Logger from './logger';
import config from '../config';

export default class Manager {

	static install ( opts ) {

		this.checkCacheFolder();

		let hash = this.getFileHash();
		let archive = this.getCachedArchive(hash);

		Logger.info('Archive ' + archive);

		if ( opts.forceFetch ) {
			Logger.info('FORCE installing npm packages');
			this.installPackages(true);
		} else {
			if ( archive ) {
				Logger.success('found a cache file');
				this.extract(archive);
			} else {
				Logger.info('install npm packages');
				this.installPackages();
			}
		}

	}

	static checkCacheFolder () {

		Logger.info('checking if cache folder ' + config.cacheDir + ' exists');

		if ( !fs.existsSync(config.cacheDir) ) {
			Logger.info('creating cache folder');
			shell.mkdir('-p', config.cacheDir);
		} else {
			Logger.success('cache folder exists')
		}

	}

	static installPackages ( force = false ) {

		let command = force ? 'npm update --force' : 'npm update';

		shell.exec(command, ( code, output ) => {
			if ( code !== 0 ) {
				Logger.error('something went wrong when installing npm packages');
			} else {
				this.archive();
			}
		});

	}

	static getCachedArchive ( hash ) {

		let archives = this.getArchives() || [];

		Logger.info('Found archives ' + archives.join(', '));

		let pattern = config.cacheDir + '/' + hash + '.7z';

		Logger.info('Searching for file: ' + pattern);

		let file = archives.indexOf(pattern);

		return file !== -1 && archives[file];

	}

	static getArchives () {
		Logger.info('Cahce dir: ' + config.cacheDir);
		return glob.sync(config.cacheDir + '/*.7z');
	}

	static archive () {

		let hash = this.getFileHash();

		Logger.info('archiving file ' + hash);

		shell.exec('7za a ' + config.cacheDir + '/' + hash + ' ' + config.packageFolder, ( code ) => {
			if ( code !== 0 ) {
				Logger.error('something went wrong when archiving file');
			} else {
				Logger.success('file has been archived to cache folder');
			}
		});

	}

	static extract ( file ) {

		Logger.info('extracting cache file');

		shell.exec('7za x ' + file + ' -aoa', ( code ) => {
			if ( code !== 0 ) {
				Logger.error('something went wrong');
			} else {
				Logger.success('cache file extracted');
			}
		});

	}

	static getFileHash () {

		let isShrinkWrapped = path.resolve(process.cwd(), 'npm-shrinkwrap.json');

		if ( fs.existsSync(isShrinkWrapped) ) {
			Logger.info('Using npm-shrinkwrap.json - ' + isShrinkWrapped)
			return this.hashFile(isShrinkWrapped);
		} else {
			let packageFile = path.resolve(process.cwd(), 'package.json');
			Logger.info('Using pacakge.json - ' + packageFile)
			return this.hashFile(packageFile);
		}

	}

	static hashFile ( file ) {
		return md5(fs.readFileSync(file));
	}

}
