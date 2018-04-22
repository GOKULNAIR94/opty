module.exports = function ( speechText, speech, suggests, contextOut, req, res, callback){ 

    console.log("OG Request : " + JSON.stringify(req.body.originalRequest));
            switch(req.body.originalRequest.source) {
                case "google":{
                    res.json({
                        speech: speech,
                        displayText: speechText,
                        contextOut : contextOut,
                        data: {
                            google: {
                                'expectUserResponse': true,
                                'isSsml': false,
                                'noInputPrompts': [],
                                'richResponse': {
                                    'items': [{
                                        'simpleResponse': {
                                            'textToSpeech': speech,
                                            'displayText': speechText
                                        }
                                    }],
                                    "suggestions": suggests
                                }
                            }
                        }
                    });
                    break;
                }

                default:{
                    res.json({
                        speech: speech,
                        displayText: speechText
                    });
                }
            }
}
