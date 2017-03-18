// dependencies
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var routes = require('./routes/index');

var parkingAPI = require('./routes/api/parkingapi');

var app = express();

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

function validateAuthToken (username, authToken, callbacks) {
    return Account.find({username : username, authToken: authToken}, function (err, account) {
        if(account && account.length > 0){
            callbacks.success(account[0]);
        }else {
            callbacks.error(err);
        }
        return false;
    });
};


// mongoose
mongoose.connect('mongodb://localhost/parkdb');


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'park easy',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

routes.post('/login', passport.authenticate('local',{
    successRedirect: '/home',
    failureRedirect: '/login'
}));

routes.get('/home', function (req, res) {
    if (!req.user) return res.redirect(301, '/login');
    res.render('home', {user: req.user});
});

routes.get('/user', function (req, res) {
    if (!req.user) return res.redirect(301, '/login');
    res.render('home', {user: req.user});
});

app.use('/', routes);
app.get('*', function(req, res, next) {
    let username = req.body.username || req.query.username;
    let authToken = req.body.authToken || req.query.authToken;
    validateAuthToken(username, authToken ,{
        success: function(result){
           if(result){
               next();
           }
        },
        error: function(err){
            res.status(403).send({
                message : 'unAuthorized'
            });
        }
    });
});
app.use('/parking', parkingAPI);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.redirect(301, '/login');
        return;
    }
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});


module.exports = app;
