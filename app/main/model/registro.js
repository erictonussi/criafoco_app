appServices.factory('Registro', [function() {
    function Registro(id, projeto, tipo, descricao, avaliacao, ob_op, descarte) {
        this.id = id;
        this.projeto = projeto;
        this.tipo = tipo;
        this.descricao = descricao;
        this.avaliacao = avaliacao;
        this.ob_op = ob_op;
        this.descarte = descarte;
    }

    return Registro;
}]);