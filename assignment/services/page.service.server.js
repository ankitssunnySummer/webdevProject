/**
 * Created by Ankit on 10/30/2016.
 */
module.exports = function(app, models) {
    var PageModel = models.PageModel;
    app.post("/api/website/:websiteId/page", createPage);
    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);

    function createPage(req, resp) {
        var websiteId = req.params.websiteId;
        var page = req.body;

        PageModel
            .createPage(websiteId, page)
            .then(
                function (page) {
                    resp.json(page);
                },
                function (error) {
                    console.log("Page creation failed: " + error);
                });
    }

    function findAllPagesForWebsite(req, resp) {
        var websiteId = req.params.websiteId;

        PageModel
            .findAllPagesForWebsite(websiteId)
            .then (
                function (websites) {
                    resp.json(websites);
                },
                function (error) {
                    console.log("Error finding pages: " + error);
                });
    }

    function findPageById(req, resp) {
        var pageId = req.params.pageId;
        PageModel
            .findPageById(pageId)
            .then (
                function (page) {
                    resp.json(page);
                },
                function (error) {
                    console.log("Error finding page: " + error);
                });
    }

    function updatePage(req, resp) {
        var pageId = req.params.pageId;
        var page = req.body;
        PageModel
            .updatePage(pageId, page)
            .then (
                function (page) {
                    resp.json(page);
                },
                function (error) {
                    console.log("Error updating page: " + error);
                });
    }

    function deletePage(req, resp) {
        var pageId = req.params.pageId;
        PageModel
            .deletePage(pageId)
            .then(
                function (page) {
                    resp.json(page);
                },
                function (error) {
                    console.log("Error deleting page: " + error);
                });
    }
};