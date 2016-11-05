var tokenService = require('services/token.service');
var memberService = require('services/member.service');
var groupMessageService = require('services/message.service');

module.exports = function(app,io) {
	var chat = io.on('connection', function (socket) {

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
									socket.user_id = userId;
									socket.firstname = member.FIRSTNAME;
									socket.lastname = member.LASTNAME;
									socket.username = member.USERNAME;
									socket.room = groupId;

									// Add the client to the room
									socket.join(groupId);

									// create data set for response
									var dataRes = {
										message: "new member join group chat",
										success: "true",
										flag: "new-member",
										data: {
											userId: socket.user_id,
											firstname: socket.firstname,
											lastname: socket.lastname,
											username: socket.username
										}
									};

									// broadcast message
									chat.in(data.groupId).emit('mConnect', dataRes);

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

		socket.on('mMessage', function(data) {

			var userId = socket.username;
			var groupId = socket.room;
			var message = data.message;

			groupMessageService.addGroupMessage(userId, groupId, message)
				.then(function (member) {
					chat.in(socket.room).emit('mMessage', {
						message: "Send broadcast message successful",
						success: "true",
						flag: "new-message",
						data: {
							message: data.message,
							userId: socket.user_id,
							username: socket.username,
							firstname: socket.firstname,
							lastname: socket.lastname
						}
					});
				}).catch(function (subErr) {

				socket.emit('mMessage', {
					message: "Can't save this message",
					success: "false",
					flag: "save-false",
					data: ""
				});

			});


		});
	});
};
