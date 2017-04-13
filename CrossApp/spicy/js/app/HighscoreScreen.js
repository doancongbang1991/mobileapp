
HighscoreScreen = function()
{
	PIXI.DisplayObjectContainer.call(this);
	
	//this.loading = PIXI.Sprite.fromImage("img/loading.png")
//	this.addChild(	this.loading);
	this.label = new PIXI.Text("hi Mum", {font: "35px Snippet", fill: "white", align: "left"});
	this.addChild(this.label);
	
	//this.label.interactive = true;
	BasicButton.apply(this.label, this.onLoginPressed.bind(this));
	
//	this.loading.anchor.x = this.loading.anchor.y = 0.5;
//	this.loading.position.x = 400;
//	this.loading.position.y = 300;
}

HighscoreScreen.constructor = HighscoreScreen;
HighscoreScreen.prototype = Object.create( PIXI.DisplayObjectContainer.prototype ); 

HighscoreScreen.prototype.onLoginPressed = function()
{
	FacebookAPI.loginAndGetData(this.onLoginSuccess.bind(this));
}

HighscoreScreen.prototype.resize = function(w, h)
{
	this.label.position.x = w/2;
	this.label.position.y = h/2;
}

HighscoreScreen.prototype.onLoginSuccess = function(data)
{
//	console.log("LOGGED IN")
	this.label.setText(data.name);
	console.log(data)
}

