// "Terror AND USA" Request und Variablen
var terrorRequest 	 	= new Zeit_API_Request_Builder('content','6e499da47fcb281145e490fb6fba3d02028ba8c83af1f50383ee','Terror AND USA AND release_date:[1980-01-01T00:00:00Z TO 2012-12-31T23:59:59.999Z]','1year');
var terrorRequestCheck 	= false
var terrorArray 	 	= new Array();
	
// "Wahlkampf AND USA" Request und Variablen
var wahlRequest 		= new Zeit_API_Request_Builder('content','6e499da47fcb281145e490fb6fba3d02028ba8c83af1f50383ee','Wahlkampf AND USA AND release_date:[1980-01-01T00:00:00Z TO 2012-12-31T23:59:59.999Z]','1year');
var wahlRequestCheck 	= false
var wahlArray 		 	= new Array();

//"Waffen AND USA" Request und Variablen
var waffenRequest 		= new Zeit_API_Request_Builder('content','6e499da47fcb281145e490fb6fba3d02028ba8c83af1f50383ee','Waffen AND USA AND release_date:[1980-01-01T00:00:00Z TO 2012-12-31T23:59:59.999Z]','1year');
var waffenRequestCheck 	= false
var waffenArray 		= new Array();

//"Angst AND USA" Request und Variablen
var angstRequest 		= new Zeit_API_Request_Builder('content','6e499da47fcb281145e490fb6fba3d02028ba8c83af1f50383ee','Angst AND USA AND release_date:[1980-01-01T00:00:00Z TO 2012-12-31T23:59:59.999Z]','1year');
var angstRequestCheck 	= false
var angstArray 		 	= new Array();
	
terrorRequest.getTopicArray(function(topicArray){
	// Zugriff auf die erste Jahreszahl: topicArray[1]
	// Zugriff auf den Wert, der gefunden Wörter, der ersten Jahreszahl: topicArray[0][0]
	// Zugriff auf die Gesammtzahl der gefunden Wörter: topicArray['found'])
	terrorArray 		= topicArray;
	terrorRequestCheck 	= true;
});
		
wahlRequest.getTopicArray(function(topicArray){
	wahlArray 	 	 	= topicArray;
	wahlRequestCheck 	= true;
});

waffenRequest.getTopicArray(function(topicArray){
	waffenArray 	 	= topicArray;
	waffenRequestCheck 	= true;
});
	
angstRequest.getTopicArray(function(topicArray){
	angstArray 	 	 	= topicArray;
	angstRequestCheck 	= true;
});

var startMainProgramm = setInterval(function(){	
	if(terrorRequestCheck && wahlRequestCheck && waffenRequestCheck && angstRequestCheck){
		mainProgramm();
		window.clearInterval(startMainProgramm);
	};
},1000);