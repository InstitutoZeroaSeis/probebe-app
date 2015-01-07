var controllers;

controllers = angular.module("proBebe.controllers");

controllers.controller("MessagesCtrl", function($scope, $ionicPopup, Child) {
  function getChildren() {
    $scope.children = Child.query();
  }

  $scope.$on('pushMessageReceived', getChildren);
  getChildren();
});
