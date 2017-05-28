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

var query = require('./query')

restService.post('/inputmsg', query);


restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});
