angular.module("starter", ["ionic", "starter.controllers", "starter.services"]).run(function($ionicPlatform, $rootScope, $state, AuthenticationService, PushProcessingService) {
  $ionicPlatform.ready(function() {
    var _ref, _ref1, _ref2;
    if ((_ref = window.cordova) != null) {
      if ((_ref1 = _ref.plugins.Keyboard) != null) {
        _ref1.hideKeyboardAccessoryBar();
      }
    }
    return (_ref2 = window.StatusBar) != null ? _ref2.styleDefault() : void 0;
  });
  PushProcessingService.initialize();
  return $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    console.log("Changing state from " + fromState.name + " to " + toState.name);
    if (!AuthenticationService.isAuthenticated() && toState.name !== 'auth.signin') {
      event.preventDefault();
      return $state.go('auth.signin');
    }
  });
}).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state("tab", {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  }).state("auth", {
    url: "/auth",
    abstract: true,
    templateUrl: "templates/auth.html"
  }).state("tab.dash", {
    url: "/dash",
    views: {
      "tab-dash": {
        templateUrl: "templates/tab-dash.html",
        controller: "DashCtrl"
      }
    }
  }).state("tab.friends", {
    url: "/friends",
    views: {
      "tab-friends": {
        templateUrl: "templates/tab-friends.html",
        controller: "FriendsCtrl"
      }
    }
  }).state("tab.friend-detail", {
    url: "/friend/:friendId",
    views: {
      "tab-friends": {
        templateUrl: "templates/friend-detail.html",
        controller: "FriendDetailCtrl"
      }
    }
  }).state("tab.account", {
    url: "/account",
    views: {
      "tab-account": {
        templateUrl: "templates/tab-account.html",
        controller: "AccountCtrl"
      }
    }
  }).state("auth.signin", {
    url: "/auth/sign_in",
    views: {
      "auth-sign-in": {
        templateUrl: "templates/auth-signin.html",
        controller: "AuthCtrl"
      }
    }
  });
  return $urlRouterProvider.otherwise("/tab/dash");
});

angular.module("starter.controllers", []).controller("DashCtrl", function($scope) {}).controller("FriendsCtrl", function($scope, Friends) {
  return $scope.friends = Friends.all();
}).controller("FriendDetailCtrl", function($scope, $stateParams, Friends) {
  return $scope.friend = Friends.get($stateParams.friendId);
}).controller("AccountCtrl", function($scope) {}).controller("AuthCtrl", function($scope, $ionicLoading, $http, $state, AuthenticationService) {
  return $scope.signIn = function() {
    var authPromise;
    $ionicLoading.show({
      templateUrl: 'templates/loading.html'
    });
    authPromise = AuthenticationService.authenticate(this.email, this.password);
    return authPromise.then(function(result) {
      if (result) {
        $ionicLoading.show({
          template: "Successfully authenticated",
          noBackdrop: true,
          duration: 2000
        });
        return $state.go('tab.dash');
      } else {
        return $ionicLoading.show({
          template: "Invalid credentials",
          noBackdrop: true,
          duration: 2000
        });
      }
    })["catch"](function(error) {
      return $ionicLoading.show({
        template: "Error while authenticating",
        noBackdrop: true,
        duration: 2000
      });
    });
  };
});

var onNotificationGCM;

angular.module("starter.services", []).factory("Friends", function() {
  var friends;
  friends = [
    {
      id: 0,
      name: "Scruff McGruff"
    }, {
      id: 1,
      name: "G.I. Joe"
    }, {
      id: 2,
      name: "Miss Frizzle"
    }, {
      id: 3,
      name: "Ash Ketchum"
    }
  ];
  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      return friends[friendId];
    }
  };
}).factory("AuthenticationService", function($q, $http) {
  return {
    authenticate: function(email, password) {
      var authentication_data, deferred, url;
      authentication_data = {
        email: email,
        password: password
      };
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      localStorage.setItem('authenticated', false);
      url = 'http://localhost:3000/credentials';
      deferred = $q.defer();
      $http.post(url, authentication_data).then(function(result) {
        localStorage.setItem('authenticated', result.data.valid);
        return deferred.resolve(result.data.valid);
      })["catch"](function(err) {
        return deferred.reject("Error");
      });
      return deferred.promise;
    },
    email: function() {
      return localStorage.getItem('email');
    },
    isAuthenticated: function() {
      return localStorage.getItem('authenticated') === 'true';
    },
    password: function() {
      return localStorage.getItem('password');
    }
  };
}).factory('PushProcessingService', function() {
  var gcmErrorHandler, gcmSuccessHandler, onDeviceReady;
  onDeviceReady = function() {
    var pushNotification;
    console.info('NOTIFY  Device is ready.  Registering with GCM server');
    pushNotification = window.plugins.pushNotification;
    return pushNotification.register(gcmSuccessHandler, gcmErrorHandler, {
      "senderID": "315459751586",
      "ecb": "onNotificationGCM"
    });
  };
  gcmSuccessHandler = function(result) {
    return console.info('NOTIFY  pushNotification.register succeeded.  Result = ' + result);
  };
  gcmErrorHandler = function(error) {
    return console.error('NOTIFY  ' + error);
  };
  return {
    initialize: function() {
      console.info('NOTIFY  initializing');
      return document.addEventListener('deviceready', onDeviceReady, false);
    },
    registerID: function(id) {
      return console.log("Registration ID = " + id);
    },
    unregister: function() {
      var push;
      console.info('unregister');
      push = window.plugins.pushNotification;
      if (push) {
        return push.unregister(function() {
          return console.info('unregister success');
        });
      }
    }
  };
});

onNotificationGCM = function(e) {
  var elem;
  console.log("EVENT RECEIVED: " + e.event + " ");
  switch (e.event) {
    case 'registered':
      console.log("REGISTERED with GCM Server -&gt REGID: " + e.regid);
      if (e.regid.length > 0) {
        return elem = angular.element(document.querySelector('[ng-app]'));
      }
      break;
    case 'message':
      if (e.foreground) {
        console.log('--INLINE NOTIFICATION--' + '');
        alert(e.payload.message);
      } else {
        if (e.coldstart) {
          console.log('--COLDSTART NOTIFICATION--' + '');
        } else {
          console.log('--BACKGROUND NOTIFICATION--' + '');
        }
        window.location = "#/tab/featured";
      }
      console.log('MESSAGE -&gt MSG: ' + e.payload.message + '');
      return console.log('MESSAGE: ' + JSON.stringify(e.payload));
    case 'error':
      return console.log('ERROR -&gt MSG:' + e.msg + '');
    default:
      return console.log('EVENT -&gt Unknown, an event was received and we do not know what it is');
  }
};
