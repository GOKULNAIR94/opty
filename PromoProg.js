module.exports = function PromoProg( req, res, callback ) {
    
    var Query = require( "./query" );
    var actionType = "";
    var titleName = '';
    var objectName = '';
    var territoryStored = '';
    var tNumber = '';
    var attributeName = '';
    var speech = '';
    var ogAttribute = '';

    var pId = '';
    var pName = '';

    titleName = req.body.result.contexts[0].parameters["titleName.original"];
    //titleName = req.body.result.parameters["titleName"];
    territoryStored = req.body.result.parameters.Territory;
    objectName = req.body.result.parameters.object;
    actionType = req.body.result.parameters.actionType;
    attributeName = req.body.result.parameters.PPattributes;
    ogAttribute = req.body.result.contexts[0].parameters["PPattributes.original"];
    //ogAttribute = req.body.result.parameters["PPattributes"];


    console.log( "titleName : " + titleName );
    
    urlPath = '/salesApi/resources/latest/Title_c?onlyData=true&q=TitleName_c=' + encodeURIComponent(titleName) + '&fields=TitleNumber_c';
    Query( req, res, urlPath, function( result ) {
        console.log( "result : " + result);
        tNumber = result.items[0].TitleNumber_c;
        console.log("tNumber : " + tNumber);
        
        if( territoryStored != null && territoryStored != "" ){
            console.log( "Territory not null: " + territoryStored );
            urlPath = '/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c=' + tNumber + ';TerritoryStored_c=' + territoryStored;
            Query( req, res, urlPath, function( result ) {
                console.log( "result : " + result);
                speech = ogAttribute + " of " + result.items[0].RecordName + " : " + result.items[0][attributeName];
                res.json({
                    speech: speech,
                    displayText: speech,
                    //source: 'webhook-OSC-oppty'
                })
            });
        }
        else{
            urlPath = '/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c=' + tNumber  + '&fields=RecordName,Id';
            Query( req, res, urlPath, function( result ) {
                var promoCount = result.count;
                console.log("promoCount : " + promoCount);
                speech = "";
                if( promoCount == 0 ){
                    speech = 'There are ' + promoCount + ' promotion(s) for the Title ' + titleName;
                }

                if( promoCount == 1 ){
                    speech = "The " + ogAttribute + " of " + result.items[0].RecordName + " : " + result.items[0][attributeName];
                }
                if( promoCount > 1 ){
                    speech = 'There are ' + promoCount + ' promotion(s) for the Title ' + titleName + "\n Please select a region of the Promotion of the Title";
                    for (var i = 0; i < promoCount; i++) {
                        pId = result.items[i].Id;
                        pName = result.items[i].RecordName;
                        speech = speech + "\n\n" + parseInt(i + 1, 10) + ". " + pId + " - " + pName;
                        if (i == promoCount - 1)
                            speech = speech + ".";
                        else
                            speech = speech + ",";
                    }
                }
                res.json({
                    speech: speech,
                    displayText: speech,
                    //source: 'webhook-OSC-oppty'
                    //"contextOut": [{"name":"attribute", "lifespan":2, "PPattributes":{ogAttribute}}]
                })
            });
        }
    });
    callback("Done");
}