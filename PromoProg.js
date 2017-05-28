module.exports = function PromoProg( req, res, callback ) {
    
    var Query = require( "./query" );
    var actionType = "";
    var titleName = '';
    var objectName = '';
    var territoryStored = '';
    var tNumber = '';

    titleName = req.body.result.parameters.titleName;
    territoryStored = req.body.result.parameters.territoryStored;
    objectName = req.body.result.parameters.object;
    actionType = req.body.result.parameters.actionType;

    console.log( "titleName : " + titleName );
    
    urlPath = '/salesApi/resources/latest/Title_c?onlyData=true&q=TitleName_c=' + encodeURIComponent(titleName) + '&fields=TitleNumber_c';
    Query( req, res, urlPath, function( result ) {
        console.log( "result : " + result);
        tNumber = result.items[0].TitleNumber_c;
        console.log("tNumber : " + tNumber);
        
        if( territoryStored != null ){
            console.log( "Territory : " + territoryStored );
            urlPath = '/salesApi/resources/latest/__ORACO__PromotionProgram_c?onlyData=true&q=TitleNumberStored_c=' + tNumber + ';TerritoryStored_c=' + territoryStored + '&fields=RecordName,Id';
            Query( req, res, urlPath, function( result ) {
                console.log( "result : " + result);
            });
        }
    });
    callback("Done");
}