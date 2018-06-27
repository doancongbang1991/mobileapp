////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage
var canvasW=0;
var canvasH=0;

/*!
 * 
 * START GAME CANVAS - This is the function that runs to setup game canvas
 * 
 */
function initGameCanvas(w,h){
	canvasW=w;
	canvasH=h;
	stage = new createjs.Stage("gameCanvas");
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true;
	
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", tick);	
}

var canvasContainer, mainContainer, gameContainer, resultPopContainer;
var conMain,btnStart, bgPop, bgOverlay, resultTxt, btnReplay, btnBackMain, btnShare, btnBack, btnFb, btnTwitter, btnGoogle, scorePopTxt;
var gameBall, bgGame, gamePlayer, shadowPlayer, shadowBall, playerdata, scoreDescTxt, scoreNumTxt, scoreDisplayTxt, shareTxt;
var txtExtra=0;

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	gameContainer = new createjs.Container();
	menuContainer = new createjs.Container();
	resultPopContainer = new createjs.Container();
	
	//main
	conMain = new createjs.Bitmap(loader.getResult("conMain"));
	btnStart = new createjs.Bitmap(loader.getResult("btnStart"));
	mainContainer.addChild(conMain, btnStart);
	
	centerReg(btnStart);
	btnStart.x=canvasW/2;
	btnStart.y=canvasH/100*87;
	
	var _frameW=190;
	var _frameH=260;
	var _frame = {"regX": (_frameW/2), "regY": (_frameH/2), "height": _frameH, "count": 8, "width": _frameW};
	var _animations = {"left": 0,
					   "right": 1,
					   "leftrun":{frames: [2,3], speed: .3},
					   "rightrun":{frames: [4,5], speed: .3},
					   "jumpleft":{frames: [6], speed: .3},
					   "jumpright":{frames: [7], speed: .3}};
	//game
	playerdata = new createjs.SpriteSheet({
		"images": [loader.getResult("gamePlayer").src],
		"frames": _frame,
		"animations": _animations
	});
	
	gamePlayer = new createjs.Sprite(playerdata, "left");
	gamePlayer.framerate = 20;
	
	shadowPlayer = new createjs.Bitmap(loader.getResult("shadowPlayer"));
	shadowBall = new createjs.Bitmap(loader.getResult("shadowBall"));
	gameBall = new createjs.Bitmap(loader.getResult("gameBall"));
	bgGame = new createjs.Bitmap(loader.getResult("bgGame"));
	centerReg(gameBall);
	centerReg(shadowPlayer);
	centerReg(shadowBall);
	
	scoreDescTxt = new createjs.Text();
	scoreNumTxt = new createjs.Text();
	scoreDescTxt.font = "60px pixellife";
	scoreNumTxt.font = "100px pixellife";
	scoreDescTxt.color = "#ffffff";
	scoreNumTxt.color = "#f89b09";
	scoreDescTxt.text = scoreDisplayText;
	scoreNumTxt.text = "0";
	scoreDescTxt.textAlign = scoreNumTxt.textAlign = "center";
	
	scoreDescTxt.x=canvasW/100*14;
	scoreDescTxt.y=canvasH/100*1;
	
	scoreNumTxt.x=canvasW/100*14;
	scoreNumTxt.y=canvasH/100*5;
	
	scoreDisplayTxt= new createjs.Text();
	scoreDisplayTxt.font = "300px pixellife";
	scoreDisplayTxt.color = "#f89b09";
	scoreDisplayTxt.text="10";
	scoreDisplayTxt.textAlign = "center";
	scoreDisplayTxt.x=canvasW/2;
	
	if(!$.browser.mozilla){
		txtExtra=2;
	}
	scoreDisplayTxt.y=canvasH/100*(20+txtExtra);
	
	var heartSpace = 15;
	var heartStartX = 0;
	for(n=1; n<=gameLife; n++){
		this["heartBlank"+n] = new createjs.Bitmap(loader.getResult("heartBlank"));
		this["heartFull"+n] = new createjs.Bitmap(loader.getResult("heartFull"));
		
		if(n==1){
			var heatWidth = ((this["heartFull"+n].image.naturalWidth)*gameLife)+(heartSpace*(gameLife-1));
			heartStartX = (canvasW)-(heatWidth);
		}
		centerReg(this["heartBlank"+n]);
		centerReg(this["heartFull"+n]);
		
		this["heartBlank"+n].x=this["heartFull"+n].x=heartStartX;
		this["heartBlank"+n].y=this["heartFull"+n].y=(this["heartFull"+n].image.naturalHeight/2)+heartSpace;
		heartStartX+=(this["heartFull"+n].image.naturalWidth)+heartSpace;
		
		gameContainer.addChild(this["heartBlank"+n], this["heartFull"+n]);
	}
	
	gameBall.x=shadowBall.x=-500;
	gameContainer.addChild(shadowPlayer, shadowBall, gamePlayer, scoreDescTxt, scoreNumTxt, scoreDisplayTxt, gameBall);
	
	
	bgOverlay = new createjs.Shape();
	bgOverlay.graphics.beginFill("#000").drawRect(0, 0, canvasW, canvasH);
	bgOverlay.alpha=.5;
	
	bgPop = new createjs.Bitmap(loader.getResult("bgPop"));
	
	btnReplay = new createjs.Bitmap(loader.getResult("btnReplay"));
	btnBackMain = new createjs.Bitmap(loader.getResult("btnBackMain"));
	
	btnShare = new createjs.Bitmap(loader.getResult("btnShare"));
	btnBack = new createjs.Bitmap(loader.getResult("btnBack"));
	btnFb = new createjs.Bitmap(loader.getResult("btnFb"));
	btnTwitter = new createjs.Bitmap(loader.getResult("btnTwitter"));
	btnGoogle = new createjs.Bitmap(loader.getResult("btnGoogle"));
	
	resultTxt= new createjs.Text();
	resultTxt.font = "80px pixellife";
	resultTxt.color = "#ffffff";
	resultTxt.text = gameOverText;
	resultTxt.textAlign = "center";
	resultTxt.x=canvasW/2;
	resultTxt.y=canvasH/100*(25+txtExtra);
	
	scorePopTxt= new createjs.Text();
	scorePopTxt.font = "280px pixellife";
	scorePopTxt.color = "#ffffff";
	scorePopTxt.text = "10";
	scorePopTxt.textAlign = "center";
	scorePopTxt.x=canvasW/2;
	scorePopTxt.y=canvasH/100*(32+txtExtra);
	
	shareTxt= new createjs.Text();
	shareTxt.font = "40px pixellife";
	shareTxt.color = "#ffffff";
	shareTxt.text=shareText;
	shareTxt.textAlign = "center";
	shareTxt.x=canvasW/2;
	shareTxt.y=canvasH/100*(60+txtExtra);
	
	menuContainer.addChild(bgOverlay, bgPop, resultPopContainer)
	resultPopContainer.addChild(resultTxt, btnReplay, btnBackMain, btnShare, btnBack, btnFb, btnTwitter, btnGoogle, scorePopTxt, shareTxt);
	
	
	centerReg(btnReplay);
	createHitarea(btnReplay);
	centerReg(btnBackMain);
	createHitarea(btnBackMain);
	
	centerReg(btnShare);
	createHitarea(btnShare);
	
	centerReg(btnBack);
	createHitarea(btnBack);
	
	centerReg(btnFb);
	createHitarea(btnFb);
	
	centerReg(btnTwitter);
	createHitarea(btnTwitter);
	
	centerReg(btnGoogle);
	createHitarea(btnGoogle);
	
	btnBack.x=canvasW/2;
	btnBack.y=canvasH/100 * 78;
	
	btnReplay.x=btnFb.x=canvasW/100*30;
	btnBackMain.x=btnTwitter.x=canvasW/2;
	btnShare.x=btnGoogle.x=canvasW/100*70;
	
	btnReplay.y=btnBackMain.y=btnShare.y=btnFb.y=btnTwitter.y=btnGoogle.y=canvasH/100*70;
	
	centerReg(bgPop);
	
	bgPop.x=canvasW/2;
	bgPop.y=canvasH/2;
	
	canvasContainer.addChild(bgGame, mainContainer, gameContainer, menuContainer);
	stage.addChild(canvasContainer)
	
	gameContainer.visible=false;
}


/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
 	if(canvasContainer!=undefined){
		canvasContainer.scaleX=canvasContainer.scaleY=scalePercent;
	}
}

/*!
 * 
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 * 
 */
 function removeGameCanvas(){
	 stage.autoClear = true;
	 stage.removeAllChildren();
	 stage.update();
	 createjs.Ticker.removeEventListener("tick", tick);
	 createjs.Ticker.removeEventListener("tick", stage);
 }

/*!
 * 
 * CANVAS LOOP - This is the function that runs for canvas loop
 * 
 */ 
function tick(event) {
	updateGame();
	stage.update(event);
}

/*!
 * 
 * CANVAS MISC FUNCTIONS
 * 
 */
function centerReg(obj){
	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));	
}