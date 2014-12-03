controllers = angular.module("proBebe.controllers")
controllers.controller "MessagesCtrl", ($scope, MessagesService) ->
  $scope.messages = []
  MessagesService.getMessages().then (result) ->
    window.msgScope = $scope
    $scope.messages.splice(0, $scope.messages.length)
    result.map (message_delivery) ->
      $scope.messages.push message_delivery.message
