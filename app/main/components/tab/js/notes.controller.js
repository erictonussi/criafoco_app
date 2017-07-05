appControllers.controller('TabNotesCtrl', ['$scope', '$rootScope', '$state', '$timeout', '$ionicModal', '$ionicPopup', '$ionicListDelegate', '$translate', 'localStorageService', 'tipoRegistroManager', 'registroManager', 'projetoManager', function($scope, $rootScope, $state, $timeout, $ionicModal, $ionicPopup, $ionicListDelegate, $translate, localStorageService, tipoRegistroManager, registroManager, projetoManager) {
    if (localStorageService.get('activeProject') == undefined) {
        return;
    }

    var strings = {};

    $translate(['note', 'alert', 'error_list', 'add_note', 'placeholder_note', 'edit_note', 'edit_focus', 'my_focus', 'evaluate', 'error_save_data', 'confirm_remove', 'yes', 'no', 'error_remove', 'add_limit_fact', 'need_evaluate_fact', 'confirm_reset', 'cancel', 'empty_textarea', 'define_op_ob', 'define_num_op_ob', 'tutorial', 'evaluate_more_ob', 'evaluate_more_op']).then(function (translations) {
        strings = translations;

        $scope.title = strings.note;

        if ($rootScope.projeto.fim == undefined && $scope.step == 'note') {
            $ionicPopup.alert({
                title: strings.alert,
                template: '<img src="main/assets/images/icon-swipe-left.png"> ' + strings.define_op_ob
            });
        }
    });

    $scope.records = [];
    $scope.current = {};
    $scope.step = 'note';
    $scope.foco = $rootScope.projeto.foco;
    $scope.finished = $rootScope.projeto.fim != undefined

    $scope.writer = {
        placeholder:  '',
        maxLength: 50,
        continue: false,
        editing: false,
        isFoco: false
    };

    $scope.$on('modal.hidden', function(event, modal) {
        $scope.current = {};

        $timeout(function() {
            $scope.writerModal.remove();
        }, 1000);
    });

    $scope.$on('modal.shown', function(event, modal) {
        document.getElementById('writerText').focus();
    });

    var searchType, type = null;

    var getTipoRegistro = function() {
        searchType = 'note';

        tipoRegistroManager.getByFlag(searchType).then(function(response) {
            type = response;

            if (type != null) {
                refreshList();
            }
        });
    };

    getTipoRegistro();

    var refreshList = function() {
        registroManager.getAll($rootScope.projeto, type, false).then(function(response) {
            $scope.records = response;

            var oportunidades = response.filter(x => x.ob_op == 1);
            var obstaculos = response.filter(x => x.ob_op == 2);

            var anyNota = response.some(function(item) {
                return item.avaliacao > -1;
            });

            if (anyNota || ((oportunidades.length > 0 && oportunidades.length < 8) || (obstaculos.length > 0 && obstaculos.length < 8))) {
                $scope.step = 'score-note';
            } else {
                $scope.step = searchType;
            }
        }, function(error) {
            $ionicPopup.alert({
                title: strings.alert,
                template: strings.error_list
            });
        });
    }

    $scope.addModal = function() {
        $scope.current = {};
        $scope.writer.editing = false;

        $scope.writer.title = strings.add_note;
        $scope.writer.placeholder = strings.placeholder_note;

        $ionicModal.fromTemplateUrl('writer.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.writerModal = modal;
            $scope.writerModal.show();
        });
    };

    $scope.editModal = function(record) {
        if ($scope.step == 'score-note') {
            return;
        }

        $scope.current = record;
        $scope.writer.editing = true;

        $scope.writer.title = strings.edit_note;
        $scope.writer.placeholder = strings.placeholder_note;

        $ionicModal.fromTemplateUrl('writer.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.writerModal = modal;
            $scope.writerModal.show();
        });
    };

    $scope.focoModal = function() {
        if ($scope.finished) {
            return;
        }

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
        }).then(function(modal) {
            $scope.writerModal = modal;
            $scope.writerModal.show();
        });
    };

    $scope.scoreItem = function(record, event) {
        if ($rootScope.projeto.fase != 'note') {
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
                    onTap: function(e) {
                        if (record.avaliacao == -1) {
                            record.avaliacao = 0;
                        }

                        return parseInt(record.avaliacao) != original;
                    }
                }
            ]
        });

        relevancePopup.then(function(res) {
            if (res) {
                registroManager.save(record);
            } else {
                record.avaliacao = original;
            }

            $scope.current = {};
        });

        event.stopPropagation();
    };

    $scope.save = function(record) {
        $scope.current = record;

        if ($scope.current.descricao == undefined || ($scope.current.descricao.length == 0 || $scope.current.descricao.length > $scope.writer.maxLength)) {
            $ionicPopup.alert({
                title: strings.alert,
                template: strings.empty_textarea
            });
        } else {
            if ($scope.writer.isFoco == false) {
                if ($scope.writer.editing == false) {
                    registroManager.add($scope.current.descricao, $rootScope.projeto, type).then(function(response) {
                        if ($scope.writer.continue) {
                            $scope.current = {};

                            $timeout(function() {
                                document.getElementById('writerText').focus();
                            }, 0);
                        } else {
                            $scope.writerModal.hide();
                        }

                        refreshList();
                    }, function(error) {
                        $ionicPopup.alert({
                            title: strings.alert,
                            template: strings.error_save_data
                        });
                    });
                } else {
                    registroManager.save($scope.current).then(function(response) {
                        $scope.writerModal.hide();
                        refreshList();
                    }, function(error) {
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

    $scope.remove = function(event) {
        var confirmPopup = $ionicPopup.confirm({
            title: strings.alert,
            template: strings.confirm_remove,
            buttons: [
                {text: strings.no, type: 'button-default', onTap: function(e) { return false; }},
                {text: strings.yes, type: 'button-positive', onTap: function(e) { return true; }}
            ]
        });

        confirmPopup.then(function(res) {
            if (res) {
                registroManager.remove($scope.current).then(function(response) {
                    $scope.writerModal.hide();
                    refreshList();
                }, function(error) {
                    $ionicPopup.alert({
                        title: strings.alert,
                        template: strings.error_remove
                    });
                });
            }
        });
    };

    $scope.process = function() {
        if ($scope.step == 'note') {
            if ($scope.records.length < 14) {
                $ionicPopup.alert({
                    title: strings.alert,
                    template: strings.add_limit_fact
                });
            } else {
                var oportunidades = [];
                var obstaculos = [];

                $scope.records.forEach(function(element) {
                    if (element.ob_op != null && element.ob_op == 1) {
                        oportunidades.push(element);
                    } else if (element.ob_op != null && element.ob_op == 2) {
                        obstaculos.push(element);
                    }
                });

                if (oportunidades.length == 0 && obstaculos.length == 0) {
                    $ionicPopup.alert({
                        title: strings.alert,
                        template: '<img src="main/assets/images/icon-swipe-left.png"> ' + strings.define_op_ob
                    });
                } else {
                    oportunidades.push(...obstaculos);

                    var bestVotes = oportunidades;

                    $scope.records.forEach(function(element, index) {
                        var found = bestVotes.find(x => x.id == element.id);

                        if (found == undefined) {
                            element.descarte = true;
                            registroManager.save(element);
                        }
                    });

                    $scope.step = 'score-note';

                    refreshList();
                }

                /*if (oportunidades.length == 0 && obstaculos.length == 0) {
                    $ionicPopup.alert({
                        title: strings.alert,
                        template: '<img src="main/assets/images/icon-swipe-left.png"> ' + strings.define_op_ob
                    });
                } else if (oportunidades.length > 7 || obstaculos.length > 7) {
                    $ionicPopup.alert({
                        title: strings.alert,
                        template: strings.define_num_op_ob
                    });
                } else {
                    oportunidades.push(...obstaculos);

                    var bestVotes = oportunidades;

                    $scope.records.forEach(function(element, index) {
                        var found = bestVotes.find(x => x.id == element.id);

                        if (found == undefined) {
                            element.descarte = true;
                            registroManager.save(element);
                        }
                    });

                    $scope.step = 'score-note';

                    refreshList();
                }*/
            }
        } else if ($scope.step == 'score-note') {
            if ($rootScope.projeto.fase != 'note') {
                $state.go('tab.creation');
                return;
            }

            var canContinue = true;

            $scope.records.forEach(function(element) {
                if (canContinue && element.avaliacao == -1) {
                    canContinue = false;
                }
            });

            if (canContinue) {
                var oportunidades = [];
                var obstaculos = [];

                $scope.records.forEach(function(element) {
                    if (element.ob_op != null && element.ob_op == 1) {
                        oportunidades.push(element);
                    } else if (element.ob_op != null && element.ob_op == 2) {
                        obstaculos.push(element);
                    }
                });

                const itemsOp = Array.from({length: 11}, (v, k) => []);

                oportunidades.forEach(function(element) {
                    itemsOp[element.avaliacao].push(element);
                });

                var bestVotesOp = [];

                for (var i = itemsOp.length; i--;) {
                    bestVotesOp.push(...itemsOp[i]);

                    if (bestVotesOp.length >= 7) {
                        break;
                    }
                }

                const itemsOb = Array.from({length: 11}, (v, k) => []);

                obstaculos.forEach(function(element) {
                    itemsOb[element.avaliacao].push(element);
                });

                var bestVotesOb = [];

                for (var i = itemsOb.length; i--;) {
                    bestVotesOb.push(...itemsOb[i]);

                    if (bestVotesOb.length >= 7) {
                        break;
                    }
                }

                if (bestVotesOp.length > 7) {
                    var alert = $ionicPopup.alert({
                        title: strings.alert,
                        template: 'Continue avaliando até encontrar as 7 oportunidades mais importantes.',
                        buttons: [
                            {
                                text: 'OK',
                                type: 'button-positive',
                                onTap: function(e) { return true; }
                            }
                        ]
                    });

                    alert.then(function(res) {
                        oportunidades.forEach(function(element, index) {
                            var found = bestVotesOp.find(x => x.id == element.id);

                            if (found == undefined) {
                                element.descarte = true;
                                registroManager.save(element);
                            }
                        });

                        refreshList();
                    });
                } else if (bestVotesOb.length > 7) {
                    var alert = $ionicPopup.alert({
                        title: strings.alert,
                        template: 'Continue avaliando até encontrar os 7 obstáculos mais importantes.',
                        buttons: [
                            {
                                text: 'OK',
                                type: 'button-positive',
                                onTap: function(e) { return true; }
                            }
                        ]
                    });

                    alert.then(function(res) {
                        obstaculos.forEach(function(element, index) {
                            var found = bestVotesOb.find(x => x.id == element.id);

                            if (found == undefined) {
                                element.descarte = true;
                                registroManager.save(element);
                            }
                        });

                        refreshList();
                    });
                } else {
                    oportunidades.forEach(function(element, index) {
                        var found = bestVotesOp.find(x => x.id == element.id);

                        if (found == undefined) {
                            element.descarte = true;
                            registroManager.save(element);
                        }
                    });

                    obstaculos.forEach(function(element, index) {
                        var found = bestVotesOb.find(x => x.id == element.id);

                        if (found == undefined) {
                            element.descarte = true;
                            registroManager.save(element);
                        }
                    });

                    refreshList();

                    $rootScope.projeto.fase = 'creation';

                    projetoManager.save($rootScope.projeto);

                    $state.go('tab.creation');
                }
            } else {
                $ionicPopup.alert({
                    title: strings.alert,
                    template: strings.need_evaluate_notes
                });
            }
        }
    };

    $scope.obOp = function(record, value) {
        if (value == 0) {
            record.ob_op = null;
        } else {
            record.ob_op = value;
        }

        registroManager.save(record).then(function(response) {
            var index = $scope.records.findIndex(x => x.id == record.id);

            if (index > -1) {
                $scope.records[index] = record;
            }

            $ionicListDelegate.closeOptionButtons();
        });

        event.stopPropagation();
    };

    $scope.reset = function() {
        var resetPopup = $ionicPopup.confirm({
            title: strings.alert,
            template: strings.confirm_reset,
            buttons: [
                {text: strings.no, type: 'button-default', onTap: function(e) { return false; }},
                {text: strings.yes, type: 'button-positive', onTap: function(e) { return true; }}
            ]
        });

        resetPopup.then(function(res) {
            if (res) {
                registroManager.reset($rootScope.projeto, type).then(function() {
                    $scope.step = searchType;

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

    $scope.openTutorial = function() {
        var message = '';

        switch ($scope.step) {
            case 'note':
                message = 'Aqui você irá analisar todos os seus fatos e definir quais deles podem ser obstáculos ou oportunidades para atingir o seu foco. O fato que não for obstáculo e nem oportunidade não precisa ser marcado. Aqui você também pode adicionar um obstáculo ou uma oportunidade que julgar importante.';
                break;
            case 'score-note':
                message = 'Agora é o momento de extrair a essência da sua lista de observações, até conseguir chegar naquelas principais. Aqui você deve avaliar seus obstáculos e oportunidades, classificando-os quanto à sua relevância em relação ao seu foco. Se for preciso, continue avaliando, um a um, pois você precisa chegar nos 7 obstáculos e nas 7 oportunidades mais importantes. Lembre-se de que convergir é decisivo para focar!';
                break;
            default: message = '';
                break;
        }

        $ionicPopup.alert({
            title: strings.tutorial,
            template: '<p class="text-center">' + message + '</p>'
        });
    };
}]);
