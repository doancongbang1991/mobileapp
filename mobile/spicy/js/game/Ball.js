
var GAME = GAME || {};

Ball = function(engine)
{
	GameElement.call( this );
	
	this.shadow = new GameElement();
	this.shadow.view.crossOrigin = '';
	this.shadow.view.src = REMOTE_PATH + "img/shadow.png";
	this.shadow.scale = 1.4;
	
	this.ax = 0;
	this.engine = engine;
		
	this.speed = 0;
	this.speedY = 0;
	
	this.realy = 0
	this.addMovement();
	this.width = 250;
	
	this.heightRatio = 0.7;
	
	this.isDead = false;
	this.scale = 1.5;
	this.state = Ball.NORMAL;
	
	this.powerupTimer = 0;
	this.powermode = Ball.NONE;
	
	this.spring = new Spring();
	
	this.baseScale = 1;
	
	this.pulseValue= 0;
	this.hitDistance = 0;// 1500; 
//	this.realPosition = {x:0, y:0, z:0};
//	this.ro
	this.frameCount = 0;
	this.frame= 0;
	this.textures = [];
	
	for (var i=0; i < 15; i++) {
	  
	//  var image = new Image();
	  var number = i + 1;
	  if(number < 10)number = "0" + number;
	 // image.crossOrigin = '';
	 // image.src = REMOTE_PATH + "img/player/bitesFrames_"+ number + ".png";//"img/rings/Ring_0" + (i+1) + ".png";
	  this.textures.push(PIXI.Texture.fromFrame("bitesFrames_"+ number + ".png"));
	  
	//  this.textures.push(image);
	  
	};
	
	this.view =  this.textures[0];
	
	this.texturesMagnet = [];
	
	for (var i=0; i < 15; i++) {
	  
	//  var image = new Image();
	  var number = i + 1;
	  if(number < 10)number = "0" + number;
	  this.texturesMagnet.push(PIXI.Texture.fromFrame("powerUpsMAG00"+ number + ".png"));
	  
	  
	};
	
//	console.log(this.texturesMagnet);
	this.lastPosition = {x:0, y:0, z:0};
	this.tempPosition = {x:0, y:0, z:0};
	
}

Ball.NORMAL = 0;
Ball.ACSENDING = 1;
Ball.DROPPING = 2;
Ball.FALLING = 3;
Ball.CRASHING = 4;

Ball.NONE = 0;
Ball.MAGNET = 1;
Ball.GIANT = 2;
Ball.CHARGE = 3;


Ball.prototype = Object.create( GameElement.prototype );

Ball.prototype.deathHit = function()
{
	if(this.isDead )return;
	
	if(APP.crashSound)APP.crashSound.play();
	this.state = Ball.CRASHING;
	
	this.isDead = true;
	this.dy = -100;
	
	this.targetSpeed = this.targetSpeed  > 0 ? 100 : -100;
	this.bashDirection =  this.targetSpeed > 0 ? 1 : -1;
	
	
	//console.log("LL")
}

Ball.prototype.update = function()
{
	this.spring.update();
	
	var diffSpeed = TIME.DELTA_TIME * this.engine.difficulty * PROFILE.speedMod;
	this.frameCount+= 0.34 * diffSpeed;
	this.frame = Math.floor(this.frameCount);
	this.view = this.textures[this.frame %  this.textures.length];
	
	//this.pulseValue += (1 - this.pulseValue) * 0.1;
	// update x..
	this.scale = ( 1.7 ) * this.baseScale;// + ( this.spring.x/10);
	// update y
	
	var ground = this.engine.view.road.hitTest(this, this.engine.view.camera);
	this.tempPosition = this.position;
	
	/*
	var steps = 3;
	var incx = (this.position.x - this.lastPosition.x) / steps;
	var incy = (this.position.y - this.lastPosition.y) / steps;
	var incz = (this.position.z - this.lastPosition.z) / steps;
	//console.log(incx * steps);
	var hitCount = 0;
	while(hitCount < steps)
	{
		hitCount++;
		this.tempPosition.x = this.lastPosition.x + incx*hitCount;
		this.tempPosition.y = this.lastPosition.y + incy*hitCount;
		this.tempPosition.z = this.lastPosition.z + incz*hitCount;
		
		
		if(this.hit)
		{
			this.position.x = this.tempPosition.x;
			this.position.y = this.tempPosition.y;
		//	this.position.z = this.tempPosition.z;
			break;
		}
		
	}
	*/
	//console.log(incx * hitCount)	
	this.ground = ground;
	
	this.lastPosition.x = this.position.x;
	this.lastPosition.y = this.position.y;
	this.lastPosition.z = this.position.z;
	
	
	var offsetGround = ground - this.realGround;
	
	
	
	if(this.powermode == Ball.CHARGE)
	{
		 diffSpeed = TIME.DELTA_TIME;
	}
	
	var jumpSpeed = diffSpeed + (TIME.DELTA_TIME - diffSpeed) * 0.5;/// * this.engine.difficulty;
	
	//if(!this.isDead)
	{
	
		
		//else
		//{
			
	//	}	
	}
	
	//console.log(this.leftDown + " : " + this.rightDown)
	
	if(this.state == Ball.NORMAL)
	{
		this.targetSpeed += ( (this.ax * 12) -  this.targetSpeed) * 0.2;
		
		this.rotation = this.targetSpeed * 0.02;
		
		if(this.isFalling)
		{
			this.deathFall();
			this.engine.gameover();
			//console.log("<>")	
		}
		
		
		this.dy += 2.5 *jumpSpeed;
		this.realy += this.dy * jumpSpeed;
		
		// ground test
		if(this.realy > offsetGround)
		{
			this.jumping =false;
			this.dy = 0//*= 0.1//-0.6;
			this.realy = offsetGround;
		}
		
	}
	else if(this.state == Ball.ACSENDING)
	{
		this.targetSpeed *= 0.8;
		this.dy -= 2.5 * diffSpeed;
		this.realy += this.dy * diffSpeed;
	}
	else if(this.state == Ball.DROPPING)
	{
		this.dy += 2.5 * diffSpeed;
		this.realy += this.dy *diffSpeed;
		
		if(this.realy > offsetGround)
		{
			this.state = Ball.NORMAL;
		}
	}
	else if(this.state == Ball.CRASHING)
	{
		//consol.elog(":::::::")
		this.rotation += this.bashDirection * diffSpeed;
		this.dy += 2.5 * diffSpeed;
		this.realy += this.dy * diffSpeed;
		this.targetSpeed = this.bashDirection * 10 * 5;
	}
	else if(this.state == Ball.FALLING)
	{
		this.rotation += this.bashDirection * diffSpeed;
		this.dy += 2.5 *diffSpeed;
		this.realy += this.dy * diffSpeed;
		this.targetSpeed = this.bashDirection * 10 * 5;
	}
	
	this.position.x += this.targetSpeed * diffSpeed;//xd;

	this.position.y = this.realGround + this.realy
	
	//this.shadow.position.x = this.position.x;
	//this.shadow.position.z = this.position.z;
//	this.shadow.position.y = this.realGround//this.realy - this.shadow.position.y);
	
//	this.shadow.scale = 2//1 - (ground - this.realy) / 1000;
//	this.shadow.scale *= this.baseScale;
//	this.shadow.alpha = this.shadow.scale/1.5;
	//if(this.ground == 12000 || this.isFalling)this.shadow.scale = 0;
//	if(this.shadow.scale < 0)this.shadow.scale = 0;

	if(this.powermode == Ball.MAGNET)
	{
		this.powerupTimer -= TIME.DELTA_TIME
		//console.log(this.powerupTimer)
		if(this.powerupTimer <= 0)
		{
			this.hitDistance = 0; 
			this.powermode = Ball.NONE;
		}
	}	
	else if(this.powermode == Ball.GIANT)
	{
		this.powerupTimer -= TIME.DELTA_TIME;
		//this.scale *= 3;
		
		//console.log(this.powerupTimer)
		if(this.powerupTimer <= 0)
		{
			this.hitDistance = 0; 
			
			this.width = 250;
	
			TweenLite.to(this, 0.4, {baseScale:1});
			this.powermode = Ball.NONE;
			TweenLite.to(TIME, 0.4, {speed:1});
	
			//this.camera.shake
			//this.engine.view.camera.dist = 800;
			TweenLite.to(this.engine.view.camera, 0.4, { dist:400, distY:1000, shake:0});
		}
	}	
	else if(this.powermode == Ball.CHARGE)
	{
		this.powerupTimer -= TIME.DELTA_TIME;
		//this.scale *= 3;
		
		if(this.engine.view.road.flatMode)
		{
			if(this.powerupTimer < 30 * 15)
			{
				this.engine.view.road.flatMode = false;
			}
		}
		//console.log(this.powerupTimer)
		if(this.powerupTimer <= 0)
		{
			this.engine.view.road.unFlatten();
			this.engine.pickupManager.joyrideMode = false;
			this.hitDistance = 0; 
			
			this.width = 250;
	
			this.powermode = Ball.NONE;
			TweenLite.to(TIME, 0.4, {speed:1});
	
			this.engine.trackManager.resume();
			//this.baseScale
			
	//		this.engine.pickupManager.destroyAll();
//			this.engine.enemyManager.destroyAll();
			//TIME.speed = 2;
			//this.engine.view.road.unFlatten();
	
			//this.camera.shake
			//this.engine.view.camera.dist = 800;
			TweenLite.to(this.engine.view.camera, 0.4, { dist:400, distY:1000, shake:0});
		}
	}	
	
	var ground = this.engine.view.road.hitTest(this, this.engine.view.camera);
	
}



Ball.prototype.magnetMode = function()
{
	this.hitDistance = 1500; 
	this.powerupTimer = 15 * 60;
	this.powermode = Ball.MAGNET;
	
}

Ball.prototype.giantMode = function()
{
	this.powerupTimer = 15 * 60;
	this.powermode = Ball.GIANT;
	//this.baseScale
	
	var delay = 0// 0.5;
	
	this.width = 250*3.5;
	
	TweenLite.to(this, 0.4, {baseScale:3.5, ease:Sine.easeOut, delay:delay});
	
//	TIME.speed = 0.01;
	TweenLite.to(TIME, 0.2, {speed:1.5, delay:delay});
	//this.camera.shake
	//this.engine.view.camera.dist = 800;
	TweenLite.to(this.engine.view.camera, 0.6, {delay:0 + delay, dist:800, distY:1800, shake:10, ease:Sine.easeOut});
}

Ball.prototype.chargeMode = function()
{
	this.powerupTimer = 15 * 60;
	this.powermode = Ball.CHARGE;
	//this.baseScale
	
	TweenLite.to(this.engine.view.camera, 0.6, {delay:0, dist:230, distY:800, shake:5, ease:Sine.easeOut});
	this.engine.pickupManager.destroyAll();
	this.engine.pickupManager.joyrideMode = true;
	this.engine.trackManager.pause();
	this.engine.enemyManager.destroyAll();
	//TIME.speed = 2;
	TweenLite.to(TIME, 0.2, {speed:2, delay:0});
	this.engine.view.road.flatten(this);
}

Ball.prototype.jump = function()
{
	if(this.state == Ball.NORMAL)
	{
		if(	APP.jumpSound)	APP.jumpSound.play();
		this.jumping = true;
		if(this.realy >= 0 && !this.isFalling)
		{
			this.dy = -60;
		}
	}
			//this.dy = 0
}

Ball.prototype.ascend = function()
{
	this.isAsending = true;
	//TweenLite.to(this.engine.view.camera, 1, { distY:1000, ease:Sine.easeOut});
	this.state = Ball.ACSENDING;
}

Ball.prototype.desend = function()
{
//	alert("!")
	this.dy = 0;
	this.isAsending = false;
}

Ball.prototype.deathFall = function()
{
	if(this.isDead )return;
	this.isDead = true;
	this.state = Ball.FALLING;
	//this.dx = this.dx > 0 ? 100 : -100;
	this.bashDirection = 0// this.dx > 0 ? 5 : -5;
}

Ball.prototype.pulse = function()
{
	this.spring.dx = 0.08;
//	this.pulseValue = 1.7;// 1 + Math.sin(item.rotation) * 0.25; 	
}

Ball.prototype.reset = function()
{
	this.isDead = false;
	this.dy = 0;
	this.dx = 0;
	
	this.targetSpeed = 0;
	
	this.speed = 0;
	this.speedY = 0;
	
	this.isAsending = false;
	//alert(	this.isAsending)
	this.realy = -1500;
	this.state = Ball.DROPPING;
	this.position.z = 0;
	this.position.x = 0;
	
	this.powerupTimer = 0
	
	this.hitDistance = 0; 
	this.width = 250;
	this.baseScale = 1;
	
	this.powermode = Ball.NONE;
	
			//this.camera.shake
			//this.engine.view.camera.dist = 800;
	
}

