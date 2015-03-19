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
	}, 20);

	console.log('Socket on port '+connectionOptions.port+' (TheEyeTribe server) connected');
	socket.on('error', function(data) {
		console.log('TheEyeTribe error', data);
	})

	socket.on('close', function(data) {
		console.log('TheEyeTribe close');
	})

	socket.on('data', function(data) {
		var data_elts = data.replace(/(\r\n|\n|\r)/gm," ").split('{"category":"').join('###{"category":"').split('###');
		for(var i=0;i<data_elts.length;i++) 
		try {
			// Parse json data
			//console.log("Data::: '"+data_elts[i]+"'")

			data_elts[i]=data_elts[i].replace(/^\s+/g,'').replace(' ','');//.replace(/\'/g,"\"");
			data_elts[i]=data_elts[i].replace(/\s+$/g,'');//.replace(/\'/g,"\"");
			//console.log("'"+data_elts[i]+"'")
			if(data_elts[i].length) {
			jdata = JSON.parse(data_elts[i]);
			if(jdata.values && jdata.values.frame) {
				//console.log(JSON.stringify(jdata));
				//console.log(JSON.stringify(data.values.frame.avg));
				// send the selected json data
				io.sockets.emit('message',JSON.stringify(jdata));
			}
			}
		} catch(e) {
			//console.error('Malformed JSON', e,"Data='",jdata,"'==EOD");
			console.error('Malformed JSON', e," Data:",data_elts[i]);
		}
	})

	socket.write(JSON.stringify({
		category: 'tracker',
		request: 'set',
	values: {push: true}
	}));
});

socket.setEncoding('utf8');
