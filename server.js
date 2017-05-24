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
  console.log( "titleName :" + titleName);
  console.log( " territoryStored : " + territoryStored);
  if( territoryStored != null )
     myContext = 'multiTerritory';
  
  function query( urlPath, callback) {
    
    console.log( "urlPath : " + urlPath);
    options = 
    {
      host: 'cbhs-test.crm.us2.oraclecloud.com',
      path: urlPath,
      headers: 
      {
        'Authorization': 'Basic ' + new Buffer( uname + ':' + pword ).toString('base64')
      }
    };

    request = http.get(options, function(resx){
      responseString = "";
      resx.on('data', function(data) 
      {
        responseString += data;
      });
      resx.on('end', function() 
      {
        resObj=JSON.parse(responseString);
          console.log( "resObj : " + resObj);
          callback(resObj);
      });
      resx.on('error', function(e) 
      {
        console.log("Got error: " + e.message);
      });          
    });
  }

  switch( myContext )
  {
    case "start":
    
      Start();
      break;
      
    case "multiTerritory":
      MultiTerritory()
      break;
  }

  function Start(){
    urlPath='/salesApi/resources/latest/Title_c?onlyData=true&q=TitleName_c=' + encodeURIComponent(titleName) + '&fields=TitleNumber_c'; 
    console.log(urlPath);

    query( urlPath, function(result) {
      tNumber = titleObj.items[0].TitleNumber_c; 
      console.log("titleObj : " + titleObj);
      console.log("tNumber : " + tNumber);
    });

    urlPath='/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c='+ tNumber + '&fields=RecordName,Id'; 
    query( urlPath, function(result) {
      var pId = promoObj.items[0].Id;
      var pName = promoObj.items[0].RecordName;
      console.log(pId - pName);
    });

  }
  function MultiTerritory(){
    console.log("MultiTerritory");
  }
});


restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});
