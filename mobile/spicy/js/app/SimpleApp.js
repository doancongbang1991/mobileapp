
SimpleApp = function(container)
{
	this.container = container;
	this.screens = {};
	this.currentScreen;
	this.fading = false;
	
	this.w = $(window).width(); 
	this.h = $(window).height(); 
	
	this.white = new PIXI.Graphics();
	this.white.beginFill(0xFFFFFF);
	this.white.drawRect(0, 0, 100, 100);
	
	//this.white.visible = false;
	//this.white.alpha = 0;
	this.zoomy = new PIXI.DisplayObjectContainer();
	this.container.addChild(this.zoomy);
	this.container.addChild(this.white);
}

SimpleApp.constructor = SimpleApp;

SimpleApp.prototype.gotoScreenByID = function(id)
{
	this.gotoScreen(this.screens[id]);
}

SimpleApp.prototype.gotoScreen = function(screen, instant)
{
	if(this.currentScreen == screen)return;
	
	this.nextScreen = screen;
	
	if(this.fading)return;
		//console.log("!!")
	
	this.fading = true;
	if(this.currentScreen)
	{
		var scaley = 1.1
		this.white.visible = true;
		TweenLite.to(this.white, 0.4, {alpha:1, onComplete:$.proxy(this.onFadeout, this)});
		TweenLite.to(this.zoomy.scale,0.8, {x:scaley, y:scaley, ease:Cubic.easeOut});
		TweenLite.to(this.zoomy.position, 0.8, {x:this.w/2 - (this.w*scaley)/2, y:this.h/2 - (this.h*scaley)/2,ease:Cubic.easeOut});
		/*
		if(instant)
		{
		}
		else
		{
			TweenLite.to(this.currentScreen, 0.4, {alpha:0, onComplete:$.proxy(this.onFadeout, this)})
		}
		*/
		// hide!
		// tween out on faded... show next!
		
	}
	else
	{
		this.onFadeout();
	}
}

SimpleApp.prototype.onFadeout = function()
{
	if(this.currentScreen)
	{
		if(this.currentScreen.onHidden)this.currentScreen.onHidden();
		this.zoomy.removeChild(this.currentScreen);
	}
	
	
	
	this.currentScreen = this.nextScreen;
	if(this.currentScreen.onShow)this.currentScreen.onShow();
	//console.log(this.currentScreen)
//	this.currentScreen.alpha = 0;
	if(this.currentScreen.resize)this.currentScreen.resize(this.w, this.h);
	
	TweenLite.to(this.white, 0.4, {alpha:0, onComplete:$.proxy(this.onFadein, this)})
	
	TweenLite.to(this.zoomy.scale, 0.8, {x:1, y:1,ease:Expo.easeOut});
	TweenLite.to(this.zoomy.position, 0.8, {x:0, y:0,ease:Expo.easeOut});
	
	//this.zoomy.
	this.zoomy.addChildAt(this.currentScreen, 0);
	
}

SimpleApp.prototype.onFadein = function()
{
	this.white.visible = false;
	this.fading = false;
	if(this.currentScreen.onShown)this.currentScreen.onShown();
	
	if(this.currentScreen != this.nextScreen)
	{
		this.gotoScreen(this.nextScreen);
	}
}

SimpleApp.prototype.resize = function(w, h)
{
	this.w = w;
	this.h = h;
	this.white.scale.x = w/100;
	this.white.scale.y = h/100;
//	this.zoomy.position.x = w/2;
	//this.zoomy.position.y = h/2;
	this.currentScreen
	if(this.currentScreen)if(this.currentScreen.resize)this.currentScreen.resize(w, h);
}
