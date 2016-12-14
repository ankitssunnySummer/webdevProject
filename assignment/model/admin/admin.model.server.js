/**
 * Created by Ankit on 11/10/2016.
 */
module.exports = function() {

    var mongoose = require("mongoose");
    var AdminSchema = require("./admin.schema.server.js")(mongoose);
    var AdminModel = mongoose.model("AdminModel", AdminSchema);

    var api = {
        createAdmin     : createAdmin,
        updateAdmin     : updateAdmin,
        deleteUser      : deleteUser,
        findAdmin       : findAdmin,
        findAdminById   : findAdminById
    };
    return api;

    function createAdmin(admin) {
        admin.dateCreated = Date.now();
        return AdminModel.create(admin)
    }

    function findAdminById(userId) {
        return AdminModel.findOne({_id: userId});
    }

    function updateAdmin(adminId, user) {
        return AdminModel.update({_id: adminId}, {
            username    : user.username,
            password    : user.password,
            firstName   : user.firstName,
            lastName    : user.lastName,
            email       : user.email,
            phone       : user.phone
        })
    }

    function findAdmin(username) {
        return AdminModel.findOne({username: username})
    }


    function deleteUser(userId) {
     //   return UserModel.remove({_id: userId});
    }
};