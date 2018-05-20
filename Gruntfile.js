

module.exports = function(grunt) {

	require("load-grunt-tasks")(grunt);

	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-karma");
	grunt.loadNpmTasks("jasmine");
	
	var gconfig = {
			eslint: {
				options: {
					ecmaFeatures: {
						modules: true
					},
					/* http://eslint.org/docs/rules/ */
					rules: {
						eqeqeq: 0,
						curly: 0,
						quotes: [2, "double"],
						"block-scoped-var": 2,
						"no-undef": 2,
						"semi": 2,
						"no-unused-vars": [1, {varsIgnorePattern: "^drop"}]
					},
					globals: ["__dirname",
						"module",
						"require",
						"process",
						"console"],
					envs: ["jasmine", "angular"]
				},
				contrib: ["tasks/*.js", "builders/*.js"]
			},
			watch: {
				contrib: {
					files: ["tasks/*.js", "builders/*.js", "spec/**/*.js"],
					tasks: ["test"]
				}
			},
			jasmine: {
				"spec_dir": "spec",
				"spec_files": [
					"**/*-[sS]pec.js"
				],
				"helpers": [
					"helpers/**/*-addon.js"
				]
			},
			jasmine_nodejs: {
				options: {
					specNameSuffix: "spec.js",
					helperNameSuffix: "helper.js",
					useHelpers: true,
					stopOnFailure: true,
					reporters: {
		                console: {
		                    colors: true,        // (0|false)|(1|true)|2
		                    cleanStack: 1,       // (0|false)|(1|true)|2|3
		                    verbosity: 4,        // (0|false)|1|2|3|(4|true)
		                    listStyle: "indent", // "flat"|"indent"
		                    activity: false
		                },
						junit: {
							savePath : "./spec/reports",
							filePrefix: "unit",
							useDotNotation: true,
							consolidate: false
						}
					}
				},
				unit: {
					spec: ["./spec/**/*.js"],
					helpers: []
				}
			}
	};
	
	/* Initialize Grunt with the loaded configuration */
	grunt.initConfig(gconfig);

	/* Set tasks */
	grunt.registerTask("jasmine", function() {
		var Reporter, reporter;
		var Jasmine = require("jasmine");
		var jasmine = new Jasmine();
		var done = this.async();

		jasmine.configureDefaultReporter(false);
		jasmine.onComplete(done);
		jasmine.loadConfig({
			"spec_dir": "spec",
			"spec_files": [
				"**\/*-[sS]pec.js"
			],
			"helpers": [
				"helpers\/**\/*-addon.js"
			]
		});
		
		Reporter = require("jasmine-console-reporter");
		reporter = new Reporter({
			colors:2,
			verbosity: 3,
			emoji: false
		});
		jasmine.addReporter(reporter);

		jasmine.execute();
	});
	
	grunt.registerTask("default", ["eslint:contrib"]);
	grunt.registerTask("dev", ["watch"]);
	grunt.registerTask("test", ["eslint:contrib", "jasmine"]);
};
