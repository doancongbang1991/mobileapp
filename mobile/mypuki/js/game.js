////////////////////////////////////////////////////////////
// GAME
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */
var textReplace = 'Replace it with...'; //text for replace items
var textCollection = 'Your current XP: [XP]'; //text for collection, [XP] is xp number
var textUnlocked = 'PURCHASED'; //text for purcahsed item
var textXP = 'XP'; //xp format

var barColourBg = '#cd8e61'; //puki meter bar background colour
var barColourIndicator = '#ffdfb4'; //puki meter bar indicator colour
var barColourWarning = '#de4c12'; //puki meter warning bar indicator colour

var updateStatTimer = 5000; //timer to update puki meter and XP
var minusStat = 1; //number to decrease meter of health and fun
var warnStatNum = 30; //minimum of meter to show warning bar
var deadStatNum = 5; //minimum of meter to dead

//game start default settings with health meter, fun meter, xp amount, items
//items name must same with items_arr key name in items.js
var default_data = {health:80, fun:80, xp:95, items:'ball,bubble,comb,hotdog,coffee'};

//toys items position
var toyPosition_arr = [{x:100,y:180},
						{x:210,y:180},
						{x:320,y:180},
						{x:100,y:305},
						{x:210,y:305},
						{x:320,y:305}]

//foods items position					
var foodPosition_arr = [{x:700,y:180},
						{x:810,y:180},
						{x:920,y:180},
						{x:700,y:305},
						{x:810,y:305},
						{x:920,y:305}]

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
var gamePause = true;
var onMenu = false;
 
/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	btnBegin.cursor = "pointer";
	btnBegin.addEventListener("click", function(evt) {
		loadUserData();
	});
	
	btnStart.cursor = "pointer";
	btnStart.addEventListener("click", function(evt) {
		goPop();
		playSound('soundButton');
		startGame();
	});
	
	btnClose.cursor = "pointer";
	btnClose.addEventListener("click", function(evt) {
		goPop();
	});
	
	iconSound.cursor = "pointer";
	iconSound.addEventListener("click", function(evt) {
		iconSoundMute.visible=true;
		toggleMute(false);
		playSound('soundButton');
	});
	
	iconSoundMute.cursor = "pointer";
	iconSoundMute.addEventListener("click", function(evt) {
		iconSoundMute.visible=false;
		toggleMute(true);
		playSound('soundButton');
	});
	
	iconShop.cursor = "pointer";
	iconShop.addEventListener("click", function(evt) {
		if(!gamePause){
			playSound('soundButton');
			goPop('shop');
		}
	});
	
	iconShopnow.cursor = "pointer";
	iconShopnow.addEventListener("click", function(evt) {
		if(!gamePause){
			playSound('soundButton');
			goPop('shop');
		}
	});
	
	btnOk.cursor = "pointer";
	btnOk.addEventListener("click", function(evt) {
		if(curPop == 'gameover'){
			resetData();
			saveUserData();
			goPage('main');
		}else{
			goPop();
			startGame();
			playSound('soundButton');
		}
	});
	
	btnBuy.cursor = "pointer";
	btnBuy.addEventListener("click", function(evt) {
		playSound('soundButton');
		buyItem();
	});
	
	btnLeft.cursor = "pointer";
	btnLeft.addEventListener("click", function(evt) {
		togglePop(false);
	});
	
	btnRight.cursor = "pointer";
	btnRight.addEventListener("click", function(evt) {
		togglePop(true);
	});
	
	btnReplace.cursor = "pointer";
	btnReplace.addEventListener("click", function(evt) {
		if(curPop == 'shop'){		
			goPop('replace');
		}else{
			replaceItem();
		}
	});
	
	btnCancel.cursor = "pointer";
	btnCancel.addEventListener("click", function(evt) {		
		if(pukiInteract)
			restoreObject(curItem);
	});
	
	if($.browser.mobile || isTablet){
		stage.addEventListener("stagemousedown", handlerMethod);
	}

	stage.addEventListener("stagemousemove", handlerMethod);
	bgGame.on("dblclick", function (evt) {
		if(!gamePause)
			callPuki();
	});
	buildPukiDrag();
}

function handlerMethod(evt) {
	 switch (evt.type){
		 case 'stagemousedown':
		 	var o = evt.target;
			cursorX = (evt.stageX / scalePercent);
			cursorY = (evt.stageY / scalePercent);
			
			break;
			
		 case 'stagemousemove':
			var o = evt.target;
			cursorX = (evt.stageX / scalePercent);
			cursorY = (evt.stageY / scalePercent);
		 	break;
	 }
}

/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage='';
function goPage(page){
	curPage=page;
	mainContainer.visible=false;
	gameContainer.visible=false;
	
	stopSound();
	switch(page){
		case 'main':
			playSound('musicMain', true);
			mainContainer.visible=true;
		break;
		
		case 'game':
			playSound('musicGame', true);
			gameContainer.visible=true;
		break;
	}
}

/*!
 * 
 * DISPLAY POP UP - This is the function that runs to display pop up menu
 * 
 */
var curPop = '';
function goPop(page){
	pukiAction='static';
	restoreObject(curItem);
	
	onMenu = true;
	popContainer.visible = true;
	titleCollection.visible = false;
	titleFull.visible = false;
	titleWelcome.visible = false;
	titleHow.visible = false;
	titleGameover.visible = false;
	btnStart.visible = false;
	btnOk.visible = false;
	btnReplace.visible = false;
	btnBuy.visible = false;
	btnBuyDisable.visible = false;
	btnClose.visible = false;
	btnLeft.visible = false;
	btnRight.visible = false;
	buyXpText.visible=false;
	conHow1.visible = conHow2.visible = conHow3.visible = conHow4.visible = conDead.visible = false;
	conText.text = '';
	curPop = page;
	
	popContainer.removeChild(welcomeFun);
	popContainer.removeChild(welcomeHealth);
	popContainer.removeChild(welcomeXP);
	popContainer.removeChild(buyIcon);
	popContainer.removeChild(replaceIcon);
	
	switch(page){
		case 'how':
			titleHow.visible = true;
			btnRight.visible = true;
			
			howNum = 1;
			displayHowPage();
		break;
		
		case 'welcome':
			titleWelcome.visible = true;
			btnOk.visible = true;
			
			welcomeHealth = healthContainer.clone(true);
			welcomeFun = funContainer.clone(true);
			welcomeXP = xpContainer.clone(true);
			
			welcomeHealth.x = (canvasW/2) - 110
			welcomeFun.x = (canvasW/2) - 110
			welcomeXP.x = (canvasW/2) - 90;
			
			welcomeHealth.y = (canvasH/100 * 35);
			welcomeFun.y = (canvasH/100 * 45);
			welcomeXP.y = (canvasH/100 * 55);
			
			popContainer.addChild(welcomeFun, welcomeHealth, welcomeXP);
		break;
		
		case 'shop':
			titleCollection.visible = true;
			btnBuy.visible = true;
			btnBuyDisable.visible = true;
			btnClose.visible = true;
			btnLeft.visible = true;
			btnRight.visible = true;
			
			conText.text = textCollection.replace('[XP]',user_data.xp);
			displayShopItems();
		break;
		
		case 'replace':
			titleFull.visible = true;
			btnClose.visible = true;
			btnLeft.visible = true;
			btnRight.visible = true;
			btnReplace.visible = true;
			
			conText.text = textReplace;
			retrieveReplaceItems();
			displayReplaceItem();
		break;
		
		case 'gameover':
			titleGameover.visible = true;
			conDead.visible = true;
			btnOk.visible = true;
			break;
		
		default:
			popContainer.visible = false;
			onMenu = false;
	}
}

function togglePop(con){
	if(curPop=='shop'){
		toggleShopItems(con);
	}
	if(curPop=='how'){
		toggleHowPage(con);
	}
	if(curPop=='replace'){
		toggleReplaceItems(con);
	}
}

/*!
 * 
 * START GAME - This is the function that runs to start play game
 * 
 */
 var pukiGround = 0;
 var objGround = 0;
 
 function startGame(){
	gamePause=false;
	curItem = null;
	foodSelected = null;
	toySelected = null;
	curItemAnimation = null;
	curFoodAnimation = null;
	curToyAnimation = null;
	
	sleepStartTime = sleepDefaultTime;
	autoAIDefaultTime = normalDefaultTime;
	autoAIStartTime = 0;
	
	autoAction = false;
	animatePuki('static');
	pukiAction='static';
	
	addGameObj(user_data.items);
	storeBuyArray();
	
	togglePukiGravity();
	cursorX = canvasW/2;
	cursorY = puki_arr.y = pukiGround = canvasH/100 * 82;
	objGround = pukiGround + (canvasH/100 * 10);
	
	pukiStatusTimer = setInterval(function() { updatePukiStat(true); }, updateStatTimer);
	updatePukiStat(true);
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	gamePause=true;
	curItem = null;
	foodSelected = null;
	toySelected = null;
	curItemAnimation = null;
	curFoodAnimation = null;
	curToyAnimation = null;
	
	sleepStartTime = sleepDefaultTime;
	
	clearInterval(pukiStatusTimer);
	btnCancel.visible = false;
	
	for(n=0; n<items_arr.length;n++){
		var targetIcon = $.iconObj[items_arr[n].name];
		var targetDrag = $.itemObj[items_arr[n].name];
		if(targetIcon.x == targetIcon.oriX){
			targetIcon.visible = true;
			targetDrag.visible = false;
			if($.itemAnimation[items_arr[n].name]!= null){
				$.itemAnimation[items_arr[n].name].visible=false;
			}
		}
	}
	
	updateObjLoop();
}

/*!
 * 
 * GAME LOOP - This is the function that runs to loop game
 * 
 */
function updateGame(){
	if(!gamePause){
		updatePukiAction();
		updatePukiFrame();
		updateObjLoop();
		updatePukiAutoAction();
	}
}

/*!
 * 
 * BUILD GAME TOYS AND FOODS - This is the function that runs to build toys and foods
 * 
 */
 
var toyNum, foodNum;
	
function addGameObj(data){
	var userobj_arr = data.split(',');
	var throughCon = false;
	
	toyNum = foodNum = 0;
	for(n=0; n<items_arr.length;n++){
		var targetIcon = $.iconObj[items_arr[n].name];
		targetIcon.x = targetIcon.y = -500;
		targetIcon.oriX = targetIcon.x;
		targetIcon.oriY = targetIcon.y;
		targetIcon.disabled = true;
	}
	for(p=0;p<userobj_arr.length;p++){
		for(n=0; n<items_arr.length;n++){
			throughCon = false;
			if(userobj_arr[p] == items_arr[n].name){
				if(items_arr[n].type == 'toy' && toyNum < toyPosition_arr.length){
					throughCon = true;
				}else if(items_arr[n].type == 'food' && foodNum < foodPosition_arr.length){
					throughCon = true;
				}
				
				if(throughCon){
					var curType='';
					var targetIcon = $.iconObj[items_arr[n].name];
					targetIcon.name = items_arr[n].name;
					targetIcon.type = items_arr[n].type;
					targetIcon.follow=items_arr[n].follow;
					targetIcon.purchased = true;
					targetIcon.scaleX = targetIcon.scaleY = .6;
					targetIcon.disabled = false;
					
					if(items_arr[n].type == 'toy'){
						targetIcon.x = toyPosition_arr[toyNum].x;
						targetIcon.y = toyPosition_arr[toyNum].y;
						toyNum++;
					}else{
						targetIcon.x = foodPosition_arr[foodNum].x;
						targetIcon.y = foodPosition_arr[foodNum].y;
						foodNum++;
					}
					
					var targetDrag = $.itemObj[items_arr[n].name];
					targetDrag.type=items_arr[n].type;
					targetDrag.follow=items_arr[n].follow;
					targetDrag.name = items_arr[n].name;
					targetDrag.shadow = items_arr[n].shadow;
					targetDrag.front = items_arr[n].front;
					targetDrag.objY = items_arr[n].objY;
					targetDrag.health = items_arr[n].health;
					targetDrag.fun = items_arr[n].fun;
					targetDrag.xp = items_arr[n].xp;
					targetDrag.dragging=false;
					targetDrag.selected=false;
					targetDrag.xSpeed = 0
					targetDrag.ySpeed = 0;
					targetDrag.rotate = true;
					targetDrag.bounce = true;
					targetDrag.ground = false;
					
					if(targetDrag.name == 'rubberduck' || targetDrag.name == 'cat'){
						targetDrag.rotate = false;
						targetDrag.bounce = false;
					}
			
					targetIcon.oriX = targetIcon.x;
					targetIcon.oriY = targetIcon.y;
					
					buildObjClick(targetIcon);
				}
			}
		}	
	}
	
	woodBottomLeft.visible = woodBottomRight.visible = false;
	if(toyNum>3){
		woodBottomLeft.visible = true;
	}
	if(foodNum>3){
		woodBottomRight.visible = true;
	}
}


/*!
 * 
 * BUILD GAME TOYS AND FOODS - This is the function that runs to build toys and foods
 * 
 */
var cookieName = 'mypuki';
var user_data = {health:0, fun:0, xp:0, items:''};

function loadUserData(){
	var gameSave = $.cookie(cookieName);
	
	if(gameSave == undefined){
		resetData();
	}else{
		user_data.health = Number($.cookie(cookieName+'_health'));
		user_data.fun = Number($.cookie(cookieName+'_fun'));
		user_data.xp = Number($.cookie(cookieName+'_xp'));
		user_data.items = $.cookie(cookieName+'_obj');
	}
	
	pukiHealthMeter = user_data.health;
	pukiHappyMeter = user_data.fun;
	pukiXPEarn = user_data.xp;
	
	updateStatBar();
	addGameObj(user_data.items);
	storeBuyArray();
	updatePukiStat(false);
	
	goPage('game');
	if(gameSave == undefined){
		goPop('how');	
	}else{
		goPop('welcome');
	}
}

function resetData(){
	user_data.health = default_data.health;
	user_data.fun = default_data.fun;
	user_data.xp = default_data.xp;
	user_data.items = default_data.items;	
}

function saveUserData(){
	var dataDate = new Date().getTime();
	$.cookie(cookieName, '1.0', { expires: 365});
	$.cookie(cookieName+'_date', dataDate, { expires: 365});
	$.cookie(cookieName+'_health', user_data.health, { expires: 365});
	$.cookie(cookieName+'_fun',user_data.fun, { expires: 365});
	$.cookie(cookieName+'_xp', user_data.xp, { expires: 365});
	$.cookie(cookieName+'_obj', user_data.items, { expires: 365});	
}

function updateUserData(){
	var finalToyObj = [];
	var finalFoodObj = [];
	for(n=0; n<items_arr.length;n++){
		var targetIcon = $.iconObj[items_arr[n].name];
		if(targetIcon.purchased){
			if(items_arr[n].type=='toy'){
				finalToyObj.push(items_arr[n].name);
			}else{
				finalFoodObj.push(items_arr[n].name);
			}
		}
	}
	
	var userobj_arr = user_data.items.split(',');
	var thistoy_arr=[];
	var thisfood_arr=[];
	for(p=0;p<userobj_arr.length;p++){
		for(n=0; n<items_arr.length;n++){
			if(userobj_arr[p] == items_arr[n].name){
				if(items_arr[n].type == 'toy'){
					thistoy_arr.push(items_arr[n].name);
				}else{
					thisfood_arr.push(items_arr[n].name);
				}
			}
		}
	}
	
	for(n=0; n<finalToyObj.length;n++){
		if(thistoy_arr.indexOf(finalToyObj[n])==-1){
			thistoy_arr.push(finalToyObj[n]);
		}
	}
	for(n=0; n<finalFoodObj.length;n++){
		if(thisfood_arr.indexOf(finalFoodObj[n])==-1){
			thisfood_arr.push(finalFoodObj[n]);
		}
	}
	var final = String(thistoy_arr);
	if(thisfood_arr.length > 0){
		final+=String(','+thisfood_arr);
	}
	user_data.items = String(final);
	saveUserData();
}

function updateStatBar(){
	user_data.health = pukiHealthMeter;
	user_data.fun = pukiHappyMeter;
	user_data.xp = pukiXPEarn;
	
	var colourIndicator
	barHealthIndicator.graphics.clear();
	colourIndicator = user_data.health <= warnStatNum ? barColourWarning : barColourIndicator;
	barHealthIndicator.graphics.beginFill(colourIndicator).drawRect(68, 23, user_data.health/100 * 128, 30);
	
	barFunIndicator.graphics.clear();
	colourIndicator = user_data.fun <= warnStatNum ? barColourWarning : barColourIndicator;
	barFunIndicator.graphics.beginFill(colourIndicator).drawRect(68, 23, user_data.fun/100 * 128, 30);
	
	xpText.text = user_data.xp;
	saveUserData();
}


/*!
 * 
 * SHOP ITEMS - This is the function that runs to find shop items
 * 
 */

var minXP = 0;
var buyItems = 0;
var buyItemsMax = 0;
var availableItems = 0;
var buy_arr = [];

function storeBuyArray(data){
	var userobj_arr = user_data.items.split(',');
	var purchased;
	buy_arr = [];
	minXP = 5000;
	availableItems=0;
	for(n=0; n<items_arr.length;n++){
		var targetIcon = $.iconObj[items_arr[n].name];
		if(items_arr[n].shop){
			purchased = false;
			if(userobj_arr.indexOf(items_arr[n].name) != -1){
				purchased = true;
			}else{
				if(minXP > items_arr[n].xpBuy){
					minXP = items_arr[n].xpBuy;
				}
			}
			
			if(!targetIcon.purchased){
				availableItems++;
			}
			buy_arr.push({id:n, xp:items_arr[n].xpBuy, purchased:purchased});
		}
	}
	
	//sort base on xp
	buy_arr.sort(function(a, b){
		var a1= a.xp, b1= b.xp;
		if(a1== b1) return 0;
		return a1> b1? 1: -1;
	});
	
	buyItemsMax = buy_arr.length;
}


/*!
 * 
 * DISPLAY SHOP ITEM - This is the function that runs to display shop item
 * 
 */
function displayShopItems(){
	popContainer.removeChild(buyIcon, replaceIcon);
	buyIcon = null;
	
	var buyNum = buy_arr[buyItems].id;
	buyIcon = $.iconObj[items_arr[buyNum].name].clone();
	buyIcon.x = canvasW/2;
	buyIcon.y = canvasH/2;
	buyIcon.scaleX = buyIcon.scaleY = 1;
	popContainer.addChild(buyIcon);
	btnBuyDisable.visible=true;
	
	//check enough xp to buy
	var targetIcon = $.iconObj[items_arr[buyNum].name];
	if(Number(user_data.xp) >= Number(items_arr[buyNum].xpBuy)){
		btnBuy.visible=true;
	}else{
		btnBuy.visible=false;
	}
	
	btnReplace.visible=false;
	if(buy_arr[buyItems].purchased){
		//purchased item
		buyXpText.text = textUnlocked;
		btnBuy.visible=false;
		btnBuyDisable.visible=false;
		
		if(targetIcon.disabled && items_arr[buyNum].type == 'food' && foodNum == foodPosition_arr.length){
			//visible replace button
			btnReplace.visible=true;
		}
	}else{
		buyXpText.text = items_arr[buyNum].xpBuy+textXP;
	}
	buyXpText.visible=true;
}


/*!
 * 
 * TOGGLE SHOP ITEMS - This is the function that runs to toggle shop items
 * 
 */
function toggleShopItems(con){
	if(con){
		buyItems++;
		buyItems = buyItems > (buyItemsMax-1) ? 0 : buyItems;
	}else{
		buyItems--;
		buyItems = buyItems < 0 ? (buyItemsMax-1) : buyItems;
	}
	displayShopItems();
}

/*!
 * 
 * BUY ITEM - This is the function that runs to buy item
 * 
 */
function buyItem(){
	var buyNum = buy_arr[buyItems].id;
	var targetIcon = $.iconObj[items_arr[buyNum].name];
	targetIcon.purchased = true;
	buy_arr[buyItems].purchased = true;
	playSound('soundBuy');
	
	pukiXPEarn -= items_arr[buyNum].xpBuy;
	conText.text = textCollection.replace('[XP]',user_data.xp);
	updateUserData();
	updateStatBar();
	checkShopXP();
	
	if(items_arr[buyNum].type=='food' && foodNum == (foodPosition_arr.length)){
		//items full
		goPop('replace');
	}else{
		//rebuild item
		addGameObj(user_data.items);
		goPop();
	}
	storeBuyArray();
}


/*!
 * 
 * TOGGLE HOW TO PLAY - This is the function that runs to toggle how to play page
 * 
 */
var howNum = 1;
var howMax = 4;

function toggleHowPage(con){
	if(con){
		howNum++;
		howNum = howNum > (howMax) ? 1 : howNum;
	}else{
		howNum--;
		howNum = howNum < 1 ? (howMax) : howNum;
	}
	displayHowPage();
}

/*!
 * 
 * DISPLAY HOW TO PLAY - This is the function that runs to display how to play page
 * 
 */
function displayHowPage(){
	conHow1.visible = conHow2.visible = conHow3.visible = conHow4.visible = false;
	this['conHow'+howNum].visible = true;
	
	btnLeft.visible = true;
	btnRight.visible = true;
	btnStart.visible = false;
	
	if(howNum == 1)
		btnLeft.visible = false;
	if(howNum == howMax){
		btnStart.visible=true;	
		btnRight.visible = false;
	}
}

/*!
 * 
 * RETRIEVE REPLACE ITEMS LIST - This is the function that runs to get replace items list
 * 
 */
var replaceNum = 0;
var replaceMax = 5;
var replace_arr = [];

function retrieveReplaceItems(){
	replaceNum = 0;
	replace_arr = [];
	var userobj_arr = user_data.items.split(',');
	
	var throughCon = false;
	var buyNum = buy_arr[buyItems].id;
	for(p=0;p<userobj_arr.length;p++){
		for(n=0; n<items_arr.length;n++){
			throughCon = false;
			if(userobj_arr[p] == items_arr[n].name && items_arr[n].type == items_arr[buyNum].type && userobj_arr[p] != items_arr[buyNum].name){
				replace_arr.push(n);
			}
		}
	}
	replaceMax = replace_arr.length;
}

/*!
 * 
 * TOGGLE REPLACE ITEM - This is the function that runs to toggle replace item
 * 
 */
function toggleReplaceItems(con){
	if(con){
		replaceNum++;
		replaceNum = replaceNum > (replaceMax-1) ? 0 : replaceNum;
	}else{
		replaceNum--;
		replaceNum = replaceNum < 0 ? (replaceMax-1) : replaceNum;
	}
	displayReplaceItem();
}


/*!
 * 
 * DISPLAY REPLACE ITEM - This is the function that runs to display replace item
 * 
 */
function displayReplaceItem(){
	popContainer.removeChild(buyIcon, replaceIcon);
	buyIcon = null;
	replaceIcon = null;
	
	var buyNum = buy_arr[buyItems].id;
	buyIcon = $.iconObj[items_arr[buyNum].name].clone();
	buyIcon.x = canvasW/100 * 40;
	buyIcon.y = canvasH/2;
	buyIcon.scaleX = buyIcon.scaleY = .8;
	
	var repNum = replace_arr[replaceNum];
	replaceIcon = $.iconObj[items_arr[repNum].name].clone();
	replaceIcon.x = canvasW/100 * 60;
	replaceIcon.y = canvasH/2;
	replaceIcon.scaleX = replaceIcon.scaleY = .8;
	
	
	popContainer.addChild(buyIcon, replaceIcon);
}

/*!
 * 
 * REPLACE ITEM - This is the function that runs to replace item
 * 
 */
function replaceItem(){
	var buyNum = buy_arr[buyItems].id;
	var repNum = replace_arr[replaceNum];
	
	var userData = user_data.items;
	userData = userData.replace(items_arr[repNum].name, "[TEMP]");
	userData = userData.replace(items_arr[buyNum].name, items_arr[repNum].name);
	userData = userData.replace("[TEMP]", items_arr[buyNum].name);
	user_data.items = userData;
	
	addGameObj(user_data.items);
	goPop();
}

function checkShopXP(){
	if(user_data.xp >= minXP && availableItems > 0){
		iconShopnow.visible = true;
	}else{
		iconShopnow.visible = false;	
	}
}