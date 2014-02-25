'use strict';

var grunt           = require('grunt');
var shell           = require('shelljs');
var tpls            = require('../lib/tpls');


/**
 * Dumps a MYSQL database to a suitable backup location
 */
function dbDump(config, output_paths, noExec) {

    var cmd;
    var ignoreTables;
    var rtn;

    grunt.file.mkdir(output_paths.dir);

    // 1) Get array of tables to ignore, as defined in the config, and format it correctly
    if( config.ignoreTables ) {
         ignoreTables = '--ignore-table=' + config.database + "." + config.ignoreTables.join(' --ignore-table='+config.database+'.');
    }

    // 2) Compile MYSQL cmd via Lo-Dash template string
    var tpl_mysqldump = grunt.template.process(tpls.mysqldump, {
        data: {
            user: config.user,
            pass: config.pass,
            database: config.database,
            host: config.host,
            port: config.port || 3306,
            ignoreTables: ignoreTables || ''
        }
    });

    // 3) Test whether MYSQL DB requires remote access via SSH
    grunt.log.writeln("Creating dump of " + config.title + " database");

    if (typeof config.ssh_host === "undefined") { // we're not using SSH

        cmd = tpl_mysqldump;

    } else { // it's a remote SSH connection

        var tpl_ssh = grunt.template.process(tpls.ssh, {
            data: {
                user: config.ssh_user,
                host: config.ssh_host,
                port: (typeof config.ssh_port === "undefined") ? '22' : config.ssh_port
            }
        });

        cmd = tpl_ssh + " \\ " + tpl_mysqldump;
    }

    if (!noExec) {
        // Capture output...
        var output = shell.exec(cmd, {silent: true}).output;
        // TODO: Add test here to check whether we were able to connect

        // Write output to file using native Grunt methods
        grunt.file.write( output_paths.file, output );
    }

    if ( grunt.file.exists(output_paths.file) ) {
        grunt.log.oklns("Database dump succesfully exported to: " + output_paths.file);
    } else if (noExec) {
        grunt.log.oklns("Running with 'noExec' option. Database dump would have otherwise been succesfully exported to: " + output_paths.file);
    } else {
        grunt.fail.warn("Unable to locate database dump .sql file at " + output_paths.file, 6);
    }

    rtn = {
        cmd: cmd,
        output_file: output_paths.file
    };

    // Return for reference and test suite purposes
    return rtn;

}

module.exports = dbDump;