var controllers = angular.module("proBebe.controllers");
controllers.controller("AuthCtrl", function($scope, $ionicLoading, $http, $state, authentication) {
  $scope.login_info = {};
  $scope.signIn = function() {
    var authPromise = authentication.authenticate($scope.login_info.email, $scope.login_info.password);
    $ionicLoading.show({
      templateUrl: 'templates/loading.html'
    });
    return authPromise.then(function(result) {
      if (result) {
        $ionicLoading.show({
          template: "Successfully authenticated",
          noBackdrop: true,
          duration: 2000
        });
        $state.go('app.messages');
      } else {
        $ionicLoading.show({
          template: "Invalid credentials",
          noBackdrop: true,
          duration: 2000
        });
      }
    }).catch(function(error) {
      $ionicLoading.show({
        template: "Error while authenticating",
        noBackdrop: true,
        duration: 2000
      });
    });
  };
  $scope.signOut = function() {
    localStorage.clear();
    $state.go('app.signin');
  };
});
