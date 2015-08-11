angular.module("proBebe.services").factory('Microdonation', function($resource, Constants, storage, $ionicPopup, Profile) {
  return {
    setProfileType: function(profileType){
      storage.set('profileType', profileType);
    },
    getProfileType: function(){
      return storage.get('profileType');
    },
    isProfilePossibleDonor: function(){
      return this.getProfileType() === Constants.PROFILE_TYPE_POSSIBLE_DONOR;
    },
    sendMessages: function(){

    },
    _showSuccessPopup: function(message, scope){
      $ionicPopup.show({
        template: message,
        title: 'Confirmado',
        subTitle: '',
        scope: scope,
        buttons: [
          { text: 'Ok' },
        ]
      });
    },
    openRequestPopup: function(scope){
      var self = this;
      scope.microdonation = {
        childrenNumber: 3
      };

      function confirmFunction(e){
        var ProfileMaxRecipientChildren = $resource(Constants.PROFILE_URL + "/max_recipient_children");
        ProfileMaxRecipientChildren.save({ max_recipient_children: scope.microdonation.childrenNumber }, function(){
          self._showSuccessPopup("Parabéns! Você é uma doadora de mensagens!");
        })
      }

      $ionicPopup.show({
        template: 'Número de Crianças: <select ng-model="microdonation.childrenNumber">' +
                    '<option value="1">1</option>' +
                    '<option value="3">3</option>' +
                    '<option value="5">5</option>' +
                  '</select>',
        title: 'Doação de Mensagens',
        subTitle: 'Gostaria de se tornar uma doadora de mensagens?',
        scope: scope,
        buttons: [
          { text: 'Não' },
          {
            text: 'Sim',
            type: 'button-positive',
            onTap: confirmFunction
          }
        ]
      });
    }

  }
});
