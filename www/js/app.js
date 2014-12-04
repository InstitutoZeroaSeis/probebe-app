angular.module("proBebe", ["ionic", "proBebe.controllers", "proBebe.services"]).run(function($ionicPlatform, $rootScope, $state, authentication, pushProcessing) {
  $state.go('app.messages');
  $ionicPlatform.ready(function() {
    try{
      window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar();
      window.StatusBar.styleDefault();
    } catch(error) {
      console.log(error);
    }
  });
  if (authentication.isAuthenticated()) {
    pushProcessing.initialize();
  }
  authentication.initialize();
  $rootScope.$on('authenticate', function() {
    pushProcessing.initialize();
  });
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    console.log("Changing state from " + fromState.name + " to " + toState.name);
    if (!authentication.isAuthenticated() && toState.name !== 'app.signin') {
      event.preventDefault();
      $state.go('app.signin');
    }
  });
}).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state("app", {
    abstract: true,
    controller: "AppCtrl",
    templateUrl: "templates/menu.html",
    url: "/app"
  }).state("app.messages", {
    url: "/messages",
    views: {
      "menuContent": {
        controller: "MessagesCtrl",
        templateUrl: "templates/messages.html"
      }
    }
  }).state("app.signin", {
    url: "/sign_in",
    views: {
      "menuContent": {
        controller: "AuthCtrl",
        templateUrl: "templates/signin.html"
      }
    }
  });
  $urlRouterProvider.otherwise("/messages");
});
