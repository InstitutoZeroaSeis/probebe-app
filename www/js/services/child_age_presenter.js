angular.module("proBebe.services")
.factory('ChildAgePresenter', function() {

  function Presenter() {}

  Presenter.build = function(children){
    children.forEach(function(child){
      child.messages.forEach(function(message){
        message.category = "category-1";
        if(message.mon_is_pregnant){
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
          if (month == 0) message.child_age_in_week_at_delivery = week + " semana(s)";
        }
        message.category = messageCategory(message);
      })
    })
    return children;
  }

  function messageCategory(message){
    if(message.article_category.toLowerCase() == "saúde") return "category-1";
    if(message.article_category.toLowerCase() == "educação") return "category-2";
    if(message.article_category.toLowerCase() == "desenvolvimento") return "category-3";
    if(message.article_category.toLowerCase() == "segurança") return "category-4";
    if(message.article_category.toLowerCase() == "finanças") return "category-5";
    if(message.article_category.toLowerCase() == "jurídico") return "category-6";
    if(message.article_category.toLowerCase() == "comportamento") return "category-7";
  }

  return Presenter;

});
