////////////////////////////////////////////////////////////
// MOBILE
////////////////////////////////////////////////////////////
var forPortrait=true;

/*!
 * 
 * START MOBILE CHECK - This is the function that runs for mobile event
 * 
 */
function checkMobileEvent(){
	if($.browser.mobile || isTablet){
		$( window ).off('orientationchange').on( "orientationchange", function( event ) {
			$('#canvasHolder').hide();
			$('#rotateHolder').hide();
			
			setTimeout(function() {
				checkMobileOrientation();
			}, 1000);
		});
		
		if (window.DeviceOrientationEvent) {
			window.addEventListener('deviceorientation', onDeviceOrientation);
		}
		checkMobileOrientation();
	}
}

/*!
 * 
 * MOBILE ORIENTATION CHECK - This is the function that runs to check mobile orientation
 * 
 */
function checkMobileOrientation() {
	var o = window.orientation;
	var isLandscape=false;
	
	if(window.innerWidth>window.innerHeight){
		isLandscape=true
	}
	
	var display = false;
	if(!isLandscape){
		//Portrait
		if(forPortrait){
			display=true;
		}
	} else {
		//Landscape
		if(!forPortrait){
			display=true;
		}
	}
	
	if(!display){
		toggleRotate(true);
	}else{
		toggleRotate(false);
		$('#canvasHolder').show();
	}
}

/*!
 * 
 * TOGGLE ROTATE MESSAGE - This is the function that runs to display/hide rotate instruction
 * 
 */
function toggleRotate(con){
	if(con){
		$('#rotateHolder').fadeIn();
	}else{
		$('#rotateHolder').fadeOut();		
	}
}


/*!
 * 
 * MOBILE ORIENTATION DATA - This is the function that runs when device orientation change
 * 
 */
function onDeviceOrientation(event){
	if(event.beta == null || event.gamma == null || event.alpha == null) return;
	updateOrientation(event.gamma);
}