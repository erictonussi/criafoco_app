appServices.factory('Nota', [function() {
    function Nota(id, criterio, registro, valor) {
        this.id = id;
        this.criterio = criterio;
        this.registro = registro;
        this.valor = valor;
    }

    return Nota;
}]);