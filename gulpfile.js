var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var minifyCss =require('gulp-minify-css');
var plumber =require('gulp-plumber');
var uglify = require('gulp-uglify');

var sassdir = "_scss/**/*.scss";

gulp.task('scss', function () {
    return gulp.src(sassdir)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(gulp.dest('./css/'))
        .pipe(autoprefixer())
        .pipe(concat('styles.css'))
        .pipe(minifyCss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./css/'));
});

var jsdir = "_js/*.js";

gulp.task('js', function () {
/*    return gulp.src(['_js/jquery.min.js', '_/js/bootstrap.min.js', '_/js/highlight.jquery.js', '_/js/uri.js', '_/js/history.js', '_/js/fixedsticky.jquery.js', '_/js/sharebox.js', '_/js/script.js'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./js/'));*/
});

gulp.task('watch', function() {
  var watcher = gulp.watch([sassdir, jsdir], ['scss', 'js']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});