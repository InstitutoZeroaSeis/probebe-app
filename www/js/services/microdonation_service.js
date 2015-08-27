angular.module("proBebe.services").factory('Microdonation', function($resource, Constants, storage, $ionicPopup, Profile, DonatedMessage, $q, SmsSender) {
  return {
    setProfileType: function(profileType){
      storage.set('profileType', profileType);
    },
    getProfileType: function(){
      return storage.get('profileType');
    },
    setSendingMessages: function(value){
      storage.set('microdonationSendingMessage', value);
    },
    isSendingMessages: function(){
      return storage.get('microdonationSendingMessage');
    },
    isProfilePossibleDonor: function(){
      return this.getProfileType() === Constants.PROFILE_TYPE_POSSIBLE_DONOR;
    },
    isProfileDonor: function(){
      return this.getProfileType() === Constants.PROFILE_TYPE_DONOR;
    },
    sendMessages: function(){
      var self = this;
      if(self.isSendingMessages()){
        return;
      }
      self.setSendingMessages(true);
      DonatedMessage.get()
        .$promise.then(function(resp){
          return $q.all(resp.donated_messages.map(function(donated_message){
            if(self._wasAlreadySent(donated_message))
              return self._markMessageAsSent(donated_message);

            return self._sendMessage(donated_message);
          }));
        })
        .then(function(resp){
          self.setSendingMessages(false);
          console.log('Terminou de enviar as mensagens');
        }).catch(function(){
          self.setSendingMessages(false);
          console.log('Falha');
        });
    },
    _sendMessage: function(donated_message){
      var self = this;
      SmsSender
      .send(donated_message.message, donated_message.phone_number)
      .then(function(){
        self._addInAlreadySentList(donated_message);
        return self._markMessageAsSent(donated_message);
      }, function(){
        return false;
      })
    },
    _markMessageAsSent: function(donated_message){
      var self = this;
      var DonatedMessageMarkAsSent = $resource(Constants.DONATED_MESSAGES_URL + '/mark_as_sent');
      return DonatedMessageMarkAsSent.save({id: donated_message.id})
      .$promise.then(function(){
        self._removeFromAlreadySentList(donated_message);
        return true;
      })
      .catch(function(){
        return false;
      });
    },
    _wasAlreadySent: function(donated_message){
      var messagesSent = storage.get('messagesSent');
      if(!messagesSent)
        return false;
      return messagesSent.indexOf(donated_message.id) >= 0
    },
    _addInAlreadySentList: function(donated_message){
      var messagesSent = storage.get('messagesSent');
      if(!messagesSent)
        messagesSent = [];

      messagesSent.push(donated_message.id);
      storage.set('messagesSent', messagesSent)
    },
    _removeFromAlreadySentList: function(donated_message){
      var messagesSent = storage.get('messagesSent');
      if(!messagesSent)
        return true;

      var index =  messagesSent.indexOf(donated_message.id)

      if(index >= 0)
        messagesSent.splice(index, 1);

      storage.set('messagesSent', messagesSent)
    }
  }
});
