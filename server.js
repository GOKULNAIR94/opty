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
    titleName = encodeURIComponent(titleName);
	territoryStored = req.body.result.parameters.territoryStored;
	console.log(titleName);
	
	switch( myContext )
	{
		case "start":
		
			Start();
			break;
			
		case "multiTerritory":
			MultiTerritory()
			break;
	}
      
function Start()
{
	console.log( "Start" );
}
function MultiTerritory(){
	console.log( "MultiTerritory" );
	
}
		 
});


restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});
