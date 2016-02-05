angular.module("proBebe.services").factory('Category', function($http, Constants) {
  function Category() {}

  Category.all = function(){
    return $http.get(Constants.CATEGORIES);
  }

  return Category;

});
