'use strict';
angular.module('starter.controllers')
  .controller('TabsCtrl', function ($scope, $rootScope, $state, projetoManager, localStorageService) {
    if (localStorageService.get('activeProject') === undefined) {
      $state.go('start');
    } else {
      projetoManager.getActive().then(function (response) {
        if (response === null) {
          $state.go('start');
        } else {
          $rootScope.projeto = response;
        }
      });
    }
  });
