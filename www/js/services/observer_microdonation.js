angular.module("proBebe.services")
.factory('ObserverMicrodonation', function(storage) {

  function Observer() {}

  Observer.start = function(state){
    var dateShowPopup = storage.get('dateShowPopup');
    if(dateShowPopup == null){
      var current = new Date;
      current.setMonth(current.getMonth() + 1);
      console.log("dateShowPopup", current);
      storage.set('dateShowPopup', current);
    }
  }

  Observer.updateDateShowPopup = function(){
    var current = new Date;
    current.setDate(current.getDate() + 7);
    storage.set('dateShowPopup',current);
  }

  Observer._isTimeToShow = function(current){
    var dateShowPopup = new Date(storage.get('dateShowPopup'));
    if((dateShowPopup.getMonth() == current.getMonth()) && (dateShowPopup.getDate() == current.getDate())){
      dateShowPopup.setMonth(dateShowPopup.getMonth() -2);
      storage.set('dateShowPopup',dateShowPopup);
      return true;
    } else return false;
  }

  Observer.isTimeToShowPopup = function(){
    var current =  new Date;
    return Observer._isTimeToShow(current)
  }

  return Observer;

});
