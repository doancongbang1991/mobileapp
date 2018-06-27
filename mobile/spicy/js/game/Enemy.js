
var GAME = GAME || {};

Enemy = function()
{
	GameElement.call( this );
	this.view.crossOrigin = true;
	this.view.src = REMOTE_PATH + "img/title.png"
	this.scale = 1;
	this.wallWidth = 1500/2;
	this.wallHeight = 800;
	
	this.exploding = false;
}

Enemy.prototype = Object.create( GameElement.prototype );

Enemy.flip = true;

Enemy.prototype.explode = function()
{
	if(this.exploding)return;
	this.exploding = true;
	
	this.directionY = -100;//Math.random() * 10;
	this.directionX = 100;//Math.random() * 10;
	
	Enemy.flip = !Enemy.flip;
	
	if(Enemy.flip)this.directionX *= -1;
	
	//TweenLite.to(this.position, 1, {x:this.position.x + 2000})
	//TweenLite.to(this, 1, {rotation:10})
	//this.rotation
}

