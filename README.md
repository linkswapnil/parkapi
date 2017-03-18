In order to access api you will have to first hit the register route(/register) to generate authToken
I have created two api's
1:) GET : parking/getall?username={{your userName}}&authToken={{your authToken}}
2:) POST : parking/addParking?username={{your userName}}&authToken={{your authToken}}
 {
    "name":	String,
    "carParkingCount": Number,
    "bikeParkingCount":Number,
    "isPaid":         Boolean,
    "price":         Number,
    "latitude":       Number,
    "longitude":      Number,
    "pinCode":        Number,
    "state":          String,
    "country":        String
    "authToken":      String,
    "username":       String
}