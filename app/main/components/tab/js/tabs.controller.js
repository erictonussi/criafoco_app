'use strict';
angular.module('starter.controllers')
  .controller('TabsCtrl', function ($scope, $rootScope, $state, projetoManager, localStorageService) {
    if (!localStorageService.get('activeProject')) {
      $state.go('start');
    } else {
      projetoManager.getActive().then(function (response) {
        if (!response) {
          $state.go('start');
        } else {
          $rootScope.projeto = response;
        }
      });
    }
  });
