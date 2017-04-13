
var BasicButton = {};

BasicButton.apply = function(button, onPressed)//, overSprite, downSprite)
{
	button.interactive = true;
	button.buttonMode = true;
	
	button.click = button.tap = onPressed;
	
	button.enable = function()
	{
		this.interactive = true;
		TweenLite.to(this, 0.3, {alpha:1, ease:Sine.easeOut});
	}
	
	button.disable = function()
	{
		this.interactive = false;
		TweenLite.to(this, 0.3, {alpha:0.6, ease:Sine.easeOut});
	}
	
	if(button.overFrame)
	{
		button.overFrame.visible = false;
		button.overFrame.alpha = 0;
		
		button.mouseover = function(){
			
			button.overFrame.visible = true;
			TweenLite.to(button.overFrame, 0.2, {alpha:1,  overwrite:true, ease:Sine.easeOut});
		}
		
		button.mouseout = function(){
			
			TweenLite.to(button.overFrame, 0.2, {alpha:0, ease:Sine.easeOut, overwrite:true, onComplete:function(){this.visible = false;}});
		}
	}
	
	if(button.downFrame)
	{
		button.downFrame.visible = false;
		button.downFrame.alpha = 0;
		
		button.mousedown = function(){
			
			button.downFrame.visible = true;
			TweenLite.to(button.downFrame, 0.3, {alpha:1,  overwrite:true, ease:Sine.easeOut});
		}
		
		
		button.mouseup = button.mouseupoutside = function(){
			
			TweenLite.to(button.downFrame, 0.3, {alpha:0, ease:Sine.easeOut, overwrite:true, onComplete:function(){this.visible = false;}});

		}
		
	}
	
	/*
	if(button.overSprite)
	{
		button.over = PIXI.Sprite.fromFrame(overSprite);
		button.addChild(button.over);
	//	alert(overSprite)
		button.over.visible = false;
		button.over.alpha = 0;
		button.over.anchor = button.anchor;
		
		button.mouseover = function(){
			
			this.over.visible = true;
			TweenLite.to(this.over, 0.2, {alpha:1,  overwrite:true, ease:Expo.easeOut});
		}
		
		button.mouseout = function(){
			
			TweenLite.to(this.over, 0.2, {alpha:0, ease:Sine.easeOut, overwrite:true, onComplete:function(){this.visible = false;}});
		}
	}
	*/
}



