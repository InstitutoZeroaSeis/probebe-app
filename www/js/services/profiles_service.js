angular.module("proBebe.services").factory('Profile', function($q, $rootScope, $http, Constants, authentication, storage) {

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

  Profile.reloadChild = function() {
    var deferred = $q.defer();
    var authentication_data = {
      email: authentication.email(),
      password: authentication.password(),
      social_network_id: authentication.socialNetworkId()
    };

    $http.post(Constants.CREDENTIALS_URL, authentication_data).then(function(result) {
      if (result.data.valid) {
        storage.set('profile',result.data);
      }
      deferred.resolve(result.data.valid);
    }).catch(function(err) {
      deferred.reject("Não foi possível atualizar os dados");
    });
    return deferred.promise;
  }

  return Profile;

});
