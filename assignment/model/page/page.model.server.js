/**
 * Created by Ankit on 11/10/2016.
 */
module.exports = function() {
    var mongoose = require("mongoose");
    var PageSchema = require("./page.schema.server")(mongoose);
    var PageModel = mongoose.model("PageModel", PageSchema);

    var api = {
        createPage              : createPage,
        findAllPagesForWebsite  : findAllPagesForWebsite,
        findPageById            : findPageById,
        updatePage              : updatePage,
        deletePage              : deletePage,
        reorderWidget           : reorderWidget
    };
    return api;

    function createPage(websiteId, page) {
        var newPage = {
            "_website": websiteId,
            "name": page.name,
            "title": page.title,
            "description": page.description
        };
        return PageModel.create(newPage);
    }

    function findAllPagesForWebsite(websiteId) {
        return PageModel.find({_website: websiteId});
    }

    function findPageById(pageId) {
        return PageModel.findOne({_id: pageId});
    }

    function updatePage(pageId, page) {
        return PageModel.update({_id: pageId}, {
            name: page.name,
            title: page.title,
            description: page.description
        });
    }

    function deletePage(pageId) {
        return PageModel.remove({_id: pageId});
    }

    function reorderWidget(pageId, start, end) {
        var page;
        PageModel
            .findOne({_id: pageId})
            .populate('widgets')
            .exec(function (err, pagefound) {
                if(err) return err;
                page = pagefound;
                page.widgets.splice( end, 0 , page.widgets.splice(start , 1)[0]);
                return;
            })
    }
};