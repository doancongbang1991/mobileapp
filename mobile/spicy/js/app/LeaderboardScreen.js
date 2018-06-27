
LeaderboardScreen = function()
{
	PIXI.DisplayObjectContainer.call(this);
	
//	this.template = PIXI.Sprite.fromImage("img/template.jpg", true);
	this.bg = PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/largePanel.png", true);
//	this.template.position.x = -50;
//	this.template.position.y = -40;
	
	
	this.addChild(this.bg);
//	this.addChild(this.template);
	
//	this.top20Button = new PIXI.Text("Top 20", {font:"35px Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	this.top20Button = PIXI.Sprite.fromFrame("top20_button_highlight.png");
	
	
	this.friend20Button = PIXI.Sprite.fromFrame("friends_button_highlight.png");//new PIXI.Text("Friends", {font:"35px Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	
	this.top20Button.active = PIXI.Sprite.fromFrame("top20_button_up.png");
	this.top20Button.active.position.x = -3;
	this.top20Button.active.position.y = -1;
	this.top20Button.addChild(this.top20Button.active);
	
	this.friend20Button.active = PIXI.Sprite.fromFrame("friends_button_up.png");//new PIXI.Text("Friends", {font:"35px Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	//this.friend20Button.active.position.x = -3;
	this.friend20Button.active.position.y = -1;
	this.friend20Button.addChild(this.friend20Button.active);
	
	//this.challangeButton = PIXI.Sprite.fromFrame("button_challenge.png");//new PIXI.Text("Challange", {font:"35px Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	this.challangeButton = new McBiteButton("challenge_friends_up.png", "challenge_friends_press.png")//PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/HOME_desktop_play.png")///PIXI.Text("Play", {font: "35px Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	
	//this.faceButton = PIXI.Sprite.fromFrame("button_facebook.png");
	//this.faceButton = new McBiteButton("facebook_button_up.png", "facebook_button_press.png")//PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/HOME_desktop_play.png")///PIXI.Text("Play", {font: "35px Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	
	//this.twitterButton = PIXI.Sprite.fromFrame("button_twitter.png");
	
	//this.recess = PIXI.Sprite.fromFrame("leaderboard_challenge_BG.png");
	//this.addChild(this.recess);
	
//	this.addChild(this.faceButton);
///	this.addChild(this.twitterButton);
	
	//
	this.closeButton = new McBiteButton("back_button_up.png", "back_button_press.png")// PIXI.Sprite.fromFrame("back.png");//new PIXI.Text("Close", {font:"35px Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	
	
	this.addChild(this.closeButton);
	this.addChild(this.top20Button);
	this.addChild(this.friend20Button);
	
	
	
	//this.recess.position.x = 200 - 130;
	//this.recess.position.y = 500 + 25
	this.addChild(this.challangeButton);
	
	
	
	this.challangeButton.position.x = Math.floor(120 * 0.7) - 7 + 125;
	this.challangeButton.position.y = Math.floor(765 * 0.7) - 5;
	
//	this.faceButton.position.x = Math.floor(364 * 0.7);
//	this.faceButton.position.y = Math.floor(765 * 0.7) - 5;
	
//	this.twitterButton.position.x = Math.floor(415 * 0.7) + 8;
//	this.twitterButton.position.y = Math.floor(765 * 0.7) -5;
	
		
	this.top20Button.position.x = Math.floor(46 * 0.7);
	this.friend20Button.position.x = Math.floor(282 * 0.7);
	
	this.top20Button.position.y = Math.floor(147 * 0.7);
	this.friend20Button.position.y = Math.floor(147 * 0.7);
	
	this.closeButton.position.x = Math.floor(490 * 0.7) + 10;
	this.closeButton.position.y = Math.floor(15 * 0.7) + 33;
	
	this.label = PIXI.Sprite.fromFrame("leaderboardTitle.png")//new PIXI.Text("LeaderBoard", {font: "35px Pathway Gothic One", fill: "white", align: "left"});
	this.label.anchor.x = 0.5;
	this.label.position.x = Math.floor((560/2) * 0.7);
			
	this.label.position.y = Math.floor(60 * 0.7);
	
	this.addChild(this.label);
	
	this.addChild(this.top20Button);
	this.addChild(this.friend20Button);
	
	this.leaderboardContainer = new PIXI.DisplayObjectContainer();
	this.addChild(this.leaderboardContainer)
	this.leaderboardContainer.position.x = Math.floor(55 * 0.7);
	this.leaderboardContainer.position.y =  Math.floor(220 * 0.7);
	
	
	
	this.leaderboardMask = new PIXI.Graphics();
	this.leaderboardMask.beginFill(0xFF0000);
	this.leaderboardMask.drawRect(0,-30 * 0.7, 700 * 0.7, 423 * 0.7);
	
	/*
	 * MASK BUG IN CANVAS
	 */
	this.leaderboardContainer.addChild(this.leaderboardMask);
	this.leaderboard = new Leaderboard();
	this.leaderboardContainer.hitArea = new PIXI.Rectangle(0,0, 700 * 0.7, 423 * 0.7);
	
	this.leaderboardContainer.addChild(this.leaderboard);
	//this.leaderboard.mask = this.leaderboardMask;
	
	this.friendMode = true;
	
	this.trackpad = new PixiTrackpad(this.leaderboardContainer);
	this.trackpad.max = 1;
	
	BasicButton.apply(this.top20Button, this.showTop20.bind(this));
	BasicButton.apply(this.friend20Button, this.showTopfriendTop20.bind(this));
	
	BasicButton.apply(this.closeButton, this.onClosePressed.bind(this));
	BasicButton.apply(this.challangeButton, this.onChallangePressed.bind(this));
	
	this.userRank = new ScoreView();
	this.userRank.position.y = Math.floor(650 * 0.7) + 7;
	this.userRank.position.x = Math.floor( 55 * 0.7);
	this.userRank.divider.visible = false;
	this.addChild(this.userRank);
	
	this.colorBlock = new PIXI.Graphics();
	this.colorBlock.beginFill(0xF9F6F0);
	this.colorBlock.moveTo(-24,-20)
	this.colorBlock.lineTo(350-2,-20)
	this.colorBlock.lineTo(350-2,60)
	this.colorBlock.lineTo(-22,60)
	this.colorBlock.endFill();
	this.colorBlock.position.y = -7;
	
	this.userRank.addChildAt(this.colorBlock, 0);
	
	this.tc =  new PIXI.Text("Game Ts & Cs" || 101, {font: "14px Pathway Gothic One", fill:"#000000"});
	this.addChild(this.tc);
	this.tc.position.x = Math.floor(560/2 * 0.7) - 30;
	this.tc.position.y = 573;
	BasicButton.apply(this.tc, function(){
		
		window.open(APP.tc, "_blank");
		
	});
	
}

LeaderboardScreen.constructor = LeaderboardScreen;
LeaderboardScreen.prototype = Object.create( PIXI.DisplayObjectContainer.prototype ); 

LeaderboardScreen.prototype.onShow = function()
{
	this.showTop20();
	this.trackpad.setPosition(0, 0)
	this.leaderboard.mask = this.leaderboardMask;

	this.userRank.visible = false// FacebookAPI.loggedIn;
	
	if(FacebookAPI.loggedIn)
	{
		this.userRank.visible = true;
		SteveAPI.getUserScore(this.onUserScoreRecieved.bind(this))
	}
	else
	{
	}
	
}

LeaderboardScreen.prototype.onUserScoreRecieved = function(data)
{
	this.userRank.labelNumber.setText(data.rank + ".");
	this.userRank.setScore(data.score);
}

LeaderboardScreen.prototype.onHidden = function()
{
	this.leaderboard.mask = null
}
LeaderboardScreen.prototype.updateTransform = function()
{
	PIXI.DisplayObjectContainer.prototype.updateTransform.call( this );
	
	if(this.leaderboard.realHeight > 423)
	{
		
	this.trackpad.max = this.leaderboard.realHeight - 423
	this.trackpad.update();
	
	this.leaderboard.position.y = Math.floor(this.trackpad.valueY);
	}
	else
	{
		this.leaderboard.position.y = 0;
	}
	
	///console.log(this.trackpad.valueY)
}

LeaderboardScreen.prototype.showTop20 = function()
{
	if(!this.friendMode)return;
	this.friendMode = false;
	TweenLite.to(this.leaderboard, 0.3, {alpha:0});
	
	TweenLite.to(this.top20Button.active, 0.3, {alpha:0});
	TweenLite.to(this.friend20Button.active, 0.3, {alpha:1});
	
	SteveAPI.getTop20(this.onScoresRecieved.bind(this)); 
}

LeaderboardScreen.prototype.showTopfriendTop20 = function()
{
	TweenLite.to(this.leaderboard, 0.3, {alpha:0});
	
	//TweenLite.killTweensOf(t);
//	alert(FacebookAPI.loggedIn)	
	if(!FacebookAPI.loggedIn)
	{
		if(!APP.inAPP)
		{
			FacebookAPI.loginAndGetData(this.showTopfriendTop20.bind(this));
		}
		else
		{
			SteveAPI.loginAndGetDataFromAPP(this.showTopfriendTop20.bind(this));
		}
	
		return;
	}
	
	if(this.friendMode)return;
	this.friendMode = true;
	
	TweenLite.to(this.top20Button.active, 0.2, {alpha:1});
	TweenLite.to(this.friend20Button.active, 0.2, {alpha:0});
	
	SteveAPI.getTop20Friends(this.onScoresRecieved.bind(this)); 
	
	/*
	// get friends using the app..
	FacebookAPI.getFriendsUsingApp(function(e){
		
		var data = e.data;
		
		var idArray = [];
	
		for (var i=0; i < data.length; i++) {
			
			idArray.push(data[i].uid);
			
		};
		//console.log(idArray)
		console.log("Friends using app Collected!")
		
		
	}.bind(this));*/
	
}


LeaderboardScreen.prototype.onScoresRecieved = function(data)
{
	TweenLite.to(this.leaderboard, 0.3, {alpha:1});
	this.leaderboard.setData(data.scores)
}

LeaderboardScreen.prototype.onChallangePressed = function()
{
	_gaq.push(['_trackEvent', 'Spicy mcbites', 'Social shares', 'Challange']);
	FacebookAPI.requestChallange(function(e){console.log(e)});
}

LeaderboardScreen.prototype.onClosePressed = function()
{
	if(APP.fromTitle)
	{
		APP.simpleApp.gotoScreen(APP.titleScreen)
	}
	else
	{
		APP.simpleApp.gotoScreen(APP.gameoverScreen)
	}
}

LeaderboardScreen.prototype.resize = function(w, h)
{
//	this.scale.x = 0.75//APP.container.scale.x;
//	this.scale.y = 0.75//APP.container.scale.y;
	
	this.position.x =  Math.floor(w/2 - (560/2 * 0.7));
	this.position.y =  Math.floor(h/2 - (877/2 * 0.7));
}