
MobileTitleScreen = function()
{
	PIXI.DisplayObjectContainer.call(this);
	
	
	
	this.panal = PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/HOME_mobile_panelBG.png");
	this.panal.anchor.x = this.panal.anchor.y = 0.5;
	this.panal.position.y = 200-  20 + 60;
	
	this.addChild(this.panal);
	
	this.pack = PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/intro_heroPack.png");
	this.pack.anchor.x = this.pack.anchor.y = 0.5;
	
	this.pack.position.x = 0;
	this.pack.position.y = 20;
	this.pack.scale.x = this.pack.scale.y = 0.9;
	this.addChild(this.pack);
	
	this.logo = PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/HOME_desktop_logo.png");
	this.logo.anchor.x = this.logo.anchor.y = 0.5;
	this.logo.position.x = 0;
	this.logo.position.y = -220//167 + 60;
	this.addChild(this.logo);
	
	
	this.text2 = PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/intro_BIGflava.png");
	this.text2.anchor.x = this.text2.anchor.y = 0.5;
	this.text2.position.x = 0;
	this.text2.position.y = 140 
	this.addChild(this.text2);
	
	this.playAgainButton = PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/HOME_mobile_play.png")///PIXI.Text("Play", {font: "35px Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	this.productInfoButton = PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/HOME_mobile_more.png")//new PIXI.Text("Product Info", {font: "35px  Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	this.leaderBoardButton = PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/HOME_mobile_leaderboard.png")//new PIXI.Text("Leaderboard", {font: "35px  Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	
	this.panal.addChild(this.playAgainButton);
	this.panal.addChild(this.productInfoButton);
	this.panal.addChild(this.leaderBoardButton);
	
	
	this.playAgainButton.anchor.x = this.playAgainButton.anchor.y = 0.5;
	this.productInfoButton.anchor.x = this.productInfoButton.anchor.y = 0.5;
	this.leaderBoardButton.anchor.x = this.leaderBoardButton.anchor.y = 0.5;
	
	this.playAgainButton.position.y = -30//07;
	this.productInfoButton.position.y = 34//07;
	this.leaderBoardButton.position.y = 34//07;
	
	this.productInfoButton.position.x = 85;
	this.playAgainButton.position.x = 1;
	this.leaderBoardButton.position.x = -85;
	
	
	//this.label.interactive = true;
	BasicButton.apply(this.playAgainButton, function(){
		
		
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
		
		APP.fromTitle = true;
		APP.simpleApp.gotoScreen(APP.leaderboardScreen)
	});
	
	BasicButton.apply(this.productInfoButton, function(){
	
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
	var div = document.createElement("div");
	div.className = "legals";
	legals = div;
	
	legals.show = function(){}
	legals.hide = function(){}
}

MobileTitleScreen.prototype = Object.create( PIXI.DisplayObjectContainer.prototype ); 

MobileTitleScreen.prototype.resize = function(w, h)
{
	this.position.x = Math.floor(w/2) //+ 150;
	this.position.y = Math.floor(h/2) //- 100;
	
//	this.scale.x = this.scale.y = 1/APP.container.scale.y;
	
//	helpOverlay.position.x = w/2;
//	helpOverlay.position.y = h/2;
	
//	this.testTitle.position.x = w/2;
//	this.testTitle.position.y = h/2;
}


