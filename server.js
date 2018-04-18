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
var Activity = require("./activity");

restService.post('/oppty', function(req, res) {
    intentName = req.body.result.metadata.intentName;
    console.log("Opty Reached!");

    if(intentName.indexOf("Activities - Sales") == 0){
        
        Activity(req, res, function(result) {
            console.log("Activity Called");
        });
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