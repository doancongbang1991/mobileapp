Result = function(game, gw, gh, container, status)
{
	this.gw = gw;
	this.gh = gh;
	this.container = container;
	this.status = status;

	this.isTween = false;
	if(status == 1) {
		this.initWin();
		Branding.levelFinished(DataPlayer.stage);
	}
	else {
		this.initLose();
		Branding.gameOver(DataPlayer.stage);
	}
	Branding.submitScore(DataPlayer.score, Branding.showAd);
};

Result.inherit({
	initWin: function()
	{
		this.coins = DataPlayer.coins;
		this.gems = DataPlayer.gems;

		this.pnl = global.addSprite(this.gw*0.5, this.gh*0.5, 'dialog/pnl_result');
		this.pnl.anchor.setTo(0.5, 0.5);
		this.container.add(this.pnl);

		this.title = global.addSprite(this.pnl.x, this.pnl.y - this.pnl.height*0.55, 'dialog/title_victory');
		this.title.anchor.setTo(0.5, 0.5);
		this.container.add(this.title);

		this.txtGet = global.setText2(global._t('you_get'), this.pnl.x, this.pnl.y - this.pnl.height*0.28, 60, 0.5, 0.5, '#00CC00');
		this.txtGet.stroke = '#000000';
		this.txtGet.strokeThickness = 5;
		this.container.add(this.txtGet);

		this.pnlCoins = global.addSprite(this.pnl.x, this.pnl.y - this.pnl.height*0.1, 'dialog/pnl_coins');
		this.pnlCoins.anchor.setTo(0.5, 0.5);
		this.container.add(this.pnlCoins);

		this.txtCoins = global.setText2(this.coins, this.pnlCoins.x + this.pnlCoins.width*0.45, this.pnlCoins.y + this.pnlCoins.height*0.07, 36, 1, 0.5, '#ffffff');
		this.txtCoins.stroke = '#000000';
		this.txtCoins.strokeThickness = 3;
		this.container.add(this.txtCoins);

		this.pnlGems = global.addSprite(this.pnl.x, this.pnl.y + this.pnl.height*0.1, 'dialog/pnl_gems');
		this.pnlGems.anchor.setTo(0.5, 0.5);
		this.container.add(this.pnlGems);

		this.txtGems = global.setText2(this.gems, this.pnlGems.x + this.pnlGems.width*0.45, this.pnlGems.y + this.pnlGems.height*0.04, 36, 1, 0.5, '#ffffff');
		this.txtGems.stroke = '#000000';
		this.txtGems.strokeThickness = 3;
		this.container.add(this.txtGems);

		if(game.curstate.stage < 30) {
			this.btnNext = global.addButton(this.pnl.x, this.pnl.y + this.pnl.height*0.35, 'dialog/btn_play', this.onWinClick, this);
			this.btnNext.anchor.setTo(0.5, 0.5);
			this.container.add(this.btnNext);
		}

		this.btnHome = global.addButton(this.pnl.x - this.pnl.width*0.3, this.pnl.y + this.pnl.height*0.45, 'dialog/btn_home', this.onWinClick, this);
		this.btnHome.anchor.setTo(0.5, 0.5);
		this.container.add(this.btnHome);

		this.btnRestart = global.addButton(this.pnl.x + this.pnl.width*0.3, this.btnHome.y, 'dialog/btn_retry', this.onWinClick, this);
		this.btnRestart.anchor.setTo(0.5, 0.5);
		this.container.add(this.btnRestart);

		this.btnUpgrade = global.addButton(this.pnl.x, this.gh*0.77, 'dialog/btn_upgrade', this.onWinClick, this);
		this.btnUpgrade.anchor.setTo(0.5, 0.5);
		this.container.add(this.btnUpgrade);

	},

	initLose: function()
	{
		this.player = global.addSprite(this.gw*0.5, this.gh*0.43, 'dialog/player');
		this.player.anchor.setTo(0.5, 0.5);
		this.container.add(this.player);

		this.title = global.addSprite(this.gw*0.5, this.gh*0.6, 'dialog/title_defeat');
		this.title.anchor.setTo(0.5, 0.5);
		this.container.add(this.title);

		var str2 = "pnl_gems_mini_off";
		var str = 'btn_revive_off';
		var isOn = false;
		if(DataPlayer.gems >= Data.revivePrice) {
			str = 'btn_revive_on';
			str2 = "pnl_gems_mini"
			isOn = true;
		}

		this.btnRevive = global.addButton(this.gw*0.5, this.gh*0.2, 'dialog/'+str, this.onReviveClick, this);
		this.btnRevive.anchor.setTo(0.5, 0.5);
		this.container.add(this.btnRevive);
		this.btnRevive.isOn = isOn;

		this.pnlGems = global.addSprite(this.btnRevive.x, this.btnRevive.y + this.btnRevive.height*0.55, 'dialog/'+str2);
		this.pnlGems.anchor.setTo(0.5, 0.5);
		this.container.add(this.pnlGems);

		this.txtGems = global.setText2(Data.revivePrice, this.pnlGems.x + this.pnlGems.width*0.2, this.pnlGems.y, 36, 0.5, 0.5, '#ffffff');
		this.txtGems.stroke = '#000000';
		this.txtGems.strokeThickness = 3;
		this.container.add(this.txtGems);

		this.btnHome = global.addButton(this.gw*0.35, this.gh*0.72, 'dialog/btn_home', this.onWinClick, this);
		this.btnHome.anchor.setTo(0.5, 0.5);
		this.container.add(this.btnHome);
		
		this.btnRestart = global.addButton(this.gw*0.65, this.btnHome.y, 'dialog/btn_retry', this.onWinClick, this);
		this.btnRestart.anchor.setTo(0.5, 0.5);
		this.container.add(this.btnRestart);

		this.btnUpgrade = global.addButton(this.gw*0.5, this.gh*0.8, 'dialog/btn_upgrade', this.onWinClick, this);
		this.btnUpgrade.anchor.setTo(0.5, 0.5);
		this.container.add(this.btnUpgrade);
	},

	onReviveClick: function(obj)
	{
		if(!obj.isOn || this.isTween)
			return;

		csound.click();
		this.isTween = true;
		obj.scale.setTo(0.9, 0.9);
		var tween = game.add.tween(obj.scale).to({x: 1, y: 1}, 350, Phaser.Easing.Elastic.Out, true);
		tween.onComplete.add(function() {
			this.onDestroy();
			this.isTween = false;
			game.curstate.revivePlayer();
		}, this);
	},

	onDestroy: function()
	{
		// trace("DESTROY");
		this.player.destroy();
		this.player = null;
		this.title.destroy();
		this.title = null;
		this.btnRevive.destroy();
		this.btnRevive = null;
		this.pnlGems.destroy();
		this.pnlGems = null;
		this.txtGems.destroy();
		this.txtGems = null;
		this.btnHome.destroy();
		this.btnHome = null;
		this.btnRestart.destroy();
		this.btnRestart = null;
		this.btnUpgrade.destroy();
		this.btnUpgrade = null;
	},

	onWinClick: function(obj)
	{
		if(this.isTween)
			return;

		csound.click();
		this.isTween = true;
		obj.scale.setTo(0.9, 0.9);
		var tween = game.add.tween(obj.scale).to({x: 1, y: 1}, 350, Phaser.Easing.Elastic.Out, true);
		tween.onComplete.add(function() {
			if(obj == this.btnNext) {
				// if(DataPlayer.lastStage == game.curstate.stage)
				// 	DataPlayer.stage = game.curstate.stage+1;
				DataPlayer.stage++;
				game.state.start('cgame');
			}

			if(obj == this.btnHome) {
				game.state.start('cstage');
			}

			if(obj == this.btnRestart) {
				game.state.start('cgame');
			}

			if(obj == this.btnUpgrade) {
				game.state.start('cupgrade');
			}
			this.isTween = false;
		}, this);
	},
});