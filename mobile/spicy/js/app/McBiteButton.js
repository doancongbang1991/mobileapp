
McBiteButton = function(frame, overFrame, downFrame)
{
	PIXI.DisplayObjectContainer.call(this);
	
	var sprite = PIXI.Sprite.fromFrame(frame)
	this.addChild(sprite);
	
	sprite.anchor.x = 0.5;
	
	downFrame = downFrame || frame;
	
	if(overFrame && downFrame)
	{
		this.overFrame = PIXI.Sprite.fromFrame(overFrame);
		this.downFrame = PIXI.Sprite.fromFrame(downFrame);
		
		this.overFrame.anchor.x = 0.5;
		this.downFrame.anchor.x = 0.5;
	//	this.overFrame.position.x = 0.5;
		//this.overFrame.position.y = 1;
		//this.downFrame.position.y = 1;
		
		this.addChild(this.overFrame);
		this.addChild(this.downFrame);
		
	}
	/*
	this.background = new PIXI.Graphics();
	this.background.beginFill(0xFF0000, 0.5);
	this.background.drawRect(-150, 0, 300, 50);
	this.background.endFill();
	
	this.addChild(this.background)
	//this.pa
	
	//this.label = new PIXI.Text(labelText, {font: "35px Pathway Gothic One", fill: "black", align: "left"});
	this.label.anchor.x = 0.5;
	this.addChild(this.label);*/
}

McBiteButton.prototype = Object.create( PIXI.DisplayObjectContainer.prototype ); 

