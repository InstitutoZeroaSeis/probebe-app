angular.module("starter.services", []).factory "Friends", ->
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
.factory "AuthenticationService", ($q, $http) ->
  authenticate: (email, password) ->
    authentication_data =
      email: email
      password: password

    localStorage.setItem 'email', email
    localStorage.setItem 'password', password
    localStorage.setItem 'authenticated', false

    url = 'http://localhost:3000/credentials'
    deferred = $q.defer()
    $http.post(url, authentication_data).then (result) ->
      localStorage.setItem 'authenticated', result.data.valid
      deferred.resolve(result.data.valid)
    .catch (err) ->
      deferred.reject("Error")

    deferred.promise

  email: -> localStorage.getItem('email')
  isAuthenticated: ->
    localStorage.getItem('authenticated') == 'true'
  password: -> localStorage.getItem('password')
