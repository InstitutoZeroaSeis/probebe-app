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
    $scope.recipientChildren = 3;

    $scope.showPopup = function() {
      var donatePopup = Microdonation.popup($scope);
      donatePopup.then(function(res) {
        console.log('Tapped!', res);
      });
    };

    $scope.save = function(){
      Profile.maxRecipientChildren($scope.recipientChildren)
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
  });
})();
