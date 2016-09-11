const gulp = require('gulp');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const formatter = require('perfectionist');
const autoprefixer = require('autoprefixer');
const del = require('del');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

gulp.task('default', ['serve'], function() {});


gulp.task('clean', function() {
  return del(['assets/css/**/*', 'assets/scripts/**/*', 'css/**/*']);
});


gulp.task('home-css-minify', ['clean'], function() {

  const processors = [
    autoprefixer({
      browsers: ['last 2 version']
    }),
    formatter
  ];

  return gulp.src(['src/styles/home.css', 'src/styles/perfect-scrollbar.css'])
    .pipe(concat('home.min.css'))
    .pipe(postcss(processors))
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest('./assets/css'));
});


gulp.task('home-js-minify', ['clean'], function() {
  return gulp.src(['src/scripts/gh.min.js', 'src/scripts/homepage.js'])
    .pipe(concat('home.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./assets/scripts'));
});


gulp.task('serve', ['home-css-minify', 'home-js-minify'], function() {

  browserSync.init({
    server: true,
    port: 8080,
    logConnections: true,
    tunnel: 'isaacweb',
    reloadOnRestart: true,
    notify: false
  });

  gulp.watch('src/styles/**/*.css', ['home-css-minify']).on('change', browserSync.reload);
  gulp.watch('src/scripts/**/*.js', ['home-js-minify']).on('change', browserSync.reload);
  gulp.watch('./**/*.html').on('change', browserSync.reload);
});
