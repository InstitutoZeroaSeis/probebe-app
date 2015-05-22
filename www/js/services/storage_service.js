services = angular.module('proBebe.services');
services.factory('storage', function($window) {
  return {
    get: function(key) {
      var item = $window.localStorage.getItem(key);
      try {
        return JSON.parse(item);
      } catch (e) {
        return null;
      }
    },
    set: function(key, value) {
      $window.localStorage.setItem(key, JSON.stringify(value));
    },
    clear: function() {
      localStorage.clear();
    }
  };
});
