

module.exports = function(grunt) {

	require("load-grunt-tasks")(grunt);

	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-karma");
	
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
					globals: ["__dirname", "module", "require", "console"],
					envs: ["jasmine", "angular"]
				},
				contrib: ["tasks/*.js", "builders/*.js"]
			},
			watch: {
				contrib: {
					files: ["tasks/*.js", "builders/*.js"],
					tasks: ["eslint", "jasmine_nodejs"]
				}
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
							savePath : "./spec/reports/jasmine",
							filePrefix: "unit",
							useDotNotation: true,
							consolidate: false
						}
					}
				},
				unit: {
					specs: "./spec/**",
					helpers: []
				}
			},
			karma: {
				options: {
					reporters: ["spec", "junit"],
					frameworks: ["jasmine"],
					singleRun: true,
					browsers: ["PhantomJS"],
					junitReporter: {
						outputDir: "./reports/jasmine", // results will be saved as $outputDir/$browserName.xml
						outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
						suite: "", // suite will become the package name attribute in xml testsuite element
						useBrowserName: true, // add browser name to report and classes names
						nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
						classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
						properties: {} // key value pair of properties to add to the <properties> section of the report
					},
					specReporter: {
						maxLogLines: 1,         // limit number of lines logged per test 
						suppressErrorSummary: true,  // do not print error summary 
						suppressFailed: false,  // do not print information about failed tests 
						suppressPassed: false,  // do not print information about passed tests 
						suppressSkipped: true,  // do not print information about skipped tests 
						showSpecTiming: false // print the time elapsed for each spec 
					},
					files: [
						"node_modules/angular/angular.js",
						"node_modules/angular-mocks/angular-mocks.js",
						"specs/templates.js",
						"specs/scenerios.js"
						]
				},
				unit: {
					singleRun: true,
				},
				continuous: {
					singleRun: false
				}
			}
	};

	if(process.argv[2] === "self") {
		var templifier = require("./tasks/templifier.js");
		templifier(grunt);
		gconfig.templify = {
			testing: {
				templates: [{
					path: "specs/templates/",
					rewrite: function(path) {
						return path.substring(path.lastIndexOf("/") + 1);
					}
				}],
				suffixes: [".html"],
				mode: "karma-angular",
				output: "specs/templates.js"
			}
		};
	}
	
	/* Initialize Grunt with the loaded configuration */
	grunt.initConfig(gconfig);

	/* Set tasks */
	grunt.registerTask("default", ["eslint:files"]);
	grunt.registerTask("test", ["eslint:contrib", "jasmine_nodejs"]);
//	grunt.registerTask("karma", ["eslint:contrib", "karma:continuous"]);
	grunt.registerTask("dev", ["watch"]);
	
	grunt.registerTask("self", ["eslint:contrib", "jasmine_nodejs", "templify:testing", "karma:unit"]);
};
