const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
 
gulp.task('prefix', () =>
    gulp.src('src/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css/'))
);