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
        service: 'Outlook365', // no need to set host or port etc.
        auth: {
            user: 'viki@kaaman.onmicrosoft.com',//'reachme@kaaman.onmicrosoft.com',
            pass: 'Oracle123'//'K@agar55wal'
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
            from: 'VIKI <viki@kaaman.onmicrosoft.com>',
            // Comma separated list of recipients
            to: toemail,

            bcc: "Gokul.Nair@lntinfotech.com",

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

        transporter.verify(function(error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log('Server is ready to take our messages');
            }
        });

        console.log('Sending Mail');
        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.log('Error occurred');
                console.log(error.message);
                return;
            }
            console.log('Message sent successfully!');
            console.log('Server responded with "%s"', info.response);
            transporter.close();
            return res.json({
                speech: speech,
                displayText: speech
            });
        })
    });
}