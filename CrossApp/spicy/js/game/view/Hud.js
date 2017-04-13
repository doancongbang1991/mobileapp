
Hud = function(engine)
{
	this.engine = engine
	PIXI.DisplayObjectContainer.call(this);
	
	this.scoreLabel = new PIXI.Text("101293043", {font: "30px Pathway Gothic One", fill:"#de571c"});
	this.scoreLabel.anchor.x = 0;
	
	this.bg = PIXI.Sprite.fromFrame("scorePanel.png");
	this.addChild(this.bg);
	this.bg.anchor.x = 1;
//	console.log("HI")
	this.soundButton = new SoundButton();
	this.bg.addChild(this.soundButton);
	this.soundButton.position.y = 110-5-2;
	this.soundButton.position.x = -10+7+3;
	
	this.crumbPanel = PIXI.Sprite.fromFrame("crumbPanel.png");
	this.crumbScale = PIXI.Sprite.fromFrame("crumbScale.png");
	
	this.crumbPanel.anchor.x = this.crumbPanel.anchor.y = 0.5;
	this.crumbScale.anchor.x = this.crumbScale.anchor.y = 0.5;
	this.crumbScale.position.x = 1;
	this.crumbScale.position.y = -3;
	
	this.crumbPanel.addChild(this.crumbScale);
	
	this.addChild(this.scoreLabel);
	this.bg.addChild(this.crumbPanel);
	
	this.crumbPanel.position.x = - 230;
	this.crumbPanel.position.y =  this.crumbPanel.height/2 - 20+3;
	
	this.pauseButton = PIXI.Sprite.fromFrame("pauseButton.png")
	this.pauseButton.anchor.x = 1;
	this.pauseButton.position.x = -30 ;
	this.pauseButton.position.y = 80;
	
	if(PROFILE.mobile)
	{
		this.pauseButton.hitArea = new PIXI.Rectangle(-200, -200, 300, 300)	
	}
	
	this.addChild(this.pauseButton);
	
	this.pauseMenu = new PIXI.DisplayObjectContainer();
	
	this.menuHolder =  new PIXI.DisplayObjectContainer();
	
	this.pauseMenuBackground = PIXI.Sprite.fromImage("img/UI/pausePanel.png", true);
	
	
	this.pauseMenuBackground.anchor.x = 0.5;
	this.pauseMenuBackground.anchor.y = 0.5;
	
	this.pauseMenuLogo = PIXI.Sprite.fromFrame("pauseLogo.png");
	this.pauseMenuLogo.anchor.x = 0.5;
	this.pauseMenuLogo.anchor.y = 0.5;
	this.pauseMenuLogo.position.y = -135
	
	this.menuHolder.addChild(this.pauseMenuBackground);
	this.menuHolder.addChild(this.pauseMenuLogo);
	
	this.tc =  new PIXI.Text("Game Ts & Cs" || 101, {font: "14px Pathway Gothic One", fill:"#000000"});
	
	this.tc.position.x = -25
	this.tc.position.y = 163;
	BasicButton.apply(this.tc, function(){
		
		window.open(APP.tc, "_blank");
		
	});
	
	this.resumeButton = new McBiteButton("pause_resume_up.png", "pause_resume_press.png");// new PIXI.Text("RESUME", {font: "35px Snippet", fill: "black", align: "left"});
	this.restartButton = new McBiteButton("pause_restart_up.png", "pause_restart_press.png");
	this.homeButton = new McBiteButton("pause_main_up.png", "pause_main_press.png");
	this.helpButton = new McBiteButton("pause_howto_up.png", "pause_howto_press.png");
	
	this.background = new PIXI.Graphics();
	this.background.beginFill(0x000000, 0.75);
	this.background.drawRect(0, 0, 300, 300);
	this.background.endFill();
	
	
	this.pauseMenu.addChild(this.background);
	this.pauseMenu.addChild(this.menuHolder);
	
	
	this.menuHolder.addChild(this.resumeButton);
	this.menuHolder.addChild(this.restartButton);
	this.menuHolder.addChild(this.homeButton);
	this.menuHolder.addChild(this.helpButton);
	
	this.menuHolder.addChild(this.tc);
	var offset = -32;
	var space = 49;
	
	this.resumeButton.position.y =  offset;
	this.restartButton.position.y = 1 * space + offset;
	this.homeButton.position.y = 2 * space + offset;
	this.helpButton.position.y = 3 * space + offset; 
	
	
	BasicButton.apply(this.pauseButton, this.onPausePressed.bind(this));
	
	BasicButton.apply(this.resumeButton, this.onResumePressed.bind(this));
	BasicButton.apply(this.homeButton, this.onHomePressed.bind(this));
	
	BasicButton.apply(this.restartButton, this.onRestartPressed.bind(this));
	
	BasicButton.apply(this.helpButton, this.onHelpPressed.bind(this));
	
	this.backButton = new McBiteButton("back_button_up.png", "back_button_press.png")// PIXI.Sprite.fromFrame("back.png");//new PIXI.Text("Close", {font:"35px Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	
	this.backButton.alpha = 0;
	this.menuHolder.addChild(this.backButton);
	this.backButton.position.x = 100;
	this.backButton.position.y = -190 + 14;
	
	BasicButton.apply(this.backButton, this.onBackPressed.bind(this));
	
	this.backButton.interactive = false;
	
	this.resumeButton.alpha = 0;
	this.homeButton.alpha = 0;
	
	//this.background.alpha = 1;
	
	
	
	this.timeline = new TimelineLite({onReverseComplete:this.onPauseHidden.bind(this)});
	this.background.alpha = 0;
	this.timeline.to(this.pauseButton, 0.3, {alpha:0});
	this.timeline.to(this.background, 0.3, {alpha:1},0);
	this.timeline.to(this.resumeButton, 0.3, {alpha:1}, 0.2);
	this.timeline.to(this.homeButton, 0.3, {alpha:1}, 0.4);
	this.timeline.stop();
	this.timeline.timeScale(2);
	
	this.ascensionText = PIXI.Sprite.fromFrame("tutorialBG.png");
	this.ascensionText2 = PIXI.Sprite.fromFrame("levelUP.png");
	this.ascensionText.anchor.x = 0.5;
	this.ascensionText.anchor.y= 0.5;
	
	this.ascensionText2.anchor.x = 0.5;
	this.ascensionText2.anchor.y= 0.5;
		this.ascensionText.position.y = -300;
	this.addChild(this.ascensionText)
	this.ascensionText.addChild(this.ascensionText2)
	
//	this.timeline.to(this.logo, 0.4, { scaleX:scale, scaleY:scale, y:-100, ease:Back.easeInOut}, 2.5);
	
}

Hud.prototype = Object.create( PIXI.DisplayObjectContainer.prototype ); 

Hud.prototype.setScore = function(percent, score)
{
	this.crumbScale.scale.x = this.crumbScale.scale.y = percent * 0.55;
	
	
	this.scoreLabel.setText(formatScore(Math.floor(score / 10) * 10));
}

Hud.prototype.reset = function(percent)
{
	if(this.pauseMenu.parent)this.removeChild(this.pauseMenu);
	this.crumbScale.scale.x = this.crumbScale.scale.y = 0;
	this.timeline.reverse(true, false)
	//this.background.alpha = 0;
}

Hud.prototype.onPausePressed = function()
{
	// show menu..
	this.engine.pause();
	this.addChild(this.pauseMenu);
	this.timeline.play();
	APP.highRez();
}



Hud.prototype.onRestartPressed = function()
{
	if(!APP.emptyScreen)
	{
		APP.emptyScreen = new PIXI.DisplayObjectContainer();
		APP.emptyScreen.onShown = function()
		{
			APP.simpleApp.gotoScreen(APP.gameScreen )	
		}
	}
	// show menu..
	//this.engine.stop();
	this.engine.stop();
	APP.simpleApp.gotoScreen(APP.emptyScreen )
}


Hud.prototype.ascension = function()
{
	this.ascensionText.position.y = -300;
	TweenLite.to(this.ascensionText.position, 1, {y:690/2, ease:Expo.easeOut, onComplete:function(){
		
	//	console.log()
		//TweenLite.to(this.ascensionText.position, 1, {y:690/2 + 30, onComplete:function(){
			TweenLite.to(this.ascensionText.position, 1, {y:830, ease:Expo.easeIn});
			
		//}.bind(this)})//, onComplete:function(){
		
	}.bind(this)})
}

Hud.prototype.onHomePressed = function()
{
	// show menu..
	legals.show();
	this.engine.stop();
	APP.simpleApp.gotoScreen(APP.titleScreen)
}

Hud.prototype.onResumePressed = function()
{
	this.timeline.reverse(false);
	// show menu..
	
}

Hud.prototype.onPauseHidden = function()
{
	// show menu..
	APP.lowRez();
	this.engine.resume();
	if(this.pauseMenu.parent)this.removeChild(this.pauseMenu);
}


Hud.prototype.onBackPressed = function()
{
	TweenLite.to(this.backButton, 0.3, {alpha:0});
		this.backButton.interactive = false;
	
	TweenLite.to(this.pauseMenuLogo, 0.3, {alpha:1});
	TweenLite.to(this.help, 0.3, {alpha:0, onComplete:function(){
		
		this.pauseMenu.removeChild(this.help);
		
	}.bind(this)});
	
	
	this.resumeButton.interactive = true;
	this.homeButton.interactive = true;
	this.restartButton.interactive = true;
	this.helpButton.interactive = true;
	
}

Hud.prototype.onHelpPressed = function()
{
	// show menu..
	// show help!
	if(!this.help)
	{
		this.help = new HelpOverlay();
		this.help.position.x = -285/2 ;// *3;	
		this.help.position.y = 230 + 68;	
	//	this.pauseMenu.addChild(this.help);
	}
	
	this.pauseMenu.addChild(this.help);
	this.help.alpha= 0;
	TweenLite.to(this.help, 0.3, {alpha:1});
	TweenLite.to(this.backButton, 0.3, {alpha:1});
	this.backButton.interactive = true;
	
	TweenLite.to(this.pauseMenuLogo, 0.3, {alpha:0});
	
	this.resumeButton.interactive = false;
	this.homeButton.interactive = false;
	this.restartButton.interactive = false;
	this.helpButton.interactive = false;
	
}


Hud.prototype.resize = function(w, h)
{
	this.bg.position.x =Math.ceil( w/2);
	this.bg.position.y = 20;
	
	this.pauseButton.position.x = Math.floor(w/2 - 10+3);
	this.scoreLabel.position.x = Math.floor(w/2 - 145);
	this.scoreLabel.position.y = 21;
	
	this.background.position.x = Math.floor(-w/2);
	
	this.menuHolder.position.y = Math.floor(h/2);
	
	this.background.scale.x = w/300;
	this.background.scale.y = h/300;
}

function formatScore(n)
{
	var nArray = n.toString().split("");
	var text = "";
	var total = nArray.length;
	
	var offset = (total % 3)-1;
	for(var i = 0; i < total; i++)
	{
		text += nArray[i];
		if((i - offset) % 3 == 0 && i != total-1)text+=",";	
	}
	
	return text;
}