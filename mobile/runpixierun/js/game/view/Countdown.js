/**
 * @author Mat Groves
 * v2 by Tom Slezakowski
 */

var GAME = GAME || {};

var enemyFrames;
var m_cCountdown = false;

GAME.Countdown = function()
{
	PIXI.DisplayObjectContainer.call(this);
	this.three = PIXI.Sprite.fromFrame("3Get.png");
	this.two = PIXI.Sprite.fromFrame("2tricksy.png");
	this.one = PIXI.Sprite.fromFrame("1pixie.png");

	this.three.anchor.x = this.three.anchor.y = 0.5;
	this.two.anchor.x = this.two.anchor.y = 0.5;
	this.one.anchor.x = this.one.anchor.y = 0.5;
	
	this.three.alpha = 0;
	this.two.alpha = 0;
	this.one.alpha = 0;
	
	this.addChild(this.three);
	this.addChild(this.two);
	this.addChild(this.one);
	
	this.three.alpha = 0;
	this.two.alpha = 0;
	this.one.alpha = 0;
	
    m_cCountdown = this;
}

GAME.Countdown.constructor = GAME.Countdown;
GAME.Countdown.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

GAME.Countdown.prototype.startCountDown = function(onComplete)
{
	this.visible = true;
	this.onComplete = onComplete;
	
	this.three.alpha = 0;
	this.two.alpha = 0;
	this.one.alpha = 0;
	
	this.three.scale.x = this.three.scale.y = 2;
	this.two.scale.x = this.two.scale.y = 2;
	this.one.scale.x = this.one.scale.y = 2;
	
    var that = this; 
    
	TweenLite.to(this.three, 1 * time2, {
        alpha : 1, 
        onComplete : function()
        {
            m_cCountdown.onThreeShown();
        }
    });
    
	TweenLite.to(this.three.scale, 1 * time2, {
        x : 1, 
        y : 1, 
        ease : Elastic.easeOut
    });
}

var time = 0.1;
var time2 = 0.5;
var delay = 0;

GAME.Countdown.prototype.onThreeShown = function()
{   
    var that = this;
    
	TweenLite.to(that.three, 1 * time, {
        alpha : 0, 
        ease : Sine.easeOut, 
        delay : delay
    });
    
	TweenLite.to(that.three.scale, 1 * time, {
        x : 0.5, 
        y : 0.5, 
        ease : Cubic.easeOut, 
        delay : delay
    });
	
	TweenLite.to(that.two, 1 * time2, {
        alpha : 1, 
        onComplete : function()
        {
            TweenLite.to(that.two, 1 * time, {
                alpha : 0, 
                delay : delay
            });

            TweenLite.to(that.two.scale, 1 * time, {
                x : 0.5, 
                y : 0.5, 
                ease : Cubic.easeOut, 
                delay : delay
            });

            TweenLite.to(that.one, 1 * time2, {
                alpha : 1, 
                onComplete : function()
                {
                    TweenLite.to(that.one.scale, 1 * time, {
                        x : 0.5, 
                        y : 0.5, 
                        ease : Cubic.easeOut, 
                        delay : delay
                    });

                    TweenLite.to(that.one, 1 * time, {
                        alpha : 0, 
                        onComplete : function()
                        {
                            that.visible = false;
                            that.onComplete();
                        }, 
                        delay : delay
                    });
                }, 
                delay : delay
            });

            TweenLite.to(that.one.scale, 1 * time2, {
                x : 1,
                y : 1,
                ease : Elastic.easeOut,
                delay : delay
            });
        }, 
        delay : delay
    });
    
	TweenLite.to(this.two.scale, 1 * time2, {
        x : 1, 
        y : 1, 
        ease : Elastic.easeOut, 
        delay : delay
    });
}