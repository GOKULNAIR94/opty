module.exports = function(req, res) {
    const express = require('express');
    const bunyan = require('bunyan');
    const nodemailer = require('nodemailer');
    const restService = express();
    const bodyParser = require('body-parser');
    var fs = require('fs');
    var intent_name = req.body.result.metadata.intentName;
    console.log(intent_name);
    console.log("Inside");
    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        service: 'gmail', // no need to set host or port etc.
        auth: {
            user: req.body.headers.emailuser,
            pass: req.body.headers.emailpw 
        }
    });
//    var to_email = req.body.result.parameters.emailaddress;
//    var reportName = req.body.result.parameters.reportName;
//    var chartfield = req.body.result.parameters.chartfield;
//    var yearName = req.body.result.parameters.reportYear;
//    var scenario = req.body.result.parameters.reportScenario;
//    var sourceApp = req.body.result.parameters.sourceApp;
//    var version = req.body.result.parameters.version;
//    var currency = req.body.result.parameters["currency-name"];
//    var projects = req.body.result.parameters["projects"];



    var toemail = "Kaaman.Agarwal@lntinfotech.com";

    toemail = "gokulgnair94@gmail.com";
    var speech = 'The churn index is 0.76. I have mailed you the churn report. The customer is at high risk. Your last meeting with the customer was 65 days ago. Would you like to schedule a meeting?'

    console.log(speech);
    console.log('SMTP Configured');
    fs.readFile("./FrancoLeone.pdf", function(err, data) {
        // Message object
        let message = {
            from: 'VIKI <' + req.body.headers.emailuser+ '>',
            // Comma separated list of recipients
            to: toemail,

            bcc: "gokulgnair94@gmail.com",

            // Subject of the message
            subject: 'Churn Report of Franco Leone.', //

            // HTML body
            html: '<p><b>Hello,</b></p>' +
                '<p>Attached is the Churn Report of Franco Leone.</p>' +
                '<p>Thanks,<br><b>Viki</b></p>',

            // Apple Watch specific HTML body
            watchHtml: '<b>Hello</b> to myself',

            //An array of attachments
            attachments: [{
                'filename': 'FrancoLeone.pdf',
                'content': data
            }]

        };

        transporter.sendMail(message, function(error, info){
            if (error) {
                console.log( "Error : " + error);
                speech = "Unable to send mail. Please try again later.";
            } else {
                console.log('Email sent: ' + info.response);
                return res.json({
                    speech: speech,
                    displayText: speech
                });
            }
            
        });
    });
}