module.exports = function(req, res) {
    
    var objectName = '';
    var PromoProg = require( "./PromoProg" );
    var MarketSpend = require( "./MarketSpend" );
    console.log( "In Query!" );

    objectName = req.body.result.parameters.objectName;
    console.log( "objectName : " + objectName);
    
    switch ( objectName ) {
        case "__ORACO__PromotionProgram_c":
            PromoProg( req, res, function( result ) {
                console.log( "result : " + result);
                var ogAttribute = req.body.result.parameters["PPattributes"];
                var attributeName = req.body.result.parameters.PPattributes;
                speech = ogAttribute + " of " + result.items[0].RecordName + " : " + result.items[0][attributeName];
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