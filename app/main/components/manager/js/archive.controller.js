'use strict';
angular.module('starter.controllers')
  .controller('ArchiveCtrl', function ($scope, $rootScope, $state, $ionicPopup, $translate, localStorageService, personManager, projetoManager) {
    var strings = {};
    var someOpen = false;

    $translate(['alert', 'yes', 'no', 'has_open_project', 'confirm_remove_project']).then(function (translations) {
      strings = translations;

      getAll();
    });

    $scope.$on('$ionicView.enter', function (scopes, states) {
      if (states.fromCache && states.stateName === 'archive') {
        getAll();
      }
    });

    function getAll () {
      someOpen = false;

      projetoManager.getAll().then(function (response) {
        var records = [];

        response.forEach(function (element) {
          if (element.fim !== undefined) {
            element.fim = new Date(element.fim);
          } else {
            someOpen = true;
          }

          records.push(element);
        });

        records.sort(function (a, b) {
          return a.id + b.id;
        });

        $scope.records = records;

        if (records.length === 0) {
          $state.go('start');
        }
      });
    }

    $scope.newProject = function () {
      if (someOpen) {
        $ionicPopup.alert({
          title: strings.alert,
          template: strings.has_open_project
        });
      } else {
        createProject();
      }
    };

    function createProject () {
      $state.go('start');
    }

    $scope.openProject = function (project) {
      localStorageService.set('activeProject', project.id);

      projetoManager.getActive().then(function (response) {
        $rootScope.projeto = response;
        $state.go('tab.facts');
      });
    };

    $scope.removeProject = function (project, event) {
      var removePopup = $ionicPopup.confirm({
        title: strings.alert,
        template: strings.confirm_remove_project,
        buttons: [
          {text: strings.no, type: 'button-default', onTap: function (/*e*/) { return false; }},
          {text: strings.yes, type: 'button-positive', onTap: function (/*e*/) { return true; }}
        ]
      });

      removePopup.then(function (res) {
        if (res) {
          projetoManager.remove(project).then(function (/*response*/) {
            getAll();
          });
        }
      });

      event.stopPropagation();
    };
  });
