module.exports = function(req, res) {
    
    var objectName = '';
    var PromoProg = require( "./PromoProg" );

    objectName = req.body.result.parameters.object;

    if( objectName == "__ORACO__PromotionProgram_c" ){
        PromoProg( req, res, function( result ) {
            console.log( "result" + result);
        });
    }
}