/**
 * Created by panda94 on 09/12/2016.
 * Controller group handle
 *
 * F- CreateGroup: (http://host/api/groups/add), middleware: (http://host/group/add) : user create new  group
 * F- DeleteGroup: (http://host/api/groups/delete), middleware: (http://host/group/delete) : user delete group
 * F- UpdateGroup: (http://host/groups/update) , middleware: (http://host/group/update) : update group profile
 * F- GetList: (http://host/api/groups/get), middleware: (http://host/group/get) : get list group created by user
 * F- Search: (http://host/api/groups/search), middleware: (http://host/group/search) : search all group by name
 * F- UpdateSchedule: (http://host/groups/updateSchedule) , middleware: (http://host/group/updateSchedule) : update group schedule
 * F- UpdatePreparation: (http://host/groups/updatePreparation) , middleware: (http://host/group/updatePreparation) : update group preparation
 * F- GetSchedule: (http://host/groups/getSchedule) , middleware: (http://host/group/getSchedule) : get group schedule
 * F- GetPreparation: (http://host/groups/getPreparation) , middleware: (http://host/group/getPreparation) : get group preparation
 * F- GetMessages: (http://host/groups/getMessages) , middleware: (http://host/group/getMessages) : get group chat messages
 *
 * Update: 10/23/2016.
 */

var config = require('config.json');
var express = require('express');
var router = express.Router();
var utils = require('logic/utils.logic');

var groupService = require('services/group.service');
var tokenService = require('services/token.service');
var messageService = require('services/message.service');


// routes
router.post('/add', createGroup);
router.delete('/delete', deleteGroup);
router.put('/update', updateGroup);
router.put('/updateSchedule', updateGroupSchedule);
router.put('/updatePreparation', updateGroupPreparation);
router.post('/getSchedule', getGroupSchedule);
router.post('/getPreparation', getGroupPreparation);
router.post('/getMessages', getGroupMessages);
router.post('/get', getList);
router.post('/search', search);

module.exports = router;

/**
 * Create group
 * @param req: author = Id user, token, description = group description, name = group name
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
 * @param req: author = Id user, token, id = Id group, name = group name, description
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

/**
 * Update group schedule
 * @param req: author = Id user, token, id = Id group, schedule
 * @param res
 */
function updateGroupSchedule(req, res){

    var author = req.body.author;
    var token = req.body.token;
    var groupId = req.body.id;

    // check token
    tokenService.checkToken(author, token)
        .then(function (subMsg) {
            groupUpdateSchedule();
        }).catch(function (subErr) {
        res.status(400).send(subErr);
    });

    // update group schedule
    function groupUpdateSchedule(){
        groupService.updateSchedule(groupId, req.body)
            .then(function (msg) {
                res.sendStatus(200);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    }
}

/**
 * Update group schedule
 * @param req: author = Id user, token, id = Id group, preparation
 * @param res
 */
function updateGroupPreparation(req, res){

    var author = req.body.author;
    var token = req.body.token;
    var groupId = req.body.id;

    // check token
    tokenService.checkToken(author, token)
        .then(function (subMsg) {
            groupUpdateSchedule();
        }).catch(function (subErr) {
        res.status(400).send(subErr);
    });

    // update group preparation
    function groupUpdateSchedule(){
        groupService.updatePreparation(groupId, req.body)
            .then(function (msg) {
                res.sendStatus(200);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    }
}
/**
 * Get group preparation
 * @param req: author = Id user, token, id = Id group
 * @param res
 */
function getGroupPreparation(req, res){

    var author = req.body.author;
    var token = req.body.token;
    var groupId = req.body.id;

    // check token
    tokenService.checkToken(author, token)
        .then(function (subMsg) {
            getPreparation();
        }).catch(function (subErr) {
        res.status(400).send(subErr);
    });

    // get group preparation
    function getPreparation(){
        groupService.getPreparation(author, groupId)
            .then(function (preparation) {
                res.status(200).send({preparation: preparation});
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    }
}

/**
 * Get group schedule
 * @param req: author = Id user, token, id = Id group
 * @param res
 */
function getGroupSchedule(req, res){

    var author = req.body.author;
    var token = req.body.token;
    var groupId = req.body.id;

    // check token
    tokenService.checkToken(author, token)
        .then(function (subMsg) {
            getSchedule();
        }).catch(function (subErr) {
        res.status(400).send(subErr);
    });

    // get group schedule
    function getSchedule(){
        groupService.getSchedule(author, groupId)
            .then(function (schedule) {
                res.status(200).send({schedule: schedule});
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    }
}

/**
 * Get group chat messages
 * @param req: author = Id user, token, id = Id group, getBegin, getEnd
 * @param res
 */
function getGroupMessages(req, res){

    var author = req.body.author;
    var token = req.body.token;
    var groupId = req.body.id;
    var begin = req.body.begin;
    var end = req.body.end;

    // check token
    tokenService.checkToken(author, token)
        .then(function (subMsg) {
            getMessages();
        }).catch(function (subErr) {
        res.status(400).send(subErr);
    });

    // get group schedule
    function getMessages(){
        messageService.getMessages(groupId, begin, end)
            .then(function (data) {
                res.status(200).send({data: data});
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    }
}