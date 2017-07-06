'use strict';
angular.module('starter.services')
  .factory('projetoManager', function (Projeto, $q, localStorageService, Config, database) {
    var projetoManager = {
      /**
       * Get all projeto
       */
      getAll: function () {
        var person = localStorageService.get('person');

        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('SELECT * FROM projeto WHERE id_usuario = ?', [person.id], function (resultSet) {
              var list = [];

              for (var i = 0; i < resultSet.rows.length; i++) {
                var projeto = new Projeto(resultSet.rows.item(0).id, resultSet.rows.item(0).id_usuario, resultSet.rows.item(0).id_projeto_pai, resultSet.rows.item(0).foco, resultSet.rows.item(0).fase, resultSet.rows.item(0).etapa, resultSet.rows.item(0).inicio, resultSet.rows.item(0).fim);
                list.push(projeto);
              }

              defer.resolve(list);
            }, defer.reject);
          });
        } else {
          var list = localStorageService.get('projeto').filter(function (x) {
            return x.usuario === person.id;
          });

          if (list === undefined) {
            list = [];
          }

          defer.resolve(list);
        }

        return defer.promise;
      },

      /**
       * Get active projeto
       */
      getActive: function () {
        var person = localStorageService.get('person');

        var defer = $q.defer();

        var activeId = localStorageService.get('activeProject');

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            var projeto = null;

            if (activeId !== undefined) {
              database.executeSql('SELECT * FROM projeto WHERE id_usuario = ? AND id = ? LIMIT 1', [person.id, activeId], function (resultSet) {
                if (resultSet.rows.length === 1) {
                  projeto = new Projeto(resultSet.rows.item(0).id, resultSet.rows.item(0).id_usuario, resultSet.rows.item(0).id_projeto_pai, resultSet.rows.item(0).foco, resultSet.rows.item(0).fase, resultSet.rows.item(0).etapa, resultSet.rows.item(0).inicio, resultSet.rows.item(0).fim);
                }

                defer.resolve(projeto);
              }, defer.reject);
            } else {
              database.executeSql('SELECT * FROM projeto WHERE id_usuario = ? ORDER BY id DESC LIMIT 1', [person.id], function (resultSet) {
                if (resultSet.rows.length === 1) {
                  projeto = new Projeto(resultSet.rows.item(0).id, resultSet.rows.item(0).id_usuario, resultSet.rows.item(0).id_projeto_pai, resultSet.rows.item(0).foco, resultSet.rows.item(0).fase, resultSet.rows.item(0).etapa, resultSet.rows.item(0).inicio, resultSet.rows.item(0).fim);
                  localStorageService.set('activeProject', resultSet.rows.item(0).id);
                }

                defer.resolve(projeto);
              }, defer.reject);
            }
          });
        } else {
          var list = localStorageService.get('projeto');

          var projeto = null;

          if (list !== undefined) {
            if (activeId !== undefined) {
              projeto = list.find(function (x) {
                return x.id === activeId && x.usuario === person.id;
              });
            } else {
              var projetos = list.filter(function (x) {
                return x.usuario === person.id;
              });

              if (projetos !== undefined && projetos.length > 0) {
                projeto = projetos[projetos.length - 1];
                localStorageService.set('activeProject', projeto.id);
              }
            }
          }

          defer.resolve(projeto);
        }

        return defer.promise;
      },

      /**
       * Add new projeto
       */
      add: function (foco, etapa) {
        var person = localStorageService.get('person');

        var defer = $q.defer();

        var fase = foco ? 'fact' : 'worry';

        if (etapa === null) {
          etapa = '*';
        }

        var now = new Date();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('INSERT INTO projeto (id_usuario, foco, fase, etapa, inicio) VALUES (?, ?, ?, ?, ?)', [person.id, foco, fase, etapa, now], function (/*response*/) {
              database.executeSql('SELECT * FROM projeto ORDER BY id DESC LIMIT 1', [], function (resultSet) {
                var projeto = null;

                if (resultSet.rows.length === 1) {
                  projeto = new Projeto(resultSet.rows.item(0).id, resultSet.rows.item(0).id_usuario, resultSet.rows.item(0).id_projeto_pai, resultSet.rows.item(0).foco, resultSet.rows.item(0).fase, resultSet.rows.item(0).etapa, resultSet.rows.item(0).inicio, resultSet.rows.item(0).fim);
                  localStorageService.set('activeProject', resultSet.rows.item(0).id);
                }

                defer.resolve(projeto);
              }, defer.reject);
            }, defer.reject);
          });
        } else {
          var manager = this;

          var list = localStorageService.get('projeto');

          if (list === undefined) {
            list = [];
          }

          var projeto = new Projeto(manager.getNextId(), person.id, null, foco, fase, etapa, now, null);

          list.push(projeto);

          localStorageService.set('projeto', list);
          localStorageService.set('activeProject', projeto.id);

          defer.resolve(projeto);
        }

        return defer.promise;
      },

      /**
       * Update projeto
       */
      save: function (projeto) {
        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('UPDATE projeto SET foco = ?, fase = ? WHERE id_usuario = ? AND id = ?', [projeto.foco, projeto.fase, projeto.usuario, projeto.id], defer.resolve, defer.reject);
          });
        } else {
          var list = localStorageService.get('projeto');

          var index = list.findIndex(function (x) {
            return x.id === projeto.id && x.usuario === projeto.usuario;
          });

          if (index > -1) {
            list[index] = new Projeto(projeto.id, projeto.usuario, projeto.pai, projeto.foco, projeto.fase, projeto.etapa, projeto.inicio, projeto.fim);
          }

          localStorageService.set('projeto', list);

          defer.resolve();
        }

        return defer.promise;
      },

      /**
       * Finish projeto
       */
      finish: function (projeto) {
        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('UPDATE projeto SET fim = ? WHERE id_usuario = ? AND id = ?', [projeto.fim, projeto.usuario, projeto.id], defer.resolve, defer.reject);
          });
        } else {
          var list = localStorageService.get('projeto');

          var index = list.findIndex(function (x) {
            return x.id === projeto.id && x.usuario === projeto.usuario;
          });

          if (index > -1) {
            var update = list[index];

            update.fim = projeto.fim;

            list[index] = update;
          }

          localStorageService.set('projeto', list);

          defer.resolve();
        }

        return defer.promise;
      },

      /**
       * Remove projeto
       */
      remove: function (projeto) {
        var defer = $q.defer();

        if (Config.ENV.dataSource === 'sqlite') {
          database.dbLoaded.then(function () {
            database.executeSql('DELETE projeto WHERE id_usuario = ? AND id = ?', [projeto.usuario, projeto.id], defer.resolve, defer.reject);
          });
        } else {
          var list = localStorageService.get('projeto');

          var index = list.findIndex(function (x) {
            return x.id === projeto.id && x.usuario === projeto.usuario;
          });

          if (index > -1) {
            list.splice(index, 1);
          }

          localStorageService.set('projeto', list);

          var registros = localStorageService.get('registro');

          var updateRegistros = [];
          var removeRegistros = [];

          registros.forEach(function (registro) {
            if (registro.projeto === projeto.id) {
              removeRegistros.push(registro);
            } else {
              updateRegistros.push(registro);
            }
          });

          localStorageService.set('registro', updateRegistros);

          var notas = localStorageService.get('nota');

          if (notas !== undefined && notas.length > 0) {
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

        localStorageService.remove('activeProject');

        return defer.promise;
      },

      /**
       * Get next ID to add
       */
      getNextId: function () {
        var lastId = 0;

        var all = localStorageService.get('projeto');

        if (all !== undefined && all.length > 0) {
          lastId = all[all.length - 1].id;
        }

        return lastId + 1;
      }
    };

    return projetoManager;
  });
