angular.module("proBebe.services")
.factory('ChildAgePresenter', function() {

  function Presenter() {}

  Presenter.build = function(children){
    children.forEach(function(child){
      child.messages.forEach(function(message){
        message.category = "category-1";
        if(child.pregnancy){
          message.child_age_in_week_at_delivery += " semana(s)"
          message.pregnancy = true;
          message.type = "week";
        }else{
          var age = message.child_age_in_week_at_delivery;
          var month = parseInt(age / 4);
          var week = age % 4;
          message.age = age;
          message.type = "month";
          message.child_age_in_week_at_delivery = month;
          month > 1 ? message.child_age_in_week_at_delivery += " meses" : message.child_age_in_week_at_delivery += " mês";
          message.category = messageCategory(message, month);
        }
      })
    })
    return children;
  }

  function messageCategory(message, month){
    return "category-3";
    if(message.pregnancy) return "category-1";
    if (month <= 4) return "category-2";
    if (month <= 8) return "category-3";
    if (month <= 12) return "category-4";
    if (month <= 18) return "category-5";
  }

  return Presenter;

});
