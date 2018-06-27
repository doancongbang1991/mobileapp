var DELAY_TIMER_START_SWITCH_PLAYER = 100;
var DELAY_TIMER_END_SWITCH_PLAYER = 250;

var TIMER_SWITCH_PLAYER = null;

function testTouchSprites() { 
	$("#game .sprite[data-type=\"object\"][data-touch-player][data-touched=\"false\"][data-state=\"on\"]").each( function() { 
		if ( parseInt($(this).attr("data-touch-player")) === parseInt(getCurrentPlayerPositionSprites()) ) { 
			$(this).attr("data-touched", "true");
			var currentPosition = parseInt($(this).attr("data-position"));
			playTouchSound();
			if (haveSwitchAvailableByPositionSprites( parseInt(getCurrentPlayerPositionSprites()) )) { 
				TIMER_SWITCH_PLAYER = setTimeout(function() { nextPositionObjectBySprites( currentPosition ); }, DELAY_TIMER_START_SWITCH_PLAYER);
			}
			return true;
		}
	});
	return false;
}

function nextPositionObjectBySprites( position ) { 
	var currentPosition = position;
	var nextPosition = currentPosition + 1;
	
	setStateByPositionSprites("off", currentPosition);
	var saveBeat = getBeatByPositionSprites( currentPosition );
	setBeatByPositionSprites("", currentPosition );
	
	setSwitchByPositionSprites("on", parseInt(getCurrentPlayerPositionSprites()));
	
	setStateByPositionSprites("on", nextPosition);
	setBeatByPositionSprites(saveBeat, nextPosition );
	
	setTouchedByPositionSprites("false", currentPosition);
	
	TIMER_SWITCH_PLAYER = setTimeout(function() { setSwitchByPositionSprites("off", parseInt(getCurrentPlayerPositionSprites())); }, DELAY_TIMER_END_SWITCH_PLAYER);
}

function setTouchedByPositionSprites(touched, position) { 
	var selector = "[data-touched]";
	if ( position ) { 
		selector += "[data-position=\"" + position + "\"]";
	}
	$("#game .sprite" + selector).attr("data-touched", touched);
}

function setBeatByPositionSprites(beat, position) { 
	var selector = "";
	if ( position ) { 
		selector += "[data-position=\"" + position + "\"]";
	}
	$("#game .sprite" + selector).attr("data-beat", beat);
}
function getBeatByPositionSprites(position) { 
	if ( position ) { 
		return 	$("#game .sprite[data-position=\"" + position + "\"]").attr("data-beat");
	}
}

function setStateByPositionSprites(state, position) { 
	var selector = "";
	if ( position ) { 
		selector = "[data-position=\"" + position;
		if ($("#game .sprite" + selector + "-switch-off\"]").length > 0) { 
			$("#game .sprite" + selector + "-switch-off\"]").attr("data-state", state);
		}
		if (state === "off") { 
			$("#game .sprite" + selector + "-switch-on\"]").attr("data-state", state);
		}
		selector += "\"]";
	}
	$("#game .sprite" + selector).attr("data-state", state);
}

function setSwitchByPositionSprites( switchState, position ) { 
	if ( position && $("#game .sprite[data-position=\"" + position + "\"]").attr("data-state") === "on" ) { 
		$("#game .sprite[data-position=\"" + position + "-switch-" + switchState + "\"]").attr("data-state", "on");
		$("#game .sprite[data-position=\"" + position + "-switch-" + getReverseStateTools(switchState) + "\"]").attr("data-state", "off");
	}
}

function haveSwitchAvailableByPositionSprites( position ) { 
	var switchAvailable = false;
	if ( position && $("#game .sprite[data-position^=\"" + position + "-switch-on\"]").length > 0 ) { 
		switchAvailable = true;
	}
	return switchAvailable;
}

function getStartPositionByCurrentAdversaryPositionSprites() { 
	return $("#game .sprite[data-type=\"adversary\"][data-state=\"on\"]").attr("data-start-object");
}

function setStateByTypeSprites(state, type) { 
	var selector = "";
	if ( type ) { 
		selector = "[data-type=\"" + type + "\"]";
	}
	$("#game .sprite" + selector).attr("data-state", state);
}
function setStateByMissSprites(state, miss) { 
	var selector = "";
	if ( miss ) { 
		selector = "[data-miss=\"" + miss + "\"]";
	}
	$("#game .sprite" + selector).attr("data-state", state);
}

function getCurrentPlayerPositionSprites() { 
	return $("#game .sprite[data-type=\"player\"][data-state=\"on\"]").attr("data-position");
}
function getCurrentAdversaryPositionSprites() { 
	return $("#game .sprite[data-type=\"adversary\"][data-state=\"on\"]").attr("data-position");
}

function getLastPositionByTypeSprites(type) { 
	return $("#game .sprite[data-type=\"" + type + "\"]").last().attr("data-position");
}
function getFirstPositionByTypeSprites(type) { 
	return $("#game .sprite[data-type=\"" + type + "\"]").first().attr("data-position");
}

function getFirstPositionByThisSeriesSprites(series) { 
	return (series).find(".sprite").first().attr("data-position");
}
function getLastPositionByThisSeriesSprites(series) { 
	return (series).find(".sprite").last().attr("data-position");
}

function countObjectInSeriesSprites( series ) { 

	var counterObject = 0;
	if ( series.find(".sprite[data-type=\"object\"][data-touch-player]").length > 0 ) { 
		var lastDataTouchPlayer = series.find(".sprite[data-type=\"object\"][data-touch-player]").last().attr("data-position");
		series.find(".sprite[data-type=\"object\"][data-state=\"on\"]").each( function() { 
			if ( parseInt($(this).attr("data-position")) <= parseInt( lastDataTouchPlayer ) ) { 
				counterObject ++;
			}
		});
	} else { 
		counterObject = series.find(".sprite[data-type=\"object\"][data-state=\"on\"]").length;
	}
	return counterObject;
}