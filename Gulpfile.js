var gulp = require( 'gulp' );
var sourcemaps = require( 'gulp-sourcemaps' );
var sass = require( 'gulp-sass' );
var csso = require( 'gulp-csso' );
var concat = require( 'gulp-concat' );
var uglify = require( 'gulp-uglifyjs' );
var notify = require( "gulp-notify" );
var connect = require( 'gulp-connect' );
var rename = require( 'gulp-rename' );

var jslib = [
    'node_modules/angular/angular.js'
];
var jsapp = [
    'src/js/**/*.js'
];
var css = [
    'node_modules/font-awesome/css/font-awesome.min.css'
    , 'node_modules/normalize.css/normalize.css'
    , 'css/css.css'
];

gulp.task( 'sass', function() {
    return gulp.src( 'src/sass/css.scss' ).pipe( sourcemaps.init() ).pipe( sass().on( 'error', sass.logError ) ).pipe( csso() ).pipe( rename( 'css.css' ) ).pipe( sourcemaps.write( undefined, { sourceRoot: null } ) ).pipe( gulp.dest( 'css/' ) );
} );

gulp.task( 'cssconcat', ['sass'], function() {
    return gulp.src( css ).pipe( concat( 'css.min.css' ) ).pipe( csso( {
        restructure: false,
        sourceMap: true,
        debug: false
    } ) ).pipe( gulp.dest( 'css/' ) );
} );

gulp.task( 'jsconcat', function() {
    return gulp.src( jslib ).pipe( concat( 'jslib.js' ) ).pipe( gulp.dest( 'js/' ) );
} );
gulp.task( 'jsapp', function() {
    return gulp.src( jsapp ).pipe( sourcemaps.init() ).pipe( concat( 'jsapp.js' ) ).pipe( sourcemaps.write( '.' ) ).pipe( gulp.dest( 'js/' ) );
} );

gulp.task( 'connect', function() {
    connect.server( {
        port: 9080,
        livereload: true
    } );
} );

gulp.task( 'ccreload', function() {
    return gulp.src( ['index.html', 'src/**/*.html', 'css/css.min.css', 'js/jslib.js', 'js/jsapp.js'] ).pipe( connect.reload() );
} );

gulp.task( 'watch', function() {
    gulp.watch( 'src/sass/**/*.scss', ['cssconcat'] ).on( 'change', function() {
        notify( {
            message: 'CSS changed... running watch task.',
            title: 'CC Gulp CSS'
        } ).write( '' );
    } );
    gulp.watch( jslib, ['jsconcat'] ).on( 'change', function() {
        notify( {
            message: 'JS Lib changed... running watch task.',
            title: 'CC Gulp JSLIB'
        } ).write( '' );
    } );
    gulp.watch( jsapp, ['jsapp'] ).on( 'change', function() {
        notify( {
            message: 'JS App changed... running watch task.',
            title: 'CC Gulp JSAPP'
        } ).write( '' );
    } );
    gulp.watch( ['index.html', 'css/css.min.css', 'js/jslib.js', 'js/jsapp.js'], ['ccreload'] ).on( 'change', function() {
        notify( {
            message: 'Artifacts changed... reloading the app',
            title: 'CC reload'
        } ).write( '' );
    } );
} );

gulp.task( 'default', ['cssconcat', 'jsconcat', 'jsapp', 'watch', 'connect'], function() {
    notify( {
        message: 'All tasks have been completed.',
        title: 'CC Gulp'
    } ).write( '' );
} );