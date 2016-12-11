/**
 * Created by Ankit on 11/10/2016.
 */
module.exports = function() {
    var mongoose = require("mongoose");
    var WebsiteSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.ObjectId, ref: 'UserModel'},
        name: String,
        description: String,
        pages: [{type: mongoose.Schema.ObjectId, ref: 'PageModel'}],
        dateCreated: Date
    }, {collection: 'websitecollection'});

    return WebsiteSchema;
};
