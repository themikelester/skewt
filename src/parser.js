// Parser constructor
var Parser = function() {

};

var ktstoms = function(kts) { return kts * 0.51444444444;}

// Parse a GSD string according to http://rucsoundings.noaa.gov/raob_format.html
Parser.prototype.parse = function(text) {
	var results = [];
	
	var lines = text.split('\n');

	lines.forEach(function(line) {
		var cols = line.trim().split(/\s+/);
		var lineType = cols[0];
		var wsunitskts = false;
		switch(parseInt(lineType)) {
			case 3: 
				var wsunits = cols[cols.length-1];
				console.log('Reported wind speed units: ' + wsunits );
				if( wsunits != "kt" && wsunits != "ms" ) { throw new Error("Invalid wind units type"); }
				if( wsunits == "kt" ) { wsunitskts = true; }
				break;
			case 9:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
				var entry = {}
				if( cols[1] != 99999 ) { entry["press"] = cols[1] / 10.0; } // In: tenths of millbars. Out: millibars
				if( cols[2] != 99999 ) { entry["hght"] = cols[2] * 1.0; } // In: meters. Out: meters
				if( cols[3] != 99999 ) { entry["temp"] = cols[3] / 10.0; } // In: tenths of degrees C. Out: degrees C
				if( cols[4] != 99999 ) { entry["dwpt"] = cols[4] / 10.0; } // In: tenths of degrees C. Out: degrees C
				if( cols[5] != 99999 ) { entry["wdir"] = cols[5] * 1.0; } // In: degrees. Out: degrees
				if( cols[6] != 99999 ) { entry["wspd"] = wsunitskts ? ktstoms(cols[6]) : cols[6] / 10.0; } // In: tenths of m/s. Out: m/s
				results.push(entry);
			break;

			default: console.log('Ignoring unexpected line: ' + line);
			break;
		}
	})

	return results;
};

module.exports = Parser;