angular.module("proBebe.services").factory("Child", function(Constants, $resource) {
  return $resource(Constants.CHILDREN_URL);
});
