/**
 * Created by Ankit on 11/10/2016.
 */
module.exports = function() {

    var mongoose = require("mongoose");
    var FriendSchema = require("./friends.schema.server")(mongoose);
    var FriendModel = mongoose.model("FriendModel", FriendSchema);

    var api = {
        addFriends                 : addFriends,
        removeFriend               : removeFriend,
        findAllFriends             : findAllFriends,
        findRelationship           : findRelationship
    };
    return api;

    function findRelationship(user1, user2) {
        return FriendModel.find({ user: user1,
            friends: user2 });
    }

    function addFriends(user1, user2) {
        return FriendModel.findOneAndUpdate({user: user2},
            {$push: {"friends": user1}},
            {safe: true, upsert: true, new : true}
        );
    }

    function removeFriend(user1, user2) {
        return FriendModel.update({user: user1},
            {$pull: {"friends": user2._id}},
            {safe: true, upsert: true, new : true}
        );
    }

    function findAllFriends(user) {
        return FriendModel.find({user: user});
    }
};