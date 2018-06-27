////////////////////////////////////////////////////////////
// PET
////////////////////////////////////////////////////////////
 
 
 /*!
 * 
 * PUKI SETTING START
 * 
 */
var frameSpeed = 1.5; //frame speed for sprite sheet animation
var animation_arr = [{animation:{static:[0, 9, "static", frameSpeed]}, name:'static', regX:86, regY:85, width:172, height:170, count:10, image:'assets/animations/static.png', id:'pukiStatic', interact:true},
					{animation:{walk:[0, 16, "walk", frameSpeed]}, name:'walk', regX:86, regY:88, width:172, height:170, count:17, image:'assets/animations/walk.png', id:'pukiWalk', interact:true},
					{animation:{run:[0, 15, "run", frameSpeed]}, name:'run', regX:86, regY:85, width:172, height:170, count:16, image:'assets/animations/run.png', id:'pukiRun', interact:true},
					{animation:{jump:[0, 24, "jump", frameSpeed]}, name:'jump', regX:90, regY:137, width:180, height:220, count:25, image:'assets/animations/jump.png', id:'pukiJump', interact:true},
					{animation:{sit:[0, 19, "sitstatic", frameSpeed],
								sitstatic:[19]}, name:'sit', regX:86, regY:85, width:172, height:170, count:20, image:'assets/animations/sit.png', id:'pukiSit', interact:true},
					{animation:{sleep:[0, 9, "sleepreplay", frameSpeed],
								sleepreplay:[10, 23, "sleepreplay", frameSpeed]}, name:'sleep', regX:86, regY:85, width:174, height:170, count:24, image:'assets/animations/sleep.png', id:'pukiSleep', interact:true},
					{animation:{awake:[0, 19, "awake", frameSpeed]}, name:'awake', width:174, regX:86, regY:85, height:170, count:20, image:'assets/animations/awake.png', id:'pukiAwake', interact:true},
					{animation:{air:[0, 8, "air", frameSpeed]}, name:'air', width:172, regX:86, regY:85, height:170, count:9, image:'assets/animations/air.png', id:'pukiAir', interact:true},
					{animation:{grab:[0, 24, "grab", frameSpeed]}, name:'grab', width:172, regX:86, regY:87, height:170, count:25, image:'assets/animations/grab.png', id:'pukiGrab', interact:false},
					{animation:{bubble:[0, 9, "bubble", frameSpeed]}, name:'bubble', width:200, regX:100, regY:108, height:200, count:10, image:'assets/animations/bubble.png', id:'pukiBubble', interact:true},
					{animation:{spacesuit:[0, 8, "spacesuit", frameSpeed]}, name:'spacesuit', width:185, regX:93, regY:95, height:170, count:9, image:'assets/animations/spacesuit.png', id:'pukiSpacesuit', interact:true},
					{animation:{rubberduck:[0, 11, "rubberduck", frameSpeed]}, name:'rubberduck', width:240, regX:87, regY:102, height:180, count:12, image:'assets/animations/rubberduck.png', id:'pukiRubberduck', interact:true},
					{animation:{comb:[0, 24, "comb", frameSpeed]}, name:'comb', width:185, regX:98, regY:90, height:170, count:25, image:'assets/animations/comb.png', id:'pukiComb', interact:true},
					{animation:{combplay:[0, 12, "combplay", frameSpeed]}, name:'combplay', width:185, regX:98, regY:90, height:170, count:13, image:'assets/animations/combplay.png', id:'pukiCombplay', interact:true},
					{animation:{combcomplete:[0, 16, "combcomplete", frameSpeed]}, name:'combcomplete', width:185, regX:98, regY:90, height:170, count:17, image:'assets/animations/combcomplete.png', id:'pukiCombComplete', interact:false},
					{animation:{scare:[0, 31, "scare", frameSpeed]}, name:'scare', width:180, regX:86, regY:85, height:165, count:32, image:'assets/animations/scare.png', id:'pukiScare', interact:true},
					{animation:{eat:[0, 12, "eat", frameSpeed]}, name:'eat', width:178, regX:86, regY:85, height:160, count:13, image:'assets/animations/eat.png', id:'pukiEat', interact:false},
					{animation:{eatcomplete:[0, 14, "eatcomplete", frameSpeed]}, name:'eatcomplete', width:178, regX:86, regY:85, height:160, count:15, image:'assets/animations/eatcomplete.png', id:'pukiEatComplete', interact:false},
					{animation:{chili:[0, 19, "chili", frameSpeed]}, name:'chili', width:260, regX:104, regY:112, height:200, count:20, image:'assets/animations/chili.png', id:'pukiChili', interact:false},
					{animation:{chilirun:[0, 12, "chilirun", frameSpeed]}, name:'chilirun', width:172, regX:86, regY:90, height:165, count:13, image:'assets/animations/chilirun.png', id:'pukiChiliRun', interact:false},
					{animation:{emo:[0, 12, "emostop", frameSpeed],
								emostop:[13, 24, "emostop", frameSpeed]}, name:'emo', width:174, regX:86, regY:85, height:160, count:25, image:'assets/animations/emo.png', id:'pukiEmo', interact:false},
					{animation:{sick:[0, 9, "sickreplay", frameSpeed],
								sickreplay:[10, 23, "sickreplay", frameSpeed]}, name:'sick', regX:86, regY:85, width:174, height:170, count:24, image:'assets/animations/sleep.png', id:'pukiSick', interact:true},
					{animation:{emocomplete:[0, 7, "emocomplete", frameSpeed]}, name:'emocomplete', width:174, regX:86, regY:85, height:160, count:8, image:'assets/animations/emocomplete.png', id:'pukiEmoComplete', interact:false},
					{animation:{dead:[0, 8, "deadcomplete", frameSpeed],
								deadcomplete:[8]}, name:'dead', width:174, regX:87, regY:85, height:165, count:9, image:'assets/animations/dead.png', id:'pukiDead', interact:false}];
								
								
var runSpeed= 6; //run speed
var runDistance = 200; //distance to start run
var walkSpeed = 2; //walk speed
var walkDistance = 100; //distance to start walk
var jumpDistanceX = 150; //distance x to start jump
var jumpDistanceY = 350; //distance y to start jump
var wakeupDistance = 50; //distance to wake up

var eatDefaultTime = 100; //timer for eating
var sleepDefaultTime = 300; //timer to sleep when idle
var sitDefaultTime = 150; //timer to sit when idle

var normalDefaultTime = 1500; //timer to start auto action while no interaction
var abnormalDefaultTime = 300; //timer to start auto sick or sad action while the meter is unfulfill

//auto AI Puki animation list
var action_arr=[{time:50, type:'normal', action:'static'},
				{time:100, type:'normal', action:'static'},
				{time:50, type:'normal', action:'static'},
				{time:200, type:'normal', action:'static'},
				{time:100, type:'normal', action:'static'},
				{time:80, type:'normal', action:'static'},
				{time:2000, type:'normal', action:'static'},
				{time:100, type:'health', action:'static'},
				{time:120, type:'health', action:'static'},
				{time:150, type:'health', action:'static'},
				{time:300, type:'health', action:'sick'},
				{time:120, type:'fun', action:'static'},
				{time:130, type:'fun', action:'static'},
				{time:300, type:'fun', action:'emo'}];
/*!
 * 
 * PUKI SETTING END
 * 
 */
var pukiStatusTimer = null;
var cursorX = 0;
var cursorY = 0;
var pukiInteract = true;

var pukiAction = null;
var curItem = null;
var foodSelected = null;
var toySelected = null;
var curItemAnimation = null;
var curFoodAnimation = null;
var curToyAnimation = null;

var puki_arr = {x:0, y:0, rotation:0, scaleX:0, oldX:0, oldY:0};
var move_arr = {x:0, y:0, rotation:0};

var pukiRunActive = false;
var pukiWalkActive = false;
var pukiSitActive = false;

var pukiActive_arr = {runActive:false, walkActive:false, sitActive:false};
var statusActive_arr = {runActive:false, walkActive:false, sitActive:false};

var pukiGravity = 5;
var pukiDrag = .9;
var pukiBounce = .2;

var pukiWidth = 0;
var pukiHeight = 0;

var pukiYSpeed = 0;
var pukiXSpeed = 0;

var curAnimate = '';
var curPukiAnimation = null;

var pukiDragging = false;
var eating = false;
var pukiGravityActive = false;

var updateSingleStatTimer = 0;


var animateBall = false;
var animateNoodle = false;
var trace_arr = {x:0, y:0, rotation:0};
var tracedrag_arr = {x:0, y:0, rotation:0};

var ballDistance = 60;
var extraDistance = 0;
var walkCalculate= 0;

var autoAction=false;
var pukiHealthMeter, pukiHappyMeter, pukiXPEarn;
var autoAIDefaultTime = normalDefaultTime;
var autoAIStartTime = 0;
var eatStartTime = eatDefaultTime;
var sleepStartTime = sleepDefaultTime;
var sickStartTime = 0;
var emoStartTime = 0;
var spicyStartTime = spicyDefaultTime;
var spicyRunSide = 0;

var easeSpeed = 5;
var easeSpeedSpace = 200;
var endX = 0;

var checkOnGround = false;

/*!
 * 
 * PUKI ACTION LOOP - This is the function that runs to loop puki action
 * 
 */
 
function updatePukiAction(){
	//follow mouse
	if(!autoAction){
		if(curItem!=null){
			if(foodSelected != null){
				move_arr.x = foodSelected.x;
				move_arr.y = foodSelected.y;
			}else{
				if(curAnimate == 'spacesuit'){
					move_arr.x = cursorX;
					move_arr.y = cursorY;
				}else{
					move_arr.x = curItem.x;
					move_arr.y = curItem.y;
				}
			}
		}else{
			move_arr.x = cursorX;
			move_arr.y = cursorY;
			
		}
	}
	
	switch (pukiAction){
		case "run":
			animatePuki("run");
			
			if(puki_arr.x > (move_arr.x + runSpeed)) {
				//run to left
				puki_arr.x -= runSpeed;
				puki_arr.scaleX = -1;
			}else if(puki_arr.x < (move_arr.x - runSpeed)) {
				//run to right
				puki_arr.x += runSpeed;
				puki_arr.scaleX = 1;
			} else {
				//change to static
				puki_arr.x = move_arr.x;
				pukiAction = "static";
			}
			
			//change to jump
			if(puki_arr.x - move_arr.x < jumpDistanceX && puki_arr.x - move_arr.x > 0 - jumpDistanceX) {
				if(move_arr.y < jumpDistanceY) {
					pukiAction = "jump";
				}
			}
			
			//reset idle time
			sleepStartTime = sleepDefaultTime;
			break;
			
		case "jump":
			animatePuki("jump");
			
			if(puki_arr.scaleX == -1) {
				//jump to left
				puki_arr.x -= runSpeed;
			}else{
				//jump to right
				puki_arr.x += runSpeed;
			}
			
			if(checkAnimationComplete()){
				//change to run
				callNextPukiAction('run');
			}
			break;
			
		case "static":
			if(!pukiInteract){
				pukiInteract=true;	
			}
			
			if(puki_arr.x > (move_arr.x + walkCalculate)) {
				if(pukiRunActive){
					pukiAction = 'run';
				}
				//walk left
				walkCalculate = 3 + extraDistance;
				animatePuki("walk");
				puki_arr.x -= walkSpeed;
				puki_arr.scaleX = -1;
			} else if(puki_arr.x < (move_arr.x - walkCalculate)) {
				if(pukiRunActive){
					pukiAction = 'run';
				}
				//walk right
				walkCalculate = 3 + extraDistance;
				animatePuki("walk");
				puki_arr.x += walkSpeed;
				puki_arr.scaleX = 1;
			} else {
				if(walkCalculate == 3) {
					//if still walking, expand walk distance
					puki_arr.x = move_arr.x;
					walkCalculate = walkDistance;
					sleepStartTime = sleepDefaultTime;
				}
				if(sleepStartTime > 0) {
					sleepStartTime--;
					if(sleepStartTime < sitDefaultTime) {
						animatePuki("sit");
					} else {
						animatePuki("static");
					}
				} else {
					if(!pukiSitActive){
						pukiAction='sleep';
					}else{
						animatePuki("sit");
					}
				}
			}
			
			//change to run if long distance
			if(!pukiWalkActive){
				if(puki_arr.x > (move_arr.x + runDistance)) {
					pukiAction = "run";
				} else if(puki_arr.x < (move_arr.x - runDistance)) {
					pukiAction = "run";
				}
			}
			break;
			
		case 'sleep':
			animatePuki("sleep");
			//playSoundLoop('soundSnork');
			
			var awake=false;
			if(puki_arr.x > (move_arr.x + wakeupDistance)) {
				awake=true;
			}else if(puki_arr.x < (move_arr.x - wakeupDistance)) {
				awake=true;
			}
			if(awake){
				//stopSoundLoop('soundSnork');
				pukiAction='awake';
			}
			break;
			
		case 'awake':
			animatePuki("awake");
			if(checkAnimationComplete()){
				sleepStartTime = sleepDefaultTime;
				callNextPukiAction('static');
			}
			break;
			
		case 'grab':
			pukiInteract = false;
			grabBall = false;
			if(puki_arr.scaleX == -1) {
				toySelected.x = puki_arr.x - ballDistance;
			} else {
				toySelected.x = puki_arr.x + ballDistance;
			}
			
			if(!animateBall){
				animatePuki("grab");
				animateBall=true;
				toySelected.y = objGround - (toySelected.image.naturalHeight/2);
				$(toySelected).stop(true, false)
				.animate({x:toySelected.x}, 400)
				.animate({y:objGround-70}, 300);
			}
			
			if(animateBall){
				if(checkAnimationComplete()){
					increasePukiStatus(toySelected.health, toySelected.fun, toySelected.xp);
					
					pukiInteract = true;
					animateBall=false;
					sleepStartTime = sleepDefaultTime;
					toySelected.dragging = false;
					callNextPukiAction('static');
				}
			}
			break;
			
		case 'bubble':
			//pukiInteract = false;
			animatePuki("bubble");
			break;
			
		case 'eat':
			//toggleCursor(true);
			
			eating = true;
			pukiInteract = false;
			foodSelected.visible=false;
			
			if(foodSelected.name == 'noodle'){
				playSoundOnce('soundSluping');
				
				foodSelected.visible=true;
				foodSelected.alpha=0;
				pukiAction = "noodle";
				animateNoodle=false;
			}else{
				playSoundOnce('soundEat');
				if(eatStartTime > 0){
					eatStartTime--;
				}else{
					playSound('soundEatComplete');
					animatePuki("eatcomplete");
					pukiAction = 'eatcomplete';
				}
			}
			
			break;
			
		case 'eatcomplete':			
			if(checkAnimationComplete()){
				if(foodSelected!=null && foodSelected.name == 'chili'){
					spicyStartTime = spicyDefaultTime;
					playSoundOnce('soundBoom');
					pukiAction = "chili";
				}else{
					increasePukiStatus(foodSelected.health, foodSelected.fun, foodSelected.xp);
					restoreObject(foodSelected);
					eating = false;
					pukiInteract = true;
					pukiAction = "static";
				}
			}
			
			break;
			
		case 'chili':
			animatePuki("chili");
			
			if(checkAnimationComplete()){
				playSoundLoop('soundChiliRun');
				pukiAction = "chilirun";
			}
			break;
			
		case 'chilirun':
			animatePuki("chilirun");
			
			if(spicyStartTime > 0) {
				spicyStartTime --;
				
				if(spicyRunSide > 0) {
					spicyRunSide --;
					
					if(puki_arr.scaleX == -1) {
						puki_arr.x -= spicyRunSpeed;
					} else {
						puki_arr.x += spicyRunSpeed;
					}
				} else {
					if(puki_arr.scaleX == -1) {
						puki_arr.scaleX = 1;
					} else {
						puki_arr.scaleX = -1;
					}
					spicyRunSide = Math.round(Math.random()*20) + spicyRunSideDefaultTime;
				}
			} else {
				stopSoundLoop('soundChiliRun');
				increasePukiStatus(foodSelected.health, foodSelected.fun, foodSelected.xp);
				restoreObject(foodSelected);
				eating = false;
				pukiInteract = true;
				pukiAction = "static";
			}
			break;
			
		case 'noodle':
			foodSelected.selected = false;
			
			if(!animateNoodle){
				animateNoodle=true;
				
				if(puki_arr.scaleX == 1){
					foodSelected.x = puki_arr.x + 100;
				}else{
					foodSelected.x = puki_arr.x - 100;
				}
				foodSelected.scaleX = puki_arr.scaleX;
				foodSelected.y = objGround - 100;
				foodSelected.rotation = 0;
				
				$(foodSelected).stop(true, false)
				.animate({y:objGround - ((foodSelected.image.naturalHeight/2)+45)}, 300, function(){
					playSound('soundBowlDrop');
					pukiAction = 'noodlefinishing';
				});
			}
			break;
			
		case 'noodlefinishing':
			animateFood('noodlefinishing');
			if(curFoodAnimation.currentAnimation != curFoodAnimate){
				increasePukiStatus(foodSelected.health, foodSelected.fun, foodSelected.xp);
				pukiAction = 'pushnoodle';
			}
			break;
		
		case 'pushnoodle':
			animatePuki("walk");
			playSoundLoop('soundBowlPush');
			
			if(puki_arr.scaleX == -1) {
				puki_arr.x -= walkSpeed;
				foodSelected.x -= walkSpeed;
			} else {
				puki_arr.x += walkSpeed;
				foodSelected.x += walkSpeed;
			}
			
			if(puki_arr.x > canvasW + 50 || puki_arr.x < -50) {
				stopSoundLoop('soundBowlPush');
				animateFood('noodle');
				restoreObject(foodSelected);
				eating = false;
				pukiAction = "static";
			}
			break;
			
		case 'rubberduck':
			animatePuki("rubberduck");
			
			if(duckMoveStartTime > 0){
				duckMoveStartTime--;
			}else{
				if(puki_arr.scaleX == 1) {
					puki_arr.x += duckMoveSpeed;
					toySelected.x += duckMoveSpeed;
				} else {
					puki_arr.x -= duckMoveSpeed;
					toySelected.x -= duckMoveSpeed;
				}
				
				if(puki_arr.x > canvasW-150) {
					puki_arr.scaleX = toySelected.scaleX = -1;
					toySelected.x = puki_arr.x - 80;
				} else if(puki_arr.x < 150) {
					puki_arr.scaleX = toySelected.scaleX = 1;
					toySelected.x = puki_arr.x + 80;
				}
				duckMoveStartTime = duckMoveDefaultTime;
			}
			
			/*duckMoveStartTime++;
			if(duckMoveStartTime > duckMoveDefaultTime) {
				if(puki_arr.scaleX == 1) {
					puki_arr.x += duckMoveSpeed;
					toySelected.x += duckMoveSpeed;
				} else {
					puki_arr.x -= duckMoveSpeed;
					toySelected.x -= duckMoveSpeed;
				}
				
				if(puki_arr.x > canvasW-150) {
					puki_arr.scaleX = toySelected.scaleX = -1;
					toySelected.x = puki_arr.x - 80;
				} else if(puki_arr.x < 150) {
					puki_arr.scaleX = toySelected.scaleX = 1;
					toySelected.x = puki_arr.x + 80;
				}
				duckMoveStartTime = 0;
			}*/
			
			if(updateSingleStatTimer > 0) {
				updateSingleStatTimer--;
			}else{
				updateSingleStatTimer = updateDuckDefaultTimer;
				increasePukiStatus(toySelected.health, toySelected.fun, toySelected.xp);
			}
			break;
			
		case 'air':
			if(!pukiInteract){
				pukiInteract=true;	
			}
			
			if(puki_arr.x > puki_arr.oldx) {
				puki_arr.scaleX = 1;
			}else if(puki_arr.x < puki_arr.oldx) {
				puki_arr.scaleX = -1;
			}
			
			if(curItem != null && curItem.name == 'spacesuit'){				
				animatePuki("spacesuit");
				if(updateSingleStatTimer > 0) {
					updateSingleStatTimer--;
				}else{
					updateSingleStatTimer = updateSpaceDefaultTimer;
					increasePukiStatus(toySelected.health, toySelected.fun, toySelected.xp);
				}	
			}else{
				animatePuki("air");
			}
			sleepStartTime = sleepDefaultTime;
			break;
		
		case 'sick':
			playSoundOnce('soundSick');
			animatePuki("sick");
			break;
			
		case 'emo':
			playSoundOnce('soundEmo');
			animatePuki("emo");
			if(emoStartTime>0){
				emoStartTime--;
			}else{
				pukiAction = 'emocomplete';
			}
			break;
			
		case 'emocomplete':
			animatePuki("emocomplete");
			
			if(checkAnimationComplete()){
				callNextPukiAction('static');
			}
			break;
			
		case 'comb':
			pukiInteract=false;
			animatePuki("comb");
			playSoundLoop('soundHairbrush');
			
			if(checkAnimationComplete()){
				pukiAction = 'combplay';
			}
			break;
			
		case 'combplay':
			pukiInteract=false;
			animatePuki("combplay");
			
			if(updateSingleStatTimer > 0) {
				updateSingleStatTimer--;
			}else{
				updateSingleStatTimer = updateCombDefaultTimer;
				increasePukiStatus(toySelected.health, toySelected.fun, toySelected.xp);
			}
			break;
			
		case 'combcomplete':
			animatePuki("combcomplete");
			stopSoundLoop('soundHairbrush');
			
			if(checkAnimationComplete()){
				callNextPukiAction('static');
			}
			break;
			
		case 'scare':
			pukiInteract=false;
			animatePuki("scare");
			
			if(checkAnimationComplete()){
				increasePukiStatus(toySelected.health, toySelected.fun, toySelected.xp);
				pukiAction = 'static';
				animatePuki("sit");
			}
			break;
			
		case 'dead':
			animatePuki("dead");
			autoAction=true;
			stopGame();
			
			setTimeout(function() {
				goPop('gameover');
			}, 3000);
			break;
	}
}

/*!
 * 
 * PUKI QUEUE ACTION - This is the function that runs to queue puki next action
 * 
 */
var nextPukiAction = '';
function changePukiAction(act){
	switch(pukiAction){
		case 'jump':
			pukiInteract=false;
			nextPukiAction = act;
		break;
		
		case 'emo':
			pukiInteract=false;
			pukiAction='emocomplete';
			nextPukiAction = act;
		break;
		
		case 'comb':
			pukiInteract=false;
			pukiAction='combcomplete';
			nextPukiAction = act;
		break;
		
		case 'combplay':
			pukiInteract=false;
			pukiAction='combcomplete';
			nextPukiAction = act;
		break;
		
		case 'grab':
			nextPukiAction = act;
		break;
		
		case 'sick':
			pukiInteract=false;
			pukiAction='awake';
			nextPukiAction = act;
		break;
		
		case 'air':
			checkOnGround = true;
			nextPukiAction = act;
		break;
		
		default:
			pukiAction = act;		
	}
}

/*!
 * 
 * PUKI NEXT ACTION - This is the function that runs to run puki next action
 * 
 */
function callNextPukiAction(act){
	pukiInteract=true;
	if(nextPukiAction != ''){
		pukiAction = nextPukiAction;
		nextPukiAction='';
	}else{
		pukiAction = act;	
	}
}

/*!
 * 
 * PUKI ACTION EVENT - This is the function that runs to check puki animation complete
 * 
 */
function checkAnimationComplete(){	
	var targetName = '';
	for(n=0;n<animation_arr.length;n++){
		if($.pukiAnimation[animation_arr[n].name].visible){
			targetName = animation_arr[n].name;
		}
	}
	
	var _currentframe = $.pukiAnimation[targetName].currentFrame;
	var _lastframes = $.pukiData[targetName].getAnimation($.pukiAnimation[targetName].currentAnimation).frames;
	_lastframes = _lastframes[_lastframes.length-1];
	
	if(_currentframe == _lastframes){
		return true;	
	}else{
		return false;	
	}
}


/*!
 * 
 * PUKI FRAME LOOP - This is the function that runs to loop puki frame
 * 
 */
function updatePukiFrame(){
	if(curPukiAnimation!=null){
		curPukiAnimation.x = puki_arr.x;
		curPukiAnimation.y = puki_arr.y;
		curPukiAnimation.scaleX = puki_arr.scaleX;
		curPukiAnimation.rotation = puki_arr.rotation;
	}
	
	pukiShadow.x = puki_arr.x;
	pukiShadow.y = objGround - 10;
	pukiShadow.scaleX = pukiShadow.scaleY = puki_arr.y/objGround * 1;
	
	if(pukiGravityActive) {
		var pmouseSpeed = trace_arr.x - cursorX;
		
		if (!pukiDragging) {
			trace_arr.rotation = 0 - Math.round(pmouseSpeed/100 * 10);
			endX = cursorX;
			trace_arr.x += (endX - trace_arr.x)/30;
			
			if(curAnimate == "bubble") {
				if(bubbleRotateSide == 0) {
					puki_arr.rotation -= 0.2;
				} else {
					puki_arr.rotation += 0.2;
				}
			} else {
				//endX = cursorX;
				//var mouseSpeed = trace_arr.x - cursorX;
				//trace_arr.x += (endX - trace_arr.x)/100;
				//trace_arr.rotation = 0 - Math.round(mouseSpeed/100 * 10);
				puki_arr.rotation = trace_arr.rotation;
			}
			
			puki_arr.oldx = puki_arr.x;
			puki_arr.oldy = puki_arr.y;
			
			//calculate new x and y position
			if(curAnimate == "spacesuit") {
				if(Math.round(pukiXSpeed) >= 0 && Math.round(pukiXSpeed) < 1){
					puki_arr.x += (cursorX - puki_arr.x)/easeSpeedSpace;
				}else{
					puki_arr.x = puki_arr.x + pukiXSpeed;
				}
				
				if(Math.round(pukiYSpeed) >= 0 && Math.round(pukiYSpeed) < 1){
					puki_arr.y += (cursorY - puki_arr.y)/easeSpeedSpace;
				}else{
					puki_arr.y = puki_arr.y + pukiYSpeed;
				}
			}else{
				puki_arr.y = puki_arr.y + pukiYSpeed;
				puki_arr.x = puki_arr.x + pukiXSpeed;
			}
			
			//bounce off the bottom of stage and reverse yrunSpeed
			if (puki_arr.y + pukiHeight / 2 > pukiGround) {
				puki_arr.y = pukiGround - pukiHeight / 2;
				pukiYSpeed = -pukiYSpeed * pukiBounce;
				
				if(curItem == null){
					pukiGravityActive = false;
					puki_arr.rotation = 0;
					pukiAction = "static";
					playSound('soundDrop');
				}else if(pukiXSpeed < 2 && curItem.name != 'spacesuit') {
					pukiGravityActive = false;
					puki_arr.rotation = 0;
					pukiAction = "static";
					playSound('soundDrop');
				}
				
				if(checkOnGround){
					checkOnGround=false;
					callNextPukiAction('static');	
				}
			}
			
			//bounce off the top of stage and reverse yrunSpeed
			if (puki_arr.y - pukiHeight / 2 < 0) {
				puki_arr.y = pukiHeight / 2;
				pukiYSpeed = -pukiYSpeed * pukiBounce;
				
				if(curAnimate == "bubble") {
					popBubble();
				}
			}
			
			//bounce off right of stage 
			if (puki_arr.x + pukiWidth / 2 > canvasW) {
				puki_arr.x = canvasW - pukiWidth / 2;
				pukiXSpeed = -pukiXSpeed * pukiBounce;
			}
			//bounce off left of stage  
			if (puki_arr.x - pukiWidth / 2 < 0) {
				puki_arr.x = pukiWidth / 2;
				pukiXSpeed = -pukiXSpeed * pukiBounce;
			}
			//recalculate x and y runSpeeds figuring in drag (friction) and gravity for y  
			pukiYSpeed = pukiYSpeed * pukiDrag + pukiGravity;
			pukiXSpeed = pukiXSpeed * pukiDrag;
		} else {
			trace_arr.rotation = 0 - Math.round(pmouseSpeed/100 * 30);
			endX = cursorX;
			trace_arr.x += (endX - trace_arr.x)/easeSpeed;
			puki_arr.rotation = 0 + trace_arr.rotation
		
			//if dragging then calculate new runSpeeds according to dragging movement and runSpeed 
			pukiXSpeed = puki_arr.x - puki_arr.oldx;
			pukiYSpeed = puki_arr.y - puki_arr.oldy;
			puki_arr.oldx = puki_arr.x;
			puki_arr.oldy = puki_arr.y;
		}
	}	
}


/*!
 * 
 * PUKI ANIMATE - This is the function that runs to animate puki
 * 
 */
function animatePuki(frame){
	if(curAnimate!=frame){
		if(frame == 'scare'){
			playSound('soundScare');
		}else if(frame == 'jump'){
			playSound('soundJump');	
		}
		
		if(frame == 'spacesuit'){
			playSoundLoop('soundSpacesuit');
		}else{
			stopSoundLoop('soundSpacesuit');	
		}
		
		if(frame == 'run'){
			playSoundLoop('soundRun');
		}else{
			stopSoundLoop('soundRun');
		}
		
		if(frame == 'walk'){
			playSoundLoop('soundWalk');
		}else{
			stopSoundLoop('soundWalk');
		}
		
		if(frame == 'sleep'){
			playSoundLoop('soundSnork');
		}else{
			stopSoundLoop('soundSnork');
		}
		curAnimate = frame;
		
		for(n=0;n<animation_arr.length;n++){
			$.pukiAnimation[animation_arr[n].name].visible=false;
		}
		
		curPukiAnimation = $.pukiAnimation[frame];
		curPukiAnimation.visible=true;
		curPukiAnimation.x = puki_arr.x;
		curPukiAnimation.y = puki_arr.y;
		curPukiAnimation.scaleX = puki_arr.scaleX;
		curPukiAnimation.rotation = puki_arr.rotation;
		curPukiAnimation.gotoAndPlay(frame);
	}
}

/*!
 * 
 * PUKI EVENTS - This is the function that runs to build puki drag and drop events
 * 
 */
function buildPukiDrag(){	
	for(n=0;n<animation_arr.length;n++){
		if(animation_arr[n].interact){
			var targetAnimate = $.pukiAnimation[animation_arr[n].name];
			targetAnimate.cursor = "pointer";
			targetAnimate.addEventListener("mousedown", function(evt) {
				togglePukiDragEvent(evt, 'drag')
			});
			targetAnimate.addEventListener("pressmove", function(evt) {
				togglePukiDragEvent(evt, 'move')
			});
			targetAnimate.addEventListener("pressup", function(evt) {
				togglePukiDragEvent(evt, 'release')
			});
		}
	}
}

/*!
 * 
 * PUKI EVENTS HANDLE - This is the function that runs to handle puki drag and drop events
 * 
 */
function togglePukiDragEvent(obj, con){
	switch(con){
		case 'drag':
			obj.target.offset = {x:obj.target.x-(obj.stageX / scalePercent), y:obj.target.y- (obj.stageY / scalePercent)};
			
			if(pukiInteract) {
				pukiDragging = true;
				pukiGravityActive = true;
				
				if(pukiAction == "grab") {
					toySelected.dragging = false;
				} else if(pukiAction == "rubberduck") {
					toySelected.alpha = 1;
				}else if(curAnimate == "bubble") {
					pukiDragging = false;
					pukiGravityActive = true;
					
					popBubble();
				}
				pukiAction = "air";
			}
		break;
		
		case 'move':
			if(pukiDragging){
				puki_arr.x = (obj.stageX / scalePercent) + obj.target.offset.x;
				puki_arr.y = (obj.stageY / scalePercent) + obj.target.offset.y;
			}
		break;
		
		case 'release':
			pukiDragging = false;
		break;
	}
}

/*!
 * 
 * PUKI STAT LOOP - This is the function that runs to minus puki stat
 * 
 */
function updatePukiStat(con){
	if(!gamePause && !onMenu){
		user_data.health = pukiHealthMeter;
		user_data.fun = pukiHappyMeter;
		
		pukiHealthMeter -= minusStat;
		pukiHappyMeter -= minusStat;
		
		if(pukiHealthMeter <= warnStatNum || pukiHappyMeter <= warnStatNum){
			if(con){
				playSound('soundAlert');	
			}
			statusActive_arr.walkActive = true;
			autoAIDefaultTime = abnormalDefaultTime;
		}else{
			statusActive_arr.walkActive = false;
			autoAIDefaultTime = normalDefaultTime;
		}
		
		updateStatBar();
		checkPukiStat();
		checkPukiDead();
	}
	checkShopXP();
}

function checkPukiDead(){
	if(pukiHealthMeter<=deadStatNum){
		if(curAnimate == 'bubble'){
			playSound('soundBubblePop');
			togglePukiGravity();
			pukiAction = "air";
			
			restoreObject(curItem);
			changePukiAction('dead');
		}else if(curAnimate == 'spacesuit'){
			togglePukiGravity();
			pukiAction = "air";
			
			restoreObject(curItem);
			changePukiAction('dead');
		}else{
			pukiAction = 'dead';	
		}
	}
}

/*!
 * 
 * PUKI STAT CHECK - This is the function that runs to check puki stat
 * 
 */
function checkPukiStat(){
	var walkStat = false;
	var runStat = false;
	var sitStat = false;
	
	if(pukiActive_arr.walkActive || statusActive_arr.walkActive)
		walkStat=true;
		
	if(pukiActive_arr.runActive || statusActive_arr.runActive)
		runStat=true;
		
	if(pukiActive_arr.sitActive || statusActive_arr.sitActive)
		sitStat=true;
	
	
	pukiRunActive = runStat;
	pukiWalkActive = walkStat;
	pukiSitActive = sitStat;
}

/*!
 * 
 * PUKI STAT INCREASE - This is the function that runs to increase puki stats
 * 
 */
function increasePukiStatus(health, fun, xp){
	pukiHealthMeter += health;
	pukiHappyMeter += fun;
	pukiXPEarn += xp;
	
	pukiHealthMeter = pukiHealthMeter > 100 ? 100 : pukiHealthMeter;
	pukiHappyMeter = pukiHappyMeter > 100 ? 100 : pukiHappyMeter;
	
	user_data.health = pukiHealthMeter;
	user_data.fun = pukiHappyMeter;
	user_data.xp = pukiXPEarn;
	
	updatePukiStat(false);
}

/*!
 * 
 * PUKI AI - This is the function that runs to auto animate puki
 * 
 */
var actionNum = -1;
var actionlist_arr = [];
var performing = false;
var performStartTime = 0;

function startPukiAutoAction(){
	if(curItem==null){
		if(!performing){
			autoAction=true;
			performing=true;
			
			if(actionlist_arr.length==0){
				actionNum=0;
				
				var sickCon = false;
				var emoCon = false;
				for(n=0;n<action_arr.length;n++){
					if(pukiHealthMeter > warnStatNum && pukiHappyMeter > warnStatNum && action_arr[n].type=='normal'){
						actionlist_arr.push(action_arr[n]);
					}
					
					if(pukiHealthMeter <= warnStatNum && action_arr[n].type=='health'){
						actionlist_arr.push(action_arr[n]);
					}
					
					if(pukiHappyMeter <= warnStatNum && action_arr[n].type=='fun'){
						actionlist_arr.push(action_arr[n]);
					}
				}
			}
			
			if(actionlist_arr.length!=0){
				performStartTime = actionlist_arr[actionNum].time;
				if(actionlist_arr[actionNum].action == 'static'){
					move_arr.x = (canvasW/100 * 10);
					move_arr.x += Math.random()*(canvasW/100 * 80);
					move_arr.y = objGround;
				}else if(actionlist_arr[actionNum].action == 'sick'){
					sickStartTime = performStartTime - 100;
				}else if(actionlist_arr[actionNum].action == 'emo'){
					emoStartTime = performStartTime - 100;
				}
				changePukiAction(actionlist_arr[actionNum].action);
				
				actionNum++;
				if(actionNum > actionlist_arr.length-1){
					resetPukiActionList();
				}
			}
		}
	}else{
		autoAIStartTime = 0;
	}
}

/*!
 * 
 * RESET AI IDLE - This is the function that runs to reset AI idle
 * 
 */
function resetPukiAutoIdleAction(){
	resetPukiActionList();
	
	autoAction = false;
	performing = false;
	changePukiAction('static');
	autoAIStartTime = 0;
}

/*!
 * 
 * RESET AI ACTION - This is the function that runs to reset AI action
 * 
 */
function resetPukiAutoAction(){
	autoAction = false;
	performing = false;
}

/*!
 * 
 * RESET AI ACTION LIST - This is the function that runs to reset AI action list
 * 
 */
function resetPukiActionList(){
	actionNum = -1;
	actionlist_arr = [];
}

/*!
 * 
 * AI ACTION LOOP - This is the function that runs to loop AI action
 * 
 */
function updatePukiAutoAction(){
	if(!performing){
		if(autoAIStartTime > autoAIDefaultTime){
			autoAIStartTime = 0;
			startPukiAutoAction();
		}else{
			autoAIStartTime++;
		}
	}else{
		if(performStartTime > 0){
			performStartTime--;
		}else{
			resetPukiAutoAction();
			startPukiAutoAction();
		}
	}
}

function callPuki(){
	playSound('soundWhistle');
	var ignoreCall = false;
	if(autoAction){
		if(pukiHealthMeter <= warnStatNum || pukiHappyMeter <= warnStatNum){
			ignoreCall = true;
		}
		if(!ignoreCall){
			 resetPukiAutoIdleAction();
		}
	}
}