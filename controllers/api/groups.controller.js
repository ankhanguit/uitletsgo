/**
 * Created by panda94 on 09/12/2016.
 * Controller group handle
 *
 * F- CreateGroup: (http://host/api/groups/add), middleware: (http://host/group/add) : user create new  group
 * F- DeleteGroup: (http://host/api/groups/delete), middleware: (http://host/group/delete) : user delete group
 * F- UpdateGroup: (http://host/groups/update) , middleware: (http://host/group/update) : update group profile
 * F- GetList: (http://host/api/groups/get), middleware: (http://host/group/get) : get list group created by user
 * F- Search: (http://host/api/groups/search), middleware: (http://host/group/search) : search all group by name
 *
 * Update: 10/12/2016.
 */

var config = require('config.json');
var express = require('express');
var router = express.Router();
var utils = require('logic/utils.logic');

var groupService = require('services/group.service');
var tokenService = require('services/token.service');


// routes
router.post('/add', createGroup);
router.delete('/delete', deleteGroup);
router.put('/update', updateGroup);
router.post('/get', getList);
router.post('/search', search);

module.exports = router;

/**
 * Create group
 * @param req: author = Id user, token, decription = group decription, name = group name
 * @param res
 */
function createGroup(req, res) {

    var author = req.body.author;
    var token = req.body.token;

    // check token
    tokenService.checkToken(author, token)
        .then(function (subMsg) {
                newGroup();
        }).catch(function (subErr) {
        res.status(400).send(subErr);
    });

    // new group
    function newGroup(){
        groupService.create(req.body)
            .then(function (group) {
                res.status(200).send(group);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    }
}

/**
 * Delete group
 * @param req: author = Id user, id = Id group, token
 * @param res
 */
function deleteGroup(req, res) {
    var groupId = req.body.id;

    var author = req.body.author;
    var token = req.body.token;

    // check token
    tokenService.checkToken(author, token)
        .then(function (subMsg) {
                groupRemove()
        }).catch(function (subErr) {
            res.status(400).send(subErr);
    });

    // remove groups
    function groupRemove(){
        groupService.delete(groupId, author)
            .then(function (msg) {
                res.sendStatus(200);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    }

}

/**
 * Update group profile
 * @param req: author = Id user, token, id = Id group, name = group name, decription
 * @param res
 */
function updateGroup(req, res){

    var author = req.body.author;
    var token = req.body.token;
    var groupId = req.body.id;

    // check token
    tokenService.checkToken(author, token)
        .then(function (subMsg) {
            groupUpdate();
        }).catch(function (subErr) {
            res.status(400).send(subErr);
    });

    // update group profile
    function groupUpdate(){
        groupService.update(groupId, req.body)
            .then(function (msg) {
                    res.sendStatus(200);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    }
}

/**
 * Search group by name
 * @param req: name =  group name (prefix)
 * @param res
 */
function search(req, res){

    var groupName = req.body.name;
    groupService.getByName(groupName)
        .then(function (groups) {
            res.status(200).send({groups: groups});
        })
        .catch(function (err) {
            res.status(400).send(err);
        });

}

/**
 * Get list group own by user
 * @param req: author = Id user, token
 * @param res
 */
function getList(req, res){

    var author = req.body.author;
    var token = req.body.token;

    // check token
    tokenService.checkToken(author, token)
        .then(function (subMsg) {
            getListGroups();
        }).catch(function (subErr) {
        res.status(400).send(subErr);
    });

    // get list group
    function getListGroups(){
        groupService.get(author)
            .then(function (groups) {
                res.status(200).send({groups: groups});
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    }
}