Pause = function(game, gw, gh, container)
{
	this.gw = gw;
	this.gh = gh;
	this.container = container;

	this.init();
};

Pause.inherit({
	init: function()
	{
		this.pnl = global.addSprite(this.gw*0.5, this.gh*0.5, 'dialog/pnl_pause');
		this.pnl.anchor.setTo(0.5, 0.5);
		this.container.add(this.pnl);

		this.title = global.addSprite(this.pnl.x, this.pnl.y - this.pnl.height*0.38, 'dialog/title_pause');
		this.title.anchor.setTo(0.5, 0.5);
		this.container.add(this.title);

		this.btnResume = global.addButton(this.pnl.x, this.pnl.y - this.pnl.height*0.12, 'dialog/btn_play', this.onClick, this);
		this.btnResume.anchor.setTo(0.5, 0.5);
		this.container.add(this.btnResume);

		this.txtResume = global.setText1(global._t('resume'), this.btnResume.x, this.btnResume.y + this.btnResume.height*0.65, 36, 0.45, 0.5, '#FFFF00');
		this.txtResume.stroke = '#000000';
		this.txtResume.strokeThickness = 5;
		this.container.add(this.txtResume);

		this.btnRestart = global.addButton(this.pnl.x - this.pnl.width*0.2, this.pnl.y + this.pnl.height*0.18, 'dialog/btn_retry', this.onClick, this);
		this.btnRestart.anchor.setTo(0.5, 0.5);
		this.container.add(this.btnRestart);

		this.txtRestart = global.setText1(global._t('restart'), this.btnRestart.x, this.btnRestart.y + this.btnRestart.height*0.65, 36, 0.45, 0.5, '#FFFF00');
		this.txtRestart.stroke = '#000000';
		this.txtRestart.strokeThickness = 5;
		this.container.add(this.txtRestart);

		this.btnHome = global.addButton(this.pnl.x + this.pnl.width*0.2, this.btnRestart.y, 'dialog/btn_home', this.onClick, this);
		this.btnHome.anchor.setTo(0.5, 0.5);
		this.container.add(this.btnHome);

		this.txtHome = global.setText1(global._t('home'), this.btnHome.x, this.btnHome.y + this.btnHome.height*0.65, 36, 0.45, 0.5, '#FFFF00');
		this.txtHome.stroke = '#000000';
		this.txtHome.strokeThickness = 5;
		this.container.add(this.txtHome);
	},

	onClick: function(obj)
	{
		if(this.isTween)
			return;

		csound.click();
		this.isTween = true;
		obj.scale.setTo(0.9, 0.9);
		var tween = game.add.tween(obj.scale).to({x: 1, y: 1}, 350, Phaser.Easing.Elastic.Out, true);
		tween.onComplete.add(function() {
			if(obj == this.btnResume) {
				game.curstate.setPauseOff();
			}

			if(obj == this.btnRestart) {
				game.state.start('cgame');
			}

			if(obj == this.btnHome) {
				Branding.showAd();
				game.state.start('cstage');
			}
			this.isTween = false;
		}, this);
	},
});