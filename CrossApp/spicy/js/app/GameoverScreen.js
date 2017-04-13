
GameoverScreen = function()
{
	
	PIXI.DisplayObjectContainer.call(this);
	
	this.tint = new PIXI.Graphics();
	this.tint.beginFill(0x0, 0.5);
	this.tint.drawRect(0,0, 100, 100);
	this.tint.visible = false;
	
	
	this.ga = new GAME.GameoverAnimation();
	this.addChild(this.ga);
	
	this.addChild(this.tint);
//	this.ga.position.x = 300;
//	this.ga.position.y = 300;
	this.ga.position.x = Math.floor((-560/2  * 0.7) +  300  * 0.7) + 12;
	this.ga.position.y = Math.floor((-877/2  * 0.7) +  300  * 0.7) + 100 ;
	
	
	this.gameoverContainer = new PIXI.DisplayObjectContainer();
	this.gameoverContainer.position.x = Math.floor(-560/2  * 0.7);
	this.gameoverContainer.position.y = Math.floor(-877/2  * 0.7);
	
	this.addChild(this.gameoverContainer);
	this.gameoverContainer.alpha = 0;
		this.gameoverContainer.visible = false;
	
	this.bg = PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/largePanel.png", true);
	this.gameoverContainer.addChild(this.bg);
	
	this.bg2 = PIXI.Sprite.fromImage("img/UI/GO_panel_button-recesses.png");
	this.gameoverContainer.addChild(this.bg2)
	this.bg2.position.y = Math.floor(300  * 0.7);
	this.bg2.position.x = Math.floor(10 * 0.7);
	
	this.box = PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/GO_panel_packshot.png", true);
	this.gameoverContainer.addChild(this.box);
	
	this.boxHome = this.box.texture.frame.x;
	
	//this.loading = PIXI.Sprite.fromImage("img/loading.png")
//	this.addChild(	this.loading);
	this.submitButton = new McBiteButton("facebookSubmit.png", "facebookSubmit_press.png");
	//this.submitButton.anchor.x = 0.5;
	
	this.playAgainButton =  new McBiteButton("GO_button_play.png", "GO_button_play_press.png",  "GO_button_play_press.png");// nnew PIXI.Text("Play again", {font: "35px Snippet", fill: "white", align: "left"});
	this.productInfoButton =  new McBiteButton("GO_button_more.png", "GO_button_more_press.png",  "GO_button_more_press.png");// nnew PIXI.Text("Product Info", {font: "35px Snippet", fill: "white", align: "left"});
	this.leaderBoardButton =  new McBiteButton("GO_button_leaderboard.png", "GO_button_leaderboard_press.png",  "GO_button_leaderboard_press.png");// nnew PIXI.Text("Leaderboard", {font: "35px Snippet", fill: "white", align: "left"});
	
	this.scoreLabel = PIXI.Sprite.fromFrame("yourScore_text.png");
	
	this.scoreLabel.anchor.x = 0.5;
	this.scoreLabel.position.x = Math.floor(560/2 * 0.7);
	this.scoreLabel.position.y = Math.floor(80 * 0.7);
	
//	this.scoreText = new PIXI.Text(APP.score || 10002000, {font: "35px Pathway Gothic One", fill: "black", align: "left"});
	this.scoreText = new PIXI.Text(APP.score || 101, {font: "90px Pathway Gothic One", fill:"#de571c"});
	this.scoreText.position.x = Math.floor(560/2 * 0.7);
	this.scoreText.anchor.x = 0.5;
	
	this.gameoverContainer.addChild(this.scoreLabel);
	this.gameoverContainer.addChild(this.scoreText);
	
	this.scoreText.position.y = Math.floor(100 * 0.7) - 7;
	
	this.gameoverContainer.addChild(this.submitButton);
	this.gameoverContainer.addChild(this.playAgainButton);
	this.gameoverContainer.addChild(this.productInfoButton);
	this.gameoverContainer.addChild(this.leaderBoardButton);
	
	this.submitButton.position.y = Math.floor(220 * 0.7);
	this.playAgainButton.position.y = Math.floor(607  * 0.7) + 1;
	this.productInfoButton.position.y = Math.floor(749 * 0.7) -1 ;
	this.leaderBoardButton.position.y = Math.floor(676 * 0.7)+1 ;
	
	this.playAgainButton.position.x = Math.floor(274 * 0.7) +1//- this.playAgainButton.width/2;
	this.productInfoButton.position.x = Math.floor(274 * 0.7)+1//// - this.playAgainButton.width/2;
	this.leaderBoardButton.position.x = Math.floor(274 * 0.7)+1// - this.playAgainButton.width/2;
	
	this.rankSection = new RankSection()
	
	this.rankSection.position.x = Math.floor(280 * 0.7);
	this.rankSection.position.y = Math.floor(390 * 0.7);
	
	this.gameoverContainer.addChild(this.rankSection);
	//this.label.interactive = true;
	BasicButton.apply(this.playAgainButton, this.onPlayAgainPressed.bind(this));
	BasicButton.apply(this.submitButton, this.onLoginPressed.bind(this));
	BasicButton.apply(this.leaderBoardButton, function(){
		
		_gaq.push(['_trackEvent', 'Spicy mcbites', 'Leaderboard clicks', 'Leaderboard clicks']);
		APP.fromTitle = false;
		APP.simpleApp.gotoScreen(APP.leaderboardScreen)
	});
	
	BasicButton.apply(this.productInfoButton, function(){
		
		_gaq.push(['_trackEvent', 'Spicy mcbites', 'Product Info clicks', 'Product Info clicks'])
		window.open("http://www.mcdonalds.co.uk/ukhome/more-food/little-tasters/chicken-mcbites.html", "_blank")
	});
	
	
	this.boxMask = new PIXI.Graphics();
	this.boxMask.beginFill(0xFF0000);
	this.boxMask.drawRect(0,150 * 0.7, 700 * 0.7, 460 * 0.7);
	this.boxMask.rotation = -0.03;
	this.gameoverContainer.addChild(this.boxMask);
	
	this.box.mask =this.boxMask;
//	this.loading.anchor.x = this.loading.anchor.y = 0.5;
//	this.loading.position.x = 400;
//	this.loading.position.y = 300;
	
	this.tc =  new PIXI.Text("Game Ts & Cs" || 101, {font: "14px Pathway Gothic One", fill:"#000000"});
	this.gameoverContainer.addChild(this.tc);
	this.tc.position.x = Math.floor(560/2 * 0.7) - 30;
	this.tc.position.y = 570;
	BasicButton.apply(this.tc, function(){
		
		window.open(APP.tc, "_blank");
		
	});
}

GameoverScreen.constructor = GameoverScreen;
GameoverScreen.prototype = Object.create( PIXI.DisplayObjectContainer.prototype ); 

GameoverScreen.prototype.onShow = function()
{
	this.gameoverContainer.alpha = 0;
	this.gameoverContainer.visible = false;
	this.tint.visible = false;
	this.tint.alpha  = 0;
	this.ga.currentFrame = 0;
	this.ga.onComplete = this.onDropped.bind(this);
	//alert(APP.pb)
	this.scoreText.setText(formatScore(APP.score || 9));
	
	if(FacebookAPI.loggedIn)
	{
		this.submitButton.visible = false;
		SteveAPI.getUserScore(this.onScoreRecieved.bind(this));
		
		this.box.position.x = Math.floor(50 * 0.7);
		this.box.position.y= Math.floor(320 * 0.7);
		this.box.anchor.x = 0.5;
		
		//this.box.texture.frame.x = this.boxHome + 210;
		//this.box.anchor.x = 0;
		this.rankSection.visible = true;
		this.rankSection.alpha = 0;
	
	}
	else
	{
		this.box.texture.frame.x = this.boxHome;
		this.submitButton.position.x = Math.floor(560/2 * 0.7);
		this.submitButton.position.y = Math.floor(235 * 0.7);
		
		this.box.anchor.x = 0.5;
		this.box.position.x = Math.floor(560/2  * 0.7);
		this.box.position.y= Math.floor(320 * 0.7);
		this.rankSection.visible = false;
		this.submitButton.visible = true;
	}
	
//	this.onDropped
	//alert("!")
}



GameoverScreen.prototype.onScoreRecieved = function(data)
{
	APP.userRank = data.rank;
	APP.userScore = data.score.score;
	APP.userName = data.score.username;
	
	this.rankSection.rankLabel.setText(APP.userRank || "n/a");
	this.rankSection.pbLabel.setText(formatScore(APP.userScore || "0") );
	this.rankSection.setData(data.score.facebookId);
	//
	console.log(APP.userName + " is ranked " + APP.userRank + " and the score is " + APP.userScore)
	
	TweenLite.to(this.rankSection, 0.3, {alpha:1}); 
	
	// show ranking!
}



GameoverScreen.prototype.onDropped = function()
{
	APP.background.visible = true;
	legals.show();
	this.ga.onComplete = null;
	this.gameoverContainer.visible = true;
	TweenLite.to(this.gameoverContainer, 0.3, {alpha:1, delay:1.1});
	
	this.tint.visible = true;
	TweenLite.to(this.tint, 0.3, {alpha:1, delay:1});
}

GameoverScreen.prototype.onPlayAgainPressed = function()
{
	_gaq.push(['_trackEvent', 'Spicy mcbites', 'Play again', 'Play again']);
	
	APP.simpleApp.gotoScreen(APP.gameScreen)
}


GameoverScreen.prototype.onLoginPressed = function()
{
	
	if(APP.inAPP)
	{
		SteveAPI.loginAndGetDataFromAPP(this.onLoginSuccess.bind(this));
	}
	else
	{
		FacebookAPI.loginAndGetData(this.onLoginSuccess.bind(this));
	}
}

GameoverScreen.prototype.onLoginSuccess = function(data)
{
	
	SteveAPI.submitScore(APP.score || 100, function(data){
		
		if(data.success)
		{
			SteveAPI.getUserScore(function(data){
				
				APP.userRank = data.rank;
				APP.userScore = data.score.score;
				APP.userName = data.score.username;
				
				console.log(APP.userName + " is ranked " + APP.userRank + " and the score is " + APP.userScore)
				
				APP.simpleApp.gotoScreen(APP.leaderboardScreen)
			});
		}
		else
		{
			APP.simpleApp.gotoScreen(APP.leaderboardScreen)
		}
		
	});
	// submit score!
	
	
//	console.log("LOGGED IN")
	//this.label.setText(data.name);
	//console.log(data)
}


GameoverScreen.prototype.resize = function(w, h)
{
	//this.scale.x = 0.75//APP.container.scale.x;
	//this.scale.y = 0.75//APP.container.scale.y;
	
	this.position.x = Math.floor(w/2) //* this.scale.x; // - (560/2 * this.scale.x);
	this.position.y = Math.floor(h/2) //* this.scale.x;// - (877/2 * this.scale.x);
	
	this.tint.scale.x = (w / 100) /// this.scale.x;
	this.tint.scale.y = (h / 100) /// this.scale.x;
	
	this.tint.position.x = (-w/2 ) /// this.scale.x;
	this.tint.position.y = (-h/2 ) /// this.scale.x;
	
	this.ga.resize(w,h);
}


RankSection = function()
{
	PIXI.DisplayObjectContainer.call(this);
	
	this.maskImage = new Image();
	this.maskImage.crossOrigin = '';
	this.maskImage.src = REMOTE_PATH + "img/bigCircleMask.png";
	
	this.canvas = document.createElement("canvas");
	this.canvas.context = this.canvas.getContext("2d");
	this.canvas.width = 100;
	this.canvas.height = 100;
	
	this.canvasTexture = PIXI.Texture.fromCanvas(this.canvas);
	
	this.image = new Image();
	this.imageSprite = new PIXI.Sprite(this.canvasTexture)//.fromImage("https://graph.facebook.com/513618970/picture?type=large");
	
	this.imageSprite.anchor.x = this.imageSprite.anchor.y = 0.5;
	this.imageSprite.position.x = 20;
	this.imageSprite.position.y = 17;
	
	this.addChild(this.imageSprite);
	
	
	this.rankLabel = new PIXI.Text("hi rank", {font: "24px Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	this.pbLabel = new PIXI.Text("hi pb", {font: "24px Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	this.addChild(this.rankLabel);
	this.addChild(this.pbLabel);
	
	this.rankTitle = PIXI.Sprite.fromFrame("GO_panel_rank.png");
	this.pbTitle = PIXI.Sprite.fromFrame("GO_panel_PB.png");
	
	this.addChild(this.rankTitle);
	this.addChild(this.pbTitle);
	
	this.rankTitle.position.x = Math.floor(60 * 0.7)+ 5;
	this.rankTitle.position.y = 10 - 4;
	
	this.pbTitle.position.x = Math.floor(60 * 0.7)+ 5;
	this.pbTitle.position.y = -30 - 2- 3;
	
	
	this.addChild(this.rankLabel);
	this.addChild(this.pbLabel);
	
		
	this.rankLabel.position.x = Math.floor(60 * 0.7) + 5;
	this.pbLabel.position.x = Math.floor(60 * 0.7) + 5;
	
	this.rankLabel.position.y = Math.floor(10 * 0.7) + 13- 4;
	this.pbLabel.position.y = Math.floor(-40 * 0.7) + 7- 4;
	
	
	this.recess = PIXI.Sprite.fromFrame("GO_panel_singleRecess.png");
	this.pbText = PIXI.Sprite.fromFrame("sharePBtext.png");
	this.pbText.position.x =Math.floor( 20 * 0.7) - 4;
	this.pbText.position.y = Math.floor(25 * 0.7);
	this.addChild(this.recess)
	this.recess.addChild(this.pbText);
	
	
	this.faceButton = new McBiteButton("facebook_button_up.png", "facebook_button_press.png")//PIXI.Sprite.fromFrame("facebook_button_up.png");
	this.twitterButton =  new McBiteButton("twitter_button_up.png", "twitter_button_press.png")
	
	BasicButton.apply(this.faceButton, function(){
		
		_gaq.push(['_trackEvent', 'Spicy mcbites', 'Social shares', 'Facebook']);
		FacebookAPI.postToFeed();
		
	})
	
	BasicButton.apply(this.twitterButton, function(){
		
		
		_gaq.push(['_trackEvent', 'Spicy mcbites', 'Social shares', 'Twitter']);
		//FacebookAPI.postToFeed(APP.score);
		//_gaq.push(['_trackEvent', 'Frappe', 'Twitter', '/ukhome.html']);
		var imageURL = encodeURIComponent("http://www.mcdonalds.co.uk/ukhome/");
		var copy = encodeURIComponent("I got " + formatScore(APP.score) + ", can you beat my spicy score?")
	
		var url = "https://twitter.com/intent/tweet?text="+copy+"&url=" + imageURL;
		window.open(url, "_blank", "height=300,width=550,resizable=1");
		
	})
	
	
	//PIXI.Sprite.fromFrame("button_twitter.png");
	
	this.recess.addChild(this.faceButton);
	this.recess.addChild(this.twitterButton);
	
	this.faceButton.position.x = Math.floor(187 * 0.7) + 4 + 17;
	this.faceButton.position.y = Math.floor((10-2) * 0.7) + 1;
	
	this.twitterButton.position.x = Math.floor((250-2) * 0.7) + 17;
	this.twitterButton.position.y = Math.floor((10-2) * 0.7) + 1;
	
	this.recess.position.x = Math.floor(-45 * 0.7);
	this.recess.position.y = Math.floor(95 * 0.7);
	
	
}

RankSection.prototype = Object.create( PIXI.DisplayObjectContainer.prototype ); 

RankSection.prototype.setData = function(id)
{
	this.imageSprite.scale.x = this.imageSprite.scale.y = 0;
	
	this.image.src = null;
	this.image = new Image();
	this.image.crossOrigin = '';
	this.image.onload = function(){
		
		this.canvas.context.drawImage(this.maskImage, 0, 0, 70, 70);
		this.canvas.context.globalCompositeOperation = 'source-in';
		
		var ratio1 = 70 / this.image.width;
		var ratio2 = 70 / this.image.height;
		var ratio = Math.max(ratio1, ratio2);
		
	//	console.log(ratio)
		
		this.canvas.context.drawImage(this.image, 
										35 - (this.image.width * ratio)/2,
										35 - (this.image.height * ratio)/2, 
										this.image.width * ratio, 
										this.image.height * ratio);
										
		this.canvas.context.globalCompositeOperation = 'source-over';
		
		TweenLite.to(this.imageSprite.scale, 1, {x:1, y:1, ease:Elastic.easeOut});
		
	}.bind(this);
	
	this.image.src = "https://graph.facebook.com/"+id+"/picture?type=large";
	//this.image.src = "https://graph.facebook.com/513618970/picture?type=large"
	
}
