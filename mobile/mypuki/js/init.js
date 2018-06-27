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
	
	if(browserSupport){
		if(!isLoaded){
			isLoaded=true;
			initPreload();
		}
	}else{
		//browser not support
		toggleLoader(false);
		$('#notSupportHolder').show();
	}
}