appServices.factory('Projeto', [function() {
    function Projeto(id, usuario, pai, foco, fase, etapa, inicio, fim) {
        this.id = id;
        this.usuario = usuario;
        this.pai = pai;
        this.foco = foco;
        this.fase = fase;
        this.etapa = etapa;
        this.inicio = inicio;
        this.fim = fim;
    }

    return Projeto;
}]);