var db = require('../config/mongodb').init();
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);
var Schema = mongoose.Schema;

var userAttributes = {
    userId:         { type: Number, required: true, unique: true },
    mobileNumber:   { type: String, required: true, unique: true },
    verificationCode : { type: String },
    name:           { type: String },
    emailId:        { type: String },
    dateCreated:    { type: Date },
    createdBy:      { type: String },
    isVerified:     { type: Boolean, default: false }
};

var UserSchema = new Schema(userAttributes);

UserSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'userId',  startAt: 100 });

UserSchema.pre('save', function(next){
    let now = new Date();
    this.dateModified = now;
    if ( !this.dateCreated ) {
        this.dateCreated = now;
    }
    next();
});

var UserModel = db.model('User', UserSchema);

//CREATE new User
function createUser(User, callbacks){

    var f = new UserModel(User);

    f.save(function (err) {
        if (!err) {
            callbacks.success(f._doc.userId, f._doc.mobileNumber);
        } else {
            callbacks.error(err);
        }
    });
}

// Tank.update({ _id: id }, { $set: { size: 'large' }}, callback);

//READ all Users
function verify(userInfo, callbacks){
    return UserModel.findOne({ name: userInfo.name, verificationCode: userInfo.verificationCode, mobileNumber : userInfo.mobileNumber},
        function (err, user) {
        if(!user){
            callbacks.error('No record found');
        } else if(err){
            console.log(err);
            callbacks.error(err)
        }else{
            if(user.isVerified){
                callbacks.error('User already Verified');
            }else{
                user.isVerified = true;
                user.save(function (err, user) {
                    if(err){
                        callbacks.error('Error updating user');
                    }else{
                        callbacks.success('User verified');
                    }
                })
            }
        }
    });
}

//DELETE Product
function deleteUser(userInfo, callbacks) {
    return UserModel.findOne({userId  : userInfo.id, mobileNumber : userInfo.mobileNumber}, function (err, f) {
        if (!err) {
            return f.remove(function (err) {
                if (!err) {
                    if(callbacks)
                        callbacks.success(f._doc);
                } else {
                    if(callbacks)
                        callbacks.error(err);
                }
            });
        } else {
            callbacks.error(err);
        }
    });
}


module.exports.createUser = createUser;
module.exports.verify = verify;
module.exports.deleteUser = deleteUser;

