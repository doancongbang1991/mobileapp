

PixiDust = function()
{
	PIXI.DisplayObjectContainer.call(this);
	
	this.particals = [];
	//this.particalPool = new GAME.GameObjectPool(ParticalDust);
	this.max = 20//30// 50// HIGH ? 50 : 5//GAME.HIGH_MODE ? 100 : 10;
	this.count = 0;
	this.maxDist = 1000;
	this.maxWidth = 4000;
	
	this.images = [];

	for (var i=0; i < 3; i++) {
		var image = new Image();
		//image.src = REMOTE_PATH + "img/treetopWorld/leaf"+ (i+1) +".png";
		image.crossOrigin = '';
		image.src = REMOTE_PATH + "img/treetopWorld/dust0"+ (i+1) +".png";
		
		this.images.push(image);
	};
	
	
	for (var i=0; i < this.max; i++) 
	{
		var partical = new ParticalDust()//new this.particalPool.getObject();
			
		partical.position.x = (Math.random()-0.5) * 5000;
		partical.position.y = -500 + Math.random() * 2000;
		partical.position.z = Math.random() * 110640;
		
		
		this.particals.push(partical);
		
		//this.addChild(partical);
	};
			
			
	this.focalLength = 150;
}

// constructor
PixiDust.constructor = PixiDust;
PixiDust.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

PixiDust.prototype.update = function(data)
{
	this.images = data;
}

PixiDust.prototype.render = function(context, camera)
{
	//PIXI.Rope.prototype.updateTransform.call(this);
	
	for (var i=0; i < this.particals.length; i++) 
	{
		var partical =  this.particals[i];
		
		var calcZ = partical.position.z + camera.z *2;
		
		calcZ %= this.maxWidth;
		if(calcZ < 0)calcZ += this.maxWidth;
		
		var scaleRatio = camera.focus/(camera.focus + calcZ);
		
		//partical.scale.x = partical.scale.y = scaleRatio * 1.0;
		partical.position.x += partical.speedX;
		var calcX = ( partical.position.x + camera.x ) + 4000;
		calcX %= 8000;
		if(calcX < 0)calcX += 8000;
		calcX -= 4000;
		
		partical.position.y += partical.speedY;
		var calcY = ( partical.position.y + camera.y ) + 500;
		calcY %= 2000;
		if(calcY < 0)calcY += 2000;
		calcY -= 500;
		
		var x2d = calcX * scaleRatio;
		var y2d = calcY * scaleRatio;
		
		
		
		//partical.rotation += partical.rotationSpeed
	//	console.log(camera.focus + " : "  + x2d + " :"  + y2d)
		scaleRatio *= 2.5;
		
		var image = this.images[partical.imageId];
		
		context.drawImage(image,
	 					  x2d,// - (this.image.width/2 * scaleRatio),
	 					  y2d + (690/2) ,//- (this.image.height * scaleRatio),
						image.width * scaleRatio,
	 					  image.height * scaleRatio);
	
	//	context.drawImage(this.image, x2d, y2d + 690/2);
	};	
}

PixiDust.prototype.resize = function(w, h)
{
	for (var i=0; i < this.particals.length; i++) 
	{
		var partical = this.particals[i];
		partical.position.x = partical.home.x = Math.random() * 110640;
	}
}

ParticalDust = function()
{
	this.position = {x:0, y:0, z:0};
	
	 this.speedY = 10 + Math.random() * 20;
	  this.speedX = 5 + Math.random() * 10;
	this.imageId = ParticalDust.count % 3;
	ParticalDust.count++;
	this.alpha = 0.5 + Math.random() * 0.5;
}

ParticalDust.count = 0;

