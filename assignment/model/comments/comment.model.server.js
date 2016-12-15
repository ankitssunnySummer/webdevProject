/**
 * Created by Ankit on 11/10/2016.
 */
module.exports = function() {

    var mongoose = require("mongoose");
    var CommentSchema = require("./comment.schema.server")(mongoose);
    var CommentModel = mongoose.model("CommentModel", CommentSchema);

    var api = {
        createComment               : createComment,
        findAllCommentsByUser       : findAllCommentsByUser,
        findAllCommentsOnUser       : findAllCommentsOnUser,
        deleteComment               : deleteComment
    };
    return api;

    function createComment(comment) {
        comment.dateCreated = Date.now();
        return CommentModel.create(comment)
    }

    function findAllCommentsByUser(user) {
        return CommentModel.find({commentBy: user});
    }

    function findAllCommentsOnUser(user) {
        return CommentModel.find({commentOn: user});
    }

    function deleteComment(commentId) {
        return CommentModel.remove({_id: commentId});
    }
};