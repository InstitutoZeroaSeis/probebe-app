angular.module("proBebe.controllers")
.controller("MicroDonationCtrl", function($scope, $state, $ionicPopup, Profile, Microdonation, messageHandler) {
  $scope.recipient = { children: 3 };
  $scope.imgChild = [];

  $scope.showPopup = function() {
    Microdonation.popup($scope);
  };

  $scope.save = function(){
    Profile.maxRecipientChildren($scope.recipient.children)
    .then(function(response){
      messageHandler.show("Doação realizada com sucesso");
      $state.go("messages");
    }).catch(function(err){
       messageHandler.show("Ocorreu um erro na tentativa de doação");
    });
  }

  $scope.index = function(){
    $state.go('microdonation');
  }

  $scope.pathImg = function(index){
    return (index +1) <= $scope.recipient.children ? '../img/child_color.svg' : '../img/child_default.svg';
  }

  $scope.updateImg = function(){
    defineRandomNumber();
  }

  function defineRandomNumber(){
    $scope.imgChild = [1,2,3,4,5];
  }

  defineRandomNumber();
});

