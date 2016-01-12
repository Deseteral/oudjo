const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const electron = require('gulp-run-electron');

gulp.task('default', ['build-js', 'build-html'], () => {
  return gulp
    .src('.')
    .pipe(electron());
});

gulp.task('build-js', () => {
  return gulp
    .src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'));
});

gulp.task('build-html', () => {
  return gulp
    .src('src/**/*.html')
    .pipe(gulp.dest('build'));
});
