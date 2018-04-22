module.exports = function ( speech, suggests, contextOut, req, res, callback){ 

    console.log("OG Request : " + JSON.stringify(req.body.originalRequest));
            switch(req.body.originalRequest.source) {
                case "google":{
                    res.json({
                        speech: speech,
                        displayText: speech,
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
                                            'displayText': speech
                                        }
                                    }],
                                    "suggestions": suggests
                                }
                            },
                            facebook: {
                                'expectUserResponse': true,
                                'isSsml': false,
                                'noInputPrompts': [],
                                'richResponse': {
                                    'items': [{
                                        'simpleResponse': {
                                            'textToSpeech': speech,
                                            'displayText': speech
                                        }
                                    }],
                                    "suggestions": suggests
                                }
                            }
                        }
                    });
                    break;
                }
                    
                case "facebook":{
                    res.json({
                        speech: speech,
                        displayText: speech,
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
                                            'displayText': speech
                                        }
                                    }],
                                    "suggestions": suggests
                                }
                            },
                            facebook: {
                                'expectUserResponse': true,
                                'isSsml': false,
                                'noInputPrompts': [],
                                'richResponse': {
                                    'items': [{
                                        'simpleResponse': {
                                            'textToSpeech': speech,
                                            'displayText': speech
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
                        displayText: speech
                    });
                }
            }
}
