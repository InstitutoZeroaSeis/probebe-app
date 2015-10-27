angular.module("proBebe.controllers")
.controller("AuthCtrl", function($scope, $state, $http, $ionicPopup, Constants, authentication, storage, errorHandler, messageHandler) {
  $scope.login_info = {};
  $scope.user = {};
  $scope.form = {
    signin: true,
    signup: false
  }

  $scope.toggleTab = function(){
    $scope.form.signin = !$scope.form.signin;
    $scope.form.signup = !$scope.form.signup;
  }

  $scope.signIn = function(state) {
    var authPromise = authentication.authenticate($scope.login_info.email, $scope.login_info.password, $scope.login_info.name);
    var loading = messageHandler.showWithTemplate();

    return authPromise.then(function(result) {
      loading.hide();
      if (result) {
        messageHandler.show("Autenticado com sucesso");
        $state.go(state);
      } else {
        messageHandler.show("Credenciais inválidas");
      }
    }).catch(function(error) {
      messageHandler.show("Ocorreu um erro na autenticação");
    });
  };

  $scope.signUp = function(form) {
    var loading = messageHandler.showWithTemplate();

    if (form.$valid) {
      var data = defineData();
      $http.post(Constants.SIGN_UP_URL, data).then(function(result) {
        $scope.login_info.email = $scope.user.email;
        $scope.login_info.password = $scope.user.password;
        $scope.login_info.name = $scope.user.name;
        loading.hide();
        thanksPopup();
      }).catch(function(response) {
        loading.hide();
        messageHandler.show(errorHandler.message(response));
      });
    }
  };

  $scope.signOut = function() {
    authentication.signOut();
    mantainMessageStatus();
    $state.go('sign');
  };


  function thanksPopup() {
   var confirmPopup = $ionicPopup.confirm({
        templateUrl: 'templates/popup/confirm_signup.html',
        scope: $scope,
        buttons: [
          {
            text: '<b>Ok</b>',
            type: 'button-positive',
            onTap: function(e) {
              $scope.signIn('profile');
            }
          }
        ]
    });

  };

  function mantainMessageStatus (argument) {
    var readMessage = storage.get('readMessage');
    storage.clear();
    storage.set('readMessage', readMessage);
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

});

