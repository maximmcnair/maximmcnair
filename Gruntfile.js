module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    connect:
    { server:
      { options:
        { port: 1337
        // , base: '/'
        , hostname: '*'
        }
      }
    , keepalive:
      { options:
        { keepalive: true
        , port: 1337
        // , base: '/'
        }
      }
    }
  , watch:
    { live:
      { files:
        [ 'views/*.jade'
        , 'views/**/*.jade'
        , 'js/*.js'
        , 'js/**/*.js'
        , 'stylus/**/**'
        ]
      // , tasks: ['stylus', 'jade', 'browserify2:app']
      , tasks: ['stylus']
      , options: { livereload: true }
      }
    // , test:
    //   { files:
    //     [ 'test/js/app/**/*.jade'
    //     , 'test/js/app/**/**/*.jade'
    //     , 'test/js/app/**/*.js'
    //     , 'test/js/app/*.js'
    //     , 'test/js/test/app/**/*.js'
    //     , 'test/js/test/*.html'
    //     ]
    //   , tasks: ['browserify2:app','browserify2:test','mocha_phantomjs']
    //   }
    }
  , stylus:
    { compile:
      { options:
        { compress: true
        }
      , files:
        { 'css/app.css': 'stylus/main.styl'
        }
      }
    }
  // , jade:
  //   { compile:
  //     { options:
  //       { pretty: true
  //       , data:
  //         { debug: true
  //         , compress: false
  //         }
  //       }
  //     , files:
  //       { 'build/index.html': [ 'views/index.jade' ] }
  //     }
  //   }
  // , browserify2:
  //   { app:
  //     { entry: './js/app.js'
  //     , compile: './build/js/app.js'
  //     , debug: true
  //     , beforeHook: function (bundle)
  //       { bundle.transform('./lib/browjadify.js')
  //       }
  //     }
  //   , test:
  //     { entry: './js/test/app/app.test.js'
  //     , compile: './js/test/test.js'
  //     , debug: true
  //     , beforeHook: function (bundle)
  //       { bundle.transform('./lib/browjadify.js')
  //       }
  //     }
  //   }
  // , mocha_phantomjs: {
  //     all: ['js/test/test-runner.html']
  //   }
  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-stylus')
  // grunt.loadNpmTasks('grunt-contrib-jade')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-watch')
  // grunt.loadNpmTasks('grunt-browserify2')
  // grunt.loadNpmTasks('grunt-mocha')
  // grunt.loadNpmTasks('grunt-mocha-phantomjs')
  grunt.loadNpmTasks('grunt-contrib-connect')

  // Default task.
  // grunt.registerTask('default', ['stylus', 'jade', 'browserify2:app', 'connect:server', 'watch:live'])

  // grunt.registerTask('test', ['browserify2:app','browserify2:test','mocha_phantomjs','watch:test'])
  grunt.registerTask('default', ['stylus', 'connect:server', 'watch:live'])
}