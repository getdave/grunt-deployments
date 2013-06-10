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

        db_dump(target, options);
      
    }); 



    function db_dump(env, config) {

        var cmd;

        // 1) Create suitable backup directory
        var backup_path = grunt.template.process(tpls.backup_path, { 
            data: {
                env: env,
                date: grunt.template.today('yyyymmdd'),
                time: grunt.template.today('HH-MM-ss'),
            }
        });
        grunt.file.mkdir(backup_path);

        
        // 2) Compile MYSQL cmd via Lo-Dash template string
        var tpl_mysqldump = grunt.template.process(tpls.mysqldump, { 
            data: {
                user: config.user,
                pass: config.pass,
                database: config.database,
                path: backup_path,
                date: grunt.template.today('yyyymmdd')
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

        // Execute cmd 
        shell.exec(cmd, function(code, output) {
            // forces stdout to output
        });
        
    }




     /**
     * Lo-Dash Template Helpers
     * http://lodash.com/docs/#template
     * https://github.com/gruntjs/grunt/wiki/grunt.template
     */
    var tpls = {

        backup_path: "backups/<%= env %>/<%= date %>/<%= time %>",

        search_replace: "sed -i '' 's/<%= search %>/<%= replace %>/g' db_backup_<%= date %>.sql",

        mysqldump: "mysqldump -u <%= user %> -p<%= pass %> <%= database %> > <%= path %>/db_backup_<%= date %>.sql",

        mysql: "mysql -h <%= host %> -u <%= user %> -p<%= pass %> <%= database %>",

        ssh: "ssh <%= host %>",

        //ssh ddeploy@134.0.18.114 'mysql -h localhost -u ddeploy_dev -ptest4test ddeploy_dev' < db_backup_20130507.sql
    };
    
    

};





