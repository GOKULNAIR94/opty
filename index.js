module.exports = function(req, res) {
    
    var objectName = '';
    var PromoProg = require( "./PromoProg" );
    console.log( "In Query!" );

    objectName = req.body.result.parameters.objectName;
    console.log( "objectName : " + objectName);
    
    switch ( objectName ) {
        case "__ORACO__PromotionProgram_c":
            PromoProg( req, res, function( result ) {
                console.log( "result : " + result);
            });
            break;

        case "default":
            break;
    }
}