'use strict';

var grunt = require('grunt');
var shell = require('shelljs');
var fs    = require('fs-extra');
var tpls  = require('../lib/tpls');

function dbReplace(config, search, replace, noExec) {

    var cmd;
    var scp_cmd;
    var ssh_cmd;

    grunt.log.writeln("Replacing '" + search + "' with '" + replace + "' in the database");
    if (typeof config.ssh_host === "undefined") { // we're not using SSH

        // Run search-replace-db script
        cmd = grunt.template.process( tpls.search_replace, {
            data: {
                scriptPath: "node_modules/search-replace-db/",
                host: config.host,
                user: config.user,
                pass: config.pass,
                database: config.database,
                search: search,
                replace: replace,
                flags: "" // dry run
            }
        });

        shell.exec(cmd); // TODO: checkoutput for success/failure

    } else { // it's a remote SSH connection

        // Upload search-replace script over SCP
        // SSH into the remote
        // Execute search-replace script

        // 1) SCP search-replace-db script to remote server
        scp_cmd = grunt.template.process(tpls.scp, {
            data: {
                user: config.ssh_user,
                host: config.ssh_host,
                src_path: "node_modules/search-replace-db/",
                dest_path: "~/search-replace-db/",
                port: (typeof config.ssh_port === "undefined") ? '22' : config.ssh_port
            }
        });

        shell.exec(scp_cmd);


        // 2) Build an SSH command
        ssh_cmd = grunt.template.process(tpls.ssh, {
            data: {
                user: config.ssh_user,
                host: config.ssh_host,
                port: (typeof config.ssh_port === "undefined") ? '22' : config.ssh_port
            }
        });

        // 3) Execute search-replace-db script on remote server
        cmd = grunt.template.process( tpls.search_replace, {
            data: {
                scriptPath: "~/search-replace-db/",
                host: config.host,
                user: config.user,
                pass: config.pass,
                database: config.database,
                search: search,
                replace: replace,
                flags: "" // dry run
            }
        });

        cmd = ssh_cmd + " '" + cmd + "'";

        // Return for reference and test suite purposes */
        shell.exec(cmd);
    }

    grunt.log.oklns("Database references succesfully updated.");
    return cmd;

}

module.exports = dbReplace;