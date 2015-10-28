(function() {
  function showLoading(ionicLoading, text) {
    ionicLoading.show({
      template: text,
      noBackdrop: true,
      duration: 2000
    });
  }

  angular.module("proBebe.controllers")
  .controller("MicroDonationCtrl", function($scope, $state, $ionicPopup, $ionicLoading, Profile, Microdonation) {
    $scope.recipient = {
      children: 3
    }
    $scope.imgChild = [];

    $scope.showPopup = function() {
      var donatePopup = Microdonation.popup($scope);
      donatePopup.then(function(res) {
        console.log('Tapped!', res);
      });
    };

    $scope.save = function(){
      Profile.maxRecipientChildren($scope.recipient.children)
      .then(function(response){
        showLoading($ionicLoading, "Doação realizada com sucesso");
        $state.go("messages");
      }).catch(function(err){
        console.log(err);
        showLoading($ionicLoading, "Ocorreu um erro na tentativa de doação");
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
      $scope.imgChild = [1, 2,3,4,5];
    }

    defineRandomNumber();
  });
})();
