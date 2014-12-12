angular.module("proBebe.services").factory('Message', function($resource, Constants) {
  return $resource(Constants.API_BASE_URL + "/api/messages/:id");
});
