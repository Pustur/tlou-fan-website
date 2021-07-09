const { PassThrough } = require('stream');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const csso = require('gulp-csso');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');

// Replacement for gulp-util
const noop = () => new PassThrough({ objectMode: true });

const config = {
  src: './src/',
  dist: './dist/',

  production: process.env.NODE_ENV === 'production',

  html: {
    path: 'html/',
    watch: '**/*.html',
    src: '**/*.html',
    reload: '**/*.html',
  },

  css: {
    path: 'css/',
    watch: '**/*.{scss,css}',
    src: '**/!(_)*.{scss,css}',
    reload: '**/*.css',
    vendor: 'vendor/',
  },

  js: {
    path: 'js/',
    watch: '**/*.js',
    src: '**/!(_)*.js',
    reload: '**/*.js',
  },

  img: {
    path: 'img/',
    src: '**/*.{gif,jpeg,jpg,png,svg,webp}',
  },

  fonts: {
    path: 'fonts/',
    src: '**/*.{eot,otf,svg,ttf,woff,woff2}',
  },

  assets: {
    path: 'assets/',
    src: '**/*',
  },
};

// Task functions
function cleanTask() {
  return gulp.src(config.dist, { read: false, allowEmpty: true }).pipe(clean());
}

function htmlTask() {
  return gulp
    .src(`${config.src}${config.html.path}${config.html.src}`)
    .pipe(config.production ? htmlmin({ collapseWhitespace: true }) : noop())
    .pipe(gulp.dest(config.dist));
}

function cssTask() {
  return gulp
    .src(`${config.src}${config.css.path}${config.css.src}`)
    .pipe(plumber())
    .pipe(config.production ? noop() : sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(config.production ? csso() : noop())
    .pipe(config.production ? noop() : sourcemaps.write())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(`${config.dist}${config.css.path}`));
}

function jsTask() {
  return gulp
    .src(`${config.src}${config.js.path}script.js`)
    .pipe(concat('script.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(config.production ? terser() : noop())
    .pipe(gulp.dest(`${config.dist}${config.js.path}`));
}

function imgTask() {
  return gulp
    .src(`${config.src}${config.img.path}${config.img.src}`)
    .pipe(gulp.dest(`${config.dist}${config.img.path}`));
}

function fontsTask() {
  return gulp
    .src(`${config.src}${config.fonts.path}${config.fonts.src}`)
    .pipe(gulp.dest(`${config.dist}${config.fonts.path}`));
}

function assetsTask() {
  return gulp
    .src(`${config.src}${config.assets.path}${config.assets.src}`)
    .pipe(gulp.dest(config.dist));
}

function serverTask(done) {
  connect.server({
    root: config.dist,
    port: 8000,
    livereload: true,
    host: '0.0.0.0',
  });
  done();
}

function reloadHtmlTask() {
  return gulp.src(`${config.dist}${config.html.reload}`).pipe(connect.reload());
}

function reloadCssTask() {
  return gulp.src(`${config.dist}${config.css.reload}`).pipe(connect.reload());
}

function reloadJsTask() {
  return gulp.src(`${config.dist}${config.js.reload}`).pipe(connect.reload());
}

function watchTask(done) {
  gulp.watch(
    `${config.src}${config.html.path}${config.html.watch}`,
    gulp.series(htmlTask, reloadHtmlTask),
  );
  gulp.watch(
    `${config.src}${config.css.path}${config.css.watch}`,
    gulp.series(cssTask, reloadCssTask),
  );
  gulp.watch(
    `${config.src}${config.js.path}${config.js.watch}`,
    gulp.series(jsTask, reloadJsTask),
  );
  done();
}

exports.build = gulp.series(
  cleanTask,
  gulp.parallel(htmlTask, cssTask, jsTask, imgTask, fontsTask, assetsTask),
);

exports.default = gulp.series(
  cleanTask,
  gulp.parallel(htmlTask, cssTask, jsTask, imgTask, fontsTask, assetsTask),
  gulp.parallel(serverTask, watchTask),
);
