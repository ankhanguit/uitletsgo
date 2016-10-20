/**
 * Created by panda94 on 09/12/2016.
 * Service , reference dynamic collection name, syntax :[ group_member_ + Id group]
 * F- joinGroup
 * F- leaveGroup
 * F- permitMember
 * F- lockMember
 * F- findMember
 *
 * Update: 10/12/2016.
 */

var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var utils = require('logic/utils.logic');
var db = mongo.db(process.env.MONGODB_URI, { native_parser: true });
db.bind('message');

var service = {};

service.addGroupMessage = addGroupMessage;
service.leave = leaveGroup;
service.permit = permitMember;
service.lock = lockMember;
service.findMember = findMember;

module.exports = service;

/**
 * Member join group
 * @param author
 * @param groupId
 * @returns {*}
 */
function addGroupMessage(author, groupId, message) {
    var deferred = Q.defer();

    var objInsert = {'MEMBER_ID': mongo.helper.toObjectID(author), 'CREATE_DATE' : new Date(), 'MESSAGE' : message};
    // validation
    var messageDb = db.collection("group_message_" + groupId);


    messageDb.insert(
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
        {MEMBER_ID: member_id},
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
        { MEMBER_ID: member_Id },
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
        { MEMBER_ID: member_Id },
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
            { $project: { MEMBER_ID : 1, GROUP_ID : 1, FIRSTNAME : "$AUTHOR_INFO.FIRSTNAME" ,LASTNAME : "$AUTHOR_INFO.LASTNAME" , CODE: 1}}
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