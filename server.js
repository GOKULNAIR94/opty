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
var actionType = "";
var titleName = '';
var tNumber = '';
var territoryStored = '';
var objectName = '';
var attributeName = '';
var msRecord = '';
var newValue = "";
var msId = "";
var outputAttribute ="";

var uname = 'gokuln';
var pword = 'Goklnt@1';
var speech = '';
var options = '';
var urlPath = '';
var request;
var responseString;
var resCode = '';
var resObj = '';
var pId, pName, msId, msName;


restService.post('/inputmsg' {
	funcky.init(restService);
});


restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});
