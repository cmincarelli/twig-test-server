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
var baseDir = path.resolve(__dirname, '..' + path.sep),
	searchDir = yargs._[0] || '',
	workingDir = path.resolve(baseDir, searchDir),
	templateFile = path.resolve(workingDir, yargs.t || 'index.twig'),
	dataFile = path.resolve(workingDir, yargs.d || 'data.json'),
	port = yargs.p;

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
	console.log('Provided path must be a valid directory.\n\n', e.message);
	process.exit();
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

	var output = template.render(JSON.parse(data));

	res.send(output);
});

module.exports = {
	start: function(){

		console.log('starting server on port ', config.port);
		app.listen(config.port);

	}
};