angular.module("proBebe.controllers")
.controller("ProfileCtrl", function($rootScope, $scope, $ionicLoading, $filter, $state, $ionicPopup, $ionicScrollDelegate, authentication, mask, Profile, errorHandler, messageHandler) {
  $scope.profile = {
    name: authentication.name(),
    email: authentication.email(),
    sons: []
  };

  $scope.showSuccessMgs = false;

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
    var loading = messageHandler.showWithTemplate();
    if(form.$valid){
      var data = paramToSave();
      Profile.update(data)
      .then(function(result) {
        loading.hide();
        stateSucessMsg();
      }).catch(function(response) {
        loading.hide();
        messageHandler.show(errorHandler.message(response));
      });
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

  function getId(son){
    return son.id ? "0" : new Date().getTime();
  }

  function stateSucessMsg (){
    $scope.showSuccessMgs = true;
    $ionicScrollDelegate.anchorScroll("#goMgs");
    setTimeout(function(){
      $scope.$apply(function () {
          $scope.showSuccessMgs = false;
        });
    }, 4000);
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
    var loading = messageHandler.showWithTemplate();
    Profile.get()
    .then(function(result) {
      var profile = result.data;
      $scope.profile.id = profile.id;
      $scope.profile.name = profile.name;
      $scope.profile.gender = profile.gender;
      $scope.profile.cellPhone = profile.cell_phone;
      sonsScope(profile);
      console.log(profile);
      loading.hide();
    }).catch(function(err) {
      loading.hide();
      messageHandler.showWithTemplate("Ocorreu um erro em buscar o perfil");
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
