/**Created by Ankit on 10/13/2016.*/
(function() {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService($http) {
        var api = {
            findUserById          : findUserById,
            findUserByUsername    : findUserByUsername,
            findUserByCredentials : findUserByCredentials,
            updateUser            : updateUser,
            deleteUser            : deleteUser,
            login                 : login,
            logout                : logout,
            register              : register,
            findAllUsers          : findAllUsers,
            searchEBay            : searchEBay

        }
        return api;

        function searchEBay(searchTerm) {
            return $http.get("/api/ebayRequest/"+ searchTerm);
        }

        function login(user) {
            return $http.post("/api/login", user);
        }

        function logout(user) {
            return $http.post("/api/logout");
        }

        function register(user) {
            return $http.post("/api/register", user);
        }

        function findUserById(id) {
            return $http.get('/api/user/' + id);
        }

        function findAllUsers() {
            return $http.get('/api/allusers');
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