/**
 * Created by Ankit on 12/10/2016.
 */
module.exports = function() {
    var mongoose = require("mongoose");
    var AdminSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        users: [{type: mongoose.Schema.ObjectId, ref: 'UserModel'}],
        dateCreated: Date
    }, {collection: 'admincollection'});

    return AdminSchema;
};
