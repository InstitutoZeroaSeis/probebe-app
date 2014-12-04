angular.module("proBebe.services").factory('PushProcessingService', function($rootScope, $cordovaPush, $ionicPlatform) {
  return {
    initialize: function() {
      var pushConfig;
      pushConfig = {
        senderID: "315459751586"
      };
      $ionicPlatform.ready(function() {
        $cordovaPush.register(pushConfig).then(function(result) {
          console.info("Push registered, result = " + result);
        }, function(error) {
          console.error("Registration failed, error = " + error);
        });
      });
      return $rootScope.$on('pushNotificationReceived', function(event, notification) {
        var elem, injector, myService;
        console.log("EVENT RECEIVED: " + notification.event + " ");
        switch (notification.event) {
          case 'registered':
            console.log("REGISTERED with GCM Server REGID: " + notification.regid);
            if (notification.regid.length > 0) {
              elem = angular.element(document.querySelector('[ng-app]'));
              injector = elem.injector();
              myService = injector.get('authentication');
              myService.registerDeviceNotificationId(notification.regid);
            }
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
