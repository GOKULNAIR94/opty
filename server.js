'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
var http = require('https'),
    fs = require('fs');

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());


var QueryOpty = require("./query");

var oNumber = '';
var oName = '';
var oAttrib = '';
var oType = '';
var oName2 = oName + 'Test';
var oNumber2 = oNumber + 'Testing';
var uname = "";
var pword = "";
var speech = "";
var http = require('https');
var options = '';
var urlPath = '';
var request;
var responseString;
var rev = '';
var oName = '';
var resObj = '';
var opty = '';
var optyOther = '';
var optyother2 = '';
var resCode = '';
var mydate = require('dateformat');
var now = new Date();
var today = mydate(now, "yyyy-mm-dd");
var UserAuth = '';
uname = 'Akashdeep';
pword = 'lntLNT2K16_1';
var loginEncoded;
var userid;
var intentName = ""; 
var SendEmail = require("./sendEmail");

restService.post('/oppty', function(req, res) {
    console.log("Req  : " + JSON.stringify(req.body));
    console.log(" Intent : " + req.body.result.metadata.intentName);

    //loginEncoded = 'Basic ' + new Buffer('LNT001:Lnt@123').toString('base64');

    //console.log("loginEncoded : " + loginEncoded);



    console.log("Req  Source: " + req.body.originalRequest.source);

    loginEncoded = 'Basic ' + req.body.headers.authorization;
    //console.log("Req  after return: " + JSON.stringify(req.body));

    oNumber = req.body.result.parameters.opptyNumber;

    var prob = req.body.result.parameters.Probability;
    var actionType = req.body.result.parameters.actionType;

    console.log(actionType);

    if (actionType != 'update') {
        oName = req.body.result.parameters.opptyName;
        oAttrib = req.body.result.parameters.optyAttribut;
        oType = req.body.result.parameters.objType;
        console.log(oType);
        oName = encodeURIComponent(oName);
        oName2 = oName + 'Test';
        oNumber2 = oNumber + 'Testing';
        speech = oNumber;
        fs = require('fs');
        console.log(oNumber2);
        console.log(oName2);

        if (oType == 'opportunities') {
            if (oType == 'opportunities' && oName2 == 'Test') {
                urlPath = '/crmRestApi/resources/latest/opportunities?q=OptyNumber=' + oNumber + '&onlyData=true'; //&fields=Name,' + oAttrib + ',OptyNumber'
            } else if (oType == 'opportunities' && oNumber2 == 'Testing') {
                urlPath = '/crmRestApi/resources/latest/opportunities?q=Name=' + oName + '&onlyData=true'; //&fields=Name,' + oAttrib + ',OptyNumber'
            }
            console.log("urlPath : " + urlPath);
            options = {
                //ca: fs.readFileSync('MyCert'),
                host: 'acs.fa.ap2.oraclecloud.com',
                path: urlPath,
                headers: {
                    'Authorization': loginEncoded
                }
            };
            request = http.get(options, function(resg) {
                responseString = "";
                resg.on('data', function(data) {
                    responseString += data;
                });
                resg.on('end', function() {

                    resCode = responseString;

                    try {
                        //console.log("responseString : " + responseString);
                        resObj = JSON.parse(responseString);
                    } catch (error) {
                        console.log("Error : " + error);
                        res.json({
                            speech: 'Incorrect Opportunity number'
                        })

                        console.log('Got ERROR : ' + error);
                    }

                    //console.log(resObj);
                    //oName=resObj.items.Name;
                    try {
                        oName = resObj.items[0].Name;
                        if (oAttrib == 'Revenue') {
                            rev = '$' + resObj.items[0].Revenue / 1000000 + 'M';
                            optyOther = '$' + resObj.items[0].ExpectAmount / 1000000 + 'M';
                            speech = 'Current Revenue for Opportunity ' + oName + ' is ' + rev + '. The expected amount for this opportunity is ' + optyOther + ".\n";
                        } else if (oAttrib == 'WinProb') {
                            rev = resObj.items[0].WinProb;
                            speech = 'Opportunity ' + oName + ' is ' + rev + "% probable to Win.";
                        } else if (oAttrib == 'LastUpdatedBy') {
                            console.log("Caught " + oAttrib)
                            rev = resObj.items[0].LastUpdatedBy;
                            rev = rev.charAt(0).toUpperCase() + rev.slice(1);
                            optyOther = resObj.items[0].LastUpdateDate;
                            speech = 'Current Sales Person working on Opportunity: ' + oName + ' is ' + rev + '. The last time ' + rev + ' updated this opportunity was on ' + optyOther;
                        } else if (oAttrib == 'SalesStage') {
                            rev = resObj.items[0].SalesStage;
                            optyOther = resObj.items[0].AverageDaysAtStage;
                            speech = 'Opportunity ' + oName + ' is currently in Stage' + rev + '. On an average an opportunity stays in this stage for ' + optyOther + " days.\n";
                        } else if (oAttrib == 'TargetPartyName') {
                            rev = resObj.items[0].TargetPartyName; //TargetPartyName
                            console.log(rev);
                            optyOther = resObj.items[0].PrimaryContactPartyName;
                            speech = 'Opportunity ' + oName + ' is for account ' + rev + '. The primary contact person for this opportnity is ' + optyOther;
                            console.log(speech);
                        } else if (oAttrib == 'PrimaryContactPartyName') {
                            rev = resObj.items[0].PrimaryContactPartyName;
                            optyOther = resObj.items[0].PrimaryContactFormattedPhoneNumber;
                            speech = 'The primary contact for opportunity ' + oName + ' is ' + rev + '. Phone Number: ' + optyOther;
                        } else if (oAttrib == 'PrimaryContactPartyName') {
                            rev = resObj.items[0].PrimaryContactPartyName;
                            optyOther = resObj.items[0].PrimaryContactFormattedPhoneNumber;
                            speech = 'The primary contact for opportunity ' + oName + ' is ' + rev + '. Phone Number: ' + optyOther + '. Email Address: ' + optyOther2;
                        };
                    } catch (error) {
                        res.json({
                            speech: 'Please check the Opportunity number or name you entered'
                        })

                        console.log('Got ERROR : ' + error);
                    }
                    console.log(oName);
                    console.log(oNumber);
                    console.log('$' + rev + 'M');
                    console.log(opty);
                    //console.log('$'+resObj.Revenue);
                    if ( req.body.result.metadata.intentName.indexOf( "oppty - News" ) == 0 ) {
                        console.log( " Intent -> " + req.body.result.metadata.intentName);
                        try {
                            var varHost = 'vikinews.herokuapp.com';
                            var varPath = '/inputmsg';
                            var toSend = {
                                "key": "value"
                            };
                            toSend["track"] = resObj.items[0].TargetPartyName;
                            toSend["intentName"] = req.body.result.metadata.intentName;
                            
                            for(var i=0; i< req.body.result.contexts.length; i++){
                                if( req.body.result.contexts[i].parameters["OPTION"] != null && req.body.result.contexts[i].parameters["OPTION"] != "" ){
                                    toSend["option"] = req.body.result.contexts[i].parameters["OPTION"];
                                }else{
                                    if( req.body.result.contexts[i].parameters["headline.original"] != null && req.body.result.contexts[i].parameters["headline.original"] != "")
                                        toSend["headline"] = req.body.result.contexts[i].parameters["headline.original"];
                                }
                            }
                            
                            toSend["originalRequest"] = {
                                "source": req.body.originalRequest.source
                            };
                            

                            console.log("toSend opty : " + JSON.stringify(toSend));
                            var newoptions = {
                                host: varHost,
                                path: varPath,
                                data: toSend,
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            };

                            var body = "";
                            var responseObject;

                            var post_req = http.request(newoptions, function(response) {
                                response.on('data', function(chunk) {
                                    body += chunk;
                                });

                                response.on('end', function() {
                                    try {
                                        responseObject = JSON.parse(body);
                                        res.json(responseObject);
                                        
                                    } catch (error) {
                                        res.json({
                                            speech: 'Something went wrong! Please try again later!'
                                        })
                                    }

                                })
                            }).on('error', function(e) {
                                speech = "Error occured! : " + e;
                                res.json({
                                    speech: speech,
                                    displayText: speech
                                })
                            });
                            post_req.write(JSON.stringify(toSend));
                            //post_req.write(tracker);
                            post_req.end();

                        } catch (e) {
                            console.log("Error : " + e);
                        }
                    } else {

                        res.json({
                            speech: speech,
                            displayText: speech,
                            source: 'webhook-OSC-oppty'
                        });

                    }

                })

                resg.on('error', function(e) {
                    console.log('Got error: ' + e.message);
                });
            });
        } else if (oType == 'activities') {
            var activityNumber = req.body.result.parameters.activityNumber;

            if (!activityNumber) {
                urlPath = '/crmRestApi/resources/latest/activities?q=OwnerName=Akashdeep%20Makkar&onlyData=true';
            } else {

                urlPath = '/crmRestApi/resources/latest/activities/' + activityNumber + '?onlyData=true';
            }
            console.log(urlPath);
            options = {
                //ca: fs.readFileSync('MyCert'),
                host: 'acs.fa.ap2.oraclecloud.com',
                path: urlPath,
                headers: {
                    'Authorization': loginEncoded
                }
            };

            if (!activityNumber) {
                request = http.get(options, function(resg) {
                    
                    if(req.body.result.parameters.date != null && req.body.result.parameters.date != "")
                        today = req.body.result.parameters.date;
                    
                    console.log("Today : " + today);
                    responseString = "";
                    resg.on('data', function(data) {
                        responseString += data;
                    });
                    resg.on('end', function() {

                        var suggests = [];

                        resCode = responseString;

                        try {
                            resObj = JSON.parse(responseString);
                        } catch (error) {
                            res.json({
                                speech: 'No Active Activities'
                            })

                            console.log('Got ERROR : ' + error);
                        }

                        //console.log(resObj);
                        try {
                            //console.log(resObj);
                            //resObj=JSON.parse(responseString);
                            var rowCount = resObj.count;
                            console.log(rowCount);
                            speech = "";
                            for (var i = 0; i <= rowCount - 1; i++) {

                                var endDate = resObj.items[i].ActivityEndDate;
                                var startDate = resObj.items[i].ActivityStartDate;

                                endDate = mydate(endDate, "yyyy-mm-dd");
                                startDate = mydate(startDate, "yyyy-mm-dd");
                                /*console.log("Start Date: "+startDate); 
                                console.log("End Date: "+endDate);   
                                console.log("Today: "+today); */
                                if (today <= endDate && today >= startDate) {
                                    
                                    if (resObj.items[i].ActivityNumber != null && resObj.items[i].ActivityNumber != "") {
                                        speech = speech + 'Activity Number: ' + resObj.items[i].ActivityNumber + ', Subject: ' + resObj.items[i].Subject + ';\r\n';
                                        suggests.push({
                                            "title": resObj.items[i].ActivityNumber
                                        })
                                    }
                                    console.log(speech);
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
                                
                        } catch (error) {
                            res.json({
                                speech: 'User has no Activities listed'
                            })

                            console.log('Got ERROR : ' + error);
                        }

                    })

                    resg.on('error', function(e) {
                        console.log('Got error: ' + e.message);
                    });
                });
            } else {
                console.log(activityNumber);
                request = http.get(options, function(resg) {
                    responseString = "";
                    resg.on('data', function(data) {
                        responseString += data;
                    });
                    resg.on('end', function() {

                        resCode = responseString;
                        //console.log(resCode);
                        try {
                            resObj = JSON.parse(responseString);
                        } catch (error) {
                            res.json({
                                speech: 'No Such Activity'
                            })

                            console.log('Got ERROR : ' + error);
                        }
                        try {
                            var AccountName = resObj.AccountName;
                            if ( req.body.result.metadata.intentName.indexOf( "Activities - Sales - custom - news" ) == 0 ) {
                                var varHost = 'vikinews.herokuapp.com';
                                var varPath = '/inputmsg';
                                var toSend = {
                                    "key": "value"
                                };
                                toSend["track"] = resObj.AccountName;
                                toSend["intentName"] = req.body.result.metadata.intentName;
                                toSend["originalRequest"] = {
                                    "source": req.body.originalRequest.source
                                };
                                console.log("Context : " + JSON.stringify(req.body.result));
                                for(var i=0; i< req.body.result.contexts.length; i++){
                                    if( req.body.result.contexts[i].parameters["OPTION"] != null && req.body.result.contexts[i].parameters["OPTION"] != "" ){
                                        toSend["option"] = req.body.result.contexts[i].parameters["OPTION"];
                                    }else{
                                        if( req.body.result.contexts[i].parameters["headline.original"] != null && req.body.result.contexts[i].parameters["headline.original"] != "")
                                            toSend["headline"] = req.body.result.contexts[i].parameters["headline.original"];
                                    }
                                }
                                
                                console.log("toSend Activity : " + JSON.stringify(toSend));
                                var newoptions = {
                                    host: varHost,
                                    path: varPath,
                                    data: toSend,
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                };
                                var body = "";
                                var responseObject;

                                var post_req = http.request(newoptions, function(response) {
                                    response.on('data', function(chunk) {
                                        body += chunk;
                                    });

                                    response.on('end', function() {
                                        try {
                                            responseObject = JSON.parse(body);
                                            res.json(responseObject);
                                        } catch (error) {
                                            res.json({
                                                speech: 'Something went wrong! Please try again later!'
                                            })
                                        }


                                    })
                                }).on('error', function(e) {
                                    speech = "Error occured! : " + e;
                                    res.json({
                                        speech: speech,
                                        displayText: speech
                                    })
                                });
                                post_req.write(JSON.stringify(toSend));
                                //post_req.write(tracker);
                                post_req.end();
                            } else {
                                var subject = resObj.Subject;
                                var status = resObj.StatusCode;
                                var startDate = resObj.ActivityStartDate;
                                var endDate = resObj.ActivityEndDate;
                                var optyName = resObj.OpportunityName;
                                var contactName = resObj.PrimaryContactName;
                                var contactEmail = resObj.PrimaryContactEmailAddress;
                                var contactPhone = resObj.PrimaryFormattedPhoneNumber;

                                speech = 'Here are the details for Activity: ' + activityNumber + ',\n\r Subject: ' + subject + ',\n\r Status: ' + status + ',\n\r Start Date: ' + mydate(startDate, "yyyy-mm-dd") + ',\n\r End Date: ' + mydate(endDate, "yyyy-mm-dd") + ',\n\r Opportunity Associated: ' + optyName + ',\n\r Customer Name: ' + contactName + ',\n\r Phone: ' + contactPhone + ',\n\r Email: ' + contactEmail + ',\n\r Account: ' + AccountName + ".\n Would you like to know the churn index or what is in the news about " + AccountName + ", or would you like to close this activity?";
                                var suggests = [{ "title" : "Get me news"},{ "title" : "What is the churn index"},{ "title" : "Close this activity"}];
                                
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
                            }
                        } catch (e) {
                            console.log('Got ERROR : ' + e);
                            res.json({
                                speech: 'Incorrect Activity Number'
                            })
                        }



                    })

                    resg.on('error', function(e) {
                        console.log('Got error: ' + e.message);
                    });
                });
            }
        }

        res.on('error', function(e) {
            console.log('Got error: ' + e.message);
        });
    } else if (actionType == 'update') {
        
        
        console.log(req.body.result.contexts[0].parameters.objType);
        oNumber = req.body.result.contexts[0].parameters.opptyNumber;
        oName = req.body.result.contexts[0].parameters.opptyName;
        console.log( "oNumber : " + oNumber );
        console.log( "oName : " + oName );
        activityNumber = req.body.result.contexts[0].parameters.activityNumber;
        if (req.body.result.contexts[0].parameters.objType == 'opportunities') {
            console.log(actionType);
            if( oNumber != null && oNumber != ""){
                
                urlPath = '/crmRestApi/resources/latest/opportunities/' + oNumber;
                console.log(urlPath);
                options = {
                    "method": "PATCH",
                    "hostname": "acs.fa.ap2.oraclecloud.com",
                    "port": null,
                    "path": urlPath,
                    "headers": {
                        "content-type": "application/vnd.oracle.adf.resourceitem+json",
                        'Authorization': loginEncoded
                    }
                };
                console.log(options);
                var req = http.request(options, function(resu) {
                    var chunks = [];

                    resu.on("data", function(chunk) {
                        chunks.push(chunk);
                    });

                    resu.on("end", function() {
                        var body = Buffer.concat(chunks);

                        console.log("Status code : : " + res.statusCode);
                        speech = "Probability updated to " + prob + "%";
                        //console.log(body.toString());
                        res.json({
                            speech: speech,
                            displayText: speech,
                            source: 'webhook-OSC-oppty'
                        });
                    });
                });
                //var prob=93;
                var probi = '{"WinProb":' + prob + '}';
                req.write(probi);
                req.end();
                
            }
            else{
                if( oName != null && oName != ""){
                    var qString = "/crmRestApi/resources/latest/opportunities?q=Name=" + encodeURIComponent(oName)
                    QueryOpty( qString, loginEncoded, req, res, function( result ){

                        if( result.items.length >0 ){
                            
                            //Start
                            urlPath = '/crmRestApi/resources/latest/opportunities/' + result.items[0].OptyNumber;
                            console.log(urlPath);
                            options = {
                                "method": "PATCH",
                                "hostname": "acs.fa.ap2.oraclecloud.com",
                                "port": null,
                                "path": urlPath,
                                "headers": {
                                    "content-type": "application/vnd.oracle.adf.resourceitem+json",
                                    'Authorization': loginEncoded
                                }
                            };
                            console.log(options);
                            var req = http.request(options, function(resu) {
                                var chunks = [];

                                resu.on("data", function(chunk) {
                                    chunks.push(chunk);
                                });

                                resu.on("end", function() {
                                    var body = Buffer.concat(chunks);

                                    console.log("Status code : : " + res.statusCode);
                                    speech = "Probability updated to " + prob + "%";
                                    //console.log(body.toString());
                                    res.json({
                                        speech: speech,
                                        displayText: speech,
                                        source: 'webhook-OSC-oppty'
                                    });
                                });
                            });
                            //var prob=93;
                            var probi = '{"WinProb":' + prob + '}';
                            req.write(probi);
                            req.end();

                            //End
                            
                            
                        }
                        else{
                            speech = "Please check the Opportunity number or name!";
                            res.json({
                                speech: speech,
                                displayText: speech,
                                source: 'webhook-OSC-oppty'
                            });
                        }
                    });
                }
                else{
                    speech = "Please enter a valid Opportunity number or name!";
                    res.json({
                        speech: speech,
                        displayText: speech,
                        source: 'webhook-OSC-oppty'
                    });
                }
            }
            

        } else if (req.body.result.contexts[0].parameters.objType == 'activities') {
            console.log(actionType);
            urlPath = '/crmRestApi/resources/latest/activities/' + activityNumber;
            console.log(urlPath);
            var options = {
                "method": "PATCH",
                "hostname": "acs.fa.ap2.oraclecloud.com",
                "port": null,
                "path": urlPath,
                "headers": {
                    "content-type": "application/vnd.oracle.adf.resourceitem+json",
                    'Authorization': loginEncoded
                }
            };

            var req = http.request(options, function(resu) {
                var chunks = [];

                resu.on("data", function(chunk) {
                    chunks.push(chunk);
                });

                resu.on("end", function() {
                    var body = Buffer.concat(chunks);
                    speech = "Activity " + activityNumber + " Completed";
                    //console.log(body.toString());
                    res.json({
                        speech: speech,
                        displayText: speech,
                        source: 'webhook-OSC-oppty'
                    });
                });
            });
            req.write("{\n\"StatusCode\": \"COMPLETE\"}");
            req.end();
        }
    }

});

restService.post('/opptytop', function(req, res) {
    speech = "";
    
    console.log("opptytop----------- ");
    console.log("Req  : " + JSON.stringify(req.body));
    intentName = req.body.result.metadata.intentName;
    console.log(" Intent : " + intentName );
    
    var qString = "";
    getAuth(req, res, function(req, res, UserAuth) {
        console.log("Req  Source: " + req.body.originalRequest.source);
        console.log(" UserAuth returned : " + UserAuth);
        loginEncoded = 'Basic ' + UserAuth;
        
        if( intentName == "opty_top"){
            var sortBy = req.body.result.parameters.optyAttribut;
            var sortNumber = req.body.result.parameters.number;
            qString = "/crmRestApi/resources/latest/opportunities?onlyData=true&orderBy=" + sortBy + ":desc";
            QueryOpty( qString, loginEncoded, req, res, function( result ){
                try{
                    var rowCount = result.items.length;
                    console.log( "rowCount : " + rowCount);
                    var suggests = [];

                    for (var i = 0; i < sortNumber; i++) {
                        speech = speech + 'Opportunity Number: ' + result.items[i].OptyNumber + ', Name: ' + result.items[i].Name + ", Revenue : "  + ('$' + result.items[i].Revenue  / 1000000 + 'M') + ';\r\n';
                        suggests.push({
                            "title": result.items[i].OptyNumber
                        })
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
                }
                catch( e ){
                    console.log( "Error top opty : " + e );
                    speech = "Something went wrong! Please try again later!";
                    res.json({
                        speech: speech,
                        displayText: speech
                    });
                }
            });
        }else{
            if( intentName == "opty_top - custom" ){
                var opptyNumber = req.body.result.parameters.opptyNumber;
                qString = "/crmRestApi/resources/latest/opportunities/" + opptyNumber;
                QueryOpty( qString, loginEncoded, req, res, function( result ){
                    
                    //console.log( "result : " + JSON.stringify(result));
                    speech = "Opportunity Name: " + result.Name +" ,\r\n  Account : " + result.TargetPartyName + ".\r\n Would you like to know more details like status, churn index or what is in the news about the account?";
                    var suggests = [{ "title" : "What is the status"},{ "title" : "What is the churn index"},{ "title" : "What is in the news"}];
                    
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
        }
    });
    
    if( intentName == "opty_top - custom - custom" || intentName=='Activities - Sales - custom - custom' ){
        SendEmail(req, res, function(result) {
            console.log("SendEmail Called");
        });
    }
});

restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});