/**
 * @author Mat Groves
 */

/**
 * @author Mat Groves
 */

var GAME = GAME || {};

var laserCount = 0;

GAME.ExtraManager = function(engine)
{
	this.engine = engine;
	
	this.pickups = [];
	
	this.extraPool = new GAME.GameObjectPool(SignPost);
	this.spawnCount = 000;
	this.count = 0;
	
	
	this.spawnCount2 = 0;
	
	this.spawnCount3 = 0;
	
	this.offsetCount = 0;
	
	this.textures = [];
	
	for (var i=0; i < 10; i++) {
	  
	  var image = new Image();
	  image.src = REMOTE_PATH + "img/pickups/nugget.png";//"img/rings/Ring_0" + (i+1) + ".png";
	  this.textures.push(image);
	  
	  
	};
	
	
	this.powerupTexture = [];
	
	for (var i=0; i < 10; i++) {
	  
	  var image = new Image();
	  image.src = REMOTE_PATH + "img/rainbowChilly.png";//"img/rings/Ring_0" + (i+1) + ".png";
	  this.powerupTexture.push(image);
	  
	  
	};
	
	
	this.cloudImage = new Image();
	this.cloudImage.crossOrigin = ''
	this.cloudImage.src = REMOTE_PATH + "img/forest_cloud_01.png";
	
	this.signImage = new Image();
	this.signImage.crossOrigin = ''
	this.signImage.src = REMOTE_PATH + "img/signPost.png";
	this.county2 = 0;
	
	this.pos = 0;
	
	this.tutImage = new Image();
	this.tutImage.crossOrigin = ''
	this.tutImage.src = REMOTE_PATH + "img/desert_cloud.png";
	
	
}

// constructor
GAME.ExtraManager.constructor = GAME.ExtraManager;

GAME.ExtraManager.prototype.update = function()
{
	this.spawnCount += TIME.DELTA_TIME;
	
	if(PROFILE.extra )
	{
		

		if(this.spawnCount > 15 * 3 * 5)
		{
			this.pos += 0.15;
			this.spawnCount = 0;
			
			
			
			this.addSign(this.engine.ball.position.z + 7000,0.5)
		//	this.addSuperPowerup(this.engine.ball.position.z + 7000, 0)
		}
		
		this.spawnCount2 += TIME.DELTA_TIME;
		
		if(this.spawnCount2 > 15 * 3)
		{
			this.pos += 0.15;
			this.spawnCount2 = 0;
			
			
			
			this.addCloud(this.engine.ball.position.z + 7000,0.5)
		//	this.addSuperPowerup(this.engine.ball.position.z + 7000, 0)
		}
		
		this.spawnCount3 += TIME.DELTA_TIME;
		
		if(this.spawnCount3 > 15 * 3 * 5 * 0.7)
		{
			this.pos += 0.15;
			this.spawnCount3 = -Math.random() * 500;
			
			
			
			this.addIsland(this.engine.ball.position.z + 7000,0.5)
		//	this.addSuperPowerup(this.engine.ball.position.z + 7000, 0)
		}
	}
	for (var i = 0; i < this.pickups.length; i++) 
	{
			var pickup =  this.pickups[i];
			
			if(pickup.position.z < -this.engine.view.camera.z)
			{
				// remove!
//				console.log("GONE!")
				
				this.engine.view.remove(pickup);
				this.extraPool.returnObject(pickup);
				this.pickups.splice(i, 1);
				i--;
			}
	}
}


GAME.ExtraManager.prototype.restart = function()
{
	this.destroyAll();
}

GAME.ExtraManager.prototype.addIsland = function(z, x)
{
	var extra = this.extraPool.getObject();
	extra.view = this.engine.world.extras[2];
	extra.frame = false;
	var val = Math.random()
	
	
	// map z to track..
	extra.position.z = z
	extra.position.x = x
	this.engine.view.road.mapPowerup(extra.position, x)
	
	
	if(val < 0.5)
	{
		extra.position.x += 5000;
		
	}
	else
	{
		extra.position.x -= 5000;
	}
	extra.position.y += 1000;
	
	this.pickups.push(extra);
	this.engine.view.add(extra);
}

GAME.ExtraManager.prototype.addSign = function(z, x)
{
	var extra = this.extraPool.getObject();
	extra.frame = false;
	extra.view = this.engine.world.extras[0];
	
	
	
	// map z to track..
	extra.position.z = z;
	extra.position.x = x;
	this.engine.view.road.mapPowerup(extra.position, x)
	extra.position.y += 100;
	
	//console.log(extra.position.width);
	
	extra.scale = (extra.position.width * 5) / 804
	extra.scale = 10;
//	extra.seg
	this.pickups.push(extra);
	this.engine.view.add(extra);
}

GAME.ExtraManager.prototype.addCloud = function(z, x)
{
	var extra = this.extraPool.getObject();
	extra.view = this.cloudImage;
	extra.frame = false;
	// map z to track..
	extra.scale = 17 + Math.random() * 6;
	extra.position.z = z 
	
	
	this.county2 += 0.5;
	
	this.county2 = Math.random() * Math.PI;
	this.county2 %= Math.PI;
	
	this.county2 *= 1.2;
	extra.position.x = Math.sin(this.county2 - Math.PI/2) * 5000;
	
	this.engine.view.road.mapPowerup(extra.position, x)
	extra.position.y += Math.cos(this.county2 - Math.PI/2) * 5000//* 0.5;
	

	extra.position.y += 2000
	
	this.pickups.push(extra);
	this.engine.view.add(extra);
}

GAME.ExtraManager.prototype.addTut = function(z, x, type)
{
	var extra = this.extraPool.getObject();
	
	if(!this.tutMap)
	{
		this.tutMap = {
			
			tutObstacles:"avoid_obstacles.png",
			tutControl:"steer_keys.png",
			tutPickup:"collect_crumbs.png",
			tutJump:"jump_desktop.png",
			tutPowerup:"collect_powewrups.png",
			tutReady:"readyGO.png"
			
		}
		
		var controlType = APP.gameScreen.game.controller.controlMode;
		
		if(controlType == Controller.TOUCH)
		{
			this.tutMap.tutControl = "steer_touch.png";
			this.tutMap.tutJump = "jump_mobile.png";
		}
		else if(controlType == Controller.TILT)
		{
			this.tutMap.tutControl = "steer_tilt.png";
			this.tutMap.tutJump = "jump_mobile.png";
		}
		
		
		
	}	
	
	
//	this.tutImage = new Image();
//	this.tutImage.src = REMOTE_PATH + "img/tutorial/" + this.tutMap[type];
//	console.log(this.tutImage.src)
	extra.view = PIXI.Texture.fromFrame(this.tutMap[type]);
	extra.frame = true;
	
	var extraBg = this.extraPool.getObject();
	extraBg.frame = true;
	extraBg.view =  PIXI.Texture.fromFrame("tutorialBG.png");
	
	//console.log(z + " : " + x + " : " + type);
	// map z to track..
	extra.position.z = z
	extra.position.x = x
	
	if(type == "tutPowerup")
	{
		this.engine.pickupManager.addPowerup(z - 400,x, 0);
	//	pickup.id = 1;
	//	pickup.frames = this.powerupTexture
		// map z to track..
	
	}
	
	this.engine.view.road.mapPosition(extra.position);
	
	
	
//	this.engine.view.road.mapPowerup(extra.position, x)
	extra.position.y -= 1300;
	extra.position.y -= 300;
//	console.log(extra.position.x);
	
	extra.scale = 10;

	extraBg.position.x = extra.position.x;
	extraBg.position.y = extra.position.y// + 300;
	extraBg.position.z = extra.position.z+500;
	extraBg.scale = extra.scale;
//	extra.seg
	this.pickups.push(extra);
	this.engine.view.add(extra);
	
	this.pickups.push(extraBg);
	this.engine.view.add(extraBg);
}



GAME.ExtraManager.prototype.removeExtra = function(index)
{
	var pickup = this.pickups[index];
	if(!pickup)return;
	
	pickup.isPickedUp = true;
	pickup.steve = this.engine.ball;
	pickup.pickupPosition = {x:pickup.position.x, y:pickup.position.y, z:pickup.position.z}//.clone();
	pickup.ratio = 0;
	TweenLite.to(pickup, 0.1, {ratio:1, ease:Sine.easeOut});//.ratiopickup.ratio += (1-pickup.ratio)*0.1 * TIME.DELTA_TIME;
}


GAME.ExtraManager.prototype.destroyAll = function()
{
	for (var i = 0; i < this.pickups.length; i++) 
	{
		var pickup = this.pickups[i]
			// remove!
		this.extraPool.returnObject(pickup);
		this.engine.view.remove(pickup);
	}
	
	this.pickups = [];
}

SignPost = function()
{
	GameElement.call( this );
	this.view.crossOrigin = '';
	this.view.src = REMOTE_PATH + "img/signPost.png";
	this.scale = 9;
	this.width = 100;
	this.heightRatio = 0.85;
	this.currentFrame = 0;
}

SignPost.prototype = Object.create( GameElement.prototype );
