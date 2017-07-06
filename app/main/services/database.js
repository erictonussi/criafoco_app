'use strict';
angular.module('starter.services')
  .factory('database', function ($ionicPlatform, Config, $q) {

    var vm = this || {};
    // var database, dbLoaded;
    vm.migrations = [];

    $ionicPlatform.ready(onDeviceReady);

    // document.addEventListener('deviceready', onDeviceReady, false);

    function onDeviceReady () {
      if (Config.ENV.dataSource === 'localStorage') {
        return;
      }

      window.sqlitePlugin.openDatabase({name: 'criafoco.db', location: 'default'}, function (db) {
        vm.database = db;
        seedDatabase();
      }, function (/*error*/) {
        // console.log('Open database ERROR: ' + error.message);
      });
    }

    function seedDatabase () {
      // $q = angular.injector(["ng"]).get("$q");

      var defer = $q.defer();

      vm.dbLoaded = defer.promise;

      var initSql = [
        'PRAGMA foreign_keys = ON',
        'CREATE TABLE IF NOT EXISTS projeto (id INTEGER, id_usuario INTEGER NULL, id_projeto_pai INTEGER NULL, foco TEXT NULL, fase TEXT NOT NULL, etapa TEXT NOT NULL, inicio TEXT NOT NULL, fim TEXT NULL, UNIQUE(id, id_usuario) ON CONFLICT ABORT, PRIMARY KEY(id), FOREIGN KEY(id_projeto_pai) REFERENCES projeto(id))',
        'CREATE TABLE IF NOT EXISTS tipo_registro (id INTEGER, flag TEXT NOT NULL, UNIQUE(flag) ON CONFLICT REPLACE, PRIMARY KEY(id))',
        'CREATE TABLE IF NOT EXISTS criterio (id INTEGER, id_projeto INTEGER NULL, descricao TEXT NOT NULL, UNIQUE(id_projeto, descricao) ON CONFLICT REPLACE, PRIMARY KEY(id), FOREIGN KEY(id_projeto) REFERENCES projeto(id))',
        'CREATE TABLE IF NOT EXISTS registro (id INTEGER, id_projeto INTEGER NOT NULL, id_tipo_registro INTEGER NOT NULL, descricao TEXT, avaliacao INTEGER NOT NULL, ob_op INTEGER NULL, descarte INTEGER NOT NULL, PRIMARY KEY(id), FOREIGN KEY(id_projeto) REFERENCES projeto(id), FOREIGN KEY(id_tipo_registro) REFERENCES tipo_registro(id))',
        'CREATE TABLE IF NOT EXISTS nota (id INTEGER, id_criterio INTEGER NOT NULL, id_registro INTEGER NULL, valor INTEGER NOT NULL, UNIQUE(id_criterio, id_registro) ON CONFLICT REPLACE, PRIMARY KEY(id), FOREIGN KEY(id_criterio) REFERENCES criterio(id), FOREIGN KEY(id_registro) REFERENCES registro(id))'
      ];

      vm.database.transaction(function (trans) {
        initSql.forEach(function (query) {
          trans.executeSql(query);
        });

        trans.executeSql('PRAGMA user_version', function (t, res) {
          var version = res.rows.item(0).user_version;
          kickOffMigration(version, trans);
        });
      }, function (/*error*/) {
        // console.log('Transaction ERROR: ' + error.message);
      }, function () {
        defer.resolve();
      });
    }

    function kickOffMigration (version, trans) {
      if (vm.migrations[version] && typeof vm.migrations[version] === 'function') {
        vm.migrations[version](trans);
      }
    }

    vm.executeSql = function () {
      return vm.database.executeSql(arguments);
    };

    // var migrations = [];

    /*migrations[0] = function (transaction) {
      var nextVersion = 1;

      transaction.executeSql('PRAGMA user_version = ' + nextVersion);

      kickOffMigration(nextVersion, transaction);
    };*/

    return vm;
  });
