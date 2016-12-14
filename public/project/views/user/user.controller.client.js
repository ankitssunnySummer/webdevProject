/**
 * Created by Ankit on 10/13/2016.
 */
(function() {
    angular.module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

//    var request      = require('request');

    function LoginController($location, UserService, $rootScope, $window) {
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
                        vm.user = user;
                        ///project/index.html#/user/584e4741ab5c3b0738df5aa1
                        $location.url("/user/" + user._id);
                    },
                    function (error) {
                        console.log("Error occurred: " +error);
                        vm.alert = "Invalid credentials. Please try again";
                    });
        }
    }

    function RegisterController($location, UserService, $rootScope) {
        var vm = this;
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
    }

    function ProfileController($routeParams, $location, UserService, $sce) {
        var vm = this;
        //  var request = require('request');
        delete vm.alert;
        var userId = $routeParams["uid"];
        vm.updateProfile    = updateProfile;
        vm.deleteUser       = deleteUser;
        vm.logout           = logout;
        vm.checkSafeImage   = checkSafeImage;
        vm.searchEBay       = searchEBay;
        vm.items;

        function searchEBay(searchTerm) {
            UserService
                .searchEBay(searchTerm)
                .then(
                    function (body) {
                        vm.items = body.data;

                        var items = body.data;
                        var subtitle;
                        for (var i = 0; i < items.length; ++i) {
                            var item = items[i];
                            var title = item.title;
                            if (item.subtitle == undefined) {
                                subtitle[0] = title[0];
                            }
                            else {
                                subtitle = item.subtitle;
                            }
                            var cat = item.primaryCategory;


                            var pic = item.galleryURL;
                            var viewitem = item.viewItemURL;
                            var location = item.location;
                            console.log(title[0]);
                            console.log(subtitle[0]);
                            console.log(cat[0]);
                            console.log(pic[0]);
                            console.log(viewitem[0]);
                            console.log(location[0]);
                        }
                    },
                    function (err) {
                        console.log("Error while EBay call: " +err);
                    });
        }

        function checkSafeImage(url) {
            return $sce.trustAsResourceUrl(url);
        }

        function init() {
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
                });


            UserService
                .findAllUsers()
                .then(
                    function (users) {
                        vm.users = users;
                    },
                    function (err) {
                        console.log("Error while finding all users: +" +err);
                    });
        }
        init();

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