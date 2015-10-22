(function() {
  function showLoading(ionicLoading, text) {
    ionicLoading.show({
      template: text,
      noBackdrop: true,
      duration: 4000
    });
  }

  angular.module("proBebe.controllers")
  .controller("AuthCtrl", function($scope, $ionicLoading, $state, $http, Constants, authentication, storage, errorHandler) {
    $scope.login_info = {};
    $scope.user = {};
    $scope.form = {
      signin: true,
      signup: false
    }

    function defineData(){
      return {
        user: { profile_attributes: {name: $scope.user.name},
          email: $scope.user.email,
          password: $scope.user.password,
          source: ""
        }
      }
    }

    $scope.toggleTab = function(){
      $scope.form.signin = !$scope.form.signin;
      $scope.form.signup = !$scope.form.signup;
    }

    $scope.signIn = function(state) {
      var authPromise = authentication.authenticate($scope.login_info.email, $scope.login_info.password, $scope.login_info.name);
      $ionicLoading.show({
        templateUrl: 'templates/loading.html'
      });
      return authPromise.then(function(result) {
        $ionicLoading.hide();
        if (result) {
          showLoading($ionicLoading, "Autenticado com sucesso");
          $state.go(state);
        } else {
          showLoading($ionicLoading, "Credenciais inválidas");
        }
      }).catch(function(error) {
        showLoading($ionicLoading, "Ocorreu um erro na autenticação");
      });
    };

    $scope.signUp = function(form) {
      $ionicLoading.show({
        templateUrl: 'templates/loading.html'
      });
      if (form.$valid) {
        var data = defineData();
        $http.post(Constants.SIGN_UP_URL, data).then(function(result) {
          $scope.login_info.email = $scope.user.email;
          $scope.login_info.password = $scope.user.password;
          $scope.login_info.name = $scope.user.name;
          $ionicLoading.hide();
          $scope.signIn('profile');
        }).catch(function(response) {
          $ionicLoading.hide();
          var messageError = errorHandler.message(response);
          showLoading($ionicLoading, messageError);
        });
      }
    };

    $scope.signOut = function() {
      authentication.signOut();
      storage.clear();
      $state.go('sign');
    };

  });
})();
