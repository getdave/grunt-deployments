/*
 * grunt-deployments
 * https://github.com/getdave/grunt-deployments
 *
 * Copyright (c) 2014 David Smith
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    db_fixture: grunt.file.readJSON('test/fixtures/test_db.json'),
    vows: {
      all: {
        options: {
            // String {spec|json|dot-matrix|xunit|tap}
            // defaults to "dot-matrix"
            reporter: "spec",
            // String or RegExp which is
            // matched against title to
            // restrict which tests to run
            // onlyRun: /helper/,
            // Boolean, defaults to false
            verbose: false,
            // Boolean, defaults to false
            silent: false,
            // Colorize reporter output,
            // boolean, defaults to true
            colors: true,
            // Run each test in its own
            // vows process, defaults to
            // false
            isolate: false,
            // String {plain|html|json|xml}
            // defaults to none
            coverage: "json"
        },
        // String or array of strings
        // determining which files to include.
        // This option is grunt's "full" file format.
        src: ["test/**/*_test.js"]
      }
    },
    jshint: {
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['tasks/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
      options: {
        jshintrc: '.jshintrc',
      },
    },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'vows']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'vows']
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    deployments: {

    }

  });


// Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'vows']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'vows']);

};
