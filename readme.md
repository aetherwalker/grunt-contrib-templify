# grunt-contrib-templify
> Quick and dirty HTML to Javascript strings

This project is designed to be a quick and simple solution to converting HTML files to templates in javascript under various conditions.

This was started specifically to fill a need for unit tests to get HTML templates in angular and make them available for use in Jasmine tests with Angular V1. As such the initial versions of this project will center around that process.

## Getting Started
This project is designed for use with Grunt. If you don't already have it installed:  
```shell
npm install grunt --save-dev
```

To get this project added:  
```shell
npm install grunt-contrib-templify --save-dev
```

Then inside your grunt file you'll need to add a line to load this project:
```javascript
```

Then configure the templify task in your grunt configuration (See below).

## Templify Task

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### templates
Type: `Array`

This is an array of objects that describe how to process a directory. Each directory can be passed options for how to build the template.

#### templates[].path
Type: `String`

The path to the folder where the templates are currently located

#### templates[].rewrite
Type: `Function(String, Object)`
Optional

This function is passed the current path to the template and is expected to return the name to use for the template, which by default is merely the current path. This options allos the name to programmatically created based on the path to the template.

The second argument is the current directory object **templates[]** for further manipulation if desired.

#### templates[].module
Type: `String`

*Currently unused.* Future use to allow separation of templates to be declared into their respective angular modules.

#### templates[].trim
Type: `String`

*Currently unused.* Future use to specify text to trim from the begining or end of the path. This is more accurately accomplished with **templates[].rewrite**.

#### templates[].prefix
Type: `String`

*Currently unused.* Future use to apply a simple prefix to the template name. This is more accurately accomplished with **templates[].rewrite**.

#### templates[].suffix
Type: `String`

*Currently unused.* Future use to apply a simple suffix to the template name. This is more accurately accomplished with **templates[].rewrite**.


#### mode
Type: `String`

Indicates how the output file should be written, specifically it indicates what builder to use when processing the template cache creation.

#### output
Type: `String`

Indicates where to output the javascript.

## Usage Examples
This is currently being written to quickly fill a specific issue of getting HTML templates into Jasmine tests for Angular while using Karma without too much craziness.

### Karma & Jasmine
The current process is designed to be simple but not as smooth as desired. Initially the Grunt configuration needs to be put in place:
```javascript
templify: {
	testing: {
		templates: [{
			path: "templates/",
			rewrite: function(path) {
				return path.substring(path.lastIndexOf("/") + 1);
			}
		}],
		suffixes: [".html"],
		mode: "karma-angular",
		output: "spec/templates.js"
	}
}
```
(Note: that "testing" is an arbitrary label)

Once the grunt process is described, the templify:testing task will need to preceed the karma task for testing. The idea being that the generated javascript file will then be provided to karma, where the declarations for the templates to pass to angular are ready in a function named **__templifyTemplates**. Then inside the jasmine tests:
```javascript
	//...
	beforeEach(inject(function($templateCache) {
		__templifyTemplates($templateCache);
	}));
	//...
```

Now when using angular later, the templates can be pulled from the $templateCache for use in unit and functional tests.