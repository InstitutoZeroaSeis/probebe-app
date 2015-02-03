angular.module("proBebe.services").factory('Message', function($resource, Constants) {
  return $resource(Constants.MESSAGE_URL);
});
