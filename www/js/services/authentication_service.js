var services = angular.module("proBebe.services");
services.service("authentication", function($q, $http, $rootScope, $cordovaDevice, Constants) {
  return {
    authenticate: function(email, password) {
      var authentication_data, deferred, url;
      authentication_data = {
        email: email,
        password: password
      };
      this.setEmail(email);
      this.setPassword(password);
      this.setIsAuthenticated(false);
      url = Constants.API_BASE_URL + "/credentials";
      deferred = $q.defer();
      $http.post(url, authentication_data).then((function(_this) {
        return function(result) {
          _this.setIsAuthenticated(result.data.valid);
          if (result.data.valid) {
            _this.setAuthenticationHeaders();
            $rootScope.$emit('authenticate');
          }
          return deferred.resolve(result.data.valid);
        };
      })(this)).catch(function(err) {
        console.log(err);
        return deferred.reject("Could not authenticate");
      });
      return deferred.promise;
    },

    email: function() {
      return localStorage.getItem('email');
    },

    isAuthenticated: function() {
      return localStorage.getItem('authenticated') === 'true';
    },

    initialize: function() {
      if (this.isAuthenticated) {
        return this.setAuthenticationHeaders();
      }
    },

    password: function() {
      return localStorage.getItem('password');
    },

    registered: function() {
      return localStorage.getItem('registered') === 'true';
    },

    registerDeviceNotificationId: function(device_registration_id) {
      var registration_data, url;
      registration_data = {
        device_registration: {
          platform: $cordovaDevice.getPlatform(),
          platform_code: device_registration_id
        }
      };
      url = "" + Constants.API_BASE_URL + "/device_registrations";
      $http.post(url, registration_data, {
        format: 'json'
      }).then(function(result, status) {
        localStorage.setItem('registered', status === 200);
      }).catch(function(err) {
        console.log(err);
      });
    },

    setAuthenticationHeaders: function() {
      $http.defaults.headers.common['X-User-Email'] = this.email;
      $http.defaults.headers.common['X-User-Password'] = this.password;
    },

    setIsAuthenticated: function(authenticated) {
      return localStorage.setItem('authenticated', authenticated);
    },

    setEmail: function(email) {
      return localStorage.setItem('email', email);
    },

    setPassword: function(password) {
      return localStorage.setItem('password', password);
    },

    setRegistered: function(registered) {
      return localStorage.setItem('registered', registered);
    }
  };
});
