angular.module("proBebe.controllers")
.controller("ArticleCtrl", function($scope, $rootScope, $state) {

  $scope.messages = function(){
    $state.go("/app/messages/null");
  }
});

