'use strict';
angular.module('starter.services')
  .factory('tipoRegistroManager', function (TipoRegistro, $q, localStorageService, Config, database) {
    var tipoRegistroManager = {
      /**
       * Get tipo registro by flag
       */
      getByFlag: function (flag) {

        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('SELECT * FROM tipo_registro WHERE flag = ?', [flag], function (resultSet) {
              var tipoRegistro = null;

              if (resultSet.rows.length === 1) {
                tipoRegistro = new TipoRegistro(resultSet.rows.item(0).id, resultSet.rows.item(0).flag);
              }

              defer.resolve(tipoRegistro);
            }, defer.reject);
          });
        } else {
          var tipoRegistro = localStorageService.get('tipo_registro').find(function (x) {
            return x.flag === flag;
          });
          defer.resolve(tipoRegistro);
        }

        return defer.promise;
      },

      /**
       * Initial values of tipo registro
       */
      install: function () {
        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('INSERT INTO tipo_registro (flag) VALUES (?)', ['worry']);
            database.executeSql('INSERT INTO tipo_registro (flag) VALUES (?)', ['fact']);
            database.executeSql('INSERT INTO tipo_registro (flag) VALUES (?)', ['note']);
            database.executeSql('INSERT INTO tipo_registro (flag) VALUES (?)', ['creation']);
            database.executeSql('INSERT INTO tipo_registro (flag) VALUES (?)', ['usage']);
            database.executeSql('INSERT INTO tipo_registro (flag) VALUES (?)', ['script']);
          });
        } else {
          var worry = new TipoRegistro(1, 'worry');
          var fact = new TipoRegistro(2, 'fact');
          var note = new TipoRegistro(3, 'note');
          var creation = new TipoRegistro(4, 'creation');
          var usage = new TipoRegistro(5, 'usage');
          var script = new TipoRegistro(6, 'script');

          var list = [worry, fact, note, creation, usage, script];

          localStorageService.set('tipo_registro', list);
        }
      }
    };

    return tipoRegistroManager;
  });
