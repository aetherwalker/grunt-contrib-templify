/*
 * 
 * 
 * @license MIT
 * @author Alexander Anderson
 * @modified February 20th, 2017
 * Copyright Refuge Systems LLC 2017
 */
"use strict";

module.exports = function(grunt) {
	
	var fs = require("fs");
	
	/* Track the current working directory */
	var currentDir = __dirname.replace(/\\/g, "/") + "/../";

	/* Essentially a no-op for rewriting template names */
	var noRewrite = function(path){return path;};
	/* Literal no-op for filling in builders */
	var noOp = function(){};
	
	/* Setup the defaults to merge with incoming task configuration */
	var defaults = {
		"mode": "karma-angular"	
	};

	grunt.registerMultiTask("templify", "Convert HTML files to Javascript strings for template usage.", function() {
		var options = Object.assign({}, defaults, this.data);

		/* Tracks the templates name to the object describing its contents */
		var templates = {};
		/* Used for storing the string to write to the output file */
		var content;
		/* Used for keeping the template names indexed for looping */
		var keys;
		/* Tracks the generating function that is in use */
		var builder;
		/* Used for tracking the current template path */
		var path;
		/* Used for tracking the name of template being manipulated */
		var name;
		
		/* VALIDATE OPTIONS */
		if(!options.templates) throw new Error("Configuration 'templates' missing for Templify");
		if(!options.mode) throw new Error("Configuration 'mode' missing for Templify");
		if(!options.output) throw new Error("Configuration 'output' missing for Templify");
		
		/* ADJUST OPTIONS */
		if(options.output[0] !== "/") options.output = currentDir + options.output;
		
		/* INDEX TEMPLATES */
		options.templates.forEach(function(dir) {
			try {
				if(typeof dir === "string") {
					dir = {
						"path": dir,
						"module": null,
						"prefix": null,
						"suffix": null,
						"trim": null
					};
				}
				if(!dir.rewrite) {
					dir.rewrite = noRewrite;
				}
				dir.files = fs.readdirSync(dir.path);

				dir.files.forEach(function(file) {
					path = dir.path + file;
					content = fs.readFileSync(path).toString();
					name = dir.rewrite(path, dir);
					templates[name] = {
							"name": name,
							"path": path,
							"html": content,
							"module": dir.module
					};
				});
				
			} catch(exception) {
				grunt.log.writeln("Failed to read directory: " + dir + "\n" + JSON.stringify(exception, null, 4));
			}
		});
	    
	    keys = Object.keys(templates);
	    
	    /* PREFIX */
	    builder = prefixers[options.mode];
	    if(!builder) throw new Error("Unknown mode(" + options.mode + ") for grunt-contrib-templify task(templify:" + this.target + "): " + JSON.stringify(builder, null, 4));
	    content = builder(options);
	    
	    /* BUILD TEMPLATES */
	    builder = generators[options.mode];
	    keys.forEach(function(template) {
	    	content += builder(templates[template], options);
	    });

	    /* SUFFIX */
	    builder = suffixers[options.mode];
    	content += builder(options);
	    
	    /* WRITE OUTPUT */
	    fs.writeFileSync(options.output, content.toString(), "utf-8");
	});
	
	/* Functions that handle the translation of a template object to its corresponding contents */
	var prefixers = {};
	var generators = {};
	var suffixers = {};

	var builders = currentDir + "builders/";
	fs.readdirSync(builders).forEach(function(builder) {
		builder = require(builders + builder);
		prefixers[builder.mode] = builder.prefix || noOp;
		generators[builder.mode] = builder.generator || noOp;
		suffixers[builder.mode] = builder.suffix|| noOp;
	});
};
