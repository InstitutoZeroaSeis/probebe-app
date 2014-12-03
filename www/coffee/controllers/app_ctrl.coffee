controllers = angular.module("proBebe.controllers")
controllers.controller "AppCtrl", ($scope, $state) ->
  $scope.signOut = ->
    localStorage.clear()
    $state.go('app.signin')
