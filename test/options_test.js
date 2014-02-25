/* 'use strict';

var vows              = require("vows"),
	assert            = require("assert"),
	mysqldumpwrapper  = require('../lib/mysqldumpwrapper.js');


exports.suite = vows.describe("Package options tests").addBatch({
	"The User option": {
		topic: function() {
			mysqldumpwrapper({

			});
		},
		"errors if undefined or empty": function (topic) {
			assert.throws(topic, Error);
		}
	}
});
 */