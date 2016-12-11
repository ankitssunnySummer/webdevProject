/**
 * Created by Ankit on 11/10/2016.
 */
module.exports = function() {
    var mongoose = require("mongoose");
    var WidgetSchema = require("./widget.schema.server")(mongoose);
    var WidgetModel = mongoose.model("WidgetModel", WidgetSchema);

    var api = {
        createWidget           : createWidget,
        findAllWidgetsForPage  : findAllWidgetsForPage,
        findWidgetById         : findWidgetById,
        updateWidget           : updateWidget,
        deleteWidget           : deleteWidget
    };
    return api;

    function createWidget(pageId, widget) {
        var newWidget = {
            "type"          : widget.type,
            "_page"         : pageId,
        };

        return WidgetModel.create(newWidget);
    }

    function findAllWidgetsForPage(pageId) {
        return WidgetModel
            .find({_page: pageId})
            .populate('_page')
            .exec(function (err, widgets) {
                if (err)  err;
                widgets;
            });
    }

    function findWidgetById(widgetId) {
        return WidgetModel.findOne({_id: widgetId});
    }

    function updateWidget(widgetId, widget) {
        return WidgetModel.findOneAndUpdate(
            {   _id: widgetId},
            {   name        : widget.name,
                text        : widget.text,
                placeholder : widget.placeholder,
                description : widget.description,
                url         : widget.url,
                width       : widget.widget,
                height      : widget.height,
                rows        : widget.rows,
                size        : widget.size,
                icon        : widget.icon,
                deletable   : widget.deletable,
                formatted   : widget.formatted },
            {   upsert: true} );
    }

    function deleteWidget(widgetId) {
        return WidgetModel.remove({_id: widgetId});
    }
};