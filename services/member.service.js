/**
 * Created by panda94 on 09/12/2016.
 * Service , reference dynamic collection name, syntax :[ group_member_ + Id group]
 * F- joinGroup
 * F- leaveGroup
 * F- permitMember
 * F- lockMember
 * F- findMember
 * F- findOne
 *
 * Update: 10/23/2016.
 */

var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var utils = require('logic/utils.logic');
var db = mongo.db(process.env.MONGODB_URI, { native_parser: true });
db.bind('members');

var service = {};

service.join = joinGroup;
service.leave = leaveGroup;
service.permit = permitMember;
service.lock = lockMember;
service.findMember = findMember;
service.findOne = findOne;

module.exports = service;

/**
 * Member join group
 * @param author
 * @param groupId
 * @returns {*}
 */
function joinGroup(author, groupId) {
    var deferred = Q.defer();

    var objInsert = {'MEMBER_ID': mongo.helper.toObjectID(author), 'JOIN_DATE' : new Date(), 'PERMIT' : 0 , 'ROLE' : 7};
    // validation
    var groupDb = db.collection("group_member_" + groupId);

    // find member exist
    groupDb.findOne(
        { MEMBER_ID: mongo.helper.toObjectID(author)},
        function (err, member) {
            if (err){
                // database error
                deferred.reject(utils.message("MSG002-CM-E"));
                console.log("[" + new Date()  + "][group.service.js][joinGroup] : " + err.name + ': ' + err.message);
            }

            if (member) {
                // member already exists
                deferred.reject(utils.message("MSG001-MB-E"));
            } else {
                insertMember();
            }
        });

    // insert member
    function insertMember(){
        groupDb.insert(
            objInsert,
            function (err, doc) {
                if (err){
                    // database error
                    deferred.reject(utils.message("MSG002-CM-E"));
                    console.log("[" + new Date()  + "][group.service.js][joinGroup] : " + err.name + ': ' + err.message);
                }

                var msg = {success: true};
                deferred.resolve(msg);
            });
    }
    return deferred.promise;
}

/**
 * Member leave group
 * @param member_id
 * @param groupId
 * @returns {*}
 */
function leaveGroup(member_id, groupId) {
    var deferred = Q.defer();

    var groupDb = db.collection("group_member_" + groupId);

    // remove member from database
    groupDb.remove(
        {MEMBER_ID: mongo.helper.toObjectID(member_id)},
        function (err) {
            if (err){
                // database error
                deferred.reject(utils.message("MSG002-CM-E"));
                console.log("[" + new Date()  + "][group.service.js][leaveGroup] : " + err.name + ': ' + err.message);
            }

            var msg = {success: true};
            deferred.resolve(msg);
        });

    return deferred.promise;
}


/**
 * Permit member
 * @param member_Id
 * @param groupId
 * @returns {*}
 */
function permitMember(member_Id, groupId) {
    var deferred = Q.defer();
    var set = {
        PERMIT: 1
    };

    // validation
    var groupDb = db.collection("group_member_" + groupId);

    // update group member status
    groupDb.update(
        { MEMBER_ID: mongo.helper.toObjectID(member_Id) },
        { $set: set },
        function (err, doc) {
            if (err){
                // database error
                deferred.reject(utils.message("MSG002-CM-E"));
                console.log("[" + new Date()  + "][group.service.js][permitMember] : " + err.name + ': ' + err.message);
            }

            var msg = {success: true};
            deferred.resolve(msg);
        });
    return deferred.promise;
}


/**
 * Lock member
 * @param member_Id
 * @param groupId
 * @returns {*}
 */
function lockMember(member_Id, groupId) {
    var deferred = Q.defer();
    var set = {
        PERMIT: 0
    };

    // validation
    var groupDb = db.collection("group_member_" + groupId);

    // update group member status
    groupDb.update(
        { MEMBER_ID: mongo.helper.toObjectID(member_Id) },
        { $set: set },
        function (err, doc) {
            if (err){
                // database error
                deferred.reject(utils.message("MSG002-CM-E"));
                console.log("[" + new Date()  + "][group.service.js][lockMember] : " + err.name + ': ' + err.message);
            }

            var msg = {success: true};
            deferred.resolve(msg);
        });
    return deferred.promise;
}

/**
 * Find member by id from groupId
 * @param memberId
 * @param groupId
 */
function findMember(memberId, groupId){
    var deferred = Q.defer();

    // validation
    var groupDb = db.collection("group_member_" + groupId);

    // find member exist
    groupDb.aggregate([
            { $match: {'MEMBER_ID': mongo.helper.toObjectID(memberId)}},
            { $lookup: { from: "users", localField: "MEMBER_ID", foreignField: "_id", as: "AUTHOR_INFO"}},
            { $unwind : "$AUTHOR_INFO"},
            { $project: { MEMBER_ID : 1, GROUP_ID : 1, FIRSTNAME : "$AUTHOR_INFO.FIRSTNAME" ,LASTNAME : "$AUTHOR_INFO.LASTNAME"}}
        ],
        function (err, member) {
            if (err){
                // database error
                deferred.reject(utils.message("MSG002-CM-E"));
                console.log("[" + new Date()  + "][group.service.js][joinGroup] : " + err.name + ': ' + err.message);
            }

            if (member) {
                // member exists
                deferred.resolve(member[0]);
            } else {
                deferred.reject(utils.message("MSG002-MB-E"));
            }
        });

    return deferred.promise;
}

/**
 * Member find one
 * @param memberId
 * @param groupId
 * @returns {*}
 */
function findOne(memberId, groupId){
    var deferred = Q.defer();

    // validation
    var groupDb = db.collection("group_member_" + groupId);

    // find member exist
    groupDb.findOne(
        { MEMBER_ID: mongo.helper.toObjectID(memberId)},
        function (err, member) {
            if (err){
                // database error
                deferred.reject(utils.message("MSG002-CM-E"));
                console.log("[" + new Date()  + "][group.service.js][joinGroup] : " + err.name + ': ' + err.message);
            }

            // member exists
            if(member) {
                deferred.resolve(member);
            }else{
                deferred.reject(utils.message("MSG003-MB-E"));
            }

        });

    return deferred.promise;
}