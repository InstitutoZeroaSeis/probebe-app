angular.module("proBebe.services", ["proBebe.constants", "ngCordova", "ngResource"]).run(function($http) {
  $http.defaults.headers.common.Accept = 'application/json';
});
