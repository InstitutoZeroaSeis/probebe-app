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
      .send(donated_message.message, '5511973062961')
      .then(function(){
        return self._markMessageAsSent(donated_message);
      }, function(){
        return false;
      })
    },
    _markMessageAsSent: function(donated_message){
      var DonatedMessageMarkAsSent = $resource(Constants.DONATED_MESSAGES_URL + '/mark_as_sent');
      DonatedMessageMarkAsSent.save({id: donated_message.id})
      .$promise.then(function(){
        return true;
      })
      .catch(function(){
        return false;
      });
    }

  }
});
