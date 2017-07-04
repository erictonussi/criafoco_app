appServices.factory('Person', [function() {
    function Person(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    return Person;
}]);