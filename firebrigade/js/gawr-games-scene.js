function selectScene(ground, select) { 
	if ( select ) { 
		if ( $("#game ." + ground + ":visible").length > 1 ) { 
			$("#game ." + ground + "").hide();
		} else { 
			$("#game ." + ground).fadeOut("slow");
		}
		$("#game ." + ground + "[data-select=\"" + select + "\"]").fadeIn("slow");
	} else { 
		$("#game ." + ground).show();
	}
}

function switchScene(ground) { 
	var select = parseInt( $("#game ." + ground + ":visible").attr("data-select") );
	var precSelect = select;
	select ++;
	if ( $("#game ." + ground + "[data-select=\"" + select + "\"]").length < 1 ) { 
		select = 1;
	}
	if ( $("#game ." + ground + "[data-select=\"" + select + "\"]").length > 0 && precSelect !== select) { 
		selectScene( ground, select );
	}
}