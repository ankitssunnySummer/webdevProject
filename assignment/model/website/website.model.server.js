/**
 * Created by Ankit on 11/10/2016.
 */
module.exports = function() {

    var mongoose = require("mongoose");
    var WebsiteSchema = require("./website.schema.server")(mongoose);
    var WebsiteModel = mongoose.model("WebsiteModel", WebsiteSchema);

    var api = {
        createWebsiteForUser    : createWebsiteForUser,
        findAllWebsitesForUser  : findAllWebsitesForUser,
        findWebsiteById         : findWebsiteById,
        updateWebsite           : updateWebsite,
        deleteWebsite           : deleteWebsite
    };
    return api;

    function createWebsiteForUser(userId, website) {
        var newWebsite = {
            "name": website.name,
            "_user": userId,
            "description": website.description,
            "dateCreated": Date.now()
        };
       return WebsiteModel.create(newWebsite);
    }

    function findAllWebsitesForUser(userId) {
        return WebsiteModel.find({_user: userId});
    }

    function findWebsiteById(websiteId) {
        return WebsiteModel.findOne({_id: websiteId});
    }

    function updateWebsite(websiteId, website) {
        return WebsiteModel.update({_id: websiteId}, {
            name: website.name,
            description: website.description
        });
    }

    function deleteWebsite(websiteId) {
        return WebsiteModel.remove({_id: websiteId});
    }
};