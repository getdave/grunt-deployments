'use strict';

var grunt				= require('grunt'),
	fs					= require("fs"),
	vows				= require("vows"),
	assert				= require("assert"),
	dbReplace			= require('../lib/dbReplace'),
	dbDump				= require('../lib/dbDump'),
	generateBackupPaths = require('../lib/generateBackupPaths'),
	basic_config		= grunt.file.readJSON('test/fixtures/basic_config.json');



exports.suite = vows.describe("Basic tests").addBatch({
	"The dbReplace task": {
		topic: dbReplace("foo","bar","test-file.txt", true),
		"is not null": function (topic) {
			assert.isNotNull(topic);
		},
		"command is composed correctly": function (topic) {
			assert.equal(topic, "sed -i '' 's#foo#bar#g' test-file.txt");
		},
		// add test to check against a fixture MYSQL export file that a search and replace works as expected
	}
}).addBatch({
	"The dbDump task": {
		topic: dbDump(
			basic_config.local,
			generateBackupPaths("local",{})
		),
		"is not null": function (topic) {
			assert.isNotNull(topic);
		},
		"command is composed correctly using basic data": function (topic) {
			assert.equal(topic.cmd.trim(), "mysqldump -h localhost -uroot -ppass4burfield -P3306 deploy_test");
		},
		"results in a .sql file that": {
			topic: function (topic) {
				fs.stat(topic.output_file, this.callback);
			},
			"has contents": function (err, stat) {
				assert.isNull(err);
				assert.isNotZero(stat.size);
			}
		}
	}
});









