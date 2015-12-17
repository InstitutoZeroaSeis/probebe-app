angular.module("proBebe.services")
.factory('ChildAgePresenter', function() {

  function Presenter() {}

  Presenter.build = function(children){
    children.forEach(function(child){
      child.messages.forEach(function(message){
        if(child.pregnancy){
          message.child_age_in_week_at_delivery += " semana(s)"
        }else{
          var age = message.child_age_in_week_at_delivery;
          var month = parseInt(age / 4);
          var week = age % 4;
          message.child_age_in_week_at_delivery = month+ " mês "+ week+ " semana(s)";
        }
      })
    })
    return children;
  }

  return Presenter;

});
