
HelpOverlay = function(engine)
{
	PIXI.DisplayObjectContainer.call(this);
	
	//this.background = new PIXI.Graphics();
	//this.background.beginFill(0xFF0000, 0.5);
	//this.background.drawRect(0, 0, 300, 300);
	//this.background.endFill();
	
	this.colorBlock = new PIXI.Graphics();
	this.colorBlock.beginFill(0xF9F6F0, 0.6);
	this.colorBlock.moveTo(4,-20)
	this.colorBlock.lineTo(300-17,-20)
	this.colorBlock.lineTo(300-17,300-3)
	this.colorBlock.lineTo(14,300-3)
	this.colorBlock.endFill();
///	this.colorBlock.position.y = -7;
	
	
	//this.masky = new PIXI.Graphics();
//	this.masky.beginFill(0xFFFF00, 1);
//	this.masky.drawRect(0, 0, 371,284);
//	this.masky.endFill();
	
	this.addChild(this.colorBlock)
	//this.addChild(this.masky)
	
	this.trackpad = new PixiTrackpad(this, true);
	
	this.pageContainer = new PIXI.DisplayObjectContainer();
	this.pageContainer.mask = this.colorBlock;
	
	this.pageContainer.position.x = -5
	this.pageContainer.position.y = -20
	this.addChild(this.pageContainer);
	
	this.pages = [];
	
	for (var i=0; i < 3; i++) {
	  
		var page =  PIXI.Sprite.fromImage(REMOTE_PATH + "img/UI/howToPlay_0"+ (i + 1) +".png", true);
		this.pages.push(page);
		this.pageContainer.addChild(page);
		
	};
	
	this.label = PIXI.Sprite.fromFrame("howToPlay.png");
	this.label.anchor.x = 0.5;
	this.label.position.x = 285/2;
	this.label.position.y = -60;
	
	this.addChild(this.label);	
}

HelpOverlay.prototype = Object.create( PIXI.DisplayObjectContainer.prototype ); 

HelpOverlay.prototype.updateTransform = function()
{
	this.trackpad.update();
	//console.log(this.trackpad.spring.tx);
	//this.advertContainer.position.x = this.trackpad.value + 150;
	var max =  this.trackpad.size * this.pages.length;
	
	for (var i=0; i < this.pages.length; i++) {
		
		var page = this.pages[i];
		
		//	var mod = i % 2
		page.position.x = (i * this.trackpad.size) - (max/3) + this.trackpad.value;// + 83;
		
		page.position.x %= max
		if(page.position.x < 0) page.position.x += max;
		
		page.position.x -= this.trackpad.size;
		
	};
	/*
	// sort out menu...
	var id = Math.floor( (this.trackpad.spring.tx - 60) / this.trackpad.size ) + 1;
	id %= 3;
	if(id < 0)id += 3;
	 
	//console.log(this.advertArray.length);
	
	if(this.currentId != id)
	{
		if(this.advertArray.length > 0)
		{
			if(this.advertArray[this.currentId])this.advertArray[this.currentId].miniButton.onSprite.visible = false;
			this.currentId = id;
			this.advertArray[this.currentId].miniButton.onSprite.visible = true;
		}	
	}*/
	
	PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);
}

HelpOverlay.prototype.show = function()
{
	
}

HelpOverlay.prototype.hide = function()
{
	this.visible = false;	
}
