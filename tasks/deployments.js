/*
 * grunt-deployments
 * https://github.com/getdave/grunt-deployments
 *
 * Copyright (c) 2013 David Smith
 * Licensed under the MIT license.
 */

'use strict';

// Global
var shell = require('shelljs');

// Library modules
var tpls                    = require('../lib/tpls');
var dbReplace               = require('../lib/dbReplace');
var dbDump                  = require('../lib/dbDump');
var dbImport                = require('../lib/dbImport');
var generateBackupPaths     = require('../lib/generateBackupPaths');


// Only Grunt registration within this "exports"
module.exports = function(grunt) {

    /**
     * DB PUSH
     * pushes local database to remote database
     */
    grunt.registerTask('db_push', 'Push to Database', function() {

        // Options
        var task_options    = grunt.config.get('deployments')['options'];

        // Get the target from the CLI args
        var target = grunt.option('target') || task_options['target'];

        if ( typeof target === "undefined" || typeof grunt.config.get('deployments')[target] === "undefined")  {
            grunt.fail.warn("Invalid target specified. Did you pass the wrong argument? Please check your task configuration.", 6);
        }

        // Grab the options from the shared "deployments" config options
        var target_options      = grunt.config.get('deployments')[target];
        var local_options       = grunt.config.get('deployments').local;

        // Generate required backup directories and paths
        var local_backup_paths  = generateBackupPaths("local", task_options);
        var target_backup_paths = generateBackupPaths(target, task_options);


        grunt.log.subhead("Pushing database from 'Local' to '" + target_options.title + "'");


        // Dump local DB
        dbDump(local_options, local_backup_paths);

        // Search and Replace database refs
        dbReplace( local_options.url, target_options.url, local_backup_paths.file );

        // Dump target DB
        dbDump(target_options, target_backup_paths);

        // Import dump to target DB
        dbImport(target_options, local_backup_paths.file);

        grunt.log.subhead("Operations completed");
    });


    /**
     * DB PULL
     * pulls remote database into local database
     */
    grunt.registerTask('db_pull', 'Pull from Database', function() {

        // Options
        var task_options    = grunt.config.get('deployments')['options'];

        // Get the target from the CLI args
        var target              = grunt.option('target') || task_options['target'];

        if ( typeof target === "undefined" || typeof grunt.config.get('deployments')[target] === "undefined")  {
            grunt.fail.warn("Invalid target provided. I cannot pull a database from nowhere! Please checked your configuration and provide a valid target.", 6);
        }



        // Grab the options from the shared "deployments" config options
        var target_options      = grunt.config.get('deployments')[target];
        var local_options       = grunt.config.get('deployments').local;

        // Generate required backup directories and paths
        var local_backup_paths  = generateBackupPaths("local", task_options);
        var target_backup_paths = generateBackupPaths(target, task_options);

        // Start execution
        grunt.log.subhead("Pulling database from '" + target_options.title + "' into Local");

        // Dump Target DB
        dbDump(target_options, target_backup_paths );

        dbReplace(target_options.url,local_options.url,target_backup_paths.file);

        // Backup Local DB
        dbDump(local_options, local_backup_paths);

        // Import dump into Local
        dbImport(local_options,target_backup_paths.file);

        grunt.log.subhead("Operations completed");

    });
};





