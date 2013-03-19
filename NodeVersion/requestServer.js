var app 		= require('express')();
var http 		= require('http');
var express     = require('express');
var httpServer 	= require('http').createServer(app).listen(8888);
var io 			= require('socket.io').listen(httpServer);


app.configure(function () {
	 // Simple Logger
	app.use(function(req, res, next) {
		console.log('%s %s', req.method, req.url);
		next();
	});
    app.use('/libraries', express.static(__dirname + '/webcontent/libraries'));
});

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/webcontent/index.html');
	
});

io.sockets.on('connection', function (socket) {
	// Daten an Client senden: socket.emit();
	// Daten vom Client empfangen: socket.on('EVENT', function(data){... mach was mit den Daten};);
	
	
	socket.on('zeit', function(data){
		var options = {
				  hostname: 'api.zeit.de',
				  port: 80,
				  path: '/content?api_key=6e499da47fcb281145e490fb6fba3d02028ba8c83af1f50383ee&q='+ data.content +'&facet_date=1year',
				  method: 'GET',
				  headers: { 'Content-Type': 'application/json' }
		};
		
		
		http.get(options, function(res) {    
			  var data = '';
			  
			  res.on('data', function (chunk){
			        data += chunk;
			  });

			  res.on('end',function(){
			     socket.emit('zeitResponse', JSON.parse(data));
			  }); 
		 });   
		
	});


    socket.on('nyt', function(data){
          //todo
    }) ;
	
	socket.on('diconnect', function(){
		// disconet des client
	});
});

