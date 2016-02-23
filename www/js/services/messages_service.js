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

  Message.configAgeChild = function(messages, lastMessage){
    messages.forEach(function(message){
      message.isNew = false;
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
      defineStatusOfMessages(message, lastMessage)
    })
    return messages;
  }

  Message.defineOldMessages = function(messages, lastMessage, childId){
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

  }

  function defineStatusOfMessages(message, lastMessage) {
    console.log(message.id > lastMessage.id, message.id, lastMessage.id)
    if(message.id > lastMessage.id) {
      message.isNew = true;
    }
  }

  return Message;

});
