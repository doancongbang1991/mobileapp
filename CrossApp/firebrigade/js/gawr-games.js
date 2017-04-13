var SELECT_GAME_DEFAULT = "a";
var LEVEL_GAME_DEFAULT = 0;
var SCORE_GAME_DEFAULT = 0;
var MISS_GAME_DEFAULT = 0;

var SELECT_GAME = SELECT_GAME_DEFAULT;
var LEVEL_GAME = LEVEL_GAME_DEFAULT;
var SCORE_GAME = SCORE_GAME_DEFAULT;
var MISS_GAME = MISS_GAME_DEFAULT;

var PAUSE_GAME = false;
var LOCK_GAME = true;

var START_POSITION_PLAYER = -1;
var START_POSITION_ADVERSARY = -1;

var APPLICATION_HANDLE_CLICK = null;

$(document).ready(function(e) { 
	initGame();
	resetGame();
	//newGame( SELECT_GAME_DEFAULT );
});

function newGame( select ) { 

	defaultValuesGame();
	
	setStateByPositionSprites("off");
	selectScene("foreground", "1");	
	setStateByPositionSprites("on", START_POSITION_PLAYER );
	setStateByPositionSprites("on", START_POSITION_ADVERSARY );
	setStateByTypeSprites("on", "decoration" );
	setScoring(SCORE_GAME_DEFAULT);
	setMiss(MISS_GAME_DEFAULT);

	PAUSE_GAME = false;
	LOCK_GAME = false;

	resetHeart();
	
	if ( select ) { 
		selectGame( select );
	}
	
	startHeart();
}

function resetGame() { 
	stopGame();
	stopBlinkMiss();

	defaultValuesGame();
	
	resetHeart();

	setStateByPositionSprites("on");
	setTouchedByPositionSprites("false");
	selectScene("foreground");
	selectGame();
	resetScoring();
	setMiss();
	
	PAUSE_GAME = false;
	LOCK_GAME = true;
}

function pauseGame() { 
	if ( !PAUSE_GAME ) { 
		PAUSE_GAME = true;
		stopHeart();
	} else { 
		PAUSE_GAME = false;
		startHeart();
	}
}

function endGame() { 
	playGameoverSound();
}

function stopGame() { 
    LOCK_GAME = true;
	stopHeart();
}

function startGame() { 
    LOCK_GAME = false;
	startHeart();
}

function defaultValuesGame() { 
	SELECT_GAME = SELECT_GAME_DEFAULT; 
	LEVEL_GAME = LEVEL_GAME_DEFAULT; 
	SCORE_GAME = SCORE_GAME_DEFAULT;
	MISS_GAME = MISS_GAME_DEFAULT;
}

function cleanGame() { 
	setStateByTypeSprites("off", "object");
	setStateByTypeSprites("off", "object-fail");
	setStateByPositionSprites("off", getCurrentPlayerPositionSprites());
	setStateByPositionSprites("on", START_POSITION_PLAYER );
}

function retryGame() { 
	cleanGame();
	startGame();
}

function initGame() { 
	
	APPLICATION_HANDLE_CLICK = 'ontouchstart' in document.documentElement ? 'touchstart': 'click';
	
	START_POSITION_PLAYER = getFirstPositionByTypeSprites("player");
	START_POSITION_ADVERSARY = getFirstPositionByTypeSprites("adversary");
	
	$( "#game .series[data-test-gaps]" ).each( function() { 
		createAuthorizedGaps( $(this) );
	});
	
	setControls();
}

function selectGame(select) { 

	loadAllSound();

	var gameA = "on";
	var gameB = "on";
	
	if (select) { 
		SELECT_GAME = select;
		if (select === "a") { 
			gameB = "off";
		} else if (select === "b") { 
			gameA = "off";
			LEVEL_GAME ++;
			DELAY_TIMER_HEART = DELAY_TIMER_HEART - DELAY_NEXT_SCORING
		}
	}
	$("#game .game-a").attr("data-state", gameA);
	$("#game .game-b").attr("data-state", gameB);
}

