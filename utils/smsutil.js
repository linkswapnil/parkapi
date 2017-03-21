/**
 * Created by sno1086 on 3/21/17.
 */
var https = require('https');

function sendSms(text, mobileNumber) {
    var sender='txtlcl';
    var data= `authkey=${process.env.smsAPIHashKey}&mobiles=${mobileNumber}&message=${encodeURI(text)}&sender=${sender}&route=4&country=91&response=json`;
    var options = {
        host: 'control.msg91.com',
        path: '/api/sendhttp.php?'+data
    };

    return new Promise((resolve, reject) => {
        var callback = function(response) {
            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function (chunk) {
                str += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            response.on('end', function () {
                console.log(str);
                resolve(str);
            });
        };
        resolve();
        //https.request(options, callback).end();
    });
}

module.exports = { sendSms };