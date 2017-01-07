var http = require('http');
var fs = require('fs');
const assert = require('assert');
var Parser = require('./parser');

const verbose = true;

function ParseSounding(text) {
	var parser = new Parser();
	var jsonData = JSON.stringify(parser.parse(text));
	return jsonData
}

// Arguments are passed according to http://rucsoundings.noaa.gov/text_sounding_query_parameters.pdf
var QuerySounding = function(latLong, timeRangeEpoch, model, onComplete) {
	var args = '/get_soundings.cgi?';

	if( verbose ) { console.log('QuerySounding called: ' + arguments); }

	// Verify Latitude and Longitude coordinates. N and E being positive, separated by a comma. E.g. '40.1,­105.6'.
	var coords = [];
	try { coords = latLong.split(',').map(Number); } catch(e) { return onComplete(new Error( "latLong must be an array containing 2 numbers")); }
	if(!(coords[0] < 90 && coords[0] > -90)) { return onComplete(new Error("Invalid latitude")); }
	if(!(coords[1] < 180 && coords[1] > -180)) { return onComplete(new Error("Invalid longitude")); }
	args += 'airport=' + coords[0] + ',' + coords[1] + '&';

	// Verify start range. Must be comma separated, start and end are in epoch time (UTC time since 1/1/1970) in seconds.
	var timeRange = []
	if( timeRangeEpoch ) {
		try { timeRange = timeRangeEpoch.split(',').map(Number); } catch(e) { return onComplete(new Error( "timeRangeEpoch must be an array containing 2 numbers")); }
		// @TODO: verify that the start time is not too far in the past
		args += 'startSecs=' + timeRange[0] + '&';
		args += 'endSecs=' + timeRange[1] + '&';
	} else {
		args += 'start=latest&';
	}

	// Verify Model
	var modelRanges = {"NAM":15,"Op40":18,"Bak40":24,"GFS":120};
	if( model )	{
		if(!(model in Object.keys(modelRanges))) { return onComplete(new Error("Invalid model")); }
		// @TODO: verify that the time range is not too long for the given model
		args += 'data_source=' + model + '&';
	} else {
		// If a model is not specified, choose the most specific one that covers the time range
		var currentEpochTime = (new Date).getTime() / 1000;
		var hoursOut = (timeRange[1] - currentEpochTime) / 3600;
		var minModel = Object.values(modelRanges).findIndex( function(x) { return x >= hoursOut; } )
		var validModels = Object.keys(modelRanges).slice( minModel );
		if( verbose ) { console.log( 'Valid models for ' + hoursOut + ' hours out: ' + validModels ); }
		args += 'data_source=' + validModels[0] + '&';
	}

	if( verbose ) { console.log( 'rucsoundings.noaa.gov' + args ); }
	var request = { host:'rucsoundings.noaa.gov', path:args }
	http.request(request, function(response) {
		var text = '';
		
		response.on('data', function(chunk) {
			text += chunk;
		});

		response.on('end', function () {
			if( verbose ) { console.log( 'Response status: ' + response.statusCode ) }
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