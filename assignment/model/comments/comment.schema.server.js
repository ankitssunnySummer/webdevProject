/**
 * Created by Ankit on 11/10/2016.
 */
module.exports = function() {
    var mongoose = require("mongoose");
    var CommentSchema = mongoose.Schema({
        comment: String,
        commentBy: {type: mongoose.Schema.ObjectId, ref: 'UserModel'},
        commentOn: {type: mongoose.Schema.ObjectId, ref: 'UserModel'},
        dateCreated: Date,
    }, {collection: 'commentcollection'});

    return CommentSchema;
};
