module.exports = function MarketSpend( req, res, callback ) {
    
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

    //titleName = req.body.result.contexts[0].parameters["titleName.original"];
    titleName = req.body.result.parameters["titleName"];
    territoryStored = req.body.result.parameters.Territory;
    objectName = req.body.result.parameters.object;
    actionType = req.body.result.parameters.actionType;
    attributeName = req.body.result.parameters.PPattributes;
    //ogAttribute = req.body.result.contexts[0].parameters["PPattributes.original"];
    ogAttribute = req.body.result.parameters["PPattributes"];


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
                callback( result );
            });
        }
        else{
            urlPath = '/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c=' + tNumber  + '&fields=RecordName,Id';
            Query( req, res, urlPath, function( result ) {
                var promoCount = result.count;
                console.log("promoCount : " + promoCount);
                speech = "";
                callback( result );
            });
        }
    });
    callback("Done");
}