'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const electron = require('gulp-run-electron');

let requiredDefaultTasks = [
  'build-js',
  'build-html',
  'build-misc'
];

gulp.task('default', requiredDefaultTasks, () => {
  return gulp
    .src('build')
    .pipe(electron());
});

// Run the app without rebuilding
gulp.task('run', () => {
  return gulp
    .src('build')
    .pipe(electron());
});

gulp.task('build-js', () => {
  return gulp
    .src('app/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/app'));
});

gulp.task('build-html', () => {
  return gulp
    .src('app/**/*.html')
    .pipe(gulp.dest('build/app'));
});

// This will also copy dev dependencies
// and that's unnecessary
// TODO: Install non dev dependencies only
gulp.task('build-node-modules', () => {
  return gulp
    .src('node_modules/**/*')
    .pipe(gulp.dest('build/node_modules'));
});

gulp.task('build-bower-components', () => {
  return gulp
    .src('bower_components/**/*')
    .pipe(gulp.dest('build/app/bower_components'));
});

gulp.task('build-misc', () => {
  return gulp
    .src(['package.json', 'README.md', 'LICENSE'])
    .pipe(gulp.dest('build'));
});
