appServices.factory('Criterio', [function() {
    function Criterio(id, projeto, descricao) {
        this.id = id;
        this.projeto = projeto;
        this.descricao = descricao;
    }

    return Criterio;
}]);