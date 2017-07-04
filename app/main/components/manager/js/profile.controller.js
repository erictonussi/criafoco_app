appControllers.controller('ProfileCtrl', ['$scope', '$rootScope', '$state', '$ionicPopup', '$translate', 'personManager', function($scope, $rootScope, $state, $ionicPopup, $translate, personManager) {
    var strings = {};
    
    $translate(['alert', 'edit_data', 'invalid_name', 'invalid_password_confirmation', 'success_update']).then(function (translations) {
        strings = translations;
    });

    var person = personManager.get();

    $scope.person = {name: person.nome};

    $scope.editProfile = function(form) {
        if ($scope.person.password !== $scope.person.confirm_password) {
            $ionicPopup.alert({
                title: strings.alert,
                template: strings.invalid_name
            });
        } else if ($scope.person.password !== $scope.person.confirm_password) {
            $ionicPopup.alert({
                title: strings.alert,
                template: strings.invalid_password_confirmation
            });
        } else {
            $scope.loading = true;

            var password = $scope.person.password;

            if (password == undefined) {
                password = person.password;
            }
            
            personManager.saveOnline(person.email, $scope.person.name, password).then(function(data) {
                $scope.loading = false;
                
                $ionicPopup.alert({
                    title: strings.alert,
                    template: strings.success_update
                });
            }, function(error) {
                $scope.loading = false;

                $ionicPopup.alert({
                    title: strings.alert,
                    template: error
                });
            });
        }
    };
}]);