'use strict';

var grunt = require('grunt');
var shell = require('shelljs');
var tpls  = require('../lib/tpls');

function dbReplace(search,replace,output_file) {

    var cmd = grunt.template.process( tpls.search_replace, {
        data: {
            search: search,
            replace: replace,
            path: output_file
        }
    });

    grunt.log.writeln("Replacing '" + search + "' with '" + replace + "' in the database.");
     // Execute cmd
    shell.exec(cmd);
    grunt.log.oklns("Database references succesfully updated.");
}

module.exports = dbReplace;