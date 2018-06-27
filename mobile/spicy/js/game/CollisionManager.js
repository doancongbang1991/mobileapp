/**
 * @author Mat Groves
 */

/**
 * @author Mat Groves
 */

var GAME = GAME || {};

var laserCount = 0;

GAME.CollisionManager = function(engine)
{
	this.engine = engine;
}

// constructor
GAME.CollisionManager.constructor = GAME.CollisionManager;

GAME.CollisionManager.prototype.update = function()
{
	//if(this.engine.isPlaying) 
	//this.playerVsBlock();
	
	if(this.engine.ball.isDead)return;
	
	this.playerVsPickup();
	this.playerVsEnemy();
	//this.playerVsFloor();
}

GAME.CollisionManager.prototype.playerVsEnemy = function()
{
	var enemies = this.engine.enemyManager.pickups;
	var steve = this.engine.ball;
	
	for (var i = 0; i < enemies.length; i++) 
	{
		var enemy = enemies[i]
		
		var zdist = enemy.position.z + 100 - steve.position.z;
		
		var depth = 10//enemy.width + steve.width// * 3;
		
		if(zdist > -depth/2 && zdist < steve.width/2)
		{
			var xdist = enemy.position.x - steve.position.x;
		
			if(xdist > -enemy.wallWidth/2 && xdist < enemy.wallWidth/2)
			{
			//	alert(zdist)
			//	pickup.view.alpha = 0.4;
			//	steve.die();
			//	console.log(steve.position.y + " : " + enemy.position.y);
				//297.97686273557645 : -297.83869584184487 
				//-269.65788265418746 : -274.6897186094575 CollisionManager.js:52
				if(steve.position.y > enemy.position.y - (enemy.wallHeight - 100))
				{
				//	console.log("!!!" );
				
					if(steve.powermode != Ball.GIANT)
					{
						steve.deathHit();
						this.engine.gameover();
					}
					else
					{
						enemy.explode();
					}
					
				}
			//	this.engine.pickupManager.removePickup(i);
				//this.engine.pickup();
		//		i--;
			}
		}
	}
}

GAME.CollisionManager.prototype.playerVsPickup = function()
{
	
	var pickups = this.engine.pickupManager.pickups;
	var steve = this.engine.ball;
	
	for (var i = 0; i < pickups.length; i++) 
	{
		var pickup = pickups[i]
		if(pickup.isPickedUp)continue;
		
	
		var zdist = pickup.position.z - steve.position.z;
		
		// early out!
		if(zdist > 500 + steve.hitDistance)break;
		
		//console.log("HIT?")
		var depth = pickup.width + steve.width + steve.hitDistance// * 3;
		
		if(zdist > -depth/2 && zdist < depth/2)
		{
			var xdist = pickup.position.x - steve.position.x;
		
			if(xdist > -depth/2 && xdist < depth/2)
			{
		//		var ydist = pickup.position.y - steve.position.y;
				//var depth =  pickup.width + steve.width 
				//if(ydist > -depth/2 && ydist < depth/2)
				{
				//	pickup.view.alpha = 0.4;
				//	steve.die();
					if(pickup.powerup)
					{
						if(!steve.jumping)return;
						
					//	steve.magnetMode();
						var rand = Math.random();
						
						if(pickup.id == 0)
						{
							steve.magnetMode();
						}
						else if(pickup.id == 1)
						{
							steve.chargeMode();
						}
						else
						{
							steve.giantMode();
						}
						
					}	
					
					
					steve.pulse();
					this.engine.pickupManager.removePickup(i);
					this.engine.pickupCount++;
					this.engine.score += 100;
					//this.engine.pickup();
			//		i--;
				}
			}
		}
	}
}