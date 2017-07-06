'use strict';
angular.module('starter.services')
  .factory('criterioManager', function (Criterio, Nota, $q, localStorageService, database, Config) {
    var criterioManager = {
      /**
       * Get criterio from projeto
       */
      getAll: function (projeto) {
        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('SELECT * FROM criterio WHERE id_projeto IS NULL OR id_projeto = ?', [projeto.id], function (resultSet) {
              var list = [];

              for (var i = 0; i < resultSet.rows.length; i++) {
                var criterio = new Criterio(resultSet.rows.item(i).id, resultSet.rows.item(i).id_projeto, resultSet.rows.item(i).descricao);
                list.push(criterio);
              }

              defer.resolve(list);
            }, defer.reject);
          });
        } else {
          var list = localStorageService.get('criterio').filter(function (x) {
            return x.projeto === projeto.id || !x.projeto;
          });

          if (!list) {
            list = [];
          }

          defer.resolve(list);
        }

        return defer.promise;
      },

      /**
       * Get criterio by id
       */
      getById: function (id) {
        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('SELECT * FROM criterio WHERE id = ?', [id], function (resultSet) {
              var criterio = null;

              if (resultSet.rows.length === 1) {
                criterio = new Criterio(resultSet.rows.item(0).id, resultSet.rows.item(0).descricao);
              }

              defer.resolve(criterio);
            }, defer.reject);
          });
        } else {
          var criterio = localStorageService.get('criterio').find(function (x) {
            return x.id === id;
          });
          defer.resolve(criterio);
        }

        return defer.promise;
      },

      /**
       * Add new criterio
       */
      add: function (projeto, descricao) {
        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('INSERT INTO criterio (id_projeto, descricao) VALUES (?, ?)', [projeto.id, descricao], function (/*resultSet*/) {
              database.executeSql('SELECT MAX(id) AS id FROM criterio', [], function (resultSet) {
                if (resultSet.rows.length > 0) {
                  defer.resolve(resultSet.rows.item(0).id);
                }
              }, defer.reject);
            }, defer.reject);
          });
        } else {
          var manager = this;

          var list = localStorageService.get('criterio');

          if (!list) {
            list = [];
          }

          var criterio = new Criterio(manager.getNextId(), projeto.id, descricao);

          list.push(criterio);

          localStorageService.set('criterio', list);

          defer.resolve(criterio.id);
        }

        return defer.promise;
      },

      /**
       * Join selected criterios and registros
       */
      joinCriteriosRegistros: function (criterios, registros) {
        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            criterios.forEach(function (criterio) {
              registros.forEach(function (registro) {
                database.executeSql('INSERT INTO nota (id_criterio, id_registro, valor) VALUES (?, ?, ?)', [criterio.id, registro.id, -1]);
              });
            });

            defer.resolve();
          });
        } else {
          var manager = this;

          var list = localStorageService.get('nota');

          if (!list) {
            list = [];
          }

          var nextId = manager.getNextId();

          criterios.forEach(function (criterio) {
            registros.forEach(function (registro) {
              var nota = new Nota(nextId, criterio.id, registro.id, -1);

              list.push(nota);

              nextId += 1;
            });
          });

          localStorageService.set('nota', list);

          defer.resolve();
        }

        return defer.promise;
      },

      /**
       * Remove criterio
       */
      remove: function (criterio) {
        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('DELETE FROM criterio WHERE id = ?', [criterio.id], defer.resolve, defer.reject);
          });
        } else {
          var notas = localStorageService.get('nota');

          if (notas) {
            var update = [];

            notas.forEach(function (nota) {
              if (nota.id_criterio !== criterio.id) {
                update.push(nota);
              }
            });

            localStorageService.set('nota', update);
          }

          var criterios = localStorageService.get('criterio');

          var index = criterios.findIndex(function (x) {
            return x.id === criterio.id;
          });

          if (index > -1) {
            criterios.splice(index, 1);
          }

          localStorageService.set('criterio', criterios);

          defer.resolve();
        }

        return defer.promise;
      },

      /**
       * Get next ID to add
       */
      getNextId: function () {
        var lastId = 0;

        var all = localStorageService.get('criterio');

        if (all && all.length > 0) {
          lastId = all[all.length - 1].id;
        }

        return lastId + 1;
      },

      /**
       * Initial values of criterio
       */
      install: function () {
        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('INSERT INTO criterio (descricao) VALUES (?)', ['Tempo']);
            database.executeSql('INSERT INTO criterio (descricao) VALUES (?)', ['Investimento']);
            database.executeSql('INSERT INTO criterio (descricao) VALUES (?)', ['Alcance']);
            database.executeSql('INSERT INTO criterio (descricao) VALUES (?)', ['Relevância']);
          });
        } else {
          var tempo = new Criterio(1, null, 'Tempo');
          var investimento = new Criterio(2, null, 'Investimento');
          var alcance = new Criterio(3, null, 'Alcance');
          var relevancia = new Criterio(4, null, 'Relevância');

          var list = [tempo, investimento, alcance, relevancia];

          localStorageService.set('criterio', list);
        }
      }
    };

    return criterioManager;
  });
