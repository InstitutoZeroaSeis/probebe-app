angular.module("proBebe.controllers")
.controller("AppCtrl", function($scope, $rootScope, storage, messageHandler, Profile, ScrollPositions) {

  $scope.$on('$ionicView.enter', init);

  var profile;

  function init(){
    reloadProfile();
  }

  function getChildren(){
    profile = storage.get("profile");
    $scope.children = profile.children;
  }

  function reloadProfile () {
    Profile.reloadChild()
    .then(function(success) {
      if(success) getChildren();
    }).catch(function(error) {
      messageHandler.show("Impossível recarregar o perfilno momento. Tente mais tarde");
    });
  }

  $scope.clearScroll = function(){
    ScrollPositions['maintain_scroll'] = false;
  }

  $scope.openFilter = function(){
    $rootScope.$emit("openFilter");
  }
});
