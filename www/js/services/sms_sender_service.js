angular.module("proBebe.services").factory('SmsSender', function($cordovaSms, $q) {
  return {
    send: function(message, number){
      var options = {};
      return $q.when(true);
      //return $cordovaSms.send(number, message, options);
    }
  }

});
