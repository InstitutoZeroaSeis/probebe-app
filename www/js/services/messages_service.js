angular.module("proBebe.services").factory('Message', function($http, Constants, storage) {

  function Message() {}

  Message.all = function(params){
    return $http.get(Constants.MESSAGE_URL+ params.id);
  }

  Message.onlyNewMessages = function(params){
    return $http.get(Constants.ONLY_NEW_MESSAGE_URL, {params: params});
  }

  Message.setLastMessage = function(messages, childId){
    // Is necessary message order by id ASC
    var lastMessage = messages[messages.length -1];
    storage.set("lastMessage_" + childId, lastMessage);
  }

  Message.getLastMessage = function(childId){
    var lastMessage = storage.get("lastMessage_" + childId);
    return lastMessage || {id:0};
  }

  Message.setMessages = function(childId, msgs){
    storage.set("messages_" + childId, msgs);
  }

  Message.getMessages = function(childId){
    return storage.get("messages_" + childId) || [];
  }

  Message.configAgeChild = function(messages, lastMessage, child){
    messages.forEach(function(message){
      message.isNew = false;
      if(message.mon_is_pregnant){
        message.child_age_in_week_at_delivery += " semana(s)"
        message.pregnancy = true;
        message.type = "week";
      }else{
        var age_in_weeks = message.child_age_in_week_at_delivery;
        var month = ageInMonthOf(message, child);
        message.age = age_in_weeks;
        message.type = "month";
        message.child_age_in_week_at_delivery = definePeriodString(month, age_in_weeks);
      }
      defineStatusOfMessages(message, lastMessage);
    })
    return messages;
  }

  Message.defineOldMessages = function(messages, lastMessage, childId){
    try{
      if(lastMessage.id){
        var date = new Date();
        var today = date.getDate();
        var month = date.getMonth() + 1;
        var splitDate = lastMessage.delivery_date.split("-");
        var dateOfLastMessage = new Date(splitDate[0],(splitDate[1] -1), splitDate[2]);
        if((dateOfLastMessage.getMonth() +1) > month || (today - dateOfLastMessage.getDate()) >= 1){
          messages.forEach(function(message){
            message.isNew = false;
          })
          Message.setMessages(childId, messages);
        }
      }
    }catch(error){
      console.log(error);
    }

  }

  function ageInMonthOf(message, child){
    return parseInt(moment(moment(message.delivery_date).format("YYYY-MM-DD")).diff(moment(child.birth_date, "YYYY-MM-DD"), 'months', true));
  }

  function definePeriodString(month, age_in_weeks){
    if(month == 0) return "recém-nascido";
    if(month == 1) return month + " mês";
    if(month > 1) return month + " meses";
  }

  function defineStatusOfMessages(message, lastMessage) {
    if(message.id > lastMessage.id) {
      message.isNew = true;
    }
  }

  return Message;

});
