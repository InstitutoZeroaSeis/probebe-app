var controllers;

controllers = angular.module("proBebe.controllers");

controllers.controller('ToggleBgController', function($scope) {
	var rand = Math.floor((Math.random() * 4) + 1);
  $scope.bg = 'bg-'+rand;
});