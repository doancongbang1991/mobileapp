////////////////////////////////////////////////////////////
// CANVAS LOADER
////////////////////////////////////////////////////////////

 /*!
 * 
 * START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
 * 
 */
var loaded = false;
function initPreload(){
	toggleLoader(true);
	
	checkMobileEvent();
	
	$(window).resize(function(){
		resizeGameFunc();
	});
	resizeGameFunc();
	
	loader = new createjs.LoadQueue(false);
	manifest=[{src:'assets/bgMain.jpg', id:'bgMain'},
			{src:'assets/bgGame.jpg', id:'bgGame'},
			{src:'assets/logo.png', id:'logo'},
			{src:'assets/woodTop.png', id:'woodTop'},
			{src:'assets/woodBottom.png', id:'woodBottom'},
			{src:'assets/bubble.png', id:'bubble'},
			{src:'assets/star.png', id:'star'},
			{src:'assets/shadow.png', id:'shadow'},
			{src:'assets/menu/icon_shopnow.png', id:'iconShopnow'},
			{src:'assets/menu/title_collection.png', id:'titleCollection'},
			{src:'assets/menu/title_full.png', id:'titleFull'},
			{src:'assets/menu/title_welcome.png', id:'titleWelcome'},
			{src:'assets/menu/title_howtoplay.png', id:'titleHow'},
			{src:'assets/menu/title_gameover.png', id:'titleGameover'},
			{src:'assets/menu/icon_sound_mute.png', id:'iconSoundMute'},
			{src:'assets/menu/icon_sound.png', id:'iconSound'},
			{src:'assets/menu/icon_sound_mute.png', id:'iconSoundMute'},
			{src:'assets/menu/icon_shop.png', id:'iconShop'},
			{src:'assets/menu/btn_begin.png', id:'btnBegin'},
			{src:'assets/menu/btn_replace.png', id:'btnReplace'},
			{src:'assets/menu/btn_ok.png', id:'btnOk'},
			{src:'assets/menu/btn_close.png', id:'btnClose'},
			{src:'assets/menu/btn_arrow.png', id:'btnArrow'},
			{src:'assets/menu/btn_buy.png', id:'btnBuy'},
			{src:'assets/menu/btn_buy_disable.png', id:'btnBuyDisable'},
			{src:'assets/menu/btn_cancel.png', id:'btnCancel'},
			{src:'assets/menu/btn_start.png', id:'btnStart'},
			{src:'assets/menu/bgPop.png', id:'bgPop'},
			{src:'assets/menu/bar_fun.png', id:'barFun'},
			{src:'assets/menu/bar_health.png', id:'barHealth'},
			{src:'assets/menu/bar_xp.png', id:'barXP'},
			{src:'assets/menu/how1.png', id:'conHow1'},
			{src:'assets/menu/how2.png', id:'conHow2'},
			{src:'assets/menu/how3.png', id:'conHow3'},
			{src:'assets/menu/how4.png', id:'conHow4'},
			{src:'assets/menu/dead.png', id:'conDead'}];
	
	for(n=0;n<animation_arr.length;n++){
		manifest.push({src:animation_arr[n].image, id:animation_arr[n].id});
	}
	
	for(n=0;n<animationItem_arr.length;n++){
		manifest.push({src:animationItem_arr[n].image, id:animationItem_arr[n].id});
	}
	
	for(n=0;n<items_arr.length;n++){
		manifest.push({src:items_arr[n].icon, id:'icon'+items_arr[n].name});
		if(items_arr[n].obj!=''){
			manifest.push({src:items_arr[n].item, id:'obj'+items_arr[n].name});
		}
	}
	
	soundOn = true;		
	if($.browser.mobile || isTablet){
		if(!enableMobileSound){
			soundOn=false;
		}
	}
	
	if(soundOn){
		manifest.push({src:'assets/sounds/ball.ogg', id:'soundBall'})
		manifest.push({src:'assets/sounds/bubble.ogg', id:'soundBubble'})
		manifest.push({src:'assets/sounds/bubblepop.ogg', id:'soundBubblePop'})
		manifest.push({src:'assets/sounds/rubberduck.ogg', id:'soundDuck'})
		manifest.push({src:'assets/sounds/rubberduckloop.ogg', id:'soundDuckLoop'})
		manifest.push({src:'assets/sounds/catdrop.ogg', id:'soundCat'})
		manifest.push({src:'assets/sounds/catshake.ogg', id:'soundCatShake'})
		manifest.push({src:'assets/sounds/bowlslide.ogg', id:'soundBowlPush'})
		manifest.push({src:'assets/sounds/bowldrop.ogg', id:'soundBowlDrop'})
		manifest.push({src:'assets/sounds/jump.ogg', id:'soundJump'})
		manifest.push({src:'assets/sounds/scare.ogg', id:'soundScare'})
		manifest.push({src:'assets/sounds/eat.ogg', id:'soundEat'})
		manifest.push({src:'assets/sounds/eatcomplete.ogg', id:'soundEatComplete'})
		manifest.push({src:'assets/sounds/hairbrush.ogg', id:'soundHairbrush'})
		manifest.push({src:'assets/sounds/sluping.ogg', id:'soundSluping'})
		manifest.push({src:'assets/sounds/spacesuit.ogg', id:'soundSpacesuit'})
		manifest.push({src:'assets/sounds/step.ogg', id:'soundRun'})
		manifest.push({src:'assets/sounds/walk.ogg', id:'soundWalk'})
		manifest.push({src:'assets/sounds/snork.ogg', id:'soundSnork'})
		manifest.push({src:'assets/sounds/boom.ogg', id:'soundBoom'})
		manifest.push({src:'assets/sounds/chiliscare.ogg', id:'soundChiliRun'})
		manifest.push({src:'assets/sounds/buy.ogg', id:'soundBuy'})
		manifest.push({src:'assets/sounds/button.ogg', id:'soundButton'})
		manifest.push({src:'assets/sounds/iconSelect.ogg', id:'soundSelect'})
		manifest.push({src:'assets/sounds/iconDrop.ogg', id:'soundDrop'})
		manifest.push({src:'assets/sounds/whistle.ogg', id:'soundWhistle'})
		manifest.push({src:'assets/sounds/sick.ogg', id:'soundSick'})
		manifest.push({src:'assets/sounds/emo.ogg', id:'soundEmo'})
		manifest.push({src:'assets/sounds/musicGame.ogg', id:'musicGame'})
		manifest.push({src:'assets/sounds/musicMain.ogg', id:'musicMain'})
		manifest.push({src:'assets/sounds/drop.ogg', id:'soundDrop'})
		manifest.push({src:'assets/sounds/bell.ogg', id:'soundBell'})
		manifest.push({src:'assets/sounds/alert.ogg', id:'soundAlert'})
		
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
	$('.percentIndicator').css('width',Math.round(loader.progress/1*98)+'%');
}

/*!
 * 
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 * 
 */
function handleComplete() {
	loaded = true;
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
		$('#loaderHolder').show();
	}else{
		$('#loaderHolder').hide();
	}
}