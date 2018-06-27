/*
 * 	param: the html element that will be scrolled
 */
PixiTrackpad = function(target, freeRollin)
{
	this.freeRollin = !!freeRollin
	this.target = target;
	this.value = 0;
	this.easingValue = 00;
	this.dragOffset = 0;
	this.dragging;
	this.speed= 0;
	this.size = 284;
	
	this.prevPosition = 0;
	
	this.valueY = 0;
	this.easingValueY = 0;
	this.dragOffsetY = 0;
	this.speedY= 0;
	this.prevPositionY = 0;
	
	this.didMove = true;
	
	this.target.interactive = true;
	
	this.target.touchstart = this.target.mousedown = this.onDown.bind(this);
	
	this.spring = new Spring();
	
	//$(this.target).mousedown($.proxy(this.onMouseDown, this));
}

// set constructor
PixiTrackpad.constructor = PixiTrackpad;

// create the functions

PixiTrackpad.prototype.unlock = function()
{
	this.locked = false;
	this.speed = 0;
	this.easingValue = this.value;
	
	//this.max = (20 * 100) - ;
}

PixiTrackpad.prototype.lock = function()
{
	this.locked = true;
}

PixiTrackpad.prototype.update = function()
{
	if(this.easingValueY > 0)this.easingValueY = 0;
	if(this.easingValueY < -this.max)this.easingValueY = -this.max;
	
	this.value = this.easingValue;
	this.valueY = this.easingValueY;
	if(this.dragging)
	{
		var newSpeed = this.easingValue - this.prevPosition;
		newSpeed *= 0.7;
		
		this.speed += (newSpeed - this.speed) *0.5;
		this.prevPosition = this.easingValue;
		
		var newSpeedY = this.easingValueY - this.prevPositionY;
		newSpeedY *= 0.7;
		
		this.speedY += (newSpeedY - this.speedY) *0.5;
		this.prevPositionY = this.easingValueY;
	}
	else
	{
		if(this.freeRollin)
		{
			this.spring.update();
			this.easingValue = this.spring.x;
		}
		else
		{
			
			this.speed *= 0.95;
			this.easingValue +=  this.speed;
		
			this.speedY *= 0.95;
			this.easingValueY +=  this.speedY;
		}
	}
}

PixiTrackpad.prototype.setPosition = function(value, valueY)
{
	this.value = this.easingValue = value;
	this.valueY = this.easingValueY = valueY;
}

PixiTrackpad.prototype.onDown = function(data)
{
	if(this.locked)return;
	
	this.didMove = false;
	this.checkX = data.global.x;
	
	max = 30;
	damp = 0.85;
	springiness = 0.09;
	
	this.dragging = true;
	this.dragOffset = data.global.x - this.value;	
	this.dragOffsetY = data.global.y - this.valueY;	
	
	this.target.touchend = this.target.touchendoutside = this.target.mouseup = this.target.mouseupoutside = this.onUp.bind(this);
	this.target.touchmove = this.target.mousemove = this.onMove.bind(this);
	
}

PixiTrackpad.prototype.onUp = function(data)
{
	if(this.locked)return;
	
	this.dragging = false;
	
	
	if(this.didMove)
	{
		this.spring.dx = this.speed;
		if(this.speed < 0)
		{
			this.spring.tx = Math.floor(this.easingValue / this.size) * this.size ;
		}
		else
		{
			this.spring.tx = Math.ceil(this.easingValue / this.size) * this.size ;
		}
	
	}
	this.spring.x = this.easingValue;
			
	this.target.mouseup = null;
	this.target.mousemove = null;
	
	// goto the closest!
	
}

PixiTrackpad.prototype.onMove = function(data)
{
	
	var dist = Math.abs(this.checkX - data.global.x);
	
	if(dist > 2)this.didMove = true;
	
	this.easingValue = (data.global.x - this.dragOffset);
	this.easingValueY = (data.global.y - this.dragOffsetY);
}




