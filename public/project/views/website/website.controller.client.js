/**
 * Created by Ankit on 10/13/2016.
 */
(function() {
    angular.module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController)

    function WebsiteListController($routeParams, WebsiteService, UserService) {
        var vm = this;
        var userId = $routeParams["uid"];
        UserService
            .findUserById(userId)
            .success(function (user) {
                vm.user = user;
            })
            .error(function (error) {
                console.log("Error occurred: " + error);

            });

        WebsiteService
            .findWebsitesByUser(userId)
            .success(function (websites) {
                vm.websites = websites;
            })
            .error(function (error) {
                console.log("Error occurred: " + error);

            });
    }

    function NewWebsiteController($routeParams, $location, WebsiteService, UserService) {
        var vm = this;
        delete vm.alert;
        var userId = $routeParams["uid"];
        vm.createWebsite = createWebsite;

        UserService
            .findUserById(userId)
            .success(function (user) {
                vm.user = user;
                WebsiteService
                    .findWebsitesByUser(userId)
                    .success(function (websites) {
                        vm.websites = websites;
                    })
                    .error(function (error) {
                        console.log(error);
                    });

            })
            .error(function (error) {
                console.log(error);
            });

        function createWebsite(name, description) {
            if (vm.website.name == undefined) {
                vm.alert = "Website Name cannot be empty. Please try again.";
                $location.url("/user/" + userId + "/website");
            }
            else {
                var newWebsite = {"name": name, "description": description};
                WebsiteService
                    .createWebsite(userId, newWebsite)
                    .success(function (website) {
                        $location.url("/user/" + userId + "/website");
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            }
        }
    }

    function EditWebsiteController($routeParams, $location, WebsiteService, UserService) {
        var vm = this;
        var userId = $routeParams["uid"];
        var websiteId = $routeParams["wid"];
        vm.deleteWebsite = deleteWebsite;
        vm.updateWebsite = updateWebsite;

        UserService
            .findUserById(userId)
            .success(function (user) {
                vm.user = user;
                WebsiteService
                    .findWebsitesByUser(userId)
                    .success(function (websites) {
                        vm.websites = websites;
                    })
                    .error(function (error) {
                        console.log("Error occurred: " + error);
                    });
            })
            .error(function (error) {
                console.log("Error occurred: " + error);

            });


        WebsiteService
            .findWebsiteById(websiteId)
            .success(function (website) {
                vm.website= website;
            })
            .error(function (error) {
                console.log("Error occurred: " + error);

            });

        function deleteWebsite(websiteId) {
            WebsiteService
                .deleteWebsite(websiteId)
                .success(function (website) {
                    $location.url("/user/" + userId + "/website");
                })
                .error(function (err) {
                    console.log("Error occurred: " + err);
                });
        }

        function updateWebsite(name, description) {
            delete vm.alert;
            if(vm.website.name === "" || vm.website.name === undefined){
                vm.alert = "Name cannot be empty. Please try again";
            }
            else {
                var updatedWebsite = {
                    "name": name,
                    "description": description
                };

                WebsiteService
                    .updateWebsite(websiteId, updatedWebsite)
                    .success(function (website) {
                        $location.url("/user/" + userId + "/website/");
                    })
                    .error(function (error) {
                        console.log("Error while updating:"  +error);
                    });
            }
        }
    }
})();