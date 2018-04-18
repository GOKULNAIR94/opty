module.exports = function(req, res, callback) {
    console.log("Activity Reached!");

    var Query = require("./query");
    var mydate = require('dateformat');
    var now = new Date();
    var today = mydate(now, "yyyy-mm-dd");

    var qString = "";
    var rowCount = 0;
    var speech = "";
    var suggests = [];
    console.log();
    
    today = (req.body.result.parameters.date || today);
    console.log("Today : " + today);
    qString = "/crmRestApi/resources/latest/activities?q=OwnerName=Akashdeep%20Makkar;ActivityStartDate<=" + today + ";ActivityEndDate>=" + today + "&onlyData=true";
    
    Query( qString, req.body.headers.authorization, req, res, function( result ){
        console.log("Query Count  - " + result.count);
        rowCount = result.count;
        var endDate;
        var startDate;
        if( rowCount == 0 ){
            speech = "All caught up! Enjoy your day!";
        }else{
            for (var i = 0; i <= rowCount - 1; i++) {
                endDate = result.items[i].ActivityEndDate;
                startDate = result.items[i].ActivityStartDate;
    
                endDate = mydate(endDate, "yyyy-mm-dd");
                startDate = mydate(startDate, "yyyy-mm-dd");
                /*console.log("Start Date: "+startDate); 
                console.log("End Date: "+endDate);   
                console.log("Today: "+today); */
                if (today <= endDate && today >= startDate) {
                    if (result.items[i].ActivityNumber != null && result.items[i].ActivityNumber != "") {
                        speech = speech + 'Activity Number: ' + result.items[i].ActivityNumber + ', Subject: ' + result.items[i].Subject + ';\r\n';
                        suggests.push({
                            "title": result.items[i].ActivityNumber
                        })
                    }
                    console.log(speech);
                }
            }
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