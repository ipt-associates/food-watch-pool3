var gulp = require('gulp'),
    del = require('del'),
    vinylPaths = require('vinyl-paths'),
    paths = require('../paths');

// deletes all files in the output path
gulp.task('clean', function () {
    return gulp.src([paths.clientOutputDir])
      .pipe(vinylPaths(del));
});