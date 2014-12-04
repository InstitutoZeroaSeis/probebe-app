angular.module("proBebe.services").factory('messages', function($http, $q, Constants) {
  return {
    getMessages: function() {
      var deferred, url;
      url = "" + Constants.API_BASE_URL + "/timeline";
      deferred = $q.defer();
      $http.get(url).then(function(result) {
        deferred.resolve(result.data);
      }).catch(function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }
  };
});
