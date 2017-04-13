////////////////////////////////////////////////////////////
// GAME
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */
var scoreDisplayText = 'SCORE'; //text for gameplay score
var gameOverText = 'BEST SCORE'; //text for gameplay result
var shareText ='SHARE ON'; //text for share instruction
var gameLife = 3; //total life
var gameScore = 1; //total score when player hit the ball

var gameScoreTarget = 10; //score target to increase game speed, it will multiplied for next speed eg.(10, 30, 60, 120...)
var gameIncreaseSpeed = 5; //total speed to increase when score target reached
var gameExtraBall = 1; //start number of balls drop when score target reached, increase by 1 for next speed
var gameExtraBallMax = 5; //maximum extra balls drop

//Social share, [SCORE] will replace with game score
var shareTitle = 'Highscore on Balance Ball is [SCORE]';//social share score title
var shareMessage = '[SCORE] is mine new highscore on Balance Ball! Try it now!'; //social share score message

/*!
 *
 * GAME BUTTONS CUSTOMIZATION END
 *
 */
var playerSide=true;
var playerAnime='';
var playerJump=0;
var gamePause=true;
var idleMax=10;
var idleCount=0;

var playerData=[{
			playerOldX:0,
			playerNewX:0,
			gameScore:0,
			gameLife:0}];
/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	//main
	btnStart.cursor = "pointer";
	btnStart.addEventListener("mousedown", function(evt) {
		playSound('soundClick',false);
		createGame();
	});
	
	btnReplay.cursor = "pointer";
	btnReplay.addEventListener("mousedown", function(evt) {
		playSound('soundClick',false);
		createGame();
	});
	
	btnBackMain.cursor = "pointer";
	btnBackMain.addEventListener("mousedown", function(evt) {
		playSound('soundClick',false);
		goPage('main');
	});
	
	btnShare.cursor = "pointer";
	btnShare.addEventListener("mousedown", function(evt) {
		toggleShare(true);
	});
	
	btnBack.cursor = "pointer";
	btnBack.addEventListener("mousedown", function(evt) {
		toggleShare(false);
	});
	
	btnFb.cursor = "pointer";
	btnFb.addEventListener("click", function(evt) {
		share('facebook');
	});
	btnTwitter.cursor = "pointer";
	btnTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	btnGoogle.cursor = "pointer";
	btnGoogle.addEventListener("click", function(evt) {
		share('google');
	});
}

function buildInGameButton(){
	stage.addEventListener("mousedown", function(evt) {
		if(!gamePause){
			if(playerJump==0){
				playerJump=1;
				jumpPlayer();
			}else if(playerJump==2){
				jumpPlayer();
			}
		}
	 }); 
	 
	 if(!$.browser.mobile || !isTablet){
		 stage.on("stagemousemove", function(evt) {
			 if(!gamePause){
				movePlayerPosX(gamePlayer.x=evt.stageX/scalePercent);
			}
		});
	 }
 }

/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
function goPage(page){
	gameContainer.visible=false;
	mainContainer.visible=false;
	resultPopContainer.visible=false;	
	bgOverlay.visible=bgPop.visible=false;
	
	switch(page){
		case 'main':
			mainContainer.visible=true;
		break;
		
		case 'game':
			gameContainer.visible=true;
		break;
	}
}

/*!
 * 
 * CREATE GAME - This is the function that runs to create new game
 * 
 */
 function createGame(){
	removeAllBall();
	
	gamePause=true;
	playerJump=0;
	playerData[0].gameScore=0; 
	playerData[0].gameLife=gameLife;
	displayLife();
	
	updateScore(0);
	
	gamePlayer.x=shadowPlayer.x=canvasW/2;
	gamePlayer.y=canvasH/100*playerOriY;
	shadowPlayer.y=canvasH/100*88;
	shadowBall.y=canvasH/100*89;
	scoreDisplayTxt.alpha=0;
	
	curLevelScoreCount=0;
	curLevelBallCount=gameExtraBall;
	curgameScoreTarget=gameScoreTarget;

	
	goPage('game');
	startGame();
 }

/*!
 * 
 * START GAME - This is the function that runs to start play game
 * 
 */
 function startGame(){
	 resetFPS();
	 toggleBox2dWorld(true);
	 gamePause=false;
	 
	 createBall();
 }
 
 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
 function stopGame(){
	  gamePause=true;
	  removeAllBall();
	  toggleBox2dWorld(false);
	  gamePlayer.gotoAndPlay('right');
	  
	  showResult();
 }
 
 /*!
 * 
 * DISPLAY GAME RESULT - This is the function that runs to display game result
 * 
 */
 function showResult(){
	playSound('soundFail',false);
	scorePopTxt.visible=true;
	bgOverlay.visible=bgPop.visible=true;
	resultPopContainer.visible=true;
	
	toggleShare(false);
 }
 
 
 /*!
 * 
 * SHARE OPTION - This is the function that runs to show/display share option
 * 
 */
 function toggleShare(con){
	 btnBack.visible=con;
	 shareTxt.visible=con;
	 btnFb.visible=btnTwitter.visible=btnGoogle.visible=con;
	 btnReplay.visible=btnBackMain.visible=btnShare.visible=true;
	 
	 if(con){
		btnReplay.visible=btnBackMain.visible=btnShare.visible=false; 
	 }
 }

/*!
 * 
 * PLAYER MOVE - This is the function that runs when player move left right
 * 
 */
 function movePlayerPosX(posX){
	 playerData[0].playerNewX=posX;
	 var endLeft=(canvasW/100*10);
	 var endRight=(canvasW/100*90);
	 playerData[0].playerNewX=playerData[0].playerNewX<=endLeft?endLeft:playerData[0].playerNewX;
	 playerData[0].playerNewX=playerData[0].playerNewX>endRight?endRight:playerData[0].playerNewX;
	 gamePlayer.x=playerData[0].playerNewX;
	 shadowPlayer.x=playerData[0].playerNewX;
 }

/*!
 * 
 * CHECK PLAYER ANIMATIONS - This is the function that runs to check player direction and action
 * 
 */ 
 function checkMovePlayerAnimation(){
	 if(playerJump>0){
		 if(playerSide){
			 animatePlayer('jumpright');
		 }else{
			 animatePlayer('jumpleft');
		 }
	 }else{
		if(playerData[0].playerOldX==playerData[0].playerNewX){
			if(idleCount>0){
				idleCount--;	
			}else{
				 if(playerSide){
					 animatePlayer('right');
				 }else{
					 animatePlayer('left');
				 }
			}
		}else if(playerData[0].playerOldX>playerData[0].playerNewX){
			idleCount=idleMax;
			 animatePlayer('leftrun');
			 playerSide=false;
		}else{
			idleCount=idleMax;
			animatePlayer('rightrun');
			playerSide=true; 
		}
	 }
	 playerData[0].playerOldX=playerData[0].playerNewX;
}

/*!
 * 
 * PLAY PLAYER ANIMATIONS - This is the function that runs to play player animation
 * 
 */
function animatePlayer(action){
	if(playerAnime!=action){
		playerAnime=action
		gamePlayer.gotoAndPlay(action)
	}
}

/*!
 * 
 * PLAYER JUMP - This is the function that runs when user clicks the screen
 * 
 */
var playerOriY=75;
function jumpPlayer(){
	var jumpOriY=canvasH/100*playerOriY;
	var jumpY=canvasH/100*(playerOriY-10);
	var jumpExtraY=canvasH/100*(playerOriY-20);
	
	var jumpSpeed=300;
	if(playerJump==1){
		playerJump=2;
		$(gamePlayer)
		.clearQueue()
		.stop()
		.animate({ y:jumpY}, jumpSpeed )
		.animate({ y:jumpOriY}, jumpSpeed, function(){
			playerJump=0;
		});
	}else if(playerJump==2){
		jumpSpeed=200;
		playerJump=3;
		
		$(gamePlayer)
		.clearQueue()
		.stop()
		.animate({ y:jumpExtraY}, jumpSpeed )
		.animate({ y:jumpOriY}, jumpSpeed+jumpSpeed, function(){
			playerJump=0;
		});
	}
}

/*!
 * 
 * BALL COLLISION CHECK - This is the function that runs to check if there is any collision stuck together
 * 
 */
var collisionMax=50;
var collisionDis=5;

var scoreLimit=3;
var scoreMax=10;

function checkBallCollision(){
	for(n=0; n<ballnumber_arr.length; n++){
		var tNumber = ballnumber_arr[n];
		$.ballCollision['ball'+tNumber].bnX=$.ballHolder['ball'+tNumber].x;
		$.ballCollision['ball'+tNumber].bnY=$.ballHolder['ball'+tNumber].y;
		
		if($.ballCollision['ball'+tNumber].cCount>0){
			$.ballCollision['ball'+tNumber].cCount--;	
		}else{
			$.ballCollision['ball'+tNumber].cCount=collisionMax;
			var disX = Math.round(Math.abs($.ballCollision['ball'+tNumber].bnX - $.ballCollision['ball'+tNumber].bX));
			var disY = Math.round(Math.abs($.ballCollision['ball'+tNumber].bnY - $.ballCollision['ball'+tNumber].bY));
			$.ballCollision['ball'+tNumber].bX=$.ballCollision['ball'+tNumber].bnX;
			$.ballCollision['ball'+tNumber].bY=$.ballCollision['ball'+tNumber].bnY;
			
			if($.ballCollision['ball'+tNumber].bnX<=canvasW/100*5||$.ballCollision['ball'+tNumber].bnX>=canvasW/100*95){
				if($.ballCollision['ball'+tNumber].bnY>canvasH/100*60){
					//decreaseLife();
					removeBall(tNumber, true);
				}else{
					if(disX<collisionDis){
						removeBall(tNumber, true);
					}else if(disY<collisionDis){
						removeBall(tNumber, true);
					}
				}
			}
		}
		
		//score
		if($.ballCollision['ball'+tNumber].scoreTime>0){
			$.ballCollision['ball'+tNumber].scoreTime--;
			if($.ballCollision['ball'+tNumber].scoreCount>scoreLimit){
				removeBall(tNumber, true);
			}
		}else{
			$.ballCollision['ball'+tNumber].scoreCount=0;	
		}
		
		//hit floor
		if($.ballHolder['ball'+tNumber].y>canvasH/100*80){
			playSound('soundBallHitFloor',false);
			removeBall(tNumber, false);
			
			if(ballnumber_arr.length==0){
				decreaseLife();
				createBall();
			}
		}
	}
}

/*!
 * 
 * CREATE BALL - This is the function that runs to create new ball
 * 
 */
var ballnumber_arr=[];
var ballTimerCount = 0;

$.ballHolder = {};
$.ballShadowHolder = {};
$.ballCollision = [];
$.ballTimer = {};

function createBall(){
	var tNumber = getBallNumber();
	ballnumber_arr.push(tNumber);
	
	gameContainer.removeChild($.ballHolder['ball'+tNumber]);
	gameContainer.removeChild($.ballShadowHolder['ball'+tNumber]);
	
	$.ballHolder['ball'+tNumber] = gameBall.clone();
	$.ballShadowHolder['ball'+tNumber] = shadowBall.clone();
	$.ballCollision['ball'+tNumber] = {bX:0, bY:0, bnX:0, bnY:0, xCount:0, yCount:0, cCount:0, scoreTime:0, scoreCount:0};
	
	$.ballCollision['ball'+tNumber].cCount=collisionMax;
	$.ballCollision['ball'+tNumber].xCount=0;
	$.ballCollision['ball'+tNumber].yCount=0;
	
	drawBox2dBall(tNumber);
	gameContainer.addChild($.ballHolder['ball'+tNumber]);
	gameContainer.addChild($.ballShadowHolder['ball'+tNumber]);
	
	$.ballCollision['ball'+tNumber].bnX=$.ballCollision['ball'+tNumber].bX=$.ballHolder['ball'+tNumber].x;
	$.ballCollision['ball'+tNumber].bnY=$.ballCollision['ball'+tNumber].bY=$.ballHolder['ball'+tNumber].y;
}

/*!
 * 
 * BALL ID - This is the function that runs to get new ball ID
 * 
 */
function getBallNumber(){
	if(ballnumber_arr.length == 0){
		//if array is empty
		return 0;	
	}else{
		for(n=0; n<ballnumber_arr.length; n++){
			//if number is not use
			if ($.inArray(n, ballnumber_arr) == -1) {
				return n;
			}
		}
		//return new number
		return ballnumber_arr.length;
	}
}

/*!
 * 
 * REMOVE BALL - This is the function that runs to remove ball
 * 
 */
function removeBall(num, con){
	gameContainer.removeChild($.ballHolder['ball'+num]);
	gameContainer.removeChild($.ballShadowHolder['ball'+num]);
	removeBody('soccerBall'+num);
	
	for(n=0; n<ballnumber_arr.length; n++){
		var tNumber = ballnumber_arr[n];
		if(tNumber == num){
			ballnumber_arr.splice(n,1);
		}
	}
	
	if(con)
		createBall();
}

/*!
 * 
 * REMOVE ALL BALLS - This is the function that runs to remove all balls
 * 
 */
function removeAllBall(){
	for(n=0; n<ballnumber_arr.length; n++){
		var tNumber = ballnumber_arr[n];
		gameContainer.removeChild($.ballHolder['ball'+tNumber]);
		gameContainer.removeChild($.ballShadowHolder['ball'+tNumber]);
		removeBody('soccerBall'+tNumber);
	}
	
	ballnumber_arr=[];
	ballTimerCount = 0;
	
	$.ballHolder = {};
	$.ballShadowHolder = {};
	$.ballCollision = [];
	$.ballTimer = {};
}

/*!
 * 
 * GAME LOOP - This is the function that runs for game loop
 * 
 */
function updateGame(){
	if(!gamePause){
		for(n=0; n<ballnumber_arr.length; n++){
			var tNumber = ballnumber_arr[n];
			var _soccerBall=getBox2dData('soccerBall'+tNumber);
			if(_soccerBall!=null){
				$.ballHolder['ball'+tNumber].x=_soccerBall.GetPosition().x*boxScale;
				$.ballHolder['ball'+tNumber].y=_soccerBall.GetPosition().y*boxScale;
				$.ballHolder['ball'+tNumber].rotation=_soccerBall.GetPosition().x*boxScale;
				
				$.ballShadowHolder['ball'+tNumber].x=$.ballHolder['ball'+tNumber].x;
				$.ballShadowHolder['ball'+tNumber].scaleX=$.ballShadowHolder['ball'+tNumber].scaleY=($.ballHolder['ball'+tNumber].y/canvasH)*1;
			}
		}
		checkBallCollision();
		checkMovePlayerAnimation();
		updateBox2dPlayerPos(gamePlayer.x, gamePlayer.y);
	}	
}

/*!
 * 
 * UPDATE SCORE - This is the function that runs to add score
 * 
 */
var curLevelScoreCount=0;
var curgameScoreTarget=0;
function updateScore(score, num){
	playerData[0].gameScore+=score;
	scoreDisplayTxt.text = score;
	scorePopTxt.text = playerData[0].gameScore;
	scoreNumTxt.text = playerData[0].gameScore;
	
	var startX1=canvasH/100*20;
	var startX2=canvasH/100*22;
	
	scoreDisplayTxt.y=startX1;
	scoreDisplayTxt.alpha=0;
	
	if(score!=0){
		$.ballCollision['ball'+num].scoreTime=scoreMax;
		$.ballCollision['ball'+num].scoreCount++;
		
		curLevelScoreCount++;
		console.log(curLevelScoreCount+' '+curgameScoreTarget)
		if(curLevelScoreCount >= curgameScoreTarget){
			updateFPS(gameIncreaseSpeed);
			
			curLevelBallCount++;
			curLevelBallCount=curLevelBallCount>gameExtraBallMax?gameExtraBallMax:curLevelBallCount;
			
			curgameScoreTarget += gameScoreTarget;
			curLevelScoreCount=0;
			
			for(i=1;i<curLevelBallCount;i++){
				$.ballTimer['timer'+ballTimerCount] = setTimeout(createBall, i*1000);
				ballTimerCount++;
			}
		}
	
		$(scoreDisplayTxt)
		.clearQueue()
		.stop()
		.animate({ alpha:1, y:startX1-(canvasH/100*6)}, 500 )
		.animate({ alpha:0}, 500 );
	}
}

/*!
 * 
 * DECREASE LIFE - This is the function that runs to decrease player life
 * 
 */
function decreaseLife(){
	playerData[0].gameLife--;
	displayLife();
	if(playerData[0].gameLife<1){
		stopGame();	
	}
}

/*!
 * 
 * DISPLAY TOTAL LIFE - This is the function that runs to display current total player life
 * 
 */
function displayLife(){
	for(n=1;n<=gameLife;n++){
		if(n<=playerData[0].gameLife){
			this["heartFull"+n].visible=true;
		}else{
			this["heartFull"+n].visible=false;
		}
	}
}

/*!
 * 
 * DEVICE ORIENTATION UPDATE - This is the function that runs update device orientation data
 * 
 */
function updateOrientation(data){
	var oData=Math.round(data);
	if(!gamePause){
		movePlayerPosX((canvasW/2)+(oData/100*canvasW));
	}
}

/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	var title = shareTitle.replace("[SCORE]", playerData[0].gameScore);
	var text = shareMessage.replace("[SCORE]", playerData[0].gameScore);
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}
	
	window.open(shareurl);
}