/**
 * @author Mat Groves http://matgroves.com/
 */
var PIXI = PIXI || {};

PIXI.StressTest = function(callback)
{
    this.Device = new Fido.Device();
    
    this.width = window.innerWidth || document.body.clientWidth;
    this.height = window.innerHeight || document.body.clientHeight;
    
    this.frameCount = 0;
    this.tick = 0;
    this.loadingFrames = [
        "img/loading_01.png",
        "img/loading_02.png",
        "img/loading_03.png",
        "img/loading_04.png"
    ];
    this.currentLoadSprite = false;

    var assetLoader = new PIXI.AssetLoader(this.loadingFrames, true);
    assetLoader.load();
    
    this.callback = callback;
    this.renderer = new PIXI.CanvasRenderer(this.width, this.height, false, false);
    this.stage = new PIXI.Stage(0x25284A);
    
    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0x25284A);
    this.graphics.drawRect(0, 0, this.width, this.height);
    this.stage.addChild(this.graphics);
    
    document.body.appendChild(this.renderer.view);
    
    this.stage.touchstart = this.stage.mousedown = function(event)
    {
        event.originalEvent.preventDefault();
    }


    this.duration = 3;

    var scope = this;
    this.texture = PIXI.Texture.fromImage("img/testImage.png");
    this.texture.baseTexture.addEventListener('loaded', function()
    { 
        scope.begin();
    });

    this.frameRate = [];
}

// constructor
PIXI.StressTest.constructor = PIXI.StressTest;

PIXI.StressTest.prototype.begin = function()
{
    this.testSprites = [];
    for (var i=0; i < 300; i++) 
    {
        var bunny = new PIXI.Sprite(this.texture);

        bunny.anchor.x = 0.5;
        bunny.anchor.y = 0.5;
        bunny.position.x = 50 + Math.random() * 400; 
        bunny.position.y = 10; 

        this.stage.addChild(bunny);
        this.testSprites.push(bunny);
    };
    
    this.graphics2 = new PIXI.Graphics();
    this.graphics2.beginFill(0x25284A);
    this.graphics2.drawRect(0, 0, this.width, this.height);
    this.stage.addChild(this.graphics2);
    
    var logo = new PIXI.Sprite(PIXI.Texture.fromImage('img/goodboy_logo.png'));
        logo.anchor.x = 0.5;
        logo.anchor.y = 0.5;
        logo.position.x = this.width * 0.5;
        logo.position.y = this.height * 0.48;
        
    if(this.Device.cocoonJS)
    {
        logo.scale.set(1);
        logo.position.y = this.height * 0.47;
    }
    else
    {
        logo.scale.set(1);
    }
        this.stage.addChild(logo);

    this.renderer.render(this.stage);

    this.startTime = Date.now();
    this.lastTime = Date.now();

    var scope = this;
    requestAnimFrame(function()
    {
        scope.update();
    });
}

PIXI.StressTest.prototype.resize = function(w, h)
{
    this.width = w;
    this.height = h;
}

PIXI.StressTest.prototype.update = function()
{
    this.frameCount++;
    
    if(this.frameCount % 12 === 1)
    {      
        if(this.tick === this.loadingFrames.length)
        {
            this.tick = 0;
        }

        var sprite = SpritePool.getInstance().get(this.loadingFrames[this.tick])
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.position.x = this.width * 0.5;
            sprite.position.y = this.height * 0.5 + 40;

        if(this.Device.cocoonJS)
        {
            sprite.position.y = this.height * 0.5 + 40;
        }

        this.stage.addChild(sprite);
        if(this.currentLoadSprite !== false) this.stage.removeChild(this.currentLoadSprite);
        
        this.currentLoadSprite = sprite;
        
        this.tick++;
    }

    var currentTime = Date.now();

    for (var i=0; i < this.testSprites.length; i++) 
    {
      this.testSprites[i].rotation += 0.3;
    }

    this.renderer.render(this.stage);

    var diff = currentTime - this.lastTime;
    diff *= 0.06;

    this.frameRate.push(diff);

    this.lastTime = currentTime;

    var elapsedTime = currentTime - this.startTime;

    if(elapsedTime < this.duration * 1000)
    {
        var scope = this;
        requestAnimFrame(function()
        {
            scope.update()
        });	
    }
    else
    {
        if(this.callback) this.callback();
    }
}

PIXI.StressTest.prototype.end = function()
{
    this.result = this.frameRate.length / this.duration;   
}

PIXI.StressTest.prototype.remove = function()
{
    document.body.removeChild(this.renderer.view);
    this.cover = null;
    this.renderer = null;  
}



