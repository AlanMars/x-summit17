var gulp = require("gulp");
var concat = require("gulp-concat");
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');

var sassSources = './components/sass';
var scriptSources = './components/scripts';

var cssDestination = './static/css';
var jsDestination = './static/js';
var baseDirectory = './';


gulp.task('css', function () {
    return gulp.src(sassSources + '/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(cssDestination))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('js', function () {
    gulp.src(scriptSources + '/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jsDestination))
        .pipe(browserSync.reload({
            stream: true,
            once: true
        }));
});

gulp.task('browser-sync', function () {
    browserSync.init(null, {
        notify: false,
        proxy: "localhost:5000"
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['css', 'js', 'browser-sync'], function () {
    gulp.watch(sassSources + "/**/*.scss", ['css']);
    gulp.watch(scriptSources + "/**/*.js", ['js']);
    gulp.watch(baseDirectory + "/**/*.html", ['bs-reload']);
});
