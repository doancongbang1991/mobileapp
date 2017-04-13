
var GAME = GAME || {};

GameElement = function()
{
	
	// image
	this.view = new Image();
	//this.view.src = "img/McBite.png";
	this.frame = false;
	
	this.position = {x:0, y:0, z:0};
	this.screenPosition = {x:0, y:0};
	this.scale = 0.8;
	
	this.rotation = 0;	
	this.timeModifyer = 1;
	
	this.heightRatio = 1;
	
	this.width = 100;
	this.height = 100;
	
	this.alpha = 1;
}

GameElement.prototype.addMovement = function()
{
	this.dx = 0;
	this.ax = 0;
	this.fx = 0.5;
	this.max = 30;
	
	this.dy = 0;
	this.ay = 3;
	this.fy = 0;
	this.max = 30;
	this.targetSpeed = 0;
}


		
		// P R I V A T E -------------------------------------------------//
		
GameElement.prototype.computeVelocity = function(velocity, acceleration, friction, maxVelocity)
{
	
	//velocity = velocity + gravity*delta_time/2
	//position = position + velocity*delta_time	
	//velocity = velocity + gravity*delta_time/2
	
	
	// apply the friction this is not a multiplyer!
	
	var f = friction * TIME.DELTA_TIME *  this.timeModifyer;
	
	// calculate friction multiply.. velocity *= Math.pow(f, engine.elapsedTime);
				
	if(velocity - f > 0)
	{
		velocity -= f;
	}
	else if(velocity + f < 0)
	{
		velocity += f;
	}
	else
	{
		velocity = 0;
	}
	
	// apply acceleration
	velocity += acceleration * TIME.DELTA_TIME * this.timeModifyer;
	
	// cap the velocity 
	
	if(velocity != 0 && maxVelocity != 10000)
	{
		if(velocity > maxVelocity)
		{
			velocity = maxVelocity;
		}
		else if(velocity < -maxVelocity)
		{
			velocity = -maxVelocity;
		}
	}
	//return Velocity * FlxG.elapsed + (acc * FlxG.elapsed * FlxG.elapsed) / 2;
	return velocity;
}