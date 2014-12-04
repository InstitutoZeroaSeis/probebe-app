var controllers;

controllers = angular.module("proBebe.controllers");

controllers.controller("MessagesCtrl", function($scope, messages) {
  $scope.messages = [];
  messages.getMessages().then(function(result) {
    window.msgScope = $scope;
    $scope.messages.splice(0, $scope.messages.length);
    result.forEach(function(message_delivery) {
      $scope.messages.push(message_delivery.message);
    });
  });
});
