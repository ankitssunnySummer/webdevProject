/**Created by Ankit on 10/13/2016.*/
(function() {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);
    function UserService($http) {
        var api = {
            createUser            : createUser,
            findUserById          : findUserById,
            findUserByUsername    : findUserByUsername,
            findUserByCredentials : findUserByCredentials,
            updateUser            : updateUser,
            deleteUser            : deleteUser,
            login                 : login,
            logout                : logout,
            register              : register
        }
        return api;

        function login(user) {
            return $http.post("/api/login", user);
        }

        function logout(user) {
            return $http.post("/api/logout");
        }

        function register(user) {
            return $http.post("/api/register", user);
        }

        function createUser(user) {
            return $http.post('/api/user', user);
        }

        function findUserById(id) {
            return $http.get('/api/user/' + id);
        }

        function findUserByUsername(username) {
            return $http.get('/api/user?username=' + username);
        }

        function findUserByCredentials(username, password) {
            return $http.get('/api/user?username=' + username + '&password=' + password);
        }

        function updateUser(userId, user) {
            return $http.put('/api/user/' + userId, user);
        }

        function  deleteUser(userId) {
            return $http.delete('/api/user/' + userId);
        }
    }
})();