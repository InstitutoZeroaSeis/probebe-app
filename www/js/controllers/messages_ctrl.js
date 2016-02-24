var controllers;

controllers = angular.module("proBebe.controllers");

controllers.controller("MessagesCtrl", function($ionicPlatform, $scope, $rootScope, $state, $ionicPopup, $ionicModal, $cordovaToast, $window, $cordovaSocialSharing, Child, Profile, Constants, Microdonation, storage, messageHandler, BirthdayCard, Message, Category, $ionicViewService, ScrollPositions, $ionicScrollDelegate) {

  $rootScope.$on('networkOffline', function(event, networkState) {
    $cordovaToast.showLongBottom('Sem conexão');
  });

  $rootScope.$on("openFilter", function(){
    $scope.filterMenu = true;
    $scope.noFilter = {visibility: 'visible'};
  });

  var categoryDefault = {id: 0, name: 'Todos', color: "#f69343"};

  function init() {
    $scope.filterMenu = false;
    $scope.infoApp = storage.get("infoApp");
    var childIdParams = $state.params.childId;
    if(noChildId(childIdParams)){
      defineOptionsChild();
    }else{
      $scope.selectedChild = getChild(childIdParams);
      getMessage(childIdParams);
      loadCategories();
    }
  }

  function defineCategory () {
    if( fromArticlePage()){
      var category = $scope.categories.filter(function(category){
        return category.id == $rootScope.article.category_id;
      })[0];
      $rootScope.article = undefined;
      $scope.filterMessages(category);
      $scope.filter.category = category;
    }else $scope.filter = { category: categoryDefault };
  }

  function fromArticlePage(){
    return $rootScope.article && ($rootScope.article.filter.category.id == $rootScope.article.category_id)
  }

  function loadCategories () {
    Category.all()
    .then(function(response){
      $scope.categories = response.data;
      defineCategory();
    }, function (error) {
      messageHandler.show('Não foi possível carregar as categorias');
    })
  }

  function getMessage (childId) {
    $scope.loadingMessages = true;
    var noFilter = !fromArticlePage();
    var lastMessage = Message.getLastMessage(childId);
    var msgs = Message.getMessages(childId);
    if(noFilter) $scope.messages = msgs;

    Message.onlyNewMessages({id: childId, lastMessage: lastMessage.id }).then(function(messages){
      Message.defineOldMessages(msgs, lastMessage, childId);

      if(messages.data.length > 0){
        msgs = msgs.concat(Message.configAgeChild(messages.data, lastMessage, $scope.selectedChild));
        Message.setMessages(childId, msgs);
        Message.setLastMessage(msgs, childId);
      }

      if(noFilter) $scope.messages = msgs;
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
      $scope.goToChild($scope.children[0].id);
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

  function disableBackButton(){
    $ionicViewService.nextViewOptions({
      disableBack: true
    });
  }

  $scope.goToChild = function(childId){
    $scope.childrenOptions = false;
    disableBackButton();
    ScrollPositions['maintain_scroll'] = false;
    $state.go('app.messages', {childId: childId}, {location: 'replace'});
  }

  $scope.openInNewPage = function(message) {
    ScrollPositions['maintain_scroll'] = true
    $rootScope.article ={
      text: message.article_text,
      title: message.article_title,
      category: message.article_category,
      category_id: message.parent_category_id,
      filter: $scope.filter
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

  $scope.closeInfoApp = function () {
    storage.set("infoApp", false);
    $scope.displayNone = {display:'none'};
  }

  $scope.closeFilter = function(){
    $scope.noFilter = {visibility: 'hidden'};
    $scope.filterMenu = false;
  }

  $scope.filterMessages = function(category){
    $scope.filter = {category: category};
    if( category != 'all'){
      $scope.messages = Message.getMessages($scope.selectedChild.id)
      .filter(function(message){
        return message.parent_category_id == category.id;
      });
    }else{
      $scope.filter.category = categoryDefault;
      $scope.messages = Message.getMessages($scope.selectedChild.id);
    }
    messageState();
    $scope.closeFilter();
  }

  $scope.$on('pushMessageReceived', init);

  init();
});
