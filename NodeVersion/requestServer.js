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
    app.use('/css', express.static(__dirname + '/webcontent/css'));
    app.use('/img', express.static(__dirname + '/webcontent/img'));
});

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/webcontent/index.html');
	
});

//Test muss wieder gelöscht werden!!!
app.get('/balken', function (req, res) {
    res.sendfile(__dirname + '/webcontent/balken.html');

});

io.sockets.on('connection', function (socket) {
	// Daten an Client senden: socket.emit();
	// Daten vom Client empfangen: socket.on('EVENT', function(data){... mach was mit den Daten};);
	
	
	socket.on('zeit', function(data){
		var options = {
				  hostname: 'api.zeit.de',
				  port: 80,
				  path: '/content?api_key=6e499da47fcb281145e490fb6fba3d02028ba8c83af1f50383ee&q=' + data.content + '%20AND%20release_date:%5B1994-01-01T00:00:00Z%20TO%202012-12-31T23:59:59.999Z%5D&facet_date=1month',
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

            var t = data.yearBegin;
            var interval = setInterval(function(){

                var options = {
                    hostname: 'api.nytimes.com',
                    port: 80,
                    path: '/svc/search/v1/article?format=json&query='+ data.content +'+publication_year%3A%5B'+ t +'%5D&facets=publication_month&api-key=4ab2cc4152fc06ea2b955b05872c2085:15:67471795',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                };


                http.get(options, function(res) {
                    var data = '';

                    res.on('data', function (chunk){
                        data += chunk;
                    });

                    res.on('end',function(){
                        socket.emit('nytResponse', JSON.parse(data));
                    });
                });

                t++;
                if(t == data.yearEnd+1){
                    tempF();
                }
            },150);

            function tempF(){
                clearInterval(interval);
            };
    }) ;
	
	socket.on('diconnect', function(){
		// disconet des client
	});
});

