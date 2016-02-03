angular.module("proBebe.controllers")
.controller("AppCtrl", function($scope, $rootScope, storage, $state, Message, storage, ChildAgePresenter, messageHandler) {

  $scope.$on('$ionicView.enter', init);

  var profile;

  function init(){
    console.log("appctrl")
    getChildren();
    builInfoToMenu()
  }

  function getChildren(){
    profile = storage.get("profile");
    $scope.children = profile.children;
  }

  function builInfoToMenu(){
    $scope.children.forEach(function(child, index){
      // Message.all({id: child.id})
      // .then(function(messages){
      //   $scope.messages = ChildAgePresenter.build(messages.data);
      //   $scope.children[index].messages = $scope.messages;
      //   $scope.children[index] = badgeMenu($scope.children[index])
      //   profile.children = $scope.children;
      //   storage.set("profile", profile);
      //   if(getAllRequests(index)) $rootScope.$broadcast('finishRequest', undefined);
      //
      // },function(error){
      //   messageHandler.show('Não foi possível carregar as mensagens');
      // });
    })
  }

  function badgeMenu(child) {
    var lastMessage = storage.get('lastMessage');
    if(lastMessage == null) lastMessage = "0";
      var newMessagesTotal = 0;

    child.messages.forEach(function(message){
      if(lastMessage < message.id) {
        message.isNew = true;
        newMessagesTotal +=1;
        lastMessage = message.id;
      }
    });
    child.newMessagesTotal = newMessagesTotal;
    storage.set('lastMessage', lastMessage);
    return child;
  }

  function getAllRequests(index){
    return $scope.children.length == index+1;
  }
  $scope.changeMenu = function(state){
    $state.go(state);
  }

  init();
});
