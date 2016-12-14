var cookieParser = require('cookie-parser');
var session      = require('express-session');
var passport     = require('passport');
var bodyParser   = require('body-parser');
var express      = require('express');
var request      = require('request');
var app = express();

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'this is the secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//require ("./test/app.js")(app);
require("./assignment/app.js")(app);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ipaddress);