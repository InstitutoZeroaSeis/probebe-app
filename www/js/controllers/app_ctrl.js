angular.module("proBebe.controllers")
.controller("AppCtrl", function($scope, $rootScope, storage, $state, Profile) {

  $scope.$on('$ionicView.enter', init);

  var profile;

  function init(){
    reloadProfile();
  }

  function getChildren(){
    console.log("get")
    profile = storage.get("profile");
    $scope.children = profile.children;
  }

  function reloadProfile () {
    Profile.reloadChild()
    .then(function(success) {
      if(success) getChildren();
    }).catch(function(error) {
      messageHandler.show("Impossível recarregar o perfil");
    });
  }
});
