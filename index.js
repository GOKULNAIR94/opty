module.exports = function(req, res) {
    
    var objectName = '';
    var PromoProg = require( "./PromoProg" );
    var MarketSpend = require( "./MarketSpend" );
    console.log( "In Query!" );


    var ogAttribute = req.body.result.parameters["PPattributes"];
    var attributeName = req.body.result.parameters.PPattributes;

    objectName = req.body.result.parameters.objectName;
    console.log( "objectName : " + objectName);
    
    switch ( objectName ) {
        case "__ORACO__PromotionProgram_c":
            PromoProg( req, res, function( result ) {
                console.log( "result : " + result);
                var speech = "";
                var promoCount = result.count;

                if( promoCount == 1 ){
                    speech = ogAttribute + " of " + result.items[0].RecordName + " : " + result.items[0][attributeName];
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
                })
            });
            break;

        case "MarketSpend_c":
            MarketSpend( req, res, function( result ) {
                console.log( "result : " + result);
            });
            break;

        case "default":
            break;
    }
}