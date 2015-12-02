angular.module("proBebe.controllers")
.controller("AboutCtrl", function($scope, $state) {

  $scope.index = function(){
    console.log("call")
    $state.go('about');
  }
});

