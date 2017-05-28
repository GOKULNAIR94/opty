module.exports = function PromoProg( req, res, callback ) {
    var http = require('https');
    var fs = require('fs');
    
    var uname = 'gokuln';
    var pword = 'Goklnt@1';
    
    var actionType = "";
    var titleName = '';
    var objectName = '';
    var territoryStored = '';

    titleName = req.body.result.parameters.titleName;
    territoryStored = req.body.result.parameters.territoryStored;
    objectName = req.body.result.parameters.object;
    actionType = req.body.result.parameters.actionType;

    console.log( "In Promo Prog!" );
    
    if( territoryStored != null ){
        console.log( "Territory : " + territoryStored );
    }

    callback("Done");
}