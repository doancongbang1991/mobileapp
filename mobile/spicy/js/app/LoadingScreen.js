
LoadingScreen = function()
{
	PIXI.DisplayObjectContainer.call(this);
	
	this.loading = PIXI.Sprite.fromImage(REMOTE_PATH + "img/loading.png", true)
	//this.addChild(	this.loading);
	
	this.crumb =  PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/crumbScale.png", true)
	this.crumbPanal =  PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/loaderPanel.png", true)
	this.loadingText =  PIXI.Sprite.fromImage(REMOTE_PATH + "img/loadingText.png", true)
	
	this.crumbPanal.addChild(this.crumb);
	
	
	this.crumbPanal.anchor.x = this.crumbPanal.anchor.y = 0.5;
	this.crumb.anchor.x = this.crumb.anchor.y = 0.5;
	this.loadingText.position.y = 100;
	this.loadingText.anchor.x = this.loadingText.anchor.y = 0.5;
	
	this.crumb.scale.x = this.crumb.scale.y = 0;
	this.target = 0;
	
	this.tint = new PIXI.Graphics();
	this.tint.beginFill(0x0, 0.5);
	this.tint.drawRect(0,0, 100, 100);
	this.addChild(this.tint);
	
	this.addChild(this.crumbPanal);
	this.addChild(this.loadingText);
	this.count = 0;
}

LoadingScreen.constructor = LoadingScreen;
LoadingScreen.prototype = Object.create( PIXI.DisplayObjectContainer.prototype ); 


LoadingScreen.prototype.updateTransform = function()
{
	PIXI.DisplayObjectContainer.prototype.updateTransform.call( this );
	//console.log( World.percentLoaded())
	var p1 =  World.percentLoaded();
	var p2 = 1 - (APP.loader.loadCount / APP.loader.assetURLs.length);
	this.target += ( ((p1 + p2)*0.5) - this.target ) * 0.1;
	this.crumb.scale.x = this.crumb.scale.y = this.target;
	
	this.count += 0.1
	this.crumbPanal.scale.x = 	this.crumbPanal.scale.y = 0.8 + (Math.sin(this.count) + 1) * 0.5 * 0.1;
	
	this.crumbPanal.rotation = Math.sin(this.count/3.2) * 0.1
}


LoadingScreen.prototype.resize = function(w, h)
{
	this.crumbPanal.position.x = w/2;
	this.crumbPanal.position.y = h/2;
	
	this.loadingText.position.x = w/2;
	this.loadingText.position.y = h/2 + 80;
	
	this.tint.scale.x = w/100;
	this.tint.scale.y = h/100;
	
	
}


