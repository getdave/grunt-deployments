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

        cmd = tpl_ssh + " \\ " + tpl_mysqldump;
    }

    if (!noExec) {
        // Capture output...
        var output = shell.exec(cmd, {silent: true}).output;

        // Write output to file using native Grunt methods
        grunt.file.write( output_paths.file, output );
    }

    grunt.log.oklns("Database DUMP succesfully exported to: " + output_paths.file);

    // Return for reference and test suite purposes
    return cmd;

}

module.exports = dbDump;