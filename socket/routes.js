var groupService = require('services/group.service');
var tokenService = require('services/token.service');

var memberService = require('services/member.service');

module.exports = function(app,io) {
    var chat = io.on('connection', function (socket) {
		var address = socket.handshake.address;
		
		console.log("New user connect from IP: " + address.address + "on PORT: " + address.port);
		
		socket.on('joinChatGroup', function(data) {

			console.log("New member join GROUP: " + data.groupId + "with ID: " + data.userId);
			socket.username = data.userId;
			socket.room = data.groupId;
			// Add the client to the room
			socket.join(data.groupId);

			chat.in(data.groupId).emit('startChat', {
				userId: data.userId,
			});
		});
		
		socket.on('sendMessage', function(data) {
			chat.in(socket.room).emit('newMessage', {
				message: data.message,
				username: socket.username
			});
		});
    });
};
