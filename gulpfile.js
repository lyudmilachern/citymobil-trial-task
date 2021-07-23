const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const reload      = browserSync.reload;

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(['**/*.html', '**/*.css', '**/*.js']).on('change', reload);
});