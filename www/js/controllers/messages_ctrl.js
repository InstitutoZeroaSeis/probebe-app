var controllers;

controllers = angular.module("proBebe.controllers");

controllers.controller("MessagesCtrl", function($ionicPlatform, $scope, $rootScope, $state, $ionicPopup, $ionicModal, $cordovaToast, $window, $cordovaSocialSharing, Child, Profile, ChildAgePresenter, Constants, Microdonation, storage, messageHandler, BirthdayCard, Message) {
  $rootScope.$on('networkOffline', function(event, networkState) {
    $cordovaToast.showLongBottom('Sem conexão');
  });


  function init(loading) {
    $scope.$emit('allMessages');
    $scope.showNoMessage = false;
    defineMessage(loading);
  }

  function defineMessage(loading){
    var profile = storage.get("profile");
    child();
    profile.children.forEach(function(child){
      if(child.id == childId()){
        $scope.messages = child.messages
        defineShowNoMessage()
        getBirthdayCard($scope.selectedChild);
        if(isNotEvent(loading)) loading.hide();
      }
    })

  }

  function childId(){
    if($state.params.childId) return $state.params.childId;
    return storage.get("profile").children[0].id
  }

  function child(){
    storage.get("profile").children.forEach(function(child){
      if(child.id == childId()) $scope.selectedChild = child;
    });
  }

  function isNotEvent(loading){
    return loading != undefined && loading.name != 'finishRequest'
  }

  function defineShowNoMessage(){
    try{
      if($scope.messages.length == 0) $scope.showNoMessage = true;
    }catch(error){
      $scope.showNoMessage = true;
    }
  }

  function getBirthdayCard(child){
    $scope.birthdayCard = {show:false};
    //0 week and 1 month
    var type = "1";
    var params = {
      type: type,
      age: child.age_in_weeks / 4
    };
    if(child){
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
  }

  function initDonationProcess() {
    Microdonation.setProfileType($scope.profile.profile_type);
    if(Microdonation.isProfileDonor()){
      Microdonation.sendMessages();
    }
  }

  $scope.openInNewPage = function(message) {
    $rootScope.article ={
      text: message.article_text,
      title: message.article_title
    }
    $state.go('app.article');
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
  $rootScope.$on('finishRequest', defineMessage);
  init();
});
