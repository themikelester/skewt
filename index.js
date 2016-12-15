var express = require('express')
var sounding = require('./src/sounding');

var app = express()

app.use(express.static('public'))

app.get('/test', function (req, res) {
	sounding.QuerySounding(function(err, json) {
		if( err ) throw err;
		res.send(json);
	});
})

app.get('/skewt', function (req, res) {
	sounding.QuerySoundingFile('data/denver.gsd', function(err, json) {
		if( err ) throw err;
		res.send(json);
	});
})

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})

// sounding.QuerySoundingFile('data/denver.gsd', function(err, json) {
// 		if( err ) throw err;
// 		console.log(json);
// 	});