angular.module("proBebe.services", ["proBebe.constants", "ngCordova"]).factory "Friends", ->
  # Some fake testing data
  friends = [
    { id: 0, name: "Scruff McGruff" }
    { id: 1, name: "G.I. Joe" }
    { id: 2, name: "Miss Frizzle" }
    { id: 3, name: "Ash Ketchum" }
  ]
  all: ->
    friends

  get: (friendId) ->
    friends[friendId]
.factory "AuthenticationService", ($q, $http, Constants) ->
  authenticate: (email, password) ->
    authentication_data =
      email: email
      password: password

    localStorage.setItem 'email', email
    localStorage.setItem 'password', password
    localStorage.setItem 'authenticated', false

    url = "#{Constants.API_BASE_URL}/credentials"
    deferred = $q.defer()
    $http.post(url, authentication_data).then (result) ->
      localStorage.setItem 'authenticated', result.data.valid
      deferred.resolve(result.data.valid)
    .catch (err) ->
      console.log err
      deferred.reject("Could not authenticate")

    deferred.promise

  email: -> localStorage.getItem('email')
  isAuthenticated: -> localStorage.getItem('authenticated') == 'true'
  password: -> localStorage.getItem('password')

# factory for processing push notifications.
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
              myService = injector.get('AuthenticationService')
              # myService.registerID(notification.regid)
          when 'message'
            console.log "Received message #{JSON.stringify(notification.message)}, payload = #{notification.payload}"
            window.open(notification.payload.article_url, "_system")
          when 'error'
            console.log('ERROR MSG:' + notification)
          else
            console.log("Unknown event sent: #{event}")

    registerID: (id) ->
        console.log("Registration ID = #{id}")
        # MyService.registerNotificationID(id).then (response) ->
        #   if (response.data.Result)
        #     console.info('NOTIFY  Registration succeeded')
        #   else
        #     console.error('NOTIFY  Registration failed')
    unregister: ->
        console.info('unregister')
        push = window.plugins.pushNotification
        if (push)
          push.unregister ->
            console.info('unregister success')
