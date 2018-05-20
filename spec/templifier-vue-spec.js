
describe("Vue template creation mode", function() {
	
	var templifier = require("../builders/vue.js");
	
	var Vue, vue, options, sourceDir, templates;
	
	beforeEach(function() {
		Vue = jasmine.createSpyObj("Vue", ["use"]);
		Vue.use.and.callFake(function(installing) {
			expect(installing.install).toBeDefined();
			installing.install(vue);
		});
		
		vue = {};
		
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
		expect(templifier.mode).toBe("vue");
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
		
		expect(vue.templified).toBeDefined();
		expect(Vue.use).toHaveBeenCalled();
	});
});
