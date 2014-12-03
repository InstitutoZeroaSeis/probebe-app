services = angular.module("proBebe.services")
services.service "Authentication", ($q, $http, $rootScope, $cordovaDevice, Constants) ->
  new class Authentication
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
