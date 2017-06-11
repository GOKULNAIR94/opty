module.exports = function(req, res) {
    

    var objectName = '';
    var PromoProg = require( "./PromoProg" );
    var MarketSpend = require( "./MarketSpend" );
    console.log( "In Query!" );

    var fs = require('fs');
    var sessionId = req.body.sessionId;
    console.log( "sessionId : " + sessionId);
    var content;

    var speech = "";

    if( req.body.result.metadata.intentName == "Default Welcome Intent" ){
        speech = "";
        return res.json({
          speech: speech,
          displayText: speech
        })
    }

    content = fs.readFileSync('login.json', 'utf8');
    console.log( "Content : " + content);
    content = JSON.parse(content);
    
    console.log( "intentName : " + req.body.result.metadata.intentName );
    if( req.body.result.metadata.intentName == "Login" ){
        console.log("Login Intent");
        var username = req.body.result.parameters['username'];
        var password = req.body.result.parameters['password'];

        content.items.OSC[sessionId] = sessionId;
        content.items.OSC[sessionId]["username"] = username;
        content.items.OSC[sessionId]["password"] = password;

        console.log("Content :" + JSON.stringify(content) );
        content = JSON.stringify( content, null, 2);
        fs.writeFile('login.json', content, function(){
          console.log("All set...");
        });
    }
    else{
        console.log("Not Login Intent");
        console.log("Content :" + JSON.stringify(content.items) );
        if( content.items.OSC[sessionId] != null ){
            var username = content.items.OSC[sessionId].username;
            var password = content.items.OSC[sessionId].password;
            console.log( "username : " + username);
            console.log( "password : " + password);
        }
        else{
            speech = "I will need your Sales Cloud Credentials. Try saying: I am Gokul and password is Oracle 123";
            return res.json({
              speech: speech,
              displayText: speech
            })
        }
    }        

    objectName = req.body.result.parameters.objectName;
    console.log( "objectName : " + objectName);
    
    switch ( objectName ) {
        case "__ORACO__PromotionProgram_c":
            PromoProg( req, res, function( result ) {
                console.log( "result : " + result);
                
            });
            break;

        case "MarketSpend_c":
            MarketSpend( req, res, function( result ) {
                console.log( "result : " + result);
            });
            break;

        case "default":
            break;
    }
}