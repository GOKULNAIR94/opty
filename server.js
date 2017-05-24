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
    var titleName = '';
    var tNumber = '';
    var uname = 'kaamana';
    var pword = 'Oracle1234';
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
    //titleName= titleName.charAt(0).toUpperCase() + titleName.slice(1);
    titleName = encodeURIComponent(titleName);
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
				console.log(resObj);               
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
            	urlPath='/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c='+ tNumber + ';SpendFlag_c=true&fields=MarketSpendStatus_c,MarketSpendAmount_c,SpendFlag_c';// + '&onlyData=true'; 
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
						console.log(promoCount)
						speech= 'There are ' + promoCount + ' promotions for the Title ' + titleName;
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
            
          /*  catch (error)
            {
                return res.json
                ({
                    speech: 'Please check the Title name you entered'
                })
                
                console.log('Got ERROR');
            }  */ 
           console.log(speech);
            /*return res.json
            ({
                speech: speech ,
                displayText: speech,
                source: 'webhook-OSC-oppty'
            });*/
    
        })
    
        resg.on('error', function(e) 
        {
            console.log('Got error: ' + e.message);
        });
    });
      res.on('error', function(e) 
        {
            console.log('Got error: ' + e.message);
        });   
        
});

restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});
