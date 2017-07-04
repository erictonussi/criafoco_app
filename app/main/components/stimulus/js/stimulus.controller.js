appControllers.controller('StimulusCtrl', ['$scope', '$rootScope', '$interval', 'HttpClient', function($scope, $rootScope, $interval, HttpClient) {
    $scope.loading = true;

    var promisseStimulus;

    HttpClient.post('insight/get-insight', {fase: $scope.stimulusType, projeto: $rootScope.projeto.id}).then(function(data) {
        $scope.loading = false;

        $scope.question = data.pergunta;
        $scope.image = Constants.webservice.root + data.imagem;

        promisseStimulus = $interval(closeStimulus, 8000);
    }, function(error) {
        $scope.loading = false;
    });

    var closeStimulus = function() {
        $interval.cancel(promisseStimulus);
        
        promisseStimulus = undefined;

        $scope.stimulusModal.hide();
    };

    $scope.closeStimulus = closeStimulus;
}]);