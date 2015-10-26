var controllers;

controllers = angular.module("proBebe.controllers");

controllers.controller("MessagesCtrl", function($ionicPlatform, $scope, $state, $rootScope, $ionicPopup, $ionicModal, $cordovaToast, $window, $cordovaSocialSharing, $ionicLoading, Child, Profile, Constants, Microdonation, storage) {
  $rootScope.$on('networkOffline', function(event, networkState) {
    $cordovaToast.showLongBottom('Sem conexão');
  });

  var loadingData = {
    noBackdrop: true
  }

  function init() {
    Profile.get()
    .then(function(response) {
      $scope.profile = response.data
        $scope.children = $scope.profile.children;
      if (!$scope.selectedChild) {
        $scope.selectedChild = $scope.profile.children[0];
        defineStatusOfMessages();
        initDonationProcess();
      }
    }).catch(function(err) {
      console.log(err);
      $cordovaToast.showLongBottom('Não foi possível carregar as mensagens');
    });
  }

  function defineStatusOfMessages () {
    var readMessage = storage.get('readMessage');
    if(readMessage == null) readMessage = [];
    $scope.selectedChild.messages.forEach(function(message){
      if(readMessage.indexOf(message.id) == -1) message.isNew = true;
    });
    storage.set('readMessage', readMessage);
  }

  function showLoading(ionicLoading, text) {
    loadingData.template = text;
    ionicLoading.show(loadingData);
  }


  function initDonationProcess() {
    Microdonation.setProfileType($scope.profile.profile_type);
    if(Microdonation.isProfileDonor()){
      Microdonation.sendMessages(function(){

      });
    }
  }

  $scope.selectChild = function(child) {
    $scope.selectedChild = child;
    $rootScope.$emit('childSelected', child);
    $state.go('messages');
  };

  $scope.openInBrowser = function(url, id) {
    var readMessage = storage.get('readMessage');
    readMessage.push(id);
    storage.set('readMessage', readMessage);
    $window.open(url, '_system');
    init();
  }

  $scope.shareMessage = function(message, link){
    var subject = "Pro Bebê";
    $cordovaSocialSharing
    .share(message, subject, null, link) // Share via native share sheet
    .then(function(result) {
      showLoading($ionicLoading, "Mesagem compartilhada :)");
       $ionicLoading.hide();
    }, function(err) {
      showLoading($ionicLoading, "Erro em compartilhar messagem.");
       $ionicLoading.hide();
    });
  }

  $scope.$on('childSelected', function(child) {
    $scope.selectedChild = child;
  });

  $scope.$on('pushMessageReceived', init);
  init();
});
