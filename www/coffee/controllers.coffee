angular.module("proBebe.controllers", [])

.controller("AuthCtrl", ($scope, $ionicLoading, $http, $state, AuthenticationService) ->
  $scope.signIn = ->
    $ionicLoading.show(templateUrl: 'templates/loading.html')
    authPromise = AuthenticationService.authenticate(this.email, this.password)

    authPromise.then((result) ->
      if result
        $ionicLoading.show({template: "Successfully authenticated", noBackdrop: true, duration: 2000})
        $state.go('tab.messages')
      else
        $ionicLoading.show({template: "Invalid credentials", noBackdrop: true, duration: 2000})
    ).catch((error) ->
      $ionicLoading.show({template: "Error while authenticating", noBackdrop: true, duration: 2000})
    )
)

.controller "MessagesCtrl", ($scope) ->

