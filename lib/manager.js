'use strict';

import fs from 'fs';
import md5 from 'MD5';
import path from 'path';
import glob from 'glob';
import shell from 'shelljs';
import Logger from './logger';
import config from '../config';

export default class Manager {

	init () {

		Logger.info('checking if cache folder ' + config.cacheDir + ' exists');

		if ( !fs.existsSync(config.cacheDir) ) {
			Logger.info('creating cache folder');
			shell.mkdir('-p', config.cacheDir);
		} else {
			Logger.success('cache folder exists')
		}

	}

	install ( opts ) {

		this.init();

		let hash = this.getHash();
		let archive = this.cacheExists(hash);

		if ( opts.forceFetch ) {
			Logger.info('FORCE installing npm packages');
			this.installPackages(true);
		} else {
			if ( archive ) {
				Logger.info('found a cache file');
				this.extract(archive);
			} else {
				Logger.info('install npm packages');
				this.installPackages();
			}
		}

	}

	installPackages ( force = false ) {

		let command = force ? 'npm update --force' : 'npm update';

		shell.exec(command, ( code, output ) => {
			if ( code !== 0 ) {
				Logger.error('something went wrong when installing npm packages');
			} else {
				this.archive();
			}
		});

	}

	archive () {

		let hash = this.getHash();

		Logger.info('archiving file ' + hash);

		shell.exec('7za a ' + config.cacheDir + '/' + hash + ' ' + config.packageFolder, ( code ) => {
			if ( code !== 0 ) {
				Logger.error('something went wrong when archiving file');
			} else {
				Logger.success('file has been archived to cache folder');
			}
		});

	}

	extract ( file ) {

		Logger.info('extracting cache file');

		shell.exec('7za x ' + file + ' -aoa', ( code ) => {
			if ( code !== 0 ) {
				Logger.error('something went wrong');
			} else {
				Logger.success('cache file extracted');
			}
		});

	}

	cacheExists ( hash ) {

		let archives = this.getArchives() || [];
		let pattern = config.cacheDir + '/' + hash + '.7z';
		let file = archives.indexOf(pattern);

		return file !== -1 && archives[file];

	}

	getArchives () {
		return glob.sync(config.cacheDir + '/*.7z');
	}

	getHash () {

		let isShrinkWrapped = path.resolve(process.cwd(), 'npm-shrinkwrap.json');

		if ( fs.existsSync(isShrinkWrapped) ) {
			return this.hash(isShrinkWrapped);
		} else {
			return this.hash(path.resolve(process.cwd(), 'package.json'));
		}

	}

	hash ( file ) {
		return md5(fs.readFileSync(file));
	}

}
