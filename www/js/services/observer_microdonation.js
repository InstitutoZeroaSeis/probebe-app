angular.module("proBebe.services")
.factory('ObserverMicrodonation', function($rootScope, storage) {

  function Observer() {}

  Observer.start = function(){
    var dateShowPopup = storage.get('dateShowPopup');
    if(dateShowPopup == null){
      var current = new Date;
      current.setMonth(current.getMonth() + 1);
      storage.set('dateShowPopup', current);
    }
  }

  Observer.updateDateShowPopup = function(){
    var current = new Date;
    current.setDate(current.getDate() + 14); // 2 weeks
    storage.set('dateShowPopup',current);
    $rootScope.$emit('showBadge');
  }

  Observer._isTimeToShow = function(current){
    var dateShowPopup = new Date(storage.get('dateShowPopup'));
    if((dateShowPopup.getMonth() <= current.getMonth())
      && (dateShowPopup.getDate() <= current.getDate())
      && (dateShowPopup.getFullYear() == current.getFullYear()))
    {
      dateShowPopup.setFullYear(dateShowPopup.getFullYear() -1);
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
