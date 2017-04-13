
Startup = function()
{
	
	// tutorials..
	// stress test!
	this.loaderLoader = new PIXI.AssetLoader([REMOTE_PATH + "img/UI/loaderCrumbScale.png",
											  REMOTE_PATH + "img/UI/loaderPanel.png",
											  REMOTE_PATH + "img/UI/intro_BG.jpg",
											  REMOTE_PATH + "img/loadingText.png"
											  ], true)
	
	this.loaderLoader.onComplete = this.onLoaderLoaded.bind(this);
	
	if(APP.profile.mobile)
	{
	
	this.loader = new PIXI.AssetLoader([REMOTE_PATH + "img/pickups/magnet/magnetTexture.json",
										REMOTE_PATH + "img/UI/uiSpriteSheet.json",
										REMOTE_PATH + "img/player/ballSpriteSheet.json",
										REMOTE_PATH + "img/tutorial/tutorial.json",
										REMOTE_PATH + "img/pickups/pickups.json",
									
										REMOTE_PATH + "img/UI/HOME_mobile_panelBG.png",
										REMOTE_PATH + "img/UI/intro_heroPack.png",
										REMOTE_PATH + "img/UI/HOME_desktop_logo.png",
										REMOTE_PATH + "img/UI/HOME_mobile_play.png",
										REMOTE_PATH + "img/UI/HOME_mobile_more.png",
										REMOTE_PATH + "img/UI/HOME_mobile_leaderboard.png"
										], true);
	}
	else
	{
		
	
	this.loader = new PIXI.AssetLoader([REMOTE_PATH + "img/pickups/magnet/magnetTexture.json",
										REMOTE_PATH + "img/UI/uiSpriteSheet.json",
										REMOTE_PATH + "img/tutorial/tutorial.json",
										REMOTE_PATH + "img/player/ballSpriteSheet.json",
										REMOTE_PATH + "img/pickups/pickups.json",
										REMOTE_PATH + "img/UI/intro_vidPanel_base.png",
										REMOTE_PATH + "img/UI/intro_heroPack.png",
										REMOTE_PATH + "img/UI/HOME_desktop_logo.png",
										REMOTE_PATH + "img/UI/intro_vidPanel_TEMP.png",
										REMOTE_PATH + "img/UI/HOME_desktop_play.png",
										REMOTE_PATH + "img/UI/HOME_desktop_more.png",
										REMOTE_PATH + "img/UI/HOME_desktop_leaderboard.png"
										], true);
										
	}
	
		
	APP.loader = this.loader;
	APP.loader.loadCount = APP.loader.assetURLs.length;
	APP.loadingScreen = new LoadingScreen();
	
	
	this.loader.addEventListener( 'onComplete', function ( event ) 
	{
		
		
		APP.highscoreScreen = new HighscoreScreen();
	
		APP.gameoverScreen = new GameoverScreen();
		APP.leaderboardScreen = new LeaderboardScreen();
	
//		simpleApp.gotoScreen(titleScreen);

		//gameScreen = new GAME.Game();
		
		if(APP.profile.mobile)
		{
			APP.titleScreen = new MobileTitleScreen();
		}
		else
		{
			APP.titleScreen = new TitleScreen();
		}
		
		
		APP.gameScreen = new GameScreen();
		
		transition = new TransitionAnimation();
		APP.stage.addChildAt(transition, 1);
		//APP.simpleApp.gotoScreen(APP.gameScreen);
		APP.simpleApp.gotoScreen(APP.titleScreen);
		
		
		if(!!('ondevicemotion' in window))
		{
			APP.tiltAvailable = true;
		//	alert("TILT")
		}
		
		if(!!('ontouchstart' in window))
		{
			APP.touchAvailable = true;
		}
		
		if(APP.tiltAvailable && APP.touchAvailable)
		{
			// need a menu!
			APP.controlOverlay = new ControlSelectOverlay();
			APP.stage.addChild(APP.controlOverlay);
			APP.controlOverlay.visible = false;
		}
	
		
		
		
		APP.resize(APP.w,APP.h);
		
	} );
}

Startup.constructor = Startup;

Startup.prototype.run = function()
{
	
	this.loaderLoader.load();
	
	/*try
	{
		FacebookAPI.checkLoggedIn(this.onLoginCheckComplete.bind(this))
	}
	catch(e)
	{
		
	}*/

	
      
	
}

Startup.prototype.onLoaderLoaded = function()
{
	APP.simpleApp.gotoScreen(APP.loadingScreen);
	
	APP.background = PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/intro_BG.jpg", true);
		APP.background.anchor.x = APP.background.anchor.y = 0.5;
		APP.stage.addChildAt(APP.background, 0);
		
	APP.background.alpha = 0;
	TweenLite.to(APP.background, 0.3, {alpha:1, ease:Sine.easeOut});
	APP.resize(APP.w,APP.h);
	
	
	//font-family: 'Pathway Gothic One', sans-serif;
	WebFontConfig = {
	  google: {
	    families: [ 'Pathway+Gothic+One::latin' ]
	  },

	  active: function() {
	    // do something
	    World.processAll(function(){
	    	
		    this.loader.load();
		    
	    }.bind(this));
	    
	  }.bind(this)

	};
	(function() {
        var wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
            '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
      })();
}

Startup.prototype.onLoginCheckComplete = function()
{
//	console.log("!!!")
	
}
