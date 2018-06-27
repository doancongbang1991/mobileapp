Branding = {};
// Branding.isLocal = (window.location.hostname == "192.168.1.199" || window.location.hostname == "localhost" || window.location.hostname == "funnyhousegames.com"),
Branding.isLocal = false;
Branding.ready = false;

Branding.adsCtr = 0;
Branding.firstAds = true;
Branding.pausedByRotation = false;
Branding.firstInit = false;
Branding.pausing = false;

Branding.updateCounter = function() {
	Branding.adsCtr++;
	// trace("branding.updateCounter", Branding.adsCtr);
}
Branding.adsTimer = setInterval(Branding.updateCounter, 1000);

Branding.canShowAds = function() {
	if (Publisher.firstAds % 1 !== 0) Publisher.firstAds = 120;
	if (Publisher.furtherAds %1 !==0) Publisher.furtherAds = 60;
	if (Branding.firstAds && Branding.adsCtr > Publisher.firstAd) return true;
	else if(!Branding.firstAds && Branding.adsCtr> Publisher.furtherAds) return true;

	return false;
}

Branding.isStock = function() {
	var matches = window.navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);
	return matches && matches[1] < 537;
}
Branding.isSoundNeedDisabled = function() {
	var isStock = Branding.isStock();
	var ua = navigator.userAgent;
	var isSharpMiniStock = ((/SHL24|SH-01F/i).test(ua)) && isStock;
	var isXperiaAStock = ((/SO-04E/i).test(ua)) && isStock;
	var isFujitsuStock = ((/F-01F/i).test(ua)) && isStock; // Checks if device is, Fujitsu(F-01F)
	var isSoundNeedDisabled = isSharpMiniStock || isXperiaAStock || isFujitsuStock;
	return isSoundNeedDisabled;
}


Branding.startInit = function() {
	if (Branding.isLocal) {
		Branding.onLoad();
		return;
	}
	var mode = (RegExp('bm.mode' + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.setAttribute('id', 'booster-api');

    if (mode == "test") {
        script.src = './shared/booster/api.js';
    } else {
        script.src = './shared/booster/api.js';
    }

    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(script, s);

    Branding.onLoad();
}

Branding.onLoad = function() {
	window.Booster = window.Booster || {};
	if (Branding.isLocal) {
		Branding.ready = true;
		return;
	}

	console.log("Branding.onLoad");
    window.Booster.ready = function() {
        new Booster.Init({
            orientation: Publisher.gameOrientation,
            splash: true,
            minimalUI: true
        });

    	adSense = new Booster.Ad({
            type: Publisher.adType,
            size: Publisher.adSize,
            channelID: Publisher.adChannel,
        });

        Branding.adSense = adSense;



        community = new Booster.Community({
            position: 1,
            gameCode: Publisher.gameCode
        });

        Branding.community = community;



        analytics = new Booster.Analytics({
            gameName: Publisher.gameName,
            gameId: Publisher.gameCode,
            gameCategory: Publisher.gameCategory,
            developer: Publisher.developerId
        });

        Branding.analytics = analytics;


        moregames = new Booster.Moregames();
        Branding.moregames = moregames;


        Booster.onSplashFinishedEvent = function() {
            //-- Call the load/start game method
            Branding.ready = true;
        };

        Booster.onOpenTab = function() {
            Branding.pauseHandler();
        };

        Booster.onCloseTab = function() {
            // Call in-game method(s)  that un-pauses the game.
            Branding.unpauseHandler();
        };
    };
}


Branding.analyticsMenu = function() {
	trace("Branding.analyticsMenu");

	if (Branding.analytics)
		Branding.analytics.menu();
}

Branding.submitScore = function(gainedScore, callback) {
	trace("Branding.submitScore", gainedScore, callback);
	if (Branding.community)
		Branding.community.submitScore({
		    score: gainedScore, // This is an int value
		    callback: function () {
		    	if (callback) callback();
		        // Call method(s) in the game that should happen after the high score popup is closed, like showing advertisement.
		    }
		});
}

Branding.highScore = function(scoreValue) {
	trace("Branding.highScore",scoreValue);
	if (Branding.analytics) 
		Branding.analytics.score(scoreValue);
}

Branding.showAd = function() {
	trace("Branding.showAd");
	if (!Publisher.enableAds) return;
	if (!Branding.canShowAds()) return;


	if (Branding.adSense) {
		Branding.adSense.showAdvertising({
			callback: function(){
				Branding.unpauseHandler();
			}
		});
		Branding.firstAds = false;
		Branding.adsCtr = 0;		
	}
}

Branding.startGame = function() {
}

Branding.levelStarted = function(level) {
	trace("Branding.levelStarted", level);
}

Branding.levelFinished = function(level, score) {
	trace("Branding.levelFinished", level, score);
	if (Branding.analytics)
		Branding.analytics.level(level);
}

Branding.levelUp = function (level, score) {
}

Branding.gameOver = function(level, score) {
	trace("Branding.gameOver", level, score);
	if (Branding.analytics)
		Branding.analytics.levelFailed(level);
}

Branding.pauseHandler = function() {
	// trace("Branding.pauseHandler");
	if (game) 
		if (game.paused == false){
			trace("Branding.pauseHandler success");
			Branding.pausing = true;

			game.paused = true;
		}
}
Branding.unpauseHandler = function() {
	// trace("Branding.unpauseHandler");
	if (game)
		if (game.paused == true) {
			var s = curState();
			if (s.gPause)
				if (s.gPause.visible) return;

			trace("Branding.unpauseHandler success");
			Branding.pausing = true;
			game.paused = false;
		}
}

Branding.getLogo = function() {
	// return "assets/1020/branding_logo.jpg";
}

Branding.logoAction = function() {
	// if (game.state.getCurrentState()._sid == "preloader")
		// window.open('http://m.softgames.de', '_blank');
}

Branding.moreGames = function() {
	trace("Branding.moreGames");
	if (Publisher.enableMoreGames == false) return;
	 if (Branding.moregames)
		 Branding.moregames.redirect();
	 else {
		window.open(Publisher.moreGamesURL, '_blank');
	 }
	// document.getElementById("more-games").setAttribute("target", "_blank");
	// document.getElementById("more-games").dispatchEvent((function(e){
	//   e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,
	//                     false, false, false, false, 0, null);
	//   return e
	// }(document.createEvent('MouseEvents'))));


	// // document.getElementById("more-games").click();
	// // window.open('http://m.softgames.de');
}

Branding.getIncentiveButton = function() {
	// if( SG_Hooks.isEnabledIncentiviseButton() ) {
	// 	return "assets/img/branding_incentive.png";
	// }
	// else return null;
}

Branding.incentiveAction = function(callback) {
	// SG_Hooks.triggerIncentivise(callback);
}


Branding.lastCorrect = true;
Branding.isCorrectOrientation = false;
Branding.numOrientationChanges = 0;
Branding.lastOrientation;
Branding.isLandscape =false;
Branding.lastIsLandscape = false;
Branding.startTime = + new Date();
Branding.orientationLabel = "";
Branding.timer;
Branding.isFocus = true;





Branding.onPause = function() {
	trace("onPause", Branding.pausing, game.paused);
	if (!Branding.pausing) return;
	Branding.pausing = false;
	if (game.paused == false) {
		if (curState()){
			curState().onResize();
			curState().update();
		}
	}
	// if (game.paused == true) game.stage.cacheAsBitmap = true;
	// else game.stage.cacheAsBitmap = false;

};

Branding.onBlur = function() {
	trace("onBlur");
	Branding.isFocus = false;
	var s = curState();
	if (s) {
		if (s.name){
			if (s.name == "cgame") {
				s.setPauseOn();
				return;
			}
		}
	}
	// if (cpause.instance) {
		// cpause.instance.onClickEvent()
	// }
};

Branding.onFocus = function() {
	trace("onFocus");
	Branding.isFocus = true;
};
                 		
Branding.readDeviceOrientation = function() {
	if (!Branding.isFocus) return;
	if (Branding.pausing == true) return;
	if (document.hidden || document.mozHidden || document.msHidden || document.webkitHidden) {
		return;
	}

    var orientationLabel,
    	curTime = + new Date() - Branding.startTime;
                 		
    if (Math.abs(window.orientation) === 90) {
        // Landscape
        orientationLabel = "LANDSCAPE " + window.orientation;
        Branding.isLandscape = true;
    	// alert(orientationLabel);
    } else {
    	// Portrait
    	orientationLabel = "PORTRAIT " + window.orientation;
        Branding.isLandscape = false;
    	// alert(orientationLabel);
    }
    Branding.orientationLabel = orientationLabel;


	var isLandscape = (window.innerHeight < window.innerWidth);
    if (Phaser.Device.desktop) {
		Branding.isCorrectOrientation = (global.landscape==false) || (isLandscape == global.landscape);
    }
    else {
	    Branding.isCorrectOrientation = (global.landscape == Branding.isLandscape && isLandscape == global.landscape);
    }

	if (Branding.isCorrectOrientation) {
		Branding.unpauseHandler();
	}
	else {
		Branding.pauseHandler();
	}

	Branding.debugctr+=0.01;
	
    Branding.lastIsLandscape = Branding.isLandscape;
    Branding.lastCorrect = Branding.isCorrectOrientation;
    window.setTimeout(Branding.readDeviceOrientation, 10);
}


Branding.debugctr = 0;
Branding.debug = function() {

	if (window.debug) {
		window.debug.innerHTML=Math.round(Branding.debugctr) + "correct:"+Branding.isCorrectOrientation+ " -- "+Branding.orientationLabel+ " is landscape: " + Branding.isLandscape + "-"+ window.orientation +"  " + window.innerWidth + " - " + window.innerHeight+ " : " + global.deviceWidth + "-"+ global.deviceHeight;
		// if (game)
		// 	window.debug.innerHTML += game.paused;
		window.debug.innerHTML+= " isfocus: " + Branding.isFocus;
		window.debug.innerHTML+= " pausing: " + Branding.pausing;
		window.debug.innerHTML+= " paused: " + game.paused;
	}

    window.setTimeout(Branding.debug, 10);
}
// setInterval(Branding.debug, 1);


Branding.init = function() {
	game.onPause.add(Branding.onPause);
	game.onResume.add(Branding.onPause);
	game.onBlur.add(Branding.onBlur);
	game.onFocus.add(Branding.onFocus);
	Branding.readDeviceOrientation();
	// Branding.debug();
	// Branding.timer = setInterval(Branding.readDeviceOrientation, 1);
	window.onorientationchange = Branding.readDeviceOrientation;
}