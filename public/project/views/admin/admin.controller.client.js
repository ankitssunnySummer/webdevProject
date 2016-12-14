/**
 * Created by Ankit on 10/13/2016.
 */

(function() {
    angular.module("WebAppMaker")
        .controller("AdminLoginController", AdminLoginController)
        .controller("AdminRegisterController", AdminRegisterController)
        .controller("AdminProfileController", AdminProfileController);

    function AdminLoginController($location, AdminService, $rootScope) {
        var vm = this;  //vm stands for View Model.
        vm.login = login;

        function login(user) {
            if (vm.user.username == undefined || vm.user.password == undefined) {
                vm.alert = "Username or Password cannot be empty. Please try again.";
            }

            AdminService
                .login(user)
                .then(
                    function(response) {
                        var user = response.data;
                        $rootScope.currentUser = user;
                        $location.url("/admin/" + user._id);
                    },
                    function (error) {
                        vm.alert = "Admin not found";
                        console.log("Error occurred: " +error);
                    });
        }
    }

    function AdminRegisterController($location, AdminService, $rootScope) {
        var vm = this;
        vm.register   = register;

        function register(user) {
            if (vm.user.username === undefined || vm.user.password === undefined || vm.user.verifyPassword === undefined) {
                vm.alert = "No field can be empty. Please try again.";
            }
            else {
                if (vm.user.password === vm.user.verifyPassword) {
                    AdminService
                        .register(user)
                        .then(
                            function (response) {
                                var user = response.data;
                                $rootScope.currentUser = user;
                                $location.url("/admin/" + user._id);
                            },
                            function (error) {
                                console.log("Error occurred: " + error);
                            });
                }
                else {
                    vm.alert = "Password and Verify Password do not match. Kindly try again.";
                }
            }
        }
    }

    function AdminProfileController($routeParams, $route, $location, AdminService, UserService) {
        var vm = this;
        delete vm.alert;
        var userId = $routeParams["aId"];
        vm.aId = userId;
        vm.deleteUser = deleteUser;
        vm.updateProfile = updateProfile;
        vm.logout   = logout;


        function init() {
            AdminService
                .findAdminById(userId)
                .success(function (user) {
                    if (user != '0') {
                        vm.admin = user;
                    }
                    else {
                        vm.alert = "Username and/or password not found. Please try again.";
                    }
                })
                .error(function () {
                    console.log("Error while inside Profile Controller.")
                });

            AdminService
                .findAllUsers()
                .success(function (users) {
                    if (users != '0') {
                        vm.users = users;
                    }
                    else {
                        vm.alert = "Username and/or password not found. Please try again.";
                    }
                })
                .error(function (err) {
                    console.log("Error while inside Profile Controller: " +err);
                });
        }
        init();

        function logout() {
            AdminService
                .logout()
                .then(
                    function(response) {
                        vm.user = null;
                        $location.url("/admin");
                    },
                    function (error) {
                        console.log("Error occurred: " +error);
                    });
        }

        function updateProfile() {
            if(username === "" || email === "") {
                vm.alert = "Username and/or email cannot be empty. Please try again";
            }
            else {
                UserService
                    .updateUser(userId, vm.user)
                    .success(function (user) {
                        $location.url("/user/" + userId);
                    })
                    .error(function (error) {
                        console.log("Error while updating:" + error);
                    });
            }
        }

        function deleteUser(uId){
            UserService
                .deleteUser(uId)
                .success(function (uId) {
                    vm.alert = "User" + uId + "deleted.";
                    $route.reload();
           //         $location.url("/admin/" + userId);
                })
                .error(function (error) {
                    console.log("Error while deleting:" + error);
                });
        }
    }
})();