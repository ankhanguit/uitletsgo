var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.post('/join', function (req, res) {
    // authenticate using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/members/join',
        form: req.body,
        json: true
    }, function (error, response, body) {

        if (error) {
            res.status(401).json({'message':'An error occurred' , 'successful' : 'false', 'info' : ''});
        }else if( response.statusCode == 200) {
            res.status(200).json({'message':'Join group successful, wait for permit' , 'successful' : 'true', 'info' : ''});
        }else if(response.statusCode == 401){
            res.status(401).json({'message':'Please login before create group' , 'successful' : 'false', 'info' : ''});
        }else{
            res.status(400).json({'message':response.body , 'successful' : 'false', 'info' : ''});
        }
    });
});

router.delete('/leave', function (req, res) {
    // register using api to maintain clean separation between layers
    request.delete({
        url: config.apiUrl + '/members/leave',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.status(401).json({'message':'An error occurred' , 'successful' : 'false', 'info' : ''});
        }

        if (response.statusCode == 200) {
            return res.status(200).json({'message':'Leave group successful' , 'successful' : 'true', 'info' : ''});
        }else if(response.statusCode == 401){
            res.status(401).json({'message':'Please login before create group' , 'successful' : 'false', 'info' : ''});
        }else if(response.statusCode == 500){
            res.status(500).json({'message':'Your group not found' , 'successful' : 'false', 'info' : ''});
        }
        else{
            // return success message
            res.status(401).json({'message':"Sorry, you can't leave group right now " , 'successful' : 'false', 'info' : ''});
        }
    });
});

router.post('/permit', function (req, res) {
    // authenticate using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/members/permit',
        form: req.body,
        json: true
    }, function (error, response, body) {

        if (error) {
            res.status(401).json({'message':'An error occurred' , 'successful' : 'false', 'info' : ''});
        }else if( response.statusCode == 200) {
            res.status(200).json({'message':'Permit member successful' , 'successful' : 'true', 'info' : ''});
        }else if(response.statusCode == 401){
            res.status(401).json({'message':'Please login before create group' , 'successful' : 'false', 'info' : ''});
        } else{
            res.status(400).json({'message':"Sorry, you can't permit this member" , 'successful' : 'false', 'info' : ''});
        }
    });
});

router.post('/lock', function (req, res) {
    // authenticate using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/members/lock',
        form: req.body,
        json: true
    }, function (error, response, body) {

        if (error) {
            res.status(401).json({'message':'An error occurred' , 'successful' : 'false', 'info' : ''});
        }else if( response.statusCode == 200) {
            res.status(200).json({'message':'Lock member successful' , 'successful' : 'true', 'info' : ''});
        }else if(response.statusCode == 401){
            res.status(401).json({'message':'Please login before create group' , 'successful' : 'false', 'info' : ''});
        } else{
            res.status(400).json({'message':"Sorry, you can't lock this member" , 'successful' : 'false', 'info' : ''});
        }
    });
});

module.exports = router;