'use strict';

var config = require('../config'),
	Twig = require('twig'),
	twig = Twig.twig,
	express = require('express'),
	cheerio = require('cheerio'),
	fs = require('fs'),
	util = require('util'),
	path = require('path'),
	app = express(),
	yargs = require('yargs')
		.usage(util.format('Twig Test Server version %s\n\nUsage: $0 [--port] ( [path-to-files] || [-t template.file] [-d data.file] )', config.version))
		.example('$0  --port 8080 ./data')
		.alias('p', 'port')
		.alias('t', 'template')
		.alias('d', 'data')
		.describe('p', 'Port number')
		.describe('t', 'Template file')
		.describe('d', 'Data file')
		.argv;

// set up globals
var parentDir = process.cwd(),
	searchDir = yargs._[0] || '',
	workingDir = path.resolve(parentDir, searchDir),
	templateFile = path.resolve(workingDir, yargs.t || 'index.twig'),
	dataFile = path.resolve(workingDir, yargs.d || 'data.json'),
	scriptFile = path.resolve(workingDir, yargs.d || 'script.js'),
	port = yargs.p;

var USE_SCRIPT = true;

// confirm the path
try{

	var dirStats = fs.lstatSync(workingDir),
		templateStats = fs.lstatSync(templateFile),
		dataStats = fs.lstatSync(dataFile);

	if (!dirStats.isDirectory()) {
		console.log('Provided path must be a valid directory:', workingDir);
		process.exit();
	}

	if (!templateStats.isFile()) {
		console.log('Provided template must be a valid file:', templateFile);
		process.exit();
	}

	if (!dataStats.isFile()) {
		console.log('Provided data must be a valid file:', dataFile);
		process.exit();
	}


} catch (e) {
	console.log('Provided path must 1) be a valid directory and 2) contain index and data files.\n\n', e.message);
	process.exit();
}

try {
	var scriptStats = fs.lstatSync(scriptFile);

	if (!scriptStats.isFile()) {
		USE_SCRIPT = false;
	}

} catch (e) {
	USE_SCRIPT = false;
}

// confirm the directory
if(port){
	config.port = port;
}

// set up the server
app.get('*', function(req, res){

	var html = fs.readFileSync(templateFile),
		data = fs.readFileSync(dataFile),
		$ = cheerio.load(html,{ decodeEntities: false });

	var template = twig({
		data: $.html()
	});

	// wrap in try
	data = JSON.parse(data);

	if(USE_SCRIPT){
		var script = fs.readFileSync(scriptFile)
		var globals = { lodash: require('lodash') };
		var isolate = new Function ('data', script);
		var isolated = new Function ('globals', 'isolate', ' return isolate.bind(globals); ');
		data = isolated(globals, isolate)(data);
	}

	var output = template.render(data);

	res.send(output);
});

module.exports = {
	start: function(){

		console.log('starting server on port ', config.port);
		app.listen(config.port);

	}
};