////////////////////////////////////////////////////////////
// MAIN
////////////////////////////////////////////////////////////
var stageW=768;
var stageH=1024;

/*!
 * 
 * START BUILD GAME - This is the function that runs build game
 * 
 */
function initMain(){
	if(!$.browser.mobile || !isTablet){
		$('#canvasHolder').show();	
	}
	
	initBox2D(stageW,stageH);
	createBox2DWall();
	drawBox2dPlayer();
	
	initGameCanvas(stageW,stageH);
	buildGameCanvas();
	buildGameButton();
	buildInGameButton();
	
	goPage('main');
	resizeCanvas();
}

var windowW=windowH=0;
var scalePercent=0;

/*!
 * 
 * GAME RESIZE - This is the function that runs to resize and centralize the game
 * 
 */
function resizeGameFunc(){
	setTimeout(function() {
		$('.mobileRotate').css('left', checkContentWidth($('.mobileRotate')));
		$('.mobileRotate').css('top', checkContentHeight($('.mobileRotate')));
		
		windowW = $(window).width();
		windowH = $(window).height();
		
		scalePercent = windowW/stageW;
			
		if((stageH*scalePercent)>windowH){
			scalePercent = windowH/stageH;
		}
		$('#canvasHolder').css('max-width',stageW*scalePercent);
		$('#canvasHolder').css('top',(windowH/2)-((stageH*scalePercent)/2));
		
		var gameCanvas = document.getElementById("gameCanvas");
		gameCanvas.width=stageW*scalePercent;
		gameCanvas.height=stageH*scalePercent;
		resizeCanvas();
	}, 100);	
}