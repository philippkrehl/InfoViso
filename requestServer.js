var app 		= require('express')();
var http 		= require('http');
var express     = require('express');
var port        = Number(process.env.PORT || 8888);
var httpServer 	= require('http').createServer(app).listen(port);
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

// heroku configuration
/*
io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
});
*/

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/webcontent/index.html');
	
});

app.get('/finale', function (req, res) {
    res.sendfile(__dirname + '/webcontent/finale.html');

});

io.sockets.on('connection', function (socket) {
	// Daten an Client senden: socket.emit();
	// Daten vom Client empfangen: socket.on('EVENT', function(data){... mach was mit den Daten};);

    socket.on('nyt', function(data){

            var t = data.yearBegin;

            /*
            Pro Jahr wird ein Get Request gesendet, das heißt für eine Zeitreihe von 20 Jahren müssen 20 Request gesendet werden.
            Jedoch hat die NYT ein Limit "Question per Secend" in der API verbaut, somit müssen die Request durch eine setInterval
            Funtion künstlich verlangsamt werden. Dies ist der Grund für die setInterval Funktion
             */
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

