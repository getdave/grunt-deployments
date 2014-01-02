'use strict';

var grunt = require('grunt');
var shell = require('shelljs');
var tpls  = require('../lib/tpls');

/**
 * Imports a .sql file into the DB provided
 */
function dbImport(config, src) {

    var cmd;

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

module.exports = dbImport;