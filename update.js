module.exports = function update( req, res, urlPath, bodyToUpdate, callback ) {
    var http = require('https');
    
    var uname = 'gokuln';
    var pword = 'Goklnt@1';
    
    console.log("Update");
    console.log("urlPath : " + urlPath);
    console.log("bodyToUpdate -" + JSON.stringify(bodyToUpdate));
    options = {
        host: 'cbhs-test.crm.us2.oraclecloud.com',
        path: urlPath,
        data: bodyToUpdate,
        method: 'PATCH',
        headers: {
            'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64'),
            'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
        }
    };

    request = http.request( options, function(resx) {
        responseString = "";
        resx.on('data', function(data) {
            responseString += data;
        });
        resx.on('end', function() {

            try{
                console.log("responseString : " + responseString);
                
                var resObj = JSON.parse(responseString);
                console.log( "resObj : " + resObj);
                if( resObj.Id != null ){
                   speech = "Value has been updated.";
                    return res.json({
                        speech: speech,
                        displayText: speech,
                        //source: 'webhook-OSC-oppty'
                    })
                }
            }
            catch(error){
                speech = "Enter a valid Value. ";
                console.log( "error : " + error);
                return res.json({
                        speech: speech,
                        displayText: speech,
                        //source: 'webhook-OSC-oppty'
                    })
            }
            
            callback(responseString);
        });
        resx.on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    });
    request.write(JSON.stringify( bodyToUpdate ));
    request.end();
}