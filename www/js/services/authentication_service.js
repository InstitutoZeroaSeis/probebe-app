var services = angular.module("proBebe.services");
services.service("authentication", function($q, $http, $rootScope, $cordovaDevice, Constants, storage) {
  return {
    authenticate: function(email, password) {
      var deferred = $q.defer();
      var authentication_data = {
        email: email,
        password: password
      };

      this.setEmail(email);
      this.setPassword(password);
      this.setIsAuthenticated(false);

      var self = this;

      $http.post(Constants.CREDENTIALS_URL, authentication_data).then(function(result) {
        self.setIsAuthenticated(result.data.valid);
        if (result.data.valid) {
          self.setAuthenticationHeaders();
          $rootScope.$emit('authenticate');
        }
        deferred.resolve(result.data.valid);
      }).catch(function(err) {
        deferred.reject("Não foi possível autenticar");
      });
      return deferred.promise;
    },

    email: function() {
      return storage.get('email');
    },

    isAuthenticated: function() {
      return storage.get('authenticated');
    },

    initialize: function() {
      if (this.isAuthenticated()) {
        return this.setAuthenticationHeaders();
      }
    },

    password: function() {
      return storage.get('password');
    },

    registered: function() {
      return storage.get('registered') === 'true';
    },

    registerDeviceNotificationId: function(device_registration_id) {
      var registration_data = {
        device_registration: {
          platform: $cordovaDevice.getPlatform(),
          platform_code: device_registration_id
        }
      };

      $http.post(Constants.DEVICE_REGISTRATION_URL, registration_data, {
        format: 'json'
      }).then(function(result, status) {
        storage.set('registered', status === 200);
      });
    },

    setAuthenticationHeaders: function() {
      $http.defaults.headers.common['X-User-Email'] = this.email;
      $http.defaults.headers.common['X-User-Password'] = this.password;
    },

    setIsAuthenticated: function(authenticated) {
      return storage.set('authenticated', authenticated);
    },

    setEmail: function(email) {
      return storage.set('email', email);
    },

    setPassword: function(password) {
      return storage.set('password', password);
    },

    setRegistered: function(registered) {
      return storage.set('registered', registered);
    }
  };
});
