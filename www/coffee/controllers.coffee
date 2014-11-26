angular.module("starter.controllers", [])

.controller("DashCtrl", ($scope) ->

)

.controller("FriendsCtrl", ($scope, Friends) ->
  $scope.friends = Friends.all()
)

.controller("FriendDetailCtrl", ($scope, $stateParams, Friends) ->
  $scope.friend = Friends.get($stateParams.friendId)
)

.controller("AccountCtrl", ($scope) ->

)

.controller("AuthCtrl", ($scope, $ionicLoading, $http, $state, AuthenticationService) ->
  $scope.signIn = ->
    $ionicLoading.show(templateUrl: 'templates/loading.html')
    authPromise = AuthenticationService.authenticate(this.email, this.password)

    authPromise.then((result) ->
      if result
        $ionicLoading.show({template: "Successfully authenticated", noBackdrop: true, duration: 2000})
        $state.go('tab.dash')
      else
        $ionicLoading.show({template: "Invalid credentials", noBackdrop: true, duration: 2000})
    ).catch((error) ->
      $ionicLoading.show({template: "Error while authenticating", noBackdrop: true, duration: 2000})
    )
)
