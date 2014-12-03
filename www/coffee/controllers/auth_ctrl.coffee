controllers = angular.module("proBebe.controllers")
controllers.controller("AuthCtrl", ($scope, $ionicLoading, $http, $state, Authentication) ->
  $scope.login_info = {}
  $scope.signIn = ->
    $ionicLoading.show(templateUrl: 'templates/loading.html')
    authPromise = Authentication.authenticate($scope.login_info.email, $scope.login_info.password)

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
