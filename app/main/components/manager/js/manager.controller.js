'use strict';
angular.module('starter.controllers')
  .controller('ManagerCtrl', function ($scope, $rootScope, $state, $ionicPopup, $translate, personManager) {
    var strings = {};

    $translate(['logout', 'confirm_logout', 'yes', 'no']).then(function (translations) {
      strings = translations;
    });

    $scope.loading = false;

    var person = personManager.get();

    if (person.foto === undefined) {
      $scope.photo = 'main/assets/images/default-user.png';
    } else {
      $scope.photo = person.foto;
    }

    $scope.name = person.email;

    if (person.nome !== undefined) {
      $scope.name = person.nome;
    }

    $scope.logout = function () {
      var logoutPopup = $ionicPopup.confirm({
        title: strings.logout,
        template: strings.confirm_logout,
        buttons: [
          {text: strings.no, type: 'button-default', onTap: function (/*e*/) { return false; }},
          {text: strings.yes, type: 'button-positive', onTap: function (/*e*/) { return true; }}
        ]
      });

      logoutPopup.then(function (res) {
        if (res) {
          removePerson();

          /*if (person.tipo === 'regular') {
                      removePerson();
                  } else if (person.tipo === 'facebook') {
                      $scope.loading = true;

                      personManager.logoutFacebook().then(function(response) {
                          removePerson();
                      }, function(error) {
                          removePerson();
                      });
                  }*/
        }
      });
    };

    function removePerson () {
      $scope.loading = false;

      personManager.logout();

      $rootScope.projeto = undefined;

      $state.go('welcome');
    }
  });
