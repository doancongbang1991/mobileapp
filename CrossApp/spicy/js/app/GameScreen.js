
GameScreen = function()
{
	PIXI.DisplayObjectContainer.call(this);
	
	this.game = new Game(this);
	
	
}

GameScreen.prototype = Object.create( PIXI.DisplayObjectContainer.prototype ); 

GameScreen.prototype.onShow = function()
{
	
	legals.hide();
	this.game.start();
	APP.lowRez();
	
	if(PROFILE.music)
	{
		if(!SoundButton.instance.musicOn)
		{
			SoundButton.instance.musicOn = true;
			SoundButton.instance.music2.play();
		}
	}
}

GameScreen.prototype.onShown = function()
{
	APP.background.visible = false;
	if(PROFILE.music)SoundButton.instance.music2.fadeIn(0.5, 1000);
}

GameScreen.prototype.onHidden = function()
{
	APP.highRez();
//	if(PROFILE.music)SoundButton.instance.music2.fadeIn(0.1, 1000);
	//APP.background.visible = true;
}

GameScreen.prototype.resize = function(w, h)
{
	this.game.resize(w,h);
}


