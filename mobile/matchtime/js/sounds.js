var sounds = {};
sounds["button"] = {src:"assets/sounds/button.mp3", delay:0, offset:37, loops:0, volume: 0.9, soundInstance:null};
sounds["down"] = {src:"assets/sounds/down.mp3", delay:0, offset:37, loops:0, volume: 0.8, soundInstance:null};
sounds["fastdown"] = {src:"assets/sounds/fastdown.mp3", delay:0, offset:37, loops:0, volume: 1, soundInstance:null};
sounds["match"] = {src:"assets/sounds/match.mp3", delay:0, offset:37, loops:0, volume: 1, soundInstance:null};
sounds["music"] = {src:"assets/sounds/music.mp3", delay:0, offset:5, loops:-1, volume: 0.2, soundInstance:null};
sounds["turn"] = {src:"assets/sounds/turn.mp3", delay:0, offset:37, loops:0, volume: 0.7, soundInstance:null};
sounds["youlose"] = {src:"assets/sounds/youlose.mp3", delay:0, offset:37, loops:0, volume: 0.8, soundInstance:null};

var patt = new RegExp('Chrome/[.0-9]* Mobile');
//var isChrome = patt.test(navigator.userAgent);
var isChrome = false;
var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

function playSound(id) {
	if (isChrome) {
		return;
	}

	sounds[id].soundInstance = createjs.Sound.play(id, createjs.Sound.INTERRUPT_NONE, sounds[id].delay, sounds[id].offset, sounds[id].loops, sounds[id].volume);
}

function stopSound(id) {
	if (isChrome) {
		return;
	}

	if (sounds[id].soundInstance != null) {
		sounds[id].soundInstance.stop();
	}
}