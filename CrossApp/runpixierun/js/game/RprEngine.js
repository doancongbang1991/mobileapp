/**
 * @author Mat Groves
 */

var GAME = GAME || {};

GAME.HIGH_MODE = true;
GAME.camera = new PIXI.Point();
GAME.height;
GAME.bundleId = "com.goodboy.runpixierun";
GAME.newHighScore = false;

GAME.RprEngine = function()
{	
    this.onGameover;
    
	this.steve              = new GAME.Steve();
	this.view               = new GAME.RprView(this);
	this.segmentManager     = new GAME.SegmentManager(this);
	this.enemyManager       = new GAME.EnemyManager(this);
	this.pickupManager      = new GAME.PickupManager(this);
	this.floorManager       = new GAME.FloorManager(this);
	this.collisionManager   = new GAME.CollisionManager(this);
    this.LocalStorage       = new Fido.LocalStorage(GAME.bundleId);
	
    this.steve.view.visible =  false;
    
	this.bulletMult = 1;
	this.pickupCount = 0;
	this.score = 0;
	this.joyrideMode = false;
	this.joyrideCountdown = 0;
	this.isPlaying = false;
	this.levelCount = 0;
    this.gameReallyOver = false;
    this.isDying = false;
    
    this.view.game.addChild(this.steve.view);
}

GAME.RprEngine.prototype.start = function()
{
    this.segmentManager.reset();
	this.enemyManager.destroyAll();
	this.pickupManager.destroyAll();
	this.isPlaying = true;
    this.gameReallyOver = false;
	this.score = 0;
	this.steve.level = 1;
	this.steve.position.y = 477;
	this.steve.speed.y = 0;
	this.steve.speed.x = this.steve.baseSpeed;
	this.steve.view.rotation = 0;
	this.steve.isFlying = false;
	this.steve.isDead = false;
	this.steve.view.play()
	this.steve.view.visible = true;
	this.segmentManager.chillMode = false;
	this.bulletMult = 1;

}

GAME.RprEngine.prototype.update = function()
{
	GAME.time.update();
	
	var targetCamY = 0;
	if(targetCamY > 0) targetCamY = 0;
	if(targetCamY < -70) targetCamY = -70;
	
	GAME.camera.y = targetCamY;
	
    if(gameMode !== GAME_MODE.PAUSED)
    {
        this.steve.update();
        this.collisionManager.update();
        this.segmentManager.update();
        this.floorManager.update();
        this.enemyManager.update();
        this.pickupManager.update();

        if(this.joyrideMode)
        {
            this.joyrideCountdown -= GAME.time.DELTA_TIME;

            if(this.joyrideCountdown <= 0)
            {
                this.joyrideComplete();
            }
        }
        
        this.levelCount += GAME.time.DELTA_TIME;
	
        if(this.levelCount > (60 * 60))
        {
            this.levelCount = 0;
            this.steve.level += 0.05;
            GAME.time.speed += 0.05;
        }
    }
    else
    {
        if(this.joyrideMode)
        {
            this.joyrideCountdown += GAME.time.DELTA_TIME;
        }
    }

	this.view.update();
}

GAME.RprEngine.prototype.reset = function()
{
	this.enemyManager.destroyAll();
	this.floorManager.destroyAll();
	
	this.segmentManager.reset();
	this.view.zoom = 1;
	this.pickupCount = 0;
	this.levelCount = 0;
	this.steve.level = 1;
	
	this.view.game.addChild(this.steve.view);
}

GAME.RprEngine.prototype.joyrideComplete = function()
{
	this.joyrideMode = false;
	this.pickupCount = 0;
	this.bulletMult += 0.3;
	this.view.normalMode();
	this.steve.normalMode();
	this.enemyManager.destroyAll();
}

GAME.RprEngine.prototype.gameover = function()
{
	this.isPlaying = false;
    this.isDying = true;
	this.segmentManager.chillMode = true;
    
    var nHighscore = this.LocalStorage.get('highscore');
    if(!nHighscore || this.score > nHighscore) 
    {
        this.LocalStorage.store('highscore', this.score);
        GAME.newHighscore = true;
    }
    
    this.onGameover();
	
	this.view.game.addChild(this.steve.view);
	
	TweenLite.to(this.view, 0.5, {
        zoom : 2, 
        ease : Cubic.easeOut
    });
}

GAME.RprEngine.prototype.gameoverReal = function()
{
    this.gameReallyOver = true;
    this.isDying = false;
	this.onGameoverReal();
}

GAME.RprEngine.prototype.pickup = function()
{
    if(this.steve.isDead) return; 
        
    this.score += 10;
    
	if(this.joyrideMode)
	{
        FidoAudio.stop('pickup');
        FidoAudio.play('pickup');	
		return;
	}
	
	this.view.score.jump();
	this.pickupCount++;
    
    FidoAudio.stop('pickup');
    FidoAudio.play('pickup');
    
	if(this.pickupCount >= 50 * this.bulletMult && !this.steve.isDead)
	{
		this.pickupCount = 0;
		this.joyrideMode = true;
		this.joyrideCountdown = 60 * 10;
		this.view.joyrideMode();
		this.steve.joyrideMode();
		this.steve.position.x = 0;
		GAME.camera.x = game.steve.position.x - 100;
		this.enemyManager.destroyAll();
		this.pickupManager.destroyAll();
		this.floorManager.destroyAll();	
		this.segmentManager.reset();
	}
}

Time = function()
{
	this.DELTA_TIME = 1;	
	this.lastTime = Date.now();
    this.speed = 1;
}

Time.constructor = Time;

Time.prototype.update = function()
{
    var time = Date.now();
    var currentTime =  time;
    var passedTime = currentTime - this.lastTime;

    this.DELTA_TIME = ((passedTime) * 0.06);
    this.DELTA_TIME *= this.speed;

    if(this.DELTA_TIME > 2.3) this.DELTA_TIME = 2.3;

    this.lastTime = currentTime;
}

GAME.time = new Time();