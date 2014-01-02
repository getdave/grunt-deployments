'use strict';

var grunt = require('grunt');
var shell = require('shelljs');
var tpls  = require('../lib/tpls');


function generateBackupPaths(target, task_options) {

    var rtn = [];

    var backups_dir = task_options['backups_dir'] || "backups";

    // Create suitable backup directory paths
    rtn['dir'] = grunt.template.process(tpls.backup_path, {
        data: {
            backups_dir: backups_dir,
            env: target,
            date: grunt.template.today('yyyymmdd'),
            time: grunt.template.today('HH-MM-ss'),
        }
    });


    rtn['file'] = rtn['dir'] + '/db_backup.sql';

    return rtn;
}

module.exports = generateBackupPaths;