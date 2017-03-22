/**
 * Created by navalaks on 11/14/16.
 */
var express = require('express'),
    router = express.Router(),
    userDAO = require('../../models/user'),
    smsUtil = require('../../utils/smsutil');

//CREATE a new parking
router.post('/generateOTP', function (req, res){
    let verificationCode = Math.floor(Math.random()*90000) + 10000;
    console.log("verificationCode for user", req.body.name," is : ", verificationCode);
    userDAO.createUser({
        mobileNumber : req.body.mobileNumber,
        name: req.body.name,
        emailId: req.body.emailId,
        createdBy : req.body.username,
        verificationCode: verificationCode
    }, {
        success: function(userId, mobileNumber){
            smsUtil.sendSms("Hello your OTP is : " + verificationCode, req.body.mobileNumber).then(() => {
                res.status(201).send({message: 'OTP sent'});
            }).catch((err)=>{
                userDAO.deleteUser({id: userId, mobileNumber});
                console.log(err);
                res.status(500).send({message : "Failed to send OTP"});
            });
        },
        error: function(err){
            if(err.code === 11000){
                res.status(500).send({
                    "message" : "User already exist!"
                });
            }else{
                console.log(err);
                res.status(500).send({message : "Failed to create User"});
            }
        }
    });
});


router.post('/verifyOTP', function(req, res) {
    var userInfo = {
        name : req.body.name,
        verificationCode: req.body.verificationCode,
        mobileNumber : req.body.mobileNumber
    };
            userDAO.verify(userInfo, {
                success: function(){
                    res.status(200).send("User verified");
                },
                error: function(err){
                    res.status(500).send(err);
                }
            });
});


module.exports = router;
