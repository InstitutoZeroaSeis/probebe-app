angular.module("proBebe.services")
.factory 'PushProcessingService', ($rootScope, $cordovaPush, $ionicPlatform) ->
    initialize: ->
      pushConfig =
        senderID: "315459751586"
      $ionicPlatform.ready ->
        $cordovaPush.register(pushConfig).then (result) ->
          console.info("Push registered, result = #{result}")
        , (error) ->
          console.error("Registration failed, error = #{error}")

      $rootScope.$on 'pushNotificationReceived', (event, notification) ->
        console.log("EVENT RECEIVED: #{notification.event} ")
        switch  notification.event
          when 'registered'
            console.log("REGISTERED with GCM Server REGID: #{notification.regid}")
            if ( notification.regid.length > 0 )
              elem = angular.element(document.querySelector('[ng-app]'))
              injector = elem.injector()
              myService = injector.get('Authentication')
              myService.registerDeviceNotificationId(notification.regid)
          when 'message'
            console.log "Received message #{notification.message}, payload = #{notification.payload}"
            window.open(notification.payload.article_url, "_system")
          when 'error'
            console.log("ERROR MSG: #{notification}")
          else
            console.log("Unknown event sent: #{event}")

.factory 'MessagesService', ($http, $q, Constants) ->
  getMessages: ->
    url = "#{Constants.API_BASE_URL}/timeline"
    deferred = $q.defer()
    $http.get(url).then (result) ->
      deferred.resolve(result.data)
    .catch (error) ->
      deferred.reject(error)
    deferred.promise
