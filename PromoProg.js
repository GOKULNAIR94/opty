module.exports = function PromoProg( req, res, callback ) {

    var getPromo = require( "./getPromo" );

    var speech = "";
    //var ogAttribute = req.body.result.parameters["PPattributes"];
    var attributeName = req.body.result.parameters.PPattributes;
    var titleName = req.body.result.contexts[0].parameters["titleName.original"];
    var ogAttribute = req.body.result.contexts[0].parameters["PPattributes.original"];

    getPromo( req, res, function( result ) {
        console.log( "result : " + result);
        var speech = " hi";
        var promoCount = result.count;
        console.log( "promoCount  final : " + promoCount);

        var pId = '';
        var pName = '';

        if( promoCount == 1 ){
            speech = "The " + ogAttribute + " of " + result.items[0].RecordName + " : " + result.items[0][attributeName];
            res.json({
	            speech: speech,
	            displayText: speech,
	            //source: 'webhook-OSC-oppty'
	        });
        }
        
        if( promoCount > 1 ){
            speech = 'There are ' + promoCount + ' promotion(s) for the Title ' + titleName + "\n Please select a region of the Promotion of the Title";
            
            for (var i = 0; i < promoCount; i++) {
                pId = result.items[i].Id;
                pName = result.items[i].RecordName;
                speech = speech + "\n\n" + parseInt(i + 1, 10) + " - " + pName;
                if (i == promoCount - 1)
                    speech = speech + ".";
                else
                    speech = speech + ",";
            }
            console.log( " final titleName : " + titleName);
            console.log( "  final ogAttribute: " + ogAttribute);
            res.json({
	            speech: speech,
	            displayText: speech,
	            //contextOut: [{"name":"action2", "lifespan":1, "parameters":{"titleName.original": "Life of Pi" , "PPattributes.original" :ogAttribute }}]
	            //source: 'webhook-OSC-oppty'
	        });
        }
        console.log( "In If  speech : " + speech);
        
    });
}
