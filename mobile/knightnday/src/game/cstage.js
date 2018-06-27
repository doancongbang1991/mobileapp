cstage = function(game)
{
}

cstage.inherit({
	preload: function()
	{
		BaseState.prototype.preload.call(this);
		Asset.png('bg_stage');
		Asset.atlaspng('stage');
		Asset.atlaspng('achievement');
	},

	create: function()
	{
		game.curstate = this;
		BaseState.prototype.create.call(this);

		this.nowIdx = null;
		this.destIdx = null;

		this.isAchievement = false;
		this.isTween = false;
		this.isMove = false;
		this.lastStage = DataPlayer.lastStage;
		// this.awal = null;
		// this.tujuan = null;
		this.selisihStage = 0;
		
		this.bg = game.add.sprite(this.gw*0.5, -this.gh*0.15, 'bg_stage');
		this.bg.anchor.setTo(0.5, 0);
		this.gBG.add(this.bg);

		this.btnClose = global.addButton(this.gw*0.9, this.gh*0.1, 'stage/btn_close', this.onUIClick, this);
		this.btnClose.anchor.setTo(0.5, 0.5);
		this.gCont.add(this.btnClose);

		this.title = global.addSprite(this.gw*0.1, this.gh*0.1, 'stage/title');
		this.title.anchor.setTo(0, 0.5);
		this.gCont.add(this.title);

		this.g1 = game.add.group();
		this.g2 = game.add.group();
		this.gCont.add(this.g1);
		this.gCont.add(this.g2);

		this.bg1 = global.addSprite(this.gw*0.47, this.gh*0.48, 'stage/bg_1');
		this.bg1.anchor.setTo(0.5, 0.5);
		this.g1.add(this.bg1);

		this.kayu1 = global.addSprite(this.gw, this.gh*0.45, 'stage/kayu_1');
		this.kayu1.anchor.setTo(1, 0.5);
		this.g1.add(this.kayu1);

		this.setPivot(this.g1, this.kayu1);

		this.bg2 = global.addSprite(this.gw*0.53, this.gh*0.44, 'stage/bg_2');
		this.bg2.anchor.setTo(0.5, 0.5);
		this.g2.add(this.bg2);

		this.kayu2 = global.addSprite(0, this.kayu1.y, 'stage/kayu_2');
		this.kayu2.anchor.setTo(0, 0.5);
		this.g2.add(this.kayu2);

		this.setPivot(this.g2, this.kayu2);

		this.btnSound = new csound(game, this.gw*0.75, this.gh*0.1);
		this.btnSound.anchor.setTo(0.5, 0.5);
		this.btnSound.scale.setTo(0.9);
		this.gCont.add(this.btnSound);

		var pos1 = [
			{x: this.kayu1.x - this.kayu1.width*0.725, y: this.kayu1.y + this.kayu1.height*0.5},
			{x: this.kayu1.x - this.kayu1.width*0.725, y: this.kayu1.y + this.kayu1.height*0.25},
			{x: this.kayu1.x - this.kayu1.width*0.975, y: this.kayu1.y + this.kayu1.height*0.25},
			{x: this.kayu1.x - this.kayu1.width*0.975, y: this.kayu1.y},
			{x: this.kayu1.x - this.kayu1.width*0.725, y: this.kayu1.y},
			{x: this.kayu1.x - this.kayu1.width*0.725, y: this.kayu1.y - this.kayu1.height*0.23},
			{x: this.kayu1.x - this.kayu1.width*0.975, y: this.kayu1.y - this.kayu1.height*0.23},
			{x: this.kayu1.x - this.kayu1.width*0.975, y: this.kayu1.y - this.kayu1.height*0.48},
			{x: this.kayu1.x - this.kayu1.width*0.725, y: this.kayu1.y - this.kayu1.height*0.48},
			{x: this.kayu1.x - this.kayu1.width*0.475, y: this.kayu1.y - this.kayu1.height*0.48},
			{x: this.kayu1.x - this.kayu1.width*0.225, y: this.kayu1.y - this.kayu1.height*0.48},
			{x: this.kayu1.x - this.kayu1.width*0.225, y: this.kayu1.y - this.kayu1.height*0.23},
			{x: this.kayu1.x - this.kayu1.width*0.225, y: this.kayu1.y},
			{x: this.kayu1.x - this.kayu1.width*0.475, y: this.kayu1.y},
			{x: this.kayu1.x - this.kayu1.width*0.475, y: this.kayu1.y + this.kayu1.height*0.25},

			{x: this.kayu2.x + this.kayu2.width*0.225, y: this.kayu2.y + this.kayu2.height*0.25},
			{x: this.kayu2.x + this.kayu2.width*0.475, y: this.kayu2.y + this.kayu2.height*0.25},
			{x: this.kayu2.x + this.kayu2.width*0.725, y: this.kayu2.y + this.kayu2.height*0.25},
			{x: this.kayu2.x + this.kayu2.width*0.725, y: this.kayu2.y},
			{x: this.kayu2.x + this.kayu2.width*0.475, y: this.kayu2.y},
			{x: this.kayu2.x + this.kayu2.width*0.225, y: this.kayu2.y},
			{x: this.kayu2.x + this.kayu2.width*0.225, y: this.kayu2.y - this.kayu2.height*0.23},
			{x: this.kayu2.x + this.kayu2.width*0.475, y: this.kayu2.y - this.kayu2.height*0.23},
			{x: this.kayu2.x + this.kayu2.width*0.475, y: this.kayu2.y - this.kayu2.height*0.48},
			{x: this.kayu2.x + this.kayu2.width*0.725, y: this.kayu2.y - this.kayu2.height*0.48},
			{x: this.kayu2.x + this.kayu2.width*0.725, y: this.kayu2.y - this.kayu2.height*0.23},
			{x: this.kayu2.x + this.kayu2.width*0.975, y: this.kayu2.y - this.kayu2.height*0.23},
			{x: this.kayu2.x + this.kayu2.width*0.975, y: this.kayu2.y},
			{x: this.kayu2.x + this.kayu2.width*0.975, y: this.kayu2.y + this.kayu2.height*0.25},
			{x: this.kayu2.x + this.kayu2.width*0.975, y: this.kayu2.y + this.kayu2.height*0.5},
		];

		for(var i=1;i<=pos1.length;i++) {
			var str = 'stage/btn_off';
			if(i == this.lastStage)
				str = 'stage/btn_sel';
			else if(i < this.lastStage)
				str = 'stage/btn_on';

			this['stage_'+i] = global.addSprite(pos1[i-1].x, pos1[i-1].y, str);
			var st = this['stage_'+i];
			st.anchor.setTo(0.5, 0.5);
			st.idx = i;
			st.inputEnabled = true;
			st.events.onInputUp.add(this.onStageClick, this);

			this['txt_'+i] = global.setText1(i, st.x, st.y, 32, 0.5, 0.45, '#ffffff');
			var txt = this['txt_'+i];

			if(i <= 15) {
				this.g1.add(st);
				this.g1.add(txt);
			}
			else {
				this.g2.add(st);
				this.g2.add(txt);
			}
		}

		var posLS = {x: this['stage_'+this.lastStage].x, y: this['stage_'+this.lastStage].y};
		this.player = global.addSprite(posLS.x, posLS.y, 'stage/player');
		this.player.anchor.setTo(0.5, 0.9);
		this.player.idx = this.lastStage;
		this.nowIdx = this.player.idx;

		this.btnNext = global.addButton(this.gw*0.85, this.gh*0.8, 'global/btn_next', this.onUIClick, this);
		this.btnNext.anchor.setTo(0.5, 0.5);
		this.g1.add(this.btnNext);

		this.btnPrev = global.addButton(this.gw*0.15, this.btnNext.y, 'global/btn_prev', this.onUIClick, this);
		this.btnPrev.anchor.setTo(0.5, 0.5);
		this.g2.add(this.btnPrev);

		this.btnPlay = global.addButton(this.gw*0.5, this.gh*0.9, 'stage/btn_play', this.onUIClick, this);
		this.btnPlay.anchor.setTo(0.5, 0.5);
		this.btnPlay.scale.setTo(1.3, 1.3);
		this.gCont.add(this.btnPlay);
		game.add.tween(this.btnPlay.scale).to({x: 1.2, y: 1.2}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);

		this.btnAchievement = global.addButton(this.gw*0.25, this.gh*0.9, 'stage/btn_achievement', this.onUIClick, this);
		this.btnAchievement.anchor.setTo(0.5, 0.5);
		this.btnAchievement.scale.setTo(1.3, 1.3);
		this.gCont.add(this.btnAchievement);

		this.btnUpgrade = global.addButton(this.gw*0.75, this.btnAchievement.y, 'stage/btn_upgrade', this.onUIClick, this);
		this.btnUpgrade.anchor.setTo(0.5, 0.5);
		this.btnUpgrade.scale.setTo(1.3, 1.3);
		this.gCont.add(this.btnUpgrade);

		if(this.lastStage <= 15) {
			this.g1.x = this.gw;
			this.g2.x = this.gw;
			this.btnPrev.visible = false;
			this.g1.add(this.player);
		}
		else {
			this.g1.x = 0;
			this.g2.x = 0;
			this.btnNext.visible = false;
			this.g2.add(this.player);
		}

		this.gAchievement = game.add.group();
		this.gFG.add(this.gAchievement);

		this.achievement = new Achievement(game, this.gw, this.gh, this.gAchievement);
		this.gAchievement.visible = false;

		this.scoreTxt = global.setText1(_t("score") + ":  " + DataPlayer.score, this.centerX, this.gh*0.8, 32, 0.5, 0.45, 'yellow');
		this.scoreTxt.stroke ="#66471A";
		this.scoreTxt.strokeThickness = 8;
		this.scoreTxt.anchor.setTo(0.5);
		this.gCont.add(this.scoreTxt);

		var txt = this['txt_'+i];

		this.onResize();
	},

	onOpenAchievement: function()
	{
		this.black80.visible = true;
		this.isAchievement = true;
		this.gAchievement.visible = true;
	},

	onCloseAchievement: function()
	{
		this.black80.visible = false;
		this.isAchievement = false;
		this.gAchievement.visible = false;
	},

	onStageClick: function(obj)
	{
		if(this.isTween || obj.idx == this.player.idx || obj.idx == this.destIdx || this.isAchievement)
			return;

		if(obj.idx > this.lastStage)
			return;

		csound.click();
		this.isTween = true;
		this.destIdx = obj.idx;
		this['stage_'+this.nowIdx].frameName = 'stage/btn_on';

		if(obj.idx <= 15) {
			if(this.player.idx > 15) {
				this.player.x = this.gw;
				this.player.y = this.stage_15.y;
				this.player.idx = 16;
				this.nowIdx = this.player.idx;
				this.g1.add(this.player);
			}
		}
		else {
			if(this.player.idx <= 15) {
				this.player.x = 0;
				this.player.y = this.stage_16.y;
				this.player.idx = 15;
				this.nowIdx = this.player.idx;
				this.g2.add(this.player);
			}
		}

		if(this.destIdx > this.nowIdx) {
			csound.skill();
			this.setPlayerTween(this.nowIdx, this.nowIdx+1);
		}
		else {
			csound.shuffle();
			this.setPlayerTween(this.nowIdx, this.nowIdx-1);
		}
	},

	setPlayerTween: function(awal, tujuan)
	{
		// csound.skill();
		var _x = this['stage_'+tujuan].x;
		var _y = this['stage_'+tujuan].y;
		if(_x < this.player.x)
			this.player.scale.x = -1;
		else if(_x > this.player.x)
			this.player.scale.x = 1;
		var tween = game.add.tween(this.player).to({x: _x, y: _y}, 250, Phaser.Easing.Sinusoidal.Out, true);
		tween.onComplete.add(function() {
			this.nowIdx = tujuan;
			this.player.idx = this.nowIdx;
			this['stage_'+tujuan].frameName = 'stage/btn_sel';
			if(this.nowIdx != this.destIdx) {
				this['stage_'+this.nowIdx].frameName = 'stage/btn_on';
				if(this.destIdx > this.nowIdx) {
					this.setPlayerTween(this.nowIdx, this.nowIdx+1);
				}
				else {
					this.setPlayerTween(this.nowIdx, this.nowIdx-1);
				}
			}
			else {
				this.isTween = false;
			}
		}, this);
	},

	onUIClick: function(obj)
	{
		if(this.isTween || this.isMove || this.isAchievement)
			return;

		csound.click();
		this.isTween = true;
		// obj.scale.setTo(0.9, 0.9);
		obj.sx = obj.scale.x;
		obj.sy = obj.scale.y;

		obj.scale.setTo(obj.sx, obj.sy);
		var tween = game.add.tween(obj.scale).to({x: 1.3, y: 1.3}, 350, Phaser.Easing.Elastic.Out, true);
		tween.onComplete.add(function() {
			obj.scale.setTo(obj.sx, obj.sy);
			if(obj == this.btnClose) {
				game.state.start('cmainmenu');
			}
			if(obj == this.btnPlay) {
				DataPlayer.stage = this.player.idx;
				game.state.start('cgame');
			}
			if(obj == this.btnNext) {
				this.isMove = true;
				obj.visible = false;
				game.add.tween(this.g1).to({x: 0}, 500, Phaser.Easing.Sinusoidal.Out, true);
				var tween2 = game.add.tween(this.g2).to({x: 0}, 500, Phaser.Easing.Sinusoidal.Out, true);
				tween2.onComplete.add(function() {
					this.btnPrev.visible = true;
					this.isMove = false;
				}, this);
			}
			if(obj == this.btnPrev) {
				this.isMove = true;
				obj.visible = false;
				game.add.tween(this.g2).to({x: this.gw}, 500, Phaser.Easing.Sinusoidal.Out, true);
				var tween2 = game.add.tween(this.g1).to({x: this.gw}, 500, Phaser.Easing.Sinusoidal.Out, true);
				tween2.onComplete.add(function() {
					this.btnNext.visible = true;
					this.isMove = false;
				}, this);
			}
			if(obj == this.btnUpgrade) {
				game.state.start('cupgrade');
			}
			if(obj == this.btnAchievement) {
				this.onOpenAchievement();
			}
			this.isTween = false;
		}, this);
	},

	update: function()
	{
		BaseState.prototype.update.call(this);
	},
}, BaseState);