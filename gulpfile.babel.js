import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import connect from 'gulp-connect';
import csso from 'gulp-csso';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import util from 'gulp-util';

const config = {
  src: './src/',
  dist: './dist/',

  production: Boolean(util.env.production),

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
function htmlTask() {
  return gulp
    .src(`${config.src}${config.html.path}${config.html.src}`)
    .pipe(gulp.dest(`${config.dist}`));
}

function cssTask() {
  return gulp
    .src(`${config.src}${config.css.path}${config.css.src}`)
    .pipe(plumber())
    .pipe(config.production ? util.noop() : sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(config.production ? csso() : util.noop())
    .pipe(config.production ? util.noop() : sourcemaps.write())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(`${config.dist}${config.css.path}`));
}

function jsTask() {
  return gulp
    .src(`${config.src}${config.js.path}script.js`)
    .pipe(babel())
    .pipe(concat('script.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(config.production ? uglify() : util.noop())
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
    .pipe(gulp.dest(`${config.dist}`));
}

function serverTask() {
  connect.server({
    root: config.dist,
    port: 8000,
    livereload: true,
    host: '0.0.0.0',
  });
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

function watchTask() {
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
}

exports.default = gulp.series(
  gulp.parallel(htmlTask, cssTask, jsTask, imgTask, fontsTask,assetsTask),
  gulp.parallel(serverTask, watchTask),
);
