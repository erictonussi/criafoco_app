appServices.factory('TipoRegistro', [function() {
    function TipoRegistro(id, flag) {
        this.id = id;
        this.flag = flag;
    }
    
    return TipoRegistro;
}]);