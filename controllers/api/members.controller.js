/**
 * Created by panda94 on 09/12/2016.
 * Controller member handle
 *
 * F- JoinGroup: (http://host/api/members/join), middleware: (http://host/member/join) : member join group
 * F- LeaveGroup: (http://host/api/members/leave), middleware: (http://host/member/leave) : member leave group
 * F- PermitMember: (http://host/members/permit) , middleware: (http://host/member/permit) : permit member join group
 * F- LockMember: (http://host/api/members/lock), middleware: (http://host/member/lock) : lock member from group own
 *
 * Update: 10/12/2016.
 */

var config = require('config.json');
var express = require('express');
var router = express.Router();
var utils = require('logic/utils.logic');

var memberService = require('services/member.service');
var tokenService = require('services/token.service');

// routes
router.post('/join', joinGroup);
router.delete('/leave', leaveGroup);
router.post('/permit', permission);
router.post('/lock', lock);

module.exports = router;

/**
 * Member join group
 * @param req: author = Id member, token, group = group Id
 * @param res
 */
function joinGroup(req, res) {

    var author = req.body.author;
    var token = req.body.token;
    var group = req.body.group;

    // check token
    tokenService.checkToken(author, token)
        .then(function (subMsg) {
            join();
        }).catch(function (subErr) {
            res.status(400).send(subErr);
    });

    // add member to group
    function join(){
        memberService.join(author, group)
            .then(function (msg) {
                res.sendStatus(200);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    }
}

/**
 * Member leave group
 * @param req: author = Id member, token, group = Id group
 * @param res
 */
function leaveGroup(req, res) {
    var groupId = req.body.group;
    var author = req.body.author;
    var token = req.body.token;

    // check token
    tokenService.checkToken(author, token)
        .then(function (subMsg) {
            leave()
        }).catch(function (subErr) {
            res.status(400).send(subErr);
    });

    // remove member from group
    function leave(){
        memberService.leave(groupId, author)
            .then(function (msg) {
                res.sendStatus(200);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    }

}

/**
 * Permit member
 * @param req: author = Id group own, token, group = Id group, member = Id member
 * @param res
 */
function permission(req, res) {

    var author = req.body.author;
    var token = req.body.token;
    var group = req.body.group;
    var member_id = req.body.member;

    // check token
    tokenService.checkToken(author, token)
        .then(function (subMsg) {
            permit();
        }).catch(function (subErr) {
            res.status(400).send(subErr);
    });

    // update member status
    function permit(){
        memberService.permit(member_id, group)
            .then(function (msg) {
                res.sendStatus(200);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    }
}

/**
 * Lock member
 * @param req: author = Id group own, token, group = Id group, member = Id member
 * @param res
 */
function lock(req, res) {

    var author = req.body.author;
    var token = req.body.token;
    var group = req.body.group;
    var member_id = req.body.member;

    // check token
    tokenService.checkToken(author, token)
        .then(function (subMsg) {
            lockMember();
        }).catch(function (subErr) {
            res.status(400).send(subErr);
    });

    // update member status
    function lockMember(){
        memberService.lock(member_id, group)
            .then(function (msg) {
                res.sendStatus(200);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    }
}