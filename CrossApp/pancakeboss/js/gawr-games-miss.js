var TIMER_BLINK = null;
var DELAY_TIMER_BLINK = 175;
var START_TIMER_BLINK = 90;

var COUNTER_TIMER_BLINK = 0;
var COUNTER_TIMER_LIMIT_BLINK = 6;
var CALLBACK_TIMER_BLINK = null;

var PAUSE_BLINK = false;

function addOneMiss() { 
	playMissSound();

	var gameover = setMiss( MISS_GAME + 1 );
	var callback = "retryGame()";
	
	if ( gameover ) { 
		callback = "endGame()";
	}
	
	TIMER_BLINK = setTimeout( function() { startBlinkMiss( callback ) }, START_TIMER_BLINK) ;
}

function setMiss( miss ) { 

	stopGame();

	var miss1 = "on";
	var miss2 = "on";
	var miss3 = "on";
	var missAll = "on";
	
	var gameover = false;
	
	if (miss > -1) { 
		MISS_GAME = miss;
		if (miss === 0) { 
			missAll = "off";
			miss1 = "off";
			miss2 = "off";
			miss3 = "off";
		} else if (miss === 1) { 
			miss2 = "off";
			miss3 = "off";
		} else if (miss === 2) { 
			miss3 = "off";
		} else if (miss === 3) { 
			gameover = true;
		}
	}
	setStateByMissSprites(miss1, "1");
	setStateByMissSprites(miss2, "2");
	setStateByMissSprites(miss3, "3");
	$("#game .miss").attr("data-state", missAll);
	
	return gameover;
}

function startBlinkMiss( callback ) { 
	if ( TIMER_BLINK !== null ) { 
		stopBlinkMiss();
	}
	COUNTER_TIMER_BLINK = 0;
	TIMER_BLINK = setInterval( 'blinkMiss()',  DELAY_TIMER_BLINK);
	CALLBACK_TIMER_BLINK = callback;
}

function stopBlinkMiss() { 
	clearInterval(TIMER_BLINK);
	TIMER_BLINK = null;
	COUNTER_TIMER_BLINK = 0;
}

function blinkMiss() { 
	if (COUNTER_TIMER_BLINK >= COUNTER_TIMER_LIMIT_BLINK) { 
		stopBlinkMiss();
		if (CALLBACK_TIMER_BLINK !== null && CALLBACK_TIMER_BLINK !== "") { 
			eval(CALLBACK_TIMER_BLINK);
		}
		CALLBACK_TIMER_BLINK = null;
	} else { 
		var state = $("#game .sprite[data-miss=\"" + MISS_GAME + "\"]").attr("data-state");
		if (state === "on") { 
			state = "off";
		} else { 
			state = "on";
		}
		$("#game .sprite[data-miss=\"" + MISS_GAME + "\"]").attr("data-state", state);
		COUNTER_TIMER_BLINK ++;
	}
}