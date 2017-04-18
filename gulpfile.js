var gulp = require('gulp'),
    gutil = require('gulp-util'),
    notify = require("gulp-notify"),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

var sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    autoprefixer = require('gulp-autoprefixer');

var uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    jshintstylish = require('jshint-stylish');

/**
-- Paths
*/
var paths = {
    input: {
        'styles': 'src/styles/**/*.scss',
        'scripts': 'src/scripts/**/*.js'
    },
    output: {
        'build': 'dist',
        'styles': 'dist/styles',
        'scripts': 'dist/scripts'
    }
};

/**
-- Config
*/
var config = {
    sass: {
        errLogToConsole: true,
        outputStyle: 'expanded'
    },
    autoprefixer: {
        browsers: ['last 2 versions', 'IE >= 9'],
        cascade: false
    }
};

var errors = {
    sass: {
        title: 'Sass Error',
        subtitle: '<%= error.relativePath %>:<%= error.line %>',
        message: '<%= error.messageOriginal %>',
        open: 'file://<%= error.file %>',
        onLast: true
    }
};

/**
-- Tasks
*/

// ----------------------------------
// styles
// ----------------------------------
gulp.task('styles:build', function() {
    return gulp
            .src(paths.input.styles)
            .pipe(sourcemaps.init())
            .pipe(sass(config.sass).on('error', notify.onError(errors.sass)))
            .pipe(autoprefixer(config.autoprefixer))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(paths.output.styles));
});

// ----------------------------------
// scripts
// ----------------------------------
gulp.task('scripts:build', function() {
    return gulp
            .src(paths.input.scripts)
            .pipe(sourcemaps.init())
            .pipe(concat('bundle.js'))
            .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(paths.output.scripts));
});

// ----------------------------------
// clean
// ----------------------------------
gulp.task('clean', function() {
    return del([paths.output.build]);
});

// ----------------------------------
// watch
// ----------------------------------
gulp.task('watch', function() {
    // browserSync.init({
    //     server: {
    //         baseDir: "./"
    //     }
    // });

    // gulp.watch(paths.input.scripts, ['scripts:build']).on("change", reload);
    // gulp.watch(paths.input.styles, ['styles:build']).on("change", reload);
    gulp.watch(paths.input.styles, ['styles:build']);
});

// ----------------------------------
// default
// ----------------------------------
gulp.task('default', ['watch']);