/**
 * @author Mat Groves
 */

/**
 * @author Mat Groves
 */

var GAME = GAME || {};


GAME.PowerBar = function(owner)
{
	PIXI.DisplayObjectContainer.call( this );

	this.barBG =  PIXI.Sprite.fromFrame("bulletTime_back.png");
	this.addChild(this.barBG);
	this.barBG.position.x = 20;
	this.barBG.position.y = 30;
	
	
	
	this.bar =  PIXI.Sprite.fromFrame("powerFillBar.png");
	this.addChild(this.bar);
	this.bar.position.x = 20;
	this.bar.position.y = 30;
	
	this.frame = PIXI.Sprite.fromFrame("bulletTime_BG.png");
	this.addChild(this.frame);
	this.position.x = 100;
	
	//this.pixiText.position.x = 20;
	//this.pixiText.position.y = 8//5;
	
	
}

GAME.PowerBar.constructor = GAME.PowerBar;
GAME.PowerBar.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
