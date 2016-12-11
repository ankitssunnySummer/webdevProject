/**
 * Created by Ankit on 11/10/2016.
 */
module.exports = function() {
    var mongoose = require("mongoose");
    var WidgetSchema = mongoose.Schema({
        _page       : {type: mongoose.Schema.ObjectId, ref: 'PageModel'},
        type        : {type: String, enum:['HEADING', 'IMAGE', 'YOUTUBE', 'HTML', 'INPUT', 'TEXT']},
        name        : String,
        text        : String,
        placeholder : String,
        description : String,
        url         : String,
        width       : String,
        height      : String,
        rows        : {type: Number, default: 10},
        size        : {type: Number, default: 10},
        class       : String,
        icon        : String,
        deletable   : Boolean,
        formatted   : Boolean,
        dateCreated : Date
    },{
        collection  : 'widgetcollection'
    });
    return WidgetSchema;
};
