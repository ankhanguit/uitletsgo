var config = require('config.json');
var express = require('express');
var router = express.Router();

var memberService = require('services/member.service');
var tokenService = require('services/token.service');

// routes
router.post('/join', joinGroup);
router.delete('/leave', leaveGroup);
router.post('/permit', permission);
router.post('/lock', lock);

module.exports = router;

function joinGroup(req, res) {

    var author = req.body.author;
    var token = req.body.token;
    var group = req.body.group;

    tokenService.checkToken(author, token)
        .then(function (subMsg) {
            if(subMsg && subMsg.success == true){
                console.log("validate user authenticate success, userId =" + author);
                join();
            }else{
                res.sendStatus(401);
            }

        }).catch(function () {
        res.sendStatus(401);
    });

    function join(){
        memberService.join(author, group)
            .then(function (msg) {
                if(msg && msg.success == true){
                    res.sendStatus(200);
                }else{
                    res.sendStatus(500);
                }
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    }
}

function leaveGroup(req, res) {
    var groupId = req.body.group;
    var author = req.body.author;
    var token = req.body.token;

    tokenService.checkToken(author, token)
        .then(function (subMsg) {
            if(subMsg && subMsg.success == true){
                console.log("validate user authenticate success, userId =" + author);
                leave()
            }else{
                res.sendStatus(401);
            }

        }).catch(function (subErr) {
        res.sendStatus(401);
    });

    function leave(){
        memberService.leave(groupId, author)
            .then(function (msg) {
                if(msg && msg.success == true){
                    res.sendStatus(200);
                }else{
                    res.sendStatus(500);
                }

            })
            .catch(function (err) {
                res.status(500).send(err);
            });
    }

}

function permission(req, res) {

    var author = req.body.author;
    var token = req.body.token;
    var group = req.body.group;
    var member_id = req.body.member;

    tokenService.checkToken(author, token)
        .then(function (subMsg) {
            if(subMsg && subMsg.success == true){
                console.log("validate user authenticate success, userId =" + author);
                permit();
            }else{
                res.sendStatus(401);
            }

        }).catch(function () {
        res.sendStatus(401);
    });

    function permit(){
        memberService.permit(member_id, group)
            .then(function (group) {
                res.status(200).send(group);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    }
}

function lock(req, res) {

    var author = req.body.author;
    var token = req.body.token;
    var group = req.body.group;
    var member_id = req.body.member;

    tokenService.checkToken(author, token)
        .then(function (subMsg) {
            if(subMsg && subMsg.success == true){
                console.log("validate user authenticate success, userId =" + author);
                lockMember();
            }else{
                res.sendStatus(401);
            }

        }).catch(function () {
        res.sendStatus(401);
    });

    function lockMember(){
        memberService.lock(member_id, group)
            .then(function (group) {
                res.status(200).send(group);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    }
}