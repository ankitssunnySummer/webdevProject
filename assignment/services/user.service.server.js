module.exports = function(app, models) {

    var UserModel = models.UserModel;


    var bcrypt = require("bcrypt-nodejs");
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var facebookConfig =  {
            clientID     : process.env.FACEBOOK_CLIENT_ID,
            clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL  : process.env.FACEBOOK_CALLBACK_URL
    };

    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

    app.get("/api/user", findUser);
    app.post("/api/user", createUser);
    app.get("/api/user/:uid", findUserById);
    app.put("/api/user/:uid", updateUser);
    app.delete("/api/user/:uid", deleteUser);
    app.post  ('/api/login', passport.authenticate('local'), login);
    app.post('/api/logout', logout);
    app.post ('/api/register', register);
    app.get ('/api/loggedin', loggedin);
    app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.get('/profile', profile);
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/assignment/#/login'
        }));

    function profile(req, resp) {
        var user = req.user;
        resp.redirect("/assignment/index.html#/user/" + user._id);
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
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
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
                        console.log("sucess");
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

    function facebookStrategy(token, refreshToken, profile, done) {
        UserModel
            .findUserByFacebookId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    }
                    else {
                        // Creating a new user with the profile ID and logging in.
                        var user = {
                            facebook : {
                                id: profile.id
                            }
                        };
                        UserModel
                            .createUser(user)
                            .then(
                                function (returnedUser) {
                                    return done(null, returnedUser);
                                },
                                function (error) {
                                    console.log("Error creating User: " + error);
                                });
                    }
                },
                function(error) {
                    console.log("Error occurred: " + error);
                });
    }

    function createUser(req, resp) {
        var user = req.body;
        UserModel
            .findUserByUsername(user.username)
            .then (
                function (returnedUser) {
                    if (returnedUser == null) {
                        UserModel
                            .createUser(user)
                            .then(
                                function (createdUser) {
                                    resp.json(createdUser);
                                },
                                function (error) {
                                    console.log("Creating User failed:" + error);
                                }
                            );
                    }
                    else {
                        resp.json(null);
                    }
                },
                function (error) {
                    console.log("Creating User failed:" + error);
                }
            )
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
};