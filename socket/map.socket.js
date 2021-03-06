var tokenService = require('services/token.service');
var memberService = require('services/member.service');

module.exports = function(app,io) {

    var map = io.of('/map').on('connection', function (socket) {

        socket.on('mConnect', function(data) {

            var userId = data.userId;
            var token = data.token;
            var groupId = data.groupId;
            var longitude  = data.longitude ;
            var latitude = data.latitude;

            // check token
            tokenService.checkToken(userId, token)
                .then(function (subMsg) {
                    // check member login
                    memberService.findMember(userId, groupId)
                        .then(function (member) {

                            // show log new member
                            console.log("New member join GROUP MAP: " + data.groupId + "with ID: " + data.userId);


                            // setting socket information
                            socket.userid = userId;
                            socket.firstname = member.FIRSTNAME;
                            socket.lastname = member.LASTNAME;
							socket.username = member.USERNAME;
                            socket.room = groupId;

                            // Add the client to the room
                            socket.join(groupId);

                            // create data set for response
                            var dataRes = {
                                message: "new member join map group",
                                success: "true",
                                flag: "new-member",
                                data: {
                                    userId: socket.userid,
                                    firstname: socket.firstname,
                                    lastname: socket.lastname,
									username: socket.username,
                                    longitude : longitude ,
                                    latitude: latitude
                                }
                            };

                            // broadcast message
                            map.in(data.groupId).emit('mConnect', dataRes);

                        }).catch(function (subErr) {
                        // create data set for response
                        var dataRes = {message:subErr , success: "false", flag: "login", data:""};

                        // login fail, send fail login message
                        socket.emit('mConnect',dataRes);
                    });
                }).catch(function (subErr) {
                // create data set for response
                var dataRes = {message:subErr , success: "false", flag: "login", data:""};

                // login fail, send fail login message
                socket.emit('mConnect',dataRes);
            });
        });

        socket.on('mLocation', function(data) {

            var longitude  = data.longitude ;
            var latitude = data.latitude;
			var flag = data.flag;
            var time = new Date();

            map.in(socket.room).emit('mLocation', {
                message: "Send broadcast location successful",
                success: "true",
                flag: flag,
                data: {
					userId : socket.userid,
                    username: socket.username,
                    firstname: socket.firstname,
                    lastname: socket.lastname,
                    longitude : longitude ,
                    latitude: latitude,
                    time: time
                }
            });
        });
    });
};
