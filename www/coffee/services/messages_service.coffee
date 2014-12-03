angular.module("proBebe.services")
.factory 'MessagesService', ($http, $q, Constants) ->
  getMessages: ->
    url = "#{Constants.API_BASE_URL}/timeline"
    deferred = $q.defer()
    $http.get(url).then (result) ->
      deferred.resolve(result.data)
    .catch (error) ->
      deferred.reject(error)
    deferred.promise
