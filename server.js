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
  var myContext = 'getPromo';
  var titleName = '';
  var tNumber = '';
  var territoryStored = '';
  var msRecord = '';
  var uname = 'gokuln';
  var pword = 'Goklnt@1';
  var speech = '';
  var options='';
  var urlPath='';
  var request;
  var responseString;
  var resCode = '';
  var resObj = '';
  var pId, pName, msId, msName;

  
restService.post('/inputmsg', function(req, res) 
{
  titleName = req.body.result.parameters.titleName;
  territoryStored = req.body.result.parameters.territoryStored;
  msRecord = req.body.result.parameters.msRecord;
  console.log( "titleName :" + titleName);
  console.log( " territoryStored : " + territoryStored);
  console.log( " msRecord : " + msRecord);
  
  if( territoryStored != null )
  {
    myContext = 'getObject';
  }
  if( msRecord != null )
	  myContext = 'getValue';
	
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
    case "getPromo":
    
      GetPromo();
      break;
      
    case "getObject":
      GetObject()
      break;
	  
    case "getValue":
      GetValue()
      break;
  }

  function GetPromo(){
	  console.log("GetPromo");
    urlPath='/salesApi/resources/latest/Title_c?onlyData=true&q=TitleName_c=' + encodeURIComponent(titleName) + '&fields=TitleNumber_c'; 
    console.log(urlPath);

    query( urlPath, function(result) {
      console.log("titleObj : " + result);
      tNumber = result.items[0].TitleNumber_c; 
      console.log("tNumber : " + tNumber);

      urlPath='/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c='+ tNumber + '&fields=RecordName,Id'; 
      query( urlPath, function(result) {
      var promoCount = result.count;
      console.log( "promoCount : " + promoCount);
      speech = "";
      speech= 'There are ' + promoCount + ' promotion(s) for the Title ' + titleName + "\n Please select a region of the Promotion of the Title";
      
      for( var i =0; i< promoCount; i++)
      {
        pId = result.items[i].Id;
        pName = result.items[i].RecordName;
        speech = speech + "\n\n" + parseInt(i+1,10) + ". " + pId + " - " + pName;
        if( i == promoCount - 1 )
          speech = speech + ".";
        else
          speech = speech + ",";  
      }
      return res.json
                  ({
                      speech: speech,
                      displayText: speech,
                      //source: 'webhook-OSC-oppty'
                  })
      });
    });

    

  }
  function GetObject(){	  
	  console.log("GetObject");
    urlPath='/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c='+ tNumber + ';TerritoryStored_c='+territoryStored+'&fields=RecordName,Id'; 
    console.log(urlPath);

    query( urlPath, function(result) {
      pId = result.items[0].Id;
      pName = result.items[0].RecordName;
      console.log("pId : " + pId);
      console.log("pName : " + pName);

      urlPath="/salesApi/resources/latest/MarketSpend_c?onlyData=true&q=PromotionName_Id_c=" + pId + "&fields=Id,RecordName,Status_c,RequestType_c";
      query( urlPath, function(result) {
      var msCount = result.count;
      console.log( "msCount : " + msCount);
      speech = "";
      speech= 'There are ' + msCount + ' Market Spend(s) for the Promotion ' + pName + "\n Please select a Market Spend";
      var msId, msName;

      for( var i =0; i< msCount; i++)
      {
        msId = result.items[i].Id;
        msName = result.items[i].RecordName;
        speech = speech + "\n\n" + parseInt(i+1,10) + ". " + msId + " - " + msName;
        if( i == msCount - 1 )
          speech = speech + ".";
        else
          speech = speech + ",";  
      }
      return res.json
                  ({
                      speech: speech,
                      displayText: speech,
                      //source: 'webhook-OSC-oppty'
                  })
      });
    });
    console.log("MultiTerritory");
  }
  
    function GetValue(){
	    console.log("GetValue");
	  urlPath="/salesApi/resources/latest/MarketSpend_c?onlyData=true&q=RecordName=" + msRecord + "&fields=Id,RecordName,Status_c,RequestType_c";
      query( urlPath, function(result) {
	    var msStatus = result.items[0].Status_c;
        var msRecordName = result.items[0].RecordName;
		console.log( "Status of msRecordName : " + msStatus);
		speech = "";
		speech = "Status of +"msRecordName"+" : " + msStatus;
		return res.json
                  ({
                      speech: speech,
                      displayText: speech,
                      //source: 'webhook-OSC-oppty'
                  })
	  });
	}
});


restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});
