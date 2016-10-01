var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('members');

var service = {};

service.join = joinGroup;
service.leave = leaveGroup;
service.permit = permitMember;
service.lock = lockMember;

module.exports = service;

function joinGroup(author, groupId) {
    var deferred = Q.defer();

    var objInsert = {'MEMBER_ID': author, 'JOIN_DATE' : new Date(), 'PERMIT' : 0 , 'ROLE' : 7};
    // validation
    var groupDb = db.collection("group_member_" + groupId);

    groupDb.findOne(
        { MEMBER_ID: author},
        function (err, member) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (member) {
                // username already exists
                deferred.reject('Member was joined group already');
            } else {
                insertMember();
            }
        });

    function insertMember(){
        groupDb.insert(
            objInsert,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                var msg = {success: true};
                deferred.resolve(msg);
            });
    }
    return deferred.promise;
}

function leaveGroup(member_id, groupId) {
    var deferred = Q.defer();

    var groupDb = db.collection("group_member_" + groupId);

    groupDb.remove(
        {MEMBER_ID: member_id},
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            var msg = {success: true};
            deferred.resolve(msg);
        });

    return deferred.promise;
}


function permitMember(member_Id, groupId) {
    var deferred = Q.defer();
    var set = {
        PERMIT: 1
    };

    // validation
    var groupDb = db.collection("group_member_" + groupId);

    groupDb.update(
        { MEMBER_ID: member_Id },
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            var msg = {success: true};
            deferred.resolve(msg);
        });
    return deferred.promise;
}


function lockMember(member_Id, groupId) {
    var deferred = Q.defer();
    var set = {
        PERMIT: 0
    };

    // validation
    var groupDb = db.collection("group_member_" + groupId);

    groupDb.update(
        { MEMBER_ID: member_Id },
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            var msg = {success: true};
            deferred.resolve(msg);
        });
    return deferred.promise;
}