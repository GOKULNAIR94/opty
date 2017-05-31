module.exports = function getObject( pId, req, res, callback ) {
    var Query = require( "./query" );
    
    var actionType = "";
    var titleName = '';
    var objectName = '';
    var territoryStored = '';
    var tNumber = '';
    var attributeName = '';
    var speech = '';
    
    titleName = req.body.result.parameters["titleName"];
    territoryStored = req.body.result.parameters.Territory;
    objectName = req.body.result.parameters.object;
    actionType = req.body.result.parameters.actionType;
    attributeName = req.body.result.parameters.PPattributes;
    var MSRecordName = req.body.result.parameters.recordName;
    
    urlPath = "/salesApi/resources/latest/MarketSpend_c?onlyData=true&q=PromotionName_Id_c=" + pId + ";RecordName=" + MSRecordName;
    Query( req, res, urlPath, function( result ) {
        var promoCount = result.count;
        console.log("promoCount : " + promoCount);
        speech = "";

        if( promoCount == 1 ){
            if( actionType == "update" && req.body.result.parameters.objectName == "__ORACO__PromotionProgram_c" ){
                var bodyToUpdate = {};
                var newValue = req.body.result.parameters.newValue;
                bodyToUpdate[attributeName] = newValue;
                urlPath = '/salesApi/resources/latest/__ORACO__PromotionProgram_c/' + result.items[0].Id;
                Update( req, res, urlPath, bodyToUpdate, function( result ) {
                    console.log( "Value Updated : " + result);
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
