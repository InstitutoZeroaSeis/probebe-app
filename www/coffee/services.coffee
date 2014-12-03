angular.module("proBebe.services", ["proBebe.constants", "ngCordova"])
.run ($http) ->
  $http.defaults.headers.common['Accept'] = 'application/json'
