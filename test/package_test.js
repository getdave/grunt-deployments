'use strict';

var grunt				= require('grunt'),
	vows				= require("vows"),
	assert				= require("assert"),
	dbReplace			= require('../lib/dbReplace'),
	dbDump				= require('../lib/dbDump');



exports.suite = vows.describe("Search and Replace").addBatch({
	"The dbReplace task": {
		topic: dbReplace("foo","bar","test-file.txt"),
		"is not null": function (topic) {
			assert.isNotNull(topic);
		},
		"command is composed correctly": function (topic) {
			assert.equal(topic, "sed -i '' 's#foo#bar#g' test-file.txt");
		}
	}
});









