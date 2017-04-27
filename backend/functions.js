var request = require('request');
var config = require('./config');
var sentiment = require('sentiment');

functions = {
    authorize: function(req, res) {
        var header = config.consumerkey + ':' + config.consumersecret;
        var encheader = new Buffer(header).toString('base64');
        var finalheader = 'Basic ' + encheader;

        request.post('https://api.twitter.com/oauth2/token', {
            form: {
                'grant_type': 'client_credentials'
            },
            headers: {
                Authorization: finalheader
            }
        }, function(error, response, body) {
            if (error)
                console.log(error);
            else {
                config.bearertoken = JSON.parse(body).access_token;

                res.json({
                    success: true,
                    data: config.bearertoken
                });
            }

        })
    },

    search: function(req, res) {
        var searchquery = req.body.query;
        var encsearchquery = encodeURIComponent(searchquery);
        var bearerheader = 'Bearer ' + config.bearertoken;
        request.get('https://api.twitter.com/1.1/search/tweets.json?q=' + encsearchquery +
            '&result_type=recent', {
                headers: {
                    Authorization: bearerheader
                }
            },
            function(error, body, response) {
                if (error)
                    console.log(error);
                else {
                    var formatTweets = [];
                    // for (i = 0; i < body.body.length; i++) {
                    //     formatTweets[i] = {
                    //         id: body.statuses[i].id_str,
                    //         screenname: body.statuses[i].user.screen_name,
                    //         name: body.statuses[i].user.name,
                    //         created_at: body.statuses[i].created_at,
                    //         text: body.statuses[i].text,
                    //         sentiment: sentiment(body.statuses[i].text).score,
                    //         positive: sentiment(body.statuses[i].text).positive,
                    //         negative: sentiment(body.statuses[i].text).negative
                    //     }
                    //
                    // }

                    res.json({
                        success: true,
                        data: JSON.parse(body.body)
                    });


                    var jtwit = JSON.parse(body.body);
                    //console.log(body.body);
                    console.log(jtwit.statuses[0]);

                }
            })
    },
    user: function(req, res) {
        var searchquery = req.body.screenname;
        var encsearchquery = encodeURIComponent(searchquery);
        var bearerheader = 'Bearer ' + config.bearertoken;
        request.get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=' + encsearchquery + '&count=2', {
            headers: {
                Authorization: bearerheader
            }
        }, function(error, body, response) {
            if (error)
                console.log(error);
            else {
                res.json({
                    success: true,
                    data: JSON.parse(body.body)
                });
            }
        })
    }

}

module.exports = functions;
