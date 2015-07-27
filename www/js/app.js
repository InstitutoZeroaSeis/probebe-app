angular.module("proBebe", ["ionic", "proBebe.controllers", "proBebe.services"]).run(function($ionicPlatform, $rootScope, $state, authentication, pushProcessing) {
  $state.go('messages');
  $ionicPlatform.ready(function() {

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
    if (!authentication.isAuthenticated() && toState.name !== 'signin') {
      event.preventDefault();
      $state.go('signin');
    }
  });

}).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state("messages", {
    url: "/messages",
    controller: "MessagesCtrl",
    templateUrl: "templates/messages.html"
  })
  .state("signin", {
    url: "/sign_in",
    controller: "AuthCtrl",
    templateUrl: "templates/signin.html"
  });
  $urlRouterProvider.otherwise("/messages");
});
