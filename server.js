'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
restService.use(bodyParser.urlencoded({
    extended: true
}));
restService.use(bodyParser.json());

var index = require('./index')

restService.post('/inputmsg', index);


restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});
