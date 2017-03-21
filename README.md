### Setup Instruction

1. Install mongodb(3.4.2)
2. git clone https://github.com/linkswapnil/parkapi/
3. cd parkapi
4. npm install
5. node bin/www.js

### Registering for api access
In order to access api you will have to first hit the register route(/register) to generate authToken

### Api's available

1.GET : parking/getall?username={{your userName}}&authToken={{your authToken}}

2.POST : parking/addParking

Payload body
 ```
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
```

3.POST: user/generateOTP

Payload body
 ```
 {
    "name":	*String(name of the user),
    "mobileNumber": *String(users mobile number),
    "bikeParkingCount":Number,
    "emailId":         String(users email id),
    "authToken":      *String (Api access token),
    "username":       *String(Api access username)
}
```

4.POST: user/verifyOTP

Payload body
 ```
 {
    "name":	*String(name of the user),
    "mobileNumber": *String(users mobile number),
    "verificationCode":*String,
    "authToken":      *String (Api access token),
    "username":       *String(Api access username)
}
```