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
    //titleName= titleName.charAt(0).toUpperCase() + titleName.slice(1);
    titleName = encodeURIComponent(titleName);
    titleName = titleName.trim().replace( / /g, "%20" );
    
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
		    speech = tNumber;
				return res.json
			            ({
			                speech: speech,
			                displayText: speech,
			                //source: 'webhook-OSC-oppty'
			            });
            }
            catch (error)
            {
                return res.json
                ({
                    speech: 'Incorrect title name'
                })
               console.log('Got ERROR');
            }
    
        })
    
        resg.on('error', function(e) 
        {
            console.log('Got error: ' + e.message);
        });
    });  
        
});

restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});
