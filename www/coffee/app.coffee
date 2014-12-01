angular.module("proBebe", [
    "ionic"
    "proBebe.controllers"
    "proBebe.services"
  ])
  .run(($ionicPlatform, $rootScope, $state, AuthenticationService, PushProcessingService) ->
    $ionicPlatform.ready ->
      window.cordova?.plugins.Keyboard?.hideKeyboardAccessoryBar()
      window.StatusBar?.styleDefault()

    if AuthenticationService.isAuthenticated()
      PushProcessingService.initialize()

    $rootScope.$on 'authenticate', ->
      PushProcessingService.initialize()

    $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) ->
      console.log("Changing state from #{fromState.name} to #{toState.name}")
      if !AuthenticationService.isAuthenticated() and toState.name != 'auth.signin'
        event.preventDefault()
        $state.go('auth.signin')
    )
  )
  .config ($stateProvider, $urlRouterProvider) ->
    $stateProvider.state("tab",
      url: "/tab"
      abstract: true
      templateUrl: "templates/tabs.html"
    )
    .state("auth",
      url: "/auth"
      abstract: true
      templateUrl: "templates/auth.html"
    ).state("tab.messages",
      url: "/messages"
      views:
        "tab-messages":
          templateUrl: "templates/tab-messages.html"
          controller: "MessagesCtrl"
    ).state("auth.signin",
      url: "/auth/sign_in"
      views:
        "auth-sign-in":
          templateUrl: "templates/auth-signin.html"
          controller: "AuthCtrl"
    )

    # if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise "/tab/messages"
