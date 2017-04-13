
ControlSelectOverlay = function(engine)
{
	PIXI.DisplayObjectContainer.call(this);
	
	this.bg = PIXI.Sprite.fromFrame("mobileControlMethod.png");
	this.bg.anchor.x = this.bg.anchor.y = 0.5;

	
	
	this.tint = new PIXI.Graphics();
	this.tint.beginFill(0x000, 0.7);
	this.tint.drawRect(-1000, -1000, 2000, 2000);
	this.tint.endFill();
	
	this.hitAreaView = new PIXI.Graphics();
	this.hitAreaView.beginFill(0x000, 0.7);
	this.hitAreaView.drawRect(-160, -30, 330, 100);
	this.hitAreaView.endFill();
	
	this.hitArea = new PIXI.Rectangle(-160, -30, 330, 100);
	this.interactive = true;
	
	this.click = this.tap = function(data)
	{
		var pos = data.getLocalPosition(this);
		
		if(pos.x > 0)
		{
			this.onTouchPressed();
		}
		else
		{
			this.onTiltPressed();
		}
		
	}.bind(this)
	
	this.addChild(this.tint);
	this.addChild(this.bg);
	//this.addChild(this.hitAreaView);
	
	//this.pauseMenu.addChild(this.restartButton);
	
	
	
}

ControlSelectOverlay.prototype = Object.create( PIXI.DisplayObjectContainer.prototype ); 

ControlSelectOverlay.prototype.show = function()
{
	this.tint.alpha = 0;
	this.bg.alpha = 0;
	
	TweenLite.to(this.tint, 0.4, {alpha:1});
	TweenLite.to(this.bg, 0.4, {alpha:1, delay:0.4 });
}

ControlSelectOverlay.prototype.hide = function()
{
	this.visible = false;	
}

ControlSelectOverlay.prototype.onTiltPressed = function()
{
	APP.gameScreen.game.controller.setTilt();
	this.hide();
	if(this.onSelect)this.onSelect();
}

ControlSelectOverlay.prototype.onTouchPressed = function()
{
	APP.gameScreen.game.controller.setTouch();
	this.hide();
	if(this.onSelect)this.onSelect();
}
