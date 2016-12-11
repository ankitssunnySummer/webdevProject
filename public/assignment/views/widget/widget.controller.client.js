/**
 * Created by Ankit on 10/13/2016.
 */
(function() {
    angular.module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    function WidgetListController($routeParams, UserService, WebsiteService, PageService, WidgetService, $sce) {
        var vm = this;
        var userId = $routeParams["uid"];
        var websiteId = $routeParams["wid"];
        var pageId = $routeParams["pid"];
        vm.checkSafeHtml = checkSafeHtml;
        vm.checkSafeImage = checkSafeImage;
        vm.checkSafeYouTube = checkSafeYouTube;

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

        WidgetService
            .findWidgetsByPageId(pageId)
            .success(function (widgets) {
                vm.widgets = widgets;
            })
            .error(function (error) {
                console.log("In error" +error);
            });

        function checkSafeHtml(text) {
            return $sce.trustAsHtml(text);
        }

        function checkSafeImage(url) {
            return $sce.trustAsResourceUrl(url);
        }

        function checkSafeYouTube(url) {
            var parts = url.split('/');
            var id = parts[parts.length - 1];
            url = "https://www.youtube.com/embed/"+id;
            return $sce.trustAsResourceUrl(url);
        }
    }

    function NewWidgetController($routeParams, $location, UserService, WebsiteService, PageService, WidgetService) {
        var vm =this;
        var userId = $routeParams["uid"];
        var websiteId = $routeParams["wid"];
        var pageId = $routeParams["pid"];
        vm.createWidget = createWidget;

        function createWidget(widgetType) {
            var widget = {
                type: widgetType
            }

            WidgetService
                .createWidget(pageId, widget)
                .success(function (widget) {
                    var widId = widget._id;
                    $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/" + widId);
                })
                .error(function (error) {
                    console.log("Error occurred: " + error);
                });
        }

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

        WidgetService
            .findWidgetsByPageId(pageId)
            .success(function (widgets) {
                vm.widgets = widgets;
            })
            .error(function (error) {
                console.log(error);
            });



    }

    function EditWidgetController($routeParams, $location, UserService, WebsiteService, PageService, WidgetService) {
        var vm = this;
        var userId = $routeParams["uid"];
        var websiteId = $routeParams["wid"];
        var pageId = $routeParams["pid"];
        var widgetId = $routeParams["wgid"];
        vm.userId = userId;
        vm.websiteId = websiteId;
        vm.pageId = pageId;
        vm.deleteWidget = deleteWidget;
        vm.updateWidget = updateWidget;

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

        WidgetService
            .findWidgetById(widgetId)
            .success(function (widgetfound) {
                vm.widget = widgetfound;
            })
            .error(function (error) {
                console.log(error);
            });

        function deleteWidget(widgetId) {
            WidgetService
                .deleteWidget(widgetId)
                .success(function (deletedWidget) {
                    $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
                })
                .error(function (error) {
                    console.log(error);
                });
        }

        function updateWidget(wid, widget) {
            if (vm.widget.name === "" || vm.widget.name === undefined) {
                vm.alert = "Widget name cannot be empty. Try again.";
            }
            else {
                WidgetService
                    .updateWidget(wid, widget)
                    .success(function (widget) {
                        $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            }
        }
    }
})();       