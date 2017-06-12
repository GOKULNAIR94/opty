module.exports = function(req, res, callback ) {

    var GoogleNews, googleNews, track;

    GoogleNews = require('google-news');
    googleNews = new GoogleNews();

    track = 'Microsoft';

    googleNews.stream(track, function(stream) {
        var news = "";

        stream.on(GoogleNews.DATA, function(data) {
            console.log('Stringify ' + JSON.stringify(data));
            //console.log('Data Event received... ' + data.title);
            //callback( data.title );
            var speech = data.title;
            return res.json({
              speech: speech,
              displayText: speech
            })
        });

        stream.on(GoogleNews.ERROR, function(error) {
            console.log('Error Event received... ' + error);
        });
    });

}