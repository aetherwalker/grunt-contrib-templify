
describe("Grunt task processing", function() {

	var templifier = require("../tasks/templifier.js");
	
	var fs, glob, grunt, req;
	
	var builders;
	
	beforeEach(function() {
		grunt = jasmine.createSpyObj("grunt", [
			"registerMultiTask"
		]);
		glob = jasmine.createSpyObj("glob", [
			"sync"			// Get template list
		]);
		req = jasmine.createSpy("require");
		req.and.callFake(function(path) {
			return {};
		});
		fs = jasmine.createSpyObj("fs", [
			"readdirSync",	// Read for builder list
			"readFileSync",	// Read Template File
			"writeFileSync"	// Write output file
		]);
		
		// Read for builder list
		fs.readdirSync.and.callFake(function() {
			return builders;
		});

		grunt._$glob = glob;
		grunt._$fs = fs;
		grunt._$jasmineTest = {};
		grunt._$require = req
		
		builders = ["builderA", "builderB"];
	});
	
	it("Registers with grunt as a MultiTask", function() {
		templifier(grunt);
		expect(grunt.registerMultiTask).toHaveBeenCalled();
	});
	
	it("Finds all builders", function() {
		templifier(grunt);
		expect(req).toHaveBeenCalledTimes(builders.length);
	});
	
	it("Throws an appropriate error when the 'templates' key is missing", function() {
		grunt.registerMultiTask.and.callFake(function(skip, pass, keep) {
			grunt._$jasmineTest.options = function() {
				return {
					"templates": false
				};
			};
			expect(keep).toThrow();
		});
		templifier(grunt);
	});
});
