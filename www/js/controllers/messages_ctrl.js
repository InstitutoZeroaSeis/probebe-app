var controllers;

controllers = angular.module("proBebe.controllers");

controllers.controller("MessagesCtrl", function($ionicPlatform, $scope, $state, $rootScope, $ionicPopup, $ionicModal, $cordovaToast, $window, $cordovaSocialSharing, $ionicLoading, Child, Profile, ChildAgePresenter, Constants, Microdonation, storage, messageHandler) {
  $rootScope.$on('networkOffline', function(event, networkState) {
    $cordovaToast.showLongBottom('Sem conexão');
  });

  // $rootScope.$on('showBadge', function() {
  //   $scope.donation = {
  //     showBadge: true
  //   }
  // });

  var loadingData = {
    noBackdrop: true
  }

  function init() {
    var loading = messageHandler.showWithTemplate();
    Profile.get()
    .then(function(response) {
      loading.hide();
      $scope.profile = response.data
      $scope.children = ChildAgePresenter.build($scope.profile.children);

      if (!$scope.selectedChild) {
        $scope.selectedChild = $scope.profile.children[0];
        // initDonationProcess();
      }

      if($scope.selectedChild.messages.length == 0) $scope.showNoMessage = true;
      defineStatusOfMessages();
    }).catch(function(err) {
      loading.hide();
      $cordovaToast.showLongBottom('Não foi possível carregar as mensagens');
    });
  }

  function defineStatusOfMessages () {
    $scope.newMessagesTotal = 0;
    var readMessage = storage.get('readMessage');
    if(readMessage == null) readMessage = [];

    $scope.selectedChild.messages.forEach(function(message){
      if(readMessage.indexOf(message.id) == -1) {
        message.isNew = true;
        $scope.newMessagesTotal +=1;
      }
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
      Microdonation.sendMessages();
    }
  }

  $scope.selectChild = function(child) {
    $scope.selectedChild = child;
    $rootScope.$emit('childSelected', child);
    $state.go('messages');
  };

  $scope.openInBrowser = function(message) {
    message.isNew = false;
    var readMessage = storage.get('readMessage');
    readMessage.push(message.id);
    storage.set('readMessage', readMessage);
    $window.open(message.url, '_system');
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

  $scope.srcImg = function(category){
    return "img/"+ category + ".png";
  }

  $scope.$on('childSelected', function(child) {
    $scope.selectedChild = child;
  });

  $scope.$on('pushMessageReceived', init);
  init();
});
