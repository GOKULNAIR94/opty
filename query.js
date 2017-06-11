module.exports = function query( req, res, urlPath, callback ) {
    var http = require('https');
    
    var fs = require('fs');
    var sessionId = req.body.sessionId;
    content = fs.readFileSync('login.json', 'utf8');
    content = JSON.parse(content);

    var uname = content.items.OSC[sessionId].username; //'gokuln'; kaamana
    var pword = content.items.OSC[sessionId].password;  //'Goklnt@1'; Oracle1234
    
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
                        contextOut: [{"name":"msAction2", "lifespan":0, "parameters":{  }}]
                    })
                }
                else{
                    if( resObj.count > 24 ){
                        speech = "Too many records";
                        res.json({
                            speech: speech,
                            displayText: speech,
                            //source: 'webhook-OSC-oppty'
                        })
                    }
                    else
                        callback(resObj);
                }
            }
            catch(error){
                speech = "Oh No! Something went wrong!";
                console.log( "Error : " + error);
                return res.json({
                    speech: speech,
                    displayText: speech,
                    //source: 'webhook-OSC-oppty'
                    contextOut: [{"name":"msAction2", "lifespan":0, "parameters":{ }}]
                })
            }
        });
        resx.on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    });
}