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

var canvasContainer, mainContainer, buildingContainer, gameContainer, humanContainer, scoreContainer, shareContainer;
var background, buttonStart, logo, scoreTitle, shareTitle, buttonShare, buttonReplay, buttonBack, buttonFacebook, buttonTwitter, buttonGoogle, humanTopData, humanTopAnimation, humanBottomData, humanBottomAnimation, head, hBody, handL, handL1, handL2, handR, handR1, handR2, txtDistance, txtCountdown, txtInstruction, txtDistanceResult;

$.buildingClone = {};
$.building = {};

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	buildingContainer = new createjs.Container();
	gameContainer = new createjs.Container();
	humanContainer = new createjs.Container();
	scoreContainer = new createjs.Container();
	shareContainer = new createjs.Container();
	
	//main
	background = new createjs.Bitmap(loader.getResult("background"));
	buttonStart = new createjs.Bitmap(loader.getResult("buttonStart"));
	logo = new createjs.Bitmap(loader.getResult("logo"));
	centerReg(buttonStart);
	
	logo.y = canvasH/100 * 12;
	buttonStart.x = canvasW/100 * 44;
	buttonStart.y = canvasH/100 * 50;
	
	scoreTitle = new createjs.Bitmap(loader.getResult("scoreTitle"));
	buttonReplay = new createjs.Bitmap(loader.getResult("buttonReplay"));
	buttonShare = new createjs.Bitmap(loader.getResult("buttonShare"));
	centerReg(buttonShare);
	centerReg(buttonReplay);
	
	scoreTitle.y = canvasH/100 * 14;
	buttonShare.x = canvasW/100 * 76;
	buttonShare.y = canvasH/100 * 44;
	
	buttonReplay.x = canvasW/100 * 44;
	buttonReplay.y = canvasH/100 * 50;
	
	shareTitle = new createjs.Bitmap(loader.getResult("shareTitle"));
	buttonBack = new createjs.Bitmap(loader.getResult("buttonBack"));
	buttonFacebook = new createjs.Bitmap(loader.getResult("buttonFacebook"));
	buttonTwitter = new createjs.Bitmap(loader.getResult("buttonTwitter"));
	buttonGoogle = new createjs.Bitmap(loader.getResult("buttonGoogle"));
	
	centerReg(buttonBack);
	centerReg(buttonFacebook);
	centerReg(buttonTwitter);
	centerReg(buttonGoogle);
	
	shareTitle.y = canvasH/100 * 12;
	buttonBack.x = canvasW/100 * 44;
	buttonBack.y = canvasH/100 * 50;
	
	buttonFacebook.x = canvasW/100 * 55;
	buttonFacebook.y = canvasH/100 * 22;
	
	buttonTwitter.x = canvasW/100 * 70;
	buttonTwitter.y = canvasH/100 * 21;
	
	buttonGoogle.x = canvasW/100 * 86;
	buttonGoogle.y = canvasH/100 * 20;
	
	var _frame = {"regX": 66, "regY": 20, "height": 302, "count": 25, "width": 140};
	var _animations = {anime:{frames: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,24], speed: 1}};
						
	humanBottomData = new createjs.SpriteSheet({
		"images": [loader.getResult('bottom').src],
		"frames": _frame,
		"animations": _animations
	});
	
	humanBottomAnimation = new createjs.Sprite(humanBottomData, "anime");
	humanBottomAnimation.framerate = 20;
	
	humanBottomAnimation.x = canvasW/100 * 51;
	humanBottomAnimation.y = canvasH/100 * 62;
	
	head = new createjs.Bitmap(loader.getResult("head"));
	head.regX = 67;
	head.regY = 138;
	
	hBody = new createjs.Bitmap(loader.getResult("body"));
	hBody.regX = 59;
	hBody.regY = 205;
	
	handL = new createjs.Bitmap(loader.getResult("handL"));
	handL.regX = 41;
	handL.regY = 11;
	
	handL1 = new createjs.Bitmap(loader.getResult("handL1"));
	handL1.regX = 42;
	handL1.regY = 17;
	
	handL2 = new createjs.Bitmap(loader.getResult("handL2"));
	handL2.regX = 13;
	handL2.regY = 8;
	
	handR = new createjs.Bitmap(loader.getResult("handR"));
	handR.regX = 4;
	handR.regY = 10;
	
	handR1 = new createjs.Bitmap(loader.getResult("handR1"));
	handR1.regX = 12;
	handR1.regY = 17;
	
	handR2 = new createjs.Bitmap(loader.getResult("handR2"));
	handR2.regX = 46;
	handR2.regY = 8;
	
	for(n=0;n<buildings_arr.length;n++){
		$.buildingClone[n] = new createjs.Bitmap(loader.getResult("building"+n));
		$.buildingClone[n].regX = $.buildingClone[n].image.naturalWidth/100 * 150;
		$.buildingClone[n].regY = $.buildingClone[n].image.naturalHeight;
		
		buildingContainer.addChild($.buildingClone[n]);
	}
	
	mainContainer.y = -800;
	scoreContainer.y = -800;
	shareContainer.y = -800;
	
	txtDistance = new createjs.Text();
	txtDistance.font = "80px bebas_neueregular";
	txtDistance.color = "#ffffff";
	txtDistance.text = 0;
	txtDistance.textAlign = "center";
	txtDistance.textBaseline='alphabetic';
	txtDistance.x = canvasW/2;
	txtDistance.y = canvasH/100 * 18;
	
	txtCountdown = new createjs.Text();
	txtCountdown.font = "150px bebas_neueregular";
	txtCountdown.color = "#ffffff";
	txtCountdown.text = 0;
	txtCountdown.textAlign = "center";
	txtCountdown.textBaseline='alphabetic';
	txtCountdown.x = canvasW/2;
	txtCountdown.y = canvasH/100 * 20;
	
	txtInstruction = new createjs.Text();
	txtInstruction.font = "40px bebas_neueregular";
	txtInstruction.color = "#ffffff";
	txtInstruction.text = '';
	txtInstruction.textAlign = "center";
	txtInstruction.textBaseline='alphabetic';
	txtInstruction.x = canvasW/2;
	txtInstruction.y = canvasH/100 * 25;
	
	txtDistanceResult = new createjs.Text();
	txtDistanceResult.font = "130px bebas_neueregular";
	txtDistanceResult.color = "#ffffff";
	txtDistanceResult.text = 0;
	txtDistanceResult.textAlign = "center";
	txtDistanceResult.textBaseline='alphabetic';
	txtDistanceResult.x = canvasW/2;
	txtDistanceResult.y = canvasH/100 * 38;
	
	mainContainer.addChild(logo, buttonStart);
	scoreContainer.addChild(scoreTitle, buttonShare, buttonReplay);
	shareContainer.addChild(shareTitle, buttonBack, buttonFacebook, buttonTwitter, buttonGoogle);
	humanContainer.addChild(hBody, handL, handL1, handL2, handR, handR1, handR2, head, humanBottomAnimation);
	gameContainer.addChild(humanContainer, txtDistance, txtCountdown, txtInstruction);
	
	canvasContainer.addChild(background, buildingContainer, mainContainer, gameContainer, scoreContainer, shareContainer, txtDistanceResult);
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