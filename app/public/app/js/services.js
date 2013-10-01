'use strict';

/* Services */
var module = angular.module('nsApp.services', []).
value('version', '0.1').
value('name', 'Arrange');


angular.module('nsApp.services.task', []).factory('Task', ['$http', function ($http)
{
	var Task = {};

	Task.add = function(params, callback){
		$http.post('/a/tasks/new', params).success(function (data)
		{
			if (data.error === undefined) {
				if (typeof callback == 'function') {
					callback(data);
				}
			} else{
				callback({});
			}
		});
	}

	Task.all = function(callback){
		$http.get('/a/tasks').success(function (data)
		{
			if (data.error === undefined) {
				if (typeof callback == 'function') {
					callback(data);
				}
			} else{
				callback({});
			}
		});
	}
	return Task;
}]);