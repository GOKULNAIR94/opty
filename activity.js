module.exports = function(req, res, callback) {
    var Query = require("./query");

    var qString = "";
    var rowCount = 0;

    qString = "/crmRestApi/resources/latest/activities?q=OwnerName=Akashdeep%20Makkar&onlyData=true";
    
    Query( qString, req.body.headers.authorization, req, res, function( result ){
        rowCount = result.count;

        for (var i = 0; i <= rowCount - 1; i++) {
                
                if (result.items[i].ActivityNumber != null && result.items[i].ActivityNumber != "") {
                    speech = speech + 'Activity Number: ' + result.items[i].ActivityNumber + ', Subject: ' + result.items[i].Subject + ';\r\n';
                    suggests.push({
                        "title": result.items[i].ActivityNumber
                    })
                }
                console.log(speech);
        }
        if (req.body.originalRequest.source == "google") {
            res.json({
                speech: speech,
                displayText: speech,
                //contextOut : [{"name":"oppty-followup","lifespan":5,"parameters":{"objType":"activities"}}],
                data: {
                    google: {
                        'expectUserResponse': true,
                        'isSsml': false,
                        'noInputPrompts': [],
                        'richResponse': {
                            'items': [{
                                'simpleResponse': {
                                    'textToSpeech': speech,
                                    'displayText': speech
                                }
                            }],
                            "suggestions": suggests
                        }
                    }
                }
            });
        }else{
            res.json({
                speech: speech,
                displayText: speech
            });
        }
    });

}