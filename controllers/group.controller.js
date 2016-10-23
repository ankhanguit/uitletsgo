/**
 * Created by panda94 on 09/12/2016.
 * Controller group middleware
 * F- Add: (http://host/group/add) : add new group to database
 * F- Update: (http://host/group/update) : update group profile
 * F- UpdateSchedule: (http://host/group/updateSchedule) : update group schedule
 * F- UpdatePreparation: (http://host/group/updatePreparation) : update group preparation
 * F- Delete: (http://host/group/delete) : remove group from database
 * F- Get: (http://host/group/get) : get own group
 * F- Search: (http://host/group/search) : search group (public)
 * F- GetSchedule: (http://host/group/getSchedule) : get group schedule
 * F- GetPreparation: (http://host/group/getPreparation) : get group preparation
 *
 * Update: 10/23/2016.
 */

var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

var utils = require('logic/utils.logic');

/**
 * POST: add group to database
 * params: author = Id user, token, name = group name, description
 */
router.post('/add', function (req, res) {
    // authenticate using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/groups/add',
        form: req.body,
        json: true
    }, function (error, response, body) {

        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if( response.statusCode == 200 && body.group) {
            // create group successful
            res.status(200).json({'message':utils.message("MSG001-GP-I") , 'successful' : 'true', 'info' : body.group});
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
 * PUT: update group profile
 * params: author = Id user, token, id = Id group, name = group name, description
 */
router.put('/update', function (req, res) {
    // register using api to maintain clean separation between layers
    request.put({
        url: config.apiUrl + '/groups/update',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if (response.statusCode == 200) {
            // update group profile successful
            return res.status(401).json({'message':utils.message("MSG003-GP-I") , 'successful' : 'true', 'info' : ''});
        }else if(response.statusCode == 400) {
            // database error, check token error
            res.status(400).json({'message':response.body , 'successful' : 'false', 'info' : ''});
        }else{
            // status exception
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }
    });
});

/**
 * DELETE: delete group
 * params: author = Id user, token, id = Id group
 */
router.delete('/delete', function (req, res) {
    // register using api to maintain clean separation between layers
    request.delete({
        url: config.apiUrl + '/groups/delete',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if (response.statusCode == 200) {
            // delete group successful
            return res.status(200).json({'message':utils.message("MSG007-GP-I") , 'successful' : 'true', 'info' : ''});
        }else if(response.statusCode == 400){
            // database error, find groups by id fail
            res.status(400).json({'message':response.body , 'successful' : 'false', 'info' : ''});
        }else{
            // status exception
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }
    });
});

/**
 * POST: get list group
 * params: author = Id user, token
 */
router.post('/get', function (req, res) {
    // register using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/groups/get',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if (response.statusCode == 200) {
            // get own groups successful
            return res.status(200).json({'message':utils.message("MSG005-GP-I") , 'successful' : 'true', 'info' : body.groups});
        }else if(response.statusCode == 400){
            // database error, get groups result null
            res.status(400).json({'message':response.body , 'successful' : 'false', 'info' : ''});
        }else{
            // status exception
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }
    });
});

/**
 * POST: search group by name (public)
 * params: name = group name (prefix)
 */
router.post('/search', function (req, res) {
    // register using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/groups/search',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if (response.statusCode == 200) {
            // search has result
            return res.status(200).json({'message':utils.message("MSG006-GP-I") , 'successful' : 'true', 'info' : body.groups});
        }else if(response.statusCode == 400){
            // database error, result search null
            res.status(400).json({'message':response.body , 'successful' : 'false', 'info' : ''});
        }else{
            // status exception
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }
    });
});

/**
 * PUT: update group schedule
 * params: author = Id user, token, id = Id group, schedule
 */
router.put('/updateSchedule', function (req, res) {
    // register using api to maintain clean separation between layers
    request.put({
        url: config.apiUrl + '/groups/updateSchedule',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if (response.statusCode == 200) {
            // update group profile successful
            return res.status(401).json({'message':utils.message("MSG008-GP-I") , 'successful' : 'true', 'info' : ''});
        }else if(response.statusCode == 400) {
            // database error, check token error
            res.status(400).json({'message':response.body , 'successful' : 'false', 'info' : ''});
        }else{
            // status exception
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }
    });
});

/**
 * PUT: update group schedule
 * params: author = Id user, token, id = Id group, preparation
 */
router.put('/updatePreparation', function (req, res) {
    // register using api to maintain clean separation between layers
    request.put({
        url: config.apiUrl + '/groups/updatePreparation',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if (response.statusCode == 200) {
            // update group profile successful
            return res.status(401).json({'message':utils.message("MSG009-GP-I") , 'successful' : 'true', 'info' : ''});
        }else if(response.statusCode == 400) {
            // database error, check token error
            res.status(400).json({'message':response.body , 'successful' : 'false', 'info' : ''});
        }else{
            // status exception
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }
    });
});

/**
 * POST: get group schedule
 * params: author = Id user, token, id = Id group
 */
router.post('/getSchedule', function (req, res) {
    // register using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/groups/getSchedule',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if (response.statusCode == 200) {
            // search has result
            return res.status(200).json({'message':utils.message("MSG010-GP-I") , 'successful' : 'true', 'info' : body.schedule});
        }else if(response.statusCode == 400){
            // database error, result search null
            res.status(400).json({'message':response.body , 'successful' : 'false', 'info' : ''});
        }else{
            // status exception
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }
    });
});

/**
 * POST: get group preparation
 * params: author = Id user, token, id = Id group
 */
router.post('/getPreparation', function (req, res) {
    // register using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/groups/getPreparation',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if (response.statusCode == 200) {
            // search has result
            return res.status(200).json({'message':utils.message("MSG011-GP-I") , 'successful' : 'true', 'info' : body.preparation});
        }else if(response.statusCode == 400){
            // database error, result search null
            res.status(400).json({'message':response.body , 'successful' : 'false', 'info' : ''});
        }else{
            // status exception
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }
    });
});
module.exports = router;