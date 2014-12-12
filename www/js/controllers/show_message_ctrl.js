var controllers;

controllers = angular.module("proBebe.controllers");

controllers.controller("ShowMessageCtrl", function($scope, $stateParams) {
  $scope.message = { id: $stateParams.id, text: "test" };
});
