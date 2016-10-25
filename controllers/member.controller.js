/**
 * Created by panda94 on 09/12/2016.
 * Controller member middleware
 * F- Join: (http://host/member/join) : add member to group
 * F- Leave: (http://host/member/leave) : member leave group
 * F- Permit: (http://host/member/permit) : permit member join group
 * F- Lock: (http://host/member/lock) : lock member
 * F- getGroup (http://host/member/getGroup) : get list affiliated  groups
 *
 * Update: 10/12/2016.
 */

var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

var utils = require('logic/utils.logic');

/**
 * POST: join group
 * params: author = Id member, token, group = Id group
 */
router.post('/join', function (req, res) {
    // authenticate using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/members/join',
        form: req.body,
        json: true
    }, function (error, response, body) {

        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if( response.statusCode == 200) {
            // join group successful
            res.status(200).json({'message':utils.message("MSG001-MB-I") , 'successful' : 'true', 'info' : ''});
        }else if(response.statusCode == 400){
            // database error, check token error, member exist
            res.status(400).json({'message':response.body , 'successful' : 'false', 'info' : ''});
        }else{
            // status exception
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }
    });
});

/**
 * DELETE: leave group
 * params: author = Id member, token, group = Id group
 */
router.delete('/leave', function (req, res) {
    // register using api to maintain clean separation between layers
    request.delete({
        url: config.apiUrl + '/members/leave',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if (response.statusCode == 200) {
            // leave group successful
            return res.status(200).json({'message':utils.message("MSG002-MB-I") , 'successful' : 'true', 'info' : ''});
        }else if(response.statusCode == 400){
            // database error, check token error
            res.status(400).json({'message':response.body , 'successful' : 'false', 'info' : ''});
        }else{
            // status exception
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }
    });
});

/**
 * POST: permit member
 * params: author = Id group own user, token, group = Id group, member = Id member
 */
router.post('/permit', function (req, res) {
    // authenticate using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/members/permit',
        form: req.body,
        json: true
    }, function (error, response, body) {

        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if( response.statusCode == 200) {
            // permit member successful
            res.status(200).json({'message':utils.message("MSG003-MB-I") , 'successful' : 'true', 'info' : ''});
        }else if(response.statusCode == 400){
            // database error, check token error
            res.status(400).json({'message':response.body , 'successful' : 'false', 'info' : ''});
        } else{
            // status exception
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }
    });
});

/**
 * POST: lock member
 * params: author = Id group own user, token, group = Id group, member = Id member
 */
router.post('/lock', function (req, res) {
    // authenticate using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/members/lock',
        form: req.body,
        json: true
    }, function (error, response, body) {

        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if( response.statusCode == 200) {
            // lock member successful
            res.status(200).json({'message':utils.message("MSG004-MB-I") , 'successful' : 'true', 'info' : ''});
        }else if(response.statusCode == 400){
            // database error, check token error
            res.status(400).json({'message':response.body , 'successful' : 'false', 'info' : ''});
        } else{
            // status exception
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }
    });
});

/**
 * POST: get list group
 * params: author = Id user, token
 */
router.post('/getGroup', function (req, res) {
    // register using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/members/getGroup',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if (response.statusCode == 200) {
            // get under groups successful
            return res.status(200).json({'message':utils.message("MSG006-MB-I") , 'successful' : 'true', 'info' : body.groups});
        }else if(response.statusCode == 400){
            // database error, get groups result null
            res.status(400).json({'message':response.body , 'successful' : 'false', 'info' : ''});
        }else{
            // status exception
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }
    });
});

module.exports = router;