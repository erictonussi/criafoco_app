'use strict';
document.addEventListener('deviceready', function () {
  angular.bootstrap(document, ['criafoco']);
}, false);
angular.module('criafoco', [
  // load your modules here
  'ngCordova',
  // 'ngCordovaMocks',
  'starter', // starting with the main module
]);
