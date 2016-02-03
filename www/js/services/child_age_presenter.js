angular.module("proBebe.services")
.factory('ChildAgePresenter', function() {

  function Presenter() {}

  Presenter.build = function(messages){
    messages.forEach(function(message){
      message.category = "category-1";
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
      message.category = messageCategory(message);
    })
    return messages;
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
