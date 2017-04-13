Roulette = function(game, gw, gh, container)
{
	this.gw = gw;
	this.gh = gh;
	this.container = container;

	this.init();
};

Roulette.inherit({
	init: function()
	{
		// this.isStart = false;
		// this.isInc = true;
		// this.va = 0;
		// this.max = game.rnd.integerInRange(18, 22);

		this.back = global.addSprite(this.gw*0.5, this.gh*0.5, 'upgrade/roulette_back');
		this.back.anchor.setTo(0.5, 0.5);
		this.container.add(this.back);

		this.wheel = global.addSprite(this.back.x, this.back.y, 'upgrade/roulette_mid_alt');
		this.wheel.anchor.setTo(0.5, 0.5);
		this.container.add(this.wheel);

		this.front = global.addSprite(this.back.x, this.back.y, 'upgrade/roulette_front');
		this.front.anchor.setTo(0.5, 0.5);
		this.container.add(this.front);

		this.pandom = global.addSprite(this.back.x, this.back.y - this.back.height*0.45, 'upgrade/pandom');
		this.pandom.anchor.setTo(0.5, 0.5);
		this.container.add(this.pandom);

		this.plus = global.addSprite(this.gw*0.35, this.gh*0.13, 'upgrade/plus');
		this.plus.anchor.setTo(1, 0.5);
		this.container.add(this.plus);
		this.plus.scale.setTo(0.8, 0.8);

		this.btnRetry = global.addButton(this.gw*0.35, this.gh*0.87, 'upgrade/btn_retry', this.onClick, this);
		this.btnRetry.anchor.setTo(0.5, 0.5);
		this.container.add(this.btnRetry);

		this.btnNext = global.addButton(this.gw*0.65, this.gh*0.87, 'upgrade/btn_next_roulette', this.onClick, this);
		this.btnNext.anchor.setTo(0.5, 0.5);
		this.container.add(this.btnNext);

		this.btnRetry.visible = false;
		this.btnNext.visible = false;
		this.plus.visible = false;
		// this.onStart();
	},

	onStart: function(status)
	{
		status = status || 0;
		this.ctrSound = 40;
		this.stepSound = 0;
		if(status == 0) {
			this.wheel.angle = game.rnd.integerInRange(0, 360);		
		}
		this.isTween = false;
		this.isInc = true;
		this.va = 2;
		this.max = game.rnd.integerInRange(6, 9);
		game.time.events.add(Phaser.Timer.SECOND*0.5, function() {
			this.isStart = true;
		}, this);
	},

	onDestroy: function()
	{
		if (this.icon) {
			this.icon.destroy();
			this.icon = null;
		}
		// this.plus.destroy();
		// this.plus = null;
		// this.btnNext.destroy();
		// this.btnNext = null;
		this.plus.visible = false;
		this.btnNext.visible = false;
		this.btnRetry.visible = false;
	},

	checkAngle: function()
	{
		var idx;
		trace(this.wheel.angle);
		if(this.wheel.angle >= 0) {
			if(this.wheel.angle <= 36) {
				trace("STAMINA");
				idx = 1;
			}
			else if(this.wheel.angle <= 72) {
				trace("ZONK");
				idx = 5;
			}
			else if(this.wheel.angle <= 108) {
				trace("ATTACK");
				idx = 2;
			}
			else if(this.wheel.angle <= 144) {
				trace("ZONK");
				idx = 5;
			}
			else if(this.wheel.angle <= 180) {
				trace("MP");
				idx = 4;
			}
		}
		else {
			if(this.wheel.angle >= -36) {
				trace("ZONK");
				idx = 5;
			}
			else if(this.wheel.angle >= -72) {
				trace("HP");
				idx = 0;
			}
			else if(this.wheel.angle >= -108) {
				trace("ZONK");
				idx = 5;
			}
			else if(this.wheel.angle >= -144) {
				trace("DEFEND");
				idx = 3;
			}
			else if(this.wheel.angle >= -180) {
				trace("ZONK");
				idx = 5;
			}	
		}

		this.genIcon(idx);
	},

	genIcon: function(idx)
	{
		global.resultIdx = idx;
		if (idx < 5) {
			DataPlayer.skill[idx] += Data.upgradeSkill[idx];
			game.curstate.setPriceGems();
			game.curstate.checkUpgradeGems();

			this.icon = global.addSprite(this.gw*0.5, this.gh*0.13, 'upgrade/result_'+idx);
			this.icon.anchor.setTo(0.5, 0.5);
			this.icon.scale.setTo(0, 0);
			this.container.add(this.icon);

			var tween = game.add.tween(this.icon.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Elastic.Out, true);
			tween.onComplete.add(this.onRouletteDone, this);
			csound.skill();
		}
		else {
			csound.failed();
			this.onRouletteDone();
		}
	},

	onRouletteDone: function()
	{
		trace("onRouletteDone", global.resultIdx);
		this.plus.visible = (global.resultIdx < 5);
		this.btnNext.visible = true;
		if(DataPlayer.gems >= game.curstate.pnlGems_5.price) {
			this.btnRetry.visible = true;
			this.btnNext.x = this.gw*0.65;
		}
		else {
			this.btnRetry.visible = false;
			this.btnNext.x = this.gw*0.5;
		}
		// this.plus = global.addSprite(this.gw*0.3, this.gh*0.13, 'upgrade/plus');
		// this.plus.anchor.setTo(1, 0.5);
		// this.container.add(this.plus);
		// this.plus.scale.setTo(0.8, 0.8);

		// this.btnNext = global.addButton(this.gw*0.5, this.gh*0.87, 'upgrade/btn_next_roulette', this.onClick, this);
		// this.btnNext.anchor.setTo(0.5, 0.5);
		// this.container.add(this.btnNext);
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
			if(obj == this.btnNext) {
				game.curstate.onCloseRoulette();
			}

			if(obj == this.btnRetry) {
				if (this.icon) {
					this.icon.destroy();
					this.icon = null;
				}
				this.btnRetry.visible = false;
				this.btnNext.visible = false;
				this.plus.visible = false;
				DataPlayer.gems -= game.curstate.pnlGems_5.price;
				game.curstate.genTxtGems();
				this.onStart(1);
			}
			this.isTween = false;
		}, this);
	},

	update: function()
	{
		// return;

		if(!this.isStart)
			return;

		this.wheel.angle += this.va;
		// trace("ANGLE", this.wheel.angle);
		if(this.ctrSound > 0)
			this.ctrSound-=3;
		if(this.ctrSound <= 0) {
			csound.roulette();
			this.ctrSound = 40 - 2*this.va;
		}
		// this.checkSound();
		if(this.isInc) {
			this.va += 0.4;
		}
		else {
			this.va -= 0.05;
			if(this.va <= 0) {
				trace("STOP", this.wheel.angle);
				this.checkAngle();
				this.isStart = false;
				this.va = 0;
			}
		}

		if(this.va >= this.max) {
			this.isInc = false;
		}
	},

});