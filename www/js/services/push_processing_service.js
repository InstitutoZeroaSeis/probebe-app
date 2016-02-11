angular.module("proBebe.services").factory('pushProcessing', function($rootScope, $cordovaPush, $ionicPlatform, Constants, authentication) {
  var PushProcessing = function() {
    this.initialize = function() {
      $ionicPlatform.ready( function(){
        var push = PushNotification.init({
          android: {
            senderID: Constants.PUSH_NOTIFICATION.GCM.SENDER_ID,
            "icon": "push_logo",
            "iconColor": "#f69343"
          },
          ios: {
            alert: "true",
            badge: true,
            sound: 'false'
          }
        });

        push.on('registration', function(data){
          console.log("Push Registration:", data)
          authentication.registerDeviceNotificationId(data.registrationId);
        });
        push.on('notification', function(data){
          console.log("Push Notification:", data)
          $rootScope.$broadcast('pushMessageReceived', notification.message);
        });

        push.on('error', function(error){
          console.log("Push Error:", error)
        });
      });
    };
  };

  return new PushProcessing();
});
