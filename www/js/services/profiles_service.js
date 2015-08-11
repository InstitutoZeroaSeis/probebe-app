angular.module("proBebe.services").factory('Profile', function($http, Constants) {

  function Profile() {}

  Profile.get = function(){
    return $http.get(Constants.PROFILE_URL);
  }

  Profile.update = function(data){
    return $http.post(Constants.PROFILE_URL, data);
  }

  return Profile;

});
