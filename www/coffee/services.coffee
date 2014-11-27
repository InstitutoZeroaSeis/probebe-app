angular.module("proBebe.services", ["proBebe.constants"]).factory "Friends", ->
  # Some fake testing data
  friends = [
    {
      id: 0
      name: "Scruff McGruff"
    }
    {
      id: 1
      name: "G.I. Joe"
    }
    {
      id: 2
      name: "Miss Frizzle"
    }
    {
      id: 3
      name: "Ash Ketchum"
    }
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
.factory 'PushProcessingService', ->
    onDeviceReady = ->
        console.info('NOTIFY  Device is ready.  Registering with GCM server')
        # register with google GCM server
        pushNotification = window.plugins.pushNotification
        pushNotification.register(gcmSuccessHandler, gcmErrorHandler, {"senderID": "315459751586", "ecb": "onNotificationGCM"})
    gcmSuccessHandler = (result) ->
      console.info('NOTIFY  pushNotification.register succeeded.  Result = '+result)
    gcmErrorHandler = (error) ->
      console.error('NOTIFY  '+error)

    initialize: ->
      console.info('NOTIFY  initializing')
      document.addEventListener('deviceready', onDeviceReady, false)
    registerID: (id) ->
        # Insert code here to store the user's ID on your notification server.
        # You'll probably have a web service (wrapped in an Angular service of course) set up for this.
        # For example:
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


# ALL GCM notifications come through here.
onNotificationGCM = (e) ->
  console.log("EVENT RECEIVED: #{e.event} ")
  switch  e.event
    when 'registered'
      console.log("REGISTERED with GCM Server -&gt REGID: #{e.regid}")
      if ( e.regid.length > 0 )
        # call back to web service in Angular.
        # This works for me because in my code I have a factory called
        # PushProcessingService with method registerID
        elem = angular.element(document.querySelector('[ng-app]'))
        # injector = elem.injector()
        # myService = injector.get('PushProcessingService')
        # myService.registerID(e.regid)
    when 'message'
      console.dir(e)
      # if this flag is set, this notification happened while we were in the foreground.
      # you might want to play a sound to get the user's attention, throw up a dialog, etc.
      if (e.foreground)
        # we're using the app when a message is received.
        console.log('--INLINE NOTIFICATION--' + '')
        # if the notification contains a soundname, play it.
        # var my_media = new Media(&quot/android_asset/www/&quot+e.soundname)
        # my_media.play()
        alert(e.payload.message)
      else
        window.open(e.article_url, "_system")
        # otherwise we were launched because the user touched a notification in the notification tray.
        if (e.coldstart)
          console.log('--COLDSTART NOTIFICATION--' + '')
        else
          console.log('--BACKGROUND NOTIFICATION--' + '')
        # direct user here:
        window.location = "#/tab/featured"
      console.log('MESSAGE -&gt MSG: ' + e.payload.message + '')
      console.log('MESSAGE: '+ JSON.stringify(e.payload))
    when 'error'
      console.log('ERROR -&gt MSG:' + e.msg + '')
    else
      console.log('EVENT -&gt Unknown, an event was received and we do not know what it is')
