var services = angular.module("proBebe.services");
services.service("authentication", function($q, $http, $rootScope, $cordovaDevice, Constants, storage, DeviceRegistration) {
  return {
    authenticate: function(email, password, name) {
      var deferred = $q.defer();
      var authentication_data = {
        email: email,
        password: password
      };

      this.setEmail(email);
      this.setPassword(password);
      this.setIsAuthenticated(false);
      this.setName(name);

      var self = this;

      $http.post(Constants.CREDENTIALS_URL, authentication_data).then(function(result) {
        self.setIsAuthenticated(result.data.valid);
        if (result.data.valid) {
          self.setAuthenticationHeaders();
          $rootScope.$emit('authenticate');
        }
        console.log("hash=======", result.data)
        self.setProfile(result.data);
        deferred.resolve(result.data.valid);
      }).catch(function(err) {
        deferred.reject("Não foi possível autenticar");
      });
      return deferred.promise;
    },

    signOut: function() {
      if (this.deviceRegistrationId()) {
        DeviceRegistration.remove({ platform_code: this.deviceRegistrationId() });
      }
    },

    profile: function(){
      return storage.get('profile');
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

    name : function(){
      return storage.get('name');
    },

    registered: function() {
      return storage.get('registered') === 'true';
    },

    deviceRegistrationId: function() {
      return storage.get('device_registration_id');
    },

    registerDeviceNotificationId: function(device_registration_id) {
      var registration_data = {
        device_registration: {
          platform: $cordovaDevice.getPlatform(),
          platform_code: device_registration_id
        }
      };

      this.setDeviceRegistrationId(device_registration_id);
      this.setRegistered(true);

      DeviceRegistration.save(registration_data);
    },

    setAuthenticationHeaders: function() {
      $http.defaults.headers.common['X-User-Email'] = this.email;
      $http.defaults.headers.common['X-User-Password'] = this.password;
    },

    setIsAuthenticated: function(authenticated) {
      storage.set('authenticated', authenticated);
    },

    setProfile: function(profile){
      storage.set('profile', profile);
    },

    setEmail: function(email) {
      storage.set('email', email);
    },

    setName: function(name){
      storage.set('name',name);
    },

    setPassword: function(password) {
      storage.set('password', password);
    },

    setRegistered: function(registered) {
      storage.set('registered', registered);
    },

    setDeviceRegistrationId: function(device_registration_id) {
      storage.set('device_registration_id', device_registration_id);
    }
  };
});
