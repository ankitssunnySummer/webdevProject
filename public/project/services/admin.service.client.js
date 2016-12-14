/**Created by Ankit on 10/13/2016.*/
(function() {
    angular
        .module("WebAppMaker")
        .factory("AdminService", AdminService);
    function AdminService($http) {

        var api = {
            createAdmin            : createAdmin,
            findAdminById          : findAdminById,
            findUserByUsername    : findUserByUsername,
            findUserByCredentials : findUserByCredentials,
            updateUser            : updateUser,
            deleteUser            : deleteUser,
            login                 : login,
            logout                : logout,
            register              : register,
            findAllUsers          : findAllUsers
        }
        return api;

        function login(user) {
            return $http.post("/api/admin/login", user);
        }
        function register(user) {
            return $http.post("/api/admin/register", user);
        }

        function findAdminById(id) {
            return $http.get('/api/admin/' + id);
        }

        function findAllUsers() {
            return $http.get('/api/admin/allusers');
        }

        function createAdmin(user) {
            return $http.post('/api/user', user);
        }

        function logout(user) {
            return $http.post("/api/admin/logout");
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