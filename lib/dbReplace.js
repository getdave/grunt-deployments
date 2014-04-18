'use strict';

var grunt = require('grunt');
var shell = require('shelljs');
var fs    = require('fs-extra');
var tpls  = require('../lib/tpls');

function dbReplace(search, replace, output_path, noExec) {

    // Copy DB dump .sql to temp directory
    // avoids overwriting original backup
    grunt.file.copy(output_path.file, output_path["file-tmp"]);

    if ( grunt.file.exists(output_path["file-tmp"])) {
        // Execute cmd
        if (!noExec) {
            grunt.log.writeln("Replacing '" + search + "' with '" + replace + "' in the export (.sql) path.file.");

            var reg= new RegExp(search,"g");                            //Create a global regexp w/ search string
            var myFile=grunt.file.read(output_path["file-tmp"]);        //Get file as a string
            var result = myFile.replace(reg, replace);                  //Replace search string by replace string
            grunt.file.write(output_path["file-tmp"], result);          //Write in file

            grunt.log.oklns("Database references succesfully updated.");
        }
    } else {
        grunt.fail.warn("Search & Replace was unable to locate database dump .sql file (expected at: " + output_path.file + ").", 6);
    }

    // Return for reference and test suite purposes
    return shell;
}

module.exports = dbReplace;