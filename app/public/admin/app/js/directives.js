'use strict';

/* Directives */
angular.module('admin_nsApp.directives', []).
directive('appVersion', ['version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}]);


angular.module('admin_nsApp.directives');