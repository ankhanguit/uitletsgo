var tokenService = require('services/token.service');
var memberService = require('services/member.service');
var groupMessageService = require('services/message.service');

module.exports = function(app,io) {
	var chat = io.on('connection', function (socket) {
		var address = socket.handshake.address;

		socket.on('mConnect', function(data) {

			var userId = data.userId;
			var token = data.token;
			var groupId = data.groupId;

			// check token
			tokenService.checkToken(userId, token)
					.then(function (subMsg) {
						// check member login
						memberService.findMember(userId, groupId)
								.then(function (member) {

									// show log new member
									console.log("New member join GROUP: " + data.groupId + "with ID: " + data.userId);


									// setting socket infor
									socket.username = userId;
									socket.firstname = member.FIRSTNAME;
									socket.lastname = member.LASTNAME;
									socket.room = groupId;

									// Add the client to the room
									socket.join(groupId);

									// create data set for response
									var dataRes = {
										message: "new member join group chat",
										success: "true",
										flag: "new-member",
										data: {
											userId: socket.username,
											firstname: socket.firstname,
											lastname: socket.lastname
										}
									};

									// broadcast message
									chat.in(data.groupId).emit('mConnect', dataRes);

								}).catch(function (subErr) {
							// create data set for response
							var dataRes = {message:subErr , success: "false", flag: "fdsf", data:""};

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

		socket.on('mMessage', function(data) {

			var userId = socket.username;
			var groupId = socket.room;
			var message = data.message;

			groupMessageService.addGroupMessage(userId, groupId, message)
					.then(function (member) {

					}).catch(function (subErr) {

			});

			chat.in(socket.room).emit('mMessage', {
				message: data.message,
				username: socket.username,
				firstname: socket.firstname,
				lastname: socket.lastname
			});
		});
	});
};
