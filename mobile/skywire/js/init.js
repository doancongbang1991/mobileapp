////////////////////////////////////////////////////////////
// INIT
////////////////////////////////////////////////////////////
 var stageWidth,stageHeight=0;
 var isLoaded=false;
 
 /*!
 * 
 * DOCUMENT READY
 * 
 */
 $(function() {
	 $(window).resize(function(){
		resizeLoaderFunc();
	 });
	 resizeLoaderFunc();
	 checkBrowser();
});


/*!
 * 
 * LOADER RESIZE - This is the function that runs to centeralised loader when resize
 * 
 */
 function resizeLoaderFunc(){
	stageWidth=$(window).width();
	stageHeight=$(window).height();
	
	$('#mainLoader').css('left', checkContentWidth($('#mainLoader')));
	$('#mainLoader').css('top', checkContentHeight($('#mainLoader')));
 }

/*!
 * 
 * BROWSER DETECT - This is the function that runs for browser and feature detection
 * 
 */
var browserSupport=false;
var isTablet;
function checkBrowser(){
	isTablet = (/ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase()));
	deviceVer=getDeviceVer();
	
	var canvasEl = document.createElement('canvas');
	if(canvasEl.getContext){ 
	  browserSupport=true;
	}
	
	if($.browser.mobile || isTablet){
		if(window.DeviceOrientationEvent) {
			browserSupport=false;
			window.addEventListener('deviceorientation', onDeviceOrientationLoad);
		}else{
			browserSupport=false;
		}
	}else{
		setTimeout(function() {
			startPage();
		}, 500);
	}
}

/*!
 * 
 * START PAGE - This is the function that runs to start the page
 * 
 */
function startPage(){
	if(browserSupport){
		if(window.DeviceOrientationEvent) {
			window.removeEventListener('deviceorientation', onDeviceOrientationLoad);
		}
		if(!isLoaded){
			isLoaded=true;
			initPreload();
		}
	}else{
		//browser not support
		$('#notSupportHolder').show();
	}
}

/*!
 * 
 * DEVICE ORIENTATION DETECTION - This is the function that runs for mobile orientation detection
 * 
 */
function onDeviceOrientationLoad(event){
	if(event.gamma != null) browserSupport=true;
	startPage();
}