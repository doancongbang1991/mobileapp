var GAME = GAME || {};

var enemyFrames;

GAME.Enemy = function()
{
	this.position = new PIXI.Point();
	this.view = new PIXI.Sprite(PIXI.Texture.fromFrameId("spike_box.png"));
	this.view.anchor.x = 0.5;
	this.view.anchor.y = 0.5;
	this.isHit = false;
	this.width = 150;
	this.height = 150;
}

GAME.Enemy.constructor = GAME.Enemy;

GAME.Enemy.prototype.reset = function()
{
	if(this.explosion)
	{
		this.view.removeChild(this.explosion);
		this.explosion.reset();
	}
	
    this.isHit = false;
	this.view.width = 157;
}

GAME.Enemy.prototype.hit = function()
{   
    if(this.isHit) return;

    FidoAudio.stop('blockHit');
    FidoAudio.play('blockHit');
    
    this.isHit = true;
    
	if(!this.explosion) this.explosion = new GAME.Explosion();
    
	this.explosion.explode();
	this.view.addChild(this.explosion);
 
	this.view.setTexture(PIXI.Texture.fromImage("img/empty.png"))
}

GAME.Enemy.prototype.update = function()
{
	this.view.position.x = this.position.x - GAME.camera.x;
	this.view.position.y = this.position.y;
}

