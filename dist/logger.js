'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireWildcard(_chalk);

var Logger = (function () {
	function Logger() {
		_classCallCheck(this, Logger);
	}

	_createClass(Logger, null, [{
		key: 'info',
		value: function info(message) {
			console.log('');
			console.log(_chalk2['default'].cyan('      INFO: ' + message));
		}
	}, {
		key: 'error',
		value: function error(message) {
			console.log('');
			console.log(_chalk2['default'].red('     ERROR: ' + message));
		}
	}, {
		key: 'success',
		value: function success(message) {
			console.log('');
			console.log(_chalk2['default'].green('   SUCCESS: ' + message));
		}
	}]);

	return Logger;
})();

exports['default'] = Logger;
module.exports = exports['default'];