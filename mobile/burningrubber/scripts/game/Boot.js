var States = {

	orientated: false
};

States.Boot = function(game){};
States.Boot.prototype = {
	preload: function(){
		// preload the preloader images, this must be done
		this.load.image('MockupPreLoader', 'assets/UI/PreLoaderBackground.jpg');
		this.load.image('PreloaderBar', 'assets/UI/PreloaderBar.jpg');
		this.load.image('PreloaderBarBackground', 'assets/UI/PreloaderBarBackground.jpg');

		// core text files we usually use...
		// very important! we need these for xManager plugin
		this.load.text('Globals',      'assets/globals.json');
		this.load.text('Data',         'assets/data.json');
		this.load.text('LoadingArray', 'assets/loadingArray.json');
		this.load.text('Localization', 'assets/localization.json');
	},

	create: function(){
		// define xManager & famobi	
		xManager = game.plugins.add(Phaser.Plugin.xManager);
		famobi = window.famobi;

		// LoadData!!!
		xManager.LoadData();

		// We start using Globals (Data & Localization) here. Make sure thos json files are loaded AND the xManager is initialized
		// this sets up the Phaser scaling
		this.input.maxPointers = 1;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		if (Globals.development) this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.scale.setScreenSize(true);	
		// specific mobile params
		if (!this.game.device.desktop)
		{
			this.scale.forceOrientation(false, true);
			this.scale.enterIncorrectOrientation.add(xManager.enterIncorrectOrientation, this);
	        this.scale.leaveIncorrectOrientation.add(xManager.leaveIncorrectOrientation, this);
	    }
        // refresh
        this.scale.refresh();
		// start the Preloader state
		this.state.start('Preloader');
	}
	
	// enterIncorrectOrientation: function () {
 //        States.orientated = false;
 //        document.getElementById('orientation').style.display = 'block';
 //    },

	// leaveIncorrectOrientation: function () {
 //        States.orientated = true;
 //        document.getElementById('orientation').style.display = 'none';
 //    }

};