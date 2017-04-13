/**
 * @author Mat Groves
 */

/**
 * @author Mat Groves
 */

var GAME = GAME || {};

GAME.LowFiBackground = function()
{
	PIXI.DisplayObjectContainer.call( this );
	this.width = 1000;
	this.scrollPosition = 1500;
	var SCALE =1// 0.5
	this.swoosh = new GAME.BackgroundElement(PIXI.Texture.fromImage("img/iP4_BGtile.jpg"), 0 , this);
	this.swoosh.speed = 0.7
}

// constructor
GAME.LowFiBackground.constructor = GAME.LowFiBackground;

GAME.LowFiBackground.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

GAME.LowFiBackground.prototype.updateTransform = function()
{
	this.scrollPosition = GAME.camera.x + 4000// * GAME.time.DELTA_TIME;

	this.swoosh.setPosition(this.scrollPosition);
	PIXI.DisplayObjectContainer.prototype.updateTransform.call( this );
}


