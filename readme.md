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
templify: {
    // ...
}
```

Then configure the templify task in your grunt configuration (See below).

## Templify Task

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Modes

Below is a general description of what the task is doing referenced by the various supported "modes"

#### generic

The task creates a function that handles binding a beforeEach clause that adds the templates to a global template variable. The equivalent code for __templifyTemplates as an example:

```javascript
var __templates = {};
beforeEach( function($templateCache) {
	__templates["..."] = "...";
	__templates["..."] = "...";
	// ...
} );
```

#### angular

The task creates a function that simply binds the templates to the $templateCache. The generated function for *__templifyTemplates* as an example:

```javascript
function($templateCache) {
	$templateCache.put("...", "...");
	$templateCache.put("...", "...");
	// ...
};
```

#### vue

The task creates a Vue Plugin to provide the HTML files as templates:

```javascript
var Templify = {};
Templify.install = function(Vue, options) {
	Vue.templified = function(name) {
		switch(name) {
			case "[Filename]": return [Template];
			//...
			default: return undefined;
		}
	};
};

```
To use the Plugin, your code will have to call

```javascript
Vue.use(Templify);
```

And then your components should be able to access their templates:

```javascript
Vue.component("example", {
	// ...
	"template": Vue.templified("[Filename]")
});
```

The Vue plugin accepts several option parameters as well

##### Vue: options.name
Type: `String`  
Default: 'templified'

Sets the name of the method off of `Vue` where the templates are amde available. 

#### jasmine-angular (Also karma-angular)

The task creates a function that handles binding a beforeEach clause that adds the templates to the $templateCache. The equivalent code for __templifyTemplates as an example:

```javascript
beforeEach( inject( function($templateCache) {
	$templateCache.put("...", "...");
	$templateCache.put("...", "...");
	// ...
} ) );
```


### Options

#### appRoot
Type: `String`  
Optional

Specifies the root directory for scanning files and writing output files. Useful when using abstract layers such as mocha or PM2.

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
		output: "specs/templates.js"
	}
}
```

(Note: that "testing" is an arbitrary label)

Once the grunt process is described, the templify:testing task will need to preceed the karma task for testing. The idea being that the generated javascript file will then be provided to karma, where the declarations for the templates to pass to angular are ready in a function named **__templifyTemplates**. Then inside the jasmine tests.

In Karma's Grunt declaration:

```javascript
karma: {
	options: {
		// ...
		files: [
			// Dependencies...
			"specs/templates.js",
			// Tests...
			]
	},
	// ...
}
```

In your Jasmine tests:

```javascript
	// ...
	/* Creates a beforeEach clause in Jasmine to bind the templates to the Template cache */
	__templifyTemplates();
	// ...
```

Now when using angular later, the templates can be pulled from the $templateCache for use in unit and functional tests.

For Example:

```javascript
describe("Templify Karma-Angular template processing", function() {
	var $compile, $scope;
	var template, html, element;

	__templifyTemplates();

	describe("Templating", function() {
		beforeEach(inject(function(_$compile_, _$rootScope_) {
			$compile = _$compile_;
			$scope = _$rootScope_.$new();
		}));

		it("passes standard checks", inject(function($templateCache) {
			$scope.title = "Titling";
			$scope.paragraph = "This is some text";

			template = $compile($templateCache.get("angular-template1.html"))($scope);
			$scope.$digest();
			html = template.html();

			expect(html).toContain($scope.title);
			expect(html).toContain($scope.paragraph);
			expect(html).not.toContain("title");
			expect(html).not.toContain("paragraph");
		}));
	});
});

```