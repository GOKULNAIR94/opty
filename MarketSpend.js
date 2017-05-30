module.exports = function MarketSpend( req, res, callback ) {
    
    var getPromo = require( "./getPromo" );
    var getObject = require( "./getObject" );
    var speech = "";
    //var ogAttribute = req.body.result.parameters["PPattributes"];
    var attributeName = req.body.result.parameters.PPattributes;
    var titleName = req.body.result.contexts[0].parameters["titleName.original"];
    var ogAttribute = req.body.result.contexts[0].parameters["PPattributes.original"];

    getPromo( req, res, function( result ) {
        console.log( "result : " + result);
        var speech = "";
        var promoCount = result.count;

        var pId = '';
        var pName = '';

        if( promoCount == 1 ){
            pId = result.items[0].Id;
            pName = result.items[0].RecordName;
            getObject( req, res, function( result ) {

            });
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
    
}