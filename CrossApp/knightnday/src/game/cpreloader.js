BasicGame.Preloader = function (game) {
	this.background = null;
	this.preloadBar = null;
	this.ready = false;
};



BasicGame.Preloader.prototype = {

	preload: function () {
		Asset.png('bg_loading');
		Asset.atlaspng('global');
		game.load.onFileComplete.add(this.fileComplete, this);
	},

	fileComplete: function(progress, cacheKey, success, totalLoaded, totalFiles) {
		trace("CPRELOADER FILE COMPLETE");
	    //this.text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
	    if (this.loading_hati == null){
	        this.loading_hati = game.add.sprite(0,0,'loading_bar'); 
	        this.loading_hati.x = BasicGame.viewWidth/2-this.loading_hati.width/2;       
	        this.loading_hati.y = BasicGame.viewY + BasicGame.viewHeight/2;

	        this.text_wait = game.add.text( this.loading_hati.x+this.loading_hati.width/2,this.loading_hati.y-25, "loading..", {
	            font:"31px Times New Roman", fill:"#FFFFFF",fontWeight:"bold", align:"center"});  
	        this.text_wait.anchor.set(0.5);

	        this.text_loading = game.add.text( this.loading_hati.x+this.loading_hati.width/2,this.loading_hati.y+this.loading_hati.height+25, progress+"%", {
	            font:"31px Times New Roman", fill:"#FFFFFF",fontWeight:"bold", align:"center"});  
	        this.text_loading.anchor.set(0.5);

	        this.loading_hati.temp_width = this.loading_hati.width;
	        this.loading_hati.width = 0;
	    }

	    this.loading_hati.width = this.loading_hati.temp_width * (progress/100)
	    this.text_loading.setText(progress+"%")
	    if (progress == 100){
	    	this.text_loading.destroy();
	    	this.text_wait.destroy();
	    	this.loading_hati.destroy();
	    	this.loading_hati = null;
			game.load.onFileComplete.remove(this.fileComplete, this);
	    }
	},

	create: function () {
		// trace("CREATE CPRELOADER");
		this.ready = true;
		clink.create();
	},

	update: function () {
		if (global.webFontReady && this.ready == true && Branding.ready == true)
		{
			this.ready = false;
			this.state.start('cmainmenu');
			// this.state.start('cstage');
			// this.state.start('cgame');
			// this.state.start('cupgrade');
		}
	}

};
