/**
 * @author Mat Groves
 */

/**
 * @author Mat Groves
 */

var GAME = GAME || {};

GAME.Background = function(frontView)
{
	PIXI.DisplayObjectContainer.call( this );
	this.width = 1000;
	this.scrollPosition = 1500;
	//{"x":604,"y":803,"w":600,"h":799},
	//{"x":1206,"y":2,"w":600,"h":799},
	//{"x":604,"y":2,"w":600,"h":799},
	
	this.foggyTrees = new GAME.BackgroundElement(PIXI.Texture.fromFrameId("05_far_BG.jpg"), 40, this);
	this.rearSilhouette = new GAME.BackgroundElement(PIXI.Texture.fromFrameId("03_rear_silhouette.png"), 358, this);
	this.rearCanopy = new GAME.BackgroundElement(PIXI.Texture.fromFrameId("03_rear_canopy.png"), 0, this);
	
	
	
	this.tree1 = PIXI.Sprite.fromFrame("02_tree_1.png");
	this.tree1.anchor.x = 0.5;
	this.addChild(this.tree1);
	
	this.tree2 = PIXI.Sprite.fromFrame("02_tree_2.png");
	this.tree2.anchor.x = 0.5;
	this.tree2.position.y = 50;
	this.addChild(this.tree2);

	this.farCanopy = new GAME.BackgroundElement(PIXI.Texture.fromFrameId("02_front_canopy.png"), 0, this);
	this.vines = new GAME.Vines(this);
	this.roofLeaves = new GAME.BackgroundElement(PIXI.Texture.fromFrameId("00_roof_leaves.png"), 0, this);
	
	this.frontSilhouette = new GAME.BackgroundElement(PIXI.Texture.fromFrameId("01_front_silhouette.png"), 424, this);
	
	//this.ground = new GAME.BackgroundElement(PIXI.Texture.fromFrameId("00_forest_floor.png"), (640 - 158)* SCALE, this);
	this.foggyTrees.speed = 1/2;
	this.rearSilhouette.speed = 1.2/2;
	
	this.rearCanopy.speed = 1.2/2;
	this.farCanopy.speed = 1.5/2;
	this.frontSilhouette.speed = 1.6/2;
	this.roofLeaves.speed = 2/2;
	//this.ground.speed = 1
	
	
}

// constructor
GAME.Background.constructor = GAME.Background;

GAME.Background.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

GAME.Background.prototype.updateTransform = function()
{
	this.scrollPosition = GAME.camera.x + 4000// * GAME.time.DELTA_TIME;

	var treePos = -this.scrollPosition * 1.5/2;
	treePos %= this.width + 556;
	treePos += this.width + 556;
	treePos -= this.tree1.width/2;
	this.tree1.position.x = treePos -GAME.xOffset;
	
	var treePos2 = -(this.scrollPosition + this.width/2) * 1.5/2;
	treePos2 %= this.width + 556;
	treePos2 += this.width + 556;
	treePos2 -= this.tree2.width/2;
	this.tree2.position.x = treePos2 -GAME.xOffset;
	
	//this.ground.setPosition(this.scrollPosition);
	this.foggyTrees.setPosition(this.scrollPosition);
	this.rearSilhouette.setPosition(this.scrollPosition);
	this.rearCanopy.setPosition(this.scrollPosition);
	this.farCanopy.setPosition(this.scrollPosition);
	this.frontSilhouette.setPosition(this.scrollPosition);
	
	this.roofLeaves.setPosition(this.scrollPosition);
	//this.ground.setPosition(this.scrollPosition);
	
	this.vines.setPosition(this.scrollPosition);
	
	
	PIXI.DisplayObjectContainer.prototype.updateTransform.call( this );
}

GAME.Vines = function(owner)
{
	this.vines = [];
	this.owner = owner

	for (var i=0; i < 10; i++) 
	{
		var vine = new PIXI.Sprite.fromFrame("01_hanging_flower3.png");
		vine.offset = i * 100 + Math.random() * 50;
		vine.speed = (1.5 + Math.random() * 0.25 )/2;
		vine.position.y = Math.random() * -200;
		owner.addChild(vine);
		vine.position.x = 200;
		this.vines.push(vine);
	};	
				  
	this.speed = 1;
}

GAME.Vines.prototype.setPosition = function(position)
{
	for (var i=0; i < this.vines.length; i++) 
	{
		var vine = this.vines[i];
		
		var pos = -(position + vine.offset) * vine.speed;// * this.speed;
		pos %=  this.owner.width;
		pos +=  this.owner.width;
		
		vine.position.x = pos//vine.offset// Math.floor(pos)
		//this.sky[i].position.y = Math.round(this.sky[i].position.y);
	};	
}

GAME.Background.prototype.joyRideMode = function()
{
	// change background!
	
}

GAME.Background.prototype.normalMode = function()
{
	
}

GAME.BackgroundElement = function(texture, y, owner)
{
	this.sprites = [];
	this.spriteWidth = texture.width-1;
	var amount = Math.ceil(940 / this.spriteWidth);
	if(amount < 3)amount = 3;
	
	for (var i=0; i < amount; i++) 
	{
		var sprite = new PIXI.Sprite(texture);
		sprite.position.y = y;
		owner.addChild(sprite);
		this.sprites.push(sprite);
	};	
				  
	this.speed = 1;
}

GAME.BackgroundElement.prototype.setPosition = function(position)
{
	var h = this.spriteWidth;
	
	for (var i=0; i < this.sprites.length; i++) 
	{
		var pos = -position * this.speed;
		pos += i *  h ;
		pos %=  h * this.sprites.length ;
		pos +=  h * 2;
		
		this.sprites[i].position.x = Math.floor(pos) -GAME.xOffset
		//this.sky[i].position.y = Math.round(this.sky[i].position.y);
	};	
}
/*
var GAME = GAME || {};

GAME.Background = function()
{
	PIXI.DisplayObjectContainer.call( this );
	/*
	this.texture = new PIXI.Texture("img/floor.png");
	//this.
	
	this.sprites = [new PIXI.Sprite(this.texture, {x:1206,y:2,width:600,height:799}),
					new PIXI.Sprite(this.texture, {x:604,y:2,width:600,height:799}),
					new PIXI.Sprite(this.texture, {x:2,y:2,width:600,height:799}) ];
	
	for (var i=0; i < this.sprites.length; i++) 
	{
	//	this.addChild(this.sprites[i]);
	};				
	*/
//}

// constructor
//GAME.Background.constructor = GAME.Background;
//GAME.Background.protoype = Object.create( PIXI.DisplayObjectContainer.prototype );

/*
GAME.Background.prototype.updateTransform = function()
{
	
}*/