Player = function(game, x, y)
{
	Phaser.Sprite.call(this, game, x, y, 'hero');
	this.frameName = 'hero/walk_00';
	this.anchor.setTo(0.5, 1);

	this.animations.add('walk', Phaser.Animation.generateFrameNames('hero/walk_', 0, 10, '', 2), 13, true);
	
	var animDie = this.animations.add('die', Phaser.Animation.generateFrameNames('hero/die_', 0, 9, '', 2), 18);
	animDie.onComplete.add(this.onDieComplete, this);

	var animHit1 = this.animations.add('hit1', Phaser.Animation.generateFrameNames('hero/hit1_', 0, 9, '', 2), 18);
	animHit1.onComplete.add(this.onHitComplete, this);
	
	var animHit2 = this.animations.add('hit2', Phaser.Animation.generateFrameNames('hero/hit2_', 0, 13, '', 2), 18);
	animHit2.onComplete.add(this.onHitComplete, this);
	
	var animDash = this.animations.add('dash', Phaser.Animation.generateFrameNames('hero/dash_', 0, 12, '', 2), 18);
	animDash.onComplete.add(this.onDashComplete, this);
	
	this.data = {
		distance: 100,
		speed: 0.5,
		// speed: 2,
		ctrHit: 90,
		ctrDecrease: 180,
		decMP: 2,
		decStamina: 5,
		decAttack: 5,
		decDefend: 2,
		spcPrice: [50, 50, 50],		// dash, shield, berserk
		spcCtr: [300, 300, 300],
		ctrShieldOn: 300,			// 5 detik
		ctrBerserkOn: 300,			// 5 detik
		addCtrShield: 180,			// 3 detik
		addCtrBerserk: 180,			// 3 detik
		berserkPower: 0.5,
		dashPower: 0.5,
	};

	this.init();
};

Player.inherit({
	init: function()
	{
		this.setDefault();

		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.setSize(this.width*0.2, this.height*0.5, this.width*0.1, -this.height*0.18);
		// this.setWalk();
		// this.setDash();
	},

	setDefault: function()
	{
		this.addCtrShield = DataPlayer.upgradeLv[1]*this.data.addCtrShield;
		this.addCtrBerserk = DataPlayer.upgradeLv[2]*this.data.addCtrBerserk;
		this.data.ctrShieldOn += this.addCtrShield;
		this.data.ctrBerserkOn += this.addCtrBerserk;

		this.dashPower = this.data.dashPower;
		this.addDashPower = DataPlayer.upgradeLv[0]*0.2;
		this.dashPower += this.addDashPower;
		this.berserkPower = this.data.berserkPower;
		this.addBerserkPower = DataPlayer.upgradeLv[2]*0.2;
		this.berserkPower += this.addBerserkPower;

		this.isDie = false;
		this.distance = this.data.distance;
		this.speed = this.data.speed;
		this.ctrHit = this.data.ctrHit;
		this.ctrDecrease = this.data.ctrDecrease;
		this.isHit = false;
		this.isWalk = false;
		this.isDash = false;
		this.isShield = false;
		this.isBerserk = false;
		this.isAfterDash = false;
		this.isAfterShield = false;
		this.isAfterBerserk = false;
		this.ctrDash = this.data.spcCtr[0];
		this.ctrShield = this.data.spcCtr[1];
		this.ctrBerserk = this.data.spcCtr[2];
		this.ctrShieldOn = this.data.ctrShieldOn;
		this.ctrBerserkOn = this.data.ctrBerserkOn;

		this.hp = DataPlayer.skill[0];
		this.stamina = DataPlayer.skill[1];
		this.attack = DataPlayer.skill[2];
		
		if(game.curstate.stage >= 2) {
			this.defend = DataPlayer.skill[3];
		}
		else {
			this.defend = 0;
		}

		if(game.curstate.stage >= 3) {
			this.mp = DataPlayer.skill[4];		
		}
		else {
			this.mp = 0;
		}

		this.minAttack = DataPlayer.skill[2];

		this.target = [];
	},

	setRevive: function()
	{
		var atk = this.attack;
		var stamina = this.stamina;
		var defend = this.defend;
		var mp = this.mp;
		this.setDefault();
		if (this.attack < atk) this.attack = atk;
		if (this.stamina < stamina) this.stamina = stamina;
		if (this.defend < defend) this.defend = defend;
		if (this.mp < mp) this.mp = mp;

		game.curstate.genTxtHP();
		game.curstate.genTxtMP();
		game.curstate.genTxtStamina();
		game.curstate.genTxtAttack();
		game.curstate.genTxtDefend();
	},

	setWalk: function()
	{
		if(this.animations.paused)
			this.animations.paused = false;
		this.isWalk = true;
		this.animations.play('walk');
	},

	setHit: function()
	{
		if(this.stamina <= 0) {
			this.animations.paused = true;
			return;
		}
		if(this.animations.paused)
			this.animations.paused = false;
		var ran = game.rnd.integerInRange(1, 2);
		this.animations.play('hit'+ran);
	},

	getHit: function(hitPoints)
	{
		if(this.isShield) {
			return;
		}

		// if(this.isBerserk) {
		// 	hitPoints += Math.floor(hitPoints*this.berserkPower);
		// }

		var val = Math.floor(hitPoints / 2);
		var txtDefend = 0;
		var txtHP = 0;
		if(this.defend > val) {
			txtHP = val;
			txtDefend = val;
			this.defend -= val;
			this.hp -= val;
		}
		else {
			var sisa = val - this.defend;
			txtDefend = this.defend;
			this.defend = 0;
			this.hp -= val + sisa;
			txtHP = val + sisa;
		}

		// this.hp -= hitPoints;
		// var txt = hitPoints;
		if(this.hp <= txtHP) {
			this.hp = 0;
			txtHP = this.hp;
		}

		// trace("PLAYER HITPOINTS", hitPoints, this.hp);
		if(txtHP > 0) {
			game.curstate.genTxtItemValue(0, -txtHP);
		}
		if(txtDefend > 0) {
			game.curstate.genTxtItemValue(3, -txtDefend);
		}
		game.curstate.genTxtHP();
		game.curstate.genTxtDefend();
		if(this.hp <= 0) {
			this.setDie();
		}
	},

	onHitComplete: function()
	{
		this.decreaseStamina();
		this.decreaseAttack();
		csound.sword();
		var val = Math.ceil(this.attack / this.target.length);
		if(this.isDash)
			val += Math.ceil(val*this.dashPower);
		if(this.isBerserk)
			val += Math.ceil(val*this.berserkPower);
		for(var i=0;i<this.target.length;i++) {
			if(this.target[i] != null) {
				this.target[i].getHit(val);
				// trace("HIT TARGET >>>", i);
				if(this.target[i].hp <= 0) {
					this.target[i] = null;
				}
			}
		}
		this.isHit = false;
		this.target = [];
	},

	setDie: function()
	{
		if(this.animations.paused)
			this.animations.paused = false;
		this.isDie = true;
		this.animations.play('die');
	},

	onDieComplete: function()
	{
		game.curstate.genResult(2);
	},

	checkDistance: function()
	{
		for(var i=0;i<game.curstate.arEnemy.length;i++) {
			
			if(game.physics.arcade.distanceBetween(this, game.curstate.arEnemy[i]) < this.distance) {
				if(this.target.indexOf(game.curstate.arEnemy[i]) >= 0) {
					game.curstate.arEnemy[i].isMove = false;
					continue;
				}
				
				this.target.push(game.curstate.arEnemy[i]);
				return true;
			}
		}

		return false;
	},

	decreaseMP: function()
	{
		if(this.mp > 0) {
			this.mp -= this.data.decMP;
			var val = this.data.decMP;
			if(this.mp < 0) {
				this.mp = 0;
				val = this.data.decMP - this.mp;
			}
			game.curstate.genTxtItemValue(4, -val);
			game.curstate.genTxtMP();
			game.curstate.setDashOn();
			game.curstate.setShieldOn();
			game.curstate.setBerserkOn();
		}
	},

	decreaseStamina: function()
	{
		if(this.stamina > 0) {
			this.stamina -= this.data.decStamina;
			var val = this.data.decStamina;
			if(this.stamina < 0) {
				this.stamina = 0;
				val = this.data.decStamina - this.stamina;
			}
			game.curstate.genTxtItemValue(1, -val);
			game.curstate.genTxtStamina();
		}
	},

	decreaseAttack: function()
	{
		if(this.attack > this.minAttack) {
			this.attack -= this.data.decAttack;
			var val = this.data.decAttack;
			if(this.attack < this.minAttack) {
				this.attack = this.minAttack;
				val = this.data.decAttack - this.mp;
			}
			game.curstate.genTxtItemValue(2, -val);
			game.curstate.genTxtAttack();
		}
	},

	decreaseDefend: function()
	{
		if(this.defend > 0) {
			this.defend -= this.data.decDefend;
			var val = this.data.decDefend;
			if(this.defend < 0) {
				this.defend = 0;
				val = this.data.decDefend - this.decDefend;
			}
			game.curstate.genTxtItemValue(3, -val);
			game.curstate.genTxtDefend();
		}
	},

	setDash: function()
	{
		this.target = [];
		for(var i=0;i<game.curstate.arEnemy.length;i++) {
			this.target.push(game.curstate.arEnemy[i]);
		}
		this.mp -= this.data.spcPrice[0];
		game.curstate.genTxtItemValue(4, -this.data.spcPrice[0]);
		game.curstate.genTxtMP();
		this.isWalk = false;
		this.isDash = true;
		this.animations.play('dash');
	},

	onDashComplete: function()
	{
		this.isAfterDash = true;
		this.onHitComplete();
		this.isDash = false;
		this.target = [];
	},

	setShield: function()
	{
		this.mp -= this.data.spcPrice[1];
		game.curstate.genTxtItemValue(4, -this.data.spcPrice[1]);
		game.curstate.genTxtMP();
		this.isShield = true;
	},

	setBerserk: function()
	{
		this.mp -= this.data.spcPrice[2];
		game.curstate.genTxtItemValue(4, -this.data.spcPrice[2]);
		game.curstate.genTxtMP();
		this.isBerserk = true;
	},

	update: function()
	{
		// return;
		if(this.isDie || game.curstate.isPause || game.curstate.isOver || this.isDash || game.curstate.isTutor)
			return;

		if(this.isWalk) {
			game.curstate.setBGMove(this.speed);
		}

		if(this.ctrDecrease > 0) {
			this.ctrDecrease--;
		}
		if(this.ctrDecrease <= 0) {
			// this.decreaseMP();
			// this.decreaseStamina();
			// this.decreaseAttack();
			// this.decreaseDefend();
			this.ctrDecrease = this.data.ctrDecrease;
		}

		if(this.isShield) {
			if(this.ctrShieldOn > 0)
				this.ctrShieldOn--;
			if(this.ctrShieldOn <= 0) {
				game.curstate.setAnimShieldOff();
				this.isAfterShield = true;
				this.ctrShieldOn = this.data.ctrShieldOn;
				this.isShield = false;
			}
		}

		if(this.isAfterShield) {
			if(this.ctrShield > 0)
				this.ctrShield--;
			if(this.ctrShield <= 0) {
				this.isAfterShield = false;
				game.curstate.setShieldOn();
				this.ctrShield = this.data.spcCtr[1];
			}
		}

		if(this.isBerserk) {
			if(this.ctrBerserkOn > 0)
				this.ctrBerserkOn--;
			if(this.ctrBerserkOn <= 0) {
				game.curstate.setAnimBerserkOff();
				this.isAfterBerserk = true;
				this.ctrBerserkOn = this.data.ctrBerserkOn;
				this.isBerserk = false;
			}
		}

		if(this.isAfterBerserk) {
			if(this.ctrBerserk > 0)
				this.ctrBerserk--;
			if(this.ctrBerserk <= 0) {
				this.isAfterBerserk = false;
				game.curstate.setBerserkOn();
				this.ctrBerserk = this.data.spcCtr[2];
			}
		}

		if(this.isDash) {
			return;
		}

		if(this.isAfterDash) {
			if(this.ctrDash > 0)
				this.ctrDash--;
			if(this.ctrDash <= 0) {
				this.isAfterDash = false;
				game.curstate.setDashOn();
				this.ctrDash = this.data.spcCtr[0];
			}
		}

		if(this.isHit) {
			if(this.ctrHit > 0)
				this.ctrHit--;
			// if(this.stamina > 0) {
				if(this.ctrHit <= 0) {
					this.setHit();
					this.ctrHit = this.data.ctrHit;
				}
				this.checkDistance();
				return;
			// }
		}

		if(this.checkDistance()) {
			this.isHit = true;
			this.isWalk = false;
			this.setHit();
			return;
		}
		else {
			if(!this.isWalk) {
				this.setWalk();			
			}
		}
	},
}, Phaser.Sprite);