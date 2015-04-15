'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireWildcard(_fs);

var _md5 = require('MD5');

var _md52 = _interopRequireWildcard(_md5);

var _path = require('path');

var _path2 = _interopRequireWildcard(_path);

var _glob = require('glob');

var _glob2 = _interopRequireWildcard(_glob);

var _shell = require('shelljs');

var _shell2 = _interopRequireWildcard(_shell);

var _Logger = require('./logger');

var _Logger2 = _interopRequireWildcard(_Logger);

var _config = require('../config');

var _config2 = _interopRequireWildcard(_config);

'use strict';

var Manager = (function () {
	function Manager() {
		_classCallCheck(this, Manager);
	}

	_createClass(Manager, null, [{
		key: 'install',
		value: function install(opts) {

			this.checkCacheFolder();

			var hash = this.getFileHash();
			var archive = this.getCachedArchive(hash);

			if (opts.forceFetch) {
				_Logger2['default'].info('FORCE installing npm packages');
				this.installPackages(true);
			} else {
				if (archive) {
					_Logger2['default'].info('found a cache file');
					this.extract(archive);
				} else {
					_Logger2['default'].info('install npm packages');
					this.installPackages();
				}
			}
		}
	}, {
		key: 'checkCacheFolder',
		value: function checkCacheFolder() {

			_Logger2['default'].info('checking if cache folder ' + _config2['default'].cacheDir + ' exists');

			if (!_fs2['default'].existsSync(_config2['default'].cacheDir)) {
				_Logger2['default'].info('creating cache folder');
				_shell2['default'].mkdir('-p', _config2['default'].cacheDir);
			} else {
				_Logger2['default'].success('cache folder exists');
			}
		}
	}, {
		key: 'installPackages',
		value: function installPackages() {
			var _this = this;

			var force = arguments[0] === undefined ? false : arguments[0];

			var command = force ? 'npm update --force' : 'npm update';

			_shell2['default'].exec(command, function (code, output) {
				if (code !== 0) {
					_Logger2['default'].error('something went wrong when installing npm packages');
				} else {
					_this.archive();
				}
			});
		}
	}, {
		key: 'getCachedArchive',
		value: function getCachedArchive(hash) {

			var archives = this.getArchives() || [];
			var pattern = _config2['default'].cacheDir + '/' + hash + '.7z';
			var file = archives.indexOf(pattern);

			return file !== -1 && archives[file];
		}
	}, {
		key: 'getArchives',
		value: function getArchives() {
			return _glob2['default'].sync(_config2['default'].cacheDir + '/*.7z');
		}
	}, {
		key: 'archive',
		value: function archive() {

			var hash = this.getFileHash();

			_Logger2['default'].info('archiving file ' + hash);

			_shell2['default'].exec('7za a ' + _config2['default'].cacheDir + '/' + hash + ' ' + _config2['default'].packageFolder, function (code) {
				if (code !== 0) {
					_Logger2['default'].error('something went wrong when archiving file');
				} else {
					_Logger2['default'].success('file has been archived to cache folder');
				}
			});
		}
	}, {
		key: 'extract',
		value: function extract(file) {

			_Logger2['default'].info('extracting cache file');

			_shell2['default'].exec('7za x ' + file + ' -aoa', function (code) {
				if (code !== 0) {
					_Logger2['default'].error('something went wrong');
				} else {
					_Logger2['default'].success('cache file extracted');
				}
			});
		}
	}, {
		key: 'getFileHash',
		value: function getFileHash() {

			var isShrinkWrapped = _path2['default'].resolve(process.cwd(), 'npm-shrinkwrap.json');

			if (_fs2['default'].existsSync(isShrinkWrapped)) {
				return this.hashFile(isShrinkWrapped);
			} else {
				return this.hashFile(_path2['default'].resolve(process.cwd(), 'package.json'));
			}
		}
	}, {
		key: 'hashFile',
		value: function hashFile(file) {
			return _md52['default'](_fs2['default'].readFileSync(file));
		}
	}]);

	return Manager;
})();

exports['default'] = Manager;
module.exports = exports['default'];