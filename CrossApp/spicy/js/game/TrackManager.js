/**
 * @author Mat Groves
 */

/**
 * @author Mat Groves
 */

var GAME = GAME || {};


GAME.TrackManager = function(engine)
{
	this.count = 0;
	this.countY = 0
	
	this.engine = engine;
	this.trackStream = [];
	this.coinStream = [];
	this.wallStream = [];
	
	this.showTutorial = true;
	
	this.count = 0;
	this.offset = 0;
	this.index  = 0;
	this.indexOffset = PROFILE.trackSize;
	this.segmentId = 0;
	this.xOffset = 0;
	this.trackIndex = 0;
	 this.offsetIndex =0;
	this.lastIndex = 0;
	
	this.lastTutIndex = 0;
	
	this.lastCoinIndex =0;
	this.lastWallIndex =0;
	
	this.positionObjectIndex;
	this.lastObjectIndex;
	this.objectIndex = 0;
	this.wallObjectIndex = 0;
	
	this.lastObjectZ = 0;
	this.trackLayout = [1,1,1,1]//0, 0, 0,0,0,0,0,0,0,1, 1, 0]//, 0, 1];
	
	this.tutObjectIndex = 0;
	this.overallOffset = 0;
	
	
	this.xFrequancy = 0.5;
	this.xSize =  0//800 * 0.5;
	this.yFrequancy = 0.3;
	this.ySize = 0//800;
	
	
	
	this.flat = {
		
		xFrequancy: 0.5,
		xSize:0,
		yFrequancy:0.3,
		ySize:0
	}
	
	this.twisty = {
		
		xFrequancy: 0.5,
		xSize:800 * 0.5,
		yFrequancy:0.3,
		ySize:800
	}
	
	this.rollerCoaster = {
		
		xFrequancy: 0.5,
		xSize:0,
		yFrequancy:0.3,
		ySize:800
	}
	
	this.sideSwipe = {
		
		xFrequancy: 0.3,
		xSize:600,
		yFrequancy:0.5,
		ySize:400
	}
	
	this.oceanic = {
		
		xFrequancy: 0.1,
		xSize:800,
		yFrequancy:0.1,
		ySize:3500
	}
	
	this.tutStream = [];
	//this.xFrequancy /= 3;
	//this.xSize *= 3;
	
	trackData[0].isTut = true;
	
	this.tut = trackData[0];
	
	this.curves = [this.flat,
					this.twisty,
					this.rollerCoaster,
					this.sideSwipe,
					this.oceanic];
					
					
	this.setCurve(this.flat);
}

GAME.TrackManager.prototype.setCurve = function(data)
{
	if(this.curve == data)return;
	//console.log(data)
	if(!this.curve)this.curve = data;
	
	//var ySizeDiff = data.ySize - this.curve.ySize;
	var yFreqDiff = data.yFrequancy - this.curve.yFrequancy;
	var xFreqDiff = data.xFrequancy - this.curve.xFrequancy;
	
	if(yFreqDiff < 0)
	{
		TweenLite.to(this, 3, {yFrequancy:data.yFrequancy})
		TweenLite.to(this, 3, {ySize:data.ySize, overwrite:false, delay:3});
	}
	else
	{
		TweenLite.to(this, 3, {ySize:data.ySize});
		TweenLite.to(this, 3, {yFrequancy:data.yFrequancy, overwrite:false, delay:3});
	}
	
	if(xFreqDiff < 0)
	{
		TweenLite.to(this, 3, {xFrequancy:data.yFrequancy, overwrite:false})
		TweenLite.to(this, 3, {xSize:data.xSize, overwrite:false, delay:3});
	}
	else
	{
		TweenLite.to(this, 3, {xSize:data.xSize, overwrite:false});
		TweenLite.to(this, 3, {xFrequancy:data.xFrequancy, overwrite:false, delay:3});
	}
	
	
	/*
	TweenLite.to(this, 4, {
		
		xFrequancy:data.xFrequancy,
		xSize:data.xSize,
		yFrequancy:data.yFrequancy,
		ySize:data.ySize
	});*/
	
	
	this.curve = data
	
	
		
		
	//	this.xFrequancy = 0//0.5;
	//this.xSize =  0//800 * 0.5;
	//this.yFrequancy = 0//0.3;
	//this.ySize = 0//800;
	
}

GAME.TrackManager.prototype.runNumbers = function()
{
	//var targetxFre = Math.random() * ;
//	TweenLite.to(this, 3, {xFrequancy:})
}

// constructor

GAME.TrackManager.prototype.update = function()
{
	this.positionIndex = Math.floor(this.engine.ball.position.z / 500);
	
	// update the track stream...
	
	// add items..
	
	while(this.lastIndex <= this.positionIndex)
	{
		
		this.lastIndex++;
		var relativeIndex = this.lastIndex - this.offsetIndex;
		var segment = trackData[this.segmentId % trackData.length];
		
		var floorData = segment.floor;
		
		this.trackStream.push(floorData[relativeIndex * 3], floorData[relativeIndex*3 + 1] +  this.xOffset, floorData[relativeIndex*3 + 2])
		
		if(relativeIndex+1 >= floorData.length/3)
		{
			// set new track!
			 
			// this.setCurve(this.twisty);
			 
			 this.xOffset =  this.xOffset + floorData[(relativeIndex)*3 +1]
			 this.segmentId++;
			 if(!(this.segmentId % trackData.length))this.segmentId++;
			 
			 var nextSeg = trackData[this.segmentId % trackData.length];
			 
			 
			 if(nextSeg.curveType != 10)
			 {
				 this.setCurve(this.curves[nextSeg.curveType]);
			 }
			 else
			 {
			 	 this.setCurve(this.curves[Math.floor(Math.random() * this.curves.length)]);
			 }
			 
			 this.offsetIndex += floorData.length/3;
			 this.lastCoinIndex = 0;
			 this.lastWallIndex = 0;
		}
		
		var coins = trackData[this.segmentId % trackData.length].coins;
		var start = (relativeIndex+1) * 500;

		while(true)
		{
			var coinz = coins[this.lastCoinIndex * 2];
			//console.log(this.lastCoinIndex + " " + start + " : " + coinx)
			if(coinz < start)
			{
				this.coinStream.push(coinz + ((this.offsetIndex+PROFILE.trackSize -1) * 500), 
									 coins[this.lastCoinIndex * 2 + 1] + this.xOffset);
				this.lastCoinIndex++;
			}
			else
			{
				break;
			}
		}
		
		var walls = trackData[this.segmentId % trackData.length].walls;
		var start = (relativeIndex+1) * 500;
		
		while(true)
		{
			var wallz = walls[this.lastWallIndex * 3];
			if(wallz < start)
			{
				this.wallStream.push(wallz + ((this.offsetIndex+PROFILE.trackSize -1) * 500), 
									 walls[this.lastWallIndex * 3 + 1] + this.xOffset,
									 walls[this.lastWallIndex * 3 + 2]);
				this.lastWallIndex++;
			}
			else
			{
				break;
			}
		}
		
		if(segment.tuts)
		{
			var tuts = segment.tuts;
			var start = (relativeIndex+1) * 500;
			
			while(true)
			{
				var tutz = tuts[this.lastTutIndex * 3];
				if(tutz < start)
				{
					this.tutStream.push(tutz + ((this.offsetIndex+PROFILE.trackSize) * 500), 
										 tuts[this.lastTutIndex * 3 + 1] + this.xOffset,
										 tuts[this.lastTutIndex * 3 + 2]);
					this.lastTutIndex++;
				}
				else
				{
					break;
				}
			}		
		}
	}
	
	// coin stream!
	
	//this.objectIndex;// = -this.engine.view.camera.z;
	var drawDistance = PROFILE.drawDistance;
	
	var coinz = this.coinStream[this.objectIndex * 2];
	if(coinz < -this.engine.view.camera.z + drawDistance)
	{
		var coinx = this.coinStream[this.objectIndex * 2 + 1];
		if(!this.pasued)this.engine.pickupManager.addPickup(coinz, this.coinStream[this.objectIndex * 2 + 1]);
		this.objectIndex++;
	}
	
	var wallz = this.wallStream[this.wallObjectIndex * 3];
	if(wallz < -this.engine.view.camera.z + drawDistance)
	{
	//	console.log("HI!")
		var wallx = this.wallStream[this.wallObjectIndex * 3 + 1];
		var walltype = this.wallStream[this.wallObjectIndex * 3 + 2];
		if(!this.pasued)this.engine.enemyManager.addWall(wallz, wallx, walltype);
		this.wallObjectIndex++;
	}
	
	var tutz = this.tutStream[this.tutObjectIndex * 3];
	if(tutz < -this.engine.view.camera.z + drawDistance)
	{
	//	console.log("HI!")
		var tutx = this.tutStream[this.tutObjectIndex * 3 + 1];
		var tutType = this.tutStream[this.tutObjectIndex * 3 + 2];
		if(!this.pasued)
		{
			//console.log("YTUTUTU")
			this.engine.extraManager.addTut(tutz, tutx, tutType);
		}
		this.tutObjectIndex++;
	}

}


GAME.TrackManager.prototype.flatternOut = function()
{
	
//	this.flat = true;
	
	//this.restart();
	//this.trackStream = [];
	//this.wallStream = [];
	//this.coinStream = [];

//	this.xOffset = this.engine.ball.position.x;
	//this.offset
	
}

GAME.TrackManager.prototype.restart = function(newLevel)
{
	
	newLevel = !!newLevel;
	
	this.offset = 0;
	this.index  = 0;
	this.indexOffset = PROFILE.trackSize;
	
	if(newLevel)
	{
		
	}
	else
	{
		this.segmentId = this.showTutorial ? 0 : 1;
		
		trackData.shift();
		trackData = shuffle(trackData);
		trackData.unshift(this.tut);
	}
	
	//alert(this.segmentId )
	this.xOffset = 0;
	this.trackIndex = 0;
	 this.offsetIndex =0;
	this.lastIndex = 0;
	this.pasued= false;
	this.positionIndex = 0;
	
	this.lastCoinIndex =0;
	this.lastWallIndex =0;
	this.lastTutIndex = 0;
	
	this.objectIndex = 0;
	this.wallObjectIndex = 0;
	this.tutObjectIndex = 0;
	this.trackStream = [];
	this.wallStream = [];
	this.coinStream = [];
	this.tutStream = [];
	
	this.count = 0;
	this.countY = 0
	//this.segmentId = 0//Math.floor(Math.random() * trackData.length)
	
	this.xFrequancy = 0.5;
	this.xSize =  0//800 * 0.5;
	this.yFrequancy = 0.3;
	this.ySize = 0//800;
	//alert("!")
	this.curve = this.flat;
	TweenLite.killTweensOf(this);
	//this.setCurve(this.flat);			 
}



GAME.TrackManager.prototype.modifyNumber = function(positon)
{
	
}

GAME.TrackManager.prototype.pause = function()
{
	this.pasued = true;
}

GAME.TrackManager.prototype.resume = function()
{
	this.pasued = false;
}

GAME.TrackManager.prototype.setSeg = function(seg)
{
	// road can drive all of it??
	var realIndex = Math.floor(seg.position/500) - PROFILE.trackSize;
	
	var width =  this.trackStream[realIndex * 3];
	var position =  this.trackStream[realIndex * 3 + 1];
	//this.count 
	if(width)
	{
			seg.hole = this.trackStream[realIndex * 3 + 2] == 1;
			seg.wall = this.trackStream[realIndex * 3 + 2] != 2;
	
			seg.p1.x = position + width;
			seg.p2.x = position;
			
			this.count += this.xFrequancy;
			this.countY += this.yFrequancy;
			
			seg.p1.y = seg.p2.y = 1000 + Math.sin(this.countY) * this.ySize; //1000;
		//	seg.p2.y = 1000 + Math.sin(this.count) * this.ySize; // 1000;
	//		console.log(this.count + " : " +seg.p1.y)
			// modifier..
		//	seg.p1.y += 14;
		//	seg.p2.y += 14;
			// tweak!
			seg.p1.offsetVal = seg.p2.offsetVal = Math.sin(this.count) * this.xSize;//800 * 0.5//0.25;
			// sin modifier..
			seg.p1.x += seg.p1.offsetVal;
			seg.p2.x += seg.p2.offsetVal;
			
			
			seg.p1.x += Math.random() * 100;
			seg.p2.x -= Math.random() * 100;
			
	//		seg.p1.y += (Math.random()-0.5) * 100;
	//		seg.p2.y += (Math.random()-0.5) * 100;
			// modifier..
		//	seg.p1.y += 14;
		//	seg.p2.y += 14;
			
			//seg.p1.offsetVal = Math.sin(realIndex/2) * 800 * 0.5//0.25;
			//seg.p2.offsetVal = Math.sin(realIndex/2) * 800 * 0.5//.25;
			// sin modifier..
	//		console.log(Math.sin(position/20) * 800)
			//seg.p1.y += Math.sin(position/20) * 800
		//seg.p2.y += Math.sin(position/20) * 800
		//}
		//console.log(realIndex + " :-: " + this.trackStream.length )
	}
	else
	{
	//	console.log(realIndex + " : " + this.trackStream.length )
		seg.p1.x = this.xOffset;// + 10500
		seg.p2.x = this.xOffset;
		seg.wall = true;
		seg.hole = false;
		
		
	}

}

function shuffle(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
