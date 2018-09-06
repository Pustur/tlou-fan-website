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
};

// HTML task
gulp.task('html', () => (
  gulp.src(`${config.src}${config.html.path}${config.html.src}`)
    .pipe(gulp.dest(`${config.dist}`))
));

// CSS task
gulp.task('css', () => (
  gulp.src(`${config.src}${config.css.path}${config.css.src}`)
    .pipe(plumber())
    .pipe(config.production ? util.noop() : sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(config.production ? csso() : util.noop())
    .pipe(config.production ? util.noop() : sourcemaps.write())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(`${config.dist}${config.css.path}`))
));

// JS task
gulp.task('js', () => (
  gulp.src(`${config.src}${config.js.path}script.js`)
    .pipe(babel())
    .pipe(concat('script.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(config.production ? uglify() : util.noop())
    .pipe(gulp.dest(`${config.dist}${config.js.path}`))
));

// Image task
gulp.task('img', () => (
  gulp.src(`${config.src}${config.img.path}${config.img.src}`)
    .pipe(gulp.dest(`${config.dist}${config.img.path}`))
));

// Fonts task
gulp.task('fonts', () => (
  gulp.src(`${config.src}${config.fonts.path}${config.fonts.src}`)
    .pipe(gulp.dest(`${config.dist}${config.fonts.path}`))
));

// Server task
gulp.task('server', () => {
  connect.server({
    root: config.dist,
    port: 8000,
    livereload: true,
    host: '0.0.0.0',
  });
});

// Reload tasks
gulp.task('reload-html', ['html'], () => (
  gulp.src(`${config.dist}${config.html.reload}`)
    .pipe(connect.reload())
));

gulp.task('reload-css', ['css'], () => (
  gulp.src(`${config.dist}${config.css.reload}`)
    .pipe(connect.reload())
));

gulp.task('reload-js', ['js'], () => (
  gulp.src(`${config.dist}${config.js.reload}`)
    .pipe(connect.reload())
));

// Watch task
gulp.task('watch', () => {
  gulp.watch(`${config.src}${config.html.path}${config.html.watch}`, ['reload-html']);
  gulp.watch(`${config.src}${config.css.path}${config.css.watch}`, ['reload-css']);
  gulp.watch(`${config.src}${config.js.path}${config.js.watch}`, ['reload-js']);
});

// Default task
gulp.task('default', ['html', 'css', 'js', 'img', 'fonts', 'server', 'watch']);
