// Listen2EyeTribe.js
// Listen to Eye Tribe tracker 
// send JSON frames to socket.io
// 
// Ahmed Abdelali <aabdelali@qf.org.qa>
// Last update : 09/28/2014  06:38 PM
//

var net = require('net')
	util = require('util'),
    io = require('socket.io').listen(8080, {log: false}),  // socket server/port
	connectionOptions = {
		ip: 'localhost',  // Eye Tribe Server
		port: 6555		  // Eye Tribe port
	};

var socket = net.createConnection(connectionOptions, function() {
	setInterval(function() {
		socket.write(JSON.stringify({"category": "heartbeat"}));
	}, 200);

	console.log('Socket on port '+connectionOptions.port+' (TheEyeTribe server) connected');
	socket.on('error', function(data) {
		console.log('TheEyeTribe error', data);
	})

	socket.on('close', function(data) {
		console.log('TheEyeTribe close');
	})

	socket.on('data', function(data) {
		try {
			// Parse json data
			data = JSON.parse(data);
			if(data.values && data.values.frame) {
				console.log(JSON.stringify(data.values.frame.avg));
				// send the selected json data
				io.sockets.emit('message',JSON.stringify(data));
			}
		} catch(e) {
		console.error('Malformed JSON', e);
		}
	})

	socket.write(JSON.stringify({
		category: 'tracker',
		request: 'set',
	values: {push: true}
	}));
});

socket.setEncoding('utf8');
