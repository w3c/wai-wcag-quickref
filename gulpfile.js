var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

var sassdir = "_scss/*.scss";

gulp.task('default', function () {
    return gulp.src(sassdir)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(gulp.dest('./css/'))
        .pipe(autoprefixer())
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./css/'));
});
});