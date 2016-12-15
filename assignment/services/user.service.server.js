module.exports = function(app, models) {
    var mime = require('mime');
    var multer = require('multer');

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname+'/../../public/uploads')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
        }
    });

    var upload = multer({ storage: storage });
    var UserModel = models.UserModel;
    var FriendModel = models.FriendModel;
    var CommentModel = models.CommentModel;
    var ReviewModel   = models.ReviewModel;
    var bcrypt = require("bcrypt-nodejs");
    var http = require('http');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    app.get("/api/user", findUser);
    app.get("/api/user/:uid", findUserById);
    app.get('/api/allusers', findAllUsersinDB);
    app.get('/api/allFriends/:uid', findAllFriends);
    app.get('/api/findFriendsbyId/:ids', findFriendsById);
    app.get('/api/allCommentsOnUser/:uid', allCommentsOnUser)
    app.get('/api/allCommentsByUser/:uid', findAllCommentsByUser);
    app.get("/api/allReviewsForUser/:uid", findAllReviewsForUser);
    app.get("/api/ebayRequest/:searchTerm", searchEBay);
    app.get('/api/findRelationship/:uId1/:uId2', findRelationship);
    app.get ('/api/loggedin', loggedin);

    app.post  ('/api/login', passport.authenticate('user'), login);
    app.post('/api/logout', logout);
    app.post ('/api/register', register);
    app.post('/api/createComment/', createComment);
    app.post('/api/addReview/', addReview);
    app.post ("/api/imageUpload", upload.single('uploadedFile'), uploadImage);

    app.put('/api/addFriends/:uId1/:uId2', addFriends);
    app.put('/api/removeFriend/:uId1/:uId2', removeFriend);
    app.put("/api/user/:uid", updateUser);

    app.delete("/api/user/:uid", deleteUser);
    app.delete("/api/deleteComment/:cid", deleteComment);
    app.delete("/api/removeReview/:reviewId", removeReview);



    function deleteComment(req, resp) {
        var commentId = req.params.cid;
        CommentModel
            .deleteComment(commentId)
            .then(
                function (succ) {
                    resp.json(succ);
                },
                function (err) {
                    console.log("Error: " +err);
                });
    }

    function addReview(req, resp) {
        var review = req.body;
        ReviewModel
            .createReview(review)
            .then(
                function (success) {
                    resp.json(success);
                },
                function (err) {
                    console.log("Error: " +err);
                });
    }

    function removeReview(req, resp) {
        var reviewId = req.params.reviewId;
        ReviewModel
            .deleteReview(reviewId)
            .then(
                function (success) {
                    resp.json(success);
                },
                function (err) {
                    console.log("Error: " +err);
                });
    }


    function findAllReviewsForUser(req, resp) {
        var userId = req.params.uid;
        UserModel
            .findUserById(userId)
            .then(
                function (user) {
                    ReviewModel
                        .findAllReviewsByUser(user)
                        .then(
                            function (success) {
                                console.log(success);
                                resp.json(success);
                            },
                            function (err) {
                                console.log("Error: " +err);
                            });
                },
                function (err) {
                    console.log("Error: " +err);
                });
    }

    passport.use('user', new LocalStrategy(localStrategy));
    passport.serializeUser(function(user, done) {
        if (isUser(user)) {
            done(null, user);
        } else {
            done(null, user);
        }
    });

    passport.deserializeUser(function(user, done) {
        if (isUser(user)) {
            UserModel
                .findUserById(user._id)
                .then(
                    function(user){
                        done(null, user);
                    },
                    function(err){
                        done(err, null);
                    }
                );
        }
        else {
            AdminModel
                .findAdminById(user._id)
                .then(
                    function(user){
                        done(null, user);
                    },
                    function(err){
                        done(err, null);
                    }
                );
        }
    });

    function isUser(user) {
        if (user.gender == undefined)
            return false;
        else return true;
    }


    function findUser(req, resp) {
        var query = req.query;
        if (query.username && query.password) {
            findUserByCredentials(req, resp);
        }
        else if(query.username) {
            findUserByUsername(req, resp);
        }
    }

    function findUserById(req, resp) {
        var userId = req.params.uid;
        UserModel
            .findUserById(userId)
            .then(
                function (user) {
                    resp.json(user);
                },
                function (error) {
                    console.log("Find User By ID failed: " + error);
                }
            )
    }

    function findAllUsersinDB(req, resp) {
        UserModel
            .findAllUsers()
            .then(
                function (users) {
                    resp.json(users);
                },
                function (error) {
                    console.log("Error while retrieving all users: " + error);
                });
    }

    function findUserByUsername(req, resp) {
        var username = req.query.username;
        UserModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    resp.json(user);
                },
                function (error) {
                    console.log("failed in User Server: " + error);
                }
            );
    }

    function findUserByCredentials(req, resp) {
        var username = req.query.username;
        var password = req.query.password;
        UserModel
            .findUserByCredentials(username, password)
            .then(
                function (user) {
                    resp.json(user);
                },
                function (error) {
                    console.log("Find by credentials failed: " + error);
                }
            )
    }

    function findAllFriends(req, resp) {
        var userId = req.params.uid;

        UserModel
            .findUserById(userId)
            .then(
                function (user) {
                    FriendModel
                        .findAllFriends(user)
                        .then(
                            function (users) {
                                resp.json(users)
                            },
                            function (err) {
                                console.log("error: " +err);
                            })},
                function (err) {
                    console.log("Error: " + err);
                });
    }

    function findFriendsById(req, resp) {
        var ids = req.params.ids;
        UserModel
            .findUsersById(ids)
            .then(
                function (users) {
                    resp.json(users)
                },
                function (err) {
                    console.log("Error: " +err);
                });

    }

    function allCommentsOnUser(req, resp) {
        var userId = req.params.uid;
        UserModel
            .findUserById(userId)
            .then(
                function (user) {
                    CommentModel
                        .findAllCommentsOnUser(user)
                        .then(
                            function (comments) {
                                resp.send(comments);
                            },
                            function (err) {
                                console.log("Error: " +err);
                            });
                },
                function (err) {
                    console.log("Error: " +err);
                })
    }

    function findAllCommentsByUser(req, resp) {
        var userId = req.params.uid;
        UserModel
            .findUserById(userId)
            .then(
                function (user) {
                    CommentModel
                        .findAllCommentsByUser(user)
                        .then(
                            function (comments) {
                                resp.send(comments);
                            },
                            function (err) {
                                console.log("Error: " +err);
                            });
                },
                function (err) {
                    console.log("Error: " +err);
                });
    }

    function searchEBay(req, resp) {
        var searchTerm  = req.params.searchTerm;
        var url = "http://svcs.ebay.com/services/search/FindingService/v1";
        url += "?OPERATION-NAME=findItemsByKeywords";
        url += "&SERVICE-VERSION=1.0.0";
        url += "&SECURITY-APPNAME=AnkitSha-EBayAPI-PRD-a45ed6035-1dcac106";
        url += "&GLOBAL-ID=EBAY-US";
        url += "&RESPONSE-DATA-FORMAT=JSON";
        url += "&REST-PAYLOAD";
        url += "&keywords=" + searchTerm;
        url += "&paginationInput.entriesPerPage=6";
        var body = '';
        var parsed = '';
        var items = '';
        http.get(url,
            function(response) {
                // Continuously update stream with data
                response.on('data', function(d) {
                    body += d;
                });
                response.on('end', function() {
                    parsed = JSON.parse(body);
                    items = parsed.findItemsByKeywordsResponse[0].searchResult[0].item || [];
                    resp.send(items);
                });
            },
            function (err) {
                console.log("Error occurred: " + err);
                resp.sendStatus(500);
            });
    }

    function findRelationship(req, resp) {
        var uId1 = req.params.uId1;
        var uId2 = req.params.uId2;

        var user1, user2;
        UserModel
            .findUserById(uId1)
            .then(
                function (user) {
                    user1 = user;
                    UserModel
                        .findUserById(uId2)
                        .then(
                            function (user) {
                                user2 = user;
                                FriendModel
                                    .findRelationship(user1, user2)
                                    .then(
                                        function (success){
                                            resp.json(success);
                                        },
                                        function (err) {
                                            console.log("Some err occurred: " + err);
                                        });
                            },
                            function (error) {
                                console.log("Find User By ID failed: " + error);
                            }
                        )

                },
                function (error) {
                    console.log("Find User By ID failed: " + error);
                }
            );
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.admin : '0');
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function register (req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        UserModel
            .createUser(user)
            .then(
                function(user){
                    if(user){
                        req.login(user, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                }
            );
    }

    function createComment(req, resp) {
    //return $http.post('/api/createComment/', comment);
        var comment = req.body;
        CommentModel
            .createComment(comment)
            .then(
                function (success) {
                    resp.json(success);
                },
                function (err) {
                    console.log("error: " + err);
                });

    }
    function localStrategy(username, password, done) {
        UserModel
            .findUserByUsername(username)
            .then(
                function(user) {

                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    }
                    else {
                        console.log("There appears to be some error.");
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function uploadImage(req, resp) {
        var user;
        var userId        = req.body.userId;
        var myFile        = req.file;
        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename ;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to

        UserModel
            .findUserById(userId)
            .then(
                function (userFound) {
                    user = userFound;
                    // now setting the url of this User to be the file name that was created
                    user.profilePic = '/uploads/'+filename;

                    UserModel
                        .updateUser(userId, user)
                        .then(
                            function (updatedUser) {
                                resp.redirect('../project/#/user/'+userId);
                            },
                            function (error) {
                                console.log("Error while updating widget: " + error);
                            }
                        );
                },
                function (error) {
                    console.log("Error while uploading image: " + error);
                });
    }

    function addFriends(req, resp) {
        var uId1 = req.params.uId1;
        var uId2 = req.params.uId2;

        var user1, user2;
        UserModel
            .findUserById(uId1)
            .then(
                function (user) {
                    user1 = user;
                    UserModel
                        .findUserById(uId2)
                        .then(
                            function (user) {
                                user2 = user;
                                FriendModel
                                    .addFriends(user1, user2)
                                    .then(
                                        function (success){
                                            FriendModel
                                                .addFriends(user2, user1)
                                                .then(
                                                    function (success){
                                                        resp.json(success);
                                                    },
                                                    function(err){
                                                        console.log("Error: " +err)})},
                                        function (err) {
                                            console.log("Some err occurred: " + err);
                                        });
                            },
                            function (error) {
                                console.log("Find User By ID failed: " + error);
                            }
                        )

                },
                function (error) {
                    console.log("Find User By ID failed: " + error);
                }
            );
    }

    function removeFriend(req, resp) {
        var uId1 = req.params.uId1;
        var uId2 = req.params.uId2;

        var user1, user2;
        UserModel
            .findUserById(uId1)
            .then(
                function (user) {
                    user1 = user;
                    UserModel
                        .findUserById(uId2)
                        .then(
                            function (user) {
                                user2 = user;
                                FriendModel
                                    .removeFriend(user1, user2)
                                    .then(
                                        function (success){
                                            FriendModel
                                                .removeFriend(user2, user1)
                                                .then(
                                                    function (success){
                                                        resp.json(success);
                                                    },
                                                    function(err){
                                                        console.log("Error: " +err)})},
                                        function (err) {
                                            console.log("Some err occurred: " + err);
                                        });
                            },
                            function (error) {
                                console.log("Find User By ID failed: " + error);
                            }
                        )

                },
                function (error) {
                    console.log("Find User By ID failed: " + error);
                }
            );
    }

    function updateUser(req, resp) {
        var user = req.body;
        UserModel
            .updateUser(user._id, user)
            .then (
                function (user) {
                    resp.json(user)
                },
                function (error) {
                    console.log("Update User failed: " + error);
                }
            )
    }

    function  deleteUser(req, resp) {
        var userId = req.params.uid;
        UserModel
            .deleteUser(userId)
            .then(
                function (user) {
                    resp.json(user)
                },
                function (error) {
                    console.log("Delete User failed: " + error);
                }
            );
    }
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// Now defining services for Admin User
    var AdminModel = models.AdminModel;
    passport.use('admin', new LocalStrategy(adminStrategy));
    app.post('/api/admin/login', passport.authenticate('admin'), adminLogin);
    app.post('/api/admin/logout', adminLogout);
    app.post ('/api/admin/register', registerAdmin);
    app.get('/api/admin/allusers', findAllUsers);
    app.get("/api/admin/:uid", findAdminById);
    app.get ('/api/admin/loggedin', adminLoggedin);

    function adminLogin(req, res) {
        var user = req.user;
        res.json(user);
    }


    function adminLogout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function adminLoggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function registerAdmin (req, res) {
        var admin = req.body;
        admin.password = bcrypt.hashSync(admin.password);
        AdminModel
            .createAdmin(admin)
            .then(
                function(admin){
                    if(admin){
                        req.login(admin, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(admin);
                            }
                        });
                    }
                }
            );
    }

    function adminStrategy(username, password, done) {
        AdminModel
            .findAdmin(username)
            .then(
                function(user) {
                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    }
                    else {
                        console.log("There appears to be some error.");
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) {
                        console.log("error:" + err);
                        return done(err); }
                }
            );
    }

    function findAllUsers(req, resp) {
        UserModel
            .findAllUsers()
            .then (
                function (users) {
                    resp.json(users);
                },
                function (err) {
                    console.log("Error occurred: " +err);
                }
            )
    }

    function findAdminById(req, resp) {
        var userId = req.params.aId;
        AdminModel
            .findAdminById(userId)
            .then(
                function (user) {
                    resp.json(user);
                },
                function (error) {
                    console.log("Find Admin By ID failed: " + error);
                });
    }
};