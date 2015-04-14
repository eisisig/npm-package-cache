var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('default', ['babel'], function () {});

gulp.task('dev', ['babel', 'watch'], function () {});

gulp.task('babel', function () {
	return gulp.src('lib/*')
		.pipe(babel())
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
	gulp.watch('lib/*', ['babel']);
});
