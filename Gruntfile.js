/*global module:false*/
module.exports = function (grunt) {
  module.require('time-grunt')(grunt);

  grunt.initConfig({

    sync: {
      all: {
        options: {
          sync: ['author', 'name', 'version', 'description', 'homepage', 'license']
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-summary')
      },
      default: {
        'src': [ '*.js', '!*-browser.js', 'test/*.js' ]
      }
    },

    complexity: grunt.file.readJSON('configs/complexity.json'),

    browserify: {
      all: {
        src: 'lazy-ass-helpful.js',
        dest: 'lazy-ass-helpful-browser.js'
      }
    },

    /* testing in the browser and node */
    qunit: {
      all: ['index.html']
    },

    'node-qunit': {
      all: {
        deps: './node_modules/lazy-ass/index.js',
        code: './lazy-ass-helpful.js',
        tests: [
          './test/test-lazy-ass.js'
        ]
      }
    },

    parallel: {
      test: {
        options: {
          grunt: true
        },
        tasks: ['qunit', 'node-qunit']
      }
    },

    watch: {
      options: {
        atBegin: true
      },
      all: {
        files: ['*.js', 'test/*.js', 'index.html'],
        tasks: ['jshint', 'browserify', 'parallel']
      }
    },

    'gh-pages': {
      options: {
        base: '.'
      },
      src: [
        'index.html',
        'index-mocha.html',
        'README.md',
        'lazy-ass-helpful-browser.js',
        'lazy-ass-helpful-bdd.js',
        'node_modules/mocha/mocha.css',
        'node_modules/mocha/mocha.js',
        'node_modules/lazy-ass/index.js',
        'node_modules/es5-shim/es5-shim.js',
        'node_modules/check-types/src/check-types.js',
        'test/*.js'
      ]
    }
  });

  var plugins = module.require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('test', ['parallel:test']);
  grunt.registerTask('default', ['deps-ok', 'nice-package', 'sync',
    'jshint', 'complexity', 'browserify', 'test']);
};
