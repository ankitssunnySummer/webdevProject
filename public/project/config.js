/**
 * Created by Ankit on 10/12/2016.
 */
(function() {
    angular
        .module("WebAppMaker")
        .config(Config);

    function Config($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl     : "views/user/login.view.client.html",
                controller      : "LoginController",
                controllerAs    : "model"
            })
            .when("/login", {
                templateUrl     : "views/user/login.view.client.html",
                controller      : "LoginController",
                controllerAs    : "model"
            })
            .when("/register", {
                templateUrl     : "views/user/register.view.client.html",
                controller      : "RegisterController",
                controllerAs    : "model"
            })
            .when("/admin", {
                templateUrl     : "views/admin/admin.view.client.html",
                controller      : "AdminLoginController",
                controllerAs    : "model"
            })
            .when("/adminRegister", {
                templateUrl     : "views/admin/adminRegister.view.client.html",
                controller      : "AdminRegisterController",
                controllerAs    : "model"
            })
            .when("/admin/:aId", {
                templateUrl     : "views/admin/adminControl.view.client.html",
                controller      : "AdminProfileController",
                controllerAs    : "model",
                resolve         : {
                    adminLoggedin    : checkAdminLoggedIn}
            })
            .when("/user/:uid", {
                templateUrl     : "views/user/profile.view.client.html",
                controller      : "ProfileController",
                controllerAs    : "model",
                resolve         : {
                    loggedin: checkLoggedin }
            })
            .when("/user/account/:uid", {
                templateUrl     : "views/user/account.view.client.html",
                controller      : "ProfileController",
                controllerAs    : "model",
                resolve         : {
                    loggedin: checkLoggedin }
            })
            .when("/user/:uid/users/:userId", {
                templateUrl     : "views/user/friend.view.client.html",
                controller      : "UserController",
                controllerAs    : "model"
            })

            .when("/user/:uid/website", {
                templateUrl     : "views/website/website-list.view.client.html",
                controller      : "WebsiteListController",
                controllerAs    : "model"
            })
            .when("/user/:uid/website/new", {
                templateUrl     : "views/website/website-new.view.client.html",
                controller      : "NewWebsiteController",
                controllerAs    : "model"
            })
            .when("/user/:uid/website/:wid", {
                templateUrl     : "views/website/website-edit.view.client.html",
                controller      : "EditWebsiteController",
                controllerAs    : "model"
            })
            .when("/user/:uid/website/:wid/page", {
                templateUrl     : "views/page/page-list.view.client.html",
                controller      : "PageListController",
                controllerAs    : "model"
            })
            .when("/user/:uid/website/:wid/page/new", {
                templateUrl     : "views/page/page-new.view.client.html",
                controller      : "NewPageController",
                controllerAs    : "model"
            })
            .when("/user/:uid/website/:wid/page/:pid", {
                templateUrl     : "views/page/page-edit.view.client.html",
                controller      : "EditPageController",
                controllerAs    : "model"
            })
            .when("/user/:uid/website/:wid/page/:pid/widget", {
                templateUrl     : "views/widget/widget-list.view.client.html",
                controller      : "WidgetListController",
                controllerAs    : "model"
            })
            .when("/user/:uid/website/:wid/page/:pid/widget/new", {
                templateUrl     : "views/widget/widget-chooser.view.client.html",
                controller      : "NewWidgetController",
                controllerAs    : "model"
            })
            .when("/user/:uid/website/:wid/page/:pid/:wgid", {
                templateUrl     : "views/widget/widget-edit.view.client.html",
                controller      : "EditWidgetController",
                controllerAs    : "model"
            })
            .otherwise({
                templateUrl     : "views/user/login.view.client.html",
                controller      : "LoginController",
                controllerAs    : "model"
            });

        function checkLoggedin($q, $timeout, $http, $location, $rootScope) {
            var deferred = $q.defer();
            $http.get('/api/loggedin')
                .success(
                    function(user) {
                        $rootScope.errorMessage = null;
                        if (user !== '0') {
                            $rootScope.currentUser = user;
                            deferred.resolve();
                        } else {
                            deferred.reject();
                            $location.url('/#');
                        }
                    });
            return deferred.promise;
        };


        function checkAdminLoggedIn($q, $timeout, $http, $location, $rootScope) {
            var deferred = $q.defer();
            $http.get('/api/admin/loggedin')
                .success(
                    function(user) {
                        $rootScope.errorMessage = null;
                        if (user !== '0') {
                            $rootScope.currentUser = user;
                            deferred.resolve();
                        } else {
                            deferred.reject();
                            $location.url('/#');
                        }
                    });
            return deferred.promise;
        };
    }
})();