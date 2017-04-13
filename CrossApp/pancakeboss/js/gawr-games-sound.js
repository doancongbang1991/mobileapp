var HEART_SOUND = new buzz.sound([
    "./sound/heart.mp3",
    "./sound/heart.ogg" 
]);
var STEP_SOUND = new buzz.sound([
    "./sound/step.mp3",
    "./sound/step.ogg" 
]);
var TOUCH_SOUND = new buzz.sound([
    "./sound/touch.wav"
]);
var MISS_SOUND = new buzz.sound([
    "./sound/miss.mp3",
    "./sound/miss.ogg" 
]);
var GAMEOVER_SOUND = new buzz.sound([
    "./sound/gameover.mp3",
    "./sound/gameover.ogg" 
]);

var GROUP_SOUND = new buzz.group([ HEART_SOUND, STEP_SOUND, TOUCH_SOUND, MISS_SOUND, GAMEOVER_SOUND ]);

function isAvailableSound() { 
	if ($(".control.sound").text()=="SOUND")
		return false;
	else return true;
}

function loadAllSound() { 
	if (isAvailableSound()) GROUP_SOUND.load();
}

function playHeartSound() { 
	if (isAvailableSound()) HEART_SOUND.play();
}
function playStepSound() { 
	if (isAvailableSound()) STEP_SOUND.play();
}
function playTouchSound() { 
	if (isAvailableSound()) setTimeout('TOUCH_SOUND.play()', 100);
}
function playMissSound() { 
	if (isAvailableSound()) MISS_SOUND.play();
}
function playGameoverSound() { 
	if (isAvailableSound()) GAMEOVER_SOUND.play();
}