angular.module("proBebe.controllers")
.controller("ProfileCtrl", function($scope, $ionicLoading, $filter, $state, authentication, mask, Profile) {
  $scope.profile = {
    name: authentication.name(),
    sons: []
  };

  function init(){
    buildProfile();
  }

  $scope.addSon = function(){
    $scope.profile.sons.push({name: "", bornDate: "", gender: ""})
  }

  $scope.save = function(){
    var data = paramToSave();
    Profile.update(data)
    .then(function(result) {
      console.log("======UPDATE========")
      console.log(result)
    }).catch(function(err) {
      // showLoading($ionicLoading, "Ocorreu um erro em buscar o perfil");
      console.log("Ocorreu um erro na atualização do perfil", err);

    });;
    console.log(data);
  }

  $scope.validadeCellNumber = function(){
    var cellPhone = $scope.profile.cellPhone;
    cellPhone = mask.noDigit(cellPhone);
    cellPhone = mask.bracketsTheFistTwoDigits(cellPhone);
    cellPhone = mask.dashBetweenFourAndFiveDigit(cellPhone);
    $scope.profile.cellPhone = cellPhone;
  }

  function childrenAttributes(sons){
    var children = {};
    sons.forEach(function(son){
      children[son.id || new Date().getTime()] = {
        name: son.name,
        birth_date: $filter('date')(son.bornDate, "dd/MM/yyyy"),
        gender: son.gender,
        "_destroy": false
      }
    })
    return children;
  }

  function buildProfile (){
    Profile.get()
    .then(function(result) {
      var profile = result.data;
      $scope.profile.id = result.data.id;
      sonsScope(profile);

    }).catch(function(err) {
      // showLoading($ionicLoading, "Ocorreu um erro em buscar o perfil");
      console.log("Ocorreu um erro em buscar o perfil");

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
        cell_phone_system: "android"
      }
    }
  }

  init();
});
