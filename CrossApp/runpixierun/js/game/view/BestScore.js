/**
 * @author Mat Groves
 */

var GAME = GAME || {};

GAME.BestScore = function()
{
	PIXI.DisplayObjectContainer.call( this );
    
    this.LocalStorage = new Fido.LocalStorage(GAME.bundleId);
	this.ratio = 0;
	
	this.glyphs = {
        0 : "number_00.png",
        1 : "number_01.png",
        2 : "number_02.png",
        3 : "number_03.png",
        4 : "number_04.png",
        5 : "number_05.png",
        6 : "number_06.png",
        7 : "number_07.png",
        8 : "number_08.png",
        9 : "number_09.png",
        "," : "number_comma.png"
	};
	
	for(var i in this.glyphs) this.glyphs[i] = PIXI.Texture.fromFrameId(this.glyphs[i]);
	
	this.digits = [];
	
	for ( var i = 0; i < 8; i++) 
	{
		this.digits[i] = new PIXI.Sprite(this.glyphs[i]);
        this.digits[i].scale.set(0.36);
		this.addChild(this.digits[i]);
	}

	this.title = PIXI.Sprite.fromFrame("assets/hud/PersonalBest.png");
    this.title.anchor.x = 0;
    this.title.anchor.y = 0;
    this.title.position.y = 1;
	this.addChild(this.title); 
}


GAME.BestScore.constructor = PIXI.Score;
GAME.BestScore.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

GAME.BestScore.prototype.setScore = function(score)
{
	var split = formatScore(score).split("");
	var position = 0;
	var gap = 3;

	this.title.position.x = 0;
	position+=70+gap; 

	for ( var i = 0; i < split.length; i++) 
	{
		var digit = this.digits[i];
		digit.visible = true;
		digit.setTexture(this.glyphs[split[i]]);
		digit.position.x = position;
        digit.anchor.x = 0;
        digit.anchor.y = 0;
		position += digit.width - gap;
	}
	
	position = 150 + position / 2;
	this.title.position.x -= position;

	for ( var i = 0; i < this.digits.length; i++) 
	{
		this.digits[i].position.x -= position;
	}
	
	for ( var i = split.length; i < this.digits.length; i++) 
	{
		this.digits[i].visible = false;
	}
}

GAME.BestScore.prototype.jump = function()
{
	this.ratio = 2.2;
}

GAME.BestScore.prototype.update = function()
{
    
    this.setScore(Math.round(parseInt(this.LocalStorage.get('highscore'))) || 0);
}