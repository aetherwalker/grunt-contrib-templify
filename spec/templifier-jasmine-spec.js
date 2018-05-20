
describe("Karma:Angular template creation mode", function() {
	
	var templifier = require("../builders/karma-angular.js");
	
	var templates;
	
	beforeEach(function() {
		templates = [];
		templates.push({
			"name": "example1",
			"html": "<h1></h1>"
		});
		templates.push({
			"name": "example2",
			"html": "<h2></h2>"
		});
	});
	
	it("Has the correct mode", function() {
		expect(templifier.mode).toBe("karma-angular");
	});
	
	it("Has a prefix, generator, and suffix method", function() {
		expect(templifier.prefix).toBeDefined();
		expect(templifier.generator).toBeDefined();
		expect(templifier.suffix).toBeDefined();
	});
	
	it("Has valid output", function() {
		var concated = templifier.prefix();
		templates.forEach(function(template) {
			concated += templifier.generator(template);
		});
		concated += templifier.suffix();
		
		eval(concated);
		
		expect(__templifyTemplates).toBeDefined();
	});
});
