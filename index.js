var express = require('express')
var sounding = require('./src/sounding');

var app = express()

app.use(express.static('public'))

app.get('/test', function (req, res) {
	sounding.QuerySoundingFile('data/denver.gsd', function(err, json) {
		if( err ) throw err;
		res.send(json);
	});
})

app.get('/getSounding', function (req, res) {
	console.log('SkewT Request');
	sounding.QuerySounding(req.query.latLong, req.query.timeRange, req.query.model, function(err, json) {
		if( err ) {
			res.status(500).send(err.message);
		} else {
			res.send(json);
		}
	});
})

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})