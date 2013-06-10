/*
 * grunt-deployments
 * https://github.com/getdave/grunt-deployments
 *
 * Copyright (c) 2013 David Smith
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  



    grunt.registerTask('db_push', 'Push to Database', function() {
        // Get the target from the CLI args
        var target      = grunt.option('target') || 'develop';

        // Grab the options from the shared "deployments" config options
        var options     = grunt.config.get('deployments')[target];

        grunt.log.writeln("Pushing database to " + options.title);    
    }); 


     grunt.registerTask('db_pull', 'Pull from Database', function() {

        // Get the target from the CLI args
        var target      = grunt.option('target') || 'local';

        // Grab the options from the shared "deployments" config options
        var options     = grunt.config.get('deployments')[target];

        grunt.log.writeln("Pulling database from " + options.title);   
    }); 

};




grunt.loadNpmTasks('grunt-exec');
grunt.loadNpmTasks('grunt-rsync');
grunt.loadNpmTasks('grunt-contrib-clean');
