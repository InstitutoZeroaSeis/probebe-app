angular.module("proBebe.controllers")
.controller("AuthCtrl", function($scope, $state, $http, $ionicPopup, $cordovaOauth, Constants, authentication, storage, errorHandler, messageHandler) {

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

  $scope.signIn = function(state, loading) {
    var authPromise = authentication.authenticate($scope.login_info.email, $scope.login_info.password, $scope.login_info.name);

    return authPromise.then(function(result) {
      if(loading) loading.hide();
      if (result) {
        messageHandler.show("Autenticado com sucesso");
        $state.go(state);
      } else {
        messageHandler.show("Credenciais inválidas");
        $scope.authSocial = false;
      }
    }).catch(function(error) {
      $scope.authSocial = false;
      if(loading) loading.hide();
      messageHandler.show("Impossível comunicar com o ProBebe. Favor verificar sua conexão com a internet");
    });
  };

  $scope.signUp = function(form) {
    if (form.$valid) {
      var data = defineData();
      $http.post(Constants.SIGN_UP_URL, data).then(function(result) {
        setLoginData($scope.user);
        thanksPopup();
      }).catch(function(response) {
        messageHandler.show(errorHandler.message(response));
      });
    }else{
      messageHandler.show("Dados inválidos");
    }
  };

  $scope.newPassword = function(form) {
    if (form.$valid) {
      var data = {
        user: {email: $scope.login_info.email},
        commit: "Me envie as instruções de resetar senha"
      };
      $http.post(Constants.RESET_PASSWORD, data).then(function(result) {
        if(result.status > 200 && result.status < 300){
          messageHandler.show("Instruções enviada para o email inserido");
        }
        $state.go("sign");
      }).catch(function(response) {
        messageHandler.show(errorHandler.message(response));
      });
    }else{
      messageHandler.show("Dados inválidos");
    }
  };

  $scope.signOut = function() {
    authentication.signOut();
    mantainStatus();
    $state.go('sign');
  };

  $scope.signFacebook = function(){
    $scope.authSocial = true;
    var facebookData = storage.get("facebookData");
    if(facebookData != null){
      var loading = messageHandler.show("Carregando...");
      setLoginData(facebookData);
      $scope.signIn('app.messages',loading);
    }else{
      $cordovaOauth.facebook(Constants.CLIENT_ID_FACEBOOK, ["public_profile","email"]).then(function(result) {
        userDataFB(result.access_token);
      }, function(error) {
        $scope.authSocial = false;
        messageHandler.show("Ocorreu um erro na autenticação");
      });
    }
  };

  $scope.signGooglePlus = function(){
    $scope.authSocial = true;
    var googleData = storage.get("googleData");
    if(googleData != null){
      var loading = messageHandler.show("Carregando...");
      setLoginData(googleData);
      $scope.signIn('app.messages', loading);
    }else{
      $cordovaOauth.google(Constants.CLIENT_ID_GOOGLEPLUS, ["email"]).then(function(result) {
        userDataGP(result.access_token);
      }, function(error) {
        $scope.authSocial = false;
        messageHandler.show("Ocorreu um erro na autenticação");
      });
    }
  };

  function userDataFB(access_token){
    var data = {params: {access_token: access_token, fields: "name,gender,location,picture,email", format: "json" }};

    $http.get(Constants.USER_DATA_FACEBOOK, data )
    .then(function(result) {
      $scope.user.name = result.data.name;
      $scope.user.email = result.data.email;
      if(!result.data.email){
        messageHandler.show("O Facebook não forneceu o email");
        $scope.authSocial = false;
        return
      }
      $scope.user.type = 'fb';
      $scope.user.password = randomPassword();
      setLoginData($scope.user);
      signUpSocialUser($scope.user);
    }, function(error) {
      $scope.authSocial = false;
      messageHandler.show("Ocorreu um erro na autenticação");
    });
  }

  function signUpSocialUser(user){
    var loading = messageHandler.show("Carregando...");
    var data = defineData();
    $http.post(Constants.SIGN_UP_URL, data).then(function(result) {
      $scope.signIn('app.profile', loading);
    }).catch(function(response) {
      $scope.authSocial = false;
      messageHandler.show(errorHandler.message(response));
    });
  }

  function userDataGP(access_token){
    var data = {params: {access_token: access_token}};

    $http.get(Constants.USER_DATA_GOOFLEPLUES, data )
    .then(function(result) {
      $scope.user.email = result.data.emails[0].value;
      $scope.user.name = result.data.displayName;
      $scope.user.type = 'gp';
      $scope.user.password = randomPassword();
      setLoginData($scope.user);
      signUpSocialUser($scope.user);
      setLoginData($scope.user);
    }, function(error) {
      $scope.authSocial = false;
      messageHandler.show("Ocorreu um erro na autenticação");
    });
  }

  function thanksPopup() {
   var confirmPopup = $ionicPopup.confirm({
        templateUrl: 'templates/popup/confirm_signup.html',
        scope: $scope,
        buttons: [
          {
            text: '<b>Ok</b>',
            type: 'button-positive',
            onTap: function(e) {
              $scope.signIn('app.profile');
            }
          }
        ]
    });

  };

  function mantainStatus (argument) {
    var lastMessage = storage.get('lastMessage');
    var facebookData = storage.get("facebookData");
    var googleData = storage.get("googleData");

    storage.clear();

    storage.set("facebookData",facebookData);
    storage.set("googleData",googleData);
    storage.set('lastMessage', lastMessage);
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

  function setLoginData(user){
    $scope.login_info.email = user.email;
    $scope.login_info.password = user.password;
    $scope.login_info.name = user.name;

    if($scope.user.type == "fb"){
      storage.set("facebookData",user);
    }else if($scope.user.type == "gp"){
      storage.set("googleData",user);
    }
  }

  function randomPassword(){
    return Math.random().toString(36).slice(-8);
  }
});

