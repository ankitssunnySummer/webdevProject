/**
 * Created by Ankit on 11/10/2016.
 */
module.exports = function() {

    var mongoose = require("mongoose");
    var UserSchema = require("./user.schema.server")(mongoose);
    var UserModel = mongoose.model("UserModel", UserSchema);

    var api = {
        createUser               : createUser,
        findUserById             : findUserById,
        findUserByUsername       : findUserByUsername,
        findUserByCredentials    : findUserByCredentials,
        updateUser               : updateUser,
        deleteUser               : deleteUser,
        findUserByFacebookId     : findUserByFacebookId,
        findAllUsers             : findAllUsers,
        findUsersById            : findUsersById
    };
    return api;

    function findUserByFacebookId(facebookId) {
        return UserModel.findOne({'facebook.id': facebookId});
    }

    function createUser(user) {
        user.dateCreated = Date.now();
        return UserModel.create(user)
    }

    function findUserById(userId) {
        return UserModel.findOne({_id: userId});
    }

    function findUserByUsername(username) {
        return UserModel.findOne({username: username})
    }

    function findUserByCredentials(username, password) {
        return UserModel.findOne({username: username, password: password});
    }

    function updateUser(userId, user) {
        return UserModel.findOneAndUpdate({_id: userId}, {
            username    : user.username,
            password    : user.password,
            firstName   : user.firstName,
            lastName    : user.lastName,
            email       : user.email,
            phone       : user.phone,
            profilePic   : user.profilePic
        })
    }

    function deleteUser(userId) {
        return UserModel.remove({_id: userId});
    }

    function findAllUsers() {
        return UserModel.find({});
    }

    function findUsersById(ids) {
        var iDs = ids.split(',');
        return UserModel.find({
            '_id': { $in: iDs}});
    }
};