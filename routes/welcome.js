var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('welcome', { 
        title: 'API',
     });
});

module.exports = router;
