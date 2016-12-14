/**
 * Created by Ankit on 11/10/2016.
 */
module.exports = function() {

    var mongoose = require("mongoose");
    var FriendSchema = require("./friends.schema.server")(mongoose);
    var FriendModel = mongoose.model("FriendModel", FriendSchema);

    var api = {
        addFriends                 : addFriends,
        deleteFriend               : deleteFriend,
        findAllFriends             : findAllFriends,
        findRelationship           : findRelationship
    };
    return api;

    function findRelationship(user1, user2) {

        return FriendModel.find({ user: user1,
            friends: user2 });
    }

    function addFriends(user1, user2) {
        FriendModel.findOneAndUpdate({user: user1},
            {$push: {"friends": user2}},
            {safe: true, upsert: true},
            function(err, model) {
                var friends = {
                    user: user1,
                    friends: [user2]};
                FriendModel.create(friends);
                console.log(err);
            });

        FriendModel.findOneAndUpdate({user: user2},
            {$push: {"friends": user1}},
            {safe: true, upsert: true},
            function(err, model) {
                var friends = {
                    user: user2,
                    friends: [user1]};
                FriendModel.create(friends);
                console.log(err);
            });

        return;
    }

    function deleteFriend(userId) {
        return UserModel.remove({_id: userId});
    }

    function findAllFriends() {
        return UserModel.find({});
    }
};