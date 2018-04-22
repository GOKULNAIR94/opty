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
                                "attachment":{
                                  "type":"template",
                                  "payload":{
                                    "template_type":"generic",
                                    "elements":[
                                       {
                                        "title":"Welcome!",
                                        "image_url":"https://petersfancybrownhats.com/company_image.png",
                                        "subtitle":"We have the right hat for everyone.",
                                        "default_action": {
                                          "type": "web_url",
                                          "url": "https://petersfancybrownhats.com/view?item=103",
                                          "messenger_extensions": false,
                                          "webview_height_ratio": "tall",
                                          "fallback_url": "https://petersfancybrownhats.com/"
                                        },
                                        "buttons":[
                                          {
                                            "type":"web_url",
                                            "url":"https://petersfancybrownhats.com",
                                            "title":"View Website"
                                          },{
                                            "type":"postback",
                                            "title":"Start Chatting",
                                            "payload":"DEVELOPER_DEFINED_PAYLOAD"
                                          }              
                                        ]      
                                      }
                                    ]
                                  }
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
