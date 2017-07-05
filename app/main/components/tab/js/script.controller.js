'use strict';
angular.module('starter.controllers')
.controller('TabScriptCtrl', function ($scope, $rootScope, $state, $ionicPopup, $translate, localStorageService, tipoRegistroManager, registroManager, projetoManager) {
  if (localStorageService.get('activeProject') === undefined) {
    return;
  }

  var strings = {};

  $translate(['focus', 'finish', 'script', 'info_script', 'opportunities', 'obstacles', 'ideas', 'actions', 'tutorial']).then(function (translations) {
    strings = translations;

    if ($rootScope.projeto.etapa === 's') {
      var popup = $ionicPopup.alert({
        title: strings.script,
        template: strings.info_script,
        buttons: [
          {text: strings.finish, type: 'button-positive', onTap: function (/*e*/) { return true; }}
        ]
      });

      popup.then(function (res) {
        if (res) {
          $rootScope.projeto.etapa = '*';

          projetoManager.save($rootScope.projeto);
        }
      });
    }
  });

  $scope.openFoco = function (event) {
    $ionicPopup.alert({
      title: strings.focus,
      template: $rootScope.projeto.foco
    });

    event.preventDefault();
  };

  $scope.openOportunidade = function (event) {
    tipoRegistroManager.getByFlag('note').then(function (response) {
      var noteType = response;

      if (noteType !== null) {
        registroManager.getAll($rootScope.projeto, noteType, false).then(function (response) {
          $scope.oportunidades = response.filter(function (x) {
            return x.ob_op === 1;
          });

          $ionicPopup.alert({
            title: strings.opportunities,
            template: '<ion-list><ion-item ng-repeat="item in oportunidades">{{item.descricao}}<span class="badge badge-balanced">{{item.avaliacao}}</span></ion-item></ion-list>',
            scope: $scope
          });
        });
      }
    });

    event.preventDefault();
  };

  $scope.openObstaculo = function (event) {
    tipoRegistroManager.getByFlag('note').then(function (response) {
      var noteType = response;

      if (noteType !== null) {
        registroManager.getAll($rootScope.projeto, noteType, false).then(function (response) {
          $scope.obstaculos = response.filter(function (x) {
            return x.ob_op === 2;
          });

          $ionicPopup.alert({
            title: strings.obstacles,
            template: '<ion-list><ion-item ng-repeat="item in obstaculos">{{item.descricao}}<span class="badge badge-balanced">{{item.avaliacao}}</span></ion-item></ion-list>',
            scope: $scope
          });
        });
      }
    });

    event.preventDefault();
  };

  $scope.openIdeia = function (event) {
    tipoRegistroManager.getByFlag('creation').then(function (response) {
      var creationType = response;

      if (creationType !== null) {
        registroManager.getAll($rootScope.projeto, creationType, false).then(function (response) {
          $scope.ideas = response;

          $ionicPopup.alert({
            title: strings.ideas,
            template: '<ion-list><ion-item ng-repeat="item in ideas">{{item.descricao}}<span class="badge badge-balanced">{{item.avaliacao}}</span></ion-item></ion-list>',
            scope: $scope
          });
        });
      }
    });

    event.preventDefault();
  };

  $scope.openAcoes = function (event) {
    tipoRegistroManager.getByFlag('usage').then(function (response) {
      var actionType = response;

      if (actionType !== null) {
        registroManager.getAllWithCriterio($rootScope.projeto, actionType).then(function (response) {
          $scope.actions = response;

          $ionicPopup.alert({
            title: strings.actions,
            template: '<ion-list><ion-item ng-repeat="item in actions">{{item.descricao}}<span class="badge badge-balanced">{{item.soma}}</span></ion-item></ion-list>',
            scope: $scope
          });
        });
      }
    });

    event.preventDefault();
  };

  $scope.openTutorial = function () {
    var message = 'O ACRÓSTICO SCRIPT servirá como um roteiro para ajudar você a identificar todos os pontos que devem ser considerados para o alcance do seu FOCO. Se ainda estiver inseguro com algum ponto do seu SCRIPT, se perceber que faltam informações, faça uma nova rodada do CRIAFOCO direcionada para este ponto. Coloque SUPORTE, por exemplo, como seu FOCO e então rode todo o processo normalmente. Faça da mesma maneira com os demais. Rodar o método novamente para cada item do SCRIPT é uma ótima forma de colher todos os elementos necessários para a elaboração do seu planejamento estratégico. Você o coloca na linguagem mais favorável: CANVAS, MAPA MENTAL, DIAGRAMA, etc.';

    $ionicPopup.alert({
      title: strings.tutorial,
      template: '<p class="text-center">' + message + '</p>'
    });
  };
});
