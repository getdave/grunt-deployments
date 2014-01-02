'use strict';

var grunt				= require('grunt'),
	vows				= require("vows"),
	assert				= require("assert"),
	db_replace			= require('../lib/db_replace');



exports.suite = vows.describe("Search and Replace").addBatch({
	"The db_replace task": {
		topic: db_replace,
		"is not null": function (topic) {
			assert.isNotNull(topic);
		},
		"is a function": function (topic) {
			assert.isFunction(topic);
		},
	}
});









