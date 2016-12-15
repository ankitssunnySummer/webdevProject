/**
 * Created by Ankit on 11/10/2016.
 */
module.exports = function() {
    var mongoose = require("mongoose");
    var ReviewSchema = mongoose.Schema({
        reviewer    :{type: mongoose.Schema.ObjectId, ref: 'UserModel'},
        review      : String,
        itemName    : String,
        galleryUrl  : String,
        dateCreated : Date
    }, {collection  : 'reviewcollection'});

    return ReviewSchema;
};
