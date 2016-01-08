angular.module("proBebe.controllers")
.controller("ArticleCtrl", function($scope, $state) {

  $scope.article = $state.params;

  $scope.messages = function(){
    $state.go('messages');
  }
});

