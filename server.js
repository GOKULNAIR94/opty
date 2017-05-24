'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
var http = require('https');
var fs = require('fs');
restService.use(bodyParser.urlencoded(
{
    extended: true
}));
restService.use(bodyParser.json());
var myContext = 'start';
    var titleName = '';
    var tNumber = '';
    var territoryStored = '';
    var uname = 'gokuln';
    var pword = 'Goklnt@1';
    var speech = '';
    var options='';
    var urlPath='';
    var request;
    var responseString;
	var resCode = '';
	var resObj = '';
	
restService.post('/inputmsg', function(req, res) 
{
	titleName = req.body.result.parameters.titleName;
    territoryStored = req.body.result.parameters.territoryStored;
	switch( myContext )
	{
		case: 'start'
		
			Start();
			break;
			
		case: 'multiTerritory'
			var case = 2;
			break;
	}
      
        
});

function Start()
{
	
    //titleName= titleName.charAt(0).toUpperCase() + titleName.slice(1);
    titleName = encodeURIComponent(titleName);
    //titleName = titleName.trim().replace( / /g, "%20" );
    
	console.log(titleName);
    urlPath='/salesApi/resources/latest/Title_c?onlyData=true&q=TitleName_c=' + titleName + '&fields=TitleNumber_c'; 
	console.log(urlPath);
	options = 
	{
		host: 'cbhs-test.crm.us2.oraclecloud.com',
		path: urlPath,
		headers: 
		{
			'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64')
		}
	};
    request = http.get(options, function(resg)
    {
        responseString = "";
      	resg.on('data', function(data) 
		{
			responseString += data;
		});
        resg.on('end', function() 
        {
            resCode = responseString;
            try
            {
                resObj=JSON.parse(resCode);
				//console.log(resObj);               
                tNumber=resObj.items[0].TitleNumber_c;
				console.log(tNumber);
            }
            catch (error)
            {
                return res.json
                ({
                    speech: 'Incorrect title name'
                })
               console.log('Got ERROR');
            }
			
			//titleNumber=resObj.items[0].TitleNumber_ce;
            	if( territoryStored == null)
			urlPath='/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c='+ tNumber + '&fields=RecordName,Id'; 
		else
			urlPath='/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c='+ tNumber + ';TerritoryStored_c='+territoryStored+'&fields=RecordName,Id'; 
		
		console.log(urlPath);
				options = 
					{
						host: 'cbhs-test.crm.us2.oraclecloud.com',
						path: urlPath,
						headers: 
						{
							'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64')
						}
					};
				request = http.get(options, function(resx)
				{
					responseString = "";
					resx.on('data', function(data) 
					{
						responseString += data;
					});
					resx.on('end', function() 
					{
					
						resObj=JSON.parse(responseString);
						//tNumber=resObj.items[0].TitleNumber_c;
						//console.log(resObj);
						var promoCount = resObj.count
						console.log(promoCount);
						var pId, pName;
						speech = "";
						for( var i =0; i< promoCount; i++)
						{
							pId=resObj.items[i].Id;
							pName=resObj.items[i].RecordName;
							speech = speech + "\n\n" + parseInt(i+1,10) + ". " + pId + " - " + pName;
							if( i == promoCount - 1 )
								speech = speech + ".";
							else
								speech = speech + ",";
							
						}
						//speech= 'There are ' + promoCount + ' promotions for the Title ' + titleName;
						console.log(speech);
						return res.json
			            ({
			                speech: speech,
			                displayText: speech,
			                //source: 'webhook-OSC-oppty'
			            })
					});
					resx.on('error', function(e) 
					{
						console.log("Got error: " + e.message);
					});


				});
    
        })
    
        resg.on('error', function(e) 
        {
            console.log('Got error: ' + e.message);
        });
    });
}

restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});
