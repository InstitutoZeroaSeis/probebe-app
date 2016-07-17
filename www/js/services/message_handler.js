angular.module("proBebe.services")
.factory('messageHandler', function($ionicLoading) {

  function Handler() {}

  Handler.show = function(message){
    $ionicLoading.show({
      template: message,
      duration: 5000
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
