module.exports = function getPromo( req, res, callback ) {
    
    var Query = require( "./query" );
    var Update = require( "./update" );
    
    var actionType = "";
    var titleName = '';
    var objectName = '';
    var territoryStored = '';
    var tNumber = '';
    var attributeName = '';
    var speech = '';
    

    //titleName = req.body.result.contexts[0].parameters["titleName.original"];
    titleName = req.body.result.parameters["titleName"];
    territoryStored = req.body.result.parameters.Territory;
    objectName = req.body.result.parameters.object;
    actionType = req.body.result.parameters.actionType;
    attributeName = req.body.result.parameters.PPattributes;
    

    console.log( "titleName : " + titleName );
    
    urlPath = '/salesApi/resources/latest/Title_c?onlyData=true&q=TitleName_c=' + encodeURIComponent(titleName) + '&fields=TitleNumber_c';
    Query( req, res, urlPath, function( result ) {
        console.log( "result : " + result);
        tNumber = result.items[0].TitleNumber_c;
        console.log("tNumber : " + tNumber);
        urlPath = '/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c=' + tNumber  + ';TerritoryStored_c=' + territoryStored + '&fields=RecordName,Id,' + attributeName;
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
        
    });
}
