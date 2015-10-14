(function() {
  function showLoading(ionicLoading, text) {
    ionicLoading.show({
      template: text,
      noBackdrop: true,
      duration: 4000
    });
  }

  angular.module("proBebe.controllers")
  .controller("AuthCtrl", function($scope, $ionicLoading, $state, $http, Constants, authentication, storage) {
    $scope.login_info = {};
    $scope.user = {};

    function defineData(){
      return {
        user: { profile_attributes: {name: $scope.user.name},
          email: $scope.user.email,
          password: $scope.user.password,
          source: ""
        }
      }
    }

    $scope.signIn = function(state) {
      var authPromise = authentication.authenticate($scope.login_info.email, $scope.login_info.password, $scope.login_info.name);
      $ionicLoading.show({
        templateUrl: 'templates/loading.html'
      });
      return authPromise.then(function(result) {
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
          $scope.signIn('profile');
        }).catch(function(response) {
          var messageError = errorHandler(response);
          showLoading($ionicLoading, messageError);
        });
      }
    };

    $scope.signOut = function() {
      authentication.signOut();
      storage.clear();
      $state.go('signin');
    };

    function errorHandler(response){
      var messageError = "";
      if(response.data == undefined){
        messageError = "Ocorreu um erro no cadastro";
      }else{
        var errors = response.data.errors;
        for(key in errors){
          var attribute = key;
          if(key == "password") attribute = "senha";
          messageError += attribute+": "+ errors[key]+" ";
        }
      }
      return messageError;
    }

  });
})();
