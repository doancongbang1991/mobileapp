/**
 * @author Mat Groves
 */

/**
 * @author Mat Groves
 */

var GAME = GAME || {};

var laserCount = 0;

GAME.PickupManager = function(engine)
{
	this.engine = engine;
	
	this.pickups = [];
	
	this.pickupPool = new GAME.GameObjectPool(Pickup);
	this.spawnCount = 000;
	this.count = 0;
	this.offsetCount = 0;
	
	this.textures = [];
	
	for (var i=0; i < 40; i+=2) {
	  
//	  var image = new Image();
//	  image.crossOrigin = '';
	  
	  var pos = i;
	  var id =  (i < 8) ? "0" + (i+2) : (i +2) ;
	  
	//  image.src = REMOTE_PATH + "img/pickups/goldenCrumb/crumb00" +id+ ".png";
	  this.textures.push(PIXI.Texture.fromFrame("crumb00" +id+ ".png"));
	  
	  
	};
	
	
	this.powerupTexture = [];
	
	for (var i=0; i < 40; i+=2) {
	  
	  //var image = new Image();
	 // image.crossOrigin = '';
	   var id =  (i < 8) ? "0" + (i+2) : (i +2) ;
	  
		//  image.src = REMOTE_PATH + "img/pickups/magChill/magChill00" + id + ".png";//"img/rings/Ring_0" + (i+1) + ".png";
	 // this.powerupTexture.push(image);
	  this.powerupTexture.push(PIXI.Texture.fromFrame("magChill00" +id+ ".png"));
	  
	  
	};
	
	this.powerupTexture2 = [];
	
	for (var i=0; i < 40; i+=2) {
	  
	  //var image = new Image();
	///  image.crossOrigin = '';
	  var id =  (i < 8) ? "0" + (i+2) : (i +2) ;
	  //image.src = REMOTE_PATH + "img/pickups/rainbowRoad/powerUps_rainbow00" + id +".png";//"img/rings/Ring_0" + (i+1) + ".png";
	//  this.powerupTexture2.push(image);
	  
	   this.powerupTexture2.push(PIXI.Texture.fromFrame("powerUps_rainbow00" +id+ ".png"));
	  
	 
	};
	
	this.powerupTexture3 = [];
	
	for (var i=0; i < 10; i++) {
	  
	  var image = new Image();
	  image.crossOrigin = '';
	  image.src = REMOTE_PATH + "img/pickups/pickupDestructo.png";//"img/rings/Ring_0" + (i+1) + ".png";
	  this.powerupTexture3.push(image);
	  
	  
	};
	
	this.pos = 0
}

// constructor
GAME.PickupManager.constructor = GAME.PickupManager;

GAME.PickupManager.prototype.update = function()
{
	if(this.joyrideMode)
	{
		this.spawnCount += TIME.DELTA_TIME;
		
		if(this.spawnCount > 15 * 3)
		{
			this.pos += 0.15;
			this.spawnCount = 0;
			
			
			var ratio = (Math.sin(this.pos * 3) + 1 ) * 0.5;
		//	console.log(ratio)
			
			this.addSuperPowerup(this.engine.ball.position.z + PROFILE.drawDistance, 0.3 + (ratio *0.4))
		//	this.addSuperPowerup(this.engine.ball.position.z + 7000, 0)
		}
	}
	
	this.spawnCount += TIME.DELTA_TIME;
	//console.log(this.spawnCount)
	if(this.spawnCount > 1000)
	{
		this.pos += 0.15;
		this.spawnCount = 0;
		
		//var ratio = (Math.sin(this.pos * 3) + 1 ) * 0.5;
		this.addPowerup(this.engine.ball.position.z + PROFILE.drawDistance, 0.5, Math.floor(Math.random() * 2))//30 + (ratio *40))
	}
		
	this.count += TIME.DELTA_TIME * 0.3;
	
	for (var i = 0; i < this.pickups.length; i++) 
	{
		var pickup = this.pickups[i]
		
		if(!pickup.powerup)
		{
			pickup.view = this.textures[Math.round((pickup.offset) + this.count) % 20];
		}
		else
		{
			pickup.view = pickup.frames[Math.round((pickup.offset) + this.count) % pickup.frames.length];
		}
		//	console.log(pickup.view )
		//pickup.update();
		
		if(pickup.isPickedUp)
		{
			pickup.scale = 3 * (1-pickup.ratio *0.5) ;
		//	pickup.view.scale.y = 1-pickup.ratio;
			pickup.position.x = pickup.pickupPosition.x + (this.engine.ball.position.x - pickup.pickupPosition.x) * pickup.ratio;
			pickup.position.y = pickup.pickupPosition.y + (this.engine.ball.position.y - pickup.pickupPosition.y - 50) * pickup.ratio;
			pickup.position.z = pickup.pickupPosition.z + (this.engine.ball.position.z - pickup.pickupPosition.z + 10) * pickup.ratio;
			
			
			if(pickup.ratio > 0.99)
			{
				if(APP.pickupSound)
				{
					if(pickup.powerup)
					{
						APP.powerupSound.play();
					}
					else
					{
						APP.pickupSound.play();
					}
				}
				this.pickupPool.returnObject(pickup);
				this.pickups.splice(i, 1);
				this.engine.view.remove(pickup);
				
				i--;
			}
	
		}
		else
		{
			if(pickup.position.z < -this.engine.view.camera.z)
			{
				// remove!
				
				this.engine.view.remove(pickup);
				this.pickupPool.returnObject(pickup);
				this.pickups.splice(i, 1);
				i--;
			}
		}
		
	}
}


GAME.PickupManager.prototype.restart = function()
{
	this.destroyAll();
	this.spawnCount = 0;
	this.joyrideMode = false;
}

GAME.PickupManager.prototype.addPickup = function(z, x)
{
	var pickup = this.pickupPool.getObject();
	pickup.powerup = false;
	// map z to track..
	pickup.position.z = z;
	pickup.position.x = x;
	pickup.offset = this.offsetCount;
	this.offsetCount+= Math.floor(40/6);
	this.engine.view.road.mapPosition(pickup.position)
	
	this.pickups.push(pickup);
	this.engine.view.add(pickup);
}

GAME.PickupManager.prototype.addSuperPowerup = function(z, x)
{
	var pickup = this.pickupPool.getObject();
	// map z to track..
	pickup.position.z = z
	pickup.position.x = x
	pickup.offset = this.offsetCount;
	this.offsetCount++;
	this.engine.view.road.mapPowerup(pickup.position, x)
//	pickup.position.y -= 500;
	
	
	this.pickups.push(pickup);
	this.engine.view.add(pickup);
}

GAME.PickupManager.prototype.addPowerup = function(z, x, id)
{
	var pickup = this.pickupPool.getObject();
	pickup.powerup = true;
	pickup.id = id//Math.floor(Math.random() * 2);
	
	if(pickup.id == 0)
	{
		pickup.frames = this.powerupTexture
	}
	else if(pickup.id == 1)
	{
		pickup.frames = this.powerupTexture2
	}
	else
	{
		pickup.frames = this.powerupTexture3
		
	}
	// map z to track..
	pickup.position.z = z
	pickup.position.x = x
	pickup.offset = this.offsetCount;
	this.offsetCount++;
	this.engine.view.road.mapPowerup(pickup.position, 0.5)
	pickup.position.y -= 700;
	
	
	this.pickups.push(pickup);
	this.engine.view.add(pickup);
}

GAME.PickupManager.prototype.removePickup = function(index)
{
	var pickup = this.pickups[index];
	if(!pickup)return;
	
	pickup.isPickedUp = true;
	pickup.steve = this.engine.ball;
	pickup.pickupPosition = {x:pickup.position.x, y:pickup.position.y, z:pickup.position.z}//.clone();
	pickup.ratio = 0;
	
	if(this.engine.ball.powermode == Ball.MAGNET)
	{
		TweenLite.to(pickup, 0.3, {ratio:1, ease:Sine.easeIn});
	}
	else
	{
		TweenLite.to(pickup, 0.1, {ratio:1, ease:Sine.easeOut});
	}
}


GAME.PickupManager.prototype.destroyAll = function()
{
	for (var i = 0; i < this.pickups.length; i++) 
	{
		var pickup = this.pickups[i]
			// remove!
		this.pickupPool.returnObject(pickup);
		this.engine.view.remove(pickup);
	}
	
	this.pickups = [];
}

GAME.PickupManager.prototype.destroyAllOffScreen = function()
{
	for (var i = 0; i < this.pickups.length; i++) 
	{
		var pickup = this.pickups[i];
		
		if(pickup.x > GAME.camera.x + GAME.width)
		{
			this.pickupPool.returnObject(pickup);
			this.engine.view.game.removeChild(pickup.view);
			this.pickups.splice(i, 1);
			i--;
		}
			// remove!
		
	}
	
}
