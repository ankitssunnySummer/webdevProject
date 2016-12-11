/**
 * Created by Ankit on 10/30/2016.
 */
module.exports = function(app, models) {
    var WebsiteModel = models.WebsiteModel;

    app.post("/api/user/:userId/website", createWebsite);
    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

    function createWebsite(req, resp) {
        var userId = req.params.userId;
        var website = req.body;
        WebsiteModel
            .createWebsiteForUser(userId, website)
            .then(
                function (website) {
                    resp.json(website);
                },
                function (error) {
                    console.log("Error while creating website : " +error);
                }
            );
    }

    function findAllWebsitesForUser(req, resp) {
        var userId = req.params.userId;
        WebsiteModel
            .findAllWebsitesForUser(userId)
            .then(
                function (websites) {
                    resp.json(websites);
                },
                function (error) {
                    console.log("Cannot find websites: " + error);
                }
            );
    }

    function findWebsiteById(req, resp) {
        var websiteId = req.params.websiteId;
        WebsiteModel
            .findWebsiteById(websiteId)
            .then(
                function (website) {
                    resp.json(website);
                },
                function (error) {
                    console.log("Error while trying to find website: " +error);
                }
            );
    }

    function updateWebsite(req, resp) {
        var websiteId = req.params.websiteId;
        var data = req.body;
        WebsiteModel
            .updateWebsite(websiteId, data)
            .then(
                function (website) {
                    resp.json(website);
                },
                function (error) {
                    console.log("Cannot update website: " + error);
                }
            );
    }

    function deleteWebsite(req, resp){
        var websiteId = req.params.websiteId;
        WebsiteModel
            .deleteWebsite(websiteId)
            .then(
                function (website) {
                    resp.json(website);
                },
                function (error) {
                    console.log("Error occurred: " + error);
                });
    }
};