/* jshint unused: false */
var gulp = require('gulp')
  , stylus = require('gulp-stylus')
  , nib = require('nib')
  // , jshint = require('gulp-jshint')
  // , stylish = require('jshint-stylish')
  // , concat = require('gulp-concat')
  // , mochaPhantomJS = require('gulp-mocha-phantomjs')
  // , map = require('map-stream')
  // , fileinclude = require('gulp-file-include')
  // , rename = require('gulp-rename')

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
  gulp.src('stylus/main.styl')
    .pipe(stylus(stylusOptions).on('error', handleError))
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

gulp.task('default', ['stylus', 'watch'])
