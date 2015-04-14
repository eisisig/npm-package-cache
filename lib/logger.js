import chalk from 'chalk';

export default class Logger {

	static info ( message ) {
		console.log('');
		console.log(chalk.cyan('      INFO: ' + message));
	}

	static error ( message ) {
		console.log('');
		console.log(chalk.red('     ERROR: ' + message));
	}

	static success ( message ) {
		console.log('');
		console.log(chalk.green('   SUCCESS: ' + message));
	}

}
