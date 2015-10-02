angular.module("proBebe.controllers")
.controller("ProfileCtrl", function($scope, $ionicLoading, $state, $http, Constants, authentication, storage) {
  $scope.profile = {
    name: authentication.name()
  };

});

