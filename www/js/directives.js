angular.module("proBebe").directive('childName', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: "templates/directives/child-name.html",
    scope: {
      child : "=child"
    }
  };
});
