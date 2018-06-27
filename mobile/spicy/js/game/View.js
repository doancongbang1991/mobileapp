
var GAME = GAME || {};

View = function(game, viewContainer)
{
	this.game = game;
	
	this.shakeCount = 0;
	
	PIXI.CustomRenderable.call(this);
	this.children = [];
	this.rotContainer =  new PIXI.DisplayObjectContainer();
	
	
	viewContainer.addChild(this.rotContainer);
	this.rotContainer.addChild(this);
	
	this.white = new PIXI.Graphics();
	this.white.beginFill(0xFFFFFF);
	this.white.drawRect((-1280/2) * 1.5,0, 1280 * 1.5, 690)
	this.white.visible = false;
	this.white.alpha = 0;
	
	viewContainer.addChild(this.white);
	
	
	this.gamePos = 0;
	
	this.viewContainer = viewContainer;
	
	this.direction = 1;
	
	this.camera = {x:0,y:1500,z:0, 
				   rotationY:0, rotationX:0, rotationZ:0,
				   focus:300,
				   zoom:1,
				   dist:400,
				   distY:1000,
				   ratio:1,
				   shake:0}
				   
	
	
	this.items = [];
	this.road = new Road(this);
	
	this.count = 0;
	
	this.background = new Image();
	this.background.crossOrigin = '';
	this.background.src = "img/background_SNOW.jpg";
	
	this.pixiDust = new PixiDust();
	this.speedLines = new SpeedLines();
	
	if(PROFILE.particles)viewContainer.addChild(this.speedLines);
	
	this.hud = new Hud(game);
	viewContainer.addChild(this.hud);
	
//	var po = new PIXI.Sprite.fromImage("img/flip.jpg");
//	po.anchor.x = 0.5;
//	po.anchor.y = 0.5;
	
//	this.rotContainer.addChild(po)
	this.shakeCount = 0;
	
	
	// counter..
	this.spawnCount = 0;
	this.signElement = new GameElement();
	this.signElement.view.src = "img/signPost.png";
	
	this.lastDepth = 0;
	
	this.cameraGround = 0;
	this.cameraBall = 0;
	
	this.ratio = 0;
	
}

View.prototype = Object.create( PIXI.CustomRenderable.prototype );

View.prototype.setWorld = function(worldData)
{
	this.worldData = worldData;
	if(PROFILE.particles)this.pixiDust.update(worldData.dust);
	this.road.setWorld(this.worldData);
	APP.stage.setBackgroundColor(this.worldData.bgColor);
}

View.prototype.add = function(element)
{
	this.items.push(element);
}

View.prototype.remove = function(element)
{
	var index = this.items.indexOf( element );
	if ( index !== -1 ) 
	{
		this.items.splice(index, 1);
	}

}

View.prototype.reset = function()
{
	this.hud.reset();
	this.rotation = 0;
	this.road.reset();
	
	this.camera.dist = 400
	this.camera.distY = 1000
	this.camera.shake = 0;
	this.camera.z =0;
	this.camera.ratio = 1;
	this.camera.y = 1000;
	this.lastDepth = 501
}

View.prototype.renderCanvas = function(renderer)
{
//	console.log("!!")
	var context = renderer.context;
	
	var globalAlpha = this.worldAlpha;
	
	context.globalAlpha = globalAlpha;
	
	var bgScale = this.w / 1024//this.stage.interactionManager.mouse.global.x / 500;
	if(bgScale < 1)bgScale = 1.3;
	bgScale *= 1.3;
	
	if(this.game.ball.state == Ball.CRASHING || this.game.ball.state == Ball.FALLING)
	{
		//console.log("!!!");
		this.rotation += this.game.ball.bashDirection * 0.002
		bgScale *= 1 + Math.abs(this.rotation) * 0.3 //(1.3)
	}
	else
	{
		if(this.game.controller.controlMode == Controller.TILT)
		{
				this.rotContainer.rotation  += ((-this.game.controller.lean / Math.PI) - this.rotContainer.rotation) * 0.1;
	
		}
		else
		{
			this.rotation += (this.game.controller.lean * 0.1 - this.rotation) * 0.05
		}	
	}
	//this.viewContainer.rotation += ((-this.game.controller.accelerationY / Math.PI) - this.viewContainer.rotation) * 0.1;

	
	//this.viewContainer.rotation+=1
	
//	Math.sin(this.game.ball.position.z/10000)
	this.drop = Math.sin(this.game.ball.position.z/10000) * 200 + 300;
//	bgScale *= Math.this.rotation
	context.drawImage(this.game.world.background, - (1024*bgScale)/2, 200 - this.drop *bgScale + 100, 1024 * bgScale, 1024 * bgScale);
	
	var offset = this.road.getOffset(this.game.ball.position.z)
	
//	if(this.camera.shake > 0)
	{
		
		this.shakeCount+=TIME.DELTA_TIME;
		if(this.shakeCount > 3)
		{
			this.shakeCount = 0;
			
			
			this.position.y = -200 + Math.sin(this.shakeCount) + (Math.random()-0.5) * (this.camera.shake + 3);
			this.position.x =  Math.sin(this.shakeCount/2) + (Math.random()-0.5) * (this.camera.shake + 2);
		}
	}
	
	if(this.game.paused)this.position.y = this.position.x = 0;
	//if(!offset)offset = 1;
	this.camera.x = (-this.game.ball.position.x);// - this.camera.x) * 0.1;
	//this.cameraBall += (this.camera.distY-this.cameraBall) * 0.1;
	this.cameraBall += (this.camera.distY-this.game.ball.position.y - this.cameraBall) * 0.1;

		//if(this.camera.y  this.game.ball.ground)	this.camera.y = this.game.ball.ground
		/*
	if(this.game.ball.powermode == Ball.GIANT)
	{
		
		
	}
	else
	{
		
		this.camera.x = (-this.game.ball.position.x)// - this.camera.x) * 0.1;
		//this.camera.y += (this.camera.distY-this.game.ball.position.y - this.camera.y) * 0.1;
		
		var pos1 =  1000 - this.game.ball.ground;
		var pos2 = 800 - this.game.ball.position.y;
		
		this.camera.y = pos2//pos1 + (pos2 - pos1) * 0.5//1000 - this.game.ball.ground;
		
	//	this.camera.y += Math.random() * 100;
	//	this.camera.x += Math.random() * 100;
	}
	*/
	this.cameraGround = this.camera.distY - this.game.ball.realGround //(this.game.ball.realy - this.game.ball.ground) * 0.5 ;// (1000-this.game.ball.position.y );
	
	this.camera.y = this.cameraBall + (this.cameraGround - this.cameraBall) * this.camera.ratio;
	this.count += 0.1;
	this.pivot.y = 300;
	//this.rotation = this.count;
	
	
	
	
	//this.camera.y += ( (1500 + Math.abs(this.game.ball.speed) * -5) - this.camera.y ) * 0.1;//Math.sin(this.count) * 30;
	//this.camera.x = Math.cos(this.count/100) * 30;
	
		
	if(!this.camera.lock )
	{
		this.camera.z = -this.game.ball.position.z + this.camera.dist;
	}
	
	//var seg = this.road.segs[(0 + this.road.offset) % this.road.segs.length];
	
	//var ydist = seg.p1.y - this.camera.y;
	//var zdist = this.game.ball.position.z - this.camera.z;

	//console.log
	//this.camera.rotationX = this.game.ball.yspeedT/100//Math.atan2(ydist, zdist);
	
	this.road.render(context, this.camera);
	
	
	// render the road!
	var camera = this.camera;
	
	var focalLength = camera.focus;
	var zoom = camera.zoom;//2;
	
	
	var drawDistance = PROFILE.drawDistance;
	
	// apply 3d transform
	for (var i=this.items.length-1; i >= 0; i--) {
	 	
	 	
		var item = this.items[i];

		if(item instanceof Segment)
		{
			//item.render
			if(item.visible)
			{
		//	console.log("HI")
			//	context.globalAlpha = 1;
				this.road.renderSegment(item, context);
				item.depth = item.z + 1500//0;// + i
			}
		}
		else
		{
			
			
		  	var p1z = item.position.z + camera.z;
		  	
		//	var offset = this.road.getOffset(item.position.z)
			
			
			
		  	var p1y = item.position.y + camera.y;
		  	var p1x = item.position.x + camera.x// + offset.x;
			
		 // 	var xy = cx*p1y - sx*p1z;
		//	var xz = sx*p1y + cx*p1z;
			// rotation around y
	//		var yz = cy*xz - sy*p1x;
	//		var yx = sy*xz + cy*p1x;
			
			// rotation around z
		//	var zx = cz*yx - sz*xy;
		//	var zy = sz*yx + cz*xy;
			
			var x = p1x;
			var y = p1y;
			var z = p1z;
			
			if(z < -focalLength || z > drawDistance)continue;
			context.globalAlpha = globalAlpha * item.alpha;
			
			if(z > drawDistance - 1000)
			{
				context.globalAlpha = ( (drawDistance - z) / 1000 ) * globalAlpha
			}
			else if(z < 299)
			{
				
				context.globalAlpha = z < 0 ? 0 : ( z / 300 ) * globalAlpha
				
			}
			
			var scaleRatio = focalLength/(focalLength + z) * zoom;
			
			item.depth = z;// p1z//item.position.z - 1000//scaleRatio + 0.87;
			
			item.screenPosition.x = (x * scaleRatio); 
			item.screenPosition.y = (y * scaleRatio) + 690/2;// - 200;
		 

		// 	console.log( item.screenPosition.y - (item.view.height * item.scale))
			scaleRatio *= item.scale;
			
			
		 	if(false)//item instanceof Ball)
		 	{
		 		var width = item.width;
		 		var height = item.height;
		 		
		 		var scaleRatio1 = focalLength/(focalLength +  (z+(height/2))) * zoom;
		 		var x1 = ((x-(width/2)) * scaleRatio1); 
		 		var y1 = (y * scaleRatio1) + 690/2;
		 		
		 		var scaleRatio2 = focalLength/(focalLength + (z-(height/2))) * zoom;
		 		var x2 = ((x-(width/2)) * scaleRatio2); 
		 		var y2 = (y * scaleRatio2) + 690/2;
		 		
		 		var scaleRatio3 = focalLength/(focalLength + (z-(height/2))) * zoom;
		 		var x3 = ((x+(width/2)) * scaleRatio3); 
		 		var y3 = (y * scaleRatio3) + 690/2;
		 		
		 		var scaleRatio4 = focalLength/(focalLength + (z+(height/2))) * zoom;
		 		var x4 = ((x+(width/2)) * scaleRatio4); 
		 		var y4 = (y * scaleRatio4) + 690/2;
		 		
		 		context.beginPath();
				
				context.moveTo(x1,
							   y1);
				
				context.lineTo(x2,
							   y2);
				
				context.lineTo(x3,
							   y3);
				
				context.lineTo(x4,
							   y4);
							   
		  		context.closePath();
				context.fill();	
		 	}
		 	
			if(item.position.seg)
			{
				
				if(item.position.seg.gradient < 1)//0.98)
			 	{
				//	context.globalAlpha = item.position.seg.gradient * 3//(item.position.seg.gradient 1 - (0.2 / (item.position.seg.gradient - 0.98))
		///	 		continue;
			 	}
				 
			 /*	
			 	if(item.position.seg.gradient < 1)
			 	{
			 	}*/
			}
			 
			
			if(item instanceof Enemy)
			{
			 	if(!item.exploding)
			 	{
			 	/*	var width = item.wallWidth;
		 		var height = item.height;
		 		z += 100;
		 		
		 		var scaleRatio1 = focalLength/(focalLength +  (z-(height/2))) * zoom;
		 		var x1 = ((x-(width/2)) * scaleRatio1); 
		 		var y1 = (y * scaleRatio1) + 690/2;
		 		
		 		var scaleRatio2 = focalLength/(focalLength + (z-(height/2))) * zoom;
		 		var x2 = ((x-(width/2)) * scaleRatio2); 
		 		var y2 = ((y - item.wallHeight + 100) * scaleRatio2) + 690/2;
		 		
		 		var scaleRatio3 = focalLength/(focalLength + (z-(height/2))) * zoom;
		 		var x3 = ((x+(width/2)) * scaleRatio3); 
		 		var y3 = ((y-item.wallHeight + 100) * scaleRatio3) + 690/2;
		 		
		 		var scaleRatio4 = focalLength/(focalLength + (z-(height/2))) * zoom;
		 		var x4 = ((x+(width/2)) * scaleRatio4); 
		 		var y4 = ((y) * scaleRatio4) + 690/2;
		 			z -= 100;
		 		context.beginPath();
				
				context.moveTo(x1,
							   y1);
				
				context.lineTo(x2,
							   y2);
				
				context.lineTo(x3,
							   y3);
				
				context.lineTo(x4,
							   y4);
							   
		  		context.closePath();
				context.fill();	
				*/
				
				context.drawImage(item.view,
			 					  item.screenPosition.x - (item.visualWidth/2 * scaleRatio),
			 					  item.screenPosition.y - ((item.visualHeight-35) * scaleRatio),
			 					  item.visualWidth * scaleRatio,
			 					  item.visualHeight * scaleRatio);
			 					  
			 	}
			 	else
			 	{
			 	
				 	context.save(); 	
				 	
				 	context.translate(item.screenPosition.x,// - (item.view.width/2 * scaleRatio),
				 					  item.screenPosition.y - (item.wallHeight/2  * item.heightRatio * scaleRatio));
					
					//context.translate(0, 500)
					item.position.y += item.directionY;
					item.position.x += item.directionX;
					 
					item.rotation+=0.2;
					context.rotate(item.rotation)//+=0.1);
					
					
					context.drawImage(item.view, -item.wallWidth/2 * scaleRatio, 
												-item.wallHeight/2 * scaleRatio,
												 item.wallWidth * scaleRatio, 
												 item.wallHeight  * scaleRatio);
					//console.log(scaleY)
				//	item.rotation =
					
					context.restore();
				 	
			 	}
			}
			else if(item instanceof Ball)
			{
				//console.log(offset)
				context.save(); 
				item.depth -= 1000;
				if(item.isFalling)item.depth += 2000;
				
				
				var groundProjection =  ((item.realGround + camera.y + 50) * scaleRatio)// + 690/2;// - 200;
			//	console.log(groundProjection)
				var shadow = item.shadow;
				var shadowScale = 1 - (item.realGround - item.position.y) / 700;
				if(shadowScale < 0)shadowScale = 0;
				else if(shadowScale > 1)shadowScale = 1;
				shadowScale *=0.8;
				
				context.globalAlpha = globalAlpha * shadowScale;
				context.drawImage(shadow.view,
			 					  item.screenPosition.x - (shadow.view.width/2 * shadowScale),
			 					  groundProjection - ((shadow.view.height/2) * shadowScale),
			 					  shadow.view.width * shadowScale,
			 					  shadow.view.height * shadowScale);
			 					  
				// rotate around mi)
				// rotate around middle?
				//scaleRatio *= item.scale;

				//var scaleY = scaleRatio * Math.sin(item.rotation); 
				context.globalAlpha = globalAlpha * item.alpha;
			 					//  scaleRatio = 1;
				context.translate(item.screenPosition.x,// - (item.view.width/2 * scaleRatio),
			 					  item.screenPosition.y - (item.view.height/2  * item.heightRatio * scaleRatio));
				
				//context.translate(0, 500)
				context.rotate(item.rotation)//+=0.1);
				
				var texture = item.view
					
				var frame = texture.frame;
				context.drawImage(texture.baseTexture.source, 
								   frame.x,
								   frame.y,
								   frame.width,
								   frame.height,
								   0.5 * (-frame.width + texture.realSize.x) * scaleRatio, // 0.5 * -frame.width + 
								   0.5 * (-frame.height + texture.realSize.y - 40) * scaleRatio,// 0.5 * -frame.height
								   frame.width * scaleRatio,
								   frame.height * scaleRatio);
			
				/*
				context.drawImage(item.view, -item.view.width/2 * scaleRatio, 
											-item.view.height/2 * scaleRatio,
											 item.view.width * scaleRatio, 
											 item.view.height  * scaleRatio);
								*/
				/*
				if(item.powermode == Ball.MAGNET)
				{
					var magTexture = item.texturesMagnet[item.frame % 15];
					
					var frame = magTexture.frame;
					context.drawImage(magTexture.baseTexture.source, 
									   frame.x,
									   frame.y,
									   frame.width,
									   frame.height,
									   0.5 * (-frame.width + magTexture.realSize.x) * scaleRatio, // 0.5 * -frame.width + 
									   0.5 * (-frame.height + magTexture.realSize.y - 40) * scaleRatio,// 0.5 * -frame.height
									   frame.width * scaleRatio,
									   frame.height * scaleRatio);
									   
				}*/
											 
				//console.log(scaleY)
			//	item.rotation =
				
				context.restore();
				
			}// if(!item.rotation)
			else //if(item instanceof Pickup)
			{
				
				if(item.frame)
				{
					var texture = item.view
					var frame = texture.frame;
					context.drawImage(texture.baseTexture.source, 
								   frame.x,
								   frame.y,
								   frame.width,
								   frame.height,
								   item.screenPosition.x + 0.5 * (-frame.width) * scaleRatio, // 0.5 * -frame.width + 
								   item.screenPosition.y + 0.5 * (-frame.height) * item.heightRatio * scaleRatio,// 0.5 * -frame.height
								   frame.width * scaleRatio,
								   frame.height * scaleRatio);	
				}
				else
				{
					
				//console.log(item.heightRatio)
			 	context.drawImage(item.view,
			 					  item.screenPosition.x - (item.view.width/2 * scaleRatio),
			 					  item.screenPosition.y - (item.view.height * item.heightRatio * scaleRatio),
			 					  item.view.width * scaleRatio,
			 					  item.view.height * scaleRatio);
				}
			}
			/*
			else
			{
				context.save(); 
				
				// rotate around middle?
				scaleRatio *= item.scale;
			 					//  scaleRatio = 1;
				context.translate(item.screenPosition.x,// - (item.view.width/2 * scaleRatio),
			 					  item.screenPosition.y - (item.view.height/2 * scaleRatio));
				
			//	context.translate(0, 500)
				context.rotate(item.rotation/2);
				
				
				context.drawImage(item.view, -item.view.width * scaleRatio, -item.view.height * item.heightRatio * scaleRatio,
											 item.view.width * scaleRatio,  item.view.height * item.heightRatio * scaleRatio);
				
			//	item.rotation =
				
				context.restore();
			}*/
		}
	  			
	};
	
	// only do every 5 segmendts?
	var diff = -this.camera.z -	this.lastDepth
//.	console.log(diff)
	if(diff > 500 )
	{
		this.lastDepth = -this.camera.z;
//		console.log("DEPTH SORT")
	}
		this.items.sort(compareNumbers);
	
	
	if(PROFILE.particles)
	{
		this.pixiDust.render(context, this.camera);
		
		this.speedLines.visible=false;
		if(item.powermode == Ball.CHARGE)
		{
			this.speedLines.visible=true;
			this.speedLines.render(context, this.camera);
		}	
	}
	
	
	
}

View.prototype.renderStuff = function(renderer)
{
	
}

function compareNumbers(a, b) {
  return a.depth - b.depth;
}


View.prototype.resize = function(w, h)
{
	this.w = w;
	this.viewContainer.position.x = Math.floor(w/2);
	this.speedLines.position.y = 200;
//	this.viewContainer.position.y = h/2;
	this.rotContainer.position.y = Math.floor(h/2)// - 200;
	this.hud.resize(w, h);
}


