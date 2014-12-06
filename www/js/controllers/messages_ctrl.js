var controllers;

controllers = angular.module("proBebe.controllers");

controllers.controller("MessagesCtrl", function($scope, messages) {
  $scope.messages = [];

  function messagesReceived() {
    $scope.messages.splice(0, $scope.messages.length);
    result.forEach(function(message_delivery) {
      $scope.messages.push(message_delivery.message);
    });
  }

  function getMessages() {
    messages.getMessages().then(messagesReceived);
  }

  $scope.$on('pushMessageReceived', getMessages);

  getMessages();
});
