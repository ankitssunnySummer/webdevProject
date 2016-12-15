/**
 * Created by Ankit on 10/13/2016.
 */

(function() {
    angular.module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController)
        .controller("FriendController", FriendController)
        .controller("UserController", UserController);

    function UserController($location, $routeParams, UserService, $sce) {
        var vm            = this;
        var userId        = $routeParams["userId"];
        var uId           = $routeParams["uid"];
        vm.checkSafeImage = checkSafeImage;
        vm.logout         = logout;
        vm.addFriend      = addFriend;
        vm.view;

        function init() {
            UserService
                .findUserById(userId)
                .success(function (user) {
                    if (user != '0') {
                        vm.view = user;
                    }
                    else {
                        vm.alert = "Username and/or password not found. Please try again.";
                    }
                })
                .error(function () {
                    console.log("Error while inside Profile Controller.")
                });

            UserService
                .findUserById(uId)
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
        }
        init();


        function addFriend() {
            UserService
                .addFriend(vm.user._id, vm.view._id)
                .then(
                    function (success) {
                        $location.url('/user/' + vm.user._id + '/friend/' + vm.view._id);
                    },
                    function (err) {
                        console.log("Some error occurred: " +err);
                    }
                )};


        function checkSafeImage(url) {
            return $sce.trustAsResourceUrl(url);
        }

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

    }


    function FriendController($location, $routeParams, UserService, $sce, $route) {
        var vm              = this;
        var userId          = $routeParams["userId"];         // friends ID
        var uId             = $routeParams["uid"];            // logged in user
        vm.checkSafeImage   = checkSafeImage;
        vm.logout           = logout;
        vm.removeFriend     = removeFriend;
        vm.userRelationship = userRelationship;
        vm.addComment       = addComment;
        vm.friends;
        vm.view;
        vm.friends = [];

        function init() {

//            console.log(vm.view);


            UserService
                .findUserById(userId)
                .success(function (user) {
                    if (user != '0') {
                        vm.view = user;
                    }
                    else {
                        vm.alert = "Username and/or password not found. Please try again.";
                    }
                })
                .error(function () {
                    console.log("Error while inside Profile Controller.")
                });

            UserService
                .findUserById(uId)
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

            var id = [];
            UserService
                .findAllFriends(userId)
                .success(function (data) {
                    for (var i =0; i < data[0].friends.length ; i++) {
                        id[i] = data[0].friends[i];
                    }
                    UserService
                        .findFriendsByID(id)
                        .success(function (users) {
                            vm.friends = users;
                        })
                        .error(function (err) {
                            console.log("Error: " +err);
                        });
                })
                .error(function (err) {
                    console.log("Error: " +err);
                });

            UserService
                .findAllCommentsOnUser(userId)
                .then(
                    function (data) {
                        var comments = data.data;
                        vm.comments = comments;
                    },
                    function (err) {
                        console.log("error: " +err);
                    });
        }
        init();

        function removeFriend() {
            UserService
                .removeFriend(vm.user._id, vm.view._id)
                .then(
                    function (success) {
                        $location.url('/user/' + vm.user._id);
                    },
                    function (err) {
                        console.log("Some error occurred: " +err);
                    }
                )};

        function userRelationship(otherId) {
            if(uId == otherId){
                $location.url("/user/" + uId);
            }
            else {
                UserService
                    .findRelationShip(uId, otherId)
                    .then(
                        function (success) {
                            // route to page which shows profile of users that are not friends
                            if (success.data.length == 0) {
                                $location.url("/user/" + uId + "/users/" + otherId);
                            }
                            // route to page for friends
                            else {
                                $location.url("/user/" + uId + "/friend/" + otherId);
                            }},
                        function (err) {
                            console.log("Error occurred while finding relationship: " +err);
                        });
            }
        }

        function addComment(commentString) {
            comment = {
                commentBy: vm.user,
                commentOn: vm.view,
                comment: commentString};

            UserService
                .createComment(comment)
                .then(
                    function (succ) {
                        //success
                        $route.reload();
                   //     $location.url("/user/" + vm.user._id + "/friend/" + vm.view._id);
                    },
                    function (err) {
                        console.log("error: " +err);
                    });
        }

        function checkSafeImage(url) {
            return $sce.trustAsResourceUrl(url);
        }

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

    }

    function LoginController($location, UserService) {
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

    function ProfileController($routeParams, $location, UserService, $sce, $route) {
        var vm = this;
        //  var request = require('request');
        delete vm.alert;
        var userId = $routeParams["uid"];
        vm.updateProfile    = updateProfile;
        vm.deleteUser       = deleteUser;
        vm.logout           = logout;
        vm.checkSafeImage   = checkSafeImage;
        vm.searchEBay       = searchEBay;
        vm.userRelationship = userRelationship;
        vm.deleteComment    = deleteComment;
        vm.addReview        = addReview;
        vm.deleteReview     = deleteReview;
        vm.items;
        vm.users;
        vm.user;

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
                        var temp = users.data;
                        var finalUsers= [];
                        //console.log(finalUsers);
                        for(var i= 0; i < temp.length; i++) {
                            if (temp[i]._id != vm.user._id) {
                                finalUsers[i] = temp[i];
                            }
                        }
                        vm.users = finalUsers;
                    },
                    function (err) {
                        console.log("Error while finding all users: +" +err);
                    });

            var id = [];
            UserService
                .findAllFriends(userId)
                .success(function (data) {
                    for (var i =0; i < data[0].friends.length ; i++) {
                        id[i] = data[0].friends[i];
                    }
                    UserService
                        .findFriendsByID(id)
                        .success(function (users) {
                            vm.friends = users;
                        })
                        .error(function (err) {
                            console.log("Error: " +err);
                        });
                })
                .error(function (err) {
                    console.log("Error: " +err);
                });


            UserService
                .findAllCommentsByUser(userId)
                .then(
                    function (data) {
                        var comments = data.data;
                        vm.comments = comments;
                    },
                    function (err) {
                        console.log("error: " +err);
                    });


            UserService
                .findAllCommentsOnUser(userId)
                .then(
                    function (data) {
                        var comments = data.data;
                        vm.commentsReceived = comments;
                    },
                    function (err) {
                        console.log("error: " +err);
                    });

            UserService
                .findAllReviews()
                .then(
                    function (reviews) {
                        vm.reviews = reviews.data;
                    },
                function (err) {
                    console.log("error: " +err);
                });
        }
        init();

        function addReview(item, review) {
            var review = {
                reviewer: vm.user_id,
                review: review,
                itemName: item.title[0],
                galleryUrl: item.galleryURL[0]};

            UserService
                .addReview(review)
                .then(
                    function (success) {
                        $route.reload();
                    },
                    function (err) {
                        console.log("Error: " +err);
                    });

        }

        function deleteReview(reviewId) {
            UserService
                .removeReview(reviewId)
                .then(
                    function (success) {
                        $route.reload();
                    },
                    function (err) {
                        console.log("Error: " +err);
                    });
        }

        function userRelationship(otherId) {
            UserService
                .findRelationShip(userId, otherId)
                .then(
                    function (success) {
                        // route to page which shows profile of users that are not friends
                        if (success.data.length == 0) {
                            $location.url("/user/" + userId + "/users/" + otherId);
                        }
                        // route to page for friends
                        else {
                            $location.url("/user/" + userId + "/friend/" + otherId);
                        }},
                    function (err) {
                        console.log("Error occurred while finding relationship: " +err);
                    });
        }

        function searchEBay(searchTerm) {
            UserService
                .searchEBay(searchTerm)
                .then(
                    function (body) {
                        vm.items = body.data;
                    },
                    function (err) {
                        console.log("Error while EBay call: " +err);
                    });
        }

        function checkSafeImage(url) {
            return $sce.trustAsResourceUrl(url);
        }


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
        function deleteComment(commentId) {
            UserService
                .deleteComment(commentId)
                .then(
                    function (success) {
                        $route.reload();
                    },
                    function (err) {
                        console.log("Error: " +err);
                    });
        }
    }
})();