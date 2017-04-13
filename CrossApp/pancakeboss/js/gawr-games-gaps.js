var NON_AUTHORIZED_1_GAPS = "";
var NON_AUTHORIZED_2_GAPS = "";
var NON_AUTHORIZED_3_GAPS = "";
var NON_AUTHORIZED_4_GAPS = "";
var NON_AUTHORIZED_5_GAPS = "";

var DANGEROUS_FAILS_GAPS = 3;
var LEVEL_MAX_DANGEROUS_FAILS_GAPS = 2;

function testGaps( series, startPosition ) { 

	var nonAuthorizedGaps = "";
	if ( series.attr("data-test-gaps") ) { 
		var tab = series.attr("data-test-gaps");
		eval("nonAuthorizedGaps = NON_AUTHORIZED_" + tab + "_GAPS");
	}

	var fails = 0;
	var step = 0;
	var deviation = series.find(".sprite[data-position=\"" + startPosition + "\"]").attr("data-deviation");
	var testPosition = "-1";
	if (deviation) { 
		testPosition = parseInt( deviation );
	} else { 
		testPosition = parseInt(startPosition) + 1;
	}
	var nextPosition = parseInt(series.find(".sprite[data-state=\"on\"]").first().attr("data-position"));
	if ( series.find(".sprite[data-state=\"on\"]").length < 1 ) nextPosition = 999;
	
	if (  parseInt(testPosition) !== -1 && parseInt(testPosition) < parseInt(nextPosition) ) nextPosition = testPosition;
		console.log(nextPosition + " " + testPosition);
	while ( series.find(".sprite[data-position=\"" + nextPosition + "\"]").length > 0 && nextPosition <= getLastPositionByThisSeriesSprites(series)) {
		if ( series.find(".sprite[data-position=\"" + nextPosition + "-fail\"]").attr("data-type") === "object-fail" ) { 
			fails ++;
		}

		if ( series.find(".sprite[data-position=\"" + nextPosition + "\"]").attr("data-state") === "on" ) { 
			if (LEVEL_GAME > LEVEL_MAX_DANGEROUS_FAILS_GAPS && fails > DANGEROUS_FAILS_GAPS && nextPosition <= parseInt( series.find(".sprite[data-type=\"object\"][data-touch-player]").last().attr("data-position") ) ) {
				return false;
			} else if ( nonAuthorizedGaps.indexOf("[" + step + "]") > -1 ) { 
				return false;
			}
		}
		nextPosition ++;
		step ++;
	}

	return true;
}

function createAuthorizedGaps( series ) { 
	var tab = series.attr("data-test-gaps");
	var nonAuthorizedGaps = "[0]";
	
	series.find(".sprite[data-type=\"object\"]").attr("data-state", "off");
	series.find(".sprite[data-type=\"object\"][data-touch-player]").attr("data-state", "on");
	series.find(".sprite[data-type=\"object\"][data-state=\"on\"]").each( function() { 
		var gap = 0;
		var nextPosition = parseInt( $(this).attr("data-position") ) + 1 ;
		while ( series.find(".sprite[data-type=\"object\"][data-position=\"" + nextPosition + "\"]").length > 0 ) {
			if ( series.find(".sprite[data-type=\"object\"][data-position=\"" + nextPosition + "\"]").attr("data-state") === "on" ) { 
				if ( nonAuthorizedGaps.indexOf("[" + gap + "]") < 0 ) { 
					if (nonAuthorizedGaps !== "") { 
						nonAuthorizedGaps += ",";
					}
					nonAuthorizedGaps += "[" + gap + "]";
				}
			}
			nextPosition ++;
			gap ++;
		}
	});
	eval("NON_AUTHORIZED_" + tab + "_GAPS = nonAuthorizedGaps;");
}