'use strict';
angular.module('starter.controllers')
  .controller('TabUsageCtrl', function ($scope, $rootScope, $state, $timeout, $ionicModal, $ionicPopup, $translate, tipoRegistroManager, registroManager, criterioManager, notaManager, projetoManager, localStorageService) {
    if (!localStorageService.get('activeProject')) {
      return;
    }

    var strings = {};

    $translate(['usage', 'alert', 'error_list', 'edit_focus', 'my_focus', 'need_evaluate_idea', 'cancel', 'empty_textarea', 'actions', 'tutorial', 'continue', 'conquest_e', 'conquest_d', 'congrats', 'info_congrats', 'script', 'finish']).then(function (translations) {
      strings = translations;

      $scope.title = strings.usage;
    });

    $scope.records = [];
    $scope.current = {};
    $scope.step = 'usage';
    $scope.foco = $rootScope.projeto.foco;
    $scope.finished = !!$rootScope.projeto.fim;

    $scope.writer = {
      maxLength: 50,
      continue: false,
      editing: true,
      isFoco: true
    };

    $scope.$on('modal.hidden', function (event, modal) {
      if (modal.id === 1) {
        $scope.current = {};

        $timeout(function () {
          $scope.writerModal.remove();
        }, 1000);
      } else {
        $timeout(function () {
          $scope.criteriaModal.remove();
        }, 1000);
      }
    });

    $scope.$on('modal.shown', function (event, modal) {
      if (modal.id === 1) {
        document.getElementById('writerText').focus();
      }
    });

    var searchType, type = null;

    var getTipoRegistro = function () {
      searchType = 'usage';

      tipoRegistroManager.getByFlag(searchType).then(function (response) {
        type = response;

        if (type) {
          refreshList();
        }
      });
    };

    getTipoRegistro();

    function refreshList () {
      registroManager.getAllWithCriterio($rootScope.projeto, type).then(function (response) {
        $scope.records = response;

        // console.log(response);

        if (response[0].quantidade === 0) {
          $ionicModal.fromTemplateUrl('main/components/criteria/html/criteria.html', {
            id: 2,
            scope: $scope,
            animation: 'slide-in-up',
            controller: 'CriteriaCtrl'
          }).then(function (modal) {
            $scope.criteriaModal = modal;
            $scope.criteriaModal.show();
          });
        }
      }, function (/*error*/) {
        $ionicPopup.alert({
          title: strings.alert,
          template: strings.error_list
        });
      });
    }

    $scope.focoModal = function () {
      if ($scope.finished) {
        return;
      }

      $scope.current = {};

      $scope.writer.title = strings.edit_focus;
      $scope.writer.placeholder = strings.my_focus + '...';

      $scope.current.descricao = $rootScope.projeto.foco;

      $ionicModal.fromTemplateUrl('writer.html', {
        id: 1,
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.writerModal = modal;
        $scope.writerModal.show();
      });
    };

    $scope.scoreItem = function (record, event) {
      if ($rootScope.projeto.fase !== 'usage') {
        return;
      }

      notaManager.getAll(record).then(function (response) {
        var original = JSON.stringify(response);

        $scope.notas = response;

        var relevancePopup = $ionicPopup.alert({
          title: record.descricao,
          cssClass: 'custom-content-alert',
          template: '<div ng-repeat="nota in notas track by nota.id"><p>{{nota.criterio.descricao}}</p><div class="range range-positive"><input type="range" name="volume" min="0" max="10" ng-model="nota.valor"><strong>{{nota.valor > -1 ? nota.valor : "0"}}</strong></div></div>',
          scope: $scope,
          buttons: [
            { text: strings.cancel },
            {
              text: 'OK',
              type: 'button-positive',
              onTap: function (/*e*/) {
                $scope.notas.forEach(function (element, index) {
                  if (element.valor === -1) {
                    $scope.notas[index].valor = 0;
                  }
                });

                return JSON.stringify($scope.notas) !== original;
              }
            }
          ]
        });

        relevancePopup.then(function (res) {
          if (res) {
            $scope.notas.forEach(function (element) {
              notaManager.save(element);
            });

            refreshList();
          }
        });
      });

      event.stopPropagation();
    };

    $scope.save = function (record) {
      $scope.current = record;

      if (!$scope.current.descricao || ($scope.current.descricao.length === 0 || $scope.current.descricao.length > $scope.writer.maxLength)) {
        $ionicPopup.alert({
          title: strings.alert,
          template: strings.empty_textarea
        });
      } else {
        if ($scope.writer.editing && $scope.writer.isFoco) {
          $rootScope.projeto.foco = record.descricao;

          $scope.foco = record.descricao;

          projetoManager.save($rootScope.projeto);

          $scope.writerModal.hide();
        }
      }
    };

    $scope.process = function () {
      if ($rootScope.projeto.fase !== 'usage') {
        $state.go('tab.script');
        return;
      }

      var canContinue = true;

      $scope.records.forEach(function (element) {
        if (canContinue && !element.vote) {
          canContinue = false;
        }
      });

      if (canContinue) {
        var confirmPopup = $ionicPopup.confirm({
          title: strings.actions,
          template: '<ion-list><ion-item ng-repeat="item in records">{{item.descricao}}<span class="badge badge-balanced">{{item.soma}}</span></ion-item></ion-list>',
          scope: $scope,
          buttons: [
            {text: strings.cancel, type: 'button-default', onTap: function (/*e*/) { return false; }},
            {text: strings.continue, type: 'button-positive', onTap: function (/*e*/) { return true; }}
          ]
        });

        confirmPopup.then(function (res) {
          if (res) {
            var popupE = $ionicPopup.alert({
              cssClass: 'alert-conquest',
              template: strings.conquest_e + '<img src="main/assets/images/conquest.png" class="conquest">',
              buttons: [
                {text: 'OK', type: 'button-positive', onTap: function (/*e*/) { return true; }}
              ]
            });

            popupE.then(function (res) {
              if (res) {
                var popupD = $ionicPopup.alert({
                  cssClass: 'alert-conquest',
                  template: strings.conquest_d + '<img src="main/assets/images/conquest2.png" class="conquest">',
                  buttons: [
                    {text: 'OK', type: 'button-positive', onTap: function (/*e*/) { return true; }}
                  ]
                });

                popupD.then(function (res) {
                  if (res) {
                  //finishAll();
                    finishPopup();
                  }
                });
              }
            });
          }
        });
      } else {
        $ionicPopup.alert({
          title: strings.alert,
          template: strings.need_evaluate_idea
        });
      }
    };

    // var finishAll = function () {
    //   $rootScope.projeto.fim = new Date();

    //   projetoManager.finish($rootScope.projeto).then(function (response) {
    //     $rootScope.projeto.fase = 'script';

    //     projetoManager.save($rootScope.projeto);

    //     $state.go('tab.script');
    //   });
    // };

    function finishPopup () {
      $ionicPopup.confirm({
        title: strings.congrats,
        template: strings.info_congrats,
        buttons: [
          {text: strings.script, type: 'button-positive', onTap: function (/*e*/) { return true; }},
          {text: strings.finish, type: 'button-positive', onTap: function (/*e*/) { return false; }}
        ]
      })
        .then(function (res) {
          if (res) {
            $rootScope.projeto.fim = new Date();

            projetoManager.finish($rootScope.projeto).then(function (/*response*/) {
              $rootScope.projeto.fase = 'script';
              $rootScope.projeto.etapa = 's';

              projetoManager.save($rootScope.projeto);

              $state.go('tab.script');
            });
          } else {
            $rootScope.projeto.fim = new Date();

            projetoManager.finish($rootScope.projeto).then(function (/*response*/) {
              $rootScope.projeto.fase = 'script';

              projetoManager.save($rootScope.projeto);

              $state.go('tab.script');
            });
          }
        });
    }

    $scope.openTutorial = function () {
      var message = 'Aqui você deve avaliar as suas ideias, classificando-as, uma a uma, quanto à sua relevância em relação aos critérios estabelecidos. Selecione a primeira ideia e faça a avaliação, submetendo-a a todos os critérios definidos. Depois faça isso com a segunda ideia e assim sucessivamente.';

      $ionicPopup.alert({
        title: strings.tutorial,
        template: '<p class="text-center">' + message + '</p>'
      });
    };
  });
