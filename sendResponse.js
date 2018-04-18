module.exports = function ( speech, suggests, contextOut, req, res, callback){ 

    if (req.body.originalRequest.source == "google") {
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
                        }
                    }
                });
            }else{
                res.json({
                    speech: speech,
                    displayText: speech
                });
            }
}
