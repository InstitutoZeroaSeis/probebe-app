(function() {
  function showLoading(ionicLoading, text) {
    ionicLoading.show({
      template: text,
      noBackdrop: true,
      duration: 2000
    });
  }

  angular.module("proBebe.controllers")
  .controller("AuthCtrl", function($scope, $ionicLoading, $state, $window, Constants, authentication, storage) {
    $scope.login_info = {};

    $scope.signUp = function() {

    };

    $scope.signIn = function() {
      var authPromise = authentication.authenticate($scope.login_info.email, $scope.login_info.password);
      $ionicLoading.show({
        templateUrl: 'templates/loading.html'
      });
      return authPromise.then(function(result) {
        if (result) {
          showLoading($ionicLoading, "Autenticado com sucesso");
          $state.go('messages');
        } else {
          showLoading($ionicLoading, "Credenciais inválidas");
        }
      }).catch(function(error) {
        showLoading($ionicLoading, "Ocorreu um erro na autenticação");
      });
    };

    $scope.signOut = function() {
      authentication.signOut();
      storage.clear();
      $state.go('signin');
    };

  });
})();
