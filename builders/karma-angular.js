module.exports = {
	"mode": "karma-angular",
	"prefix": function() {
		return "var __templifyTemplates = function() { beforeEach(inject(function($templateCache) {\n";
	},
	"generator": function(template) {
		return "\t$templateCache.put(\"" + template.name + "\", " + JSON.stringify(template.html) + ");\n";
	},
	"suffix": function() {
		return "}));};\n";
	}
};
