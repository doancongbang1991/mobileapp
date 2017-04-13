var right_sound = new Audio( 
    "./sound/sfx_box_fish.m4a"
);
var left_sound = new Audio(   
    "./sound/sfx_coin.m4a"
);
var end_sound = new Audio(   
    "./sound/sfx_harpoon.m4a"
);
function playRightSound() { 
	left_sound.play();
}
function playLeftSound() { 
	right_sound.play();
}

function playEndSound() { 
	end_sound.play();
}