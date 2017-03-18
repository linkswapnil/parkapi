/**
 * Created by navalaks on 11/14/16.
 */
var express = require('express'),
    router = express.Router(),
    parkingDAO = require('../../models/parking');

//CREATE a new parking
router.post('/addParking', function (req, res){
    parkingDAO.createParking({
            name: req.body.name,
            carParkingCount : req.body.carParkingCount,
            bikeParkingCount: req.body.bikeParkingCount,
            isPaid: req.body.isPaid,
            price : req.body.price,
            latitude: req.body.latitude,
            longitude : req.body.longitude,
            pinCode :  req.body.pinCode,
            state : req.body.state,
            country : req.body.country
        }, {
            success: function(f){
                res.status(201).send({message: 'Parking '+ f.name + ' code: ' + f._id +' added successfully', data: f});
            },
            error: function(err){
                if(err.code === 11000){
                    res.status(500).send({
                        "message" : "Product already added!"
                    });
                }else{
                    console.log(err);
                    res.status(500).send({message : "Failed to create Product"});
                }
            }
        });
});


//READ all parking's
router.get('/getAll', function(req, res) {
    parkingDAO.getParkings({
            success: function(parkings){
                res.status(200).send(JSON.stringify(parkings));
            },
            error: function(err){
                res.status(500).send(err);
            }
        });
});


module.exports = router;
