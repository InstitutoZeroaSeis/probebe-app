var controllers;

controllers = angular.module("proBebe.controllers");

controllers.controller("MessagesCtrl", function($ionicPlatform, $scope, $rootScope, $state, $ionicPopup, $ionicModal, $cordovaToast, $window, $cordovaSocialSharing, Child, Profile, ChildAgePresenter, Constants, Microdonation, storage, messageHandler, BirthdayCard) {
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

  function init(loading) {
    $scope.showNoMessage = false;
    Profile.get()
    .then(function(response) {
      $scope.profile = response.data
      $scope.children = ChildAgePresenter.build($scope.profile.children);

      if ($rootScope.selectedChild == undefined) {
        $rootScope.selectedChild = $scope.profile.children[0];
        // initDonationProcess();
      }

      if($rootScope.selectedChild.messages.length == 0) $scope.showNoMessage = true;
      defineStatusOfMessages();
      getBirthdayCard($rootScope.selectedChild);
      if(loading) loading.hide();
    }).catch(function(err) {
      if(loading) loading.hide();
      messageHandler.show('Não foi possível carregar as mensagens');
    });
  }

  function getBirthdayCard(child){
    $scope.birthdayCard = {show:false};
    //0 week and 1 month
    var type = "1";
    var params = {
      type: type,
      age: child.age_in_weeks / 4
    };
    if(child.pregnancy){
      params.type = "0";
      params.age = child.age_in_weeks
    }

    BirthdayCard.get(params)
    .then(function(response){

      if(response.data != null){
        $scope.birthdayCard = response.data;
        $scope.birthdayCard.show = true;

        if(!params.type){
          $scope.birthdayCard.age_text = "completou " + $scope.birthdayCard.age + " semana(s)";
        }else{
          var month = $scope.birthdayCard.age;
          month > 1 ? $scope.birthdayCard.age_text = "completou " + month + " meses!" : $scope.birthdayCard.age_text = month + " mês!";
        }
      }
    }).catch(function(error){
      messageHandler.show("Não foi possível buscar cartão de aniversário");
    })
  }

  function defineStatusOfMessages () {

    var lastMessage = storage.get('lastMessage');
    if(lastMessage == null) lastMessage = "0";

    $scope.profile.children.forEach(function(child){
      var newMessagesTotal = 0;
      child.messages.forEach(function(message){
        if(lastMessage < message.id) {
          message.isNew = true;
          newMessagesTotal +=1;
          lastMessage = message.id;
        }
      });
      child.newMessagesTotal = newMessagesTotal;
    });

    storage.set('lastMessage', lastMessage);
  }

  function initDonationProcess() {
    Microdonation.setProfileType($scope.profile.profile_type);
    if(Microdonation.isProfileDonor()){
      Microdonation.sendMessages();
    }
  }

  $scope.selectChild = function(child) {
    var loading = messageHandler.show("Carregando...");
    $rootScope.selectedChild = child;
    init(loading);
    $state.go("messages");
  };

  $scope.openInNewPage = function(message) {
    $rootScope.article ={
      text: message.article_text,
      title: message.article_title
    }
    $state.go('article');
  }

  $scope.shareMessage = function(message, link){
    var subject = "Pro Bebê";
    $cordovaSocialSharing
    .share(message, subject, null, link) // Share via native share sheet
    .then(function(result) {
      messageHandler.show("Mesagem compartilhada :)");
    }, function(err) {
      messageHandler.show("Erro em compartilhar messagem.");
    });
  }

  $scope.srcImg = function(category){
    return "img/"+ category + ".png";
  }

  $scope.$on('pushMessageReceived', init);

  init();
});
