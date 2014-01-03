'use strict';

var grunt = require('grunt');
var shell = require('shelljs');
var fs    = require('fs-extra');
var tpls  = require('../lib/tpls');

function dbReplace(search, replace, output_path, noExec) {

    // Copy DB dump .sql to temp directory
    // avoids overwriting original backup
    grunt.file.copy(output_path.file, output_path["file-tmp"]);

    // Perform Search and replace on the temp file (not original)
    var cmd = grunt.template.process( tpls.search_replace, {
        data: {
            search: search,
            replace: replace,
            path: output_path["file-tmp"]
        }
    });

    if ( grunt.file.exists(output_path["file-tmp"])) {
        // Execute cmd
        if (!noExec) {
            grunt.log.writeln("Replacing '" + search + "' with '" + replace + "' in the export (.sql) path.file.");
            shell.exec(cmd);
            grunt.log.oklns("Database references succesfully updated.");
        }
    } else {
        grunt.fail.warn("Search & Replace was unable to locate database dump .sql file (expected at: " + output_path.file + ").", 6);
    }

    // Return for reference and test suite purposes
    return cmd; 
}

module.exports = dbReplace;