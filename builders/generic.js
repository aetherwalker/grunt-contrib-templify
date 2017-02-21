module.exports = {
	"mode": "generic",
	"prefix": function() {
		return "var __templates = {}; var __templifyTemplates = function() {\n";
	},
	"generator": function(template) {
		return "\t__templates[\"" + template.name + "\"] = " + JSON.stringify(template.html) + ";\n";
	},
	"suffix": function() {
		return "};\n";
	}
};
