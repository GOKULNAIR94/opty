module.exports = function getObject( pId, req, res, callback ) {
    var Query = require( "./query" );
    var Update = require( "./update" );
    
    var actionType = "";
    var objectName = '';
    var attributeName = '';
    var speech = '';
    
    objectName = req.body.result.parameters.object;
    actionType = req.body.result.parameters.actionType;
    attributeName = req.body.result.parameters.MSAttributes;
    var MSRecordName = req.body.result.parameters.recordName;
    
    urlPath = "/salesApi/resources/latest/MarketSpend_c?onlyData=true&q=PromotionName_Id_c=" + pId + ";RecordName=" + MSRecordName;
    Query( req, res, urlPath, function( result ) {
        var promoCount = result.count;
        console.log("promoCount : " + promoCount);
        speech = "";

        if( promoCount == 1 ){
            if( actionType == "update" && req.body.result.parameters.objectName == "MarketSpend_c" ){
                var bodyToUpdate = {};
                var newValue = req.body.result.parameters.newValue;
                bodyToUpdate[attributeName] = newValue;
                urlPath = '/salesApi/resources/latest/MarketSpend_c/' + result.items[0].Id;
                Update( req, res, urlPath, bodyToUpdate, function( result ) {
                    console.log( "Value Updated : " + result);
                    speech = "Value has been updated";
                    res.json({
                        speech: speech,
                        displayText: speech,
                        contextOut: [{"name":"action2", "lifespan":1, "parameters":{ "MSAttributes.original" :ogAttribute }}]
                        //source: 'webhook-OSC-oppty'
                    })
                });
            }
            else{
                callback( result );
            }

        }
        if( promoCount > 1 ){
            callback( result );
        }
    });
}
