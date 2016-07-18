angular.module("proBebe.services")
.factory('messageHandler', function($ionicLoading) {

  function Handler() {}

  Handler.show = function(message, duration){
    $ionicLoading.show({
      template: message,
      duration: duration || 4000
    });
    return $ionicLoading;
  };

  Handler.showWithTemplate = function(){
    $ionicLoading.show({
      templateUrl: 'templates/loading.html'
    });
    return $ionicLoading;
  };


  return Handler;

});
