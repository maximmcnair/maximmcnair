/* jshint unused: false */
var gulp = require('gulp')
  , stylus = require('gulp-stylus')
  , nib = require('nib')
  // , jshint = require('gulp-jshint')
  , rename = require('gulp-rename')
  // , stylish = require('jshint-stylish')
  // , concat = require('gulp-concat')
  // , mochaPhantomJS = require('gulp-mocha-phantomjs')
  // , map = require('map-stream')
  // , fileinclude = require('gulp-file-include')

var stylusOptions =
    { set: ['compress']
    , use: [nib()]
    , import: ['nib']
    }
  , defaultPaths = {
      stylus: [
        'stylus/**/**/*.styl'
      , 'stylus/**/*.styl'
      , 'stylus/*.styl'
      ]
    }

gulp.task('stylus', function () {
  // Render production version
  gulp.src('./stylus/main.styl')
    .pipe(stylus(stylusOptions).on('error', handleError))
    .pipe(gulp.dest('css'))

  // Render development version
  stylusOptions.compress = true
  gulp.src('./stylus/main.styl')
    .pipe(stylus(stylusOptions).on('error', handleError))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('css'))
})

gulp.task('watch', function() {
  gulp.watch(defaultPaths.stylus, ['stylus'])
})

function compileScript(path, name, outcomePath) {
  return gulp.src(path)
    .pipe(concat(name))
    // .pipe(uglify())
    .pipe(gulp.dest(outcomePath))
}

function handleError(err) {
  console.log(err.toString())
  this.emit('end')
}

gulp.task('default', ['stylus'])

gulp.task('watch', ['stylus', 'watch'])
