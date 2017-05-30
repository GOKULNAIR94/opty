module.exports = function PromoProg( req, res, callback ) {

    var getPromo = require( "./getPromo" );

    var speech = "";
    
    getPromo( req, res, function( result ) {
        console.log( "result : " + result);
        var speech = "";
        var promoCount = result.count;

        var pId = '';
        var pName = '';

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
}
