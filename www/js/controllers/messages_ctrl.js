var controllers;

controllers = angular.module("proBebe.controllers");

controllers.controller("MessagesCtrl", function($ionicPlatform, $scope, $state, $rootScope, $ionicPopup, $ionicModal, $cordovaToast, $window, Child, Profile, Constants, Microdonation) {
  $rootScope.$on('networkOffline', function(event, networkState) {
    $cordovaToast.showLongBottom('Sem conexão');
  });

 $ionicModal.fromTemplateUrl('microdonation-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  function getChildren() {
    $scope.profile = Profile.get(function() {
      if (!$scope.selectedChild) {
        $scope.selectedChild = $scope.profile.children[0];
        initDonationProcess();
      }
    }, function(err) {
      console.log(err);
      $cordovaToast.showLongBottom('Não foi possível carregar as mensagens');
    });
  }

  function initDonationProcess() {
    Microdonation.setProfileType($scope.profile.profile_type);
    if(Microdonation.isProfilePossibleDonor()){
      Microdonation.openPopup($scope);
    }else{
      Microdonation.sendMessages(function(){

      });
    }
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
