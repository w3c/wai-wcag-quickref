var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var cssnano =require('gulp-cssnano');
var plumber =require('gulp-plumber');
var uglify = require('gulp-uglify');
var pxtorem = require('gulp-pxtorem');
var jshint = require('gulp-jshint');

var sassdir = "_scss/**/*.scss";

gulp.task('scss', function () {
    return gulp.src(sassdir)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(pxtorem())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./css/'))
        .pipe(cssnano({safe: true, stripWWW: false}))
        .pipe(concat('styles.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css/'));
});

var jsdir = "_js/*.js";

gulp.task('lint', function() {
  return gulp.src(['_js/script.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('js', gulp.series('lint', function () {
    return gulp.src(['_js/jquery.min.js', '_js/svg4everybody.js', '_js/bootstrap.js', '_js/uri.js', '_js/history.js', '_js/sharebox.js', '_js/script.js'])
        .pipe(plumber())
        //.pipe(sourcemaps.init())
        .pipe(concat('script.js', {newline: ';'}))
        .pipe(uglify())
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./js/'));
}));

gulp.task('watch', function() {
  var watcher = gulp.watch([sassdir, jsdir], gulp.parallel('scss', 'js'));
  watcher.on('change', function(path, stats) {
    console.log('File ' + path + ' was changed');
  });

  watcher.on('unlink', function(path) {
    console.log('File ' + path + ' was removed');
  });
});