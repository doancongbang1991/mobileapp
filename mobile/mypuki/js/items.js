////////////////////////////////////////////////////////////
// ITEMS
////////////////////////////////////////////////////////////

/*!
 * 
 * ITEMS SETTING START
 * 
 */

var frameSpeed = 1.5; //frame speed for sprite sheet animation
var items_arr = [{icon:'assets/icons/ball.png', item:'assets/items/ball.png', name:'ball', type:'toy', follow:false, shadow:.5, objY:0, front:true, health:0, fun:5, xpBuy:100, xp:5, shop:false},
				{icon:'assets/icons/bubble.png', item:'assets/items/bubble.png',name:'bubble', type:'toy', follow:true, shadow:.8, objY:0, front:true, health:0, fun:8, xpBuy:100, xp:5, shop:true},
				{icon:'assets/icons/cat.png', item:'assets/items/cat.png', name:'cat', type:'toy', follow:false, shadow:1, objY:-20, front:false, health:0, fun:10, xpBuy:150, xp:10, shop:true},
				{icon:'assets/icons/comb.png', item:'assets/items/comb.png', name:'comb', type:'toy', follow:true, shadow:1, objY:0, front:true, health:0, fun:5, xpBuy:100, xp:5, shop:true},
				{icon:'assets/icons/rubberduck.png', item:'assets/items/rubberduck.png', name:'rubberduck', type:'toy', follow:false, shadow:.8, objY:0, front:true, health:0, fun:10, xpBuy:200, xp:2, shop:true},
				{icon:'assets/icons/spacesuit.png', item:'assets/items/spacesuit.png', name:'spacesuit', type:'toy', follow:false, shadow:1, objY:0, front:true, health:0, fun:5, xpBuy:300, xp:10, shop:true},
				{icon:'assets/icons/donut.png', item:'assets/items/donut.png', name:'donut', type:'food', follow:true, shadow:.6, objY:0, front:true, health:5, fun:0, xpBuy:100, xp:1, shop:true},
				{icon:'assets/icons/hotdog.png', item:'assets/items/hotdog.png', name:'hotdog', type:'food', follow:true, shadow:.8, objY:0, front:true, health:10, fun:0, xpBuy:100, xp:1, shop:true},
				{icon:'assets/icons/noodle.png', item:'assets/items/noodle.png', name:'noodle', type:'food', follow:true, shadow:.7, objY:0, front:true, health:25, fun:0, xpBuy:200, xp:1, shop:true},
				{icon:'assets/icons/chili.png', item:'assets/items/chili.png', name:'chili', type:'food', follow:true, shadow:.8, objY:0, front:true, health:-20, fun:10, xpBuy:180, xp:10, shop:true},
				{icon:'assets/icons/coffee.png', item:'assets/items/coffee.png', name:'coffee', type:'food', follow:true, shadow:.5, objY:0, front:true, health:20, fun:0, xpBuy:100, xp:1, shop:true},
				{icon:'assets/icons/icecream.png', item:'assets/items/icecream.png', name:'icecream', type:'food', follow:true, shadow:.5, objY:0, front:true, health:10, fun:0, xpBuy:100, xp:1, shop:true}
				,
				{icon:'assets/icons/steak.png', item:'assets/items/steak.png', name:'steak', type:'food', follow:true, shadow:.9, objY:0, front:true, health:30, fun:0, xpBuy:300, xp:1, shop:true}];
				
var animationItem_arr = [{animation:{comb:[0],
									combreplay:[1, 11, "combreplay", frameSpeed]}, name:'comb', regX:90, regY:35, width:175, height:50, count:12, image:'assets/animations/obj_comb.png', id:'objComb'},
						{animation:{noodle:[0],
									noodlefinishing:[1, 33, "noodlefinish", frameSpeed],
									noodlefinish:[33]}, name:'noodle', regX:68, regY:44, width:136, height:93, count:34, image:'assets/animations/obj_noodle.png', id:'objNoodle'},
						{animation:{cat:[0],
									catreplay:[1, 19, "cat", frameSpeed]}, name:'cat', regX:92, regY:125, width:185, height:250, count:20, image:'assets/animations/obj_cat.png', id:'objCat'}];
									
var itemDefaultInteractTime = 20; //timer for item to start interact with Puki after is select

//Tennis Ball
var canGrabDefaultTime = 4; //distance to start grab ball

//Comb
var hairbrushDefaultTime = 30; //timer for Puki to back to normal after hairbrush
var updateCombDefaultTimer = 200; //timer to increase meter and XP

//Fortune Cat
var shakeHeadDefaultTime = 300; //timer to shake cat head

//Rubber Duck
var duckMoveDefaultTime = 10; //timer to move when Puki riding rubber duck
var duckMoveSpeed = 5; //Puki riding duck move speed
var duckSoundDefalutTime = 50; //timer to loop duck sound
var updateDuckDefaultTimer = 100; //timer to increase meter and XP

//Bubble Toy
var bubbleHitDefaultTime = 30; //timer to start make puki bubble after is pop
var bubbleDefaultTime = 10; //timer to create bubble
var bubbleMaxNum = 5; //maximum bubbles create;

//Spacesuit
var starTime = 5000; //timer for star reposition
var updateSpaceDefaultTimer = 100; //timer to increase meter and XP

//Chili
var spicyRunSpeed = 10; //run speed
var spicyDefaultTime = 200; //timer for crazy running
var spicyRunSideDefaultTime = 30; //timer to change running side

/*!
 * 
 * ITEMS SETTING END
 * 
 */
 
var itemStartInteractTime = itemDefaultInteractTime;

var objGravity = 1;
var objDrag = .99;
var objBounce = .9;

var itemDragging = false;
var canGrabBall = false;
var grabBall = false;

var canGrabTime = 1;

var bubbleHitTime = bubbleHitDefaultTime;
var hairbrushStartTime = hairbrushDefaultTime;
var hairbrushOver = false;
var shakeHeadStartTime = shakeHeadDefaultTime;
var duckMoveStartTime = duckMoveDefaultTime;
var duckSoundTime = duckSoundDefalutTime;
var bubbleStartTime = bubbleDefaultTime;
var bubbleRotateSide = 0;

/*!
 * 
 * SELECT ITEM - This is the function that runs to select item
 * 
 */
function selectObj(obj){
	//ignore if selected
	if(obj.selected || !pukiInteract){
		return;
	}
	
	if(curItem!=null){
		var skipAction = false;
		//only one food is selected
		if(obj.type == 'food' && foodSelected){
			return;
		}
		
		//only one toy is selected
		if(obj.type == 'toy' && toySelected){
			restoreObject(curItem);
			skipAction=true;
		}
		
		//only one item follow mouse
		if(!skipAction){
			if(obj.follow && curItem.follow){
				restoreObject(curItem);
				skipAction=true;
			}
		}
		
		//food can replace spacesuit
		if(!skipAction){
			if(obj.type == 'food' && curItem.name == 'spacesuit'){
				restoreObject(curItem);
			}
		}
		
		//toy can replace food
		if(!skipAction){
			if(obj.type == 'toy' && foodSelected){
				restoreObject(curItem);
			}
		}
		
		//restore object setting but remain on screen
		if(obj.type == 'food' && toySelected){
			removeObjOption(toySelected);
		}
	}
	
	//start follow mouse or throw object;
	toggleCancelButton(true, obj.x, obj.y);
	playSound('soundSelect');
	
	obj.visible = false;
	curItem = $.itemObj[obj.name];
	curItem.selected = true;
	curItem.alpha=1;
	curItem.x = obj.x;
	curItem.y = obj.y;
	curItem.xSpeed = Math.random() * 30;
	curItem.ySpeed = Math.random() * 30;
	
	if(curItem.front){
		curItem.parent.addChild(curItem);
	}
	
	//reset previous drag object
	if(curItemAnimation != null){
		curItemAnimation.visible=false;
		curItemAnimation = null;
	}
	if(curToyAnimation != null){
		curToyAnimation.visible=true;
		
		if(curItem.type == 'toy'){
			curToyAnimation.visible=false;
			curToyAnimation = null;
		}
	}
	
	if(curFoodAnimation != null){
		if(curItem.type == 'food'){
			curFoodAnimation.visible=false;
			curFoodAnimation = null;
		}
	}
	
	if($.itemAnimation[curItem.name]!= null){
		curItemAnimation = $.itemAnimation[curItem.name];
		curItemAnimation.visible=true;
		
		if(curItem.type == 'food'){
			curFoodAnimation = curItemAnimation;
		}
		if(curItem.type == 'toy'){
			curToyAnimation = curItemAnimation;
		}
		
		if(curItem.front){
			curItemAnimation.parent.addChild(curItemAnimation);
		}
		if(curItem.name == 'cat' || curItem.name == 'noodle' || curItem.name == 'comb'){
			curItem.visible=true;
		}
	}else{
		curItem.visible=true;	
	}
	
	if(obj.type == 'food'){
		foodSelected = curItem;
	}
	if(obj.type == 'toy'){
		toySelected = curItem;
	}
	
	resetPukiAutoIdleAction();
	itemStartInteractTime = itemDefaultInteractTime;
	selectObjOption(curItem);
}

/*!
 * 
 * RESTORE ITEM - This is the function that runs to restore item
 * 
 */
function restoreObject(target){
	if(target!= null){
		toggleCancelButton(false);
		playSound('soundDrop');
		
		var targetIcon = $.iconObj[target.name];
		targetIcon.x=targetIcon.oriX;
		targetIcon.y=targetIcon.oriY;
		targetIcon.visible=true;
		
		var targetDrag = $.itemObj[target.name];
		targetDrag.selected=false;
		targetDrag.visible=false;
		
		if(target.type == 'food'){
			foodSelected = null;
			
			if(curFoodAnimation != null){
				curFoodAnimation.visible=false;
				curFoodAnimation = null;
			}
		}
		if(target.type == 'toy'){
			if(curToyAnimation!=null){
				curToyAnimation.visible=false;
				curToyAnimation = null;
			}
			
			toySelected = null;
			togglePukiGravity();
		}
		
		//check action
		removeObjOption(curItem);
		removeObjDrag(curItem);
		curItem=null;
		
		//if object still exist onscreen;
		for(n=0; n<items_arr.length;n++){
			var targetDrag = $.itemObj[items_arr[n].name];
			if(targetDrag.selected){
				var targetIcon = $.iconObj[items_arr[n].name];
				toggleCancelButton(true, targetIcon.oriX, targetIcon.oriY);
				
				curItem = targetDrag;
				selectObjOption(curItem);
				
				if($.itemAnimation[curItem.name]!= null)
					curItemAnimation = $.itemAnimation[curItem.name];
			}
		}
	}
}

/*!
 * 
 * TOGGLE CANCEL ITEM BUTTON - This is the function that runs to toggle cancel item button
 * 
 */
function toggleCancelButton(con, x, y){
	btnCancel.visible=con;
	if(con){
		btnCancel.x = x;
		btnCancel.y = y + 40;
	}
}

/*!
 * 
 * SELECT ITEM OPTION - This is the function that runs to select item option
 * 
 */
function selectObjOption(obj){
	switch (obj.name){
		case 'ball':
			objGravity = 2;
			objDrag = .99;
			objBounce = .9;
			buildObjDrag(curItem);
			break;
			
		case 'rubberduck':
			objGravity = 5;
			objDrag = .99;
			objBounce = .3;
			
			buildObjDrag(curItem);
			break;
			
		case 'spacesuit':
			curItem.visible=false;
			pukiAction = "air";
			togglePukiGravity('spacesuit');
			pukiGravityActive = true;
			initStar();
			break;
			
		case 'cat':
			objGravity = 5;
			objDrag = .99;
			objBounce = .3;
			pukiActive_arr.walkActive = true;
			pukiActive_arr.sitActive = true;
			checkPukiStat();
			
			extraDistance = 200;
			
			buildObjDrag(curItem);
			pukiAction = 'static';
			break;
	}
}

/*!
 * 
 * REMOVE ITEM OPTION - This is the function that runs to remove item option
 * 
 */
function removeObjOption(obj){
	switch (obj.name){
		case 'spacesuit':
			removeStar();
			break;
			
		case 'rubberduck':
			stopSoundLoop('soundDuckLoop');
			if(toySelected!=null){
				toySelected.alpha = 1;
			}
			pukiAction = 'static';
			break;
			
		case 'bubble':
			removeAllBubbles();
			break;
			
		case 'cat':
			pukiActive_arr.walkActive = false;
			pukiActive_arr.sitActive = false;
			
			checkPukiStat();
			
			extraDistance=0;
			break;
			
		default:
			eating = false;
			pukiInteract = true;
			stopSoundLoop('soundChiliRun');
			stopSoundLoop('soundBowlPush');
			stopSoundLoop('soundHairbrush');
			$.itemAnimation['noodle'].gotoAndStop(0);
			animateNoodle=false;
			curFoodAnimate='';
			break;
	}
}

/*!
 * 
 * TOGGLE PUKI GRAVITY - This is the function that runs to set puki gravity base on item
 * 
 */
function togglePukiGravity(con){
	switch(con){
		case 'spacesuit':
			pukiGravity = -0.05;
			break;
			
		case 'bubble':
			pukiGravity = -0.1;
			break;
			
		default:
			pukiGravity = 5;
			pukiDrag = .9;
			pukiBounce = .2;
				
	}
}

/*!
 * 
 * BUILD ITEM CLICK EVENT - This is the function that runs to build item click event
 * 
 */
function buildObjClick(obj){
	if(obj.cursor != 'pointer'){
		obj.cursor = "pointer";
		obj.addEventListener("click", function(evt) {
			if(!gamePause){
				selectObj(obj);
			}
		});
	}
}

/*!
 * 
 * BUILD ITEM DRAG & DROP EVENT - This is the function that runs to build item drag and drop event
 * 
 */
function buildObjDrag(obj){
	removeObjDrag(obj);
	
	obj.cursor = "pointer";
	obj.addEventListener("mousedown", handlerObjDragMethod);
	obj.addEventListener("pressmove", handlerObjDragMethod);
	obj.addEventListener("pressup", handlerObjDragMethod);
}

function handlerObjDragMethod(evt) {
	 switch (evt.type){
		 case 'mousedown':
			toggleObjDragEvent(evt, 'drag')
		 	break;
		 case 'pressmove':
			toggleObjDragEvent(evt, 'move')
		 	break;
		 case 'pressup':
			toggleObjDragEvent(evt, 'release')
		 	break;
	 }
}

/*!
 * 
 * HANDLE ITEM EVENT - This is the function that runs to handle item drag and drop events
 * 
 */
function toggleObjDragEvent(obj,con){
	if(foodSelected == null){
		switch(con){
			case 'drag':
				itemDragging = true;
				obj.target.dragging = true;
				obj.target.offset = {x:obj.target.x-(obj.stageX / scalePercent), y:obj.target.y- (obj.stageY / scalePercent)};
			break;
			
			case 'move':
				obj.target.x = (obj.stageX / scalePercent) + obj.target.offset.x;
				if((obj.stageY / scalePercent) + obj.target.offset.y < objGround - ((obj.target.image.naturalHeight-obj.target.regY) - obj.target.objY))
					obj.target.y = (obj.stageY / scalePercent) + obj.target.offset.y;
			break;
			
			case 'release':
				itemDragging = false;
				obj.target.dragging = false;
			break;
		}
	}
}

/*!
 * 
 * REMOVE ITEM EVENT - This is the function that runs to remove item drag and drop events
 * 
 */
function removeObjDrag(obj){
	if(obj.cursor == "pointer"){
		obj.cursor = "default";
		obj.removeEventListener("mousedown", handlerObjDragMethod);
		obj.removeEventListener("pressmove", handlerObjDragMethod);
		obj.removeEventListener("pressup", handlerObjDragMethod);
	}
}


/*!
 * 
 * BUBBLE EVENT - This is the function that runs to create bubble
 * 
 */
var bubbleNum = 0;
var bubble_arr = [];
$.bubble = {};

function createBubble(){
	objContainer.removeChild($.bubble[bubbleNum]);
	var targetbubble = $.bubble[bubbleNum] = bubble.clone();
	targetbubble.x=cursorX;
	targetbubble.y=cursorY;
	targetbubble.scaleX = targetbubble.scaleY = ((Math.random() * 5) * .1) + .5;
	
	objContainer.addChild(targetbubble);
			
	targetbubble.xLoc = cursorX - 20;
	targetbubble.yLoc = cursorY - 50;
	targetbubble.kill = false;
	targetbubble.xVelocity = Math.random()*4-2;
	targetbubble.yVelocity = -.5;
	
	targetbubble.bubbleScale = Math.random() + .2;
	targetbubble.life = 70 * targetbubble.bubbleScale;
	bubbleNum++;
	bubbleNum = bubbleNum > bubbleMaxNum-1 ? 0 : bubbleNum;
}

/*!
 * 
 * BUBBLES REMOVE - This is the function that runs to remove bubbles
 * 
 */
function removeAllBubbles(){
	for(n=0;n<bubbleMaxNum;n++){
		objContainer.removeChild($.bubble[n]);
	}	
}

/*!
 * 
 * BUBBLES LOOP - This is the function that runs to loop bubbles
 * 
 */
function updateBubble(num){
	var targetbubble = $.bubble[num];
	
	if(targetbubble != undefined){
		targetbubble.xLoc+=targetbubble.xVelocity;
		targetbubble.yLoc += targetbubble.yVelocity;
		targetbubble.yVelocity *= 1.05;
		targetbubble.xVelocity *=.95;
		targetbubble.life--;
		
		if (targetbubble.life < 1) {
			targetbubble.kill = true;
			objContainer.removeChild(targetbubble);
			targetbubble = '';
		}
		
		targetbubble.x = targetbubble.xLoc;
		targetbubble.y = targetbubble.yLoc;
	}
}

/*!
 * 
 * BUBBLES POP - This is the function that runs to pop puki bubble
 * 
 */
function popBubble(){
	playSound('soundBubblePop');
	togglePukiGravity();
	increasePukiStatus(toySelected.health, toySelected.fun, toySelected.xp);
	pukiAction = "air";
}


/*!
 * 
 * INIT START - This is the function that runs to start init star
 * 
 */
var startInterval = null;
var starNum = 0;
$.start = {};

function initStar(){
	if(startInterval == null){
		createStar();
		startInterval = setInterval(createStar, starTime);
	}
}

/*!
 * 
 * CREATE START - This is the function that runs to create star
 * 
 */
function createStar(){
	objContainer.removeChild($.start[0]);
	var targetstar = $.start[0] = star.clone();
	targetstar.x=(Math.random()*(canvasW/100*80))+(canvasW/100*10);
	targetstar.y=(Math.random()*(objGround - (canvasH/100*45))+(canvasH/100*45));
	targetstar.scaleX = targetstar.scaleY = ((Math.random() * 5) * .1) + .5;
	targetstar.rotation = Math.random()*360;
	targetstar.alpha = .7;
	targetstar.hit=true;
	
	objContainer.addChild(targetstar);
}

/*!
 * 
 * REMOVE STAR - This is the function that runs to remove star
 * 
 */
function removeStar(){
	clearInterval(startInterval);
	startInterval = null;
	objContainer.removeChild($.start[0]);
}


/*!
 * 
 * ITEMS LOOP - This is the function that runs to loop toys and foods
 * 
 */
function updateObjLoop(){	
	for(n=0; n<items_arr.length;n++){
		if(items_arr[n].follow){
			updateItemsFollow($.itemObj[items_arr[n].name]);
		}else{
			updateGameDrag($.itemObj[items_arr[n].name]);
		}
	}
	
	if(curItem!=null){
		if(itemStartInteractTime > 0){
			itemStartInteractTime--;	
		}else{
			updateItemsAction();
		}
		
		if(curItemAnimation != null){
			curItemAnimation.x = curItem.x;
			curItemAnimation.y = curItem.y;
			curItemAnimation.scaleX = curItem.scaleX;
			curItemAnimation.rotation = curItem.rotation;
		}
	}
	
	//shadow
	if(foodSelected != null && foodSelected.visible){
		foodShadow.visible=true;
		foodShadow.x = foodSelected.x;
		foodShadow.y = objGround;
		foodShadow.scaleX = foodShadow.scaleY = foodSelected.y/objGround * foodSelected.shadow;	
	}else{
		foodShadow.visible=false;	
	}
	
	if(toySelected != null && toySelected.visible){
		toyShadow.visible=true;
		toyShadow.x = toySelected.x;
		toyShadow.y = objGround + toySelected.objY;
		toyShadow.scaleX = toyShadow.scaleY = toySelected.y/objGround * toySelected.shadow;
	}else{
		toyShadow.visible=false;	
	}
}

/*!
 * 
 * ITEMS DRAG LOOP - This is the function that runs to loop dragging toys and foods
 * 
 */
function updateGameDrag(target){
	if (target.selected) {
		if (!target.dragging) {
			var objWidth = target.image.naturalWidth;
			var objHeight = target.image.naturalHeight;
			
			//calculate new x and y position
			target.y = target.y + target.ySpeed;
			target.x = target.x + target.xSpeed;
			if(target.rotate){
				target.rotation = target.rotation + target.xSpeed;
			}
			
			//bounce off the bottom of stage and reverse yspeed
			if ((target.y + objHeight / 2) > objGround + target.objY) {
				if(target.ySpeed > 2 && target.name=='ball') {
					playSound('soundBall');
				}else if(target.ySpeed > 20 && target.name=='rubberduck') {
					playSound('soundDuck');
				}else if(target.ySpeed > 20 && target.name=='cat') {
					playSound('soundCat');
				}
				if(!target.bounce){
					target.xSpeed = 0;
				}
				target.y = (objGround - objHeight / 2) + target.objY;
				target.ySpeed = -target.ySpeed * objBounce;
			}
			
			//bounce off the top of stage and reverse yspeed
			if (target.y - objHeight / 2 < 0) {
				if(target.name=='ball'){
					playSound('soundBall');	
				}
				target.y = objHeight / 2;
				target.ySpeed = -target.ySpeed * objBounce;
			}
			
			//bounce off right of stage 
			if (target.x + objWidth / 2 > canvasW) {
				if(target.name=='ball'){
					playSound('soundBall');	
				}
				target.x = canvasW - objWidth / 2;
				target.xSpeed = -target.xSpeed * objBounce;
			}
			//bounce off left of stage  
			if (target.x - objWidth / 2 < 0) {
				if(target.name=='ball'){
					playSound('soundBall');	
				}
				target.x = objWidth / 2;
				target.xSpeed = -target.xSpeed * objBounce;
			}
			
			//recalculate x and y speeds figuring in drag (friction) and gravity for y  
			target.ySpeed = target.ySpeed * objDrag + objGravity;
			target.xSpeed = target.xSpeed * objDrag;
			
		} else {
			//if dragging then calculate new speeds according to dragging movement and speed 
			target.xSpeed = target.x - target.oldx;
			target.ySpeed = target.y - target.oldy;
			target.oldx = target.x;
			target.oldy = target.y;
		}
	}
}


/*!
 * 
 * ITEMS FOLLOW LOOP - This is the function that runs to loop toys and foods follow mouse
 * 
 */
function updateItemsFollow(target){
	if (target.selected) {
		target.x = cursorX;
		target.y = cursorY;
		
		if(target.y > objGround - (target.image.naturalHeight-target.regY)){
			target.y = (objGround - (target.image.naturalHeight-target.regY));
		}
		
		var mouseSpeed = tracedrag_arr.x - target.x;
		
		if(target.type=='food'){
			target.rotation = 0 - Math.round(mouseSpeed/100 * 20);
		}else{
			target.rotation = 0 + Math.round(mouseSpeed/100 * 20);	
		}
		
		endX = cursorX;
		tracedrag_arr.x += (endX - tracedrag_arr.x)/easeSpeed;
	}
}

/*!
 * 
 * ITEMS ACTION LOOP - This is the function that runs to loop toys and foods
 * 
 */
function updateItemsAction(){
	if(foodSelected != null){
		var pointPuki = curPukiAnimation.globalToLocal(foodSelected.x * scalePercent, foodSelected.y * scalePercent);
		if(curPukiAnimation.hitTest(pointPuki.x, pointPuki.y)){
			if(pukiInteract) {
				eatStartTime = eatDefaultTime;
				animatePuki('eat');
				pukiAction = "eat";
			}
		}	
	}
	
	if(toySelected != null){
		if(toySelected.name == 'ball' && toySelected.selected) {
			if(toySelected.xSpeed < 5 && toySelected.xSpeed > -5) {
				canGrabBall = true;
			} else {
				canGrabBall = false;
				grabBall = true;
			}
			
			if(!pukiDragging && canGrabBall && grabBall && !toySelected.dragging && !eating) {
				if(puki_arr.x > toySelected.x - (ballDistance+5) && puki_arr.x < toySelected.x + (ballDistance+5) && toySelected.y > objGround-40) {
					canGrabTime++;
					if(canGrabTime >= canGrabDefaultTime) {
						canGrabTime = 0;
					} else if(canGrabTime > 0) {
						toySelected.dragging = true;
						pukiAction = "grab";
					}
					grabBall = false;
				}
			}
		}
		
		if(toySelected.name == 'bubble' && toySelected.selected){
			if(!pukiGravityActive && !eating) {
				var pointPuki = curPukiAnimation.globalToLocal(toySelected.x * scalePercent, toySelected.y * scalePercent);
				if(bubbleHitTime > 0){
					bubbleHitTime--;	
				}else{
					if(curPukiAnimation.hitTest(pointPuki.x, pointPuki.y)){
						puki_arr.y -= 10;
						bubbleHitTime = bubbleHitDefaultTime;
						pukiAction = "bubble";
						togglePukiGravity('bubble');
						pukiGravityActive = true;
						bubbleRotateSide = Math.round(Math.random()*2);
						playSound('soundBubble');
					}
				}
			}
			
			if(bubbleStartTime>0) {
				bubbleStartTime--;
			} else {
				bubbleStartTime = bubbleDefaultTime;
				createBubble();
			}
		
			for(n=0;n<bubbleMaxNum;n++){
				updateBubble(n);
			}	
		}
		
		if(toySelected.name == 'rubberduck' && toySelected.selected){
			if(!pukiDragging && !eating && foodSelected == null) {
				if(puki_arr.x > toySelected.x - 80 && puki_arr.x < toySelected.x + 80 && toySelected.y >objGround-(toySelected.image.naturalHeight)) {
					pukiAction = "rubberduck";
					if(puki_arr.scaleX == -1) {
						toySelected.scaleX = -1;
					} else {
						toySelected.scaleX = 1;
					}
				}
			}
			
			if(pukiAction == 'rubberduck'){
				toySelected.alpha=0;
				playSoundLoop('soundDuckLoop');
			}else{
				toySelected.alpha=1;
				stopSoundLoop('soundDuckLoop');
			}
		}
		
		if(toySelected.name == 'comb' && toySelected.selected){
			if(!pukiDragging && !eating && foodSelected == null) {
				if(puki_arr.x > toySelected.x - (80) && puki_arr.x < toySelected.x + (80) && toySelected.y > objGround-150) {
					hairbrushOver=true;
					
					if(pukiInteract){
						hairbrushStartTime = hairbrushDefaultTime;
						updateSingleStatTimer = updateCombDefaultTimer;

						changePukiAction('comb');
						animateToy('combreplay');
					}
				}else{
					hairbrushOver=false;
					animateToy('comb');
				}
			}
			
			if(pukiAction == 'combplay' && !hairbrushOver){
				if(hairbrushStartTime > 0){
					hairbrushStartTime--;
				}else{
					changePukiAction('static');
				}
			}
		}
		
		if(toySelected.name == 'cat' && toySelected.selected){
			if(!pukiDragging && !eating && foodSelected == null) {
				if(puki_arr.x > toySelected.x - (extraDistance+5) && puki_arr.x < toySelected.x + (extraDistance+5) && toySelected.y >objGround-(toySelected.image.naturalHeight)) {
					if(puki_arr.x < toySelected.x){
						puki_arr.scaleX = 1;
					}else{
						puki_arr.scaleX = -1;
					}
				}
			}
			
			if(shakeHeadStartTime > 0){
				shakeHeadStartTime--;
			}else{
				shakeHeadStartTime = shakeHeadDefaultTime;
				playSound('soundCatShake');
				animateToy('catreplay');
				toySelected.alpha=0;
				
				if(!pukiDragging && !eating && foodSelected == null) {
					if(puki_arr.x > toySelected.x - (extraDistance+5) && puki_arr.x < toySelected.x + (extraDistance+5) && toySelected.y >objGround-(toySelected.image.naturalHeight)) {
						callNextPukiAction('scare');
					}
				}
			}
			
			if(curToyAnimation.currentAnimation != curToyAnimate){
				animateToy('cat');
				toySelected.alpha=1;
			}
		}
		
		if(toySelected.name == 'spacesuit' && toySelected.selected){
			var distance = 80;
			if(curPukiAnimation.x > $.start[0].x - (distance) && curPukiAnimation.x < $.start[0].x + (distance) && curPukiAnimation.y > $.start[0].y - (distance) && curPukiAnimation.y < $.start[0].y + (distance) && $.start[0].hit){
				$.start[0].hit=false;
				$.start[0].visible=false;
				increasePukiStatus(toySelected.health, toySelected.fun, toySelected.xp);
				playSound('soundBell');
			}
		}
	}
}

/*!
 * 
 * ITEMS ANIMATION - This is the function that runs to animate toys and foods
 * 
 */
var curFoodAnimate;
var curToyAnimate;

function animateFood(frame){
	if(curFoodAnimation != null){
		if(curFoodAnimate!=frame){
			curFoodAnimate = frame;
			curFoodAnimation.gotoAndPlay(frame);
		}
	}
}

function animateToy(frame){
	if(curToyAnimation != null){
		if(curToyAnimate!=frame){
			curToyAnimate = frame;
			curToyAnimation.gotoAndPlay(frame);
		}
	}
}