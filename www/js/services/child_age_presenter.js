angular.module("proBebe.services")
.factory('ChildAgePresenter', function() {

  function Presenter() {}

  Presenter.build = function(messages){
    messages.forEach(function(message){
      if(message.mon_is_pregnant){
        message.child_age_in_week_at_delivery += " semana(s)"
        message.pregnancy = true;
        message.type = "week";
      }else{
        var age = message.child_age_in_week_at_delivery;
        var month = parseInt(age * 7 / 30);
        message.age = age;
        message.type = "month";
        if(month != 0) {
          message.child_age_in_week_at_delivery = month + " meses";
        }else if(month == 1){
          message.child_age_in_week_at_delivery = month + " mês";
        }
        if(month == 0){
          message.child_age_in_week_at_delivery = age + " semana(s)";
        }
      }
    })
    return messages;
  }

  return Presenter;

});
