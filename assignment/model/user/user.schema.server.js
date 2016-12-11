/**
 * Created by Ankit on 11/10/2016.
 */
module.exports = function() {
    var mongoose = require("mongoose");
    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        websites: [{type: mongoose.Schema.ObjectId, ref: 'WebsiteModel'}],
        dateCreated: Date,
        facebook: {
            id:    String,
            token: String
        }
    }, {collection: 'usercollection'});

    return UserSchema;
};
