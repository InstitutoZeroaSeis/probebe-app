angular.module("proBebe.controllers")
.controller("AboutCtrl", function($scope, $state) {

  $scope.index = function(){
    $state.go('about');
  }
});

