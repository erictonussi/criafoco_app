'use strict';
angular.module('starter')
  .directive('powerange', function () {
    return {
      restrict: 'E',
      scope: {
        value: '=ngModel'
      },
      // template: '<div class="slider-wrapper"><input type="text" class="js-customized" ng-model="value" /></div>',
      template: '<input type="text" ng-model="value" />',
      link: function (scope, element) {
        // var cust = document.querySelector('.js-customized');
        /* global Powerange*/
        new Powerange(element.children()[0], { min: 0, max: 10, hideRange: true, start: scope.value });
      }
    };
  });
