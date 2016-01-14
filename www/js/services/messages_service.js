angular.module("proBebe.services").factory('Message', function($http, Constants) {
  function Message() {}

  Message.all = function(params){
    return $http.get(Constants.MESSAGE_URL+ params.id);
  }

  return Message;

});
