var LEVEL_NEXT_SCORING = 10;
var DELAY_NEXT_SCORING = 75;

function addScoring(score) { 

	var scoreBefore = (SCORE_GAME / LEVEL_NEXT_SCORING) | 0;
	
	SCORE_GAME += score;
	setScoring( SCORE_GAME );

	var scoreAfter = (SCORE_GAME / LEVEL_NEXT_SCORING) | 0;
	if (scoreAfter > scoreBefore) { 
		LEVEL_GAME ++;
		switchScene("foreground");
		if (DELAY_TIMER_HEART > DELAY_TIMER_LIMIT_HEART) { 
			var newTimer = DELAY_TIMER_HEART - DELAY_NEXT_SCORING;
			if (SELECT_GAME === "b") { 
				newTimer = newTimer - (DELAY_NEXT_SCORING / 2);
			}
			newHeart( newTimer );
		}
	}
}

function resetScoring() { 
	setScoring("8888");
	$("#game .score .sprite[data-position=\"300\"]").attr("data-state", "on");
}

function setScoring(score) { 
	$("#game .score .sprite").attr("data-state", "off");
	
	var scoreFormat = (score) + "";
	if ( scoreFormat.length === 1 ) { 
		setDigitScoring("1", scoreFormat);
	} else if ( scoreFormat.length === 2 ) { 
		setDigitScoring("2", scoreFormat.substr(0, 1));
		setDigitScoring("1", scoreFormat.substr(1));
	} else if ( scoreFormat.length === 3 ) { 
		setDigitScoring("3", scoreFormat.substr(0, 1));
		setDigitScoring("2", scoreFormat.substr(1, 1));
		setDigitScoring("1", scoreFormat.substr(2));
	} else if ( scoreFormat.length === 4 ) { 
		setDigitScoring("4", scoreFormat.substr(0, 1));
		setDigitScoring("3", scoreFormat.substr(1, 1));
		setDigitScoring("2", scoreFormat.substr(2, 1));
		setDigitScoring("1", scoreFormat.substr(3));
	}
}

function setDigitScoring(position, number) { 
	if (number === "0") { 
		$("#game .score .sprite[data-position=\"" + position + "01\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "03\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "04\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "05\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "06\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "07\"]").attr("data-state", "on");
	} else if (number === "1") { 
		$("#game .score .sprite[data-position=\"" + position + "04\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "06\"]").attr("data-state", "on");
	} else if (number === "2") { 
		$("#game .score .sprite[data-position=\"" + position + "01\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "02\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "03\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "04\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "07\"]").attr("data-state", "on");
	} else if (number === "3") { 
		$("#game .score .sprite[data-position=\"" + position + "01\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "02\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "03\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "04\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "06\"]").attr("data-state", "on");
	} else if (number === "4") { 
		$("#game .score .sprite[data-position=\"" + position + "02\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "04\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "05\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "06\"]").attr("data-state", "on");
	} else if (number === "5") { 
		$("#game .score .sprite[data-position=\"" + position + "01\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "02\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "03\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "05\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "06\"]").attr("data-state", "on");
	} else if (number === "6") { 
		$("#game .score .sprite[data-position=\"" + position + "01\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "02\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "03\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "05\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "06\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "07\"]").attr("data-state", "on");
	} else if (number === "7") { 
		$("#game .score .sprite[data-position=\"" + position + "01\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "04\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "06\"]").attr("data-state", "on");
	} else if (number === "8") { 
		$("#game .score .sprite[data-position=\"" + position + "01\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "02\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "03\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "04\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "05\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "06\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "07\"]").attr("data-state", "on");
	} else if (number === "9") { 
		$("#game .score .sprite[data-position=\"" + position + "01\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "02\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "03\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "04\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "05\"]").attr("data-state", "on");
		$("#game .score .sprite[data-position=\"" + position + "06\"]").attr("data-state", "on");
	}
}


function oneObjectAvailableScoring( series ) { 

	var ok = false;
	var maxObject = 999;
	var counterObject = countObjectInSeriesSprites( series );
	var generator = parseInt( (series).attr("data-generator") );
	var source = series.attr("data-source");
	var startPositionTestGaps = -1;

	if ( source === "adversary") { 
	
		startPositionTestGaps = parseInt( getStartPositionByCurrentAdversaryPositionSprites() );
	
		if ( haveSwitchAvailableByPositionSprites(getCurrentAdversaryPositionSprites()) ) { 
			if (SCORE_GAME < 1) { 
				maxObject = 1;
				ok = true;
			} else { 
					 if ( SCORE_GAME >= 1                       && SCORE_GAME <= (LEVEL_NEXT_SCORING) ) maxObject = 2;
				else if ( SCORE_GAME > (LEVEL_NEXT_SCORING    ) && SCORE_GAME <= (LEVEL_NEXT_SCORING * 2) ) maxObject = 3;
				else if ( SCORE_GAME > (LEVEL_NEXT_SCORING * 2) && SCORE_GAME <= (LEVEL_NEXT_SCORING * 4) ) maxObject = 4;
				else if ( SCORE_GAME > (LEVEL_NEXT_SCORING * 4) && SCORE_GAME <= (LEVEL_NEXT_SCORING * 6) ) maxObject = 5;
				
				var generator = parseInt( (series).attr("data-generator") );
				if (counterObject < 1) generator = 2;
				var random = getRandomNumberTools( generator );
				if ( random === 1 ) ok = true;
				
				if (SELECT_GAME === "b") { 
					generator --;
					maxObject ++;
				}
			}
		}
	} else if ( source === "self") { 
		
		maxObject = 3;
		var random = getRandomNumberTools( generator );
		if ( random === 1 ) ok = true;
		startPositionTestGaps = parseInt( getFirstPositionByThisSeriesSprites(series) );
	}
	
	return (ok && testGaps( series, startPositionTestGaps ) && counterObject < maxObject);
}