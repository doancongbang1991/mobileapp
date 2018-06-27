function getRandomNumberTools(max) { 
	return Math.floor((Math.random() * max) + 1);
}

function getReverseStateTools(state) { 
	var reverseState = "";
	if ( state === "on" ) { 
		reverseState = "off";
	} else { 
		reverseState = "on";
	}
	return reverseState;
}