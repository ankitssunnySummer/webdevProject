/**
 * Created by Ankit on 10/30/2016.
 */
module.exports = function (app, models) {
    var mime = require('mime');
    var multer = require('multer');

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname+'/../../public/uploads')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
        }
    });

    var upload = multer({ storage: storage });

    //var upload = multer({ dest: __dirname+'/../uploads' });

    var WidgetModel = models.WidgetModel;
    var PageModel = models.PageModel;
    app.post ("/api/upload", upload.single('uploadedFile'), uploadImage);
    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.put("/page/:pageId/widget", reOrderWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);

    function createWidget(req, resp) {
        var pageId = req.params.pageId;
        var widget = req.body;
        WidgetModel
            .createWidget(pageId, widget)
            .then(
                function (widget) {
                    resp.json(widget);
                },
                function (error) {
                    console.log("Error creating widget: " + error);
                });
    }

    function findAllWidgetsForPage(req, resp) {
        var pageId = req.params.pageId;
        WidgetModel
            .findAllWidgetsForPage(pageId)
            .then (
                function (widgets) {
                    resp.json(widgets);
                },
                function (error) {
                    console.log("Error finding widgets for page: " + error);
                });
    }

    function findWidgetById(req, resp) {
        var widgetId = req.params.widgetId;
        WidgetModel
            .findWidgetById(widgetId)
            .then (
                function (widget) {
                    resp.json(widget);
                },
                function (error) {
                    console.log("Error finding widget: " + error);
                });
    }

    function updateWidget(req, resp) {
        var widgetId = req.params.widgetId;
        var widget = req.body;
        WidgetModel
            .updateWidget(widgetId, widget)
            .then(
                function (widget) {
                    resp.json(widget);
                },
                function (error) {
                    console.log("Error updating widget: " + error);
                });
    }

    function deleteWidget(req, resp) {
        var widgetId = req.params.widgetId;
        WidgetModel
            .deleteWidget(widgetId)
            .then(
                function (widget) {
                    resp.json(widget);
                },
                function (error) {
                    console.log("Error deleting widget: " + error);
                });
    }

    function reOrderWidget(req, resp) {
        var pageId = req.params.pageId;
        var start = req.query.start;
        var end = req.query.end;
        PageModel.reorderWidget(pageId, start, end);
    }

    function uploadImage(req, resp) {
        var widget;
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var userId        = req.body.userId;
        var websiteId     = req.body.websiteId;
        var pageId        = req.body.pageId;
        var myFile        = req.file;
        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename ;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;


        WidgetModel
            .findWidgetById(widgetId)
            .then(
                function (widgetfound) {
                    widget = widgetfound;
                    // now setting the url of this widget to be the file name that was created
                    widget.url = '/uploads/'+filename;

                    // Now we need to update this widget in the database.

                    WidgetModel
                        .updateWidget(widgetId, widget)
                        .then(
                            function (updatedWidget) {
                                resp.redirect('../project/#/user/'+userId+'/website/'+websiteId+'/page/'+pageId+'/widget/');
                            },
                            function (error) {
                                console.log("Error while updating widget: " + error);
                            }
                        );
                },
                function (error) {
                    console.log("Error while uploading image: " + error);
                });
    }
};