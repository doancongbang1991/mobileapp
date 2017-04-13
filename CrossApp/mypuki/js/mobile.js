////////////////////////////////////////////////////////////
// MOBILE
////////////////////////////////////////////////////////////
var forPortrait=false;

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
		isLandscape=true;
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
		
		if(loaded)
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