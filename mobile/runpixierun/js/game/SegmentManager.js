/**
 * @author Mat Groves
 */

/**
 * @author Mat Groves
 */

var GAME = GAME || {};

GAME.SegmentManager = function(engine)
{
	this.engine = engine;
	
	this.sections = data//[section1, section2];
	this.count = 0;
	this.currentSegment = data[0]
	//this.currentSegment.start = -10000
	this.startSegment = {length:1135 * 2, floor:[0,1135], blocks:[], coins:[]},
	this.chillMode = true;
	this.last = 0; 
	this.position = 0;
}

// constructor
GAME.SegmentManager.constructor = GAME.SegmentManager;

GAME.SegmentManager.prototype.reset = function(dontReset)
{
//	this.currentSegment.start;// = GAME.camera.x;
	if(dontReset)this.count = 0;
	this.currentSegment = this.startSegment;
	this.currentSegment.start = -200;
	
	for ( var i = 0; i < this.currentSegment.floor.length; i++) 
	{
		this.engine.floorManager.addFloor( this.currentSegment.start + this.currentSegment.floor[i]);
	}
}

GAME.SegmentManager.prototype.update = function()
{
	this.position = GAME.camera.x + width * 2;
	// look at where we are..
	var relativePosition = this.position - this.currentSegment.start;
	
//	console.log(Math.round(relativePosition) + " " +this.currentSegment.length);
	if(relativePosition > this.currentSegment.length)
	{
		
			
		if(this.engine.joyrideMode)
		{
			var nextSegment = this.startSegment
			nextSegment.start = this.currentSegment.start + this.currentSegment.length;
			this.currentSegment = nextSegment;
	
			for ( var i = 0; i < this.currentSegment.floor.length; i++) 
			{
				this.engine.floorManager.addFloor(this.currentSegment.start + this.currentSegment.floor[i]);
			}
			
			return;
		}
		
		
		var nextSegment = this.sections[this.count % this.sections.length];
//		if(this.chillMode)nextSegment =  this.sections[0];
	//	console.log( this.sections.length)
		// section finished!
		nextSegment.start = this.currentSegment.start + this.currentSegment.length;
		
		this.currentSegment = nextSegment;
	
		// add the elements!
		for ( var i = 0; i < this.currentSegment.floor.length; i++) 
		{
			this.engine.floorManager.addFloor(this.currentSegment.start + this.currentSegment.floor[i]);
		}
		
		var blocks = this.currentSegment.blocks;
		var length = blocks.length/2;
		
		for ( var i = 0; i < length; i++) 
		{
			this.engine.enemyManager.addEnemy(this.currentSegment.start + blocks[i*2], blocks[(i*2)+1]);
		}
		
		var pickups = this.currentSegment.coins;
		var length = pickups.length/2;
		
		for ( var i = 0; i < length; i++) 
		{
			this.engine.pickupManager.addPickup(this.currentSegment.start + pickups[i*2], pickups[(i*2)+1]);
		}
		
		this.count ++;
		
	}
	
}

