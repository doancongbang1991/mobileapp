cupgrade = function(game)
{
};

cupgrade.inherit({
	preload: function()
	{
		BaseState.prototype.preload.call(this);
		Asset.png('bg_upgrade');
		Asset.atlaspng('upgrade');
	},

	create: function()
	{
		game.curstate = this;
		BaseState.prototype.create.call(this);

		for(var i=0;i<6;i++) {
			this['priceGems_'+i] = null;
			if(i < 3) {
				this['txtPriceCoins_'+i] = null;
			}
		}

		this.isTween = false;
		this.isRoulette = false;

		this.txtCoins = null;
		this.txtGems = null;

		this.bg = game.add.sprite(0, 0, 'bg_upgrade');
		this.bg.isStretch = true;
		this.gBG.add(this.bg);

		this.title = global.addSprite(this.gw*0.5, this.gh*0.2, 'upgrade/title');
		this.title.anchor.setTo(0.5, 0.5);
		this.gCont.add(this.title);

		this.pnlCoins = global.addSprite(this.gw*0.075, this.gh*0.075, 'upgrade/pnl_coins');
		this.pnlCoins.anchor.setTo(0, 0.5);
		this.gCont.add(this.pnlCoins);

		this.pnlGems = global.addSprite(this.pnlCoins.x + this.pnlCoins.width*1.1, this.pnlCoins.y, 'upgrade/pnl_gems');
		this.pnlGems.anchor.setTo(0, 0.5);
		this.gCont.add(this.pnlGems);

		this.genTxtCoins();
		this.genTxtGems();

		this.gCoins = game.add.group();
		this.gGems = game.add.group();
		this.gCont.add(this.gCoins);
		this.gCont.add(this.gGems);

		this.gRoulette = game.add.group();
		this.gFG.add(this.gRoulette);

		this.genGroupCoins();
		this.genGroupGems();
		this.gCoins.visible = false;

		this.roulette = null;
		// this.black80.visible = true;
		this.roulette = new Roulette(game, this.gw, this.gh, this.gRoulette);
		this.gRoulette.visible = false;
		// this.roulette.isStart = true;

		this.btnHome = global.addButton(this.gw*0.5, this.gh*0.9, 'upgrade/btn_home', this.onUIClick, this);
		this.btnHome.anchor.setTo(0.5, 0.5);
		this.gCont.add(this.btnHome);
		game.add.tween(this.btnHome.scale).to({x: 1.1, y: 1.1}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);

		this.btnPrev = global.addButton(this.gw*0.3, this.btnHome.y, 'global/btn_prev', this.onUIClick, this);
		this.btnPrev.anchor.setTo(0.5, 0.5);
		this.gCont.add(this.btnPrev);

		this.btnNext = global.addButton(this.gw*0.7, this.btnHome.y, 'global/btn_next', this.onUIClick, this);
		this.btnNext.anchor.setTo(0.5, 0.5);
		this.gCont.add(this.btnNext);


		this.btnSound = new csound(game, this.gw*0.85, this.gh*0.08);
		this.btnSound.anchor.setTo(0.5, 0.5);
		this.btnSound.scale.setTo(0.9);
		this.gCont.add(this.btnSound);

		this.onResize();
	},

	onUIClick: function(obj)
	{
		if(this.isTween || this.isRoulette)
			return;

		csound.click();
		obj.scale.setTo(0.9, 0.9);
		this.isTween = true;
		var tween = game.add.tween(obj.scale).to({x: 1, y: 1}, 350, Phaser.Easing.Elastic.Out, true);
		tween.onComplete.add(function() {
			if(obj == this.btnHome) {
				game.state.start('cstage');
			}
			else {
				if(this.gCoins.visible) {
					this.gCoins.visible = false;
					this.gGems.visible = true;
				}
				else {
					this.gGems.visible = false;
					this.gCoins.visible = true;
				}
			}

			this.isTween = false;
		}, this);
	},

	genGroupGems: function()
	{
		var group = this.gGems;

		var pos = [
			{x: this.gw*0.19, y: this.gh*0.4},
			{x: this.gw*0.5, y: this.gh*0.4},
			{x: this.gw*0.81, y: this.gh*0.4},
			{x: this.gw*0.19, y: this.gh*0.67},
			{x: this.gw*0.5, y: this.gh*0.67},
			{x: this.gw*0.81, y: this.gh*0.67},
		];

		var multiply = this.checkPriceGems();
		// console.log(multiply);
		for(var i=0;i<pos.length;i++) {
			this['pnlBackGems_'+i] = global.addSprite(pos[i].x, pos[i].y, 'upgrade/pnl_back_gems');
			var back = this['pnlBackGems_'+i];
			back.anchor.setTo(0.5, 0.5);
			group.add(back);
			back.idx = i;
			// if(i < 5) {
				back.inputEnabled = true;
				back.events.onInputDown.add(this.onHintDown, this);
				back.events.onInputUp.add(this.onHintUp, this);
			// }

			this['iconGems_'+i] = global.addSprite(back.x, back.y - back.height*0.2, 'upgrade/icon_'+i);
			var icon = this['iconGems_'+i];
			icon.anchor.setTo(0.5, 0.5);
			group.add(icon);

			var _t = global._t('desc_up_'+i);
			this['txtGems_'+i] = global.setText1(_t, back.x, back.y + back.height*0.05, 20, 0.5, 0, '#ffffff');
			var txt = this['txtGems_'+i];
			txt.stroke = '#000000';
			txt.strokeThickness = 3;
			txt.align = 'center';
			txt.lineSpacing = -10;
			group.add(txt);

			if(i < pos.length-1) {
				this['incGems_'+i] = global.addSprite(back.x, back.y + back.height*0.25, 'upgrade/arrow_2');
				var inc = this['incGems_'+i];
				inc.animations.add('incPlay', Phaser.Animation.generateFrameNames('upgrade/arrow_', 0, 2, '', 1), 8, true);
				// inc.animations.play('incPlay');
				inc.anchor.setTo(0.5, 0.5);
				group.add(inc);
			
				// this.genTxtUp(i, 1);
			}

			// var _p = Data.skillPrice[i];
			var _p = Data.skillPrice[i];
			_p = Math.ceil(_p*multiply[i]);
			// console.log(_p);

			this['pnlGems_'+i] = global.addSprite(back.x, back.y + back.height*0.47, 'upgrade/pnl_gems_on');
			var pnl = this['pnlGems_'+i];
			pnl.anchor.setTo(0.5, 0.5);
			pnl.price = _p;
			pnl.idx = i;
			group.add(pnl);
			pnl.inputEnabled = true;
			pnl.events.onInputUp.add(this.onGemsClick, this);
		}
		this.setPriceGems();
		this.checkUpgradeGems(1);

		this.gHint = game.add.group();
		group.add(this.gHint);
		// var ref = this.pnlBackGems_0;
		// this.pnlHint = global.addSprite(this.gw*0.5, this.gh*0.15, 'upgrade/pnl_hint');
		this.pnlHint = global.addSprite(this.gw*0.5, 0, 'upgrade/pnl_hint');
		this.pnlHint.anchor.setTo(0.5, 0.5);
		this.pnlHint.scale.setTo(1.2, 1.2);
		this.pnlHint.y -= this.pnlHint.height*0.5;
		this.gHint.add(this.pnlHint);

		var txtT = global._t('upgrade_title_0');
		this.titleHint = global.setText1(txtT, this.pnlHint.x, this.pnlHint.y - this.pnlHint.height*0.42, 40, 0.5, 0, '#ffff00');
		this.titleHint.stroke = '#000000';
		this.titleHint.strokeThickness = 3;
		this.gHint.add(this.titleHint);

		var txtD = global._t('upgrade_desc_0');
		this.descHint = global.setText1(txtD, this.pnlHint.x, this.pnlHint.y + this.pnlHint.height*0.1, 30, 0.5, 0.5, '#ffffff');
		this.descHint.stroke = '#000000';
		this.descHint.strokeThickness = 3;
		this.descHint.lineSpacing = -10;
		this.descHint.align = 'center';
		this.descHint.wordWrap = true;
		this.descHint.wordWrapWidth = this.pnlHint.width*0.8;
		this.gHint.add(this.descHint);

		this.gHint.visible = false;
		this.setPivot(this.gHint, this.pnlHint);
	},

	onHintDown: function(obj)
	{
		if(this.isTween || this.isRoulette)
			return;

		this.titleHint.setText(global._t('upgrade_title_'+obj.idx));
		this.descHint.setText(global._t('upgrade_desc_'+obj.idx));
		if(obj.idx == 0 || obj.idx == 3) {
			this.gHint.x = obj.x + this.pnlHint.width*0.4;
		}
		else if(obj.idx == 1 || obj.idx == 4) {
			this.gHint.x = obj.x;	
		}
		else {
			this.gHint.x = obj.x - this.pnlHint.width*0.4;
		}
		this.gHint.y = obj.y - this.pnlHint.height*0.6;
		this.gHint.visible = true;
		// game.add.tween(this.gHint).to({y: this.gh*0.15}, 250, Phaser.Easing.Sinusoidal.Out, true);
	},

	onHintUp: function(obj)
	{
		this.gHint.visible = false;
		// game.add.tween(this.gHint).to({y: -this.pnlHint.height*0.5}, 100, Phaser.Easing.Sinusoidal.Out, true);
	},

	setPriceGems: function()
	{
		var multiply = this.checkPriceGems();
		// console.log(multiply);
		var min = 10000;
		for(var i=0;i<6;i++) {
			var _p = Data.skillPrice[i];
			_p = Math.ceil(_p*multiply[i]);
			// if (i<5)
				// min = Math.min(_p, min);
			// console.log(i,"price",_p,min);

			var pnl = this['pnlGems_'+i];
			pnl.price = _p;

			if(this['priceGems_'+i] == null) {
				this['priceGems_'+i] = global.setText2(_p, pnl.x + pnl.width*0.4, pnl.y, 28, 1, 0.5, '#ffffff');
				var price = this['priceGems_'+i];
				price.stroke = '#000000';
				price.strokeThickness = 3;
				this.gGems.add(price);
			}
			else {
				this['priceGems_'+i].setText(_p);
			}
		}
		// this['pnlGems_5'].price = min;
		// this['priceGems_5'].setText(min);
	},

	onCloseRoulette: function()
	{
		this.black80.visible = false;
		this.gRoulette.visible = false;
		this.roulette.onDestroy();
		this.isRoulette = false;
	},

	checkAchievement: function()
	{
		// check achievement
		DataPlayer.totalRoulette++;
		var total = DataPlayer.totalRoulette;
		if(total == 5) {
			var ach = false;
			ach = Data.checkAchievement(1);
			if(ach) {
				trace("ACHIEVEMENT 1");
				this.genAchievement(1);
			}
		}
		else if(total == 15) {
			var ach = false;
			ach = Data.checkAchievement(4);
			if(ach) {
				trace("ACHIEVEMENT 4");
				this.genAchievement(4);
			}
		}
		else if(total == 30) {
			var ach = false;
			ach = Data.checkAchievement(7);
			if(ach) {
				trace("ACHIEVEMENT 7");
				this.genAchievement(7);
			}
		}
		// end check achievement
	},

	onOpenRoulette: function()
	{
		this.checkAchievement();
		this.isRoulette = true;
		this.black80.visible = true;
		this.gRoulette.visible = true;
		this.roulette.onStart();
	},

	onGemsClick: function(obj)
	{
		if(DataPlayer.gems < obj.price || this.isRoulette || this.isTween)
			return;

		csound.click();
		DataPlayer.gems -= obj.price;
		this.genTxtGems();
		if(obj.idx == 5) {
			// trace("ROULETTE >>>");
			this.onOpenRoulette();
			return;
		}
		else {
			csound.skill();
			this['incGems_'+obj.idx].animations.play('incPlay');
			game.time.events.add(Phaser.Timer.SECOND*1, function() {
				this.animations.stop();
				this.frameName = 'upgrade/arrow_2';
			}, this['incGems_'+obj.idx]);
			DataPlayer.skill[obj.idx] += Data.upgradeSkill[obj.idx];
		}
		this.setPriceGems();
		this.checkUpgradeGems();

		// console.log(DataPlayer.skill);
	},

	checkPriceGems: function()
	{
		var multi = [];
		// var temp = [];
		var min = 100000;
		for(var i=0;i<5;i++) {
			var _m;

			if(DataPlayer.skill[i] > 100)
				_m = 4;
			else if(DataPlayer.skill[i] > 50)
				_m = 2;
			else
				_m = 1;

			if (min > _m) min = _m;

			// trace("M >>>", _m);
			// temp.push(_m);
			multi.push(_m);
		}
		multi.push(min);

		return multi;
	},

	checkUpgradeGems: function(status)
	{
		status = status || 0;
		var multiply = this.checkPriceGems();
		for(var i=0;i<6;i++) {
			var str = 'upgrade/pnl_gems_on';
			// var price = Data.skillPrice[i];
			var price = Data.skillPrice[i];
			price = Math.ceil(price*multiply[i]);
			// var _m = 1;
			// if(i < 5) {
			// 	if(DataPlayer.skill[i] > 100)
			// 		_m = 3
			// 	else if(DataPlayer.skill[i] > 50)
			// 		_m = 2;
				
			// 	price = Math.ceil(price*_m);
			// 	multiply.push(_m);
			// }
			// else {
			// 	multiply.sort(function(a, b) { return a-b; });
			// 	price = Math.ceil(price*multiply[0]);
			// }
			if(DataPlayer.gems < price) {
				str = 'upgrade/pnl_gems_off';
			}
			this['pnlGems_'+i].frameName = str;

			if(i < 5) {
				this.genTxtUp(i, status);			
			}
		}
		
		Data.save();
	},

	genTxtUp: function(idx, status)
	{
		status = status || 0;
		// var dt = [DataPlayer.hp, DataPlayer.mp, DataPlayer.stamina, DataPlayer.attack, DataPlayer.defend];
		var ref = this['incGems_'+idx];
		var txtPre = DataPlayer.skill[idx];
		var txtPost = txtPre + Data.upgradeSkill[idx];

		if(status == 1) {
			// this['txtPreGems_'+idx] = global.setText2(txtPre, ref.x - ref.width*0.65, ref.y, 22, 1, 0.45, '#ffffff');
			this['txtPreGems_'+idx] = global.setText2(txtPre, ref.x - 25, ref.y, 22, 1, 0.45, '#ffffff');
			var pre = this['txtPreGems_'+idx];
			pre.stroke = '#000000';
			pre.strokeThickness = 3;
			this.gGems.add(pre);

			// this['txtPostGems_'+idx] = global.setText2(txtPost, ref.x + ref.width*0.65, ref.y, 22, 0, 0.45, '#FFFF00');
			this['txtPostGems_'+idx] = global.setText2(txtPost, ref.x + 25, ref.y, 22, 0, 0.45, '#FFFF00');
			var post = this['txtPostGems_'+idx];
			post.stroke = '#000000';
			post.strokeThickness = 3;
			this.gGems.add(post);
		}
		else {
			this['txtPreGems_'+idx].setText(txtPre);
			this['txtPostGems_'+idx].setText(txtPost);
		}
	},

	genGroupCoins: function()
	{
		var dt = [
			{x: this.gw*0.19, str: 'icon_dash', title: 'dash', desc: 'dash_desc'},
			{x: this.gw*0.5, str: 'icon_shield', title: 'shield', desc: 'shield_desc'},
			{x: this.gw*0.81, str: 'icon_berserk', title: 'berserk', desc: 'berserk_desc'},
		];

		var group = this.gCoins;

		for(var i=0;i<3;i++) {
			this['pnlBackCoins_'+i] = global.addSprite(dt[i].x, this.gh*0.55, 'upgrade/pnl_back_coins');
			var back = this['pnlBackCoins_'+i];
			back.anchor.setTo(0.5, 0.5);
			group.add(back);

			this['iconCoins_'+i] = global.addSprite(back.x, back.y - back.height*0.32, 'upgrade/'+dt[i].str);
			var icon = this['iconCoins_'+i];
			icon.anchor.setTo(0.5, 0.5);
			group.add(icon);

			this['titleCoins_'+i] = global.setText1(global._t(dt[i].title), back.x, back.y - back.height*0.14, 26, 0.5, 0.5, '#FFFF00');
			var title = this['titleCoins_'+i];
			title.stroke = '#000000';
			title.strokeThickness = 3;
			title.anchor.setTo(0.5, 0.5);
			group.add(title);

			this['descCoins_'+i] = global.setText1(global._t(dt[i].desc), back.x, back.y + back.height*0.01, 22, 0.5, 0.5, '#ffffff');
			var desc = this['descCoins_'+i];
			desc.align = 'center';
			desc.stroke = '#000000';
			desc.strokeThickness = 3;
			desc.anchor.setTo(0.5, 0.5);
			desc.lineSpacing = -10;
			desc.wordWrap = true;
			desc.wordWrapWidth = back.width*0.8;
			group.add(desc);

			var posUp = [back.x - back.width*0.36, back.x - back.width*0.18, back.x, back.x + back.width*0.18, back.x + back.width*0.36];
			for(var j=0;j<5;j++) {
				this['upCoins_'+i+'_'+j] = global.addSprite(posUp[j], back.y + back.height*0.23, 'upgrade/up_off');
				var up = this['upCoins_'+i+'_'+j];
				up.anchor.setTo(0.5, 0.5);
				group.add(up);
			}

			this['pnlCoins_'+i] = global.addSprite(back.x, back.y + back.height*0.4, 'upgrade/pnl_coin_on');
			var pnl = this['pnlCoins_'+i];
			pnl.anchor.setTo(0.5, 0.5);
			pnl.idx = i;
			group.add(pnl);
			pnl.inputEnabled = true;
			pnl.events.onInputUp.add(this.onPnlClick, this);

			var lv = DataPlayer.upgradeLv[i];
			if(lv >= 0)
				continue;

			// this['gUnlock_'+i] = game.add.group();
			// var gu = this['gUnlock_'+i];
			// group.add(gu);
			var price = Data.unlockPrice[i];

			this['btnUnlock_'+i] = global.addSprite(back.x, back.y + back.height*0.3, 'upgrade/btn_unlock');
			var btn = this['btnUnlock_'+i];
			btn.anchor.setTo(0.5, 0.5);
			btn.scale.setTo(0.95, 0.95);
			btn.price = price;
			btn.idx = i;
			group.add(btn);
			btn.inputEnabled = true;
			btn.events.onInputUp.add(this.onUnlockClick, this);

			this['pnlUnlockCoins_'+i] = global.addSprite(back.x, back.y + back.height*0.4, 'upgrade/pnl_coin_on');
			var pu = this['pnlUnlockCoins_'+i];
			pu.anchor.setTo(0.5, 0.5);
			pu.idx = i;
			group.add(pu);

			this['gembok_'+i] = global.addSprite(btn.x - btn.width*0.3, btn.y - btn.height*0.3, 'upgrade/gembok');
			var gb = this['gembok_'+i];
			gb.anchor.setTo(0.5, 0.5);
			group.add(gb);

			this['txtUnlockCoins_'+i] = global.setText1(global._t('unlock'), btn.x, btn.y - btn.height*0.1, 38, 0.5, 0.5, '#ffffff');
			var t = this['txtUnlockCoins_'+i];
			t.stroke = '#000000';
			t.strokeThickness = 3;
			// t.lineSpacing = -20;
			group.add(t);

			this['txtPriceUnlockCoins_'+i] = global.setText2(price, pu.x + pu.width*0.45, pu.y, 26, 1, 0.45, '#ffffff');
			var tuc = this['txtPriceUnlockCoins_'+i];
			tuc.stroke = '#000000';
			tuc.strokeThickness = 3;
			group.add(tuc);
		}

		this.checkUpgradeCoins(1);
		this.checkUnlockCoins();
	},

	onUnlockClick: function(obj)
	{
		if(DataPlayer.coins < obj.price)
			return;


		DataPlayer.coins -= obj.price;
		var idx = obj.idx;
		DataPlayer.upgradeLv[idx]++;
		this['pnlUnlockCoins_'+idx].destroy();
		this['pnlUnlockCoins_'+idx] = null;
		this['gembok_'+idx].destroy();
		this['gembok_'+idx] = null;
		this['txtUnlockCoins_'+idx].destroy();
		this['txtUnlockCoins_'+idx] = null;
		this['txtPriceUnlockCoins_'+idx].destroy();
		this['txtPriceUnlockCoins_'+idx] = null;
		obj.destroy();
		obj = null;
		this.genTxtCoins();
		this.checkUpgradeCoins();
		this.checkUnlockCoins();
		Data.save();
	},

	checkUnlockCoins: function()
	{
		for(var i=1;i<3;i++) {
			var ref = this['pnlUnlockCoins_'+i];
			if(ref == null)
				continue;
			if(DataPlayer.coins < Data.unlockPrice[i]) {
				ref.frameName = 'upgrade/pnl_coin_off';
			}
			else {
				ref.frameName = 'upgrade/pnl_coin_on';
			}
		}
	},

	onPnlClick: function(obj)
	{
		if(!obj.price || DataPlayer.coins < obj.price || this.isRoulette || this.isTween)
			return;

		csound.click();
		csound.skill();
		DataPlayer.coins -= obj.price;
		DataPlayer.upgradeLv[obj.idx]++;
		
		if(DataPlayer.upgradeLv[obj.idx] >= 5) {
			this.checkAchievementCoins(obj.idx);
		}

		this.genTxtCoins();
		this.checkUpgradeCoins();
		this.checkUnlockCoins();
		Data.save();
	},

	checkAchievementCoins: function(idx)
	{
		var _i
		if(idx == 0)
			_i = 9;
		else if(idx == 1)
			_i = 10;
		else
			_i = 11;

		var ach = false;
		ach = Data.checkAchievement(_i);
		if(ach) {
			trace("ACHIEVEMENT "+_i);
			this.genAchievement(_i);
		}
	},

	genTxtPriceUpgrade: function(idx, status)
	{
		// status = status || 0;
		// trace("STATUS >>>", status);
		var txt = Data.upgradePrice[idx][DataPlayer.upgradeLv[idx]];
		// if(status == 1) {
		if(this['txtPriceCoins_'+idx] == null) {
			var ref = this['pnlCoins_'+idx];
			this['txtPriceCoins_'+idx] = global.setText2(txt, ref.x + ref.width*0.45, ref.y, 28, 1, 0.5, '#ffffff');
			var price = this['txtPriceCoins_'+idx];
			price.stroke = '#000000';
			price.strokeThickness = 3;
			this.gCoins.add(price);
		}
		else {
			this['txtPriceCoins_'+idx].setText(txt);
		}
	},

	checkUpgradeCoins: function(tipe)
	{
		tipe = tipe || 0;

		for(var i=0;i<3;i++) {
			var lv = DataPlayer.upgradeLv[i];
			if(lv < 0)
				continue;

			for(var j=0;j<5;j++) {
				var stLv;
				if(j < lv) {
					stLv = 'upgrade/up_on';
				}
				else {
					stLv = 'upgrade/up_off';	
				}
				this['upCoins_'+i+'_'+j].frameName = stLv;
			}

			var str = 'upgrade/pnl_coin_on';
			var price = Data.upgradePrice[i][lv];
			if(DataPlayer.coins < price || lv >= 5) {
				str = 'upgrade/pnl_coin_off';
			}
			
			this['pnlCoins_'+i].frameName = str;
			this['pnlCoins_'+i].price = price;

			if(lv < 5) {
				// this.genTxtPriceUpgrade(i, tipe);
				this.genTxtPriceUpgrade(i);
			}
			else {
				if(this['txtPriceCoins_'+i] != null) {
					this['txtPriceCoins_'+i].destroy();
					this['txtPriceCoins_'+i] = null;
				}
				var ref = this['pnlCoins_'+i];
				this['txtPriceCoins_'+i] = global.addSprite(ref.x, ref.y, 'upgrade/max');
				this['txtPriceCoins_'+i].anchor.setTo(0.5, 0.5);
				this.gCoins.add(this['txtPriceCoins_'+i]);
			}
		}
	},

	genTxtCoins: function()
	{
		var txt = DataPlayer.coins;
		if(this.txtCoins == null) {
			this.txtCoins = global.setText2(txt, this.pnlCoins.x + this.pnlCoins.width*0.95, this.pnlCoins.y, 26, 1, 0.45, '#ffffff');
			this.txtCoins.stroke = '#000000';
			this.txtCoins.strokeThickness = 3;
			this.gCont.add(this.txtCoins);
		}
		else
			this.txtCoins.setText(txt);
	},

	genTxtGems: function()
	{
		var txt = DataPlayer.gems;
		if(this.txtGems == null) {
			this.txtGems = global.setText2(txt, this.pnlGems.x + this.pnlGems.width*0.95, this.pnlGems.y, 26, 1, 0.45, '#ffffff');
			this.txtGems.stroke = '#000000';
			this.txtGems.strokeThickness = 3;
			this.gCont.add(this.txtGems);
		}
		else
			this.txtGems.setText(txt);
	},

	update: function()
	{
		BaseState.prototype.update.call(this);
		
		if(this.roulette != null) {
			this.roulette.update();
		}
	},
}, BaseState);