var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var coffee = require('gulp-coffee');

var paths = {
  sass: ['./www/**/*.scss'],
  coffee: ['./www/**/*.coffee']
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

gulp.task('default', ['spawn-watch']);
