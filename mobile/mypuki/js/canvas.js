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

var canvasContainer, mainContainer, statContainer, healthContainer, funContainer, xpContainer, popContainer, gameContainer, objContainer;
var logo, bgMain, bgGame, woodTopLeft, woodBottomLeft, woodTopRight, woodBottomRight, pukiShadow, toyShadow, foodShadow, bubble, star;
var barFun, barHealth, barXP, barHealthMax, barHealthIndicator, barFunMax, barFunIndicator, xpText, iconShop, iconSound, iconSoundMute, iconShopnow;
var welcomeFun, welcomeHealth, welcomeXP;
var bgOverlay, bgPop, titleCollection, titleFull, titleWelcome, titleHow, titleGameover, btnStart, btnOk, btnBuy, btnBuyDisable, btnReplace, btnClose, btnLeft, btnRight, buyIcon, replaceIcon, buyXpText, btnCancel, btnBegin;
var conHow1, conHow2, conHow3, conHow4, conDead, conText;
var txtExtra=0;

$.iconObj = {};
$.itemObj = {};

$.pukiData = {};
$.pukiAnimation = {};

$.itemData = {};
$.itemAnimation = {};				
								
/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	if($.browser.mozilla){
		txtExtra=15;
	}
	canvasContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	statContainer = new createjs.Container();
	popContainer = new createjs.Container();
	gameContainer = new createjs.Container();
	objContainer = new createjs.Container();
	
	healthContainer = new createjs.Container();
	funContainer = new createjs.Container();
	xpContainer= new createjs.Container();
	
	logo = new createjs.Bitmap(loader.getResult("logo"));
	centerReg(logo);
	bgMain = new createjs.Bitmap(loader.getResult("bgMain"));
	bgGame = new createjs.Bitmap(loader.getResult("bgGame"));
	woodTopLeft = new createjs.Bitmap(loader.getResult("woodTop"));
	woodBottomLeft = new createjs.Bitmap(loader.getResult("woodBottom"));
	woodTopRight = new createjs.Bitmap(loader.getResult("woodTop"));
	woodBottomRight = new createjs.Bitmap(loader.getResult("woodBottom"));
	centerReg(woodTopLeft);
	centerReg(woodBottomLeft);
	centerReg(woodTopRight);
	centerReg(woodBottomRight);
	woodTopRight.scaleX = woodBottomRight.scaleX = -1;
	
	woodTopLeft.x = woodBottomLeft.x = canvasW/100 * 21;
	woodTopRight.x = woodBottomRight.x = canvasW/100 * 79;
	woodTopLeft.y = woodTopRight.y =  canvasH/100 * 32;
	woodBottomLeft.y = woodBottomRight.y =  canvasH/100 * 48;
	 
	bubble = new createjs.Bitmap(loader.getResult("bubble"));
	centerReg(bubble);
	bubble.x = bubble.y = -100;
	
	star = new createjs.Bitmap(loader.getResult("star"));
	centerReg(star);
	star.x = star.y = -100;
	
	pukiShadow = new createjs.Bitmap(loader.getResult("shadow"));
	centerReg(pukiShadow);
	
	toyShadow = new createjs.Bitmap(loader.getResult("shadow"));
	centerReg(toyShadow);
	
	foodShadow = new createjs.Bitmap(loader.getResult("shadow"));
	centerReg(foodShadow);
	
	gameContainer.addChild(bgGame,  woodTopLeft, woodBottomLeft, woodTopRight, woodBottomRight, pukiShadow, toyShadow, foodShadow, bubble, star, objContainer);
	
	btnCancel = new createjs.Bitmap(loader.getResult("btnCancel"));
	centerReg(btnCancel);
	btnCancel.visible=false;
	objContainer.addChild(btnCancel);
	
	for(n=0;n<items_arr.length;n++){
		$.iconObj[items_arr[n].name] = new createjs.Bitmap(loader.getResult('icon'+items_arr[n].name));
		centerReg($.iconObj[items_arr[n].name]);
		$.iconObj[items_arr[n].name].x = -500;
		$.iconObj[items_arr[n].name].y = -500;
		cacheObj($.iconObj[items_arr[n].name]);
		
		objContainer.addChild($.iconObj[items_arr[n].name]);
		if(items_arr[n].item!=''){
			$.itemObj[items_arr[n].name] = new createjs.Bitmap(loader.getResult('obj'+items_arr[n].name));
			if(items_arr[n].name == 'bubble'){
				$.itemObj[items_arr[n].name].regX = 70;
				$.itemObj[items_arr[n].name].regY = 134;
			}else{
				centerReg($.itemObj[items_arr[n].name]);
			}
			$.itemObj[items_arr[n].name].visible=false;
			$.itemObj[items_arr[n].name].x = -500;
			$.itemObj[items_arr[n].name].y = -500;
			cacheObj($.itemObj[items_arr[n].name]);
			objContainer.addChild($.itemObj[items_arr[n].name]);
		}
	}
	
	for(n=0;n<animationItem_arr.length;n++){
		var _frame = {"regX":animationItem_arr[n].regX, "regY":animationItem_arr[n].regY, "height": animationItem_arr[n].height, "width": animationItem_arr[n].width, "count": animationItem_arr[n].count};
		var _animations = animationItem_arr[n].animation;
		$.itemData[animationItem_arr[n].name] = new createjs.SpriteSheet({
											"images": [loader.getResult(animationItem_arr[n].id).src],
											"frames": _frame,
											"animations": _animations
										});
		$.itemAnimation[animationItem_arr[n].name] = new createjs.Sprite($.itemData[animationItem_arr[n].name], animationItem_arr[n].name);
		$.itemAnimation[animationItem_arr[n].name].framerate = 20;
		$.itemAnimation[animationItem_arr[n].name].x = -500;
		$.itemAnimation[animationItem_arr[n].name].y = -500;
		objContainer.addChild($.itemAnimation[animationItem_arr[n].name]);
	}
	
	//insert animation
	for(n=0;n<animation_arr.length;n++){
		var _frame = {"regX":animation_arr[n].regX, "regY":animation_arr[n].regY, "height": animation_arr[n].height, "width": animation_arr[n].width, "count": animation_arr[n].count};
		var _animations = animation_arr[n].animation;
		$.pukiData[animation_arr[n].name] = new createjs.SpriteSheet({
											"images": [loader.getResult(animation_arr[n].id).src],
											"frames": _frame,
											"animations": _animations
										});
		$.pukiAnimation[animation_arr[n].name] = new createjs.Sprite($.pukiData[animation_arr[n].name], animation_arr[n].name);
		$.pukiAnimation[animation_arr[n].name].framerate = 20;
		$.pukiAnimation[animation_arr[n].name].visible=false;
		objContainer.addChild($.pukiAnimation[animation_arr[n].name]);
	}
	
	barHealth = new createjs.Bitmap(loader.getResult("barHealth"));
	barFun = new createjs.Bitmap(loader.getResult("barFun"));
	barXP = new createjs.Bitmap(loader.getResult("barXP"));
	
	barHealthMax = new createjs.Shape();
	barHealthMax.graphics.beginFill(barColourBg).drawRect(68, 23, 128, 30);
	barHealthIndicator = new createjs.Shape();
	barHealthIndicator.graphics.beginFill("#000").drawRect(68, 23, 128, 30);
	
	barFunMax = new createjs.Shape();
	barFunMax.graphics.beginFill(barColourBg).drawRect(68, 23, 128, 30);
	barFunIndicator = new createjs.Shape();
	barFunIndicator.graphics.beginFill("#000").drawRect(68, 23, 128, 30);
	
	xpText = new createjs.Text();
	xpText.font = "30px granstander";
	xpText.color = "#ffffff";
	xpText.text = '0';
	xpText.textAlign = "left";
	xpText.x = 89;
	xpText.y = 12+txtExtra;
	
	healthContainer.addChild(barHealthMax, barHealthIndicator, barHealth)
	funContainer.addChild(barFunMax, barFunIndicator, barFun)
	xpContainer.addChild(barXP, xpText)
	healthContainer.x = canvasW/100 * 3;
	funContainer.x = canvasW/100 * 24;
	xpContainer.x = canvasW/100 * 45;
	healthContainer.y = funContainer.y = xpContainer.y = 18;
	
	iconShopnow = new createjs.Bitmap(loader.getResult("iconShopnow"));
	iconShop = new createjs.Bitmap(loader.getResult("iconShop"));
	iconSound = new createjs.Bitmap(loader.getResult("iconSound"));
	iconSoundMute = new createjs.Bitmap(loader.getResult("iconSoundMute"));
	centerReg(iconShopnow);
	centerReg(iconShop);
	centerReg(iconSound);
	centerReg(iconSoundMute);
	
	iconShopnow.x = canvasW/100*67;
	iconShopnow.y = 57;
	iconSound.x = iconSoundMute.x = canvasW/100 * 83;
	iconShop.x = canvasW/100 * 93;
	iconShop.y = iconSound.y = iconSoundMute.y = 53;
	
	bgOverlay = new createjs.Shape();
	bgOverlay.graphics.beginFill("#000").drawRect(0, 0, canvasW, canvasH);
	bgOverlay.alpha = .6;
	
	bgPop = new createjs.Bitmap(loader.getResult("bgPop"));
	centerReg(bgPop);
	bgPop.x = canvasW/2;
	bgPop.y = canvasH/2;
	
	titleCollection = new createjs.Bitmap(loader.getResult("titleCollection"));
	titleFull  = new createjs.Bitmap(loader.getResult("titleFull"));
	titleWelcome = new createjs.Bitmap(loader.getResult("titleWelcome"));
	titleHow = new createjs.Bitmap(loader.getResult("titleHow"));
	titleGameover = new createjs.Bitmap(loader.getResult("titleGameover"));
	centerReg(titleCollection);
	centerReg(titleFull);
	centerReg(titleWelcome);
	centerReg(titleHow);
	centerReg(titleGameover);
	titleCollection.x = titleFull.x = titleWelcome.x = titleHow.x = titleGameover.x = canvasW/2;
	titleCollection.y = titleFull.y = titleWelcome.y = titleHow.y = titleGameover.y = canvasH/100*25;
	
	btnBegin = new createjs.Bitmap(loader.getResult("btnBegin"));
	btnStart = new createjs.Bitmap(loader.getResult("btnStart"));
	btnReplace  = new createjs.Bitmap(loader.getResult("btnReplace"));
	btnOk = new createjs.Bitmap(loader.getResult("btnOk"));
	btnBuy = new createjs.Bitmap(loader.getResult("btnBuy"));
	btnBuyDisable = new createjs.Bitmap(loader.getResult("btnBuyDisable"));
	centerReg(btnBegin);
	centerReg(btnStart);
	centerReg(btnReplace);
	centerReg(btnOk);
	centerReg(btnBuy);
	centerReg(btnBuyDisable);
	
	btnReplace.x = btnOk.x = btnBuy.x = btnBuyDisable.x = btnStart.x = canvasW/2;
	btnReplace.y = btnOk.y = btnBuy.y = btnBuyDisable.y = btnStart.y = canvasH/100 * 77;
	
	btnClose = new createjs.Bitmap(loader.getResult("btnClose"));
	btnLeft = new createjs.Bitmap(loader.getResult("btnArrow"));
	btnRight = new createjs.Bitmap(loader.getResult("btnArrow"));
	centerReg(btnClose);
	centerReg(btnLeft);
	centerReg(btnRight);
	btnLeft.x = canvasW/100 * 25;
	btnRight.x = canvasW/100 * 75;
	btnRight.scaleX = -1;
	btnLeft.y = btnRight.y = canvasH/2;
	
	btnClose.x = canvasW/100 * 73;
	btnClose.y = canvasH/100*25;
	
	buyXpText = new createjs.Text();
	buyXpText.font = "30px granstander";
	buyXpText.color = "#ffffff";
	buyXpText.text = '100XP';
	buyXpText.textAlign = "center";
	buyXpText.x = canvasW/2;
	buyXpText.y = (canvasH/100*63)+txtExtra;
	
	conHow1 = new createjs.Bitmap(loader.getResult("conHow1"));
	conHow2 = new createjs.Bitmap(loader.getResult("conHow2"));
	conHow3 = new createjs.Bitmap(loader.getResult("conHow3"));
	conHow4 = new createjs.Bitmap(loader.getResult("conHow4"));
	conDead = new createjs.Bitmap(loader.getResult("conDead"));
	centerReg(conHow1);
	centerReg(conHow2);
	centerReg(conHow3);
	centerReg(conHow4);
	centerReg(conDead);
	
	conHow1.x = conHow2.x = conHow3.x = conHow4.x = conDead.x = canvasW/2;
	conHow1.y = conHow2.y = conHow3.y = conHow4.y = conDead.y = canvasH/2;
	
	conText = new createjs.Text();
	conText.font = "30px granstander";
	conText.color = "#541d0e";
	conText.text = '';
	conText.textAlign = "center";
	conText.x = canvasW/2;
	conText.y = (canvasH/100 * 30)+txtExtra;
	
	logo.x = canvasW/100 * 70;
	logo.y = canvasH/100 * 40;
	btnBegin.x = canvasW/100 * 72;
	btnBegin.y = canvasH/100 * 63;
	
	mainContainer.addChild(bgMain, logo, btnBegin)
	popContainer.addChild(bgOverlay, bgPop, titleCollection, titleFull, titleWelcome, titleHow, titleGameover, btnStart, btnOk, btnBuyDisable, btnBuy, btnReplace, btnClose, btnLeft, btnRight, buyXpText, conHow1, conHow2, conHow3, conHow4, conDead, conText);
	statContainer.addChild(healthContainer, funContainer, xpContainer, iconShop, iconSound, iconSoundMute, iconShopnow);
	canvasContainer.addChild(gameContainer, statContainer, popContainer, mainContainer);
	stage.addChild(canvasContainer);
	
	resizeCanvas();
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

function cacheObj(obj){
	obj.cache(0, 0, obj.image.naturalWidth, obj.image.naturalHeight);
}