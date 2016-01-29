angular.module("proBebe.controllers")
.controller("ProfileCtrl", function($rootScope, $scope, $timeout, $filter, $state, $ionicPopup, $ionicScrollDelegate, authentication, mask, Profile, errorHandler, messageHandler, storage) {

  function init(){
    $scope.profile = {
      name: authentication.name(),
      email: authentication.email(),
      sons: []
    };
    buildProfile();
  }

  $scope.addSon = function(){
    $scope.profile.sons.push({name: "", bornDate: "", gender: ""})
  }

  $scope.showConfirm = function(index, profile) {
   var confirmPopup = $ionicPopup.confirm({
        templateUrl: 'templates/popup/delete_son.html',
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
    var son = profile.sons[index];
    if(son.id){
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
        reloadProfile();
      }).catch(function(response) {
        messageHandler.show(errorHandler.message(response));
      });
    }else{
      messageHandler.show("Dados inválidos");
    }
  }

  $scope.validadeCellNumber = function(){
    var cellPhone = $scope.profile.cellPhone;
    if(cellPhone){
      cellPhone = mask.noDigit(cellPhone);
      cellPhone = mask.bracketsTheFistTwoDigits(cellPhone);
      cellPhone = mask.dashBetweenFourAndFiveDigit(cellPhone);
    }
    $scope.profile.cellPhone = cellPhone;
  }

  function reloadProfile(){
    if($scope.profile.sons.length != storage.get("profile").children.length){
      Profile.reloadChild()
      .then(function(result) {
        if (result) messageHandler.show("Dados salvos!");
        else messageHandler.show("Não foi possível recarregar os dados!");

        $timeout(function(){
          $state.go('app.messages', {childId: "null"});
        },2000);
      }).catch(function(error) {
        messageHandler.show("Impossível comunicar com o ProBebe. Favor verificar sua conexão com a internet");
      });
    }else{
      messageHandler.show("Dados salvos!");
      $timeout(function(){
        $state.go('app.messages', {childId: "null"});
      },2000);
    }
  }

  function getId(son, index){
    return son.id ? index.toString() : new Date().getTime();
  }

  function childrenAttributes(sons){
    var children = {};
    sons.forEach(function(son, index){
      children[getId(son, index)] = {
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
    var loading = messageHandler.show("Carregando...");
    Profile.get()
    .then(function(result) {
      var profile = result.data;
      $scope.profile.id = profile.id;
      $scope.profile.name = profile.name;
      $scope.profile.gender = profile.gender;
      $scope.profile.cellPhone = profile.cell_phone;
      sonsScope(profile);
      loading.hide();
    }).catch(function(err) {
      loading.hide();
      messageHandler.show("Ocorreu um erro em buscar o perfil");
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
