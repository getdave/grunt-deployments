/*
 * grunt-deployments
 * https://github.com/getdave/grunt-deployments
 *
 * Copyright (c) 2013 David Smith
 * Licensed under the MIT license.
 */

'use strict';

var shell = require('shell');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-rsync');
    grunt.loadNpmTasks('grunt-contrib-clean');



    // GLOBALS    
    var local_options   = grunt.config.get('deployments').local;




    /**
     * DB PUSH
     * pushes local database to remote database
     */
    grunt.registerTask('db_push', 'Push to Database', function() {
        // Get the target from the CLI args
        var target = grunt.option('target');

        if ( typeof target === "undefined" || typeof grunt.config.get('deployments')[target] === "undefined")  {
            grunt.fail.warn("Invalid target specified. Did you pass the wrong argument? Please check your task configuration.", 6);
        }

        // Grab the options from the shared "deployments" config options
        var target_options      = grunt.config.get('deployments')[target];


        // Generate required backup directories and paths
        var local_backup_paths  = generate_backup_paths("local");
        var target_backup_paths = generate_backup_paths(target);
        

        grunt.log.subhead("Pushing database from 'Local' to '" + target_options.title + "'");


        // Dump local DB
        db_dump(local_options, local_backup_paths);

        // Search and Replace database refs
        db_replace( local_options.url, target_options.url, local_backup_paths.file );

        // Dump target DB
        db_dump(target_options, target_backup_paths);

        // Import dump to target DB
        db_import(target_options, local_backup_paths.file);
    }); 


    /**
     * DB PULL
     * pulls remote database into local database
     */
    grunt.registerTask('db_pull', 'Pull from Database', function() {

        // Get the target from the CLI args
        var target              = grunt.option('target');

        if ( typeof target === "undefined" || typeof grunt.config.get('deployments')[target] === "undefined")  {
            grunt.fail.warn("Invalid target provided. I cannot pull a database from nowhere! Please checked your configuration and provide a valid target.", 6);
        }

        // Grab the options from the shared "deployments" config options
        var target_options      = grunt.config.get('deployments')[target];
        
        // Generate required backup directories and paths
        var local_backup_paths  = generate_backup_paths("local");
        var target_backup_paths = generate_backup_paths(target);

        // Start execution
        grunt.log.subhead("Pulling database from '" + target_options.title + "' into Local");

        db_dump(target_options, target_backup_paths );

        db_replace(target_options.url,local_options.url,target_backup_paths.file);
        
        db_import(local_options,target_backup_paths.file);
    }); 


    function generate_backup_paths(target) {

        var rtn = [];

        // Create suitable backup directory paths
        rtn['dir'] = grunt.template.process(tpls.backup_path, { 
            data: {
                env: target,
                date: grunt.template.today('yyyymmdd'),
                time: grunt.template.today('HH-MM-ss'),
            }
        });


        rtn['file'] = rtn['dir'] + '/db_backup.sql';

        return rtn;
    }


    /**
     * Imports a .sql file into the DB provided
     */
    function db_import(config, src) {

        var cmd;

        // 1) Create cmd string from Lo-Dash template
        var tpl_mysql = grunt.template.process(tpls.mysql, { 
            data: {
                host: config.host,
                user: config.user,
                pass: config.pass,
                database: config.database,
                path: src
            }
        });


        // 2) Test whether target MYSQL DB is local or whether requires remote access via SSH
        if (typeof config.ssh_host === "undefined") { // it's a local connection
            grunt.log.writeln("Importing into local database");
            cmd = tpl_mysql + " < " + src;         
        } else { // it's a remote connection
            var tpl_ssh = grunt.template.process(tpls.ssh, { 
                data: {
                    host: config.ssh_host
                }
            });

            grunt.log.writeln("Importing DUMP into remote database");

            cmd = tpl_ssh + " '" + tpl_mysql + "' < " + src;
        }

         // Execute cmd 
        shell.exec(cmd);

        grunt.log.oklns("Database imported succesfully");
    }



    /**
     * Dumps a MYSQL database to a suitable backup location
     */
    function db_dump(config, output_paths) {

        var cmd;
        
        grunt.file.mkdir(output_paths.dir);

        
        // 2) Compile MYSQL cmd via Lo-Dash template string
        var tpl_mysqldump = grunt.template.process(tpls.mysqldump, { 
            data: {
                user: config.user,
                pass: config.pass,
                database: config.database,
            }
        });


        // 3) Test whether MYSQL DB is local or whether requires remote access via SSH
        if (typeof config.ssh_host === "undefined") { // it's a local connection
            grunt.log.writeln("Creating DUMP of local database");
            cmd = tpl_mysqldump;
            
        } else { // it's a remote connection
            var tpl_ssh = grunt.template.process(tpls.ssh, { 
                data: {
                    host: config.ssh_host
                }
            });
            grunt.log.writeln("Creating DUMP of remote database");

            cmd = tpl_ssh + " \ " + tpl_mysqldump;
        }

        // Capture output...
        var output = shell.exec(cmd, {silent: true}).output;

        // Write output to file using native Grunt methods
        grunt.file.write( output_paths.file, output );

        grunt.log.oklns("Database DUMP succesfully exported to: " + output_paths.file);
       
    }


    function db_replace(search,replace,output_file) {
        
        var cmd = grunt.template.process(tpls.search_replace, { 
            data: {
                search: search,
                replace: replace,
                path: output_file 
            }
        });

        grunt.log.writeln("Replacing '" + search + "' with '" + replace + "' in the database.");
         // Execute cmd 
        shell.exec(cmd); 
        grunt.log.oklns("Database references succesfully updated.");   
    }




     /**
     * Lo-Dash Template Helpers
     * http://lodash.com/docs/#template
     * https://github.com/gruntjs/grunt/wiki/grunt.template
     */
    var tpls = {

        backup_path: "backups/<%= env %>/<%= date %>/<%= time %>",

        search_replace: "sed -i '' 's/<%= search %>/<%= replace %>/g' <%= path %>",

        mysqldump: "mysqldump -u <%= user %> -p<%= pass %> <%= database %>",

        mysql: "mysql -h <%= host %> -u <%= user %> -p<%= pass %> <%= database %>",

        ssh: "ssh <%= host %>",

        //ssh ddeploy@134.0.18.114 'mysql -h localhost -u ddeploy_dev -ptest4test ddeploy_dev' < db_backup_20130507.sql
    };
    
    

};





