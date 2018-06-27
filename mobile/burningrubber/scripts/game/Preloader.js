States.Preloader = function(game){};
States.Preloader.prototype = {
	preload: function(){
		// init visual prealoader
		this.InitPreloader();
		
		// branding updates!
		// load the branding button (this overrides the branding in loading array)
		game.load.image('Branding', window.famobi.__("more_games_image3"));
		Globals.brandingUrl = window.famobi.__("more_games_url");
		// Set correct audio format
		if (!game.device.canPlayAudio('mp3')) Globals.audioFormat = 'ogg';

		// set correct streetdetails
		if (game.world.width == 480) Globals.streetDetail = "Medium";
		if (game.world.width == 400) Globals.streetDetail = "Low";
		if (game.world.width == 320) Globals.streetDetail = "VeryLow";

		// process the loadingArray
		xManager.LoadFiles();		
	},

	update: function(){
		// for better usability wait until the soundeffects are decoded before going to the menu
		if (this.cache.isSoundDecoded('SoundEffects') && this.cache.isSoundDecoded('Music'))
		{
			// destroy the visual preloader
			this.DestroyPreloader();	
			// start the MainMenu state
			this.state.start(Globals.scene);							
		}
	},

	// -----------------------------
	// PRELOADER
	// -----------------------------
	InitPreloader: function(){
		// set background color and preload image
		globalScale = this.world.width/640;
		this.stage.backgroundColor = '#3b3738'; // test
		preloaderBackground = this.add.sprite(0, 0, 'MockupPreLoader');
		preloaderBackground.scale.setTo(1.0*globalScale, 1.0*globalScale);
		
		loaderBarBackground = this.add.sprite(game.world.centerX / 4, game.world.height / 1.3, 'PreloaderBarBackground');
		loaderBarBackground.scale.setTo(1.0*globalScale, 1.0*globalScale);
		preloadBar = this.add.sprite(game.world.centerX / 4, game.world.height / 1.3, 'PreloaderBar');
		this.load.setPreloadSprite(preloadBar, 0);		
		preloadBar.scale.setTo(1.0*globalScale, 1.0*globalScale);
	},

	DestroyPreloader: function(){
		preloaderBackground.destroy();
		loaderBarBackground.destroy();
		preloadBar.destroy();
	}

};