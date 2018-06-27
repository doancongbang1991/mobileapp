Enemy1 = function(game, x, y)
{
	// jarak jauh
	Phaser.Sprite.call(this, game, x, y, 'enemy_1');
	this.anchor.setTo(0.5, 1);
	this.frameName = 'enemy_1/walk_00';

	this.animations.add('walk', Phaser.Animation.generateFrameNames('enemy_1/walk_', 0, 10, '', 2), 13, true);
	
	var animDie = this.animations.add('die', Phaser.Animation.generateFrameNames('enemy_1/die_', 0, 12, '', 2), 18);
	animDie.onComplete.add(this.setDestroy, this);

	var animHit = this.animations.add('hit', Phaser.Animation.generateFrameNames('enemy_1/hit_', 0, 10, '', 2), 15);
	this.animations.currentAnim.enableUpdate = true;
	this.animations.currentAnim.onUpdate.add(this.onHitComplete, this);
	// animHit.onComplete.add(this.onHitComplete, this);

	this.data = DataEnemy[0];

	this.init();
};

Enemy1.inherit({
	init: function()
	{
		this.isMove = true;
		this.id = this.data.id;
		this.hp = this.data.hp;
		this.hit = this.data.hit;
		this.ctrHit = this.data.ctrHit;
		this.distance = this.data.distance;
		this.speed = this.data.speed;
		this.value = this.data.value;

		this.isStop = false;
		this.isHit = false;
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.setSize(this.width*0.2, this.height*0.5, -this.width*0.15, -this.height*0.18);
		this.setWalk();
	},

	setWalk: function()
	{
		this.animations.play('walk');
	},

	setHit: function()
	{
		this.animations.play('hit');
	},

	getHit: function(hitPoints)
	{
		var txt = hitPoints;
		if(this.hp <= hitPoints) {
			// txt = this.hp;
			this.hp = 0;
		}
		else {
			this.hp -= hitPoints;
		}

		var delay = game.rnd.integerInRange(0, 2);
		game.time.events.add(Phaser.Timer.SECOND*(delay*0.1), function() {
			game.curstate.genTxtEnemyHP(txt, this.x, this.y - this.height*0.6);
		}, this);
		if(this.hp <= 0) {
			this.setDie();
		}
	},

	onHitComplete: function()
	{
		if(this.animations.currentFrame.index == 18) {
			game.curstate.genEnemyWeapon(this.x - this.width*0.15, this.y - this.height*0.4, this.id, this.hit);		
		}
	},

	checkAchievement: function()
	{
		// check achievement
		DataPlayer.totalKill++;
		// trace("TOTAL KILL >>>", DataPlayer.totalKill);
		var total = DataPlayer.totalKill;
		if(total == 10) {
		// if(total == 1) {		// hack
			var ach = false;
			ach = Data.checkAchievement(0);
			if(ach) {
				// trace("ACHIEVEMENT 0");
				game.curstate.genAchievement(0);
			}
		}
		else if(total == 50) {
			var ach = false;
			ach = Data.checkAchievement(3);
			if(ach) {
				// trace("ACHIEVEMENT 3");
				game.curstate.genAchievement(3);
			}
		}
		else if(total == 100) {
			var ach = false;
			ach = Data.checkAchievement(6);
			if(ach) {
				// trace("ACHIEVEMENT 6");
				game.curstate.genAchievement(6);
			}
		}
		// end check achievement
	},

	setDie: function()
	{
		this.checkAchievement();
		this.isStop = true;
		var idx = game.curstate.arEnemy.indexOf(this);
		game.curstate.arEnemy.splice(idx, 1);
		this.animations.play('die');
	},

	setDestroy: function()
	{
		csound.enemyDie();
		game.curstate.genCoinsEnemy(this.value, this.x, this.y - this.height*0.3);
		game.curstate.checkResult();
		this.destroy();
	},

	checkDistance: function()
	{
		if(game.physics.arcade.distanceBetween(this, game.curstate.player) < this.data.distance) {
			return true;
		}

		return false;
	},

	update: function()
	{
		if(this.isStop || game.curstate.player.isDie || game.curstate.isPause || game.curstate.isOver || game.curstate.isTutor)
			return;

		if(this.body.x < 0)
			return;



		if(this.isHit) {
			if(this.ctrHit > 0)
				this.ctrHit--;
			if(this.ctrHit <= 0) {
				this.setHit();
				this.ctrHit = this.data.ctrHit;
			}
			if(game.curstate.player.isWalk) {
				this.body.x -= game.curstate.player.speed;
			}
			return;
		}

		if(this.checkDistance()) {
			this.setHit();
			this.isHit = true;
			return;
		}

		if(this.isMove) {
			this.body.x -= this.speed;
		}
		
		// this.rect.x = this.x - this.width*0.23;
	},
}, Phaser.Sprite);