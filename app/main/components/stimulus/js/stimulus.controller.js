'use strict';
angular.module('starter.controllers')
  .controller('StimulusCtrl', function ($scope, $rootScope, $interval, HttpClient, Config) {
    $scope.loading = true;

    var promisseStimulus;

    HttpClient.post('insight/get-insight', {fase: $scope.stimulusType, projeto: $rootScope.projeto.id}).then(function (data) {
      $scope.loading = false;

      $scope.question = data.pergunta;
      $scope.image = Config.ENV.webservice.root + data.imagem;

      promisseStimulus = $interval(closeStimulus, 8000);
    }, function (/*error*/) {
      $scope.loading = false;
    });

    function closeStimulus () {
      $interval.cancel(promisseStimulus);

      promisseStimulus = undefined;

      $scope.stimulusModal.hide();
    }

    $scope.closeStimulus = closeStimulus;
  });
