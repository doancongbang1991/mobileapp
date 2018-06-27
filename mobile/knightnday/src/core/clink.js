clink = {};

clink.create = function(){
	var parentDiv = document.getElementById("main-game");

	var a = document.createElement('a');
	a.setAttribute("id", "more-games");
	var linkText = document.createTextNode("");
	a.appendChild(linkText);
	// a.href = "#";
	a.target = "_blank";
	document.body.appendChild(a);

	a.style.position = "absolute";
	a.style.width = "100px";
	a.style.height = "100px";
	a.style.top = "0px";
	a.style.left = "0px";
	// a.style.background = "black";
	a.style.zIndex = 100000;

	clink.node = a;
	a.onclick = Branding.moreGames;

	clink._iOS9x = (platform.os.family == 'iOS' && parseInt(platform.os.version, 10) >= 9);
	clink.hide();
}

clink.hide = function() {
	if (!clink.node) return;
	clink.node.style.display = "none";
}

clink.show = function() {
	if (!clink.node) return;
	if (!Phaser.Device.desktop && clink._iOS9x==false) return;
	clink.node.style.display = "block";
}

clink.follow = function(obj) {
	if (!Phaser.Device.desktop && clink._iOS9x==false) return;
			// overlay.style.width = (self.btnMore.width * self.gCont.scale.x / game.scale.scaleFactor.x)*0.9 + "px";
			// overlay.style.height = (self.btnMore.height * self.gCont.scale.y / game.scale.scaleFactor.y)*0.9  + "px";
			// overlay.style.left = ((self.btnMore.x-self.btnMore.width*0.45)  * self.gCont.scale.x / game.scale.scaleFactor.x) + self.gCont.x +  game.scale.margin.x  + "px";
			// overlay.style.top = ((self.btnMore.y-self.btnMore.height*0.45)  * self.gCont.scale.y / game.scale.scaleFactor.y) + self.gCont.y +  game.scale.margin.y  + "px";
	var rect = {};
	// rect.width = (obj.width * obj.parent.scale.x / game.scale.scaleFactor.x);
	// rect.height = (obj.height * obj.parent.scale.y /game.scale.scaleFactor.y);
	// rect.x = ((obj.x - obj.width * obj.anchor.x)*obj.parent.scale.x + obj.parent.x)/game.scale.scaleFactor.x + game.scale.margin.x;
	// rect.y = ((obj.y - obj.height * obj.anchor.y)*obj.parent.scale.y + obj.parent.y)/game.scale.scaleFactor.y + game.scale.margin.y;


	rect = obj.getBounds();
	rect.x = rect.x / game.scale.scaleFactor.x + game.scale.offset.x;
	rect.y = rect.y / game.scale.scaleFactor.y + game.scale.offset.y;
	rect.width = rect.width / game.scale.scaleFactor.x;
	rect.height = rect.height / game.scale.scaleFactor.y;
	// trace(JSON.stringify([game.scale.offset,game.scale.margin, game.scale.scaleFactor, rect]));

	clink.node.style.top = rect.y+"px";
	clink.node.style.left = rect.x+"px";
	clink.node.style.width = rect.width+"px";
	clink.node.style.height = rect.height+"px";
}

