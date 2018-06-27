/**
 * @author Mat Groves
 */

/**
 * @author Mat Groves
 */

var GAME = GAME || {};

var enemyFrames;

var pickupTextures// = ["pickup_01.png", "pickup_02.png", "pickup_03.png", "pickup_04.png", "pickup_05.png", "pickup_06.png", "pickup_07.png", "pickup_08.png"];

GAME.Pickup = function()
{
	//pickup_03.png//
	if(!pickupTextures) pickupTextures = ["pickup_01.png", "pickup_02.png", "pickup_03.png", "pickup_04.png", "pickup_05.png", "pickup_06.png", "pickup_07.png", "pickup_08.png"];

	this.position = new PIXI.Point();
	
	this.view = new PIXI.DisplayObjectContainer();
	this.clip = new PIXI.Sprite(PIXI.Texture.fromFrameId(pickupTextures[Math2.randomInt(0, pickupTextures.length-1)]));
	
	this.clip.anchor.x = 0.5;
	this.clip.anchor.y = 0.5;
	
	this.shine = PIXI.Sprite.fromFrame("pickupShine.png");
	this.shine.anchor.x = this.shine.anchor.y = 0.5;
	//this.shine.blendMode = PIXI.blendModes.SCREEN
	this.shine.scale.x = this.shine.scale.y = 1;
	this.shine.alpha = 0.5;
	if(!GAME.lowMode)this.view.addChild(this.shine);
	this.view.addChild(this.clip);
	
	this.width = 100;
	this.height = 100;
	this.count = Math.random() * 300;
//	GAME.addHitArea(this);
}

// constructor
GAME.Pickup.constructor = GAME.Pickup;

GAME.Pickup.prototype.reset = function()
{
	
}


GAME.Pickup.prototype.update = function()
{
	if(!this.isPickedUp)
	{
		this.count += 0.1 * GAME.time.DELTA_TIME;
		this.clip.scale.x = 0.75 + Math.sin(this.count) * 0.1;
		this.clip.scale.y = 0.75 - Math.cos(this.count) * 0.1;
		this.clip.rotation = Math.sin(this.count * 1.5) * 0.2;
		
		this.shine.rotation = this.count * 0.2;
	}
	else
	{
		this.view.scale.x = 1-this.ratio;
		this.view.scale.y = 1-this.ratio;
		this.position.x = this.pickupPosition.x + (this.steve.position.x - this.pickupPosition.x) * this.ratio;
		this.position.y = this.pickupPosition.y + (this.steve.position.y - this.pickupPosition.y) * this.ratio;
	}
	
	this.view.position.x = this.position.x - GAME.camera.x;
	this.view.position.y = this.position.y;
	
}

