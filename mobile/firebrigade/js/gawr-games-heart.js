var DELAY_TIMER_HEART_DEFAULT = 750;
var BEAT_HEART_DEFAULT = 1;
var MAXIMUM_BEAT_HEART_DEFAULT = 3;

var BEAT_HEART = BEAT_HEART_DEFAULT;
var TIMER_HEART = null;
var DELAY_TIMER_HEART = DELAY_TIMER_HEART_DEFAULT;
var DELAY_TIMER_LIMIT_HEART = 150;

function startHeart() { 
	if ( TIMER_HEART !== null ) { 
		stopHeart();
	}
	TIMER_HEART = setInterval('heart()', DELAY_TIMER_HEART / MAXIMUM_BEAT_HEART_DEFAULT);
}
function stopHeart() { 
	clearInterval(TIMER_HEART);
	TIMER_HEART = null;
	
	clearInterval(TIMER_SWITCH_PLAYER);
	TIMER_SWITCH_PLAYER = null;
}
function resetHeart() { 
	stopHeart();
	DELAY_TIMER_HEART = DELAY_TIMER_HEART_DEFAULT;
	BEAT_HEART = BEAT_HEART_DEFAULT;
}
function newHeart( delay ) { 
	if (delay) { 
		DELAY_TIMER_HEART = delay;
	}
	stopHeart();
	startHeart();
}

function heart() { 

	if ( BEAT_HEART === 3 ) { 
	
		var desiredAdversaryPosition = parseInt( getCurrentAdversaryPositionSprites() );
		var which = getRandomNumberTools(3);
		
		if (which === 1 && desiredAdversaryPosition > getFirstPositionByTypeSprites("adversary") ) { 
			desiredAdversaryPosition --;
		} else if (which === 2 && desiredAdversaryPosition < getLastPositionByTypeSprites("adversary")) { 
			desiredAdversaryPosition ++;
		}
		
		if ( $("#game .sprite[data-type=\"adversary\"][data-position=\"" + desiredAdversaryPosition + "\"]").length > 0 ) { 
			setStateByPositionSprites("off", getCurrentAdversaryPositionSprites());
			setStateByPositionSprites("on", desiredAdversaryPosition);
		}

		$( "#game .series[data-source]" ).each( function() { 
			var beat = getRandomNumberTools( 2 );
			if ($(this).attr("data-source") === "adversary") { 
				if ( oneObjectAvailableScoring( $(this) ) ) { 
					setSwitchByPositionSprites( "on", getCurrentAdversaryPositionSprites());
					setStateByPositionSprites("on", getStartPositionByCurrentAdversaryPositionSprites() );
					setBeatByPositionSprites(beat, getStartPositionByCurrentAdversaryPositionSprites() );
				}
			} if ($(this).attr("data-source") === "self") { 
				if ( oneObjectAvailableScoring( $(this) ) ) { 
					setStateByPositionSprites("on", getFirstPositionByThisSeriesSprites( $(this) ) );
					setBeatByPositionSprites(beat, getFirstPositionByThisSeriesSprites( $(this) ) );
				}
			}
		});
		
		BEAT_HEART = 1;
	} else if ( BEAT_HEART === 2 || BEAT_HEART === 1 ) { 
		playHeartSound();
		
		setSwitchByPositionSprites( "off", getCurrentAdversaryPositionSprites());
		
		$( "#game .series" ).each( function() { 
		
			$($(this).find(".sprite[data-type=\"object\"][data-state=\"on\"]").get().reverse()).each( function() { 
			
				var beat = parseInt( $(this).attr("data-beat") );
				if ( (beat && BEAT_HEART === beat) || ( !beat && BEAT_HEART === 1) ) { 
					var currentPosition = $(this).attr("data-position");
					var testTouched = $(this).attr("data-touched");
					var testTouchPlayer = $(this).attr("data-touch-player");
					var deviation = $(this).attr("data-deviation");
					
					var fail = false;
					var nextPosition = "";
					
					if ( testTouched && $(this).attr("data-touched") !== "true" ) { 
						nextPosition = $(this).attr("data-position") + "-fail";
						fail = true;
					} else if ( deviation ) { 
						nextPosition = parseInt( deviation );
					} else { 
						nextPosition = parseInt( currentPosition ) + 1;
					}
					setStateByPositionSprites("off", currentPosition);
					var saveBeat = getBeatByPositionSprites( currentPosition );
					setBeatByPositionSprites("", currentPosition );
					
					if ( fail || $("#game .sprite[data-position=\"" + nextPosition + "\"]").length > 0 ) { 
						setStateByPositionSprites("on", nextPosition);
						setBeatByPositionSprites(saveBeat, nextPosition );
						if ( fail ) { 
							addOneMiss();
						} else if ( testTouched && $(this).attr("data-touched") === "true" ) { 
							setTouchedByPositionSprites("false", currentPosition);
						}
					}

					if ( $(this).closest(".series").attr("data-scoring") === "on" && nextPosition === ( parseInt(getLastPositionByThisSeriesSprites($(this).closest(".series"))) + 1 ) ) { 
						addScoring(1);
					}
				}
			});
		});
		testTouchSprites();
	
		if ( BEAT_HEART === 2) { 
			BEAT_HEART = 3;
		} else { 
			BEAT_HEART = 2;
		}
	}
}