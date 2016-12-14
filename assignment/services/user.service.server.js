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

    var bcrypt = require("bcrypt-nodejs");
    var http = require('http');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    passport.use('user', new LocalStrategy(localStrategy));

    app.get("/api/user", findUser);
    app.get("/api/user/:uid", findUserById);
    app.put("/api/user/:uid", updateUser);
    app.delete("/api/user/:uid", deleteUser);

    app.post  ('/api/login', passport.authenticate('user'), login);
    app.post('/api/logout', logout);
    app.post ('/api/register', register);
    app.get ('/api/loggedin', loggedin);
    app.post ("/api/imageUpload", upload.single('uploadedFile'), uploadImage);
    app.get("/api/ebayRequest/:searchTerm", searchEBay);
    app.get('/api/allusers', findAllUsers);


    function searchEBay(req, resp) {
        var searchTerm  = req.params.searchTerm;
        var url = "http://svcs.ebay.com/services/search/FindingService/v1";
        url += "?OPERATION-NAME=findItemsByKeywords";
        url += "&SERVICE-VERSION=1.0.0";
        url += "&SECURITY-APPNAME=AnkitSha-EBayAPI-PRD-a45ed6035-1dcac106";
        url += "&GLOBAL-ID=EBAY-US";
        url += "&RESPONSE-DATA-FORMAT=JSON";
        // url += "&callback=callback";
        url += "&REST-PAYLOAD";
        url += "&keywords=" + searchTerm;
        url += "&paginationInput.entriesPerPage=10";
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
                    //callback(body);
                    //resp.send(body);

                    parsed = JSON.parse(body);
                    items = parsed.findItemsByKeywordsResponse[0].searchResult[0].item || [];
                    console.log(items);
                    resp.send(items);
                });
            },
        function (err) {
            console.log("Error occurred: " + err);
            resp.sendStatus(500);
        });
        console.log(items);
    }

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

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.admin : '0');
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

    function localStrategy(username, password, done) {
        UserModel
            .findUserByUsername(username)
            .then(
                function(user) {

                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    }
                    else {
                        console.log(user);
                        console.log("There appears to be some error.");
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
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

    function findAllUsers() {
        UserModel
            .findAllUsers
            .then(
                function (users) {
                    resp.json(users);
                },
                function (error) {
                    console.log("Error while retrieving all users: " + error);
                });
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
        console.log("Inside login server");
        var user = req.user;
        res.json(user);
    }


    function adminLogout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function adminLoggedin(req, res) {
        console.log("Inside adming loogedd in.");
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
        console.log("Username: " +username + "  Password: " +password);
        console.log("Inside Admin Service server")
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
        console.log("Inside  find admin by ID.");

        var userId = req.params.aId;
        AdminModel
            .findAdminById(userId)
            .then(
                function (user) {
                    resp.json(user);
                },
                function (error) {
                    console.log("Find Admin By ID failed: " + error);
                }
            )
    }




};