module.exports = function(req, res) {

    var GoogleNews, googleNews, track;

    GoogleNews = require('google-news');
    googleNews = new GoogleNews();

    track = 'Life of Pi';

    googleNews.stream(track, function(stream) {
        var news = "";

        stream.on(GoogleNews.DATA, function(data) {
            console.log('Stringify ' + JSON.stringify(data));
            //console.log('Data Event received... ' + data.title);
            callback( data.title );
        });

        stream.on(GoogleNews.ERROR, function(error) {
            console.log('Error Event received... ' + error);
        });
    });

}