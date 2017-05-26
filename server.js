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
  var actionType = "";
  var titleName = '';
  var tNumber = '';
  var territoryStored = '';
  var objectName = '';
  var attributeName = '';
  var msRecord = '';
  var newValue = "";
  
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
  objectName = req.body.result.parameters.object;
  attributeName = req.body.result.parameters.attribute;
  msRecord = req.body.result.parameters.msRecord;
  actionType = req.body.result.parameters.actionType;
  newValue = req.body.result.parameters.newValue;
  
  console.log( "titleName :" + titleName);
  console.log( " territoryStored : " + territoryStored);
  console.log( " msRecord : " + msRecord);
  console.log( " actionType : " + actionType);
  console.log( " newValue : " + newValue);
  
  if( territoryStored != null )
  {
    myContext = 'getObject';
  }
  if( msRecord != null )
	  myContext = 'getValue';
  if( actionType == "update" )
  {
	myContext = "update";
  }
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
	  
	case "update":
      Update()
      break;
	  
	case "default":
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
	  urlPath="/salesApi/resources/latest/" + objectName + "?onlyData=true&q=RecordName=" + msRecord + "&fields=Id,RecordName,Status_c,RequestType_c";
      query( urlPath, function(result) {
	    var msattribute = result.items[0][attributeName];
		var msId = result.items[0].Id;
        var msRecordName = result.items[0].RecordName;
		console.log( attributeName + " of " + msRecordName +" : "  + msattribute);
		speech = "";
		speech = attributeName + " of "+msRecordName +" : " + msattribute;
		return res.json
                  ({
                      speech: speech,
                      displayText: speech,
                      //source: 'webhook-OSC-oppty'
                  })
	  });
	}
	
	function Update(){
	var bodyToUpdate = {
		attributeName : newValue
	}
	    console.log("Update");
	  urlPath="/salesApi/resources/latest/" + objectName + "/" + msId;
      var newoptions = {
        host: "cbhs-test.crm.us2.oraclecloud.com",
        path:urlPath,
        data: bodyToUpdate,
        method:'PATCH',
		headers: {
			'Authorization': 'Basic ' + new Buffer( uname + ':' + pword ).toString('base64'),
			'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
		}
	  };
	  var post_req = https.request(newoptions, function(res) {
		  res.on('data', function (chunk) {
			  console.log('Response: ' + chunk);
		  });
				res.on('end', function() {
			response.send({statusCode : 200});
			return res.json
                  ({
                      speech: "Test Update",
                      displayText: speech,
                      //source: 'webhook-OSC-oppty'
                  })
		  })
		}).on('error', function(e){
		console.error(e);
	  });
		post_req.write(JSON.stringify(request.body));
		post_req.end();
	}
});


restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});
