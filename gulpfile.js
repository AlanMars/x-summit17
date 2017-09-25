var gulp = require("gulp");
var browserSync = require('browser-sync');

var baseDirectory = './';

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        notify: false,
        proxy: "localhost:5000"
    });
});

gulp.task('bs-reload', function() {
    browserSync.reload();
});

gulp.task('default', ['browser-sync'], function() {
    gulp.watch(baseDirectory + "/**/*.html", ['bs-reload']);
});
