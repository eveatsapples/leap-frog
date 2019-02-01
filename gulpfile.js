const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const pump = require('pump');

gulp.task('prefix', () =>
    gulp.src('src/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css/'))
);
 
gulp.task('minify-css', () => {
    return gulp.src('dist/css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('img-min', () =>
    gulp.src('src/images/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('dist/images/'))
);
 
gulp.task('transpile-js', () =>
    gulp.src('src/js/app.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('src/js/transpiled/'))
);

gulp.task('concat-js', function() {
    return gulp.src(['src/js/resources.js', 'src/js/transpiled/app.js', 'src/js/engine.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('src/js/'));
});

gulp.task('compress', function (cb) {
    pump([
        gulp.src('src/js/all.js'),
        uglify(),
        gulp.dest('dist/js/')
        ],
        cb
    );
});

gulp.task('copy', () => {
    gulp.src('src/index.html')
    .pipe(gulp.dest('dist/'))   
})

gulp.task('default', () => {
    gulp.watch('src/css/*.css', ['prefix']);
    gulp.watch('src/',[]);
    gulp.watch('',[]);
    gulp.watch('',[]);
    gulp.watch('',[]);
    gulp.watch('',[]);
})
