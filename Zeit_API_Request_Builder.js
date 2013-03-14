function Zeit_API_Request_Builder(topic, API_Key, query, facet_date) {
	this.topic 				 = topic;
	this.API_Key 			 = API_Key;
	this.query				 = query;
	this.facet_date			 = facet_date;
}

// Asyncroner Request per CrossDomain, deswegen muss ein Callback als Parameter verwendet werden, um den Response syncron verabreiten zu können. 
// s. http://stackoverflow.com/questions/9445909/return-value-from-function-with-ajax-call
Zeit_API_Request_Builder.prototype.getTopicArray = function(callback) {
	
	var url = createRequestURL(this.topic, this.API_Key, null, null, this.query, null, this.facet_date, null, null);
	var topicArray = new Array();
	
    $.ajax({
	        type: 'GET',
	        url: url,
	        contentType: "application/json",
	        dataType: 'jsonp',
	        success: function(data) { callback(successCallback(data)); },
	        error: function() { notSuccessCallback(); },
	        complete: function() { }
	 });

    function successCallback(data){
    	var arrayObject = new Array();
    	var i 			= 0;
    	
    	// API Request Verarbeiten: Jahreszahl und Anzahl der vorgekommenen Wörter pro Jahr in einem Array konvertieren 
    	// und Gesammtanzahl der gefunden Wörter
    	$.each(data.facets.release_date, function(index, value){
    		if(index !== 'start' && index !== 'end' && index !== 'gap') {
    			arrayObject.push([Number(moment(index).format('YYYY')), value]);
    			i++;
    		}
    	});
    	// Sortieren nach Jahr
    	arrayObject.sort(function(a,b) {return a[0] - b[0];} );
    	// Anzhal der gefundenen Wörter
    	arrayObject['found'] = data.found;
    	return arrayObject;
    };
    
    function notSuccessCallback(){
    	console.log('fail');
    };
	
	function createRequestURL(topic, key, sort, fields, query, limit, facet_date, offset, facet_field){
    	var url = 'http://api.zeit.de/';
    	
    	//content || keyword
    	if(typeof topic === 'string'){
    		url = url + topic;
    	};
    	
    	//API Key
    	if(typeof key === 'string'){
    		url = url + '?api_key=' + key;
    	};
    	
    	//release_date desc
    	if(typeof sort === 'string'){
    		url = url + '?sort=' + sort;
    	}; 
    	
       	// subtitle,uuid,title,href,release_date,uri,snippet,supertitle,teaser_title,teaser_text
    	if(typeof fields === 'string'){
    		url = url + '&fields=' + fields;
    	};
    	
       	// s. Domkumentation
    	if(typeof query === 'string'){
    		url = url + '&q=' + query;
    	};      	
    	
       	// limit the amount of matches to return
    	if(typeof limit === 'int'){
    		url = url + '&limit=' + limit;
    	};        	

       	// The facet_date parameter returns counts for the distribution over a specified date range
       	// facet_date	1day, 7day, 1month, 1year, 10year or any numerical variation
    	if(typeof facet_date === 'string'){
    		url = url + '&facet_date=' + facet_date;
    	}; 
       	
       	// offset for the list of matches
    	if(typeof offset === 'int'){
    		url = url + '&offset=' + offset;
    	}; 
       
       	// The facet_field parameter is used to get a frequency distribution for the different values of a field
       	// facet_field	keyword, author, series, department, product or any combination
    	if(typeof facet_field === 'string'){
    		url = url + '&facet_field=' + facet_field;
    	};
    		   	
       	return encodeURI(url);
    };
};