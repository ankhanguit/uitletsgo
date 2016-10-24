/**
 * Created by panda94 on 09/12/2016.
 * Service , reference collection groups
 * F- getById
 * F- findByName
 * F- create
 * F- update
 * F- getList
 * F- _delete
 * F- updateSchedule
 * F- updatePreparation
 * F- getSchedule
 * F- getPreparation
 *
 * Update: 10/12/2016.
 */

var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var utils = require('logic/utils.logic');
var db = mongo.db(process.env.MONGODB_URI, { native_parser: true });
db.bind('groups');

var memberService = require('services/member.service');
var service = {};

service.getById = getById;
service.getByName = findByName;
service.getSchedule = getSchedule;
service.getPreparation = getPreparation;
service.create = create;
service.update = update;
service.updateSchedule = updateSchedule;
service.updatePreparation = updatePreparation;
service.get = getList;
service.delete = _delete;

module.exports = service;

/**
 * Get group by id
 * @param _id
 * @returns {*}
 */
function getById(_id) {
    var deferred = Q.defer();

    // find group by id
    db.groups.findById(_id, function (err, group) {
        if (err){
            // database error
            deferred.reject(utils.message("MSG002-CM-E"));
            console.log("[" + new Date()  + "][user.group.js][getById] : " + err.name + ': ' + err.message);
        }

        if (group) {
            // return user (without hashed password)
            deferred.resolve(group);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

/**
 * Create group
 * @param groupParam
 * @returns {*}
 */
function create(groupParam) {
    var deferred = Q.defer();

    var groupCode = utils.random(4,'#A');

    // set group object to group params
    var set = {
        AUTHOR:mongo.helper.toObjectID(groupParam.author),
        NAME:groupParam.name,
        DESCRIPTION:groupParam.description,
        SCHEDULE: "",
        PREPARE: "",
        CODE: groupCode,
        STATUS: "0",
        LOCK: "0",
        CREATEDATE: new Date(),
        UPDATEDATE: new Date(),
        UPDATE_PREPARATION_DATE: new Date(),
        UPDATE_SCHEDULE_DATE: new Date()
    };

    // insert group profile to database
    db.groups.insert(
        set,
        function (err, doc) {
            if (err){
                // database error
                deferred.reject(utils.message("MSG002-CM-E"));
                console.log("[" + new Date()  + "][user.group.js][create] : " + err.name + ': ' + err.message);
            }

            memberService.join(groupParam.author, doc._id)
                .then(function (subMsg) {

                    // return group profile without STATUS, LOCK
                    var group = _.omit(doc.ops[0], 'STATUS', 'LOCK');
                    deferred.resolve({group: group});

                }).catch(function (subErr) {
                deferred.reject(subErr);
            });
        });

    return deferred.promise;
}

/**
 * Update group profile
 * @param _id
 * @param groupParam
 * @returns {*}
 */
function update(_id, groupParam) {
    var deferred = Q.defer();
    var author = groupParam.author;

    // set update file to group object
    var set = {
        NAME: groupParam.name,
        DESCRIPTION: groupParam.description,
        UPDATEDATE: new Date()
    };

    // find group exist
    db.groups.findById(_id, function (err, group) {
        if (err){
            // database error
            deferred.reject(utils.message("MSG002-CM-E"));
            console.log("[" + new Date()  + "][user.group.js][update] : " + err.name + ': ' + err.message);
        }

        // check group exist
        if (group && group.AUTHOR == author) {
            // update group
            groupUpdate();
        } else {
            // group not found
            deferred.reject(utils.message("MSG001-GP-E"));
        }
    });

    // update group profile
    function groupUpdate(){
        db.groups.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err){
                    // database error
                    deferred.reject(utils.message("MSG002-CM-E"));
                    console.log("[" + new Date()  + "][user.group.js][update] : " + err.name + ': ' + err.message);
                }

                var msg = {success: true};
                deferred.resolve(msg);
            });
    }


    return deferred.promise;
}

/**
 * Delete group
 * @param _id
 * @param author
 * @returns {*}
 * @private
 */
function _delete(_id, author) {
    var deferred = Q.defer();

    // find group exist
    db.groups.findById(_id, function (err, group) {
        if (err){
            // database error
            deferred.reject(utils.message("MSG002-CM-E"));
            console.log("[" + new Date()  + "][user.group.js][_delete] : " + err.name + ': ' + err.message);
        }

        // check exist group and match author = user id
        if (group && group.AUTHOR == author) {
            // remove group
            groupRemove();
        } else {
            // group not found
            deferred.reject(utils.message("MSG002-GP-E"));
        }
    });

    // remove group from database
    function groupRemove(){
        db.groups.remove(
            { _id: mongo.helper.toObjectID(_id) },
            function (err) {
                if (err){
                    // database error
                    deferred.reject(utils.message("MSG002-CM-E"));
                    console.log("[" + new Date()  + "][user.group.js][_delete] : " + err.name + ': ' + err.message);
                }

                var msg = {success: true};
                deferred.resolve(msg);
            });
    }

    return deferred.promise;
}

/**
 * Get list group own by user
 * @param author
 * @returns {*}
 */
function getList(author) {
    var deferred = Q.defer();

    // find group
    db.groups.find({AUTHOR: mongo.helper.toObjectID(author)}).toArray( function (err, groups) {
        if (err){
            // database error
            deferred.reject(utils.message("MSG002-CM-E"));
            console.log("[" + new Date()  + "][user.group.js][getList] : " + err.name + ': ' + err.message);
        }

        // check result list
        if (!_.isEmpty(groups)) {
            for (i = 0; i < groups.length; i++) {
                groups[i] = _.omit(groups[i], 'STATUS', 'LOCK', 'CREATEDATE', 'UPDATEDATE');
            }
            deferred.resolve(groups);
        }else{
            // get groups result null
            deferred.reject(utils.message("MSG004-GP-I"));
        }

    });

    return deferred.promise;
}

/**
 * Search group by name (public function)
 * @param groupName
 * @returns {*}
 */
function findByName(groupName){
    var deferred = Q.defer();
    // prepare query
    db.groups.aggregate([
        { $match: {'NAME': new RegExp(groupName, "i")}},
        { $lookup: { from: "users", localField: "AUTHOR", foreignField: "_id", as: "AUTHOR_INFO"}},
        { $limit : 20 },
        { $unwind : "$AUTHOR_INFO"},
        { $project: { NAME : 1, DECRIPTION : 1, AUTHOR_FIRSTNAME : "$AUTHOR_INFO.FIRSTNAME" ,AUTHOR_LASTNAME : "$AUTHOR_INFO.LASTNAME" , CODE: 1}}

    ],function (err, groups) {
        if (err){
            // database error
            deferred.reject(utils.message("MSG002-CM-E"));
            console.log("[" + new Date()  + "][user.group.js][findByName] : " + err.name + ': ' + err.message);
        }

        // check result empty
		if(!_.isEmpty(groups)){
			deferred.resolve(groups);
        }else{
            // result null
            deferred.reject(utils.message("MSG002-GP-I"));
        }
    });
    return deferred.promise;
}


/**
 * Update schedule
 * @param _id
 * @param groupParam
 * @returns {*|promise}
 */
function updateSchedule(_id, groupParam) {
    var deferred = Q.defer();
    var author = groupParam.author;

    // set update file to group object
    var set = {
        SCHEDULE: groupParam.schedule,
        UPDATE_SCHEDULE_DATE: new Date()
    };

    // find group exist
    db.groups.findById(_id, function (err, group) {
        if (err){
            // database error
            deferred.reject(utils.message("MSG002-CM-E"));
            console.log("[" + new Date()  + "][user.group.js][update] : " + err.name + ': ' + err.message);
        }

        // check group exist
        if (group && group.AUTHOR == author) {
            // update group
            groupUpdate();
        } else {
            // group not found
            deferred.reject(utils.message("MSG001-GP-E"));
        }
    });

    // update group profile
    function groupUpdate(){
        db.groups.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err){
                    // database error
                    deferred.reject(utils.message("MSG002-CM-E"));
                    console.log("[" + new Date()  + "][user.group.js][update] : " + err.name + ': ' + err.message);
                }

                var msg = {success: true};
                deferred.resolve(msg);
            });
    }


    return deferred.promise;
}

/**
 * update Preparation
 * @param _id
 * @param groupParam
 * @returns {*|promise}
 */
function updatePreparation(_id, groupParam) {
    var deferred = Q.defer();
    var author = groupParam.author;

    // set update file to group object
    var set = {
        PREPARATION: groupParam.preparation,
        UPDATE_PREPARATION_DATE: new Date()
    };

    // find group exist
    db.groups.findById(_id, function (err, group) {
        if (err){
            // database error
            deferred.reject(utils.message("MSG002-CM-E"));
            console.log("[" + new Date()  + "][user.group.js][update] : " + err.name + ': ' + err.message);
        }

        // check group exist
        if (group && group.AUTHOR == author) {
            // update group
            groupUpdate();
        } else {
            // group not found
            deferred.reject(utils.message("MSG001-GP-E"));
        }
    });

    // update group profile
    function groupUpdate(){
        db.groups.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err){
                    // database error
                    deferred.reject(utils.message("MSG002-CM-E"));
                    console.log("[" + new Date()  + "][user.group.js][update] : " + err.name + ': ' + err.message);
                }

                var msg = {success: true};
                deferred.resolve(msg);
            });
    }
    return deferred.promise;
}

/**
 * get group Schedule
 * @param member_id
 * @param _id
 * @returns {*}
 */
function getSchedule(member_id, _id){
    var deferred = Q.defer();

    memberService.findOne(member_id, _id)
        .then(function (subMsg) {
            // find group by id
            db.groups.findById(_id, function (err, group) {
                if (err){
                    // database error
                    deferred.reject(utils.message("MSG002-CM-E"));
                    console.log("[" + new Date()  + "][user.group.js][getGroupSchedule] : " + err.name + ': ' + err.message);
                }

                if (group) {
                    // return schedule
                    deferred.resolve({SCHEDULE: group.SCHEDULE , UPDATE_SCHEDULE_DATE: group.UPDATE_SCHEDULE_DATE});
                } else {
                    // user not found
                    deferred.reject(utils.message("MSG001-GP-E"));
                }
            });
        }).catch(function (subErr) {
        deferred.reject(subErr);
    });

    return deferred.promise;
}

/**
 * get group Preparation
 * @param member_id
 * @param _id
 * @returns {*}
 */
function getPreparation(member_id, _id){
    var deferred = Q.defer();

    memberService.findOne(member_id, _id)
        .then(function (subMsg) {
            // find group by id
            db.groups.findById(_id, function (err, group) {
                if (err){
                    // database error
                    deferred.reject(utils.message("MSG002-CM-E"));
                    console.log("[" + new Date()  + "][user.group.js][getGroupSchedule] : " + err.name + ': ' + err.message);
                }

                if (group) {
                    // return preparation
                    deferred.resolve({PREPARATION: group.PREPARATION , UPDATE_PREPARATION_DATE: group.UPDATE_PREPARATION_DATE});
                } else {
                    // user not found
                    deferred.reject(utils.message("MSG001-GP-E"));
                }
            });
        }).catch(function (subErr) {
        deferred.reject(subErr);
    });

    return deferred.promise;
}