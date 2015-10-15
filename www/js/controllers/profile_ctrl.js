(function() {
  function showLoading(ionicLoading, text) {
    ionicLoading.show({
      template: text,
      noBackdrop: true,
      duration: 2000
    });
  }

  angular.module("proBebe.controllers")
  .controller("ProfileCtrl", function($rootScope, $scope, $ionicLoading, $filter, $state, $ionicPopup, authentication, mask, Profile, errorHandler) {
    $scope.profile = {
      name: authentication.name(),
      sons: []
    };

    function init(){
      buildProfile();
    }

    $scope.index = function(){
      $state.go('profile');
    }

    $scope.addSon = function(){
      $scope.profile.sons.push({name: "", bornDate: "", gender: ""})
    }

    $scope.showConfirm = function(index, profile) {
     var confirmPopup = $ionicPopup.confirm({
          title: 'Apagar filho(a)',
          template: 'Realmente que deseja apagar?',
          scope: $scope,
          buttons: [
            {
              text: '<b>Sim</b>',
              type: 'button-positive',
              onTap: function(e) {
                removeSon(index, profile);
              }
            },
            { text: 'Não' }
          ]
      });

    };

    function removeSon(index, profile){
      console.log("remove", index, profile)
      var son = profile.sons[index];
      if(son.id){
        console.log("if")
        son._destroy = 1;
      }else{
        profile.sons.splice(index,1);
      }
    }

    $scope.save = function(form){
      if(form.$valid){
        var data = paramToSave();
        Profile.update(data)
        .then(function(result) {
          showLoading($ionicLoading, "Perfil savo com sucesso");
          $state.go('messages');
        }).catch(function(response) {
          var messageError = errorHandler.message(response);
          showLoading($ionicLoading, messageError);
        });
      }
    }

    $scope.validadeCellNumber = function(){
      var cellPhone = $scope.profile.cellPhone;
      cellPhone = mask.noDigit(cellPhone);
      cellPhone = mask.bracketsTheFistTwoDigits(cellPhone);
      cellPhone = mask.dashBetweenFourAndFiveDigit(cellPhone);
      $scope.profile.cellPhone = cellPhone;
    }

    function getId(son){
      return son.id ? "0" : new Date().getTime();
    }

    function childrenAttributes(sons){
      var children = {};
      sons.forEach(function(son){
        children[getId(son)] = {
          id: son.id,
          name: son.name,
          birth_date: $filter('date')(son.bornDate, "dd/MM/yyyy"),
          gender: son.gender,
          _destroy: son._destroy
        }
      })
      return children;
    }

    function buildProfile (){
      showLoading($ionicLoading, "Carregando...");
      Profile.get()
      .then(function(result) {
        var profile = result.data;
        $scope.profile.id = profile.id;
        $scope.profile.name = profile.name;
        $scope.profile.gender = profile.gender;
        $scope.profile.cellPhone = profile.cell_phone;
        sonsScope(profile);
      }).catch(function(err) {
        showLoading($ionicLoading, "Ocorreu um erro em buscar o perfil");
      });
    }

    function sonsScope(profile){
      if(profile.children.length > 0){
        profile.children.forEach(function(son){
          $scope.profile.sons.push({
            id: son.id,
            name: son.name,
            bornDate: bornDate(son.birth_date),
            gender: son.gender,
            _destroy: false
          })
        })
      }else{
        $scope.profile.sons.push({name: "", bornDate: "", gender: ""});
      }
    }

    function bornDate(birthDate){
      var date = new Date();
      var splitDate = birthDate.split("-");
      date.setDate(splitDate[2]);
      date.setMonth(splitDate[1] -1);
      date.setYear(splitDate[0]);
      return date;
    }

    function paramToSave(){
      return {
        profile: {
          name: $scope.profile.name,
          gender: $scope.profile.gender,
          children_attributes: childrenAttributes($scope.profile.sons),
          cell_phone: $scope.profile.cellPhone,
          cell_phone_system: $rootScope.systemType
        }
      }
    }

    init();
  });
})();
