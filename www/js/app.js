function onNotification(e){
  console.log('NOTIFICATION', e);
}

angular.module("proBebe", ["ionic", "proBebe.controllers", "proBebe.services", "ngCordovaOauth"]).run(function($timeout, $ionicPlatform, $rootScope, $state, $ionicLoading, authentication, pushProcessing, Microdonation, ObserverMicrodonation, messageHandler) {

  $ionicPlatform.ready(function() {
    // $state.go('messages');
    // Microdonation.setSendingMessages(false);

    var isIOS = ionic.Platform.isIOS();
    var isAndroid = ionic.Platform.isAndroid();
    var currentPlatform = ionic.Platform.platform();

    if(!isIOS && !isAndroid) $rootScope.systemType = 'other';
    if(isIOS) $rootScope.systemType = 'ios';
    if(isAndroid) $rootScope.systemType = 'android';

    // Microdonation.setSendingMessages(false);

    try {
      window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar();
      window.StatusBar.styleDefault();
      window.open = window.cordova.InAppBrowser.open;
    } catch(error) {
      console.log(error);
    }
  });

  if (authentication.isAuthenticated()) {
    pushProcessing.initialize();
  } else {
    $rootScope.status = 'sign';
  }

  authentication.initialize();

  $rootScope.$on('authenticate', function() {
    pushProcessing.initialize();
  });

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    $ionicLoading.show({template: 'Carregando...'});
    // ObserverMicrodonation.start();
    // if(ObserverMicrodonation.isTimeToShowPopup()) Microdonation.popup($rootScope);

    if (!authentication.isAuthenticated() && toState.name != 'sign' && toState.name != 'resetPassword') {
      $state.go('sign');
      event.preventDefault();
    }
  });

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $timeout(function(){
        $ionicLoading.hide()
      },2000);
    });

}).config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {

  $ionicConfigProvider.views.maxCache(0);

  $stateProvider.state("messages", {
    url: "/messages",
    controller: "MessagesCtrl",
    templateUrl: "templates/messages.html"
  })
  .state("sign", {
    url: "/sign",
    controller: "AuthCtrl",
    templateUrl: "templates/auth/sign.html"
  })
  .state("resetPassword", {
    url: "/resetPassword",
    controller: "AuthCtrl",
    templateUrl: "templates/auth/reset_password.html"
  })
  .state("profile", {
    url: "/profile",
    controller: "ProfileCtrl",
    templateUrl: "templates/profile.html"
  })
  .state("about", {
    url: "/about",
    controller: "AboutCtrl",
    templateUrl: "templates/about.html"
  })
  .state("microdonation", {
    url: "/microdonation",
    controller: "MicroDonationCtrl",
    templateUrl: "templates/microdonation.html"
  })

  .state("article", {
    url: "/article/",
    controller: "ArticleCtrl",
    templateUrl: "templates/article.html"
  });

  $urlRouterProvider.otherwise("/messages");
});
