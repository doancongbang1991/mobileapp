/**
 * @author Mat Groves
 */




TransitionAnimation = function()
{
		      
	PIXI.DisplayObjectContainer.call(this);//
	
	this.halfSprite = PIXI.Sprite.fromImage("img/BG_col_01.png");
	this.halfSprite.skew = -0.2;
	
	this.halfSprite.scale.x = 50/10;
	this.halfSprite.scale.y = APP.height/50;
	this.halfSprite.alpha = 0.5;
	this.halfSprite.position.y = APP.height/2;
	this.halfSprite.anchor.y = 0.5;
	
	this.sprite = PIXI.Sprite.fromImage("img/BG_col_01.png");
	this.sprite.skew = -0.2;
	
	this.sprite.scale.x = (APP.width +200)/50;
	this.sprite.scale.y = APP.height/50;
	this.sprite.position.x = 200;
	this.sprite.position.y = APP.height/2;
	
	this.sprite.anchor.y = 0.5;
	
	this.halfSprite.updateTransform = TransitionAnimation.skewTransform 
	this.sprite.updateTransform = TransitionAnimation.skewTransform 
	
	this.addChild(this.halfSprite);
	this.addChild(this.sprite);
	
	this.visible = false;
}

TransitionAnimation.skewTransform = function()
{
	// TODO OPTIMIZE THIS!! with dirty
	
	this.localTransform[0] = this.scale.x//this._cr * this.scale.x;
	this.localTransform[1] = Math.tan(this.skew) * this.scale.y;// -this._sr * this.scale.y
	this.localTransform[3] = 0//Math.tan(0.5);//this._sr * this.scale.x;
	this.localTransform[4] = this.scale.y//this._cr * this.scale.y;
	
		///AAARR GETTER SETTTER!
	
	this.localTransform[2] = this.position.x;
	this.localTransform[5] = this.position.y;
	
	// TODO optimize?
	mat3.multiply(this.localTransform, this.parent.worldTransform, this.worldTransform);
	this.worldAlpha = this.alpha * this.parent.worldAlpha;		
}

// constructor
TransitionAnimation.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

TransitionAnimation.prototype.start = function(color)
{
	this.color = color
	this.sprite.alpha = 1;
	this.sprite.setTexture(PIXI.Texture.fromImage(backgroundColorsName2[color]));
	this.halfSprite.setTexture(PIXI.Texture.fromImage(backgroundColorsName2[color]));
	//console.log(this.halfSprite.scale.x)// = 100
	this.sprite.position.x = APP.width + 60;
	this.halfSprite.position.x = APP.width + 60;
	this.halfSprite.visible=  true
	TweenLite.to(this.halfSprite.position, 2, {x:-100, ease:Sine.easeInOut});
	TweenLite.to(this.sprite.position, 2, {x:-100, delay:0.23, ease:Sine.easeInOut, onComplete:this.onCovered.bind(this)});
	
	this.visible = true;
}

TransitionAnimation.prototype.onCovered = function()
{
	stage.setBackgroundColor(backgroundColors[this.color]);
	this.halfSprite.visible=  false;
	TweenLite.to(this.sprite, 0.5, {alpha:0, ease:Sine.easeInOut, onComplete:this.onTransitionComplete.bind(this)});
	if(this.onComplete)this.onComplete();
	/*var scope = this;
	setTimeout(function(){
		
		
	}, 1/60)*/
}

TransitionAnimation.prototype.onTransitionComplete = function()
{
	this.visible = false;
	if(this.onCompleteReal)this.onCompleteReal();
}

