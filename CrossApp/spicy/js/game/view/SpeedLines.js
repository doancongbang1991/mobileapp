

SpeedLines = function()
{
	PIXI.DisplayObjectContainer.call(this);
	
	this.particals = [];
	//this.particalPool = new GAME.GameObjectPool(ParticalDust);
	this.max = 10//30// 50// HIGH ? 50 : 5//GAME.HIGH_MODE ? 100 : 10;
	this.count = 0;
	this.maxDist = 1000;
	this.maxWidth = 7000;
	
	this.images = [];

	for (var i=0; i < 3; i++) {
		var image = new Image();
		image.src = "img/testLine.png"//treetopWorld/leaf"+ (i+1) +".png";
	//	image.src = "img/snowTriangle_0"+ (i+1) +".png";
		
		this.images.push(image);
	};
	
	
	for (var i=0; i < this.max; i++) 
	{
		var partical = new SpeedLine()//new this.particalPool.getObject();
			
		partical.position.x = (Math.random()-0.5) * 5000;
		partical.position.y = -1000 + Math.random() * 3000;
		partical.position.z = Math.random() * 110640;
		
		
		this.particals.push(partical);
		this.addChild(partical.view)
		//this.addChild(partical);
	};
			
			
	this.focalLength = 150;
}

// constructor
SpeedLines.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

SpeedLines.prototype.render = function(context, camera)
{
	//PIXI.Rope.prototype.updateTransform.call(this);
	
	for (var i=0; i < this.particals.length; i++) 
	{
		var partical =  this.particals[i];
		
		var calcZ = partical.position.z + camera.z * 5;
		
		calcZ %= this.maxWidth;
		if(calcZ < 0)calcZ += this.maxWidth;
		//7000 - 6800;
		
		partical.view.alpha =  (this.maxWidth - calcZ) / 2000;
		
		if(partical.view.alpha > 0.6)partical.view.alpha = 0.6;
		
		
		
		var scaleRatio = camera.focus/(camera.focus + calcZ + 100);
		
		//partical.scale.x = partical.scale.y = scaleRatio * 1.0;
	//	partical.position.x += partical.speedX;
		var calcX = ( partical.position.x + camera.x ) + 4000;
		calcX %= 8000;
		if(calcX < 0)calcX += 8000;
		calcX -= 4000;
		
	//	partical.position.y += partical.speedY;
		var calcY = ( partical.position.y + camera.y ) + 1000;
		calcY %= 4000;
		if(calcY < 0)calcY += 4000;
		calcY -= 1000;
		
		var x2d = calcX * scaleRatio;
		var y2d = calcY * scaleRatio;
		
		partical.view.rotation = Math.atan2(y2d, x2d) ;
		partical.view.position.x = x2d;
		partical.view.position.y = y2d;
		partical.view.scale.x = partical.view.scale.y = scaleRatio * 2.5;
		//partical.rotation += partical.rotationSpeed
	//	console.log(camera.focus + " : "  + x2d + " :"  + y2d)
		scaleRatio *= 2.5;
		
	//	var image = this.images[partical.imageId];
		/*
		context.drawImage(image,
	 					  x2d,// - (this.image.width/2 * scaleRatio),
	 					  y2d + (690/2) ,//- (this.image.height * scaleRatio),
						image.width * scaleRatio,
	 					  image.height * scaleRatio);*/
	 					 
	//	context.drawImage(this.image, x2d, y2d + 690/2);
	};	
}

SpeedLines.prototype.resize = function(w, h)
{
	for (var i=0; i < this.particals.length; i++) 
	{
		var partical = this.particals[i];
		partical.position.x = partical.home.x = Math.random() * 110640;
	}
}

SpeedLine = function(lineTexture)
{
	this.view = PIXI.Sprite.fromImage(REMOTE_PATH + "img/testLine.png", true);
	this.view.alpha = 0.6
	this.position = {x:0, y:0, z:0};
	
	 this.speedY = 10 + Math.random() * 20;
	 this.speedX = 5 + Math.random() * 10;
	this.imageId = ParticalDust.count % 3;
	ParticalDust.count++;
	this.alpha = 0.5 + Math.random() * 0.5;
}

SpeedLine.prototype = Object.create( PIXI.Sprite.prototype );
ParticalDust.count = 0;

