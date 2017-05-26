//host + url
//  { objectName + query + required fields }


// 1. paths/No. of queries for every object
// 2. based on inputs

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
var http = require('https');
var fs = require('fs');
restService.use(bodyParser.urlencoded({
    extended: true
}));
restService.use(bodyParser.json());
var myContext = 'getPromo';
var titleName = '';
var tNumber = '';
var territoryStored = '';
var objectName = '';
var attributeName = '';

var uname = 'gokuln';
var pword = 'Goklnt@1';
var speech = '';
var options = '';
var urlPath = '';
var request;
var responseString;
var resCode = '';
var resObj = '';

var output = '';
var pId = "";
var recordName = "";

var Logic = {
    "__ORACO__PromotionProgram_c" : {
        "getTitle" : "/salesApi/resources/latest/Title_c?onlyData=true&q=TitleName_c=" + encodeURIComponent(titleName) + "&fields=TitleNumber_c",
        "getPromo" : "/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c=" + tNumber + "&fields=RecordName,Id" + attributeName,
        "getTerritory" : '/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c=' + tNumber + ';TerritoryStored_c=' + territoryStored + '&fields=RecordName,Id' + attributeName
    },
    "MarketSpend_c" : {
        "getTitle" : "/salesApi/resources/latest/Title_c?onlyData=true&q=TitleName_c=" + encodeURIComponent(titleName) + "&fields=TitleNumber_c",
        "getPromo" : "/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c=" + tNumber + "&fields=RecordName,Id" + attributeName,
        "getTerritory" : '/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c=' + tNumber + ';TerritoryStored_c=' + territoryStored + '&fields=RecordName,Id' + attributeName,
        "getRecords":"/salesApi/resources/latest/MarketSpend_c?onlyData=true&q=PromotionName_Id_c=" + pId + "&fields=Id,RecordName",
        "getRecord":"/salesApi/resources/latest/MarketSpend_c?onlyData=true&q=PromotionName_Id_c=" + pId + ";RecordName=" + recordName + "&fields=Id,RecordName,Status_c,RequestType_c"
    }
}

restService.post('/inputmsg', function( req, res ) {
    titleName = req.body.result.parameters.titleName;
    territoryStored = req.body.result.parameters.territoryStored;
    objectName = req.body.result.parameters.object;
    attributeName = req.body.result.parameters.attribute;

    function query( urlPath, callback ) {
        console.log("urlPath : " + urlPath);
        options = {
            host: 'cbhs-test.crm.us2.oraclecloud.com',
            path: urlPath,
            headers: {
                'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64')
            }
        };

        request = http.get(options, function( resx ) {
            responseString = "";
            resx.on('data', function( data ) {
                responseString += data;
            });
            resx.on('end', function() {
                resObj = JSON.parse(responseString);
                console.log("resObj : " + resObj);
                callback(resObj);
            });
            resx.on('error', function( e ) {
                console.log("Got error: " + e.message);
            });
        });
    }

    switch ( objectName ) {
        case "__ORACO__PromotionProgram_c":
		{
			speech = "";
            if( TerritoryStored_c != null ){
                urlPath = Logic.__ORACO__PromotionProgram_c.getTerritory;
                query(urlPath, function( result ) {
                    console.log("titleObj : " + result);
                    output = result.items[0][attributeName];
                    var pName = result.items[0][RecordName];
                    console.log("output : " + output);
					speech = attributeName + " of "+ pName +" : " + msattribute;
                });
            }
            else{
                urlPath = Logic.__ORACO__PromotionProgram_c.getTitle;
                query(urlPath, function( result ) {
					tNumber = result.items[0].TitleNumber_c; 
					console.log("tNumber : " + tNumber);
					urlPath = Logic.__ORACO__PromotionProgram_c.getPromo;
					query(urlPath, function( result ) {
						var Count = result.count;
						if( Count == 1 )
						{
							pName = result.items[0].RecordName;
							output = result.items[0][attributeName];
							speech = attributeName + " of "+ pName +" : " + output;
						}
						else{
							if( Count == 0 )
								{speech = "No promotions for the given Territory.";}
							else
								if( Count > 1 )
								{
									
									speech= 'There are ' + Count + ' promotion(s) for the Title ' + titleName + "\n Please select a region of the Promotion of the Title";
									for( var i =0; i< Count; i++)
								    {
										msId = result.items[i].Id;
										msName = result.items[i].RecordName;
										speech = speech + "\n\n" + parseInt(i+1,10) + ". " + msId + " - " + msName;
										if( i == msCount - 1 )
										  speech = speech + ".";
										else
										  speech = speech + ",";  
								    }
								}
						
						}
						
					});
                });
            }
			return res.json
			({
				speech: speech,
				displayText: speech,
				//source: 'webhook-OSC-oppty'
			})
		}
            break;

        case "MarketSpend_c":
            GetObject()
            break;

        case "default":
            break;
    }
});

restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});
