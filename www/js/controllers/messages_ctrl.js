var controllers;

controllers = angular.module("proBebe.controllers");

controllers.controller("MessagesCtrl", function($ionicPlatform, $scope, $rootScope, $state, $ionicPopup, $ionicModal, $cordovaToast, $window, $cordovaSocialSharing, Child, Profile, ChildAgePresenter, Constants, Microdonation, storage, messageHandler, BirthdayCard, Message, Category) {

  $rootScope.$on('networkOffline', function(event, networkState) {
    $cordovaToast.showLongBottom('Sem conexão');
  });

  function init() {
    $scope.infoApp = storage.get("infoApp");
    var childIdParams = $state.params.childId;
    if(noChildId(childIdParams)){
      defineOptionsChild();
    }else{
      $scope.messages = storage.get("messages_" + childIdParams);
      getMessage(childIdParams);
    }
    loadCategories();
  }

  function loadCategories () {
    Category.all()
    .then(function(categories){
    }, function (error) {
      console.log(error);
    })
  }

  function getMessage (childId) {
    $scope.loadingMessages = true;
    Message.all({id: childId}).then(function(messages){
      storage.set("messages_" + childId, ChildAgePresenter.build(messages.data));
      $scope.messages = storage.get("messages_" + childId);
      getBirthdayCard(childId);
      $scope.loadingMessages = false;
      messageState();
    },function(error){
      $scope.loadingMessages = false;
      messageHandler.show('Não foi possível carregar as mensagens');
    });
  }

  function noChildId (childIdParams) {
    return isNaN(childIdParams);
  }

  function messageState () {
    $scope.messageState = $scope.messages == undefined || $scope.messages.length === 0;
  }

  function defineOptionsChild () {
    $scope.childrenOptions = true;
    $scope.children = storage.get("profile").children;
    $scope.messageState = false;
    if($scope.children.length == 1){
      $scope.childrenOptions = false;
      getMessage($scope.children[0].id);
    }
  }

  function getChild(childId){
    return storage.get("profile").children.filter(function(child){
      return child.id == childId;
    })[0];
  }

  function getBirthdayCard(childId){
    var child =  getChild(childId);
    $scope.birthdayCard = {show:false};
    //0 week and 1 month
    var type = "1";
    var params = {
      type: type,
      age: parseInt(child.age_in_weeks * 7 / 30)
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
      title: message.article_title,
      category: message.article_category,
      category_id: message.category
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

  $scope.loadMessageBy = function(childId) {
    $scope.childrenOptions = false;
    getMessage(childId);
  }

  $scope.closeInfoApp = function () {
    storage.set("infoApp", false);
    $scope.displayNone = {display:'none'}
  }

  $scope.$on('pushMessageReceived', init);

  init();
});
