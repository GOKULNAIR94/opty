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
var Update = require("./update");
var GetNews = require("./getnews");

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
var contextOut =[];
var suggests = [];
var opptyNumber;
var opptyName;

var word = 1;

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
    console.log("Word pre: " + word);
    word++;
    console.log("Word post: " + word);
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
                    });
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

                    contextOut.push({
                        "name": "accountname",
                        "lifespan": 5,
                        "parameters": {
                            "accountname": result.TargetPartyName
                        }
                    });

                    console.log("Context Out : " + JSON.stringify(contextOut));
                    SendResponse(speech, suggests, contextOut, req, res, function() {
                        console.log("Finished!");
                    });
                });
                break;
            }

            case (intentName.indexOf("oppty") == 0 || intentName == "opty_top - custom - attrib" ):
            {
                opptyName = encodeURIComponent(req.body.result.parameters.opptyName);
                opptyNumber = req.body.result.parameters.opptyNumber;
                var oAttrib = req.body.result.parameters.optyAttribut;
                var rev;
                var optyOther;
                
                if( opptyNumber ){
                    qString = "/crmRestApi/resources/latest/opportunities?q=OptyNumber=" + opptyNumber + '&onlyData=true';
                }else{
                    if(opptyName){
                        qString = "/crmRestApi/resources/latest/opportunities?q=Name=" + opptyName + '&onlyData=true';
                    }
                }

                QueryOpty( qString, loginEncoded, req, res, function( result ){
                    console.log('OResults' );
                    //console.log( "result : " + JSON.stringify(result));
                    speech = "Opportunity Name: " + result.Name +" ,\r\n  Account : " + result.TargetPartyName + ".\r\n Would you like to know more details like status, churn index or what is in the news about the account?";
                    suggests = [{ "title" : "What is the status"},{ "title" : "What is the churn index"},{ "title" : "What is in the news"}];
                    switch (oAttrib) {
    
                        case ("Revenue"):
                        {
                            rev = '$' + result.items[0].Revenue / 1000000 + 'M';
                            optyOther = '$' + result.items[0].ExpectAmount / 1000000 + 'M';
                            speech = 'Current Revenue for Opportunity ' + oName + ' is ' + rev + '. The expected amount for this opportunity is ' + optyOther + ".\n";
                            break;
                        }
                        case ("WinProb"):
                        {
                            rev = result.items[0].WinProb;
                                speech = 'Opportunity ' + oName + ' is ' + rev + "% probable to Win.";
                            break;
                        }
                        case ("LastUpdatedBy"):
                        {
                            rev = result.items[0].LastUpdatedBy;
                                rev = rev.charAt(0).toUpperCase() + rev.slice(1);
                                optyOther = result.items[0].LastUpdateDate;
                                speech = 'Current Sales Person working on Opportunity: ' + oName + ' is ' + rev + '. The last time ' + rev + ' updated this opportunity was on ' + optyOther;
                            break;
                        }
                        case ("SalesStage"):
                        {
                            rev = result.items[0].SalesStage;
                                optyOther = result.items[0].AverageDaysAtStage;
                                speech = 'Opportunity ' + oName + ' is currently in Stage' + rev + '. On an average an opportunity stays in this stage for ' + optyOther + " days.\n";
                            break;
                        }
                        case ("TargetPartyName"):
                        {
                            rev = result.items[0].TargetPartyName; //TargetPartyName
                                console.log(rev);
                                optyOther = result.items[0].PrimaryContactPartyName;
                                speech = 'Opportunity ' + oName + ' is for account ' + rev + '. The primary contact person for this opportnity is ' + optyOther;
                            break;
                        }
                        case ("PrimaryContactPartyName"):
                        {
                            rev = result.items[0].PrimaryContactPartyName;
                                optyOther = result.items[0].PrimaryContactFormattedPhoneNumber;
                                speech = 'The primary contact for opportunity ' + oName + ' is ' + rev + '. Phone Number: ' + optyOther + '. Email Address: ' + optyOther2;
                            break;
                        }

            
                    }
                    contextOut.push({
                        "name": "optynumber",
                        "lifespan": 5,
                        "parameters": {
                            "optynumber": result.items[0].OptyNumber
                        }
                    });
                    contextOut.push({
                        "name": "accountname",
                        "lifespan": 5,
                        "parameters": {
                            "accountname": result.TargetPartyName
                        }
                    });

                    SendResponse(speech, suggests, contextOut, req, res, function() {
                        console.log("Finished!");
                    });
                });
                break;
            }
            
            case ( intentName == "opty_top - custom - attrib - update" ):
            {
                var oAttrib = req.body.result.parameters.optyAttribut;
                var prob = req.body.result.parameters.Probability;
                
                
                if(req.body.result.parameters.opptyNumber)
                    opptyNumber = req.body.result.parameters.opptyNumber
                else{
                    var cont = req.body.result.contexts.filter(x => {
                        return x.name == "optynumber"
                    });
                    opptyNumber = cont[0].parameters.optynumber;
                }

                qString = "/crmRestApi/resources/latest/opportunities/" + opptyNumber;

                var body = {};
                body[oAttrib] = prob;
                Update( qString, loginEncoded, body, req, res, function( result ){
                    speech = "The probability has been updated to " + prob ;
                    SendResponse(speech, suggests, contextOut, req, res, function() {
                        console.log("Finished!");
                    });
                });

                break;
            }

        }
    }    
    if( intentName == "opty_top - custom - custom" || intentName=='Activities - Sales - custom - custom' || intentName == "opty_top - custom - custom" ){
        SendEmail(req, res, function(result) {
            console.log("SendEmail Called");
        });
    }
    if(intentName == "opty_top - custom - custom-news"){
        console.log("Contexts : " + JSON.stringify(req.body.result.contexts));
        
        var account = req.body.result.contexts.filter(x => {
            return x.name == "accountname"
        });
        console.log("My Context : " + JSON.stringify(account));

        var accountName = account[0].parameters.accountname;
        GetNews( accountName, req, res, function(result) {
            console.log("Get News Called");
        });
    }

    
});

restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});