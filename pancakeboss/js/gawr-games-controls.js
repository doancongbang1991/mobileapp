function setControls() { 
	$(".control.left").bind(APPLICATION_HANDLE_CLICK, function(e) { 
		e.stopPropagation();
		simulateKeyDownControls(37);
	});
	$(".control.right").bind(APPLICATION_HANDLE_CLICK, function(e) { 
		e.stopPropagation();
		simulateKeyDownControls(39);
	});
	$(".control.a").bind(APPLICATION_HANDLE_CLICK, function(e) { 
		e.stopPropagation();
		simulateKeyDownControls(65);
	});
	$(".control.b").bind(APPLICATION_HANDLE_CLICK, function(e) { 
		e.stopPropagation();
		simulateKeyDownControls(66);
	});
	$(".control.reset").bind(APPLICATION_HANDLE_CLICK, function(e) { 
		e.stopPropagation();
		simulateKeyDownControls(82);
	});
	$(".control.sound").bind(APPLICATION_HANDLE_CLICK, function(e) { 
		e.stopPropagation();
		simulateKeyDownControls(81);
	});
	
	$("html").keydown( function(e) { 
		//e.preventDefault();
		e.stopPropagation();

		if ( e.which === 37 || e.which === 39 ) { 
			if ( !PAUSE_GAME && !LOCK_GAME ) { 
				var desiredPlayerPosition = parseInt( getCurrentPlayerPositionSprites() );
				
				if (e.which === 37) { 
					desiredPlayerPosition --;
				} else if (e.which === 39) { 
					desiredPlayerPosition ++;
				}
				
				if ( $("#game .sprite[data-type=\"player\"][data-position=\"" + desiredPlayerPosition + "\"]").length > 0 ) { 
					setStateByPositionSprites("off", getCurrentPlayerPositionSprites());
					setStateByPositionSprites("on", desiredPlayerPosition);
					testTouchSprites();
					playStepSound();
				}
			}
		} else if ( e.which === 80 && !LOCK_GAME) { 
			pauseGame();
		} else if ( e.which === 82 ) { 
			resetGame();
		} else if ( e.which === 65 ) { 
			resetGame();
			setTimeout( 'newGame( "a" )', 750 );
		} else if ( e.which === 66 ) { 
			resetGame();
			setTimeout( 'newGame( "b" )', 750 );
		}
		else if ( e.which === 81 ) { 
			if ($(".control.sound").text()=="SOUND")
				$(".control.sound").text("MUTE");
			else $(".control.sound").text("SOUND");
		}
	});	
}

function simulateKeyDownControls( which ) { 
	var e = jQuery.Event("keydown");
	e.which = which;
	$("html").trigger(e);
}