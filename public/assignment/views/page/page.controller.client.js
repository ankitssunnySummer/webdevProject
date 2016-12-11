/**
 * Created by Ankit on 10/13/2016.
 */
(function() {
    angular.module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, UserService, WebsiteService, PageService) {
        var vm = this;
        var userId = $routeParams["uid"];
        var websiteId = $routeParams["wid"];
        UserService
            .findUserById(userId)
            .success(function (user) {
                vm.user = user;
            })
            .error(function (error) {
                console.log(error);
            });

        WebsiteService
            .findWebsiteById(websiteId)
            .success(function (website) {
                vm.website = website;
            })
            .error(function (error) {
                console.log(error);
            });

        PageService
            .findPageByWebsiteId(websiteId)
            .success(function (pages) {
                vm.pages = pages;
            })
            .error(function (error) {
                console.log(error);
            });
    }

    function NewPageController($routeParams, $location, UserService, WebsiteService, PageService) {
        var vm = this;
        var userId = $routeParams["uid"];
        var websiteId = $routeParams["wid"];
        vm.createPage = createPage;

        UserService
            .findUserById(userId)
            .success(function (user) {
                vm.user = user;
            })
            .error(function (error) {
                console.log(error);
            });

        WebsiteService
            .findWebsiteById(websiteId)
            .success(function (website) {
                vm.website = website;
            })
            .error(function (error) {
                console.log(error);
            });

        function createPage() {
            if(vm.page.name == undefined){
                vm.alert = "New page needs to have a name. Try again";
            }
            else {
                var newPage = {"name": vm.page.name, "title": vm.page.title, "description": vm.page.description};
                PageService
                    .createPage(websiteId, newPage)
                    .success(function (page) {
                        $location.url("/user/" + userId + "/website/" + websiteId + "/page" );
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            }
        }
    }

    function EditPageController($routeParams, $location, UserService, WebsiteService, PageService) {
        ///user/:uid/website/:wid/page/:pid
        var vm = this;
        var userId = $routeParams["uid"];
        var websiteId = $routeParams["wid"];
        var pageId = $routeParams["pid"];
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        UserService
            .findUserById(userId)
            .success(function (user) {
                vm.user = user;
            })
            .error(function (error) {
                console.log(error);
            });

        WebsiteService
            .findWebsiteById(websiteId)
            .success(function (website) {
                vm.website = website;
            })
            .error(function (error) {
                console.log(error);
            });

        PageService
            .findPageById(pageId)
            .success(function (page) {
                vm.page = page;
            })
            .error(function (error) {
                console.log(error);
            });

        function updatePage() {
            delete vm.alert;

            if(vm.page.name === "") {
                vm.alert = "Page name cannot be empty. Please try again";
            }
            else {
                var updatedPage =   {"name": vm.page.name, "title": vm.page.title, "description": vm.page.description};
                PageService
                    .updatePage(pageId, updatedPage)
                    .success(function (page) {
                        $location.url("/user/" + userId + "/website/" + websiteId + "/page");
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            }
        }

        function deletePage() {
            PageService
                .deletePage(pageId)
                .success(function (page) {
                    $location.url("/user/" + userId + "/website/" + websiteId + "/page");
                })
                .error(function (error) {
                    console.log(error);
                    vm.alert = "Unable to remove page. Please try again";
                });
        }
    }
})();