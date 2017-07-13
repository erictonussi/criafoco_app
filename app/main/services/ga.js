'use strict';
angular.module('starter.services')
  .factory('ga', function ($window, $q, $log) {

    if ($window.ga) {
      return $window.ga;
    }

    var throwsError = false;
    var methods = {};

    /**
     * @ngdoc property
     * @name throwsError
     * @propertyOf ngCordovaMocks.cordovaGeolocation
     *
     * @description
     * A flag that signals whether a promise should be rejected or not.
     * This property should only be used in automated tests.
     **/
    methods.throwsError = throwsError;

    var methodsName = [
      'addCustomDimension',
      'addTransaction',
      'addTransactionItem',
      'debugMode',
      'dispatch',
      'enableUncaughtExceptionReporting',
      'getVar',
      'setAllowIDFACollection',
      'setAnonymizeIp',
      'setAppVersion',
      'setOptOut',
      'setUserId',
      'setVar',
      'startTrackerWithId',
      'trackEvent',
      'trackException',
      'trackMetric',
      'trackTiming',
      'trackView',
    ];

    methodsName.forEach(function (funcName) {
      methods[funcName] = function () {

        $log.log('funcName: ' + arguments);

        var defer = $q.defer();

        (this.throwsError) ?
          defer.reject() :
          defer.resolve();

        return defer.promise;
      };
    });

    return methods;

  });
