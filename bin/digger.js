#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');
var version = require('../package.json').version;
var path = require('path');
var DiggerApp = require('../src');

var fs = require('fs');

program
  .option('-e, --env <string>', 'value for process.env.NODE_ENV', 'production')
  .version(version)

program
  .command('serve [app_root] [port]')
  .description('serve a digger application')
  .action(function(app_root, port){

    process.env.NODE_ENV = program.env;
    
  	if(!app_root){
  		app_root = process.cwd();
  	}
    else if(app_root.indexOf('/')!=0){
      app_root = path.normalize(process.cwd() + '/' + app_root);
    }

    if(!port){
      port = 80;
    }
    
    console.log('serving digger application: ' + app_root + '/digger.yaml');

    var app = DiggerApp({
    	application_root:app_root
    })

    app.on('config', function(doc){
      console.log('loading digger stack: ' + doc.name);
    })

    app.on('warehouse', function(route, config){
      console.log('   warehouse route: ' + route + ': ' + config.type);
    })

    app.on('website', function(domain){
      console.log('   website domain: ' + domain);
    })

    app.on('website:module', function(route){
      console.log('   website module: ' + route);
    })

    app.on('auth', function(settings){
      console.log('mounting authentication: ' + settings.url);
    })

    app.on('www', function(doc_root){
      console.log('website document_root: ' + doc_root);
    })

    app.start(port, function(){
      console.log('server listening on port: ' + port);
    });

  })

program.parse(process.argv);