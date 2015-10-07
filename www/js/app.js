function onNotification(e){
  console.log('NOTIFICATION', e);
}

angular.module("proBebe", ["ionic", "proBebe.controllers", "proBebe.services"]).run(function($ionicPlatform, $rootScope, $state, authentication, pushProcessing, Microdonation, ObserverMicrodonation) {

  $ionicPlatform.ready(function() {
    // $state.go('messages');
    Microdonation.setSendingMessages(false);

    var isIOS = ionic.Platform.isIOS();
    var isAndroid = ionic.Platform.isAndroid();
    var currentPlatform = ionic.Platform.platform();

    if(!isIOS && !isAndroid) $rootScope.systemType = 'other';
    if(isIOS) $rootScope.systemType = 'ios';
    if(isAndroid) $rootScope.systemType = 'android';

    Microdonation.setSendingMessages(false);

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
    $rootScope.status = 'signin';
  }

  authentication.initialize();

  $rootScope.$on('authenticate', function() {
    pushProcessing.initialize();
  });

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    ObserverMicrodonation.start(toState.name);
    if(ObserverMicrodonation.isTimeToShowPopup()) Microdonation.popup($rootScope);

    if (!authentication.isAuthenticated() && (toState.name != 'signin' && toState.name != 'signup')) {
      $state.go('signin');
      event.preventDefault();
    }
  });

}).config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(0);

  $stateProvider.state("messages", {
    url: "/messages",
    controller: "MessagesCtrl",
    templateUrl: "templates/messages.html"
  })
  .state("signin", {
    url: "/sign_in",
    controller: "AuthCtrl",
    templateUrl: "templates/auth/signin.html"
  })
  .state("signup", {
    url: "/sign_up",
    controller: "AuthCtrl",
    templateUrl: "templates/auth/signup.html"
  })
  .state("profile", {
    url: "/profile",
    controller: "ProfileCtrl",
    templateUrl: "templates/profile.html"
  })
  .state("microdonation", {
    url: "/microdonation",
    controller: "MicroDonationCtrl",
    templateUrl: "templates/microdonation.html"
  });

  $urlRouterProvider.otherwise("/messages");
});
