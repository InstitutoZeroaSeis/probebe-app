angular.module("proBebe", [
    "ionic"
    "proBebe.controllers"
    "proBebe.services"
  ])
  .run(($ionicPlatform, $rootScope, $state, AuthenticationService, PushProcessingService) ->
    $ionicPlatform.ready ->
      window.cordova?.plugins.Keyboard?.hideKeyboardAccessoryBar()
      window.StatusBar?.styleDefault()
      $state.go 'app.messages'

    PushProcessingService.initialize() if AuthenticationService.isAuthenticated()

    AuthenticationService.initialize()
    $rootScope.$on 'authenticate', -> PushProcessingService.initialize()

    $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) ->
      console.log("Changing state from #{fromState.name} to #{toState.name}")
      if !AuthenticationService.isAuthenticated() and toState.name != 'app.signin'
        event.preventDefault()
        $state.go('app.signin')
    )
  )
  .config ($stateProvider, $urlRouterProvider) ->
    $stateProvider.state("app",
      abstract: true
      controller: "AppCtrl"
      templateUrl: "templates/menu.html"
      url: "/app"
    ).state("app.messages",
      url: "/messages"
      views:
        "menuContent":
          controller: "MessagesCtrl"
          templateUrl: "templates/messages.html"
    ).state("app.signin",
      url: "/sign_in"
      views:
        "menuContent":
          controller: "AuthCtrl"
          templateUrl: "templates/signin.html"
    )

    # if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise "/messages"
