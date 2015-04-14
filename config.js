var path = require('path');

module.exports = {
	cacheDir: path.resolve(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE, '.npm-package-cache'),
	packageFolder: path.resolve(process.cwd(), 'node_modules')
};
