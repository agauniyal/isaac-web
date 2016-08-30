const fs = require('fs');
const request = require('request');
const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const formatter = require('perfectionist');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const eol = require('gulp-eol');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();

gulp.task('default', ['serve'], function() {});


gulp.task('down-purecss', function() {
  try {
    fs.accessSync('css/pure.css', fs.F_OK);
  } catch (e) {
    return request('http://yui.yahooapis.com/pure/0.6.0/pure-min.css')
      .pipe(fs.createWriteStream('css/pure.css'));
  }
});


gulp.task('down-purecss-grids', function() {
  try {
    fs.accessSync('css/pure-grids.css', fs.F_OK);
  } catch (e) {
    return request('http://yui.yahooapis.com/pure/0.6.0/grids-responsive-min.css')
      .pipe(fs.createWriteStream('css/pure-grids.css'));
  }
});


gulp.task('clean', ['down-purecss', 'down-purecss-grids'], function() {
  return del([
    'assets/min/**/*',
    'css/**/*',
    '!css/pure.css',
    '!css/pure-grids.css'
  ]);
});


gulp.task('sass', ['clean'], function() {

  const processors = [
    autoprefixer({
      browsers: ['last 2 version']
    }),
    formatter
  ];

  return gulp.src('src/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(sourcemaps.write())
    .pipe(eol())
    .pipe(gulp.dest('css'));
});


gulp.task('css-min', ['sass'], function() {

  return gulp.src(['css/pure.css', 'css/pure-grids.css', 'css/**/*.css'])
    .pipe(postcss([cssnano()]))
    .pipe(concat('min.css'))
    .pipe(gulp.dest('./assets/css'));
});


gulp.task('serve', ['css-min'], function() {

  browserSync.init({
    server: true,
    port: 8080,
    logConnections: true,
    tunnel: 'isaacweb',
    reloadOnRestart: true,
    notify: false
  });

  gulp.watch('src/**/*.scss', ['css-min']).on('change', browserSync.reload);
  gulp.watch('./**/*.html').on('change', browserSync.reload);
});
