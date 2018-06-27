/**
 * @author Mat Groves
 */

/**
 * @author Mat Groves
 */

var GAME = GAME || {};

GAME.RprView = function(engine)
{
    this.engine = engine;

    if(Device.cocoonJS)
    {
        this.renderer = new PIXI.CanvasRenderer(600, 800);
    }
    else
    {
        this.renderer = PIXI.autoDetectRenderer(600, 800);
    }

    GAME.HIGH_MODE = (this.renderer instanceof PIXI.WebGLRenderer);

    this.stage = new PIXI.Stage();
    
//    console.log("Renderer width = " + this.renderer.width);
//    console.log("Renderer height = " + this.renderer.height);
//    
//    console.log("Window width = " + window.innerWidth || document.body.clientWidth);
//    console.log("Window height = " + window.innerHeight || document.body.clientHeight);

    this.container =   new PIXI.DisplayObjectContainer();
    this.container.hitArea = this.stage.hitArea;
    this.container.interactive = true;

    this.hud = new PIXI.DisplayObjectContainer();
    this.game = new PIXI.DisplayObjectContainer();
    this.gameFront = new PIXI.DisplayObjectContainer();

    this.container.addChild(this.game);
    this.container.addChild(this.gameFront);
	
    this.stage.addChild(this.container);
	this.stage.addChild(this.hud);
    
	if(GAME.lowMode)
	{
		this.normalBackground = new GAME.LowFiBackground();
	}
	else
	{
		this.normalBackground = new GAME.Background(this.gameFront);
	}
	
	this.joyBackground = new GAME.JoyBackground();
	
	this.lava = new GAME.Lava(this.gameFront);

	this.powerBar = new GAME.PowerBar();
	this.score = new GAME.Score();
        this.bestScore = new GAME.BestScore();
	this.background = this.normalBackground;
    
	this.score.position.x = 300;
    
    this.game.addChild(this.background);
	this.hud.addChild(this.powerBar);
	this.hud.addChild(this.score);
	this.hud.addChild(this.bestScore);
	
	this.trail = new GAME.SteveTrail(this.game);
	this.trail2 = new GAME.SteveTrailFire(this.game);
	
	this.powerBar.alpha = 0;
	this.score.alpha = 0;
	this.bestScore.alpha = 0;
    
	this.count = 0;
	this.zoom = 1;
    
	this.white = PIXI.Sprite.fromImage("img/whiteSquare.jpg");
	GAME.xOffset = this.container.position.x;
	
	this.dust = new GAME.PixiDust();
	this.container.addChild(this.dust);
	
	this.splash = new GAME.Splash();
	this.splash.position.y = 300;
	this.splash.position.x = 300;
    
	this.game.addChild(this.splash);
}

// constructor
GAME.RprView.constructor = GAME.RprView;

GAME.RprView.prototype.showHud = function()
{
    var start = 
    {
        x : GAME.width + 300,
        y : 0
    };
    
	this.score.alpha = 1;
	this.score.position.x = start.x;
	TweenLite.to(this.score.position, 1, {
        x : GAME.width - 295 - 20, 
        ease : Elastic.easeOut
    });
    
    this.bestScore.alpha = 1;
	this.bestScore.position.x = start.x;
	this.bestScore.position.y -= 14;
	TweenLite.to(this.bestScore.position, 1, {
        x : GAME.width - 20, 
        ease : Elastic.easeOut
    });
    
	this.powerBar.alpha = 1;
	this.powerBar.position.x = GAME.width;
	TweenLite.to(this.powerBar.position, 1, {
        x : GAME.width - 295, 
        ease : Elastic.easeOut, 
        delay : 0.3
    });
}

GAME.RprView.prototype.hideHud = function()
{
	
}

GAME.RprView.prototype.update = function()
{
	this.count += 0.01;
	
	if(!GAME.lowMode)
	{
		var ratio = (this.zoom-1);
		var position = -GAME.width/2
		var position2 = -this.engine.steve.view.position.x;
		var inter = position + (position2 - position) * ratio;
		
		this.container.position.x = inter * this.zoom ;
		this.container.position.y = -this.engine.steve.view.position.y * this.zoom ;
		
		this.container.position.x += GAME.width/2;
		this.container.position.y += GAME.height/2;
		
		GAME.xOffset = this.container.position.x;
		
		if(this.container.position.y > 0) this.container.position.y = 0;
		var yMax = -GAME.height * this.zoom ;
		yMax += GAME.height;
		
		if(this.container.position.y < yMax) this.container.position.y = yMax;
		
		this.container.scale.x = this.zoom ;
		this.container.scale.y = this.zoom ;
	}
	
	this.trail.target = this.engine.steve;
	this.trail2.target = this.engine.steve;

	this.trail.update();
	this.trail2.update();
	this.dust.update();
	
	this.lava.setPosition(GAME.camera.x + 4000);
	this.bestScore.update();	
    this.score.setScore(Math.round(this.engine.score));
	this.powerBar.bar.scale.x = ( (this.engine.pickupCount/(50 *  this.engine.bulletMult) )*(248/252) )
	this.renderer.render(this.stage);
}

GAME.RprView.prototype.joyrideMode = function()
{
	this.game.removeChild(this.background);
	this.background = this.joyBackground;
	this.game.addChildAt(this.background, 0);
	this.stage.addChild(this.white);
	this.white.alpha = 1;
	
    TweenLite.to(this.white, 0.7, {
        alpha:0, 
        ease:Sine.easeOut
    });
}

GAME.RprView.prototype.doSplash = function()
{
	this.splash.splash( this.engine.steve.position);
}

GAME.RprView.prototype.normalMode = function()
{
	this.game.removeChild(this.background);
	this.background = this.normalBackground;
	this.game.addChildAt(this.background, 0);
	this.stage.addChild(this.white)
	this.white.alpha = 1;
    
	TweenLite.to(this.white, 0.5, {
        alpha : 0, 
        ease : Sine.easeOut
    });
}

GAME.RprView.prototype.resize = function(w, h)
{
//    console.log("Width ->" + w);
//    console.log("Height -> " + h);

	GAME.width = w;
	GAME.height = h;
    
	this.renderer.resize(w,h);
	this.background.width = w;
    
	this.bestScore.position.x = w - 20;
	this.bestScore.position.y = 100;
    
        this.score.position.x = w - 295 - 20;
	this.score.position.y = 12;
    
	this.white.scale.x = w/16;
	this.white.scale.y = h/16;
    
	this.powerBar.position.x = w - 295;
	this.powerBar.position.y = 12;
}