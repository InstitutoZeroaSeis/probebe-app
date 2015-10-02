angular.module("proBebe.controllers")
.controller("ProfileCtrl", function($scope, $ionicLoading, $state, $http, Constants, authentication, storage) {
  $scope.profile = {
    name: authentication.name(),
    sons: [{name: "", bornDate: "", sex: ""}]
  };

  $scope.addSon = function(){
    $scope.profile.sons.push({name: "", bornDate: "", sex: ""})
  }

});

