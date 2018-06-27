
Road = function(view)
{
	this.drawDistance = 10000;
	this.view = view;
	
	this.segs = [];
	
	this.segSize = 500;
	this.offset = 0;
	
	this.baseWidth = 1500;
	//this.depthSegs
	
	this.dangerStrip = new Image();
	this.dangerStrip.crossOrigin = '';
	this.dangerStrip.src = REMOTE_PATH + "img/stripFloor.png";
	
	this.testLedge = new Image();
	this.testLedge.crossOrigin = '';
	this.testLedge.src = REMOTE_PATH + "img/testLedge.png";
	
	this.testHoleSign = new Image()
	this.testHoleSign.crossOrigin = '';
	this.testHoleSign.src = REMOTE_PATH + "img/treetopWorld/flameTorch_frame01.png";
	
	this.testHoleSign2 = new Image()
	this.testHoleSign2.crossOrigin = '';
	this.testHoleSign2.src = REMOTE_PATH + "img/treetopWorld/flameTorch_frame02.png";
	
	this.testHoleSign3 = new Image()
	this.testHoleSign3.crossOrigin = '';
	this.testHoleSign3.src = REMOTE_PATH + "img/treetopWorld/flameTorch_frame03.png";
	
	this.testHoleSign4 = new Image()
	this.testHoleSign4.crossOrigin = '';
	this.testHoleSign4.src = REMOTE_PATH + "img/treetopWorld/flameTorch_frame04.png";
	
	this.signFrames = [this.testHoleSign, this.testHoleSign2,
					   this.testHoleSign3, this.testHoleSign4];
	this.frameCount = 0;
	//console.log(trackData)
	for(var i = 0; i < PROFILE.trackSize; i ++)
	{
		var segment = new Segment(i *  this.segSize);
		this.segs.push(segment);
		view.items.push(segment);
//		console.log(segment)
		//segs.push(-400, 500 + Math.sin(i) * -50, i *  100, 0, 0);
	}	
	
//	this.
	this.post = new Image();
	this.post.crossOrigin = '';
	this.post2 = new Image();
	this.post2.crossOrigin = '';
	
	this.trackIndex = 0;
	/*	
	this.camera = {x:0,y:1500,z:0, 
				   rotationY:0, rotationX:0, rotationZ:0}
				   
	this.zoom = 1;
	
	this.camera.focus = 300;
	
	gui.add(this, 'zoom', 1, 20).name("Zoom");//.onChange(updateTentacles);
	gui.add(this.camera, 'y', 0, 2500).name("CamY");
	gui.add(this.camera, 'focus', 0, 300).name("Focus");
	gui.add(this.camera, 'rotationZ', -Math.PI, Math.PI).name("CamRotX");
	
	
	*/
}

Road.prototype.reset = function()
{
	this.isFlat = false;
	this.flatMode = false;
	var worldData = this.view.game.world;
	
	this.offset = 0;
	
	for (var i=this.segs.length-1; i >= 0 ; i--) 
	{
		var seg = this.segs[i];
		seg.position = i *  this.segSize;
		
		
		seg.p1.z = seg.position;
		seg.p2.z = seg.position;
		
		seg.p1.x = 500 //+ seg.p1.offsetVal;
		seg.p2.x = -500 //+seg.p1.offsetVal;
	
		seg.p1.y = 1000;// + (i * 100);
		seg.p2.y = 1000;// + (i * 100);
		
		seg.color = worldData.floorColors[this.trackIndex % worldData.floorColors.length];
		seg.edgeColorDark = worldData.leftWallColors[this.trackIndex % worldData.floorColors.length];
		seg.edgeColorLight = worldData.rightWallColors[this.trackIndex % worldData.floorColors.length];
		seg.leftAlpha = worldData.leftAlpha;
		seg.rightAlpha = worldData.rightAlpha;
		seg.floorAlpha = worldData.floorAlpha;
		
		seg.wall = true;
		seg.hole = false;
		//if(!this.isFlat)
		this.trackIndex++;
			
		//console.log("::::")
	}
}

Road.prototype.setWorld = function(worldData)
{
	this.worldData = worldData;
	this.leftStump = this.worldData.leftStump;
	this.rightStump = this.worldData.rightStump;
}

Road.prototype.mapPosition = function(position, camera)
{
	//return;
	var pos = position.z % (this.segSize * PROFILE.trackSize);
	
	pos = Math.floor(pos/this.segSize);
	
//	var pos = Math.floor(pos/this.segSize);
	
	var seg = this.segs[pos % this.segs.length];
	var seg2 = this.segs[(pos+1) % this.segs.length];
	
	// onground??
	//if()
	var mod = position.z % this.segSize;
	mod /= this.segSize;
	
	position.seg = seg// = seg.y / seg2.y
	
	// z.. x..
	var leftX = seg.p1.x + (seg2.p1.x -  seg.p1.x) * mod;
	var rightX = seg.p2.x + (seg2.p2.x -  seg.p2.x) * mod;
	
	var offsetX = seg.p1.offsetVal + (seg2.p1.offsetVal - seg.p1.offsetVal) * mod;
	
	position.x += offsetX;//leftX + (rightX - leftX) * 0.5//(position.x/100);
		
		
	position.y = seg.p1.y + (seg2.p1.y - seg.p1.y) * mod;
	
}

Road.prototype.mapPowerup = function(position, ratio)
{
	//return;
	var pos = position.z % (this.segSize * PROFILE.trackSize);
	
	pos = Math.floor(pos/this.segSize);
	
//	var pos = Math.floor(pos/this.segSize);
	
	var seg = this.segs[pos % this.segs.length];
	var seg2 = this.segs[(pos+1) % this.segs.length];
	
	// onground??
	//if()
	var mod = position.z % this.segSize;
	mod /= this.segSize;
	
	position.seg = seg// = seg.y / seg2.y
	
	// z.. x..
	var leftX = seg.p1.x + (seg2.p1.x -  seg.p1.x) * mod;
	var rightX = seg.p2.x + (seg2.p2.x -  seg.p2.x) * mod;
	
	var offsetX = seg.p1.offsetVal + (seg2.p1.offsetVal - seg.p1.offsetVal) * mod;
	
	position.x += leftX + (rightX - leftX) * ratio//(position.x/100);
		
	position.width = (leftX - rightX)
	position.y = seg.p1.y + (seg2.p1.y - seg.p1.y) * mod;
	
}

Road.prototype.getOffset = function(pz)
{
	
	var pos = pz % (this.segSize * PROFILE.trackSize);
	
	pos = Math.floor(pos/this.segSize);
	
//	var pos = Math.floor(pos/this.segSize);
	
	var seg = this.segs[pos % this.segs.length];
	var seg2 = this.segs[(pos+1) % this.segs.length];
	
	if(seg.hole)return 12000;
	// onground??
	//if()
	var mod = pz % this.segSize;
	mod /= this.segSize;
	
	var offsetX = seg.p1.offsetVal + (seg2.p1.offsetVal - seg.p1.offsetVal) * mod;
	return {x:offsetX};
	

}

Road.prototype.hitTest = function(ball)
{
	if(ball.isDead)return;
	
	var position = ball.tempPosition;
	ball.hit = false;
	
	ball.isFalling = false;
	
	var pos = position.z % (this.segSize * PROFILE.trackSize);
	
	pos = Math.floor(pos/this.segSize);
	
//	var pos = Math.floor(pos/this.segSize);
	
	var seg = this.segs[pos % this.segs.length];
	var seg2 = this.segs[(pos+1) % this.segs.length];
	
	
	// onground??
	//if()
	var mod = position.z % this.segSize;
	mod /= this.segSize;
	
	
	var leftX = seg.p1.x + (seg2.p1.x - seg.p1.x) * mod;
	
	
	var rightX = seg.p2.x + (seg2.p2.x - seg.p2.x) * mod;

	var newY = seg.p1.y + (seg2.p1.y -  seg.p1.y) * mod;
	ball.realGround = newY;
	
	if(seg.hole)
	{
		if(ball.powermode != Ball.GIANT)
		{
			if(mod > 0.15 && !ball.jumping)
			{
				
				if(position.y > newY)
				{
					ball.isFalling = true;	
				}
				return 12000;
			}
			else
			{
				return newY;
			}
		}
		else
		{
			return newY + 100;
		}
	//	console.log(position.y + " : " + newY)
		
	}
	
	
	if(seg.wall)
	{
			
		if(position.x > leftX-ball.width/2)
		{
			if(position.y < (newY - seg.wallHeight))
			{
				
			}
			else
			{
				if(position.x > leftX && ball.jumping)
				{
					// DROP BALL
					if(position.y > newY)
					{
						ball.isFalling = true;
					}
					
					return 12000;
					//if(ball.dx < 0)ball.dx *= -0.4;
					//position.x = leftX+120;	
				}
				else
				{
					if(ball.dx > 0)ball.dx *= -0.4;
					position.x = leftX-ball.width/2;
					ball.hit = true;
				}
			}
			
	//		if(position.y > )
		}
		else if(position.x < rightX+ball.width/2)
		{
			if(position.y < (newY - seg.wallHeight))
			{
					
			}
			else
			{
				if(position.x < rightX && ball.jumping)
				{
					if(position.y > newY)
					{
						ball.isFalling = true;
					}
					// DROP BALL
					return 12000;
					//if(ball.dx < 0)ball.dx *= -0.4;
					//position.x = leftX+120;	
				}
				else
				{
					if(ball.dx < 0)ball.dx *= -0.4;
					position.x = rightX+ball.width/2;
					ball.hit = true;
					
				}
			}
			
			
		}
	}
	else 
	{
		if(position.x > leftX+ball.width/4)
		{
			if(position.y > newY)
			{
				ball.isFalling = true;
			}
			return 12000;
		}
		else if(position.x < rightX-ball.width/4)
		{
			if(position.y > newY)
			{
				ball.isFalling = true;
			}
			return 12000;
		}
	}
	
	if(ball.powermode == Ball.GIANT)
	{
		if(leftX - rightX < ball.width)
		{
			ball.position.x = rightX + (leftX - rightX) * 0.5
		}
	//	console.log(leftX - rightX)
	}
	
	
	return newY;
}

Road.prototype.flatten = function(ball)
{
	this.flatMode = true;
	var xpos = ball.position.x;
//	this.isFlat = true;
	
	var worldData = World.rainbow;
	
	for (var i=0; i < this.segs.length ; i++) {
		
	
		var seg = this.segs[(i + this.offset) % this.segs.length];
		seg.hole = false;
		seg.wall = true;
		//seg.width = 300;
		//seg.p1.x = 500// = {x:500 , y:0, z:z};
		//seg.p2.x = -500// = {x:-500, y:0, z:z};
		
		seg.color = worldData.floorColors[i % worldData.floorColors.length];
		seg.edgeColorDark = worldData.leftWallColors[i % worldData.floorColors.length];
		seg.edgeColorLight = worldData.rightWallColors[i % worldData.floorColors.length];
			seg.leftAlpha = worldData.leftAlpha;
			seg.rightAlpha = worldData.rightAlpha;
			seg.floorAlpha = worldData.floorAlpha;
			
	
		var width = seg.p2.x - seg.p1.x;
		var middle = seg.p2.x - width/2;
	//	seg.p1.home =  seg.p1.y;
		var ymod = seg.p1.y + Math.sin((seg.p2.z/500) / 2) * 500;
		seg.p1.tweening = true;
		 seg.p1.ymod = ymod;
		TweenLite.to(seg.p1, 1, {x:middle + 1000, y:ymod,  ease:Elastic.easeOut, delay:i * 0.05});
		TweenLite.to(seg.p2, 1, {x:middle - 1000, y:ymod, ease:Elastic.easeOut, delay:i * 0.05})
	}	
}

Road.prototype.unFlatten = function(ball)
{
	
	//.var xpos = ball.position.x;
//	this.isFlat = true;

	var worldData = this.view.game.world;
	
	for (var i=0; i < this.segs.length ; i++) {
		
		var index = (i + this.offset) % this.segs.length;
		//if(index > 10)
		{
			
			var seg = this.segs[index];
			seg.p1.ymod = seg.p1.home
			
		//	seg.p1.y = seg.p1.home;
		//	seg.p2.y = seg.p1.home;
			seg.p1.tweening = true;
			TweenLite.to(seg.p1, 1, { y:seg.p1.home,  ease:Elastic.easeOut, delay:(i * 0.05)});
			TweenLite.to(seg.p2, 1, { y:seg.p1.home, ease:Elastic.easeOut, delay:(i * 0.05)});
			
			seg.color = worldData.floorColors[i % worldData.floorColors.length];
			seg.edgeColorDark = worldData.leftWallColors[i % worldData.floorColors.length];
			seg.edgeColorLight = worldData.rightWallColors[i % worldData.floorColors.length];
				seg.leftAlpha = worldData.leftAlpha;
				seg.rightAlpha = worldData.rightAlpha;
				seg.floorAlpha = worldData.floorAlpha;
		}
	}
}

Road.prototype.renderSegment = function(seg, context)
{
//	if(i == this.segs.length-1)
	{
	}
//	else
	{
		
		var previousSeg = seg.prev
		var scaleRatio = seg.scaleRatio;
		
		
		if(previousSeg.p1.z - seg.p2.z < 0)return;
		
		seg.gradient = seg.p2Screen.y / previousSeg.p2Screen.y ;
//		console.log(seg.gradient)
	//	console.log(seg.gradient)
		if(scaleRatio < 0)scaleRatio *= -1;
		
		var lampScale = scaleRatio * 2;
		
		if(seg.hole)
		{
			var dist = ( previousSeg.p1Screen.x - previousSeg.p2Screen.x )// * scaleRatio;
					// draw ledge
			
			context.globalAlpha = 1;
			
			var frame= Math.round(this.frameCount);
			
			var lefty = this.signFrames[frame % 4];//this.testHoleSign;
			var leftWidth = lefty.width;
			var leftHeight = lefty.height;
			
			var righty = this.signFrames[(frame +2) % 4]
			var rightWidth = righty.width;
			var rightHeight = righty.height;
			
			var signScale = scaleRatio * 3;
			
			
			var ledge = this.view.game.world.dropEdge;
			var scale = ( dist / ledge.width );
			
			context.drawImage(ledge, previousSeg.p2Screen.x, previousSeg.p2Screen.y-(10 *scale), dist, ledge.height * scale)//
			
			var dist2 = seg.p1Screen.x - seg.p2Screen.x;
			var scale = ( dist2 / this.dangerStrip.width );
			context.drawImage(this.dangerStrip, seg.p2Screen.x, seg.p2Screen.y-(5 *scale), dist2, this.dangerStrip.height * scale)//
			
			
			context.drawImage(lefty, seg.p1Screen.x - (leftWidth * signScale *0.5), seg.p1Screen.y - ((leftHeight-20) * signScale) ,  leftWidth * signScale, leftHeight * signScale);
			context.drawImage(righty, seg.p2Screen.x - (rightWidth * signScale *0.5), seg.p2Screen.y - ((rightHeight-20) * signScale) , rightWidth * signScale, rightHeight * signScale);
		
			
			return;
		}
		
		
		context.globalAlpha = seg.floorAlpha;//seg.gradient > 1 ? 0.5 : 0.9// 0.6;// + (i % 2 * 0.2);
		context.fillStyle = seg.color;//seg.gradient > 1  ? "red" : "white"//seg.color;
	//	var id = (i + this.offset + 1) % this.segs.length;
	//	console.log(id);
		
		
//	if(i==this.id)context.fillStyle = "#FF00FF";
		
		context.beginPath();
		
		context.moveTo(seg.p1Screen.x,
					   seg.p1Screen.y);
		
		context.lineTo(seg.p2Screen.x,
					   seg.p2Screen.y);
		
		context.lineTo(previousSeg.p2Screen.x,
					   previousSeg.p2Screen.y);
		
		context.lineTo(previousSeg.p1Screen.x,
					   previousSeg.p1Screen.y);
					   
  		context.closePath();
		context.fill();
		
		//context.globalAlpha = 1//0.7//7;
	
		
		if(seg.z < this.drawDistance)
		{
			if(seg.wall)
			{
				
				//if(!GAME.LOW)
				{
					
				context.globalAlpha = seg.rightAlpha;
				context.fillStyle = seg.edgeColorDark ;
				// edge..
				context.beginPath();
				
				context.moveTo(seg.p1Screen.x,
							   seg.p1Screen.y);
				
				context.lineTo(previousSeg.p1Screen.x,
							   previousSeg.p1Screen.y);
							   
				context.lineTo(previousSeg.p1Screen.x,
							   previousSeg.p1Screen.y -previousSeg.wallHeight * previousSeg.scaleRatio);
				
				context.lineTo(seg.p1Screen.x,
							   seg.p1Screen.y - seg.wallHeight * scaleRatio);			   
							   
		  		context.closePath();
				context.fill();
				//*/
				context.globalAlpha = seg.leftAlpha;
				
				// edge.
				context.fillStyle = seg.edgeColorLight;
				context.beginPath();
				
				context.moveTo(seg.p2Screen.x,
							   seg.p2Screen.y);
				
				context.lineTo(previousSeg.p2Screen.x,
							   previousSeg.p2Screen.y);
							   
				context.lineTo(previousSeg.p2Screen.x,
							   previousSeg.p2Screen.y - previousSeg.wallHeight * previousSeg.scaleRatio);
				
				context.lineTo(seg.p2Screen.x,
							   seg.p2Screen.y - seg.wallHeight * scaleRatio);			   
							   
		  		context.closePath();
				context.fill();
				}
				if(PROFILE.drawPosts)
				{
					
					context.globalAlpha = 1;
					var lefty = this.leftStump[0];
					var leftWidth = lefty.width;
					var leftHeight = lefty.height;
					
					var righty = this.rightStump[0];
					var rightWidth = righty.width;
					var rightHeight = righty.height;
					
					context.drawImage(lefty, seg.p1Screen.x - (leftWidth * lampScale *0.5), seg.p1Screen.y - (leftHeight * lampScale) ,  leftWidth * lampScale, leftHeight * lampScale);
					context.drawImage(righty, seg.p2Screen.x - (rightWidth * lampScale *0.5), seg.p2Screen.y - (rightHeight * lampScale) , rightWidth * lampScale, rightHeight * lampScale);
					
				}
				
				if(seg.hole)
				{
				//	var dist = seg.width;// * scaleRatio;
						
						//seg.p2Screen.x - (rightWidth * lampScale *0.5), seg.p2Screen.y - (rightHeight * lampScale) , rightWidth * lampScale, rightHeight * lampScale);
				
				}
			}
		}

	}
}

Road.prototype.render = function(context, camera)
{
	
//	this.baseWidth = 1000 + Math.sin(camera.z / 1000) * 500;
	//context.clearRect(0,0, 800,600)
	var focalLength = camera.focus;
	var count = 0;//+=0.1;
	var zoom = camera.zoom;//2;
	
	this.frameCount += TIME.DELTA_TIME * 0.25;
	
	//var sx = Math.sin(camera.rotationX);
	//var cx = Math.cos(camera.rotationX);
	//var sy = Math.sin(camera.rotationY);
	//var cy = Math.cos(camera.rotationY);
	//var sz = Math.sin(camera.rotationZ);
	//var cz = Math.cos(camera.rotationZ);
	
	
	// apply 3d transform
	
	//for (var i=0; i <this.segs.length ; i++) {
	for (var i=this.segs.length-1; i >= 0 ; i--) {
		
		context.globalAlpha = 1;
	
		var seg = this.segs[(i + this.offset) % this.segs.length];
	  	var p1x = seg.p1.x + camera.x;
	  	var p1y = seg.p1.y + camera.y;
	  	var p1z = seg.p1.z + camera.z;
	  	
	  	var safez = seg.p1.z + camera.z;// + 500;
	  	
	  	/*var xy = cx*p1y - sx*p1z;
		var xz = sx*p1y + cx*p1z;
		// rotation around y
		var yz = cy*xz - sy*p1x;
		var yx = sy*xz + cy*p1x;
		// rotation around z
		var zx = cz*yx - sz*xy;
		var zy = sz*yx + cz*xy;*/
		
		var x = p1x//zx;
		var y = p1y//zy;
		var z = p1z//yz;
		
	//	if(z < -focalLength)z = -focalLength;
		
	  	var scaleRatio = focalLength/(focalLength + z) * zoom;
	  	seg.scaleRatio = scaleRatio;
	  	
		seg.p1Screen.x = (x * scaleRatio); 
		seg.p1Screen.y = (y * scaleRatio) + 690/2 //- 200;
		
	  	var p2x = seg.p2.x + camera.x;
	  	var p2y = seg.p2.y + camera.y;
	  	var p2z = seg.p2.z + camera.z;
	  	
		var x = p2x//zx;
		var y = p2y//zy;
		var z = p2z//yz;
		
	//	if(z < -focalLength)z = -focalLength;
		
		var scaleRatio = focalLength/(focalLength + z) * zoom;
	//	seg.depth = scaleRatio
	//	seg.scaleRatio = scaleRatio;
		seg.z = z;
		seg.depth = z;
		seg.p2Screen.x = (x * scaleRatio);
		seg.p2Screen.y = (y * scaleRatio) + 690/2 // - 200;
		
		var previousSeg = this.segs[(i + this.offset + 1) % this.segs.length];
		seg.prev = previousSeg;
		
		//seg.visible = false;
	  	if(safez > -focalLength + 30)
	  	{
	  		seg.visible = (i != this.segs.length-1)
	  		//seg.visible = false;
		//	if(i != this.segs.length-1)
		//	{
		//	//	this.renderSegment(seg, context);
			//}	
	  	}
	  	else
	  	{
	  	//	seg.visible = false;
	  		// map to "line"
//	  		seg.position = safez;
	  		seg.position +=  this.segSize * (this.segs.length);
	  		
	  	//	seg.depth = seg.position;
	  		
	  		seg.p1.z = seg.position;
	  		seg.p2.z = seg.position;
			
			var worldData = this.view.game.world;
			
			
			//if(!this.isFlat)
			this.view.game.trackManager.setSeg(seg)
			seg.p1.home =  seg.p1.y;
			//seg.hole = Math.random() < 0.3;
			if(seg.p1.tweening)
			{
				seg.p1.tweening = false;
				TweenLite.killTweensOf(seg.p1);
				TweenLite.killTweensOf(seg.p2);
			}
			
			if(this.flatMode)
			{
				var worldData = World.rainbow;
	
				
				var width = seg.p2.x - seg.p1.x;
				var middle = seg.p2.x - width/2;
				
				seg.p1.x = middle + 1000;
				seg.p2.x = middle - 1000;
				seg.hole = false;
				seg.wall = true;
				seg.p1.y = seg.p2.y = seg.p1.y + Math.sin(((seg.p2.z/500)/2) ) * 500;
				
				seg.p1.ymod =  seg.p1.y;
				
				//TweenLite.to(seg.p1, 1, {x:middle + 1000,   ease:Elastic.easeOut, delay:i * 0.05});
				//TweenLite.to(seg.p2, 1, {x:middle - 1000, ease:Elastic.easeOut, delay:i * 0.05})
			}
			else
			{
			//		seg.p1.y = seg.p2.y = seg.p1.y + Math.sin(((seg.p2.z/500)/2) ) * 500;
			
			}
			
			
			
			seg.color = worldData.floorColors[this.trackIndex % worldData.floorColors.length];
			seg.edgeColorDark = worldData.leftWallColors[this.trackIndex % worldData.floorColors.length];
			seg.edgeColorLight = worldData.rightWallColors[this.trackIndex % worldData.floorColors.length];
			seg.leftAlpha = worldData.leftAlpha;
			seg.rightAlpha = worldData.rightAlpha;
			seg.floorAlpha = worldData.floorAlpha;
			
			this.trackIndex++;
			
	 	//	seg.p1.y = + Math.sin(seg.position / 800) *1250 / 2;
	 	//	seg.p2.y = + Math.sin(seg.position / 800) * 1250 / 2;
	  		
	  		this.offset++;
	  	}
		
	}
	
	for (var i=this.segs.length-1; i >= 0 ; i--) {
		
		context.globalAlpha = 1;
	
	//	var seg = this.segs[(i + this.offset) % this.segs.length];
	//	if(seg.visible)this.renderSegment(seg, context);
		
		
		if(i == this.segs.length-1)
		{
		//	context.fillStyle = "red"
		}
		
	}
//	console.log(">>>>>>>")
	context.globalAlpha = 1;
	  
}

function Segment(z)
{
	this.scale = 1;
	
	this.position = z;
	this.scaleLamp = Math.random();
	
	Segment.colorCount++;
	this.color = Segment.colors[Segment.colorCount % Segment.colors.length];
	this.edgeColorDark = Segment.edgeColorDark[Segment.colorCount % Segment.colors.length];
	this.edgeColorLight = Segment.edgeColorLight[Segment.colorCount % Segment.colors.length];
	
	this.p1 = {x:500 , y:0, z:z};
	this.p2 = {x:-500, y:0, z:z};
	
	this.p1Screen = {x:0, y:0};
	this.p2Screen = {x:0, y:0};
	
	this.p1.offsetVal = 0;
	this.p2.offsetVal = 0;
	
	this.wallHeight = 100 + Math.random() * 150;
	this.wall = true;
	
	this.modX = 0;
	this.modY = 0;
	
	this.p1.ymod = 1000;
	
}

Segment.colors = [ "#32ffef", "#66c7ff", "#32e4f8","#32d1fd","#39b8ff" , "#66c7ff"]//["#ff6032", "#ff3244"];
Segment.edgeColorDark = ["#596bff", "#5c96ff"];
Segment.edgeColorLight = ["#5c96ff", "#5c96ff"];
Segment.colorCount = 0;

