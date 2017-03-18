
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String,
    role : String,
    authToken : String,
    dateCreated: Date
});

Account.plugin(passportLocalMongoose);

Account.pre('save', function(next){
    var now = new Date();
    this.dateCreated = now;
    next();
});
module.exports = mongoose.model('Account', Account);
