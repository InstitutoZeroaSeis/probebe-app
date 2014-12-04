angular.module("proBebe.services", ["proBebe.constants", "ngCordova"]).run(function($http) {
  $http.defaults.headers.common.Accept = 'application/json';
});
