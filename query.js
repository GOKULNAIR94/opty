module.exports = function query( req, res, urlPath, callback ) {
    var http = require('https');
    
    var uname = 'gokuln';
    var pword = 'Goklnt@1';
    
    console.log("urlPath : " + urlPath);
    options = {
        host: 'cbhs-test.crm.us2.oraclecloud.com',
        path: urlPath,
        headers: {
            'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64')
        }
    };

    request = http.get(options, function(resx) {
        responseString = "";
        resx.on('data', function(data) {
            responseString += data;
        });
        resx.on('end', function() {
            resObj = JSON.parse(responseString);
            console.log("resObj : " + resObj);
            callback(resObj);
        });
        resx.on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    });
}