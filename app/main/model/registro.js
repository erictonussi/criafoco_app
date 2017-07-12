'use strict';
angular.module('starter.services')
  .factory('Registro', function () {
    function Registro (id, projeto, tipo, descricao, avaliacao, obOp, descarte) {
      this.id = id;
      this.projeto = projeto;
      this.tipo = tipo;
      this.descricao = descricao;
      this.avaliacao = avaliacao;
      this['ob_op'] = obOp;
      this.descarte = descarte;
    }

    return Registro;
  });
