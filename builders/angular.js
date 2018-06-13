module.exports = {
	"mode": "angular",
	"prefix": function() {
		return "var __templifyTemplates = function($templateCache) {\n";
	},
	"generator": function(template) {
		return "\t$templateCache.put(\"" + template.name + "\", " + JSON.stringify(template.html) + ");\n";
	},
	"suffix": function(options) {
		return "};\n" +
		(options.autoAffix?"angular.module(" + options.module + ").run(__templifyTemplates);":"");
	}
};
