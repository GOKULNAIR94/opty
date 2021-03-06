module.exports = function(req, res, callback) {
    console.log("Activity Reached!");

    var Query = require("./query");
    var SendResponse = require("./sendResponse");
    var SendEmail = require("./sendEmail");
    var GetNews = require("./getnews");

    var mydate = require('dateformat');
    var now = new Date();
    var today = mydate(now, "yyyy-mm-dd");

    var intentName = req.body.result.metadata.intentName;
    var qString = "";
    var rowCount = 0;
    var speech = "";
    var speechText = "";
    var suggests = [];
    var contextOut = [];
    console.log();

    today = (req.body.result.parameters.date || today);
    console.log("Today : " + today);

    switch (true) {
        case (intentName == "Activities - Sales"):
            {

                qString = "/crmRestApi/resources/latest/activities?q=OwnerName=Akashdeep%20Makkar;ActivityStartDate<=" + today + ";ActivityEndDate>=" + today + "&onlyData=true";

                Query(qString, req.body.headers.authorization, req, res, function(result) {
                    console.log("Query Count  - " + result.count);
                    rowCount = result.count;
                    var endDate;
                    var startDate;
                    if (rowCount == 0) {
                        speech = "All caught up! Enjoy your day!";
                        speechText = "All caught up! Enjoy your day!";
                    } else {
                        speech = "Alright. Activity";
                        speechText = "You have the following activities for the day:\n";
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
                                    speech = speech + ' ' + result.items[i].ActivityNumber + ', ' + result.items[i].Subject + ';\r\n';
                                    speechText = speechText + 'Activity: ' + result.items[i].ActivityNumber + ', ' + result.items[i].Subject + ';\r\n';
                                    suggests.push({
                                        "title": result.items[i].ActivityNumber
                                    })
                                }
                                console.log(speech);
                            }
                        }
                    }

                    SendResponse( speechText, speech, suggests, contextOut, req, res, function() {
                        console.log("Finished!");
                    });

                });
                break;
            }

        case (intentName == "Activities - Sales - custom" || intentName == "Activities - Sales - custom - news" || intentName == "Activities - Sales - custom - news - custom"):
            {
                var activityNumber = req.body.result.parameters.activityNumber;
                qString = "/crmRestApi/resources/latest/activities/" + activityNumber + "?onlyData=true";
                Query(qString, req.body.headers.authorization, req, res, function(result) {
                    console.log("Activity number : " + activityNumber);
                    var AccountName = result.AccountName;
                    var subject = result.Subject;
                    var status = result.StatusCode;
                    var startDate = result.ActivityStartDate;
                    var endDate = result.ActivityEndDate;
                    var optyName = result.OpportunityName;
                    var contactName = result.PrimaryContactName;
                    var contactEmail = result.PrimaryContactEmailAddress;
                    var contactPhone = result.PrimaryFormattedPhoneNumber;

                    speech = "Activity, " + activityNumber;
                    speechText = 'Here are the details for Activity ' + activityNumber + ":";
                    if( subject ){
                        speech += ', ' + subject;
                        speechText += ' \nSubject: ' + subject;
                    }
                        
                    if( status ){
                        speech += ', \nStatus: ' + status;
                        speechText += ', \nStatus: ' + status;

                    }
                        
                    if( startDate ){
                        speech += ', \nDate: ' + mydate(startDate, "yyyy-mm-dd");
                        speechText += ', \nDate: ' + mydate(startDate, "yyyy-mm-dd");
                    }
                        
                    if( endDate ){
                        speechText += ',\nEnd Date: ' + mydate(endDate, "yyyy-mm-dd");
                    }
                        
                    if( optyName ){
                        speech += ',\nOpportunity : ' + optyName;
                        speechText += ',\nOpportunity : ' + optyName;
                    }
                        
                    if( contactName )
                        speechText += ',\nCustomer Name: ' + contactName;

                    if( contactPhone )
                    speechText += ',\nPhone: ' + contactPhone;

                    if( contactEmail )
                    speechText += ',\nEmail: ' + contactEmail;

                    if( AccountName )
                        speechText += ',\nAccount: ' + AccountName;
    
                    speech += ".\nWould you like to know the churn index or news about " + AccountName + ", get the service requests from this user or should I close this activity?";
                    speechText += ".\nWould you like to know the churn index or news about " + AccountName + ", get the service requests from this user or should I close this activity?";
                    

                    var suggests = [{
                        "title": "Get me news"
                    }, {
                        "title": "What is the churn index"
                    }, {
                        "title": "Close this activity"
                    }, {
                        "title": "Highest priority tickets"
                    }];

                    if( intentName == "Activities - Sales - custom" ){
                        SendResponse( speechText, speech, suggests, contextOut, req, res, function() {
                            console.log("Finished!");
                        });
                    }else{
                        console.log("Call Get news");
                        GetNews( AccountName, req, res, function(result) {
                            console.log("Get News Called");
                        });
                    }
                });

                break;
            }

            
            case (intentName == "Activities - Sales - custom - custom"):
            {
                SendEmail(req, res, function(result) {
                    console.log("SendEmail Called");
                });
                break;
            }

    }

}