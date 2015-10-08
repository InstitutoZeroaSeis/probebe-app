angular.module("proBebe.services")
.factory('mask', function() {

  function Mask() {}

  Mask.noDigit = function(input){
    console.log(input)
    return input.replace(/\D/g, '');
  }

  Mask.bracketsTheFistTwoDigits = function(input){
    return input.replace(/^(\d{2})(\d)/g, '$1 $2');
  }

  Mask.dashBetweenFourAndFiveDigit = function(input){
    return input.replace(/(\d)(\d{4})$/, '$1-$2');
  }

  return Mask;

});
