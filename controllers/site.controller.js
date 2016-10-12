var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

var utils = require('logic/utils.logic');
var tokenService = require('services/token.service');



router.post('/login', function (req, res) {
    // authenticate using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/authenticate',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if (res.statusCode == 400) {
            res.status(400).json({'message':response.body , 'successful' : 'false', 'info' : ''});
        }else if(res.statusCode == 200){
            res.status(200).json({'message':body.token , 'successful' : 'true', 'info' : body.user});
        }else{
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }
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
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        } else if(response.statusCode == 200){
            res.status(200).json({'message':utils.message("MSG001-ST-I") , 'successful' : 'true', 'info' : ''});
        }else if (response.statusCode == 400) {
            res.status(400).json({'message':response.body , 'successful' : 'false', 'info' : ''});
        }else{
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }
    });
});

router.post('/logout', function (req, res) {
    // register using api to maintain clean separation between layers
    if(req.body.author && req.body.token) {
        tokenService.delete(req.body.author, req.body.token).then(function (success) {
                if(success){
                    return res.status(200).json({'message':'' , 'successful' : 'true', 'info' : ''});
                }
            })
            .catch(function (err) {
                return res.status(401).json({'message':utils.message("MSG005-ST-E") , 'successful' : 'false', 'info' : ''});
            });
    }else{
        res.status(401).json({'message':utils.message("MSG004-ST-E") , 'successful' : 'false', 'info' : ''});
    }
});

router.post('/authenticate', function (req, res) {
    // register using api to maintain clean separation between layers
    if(req.body.token) {
        tokenService.find(req.body.token).then(function (success) {
                if(success){
                    return res.status(200).json({'message':'' , 'successful' : 'true', 'info' : ''});
                }

            })
            .catch(function (err) {
                return res.status(401).json({'message':utils.message("MSG005-ST-E") , 'successful' : 'false', 'info' : ''});
            });
    }else{
        res.status(401).json({'message':utils.message("MSG004-ST-E") , 'successful' : 'false', 'info' : ''});
    }
});

module.exports = router;