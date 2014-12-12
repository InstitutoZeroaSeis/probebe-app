angular.module("proBebe.services").factory("Child", function($http, $q, Constants, $resource) {
  return $resource(Constants.API_BASE_URL + "/api/children");
});
