/**
 * Created by Ankit on 11/10/2016.
 */

module.exports = function() {
    var mongoose = require("mongoose");
    var connectionString = 'mongodb://localhost/assignmentdb';

    if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
        connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
            process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
            process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
            process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
            process.env.OPENSHIFT_APP_NAME;
    }
    mongoose.connect(connectionString);

    var PageModel = require("./page/page.model.server")();
    var UserModel = require("./user/user.model.server")();
    var AdminModel = require("./admin/admin.model.server.js")();
    var WebsiteModel = require("./website/website.model.server")();
    var WidgetModel = require("./widget/widget.model.server")();
    var FriendModel = require("./friends/friends.model.server")();
    var CommentModel = require("./comments/comment.model.server")();

    var models = {
        UserModel       : UserModel,
        PageModel       : PageModel,
        WebsiteModel    : WebsiteModel,
        WidgetModel     : WidgetModel,
        AdminModel      : AdminModel,
        FriendModel     : FriendModel,
        CommentModel    : CommentModel
    }
    return models;
};