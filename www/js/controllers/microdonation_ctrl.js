angular.module("proBebe.controllers")
.controller("MicroDonationCtrl", function($scope, $state, $ionicPopup) {
// Triggered on a button click, or some other target
  $scope.showPopup = function() {
  $scope.data = {}

  // An elaborate, custom popup
  var donatePopup = $ionicPopup.show({
    title: 'QUE TAL AJUDAR OUTRAS MÃES FAZENDO UMA MICRODOAÇÃO DE SMS?',
    scope: $scope,
    buttons: [
      {
        text: '<b>Quero doar</b>',
        type: 'button-positive',
        onTap: function(e) {
          $state.go('microdonation')
        }
      },
      { text: 'Agora não' },
      { text: 'Esquecer'}
    ]
  });

  donatePopup.then(function(res) {
    console.log('Tapped!', res);
  });
 };

});
