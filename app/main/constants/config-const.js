'use strict';
angular.module('starter')
.constant('Config', {

  // gulp environment: injects environment vars
  ENV: {
    /*inject-env*/
    'startPage': {
      'url': '/',
      'state': 'welcome'
    },
    'webservice': {
      'root': '',
      'url': 'criafoco-services/',
      'auth': 'YXBpdXNlcjphcGlwYXNz'
    },
    'facebook': {
      'appId-': '1299266256819488',
      'appId': '104219843035003'
    },
    'languages': {
      'default': 'pt-BR',
      'available': [
        'pt-BR',
        'en-US'
      ]
    },
    'dataSource': 'localStorage',
    'minRecords': 2,
    'person': {
      'username': 'criafoco@tonussi.com',
      'password': '123123'
    },
    'debug': true
    /*endinject*/
  },

  // gulp build-vars: injects build vars
  BUILD: {
    /*inject-build*/
    /*endinject*/
  }

});
