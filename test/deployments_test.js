var chai        = require("chai");
var expect      = require('chai').expect;

var grunt       = require('grunt');
var deployments = require('../tasks/deployments.js');



describe('Check Grunt Registration', function(){
  it('registers deployments task with Grunt', function(){
      expect(deployments).to.exist;
      expect(deployments).to.be.a('function');
  });

  it('registers db_pull task with Grunt', function(){
      expect(grunt.task._tasks['db_pull']).to.exist;
  });

  it('registers db_push task with Grunt', function(){
      expect(grunt.task._tasks['db_push']).to.exist;
  });
});

