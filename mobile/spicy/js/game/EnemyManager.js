/**
 * @author Mat Groves
 */

/**
 * @author Mat Groves
 */

var GAME = GAME || {};

GAME.EnemyManager = function(engine)
{
	this.engine = engine;
	
	this.pickups = [];
	
	this.pickupPool = new GAME.GameObjectPool(Enemy);
	this.spawnCount = 0;
	
	this.pos = 0
}

// constructor
GAME.EnemyManager.constructor = GAME.EnemyManager;

GAME.EnemyManager.prototype.update = function()
{
	if(!this.engine.joyrideMode)
	{
		this.spawnCount += TIME.DELTA_TIME;
		
		if(this.spawnCount > 105)
		{
			this.pos += 0.15;
		//	console.log(">>")
			this.spawnCount = 0;
		//	this.addPickup(this.engine.ball.position.z + 10000, 50)//Math.random() * 100)
		}
	}
	
	for (var i = 0; i < this.pickups.length; i++) 
	{
		var pickup = this.pickups[i]
		
		//pickup.update();
		
		if(pickup.isPickedUp)
		{
				
			pickup.ratio += (1-pickup.ratio)*0.3 * GAME.time.DELTA_TIME;
		//	pickup.view.scale.x = 1-pickup.ratio;
		//	pickup.view.scale.y = 1-pickup.ratio;
		//	pickup.position.x = pickup.pickupPosition.x + (this.engine.player.position.x - pickup.pickupPosition.x) * pickup.ratio;
		//	pickup.position.y = pickup.pickupPosition.y + (this.engine.player.position.y - pickup.pickupPosition.y) * pickup.ratio;
			
			if(pickup.ratio > 0.99)
			{
				this.pickupPool.returnObject(pickup);
				this.pickups.splice(i, 1);
				this.engine.view.game.removeChild(pickup.view);
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

GAME.EnemyManager.prototype.addPickup = function(z, x)
{
	var pickup = this.pickupPool.getObject();
	pickup.exploding = false;
	// map z to track..
	pickup.position.z = z
	pickup.position.x = x
	this.engine.view.road.mapPosition(pickup.position)
	
	this.pickups.push(pickup);
	this.engine.view.add(pickup);
}

GAME.EnemyManager.prototype.addWall = function(z, x, width)
{
	var pickup = this.pickupPool.getObject();
	pickup.exploding = false;
	// map z to track..
	pickup.position.z = z;
	pickup.position.x = x + width/2;
	
	if(width)
	{
		pickup.wallWidth = pickup.visualWidth = width;
		pickup.wallHeight = pickup.visualHeight = 300;
		if(width < ( 270 + 65 ) *3 )
		{
			pickup.view = this.engine.world.walls[0];
		}
		else
		{
			 pickup.view = this.engine.world.walls[1]; 
		}
	}
	else
	{
		pickup.wallWidth = this.engine.world.baddy[0].width * 1.5;
		pickup.wallHeight = this.engine.world.baddy[0].height * 2;
		pickup.visualWidth = this.engine.world.baddy[0].width * 2;
		pickup.visualHeight = this.engine.world.baddy[0].height * 2;
		
		pickup.view = this.engine.world.baddy[0];
	}
	
	
	

	this.engine.view.road.mapPosition(pickup.position)
	
	this.pickups.push(pickup);
	this.engine.view.add(pickup);
}

GAME.EnemyManager.prototype.removePickup = function(index)
{
	var pickup = this.pickups[index];
	pickup.isPickedUp = true;
	pickup.steve = this.engine.steve;
	pickup.pickupPosition = {x:pickup.position.x, y:pickup.position.y}//.clone();
	pickup.ratio = 0;
}

GAME.EnemyManager.prototype.restart = function()
{
	this.destroyAll();
}

GAME.EnemyManager.prototype.destroyAll = function()
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

GAME.EnemyManager.prototype.destroyAllOffScreen = function()
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
