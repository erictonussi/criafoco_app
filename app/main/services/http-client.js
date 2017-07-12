'use strict';
angular.module('starter.services')
  .factory('HttpClient', function ($http, $q, localStorageService, Config) {
    function request (method, destination, parameters) {
      var defer = $q.defer();

      var strAuth = Config.ENV.webservice.auth;

      var person = localStorageService.get('person');

      if (person && destination.indexOf('salva-usuario') === -1) {
        if (person.password) {
          strAuth = btoa(person.email + ':' + person.password);
        } else {
          strAuth = btoa(person.email + ':' + person.token);
        }
      }

      $http({
        method: method,
        url: Config.ENV.webservice.url + destination,
        data: !parameters ? null : angular.toJson(parameters),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + strAuth
        }
      }).then(function (response) {
        if (response.status >= 200 && response.status < 300) {
          var result = response.data;

          if (result.success) {
            defer.resolve(result.data);
          } else {
            defer.reject(result.message);
          }
        } else {
          defer.reject(response.statusText);
        }
      }, function (response) {
        defer.reject(response.statusText);
      });

      return defer.promise;
    }

    return {
      get: function (destination) {
        return request('GET', destination);
      },
      post: function (destination, parameters) {
        return request('POST', destination, parameters);
      },
      put: function (destination, parameters) {
        return request('PUT', destination, parameters);
      },
      delete: function (destination) {
        return request('DELETE', destination);
      }
    };
  });
