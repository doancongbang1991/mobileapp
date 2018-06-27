BaseState = function(game)	{
}

BaseState.prototype = {
	ctr:0,
	isActive: true,
	init: function() {
		this.gw = BasicGame.gameWidth;
		this.gh = BasicGame.gameHeight;
		this.centerX = this.gw*0.5;
		this.centerY = this.gh*0.5;
		this.nm = "BaseState";
	},
	preload: function () {
		if (this.bg_loader) {
			this.bg_loader.destroy();
			this.bg_loader = null;
		}

		Asset.png('bg_loading');
		Asset.png('bg_trans');
		Asset.atlaspng('global');
		Asset.atlaspng('achievement');
		game.load.onFileComplete.add(this.fileComplete, this);

		this.firstCall = true;
	},

	fileComplete: function(progress, cacheKey, success, totalLoaded, totalFiles) {
		// trace("FILE COMPLETE:",progress,cacheKey,success,totalLoaded,totalFiles, this.bg_loader);
	    if (this.firstCall){
			this.firstCall = false;

	    	// trace("masuk bg loader create");
	    	this.gw = BasicGame.gameWidth;
			this.gh = BasicGame.gameHeight;
			this.centerX = this.gw*0.5;
			this.centerY = this.gh*0.5;
	    	
	    	this.bg_loader = game.add.sprite(0,0,"bg_loading");
	    	this.bg_loader.stretch(game.world.width, game.world.height);

	    	this.gPreloader = game.add.group();

	    	this.loading_icon = global.addSprite(this.centerX, this.centerY, "global/loading_icon");
	    	this.loading_icon.anchor.setTo(0.5,1);

	    	this.loading_anim = global.addSprite(this.gw*0.5, this.gh*0.7, 'global/loading_progress');
	    	this.loading_anim.scale.setTo(2.3, 2.3);
	    	this.loading_anim.anchor.setTo(0.5, 0.5);

	    	this.gPreloader.add(this.loading_icon);
	    	this.gPreloader.add(this.loading_anim);

	        this.loading_text = game.add.text(this.loading_anim.x, this.loading_anim.y, progress+"%", {
				font:"30px Times New Roman", fill:"#000000",fontWeight:"bold", align:"center"});
			this.loading_text.anchor.set(0.5, 0.5);
			this.gPreloader.add(this.loading_text);

	    }

	    this.loading_text.setText(progress+"%")
	    if (progress == 100){
	    	// trace("FILE COMPLETE LOADING");
	    	this.loading_text.destroy();
	    	this.loading_icon.destroy();
	    	this.bg_loader.destroy();
	    	this.gPreloader.destroy();
			game.load.onFileComplete.remove(this.fileComplete, this);
	    }
	},

	create: function() {
		this.gBG = game.add.group();
		this.gCont = game.add.group();
		this.black80 = game.add.sprite(0, 0,"bg_trans");
		this.black80.inputEnabled = true;
		this.black80.visible = false;
		this.gFG = game.add.group();
		this.g0 = game.add.group();
		this.gPol = game.add.group();

		this.isNotifAch = false;
		this.arAch = [];

		this.gAchievement = game.add.group();
		this.gFG.add(this.gAchievement);

		this.pnlAch = null;
		this.iconAch = null;
		this.txtAchUnlock = null;
		this.txtAchDesc = null;
	},

	loadUpdate: function() {
		this.loading_anim.angle += 5;
	},
	update: function() {
		this.loading_anim.angle += 5;
	},
	shutdown: function() {

	},
	onResize: function() {
		global.init();
		var isLandscape = (global.viewHeight < global.viewWidth);
		if  (isLandscape != global.landscape) {
			// incorrect orientation
			// document.getElementById('orientation').style.display = 'block';
			Branding.pauseHandler();
		}
		else {
			// correct orientation
			Branding.unpauseHandler();
			document.getElementById('orientation').style.display = 'none';
		}

		if (this.gPreloader){
			this.gPreloader.fitToCenter(BasicGame.gameWidth, BasicGame.gameHeight, global.viewWidth, global.viewHeight);
		}
		if (this.gCont){
			this.gCont.fitToCenter(BasicGame.gameWidth, BasicGame.gameHeight, global.viewWidth, global.viewHeight);
			// trace("SCALE GCONT",this.gCont.scale.x, this.gCont.scale.y);
		}
		if (this.bg){
			if (this.bg.isStretch)
				this.bg.stretch(this.world.width, this.world.height);
		}
		if (this.gFG){
			this.gFG.fitToCenter(BasicGame.gameWidth, BasicGame.gameHeight, global.viewWidth, global.viewHeight);
		}
		if (this.g0){
			this.g0.fitToCenter(BasicGame.gameWidth, BasicGame.gameHeight, global.viewWidth, global.viewHeight);
		}
		if (this.black80) {
			this.black80.stretch(this.world.width*1.1, this.world.height*1.1);
			this.black80.x = this.world.width*-0.05;
			this.black80.y = this.world.height*-0.05;
		}
	},

	setPivot: function(group, ref)
	{
		group.pivot.setTo(ref.x, ref.y);
		group.x = ref.x;
		group.y = ref.y;
	},

	genAchievement: function(idx)
	{
		this.arAch.push(idx);
		if(!this.isNotifAch) {
			this.genNotifAchievement();
		}
	},

	genNotifAchievement: function()
	{
		if(this.arAch.length <= 0) {
			this.isNotifAch = false;
			this.gAchievement.visible = false;
			return;
		}

		csound.achievement();
		this.isNotifAch = true;
		this.gAchievement.visible = true;

		if(this.pnlAch == null) {
			this.pnlAch = global.addSprite(this.gw*0.5, 0, 'achievement/pnl_unlock');
			this.pnlAch.anchor.setTo(0.5, 0.5);
			this.pnlAch.scale.setTo(0.7, 0.7);
			this.gAchievement.add(this.pnlAch);

			this.pnlAch.y -= this.pnlAch.height;
			this.setPivot(this.gAchievement, this.pnlAch);
		}

		if(this.iconAch == null) {
			this.iconAch = global.addSprite(this.pnlAch.x - this.pnlAch.width*0.3, this.pnlAch.y + 3, 'achievement/'+this.arAch[0]+'_on');
			this.iconAch.scale.setTo(0.7, 0.7);
			this.iconAch.anchor.setTo(0.5, 0.5);
			this.gAchievement.add(this.iconAch);
		}
		else {
			this.iconAch.frameName = 'achievement/'+this.arAch[0]+'_on';
		}

		if(this.txtAchUnlock == null) {
			var str = global._t('ach_unlock');
			var _x = this.pnlAch.x;
			var _y = this.pnlAch.y - this.pnlAch.height*0.5;
			this.txtAchUnlock = global.setText1(str, _x, _y, 32, 0.5, 0.5, '#FFFF00');
			this.txtAchUnlock.stroke = '#000000';
			this.txtAchUnlock.strokeThickness = 3;
			this.gAchievement.add(this.txtAchUnlock);
		}

		var txt = global._t('ach_desc_'+this.arAch[0]);
		if(this.txtAchDesc == null) {
			var _x = this.iconAch.x + this.iconAch.width*0.6;
			var _y = this.iconAch.y;
			this.txtAchDesc = global.setText1(txt, _x, _y, 24, 0, 0.5, '#ffffff');
			this.txtAchDesc.stroke = '#000000';
			this.txtAchDesc.strokeThickness = 3;
			this.txtAchDesc.lineSpacing = -10;
			this.txtAchDesc.wordWrap = true;
			this.txtAchDesc.wordWrapWidth = this.pnlAch.width*0.5;
			this.gAchievement.add(this.txtAchDesc);
		}
		else {
			this.txtAchDesc.setText(txt);
		}

		var tween1 = game.add.tween(this.gAchievement).to({y: this.gh*0.1}, 750, Phaser.Easing.Elastic.Out, true);
		tween1.onComplete.add(function() {
			// csound.achievement();
			var tween2 = game.add.tween(this.gAchievement).to({y: -this.pnlAch.height}, 500, Phaser.Easing.Elastic.In, true, 1000);
			tween2.onComplete.add(function() {
				this.arAch.splice(0, 1);
				game.time.events.add(Phaser.Timer.SECOND*0.25, function() {
					this.genNotifAchievement();
				}, this);
			}, this);
		}, this);
	},
};