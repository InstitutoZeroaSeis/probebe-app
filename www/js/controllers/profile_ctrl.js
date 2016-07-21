angular.module("proBebe.controllers")
  .controller("ProfileCtrl", function ($rootScope, $scope, $timeout, $filter, $state, $ionicPopup, $ionicScrollDelegate, authentication, mask, Profile, errorHandler, messageHandler, storage, $ionicLoading) {
    $scope.isChildOverAge = false;


    function init() {
      $scope.profile = {
        name: authentication.name(),
        email: authentication.email(),
        sons: []
      };
      buildProfile();
    }

    $scope.addSon = function () {
      $scope.profile.sons.push({name: "", bornDate: "", gender: ""})
    };

    $scope.showConfirm = function (index, profile) {
      var confirmPopup = $ionicPopup.confirm({
        templateUrl: 'templates/popup/delete_son.html',
        scope: $scope,
        buttons: [
          {
            text: '<b>Sim</b>',
            type: 'button-positive',
            onTap: function (e) {
              removeSon(index, profile);
            }
          },
          {text: 'Não'}
        ]
      });

    };

    $scope.active = function () {
      Profile.active()
        .then(function (result) {
          messageHandler.show("Conta ativada com sucesso");
          $scope.profile.active = true;
        }).catch(function (response) {
        messageHandler.show("Erro ao ativar a conta");
      });
    };

    $scope.disable = function () {
      Profile.disable()
        .then(function (result) {
          messageHandler.show("Conta desativada com sucesso");
          $scope.profile.active = false;
        }).catch(function (response) {
        messageHandler.show("Erro ao desativar a conta");
      });
    };

    function removeSon(index, profile) {
      var son = profile.sons[index];
      if (son.id) {
        son._destroy = 1;
      } else {
        profile.sons.splice(index, 1);
      }
    }

    function calculeAge(children) {
      var today = new Date();
      var months;

      for (var c in children) {
        var initial = children[c].birth_date.split(/\//);
        var birthDate = new Date([initial[1], initial[0], initial[2]].join('/'));

        months = today.getMonth() - birthDate.getMonth() + (12 * (today.getFullYear() - birthDate.getFullYear()));

        if (months > 18)
          return true
      }

      return false;
    }

    $scope.save = function (form) {
      $ionicLoading.show();
      if (form.$valid) {
        var data = paramToSave();

        Profile.update(data)
          .then(function (result) {
            var hasChildOverAge = calculeAge(data.profile.children_attributes);
            reloadProfile(hasChildOverAge);

          }).catch(function (response) {
          messageHandler.show(errorHandler.message(response));
        });
      } else {
        $ionicLoading.hide();
        messageHandler.show("Dados inválidos");
      }
    };

    $scope.validadeCellNumber = function () {
      var cellPhone = $scope.profile.cellPhone;
      if (cellPhone) {
        cellPhone = mask.noDigit(cellPhone);
        cellPhone = mask.bracketsTheFistTwoDigits(cellPhone);
        cellPhone = mask.dashBetweenFourAndFiveDigit(cellPhone);
      }
      $scope.profile.cellPhone = cellPhone;
    };

    function reloadProfile(hasChildOverAge) {
      var successMessage = "Seus dados foram salvos!";
      var messageTimeout = 3000;

      if (hasChildOverAge) {
        successMessage = "Dados salvos! No momento o ProBebê tem mensagens destinadas a crianças até 18 meses.";
        messageTimeout = 6000;
      }


      if ($scope.profile.sons.length != storage.get("profile").children.length) {
        Profile.reloadChild()
          .then(function (result) {
            if (result) messageHandler.show(successMessage);
            else messageHandler.show("Não foi possível recarregar os dados!");

            $timeout(function () {
              $state.go('app.messages', {childId: "null"});
            }, messageTimeout);
          }).catch(function (error) {
          messageHandler.show("Impossível comunicar com o servidor. Favor verificar sua conexão com a internet");
        });
      } else {
        messageHandler.show(successMessage);
        $timeout(function () {
          $state.go('app.messages', {childId: "null"});
        }, messageTimeout);
      }
    }

    function getId(son, index) {
      return son.id ? index.toString() : new Date().getTime();
    }

    function childrenAttributes(sons) {
      var children = {};
      sons.forEach(function (son, index) {
        children[getId(son, index)] = {
          id: son.id,
          name: son.name,
          birth_date: $filter('date')(son.bornDate, "dd/MM/yyyy"),
          gender: son.gender,
          _destroy: son._destroy
        }
      });
      return children;
    }

    function buildProfile() {
        $ionicLoading.show();
      Profile.get()
        .then(function (result) {
          var profile = result.data;
          $scope.profile.id = profile.id;
          $scope.profile.name = profile.name;
          $scope.profile.gender = profile.gender;
          $scope.profile.cellPhone = profile.cell_phone;
          $scope.profile.active = profile.active;
          sonsScope(profile);
          $ionicLoading.hide();
        }).catch(function (err) {
        $ionicLoading.hide();
        messageHandler.show("Ocorreu um erro em buscar o perfil");
      });
    }

    function sonsScope(profile) {
      if (profile.children.length > 0) {
        profile.children.forEach(function (son) {
          $scope.profile.sons.push({
            id: son.id,
            name: son.name,
            bornDate: bornDate(son.birth_date),
            gender: son.gender,
            _destroy: false
          });
        })
      } else {
        $scope.profile.sons.push({name: "", bornDate: "", gender: ""});
      }
    }

    function bornDate(birthDate) {
      var splitDate = birthDate.split("-");
      var date = new Date(splitDate[0], (splitDate[1] - 1), splitDate[2]);
      return date;
    }

    function paramToSave() {
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
