'use strict';

var grunt = require('grunt');
var shell = require('shelljs');
var fs    = require('fs-extra');
var tpls  = require('../lib/tpls');

function dbReplace(config, search, replace, noExec) {


    // Perform Search and replace on the temp file (not original)
    var cmd = grunt.template.process( tpls.search_replace, {
        data: {
            scriptPath: "node_modules/search-replace-db/",
            host: config.host,
            user: config.user,
            pass: config.pass,
            database: config.database,
            search: search,
            replace: replace,
            flags: ""
        }
    });


    if (typeof config.ssh_host === "undefined") { // we're not using SSH
        
        // Return for reference and test suite purposes */
        shell.exec(cmd);

    } else { // it's a remote SSH connection
        var tpl_ssh = grunt.template.process(tpls.ssh, {
            data: {
                user: config.ssh_user,
                host: config.ssh_host,
                port: (typeof config.ssh_port === "undefined") ? '22' : config.ssh_port
            }
        });

        cmd = tpl_ssh + " '" + cmd;

        // Return for reference and test suite purposes */
        //shell.exec(cmd);
    }

    console.log(cmd);

    
    return cmd;

}

module.exports = dbReplace;