'use strict';
angular.module('starter.controllers')
  .controller('TabCreationCtrl', function ($scope, $rootScope, $state, $timeout, $interval, $ionicModal, $ionicPopup, $ionicPopover, $translate, localStorageService, tipoRegistroManager, registroManager, projetoManager) {
    if (localStorageService.get('activeProject') === undefined) {
      return;
    }

    var strings = {};

    $translate(['creation', 'alert', 'error_list', 'add_idea', 'placeholder_idea', 'edit_idea', 'edit_focus', 'my_focus', 'evaluate', 'evaluate_more', 'error_save_data', 'confirm_remove', 'yes', 'no', 'error_remove', 'add_limit_idea', 'need_evaluate_idea', 'confirm_reset', 'cancel', 'empty_textarea', 'obstacles', 'tutorial']).then(function (translations) {
      strings = translations;

      $scope.title = strings.creation;
    });

    $scope.records = [];
    $scope.current = {};
    $scope.step = 'creation';
    $scope.stimulusType = 'cri';
    $scope.canActiveStimulus = true;
    $scope.foco = $rootScope.projeto.foco;
    $scope.finished = $rootScope.projeto.fim !== undefined;

    if (localStorageService.get('defaultStimulus') !== undefined) {
      $scope.activeStimulus = localStorageService.get('defaultStimulus');
    } else {
      $scope.activeStimulus = true;
    }

    var promisseStimulus;

    $scope.writer = {
      placeholder: '',
      maxLength: 50,
      continue: false,
      editing: false,
      isFoco: false
    };

    $scope.$on('modal.hidden', function (event, modal) {
      if (modal.id === 1) {
        $scope.current = {};

        if ($scope.popover !== undefined) {
          $scope.popover.remove();

          // bug fix : https://github.com/driftyco/ionic-v1/issues/53
          angular.element(document.body).removeClass('popover-open');
        }

        if (promisseStimulus !== undefined) {
          $interval.cancel(promisseStimulus);
          promisseStimulus = undefined;
        }

        $timeout(function () {
          $scope.writerModal.remove();
        }, 1000);
      } else {
        if ($scope.canActiveStimulus && $scope.activeStimulus && promisseStimulus === undefined) {
          promisseStimulus = $interval(openStimulus, 8000);
        }

        $timeout(function () {
          document.getElementById('writerText').focus();
          $scope.stimulusModal.remove();
        }, 1000);
      }
    });

    $scope.$on('modal.shown', function (event, modal) {
      if (modal.id === 1) {
        document.getElementById('writerText').focus();

        $timeout(function () {
          $ionicPopover.fromTemplateUrl('active-stimulus-popover.html', {
            scope: $scope
          }).then(function (popover) {
            $scope.popover = popover;
          });
        }, 1000);

        if ($scope.canActiveStimulus && $scope.activeStimulus && promisseStimulus === undefined) {
          promisseStimulus = $interval(openStimulus, 8000);
        }
      }
    });

    var searchType, type = null;

    var getTipoRegistro = function () {
      searchType = 'creation';

      tipoRegistroManager.getByFlag(searchType).then(function (response) {
        type = response;

        if (type !== null) {
          refreshList();
        }
      });
    };

    getTipoRegistro();

    function refreshList () {
      registroManager.getAll($rootScope.projeto, type, false).then(function (response) {
        $scope.records = response;

        var anyNota = response.some(function (item) {
          return item.avaliacao > -1;
        });

        if (anyNota) {
          $scope.step = 'score-creation';
        } else {
          $scope.step = searchType;
        }
      }, function (/*error*/) {
        $ionicPopup.alert({
          title: strings.alert,
          template: strings.error_list
        });
      });
    }

    $scope.addModal = function () {
      $scope.current = {};
      $scope.writer.editing = false;

      $scope.writer.title = strings.add_idea;
      $scope.writer.placeholder = strings.placeholder_idea;

      $ionicModal.fromTemplateUrl('writer.html', {
        id: 1,
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.writerModal = modal;
        $scope.writerModal.show();
      });
    };

    $scope.editModal = function (record) {
      if ($scope.step === 'score-creation') {
        return;
      }

      $scope.current = record;
      $scope.writer.editing = true;

      $scope.writer.title = strings.edit_idea;
      $scope.writer.placeholder = strings.placeholder_idea;

      $ionicModal.fromTemplateUrl('writer.html', {
        id: 1,
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.writerModal = modal;
        $scope.writerModal.show();
      });
    };

    $scope.focoModal = function () {
      if ($scope.finished) {
        return;
      }

      $scope.canActiveStimulus = false;

      $scope.current = {};

      $scope.current.descricao = $rootScope.projeto.foco;

      $scope.writer.title = strings.edit_focus;
      $scope.writer.editing = true;
      $scope.writer.placeholder = strings.my_focus + '...';
      $scope.writer.isFoco = true;
      $scope.writer.maxLength = 50;

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
      if ($rootScope.projeto.fase !== 'creation') {
        return;
      }

      var original = record.avaliacao;

      $scope.current = record;

      var relevancePopup = $ionicPopup.alert({
        title: strings.evaluate,
        cssClass: 'custom-content-alert',
        template: '<p>{{current.descricao}}</p><div class="range range-positive"><input type="range" name="volume" min="0" max="10" ng-model="current.avaliacao"><strong>{{current.avaliacao > -1 ? current.avaliacao : "0"}}</strong></div>',
        scope: $scope,
        buttons: [
          { text: strings.cancel },
          {
            text: 'OK',
            type: 'button-positive',
            onTap: function (/*e*/) {
              if (record.avaliacao === -1) {
                record.avaliacao = 0;
              }

              return parseInt(record.avaliacao) !== original;
            }
          }
        ]
      });

      relevancePopup.then(function (res) {
        if (res) {
          registroManager.save(record);
        } else {
          record.avaliacao = original;
        }

        $scope.current = {};
      });

      event.stopPropagation();
    };

    $scope.save = function (record) {
      $scope.current = record;

      if ($scope.current.descricao === undefined || ($scope.current.descricao.length === 0 || $scope.current.descricao.length > $scope.writer.maxLength)) {
        $ionicPopup.alert({
          title: strings.alert,
          template: strings.empty_textarea
        });
      } else {
        if ($scope.writer.isFoco === false) {
          if ($scope.writer.editing === false) {
            registroManager.add($scope.current.descricao, $rootScope.projeto, type).then(function (/*response*/) {
              if ($scope.writer.continue) {
                $scope.current = {};

                $timeout(function () {
                  document.getElementById('writerText').focus();
                }, 0);
              } else {
                $scope.writerModal.hide();
              }

              refreshList();
            }, function (error) {
              $ionicPopup.alert({
                title: strings.alert,
                template: strings.error_save_data
              });
            });
          } else {
            registroManager.save($scope.current).then(function (response) {
              $scope.writerModal.hide();
              refreshList();
            }, function (error) {
              $ionicPopup.alert({
                title: strings.alert,
                template: strings.error_save_data
              });
            });
          }
        } else {
          $rootScope.projeto.foco = record.descricao;

          $scope.foco = record.descricao;

          projetoManager.save($rootScope.projeto);

          $scope.writerModal.hide();
        }
      }
    };

    $scope.remove = function (event) {
      var confirmPopup = $ionicPopup.confirm({
        title: strings.alert,
        template: strings.confirm_remove,
        buttons: [
          {text: strings.no, type: 'button-default', onTap: function (e) { return false; }},
          {text: strings.yes, type: 'button-positive', onTap: function (e) { return true; }}
        ]
      });

      confirmPopup.then(function (res) {
        if (res) {
          registroManager.remove($scope.current).then(function (response) {
            $scope.writerModal.hide();
            refreshList();
          }, function (error) {
            $ionicPopup.alert({
              title: strings.alert,
              template: strings.error_remove
            });
          });
        }
      });
    };

    $scope.process = function () {
      if ($scope.step === 'creation') {
        if ($scope.records.length < 14) {
          $ionicPopup.alert({
            title: strings.alert,
            template: strings.add_limit_idea
          });
        } else {
          $scope.step = 'score-creation';
        }
      } else if ($scope.step === 'score-creation') {
        if ($rootScope.projeto.fase !== 'creation') {
          $state.go('tab.usage');
          return;
        }

        var canContinue = true;

        $scope.records.forEach(function (element) {
          if (canContinue && element.avaliacao === -1) {
            canContinue = false;
          }
        });

        if (canContinue) {
          var items = Array.from({length: 11}, function (/*v, k*/) {
            return [];
          });

          $scope.records.forEach(function (element) {
            items[element.avaliacao].push(element);
          });

          var bestVotes = [];

          for (var i = items.length; i--;) {
            bestVotes.push.apply(bestVotes, items[i]);

            if (bestVotes.length >= 7) {
              break;
            }
          }

          if (bestVotes.length > 7) {
            var alert = $ionicPopup.alert({
              title: strings.alert,
              template: 'Continue avaliando até encontrar as 7 ideias mais importantes.',
              buttons: [
                {
                  text: 'OK',
                  type: 'button-positive',
                  onTap: function (e) { return true; }
                }
              ]
            });

            alert.then(function (res) {
              $scope.records.forEach(function (element, index) {
                var found = bestVotes.find(function (x) {
                  return x.id === element.id;
                });

                if (found === undefined) {
                  element.descarte = true;
                  registroManager.save(element);
                }
              });

              refreshList();
            });
          } else {
            $scope.records.forEach(function (element, index) {
              var found = bestVotes.find(function (x) {
                return x.id === element.id;
              });

              if (found === undefined) {
                element.descarte = true;
                registroManager.save(element);
              }
            });

            refreshList();

            bestVotes.sort(function (a, b) {
              return a.id - b.id;
            });

            registroManager.copy(bestVotes).then(function (response) {
              $rootScope.projeto.fase = 'usage';

              projetoManager.save($rootScope.projeto);

              $state.go('tab.usage');
            });
          }
        } else {
          $ionicPopup.alert({
            title: strings.alert,
            template: strings.need_evaluate_idea
          });
        }
      }
    };

    function openStimulus () {
      if (promisseStimulus !== undefined) {
        $interval.cancel(promisseStimulus);
        promisseStimulus = undefined;
      }

      if ($scope.popover) {
        $scope.popover.hide();
      }

      $ionicModal.fromTemplateUrl('main/components/stimulus/html/stimulus.html', {
        id: 2,
        scope: $scope,
        animation: 'slide-in-up',
        controller: 'StimulusCtrl'
      }).then(function (modal) {
        $scope.stimulusModal = modal;
        $scope.stimulusModal.show();
      });
    }

    $scope.stimulusOptions = function (event) {
      $scope.popover.show(event);
    };

    $scope.stimulusChange = function () {
      $scope.activeStimulus = !$scope.activeStimulus;

      localStorageService.set('defaultStimulus', $scope.activeStimulus);

      if ($scope.activeStimulus) {
        if (promisseStimulus === undefined) {
          promisseStimulus = $interval(openStimulus, 8000);
        }
      } else {
        if (promisseStimulus !== undefined) {
          $interval.cancel(promisseStimulus);
          promisseStimulus = undefined;
        }
      }
    };

    $scope.$watch('current.descricao', function () {
      if ($scope.writerModal !== undefined && $scope.writerModal.isShown() && $scope.canActiveStimulus && $scope.activeStimulus) {
        if (promisseStimulus !== undefined) {
          $interval.cancel(promisseStimulus);
          promisseStimulus = undefined;
        }

        promisseStimulus = $interval(openStimulus, 8000);
      }
    });

    $scope.viewObstaculos = function () {
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
    };

    $scope.reset = function () {
      var resetPopup = $ionicPopup.confirm({
        title: strings.alert,
        template: strings.confirm_reset,
        buttons: [
          {text: strings.no, type: 'button-default', onTap: function (e) { return false; }},
          {text: strings.yes, type: 'button-positive', onTap: function (e) { return true; }}
        ]
      });

      resetPopup.then(function (res) {
        if (res) {
          registroManager.reset($rootScope.projeto, type).then(function () {
            $scope.step = searchType;

            $rootScope.disableTabUsage = true;
            $rootScope.disableTabScript = true;

            $rootScope.projeto.fase = searchType;

            projetoManager.save($rootScope.projeto);

            refreshList();
          });
        }
      });
    };

    $scope.openTutorial = function () {
      var message = '';

      switch ($scope.step) {
        case 'creation':
          message = 'Aqui você deve listar pelo menos 14 ideias para vencer seus obstáculos e atingir seu foco. Sem pensar muito, escreva tudo o que vier à sua mente de forma resumida. Não é necessário explicar, detalhar. Apenas registre. Escreva o maior número que conseguir!';
          break;
        case 'score-creation':
          message = 'Agora é o momento de extrair a essência da sua lista de ideias, até conseguir chegar nas 7 principais. Aqui você deve avaliar todas as ideias que listou, classificando-as quanto à sua relevância em relação ao seu foco. Se for preciso, continue avaliando, uma a uma, pois você precisa chegar nas 7 ideias mais importantes. Lembre-se de que convergir é decisivo para focar!';
          break;
        default: message = '';
          break;
      }

      $ionicPopup.alert({
        title: strings.tutorial,
        template: '<p class="text-center">' + message + '</p>'
      });
    };
  });
