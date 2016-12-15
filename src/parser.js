// Parser constructor
var Parser = function() {

};

// Parse a GSD string according to http://rucsoundings.noaa.gov/raob_format.html
Parser.prototype.parse = function(text) {
	var results = [];
	
	var lines = text.split('\n');

	lines.forEach(function(line) {
		var cols = line.trim().split(/\s+/);
		var lineType = cols[0];
		switch(parseInt(lineType)) {
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
				if( cols[6] != 99999 ) { entry["wspd"] = cols[6] * 1.0; } // In: m/s. Out: m/s
				results.push(entry);
			break;

			default: console.log('Ignoring unexpected line: ' + line);
			break;
		}
	})

	return results;
};

module.exports = Parser;