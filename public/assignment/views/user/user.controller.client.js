/**
 * Created by Ankit on 10/13/2016.
 */
(function() {
    angular.module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, UserService, $rootScope) {
        var vm = this;  //vm stands for View Model.
        vm.login = login;



        function login(user) {
            if (vm.user.username == undefined || vm.user.password == undefined) {
                vm.alert = "Username or Password cannot be empty. Please try again.";
            }
            UserService
                .login(user)
                .then(
                    function(response) {
                        var user = response.data;
                        $rootScope.currentUser = user;
                        $location.url("/user/" + user._id);
                    },
                    function (error) {
                        console.log("Error occurred: " +error);
                    });

            /*
             UserService
             .findUserByCredentials(username, password)
             .success(function (user) {
             if (user != null) {
             $location.url("/user/" + user._id);
             }
             else {
             vm.alert = "Username and/or password not found. Please try again.";
             }
             })
             .error(function () {
             console.log("Error while logging in.");
             })
             */
        }
    }

    function RegisterController($location, UserService, $rootScope) {
        var vm = this;
        vm.createUser = createUser;
        vm.register   = register;

        function register(user) {
            if (vm.user.username === undefined || vm.user.password === undefined || vm.user.verifyPassword === undefined) {
                vm.alert = "No field can be empty. Please try again.";
            }
            else {
                if (vm.user.password === vm.user.verifyPassword) {
                    UserService
                        .register(user)
                        .then(
                            function (response) {
                                var user = response.data;
                                $rootScope.currentUser = user;
                                $location.url("/user/" + user._id);
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



        function createUser() {
            if(vm.user.username == undefined || vm.user.password == undefined || vm.user.password != vm.user.verifyPassword ) {
                vm.alert = "Username and/or Password cannot be blank and passwords should match. Please try again.";
                $location.url("/register");
            }
            else {
                var newUser = {username: vm.user.username, password: vm.user.password, firstName: "", lastName: ""};
                UserService
                    .createUser(newUser)
                    .success(function (user) {
                        if (user != null) {
                            $location.url("/user/" + user._id);
                        }
                        else {
                            vm.alert = "Username already present. Please try again with a different Username.   "
                        }
                    })
                    .error(function () {
                        console.log("Error while creating new User.")
                    });
            }
        }
    }

    function ProfileController($routeParams, $location, UserService) {
        var vm = this;
        delete vm.alert;
        var userId = $routeParams["uid"];

        UserService
            .findUserById(userId)
            .success(function (user) {
                if (user != '0') {
                    vm.user = user;
                }
                else {
                    vm.alert = "Username and/or password not found. Please try again.";
                }
            })
            .error(function () {
                console.log("Error while inside Profile Controller.")
            })

        vm.updateProfile = updateProfile;
        vm.deleteUser = deleteUser;
        vm.logout   = logout;

        function logout() {
            UserService
                .logout()
                .then(
                    function(response) {
                        vm.user = null;
                        $location.url("/");
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

        function deleteUser(){
            UserService
                .deleteUser(userId)
                .success(function (userId) {
                    vm.alert = "User" + userId + "deleted.";
                    $location.url("/login");
                })
                .error(function (error) {
                    console.log("Error while deleting:" + error);
                });
        }
    }
})();