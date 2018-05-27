
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
		options = {};
		
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
	
	it("Has valid output without autoAffix", function() {
		var concated = templifier.prefix(options);
		templates.forEach(function(template) {
			concated += templifier.generator(template, options);
		});
		concated += templifier.suffix(options);
		
		eval(concated);
		
		expect(vue.templified).toBeUndefined();
		expect(Vue.use).not.toHaveBeenCalled();
	});
	
	it("Has valid output with autoAffix", function() {
		options.autoAffix = true;
		
		var concated = templifier.prefix(options);
		templates.forEach(function(template) {
			concated += templifier.generator(template, options);
		});
		concated += templifier.suffix(options);
		
		eval(concated);
		
		expect(vue.templified).toBeDefined();
		expect(Vue.use).toHaveBeenCalled();
	});
});
