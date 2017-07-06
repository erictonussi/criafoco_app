'use strict';
angular.module('starter.controllers')
  .controller('CriteriaCtrl', function ($scope, $rootScope, $ionicPopup, $translate, criterioManager, Criterio) {
    var strings = {};

    $translate(['alert', 'empty_field_criteria', 'error_remove_criteria', 'select_criterias']).then(function (translations) {
      strings = translations;
    });

    $scope.criterio = {};
    $scope.criterios = [];

    criterioManager.getAll($rootScope.projeto).then(function (response) {
      $scope.criterios = response;
    });

    $scope.adicionar = function () {
      if (!$scope.criterio.descricao || $scope.criterio.descricao.length === 0) {
        $ionicPopup.alert({
          title: strings.alert,
          template: strings.empty_field_criteria
        });
      } else {
        criterioManager.add($rootScope.projeto, $scope.criterio.descricao).then(function (id) {
          var novo = new Criterio(id, $rootScope.projeto.id, $scope.criterio.descricao);

          $scope.criterios.push(novo);

          $scope.criterio = {};
        });
      }
    };

    $scope.remover = function (item, event) {
      criterioManager.remove(item).then(function (/*response*/) {
        var index = $scope.criterios.findIndex(function (x) {
          return x.id === item.id;
        } );

        if (index > -1) {
          $scope.criterios.splice(index, 1);
        }
      }, function (/*error*/) {
        $ionicPopup.alert({
          title: strings.alert,
          template: strings.error_remove_criteria
        });
      });

      event.stopPropagation();
    };

    $scope.pronto = function () {
      var selecionados = [];

      $scope.criterios.forEach(function (item) {
        if (item.selecionado) {
          selecionados.push(item);
        }
      });

      if (selecionados.length < 3 || selecionados.length > 7) {
        $ionicPopup.alert({
          title: strings.alert,
          template: strings.select_criterias
        });
      } else {
        criterioManager.joinCriteriosRegistros(selecionados, $scope.records).then(function (/*response*/) {
          $scope.criteriaModal.hide();
        });
      }
    };
  });
