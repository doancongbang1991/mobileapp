Achievement = function(game, gw, gh, container)
{
	this.gw = gw;
	this.gh = gh;
	this.container = container;

	this.init();
};

Achievement.inherit({
	init: function()
	{
		this.isTween = false;
		this.idxVis = 0;

		this.pnl = global.addSprite(this.gw*0.5, this.gh*0.5, 'achievement/pnl');
		this.pnl.anchor.setTo(0.5, 0.5);
		this.container.add(this.pnl);

		this.title = global.addSprite(this.pnl.x, this.pnl.y - this.pnl.height*0.55, 'achievement/title');
		this.title.anchor.setTo(0.5, 0.5);
		this.container.add(this.title);

		var pos = [
			this.pnl.y - this.pnl.height*0.32, this.pnl.y - this.pnl.height*0.12, this.pnl.y + this.pnl.height*0.08, this.pnl.y + this.pnl.height*0.28
		];

		var idx = 0;
		for(var i=0;i<3;i++) {
			this['g_'+i] = game.add.group();
			var group = this['g_'+i];
			this.container.add(group);
			for(var j=0;j<4;j++) {
				var str = 'achievement/'+idx+'_off';
				if(DataPlayer.achievement[idx] == 1) {
					str = 'achievement/'+idx+'_on';
				}

				this['icon_'+idx] = global.addSprite(this.pnl.x - this.pnl.width*0.15, pos[j], str);
				var icon = this['icon_'+idx];
				icon.anchor.setTo(0.5, 0.5);
				group.add(icon);

				var txt = global._t('ach_desc_'+idx);
				this['desc_'+idx] = global.setText1(txt, icon.x + icon.width*0.6, icon.y, 32, 0, 0.5, '#000000');
				var desc = this['desc_'+idx];
				desc.stroke = '#ffffff';
				desc.strokeThickness = 3;
				desc.lineSpacing = -10;
				desc.wordWrap = true;
				desc.wordWrapWidth = this.pnl.width*0.4;
				group.add(desc);

				idx++;
			}

			if(i > 0)
				group.visible = false;
		}

		this.btnHome = global.addButton(this.gw*0.5, this.gh*0.88, 'achievement/btn_home', this.onClick, this);
		this.btnHome.anchor.setTo(0.5, 0.5);
		this.container.add(this.btnHome);
		game.add.tween(this.btnHome.scale).to({x: 1.1, y: 1.1}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);

		this.btnPrev = global.addButton(this.gw*0.3, this.btnHome.y, 'global/btn_prev', this.onClick, this);
		this.btnPrev.anchor.setTo(0.5, 0.5);
		this.container.add(this.btnPrev);

		this.btnNext = global.addButton(this.gw*0.7, this.btnHome.y, 'global/btn_next', this.onClick, this);
		this.btnNext.anchor.setTo(0.5, 0.5);
		this.container.add(this.btnNext);
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
			if(obj == this.btnHome) {
				game.curstate.onCloseAchievement();
			}
			else {
				if(obj == this.btnPrev) {
					if(this.idxVis == 0)
						this.idxVis = 2;
					else
						this.idxVis--;	
				}
				else {
					if(this.idxVis == 2)
						this.idxVis = 0;
					else
						this.idxVis++;	
				}

				for(var i=0;i<3;i++) {
					if(i == this.idxVis) {
						this['g_'+i].visible = true;
					}
					else {
						this['g_'+i].visible = false;
					}
				}
			}
			this.isTween = false;
		}, this);
	},
});