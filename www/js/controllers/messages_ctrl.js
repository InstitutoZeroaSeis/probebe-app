var controllers;

controllers = angular.module("proBebe.controllers");

controllers.controller("MessagesCtrl", function($ionicPlatform, $scope, $state, $rootScope, $ionicPopup, $cordovaToast, $window, Child) {
  $rootScope.$on('networkOffline', function(event, networkState) {
    $cordovaToast.showLongBottom('Sem conexão');
  });

  function getChildren() {
    $scope.children = Child.query(function() {
      if (!$scope.selectedChild) {
        $scope.selectedChild = $scope.children[0];
      }
    }, function(err) {
      console.log(err);
      $cordovaToast.showLongBottom('Não foi possível carregar as mensagens');
    });
  }

  $scope.selectChild = function(child) {
    $scope.selectedChild = child;
    $rootScope.$emit('childSelected', child);
    $state.go('messages');
  };

  $scope.openInBrowser = function(url) {
    $window.open(url, '_system');
  }

  $scope.$on('childSelected', function(child) {
    $scope.selectedChild = child;
  });

  $scope.$on('pushMessageReceived', getChildren);
  getChildren();
});
