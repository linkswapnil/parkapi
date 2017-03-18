var mongoose = require('mongoose');

function _init(){
    try{
        return mongoose.createConnection('mongodb://localhost/parkdb');
    }catch(err){
        console.log("No internet connection :(");
    }
};

module.exports.init = _init;
