module.exports = function getObject( pId, req, res, callback ) {
    var Query = require( "./query" );
    var Update = require( "./update" );
    
    var actionType = "";
    var objectName = '';
    var attributeName = '';
    var speech = '';
    var MSRecordName = "";
    objectName = req.body.result.parameters.object;
    actionType = req.body.result.parameters.actionType;
    attributeName = req.body.result.contexts[0].parameters.MSAttributes;
    
    if( req.body.result.parameters.recordName != "" && req.body.result.parameters.recordName != null)
        MSRecordName = encodeURIComponent( req.body.result.parameters.recordName );
    
    
    urlPath = "/salesApi/resources/latest/MarketSpend_c?onlyData=true&q=PromotionName_Id_c=" + pId + ";RecordName=" + MSRecordName;
    Query( req, res, urlPath, function( result ) {
        var recordCount = result.count;
        console.log( "recordCount : " + recordCount );
        speech = "";

        if( recordCount == 1 ){
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
                        //source: 'webhook-OSC-oppty'
                        contextOut: [{"name":"msAction2", "lifespan":1, "parameters":{ "titleName.original": titleName, "MSAttributes" : attributeName, "MSAttributes.original" : ogAttribute }}]
                    })
                });
            }
            else{
                callback( result );
            }

        }
        if( recordCount > 1 ){
            callback( result );
        }
    });
}
