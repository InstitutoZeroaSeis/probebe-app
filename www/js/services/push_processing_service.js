angular.module("proBebe.services").factory('pushProcessing', function($rootScope, $cordovaPush, $ionicPlatform, Constants, authentication) {
  var PushProcessing = function() {
    var pushNotification = function(event, notification) {
      var elem, injector, myService;
      console.info("pushNotificationReceived. Notification argument: " + JSON.stringify(notification));

      if (notification.event === 'registered') {
        authentication.registerDeviceNotificationId(notification.regid);
      } else if (notification.event === 'message') {
        $rootScope.$broadcast('pushMessageReceived', notification.message);
      }
    };

    this.initialize = function() {
      var pushConfig = {
        senderID: Constants.PUSH_NOTIFICATION.GCM.SENDER_ID,
        ecb: 'onNotification'
      };

      $ionicPlatform.ready(function() {
        $cordovaPush.register(pushConfig).then(function(result) {
          console.info("Push registered, result = " + result);
        }).catch(function (error) {
          console.error("Registration failed, error = " + error);
        });
      });

      $rootScope.$on('pushNotificationReceived', pushNotification);
    };
  };

  return new PushProcessing();
});
