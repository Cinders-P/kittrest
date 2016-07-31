const gulp = require('gulp');

const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');


gulp.task('build', function () {
	// app.js is your main JS file with all your module inclusions
	return browserify({
		entries: './src/main.jsx',
		debug: true,
	})
		.transform('babelify', {
			presets: ['es2015', 'es2016', 'react', 'stage-0'],
		})
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./static'));
});

gulp.task('watch', ['build'], function () {
	gulp.watch('./src/**', ['build']);
});

gulp.task('default', ['watch']);
