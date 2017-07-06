'use strict';
angular.module('starter.controllers')
  .controller('WelcomeCtrl', function ($scope, $rootScope, $state, $mdDialog, $translate, $ionicModal, $ionicPopup, localStorageService, personManager, tipoRegistroManager, criterioManager, projetoManager) {
    var strings = {};

    $translate(['invalid_username_password', 'alert', 'success_register']).then(function (translations) {
      strings = translations;
    });

    var checkActiveProject = function () {
      projetoManager.getActive().then(function (response) {
        if (response) {
          $scope.loading = false;

          $scope.isSignin = false;
          $scope.isSignup = false;
          $scope.isConnect = true;

          $rootScope.projeto = response;

          var fase = $rootScope.projeto.fase;

          if (fase === 'note') {
            $state.go('tab.notes');
          } else if (fase === 'creation') {
            $state.go('tab.creation');
          } else if (fase === 'usage') {
            $state.go('tab.usage');
          } else if (fase === 'script') {
            $state.go('tab.script');
          } else {
            $state.go('tab.facts');
          }

          $rootScope.disableTabNotes = true;
          $rootScope.disableTabCreation = true;
          $rootScope.disableTabUsage = true;
          $rootScope.disableTabScript = true;

          if (fase === 'note') {
            $rootScope.disableTabNotes = false;
          } else if (fase === 'creation') {
            $rootScope.disableTabNotes = false;
            $rootScope.disableTabCreation = false;
          } else if (fase === 'usage') {
            $rootScope.disableTabNotes = false;
            $rootScope.disableTabCreation = false;
            $rootScope.disableTabUsage = false;
          } else if (fase === 'script') {
            $rootScope.disableTabNotes = false;
            $rootScope.disableTabCreation = false;
            $rootScope.disableTabUsage = false;
            $rootScope.disableTabScript = false;
          }
        } else {
          $state.go('start');
        }
      });
    };

    if (personManager.get()) {
      checkActiveProject();
      return;
    }

    $scope.isSignin = false;
    $scope.isSignup = false;
    $scope.isConnect = true;
    $scope.loading = false;

    $scope.person = {};

    $scope.facebookLogin = function () {
      $scope.loading = true;

      personManager.loginFacebook().then(function (data) {
        personManager.register('facebook', data).then(function (/*person*/) {
          checkActiveProject();
        }, function (error) {
          $scope.loading = false;

          $ionicPopup.alert({
            title: strings.alert,
            template: error
          });
        });
      }, function (error) {
        $scope.loading = false;

        if (error.status === 'not_authorized') {
          $ionicPopup.alert({
            title: strings.alert,
            template: 'Não autorizado.'
          });
        } else {
          $ionicPopup.alert({
            title: strings.alert,
            template: 'Ocorreu um erro ao tentar conectar com o Facebook.'
          });
        }
      });
    };

    $scope.googleLogin = function () {
    };

    $scope.showRegisterForm = function () {
      $scope.isSignup = true;
      $scope.isConnect = false;
    };

    $scope.signUp = function (form) {
      if (!form.$valid) {
        $ionicPopup.alert({
          title: strings.alert,
          template: strings.invalid_username_password
        });
      } else {
        $scope.loading = true;

        var params = {email: $scope.person.username, password: $scope.person.password};

        personManager.register('regular', params).then(function (/*data*/) {
          checkActiveProject();
        }, function (error) {
          $scope.loading = false;

          $ionicPopup.alert({
            title: strings.alert,
            template: error
          });
        });
      }
    };

    $scope.showLoginForm = function () {
      $scope.isSignin = true;
      $scope.isConnect = false;
    };

    $scope.signIn = function (form) {
      if (!form.$valid) {
        $ionicPopup.alert({
          title: strings.alert,
          template: strings.invalid_username_password
        });
      } else {
        $scope.loading = true;

        personManager.authenticate($scope.person.username, $scope.person.password, null).then(function (/*data*/) {
          checkActiveProject();
        }, function (/*error*/) {
          $scope.loading = false;

          $ionicPopup.alert({
            title: strings.alert,
            template: 'Usuário ou senha inválidos.'
          });
        });
      }
    };

    $scope.cancel = function () {
      $scope.isSignin = false;
      $scope.isSignup = false;
      $scope.isConnect = true;
    };

    if (!localStorageService.get('tipo_registro')) {
      tipoRegistroManager.install();
      criterioManager.install();
    }

    $ionicModal.fromTemplateUrl('main/components/privacy/html/privacy.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.privacyModal = modal;
    });

    $scope.privacy = function () {
      $scope.privacyModal.show();
    };

    $ionicModal.fromTemplateUrl('main/components/terms/html/terms.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.termsModal = modal;
    });

    $scope.terms = function () {
      $scope.termsModal.show();
    };
  });
