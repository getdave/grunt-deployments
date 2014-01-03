'use strict';

var grunt = require('grunt');
var shell = require('shelljs');
var tpls  = require('../lib/tpls');

/**
 * Imports a .sql file into the DB provided
 */
function dbImport(config, src) {

    var cmd;
    var rtn;

    // 1) Create cmd string from Lo-Dash template
    var tpl_mysql = grunt.template.process(tpls.mysql, {
        data: {
            host: config.host,
            user: config.user,
            pass: config.pass,
            database: config.database,
            path: src,
            port: config.port || 3306
        }
    });


    // 2) Test whether target MYSQL DB requires remote access via SSH
    grunt.log.writeln("Importing into " + config.title + " database");
    
    if (typeof config.ssh_host === "undefined") { // we're not using SSH
        
        cmd = tpl_mysql + " < " + src;

    } else { // it's a remote SSH connection
        var tpl_ssh = grunt.template.process(tpls.ssh, {
            data: {
                user: config.ssh_user,
                host: config.ssh_host,
                port: (typeof config.ssh_port === "undefined") ? '22' : config.ssh_port
            }
        });

        cmd = tpl_ssh + " '" + tpl_mysql + "' < " + src;
    }

     // Execute cmd
    shell.exec(cmd);

    grunt.log.oklns("Database imported succesfully");


    rtn = {
        cmd: cmd
    };

    // Return for reference and test suite purposes
    return rtn;
}

module.exports = dbImport;