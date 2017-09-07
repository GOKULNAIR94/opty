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




var oNumber = '';
var oName = '';
var oAttrib = '';
var oType = '';
var oName2 = oName + 'Test';
var oNumber2 = oNumber + 'Testing';
var uname = "";
var pword = "";
var speech = oNumber;
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

restService.post('/oppty', function(req, res) {
    //console.log("Req  : " + JSON.stringify(req.body));

    try {
        if (req.body.originalRequest != null) {
            if (req.body.originalRequest.source == "slack_testbot") {
                var userid = req.body.originalRequest.data.user;
                console.log("userid : " + userid);
            }
        }
        var varPath = "/salesApi/resources/latest/VikiAuthv1_c?q=UserId_c=" + userid + "&onlyData=true"
        console.log("varPath Login : " + varPath);
        var options = {
            host: 'acs.crm.ap2.oraclecloud.com',
            path: varPath,
            headers: {
                'Authorization': 'Basic ' + new Buffer('LNT001:Lnt@123').toString('base64')
            }
        };
        var responseString = '',
            resObj;
        var request = http.get(options, function(resx) {
            resx.on('data', function(data) {
                responseString += data;
            });
            resx.on('end', function() {
                try {
                    resObj = JSON.parse(responseString);
                    var rowCount = resObj.count;
                    console.log(rowCount);
                    if (rowCount == 1) {
                        UserAuth = resObj.items[0].OSCAuth_c;
                        console.log("UserAuth : " + UserAuth);
                    }


                    var loginEncoded;
                    var loginEncoded2;
                        
                    loginEncoded = 'Basic ' + new Buffer('LNT001:Lnt@123').toString('base64');
                    loginEncoded2 = 'Basic ' + UserAuth;
                    
                    console.log("loginEncoded : " + loginEncoded);

                    console.log("loginEncoded2 : " + loginEncoded2);

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
                                urlPath = '/salesApi/resources/latest/opportunities?q=OptyNumber=' + oNumber + '&onlyData=true'; //&fields=Name,' + oAttrib + ',OptyNumber'
                            } else if (oType == 'opportunities' && oNumber2 == 'Testing') {
                                urlPath = '/salesApi/resources/latest/opportunities?q=Name=' + oName + '&onlyData=true'; //&fields=Name,' + oAttrib + ',OptyNumber'
                            }
                            console.log("urlPath : " + urlPath);
                            options = {
                                //ca: fs.readFileSync('MyCert'),
                                host: 'acs.crm.ap2.oraclecloud.com',
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
                                        console.log("responseString : " + responseString);
                                        resObj = JSON.parse(responseString);
                                    } catch (error) {
                                        console.log("Error : " + error);
                                        return res.json({
                                            speech: 'Incorrect Opportunity number'
                                        })

                                        console.log('Got ERROR');
                                    }

                                    console.log(resObj);
                                    //oName=resObj.items.Name;
                                    try {
                                        oName = resObj.items[0].Name;
                                        if (oAttrib == 'Revenue') {
                                            rev = '$' + resObj.items[0].Revenue / 1000000 + 'M';
                                            optyOther = '$' + resObj.items[0].ExpectAmount / 1000000 + 'M';
                                            speech = 'Current Revenue for Opportunity ' + oName + ' is ' + rev + '. The expected amount for this opportunity is ' + optyOther + "\n Would you like to know what's going on with " + resObj.items[0].TargetPartyName + "?";
                                        } else if (oAttrib == 'WinProb') {
                                            rev = resObj.items[0].WinProb;
                                            speech = 'Opportunity ' + oName + ' is ' + rev + "% probable to Win.\n Would you like to know what's going on with " + resObj.items[0].TargetPartyName + "?";
                                        } else if (oAttrib == 'LastUpdatedBy') {
                                            console.log("Caught " + oAttrib)
                                            rev = resObj.items[0].LastUpdatedBy;
                                            rev = rev.charAt(0).toUpperCase() + rev.slice(1);
                                            optyOther = resObj.items[0].LastUpdateDate;
                                            speech = 'Current Sales Person working on Opportunity: ' + oName + ' is ' + rev + '. The last time ' + rev + ' updated this opportunity was on ' + optyOther;
                                        } else if (oAttrib == 'SalesStage') {
                                            rev = resObj.items[0].SalesStage;
                                            optyOther = resObj.items[0].AverageDaysAtStage;
                                            speech = 'Opportunity ' + oName + ' is currently in Stage' + rev + '. On an average an opportunity stays in this stage for ' + optyOther + " days.\n Would you like to know what's going on with " + resObj.items[0].TargetPartyName + "?";
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
                                        return res.json({
                                            speech: 'Please check the Opportunity number or name you entered'
                                        })

                                        console.log('Got ERROR');
                                    }
                                    console.log(oName);
                                    console.log(oNumber);
                                    console.log('$' + rev + 'M');
                                    console.log(opty);
                                    //console.log('$'+resObj.Revenue);
                                    if (req.body.result.metadata.intentName == "oppty - News") {
                                        try {
                                            var varHost = 'vikinews.herokuapp.com';
                                            var varPath = '/inputmsg';
                                            var toSend = {
                                                "key": "value"
                                            };
                                            toSend["track"] = resObj.items[0].TargetPartyName;
                                            toSend["intentName"] = req.body.result.metadata.intentName;
                                            console.log("toSend : " + JSON.stringify(toSend));
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
                                                    responseObject = JSON.parse(body);
                                                    speech = responseObject;
                                                    return res.json({
                                                        speech: speech,
                                                        displayText: speech
                                                    })

                                                })
                                            }).on('error', function(e) {
                                                speech = "Error occured! : " + e;
                                                return res.json({
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

                                        return res.json({
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
                                urlPath = '/salesApi/resources/latest/activities?q=OwnerName=Akashdeep%20Makkar&onlyData=true';
                            } else {

                                urlPath = '/salesApi/resources/latest/activities/' + activityNumber + '?onlyData=true';
                            }
                            console.log(urlPath);
                            options = {
                                //ca: fs.readFileSync('MyCert'),
                                host: 'acs.crm.ap2.oraclecloud.com',
                                path: urlPath,
                                headers: {
                                    'Authorization': loginEncoded
                                }
                            };

                            if (!activityNumber) {
                                request = http.get(options, function(resg) {
                                    today = req.body.result.parameters.date;
                                    console.log(today);
                                    responseString = "";
                                    resg.on('data', function(data) {
                                        responseString += data;
                                    });
                                    resg.on('end', function() {

                                        resCode = responseString;

                                        try {
                                            resObj = JSON.parse(responseString);
                                        } catch (error) {
                                            return res.json({
                                                speech: 'No Active Activities'
                                            })

                                            console.log('Got ERROR');
                                        }

                                        //console.log(resObj);
                                        try {
                                            //console.log(resObj);
                                            //resObj=JSON.parse(responseString);
                                            var rowCount = resObj.count;
                                            console.log(rowCount);
                                            for (var i = 0; i <= rowCount - 1; i++) {

                                                var endDate = resObj.items[i].ActivityEndDate;
                                                var startDate = resObj.items[i].ActivityStartDate;

                                                endDate = mydate(endDate, "yyyy-mm-dd");
                                                startDate = mydate(startDate, "yyyy-mm-dd");
                                                /*console.log("Start Date: "+startDate); 
                                                console.log("End Date: "+endDate);   
                                                console.log("Today: "+today); */
                                                if (today <= endDate && today >= startDate) {
                                                    speech = speech + 'Activity Number:' + resObj.items[i].ActivityNumber + ' Subject:' + resObj.items[i].Subject + ';\r\n';
                                                    console.log(speech);
                                                } else {

                                                }


                                            }
                                        } catch (error) {
                                            return res.json({
                                                speech: 'User has no Activities listed'
                                            })

                                            console.log('Got ERROR');
                                        }

                                        return res.json({
                                            speech: speech,
                                            displayText: speech,
                                            source: 'webhook-OSC-oppty'
                                        });

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
                                        console.log(resCode);
                                        try {
                                            resObj = JSON.parse(responseString);
                                        } catch (error) {
                                            return res.json({
                                                speech: 'No Such Activity'
                                            })

                                            console.log('Got ERROR');
                                        }
                                        try {
                                            var AccountName = resObj.AccountName;
                                            if (req.body.result.metadata.intentName == "oppty - News") {
                                                var varHost = 'vikinews.herokuapp.com';
                                                var varPath = '/inputmsg';
                                                var toSend = {
                                                    "key": "value"
                                                };
                                                toSend["track"] = resObj.AccountName;
                                                toSend["intentName"] = req.body.result.metadata.intentName;
                                                console.log("toSend : " + JSON.stringify(toSend));
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
                                                        responseObject = JSON.parse(body);
                                                        speech = responseObject;
                                                        return res.json({
                                                            speech: speech,
                                                            displayText: speech
                                                        })

                                                    })
                                                }).on('error', function(e) {
                                                    speech = "Error occured! : " + e;
                                                    return res.json({
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

                                                speech = 'Here are the details for Activity: ' + activityNumber + '\n\r Subject: ' + subject + '\n\r Status: ' + status + '\n\r Start Date: ' + startDate + '\n\r End Date: ' + endDate + '\n\r Opportunity Associated: ' + optyName + '\n\r Customer Name: ' + contactName + '\n\r Phone: ' + contactPhone + '\n\r Email: ' + contactEmail + '\n\r Account: ' + AccountName + ".\n Would you like to know what's going on with " + AccountName + "?";
                                                return res.json({
                                                    speech: speech,
                                                    displayText: speech,
                                                    source: 'webhook-OSC-oppty'
                                                });
                                            }
                                        } catch (e) {
                                            console.log('Got ERROR');
                                            return res.json({
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
                        activityNumber = req.body.result.contexts[0].parameters.activityNumber;
                        if (req.body.result.contexts[0].parameters.objType == 'opportunities') {
                            console.log(actionType);
                            urlPath = '/salesApi/resources/latest/opportunities/' + oNumber;
                            console.log(urlPath);
                            options = {
                                "method": "PATCH",
                                "hostname": "acs.crm.ap2.oraclecloud.com",
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

                                    speech = "Probability updated to " + prob + "%";
                                    console.log(body.toString());
                                    return res.json({
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

                        } else if (req.body.result.contexts[0].parameters.objType == 'activities') {
                            console.log(actionType);
                            urlPath = '/salesApi/resources/latest/activities/' + activityNumber;
                            console.log(urlPath);
                            var options = {
                                "method": "PATCH",
                                "hostname": "acs.crm.ap2.oraclecloud.com",
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
                                    console.log(body.toString());
                                    return res.json({
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

                } catch (error) {

                }
            });
            resx.on('error', function(e) {
                console.log("Got error: " + e.message);
            });
        });
    } catch (e) {
        console.log("No Og req");
    }



});

restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});