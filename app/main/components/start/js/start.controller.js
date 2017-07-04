appControllers.controller('StartCtrl', ['$scope', '$rootScope', '$state', '$timeout', '$ionicModal', '$ionicPopup', '$translate', 'projetoManager', function($scope, $rootScope, $state, $timeout, $ionicModal, $ionicPopup, $translate, projetoManager) {
    var strings = {};
    
    $translate(['tutorial', 'define_focus', 'my_focus', 'empty_textarea', 'alert']).then(function (translations) {
        strings = translations;
    });
    
    $scope.current = {};
    $scope.loading = false;
    
    $scope.writer = {
        maxLength: 50,
        continue: false,
        editing: false,
        isFoco: true,
        showTutorial: true
    };

    $scope.$on('modal.hidden', function(event, modal) {
        $scope.current = {};
        
        if ($rootScope.projeto != undefined) {
            $scope.loading = true;
            
            $timeout(function() {
                $scope.writerModal.remove();
                $state.go('tab.facts');
            }, 500);
        }
    });

    $scope.$on('modal.shown', function(event, modal) {
        document.getElementById('writerText').focus();
    });

    $scope.focoModal = function() {
        $scope.writer.title = strings.define_focus;
        $scope.writer.placeholder = strings.my_focus + '...';
        
        $ionicModal.fromTemplateUrl('writer.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.writerModal = modal;
            $scope.writerModal.show();
        });
    };

    $scope.withoutFoco = function() {
        projetoManager.add(null, null).then(function(response) {
            $rootScope.projeto = response;
            $state.go('tab.facts');
        });
    };

    $scope.save = function(record) {
        $scope.current = record;

        if ($scope.current.descricao == undefined || ($scope.current.descricao.length == 0 || $scope.current.descricao.length > $scope.writer.maxLength)) {
            $ionicPopup.alert({
                title: strings.alert,
                template: strings.empty_textarea
            });
        } else {
            projetoManager.add(record.descricao, null).then(function(response) {
                $rootScope.projeto = response;
                $scope.writerModal.hide();
            });
        }
    };

    $scope.openTutorialFoco = function() {
        var message = 'Aqui você deve registrar o que realmente quer fazer. O que gostaria de resolver? Aonde você quer chegar? Qual mudança deseja realizar?';

        $ionicPopup.alert({
            title: strings.tutorial,
            template: '<p class="text-center">' + message + '</p>'
        });
    };
}]);