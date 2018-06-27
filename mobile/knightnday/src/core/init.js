window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

window.log = function(a){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
  	console.log(a)
  }
};

global = {}

global.AngleOfTwoDots = function(x1, y1, x2, y2) {
	var dx = x1 - x2;
	var dy = y1 - y2;
	return Math.atan2(dy, dx);
}

global.RadToDeg = function(rad) {
	return rad * 180 / Math.PI;
}

global.Distance = function(x1, y1, x2, y2) {
	var dx = Math.pow(x2 - x1, 2);
	var dy = Math.pow(y2 - y1, 2);
	return Math.sqrt(dx + dy);
}


// ****************************************************
// bagian google webfont
// ****************************************************
global.webFontReadyID = null;
global.addText = function (xx, yy, txt, size, font) {
	// console.log("webfont ready : " + global.webFontReady)
	// body...
	if (font == undefined || font == null) font = "Revalia";
	if (size == undefined || size == null) size = "32";

	var text = null;
	text = game.add.text(xx, yy, txt);
    //text.anchor.setTo(0.5);
    text.font = font;
    text.fontSize = size;

    if (global.webFontReady == false) {
    	//global.webFontReady setInterval()
    }

    return text;
}

// ****************************************************
// bagian atlas/texture handling
// ****************************************************
//global.add = {};
//global.load = {};

global.addAtlas = function(key, subfolder, png, json) {
	if (png == undefined) 
		png = key;

	if (json == undefined)
		json = png;

	if (subfolder != undefined && subfolder != "")
		subfolder = subfolder + "/"
	else if (subfolder == undefined)
		subfolder =""

	game.load.atlas(key, 'assets/'+BasicGame.screen+'/'+subfolder+png+'.png', 'assets/'+BasicGame.screen+'/'+subfolder+json+'.json');
	game.load.json(json, 'assets/'+BasicGame.screen+'/'+subfolder+json+'.json')
}

global.findAtlasBySpriteKey = function(key) {
	var found =false;
	var val = {};
	var jsons = game.cache.getKeys(Phaser.Cache.JSON);
	for (var sKey in jsons) {
   		var arr = game.cache.getJSON(jsons[sKey]).frames;
   		for (var i = 0; i < arr.length; i++) {
   			var p = arr[i];
   			
   			if (p.filename == key) {
   				val.atlasKey = jsons[sKey]
   				val.p = p;
   				//console.log("p " + p.filename + " - key " + key + " | " + jsons[sKey])
   				return val;
   			}
   		};
   	}

   	return null;

}

global.loadTexture = function(sprite, newKey) {	
	var temp = global.findAtlasBySpriteKey(newKey);
	sprite.loadTexture(temp.atlasKey, newKey)
	var ssc = temp.p.spriteSourceSize;
	var dw = ssc.w - ssc.x;
	var dh = ssc.h - ssc.y;

	sprite.atlasName = temp.atlasKey;
	sprite.pivot.x = sprite.tempPivotX - ssc.x;
	sprite.pivot.y = sprite.tempPivotY - ssc.y;	
}

global.addSprite = function(x, y, key) {
	var temp = global.findAtlasBySpriteKey(key);
	if (temp == null) {
		console.log("atlas on global.add.sprite with key |" + key + "| not found on any json files")
	}

	var t = game.add.sprite(x, y, temp.atlasKey);
	t.frameName = key;

	var ssc = temp.p.spriteSourceSize;
	var dw = ssc.w - ssc.x;
	var dh = ssc.h - ssc.y;

	t.atlasName = temp.atlasKey;
	t.tempPivotX = t.pivot.x;
	t.tempPivotY = t.pivot.y;
	t.pivot.x -= ssc.x;
	t.pivot.y -= ssc.y;	
    t.dw = dw;
	t.dh = dh;

	//console.log(t.x + " - " + t.y)

	return t;
}

global.addButton = function(x, y, key, actionOnClick, context) {
	var temp = global.findAtlasBySpriteKey(key);
	if (temp == null) {
		console.log("atlas on global.add.sprite with key |" + key + "| not found on any json files")
	}

	var t = game.add.button(x, y, temp.atlasKey, actionOnClick, context, key, key, key, key);

	var ssc = temp.p.spriteSourceSize;
	var dw = ssc.w - ssc.x;
	var dh = ssc.h - ssc.y;

	t.atlasName = temp.atlasKey;
	t.tempPivotX = t.pivot.x;
	t.tempPivotY = t.pivot.y;
	t.pivot.x -= ssc.x;
	t.pivot.y -= ssc.y;	
    t.dw = dw;
	t.dh = dh;

	//console.log(t.x + " - " + t.y)

	return t;
}


// ****************************************************
// bagian localization
// ****************************************************
global.localization = {};

global.addBitmapText = function (x, y, font, keyString, size) {
	//game.
	game.add.bitmapText(x, y, font, "play", 32);
}

global.switchLanguage= function(newL) {
	global.localization.oldLanguage = global.localization.language;
	global.localization.language = newL;
	global.updateLocalization();
}

global.updateLocalization = function () {
	if (global.localization.language != global.localization.oldLanguage) {
		game.world.forEach(global.localization.updateAllBitmapTexts, game)
	}
}

global.localization.findNewString = function(t) {
	for (var key in global.localization.json[global.localization.oldLanguage]) {
 		 if (global.localization.json[global.localization.oldLanguage][key] == t) {
 		 	if (global.localization.json[global.localization.language][key] == undefined) {
 		 		alert("keyString '" + key + "'' on "+global.localization.language+" is not exist on global.localization.json !")
 		 		return "ERROR";
 		 	}
 		 	return global.localization.json[global.localization.language][key];
 		 } 
	}
	alert("keyString '" + t + "'' on "+global.localization.language+" is not exist on global.localization.json !")
	return "NULL";
}

global.localization.updateAllBitmapTexts = function (t) {
	if (t instanceof Phaser.BitmapText) {
		t.text = global.localization.findNewString(t.text);
	}
}

global.getLocalText = function (keyString) {
	// body...
	keyString = keyString.toLowerCase();
	if (global.localization.json[global.localization.language] == undefined) {
		alert("global.localization.language |"+global.localization.language+"| is not exist on global.localization.json !")
	} else if (global.localization.json[global.localization.language][keyString] == undefined) {
		alert("keyString '" + keyString + "'' on "+global.localization.language+" is not exist on global.localization.json !")
	} else {
		//console.log("JSON LENGTH : " + global.localization.json[global.localization.language].length)
		return global.localization.json[global.localization.language][keyString];
	}
}

global._t = function(keyString)
{
	return global.getLocalText(keyString);
}
// ****************************************************
// bagian responsive
// ****************************************************
global.processScaling = function (argument) {
	// body...
	var device = Phaser.Device;
	//console.log("begin processScaling global deviceWidth/height : " + global.deviceWidth + " - " + global.deviceHeight)
	//BasicGame.screen = "1020";

	//Phaser.Device.desktop = false;
	device.desktop = !mobileAndTabletcheck();
	var wx;
	if (global.landscape == true && device.desktop == false) {
		if (global.deviceHeight > global.deviceWidth ) {
			global.forceReloadFlag = true;
			// document.getElementById('orientation').style.display = 'block';
			var t = global.deviceWidth;
			global.deviceWidth = global.deviceHeight;
			global.deviceHeight = t;
		}

		BasicGame.srx = Math.max(global.deviceWidth,global.deviceHeight);
		BasicGame.sry = Math.min(global.deviceWidth,global.deviceHeight);
		wx = BasicGame.srx;
	} else if (global.landscape == false && device.desktop == false) {

		if (global.deviceWidth > global.deviceHeight && device.desktop == false) {
			global.forceReloadFlag = true;
			// document.getElementById('orientation').style.display = 'block';
			var t = global.deviceHeight;
			global.deviceHeight = global.deviceWidth;
			global.deviceWidth = t;
		} 

		BasicGame.srx = Math.min(global.deviceWidth,global.deviceHeight);
		BasicGame.sry = Math.max(global.deviceWidth,global.deviceHeight);
		wx = BasicGame.sry;
	}
	
	var r = BasicGame.logicWidth/BasicGame.logicHeight;

	//if(wx >= 408){
		/*
	if(wx <= 1019){
		BasicGame.screen = "714";
		if (global.landscape){
			BasicGame.gameWidth = 714;
		} else {
			BasicGame.gameHeight = 714;
		}
		
	} */
		// BasicGame.screen = "1020";
		if (global.landscape){
			BasicGame.gameWidth = 1020;
		} else {
			BasicGame.gameHeight = 1020;
			//console.log("flag a")
		}
	


	if (global.forceWidth) {
		// BasicGame.screen = "1020";
		BasicGame.gameWidth = global.logicWidth;
		BasicGame.gameHeight = global.logicHeight
	}
	
	//If on deskop, we may need to fix the maximum resolution instead of scaling the game to the full monitor resolution
	
    global.simulatedMobileOnDesktop = false;
    
    if(device.desktop && global.simulatedMobile == true){
    	global.simulatedMobileOnDesktop = true;
    } else if(device.desktop && global.simulatedMobile == false && global.forceWidth == false){
    	/*
		BasicGame.screen = "1020";
		if (global.landscape){
			BasicGame.gameWidth = 1020;
		} else {
			BasicGame.gameHeight = 1020;
		}*/
	} 

	if (global.landscape)
		BasicGame.gameHeight = BasicGame.gameWidth/r;
	else
		BasicGame.gameWidth = BasicGame.gameHeight*r;

	/*console.log("@global.processScaling - BasicGame.gameWidth/height : " + BasicGame.gameWidth + " - " + BasicGame.gameHeight 
		+ ", win.inner : " + global.deviceWidth + "-" + global.deviceHeight
	)*/
};

global.cw = function(value){
		return Math.floor(value/BasicGame.logicWidth * BasicGame.gameWidth); 
	};

global.ch = function(value){
	return Math.floor(value/BasicGame.logicHeight * BasicGame.gameHeight);
};

global.init = function() {
	global.left = BasicGame.viewX;
	global.top = BasicGame.viewY;
	global.right = BasicGame.viewRight;
	global.bottom = BasicGame.viewBottom;
	global.centerX = BasicGame.viewX + BasicGame.viewWidth/2;
	global.centerY = BasicGame.viewY + BasicGame.viewHeight/2;
	global.viewWidth = BasicGame.viewWidth;
	global.viewHeight = BasicGame.viewHeight;
}

global.alignLeftPercent = function(obj, percent) {
	// percent = 0% = plg kiri, 100% = plg kanan
	var temp = percent;
	obj.position.x = global.left + Math.floor((global.viewWidth) * (temp / 100));
}

global.alignTopPercent = function(obj, percent) {
	// percent = 0% = plg kiri, 100% = plg kanan
	var temp = percent;
	obj.position.y = global.top + Math.floor((global.viewHeight) * (temp / 100));
}

global.alignLeft = function(obj){
	obj.x = BasicGame.viewX;
};

global.alignTop = function(obj){
	obj.y = BasicGame.viewY;
};

global.alignTopLeft = function(obj){
	global.alignTop(obj);
	global.alignLeft(obj)
};

global.alignTopRight = function(obj){
	global.alignTop(obj);
	global.alignRight(obj)
};

global.alignCenterX = function(obj){
	obj.x = BasicGame.viewX + BasicGame.viewWidth / 2 - obj.width / 2;
};

global.alignCenterY = function(obj){
	obj.y = BasicGame.viewY + BasicGame.viewHeight / 2 - obj.height / 2;
};

global.alignCenter = function (obj) {
	global.alignCenterY(obj)
	global.alignCenterX(obj)
}

global.alignBottomLeft = function(obj){
	global.alignBottom(obj);
	global.alignLeft(obj)
};

global.alignBottomRight = function(obj){
	global.alignBottom(obj);
	global.alignRight(obj)
};

global.alignBottom = function(obj){
	obj.y = BasicGame.viewBottom - obj.height;
};

global.alignRight = function(obj){
	obj.x = BasicGame.viewRight - obj.width;
};

global.setPosX = function(percent) {
	var temp = percent;	
	return Math.floor((BasicGame.gameWidth) * (temp / 100));
}

global.setPosY = function(percent) {
	var temp = percent;
	return Math.floor((BasicGame.gameHeight) * (temp / 100));
}

global.setWordWrap = function(size) {
	return (size*BasicGame.gameWidth/1020);
}

global.setFont = function(size) {
	return (size*BasicGame.gameWidth/1020);
}

global.setSound = function() {
	
}

global.AngleOfTwoDots = function(x1, y1, x2, y2) {
	var dx = x1 - x2;
	var dy = y1 - y2;
	return Math.atan2(dy, dx);
}

global.RadToDeg = function(rad) {
	return rad * 180 / Math.PI;
}

global.findTopPercents=function(percent)
{
	var temp=percent
	var yDum=Math.floor((BasicGame.gameHeight) * (temp / 100));

	return yDum
}

global.findLeftPercents=function(percent)
{
	var temp=percent
	var xDum=Math.floor((BasicGame.gameWidth) * (temp / 100));

	return xDum 
}

global.returnLeftPercents=function(xCord)
{
	var temp=xCord
	var leftPercent=Math.floor(100 * (temp / BasicGame.gameWidth));

	return leftPercent
}

global.returnTopPercents=function(yCord)
{
	var temp=yCord
	var topPercent=Math.floor(100 * (temp / BasicGame.gameHeight));

	return topPercent
}

global.fileComplete = function(progress, cacheKey, success, totalLoaded, totalFiles) {
	// console.log("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles)
    //this.text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
    if (this.loading_hati == null){
        this.loading_hati = game.add.sprite(0,0,'loading_hati'); 
        this.loading_hati.x = BasicGame.viewX + BasicGame.viewWidth/2;;            
        this.loading_hati.y = BasicGame.viewY + BasicGame.viewHeight/2;
        this.loading_hati.anchor.set(0.5);
        game.add.tween(this.loading_hati).to({angle: 360},700, Phaser.Easing.Linear.None, true, 0,100000, false);
    }
};

global.setText1 = function(txt, x, y, size, ax, ay, fill)
{
	var _t = global.addText(x, y, txt + '', size, game_config.font1);
	_t.anchor.setTo(ax, ay);
	_t.fill = fill;
	return _t;
};

global.setText2 = function(txt, x, y, size, ax, ay, fill)
{
	var _t = global.addText(x, y, txt + '', size, game_config.font2);
	_t.anchor.setTo(ax, ay);
	_t.fill = fill;
	return _t;
};
