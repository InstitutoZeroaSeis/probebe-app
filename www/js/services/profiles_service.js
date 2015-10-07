angular.module("proBebe.services").factory('Profile', function($http, Constants) {

  function Profile() {}

  Profile.get = function(){
    return $http.get(Constants.PROFILE_URL);
  }

  Profile.update = function(data){
    return $http.post(Constants.PROFILE_URL, data);
  }

  Profile.maxRecipientChildren = function(recipientChildren){
    return $http.post(Constants.PROFILE_MAX_RECIPIENT_CHILDREN, { max_recipient_children: recipientChildren});
  }

  return Profile;

});
