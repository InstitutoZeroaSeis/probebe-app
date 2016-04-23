angular.module("proBebe.controllers")
.controller("ArticleCtrl", function($scope, $rootScope, $state, $cordovaSocialSharing, messageHandler) {

  $scope.shareMessage = function(message, link){
    var subject = "Pro Bebê";
    $cordovaSocialSharing
    .share(message, subject, null, link) // Share via native share sheet
    .then(function(result) {
    }, function(err) {
      messageHandler.show("Erro em compartilhar messagem.");
    });
  }
});
