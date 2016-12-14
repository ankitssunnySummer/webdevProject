/**
 * Created by Ankit on 12/14/2016.
 */
module.exports = function() {
    var mongoose = require("mongoose");
    var FriendSchema = mongoose.Schema({
        user:  {type: mongoose.Schema.ObjectId, ref: 'UserModel'},
        friends: [{type: mongoose.Schema.ObjectId, ref: 'UserModel'}],
        dateCreated: Date
    }, {collection: 'friendscollection'});

    return FriendSchema;
};
