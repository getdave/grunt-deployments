'use strict';

var grunt = require('grunt');
var shell = require('shelljs');
var fs    = require('fs-extra');
var tpls  = require('../lib/tpls');

function dbReplace(config, search, replace, noExec) {


    // Perform Search and replace on the temp file (not original)
    var cmd = grunt.template.process( tpls.search_replace, {
        data: {
            host: config.host,
            user: config.user,
            pass: config.pass,
            database: config.database,
            search: search,
            replace: replace
        }
    });

    console.log(cmd);

    // Return for reference and test suite purposes */
    shell.exec(cmd);
    return cmd;

}

module.exports = dbReplace;