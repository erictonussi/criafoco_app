'use strict';
angular.module('starter.controllers')
  .controller('WelcomeCtrl', function ($scope, $rootScope, $state, $mdDialog, $translate, $ionicModal, $ionicPopup, localStorageService, personManager, tipoRegistroManager, criterioManager, projetoManager, Config, ga) {
    var strings = {};

    if (Config.ENV.debug) {

      $scope.person = Config.ENV.person;

      // window.localStorage.setItem('criafoco.activeProject', '1');
      // window.localStorage.setItem('criafoco.criterio', '[{\"id\":1,\"projeto\":null,\"descricao\":\"Tempo\"},{\"id\":2,\"projeto\":null,\"descricao\":\"Investimento\"},{\"id\":3,\"projeto\":null,\"descricao\":\"Alcance\"},{\"id\":4,\"projeto\":null,\"descricao\":\"Relevância\"},{\"id\":5,\"projeto\":1,\"descricao\":\"dasd\"},{\"id\":6,\"projeto\":1,\"descricao\":\"asdas\"}]');
      // window.localStorage.setItem('criafoco.nota', '[{\"id\":7,\"criterio\":1,\"registro\":57,\"valor\":3},{\"id\":8,\"criterio\":1,\"registro\":58,\"valor\":0},{\"id\":9,\"criterio\":1,\"registro\":59,\"valor\":0},{\"id\":10,\"criterio\":1,\"registro\":60,\"valor\":0},{\"id\":11,\"criterio\":1,\"registro\":61,\"valor\":8},{\"id\":12,\"criterio\":1,\"registro\":62,\"valor\":0},{\"id\":13,\"criterio\":1,\"registro\":63,\"valor\":0},{\"id\":14,\"criterio\":2,\"registro\":57,\"valor\":2},{\"id\":15,\"criterio\":2,\"registro\":58,\"valor\":0},{\"id\":16,\"criterio\":2,\"registro\":59,\"valor\":0},{\"id\":17,\"criterio\":2,\"registro\":60,\"valor\":0},{\"id\":18,\"criterio\":2,\"registro\":61,\"valor\":7},{\"id\":19,\"criterio\":2,\"registro\":62,\"valor\":0},{\"id\":20,\"criterio\":2,\"registro\":63,\"valor\":0},{\"id\":21,\"criterio\":3,\"registro\":57,\"valor\":5},{\"id\":22,\"criterio\":3,\"registro\":58,\"valor\":0},{\"id\":23,\"criterio\":3,\"registro\":59,\"valor\":0},{\"id\":24,\"criterio\":3,\"registro\":60,\"valor\":0},{\"id\":25,\"criterio\":3,\"registro\":61,\"valor\":0},{\"id\":26,\"criterio\":3,\"registro\":62,\"valor\":0},{\"id\":27,\"criterio\":3,\"registro\":63,\"valor\":0},{\"id\":28,\"criterio\":4,\"registro\":57,\"valor\":0},{\"id\":29,\"criterio\":4,\"registro\":58,\"valor\":0},{\"id\":30,\"criterio\":4,\"registro\":59,\"valor\":0},{\"id\":31,\"criterio\":4,\"registro\":60,\"valor\":0},{\"id\":32,\"criterio\":4,\"registro\":61,\"valor\":6},{\"id\":33,\"criterio\":4,\"registro\":62,\"valor\":0},{\"id\":34,\"criterio\":4,\"registro\":63,\"valor\":0},{\"id\":35,\"criterio\":5,\"registro\":57,\"valor\":0},{\"id\":36,\"criterio\":5,\"registro\":58,\"valor\":0},{\"id\":37,\"criterio\":5,\"registro\":59,\"valor\":0},{\"id\":38,\"criterio\":5,\"registro\":60,\"valor\":0},{\"id\":39,\"criterio\":5,\"registro\":61,\"valor\":0},{\"id\":40,\"criterio\":5,\"registro\":62,\"valor\":0},{\"id\":41,\"criterio\":5,\"registro\":63,\"valor\":0},{\"id\":42,\"criterio\":6,\"registro\":57,\"valor\":0},{\"id\":43,\"criterio\":6,\"registro\":58,\"valor\":0},{\"id\":44,\"criterio\":6,\"registro\":59,\"valor\":0},{\"id\":45,\"criterio\":6,\"registro\":60,\"valor\":0},{\"id\":46,\"criterio\":6,\"registro\":61,\"valor\":0},{\"id\":47,\"criterio\":6,\"registro\":62,\"valor\":0},{\"id\":48,\"criterio\":6,\"registro\":63,\"valor\":0}]');
      // window.localStorage.setItem('criafoco.person', '{\"id\":744,\"email\":\"criafoco@tonussi.com\",\"tipo\":\"regular\",\"password\":\"123123\"}');
      // window.localStorage.setItem('criafoco.projeto', '[{\"id\":1,\"usuario\":744,\"pai\":null,\"foco\":\"tert\",\"fase\":\"script\",\"etapa\":\"*\",\"inicio\":\"2017-07-18T01:23:48.137Z\",\"fim\":null},{\"id\":2,\"usuario\":744,\"pai\":null,\"foco\":null,\"fase\":\"worry\",\"etapa\":\"*\",\"inicio\":\"2017-07-18T17:09:54.869Z\",\"fim\":null}]');
      // window.localStorage.setItem('criafoco.registro', '[{\"id\":1,\"projeto\":1,\"tipo\":1,\"descricao\":\"1\",\"avaliacao\":5,\"ob_op\":null,\"descarte\":true},{\"id\":2,\"projeto\":1,\"tipo\":1,\"descricao\":\"2\",\"avaliacao\":7,\"ob_op\":null,\"descarte\":false},{\"id\":3,\"projeto\":1,\"tipo\":1,\"descricao\":\"3\",\"avaliacao\":6,\"ob_op\":null,\"descarte\":true},{\"id\":4,\"projeto\":1,\"tipo\":1,\"descricao\":\"4\",\"avaliacao\":6,\"ob_op\":null,\"descarte\":true},{\"id\":5,\"projeto\":1,\"tipo\":1,\"descricao\":\"5\",\"avaliacao\":8,\"ob_op\":null,\"descarte\":false},{\"id\":6,\"projeto\":1,\"tipo\":1,\"descricao\":\"6\",\"avaliacao\":8,\"ob_op\":null,\"descarte\":false},{\"id\":7,\"projeto\":1,\"tipo\":1,\"descricao\":\"7\",\"avaliacao\":3,\"ob_op\":null,\"descarte\":true},{\"id\":8,\"projeto\":1,\"tipo\":1,\"descricao\":\"8\",\"avaliacao\":10,\"ob_op\":null,\"descarte\":false},{\"id\":9,\"projeto\":1,\"tipo\":1,\"descricao\":\"9\",\"avaliacao\":2,\"ob_op\":null,\"descarte\":true},{\"id\":10,\"projeto\":1,\"tipo\":1,\"descricao\":\"0\",\"avaliacao\":4,\"ob_op\":null,\"descarte\":true},{\"id\":11,\"projeto\":1,\"tipo\":1,\"descricao\":\"10\",\"avaliacao\":5,\"ob_op\":null,\"descarte\":true},{\"id\":12,\"projeto\":1,\"tipo\":1,\"descricao\":\"11\",\"avaliacao\":8,\"ob_op\":null,\"descarte\":false},{\"id\":13,\"projeto\":1,\"tipo\":1,\"descricao\":\"12\",\"avaliacao\":8,\"ob_op\":null,\"descarte\":false},{\"id\":14,\"projeto\":1,\"tipo\":1,\"descricao\":\"13\",\"avaliacao\":9,\"ob_op\":null,\"descarte\":false},{\"id\":15,\"projeto\":1,\"tipo\":2,\"descricao\":\"1\",\"avaliacao\":8,\"ob_op\":null,\"descarte\":false},{\"id\":16,\"projeto\":1,\"tipo\":2,\"descricao\":\"2\",\"avaliacao\":1,\"ob_op\":null,\"descarte\":true},{\"id\":17,\"projeto\":1,\"tipo\":2,\"descricao\":\"3\",\"avaliacao\":8,\"ob_op\":null,\"descarte\":false},{\"id\":18,\"projeto\":1,\"tipo\":2,\"descricao\":\"4\",\"avaliacao\":9,\"ob_op\":null,\"descarte\":false},{\"id\":19,\"projeto\":1,\"tipo\":2,\"descricao\":\"5\",\"avaliacao\":5,\"ob_op\":null,\"descarte\":true},{\"id\":20,\"projeto\":1,\"tipo\":2,\"descricao\":\"6\",\"avaliacao\":6,\"ob_op\":null,\"descarte\":true},{\"id\":21,\"projeto\":1,\"tipo\":2,\"descricao\":\"7\",\"avaliacao\":7,\"ob_op\":null,\"descarte\":false},{\"id\":22,\"projeto\":1,\"tipo\":2,\"descricao\":\"8\",\"avaliacao\":2,\"ob_op\":null,\"descarte\":true},{\"id\":23,\"projeto\":1,\"tipo\":2,\"descricao\":\"9\",\"avaliacao\":8,\"ob_op\":null,\"descarte\":false},{\"id\":24,\"projeto\":1,\"tipo\":2,\"descricao\":\"0\",\"avaliacao\":9,\"ob_op\":null,\"descarte\":false},{\"id\":25,\"projeto\":1,\"tipo\":2,\"descricao\":\"10\",\"avaliacao\":10,\"ob_op\":null,\"descarte\":false},{\"id\":26,\"projeto\":1,\"tipo\":2,\"descricao\":\"11\",\"avaliacao\":0,\"ob_op\":null,\"descarte\":true},{\"id\":27,\"projeto\":1,\"tipo\":2,\"descricao\":\"12\",\"avaliacao\":4,\"ob_op\":null,\"descarte\":true},{\"id\":28,\"projeto\":1,\"tipo\":2,\"descricao\":\"13\",\"avaliacao\":0,\"ob_op\":null,\"descarte\":true},{\"id\":29,\"projeto\":1,\"tipo\":3,\"descricao\":\"1\",\"avaliacao\":9,\"ob_op\":1,\"descarte\":false},{\"id\":30,\"projeto\":1,\"tipo\":3,\"descricao\":\"2\",\"avaliacao\":0,\"ob_op\":1,\"descarte\":false},{\"id\":31,\"projeto\":1,\"tipo\":3,\"descricao\":\"3\",\"avaliacao\":7,\"ob_op\":1,\"descarte\":false},{\"id\":32,\"projeto\":1,\"tipo\":3,\"descricao\":\"4\",\"avaliacao\":7,\"ob_op\":1,\"descarte\":false},{\"id\":33,\"projeto\":1,\"tipo\":3,\"descricao\":\"5\",\"avaliacao\":7,\"ob_op\":1,\"descarte\":false},{\"id\":34,\"projeto\":1,\"tipo\":3,\"descricao\":\"6\",\"avaliacao\":5,\"ob_op\":1,\"descarte\":false},{\"id\":35,\"projeto\":1,\"tipo\":3,\"descricao\":\"7\",\"avaliacao\":9,\"ob_op\":1,\"descarte\":false},{\"id\":36,\"projeto\":1,\"tipo\":3,\"descricao\":\"8\",\"avaliacao\":0,\"ob_op\":2,\"descarte\":false},{\"id\":37,\"projeto\":1,\"tipo\":3,\"descricao\":\"9\",\"avaliacao\":0,\"ob_op\":2,\"descarte\":false},{\"id\":38,\"projeto\":1,\"tipo\":3,\"descricao\":\"0\",\"avaliacao\":7,\"ob_op\":2,\"descarte\":false},{\"id\":39,\"projeto\":1,\"tipo\":3,\"descricao\":\"10\",\"avaliacao\":9,\"ob_op\":2,\"descarte\":false},{\"id\":40,\"projeto\":1,\"tipo\":3,\"descricao\":\"11\",\"avaliacao\":8,\"ob_op\":2,\"descarte\":false},{\"id\":41,\"projeto\":1,\"tipo\":3,\"descricao\":\"12\",\"avaliacao\":7,\"ob_op\":2,\"descarte\":false},{\"id\":42,\"projeto\":1,\"tipo\":3,\"descricao\":\"13\",\"avaliacao\":8,\"ob_op\":2,\"descarte\":false},{\"id\":43,\"projeto\":1,\"tipo\":4,\"descricao\":\"`1\",\"avaliacao\":5,\"ob_op\":0,\"descarte\":true},{\"id\":44,\"projeto\":1,\"tipo\":4,\"descricao\":\"2\",\"avaliacao\":7,\"ob_op\":0,\"descarte\":true},{\"id\":45,\"projeto\":1,\"tipo\":4,\"descricao\":\"3\",\"avaliacao\":8,\"ob_op\":0,\"descarte\":false},{\"id\":46,\"projeto\":1,\"tipo\":4,\"descricao\":\"4\",\"avaliacao\":9,\"ob_op\":0,\"descarte\":false},{\"id\":47,\"projeto\":1,\"tipo\":4,\"descricao\":\"5\",\"avaliacao\":10,\"ob_op\":0,\"descarte\":false},{\"id\":48,\"projeto\":1,\"tipo\":4,\"descricao\":\"6\",\"avaliacao\":0,\"ob_op\":0,\"descarte\":true},{\"id\":49,\"projeto\":1,\"tipo\":4,\"descricao\":\"7\",\"avaliacao\":0,\"ob_op\":0,\"descarte\":true},{\"id\":50,\"projeto\":1,\"tipo\":4,\"descricao\":\"8\",\"avaliacao\":0,\"ob_op\":0,\"descarte\":true},{\"id\":51,\"projeto\":1,\"tipo\":4,\"descricao\":\"9\",\"avaliacao\":2,\"ob_op\":0,\"descarte\":true},{\"id\":52,\"projeto\":1,\"tipo\":4,\"descricao\":\"10\",\"avaliacao\":8,\"ob_op\":0,\"descarte\":false},{\"id\":53,\"projeto\":1,\"tipo\":4,\"descricao\":\"11\",\"avaliacao\":6,\"ob_op\":0,\"descarte\":true},{\"id\":54,\"projeto\":1,\"tipo\":4,\"descricao\":\"12\",\"avaliacao\":8,\"ob_op\":0,\"descarte\":false},{\"id\":55,\"projeto\":1,\"tipo\":4,\"descricao\":\"13\",\"avaliacao\":8,\"ob_op\":0,\"descarte\":false},{\"id\":56,\"projeto\":1,\"tipo\":4,\"descricao\":\"14\",\"avaliacao\":9,\"ob_op\":0,\"descarte\":false},{\"id\":57,\"projeto\":1,\"tipo\":5,\"descricao\":\"3\",\"avaliacao\":-1,\"ob_op\":null,\"descarte\":false},{\"id\":58,\"projeto\":1,\"tipo\":5,\"descricao\":\"4\",\"avaliacao\":-1,\"ob_op\":null,\"descarte\":false},{\"id\":59,\"projeto\":1,\"tipo\":5,\"descricao\":\"5\",\"avaliacao\":-1,\"ob_op\":null,\"descarte\":false},{\"id\":60,\"projeto\":1,\"tipo\":5,\"descricao\":\"10\",\"avaliacao\":-1,\"ob_op\":null,\"descarte\":false},{\"id\":61,\"projeto\":1,\"tipo\":5,\"descricao\":\"12\",\"avaliacao\":-1,\"ob_op\":null,\"descarte\":false},{\"id\":62,\"projeto\":1,\"tipo\":5,\"descricao\":\"13\",\"avaliacao\":-1,\"ob_op\":null,\"descarte\":false},{\"id\":63,\"projeto\":1,\"tipo\":5,\"descricao\":\"14\",\"avaliacao\":-1,\"ob_op\":null,\"descarte\":false}]');
      // window.localStorage.setItem('criafoco.tipo_registro', '[{\"id\":1,\"flag\":\"worry\"},{\"id\":2,\"flag\":\"fact\"},{\"id\":3,\"flag\":\"note\"},{\"id\":4,\"flag\":\"creation\"},{\"id\":5,\"flag\":\"usage\"},{\"id\":6,\"flag\":\"script\"}]');
    } else {
      $scope.person = {};
    }

    $translate(['invalid_username_password', 'alert', 'success_register']).then(function (translations) {
      strings = translations;
    });

    ga.trackView('Welcome');

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
