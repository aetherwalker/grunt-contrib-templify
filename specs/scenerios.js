
describe("Templify Karma-Angular template processing", function() {

	var $compile, $scope;
	var template, html, element;

	beforeEach(inject(function($templateCache) {
		__templifyTemplates($templateCache);
	}));

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
