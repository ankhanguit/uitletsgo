var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var utils = require('logic/utils.logic');
var db = mongo.db(process.env.MONGODB_URI, { native_parser: true });
db.bind('groups');

var service = {};

service.getById = getById;
service.getByName = findByName;
service.create = create;
service.update = update;
service.get = getList;
service.delete = _delete;

module.exports = service;

function getById(_id) {
    var deferred = Q.defer();

    db.groups.findById(_id, function (err, group) {
        if (err) deferred.reject(err.name + ': ' + err.message);

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

function create(groupParam) {
    var deferred = Q.defer();

    var groupCode = utils.random(4,'#A');

    // set user object to userParam without the cleartext password
    var set = {
        AUTHOR:mongo.helper.toObjectID(groupParam.author),
        NAME:groupParam.name,
        DECRIPTION:groupParam.decription,
        CODE: groupCode,
        STATUS: "0",
        LOCK: "0",
        CREATEDATE: new Date(),
        UPDATEDATE: new Date()
    };

    db.groups.insert(
        set,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            var group = _.omit(doc.ops[0], 'STATUS', 'LOCK');
            deferred.resolve({group: group});
        });

    return deferred.promise;
}

function update(_id, groupParam) {
    var deferred = Q.defer();
    var author = groupParam.author;

    var set = {
        NAME: groupParam.name,
        DECRIPTION: groupParam.decription,
        UPDATEDATE: new Date()
    };

    db.groups.findById(_id, function (err, group) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (group && group.AUTHOR == author) {
            // return user (without hashed password)
            groupUpdate();
        } else {
            // user not found
            deferred.resolve();
        }
    });

    function groupUpdate(){
        db.groups.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                var msg = {success: true};
                deferred.resolve(msg);
            });
    }


    return deferred.promise;
}

function _delete(_id, author) {
    var deferred = Q.defer();

    db.groups.findById(_id, function (err, group) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (group && group.AUTHOR == author) {
            // return user (without hashed password)
            groupRemove();
        } else {
            // user not found
            deferred.resolve();
        }
    });

    function groupRemove(){
        db.groups.remove(
            { _id: mongo.helper.toObjectID(_id) },
            function (err) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                var msg = {success: true};
                deferred.resolve(msg);
            });
    }

    return deferred.promise;
}

function getList(author) {
    var deferred = Q.defer();
    var groupsResult;

    db.groups.find({AUTHOR: author}).toArray( function (err, groups) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (groups) {
            for (i = 0; i < groups.length; i++) {
                groups[i] = _.omit(groups[i], 'STATUS', 'LOCK', 'CREATEDATE', 'UPDATEDATE');

            }
            deferred.resolve(groups);
        }

    });

    return deferred.promise;
}

function findByName(groupName){
    var deferred = Q.defer();
    db.groups.aggregate([
        { $match: {'NAME': new RegExp(groupName, "i")}},
        { $lookup: { from: "users", localField: "AUTHOR", foreignField: "_id", as: "AUTHOR_INFO"}},
        { $limit : 20 },
        { $unwind : "$AUTHOR_INFO"},
        { $project: { NAME : 1, DECRIPTION : 1, AUTHOR_FIRSTNAME : "$AUTHOR_INFO.FIRSTNAME" ,AUTHOR_LASTNAME : "$AUTHOR_INFO.LASTNAME" , CODE: 1}}

    ],function (err, groups) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        console.log(groups);
        deferred.resolve(groups);
    });

    return deferred.promise;
}