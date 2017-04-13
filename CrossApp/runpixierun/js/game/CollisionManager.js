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
	this.playerVsBlock();
	this.playerVsPickup();
	this.playerVsFloor();
}

GAME.CollisionManager.prototype.playerVsBlock = function()
{
	var enemies = this.engine.enemyManager.enemies;
	var steve = this.engine.steve;
	
	for (var i = 0; i < enemies.length; i++) 
	{
		var enemy = enemies[i]
		
		var xdist = enemy.position.x - steve.position.x;
		if(xdist > -enemy.width/2 && xdist < enemy.width/2)
		{
			var ydist = enemy.position.y - steve.position.y;
		
			if(ydist > -enemy.height/2 - 20 && ydist < enemy.height/2 )
			{
				if(!steve.joyRiding)
				{
					steve.die();
					this.engine.gameover();
					enemy.hit();
				}
			}
		}
	}
}

GAME.CollisionManager.prototype.playerVsPickup = function()
{
	
	var pickups = this.engine.pickupManager.pickups;
	var steve = this.engine.steve;
	
	for (var i = 0; i < pickups.length; i++) 
	{
		var pickup = pickups[i]
		if(pickup.isPickedUp) continue;
        
		var xdist = pickup.position.x - steve.position.x;
		if(xdist > -pickup.width/2 && xdist < pickup.width/2)
		{
			var ydist = pickup.position.y - steve.position.y;
		
			if(ydist > -pickup.height/2 && ydist < pickup.height/2)
			{
				this.engine.pickupManager.removePickup(i);
				this.engine.pickup();
                
		//		i--;
			}
		}
	}
}

GAME.CollisionManager.prototype.playerVsFloor = function()
{
	var floors = this.engine.floorManager.floors;
	var steve = this.engine.steve;
	
	var max = floors.length;
	steve.onGround = false;
	
	if(steve.position.y > 610)
	{
		if(this.engine.isPlaying)
		{
			steve.boil();
			this.engine.view.doSplash();
			this.engine.gameover();
		}
		else
		{
			steve.speed.x *= 0.95;
			
            if(!interactive)
			{
                showGameover();
                interactive = true;
            }
            
            if(steve.bounce === 0) {
                steve.bounce++;
                steve.boil();
                this.engine.view.doSplash();
            }

			return;
		}
	}
	
	for (var i = 0; i < max; i++) 
	{
		var floor = floors[i];
		var xdist = floor.x - steve.position.x + 1135;
		
		if(steve.position.y > 477)
		{
			if(xdist > 0 && xdist < 1135)
			{
				if(steve.isDead)
				{
					steve.bounce++;
                    
					if(steve.bounce > 2)
					{						
						return;
					}
                    FidoAudio.play('thudBounce');
					steve.view.setTexture(steve.crashFrames[steve.bounce])
						
					steve.speed.y *= -0.7;
					steve.speed.x *= 0.8;
					
					if(steve.rotationSpeed > 0)
					{
						steve.rotationSpeed = Math.random() * -0.3;
					}
					else if(steve.rotationSpeed === 0)
					{
						steve.rotationSpeed = Math.random() * 0.3;
					}
					else
					{
						steve.rotationSpeed = 0;
					}
				}
				else
				{
					steve.speed.y = -0.3;
				}
				
				if(!steve.isFlying)
				{
					steve.position.y = 478;
					steve.onGround = true;
					
				}	
			}
		}
	}

    if(steve.position.y < 0)
    {
         steve.position.y = 0;
         steve.speed.y *= 0;
    }
}
