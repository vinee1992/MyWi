'use strict';
var releasePlannerApp = angular.module('releasePlannerApp', ['ngRoute']);
releasePlannerApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when("/newRelease", {
		templateUrl : "releaseplanner/newRelease",
		controller : "newReleaseController"
	}).when("/sprintDetails", {
		templateUrl : "sprintDetails",
		controller : "SprintDetailsController"	
	})
	
	
}


]);

