
const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const electron = require('gulp-run-electron');

var requiredDefaultTasks = [
  'build-js',
  'build-html',
  'build-node-modules',
  'build-resources',
  'build-misc'
];

gulp.task('default', requiredDefaultTasks, () => {
  return gulp
    .src('build')
    .pipe(electron());
});

gulp.task('run', () => {
  return gulp
    .src('build')
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
    .pipe(gulp.dest('build/src'));
});

gulp.task('build-html', () => {
  return gulp
    .src('src/**/*.html')
    .pipe(gulp.dest('build/src'));
});

gulp.task('build-node-modules', () => {
  return gulp
    .src('node_modules/**/*')
    .pipe(gulp.dest('build/node_modules'));
});

gulp.task('build-resources', () => {
  return gulp
    .src('resources/**/*')
    .pipe(gulp.dest('build/resources'));
});

gulp.task('build-misc', () => {
  return gulp
    .src(['package.json', 'README.md', 'LICENSE'])
    .pipe(gulp.dest('build'));
});
