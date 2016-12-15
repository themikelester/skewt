var http = require('http');
var fs = require('fs');

var Parser = require('./parser');

function ParseSounding(text) {
	var parser = new Parser();
	var jsonData = JSON.stringify(parser.parse(text));
	return jsonData
}

var QuerySounding = function(onComplete) {
	var request = { host:'rucsoundings.noaa.gov', path:'/get_soundings.cgi?start=latest&' }
	http.request(request, function(response) {
		var text = '';
		
		response.on('data', function(chunk) {
			text += chunk;
		});

		response.on('end', function () {
			var json = ParseSounding( text );
			onComplete(null, json)
		});
	}).end();
}

function QuerySoundingFile(file, onComplete) {
	fs.readFile(file, function(err,logData) {
		if( err ) throw err;
		var text = logData.toString();
		var json = ParseSounding( text );
		onComplete(null, json);
	});
}

module.exports = { QuerySounding, QuerySoundingFile }