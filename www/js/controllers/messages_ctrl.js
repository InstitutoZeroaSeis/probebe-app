var controllers;

controllers = angular.module("proBebe.controllers");

controllers.controller("MessagesCtrl", function($scope, $rootScope, $ionicPopup, Child) {
  function getChildren() {
    $scope.children = Child.query(function() {
      if (!$scope.selectedChild) {
        $scope.selectedChild = $scope.children[0];
      }
    });
  }

  $scope.selectChild = function(child) {
    $scope.selectedChild = child;
    $rootScope.$emit('childSelected', child);
  }

  $scope.$on('childSelected', function(child) {
    $scope.selectedChild = child;
  });

  $scope.$on('pushMessageReceived', getChildren);
  getChildren();
});
