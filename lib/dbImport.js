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


    // 2) Test whether target MYSQL DB is local or whether requires remote access via SSH
    if (typeof config.ssh_host === "undefined") { // it's a local connection
        grunt.log.writeln("Importing into local database");
        cmd = tpl_mysql + " < " + src;
    } else { // it's a remote connection

        // Test whether an SSH port is defined and pass the default port '22' if it's not defined
        if (typeof config.ssh_port === "undefined") {
            var tpl_ssh = grunt.template.process(tpls.ssh, {
                data: {
                    host: config.ssh_host,
                    port: '22'
                }
            });
        } else {
            var tpl_ssh = grunt.template.process(tpls.ssh, {
                data: {
                    host: config.ssh_host,
                    port: config.ssh_port
                }
            });
        }

        grunt.log.writeln("Importing DUMP into remote database");

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