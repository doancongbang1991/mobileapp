////////////////////////////////////////////////////////////
// CANVAS LOADER
////////////////////////////////////////////////////////////

 /*!
 * 
 * START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
 * 
 */
function initPreload(){
	toggleLoader(true);
	
	checkMobileEvent();
	
	$(window).resize(function(){
		resizeGameFunc();
	});
	resizeGameFunc();
	
	loader = new createjs.LoadQueue(false);
	manifest = [{src:'assets/conMain.png', id:'conMain'},
				{src:'assets/btnStart.png', id:'btnStart'},
				
				{src:'assets/bgPop.png', id:'bgPop'},
				
				{src:'assets/btnReplay.png', id:'btnReplay'},
				{src:'assets/btnHome.png', id:'btnBackMain'},
				{src:'assets/btnShare.png', id:'btnShare'},
				{src:'assets/btnBack.png', id:'btnBack'},
				{src:'assets/icon_fb.png', id:'btnFb'},
				{src:'assets/icon_twitter.png', id:'btnTwitter'},
				{src:'assets/icon_google.png', id:'btnGoogle'},
				
				{src:'assets/bgGame.jpg', id:'bgGame'},
				{src:'assets/ball.png', id:'gameBall'},
				{src:'assets/player.png', id:'gamePlayer'},
				{src:'assets/shadowPlayer.png', id:'shadowPlayer'},
				{src:'assets/shadowBall.png', id:'shadowBall'},
				{src:'assets/icon_heartblank.png', id:'heartBlank'},
				{src:'assets/icon_heart.png', id:'heartFull'}
				];
		
	soundOn = true;		
	if($.browser.mobile || isTablet){
		if(!enableMobileSound){
			soundOn=false;
		}
	}
	
	if(soundOn){
		manifest.push({src:'assets/sounds/ball_hit_player.ogg', id:'soundBallHit'})
		manifest.push({src:'assets/sounds/ball_hit_floor.ogg', id:'soundBallHitFloor'})
		manifest.push({src:'assets/sounds/click.ogg', id:'soundClick'})
		manifest.push({src:'assets/sounds/fail.ogg', id:'soundFail'})
		manifest.push({src:'assets/sounds/score.ogg', id:'soundScore'})
		
		createjs.Sound.alternateExtensions = ["mp3"];
		loader.installPlugin(createjs.Sound);
	}
	
	loader.addEventListener("complete", handleComplete);
	loader.addEventListener("fileload", fileComplete);
	loader.addEventListener("error",handleFileError);
	loader.on("progress", handleProgress, this);
	loader.loadManifest(manifest);
}

/*!
 * 
 * CANVAS FILE COMPLETE EVENT - This is the function that runs to update when file loaded complete
 * 
 */
function fileComplete(evt) {
	var item = evt.item;
	console.log("Event Callback file loaded ", evt.item.id);
}

/*!
 * 
 * CANVAS FILE HANDLE EVENT - This is the function that runs to handle file error
 * 
 */
function handleFileError(evt) {
	console.log("error ", evt);
}

/*!
 * 
 * CANVAS PRELOADER UPDATE - This is the function that runs to update preloder progress
 * 
 */
function handleProgress() {
	$('#mainLoader').html(Math.round(loader.progress/1*100));
}

/*!
 * 
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 * 
 */
function handleComplete() {
	toggleLoader(false);
	initMain();
};

/*!
 * 
 * TOGGLE LOADER - This is the function that runs to display/hide loader
 * 
 */
function toggleLoader(con){
	if(con){
		$('#mainLoader').show();
	}else{
		$('#mainLoader').hide();
	}
}