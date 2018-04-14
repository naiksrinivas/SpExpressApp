var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');

var username = "";

var scopes = ['user-read-private', 'user-read-email'],
    redirectUri = 'http://localhost:3100/auth/callback'
    clientId = '179a89fae8d44560be2e56900cad4f68',
    state = 'srinivas-naik';
    clientSecret = 'af50a6be7ce945e6b84527851f0178ed';

var spotifyApi = new SpotifyWebApi({
        redirectUri : redirectUri,
        clientId : clientId,
        clientSecret: clientSecret
    });

spotifyApi.setRedirectURI(redirectUri);
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect(authorizeURL);
});

router.get('/callback', function(req, res, next) {
    var code = req.query.code;
    spotifyApi.authorizationCodeGrant(code)
    .then(function(data){
        console.log(data.body['expires_in']);
        console.log(data.body['access_token']);
        console.log(data.body['refresh_token']);

        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
        var string = encodeURIComponent("success");
        res.redirect("http://localhost:4200/user?result=" + string); 
    }, function(err){
        var string = encodeURIComponent(err);
        res.redirect("http://localhost:4200/user?result=" + string);         
    });
       
});

router.get('/userinfo', function(req,res,next){
    spotifyApi.getMe().then(function(data){
        username = data.body.id;        
        res.send({data : data});
    }, function(err){
        console.log('Something went wrong!', err);
    })
});

router.get('/playlist', function(req,res,next){    
    spotifyApi.getPlaylist(username,req.query.id).then(function(data){        
        res.send({data : data});
    }, function(err){
        console.log('Something went wrong!', err);
    })
});


module.exports = {router : router};
