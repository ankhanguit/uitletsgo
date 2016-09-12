var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');



router.post('/login', function (req, res) {
    // authenticate using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/authenticate',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.status(401).json({'message':'An error occurred' , 'successful' : 'false', 'info' : ''});
        }

        if (!body.message) {
            return res.status(401).json({'message':'Username or password is incorrect' , 'successful' : 'false', 'info' : ''});
        }

        res.status(200).json(body.message);
    });
});

router.post('/register', function (req, res) {
    // register using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/register',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.status(401).json({'message':'An error occurred' , 'successful' : 'false', 'info' : ''});
        }

        if (response.statusCode !== 200) {
            return res.status(401).json({'message':response.body , 'successful' : 'false', 'info' : ''});
        }

        // return success message
        res.status(401).json({'message':'Register successful' , 'successful' : 'true', 'info' : ''});
    });
});




module.exports = router;