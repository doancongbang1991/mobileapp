
Leaderboard = function()
{
	PIXI.DisplayObjectContainer.call(this);
	
	this.list = [];
	this.realHeight = 0;
	
	for (var i=0; i < 20; i++) 
	{
	 	var scoreView = new ScoreView(i);
	 //	console.log(scoreView)
	 	this.addChild(scoreView);
	 	scoreView.position.y = i *83  * 0.7;
	 	this.list.push(scoreView)
	};
	
	
}

Leaderboard.constructor = Leaderboard;
Leaderboard.prototype = Object.create( PIXI.DisplayObjectContainer.prototype ); 

Leaderboard.prototype.setData = function(scoreData)
{
	for (var i=0; i < 20; i++) 
	{
		var scoreView = this.list[i];
		scoreView.visible = false;
		scoreView.alpha = 0;
	}
	
	this.realHeight = 0;
	
	for (var i=0; i < scoreData.length; i++) 
	{
		var scoreView = this.list[i];
		scoreView.visible = true;
		scoreView.setScore(scoreData[i]);
		
		this.realHeight += 83 * 0.7;
		
		TweenLite.to(scoreView, 0.3, {alpha:1, delay:i/8})
		//;lable.setText();
	}
	
	// set the user!
	
}

Leaderboard.prototype.resize = function(w, h)
{
}

ScoreView = function(id)
{
	PIXI.DisplayObjectContainer.call(this);
	
	this.maskImage = new Image();
	this.maskImage.crossOrigin = '';
	this.maskImage.src = REMOTE_PATH + "img/maskTest.png";
	
	this.canvas = document.createElement("canvas");
	this.canvas.context = this.canvas.getContext("2d");
	this.canvas.width = 50 * 0.7;
	this.canvas.height = 50 * 0.7;
	
	this.canvasTexture = PIXI.Texture.fromCanvas(this.canvas);
	
	this.image = new Image();
	this.imageSprite = new PIXI.Sprite(this.canvasTexture)//.fromImage("https://graph.facebook.com/513618970/picture?type=large");
	
	this.imageSprite.anchor.x = this.imageSprite.anchor.y = 0.5;
	
	this.addChild(this.imageSprite);
	
	this.labelNumber = new PIXI.Text(id+1 + ".", {font: "23px Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	this.labelName = new PIXI.Text("hi Mum", {font: "21px Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	this.labelScore = new PIXI.Text("hi Mum", {font: "21px Pathway Gothic One", fill: "#4b4b4b", align: "left"});
	
	this.imageSprite.position.x = (80 + 25)  * 0.7;
	this.imageSprite.position.y = (-10 + 25)  * 0.7;
	this.labelName.position.x = 180  * 0.7;
	
	this.labelScore.anchor.x = 1; 
	this.labelScore.position.x = 460 * 0.7;
	
	this.addChild(this.labelNumber);
	this.addChild(this.labelName);
	this.addChild(this.labelScore);
	
	this.divider = PIXI.Sprite.fromFrame("dividerScore.png");
	this.divider.position.y = 54 * 0.7;
	this.addChild(this.divider)

}

ScoreView.constructor = ScoreView;
ScoreView.prototype = Object.create( PIXI.DisplayObjectContainer.prototype ); 

ScoreView.prototype.setScore = function(data)
{
	this.imageSprite.scale.x = this.imageSprite.scale.y = 0;
	
	this.image.src = null;
	this.image = new Image();
	this.image.crossOrigin = '';
	this.image.onload = function(){
		
		this.canvas.context.drawImage(this.maskImage, 0, 0, 50 * 0.7, 50 * 0.7);
		this.canvas.context.globalCompositeOperation = 'source-in';
		
		
		var ratio1 = (50 *0.7) / this.image.width;
		var ratio2 = (50 *0.7) / this.image.height;
		var ratio = Math.max(ratio1, ratio2);
		
	//	console.log(ratio)
		
		this.canvas.context.drawImage(this.image, 
										(25 * 0.7) - (this.image.width * ratio)/2,
										(25 * 0.7) - (this.image.height * ratio)/2, 
										this.image.width * ratio, 
										this.image.height * ratio);
										
		this.canvas.context.globalCompositeOperation = 'source-over';
		
		TweenLite.to(this.imageSprite.scale, 1, {x:1, y:1, ease:Elastic.easeOut});
		
	}.bind(this);
	
	this.image.src = "https://graph.facebook.com/"+data.facebookId+"/picture?type=large"
	
	this.labelName.setText(data.username.toUpperCase());
	this.labelScore.setText(formatScore(data.score).toUpperCase());
	
	
}
