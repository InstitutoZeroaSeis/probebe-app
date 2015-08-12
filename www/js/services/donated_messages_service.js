angular.module("proBebe.services").factory('DonatedMessage', function($resource, Constants) {
  return $resource(Constants.DONATED_MESSAGES_URL);
});
