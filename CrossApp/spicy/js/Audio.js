
// some browsers dont support it :/



SoundButton = function()
{
	PIXI.DisplayObjectContainer.call( this );
	
	SoundButton.instance = this;
	
	this.interactive = true;
	this.hitArea = new PIXI.Rectangle(-40,0, 40, 40);
	this.buttonMode = true;
	
	this.base = PIXI.Sprite.fromFrame("soundON.png");
	this.base.anchor.x = 1;
	
	this.over = PIXI.Sprite.fromFrame("soundOFF.png");
	this.over.anchor.x = 1;
	this.over.alpha =0;
	this.over.visible = false;
	
	this.addChild(this.base);
	this.addChild(this.over);
	
	this.mute = false;
	
	/*this.music1 = new Howl({
		urls: [REMOTE_PATH + 'snd/music1.mp3'];
	});*/
	
	/*
	this.music1 = new Howl({
	  urls: ['snd/304762_Like Bright Days.mp3', 'snd/music1.ogg', 'sound.wav'],
	//  autoplay: true,
	  loop: true,
	  volume: 0.5,
	  onend: function() {
	    //alert('Finished!');
	  }
	});*/
	
	if(PROFILE.music)
	{
		
		this.music2 = new Howl({
		  urls: [REMOTE_PATH + 'snd/596027_Vertical Moombahton.mp3', 'sound.ogg', 'sound.wav'],
		//  autoplay: true,
		  loop: true,
		  volume: 0.01,
		  onend: function() {
		    //alert('Finished!');
		  }
		});
	
	}
	else
	{
		this.visible = false;
	}
	
	if(PROFILE.sfx)
	{
		APP.pickupSound = new Howl({
		  urls: [REMOTE_PATH + 'snd/soundFX/crumbGet.mp3', 'sound.ogg', 'sound.wav'],
		});
		
		APP.jumpSound = new Howl({
		  urls: [REMOTE_PATH + 'snd/soundFX/biteJump.mp3', 'sound.ogg', 'sound.wav'],
		});
		
		APP.powerupSound = new Howl({
		  urls: [REMOTE_PATH + 'snd/soundFX/powerUp.mp3', 'sound.ogg', 'sound.wav'],
		});
		
		
		APP.crashSound = new Howl({
		  urls: [REMOTE_PATH + 'snd/soundFX/collide_treetop.mp3', 'sound.ogg', 'sound.wav'],
		});	
		
	}
	
	/*
	if(APP.isIpad)
	{
		this.mute = true;
		this.base.setTexture(PIXI.Texture.fromFrame("img/soundOff_up.png"))
		this.over.setTexture(PIXI.Texture.fromFrame("img/soundOff_over.png"))
	}*/
	
	this.firstRun = true;
//	this.music1.play();
		
}

SoundButton.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

SoundButton.prototype.click = SoundButton.prototype.tap = function()
{
	this.mute = !this.mute;
	
	if(this.mute)
	{
//		this.base.setTexture(PIXI.Texture.fromFrame("soundOff_up.png"))
//		this.over.setTexture(PIXI.Texture.fromFrame("soundOff_over.png"))
		
	//	this.music1.stop();
	//	this.music2.play();
		Howler.mute();
	}
	else
	{
	//	this.base.setTexture(PIXI.Texture.fromFrame("soundOn_up.png"))
	//	this.over.setTexture(PIXI.Texture.fromFrame("soundOn_over.png"))
		
		if(APP.isIpad && this.firstRun)
		{
			this.firstRun = false;
			
		}
		
	//	this.music1.play();
	//	this.music2.stop();
		
		Howler.unmute();
	}
	
	
}

SoundButton.prototype.mouseover = function()
{
	this.over.visible = true
	TweenLite.to(this.over, 0.2, {alpha:1, ease:Expo.easeOut});
}

SoundButton.prototype.mouseout = function()
{
	TweenLite.to(this.over, 0.2, {alpha:0, ease:Sine.easeOut, onComplete:function(){this.visible = false;}});	
}
			