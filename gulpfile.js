var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var coffee = require('gulp-coffee');
var replace = require('gulp-replace-task');
var path = require('path');

var paths = {
  sass: ['./www/**/*.scss'],
  coffee: ['./www/**/*.coffee'],
  html: path.join(__dirname, 'www', 'index.html'),
  www: path.join(__dirname, 'platforms/android/assets/', 'www')
};

function handleError(error) {
  var displayErr = gutil.colors.red(error);
  gutil.log(displayErr);
  process.exit(1);
}

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./www/sass/**.scss')
    .pipe(sass({ errLogToConsole: true}))
    .pipe(rename({ extname: '.css' }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./www/css'))
    .on('end', done);
});

gulp.task('coffee', function(done) {
  gulp.src(paths.coffee)
  .pipe(coffee({bare: true}).on('error', handleError))
  .pipe(concat('application.js'))
  .pipe(gulp.dest('./www/js'))
  .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']).on('error', handleError);
  gulp.watch(paths.coffee, ['coffee']).on('error', handleError);
});

gulp.task('spawn-watch', function() {
  var spawnWatch = function() {
    var proc = require('child_process').spawn('gulp', ['watch'], {stdio: 'inherit'});
    proc.on('close', function (code) {
      spawnWatch();
    });
  };
  spawnWatch();
});

var devServerHost = require('ip').address();

gulp.task('html', function() {
  gulp.src(paths.html)
  .pipe(replace({
    patterns: [
      {
        match: /<head>/,
        replacement: "" +
          "<head>\n" +
          "<script type=\"text/javascript\">\n" +
          "var __devSite = 'http://" + "192.168.1.43" + ":8100';\n" +
          "if (window.location.origin !== __devSite) {\n" +
            "window.location = __devSite;\n" +
          "}\n" +
          "</script>"
      }
    ]
  }
  )).pipe(gulp.dest(paths.www));
});

gulp.task('default', ['spawn-watch']);
