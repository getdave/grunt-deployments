'use strict';

var grunt				= require('grunt'),
	vows				= require("vows"),
	assert				= require("assert"),
	dbReplace			= require('../lib/dbReplace'),
	dbDump				= require('../lib/dbDump');



exports.suite = vows.describe("Search and Replace").addBatch({
	"The dbReplace task": {
		topic: dbReplace,
		"is not null": function (topic) {
			assert.isNotNull(topic);
		},

	}
});









