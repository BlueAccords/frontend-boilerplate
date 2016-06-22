// Gulp file to run tasks

/*
===========================================================================================
===========================================================================================
* CHANGE THESE THREE DIRECTORIES IF NEEDED
===========================================================================================
===========================================================================================

*/
// Primary development/source files directory
// You will be editing these files
var devDir = 'src';

// Production files directory
// Compiled for production
// You will NOT be editing these files
var prodDir = 'dist';

// Temporary files directory
// default action by gulp
// Browsersync hosts these files locally for you during development
// compiled during development
// You will NOT be editing these files
var tempDir = 'tmp';

/*
===========================================================================================
===========================================================================================
* CHANGE THESE THREE DIRECTORIES IF NEEDED 
===========================================================================================
===========================================================================================
*/

// MAIN GULP FUNCTION

// gulp
// 
// gulp default(ran by default using just "gulp")
// Hosts a server using development files
// Watches scss/html/js files for changes and reloads browsers upon changes
// compiles sass to css/nunjucks to html and refreshes development server
// outputs files to "tmp" folder

// gulp clean:cache 
// Cleans image cache

// gulp clean:dist
// Cleans production files

// gulp build
//
// Cleans production files
// Compiles sass into css
// Minify/Concatenates js/css files
// Optimizes/Compresses Images
// Moves font files to dist(production) folder
// Moves all other files into dist(production) folder

// gulp build:server
//
// Runs gulp build
// Hosts a server via browser-sync

// Node module requirements
var gulp        = require('gulp');

// Used to compile scss/sass to css
var sass        = require('gulp-sass');

// Used to refresh browsers upon change and host server for static site
var browserSync = require('browser-sync').create();

// Used to concatenate js/css files (configure which ones in the html files themselves)
var useref      = require('gulp-useref');

// Used to minify js files
var uglify      = require('gulp-uglify');

// Used to only run gulp tasks under certain conditions
var gulpIf     = require('gulp-if');

// Used to minify css files
var cssnano     = require('gulp-cssnano');

// Used to compress/optimize images
var imagemin    = require('gulp-imagemin');

// Used to cache images so they aren't recompressed unnecessarily
var cache       = require('gulp-cache');

// Used to clean up files before the gulp tasks are ran
var del         = require('del');

// Used to run tasks synchronously
var runSync     = require('run-sequence');

// Source maps for debugging live css/js
var sourcemaps  = require('gulp-sourcemaps');

// Auto prefixer for css prefixes
var autoprefixer = require('gulp-autoprefixer');

// Used to render nunjucks templating language files as html
var nunjucksRender = require('gulp-nunjucks-render');

// Used pipe json data into nunjucks template pages
var dataPipe = require('gulp-data');

// Used to sync local changes to deployment server
var rsync  = require('gulp-rsync');

// config file
var config = require('./gulp-config.js')

// ============================== Config Options ==============================

// sass compiling options
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

// sass production options
var sassProdOptions = { outputStyle: 'compressed' };

// Source maps destination(relative to sass files), optional
var sMapOutput = './maps'

// Development paths for all the main html/js/sass/scss and image files
var cssPath  = './' + devDir + '/**/*.css';

// original variable compiles all sass files
// new variable only compiles main.scss which imports all other files anyways
// var sassPath = './app/scss/**/*.+(scss|sass)';
var sassPath = './' + devDir + '/scss/main.+(scss|sass)'
var sassWatchPath = './' + devDir + '/scss/**/*.+(scss|sass)';

var htmlPath = './' + devDir + '/*.html';
var jsPath   = './' + devDir + '/js/**/*.js';
var imgPath  = './' + devDir + '/images/**/*.+(jpg|jpeg|png|svg|gif)';
var fontsPath = './' + devDir + '/fonts/**/*';
var nunjucksPath = './' + devDir + '/pages/**/*.+(html|nunjucks)';
var nunjucksTemplatePath = './' + devDir + '/templates/**/*.+(html|nunjucks)';

// Images Paths
var outputDevImgPath = './' + tempDir + '/images';
var outputProdImgPath = './' + prodDir + '/images';

// Fonts Paths
var outputDevFontsPath = './' + tempDir + '/fonts';
var outputProdFontsPath = './' + prodDir + '/fonts'

// Nunjucks Render options
var nunjucksOptions = {
  // Path to set where to look for templates
  path: ['./' + devDir + '/templates'],
}

// Data to pipe into nunjucks pages
var dataPipePath = './' + devDir + '/data.json';

// Imagemin optimization options
var imageminOptions = {
  optimizationLevel : 3,     // default of 3, range 1-7
  progressive       : true, // jpg, progressive conversoin vs lossless(false) by default
  interlaced        : true, // gif, Interlace gif for progressive rendering
  multipass         : false, // svg, Optimize svg multiple times until it's fully optimized.
};

// Autoprefixer options
// Defaults:
// Browsers with over 1% market share,
// Last 2 versions of all browsers,
// Firefox ESR,
// Opera 12.1
// More info here
// https://github.com/ai/browserslist#queries
var autoprefixerOptions = {
   browsers: ['last 2 versions', '> 2%', 'Firefox ESR']
}


// ============================== End Options ================================

// Renders nunjucks files
// Sets "main" directory for nunjucks pages so paths to get partials/macros
// is set to app/templates
gulp.task('nunjucks', function() {
  return gulp.src(nunjucksPath)

  // Pipe json data to nunjucks templates
  .pipe(dataPipe(function() {
    return require(dataPipePath)
  }))

  // render templates with nunjucks
  .pipe(nunjucksRender(nunjucksOptions))

  // outputs files to app folder
  .pipe(gulp.dest(tempDir + '/'))

  // Reloads browsersync
  .pipe(browserSync.reload({ // browserSync reloads the browser/devices
      stream: true
    }))
});

// Compiles scss into css for development folder
// adds source maps
// adds vendor prefixes automatically
// reloads browsersync
// More options here:
// https://github.com/sass/node-sass#options
gulp.task('sass', function() {
  // Matches any scss/sass files in the scss directory and its child directories
  return gulp.src(sassPath)
    .pipe(sourcemaps.init()) // initialize sourcemaps
    .pipe(sass(sassOptions).on('error', sass.logError)) // convert to css from sass
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write('../maps')) // write source maps inline(by default) or to relative path of gulp.dest
    .pipe(gulp.dest(tempDir + '/css')) // output to app/css folder
    .pipe(browserSync.reload({ // browserSync reloads the browser/devices
      stream: true
    }))
});

// compile sass without source maps
gulp.task('sass:prod', function() {
  // Matches any scss/sass files in the scss directory and its child directories
  return gulp.src(sassPath)
    .pipe(sass(sassProdOptions)) // convert to css from sass
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(prodDir + '/css')) // output to app/css folder
    .pipe(browserSync.reload({ // browserSync reloads the browser/devices
      stream: true
    }))
});


// Main watch function, to watch multiple files and run multiple tasks
// Run browserSync before watching files for changes
// Run Sass before starting to watch for changes 
gulp.task('watch', ['browserSync', 'sass'], function() {

  // Watches the scss directory for changes and runs the sass task
  gulp.watch(sassWatchPath, ['sass']);

  // Watch html/js files for changes and reloads the browser
  gulp.watch(nunjucksPath, ['nunjucks', browserSync.reload]);
  gulp.watch(nunjucksTemplatePath, ['nunjucks', browserSync.reload]);
  // If using nunjucks, editing plain html isn't needed
  // gulp.watch(htmlPath, browserSync.reload);
  gulp.watch(jsPath, browserSync.reload)
  
  // log a message in the console on change
  .on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

});

// Browser sync server/auto refresh browsers and devices
// More options here
// https://www.browsersync.io/docs/gulp/
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: tempDir
    },
  })
});

// Browser sync server for production files
gulp.task('browserSyncDist', function() {
  console.log('running dist server');
  browserSync.init({
    server: {
      baseDir: prodDir
    },
  })
});

// Gets the js and css files linked in all the html files under app
// concatenates them and outputs them to the production folder(dist)
// under dist/js/main.min.js and dist/css/styles.min.css
//
// Also, turns the js and css comment block links in html into 
// a single js and css file requirement
// 
// More options here
// 
// js minify
// https://github.com/jonkemp/gulp-useref
// 
// css minify
// https://www.npmjs.com/package/gulp-cssnano
gulp.task('minify', function() {
  return gulp.src(htmlPath)
    .pipe(useref())
    // Only uglifies/minifies if it's a js file
    .pipe(gulpIf('*.js', uglify()))

    // Only uglifies/minifies if it's a css file
    .pipe(gulpIf('*.css', cssnano()))

    // outputs to dist/production folder
    .pipe(gulp.dest(prodDir))
});

// transfer images from dev folder to temp development folder to host on local server
gulp.task('images:dev', function() {
  return gulp.src(imgPath)
    .pipe(cache(imagemin(imageminOptions)))
    .pipe(gulp.dest(outputDevImgPath))
});

// Optimize/compress images using gulp-imagemin
// Outputs the files to production images folder
// 
// More info here
// https://github.com/sindresorhus/gulp-imagemin
gulp.task('images:prod', function() {
  // Gets all the images files in the images folder
  return gulp.src(imgPath)

    // uses gulp-imageMin to optimize/compress images
    // Currently set to default values of false/3
    // Cache makes sure imagemin is only ran on changed files
    .pipe(cache(imagemin(imageminOptions)))

    // Outputs to the production images folder
    .pipe(gulp.dest(outputProdImgPath))
});

// auto prefixer to add css prefixes
// https://github.com/ai/browserslist#queries
gulp.task('prefix', function() {
  gulp.src(cssPath)
})

// Transfer font file to temp dev directory
gulp.task('fonts:dev', function() {
  return gulp.src(fontsPath)
    .pipe(gulp.dest(outputDevFontsPath))
});

// Transfer font files from dev to production
gulp.task('fonts:prod', function() {
  return gulp.src(fontsPath)
    .pipe(gulp.dest(outputProdFontsPath))
});

// Delete production files before tasks are ran
gulp.task('clean:dist', function() {
  return del.sync(prodDir)
});

// Delete tmp dev files
gulp.task('clean:dev', function() {
  return del.sync(tempDir)
});

// Used to clear images cache on local filesystem
gulp.task('clean:cache', function (cb) {
  return cache.clearAll(cb)
});


// Build system, cleans production folder, compiles nunjucks files,minify/concat files, compile sass
// optimize images, move fonts from dev to production folder
gulp.task('build', function(callback) {
  // runSync used to clean dist folder FIRST THEN moves all files there
  // css files need to be compiled first THEN html generated THEN minification
  runSync('clean:dist', 'sass:prod', 'nunjucks',
    ['minify', 'images:prod', 'fonts:prod'], 
    callback)
});

// Build everything to production then run a server using the production files
gulp.task('build:server', function(callback) {
  // runSync used to clean dist folder FIRST THEN moves all files there
  runSync('clean:dist', 'sass:prod', 'nunjucks',
    ['minify', 'images:prod', 'fonts:prod'], 
    'browserSyncDist', 
    callback)
});

gulp.task('build:deploy', function(callback) {
  runSync('clean:dist',
    ['nunjucks', 'sass:prod', 'minify', 'images:prod', 'fonts:prod'], 
    'rsync', 
    callback)
})


// Copy files and folder to server
// via rsync
// prompts for password
gulp.task('rsync', function() {
  return gulp.src(config.rsync.src)
    .pipe(rsync(config.rsync.options));
});

// Default function that runs browsersync and watches for changes
// Ran by default if calling "gulp" without any arguments
gulp.task('default', function(callback) {
  runSync(['clean:dev', 'nunjucks', 'sass', 'images:dev', 'fonts:dev', 'browserSync', 'watch'],
    callback)
});