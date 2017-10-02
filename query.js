module.exports = function ( qString, loginEncoded, req, resp, callback){ 
    var http = require("https");
    console.log( "qString : " + qString);
    var options = {
      "method": "GET",
      "hostname": "acs.crm.ap2.oraclecloud.com",
      "port": null,
      "path": qString, //customFields.CO.Serial_Number%3D'C355'%20AND%20statusWithType.status.lookupName%3D'Solved'
      "headers": {
        "authorization": "Basic YWthc2hkZWVwOmxudExOVDJLMTZfMQ==",//loginEncoded,
        "cache-control": "no-cache"
      }
    };

    var req = http.request(options, function (res) {
      var responseString = '',
            resObj;

      res.on("data", function ( data ) {
        responseString += data;
      });

      res.on("end", function () {
          try{
              //console.log("Body : " + responseString);
          resObj = JSON.parse(responseString);
          if( resObj.items != null ){
              var rowCount = resObj.items.length;
              console.log( "rowCount : " + rowCount);
              //console.log( "resObj : " + JSON.stringify(resObj));
          }
          //console.log( "resObj : " + JSON.stringify(resObj));
          callback( resObj );
          }
          catch(e){
              resp.json({
                message : "Error: " + e 
            });
          }
      });
    res.on("error", function ( e ) {
        resp.json({
                message : "Error: " + e 
            });
      });
    });

    req.end();
}
