var db = require('../config/mongodb').init();
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);
var Schema = mongoose.Schema;

var parkingAttributes = {
    parkingId:      { type: Number, required: true, unique: true },
    name:           { type: String, required: true},
    carParkingCount:{ type: Number, default: 0 },
    bikeParkingCount:{ type: Number, default: 0 },
    isPaid:         { type: Boolean, required:true },
    price:          { type: Number, default: 0 },
    latitude:       { type: Number, default: 0 },
    longitude:      { type: Number, default: 0 },
    pinCode:        { type: Number },
    state:          { type: String },
    country:        { type: String, default: 'india' },
    dateCreated:    { type: Date },
    dateModified:   { type: Date },
    createdBy:      { type: String },
    editedBy:       { type: String }
};

var ParkingSchema = new Schema(parkingAttributes);

ParkingSchema.plugin(autoIncrement.plugin, { model: 'Parking', field: 'parkingId',  startAt: 100 });

ParkingSchema.pre('save', function(next){
    var now = new Date();
    this.dateModified = now;
    if ( !this.dateCreated ) {
        this.dateCreated = now;
    }
    next();
});

var ParkingModel = db.model('Parking', ParkingSchema);

//CREATE new Parking
function createParking(Parking, callbacks){

    var f = new ParkingModel(Parking);

    f.save(function (err) {
        if (!err) {
            callbacks.success(f._doc);
        } else {
            callbacks.error(err);
        }
    });
}

//READ all Parkings
function getParkings(callbacks){
    return ParkingModel.find()
        .sort('-name').exec('find', function (err, Products) {
            if (!err) {
                callbacks.success(Products);
            } else {
                callbacks.error(err);
            }
        });
}


module.exports.createParking = createParking;
module.exports.getParkings = getParkings;

