
Controller = function(game)
{
	this.game = game;
	
	this.tilt = false//(window.DeviceOrientationEvent);
//	console.log("HI")

	/*
	if(!!('ondevicemotion' in window))
	{
		this.setTilt();
	//	alert("TILT")
	}
	else if(!!('ontouchstart' in window))
	{
		this.setTouch();
	}
	else
	{
	}
*/
	this.setKeys();
	
	this.leftTouch;
	this.rightTouch;
	this.jumpTouch;
	
	this.lean = 0;
	this.keyState = 0;
	
	this.accelerationY = 0;
	
	this.controlMode = Controller.KEYS;
	
}

Controller.KEYS = 0;
Controller.TILT = 1;
Controller.TOUCH = 2;

Controller.prototype.removeControl = function()
{
	if(this.controlMode == Controller.KEYS)
	{
		document.body.onkeydown = null// this.onKeyDown.bind(this);
		document.body.onkeyup = null//this.onKeyUp.bind(this);
	}
	else if(this.controlMode == Controller.TILT)
	{
		this.tilt = false;
		window.ondevicemotion = null//this.onDeviceMotion.bind(this);
		document.body.ontouchstart = null//this.onTiltTouch.bind(this);
	}
	else if(this.controlMode == Controller.TOUCH)
	{
		document.body.ontouchstart = null
		document.body.ontouchend = null
	}
}

Controller.prototype.setTilt = function()
{
	this.removeControl();
	this.controlMode = Controller.TILT;
	this.tilt = true;
	window.ondevicemotion = this.onDeviceMotion.bind(this);
	document.body.ontouchstart = this.onTiltTouch.bind(this);
	
	PROFILE.speedMod = 0.7;	
}

Controller.prototype.setKeys = function()
{
	this.removeControl();
	this.controlMode = Controller.KEYS;
	document.body.onkeydown = this.onKeyDown.bind(this);
	document.body.onkeyup = this.onKeyUp.bind(this);
	
	
	PROFILE.speedMod = 1;
}

Controller.prototype.setTouch = function()
{
	this.removeControl();
	this.controlMode = Controller.TOUCH;
	
	document.body.ontouchstart = this.onTouchStart.bind(this);//, true);
	document.body.ontouchend = this.onTouchEnd.bind(this);
	
	PROFILE.speedMod = 0.8;
}

Controller.prototype.update = function()
{
	// smooth out
	if(this.tilt)
	{
		this.lean = this.accelerationY * APP.profile.flipTilt;//* 0.75;
		if(this.lean < -1)this.lean = -1;
		else if(this.lean > 1)this.lean = 1;
	}
	else
	{
		this.lean = 0;
		
		if(this.leftDown && this.rightDown)
		{
			this.lean = 0;
		}
		else if(this.leftDown)
		{
			this.lean = -1
		}
		else if(this.rightDown)
		{
			this.lean = 1;
		}
	}
	
//	var maxSpeed = 30;
	var accel = 2.5;
//	var friction = 0.9;
//	var changefriction = 0.1;
	
	var ball = this.game.ball;
	
	if(ball.isDead)
	{
		this.lean = 0;
		ball.ax = ball.bashDirection;
	}
	//else if(ball.isAsending)
	//{
	//	this.lean = 0;
	//	ball.ay = -3;
	//}
	//else
	//{
	//}
	
	if(ball.state == Ball.NORMAL)
	{
		ball.ax = (this.lean  * accel);
	}
	
	ball.update();
	
	
	// set width 
	
//	var buttonWidth = 0.1;
	var buttonWidth = window.innerWidth * 0.1;
	if(buttonWidth < 60)buttonWidth = 60
	
	
}

Controller.prototype.onDeviceMotion = function(e)
{
	//var output = document.getElementById("output");
	//output.innerHTML = window.orientation;
	
	if(window.orientation == 90)
	{
		this.accelerationY = -e.accelerationIncludingGravity.y;  
	}
	else if(window.orientation == -90)
	{
		this.accelerationY = e.accelerationIncludingGravity.y;  
	}
	else if(window.orientation == 0)
	{
		this.accelerationY = e.accelerationIncludingGravity.x;
	}
	else
	{
		this.accelerationY = -e.accelerationIncludingGravity.x;
	}
	
	this.accelerationY *= 0.5
	
}

Controller.prototype.onTouchStart = function(e)
{
	e.preventDefault();
	
	//var buttonWidth = 0.1;
	
	var buttonWidth = window.innerWidth * 0.1;
	if(buttonWidth < 60)buttonWidth = 60
	
//	alert(e.global.x)
//	console.log(percent)
	var changedTouches = event.changedTouches;
	for (var i=0; i < changedTouches.length; i++) 
	{
		var touchEvent = changedTouches[i];
		//var percent = touchEvent.clientX /  window.innerWidth;
		
		if(touchEvent.clientX < buttonWidth)
		{
	//		this.leftTouch = e;
			this.leftTouch = touchEvent.identifier;
			this.leftDown = true;
		}
		else if(touchEvent.clientX > window.innerWidth-buttonWidth)
		{
			this.rightTouch = touchEvent.identifier;
			this.rightDown = true;
		}
		else
		{
			//this.jumpTouch = e;
			this.game.ball.jump()//dy = -60;
		}
	}	

}

Controller.prototype.onTiltTouch = function(e)
{
	e.preventDefault();
	this.game.ball.jump();
	
}

Controller.prototype.onTouchEnd = function(e)
{
//	var percent = e.global.x / APP.renderer.view.width;
	
	var changedTouches = event.changedTouches;
	
	for (var i=0; i < changedTouches.length; i++) 
	{
		var touchEvent = changedTouches[i];
		
		if(this.leftTouch ==  touchEvent.identifier)
		{
	//		this.leftTouch = e;
			this.leftTouch = null//touchEvent.identifier;
			this.leftDown = false;
		}
		
		if(this.rightTouch == touchEvent.identifier)
		{
			this.rightTouch = null// touchEvent.identifier;
			this.rightDown = false;
		}
			
	}
	/*console.log("UP")
	if(this.leftTouch == e)
	{
		this.leftTouch = null
		this.leftDown = false;
	}
	else if(this.rightTouch == e)
	{
		this.rightTouch = null;
		this.rightDown = false;
	}*/
	
	
}

Controller.prototype.onKeyDown = function(e)
{
	
	if(e.keyCode == 37)
	{
		this.leftDown = true
		this.keyState = -1
		this.lastKey = e.keyCode;
	}
	else if(e.keyCode == 39)
	{
		this.rightDown = true
		this.keyState = 1
		this.lastKey = e.keyCode;
	}
	else if(e.keyCode == 38 || e.keyCode == 32)
	{
		this.game.ball.jump();
	}
	else if(e.keyCode == 80)
	{
		if(this.game.paused)
		{
			this.game.view.hud.onResumePressed();
		}	
		else
		{
			this.game.view.hud.onPausePressed();
		}	
			
			
	}
}

Controller.prototype.onKeyUp = function(e)
{
	if(e.keyCode == 37)
	{
		this.leftDown = false;
	}
	else if(e.keyCode == 39)
	{
		this.rightDown = false;
	}
}


