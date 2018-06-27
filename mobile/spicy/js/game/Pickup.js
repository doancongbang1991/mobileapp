
var GAME = GAME || {};

Pickup = function()
{
	GameElement.call( this );
	this.view.crossOrigin = ''
	this.frame = true;
	this.view.src = REMOTE_PATH +"img/pickups/nugget.png";
	this.scale = 3.4;
	this.width = 100;
	this.heightRatio = 0.85;
	this.currentFrame = 0;
}

Pickup.prototype = Object.create( GameElement.prototype );

