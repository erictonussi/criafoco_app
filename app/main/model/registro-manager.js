'use strict';
angular.module('starter.services')
  .factory('registroManager', function (Registro, $q, localStorageService, Config, database) {
    var registroManager = {

      /**
       * Get all registro by tipo without criterio
       */
      getAll: function (projeto, tipo, descarte) {
        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('SELECT * ' +
              'FROM registro ' +
              'WHERE id_tipo_registro = ? ' +
              'AND id_projeto = ?' +
              'AND descarte = ?' +
              'ORDER BY avaliacao DESC, id ASC', [tipo.id, projeto.id, descarte], function (resultSet) {

                var list = [];

                for (var i = 0; i < resultSet.rows.length; i++) {
                  var registro = new Registro(resultSet.rows.item(i).id, resultSet.rows.item(i).id_projeto, resultSet.rows.item(i).id_tipo_registro, resultSet.rows.item(i).descricao, resultSet.rows.item(i).avaliacao, resultSet.rows.item(i).ob_op, resultSet.rows.item(i).descarte);
                  list.push(registro);
                }

                defer.resolve(list);
              }, defer.reject);
          });
        } else {
          var list = localStorageService.get('registro');

          if (!list) {
            list = [];
          } else {
            list = list.filter(function (x) {
              return x.projeto === projeto.id && x.tipo === tipo.id && x.descarte === descarte;
            });
          }

          list.sort(function (a, b) {
            if (a.avaliacao === b.avaliacao) {
              return a.id - b.id;
            } else {
              return b.avaliacao - a.avaliacao;
            }
          });

          defer.resolve(list);
        }

        return defer.promise;
      },

      /**
       * Get all registro by tipo with criterio
       */
      getAllWithCriterio: function (projeto, tipo) {
        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('SELECT r.*, COUNT(n.valor) AS quantidade, SUM(n.valor) AS soma ' +
              'FROM registro r ' +
              'INNER JOIN nota n ON r.id = n.id_registro ' +
              'INNER JOIN projeto p ON r.id_projeto = p.id ' +
              'WHERE n.valor > -1 ' +
              'AND r.id_tipo_registro = ? ' +
              'AND p.id = ?' +
              'GROUP BY r.id, r.id_projeto, r.id_tipo_registro, r.descricao, r.avaliacao, r.ob_op ' +
              'ORDER BY soma DESC, r.id ASC', [tipo.id, projeto.id], function (resultSet) {

                var list = [];

                for (var i = 0; i < resultSet.rows.length; i++) {
                  var registro = new Registro(resultSet.rows.item(i).id, resultSet.rows.item(i).id_projeto, resultSet.rows.item(i).id_tipo_registro, resultSet.rows.item(i).descricao, resultSet.rows.item(i).avaliacao, resultSet.rows.item(i).ob_op, resultSet.rows.item(i).descarte);

                  registro.quantidade = resultSet.rows.item(i).quantidade;
                  registro.soma = resultSet.rows.item(i).soma;

                  if (registro.soma > registro.quantidade) {
                    registro.media = resultSet.rows.item(i).soma / resultSet.rows.item(i).quantidade;
                  } else {
                    registro.media = 0;
                  }

                  list.push(registro);
                }

                defer.resolve(list);
              }, defer.reject);
          });
        } else {
          var list = localStorageService.get('registro');

          if (!list) {
            list = [];
          } else {
            list = list.filter(function (x) {
              return x.projeto === projeto.id && x.tipo === tipo.id;
            });
          }

          var allNotas = localStorageService.get('nota');

          if (!allNotas) {
            allNotas = [];
          }

          list.forEach(function (registro, index) {
            var notas = allNotas.filter(function (x) {
              return x.registro === registro.id;
            });

            var soma = 0;//-3;
            var quantidade = 0;

            registro.vote = false;

            notas.forEach(function (nota) {
              quantidade += 1;

              if (nota.valor > -1) {
                soma += nota.valor;

                if (!registro.vote) {
                  registro.vote = true;
                }
              }
            });

            if (soma === -3) {
              soma = 0;
            }

            registro.quantidade = quantidade;
            registro.soma = soma;

            if (soma > quantidade) {
              registro.media = soma / quantidade;
            } else {
              registro.media = 0;
            }

            list[index] = registro;
          });

          list.sort(function (a, b) {
            if (a.soma === b.soma) {
              return a.id - b.id;
            } else {
              return b.soma - a.soma;
            }
          });

          defer.resolve(list);
        }

        return defer.promise;
      },

      /**
       * Add new registro
       */
      add: function (descricao, projeto, tipo) {
        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('INSERT INTO registro (id_projeto, id_tipo_registro, descricao, avaliacao, descarte) VALUES (?, ?, ?, ?, ?)', [projeto.id, tipo.id, descricao, -1, false], function (/*resultSet*/) {
              database.executeSql('SELECT MAX(id) AS id FROM registro', [], function (resultSet) {
                if (resultSet.rows.length > 0) {
                  defer.resolve(resultSet.rows.item(0).id);
                }
              }, defer.reject);
            }, defer.reject);
          });
        } else {
          var manager = this;

          var list = localStorageService.get('registro');

          if (!list) {
            list = [];
          }

          var registro = new Registro(manager.getNextId(), projeto.id, tipo.id, descricao, -1, null, false);

          list.push(registro);

          localStorageService.set('registro', list);

          defer.resolve(registro.id);
        }

        return defer.promise;
      },

      /**
       * Copy registros to next tipo
       */
      copy: function (registros) {
        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            registros.forEach(function (registro) {
              database.executeSql('INSERT INTO registro (id_projeto, id_tipo_registro, descricao, avaliacao, descarte) VALUES (?, ?, ?, ?, ?)', [registro.projeto, registro.tipo + 1, registro.descricao, -1, false]);
            });

            defer.resolve();
          });
        } else {
          var manager = this;

          var list = localStorageService.get('registro');

          var nextId = manager.getNextId();

          registros.forEach(function (registro) {
            var item = new Registro(nextId, registro.projeto, registro.tipo + 1, registro.descricao, -1, null, false);

            list.push(item);

            nextId += 1;
          });

          localStorageService.set('registro', list);

          defer.resolve();
        }

        return defer.promise;
      },

      /**
       * Save registro
       */
      save: function (registro) {
        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('UPDATE registro SET descricao = ?, avaliacao = ?, ob_op = ?, descarte = ? WHERE id = ?', [registro.descricao, registro.avaliacao, registro.ob_op, registro.id, registro.descarte], defer.resolve, defer.reject);
          });
        } else {
          var list = localStorageService.get('registro');

          var index = list.findIndex(function (x) {
            return x.id === registro.id;
          });

          if (index > -1) {
            list[index] = new Registro(registro.id, registro.projeto, registro.tipo, registro.descricao, parseInt(registro.avaliacao), registro.ob_op, registro.descarte);
          }

          localStorageService.set('registro', list);

          defer.resolve();
        }

        return defer.promise;
      },

      /**
       * Remove registro
       */
      remove: function (registro) {
        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('DELETE FROM registro WHERE id = ?', [registro.id], defer.resolve, defer.reject);
          });
        } else {
          var list = localStorageService.get('registro');

          var index = list.findIndex(function (x) {
            return x.id === registro.id;
          });

          if (index > -1) {
            list.splice(index, 1);
          }

          localStorageService.set('registro', list);

          var notas = localStorageService.get('nota');

          if (notas) {
            var update = notas.filter(function (x) {
              return x.registro !== registro.id;
            });
            localStorageService.set('nota', update);
          }

          defer.resolve();
        }

        return defer.promise;
      },

      /**
       * Reset notas
       */
      reset: function (projeto, tipo) {
        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('UPDATE registro SET avaliacao = ?, ob_op = ?, descarte = ? WHERE id_projeto = ? AND id_tipo_registro = ?', [-1, 0, false, projeto.id, tipo.id]);
            database.executeSql('DELETE FROM registro WHERE id_projeto = ? AND id_tipo_registro > ?', [projeto.id, tipo.id]);
            database.executeSql('DELETE FROM notas WHERE id_registro IN (SELECT id FROM registro WHERE id_projeto = ? AND id_tipo_registro >= ?)', [projeto.id, tipo.id]);

            defer.resolve();
          });
        } else {
          var registros = localStorageService.get('registro');

          var updateRegistros = [];
          var removeRegistros = [];

          registros.forEach(function (registro) {
            if (registro.projeto === projeto.id) {
              if (registro.tipo === tipo.id) {
                registro.avaliacao = -1;
                registro['ob_op'] = 0;
                registro.descarte = false;

                updateRegistros.push(registro);
              } else if (registro.tipo < tipo.id) {
                updateRegistros.push(registro);
              } else {
                removeRegistros.push(registro);
              }
            } else {
              updateRegistros.push(registro);
            }
          });

          localStorageService.set('registro', updateRegistros);

          var notas = localStorageService.get('nota');

          if (notas && notas.length > 0) {
            var updateNotas = [];

            notas.forEach(function (nota) {
              var index = removeRegistros.findIndex(function (x) {
                return x.id === nota.registro;
              });

              if (index === -1) {
                updateNotas.push(nota);
              }
            });

            localStorageService.set('nota', updateNotas);
          }

          defer.resolve();
        }

        return defer.promise;
      },

      /**
       * Get next ID to add
       */
      getNextId: function () {
        var lastId = 0;

        var all = localStorageService.get('registro');

        if (all && all.length > 0) {
          lastId = all[all.length - 1].id;
        }

        return lastId + 1;
      }
    };

    return registroManager;
  });
