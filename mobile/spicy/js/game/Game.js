
var GAME = GAME || {};
GAME.LOW = false;


Game = function(viewContainer)
{
	
	GAME.LOW =  APP.inAPP;
	
//	this.world = 
	
	this.isGameover = false;
	
	this.view = new View(this, viewContainer);
	
	//pickup manager
	this.pickupManager = new GAME.PickupManager(this);
	this.enemyManager = new GAME.EnemyManager(this);
	
	this.collisionManager = new GAME.CollisionManager(this);
	
	this.trackManager = new GAME.TrackManager(this);
	this.extraManager = new GAME.ExtraManager(this);
	
	this.difficulty = 2;
	
	//enemy manager
	// controller
	
	//ball
	//road
	
	//score
	//view
	
	
	
	//this.start();
	
	/*
	for (var i=100; i > 0; i--) {
	 
	 	var ball = new GameElement();
	 	
	 	this.view.add(ball);
	 	
	 	ball.position.x = (Math.random()-0.5) * 800 ;
	 	ball.position.z = i * 500;
	// 	ball.position.y = i * -100;
	 	
	};*/
	this.ballSpeed = 1;
	this.ball = new Ball(this);
	this.view.add(this.ball);
//	this.view.add(this.ball.shadow);
	
	this.controller =  new Controller(this);
	
	this.worlds = [World.jungle, World.ice, World.desert];
	this.worldCount = 0;
	
	if(APP.startLevel)
	{
		if(APP.startLevel > 3)APP.startLevel = 3;
		else if(APP.startLevel < 1)APP.startLevel = 1;
		this.worldCount = APP.startLevel - 1;
		this.setWorld(this.worlds[APP.startLevel-1]);
	}
	else
	{
		this.setWorld(World.jungle);
		
	}
	
	this.pickupCount = 0;
	this.pickupTarget = 200;
	
	this.score = 0;
	APP.view = this;
	
	APP.stage.click = APP.stage.tap = function(e){
		
		//PIXI.runList(APP.stage);
		//this.ball.magnetMode();
		return;
		
		if(this.playing)
		{
			if(e.global.y > 100)
			{
				this.pickupCount = 199
			}
			else
			{
				this.ball.chargeMode();
			}
		//	this.ball.giantMode();
	//		this.ball.chargeMode();
		//	this.ball.giantMode();
		//	this.restart();
		//	console.log("HI MUM")
		//this.gameover();
		//	this.worldCount++;
		//	this.fadeWorld(this.worlds[this.worldCount % 3]);
			
			
		}
		
	}.bind(this);
	
	this.diffStep = 0;
	
}

Game.prototype.start = function()
{
	if(this.playing)return;
	this.restart();
	this.playing = true;
	this.view.white.visible = false;
	this.view.visible = true;
	requestAnimationFrame(this.update.bind(this));
	
	// reset everything!
	
}

Game.prototype.stop = function()
{
	this.playing = false;
	this.view.visible = false;
	requestAnimationFrame(this.update.bind(this));
}

Game.prototype.setWorld = function(worldData, swap)
{
	/*
	if(swap)
	{
		this.trackManager.flatternOut();
		this.view.road.flatten(this.ball);
		this.pickupManager.destroyAll();
		this.enemyManager.destroyAll();
		TweenLite.to(TIME, 1, {speed: 2, ease:Sine.easeOut});
	
	}
	else
	{*/
		this.world = worldData;
		this.view.setWorld(this.world);
//	}	
}

Game.prototype.fadeWorld = function(worldData)
{
	this.view.hud.ascension();
	this.ball.ascend();
	this.nextWorld = worldData;
	
	this.view.white.visible = true;
	this.view.white.alpha = 0;
//	this.ballSpeed = 0;
	TweenLite.to(this, 0.3, {ballSpeed:0});
	TweenLite.to(this.view.camera,1, {ratio:0, ease:Sine.easeOut});
	TweenLite.to(this.view.white, 1.5, {delay: 0.5, alpha:1, ease:Sine.easeIn, onComplete:this.onWorldComplete.bind(this)});
}

Game.prototype.onWorldComplete = function()
{
	//this.ball.desend();
	this.trackManager.showTutorial = false;
	
	this.ball.reset();
	
	this.ballSpeed = 1;
	
	TIME.speed = 1;
	
	this.trackManager.restart(true);
	this.pickupManager.restart();
	this.enemyManager.restart();
	this.extraManager.restart();
		
	this.setWorld(this.nextWorld);
	this.view.reset();//road.reset();

	TweenLite.to(this.view.white, 2, {delay: 0, alpha:0, ease:Sine.easeIn, onComplete:this.onWorldShown.bind(this)});
}

Game.prototype.onWorldShown = function()
{
	this.view.white.visible = false;
}


Game.prototype.update = function(w, h)
{
	
	if(this.playing)requestAnimationFrame(this.update.bind(this));
	if(this.paused)return;

	
	TIME.update();
	this.trackManager.update();
	
	this.controller.update();
	this.pickupManager.update();
	this.enemyManager.update();
	//if(!GAME.LOW)
	this.extraManager.update();
	this.collisionManager.update();
		
	this.view.hud.setScore(this.pickupCount / this.pickupTarget, this.score);
	
	if(this.pickupCount >= this.pickupTarget)
	{
		this.pickupCount = 0;
		//this.setWorld();
		this.worldCount++;
		this.fadeWorld(this.worlds[this.worldCount % this.worlds.length]);
		
	}
	
	this.diffStep+=TIME.DELTA_TIME;
	if(this.diffStep > 20 * 60)
	{
		this.diffStep = 0;
		this.difficulty += 0.025;
	//	console.log("SPEED UP: " + this.difficulty )
	}
	
	var dist = 30 * TIME.DELTA_TIME * this.ballSpeed * 1 * this.difficulty * PROFILE.speedMod ;
	this.score += dist * 0.1;
	
	this.ball.position.z += dist// 1//* 0.1;
	
//	console.log(this.ball.position.z)
}

Game.prototype.gameover = function()
{
	if(this.isGameover)return;
	this.isGameover = true;
	
	this.trackManager.showTutorial = false;
	
	if(this.ball.state != Ball.FALLING)TweenLite.to(TIME, 0.6, {speed: 0.1, ease:Sine.easeOut});
	TweenLite.to(TIME, 1.5, {delay: 0.7, speed:1, ease:Sine.easeIn});
	
	this.view.white.visible = true;
	this.view.white.alpha = 0;
	this.view.camera.lock = true;

	if(this.ball.state != Ball.FALLING)
	{
		TweenLite.to(this.view.white, 2, {delay: 1, alpha:1, ease:Sine.easeIn, onComplete:this.onFadeComplete.bind(this)});
		TweenLite.to(this.view.camera,1, {ratio:0, ease:Sine.easeOut}); 
	}
	else
	{
		TweenLite.to(this.view.white, 1, {delay: 0.5, alpha:1, ease:Sine.easeIn, onComplete:this.onFadeComplete.bind(this)});
		TweenLite.to(this.view.camera,1, {ratio:0, ease:Sine.easeOut}); 	
	}
	
	this.score = Math.floor(this.score);
	APP.score = this.score;
	//submit score!
	this.saved = true;
	this.faded = false;
	APP.pb = false;
	
	if(FacebookAPI.loggedIn)
	{
		this.saved = false;
		// auto submit!
		SteveAPI.submitScore(this.score, this.onSaveComplete.bind(this));
	}
	//TweenLite.to(this.view.camera,2, {dist:800, delay:1, ease:Sine.easeOut}); 
	//this.ball.deathHit();
}

Game.prototype.onSaveComplete = function(data)
{
	this.saved = true;
	APP.pb = data.success;
	
	if(this.faded)
	{
		this.stop();
		
		APP.simpleApp.gotoScreen(APP.gameoverScreen)
	}
}

Game.prototype.onFadeComplete = function()
{
	APP.stage.setBackgroundColor(0xFFFFFF);
	
	this.faded = true;
	
	if(this.saved)
	{
		this.stop();
		APP.simpleApp.gotoScreen(APP.gameoverScreen);
	}
}

Game.prototype.restart = function(w, h)
{
	//this.ball.reset();
	this.pickupCount = 0;
	//this.worldCount = 0;
	
	if(APP.startLevel)
	{
		if(APP.startLevel > 3)APP.startLevel = 3;
		else if(APP.startLevel < 1)APP.startLevel = 1;
		this.worldCount = APP.startLevel - 1;
		this.setWorld(this.worlds[APP.startLevel-1]);
	}
	else
	{
		//this.setWorld(World.jungle);
		
	}
	
	this.isGameover = false;
	this.ball.reset();
	this.pickupManager.restart();
	this.enemyManager.restart();
	this.extraManager.restart();
	this.trackManager.restart();
	
	this.view.camera.lock = false;
	this.view.camera.z = 10000;
	this.ball.position.z = 10000;
	
	this.ball.lastPosition.x = this.ball.position.x;
	this.ball.lastPosition.y = this.ball.position.y;
	this.ball.lastPosition.z = this.ball.position.z;
	
	this.trackManager.update();
	//this.trackManager.showTutorial();
	
	this.view.reset();//road.reset();
	this.paused = false;
	
	this.difficulty = 1;
	this.score = 0;
	
	
	if(this.trackManager.showTutorial)
	{
		this.pickupManager.spawnCount -= 1000;
	}	
}

Game.prototype.pause = function()
{
	this.paused = true;
}

Game.prototype.resume = function()
{
	this.paused = false;
}



Game.prototype.resize = function(w, h)
{

	this.view.resize(w,h);
}


