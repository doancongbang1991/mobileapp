
TitleScreen = function()
{
	PIXI.DisplayObjectContainer.call(this);
	
	this.pivot.x = -140;
	
	this.screenPanal = PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/intro_vidPanel_TEMP.png");
	this.screenPanal.anchor.x = this.screenPanal.anchor.y = 0.5;
	this.addChild(this.screenPanal);
	this.screenPanal.position.y = -55 -20;
	
	this.panal = PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/intro_vidPanel_base.png");
	this.panal.anchor.x = this.panal.anchor.y = 0.5;
	this.panal.position.y = 200-  20;
	
	this.addChild(this.panal);
	
	this.pack = PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/intro_heroPack.png");
	this.pack.position.x = -799 + 65;
	this.pack.position.y =  35 - 25 -10;
	//this.pack.scale.x = this.pack.scale.y = 0.7;
	this.addChild(this.pack);
	
	this.logo = PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/HOME_desktop_logo.png");
	this.logo.anchor.x = this.logo.anchor.y = 0.5;
	this.logo.position.x = -606 + 105 ;
	this.logo.position.y =-167 + 60;
	this.addChild(this.logo);
	
	
	this.text2 = PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/intro_BIGflava.png");
	this.text2.position.x = -600 + 10;
	this.text2.position.y = 300 -10;
	this.addChild(this.text2);
	
	this.playAgainButton = new McBiteButton("HOME_desktop_play.png", "HOME_desktop_play_press.png")//PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/HOME_desktop_play.png")///PIXI.Text("Play", {font: "35px Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	
	this.productInfoButton = new McBiteButton("HOME_desktop_more.png", "HOME_desktop_more_press.png")//PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/HOME_desktop_play.png")///PIXI.Text("Play", {font: "35px Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	
	this.leaderBoardButton = new McBiteButton("HOME_desktop_leaderboard.png", "HOME_desktop_leaderboard_press.png")//PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/HOME_desktop_play.png")///PIXI.Text("Play", {font: "35px Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	
	this.panal.addChild(this.playAgainButton);
	this.panal.addChild(this.productInfoButton);
	this.panal.addChild(this.leaderBoardButton);
	
//	this.playAgainButton.anchor.x = this.playAgainButton.anchor.y = 0.5;
//	this.productInfoButton.anchor.x = this.productInfoButton.anchor.y = 0.5;
//	this.leaderBoardButton.anchor.x = this.leaderBoardButton.anchor.y = 0.5;
	
	this.playAgainButton.position.y = -3 - 28//07;
	this.productInfoButton.position.y = -3 - 21//07;
	this.leaderBoardButton.position.y = -3 - 21//07;
	
	this.productInfoButton.position.x = -192;
	this.playAgainButton.position.x = -0;
	this.leaderBoardButton.position.x = 190;
	
	
	//this.label.interactive = true;
	BasicButton.apply(this.playAgainButton, function(){
		_gaq.push(['_trackEvent', 'Spicy mcbites', 'Play', 'Play']);
		
		if(APP.controlOverlay)
		{
			
				if(!APP.controlSelected)
				{
					//alert(PROFILE.canTilt)
					if(PROFILE.canTilt)
					{
						APP.controlSelected = true;
						APP.controlOverlay.visible = true;
						APP.controlOverlay.show();
						APP.controlOverlay.onSelect = function(){
							
							APP.simpleApp.gotoScreen(APP.gameScreen)
						}
					
						return;
					
					}
					else
					{
						APP.gameScreen.game.controller.setTouch();
						APP.simpleApp.gotoScreen(APP.gameScreen)
					}
				}
				else
				{
					APP.simpleApp.gotoScreen(APP.gameScreen)
				}
			
		}
		else
		{
			APP.simpleApp.gotoScreen(APP.gameScreen)
		}
		
	});
	
	BasicButton.apply(this.leaderBoardButton, function(){
		
		_gaq.push(['_trackEvent', 'Spicy mcbites', 'Leaderboard clicks', 'Leaderboard clicks']);
		APP.fromTitle = true;
		APP.simpleApp.gotoScreen(APP.leaderboardScreen);
		
	});
	
	BasicButton.apply(this.productInfoButton, function(){
		_gaq.push(['_trackEvent', 'Spicy mcbites', 'Product Info clicks', 'Product Info clicks'])
		window.open("http://www.mcdonalds.co.uk/ukhome/more-food/little-tasters/chicken-mcbites.html", "_blank")
	//	SteveAPI.submitScore(1000006,function(){alert("DONE")})
		//SteveAPI.checkIsLoggedIn(function(){alert("DONE")});
	//	SteveAPI.loginAndGetDataFromAPP(function(){alert("DONE")});
	//	APP.simpleApp.gotoScreen(APP.gameoverScreen)
		//var array = ["100001029602925,513618970"];
		//SteveAPI.checkIsLoggedIn(function(){alert("DONE")});
		
		//window.open("https://www.facebook.com/dialog/apprequests?app_id=470415946364103&redirect_uri=mcdonaldsUK://&message=Your%20message%20here&display=popup", "_self");
		
	//	var loginURL = "https://www.facebook.com/dialog/oauth?client_id=470415946364103&redirect_uri=http://mcbites.sh75.net/";
		
//		window.open(loginURL, "_blank");
		
	//	https://www.facebook.com/dialog/apprequests?app_id=470415946364103&redirect_uri=http://mcbites.sh75.net/&message=Your%20message%20here&display=popup
	//	SteveAPI.submitScore(1000001, function(){});
	//	checkIsLoggedIn
	
	/*
		FacebookAPI.loginAndGetData(function(){
			
			SteveAPI.checkIsLoggedIn(FacebookAPI.accessTocken, function(){
				
			
				
				
			});
				console.log("LOGGED IN")
			})
			
			
			
			
			
			
		})*/
	//	SteveAPI.submitScore(1000002, function(){console.log("DONE")})
	});
		
//	helpOverlay = new HelpOverlay();
//	this.addChild(helpOverlay);
	
	
//	this.testTitle = PIXI.Sprite.fromImage("img/testScreen-Retina.png");
//	this.testTitle.anchor.x = 0.5;
///	this.testTitle.anchor.y = 0.5;
	
//	this.addChild(this.testTitle);
	// make legals..
	
	var div = document.createElement("div");
	div.className = "legals";
	div.innerHTML = "<div style='margin-left:10px;'>Served after 10.30am. Price and participation may vary. Until 31st December. Subject to availability. © 2013 McDonald’s. The Golden Arches logo, I’m lovin’ it and Little Tasters are registered trade marks of McDonald’s Corporation and its affiliates. <a style='color:#fae5be' href="+ APP.tc +"><u>Game Ts & Cs</u></a>.</div>"
	
	
	var likeButton = document.createElement("div");
	likeButton.innerHTML = '<iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fm.mcdonalds.co.uk%2Fspicymcbites&amp;width=100&amp;height=21&amp;colorscheme=light&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;send=false&amp;appId=470415946364103" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:100px; height:21px;" allowTransparency="true"></iframe>'
	likeButton.style.position= "absolute";
	likeButton.style.right = "10px";
	likeButton.style.top = "6px";
	div.appendChild(likeButton);
	
	document.body.appendChild(div);
	
	legals = div;
	
	legals.show = function()
	{
		$(this).fadeIn();
	//	TweenLite.to(this, 0.3, {opacity:1})
	}
	
	legals.hide = function()
	{
		console.log(this);
		$(this).fadeOut();
	//	alert("!")
	//	TweenLite.to(this, 0.3, {opacity:0})
	}
	
	
	this.video = document.createElement("video");
	this.video.style.position = "absolute";
	this.video.style.top = 0 + "px";
	this.video.style.left = 0 + "px";
	this.video.style.zIndex = 10;
	this.video.width = 611;
	this.video.height = 344;
	
	
	this.source =  document.createElement('source');
	
	this.source.setAttribute('src', REMOTE_PATH + "vid/test.mp4"); 
	this.video.appendChild(this.source);

	
	
//	this.video.play();
  //  this.video.addEventListener('canplaythrough', this.onVideoReady.bind(this));

}

TitleScreen.prototype = Object.create( PIXI.DisplayObjectContainer.prototype ); 

TitleScreen.prototype.onShow = function()
{
	APP.background.visible = true;
}

TitleScreen.prototype.onShown = function()
{
	document.body.appendChild(this.video);
	this.video.play();
}

TitleScreen.prototype.onHidden = function()
{
	document.body.removeChild(this.video);
}


TitleScreen.prototype.updateTransform = function(w, h)
{
	//PIXI.DisplayObjectContainer.proto);
	PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);
	
	this.video.style.left = this.screenPanal.worldTransform[2] - this.video.width/2 + "px";//position.x = this.
	this.video.style.top = this.screenPanal.worldTransform[5] - this.video.height/2 + 10 + "px";
}

TitleScreen.prototype.resize = function(w, h)
{
	this.position.x = Math.floor(w/2); //+ 150;
	this.position.y = Math.floor(h/2); //- 100;
	
//	this.scale.x = this.scale.y = 1/APP.container.scale.y;
	
//	helpOverlay.position.x = w/2;
//	helpOverlay.position.y = h/2;
	
//	this.testTitle.position.x = w/2;
//	this.testTitle.position.y = h/2;
}


