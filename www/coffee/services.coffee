angular.module("proBebe.services", ["proBebe.constants", "ngCordova"])
.run ($http) ->
  $http.defaults.headers.common['Accept'] = 'application/json'
.factory "AuthenticationService", ($q, $http, $rootScope, $cordovaDevice, Constants) ->
  authenticate: (email, password) ->
    authentication_data =
      email: email
      password: password

    localStorage.setItem 'email', email
    localStorage.setItem 'password', password
    localStorage.setItem 'authenticated', false

    url = "#{Constants.API_BASE_URL}/credentials"
    deferred = $q.defer()
    $http.post(url, authentication_data).then (result) =>
      localStorage.setItem 'authenticated', result.data.valid
      if result.data.valid
        @setAuthenticationHeaders
        $rootScope.$emit('authenticate')
      deferred.resolve(result.data.valid)
    .catch (err) ->
      console.log err
      deferred.reject("Could not authenticate")

    deferred.promise

  email: -> localStorage.getItem('email')
  isAuthenticated: -> localStorage.getItem('authenticated') == 'true'
  initialize:->
    @setAuthenticationHeaders() if @isAuthenticated
  password: -> localStorage.getItem('password')
  registerDeviceNotificationId: (device_registration_id) ->
    registration_data =
      device_registration:
        platform: $cordovaDevice.getPlatform()
        platform_code: device_registration_id
    url = "#{Constants.API_BASE_URL}/device_registrations"
    $http.post(url, registration_data, format: 'json').then (result, status) ->
      localStorage.setItem 'registered', status == 200
    .catch (err) ->
      console.log err
  setAuthenticationHeaders: ->
    $http.defaults.headers.common['X-User-Email'] = @email
    $http.defaults.headers.common['X-User-Password'] = @password

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
