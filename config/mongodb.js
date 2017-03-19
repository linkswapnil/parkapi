var mongoose = require('mongoose');

function _init(){
    try{
        let host = process.env.MONGO_HOST || "localhost";
        return mongoose.createConnection("mongodb://" + host + "/parkdb");
    }catch(err){
        console.log("No internet connection :(");
    }
};

module.exports.init = _init;
