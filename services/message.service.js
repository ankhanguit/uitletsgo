/**
 * Created by panda94 on 09/12/2016.
 * Service , reference dynamic collection name, syntax :[ group_member_ + Id group]
 * F- addGroupMessage
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


module.exports = service;

/**
 * Gropu add message
 * @param author
 * @param groupId
 * @param message
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
                console.log("[" + new Date()  + "][message.service.js][addGroupMessage] : " + err.name + ': ' + err.message);
            }

            var msg = {success: true};
            deferred.resolve(msg);
        });

    return deferred.promise;
}