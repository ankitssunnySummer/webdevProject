/**
 * Created by Ankit on 11/10/2016.
 */
module.exports = function() {

    var mongoose = require("mongoose");
    var ReviewSchema = require("./review.schema.server")(mongoose);
    var ReviewModel = mongoose.model("ReviewModel", ReviewSchema);

    var api = {
        createReview            : createReview,
        findAllReviewsByUser    : findAllReviewsByUser,
        findAllReviews          : findAllReviews,
        deleteReview            : deleteReview
    };
    return api;

    function createReview(review) {
        return ReviewModel.create(review);
    }

    function findAllReviewsByUser(userId) {
        return ReviewModel.find({reviewer: userId});
    }

    function findAllReviews() {
        return ReviewModel.find({});
    }

    function deleteReview(reviewId) {
        return ReviewModel.remove({_id: reviewId});
    }
};