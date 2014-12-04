angular.module("proBebe.services").factory('pushProcessing', function($rootScope, $cordovaPush, $ionicPlatform, Constants, authentication) {
  return {
    initialize: function() {
      var pushConfig = { senderID: Constants.PUSH_NOTIFICATION.GCM.SENDER_ID };
      $ionicPlatform.ready(function() {
        $cordovaPush.register(pushConfig).then(function(result) {
          console.info("Push registered, result = " + result);
        }, function(error) {
          console.error("Registration failed, error = " + error);
        });
      });
      $rootScope.$on('pushNotificationReceived', function(event, notification) {
        var elem, injector, myService;
        console.log("EVENT RECEIVED: " + notification.event + " ");
        switch (notification.event) {
          case 'registered':
            console.log("REGISTERED with GCM Server REGID: " + notification.regid);
            authentication.registerDeviceNotificationId(notification.regid);
            break;
          case 'message':
            console.log("Received message " + notification.message + ", payload = " + notification.payload);
            window.open(notification.payload.article_url, "_system");
            break;
          case 'error':
            console.log("ERROR MSG: " + notification);
            break;
          default:
            console.log("Unknown event sent: " + event);
        }
      });
    }
  };
});
