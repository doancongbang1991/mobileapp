cgame = function(game)
{
};

cgame.inherit({
	preload: function()
	{
		BaseState.prototype.preload.call(this);
		Asset.png('bg_puzzle');
		
		this.stage = DataPlayer.stage;
		if(this.stage <= 10)
			Asset.png('bg_game_1');
		else if(this.stage <= 20)
			Asset.png('bg_game_2');
		else
			Asset.png('bg_game_3');

		Asset.atlaspng('game');
		Asset.atlaspng('game_big');
		Asset.atlaspng('puz_jadi');
		Asset.atlaspng('hero');
		Asset.atlaspng('sp_hero');
		Asset.atlaspng('enemy_1');
		Asset.atlaspng('enemy_2');
		Asset.atlaspng('enemy_3');
		Asset.atlaspng('enemy_4');
		Asset.atlaspng('enemy_5');
		Asset.atlaspng('enemy_6');
		Asset.atlaspng('enemy_7');
		Asset.atlaspng('enemy_8');
		Asset.atlaspng('enemy_9');
		Asset.atlaspng('enemy_10');
		Asset.atlaspng('enemy_11');
		Asset.atlaspng('enemy_12');
		Asset.atlaspng('weapon');
		Asset.atlaspng('dialog');
		Asset.atlaspng('revive');
	},

	create: function()
	{
		this.name = "cgame";
		game.physics.startSystem(Phaser.Physics.ARCADE);
		BaseState.prototype.create.call(this);
		game.curstate = this;

		Branding.levelStarted(this.stage);
		
		if(this.stage <= 5) {
			this.maxPuzzle = Data.maxPuzzle[0];
		}
		else if(this.stage <= 10) {
			this.maxPuzzle = Data.maxPuzzle[1];
		}
		else {
			this.maxPuzzle = Data.maxPuzzle[2];	
		}

		this.btnDash = null;
		this.btnShield = null;
		this.btnBerserk = null;
		
		this.ctrCheck = 0;
		this.maxCtrChPuz = 300;								// max ctr check puzzle
		this.ctrChPuz = this.maxCtrChPuz;					// check puzzle;

		this.isSpcClicked = false;							// flag special diklik atau tidak
		this.isShuffle = false;								// flag shuffle
		this.isPause = false;								// flag pause
		this.isOver = false;								// flag over
		this.isSelect = false;								// flag puzzle telah dipilih
		this.isClue = false;								// flag clue sedang dilakukan
		this.arPuzTween = [];								// array puzzle yg ditween sebagai clue

		this.arDtEnemy = DataSpawn[this.stage-1];			// array dt enemy yg dispawn
		if(this.arDtEnemy.length > 0) {
			for(var i=0;i<this.arDtEnemy.length;i++) {
				this.arDtEnemy[i].ctr = 0;
				this.arDtEnemy[i].jml = 0;
			}
		}

		this.arEnemy = [];									// array enemy
		this.arWeapon = [];									// array weapon
		this.txtCoins = null;
		this.txtGems = null;
		this.txtHP = null;
		this.txtMP = null;
		this.txtStamina = null;
		this.txtAttack = null;
		this.txtDefend = null;
		this.arBG = [];										// array bg atas
		this.arPuzSel = [];									// array puzzle selected
		this.arPuzMain = [];								// array puzzle main
		this.arPuzLink = [];								// array puzzle link
		this.arPuzEfek = [];								// array puzzle efek
		this.arPuzJadi = [];								// array puzzle jadi
		this.isPuzAwal = false;								// jika puzzle awal telah dipilih
		this.dtPuzAwal = {
			tipe: null,										// tipe puzzle awal
			i: null,										// index i puzzle awal
			j: null,										// index j puzzle awal
		};													// data puzzle awal yg telah dipilih

		this.arCheck = [];									// array check possible
		this.dtFirstCheck = {i: null, j: null};				// dt awal check possible
		this.dtLastCheck = {i: null, j: null};				// dt last check possible

		this.ctrPuzJadi = [0, 0, 0, 0, 0];
		
		this.dtPuzJadi = {
			l: 0,											// panjang puzzle yg jadi
			tipe: null,										// tipe puzzle yg jadi
		};
		this.tempCtrJadi = 0;								// data temporer panjang puzzle yg animasi jadi selesai
		this.tempAddValue = [0, 0, 0, 0, 0];				// array temporer untuk add value

		this.ctrPreAtur = 0;								// ctr pre atur puzzle
		this.ctrAtur = 0;									// ctr atur puzzle yg nanti dicocokkan dengan ctr atur
		this.isAtur = false;								// jika puzzle sedang diatur maka nilai true
		this.arChAnimItem = [0, 0, 0, 0, 0];				// untuk bantuan animasi nilai item tambah

		this.gBGAtas = game.add.group();
		this.gPuzzle = game.add.group();

		this.gCont.add(this.gBGAtas);
		this.gCont.add(this.gPuzzle);

		this.genBGAtas();

		this.bgPuzzle = game.add.sprite(this.gw*0.5, this.gh*0.33, 'bg_puzzle');
		this.bgPuzzle.anchor.setTo(0.5, 0);
		this.gPuzzle.add(this.bgPuzzle);

		this.gPuzSel = game.add.group();
		this.gPuzBack = game.add.group();
		this.gPuzLink = game.add.group();
		this.gPuzMain = game.add.group();
		this.gPuzEfek = game.add.group();
		this.gPuzzle.add(this.gPuzSel);
		this.gPuzzle.add(this.gPuzBack);
		this.gPuzzle.add(this.gPuzLink);
		this.gPuzzle.add(this.gPuzMain);
		this.gPuzzle.add(this.gPuzEfek);

		this.txtShuffle = global.setText1(global._t('shuffle'), this.gw*0.5, this.gh*0.6, 90, 0.5, 0.5, '#FFFF00');
		this.txtShuffle.stroke = '#003399';
		this.txtShuffle.strokeThickness = 10;
		this.gPuzzle.add(this.txtShuffle);
		this.txtShuffle.visible = false;
		this.txtShuffle.scale.setTo(0, 0);

		this.gPlayer = game.add.group();
		this.gEnemy = game.add.group();
		this.gTxtChar = game.add.group();
		this.gWeapon = game.add.group();
		this.gItem = game.add.group();
		this.gAnimPlayer = game.add.group();
		this.gAnimItem = game.add.group();
		this.gUI = game.add.group();
		this.gCont.add(this.gPlayer);
		this.gCont.add(this.gEnemy);
		this.gCont.add(this.gTxtChar);
		this.gCont.add(this.gWeapon);
		this.gCont.add(this.gItem);
		this.gCont.add(this.gAnimPlayer);
		this.gCont.add(this.gAnimItem);
		this.gCont.add(this.gUI);

		this.initPuzzle();

		this.player = new Player(game, this.gw*0.2, this.gh*0.37)
		this.gPlayer.add(this.player);

		this.genPlayerAnim();

		this.minHP = this.player.hp;
		this.minMP = this.player.mp;
		this.minStamina = this.player.stamina;
		this.minAttack = this.player.attack;
		this.minDefend = this.player.defend;

		this.genUI();

		// this.genEnemy();
		// game.time.events.add(Phaser.Timer.SECOND*2, this.genEnemy, this);

		this.gPause = game.add.group();
		this.gResult = game.add.group();
		this.gFG.add(this.gPause);
		this.gFG.add(this.gResult);

		this.pause = new Pause(game, this.gw, this.gh, this.gPause);
		this.gPause.visible = false;
		// this.isPause = true;

		this.gResult.visible = false;

		// this.isOver = true;
		// this.genResult(1);

		// trace("gCont SCALE >>>", this.gCont.scale.x, this.gCont.scale.y);

		// trace("STAGE >>>", this.stage);
		// this.checkAchievement();
		this.isTutorSpecial = false;		// flag tutor untuk special item
		this.isTutorHorVert = false;		// flag tutor untuk horvert
		this.isTutorGems = false;			// flag tutor untuk gems

		if(this.stage == 1) {
			this.isTutor = DataPlayer.isTutorGame;
		}
		else if(this.stage == 2) {
			this.isTutor = DataPlayer.isTutorArmor;
		}
		else if(this.stage == 3) {
			this.isTutor = DataPlayer.isTutorMP;
		}
		if(this.stage == 4) {
			this.isTutor = DataPlayer.isTutorBubble;
		}
		this.txtAny = null;
		this.txtTutor = null;
		this.tutorNext = null;
		this.tweenTutor = [];
		this.imgTutor = [];
		if(this.isTutor) {
			this.genTutor();
		}

		if(this.btnDash != null) {
			this.setDashOn();		
		}
		if(this.btnShield != null) {
			this.setShieldOn();
		}
		if(this.btnBerserk != null) {
			this.setBerserkOn();		
		}
		
		this.onResize();

		// this.isPause = true;
		// this.genResult(1);
		// game.time.events.add(Phaser.Timer.SECOND*5, function() {
		// 	this.genResult(1);
		// }, this);

		// console.log(Phaser.Keyboard.A);
	},

	genTutor: function()
	{
		// if(Phaser.Device.desktop)
		// 	this.maxTutor = 9;
		// else
		// 	this.maxTutor = 8;
		this.tutorStep = 1;
		this.isTutor = true;
		if(this.stage == 1) {
			this.maxTutor = 5;
		}
		else if(this.stage == 2) {
			this.maxTutor = 1;
		}
		else if(this.stage == 3) {
			if(Phaser.Device.desktop)
				this.maxTutor = 4;
			else
				this.maxTutor = 3;
		}
		else if(this.stage == 4) {
			this.maxTutor = 1;
		}

		this.tutorStep = 1;
		this.gTutor = game.add.group();
		this.g0.add(this.gTutor);

		this.puzBubble = null;

		// this.pnlTutor = global.addSprite(this.gw*0.5, this.gh*0.5, 'game_big/pnl_tutor');
		this.pnlTutor = global.addSprite(this.gw*0.5, 0, 'game_big/pnl_tutor');
		// this.pnlTutor = global.addSprite(this.gw*0.5, this.gh*0.5, 'dialog/pnl_dialog');
		this.pnlTutor.anchor.setTo(0.5, 0.5);
		this.pnlTutor.scale.setTo(1.3, 1.3);
		this.pnlTutor.y -= this.pnlTutor.height*0.5;
		this.gTutor.add(this.pnlTutor);
		this.setPivot(this.gTutor, this.pnlTutor);

		this.layerTutor = game.add.sprite(0, 0, null);
		this.layerTutor.width = this.gw;
		this.layerTutor.height = this.gh;
		this.gPol.add(this.layerTutor);
		this.layerTutor.inputEnabled = true;
		this.layerTutor.events.onInputUp.add(this.onTutorClick, this);

		if(!this.isTutorSpecial) {
			if(this.stage == 1) {
				this.genTxtTutor();
				game.add.tween(this.gTutor).to({y: this.gh*0.5}, 500, Phaser.Easing.Sinusoidal.In, true);
			}
			else if(this.stage == 2) {
				this.genTutorArmor();
				game.add.tween(this.gTutor).to({y: this.gh*0.6}, 500, Phaser.Easing.Sinusoidal.In, true);
			}
			else if(this.stage == 3) {
				this.genTutorMP();
				game.add.tween(this.gTutor).to({y: this.gh*0.6}, 500, Phaser.Easing.Sinusoidal.In, true);
			}
			else if(this.stage == 4) {
				this.genTutorBubble();
				game.add.tween(this.gTutor).to({y: this.gh*0.5}, 500, Phaser.Easing.Sinusoidal.In, true);
			}
		}
		else {
			this.player.animations.paused = true;
			for(var i=0;i<this.arEnemy.length;i++) {
				this.arEnemy[i].animations.paused = true;
			}

			if(this.isTutorHorVert) {
				// this.genTutorHorVert();
				// game.add.tween(this.gTutor).to({y: this.gh*0.5}, 500, Phaser.Easing.Sinusoidal.In, true);
			}
			else if(this.isTutorGems) {
				this.genTutorGems();
				game.add.tween(this.gTutor).to({y: this.gh*0.5}, 500, Phaser.Easing.Sinusoidal.In, true);
			}
		}
	},

	onTutorClick: function()
	{
		csound.click();
		this.tutorStep++;
		if(!this.isTutorSpecial) {
			if(this.stage == 1) {
				this.genTxtTutor();
			}
			else if(this.stage == 2) {
				this.genTutorArmor();
			}
			else if(this.stage == 3) {
				this.genTutorMP();
			}
			else if(this.stage == 4) {
				this.genTutorBubble();
			}
		}
		else {
			if(this.isTutorHorVert) {
				// this.genTutorHorVert();
			}
			else if(this.isTutorGems) {
				this.genTutorGems();
			}
		}
	},

	setTxtTutor: function(txt)
	{
		if(this.txtTutor == null) {
			this.txtTutor = global.setText1(txt, this.pnlTutor.x, this.pnlTutor.y, 32, 0.5, 0.5, '#FF6600');
			this.txtTutor.stroke = '#EEE';
			this.txtTutor.strokeThickness = 5;
			this.txtTutor.align = 'center';
			this.txtTutor.lineSpacing = -10;
			this.txtTutor.wordWrap = true;
			this.txtTutor.wordWrapWidth = this.pnlTutor.width*0.8;
			this.gTutor.add(this.txtTutor);
		}
		else {
			this.txtTutor.setText(txt);
		}

		// if(this.txtAny == null) {
		// 	this.txtAny = global.setText2(global._t('tap_any'), this.pnlTutor.x, this.pnlTutor.y + this.pnlTutor.height*0.4, 20, 0.5, 0.5, '#ffffff');
		// 	this.txtAny.stroke = '#000000';
		// 	this.txtAny.strokeThickness = 3;
		// 	this.gTutor.add(this.txtAny);
		// }

		if (this.tutorNext == null) {
			this.tutorNext = global.addButton(this.gw*0.85, this.gh*0.8, 'global/btn_next', this.onTutorClick, this);
			this.tutorNext.scale.setTo(1.1);
			this.tutorNext.anchor.setTo(0.5);
			this.gTutor.add(this.tutorNext);
		}
	},

	setTutorFinish: function()
	{
		if (game.tweens.isTweening(this.gTutor)) return;
		var tween = game.add.tween(this.gTutor).to({y: -150}, 350, Phaser.Easing.Sinusoidal.Out, true);
		tween.onComplete.add(function() {
			this.txtTutor.destroy();
			this.txtTutor = null;
			// this.txtAny.destroy();
			// this.txtAny = null;
			this.pnlTutor.destroy();
			this.pnlTutor = null;
			this.isTutor = false;
			this.layerTutor.destroy();
			this.layerTutor = null;
			this.tutorNext.destroy();
			this.tutorNext = null;
		}, this);
	},

	setTutorImageClear: function()
	{
		if(this.imgTutor.length > 0) {
			for(var i=0;i<this.imgTutor.length;i++) {
				this.imgTutor[i].destroy();
			}
			this.imgTutor = [];
		}
	},

	setTutorTweenClear: function()
	{
		if(this.tweenTutor.length > 0) {
			for(var i=0;i<this.tweenTutor.length;i++) {
				this.tweenTutor[i].stop();
				this.tweenTutor[i] = null;
			}
			this.tweenTutor = [];
		}
	},

	genTutorBubble: function()
	{
		this.setTutorImageClear();
		this.setTutorTweenClear();

		if(this.tutorStep > this.maxTutor) {
			this.setTutorFinish();
			DataPlayer.isTutorBubble = false;
			Data.save();
			return;
		}

		var txt = global._t('tutor_bub');
		this.setTxtTutor(txt);

		this.txtTutor.y = this.pnlTutor.y - this.pnlTutor.height*0.2;
		var img = global.addSprite(this.pnlTutor.x, this.pnlTutor.y + this.pnlTutor.height*0.35, 'game_big/puz_bubble');
		img.anchor.setTo(0.5, 1);
		this.imgTutor.push(img);
		this.gTutor.add(img);
	},

	genTutorArmor: function()
	{
		this.setTutorImageClear();
		this.setTutorTweenClear();

		if(this.tutorStep > this.maxTutor) {
			this.item_3.scale.setTo(1, 1);
			this.setTutorFinish();
			DataPlayer.isTutorArmor = false;
			Data.save();
			return;
		}

		var txt = global._t('tutor_armor');
		this.setTxtTutor(txt);

		this.txtTutor.fontSize = 28;
		// this.gTutor.y = this.gh*0.6;

		this.txtTutor.y = this.pnlTutor.y - this.pnlTutor.height*0.2;
		var img = global.addSprite(this.pnlTutor.x, this.pnlTutor.y + this.pnlTutor.height*0.35, 'game_big/puz_3');
		img.anchor.setTo(0.5, 1);
		this.imgTutor.push(img);
		this.gTutor.add(img);

		var tween = game.add.tween(this.item_3.scale).to({x: 1.05, y: 1.05}, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
		this.tweenTutor.push(tween);
	},

	genTutorMP: function()
	{
		this.setTutorImageClear();
		if(this.tutorStep != 3) {
			this.setTutorTweenClear();
		}

		if(this.tutorStep > this.maxTutor) {
			if(this.tutorStep == 4) {
				this.btnDash.scale.setTo(1, 1);
				this.item_4.scale.setTo(1, 1);
			}
			this.setTutorFinish();
			DataPlayer.isTutorMP = false;
			Data.save();
			return;
		}

		var txt = global._t('tutor_mp_'+this.tutorStep);
		this.setTxtTutor(txt);

		if(this.tutorStep == 1) {
			this.txtTutor.fontSize = 28;
			// this.gTutor.y = this.gh*0.6;

			this.txtTutor.y = this.pnlTutor.y - this.pnlTutor.height*0.2;
			var img = global.addSprite(this.pnlTutor.x, this.pnlTutor.y + this.pnlTutor.height*0.35, 'game_big/puz_4');
			img.anchor.setTo(0.5, 1);
			this.imgTutor.push(img);
			this.gTutor.add(img);

			var tween = game.add.tween(this.item_4.scale).to({x: 1.05, y: 1.05}, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
			this.tweenTutor.push(tween);
		}
		else if(this.tutorStep == 2) {
			this.item_4.scale.setTo(1, 1);
			this.txtTutor.fontSize = 32;
			this.txtTutor.y = this.pnlTutor.y;

			var tween = game.add.tween(this.btnDash.scale).to({x: 1.05, y: 1.05}, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
			this.tweenTutor.push(tween);
		}
		else if(this.tutorStep == 3) {
			var tween = game.add.tween(this.item_4.scale).to({x: 1.05, y: 1.05}, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
			this.tweenTutor.push(tween);
		}
	},

	genTutorGems: function()
	{
		this.setTutorImageClear();

		if(this.tutorStep > 1) {
			this.player.animations.paused = false;
			for(var i=0;i<this.arEnemy.length;i++) {
				this.arEnemy[i].animations.paused = false;
			}

			this.isTutorSpecial = false;
			this.isTutorGems = false;
			this.setTutorFinish();
			DataPlayer.isTutorGems = false;
			Data.save();
			return;
		}

		var txt = global._t('tutor_gm_'+this.tutorStep);
		this.setTxtTutor(txt);
		this.txtTutor.fontSize = 28;

		if(this.tutorStep == 1) {
			this.txtTutor.y = this.pnlTutor.y - this.pnlTutor.height*0.2;
			var img = global.addSprite(this.pnlTutor.x, this.pnlTutor.y + this.pnlTutor.height*0.35, 'game_big/puz_gems');
			img.anchor.setTo(0.5, 1);
			this.imgTutor.push(img);
			this.gTutor.add(img);
		}
	},

	genTutorHorVert: function()
	{
		this.setTutorImageClear();

		if(this.tutorStep > 3) {
			this.player.animations.paused = false;
			for(var i=0;i<this.arEnemy.length;i++) {
				this.arEnemy[i].animations.paused = false;
			}

			this.isTutorSpecial = false;
			this.isTutorHorVert = false;
			this.setTutorFinish();
			DataPlayer.isTutorHorVert = false;
			Data.save();
			return;
		}

		var txt = global._t('tutor_hv_'+this.tutorStep);
		this.setTxtTutor(txt);
		this.txtTutor.fontSize = 28;

		if(this.tutorStep == 1) {
			this.txtTutor.y = this.pnlTutor.y - this.pnlTutor.height*0.2;
			var img = global.addSprite(this.pnlTutor.x - this.pnlTutor.width*0.15, this.pnlTutor.y + this.pnlTutor.height*0.35, 'game_big/puz_hor');
			img.anchor.setTo(0.5, 1);
			this.imgTutor.push(img);
			this.gTutor.add(img);

			var img2 = global.addSprite(this.pnlTutor.x + this.pnlTutor.width*0.15, this.pnlTutor.y + this.pnlTutor.height*0.35, 'game_big/puz_vert');
			img2.anchor.setTo(0.5, 1);
			this.imgTutor.push(img2);
			this.gTutor.add(img2);
		}
		else if(this.tutorStep == 2) {
			var img = global.addSprite(this.pnlTutor.x, this.pnlTutor.y + this.pnlTutor.height*0.35, 'game_big/puz_vert');
			img.anchor.setTo(0.5, 1);
			this.imgTutor.push(img);
			this.gTutor.add(img);
		}
		else if(this.tutorStep == 3) {
			var img = global.addSprite(this.pnlTutor.x, this.pnlTutor.y + this.pnlTutor.height*0.35, 'game_big/puz_hor');
			img.anchor.setTo(0.5, 1);
			this.imgTutor.push(img);
			this.gTutor.add(img);
		}
	},

	genTxtTutor: function()
	{
		if(this.tutorStep != 2) {
			this.setTutorTweenClear();
		}

		if(this.imgTutor.length > 0) {
			for(var i=0;i<this.imgTutor.length;i++) {
				this.imgTutor[i].destroy();
			}
			this.imgTutor = [];
		}

		if(this.tutorStep > this.maxTutor) {
			// tutor buyar
			// this.item_2.scale.setTo(1, 1);
			this.setTutorFinish();
			DataPlayer.isTutorGame = false;
			Data.save();
			return;
		}

		var txt = global._t('tutor_'+this.tutorStep);
		this.setTxtTutor(txt);

		if(this.tutorStep == 1) {
			var tween = game.add.tween(this.player.scale).to({x: 1.05, y: 1.05}, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
			this.tweenTutor.push(tween);
		}
		else if(this.tutorStep == 3) {
			this.gTutor.y = this.gh*0.2;
			this.player.scale.setTo(1, 1);

			this.tangan = global.addSprite(this.arCheck[0].x - 20, this.arCheck[0].y, 'game_big/tangan');
			this.tangan.angle = -25;
			this.g0.add(this.tangan);

			var _x = [this.arCheck[1].x - 20, this.arCheck[2].x - 20];
			var _y = [this.arCheck[1].y, this.arCheck[2].y];
			game.add.tween(this.tangan).to({x: _x, y: _y}, 1000, Phaser.Easing.Linear.None, true, 0, -1);
			
			for(var i=0;i<this.arCheck.length;i++) {
				var ch = this.arCheck[i];
				var tween = game.add.tween(ch.scale).to({x: 1.1, y: 1.1}, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
				this.tweenTutor.push(tween);
				if(i > 0) {
					var dt = this.genTipeLink(this.arCheck[i-1], this.arCheck[i]);

					link = global.addSprite(this.arCheck[i].x, this.arCheck[i].y, dt.s);
					link.anchor.setTo(dt.a.ax, dt.a.ay);
					this.arPuzLink.push(link);
					this.gPuzLink.add(link);
				}
			}
		}
		else if(this.tutorStep == 4) {
			for(var i=0;i<this.arPuzLink.length;i++) {
				this.arPuzLink[i].destroy();
			}
			this.arPuzLink = [];

			this.tangan.destroy();
			this.gTutor.y = this.gh*0.6;
			for(var i=0;i<this.arCheck.length;i++) {
				var ch = this.arCheck[i];
				ch.scale.setTo(1, 1);
			}

			for(var i=0;i<5;i++) {
				var item = this['item_'+i];
				if(item == null)
					continue;
				var tween = game.add.tween(item.scale).to({x: 1.05, y: 1.05}, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
				this.tweenTutor.push(tween);
			}
		}
		else if(this.tutorStep == 5) {
			this.txtTutor.fontSize = 28;

			for(var i=0;i<5;i++) {
				var item = this['item_'+i];
				if(item == null)
					continue;
				item.scale.setTo(1, 1);
			}

			this.pnlTutor.sx = this.pnlTutor.scale.x;
			this.pnlTutor.sy = this.pnlTutor.scale.y;
			this.pnlTutor.scale.setTo(1.6,2.5);

			this.txtTutor.y = this.pnlTutor.y;
			this.txtTutor.x = this.pnlTutor.x + this.pnlTutor.width*0.05;
			this.txtTutor.wordWrapWidth = this.pnlTutor.width * 0.6;
			this.txtTutor.align = "left";

			var _x = this.pnlTutor.x-this.pnlTutor.width*0.36;

			var img = global.addSprite(_x, this.pnlTutor.y - this.pnlTutor.height*0.20, 'game_big/puz_0');
			img.anchor.setTo(0.5, 1);
			this.imgTutor.push(img);
			this.gTutor.add(img);

			var img = global.addSprite(_x, this.pnlTutor.y + this.pnlTutor.height*0.08, 'game_big/puz_1');
			img.anchor.setTo(0.5, 1);
			this.imgTutor.push(img);
			this.gTutor.add(img);

			var img = global.addSprite(_x, this.pnlTutor.y + this.pnlTutor.height*0.33, 'game_big/puz_2');
			img.anchor.setTo(0.5, 1);
			this.imgTutor.push(img);
			this.gTutor.add(img);
			// var tween = game.add.tween(this.item_0.scale).to({x: 1.05, y: 1.05}, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
			// this.tweenTutor.push(tween);
		}
		// else if(this.tutorStep == 6) {
		// 	// this.item_0.scale.setTo(1, 1);

		// 	this.txtTutor.y = this.pnlTutor.y - this.pnlTutor.height*0.2;
		// 	var img = global.addSprite(this.pnlTutor.x, this.pnlTutor.y + this.pnlTutor.height*0.35, 'game_big/puz_1');
		// 	img.anchor.setTo(0.5, 1);
		// 	this.imgTutor.push(img);
		// 	this.gTutor.add(img);

		// 	// var tween = game.add.tween(this.item_1.scale).to({x: 1.05, y: 1.05}, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
		// 	// this.tweenTutor.push(tween);
		// }
		// else if(this.tutorStep == 7) {
		// 	// this.item_1.scale.setTo(1, 1);

		// 	this.txtTutor.y = this.pnlTutor.y - this.pnlTutor.height*0.2;
		// 	var img = global.addSprite(this.pnlTutor.x, this.pnlTutor.y + this.pnlTutor.height*0.35, 'game_big/puz_2');
		// 	img.anchor.setTo(0.5, 1);
		// 	this.imgTutor.push(img);
		// 	this.gTutor.add(img);

		// 	// var tween = game.add.tween(this.item_2.scale).to({x: 1.05, y: 1.05}, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
		// 	// this.tweenTutor.push(tween);
		// }
	},

	checkAchievement: function(idx)
	{
		if(DataPlayer.achievement[idx] == 0) {
			if(this.isSpcClicked)
				return;
			var ach = false;
			ach = Data.checkAchievement(idx);
			if(ach) {
				// trace("ACHIEVEMENT 2");
				this.genAchievement(idx);
			}
		}

		// check achievement
		// if(DataPlayer.achievement[2] == 0) {
		// 	game.time.events.add(Phaser.Timer.SECOND*30, function() {
		// 	// game.time.events.add(Phaser.Timer.SECOND*1, function() {		// hack
		// 		if(this.isSpcClicked)
		// 			return;
		// 		var ach = false;
		// 		ach = Data.checkAchievement(2);
		// 		if(ach) {
		// 			trace("ACHIEVEMENT 2");
		// 			this.genAchievement(2);
		// 		}
		// 	}, this);
		// }

		// if(DataPlayer.achievement[5] == 0) {
		// 	game.time.events.add(Phaser.Timer.SECOND*60, function() {
		// 		if(this.isSpcClicked)
		// 			return;
		// 		var ach = false;
		// 		ach = Data.checkAchievement(5);
		// 		if(ach) {
		// 			trace("ACHIEVEMENT 5");
		// 			this.genAchievement(5);
		// 		}
		// 	}, this);
		// }

		// if(DataPlayer.achievement[8] == 0) {
		// 	game.time.events.add(Phaser.Timer.SECOND*90, function() {
		// 		if(this.isSpcClicked)
		// 			return;
		// 		var ach = false;
		// 		ach = Data.checkAchievement(8);
		// 		if(ach) {
		// 			trace("ACHIEVEMENT 8");
		// 			this.genAchievement(8);
		// 		}
		// 	}, this);
		// }
		// end check achievement

	},

	revivePlayer: function()
	{
		csound.shield();
		DataPlayer.gems -= Data.revivePrice;
		this.genTxtGems();
		this.gResult.visible = false;
		this.black80.visible = false;
		this.isOver = false;
		this.player.setRevive();
		this.player.animations.paused = false;
		for(var i=0;i<this.arEnemy.length;i++) {
			this.arEnemy[i].animations.paused = false;
		}
		this.animRevive.visible = true;
		this.animRevive.play('revive');
		this.setDashOn();
		this.setShieldOn();
		this.setBerserkOn();
		Data.save();
	},

	checkResult: function()
	{
		if(this.arEnemy.length <= 0) {
			var done = true;
			for(var i=0;i<this.arDtEnemy.length;i++) {
				if(this.arDtEnemy[i].jml < this.arDtEnemy[i].max) {
					done = false;
					break;
				}
			}
			if(done) {
				game.time.events.add(Phaser.Timer.SECOND*1, function() {
					this.genResult(1);
				}, this);
			}
		}
	},

	genResult: function(status)
	{
		// status 1 = menang, 2 = salah
		if(status == 1) {
			if(DataPlayer.lastStage <= this.stage) {
				DataPlayer.lastStage = this.stage + 1;
			}
			csound.success();
		}
		else {
			csound.failed();
		}
		this.player.animations.paused = true;
		for(var i=0;i<this.arEnemy.length;i++) {
			this.arEnemy[i].animations.paused = true;
		}
		this.gResult.visible = true;
		this.isOver = true;
		status = status || 1;
		this.black80.visible = true;
		this.result = new Result(game, this.gw, this.gh, this.gResult, status);
		Data.save();
	},

	setPauseOff: function()
	{
		this.player.animations.paused = false;
		for(var i=0;i<this.arEnemy.length;i++) {
			this.arEnemy[i].animations.paused = false;
		}
		this.black80.visible = false;
		this.gPause.visible = false;
		this.isPause = false;
	},

	setPauseOn: function()
	{
		this.player.animations.paused = true;
		for(var i=0;i<this.arEnemy.length;i++) {
			this.arEnemy[i].animations.paused = true;
		}
		this.black80.visible = true;
		this.gPause.visible = true;
		this.isPause = true;
	},

	genPlayerAnim: function()
	{
		this.animDash = global.addSprite(this.player.x + this.player.width*0.25, this.player.y - this.player.height*0.2, 'sp_hero/dash_0');
		this.animDash.anchor.setTo(0.5, 1);
		this.gAnimPlayer.add(this.animDash);
		this.animDash.visible = false;
		this.animDash.animations.add('spcDash', Phaser.Animation.generateFrameNames('sp_hero/dash_', 0, 2, '', 1), 8);
		this.animDash.events.onAnimationComplete.add(function() {
			var tween = game.add.tween(this.animDash).to({x: this.gh}, 750, Phaser.Easing.Sinusoidal.Out, true);
			tween.onComplete.add(function() {
				this.animDash.visible = false;
				this.animDash.x = this.player.x + this.player.width*0.25;
				this.animDash.y = this.player.y - this.player.height*0.2;
			}, this);
			// this.animDash.visible = false;
		}, this);

		this.animShield = global.addSprite(this.player.x, this.player.y - this.player.height*0.15, 'sp_hero/shield_0');
		this.animShield.anchor.setTo(0.5, 1);
		this.gAnimPlayer.add(this.animShield);
		this.animShield.visible = false;
		this.animShield.animations.add('spcShield', Phaser.Animation.generateFrameNames('sp_hero/shield_', 0, 2, '', 1), 8, true);

		this.animBerserk = global.addSprite(this.player.x, this.player.y - this.player.height*0.15, 'sp_hero/shield_0');
		this.animBerserk.anchor.setTo(0.5, 1);
		this.gAnimPlayer.add(this.animBerserk);
		this.animBerserk.visible = false;
		this.animBerserk.animations.add('spcBerserk', Phaser.Animation.generateFrameNames('sp_hero/berserk_', 0, 2, '', 1), 8, true);

		this.animRevive = global.addSprite(this.player.x - this.player.width*0.32, this.player.y - this.player.height*0.9, 'revive/0');
		this.animRevive.anchor.setTo(0.5, 0.5);
		this.gAnimPlayer.add(this.animRevive);
		this.animRevive.visible = false;
		this.animRevive.animations.add('revive', Phaser.Animation.generateFrameNames('revive/', 0, 2, '', 1), 10);
		// this.animRevive.animations.play('revive');
		this.animRevive.events.onAnimationComplete.add(function() {
			this.animRevive.visible = false;
		}, this);
	},

	genEnemy: function(str)
	{
		var cls = window[str];
		var enemy = new cls(game, this.gw, this.gh*0.37);
		this.gEnemy.add(enemy);
		this.arEnemy.push(enemy);
	},

	genEnemyWeapon: function(_x, _y, id, hitPoints)
	{
		// trace("GEN ENEMY WEAPON >>>", id);
		csound.weapon();
		var weapon = new Weapon(game, _x, _y, id, hitPoints);
		this.gWeapon.add(weapon);
		this.arWeapon.push(weapon);
	},

	genCoinsEnemy: function(value, _x, _y)
	{
		var ctr = Math.ceil(value/Data.valueCoins);
		var delay = 0;
		for(var i=0;i<ctr;i++) {
			posX = game.rnd.integerInRange(_x - 20, _x + 20);
			posY = game.rnd.integerInRange(_y - 20, _y + 20);
			var coins = global.addSprite(posX, posY, 'game/coins');
			coins.scale.setTo(0.7, 0.7);
			coins.anchor.setTo(0.5, 0.5);
			coins.value = Data.valueCoins;
			this.gAnimItem.add(coins);
			var tween = game.add.tween(coins).to({x: this.pnlCoins.x + this.pnlCoins.width*0.3, y: this.pnlCoins.y}, 350, Phaser.Easing.Sinusoidal.Out, true, delay);
			tween.onComplete.add(function() {
				csound.coins();
				DataPlayer.coins += this.value;
				game.curstate.genTxtCoins();
				this.destroy();
			}, coins);
			delay += 100;
		}

		// game.time.events.add(Phaser.Timer.SECOND*(delay*0.001), function() {
		// 	if(this.arEnemy.length <= 0) {
		// 		var done = true;
		// 		for(var i=0;i<this.arDtEnemy.length;i++) {
		// 			if(this.arDtEnemy[i].jml < this.arDtEnemy[i].max) {
		// 				done = false;
		// 				break;
		// 			}
		// 		}
		// 		if(done) {
		// 			this.genResult(1);
		// 		}
		// 	}
		// }, this);
	},

	genBGAtas: function()
	{
		var str;
		if(this.stage <= 10)
			str = 'bg_game_1';
		else if(this.stage <= 20)
			str = 'bg_game_2';
		else
			str = 'bg_game_3';

		for(var i=0;i<3;i++) {
			var _x = -250;
			if(this.arBG.length > 0) {
				var last = this.arBG.length-1;
				_x = this.arBG[last].x + this.arBG[last].width*0.5 - 5;
			}

			var bg = game.add.sprite(_x, -this.gh*0.1, str);
			bg.x += bg.width*0.5;
			bg.anchor.setTo(0.5, 0);
			this.arBG.push(bg);
			this.gBGAtas.add(bg);
		}
	},

	setBGMove: function(speed)
	{
		for(var i=0;i<this.arBG.length;i++) {
			this.arBG[i].x -= speed;
			if(this.arBG[i].x < -this.arBG[i].width) {
				if(i == 0) {
					var last = this.arBG.length-1;
					// trace("I == 0", this.arBG[last].x, this.arBG[last].width);
					this.arBG[i].x = this.arBG[last].x + this.arBG[last].width - speed*2;
				}
				else {
					this.arBG[i].x = this.arBG[i-1].x + this.arBG[i-1].width - speed*2;
				}
			}
		}
	},

	genUI: function()
	{
		var posI = [
			this.gw*0.11, this.gw*0.22, this.gw*0.332, this.gw*0.445, this.gw*0.552,
		];

		var max;
		if(this.stage == 1)
			max = 3;
		else if(this.stage == 2)
			max = 4;
		else
			max = 5;

		// for(var i=0;i<posI.length;i++) {
		for(var i=0;i<posI.length;i++) {
			if(i >= max) {
				this['item_'+i] = null;
				continue;
			}
			this['item_'+i] = global.addSprite(posI[i], this.gh*0.4, 'game_big/icon_' + i);
			var item = this['item_'+i];
			item.anchor.setTo(0.5, 1);
			this.gItem.add(item);
		}

		// hack test
		// this.player.hp = 50;
		// this.player.mp = 50;
		// this.player.stamina = 50;
		// this.player.defend = 50;
		// end hack test

		this.genTxtHP();
		this.genTxtMP();
		this.genTxtStamina();
		this.genTxtAttack();
		this.genTxtDefend();

		if(this.stage >= 3) {
			this.btnDash = global.addSprite(this.gw*0.68, this.gh*0.365, 'game_big/icon_dash_on');
			this.btnDash.anchor.setTo(0.5, 0.5);
			this.gItem.add(this.btnDash);
			this.btnDash.inputEnabled = true;
			this.btnDash.events.onInputUp.add(this.onSpcClick, this);
		}

		if(DataPlayer.upgradeLv[1] >= 0 && this.stage >= 3) {
			this.btnShield = global.addSprite(this.gw*0.79, this.btnDash.y, 'game_big/icon_shield_on');
			this.btnShield.anchor.setTo(0.5, 0.5);
			this.gItem.add(this.btnShield);
			this.btnShield.inputEnabled = true;
			this.btnShield.events.onInputUp.add(this.onSpcClick, this);
		}

		if(DataPlayer.upgradeLv[2] >= 0 && this.stage >= 3) {
			this.btnBerserk = global.addSprite(this.gw*0.9, this.btnDash.y, 'game_big/icon_berserk_on');
			this.btnBerserk.anchor.setTo(0.5, 0.5);
			this.gItem.add(this.btnBerserk);
			this.btnBerserk.inputEnabled = true;
			this.btnBerserk.events.onInputUp.add(this.onSpcClick, this);
		}

		this.pnlCoins = global.addSprite(this.gw*0.075, this.gh*0.075, 'global/pnl_coins');
		this.pnlCoins.anchor.setTo(0, 0.5);
		this.gUI.add(this.pnlCoins);

		this.pnlGems = global.addSprite(this.pnlCoins.x + this.pnlCoins.width*1.1, this.pnlCoins.y, 'global/pnl_gems');
		this.pnlGems.anchor.setTo(0, 0.5);
		this.gUI.add(this.pnlGems);

		this.btnPause = global.addButton(this.gw*0.8, this.pnlGems.y, 'global/btn_pause', this.onUIClick, this);
		this.btnPause.anchor.setTo(0.5, 0.5);
		this.btnPause.scale.setTo(0.7, 0.7);
		this.gUI.add(this.btnPause);

		this.btnSound = new csound(game, this.gw*0.9, this.pnlGems.y);
		this.btnSound.anchor.setTo(0.5, 0.5);
		this.btnSound.scale.setTo(0.7, 0.7);
		this.gUI.add(this.btnSound);

		this.genTxtCoins();
		this.genTxtGems();
	},

	onUIClick: function(obj)
	{
		if(obj == this.btnPause) {
			csound.click();
			this.setPauseOn();
		}
	},

	onSpcClick: function(obj)
	{
		if(this.player.isDie || this.isPause)
			return;

		if(!this.isSpcClicked)
			this.isSpcClicked = true;

		csound.click();

		if(obj == this.btnDash) {
			if(this.player.mp < this.player.data.spcPrice[0] || this.player.isAfterDash || this.player.isDash)
				return;

			csound.dash();
			// obj.frameName = 'game_big/icon_dash_off';
			this.player.setDash();
			game.time.events.add(Phaser.Timer.SECOND*0.25, function() {
				this.animDash.visible = true;
				this.animDash.play('spcDash');
			}, this);
			if(this.btnDash != null) {
				this.setDashOn();			
			}
			if(this.btnShield != null) {
				this.setShieldOn();
			}
			if(this.btnBerserk != null) {
				this.setBerserkOn();
			}
		}

		if(obj == this.btnShield) {
			// trace("PLAYER SHIELD");
			if(this.player.mp < this.player.data.spcPrice[1] || this.player.isAfterShield || this.player.isShield)
				return;

			csound.shield();
			// obj.frameName = 'game_big/icon_shield_off';
			this.player.setShield();
			this.animShield.visible = true;
			this.animShield.animations.play('spcShield');
			if(this.btnDash != null) {
				this.setDashOn();			
			}
			if(this.btnShield != null) {
				this.setShieldOn();
			}
			if(this.btnBerserk != null) {
				this.setBerserkOn();
			}
		}

		if(obj == this.btnBerserk) {
			// trace("PLAYER BERSERK");
			if(this.player.mp < this.player.data.spcPrice[2] || this.player.isAfterBerserk || this.player.isBerserk)
				return;

			csound.berserk();
			// obj.frameName = 'game_big/icon_berserk_off';
			this.player.setBerserk();
			this.animBerserk.visible = true;
			this.animBerserk.animations.play('spcBerserk');
			// trace("BERSERK ICON >>>", obj.frameName);
			if(this.btnDash != null) {
				this.setDashOn();			
			}
			if(this.btnShield != null) {
				this.setShieldOn();
			}
			if(this.btnBerserk != null) {
				this.setBerserkOn();
			}
		}
	},

	setDashOn: function()
	{
		if(this.btnDash == null)
			return;
		// trace(this.player.isAfterDash, this.player.isDash);
		if(this.player.mp < this.player.data.spcPrice[0] || this.player.isAfterDash || this.player.isDash) {
			this.btnDash.frameName = 'game_big/icon_dash_off';
		}
		else {
			this.btnDash.frameName = 'game_big/icon_dash_on';
		}
	},

	setShieldOn: function()
	{
		if(this.btnShield == null)
			return;
		if(this.player.mp < this.player.data.spcPrice[1] || this.player.isAfterShield || this.player.isShield) {
			this.btnShield.frameName = 'game_big/icon_shield_off';
		}
		else {
			this.btnShield.frameName = 'game_big/icon_shield_on';
		}
	},

	setAnimShieldOff: function()
	{
		this.animShield.visible = false;
		this.animShield.animations.stop('spcShield');
	},

	setBerserkOn: function()
	{
		if(this.btnBerserk == null)
			return;
		if(this.player.mp < this.player.data.spcPrice[2] || this.player.isAfterBerserk || this.player.isBerserk) {
			this.btnBerserk.frameName = 'game_big/icon_berserk_off';
		}
		else {
			this.btnBerserk.frameName = 'game_big/icon_berserk_on';
		}
	},

	setAnimBerserkOff: function()
	{
		this.animBerserk.visible = false;
		this.animBerserk.animations.stop('spcBerserk');
	},

	initPuzzle: function()
	{
		

		if(this.maxPuzzle == 5) {
			this.arPos = [
			
				{x: this.bgPuzzle.x - this.bgPuzzle.width*0.2, y: this.bgPuzzle.y + this.bgPuzzle.height*0.52},
				{x: this.bgPuzzle.x - this.bgPuzzle.width*0.1, y: this.bgPuzzle.y + this.bgPuzzle.height*0.44},
				{x: this.bgPuzzle.x, y: this.bgPuzzle.y + this.bgPuzzle.height*0.36},
				{x: this.bgPuzzle.x + this.bgPuzzle.width*0.1, y: this.bgPuzzle.y + this.bgPuzzle.height*0.28},
				{x: this.bgPuzzle.x + this.bgPuzzle.width*0.2, y: this.bgPuzzle.y + this.bgPuzzle.height*0.2},
			
			];	
		}
		else if(this.maxPuzzle == 6) {
			this.arPos = [
				{x: this.bgPuzzle.x - this.bgPuzzle.width*0.25, y: this.bgPuzzle.y + this.bgPuzzle.height*0.56},
				{x: this.bgPuzzle.x - this.bgPuzzle.width*0.15, y: this.bgPuzzle.y + this.bgPuzzle.height*0.48},
				{x: this.bgPuzzle.x - this.bgPuzzle.width*0.05, y: this.bgPuzzle.y + this.bgPuzzle.height*0.4},
				{x: this.bgPuzzle.x + this.bgPuzzle.width*0.05, y: this.bgPuzzle.y + this.bgPuzzle.height*0.32},
				{x: this.bgPuzzle.x + this.bgPuzzle.width*0.15, y: this.bgPuzzle.y + this.bgPuzzle.height*0.24},
				{x: this.bgPuzzle.x + this.bgPuzzle.width*0.25, y: this.bgPuzzle.y + this.bgPuzzle.height*0.16},
			];
		}
		else {
			this.arPos = [
				{x: this.bgPuzzle.x - this.bgPuzzle.width*0.3, y: this.bgPuzzle.y + this.bgPuzzle.height*0.6},
				{x: this.bgPuzzle.x - this.bgPuzzle.width*0.2, y: this.bgPuzzle.y + this.bgPuzzle.height*0.52},
				{x: this.bgPuzzle.x - this.bgPuzzle.width*0.1, y: this.bgPuzzle.y + this.bgPuzzle.height*0.44},
				{x: this.bgPuzzle.x, y: this.bgPuzzle.y + this.bgPuzzle.height*0.36},
				{x: this.bgPuzzle.x + this.bgPuzzle.width*0.1, y: this.bgPuzzle.y + this.bgPuzzle.height*0.28},
				{x: this.bgPuzzle.x + this.bgPuzzle.width*0.2, y: this.bgPuzzle.y + this.bgPuzzle.height*0.2},
				{x: this.bgPuzzle.x + this.bgPuzzle.width*0.3, y: this.bgPuzzle.y + this.bgPuzzle.height*0.12},
			];
		}

		// console.log(this.maxPuzzle);
		this.bg_puzzle = global.addSprite(this.arPos[0].x, this.arPos[0].y, "game/bg_puzzle");
		this.bg_puzzle.width = (this.arPos[this.arPos.length-1].x - this.arPos[0].x);
		this.bg_puzzle.height = (this.arPos[this.arPos.length-1].y - this.arPos[0].y);
		this.bg_puzzle.x -= this.bg_puzzle.width*0.25;
		this.bg_puzzle.y -= this.bg_puzzle.height*0.25;
		this.bg_puzzle.width *= 1.5;
		this.bg_puzzle.height *= 1.5;
		this.gPuzzle.addAt(this.bg_puzzle,1);


		for(var i=0;i<this.maxPuzzle;i++) {
			this.arPuzSel.push([]);
			this.arPuzMain.push([]);
			for(var j=0;j<this.maxPuzzle;j++) {
				var puzSel = global.addSprite(this.arPos[i].x+3, this.arPos[j].y+2, 'game/puz_sel');
				puzSel.anchor.setTo(0.5, 0.5);
				puzSel.scale.setTo(1.1);
				puzSel.visible = false;
				this.arPuzSel[this.arPuzSel.length-1].push(puzSel);
				this.gPuzSel.add(puzSel);

				var puzMain = this.genPuzzle(i, j);
				this.arPuzMain[this.arPuzMain.length-1].push(puzMain);
				this.gPuzMain.add(puzMain);
			}
		}

		this.checkPossibility();



		// this.tes = true;
	},

	genPuzzle: function(_i, _j, efek)
	{
		efek = efek || null;
		var ran, str, tipe;
		if(this.stage <= 2) {
			if(this.stage == 1)
				ran = game.rnd.integerInRange(0, 2);
			else
				ran = game.rnd.integerInRange(0, 3);
		}
		else {
			ran = game.rnd.integerInRange(0, 4);
		}
		
		str = 'game/puz_'+ran;
		tipe = ran;

		// hack test cek BUBBLE
		// if(_i == 0 && _j == 0) {
		// 	efek = 3;
		// 	ran = 2;
		// }
		// if(!this.tes) {
		// 	// trace("HACK >>>>>");
		// 	if((_i == 2 && _j == 6)) {
		// 		efek = 1;
		// 		ran = 2;
		// 	}

		// 	if((_i == 1 && _j == 5) || (_i == 1 && _j == 6)) {
		// 		efek = null;
		// 		ran = 2;
		// 	}

		// 	if(_i == 0 && _j == 6) {
		// 		efek = 3;
		// 		ran = 2;
		// 	}
		// 	// this.tes = true;
		// }


		// if((_i == 0 && _j == 6) || (_i == 1 && _j == 6) || (_i == 3 && _j == 6)) {
		// 	efek = 2;
		// 	ran = 2;
		// }
		// if(_j == 6) {
		// 	efek = null;
		// 	ran = 2;
		// }
		// var ran = game.rnd.integerInRange(1, 2);
		// if(ran == 1)
		// 	efek = 1;
		// end of hack test cek bubble

		// var puz = global.addSprite(this.arPos[_i].x, this.arPos[_j].y, 'game/puz_'+ran);
		var puz = global.addSprite(this.arPos[_i].x, this.arPos[_j].y, str);
		puz.anchor.setTo(0.5, 0.5);
		// puz.tipe = ran;
		puz.tipe = tipe;
		puz.spc = efek;
		puz.i = _i;
		puz.j = _j;
		puz.sel = false;				// puzzle dipilih
		puz.inputEnabled = true;
		puz.clicked = 0;
		puz.back = null;
		puz.isClue = false;				// puzzle jadi clue saat player tidak memilih
		// puz.scale.setTo(1.5, 1.5);

		puz.spc = efek;

		if(efek == null) {
			// stage 4 baru keluar bubble
			if(this.stage >= 4) {
				var ranB = game.rnd.integerInRange(1, 10);
				// hack
				// if(_i == 4 && _j == 3) {
				// 	ranB = 2;
				// }
				// end of hack
				if(ranB <= 2) {
					puz.efek = global.addSprite(puz.x, puz.y, 'game/block_0');
					puz.efek.anchor.setTo(0.5, 0.5);
					puz.efek.alpha = 0.5;
					puz.spc = 0;
					this.gPuzEfek.add(puz.efek);
				}
			}
		}
		else {
			puz.efek = global.addSprite(puz.x, puz.y, 'game/block_'+efek);
			puz.efek.anchor.setTo(0.5, 0.5);
			this.gPuzEfek.add(puz.efek);
			if(efek == 1 || efek == 2) {
				if(DataPlayer.isTutorHorVert) {
					this.isTutorSpecial = true;
					// this.isTutorHorVert = true;
					this.genTutor();
				}
				puz.back = global.addSprite(puz.x, puz.y, 'game/puz_bunder');
				puz.back.anchor.setTo(0.5, 0.5);
				puz.back.scale.setTo(1.1, 1.1);
				this.gPuzBack.add(puz.back);
			}
			else {
				if(DataPlayer.isTutorGems) {
					this.isTutorSpecial = true;
					this.isTutorGems = true;
					this.genTutor();
				}
				puz.efek.alpha = 0.5;
			}
		}

		puz.scale.setTo(0, 0);
		game.add.tween(puz.scale).to({x: 1.1, y: 1.1}, 400, Phaser.Easing.Elastic.Out, true);

		return puz;
	},

	checkPossibility: function()
	{
		this.arCheck = [];
		var awal;

		check:
		for(var i=0;i<this.maxPuzzle;i++) {
			for(var j=0;j<this.maxPuzzle;j++) {
				this.arCheck.push(this.arPuzMain[i][j]);
				awal = this.arCheck[0];
				var status = true;
				while(status) {
					// trace("STATUS POSSIBLE FALSE");
					possibleOut:
					for(var k=-1;k<=1;k++) {
						for(var l=-1;l<=1;l++) {
							var pos1 = awal.i + k;
							var pos2 = awal.j + l;


							if(pos1 >= 0 && pos2 >= 0 && pos1 < this.maxPuzzle && pos2 < this.maxPuzzle) {
								if(this.arPuzMain[pos1][pos2] != awal && this.arPuzMain[pos1][pos2].tipe == awal.tipe) {
									detail:
									for(var z=0;z<this.arCheck.length;z++) {
										var ref = this.arPuzMain[pos1][pos2];
										if(this.arCheck[z].i == ref.i && this.arCheck[z].j == ref.j) {
											break detail;
										}

										if(z == this.arCheck.length-1) {
											this.arCheck.push(this.arPuzMain[pos1][pos2]);		
											awal = this.arCheck[this.arCheck.length-1];
											break possibleOut;
										}
									}
									// this.arCheck.push(this.arPuzMain[pos1][pos2]);
									// if(this.arCheck.length >= 3) {
									// 	status = false;
									// 	break check;
									// }
									// else {
										// awal = this.arCheck[this.arCheck.length-1];
										// break possibleOut;
									// }
								}
							}

							if(l == 1 && k == 1) {
								status = false;
								if(this.arCheck.length >= 3) {
									break check;
								}
								else {
									this.arCheck = [];
									break possibleOut;		
								}
							}
						}
					}
				}
			}
		}

		if(this.arCheck.length <= 0) {
			// tidak ada yg cocok
			this.isShuffle = true;
			game.time.events.add(Phaser.Timer.SECOND*0.25, function() {
				this.shufflePuzzle();
			}, this);
		}
	},

	setTxtShuffle: function()
	{
		this.txtShuffle.visible = true;
		var tween = game.add.tween(this.txtShuffle.scale).to({x: 1, y: 1}, 350, Phaser.Easing.Elastic.Out, true);
		tween.onComplete.add(function() {
			var tween2 = game.add.tween(this.txtShuffle.scale).to({x: 0, y: 0}, 350, Phaser.Easing.Elastic.In, true, 250);
			tween2.onComplete.add(function() {
				this.txtShuffle.visible = false;
				this.isShuffle = false;
			}, this);
		}, this);
	},

	shufflePuzzle: function()
	{
		csound.shuffle();
		this.setTxtShuffle();
		var arOldTemp = [];
		var arNewTemp = [];

		for(var i=0;i<this.maxPuzzle;i++) {
			arOldTemp.push([]);
			for(var j=0;j<this.maxPuzzle;j++) {
				this.arPuzMain[i][j].scale.setTo(0, 0);
				arOldTemp[i].push({i: this.arPuzMain[i][j].i, j: this.arPuzMain[i][j].j});
			}
		}

		for(var i=0;i<this.maxPuzzle;i++) {
			arNewTemp.push([]);
			for(var j=0;j<this.maxPuzzle;j++) {
				var status = true;
				while(status) {
					// trace("SHUFFLE >>>");
					var ran1 = game.rnd.integerInRange(0, this.maxPuzzle-1);
					var ran2 = game.rnd.integerInRange(0, this.maxPuzzle-1);
					if(arOldTemp[ran1][ran2] != null) {
						arNewTemp[i].push(arOldTemp[ran1][ran2]);
						arOldTemp[ran1][ran2] = null;
						status = false;
					}
				}
			}
		}

		for(var i=0;i<arNewTemp.length;i++) {
			for(var j=0;j<arNewTemp[i].length;j++) {
				var temp = this.arPuzMain[i][j];
				var _i = arNewTemp[i][j].i;
				var _j = arNewTemp[i][j].j;
				this.arPuzMain[i][j] = this.arPuzMain[_i][_j];
				this.arPuzMain[i][j].i = i;
				this.arPuzMain[i][j].j = j;
				var _x = this.arPos[i].x;
				var _y = this.arPos[j].y;
				this.arPuzMain[i][j].x = _x;
				this.arPuzMain[i][j].y = _y;
				if(this.arPuzMain[i][j].efek != null) {
					this.arPuzMain[i][j].efek.x = _x;
					this.arPuzMain[i][j].efek.y = _y;
				}
				if(this.arPuzMain[i][j].back != null) {
					this.arPuzMain[i][j].back.x = _x;
					this.arPuzMain[i][j].back.y = _y;
				}

				this.arPuzMain[_i][_j] = temp;
				this.arPuzMain[_i][_j].i = _i;
				this.arPuzMain[_i][_j].j = _j;
				_x = this.arPos[_i].x;
				_y = this.arPos[_j].y;
				this.arPuzMain[_i][_j].x = _x;
				this.arPuzMain[_i][_j].y = _y;
				if(this.arPuzMain[_i][_j].efek != null) {
					this.arPuzMain[_i][_j].efek.x = _x;
					this.arPuzMain[_i][_j].efek.y = _y;
				}
				if(this.arPuzMain[_i][_j].back != null) {
					this.arPuzMain[_i][_j].back.x = _x;
					this.arPuzMain[_i][_j].back.y = _y;
				}

			}
		}

		for(var i=0;i<this.arPuzMain.length;i++) {
			for(var j=0;j<this.arPuzMain[i].length;j++) {
				game.add.tween(this.arPuzMain[i][j].scale).to({x: 1, y: 1}, 750, Phaser.Easing.Elastic.Out, true);
			}
		}
		
		this.checkPossibility();
	},

	checkItemValue: function(tipe)
	{
		// trace("CHECK ITEM VALUE >>>");
		this.arChAnimItem[tipe]++;
		this.tempAddValue[tipe] += Data.addValue[tipe];
		
		if(this.tempAddValue[tipe] > 0) {
			// if(this.arChAnimItem[0] == this.dtPuzJadi.l) {
			if(this.arChAnimItem[tipe] == this.ctrPuzJadi[tipe]) {
				this.genTxtItemValue(tipe, this.tempAddValue[tipe]);
						
				this.arChAnimItem[tipe] = 0;
				this.ctrPuzJadi[tipe] = 0;
				// this.dtPuzJadi.l = 0;
				// this.dtPuzJadi.tipe = null;
				// this.tempCtrJadi = 0;
				this.tempAddValue[tipe] = 0;
			}
		}
	},

	genAnimJadi: function(obj)
	{
		// trace("GEN ANIM JADI >>>");
		var _x = obj.x;
		var _y = obj.y;
		var _i = obj.i;
		var _j = obj.j;
		var idx = obj.idx;
		var tipe = obj.tipe;

		var score = Data.addValue[tipe];
		Data.addScore(score);
		
		// animasi puzzle meledak karena jadi
		var anim = global.addSprite(_x, _y, 'puz_jadi/0');
		anim.anchor.setTo(0.5, 0.5);
		this.gPuzEfek.add(anim);
		anim.animations.add('play', Phaser.Animation.generateFrameNames('puz_jadi/', 0, 4, '', 1), 20);
		anim.animations.play('play');
		anim.events.onAnimationComplete.add(function() {
			this.destroy();
		}, anim);

		// var tipe = this.dtPuzJadi.tipe;
		var animItem = global.addSprite(_x, _y, 'game/match_'+tipe);
		animItem.anchor.setTo(0.5, 0.5);
		animItem.idx = idx;
		this.gAnimItem.add(animItem);

		var speed = [600, 550, 500, 425, 350, 250, 150];
		var tween = game.add.tween(animItem).to({x: this['item_'+tipe].x, y: this['item_'+tipe].y}, speed[_j], Phaser.Easing.Sinusoidal.Out, true);
		tween.onComplete.add(function() {
			// generate nilai
			animItem.destroy();
			this.checkItemValue(tipe);
			if(tipe == 0) {
				this.player.hp += Data.addValue[tipe];
				this.genTxtHP();
			}
			else if(tipe == 1) {
				this.player.stamina += Data.addValue[tipe];
				this.genTxtStamina();
			}
			else if(tipe == 2) {
				this.player.attack += Data.addValue[tipe];
				this.genTxtAttack();
			}
			else if(tipe == 3) {
				this.player.defend += Data.addValue[tipe];
				this.genTxtDefend();
			}
			else {
				this.player.mp += Data.addValue[tipe];
				this.genTxtMP();
				if(this.btnDash != null) {
					this.setDashOn();				
				}
			}
		}, this);

		if(obj.spc == 3) {
			var gems = global.addSprite(obj.x, obj.y, 'game/gems');
			gems.anchor.setTo(0.5, 0.5);
			this.gAnimItem.add(gems);
			var tweenG = game.add.tween(gems).to({x: this.pnlGems.x + this.pnlGems.width*0.3, y: this.pnlGems.y}, 500, Phaser.Easing.Sinusoidal.Out, true);
			tweenG.onComplete.add(function() {
				csound.gems();
				this.destroy();
				DataPlayer.gems += Data.valueGems;
				game.curstate.genTxtGems();
			}, gems);
		}
	},

	aturPuzzle: function()
	{
		// trace("ATUR PUZZLE >>>");
		// trace("ATUR PUZZLE", "TIPE >>> " + this.dtPuzJadi.tipe);
		for(var i=0;i<this.maxPuzzle;i++) {
			for(var j=0;j<this.maxPuzzle;j++) {
				if(j == 0)
					continue;
				if(this.arPuzMain[i][j] == null)
					continue;

				var jAwal = j;
				var jAkhir = null;
				var _temp = null;
				var _pos = null;
				while(this.arPuzMain[i][j-1] == null && j > 0) {
					this.arPuzMain[i][j-1] = this.arPuzMain[i][j];
					this.arPuzMain[i][j] = null;
					j--;
					jAkhir = j;
					this.arPuzMain[i][j].i = i;
					this.arPuzMain[i][j].j = j;
					_temp = this.arPuzMain[i][j];
					_pos = {x: this.arPos[i].x, y: this.arPos[j].y};
				}

				if(_temp == null || _pos == null)
					continue;

				this.ctrPreAtur++;
				var sel = Math.abs(jAwal - jAkhir);
				var tween = game.add.tween(_temp).to({x: _pos.x, y: _pos.y}, 150*sel, Phaser.Easing.Linear.None, true);
				if(_temp.efek != null) {
					game.add.tween(_temp.efek).to({x: _pos.x, y: _pos.y}, 150*sel, Phaser.Easing.Linear.None, true);
				}
				if(_temp.back != null) {
					game.add.tween(_temp.back).to({x: _pos.x, y: _pos.y}, 150*sel, Phaser.Easing.Linear.None, true);
				}
				tween.onComplete.add(function() {
					this.ctrAtur++;
					// trace("THIS CTR ATUR >>>", this.ctrAtur, this.ctrPreAtur);
					// if(this.ctrPreAtur == this.ctrAtur) {
					// 	// this.ctrPreAtur = 0;
					// 	// this.ctrAtur = 0;
					// 	this.preNewPuzzle();
					// 	// this.isAtur = false;
					// }
				}, this);

			}
		}
		if(this.ctrPreAtur > 0)
			this.isAtur = true;
		else
			this.preNewPuzzle();
	},

	preNewPuzzle: function()
	{
		// trace("PRE NEW PUZZLE >>>");
		var tempNewPuz = [];
		var spc = false;

		// console.log(this.dtPuzJadi.l);

		for(var i=0;i<this.maxPuzzle;i++) {
			for(var j=0;j<this.maxPuzzle;j++) {
				if(this.arPuzMain[i][j] == null) {
					tempNewPuz.push({_i: i, _j: j, spc: null});
					var last = tempNewPuz.length-1;
					ran = game.rnd.integerInRange(0, 4);
					tempNewPuz[last].tipe = ran;
				}
			}
		}

		for(var i=0;i<tempNewPuz.length;i++) {
			if(tempNewPuz.length >= 5) {
				if(!spc) {
					var chance = false;
					if(i < tempNewPuz.length - 1) {
						var ranS = game.rnd.integerInRange(1, 2);
						if(ranS == 1) {
							chance = true;
						}
					}
					else {
						chance = true;
					}
					
					if(chance) {
						if(tempNewPuz.length < 7) {
							var ranSPC = game.rnd.integerInRange(1, 2);
							tempNewPuz[i].spc = ranSPC;
						}
						else {
							tempNewPuz[i].spc = 3;
						}
						spc = true;
					}
				}
			}

			var _i = tempNewPuz[i]._i;
			var _j = tempNewPuz[i]._j;
			var puzMain = this.genPuzzle(_i, _j, tempNewPuz[i].spc);
			this.arPuzMain[_i][_j] = puzMain;
			this.gPuzMain.add(puzMain);
		}

		this.checkPossibility();

		this.dtPuzJadi.l = 0;
		this.dtPuzJadi.tipe = null;
		this.tempCtrJadi = 0;
		this.ctrPreAtur = 0;
		this.ctrAtur = 0;
	},

	genAnimHorVert: function(x, y, direction)
	{
		var str;
		if(direction == 'left')
			str = 'game/efek_hor_kiri';
		else if(direction == 'up')
			str = 'game/efek_vert_naik';
		else if(direction == 'right')
			str = 'game/efek_hor_kanan';
		else
			str = 'game/efek_vert_turun';

		var efek = global.addSprite(x, y, str);
		efek.anchor.setTo(0.5, 0.5);
		this.gPuzEfek.add(efek);
		return efek;
	},

	checkPuzBubble: function(puz)
	{
		if(puz.efek != null) {
			if(puz.spc == 0) {
				puz.efek.destroy();
				puz.spc = null;
			}
		}
	},

	destroyPuzzle: function(array)
	{
		// trace("DESTROY >>>");
		csound.match();
		var arChain = [];
		var delay = 0;

		this.dtPuzJadi.tipe = array[0].tipe;
				
		for(var i=0;i<array.length;i++) {
			var isNull = false;
			if(!array[i])
				continue;
			var ar = array[i];
			// if(!ar || ar == null)
			// 	continue;
			if(this.arPuzMain[ar.i][ar.j] == null)
				continue;
			
			var obj = this.arPuzMain[ar.i][ar.j];

			obj.idx = this.dtPuzJadi.l+1;
			if(obj.spc == null) {
				this.ctrPuzJadi[obj.tipe]++;
				this.arPuzMain[ar.i][ar.j] = null;
				this.dtPuzJadi.l++;
			}
			else {
				// CHECK SPECIAL
				if(obj.spc != 0) {
					this.ctrPuzJadi[obj.tipe]++;
					this.arPuzMain[ar.i][ar.j] = null;
					this.dtPuzJadi.l++;

					if(obj.spc == 1) {
						// horizontal
						csound.bomb();
						if(obj.i == 0) {
							for(var k=0;k<this.maxPuzzle;k++) {
								if(this.arPuzMain[k][obj.j] != null) {
									this.checkPuzBubble(this.arPuzMain[k][obj.j]);
									arChain.push(this.arPuzMain[k][obj.j]);
								}
							}
							var efek = this.genAnimHorVert(obj.x, obj.y, 'right');
							var tween = game.add.tween(efek).to({x: this.bgPuzzle.x + this.bgPuzzle.width*0.3}, 500, Phaser.Easing.Sinusoidal.Out, true);
							tween.onComplete.add(function() {
								this.destroy();
							}, efek);
						}
						else if(obj.i == this.maxPuzzle-1) {
							for(var k=this.maxPuzzle-1;k>=0;k--) {
								if(this.arPuzMain[k][obj.j] != null) {
									// arChain.push(this.arPuzMain[obj.i][k]);
									this.checkPuzBubble(this.arPuzMain[k][obj.j]);
									arChain.push(this.arPuzMain[k][obj.j]);
								}
							}
							var efek = this.genAnimHorVert(obj.x, obj.y, 'left');
							var tween = game.add.tween(efek).to({x: this.bgPuzzle.x - this.bgPuzzle.width*0.3}, 500, Phaser.Easing.Sinusoidal.Out, true);
							tween.onComplete.add(function() {
								this.destroy();
							}, efek);
						}
						else {
							for(var k=1;k<this.maxPuzzle;k++) {
								var max = obj.i + k;
								var min = obj.i - k;
								if(max < this.maxPuzzle) {
									if(this.arPuzMain[max][obj.j] != null) {
										this.checkPuzBubble(this.arPuzMain[max][obj.j]);
										arChain.push(this.arPuzMain[max][obj.j]);
									}
								}
								if(min >= 0) {
									if(this.arPuzMain[min][obj.j] != null) {
										this.checkPuzBubble(this.arPuzMain[min][obj.j]);
										arChain.push(this.arPuzMain[min][obj.j]);
										// trace("POS >>>", min, obj.j);
									}
								}
							}
							var efek = this.genAnimHorVert(obj.x, obj.y, 'left');
							var tween = game.add.tween(efek).to({x: this.bgPuzzle.x - this.bgPuzzle.width*0.3}, 500, Phaser.Easing.Sinusoidal.Out, true);
							tween.onComplete.add(function() {
								this.destroy();
							}, efek);
							var efek2 = this.genAnimHorVert(obj.x, obj.y, 'right');
							var tween2 = game.add.tween(efek2).to({x: this.bgPuzzle.x + this.bgPuzzle.width*0.3}, 500, Phaser.Easing.Sinusoidal.Out, true);
							tween2.onComplete.add(function() {
								this.destroy();
							}, efek2);
						}
					}
					else if(obj.spc == 2) {
						// vertikal
						csound.bomb();
						if(obj.j == 0) {
							for(var k=0;k<this.maxPuzzle;k++) {
								if(this.arPuzMain[obj.i][k] != null) {
									this.checkPuzBubble(this.arPuzMain[obj.i][k]);
									arChain.push(this.arPuzMain[obj.i][k]);
								}
							}
							var efek = this.genAnimHorVert(obj.x, obj.y, 'up');
							var tween = game.add.tween(efek).to({y: this.bgPuzzle.y + this.bgPuzzle.height*0.12}, 500, Phaser.Easing.Sinusoidal.Out, true);
							tween.onComplete.add(function() {
								this.destroy();
							}, efek);
						}
						else if(obj.j == this.maxPuzzle-1) {
							for(var k=this.maxPuzzle-1;k>=0;k--) {
								if(this.arPuzMain[obj.i][k] != null) {
									this.checkPuzBubble(this.arPuzMain[obj.i][k]);
									arChain.push(this.arPuzMain[obj.i][k]);
								}
							}
							var efek = this.genAnimHorVert(obj.x, obj.y, 'down');
							var tween = game.add.tween(efek).to({y: this.bgPuzzle.y + this.bgPuzzle.height*0.6}, 500, Phaser.Easing.Sinusoidal.Out, true);
							tween.onComplete.add(function() {
								this.destroy();
							}, efek);
						}
						else {
							for(var k=1;k<this.maxPuzzle;k++) {
								var max = obj.j + k;
								var min = obj.j - k;
								if(max < this.maxPuzzle) {
									if(this.arPuzMain[obj.i][max] != null) {
										this.checkPuzBubble(this.arPuzMain[obj.i][max]);
										arChain.push(this.arPuzMain[obj.i][max]);
									}
								}
								if(min >= 0) {
									if(this.arPuzMain[obj.i][min] != null) {
										this.checkPuzBubble(this.arPuzMain[obj.i][min]);
										arChain.push(this.arPuzMain[obj.i][min]);
									}
								}
							}
							var efek = this.genAnimHorVert(obj.x, obj.y, 'up');
							var tween = game.add.tween(efek).to({y: this.bgPuzzle.y + this.bgPuzzle.height*0.12}, 500, Phaser.Easing.Sinusoidal.Out, true);
							tween.onComplete.add(function() {
								this.destroy();
							}, efek);

							var efek2 = this.genAnimHorVert(obj.x, obj.y, 'down');
							var tween2 = game.add.tween(efek2).to({y: this.bgPuzzle.y + this.bgPuzzle.height*0.6}, 500, Phaser.Easing.Sinusoidal.Out, true);
							tween2.onComplete.add(function() {
								this.destroy();
							}, efek2);
						}
					}
				}
				// else {
				// 	trace("SPC == 0", obj.i, obj.j);
				// }
			}

			// console.log(arChain.length);
			game.time.events.add(Phaser.Timer.SECOND*delay, function() {
				if(this.spc != null) {
					if(this.spc == 0) {
						// SPECIAL BUBBLE
						this.clicked++;
						if(this.clicked == 1) {
							this.efek.destroy();
							this.efek = null;
							this.spc = null;
							return;
						}
					}
					else {
						this.efek.destroy();
						this.efek = null;
						if(this.back != null) {
							this.back.destroy();
							this.back = null;
						}
					}
				}
				var _ti = this.i;
				var _tj = this.j;
				this.destroy();
				game.curstate.arPuzMain[_ti][_tj] = null;
				game.curstate.genAnimJadi(this);
				game.curstate.tempCtrJadi++;
				// trace("POSISI >>>", game.curstate.tempCtrJadi, game.curstate.dtPuzJadi.l);
				if(game.curstate.tempCtrJadi >= game.curstate.dtPuzJadi.l) {
					game.curstate.aturPuzzle();
				}
			}, obj);
			
			delay += 0.1;
		}
		
		// if(this.arChain.length <= 0) {
		// 	this.aturPuzzle
		// }
		if(arChain.length > 0) {
			// this.dtPuzJadi.l += arChain.length;
			this.destroyPuzzle(arChain);
		}
	},

	onWeaponOverlap: function(player, weapon)
	{
		player.getHit(weapon.hitPoints);
		weapon.setDestroy();
	},

	checkSpawnEnemy: function()
	{
		if(this.arDtEnemy.length <= 0)
			return;

		// trace("CHECK SPAWN ENEMY >>>");
		for(var i=0;i<this.arDtEnemy.length;i++) {
			if(this.arDtEnemy[i].jml >= this.arDtEnemy[i].max)
				continue;

			this.arDtEnemy[i].ctr++;
			if(this.arDtEnemy[i].ctr >= this.arDtEnemy[i].delay) {
				this.genEnemy(this.arDtEnemy[i].name);
				this.arDtEnemy[i].jml++;
				this.arDtEnemy[i].ctr = 0;
				// trace("JUMLAH >>>", this.arDtEnemy[i].jml, this.arDtEnemy[i].max, i);
			}
		}
	},

	setClueOn: function()
	{
		// return;		// hack
		this.isClue = true;
		for(var i=0;i<this.arCheck.length;i++) {
			var _i = this.arCheck[i].i;
			var _j = this.arCheck[i].j;
			var tween = game.add.tween(this.arPuzMain[_i][_j].scale).to({x: 1.25, y: 1.25}, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
			this.arPuzTween.push(tween);
			this.arPuzMain[_i][_j].isClue = true;
		}
		this.ctrChPuz = this.maxCtrChPuz;
	},

	setClueOff: function()
	{
		// return;		// hack
		if(this.arPuzTween.length < 0)
			return;

		for(var i=0;i<this.arPuzTween.length;i++) {
			this.arPuzTween[i].stop();
		}

		for(var i=0;i<this.arPuzMain.length;i++) {
			for(var j=0;j<this.arPuzMain[i].length;j++) {
				if(this.arPuzMain[i][j] == null)
					continue;
				if(this.arPuzMain[i][j].isClue) {
					this.arPuzMain[i][j].isClue = false;
					this.arPuzMain[i][j].scale.setTo(1.1, 1.1);
				}
			}
		}

		this.arPuzTween = [];
		this.isClue = false;
	},

	checkShortcutKey: function()
	{
		if(game.input.keyboard.isDown(49)) {
			// trace("BUTTON DASH >>>");
			if(this.btnDash == null)
				return;
			this.onSpcClick(this.btnDash);
		}
		else if(game.input.keyboard.isDown(50)) {
			if(DataPlayer.upgradeLv[1] < 0 || this.btnShield == null)
				return;
			// trace("BUTTON SHIELD >>>");
			this.onSpcClick(this.btnShield);
		}
		else if(game.input.keyboard.isDown(51)) {
			if(DataPlayer.upgradeLv[2] < 0 || this.btnBerserk == null)
				return;
			// trace("BUTTON BERSERK >>>");
			this.onSpcClick(this.btnBerserk);
		}
	},

	update: function()
	{
		if (this.isTutor) {
			if (this.tutorNext && this.pnlTutor) {
				this.tutorNext.x = this.pnlTutor.x;
				this.tutorNext.y = this.pnlTutor.y + this.pnlTutor.height*0.5;
			}
		}

		if(this.isPause || this.isOver || this.isTutor)
			return;

		BaseState.prototype.update.call(this);

		this.checkShortcutKey();

		if(this.stage >= 3) {
			// special baru keluar setelah stage 3
			this.ctrCheck++;
			if(this.ctrCheck == 1800) {
			// if(this.ctrCheck == 300) {
				this.checkAchievement(2);
			}
			else if(this.ctrCheck == 3600) {
			// else if(this.ctrCheck == 400) {
				this.checkAchievement(5);
			}
			else if(this.ctrCheck == 5400) {
			// else if(this.ctrCheck == 600) {
				this.checkAchievement(8);
			}
		}

		if(!this.isSelect && !this.isClue) {
			if(this.ctrChPuz > 0)
				this.ctrChPuz--;
			if(this.ctrChPuz <= 0) {
				this.setClueOn();
				this.ctrChPuz = this.maxCtrChPuz;
			}
		}

		this.checkSpawnEnemy();
		game.physics.arcade.overlap(this.player, this.gWeapon, this.onWeaponOverlap, null, this);

		if(this.isAtur) {
			if(this.ctrPreAtur == this.ctrAtur) {
				// this.ctrPreAtur = 0;
				// this.ctrAtur = 0;
				this.preNewPuzzle();
				this.isAtur = false;
			}
		}

		if(this.isShuffle)
			return;

		var activePointer = game.input.activePointer;
		if(activePointer.isUp) {
			this.isSelect = false;
			this.isPuzAwal = false;
			this.dtPuzAwal.tipe = null;
			this.dtPuzAwal.i = null;
			this.dtPuzAwal.j = null;
			for(var i=0;i<this.maxPuzzle;i++) {
				for(var j=0;j<this.maxPuzzle;j++) {
					if(this.arPuzSel[i][j].visible) {
						this.arPuzSel[i][j].visible = false;
						this.arPuzMain[i][j].sel = false;
					}
				}
			}

			for(var i=0;i<this.arPuzLink.length;i++) {
				this.arPuzLink[i].destroy();
				this.arPuzLink[i] = null;
			}
			this.arPuzLink = [];

			if(this.arPuzJadi.length >= 3) {
				// puzzle jadi
				this.destroyPuzzle(this.arPuzJadi);
			}
			this.arPuzJadi = [];
			return;
		}

		loopPuz:
		for(var i=0;i<this.maxPuzzle;i++) {
			for(var j=0;j<this.maxPuzzle;j++) {
				var puz = this.arPuzMain[i][j];
				if(puz != null) {
					if(this.isPuzAwal) {
						if(puz.input.pointerOver(game.input.activePointer.id)) {
							if(Math.abs(puz.i - this.dtPuzAwal.i) >= 2 || Math.abs(puz.j - this.dtPuzAwal.j) >= 2)
								continue;

							if(puz.tipe == this.dtPuzAwal.tipe &&
								(Math.abs(puz.i - this.dtPuzAwal.i) == 1 || Math.abs(puz.j - this.dtPuzAwal.j) == 1) &&
								!puz.sel) {
								// puzzle awal sudah dipilih
								// var _i = this.dtPuzAwal.i;
								// var _j = this.dtPuzAwal.j;
								// var _s = 'game/';
								// var _a;
								// if(_j == puz.j) {
								// 	// bikin link horizontal
								// 	_s += 'link_hor';
								// 	if(_i < puz.i)
								// 		_a = {ax: 1, ay: 0.5};
								// 	else
								// 		_a = {ax: 0, ay: 0.5};
								// }
								// else if(_i == puz.i) {
								// 	// bikin link vertikal
								// 	_s += 'link_vert';
								// 	if(_j < puz.j)
								// 		_a = {ax: 0.5, ay: 0};
								// 	else
								// 		_a = {ax: 0.5, ay: 1};
								// }
								// else {
								// 	// bikin link diagonal
								// 	if(_i < puz.i && _j < puz.j) {
								// 		_s += 'link_diag_2';
								// 		_a = {ax: 1, ay: 0};
								// 	}
								// 	else if(_i < puz.i && _j > puz.j) {
								// 		_s += 'link_diag_1';
								// 		_a = {ax: 1, ay: 1};
								// 	}
								// 	else if(_i > puz.i && _j < puz.j) {
								// 		_s += 'link_diag_1';
								// 		_a = {ax: 0, ay: 0};
								// 	}
								// 	else if(_i > puz.i && _j > puz.j) {
								// 		_s += 'link_diag_2';
								// 		_a = {ax: 0, ay: 1};
								// 	}
								// }
								var dt = this.genTipeLink(this.dtPuzAwal, puz);

								// link = global.addSprite(puz.x, puz.y, _s);
								link = global.addSprite(puz.x, puz.y, dt.s);
								// link.anchor.setTo(_a.ax, _a.ay);
								link.anchor.setTo(dt.a.ax, dt.a.ay);
								this.arPuzLink.push(link);
								this.gPuzLink.add(link);

								this.arPuzSel[i][j].visible = true;
								this.dtPuzAwal.tipe = puz.tipe;
								this.dtPuzAwal.i = puz.i;
								this.dtPuzAwal.j = puz.j;
								puz.sel = true;
								// this.arPuzJadi.push({i: puz.i, j: puz.j, tipe: puz.tipe});
								csound.select();
								this.arPuzJadi.push(puz);

								break loopPuz;
							}
							else if(puz.sel && this.arPuzJadi.length > 1) {
								// batal karena kembali ke posisi sebelumnya
								var last = this.arPuzJadi.length-1;
								var idx = this.arPuzJadi.indexOf(puz);
								if(last - idx == 1) {
									this.arPuzLink[this.arPuzLink.length-1].destroy();
									this.arPuzLink.splice(this.arPuzLink.length-1, 1);
									var _i = this.arPuzJadi[last].i;
									var _j = this.arPuzJadi[last].j;
									this.arPuzMain[_i][_j].sel = false;
									this.arPuzSel[_i][_j].visible = false;
									this.arPuzJadi.splice(last, 1);
									last = this.arPuzJadi.length-1;
									this.dtPuzAwal.tipe = this.arPuzJadi[last].tipe;
									this.dtPuzAwal.i = this.arPuzJadi[last].i;
									this.dtPuzAwal.j = this.arPuzJadi[last].j;
								}
							}
						}
					}
					else {
						if(puz.input.pointerDown(game.input.activePointer.id) && !puz.sel) {
							// puzzle awal dipilih
							this.isSelect = true;
							this.ctrChPuz = this.maxCtrChPuz;
							this.setClueOff();
							this.arPuzSel[i][j].visible = true;
							this.isPuzAwal = true;
							this.dtPuzAwal.tipe = puz.tipe;
							this.dtPuzAwal.i = puz.i;
							this.dtPuzAwal.j = puz.j;
							puz.sel = true;
							csound.select();
							// this.arPuzJadi.push({i: puz.i, j: puz.j, tipe: puz.tipe});
							this.arPuzJadi.push(puz);
							break loopPuz;
						}
					}
				}
			}
		}
	},

	genTipeLink: function(dtPuzAwal, puzRef)
	{
		var _i = dtPuzAwal.i;
		var _j = dtPuzAwal.j;
		var _s = 'game/';
		var _a;
		if(_j == puzRef.j) {
			// bikin link horizontal
			_s += 'link_hor';
			if(_i < puzRef.i)
				_a = {ax: 1, ay: 0.5};
			else
				_a = {ax: 0, ay: 0.5};
		}
		else if(_i == puzRef.i) {
			// bikin link vertikal
			_s += 'link_vert';
			if(_j < puzRef.j)
				_a = {ax: 0.5, ay: 0};
			else
				_a = {ax: 0.5, ay: 1};
		}
		else {
			// bikin link diagonal
			if(_i < puzRef.i && _j < puzRef.j) {
				_s += 'link_diag_2';
				_a = {ax: 1, ay: 0};
			}
			else if(_i < puzRef.i && _j > puzRef.j) {
				_s += 'link_diag_1';
				_a = {ax: 1, ay: 1};
			}
			else if(_i > puzRef.i && _j < puzRef.j) {
				_s += 'link_diag_1';
				_a = {ax: 0, ay: 0};
			}
			else if(_i > puzRef.i && _j > puzRef.j) {
				_s += 'link_diag_2';
				_a = {ax: 0, ay: 1};
			}
		}

		return {s: _s, a: _a};
	},

	genTxtHP: function()
	{
		var txt = this.player.hp;
		if(this.txtHP == null) {
			this.txtHP = global.setText2(txt, this.item_0.x, this.item_0.y - this.item_0.height*0.25, 26, 0.5, 0.5, '#FFFF00');
			this.txtHP.align = 'center';
			this.txtHP.lineSpacing = -12;
			this.txtHP.stroke = '#000000';
			this.txtHP.strokeThickness = 3;
			this.gItem.add(this.txtHP);
		}
		else {
			this.txtHP.setText(txt);
		}

		// if(txt <= this.minHP)
		if(txt <= 0)
			this.txtHP.fill = '#FFFF00';
		else
			this.txtHP.fill = '#ffffff';
	},

	genTxtMP: function()
	{
		if(this.item_4 == null)
			return;

		var txt = this.player.mp;
		if(this.txtMP == null) {
			this.txtMP = global.setText2(txt, this.item_4.x, this.item_4.y - this.item_4.height*0.25, 26, 0.5, 0.5, '#FFFF00');
			this.txtMP.align = 'center';
			this.txtMP.lineSpacing = -12;
			this.txtMP.stroke = '#000000';
			this.txtMP.strokeThickness = 3;
			this.gItem.add(this.txtMP);
		}
		else {
			this.txtMP.setText(txt);
		}

		// if(txt <= this.minMP)
		if(txt <= 0)
			this.txtMP.fill = '#FFFF00';
		else
			this.txtMP.fill = '#ffffff';
	},

	genTxtStamina: function()
	{
		// console.log(this.player.stamina);
		var txt = this.player.stamina;
		if(this.txtStamina == null) {
			this.txtStamina = global.setText2(txt, this.item_1.x, this.item_1.y - this.item_1.height*0.25, 26, 0.5, 0.5, '#FFFF00');
			this.txtStamina.align = 'center';
			this.txtStamina.lineSpacing = -12;
			this.txtStamina.stroke = '#000000';
			this.txtStamina.strokeThickness = 3;
			this.gItem.add(this.txtStamina);
		}
		else {
			this.txtStamina.setText(txt);
		}

		// if(txt <= this.minStamina)
		if(txt <= 0)
			this.txtStamina.fill = '#FFFF00';
		else
			this.txtStamina.fill = '#ffffff';
	},

	genTxtAttack: function()
	{
		var txt = this.player.attack;
		if(this.txtAttack == null) {
			this.txtAttack = global.setText2(this.player.attack, this.item_2.x, this.item_2.y - this.item_2.height*0.25, 26, 0.5, 0.5, '#ffffff');
			this.txtAttack.align = 'center';
			this.txtAttack.stroke = '#000000';
			this.txtAttack.strokeThickness = 3;
			this.gItem.add(this.txtAttack);
		}
		else {
			this.txtAttack.setText(txt);
		}

		if(txt <= this.minAttack)
			this.txtAttack.fill = '#FFFF00';
		else
			this.txtAttack.fill = '#ffffff';
	},

	genTxtDefend: function()
	{
		// console.log(this.item_3, this.player.defend);
		if(this.item_3 == null)
			return;

		var txt = this.player.defend;
		// trace("PLAYER ARMOR >>>", txt);
		if(this.txtDefend == null) {
			this.txtDefend = global.setText2(txt, this.item_3.x, this.item_3.y - this.item_3.height*0.25, 26, 0.5, 0.5, '#FFFF00');
			this.txtDefend.align = 'center';
			this.txtDefend.lineSpacing = -12;
			this.txtDefend.stroke = '#000000';
			this.txtDefend.strokeThickness = 3;
			this.gItem.add(this.txtDefend);
		}
		else {
			this.txtDefend.setText(txt);
		}

		// if(txt <= this.minDefend)
		if(txt <= 0)
			this.txtDefend.fill = '#FFFF00';
		else
			this.txtDefend.fill = '#ffffff';
	},

	genTxtCoins: function()
	{
		var txt = DataPlayer.coins;
		if(this.txtCoins == null) {
			this.txtCoins = global.setText2(txt, this.pnlCoins.x + this.pnlCoins.width*0.95, this.pnlCoins.y, 22, 1, 0.45, '#ffffff');
			this.txtCoins.stroke = '#000000';
			this.txtCoins.strokeThickness = 3;
			this.gUI.add(this.txtCoins);
		}
		else
			this.txtCoins.setText(txt);
	},

	genTxtGems: function()
	{
		var txt = DataPlayer.gems;
		if(this.txtGems == null) {
			this.txtGems = global.setText2(txt, this.pnlGems.x + this.pnlGems.width*0.95, this.pnlGems.y, 22, 1, 0.45, '#ffffff');
			this.txtGems.stroke = '#000000';
			this.txtGems.strokeThickness = 3;
			this.gUI.add(this.txtGems);
		}
		else
			this.txtGems.setText(txt);
	},

	genTxtItemValue: function(tipe, value)
	{

		// generate value yg item dapatkan atau yg item berkurang
		// var value = this.tempAddValue[tipe];
		// console.log(tipe, value);
		var ref = this['item_'+tipe];
		var txt, color;
		if(value >= 0) {
			csound.increase();
			txt = '+ ' + value;
			color = '#00CC00';
		}
		else {
			csound.decrease();
			txt = '- ' + Math.abs(value);
			color = '#CC0000';
		}
		// var txtItem = global.setText2(txt, ref.x, ref.y - ref.height*0.7, 24, 0.5, 1, color);
		var txtItem = global.setText2(txt, ref.x, ref.y - 50, 24, 0.5, 1, color);
		txtItem.stroke = '#000000';
		txtItem.strokeThickness = 3;
		this.gAnimItem.add(txtItem);
		var tween = game.add.tween(txtItem).to({y: txtItem.y - 15}, 750, Phaser.Easing.Sinusoidal.Out, true);
		tween.onComplete.add(function() {
			this.destroy();
		}, txtItem);
	},

	genTxtEnemyHP: function(t, x, y)
	{
		var txt = global.setText2('- '+t, x, y, 24, 0.5, 0.5, '#FF0000');
		txt.stroke = '#000000';
		txt.strokeThickness = 3;
		this.gTxtChar.add(txt);

		var tween = game.add.tween(txt).to({y: txt.y - 30}, 500, Phaser.Easing.Sinusoidal.Out, true);
		tween.onComplete.add(function() {
			this.destroy();
		}, txt);
	},

	render: function()
	{
		// if(this.arEnemy.length > 0) {
		// 	for(var i=0;i<this.arEnemy.length;i++) {
		// 		game.debug.body(this.arEnemy[i]);
		// 	}
		// }

		// game.debug.body(this.player);

		// if(this.arWeapon.length > 0) {
		// 	for(var i=0;i<this.arWeapon.length;i++) {
		// 		game.debug.body(this.arWeapon[i]);
		// 	}
		// }
	},
}, BaseState);