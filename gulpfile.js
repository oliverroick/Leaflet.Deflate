var gulp = require('gulp');
var uglify = require('gulp-uglify');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

gulp.task('dist', function() {
  gulp.src('src/L.Deflate.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});

gulp.task('test', function () {
    return gulp
    .src('tests/testrunner.html')
    .pipe(mochaPhantomJS());
});
