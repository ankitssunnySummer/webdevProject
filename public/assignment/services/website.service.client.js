/**
 * Created by Ankit on 10/13/2016.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);
    function WebsiteService($http) {
        var api = {
            createWebsite         : createWebsite,
            findWebsitesByUser    : findWebsitesByUser,
            findWebsiteById       : findWebsiteById,
            updateWebsite         : updateWebsite,
            deleteWebsite         : deleteWebsite
        };
        return api;

        function createWebsite(userId, website) {
            return $http.post("/api/user/" + userId + "/website", website);
        }

        function findWebsitesByUser(userId) {
            return $http.get("/api/user/" + userId + "/website");
        }

        function  findWebsiteById(websiteId) {
            return $http.get("/api/website/" + websiteId);
        }

        function  updateWebsite(websiteId, data) {
            return $http.put("/api/website/" + websiteId, data);
        }

        function deleteWebsite(websiteId) {
            return $http.delete("/api/website/" + websiteId);
        }
    }
})();