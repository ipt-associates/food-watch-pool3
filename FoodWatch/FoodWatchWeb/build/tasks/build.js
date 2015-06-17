var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    durandal = require('gulp-durandal');

var paths = require('../paths'); // Custom

gulp.task('build-durandal-app', function () {
    durandal({
        baseDir: paths.appRoot,
        main: 'main.js',
        output: 'main.js',
        almond: true,
        minify: false
    })
    .pipe(gulp.dest(paths.clientOutputDir));
});

// this task calls the clean task (located
// in ./clean.js), then runs the durandal task
// https://www.npmjs.com/package/gulp-run-sequence
gulp.task('build', function (callback) {
    return runSequence(
      'clean',
      'lint',
      ['build-durandal-app'],
      callback
    );
});