/**
 * Created by panda94 on 09/12/2016.
 * Controller site middleware
 * F- Update: (http://host/user/update) : user update profile
 * F- Delete: (http://host/user/delete) : logic delete user account
 * F- RequestChangePassword: (http://host/user/requestChangePassword) : user require change password (forgot password)
 * F- ValidateDynamicCode: (http://host/user/validateDynamicCode) : user check change password code
 * F- NewPassword (http://host/user/newpassword) : user register new password (forgot password)
 * F- UpdatePassword (http://host/user/updatepassword) : user update password
 *
 * Update: 15/12/2016.
 */

var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
var nodemailer = require('nodemailer');


var utils = require('logic/utils.logic');

var sendmailLogic = require('logic/sendmail.logic');


/**
 * PUT: user update profile
 * params: firstname, lastname, email, address, gender, id, token
 */
router.put('/update', function (req, res) {
    // update user using api to maintain clean separation between layers
    request.put({
        url: config.apiUrl + '/users/update',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if(response.statusCode == 200){
            // update user successful
            res.status(200).json({'message':utils.message("MSG002-UR-I"), 'successful': 'true', 'info': ""});
        }else if(response.statusCode == 400){
            // database error, validate user error, update user error
            res.status(400).json({'message':response.body  , 'successful' : 'false', 'info' : ''});
        }else{
            // status exception
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }

    });
});


/**
 * DELETE: delete logic user
 * params:
 * -N : incomplete
 */
router.get('/delete', function (req, res) {
    var text = "Your code to change password is : 2568";
    sendmailLogic.sendmail("anhkhanguit@gmail.com", text)
        .then(function (success) {
            if (success) {
                res.status(200).json({'message':'Send mail successful' , 'successful' : 'true', 'info' : ''});
            }else {
                res.status(200).json({'message':'Send mail failure' , 'successful' : 'false', 'info' : ''});
            }
        })
        .catch(function (err) {
            res.status(200).json({'message':'Send mail failure' , 'successful' : 'false', 'info' : ''});
        });
});


/**
 * POST: user request new password
 * params: id = Id user
 */
router.post('/requestChangePassword', function (req, res) {
    // authenticate using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/requestChangePassword',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if(response.statusCode == 200){
            // request new code for change password successful
            res.status(200).json({'message':utils.message("MSG001-UR-I"), 'successful': 'true', 'info': ''});
        }else if(response.statusCode == 400){
            // database error, check token login error, update new code error
            res.status(400).json({'message':response.body, 'successful': 'false', 'info': ''});
        }else{
            // status exception
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }

    });
});

/**
 * POST: user validate dynamic code, get from request change password
 * params: userId, code
 */
router.post('/validateDynamicCode', function (req, res) {
    // authenticate using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/validateDynamicCode',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if(response.statusCode == 200){
            // validate new password code successful
            res.status(200).json({'message':utils.message("MSG003-UR-I"), 'successful': 'true', 'info': ''});
        }else if(response.statusCode == 400){
            // database error, find user error
            res.status(400).json({'message':response.body, 'successful': 'false', 'info': ''});
        }else{
            // status exception
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }

    });
});

/**
 * PUT: user register new password
 * params: id = Id user, password
 */
router.put('/newPassword', function (req, res) {
    // authenticate using api to maintain clean separation between layers
    request.put({
        url: config.apiUrl + '/users/newPassword',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            // system error
            res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
        }else if(response.statusCode == 200){
            // user set new password successful
            res.status(200).json({'message':utils.message("MSG005-UR-I"), 'successful': 'true', 'info': ''});
        }else if(response.statusCode == 400){
            // database error, check account permit set new password fail
            res.status(400).json({'message':response.body, 'successful': 'false', 'info': ''});
        }else{
            // status exception
            res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
        }

    });
});

/**
 * PUT: user update password
 * params: id = Id user, password, newpassword, repassword
 */
router.put('/updatePassword', function (req, res) {
    // authenticate using api to maintain clean separation between layers
    var newpassword = req.body.newpassword;
    var repassword = req.body.repassword;

    if(newpassword == repassword) {

        request.put({
            url: config.apiUrl + '/users/updatePassword',
            form: req.body,
            json: true
        }, function (error, response, body) {
            if (error) {
                // system error
                res.status(401).json({'message':utils.message("MSG001-CM-I") , 'successful' : 'false', 'info' : ''});
            }else if (response.statusCode == 200) {
                // update password successful
                res.status(200).json({'message':utils.message("MSG004-UR-I"), 'successful': 'true', 'info': ''});
            }else if (response.statusCode == 400) {
                // database error, check password error
                res.status(400).json({'message':response.body, 'successful': 'false', 'info': ''});
            }else{
                // status exception
                res.status(500).json({'message':utils.message("MSG003-CM-E"), 'successful' : 'false', 'info' : ''});
            }
        });
    }else{
        // form validate error
        res.status(501).json({'message':utils.message("MSG004-UR-E"), 'successful': 'false', 'info': ''});
    }
});

module.exports = router;