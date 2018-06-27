GAME.SteveTrail = function(stage)
{
	this.stage = stage;
	this.target = new PIXI.Point();
	this.particals = [];
	this.particalPool = new GAME.GameObjectPool(Partical);
	this.max = 100
	this.count = 0;
}

GAME.SteveTrail.constructor = GAME.SteveTrail;

GAME.SteveTrail.prototype.update = function()
{	
	if(this.target.isFlying && !this.target.isDead )
	{
		this.count++;
		
		if(this.count % 3)
		{
			var partical = this.particalPool.getObject();
			
			this.stage.addChild(partical);
			partical.position.x = this.target.view.position.x + ( Math.random() * 10)-5 - 20;
			partical.position.y = this.target.view.position.y + 50;
			partical.direction = 0;
			partical.dirSpeed = Math.random() > 0.5 ? -0.1 : 0.1
			partical.sign = this.particals.length % 2 ? -1 : 1;
			partical.scaly = Math.random() *2 -1// - this.target.speed.x * 0.3;
			partical.speed.y = this.target.accel * 3;
			partical.alphay = 2;
			partical.rotation = Math.random() * Math.PI * 2;
			partical.scale.x = partical.scale.y = 0.2+Math.random() * 0.5;
			
			this.particals.push(partical);
		}
		
	}
	
	for (var i=0; i < this.particals.length; i++) 
	{
		var partical =  this.particals[i];
		
		partical.dirSpeed += 0.003 * partical.sign;
		if(partical.dirSpeed > 2)partical.dirSpeed = 2;
		
		partical.direction += partical.dirSpeed;
		
		partical.speed.x = Math.sin(partical.direction);// *= 1.1;
		partical.speed.y = Math.cos(partical.direction);

		partical.position.x += partical.speed.x * 5 * partical.scaly;
		partical.position.y += partical.speed.y * 3;
		
		partical.alphay *= 0.85;
		partical.rotation += partical.speed.x * 0.1;
		
		partical.alpha = partical.alphay > 1 ? 1 : partical.alphay;
		
		if(partical.alpha < 0.01)
		{
			this.stage.removeChild(partical);
			this.particals.splice(i, 1);
			this.particalPool.returnObject(partical);
			i--;
		}
	}	
}

Partical = function()
{
	PIXI.Sprite.call(this, PIXI.Texture.fromFrameId("starPops0004.png"));
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.speed = new PIXI.Point();
}

Partical.constructor = Partical;
Partical.prototype = Object.create( PIXI.Sprite.prototype );