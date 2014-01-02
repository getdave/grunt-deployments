'use strict';

var grunt				= require('grunt'),
	fs					= require("fs"),
	vows				= require("vows"),
	assert				= require("assert"),
	dbReplace			= require('../lib/dbReplace'),
	dbDump				= require('../lib/dbDump'),
	generateBackupPaths = require('../lib/generateBackupPaths'),
	basic_config		= grunt.file.readJSON('test/fixtures/basic_config.json');



exports.suite = vows.describe("Search and Replace").addBatch({
	"The dbReplace task": {
		topic: dbReplace("foo","bar","test-file.txt", true),
		"is not null": function (topic) {
			assert.isNotNull(topic);
		},
		"command is composed correctly": function (topic) {
			assert.equal(topic, "sed -i '' 's#foo#bar#g' test-file.txt");
		}
	}
});


exports.suite = vows.describe("DB Dump").addBatch({
	"The dbDump task": {
		topic: dbDump(
			basic_config.local,
			generateBackupPaths("local",{})
		),
		"is not null": function (topic) {
			assert.isNotNull(topic);
		},
		"command is composed correctly using basic data": function (topic) {
			assert.equal(topic.trim(), "mysqldump -h localhost -uroot -ppass4burfield -P3306 deploy_test");
		}		
	}
}); 









