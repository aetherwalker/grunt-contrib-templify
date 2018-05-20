module.exports = {
	"mode": "vue",
	"prefix": function() {
		return "Templify = {}; Templify.install = function(Vue, options) {\n" +
				"\tVue.templified = function(name) {\n" +
				"\t\tswitch(name) {\n";
	},
	"generator": function(template) {
		return "\t\t\tcase(\"" + template.name + "\": return " + JSON.stringify(template.html) + ";\n";
	},
	"suffix": function() {
		return "\t\t\tdefault: return null;\n" +
				"\t\t}\n" +
				"\t};\n" +
				"};\n";
	}
};
