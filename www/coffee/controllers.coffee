angular.module("proBebe.controllers", [])

.controller("AppCtrl", ($scope, $state) ->
  $scope.signOut = ->
    localStorage.clear()
    $state.go('app.signin')
)
.controller("AuthCtrl", ($scope, $ionicLoading, $http, $state, AuthenticationService) ->
  $scope.signIn = ->
    $ionicLoading.show(templateUrl: 'templates/loading.html')
    authPromise = AuthenticationService.authenticate(this.email, this.password)

    authPromise.then((result) ->
      if result
        $ionicLoading.show({template: "Successfully authenticated", noBackdrop: true, duration: 2000})
        $state.go('app.messages')
      else
        $ionicLoading.show({template: "Invalid credentials", noBackdrop: true, duration: 2000})
    ).catch((error) ->
      $ionicLoading.show({template: "Error while authenticating", noBackdrop: true, duration: 2000})
    )
)

.controller "MessagesCtrl", ($scope, MessagesService) ->
  $scope.messages = []
  MessagesService.getMessages().then (result) ->
    window.msgScope = $scope
    $scope.messages.splice(0, $scope.messages.length)
    result.map (message_delivery) ->
      $scope.messages.push message_delivery.message
