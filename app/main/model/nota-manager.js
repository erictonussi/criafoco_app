'use strict';
angular.module('starter.services')
  .factory('notaManager', function (Nota, Criterio, $q, localStorageService, Config, database) {
    var notaManager = {
      /**
       * Get all notas from registro
       */
      getAll: function (registro) {
        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('SELECT n.*, c.descricao, , c.id_projeto ' +
              'FROM nota n ' +
              'INNER JOIN criterio c ON c.id = n.id_criterio ' +
              'WHERE n.id_registro = ?', [registro.id], function (resultSet) {

                var list = [];

                for (var i = 0; i < resultSet.rows.length; i++) {
                  var nota = new Nota(resultSet.rows.item(i).id, resultSet.rows.item(i).id_criterio, resultSet.rows.item(i).id_registro, resultSet.rows.item(i).valor);

                  nota.criterio = new Criterio(resultSet.rows.item(i).id_criterio, resultSet.rows.item(i).id_projeto, resultSet.rows.item(i).descricao);

                  list.push(nota);
                }

                defer.resolve(list);
              }, defer.reject);
          });
        } else {
          var notas = localStorageService.get('nota');

          var list = [];

          if (notas) {
            var filtered = notas.filter(function (x) {
              return x.registro === registro.id;
            });

            filtered.forEach(function (element) {
              var nota = new Nota(element.id, element.criterio, element.registro, element.valor);

              nota.criterio = localStorageService.get('criterio').find(function (x) {
                return x.id === element.criterio;
              });

              list.push(nota);
            });
          }

          defer.resolve(list);
        }

        return defer.promise;
      },

      /**
       * Save nota
       */
      save: function (nota) {
        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('UPDATE nota SET valor = ? WHERE id = ?', [nota.valor, nota.id], defer.resolve, defer.reject);
          });
        } else {
          var list = localStorageService.get('nota');

          var index = list.findIndex(function (x) {
            return x.id === nota.id && x.registro === nota.registro;
          });

          if (index > -1) {
            list[index] = new Nota(nota.id, nota.criterio.id, nota.registro, parseInt(nota.valor));
          }

          localStorageService.set('nota', list);

          defer.resolve();
        }

        return defer.promise;
      }
    };

    return notaManager;
  });
