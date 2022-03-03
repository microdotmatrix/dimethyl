const gulp = require("gulp");
const { parallel } = require("gulp");
const sass = require('gulp-sass')(require('node-sass'));
const cleancss = require('gulp-clean-css');
const csscomb = require('gulp-csscomb');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

function build() {
  return gulp
    .src('scss/*.scss')
    .pipe(sass({outputStyle: 'compact', precision: 10})
      .on('error', sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest('css/'))
    .pipe(cleancss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('css/'));
}

function watch() {
  gulp.watch('./**/*.scss', parallel(build));
}

exports.watch = watch;
exports.build = build;
exports.default = build;