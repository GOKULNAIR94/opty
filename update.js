module.exports = function update( req, res, urlPath, bodyToUpdate, callback ) {
    var http = require('https');
    
    var uname = 'gokuln';
    var pword = 'Goklnt@1';
    
    console.log("Update");
    console.log("urlPath : " + urlPath);
    console.log("bodyToUpdate -" + bodyToUpdate.toString());
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
            callback(responseString);
            speech = "Value has been updated.";
		    return res.json({
                speech: speech,
                displayText: speech,
                //source: 'webhook-OSC-oppty'
            })
        });
        resx.on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    });
    request.write(JSON.stringify( bodyToUpdate ));
    request.end();
}