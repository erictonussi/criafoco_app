appServices.factory('personManager', ['HttpClient', 'Person', '$q', 'localStorageService', 'ngFB', function(HttpClient, Person, $q, localStorageService, ngFB) {
    var personManager = {
        /**
         * Online authentication
         */
        authenticate: function(username, password, token) {
            var manager = this;
            
            var defer = $q.defer();

            var parameters = {email: username};

            if (token == undefined) {
                parameters.senha = password;
            } else {
                parameters.token = token;
            }

            HttpClient.post('access/verifica-usuario', parameters).then(function(person) {
                if (password != undefined) {
                    person.password = password;
                }
                
                if (manager.save(person)) {
                    defer.resolve(person);
                } else {
                    defer.reject('Authentication failed.');
                }
            }, function(error) {
                defer.reject(error);
            });

            return defer.promise;
        },

        /**
         * Online registration
         */
        register: function(tipo, data) {
            var manager = this;
            
            var defer = $q.defer();

            var parameters = {email: data.email, tipo: tipo};

            if (tipo == 'regular') {
                parameters.senha = data.password;
            } else if (tipo == 'facebook') {
                parameters.token = data.accessToken;
                parameters.foto = 'http://graph.facebook.com/' + data.id +'/picture?width=270&height=270';
                parameters.nome = data.name;
            }
            
            HttpClient.post('access/salva-usuario', parameters).then(function(person) {
                if (tipo == 'regular') {
                    person.password = data.password;
                }
                
                if (manager.save(person)) {
                    defer.resolve(person);
                } else {
                    defer.reject('Registration failed.');
                }
            }, function(error) {
                defer.reject(error);
            });

            return defer.promise;
        },

        /**
         * Save user
         */
        saveOnline: function(email, name, password) {
            var manager = this;
            
            var defer = $q.defer();

            var parameters = {email: email, nome: name, senha: password};

            var current = localStorageService.get('person');

            if (current.foto != undefined) {
                parameters.foto = current.foto;
            }

            if (current.tipo != undefined) {
                parameters.tipo = current.tipo;
            }

            HttpClient.post('access/salva-usuario', parameters).then(function(person) {
                if (manager.save(person)) {
                    defer.resolve(person);
                } else {
                    defer.reject('Failed');
                }
            }, function(error) {
                defer.reject(error);
            });

            return defer.promise;
        },

        /**
         * Login and get Facebook public profile
         */
        loginFacebook: function() {
            var defer = $q.defer();

            ngFB.login({ scope: 'email,public_profile' }).then(function(response) {
                if (response.status === 'connected') {
                    ngFB.api({
                        path: '/me',
                        params: { fields: 'id,name,email' }
                    }).then(function(user) {
                        user.accessToken = response.authResponse.accessToken;
                        
                        if (user.email == undefined || user.email.length == 0) {
                            user.email = user.id;
                        }
                        
                        defer.resolve(user);
                    }, function(error) {
                        defer.reject(error);
                    });
                } else {
                    defer.reject(response);
                }
            }, function(error) {
                defer.reject(error);
            });

            return defer.promise;
        },

        /**
         * Revoke Facebook permission
         */
        revokeFacebook: function() {
            var defer = $q.defer();

            ngFB.revokePermissions().then(function(response) {
                defer.resolve(response);
            }, function(error) {
                defer.reject(error);
            });

            return defer.promise;
        },

        /**
         * Logout from Facebook
         */
        logoutFacebook: function() {
            var defer = $q.defer();

            ngFB.logout().then(function(response) {
                defer.resolve(response);
            }, function(error) {
                defer.reject(error);
            });

            return defer.promise;
        },

        /**
         * Get connected person
         */
        get: function() {
            return localStorageService.get('person');
        },
        
        /**
         * Store person on database
         */
        save: function(person) {
            return localStorageService.set('person', person);
        },
        
        /**
         * Remove person from database
         */
        logout: function() {
            return localStorageService.remove('person', 'activeProject', 'defaultStimulus');
        }
    };

    return personManager;
}]);