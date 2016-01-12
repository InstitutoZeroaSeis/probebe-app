var controllers;

controllers = angular.module("proBebe.controllers");

controllers.controller("MessagesCtrl", function($ionicPlatform, $scope, $state, $rootScope, $ionicPopup, $ionicModal, $cordovaToast, $window, $cordovaSocialSharing, $ionicLoading, Child, Profile, ChildAgePresenter, Constants, Microdonation, storage, messageHandler, BirthdayCard) {
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

      if($scope.selectedChild == undefined) $scope.showNoMessage = true;
      defineStatusOfMessages();
      getBirthdayCard($scope.selectedChild);

    }).catch(function(err) {
      loading.hide();
      $cordovaToast.showLongBottom('Não foi possível carregar as mensagens');
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
      showLoading($ionicLoading, "Não foi possível buscar cartão de aniversário");
    })
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

  $scope.openInNewPage = function(message) {
    message.isNew = false;
    var readMessage = storage.get('readMessage');
    readMessage.push(message.id);
    storage.set('readMessage', readMessage);
    // $window.open(message.url, '_system');
    $scope.article ={
      text: message.article_text,
      title: message.article_title
    }
    $state.go('article', $scope.article);
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
