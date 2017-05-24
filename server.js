'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
var http = require('https');
var jsonQuery = require('json-query');
fs = require('fs');
restService.use(bodyParser.urlencoded(
{
    extended: true
}));
restService.use(bodyParser.json());


var urlPath = '';
const https = require('https');
var uname = 'kaamana';
var pword = 'Oracle1234';
var request;
var responseString;
var resCode = '';
var resObj = '';
var options='';
var speech = '';

app.post('/inputmsg',function(request,response){
	
	titleName = req.body.result.parameters.titleName;
	//titleName = encodeURIComponent(titleName);
	var titleNameURL = titleName.trim().replace( / /g, "%20" );
    
	urlPath = '/salesApi/resources/latest/Title_c?onlyData=true&q=TitleName_c=' + titleNameURL + '&fields=TitleNumber_c';
	
	options = 
	{
		host: 'cbhs-test.crm.us2.oraclecloud.com',
		path: urlPath,
		headers: 
		{
			'Authorization': 'Basic ' + new Buffer(uname + ':' + pword).toString('base64')
		}
	};
	request = http.get(options, function(resg){
		responseString = "";
      	
		resg.on('data', function(data) 
		{
			responseString += data;
		});
		
		resg.on('end', function(){
			resCode = responseString;
            try
            {
                resObj=JSON.parse(resCode);
				console.log(resObj);               
                tNumber=resObj.items[0].TitleNumber_c;
				console.log(tNumber);
				return res.json
			            ({
			                speech: speech,
			                displayText: speech,
			                //source: 'webhook-OSC-oppty'
			            })
            }
            catch (error)
            {
                return res.json
                ({	
                    speech: 'Incorrect title name'
                })
               console.log('Got ERROR');
            }
		});
		
	});
});


function send404(response){
	response.writeHead(404, {'Context-Type' : "text/plain"});
	response.write("Error 404 : Page not Found");
	response.end();
}




app.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});

