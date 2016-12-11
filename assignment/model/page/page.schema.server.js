/**
 * Created by Ankit on 11/10/2016.
 */
module.exports = function() {
    var mongoose = require("mongoose");
    var PageSchema = mongoose.Schema({
        _website: {type: mongoose.Schema.ObjectId, ref: 'WebsiteModel'},
        name: String,
        title: String,
        description: String,
        widgets: [{type: mongoose.Schema.ObjectId, ref: 'WidgetModel'}],
        dateCreated: Date
    }, {collection: 'pagecollection'});

    return PageSchema;
};
