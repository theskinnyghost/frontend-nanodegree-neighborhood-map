var gulp = require('gulp'),
    gutil = require('gulp-util'),
    notify = require("gulp-notify"),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    runSequence = require('run-sequence'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify');

/**
-- Paths
*/
var paths = {
    bower   : 'bower_components',
    source  : 'src',
    build   : 'dist',
    input   : {
        'styles'    : 'src/styles/**/*.scss',
        'scripts'   : 'src/scripts/**/*.js',
        'images'    : 'src/images/**/*',
        'fonts'     : 'bower_components/font-awesome/fonts/**/*'
    },
    output  : {
        'styles'    : 'dist/styles',
        'scripts'   : 'dist/scripts',
        'images'    : 'dist/images',
        'fonts'     : 'dist/fonts'
    }
};

/**
-- Config
*/
var config = {
    production: !!gutil.env.production,
    plugins: {
        sass: {
            errLogToConsole: true,
            outputStyle: 'expanded'
        },
        autoprefixer: {
            browsers: ['> 1%'],
            cascade: false
        },
        imagemin: {
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        },
        csso: {
            sourceMap: true,
        }
    },
    bundleStyles: [
        paths.bower + '/normalize-css/normalize.css',
        paths.bower + '/font-awesome/css/font-awesome.css',
        'src/styles/app.scss',
    ],
    bundleScripts: [
        "bower_components/jQuery/dist/jquery.min.js",
        "bower_components/knockout/dist/knockout.js",
        "src/scripts/Model.js",
        "src/scripts/TattooShop.js",
        "src/scripts/ViewModel.js",
        "src/scripts/App.js"
    ],
    errors: {
        sass: {
            title: 'Sass Error',
            subtitle: '<%= error.relativePath %>:<%= error.line %>',
            message: '<%= error.messageOriginal %>',
            open: 'file://<%= error.file %>',
            onLast: true
        }
    },
    notify: {
        scripts: { message: 'Scripts task complete' },
        images: { message: 'Images task complete' },
        styles: { message: 'Styles task complete' },
        fonts: { message: 'Fonts task complete.' }
    }
};

/**
-- Tasks
*/

// ----------------------------------
// styles
// ----------------------------------
gulp.task('styles', function() {
    return gulp
            .src(config.bundleStyles)
            .pipe(!config.production ? sourcemaps.init() : gutil.noop())
            .pipe(concat('app.css'))
            .pipe(sass(config.plugins.sass).on('error', notify.onError(config.errors.sass)))
            .pipe(autoprefixer(config.plugins.autoprefixer))
            .pipe(csso(config.plugins.csso))
            .pipe(!config.production ? sourcemaps.write('.') : gutil.noop())
            .pipe(gulp.dest(paths.output.styles))
            .pipe(notify(config.notify.styles));
});

// ----------------------------------
// scripts
// ----------------------------------
gulp.task('scripts', function() {
    return gulp
            .src(config.bundleScripts)
            .pipe(!config.production ? sourcemaps.init() : gutil.noop())
            .pipe(concat('app.js'))
            .pipe(uglify())
            .pipe(!config.production ? sourcemaps.write('.') : gutil.noop())
            .pipe(gulp.dest(paths.output.scripts))
            .pipe(notify(config.notify.scripts));
});

// ----------------------------------
// images
// ----------------------------------
gulp.task('images', function() {
    return gulp
            .src(paths.input.images)
            .pipe(cache(imagemin(config.plugins.imagemin)))
            .pipe(gulp.dest(paths.output.images))
            .pipe(notify(config.notify.images));
});

// ----------------------------------
// fonts
// ----------------------------------
gulp.task('fonts', function() {
    return gulp
            .src(paths.input.fonts)
            .pipe(gulp.dest(paths.output.fonts))
            .pipe(notify(config.notify.fonts));
});

// ----------------------------------
// clean
// ----------------------------------
gulp.task('clean', function() {
    return del([paths.build]);
});

// ----------------------------------
// watch
// ----------------------------------
gulp.task('watch', function() {
    gulp.watch(paths.input.scripts, ['scripts']);
    gulp.watch(paths.input.styles, ['styles']);
    gulp.watch(paths.input.images, ['images']);
});

// ----------------------------------
// build
// pass --production to build production ready assets
// ----------------------------------
gulp.task('build', function() {
    runSequence(
        'clean',
        'styles',
        'scripts',
        'images',
        'fonts'
    );
});

// ----------------------------------
// default
// ----------------------------------
gulp.task('default', ['build']);