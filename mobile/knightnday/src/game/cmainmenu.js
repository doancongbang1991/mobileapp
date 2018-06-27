cmainmenu = function (game) {

};

cmainmenu.inherit({
	preload: function() {
		BaseState.prototype.preload.call(this);
		Asset.png('bg_cover');
		Asset.png('credits');
		Asset.atlaspng('cover');
	},

	create: function () {
		Data.load();
		BaseState.prototype.create.call(this);
		this.isTween = false;
		clink.show();
		Branding.analyticsMenu();

		this.bg = game.add.sprite(this.gw*0.5, -this.gh*0.05, 'bg_cover');
		this.bg.anchor.setTo(0.5, 0);
		this.gBG.add(this.bg);

		// this.tameng = global.addSprite(this.gw*0.5, this.gh*0.55, 'cover/tameng');
		// this.tameng.anchor.setTo(0.5, 0.5);
		// this.tameng.scale.setTo(0, 0);
		
		this.title = global.addSprite(this.gw*0.5, this.gh*0.45, 'cover/title');
		// this.title = global.addSprite(this.gw*0.5, 0, 'cover/title');
		this.title.anchor.setTo(0.5, 0.5);
		this.title.y -= this.title.height*0.5;

		// this.player = global.addSprite(this.gw*0.35, this.gh*0.9, 'cover/player');
		this.player = global.addSprite(0, this.gh*0.9, 'cover/player');
		this.player.anchor.setTo(0.5, 1);
		this.player.x -= this.player.width*0.5;

		this.tumbuhan = global.addSprite(0, this.gh*0.95, 'cover/tumbuhan');
		this.tumbuhan.anchor.setTo(0.5, 0.5);

		this.btnSound = new csound(game, this.gw*0.85, this.gh*0.1);
		this.btnSound.anchor.setTo(0.5, 0.5);

		// this.btnPlay = global.addButton(this.gw*0.75, this.gh*0.61, 'cover/btn_play', this.onClick, this);
		this.btnPlay = global.addButton(this.gw, this.gh*0.61, 'cover/btn_play', this.onClick, this);
		this.btnPlay.anchor.setTo(0.5, 0.5);
		this.btnPlay.x += this.btnPlay.width*0.5;

		// this.btnMore = global.addButton(this.gw*0.85, this.gh*0.75, 'cover/btn_more', this.onClick, this);
		this.btnMore = global.addButton(this.gw, this.gh*0.75, 'cover/btn_more', this.onClick, this);
		this.btnMore.anchor.setTo(0.5, 0.5);
		this.btnMore.x += this.btnMore.width*0.5;
		this.btnMore.visible = Publisher.enableMoreGames;
		
		// this.btnCredits = global.addButton(this.gw*0.65, this.gh*0.8, 'cover/btn_credits', this.onClick, this);
		this.btnCredits = global.addButton(this.gw, this.gh*0.8, 'cover/btn_credits', this.onClick, this);
		this.btnCredits.anchor.setTo(0.5, 0.5);
		this.btnCredits.x += this.btnCredits.width*0.5;


		// this.gCont.add(this.tameng);
		this.gCont.add(this.title);
		this.gCont.add(this.player);
		this.gCont.add(this.tumbuhan);
		// this.gCont.add(this.enemy);
		this.gCont.add(this.btnSound);
		this.gCont.add(this.btnPlay);
		this.gCont.add(this.btnMore);
		this.gCont.add(this.btnCredits);

		game.add.tween(this.player).to({x: this.gw*0.35}, 500, Phaser.Easing.Sinusoidal.Out, true);
		// game.add.tween(this.enemy).to({x: this.gw*0.75}, 500, Phaser.Easing.Sinusoidal.Out, true, 250);
		// game.add.tween(this.title).to({y: this.gh*0.3}, 1000, Phaser.Easing.Elastic.Out, true, 500);
		// game.add.tween(this.tameng.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out, true, 500);

		var tween = game.add.tween(this.btnPlay).to({x: this.gw*0.75}, 350, Phaser.Easing.Sinusoidal.Out, true, 500);
		game.add.tween(this.btnPlay).to({angle: -360}, 350, Phaser.Easing.Sinusoidal.Out, true, 500);
		tween.onComplete.add(function() {
			game.add.tween(this.btnPlay.scale).to({x: 1.075, y: 1.075}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
		}, this);

		game.add.tween(this.btnCredits).to({x: this.gw*0.65}, 350, Phaser.Easing.Sinusoidal.Out, true, 650);
		game.add.tween(this.btnCredits).to({angle: -360}, 350, Phaser.Easing.Sinusoidal.Out, true, 650);

		game.add.tween(this.btnMore).to({x: this.gw*0.85}, 350, Phaser.Easing.Sinusoidal.Out, true, 800);
		game.add.tween(this.btnMore).to({angle: -360}, 350, Phaser.Easing.Sinusoidal.Out, true, 800);

		this.credits = game.add.sprite(this.gw*0.5, this.gh*0.5, 'credits');
		this.credits.anchor.setTo(0.5, 0.5);
		this.credits.scale.setTo(0.8, 0.8);
		this.gFG.add(this.credits);
		this.credits.visible = false;

		this.black80.inputEnabled = true;
		this.black80.events.onInputUp.add(this.onCreditsClose, this);
		this.onResize();
	},

	onCreditsOpen: function()
	{
		clink.hide();
		this.credits.visible = true;
		this.black80.visible = true;
	},

	onCreditsClose: function()
	{
		csound.click();
		clink.show();
		this.credits.visible = false;
		this.black80.visible = false;
	},

	onClick: function(obj) {
		if(this.isTween)
			return;
		csound.click();

		if(obj == this.btnMore) {
			Branding.moreGames();
			return;
		}

		this.isTween = true;
		obj.scale.setTo(0.9, 0.9);
		var tween = game.add.tween(obj.scale).to({x: 1, y: 1}, 350, Phaser.Easing.Elastic.Out, true);
		tween.onComplete.add(function() {
			if(obj == this.btnPlay) {
				if(DataPlayer.isTutorGame) {
					game.state.start('cgame');
				}
				else {
					game.state.start('cstage');
				}
			}

			if(obj == this.btnCredits) {
				this.onCreditsOpen();
			}


			this.isTween = false;
		}, this);
	},

	shutdown: function() {
		clink.hide();
	},

	update: function () {
		BaseState.prototype.update.call(this);
		this.onResize();
		clink.follow(this.btnMore);
	},

	render: function() {
		document.getElementById("debug").innerHTML = this.btnMore.x + "," + this.btnMore.y;
	},
}, BaseState);
