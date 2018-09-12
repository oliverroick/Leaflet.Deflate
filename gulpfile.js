var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('dist', function() {
  gulp.src('src/L.Deflate.js')
    .pipe(uglify().on('error', function(e){console.log(e);}))
    .pipe(gulp.dest('dist'))
});
