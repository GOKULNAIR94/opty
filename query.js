module.exports = function(req, res) {
    
    var objectName = '';
    var PromoProg = require( "./PromoProg" );
    console.log( "In Query!" );

    objectName = req.body.result.parameters.object;
    console.log( "objectName" + objectName);
    
    if( objectName == "__ORACO__PromotionProgram_c" ){
        PromoProg( req, res, function( result ) {
            console.log( "result" + result);
        });
    }
}