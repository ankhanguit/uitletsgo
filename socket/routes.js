var tokenService = require('services/token.service');

var memberService = require('services/member.service');

module.exports = function(app,io) {
    var chat = io.on('connection', function (socket) {
		var address = socket.handshake.address;
		
		console.log("New user connect from IP: " + address.address + "on PORT: " + address.port);

		socket.on('mConnect', function(data) {

			// check token
			tokenService.checkToken(author, token)
					.then(function (subMsg) {
						// check member login
						memberService.findMember(author, token)
								.then(function (member) {
									memberService.findMember();

									// show log new member
									console.log("New member join GROUP: " + data.groupId + "with ID: " + data.userId);


									// setting socket infor
									socket.username = data.userId;
									socket.firstname = member.FIRSTNAME;
									socket.lastname = member.LASTNAME;
									socket.room = data.groupId

									// Add the client to the room
									socket.join(data.groupId);

									// create data set for response
									var dataRes = {
										message: "new member join group chat",
										success: "true",
										flag: "new-member",
										data: {
											userId: socket.userId,
											firstname: socket.firstname,
											lastname: socket.lastname
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
			chat.in(socket.room).emit('mMessage', {
				message: data.message,
				username: socket.username,
				firstname: socket.firstname,
				lastname: socket.lastname
			});
		});
    });
};
