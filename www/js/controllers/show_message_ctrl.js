var controllers;

controllers = angular.module("proBebe.controllers");

controllers.controller("ShowMessageCtrl", function($scope, $stateParams, Message) {
  $scope.message = Message.get({id: $stateParams.id});

  $scope.toggle = function(){
    alert('aaa');
  }
});
