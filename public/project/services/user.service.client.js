/**Created by Ankit on 10/13/2016.*/
(function() {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService($http) {
        var api = {
            findUserById          : findUserById,
            findUserByUsername    : findUserByUsername,
            findUserByCredentials : findUserByCredentials,
            updateUser            : updateUser,
            deleteUser            : deleteUser,
            login                 : login,
            logout                : logout,
            register              : register,
            createComment         : createComment,
            findAllCommentsOnUser : findAllCommentsOnUser,
            findAllCommentsByUser : findAllCommentsByUser,
            deleteComment         : deleteComment,
            findAllUsers          : findAllUsers,
            findAllFriends        : findAllFriends,
            findFriendsByID       : findFriendsByID,
            addFriend             : addFriend,
            removeFriend          : removeFriend,
            searchEBay            : searchEBay,
            findRelationShip      : findRelationShip,
            addReview             : addReview,
            findReviewsForUser    : findReviewsForUser,
            removeReview          : removeReview

        }
        return api;

        function findRelationShip(uId1, uId2) {
            return $http.get('/api/findRelationship/' +uId1+ '/' + uId2);
        }

        function addFriend(uId1, uId2) {
            return $http.put('/api/addFriends/' +uId1+ '/' + uId2);
        }

        function removeFriend(uId1, uId2) {
            return $http.put('/api/removeFriend/' +uId1+ '/' + uId2);
        }

        function findFriendsByID(ids) {
            return $http.get('/api/findFriendsbyId/'+ ids);
        }

        function searchEBay(searchTerm) {
            return $http.get("/api/ebayRequest/"+ searchTerm);
        }

        function login(user) {
            return $http.post("/api/login", user);
        }

        function logout(user) {
            return $http.post("/api/logout");
        }

        function register(user) {
            return $http.post("/api/register", user);
        }

        function findUserById(id) {
            return $http.get('/api/user/' + id);
        }

        function findAllUsers() {
            return $http.get('/api/allusers');
        }

        function findAllFriends(userId) {
           return $http.get('/api/allFriends/' + userId);
        }
        function findUserByUsername(username) {
            return $http.get('/api/user?username=' + username);
        }

        function findUserByCredentials(username, password) {
            return $http.get('/api/user?username=' + username + '&password=' + password);
        }

        function updateUser(userId, user) {
            return $http.put('/api/user/' + userId, user);
        }

        function  deleteUser(userId) {
            return $http.delete('/api/user/' + userId);
        }

        function createComment(comment) {
            return $http.post('/api/createComment/', comment);
        }
        
        function findAllCommentsOnUser(userId) {
            return $http.get('/api/allCommentsOnUser/' + userId);
        }

        function findAllCommentsByUser(userId) {
            return $http.get('/api/allCommentsByUser/' + userId);
        }

        function deleteComment(commentId) {
            return $http.delete('/api/deleteComment/' + commentId);
        }
        function addReview(review) {
            return $http.post("/api/addReview/", review );
        }
        function findReviewsForUser(userId) {
            return $http.get("/api/allReviewsForUser/" + userId);
        }

        function removeReview(reviewId) {
            return $http.delete("/api/removeReview/" + reviewId);

        }
    }
})();