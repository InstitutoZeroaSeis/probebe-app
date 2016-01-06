angular.module("proBebe.services").factory('BirthdayCard', function($http, Constants) {

  function Card() {}

  Card.get = function(params){
    return $http.get(Constants.BIRTHDAY_CARD, {params});
  }

  return Card;

});
