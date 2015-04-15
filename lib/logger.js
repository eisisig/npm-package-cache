var chalk = require('chalk');

module.exports = {

	info: function ( message ) {
		console.log('');
		console.log(chalk.cyan('      INFO: ' + message));
	},

	error: function ( message ) {
		console.log('');
		console.log(chalk.red('     ERROR: ' + message));
	},

	success: function ( message ) {
		console.log('');
		console.log(chalk.green('   SUCCESS: ' + message));
	}

}
