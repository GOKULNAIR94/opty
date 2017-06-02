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
            try{
                resObj = JSON.parse(responseString);
                console.log("resObj : " + resObj);
                speech = "";
                if( resObj.count == 0 ){
                    speech = "No results found";
                    res.json({
                        speech: speech,
                        displayText: speech,
                        //source: 'webhook-OSC-oppty'
                    })
                }
                else
                    callback(resObj);
            }
            catch(error){
                speech = "Oh No! Something went wrong!";
                console.log( "Error : " + error);
                return res.json({
                        speech: speech,
                        displayText: speech,
                        //source: 'webhook-OSC-oppty'
                    })
            }
        });
        resx.on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    });
}