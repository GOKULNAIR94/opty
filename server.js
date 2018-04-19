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
var SendEmail = require("./sendEmail");
var Activity = require("./activity");
var Oppty = require("./oppty");
var SendResponse = require("./sendResponse");

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
var contextOut;
var suggests;
var opptyNumber;
var opptyName;

restService.post('/oppty', function(req, res) {
    intentName = req.body.result.metadata.intentName;
    console.log("Opty Reached!");

    switch (true) {
    
            case (intentName.indexOf("Activities - Sales") == 0):
            {
                Activity(req, res, function(result) {
                    console.log("Activity Called");
                });
                break;
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

    console.log("Req  Source: " + req.body.originalRequest.source);

    loginEncoded = req.body.headers.authorization;
    
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
                SendResponse(speech, suggests, contextOut, req, res, function() {
                    console.log("Finished!");
                });
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
        switch (true) {
    
            case (intentName == "opty_top - custom"):
            {
                
                opptyNumber = req.body.result.parameters.opptyNumber;
                qString = "/crmRestApi/resources/latest/opportunities/" + opptyNumber + '?onlyData=true';;
                QueryOpty( qString, loginEncoded, req, res, function( result ){
                    console.log('OResults' );
                    //console.log( "result : " + JSON.stringify(result));
                    speech = "Opportunity Name: " + result.Name +" ,\r\n  Account : " + result.TargetPartyName + ".\r\n Would you like to know more details like status, churn index or what is in the news about the account?";
                    suggests = [{ "title" : "What is the status"},{ "title" : "What is the churn index"},{ "title" : "What is in the news"}];
                    
                    SendResponse(speech, suggests, contextOut, req, res, function() {
                        console.log("Finished!");
                    });
                });
                break;
            }

            case (intentName.indexOf("oppty") == 0):
            {
                opptyName = encodeURIComponent(req.body.result.parameters.opptyName);
                opptyNumber = req.body.result.parameters.opptyNumber;
                var oAttrib = req.body.result.parameters.optyAttribut;
                var rev;
                var optyOther;
                qString = "/crmRestApi/resources/latest/opportunities?q=Name=" + opptyName + '&onlyData=true';
                QueryOpty( qString, loginEncoded, req, res, function( result ){
                    console.log('OResults' );
                    //console.log( "result : " + JSON.stringify(result));
                    speech = "Opportunity Name: " + result.Name +" ,\r\n  Account : " + result.TargetPartyName + ".\r\n Would you like to know more details like status, churn index or what is in the news about the account?";
                    suggests = [{ "title" : "What is the status"},{ "title" : "What is the churn index"},{ "title" : "What is in the news"}];
                    switch (oAttrib) {
    
                        case ("Revenue"):
                        {
                            rev = '$' + resObj.items[0].Revenue / 1000000 + 'M';
                            optyOther = '$' + resObj.items[0].ExpectAmount / 1000000 + 'M';
                            speech = 'Current Revenue for Opportunity ' + oName + ' is ' + rev + '. The expected amount for this opportunity is ' + optyOther + ".\n";
                            break;
                        }
                        case ("WinProb"):
                        {
                            rev = resObj.items[0].WinProb;
                                speech = 'Opportunity ' + oName + ' is ' + rev + "% probable to Win.";
                            break;
                        }
                        case ("LastUpdatedBy"):
                        {
                            rev = resObj.items[0].LastUpdatedBy;
                                rev = rev.charAt(0).toUpperCase() + rev.slice(1);
                                optyOther = resObj.items[0].LastUpdateDate;
                                speech = 'Current Sales Person working on Opportunity: ' + oName + ' is ' + rev + '. The last time ' + rev + ' updated this opportunity was on ' + optyOther;
                            break;
                        }
                        case ("SalesStage"):
                        {
                            rev = resObj.items[0].SalesStage;
                                optyOther = resObj.items[0].AverageDaysAtStage;
                                speech = 'Opportunity ' + oName + ' is currently in Stage' + rev + '. On an average an opportunity stays in this stage for ' + optyOther + " days.\n";
                            break;
                        }
                        case ("TargetPartyName"):
                        {
                            rev = resObj.items[0].TargetPartyName; //TargetPartyName
                                console.log(rev);
                                optyOther = resObj.items[0].PrimaryContactPartyName;
                                speech = 'Opportunity ' + oName + ' is for account ' + rev + '. The primary contact person for this opportnity is ' + optyOther;
                            break;
                        }
                        case ("PrimaryContactPartyName"):
                        {
                            rev = resObj.items[0].PrimaryContactPartyName;
                                optyOther = resObj.items[0].PrimaryContactFormattedPhoneNumber;
                                speech = 'The primary contact for opportunity ' + oName + ' is ' + rev + '. Phone Number: ' + optyOther + '. Email Address: ' + optyOther2;
                            break;
                        }

            
                    }
                    SendResponse(speech, suggests, contextOut, req, res, function() {
                        console.log("Finished!");
                    });
                });
                break;
            }

        }
    }    
    if( intentName == "opty_top - custom - custom" || intentName=='Activities - Sales - custom - custom' ){
        SendEmail(req, res, function(result) {
            console.log("SendEmail Called");
        });
    }
});

restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});