'use strict';
angular.module('starter.controllers')
  .controller('TabFactsCtrl', function ($scope, $rootScope, $state, $timeout, $interval, $ionicModal, $ionicPopup, $ionicPopover, $translate, localStorageService, tipoRegistroManager, registroManager, projetoManager, ga) {
    if (!localStorageService.get('activeProject')) {
      return;
    }

    ga.trackView('Facts');

    var strings = {};

    $translate(['worries', 'facts', 'alert', 'error_list', 'empty_worries', 'empty_facts', 'add_worry', 'add_fact', 'placeholder_worry', 'placeholder_fact', 'edit_worry', 'edit_fact', 'define_focus', 'edit_focus', 'my_focus', 'evaluate', 'error_save_data', 'confirm_remove', 'yes', 'no', 'error_remove', 'add_limit_worry', 'evaluate_more', 'need_evaluate_worry', 'add_limit_fact', 'need_evaluate_fact', 'confirm_reset', 'cancel', 'empty_textarea', 'tutorial']).then(function (translations) {
      strings = translations;

      if ($rootScope.projeto.fase === 'worry') {
        $scope.title = strings.worries;
        $scope.txtEmptyList = strings.empty_worries;
      } else {
        $scope.title = strings.facts;
        $scope.txtEmptyList = strings.empty_facts;
      }
    });

    $scope.records = [];
    $scope.current = {};
    $scope.stimulusType = 'fat';
    $scope.canActiveStimulus = true;
    $scope.foco = $rootScope.projeto.foco;
    $scope.finished = !!$rootScope.projeto.fim;

    if (localStorageService.get('defaultStimulus')) {
      $scope.activeStimulus = localStorageService.get('defaultStimulus');
    } else {
      $scope.activeStimulus = true;
    }

    var promisseStimulus;

    if ($rootScope.projeto.fase === 'worry') {
      $scope.step = 'worry';
    } else {
      $scope.step = 'fact';
    }

    $scope.writer = {
      placeholder: '',
      maxLength: 50,
      continue: false,
      editing: false,
      isFoco: false,
      showTutorial: false
    };

    $scope.$on('modal.hidden', function (event, modal) {
      if (modal.id === 1) {
        $scope.current = {};

        if ($scope.popover) {
          $scope.popover.remove();

          // bug fix : https://github.com/driftyco/ionic-v1/issues/53
          angular.element(document.body).removeClass('popover-open');
        }

        if (promisseStimulus) {
          $interval.cancel(promisseStimulus);
          promisseStimulus = undefined;
        }

        $timeout(function () {
          $scope.writerModal.remove();
        }, 1000);
      } else {
        if ($scope.canActiveStimulus && $scope.activeStimulus && !promisseStimulus) {
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

        if ($scope.canActiveStimulus && $scope.activeStimulus && !promisseStimulus) {
          promisseStimulus = $interval(openStimulus, 8000);
        }
      }
    });

    var searchType, type = null;

    var getTipoRegistro = function () {
      searchType = $scope.step.includes('worry') ? 'worry' : 'fact';

      tipoRegistroManager.getByFlag(searchType).then(function (response) {
        type = response;

        if (type) {
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
          if (searchType === 'worry') {
            $scope.step = 'score-worry';
          } else {
            $scope.step = 'score-fact';
          }
        } else {
          $scope.step = searchType;
        }
      }, function (/*error*/) {
        $ionicPopup.alert({
          title: strings.alert,
          template: strings.error_list
        });
      });

      if (searchType === 'worry') {
        $scope.txtEmptyList = strings.empty_worries;
      } else {
        $scope.txtEmptyList = strings.empty_facts;
      }
    }

    $scope.addModal = function () {
      $scope.canActiveStimulus = true;

      $scope.current = {};
      $scope.writer.editing = false;
      $scope.writer.isFoco = false;
      $scope.writer.showTutorial = false;
      $scope.writer.maxLength = 50;

      if (searchType === 'worry') {
        $scope.writer.title = strings.add_worry;
        $scope.writer.placeholder = strings.placeholder_worry;
      } else {
        $scope.writer.title = strings.add_fact;
        $scope.writer.placeholder = strings.placeholder_fact;
      }

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
      if ($scope.step === 'score-worry' || $scope.step === 'score-fact') {
        return;
      }

      $scope.canActiveStimulus = true;

      $scope.current = record;
      $scope.writer.editing = true;
      $scope.writer.isFoco = false;
      $scope.writer.maxLength = 50;

      if (searchType === 'worry') {
        $scope.writer.title = strings.edit_worry;
        $scope.writer.placeholder = strings.placeholder_worry;
      } else {
        $scope.writer.title = strings.edit_fact;
        $scope.writer.placeholder = strings.placeholder_fact;
      }

      $ionicModal.fromTemplateUrl('writer.html', {
        id: 1,
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.writerModal = modal;
        $scope.writerModal.show();
      });
    };

    var focoModal = function () {
      if ($scope.finished) {
        return;
      }

      $scope.canActiveStimulus = false;

      $scope.current = {};

      if (!$rootScope.projeto.foco) {
        $scope.writer.title = strings.define_focus;
        $scope.writer.editing = false;
      } else {
        $scope.writer.title = strings.edit_focus;
        $scope.writer.editing = true;

        $scope.current.descricao = $rootScope.projeto.foco;
      }

      $scope.writer.placeholder = strings.my_focus + '...';
      $scope.writer.showTutorial = true;
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

    $scope.focoModal = focoModal;

    $scope.scoreItem = function (record, event) {
      if ($rootScope.projeto.fase !== 'worry' && $rootScope.projeto.fase !== 'fact') {
        return;
      }

      var original = record.avaliacao;

      $scope.current = record;

      var relevancePopup = $ionicPopup.alert({
        title: strings.evaluate,
        cssClass: 'custom-content-alert',
        template: '<p>{{current.descricao}}</p><div class="custom-range"><input type="range" name="volume" min="0" max="10" ng-model="current.avaliacao"><strong>{{current.avaliacao > -1 ? current.avaliacao : "0"}}</strong></div>',
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

      if (!$scope.current.descricao || ($scope.current.descricao.length === 0 || $scope.current.descricao.length > $scope.writer.maxLength)) {
        $ionicPopup.alert({
          title: strings.alert,
          template: strings.empty_textarea
        });
      } else {
        if (!$scope.writer.isFoco) {
          if (!$scope.writer.editing) {
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
            }, function (/*error*/) {
              $ionicPopup.alert({
                title: strings.alert,
                template: strings.error_save_data
              });
            });
          } else {
            registroManager.save($scope.current).then(function (/*response*/) {
              $scope.writerModal.hide();
              refreshList();
            }, function (/*error*/) {
              $ionicPopup.alert({
                title: strings.alert,
                template: strings.error_save_data
              });
            });
          }
        } else {
          if (!$scope.writer.editing) {
            $scope.step = 'fact';
            $scope.title = strings.facts;

            $rootScope.projeto.fase = 'fact';

            registroManager.getAll($rootScope.projeto, type, false).then(function (response) {
              var lista = response;

              registroManager.getAll($rootScope.projeto, type, true).then(function (response) {
              // lista.push(...response);
                lista.push.apply(lista, response);

                lista.sort(function (a, b) {
                  return a.id - b.id;
                });

                registroManager.copy(lista).then(function (/*response*/) {
                  getTipoRegistro();
                });
              });
            });
          }

          $rootScope.projeto.foco = record.descricao;

          $scope.foco = record.descricao;

          projetoManager.save($rootScope.projeto);

          $scope.writerModal.hide();
        }
      }
    };

    $scope.remove = function (/*event*/) {
      var confirmPopup = $ionicPopup.confirm({
        title: strings.alert,
        template: strings.confirm_remove,
        buttons: [
          {text: strings.no, type: 'button-default', onTap: function (/*e*/) { return false; }},
          {text: strings.yes, type: 'button-positive', onTap: function (/*e*/) { return true; }}
        ]
      });

      confirmPopup.then(function (res) {
        if (res) {
          registroManager.remove($scope.current).then(function (/*response*/) {
            $scope.writerModal.hide();
            refreshList();
          }, function (/*error*/) {
            $ionicPopup.alert({
              title: strings.alert,
              template: strings.error_remove
            });
          });
        }
      });
    };

    $scope.process = function () {
      var canContinue,
        items,
        bestVotes,
        i;

      if ($scope.step === 'worry') {
        if ($scope.records.length < 14) {
          $ionicPopup.alert({
            title: strings.alert,
            template: strings.add_limit_worry
          });
        } else {
          $scope.step = 'score-worry';
        }
      } else if ($scope.step === 'score-worry') {
        canContinue = true;

        $scope.records.forEach(function (element) {
          if (canContinue && element.avaliacao === -1) {
            canContinue = false;
          }
        });

        if (canContinue) {
          items = Array.from({length: 11}, function (/*v, k*/) {
            return [];
          });

          $scope.records.forEach(function (element) {
            items[element.avaliacao].push(element);
          });

          bestVotes = [];

          for (i = items.length; i--;) {
          // bestVotes.push(...items[i]);
            bestVotes.push.apply(bestVotes, items[i]);

            if (bestVotes.length >= 7) {
              break;
            }
          }

          if (bestVotes.length > 7) {
            $ionicPopup.alert({
              title: strings.alert,
              template: 'Continue avaliando até encontrar as 7 inquietações mais importantes.',
              buttons: [
                {
                  text: 'OK',
                  type: 'button-positive',
                  onTap: function (/*e*/) { return true; }
                }
              ]
            })
              .then(function (/*res*/) {
                $scope.records.forEach(function (element/*, index*/) {
                  var found = bestVotes.find(function (x) {
                    return x.id === element.id;
                  });

                  if (!found) {
                    element.descarte = true;
                    registroManager.save(element);
                  }
                });

                refreshList();
              });
          } else {
            $scope.records.forEach(function (element/*, index*/) {
              var found = bestVotes.find(function (x) {
                return x.id === element.id;
              });

              if (!found) {
                element.descarte = true;
                registroManager.save(element);
              }
            });

            refreshList();

            focoModal();
          }
        } else {
          $ionicPopup.alert({
            title: strings.alert,
            template: strings.need_evaluate_worry
          });
        }
      } else if ($scope.step === 'fact') {
        if ($scope.records.length < 14) {
          $ionicPopup.alert({
            title: strings.alert,
            template: strings.add_limit_fact
          });
        } else {
          $scope.step = 'score-fact';
        }
      } else if ($scope.step === 'score-fact') {
        if ($rootScope.projeto.fase !== 'fact') {
          $state.go('tab.notes');
          return;
        }

        canContinue = true;

        $scope.records.forEach(function (element) {
          if (canContinue && element.avaliacao === -1) {
            canContinue = false;
          }
        });

        if (canContinue) {
          items = Array.from({length: 11}, function (/*v, k*/) {
            return [];
          });

          $scope.records.forEach(function (element) {
            items[element.avaliacao].push(element);
          });

          bestVotes = [];

          for (i = items.length; i--;) {
            bestVotes.push.apply(bestVotes, items[i]);

            if (bestVotes.length >= 7) {
              break;
            }
          }

          if (bestVotes.length > 7) {
            $ionicPopup.alert({
              title: strings.alert,
              template: 'Continue avaliando até encontrar os 7 fatos mais importantes.',
              buttons: [
                {
                  text: 'OK',
                  type: 'button-positive',
                  onTap: function (/*e*/) { return true; }
                }
              ]
            })
              .then(function (/*res*/) {
                $scope.records.forEach(function (element/*, index*/) {
                  var found = bestVotes.find(function (x) {
                    return x.id === element.id;
                  });

                  if (!found) {
                    element.descarte = true;
                    registroManager.save(element);
                  }
                });

                refreshList();
              });
          } else {
            $scope.records.forEach(function (element/*, index*/) {
              var found = bestVotes.find(function (x) {
                return x.id === element.id;
              });

              if (!found) {
                element.descarte = true;
                registroManager.save(element);
              }
            });

            registroManager.getAll($rootScope.projeto, type, false).then(function (response) {
              var lista = response;

              registroManager.getAll($rootScope.projeto, type, true).then(function (response) {
                lista.push.apply(lista, response);

                lista.sort(function (a, b) {
                  return a.id - b.id;
                });

                registroManager.copy(lista).then(function (/*response*/) {
                  refreshList();

                  $rootScope.projeto.fase = 'note';

                  projetoManager.save($rootScope.projeto);

                  $state.go('tab.notes');
                });
              });
            });
          }
        } else {
          $ionicPopup.alert({
            title: strings.alert,
            template: strings.need_evaluate_fact
          });
        }
      }
    };

    function openStimulus () {
      if (promisseStimulus) {
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
        if (!promisseStimulus) {
          promisseStimulus = $interval(openStimulus, 8000);
        }
      } else {
        if (promisseStimulus) {
          $interval.cancel(promisseStimulus);
          promisseStimulus = undefined;
        }
      }
    };

    $scope.$watch('current.descricao', function () {
      if ($scope.writerModal && $scope.writerModal.isShown() && $scope.canActiveStimulus && $scope.activeStimulus) {
        if (promisseStimulus) {
          $interval.cancel(promisseStimulus);
          promisseStimulus = undefined;
        }

        promisseStimulus = $interval(openStimulus, 8000);
      }
    });

    $scope.reset = function () {
      var resetPopup = $ionicPopup.confirm({
        title: strings.alert,
        template: strings.confirm_reset,
        buttons: [
          {text: strings.no, type: 'button-default', onTap: function (/*e*/) { return false; }},
          {text: strings.yes, type: 'button-positive', onTap: function (/*e*/) { return true; }}
        ]
      });

      resetPopup.then(function (res) {
        if (res) {
          registroManager.reset($rootScope.projeto, type).then(function () {
            $scope.step = searchType;

            $rootScope.disableTabNotes = true;
            $rootScope.disableTabCreation = true;
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
        case 'worry':
          message = 'Aqui você deve listar pelo menos 14 inquietações. Inquietações são todas as suas ansiedades, desejos, sentimentos e percepções. Sem pensar muito, escreva tudo o que vier à sua mente de forma resumida. Não é necessário explicar, detalhar. Apenas registre. Escreva o maior número que conseguir!';
          break;
        case 'score-worry':
          message = 'Agora é o momento de extrair a essêcia da sua lista de inquietações, até conseguir chegar nas 7 principais. Aqui você deve avaliar todas as inquietações que listou, classificando-as por sua ordem de importância. Se for preciso, continue avaliando, uma a uma, pois você precisa chegar nas 7 inquietações mais importantes. Lembre-se de que convergir é decisivo para focar!';
          break;
        case 'fact':
          message = 'Aqui você deve listar pelo menos 14 fatos relacionados ao seu foco. Fatos são todas as suas inquietações, ansiedades, desejos, sentimentos e percepções. Sem pensar muito, escreva tudo o que vier à sua mente de forma resumida.';
          break;
        case 'score-fact':
          message = 'Agora é o momento de extrair a essência da sua lista de fatos, até conseguir chegar nos 7 principais. Aqui você deve avaliar todos os fatos que listou, classificando-os quanto à sua relevância em relação ao seu foco. Se for preciso, continue avaliando, um a um, pois você precisa chegar nos 7 fatos mais importantes. Lembre-se de que convergir é decisivo para focar!';
          break;
        default: message = '';
          break;
      }

      $ionicPopup.alert({
        title: strings.tutorial,
        template: '<p class="text-center">' + message + '</p>'
      });
    };

    $scope.openTutorialFoco = function () {
      var message = 'Aqui você deve registrar o que realmente quer fazer. O que gostaria de resolver? Aonde você quer chegar? Qual mudança deseja realizar?';

      $ionicPopup.alert({
        title: strings.tutorial,
        template: '<p class="text-center">' + message + '</p>'
      });
    };
  });
