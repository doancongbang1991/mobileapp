(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var Common                      = require("./Common");
var GameScreen                  = require("./screens/GameScreen");
var SplashScreen                = require("./screens/SplashScreen");
var IntroScreen                 = require("./screens/IntroScreen");
var GameOverScreen              = require("./screens/GameOverScreen");
var PauseOverlay                = require("./overlays/PauseOverlay");
var Transition                  = require("./lib/Transition");
var SavedData                   = require("./SavedData");

//===================================================
// CONSTRUCTOR
//===================================================

function Application() {
    /**
     * @type {AssetManager}
     * @private
     */
    this._assetManager = null;

    /**
     * @type {ScreenManager}
     * @private
     */
    this._screenManager = null;

}
module.exports = Application;

//===================================================
// PUBLIC METHODS
//===================================================

Application.prototype.init = function() {
    console.log("APPLICATION INITIALIZED");

    this._assetManager = p3.AssetManager.instance;
    this._screenManager = Common.sceneManager;

    TweenMax.defaultOverwrite = "none";

    for(var i in Common.colours)
    {
        var gr = new PIXI.Graphics();
        gr.beginFill(Common.colours[i]);
        gr.drawRect(0, 0, 1, 1);
        Common.generatedTextures[i + 'Square'] = gr.generateTexture(Common.renderer, 1.0, PIXI.SCALE_MODES.LINEAR);
    }

    Common.savedData = new SavedData();
    Common.savedData.init();

    this.showSplash();
};

Application.prototype.showSplash = function() {

    var screen = new SplashScreen();
    this._screenManager.add(screen, this._getTransition());

    screen.signals.requestedPreviousScreen.addOnce(function(){
        
    }, this);
    screen.signals.requestedNextScreen.addOnce(function(){
        this.showIntro();
    }, this);

    this._currentScreen = screen;

    return screen;
};

Application.prototype.showIntro = function() {

    var screen = new IntroScreen();
    this._screenManager.add(screen, this._getTransition());

    screen.signals.requestedPreviousScreen.addOnce(function(){
        
    }, this);
    screen.signals.requestedNextScreen.addOnce(function(){
        this.showGame(true);
    }, this);

    this._currentScreen = screen;

    return screen;
};

Application.prototype.showGame = function(showPause) {

    var screen = new GameScreen();
    this._screenManager.add(screen, this._getTransition());

    screen.signals.requestedPreviousScreen.addOnce(function(){
        
    }, this);
    screen.signals.requestedNextScreen.addOnce(function(distance, hearts){
        this.showGameOver(distance, hearts);
    }, this);
    screen.signals.requestedPauseOverlay.add(function(){
        this.showPause();
    }, this);

    this._currentScreen = screen;

    if(showPause && !Common.savedData.hasViewedInstructions)
    {
        Common.animator.setTimeout(function(){
            this.showPause(true);
            Common.savedData.hasViewedInstructions = true;
            Common.savedData.save();
        }, 0.1, this);
    }

    return screen;
};

Application.prototype.showPause = function(showHelp)
{
    var t = new Transition();
    t.replace = false;
    t.push = true;

    this._currentScreen.hideGUI();
    this._currentScreen.pause();
    var screen = new PauseOverlay();
    this._screenManager.add(screen, t);

    screen.signals.requestedNextScreen.addOnce(function(id){
        this._screenManager.remove();
        this._currentScreen.showGUI();
        this._currentScreen.resume();
    }, this);
    screen.signals.requestedPreviousScreen.addOnce(function(id){
        this.showSplash();
    }, this);

    if(showHelp)
        p3.Timestep.queueCall(screen.setIntroHelpMode, [], screen);
};

Application.prototype.showGameOver = function(distance, hearts) {

    var screen = new GameOverScreen(distance, hearts);
    this._screenManager.add(screen, this._getTransition());

    screen.signals.requestedPreviousScreen.addOnce(function(){
        this.showSplash();
    }, this);
    screen.signals.requestedNextScreen.addOnce(function(){
        this.showGame();
    }, this);

    this._currentScreen = screen;

    return screen;    
};

Application.prototype.pause = function()
{
    if(this._currentScreen.pause != undefined)
        this._currentScreen.pause();
}

Application.prototype.resume = function()
{
    if(this._currentScreen.resume != undefined)
        this._currentScreen.resume();
}



//===================================================
// PRIVATE METHODS
//===================================================

/**
 */
Application.prototype._getTransition = function()
{
    var transition = new Transition();
    transition.replace = true;
    transition.push = false;
    return transition;
}

//===================================================
// EVENTS
//===================================================

//===================================================
// GETTERS/SETTERS
//===================================================

//===================================================


},{"./Common":2,"./SavedData":4,"./lib/Transition":17,"./overlays/PauseOverlay":18,"./screens/GameOverScreen":19,"./screens/GameScreen":20,"./screens/IntroScreen":21,"./screens/SplashScreen":24}],2:[function(require,module,exports){
/**
 *  Common
 *
 *  Created by Legman on 30/04/2015.
 *
 */


//===================================================
// CONSTRUCTOR
//===================================================

function Common() {}
module.exports = Common;


/* ------GENERIC------ */

/**
 * @type {Number}
 * @const
 */
Common.STAGE_WIDTH = 1900.0;

/**
 * @type {Number}
 * @const
 */
Common.STAGE_HEIGHT = 768.0;

/**
 * @type {PIXI.Container}
 * @static
 */
Common.stage = null;

/**
 * @type {PIXI.CanvasRenderer|PIXI.WebGLRenderer}
 * @static
 */
Common.renderer = null;

/**
 * @type {p3.Timestep}
 * @static
 */
Common.timestep = null;

/**
 * @type {p3.Animator}
 * @static
 */
Common.animator = null;

/**
 * @type {PIXI.Point}
 * @static
 */
Common.touch = new PIXI.Point(0.0, 0.0);

/**
 * @type {Number}
 * @static
 */
Common.paused = false;

/**
 * @type {Boolean}
 * @static
 */
Common.isWebGL = false;

/**
 * @type {Number}
 * @const
 */
Common.DEBUG_PAINT_MODE = 0;

/**
 * @type {Number}
 * @static
 */
Common.frameCount = 0;

/**
 * @type {Number}
 * @const
 */
Common.FPS = 60;

/**
 * @type {SavedData}
 * @static
 */
Common.sceneManager = null;

Common.generatedTextures = {};

Common.colours = {black:0x000000, blossom:0xf5a6be, bubbles:0x4fc9e8, buttercup:0xa7d49b, sky0:0x9bf2d7, sky1:0x77DCF2, sky2:0xFCC68B, sky3:0xD5A4ED, sky4:0xFAFA6B};

Common.COUNTRY_CODE = 'en';

Common.savedData = null;








//===================================================


},{}],3:[function(require,module,exports){
/**
 *  Main
 *
 *  Created by Legman on 27/04/2015.
 *
 */

var Application     = require("./Application");

var Common          = require("./Common");
var Preloader       = require("./screens/Preloader");
var SceneManager    = require("./lib/SceneManager");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @param {!Number} width
 * @param {!Number} height
 * @constructor
 */
function Main(width, height) {
    /**
     * @type {!Number}
     * @private
     */
    this._width = width;

    /**
     * @type {!Number}
     * @private
     */
    this._height = height;

	/**
	 * @type {p3.AssetManager}
	 * @private
	 */
	this._assetManager = null;

	/**
	 * @type {p3.ScreenManager}
	 * @private
	 */
	this._screenManager = null;

    /**
     * @type {Preloader}
     * @private
     */
    this._preloader = null;

	/**
	 * @type {Application}
	 * @private
	 */
	this._game = null;

        /**
     * @type {Number}
     * @private
     */
    this._resolution = 1.0;

    /**
     * @type {String}
     * @private
     */
    this._scale = "hd/";

    /**
     * @type {String}
     * @private
     */
    this._renderFPS = 60.0;

    /**
     * @type {String}
     * @private
     */
    this._frameCount = 0;

    this._screenIncorrectRotation = false;

}
window.Main = Main;

//===================================================
// PUBLIC METHODS
//===================================================

/**
 */
Main.prototype.init = function() {
  	this._assetManager = p3.AssetManager.instance;
	this._screenManager = new SceneManager();

    Common.COUNTRY_CODE = window.og.language;

    var elementId = "og-game-holder";
    var params = new p3.ViewParams();
    params.width = this._width;
    params.height = this._height;
    params.holderID = elementId;
    params.rotateImageUrl = "assets/images/system/" + Common.COUNTRY_CODE + "/rotate_device.jpg";
    params.rotateImageColor = "#f5c1d3";

    PIXI.RETINA_PREFIX = /\_(?=[^_]*$)(.+)x/;

    p3.Tracking.DEBUG = true;
    Common.tracking = new p3.Tracking();
    Common.tracking.init(new p3.TrackingModuleEcho(window.stats));

    p3.Device.init(window["bowser"]);

    TweenMax.defaultOverwrite = "none";
    TweenMax.ticker.fps(Common.FPS);

    var canvas = new p3.View(params);
    canvas.signals.ready.addOnce(function(canvas) {

        var options = {};
        options.view = canvas;
        options.transparent = false;
        options.antialias = false;
        options.preserveDrawingBuffer = false;
        options.resolution = this._resolution;
        this._assetManager.scaleFactor = this._resolution;

        var stage = new PIXI.Container();
        Common.stage = stage;

        var renderer = PIXI.autoDetectRenderer(this._width, this._height, options);
        Common.renderer = renderer;
        //PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

        this._screenManager.init(stage, renderer);
        Common.sceneManager = this._screenManager;

        Common.isWebGL = (renderer instanceof PIXI.WebGLRenderer);
        Common.DEBUG_PAINT_MODE = p3.Utils.getURLParameter("paint", 0);

        var timestep = new p3.Timestep();
        timestep.init(this.update, this.render, this);
        Common.timestep = timestep;

        Common.animator = new p3.Animator();
        Common.animator.init();

        this.loadPreloader();

    }, this);
    canvas.signals.resize.add(this.onCanvasResize, this);

    var hidden;
    "undefined" != typeof document.hidden ? (hidden = "hidden",
        this.visibilityChange = "visibilitychange") : "undefined" != typeof document.mozHidden ? (hidden = "mozHidden",
        this.visibilityChange = "mozvisibilitychange") : "undefined" != typeof document.msHidden ? (hidden = "msHidden",
        this.visibilityChange = "msvisibilitychange") : "undefined" != typeof document.webkitHidden && (hidden = "webkitHidden",
        this.visibilityChange = "webkitvisibilitychange");

    document.addEventListener(this.visibilityChange, function(){
        document[hidden] ? Howler.volume(0) : Howler.volume(1);
    }, false);
};

/**
 */
Main.prototype.loadPreloader = function()
{
    scale = this._scale;
    var prefix = (scale === "sd/" ? "_0.5x" : "");
    var files = [
        {name:"preloader_bg", url:"images/" + scale + "preloader" + prefix + ".jpg"},
        {name:"preloader", url:"images/" + scale + "preloader" + prefix + ".json"}
    ];
    var sounds = [
    ];
    if (files.length) {
        this._assetManager.addFiles(files, window.og.gameDir + "assets/");
        this._assetManager.signalCompleted.addOnce(function() {
            this.loadAssets();
        }, this);
        this._assetManager.load();

        p3.AudioManager.instance.addSounds(sounds, [".mp3", ".ogg"], "");
    } else {
        this.loadAssets();
    }
};

/**
 */
Main.prototype.loadAssets = function() {
    var scale = this._scale;
    var prefix = (scale === "sd/" ? "_0.5x" : "");
    var files = [
        {name:"config", url:"data/config.json"},
        {name:"obstacle_data", url:"data/obstacle_data.json"},
        
        {name:"particles_trail", url:"particles/trail.json"},
        {name:"particles_collision", url:"particles/collision.json"},
        {name:"particles_glow", url:"particles/glow.json"},
        {name:"particles_pickup", url:"particles/pickups.json"},

        {name:"game_assets", url:"images/" + scale + "game_assets" + prefix + ".json"},
        {name:"intro", url:"images/" + scale + "intro" + prefix + ".json"},
        {name:"splash", url:"images/" + scale + "splash" + prefix + ".json"},
        {name:"ui", url:"images/" + scale + "ui" + prefix + ".json"},

        {name:"fr1_bg", url:"images/" + scale + "fr1_bg" + prefix + ".jpg"},
        {name:"fr3_bg", url:"images/" + scale + "fr3_bg" + prefix + ".jpg"},
        {name:"bg_blue", url:"images/" + scale + "bg_blue" + prefix + ".jpg"},
        {name:"bg_splash", url:"images/" + scale + "bg_splash" + prefix + ".jpg"},
        {name:"game_title", url:"images/language/" + Common.COUNTRY_CODE + "/trail_blazer.png"},
        
        {name:"unpack40_white", url:"fonts/unpack40_white.json"},
        {name:"unpack50_black", url:"fonts/unpack50_black.json"},
        {name:"unpack60_yellow", url:"fonts/unpack60_yellow.json"},
        {name:"unpack70_whitetitle", url:"fonts/unpack70_whitetitle.json"},
        {name:"unpack90_pink", url:"fonts/unpack90_pink.json"},
        {name:"unpack100_blue", url:"fonts/unpack100_blue.json"}
    ];
    var sounds = [
        "music_loop",
        "music_ppg_splash_generic",
        "sfx_game_end_00",
        "sfx_heart_pickup_02",
        "sfx_object_destroyed_00",
        "sfx_object_destroyed_01",
        "sfx_ppg_girls_flyaway_00",
        "sfx_ppg_hit_obstacle_00",
        "sfx_ppg_hit_obstacle_01",
        "sfx_ppg_level_start_00",
        "sfx_ppg_move_00",
        "sfx_ppg_move_01",
        "sfx_ppg_move_02",
        "sfx_ppg_move_03",
        "sfx_ppg_move_04",
        "sfx_ppg_move_05",
        "sfx_ppg_move_06",
        "sfx_ui_press_button_01",
        "sfx_ui_pressplay_00"
    ];
    if (files.length) {
        this._assetManager.addFiles(files, window.og.gameDir + "assets/");
        this._assetManager.signalProgress.add(this.onLoadingProgress, this);
        this._assetManager.signalCompleted.addOnce(this.onLoadingCompleted, this);
        this._assetManager.load();

        this._preloader = new Preloader();
        this._screenManager.add(this._preloader);

        p3.AudioManager.instance.addSounds(sounds, [".mp3", ".ogg"], window.og.gameDir + "assets/audio/");
    } else {
        this.startGame();
    }
};

/**
 */
Main.prototype.startGame = function()
{
    var that = this;
    that._game = new Application();
    that._game.init();
};

/**
 */
Main.prototype.update = function()
{
    this._screenManager.update();
    Common.animator.update();

    if (Common.DEBUG_PAINT_MODE > 0) {
        this.paintBadImage(Common.stage);
    }

    this._frameCount++;
    Common.frameCount = this._frameCount;
};

/**
 */
Main.prototype.render = function()
{
    if(this._frameCount % 2 == 0 || this._fps == 60.0)
        Common.renderer.render(Common.stage);
};

/**
 * @param {!PIXI.DisplayObject} display
 * @param {Number=} color
 */
Main.prototype.paintBadImage = function(display, color)
{
    color = color || 0xAA00FF;

    var child;
    for (var i = 0; i < display.children.length; ++ i) {
        child = display.children[i];
        if (child instanceof PIXI.Sprite) {
            if (Common.DEBUG_PAINT_MODE == 1) {
                if (child.texture.width % 2 != 0 || child.texture.height % 2 != 0) {
                    child.tint = color;
                } else {
                    child.tint = 0xFFFFFF;
                }
            }
            if (Common.DEBUG_PAINT_MODE == 2) {
                if (child.position.x !== parseInt(child.position.x) || child.position.y !== parseInt(child.position.y)) {
                    child.tint = color;
                } else {
                    child.tint = 0xFFFFFF;
                }
            }
        }
        this.paintBadImage(child, color);
    }
};

//===================================================
// PRIVATE METHODS
//===================================================


//===================================================
// EVENTS
//===================================================

/**
 */
Main.prototype.onLoadingProgress = function(event) {
    this._preloader.loadedPercentage = event.progress;
};

/**
 */
Main.prototype.onLoadingCompleted = function() {
    this._preloader.loadedPercentage = 100.0;
    this._preloader.animateOut(null, this);

    this._preloader = null;

    this._assetManager.signalProgress.removeAll();
    this._assetManager.signalCompleted.removeAll();

    this.startGame();

};

/**
 * @param {!Boolean} correct
 */
Main.prototype.onCanvasResize = function(correct)
{
    if (correct) {
        Common.renderer.resize(p3.View.width, p3.View.height);

        if (this._screenManager) {
            this._screenManager.resize();
        }
        if(this._screenIncorrectRotation)
        {
            this._game.resume();
            this._screenIncorrectRotation = false;
        }
    }
    else
    {
        if(!this._screenIncorrectRotation)
        {
            this._game.pause();
            this._screenIncorrectRotation = true;
        }
    }
};

//===================================================
// GETTERS/SETTERS
//===================================================

//===================================================


},{"./Application":1,"./Common":2,"./lib/SceneManager":16,"./screens/Preloader":22}],4:[function(require,module,exports){

var Common          = require("./Common");

//===================================================
// CONSTRUCTOR
//===================================================

function SavedData()
{
    var assetManager = p3.AssetManager.instance;
    this.hasViewedInstructions = false;
    this.hasSeenIntro = false;
    this.bestScore = 0;

    /**
     * @type {String}
     * @const
     */
    this.SAVE_NAME = "powerpuffgirls_trail_blazer";

    /**
     * @type {String}
     * @const
     */
    this.SAVE_VERSION = "0.0.1";

    /**
     * @type {String}
     * @const
     */
    this.SAVE_SEED = "x5k0Eo6R177mUkb";

}
module.exports = SavedData;

//===================================================
// PUBLIC METHODS
//===================================================

SavedData.prototype.init = function()
{
    if (!window.localStorage[this.SAVE_NAME + "_" + this.SAVE_VERSION])
    {
        console.log('reset');
        this.reset();
        this.save();
    }
    else
    {
        console.log('load');    
        this.load();
    }

};

SavedData.prototype.reset = function()
{
    
};


SavedData.prototype.load = function()
{
    var data = window.localStorage[this.SAVE_NAME + "_" + this.SAVE_VERSION];
    data = JSON.parse(data);

    this.hasSeenIntro = data.hasSeenIntro;
    this.hasViewedInstructions = data.hasViewedInstructions;
    this.bestScore = data.bestScore;

    /*
    var json = JSON.stringify(
    {
    	hasViewedInstructions: data.hasViewedInstructions,
    	hasSeenIntro: data.hasSeenIntro
    });

    var hash = md5(json + this.SAVE_SEED);
    if (hash != data.hash)
    {
        window.localStorage.removeItem(this.SAVE_NAME + "_" + this.SAVE_VERSION);
        location.reload();
    }
    else
    {
        this.hasSeenIntro = data.hasSeenIntro;
        this.hasViewedInstructions = data.hasViewedInstructions;
    }*/
};

SavedData.prototype.save = function()
{
    console.log('save');
    var data = {};
    data.hasSeenIntro = this.hasSeenIntro;
    data.hasViewedInstructions = this.hasViewedInstructions;
    data.bestScore = this.bestScore;

    var json = JSON.stringify(data);
    data.hash = md5(json + this.SAVE_SEED);

    window.localStorage[this.SAVE_NAME + "_" + this.SAVE_VERSION] = JSON.stringify(data);    
};




//===================================================
// PRIVATE METHODS
//===================================================



//===================================================
// EVENTS
//===================================================

//===================================================
// GETTERS/SETTERS
//===================================================

//===================================================
},{"./Common":2}],5:[function(require,module,exports){
var Common          = require("../Common");
var ScrollerObject  = require("../scroller/ScrollerObject");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 */
function Avatar(girl)
{
	this.girl			= girl;

	this._sprite		= null;

	ScrollerObject.call(this, "avatar", false);
}
module.exports = Avatar;
Avatar.prototype = Object.create(ScrollerObject.prototype);
Avatar.prototype.constructor = Avatar;


//===================================================
// PUBLIC METHODS
//===================================================

/**
 */
Avatar.prototype.init = function()
{
	var animationFrames = {blossom:7, bubbles:8, buttercup:5};

	//this._sprite = new PIXI.Sprite(this._assetManager.getTexture(this.girl + '_001'));//
	this._sprite = new p3.MovieClip(this._generateAnimationSequence(this.girl, animationFrames[this.girl]));
	this._sprite.gotoAndPlay(0);
	this._sprite.animationSpeed = 60;
	this._sprite.looping = true;
	this._sprite.anchor = new PIXI.Point(0.5, 0.5);
	this._sprite.scale = new PIXI.Point(0.75, 0.75);
	this.addChild(this._sprite);

	Common.animator.add(TweenMax.to(this._sprite.anchor, 0.6 + (0.3*Math.random()), {y:0.55, ease:Sine.easeInOut, yoyo:true, repeat:-1}));
	Common.animator.add(TweenMax.to(this._sprite.anchor, 1.2 + (0.5*Math.random()), {x:0.6, ease:Sine.easeInOut, yoyo:true, repeat:-1}));

	this.areaRect = new PIXI.Rectangle(-75, -100, 150, 200);
	this.collisionRect = new PIXI.Rectangle(-40, -20, 70, 50);
};

/**
 */
Avatar.prototype.update = function()
{
	ScrollerObject.prototype.update.call(this);	
};

/**
 */
Avatar.prototype.touch = function()
{

};

/**
 */
Avatar.prototype.pause = function()
{
	this._sprite.stop();
}

/**
 */
Avatar.prototype.resume = function()
{
	this._sprite.play();
}

/**
 */
Avatar.prototype.flash = function()
{
	TweenMax.killTweensOf(this._sprite.anchor);

	var tl = new TimelineMax({repeat:5});
	tl.to(this._sprite, .2, {onCompleteScope:this, onComplete:function(){
		this._sprite.visible = false;
	}});
	tl.to(this._sprite, .2, {onCompleteScope:this, onComplete:function(){
		this._sprite.visible = true;
	}});
}

/**
 */
Avatar.prototype.stop = function()
{
	TweenMax.killTweensOf(this._sprite.anchor);
}


//===================================================
// PRIVATE METHODS
//===================================================

/**
 * @param {!String} character
 * @param {!Number} frameLimit
 * @returns {!p3.MovieClipSequence}
 */
Avatar.prototype._generateAnimationSequence = function(character, frameLimit)
{
	var textureArr = [];
	for(var i = 1; i <= frameLimit; i++)
	{	
		textureArr.push(character + "_00" + i);
	}
	for(var i = 0; i < textureArr.length; i++)
	{
		textureArr[i] = this._assetManager.getTexture(textureArr[i]);
	}
	var sequence = new p3.MovieClipSequence();
	sequence.addTextures(textureArr);

	return sequence;
}


//===================================================
// EVENTS
//===================================================


//===================================================
// GETTERS/SETTERS
//===================================================


//===================================================


},{"../Common":2,"../scroller/ScrollerObject":27}],6:[function(require,module,exports){
var Common          = require("../Common");
var ScrollerObject  = require("../scroller/ScrollerObject");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 */
function BackgroundFloater(image, id)
{
	this._image			= image;
	this._id			= id;
	this._sprite 		= null;
	this._spriteHolder 	= null;

	ScrollerObject.call(this, "floater", false);

	this.template();
}
module.exports = BackgroundFloater;
BackgroundFloater.prototype = Object.create(ScrollerObject.prototype);
BackgroundFloater.prototype.constructor = BackgroundFloater;


//===================================================
// PUBLIC METHODS
//===================================================

BackgroundFloater.prototype.init = function()
{

}

BackgroundFloater.prototype.template = function()
{
	this._spriteHolder = new PIXI.Container();
	this.addChild(this._spriteHolder);

	this._sprite = new PIXI.Sprite();
	this._spriteHolder.addChild(this._sprite);

	this.removeIfOutsideBoundary = true;

	this.create();
}


/**
 */
BackgroundFloater.prototype.create = function()
{
	var data = this._assetManager.getJSON('obstacle_data').obstacles[this._id];

	this._sprite.texture = this._assetManager.getTexture(this._image);
	this.areaRect = new PIXI.Rectangle(0, 0, this._sprite.width, this._sprite.height);

	this._spriteHolder.x = this.areaRect.width/2;
	this._spriteHolder.y = this.areaRect.height/2;
	this._sprite.anchor = new PIXI.Point(0.5, 0.5);
	this._spriteHolder.rotation = Math.random()*(360*PIXI.DEG_TO_RAD);

	Common.animator.add(TweenMax.to(this._spriteHolder, 10+(Math.random()*10), {rotation:this._spriteHolder.rotation + (360*PIXI.DEG_TO_RAD), repeat:-1, ease:Linear.easeNone}));
};

/**
 */
BackgroundFloater.prototype.update = function()
{
	ScrollerObject.prototype.update.call(this);	
};

BackgroundFloater.prototype.dispose = function()
{
	TweenMax.killTweensOf(this._spriteHolder);
};

/**
 */
BackgroundFloater.prototype.touch = function()
{

};

/**
 */
BackgroundFloater.prototype.pause = function()
{

}

/**
 */
BackgroundFloater.prototype.resume = function()
{

}

BackgroundFloater.prototype.shiftColour = function(number)
{
	var newSprite = new PIXI.Sprite(this._assetManager.getTexture(this._image));
	newSprite.tint = Common.colours['sky' + number];
	newSprite.anchor = new PIXI.Point(0.5, 0.5);
	this._spriteHolder.addChild(newSprite);

	newSprite.alpha = 0;
	Common.animator.add(TweenMax.to(newSprite, 2, {alpha:1, onCompleteScope:this, onComplete:function(){
		this._spriteHolder.removeChild(this._sprite);
		this._sprite = newSprite;
	}}));
}

BackgroundFloater.prototype.setColour = function(number)
{
	this._sprite.tint = Common.colours['sky' + number];
}


//===================================================
// PRIVATE METHODS
//===================================================



//===================================================
// EVENTS
//===================================================


//===================================================
// GETTERS/SETTERS
//===================================================


//===================================================


},{"../Common":2,"../scroller/ScrollerObject":27}],7:[function(require,module,exports){
var Common          		= require("../Common");
var ScrollerObjectImage  	= require("../scroller/ScrollerObjectImage");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 */
function BackgroundImage(type, removeIfOutsideBoundary, texture, anchor)
{
	ScrollerObjectImage.call(this, type, removeIfOutsideBoundary, texture, anchor);
}
module.exports = BackgroundImage;
BackgroundImage.prototype = Object.create(ScrollerObjectImage.prototype);
BackgroundImage.prototype.constructor = BackgroundImage;


//===================================================
// PUBLIC METHODS
//===================================================

/**
 */
BackgroundImage.prototype.create = function()
{
	ScrollerObjectImage.prototype.create.call(this);
};

/**
 */
BackgroundImage.prototype.update = function()
{
	ScrollerObjectImage.prototype.update.call(this);	
};

BackgroundImage.prototype.shiftColour = function(number)
{
	var newSprite = new PIXI.Sprite(this._texture);
	newSprite.tint = Common.colours['sky' + number];
	this.addChild(newSprite);

	newSprite.alpha = 0;
	Common.animator.add(TweenMax.to(newSprite, 2, {alpha:1, onCompleteScope:this, onComplete:function(){
		this.removeChild(this._image);
		this._image = newSprite;
	}}));
}

BackgroundImage.prototype.setColour = function(number)
{
	this._image.tint = Common.colours['sky' + number];
}



//===================================================
// PRIVATE METHODS
//===================================================



//===================================================
// EVENTS
//===================================================


//===================================================
// GETTERS/SETTERS
//===================================================


//===================================================


},{"../Common":2,"../scroller/ScrollerObjectImage":29}],8:[function(require,module,exports){
var Common          = require("../Common");
var ScrollerObject  = require("../scroller/ScrollerObject");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 */
function Collectible()
{
	this._sprite 	= null;
	this.collected	= false;

	ScrollerObject.call(this, "collectible", false);

	this.template();
}
module.exports = Collectible;
Collectible.prototype = Object.create(ScrollerObject.prototype);
Collectible.prototype.constructor = Collectible;


//===================================================
// PUBLIC METHODS
//===================================================

Collectible.prototype.init = function()
{

}

Collectible.prototype.template = function()
{
	this._sprite = new PIXI.Sprite(this._assetManager.getTexture("pickup"));
	this._sprite.anchor = new PIXI.Point(0.5, 0.5);
	this._sprite.scale = new PIXI.Point(0.75, 0.75);
	this.addChild(this._sprite);

	this.areaRect = new PIXI.Rectangle(-(this._sprite.width/2), -(this._sprite.height/2), this._sprite.width, this._sprite.height);
	this.collisionRect = this.areaRect.clone();
}

Collectible.prototype.create = function()
{

};

Collectible.prototype.update = function()
{
	ScrollerObject.prototype.update.call(this);	
};

Collectible.prototype.dispose = function()
{
	this._sprite.scale = new PIXI.Point(1, 1);
};

Collectible.prototype.pause = function()
{

}

Collectible.prototype.resume = function()
{

}

Collectible.prototype.collect = function()
{
	this.collected = true;
	this._sprite.scale = new PIXI.Point(0, 0);
}


//===================================================
// PRIVATE METHODS
//===================================================



//===================================================
// EVENTS
//===================================================


//===================================================
// GETTERS/SETTERS
//===================================================


//===================================================


},{"../Common":2,"../scroller/ScrollerObject":27}],9:[function(require,module,exports){
var Common          = require("../Common");
var ScrollerObject  = require("../scroller/ScrollerObject");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 */
function ForegroundShadow(image)
{
	this._image			= image;
	this._sprite 		= null;

	ScrollerObject.call(this, "foregroundShadow", false);

	this.template();
}
module.exports = ForegroundShadow;
ForegroundShadow.prototype = Object.create(ScrollerObject.prototype);
ForegroundShadow.prototype.constructor = ForegroundShadow;


//===================================================
// PUBLIC METHODS
//===================================================

ForegroundShadow.prototype.init = function()
{

}

ForegroundShadow.prototype.template = function()
{
	this._sprite = new PIXI.Sprite();
	this.addChild(this._sprite);

	this.removeIfOutsideBoundary = true;

	this.create();
}


/**
 */
ForegroundShadow.prototype.create = function()
{
	this._sprite.texture = this._assetManager.getTexture(this._image);
	this.areaRect = new PIXI.Rectangle(0, 0, this._sprite.width, this._sprite.height);

	this._sprite.anchor = new PIXI.Point(0, 1);
};

/**
 */
ForegroundShadow.prototype.update = function()
{
	ScrollerObject.prototype.update.call(this);	
};

ForegroundShadow.prototype.dispose = function()
{

};

/**
 */
ForegroundShadow.prototype.touch = function()
{

};

/**
 */
ForegroundShadow.prototype.pause = function()
{

}

/**
 */
ForegroundShadow.prototype.resume = function()
{

}

ForegroundShadow.prototype.shiftColour = function(number)
{
	var newSprite = new PIXI.Sprite(this._assetManager.getTexture(this._image));
	newSprite.tint = Common.colours['sky' + number];
	newSprite.anchor = new PIXI.Point(0.5, 0.5);
	this._spriteHolder.addChild(newSprite);

	newSprite.alpha = 0;
	Common.animator.add(TweenMax.to(newSprite, 2, {alpha:1, onCompleteScope:this, onComplete:function(){
		this._spriteHolder.removeChild(this._sprite);
		this._sprite = newSprite;
	}}));
}

ForegroundShadow.prototype.setColour = function(number)
{
	this._sprite.tint = Common.colours['sky' + number];
}



//===================================================
// PRIVATE METHODS
//===================================================



//===================================================
// EVENTS
//===================================================


//===================================================
// GETTERS/SETTERS
//===================================================


//===================================================


},{"../Common":2,"../scroller/ScrollerObject":27}],10:[function(require,module,exports){
var Common          = require("../Common");
var ScrollerObject  = require("../scroller/ScrollerObject");
var Emitter  		= require("../general/Emitter");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 */
function Obstacle(image, id, position, bob)
{
	this._image			= image;
	this.id				= id;
	this._position		= position;
	this._bob			= bob;
	this._sprite 		= null;
	this._glowEmitter 	= null;

	ScrollerObject.call(this, "obstacle", false);

	this.template();
}
module.exports = Obstacle;
Obstacle.prototype = Object.create(ScrollerObject.prototype);
Obstacle.prototype.constructor = Obstacle;


//===================================================
// PUBLIC METHODS
//===================================================

Obstacle.prototype.init = function()
{

}

Obstacle.prototype.template = function()
{
	this._sprite = new PIXI.Sprite();
	this.addChild(this._sprite);

	this.removeIfOutsideBoundary = true;

	this.create();
}


/**
 */
Obstacle.prototype.create = function()
{
	var data = this._assetManager.getJSON('obstacle_data').obstacles[this.id];

	this._sprite.texture = this._assetManager.getTexture(this._image);
	this.areaRect = new PIXI.Rectangle(0, 0, this._sprite.width, this._sprite.height);

	if(data.anchorY)
	{
		if(data.anchorY.min != undefined && data.anchorY.max != undefined)
			this._sprite.anchor.y = data.anchorY.min + ((data.anchorY.max-data.anchorY.min) * Math.random());
		else
			this._sprite.anchor.y = data.anchorY;
	}

	this.areaRect.y = -(this._sprite.height*this._sprite.anchor.y);

	this.collisionRect = this.areaRect.clone();

	if(data.collisionRect != undefined)
	{
		if(data.collisionRect.x)
			this.collisionRect.x += data.collisionRect.x * this._sprite.width;
		if(data.collisionRect.y)
			this.collisionRect.y += data.collisionRect.y * this._sprite.height; 
		if(data.collisionRect.width)
			this.collisionRect.width = data.collisionRect.width * this._sprite.width;
		if(data.collisionRect.height)
			this.collisionRect.height = data.collisionRect.height * this._sprite.height; 
	}

	if(this._bob == true)
	{
		this._sprite.anchor.y += 0.05;
		Common.animator.add(TweenMax.to(this._sprite.anchor, .5, {y:this._sprite.anchor.y - 0.1, ease:Sine.easeInOut, yoyo:true, repeat:-1}));
	
		this._glowEmitter = Emitter.add(this, 
                    ['glow'],
                    "particles_glow", this._sprite.width/2, (this._sprite.height/2)-50);
	}
};

/**
 */
Obstacle.prototype.update = function()
{
	ScrollerObject.prototype.update.call(this);	
};

Obstacle.prototype.dispose = function()
{
	TweenMax.killTweensOf(this._sprite.anchor);

	if(this._glowEmitter)
		Emitter.destroy(this._glowEmitter);
};

/**
 */
Obstacle.prototype.touch = function()
{

};

/**
 */
Obstacle.prototype.pause = function()
{

}

/**
 */
Obstacle.prototype.resume = function()
{

}


//===================================================
// PRIVATE METHODS
//===================================================



//===================================================
// EVENTS
//===================================================


//===================================================
// GETTERS/SETTERS
//===================================================


//===================================================


},{"../Common":2,"../general/Emitter":13,"../scroller/ScrollerObject":27}],11:[function(require,module,exports){
var Common          = require("../Common");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 */
function ScoreBox()
{
	/**
     * @type {p3.AssetManager}
     */
    this._assetManager = p3.AssetManager.instance;

	/**
     * @type {Number}
     */
    this._holder = null;

    /**
     * @type {p3.BitmapText}
     */
    this._text = null;

    this._defaultTextScale = 0.6;

	PIXI.Container.call(this);
}
module.exports = ScoreBox;
ScoreBox.prototype = Object.create(PIXI.Container.prototype);
ScoreBox.prototype.constructor = ScoreBox;


//===================================================
// PUBLIC METHODS
//===================================================



/**
 */
ScoreBox.prototype.init = function()
{
	this._holder = new PIXI.Sprite(this._assetManager.getTexture("scorebox"));
	this._holder.anchor = new PIXI.Point(0.5, 0.5);
	this.addChild(this._holder);

	var girls = new PIXI.Sprite(this._assetManager.getTexture("girls_icon"));
	girls.anchor = new PIXI.Point(0.5, 0.5);
	girls.x = -(girls.width/2);
	girls.y = -10;
	this.addChild(girls);

	this._text = new p3.BitmapText("1000", this._assetManager.getFontAtlas("unpack100_blue"), p3.BitmapText.ALIGN_LEFT);
	this._text.x = 38;
	this._text.y = -33;
	this._text.scale = new PIXI.Point(this._defaultTextScale, this._defaultTextScale);
	this.addChild(this._text);
};

/**
 */
ScoreBox.prototype.updateScore = function(newScore)
{
	this._text.text = newScore.toString();

	if(newScore >= 10)
	{
		this._text.x = 23;
	}
	if(newScore >= 100)
	{
		this._text.x = 11;
	}	
	if(newScore >= 1000)
	{
		this._text.scale.x = this._text.scale.y = 1 * this._defaultTextScale;
		this._text.x = 0;
	}
	if(newScore >= 10000)
	{
		this._text.scale.x = this._text.scale.y = 0.85 * this._defaultTextScale;
		this._text.x = 10;
		this._text.y = -25;
	}
};

ScoreBox.prototype.animateScore = function()
{
	var score = new PIXI.Sprite(Common.generatedTextures.collectibleBonus);
	score.anchor = new PIXI.Point(0.5, 0.5);
	score.scale = new PIXI.Point(0, 0);
	score.x = this._text.x + (this._text.width/2);
	score.y = this._text.y + (this._text.height/2);
	this.addChild(score);

	Common.animator.add(TweenMax.to(score, .6, {y:-100, ease:Sine.easeInOut}));
	Common.animator.add(TweenMax.to(score.scale, .3, {x:0.7, y:0.7, ease:Expo.easeInOut, yoyo:true, repeat:1}));
}


//===================================================
// PRIVATE METHODS
//===================================================


//===================================================
// EVENTS
//===================================================



//===================================================
// GETTERS/SETTERS
//===================================================


//===================================================




},{"../Common":2}],12:[function(require,module,exports){
/**
 *  TrailRenderer
 *
 *  Created by Legman on 24/09/2015.
 *
 */

var Common      = require("../Common");

/**
 * @constructor
 */
function TrailRenderer() {
    /**
     * @type {Number}
     */
    this.time = 1.0;

    /**
     * @type {number}
     */
    this.vertexDistance = 8.0;

    /**
     * @type {Number}
     */
    this.thickness = 8.0;

    /**
     * @type {Number}
     */
    this.color = 0xFFFFFF;

    /**
     * @type {Boolean}
     */
    this.enabled = true;

    /**
     * @type {Array}
     * @private
     */
    this._vertices = [];

    PIXI.Graphics.call(this);
}
module.exports                          = TrailRenderer;
TrailRenderer.prototype                 = Object.create(PIXI.Graphics.prototype);
TrailRenderer.prototype.constructor     = TrailRenderer;

TrailRenderer.prototype.dispose = function() {
};

/**
 * @param {!Number} x
 * @param {!Number} y
 */
TrailRenderer.prototype.draw = function(x, y) {
    this.clear();

    var vertex;
    for (var i = this._vertices.length - 1; i >= 0; -- i) {
        vertex = this._vertices[i];
        if ((window.performance.now() * 0.001) - vertex.time > this.time) {
            this._vertices.splice(i, 1);
        }
    }

    if (this._vertices.length > 1) {
        this.moveTo(this.first.x, this.first.y);
        this.lineStyle(this.thickness, this.color);

        for (i = 1; i < this._vertices.length; ++ i) {
            vertex = this._vertices[i];

            this.lineTo(vertex.x, vertex.y);
        }
        if (this.enabled) {
            this.lineTo(x, y);
        }
    }

    if (!this.first) {
        this.recordVertex(x, y);
    } else {
        var direction = new p3.Vector2(x - this.last.x, y - this.last.y);
        if (direction.lengthSq > this.vertexDistance * this.vertexDistance) {
            this.recordVertex(x, y);
        }
    }
};

TrailRenderer.prototype.reset = function() {
    this._vertices.length = 0;
};

/**
 * @param {!Number} x
 * @param {!Number} y
 */
TrailRenderer.prototype.recordVertex = function(x, y) {
    if (!this.enabled) return;

    var vertex = {
        x: x,
        y: y,
        time: window.performance.now() * 0.001
    };
    this._vertices.push(vertex);
};

Object.defineProperty(TrailRenderer.prototype, "first", {
    /**
     * @returns {PIXI.Point}
     */
    get: function() {
        return this._vertices.length ? this._vertices[0] : null;
    }
});

Object.defineProperty(TrailRenderer.prototype, "last", {
    /**
     * @returns {PIXI.Point}
     */
    get: function() {
        return this._vertices.length ? this._vertices[this._vertices.length - 1] : null;
    }
});

},{"../Common":2}],13:[function(require,module,exports){

var Common          = require("../Common");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 */
function Emitter() {
}
module.exports = Emitter;

//===================================================
// PUBLIC METHODS
//===================================================


/**
 * @param {!PIXI.Container} parent
 * @param {!Array<String>} textures
 * @param {!String} json
 * @param {Number=} x
 * @param {Number=} y
 * @param {Number=} removeTime
 * @param {Boolean=} autoEmit
 * @returns {cloudkid.Emitter} emitter
 */
Emitter.add = function(parent, textures, json, x, y, removeTime, autoEmit, destroyTime)
{
    if(autoEmit == undefined) autoEmit = true;
    if(destroyTime == undefined) destroyTime = 1;

    x = x || 0;
    y = y || 0;

    var assetManager = p3.AssetManager.instance;

    for(var i = 0; i < textures.length; i++)
    {
        textures[i] = assetManager.getTexture(textures[i]);
    }    

    var emitter = new cloudkid.Emitter(
        parent,
        textures,
        assetManager.getJSON(json)
    );
    if(autoEmit)
        emitter.emit = true;
    else
        emitter.emit = false;

    emitter.updateOwnerPos(x, y);

    Common.animator.add(emitter);

    if(removeTime != null)
    {    
        Common.animator.setTimeout(function(){
            Emitter.destroy(emitter, destroyTime);
        }, removeTime, this);
    }

    return emitter;
};

Emitter.destroy = function(emitter, destroyDelay)
{
    if(emitter != null)
    {    
        destroyDelay = destroyDelay || 0;

        emitter.emit = false;
        Common.animator.setTimeout(function(){
            Common.animator.remove(emitter);
            emitter.destroy();
        }, destroyDelay, this);
    }
}




//===================================================
// PRIVATE METHODS
//===================================================

//===================================================
// EVENTS
//===================================================

//===================================================
// GETTERS/SETTERS
//===================================================

//===================================================
},{"../Common":2}],14:[function(require,module,exports){
/**
 *  Tween
 *
 *  Created by Legman on 11/06/2015.
 *
 */

var Common          = require("../Common");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 */
function SoundSFX() {
}
module.exports = SoundSFX;

//===================================================
// PUBLIC METHODS
//===================================================

/**
 * @param {!p3.Button} button
 * @param {Boolean=} enableClickSound
 * @param {Boolean=} enableOverSound
 */
SoundSFX.button = function(button, enableClickSound, enableOverSound) {
    enableClickSound = enableClickSound == undefined ? true : enableClickSound;
    enableOverSound = enableOverSound == undefined ? true : enableOverSound;

    if(enableClickSound)
    {    
        button.signals.click.add(function(button) {
            p3.AudioManager.instance.playSound("sfx_btn_press_reverb");
        }, this);
    }

    if(enableOverSound)
    {    
        button.signals.over.add(function(button) {
            p3.AudioManager.instance.playSound("sfx_btn_rollover_reverb");
        }, this);
    }
};

/**
 * @param {!String} sound
 * @param {Object=} params
 * @param {Number=} delay
 */
SoundSFX.play = function(sound, params, delay) {

    if(delay == null)
    {    
        return p3.AudioManager.instance.playSound(sound, params);
    }
    else
    {    
        Common.animator.setTimeout(function(){
            p3.AudioManager.instance.playSound(sound, params);
        }, delay, this);
    }
};

SoundSFX.playMusic = function(sound, params, delay) {

    if(delay == null)
    {    
        p3.AudioManager.instance.playMusic(sound, params);
    }
    else
    {    
        Common.animator.setTimeout(function(){
            p3.AudioManager.instance.playMusic(sound, params);
        }, delay, this);
    }
};

/**
 * @param {!String} sound
 */
SoundSFX.stop = function(sound) {
    var currentSounds = p3.AudioManager.instance.soundsSFX;
    for(var i = 0; i < currentSounds.length; i++)
    {
        if(currentSounds[i].name == sound)
        {
           p3.AudioManager.instance.stopSound(sound);
        }   
    }
};

/**
 * @param {!Array <String>} sounds
 */
SoundSFX.playRandomFrom = function(sounds) {
	p3.AudioManager.instance.playSound(sounds[Math.floor(Math.random()*sounds.length)]);
};

SoundSFX.isSoundPlaying = function(sound)
{
    var currentSounds = p3.AudioManager.instance.soundsSFX;
    for(var i = 0; i < currentSounds.length; i++)
    {
        if(currentSounds[i].name == sound)
        {
           return true;
        }   
    }
    return false;
};

SoundSFX.stopAllVO = function()
{
    var currentSounds = p3.AudioManager.instance.soundsSFX;
    for(var i = 0; i < currentSounds.length; i++)
    {
        if(currentSounds[i].name.indexOf("vo_") > -1)
        {
           p3.AudioManager.instance.stopSound(currentSounds[i].name);
        }   
    }
}




//===================================================
// PRIVATE METHODS
//===================================================

//===================================================
// EVENTS
//===================================================

//===================================================
// GETTERS/SETTERS
//===================================================

//===================================================


},{"../Common":2}],15:[function(require,module,exports){
/**
 *  Scene
 *
 *  Created by Legman on 4/09/2015.
 *
 */

/**
 * @constructor
 */
function Scene() {
    this.signals            = {};
    this.signals.next       = new signals.Signal();
    this.signals.previous   = new signals.Signal();
    this.signals.home       = new signals.Signal();
    this.signals.pause      = new signals.Signal();

    PIXI.Container.call(this);
}
module.exports                  = Scene;
Scene.prototype                 = Object.create(PIXI.Container.prototype);
Scene.prototype.constructor     = Scene;

/**
 * This method is called when a scene is initialized.
 */
Scene.prototype.init = function() {
    // override
};

/**
 * This method is called when a scene is destroyed.
 */
Scene.prototype.dispose = function() {
    this.signals.next.dispose();
    this.signals.previous.dispose();
    this.signals.home.dispose();
    this.signals.pause.dispose();

    this.removeChildren();
};

/**
 * This method is called when the device dimensions are changed.
 */
Scene.prototype.resize = function() {
    // override
};

/**
 * This method is called when the scene is 'top' of the stack.
 */
Scene.prototype.update = function() {
    // override
};

/**
 * This method is called when the scene is shown for the first time.
 */
Scene.prototype.appear = function() {
    this.animateIn();
};

/**
 * This method is called when the scene is shown - regardless of actual visibility.
 */
Scene.prototype.show = function() {
    this.animateIn();
};

/**
 * This method is called when the scene is hidden - regardless of actual visibility.
 */
Scene.prototype.hide = function() {
    // override
};

/**
 * @param {Function=} callback
 * @param {*=} scope
 */
Scene.prototype.animateIn = function(callback, scope) {
    scope = scope || window;
    if (callback) {
        callback.call(scope);
    }
};

/**
 * @param {!Function} callback
 * @param {*=} scope
 */
Scene.prototype.animateOut = function(callback, scope) {
    scope = scope || window;
    if (callback) {
        callback.call(scope);
    }
};
},{}],16:[function(require,module,exports){
/**
 *  SceneManager
 *
 *  Created by Legman on 4/09/2015.
 *
 */

var Scene       = require("./Scene");
var Transition  = require("./Transition");

/**
 * @constructor
 */
function SceneManager() {
    /**
     * @type {PIXI.DisplayObject}
     * @private
     */
    this._stage = null;

    /**
     * @type {PIXI.CanvasRenderer | PIXI.WebGLRenderer}
     * @private
     */
    this._renderer = null;

    /**
     * @type {Array.<Scene>}
     * @private
     */
    this._stack = [];

    /**
     * @type {Transition}
     * @private
     */
    this._transition = null;
}
module.exports = SceneManager;

/**
 * @param {!PIXI.DisplayObject} stage
 * @param {!PIXI.CanvasRenderer | !PIXI.WebGLRenderer} renderer
 */
SceneManager.prototype.init = function(stage, renderer) {
    this._stage         = stage;
    this._renderer      = renderer;
};

/**
 */
SceneManager.prototype.update = function() {
    if (this._stack.length) {
        this.top.update();
    }
};

/**
 * @param {!Scene} scene
 * @param {Transition=} transition
 */
SceneManager.prototype.add = function(scene, transition) {
    if (this.transitionInProgress) return;

    this._transition = transition || new Transition();
    if (this._transition.requiresWebGL && !(this._renderer instanceof PIXI.WebGLRenderer)) {
        this._transition            = transition.fallback();
        this._transition.push       = transition.push;
        this._transition.replace    = transition.replace;
        this._transition.wait       = transition.wait;
    }
    this._transition.init();
    this._stage.addChild(this._transition);

    this._transition.signals.in.addOnce(function(transition) {
        p3.Timestep.queueCall(swap, [scene], this);
    }, this);
    this._transition.signals.out.addOnce(function(transition) {
        this._transition = null;

        transition.parent.removeChild(transition);
        transition.dispose();

        if (transition.wait) {
            p3.Timestep.queueCall(scene.appear, null, scene);
        }
    }, this);
    this._transition.in();

    function swap(scene) {
        if (this.top) {
            this.top.hide();
            if (!this._transition.push) {
                while (this.top) {

                    this.top.parent && this.top.parent.removeChild(this.top);
                    this.top.dispose();
                    this._stack.pop();
                }
            } else if (this._transition.replace) {
                var temp;
                for (var i = 0; i < this._stack.length; ++ i) {
                    temp = this._stack[i];
                    if (temp.parent) {
                        temp.parent.removeChild(temp);
                    }
                }
            }
        }

        scene.init();
        scene.resize();
        if (!scene.parent) {
            this.stage.addChildAt(scene, this._transition.parent.getChildIndex(this._transition));
        }
        this._stack.push(scene);

        if (!this._transition.wait) {
            p3.Timestep.queueCall(scene.appear, null, scene);
        }
        this._transition.out();

        console.log(this._stack);
    }
};

/**
 * @param {Transition=} transition
 * @param {Number=} count
 */
SceneManager.prototype.remove = function(transition, count) {
    if (this.transitionInProgress) return;

    this._transition    = transition || new Transition();
    count               = Math.max(1, count) || 1;
    if (this._transition.requiresWebGL && !(this._renderer instanceof PIXI.WebGLRenderer)) {
        this._transition            = transition.fallback();
        this._transition.push       = transition.push;
        this._transition.replace    = transition.replace;
        this._transition.wait       = transition.wait;
    }
    this._transition.init();
    this._stage.addChild(this._transition);

    this._transition.signals.in.addOnce(function(transition) {
        p3.Timestep.queueCall(swap, [count], this);
    }, this);
    this._transition.signals.out.addOnce(function(transition) {
        this._transition = null;

        transition.parent.removeChild(transition);
        transition.dispose();

        if (transition.wait) {
            this.top.show();
        }
    }, this);
    this._transition.in();

    function swap(count) {
        for (var i = 0; i < count; ++ i) {
            this.top.hide();
            this.top.parent && this.top.parent.removeChild(this.top);
            this.top.dispose();
            this._stack.pop();
        }

        var scene = this.top;
        scene.resize();
        if (!scene.parent) {
            this.stage.addChildAt(scene, this._transition.parent.getChildIndex(this._transition));
        }

        if (!this._transition.wait) {
            scene.show();
        }
        this._transition.out();

        console.log(this._stack);
    }
};

/**
 */
SceneManager.prototype.clear = function() {
};

/**
 */
SceneManager.prototype.resize = function() {
    var scene;
    for (var i = 0; i < this._stack.length; ++ i) {
        scene = this._stack[i];
        scene.resize();
    }
    if (this._transition) {
        this._transition.resize();
    }
};

Object.defineProperty(SceneManager.prototype, "stage", {
    /**
     * @returns {PIXI.DisplayObject}
     */
    get: function() {
        return this._stage;
    }
});

Object.defineProperty(SceneManager.prototype, "top", {
    /**
     * @returns {Scene}
     */
    get: function() {
        return this._stack.length ? this._stack[this._stack.length - 1] : null;
    }
});

Object.defineProperty(SceneManager.prototype, "transitionInProgress", {
    /**
     * @returns {Boolean}
     */
    get: function() {
        return (this._transition != null ? true : false);
    }
});

},{"./Scene":15,"./Transition":17}],17:[function(require,module,exports){
/**
 *  Transition
 *
 *  Created by Legman on 4/09/2015.
 *
 */

/**
 * @constructor
 */
function Transition() {
    /**
     * @type {*}
     */
    this.signals        = {};
    this.signals.in     = new signals.Signal();
    this.signals.out    = new signals.Signal();

    /**
     * @type {Boolean}
     */
    this.push = false;

    /**
     * @type {Boolean}
     */
    this.replace = true;

    /**
     * @type {Boolean}
     */
    this.wait = true;

    /**
     * @type {Boolean}
     */
    this.requiresWebGL = false;

    PIXI.Container.call(this);
}
module.exports                      = Transition;
Transition.prototype                = Object.create(PIXI.Container.prototype);
Transition.prototype.constructor    = Transition;

Transition.prototype.init = function() {
    // override
};

Transition.prototype.dispose = function() {
    this.signals.in.dispose();
    this.signals.out.dispose();

    this.removeChildren();
};

Transition.prototype.in = function() {
    this.signals.in.dispatch(this);
};

Transition.prototype.out = function() {
    this.signals.out.dispatch(this);
};

/**
 * @returns {Transition}
 */
Transition.prototype.resize = function() {
    // override
};

Transition.prototype.fallback = function() {
    // override
};
},{}],18:[function(require,module,exports){

var Common          		= require("../Common");
var SimpleScreen            = require("../screens/SimpleScreen");
var SoundSFX                = require("../general/SoundSFX");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 */
function PauseOverlay()
{
    this._overlay              = null;

    this._panel                = null;

    this._resumeButton         = null;
    this._helpButton           = null;
    this._exitButton           = null;
    this._leftButton           = null;
    this._rightButton          = null;

    this._title                = null;

    this._instructionsPage     = null;
    this._areYouSurePage       = null;

    this._contents             = null;
    this._imageContainer       = null;
    this._currentPage          = 0;

    this._introHelpMode        = false;

    this._text                 = null;
    this._liveText             = false;

    SimpleScreen.call(this);
}
module.exports = PauseOverlay;
PauseOverlay.prototype = Object.create(SimpleScreen.prototype);
PauseOverlay.prototype.constructor = PauseOverlay;


//===================================================
// PUBLIC METHODS
//===================================================

/**
 */
PauseOverlay.prototype.init = function()
{
    console.log("PAUSE INITIALIZED");

    SimpleScreen.prototype.init.call(this);

    this._overlay = new PIXI.Sprite(Common.generatedTextures['blackSquare']);
    this._overlay.alpha = 0.7;
    this._overlay.width = Common.STAGE_WIDTH;
    this._overlay.height = Common.STAGE_HEIGHT;
    this._overlay.hitArea = new PIXI.Rectangle(0, 0, Common.STAGE_WIDTH, Common.STAGE_HEIGHT);
    this._overlay.interactive = true;
    this.addChild(this._overlay);

    this._panel = new PIXI.Sprite(this._assetManager.getTexture("panel"));
    this._panel.anchor = new PIXI.Point(0.5, 0.5);
    this._panel.x = Common.STAGE_WIDTH / 2;
    this._panel.y = Common.STAGE_HEIGHT / 2;
    this.addChild(this._panel);

    this._addMuteButton();

    this._instructionsPage = new PIXI.Container();
    this.addChild(this._instructionsPage);

    this._areYouSurePage = new PIXI.Container();
    this._areYouSurePage.visible = false;
    this.addChild(this._areYouSurePage);

    this._exitButton = new p3.Button(
            this._assetManager.getTexture("but_exit_def"),
            this._assetManager.getTexture("but_exit_over"),
            this._assetManager.getTexture("but_exit_pressed"));
    this._exitButton.init();
    this._exitButton.y = this._guiButtonTopMargin;
    this._exitButton.signals.down.add(this.exitClicked, this);
    this._exitButton.signals.over.add(this.buttonRollover, this);
    this._instructionsPage.addChild(this._exitButton);

//Instructions Page

    var copy = this._assetManager.getJSON("config")['copy']["INSTRUCTIONS_TITLE"][Common.COUNTRY_CODE];
    if(!copy.live)
    {
        this._title = new p3.BitmapText(copy.text, this._assetManager.getFontAtlas("unpack70_whitetitle"), p3.BitmapText.ALIGN_CENTER);
        this._title.anchor = new PIXI.Point(0.5, 0.5);
    }
    else
        this._title = new PIXI.Text(copy.text, {font: "50px FredFredburgerAra-Regular", fill: 0xFFFFFF, align: "center", stroke: 0xFFFFFF, strokeThickness: 1});
    
    this._title.x = Common.STAGE_WIDTH / 2;
    this._title.y = 135;
    this._instructionsPage.addChild(this._title);

    if(copy.live)
        this._title.x -= this._title.width * 0.5;

    this._contents = [];

    var ext = "";
    if(!p3.Device.isMobile)
        ext = "_PC";

    var copy = this._assetManager.getJSON("config")['copy']["INSTRUCTIONS_1"][Common.COUNTRY_CODE];
    this._contents.push({image:this._assetManager.getTexture('tutorial1'), text:copy.text, scale:copy.scale, offset:copy.offset});
    var copy = this._assetManager.getJSON("config")['copy']["INSTRUCTIONS_2" + ext][Common.COUNTRY_CODE];
    this._contents.push({image:this._assetManager.getTexture('tutorial2'), text:copy.text, scale:copy.scale, offset:copy.offset});
    var copy = this._assetManager.getJSON("config")['copy']["INSTRUCTIONS_3" + ext][Common.COUNTRY_CODE];
    this._contents.push({image:this._assetManager.getTexture('tutorial3'), text:copy.text, scale:copy.scale, offset:copy.offset});

    this._imageContainer = new PIXI.Sprite();
    this._imageContainer.x = Common.STAGE_WIDTH / 2;
    this._imageContainer.y = (Common.STAGE_HEIGHT / 2) - 20;
    this._instructionsPage.addChild(this._imageContainer);

    this._image = new PIXI.Sprite(this._contents[0].image);
    this._image.anchor.x = this._image.anchor.y = 0.5;
    this._imageContainer.addChild(this._image);

    if(!copy.live)
        this._text = new p3.BitmapText(this._contents[0].text, this._assetManager.getFontAtlas("unpack40_white"), p3.BitmapText.ALIGN_CENTER);
    else
        this._text = new PIXI.Text(this._contents[0].text, {font: "35px FredFredburgerAra-Regular", fill: 0xFFFFFF, align: "center", stroke: 0xFFFFFF, strokeThickness: 1});

    this._text.x = Common.STAGE_WIDTH / 2;
    this._text.y = (Common.STAGE_HEIGHT / 2) + 150;
    this._text.scale = new PIXI.Point(this._contents[0].scale, this._contents[0].scale);
    this._instructionsPage.addChild(this._text);

    this._liveText = copy.live;

    if(this._liveText)
    {
        this._text.x -= this._text.width * 0.5;
        this._text.x += copy.offset.x;
        this._text.y += copy.offset.y;
    }

    this._leftButton = new p3.Button(
        this._assetManager.getTexture("but_arrow_def"),
        this._assetManager.getTexture("but_arrow_over"),
        this._assetManager.getTexture("but_arrow_pressed")
        );
    this._leftButton.init();
    this._leftButton.y = Common.STAGE_HEIGHT / 2;
    this._leftButton.x = (Common.STAGE_WIDTH / 2) - 350;
    this._leftButton.scale.x = -1;
    this._leftButton.signals.down.add(this.leftClicked, this);
    this._leftButton.signals.over.add(this.buttonRollover, this);
    this._leftButton.animate = false;
    this._leftButton.visible = false;
    this._instructionsPage.addChild(this._leftButton);

    this._rightButton = new p3.Button(
        this._assetManager.getTexture("but_arrow_def"),
        this._assetManager.getTexture("but_arrow_over"),
        this._assetManager.getTexture("but_arrow_pressed")
        );
    this._rightButton.init();
    this._rightButton.y = Common.STAGE_HEIGHT / 2;
    this._rightButton.x = (Common.STAGE_WIDTH / 2) + 350;
    this._rightButton.signals.down.add(this.rightClicked, this);
    this._rightButton.signals.over.add(this.buttonRollover, this);
    this._rightButton.animate = false;
    this._instructionsPage.addChild(this._rightButton);

    this._playButton = new p3.Button(
        this._assetManager.getTexture("but_play_def"),
        this._assetManager.getTexture("but_play_over"),
        this._assetManager.getTexture("but_play_pressed")
        );
    this._playButton.init();
    this._playButton.x = (Common.STAGE_WIDTH/2) + (this._panel.width/2);
    this._playButton.y = (Common.STAGE_HEIGHT/2) + (this._panel.height/2);
    this._playButton.signals.down.add(this.rightClicked, this);
    this._playButton.signals.over.add(this.buttonRollover, this);
    this._playButton.visible = false;
    this._instructionsPage.addChild(this._playButton);

    this._resumeButton = new p3.Button(
        this._assetManager.getTexture("but_play_def"),
        this._assetManager.getTexture("but_play_over"),
        this._assetManager.getTexture("but_play_pressed")
        );
    this._resumeButton.init();
    this._resumeButton.x = (Common.STAGE_WIDTH/2) + (this._panel.width/2) + 10;
    this._resumeButton.y = (Common.STAGE_HEIGHT/2) + (this._panel.height/2) + 10;
    this._resumeButton.signals.down.add(this.resumeClicked, this);
    this._resumeButton.signals.over.add(this.buttonRollover, this);
    this._instructionsPage.addChild(this._resumeButton);


//Are You Sure Page

    var copy = this._assetManager.getJSON("config")['copy']["QUIT"][Common.COUNTRY_CODE];
    if(!copy.live)
        var text = new p3.BitmapText(copy.text, this._assetManager.getFontAtlas("unpack70_whitetitle"), p3.BitmapText.ALIGN_CENTER);
    else
        var text = new PIXI.Text(copy.text, {font: "50px FredFredburgerAra-Regular", fill: 0xFFFFFF, align: "center", stroke: 0xFFFFFF, strokeThickness: 1});
    text.x = (Common.STAGE_WIDTH/2) + copy.offset.x;
    text.y = (Common.STAGE_HEIGHT/2)-150 + copy.offset.y;
    text.scale = new PIXI.Point(copy.scale, copy.scale);
    this._areYouSurePage.addChild(text);
    if(copy.live)
        text.x -= text.width * 0.5;

    var yesButton = new p3.Button(
        this._assetManager.getTexture("but_ok_def"),
        this._assetManager.getTexture("but_ok_over"),
        this._assetManager.getTexture("but_ok_pressed")
    );
    yesButton.init();
    yesButton.x = (Common.STAGE_WIDTH/2)-100;
    yesButton.y = (Common.STAGE_HEIGHT/2) + 80;
    yesButton.signals.down.add(this.quitYesClicked, this);
    yesButton.signals.over.add(this.buttonRollover, this);
    this._areYouSurePage.addChild(yesButton);

    var noButton = new p3.Button(
        this._assetManager.getTexture("but_close_def"),
        this._assetManager.getTexture("but_close_over"),
        this._assetManager.getTexture("but_close_pressed")
    );
    noButton.init();
    noButton.x = (Common.STAGE_WIDTH/2)+100;
    noButton.y = (Common.STAGE_HEIGHT/2) + 80;
    noButton.signals.down.add(this.quitNoClicked, this);
    noButton.signals.over.add(this.buttonRollover, this);
    this._areYouSurePage.addChild(noButton);

};

/**
 */
PauseOverlay.prototype.update = function()
{
    this._exitButton.x = this._getFirstButtonPositionLeft();
    this._muteButton.x = this._getFirstButtonPositionRight();
};

/**
 */
PauseOverlay.prototype.resize = function()
{
    SimpleScreen.prototype.resize.call(this);
};

/**
 */
PauseOverlay.prototype.dispose = function()
{
    
}

/**
 */
PauseOverlay.prototype.setIntroHelpMode = function()
{
    this._resumeButton.visible = false;
    this._introHelpMode = true;
}

/**
 * @param {Function=} callback
 * @param {*=}scope
 */
PauseOverlay.prototype.animateIn = function(callback, scope) {
    
    SimpleScreen.prototype.animateIn.call(this);
};

/**
 * @param {Function=} callback
 * @param {*=} scope
 */
PauseOverlay.prototype.animateOut = function(callback, scope) {
        
    SimpleScreen.prototype.animateOut.call(this);
};

/**
 * @param {!Number} page
 */
PauseOverlay.prototype.setPage = function(page)
{
    var newImage = new PIXI.Sprite(this._contents[page].image);
    newImage.x = this._contents[page].x || 0;
    newImage.y = this._contents[page].y || 0;
    newImage.anchor = new PIXI.Point(0.5, 0.5);
    newImage.alpha = 0;
    this._imageContainer.addChild(newImage);

    Common.animator.add(TweenMax.to(this._image, .5, {alpha:0, ease:Sine.easeOut}));
    Common.animator.add(TweenMax.to(newImage, .5, {alpha:1, ease:Sine.easeOut, onCompleteScope:this, onComplete:function(){
        this._imageContainer.removeChild(this._image);
        this._image = newImage;
    }}));

    this._text.text = this._contents[page].text;
    this._text.scale = new PIXI.Point(this._contents[page].scale, this._contents[page].scale);

    if(this._liveText)
    {
        this._text.x = (Common.STAGE_WIDTH / 2) - (this._text.width * 0.5);
        this._text.x += this._contents[page].offset.x;
        this._text.y = (Common.STAGE_HEIGHT / 2) + 150 + this._contents[page].offset.y;
    }
  
    if(page == 0)
        this._leftButton.visible = false;
    else
        this._leftButton.visible = true;

    if(page == this._contents.length-1)
    {
        this._rightButton.visible = false;
        if(this._introHelpMode)
            this._playButton.visible = true;
    }
    else
    {
        this._rightButton.visible = true;
        if(this._introHelpMode)
            this._playButton.visible = false;
    }

    this._currentPage = page;
}




//===================================================
// PRIVATE METHODS
//===================================================


//===================================================
// EVENTS
//===================================================

/**
 */
PauseOverlay.prototype.leftClicked = function()
{    
    this.setPage(this._currentPage-1);
    SoundSFX.play('sfx_ui_press_button_01');
};

/**
 */
PauseOverlay.prototype.rightClicked = function()
{    
    if(this._currentPage == this._contents.length-1)
    {
        this.signals.requestedNextScreen.dispatch();
    }
    else
    {
        this.setPage(this._currentPage+1);
    }
    SoundSFX.play('sfx_ui_press_button_01');
};

/**
 */
PauseOverlay.prototype.resumeClicked = function()
{
    p3.Timestep.queueCall(this.signals.requestedNextScreen.dispatch, [], this);
    SoundSFX.play('sfx_ui_pressplay_00');
};

/**
 */
PauseOverlay.prototype.exitClicked = function()
{
    this._instructionsPage.visible = false;
    this._areYouSurePage.visible = true;
    SoundSFX.play('sfx_ui_press_button_01');  
};

/**
 */
PauseOverlay.prototype.helpClicked = function()
{    
    this.showHelp();
};

/**
 */
PauseOverlay.prototype.quitYesClicked = function()
{
    this.signals.requestedPreviousScreen.dispatch();
    SoundSFX.play('sfx_ui_press_button_01');
};

/**
 */
PauseOverlay.prototype.quitNoClicked = function()
{
    this._instructionsPage.visible = true;
    this._areYouSurePage.visible = false;
    SoundSFX.play('sfx_ui_press_button_01');
};

/**
 */
PauseOverlay.prototype.buttonRollover = function()
{

}


//===================================================
// GETTERS/SETTERS
//===================================================


//===================================================


},{"../Common":2,"../general/SoundSFX":14,"../screens/SimpleScreen":23}],19:[function(require,module,exports){

var Common                  = require("../Common");
var SimpleScreen            = require("./SimpleScreen");
var SoundSFX                = require("../general/SoundSFX");
var Emitter                 = require("../general/Emitter");
var Collectible             = require("../game/Collectible");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 */
function GameOverScreen(distance, hearts)
{
    this._distance      = distance || 10000;
    this._hearts        = hearts || 50;

    this._bg            = null;
    this._panel         = null;
    this._scoreText     = null;
    this._trophy        = null;
    this._bestScoreText = null;
    this._heartParticle = null;

    this._playButton    = null;
    this._muteButton    = null;
    this._homeButton    = null;

    this._mojo          = null;
    this._mojoText      = null;

    this._currentHeart  = 0;
    this._addingHearts  = false;
    this._heartsAdded   = false;

    SimpleScreen.call(this);
}
module.exports = GameOverScreen;
GameOverScreen.prototype = Object.create(SimpleScreen.prototype);
GameOverScreen.prototype.constructor = GameOverScreen;


//===================================================
// PUBLIC METHODS
//===================================================

/**
 */
GameOverScreen.prototype.init = function()
{
    console.log("SPLASH INITIALIZED");

    SimpleScreen.prototype.init.call(this);

    console.log(this._hearts);

    this._bg = new PIXI.Sprite(this._assetManager.getTexture("bg_blue"));
    this._bg.anchor = new PIXI.Point(0.5, 0.5);
    this._bg.x = Common.STAGE_WIDTH / 2;
    this._bg.y = Common.STAGE_HEIGHT / 2;
    this.addChild(this._bg);

    this._panel = new PIXI.Sprite(this._assetManager.getTexture('panel_score'));
    this._panel.anchor = new PIXI.Point(0.5, 0.65);
    this._panel.x = Common.STAGE_WIDTH / 2;
    this._panel.y = Common.STAGE_HEIGHT / 2;
    this.addChild(this._panel);
    /*
    var greatFlying = new p3.BitmapText("GREAT FLYING!", this._assetManager.getFontAtlas("unpack90_pink"), p3.BitmapText.ALIGN_CENTER);
    greatFlying.x = 0;
    greatFlying.y = -110;
    this._panel.addChild(greatFlying);*/

    var copy = this._assetManager.getJSON("config")['copy']["GREAT_FLYING"][Common.COUNTRY_CODE];
    var text;
    if(!copy.live)
        text = new p3.BitmapText(copy.text, this._assetManager.getFontAtlas("unpack90_pink"), p3.BitmapText.ALIGN_CENTER);
    else
        text = new PIXI.Text(copy.text, {font: "70px FredFredburgerAra-Regular", fill: 0xeb346b, align: "center", stroke: 0x0, strokeThickness: 7});
    text.x = 0 + copy.offset.x;
    text.y = -110 + copy.offset.y;
    text.scale.x = text.scale.y = copy.scale;
    this._panel.addChild(text);
    if(copy.live)
        text.x -= text.width * 0.5;

    this._scoreText = new p3.BitmapText(this._distance.toString(), this._assetManager.getFontAtlas("unpack100_blue"), p3.BitmapText.ALIGN_CENTER);
    this._scoreText.x = 0;
    this._scoreText.y = -30;
    this._panel.addChild(this._scoreText);

    this._trophy = new PIXI.Sprite(this._assetManager.getTexture("icon_trophy"));
    this._trophy.anchor = new PIXI.Point(0.5, 0.5);
    this._trophy.x = -60;
    this._trophy.y = 130;
    this._panel.addChild(this._trophy);

    this._bestScoreText = new p3.BitmapText(Common.savedData.bestScore.toString(), this._assetManager.getFontAtlas("unpack60_yellow"), p3.BitmapText.ALIGN_LEFT);
    this._bestScoreText.x = -5;
    this._bestScoreText.y = 95;
    this._bestScoreText.scale = new PIXI.Point(0.7, 0.7);
    this._panel.addChild(this._bestScoreText);

    this._playButton = new p3.Button(this._assetManager.getTexture("but_replay_def"), this._assetManager.getTexture("but_replay_over"), this._assetManager.getTexture("but_replay_pressed"));
    this._playButton.x = (Common.STAGE_WIDTH / 2) + 400;
    this._playButton.y = Common.STAGE_HEIGHT - 115;
    this._playButton.signals.down.addOnce(this.playClicked, this);
    this._playButton.signals.over.add(this.buttonOver, this);
    this._playButton.scale = new PIXI.Point(0, 0);
    this._playButton.animate = false;
    this.addChild(this._playButton);

    this._homeButton = new p3.Button(this._assetManager.getTexture("but_home_def"), this._assetManager.getTexture("but_home_over"), this._assetManager.getTexture("but_home_pressed"))
    this._homeButton.y = this._guiButtonTopMargin;
    this._homeButton.signals.down.addOnce(this.homeClicked, this);
    this._homeButton.signals.over.add(this.buttonOver, this);
    this._homeButton.scale = new PIXI.Point(0, 0);    
    this.addChild(this._homeButton);

    this._mojo = new PIXI.Sprite(this._assetManager.getTexture("mojojojo_endsc"));
    this._mojo.anchor.x = 1;
    this._mojo.x = (Common.STAGE_WIDTH/2) - 120;
    this._mojo.y = Common.STAGE_HEIGHT;
    this.addChild(this._mojo);

    this._mojoText = new PIXI.Sprite(this._assetManager.getTexture("speech_bubble"));
    this._mojoText.anchor = new PIXI.Point(0.3, 0.5);
    this._mojoText.x = (Common.STAGE_WIDTH/2) - 100;
    this._mojoText.y = 650;
    this.addChild(this._mojoText);

    var copy = this._assetManager.getJSON("config")['copy']["ILL_BE_BACK"][Common.COUNTRY_CODE];
    var text;
    if(!copy.live)
        text = new p3.BitmapText(copy.text, this._assetManager.getFontAtlas("unpack50_black"), p3.BitmapText.ALIGN_CENTER);
    else
        text = new PIXI.Text(copy.text, {font: "40px FredFredburgerAra-Regular", fill: 0x000000, align: "center", stroke: 0x0, strokeThickness: 1});
    text.x = 165 + copy.offset.x;
    text.y = -(this._mojoText.height / 2) + 10 + copy.offset.y;
    text.scale.x = text.scale.y = copy.scale;
    this._mojoText.addChild(text);
    if(copy.live)
        text.x -= text.width * 0.5;

    this._mojoText.scale = new PIXI.Point(0, 0);

    this._addMuteButton();

    //Common.animator.setTimeout(this.addHearts, 1, this);
    SoundSFX.play('sfx_game_end_00');
};

/**
 */
GameOverScreen.prototype.update = function()
{
    /*
    if(this._addingHearts)
    {
        if(this._currentHeart < this._hearts)
        {
            this._currentHeart++;
            this._distance += 20;
            this._scoreText.text = this._distance.toString();
        }
        else
        {
            this._addingHearts = false;
            this._heartParticle.emit = false;
            //SoundSFX.stop('sfx_heart_pickup_02');

            var tl = new TimelineMax();
            Common.animator.add(tl);

            tl.to(this._scoreText.scale, .5, {delay:.5, x:1.2, y:1.2, ease:Back.easeOut});

            if(this._distance > Common.savedData.bestScore)
            {
                Common.savedData.bestScore = this._distance;
                Common.savedData.save();
                tl.to(this._trophy.scale, .3, {x:1.2, y:1.2, ease:Sine.easeOut, onCompleteScope:this, onComplete:function(){
                    this._bestScoreText.text = Common.savedData.bestScore.toString();
                }}); 
                tl.to(this._trophy.scale, 1, {x:1, y:1, ease:Elastic.easeOut}); 
            }

            tl.to(this._mojo, .3, {y:Common.STAGE_HEIGHT - this._mojo.height, ease:Expo.easeOut});
            tl.to(this._mojoText.scale, .3, {x:1, y:1, ease:Back.easeOut});

            Common.animator.add(TweenMax.to(this._playButton.scale, .5, {delay:1, x:1, y:1, ease:Back.easeOut}));
            Common.animator.add(TweenMax.to(this._homeButton.scale, .5, {delay:1, x:1, y:1, ease:Back.easeOut}));

        }
    }*/
};

/**
 */
GameOverScreen.prototype.resize = function()
{
    SimpleScreen.prototype.resize.call(this);

    this._muteButton.x = this._getFirstButtonPositionRight();
    this._homeButton.x = this._getFirstButtonPositionLeft();
};

/**
 */
GameOverScreen.prototype.dispose = function()
{

}

/**
 * @param {Function=} callback
 * @param {*=}scope
 */
GameOverScreen.prototype.animateIn = function(callback, scope) {
    
    SimpleScreen.prototype.animateIn.call(this);

    this._panel.scale = new PIXI.Point(0, 0);
    this._scoreText.scale = new PIXI.Point(0, 0);

    var tl = new TimelineMax();
    Common.animator.add(tl);
    tl.to(this._panel.scale, .3, {x:1, y:1, ease:Expo.easeOut});

    tl.to(this._scoreText.scale, .3, {delay:.5, x:1.2, y:1.2, ease:Expo.easeOut});

    if(this._distance > Common.savedData.bestScore)
    {
        Common.savedData.bestScore = this._distance;
        Common.savedData.save();
        tl.to(this._trophy.scale, .3, {x:1.2, y:1.2, ease:Sine.easeOut, onCompleteScope:this, onComplete:function(){
            this._bestScoreText.text = Common.savedData.bestScore.toString();
        }}); 
        tl.to(this._trophy.scale, 1, {x:1, y:1, ease:Elastic.easeOut}); 
    }

    tl.to(this._mojo, .3, {y:Common.STAGE_HEIGHT - this._mojo.height, ease:Expo.easeOut, onStartScope:this, onStart:function(){
        Common.animator.add(TweenMax.to(this._playButton.scale, .5, {delay:1, x:1, y:1, ease:Back.easeOut}));
        Common.animator.add(TweenMax.to(this._homeButton.scale, .5, {delay:1, x:1, y:1, ease:Back.easeOut}));
    }});
    tl.to(this._mojoText.scale, .3, {x:1, y:1, ease:Back.easeOut});
};

/**
 * @param {Function=} callback
 * @param {*=} scope
 */
GameOverScreen.prototype.animateOut = function(callback, scope) {
        
    SimpleScreen.prototype.animateOut.call(this);
};

GameOverScreen.prototype.addHearts = function()
{  
    this._heartParticle =  Emitter.add(this._panel, 
                            ["pickup"],
                            "particles_heart_score", 0, 50);
    this._addingHearts = true;
    //SoundSFX.play('sfx_heart_pickup_02', {loop:true});
};



//===================================================
// PRIVATE METHODS
//===================================================


//===================================================
// EVENTS
//===================================================

/**
 */
GameOverScreen.prototype.playClicked = function() {
    
    this._playButton.signals.over.remove(this.buttonOver, this);
    this._playButton.signals.down.remove(this.playClicked, this);

    TweenMax.killTweensOf(this._playButton.scale);
    Common.animator.add(TweenMax.to(this._playButton.scale, .2, {x:0.6, y:0.6, ease:Sine.easeInOut, onComplete:function(){
        Common.animator.add(TweenMax.to(this._playButton.scale, 1, {x:1, y:1, ease:Elastic.easeOut, onComplete:function(){
            this.signals.requestedNextScreen.dispatch();
        }, onCompleteScope:this}));

    }, onCompleteScope:this}));
    SoundSFX.play('sfx_ui_pressplay_00');
};

/**
 */
GameOverScreen.prototype.homeClicked = function() {
    
    this.signals.requestedPreviousScreen.dispatch();
    SoundSFX.play('sfx_ui_press_button_01');
};

/**
 */
GameOverScreen.prototype.buttonOver = function() {
        
    
};


//===================================================
// GETTERS/SETTERS
//===================================================


//===================================================


},{"../Common":2,"../game/Collectible":8,"../general/Emitter":13,"../general/SoundSFX":14,"./SimpleScreen":23}],20:[function(require,module,exports){

var Common          		= require("../Common");
var SimpleScreen    		= require("./SimpleScreen");
var ScrollerEngine			= require("../scroller/ScrollerEngine");
var ScrollerObject          = require("../scroller/ScrollerObject");
var ScrollerObjectImage		= require("../scroller/ScrollerObjectImage");
var ScrollerLoopingRange    = require("../scroller/ScrollerLoopingRange");
var ScrollerObjectGenerator = require("../scroller/ScrollerObjectGenerator");
var BackgroundImage         = require("../game/BackgroundImage");
var Avatar                  = require("../game/Avatar");
var Obstacle                = require("../game/Obstacle");
var Collectible             = require("../game/Collectible");
var BackgroundFloater       = require("../game/BackgroundFloater");
var ForegroundShadow        = require("../game/ForegroundShadow");
var TrailRenderer           = require("../game/TrailRenderer");
var ScoreBox 			    = require("../game/ScoreBox");
var Emitter                 = require("../general/Emitter");
var SoundSFX                = require("../general/SoundSFX");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 */
function GameScreen()
{
	this._scrollerEngine 			= null;

	this._activeBoundaryPadding 	= 100;
    this._startingScrollSpeed 		= 8;
    this._scrollInc 				= 0;
    this._scrollIncAdd              = 0.0003;
    this._scrollIncMax 				= 2.4;
    this._collectibleBonus          = 20;

    this._currentFormation			= 0;
    this._distance                  = 0;
    this._hearts                    = 0;
    this._currentBackgroundColour   = 0;
    this._maxBackgroundColours      = 5;
    this._switching					= false;
    this._firstUpdate               = true;
    this._gameEnded                 = false;
    this._paused                    = false;

    this._backgroundHolder          = null;
    this._background 				= null;
    this._engineHolder              = null;
    this._scoreBox                  = null;

    this._blossom					= null;
    this._bubbles					= null;
    this._buttercup					= null;
    this._avatars					= null;
    this._avatarPositions			= null;
    this._avatarTrails              = null;
    this._avatarTrailParticles      = null;

    this._levelGenerator            = null;
    this._floaterGenerator          = null;
    this._foregroundGenerator       = null;

    SimpleScreen.call(this);
}
module.exports = GameScreen;
GameScreen.prototype = Object.create(SimpleScreen.prototype);
GameScreen.prototype.constructor = GameScreen;


//===================================================
// PUBLIC METHODS
//===================================================

/**
 */
GameScreen.prototype.init = function()
{
    console.log("GAME INITIALIZED");
    SimpleScreen.prototype.init.call(this);

    this._backgroundHolder = new PIXI.Container();
    this.addChild(this._backgroundHolder);

    this._background = new PIXI.Sprite(Common.generatedTextures.sky0Square);
    this._background.width = Common.STAGE_WIDTH;
    this._background.height = Common.STAGE_HEIGHT;
    this._backgroundHolder.addChild(this._background);

    this._engineHolder = new PIXI.Container();
    this._engineHolder.x = Common.STAGE_WIDTH/2;
    this._engineHolder.y = Common.STAGE_HEIGHT/2;
    this.addChild(this._engineHolder);

//Scroller Engine Setup
	var p = this._activeBoundaryPadding;
    this._scrollerEngine = new ScrollerEngine(new PIXI.Point(Common.STAGE_WIDTH/2, Common.STAGE_HEIGHT/2), 
                                              new PIXI.Rectangle(-Common.STAGE_WIDTH/2, -Common.STAGE_HEIGHT/2, Common.STAGE_WIDTH, Common.STAGE_HEIGHT),
                                              new PIXI.Rectangle(-(Common.STAGE_WIDTH/2)-p, -(Common.STAGE_HEIGHT/2)-p, (Common.STAGE_WIDTH*2)+(p*2), Common.STAGE_HEIGHT+(p*2))
                                              );
    this._scrollerEngine.x = -(Common.STAGE_WIDTH/2);
    this._scrollerEngine.y = -(Common.STAGE_HEIGHT/2);
    this._scrollerEngine.init();
    this._engineHolder.addChild(this._scrollerEngine);

//Layers
    this._scrollerEngine.addLayer("backgroundLayer1", new PIXI.Point(0.1, 1));
    this._scrollerEngine.addLayer("backgroundLayer2", new PIXI.Point(0.2, 1));
    this._scrollerEngine.addLayer("backgroundFloaterLayer", new PIXI.Point(0.6, 1));
    this._scrollerEngine.addLayer("obstacleLayer", new PIXI.Point(1, 1));
    this._scrollerEngine.addLayer("avatarTrailLayer", new PIXI.Point(1, 1));
    this._scrollerEngine.addLayer("avatarLayer", new PIXI.Point(1, 1));
    this._scrollerEngine.addLayer("foregroundShadowLayer", new PIXI.Point(3, 1));

//Background layers
    this._addBackground([{texture:"city-skyline_00", width:556, height:336, offsetX:100, offsetY:50},
    					 {texture:"city-skyline_01", width:364, height:258, offsetX:100, offsetY:50},
    					 {texture:"city-skyline_02", width:510, height:326, offsetX:100, offsetY:50},
    					 {texture:"city-skyline_04", width:350, height:284, offsetX:100, offsetY:50}], "backgroundLayer1", 0);
    this._addBackground([{texture:"bg_building1", width:234, height:350, offsetX:500, offsetY:52},
    					 {texture:"bg_building2", width:182, height:396, offsetX:800, offsetY:6},
    					 {texture:"bg_building3", width:170, height:402, offsetX:300, offsetY:0}], "backgroundLayer2", 0);

//Avatars
	this._avatars = [];
    this._avatarTrails = [];
    this._avatarTrailParticles = [];

    var names = ['blossom', 'bubbles', 'buttercup'];

    for(var i= 0; i < names.length; i++)
    {
        var trailParticle = Emitter.add(this._scrollerEngine.getLayerContainer('avatarTrailLayer'), 
                                [names[i] + '_trail_particle_000',
                                 names[i] + '_trail_particle_001',
                                 names[i] + '_trail_particle_002',
                                 names[i] + '_trail_particle_003',
                                 names[i] + '_trail_particle_004',
                                 names[i] + '_trail_particle_005'],
                                "particles_trail", 0, 0);
        this._avatarTrailParticles.push(trailParticle);

        var trail               = new TrailRenderer();
        trail.color             = Common.colours[names[i]];
        trail.vertexDistance    = 20.0;
        trail.thickness         = 42.0;
        trail.time              = 1.5;
        trail.alpha             = 0.5;
        //trail.blendMode         = PIXI.BLEND_MODES.ADD;
        this._scrollerEngine.getLayerContainer('avatarTrailLayer').addChild(trail);
        
        this._avatarTrails.push(trail);
    }

	this._blossom = new Avatar('blossom');
    this._blossom.init();
	this._scrollerEngine.addObjectToLayer(this._blossom, "avatarLayer", 0, 0);
	this._avatars.push(this._blossom);

	this._bubbles = new Avatar('bubbles');
    this._bubbles.init();
	this._scrollerEngine.addObjectToLayer(this._bubbles, "avatarLayer", 0, 0);
	this._avatars.push(this._bubbles);

	this._buttercup = new Avatar('buttercup');
    this._buttercup.init();
	this._scrollerEngine.addObjectToLayer(this._buttercup, "avatarLayer", 0, 0);
	this._avatars.push(this._buttercup);

	this._avatarPositions = [
		{blossom:[{x:-250, y:0}], bubbles:[{x:-350, y:-50}], buttercup:[{x:-350, y:50}]},
		{blossom:[{x:-250, y:-200}, {x:-250, y:200}], bubbles:[{x:-350, y:-250}], buttercup:[{x:-350, y:250}]},
	];

	this.setFormation(this._currentFormation, false);
    this.introduceAvatars();


//HitArea
    this._hitArea = new PIXI.Sprite(Common.generatedTextures['blackSquare']);
    this._hitArea.alpha = 0;
    this._hitArea.width = Common.STAGE_WIDTH;
    this._hitArea.height = Common.STAGE_HEIGHT;
    this._hitArea.hitArea = new PIXI.Rectangle(0, 0, Common.STAGE_WIDTH, Common.STAGE_HEIGHT);
    this._hitArea.interactive = true;
    this.addChild(this._hitArea);

    this._hitArea.touchstart = this._hitArea.mousedown = this.onTouchStart.bind(this);

//Level Design

    this._levelGenerator = new ScrollerObjectGenerator([
        {id:"top_blocks_1", base:Obstacle, args:['obstacle-1_top', 'top_blocks_1', 'top']},
        {id:"top_pipe_1", base:Obstacle, args:['obstacle-2_top', 'top_pipe_1', 'top']},
        {id:"top_blocks_2", base:Obstacle, args:['obstacle-3', 'top_blocks_2', 'top']},
        {id:"top_crate_1", base:Obstacle, args:['obstacle-4_top', 'top_crate_1', 'top']},
        {id:"mid_crate_1", base:Obstacle, args:['obstacle-5_mid', 'mid_crate_1', 'mid', true]},
        {id:"mid_pipe_1", base:Obstacle, args:['obstacle-6_mid', 'mid_pipe_1', 'mid', true]},
        {id:"mid_bench_1", base:Obstacle, args:['obstacle-12_mid', 'mid_bench_1', 'mid', true]},
        {id:"mid_car_1", base:Obstacle, args:['obstacle-7_mid', 'mid_car_1', 'mid', true]},
        {id:"mid_car_2", base:Obstacle, args:['obstacle-9_mid', 'mid_car_2', 'mid', true]},
        {id:"mid_car_3", base:Obstacle, args:['obstacle-10_mid', 'mid_car_3', 'mid', true]},
        {id:"bottom_building_1", base:Obstacle, args:['obstacle-8_bot', 'bottom_building_1', 'bottom']},
        {id:"bottom_building_2", base:Obstacle, args:['obstacle-9_bot', 'bottom_building_2', 'bottom']},
        {id:"bottom_billboard_1", base:Obstacle, args:['obstacle-10_bot', 'bottom_billboard_1', 'bottom']},
        {id:"bottom_bush_1", base:Obstacle, args:['obstacle-11_bot', 'bottom_bush_1', 'bottom']},
        {id:"collectible", base:Collectible, args:[]},
    ]);
    this._levelGenerator.signals.generateObjects.add(this.onGenerateObstacle, this);
    this._levelGenerator.signals.objectDisposed.add(this.onObstacleDisposed, this);

    var top_y = 0 - (Common.STAGE_HEIGHT/2);
    var mid_y = 0;
    var bottom_y = Common.STAGE_HEIGHT/2;
    var collectible_top_y = this._avatarPositions[1]['bubbles'][0].y;
    var collectible_bottom_y = this._avatarPositions[1]['buttercup'][0].y;
    
    //Top and Bottom Patterns

    this._levelGenerator.addPattern([
        {x:0, y:top_y, poolId:'top_blocks_1'},
        {x:0, y:bottom_y, poolId:'bottom_building_1'},
        {x:600, y:collectible_top_y, poolId:'collectible', originalX:600},
        {x:700, y:collectible_top_y, poolId:'collectible', originalX:700},
        {x:800, y:collectible_top_y, poolId:'collectible', originalX:800},
        {x:600, y:collectible_bottom_y, poolId:'collectible', originalX:600},
        {x:700, y:collectible_bottom_y, poolId:'collectible', originalX:700},
        {x:800, y:collectible_bottom_y, poolId:'collectible', originalX:800},
        ], "pattern1");
    
    this._levelGenerator.addPattern([
        {x:0, y:top_y, poolId:'top_blocks_2'},
        {x:200, y:bottom_y, poolId:'bottom_billboard_1'},
        ], "pattern2");
    
    this._levelGenerator.addPattern([
        {x:100, y:top_y, poolId:'top_pipe_1'},
        {x:0, y:bottom_y, poolId:'bottom_building_2'},
        {x:0, y:mid_y, poolId:'collectible'},
        {x:100, y:mid_y, poolId:'collectible'},
        {x:200, y:mid_y, poolId:'collectible'},
        ], "pattern3");
    
    this._levelGenerator.addPattern([
        {x:0, y:collectible_top_y, poolId:'collectible'},
        {x:100, y:collectible_top_y, poolId:'collectible'},
        {x:200, y:collectible_top_y, poolId:'collectible'},
        {x:0, y:collectible_bottom_y, poolId:'collectible'},
        {x:100, y:collectible_bottom_y, poolId:'collectible'},
        {x:200, y:collectible_bottom_y, poolId:'collectible'},
        {x:300, y:top_y, poolId:'top_crate_1', originalX:300},
        {x:300, y:bottom_y, poolId:'bottom_bush_1', originalX:300},
        ], "pattern4");

    this._levelGenerator.addPattern([
        {x:0, y:bottom_y, poolId:'bottom_billboard_1'},
        ], "pattern5");
    
    this._levelGenerator.addPattern([
        {x:0, y:top_y, poolId:'top_pipe_1'},
        {x:0, y:mid_y, poolId:'collectible'},
        {x:100, y:mid_y, poolId:'collectible'},
        {x:200, y:mid_y, poolId:'collectible'},
        ], "pattern6");

    this._levelGenerator.addPattern([
        {x:200, y:top_y, poolId:'top_pipe_1'},
        {x:0, y:bottom_y, poolId:'bottom_billboard_1'},
        ], "pattern7");
    
    this._levelGenerator.addPattern([
        {x:200, y:top_y, poolId:'top_blocks_2'},
        {x:0, y:bottom_y, poolId:'bottom_building_2'},
        {x:0, y:mid_y, poolId:'collectible'},
        {x:100, y:mid_y, poolId:'collectible'},
        {x:200, y:mid_y, poolId:'collectible'},
        ], "pattern8");
    
    //Middle Patterns

    this._levelGenerator.addPattern([
        {x:0, y:mid_y, poolId:'collectible'},
        {x:100, y:mid_y, poolId:'collectible'},
        {x:200, y:mid_y, poolId:'collectible'},
        {x:300, y:mid_y, poolId:'mid_pipe_1', originalX:300},
        ], "patternMid1");

    this._levelGenerator.addPattern([
        {x:0, y:mid_y, poolId:'mid_car_1'},
        ], "patternMid2");

    this._levelGenerator.addPattern([
        {x:0, y:mid_y, poolId:'mid_crate_1'},
        ], "patternMid3");

    this._levelGenerator.addPattern([
        {x:0, y:mid_y, poolId:'mid_crate_1'},
        {x:500, y:mid_y, poolId:'collectible', originalX:500},
        {x:600, y:mid_y, poolId:'collectible', originalX:600},
        {x:700, y:mid_y, poolId:'collectible', originalX:700},
        ], "patternMid4");

    this._levelGenerator.addPattern([
        {x:0, y:mid_y, poolId:'mid_car_2'},
        {x:0, y:collectible_top_y, poolId:'collectible'},
        {x:100, y:collectible_top_y, poolId:'collectible'},
        {x:200, y:collectible_top_y, poolId:'collectible'},
        {x:0, y:collectible_bottom_y, poolId:'collectible'},
        {x:100, y:collectible_bottom_y, poolId:'collectible'},
        {x:200, y:collectible_bottom_y, poolId:'collectible'},
        ], "patternMid5");

    this._levelGenerator.addPattern([
        {x:0, y:mid_y, poolId:'mid_bench_1'},
        ], "patternMid6");

    this._levelGenerator.addPattern([
        {x:0, y:mid_y, poolId:'mid_car_3'},
        {x:500, y:mid_y, poolId:'collectible', originalX:500},
        {x:600, y:mid_y, poolId:'collectible', originalX:600},
        {x:700, y:mid_y, poolId:'collectible', originalX:700},
        ], "patternMid7");

    this._levelGenerator.addPattern([
        {x:0, y:mid_y, poolId:'collectible'},
        {x:100, y:mid_y, poolId:'collectible'},
        {x:200, y:mid_y, poolId:'collectible'},
        {x:300, y:mid_y, poolId:'mid_crate_1', originalX:300},
        ], "patternMid8");

    //Collectible Patterns

    this._levelGenerator.addPattern([
        {x:0, y:mid_y, poolId:'collectible'},
        {x:100, y:mid_y, poolId:'collectible'},
        {x:200, y:mid_y, poolId:'collectible'},
        ], "collectibles1");

    this._levelGenerator.addPattern([
        {x:0, y:collectible_top_y, poolId:'collectible'},
        {x:100, y:collectible_top_y, poolId:'collectible'},
        {x:200, y:collectible_top_y, poolId:'collectible'},
        {x:0, y:collectible_bottom_y, poolId:'collectible'},
        {x:100, y:collectible_bottom_y, poolId:'collectible'},
        {x:200, y:collectible_bottom_y, poolId:'collectible'},
        ], "collectibles2");

    this._levelGenerator.addPattern([
        {x:0, y:mid_y, poolId:'collectible'},
        {x:100, y:mid_y, poolId:'collectible'},
        {x:200, y:mid_y, poolId:'collectible'},
        {x:600, y:collectible_top_y, poolId:'collectible'},
        {x:700, y:collectible_top_y, poolId:'collectible'},
        {x:800, y:collectible_top_y, poolId:'collectible'},
        {x:600, y:collectible_bottom_y, poolId:'collectible'},
        {x:700, y:collectible_bottom_y, poolId:'collectible'},
        {x:800, y:collectible_bottom_y, poolId:'collectible'},
        ], "collectibles3");

    //Initial Pattern

    this._levelGenerator.addPattern([
        {x:0, y:mid_y, poolId:'collectible'},
        {x:100, y:mid_y, poolId:'collectible'},
        {x:200, y:mid_y, poolId:'collectible'},
        {x:500, y:mid_y, poolId:'mid_pipe_1'},
        {x:500, y:collectible_top_y, poolId:'collectible'},
        {x:600, y:collectible_top_y, poolId:'collectible'},
        {x:700, y:collectible_top_y, poolId:'collectible'},
        {x:500, y:collectible_bottom_y, poolId:'collectible'},
        {x:600, y:collectible_bottom_y, poolId:'collectible'},
        {x:700, y:collectible_bottom_y, poolId:'collectible'},
        {x:1100, y:mid_y, poolId:'collectible'},
        {x:1200, y:mid_y, poolId:'collectible'},
        {x:1300, y:mid_y, poolId:'collectible'},
        ], "initialPattern");

    this._levelGenerator.setFrequencies(0, 0);
    this._levelGenerator.addPredefinedPattern('initialPattern');
    this._levelGenerator.setFrequencies(400, 400, false);

//Floaters
    this._floaterGenerator = new ScrollerObjectGenerator([
        
        {id:"mid_pipe_1", base:BackgroundFloater, args:['bg_obst_7', 'mid_pipe_1']},
        {id:"mid_bench_1", base:BackgroundFloater, args:['bg_obst_2', 'mid_bench_1']},
        {id:"mid_car_1", base:BackgroundFloater, args:['bg_obst_6', 'mid_car_1']},
        {id:"mid_car_2", base:BackgroundFloater, args:['bg_obst_4', 'mid_car_2']},
        {id:"mid_car_3", base:BackgroundFloater, args:['bg_obst_3', 'mid_car_3']},
        {id:"mid_tree_1", base:BackgroundFloater, args:['bg_obst_5', 'mid_tree_1']},
        {id:"mid_crate_1", base:BackgroundFloater, args:['bg_obst_1', 'mid_crate_1']},
    ]);
    this._floaterGenerator.signals.generateObjects.add(this.onGenerateFloater, this);
    
    this._floaterGenerator.addPattern([
        {x:0, y:0, poolId:'mid_pipe_1'}
    ], 'floater1');

    this._floaterGenerator.addPattern([
        {x:0, y:0, poolId:'mid_bench_1'}
    ], 'floater2');

    this._floaterGenerator.addPattern([
        {x:0, y:0, poolId:'mid_tree_1'}
    ], 'floater3');

    this._floaterGenerator.addPattern([
        {x:0, y:0, poolId:'mid_car_1'}
    ], 'floater4');

    this._floaterGenerator.addPattern([
        {x:0, y:0, poolId:'mid_car_2'}
    ], 'floater5');

    this._floaterGenerator.addPattern([
        {x:0, y:0, poolId:'mid_car_3'}
    ], 'floater6');

    this._floaterGenerator.addPattern([
        {x:0, y:0, poolId:'mid_crate_1'}
    ], 'floater7');

    this._floaterGenerator.setFrequencies(300, 400);


//Foreground Shadows
    this._foregroundGenerator = new ScrollerObjectGenerator([
        {id:"shadow_1", base:ForegroundShadow, args:["fg_fastshadow_00"]},
        {id:"shadow_2", base:ForegroundShadow, args:["fg_fastshadow_01"]},
        {id:"shadow_3", base:ForegroundShadow, args:["fg_fastshadow_02"]}
    ]);
    this._foregroundGenerator.signals.generateObjects.add(this.onGenerateForegroundShadow, this);

    this._foregroundGenerator.addPattern([{x:0, y:Common.STAGE_HEIGHT/2, poolId:'shadow_1'}], 'shadows_1');
    this._foregroundGenerator.addPattern([{x:0, y:Common.STAGE_HEIGHT/2, poolId:'shadow_2'}], 'shadows_2');
    this._foregroundGenerator.addPattern([{x:0, y:Common.STAGE_HEIGHT/2, poolId:'shadow_3'}], 'shadows_3');
    this._foregroundGenerator.setFrequencies(90, 150);


//Collisions
    this._scrollerEngine.addCollisionDetector("avatar", "obstacle");
    this._scrollerEngine.addCollisionDetector("avatar", "collectible");
    this._scrollerEngine.signals.collisionFired.add(this.onCollision, this);

//UI
    this._addPauseButton();
    this._addMuteButton();

    this._scoreBox = new ScoreBox();
    this._scoreBox.x = Common.STAGE_WIDTH/2;
    this._scoreBox.y = this._guiButtonTopMargin-2;
    this._scoreBox.init();
    this.addChild(this._scoreBox);
    this._scoreBox.updateScore(0);

    if(Common.generatedTextures.collectibleBonus == null)
    {
        var text = new p3.BitmapText("+" + this._collectibleBonus.toString(), this._assetManager.getFontAtlas("unpack90_pink"), p3.BitmapText.ALIGN_LEFT);
        Common.generatedTextures.collectibleBonus = text.generateTexture(Common.renderer, 1.0, PIXI.SCALE_MODES.LINEAR);
    }

//Sound
    SoundSFX.play("music_loop", {loop:true});
    SoundSFX.play('sfx_ppg_level_start_00', null, .5);

};

GameScreen.prototype.dispose = function()
{
    SoundSFX.stop("music_loop");
    Common.animator.removeAll();
}

/**
 */
GameScreen.prototype.update = function()
{
    if(this._gameEnded || this._paused)
        return null;

    SimpleScreen.prototype.update.call(this);

    this._scrollerEngine.viewX -= this.scrollSpeed;
    this._scrollerEngine.update();

    this._scrollInc = Math.min(this._scrollInc + this._scrollIncAdd, this._scrollIncMax);

    this._levelGenerator.update();
    this._floaterGenerator.update();
    this._foregroundGenerator.update();

    var p = this.scrollIncPercentage;

    if(!this._firstUpdate)
    {
        //this._levelGenerator.setFrequencies(100 - Math.round(90*p), 140+(90*(1-p)) - Math.round(150*p), false);
        this._floaterGenerator.setFrequencies(150 - Math.round(90*p), 160+(50*(1-p)) - Math.round(120*p), false);
    }
    else
        this._levelGenerator.removePattern('initialPattern');

    for(var i = 0; i < this._avatarTrails.length; i++)
    {
        this._avatarTrailParticles[i].updateOwnerPos(this._avatars[i].x, this._avatars[i].y + 10);
        this._avatarTrailParticles[i].minLifetime = 0.3 - (0.2 * p);
        this._avatarTrailParticles[i].maxLifetime = 0.3 - (0.2 * p);
        
        this._avatarTrails[i].draw(
            this._avatars[i].x,
            this._avatars[i].y
        );
    }

    this._firstUpdate = false;
    this._distance += this.scrollSpeed / 10;
    this._scoreBox.updateScore(Math.round(this._distance));

    if(this._currentBackgroundColour == Math.floor(this._distance/1000)-1)
    {
        this._currentBackgroundColour++;
        this.setBackgroundColour();
    }
};

/**
 */
GameScreen.prototype.resize = function()
{
    SimpleScreen.prototype.resize.call(this);

    this._pauseButton.x = this._getSecondButtonPositionRight();
    this._muteButton.x = this._getFirstButtonPositionRight();
};

/**
 * @param {Function=} callback
 * @param {*=}scope
 */
GameScreen.prototype.animateIn = function(callback, scope) {
    
    SimpleScreen.prototype.animateIn.call(this);
};

/**
 * @param {Function=} callback
 * @param {*=} scope
 */
GameScreen.prototype.animateOut = function(callback, scope) {
    
    SimpleScreen.prototype.animateOut.call(this);
};


GameScreen.prototype.setFormation = function(formation, animate)
{
	if(animate == undefined)
		animate = true;

	for(var i = 0; i < this._avatars.length; i++)
	{
		var id = this._avatars[i].girl;
		var pos = Math.floor(Math.random() * this._avatarPositions[formation][id].length);
		var x = this._avatarPositions[formation][id][pos].x;
		var y = this._avatarPositions[formation][id][pos].y;

		if(animate)
		{
			if(this._switching)
			{
				TweenMax.killTweensOf(this._avatars[i]);
			}

			Common.animator.add(TweenMax.to(this._avatars[i], .25-(.16*this.scrollIncPercentage), {delay:i*.05, persistentX:x, y:y, ease:Sine.easeInOut, onCompleteScope:this, onCompleteParams:[id], onComplete:function(id){
				if(id == 'buttercup')
					this._switching = false;
			}}));

			if(id == 'buttercup')
            {
				this._switching = true;
                SoundSFX.playRandomFrom(['sfx_ppg_move_00', 'sfx_ppg_move_01', 'sfx_ppg_move_02', 'sfx_ppg_move_03', 'sfx_ppg_move_04', 'sfx_ppg_move_05', 'sfx_ppg_move_06']);
            }

            if(formation == 0)
            {
                Common.animator.add(TweenMax.to(this._engineHolder.scale, .5, {x:1.1, y:1.1, ease:Sine.easeInOut}));
            }
            else
            {
                Common.animator.add(TweenMax.to(this._engineHolder.scale, .5, {x:1, y:1, ease:Sine.easeInOut}));
            }
		}
		else
		{
			this._avatars[i].persistentX = x;
			this._avatars[i].y = y;
		}
	}

	this._currentFormation = formation;
}

GameScreen.prototype.gameOver = function()
{
    this._gameEnded = true;
    this._pauseButton.interactive = false;
    this._hitArea.interactive = false;
    for(var i = 0; i < this._avatars.length; i++)
    {
        TweenMax.killTweensOf(this._avatars[i]);
        this._avatarTrailParticles[i].emit = false;
        this._avatars[i].stop();
    }
    SoundSFX.playRandomFrom(['sfx_ppg_hit_obstacle_00', 'sfx_ppg_hit_obstacle_01']);

    var tl = new TimelineMax();
    Common.animator.add(tl);
    var limit = 5;
    for(var i = limit; i >= 0; i--)
    {
        var val = i*(100/limit);
        tl.to(this._engineHolder, .1, {x:(Common.STAGE_WIDTH/2)+val, ease:Sine.easeInOut});
        tl.to(this._engineHolder, .1, {x:(Common.STAGE_WIDTH/2)-val, ease:Sine.easeInOut});
    }

    Common.animator.add(TweenMax.to(this._engineHolder.scale, 1, {delay:.5, x:1.2, y:1.2, ease:Sine.easeOut}));
    Common.animator.add(TweenMax.to(this._engineHolder, .8, {delay:.7, rotation:(-10+(Math.random()*20))*PIXI.DEG_TO_RAD, ease:Sine.easeOut}));

    Common.animator.setTimeout(function(){
        this.signals.requestedNextScreen.dispatch(Math.round(this._distance), this._hearts);
    }, 1.5, this);
}

GameScreen.prototype.hideGUI = function()
{
    this._pauseButton.visible = false;
    this._muteButton.visible = false;
    this._hitArea.interactive = false;

}

GameScreen.prototype.showGUI = function()
{
    this._pauseButton.visible = true;
    this.removeChild(this._muteButton);
    this._addMuteButton();
    this._hitArea.interactive = true;
}

GameScreen.prototype.pause = function()
{
    this._paused = true;
    TweenMax.pauseAll();
    this._scrollerEngine.pause();
    console.log('game pause');
}

GameScreen.prototype.resume = function()
{
    this._paused = false;
    TweenMax.resumeAll();
    this._scrollerEngine.resume();
    console.log('game resume');
}

GameScreen.prototype.introduceAvatars = function()
{
    for(var i = 0; i < this._avatars.length; i++)
    {
        var target = this._avatars[i].persistentX;
        this._avatars[i].persistentX -= Common.STAGE_WIDTH / 2;
        Common.animator.add(TweenMax.to(this._avatars[i], .5, {delay:.4 + (.2*i), persistentX:target, ease:Expo.easeOut}));
    }
}

GameScreen.prototype.setBackgroundColour = function()
{
    var bgNumber = this._currentBackgroundColour % this._maxBackgroundColours;

    var background = new PIXI.Sprite(Common.generatedTextures['sky' + bgNumber + 'Square']);
    background.width = Common.STAGE_WIDTH;
    background.height = Common.STAGE_HEIGHT;
    background.alpha = 0;
    this._backgroundHolder.addChild(background);

    Common.animator.add(TweenMax.to(background, 2, {alpha:1, onCompleteScope:this, onComplete:function(){
        this._backgroundHolder.removeChild(this._background);
        this._background = background;
    }}));

    var objects = this._scrollerEngine.getAllObjectsOfType("backgroundImage");
    objects = objects.concat(this._scrollerEngine.getAllObjectsOfType("floater"));

    for(var i = 0; i < objects.length; i++)
    {
        objects[i].shiftColour(bgNumber);
    }
}

GameScreen.prototype.adjustHeartsWithObstacles = function()
{
    var arr = ["pattern1", "patternMid4", "patternMid7", "pattern4", "patternMid1", "patternMid8"];

    for(var i = 0; i < arr.length; i++)
    {
        var pattern = this._levelGenerator.getPattern(arr[i]);
        for(var j in pattern)
        {
            if(pattern[j].originalX != undefined)
            {
                pattern[j].x = pattern[j].originalX + (200*this.scrollIncPercentage);
                console.log(pattern[j].x);
            }
        }
    }
}




//===================================================
// PRIVATE METHODS
//===================================================

GameScreen.prototype._addBackground = function(images, layerName, yOffset)
{
    var arr = [];

    for(var i = 0; i < images.length; i++)
    {
        arr.push({
            base:BackgroundImage, 
            //args:[layerName + "_" + (i+1), true, this._assetManager.getTexture(images[i].texture)],
            args:["backgroundImage", true, this._assetManager.getTexture(images[i].texture)],
            areaRect:new PIXI.Rectangle(0, 0, images[i].width, images[i].height),
            offset:{x:images[i].offsetX, y:images[i].offsetY}
        });
    }

    var loop = new ScrollerLoopingRange(arr, true, false);
    loop.signals.objectGenerated.add(function(obj){
        obj.setColour(this._currentBackgroundColour % this._maxBackgroundColours);
    }, this);
    this._scrollerEngine.addLoopingRangeToLayer(loop, layerName, 0, yOffset);
};

//===================================================
// EVENTS
//===================================================

GameScreen.prototype.onTouchStart = function(event)
{
	this.setFormation(this._currentFormation == 1 ? 0 : 1, true);
}

GameScreen.prototype.onGenerateObstacle = function(obstacles)
{
    var layer = this._scrollerEngine.getLayerContainer('obstacleLayer');
    var x = (layer.x*-1) + (this._scrollerEngine.viewBoundary.width);
    var furthestObstacle = 0;

    for(var i = 0; i < obstacles.length; i++)
    {
        this._scrollerEngine.addObjectToLayer(obstacles[i].obj, 'obstacleLayer', x + obstacles[i].offset.x, obstacles[i].offset.y);
        var data = this._assetManager.getJSON('obstacle_data').obstacles[this.id];

        if(obstacles[i].offset.x + obstacles[i].obj.areaRect.width > furthestObstacle)
            furthestObstacle = obstacles[i].offset.x + obstacles[i].obj.areaRect.width;
    }

    var frequency = Math.ceil(furthestObstacle / this.scrollSpeed);
    this._levelGenerator.setFrequencies(frequency + 20, frequency + 50, false);
    this.adjustHeartsWithObstacles();
}

GameScreen.prototype.onObstacleDisposed = function()
{
    
}

GameScreen.prototype.onGenerateFloater = function(obstacles)
{
    var layer = this._scrollerEngine.getLayerContainer('backgroundFloaterLayer');
    var x = (layer.x*-1) + (this._scrollerEngine.viewBoundary.width);
    for(var i = 0; i < obstacles.length; i++)
    {
        this._scrollerEngine.addObjectToLayer(obstacles[i].obj, 'backgroundFloaterLayer', x + obstacles[i].offset.x, -(Common.STAGE_HEIGHT/2) + Common.STAGE_HEIGHT*Math.random());
        obstacles[i].obj.setColour(this._currentBackgroundColour % this._maxBackgroundColours);
    }
}

GameScreen.prototype.onGenerateForegroundShadow = function(obstacles)
{
    var layer = this._scrollerEngine.getLayerContainer('foregroundShadowLayer');
    var x = (layer.x*-1) + (this._scrollerEngine.viewBoundary.width);
    for(var i = 0; i < obstacles.length; i++)
    {
        this._scrollerEngine.addObjectToLayer(obstacles[i].obj, 'foregroundShadowLayer', x + obstacles[i].offset.x, obstacles[i].offset.y);
        obstacles[i].obj.setColour(this._currentBackgroundColour % this._maxBackgroundColours);
    }

}

GameScreen.prototype.onCollision = function(object1, object2)
{
    if(object1.type == 'avatar')
    {
        if(object2.type == 'obstacle')
        {
            object1.flash();
            if(!this._gameEnded)
                this.gameOver();

            var particle = Emitter.add(this._scrollerEngine.getLayerContainer('avatarLayer'), 
                    ['star'],
                    "particles_collision", object1.x, object1.y, 0.6, true, 1);
        }
        else if(object2.type == 'collectible' && !object2.collected)
        {
            object2.collect();
            this._hearts++;
            SoundSFX.play('sfx_heart_pickup_02');

            var heart = new PIXI.Sprite(this._assetManager.getTexture('pickup'));
            heart.anchor = new PIXI.Point(0.5, 0.5);
            heart.scale = new PIXI.Point(0.5, 0.5);
            var pos = this._scrollerEngine.getObjectPositionOnScreen(object2);
            heart.x = pos.x - this._scrollerEngine.x;
            heart.y = pos.y - this._scrollerEngine.y;
            this.addChild(heart);

            var tl = new TimelineMax();
            Common.animator.add(tl);
            tl.to(heart, .5, {bezier:[{x:this._scoreBox.x - 300, y:this._scoreBox.y + 200}, {x:this._scoreBox.x - 50, y:this._scoreBox.y}], ease:Sine.easeInOut, onCompleteScope:this, onComplete:function(){
                this._distance += this._collectibleBonus;
                this._scoreBox.animateScore();
            }});
            tl.to(heart.scale, .2, {x:0, y:0, ease:Sine.easeInOut, onCompleteScope:this, onComplete:function(){
                this.removeChild(heart);
            }});

            var particle = Emitter.add(this._scrollerEngine.getLayerContainer('avatarLayer'), 
                                ['_pickup_pinkdot'],
                                "particles_pickup", object2.x + 20, object2.y, 0.6, true, 1);
            
        }
    }
}

//===================================================
// GETTERS/SETTERS
//===================================================

Object.defineProperty(GameScreen.prototype, "scrollSpeed", {
    /**
     * @returns {Number}
     */
    get: function() {
        return this._startingScrollSpeed * (1 + Math.min(this._scrollInc, this._scrollIncMax-1));
    },
});

Object.defineProperty(GameScreen.prototype, "scrollIncPercentage", {
    /**
     * @returns {Number}
     */
    get: function() {
        return this._scrollInc / this._scrollIncMax;
    },
});


//===================================================


},{"../Common":2,"../game/Avatar":5,"../game/BackgroundFloater":6,"../game/BackgroundImage":7,"../game/Collectible":8,"../game/ForegroundShadow":9,"../game/Obstacle":10,"../game/ScoreBox":11,"../game/TrailRenderer":12,"../general/Emitter":13,"../general/SoundSFX":14,"../scroller/ScrollerEngine":25,"../scroller/ScrollerLoopingRange":26,"../scroller/ScrollerObject":27,"../scroller/ScrollerObjectGenerator":28,"../scroller/ScrollerObjectImage":29,"./SimpleScreen":23}],21:[function(require,module,exports){

var Common                  = require("../Common");
var SimpleScreen            = require("./SimpleScreen");
var SoundSFX                = require("../general/SoundSFX");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 */
function IntroScreen()
{
    this._screen1 = null;
    this._screen2 = null;

    this._nextButton = null;

    SimpleScreen.call(this);
}
module.exports = IntroScreen;
IntroScreen.prototype = Object.create(SimpleScreen.prototype);
IntroScreen.prototype.constructor = IntroScreen;


//===================================================
// PUBLIC METHODS
//===================================================

/**
 */
IntroScreen.prototype.init = function()
{
    console.log("SPLASH INITIALIZED");

    SimpleScreen.prototype.init.call(this);

    this._screen1 = new PIXI.Container();
    this._screen1.x = Common.STAGE_WIDTH / 2;
    this._screen1.y = Common.STAGE_HEIGHT / 2;
    this.addChild(this._screen1);

    this._screen2 = new PIXI.Container();
    this._screen2.x = Common.STAGE_WIDTH / 2;
    this._screen2.y = Common.STAGE_HEIGHT / 2;
    this.addChild(this._screen2);

    this._screen3 = new PIXI.Container();
    this._screen3.x = Common.STAGE_WIDTH * 1.5;
    this._screen3.y = Common.STAGE_HEIGHT / 2;
    this.addChild(this._screen3);

    var s1 = this._screen1;
    var s2 = this._screen2;
    var s3 = this._screen3;

    //Screen 1

    s1.bg = new PIXI.Sprite(this._assetManager.getTexture("fr1_bg"));
    s1.bg.anchor = new PIXI.Point(0.5, 0.5);
    s1.bg.y = (Common.STAGE_HEIGHT - s1.bg.height)/2;
    s1.addChild(s1.bg);

        /*
        var leftGlow = new PIXI.Sprite(this._assetManager.getTexture("mojojojo_handglow_left"));
        leftGlow.anchor = new PIXI.Point(0.5, 0.5);
        leftGlow.x = -400;
        leftGlow.scale = new PIXI.Point(0.4, 0.4);
        leftGlow.y = 0;
        s1.addChild(leftGlow);
        var rightGlow = new PIXI.Sprite(this._assetManager.getTexture("mojojojo_handglow_right"));
        rightGlow.anchor = new PIXI.Point(0.5, 0.5);
        rightGlow.x = -100;
        rightGlow.y = -100;
        rightGlow.scale = new PIXI.Point(0.4, 0.4);
        s1.addChild(rightGlow);

        var glows = [leftGlow, rightGlow];
        for(var i = 0; i < glows.length; i++)
        {
            Common.animator.add(TweenMax.to(glows[i].scale, .24 + (0.01*i), {x:1.2, y:1.2, ease:Sine.easeInOut, repeat:-1}));
            Common.animator.add(TweenMax.to(glows[i], .24 + (0.01*i), {alpha:1, ease:Sine.easeInOut, repeat:-1, onRepeatScope:this, onRepeatParams:[glows[i]], onRepeat:function(glow){
                glow.rotation = (360 * Math.random()) * PIXI.DEG_TO_RAD;
            }}));
        }*/

    s1.bits = new PIXI.Sprite(this._assetManager.getTexture("fr1_bits"));
    s1.bits.x = -50;
    s1.bits.y = -100;
    s1.addChild(s1.bits);

    s1.building1 = new PIXI.Sprite(this._assetManager.getTexture("fr1_building1"));
    s1.building1.x = -400;
    s1.building1.y = -400;
    s1.addChild(s1.building1);

    s1.building2 = new PIXI.Sprite(this._assetManager.getTexture("fr1_building2"));
    s1.building2.x = -50;
    s1.building2.y = 0;
    s1.addChild(s1.building2);

    s1.building3 = new PIXI.Sprite(this._assetManager.getTexture("fr1_building3"));
    s1.building3.x = 50;
    s1.building3.y = -200;
    s1.addChild(s1.building3);

    s1.crane = new PIXI.Sprite(this._assetManager.getTexture("fr1_cranebit"));
    s1.crane.x = 400;
    s1.crane.y = -100;
    s1.addChild(s1.crane);

    s1.tree = new PIXI.Sprite(this._assetManager.getTexture("fr1_tree"));
    s1.tree.x = 100;
    s1.tree.y = -350;
    s1.addChild(s1.tree);

    s1.van = new PIXI.Sprite(this._assetManager.getTexture("fr1_van"));
    s1.van.x = -700;
    s1.van.y = -300;
    s1.addChild(s1.van);

    s1.mojoSpeech = new PIXI.Container();
    s1.mojoSpeech.x = 50;
    s1.mojoSpeech.y = -100;
    s1.mojoSpeech.scale = new PIXI.Point(0, 0);
    s1.addChild(s1.mojoSpeech);

    var bubble = new PIXI.Sprite(this._assetManager.getTexture("fr1_speechbubble"));
    bubble.anchor = new PIXI.Point(0.3, 0.7);
    s1.mojoSpeech.addChild(bubble);

    console.log(this._assetManager.getJSON("config")['copy']);

    var copy = this._assetManager.getJSON("config")['copy']["EVIL_LAUGH"][Common.COUNTRY_CODE];
    if(!copy.live)
        s1.mojoSpeechText = new p3.BitmapText(copy.text, this._assetManager.getFontAtlas("unpack50_black"), p3.BitmapText.ALIGN_CENTER);
    else
        s1.mojoSpeechText = new PIXI.Text(copy.text, {font: "50px FredFredburgerAra-Regular", fill: 0x000000, align: "center", stroke: 0x0, strokeThickness: 1});
    s1.mojoSpeechText.x = 130 + copy.offset.x;
    s1.mojoSpeechText.y = -140 + copy.offset.y;
    s1.mojoSpeechText.scale.x = s1.mojoSpeechText.scale.y = copy.scale;
    s1.mojoSpeech.addChild(s1.mojoSpeechText);
    if(copy.live)
        s1.mojoSpeechText.x -= s1.mojoSpeechText.width * 0.5;

    //Screen 2

    /*
    s2.bg = new PIXI.Sprite(Common.generatedTextures.sky0Square);
    s2.bg.width = Common.STAGE_WIDTH;
    s2.bg.height = Common.STAGE_HEIGHT;
    s2.bg.anchor = new PIXI.Point(0.5, 0.5);
    s2.bg.alpha = 0;
    s2.addChild(s2.bg);*/

    s2.bgLeft = new PIXI.Sprite(Common.generatedTextures.bubblesSquare);
    s2.bgLeft.width = Common.STAGE_WIDTH/2;
    s2.bgLeft.height = Common.STAGE_HEIGHT;
    s2.bgLeft.x = -(Common.STAGE_WIDTH/2);
    s2.bgLeft.anchor = new PIXI.Point(1, 0.5);
    s2.bgLeft.alpha = 0.7;
    s2.addChild(s2.bgLeft);

    s2.bgRight = new PIXI.Sprite(Common.generatedTextures.buttercupSquare);
    s2.bgRight.width = Common.STAGE_WIDTH/2;
    s2.bgRight.height = Common.STAGE_HEIGHT;
    s2.bgRight.x = Common.STAGE_WIDTH/2;
    s2.bgRight.anchor = new PIXI.Point(0, 0.5);
    s2.bgRight.alpha = 0.7;
    s2.addChild(s2.bgRight);

    s2.blossom = new PIXI.Sprite(this._assetManager.getTexture("fr2_2"));
    s2.blossom.anchor = new PIXI.Point(0.5, 0.5);
    s2.blossom.y = Common.STAGE_HEIGHT*1.5;
    s2.addChild(s2.blossom);

    var girlPanelWidth = Math.min(p3.View.width / 3, 1500/3);
    var girlPanelScale = Math.max(1, girlPanelWidth / s2.blossom.width);
    s2.blossom.scale = new PIXI.Point(girlPanelScale, girlPanelScale);

    s2.bubbles = new PIXI.Sprite(this._assetManager.getTexture("fr2_1"));
    s2.bubbles.anchor = new PIXI.Point(1, 0.5);
    s2.bubbles.x = -(s2.blossom.width/2);
    s2.bubbles.y = Common.STAGE_HEIGHT*1.5;
    s2.bubbles.scale = new PIXI.Point(girlPanelScale, girlPanelScale);
    s2.addChild(s2.bubbles);

    s2.buttercup = new PIXI.Sprite(this._assetManager.getTexture("fr2_3"));
    s2.buttercup.anchor = new PIXI.Point(0, 0.5);
    s2.buttercup.x = (s2.blossom.width/2);
    s2.buttercup.y = Common.STAGE_HEIGHT*1.5;
    s2.buttercup.scale = new PIXI.Point(girlPanelScale, girlPanelScale);
    s2.addChild(s2.buttercup);


    //Screen 3

    s3.bg = new PIXI.Sprite(this._assetManager.getTexture("fr3_bg"));
    s3.bg.anchor = new PIXI.Point(0.5, 0.5);
    s3.addChild(s3.bg);

    s3.blossom = new PIXI.Sprite(this._assetManager.getTexture("girl2"));
    s3.blossom.anchor = new PIXI.Point(0, 1);
    s3.blossom.scale = new PIXI.Point(0, 0);
    s3.blossom.x = 420; 
    s3.blossom.y = (Common.STAGE_HEIGHT/2) + 100; 
    s3.addChild(s3.blossom);

    s3.bubbles = new PIXI.Sprite(this._assetManager.getTexture("girl1"));
    s3.bubbles.anchor = new PIXI.Point(0, 1);
    s3.bubbles.scale = new PIXI.Point(0, 0);
    s3.bubbles.x = 430; 
    s3.bubbles.y = (Common.STAGE_HEIGHT/2) + 20; 
    s3.addChild(s3.bubbles);

    s3.buttercup = new PIXI.Sprite(this._assetManager.getTexture("girl3"));
    s3.buttercup.anchor = new PIXI.Point(0, 1);
    s3.buttercup.scale = new PIXI.Point(0, 0);
    s3.buttercup.x = 250; 
    s3.buttercup.y = (Common.STAGE_HEIGHT/2) + 30; 
    s3.addChild(s3.buttercup);

    s3.bcSpeech = new PIXI.Container();
    s3.bcSpeech.x = 90;
    s3.bcSpeech.y = 180;
    s3.bcSpeech.scale = new PIXI.Point(0, 0);
    s3.addChild(s3.bcSpeech);

    var bubble = new PIXI.Sprite(this._assetManager.getTexture("fr3_speechbubble2"));
    bubble.anchor = new PIXI.Point(0.3, 0.7);
    s3.bcSpeech.addChild(bubble);

    var copy = this._assetManager.getJSON("config")['copy']["LETS_STOP"][Common.COUNTRY_CODE];
    if(!copy.live)
        s3.bcSpeechText = new p3.BitmapText(copy.text, this._assetManager.getFontAtlas("unpack50_black"), p3.BitmapText.ALIGN_CENTER);
    else
        s3.bcSpeechText = new PIXI.Text(copy.text, {font: "50px FredFredburgerAra-Regular", fill: 0x000000, align: "center", stroke: 0x0, strokeThickness: 1});
    s3.bcSpeechText.x = 120 + copy.offset.x;
    s3.bcSpeechText.y = -90 + copy.offset.y;
    s3.bcSpeechText.scale.x = s3.bcSpeechText.scale.y = copy.scale;
    s3.bcSpeech.addChild(s3.bcSpeechText);
    if(copy.live)
        s3.bcSpeechText.x -= s3.bcSpeechText.width * 0.5;


    s3.otherSpeech = new PIXI.Container();
    s3.otherSpeech.x = 130;
    s3.otherSpeech.y = -180;
    s3.otherSpeech.scale = new PIXI.Point(0, 0);
    s3.addChild(s3.otherSpeech);

    var bubble = new PIXI.Sprite(this._assetManager.getTexture("fr3_speechbubble1"));
    bubble.anchor = new PIXI.Point(0.3, 0.7);
    s3.otherSpeech.addChild(bubble);

    var copy = this._assetManager.getJSON("config")['copy']["YEAH"][Common.COUNTRY_CODE];
    if(!copy.live)
        s3.otherSpeechText = new p3.BitmapText(copy.text, this._assetManager.getFontAtlas("unpack50_black"), p3.BitmapText.ALIGN_CENTER);
    else
        s3.otherSpeechText = new PIXI.Text(copy.text, {font: "50px FredFredburgerAra-Regular", fill: 0x000000, align: "center", stroke: 0x0, strokeThickness: 1});
    s3.otherSpeechText.x = 70 + copy.offset.x;
    s3.otherSpeechText.y = -105 + copy.offset.y;
    s3.otherSpeechText.scale.x = s3.otherSpeechText.scale.y = copy.scale;
    s3.otherSpeech.addChild(s3.otherSpeechText);
    if(copy.live)
        s3.otherSpeechText.x -= s3.otherSpeechText.width * 0.5;



    this._addMuteButton();

    this._nextButton = new p3.Button(this._assetManager.getTexture("but_play_def"), this._assetManager.getTexture("but_play_over"), this._assetManager.getTexture("but_play_pressed"));
    this._nextButton.x = (Common.STAGE_WIDTH / 2);
    this._nextButton.y = Common.STAGE_HEIGHT - 100;
    this._nextButton.signals.down.addOnce(this.playClicked, this);
    this._nextButton.signals.over.add(this.buttonOver, this);
    this._nextButton.animate = false;
    
    if(Common.savedData.hasSeenIntro)
        this.addChild(this._nextButton);

    this.showScreen1();
};

/**
 */
IntroScreen.prototype.update = function()
{
    
};

/**
 */
IntroScreen.prototype.resize = function()
{
    SimpleScreen.prototype.resize.call(this);

    this._nextButton.x = this._getFirstButtonPositionRight() - 50;
    this._muteButton.x = this._getFirstButtonPositionRight();
};

/**
 */
IntroScreen.prototype.dispose = function()
{
    TweenMax.killAll();
    SoundSFX.stop('music_ppg_splash_generic');
}

/**
 * @param {Function=} callback
 * @param {*=}scope
 */
IntroScreen.prototype.animateIn = function(callback, scope) {
    
    SimpleScreen.prototype.animateIn.call(this);

};

/**
 * @param {Function=} callback
 * @param {*=} scope
 */
IntroScreen.prototype.animateOut = function(callback, scope) {
        
    SimpleScreen.prototype.animateOut.call(this);
};

IntroScreen.prototype.showScreen1 = function()
{
    var s1 = this._screen1;

    var tl = new TimelineMax();
    tl.to(s1.mojoSpeech.scale, 1, {x:1, ease:Elastic.easeOut}, 1);
    tl.to(s1.mojoSpeech.scale, 1, {y:1, ease:Elastic.easeOut}, 1.1);
    tl.to(s1, 2, {onComplete:this.showScreen2, onCompleteScope:this});
    Common.animator.add(tl);

    var bits = [s1.bits, s1.building1, s1.building2, s1.building3, s1.crane, s1.tree, s1.van];
    for(var i = 0; i < bits.length; i++)
    {
        Common.animator.add(TweenMax.to(bits[i], 1, {delay:Math.random(), y:bits[i].y-20, ease:Sine.easeInOut, yoyo:true, repeat:-1}));
    }

    SoundSFX.play('sfx_object_destroyed_00');
    SoundSFX.play('sfx_object_destroyed_01', null, 2);
};

IntroScreen.prototype.showScreen2 = function()
{
    var s2 = this._screen2;

    var tl = new TimelineMax();
    tl.to(s2.bgLeft, .3, {x:0, ease:Expo.easeOut});
    tl.to(s2.bgRight, .3, {x:0, ease:Expo.easeOut}, 0);
    tl.to(s2.blossom, .3, {y:0, ease:Expo.easeOut, onStartScope:this, onStart:function(){
        SoundSFX.play('sfx_ppg_move_00');
    }});
    tl.to(s2.bubbles, .3, {y:0, ease:Expo.easeOut, onStartScope:this, onStart:function(){
        SoundSFX.play('sfx_ppg_move_00');
    }});
    tl.to(s2.buttercup, .3, {y:0, ease:Expo.easeOut, onStartScope:this, onStart:function(){
        SoundSFX.play('sfx_ppg_move_00');
    }});
    tl.to(s2, .4, {onComplete:this.showScreen3, onCompleteScope:this});
    Common.animator.add(tl);
};

IntroScreen.prototype.showScreen3 = function()
{
    var s2 = this._screen2;
    var s3 = this._screen3;

    var tl = new TimelineMax();
    tl.to(s2, .3, {x:-(Common.STAGE_WIDTH*.5), ease:Expo.easeInOut});
    tl.to(s3, .3, {x:Common.STAGE_WIDTH/2, ease:Expo.easeInOut}, 0);
    tl.to(s3.blossom.scale, .3, {x:-1, y:1, ease:Expo.easeOut, onStartScope:this, onStart:function(){
        SoundSFX.play('sfx_ppg_girls_flyaway_00');
    }});
    tl.to(s3.bubbles.scale, .3, {x:-1, y:1, ease:Expo.easeOut, onStartScope:this, onStart:function(){
        SoundSFX.play('sfx_ppg_girls_flyaway_00');
    }});
    tl.to(s3.buttercup.scale, .3, {x:-1, y:1, ease:Expo.easeOut, onStartScope:this, onStart:function(){
        SoundSFX.play('sfx_ppg_girls_flyaway_00');
    }});
    tl.to(s3.bcSpeech.scale, 1, {x:1, ease:Elastic.easeOut});
    tl.to(s3.bcSpeech.scale, 1, {y:1, ease:Elastic.easeOut}, 1.6);
    tl.to(s3.otherSpeech.scale, 1, {x:1, ease:Elastic.easeOut}, 2.3);
    tl.to(s3.otherSpeech.scale, 1, {y:1, ease:Elastic.easeOut}, 2.4);
    tl.to(s3, 2, {onComplete:function(){
            Common.savedData.hasSeenIntro = true;
            Common.savedData.save();
            this.signals.requestedNextScreen.dispatch();
    }, onCompleteScope:this});

    Common.animator.add(tl); 
}

IntroScreen.prototype.pause = function()
{
    TweenMax.pauseAll();
}

IntroScreen.prototype.resume = function()
{
    TweenMax.resumeAll();
}



//===================================================
// PRIVATE METHODS
//===================================================


//===================================================
// EVENTS
//===================================================

/**
 */
IntroScreen.prototype.playClicked = function() {
    
    this._nextButton.signals.over.remove(this.buttonOver, this);
    this._nextButton.signals.down.remove(this.playClicked, this);

    TweenMax.killTweensOf(this._nextButton.scale);
    Common.animator.add(TweenMax.to(this._nextButton.scale, .2, {x:0.6, y:0.6, ease:Sine.easeInOut, onComplete:function(){
        Common.animator.add(TweenMax.to(this._nextButton.scale, .5, {x:1, y:1, ease:Elastic.easeOut, onComplete:function(){
            this.signals.requestedNextScreen.dispatch();
        }, onCompleteScope:this}));

    }, onCompleteScope:this}));

    SoundSFX.play('sfx_ui_pressplay_00');
};

/**
 */
IntroScreen.prototype.buttonOver = function() {
        
    
};


//===================================================
// GETTERS/SETTERS
//===================================================


//===================================================


},{"../Common":2,"../general/SoundSFX":14,"./SimpleScreen":23}],22:[function(require,module,exports){
/**
 *  Preloader
 *
 *  Created by Legman on 5/04/2015.
 *
 */

var SimpleScreen        = require("./SimpleScreen");

var Common              = require("../Common");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 */
function Preloader() {
    
    /**
     * @type {Number}
     */
    this.loadedPercentage = 0.0;

    /**
     * @type {PIXI.Sprite}
     */
    this._barInner = null;

    /**
     * @type {PIXI.Sprite}
     */
    this._barInnerStartX = null;

    SimpleScreen.call(this);
}
module.exports = Preloader;
Preloader.prototype = Object.create(SimpleScreen.prototype);
Preloader.prototype.constructor = Preloader;

//===================================================
// PUBLIC METHODS
//===================================================

/**
 */
Preloader.prototype.init = function()
{
    console.log("PRELOADER INITIALIZED");
    SimpleScreen.prototype.init.call(this);

    this.loadedPercentage = 0.0;

    var bg = new PIXI.Sprite(this._assetManager.getTexture("preloader_bg"));
    this.addChild(bg);

    var barOuter = new PIXI.Sprite(this._assetManager.getTexture("preloader_overlay"));
    barOuter.anchor = new PIXI.Point(0.5, 0.5);
    barOuter.x = (Common.STAGE_WIDTH / 2) - 250;
    barOuter.y = (Common.STAGE_HEIGHT / 2) + 200;
    this.addChild(barOuter);

    this._barInner = new PIXI.Sprite(this._assetManager.getTexture("preloader_fill"));
    this._barInner.x = barOuter.x - (barOuter.width/2) - 170;
    this._barInner.y = barOuter.y - (barOuter.height/2) + 10;
    this.addChild(this._barInner);

    this.addChild(barOuter);

    this._barInnerStartX = this._barInner.x;

    var gr = new PIXI.Graphics();
    gr.beginFill(0x000000);
    gr.drawRect(0, 0, 1, 1);
    Common.generatedTextures['blackSquare'] = gr.generateTexture(Common.renderer, 1.0, PIXI.SCALE_MODES.LINEAR);

    var black = new PIXI.Sprite(Common.generatedTextures['blackSquare']);
    black.x = this._barInner.x - (this._barInner.width/2);
    black.width = barOuter.width/2;
    black.height = Common.STAGE_HEIGHT;
    this.addChild(black);
    
    var hiddenLiveText = new PIXI.Text("Test", {font: "32px FredFredburgerAra-Regular", fill: 0x000000, align: "center", stroke: 0x0, strokeThickness: 1});
    hiddenLiveText.alpha = 0;
    this.addChild(hiddenLiveText);
};

/**
 */
Preloader.prototype.dispose = function()
{
    SimpleScreen.prototype.dispose.call(this);
};

/**
 */
Preloader.prototype.resize = function()
{
    SimpleScreen.prototype.resize.call(this);

    this.x = (p3.View.width - Common.STAGE_WIDTH) * 0.5;
    this.y = (p3.View.height - Common.STAGE_HEIGHT) * 0.5;
};

/**
 */
Preloader.prototype.update = function()
{
    console.log("LOADING: " + this.loadedPercentage);

    /*
    this.loadedPercentage += 1;

    if(this.loadedPercentage > 100)
        this.loadedPercentage = 0;*/

    this._barInner.x = this._barInnerStartX + (698 * (this.loadedPercentage/100));
};

/**
 * @param {Function=} callback
 * @param {*=} scope
 */
Preloader.prototype.animateIn = function(callback, scope)
{
    SimpleScreen.prototype.animateIn.call(callback, scope);
};

/**
 * @param {Function=} callback
 * @param {*=} scope
 */
Preloader.prototype.animateOut = function(callback, scope) {
    SimpleScreen.prototype.animateOut.call(callback, scope);
    
    var timeline = new TimelineMax({
        onComplete: callback,
        onCompleteScope: scope
    });
    this._tweens.push(timeline);
};

//===================================================
// PRIVATE METHODS
//===================================================

//===================================================
// EVENTS
//===================================================

//===================================================
// GETTERS/SETTERS
//===================================================

//===================================================


},{"../Common":2,"./SimpleScreen":23}],23:[function(require,module,exports){

var Common      = require("../Common");
var Scene       = require("../lib/Scene");
var SoundSFX    = require("../general/SoundSFX");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 */
function SimpleScreen() {

    /**
     * @type {signals.Signal}
     */
    this.signals = {};
    this.signals.requestedNextScreen = new signals.Signal();
    this.signals.requestedPreviousScreen = new signals.Signal();
    this.signals.requestedPauseOverlay = new signals.Signal();

    /**
     * @type {p3.AssetManager}
     * @protected
     */
    this._assetManager = p3.AssetManager.instance;

    /**
     * @type {Array.<TweenMax>}
     * @protected
     */
    this._tweens = null;

    /**
     * @type {PIXI.Point}
     */
    this._centre = null;

    /**
     * @type {Number}
     */
    this._leftEdge = 0;

    /**
     * @type {Number}
     */
    this._rightEdge = 0;

    this._guiButtonTopMargin = 100;
    this._pauseButton = null;
    this._muteButton = null;


    p3.Screen.call(this);
}
module.exports = SimpleScreen;
SimpleScreen.prototype = Object.create(Scene.prototype);
SimpleScreen.prototype.constructor = SimpleScreen;

//===================================================
// PUBLIC METHODS
//===================================================

/**
 */
SimpleScreen.prototype.init = function() {
    this._tweens = [];
    this._centre = new PIXI.Point(Common.STAGE_WIDTH/2, Common.STAGE_HEIGHT/2);
};

/**
 */
SimpleScreen.prototype.dispose = function() {
    this.signals.requestedNextScreen.dispose();
    this.signals.requestedPreviousScreen.dispose();

    var tween;
    for (var i = 0; i < this._tweens.length; ++ i) {
        tween = this._tweens[i];
        if (tween) {
            tween.kill();
        }
    }
    this._tweens.length = 0;

    console.log("screen disposed");
};

/**
 */
SimpleScreen.prototype.resize = function() {
    
    this.x = (p3.View.width - Common.STAGE_WIDTH) * 0.5;

    this._rightEdge = this._centre.x + (p3.View.width/2);
    this._leftEdge = this._centre.x - (p3.View.width/2);
};

/**
 */
SimpleScreen.prototype.activate = function() {
    this.animateIn(function() {
        
    }, this);
};

/**
 * @param {Function=} callback
 * @param {*=}scope
 */
SimpleScreen.prototype.animateIn = function(callback, scope) {
    scope = scope || window;
};

/**
 * @param {Function=} callback
 * @param {*=} scope
 */
SimpleScreen.prototype.animateOut = function(callback, scope) {
    scope = scope || window;
};


//===================================================
// PRIVATE METHODS
//===================================================

SimpleScreen.prototype._addPauseButton = function()
{
    this._pauseButton = new p3.Button(this._assetManager.getTexture("but_pause_def"),
                                      this._assetManager.getTexture("but_pause_over"),
                                      this._assetManager.getTexture("but_pause_pressed"));
    this._pauseButton.y = this._guiButtonTopMargin;
    this._pauseButton.animate = true;
    this._pauseButton.signals.down.add(this.onPause, this);
    this.addChild(this._pauseButton);
}

SimpleScreen.prototype._addMuteButton = function()
{
    this._muteButton = new p3.MuteButton(
        this._assetManager.getTexture("but_soundon_def"),
        this._assetManager.getTexture("but_soundoff_def"),
        this._assetManager.getTexture("but_soundon_over"),
        this._assetManager.getTexture("but_soundoff_over"),
        this._assetManager.getTexture("but_soundon_pressed"),
        this._assetManager.getTexture("but_soundoff_pressed")
    );
    this._muteButton.id = "mute";
    this._muteButton.y = this._guiButtonTopMargin;
    this._muteButton.animate = true;
    this._muteButton.init();
    this._muteButton.signals.down.add(this.onMute, this);
    this.addChild(this._muteButton);
}

SimpleScreen.prototype._getFirstButtonPositionRight = function()
{
    return (Common.STAGE_WIDTH + p3.View.width) * 0.5 - 100.0;
}

SimpleScreen.prototype._getSecondButtonPositionRight = function()
{
    return (Common.STAGE_WIDTH + p3.View.width) * 0.5 - 210.0;
}

SimpleScreen.prototype._getFirstButtonPositionLeft = function()
{
    return (Common.STAGE_WIDTH - p3.View.width) * 0.5 + 100.0;
}

SimpleScreen.prototype._getSecondButtonPositionLeft = function()
{
    return (Common.STAGE_WIDTH - p3.View.width) * 0.5 + 210.0;
}

//===================================================
// EVENTS
//===================================================

/**
 * @param {!p3.Button} button
 */
SimpleScreen.prototype.onButtonClickedPrevious = function(button) {

};

SimpleScreen.prototype.onPause = function()
{
    this.signals.requestedPauseOverlay.dispatch();
    SoundSFX.play('sfx_ui_press_button_01');
};

SimpleScreen.prototype.onMute = function()
{
    SoundSFX.play('sfx_ui_press_button_01');
};


//===================================================
// GETTERS/SETTERS
//===================================================

//===================================================


},{"../Common":2,"../general/SoundSFX":14,"../lib/Scene":15}],24:[function(require,module,exports){

var Common                  = require("../Common");
var SimpleScreen            = require("./SimpleScreen");
var SoundSFX                = require("../general/SoundSFX");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 */
function SplashScreen()
{
    this._bg            = null;

    this._titleText     = null;
    this._blossom       = null;
    this._bubbles       = null;
    this._buttercup     = null;
    this._trailBlazer   = null;

    this._playButton    = null;
    this._muteButton    = null;
    this._exitButton    = null;

    SimpleScreen.call(this);
}
module.exports = SplashScreen;
SplashScreen.prototype = Object.create(SimpleScreen.prototype);
SplashScreen.prototype.constructor = SplashScreen;


//===================================================
// PUBLIC METHODS
//===================================================

/**
 */
SplashScreen.prototype.init = function()
{
    console.log("SPLASH INITIALIZED");

    SimpleScreen.prototype.init.call(this);

    this._bg = new PIXI.Sprite(this._assetManager.getTexture("bg_splash"));
    this._bg.anchor = new PIXI.Point(0.5, 0.5);
    this._bg.x = Common.STAGE_WIDTH / 2;
    this._bg.y = Common.STAGE_HEIGHT / 2;
    this.addChild(this._bg);

    var buildings = [
                    {image:'bit1', x:(Common.STAGE_WIDTH/2)-500, y:300},
                    {image:'bit2', x:(Common.STAGE_WIDTH/2)-630, y:450},
                    {image:'bit3', x:(Common.STAGE_WIDTH/2)-700, y:200},
                    {image:'bit4', x:(Common.STAGE_WIDTH/2)-500, y:530},
                    {image:'bit6', x:(Common.STAGE_WIDTH/2)-550, y:650},
                    ];

    var fg_building;

    for(var i = 0; i < buildings.length; i++)
    {
        var building = new PIXI.Sprite(this._assetManager.getTexture(buildings[i].image));
        building.anchor = new PIXI.Point(0.5, 0.5);
        building.x = buildings[i].x;
        building.y = buildings[i].y;
        this.addChild(building);
        Common.animator.add(TweenMax.to(building, 1, {delay:Math.random(), y:buildings[i].y-20, ease:Sine.easeInOut, yoyo:true, repeat:-1}));

        if(i == buildings.length-1)
            fg_building = building;
    }

    this._mojo = new PIXI.Sprite(this._assetManager.getTexture("mojojojo"));
    this._mojo.anchor = new PIXI.Point(0, 1);
    this._mojo.y = Common.STAGE_HEIGHT + this._mojo.height;
    this._mojo.x = (Common.STAGE_WIDTH/2) - this._mojo.width - 10;
    this.addChild(this._mojo);

        var leftGlow = new PIXI.Sprite(this._assetManager.getTexture("mojojojo_handglow_left"));
        leftGlow.anchor = new PIXI.Point(0.5, 0.5);
        leftGlow.x = 270;
        leftGlow.scale = new PIXI.Point(0.4, 0.4);
        leftGlow.y = -this._mojo.height + 70;
        this._mojo.addChild(leftGlow);
        var rightGlow = new PIXI.Sprite(this._assetManager.getTexture("mojojojo_handglow_right"));
        rightGlow.anchor = new PIXI.Point(0.5, 0.5);
        rightGlow.x = 570;
        rightGlow.y = -this._mojo.height + 120;
        rightGlow.scale = new PIXI.Point(0.4, 0.4);
        this._mojo.addChild(rightGlow);

        var glows = [leftGlow, rightGlow];
        for(var i = 0; i < glows.length; i++)
        {
            Common.animator.add(TweenMax.to(glows[i].scale, .24 + (0.01*i), {x:1.2, y:1.2, ease:Sine.easeInOut, repeat:-1}));
            Common.animator.add(TweenMax.to(glows[i], .24 + (0.01*i), {alpha:0.1, ease:Sine.easeInOut, repeat:-1, onRepeatScope:this, onRepeatParams:[glows[i]], onRepeat:function(glow){
                glow.rotation = (360 * Math.random()) * PIXI.DEG_TO_RAD;
            }}));
        }

        var tl = new TimelineMax({repeat:-1});
        tl.to(this._mojo.scale, .3, {y:0.9, ease:Sine.easeInOut});
        tl.to(this._mojo.scale, .1, {y:1, ease:Sine.easeInOut});
        tl.to(this._mojo.scale, .1, {y:0.95, ease:Sine.easeInOut});
        tl.to(this._mojo.scale, .1, {y:1, ease:Sine.easeInOut});
        tl.to(this._mojo.scale, .1, {y:0.97, ease:Sine.easeInOut});
        tl.to(this._mojo.scale, .1, {y:1, ease:Sine.easeInOut});
        tl.to(this._mojo.scale, 2, {ease:Sine.easeInOut});


    this.addChild(fg_building);

    this._titleText = new PIXI.Sprite(this._assetManager.getTexture("ppg_logo"));
    this._titleText.anchor = new PIXI.Point(0.5, 0.5);
    this._titleText.x = (Common.STAGE_WIDTH/2) - 100;
    this._titleText.y = 150;
    this._titleText.scale = new PIXI.Point(0, 0);
    this.addChild(this._titleText);

    this._blossom = new PIXI.Sprite(this._assetManager.getTexture("girl2"));
    this._blossom.anchor = new PIXI.Point(0, 1);
    this._blossom.scale = new PIXI.Point(0, 0);
    this._blossom.x = (Common.STAGE_WIDTH/2) - 220; 
    this._blossom.y = Common.STAGE_HEIGHT + 100;
    Common.animator.add(TweenMax.to(this._blossom.anchor, 1, {delay:Math.random(), y:0.995, ease:Sine.easeInOut, yoyo:true, repeat:-1}));
    this.addChild(this._blossom);

    this._bubbles = new PIXI.Sprite(this._assetManager.getTexture("girl1"));
    this._bubbles.anchor = new PIXI.Point(0, 1);
    this._bubbles.scale = new PIXI.Point(0, 0);
    this._bubbles.x = (Common.STAGE_WIDTH/2) - 230; 
    this._bubbles.y = Common.STAGE_HEIGHT + 30;
    Common.animator.add(TweenMax.to(this._bubbles.anchor, 1, {delay:Math.random(), y:0.99, ease:Sine.easeInOut, yoyo:true, repeat:-1}));
    this.addChild(this._bubbles);

    this._buttercup = new PIXI.Sprite(this._assetManager.getTexture("girl3"));
    this._buttercup.anchor = new PIXI.Point(0, 1);
    this._buttercup.scale = new PIXI.Point(0, 0);
    this._buttercup.x = (Common.STAGE_WIDTH/2) - 50; 
    this._buttercup.y = Common.STAGE_HEIGHT - 20;
    Common.animator.add(TweenMax.to(this._buttercup.anchor, 1, {delay:Math.random(), y:0.99, ease:Sine.easeInOut, yoyo:true, repeat:-1})); 
    this.addChild(this._buttercup);

    this._trailBlazer = new PIXI.Sprite(this._assetManager.getTexture("game_title"));
    this._trailBlazer.anchor = new PIXI.Point(1, 1);
    this._trailBlazer.x = -(this._trailBlazer.width);
    this._trailBlazer.y = Common.STAGE_HEIGHT - 200;
    this.addChild(this._trailBlazer);

    this._playButton = new p3.Button(this._assetManager.getTexture("but_play_def"), this._assetManager.getTexture("but_play_over"), this._assetManager.getTexture("but_play_pressed"));
    this._playButton.x = (Common.STAGE_WIDTH / 2);
    this._playButton.y = Common.STAGE_HEIGHT - 100;
    this._playButton.signals.down.addOnce(this.playClicked, this);
    this._playButton.signals.over.add(this.buttonOver, this);
    this._playButton.scale = new PIXI.Point(0, 0);
    this._playButton.animate = false;
    this.addChild(this._playButton);

    this._addMuteButton();

    if(!p3.Device.isIOS)
    {
        SoundSFX.play('music_ppg_splash_generic', {loop:true});
    }
};

/**
 */
SplashScreen.prototype.update = function()
{
    
};

SplashScreen.prototype.dispose = function()
{

};

/**
 */
SplashScreen.prototype.resize = function()
{
    SimpleScreen.prototype.resize.call(this);

    this._playButton.x = this._getFirstButtonPositionRight() - 50;
    this._muteButton.x = this._getFirstButtonPositionRight();
};

/**
 * @param {Function=} callback
 * @param {*=}scope
 */
SplashScreen.prototype.animateIn = function(callback, scope) {
    
    SimpleScreen.prototype.animateIn.call(this);

    var tl = new TimelineMax();
    Common.animator.add(tl);
    tl.to(this._titleText.scale, .3, {delay:.5, x:1, y:1, ease:Expo.easeOut});
    tl.to(this._mojo, .3, {y:Common.STAGE_HEIGHT - 50, ease:Expo.easeOut});
    tl.to(this._blossom.scale, .3, {x:1, y:1, ease:Expo.easeOut, onStartScope:this, onStart:function(){
        SoundSFX.play('sfx_ppg_girls_flyaway_00');
    }});
    tl.to(this._bubbles.scale, .3, {x:1, y:1, ease:Expo.easeOut, onStartScope:this, onStart:function(){
        SoundSFX.play('sfx_ppg_girls_flyaway_00');
    }});
    tl.to(this._buttercup.scale, .3, {x:1, y:1, ease:Expo.easeOut, onStartScope:this, onStart:function(){
        SoundSFX.play('sfx_ppg_girls_flyaway_00');
    }});
    tl.to(this._trailBlazer, .3, {x:(Common.STAGE_WIDTH / 2) + 230, y:Common.STAGE_HEIGHT-50, ease:Expo.easeOut, onStartScope:this, onStart:function(){
        SoundSFX.play('sfx_ppg_move_00');
    }});
    tl.to(this._playButton.scale, 1, {x:1, y:1, ease:Elastic.easeOut});

};

/**
 * @param {Function=} callback
 * @param {*=} scope
 */
SplashScreen.prototype.animateOut = function(callback, scope) {
        
    SimpleScreen.prototype.animateOut.call(this);
};



//===================================================
// PRIVATE METHODS
//===================================================


//===================================================
// EVENTS
//===================================================

/**
 */
SplashScreen.prototype.playClicked = function() {
    
    this._playButton.signals.over.remove(this.buttonOver, this);
    this._playButton.signals.down.remove(this.playClicked, this);

    TweenMax.killTweensOf(this._playButton.scale);
    Common.animator.add(TweenMax.to(this._playButton.scale, .2, {x:0.6, y:0.6, ease:Sine.easeInOut, onComplete:function(){
        Common.animator.add(TweenMax.to(this._playButton.scale, .5, {x:1, y:1, ease:Elastic.easeOut, onComplete:function(){
            this.signals.requestedNextScreen.dispatch();
        }, onCompleteScope:this}));

    }, onCompleteScope:this}));

    SoundSFX.play('sfx_ui_pressplay_00');

    if(p3.Device.isIOS)
    {
        SoundSFX.play('music_ppg_splash_generic', {loop:true});
    }
};

/**
 */
SplashScreen.prototype.buttonOver = function() {
        
    
};


//===================================================
// GETTERS/SETTERS
//===================================================


//===================================================


},{"../Common":2,"../general/SoundSFX":14,"./SimpleScreen":23}],25:[function(require,module,exports){
var Common          = require("../Common");
var ScrollerObject	= require("./ScrollerObject");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 * @param {PIXI.Point} screenFocusPoint
 * @param {PIXI.Rectangle} viewBoundary
 * @param {PIXI.Rectangle} activeBoundary
 */
function ScrollerEngine(screenFocusPoint, viewBoundary, activeBoundary)
{
	/**
     * @type {signals.Signal}
     */
    this.signals = {};
	this.signals.collisionFired = new signals.Signal();

	/**
     * @type {PIXI.Point} - Point, relative to screen size, that the engine is focused on.
     */
	this._screenFocusPoint = screenFocusPoint;

	/**
     * @type {PIXI.Point} - World Point, signifying position of camera in the world.
     */
	this._view = screenFocusPoint.clone();

	/**
     * @type {PIXI.Rectangle} - The boundary rectangle, relative to the screenFocusPoint, in which the world objects are visible
     */
	this._viewBoundary = viewBoundary;

	/**
     * @type {PIXI.Rectangle} - The boundary rectangle, relative to the screenFocusPoint, in which the world objects are active
     */
	this._activeBoundary = activeBoundary;

	/**
     * @type {p3.Camera}
     */
    this._camera = null;

    /**
     * @type {Object}
     */
    this._layers = null;

    /**
     * @type {Array<ScrollerLoopingRange>}
     */
    this._loopingRanges = null;

    /**
     * @type {Array<Array<String>>}
     */
    this._collisions = null;

    
	PIXI.Container.call(this);
}
module.exports = ScrollerEngine;
ScrollerEngine.prototype = Object.create(PIXI.Container.prototype);
ScrollerEngine.prototype.constructor = ScrollerEngine;


//===================================================
// PUBLIC METHODS
//===================================================

/**
 */
ScrollerEngine.prototype.init = function()
{
    this._camera = new p3.Camera(this._view, true);
    this._layers = {};
    this._loopingRanges = [];
    this._collisions = [];
};

/**
 */
ScrollerEngine.prototype.update = function()
{
	for(var i in this._layers)
	{
		var cont = this._layers[i].container;

		for(var j = 0; j < this._layers[i].objects.length; j++)
		{
			var obj = this._layers[i].objects[j];

			obj.update();

			if(obj.removeIfOutsideBoundary)
			{
				if(cont.x + obj.x + obj.areaRect.x + obj.areaRect.width < this._screenFocusPoint.x + this._activeBoundary.x ||
				   cont.y + obj.y + obj.areaRect.y + obj.areaRect.width < this._screenFocusPoint.y + this._activeBoundary.y ||
				   cont.x + obj.x > this._screenFocusPoint.x + this._activeBoundary.x + this._activeBoundary.width ||
				   cont.y + obj.y > this._screenFocusPoint.y + this._activeBoundary.y + this._activeBoundary.height)
				{
					this.removeObjectFromLayer(obj, i);
				}
			}
			if(obj.removeMe)
			{
				this.removeObjectFromLayer(obj, i);
			}	
			if(obj.persistentX)
			{
				obj.x = (this._screenFocusPoint.x + obj.persistentX) - cont.x;
			}
			if(obj.persistentRectangle)
			{
				var objX = cont.x + obj.x + obj.areaRect.x;
				var objY = cont.y + obj.y + obj.areaRect.y;
				var objXEdge = cont.x + obj.x + obj.areaRect.x + obj.areaRect.width;
				var objYEdge = cont.y + obj.y + obj.areaRect.y + obj.areaRect.height;
				var leftLimit = this._screenFocusPoint.x + obj.persistentRectangle.x;
				var rightLimit = leftLimit + obj.persistentRectangle.width;
				var upperLimit = this._screenFocusPoint.y + obj.persistentRectangle.y;
				var lowerLimit = upperLimit + obj.persistentRectangle.height;

				if(objX < leftLimit && obj.xSpeed <= 0)
				{
					obj.x = obj.x + ((leftLimit-objX) * obj.persistentRectangleExitEase);
					obj.onExitPersistentRectangle('left');
				}
				
				if(objY < upperLimit && obj.ySpeed <= 0)
				{
					obj.y = obj.y + ((upperLimit-objY) * obj.persistentRectangleExitEase);
					obj.onExitPersistentRectangle('upper');
				}

				if(objXEdge > rightLimit && obj.xSpeed >= 0)
				{
					obj.x = obj.x - ((objXEdge-rightLimit) * obj.persistentRectangleExitEase);
					obj.onExitPersistentRectangle('right');
				}
				
				if(objYEdge > lowerLimit && obj.xSpeed >= 0)
				{
					obj.y = obj.y - ((objYEdge-lowerLimit) * obj.persistentRectangleExitEase);
					obj.onExitPersistentRectangle('lower');
				}
			}
			for(var c = 0; c < this._collisions.length; c++)
			{
				if(this._collisions[c].length == 2)
				{	
					if(this._collisions[c][0] == obj.type)
					{
						this._checkForCollisions(obj, cont, this._collisions[c][1]);
					}	
				}	
			}	
		}	
	}

	for(var i = 0; i < this._loopingRanges.length; i++)
	{
		var newObjects = this._loopingRanges[i].update(this._screenFocusPoint, this._viewBoundary, this._layers[this._loopingRanges[i].layer].container);
		for(var j = 0; j < newObjects.length; j++)
		{
			newObjects[j].obj.areaRect = new PIXI.Rectangle(newObjects[j].areaRect.x, newObjects[j].areaRect.y, newObjects[j].areaRect.width, newObjects[j].areaRect.height);
			this.addObjectToLayer(newObjects[j].obj, this._loopingRanges[i].layer, newObjects[j].offset.x, newObjects[j].offset.y);
		}	
	}	
};

/**
 * @param {!String} name
 * @param {Point=} parallax
 * @returns {String}
 */
ScrollerEngine.prototype.addLayer = function(name, parallax)
{
	parallax = parallax || new PIXI.Point(1, 1);
	var container = new PIXI.Container();
	this.addChild(container);
	this._layers[name] = {container:container, objects:[], parallax:parallax};
	this._camera.addLayer(name, container, parallax);
}

/**
 * @param {!ScrollerObject} scrollerObject
 * @param {!String} layerName
 * @param {Number=} xPosition
 * @param {Number=} yPosition
 */
ScrollerEngine.prototype.addObjectToLayer = function(scrollerObject, layerName, xPosition, yPosition)
{
	this._layers[layerName].container.addChild(scrollerObject);
	if(xPosition)
		scrollerObject.x = xPosition;
	if(yPosition)
		scrollerObject.y = yPosition;
	this._layers[layerName].objects.push(scrollerObject);
}

/**
 * @param {!ScrollerObject} scrollerObject
 * @param {String=} layerName
 */
ScrollerEngine.prototype.removeObjectFromLayer = function(scrollerObject, layerName)
{
	var placeInArray;

	if(layerName == null)
	{
		for(var i in this._layers)
		{
			placeInArray = this._layers[i].objects.indexOf(scrollerObject);
			layerName = i;
			break;
		}
	}

	this._layers[layerName].container.removeChild(scrollerObject);
	
	if(placeInArray == null)
		placeInArray = this._layers[layerName].objects.indexOf(scrollerObject);

	if(placeInArray > -1)
		this._layers[layerName].objects.splice(placeInArray, 1);

	for(var i = 0; i < this._loopingRanges.length; i++)
	{
		if(layerName == this._loopingRanges[i].layer)
		{
			this._loopingRanges[i].objectRemoved(scrollerObject);
			break;
		}	
	}

	scrollerObject.dispose();	
}

/**
 * @param {ScrollerLoopingRange} loop
 * @param {String} layerName
 * @param {Number} originX
 * @param {Number} originY
 */
ScrollerEngine.prototype.addLoopingRangeToLayer = function(loop, layerName, originX, originY)
{
	loop.layer = layerName;
	var arr = loop.generate(this._viewBoundary.width, this._viewBoundary.height, originX, originY);
	this._loopingRanges.push(loop);

	var d = 'x';
	var e = 'width';
	var currentX = this._viewBoundary.x * this._layers[layerName].parallax.x;
	var currentY = originY;
	
	if(loop.scrollY)
	{
		d = 'y';
		e = 'height';
		currentX = originX;
		currentY = this._activeBoundary.y * this._layers[layerName].parallax.y;
	} 

	for(var i = 0; i < arr.length; i++)
	{
		arr[i].obj.areaRect = arr[i].areaRect;
		this.addObjectToLayer(arr[i].obj, layerName, currentX + (loop.scrollY ? arr[i].offset.x : 0), currentY + (loop.scrollX ? arr[i].offset.y : 0));

		if(loop.scrollX)
			currentX += arr[i].areaRect.x + arr[i].areaRect.width + arr[i].offset.x;
		else if(loop.scrollY)
			currentY += arr[i].areaRect.y + arr[i].areaRect.height + arr[i].offset.y;
	}	
}

/**
 * @param {!String} object1Type
 * @param {!String} object2Type
 */
ScrollerEngine.prototype.addCollisionDetector = function(object1Type, object2Type)
{
	this._collisions.push([object1Type, object2Type]);
}

/**
 */
ScrollerEngine.prototype.pause = function()
{
	for(var i in this._layers)
	{
		for(var j = 0; j < this._layers[i].objects.length; j++)
		{
			var obj = this._layers[i].objects[j];

			obj.pause();
		}
	}
}

/**
 */
ScrollerEngine.prototype.resume = function()
{
	for(var i in this._layers)
	{
		for(var j = 0; j < this._layers[i].objects.length; j++)
		{
			var obj = this._layers[i].objects[j];

			obj.resume();
		}
	}
}

/**
 * @param {String} layerName
 */
ScrollerEngine.prototype.getLayerContainer = function(layerName)
{
	return this._layers[layerName].container;
}

/**
 * @param {String} layerName
 */
ScrollerEngine.prototype.getLayerParallax = function(layerName)
{
	return this._layers[layerName].parallax;
}

ScrollerEngine.prototype.getAllObjectsOfType = function(type)
{   
    var ret = [];

    for(var i in this._layers)
    {
        var cont = this._layers[i].container;

        for(var j = 0; j < this._layers[i].objects.length; j++)
        {
            if(this._layers[i].objects[j].type == type)
                ret.push(this._layers[i].objects[j]);
        }
    }
    return ret;
}

ScrollerEngine.prototype.getObjectPositionOnScreen = function(obj)
{
    var ret = new PIXI.Point(this.x + obj.parent.x + obj.x, this.y + obj.parent.y + obj.y);
    return ret;
}


//===================================================
// PRIVATE METHODS
//===================================================

/**
 * @param {!ScrollerObject} obj
 * @param {!PIXI.Container} objCont
 * @param {!String} collidingType
 */
ScrollerEngine.prototype._checkForCollisions = function(obj1, obj1Cont, collidingType)
{
	for(var i in this._layers)
	{
		var obj2Cont = this._layers[i].container;

		for(var j = 0; j < this._layers[i].objects.length; j++)
		{
			if(this._layers[i].objects[j].type == collidingType)
			{
				var obj2 = this._layers[i].objects[j];

				var r1Left = obj1Cont.x + obj1.x + obj1.collisionRect.x; 
				var r2Left = obj2Cont.x + obj2.x + obj2.collisionRect.x; 
				
				var r1Right = r1Left + obj1.collisionRect.width; 
				var r2Right = r2Left + obj2.collisionRect.width;
				
				var r1Top = obj1Cont.y + obj1.y + obj1.collisionRect.y; 
				var r2Top = obj2Cont.y + obj2.y + obj2.collisionRect.y;
				
				var r1Bottom = r1Top + obj1.collisionRect.height; 
				var r2Bottom = r2Top + obj2.collisionRect.height;
				
				var collision = true;

				if (r1Bottom < r2Top) collision = false;
		        if (r1Top > r2Bottom) collision = false;
		
		        if (r1Right < r2Left) collision = false;
		        if (r1Left > r2Right) collision = false;

		        if(collision)
		        	this.signals.collisionFired.dispatch(obj1, obj2);
			}	
		}
	}
}


//===================================================
// EVENTS
//===================================================


//===================================================
// GETTERS/SETTERS
//===================================================

Object.defineProperty(ScrollerEngine.prototype, "viewX", {
	/**
	 * @returns {Number}
	 */
	get: function() {
		return this._view.x;
	},
	/**
	 * @param {!Number} value
	 */
	set: function(value) {
		this._view.x = value;
		this._camera.update();
		return this._view.x;
	}
});

Object.defineProperty(ScrollerEngine.prototype, "viewY", {
	/**
	 * @returns {Number}
	 */
	get: function() {
		return this._view.y;
	},
	/**
	 * @param {!Number} value
	 */
	set: function(value) {
		this._view.y = value;
		this._camera.update();
		return this._view.y;
	}
});

Object.defineProperty(ScrollerEngine.prototype, "activeBoundary", {

	get: function() {
		return this._activeBoundary;
	},

	set: function(value) {
		this._activeBoundary = value;
		return this._activeBoundary;
	}
});

Object.defineProperty(ScrollerEngine.prototype, "viewBoundary", {

	get: function() {
		return this._viewBoundary;
	},

	set: function(value) {
		this._viewBoundary = value;
		return this._viewBoundary;
	}
});

Object.defineProperty(ScrollerEngine.prototype, "screenFocusPoint", {
	/**
	 * @returns {Number}
	 */
	get: function() {
		return this._screenFocusPoint;
	},
	/**
	 * @param {!Number} value
	 */
	set: function(value) {
		this._screenFocusPoint = value;
		return this._screenFocusPoint;
	}
});


//===================================================


},{"../Common":2,"./ScrollerObject":27}],26:[function(require,module,exports){
var Common          = require("../Common");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 * @param {!Array<Object>} objects - {base:<ScrollerObject>, args:<Array>, areaRect:PIXI.Rectangle, offset:PIXI.Point}
 * @param {Boolean} scrollX
 * @param {Boolean} scrollY
 */
function ScrollerLoopingRange(objects, scrollX, scrollY)
{
	this.signals = {};
	this.signals.objectGenerated = new signals.Signal();

	/**
     * @type {Array<Object>}
     */
	this._objectsData = objects;

	/**
     * @type {Array<ScrollerObject>}
     */
	this._objects = null;

	/**
     * @type {Array<p3.ObjectPool>}
     */
	this._objectPools = null;

	/**
     * @type {Object}
     */
	this._objectsPlaced = -1;

	/**
     * @type {Boolean}
     */
	this._originX = 0;

	/**
     * @type {Boolean}
     */
	this._originY = 0;

	/**
     * @type {Boolean}
     */
	this._scrollX = scrollX;

	/**
     * @type {Boolean}
     */
	this._scrollY = scrollY;

	/**
     * @type {String}
     */
	this.layer = null;

	this.init();
}
module.exports = ScrollerLoopingRange;
ScrollerLoopingRange.prototype = Object.create(PIXI.Container.prototype);
ScrollerLoopingRange.prototype.constructor = ScrollerLoopingRange;


//===================================================
// PUBLIC METHODS
//===================================================

/**
 */
ScrollerLoopingRange.prototype.init = function()
{
	this._objectPools = [];
	this._objects = [];
};

/**
 */
ScrollerLoopingRange.prototype.generate = function(viewWidth, viewHeight, originX, originY)
{
	if(this.scrollY)
		this._originX = originX;

	if(this.scrollX)
		this._originY = originY;

	var d = 'x';
	var e = 'width';
	var m = viewWidth;
	if(this._scrollY)
	{
		d = 'y';
		e = 'height';
		m = viewHeight;
	}	

	var total = 0;
	for(var i = 0; i < this._objectsData.length; i++)
	{
		total += this._objectsData[i].areaRect[d] + this._objectsData[i].areaRect[e] + this._objectsData[i].offset[d];
	}

	var objectAmounts = [];
	for(var i = 0; i < Math.ceil(viewWidth / total); i++)
	{	
		for(var j = 0; j < this._objectsData.length; j++)
		{
			if(objectAmounts[j] == undefined)
				objectAmounts[j] = 0;
			objectAmounts[j]++;	
		}
	}

	for(var i = 0; i < this._objectsData.length; i++)
	{
		this._objectPools[i] = new p3.ObjectPool(this._objectsData[i].base, objectAmounts[i], this._objectsData[i].args);
	}

	var returnArray = [];

	for(var i = 0; i < Math.ceil(viewWidth/total); i++)
	{	
		for(var j = 0; j < this._objectsData.length; j++)
		{
			var obj = this._objectPools[j].create();

			if(obj == null)
			{
				this._objectPools[j].expand(2);
				obj = this._objectPools[j].create();
			}
			this._objects.push(obj);

			returnArray.push({obj:obj, areaRect:this._objectsData[j].areaRect, offset:this._objectsData[j].offset});
			this._objectsPlaced++;
			obj.loopingRangeNumber = this._objectsPlaced;
			
			this.signals.objectGenerated.dispatch(obj);
		}
	}
	
	return returnArray;
}

/**
 */
ScrollerLoopingRange.prototype.update = function(focusPoint, viewBoundary, layerContainer)
{
	//var previousObjectNumber = Math.abs((this._objects[0].loopingRangeNumber-1) % this._objectsData.length);
	var nextObjectNumber = (this._objectsPlaced+1) % this._objectsData.length;
	//var previousObjectData = this._objectsData[previousObjectNumber];
	var nextObjectData = this._objectsData[nextObjectNumber];

	//var firstObject = this._objects[0];
	var lastObject = this._objects[this._objects.length-1];

	var d = 'x';
	var e = 'width';
	var o = 'y';

	if(this._scrollY)
	{
		d = 'y';
		e = 'height';
		o = 'x';
	}

	var returnArray = [];

	/*
	if(layerContainer[d] + firstObject[d] + firstObject.areaRect[d] + previousObjectData.offset[d] 
		> focusPoint[d] + viewBoundary[d])
	{
		var obj = this._objectPools[previousObjectNumber].create();

		if(obj == null)
		{
			this._objectPools[j].expand(2);
			obj = this._objectPools[j].create();
		}

		var offset = new PIXI.Point();
		offset[d] = firstObject[d] - (previousObjectData.areaRect[e] + previousObjectData.areaRect[d]) + previousObjectData.offset[d];
		offset[o] = previousObjectData[o];
		
		returnArray.push({obj:obj, areaRect:previousObjectData.areaRect, offset:offset});
		obj.loopingRangeNumber = this._objects[0].loopingRangeNumber-1;

		this._objects.splice(0, 0, obj);
	}*/

	var newPlacement = lastObject[d] + lastObject.areaRect[d] + lastObject.areaRect[e] + nextObjectData.offset[d]; //+ Math.abs(nextObjectData.areaRect[d]) + nextObjectData.offset[d];

	if(layerContainer[d] + newPlacement
		< focusPoint[d] + viewBoundary[d] + viewBoundary[e])
	{
		var obj = this._objectPools[nextObjectNumber].create();

		if(obj == null)
		{
			this._objectPools[nextObjectNumber].expand(2);
			obj = this._objectPools[nextObjectNumber].create();
		}

		var offset = new PIXI.Point();
		offset[d] = newPlacement;
		offset[o] = nextObjectData.offset[o] + this['_origin' + [o.toUpperCase()]];

		returnArray.push({obj:obj, areaRect:nextObjectData.areaRect, offset:offset});
		this._objectsPlaced++;
		obj.loopingRangeNumber = this._objectsPlaced;

		this._objects.push(obj);
		this.signals.objectGenerated.dispatch(obj);
	}

	return returnArray;
				   
};


//===================================================
// PRIVATE METHODS
//===================================================


//===================================================
// EVENTS
//===================================================

/**
 */
ScrollerLoopingRange.prototype.objectRemoved = function(obj)
{
	var index = this._objects.indexOf(obj);
	if(index >= 0)
	{
		this._objectPools[obj.loopingRangeNumber % this._objectsData.length].free(obj);	
		this._objects.splice(index, 1);
	}
};

//===================================================
// GETTERS/SETTERS
//===================================================

Object.defineProperty(ScrollerLoopingRange.prototype, "scrollX", {

	get: function() {
		return this._scrollX;
	}
});


//===================================================


},{"../Common":2}],27:[function(require,module,exports){
var Common          = require("../Common");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 * @param {PIXI.Texture} texture
 * @param {String} type
 * @param {Boolean} removeIfOutsideBoundary
 */
function ScrollerObject(type, removeIfOutsideBoundary)
{
    /**
     * @type {p3.AssetManager}
     */
    this._assetManager = p3.AssetManager.instance;

	/**
     * @type {signals.Signal}
     */
    this.signals = {};
    this.signals.disposed = new signals.Signal();

	/**
     * @type {String}
     */
	this._type = type;

	/**
     * @type {PIXI.Rectangle}
     */
	this.collisionRect = null;

	/**
     * @type {PIXI.Rectangle}
     */
	this.areaRect = null;

	/**
     * @type {Number}
     */
	this.loopingRangeNumber = null;

	/**
     * @type {PIXI.Rectangle}
     */
	this.removeIfOutsideBoundary = removeIfOutsideBoundary == null ? true : removeIfOutsideBoundary;

	/**
     * @type {Number}
     */
    this.xSpeed = 0;

	/**
     * @type {Number}
     */
    this.ySpeed = 0;

	/**
     * @type {Number}
     */
	this.persistentX = null;

	/**
     * @type {Number}
     */
	this.persistentY = null;

	/**
     * @type {Number}
     */
	this.persistentRectangle = null;

	/**
     * @type {Number}
     */
	this.persistentRectangleExitEase = 1;

    /**
     * @type {Bollean}
     */
    this.removeMe = false;

    /**
     * @type {PIXI.Graphics}
     */
    this._collisionRectGraphic = null;

	PIXI.Container.call(this);
}
module.exports = ScrollerObject;
ScrollerObject.prototype = Object.create(PIXI.Container.prototype);
ScrollerObject.prototype.constructor = ScrollerObject;


//===================================================
// PUBLIC METHODS
//===================================================

/**
 */
ScrollerObject.prototype.init = function()
{

};

/**
 */
ScrollerObject.prototype.template = function()
{

};

/**
 */
ScrollerObject.prototype.create = function()
{
    
};

/**
 */
ScrollerObject.prototype.update = function()
{
    this.x += this.xSpeed;
    this.y += this.ySpeed;
};

/**
 */
ScrollerObject.prototype.reset = function()
{
	this.x = 0;
	this.y = 0;
    this.removeMe = false;
};

/**
 */
ScrollerObject.prototype.dispose = function()
{
	this.signals.disposed.dispatch(this);
}

/**
 */
ScrollerObject.prototype.pause = function()
{
    
}

/**
 */
ScrollerObject.prototype.resume = function()
{
    
}

/**
 */
ScrollerObject.prototype.drawCollisionRect = function()
{
    if(this._collisionRectGraphic == null)
    {
        this._collisionRectGraphic = new PIXI.Graphics();
    }
    this.addChild(this._collisionRectGraphic);
    this._collisionRectGraphic.clear();
    this._collisionRectGraphic.lineStyle(1, 0xF7111D);
    this._collisionRectGraphic.drawRect(this.collisionRect.x, this.collisionRect.y, this.collisionRect.width, this.collisionRect.height);
}


//===================================================
// PRIVATE METHODS
//===================================================


//===================================================
// EVENTS
//===================================================

/**
 * @type {!String} side (left, right, upper or left)
 */
ScrollerObject.prototype.onExitPersistentRectangle = function(side)
{
	
};

//===================================================
// GETTERS/SETTERS
//===================================================

Object.defineProperty(ScrollerObject.prototype, "type", {

	get: function() {
		return this._type;
	}
});



//===================================================


},{"../Common":2}],28:[function(require,module,exports){
var Common          = require("../Common");
var ScrollerObject	= require("./ScrollerObject");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 * @param {!Array<Object>} base:*, args:Array
 * @param {!Array<*>} args
 */
function ScrollerObjectGenerator(pools)
{
	/**
     * @type {signals.Signal}
     */
    this.signals = {};
	this.signals.generateObjects = new signals.Signal();
	this.signals.objectDisposed = new signals.Signal();

	/**
     * @type {Array<Object>}
     */
	this._poolData = pools;

	/**
     * @type {Object}
     */
	this._pools = null;

	/**
     * @type {Object}
     */
    this._patterns = null;

	/**
     * @type {Number}
     */	
	this._currentCount = 0;

	/**
     * @type {Number}
     */	
	this._countTarget = null;

	/**
     * @type {Number}
     */
	this._minFrequency = null;

	/**
     * @type {Number}
     */
	this._maxFrequency = null;

	/**
     * @type {Array}
     */
	this._predefinedPatterns = null;

	PIXI.Container.call(this);

	this.init();
}
module.exports = ScrollerObjectGenerator;
ScrollerObjectGenerator.prototype = Object.create(PIXI.Container.prototype);
ScrollerObjectGenerator.prototype.constructor = ScrollerObjectGenerator;


//===================================================
// PUBLIC METHODS
//===================================================

/**
 */
ScrollerObjectGenerator.prototype.init = function()
{
	this._pools = {};	
	for(var i = 0; i < this._poolData.length; i++)
	{
		this._pools[this._poolData[i].id] = new p3.ObjectPool(this._poolData[i].base, 2, this._poolData[i].args);
	}
	this._patterns = {};
	this._predefinedPatterns = [];
};

/**
 */
ScrollerObjectGenerator.prototype.update = function()
{
	if(this._countTarget != null)
	{	
		this._currentCount++;
		if(this._currentCount >= this._countTarget)
		{
			this.generate();
			this.setRandomFrequency();
		}
	}
};

/**
 * @param {Array<Object>} objs - {x, y, poolId}
 * @param {String} patternId
 */
ScrollerObjectGenerator.prototype.addPattern = function(objs, patternId)
{
	if(this._patterns[patternId] == undefined)
		this._patterns[patternId] = objs;
};

/**
 * @param {String} id
 */
ScrollerObjectGenerator.prototype.removePattern = function(patternId)
{
	delete this._patterns[patternId];
};

/**
 * @param {String} id
 */
ScrollerObjectGenerator.prototype.getPattern = function(patternId)
{
	return this._patterns[patternId];
};

/**
 * @param {String} patternId
 */
ScrollerObjectGenerator.prototype.addPredefinedPattern = function(patternId)
{
	if(this._patterns[patternId] != undefined)
		this._predefinedPatterns.push(patternId);
};


/**
 * @param {!Number} min
 * @param {!Number} max
 * @param {!Boolean} set
 */
ScrollerObjectGenerator.prototype.setFrequencies = function(min, max, set)
{
	this._minFrequency = min;
	this._maxFrequency = max;

	if(set == undefined)
		set = true;

	if(set)
		this.setRandomFrequency();
};

/**
 */
ScrollerObjectGenerator.prototype.setRandomFrequency = function()
{
	this._countTarget = Math.round(this._minFrequency + (Math.random() * (this._maxFrequency - this._minFrequency)) );
	this._currentCount = 0;
}

/**
 */
ScrollerObjectGenerator.prototype.setSpecificFrequency = function(freq)
{
	this._countTarget = freq;
};

/**
 */
ScrollerObjectGenerator.prototype.generate = function()
{
	var patterns = [];

	for(var i in this._patterns)
	{
		patterns.push(i);
	}

	var chosenPattern = null;

	if(patterns.length == 0)
	{
		console.log('No pattern set!');
		return;
	}
	else
	{
		if(this._predefinedPatterns.length > 0)
		{
			chosenPattern = this._patterns[this._predefinedPatterns[0]];
			this._predefinedPatterns.splice(0, 1);
		}
		else
		{
			chosenPattern = this._patterns[patterns[Math.floor(Math.random() * patterns.length)]];
		}
	}

	var returnArray = [];

	for(var i = 0; i < chosenPattern.length; i++)
	{
		var pool = this._pools[chosenPattern[i].poolId];
		var obj = pool.create();

		if(obj == null)
		{
			pool.expand(2);
			obj = pool.create();
		}
		obj.signals.disposed.add(this.onObjectDisposed, this);
		returnArray.push({obj:obj, offset:{x:chosenPattern[i].x, y:chosenPattern[i].y}});
	}

	this.signals.generateObjects.dispatch(returnArray);
};


//===================================================
// PRIVATE METHODS
//===================================================


//===================================================
// EVENTS
//===================================================

ScrollerObjectGenerator.prototype.onObjectDisposed = function(obj)
{
    obj.signals.disposed.remove(this.onObjectDisposed, this);
    this.signals.objectDisposed.dispatch(obj);

    for(var i in this._pools)
    {
    	if(this._pools[i]._used.indexOf(obj) > -1)
    	{	
    		this._pools[i].free(obj);
    	}
	}
};

//===================================================
// GETTERS/SETTERS
//===================================================


//===================================================


},{"../Common":2,"./ScrollerObject":27}],29:[function(require,module,exports){
var Common          = require("../Common");
var ScrollerObject	= require("./ScrollerObject");

//===================================================
// CONSTRUCTOR
//===================================================

/**
 * @constructor
 * @param {!String} type
 * @param {!Boolean} removeIfOutsideBoundary
 * @param {!PIXI.Texture} texture
 * @param {PIXI.Point=} anchor
 */
function ScrollerObjectImage(type, removeIfOutsideBoundary, texture, anchor)
{
	this._texture = texture;
	this._anchor = anchor || new PIXI.Point(0, 0);
	this._image = null;

	ScrollerObject.call(this, type, removeIfOutsideBoundary);

	this.create();
	this.init();
}
module.exports = ScrollerObjectImage;
ScrollerObjectImage.prototype = Object.create(ScrollerObject.prototype);
ScrollerObjectImage.prototype.constructor = ScrollerObjectImage;


//===================================================
// PUBLIC METHODS
//===================================================

/**
 */
ScrollerObjectImage.prototype.create = function()
{
	this._image = new PIXI.Sprite(this._texture);
	this._image.anchor = this._anchor;
	this.addChild(this._image);
};



/**
 */
ScrollerObjectImage.prototype.init = function()
{
	
};

/**
 */
ScrollerObjectImage.prototype.reset = function()
{
	ScrollerObject.prototype.reset.call(this);
};


//===================================================
// PRIVATE METHODS
//===================================================


//===================================================
// EVENTS
//===================================================


//===================================================
// GETTERS/SETTERS
//===================================================


//===================================================


},{"../Common":2,"./ScrollerObject":27}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiLi4vQXBwbGljYXRpb24uanMiLCIuLi9Db21tb24uanMiLCIuLi9NYWluLmpzIiwiLi4vU2F2ZWREYXRhLmpzIiwiLi4vZ2FtZS9BdmF0YXIuanMiLCIuLi9nYW1lL0JhY2tncm91bmRGbG9hdGVyLmpzIiwiLi4vZ2FtZS9CYWNrZ3JvdW5kSW1hZ2UuanMiLCIuLi9nYW1lL0NvbGxlY3RpYmxlLmpzIiwiLi4vZ2FtZS9Gb3JlZ3JvdW5kU2hhZG93LmpzIiwiLi4vZ2FtZS9PYnN0YWNsZS5qcyIsIi4uL2dhbWUvU2NvcmVCb3guanMiLCIuLi9nYW1lL1RyYWlsUmVuZGVyZXIuanMiLCIuLi9nZW5lcmFsL0VtaXR0ZXIuanMiLCIuLi9nZW5lcmFsL1NvdW5kU0ZYLmpzIiwiLi4vbGliL1NjZW5lLmpzIiwiLi4vbGliL1NjZW5lTWFuYWdlci5qcyIsIi4uL2xpYi9UcmFuc2l0aW9uLmpzIiwiLi4vb3ZlcmxheXMvUGF1c2VPdmVybGF5LmpzIiwiLi4vc2NyZWVucy9HYW1lT3ZlclNjcmVlbi5qcyIsIi4uL3NjcmVlbnMvR2FtZVNjcmVlbi5qcyIsIi4uL3NjcmVlbnMvSW50cm9TY3JlZW4uanMiLCIuLi9zY3JlZW5zL1ByZWxvYWRlci5qcyIsIi4uL3NjcmVlbnMvU2ltcGxlU2NyZWVuLmpzIiwiLi4vc2NyZWVucy9TcGxhc2hTY3JlZW4uanMiLCIuLi9zY3JvbGxlci9TY3JvbGxlckVuZ2luZS5qcyIsIi4uL3Njcm9sbGVyL1Njcm9sbGVyTG9vcGluZ1JhbmdlLmpzIiwiLi4vc2Nyb2xsZXIvU2Nyb2xsZXJPYmplY3QuanMiLCIuLi9zY3JvbGxlci9TY3JvbGxlck9iamVjdEdlbmVyYXRvci5qcyIsIi4uL3Njcm9sbGVyL1Njcm9sbGVyT2JqZWN0SW1hZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzMkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxudmFyIENvbW1vbiAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoXCIuL0NvbW1vblwiKTtcbnZhciBHYW1lU2NyZWVuICAgICAgICAgICAgICAgICAgPSByZXF1aXJlKFwiLi9zY3JlZW5zL0dhbWVTY3JlZW5cIik7XG52YXIgU3BsYXNoU2NyZWVuICAgICAgICAgICAgICAgID0gcmVxdWlyZShcIi4vc2NyZWVucy9TcGxhc2hTY3JlZW5cIik7XG52YXIgSW50cm9TY3JlZW4gICAgICAgICAgICAgICAgID0gcmVxdWlyZShcIi4vc2NyZWVucy9JbnRyb1NjcmVlblwiKTtcbnZhciBHYW1lT3ZlclNjcmVlbiAgICAgICAgICAgICAgPSByZXF1aXJlKFwiLi9zY3JlZW5zL0dhbWVPdmVyU2NyZWVuXCIpO1xudmFyIFBhdXNlT3ZlcmxheSAgICAgICAgICAgICAgICA9IHJlcXVpcmUoXCIuL292ZXJsYXlzL1BhdXNlT3ZlcmxheVwiKTtcbnZhciBUcmFuc2l0aW9uICAgICAgICAgICAgICAgICAgPSByZXF1aXJlKFwiLi9saWIvVHJhbnNpdGlvblwiKTtcbnZhciBTYXZlZERhdGEgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlKFwiLi9TYXZlZERhdGFcIik7XG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBDT05TVFJVQ1RPUlxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gQXBwbGljYXRpb24oKSB7XG4gICAgLyoqXG4gICAgICogQHR5cGUge0Fzc2V0TWFuYWdlcn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2Fzc2V0TWFuYWdlciA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7U2NyZWVuTWFuYWdlcn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX3NjcmVlbk1hbmFnZXIgPSBudWxsO1xuXG59XG5tb2R1bGUuZXhwb3J0cyA9IEFwcGxpY2F0aW9uO1xuXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gUFVCTElDIE1FVEhPRFNcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coXCJBUFBMSUNBVElPTiBJTklUSUFMSVpFRFwiKTtcblxuICAgIHRoaXMuX2Fzc2V0TWFuYWdlciA9IHAzLkFzc2V0TWFuYWdlci5pbnN0YW5jZTtcbiAgICB0aGlzLl9zY3JlZW5NYW5hZ2VyID0gQ29tbW9uLnNjZW5lTWFuYWdlcjtcblxuICAgIFR3ZWVuTWF4LmRlZmF1bHRPdmVyd3JpdGUgPSBcIm5vbmVcIjtcblxuICAgIGZvcih2YXIgaSBpbiBDb21tb24uY29sb3VycylcbiAgICB7XG4gICAgICAgIHZhciBnciA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gICAgICAgIGdyLmJlZ2luRmlsbChDb21tb24uY29sb3Vyc1tpXSk7XG4gICAgICAgIGdyLmRyYXdSZWN0KDAsIDAsIDEsIDEpO1xuICAgICAgICBDb21tb24uZ2VuZXJhdGVkVGV4dHVyZXNbaSArICdTcXVhcmUnXSA9IGdyLmdlbmVyYXRlVGV4dHVyZShDb21tb24ucmVuZGVyZXIsIDEuMCwgUElYSS5TQ0FMRV9NT0RFUy5MSU5FQVIpO1xuICAgIH1cblxuICAgIENvbW1vbi5zYXZlZERhdGEgPSBuZXcgU2F2ZWREYXRhKCk7XG4gICAgQ29tbW9uLnNhdmVkRGF0YS5pbml0KCk7XG5cbiAgICB0aGlzLnNob3dTcGxhc2goKTtcbn07XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5zaG93U3BsYXNoID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgc2NyZWVuID0gbmV3IFNwbGFzaFNjcmVlbigpO1xuICAgIHRoaXMuX3NjcmVlbk1hbmFnZXIuYWRkKHNjcmVlbiwgdGhpcy5fZ2V0VHJhbnNpdGlvbigpKTtcblxuICAgIHNjcmVlbi5zaWduYWxzLnJlcXVlc3RlZFByZXZpb3VzU2NyZWVuLmFkZE9uY2UoZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgfSwgdGhpcyk7XG4gICAgc2NyZWVuLnNpZ25hbHMucmVxdWVzdGVkTmV4dFNjcmVlbi5hZGRPbmNlKGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuc2hvd0ludHJvKCk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0aGlzLl9jdXJyZW50U2NyZWVuID0gc2NyZWVuO1xuXG4gICAgcmV0dXJuIHNjcmVlbjtcbn07XG5cbkFwcGxpY2F0aW9uLnByb3RvdHlwZS5zaG93SW50cm8gPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBzY3JlZW4gPSBuZXcgSW50cm9TY3JlZW4oKTtcbiAgICB0aGlzLl9zY3JlZW5NYW5hZ2VyLmFkZChzY3JlZW4sIHRoaXMuX2dldFRyYW5zaXRpb24oKSk7XG5cbiAgICBzY3JlZW4uc2lnbmFscy5yZXF1ZXN0ZWRQcmV2aW91c1NjcmVlbi5hZGRPbmNlKGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgIH0sIHRoaXMpO1xuICAgIHNjcmVlbi5zaWduYWxzLnJlcXVlc3RlZE5leHRTY3JlZW4uYWRkT25jZShmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnNob3dHYW1lKHRydWUpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdGhpcy5fY3VycmVudFNjcmVlbiA9IHNjcmVlbjtcblxuICAgIHJldHVybiBzY3JlZW47XG59O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuc2hvd0dhbWUgPSBmdW5jdGlvbihzaG93UGF1c2UpIHtcblxuICAgIHZhciBzY3JlZW4gPSBuZXcgR2FtZVNjcmVlbigpO1xuICAgIHRoaXMuX3NjcmVlbk1hbmFnZXIuYWRkKHNjcmVlbiwgdGhpcy5fZ2V0VHJhbnNpdGlvbigpKTtcblxuICAgIHNjcmVlbi5zaWduYWxzLnJlcXVlc3RlZFByZXZpb3VzU2NyZWVuLmFkZE9uY2UoZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgfSwgdGhpcyk7XG4gICAgc2NyZWVuLnNpZ25hbHMucmVxdWVzdGVkTmV4dFNjcmVlbi5hZGRPbmNlKGZ1bmN0aW9uKGRpc3RhbmNlLCBoZWFydHMpe1xuICAgICAgICB0aGlzLnNob3dHYW1lT3ZlcihkaXN0YW5jZSwgaGVhcnRzKTtcbiAgICB9LCB0aGlzKTtcbiAgICBzY3JlZW4uc2lnbmFscy5yZXF1ZXN0ZWRQYXVzZU92ZXJsYXkuYWRkKGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuc2hvd1BhdXNlKCk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0aGlzLl9jdXJyZW50U2NyZWVuID0gc2NyZWVuO1xuXG4gICAgaWYoc2hvd1BhdXNlICYmICFDb21tb24uc2F2ZWREYXRhLmhhc1ZpZXdlZEluc3RydWN0aW9ucylcbiAgICB7XG4gICAgICAgIENvbW1vbi5hbmltYXRvci5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLnNob3dQYXVzZSh0cnVlKTtcbiAgICAgICAgICAgIENvbW1vbi5zYXZlZERhdGEuaGFzVmlld2VkSW5zdHJ1Y3Rpb25zID0gdHJ1ZTtcbiAgICAgICAgICAgIENvbW1vbi5zYXZlZERhdGEuc2F2ZSgpO1xuICAgICAgICB9LCAwLjEsIHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiBzY3JlZW47XG59O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuc2hvd1BhdXNlID0gZnVuY3Rpb24oc2hvd0hlbHApXG57XG4gICAgdmFyIHQgPSBuZXcgVHJhbnNpdGlvbigpO1xuICAgIHQucmVwbGFjZSA9IGZhbHNlO1xuICAgIHQucHVzaCA9IHRydWU7XG5cbiAgICB0aGlzLl9jdXJyZW50U2NyZWVuLmhpZGVHVUkoKTtcbiAgICB0aGlzLl9jdXJyZW50U2NyZWVuLnBhdXNlKCk7XG4gICAgdmFyIHNjcmVlbiA9IG5ldyBQYXVzZU92ZXJsYXkoKTtcbiAgICB0aGlzLl9zY3JlZW5NYW5hZ2VyLmFkZChzY3JlZW4sIHQpO1xuXG4gICAgc2NyZWVuLnNpZ25hbHMucmVxdWVzdGVkTmV4dFNjcmVlbi5hZGRPbmNlKGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgdGhpcy5fc2NyZWVuTWFuYWdlci5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5fY3VycmVudFNjcmVlbi5zaG93R1VJKCk7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY3JlZW4ucmVzdW1lKCk7XG4gICAgfSwgdGhpcyk7XG4gICAgc2NyZWVuLnNpZ25hbHMucmVxdWVzdGVkUHJldmlvdXNTY3JlZW4uYWRkT25jZShmdW5jdGlvbihpZCl7XG4gICAgICAgIHRoaXMuc2hvd1NwbGFzaCgpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgaWYoc2hvd0hlbHApXG4gICAgICAgIHAzLlRpbWVzdGVwLnF1ZXVlQ2FsbChzY3JlZW4uc2V0SW50cm9IZWxwTW9kZSwgW10sIHNjcmVlbik7XG59O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUuc2hvd0dhbWVPdmVyID0gZnVuY3Rpb24oZGlzdGFuY2UsIGhlYXJ0cykge1xuXG4gICAgdmFyIHNjcmVlbiA9IG5ldyBHYW1lT3ZlclNjcmVlbihkaXN0YW5jZSwgaGVhcnRzKTtcbiAgICB0aGlzLl9zY3JlZW5NYW5hZ2VyLmFkZChzY3JlZW4sIHRoaXMuX2dldFRyYW5zaXRpb24oKSk7XG5cbiAgICBzY3JlZW4uc2lnbmFscy5yZXF1ZXN0ZWRQcmV2aW91c1NjcmVlbi5hZGRPbmNlKGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuc2hvd1NwbGFzaCgpO1xuICAgIH0sIHRoaXMpO1xuICAgIHNjcmVlbi5zaWduYWxzLnJlcXVlc3RlZE5leHRTY3JlZW4uYWRkT25jZShmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnNob3dHYW1lKCk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0aGlzLl9jdXJyZW50U2NyZWVuID0gc2NyZWVuO1xuXG4gICAgcmV0dXJuIHNjcmVlbjsgICAgXG59O1xuXG5BcHBsaWNhdGlvbi5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbigpXG57XG4gICAgaWYodGhpcy5fY3VycmVudFNjcmVlbi5wYXVzZSAhPSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY3JlZW4ucGF1c2UoKTtcbn1cblxuQXBwbGljYXRpb24ucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uKClcbntcbiAgICBpZih0aGlzLl9jdXJyZW50U2NyZWVuLnJlc3VtZSAhPSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY3JlZW4ucmVzdW1lKCk7XG59XG5cblxuXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gUFJJVkFURSBNRVRIT0RTXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqL1xuQXBwbGljYXRpb24ucHJvdG90eXBlLl9nZXRUcmFuc2l0aW9uID0gZnVuY3Rpb24oKVxue1xuICAgIHZhciB0cmFuc2l0aW9uID0gbmV3IFRyYW5zaXRpb24oKTtcbiAgICB0cmFuc2l0aW9uLnJlcGxhY2UgPSB0cnVlO1xuICAgIHRyYW5zaXRpb24ucHVzaCA9IGZhbHNlO1xuICAgIHJldHVybiB0cmFuc2l0aW9uO1xufVxuXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRVZFTlRTXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gR0VUVEVSUy9TRVRURVJTXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4iLCIvKipcbiAqICBDb21tb25cbiAqXG4gKiAgQ3JlYXRlZCBieSBMZWdtYW4gb24gMzAvMDQvMjAxNS5cbiAqXG4gKi9cblxuXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQ09OU1RSVUNUT1Jcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIENvbW1vbigpIHt9XG5tb2R1bGUuZXhwb3J0cyA9IENvbW1vbjtcblxuXG4vKiAtLS0tLS1HRU5FUklDLS0tLS0tICovXG5cbi8qKlxuICogQHR5cGUge051bWJlcn1cbiAqIEBjb25zdFxuICovXG5Db21tb24uU1RBR0VfV0lEVEggPSAxOTAwLjA7XG5cbi8qKlxuICogQHR5cGUge051bWJlcn1cbiAqIEBjb25zdFxuICovXG5Db21tb24uU1RBR0VfSEVJR0hUID0gNzY4LjA7XG5cbi8qKlxuICogQHR5cGUge1BJWEkuQ29udGFpbmVyfVxuICogQHN0YXRpY1xuICovXG5Db21tb24uc3RhZ2UgPSBudWxsO1xuXG4vKipcbiAqIEB0eXBlIHtQSVhJLkNhbnZhc1JlbmRlcmVyfFBJWEkuV2ViR0xSZW5kZXJlcn1cbiAqIEBzdGF0aWNcbiAqL1xuQ29tbW9uLnJlbmRlcmVyID0gbnVsbDtcblxuLyoqXG4gKiBAdHlwZSB7cDMuVGltZXN0ZXB9XG4gKiBAc3RhdGljXG4gKi9cbkNvbW1vbi50aW1lc3RlcCA9IG51bGw7XG5cbi8qKlxuICogQHR5cGUge3AzLkFuaW1hdG9yfVxuICogQHN0YXRpY1xuICovXG5Db21tb24uYW5pbWF0b3IgPSBudWxsO1xuXG4vKipcbiAqIEB0eXBlIHtQSVhJLlBvaW50fVxuICogQHN0YXRpY1xuICovXG5Db21tb24udG91Y2ggPSBuZXcgUElYSS5Qb2ludCgwLjAsIDAuMCk7XG5cbi8qKlxuICogQHR5cGUge051bWJlcn1cbiAqIEBzdGF0aWNcbiAqL1xuQ29tbW9uLnBhdXNlZCA9IGZhbHNlO1xuXG4vKipcbiAqIEB0eXBlIHtCb29sZWFufVxuICogQHN0YXRpY1xuICovXG5Db21tb24uaXNXZWJHTCA9IGZhbHNlO1xuXG4vKipcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAY29uc3RcbiAqL1xuQ29tbW9uLkRFQlVHX1BBSU5UX01PREUgPSAwO1xuXG4vKipcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAc3RhdGljXG4gKi9cbkNvbW1vbi5mcmFtZUNvdW50ID0gMDtcblxuLyoqXG4gKiBAdHlwZSB7TnVtYmVyfVxuICogQGNvbnN0XG4gKi9cbkNvbW1vbi5GUFMgPSA2MDtcblxuLyoqXG4gKiBAdHlwZSB7U2F2ZWREYXRhfVxuICogQHN0YXRpY1xuICovXG5Db21tb24uc2NlbmVNYW5hZ2VyID0gbnVsbDtcblxuQ29tbW9uLmdlbmVyYXRlZFRleHR1cmVzID0ge307XG5cbkNvbW1vbi5jb2xvdXJzID0ge2JsYWNrOjB4MDAwMDAwLCBibG9zc29tOjB4ZjVhNmJlLCBidWJibGVzOjB4NGZjOWU4LCBidXR0ZXJjdXA6MHhhN2Q0OWIsIHNreTA6MHg5YmYyZDcsIHNreTE6MHg3N0RDRjIsIHNreTI6MHhGQ0M2OEIsIHNreTM6MHhENUE0RUQsIHNreTQ6MHhGQUZBNkJ9O1xuXG5Db21tb24uQ09VTlRSWV9DT0RFID0gJ2VuJztcblxuQ29tbW9uLnNhdmVkRGF0YSA9IG51bGw7XG5cblxuXG5cblxuXG5cblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuIiwiLyoqXHJcbiAqICBNYWluXHJcbiAqXHJcbiAqICBDcmVhdGVkIGJ5IExlZ21hbiBvbiAyNy8wNC8yMDE1LlxyXG4gKlxyXG4gKi9cclxuXHJcbnZhciBBcHBsaWNhdGlvbiAgICAgPSByZXF1aXJlKFwiLi9BcHBsaWNhdGlvblwiKTtcclxuXHJcbnZhciBDb21tb24gICAgICAgICAgPSByZXF1aXJlKFwiLi9Db21tb25cIik7XHJcbnZhciBQcmVsb2FkZXIgICAgICAgPSByZXF1aXJlKFwiLi9zY3JlZW5zL1ByZWxvYWRlclwiKTtcclxudmFyIFNjZW5lTWFuYWdlciAgICA9IHJlcXVpcmUoXCIuL2xpYi9TY2VuZU1hbmFnZXJcIik7XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBDT05TVFJVQ1RPUlxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7IU51bWJlcn0gd2lkdGhcclxuICogQHBhcmFtIHshTnVtYmVyfSBoZWlnaHRcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBNYWluKHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyFOdW1iZXJ9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICB0aGlzLl93aWR0aCA9IHdpZHRoO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgeyFOdW1iZXJ9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEB0eXBlIHtwMy5Bc3NldE1hbmFnZXJ9XHJcblx0ICogQHByaXZhdGVcclxuXHQgKi9cclxuXHR0aGlzLl9hc3NldE1hbmFnZXIgPSBudWxsO1xyXG5cclxuXHQvKipcclxuXHQgKiBAdHlwZSB7cDMuU2NyZWVuTWFuYWdlcn1cclxuXHQgKiBAcHJpdmF0ZVxyXG5cdCAqL1xyXG5cdHRoaXMuX3NjcmVlbk1hbmFnZXIgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge1ByZWxvYWRlcn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX3ByZWxvYWRlciA9IG51bGw7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEB0eXBlIHtBcHBsaWNhdGlvbn1cclxuXHQgKiBAcHJpdmF0ZVxyXG5cdCAqL1xyXG5cdHRoaXMuX2dhbWUgPSBudWxsO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9yZXNvbHV0aW9uID0gMS4wO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge1N0cmluZ31cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX3NjYWxlID0gXCJoZC9cIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHtTdHJpbmd9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9yZW5kZXJGUFMgPSA2MC4wO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUge1N0cmluZ31cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX2ZyYW1lQ291bnQgPSAwO1xyXG5cclxuICAgIHRoaXMuX3NjcmVlbkluY29ycmVjdFJvdGF0aW9uID0gZmFsc2U7XHJcblxyXG59XHJcbndpbmRvdy5NYWluID0gTWFpbjtcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFBVQkxJQyBNRVRIT0RTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICovXHJcbk1haW4ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICBcdHRoaXMuX2Fzc2V0TWFuYWdlciA9IHAzLkFzc2V0TWFuYWdlci5pbnN0YW5jZTtcclxuXHR0aGlzLl9zY3JlZW5NYW5hZ2VyID0gbmV3IFNjZW5lTWFuYWdlcigpO1xyXG5cclxuICAgIENvbW1vbi5DT1VOVFJZX0NPREUgPSB3aW5kb3cub2cubGFuZ3VhZ2U7XHJcblxyXG4gICAgdmFyIGVsZW1lbnRJZCA9IFwib2ctZ2FtZS1ob2xkZXJcIjtcclxuICAgIHZhciBwYXJhbXMgPSBuZXcgcDMuVmlld1BhcmFtcygpO1xyXG4gICAgcGFyYW1zLndpZHRoID0gdGhpcy5fd2lkdGg7XHJcbiAgICBwYXJhbXMuaGVpZ2h0ID0gdGhpcy5faGVpZ2h0O1xyXG4gICAgcGFyYW1zLmhvbGRlcklEID0gZWxlbWVudElkO1xyXG4gICAgcGFyYW1zLnJvdGF0ZUltYWdlVXJsID0gXCJhc3NldHMvaW1hZ2VzL3N5c3RlbS9cIiArIENvbW1vbi5DT1VOVFJZX0NPREUgKyBcIi9yb3RhdGVfZGV2aWNlLmpwZ1wiO1xyXG4gICAgcGFyYW1zLnJvdGF0ZUltYWdlQ29sb3IgPSBcIiNmNWMxZDNcIjtcclxuXHJcbiAgICBQSVhJLlJFVElOQV9QUkVGSVggPSAvXFxfKD89W15fXSokKSguKyl4LztcclxuXHJcbiAgICBwMy5UcmFja2luZy5ERUJVRyA9IHRydWU7XHJcbiAgICBDb21tb24udHJhY2tpbmcgPSBuZXcgcDMuVHJhY2tpbmcoKTtcclxuICAgIENvbW1vbi50cmFja2luZy5pbml0KG5ldyBwMy5UcmFja2luZ01vZHVsZUVjaG8od2luZG93LnN0YXRzKSk7XHJcblxyXG4gICAgcDMuRGV2aWNlLmluaXQod2luZG93W1wiYm93c2VyXCJdKTtcclxuXHJcbiAgICBUd2Vlbk1heC5kZWZhdWx0T3ZlcndyaXRlID0gXCJub25lXCI7XHJcbiAgICBUd2Vlbk1heC50aWNrZXIuZnBzKENvbW1vbi5GUFMpO1xyXG5cclxuICAgIHZhciBjYW52YXMgPSBuZXcgcDMuVmlldyhwYXJhbXMpO1xyXG4gICAgY2FudmFzLnNpZ25hbHMucmVhZHkuYWRkT25jZShmdW5jdGlvbihjYW52YXMpIHtcclxuXHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7fTtcclxuICAgICAgICBvcHRpb25zLnZpZXcgPSBjYW52YXM7XHJcbiAgICAgICAgb3B0aW9ucy50cmFuc3BhcmVudCA9IGZhbHNlO1xyXG4gICAgICAgIG9wdGlvbnMuYW50aWFsaWFzID0gZmFsc2U7XHJcbiAgICAgICAgb3B0aW9ucy5wcmVzZXJ2ZURyYXdpbmdCdWZmZXIgPSBmYWxzZTtcclxuICAgICAgICBvcHRpb25zLnJlc29sdXRpb24gPSB0aGlzLl9yZXNvbHV0aW9uO1xyXG4gICAgICAgIHRoaXMuX2Fzc2V0TWFuYWdlci5zY2FsZUZhY3RvciA9IHRoaXMuX3Jlc29sdXRpb247XHJcblxyXG4gICAgICAgIHZhciBzdGFnZSA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG4gICAgICAgIENvbW1vbi5zdGFnZSA9IHN0YWdlO1xyXG5cclxuICAgICAgICB2YXIgcmVuZGVyZXIgPSBQSVhJLmF1dG9EZXRlY3RSZW5kZXJlcih0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0LCBvcHRpb25zKTtcclxuICAgICAgICBDb21tb24ucmVuZGVyZXIgPSByZW5kZXJlcjtcclxuICAgICAgICAvL1BJWEkuc2NhbGVNb2Rlcy5ERUZBVUxUID0gUElYSS5zY2FsZU1vZGVzLk5FQVJFU1Q7XHJcblxyXG4gICAgICAgIHRoaXMuX3NjcmVlbk1hbmFnZXIuaW5pdChzdGFnZSwgcmVuZGVyZXIpO1xyXG4gICAgICAgIENvbW1vbi5zY2VuZU1hbmFnZXIgPSB0aGlzLl9zY3JlZW5NYW5hZ2VyO1xyXG5cclxuICAgICAgICBDb21tb24uaXNXZWJHTCA9IChyZW5kZXJlciBpbnN0YW5jZW9mIFBJWEkuV2ViR0xSZW5kZXJlcik7XHJcbiAgICAgICAgQ29tbW9uLkRFQlVHX1BBSU5UX01PREUgPSBwMy5VdGlscy5nZXRVUkxQYXJhbWV0ZXIoXCJwYWludFwiLCAwKTtcclxuXHJcbiAgICAgICAgdmFyIHRpbWVzdGVwID0gbmV3IHAzLlRpbWVzdGVwKCk7XHJcbiAgICAgICAgdGltZXN0ZXAuaW5pdCh0aGlzLnVwZGF0ZSwgdGhpcy5yZW5kZXIsIHRoaXMpO1xyXG4gICAgICAgIENvbW1vbi50aW1lc3RlcCA9IHRpbWVzdGVwO1xyXG5cclxuICAgICAgICBDb21tb24uYW5pbWF0b3IgPSBuZXcgcDMuQW5pbWF0b3IoKTtcclxuICAgICAgICBDb21tb24uYW5pbWF0b3IuaW5pdCgpO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRQcmVsb2FkZXIoKTtcclxuXHJcbiAgICB9LCB0aGlzKTtcclxuICAgIGNhbnZhcy5zaWduYWxzLnJlc2l6ZS5hZGQodGhpcy5vbkNhbnZhc1Jlc2l6ZSwgdGhpcyk7XHJcblxyXG4gICAgdmFyIGhpZGRlbjtcclxuICAgIFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIGRvY3VtZW50LmhpZGRlbiA/IChoaWRkZW4gPSBcImhpZGRlblwiLFxyXG4gICAgICAgIHRoaXMudmlzaWJpbGl0eUNoYW5nZSA9IFwidmlzaWJpbGl0eWNoYW5nZVwiKSA6IFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIGRvY3VtZW50Lm1vekhpZGRlbiA/IChoaWRkZW4gPSBcIm1vekhpZGRlblwiLFxyXG4gICAgICAgIHRoaXMudmlzaWJpbGl0eUNoYW5nZSA9IFwibW96dmlzaWJpbGl0eWNoYW5nZVwiKSA6IFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIGRvY3VtZW50Lm1zSGlkZGVuID8gKGhpZGRlbiA9IFwibXNIaWRkZW5cIixcclxuICAgICAgICB0aGlzLnZpc2liaWxpdHlDaGFuZ2UgPSBcIm1zdmlzaWJpbGl0eWNoYW5nZVwiKSA6IFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIGRvY3VtZW50LndlYmtpdEhpZGRlbiAmJiAoaGlkZGVuID0gXCJ3ZWJraXRIaWRkZW5cIixcclxuICAgICAgICB0aGlzLnZpc2liaWxpdHlDaGFuZ2UgPSBcIndlYmtpdHZpc2liaWxpdHljaGFuZ2VcIik7XHJcblxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLnZpc2liaWxpdHlDaGFuZ2UsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgZG9jdW1lbnRbaGlkZGVuXSA/IEhvd2xlci52b2x1bWUoMCkgOiBIb3dsZXIudm9sdW1lKDEpO1xyXG4gICAgfSwgZmFsc2UpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5NYWluLnByb3RvdHlwZS5sb2FkUHJlbG9hZGVyID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICBzY2FsZSA9IHRoaXMuX3NjYWxlO1xyXG4gICAgdmFyIHByZWZpeCA9IChzY2FsZSA9PT0gXCJzZC9cIiA/IFwiXzAuNXhcIiA6IFwiXCIpO1xyXG4gICAgdmFyIGZpbGVzID0gW1xyXG4gICAgICAgIHtuYW1lOlwicHJlbG9hZGVyX2JnXCIsIHVybDpcImltYWdlcy9cIiArIHNjYWxlICsgXCJwcmVsb2FkZXJcIiArIHByZWZpeCArIFwiLmpwZ1wifSxcclxuICAgICAgICB7bmFtZTpcInByZWxvYWRlclwiLCB1cmw6XCJpbWFnZXMvXCIgKyBzY2FsZSArIFwicHJlbG9hZGVyXCIgKyBwcmVmaXggKyBcIi5qc29uXCJ9XHJcbiAgICBdO1xyXG4gICAgdmFyIHNvdW5kcyA9IFtcclxuICAgIF07XHJcbiAgICBpZiAoZmlsZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5fYXNzZXRNYW5hZ2VyLmFkZEZpbGVzKGZpbGVzLCB3aW5kb3cub2cuZ2FtZURpciArIFwiYXNzZXRzL1wiKTtcclxuICAgICAgICB0aGlzLl9hc3NldE1hbmFnZXIuc2lnbmFsQ29tcGxldGVkLmFkZE9uY2UoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZEFzc2V0cygpO1xyXG4gICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX2Fzc2V0TWFuYWdlci5sb2FkKCk7XHJcblxyXG4gICAgICAgIHAzLkF1ZGlvTWFuYWdlci5pbnN0YW5jZS5hZGRTb3VuZHMoc291bmRzLCBbXCIubXAzXCIsIFwiLm9nZ1wiXSwgXCJcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMubG9hZEFzc2V0cygpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5NYWluLnByb3RvdHlwZS5sb2FkQXNzZXRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2NhbGUgPSB0aGlzLl9zY2FsZTtcclxuICAgIHZhciBwcmVmaXggPSAoc2NhbGUgPT09IFwic2QvXCIgPyBcIl8wLjV4XCIgOiBcIlwiKTtcclxuICAgIHZhciBmaWxlcyA9IFtcclxuICAgICAgICB7bmFtZTpcImNvbmZpZ1wiLCB1cmw6XCJkYXRhL2NvbmZpZy5qc29uXCJ9LFxyXG4gICAgICAgIHtuYW1lOlwib2JzdGFjbGVfZGF0YVwiLCB1cmw6XCJkYXRhL29ic3RhY2xlX2RhdGEuanNvblwifSxcclxuICAgICAgICBcclxuICAgICAgICB7bmFtZTpcInBhcnRpY2xlc190cmFpbFwiLCB1cmw6XCJwYXJ0aWNsZXMvdHJhaWwuanNvblwifSxcclxuICAgICAgICB7bmFtZTpcInBhcnRpY2xlc19jb2xsaXNpb25cIiwgdXJsOlwicGFydGljbGVzL2NvbGxpc2lvbi5qc29uXCJ9LFxyXG4gICAgICAgIHtuYW1lOlwicGFydGljbGVzX2dsb3dcIiwgdXJsOlwicGFydGljbGVzL2dsb3cuanNvblwifSxcclxuICAgICAgICB7bmFtZTpcInBhcnRpY2xlc19waWNrdXBcIiwgdXJsOlwicGFydGljbGVzL3BpY2t1cHMuanNvblwifSxcclxuXHJcbiAgICAgICAge25hbWU6XCJnYW1lX2Fzc2V0c1wiLCB1cmw6XCJpbWFnZXMvXCIgKyBzY2FsZSArIFwiZ2FtZV9hc3NldHNcIiArIHByZWZpeCArIFwiLmpzb25cIn0sXHJcbiAgICAgICAge25hbWU6XCJpbnRyb1wiLCB1cmw6XCJpbWFnZXMvXCIgKyBzY2FsZSArIFwiaW50cm9cIiArIHByZWZpeCArIFwiLmpzb25cIn0sXHJcbiAgICAgICAge25hbWU6XCJzcGxhc2hcIiwgdXJsOlwiaW1hZ2VzL1wiICsgc2NhbGUgKyBcInNwbGFzaFwiICsgcHJlZml4ICsgXCIuanNvblwifSxcclxuICAgICAgICB7bmFtZTpcInVpXCIsIHVybDpcImltYWdlcy9cIiArIHNjYWxlICsgXCJ1aVwiICsgcHJlZml4ICsgXCIuanNvblwifSxcclxuXHJcbiAgICAgICAge25hbWU6XCJmcjFfYmdcIiwgdXJsOlwiaW1hZ2VzL1wiICsgc2NhbGUgKyBcImZyMV9iZ1wiICsgcHJlZml4ICsgXCIuanBnXCJ9LFxyXG4gICAgICAgIHtuYW1lOlwiZnIzX2JnXCIsIHVybDpcImltYWdlcy9cIiArIHNjYWxlICsgXCJmcjNfYmdcIiArIHByZWZpeCArIFwiLmpwZ1wifSxcclxuICAgICAgICB7bmFtZTpcImJnX2JsdWVcIiwgdXJsOlwiaW1hZ2VzL1wiICsgc2NhbGUgKyBcImJnX2JsdWVcIiArIHByZWZpeCArIFwiLmpwZ1wifSxcclxuICAgICAgICB7bmFtZTpcImJnX3NwbGFzaFwiLCB1cmw6XCJpbWFnZXMvXCIgKyBzY2FsZSArIFwiYmdfc3BsYXNoXCIgKyBwcmVmaXggKyBcIi5qcGdcIn0sXHJcbiAgICAgICAge25hbWU6XCJnYW1lX3RpdGxlXCIsIHVybDpcImltYWdlcy9sYW5ndWFnZS9cIiArIENvbW1vbi5DT1VOVFJZX0NPREUgKyBcIi90cmFpbF9ibGF6ZXIucG5nXCJ9LFxyXG4gICAgICAgIFxyXG4gICAgICAgIHtuYW1lOlwidW5wYWNrNDBfd2hpdGVcIiwgdXJsOlwiZm9udHMvdW5wYWNrNDBfd2hpdGUuanNvblwifSxcclxuICAgICAgICB7bmFtZTpcInVucGFjazUwX2JsYWNrXCIsIHVybDpcImZvbnRzL3VucGFjazUwX2JsYWNrLmpzb25cIn0sXHJcbiAgICAgICAge25hbWU6XCJ1bnBhY2s2MF95ZWxsb3dcIiwgdXJsOlwiZm9udHMvdW5wYWNrNjBfeWVsbG93Lmpzb25cIn0sXHJcbiAgICAgICAge25hbWU6XCJ1bnBhY2s3MF93aGl0ZXRpdGxlXCIsIHVybDpcImZvbnRzL3VucGFjazcwX3doaXRldGl0bGUuanNvblwifSxcclxuICAgICAgICB7bmFtZTpcInVucGFjazkwX3BpbmtcIiwgdXJsOlwiZm9udHMvdW5wYWNrOTBfcGluay5qc29uXCJ9LFxyXG4gICAgICAgIHtuYW1lOlwidW5wYWNrMTAwX2JsdWVcIiwgdXJsOlwiZm9udHMvdW5wYWNrMTAwX2JsdWUuanNvblwifVxyXG4gICAgXTtcclxuICAgIHZhciBzb3VuZHMgPSBbXHJcbiAgICAgICAgXCJtdXNpY19sb29wXCIsXHJcbiAgICAgICAgXCJtdXNpY19wcGdfc3BsYXNoX2dlbmVyaWNcIixcclxuICAgICAgICBcInNmeF9nYW1lX2VuZF8wMFwiLFxyXG4gICAgICAgIFwic2Z4X2hlYXJ0X3BpY2t1cF8wMlwiLFxyXG4gICAgICAgIFwic2Z4X29iamVjdF9kZXN0cm95ZWRfMDBcIixcclxuICAgICAgICBcInNmeF9vYmplY3RfZGVzdHJveWVkXzAxXCIsXHJcbiAgICAgICAgXCJzZnhfcHBnX2dpcmxzX2ZseWF3YXlfMDBcIixcclxuICAgICAgICBcInNmeF9wcGdfaGl0X29ic3RhY2xlXzAwXCIsXHJcbiAgICAgICAgXCJzZnhfcHBnX2hpdF9vYnN0YWNsZV8wMVwiLFxyXG4gICAgICAgIFwic2Z4X3BwZ19sZXZlbF9zdGFydF8wMFwiLFxyXG4gICAgICAgIFwic2Z4X3BwZ19tb3ZlXzAwXCIsXHJcbiAgICAgICAgXCJzZnhfcHBnX21vdmVfMDFcIixcclxuICAgICAgICBcInNmeF9wcGdfbW92ZV8wMlwiLFxyXG4gICAgICAgIFwic2Z4X3BwZ19tb3ZlXzAzXCIsXHJcbiAgICAgICAgXCJzZnhfcHBnX21vdmVfMDRcIixcclxuICAgICAgICBcInNmeF9wcGdfbW92ZV8wNVwiLFxyXG4gICAgICAgIFwic2Z4X3BwZ19tb3ZlXzA2XCIsXHJcbiAgICAgICAgXCJzZnhfdWlfcHJlc3NfYnV0dG9uXzAxXCIsXHJcbiAgICAgICAgXCJzZnhfdWlfcHJlc3NwbGF5XzAwXCJcclxuICAgIF07XHJcbiAgICBpZiAoZmlsZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5fYXNzZXRNYW5hZ2VyLmFkZEZpbGVzKGZpbGVzLCB3aW5kb3cub2cuZ2FtZURpciArIFwiYXNzZXRzL1wiKTtcclxuICAgICAgICB0aGlzLl9hc3NldE1hbmFnZXIuc2lnbmFsUHJvZ3Jlc3MuYWRkKHRoaXMub25Mb2FkaW5nUHJvZ3Jlc3MsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX2Fzc2V0TWFuYWdlci5zaWduYWxDb21wbGV0ZWQuYWRkT25jZSh0aGlzLm9uTG9hZGluZ0NvbXBsZXRlZCwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5fYXNzZXRNYW5hZ2VyLmxvYWQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fcHJlbG9hZGVyID0gbmV3IFByZWxvYWRlcigpO1xyXG4gICAgICAgIHRoaXMuX3NjcmVlbk1hbmFnZXIuYWRkKHRoaXMuX3ByZWxvYWRlcik7XHJcblxyXG4gICAgICAgIHAzLkF1ZGlvTWFuYWdlci5pbnN0YW5jZS5hZGRTb3VuZHMoc291bmRzLCBbXCIubXAzXCIsIFwiLm9nZ1wiXSwgd2luZG93Lm9nLmdhbWVEaXIgKyBcImFzc2V0cy9hdWRpby9cIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc3RhcnRHYW1lKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKipcclxuICovXHJcbk1haW4ucHJvdG90eXBlLnN0YXJ0R2FtZSA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhhdC5fZ2FtZSA9IG5ldyBBcHBsaWNhdGlvbigpO1xyXG4gICAgdGhhdC5fZ2FtZS5pbml0KCk7XHJcbn07XHJcblxyXG4vKipcclxuICovXHJcbk1haW4ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgdGhpcy5fc2NyZWVuTWFuYWdlci51cGRhdGUoKTtcclxuICAgIENvbW1vbi5hbmltYXRvci51cGRhdGUoKTtcclxuXHJcbiAgICBpZiAoQ29tbW9uLkRFQlVHX1BBSU5UX01PREUgPiAwKSB7XHJcbiAgICAgICAgdGhpcy5wYWludEJhZEltYWdlKENvbW1vbi5zdGFnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fZnJhbWVDb3VudCsrO1xyXG4gICAgQ29tbW9uLmZyYW1lQ291bnQgPSB0aGlzLl9mcmFtZUNvdW50O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5NYWluLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIGlmKHRoaXMuX2ZyYW1lQ291bnQgJSAyID09IDAgfHwgdGhpcy5fZnBzID09IDYwLjApXHJcbiAgICAgICAgQ29tbW9uLnJlbmRlcmVyLnJlbmRlcihDb21tb24uc3RhZ2UpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7IVBJWEkuRGlzcGxheU9iamVjdH0gZGlzcGxheVxyXG4gKiBAcGFyYW0ge051bWJlcj19IGNvbG9yXHJcbiAqL1xyXG5NYWluLnByb3RvdHlwZS5wYWludEJhZEltYWdlID0gZnVuY3Rpb24oZGlzcGxheSwgY29sb3IpXHJcbntcclxuICAgIGNvbG9yID0gY29sb3IgfHwgMHhBQTAwRkY7XHJcblxyXG4gICAgdmFyIGNoaWxkO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXNwbGF5LmNoaWxkcmVuLmxlbmd0aDsgKysgaSkge1xyXG4gICAgICAgIGNoaWxkID0gZGlzcGxheS5jaGlsZHJlbltpXTtcclxuICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBQSVhJLlNwcml0ZSkge1xyXG4gICAgICAgICAgICBpZiAoQ29tbW9uLkRFQlVHX1BBSU5UX01PREUgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLnRleHR1cmUud2lkdGggJSAyICE9IDAgfHwgY2hpbGQudGV4dHVyZS5oZWlnaHQgJSAyICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC50aW50ID0gY29sb3I7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnRpbnQgPSAweEZGRkZGRjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoQ29tbW9uLkRFQlVHX1BBSU5UX01PREUgPT0gMikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLnBvc2l0aW9uLnggIT09IHBhcnNlSW50KGNoaWxkLnBvc2l0aW9uLngpIHx8IGNoaWxkLnBvc2l0aW9uLnkgIT09IHBhcnNlSW50KGNoaWxkLnBvc2l0aW9uLnkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQudGludCA9IGNvbG9yO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC50aW50ID0gMHhGRkZGRkY7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wYWludEJhZEltYWdlKGNoaWxkLCBjb2xvcik7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBQUklWQVRFIE1FVEhPRFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBFVkVOVFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKi9cclxuTWFpbi5wcm90b3R5cGUub25Mb2FkaW5nUHJvZ3Jlc3MgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgdGhpcy5fcHJlbG9hZGVyLmxvYWRlZFBlcmNlbnRhZ2UgPSBldmVudC5wcm9ncmVzcztcclxufTtcclxuXHJcbi8qKlxyXG4gKi9cclxuTWFpbi5wcm90b3R5cGUub25Mb2FkaW5nQ29tcGxldGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9wcmVsb2FkZXIubG9hZGVkUGVyY2VudGFnZSA9IDEwMC4wO1xyXG4gICAgdGhpcy5fcHJlbG9hZGVyLmFuaW1hdGVPdXQobnVsbCwgdGhpcyk7XHJcblxyXG4gICAgdGhpcy5fcHJlbG9hZGVyID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLl9hc3NldE1hbmFnZXIuc2lnbmFsUHJvZ3Jlc3MucmVtb3ZlQWxsKCk7XHJcbiAgICB0aGlzLl9hc3NldE1hbmFnZXIuc2lnbmFsQ29tcGxldGVkLnJlbW92ZUFsbCgpO1xyXG5cclxuICAgIHRoaXMuc3RhcnRHYW1lKCk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7IUJvb2xlYW59IGNvcnJlY3RcclxuICovXHJcbk1haW4ucHJvdG90eXBlLm9uQ2FudmFzUmVzaXplID0gZnVuY3Rpb24oY29ycmVjdClcclxue1xyXG4gICAgaWYgKGNvcnJlY3QpIHtcclxuICAgICAgICBDb21tb24ucmVuZGVyZXIucmVzaXplKHAzLlZpZXcud2lkdGgsIHAzLlZpZXcuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3NjcmVlbk1hbmFnZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2NyZWVuTWFuYWdlci5yZXNpemUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5fc2NyZWVuSW5jb3JyZWN0Um90YXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lLnJlc3VtZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JlZW5JbmNvcnJlY3RSb3RhdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgICBpZighdGhpcy5fc2NyZWVuSW5jb3JyZWN0Um90YXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lLnBhdXNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NjcmVlbkluY29ycmVjdFJvdGF0aW9uID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBHRVRURVJTL1NFVFRFUlNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4iLCJcclxudmFyIENvbW1vbiAgICAgICAgICA9IHJlcXVpcmUoXCIuL0NvbW1vblwiKTtcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIENPTlNUUlVDVE9SXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5mdW5jdGlvbiBTYXZlZERhdGEoKVxyXG57XHJcbiAgICB2YXIgYXNzZXRNYW5hZ2VyID0gcDMuQXNzZXRNYW5hZ2VyLmluc3RhbmNlO1xyXG4gICAgdGhpcy5oYXNWaWV3ZWRJbnN0cnVjdGlvbnMgPSBmYWxzZTtcclxuICAgIHRoaXMuaGFzU2VlbkludHJvID0gZmFsc2U7XHJcbiAgICB0aGlzLmJlc3RTY29yZSA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxyXG4gICAgICogQGNvbnN0XHJcbiAgICAgKi9cclxuICAgIHRoaXMuU0FWRV9OQU1FID0gXCJwb3dlcnB1ZmZnaXJsc190cmFpbF9ibGF6ZXJcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHtTdHJpbmd9XHJcbiAgICAgKiBAY29uc3RcclxuICAgICAqL1xyXG4gICAgdGhpcy5TQVZFX1ZFUlNJT04gPSBcIjAuMC4xXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxyXG4gICAgICogQGNvbnN0XHJcbiAgICAgKi9cclxuICAgIHRoaXMuU0FWRV9TRUVEID0gXCJ4NWswRW82UjE3N21Va2JcIjtcclxuXHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBTYXZlZERhdGE7XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBQVUJMSUMgTUVUSE9EU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuU2F2ZWREYXRhLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICBpZiAoIXdpbmRvdy5sb2NhbFN0b3JhZ2VbdGhpcy5TQVZFX05BTUUgKyBcIl9cIiArIHRoaXMuU0FWRV9WRVJTSU9OXSlcclxuICAgIHtcclxuICAgICAgICBjb25zb2xlLmxvZygncmVzZXQnKTtcclxuICAgICAgICB0aGlzLnJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5zYXZlKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2xvYWQnKTsgICAgXHJcbiAgICAgICAgdGhpcy5sb2FkKCk7XHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuU2F2ZWREYXRhLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgXHJcbn07XHJcblxyXG5cclxuU2F2ZWREYXRhLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB2YXIgZGF0YSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VbdGhpcy5TQVZFX05BTUUgKyBcIl9cIiArIHRoaXMuU0FWRV9WRVJTSU9OXTtcclxuICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG5cclxuICAgIHRoaXMuaGFzU2VlbkludHJvID0gZGF0YS5oYXNTZWVuSW50cm87XHJcbiAgICB0aGlzLmhhc1ZpZXdlZEluc3RydWN0aW9ucyA9IGRhdGEuaGFzVmlld2VkSW5zdHJ1Y3Rpb25zO1xyXG4gICAgdGhpcy5iZXN0U2NvcmUgPSBkYXRhLmJlc3RTY29yZTtcclxuXHJcbiAgICAvKlxyXG4gICAgdmFyIGpzb24gPSBKU09OLnN0cmluZ2lmeShcclxuICAgIHtcclxuICAgIFx0aGFzVmlld2VkSW5zdHJ1Y3Rpb25zOiBkYXRhLmhhc1ZpZXdlZEluc3RydWN0aW9ucyxcclxuICAgIFx0aGFzU2VlbkludHJvOiBkYXRhLmhhc1NlZW5JbnRyb1xyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIGhhc2ggPSBtZDUoanNvbiArIHRoaXMuU0FWRV9TRUVEKTtcclxuICAgIGlmIChoYXNoICE9IGRhdGEuaGFzaClcclxuICAgIHtcclxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5TQVZFX05BTUUgKyBcIl9cIiArIHRoaXMuU0FWRV9WRVJTSU9OKTtcclxuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgICB0aGlzLmhhc1NlZW5JbnRybyA9IGRhdGEuaGFzU2VlbkludHJvO1xyXG4gICAgICAgIHRoaXMuaGFzVmlld2VkSW5zdHJ1Y3Rpb25zID0gZGF0YS5oYXNWaWV3ZWRJbnN0cnVjdGlvbnM7XHJcbiAgICB9Ki9cclxufTtcclxuXHJcblNhdmVkRGF0YS5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgY29uc29sZS5sb2coJ3NhdmUnKTtcclxuICAgIHZhciBkYXRhID0ge307XHJcbiAgICBkYXRhLmhhc1NlZW5JbnRybyA9IHRoaXMuaGFzU2VlbkludHJvO1xyXG4gICAgZGF0YS5oYXNWaWV3ZWRJbnN0cnVjdGlvbnMgPSB0aGlzLmhhc1ZpZXdlZEluc3RydWN0aW9ucztcclxuICAgIGRhdGEuYmVzdFNjb3JlID0gdGhpcy5iZXN0U2NvcmU7XHJcblxyXG4gICAgdmFyIGpzb24gPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgIGRhdGEuaGFzaCA9IG1kNShqc29uICsgdGhpcy5TQVZFX1NFRUQpO1xyXG5cclxuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2VbdGhpcy5TQVZFX05BTUUgKyBcIl9cIiArIHRoaXMuU0FWRV9WRVJTSU9OXSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpOyAgICBcclxufTtcclxuXHJcblxyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFBSSVZBVEUgTUVUSE9EU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBFVkVOVFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEdFVFRFUlMvU0VUVEVSU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0iLCJ2YXIgQ29tbW9uICAgICAgICAgID0gcmVxdWlyZShcIi4uL0NvbW1vblwiKTtcclxudmFyIFNjcm9sbGVyT2JqZWN0ICA9IHJlcXVpcmUoXCIuLi9zY3JvbGxlci9TY3JvbGxlck9iamVjdFwiKTtcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIENPTlNUUlVDVE9SXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBBdmF0YXIoZ2lybClcclxue1xyXG5cdHRoaXMuZ2lybFx0XHRcdD0gZ2lybDtcclxuXHJcblx0dGhpcy5fc3ByaXRlXHRcdD0gbnVsbDtcclxuXHJcblx0U2Nyb2xsZXJPYmplY3QuY2FsbCh0aGlzLCBcImF2YXRhclwiLCBmYWxzZSk7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBBdmF0YXI7XHJcbkF2YXRhci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFNjcm9sbGVyT2JqZWN0LnByb3RvdHlwZSk7XHJcbkF2YXRhci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBBdmF0YXI7XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUFVCTElDIE1FVEhPRFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKi9cclxuQXZhdGFyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKVxyXG57XHJcblx0dmFyIGFuaW1hdGlvbkZyYW1lcyA9IHtibG9zc29tOjcsIGJ1YmJsZXM6OCwgYnV0dGVyY3VwOjV9O1xyXG5cclxuXHQvL3RoaXMuX3Nwcml0ZSA9IG5ldyBQSVhJLlNwcml0ZSh0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZSh0aGlzLmdpcmwgKyAnXzAwMScpKTsvL1xyXG5cdHRoaXMuX3Nwcml0ZSA9IG5ldyBwMy5Nb3ZpZUNsaXAodGhpcy5fZ2VuZXJhdGVBbmltYXRpb25TZXF1ZW5jZSh0aGlzLmdpcmwsIGFuaW1hdGlvbkZyYW1lc1t0aGlzLmdpcmxdKSk7XHJcblx0dGhpcy5fc3ByaXRlLmdvdG9BbmRQbGF5KDApO1xyXG5cdHRoaXMuX3Nwcml0ZS5hbmltYXRpb25TcGVlZCA9IDYwO1xyXG5cdHRoaXMuX3Nwcml0ZS5sb29waW5nID0gdHJ1ZTtcclxuXHR0aGlzLl9zcHJpdGUuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC41LCAwLjUpO1xyXG5cdHRoaXMuX3Nwcml0ZS5zY2FsZSA9IG5ldyBQSVhJLlBvaW50KDAuNzUsIDAuNzUpO1xyXG5cdHRoaXMuYWRkQ2hpbGQodGhpcy5fc3ByaXRlKTtcclxuXHJcblx0Q29tbW9uLmFuaW1hdG9yLmFkZChUd2Vlbk1heC50byh0aGlzLl9zcHJpdGUuYW5jaG9yLCAwLjYgKyAoMC4zKk1hdGgucmFuZG9tKCkpLCB7eTowLjU1LCBlYXNlOlNpbmUuZWFzZUluT3V0LCB5b3lvOnRydWUsIHJlcGVhdDotMX0pKTtcclxuXHRDb21tb24uYW5pbWF0b3IuYWRkKFR3ZWVuTWF4LnRvKHRoaXMuX3Nwcml0ZS5hbmNob3IsIDEuMiArICgwLjUqTWF0aC5yYW5kb20oKSksIHt4OjAuNiwgZWFzZTpTaW5lLmVhc2VJbk91dCwgeW95bzp0cnVlLCByZXBlYXQ6LTF9KSk7XHJcblxyXG5cdHRoaXMuYXJlYVJlY3QgPSBuZXcgUElYSS5SZWN0YW5nbGUoLTc1LCAtMTAwLCAxNTAsIDIwMCk7XHJcblx0dGhpcy5jb2xsaXNpb25SZWN0ID0gbmV3IFBJWEkuUmVjdGFuZ2xlKC00MCwgLTIwLCA3MCwgNTApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5BdmF0YXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKClcclxue1xyXG5cdFNjcm9sbGVyT2JqZWN0LnByb3RvdHlwZS51cGRhdGUuY2FsbCh0aGlzKTtcdFxyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5BdmF0YXIucHJvdG90eXBlLnRvdWNoID0gZnVuY3Rpb24oKVxyXG57XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5BdmF0YXIucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24oKVxyXG57XHJcblx0dGhpcy5fc3ByaXRlLnN0b3AoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqL1xyXG5BdmF0YXIucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uKClcclxue1xyXG5cdHRoaXMuX3Nwcml0ZS5wbGF5KCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKi9cclxuQXZhdGFyLnByb3RvdHlwZS5mbGFzaCA9IGZ1bmN0aW9uKClcclxue1xyXG5cdFR3ZWVuTWF4LmtpbGxUd2VlbnNPZih0aGlzLl9zcHJpdGUuYW5jaG9yKTtcclxuXHJcblx0dmFyIHRsID0gbmV3IFRpbWVsaW5lTWF4KHtyZXBlYXQ6NX0pO1xyXG5cdHRsLnRvKHRoaXMuX3Nwcml0ZSwgLjIsIHtvbkNvbXBsZXRlU2NvcGU6dGhpcywgb25Db21wbGV0ZTpmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5fc3ByaXRlLnZpc2libGUgPSBmYWxzZTtcclxuXHR9fSk7XHJcblx0dGwudG8odGhpcy5fc3ByaXRlLCAuMiwge29uQ29tcGxldGVTY29wZTp0aGlzLCBvbkNvbXBsZXRlOmZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLl9zcHJpdGUudmlzaWJsZSA9IHRydWU7XHJcblx0fX0pO1xyXG59XHJcblxyXG4vKipcclxuICovXHJcbkF2YXRhci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uKClcclxue1xyXG5cdFR3ZWVuTWF4LmtpbGxUd2VlbnNPZih0aGlzLl9zcHJpdGUuYW5jaG9yKTtcclxufVxyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFBSSVZBVEUgTUVUSE9EU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7IVN0cmluZ30gY2hhcmFjdGVyXHJcbiAqIEBwYXJhbSB7IU51bWJlcn0gZnJhbWVMaW1pdFxyXG4gKiBAcmV0dXJucyB7IXAzLk1vdmllQ2xpcFNlcXVlbmNlfVxyXG4gKi9cclxuQXZhdGFyLnByb3RvdHlwZS5fZ2VuZXJhdGVBbmltYXRpb25TZXF1ZW5jZSA9IGZ1bmN0aW9uKGNoYXJhY3RlciwgZnJhbWVMaW1pdClcclxue1xyXG5cdHZhciB0ZXh0dXJlQXJyID0gW107XHJcblx0Zm9yKHZhciBpID0gMTsgaSA8PSBmcmFtZUxpbWl0OyBpKyspXHJcblx0e1x0XHJcblx0XHR0ZXh0dXJlQXJyLnB1c2goY2hhcmFjdGVyICsgXCJfMDBcIiArIGkpO1xyXG5cdH1cclxuXHRmb3IodmFyIGkgPSAwOyBpIDwgdGV4dHVyZUFyci5sZW5ndGg7IGkrKylcclxuXHR7XHJcblx0XHR0ZXh0dXJlQXJyW2ldID0gdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUodGV4dHVyZUFycltpXSk7XHJcblx0fVxyXG5cdHZhciBzZXF1ZW5jZSA9IG5ldyBwMy5Nb3ZpZUNsaXBTZXF1ZW5jZSgpO1xyXG5cdHNlcXVlbmNlLmFkZFRleHR1cmVzKHRleHR1cmVBcnIpO1xyXG5cclxuXHRyZXR1cm4gc2VxdWVuY2U7XHJcbn1cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBFVkVOVFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBHRVRURVJTL1NFVFRFUlNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuIiwidmFyIENvbW1vbiAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9Db21tb25cIik7XHJcbnZhciBTY3JvbGxlck9iamVjdCAgPSByZXF1aXJlKFwiLi4vc2Nyb2xsZXIvU2Nyb2xsZXJPYmplY3RcIik7XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBDT05TVFJVQ1RPUlxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLyoqXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gQmFja2dyb3VuZEZsb2F0ZXIoaW1hZ2UsIGlkKVxyXG57XHJcblx0dGhpcy5faW1hZ2VcdFx0XHQ9IGltYWdlO1xyXG5cdHRoaXMuX2lkXHRcdFx0PSBpZDtcclxuXHR0aGlzLl9zcHJpdGUgXHRcdD0gbnVsbDtcclxuXHR0aGlzLl9zcHJpdGVIb2xkZXIgXHQ9IG51bGw7XHJcblxyXG5cdFNjcm9sbGVyT2JqZWN0LmNhbGwodGhpcywgXCJmbG9hdGVyXCIsIGZhbHNlKTtcclxuXHJcblx0dGhpcy50ZW1wbGF0ZSgpO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gQmFja2dyb3VuZEZsb2F0ZXI7XHJcbkJhY2tncm91bmRGbG9hdGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU2Nyb2xsZXJPYmplY3QucHJvdG90eXBlKTtcclxuQmFja2dyb3VuZEZsb2F0ZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQmFja2dyb3VuZEZsb2F0ZXI7XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUFVCTElDIE1FVEhPRFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbkJhY2tncm91bmRGbG9hdGVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKVxyXG57XHJcblxyXG59XHJcblxyXG5CYWNrZ3JvdW5kRmxvYXRlci5wcm90b3R5cGUudGVtcGxhdGUgPSBmdW5jdGlvbigpXHJcbntcclxuXHR0aGlzLl9zcHJpdGVIb2xkZXIgPSBuZXcgUElYSS5Db250YWluZXIoKTtcclxuXHR0aGlzLmFkZENoaWxkKHRoaXMuX3Nwcml0ZUhvbGRlcik7XHJcblxyXG5cdHRoaXMuX3Nwcml0ZSA9IG5ldyBQSVhJLlNwcml0ZSgpO1xyXG5cdHRoaXMuX3Nwcml0ZUhvbGRlci5hZGRDaGlsZCh0aGlzLl9zcHJpdGUpO1xyXG5cclxuXHR0aGlzLnJlbW92ZUlmT3V0c2lkZUJvdW5kYXJ5ID0gdHJ1ZTtcclxuXHJcblx0dGhpcy5jcmVhdGUoKTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKi9cclxuQmFja2dyb3VuZEZsb2F0ZXIucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKClcclxue1xyXG5cdHZhciBkYXRhID0gdGhpcy5fYXNzZXRNYW5hZ2VyLmdldEpTT04oJ29ic3RhY2xlX2RhdGEnKS5vYnN0YWNsZXNbdGhpcy5faWRdO1xyXG5cclxuXHR0aGlzLl9zcHJpdGUudGV4dHVyZSA9IHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKHRoaXMuX2ltYWdlKTtcclxuXHR0aGlzLmFyZWFSZWN0ID0gbmV3IFBJWEkuUmVjdGFuZ2xlKDAsIDAsIHRoaXMuX3Nwcml0ZS53aWR0aCwgdGhpcy5fc3ByaXRlLmhlaWdodCk7XHJcblxyXG5cdHRoaXMuX3Nwcml0ZUhvbGRlci54ID0gdGhpcy5hcmVhUmVjdC53aWR0aC8yO1xyXG5cdHRoaXMuX3Nwcml0ZUhvbGRlci55ID0gdGhpcy5hcmVhUmVjdC5oZWlnaHQvMjtcclxuXHR0aGlzLl9zcHJpdGUuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC41LCAwLjUpO1xyXG5cdHRoaXMuX3Nwcml0ZUhvbGRlci5yb3RhdGlvbiA9IE1hdGgucmFuZG9tKCkqKDM2MCpQSVhJLkRFR19UT19SQUQpO1xyXG5cclxuXHRDb21tb24uYW5pbWF0b3IuYWRkKFR3ZWVuTWF4LnRvKHRoaXMuX3Nwcml0ZUhvbGRlciwgMTArKE1hdGgucmFuZG9tKCkqMTApLCB7cm90YXRpb246dGhpcy5fc3ByaXRlSG9sZGVyLnJvdGF0aW9uICsgKDM2MCpQSVhJLkRFR19UT19SQUQpLCByZXBlYXQ6LTEsIGVhc2U6TGluZWFyLmVhc2VOb25lfSkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5CYWNrZ3JvdW5kRmxvYXRlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKVxyXG57XHJcblx0U2Nyb2xsZXJPYmplY3QucHJvdG90eXBlLnVwZGF0ZS5jYWxsKHRoaXMpO1x0XHJcbn07XHJcblxyXG5CYWNrZ3JvdW5kRmxvYXRlci5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKClcclxue1xyXG5cdFR3ZWVuTWF4LmtpbGxUd2VlbnNPZih0aGlzLl9zcHJpdGVIb2xkZXIpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5CYWNrZ3JvdW5kRmxvYXRlci5wcm90b3R5cGUudG91Y2ggPSBmdW5jdGlvbigpXHJcbntcclxuXHJcbn07XHJcblxyXG4vKipcclxuICovXHJcbkJhY2tncm91bmRGbG9hdGVyLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uKClcclxue1xyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqL1xyXG5CYWNrZ3JvdW5kRmxvYXRlci5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24oKVxyXG57XHJcblxyXG59XHJcblxyXG5CYWNrZ3JvdW5kRmxvYXRlci5wcm90b3R5cGUuc2hpZnRDb2xvdXIgPSBmdW5jdGlvbihudW1iZXIpXHJcbntcclxuXHR2YXIgbmV3U3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKHRoaXMuX2ltYWdlKSk7XHJcblx0bmV3U3ByaXRlLnRpbnQgPSBDb21tb24uY29sb3Vyc1snc2t5JyArIG51bWJlcl07XHJcblx0bmV3U3ByaXRlLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcclxuXHR0aGlzLl9zcHJpdGVIb2xkZXIuYWRkQ2hpbGQobmV3U3ByaXRlKTtcclxuXHJcblx0bmV3U3ByaXRlLmFscGhhID0gMDtcclxuXHRDb21tb24uYW5pbWF0b3IuYWRkKFR3ZWVuTWF4LnRvKG5ld1Nwcml0ZSwgMiwge2FscGhhOjEsIG9uQ29tcGxldGVTY29wZTp0aGlzLCBvbkNvbXBsZXRlOmZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLl9zcHJpdGVIb2xkZXIucmVtb3ZlQ2hpbGQodGhpcy5fc3ByaXRlKTtcclxuXHRcdHRoaXMuX3Nwcml0ZSA9IG5ld1Nwcml0ZTtcclxuXHR9fSkpO1xyXG59XHJcblxyXG5CYWNrZ3JvdW5kRmxvYXRlci5wcm90b3R5cGUuc2V0Q29sb3VyID0gZnVuY3Rpb24obnVtYmVyKVxyXG57XHJcblx0dGhpcy5fc3ByaXRlLnRpbnQgPSBDb21tb24uY29sb3Vyc1snc2t5JyArIG51bWJlcl07XHJcbn1cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBQUklWQVRFIE1FVEhPRFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gRVZFTlRTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gR0VUVEVSUy9TRVRURVJTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiIsInZhciBDb21tb24gICAgICAgICAgXHRcdD0gcmVxdWlyZShcIi4uL0NvbW1vblwiKTtcclxudmFyIFNjcm9sbGVyT2JqZWN0SW1hZ2UgIFx0PSByZXF1aXJlKFwiLi4vc2Nyb2xsZXIvU2Nyb2xsZXJPYmplY3RJbWFnZVwiKTtcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIENPTlNUUlVDVE9SXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBCYWNrZ3JvdW5kSW1hZ2UodHlwZSwgcmVtb3ZlSWZPdXRzaWRlQm91bmRhcnksIHRleHR1cmUsIGFuY2hvcilcclxue1xyXG5cdFNjcm9sbGVyT2JqZWN0SW1hZ2UuY2FsbCh0aGlzLCB0eXBlLCByZW1vdmVJZk91dHNpZGVCb3VuZGFyeSwgdGV4dHVyZSwgYW5jaG9yKTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tncm91bmRJbWFnZTtcclxuQmFja2dyb3VuZEltYWdlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU2Nyb2xsZXJPYmplY3RJbWFnZS5wcm90b3R5cGUpO1xyXG5CYWNrZ3JvdW5kSW1hZ2UucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQmFja2dyb3VuZEltYWdlO1xyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFBVQkxJQyBNRVRIT0RTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICovXHJcbkJhY2tncm91bmRJbWFnZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oKVxyXG57XHJcblx0U2Nyb2xsZXJPYmplY3RJbWFnZS5wcm90b3R5cGUuY3JlYXRlLmNhbGwodGhpcyk7XHJcbn07XHJcblxyXG4vKipcclxuICovXHJcbkJhY2tncm91bmRJbWFnZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKVxyXG57XHJcblx0U2Nyb2xsZXJPYmplY3RJbWFnZS5wcm90b3R5cGUudXBkYXRlLmNhbGwodGhpcyk7XHRcclxufTtcclxuXHJcbkJhY2tncm91bmRJbWFnZS5wcm90b3R5cGUuc2hpZnRDb2xvdXIgPSBmdW5jdGlvbihudW1iZXIpXHJcbntcclxuXHR2YXIgbmV3U3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMuX3RleHR1cmUpO1xyXG5cdG5ld1Nwcml0ZS50aW50ID0gQ29tbW9uLmNvbG91cnNbJ3NreScgKyBudW1iZXJdO1xyXG5cdHRoaXMuYWRkQ2hpbGQobmV3U3ByaXRlKTtcclxuXHJcblx0bmV3U3ByaXRlLmFscGhhID0gMDtcclxuXHRDb21tb24uYW5pbWF0b3IuYWRkKFR3ZWVuTWF4LnRvKG5ld1Nwcml0ZSwgMiwge2FscGhhOjEsIG9uQ29tcGxldGVTY29wZTp0aGlzLCBvbkNvbXBsZXRlOmZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLnJlbW92ZUNoaWxkKHRoaXMuX2ltYWdlKTtcclxuXHRcdHRoaXMuX2ltYWdlID0gbmV3U3ByaXRlO1xyXG5cdH19KSk7XHJcbn1cclxuXHJcbkJhY2tncm91bmRJbWFnZS5wcm90b3R5cGUuc2V0Q29sb3VyID0gZnVuY3Rpb24obnVtYmVyKVxyXG57XHJcblx0dGhpcy5faW1hZ2UudGludCA9IENvbW1vbi5jb2xvdXJzWydza3knICsgbnVtYmVyXTtcclxufVxyXG5cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBQUklWQVRFIE1FVEhPRFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gRVZFTlRTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gR0VUVEVSUy9TRVRURVJTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiIsInZhciBDb21tb24gICAgICAgICAgPSByZXF1aXJlKFwiLi4vQ29tbW9uXCIpO1xyXG52YXIgU2Nyb2xsZXJPYmplY3QgID0gcmVxdWlyZShcIi4uL3Njcm9sbGVyL1Njcm9sbGVyT2JqZWN0XCIpO1xyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gQ09OU1RSVUNUT1JcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIENvbGxlY3RpYmxlKClcclxue1xyXG5cdHRoaXMuX3Nwcml0ZSBcdD0gbnVsbDtcclxuXHR0aGlzLmNvbGxlY3RlZFx0PSBmYWxzZTtcclxuXHJcblx0U2Nyb2xsZXJPYmplY3QuY2FsbCh0aGlzLCBcImNvbGxlY3RpYmxlXCIsIGZhbHNlKTtcclxuXHJcblx0dGhpcy50ZW1wbGF0ZSgpO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gQ29sbGVjdGlibGU7XHJcbkNvbGxlY3RpYmxlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU2Nyb2xsZXJPYmplY3QucHJvdG90eXBlKTtcclxuQ29sbGVjdGlibGUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ29sbGVjdGlibGU7XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUFVCTElDIE1FVEhPRFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbkNvbGxlY3RpYmxlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKVxyXG57XHJcblxyXG59XHJcblxyXG5Db2xsZWN0aWJsZS5wcm90b3R5cGUudGVtcGxhdGUgPSBmdW5jdGlvbigpXHJcbntcclxuXHR0aGlzLl9zcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJwaWNrdXBcIikpO1xyXG5cdHRoaXMuX3Nwcml0ZS5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDAuNSk7XHJcblx0dGhpcy5fc3ByaXRlLnNjYWxlID0gbmV3IFBJWEkuUG9pbnQoMC43NSwgMC43NSk7XHJcblx0dGhpcy5hZGRDaGlsZCh0aGlzLl9zcHJpdGUpO1xyXG5cclxuXHR0aGlzLmFyZWFSZWN0ID0gbmV3IFBJWEkuUmVjdGFuZ2xlKC0odGhpcy5fc3ByaXRlLndpZHRoLzIpLCAtKHRoaXMuX3Nwcml0ZS5oZWlnaHQvMiksIHRoaXMuX3Nwcml0ZS53aWR0aCwgdGhpcy5fc3ByaXRlLmhlaWdodCk7XHJcblx0dGhpcy5jb2xsaXNpb25SZWN0ID0gdGhpcy5hcmVhUmVjdC5jbG9uZSgpO1xyXG59XHJcblxyXG5Db2xsZWN0aWJsZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oKVxyXG57XHJcblxyXG59O1xyXG5cclxuQ29sbGVjdGlibGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKClcclxue1xyXG5cdFNjcm9sbGVyT2JqZWN0LnByb3RvdHlwZS51cGRhdGUuY2FsbCh0aGlzKTtcdFxyXG59O1xyXG5cclxuQ29sbGVjdGlibGUucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbigpXHJcbntcclxuXHR0aGlzLl9zcHJpdGUuc2NhbGUgPSBuZXcgUElYSS5Qb2ludCgxLCAxKTtcclxufTtcclxuXHJcbkNvbGxlY3RpYmxlLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uKClcclxue1xyXG5cclxufVxyXG5cclxuQ29sbGVjdGlibGUucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uKClcclxue1xyXG5cclxufVxyXG5cclxuQ29sbGVjdGlibGUucHJvdG90eXBlLmNvbGxlY3QgPSBmdW5jdGlvbigpXHJcbntcclxuXHR0aGlzLmNvbGxlY3RlZCA9IHRydWU7XHJcblx0dGhpcy5fc3ByaXRlLnNjYWxlID0gbmV3IFBJWEkuUG9pbnQoMCwgMCk7XHJcbn1cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBQUklWQVRFIE1FVEhPRFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gRVZFTlRTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gR0VUVEVSUy9TRVRURVJTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiIsInZhciBDb21tb24gICAgICAgICAgPSByZXF1aXJlKFwiLi4vQ29tbW9uXCIpO1xyXG52YXIgU2Nyb2xsZXJPYmplY3QgID0gcmVxdWlyZShcIi4uL3Njcm9sbGVyL1Njcm9sbGVyT2JqZWN0XCIpO1xyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gQ09OU1RSVUNUT1JcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIEZvcmVncm91bmRTaGFkb3coaW1hZ2UpXHJcbntcclxuXHR0aGlzLl9pbWFnZVx0XHRcdD0gaW1hZ2U7XHJcblx0dGhpcy5fc3ByaXRlIFx0XHQ9IG51bGw7XHJcblxyXG5cdFNjcm9sbGVyT2JqZWN0LmNhbGwodGhpcywgXCJmb3JlZ3JvdW5kU2hhZG93XCIsIGZhbHNlKTtcclxuXHJcblx0dGhpcy50ZW1wbGF0ZSgpO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gRm9yZWdyb3VuZFNoYWRvdztcclxuRm9yZWdyb3VuZFNoYWRvdy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFNjcm9sbGVyT2JqZWN0LnByb3RvdHlwZSk7XHJcbkZvcmVncm91bmRTaGFkb3cucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRm9yZWdyb3VuZFNoYWRvdztcclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBQVUJMSUMgTUVUSE9EU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuRm9yZWdyb3VuZFNoYWRvdy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKClcclxue1xyXG5cclxufVxyXG5cclxuRm9yZWdyb3VuZFNoYWRvdy5wcm90b3R5cGUudGVtcGxhdGUgPSBmdW5jdGlvbigpXHJcbntcclxuXHR0aGlzLl9zcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUoKTtcclxuXHR0aGlzLmFkZENoaWxkKHRoaXMuX3Nwcml0ZSk7XHJcblxyXG5cdHRoaXMucmVtb3ZlSWZPdXRzaWRlQm91bmRhcnkgPSB0cnVlO1xyXG5cclxuXHR0aGlzLmNyZWF0ZSgpO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqL1xyXG5Gb3JlZ3JvdW5kU2hhZG93LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbigpXHJcbntcclxuXHR0aGlzLl9zcHJpdGUudGV4dHVyZSA9IHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKHRoaXMuX2ltYWdlKTtcclxuXHR0aGlzLmFyZWFSZWN0ID0gbmV3IFBJWEkuUmVjdGFuZ2xlKDAsIDAsIHRoaXMuX3Nwcml0ZS53aWR0aCwgdGhpcy5fc3ByaXRlLmhlaWdodCk7XHJcblxyXG5cdHRoaXMuX3Nwcml0ZS5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLCAxKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKi9cclxuRm9yZWdyb3VuZFNoYWRvdy5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKVxyXG57XHJcblx0U2Nyb2xsZXJPYmplY3QucHJvdG90eXBlLnVwZGF0ZS5jYWxsKHRoaXMpO1x0XHJcbn07XHJcblxyXG5Gb3JlZ3JvdW5kU2hhZG93LnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKVxyXG57XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5Gb3JlZ3JvdW5kU2hhZG93LnByb3RvdHlwZS50b3VjaCA9IGZ1bmN0aW9uKClcclxue1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKi9cclxuRm9yZWdyb3VuZFNoYWRvdy5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbigpXHJcbntcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKi9cclxuRm9yZWdyb3VuZFNoYWRvdy5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24oKVxyXG57XHJcblxyXG59XHJcblxyXG5Gb3JlZ3JvdW5kU2hhZG93LnByb3RvdHlwZS5zaGlmdENvbG91ciA9IGZ1bmN0aW9uKG51bWJlcilcclxue1xyXG5cdHZhciBuZXdTcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUodGhpcy5faW1hZ2UpKTtcclxuXHRuZXdTcHJpdGUudGludCA9IENvbW1vbi5jb2xvdXJzWydza3knICsgbnVtYmVyXTtcclxuXHRuZXdTcHJpdGUuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC41LCAwLjUpO1xyXG5cdHRoaXMuX3Nwcml0ZUhvbGRlci5hZGRDaGlsZChuZXdTcHJpdGUpO1xyXG5cclxuXHRuZXdTcHJpdGUuYWxwaGEgPSAwO1xyXG5cdENvbW1vbi5hbmltYXRvci5hZGQoVHdlZW5NYXgudG8obmV3U3ByaXRlLCAyLCB7YWxwaGE6MSwgb25Db21wbGV0ZVNjb3BlOnRoaXMsIG9uQ29tcGxldGU6ZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuX3Nwcml0ZUhvbGRlci5yZW1vdmVDaGlsZCh0aGlzLl9zcHJpdGUpO1xyXG5cdFx0dGhpcy5fc3ByaXRlID0gbmV3U3ByaXRlO1xyXG5cdH19KSk7XHJcbn1cclxuXHJcbkZvcmVncm91bmRTaGFkb3cucHJvdG90eXBlLnNldENvbG91ciA9IGZ1bmN0aW9uKG51bWJlcilcclxue1xyXG5cdHRoaXMuX3Nwcml0ZS50aW50ID0gQ29tbW9uLmNvbG91cnNbJ3NreScgKyBudW1iZXJdO1xyXG59XHJcblxyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFBSSVZBVEUgTUVUSE9EU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBFVkVOVFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBHRVRURVJTL1NFVFRFUlNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuIiwidmFyIENvbW1vbiAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9Db21tb25cIik7XHJcbnZhciBTY3JvbGxlck9iamVjdCAgPSByZXF1aXJlKFwiLi4vc2Nyb2xsZXIvU2Nyb2xsZXJPYmplY3RcIik7XHJcbnZhciBFbWl0dGVyICBcdFx0PSByZXF1aXJlKFwiLi4vZ2VuZXJhbC9FbWl0dGVyXCIpO1xyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gQ09OU1RSVUNUT1JcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIE9ic3RhY2xlKGltYWdlLCBpZCwgcG9zaXRpb24sIGJvYilcclxue1xyXG5cdHRoaXMuX2ltYWdlXHRcdFx0PSBpbWFnZTtcclxuXHR0aGlzLmlkXHRcdFx0XHQ9IGlkO1xyXG5cdHRoaXMuX3Bvc2l0aW9uXHRcdD0gcG9zaXRpb247XHJcblx0dGhpcy5fYm9iXHRcdFx0PSBib2I7XHJcblx0dGhpcy5fc3ByaXRlIFx0XHQ9IG51bGw7XHJcblx0dGhpcy5fZ2xvd0VtaXR0ZXIgXHQ9IG51bGw7XHJcblxyXG5cdFNjcm9sbGVyT2JqZWN0LmNhbGwodGhpcywgXCJvYnN0YWNsZVwiLCBmYWxzZSk7XHJcblxyXG5cdHRoaXMudGVtcGxhdGUoKTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IE9ic3RhY2xlO1xyXG5PYnN0YWNsZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFNjcm9sbGVyT2JqZWN0LnByb3RvdHlwZSk7XHJcbk9ic3RhY2xlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE9ic3RhY2xlO1xyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFBVQkxJQyBNRVRIT0RTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5PYnN0YWNsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKClcclxue1xyXG5cclxufVxyXG5cclxuT2JzdGFjbGUucHJvdG90eXBlLnRlbXBsYXRlID0gZnVuY3Rpb24oKVxyXG57XHJcblx0dGhpcy5fc3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKCk7XHJcblx0dGhpcy5hZGRDaGlsZCh0aGlzLl9zcHJpdGUpO1xyXG5cclxuXHR0aGlzLnJlbW92ZUlmT3V0c2lkZUJvdW5kYXJ5ID0gdHJ1ZTtcclxuXHJcblx0dGhpcy5jcmVhdGUoKTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKi9cclxuT2JzdGFjbGUucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKClcclxue1xyXG5cdHZhciBkYXRhID0gdGhpcy5fYXNzZXRNYW5hZ2VyLmdldEpTT04oJ29ic3RhY2xlX2RhdGEnKS5vYnN0YWNsZXNbdGhpcy5pZF07XHJcblxyXG5cdHRoaXMuX3Nwcml0ZS50ZXh0dXJlID0gdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUodGhpcy5faW1hZ2UpO1xyXG5cdHRoaXMuYXJlYVJlY3QgPSBuZXcgUElYSS5SZWN0YW5nbGUoMCwgMCwgdGhpcy5fc3ByaXRlLndpZHRoLCB0aGlzLl9zcHJpdGUuaGVpZ2h0KTtcclxuXHJcblx0aWYoZGF0YS5hbmNob3JZKVxyXG5cdHtcclxuXHRcdGlmKGRhdGEuYW5jaG9yWS5taW4gIT0gdW5kZWZpbmVkICYmIGRhdGEuYW5jaG9yWS5tYXggIT0gdW5kZWZpbmVkKVxyXG5cdFx0XHR0aGlzLl9zcHJpdGUuYW5jaG9yLnkgPSBkYXRhLmFuY2hvclkubWluICsgKChkYXRhLmFuY2hvclkubWF4LWRhdGEuYW5jaG9yWS5taW4pICogTWF0aC5yYW5kb20oKSk7XHJcblx0XHRlbHNlXHJcblx0XHRcdHRoaXMuX3Nwcml0ZS5hbmNob3IueSA9IGRhdGEuYW5jaG9yWTtcclxuXHR9XHJcblxyXG5cdHRoaXMuYXJlYVJlY3QueSA9IC0odGhpcy5fc3ByaXRlLmhlaWdodCp0aGlzLl9zcHJpdGUuYW5jaG9yLnkpO1xyXG5cclxuXHR0aGlzLmNvbGxpc2lvblJlY3QgPSB0aGlzLmFyZWFSZWN0LmNsb25lKCk7XHJcblxyXG5cdGlmKGRhdGEuY29sbGlzaW9uUmVjdCAhPSB1bmRlZmluZWQpXHJcblx0e1xyXG5cdFx0aWYoZGF0YS5jb2xsaXNpb25SZWN0LngpXHJcblx0XHRcdHRoaXMuY29sbGlzaW9uUmVjdC54ICs9IGRhdGEuY29sbGlzaW9uUmVjdC54ICogdGhpcy5fc3ByaXRlLndpZHRoO1xyXG5cdFx0aWYoZGF0YS5jb2xsaXNpb25SZWN0LnkpXHJcblx0XHRcdHRoaXMuY29sbGlzaW9uUmVjdC55ICs9IGRhdGEuY29sbGlzaW9uUmVjdC55ICogdGhpcy5fc3ByaXRlLmhlaWdodDsgXHJcblx0XHRpZihkYXRhLmNvbGxpc2lvblJlY3Qud2lkdGgpXHJcblx0XHRcdHRoaXMuY29sbGlzaW9uUmVjdC53aWR0aCA9IGRhdGEuY29sbGlzaW9uUmVjdC53aWR0aCAqIHRoaXMuX3Nwcml0ZS53aWR0aDtcclxuXHRcdGlmKGRhdGEuY29sbGlzaW9uUmVjdC5oZWlnaHQpXHJcblx0XHRcdHRoaXMuY29sbGlzaW9uUmVjdC5oZWlnaHQgPSBkYXRhLmNvbGxpc2lvblJlY3QuaGVpZ2h0ICogdGhpcy5fc3ByaXRlLmhlaWdodDsgXHJcblx0fVxyXG5cclxuXHRpZih0aGlzLl9ib2IgPT0gdHJ1ZSlcclxuXHR7XHJcblx0XHR0aGlzLl9zcHJpdGUuYW5jaG9yLnkgKz0gMC4wNTtcclxuXHRcdENvbW1vbi5hbmltYXRvci5hZGQoVHdlZW5NYXgudG8odGhpcy5fc3ByaXRlLmFuY2hvciwgLjUsIHt5OnRoaXMuX3Nwcml0ZS5hbmNob3IueSAtIDAuMSwgZWFzZTpTaW5lLmVhc2VJbk91dCwgeW95bzp0cnVlLCByZXBlYXQ6LTF9KSk7XHJcblx0XHJcblx0XHR0aGlzLl9nbG93RW1pdHRlciA9IEVtaXR0ZXIuYWRkKHRoaXMsIFxyXG4gICAgICAgICAgICAgICAgICAgIFsnZ2xvdyddLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicGFydGljbGVzX2dsb3dcIiwgdGhpcy5fc3ByaXRlLndpZHRoLzIsICh0aGlzLl9zcHJpdGUuaGVpZ2h0LzIpLTUwKTtcclxuXHR9XHJcbn07XHJcblxyXG4vKipcclxuICovXHJcbk9ic3RhY2xlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpXHJcbntcclxuXHRTY3JvbGxlck9iamVjdC5wcm90b3R5cGUudXBkYXRlLmNhbGwodGhpcyk7XHRcclxufTtcclxuXHJcbk9ic3RhY2xlLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKVxyXG57XHJcblx0VHdlZW5NYXgua2lsbFR3ZWVuc09mKHRoaXMuX3Nwcml0ZS5hbmNob3IpO1xyXG5cclxuXHRpZih0aGlzLl9nbG93RW1pdHRlcilcclxuXHRcdEVtaXR0ZXIuZGVzdHJveSh0aGlzLl9nbG93RW1pdHRlcik7XHJcbn07XHJcblxyXG4vKipcclxuICovXHJcbk9ic3RhY2xlLnByb3RvdHlwZS50b3VjaCA9IGZ1bmN0aW9uKClcclxue1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKi9cclxuT2JzdGFjbGUucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24oKVxyXG57XHJcblxyXG59XHJcblxyXG4vKipcclxuICovXHJcbk9ic3RhY2xlLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbigpXHJcbntcclxuXHJcbn1cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBQUklWQVRFIE1FVEhPRFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gRVZFTlRTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gR0VUVEVSUy9TRVRURVJTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiIsInZhciBDb21tb24gICAgICAgICAgPSByZXF1aXJlKFwiLi4vQ29tbW9uXCIpO1xyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gQ09OU1RSVUNUT1JcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIFNjb3JlQm94KClcclxue1xyXG5cdC8qKlxyXG4gICAgICogQHR5cGUge3AzLkFzc2V0TWFuYWdlcn1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fYXNzZXRNYW5hZ2VyID0gcDMuQXNzZXRNYW5hZ2VyLmluc3RhbmNlO1xyXG5cclxuXHQvKipcclxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuX2hvbGRlciA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7cDMuQml0bWFwVGV4dH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fdGV4dCA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5fZGVmYXVsdFRleHRTY2FsZSA9IDAuNjtcclxuXHJcblx0UElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjb3JlQm94O1xyXG5TY29yZUJveC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZSk7XHJcblNjb3JlQm94LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNjb3JlQm94O1xyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFBVQkxJQyBNRVRIT0RTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKi9cclxuU2NvcmVCb3gucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpXHJcbntcclxuXHR0aGlzLl9ob2xkZXIgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJzY29yZWJveFwiKSk7XHJcblx0dGhpcy5faG9sZGVyLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcclxuXHR0aGlzLmFkZENoaWxkKHRoaXMuX2hvbGRlcik7XHJcblxyXG5cdHZhciBnaXJscyA9IG5ldyBQSVhJLlNwcml0ZSh0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShcImdpcmxzX2ljb25cIikpO1xyXG5cdGdpcmxzLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcclxuXHRnaXJscy54ID0gLShnaXJscy53aWR0aC8yKTtcclxuXHRnaXJscy55ID0gLTEwO1xyXG5cdHRoaXMuYWRkQ2hpbGQoZ2lybHMpO1xyXG5cclxuXHR0aGlzLl90ZXh0ID0gbmV3IHAzLkJpdG1hcFRleHQoXCIxMDAwXCIsIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRGb250QXRsYXMoXCJ1bnBhY2sxMDBfYmx1ZVwiKSwgcDMuQml0bWFwVGV4dC5BTElHTl9MRUZUKTtcclxuXHR0aGlzLl90ZXh0LnggPSAzODtcclxuXHR0aGlzLl90ZXh0LnkgPSAtMzM7XHJcblx0dGhpcy5fdGV4dC5zY2FsZSA9IG5ldyBQSVhJLlBvaW50KHRoaXMuX2RlZmF1bHRUZXh0U2NhbGUsIHRoaXMuX2RlZmF1bHRUZXh0U2NhbGUpO1xyXG5cdHRoaXMuYWRkQ2hpbGQodGhpcy5fdGV4dCk7XHJcbn07XHJcblxyXG4vKipcclxuICovXHJcblNjb3JlQm94LnByb3RvdHlwZS51cGRhdGVTY29yZSA9IGZ1bmN0aW9uKG5ld1Njb3JlKVxyXG57XHJcblx0dGhpcy5fdGV4dC50ZXh0ID0gbmV3U2NvcmUudG9TdHJpbmcoKTtcclxuXHJcblx0aWYobmV3U2NvcmUgPj0gMTApXHJcblx0e1xyXG5cdFx0dGhpcy5fdGV4dC54ID0gMjM7XHJcblx0fVxyXG5cdGlmKG5ld1Njb3JlID49IDEwMClcclxuXHR7XHJcblx0XHR0aGlzLl90ZXh0LnggPSAxMTtcclxuXHR9XHRcclxuXHRpZihuZXdTY29yZSA+PSAxMDAwKVxyXG5cdHtcclxuXHRcdHRoaXMuX3RleHQuc2NhbGUueCA9IHRoaXMuX3RleHQuc2NhbGUueSA9IDEgKiB0aGlzLl9kZWZhdWx0VGV4dFNjYWxlO1xyXG5cdFx0dGhpcy5fdGV4dC54ID0gMDtcclxuXHR9XHJcblx0aWYobmV3U2NvcmUgPj0gMTAwMDApXHJcblx0e1xyXG5cdFx0dGhpcy5fdGV4dC5zY2FsZS54ID0gdGhpcy5fdGV4dC5zY2FsZS55ID0gMC44NSAqIHRoaXMuX2RlZmF1bHRUZXh0U2NhbGU7XHJcblx0XHR0aGlzLl90ZXh0LnggPSAxMDtcclxuXHRcdHRoaXMuX3RleHQueSA9IC0yNTtcclxuXHR9XHJcbn07XHJcblxyXG5TY29yZUJveC5wcm90b3R5cGUuYW5pbWF0ZVNjb3JlID0gZnVuY3Rpb24oKVxyXG57XHJcblx0dmFyIHNjb3JlID0gbmV3IFBJWEkuU3ByaXRlKENvbW1vbi5nZW5lcmF0ZWRUZXh0dXJlcy5jb2xsZWN0aWJsZUJvbnVzKTtcclxuXHRzY29yZS5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDAuNSk7XHJcblx0c2NvcmUuc2NhbGUgPSBuZXcgUElYSS5Qb2ludCgwLCAwKTtcclxuXHRzY29yZS54ID0gdGhpcy5fdGV4dC54ICsgKHRoaXMuX3RleHQud2lkdGgvMik7XHJcblx0c2NvcmUueSA9IHRoaXMuX3RleHQueSArICh0aGlzLl90ZXh0LmhlaWdodC8yKTtcclxuXHR0aGlzLmFkZENoaWxkKHNjb3JlKTtcclxuXHJcblx0Q29tbW9uLmFuaW1hdG9yLmFkZChUd2Vlbk1heC50byhzY29yZSwgLjYsIHt5Oi0xMDAsIGVhc2U6U2luZS5lYXNlSW5PdXR9KSk7XHJcblx0Q29tbW9uLmFuaW1hdG9yLmFkZChUd2Vlbk1heC50byhzY29yZS5zY2FsZSwgLjMsIHt4OjAuNywgeTowLjcsIGVhc2U6RXhwby5lYXNlSW5PdXQsIHlveW86dHJ1ZSwgcmVwZWF0OjF9KSk7XHJcbn1cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBQUklWQVRFIE1FVEhPRFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBFVkVOVFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gR0VUVEVSUy9TRVRURVJTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG5cclxuIiwiLyoqXG4gKiAgVHJhaWxSZW5kZXJlclxuICpcbiAqICBDcmVhdGVkIGJ5IExlZ21hbiBvbiAyNC8wOS8yMDE1LlxuICpcbiAqL1xuXG52YXIgQ29tbW9uICAgICAgPSByZXF1aXJlKFwiLi4vQ29tbW9uXCIpO1xuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBUcmFpbFJlbmRlcmVyKCkge1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy50aW1lID0gMS4wO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnZlcnRleERpc3RhbmNlID0gOC4wO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnRoaWNrbmVzcyA9IDguMDtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5jb2xvciA9IDB4RkZGRkZGO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX3ZlcnRpY2VzID0gW107XG5cbiAgICBQSVhJLkdyYXBoaWNzLmNhbGwodGhpcyk7XG59XG5tb2R1bGUuZXhwb3J0cyAgICAgICAgICAgICAgICAgICAgICAgICAgPSBUcmFpbFJlbmRlcmVyO1xuVHJhaWxSZW5kZXJlci5wcm90b3R5cGUgICAgICAgICAgICAgICAgID0gT2JqZWN0LmNyZWF0ZShQSVhJLkdyYXBoaWNzLnByb3RvdHlwZSk7XG5UcmFpbFJlbmRlcmVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciAgICAgPSBUcmFpbFJlbmRlcmVyO1xuXG5UcmFpbFJlbmRlcmVyLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7IU51bWJlcn0geFxuICogQHBhcmFtIHshTnVtYmVyfSB5XG4gKi9cblRyYWlsUmVuZGVyZXIucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgdGhpcy5jbGVhcigpO1xuXG4gICAgdmFyIHZlcnRleDtcbiAgICBmb3IgKHZhciBpID0gdGhpcy5fdmVydGljZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLSBpKSB7XG4gICAgICAgIHZlcnRleCA9IHRoaXMuX3ZlcnRpY2VzW2ldO1xuICAgICAgICBpZiAoKHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSAqIDAuMDAxKSAtIHZlcnRleC50aW1lID4gdGhpcy50aW1lKSB7XG4gICAgICAgICAgICB0aGlzLl92ZXJ0aWNlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fdmVydGljZXMubGVuZ3RoID4gMSkge1xuICAgICAgICB0aGlzLm1vdmVUbyh0aGlzLmZpcnN0LngsIHRoaXMuZmlyc3QueSk7XG4gICAgICAgIHRoaXMubGluZVN0eWxlKHRoaXMudGhpY2tuZXNzLCB0aGlzLmNvbG9yKTtcblxuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgdGhpcy5fdmVydGljZXMubGVuZ3RoOyArKyBpKSB7XG4gICAgICAgICAgICB2ZXJ0ZXggPSB0aGlzLl92ZXJ0aWNlc1tpXTtcblxuICAgICAgICAgICAgdGhpcy5saW5lVG8odmVydGV4LngsIHZlcnRleC55KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5lbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmxpbmVUbyh4LCB5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy5maXJzdCkge1xuICAgICAgICB0aGlzLnJlY29yZFZlcnRleCh4LCB5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gbmV3IHAzLlZlY3RvcjIoeCAtIHRoaXMubGFzdC54LCB5IC0gdGhpcy5sYXN0LnkpO1xuICAgICAgICBpZiAoZGlyZWN0aW9uLmxlbmd0aFNxID4gdGhpcy52ZXJ0ZXhEaXN0YW5jZSAqIHRoaXMudmVydGV4RGlzdGFuY2UpIHtcbiAgICAgICAgICAgIHRoaXMucmVjb3JkVmVydGV4KHgsIHkpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuVHJhaWxSZW5kZXJlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl92ZXJ0aWNlcy5sZW5ndGggPSAwO1xufTtcblxuLyoqXG4gKiBAcGFyYW0geyFOdW1iZXJ9IHhcbiAqIEBwYXJhbSB7IU51bWJlcn0geVxuICovXG5UcmFpbFJlbmRlcmVyLnByb3RvdHlwZS5yZWNvcmRWZXJ0ZXggPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgaWYgKCF0aGlzLmVuYWJsZWQpIHJldHVybjtcblxuICAgIHZhciB2ZXJ0ZXggPSB7XG4gICAgICAgIHg6IHgsXG4gICAgICAgIHk6IHksXG4gICAgICAgIHRpbWU6IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSAqIDAuMDAxXG4gICAgfTtcbiAgICB0aGlzLl92ZXJ0aWNlcy5wdXNoKHZlcnRleCk7XG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVHJhaWxSZW5kZXJlci5wcm90b3R5cGUsIFwiZmlyc3RcIiwge1xuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtQSVhJLlBvaW50fVxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92ZXJ0aWNlcy5sZW5ndGggPyB0aGlzLl92ZXJ0aWNlc1swXSA6IG51bGw7XG4gICAgfVxufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShUcmFpbFJlbmRlcmVyLnByb3RvdHlwZSwgXCJsYXN0XCIsIHtcbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7UElYSS5Qb2ludH1cbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmVydGljZXMubGVuZ3RoID8gdGhpcy5fdmVydGljZXNbdGhpcy5fdmVydGljZXMubGVuZ3RoIC0gMV0gOiBudWxsO1xuICAgIH1cbn0pO1xuIiwiXHJcbnZhciBDb21tb24gICAgICAgICAgPSByZXF1aXJlKFwiLi4vQ29tbW9uXCIpO1xyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gQ09OU1RSVUNUT1JcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIEVtaXR0ZXIoKSB7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUFVCTElDIE1FVEhPRFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG4vKipcclxuICogQHBhcmFtIHshUElYSS5Db250YWluZXJ9IHBhcmVudFxyXG4gKiBAcGFyYW0geyFBcnJheTxTdHJpbmc+fSB0ZXh0dXJlc1xyXG4gKiBAcGFyYW0geyFTdHJpbmd9IGpzb25cclxuICogQHBhcmFtIHtOdW1iZXI9fSB4XHJcbiAqIEBwYXJhbSB7TnVtYmVyPX0geVxyXG4gKiBAcGFyYW0ge051bWJlcj19IHJlbW92ZVRpbWVcclxuICogQHBhcmFtIHtCb29sZWFuPX0gYXV0b0VtaXRcclxuICogQHJldHVybnMge2Nsb3Vka2lkLkVtaXR0ZXJ9IGVtaXR0ZXJcclxuICovXHJcbkVtaXR0ZXIuYWRkID0gZnVuY3Rpb24ocGFyZW50LCB0ZXh0dXJlcywganNvbiwgeCwgeSwgcmVtb3ZlVGltZSwgYXV0b0VtaXQsIGRlc3Ryb3lUaW1lKVxyXG57XHJcbiAgICBpZihhdXRvRW1pdCA9PSB1bmRlZmluZWQpIGF1dG9FbWl0ID0gdHJ1ZTtcclxuICAgIGlmKGRlc3Ryb3lUaW1lID09IHVuZGVmaW5lZCkgZGVzdHJveVRpbWUgPSAxO1xyXG5cclxuICAgIHggPSB4IHx8IDA7XHJcbiAgICB5ID0geSB8fCAwO1xyXG5cclxuICAgIHZhciBhc3NldE1hbmFnZXIgPSBwMy5Bc3NldE1hbmFnZXIuaW5zdGFuY2U7XHJcblxyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRleHR1cmVzLmxlbmd0aDsgaSsrKVxyXG4gICAge1xyXG4gICAgICAgIHRleHR1cmVzW2ldID0gYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUodGV4dHVyZXNbaV0pO1xyXG4gICAgfSAgICBcclxuXHJcbiAgICB2YXIgZW1pdHRlciA9IG5ldyBjbG91ZGtpZC5FbWl0dGVyKFxyXG4gICAgICAgIHBhcmVudCxcclxuICAgICAgICB0ZXh0dXJlcyxcclxuICAgICAgICBhc3NldE1hbmFnZXIuZ2V0SlNPTihqc29uKVxyXG4gICAgKTtcclxuICAgIGlmKGF1dG9FbWl0KVxyXG4gICAgICAgIGVtaXR0ZXIuZW1pdCA9IHRydWU7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgZW1pdHRlci5lbWl0ID0gZmFsc2U7XHJcblxyXG4gICAgZW1pdHRlci51cGRhdGVPd25lclBvcyh4LCB5KTtcclxuXHJcbiAgICBDb21tb24uYW5pbWF0b3IuYWRkKGVtaXR0ZXIpO1xyXG5cclxuICAgIGlmKHJlbW92ZVRpbWUgIT0gbnVsbClcclxuICAgIHsgICAgXHJcbiAgICAgICAgQ29tbW9uLmFuaW1hdG9yLnNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgRW1pdHRlci5kZXN0cm95KGVtaXR0ZXIsIGRlc3Ryb3lUaW1lKTtcclxuICAgICAgICB9LCByZW1vdmVUaW1lLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZW1pdHRlcjtcclxufTtcclxuXHJcbkVtaXR0ZXIuZGVzdHJveSA9IGZ1bmN0aW9uKGVtaXR0ZXIsIGRlc3Ryb3lEZWxheSlcclxue1xyXG4gICAgaWYoZW1pdHRlciAhPSBudWxsKVxyXG4gICAgeyAgICBcclxuICAgICAgICBkZXN0cm95RGVsYXkgPSBkZXN0cm95RGVsYXkgfHwgMDtcclxuXHJcbiAgICAgICAgZW1pdHRlci5lbWl0ID0gZmFsc2U7XHJcbiAgICAgICAgQ29tbW9uLmFuaW1hdG9yLnNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgQ29tbW9uLmFuaW1hdG9yLnJlbW92ZShlbWl0dGVyKTtcclxuICAgICAgICAgICAgZW1pdHRlci5kZXN0cm95KCk7XHJcbiAgICAgICAgfSwgZGVzdHJveURlbGF5LCB0aGlzKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUFJJVkFURSBNRVRIT0RTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBFVkVOVFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEdFVFRFUlMvU0VUVEVSU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0iLCIvKipcbiAqICBUd2VlblxuICpcbiAqICBDcmVhdGVkIGJ5IExlZ21hbiBvbiAxMS8wNi8yMDE1LlxuICpcbiAqL1xuXG52YXIgQ29tbW9uICAgICAgICAgID0gcmVxdWlyZShcIi4uL0NvbW1vblwiKTtcblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIENPTlNUUlVDVE9SXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBTb3VuZFNGWCgpIHtcbn1cbm1vZHVsZS5leHBvcnRzID0gU291bmRTRlg7XG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBQVUJMSUMgTUVUSE9EU1xuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLyoqXG4gKiBAcGFyYW0geyFwMy5CdXR0b259IGJ1dHRvblxuICogQHBhcmFtIHtCb29sZWFuPX0gZW5hYmxlQ2xpY2tTb3VuZFxuICogQHBhcmFtIHtCb29sZWFuPX0gZW5hYmxlT3ZlclNvdW5kXG4gKi9cblNvdW5kU0ZYLmJ1dHRvbiA9IGZ1bmN0aW9uKGJ1dHRvbiwgZW5hYmxlQ2xpY2tTb3VuZCwgZW5hYmxlT3ZlclNvdW5kKSB7XG4gICAgZW5hYmxlQ2xpY2tTb3VuZCA9IGVuYWJsZUNsaWNrU291bmQgPT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGVuYWJsZUNsaWNrU291bmQ7XG4gICAgZW5hYmxlT3ZlclNvdW5kID0gZW5hYmxlT3ZlclNvdW5kID09IHVuZGVmaW5lZCA/IHRydWUgOiBlbmFibGVPdmVyU291bmQ7XG5cbiAgICBpZihlbmFibGVDbGlja1NvdW5kKVxuICAgIHsgICAgXG4gICAgICAgIGJ1dHRvbi5zaWduYWxzLmNsaWNrLmFkZChmdW5jdGlvbihidXR0b24pIHtcbiAgICAgICAgICAgIHAzLkF1ZGlvTWFuYWdlci5pbnN0YW5jZS5wbGF5U291bmQoXCJzZnhfYnRuX3ByZXNzX3JldmVyYlwiKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgaWYoZW5hYmxlT3ZlclNvdW5kKVxuICAgIHsgICAgXG4gICAgICAgIGJ1dHRvbi5zaWduYWxzLm92ZXIuYWRkKGZ1bmN0aW9uKGJ1dHRvbikge1xuICAgICAgICAgICAgcDMuQXVkaW9NYW5hZ2VyLmluc3RhbmNlLnBsYXlTb3VuZChcInNmeF9idG5fcm9sbG92ZXJfcmV2ZXJiXCIpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7IVN0cmluZ30gc291bmRcbiAqIEBwYXJhbSB7T2JqZWN0PX0gcGFyYW1zXG4gKiBAcGFyYW0ge051bWJlcj19IGRlbGF5XG4gKi9cblNvdW5kU0ZYLnBsYXkgPSBmdW5jdGlvbihzb3VuZCwgcGFyYW1zLCBkZWxheSkge1xuXG4gICAgaWYoZGVsYXkgPT0gbnVsbClcbiAgICB7ICAgIFxuICAgICAgICByZXR1cm4gcDMuQXVkaW9NYW5hZ2VyLmluc3RhbmNlLnBsYXlTb3VuZChzb3VuZCwgcGFyYW1zKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHsgICAgXG4gICAgICAgIENvbW1vbi5hbmltYXRvci5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBwMy5BdWRpb01hbmFnZXIuaW5zdGFuY2UucGxheVNvdW5kKHNvdW5kLCBwYXJhbXMpO1xuICAgICAgICB9LCBkZWxheSwgdGhpcyk7XG4gICAgfVxufTtcblxuU291bmRTRlgucGxheU11c2ljID0gZnVuY3Rpb24oc291bmQsIHBhcmFtcywgZGVsYXkpIHtcblxuICAgIGlmKGRlbGF5ID09IG51bGwpXG4gICAgeyAgICBcbiAgICAgICAgcDMuQXVkaW9NYW5hZ2VyLmluc3RhbmNlLnBsYXlNdXNpYyhzb3VuZCwgcGFyYW1zKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHsgICAgXG4gICAgICAgIENvbW1vbi5hbmltYXRvci5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBwMy5BdWRpb01hbmFnZXIuaW5zdGFuY2UucGxheU11c2ljKHNvdW5kLCBwYXJhbXMpO1xuICAgICAgICB9LCBkZWxheSwgdGhpcyk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBAcGFyYW0geyFTdHJpbmd9IHNvdW5kXG4gKi9cblNvdW5kU0ZYLnN0b3AgPSBmdW5jdGlvbihzb3VuZCkge1xuICAgIHZhciBjdXJyZW50U291bmRzID0gcDMuQXVkaW9NYW5hZ2VyLmluc3RhbmNlLnNvdW5kc1NGWDtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgY3VycmVudFNvdW5kcy5sZW5ndGg7IGkrKylcbiAgICB7XG4gICAgICAgIGlmKGN1cnJlbnRTb3VuZHNbaV0ubmFtZSA9PSBzb3VuZClcbiAgICAgICAge1xuICAgICAgICAgICBwMy5BdWRpb01hbmFnZXIuaW5zdGFuY2Uuc3RvcFNvdW5kKHNvdW5kKTtcbiAgICAgICAgfSAgIFxuICAgIH1cbn07XG5cbi8qKlxuICogQHBhcmFtIHshQXJyYXkgPFN0cmluZz59IHNvdW5kc1xuICovXG5Tb3VuZFNGWC5wbGF5UmFuZG9tRnJvbSA9IGZ1bmN0aW9uKHNvdW5kcykge1xuXHRwMy5BdWRpb01hbmFnZXIuaW5zdGFuY2UucGxheVNvdW5kKHNvdW5kc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqc291bmRzLmxlbmd0aCldKTtcbn07XG5cblNvdW5kU0ZYLmlzU291bmRQbGF5aW5nID0gZnVuY3Rpb24oc291bmQpXG57XG4gICAgdmFyIGN1cnJlbnRTb3VuZHMgPSBwMy5BdWRpb01hbmFnZXIuaW5zdGFuY2Uuc291bmRzU0ZYO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjdXJyZW50U291bmRzLmxlbmd0aDsgaSsrKVxuICAgIHtcbiAgICAgICAgaWYoY3VycmVudFNvdW5kc1tpXS5uYW1lID09IHNvdW5kKVxuICAgICAgICB7XG4gICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9ICAgXG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cblNvdW5kU0ZYLnN0b3BBbGxWTyA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgY3VycmVudFNvdW5kcyA9IHAzLkF1ZGlvTWFuYWdlci5pbnN0YW5jZS5zb3VuZHNTRlg7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGN1cnJlbnRTb3VuZHMubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgICBpZihjdXJyZW50U291bmRzW2ldLm5hbWUuaW5kZXhPZihcInZvX1wiKSA+IC0xKVxuICAgICAgICB7XG4gICAgICAgICAgIHAzLkF1ZGlvTWFuYWdlci5pbnN0YW5jZS5zdG9wU291bmQoY3VycmVudFNvdW5kc1tpXS5uYW1lKTtcbiAgICAgICAgfSAgIFxuICAgIH1cbn1cblxuXG5cblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFBSSVZBVEUgTUVUSE9EU1xuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEVWRU5UU1xuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEdFVFRFUlMvU0VUVEVSU1xuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuIiwiLyoqXG4gKiAgU2NlbmVcbiAqXG4gKiAgQ3JlYXRlZCBieSBMZWdtYW4gb24gNC8wOS8yMDE1LlxuICpcbiAqL1xuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBTY2VuZSgpIHtcbiAgICB0aGlzLnNpZ25hbHMgICAgICAgICAgICA9IHt9O1xuICAgIHRoaXMuc2lnbmFscy5uZXh0ICAgICAgID0gbmV3IHNpZ25hbHMuU2lnbmFsKCk7XG4gICAgdGhpcy5zaWduYWxzLnByZXZpb3VzICAgPSBuZXcgc2lnbmFscy5TaWduYWwoKTtcbiAgICB0aGlzLnNpZ25hbHMuaG9tZSAgICAgICA9IG5ldyBzaWduYWxzLlNpZ25hbCgpO1xuICAgIHRoaXMuc2lnbmFscy5wYXVzZSAgICAgID0gbmV3IHNpZ25hbHMuU2lnbmFsKCk7XG5cbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxubW9kdWxlLmV4cG9ydHMgICAgICAgICAgICAgICAgICA9IFNjZW5lO1xuU2NlbmUucHJvdG90eXBlICAgICAgICAgICAgICAgICA9IE9iamVjdC5jcmVhdGUoUElYSS5Db250YWluZXIucHJvdG90eXBlKTtcblNjZW5lLnByb3RvdHlwZS5jb25zdHJ1Y3RvciAgICAgPSBTY2VuZTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgd2hlbiBhIHNjZW5lIGlzIGluaXRpYWxpemVkLlxuICovXG5TY2VuZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIG92ZXJyaWRlXG59O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCB3aGVuIGEgc2NlbmUgaXMgZGVzdHJveWVkLlxuICovXG5TY2VuZS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2lnbmFscy5uZXh0LmRpc3Bvc2UoKTtcbiAgICB0aGlzLnNpZ25hbHMucHJldmlvdXMuZGlzcG9zZSgpO1xuICAgIHRoaXMuc2lnbmFscy5ob21lLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnNpZ25hbHMucGF1c2UuZGlzcG9zZSgpO1xuXG4gICAgdGhpcy5yZW1vdmVDaGlsZHJlbigpO1xufTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgd2hlbiB0aGUgZGV2aWNlIGRpbWVuc2lvbnMgYXJlIGNoYW5nZWQuXG4gKi9cblNjZW5lLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBvdmVycmlkZVxufTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgd2hlbiB0aGUgc2NlbmUgaXMgJ3RvcCcgb2YgdGhlIHN0YWNrLlxuICovXG5TY2VuZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gb3ZlcnJpZGVcbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIHdoZW4gdGhlIHNjZW5lIGlzIHNob3duIGZvciB0aGUgZmlyc3QgdGltZS5cbiAqL1xuU2NlbmUucHJvdG90eXBlLmFwcGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYW5pbWF0ZUluKCk7XG59O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCB3aGVuIHRoZSBzY2VuZSBpcyBzaG93biAtIHJlZ2FyZGxlc3Mgb2YgYWN0dWFsIHZpc2liaWxpdHkuXG4gKi9cblNjZW5lLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hbmltYXRlSW4oKTtcbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIHdoZW4gdGhlIHNjZW5lIGlzIGhpZGRlbiAtIHJlZ2FyZGxlc3Mgb2YgYWN0dWFsIHZpc2liaWxpdHkuXG4gKi9cblNjZW5lLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gb3ZlcnJpZGVcbn07XG5cbi8qKlxuICogQHBhcmFtIHtGdW5jdGlvbj19IGNhbGxiYWNrXG4gKiBAcGFyYW0geyo9fSBzY29wZVxuICovXG5TY2VuZS5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oY2FsbGJhY2ssIHNjb3BlKSB7XG4gICAgc2NvcGUgPSBzY29wZSB8fCB3aW5kb3c7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoc2NvcGUpO1xuICAgIH1cbn07XG5cbi8qKlxuICogQHBhcmFtIHshRnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcGFyYW0geyo9fSBzY29wZVxuICovXG5TY2VuZS5wcm90b3R5cGUuYW5pbWF0ZU91dCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBzY29wZSkge1xuICAgIHNjb3BlID0gc2NvcGUgfHwgd2luZG93O1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHNjb3BlKTtcbiAgICB9XG59OyIsIi8qKlxuICogIFNjZW5lTWFuYWdlclxuICpcbiAqICBDcmVhdGVkIGJ5IExlZ21hbiBvbiA0LzA5LzIwMTUuXG4gKlxuICovXG5cbnZhciBTY2VuZSAgICAgICA9IHJlcXVpcmUoXCIuL1NjZW5lXCIpO1xudmFyIFRyYW5zaXRpb24gID0gcmVxdWlyZShcIi4vVHJhbnNpdGlvblwiKTtcblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gU2NlbmVNYW5hZ2VyKCkge1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtQSVhJLkRpc3BsYXlPYmplY3R9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9zdGFnZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7UElYSS5DYW52YXNSZW5kZXJlciB8IFBJWEkuV2ViR0xSZW5kZXJlcn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX3JlbmRlcmVyID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtBcnJheS48U2NlbmU+fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fc3RhY2sgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtUcmFuc2l0aW9ufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fdHJhbnNpdGlvbiA9IG51bGw7XG59XG5tb2R1bGUuZXhwb3J0cyA9IFNjZW5lTWFuYWdlcjtcblxuLyoqXG4gKiBAcGFyYW0geyFQSVhJLkRpc3BsYXlPYmplY3R9IHN0YWdlXG4gKiBAcGFyYW0geyFQSVhJLkNhbnZhc1JlbmRlcmVyIHwgIVBJWEkuV2ViR0xSZW5kZXJlcn0gcmVuZGVyZXJcbiAqL1xuU2NlbmVNYW5hZ2VyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oc3RhZ2UsIHJlbmRlcmVyKSB7XG4gICAgdGhpcy5fc3RhZ2UgICAgICAgICA9IHN0YWdlO1xuICAgIHRoaXMuX3JlbmRlcmVyICAgICAgPSByZW5kZXJlcjtcbn07XG5cbi8qKlxuICovXG5TY2VuZU1hbmFnZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLl9zdGFjay5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy50b3AudXBkYXRlKCk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBAcGFyYW0geyFTY2VuZX0gc2NlbmVcbiAqIEBwYXJhbSB7VHJhbnNpdGlvbj19IHRyYW5zaXRpb25cbiAqL1xuU2NlbmVNYW5hZ2VyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihzY2VuZSwgdHJhbnNpdGlvbikge1xuICAgIGlmICh0aGlzLnRyYW5zaXRpb25JblByb2dyZXNzKSByZXR1cm47XG5cbiAgICB0aGlzLl90cmFuc2l0aW9uID0gdHJhbnNpdGlvbiB8fCBuZXcgVHJhbnNpdGlvbigpO1xuICAgIGlmICh0aGlzLl90cmFuc2l0aW9uLnJlcXVpcmVzV2ViR0wgJiYgISh0aGlzLl9yZW5kZXJlciBpbnN0YW5jZW9mIFBJWEkuV2ViR0xSZW5kZXJlcikpIHtcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbiAgICAgICAgICAgID0gdHJhbnNpdGlvbi5mYWxsYmFjaygpO1xuICAgICAgICB0aGlzLl90cmFuc2l0aW9uLnB1c2ggICAgICAgPSB0cmFuc2l0aW9uLnB1c2g7XG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb24ucmVwbGFjZSAgICA9IHRyYW5zaXRpb24ucmVwbGFjZTtcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbi53YWl0ICAgICAgID0gdHJhbnNpdGlvbi53YWl0O1xuICAgIH1cbiAgICB0aGlzLl90cmFuc2l0aW9uLmluaXQoKTtcbiAgICB0aGlzLl9zdGFnZS5hZGRDaGlsZCh0aGlzLl90cmFuc2l0aW9uKTtcblxuICAgIHRoaXMuX3RyYW5zaXRpb24uc2lnbmFscy5pbi5hZGRPbmNlKGZ1bmN0aW9uKHRyYW5zaXRpb24pIHtcbiAgICAgICAgcDMuVGltZXN0ZXAucXVldWVDYWxsKHN3YXAsIFtzY2VuZV0sIHRoaXMpO1xuICAgIH0sIHRoaXMpO1xuICAgIHRoaXMuX3RyYW5zaXRpb24uc2lnbmFscy5vdXQuYWRkT25jZShmdW5jdGlvbih0cmFuc2l0aW9uKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb24gPSBudWxsO1xuXG4gICAgICAgIHRyYW5zaXRpb24ucGFyZW50LnJlbW92ZUNoaWxkKHRyYW5zaXRpb24pO1xuICAgICAgICB0cmFuc2l0aW9uLmRpc3Bvc2UoKTtcblxuICAgICAgICBpZiAodHJhbnNpdGlvbi53YWl0KSB7XG4gICAgICAgICAgICBwMy5UaW1lc3RlcC5xdWV1ZUNhbGwoc2NlbmUuYXBwZWFyLCBudWxsLCBzY2VuZSk7XG4gICAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgICB0aGlzLl90cmFuc2l0aW9uLmluKCk7XG5cbiAgICBmdW5jdGlvbiBzd2FwKHNjZW5lKSB7XG4gICAgICAgIGlmICh0aGlzLnRvcCkge1xuICAgICAgICAgICAgdGhpcy50b3AuaGlkZSgpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl90cmFuc2l0aW9uLnB1c2gpIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy50b3ApIHtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvcC5wYXJlbnQgJiYgdGhpcy50b3AucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMudG9wKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3AuZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3RyYW5zaXRpb24ucmVwbGFjZSkge1xuICAgICAgICAgICAgICAgIHZhciB0ZW1wO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc3RhY2subGVuZ3RoOyArKyBpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAgPSB0aGlzLl9zdGFja1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlbXAucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wLnBhcmVudC5yZW1vdmVDaGlsZCh0ZW1wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNjZW5lLmluaXQoKTtcbiAgICAgICAgc2NlbmUucmVzaXplKCk7XG4gICAgICAgIGlmICghc2NlbmUucGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLnN0YWdlLmFkZENoaWxkQXQoc2NlbmUsIHRoaXMuX3RyYW5zaXRpb24ucGFyZW50LmdldENoaWxkSW5kZXgodGhpcy5fdHJhbnNpdGlvbikpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N0YWNrLnB1c2goc2NlbmUpO1xuXG4gICAgICAgIGlmICghdGhpcy5fdHJhbnNpdGlvbi53YWl0KSB7XG4gICAgICAgICAgICBwMy5UaW1lc3RlcC5xdWV1ZUNhbGwoc2NlbmUuYXBwZWFyLCBudWxsLCBzY2VuZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbi5vdXQoKTtcblxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl9zdGFjayk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBAcGFyYW0ge1RyYW5zaXRpb249fSB0cmFuc2l0aW9uXG4gKiBAcGFyYW0ge051bWJlcj19IGNvdW50XG4gKi9cblNjZW5lTWFuYWdlci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24odHJhbnNpdGlvbiwgY291bnQpIHtcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uSW5Qcm9ncmVzcykgcmV0dXJuO1xuXG4gICAgdGhpcy5fdHJhbnNpdGlvbiAgICA9IHRyYW5zaXRpb24gfHwgbmV3IFRyYW5zaXRpb24oKTtcbiAgICBjb3VudCAgICAgICAgICAgICAgID0gTWF0aC5tYXgoMSwgY291bnQpIHx8IDE7XG4gICAgaWYgKHRoaXMuX3RyYW5zaXRpb24ucmVxdWlyZXNXZWJHTCAmJiAhKHRoaXMuX3JlbmRlcmVyIGluc3RhbmNlb2YgUElYSS5XZWJHTFJlbmRlcmVyKSkge1xuICAgICAgICB0aGlzLl90cmFuc2l0aW9uICAgICAgICAgICAgPSB0cmFuc2l0aW9uLmZhbGxiYWNrKCk7XG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb24ucHVzaCAgICAgICA9IHRyYW5zaXRpb24ucHVzaDtcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbi5yZXBsYWNlICAgID0gdHJhbnNpdGlvbi5yZXBsYWNlO1xuICAgICAgICB0aGlzLl90cmFuc2l0aW9uLndhaXQgICAgICAgPSB0cmFuc2l0aW9uLndhaXQ7XG4gICAgfVxuICAgIHRoaXMuX3RyYW5zaXRpb24uaW5pdCgpO1xuICAgIHRoaXMuX3N0YWdlLmFkZENoaWxkKHRoaXMuX3RyYW5zaXRpb24pO1xuXG4gICAgdGhpcy5fdHJhbnNpdGlvbi5zaWduYWxzLmluLmFkZE9uY2UoZnVuY3Rpb24odHJhbnNpdGlvbikge1xuICAgICAgICBwMy5UaW1lc3RlcC5xdWV1ZUNhbGwoc3dhcCwgW2NvdW50XSwgdGhpcyk7XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5fdHJhbnNpdGlvbi5zaWduYWxzLm91dC5hZGRPbmNlKGZ1bmN0aW9uKHRyYW5zaXRpb24pIHtcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbiA9IG51bGw7XG5cbiAgICAgICAgdHJhbnNpdGlvbi5wYXJlbnQucmVtb3ZlQ2hpbGQodHJhbnNpdGlvbik7XG4gICAgICAgIHRyYW5zaXRpb24uZGlzcG9zZSgpO1xuXG4gICAgICAgIGlmICh0cmFuc2l0aW9uLndhaXQpIHtcbiAgICAgICAgICAgIHRoaXMudG9wLnNob3coKTtcbiAgICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICAgIHRoaXMuX3RyYW5zaXRpb24uaW4oKTtcblxuICAgIGZ1bmN0aW9uIHN3YXAoY291bnQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgKysgaSkge1xuICAgICAgICAgICAgdGhpcy50b3AuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy50b3AucGFyZW50ICYmIHRoaXMudG9wLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLnRvcCk7XG4gICAgICAgICAgICB0aGlzLnRvcC5kaXNwb3NlKCk7XG4gICAgICAgICAgICB0aGlzLl9zdGFjay5wb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzY2VuZSA9IHRoaXMudG9wO1xuICAgICAgICBzY2VuZS5yZXNpemUoKTtcbiAgICAgICAgaWYgKCFzY2VuZS5wYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhZ2UuYWRkQ2hpbGRBdChzY2VuZSwgdGhpcy5fdHJhbnNpdGlvbi5wYXJlbnQuZ2V0Q2hpbGRJbmRleCh0aGlzLl90cmFuc2l0aW9uKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX3RyYW5zaXRpb24ud2FpdCkge1xuICAgICAgICAgICAgc2NlbmUuc2hvdygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb24ub3V0KCk7XG5cbiAgICAgICAgY29uc29sZS5sb2codGhpcy5fc3RhY2spO1xuICAgIH1cbn07XG5cbi8qKlxuICovXG5TY2VuZU1hbmFnZXIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG59O1xuXG4vKipcbiAqL1xuU2NlbmVNYW5hZ2VyLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2NlbmU7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zdGFjay5sZW5ndGg7ICsrIGkpIHtcbiAgICAgICAgc2NlbmUgPSB0aGlzLl9zdGFja1tpXTtcbiAgICAgICAgc2NlbmUucmVzaXplKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLl90cmFuc2l0aW9uKSB7XG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb24ucmVzaXplKCk7XG4gICAgfVxufTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFNjZW5lTWFuYWdlci5wcm90b3R5cGUsIFwic3RhZ2VcIiwge1xuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtQSVhJLkRpc3BsYXlPYmplY3R9XG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YWdlO1xuICAgIH1cbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoU2NlbmVNYW5hZ2VyLnByb3RvdHlwZSwgXCJ0b3BcIiwge1xuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtTY2VuZX1cbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RhY2subGVuZ3RoID8gdGhpcy5fc3RhY2tbdGhpcy5fc3RhY2subGVuZ3RoIC0gMV0gOiBudWxsO1xuICAgIH1cbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoU2NlbmVNYW5hZ2VyLnByb3RvdHlwZSwgXCJ0cmFuc2l0aW9uSW5Qcm9ncmVzc1wiLCB7XG4gICAgLyoqXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl90cmFuc2l0aW9uICE9IG51bGwgPyB0cnVlIDogZmFsc2UpO1xuICAgIH1cbn0pO1xuIiwiLyoqXG4gKiAgVHJhbnNpdGlvblxuICpcbiAqICBDcmVhdGVkIGJ5IExlZ21hbiBvbiA0LzA5LzIwMTUuXG4gKlxuICovXG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFRyYW5zaXRpb24oKSB7XG4gICAgLyoqXG4gICAgICogQHR5cGUgeyp9XG4gICAgICovXG4gICAgdGhpcy5zaWduYWxzICAgICAgICA9IHt9O1xuICAgIHRoaXMuc2lnbmFscy5pbiAgICAgPSBuZXcgc2lnbmFscy5TaWduYWwoKTtcbiAgICB0aGlzLnNpZ25hbHMub3V0ICAgID0gbmV3IHNpZ25hbHMuU2lnbmFsKCk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLnB1c2ggPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqL1xuICAgIHRoaXMucmVwbGFjZSA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLndhaXQgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5yZXF1aXJlc1dlYkdMID0gZmFsc2U7XG5cbiAgICBQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xufVxubW9kdWxlLmV4cG9ydHMgICAgICAgICAgICAgICAgICAgICAgPSBUcmFuc2l0aW9uO1xuVHJhbnNpdGlvbi5wcm90b3R5cGUgICAgICAgICAgICAgICAgPSBPYmplY3QuY3JlYXRlKFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZSk7XG5UcmFuc2l0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciAgICA9IFRyYW5zaXRpb247XG5cblRyYW5zaXRpb24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBvdmVycmlkZVxufTtcblxuVHJhbnNpdGlvbi5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2lnbmFscy5pbi5kaXNwb3NlKCk7XG4gICAgdGhpcy5zaWduYWxzLm91dC5kaXNwb3NlKCk7XG5cbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKCk7XG59O1xuXG5UcmFuc2l0aW9uLnByb3RvdHlwZS5pbiA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2lnbmFscy5pbi5kaXNwYXRjaCh0aGlzKTtcbn07XG5cblRyYW5zaXRpb24ucHJvdG90eXBlLm91dCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2lnbmFscy5vdXQuZGlzcGF0Y2godGhpcyk7XG59O1xuXG4vKipcbiAqIEByZXR1cm5zIHtUcmFuc2l0aW9ufVxuICovXG5UcmFuc2l0aW9uLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBvdmVycmlkZVxufTtcblxuVHJhbnNpdGlvbi5wcm90b3R5cGUuZmFsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBvdmVycmlkZVxufTsiLCJcclxudmFyIENvbW1vbiAgICAgICAgICBcdFx0PSByZXF1aXJlKFwiLi4vQ29tbW9uXCIpO1xyXG52YXIgU2ltcGxlU2NyZWVuICAgICAgICAgICAgPSByZXF1aXJlKFwiLi4vc2NyZWVucy9TaW1wbGVTY3JlZW5cIik7XHJcbnZhciBTb3VuZFNGWCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9nZW5lcmFsL1NvdW5kU0ZYXCIpO1xyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gQ09OU1RSVUNUT1JcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIFBhdXNlT3ZlcmxheSgpXHJcbntcclxuICAgIHRoaXMuX292ZXJsYXkgICAgICAgICAgICAgID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLl9wYW5lbCAgICAgICAgICAgICAgICA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5fcmVzdW1lQnV0dG9uICAgICAgICAgPSBudWxsO1xyXG4gICAgdGhpcy5faGVscEJ1dHRvbiAgICAgICAgICAgPSBudWxsO1xyXG4gICAgdGhpcy5fZXhpdEJ1dHRvbiAgICAgICAgICAgPSBudWxsO1xyXG4gICAgdGhpcy5fbGVmdEJ1dHRvbiAgICAgICAgICAgPSBudWxsO1xyXG4gICAgdGhpcy5fcmlnaHRCdXR0b24gICAgICAgICAgPSBudWxsO1xyXG5cclxuICAgIHRoaXMuX3RpdGxlICAgICAgICAgICAgICAgID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLl9pbnN0cnVjdGlvbnNQYWdlICAgICA9IG51bGw7XHJcbiAgICB0aGlzLl9hcmVZb3VTdXJlUGFnZSAgICAgICA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5fY29udGVudHMgICAgICAgICAgICAgPSBudWxsO1xyXG4gICAgdGhpcy5faW1hZ2VDb250YWluZXIgICAgICAgPSBudWxsO1xyXG4gICAgdGhpcy5fY3VycmVudFBhZ2UgICAgICAgICAgPSAwO1xyXG5cclxuICAgIHRoaXMuX2ludHJvSGVscE1vZGUgICAgICAgID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5fdGV4dCAgICAgICAgICAgICAgICAgPSBudWxsO1xyXG4gICAgdGhpcy5fbGl2ZVRleHQgICAgICAgICAgICAgPSBmYWxzZTtcclxuXHJcbiAgICBTaW1wbGVTY3JlZW4uY2FsbCh0aGlzKTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhdXNlT3ZlcmxheTtcclxuUGF1c2VPdmVybGF5LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU2ltcGxlU2NyZWVuLnByb3RvdHlwZSk7XHJcblBhdXNlT3ZlcmxheS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQYXVzZU92ZXJsYXk7XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUFVCTElDIE1FVEhPRFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKi9cclxuUGF1c2VPdmVybGF5LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICBjb25zb2xlLmxvZyhcIlBBVVNFIElOSVRJQUxJWkVEXCIpO1xyXG5cclxuICAgIFNpbXBsZVNjcmVlbi5wcm90b3R5cGUuaW5pdC5jYWxsKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuX292ZXJsYXkgPSBuZXcgUElYSS5TcHJpdGUoQ29tbW9uLmdlbmVyYXRlZFRleHR1cmVzWydibGFja1NxdWFyZSddKTtcclxuICAgIHRoaXMuX292ZXJsYXkuYWxwaGEgPSAwLjc7XHJcbiAgICB0aGlzLl9vdmVybGF5LndpZHRoID0gQ29tbW9uLlNUQUdFX1dJRFRIO1xyXG4gICAgdGhpcy5fb3ZlcmxheS5oZWlnaHQgPSBDb21tb24uU1RBR0VfSEVJR0hUO1xyXG4gICAgdGhpcy5fb3ZlcmxheS5oaXRBcmVhID0gbmV3IFBJWEkuUmVjdGFuZ2xlKDAsIDAsIENvbW1vbi5TVEFHRV9XSURUSCwgQ29tbW9uLlNUQUdFX0hFSUdIVCk7XHJcbiAgICB0aGlzLl9vdmVybGF5LmludGVyYWN0aXZlID0gdHJ1ZTtcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fb3ZlcmxheSk7XHJcblxyXG4gICAgdGhpcy5fcGFuZWwgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJwYW5lbFwiKSk7XHJcbiAgICB0aGlzLl9wYW5lbC5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDAuNSk7XHJcbiAgICB0aGlzLl9wYW5lbC54ID0gQ29tbW9uLlNUQUdFX1dJRFRIIC8gMjtcclxuICAgIHRoaXMuX3BhbmVsLnkgPSBDb21tb24uU1RBR0VfSEVJR0hUIC8gMjtcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fcGFuZWwpO1xyXG5cclxuICAgIHRoaXMuX2FkZE11dGVCdXR0b24oKTtcclxuXHJcbiAgICB0aGlzLl9pbnN0cnVjdGlvbnNQYWdlID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuX2luc3RydWN0aW9uc1BhZ2UpO1xyXG5cclxuICAgIHRoaXMuX2FyZVlvdVN1cmVQYWdlID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XHJcbiAgICB0aGlzLl9hcmVZb3VTdXJlUGFnZS52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuX2FyZVlvdVN1cmVQYWdlKTtcclxuXHJcbiAgICB0aGlzLl9leGl0QnV0dG9uID0gbmV3IHAzLkJ1dHRvbihcclxuICAgICAgICAgICAgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfZXhpdF9kZWZcIiksXHJcbiAgICAgICAgICAgIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiYnV0X2V4aXRfb3ZlclwiKSxcclxuICAgICAgICAgICAgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfZXhpdF9wcmVzc2VkXCIpKTtcclxuICAgIHRoaXMuX2V4aXRCdXR0b24uaW5pdCgpO1xyXG4gICAgdGhpcy5fZXhpdEJ1dHRvbi55ID0gdGhpcy5fZ3VpQnV0dG9uVG9wTWFyZ2luO1xyXG4gICAgdGhpcy5fZXhpdEJ1dHRvbi5zaWduYWxzLmRvd24uYWRkKHRoaXMuZXhpdENsaWNrZWQsIHRoaXMpO1xyXG4gICAgdGhpcy5fZXhpdEJ1dHRvbi5zaWduYWxzLm92ZXIuYWRkKHRoaXMuYnV0dG9uUm9sbG92ZXIsIHRoaXMpO1xyXG4gICAgdGhpcy5faW5zdHJ1Y3Rpb25zUGFnZS5hZGRDaGlsZCh0aGlzLl9leGl0QnV0dG9uKTtcclxuXHJcbi8vSW5zdHJ1Y3Rpb25zIFBhZ2VcclxuXHJcbiAgICB2YXIgY29weSA9IHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRKU09OKFwiY29uZmlnXCIpWydjb3B5J11bXCJJTlNUUlVDVElPTlNfVElUTEVcIl1bQ29tbW9uLkNPVU5UUllfQ09ERV07XHJcbiAgICBpZighY29weS5saXZlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX3RpdGxlID0gbmV3IHAzLkJpdG1hcFRleHQoY29weS50ZXh0LCB0aGlzLl9hc3NldE1hbmFnZXIuZ2V0Rm9udEF0bGFzKFwidW5wYWNrNzBfd2hpdGV0aXRsZVwiKSwgcDMuQml0bWFwVGV4dC5BTElHTl9DRU5URVIpO1xyXG4gICAgICAgIHRoaXMuX3RpdGxlLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgICAgICB0aGlzLl90aXRsZSA9IG5ldyBQSVhJLlRleHQoY29weS50ZXh0LCB7Zm9udDogXCI1MHB4IEZyZWRGcmVkYnVyZ2VyQXJhLVJlZ3VsYXJcIiwgZmlsbDogMHhGRkZGRkYsIGFsaWduOiBcImNlbnRlclwiLCBzdHJva2U6IDB4RkZGRkZGLCBzdHJva2VUaGlja25lc3M6IDF9KTtcclxuICAgIFxyXG4gICAgdGhpcy5fdGl0bGUueCA9IENvbW1vbi5TVEFHRV9XSURUSCAvIDI7XHJcbiAgICB0aGlzLl90aXRsZS55ID0gMTM1O1xyXG4gICAgdGhpcy5faW5zdHJ1Y3Rpb25zUGFnZS5hZGRDaGlsZCh0aGlzLl90aXRsZSk7XHJcblxyXG4gICAgaWYoY29weS5saXZlKVxyXG4gICAgICAgIHRoaXMuX3RpdGxlLnggLT0gdGhpcy5fdGl0bGUud2lkdGggKiAwLjU7XHJcblxyXG4gICAgdGhpcy5fY29udGVudHMgPSBbXTtcclxuXHJcbiAgICB2YXIgZXh0ID0gXCJcIjtcclxuICAgIGlmKCFwMy5EZXZpY2UuaXNNb2JpbGUpXHJcbiAgICAgICAgZXh0ID0gXCJfUENcIjtcclxuXHJcbiAgICB2YXIgY29weSA9IHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRKU09OKFwiY29uZmlnXCIpWydjb3B5J11bXCJJTlNUUlVDVElPTlNfMVwiXVtDb21tb24uQ09VTlRSWV9DT0RFXTtcclxuICAgIHRoaXMuX2NvbnRlbnRzLnB1c2goe2ltYWdlOnRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKCd0dXRvcmlhbDEnKSwgdGV4dDpjb3B5LnRleHQsIHNjYWxlOmNvcHkuc2NhbGUsIG9mZnNldDpjb3B5Lm9mZnNldH0pO1xyXG4gICAgdmFyIGNvcHkgPSB0aGlzLl9hc3NldE1hbmFnZXIuZ2V0SlNPTihcImNvbmZpZ1wiKVsnY29weSddW1wiSU5TVFJVQ1RJT05TXzJcIiArIGV4dF1bQ29tbW9uLkNPVU5UUllfQ09ERV07XHJcbiAgICB0aGlzLl9jb250ZW50cy5wdXNoKHtpbWFnZTp0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZSgndHV0b3JpYWwyJyksIHRleHQ6Y29weS50ZXh0LCBzY2FsZTpjb3B5LnNjYWxlLCBvZmZzZXQ6Y29weS5vZmZzZXR9KTtcclxuICAgIHZhciBjb3B5ID0gdGhpcy5fYXNzZXRNYW5hZ2VyLmdldEpTT04oXCJjb25maWdcIilbJ2NvcHknXVtcIklOU1RSVUNUSU9OU18zXCIgKyBleHRdW0NvbW1vbi5DT1VOVFJZX0NPREVdO1xyXG4gICAgdGhpcy5fY29udGVudHMucHVzaCh7aW1hZ2U6dGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoJ3R1dG9yaWFsMycpLCB0ZXh0OmNvcHkudGV4dCwgc2NhbGU6Y29weS5zY2FsZSwgb2Zmc2V0OmNvcHkub2Zmc2V0fSk7XHJcblxyXG4gICAgdGhpcy5faW1hZ2VDb250YWluZXIgPSBuZXcgUElYSS5TcHJpdGUoKTtcclxuICAgIHRoaXMuX2ltYWdlQ29udGFpbmVyLnggPSBDb21tb24uU1RBR0VfV0lEVEggLyAyO1xyXG4gICAgdGhpcy5faW1hZ2VDb250YWluZXIueSA9IChDb21tb24uU1RBR0VfSEVJR0hUIC8gMikgLSAyMDtcclxuICAgIHRoaXMuX2luc3RydWN0aW9uc1BhZ2UuYWRkQ2hpbGQodGhpcy5faW1hZ2VDb250YWluZXIpO1xyXG5cclxuICAgIHRoaXMuX2ltYWdlID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMuX2NvbnRlbnRzWzBdLmltYWdlKTtcclxuICAgIHRoaXMuX2ltYWdlLmFuY2hvci54ID0gdGhpcy5faW1hZ2UuYW5jaG9yLnkgPSAwLjU7XHJcbiAgICB0aGlzLl9pbWFnZUNvbnRhaW5lci5hZGRDaGlsZCh0aGlzLl9pbWFnZSk7XHJcblxyXG4gICAgaWYoIWNvcHkubGl2ZSlcclxuICAgICAgICB0aGlzLl90ZXh0ID0gbmV3IHAzLkJpdG1hcFRleHQodGhpcy5fY29udGVudHNbMF0udGV4dCwgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldEZvbnRBdGxhcyhcInVucGFjazQwX3doaXRlXCIpLCBwMy5CaXRtYXBUZXh0LkFMSUdOX0NFTlRFUik7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5fdGV4dCA9IG5ldyBQSVhJLlRleHQodGhpcy5fY29udGVudHNbMF0udGV4dCwge2ZvbnQ6IFwiMzVweCBGcmVkRnJlZGJ1cmdlckFyYS1SZWd1bGFyXCIsIGZpbGw6IDB4RkZGRkZGLCBhbGlnbjogXCJjZW50ZXJcIiwgc3Ryb2tlOiAweEZGRkZGRiwgc3Ryb2tlVGhpY2tuZXNzOiAxfSk7XHJcblxyXG4gICAgdGhpcy5fdGV4dC54ID0gQ29tbW9uLlNUQUdFX1dJRFRIIC8gMjtcclxuICAgIHRoaXMuX3RleHQueSA9IChDb21tb24uU1RBR0VfSEVJR0hUIC8gMikgKyAxNTA7XHJcbiAgICB0aGlzLl90ZXh0LnNjYWxlID0gbmV3IFBJWEkuUG9pbnQodGhpcy5fY29udGVudHNbMF0uc2NhbGUsIHRoaXMuX2NvbnRlbnRzWzBdLnNjYWxlKTtcclxuICAgIHRoaXMuX2luc3RydWN0aW9uc1BhZ2UuYWRkQ2hpbGQodGhpcy5fdGV4dCk7XHJcblxyXG4gICAgdGhpcy5fbGl2ZVRleHQgPSBjb3B5LmxpdmU7XHJcblxyXG4gICAgaWYodGhpcy5fbGl2ZVRleHQpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fdGV4dC54IC09IHRoaXMuX3RleHQud2lkdGggKiAwLjU7XHJcbiAgICAgICAgdGhpcy5fdGV4dC54ICs9IGNvcHkub2Zmc2V0Lng7XHJcbiAgICAgICAgdGhpcy5fdGV4dC55ICs9IGNvcHkub2Zmc2V0Lnk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fbGVmdEJ1dHRvbiA9IG5ldyBwMy5CdXR0b24oXHJcbiAgICAgICAgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfYXJyb3dfZGVmXCIpLFxyXG4gICAgICAgIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiYnV0X2Fycm93X292ZXJcIiksXHJcbiAgICAgICAgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfYXJyb3dfcHJlc3NlZFwiKVxyXG4gICAgICAgICk7XHJcbiAgICB0aGlzLl9sZWZ0QnV0dG9uLmluaXQoKTtcclxuICAgIHRoaXMuX2xlZnRCdXR0b24ueSA9IENvbW1vbi5TVEFHRV9IRUlHSFQgLyAyO1xyXG4gICAgdGhpcy5fbGVmdEJ1dHRvbi54ID0gKENvbW1vbi5TVEFHRV9XSURUSCAvIDIpIC0gMzUwO1xyXG4gICAgdGhpcy5fbGVmdEJ1dHRvbi5zY2FsZS54ID0gLTE7XHJcbiAgICB0aGlzLl9sZWZ0QnV0dG9uLnNpZ25hbHMuZG93bi5hZGQodGhpcy5sZWZ0Q2xpY2tlZCwgdGhpcyk7XHJcbiAgICB0aGlzLl9sZWZ0QnV0dG9uLnNpZ25hbHMub3Zlci5hZGQodGhpcy5idXR0b25Sb2xsb3ZlciwgdGhpcyk7XHJcbiAgICB0aGlzLl9sZWZ0QnV0dG9uLmFuaW1hdGUgPSBmYWxzZTtcclxuICAgIHRoaXMuX2xlZnRCdXR0b24udmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5faW5zdHJ1Y3Rpb25zUGFnZS5hZGRDaGlsZCh0aGlzLl9sZWZ0QnV0dG9uKTtcclxuXHJcbiAgICB0aGlzLl9yaWdodEJ1dHRvbiA9IG5ldyBwMy5CdXR0b24oXHJcbiAgICAgICAgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfYXJyb3dfZGVmXCIpLFxyXG4gICAgICAgIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiYnV0X2Fycm93X292ZXJcIiksXHJcbiAgICAgICAgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfYXJyb3dfcHJlc3NlZFwiKVxyXG4gICAgICAgICk7XHJcbiAgICB0aGlzLl9yaWdodEJ1dHRvbi5pbml0KCk7XHJcbiAgICB0aGlzLl9yaWdodEJ1dHRvbi55ID0gQ29tbW9uLlNUQUdFX0hFSUdIVCAvIDI7XHJcbiAgICB0aGlzLl9yaWdodEJ1dHRvbi54ID0gKENvbW1vbi5TVEFHRV9XSURUSCAvIDIpICsgMzUwO1xyXG4gICAgdGhpcy5fcmlnaHRCdXR0b24uc2lnbmFscy5kb3duLmFkZCh0aGlzLnJpZ2h0Q2xpY2tlZCwgdGhpcyk7XHJcbiAgICB0aGlzLl9yaWdodEJ1dHRvbi5zaWduYWxzLm92ZXIuYWRkKHRoaXMuYnV0dG9uUm9sbG92ZXIsIHRoaXMpO1xyXG4gICAgdGhpcy5fcmlnaHRCdXR0b24uYW5pbWF0ZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5faW5zdHJ1Y3Rpb25zUGFnZS5hZGRDaGlsZCh0aGlzLl9yaWdodEJ1dHRvbik7XHJcblxyXG4gICAgdGhpcy5fcGxheUJ1dHRvbiA9IG5ldyBwMy5CdXR0b24oXHJcbiAgICAgICAgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfcGxheV9kZWZcIiksXHJcbiAgICAgICAgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfcGxheV9vdmVyXCIpLFxyXG4gICAgICAgIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiYnV0X3BsYXlfcHJlc3NlZFwiKVxyXG4gICAgICAgICk7XHJcbiAgICB0aGlzLl9wbGF5QnV0dG9uLmluaXQoKTtcclxuICAgIHRoaXMuX3BsYXlCdXR0b24ueCA9IChDb21tb24uU1RBR0VfV0lEVEgvMikgKyAodGhpcy5fcGFuZWwud2lkdGgvMik7XHJcbiAgICB0aGlzLl9wbGF5QnV0dG9uLnkgPSAoQ29tbW9uLlNUQUdFX0hFSUdIVC8yKSArICh0aGlzLl9wYW5lbC5oZWlnaHQvMik7XHJcbiAgICB0aGlzLl9wbGF5QnV0dG9uLnNpZ25hbHMuZG93bi5hZGQodGhpcy5yaWdodENsaWNrZWQsIHRoaXMpO1xyXG4gICAgdGhpcy5fcGxheUJ1dHRvbi5zaWduYWxzLm92ZXIuYWRkKHRoaXMuYnV0dG9uUm9sbG92ZXIsIHRoaXMpO1xyXG4gICAgdGhpcy5fcGxheUJ1dHRvbi52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB0aGlzLl9pbnN0cnVjdGlvbnNQYWdlLmFkZENoaWxkKHRoaXMuX3BsYXlCdXR0b24pO1xyXG5cclxuICAgIHRoaXMuX3Jlc3VtZUJ1dHRvbiA9IG5ldyBwMy5CdXR0b24oXHJcbiAgICAgICAgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfcGxheV9kZWZcIiksXHJcbiAgICAgICAgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfcGxheV9vdmVyXCIpLFxyXG4gICAgICAgIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiYnV0X3BsYXlfcHJlc3NlZFwiKVxyXG4gICAgICAgICk7XHJcbiAgICB0aGlzLl9yZXN1bWVCdXR0b24uaW5pdCgpO1xyXG4gICAgdGhpcy5fcmVzdW1lQnV0dG9uLnggPSAoQ29tbW9uLlNUQUdFX1dJRFRILzIpICsgKHRoaXMuX3BhbmVsLndpZHRoLzIpICsgMTA7XHJcbiAgICB0aGlzLl9yZXN1bWVCdXR0b24ueSA9IChDb21tb24uU1RBR0VfSEVJR0hULzIpICsgKHRoaXMuX3BhbmVsLmhlaWdodC8yKSArIDEwO1xyXG4gICAgdGhpcy5fcmVzdW1lQnV0dG9uLnNpZ25hbHMuZG93bi5hZGQodGhpcy5yZXN1bWVDbGlja2VkLCB0aGlzKTtcclxuICAgIHRoaXMuX3Jlc3VtZUJ1dHRvbi5zaWduYWxzLm92ZXIuYWRkKHRoaXMuYnV0dG9uUm9sbG92ZXIsIHRoaXMpO1xyXG4gICAgdGhpcy5faW5zdHJ1Y3Rpb25zUGFnZS5hZGRDaGlsZCh0aGlzLl9yZXN1bWVCdXR0b24pO1xyXG5cclxuXHJcbi8vQXJlIFlvdSBTdXJlIFBhZ2VcclxuXHJcbiAgICB2YXIgY29weSA9IHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRKU09OKFwiY29uZmlnXCIpWydjb3B5J11bXCJRVUlUXCJdW0NvbW1vbi5DT1VOVFJZX0NPREVdO1xyXG4gICAgaWYoIWNvcHkubGl2ZSlcclxuICAgICAgICB2YXIgdGV4dCA9IG5ldyBwMy5CaXRtYXBUZXh0KGNvcHkudGV4dCwgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldEZvbnRBdGxhcyhcInVucGFjazcwX3doaXRldGl0bGVcIiksIHAzLkJpdG1hcFRleHQuQUxJR05fQ0VOVEVSKTtcclxuICAgIGVsc2VcclxuICAgICAgICB2YXIgdGV4dCA9IG5ldyBQSVhJLlRleHQoY29weS50ZXh0LCB7Zm9udDogXCI1MHB4IEZyZWRGcmVkYnVyZ2VyQXJhLVJlZ3VsYXJcIiwgZmlsbDogMHhGRkZGRkYsIGFsaWduOiBcImNlbnRlclwiLCBzdHJva2U6IDB4RkZGRkZGLCBzdHJva2VUaGlja25lc3M6IDF9KTtcclxuICAgIHRleHQueCA9IChDb21tb24uU1RBR0VfV0lEVEgvMikgKyBjb3B5Lm9mZnNldC54O1xyXG4gICAgdGV4dC55ID0gKENvbW1vbi5TVEFHRV9IRUlHSFQvMiktMTUwICsgY29weS5vZmZzZXQueTtcclxuICAgIHRleHQuc2NhbGUgPSBuZXcgUElYSS5Qb2ludChjb3B5LnNjYWxlLCBjb3B5LnNjYWxlKTtcclxuICAgIHRoaXMuX2FyZVlvdVN1cmVQYWdlLmFkZENoaWxkKHRleHQpO1xyXG4gICAgaWYoY29weS5saXZlKVxyXG4gICAgICAgIHRleHQueCAtPSB0ZXh0LndpZHRoICogMC41O1xyXG5cclxuICAgIHZhciB5ZXNCdXR0b24gPSBuZXcgcDMuQnV0dG9uKFxyXG4gICAgICAgIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiYnV0X29rX2RlZlwiKSxcclxuICAgICAgICB0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShcImJ1dF9va19vdmVyXCIpLFxyXG4gICAgICAgIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiYnV0X29rX3ByZXNzZWRcIilcclxuICAgICk7XHJcbiAgICB5ZXNCdXR0b24uaW5pdCgpO1xyXG4gICAgeWVzQnV0dG9uLnggPSAoQ29tbW9uLlNUQUdFX1dJRFRILzIpLTEwMDtcclxuICAgIHllc0J1dHRvbi55ID0gKENvbW1vbi5TVEFHRV9IRUlHSFQvMikgKyA4MDtcclxuICAgIHllc0J1dHRvbi5zaWduYWxzLmRvd24uYWRkKHRoaXMucXVpdFllc0NsaWNrZWQsIHRoaXMpO1xyXG4gICAgeWVzQnV0dG9uLnNpZ25hbHMub3Zlci5hZGQodGhpcy5idXR0b25Sb2xsb3ZlciwgdGhpcyk7XHJcbiAgICB0aGlzLl9hcmVZb3VTdXJlUGFnZS5hZGRDaGlsZCh5ZXNCdXR0b24pO1xyXG5cclxuICAgIHZhciBub0J1dHRvbiA9IG5ldyBwMy5CdXR0b24oXHJcbiAgICAgICAgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfY2xvc2VfZGVmXCIpLFxyXG4gICAgICAgIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiYnV0X2Nsb3NlX292ZXJcIiksXHJcbiAgICAgICAgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfY2xvc2VfcHJlc3NlZFwiKVxyXG4gICAgKTtcclxuICAgIG5vQnV0dG9uLmluaXQoKTtcclxuICAgIG5vQnV0dG9uLnggPSAoQ29tbW9uLlNUQUdFX1dJRFRILzIpKzEwMDtcclxuICAgIG5vQnV0dG9uLnkgPSAoQ29tbW9uLlNUQUdFX0hFSUdIVC8yKSArIDgwO1xyXG4gICAgbm9CdXR0b24uc2lnbmFscy5kb3duLmFkZCh0aGlzLnF1aXROb0NsaWNrZWQsIHRoaXMpO1xyXG4gICAgbm9CdXR0b24uc2lnbmFscy5vdmVyLmFkZCh0aGlzLmJ1dHRvblJvbGxvdmVyLCB0aGlzKTtcclxuICAgIHRoaXMuX2FyZVlvdVN1cmVQYWdlLmFkZENoaWxkKG5vQnV0dG9uKTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICovXHJcblBhdXNlT3ZlcmxheS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB0aGlzLl9leGl0QnV0dG9uLnggPSB0aGlzLl9nZXRGaXJzdEJ1dHRvblBvc2l0aW9uTGVmdCgpO1xyXG4gICAgdGhpcy5fbXV0ZUJ1dHRvbi54ID0gdGhpcy5fZ2V0Rmlyc3RCdXR0b25Qb3NpdGlvblJpZ2h0KCk7XHJcbn07XHJcblxyXG4vKipcclxuICovXHJcblBhdXNlT3ZlcmxheS5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICBTaW1wbGVTY3JlZW4ucHJvdG90eXBlLnJlc2l6ZS5jYWxsKHRoaXMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5QYXVzZU92ZXJsYXkucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIFxyXG59XHJcblxyXG4vKipcclxuICovXHJcblBhdXNlT3ZlcmxheS5wcm90b3R5cGUuc2V0SW50cm9IZWxwTW9kZSA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgdGhpcy5fcmVzdW1lQnV0dG9uLnZpc2libGUgPSBmYWxzZTtcclxuICAgIHRoaXMuX2ludHJvSGVscE1vZGUgPSB0cnVlO1xyXG59XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtGdW5jdGlvbj19IGNhbGxiYWNrXHJcbiAqIEBwYXJhbSB7Kj19c2NvcGVcclxuICovXHJcblBhdXNlT3ZlcmxheS5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oY2FsbGJhY2ssIHNjb3BlKSB7XHJcbiAgICBcclxuICAgIFNpbXBsZVNjcmVlbi5wcm90b3R5cGUuYW5pbWF0ZUluLmNhbGwodGhpcyk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtGdW5jdGlvbj19IGNhbGxiYWNrXHJcbiAqIEBwYXJhbSB7Kj19IHNjb3BlXHJcbiAqL1xyXG5QYXVzZU92ZXJsYXkucHJvdG90eXBlLmFuaW1hdGVPdXQgPSBmdW5jdGlvbihjYWxsYmFjaywgc2NvcGUpIHtcclxuICAgICAgICBcclxuICAgIFNpbXBsZVNjcmVlbi5wcm90b3R5cGUuYW5pbWF0ZU91dC5jYWxsKHRoaXMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7IU51bWJlcn0gcGFnZVxyXG4gKi9cclxuUGF1c2VPdmVybGF5LnByb3RvdHlwZS5zZXRQYWdlID0gZnVuY3Rpb24ocGFnZSlcclxue1xyXG4gICAgdmFyIG5ld0ltYWdlID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMuX2NvbnRlbnRzW3BhZ2VdLmltYWdlKTtcclxuICAgIG5ld0ltYWdlLnggPSB0aGlzLl9jb250ZW50c1twYWdlXS54IHx8IDA7XHJcbiAgICBuZXdJbWFnZS55ID0gdGhpcy5fY29udGVudHNbcGFnZV0ueSB8fCAwO1xyXG4gICAgbmV3SW1hZ2UuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC41LCAwLjUpO1xyXG4gICAgbmV3SW1hZ2UuYWxwaGEgPSAwO1xyXG4gICAgdGhpcy5faW1hZ2VDb250YWluZXIuYWRkQ2hpbGQobmV3SW1hZ2UpO1xyXG5cclxuICAgIENvbW1vbi5hbmltYXRvci5hZGQoVHdlZW5NYXgudG8odGhpcy5faW1hZ2UsIC41LCB7YWxwaGE6MCwgZWFzZTpTaW5lLmVhc2VPdXR9KSk7XHJcbiAgICBDb21tb24uYW5pbWF0b3IuYWRkKFR3ZWVuTWF4LnRvKG5ld0ltYWdlLCAuNSwge2FscGhhOjEsIGVhc2U6U2luZS5lYXNlT3V0LCBvbkNvbXBsZXRlU2NvcGU6dGhpcywgb25Db21wbGV0ZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMuX2ltYWdlQ29udGFpbmVyLnJlbW92ZUNoaWxkKHRoaXMuX2ltYWdlKTtcclxuICAgICAgICB0aGlzLl9pbWFnZSA9IG5ld0ltYWdlO1xyXG4gICAgfX0pKTtcclxuXHJcbiAgICB0aGlzLl90ZXh0LnRleHQgPSB0aGlzLl9jb250ZW50c1twYWdlXS50ZXh0O1xyXG4gICAgdGhpcy5fdGV4dC5zY2FsZSA9IG5ldyBQSVhJLlBvaW50KHRoaXMuX2NvbnRlbnRzW3BhZ2VdLnNjYWxlLCB0aGlzLl9jb250ZW50c1twYWdlXS5zY2FsZSk7XHJcblxyXG4gICAgaWYodGhpcy5fbGl2ZVRleHQpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fdGV4dC54ID0gKENvbW1vbi5TVEFHRV9XSURUSCAvIDIpIC0gKHRoaXMuX3RleHQud2lkdGggKiAwLjUpO1xyXG4gICAgICAgIHRoaXMuX3RleHQueCArPSB0aGlzLl9jb250ZW50c1twYWdlXS5vZmZzZXQueDtcclxuICAgICAgICB0aGlzLl90ZXh0LnkgPSAoQ29tbW9uLlNUQUdFX0hFSUdIVCAvIDIpICsgMTUwICsgdGhpcy5fY29udGVudHNbcGFnZV0ub2Zmc2V0Lnk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICBpZihwYWdlID09IDApXHJcbiAgICAgICAgdGhpcy5fbGVmdEJ1dHRvbi52aXNpYmxlID0gZmFsc2U7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5fbGVmdEJ1dHRvbi52aXNpYmxlID0gdHJ1ZTtcclxuXHJcbiAgICBpZihwYWdlID09IHRoaXMuX2NvbnRlbnRzLmxlbmd0aC0xKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX3JpZ2h0QnV0dG9uLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICBpZih0aGlzLl9pbnRyb0hlbHBNb2RlKVxyXG4gICAgICAgICAgICB0aGlzLl9wbGF5QnV0dG9uLnZpc2libGUgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX3JpZ2h0QnV0dG9uLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIGlmKHRoaXMuX2ludHJvSGVscE1vZGUpXHJcbiAgICAgICAgICAgIHRoaXMuX3BsYXlCdXR0b24udmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2N1cnJlbnRQYWdlID0gcGFnZTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUFJJVkFURSBNRVRIT0RTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gRVZFTlRTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICovXHJcblBhdXNlT3ZlcmxheS5wcm90b3R5cGUubGVmdENsaWNrZWQgPSBmdW5jdGlvbigpXHJcbnsgICAgXHJcbiAgICB0aGlzLnNldFBhZ2UodGhpcy5fY3VycmVudFBhZ2UtMSk7XHJcbiAgICBTb3VuZFNGWC5wbGF5KCdzZnhfdWlfcHJlc3NfYnV0dG9uXzAxJyk7XHJcbn07XHJcblxyXG4vKipcclxuICovXHJcblBhdXNlT3ZlcmxheS5wcm90b3R5cGUucmlnaHRDbGlja2VkID0gZnVuY3Rpb24oKVxyXG57ICAgIFxyXG4gICAgaWYodGhpcy5fY3VycmVudFBhZ2UgPT0gdGhpcy5fY29udGVudHMubGVuZ3RoLTEpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zaWduYWxzLnJlcXVlc3RlZE5leHRTY3JlZW4uZGlzcGF0Y2goKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgICB0aGlzLnNldFBhZ2UodGhpcy5fY3VycmVudFBhZ2UrMSk7XHJcbiAgICB9XHJcbiAgICBTb3VuZFNGWC5wbGF5KCdzZnhfdWlfcHJlc3NfYnV0dG9uXzAxJyk7XHJcbn07XHJcblxyXG4vKipcclxuICovXHJcblBhdXNlT3ZlcmxheS5wcm90b3R5cGUucmVzdW1lQ2xpY2tlZCA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgcDMuVGltZXN0ZXAucXVldWVDYWxsKHRoaXMuc2lnbmFscy5yZXF1ZXN0ZWROZXh0U2NyZWVuLmRpc3BhdGNoLCBbXSwgdGhpcyk7XHJcbiAgICBTb3VuZFNGWC5wbGF5KCdzZnhfdWlfcHJlc3NwbGF5XzAwJyk7XHJcbn07XHJcblxyXG4vKipcclxuICovXHJcblBhdXNlT3ZlcmxheS5wcm90b3R5cGUuZXhpdENsaWNrZWQgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIHRoaXMuX2luc3RydWN0aW9uc1BhZ2UudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5fYXJlWW91U3VyZVBhZ2UudmlzaWJsZSA9IHRydWU7XHJcbiAgICBTb3VuZFNGWC5wbGF5KCdzZnhfdWlfcHJlc3NfYnV0dG9uXzAxJyk7ICBcclxufTtcclxuXHJcbi8qKlxyXG4gKi9cclxuUGF1c2VPdmVybGF5LnByb3RvdHlwZS5oZWxwQ2xpY2tlZCA9IGZ1bmN0aW9uKClcclxueyAgICBcclxuICAgIHRoaXMuc2hvd0hlbHAoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKi9cclxuUGF1c2VPdmVybGF5LnByb3RvdHlwZS5xdWl0WWVzQ2xpY2tlZCA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgdGhpcy5zaWduYWxzLnJlcXVlc3RlZFByZXZpb3VzU2NyZWVuLmRpc3BhdGNoKCk7XHJcbiAgICBTb3VuZFNGWC5wbGF5KCdzZnhfdWlfcHJlc3NfYnV0dG9uXzAxJyk7XHJcbn07XHJcblxyXG4vKipcclxuICovXHJcblBhdXNlT3ZlcmxheS5wcm90b3R5cGUucXVpdE5vQ2xpY2tlZCA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgdGhpcy5faW5zdHJ1Y3Rpb25zUGFnZS52aXNpYmxlID0gdHJ1ZTtcclxuICAgIHRoaXMuX2FyZVlvdVN1cmVQYWdlLnZpc2libGUgPSBmYWxzZTtcclxuICAgIFNvdW5kU0ZYLnBsYXkoJ3NmeF91aV9wcmVzc19idXR0b25fMDEnKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKi9cclxuUGF1c2VPdmVybGF5LnByb3RvdHlwZS5idXR0b25Sb2xsb3ZlciA9IGZ1bmN0aW9uKClcclxue1xyXG5cclxufVxyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEdFVFRFUlMvU0VUVEVSU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4iLCJcclxudmFyIENvbW1vbiAgICAgICAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL0NvbW1vblwiKTtcclxudmFyIFNpbXBsZVNjcmVlbiAgICAgICAgICAgID0gcmVxdWlyZShcIi4vU2ltcGxlU2NyZWVuXCIpO1xyXG52YXIgU291bmRTRlggICAgICAgICAgICAgICAgPSByZXF1aXJlKFwiLi4vZ2VuZXJhbC9Tb3VuZFNGWFwiKTtcclxudmFyIEVtaXR0ZXIgICAgICAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL2dlbmVyYWwvRW1pdHRlclwiKTtcclxudmFyIENvbGxlY3RpYmxlICAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL2dhbWUvQ29sbGVjdGlibGVcIik7XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBDT05TVFJVQ1RPUlxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLyoqXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gR2FtZU92ZXJTY3JlZW4oZGlzdGFuY2UsIGhlYXJ0cylcclxue1xyXG4gICAgdGhpcy5fZGlzdGFuY2UgICAgICA9IGRpc3RhbmNlIHx8IDEwMDAwO1xyXG4gICAgdGhpcy5faGVhcnRzICAgICAgICA9IGhlYXJ0cyB8fCA1MDtcclxuXHJcbiAgICB0aGlzLl9iZyAgICAgICAgICAgID0gbnVsbDtcclxuICAgIHRoaXMuX3BhbmVsICAgICAgICAgPSBudWxsO1xyXG4gICAgdGhpcy5fc2NvcmVUZXh0ICAgICA9IG51bGw7XHJcbiAgICB0aGlzLl90cm9waHkgICAgICAgID0gbnVsbDtcclxuICAgIHRoaXMuX2Jlc3RTY29yZVRleHQgPSBudWxsO1xyXG4gICAgdGhpcy5faGVhcnRQYXJ0aWNsZSA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5fcGxheUJ1dHRvbiAgICA9IG51bGw7XHJcbiAgICB0aGlzLl9tdXRlQnV0dG9uICAgID0gbnVsbDtcclxuICAgIHRoaXMuX2hvbWVCdXR0b24gICAgPSBudWxsO1xyXG5cclxuICAgIHRoaXMuX21vam8gICAgICAgICAgPSBudWxsO1xyXG4gICAgdGhpcy5fbW9qb1RleHQgICAgICA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5fY3VycmVudEhlYXJ0ICA9IDA7XHJcbiAgICB0aGlzLl9hZGRpbmdIZWFydHMgID0gZmFsc2U7XHJcbiAgICB0aGlzLl9oZWFydHNBZGRlZCAgID0gZmFsc2U7XHJcblxyXG4gICAgU2ltcGxlU2NyZWVuLmNhbGwodGhpcyk7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBHYW1lT3ZlclNjcmVlbjtcclxuR2FtZU92ZXJTY3JlZW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTaW1wbGVTY3JlZW4ucHJvdG90eXBlKTtcclxuR2FtZU92ZXJTY3JlZW4ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2FtZU92ZXJTY3JlZW47XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUFVCTElDIE1FVEhPRFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKi9cclxuR2FtZU92ZXJTY3JlZW4ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIGNvbnNvbGUubG9nKFwiU1BMQVNIIElOSVRJQUxJWkVEXCIpO1xyXG5cclxuICAgIFNpbXBsZVNjcmVlbi5wcm90b3R5cGUuaW5pdC5jYWxsKHRoaXMpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKHRoaXMuX2hlYXJ0cyk7XHJcblxyXG4gICAgdGhpcy5fYmcgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJiZ19ibHVlXCIpKTtcclxuICAgIHRoaXMuX2JnLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcclxuICAgIHRoaXMuX2JnLnggPSBDb21tb24uU1RBR0VfV0lEVEggLyAyO1xyXG4gICAgdGhpcy5fYmcueSA9IENvbW1vbi5TVEFHRV9IRUlHSFQgLyAyO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9iZyk7XHJcblxyXG4gICAgdGhpcy5fcGFuZWwgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoJ3BhbmVsX3Njb3JlJykpO1xyXG4gICAgdGhpcy5fcGFuZWwuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC41LCAwLjY1KTtcclxuICAgIHRoaXMuX3BhbmVsLnggPSBDb21tb24uU1RBR0VfV0lEVEggLyAyO1xyXG4gICAgdGhpcy5fcGFuZWwueSA9IENvbW1vbi5TVEFHRV9IRUlHSFQgLyAyO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9wYW5lbCk7XHJcbiAgICAvKlxyXG4gICAgdmFyIGdyZWF0Rmx5aW5nID0gbmV3IHAzLkJpdG1hcFRleHQoXCJHUkVBVCBGTFlJTkchXCIsIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRGb250QXRsYXMoXCJ1bnBhY2s5MF9waW5rXCIpLCBwMy5CaXRtYXBUZXh0LkFMSUdOX0NFTlRFUik7XHJcbiAgICBncmVhdEZseWluZy54ID0gMDtcclxuICAgIGdyZWF0Rmx5aW5nLnkgPSAtMTEwO1xyXG4gICAgdGhpcy5fcGFuZWwuYWRkQ2hpbGQoZ3JlYXRGbHlpbmcpOyovXHJcblxyXG4gICAgdmFyIGNvcHkgPSB0aGlzLl9hc3NldE1hbmFnZXIuZ2V0SlNPTihcImNvbmZpZ1wiKVsnY29weSddW1wiR1JFQVRfRkxZSU5HXCJdW0NvbW1vbi5DT1VOVFJZX0NPREVdO1xyXG4gICAgdmFyIHRleHQ7XHJcbiAgICBpZighY29weS5saXZlKVxyXG4gICAgICAgIHRleHQgPSBuZXcgcDMuQml0bWFwVGV4dChjb3B5LnRleHQsIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRGb250QXRsYXMoXCJ1bnBhY2s5MF9waW5rXCIpLCBwMy5CaXRtYXBUZXh0LkFMSUdOX0NFTlRFUik7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgdGV4dCA9IG5ldyBQSVhJLlRleHQoY29weS50ZXh0LCB7Zm9udDogXCI3MHB4IEZyZWRGcmVkYnVyZ2VyQXJhLVJlZ3VsYXJcIiwgZmlsbDogMHhlYjM0NmIsIGFsaWduOiBcImNlbnRlclwiLCBzdHJva2U6IDB4MCwgc3Ryb2tlVGhpY2tuZXNzOiA3fSk7XHJcbiAgICB0ZXh0LnggPSAwICsgY29weS5vZmZzZXQueDtcclxuICAgIHRleHQueSA9IC0xMTAgKyBjb3B5Lm9mZnNldC55O1xyXG4gICAgdGV4dC5zY2FsZS54ID0gdGV4dC5zY2FsZS55ID0gY29weS5zY2FsZTtcclxuICAgIHRoaXMuX3BhbmVsLmFkZENoaWxkKHRleHQpO1xyXG4gICAgaWYoY29weS5saXZlKVxyXG4gICAgICAgIHRleHQueCAtPSB0ZXh0LndpZHRoICogMC41O1xyXG5cclxuICAgIHRoaXMuX3Njb3JlVGV4dCA9IG5ldyBwMy5CaXRtYXBUZXh0KHRoaXMuX2Rpc3RhbmNlLnRvU3RyaW5nKCksIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRGb250QXRsYXMoXCJ1bnBhY2sxMDBfYmx1ZVwiKSwgcDMuQml0bWFwVGV4dC5BTElHTl9DRU5URVIpO1xyXG4gICAgdGhpcy5fc2NvcmVUZXh0LnggPSAwO1xyXG4gICAgdGhpcy5fc2NvcmVUZXh0LnkgPSAtMzA7XHJcbiAgICB0aGlzLl9wYW5lbC5hZGRDaGlsZCh0aGlzLl9zY29yZVRleHQpO1xyXG5cclxuICAgIHRoaXMuX3Ryb3BoeSA9IG5ldyBQSVhJLlNwcml0ZSh0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShcImljb25fdHJvcGh5XCIpKTtcclxuICAgIHRoaXMuX3Ryb3BoeS5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDAuNSk7XHJcbiAgICB0aGlzLl90cm9waHkueCA9IC02MDtcclxuICAgIHRoaXMuX3Ryb3BoeS55ID0gMTMwO1xyXG4gICAgdGhpcy5fcGFuZWwuYWRkQ2hpbGQodGhpcy5fdHJvcGh5KTtcclxuXHJcbiAgICB0aGlzLl9iZXN0U2NvcmVUZXh0ID0gbmV3IHAzLkJpdG1hcFRleHQoQ29tbW9uLnNhdmVkRGF0YS5iZXN0U2NvcmUudG9TdHJpbmcoKSwgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldEZvbnRBdGxhcyhcInVucGFjazYwX3llbGxvd1wiKSwgcDMuQml0bWFwVGV4dC5BTElHTl9MRUZUKTtcclxuICAgIHRoaXMuX2Jlc3RTY29yZVRleHQueCA9IC01O1xyXG4gICAgdGhpcy5fYmVzdFNjb3JlVGV4dC55ID0gOTU7XHJcbiAgICB0aGlzLl9iZXN0U2NvcmVUZXh0LnNjYWxlID0gbmV3IFBJWEkuUG9pbnQoMC43LCAwLjcpO1xyXG4gICAgdGhpcy5fcGFuZWwuYWRkQ2hpbGQodGhpcy5fYmVzdFNjb3JlVGV4dCk7XHJcblxyXG4gICAgdGhpcy5fcGxheUJ1dHRvbiA9IG5ldyBwMy5CdXR0b24odGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfcmVwbGF5X2RlZlwiKSwgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfcmVwbGF5X292ZXJcIiksIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiYnV0X3JlcGxheV9wcmVzc2VkXCIpKTtcclxuICAgIHRoaXMuX3BsYXlCdXR0b24ueCA9IChDb21tb24uU1RBR0VfV0lEVEggLyAyKSArIDQwMDtcclxuICAgIHRoaXMuX3BsYXlCdXR0b24ueSA9IENvbW1vbi5TVEFHRV9IRUlHSFQgLSAxMTU7XHJcbiAgICB0aGlzLl9wbGF5QnV0dG9uLnNpZ25hbHMuZG93bi5hZGRPbmNlKHRoaXMucGxheUNsaWNrZWQsIHRoaXMpO1xyXG4gICAgdGhpcy5fcGxheUJ1dHRvbi5zaWduYWxzLm92ZXIuYWRkKHRoaXMuYnV0dG9uT3ZlciwgdGhpcyk7XHJcbiAgICB0aGlzLl9wbGF5QnV0dG9uLnNjYWxlID0gbmV3IFBJWEkuUG9pbnQoMCwgMCk7XHJcbiAgICB0aGlzLl9wbGF5QnV0dG9uLmFuaW1hdGUgPSBmYWxzZTtcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fcGxheUJ1dHRvbik7XHJcblxyXG4gICAgdGhpcy5faG9tZUJ1dHRvbiA9IG5ldyBwMy5CdXR0b24odGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfaG9tZV9kZWZcIiksIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiYnV0X2hvbWVfb3ZlclwiKSwgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfaG9tZV9wcmVzc2VkXCIpKVxyXG4gICAgdGhpcy5faG9tZUJ1dHRvbi55ID0gdGhpcy5fZ3VpQnV0dG9uVG9wTWFyZ2luO1xyXG4gICAgdGhpcy5faG9tZUJ1dHRvbi5zaWduYWxzLmRvd24uYWRkT25jZSh0aGlzLmhvbWVDbGlja2VkLCB0aGlzKTtcclxuICAgIHRoaXMuX2hvbWVCdXR0b24uc2lnbmFscy5vdmVyLmFkZCh0aGlzLmJ1dHRvbk92ZXIsIHRoaXMpO1xyXG4gICAgdGhpcy5faG9tZUJ1dHRvbi5zY2FsZSA9IG5ldyBQSVhJLlBvaW50KDAsIDApOyAgICBcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5faG9tZUJ1dHRvbik7XHJcblxyXG4gICAgdGhpcy5fbW9qbyA9IG5ldyBQSVhJLlNwcml0ZSh0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShcIm1vam9qb2pvX2VuZHNjXCIpKTtcclxuICAgIHRoaXMuX21vam8uYW5jaG9yLnggPSAxO1xyXG4gICAgdGhpcy5fbW9qby54ID0gKENvbW1vbi5TVEFHRV9XSURUSC8yKSAtIDEyMDtcclxuICAgIHRoaXMuX21vam8ueSA9IENvbW1vbi5TVEFHRV9IRUlHSFQ7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuX21vam8pO1xyXG5cclxuICAgIHRoaXMuX21vam9UZXh0ID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwic3BlZWNoX2J1YmJsZVwiKSk7XHJcbiAgICB0aGlzLl9tb2pvVGV4dC5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjMsIDAuNSk7XHJcbiAgICB0aGlzLl9tb2pvVGV4dC54ID0gKENvbW1vbi5TVEFHRV9XSURUSC8yKSAtIDEwMDtcclxuICAgIHRoaXMuX21vam9UZXh0LnkgPSA2NTA7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuX21vam9UZXh0KTtcclxuXHJcbiAgICB2YXIgY29weSA9IHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRKU09OKFwiY29uZmlnXCIpWydjb3B5J11bXCJJTExfQkVfQkFDS1wiXVtDb21tb24uQ09VTlRSWV9DT0RFXTtcclxuICAgIHZhciB0ZXh0O1xyXG4gICAgaWYoIWNvcHkubGl2ZSlcclxuICAgICAgICB0ZXh0ID0gbmV3IHAzLkJpdG1hcFRleHQoY29weS50ZXh0LCB0aGlzLl9hc3NldE1hbmFnZXIuZ2V0Rm9udEF0bGFzKFwidW5wYWNrNTBfYmxhY2tcIiksIHAzLkJpdG1hcFRleHQuQUxJR05fQ0VOVEVSKTtcclxuICAgIGVsc2VcclxuICAgICAgICB0ZXh0ID0gbmV3IFBJWEkuVGV4dChjb3B5LnRleHQsIHtmb250OiBcIjQwcHggRnJlZEZyZWRidXJnZXJBcmEtUmVndWxhclwiLCBmaWxsOiAweDAwMDAwMCwgYWxpZ246IFwiY2VudGVyXCIsIHN0cm9rZTogMHgwLCBzdHJva2VUaGlja25lc3M6IDF9KTtcclxuICAgIHRleHQueCA9IDE2NSArIGNvcHkub2Zmc2V0Lng7XHJcbiAgICB0ZXh0LnkgPSAtKHRoaXMuX21vam9UZXh0LmhlaWdodCAvIDIpICsgMTAgKyBjb3B5Lm9mZnNldC55O1xyXG4gICAgdGV4dC5zY2FsZS54ID0gdGV4dC5zY2FsZS55ID0gY29weS5zY2FsZTtcclxuICAgIHRoaXMuX21vam9UZXh0LmFkZENoaWxkKHRleHQpO1xyXG4gICAgaWYoY29weS5saXZlKVxyXG4gICAgICAgIHRleHQueCAtPSB0ZXh0LndpZHRoICogMC41O1xyXG5cclxuICAgIHRoaXMuX21vam9UZXh0LnNjYWxlID0gbmV3IFBJWEkuUG9pbnQoMCwgMCk7XHJcblxyXG4gICAgdGhpcy5fYWRkTXV0ZUJ1dHRvbigpO1xyXG5cclxuICAgIC8vQ29tbW9uLmFuaW1hdG9yLnNldFRpbWVvdXQodGhpcy5hZGRIZWFydHMsIDEsIHRoaXMpO1xyXG4gICAgU291bmRTRlgucGxheSgnc2Z4X2dhbWVfZW5kXzAwJyk7XHJcbn07XHJcblxyXG4vKipcclxuICovXHJcbkdhbWVPdmVyU2NyZWVuLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIC8qXHJcbiAgICBpZih0aGlzLl9hZGRpbmdIZWFydHMpXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5fY3VycmVudEhlYXJ0IDwgdGhpcy5faGVhcnRzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VycmVudEhlYXJ0Kys7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc3RhbmNlICs9IDIwO1xyXG4gICAgICAgICAgICB0aGlzLl9zY29yZVRleHQudGV4dCA9IHRoaXMuX2Rpc3RhbmNlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FkZGluZ0hlYXJ0cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9oZWFydFBhcnRpY2xlLmVtaXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgLy9Tb3VuZFNGWC5zdG9wKCdzZnhfaGVhcnRfcGlja3VwXzAyJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGwgPSBuZXcgVGltZWxpbmVNYXgoKTtcclxuICAgICAgICAgICAgQ29tbW9uLmFuaW1hdG9yLmFkZCh0bCk7XHJcblxyXG4gICAgICAgICAgICB0bC50byh0aGlzLl9zY29yZVRleHQuc2NhbGUsIC41LCB7ZGVsYXk6LjUsIHg6MS4yLCB5OjEuMiwgZWFzZTpCYWNrLmVhc2VPdXR9KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2Rpc3RhbmNlID4gQ29tbW9uLnNhdmVkRGF0YS5iZXN0U2NvcmUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENvbW1vbi5zYXZlZERhdGEuYmVzdFNjb3JlID0gdGhpcy5fZGlzdGFuY2U7XHJcbiAgICAgICAgICAgICAgICBDb21tb24uc2F2ZWREYXRhLnNhdmUoKTtcclxuICAgICAgICAgICAgICAgIHRsLnRvKHRoaXMuX3Ryb3BoeS5zY2FsZSwgLjMsIHt4OjEuMiwgeToxLjIsIGVhc2U6U2luZS5lYXNlT3V0LCBvbkNvbXBsZXRlU2NvcGU6dGhpcywgb25Db21wbGV0ZTpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Jlc3RTY29yZVRleHQudGV4dCA9IENvbW1vbi5zYXZlZERhdGEuYmVzdFNjb3JlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9fSk7IFxyXG4gICAgICAgICAgICAgICAgdGwudG8odGhpcy5fdHJvcGh5LnNjYWxlLCAxLCB7eDoxLCB5OjEsIGVhc2U6RWxhc3RpYy5lYXNlT3V0fSk7IFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0bC50byh0aGlzLl9tb2pvLCAuMywge3k6Q29tbW9uLlNUQUdFX0hFSUdIVCAtIHRoaXMuX21vam8uaGVpZ2h0LCBlYXNlOkV4cG8uZWFzZU91dH0pO1xyXG4gICAgICAgICAgICB0bC50byh0aGlzLl9tb2pvVGV4dC5zY2FsZSwgLjMsIHt4OjEsIHk6MSwgZWFzZTpCYWNrLmVhc2VPdXR9KTtcclxuXHJcbiAgICAgICAgICAgIENvbW1vbi5hbmltYXRvci5hZGQoVHdlZW5NYXgudG8odGhpcy5fcGxheUJ1dHRvbi5zY2FsZSwgLjUsIHtkZWxheToxLCB4OjEsIHk6MSwgZWFzZTpCYWNrLmVhc2VPdXR9KSk7XHJcbiAgICAgICAgICAgIENvbW1vbi5hbmltYXRvci5hZGQoVHdlZW5NYXgudG8odGhpcy5faG9tZUJ1dHRvbi5zY2FsZSwgLjUsIHtkZWxheToxLCB4OjEsIHk6MSwgZWFzZTpCYWNrLmVhc2VPdXR9KSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0qL1xyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5HYW1lT3ZlclNjcmVlbi5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICBTaW1wbGVTY3JlZW4ucHJvdG90eXBlLnJlc2l6ZS5jYWxsKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuX211dGVCdXR0b24ueCA9IHRoaXMuX2dldEZpcnN0QnV0dG9uUG9zaXRpb25SaWdodCgpO1xyXG4gICAgdGhpcy5faG9tZUJ1dHRvbi54ID0gdGhpcy5fZ2V0Rmlyc3RCdXR0b25Qb3NpdGlvbkxlZnQoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKi9cclxuR2FtZU92ZXJTY3JlZW4ucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbigpXHJcbntcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9uPX0gY2FsbGJhY2tcclxuICogQHBhcmFtIHsqPX1zY29wZVxyXG4gKi9cclxuR2FtZU92ZXJTY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBzY29wZSkge1xyXG4gICAgXHJcbiAgICBTaW1wbGVTY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVJbi5jYWxsKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuX3BhbmVsLnNjYWxlID0gbmV3IFBJWEkuUG9pbnQoMCwgMCk7XHJcbiAgICB0aGlzLl9zY29yZVRleHQuc2NhbGUgPSBuZXcgUElYSS5Qb2ludCgwLCAwKTtcclxuXHJcbiAgICB2YXIgdGwgPSBuZXcgVGltZWxpbmVNYXgoKTtcclxuICAgIENvbW1vbi5hbmltYXRvci5hZGQodGwpO1xyXG4gICAgdGwudG8odGhpcy5fcGFuZWwuc2NhbGUsIC4zLCB7eDoxLCB5OjEsIGVhc2U6RXhwby5lYXNlT3V0fSk7XHJcblxyXG4gICAgdGwudG8odGhpcy5fc2NvcmVUZXh0LnNjYWxlLCAuMywge2RlbGF5Oi41LCB4OjEuMiwgeToxLjIsIGVhc2U6RXhwby5lYXNlT3V0fSk7XHJcblxyXG4gICAgaWYodGhpcy5fZGlzdGFuY2UgPiBDb21tb24uc2F2ZWREYXRhLmJlc3RTY29yZSlcclxuICAgIHtcclxuICAgICAgICBDb21tb24uc2F2ZWREYXRhLmJlc3RTY29yZSA9IHRoaXMuX2Rpc3RhbmNlO1xyXG4gICAgICAgIENvbW1vbi5zYXZlZERhdGEuc2F2ZSgpO1xyXG4gICAgICAgIHRsLnRvKHRoaXMuX3Ryb3BoeS5zY2FsZSwgLjMsIHt4OjEuMiwgeToxLjIsIGVhc2U6U2luZS5lYXNlT3V0LCBvbkNvbXBsZXRlU2NvcGU6dGhpcywgb25Db21wbGV0ZTpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB0aGlzLl9iZXN0U2NvcmVUZXh0LnRleHQgPSBDb21tb24uc2F2ZWREYXRhLmJlc3RTY29yZS50b1N0cmluZygpO1xyXG4gICAgICAgIH19KTsgXHJcbiAgICAgICAgdGwudG8odGhpcy5fdHJvcGh5LnNjYWxlLCAxLCB7eDoxLCB5OjEsIGVhc2U6RWxhc3RpYy5lYXNlT3V0fSk7IFxyXG4gICAgfVxyXG5cclxuICAgIHRsLnRvKHRoaXMuX21vam8sIC4zLCB7eTpDb21tb24uU1RBR0VfSEVJR0hUIC0gdGhpcy5fbW9qby5oZWlnaHQsIGVhc2U6RXhwby5lYXNlT3V0LCBvblN0YXJ0U2NvcGU6dGhpcywgb25TdGFydDpmdW5jdGlvbigpe1xyXG4gICAgICAgIENvbW1vbi5hbmltYXRvci5hZGQoVHdlZW5NYXgudG8odGhpcy5fcGxheUJ1dHRvbi5zY2FsZSwgLjUsIHtkZWxheToxLCB4OjEsIHk6MSwgZWFzZTpCYWNrLmVhc2VPdXR9KSk7XHJcbiAgICAgICAgQ29tbW9uLmFuaW1hdG9yLmFkZChUd2Vlbk1heC50byh0aGlzLl9ob21lQnV0dG9uLnNjYWxlLCAuNSwge2RlbGF5OjEsIHg6MSwgeToxLCBlYXNlOkJhY2suZWFzZU91dH0pKTtcclxuICAgIH19KTtcclxuICAgIHRsLnRvKHRoaXMuX21vam9UZXh0LnNjYWxlLCAuMywge3g6MSwgeToxLCBlYXNlOkJhY2suZWFzZU91dH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb249fSBjYWxsYmFja1xyXG4gKiBAcGFyYW0geyo9fSBzY29wZVxyXG4gKi9cclxuR2FtZU92ZXJTY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVPdXQgPSBmdW5jdGlvbihjYWxsYmFjaywgc2NvcGUpIHtcclxuICAgICAgICBcclxuICAgIFNpbXBsZVNjcmVlbi5wcm90b3R5cGUuYW5pbWF0ZU91dC5jYWxsKHRoaXMpO1xyXG59O1xyXG5cclxuR2FtZU92ZXJTY3JlZW4ucHJvdG90eXBlLmFkZEhlYXJ0cyA9IGZ1bmN0aW9uKClcclxueyAgXHJcbiAgICB0aGlzLl9oZWFydFBhcnRpY2xlID0gIEVtaXR0ZXIuYWRkKHRoaXMuX3BhbmVsLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcInBpY2t1cFwiXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGFydGljbGVzX2hlYXJ0X3Njb3JlXCIsIDAsIDUwKTtcclxuICAgIHRoaXMuX2FkZGluZ0hlYXJ0cyA9IHRydWU7XHJcbiAgICAvL1NvdW5kU0ZYLnBsYXkoJ3NmeF9oZWFydF9waWNrdXBfMDInLCB7bG9vcDp0cnVlfSk7XHJcbn07XHJcblxyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFBSSVZBVEUgTUVUSE9EU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEVWRU5UU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLyoqXHJcbiAqL1xyXG5HYW1lT3ZlclNjcmVlbi5wcm90b3R5cGUucGxheUNsaWNrZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIFxyXG4gICAgdGhpcy5fcGxheUJ1dHRvbi5zaWduYWxzLm92ZXIucmVtb3ZlKHRoaXMuYnV0dG9uT3ZlciwgdGhpcyk7XHJcbiAgICB0aGlzLl9wbGF5QnV0dG9uLnNpZ25hbHMuZG93bi5yZW1vdmUodGhpcy5wbGF5Q2xpY2tlZCwgdGhpcyk7XHJcblxyXG4gICAgVHdlZW5NYXgua2lsbFR3ZWVuc09mKHRoaXMuX3BsYXlCdXR0b24uc2NhbGUpO1xyXG4gICAgQ29tbW9uLmFuaW1hdG9yLmFkZChUd2Vlbk1heC50byh0aGlzLl9wbGF5QnV0dG9uLnNjYWxlLCAuMiwge3g6MC42LCB5OjAuNiwgZWFzZTpTaW5lLmVhc2VJbk91dCwgb25Db21wbGV0ZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIENvbW1vbi5hbmltYXRvci5hZGQoVHdlZW5NYXgudG8odGhpcy5fcGxheUJ1dHRvbi5zY2FsZSwgMSwge3g6MSwgeToxLCBlYXNlOkVsYXN0aWMuZWFzZU91dCwgb25Db21wbGV0ZTpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB0aGlzLnNpZ25hbHMucmVxdWVzdGVkTmV4dFNjcmVlbi5kaXNwYXRjaCgpO1xyXG4gICAgICAgIH0sIG9uQ29tcGxldGVTY29wZTp0aGlzfSkpO1xyXG5cclxuICAgIH0sIG9uQ29tcGxldGVTY29wZTp0aGlzfSkpO1xyXG4gICAgU291bmRTRlgucGxheSgnc2Z4X3VpX3ByZXNzcGxheV8wMCcpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5HYW1lT3ZlclNjcmVlbi5wcm90b3R5cGUuaG9tZUNsaWNrZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIFxyXG4gICAgdGhpcy5zaWduYWxzLnJlcXVlc3RlZFByZXZpb3VzU2NyZWVuLmRpc3BhdGNoKCk7XHJcbiAgICBTb3VuZFNGWC5wbGF5KCdzZnhfdWlfcHJlc3NfYnV0dG9uXzAxJyk7XHJcbn07XHJcblxyXG4vKipcclxuICovXHJcbkdhbWVPdmVyU2NyZWVuLnByb3RvdHlwZS5idXR0b25PdmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgXHJcbiAgICBcclxufTtcclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBHRVRURVJTL1NFVFRFUlNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuIiwiXG52YXIgQ29tbW9uICAgICAgICAgIFx0XHQ9IHJlcXVpcmUoXCIuLi9Db21tb25cIik7XG52YXIgU2ltcGxlU2NyZWVuICAgIFx0XHQ9IHJlcXVpcmUoXCIuL1NpbXBsZVNjcmVlblwiKTtcbnZhciBTY3JvbGxlckVuZ2luZVx0XHRcdD0gcmVxdWlyZShcIi4uL3Njcm9sbGVyL1Njcm9sbGVyRW5naW5lXCIpO1xudmFyIFNjcm9sbGVyT2JqZWN0ICAgICAgICAgID0gcmVxdWlyZShcIi4uL3Njcm9sbGVyL1Njcm9sbGVyT2JqZWN0XCIpO1xudmFyIFNjcm9sbGVyT2JqZWN0SW1hZ2VcdFx0PSByZXF1aXJlKFwiLi4vc2Nyb2xsZXIvU2Nyb2xsZXJPYmplY3RJbWFnZVwiKTtcbnZhciBTY3JvbGxlckxvb3BpbmdSYW5nZSAgICA9IHJlcXVpcmUoXCIuLi9zY3JvbGxlci9TY3JvbGxlckxvb3BpbmdSYW5nZVwiKTtcbnZhciBTY3JvbGxlck9iamVjdEdlbmVyYXRvciA9IHJlcXVpcmUoXCIuLi9zY3JvbGxlci9TY3JvbGxlck9iamVjdEdlbmVyYXRvclwiKTtcbnZhciBCYWNrZ3JvdW5kSW1hZ2UgICAgICAgICA9IHJlcXVpcmUoXCIuLi9nYW1lL0JhY2tncm91bmRJbWFnZVwiKTtcbnZhciBBdmF0YXIgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9nYW1lL0F2YXRhclwiKTtcbnZhciBPYnN0YWNsZSAgICAgICAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9nYW1lL09ic3RhY2xlXCIpO1xudmFyIENvbGxlY3RpYmxlICAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL2dhbWUvQ29sbGVjdGlibGVcIik7XG52YXIgQmFja2dyb3VuZEZsb2F0ZXIgICAgICAgPSByZXF1aXJlKFwiLi4vZ2FtZS9CYWNrZ3JvdW5kRmxvYXRlclwiKTtcbnZhciBGb3JlZ3JvdW5kU2hhZG93ICAgICAgICA9IHJlcXVpcmUoXCIuLi9nYW1lL0ZvcmVncm91bmRTaGFkb3dcIik7XG52YXIgVHJhaWxSZW5kZXJlciAgICAgICAgICAgPSByZXF1aXJlKFwiLi4vZ2FtZS9UcmFpbFJlbmRlcmVyXCIpO1xudmFyIFNjb3JlQm94IFx0XHRcdCAgICA9IHJlcXVpcmUoXCIuLi9nYW1lL1Njb3JlQm94XCIpO1xudmFyIEVtaXR0ZXIgICAgICAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL2dlbmVyYWwvRW1pdHRlclwiKTtcbnZhciBTb3VuZFNGWCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9nZW5lcmFsL1NvdW5kU0ZYXCIpO1xuXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQ09OU1RSVUNUT1Jcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEdhbWVTY3JlZW4oKVxue1xuXHR0aGlzLl9zY3JvbGxlckVuZ2luZSBcdFx0XHQ9IG51bGw7XG5cblx0dGhpcy5fYWN0aXZlQm91bmRhcnlQYWRkaW5nIFx0PSAxMDA7XG4gICAgdGhpcy5fc3RhcnRpbmdTY3JvbGxTcGVlZCBcdFx0PSA4O1xuICAgIHRoaXMuX3Njcm9sbEluYyBcdFx0XHRcdD0gMDtcbiAgICB0aGlzLl9zY3JvbGxJbmNBZGQgICAgICAgICAgICAgID0gMC4wMDAzO1xuICAgIHRoaXMuX3Njcm9sbEluY01heCBcdFx0XHRcdD0gMi40O1xuICAgIHRoaXMuX2NvbGxlY3RpYmxlQm9udXMgICAgICAgICAgPSAyMDtcblxuICAgIHRoaXMuX2N1cnJlbnRGb3JtYXRpb25cdFx0XHQ9IDA7XG4gICAgdGhpcy5fZGlzdGFuY2UgICAgICAgICAgICAgICAgICA9IDA7XG4gICAgdGhpcy5faGVhcnRzICAgICAgICAgICAgICAgICAgICA9IDA7XG4gICAgdGhpcy5fY3VycmVudEJhY2tncm91bmRDb2xvdXIgICA9IDA7XG4gICAgdGhpcy5fbWF4QmFja2dyb3VuZENvbG91cnMgICAgICA9IDU7XG4gICAgdGhpcy5fc3dpdGNoaW5nXHRcdFx0XHRcdD0gZmFsc2U7XG4gICAgdGhpcy5fZmlyc3RVcGRhdGUgICAgICAgICAgICAgICA9IHRydWU7XG4gICAgdGhpcy5fZ2FtZUVuZGVkICAgICAgICAgICAgICAgICA9IGZhbHNlO1xuICAgIHRoaXMuX3BhdXNlZCAgICAgICAgICAgICAgICAgICAgPSBmYWxzZTtcblxuICAgIHRoaXMuX2JhY2tncm91bmRIb2xkZXIgICAgICAgICAgPSBudWxsO1xuICAgIHRoaXMuX2JhY2tncm91bmQgXHRcdFx0XHQ9IG51bGw7XG4gICAgdGhpcy5fZW5naW5lSG9sZGVyICAgICAgICAgICAgICA9IG51bGw7XG4gICAgdGhpcy5fc2NvcmVCb3ggICAgICAgICAgICAgICAgICA9IG51bGw7XG5cbiAgICB0aGlzLl9ibG9zc29tXHRcdFx0XHRcdD0gbnVsbDtcbiAgICB0aGlzLl9idWJibGVzXHRcdFx0XHRcdD0gbnVsbDtcbiAgICB0aGlzLl9idXR0ZXJjdXBcdFx0XHRcdFx0PSBudWxsO1xuICAgIHRoaXMuX2F2YXRhcnNcdFx0XHRcdFx0PSBudWxsO1xuICAgIHRoaXMuX2F2YXRhclBvc2l0aW9uc1x0XHRcdD0gbnVsbDtcbiAgICB0aGlzLl9hdmF0YXJUcmFpbHMgICAgICAgICAgICAgID0gbnVsbDtcbiAgICB0aGlzLl9hdmF0YXJUcmFpbFBhcnRpY2xlcyAgICAgID0gbnVsbDtcblxuICAgIHRoaXMuX2xldmVsR2VuZXJhdG9yICAgICAgICAgICAgPSBudWxsO1xuICAgIHRoaXMuX2Zsb2F0ZXJHZW5lcmF0b3IgICAgICAgICAgPSBudWxsO1xuICAgIHRoaXMuX2ZvcmVncm91bmRHZW5lcmF0b3IgICAgICAgPSBudWxsO1xuXG4gICAgU2ltcGxlU2NyZWVuLmNhbGwodGhpcyk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVTY3JlZW47XG5HYW1lU2NyZWVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU2ltcGxlU2NyZWVuLnByb3RvdHlwZSk7XG5HYW1lU2NyZWVuLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdhbWVTY3JlZW47XG5cblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFBVQkxJQyBNRVRIT0RTXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqL1xuR2FtZVNjcmVlbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKClcbntcbiAgICBjb25zb2xlLmxvZyhcIkdBTUUgSU5JVElBTElaRURcIik7XG4gICAgU2ltcGxlU2NyZWVuLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLl9iYWNrZ3JvdW5kSG9sZGVyID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9iYWNrZ3JvdW5kSG9sZGVyKTtcblxuICAgIHRoaXMuX2JhY2tncm91bmQgPSBuZXcgUElYSS5TcHJpdGUoQ29tbW9uLmdlbmVyYXRlZFRleHR1cmVzLnNreTBTcXVhcmUpO1xuICAgIHRoaXMuX2JhY2tncm91bmQud2lkdGggPSBDb21tb24uU1RBR0VfV0lEVEg7XG4gICAgdGhpcy5fYmFja2dyb3VuZC5oZWlnaHQgPSBDb21tb24uU1RBR0VfSEVJR0hUO1xuICAgIHRoaXMuX2JhY2tncm91bmRIb2xkZXIuYWRkQ2hpbGQodGhpcy5fYmFja2dyb3VuZCk7XG5cbiAgICB0aGlzLl9lbmdpbmVIb2xkZXIgPSBuZXcgUElYSS5Db250YWluZXIoKTtcbiAgICB0aGlzLl9lbmdpbmVIb2xkZXIueCA9IENvbW1vbi5TVEFHRV9XSURUSC8yO1xuICAgIHRoaXMuX2VuZ2luZUhvbGRlci55ID0gQ29tbW9uLlNUQUdFX0hFSUdIVC8yO1xuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fZW5naW5lSG9sZGVyKTtcblxuLy9TY3JvbGxlciBFbmdpbmUgU2V0dXBcblx0dmFyIHAgPSB0aGlzLl9hY3RpdmVCb3VuZGFyeVBhZGRpbmc7XG4gICAgdGhpcy5fc2Nyb2xsZXJFbmdpbmUgPSBuZXcgU2Nyb2xsZXJFbmdpbmUobmV3IFBJWEkuUG9pbnQoQ29tbW9uLlNUQUdFX1dJRFRILzIsIENvbW1vbi5TVEFHRV9IRUlHSFQvMiksIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQSVhJLlJlY3RhbmdsZSgtQ29tbW9uLlNUQUdFX1dJRFRILzIsIC1Db21tb24uU1RBR0VfSEVJR0hULzIsIENvbW1vbi5TVEFHRV9XSURUSCwgQ29tbW9uLlNUQUdFX0hFSUdIVCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFBJWEkuUmVjdGFuZ2xlKC0oQ29tbW9uLlNUQUdFX1dJRFRILzIpLXAsIC0oQ29tbW9uLlNUQUdFX0hFSUdIVC8yKS1wLCAoQ29tbW9uLlNUQUdFX1dJRFRIKjIpKyhwKjIpLCBDb21tb24uU1RBR0VfSEVJR0hUKyhwKjIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgdGhpcy5fc2Nyb2xsZXJFbmdpbmUueCA9IC0oQ29tbW9uLlNUQUdFX1dJRFRILzIpO1xuICAgIHRoaXMuX3Njcm9sbGVyRW5naW5lLnkgPSAtKENvbW1vbi5TVEFHRV9IRUlHSFQvMik7XG4gICAgdGhpcy5fc2Nyb2xsZXJFbmdpbmUuaW5pdCgpO1xuICAgIHRoaXMuX2VuZ2luZUhvbGRlci5hZGRDaGlsZCh0aGlzLl9zY3JvbGxlckVuZ2luZSk7XG5cbi8vTGF5ZXJzXG4gICAgdGhpcy5fc2Nyb2xsZXJFbmdpbmUuYWRkTGF5ZXIoXCJiYWNrZ3JvdW5kTGF5ZXIxXCIsIG5ldyBQSVhJLlBvaW50KDAuMSwgMSkpO1xuICAgIHRoaXMuX3Njcm9sbGVyRW5naW5lLmFkZExheWVyKFwiYmFja2dyb3VuZExheWVyMlwiLCBuZXcgUElYSS5Qb2ludCgwLjIsIDEpKTtcbiAgICB0aGlzLl9zY3JvbGxlckVuZ2luZS5hZGRMYXllcihcImJhY2tncm91bmRGbG9hdGVyTGF5ZXJcIiwgbmV3IFBJWEkuUG9pbnQoMC42LCAxKSk7XG4gICAgdGhpcy5fc2Nyb2xsZXJFbmdpbmUuYWRkTGF5ZXIoXCJvYnN0YWNsZUxheWVyXCIsIG5ldyBQSVhJLlBvaW50KDEsIDEpKTtcbiAgICB0aGlzLl9zY3JvbGxlckVuZ2luZS5hZGRMYXllcihcImF2YXRhclRyYWlsTGF5ZXJcIiwgbmV3IFBJWEkuUG9pbnQoMSwgMSkpO1xuICAgIHRoaXMuX3Njcm9sbGVyRW5naW5lLmFkZExheWVyKFwiYXZhdGFyTGF5ZXJcIiwgbmV3IFBJWEkuUG9pbnQoMSwgMSkpO1xuICAgIHRoaXMuX3Njcm9sbGVyRW5naW5lLmFkZExheWVyKFwiZm9yZWdyb3VuZFNoYWRvd0xheWVyXCIsIG5ldyBQSVhJLlBvaW50KDMsIDEpKTtcblxuLy9CYWNrZ3JvdW5kIGxheWVyc1xuICAgIHRoaXMuX2FkZEJhY2tncm91bmQoW3t0ZXh0dXJlOlwiY2l0eS1za3lsaW5lXzAwXCIsIHdpZHRoOjU1NiwgaGVpZ2h0OjMzNiwgb2Zmc2V0WDoxMDAsIG9mZnNldFk6NTB9LFxuICAgIFx0XHRcdFx0XHQge3RleHR1cmU6XCJjaXR5LXNreWxpbmVfMDFcIiwgd2lkdGg6MzY0LCBoZWlnaHQ6MjU4LCBvZmZzZXRYOjEwMCwgb2Zmc2V0WTo1MH0sXG4gICAgXHRcdFx0XHRcdCB7dGV4dHVyZTpcImNpdHktc2t5bGluZV8wMlwiLCB3aWR0aDo1MTAsIGhlaWdodDozMjYsIG9mZnNldFg6MTAwLCBvZmZzZXRZOjUwfSxcbiAgICBcdFx0XHRcdFx0IHt0ZXh0dXJlOlwiY2l0eS1za3lsaW5lXzA0XCIsIHdpZHRoOjM1MCwgaGVpZ2h0OjI4NCwgb2Zmc2V0WDoxMDAsIG9mZnNldFk6NTB9XSwgXCJiYWNrZ3JvdW5kTGF5ZXIxXCIsIDApO1xuICAgIHRoaXMuX2FkZEJhY2tncm91bmQoW3t0ZXh0dXJlOlwiYmdfYnVpbGRpbmcxXCIsIHdpZHRoOjIzNCwgaGVpZ2h0OjM1MCwgb2Zmc2V0WDo1MDAsIG9mZnNldFk6NTJ9LFxuICAgIFx0XHRcdFx0XHQge3RleHR1cmU6XCJiZ19idWlsZGluZzJcIiwgd2lkdGg6MTgyLCBoZWlnaHQ6Mzk2LCBvZmZzZXRYOjgwMCwgb2Zmc2V0WTo2fSxcbiAgICBcdFx0XHRcdFx0IHt0ZXh0dXJlOlwiYmdfYnVpbGRpbmczXCIsIHdpZHRoOjE3MCwgaGVpZ2h0OjQwMiwgb2Zmc2V0WDozMDAsIG9mZnNldFk6MH1dLCBcImJhY2tncm91bmRMYXllcjJcIiwgMCk7XG5cbi8vQXZhdGFyc1xuXHR0aGlzLl9hdmF0YXJzID0gW107XG4gICAgdGhpcy5fYXZhdGFyVHJhaWxzID0gW107XG4gICAgdGhpcy5fYXZhdGFyVHJhaWxQYXJ0aWNsZXMgPSBbXTtcblxuICAgIHZhciBuYW1lcyA9IFsnYmxvc3NvbScsICdidWJibGVzJywgJ2J1dHRlcmN1cCddO1xuXG4gICAgZm9yKHZhciBpPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgICB2YXIgdHJhaWxQYXJ0aWNsZSA9IEVtaXR0ZXIuYWRkKHRoaXMuX3Njcm9sbGVyRW5naW5lLmdldExheWVyQ29udGFpbmVyKCdhdmF0YXJUcmFpbExheWVyJyksIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmFtZXNbaV0gKyAnX3RyYWlsX3BhcnRpY2xlXzAwMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lc1tpXSArICdfdHJhaWxfcGFydGljbGVfMDAxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzW2ldICsgJ190cmFpbF9wYXJ0aWNsZV8wMDInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNbaV0gKyAnX3RyYWlsX3BhcnRpY2xlXzAwMycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lc1tpXSArICdfdHJhaWxfcGFydGljbGVfMDA0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzW2ldICsgJ190cmFpbF9wYXJ0aWNsZV8wMDUnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwYXJ0aWNsZXNfdHJhaWxcIiwgMCwgMCk7XG4gICAgICAgIHRoaXMuX2F2YXRhclRyYWlsUGFydGljbGVzLnB1c2godHJhaWxQYXJ0aWNsZSk7XG5cbiAgICAgICAgdmFyIHRyYWlsICAgICAgICAgICAgICAgPSBuZXcgVHJhaWxSZW5kZXJlcigpO1xuICAgICAgICB0cmFpbC5jb2xvciAgICAgICAgICAgICA9IENvbW1vbi5jb2xvdXJzW25hbWVzW2ldXTtcbiAgICAgICAgdHJhaWwudmVydGV4RGlzdGFuY2UgICAgPSAyMC4wO1xuICAgICAgICB0cmFpbC50aGlja25lc3MgICAgICAgICA9IDQyLjA7XG4gICAgICAgIHRyYWlsLnRpbWUgICAgICAgICAgICAgID0gMS41O1xuICAgICAgICB0cmFpbC5hbHBoYSAgICAgICAgICAgICA9IDAuNTtcbiAgICAgICAgLy90cmFpbC5ibGVuZE1vZGUgICAgICAgICA9IFBJWEkuQkxFTkRfTU9ERVMuQUREO1xuICAgICAgICB0aGlzLl9zY3JvbGxlckVuZ2luZS5nZXRMYXllckNvbnRhaW5lcignYXZhdGFyVHJhaWxMYXllcicpLmFkZENoaWxkKHRyYWlsKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuX2F2YXRhclRyYWlscy5wdXNoKHRyYWlsKTtcbiAgICB9XG5cblx0dGhpcy5fYmxvc3NvbSA9IG5ldyBBdmF0YXIoJ2Jsb3Nzb20nKTtcbiAgICB0aGlzLl9ibG9zc29tLmluaXQoKTtcblx0dGhpcy5fc2Nyb2xsZXJFbmdpbmUuYWRkT2JqZWN0VG9MYXllcih0aGlzLl9ibG9zc29tLCBcImF2YXRhckxheWVyXCIsIDAsIDApO1xuXHR0aGlzLl9hdmF0YXJzLnB1c2godGhpcy5fYmxvc3NvbSk7XG5cblx0dGhpcy5fYnViYmxlcyA9IG5ldyBBdmF0YXIoJ2J1YmJsZXMnKTtcbiAgICB0aGlzLl9idWJibGVzLmluaXQoKTtcblx0dGhpcy5fc2Nyb2xsZXJFbmdpbmUuYWRkT2JqZWN0VG9MYXllcih0aGlzLl9idWJibGVzLCBcImF2YXRhckxheWVyXCIsIDAsIDApO1xuXHR0aGlzLl9hdmF0YXJzLnB1c2godGhpcy5fYnViYmxlcyk7XG5cblx0dGhpcy5fYnV0dGVyY3VwID0gbmV3IEF2YXRhcignYnV0dGVyY3VwJyk7XG4gICAgdGhpcy5fYnV0dGVyY3VwLmluaXQoKTtcblx0dGhpcy5fc2Nyb2xsZXJFbmdpbmUuYWRkT2JqZWN0VG9MYXllcih0aGlzLl9idXR0ZXJjdXAsIFwiYXZhdGFyTGF5ZXJcIiwgMCwgMCk7XG5cdHRoaXMuX2F2YXRhcnMucHVzaCh0aGlzLl9idXR0ZXJjdXApO1xuXG5cdHRoaXMuX2F2YXRhclBvc2l0aW9ucyA9IFtcblx0XHR7Ymxvc3NvbTpbe3g6LTI1MCwgeTowfV0sIGJ1YmJsZXM6W3t4Oi0zNTAsIHk6LTUwfV0sIGJ1dHRlcmN1cDpbe3g6LTM1MCwgeTo1MH1dfSxcblx0XHR7Ymxvc3NvbTpbe3g6LTI1MCwgeTotMjAwfSwge3g6LTI1MCwgeToyMDB9XSwgYnViYmxlczpbe3g6LTM1MCwgeTotMjUwfV0sIGJ1dHRlcmN1cDpbe3g6LTM1MCwgeToyNTB9XX0sXG5cdF07XG5cblx0dGhpcy5zZXRGb3JtYXRpb24odGhpcy5fY3VycmVudEZvcm1hdGlvbiwgZmFsc2UpO1xuICAgIHRoaXMuaW50cm9kdWNlQXZhdGFycygpO1xuXG5cbi8vSGl0QXJlYVxuICAgIHRoaXMuX2hpdEFyZWEgPSBuZXcgUElYSS5TcHJpdGUoQ29tbW9uLmdlbmVyYXRlZFRleHR1cmVzWydibGFja1NxdWFyZSddKTtcbiAgICB0aGlzLl9oaXRBcmVhLmFscGhhID0gMDtcbiAgICB0aGlzLl9oaXRBcmVhLndpZHRoID0gQ29tbW9uLlNUQUdFX1dJRFRIO1xuICAgIHRoaXMuX2hpdEFyZWEuaGVpZ2h0ID0gQ29tbW9uLlNUQUdFX0hFSUdIVDtcbiAgICB0aGlzLl9oaXRBcmVhLmhpdEFyZWEgPSBuZXcgUElYSS5SZWN0YW5nbGUoMCwgMCwgQ29tbW9uLlNUQUdFX1dJRFRILCBDb21tb24uU1RBR0VfSEVJR0hUKTtcbiAgICB0aGlzLl9oaXRBcmVhLmludGVyYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuX2hpdEFyZWEpO1xuXG4gICAgdGhpcy5faGl0QXJlYS50b3VjaHN0YXJ0ID0gdGhpcy5faGl0QXJlYS5tb3VzZWRvd24gPSB0aGlzLm9uVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuXG4vL0xldmVsIERlc2lnblxuXG4gICAgdGhpcy5fbGV2ZWxHZW5lcmF0b3IgPSBuZXcgU2Nyb2xsZXJPYmplY3RHZW5lcmF0b3IoW1xuICAgICAgICB7aWQ6XCJ0b3BfYmxvY2tzXzFcIiwgYmFzZTpPYnN0YWNsZSwgYXJnczpbJ29ic3RhY2xlLTFfdG9wJywgJ3RvcF9ibG9ja3NfMScsICd0b3AnXX0sXG4gICAgICAgIHtpZDpcInRvcF9waXBlXzFcIiwgYmFzZTpPYnN0YWNsZSwgYXJnczpbJ29ic3RhY2xlLTJfdG9wJywgJ3RvcF9waXBlXzEnLCAndG9wJ119LFxuICAgICAgICB7aWQ6XCJ0b3BfYmxvY2tzXzJcIiwgYmFzZTpPYnN0YWNsZSwgYXJnczpbJ29ic3RhY2xlLTMnLCAndG9wX2Jsb2Nrc18yJywgJ3RvcCddfSxcbiAgICAgICAge2lkOlwidG9wX2NyYXRlXzFcIiwgYmFzZTpPYnN0YWNsZSwgYXJnczpbJ29ic3RhY2xlLTRfdG9wJywgJ3RvcF9jcmF0ZV8xJywgJ3RvcCddfSxcbiAgICAgICAge2lkOlwibWlkX2NyYXRlXzFcIiwgYmFzZTpPYnN0YWNsZSwgYXJnczpbJ29ic3RhY2xlLTVfbWlkJywgJ21pZF9jcmF0ZV8xJywgJ21pZCcsIHRydWVdfSxcbiAgICAgICAge2lkOlwibWlkX3BpcGVfMVwiLCBiYXNlOk9ic3RhY2xlLCBhcmdzOlsnb2JzdGFjbGUtNl9taWQnLCAnbWlkX3BpcGVfMScsICdtaWQnLCB0cnVlXX0sXG4gICAgICAgIHtpZDpcIm1pZF9iZW5jaF8xXCIsIGJhc2U6T2JzdGFjbGUsIGFyZ3M6WydvYnN0YWNsZS0xMl9taWQnLCAnbWlkX2JlbmNoXzEnLCAnbWlkJywgdHJ1ZV19LFxuICAgICAgICB7aWQ6XCJtaWRfY2FyXzFcIiwgYmFzZTpPYnN0YWNsZSwgYXJnczpbJ29ic3RhY2xlLTdfbWlkJywgJ21pZF9jYXJfMScsICdtaWQnLCB0cnVlXX0sXG4gICAgICAgIHtpZDpcIm1pZF9jYXJfMlwiLCBiYXNlOk9ic3RhY2xlLCBhcmdzOlsnb2JzdGFjbGUtOV9taWQnLCAnbWlkX2Nhcl8yJywgJ21pZCcsIHRydWVdfSxcbiAgICAgICAge2lkOlwibWlkX2Nhcl8zXCIsIGJhc2U6T2JzdGFjbGUsIGFyZ3M6WydvYnN0YWNsZS0xMF9taWQnLCAnbWlkX2Nhcl8zJywgJ21pZCcsIHRydWVdfSxcbiAgICAgICAge2lkOlwiYm90dG9tX2J1aWxkaW5nXzFcIiwgYmFzZTpPYnN0YWNsZSwgYXJnczpbJ29ic3RhY2xlLThfYm90JywgJ2JvdHRvbV9idWlsZGluZ18xJywgJ2JvdHRvbSddfSxcbiAgICAgICAge2lkOlwiYm90dG9tX2J1aWxkaW5nXzJcIiwgYmFzZTpPYnN0YWNsZSwgYXJnczpbJ29ic3RhY2xlLTlfYm90JywgJ2JvdHRvbV9idWlsZGluZ18yJywgJ2JvdHRvbSddfSxcbiAgICAgICAge2lkOlwiYm90dG9tX2JpbGxib2FyZF8xXCIsIGJhc2U6T2JzdGFjbGUsIGFyZ3M6WydvYnN0YWNsZS0xMF9ib3QnLCAnYm90dG9tX2JpbGxib2FyZF8xJywgJ2JvdHRvbSddfSxcbiAgICAgICAge2lkOlwiYm90dG9tX2J1c2hfMVwiLCBiYXNlOk9ic3RhY2xlLCBhcmdzOlsnb2JzdGFjbGUtMTFfYm90JywgJ2JvdHRvbV9idXNoXzEnLCAnYm90dG9tJ119LFxuICAgICAgICB7aWQ6XCJjb2xsZWN0aWJsZVwiLCBiYXNlOkNvbGxlY3RpYmxlLCBhcmdzOltdfSxcbiAgICBdKTtcbiAgICB0aGlzLl9sZXZlbEdlbmVyYXRvci5zaWduYWxzLmdlbmVyYXRlT2JqZWN0cy5hZGQodGhpcy5vbkdlbmVyYXRlT2JzdGFjbGUsIHRoaXMpO1xuICAgIHRoaXMuX2xldmVsR2VuZXJhdG9yLnNpZ25hbHMub2JqZWN0RGlzcG9zZWQuYWRkKHRoaXMub25PYnN0YWNsZURpc3Bvc2VkLCB0aGlzKTtcblxuICAgIHZhciB0b3BfeSA9IDAgLSAoQ29tbW9uLlNUQUdFX0hFSUdIVC8yKTtcbiAgICB2YXIgbWlkX3kgPSAwO1xuICAgIHZhciBib3R0b21feSA9IENvbW1vbi5TVEFHRV9IRUlHSFQvMjtcbiAgICB2YXIgY29sbGVjdGlibGVfdG9wX3kgPSB0aGlzLl9hdmF0YXJQb3NpdGlvbnNbMV1bJ2J1YmJsZXMnXVswXS55O1xuICAgIHZhciBjb2xsZWN0aWJsZV9ib3R0b21feSA9IHRoaXMuX2F2YXRhclBvc2l0aW9uc1sxXVsnYnV0dGVyY3VwJ11bMF0ueTtcbiAgICBcbiAgICAvL1RvcCBhbmQgQm90dG9tIFBhdHRlcm5zXG5cbiAgICB0aGlzLl9sZXZlbEdlbmVyYXRvci5hZGRQYXR0ZXJuKFtcbiAgICAgICAge3g6MCwgeTp0b3BfeSwgcG9vbElkOid0b3BfYmxvY2tzXzEnfSxcbiAgICAgICAge3g6MCwgeTpib3R0b21feSwgcG9vbElkOidib3R0b21fYnVpbGRpbmdfMSd9LFxuICAgICAgICB7eDo2MDAsIHk6Y29sbGVjdGlibGVfdG9wX3ksIHBvb2xJZDonY29sbGVjdGlibGUnLCBvcmlnaW5hbFg6NjAwfSxcbiAgICAgICAge3g6NzAwLCB5OmNvbGxlY3RpYmxlX3RvcF95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJywgb3JpZ2luYWxYOjcwMH0sXG4gICAgICAgIHt4OjgwMCwgeTpjb2xsZWN0aWJsZV90b3BfeSwgcG9vbElkOidjb2xsZWN0aWJsZScsIG9yaWdpbmFsWDo4MDB9LFxuICAgICAgICB7eDo2MDAsIHk6Y29sbGVjdGlibGVfYm90dG9tX3ksIHBvb2xJZDonY29sbGVjdGlibGUnLCBvcmlnaW5hbFg6NjAwfSxcbiAgICAgICAge3g6NzAwLCB5OmNvbGxlY3RpYmxlX2JvdHRvbV95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJywgb3JpZ2luYWxYOjcwMH0sXG4gICAgICAgIHt4OjgwMCwgeTpjb2xsZWN0aWJsZV9ib3R0b21feSwgcG9vbElkOidjb2xsZWN0aWJsZScsIG9yaWdpbmFsWDo4MDB9LFxuICAgICAgICBdLCBcInBhdHRlcm4xXCIpO1xuICAgIFxuICAgIHRoaXMuX2xldmVsR2VuZXJhdG9yLmFkZFBhdHRlcm4oW1xuICAgICAgICB7eDowLCB5OnRvcF95LCBwb29sSWQ6J3RvcF9ibG9ja3NfMid9LFxuICAgICAgICB7eDoyMDAsIHk6Ym90dG9tX3ksIHBvb2xJZDonYm90dG9tX2JpbGxib2FyZF8xJ30sXG4gICAgICAgIF0sIFwicGF0dGVybjJcIik7XG4gICAgXG4gICAgdGhpcy5fbGV2ZWxHZW5lcmF0b3IuYWRkUGF0dGVybihbXG4gICAgICAgIHt4OjEwMCwgeTp0b3BfeSwgcG9vbElkOid0b3BfcGlwZV8xJ30sXG4gICAgICAgIHt4OjAsIHk6Ym90dG9tX3ksIHBvb2xJZDonYm90dG9tX2J1aWxkaW5nXzInfSxcbiAgICAgICAge3g6MCwgeTptaWRfeSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICB7eDoxMDAsIHk6bWlkX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6MjAwLCB5Om1pZF95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIF0sIFwicGF0dGVybjNcIik7XG4gICAgXG4gICAgdGhpcy5fbGV2ZWxHZW5lcmF0b3IuYWRkUGF0dGVybihbXG4gICAgICAgIHt4OjAsIHk6Y29sbGVjdGlibGVfdG9wX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6MTAwLCB5OmNvbGxlY3RpYmxlX3RvcF95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIHt4OjIwMCwgeTpjb2xsZWN0aWJsZV90b3BfeSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICB7eDowLCB5OmNvbGxlY3RpYmxlX2JvdHRvbV95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIHt4OjEwMCwgeTpjb2xsZWN0aWJsZV9ib3R0b21feSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICB7eDoyMDAsIHk6Y29sbGVjdGlibGVfYm90dG9tX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6MzAwLCB5OnRvcF95LCBwb29sSWQ6J3RvcF9jcmF0ZV8xJywgb3JpZ2luYWxYOjMwMH0sXG4gICAgICAgIHt4OjMwMCwgeTpib3R0b21feSwgcG9vbElkOidib3R0b21fYnVzaF8xJywgb3JpZ2luYWxYOjMwMH0sXG4gICAgICAgIF0sIFwicGF0dGVybjRcIik7XG5cbiAgICB0aGlzLl9sZXZlbEdlbmVyYXRvci5hZGRQYXR0ZXJuKFtcbiAgICAgICAge3g6MCwgeTpib3R0b21feSwgcG9vbElkOidib3R0b21fYmlsbGJvYXJkXzEnfSxcbiAgICAgICAgXSwgXCJwYXR0ZXJuNVwiKTtcbiAgICBcbiAgICB0aGlzLl9sZXZlbEdlbmVyYXRvci5hZGRQYXR0ZXJuKFtcbiAgICAgICAge3g6MCwgeTp0b3BfeSwgcG9vbElkOid0b3BfcGlwZV8xJ30sXG4gICAgICAgIHt4OjAsIHk6bWlkX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6MTAwLCB5Om1pZF95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIHt4OjIwMCwgeTptaWRfeSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICBdLCBcInBhdHRlcm42XCIpO1xuXG4gICAgdGhpcy5fbGV2ZWxHZW5lcmF0b3IuYWRkUGF0dGVybihbXG4gICAgICAgIHt4OjIwMCwgeTp0b3BfeSwgcG9vbElkOid0b3BfcGlwZV8xJ30sXG4gICAgICAgIHt4OjAsIHk6Ym90dG9tX3ksIHBvb2xJZDonYm90dG9tX2JpbGxib2FyZF8xJ30sXG4gICAgICAgIF0sIFwicGF0dGVybjdcIik7XG4gICAgXG4gICAgdGhpcy5fbGV2ZWxHZW5lcmF0b3IuYWRkUGF0dGVybihbXG4gICAgICAgIHt4OjIwMCwgeTp0b3BfeSwgcG9vbElkOid0b3BfYmxvY2tzXzInfSxcbiAgICAgICAge3g6MCwgeTpib3R0b21feSwgcG9vbElkOidib3R0b21fYnVpbGRpbmdfMid9LFxuICAgICAgICB7eDowLCB5Om1pZF95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIHt4OjEwMCwgeTptaWRfeSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICB7eDoyMDAsIHk6bWlkX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAgXSwgXCJwYXR0ZXJuOFwiKTtcbiAgICBcbiAgICAvL01pZGRsZSBQYXR0ZXJuc1xuXG4gICAgdGhpcy5fbGV2ZWxHZW5lcmF0b3IuYWRkUGF0dGVybihbXG4gICAgICAgIHt4OjAsIHk6bWlkX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6MTAwLCB5Om1pZF95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIHt4OjIwMCwgeTptaWRfeSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICB7eDozMDAsIHk6bWlkX3ksIHBvb2xJZDonbWlkX3BpcGVfMScsIG9yaWdpbmFsWDozMDB9LFxuICAgICAgICBdLCBcInBhdHRlcm5NaWQxXCIpO1xuXG4gICAgdGhpcy5fbGV2ZWxHZW5lcmF0b3IuYWRkUGF0dGVybihbXG4gICAgICAgIHt4OjAsIHk6bWlkX3ksIHBvb2xJZDonbWlkX2Nhcl8xJ30sXG4gICAgICAgIF0sIFwicGF0dGVybk1pZDJcIik7XG5cbiAgICB0aGlzLl9sZXZlbEdlbmVyYXRvci5hZGRQYXR0ZXJuKFtcbiAgICAgICAge3g6MCwgeTptaWRfeSwgcG9vbElkOidtaWRfY3JhdGVfMSd9LFxuICAgICAgICBdLCBcInBhdHRlcm5NaWQzXCIpO1xuXG4gICAgdGhpcy5fbGV2ZWxHZW5lcmF0b3IuYWRkUGF0dGVybihbXG4gICAgICAgIHt4OjAsIHk6bWlkX3ksIHBvb2xJZDonbWlkX2NyYXRlXzEnfSxcbiAgICAgICAge3g6NTAwLCB5Om1pZF95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJywgb3JpZ2luYWxYOjUwMH0sXG4gICAgICAgIHt4OjYwMCwgeTptaWRfeSwgcG9vbElkOidjb2xsZWN0aWJsZScsIG9yaWdpbmFsWDo2MDB9LFxuICAgICAgICB7eDo3MDAsIHk6bWlkX3ksIHBvb2xJZDonY29sbGVjdGlibGUnLCBvcmlnaW5hbFg6NzAwfSxcbiAgICAgICAgXSwgXCJwYXR0ZXJuTWlkNFwiKTtcblxuICAgIHRoaXMuX2xldmVsR2VuZXJhdG9yLmFkZFBhdHRlcm4oW1xuICAgICAgICB7eDowLCB5Om1pZF95LCBwb29sSWQ6J21pZF9jYXJfMid9LFxuICAgICAgICB7eDowLCB5OmNvbGxlY3RpYmxlX3RvcF95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIHt4OjEwMCwgeTpjb2xsZWN0aWJsZV90b3BfeSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICB7eDoyMDAsIHk6Y29sbGVjdGlibGVfdG9wX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6MCwgeTpjb2xsZWN0aWJsZV9ib3R0b21feSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICB7eDoxMDAsIHk6Y29sbGVjdGlibGVfYm90dG9tX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6MjAwLCB5OmNvbGxlY3RpYmxlX2JvdHRvbV95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIF0sIFwicGF0dGVybk1pZDVcIik7XG5cbiAgICB0aGlzLl9sZXZlbEdlbmVyYXRvci5hZGRQYXR0ZXJuKFtcbiAgICAgICAge3g6MCwgeTptaWRfeSwgcG9vbElkOidtaWRfYmVuY2hfMSd9LFxuICAgICAgICBdLCBcInBhdHRlcm5NaWQ2XCIpO1xuXG4gICAgdGhpcy5fbGV2ZWxHZW5lcmF0b3IuYWRkUGF0dGVybihbXG4gICAgICAgIHt4OjAsIHk6bWlkX3ksIHBvb2xJZDonbWlkX2Nhcl8zJ30sXG4gICAgICAgIHt4OjUwMCwgeTptaWRfeSwgcG9vbElkOidjb2xsZWN0aWJsZScsIG9yaWdpbmFsWDo1MDB9LFxuICAgICAgICB7eDo2MDAsIHk6bWlkX3ksIHBvb2xJZDonY29sbGVjdGlibGUnLCBvcmlnaW5hbFg6NjAwfSxcbiAgICAgICAge3g6NzAwLCB5Om1pZF95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJywgb3JpZ2luYWxYOjcwMH0sXG4gICAgICAgIF0sIFwicGF0dGVybk1pZDdcIik7XG5cbiAgICB0aGlzLl9sZXZlbEdlbmVyYXRvci5hZGRQYXR0ZXJuKFtcbiAgICAgICAge3g6MCwgeTptaWRfeSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICB7eDoxMDAsIHk6bWlkX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6MjAwLCB5Om1pZF95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIHt4OjMwMCwgeTptaWRfeSwgcG9vbElkOidtaWRfY3JhdGVfMScsIG9yaWdpbmFsWDozMDB9LFxuICAgICAgICBdLCBcInBhdHRlcm5NaWQ4XCIpO1xuXG4gICAgLy9Db2xsZWN0aWJsZSBQYXR0ZXJuc1xuXG4gICAgdGhpcy5fbGV2ZWxHZW5lcmF0b3IuYWRkUGF0dGVybihbXG4gICAgICAgIHt4OjAsIHk6bWlkX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6MTAwLCB5Om1pZF95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIHt4OjIwMCwgeTptaWRfeSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICBdLCBcImNvbGxlY3RpYmxlczFcIik7XG5cbiAgICB0aGlzLl9sZXZlbEdlbmVyYXRvci5hZGRQYXR0ZXJuKFtcbiAgICAgICAge3g6MCwgeTpjb2xsZWN0aWJsZV90b3BfeSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICB7eDoxMDAsIHk6Y29sbGVjdGlibGVfdG9wX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6MjAwLCB5OmNvbGxlY3RpYmxlX3RvcF95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIHt4OjAsIHk6Y29sbGVjdGlibGVfYm90dG9tX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6MTAwLCB5OmNvbGxlY3RpYmxlX2JvdHRvbV95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIHt4OjIwMCwgeTpjb2xsZWN0aWJsZV9ib3R0b21feSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICBdLCBcImNvbGxlY3RpYmxlczJcIik7XG5cbiAgICB0aGlzLl9sZXZlbEdlbmVyYXRvci5hZGRQYXR0ZXJuKFtcbiAgICAgICAge3g6MCwgeTptaWRfeSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICB7eDoxMDAsIHk6bWlkX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6MjAwLCB5Om1pZF95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIHt4OjYwMCwgeTpjb2xsZWN0aWJsZV90b3BfeSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICB7eDo3MDAsIHk6Y29sbGVjdGlibGVfdG9wX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6ODAwLCB5OmNvbGxlY3RpYmxlX3RvcF95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIHt4OjYwMCwgeTpjb2xsZWN0aWJsZV9ib3R0b21feSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICB7eDo3MDAsIHk6Y29sbGVjdGlibGVfYm90dG9tX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6ODAwLCB5OmNvbGxlY3RpYmxlX2JvdHRvbV95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIF0sIFwiY29sbGVjdGlibGVzM1wiKTtcblxuICAgIC8vSW5pdGlhbCBQYXR0ZXJuXG5cbiAgICB0aGlzLl9sZXZlbEdlbmVyYXRvci5hZGRQYXR0ZXJuKFtcbiAgICAgICAge3g6MCwgeTptaWRfeSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICB7eDoxMDAsIHk6bWlkX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6MjAwLCB5Om1pZF95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIHt4OjUwMCwgeTptaWRfeSwgcG9vbElkOidtaWRfcGlwZV8xJ30sXG4gICAgICAgIHt4OjUwMCwgeTpjb2xsZWN0aWJsZV90b3BfeSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICB7eDo2MDAsIHk6Y29sbGVjdGlibGVfdG9wX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6NzAwLCB5OmNvbGxlY3RpYmxlX3RvcF95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIHt4OjUwMCwgeTpjb2xsZWN0aWJsZV9ib3R0b21feSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICB7eDo2MDAsIHk6Y29sbGVjdGlibGVfYm90dG9tX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6NzAwLCB5OmNvbGxlY3RpYmxlX2JvdHRvbV95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIHt4OjExMDAsIHk6bWlkX3ksIHBvb2xJZDonY29sbGVjdGlibGUnfSxcbiAgICAgICAge3g6MTIwMCwgeTptaWRfeSwgcG9vbElkOidjb2xsZWN0aWJsZSd9LFxuICAgICAgICB7eDoxMzAwLCB5Om1pZF95LCBwb29sSWQ6J2NvbGxlY3RpYmxlJ30sXG4gICAgICAgIF0sIFwiaW5pdGlhbFBhdHRlcm5cIik7XG5cbiAgICB0aGlzLl9sZXZlbEdlbmVyYXRvci5zZXRGcmVxdWVuY2llcygwLCAwKTtcbiAgICB0aGlzLl9sZXZlbEdlbmVyYXRvci5hZGRQcmVkZWZpbmVkUGF0dGVybignaW5pdGlhbFBhdHRlcm4nKTtcbiAgICB0aGlzLl9sZXZlbEdlbmVyYXRvci5zZXRGcmVxdWVuY2llcyg0MDAsIDQwMCwgZmFsc2UpO1xuXG4vL0Zsb2F0ZXJzXG4gICAgdGhpcy5fZmxvYXRlckdlbmVyYXRvciA9IG5ldyBTY3JvbGxlck9iamVjdEdlbmVyYXRvcihbXG4gICAgICAgIFxuICAgICAgICB7aWQ6XCJtaWRfcGlwZV8xXCIsIGJhc2U6QmFja2dyb3VuZEZsb2F0ZXIsIGFyZ3M6WydiZ19vYnN0XzcnLCAnbWlkX3BpcGVfMSddfSxcbiAgICAgICAge2lkOlwibWlkX2JlbmNoXzFcIiwgYmFzZTpCYWNrZ3JvdW5kRmxvYXRlciwgYXJnczpbJ2JnX29ic3RfMicsICdtaWRfYmVuY2hfMSddfSxcbiAgICAgICAge2lkOlwibWlkX2Nhcl8xXCIsIGJhc2U6QmFja2dyb3VuZEZsb2F0ZXIsIGFyZ3M6WydiZ19vYnN0XzYnLCAnbWlkX2Nhcl8xJ119LFxuICAgICAgICB7aWQ6XCJtaWRfY2FyXzJcIiwgYmFzZTpCYWNrZ3JvdW5kRmxvYXRlciwgYXJnczpbJ2JnX29ic3RfNCcsICdtaWRfY2FyXzInXX0sXG4gICAgICAgIHtpZDpcIm1pZF9jYXJfM1wiLCBiYXNlOkJhY2tncm91bmRGbG9hdGVyLCBhcmdzOlsnYmdfb2JzdF8zJywgJ21pZF9jYXJfMyddfSxcbiAgICAgICAge2lkOlwibWlkX3RyZWVfMVwiLCBiYXNlOkJhY2tncm91bmRGbG9hdGVyLCBhcmdzOlsnYmdfb2JzdF81JywgJ21pZF90cmVlXzEnXX0sXG4gICAgICAgIHtpZDpcIm1pZF9jcmF0ZV8xXCIsIGJhc2U6QmFja2dyb3VuZEZsb2F0ZXIsIGFyZ3M6WydiZ19vYnN0XzEnLCAnbWlkX2NyYXRlXzEnXX0sXG4gICAgXSk7XG4gICAgdGhpcy5fZmxvYXRlckdlbmVyYXRvci5zaWduYWxzLmdlbmVyYXRlT2JqZWN0cy5hZGQodGhpcy5vbkdlbmVyYXRlRmxvYXRlciwgdGhpcyk7XG4gICAgXG4gICAgdGhpcy5fZmxvYXRlckdlbmVyYXRvci5hZGRQYXR0ZXJuKFtcbiAgICAgICAge3g6MCwgeTowLCBwb29sSWQ6J21pZF9waXBlXzEnfVxuICAgIF0sICdmbG9hdGVyMScpO1xuXG4gICAgdGhpcy5fZmxvYXRlckdlbmVyYXRvci5hZGRQYXR0ZXJuKFtcbiAgICAgICAge3g6MCwgeTowLCBwb29sSWQ6J21pZF9iZW5jaF8xJ31cbiAgICBdLCAnZmxvYXRlcjInKTtcblxuICAgIHRoaXMuX2Zsb2F0ZXJHZW5lcmF0b3IuYWRkUGF0dGVybihbXG4gICAgICAgIHt4OjAsIHk6MCwgcG9vbElkOidtaWRfdHJlZV8xJ31cbiAgICBdLCAnZmxvYXRlcjMnKTtcblxuICAgIHRoaXMuX2Zsb2F0ZXJHZW5lcmF0b3IuYWRkUGF0dGVybihbXG4gICAgICAgIHt4OjAsIHk6MCwgcG9vbElkOidtaWRfY2FyXzEnfVxuICAgIF0sICdmbG9hdGVyNCcpO1xuXG4gICAgdGhpcy5fZmxvYXRlckdlbmVyYXRvci5hZGRQYXR0ZXJuKFtcbiAgICAgICAge3g6MCwgeTowLCBwb29sSWQ6J21pZF9jYXJfMid9XG4gICAgXSwgJ2Zsb2F0ZXI1Jyk7XG5cbiAgICB0aGlzLl9mbG9hdGVyR2VuZXJhdG9yLmFkZFBhdHRlcm4oW1xuICAgICAgICB7eDowLCB5OjAsIHBvb2xJZDonbWlkX2Nhcl8zJ31cbiAgICBdLCAnZmxvYXRlcjYnKTtcblxuICAgIHRoaXMuX2Zsb2F0ZXJHZW5lcmF0b3IuYWRkUGF0dGVybihbXG4gICAgICAgIHt4OjAsIHk6MCwgcG9vbElkOidtaWRfY3JhdGVfMSd9XG4gICAgXSwgJ2Zsb2F0ZXI3Jyk7XG5cbiAgICB0aGlzLl9mbG9hdGVyR2VuZXJhdG9yLnNldEZyZXF1ZW5jaWVzKDMwMCwgNDAwKTtcblxuXG4vL0ZvcmVncm91bmQgU2hhZG93c1xuICAgIHRoaXMuX2ZvcmVncm91bmRHZW5lcmF0b3IgPSBuZXcgU2Nyb2xsZXJPYmplY3RHZW5lcmF0b3IoW1xuICAgICAgICB7aWQ6XCJzaGFkb3dfMVwiLCBiYXNlOkZvcmVncm91bmRTaGFkb3csIGFyZ3M6W1wiZmdfZmFzdHNoYWRvd18wMFwiXX0sXG4gICAgICAgIHtpZDpcInNoYWRvd18yXCIsIGJhc2U6Rm9yZWdyb3VuZFNoYWRvdywgYXJnczpbXCJmZ19mYXN0c2hhZG93XzAxXCJdfSxcbiAgICAgICAge2lkOlwic2hhZG93XzNcIiwgYmFzZTpGb3JlZ3JvdW5kU2hhZG93LCBhcmdzOltcImZnX2Zhc3RzaGFkb3dfMDJcIl19XG4gICAgXSk7XG4gICAgdGhpcy5fZm9yZWdyb3VuZEdlbmVyYXRvci5zaWduYWxzLmdlbmVyYXRlT2JqZWN0cy5hZGQodGhpcy5vbkdlbmVyYXRlRm9yZWdyb3VuZFNoYWRvdywgdGhpcyk7XG5cbiAgICB0aGlzLl9mb3JlZ3JvdW5kR2VuZXJhdG9yLmFkZFBhdHRlcm4oW3t4OjAsIHk6Q29tbW9uLlNUQUdFX0hFSUdIVC8yLCBwb29sSWQ6J3NoYWRvd18xJ31dLCAnc2hhZG93c18xJyk7XG4gICAgdGhpcy5fZm9yZWdyb3VuZEdlbmVyYXRvci5hZGRQYXR0ZXJuKFt7eDowLCB5OkNvbW1vbi5TVEFHRV9IRUlHSFQvMiwgcG9vbElkOidzaGFkb3dfMid9XSwgJ3NoYWRvd3NfMicpO1xuICAgIHRoaXMuX2ZvcmVncm91bmRHZW5lcmF0b3IuYWRkUGF0dGVybihbe3g6MCwgeTpDb21tb24uU1RBR0VfSEVJR0hULzIsIHBvb2xJZDonc2hhZG93XzMnfV0sICdzaGFkb3dzXzMnKTtcbiAgICB0aGlzLl9mb3JlZ3JvdW5kR2VuZXJhdG9yLnNldEZyZXF1ZW5jaWVzKDkwLCAxNTApO1xuXG5cbi8vQ29sbGlzaW9uc1xuICAgIHRoaXMuX3Njcm9sbGVyRW5naW5lLmFkZENvbGxpc2lvbkRldGVjdG9yKFwiYXZhdGFyXCIsIFwib2JzdGFjbGVcIik7XG4gICAgdGhpcy5fc2Nyb2xsZXJFbmdpbmUuYWRkQ29sbGlzaW9uRGV0ZWN0b3IoXCJhdmF0YXJcIiwgXCJjb2xsZWN0aWJsZVwiKTtcbiAgICB0aGlzLl9zY3JvbGxlckVuZ2luZS5zaWduYWxzLmNvbGxpc2lvbkZpcmVkLmFkZCh0aGlzLm9uQ29sbGlzaW9uLCB0aGlzKTtcblxuLy9VSVxuICAgIHRoaXMuX2FkZFBhdXNlQnV0dG9uKCk7XG4gICAgdGhpcy5fYWRkTXV0ZUJ1dHRvbigpO1xuXG4gICAgdGhpcy5fc2NvcmVCb3ggPSBuZXcgU2NvcmVCb3goKTtcbiAgICB0aGlzLl9zY29yZUJveC54ID0gQ29tbW9uLlNUQUdFX1dJRFRILzI7XG4gICAgdGhpcy5fc2NvcmVCb3gueSA9IHRoaXMuX2d1aUJ1dHRvblRvcE1hcmdpbi0yO1xuICAgIHRoaXMuX3Njb3JlQm94LmluaXQoKTtcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3Njb3JlQm94KTtcbiAgICB0aGlzLl9zY29yZUJveC51cGRhdGVTY29yZSgwKTtcblxuICAgIGlmKENvbW1vbi5nZW5lcmF0ZWRUZXh0dXJlcy5jb2xsZWN0aWJsZUJvbnVzID09IG51bGwpXG4gICAge1xuICAgICAgICB2YXIgdGV4dCA9IG5ldyBwMy5CaXRtYXBUZXh0KFwiK1wiICsgdGhpcy5fY29sbGVjdGlibGVCb251cy50b1N0cmluZygpLCB0aGlzLl9hc3NldE1hbmFnZXIuZ2V0Rm9udEF0bGFzKFwidW5wYWNrOTBfcGlua1wiKSwgcDMuQml0bWFwVGV4dC5BTElHTl9MRUZUKTtcbiAgICAgICAgQ29tbW9uLmdlbmVyYXRlZFRleHR1cmVzLmNvbGxlY3RpYmxlQm9udXMgPSB0ZXh0LmdlbmVyYXRlVGV4dHVyZShDb21tb24ucmVuZGVyZXIsIDEuMCwgUElYSS5TQ0FMRV9NT0RFUy5MSU5FQVIpO1xuICAgIH1cblxuLy9Tb3VuZFxuICAgIFNvdW5kU0ZYLnBsYXkoXCJtdXNpY19sb29wXCIsIHtsb29wOnRydWV9KTtcbiAgICBTb3VuZFNGWC5wbGF5KCdzZnhfcHBnX2xldmVsX3N0YXJ0XzAwJywgbnVsbCwgLjUpO1xuXG59O1xuXG5HYW1lU2NyZWVuLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKVxue1xuICAgIFNvdW5kU0ZYLnN0b3AoXCJtdXNpY19sb29wXCIpO1xuICAgIENvbW1vbi5hbmltYXRvci5yZW1vdmVBbGwoKTtcbn1cblxuLyoqXG4gKi9cbkdhbWVTY3JlZW4ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKClcbntcbiAgICBpZih0aGlzLl9nYW1lRW5kZWQgfHwgdGhpcy5fcGF1c2VkKVxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgIFNpbXBsZVNjcmVlbi5wcm90b3R5cGUudXBkYXRlLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLl9zY3JvbGxlckVuZ2luZS52aWV3WCAtPSB0aGlzLnNjcm9sbFNwZWVkO1xuICAgIHRoaXMuX3Njcm9sbGVyRW5naW5lLnVwZGF0ZSgpO1xuXG4gICAgdGhpcy5fc2Nyb2xsSW5jID0gTWF0aC5taW4odGhpcy5fc2Nyb2xsSW5jICsgdGhpcy5fc2Nyb2xsSW5jQWRkLCB0aGlzLl9zY3JvbGxJbmNNYXgpO1xuXG4gICAgdGhpcy5fbGV2ZWxHZW5lcmF0b3IudXBkYXRlKCk7XG4gICAgdGhpcy5fZmxvYXRlckdlbmVyYXRvci51cGRhdGUoKTtcbiAgICB0aGlzLl9mb3JlZ3JvdW5kR2VuZXJhdG9yLnVwZGF0ZSgpO1xuXG4gICAgdmFyIHAgPSB0aGlzLnNjcm9sbEluY1BlcmNlbnRhZ2U7XG5cbiAgICBpZighdGhpcy5fZmlyc3RVcGRhdGUpXG4gICAge1xuICAgICAgICAvL3RoaXMuX2xldmVsR2VuZXJhdG9yLnNldEZyZXF1ZW5jaWVzKDEwMCAtIE1hdGgucm91bmQoOTAqcCksIDE0MCsoOTAqKDEtcCkpIC0gTWF0aC5yb3VuZCgxNTAqcCksIGZhbHNlKTtcbiAgICAgICAgdGhpcy5fZmxvYXRlckdlbmVyYXRvci5zZXRGcmVxdWVuY2llcygxNTAgLSBNYXRoLnJvdW5kKDkwKnApLCAxNjArKDUwKigxLXApKSAtIE1hdGgucm91bmQoMTIwKnApLCBmYWxzZSk7XG4gICAgfVxuICAgIGVsc2VcbiAgICAgICAgdGhpcy5fbGV2ZWxHZW5lcmF0b3IucmVtb3ZlUGF0dGVybignaW5pdGlhbFBhdHRlcm4nKTtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLl9hdmF0YXJUcmFpbHMubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgICB0aGlzLl9hdmF0YXJUcmFpbFBhcnRpY2xlc1tpXS51cGRhdGVPd25lclBvcyh0aGlzLl9hdmF0YXJzW2ldLngsIHRoaXMuX2F2YXRhcnNbaV0ueSArIDEwKTtcbiAgICAgICAgdGhpcy5fYXZhdGFyVHJhaWxQYXJ0aWNsZXNbaV0ubWluTGlmZXRpbWUgPSAwLjMgLSAoMC4yICogcCk7XG4gICAgICAgIHRoaXMuX2F2YXRhclRyYWlsUGFydGljbGVzW2ldLm1heExpZmV0aW1lID0gMC4zIC0gKDAuMiAqIHApO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5fYXZhdGFyVHJhaWxzW2ldLmRyYXcoXG4gICAgICAgICAgICB0aGlzLl9hdmF0YXJzW2ldLngsXG4gICAgICAgICAgICB0aGlzLl9hdmF0YXJzW2ldLnlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLl9maXJzdFVwZGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMuX2Rpc3RhbmNlICs9IHRoaXMuc2Nyb2xsU3BlZWQgLyAxMDtcbiAgICB0aGlzLl9zY29yZUJveC51cGRhdGVTY29yZShNYXRoLnJvdW5kKHRoaXMuX2Rpc3RhbmNlKSk7XG5cbiAgICBpZih0aGlzLl9jdXJyZW50QmFja2dyb3VuZENvbG91ciA9PSBNYXRoLmZsb29yKHRoaXMuX2Rpc3RhbmNlLzEwMDApLTEpXG4gICAge1xuICAgICAgICB0aGlzLl9jdXJyZW50QmFja2dyb3VuZENvbG91cisrO1xuICAgICAgICB0aGlzLnNldEJhY2tncm91bmRDb2xvdXIoKTtcbiAgICB9XG59O1xuXG4vKipcbiAqL1xuR2FtZVNjcmVlbi5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oKVxue1xuICAgIFNpbXBsZVNjcmVlbi5wcm90b3R5cGUucmVzaXplLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLl9wYXVzZUJ1dHRvbi54ID0gdGhpcy5fZ2V0U2Vjb25kQnV0dG9uUG9zaXRpb25SaWdodCgpO1xuICAgIHRoaXMuX211dGVCdXR0b24ueCA9IHRoaXMuX2dldEZpcnN0QnV0dG9uUG9zaXRpb25SaWdodCgpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge0Z1bmN0aW9uPX0gY2FsbGJhY2tcbiAqIEBwYXJhbSB7Kj19c2NvcGVcbiAqL1xuR2FtZVNjcmVlbi5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oY2FsbGJhY2ssIHNjb3BlKSB7XG4gICAgXG4gICAgU2ltcGxlU2NyZWVuLnByb3RvdHlwZS5hbmltYXRlSW4uY2FsbCh0aGlzKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtGdW5jdGlvbj19IGNhbGxiYWNrXG4gKiBAcGFyYW0geyo9fSBzY29wZVxuICovXG5HYW1lU2NyZWVuLnByb3RvdHlwZS5hbmltYXRlT3V0ID0gZnVuY3Rpb24oY2FsbGJhY2ssIHNjb3BlKSB7XG4gICAgXG4gICAgU2ltcGxlU2NyZWVuLnByb3RvdHlwZS5hbmltYXRlT3V0LmNhbGwodGhpcyk7XG59O1xuXG5cbkdhbWVTY3JlZW4ucHJvdG90eXBlLnNldEZvcm1hdGlvbiA9IGZ1bmN0aW9uKGZvcm1hdGlvbiwgYW5pbWF0ZSlcbntcblx0aWYoYW5pbWF0ZSA9PSB1bmRlZmluZWQpXG5cdFx0YW5pbWF0ZSA9IHRydWU7XG5cblx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMuX2F2YXRhcnMubGVuZ3RoOyBpKyspXG5cdHtcblx0XHR2YXIgaWQgPSB0aGlzLl9hdmF0YXJzW2ldLmdpcmw7XG5cdFx0dmFyIHBvcyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuX2F2YXRhclBvc2l0aW9uc1tmb3JtYXRpb25dW2lkXS5sZW5ndGgpO1xuXHRcdHZhciB4ID0gdGhpcy5fYXZhdGFyUG9zaXRpb25zW2Zvcm1hdGlvbl1baWRdW3Bvc10ueDtcblx0XHR2YXIgeSA9IHRoaXMuX2F2YXRhclBvc2l0aW9uc1tmb3JtYXRpb25dW2lkXVtwb3NdLnk7XG5cblx0XHRpZihhbmltYXRlKVxuXHRcdHtcblx0XHRcdGlmKHRoaXMuX3N3aXRjaGluZylcblx0XHRcdHtcblx0XHRcdFx0VHdlZW5NYXgua2lsbFR3ZWVuc09mKHRoaXMuX2F2YXRhcnNbaV0pO1xuXHRcdFx0fVxuXG5cdFx0XHRDb21tb24uYW5pbWF0b3IuYWRkKFR3ZWVuTWF4LnRvKHRoaXMuX2F2YXRhcnNbaV0sIC4yNS0oLjE2KnRoaXMuc2Nyb2xsSW5jUGVyY2VudGFnZSksIHtkZWxheTppKi4wNSwgcGVyc2lzdGVudFg6eCwgeTp5LCBlYXNlOlNpbmUuZWFzZUluT3V0LCBvbkNvbXBsZXRlU2NvcGU6dGhpcywgb25Db21wbGV0ZVBhcmFtczpbaWRdLCBvbkNvbXBsZXRlOmZ1bmN0aW9uKGlkKXtcblx0XHRcdFx0aWYoaWQgPT0gJ2J1dHRlcmN1cCcpXG5cdFx0XHRcdFx0dGhpcy5fc3dpdGNoaW5nID0gZmFsc2U7XG5cdFx0XHR9fSkpO1xuXG5cdFx0XHRpZihpZCA9PSAnYnV0dGVyY3VwJylcbiAgICAgICAgICAgIHtcblx0XHRcdFx0dGhpcy5fc3dpdGNoaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBTb3VuZFNGWC5wbGF5UmFuZG9tRnJvbShbJ3NmeF9wcGdfbW92ZV8wMCcsICdzZnhfcHBnX21vdmVfMDEnLCAnc2Z4X3BwZ19tb3ZlXzAyJywgJ3NmeF9wcGdfbW92ZV8wMycsICdzZnhfcHBnX21vdmVfMDQnLCAnc2Z4X3BwZ19tb3ZlXzA1JywgJ3NmeF9wcGdfbW92ZV8wNiddKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoZm9ybWF0aW9uID09IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ29tbW9uLmFuaW1hdG9yLmFkZChUd2Vlbk1heC50byh0aGlzLl9lbmdpbmVIb2xkZXIuc2NhbGUsIC41LCB7eDoxLjEsIHk6MS4xLCBlYXNlOlNpbmUuZWFzZUluT3V0fSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIENvbW1vbi5hbmltYXRvci5hZGQoVHdlZW5NYXgudG8odGhpcy5fZW5naW5lSG9sZGVyLnNjYWxlLCAuNSwge3g6MSwgeToxLCBlYXNlOlNpbmUuZWFzZUluT3V0fSkpO1xuICAgICAgICAgICAgfVxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0dGhpcy5fYXZhdGFyc1tpXS5wZXJzaXN0ZW50WCA9IHg7XG5cdFx0XHR0aGlzLl9hdmF0YXJzW2ldLnkgPSB5O1xuXHRcdH1cblx0fVxuXG5cdHRoaXMuX2N1cnJlbnRGb3JtYXRpb24gPSBmb3JtYXRpb247XG59XG5cbkdhbWVTY3JlZW4ucHJvdG90eXBlLmdhbWVPdmVyID0gZnVuY3Rpb24oKVxue1xuICAgIHRoaXMuX2dhbWVFbmRlZCA9IHRydWU7XG4gICAgdGhpcy5fcGF1c2VCdXR0b24uaW50ZXJhY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLl9oaXRBcmVhLmludGVyYWN0aXZlID0gZmFsc2U7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuX2F2YXRhcnMubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgICBUd2Vlbk1heC5raWxsVHdlZW5zT2YodGhpcy5fYXZhdGFyc1tpXSk7XG4gICAgICAgIHRoaXMuX2F2YXRhclRyYWlsUGFydGljbGVzW2ldLmVtaXQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYXZhdGFyc1tpXS5zdG9wKCk7XG4gICAgfVxuICAgIFNvdW5kU0ZYLnBsYXlSYW5kb21Gcm9tKFsnc2Z4X3BwZ19oaXRfb2JzdGFjbGVfMDAnLCAnc2Z4X3BwZ19oaXRfb2JzdGFjbGVfMDEnXSk7XG5cbiAgICB2YXIgdGwgPSBuZXcgVGltZWxpbmVNYXgoKTtcbiAgICBDb21tb24uYW5pbWF0b3IuYWRkKHRsKTtcbiAgICB2YXIgbGltaXQgPSA1O1xuICAgIGZvcih2YXIgaSA9IGxpbWl0OyBpID49IDA7IGktLSlcbiAgICB7XG4gICAgICAgIHZhciB2YWwgPSBpKigxMDAvbGltaXQpO1xuICAgICAgICB0bC50byh0aGlzLl9lbmdpbmVIb2xkZXIsIC4xLCB7eDooQ29tbW9uLlNUQUdFX1dJRFRILzIpK3ZhbCwgZWFzZTpTaW5lLmVhc2VJbk91dH0pO1xuICAgICAgICB0bC50byh0aGlzLl9lbmdpbmVIb2xkZXIsIC4xLCB7eDooQ29tbW9uLlNUQUdFX1dJRFRILzIpLXZhbCwgZWFzZTpTaW5lLmVhc2VJbk91dH0pO1xuICAgIH1cblxuICAgIENvbW1vbi5hbmltYXRvci5hZGQoVHdlZW5NYXgudG8odGhpcy5fZW5naW5lSG9sZGVyLnNjYWxlLCAxLCB7ZGVsYXk6LjUsIHg6MS4yLCB5OjEuMiwgZWFzZTpTaW5lLmVhc2VPdXR9KSk7XG4gICAgQ29tbW9uLmFuaW1hdG9yLmFkZChUd2Vlbk1heC50byh0aGlzLl9lbmdpbmVIb2xkZXIsIC44LCB7ZGVsYXk6LjcsIHJvdGF0aW9uOigtMTArKE1hdGgucmFuZG9tKCkqMjApKSpQSVhJLkRFR19UT19SQUQsIGVhc2U6U2luZS5lYXNlT3V0fSkpO1xuXG4gICAgQ29tbW9uLmFuaW1hdG9yLnNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5zaWduYWxzLnJlcXVlc3RlZE5leHRTY3JlZW4uZGlzcGF0Y2goTWF0aC5yb3VuZCh0aGlzLl9kaXN0YW5jZSksIHRoaXMuX2hlYXJ0cyk7XG4gICAgfSwgMS41LCB0aGlzKTtcbn1cblxuR2FtZVNjcmVlbi5wcm90b3R5cGUuaGlkZUdVSSA9IGZ1bmN0aW9uKClcbntcbiAgICB0aGlzLl9wYXVzZUJ1dHRvbi52aXNpYmxlID0gZmFsc2U7XG4gICAgdGhpcy5fbXV0ZUJ1dHRvbi52aXNpYmxlID0gZmFsc2U7XG4gICAgdGhpcy5faGl0QXJlYS5pbnRlcmFjdGl2ZSA9IGZhbHNlO1xuXG59XG5cbkdhbWVTY3JlZW4ucHJvdG90eXBlLnNob3dHVUkgPSBmdW5jdGlvbigpXG57XG4gICAgdGhpcy5fcGF1c2VCdXR0b24udmlzaWJsZSA9IHRydWU7XG4gICAgdGhpcy5yZW1vdmVDaGlsZCh0aGlzLl9tdXRlQnV0dG9uKTtcbiAgICB0aGlzLl9hZGRNdXRlQnV0dG9uKCk7XG4gICAgdGhpcy5faGl0QXJlYS5pbnRlcmFjdGl2ZSA9IHRydWU7XG59XG5cbkdhbWVTY3JlZW4ucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24oKVxue1xuICAgIHRoaXMuX3BhdXNlZCA9IHRydWU7XG4gICAgVHdlZW5NYXgucGF1c2VBbGwoKTtcbiAgICB0aGlzLl9zY3JvbGxlckVuZ2luZS5wYXVzZSgpO1xuICAgIGNvbnNvbGUubG9nKCdnYW1lIHBhdXNlJyk7XG59XG5cbkdhbWVTY3JlZW4ucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uKClcbntcbiAgICB0aGlzLl9wYXVzZWQgPSBmYWxzZTtcbiAgICBUd2Vlbk1heC5yZXN1bWVBbGwoKTtcbiAgICB0aGlzLl9zY3JvbGxlckVuZ2luZS5yZXN1bWUoKTtcbiAgICBjb25zb2xlLmxvZygnZ2FtZSByZXN1bWUnKTtcbn1cblxuR2FtZVNjcmVlbi5wcm90b3R5cGUuaW50cm9kdWNlQXZhdGFycyA9IGZ1bmN0aW9uKClcbntcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5fYXZhdGFycy5sZW5ndGg7IGkrKylcbiAgICB7XG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLl9hdmF0YXJzW2ldLnBlcnNpc3RlbnRYO1xuICAgICAgICB0aGlzLl9hdmF0YXJzW2ldLnBlcnNpc3RlbnRYIC09IENvbW1vbi5TVEFHRV9XSURUSCAvIDI7XG4gICAgICAgIENvbW1vbi5hbmltYXRvci5hZGQoVHdlZW5NYXgudG8odGhpcy5fYXZhdGFyc1tpXSwgLjUsIHtkZWxheTouNCArICguMippKSwgcGVyc2lzdGVudFg6dGFyZ2V0LCBlYXNlOkV4cG8uZWFzZU91dH0pKTtcbiAgICB9XG59XG5cbkdhbWVTY3JlZW4ucHJvdG90eXBlLnNldEJhY2tncm91bmRDb2xvdXIgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIGJnTnVtYmVyID0gdGhpcy5fY3VycmVudEJhY2tncm91bmRDb2xvdXIgJSB0aGlzLl9tYXhCYWNrZ3JvdW5kQ29sb3VycztcblxuICAgIHZhciBiYWNrZ3JvdW5kID0gbmV3IFBJWEkuU3ByaXRlKENvbW1vbi5nZW5lcmF0ZWRUZXh0dXJlc1snc2t5JyArIGJnTnVtYmVyICsgJ1NxdWFyZSddKTtcbiAgICBiYWNrZ3JvdW5kLndpZHRoID0gQ29tbW9uLlNUQUdFX1dJRFRIO1xuICAgIGJhY2tncm91bmQuaGVpZ2h0ID0gQ29tbW9uLlNUQUdFX0hFSUdIVDtcbiAgICBiYWNrZ3JvdW5kLmFscGhhID0gMDtcbiAgICB0aGlzLl9iYWNrZ3JvdW5kSG9sZGVyLmFkZENoaWxkKGJhY2tncm91bmQpO1xuXG4gICAgQ29tbW9uLmFuaW1hdG9yLmFkZChUd2Vlbk1heC50byhiYWNrZ3JvdW5kLCAyLCB7YWxwaGE6MSwgb25Db21wbGV0ZVNjb3BlOnRoaXMsIG9uQ29tcGxldGU6ZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fYmFja2dyb3VuZEhvbGRlci5yZW1vdmVDaGlsZCh0aGlzLl9iYWNrZ3JvdW5kKTtcbiAgICAgICAgdGhpcy5fYmFja2dyb3VuZCA9IGJhY2tncm91bmQ7XG4gICAgfX0pKTtcblxuICAgIHZhciBvYmplY3RzID0gdGhpcy5fc2Nyb2xsZXJFbmdpbmUuZ2V0QWxsT2JqZWN0c09mVHlwZShcImJhY2tncm91bmRJbWFnZVwiKTtcbiAgICBvYmplY3RzID0gb2JqZWN0cy5jb25jYXQodGhpcy5fc2Nyb2xsZXJFbmdpbmUuZ2V0QWxsT2JqZWN0c09mVHlwZShcImZsb2F0ZXJcIikpO1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IG9iamVjdHMubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgICBvYmplY3RzW2ldLnNoaWZ0Q29sb3VyKGJnTnVtYmVyKTtcbiAgICB9XG59XG5cbkdhbWVTY3JlZW4ucHJvdG90eXBlLmFkanVzdEhlYXJ0c1dpdGhPYnN0YWNsZXMgPSBmdW5jdGlvbigpXG57XG4gICAgdmFyIGFyciA9IFtcInBhdHRlcm4xXCIsIFwicGF0dGVybk1pZDRcIiwgXCJwYXR0ZXJuTWlkN1wiLCBcInBhdHRlcm40XCIsIFwicGF0dGVybk1pZDFcIiwgXCJwYXR0ZXJuTWlkOFwiXTtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgICB2YXIgcGF0dGVybiA9IHRoaXMuX2xldmVsR2VuZXJhdG9yLmdldFBhdHRlcm4oYXJyW2ldKTtcbiAgICAgICAgZm9yKHZhciBqIGluIHBhdHRlcm4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHBhdHRlcm5bal0ub3JpZ2luYWxYICE9IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwYXR0ZXJuW2pdLnggPSBwYXR0ZXJuW2pdLm9yaWdpbmFsWCArICgyMDAqdGhpcy5zY3JvbGxJbmNQZXJjZW50YWdlKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwYXR0ZXJuW2pdLngpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gUFJJVkFURSBNRVRIT0RTXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5HYW1lU2NyZWVuLnByb3RvdHlwZS5fYWRkQmFja2dyb3VuZCA9IGZ1bmN0aW9uKGltYWdlcywgbGF5ZXJOYW1lLCB5T2Zmc2V0KVxue1xuICAgIHZhciBhcnIgPSBbXTtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBpbWFnZXMubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgICBhcnIucHVzaCh7XG4gICAgICAgICAgICBiYXNlOkJhY2tncm91bmRJbWFnZSwgXG4gICAgICAgICAgICAvL2FyZ3M6W2xheWVyTmFtZSArIFwiX1wiICsgKGkrMSksIHRydWUsIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKGltYWdlc1tpXS50ZXh0dXJlKV0sXG4gICAgICAgICAgICBhcmdzOltcImJhY2tncm91bmRJbWFnZVwiLCB0cnVlLCB0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShpbWFnZXNbaV0udGV4dHVyZSldLFxuICAgICAgICAgICAgYXJlYVJlY3Q6bmV3IFBJWEkuUmVjdGFuZ2xlKDAsIDAsIGltYWdlc1tpXS53aWR0aCwgaW1hZ2VzW2ldLmhlaWdodCksXG4gICAgICAgICAgICBvZmZzZXQ6e3g6aW1hZ2VzW2ldLm9mZnNldFgsIHk6aW1hZ2VzW2ldLm9mZnNldFl9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBsb29wID0gbmV3IFNjcm9sbGVyTG9vcGluZ1JhbmdlKGFyciwgdHJ1ZSwgZmFsc2UpO1xuICAgIGxvb3Auc2lnbmFscy5vYmplY3RHZW5lcmF0ZWQuYWRkKGZ1bmN0aW9uKG9iail7XG4gICAgICAgIG9iai5zZXRDb2xvdXIodGhpcy5fY3VycmVudEJhY2tncm91bmRDb2xvdXIgJSB0aGlzLl9tYXhCYWNrZ3JvdW5kQ29sb3Vycyk7XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5fc2Nyb2xsZXJFbmdpbmUuYWRkTG9vcGluZ1JhbmdlVG9MYXllcihsb29wLCBsYXllck5hbWUsIDAsIHlPZmZzZXQpO1xufTtcblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEVWRU5UU1xuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuR2FtZVNjcmVlbi5wcm90b3R5cGUub25Ub3VjaFN0YXJ0ID0gZnVuY3Rpb24oZXZlbnQpXG57XG5cdHRoaXMuc2V0Rm9ybWF0aW9uKHRoaXMuX2N1cnJlbnRGb3JtYXRpb24gPT0gMSA/IDAgOiAxLCB0cnVlKTtcbn1cblxuR2FtZVNjcmVlbi5wcm90b3R5cGUub25HZW5lcmF0ZU9ic3RhY2xlID0gZnVuY3Rpb24ob2JzdGFjbGVzKVxue1xuICAgIHZhciBsYXllciA9IHRoaXMuX3Njcm9sbGVyRW5naW5lLmdldExheWVyQ29udGFpbmVyKCdvYnN0YWNsZUxheWVyJyk7XG4gICAgdmFyIHggPSAobGF5ZXIueCotMSkgKyAodGhpcy5fc2Nyb2xsZXJFbmdpbmUudmlld0JvdW5kYXJ5LndpZHRoKTtcbiAgICB2YXIgZnVydGhlc3RPYnN0YWNsZSA9IDA7XG5cbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgb2JzdGFjbGVzLmxlbmd0aDsgaSsrKVxuICAgIHtcbiAgICAgICAgdGhpcy5fc2Nyb2xsZXJFbmdpbmUuYWRkT2JqZWN0VG9MYXllcihvYnN0YWNsZXNbaV0ub2JqLCAnb2JzdGFjbGVMYXllcicsIHggKyBvYnN0YWNsZXNbaV0ub2Zmc2V0LngsIG9ic3RhY2xlc1tpXS5vZmZzZXQueSk7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5fYXNzZXRNYW5hZ2VyLmdldEpTT04oJ29ic3RhY2xlX2RhdGEnKS5vYnN0YWNsZXNbdGhpcy5pZF07XG5cbiAgICAgICAgaWYob2JzdGFjbGVzW2ldLm9mZnNldC54ICsgb2JzdGFjbGVzW2ldLm9iai5hcmVhUmVjdC53aWR0aCA+IGZ1cnRoZXN0T2JzdGFjbGUpXG4gICAgICAgICAgICBmdXJ0aGVzdE9ic3RhY2xlID0gb2JzdGFjbGVzW2ldLm9mZnNldC54ICsgb2JzdGFjbGVzW2ldLm9iai5hcmVhUmVjdC53aWR0aDtcbiAgICB9XG5cbiAgICB2YXIgZnJlcXVlbmN5ID0gTWF0aC5jZWlsKGZ1cnRoZXN0T2JzdGFjbGUgLyB0aGlzLnNjcm9sbFNwZWVkKTtcbiAgICB0aGlzLl9sZXZlbEdlbmVyYXRvci5zZXRGcmVxdWVuY2llcyhmcmVxdWVuY3kgKyAyMCwgZnJlcXVlbmN5ICsgNTAsIGZhbHNlKTtcbiAgICB0aGlzLmFkanVzdEhlYXJ0c1dpdGhPYnN0YWNsZXMoKTtcbn1cblxuR2FtZVNjcmVlbi5wcm90b3R5cGUub25PYnN0YWNsZURpc3Bvc2VkID0gZnVuY3Rpb24oKVxue1xuICAgIFxufVxuXG5HYW1lU2NyZWVuLnByb3RvdHlwZS5vbkdlbmVyYXRlRmxvYXRlciA9IGZ1bmN0aW9uKG9ic3RhY2xlcylcbntcbiAgICB2YXIgbGF5ZXIgPSB0aGlzLl9zY3JvbGxlckVuZ2luZS5nZXRMYXllckNvbnRhaW5lcignYmFja2dyb3VuZEZsb2F0ZXJMYXllcicpO1xuICAgIHZhciB4ID0gKGxheWVyLngqLTEpICsgKHRoaXMuX3Njcm9sbGVyRW5naW5lLnZpZXdCb3VuZGFyeS53aWR0aCk7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IG9ic3RhY2xlcy5sZW5ndGg7IGkrKylcbiAgICB7XG4gICAgICAgIHRoaXMuX3Njcm9sbGVyRW5naW5lLmFkZE9iamVjdFRvTGF5ZXIob2JzdGFjbGVzW2ldLm9iaiwgJ2JhY2tncm91bmRGbG9hdGVyTGF5ZXInLCB4ICsgb2JzdGFjbGVzW2ldLm9mZnNldC54LCAtKENvbW1vbi5TVEFHRV9IRUlHSFQvMikgKyBDb21tb24uU1RBR0VfSEVJR0hUKk1hdGgucmFuZG9tKCkpO1xuICAgICAgICBvYnN0YWNsZXNbaV0ub2JqLnNldENvbG91cih0aGlzLl9jdXJyZW50QmFja2dyb3VuZENvbG91ciAlIHRoaXMuX21heEJhY2tncm91bmRDb2xvdXJzKTtcbiAgICB9XG59XG5cbkdhbWVTY3JlZW4ucHJvdG90eXBlLm9uR2VuZXJhdGVGb3JlZ3JvdW5kU2hhZG93ID0gZnVuY3Rpb24ob2JzdGFjbGVzKVxue1xuICAgIHZhciBsYXllciA9IHRoaXMuX3Njcm9sbGVyRW5naW5lLmdldExheWVyQ29udGFpbmVyKCdmb3JlZ3JvdW5kU2hhZG93TGF5ZXInKTtcbiAgICB2YXIgeCA9IChsYXllci54Ki0xKSArICh0aGlzLl9zY3JvbGxlckVuZ2luZS52aWV3Qm91bmRhcnkud2lkdGgpO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBvYnN0YWNsZXMubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgICB0aGlzLl9zY3JvbGxlckVuZ2luZS5hZGRPYmplY3RUb0xheWVyKG9ic3RhY2xlc1tpXS5vYmosICdmb3JlZ3JvdW5kU2hhZG93TGF5ZXInLCB4ICsgb2JzdGFjbGVzW2ldLm9mZnNldC54LCBvYnN0YWNsZXNbaV0ub2Zmc2V0LnkpO1xuICAgICAgICBvYnN0YWNsZXNbaV0ub2JqLnNldENvbG91cih0aGlzLl9jdXJyZW50QmFja2dyb3VuZENvbG91ciAlIHRoaXMuX21heEJhY2tncm91bmRDb2xvdXJzKTtcbiAgICB9XG5cbn1cblxuR2FtZVNjcmVlbi5wcm90b3R5cGUub25Db2xsaXNpb24gPSBmdW5jdGlvbihvYmplY3QxLCBvYmplY3QyKVxue1xuICAgIGlmKG9iamVjdDEudHlwZSA9PSAnYXZhdGFyJylcbiAgICB7XG4gICAgICAgIGlmKG9iamVjdDIudHlwZSA9PSAnb2JzdGFjbGUnKVxuICAgICAgICB7XG4gICAgICAgICAgICBvYmplY3QxLmZsYXNoKCk7XG4gICAgICAgICAgICBpZighdGhpcy5fZ2FtZUVuZGVkKVxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIoKTtcblxuICAgICAgICAgICAgdmFyIHBhcnRpY2xlID0gRW1pdHRlci5hZGQodGhpcy5fc2Nyb2xsZXJFbmdpbmUuZ2V0TGF5ZXJDb250YWluZXIoJ2F2YXRhckxheWVyJyksIFxuICAgICAgICAgICAgICAgICAgICBbJ3N0YXInXSxcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJ0aWNsZXNfY29sbGlzaW9uXCIsIG9iamVjdDEueCwgb2JqZWN0MS55LCAwLjYsIHRydWUsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYob2JqZWN0Mi50eXBlID09ICdjb2xsZWN0aWJsZScgJiYgIW9iamVjdDIuY29sbGVjdGVkKVxuICAgICAgICB7XG4gICAgICAgICAgICBvYmplY3QyLmNvbGxlY3QoKTtcbiAgICAgICAgICAgIHRoaXMuX2hlYXJ0cysrO1xuICAgICAgICAgICAgU291bmRTRlgucGxheSgnc2Z4X2hlYXJ0X3BpY2t1cF8wMicpO1xuXG4gICAgICAgICAgICB2YXIgaGVhcnQgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoJ3BpY2t1cCcpKTtcbiAgICAgICAgICAgIGhlYXJ0LmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcbiAgICAgICAgICAgIGhlYXJ0LnNjYWxlID0gbmV3IFBJWEkuUG9pbnQoMC41LCAwLjUpO1xuICAgICAgICAgICAgdmFyIHBvcyA9IHRoaXMuX3Njcm9sbGVyRW5naW5lLmdldE9iamVjdFBvc2l0aW9uT25TY3JlZW4ob2JqZWN0Mik7XG4gICAgICAgICAgICBoZWFydC54ID0gcG9zLnggLSB0aGlzLl9zY3JvbGxlckVuZ2luZS54O1xuICAgICAgICAgICAgaGVhcnQueSA9IHBvcy55IC0gdGhpcy5fc2Nyb2xsZXJFbmdpbmUueTtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoaGVhcnQpO1xuXG4gICAgICAgICAgICB2YXIgdGwgPSBuZXcgVGltZWxpbmVNYXgoKTtcbiAgICAgICAgICAgIENvbW1vbi5hbmltYXRvci5hZGQodGwpO1xuICAgICAgICAgICAgdGwudG8oaGVhcnQsIC41LCB7YmV6aWVyOlt7eDp0aGlzLl9zY29yZUJveC54IC0gMzAwLCB5OnRoaXMuX3Njb3JlQm94LnkgKyAyMDB9LCB7eDp0aGlzLl9zY29yZUJveC54IC0gNTAsIHk6dGhpcy5fc2NvcmVCb3gueX1dLCBlYXNlOlNpbmUuZWFzZUluT3V0LCBvbkNvbXBsZXRlU2NvcGU6dGhpcywgb25Db21wbGV0ZTpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3RhbmNlICs9IHRoaXMuX2NvbGxlY3RpYmxlQm9udXM7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2NvcmVCb3guYW5pbWF0ZVNjb3JlKCk7XG4gICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICB0bC50byhoZWFydC5zY2FsZSwgLjIsIHt4OjAsIHk6MCwgZWFzZTpTaW5lLmVhc2VJbk91dCwgb25Db21wbGV0ZVNjb3BlOnRoaXMsIG9uQ29tcGxldGU6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKGhlYXJ0KTtcbiAgICAgICAgICAgIH19KTtcblxuICAgICAgICAgICAgdmFyIHBhcnRpY2xlID0gRW1pdHRlci5hZGQodGhpcy5fc2Nyb2xsZXJFbmdpbmUuZ2V0TGF5ZXJDb250YWluZXIoJ2F2YXRhckxheWVyJyksIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbJ19waWNrdXBfcGlua2RvdCddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBhcnRpY2xlc19waWNrdXBcIiwgb2JqZWN0Mi54ICsgMjAsIG9iamVjdDIueSwgMC42LCB0cnVlLCAxKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfVxufVxuXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gR0VUVEVSUy9TRVRURVJTXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoR2FtZVNjcmVlbi5wcm90b3R5cGUsIFwic2Nyb2xsU3BlZWRcIiwge1xuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0aW5nU2Nyb2xsU3BlZWQgKiAoMSArIE1hdGgubWluKHRoaXMuX3Njcm9sbEluYywgdGhpcy5fc2Nyb2xsSW5jTWF4LTEpKTtcbiAgICB9LFxufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShHYW1lU2NyZWVuLnByb3RvdHlwZSwgXCJzY3JvbGxJbmNQZXJjZW50YWdlXCIsIHtcbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxJbmMgLyB0aGlzLl9zY3JvbGxJbmNNYXg7XG4gICAgfSxcbn0pO1xuXG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiIsIlxyXG52YXIgQ29tbW9uICAgICAgICAgICAgICAgICAgPSByZXF1aXJlKFwiLi4vQ29tbW9uXCIpO1xyXG52YXIgU2ltcGxlU2NyZWVuICAgICAgICAgICAgPSByZXF1aXJlKFwiLi9TaW1wbGVTY3JlZW5cIik7XHJcbnZhciBTb3VuZFNGWCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9nZW5lcmFsL1NvdW5kU0ZYXCIpO1xyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gQ09OU1RSVUNUT1JcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIEludHJvU2NyZWVuKClcclxue1xyXG4gICAgdGhpcy5fc2NyZWVuMSA9IG51bGw7XHJcbiAgICB0aGlzLl9zY3JlZW4yID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLl9uZXh0QnV0dG9uID0gbnVsbDtcclxuXHJcbiAgICBTaW1wbGVTY3JlZW4uY2FsbCh0aGlzKTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IEludHJvU2NyZWVuO1xyXG5JbnRyb1NjcmVlbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFNpbXBsZVNjcmVlbi5wcm90b3R5cGUpO1xyXG5JbnRyb1NjcmVlbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJbnRyb1NjcmVlbjtcclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBQVUJMSUMgTUVUSE9EU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLyoqXHJcbiAqL1xyXG5JbnRyb1NjcmVlbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgY29uc29sZS5sb2coXCJTUExBU0ggSU5JVElBTElaRURcIik7XHJcblxyXG4gICAgU2ltcGxlU2NyZWVuLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XHJcblxyXG4gICAgdGhpcy5fc2NyZWVuMSA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG4gICAgdGhpcy5fc2NyZWVuMS54ID0gQ29tbW9uLlNUQUdFX1dJRFRIIC8gMjtcclxuICAgIHRoaXMuX3NjcmVlbjEueSA9IENvbW1vbi5TVEFHRV9IRUlHSFQgLyAyO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9zY3JlZW4xKTtcclxuXHJcbiAgICB0aGlzLl9zY3JlZW4yID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XHJcbiAgICB0aGlzLl9zY3JlZW4yLnggPSBDb21tb24uU1RBR0VfV0lEVEggLyAyO1xyXG4gICAgdGhpcy5fc2NyZWVuMi55ID0gQ29tbW9uLlNUQUdFX0hFSUdIVCAvIDI7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3NjcmVlbjIpO1xyXG5cclxuICAgIHRoaXMuX3NjcmVlbjMgPSBuZXcgUElYSS5Db250YWluZXIoKTtcclxuICAgIHRoaXMuX3NjcmVlbjMueCA9IENvbW1vbi5TVEFHRV9XSURUSCAqIDEuNTtcclxuICAgIHRoaXMuX3NjcmVlbjMueSA9IENvbW1vbi5TVEFHRV9IRUlHSFQgLyAyO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9zY3JlZW4zKTtcclxuXHJcbiAgICB2YXIgczEgPSB0aGlzLl9zY3JlZW4xO1xyXG4gICAgdmFyIHMyID0gdGhpcy5fc2NyZWVuMjtcclxuICAgIHZhciBzMyA9IHRoaXMuX3NjcmVlbjM7XHJcblxyXG4gICAgLy9TY3JlZW4gMVxyXG5cclxuICAgIHMxLmJnID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiZnIxX2JnXCIpKTtcclxuICAgIHMxLmJnLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcclxuICAgIHMxLmJnLnkgPSAoQ29tbW9uLlNUQUdFX0hFSUdIVCAtIHMxLmJnLmhlaWdodCkvMjtcclxuICAgIHMxLmFkZENoaWxkKHMxLmJnKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICB2YXIgbGVmdEdsb3cgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJtb2pvam9qb19oYW5kZ2xvd19sZWZ0XCIpKTtcclxuICAgICAgICBsZWZ0R2xvdy5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDAuNSk7XHJcbiAgICAgICAgbGVmdEdsb3cueCA9IC00MDA7XHJcbiAgICAgICAgbGVmdEdsb3cuc2NhbGUgPSBuZXcgUElYSS5Qb2ludCgwLjQsIDAuNCk7XHJcbiAgICAgICAgbGVmdEdsb3cueSA9IDA7XHJcbiAgICAgICAgczEuYWRkQ2hpbGQobGVmdEdsb3cpO1xyXG4gICAgICAgIHZhciByaWdodEdsb3cgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJtb2pvam9qb19oYW5kZ2xvd19yaWdodFwiKSk7XHJcbiAgICAgICAgcmlnaHRHbG93LmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcclxuICAgICAgICByaWdodEdsb3cueCA9IC0xMDA7XHJcbiAgICAgICAgcmlnaHRHbG93LnkgPSAtMTAwO1xyXG4gICAgICAgIHJpZ2h0R2xvdy5zY2FsZSA9IG5ldyBQSVhJLlBvaW50KDAuNCwgMC40KTtcclxuICAgICAgICBzMS5hZGRDaGlsZChyaWdodEdsb3cpO1xyXG5cclxuICAgICAgICB2YXIgZ2xvd3MgPSBbbGVmdEdsb3csIHJpZ2h0R2xvd107XHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGdsb3dzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ29tbW9uLmFuaW1hdG9yLmFkZChUd2Vlbk1heC50byhnbG93c1tpXS5zY2FsZSwgLjI0ICsgKDAuMDEqaSksIHt4OjEuMiwgeToxLjIsIGVhc2U6U2luZS5lYXNlSW5PdXQsIHJlcGVhdDotMX0pKTtcclxuICAgICAgICAgICAgQ29tbW9uLmFuaW1hdG9yLmFkZChUd2Vlbk1heC50byhnbG93c1tpXSwgLjI0ICsgKDAuMDEqaSksIHthbHBoYToxLCBlYXNlOlNpbmUuZWFzZUluT3V0LCByZXBlYXQ6LTEsIG9uUmVwZWF0U2NvcGU6dGhpcywgb25SZXBlYXRQYXJhbXM6W2dsb3dzW2ldXSwgb25SZXBlYXQ6ZnVuY3Rpb24oZ2xvdyl7XHJcbiAgICAgICAgICAgICAgICBnbG93LnJvdGF0aW9uID0gKDM2MCAqIE1hdGgucmFuZG9tKCkpICogUElYSS5ERUdfVE9fUkFEO1xyXG4gICAgICAgICAgICB9fSkpO1xyXG4gICAgICAgIH0qL1xyXG5cclxuICAgIHMxLmJpdHMgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJmcjFfYml0c1wiKSk7XHJcbiAgICBzMS5iaXRzLnggPSAtNTA7XHJcbiAgICBzMS5iaXRzLnkgPSAtMTAwO1xyXG4gICAgczEuYWRkQ2hpbGQoczEuYml0cyk7XHJcblxyXG4gICAgczEuYnVpbGRpbmcxID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiZnIxX2J1aWxkaW5nMVwiKSk7XHJcbiAgICBzMS5idWlsZGluZzEueCA9IC00MDA7XHJcbiAgICBzMS5idWlsZGluZzEueSA9IC00MDA7XHJcbiAgICBzMS5hZGRDaGlsZChzMS5idWlsZGluZzEpO1xyXG5cclxuICAgIHMxLmJ1aWxkaW5nMiA9IG5ldyBQSVhJLlNwcml0ZSh0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShcImZyMV9idWlsZGluZzJcIikpO1xyXG4gICAgczEuYnVpbGRpbmcyLnggPSAtNTA7XHJcbiAgICBzMS5idWlsZGluZzIueSA9IDA7XHJcbiAgICBzMS5hZGRDaGlsZChzMS5idWlsZGluZzIpO1xyXG5cclxuICAgIHMxLmJ1aWxkaW5nMyA9IG5ldyBQSVhJLlNwcml0ZSh0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShcImZyMV9idWlsZGluZzNcIikpO1xyXG4gICAgczEuYnVpbGRpbmczLnggPSA1MDtcclxuICAgIHMxLmJ1aWxkaW5nMy55ID0gLTIwMDtcclxuICAgIHMxLmFkZENoaWxkKHMxLmJ1aWxkaW5nMyk7XHJcblxyXG4gICAgczEuY3JhbmUgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJmcjFfY3JhbmViaXRcIikpO1xyXG4gICAgczEuY3JhbmUueCA9IDQwMDtcclxuICAgIHMxLmNyYW5lLnkgPSAtMTAwO1xyXG4gICAgczEuYWRkQ2hpbGQoczEuY3JhbmUpO1xyXG5cclxuICAgIHMxLnRyZWUgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJmcjFfdHJlZVwiKSk7XHJcbiAgICBzMS50cmVlLnggPSAxMDA7XHJcbiAgICBzMS50cmVlLnkgPSAtMzUwO1xyXG4gICAgczEuYWRkQ2hpbGQoczEudHJlZSk7XHJcblxyXG4gICAgczEudmFuID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiZnIxX3ZhblwiKSk7XHJcbiAgICBzMS52YW4ueCA9IC03MDA7XHJcbiAgICBzMS52YW4ueSA9IC0zMDA7XHJcbiAgICBzMS5hZGRDaGlsZChzMS52YW4pO1xyXG5cclxuICAgIHMxLm1vam9TcGVlY2ggPSBuZXcgUElYSS5Db250YWluZXIoKTtcclxuICAgIHMxLm1vam9TcGVlY2gueCA9IDUwO1xyXG4gICAgczEubW9qb1NwZWVjaC55ID0gLTEwMDtcclxuICAgIHMxLm1vam9TcGVlY2guc2NhbGUgPSBuZXcgUElYSS5Qb2ludCgwLCAwKTtcclxuICAgIHMxLmFkZENoaWxkKHMxLm1vam9TcGVlY2gpO1xyXG5cclxuICAgIHZhciBidWJibGUgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJmcjFfc3BlZWNoYnViYmxlXCIpKTtcclxuICAgIGJ1YmJsZS5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjMsIDAuNyk7XHJcbiAgICBzMS5tb2pvU3BlZWNoLmFkZENoaWxkKGJ1YmJsZSk7XHJcblxyXG4gICAgY29uc29sZS5sb2codGhpcy5fYXNzZXRNYW5hZ2VyLmdldEpTT04oXCJjb25maWdcIilbJ2NvcHknXSk7XHJcblxyXG4gICAgdmFyIGNvcHkgPSB0aGlzLl9hc3NldE1hbmFnZXIuZ2V0SlNPTihcImNvbmZpZ1wiKVsnY29weSddW1wiRVZJTF9MQVVHSFwiXVtDb21tb24uQ09VTlRSWV9DT0RFXTtcclxuICAgIGlmKCFjb3B5LmxpdmUpXHJcbiAgICAgICAgczEubW9qb1NwZWVjaFRleHQgPSBuZXcgcDMuQml0bWFwVGV4dChjb3B5LnRleHQsIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRGb250QXRsYXMoXCJ1bnBhY2s1MF9ibGFja1wiKSwgcDMuQml0bWFwVGV4dC5BTElHTl9DRU5URVIpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHMxLm1vam9TcGVlY2hUZXh0ID0gbmV3IFBJWEkuVGV4dChjb3B5LnRleHQsIHtmb250OiBcIjUwcHggRnJlZEZyZWRidXJnZXJBcmEtUmVndWxhclwiLCBmaWxsOiAweDAwMDAwMCwgYWxpZ246IFwiY2VudGVyXCIsIHN0cm9rZTogMHgwLCBzdHJva2VUaGlja25lc3M6IDF9KTtcclxuICAgIHMxLm1vam9TcGVlY2hUZXh0LnggPSAxMzAgKyBjb3B5Lm9mZnNldC54O1xyXG4gICAgczEubW9qb1NwZWVjaFRleHQueSA9IC0xNDAgKyBjb3B5Lm9mZnNldC55O1xyXG4gICAgczEubW9qb1NwZWVjaFRleHQuc2NhbGUueCA9IHMxLm1vam9TcGVlY2hUZXh0LnNjYWxlLnkgPSBjb3B5LnNjYWxlO1xyXG4gICAgczEubW9qb1NwZWVjaC5hZGRDaGlsZChzMS5tb2pvU3BlZWNoVGV4dCk7XHJcbiAgICBpZihjb3B5LmxpdmUpXHJcbiAgICAgICAgczEubW9qb1NwZWVjaFRleHQueCAtPSBzMS5tb2pvU3BlZWNoVGV4dC53aWR0aCAqIDAuNTtcclxuXHJcbiAgICAvL1NjcmVlbiAyXHJcblxyXG4gICAgLypcclxuICAgIHMyLmJnID0gbmV3IFBJWEkuU3ByaXRlKENvbW1vbi5nZW5lcmF0ZWRUZXh0dXJlcy5za3kwU3F1YXJlKTtcclxuICAgIHMyLmJnLndpZHRoID0gQ29tbW9uLlNUQUdFX1dJRFRIO1xyXG4gICAgczIuYmcuaGVpZ2h0ID0gQ29tbW9uLlNUQUdFX0hFSUdIVDtcclxuICAgIHMyLmJnLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcclxuICAgIHMyLmJnLmFscGhhID0gMDtcclxuICAgIHMyLmFkZENoaWxkKHMyLmJnKTsqL1xyXG5cclxuICAgIHMyLmJnTGVmdCA9IG5ldyBQSVhJLlNwcml0ZShDb21tb24uZ2VuZXJhdGVkVGV4dHVyZXMuYnViYmxlc1NxdWFyZSk7XHJcbiAgICBzMi5iZ0xlZnQud2lkdGggPSBDb21tb24uU1RBR0VfV0lEVEgvMjtcclxuICAgIHMyLmJnTGVmdC5oZWlnaHQgPSBDb21tb24uU1RBR0VfSEVJR0hUO1xyXG4gICAgczIuYmdMZWZ0LnggPSAtKENvbW1vbi5TVEFHRV9XSURUSC8yKTtcclxuICAgIHMyLmJnTGVmdC5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgxLCAwLjUpO1xyXG4gICAgczIuYmdMZWZ0LmFscGhhID0gMC43O1xyXG4gICAgczIuYWRkQ2hpbGQoczIuYmdMZWZ0KTtcclxuXHJcbiAgICBzMi5iZ1JpZ2h0ID0gbmV3IFBJWEkuU3ByaXRlKENvbW1vbi5nZW5lcmF0ZWRUZXh0dXJlcy5idXR0ZXJjdXBTcXVhcmUpO1xyXG4gICAgczIuYmdSaWdodC53aWR0aCA9IENvbW1vbi5TVEFHRV9XSURUSC8yO1xyXG4gICAgczIuYmdSaWdodC5oZWlnaHQgPSBDb21tb24uU1RBR0VfSEVJR0hUO1xyXG4gICAgczIuYmdSaWdodC54ID0gQ29tbW9uLlNUQUdFX1dJRFRILzI7XHJcbiAgICBzMi5iZ1JpZ2h0LmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAsIDAuNSk7XHJcbiAgICBzMi5iZ1JpZ2h0LmFscGhhID0gMC43O1xyXG4gICAgczIuYWRkQ2hpbGQoczIuYmdSaWdodCk7XHJcblxyXG4gICAgczIuYmxvc3NvbSA9IG5ldyBQSVhJLlNwcml0ZSh0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShcImZyMl8yXCIpKTtcclxuICAgIHMyLmJsb3Nzb20uYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC41LCAwLjUpO1xyXG4gICAgczIuYmxvc3NvbS55ID0gQ29tbW9uLlNUQUdFX0hFSUdIVCoxLjU7XHJcbiAgICBzMi5hZGRDaGlsZChzMi5ibG9zc29tKTtcclxuXHJcbiAgICB2YXIgZ2lybFBhbmVsV2lkdGggPSBNYXRoLm1pbihwMy5WaWV3LndpZHRoIC8gMywgMTUwMC8zKTtcclxuICAgIHZhciBnaXJsUGFuZWxTY2FsZSA9IE1hdGgubWF4KDEsIGdpcmxQYW5lbFdpZHRoIC8gczIuYmxvc3NvbS53aWR0aCk7XHJcbiAgICBzMi5ibG9zc29tLnNjYWxlID0gbmV3IFBJWEkuUG9pbnQoZ2lybFBhbmVsU2NhbGUsIGdpcmxQYW5lbFNjYWxlKTtcclxuXHJcbiAgICBzMi5idWJibGVzID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiZnIyXzFcIikpO1xyXG4gICAgczIuYnViYmxlcy5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgxLCAwLjUpO1xyXG4gICAgczIuYnViYmxlcy54ID0gLShzMi5ibG9zc29tLndpZHRoLzIpO1xyXG4gICAgczIuYnViYmxlcy55ID0gQ29tbW9uLlNUQUdFX0hFSUdIVCoxLjU7XHJcbiAgICBzMi5idWJibGVzLnNjYWxlID0gbmV3IFBJWEkuUG9pbnQoZ2lybFBhbmVsU2NhbGUsIGdpcmxQYW5lbFNjYWxlKTtcclxuICAgIHMyLmFkZENoaWxkKHMyLmJ1YmJsZXMpO1xyXG5cclxuICAgIHMyLmJ1dHRlcmN1cCA9IG5ldyBQSVhJLlNwcml0ZSh0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShcImZyMl8zXCIpKTtcclxuICAgIHMyLmJ1dHRlcmN1cC5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLCAwLjUpO1xyXG4gICAgczIuYnV0dGVyY3VwLnggPSAoczIuYmxvc3NvbS53aWR0aC8yKTtcclxuICAgIHMyLmJ1dHRlcmN1cC55ID0gQ29tbW9uLlNUQUdFX0hFSUdIVCoxLjU7XHJcbiAgICBzMi5idXR0ZXJjdXAuc2NhbGUgPSBuZXcgUElYSS5Qb2ludChnaXJsUGFuZWxTY2FsZSwgZ2lybFBhbmVsU2NhbGUpO1xyXG4gICAgczIuYWRkQ2hpbGQoczIuYnV0dGVyY3VwKTtcclxuXHJcblxyXG4gICAgLy9TY3JlZW4gM1xyXG5cclxuICAgIHMzLmJnID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiZnIzX2JnXCIpKTtcclxuICAgIHMzLmJnLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcclxuICAgIHMzLmFkZENoaWxkKHMzLmJnKTtcclxuXHJcbiAgICBzMy5ibG9zc29tID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiZ2lybDJcIikpO1xyXG4gICAgczMuYmxvc3NvbS5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLCAxKTtcclxuICAgIHMzLmJsb3Nzb20uc2NhbGUgPSBuZXcgUElYSS5Qb2ludCgwLCAwKTtcclxuICAgIHMzLmJsb3Nzb20ueCA9IDQyMDsgXHJcbiAgICBzMy5ibG9zc29tLnkgPSAoQ29tbW9uLlNUQUdFX0hFSUdIVC8yKSArIDEwMDsgXHJcbiAgICBzMy5hZGRDaGlsZChzMy5ibG9zc29tKTtcclxuXHJcbiAgICBzMy5idWJibGVzID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiZ2lybDFcIikpO1xyXG4gICAgczMuYnViYmxlcy5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLCAxKTtcclxuICAgIHMzLmJ1YmJsZXMuc2NhbGUgPSBuZXcgUElYSS5Qb2ludCgwLCAwKTtcclxuICAgIHMzLmJ1YmJsZXMueCA9IDQzMDsgXHJcbiAgICBzMy5idWJibGVzLnkgPSAoQ29tbW9uLlNUQUdFX0hFSUdIVC8yKSArIDIwOyBcclxuICAgIHMzLmFkZENoaWxkKHMzLmJ1YmJsZXMpO1xyXG5cclxuICAgIHMzLmJ1dHRlcmN1cCA9IG5ldyBQSVhJLlNwcml0ZSh0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShcImdpcmwzXCIpKTtcclxuICAgIHMzLmJ1dHRlcmN1cC5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLCAxKTtcclxuICAgIHMzLmJ1dHRlcmN1cC5zY2FsZSA9IG5ldyBQSVhJLlBvaW50KDAsIDApO1xyXG4gICAgczMuYnV0dGVyY3VwLnggPSAyNTA7IFxyXG4gICAgczMuYnV0dGVyY3VwLnkgPSAoQ29tbW9uLlNUQUdFX0hFSUdIVC8yKSArIDMwOyBcclxuICAgIHMzLmFkZENoaWxkKHMzLmJ1dHRlcmN1cCk7XHJcblxyXG4gICAgczMuYmNTcGVlY2ggPSBuZXcgUElYSS5Db250YWluZXIoKTtcclxuICAgIHMzLmJjU3BlZWNoLnggPSA5MDtcclxuICAgIHMzLmJjU3BlZWNoLnkgPSAxODA7XHJcbiAgICBzMy5iY1NwZWVjaC5zY2FsZSA9IG5ldyBQSVhJLlBvaW50KDAsIDApO1xyXG4gICAgczMuYWRkQ2hpbGQoczMuYmNTcGVlY2gpO1xyXG5cclxuICAgIHZhciBidWJibGUgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJmcjNfc3BlZWNoYnViYmxlMlwiKSk7XHJcbiAgICBidWJibGUuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC4zLCAwLjcpO1xyXG4gICAgczMuYmNTcGVlY2guYWRkQ2hpbGQoYnViYmxlKTtcclxuXHJcbiAgICB2YXIgY29weSA9IHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRKU09OKFwiY29uZmlnXCIpWydjb3B5J11bXCJMRVRTX1NUT1BcIl1bQ29tbW9uLkNPVU5UUllfQ09ERV07XHJcbiAgICBpZighY29weS5saXZlKVxyXG4gICAgICAgIHMzLmJjU3BlZWNoVGV4dCA9IG5ldyBwMy5CaXRtYXBUZXh0KGNvcHkudGV4dCwgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldEZvbnRBdGxhcyhcInVucGFjazUwX2JsYWNrXCIpLCBwMy5CaXRtYXBUZXh0LkFMSUdOX0NFTlRFUik7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgczMuYmNTcGVlY2hUZXh0ID0gbmV3IFBJWEkuVGV4dChjb3B5LnRleHQsIHtmb250OiBcIjUwcHggRnJlZEZyZWRidXJnZXJBcmEtUmVndWxhclwiLCBmaWxsOiAweDAwMDAwMCwgYWxpZ246IFwiY2VudGVyXCIsIHN0cm9rZTogMHgwLCBzdHJva2VUaGlja25lc3M6IDF9KTtcclxuICAgIHMzLmJjU3BlZWNoVGV4dC54ID0gMTIwICsgY29weS5vZmZzZXQueDtcclxuICAgIHMzLmJjU3BlZWNoVGV4dC55ID0gLTkwICsgY29weS5vZmZzZXQueTtcclxuICAgIHMzLmJjU3BlZWNoVGV4dC5zY2FsZS54ID0gczMuYmNTcGVlY2hUZXh0LnNjYWxlLnkgPSBjb3B5LnNjYWxlO1xyXG4gICAgczMuYmNTcGVlY2guYWRkQ2hpbGQoczMuYmNTcGVlY2hUZXh0KTtcclxuICAgIGlmKGNvcHkubGl2ZSlcclxuICAgICAgICBzMy5iY1NwZWVjaFRleHQueCAtPSBzMy5iY1NwZWVjaFRleHQud2lkdGggKiAwLjU7XHJcblxyXG5cclxuICAgIHMzLm90aGVyU3BlZWNoID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XHJcbiAgICBzMy5vdGhlclNwZWVjaC54ID0gMTMwO1xyXG4gICAgczMub3RoZXJTcGVlY2gueSA9IC0xODA7XHJcbiAgICBzMy5vdGhlclNwZWVjaC5zY2FsZSA9IG5ldyBQSVhJLlBvaW50KDAsIDApO1xyXG4gICAgczMuYWRkQ2hpbGQoczMub3RoZXJTcGVlY2gpO1xyXG5cclxuICAgIHZhciBidWJibGUgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJmcjNfc3BlZWNoYnViYmxlMVwiKSk7XHJcbiAgICBidWJibGUuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC4zLCAwLjcpO1xyXG4gICAgczMub3RoZXJTcGVlY2guYWRkQ2hpbGQoYnViYmxlKTtcclxuXHJcbiAgICB2YXIgY29weSA9IHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRKU09OKFwiY29uZmlnXCIpWydjb3B5J11bXCJZRUFIXCJdW0NvbW1vbi5DT1VOVFJZX0NPREVdO1xyXG4gICAgaWYoIWNvcHkubGl2ZSlcclxuICAgICAgICBzMy5vdGhlclNwZWVjaFRleHQgPSBuZXcgcDMuQml0bWFwVGV4dChjb3B5LnRleHQsIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRGb250QXRsYXMoXCJ1bnBhY2s1MF9ibGFja1wiKSwgcDMuQml0bWFwVGV4dC5BTElHTl9DRU5URVIpO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHMzLm90aGVyU3BlZWNoVGV4dCA9IG5ldyBQSVhJLlRleHQoY29weS50ZXh0LCB7Zm9udDogXCI1MHB4IEZyZWRGcmVkYnVyZ2VyQXJhLVJlZ3VsYXJcIiwgZmlsbDogMHgwMDAwMDAsIGFsaWduOiBcImNlbnRlclwiLCBzdHJva2U6IDB4MCwgc3Ryb2tlVGhpY2tuZXNzOiAxfSk7XHJcbiAgICBzMy5vdGhlclNwZWVjaFRleHQueCA9IDcwICsgY29weS5vZmZzZXQueDtcclxuICAgIHMzLm90aGVyU3BlZWNoVGV4dC55ID0gLTEwNSArIGNvcHkub2Zmc2V0Lnk7XHJcbiAgICBzMy5vdGhlclNwZWVjaFRleHQuc2NhbGUueCA9IHMzLm90aGVyU3BlZWNoVGV4dC5zY2FsZS55ID0gY29weS5zY2FsZTtcclxuICAgIHMzLm90aGVyU3BlZWNoLmFkZENoaWxkKHMzLm90aGVyU3BlZWNoVGV4dCk7XHJcbiAgICBpZihjb3B5LmxpdmUpXHJcbiAgICAgICAgczMub3RoZXJTcGVlY2hUZXh0LnggLT0gczMub3RoZXJTcGVlY2hUZXh0LndpZHRoICogMC41O1xyXG5cclxuXHJcblxyXG4gICAgdGhpcy5fYWRkTXV0ZUJ1dHRvbigpO1xyXG5cclxuICAgIHRoaXMuX25leHRCdXR0b24gPSBuZXcgcDMuQnV0dG9uKHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiYnV0X3BsYXlfZGVmXCIpLCB0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShcImJ1dF9wbGF5X292ZXJcIiksIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiYnV0X3BsYXlfcHJlc3NlZFwiKSk7XHJcbiAgICB0aGlzLl9uZXh0QnV0dG9uLnggPSAoQ29tbW9uLlNUQUdFX1dJRFRIIC8gMik7XHJcbiAgICB0aGlzLl9uZXh0QnV0dG9uLnkgPSBDb21tb24uU1RBR0VfSEVJR0hUIC0gMTAwO1xyXG4gICAgdGhpcy5fbmV4dEJ1dHRvbi5zaWduYWxzLmRvd24uYWRkT25jZSh0aGlzLnBsYXlDbGlja2VkLCB0aGlzKTtcclxuICAgIHRoaXMuX25leHRCdXR0b24uc2lnbmFscy5vdmVyLmFkZCh0aGlzLmJ1dHRvbk92ZXIsIHRoaXMpO1xyXG4gICAgdGhpcy5fbmV4dEJ1dHRvbi5hbmltYXRlID0gZmFsc2U7XHJcbiAgICBcclxuICAgIGlmKENvbW1vbi5zYXZlZERhdGEuaGFzU2VlbkludHJvKVxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fbmV4dEJ1dHRvbik7XHJcblxyXG4gICAgdGhpcy5zaG93U2NyZWVuMSgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5JbnRyb1NjcmVlbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICBcclxufTtcclxuXHJcbi8qKlxyXG4gKi9cclxuSW50cm9TY3JlZW4ucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgU2ltcGxlU2NyZWVuLnByb3RvdHlwZS5yZXNpemUuY2FsbCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLl9uZXh0QnV0dG9uLnggPSB0aGlzLl9nZXRGaXJzdEJ1dHRvblBvc2l0aW9uUmlnaHQoKSAtIDUwO1xyXG4gICAgdGhpcy5fbXV0ZUJ1dHRvbi54ID0gdGhpcy5fZ2V0Rmlyc3RCdXR0b25Qb3NpdGlvblJpZ2h0KCk7XHJcbn07XHJcblxyXG4vKipcclxuICovXHJcbkludHJvU2NyZWVuLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICBUd2Vlbk1heC5raWxsQWxsKCk7XHJcbiAgICBTb3VuZFNGWC5zdG9wKCdtdXNpY19wcGdfc3BsYXNoX2dlbmVyaWMnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb249fSBjYWxsYmFja1xyXG4gKiBAcGFyYW0geyo9fXNjb3BlXHJcbiAqL1xyXG5JbnRyb1NjcmVlbi5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oY2FsbGJhY2ssIHNjb3BlKSB7XHJcbiAgICBcclxuICAgIFNpbXBsZVNjcmVlbi5wcm90b3R5cGUuYW5pbWF0ZUluLmNhbGwodGhpcyk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb249fSBjYWxsYmFja1xyXG4gKiBAcGFyYW0geyo9fSBzY29wZVxyXG4gKi9cclxuSW50cm9TY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVPdXQgPSBmdW5jdGlvbihjYWxsYmFjaywgc2NvcGUpIHtcclxuICAgICAgICBcclxuICAgIFNpbXBsZVNjcmVlbi5wcm90b3R5cGUuYW5pbWF0ZU91dC5jYWxsKHRoaXMpO1xyXG59O1xyXG5cclxuSW50cm9TY3JlZW4ucHJvdG90eXBlLnNob3dTY3JlZW4xID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB2YXIgczEgPSB0aGlzLl9zY3JlZW4xO1xyXG5cclxuICAgIHZhciB0bCA9IG5ldyBUaW1lbGluZU1heCgpO1xyXG4gICAgdGwudG8oczEubW9qb1NwZWVjaC5zY2FsZSwgMSwge3g6MSwgZWFzZTpFbGFzdGljLmVhc2VPdXR9LCAxKTtcclxuICAgIHRsLnRvKHMxLm1vam9TcGVlY2guc2NhbGUsIDEsIHt5OjEsIGVhc2U6RWxhc3RpYy5lYXNlT3V0fSwgMS4xKTtcclxuICAgIHRsLnRvKHMxLCAyLCB7b25Db21wbGV0ZTp0aGlzLnNob3dTY3JlZW4yLCBvbkNvbXBsZXRlU2NvcGU6dGhpc30pO1xyXG4gICAgQ29tbW9uLmFuaW1hdG9yLmFkZCh0bCk7XHJcblxyXG4gICAgdmFyIGJpdHMgPSBbczEuYml0cywgczEuYnVpbGRpbmcxLCBzMS5idWlsZGluZzIsIHMxLmJ1aWxkaW5nMywgczEuY3JhbmUsIHMxLnRyZWUsIHMxLnZhbl07XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgYml0cy5sZW5ndGg7IGkrKylcclxuICAgIHtcclxuICAgICAgICBDb21tb24uYW5pbWF0b3IuYWRkKFR3ZWVuTWF4LnRvKGJpdHNbaV0sIDEsIHtkZWxheTpNYXRoLnJhbmRvbSgpLCB5OmJpdHNbaV0ueS0yMCwgZWFzZTpTaW5lLmVhc2VJbk91dCwgeW95bzp0cnVlLCByZXBlYXQ6LTF9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgU291bmRTRlgucGxheSgnc2Z4X29iamVjdF9kZXN0cm95ZWRfMDAnKTtcclxuICAgIFNvdW5kU0ZYLnBsYXkoJ3NmeF9vYmplY3RfZGVzdHJveWVkXzAxJywgbnVsbCwgMik7XHJcbn07XHJcblxyXG5JbnRyb1NjcmVlbi5wcm90b3R5cGUuc2hvd1NjcmVlbjIgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIHZhciBzMiA9IHRoaXMuX3NjcmVlbjI7XHJcblxyXG4gICAgdmFyIHRsID0gbmV3IFRpbWVsaW5lTWF4KCk7XHJcbiAgICB0bC50byhzMi5iZ0xlZnQsIC4zLCB7eDowLCBlYXNlOkV4cG8uZWFzZU91dH0pO1xyXG4gICAgdGwudG8oczIuYmdSaWdodCwgLjMsIHt4OjAsIGVhc2U6RXhwby5lYXNlT3V0fSwgMCk7XHJcbiAgICB0bC50byhzMi5ibG9zc29tLCAuMywge3k6MCwgZWFzZTpFeHBvLmVhc2VPdXQsIG9uU3RhcnRTY29wZTp0aGlzLCBvblN0YXJ0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgU291bmRTRlgucGxheSgnc2Z4X3BwZ19tb3ZlXzAwJyk7XHJcbiAgICB9fSk7XHJcbiAgICB0bC50byhzMi5idWJibGVzLCAuMywge3k6MCwgZWFzZTpFeHBvLmVhc2VPdXQsIG9uU3RhcnRTY29wZTp0aGlzLCBvblN0YXJ0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgU291bmRTRlgucGxheSgnc2Z4X3BwZ19tb3ZlXzAwJyk7XHJcbiAgICB9fSk7XHJcbiAgICB0bC50byhzMi5idXR0ZXJjdXAsIC4zLCB7eTowLCBlYXNlOkV4cG8uZWFzZU91dCwgb25TdGFydFNjb3BlOnRoaXMsIG9uU3RhcnQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICBTb3VuZFNGWC5wbGF5KCdzZnhfcHBnX21vdmVfMDAnKTtcclxuICAgIH19KTtcclxuICAgIHRsLnRvKHMyLCAuNCwge29uQ29tcGxldGU6dGhpcy5zaG93U2NyZWVuMywgb25Db21wbGV0ZVNjb3BlOnRoaXN9KTtcclxuICAgIENvbW1vbi5hbmltYXRvci5hZGQodGwpO1xyXG59O1xyXG5cclxuSW50cm9TY3JlZW4ucHJvdG90eXBlLnNob3dTY3JlZW4zID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB2YXIgczIgPSB0aGlzLl9zY3JlZW4yO1xyXG4gICAgdmFyIHMzID0gdGhpcy5fc2NyZWVuMztcclxuXHJcbiAgICB2YXIgdGwgPSBuZXcgVGltZWxpbmVNYXgoKTtcclxuICAgIHRsLnRvKHMyLCAuMywge3g6LShDb21tb24uU1RBR0VfV0lEVEgqLjUpLCBlYXNlOkV4cG8uZWFzZUluT3V0fSk7XHJcbiAgICB0bC50byhzMywgLjMsIHt4OkNvbW1vbi5TVEFHRV9XSURUSC8yLCBlYXNlOkV4cG8uZWFzZUluT3V0fSwgMCk7XHJcbiAgICB0bC50byhzMy5ibG9zc29tLnNjYWxlLCAuMywge3g6LTEsIHk6MSwgZWFzZTpFeHBvLmVhc2VPdXQsIG9uU3RhcnRTY29wZTp0aGlzLCBvblN0YXJ0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgU291bmRTRlgucGxheSgnc2Z4X3BwZ19naXJsc19mbHlhd2F5XzAwJyk7XHJcbiAgICB9fSk7XHJcbiAgICB0bC50byhzMy5idWJibGVzLnNjYWxlLCAuMywge3g6LTEsIHk6MSwgZWFzZTpFeHBvLmVhc2VPdXQsIG9uU3RhcnRTY29wZTp0aGlzLCBvblN0YXJ0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgU291bmRTRlgucGxheSgnc2Z4X3BwZ19naXJsc19mbHlhd2F5XzAwJyk7XHJcbiAgICB9fSk7XHJcbiAgICB0bC50byhzMy5idXR0ZXJjdXAuc2NhbGUsIC4zLCB7eDotMSwgeToxLCBlYXNlOkV4cG8uZWFzZU91dCwgb25TdGFydFNjb3BlOnRoaXMsIG9uU3RhcnQ6ZnVuY3Rpb24oKXtcclxuICAgICAgICBTb3VuZFNGWC5wbGF5KCdzZnhfcHBnX2dpcmxzX2ZseWF3YXlfMDAnKTtcclxuICAgIH19KTtcclxuICAgIHRsLnRvKHMzLmJjU3BlZWNoLnNjYWxlLCAxLCB7eDoxLCBlYXNlOkVsYXN0aWMuZWFzZU91dH0pO1xyXG4gICAgdGwudG8oczMuYmNTcGVlY2guc2NhbGUsIDEsIHt5OjEsIGVhc2U6RWxhc3RpYy5lYXNlT3V0fSwgMS42KTtcclxuICAgIHRsLnRvKHMzLm90aGVyU3BlZWNoLnNjYWxlLCAxLCB7eDoxLCBlYXNlOkVsYXN0aWMuZWFzZU91dH0sIDIuMyk7XHJcbiAgICB0bC50byhzMy5vdGhlclNwZWVjaC5zY2FsZSwgMSwge3k6MSwgZWFzZTpFbGFzdGljLmVhc2VPdXR9LCAyLjQpO1xyXG4gICAgdGwudG8oczMsIDIsIHtvbkNvbXBsZXRlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIENvbW1vbi5zYXZlZERhdGEuaGFzU2VlbkludHJvID0gdHJ1ZTtcclxuICAgICAgICAgICAgQ29tbW9uLnNhdmVkRGF0YS5zYXZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2lnbmFscy5yZXF1ZXN0ZWROZXh0U2NyZWVuLmRpc3BhdGNoKCk7XHJcbiAgICB9LCBvbkNvbXBsZXRlU2NvcGU6dGhpc30pO1xyXG5cclxuICAgIENvbW1vbi5hbmltYXRvci5hZGQodGwpOyBcclxufVxyXG5cclxuSW50cm9TY3JlZW4ucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICBUd2Vlbk1heC5wYXVzZUFsbCgpO1xyXG59XHJcblxyXG5JbnRyb1NjcmVlbi5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICBUd2Vlbk1heC5yZXN1bWVBbGwoKTtcclxufVxyXG5cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBQUklWQVRFIE1FVEhPRFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBFVkVOVFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKi9cclxuSW50cm9TY3JlZW4ucHJvdG90eXBlLnBsYXlDbGlja2VkID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcclxuICAgIHRoaXMuX25leHRCdXR0b24uc2lnbmFscy5vdmVyLnJlbW92ZSh0aGlzLmJ1dHRvbk92ZXIsIHRoaXMpO1xyXG4gICAgdGhpcy5fbmV4dEJ1dHRvbi5zaWduYWxzLmRvd24ucmVtb3ZlKHRoaXMucGxheUNsaWNrZWQsIHRoaXMpO1xyXG5cclxuICAgIFR3ZWVuTWF4LmtpbGxUd2VlbnNPZih0aGlzLl9uZXh0QnV0dG9uLnNjYWxlKTtcclxuICAgIENvbW1vbi5hbmltYXRvci5hZGQoVHdlZW5NYXgudG8odGhpcy5fbmV4dEJ1dHRvbi5zY2FsZSwgLjIsIHt4OjAuNiwgeTowLjYsIGVhc2U6U2luZS5lYXNlSW5PdXQsIG9uQ29tcGxldGU6ZnVuY3Rpb24oKXtcclxuICAgICAgICBDb21tb24uYW5pbWF0b3IuYWRkKFR3ZWVuTWF4LnRvKHRoaXMuX25leHRCdXR0b24uc2NhbGUsIC41LCB7eDoxLCB5OjEsIGVhc2U6RWxhc3RpYy5lYXNlT3V0LCBvbkNvbXBsZXRlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHRoaXMuc2lnbmFscy5yZXF1ZXN0ZWROZXh0U2NyZWVuLmRpc3BhdGNoKCk7XHJcbiAgICAgICAgfSwgb25Db21wbGV0ZVNjb3BlOnRoaXN9KSk7XHJcblxyXG4gICAgfSwgb25Db21wbGV0ZVNjb3BlOnRoaXN9KSk7XHJcblxyXG4gICAgU291bmRTRlgucGxheSgnc2Z4X3VpX3ByZXNzcGxheV8wMCcpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5JbnRyb1NjcmVlbi5wcm90b3R5cGUuYnV0dG9uT3ZlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFxyXG4gICAgXHJcbn07XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gR0VUVEVSUy9TRVRURVJTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiIsIi8qKlxuICogIFByZWxvYWRlclxuICpcbiAqICBDcmVhdGVkIGJ5IExlZ21hbiBvbiA1LzA0LzIwMTUuXG4gKlxuICovXG5cbnZhciBTaW1wbGVTY3JlZW4gICAgICAgID0gcmVxdWlyZShcIi4vU2ltcGxlU2NyZWVuXCIpO1xuXG52YXIgQ29tbW9uICAgICAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9Db21tb25cIik7XG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBDT05TVFJVQ1RPUlxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gUHJlbG9hZGVyKCkge1xuICAgIFxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5sb2FkZWRQZXJjZW50YWdlID0gMC4wO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge1BJWEkuU3ByaXRlfVxuICAgICAqL1xuICAgIHRoaXMuX2JhcklubmVyID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtQSVhJLlNwcml0ZX1cbiAgICAgKi9cbiAgICB0aGlzLl9iYXJJbm5lclN0YXJ0WCA9IG51bGw7XG5cbiAgICBTaW1wbGVTY3JlZW4uY2FsbCh0aGlzKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gUHJlbG9hZGVyO1xuUHJlbG9hZGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU2ltcGxlU2NyZWVuLnByb3RvdHlwZSk7XG5QcmVsb2FkZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUHJlbG9hZGVyO1xuXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gUFVCTElDIE1FVEhPRFNcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICovXG5QcmVsb2FkZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpXG57XG4gICAgY29uc29sZS5sb2coXCJQUkVMT0FERVIgSU5JVElBTElaRURcIik7XG4gICAgU2ltcGxlU2NyZWVuLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLmxvYWRlZFBlcmNlbnRhZ2UgPSAwLjA7XG5cbiAgICB2YXIgYmcgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJwcmVsb2FkZXJfYmdcIikpO1xuICAgIHRoaXMuYWRkQ2hpbGQoYmcpO1xuXG4gICAgdmFyIGJhck91dGVyID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwicHJlbG9hZGVyX292ZXJsYXlcIikpO1xuICAgIGJhck91dGVyLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KTtcbiAgICBiYXJPdXRlci54ID0gKENvbW1vbi5TVEFHRV9XSURUSCAvIDIpIC0gMjUwO1xuICAgIGJhck91dGVyLnkgPSAoQ29tbW9uLlNUQUdFX0hFSUdIVCAvIDIpICsgMjAwO1xuICAgIHRoaXMuYWRkQ2hpbGQoYmFyT3V0ZXIpO1xuXG4gICAgdGhpcy5fYmFySW5uZXIgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJwcmVsb2FkZXJfZmlsbFwiKSk7XG4gICAgdGhpcy5fYmFySW5uZXIueCA9IGJhck91dGVyLnggLSAoYmFyT3V0ZXIud2lkdGgvMikgLSAxNzA7XG4gICAgdGhpcy5fYmFySW5uZXIueSA9IGJhck91dGVyLnkgLSAoYmFyT3V0ZXIuaGVpZ2h0LzIpICsgMTA7XG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9iYXJJbm5lcik7XG5cbiAgICB0aGlzLmFkZENoaWxkKGJhck91dGVyKTtcblxuICAgIHRoaXMuX2JhcklubmVyU3RhcnRYID0gdGhpcy5fYmFySW5uZXIueDtcblxuICAgIHZhciBnciA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gICAgZ3IuYmVnaW5GaWxsKDB4MDAwMDAwKTtcbiAgICBnci5kcmF3UmVjdCgwLCAwLCAxLCAxKTtcbiAgICBDb21tb24uZ2VuZXJhdGVkVGV4dHVyZXNbJ2JsYWNrU3F1YXJlJ10gPSBnci5nZW5lcmF0ZVRleHR1cmUoQ29tbW9uLnJlbmRlcmVyLCAxLjAsIFBJWEkuU0NBTEVfTU9ERVMuTElORUFSKTtcblxuICAgIHZhciBibGFjayA9IG5ldyBQSVhJLlNwcml0ZShDb21tb24uZ2VuZXJhdGVkVGV4dHVyZXNbJ2JsYWNrU3F1YXJlJ10pO1xuICAgIGJsYWNrLnggPSB0aGlzLl9iYXJJbm5lci54IC0gKHRoaXMuX2JhcklubmVyLndpZHRoLzIpO1xuICAgIGJsYWNrLndpZHRoID0gYmFyT3V0ZXIud2lkdGgvMjtcbiAgICBibGFjay5oZWlnaHQgPSBDb21tb24uU1RBR0VfSEVJR0hUO1xuICAgIHRoaXMuYWRkQ2hpbGQoYmxhY2spO1xuICAgIFxuICAgIHZhciBoaWRkZW5MaXZlVGV4dCA9IG5ldyBQSVhJLlRleHQoXCJUZXN0XCIsIHtmb250OiBcIjMycHggRnJlZEZyZWRidXJnZXJBcmEtUmVndWxhclwiLCBmaWxsOiAweDAwMDAwMCwgYWxpZ246IFwiY2VudGVyXCIsIHN0cm9rZTogMHgwLCBzdHJva2VUaGlja25lc3M6IDF9KTtcbiAgICBoaWRkZW5MaXZlVGV4dC5hbHBoYSA9IDA7XG4gICAgdGhpcy5hZGRDaGlsZChoaWRkZW5MaXZlVGV4dCk7XG59O1xuXG4vKipcbiAqL1xuUHJlbG9hZGVyLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKVxue1xuICAgIFNpbXBsZVNjcmVlbi5wcm90b3R5cGUuZGlzcG9zZS5jYWxsKHRoaXMpO1xufTtcblxuLyoqXG4gKi9cblByZWxvYWRlci5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oKVxue1xuICAgIFNpbXBsZVNjcmVlbi5wcm90b3R5cGUucmVzaXplLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLnggPSAocDMuVmlldy53aWR0aCAtIENvbW1vbi5TVEFHRV9XSURUSCkgKiAwLjU7XG4gICAgdGhpcy55ID0gKHAzLlZpZXcuaGVpZ2h0IC0gQ29tbW9uLlNUQUdFX0hFSUdIVCkgKiAwLjU7XG59O1xuXG4vKipcbiAqL1xuUHJlbG9hZGVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpXG57XG4gICAgY29uc29sZS5sb2coXCJMT0FESU5HOiBcIiArIHRoaXMubG9hZGVkUGVyY2VudGFnZSk7XG5cbiAgICAvKlxuICAgIHRoaXMubG9hZGVkUGVyY2VudGFnZSArPSAxO1xuXG4gICAgaWYodGhpcy5sb2FkZWRQZXJjZW50YWdlID4gMTAwKVxuICAgICAgICB0aGlzLmxvYWRlZFBlcmNlbnRhZ2UgPSAwOyovXG5cbiAgICB0aGlzLl9iYXJJbm5lci54ID0gdGhpcy5fYmFySW5uZXJTdGFydFggKyAoNjk4ICogKHRoaXMubG9hZGVkUGVyY2VudGFnZS8xMDApKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtGdW5jdGlvbj19IGNhbGxiYWNrXG4gKiBAcGFyYW0geyo9fSBzY29wZVxuICovXG5QcmVsb2FkZXIucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBzY29wZSlcbntcbiAgICBTaW1wbGVTY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVJbi5jYWxsKGNhbGxiYWNrLCBzY29wZSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7RnVuY3Rpb249fSBjYWxsYmFja1xuICogQHBhcmFtIHsqPX0gc2NvcGVcbiAqL1xuUHJlbG9hZGVyLnByb3RvdHlwZS5hbmltYXRlT3V0ID0gZnVuY3Rpb24oY2FsbGJhY2ssIHNjb3BlKSB7XG4gICAgU2ltcGxlU2NyZWVuLnByb3RvdHlwZS5hbmltYXRlT3V0LmNhbGwoY2FsbGJhY2ssIHNjb3BlKTtcbiAgICBcbiAgICB2YXIgdGltZWxpbmUgPSBuZXcgVGltZWxpbmVNYXgoe1xuICAgICAgICBvbkNvbXBsZXRlOiBjYWxsYmFjayxcbiAgICAgICAgb25Db21wbGV0ZVNjb3BlOiBzY29wZVxuICAgIH0pO1xuICAgIHRoaXMuX3R3ZWVucy5wdXNoKHRpbWVsaW5lKTtcbn07XG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBQUklWQVRFIE1FVEhPRFNcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBFVkVOVFNcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBHRVRURVJTL1NFVFRFUlNcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiIsIlxudmFyIENvbW1vbiAgICAgID0gcmVxdWlyZShcIi4uL0NvbW1vblwiKTtcbnZhciBTY2VuZSAgICAgICA9IHJlcXVpcmUoXCIuLi9saWIvU2NlbmVcIik7XG52YXIgU291bmRTRlggICAgPSByZXF1aXJlKFwiLi4vZ2VuZXJhbC9Tb3VuZFNGWFwiKTtcblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIENPTlNUUlVDVE9SXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBTaW1wbGVTY3JlZW4oKSB7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7c2lnbmFscy5TaWduYWx9XG4gICAgICovXG4gICAgdGhpcy5zaWduYWxzID0ge307XG4gICAgdGhpcy5zaWduYWxzLnJlcXVlc3RlZE5leHRTY3JlZW4gPSBuZXcgc2lnbmFscy5TaWduYWwoKTtcbiAgICB0aGlzLnNpZ25hbHMucmVxdWVzdGVkUHJldmlvdXNTY3JlZW4gPSBuZXcgc2lnbmFscy5TaWduYWwoKTtcbiAgICB0aGlzLnNpZ25hbHMucmVxdWVzdGVkUGF1c2VPdmVybGF5ID0gbmV3IHNpZ25hbHMuU2lnbmFsKCk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7cDMuQXNzZXRNYW5hZ2VyfVxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICB0aGlzLl9hc3NldE1hbmFnZXIgPSBwMy5Bc3NldE1hbmFnZXIuaW5zdGFuY2U7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7QXJyYXkuPFR3ZWVuTWF4Pn1cbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgdGhpcy5fdHdlZW5zID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtQSVhJLlBvaW50fVxuICAgICAqL1xuICAgIHRoaXMuX2NlbnRyZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuX2xlZnRFZGdlID0gMDtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5fcmlnaHRFZGdlID0gMDtcblxuICAgIHRoaXMuX2d1aUJ1dHRvblRvcE1hcmdpbiA9IDEwMDtcbiAgICB0aGlzLl9wYXVzZUJ1dHRvbiA9IG51bGw7XG4gICAgdGhpcy5fbXV0ZUJ1dHRvbiA9IG51bGw7XG5cblxuICAgIHAzLlNjcmVlbi5jYWxsKHRoaXMpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBTaW1wbGVTY3JlZW47XG5TaW1wbGVTY3JlZW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTY2VuZS5wcm90b3R5cGUpO1xuU2ltcGxlU2NyZWVuLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNpbXBsZVNjcmVlbjtcblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFBVQkxJQyBNRVRIT0RTXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqL1xuU2ltcGxlU2NyZWVuLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fdHdlZW5zID0gW107XG4gICAgdGhpcy5fY2VudHJlID0gbmV3IFBJWEkuUG9pbnQoQ29tbW9uLlNUQUdFX1dJRFRILzIsIENvbW1vbi5TVEFHRV9IRUlHSFQvMik7XG59O1xuXG4vKipcbiAqL1xuU2ltcGxlU2NyZWVuLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zaWduYWxzLnJlcXVlc3RlZE5leHRTY3JlZW4uZGlzcG9zZSgpO1xuICAgIHRoaXMuc2lnbmFscy5yZXF1ZXN0ZWRQcmV2aW91c1NjcmVlbi5kaXNwb3NlKCk7XG5cbiAgICB2YXIgdHdlZW47XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl90d2VlbnMubGVuZ3RoOyArKyBpKSB7XG4gICAgICAgIHR3ZWVuID0gdGhpcy5fdHdlZW5zW2ldO1xuICAgICAgICBpZiAodHdlZW4pIHtcbiAgICAgICAgICAgIHR3ZWVuLmtpbGwoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl90d2VlbnMubGVuZ3RoID0gMDtcblxuICAgIGNvbnNvbGUubG9nKFwic2NyZWVuIGRpc3Bvc2VkXCIpO1xufTtcblxuLyoqXG4gKi9cblNpbXBsZVNjcmVlbi5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oKSB7XG4gICAgXG4gICAgdGhpcy54ID0gKHAzLlZpZXcud2lkdGggLSBDb21tb24uU1RBR0VfV0lEVEgpICogMC41O1xuXG4gICAgdGhpcy5fcmlnaHRFZGdlID0gdGhpcy5fY2VudHJlLnggKyAocDMuVmlldy53aWR0aC8yKTtcbiAgICB0aGlzLl9sZWZ0RWRnZSA9IHRoaXMuX2NlbnRyZS54IC0gKHAzLlZpZXcud2lkdGgvMik7XG59O1xuXG4vKipcbiAqL1xuU2ltcGxlU2NyZWVuLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYW5pbWF0ZUluKGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICB9LCB0aGlzKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtGdW5jdGlvbj19IGNhbGxiYWNrXG4gKiBAcGFyYW0geyo9fXNjb3BlXG4gKi9cblNpbXBsZVNjcmVlbi5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oY2FsbGJhY2ssIHNjb3BlKSB7XG4gICAgc2NvcGUgPSBzY29wZSB8fCB3aW5kb3c7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7RnVuY3Rpb249fSBjYWxsYmFja1xuICogQHBhcmFtIHsqPX0gc2NvcGVcbiAqL1xuU2ltcGxlU2NyZWVuLnByb3RvdHlwZS5hbmltYXRlT3V0ID0gZnVuY3Rpb24oY2FsbGJhY2ssIHNjb3BlKSB7XG4gICAgc2NvcGUgPSBzY29wZSB8fCB3aW5kb3c7XG59O1xuXG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBQUklWQVRFIE1FVEhPRFNcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblNpbXBsZVNjcmVlbi5wcm90b3R5cGUuX2FkZFBhdXNlQnV0dG9uID0gZnVuY3Rpb24oKVxue1xuICAgIHRoaXMuX3BhdXNlQnV0dG9uID0gbmV3IHAzLkJ1dHRvbih0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShcImJ1dF9wYXVzZV9kZWZcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiYnV0X3BhdXNlX292ZXJcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiYnV0X3BhdXNlX3ByZXNzZWRcIikpO1xuICAgIHRoaXMuX3BhdXNlQnV0dG9uLnkgPSB0aGlzLl9ndWlCdXR0b25Ub3BNYXJnaW47XG4gICAgdGhpcy5fcGF1c2VCdXR0b24uYW5pbWF0ZSA9IHRydWU7XG4gICAgdGhpcy5fcGF1c2VCdXR0b24uc2lnbmFscy5kb3duLmFkZCh0aGlzLm9uUGF1c2UsIHRoaXMpO1xuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fcGF1c2VCdXR0b24pO1xufVxuXG5TaW1wbGVTY3JlZW4ucHJvdG90eXBlLl9hZGRNdXRlQnV0dG9uID0gZnVuY3Rpb24oKVxue1xuICAgIHRoaXMuX211dGVCdXR0b24gPSBuZXcgcDMuTXV0ZUJ1dHRvbihcbiAgICAgICAgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfc291bmRvbl9kZWZcIiksXG4gICAgICAgIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiYnV0X3NvdW5kb2ZmX2RlZlwiKSxcbiAgICAgICAgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfc291bmRvbl9vdmVyXCIpLFxuICAgICAgICB0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShcImJ1dF9zb3VuZG9mZl9vdmVyXCIpLFxuICAgICAgICB0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShcImJ1dF9zb3VuZG9uX3ByZXNzZWRcIiksXG4gICAgICAgIHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiYnV0X3NvdW5kb2ZmX3ByZXNzZWRcIilcbiAgICApO1xuICAgIHRoaXMuX211dGVCdXR0b24uaWQgPSBcIm11dGVcIjtcbiAgICB0aGlzLl9tdXRlQnV0dG9uLnkgPSB0aGlzLl9ndWlCdXR0b25Ub3BNYXJnaW47XG4gICAgdGhpcy5fbXV0ZUJ1dHRvbi5hbmltYXRlID0gdHJ1ZTtcbiAgICB0aGlzLl9tdXRlQnV0dG9uLmluaXQoKTtcbiAgICB0aGlzLl9tdXRlQnV0dG9uLnNpZ25hbHMuZG93bi5hZGQodGhpcy5vbk11dGUsIHRoaXMpO1xuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fbXV0ZUJ1dHRvbik7XG59XG5cblNpbXBsZVNjcmVlbi5wcm90b3R5cGUuX2dldEZpcnN0QnV0dG9uUG9zaXRpb25SaWdodCA9IGZ1bmN0aW9uKClcbntcbiAgICByZXR1cm4gKENvbW1vbi5TVEFHRV9XSURUSCArIHAzLlZpZXcud2lkdGgpICogMC41IC0gMTAwLjA7XG59XG5cblNpbXBsZVNjcmVlbi5wcm90b3R5cGUuX2dldFNlY29uZEJ1dHRvblBvc2l0aW9uUmlnaHQgPSBmdW5jdGlvbigpXG57XG4gICAgcmV0dXJuIChDb21tb24uU1RBR0VfV0lEVEggKyBwMy5WaWV3LndpZHRoKSAqIDAuNSAtIDIxMC4wO1xufVxuXG5TaW1wbGVTY3JlZW4ucHJvdG90eXBlLl9nZXRGaXJzdEJ1dHRvblBvc2l0aW9uTGVmdCA9IGZ1bmN0aW9uKClcbntcbiAgICByZXR1cm4gKENvbW1vbi5TVEFHRV9XSURUSCAtIHAzLlZpZXcud2lkdGgpICogMC41ICsgMTAwLjA7XG59XG5cblNpbXBsZVNjcmVlbi5wcm90b3R5cGUuX2dldFNlY29uZEJ1dHRvblBvc2l0aW9uTGVmdCA9IGZ1bmN0aW9uKClcbntcbiAgICByZXR1cm4gKENvbW1vbi5TVEFHRV9XSURUSCAtIHAzLlZpZXcud2lkdGgpICogMC41ICsgMjEwLjA7XG59XG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBFVkVOVFNcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogQHBhcmFtIHshcDMuQnV0dG9ufSBidXR0b25cbiAqL1xuU2ltcGxlU2NyZWVuLnByb3RvdHlwZS5vbkJ1dHRvbkNsaWNrZWRQcmV2aW91cyA9IGZ1bmN0aW9uKGJ1dHRvbikge1xuXG59O1xuXG5TaW1wbGVTY3JlZW4ucHJvdG90eXBlLm9uUGF1c2UgPSBmdW5jdGlvbigpXG57XG4gICAgdGhpcy5zaWduYWxzLnJlcXVlc3RlZFBhdXNlT3ZlcmxheS5kaXNwYXRjaCgpO1xuICAgIFNvdW5kU0ZYLnBsYXkoJ3NmeF91aV9wcmVzc19idXR0b25fMDEnKTtcbn07XG5cblNpbXBsZVNjcmVlbi5wcm90b3R5cGUub25NdXRlID0gZnVuY3Rpb24oKVxue1xuICAgIFNvdW5kU0ZYLnBsYXkoJ3NmeF91aV9wcmVzc19idXR0b25fMDEnKTtcbn07XG5cblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEdFVFRFUlMvU0VUVEVSU1xuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuIiwiXHJcbnZhciBDb21tb24gICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9Db21tb25cIik7XHJcbnZhciBTaW1wbGVTY3JlZW4gICAgICAgICAgICA9IHJlcXVpcmUoXCIuL1NpbXBsZVNjcmVlblwiKTtcclxudmFyIFNvdW5kU0ZYICAgICAgICAgICAgICAgID0gcmVxdWlyZShcIi4uL2dlbmVyYWwvU291bmRTRlhcIik7XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBDT05TVFJVQ1RPUlxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLyoqXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gU3BsYXNoU2NyZWVuKClcclxue1xyXG4gICAgdGhpcy5fYmcgICAgICAgICAgICA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5fdGl0bGVUZXh0ICAgICA9IG51bGw7XHJcbiAgICB0aGlzLl9ibG9zc29tICAgICAgID0gbnVsbDtcclxuICAgIHRoaXMuX2J1YmJsZXMgICAgICAgPSBudWxsO1xyXG4gICAgdGhpcy5fYnV0dGVyY3VwICAgICA9IG51bGw7XHJcbiAgICB0aGlzLl90cmFpbEJsYXplciAgID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLl9wbGF5QnV0dG9uICAgID0gbnVsbDtcclxuICAgIHRoaXMuX211dGVCdXR0b24gICAgPSBudWxsO1xyXG4gICAgdGhpcy5fZXhpdEJ1dHRvbiAgICA9IG51bGw7XHJcblxyXG4gICAgU2ltcGxlU2NyZWVuLmNhbGwodGhpcyk7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBTcGxhc2hTY3JlZW47XHJcblNwbGFzaFNjcmVlbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFNpbXBsZVNjcmVlbi5wcm90b3R5cGUpO1xyXG5TcGxhc2hTY3JlZW4ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU3BsYXNoU2NyZWVuO1xyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFBVQkxJQyBNRVRIT0RTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICovXHJcblNwbGFzaFNjcmVlbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgY29uc29sZS5sb2coXCJTUExBU0ggSU5JVElBTElaRURcIik7XHJcblxyXG4gICAgU2ltcGxlU2NyZWVuLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XHJcblxyXG4gICAgdGhpcy5fYmcgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJiZ19zcGxhc2hcIikpO1xyXG4gICAgdGhpcy5fYmcuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC41LCAwLjUpO1xyXG4gICAgdGhpcy5fYmcueCA9IENvbW1vbi5TVEFHRV9XSURUSCAvIDI7XHJcbiAgICB0aGlzLl9iZy55ID0gQ29tbW9uLlNUQUdFX0hFSUdIVCAvIDI7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuX2JnKTtcclxuXHJcbiAgICB2YXIgYnVpbGRpbmdzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIHtpbWFnZTonYml0MScsIHg6KENvbW1vbi5TVEFHRV9XSURUSC8yKS01MDAsIHk6MzAwfSxcclxuICAgICAgICAgICAgICAgICAgICB7aW1hZ2U6J2JpdDInLCB4OihDb21tb24uU1RBR0VfV0lEVEgvMiktNjMwLCB5OjQ1MH0sXHJcbiAgICAgICAgICAgICAgICAgICAge2ltYWdlOidiaXQzJywgeDooQ29tbW9uLlNUQUdFX1dJRFRILzIpLTcwMCwgeToyMDB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtpbWFnZTonYml0NCcsIHg6KENvbW1vbi5TVEFHRV9XSURUSC8yKS01MDAsIHk6NTMwfSxcclxuICAgICAgICAgICAgICAgICAgICB7aW1hZ2U6J2JpdDYnLCB4OihDb21tb24uU1RBR0VfV0lEVEgvMiktNTUwLCB5OjY1MH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICB2YXIgZmdfYnVpbGRpbmc7XHJcblxyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGJ1aWxkaW5ncy5sZW5ndGg7IGkrKylcclxuICAgIHtcclxuICAgICAgICB2YXIgYnVpbGRpbmcgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoYnVpbGRpbmdzW2ldLmltYWdlKSk7XHJcbiAgICAgICAgYnVpbGRpbmcuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC41LCAwLjUpO1xyXG4gICAgICAgIGJ1aWxkaW5nLnggPSBidWlsZGluZ3NbaV0ueDtcclxuICAgICAgICBidWlsZGluZy55ID0gYnVpbGRpbmdzW2ldLnk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChidWlsZGluZyk7XHJcbiAgICAgICAgQ29tbW9uLmFuaW1hdG9yLmFkZChUd2Vlbk1heC50byhidWlsZGluZywgMSwge2RlbGF5Ok1hdGgucmFuZG9tKCksIHk6YnVpbGRpbmdzW2ldLnktMjAsIGVhc2U6U2luZS5lYXNlSW5PdXQsIHlveW86dHJ1ZSwgcmVwZWF0Oi0xfSkpO1xyXG5cclxuICAgICAgICBpZihpID09IGJ1aWxkaW5ncy5sZW5ndGgtMSlcclxuICAgICAgICAgICAgZmdfYnVpbGRpbmcgPSBidWlsZGluZztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9tb2pvID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwibW9qb2pvam9cIikpO1xyXG4gICAgdGhpcy5fbW9qby5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLCAxKTtcclxuICAgIHRoaXMuX21vam8ueSA9IENvbW1vbi5TVEFHRV9IRUlHSFQgKyB0aGlzLl9tb2pvLmhlaWdodDtcclxuICAgIHRoaXMuX21vam8ueCA9IChDb21tb24uU1RBR0VfV0lEVEgvMikgLSB0aGlzLl9tb2pvLndpZHRoIC0gMTA7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuX21vam8pO1xyXG5cclxuICAgICAgICB2YXIgbGVmdEdsb3cgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJtb2pvam9qb19oYW5kZ2xvd19sZWZ0XCIpKTtcclxuICAgICAgICBsZWZ0R2xvdy5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLjUsIDAuNSk7XHJcbiAgICAgICAgbGVmdEdsb3cueCA9IDI3MDtcclxuICAgICAgICBsZWZ0R2xvdy5zY2FsZSA9IG5ldyBQSVhJLlBvaW50KDAuNCwgMC40KTtcclxuICAgICAgICBsZWZ0R2xvdy55ID0gLXRoaXMuX21vam8uaGVpZ2h0ICsgNzA7XHJcbiAgICAgICAgdGhpcy5fbW9qby5hZGRDaGlsZChsZWZ0R2xvdyk7XHJcbiAgICAgICAgdmFyIHJpZ2h0R2xvdyA9IG5ldyBQSVhJLlNwcml0ZSh0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShcIm1vam9qb2pvX2hhbmRnbG93X3JpZ2h0XCIpKTtcclxuICAgICAgICByaWdodEdsb3cuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC41LCAwLjUpO1xyXG4gICAgICAgIHJpZ2h0R2xvdy54ID0gNTcwO1xyXG4gICAgICAgIHJpZ2h0R2xvdy55ID0gLXRoaXMuX21vam8uaGVpZ2h0ICsgMTIwO1xyXG4gICAgICAgIHJpZ2h0R2xvdy5zY2FsZSA9IG5ldyBQSVhJLlBvaW50KDAuNCwgMC40KTtcclxuICAgICAgICB0aGlzLl9tb2pvLmFkZENoaWxkKHJpZ2h0R2xvdyk7XHJcblxyXG4gICAgICAgIHZhciBnbG93cyA9IFtsZWZ0R2xvdywgcmlnaHRHbG93XTtcclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZ2xvd3MubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDb21tb24uYW5pbWF0b3IuYWRkKFR3ZWVuTWF4LnRvKGdsb3dzW2ldLnNjYWxlLCAuMjQgKyAoMC4wMSppKSwge3g6MS4yLCB5OjEuMiwgZWFzZTpTaW5lLmVhc2VJbk91dCwgcmVwZWF0Oi0xfSkpO1xyXG4gICAgICAgICAgICBDb21tb24uYW5pbWF0b3IuYWRkKFR3ZWVuTWF4LnRvKGdsb3dzW2ldLCAuMjQgKyAoMC4wMSppKSwge2FscGhhOjAuMSwgZWFzZTpTaW5lLmVhc2VJbk91dCwgcmVwZWF0Oi0xLCBvblJlcGVhdFNjb3BlOnRoaXMsIG9uUmVwZWF0UGFyYW1zOltnbG93c1tpXV0sIG9uUmVwZWF0OmZ1bmN0aW9uKGdsb3cpe1xyXG4gICAgICAgICAgICAgICAgZ2xvdy5yb3RhdGlvbiA9ICgzNjAgKiBNYXRoLnJhbmRvbSgpKSAqIFBJWEkuREVHX1RPX1JBRDtcclxuICAgICAgICAgICAgfX0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB0bCA9IG5ldyBUaW1lbGluZU1heCh7cmVwZWF0Oi0xfSk7XHJcbiAgICAgICAgdGwudG8odGhpcy5fbW9qby5zY2FsZSwgLjMsIHt5OjAuOSwgZWFzZTpTaW5lLmVhc2VJbk91dH0pO1xyXG4gICAgICAgIHRsLnRvKHRoaXMuX21vam8uc2NhbGUsIC4xLCB7eToxLCBlYXNlOlNpbmUuZWFzZUluT3V0fSk7XHJcbiAgICAgICAgdGwudG8odGhpcy5fbW9qby5zY2FsZSwgLjEsIHt5OjAuOTUsIGVhc2U6U2luZS5lYXNlSW5PdXR9KTtcclxuICAgICAgICB0bC50byh0aGlzLl9tb2pvLnNjYWxlLCAuMSwge3k6MSwgZWFzZTpTaW5lLmVhc2VJbk91dH0pO1xyXG4gICAgICAgIHRsLnRvKHRoaXMuX21vam8uc2NhbGUsIC4xLCB7eTowLjk3LCBlYXNlOlNpbmUuZWFzZUluT3V0fSk7XHJcbiAgICAgICAgdGwudG8odGhpcy5fbW9qby5zY2FsZSwgLjEsIHt5OjEsIGVhc2U6U2luZS5lYXNlSW5PdXR9KTtcclxuICAgICAgICB0bC50byh0aGlzLl9tb2pvLnNjYWxlLCAyLCB7ZWFzZTpTaW5lLmVhc2VJbk91dH0pO1xyXG5cclxuXHJcbiAgICB0aGlzLmFkZENoaWxkKGZnX2J1aWxkaW5nKTtcclxuXHJcbiAgICB0aGlzLl90aXRsZVRleHQgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJwcGdfbG9nb1wiKSk7XHJcbiAgICB0aGlzLl90aXRsZVRleHQuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC41LCAwLjUpO1xyXG4gICAgdGhpcy5fdGl0bGVUZXh0LnggPSAoQ29tbW9uLlNUQUdFX1dJRFRILzIpIC0gMTAwO1xyXG4gICAgdGhpcy5fdGl0bGVUZXh0LnkgPSAxNTA7XHJcbiAgICB0aGlzLl90aXRsZVRleHQuc2NhbGUgPSBuZXcgUElYSS5Qb2ludCgwLCAwKTtcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdGl0bGVUZXh0KTtcclxuXHJcbiAgICB0aGlzLl9ibG9zc29tID0gbmV3IFBJWEkuU3ByaXRlKHRoaXMuX2Fzc2V0TWFuYWdlci5nZXRUZXh0dXJlKFwiZ2lybDJcIikpO1xyXG4gICAgdGhpcy5fYmxvc3NvbS5hbmNob3IgPSBuZXcgUElYSS5Qb2ludCgwLCAxKTtcclxuICAgIHRoaXMuX2Jsb3Nzb20uc2NhbGUgPSBuZXcgUElYSS5Qb2ludCgwLCAwKTtcclxuICAgIHRoaXMuX2Jsb3Nzb20ueCA9IChDb21tb24uU1RBR0VfV0lEVEgvMikgLSAyMjA7IFxyXG4gICAgdGhpcy5fYmxvc3NvbS55ID0gQ29tbW9uLlNUQUdFX0hFSUdIVCArIDEwMDtcclxuICAgIENvbW1vbi5hbmltYXRvci5hZGQoVHdlZW5NYXgudG8odGhpcy5fYmxvc3NvbS5hbmNob3IsIDEsIHtkZWxheTpNYXRoLnJhbmRvbSgpLCB5OjAuOTk1LCBlYXNlOlNpbmUuZWFzZUluT3V0LCB5b3lvOnRydWUsIHJlcGVhdDotMX0pKTtcclxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fYmxvc3NvbSk7XHJcblxyXG4gICAgdGhpcy5fYnViYmxlcyA9IG5ldyBQSVhJLlNwcml0ZSh0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShcImdpcmwxXCIpKTtcclxuICAgIHRoaXMuX2J1YmJsZXMuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMCwgMSk7XHJcbiAgICB0aGlzLl9idWJibGVzLnNjYWxlID0gbmV3IFBJWEkuUG9pbnQoMCwgMCk7XHJcbiAgICB0aGlzLl9idWJibGVzLnggPSAoQ29tbW9uLlNUQUdFX1dJRFRILzIpIC0gMjMwOyBcclxuICAgIHRoaXMuX2J1YmJsZXMueSA9IENvbW1vbi5TVEFHRV9IRUlHSFQgKyAzMDtcclxuICAgIENvbW1vbi5hbmltYXRvci5hZGQoVHdlZW5NYXgudG8odGhpcy5fYnViYmxlcy5hbmNob3IsIDEsIHtkZWxheTpNYXRoLnJhbmRvbSgpLCB5OjAuOTksIGVhc2U6U2luZS5lYXNlSW5PdXQsIHlveW86dHJ1ZSwgcmVwZWF0Oi0xfSkpO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9idWJibGVzKTtcclxuXHJcbiAgICB0aGlzLl9idXR0ZXJjdXAgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJnaXJsM1wiKSk7XHJcbiAgICB0aGlzLl9idXR0ZXJjdXAuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMCwgMSk7XHJcbiAgICB0aGlzLl9idXR0ZXJjdXAuc2NhbGUgPSBuZXcgUElYSS5Qb2ludCgwLCAwKTtcclxuICAgIHRoaXMuX2J1dHRlcmN1cC54ID0gKENvbW1vbi5TVEFHRV9XSURUSC8yKSAtIDUwOyBcclxuICAgIHRoaXMuX2J1dHRlcmN1cC55ID0gQ29tbW9uLlNUQUdFX0hFSUdIVCAtIDIwO1xyXG4gICAgQ29tbW9uLmFuaW1hdG9yLmFkZChUd2Vlbk1heC50byh0aGlzLl9idXR0ZXJjdXAuYW5jaG9yLCAxLCB7ZGVsYXk6TWF0aC5yYW5kb20oKSwgeTowLjk5LCBlYXNlOlNpbmUuZWFzZUluT3V0LCB5b3lvOnRydWUsIHJlcGVhdDotMX0pKTsgXHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuX2J1dHRlcmN1cCk7XHJcblxyXG4gICAgdGhpcy5fdHJhaWxCbGF6ZXIgPSBuZXcgUElYSS5TcHJpdGUodGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJnYW1lX3RpdGxlXCIpKTtcclxuICAgIHRoaXMuX3RyYWlsQmxhemVyLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDEsIDEpO1xyXG4gICAgdGhpcy5fdHJhaWxCbGF6ZXIueCA9IC0odGhpcy5fdHJhaWxCbGF6ZXIud2lkdGgpO1xyXG4gICAgdGhpcy5fdHJhaWxCbGF6ZXIueSA9IENvbW1vbi5TVEFHRV9IRUlHSFQgLSAyMDA7XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3RyYWlsQmxhemVyKTtcclxuXHJcbiAgICB0aGlzLl9wbGF5QnV0dG9uID0gbmV3IHAzLkJ1dHRvbih0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShcImJ1dF9wbGF5X2RlZlwiKSwgdGhpcy5fYXNzZXRNYW5hZ2VyLmdldFRleHR1cmUoXCJidXRfcGxheV9vdmVyXCIpLCB0aGlzLl9hc3NldE1hbmFnZXIuZ2V0VGV4dHVyZShcImJ1dF9wbGF5X3ByZXNzZWRcIikpO1xyXG4gICAgdGhpcy5fcGxheUJ1dHRvbi54ID0gKENvbW1vbi5TVEFHRV9XSURUSCAvIDIpO1xyXG4gICAgdGhpcy5fcGxheUJ1dHRvbi55ID0gQ29tbW9uLlNUQUdFX0hFSUdIVCAtIDEwMDtcclxuICAgIHRoaXMuX3BsYXlCdXR0b24uc2lnbmFscy5kb3duLmFkZE9uY2UodGhpcy5wbGF5Q2xpY2tlZCwgdGhpcyk7XHJcbiAgICB0aGlzLl9wbGF5QnV0dG9uLnNpZ25hbHMub3Zlci5hZGQodGhpcy5idXR0b25PdmVyLCB0aGlzKTtcclxuICAgIHRoaXMuX3BsYXlCdXR0b24uc2NhbGUgPSBuZXcgUElYSS5Qb2ludCgwLCAwKTtcclxuICAgIHRoaXMuX3BsYXlCdXR0b24uYW5pbWF0ZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9wbGF5QnV0dG9uKTtcclxuXHJcbiAgICB0aGlzLl9hZGRNdXRlQnV0dG9uKCk7XHJcblxyXG4gICAgaWYoIXAzLkRldmljZS5pc0lPUylcclxuICAgIHtcclxuICAgICAgICBTb3VuZFNGWC5wbGF5KCdtdXNpY19wcGdfc3BsYXNoX2dlbmVyaWMnLCB7bG9vcDp0cnVlfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKipcclxuICovXHJcblNwbGFzaFNjcmVlbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICBcclxufTtcclxuXHJcblNwbGFzaFNjcmVlbi5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKClcclxue1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKi9cclxuU3BsYXNoU2NyZWVuLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIFNpbXBsZVNjcmVlbi5wcm90b3R5cGUucmVzaXplLmNhbGwodGhpcyk7XHJcblxyXG4gICAgdGhpcy5fcGxheUJ1dHRvbi54ID0gdGhpcy5fZ2V0Rmlyc3RCdXR0b25Qb3NpdGlvblJpZ2h0KCkgLSA1MDtcclxuICAgIHRoaXMuX211dGVCdXR0b24ueCA9IHRoaXMuX2dldEZpcnN0QnV0dG9uUG9zaXRpb25SaWdodCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb249fSBjYWxsYmFja1xyXG4gKiBAcGFyYW0geyo9fXNjb3BlXHJcbiAqL1xyXG5TcGxhc2hTY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBzY29wZSkge1xyXG4gICAgXHJcbiAgICBTaW1wbGVTY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVJbi5jYWxsKHRoaXMpO1xyXG5cclxuICAgIHZhciB0bCA9IG5ldyBUaW1lbGluZU1heCgpO1xyXG4gICAgQ29tbW9uLmFuaW1hdG9yLmFkZCh0bCk7XHJcbiAgICB0bC50byh0aGlzLl90aXRsZVRleHQuc2NhbGUsIC4zLCB7ZGVsYXk6LjUsIHg6MSwgeToxLCBlYXNlOkV4cG8uZWFzZU91dH0pO1xyXG4gICAgdGwudG8odGhpcy5fbW9qbywgLjMsIHt5OkNvbW1vbi5TVEFHRV9IRUlHSFQgLSA1MCwgZWFzZTpFeHBvLmVhc2VPdXR9KTtcclxuICAgIHRsLnRvKHRoaXMuX2Jsb3Nzb20uc2NhbGUsIC4zLCB7eDoxLCB5OjEsIGVhc2U6RXhwby5lYXNlT3V0LCBvblN0YXJ0U2NvcGU6dGhpcywgb25TdGFydDpmdW5jdGlvbigpe1xyXG4gICAgICAgIFNvdW5kU0ZYLnBsYXkoJ3NmeF9wcGdfZ2lybHNfZmx5YXdheV8wMCcpO1xyXG4gICAgfX0pO1xyXG4gICAgdGwudG8odGhpcy5fYnViYmxlcy5zY2FsZSwgLjMsIHt4OjEsIHk6MSwgZWFzZTpFeHBvLmVhc2VPdXQsIG9uU3RhcnRTY29wZTp0aGlzLCBvblN0YXJ0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgU291bmRTRlgucGxheSgnc2Z4X3BwZ19naXJsc19mbHlhd2F5XzAwJyk7XHJcbiAgICB9fSk7XHJcbiAgICB0bC50byh0aGlzLl9idXR0ZXJjdXAuc2NhbGUsIC4zLCB7eDoxLCB5OjEsIGVhc2U6RXhwby5lYXNlT3V0LCBvblN0YXJ0U2NvcGU6dGhpcywgb25TdGFydDpmdW5jdGlvbigpe1xyXG4gICAgICAgIFNvdW5kU0ZYLnBsYXkoJ3NmeF9wcGdfZ2lybHNfZmx5YXdheV8wMCcpO1xyXG4gICAgfX0pO1xyXG4gICAgdGwudG8odGhpcy5fdHJhaWxCbGF6ZXIsIC4zLCB7eDooQ29tbW9uLlNUQUdFX1dJRFRIIC8gMikgKyAyMzAsIHk6Q29tbW9uLlNUQUdFX0hFSUdIVC01MCwgZWFzZTpFeHBvLmVhc2VPdXQsIG9uU3RhcnRTY29wZTp0aGlzLCBvblN0YXJ0OmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgU291bmRTRlgucGxheSgnc2Z4X3BwZ19tb3ZlXzAwJyk7XHJcbiAgICB9fSk7XHJcbiAgICB0bC50byh0aGlzLl9wbGF5QnV0dG9uLnNjYWxlLCAxLCB7eDoxLCB5OjEsIGVhc2U6RWxhc3RpYy5lYXNlT3V0fSk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb249fSBjYWxsYmFja1xyXG4gKiBAcGFyYW0geyo9fSBzY29wZVxyXG4gKi9cclxuU3BsYXNoU2NyZWVuLnByb3RvdHlwZS5hbmltYXRlT3V0ID0gZnVuY3Rpb24oY2FsbGJhY2ssIHNjb3BlKSB7XHJcbiAgICAgICAgXHJcbiAgICBTaW1wbGVTY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVPdXQuY2FsbCh0aGlzKTtcclxufTtcclxuXHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUFJJVkFURSBNRVRIT0RTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gRVZFTlRTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICovXHJcblNwbGFzaFNjcmVlbi5wcm90b3R5cGUucGxheUNsaWNrZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIFxyXG4gICAgdGhpcy5fcGxheUJ1dHRvbi5zaWduYWxzLm92ZXIucmVtb3ZlKHRoaXMuYnV0dG9uT3ZlciwgdGhpcyk7XHJcbiAgICB0aGlzLl9wbGF5QnV0dG9uLnNpZ25hbHMuZG93bi5yZW1vdmUodGhpcy5wbGF5Q2xpY2tlZCwgdGhpcyk7XHJcblxyXG4gICAgVHdlZW5NYXgua2lsbFR3ZWVuc09mKHRoaXMuX3BsYXlCdXR0b24uc2NhbGUpO1xyXG4gICAgQ29tbW9uLmFuaW1hdG9yLmFkZChUd2Vlbk1heC50byh0aGlzLl9wbGF5QnV0dG9uLnNjYWxlLCAuMiwge3g6MC42LCB5OjAuNiwgZWFzZTpTaW5lLmVhc2VJbk91dCwgb25Db21wbGV0ZTpmdW5jdGlvbigpe1xyXG4gICAgICAgIENvbW1vbi5hbmltYXRvci5hZGQoVHdlZW5NYXgudG8odGhpcy5fcGxheUJ1dHRvbi5zY2FsZSwgLjUsIHt4OjEsIHk6MSwgZWFzZTpFbGFzdGljLmVhc2VPdXQsIG9uQ29tcGxldGU6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdGhpcy5zaWduYWxzLnJlcXVlc3RlZE5leHRTY3JlZW4uZGlzcGF0Y2goKTtcclxuICAgICAgICB9LCBvbkNvbXBsZXRlU2NvcGU6dGhpc30pKTtcclxuXHJcbiAgICB9LCBvbkNvbXBsZXRlU2NvcGU6dGhpc30pKTtcclxuXHJcbiAgICBTb3VuZFNGWC5wbGF5KCdzZnhfdWlfcHJlc3NwbGF5XzAwJyk7XHJcblxyXG4gICAgaWYocDMuRGV2aWNlLmlzSU9TKVxyXG4gICAge1xyXG4gICAgICAgIFNvdW5kU0ZYLnBsYXkoJ211c2ljX3BwZ19zcGxhc2hfZ2VuZXJpYycsIHtsb29wOnRydWV9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKi9cclxuU3BsYXNoU2NyZWVuLnByb3RvdHlwZS5idXR0b25PdmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgXHJcbiAgICBcclxufTtcclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBHRVRURVJTL1NFVFRFUlNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuIiwidmFyIENvbW1vbiAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9Db21tb25cIik7XHJcbnZhciBTY3JvbGxlck9iamVjdFx0PSByZXF1aXJlKFwiLi9TY3JvbGxlck9iamVjdFwiKTtcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIENPTlNUUlVDVE9SXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSB7UElYSS5Qb2ludH0gc2NyZWVuRm9jdXNQb2ludFxyXG4gKiBAcGFyYW0ge1BJWEkuUmVjdGFuZ2xlfSB2aWV3Qm91bmRhcnlcclxuICogQHBhcmFtIHtQSVhJLlJlY3RhbmdsZX0gYWN0aXZlQm91bmRhcnlcclxuICovXHJcbmZ1bmN0aW9uIFNjcm9sbGVyRW5naW5lKHNjcmVlbkZvY3VzUG9pbnQsIHZpZXdCb3VuZGFyeSwgYWN0aXZlQm91bmRhcnkpXHJcbntcclxuXHQvKipcclxuICAgICAqIEB0eXBlIHtzaWduYWxzLlNpZ25hbH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5zaWduYWxzID0ge307XHJcblx0dGhpcy5zaWduYWxzLmNvbGxpc2lvbkZpcmVkID0gbmV3IHNpZ25hbHMuU2lnbmFsKCk7XHJcblxyXG5cdC8qKlxyXG4gICAgICogQHR5cGUge1BJWEkuUG9pbnR9IC0gUG9pbnQsIHJlbGF0aXZlIHRvIHNjcmVlbiBzaXplLCB0aGF0IHRoZSBlbmdpbmUgaXMgZm9jdXNlZCBvbi5cclxuICAgICAqL1xyXG5cdHRoaXMuX3NjcmVlbkZvY3VzUG9pbnQgPSBzY3JlZW5Gb2N1c1BvaW50O1xyXG5cclxuXHQvKipcclxuICAgICAqIEB0eXBlIHtQSVhJLlBvaW50fSAtIFdvcmxkIFBvaW50LCBzaWduaWZ5aW5nIHBvc2l0aW9uIG9mIGNhbWVyYSBpbiB0aGUgd29ybGQuXHJcbiAgICAgKi9cclxuXHR0aGlzLl92aWV3ID0gc2NyZWVuRm9jdXNQb2ludC5jbG9uZSgpO1xyXG5cclxuXHQvKipcclxuICAgICAqIEB0eXBlIHtQSVhJLlJlY3RhbmdsZX0gLSBUaGUgYm91bmRhcnkgcmVjdGFuZ2xlLCByZWxhdGl2ZSB0byB0aGUgc2NyZWVuRm9jdXNQb2ludCwgaW4gd2hpY2ggdGhlIHdvcmxkIG9iamVjdHMgYXJlIHZpc2libGVcclxuICAgICAqL1xyXG5cdHRoaXMuX3ZpZXdCb3VuZGFyeSA9IHZpZXdCb3VuZGFyeTtcclxuXHJcblx0LyoqXHJcbiAgICAgKiBAdHlwZSB7UElYSS5SZWN0YW5nbGV9IC0gVGhlIGJvdW5kYXJ5IHJlY3RhbmdsZSwgcmVsYXRpdmUgdG8gdGhlIHNjcmVlbkZvY3VzUG9pbnQsIGluIHdoaWNoIHRoZSB3b3JsZCBvYmplY3RzIGFyZSBhY3RpdmVcclxuICAgICAqL1xyXG5cdHRoaXMuX2FjdGl2ZUJvdW5kYXJ5ID0gYWN0aXZlQm91bmRhcnk7XHJcblxyXG5cdC8qKlxyXG4gICAgICogQHR5cGUge3AzLkNhbWVyYX1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fY2FtZXJhID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHtPYmplY3R9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuX2xheWVycyA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7QXJyYXk8U2Nyb2xsZXJMb29waW5nUmFuZ2U+fVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9sb29waW5nUmFuZ2VzID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHtBcnJheTxBcnJheTxTdHJpbmc+Pn1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fY29sbGlzaW9ucyA9IG51bGw7XHJcblxyXG4gICAgXHJcblx0UElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjcm9sbGVyRW5naW5lO1xyXG5TY3JvbGxlckVuZ2luZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZSk7XHJcblNjcm9sbGVyRW5naW5lLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNjcm9sbGVyRW5naW5lO1xyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFBVQkxJQyBNRVRIT0RTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICovXHJcblNjcm9sbGVyRW5naW5lLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKVxyXG57XHJcbiAgICB0aGlzLl9jYW1lcmEgPSBuZXcgcDMuQ2FtZXJhKHRoaXMuX3ZpZXcsIHRydWUpO1xyXG4gICAgdGhpcy5fbGF5ZXJzID0ge307XHJcbiAgICB0aGlzLl9sb29waW5nUmFuZ2VzID0gW107XHJcbiAgICB0aGlzLl9jb2xsaXNpb25zID0gW107XHJcbn07XHJcblxyXG4vKipcclxuICovXHJcblNjcm9sbGVyRW5naW5lLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpXHJcbntcclxuXHRmb3IodmFyIGkgaW4gdGhpcy5fbGF5ZXJzKVxyXG5cdHtcclxuXHRcdHZhciBjb250ID0gdGhpcy5fbGF5ZXJzW2ldLmNvbnRhaW5lcjtcclxuXHJcblx0XHRmb3IodmFyIGogPSAwOyBqIDwgdGhpcy5fbGF5ZXJzW2ldLm9iamVjdHMubGVuZ3RoOyBqKyspXHJcblx0XHR7XHJcblx0XHRcdHZhciBvYmogPSB0aGlzLl9sYXllcnNbaV0ub2JqZWN0c1tqXTtcclxuXHJcblx0XHRcdG9iai51cGRhdGUoKTtcclxuXHJcblx0XHRcdGlmKG9iai5yZW1vdmVJZk91dHNpZGVCb3VuZGFyeSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmKGNvbnQueCArIG9iai54ICsgb2JqLmFyZWFSZWN0LnggKyBvYmouYXJlYVJlY3Qud2lkdGggPCB0aGlzLl9zY3JlZW5Gb2N1c1BvaW50LnggKyB0aGlzLl9hY3RpdmVCb3VuZGFyeS54IHx8XHJcblx0XHRcdFx0ICAgY29udC55ICsgb2JqLnkgKyBvYmouYXJlYVJlY3QueSArIG9iai5hcmVhUmVjdC53aWR0aCA8IHRoaXMuX3NjcmVlbkZvY3VzUG9pbnQueSArIHRoaXMuX2FjdGl2ZUJvdW5kYXJ5LnkgfHxcclxuXHRcdFx0XHQgICBjb250LnggKyBvYmoueCA+IHRoaXMuX3NjcmVlbkZvY3VzUG9pbnQueCArIHRoaXMuX2FjdGl2ZUJvdW5kYXJ5LnggKyB0aGlzLl9hY3RpdmVCb3VuZGFyeS53aWR0aCB8fFxyXG5cdFx0XHRcdCAgIGNvbnQueSArIG9iai55ID4gdGhpcy5fc2NyZWVuRm9jdXNQb2ludC55ICsgdGhpcy5fYWN0aXZlQm91bmRhcnkueSArIHRoaXMuX2FjdGl2ZUJvdW5kYXJ5LmhlaWdodClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR0aGlzLnJlbW92ZU9iamVjdEZyb21MYXllcihvYmosIGkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihvYmoucmVtb3ZlTWUpXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0aGlzLnJlbW92ZU9iamVjdEZyb21MYXllcihvYmosIGkpO1xyXG5cdFx0XHR9XHRcclxuXHRcdFx0aWYob2JqLnBlcnNpc3RlbnRYKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0b2JqLnggPSAodGhpcy5fc2NyZWVuRm9jdXNQb2ludC54ICsgb2JqLnBlcnNpc3RlbnRYKSAtIGNvbnQueDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihvYmoucGVyc2lzdGVudFJlY3RhbmdsZSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZhciBvYmpYID0gY29udC54ICsgb2JqLnggKyBvYmouYXJlYVJlY3QueDtcclxuXHRcdFx0XHR2YXIgb2JqWSA9IGNvbnQueSArIG9iai55ICsgb2JqLmFyZWFSZWN0Lnk7XHJcblx0XHRcdFx0dmFyIG9ialhFZGdlID0gY29udC54ICsgb2JqLnggKyBvYmouYXJlYVJlY3QueCArIG9iai5hcmVhUmVjdC53aWR0aDtcclxuXHRcdFx0XHR2YXIgb2JqWUVkZ2UgPSBjb250LnkgKyBvYmoueSArIG9iai5hcmVhUmVjdC55ICsgb2JqLmFyZWFSZWN0LmhlaWdodDtcclxuXHRcdFx0XHR2YXIgbGVmdExpbWl0ID0gdGhpcy5fc2NyZWVuRm9jdXNQb2ludC54ICsgb2JqLnBlcnNpc3RlbnRSZWN0YW5nbGUueDtcclxuXHRcdFx0XHR2YXIgcmlnaHRMaW1pdCA9IGxlZnRMaW1pdCArIG9iai5wZXJzaXN0ZW50UmVjdGFuZ2xlLndpZHRoO1xyXG5cdFx0XHRcdHZhciB1cHBlckxpbWl0ID0gdGhpcy5fc2NyZWVuRm9jdXNQb2ludC55ICsgb2JqLnBlcnNpc3RlbnRSZWN0YW5nbGUueTtcclxuXHRcdFx0XHR2YXIgbG93ZXJMaW1pdCA9IHVwcGVyTGltaXQgKyBvYmoucGVyc2lzdGVudFJlY3RhbmdsZS5oZWlnaHQ7XHJcblxyXG5cdFx0XHRcdGlmKG9ialggPCBsZWZ0TGltaXQgJiYgb2JqLnhTcGVlZCA8PSAwKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG9iai54ID0gb2JqLnggKyAoKGxlZnRMaW1pdC1vYmpYKSAqIG9iai5wZXJzaXN0ZW50UmVjdGFuZ2xlRXhpdEVhc2UpO1xyXG5cdFx0XHRcdFx0b2JqLm9uRXhpdFBlcnNpc3RlbnRSZWN0YW5nbGUoJ2xlZnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYob2JqWSA8IHVwcGVyTGltaXQgJiYgb2JqLnlTcGVlZCA8PSAwKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG9iai55ID0gb2JqLnkgKyAoKHVwcGVyTGltaXQtb2JqWSkgKiBvYmoucGVyc2lzdGVudFJlY3RhbmdsZUV4aXRFYXNlKTtcclxuXHRcdFx0XHRcdG9iai5vbkV4aXRQZXJzaXN0ZW50UmVjdGFuZ2xlKCd1cHBlcicpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYob2JqWEVkZ2UgPiByaWdodExpbWl0ICYmIG9iai54U3BlZWQgPj0gMClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRvYmoueCA9IG9iai54IC0gKChvYmpYRWRnZS1yaWdodExpbWl0KSAqIG9iai5wZXJzaXN0ZW50UmVjdGFuZ2xlRXhpdEVhc2UpO1xyXG5cdFx0XHRcdFx0b2JqLm9uRXhpdFBlcnNpc3RlbnRSZWN0YW5nbGUoJ3JpZ2h0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmKG9iallFZGdlID4gbG93ZXJMaW1pdCAmJiBvYmoueFNwZWVkID49IDApXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0b2JqLnkgPSBvYmoueSAtICgob2JqWUVkZ2UtbG93ZXJMaW1pdCkgKiBvYmoucGVyc2lzdGVudFJlY3RhbmdsZUV4aXRFYXNlKTtcclxuXHRcdFx0XHRcdG9iai5vbkV4aXRQZXJzaXN0ZW50UmVjdGFuZ2xlKCdsb3dlcicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IodmFyIGMgPSAwOyBjIDwgdGhpcy5fY29sbGlzaW9ucy5sZW5ndGg7IGMrKylcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmKHRoaXMuX2NvbGxpc2lvbnNbY10ubGVuZ3RoID09IDIpXHJcblx0XHRcdFx0e1x0XHJcblx0XHRcdFx0XHRpZih0aGlzLl9jb2xsaXNpb25zW2NdWzBdID09IG9iai50eXBlKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHR0aGlzLl9jaGVja0ZvckNvbGxpc2lvbnMob2JqLCBjb250LCB0aGlzLl9jb2xsaXNpb25zW2NdWzFdKTtcclxuXHRcdFx0XHRcdH1cdFxyXG5cdFx0XHRcdH1cdFxyXG5cdFx0XHR9XHRcclxuXHRcdH1cdFxyXG5cdH1cclxuXHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMuX2xvb3BpbmdSYW5nZXMubGVuZ3RoOyBpKyspXHJcblx0e1xyXG5cdFx0dmFyIG5ld09iamVjdHMgPSB0aGlzLl9sb29waW5nUmFuZ2VzW2ldLnVwZGF0ZSh0aGlzLl9zY3JlZW5Gb2N1c1BvaW50LCB0aGlzLl92aWV3Qm91bmRhcnksIHRoaXMuX2xheWVyc1t0aGlzLl9sb29waW5nUmFuZ2VzW2ldLmxheWVyXS5jb250YWluZXIpO1xyXG5cdFx0Zm9yKHZhciBqID0gMDsgaiA8IG5ld09iamVjdHMubGVuZ3RoOyBqKyspXHJcblx0XHR7XHJcblx0XHRcdG5ld09iamVjdHNbal0ub2JqLmFyZWFSZWN0ID0gbmV3IFBJWEkuUmVjdGFuZ2xlKG5ld09iamVjdHNbal0uYXJlYVJlY3QueCwgbmV3T2JqZWN0c1tqXS5hcmVhUmVjdC55LCBuZXdPYmplY3RzW2pdLmFyZWFSZWN0LndpZHRoLCBuZXdPYmplY3RzW2pdLmFyZWFSZWN0LmhlaWdodCk7XHJcblx0XHRcdHRoaXMuYWRkT2JqZWN0VG9MYXllcihuZXdPYmplY3RzW2pdLm9iaiwgdGhpcy5fbG9vcGluZ1Jhbmdlc1tpXS5sYXllciwgbmV3T2JqZWN0c1tqXS5vZmZzZXQueCwgbmV3T2JqZWN0c1tqXS5vZmZzZXQueSk7XHJcblx0XHR9XHRcclxuXHR9XHRcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0geyFTdHJpbmd9IG5hbWVcclxuICogQHBhcmFtIHtQb2ludD19IHBhcmFsbGF4XHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9XHJcbiAqL1xyXG5TY3JvbGxlckVuZ2luZS5wcm90b3R5cGUuYWRkTGF5ZXIgPSBmdW5jdGlvbihuYW1lLCBwYXJhbGxheClcclxue1xyXG5cdHBhcmFsbGF4ID0gcGFyYWxsYXggfHwgbmV3IFBJWEkuUG9pbnQoMSwgMSk7XHJcblx0dmFyIGNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG5cdHRoaXMuYWRkQ2hpbGQoY29udGFpbmVyKTtcclxuXHR0aGlzLl9sYXllcnNbbmFtZV0gPSB7Y29udGFpbmVyOmNvbnRhaW5lciwgb2JqZWN0czpbXSwgcGFyYWxsYXg6cGFyYWxsYXh9O1xyXG5cdHRoaXMuX2NhbWVyYS5hZGRMYXllcihuYW1lLCBjb250YWluZXIsIHBhcmFsbGF4KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7IVNjcm9sbGVyT2JqZWN0fSBzY3JvbGxlck9iamVjdFxyXG4gKiBAcGFyYW0geyFTdHJpbmd9IGxheWVyTmFtZVxyXG4gKiBAcGFyYW0ge051bWJlcj19IHhQb3NpdGlvblxyXG4gKiBAcGFyYW0ge051bWJlcj19IHlQb3NpdGlvblxyXG4gKi9cclxuU2Nyb2xsZXJFbmdpbmUucHJvdG90eXBlLmFkZE9iamVjdFRvTGF5ZXIgPSBmdW5jdGlvbihzY3JvbGxlck9iamVjdCwgbGF5ZXJOYW1lLCB4UG9zaXRpb24sIHlQb3NpdGlvbilcclxue1xyXG5cdHRoaXMuX2xheWVyc1tsYXllck5hbWVdLmNvbnRhaW5lci5hZGRDaGlsZChzY3JvbGxlck9iamVjdCk7XHJcblx0aWYoeFBvc2l0aW9uKVxyXG5cdFx0c2Nyb2xsZXJPYmplY3QueCA9IHhQb3NpdGlvbjtcclxuXHRpZih5UG9zaXRpb24pXHJcblx0XHRzY3JvbGxlck9iamVjdC55ID0geVBvc2l0aW9uO1xyXG5cdHRoaXMuX2xheWVyc1tsYXllck5hbWVdLm9iamVjdHMucHVzaChzY3JvbGxlck9iamVjdCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0geyFTY3JvbGxlck9iamVjdH0gc2Nyb2xsZXJPYmplY3RcclxuICogQHBhcmFtIHtTdHJpbmc9fSBsYXllck5hbWVcclxuICovXHJcblNjcm9sbGVyRW5naW5lLnByb3RvdHlwZS5yZW1vdmVPYmplY3RGcm9tTGF5ZXIgPSBmdW5jdGlvbihzY3JvbGxlck9iamVjdCwgbGF5ZXJOYW1lKVxyXG57XHJcblx0dmFyIHBsYWNlSW5BcnJheTtcclxuXHJcblx0aWYobGF5ZXJOYW1lID09IG51bGwpXHJcblx0e1xyXG5cdFx0Zm9yKHZhciBpIGluIHRoaXMuX2xheWVycylcclxuXHRcdHtcclxuXHRcdFx0cGxhY2VJbkFycmF5ID0gdGhpcy5fbGF5ZXJzW2ldLm9iamVjdHMuaW5kZXhPZihzY3JvbGxlck9iamVjdCk7XHJcblx0XHRcdGxheWVyTmFtZSA9IGk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dGhpcy5fbGF5ZXJzW2xheWVyTmFtZV0uY29udGFpbmVyLnJlbW92ZUNoaWxkKHNjcm9sbGVyT2JqZWN0KTtcclxuXHRcclxuXHRpZihwbGFjZUluQXJyYXkgPT0gbnVsbClcclxuXHRcdHBsYWNlSW5BcnJheSA9IHRoaXMuX2xheWVyc1tsYXllck5hbWVdLm9iamVjdHMuaW5kZXhPZihzY3JvbGxlck9iamVjdCk7XHJcblxyXG5cdGlmKHBsYWNlSW5BcnJheSA+IC0xKVxyXG5cdFx0dGhpcy5fbGF5ZXJzW2xheWVyTmFtZV0ub2JqZWN0cy5zcGxpY2UocGxhY2VJbkFycmF5LCAxKTtcclxuXHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMuX2xvb3BpbmdSYW5nZXMubGVuZ3RoOyBpKyspXHJcblx0e1xyXG5cdFx0aWYobGF5ZXJOYW1lID09IHRoaXMuX2xvb3BpbmdSYW5nZXNbaV0ubGF5ZXIpXHJcblx0XHR7XHJcblx0XHRcdHRoaXMuX2xvb3BpbmdSYW5nZXNbaV0ub2JqZWN0UmVtb3ZlZChzY3JvbGxlck9iamVjdCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVx0XHJcblx0fVxyXG5cclxuXHRzY3JvbGxlck9iamVjdC5kaXNwb3NlKCk7XHRcclxufVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7U2Nyb2xsZXJMb29waW5nUmFuZ2V9IGxvb3BcclxuICogQHBhcmFtIHtTdHJpbmd9IGxheWVyTmFtZVxyXG4gKiBAcGFyYW0ge051bWJlcn0gb3JpZ2luWFxyXG4gKiBAcGFyYW0ge051bWJlcn0gb3JpZ2luWVxyXG4gKi9cclxuU2Nyb2xsZXJFbmdpbmUucHJvdG90eXBlLmFkZExvb3BpbmdSYW5nZVRvTGF5ZXIgPSBmdW5jdGlvbihsb29wLCBsYXllck5hbWUsIG9yaWdpblgsIG9yaWdpblkpXHJcbntcclxuXHRsb29wLmxheWVyID0gbGF5ZXJOYW1lO1xyXG5cdHZhciBhcnIgPSBsb29wLmdlbmVyYXRlKHRoaXMuX3ZpZXdCb3VuZGFyeS53aWR0aCwgdGhpcy5fdmlld0JvdW5kYXJ5LmhlaWdodCwgb3JpZ2luWCwgb3JpZ2luWSk7XHJcblx0dGhpcy5fbG9vcGluZ1Jhbmdlcy5wdXNoKGxvb3ApO1xyXG5cclxuXHR2YXIgZCA9ICd4JztcclxuXHR2YXIgZSA9ICd3aWR0aCc7XHJcblx0dmFyIGN1cnJlbnRYID0gdGhpcy5fdmlld0JvdW5kYXJ5LnggKiB0aGlzLl9sYXllcnNbbGF5ZXJOYW1lXS5wYXJhbGxheC54O1xyXG5cdHZhciBjdXJyZW50WSA9IG9yaWdpblk7XHJcblx0XHJcblx0aWYobG9vcC5zY3JvbGxZKVxyXG5cdHtcclxuXHRcdGQgPSAneSc7XHJcblx0XHRlID0gJ2hlaWdodCc7XHJcblx0XHRjdXJyZW50WCA9IG9yaWdpblg7XHJcblx0XHRjdXJyZW50WSA9IHRoaXMuX2FjdGl2ZUJvdW5kYXJ5LnkgKiB0aGlzLl9sYXllcnNbbGF5ZXJOYW1lXS5wYXJhbGxheC55O1xyXG5cdH0gXHJcblxyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspXHJcblx0e1xyXG5cdFx0YXJyW2ldLm9iai5hcmVhUmVjdCA9IGFycltpXS5hcmVhUmVjdDtcclxuXHRcdHRoaXMuYWRkT2JqZWN0VG9MYXllcihhcnJbaV0ub2JqLCBsYXllck5hbWUsIGN1cnJlbnRYICsgKGxvb3Auc2Nyb2xsWSA/IGFycltpXS5vZmZzZXQueCA6IDApLCBjdXJyZW50WSArIChsb29wLnNjcm9sbFggPyBhcnJbaV0ub2Zmc2V0LnkgOiAwKSk7XHJcblxyXG5cdFx0aWYobG9vcC5zY3JvbGxYKVxyXG5cdFx0XHRjdXJyZW50WCArPSBhcnJbaV0uYXJlYVJlY3QueCArIGFycltpXS5hcmVhUmVjdC53aWR0aCArIGFycltpXS5vZmZzZXQueDtcclxuXHRcdGVsc2UgaWYobG9vcC5zY3JvbGxZKVxyXG5cdFx0XHRjdXJyZW50WSArPSBhcnJbaV0uYXJlYVJlY3QueSArIGFycltpXS5hcmVhUmVjdC5oZWlnaHQgKyBhcnJbaV0ub2Zmc2V0Lnk7XHJcblx0fVx0XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0geyFTdHJpbmd9IG9iamVjdDFUeXBlXHJcbiAqIEBwYXJhbSB7IVN0cmluZ30gb2JqZWN0MlR5cGVcclxuICovXHJcblNjcm9sbGVyRW5naW5lLnByb3RvdHlwZS5hZGRDb2xsaXNpb25EZXRlY3RvciA9IGZ1bmN0aW9uKG9iamVjdDFUeXBlLCBvYmplY3QyVHlwZSlcclxue1xyXG5cdHRoaXMuX2NvbGxpc2lvbnMucHVzaChbb2JqZWN0MVR5cGUsIG9iamVjdDJUeXBlXSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKi9cclxuU2Nyb2xsZXJFbmdpbmUucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24oKVxyXG57XHJcblx0Zm9yKHZhciBpIGluIHRoaXMuX2xheWVycylcclxuXHR7XHJcblx0XHRmb3IodmFyIGogPSAwOyBqIDwgdGhpcy5fbGF5ZXJzW2ldLm9iamVjdHMubGVuZ3RoOyBqKyspXHJcblx0XHR7XHJcblx0XHRcdHZhciBvYmogPSB0aGlzLl9sYXllcnNbaV0ub2JqZWN0c1tqXTtcclxuXHJcblx0XHRcdG9iai5wYXVzZSgpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuLyoqXHJcbiAqL1xyXG5TY3JvbGxlckVuZ2luZS5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24oKVxyXG57XHJcblx0Zm9yKHZhciBpIGluIHRoaXMuX2xheWVycylcclxuXHR7XHJcblx0XHRmb3IodmFyIGogPSAwOyBqIDwgdGhpcy5fbGF5ZXJzW2ldLm9iamVjdHMubGVuZ3RoOyBqKyspXHJcblx0XHR7XHJcblx0XHRcdHZhciBvYmogPSB0aGlzLl9sYXllcnNbaV0ub2JqZWN0c1tqXTtcclxuXHJcblx0XHRcdG9iai5yZXN1bWUoKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gbGF5ZXJOYW1lXHJcbiAqL1xyXG5TY3JvbGxlckVuZ2luZS5wcm90b3R5cGUuZ2V0TGF5ZXJDb250YWluZXIgPSBmdW5jdGlvbihsYXllck5hbWUpXHJcbntcclxuXHRyZXR1cm4gdGhpcy5fbGF5ZXJzW2xheWVyTmFtZV0uY29udGFpbmVyO1xyXG59XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtTdHJpbmd9IGxheWVyTmFtZVxyXG4gKi9cclxuU2Nyb2xsZXJFbmdpbmUucHJvdG90eXBlLmdldExheWVyUGFyYWxsYXggPSBmdW5jdGlvbihsYXllck5hbWUpXHJcbntcclxuXHRyZXR1cm4gdGhpcy5fbGF5ZXJzW2xheWVyTmFtZV0ucGFyYWxsYXg7XHJcbn1cclxuXHJcblNjcm9sbGVyRW5naW5lLnByb3RvdHlwZS5nZXRBbGxPYmplY3RzT2ZUeXBlID0gZnVuY3Rpb24odHlwZSlcclxueyAgIFxyXG4gICAgdmFyIHJldCA9IFtdO1xyXG5cclxuICAgIGZvcih2YXIgaSBpbiB0aGlzLl9sYXllcnMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGNvbnQgPSB0aGlzLl9sYXllcnNbaV0uY29udGFpbmVyO1xyXG5cclxuICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgdGhpcy5fbGF5ZXJzW2ldLm9iamVjdHMubGVuZ3RoOyBqKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLl9sYXllcnNbaV0ub2JqZWN0c1tqXS50eXBlID09IHR5cGUpXHJcbiAgICAgICAgICAgICAgICByZXQucHVzaCh0aGlzLl9sYXllcnNbaV0ub2JqZWN0c1tqXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldDtcclxufVxyXG5cclxuU2Nyb2xsZXJFbmdpbmUucHJvdG90eXBlLmdldE9iamVjdFBvc2l0aW9uT25TY3JlZW4gPSBmdW5jdGlvbihvYmopXHJcbntcclxuICAgIHZhciByZXQgPSBuZXcgUElYSS5Qb2ludCh0aGlzLnggKyBvYmoucGFyZW50LnggKyBvYmoueCwgdGhpcy55ICsgb2JqLnBhcmVudC55ICsgb2JqLnkpO1xyXG4gICAgcmV0dXJuIHJldDtcclxufVxyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFBSSVZBVEUgTUVUSE9EU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7IVNjcm9sbGVyT2JqZWN0fSBvYmpcclxuICogQHBhcmFtIHshUElYSS5Db250YWluZXJ9IG9iakNvbnRcclxuICogQHBhcmFtIHshU3RyaW5nfSBjb2xsaWRpbmdUeXBlXHJcbiAqL1xyXG5TY3JvbGxlckVuZ2luZS5wcm90b3R5cGUuX2NoZWNrRm9yQ29sbGlzaW9ucyA9IGZ1bmN0aW9uKG9iajEsIG9iajFDb250LCBjb2xsaWRpbmdUeXBlKVxyXG57XHJcblx0Zm9yKHZhciBpIGluIHRoaXMuX2xheWVycylcclxuXHR7XHJcblx0XHR2YXIgb2JqMkNvbnQgPSB0aGlzLl9sYXllcnNbaV0uY29udGFpbmVyO1xyXG5cclxuXHRcdGZvcih2YXIgaiA9IDA7IGogPCB0aGlzLl9sYXllcnNbaV0ub2JqZWN0cy5sZW5ndGg7IGorKylcclxuXHRcdHtcclxuXHRcdFx0aWYodGhpcy5fbGF5ZXJzW2ldLm9iamVjdHNbal0udHlwZSA9PSBjb2xsaWRpbmdUeXBlKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dmFyIG9iajIgPSB0aGlzLl9sYXllcnNbaV0ub2JqZWN0c1tqXTtcclxuXHJcblx0XHRcdFx0dmFyIHIxTGVmdCA9IG9iajFDb250LnggKyBvYmoxLnggKyBvYmoxLmNvbGxpc2lvblJlY3QueDsgXHJcblx0XHRcdFx0dmFyIHIyTGVmdCA9IG9iajJDb250LnggKyBvYmoyLnggKyBvYmoyLmNvbGxpc2lvblJlY3QueDsgXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIHIxUmlnaHQgPSByMUxlZnQgKyBvYmoxLmNvbGxpc2lvblJlY3Qud2lkdGg7IFxyXG5cdFx0XHRcdHZhciByMlJpZ2h0ID0gcjJMZWZ0ICsgb2JqMi5jb2xsaXNpb25SZWN0LndpZHRoO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciByMVRvcCA9IG9iajFDb250LnkgKyBvYmoxLnkgKyBvYmoxLmNvbGxpc2lvblJlY3QueTsgXHJcblx0XHRcdFx0dmFyIHIyVG9wID0gb2JqMkNvbnQueSArIG9iajIueSArIG9iajIuY29sbGlzaW9uUmVjdC55O1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciByMUJvdHRvbSA9IHIxVG9wICsgb2JqMS5jb2xsaXNpb25SZWN0LmhlaWdodDsgXHJcblx0XHRcdFx0dmFyIHIyQm90dG9tID0gcjJUb3AgKyBvYmoyLmNvbGxpc2lvblJlY3QuaGVpZ2h0O1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBjb2xsaXNpb24gPSB0cnVlO1xyXG5cclxuXHRcdFx0XHRpZiAocjFCb3R0b20gPCByMlRvcCkgY29sbGlzaW9uID0gZmFsc2U7XHJcblx0XHQgICAgICAgIGlmIChyMVRvcCA+IHIyQm90dG9tKSBjb2xsaXNpb24gPSBmYWxzZTtcclxuXHRcdFxyXG5cdFx0ICAgICAgICBpZiAocjFSaWdodCA8IHIyTGVmdCkgY29sbGlzaW9uID0gZmFsc2U7XHJcblx0XHQgICAgICAgIGlmIChyMUxlZnQgPiByMlJpZ2h0KSBjb2xsaXNpb24gPSBmYWxzZTtcclxuXHJcblx0XHQgICAgICAgIGlmKGNvbGxpc2lvbilcclxuXHRcdCAgICAgICAgXHR0aGlzLnNpZ25hbHMuY29sbGlzaW9uRmlyZWQuZGlzcGF0Y2gob2JqMSwgb2JqMik7XHJcblx0XHRcdH1cdFxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEVWRU5UU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEdFVFRFUlMvU0VUVEVSU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFNjcm9sbGVyRW5naW5lLnByb3RvdHlwZSwgXCJ2aWV3WFwiLCB7XHJcblx0LyoqXHJcblx0ICogQHJldHVybnMge051bWJlcn1cclxuXHQgKi9cclxuXHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3ZpZXcueDtcclxuXHR9LFxyXG5cdC8qKlxyXG5cdCAqIEBwYXJhbSB7IU51bWJlcn0gdmFsdWVcclxuXHQgKi9cclxuXHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR0aGlzLl92aWV3LnggPSB2YWx1ZTtcclxuXHRcdHRoaXMuX2NhbWVyYS51cGRhdGUoKTtcclxuXHRcdHJldHVybiB0aGlzLl92aWV3Lng7XHJcblx0fVxyXG59KTtcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShTY3JvbGxlckVuZ2luZS5wcm90b3R5cGUsIFwidmlld1lcIiwge1xyXG5cdC8qKlxyXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcblx0ICovXHJcblx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLl92aWV3Lnk7XHJcblx0fSxcclxuXHQvKipcclxuXHQgKiBAcGFyYW0geyFOdW1iZXJ9IHZhbHVlXHJcblx0ICovXHJcblx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dGhpcy5fdmlldy55ID0gdmFsdWU7XHJcblx0XHR0aGlzLl9jYW1lcmEudXBkYXRlKCk7XHJcblx0XHRyZXR1cm4gdGhpcy5fdmlldy55O1xyXG5cdH1cclxufSk7XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoU2Nyb2xsZXJFbmdpbmUucHJvdG90eXBlLCBcImFjdGl2ZUJvdW5kYXJ5XCIsIHtcclxuXHJcblx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9hY3RpdmVCb3VuZGFyeTtcclxuXHR9LFxyXG5cclxuXHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR0aGlzLl9hY3RpdmVCb3VuZGFyeSA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXMuX2FjdGl2ZUJvdW5kYXJ5O1xyXG5cdH1cclxufSk7XHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoU2Nyb2xsZXJFbmdpbmUucHJvdG90eXBlLCBcInZpZXdCb3VuZGFyeVwiLCB7XHJcblxyXG5cdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fdmlld0JvdW5kYXJ5O1xyXG5cdH0sXHJcblxyXG5cdHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHRoaXMuX3ZpZXdCb3VuZGFyeSA9IHZhbHVlO1xyXG5cdFx0cmV0dXJuIHRoaXMuX3ZpZXdCb3VuZGFyeTtcclxuXHR9XHJcbn0pO1xyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFNjcm9sbGVyRW5naW5lLnByb3RvdHlwZSwgXCJzY3JlZW5Gb2N1c1BvaW50XCIsIHtcclxuXHQvKipcclxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfVxyXG5cdCAqL1xyXG5cdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fc2NyZWVuRm9jdXNQb2ludDtcclxuXHR9LFxyXG5cdC8qKlxyXG5cdCAqIEBwYXJhbSB7IU51bWJlcn0gdmFsdWVcclxuXHQgKi9cclxuXHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR0aGlzLl9zY3JlZW5Gb2N1c1BvaW50ID0gdmFsdWU7XHJcblx0XHRyZXR1cm4gdGhpcy5fc2NyZWVuRm9jdXNQb2ludDtcclxuXHR9XHJcbn0pO1xyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4iLCJ2YXIgQ29tbW9uICAgICAgICAgID0gcmVxdWlyZShcIi4uL0NvbW1vblwiKTtcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIENPTlNUUlVDVE9SXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSB7IUFycmF5PE9iamVjdD59IG9iamVjdHMgLSB7YmFzZTo8U2Nyb2xsZXJPYmplY3Q+LCBhcmdzOjxBcnJheT4sIGFyZWFSZWN0OlBJWEkuUmVjdGFuZ2xlLCBvZmZzZXQ6UElYSS5Qb2ludH1cclxuICogQHBhcmFtIHtCb29sZWFufSBzY3JvbGxYXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gc2Nyb2xsWVxyXG4gKi9cclxuZnVuY3Rpb24gU2Nyb2xsZXJMb29waW5nUmFuZ2Uob2JqZWN0cywgc2Nyb2xsWCwgc2Nyb2xsWSlcclxue1xyXG5cdHRoaXMuc2lnbmFscyA9IHt9O1xyXG5cdHRoaXMuc2lnbmFscy5vYmplY3RHZW5lcmF0ZWQgPSBuZXcgc2lnbmFscy5TaWduYWwoKTtcclxuXHJcblx0LyoqXHJcbiAgICAgKiBAdHlwZSB7QXJyYXk8T2JqZWN0Pn1cclxuICAgICAqL1xyXG5cdHRoaXMuX29iamVjdHNEYXRhID0gb2JqZWN0cztcclxuXHJcblx0LyoqXHJcbiAgICAgKiBAdHlwZSB7QXJyYXk8U2Nyb2xsZXJPYmplY3Q+fVxyXG4gICAgICovXHJcblx0dGhpcy5fb2JqZWN0cyA9IG51bGw7XHJcblxyXG5cdC8qKlxyXG4gICAgICogQHR5cGUge0FycmF5PHAzLk9iamVjdFBvb2w+fVxyXG4gICAgICovXHJcblx0dGhpcy5fb2JqZWN0UG9vbHMgPSBudWxsO1xyXG5cclxuXHQvKipcclxuICAgICAqIEB0eXBlIHtPYmplY3R9XHJcbiAgICAgKi9cclxuXHR0aGlzLl9vYmplY3RzUGxhY2VkID0gLTE7XHJcblxyXG5cdC8qKlxyXG4gICAgICogQHR5cGUge0Jvb2xlYW59XHJcbiAgICAgKi9cclxuXHR0aGlzLl9vcmlnaW5YID0gMDtcclxuXHJcblx0LyoqXHJcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cclxuICAgICAqL1xyXG5cdHRoaXMuX29yaWdpblkgPSAwO1xyXG5cclxuXHQvKipcclxuICAgICAqIEB0eXBlIHtCb29sZWFufVxyXG4gICAgICovXHJcblx0dGhpcy5fc2Nyb2xsWCA9IHNjcm9sbFg7XHJcblxyXG5cdC8qKlxyXG4gICAgICogQHR5cGUge0Jvb2xlYW59XHJcbiAgICAgKi9cclxuXHR0aGlzLl9zY3JvbGxZID0gc2Nyb2xsWTtcclxuXHJcblx0LyoqXHJcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxyXG4gICAgICovXHJcblx0dGhpcy5sYXllciA9IG51bGw7XHJcblxyXG5cdHRoaXMuaW5pdCgpO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsZXJMb29waW5nUmFuZ2U7XHJcblNjcm9sbGVyTG9vcGluZ1JhbmdlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUElYSS5Db250YWluZXIucHJvdG90eXBlKTtcclxuU2Nyb2xsZXJMb29waW5nUmFuZ2UucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2Nyb2xsZXJMb29waW5nUmFuZ2U7XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUFVCTElDIE1FVEhPRFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKi9cclxuU2Nyb2xsZXJMb29waW5nUmFuZ2UucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpXHJcbntcclxuXHR0aGlzLl9vYmplY3RQb29scyA9IFtdO1xyXG5cdHRoaXMuX29iamVjdHMgPSBbXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKi9cclxuU2Nyb2xsZXJMb29waW5nUmFuZ2UucHJvdG90eXBlLmdlbmVyYXRlID0gZnVuY3Rpb24odmlld1dpZHRoLCB2aWV3SGVpZ2h0LCBvcmlnaW5YLCBvcmlnaW5ZKVxyXG57XHJcblx0aWYodGhpcy5zY3JvbGxZKVxyXG5cdFx0dGhpcy5fb3JpZ2luWCA9IG9yaWdpblg7XHJcblxyXG5cdGlmKHRoaXMuc2Nyb2xsWClcclxuXHRcdHRoaXMuX29yaWdpblkgPSBvcmlnaW5ZO1xyXG5cclxuXHR2YXIgZCA9ICd4JztcclxuXHR2YXIgZSA9ICd3aWR0aCc7XHJcblx0dmFyIG0gPSB2aWV3V2lkdGg7XHJcblx0aWYodGhpcy5fc2Nyb2xsWSlcclxuXHR7XHJcblx0XHRkID0gJ3knO1xyXG5cdFx0ZSA9ICdoZWlnaHQnO1xyXG5cdFx0bSA9IHZpZXdIZWlnaHQ7XHJcblx0fVx0XHJcblxyXG5cdHZhciB0b3RhbCA9IDA7XHJcblx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMuX29iamVjdHNEYXRhLmxlbmd0aDsgaSsrKVxyXG5cdHtcclxuXHRcdHRvdGFsICs9IHRoaXMuX29iamVjdHNEYXRhW2ldLmFyZWFSZWN0W2RdICsgdGhpcy5fb2JqZWN0c0RhdGFbaV0uYXJlYVJlY3RbZV0gKyB0aGlzLl9vYmplY3RzRGF0YVtpXS5vZmZzZXRbZF07XHJcblx0fVxyXG5cclxuXHR2YXIgb2JqZWN0QW1vdW50cyA9IFtdO1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBNYXRoLmNlaWwodmlld1dpZHRoIC8gdG90YWwpOyBpKyspXHJcblx0e1x0XHJcblx0XHRmb3IodmFyIGogPSAwOyBqIDwgdGhpcy5fb2JqZWN0c0RhdGEubGVuZ3RoOyBqKyspXHJcblx0XHR7XHJcblx0XHRcdGlmKG9iamVjdEFtb3VudHNbal0gPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdG9iamVjdEFtb3VudHNbal0gPSAwO1xyXG5cdFx0XHRvYmplY3RBbW91bnRzW2pdKys7XHRcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLl9vYmplY3RzRGF0YS5sZW5ndGg7IGkrKylcclxuXHR7XHJcblx0XHR0aGlzLl9vYmplY3RQb29sc1tpXSA9IG5ldyBwMy5PYmplY3RQb29sKHRoaXMuX29iamVjdHNEYXRhW2ldLmJhc2UsIG9iamVjdEFtb3VudHNbaV0sIHRoaXMuX29iamVjdHNEYXRhW2ldLmFyZ3MpO1xyXG5cdH1cclxuXHJcblx0dmFyIHJldHVybkFycmF5ID0gW107XHJcblxyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBNYXRoLmNlaWwodmlld1dpZHRoL3RvdGFsKTsgaSsrKVxyXG5cdHtcdFxyXG5cdFx0Zm9yKHZhciBqID0gMDsgaiA8IHRoaXMuX29iamVjdHNEYXRhLmxlbmd0aDsgaisrKVxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgb2JqID0gdGhpcy5fb2JqZWN0UG9vbHNbal0uY3JlYXRlKCk7XHJcblxyXG5cdFx0XHRpZihvYmogPT0gbnVsbClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRoaXMuX29iamVjdFBvb2xzW2pdLmV4cGFuZCgyKTtcclxuXHRcdFx0XHRvYmogPSB0aGlzLl9vYmplY3RQb29sc1tqXS5jcmVhdGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLl9vYmplY3RzLnB1c2gob2JqKTtcclxuXHJcblx0XHRcdHJldHVybkFycmF5LnB1c2goe29iajpvYmosIGFyZWFSZWN0OnRoaXMuX29iamVjdHNEYXRhW2pdLmFyZWFSZWN0LCBvZmZzZXQ6dGhpcy5fb2JqZWN0c0RhdGFbal0ub2Zmc2V0fSk7XHJcblx0XHRcdHRoaXMuX29iamVjdHNQbGFjZWQrKztcclxuXHRcdFx0b2JqLmxvb3BpbmdSYW5nZU51bWJlciA9IHRoaXMuX29iamVjdHNQbGFjZWQ7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnNpZ25hbHMub2JqZWN0R2VuZXJhdGVkLmRpc3BhdGNoKG9iaik7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiByZXR1cm5BcnJheTtcclxufVxyXG5cclxuLyoqXHJcbiAqL1xyXG5TY3JvbGxlckxvb3BpbmdSYW5nZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oZm9jdXNQb2ludCwgdmlld0JvdW5kYXJ5LCBsYXllckNvbnRhaW5lcilcclxue1xyXG5cdC8vdmFyIHByZXZpb3VzT2JqZWN0TnVtYmVyID0gTWF0aC5hYnMoKHRoaXMuX29iamVjdHNbMF0ubG9vcGluZ1JhbmdlTnVtYmVyLTEpICUgdGhpcy5fb2JqZWN0c0RhdGEubGVuZ3RoKTtcclxuXHR2YXIgbmV4dE9iamVjdE51bWJlciA9ICh0aGlzLl9vYmplY3RzUGxhY2VkKzEpICUgdGhpcy5fb2JqZWN0c0RhdGEubGVuZ3RoO1xyXG5cdC8vdmFyIHByZXZpb3VzT2JqZWN0RGF0YSA9IHRoaXMuX29iamVjdHNEYXRhW3ByZXZpb3VzT2JqZWN0TnVtYmVyXTtcclxuXHR2YXIgbmV4dE9iamVjdERhdGEgPSB0aGlzLl9vYmplY3RzRGF0YVtuZXh0T2JqZWN0TnVtYmVyXTtcclxuXHJcblx0Ly92YXIgZmlyc3RPYmplY3QgPSB0aGlzLl9vYmplY3RzWzBdO1xyXG5cdHZhciBsYXN0T2JqZWN0ID0gdGhpcy5fb2JqZWN0c1t0aGlzLl9vYmplY3RzLmxlbmd0aC0xXTtcclxuXHJcblx0dmFyIGQgPSAneCc7XHJcblx0dmFyIGUgPSAnd2lkdGgnO1xyXG5cdHZhciBvID0gJ3knO1xyXG5cclxuXHRpZih0aGlzLl9zY3JvbGxZKVxyXG5cdHtcclxuXHRcdGQgPSAneSc7XHJcblx0XHRlID0gJ2hlaWdodCc7XHJcblx0XHRvID0gJ3gnO1xyXG5cdH1cclxuXHJcblx0dmFyIHJldHVybkFycmF5ID0gW107XHJcblxyXG5cdC8qXHJcblx0aWYobGF5ZXJDb250YWluZXJbZF0gKyBmaXJzdE9iamVjdFtkXSArIGZpcnN0T2JqZWN0LmFyZWFSZWN0W2RdICsgcHJldmlvdXNPYmplY3REYXRhLm9mZnNldFtkXSBcclxuXHRcdD4gZm9jdXNQb2ludFtkXSArIHZpZXdCb3VuZGFyeVtkXSlcclxuXHR7XHJcblx0XHR2YXIgb2JqID0gdGhpcy5fb2JqZWN0UG9vbHNbcHJldmlvdXNPYmplY3ROdW1iZXJdLmNyZWF0ZSgpO1xyXG5cclxuXHRcdGlmKG9iaiA9PSBudWxsKVxyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLl9vYmplY3RQb29sc1tqXS5leHBhbmQoMik7XHJcblx0XHRcdG9iaiA9IHRoaXMuX29iamVjdFBvb2xzW2pdLmNyZWF0ZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBvZmZzZXQgPSBuZXcgUElYSS5Qb2ludCgpO1xyXG5cdFx0b2Zmc2V0W2RdID0gZmlyc3RPYmplY3RbZF0gLSAocHJldmlvdXNPYmplY3REYXRhLmFyZWFSZWN0W2VdICsgcHJldmlvdXNPYmplY3REYXRhLmFyZWFSZWN0W2RdKSArIHByZXZpb3VzT2JqZWN0RGF0YS5vZmZzZXRbZF07XHJcblx0XHRvZmZzZXRbb10gPSBwcmV2aW91c09iamVjdERhdGFbb107XHJcblx0XHRcclxuXHRcdHJldHVybkFycmF5LnB1c2goe29iajpvYmosIGFyZWFSZWN0OnByZXZpb3VzT2JqZWN0RGF0YS5hcmVhUmVjdCwgb2Zmc2V0Om9mZnNldH0pO1xyXG5cdFx0b2JqLmxvb3BpbmdSYW5nZU51bWJlciA9IHRoaXMuX29iamVjdHNbMF0ubG9vcGluZ1JhbmdlTnVtYmVyLTE7XHJcblxyXG5cdFx0dGhpcy5fb2JqZWN0cy5zcGxpY2UoMCwgMCwgb2JqKTtcclxuXHR9Ki9cclxuXHJcblx0dmFyIG5ld1BsYWNlbWVudCA9IGxhc3RPYmplY3RbZF0gKyBsYXN0T2JqZWN0LmFyZWFSZWN0W2RdICsgbGFzdE9iamVjdC5hcmVhUmVjdFtlXSArIG5leHRPYmplY3REYXRhLm9mZnNldFtkXTsgLy8rIE1hdGguYWJzKG5leHRPYmplY3REYXRhLmFyZWFSZWN0W2RdKSArIG5leHRPYmplY3REYXRhLm9mZnNldFtkXTtcclxuXHJcblx0aWYobGF5ZXJDb250YWluZXJbZF0gKyBuZXdQbGFjZW1lbnRcclxuXHRcdDwgZm9jdXNQb2ludFtkXSArIHZpZXdCb3VuZGFyeVtkXSArIHZpZXdCb3VuZGFyeVtlXSlcclxuXHR7XHJcblx0XHR2YXIgb2JqID0gdGhpcy5fb2JqZWN0UG9vbHNbbmV4dE9iamVjdE51bWJlcl0uY3JlYXRlKCk7XHJcblxyXG5cdFx0aWYob2JqID09IG51bGwpXHJcblx0XHR7XHJcblx0XHRcdHRoaXMuX29iamVjdFBvb2xzW25leHRPYmplY3ROdW1iZXJdLmV4cGFuZCgyKTtcclxuXHRcdFx0b2JqID0gdGhpcy5fb2JqZWN0UG9vbHNbbmV4dE9iamVjdE51bWJlcl0uY3JlYXRlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG9mZnNldCA9IG5ldyBQSVhJLlBvaW50KCk7XHJcblx0XHRvZmZzZXRbZF0gPSBuZXdQbGFjZW1lbnQ7XHJcblx0XHRvZmZzZXRbb10gPSBuZXh0T2JqZWN0RGF0YS5vZmZzZXRbb10gKyB0aGlzWydfb3JpZ2luJyArIFtvLnRvVXBwZXJDYXNlKCldXTtcclxuXHJcblx0XHRyZXR1cm5BcnJheS5wdXNoKHtvYmo6b2JqLCBhcmVhUmVjdDpuZXh0T2JqZWN0RGF0YS5hcmVhUmVjdCwgb2Zmc2V0Om9mZnNldH0pO1xyXG5cdFx0dGhpcy5fb2JqZWN0c1BsYWNlZCsrO1xyXG5cdFx0b2JqLmxvb3BpbmdSYW5nZU51bWJlciA9IHRoaXMuX29iamVjdHNQbGFjZWQ7XHJcblxyXG5cdFx0dGhpcy5fb2JqZWN0cy5wdXNoKG9iaik7XHJcblx0XHR0aGlzLnNpZ25hbHMub2JqZWN0R2VuZXJhdGVkLmRpc3BhdGNoKG9iaik7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gcmV0dXJuQXJyYXk7XHJcblx0XHRcdFx0ICAgXHJcbn07XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUFJJVkFURSBNRVRIT0RTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gRVZFTlRTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICovXHJcblNjcm9sbGVyTG9vcGluZ1JhbmdlLnByb3RvdHlwZS5vYmplY3RSZW1vdmVkID0gZnVuY3Rpb24ob2JqKVxyXG57XHJcblx0dmFyIGluZGV4ID0gdGhpcy5fb2JqZWN0cy5pbmRleE9mKG9iaik7XHJcblx0aWYoaW5kZXggPj0gMClcclxuXHR7XHJcblx0XHR0aGlzLl9vYmplY3RQb29sc1tvYmoubG9vcGluZ1JhbmdlTnVtYmVyICUgdGhpcy5fb2JqZWN0c0RhdGEubGVuZ3RoXS5mcmVlKG9iaik7XHRcclxuXHRcdHRoaXMuX29iamVjdHMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHR9XHJcbn07XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBHRVRURVJTL1NFVFRFUlNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShTY3JvbGxlckxvb3BpbmdSYW5nZS5wcm90b3R5cGUsIFwic2Nyb2xsWFwiLCB7XHJcblxyXG5cdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fc2Nyb2xsWDtcclxuXHR9XHJcbn0pO1xyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4iLCJ2YXIgQ29tbW9uICAgICAgICAgID0gcmVxdWlyZShcIi4uL0NvbW1vblwiKTtcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIENPTlNUUlVDVE9SXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSB7UElYSS5UZXh0dXJlfSB0ZXh0dXJlXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVtb3ZlSWZPdXRzaWRlQm91bmRhcnlcclxuICovXHJcbmZ1bmN0aW9uIFNjcm9sbGVyT2JqZWN0KHR5cGUsIHJlbW92ZUlmT3V0c2lkZUJvdW5kYXJ5KVxyXG57XHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHtwMy5Bc3NldE1hbmFnZXJ9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuX2Fzc2V0TWFuYWdlciA9IHAzLkFzc2V0TWFuYWdlci5pbnN0YW5jZTtcclxuXHJcblx0LyoqXHJcbiAgICAgKiBAdHlwZSB7c2lnbmFscy5TaWduYWx9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuc2lnbmFscyA9IHt9O1xyXG4gICAgdGhpcy5zaWduYWxzLmRpc3Bvc2VkID0gbmV3IHNpZ25hbHMuU2lnbmFsKCk7XHJcblxyXG5cdC8qKlxyXG4gICAgICogQHR5cGUge1N0cmluZ31cclxuICAgICAqL1xyXG5cdHRoaXMuX3R5cGUgPSB0eXBlO1xyXG5cclxuXHQvKipcclxuICAgICAqIEB0eXBlIHtQSVhJLlJlY3RhbmdsZX1cclxuICAgICAqL1xyXG5cdHRoaXMuY29sbGlzaW9uUmVjdCA9IG51bGw7XHJcblxyXG5cdC8qKlxyXG4gICAgICogQHR5cGUge1BJWEkuUmVjdGFuZ2xlfVxyXG4gICAgICovXHJcblx0dGhpcy5hcmVhUmVjdCA9IG51bGw7XHJcblxyXG5cdC8qKlxyXG4gICAgICogQHR5cGUge051bWJlcn1cclxuICAgICAqL1xyXG5cdHRoaXMubG9vcGluZ1JhbmdlTnVtYmVyID0gbnVsbDtcclxuXHJcblx0LyoqXHJcbiAgICAgKiBAdHlwZSB7UElYSS5SZWN0YW5nbGV9XHJcbiAgICAgKi9cclxuXHR0aGlzLnJlbW92ZUlmT3V0c2lkZUJvdW5kYXJ5ID0gcmVtb3ZlSWZPdXRzaWRlQm91bmRhcnkgPT0gbnVsbCA/IHRydWUgOiByZW1vdmVJZk91dHNpZGVCb3VuZGFyeTtcclxuXHJcblx0LyoqXHJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICovXHJcbiAgICB0aGlzLnhTcGVlZCA9IDA7XHJcblxyXG5cdC8qKlxyXG4gICAgICogQHR5cGUge051bWJlcn1cclxuICAgICAqL1xyXG4gICAgdGhpcy55U3BlZWQgPSAwO1xyXG5cclxuXHQvKipcclxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XHJcbiAgICAgKi9cclxuXHR0aGlzLnBlcnNpc3RlbnRYID0gbnVsbDtcclxuXHJcblx0LyoqXHJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICovXHJcblx0dGhpcy5wZXJzaXN0ZW50WSA9IG51bGw7XHJcblxyXG5cdC8qKlxyXG4gICAgICogQHR5cGUge051bWJlcn1cclxuICAgICAqL1xyXG5cdHRoaXMucGVyc2lzdGVudFJlY3RhbmdsZSA9IG51bGw7XHJcblxyXG5cdC8qKlxyXG4gICAgICogQHR5cGUge051bWJlcn1cclxuICAgICAqL1xyXG5cdHRoaXMucGVyc2lzdGVudFJlY3RhbmdsZUV4aXRFYXNlID0gMTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHtCb2xsZWFufVxyXG4gICAgICovXHJcbiAgICB0aGlzLnJlbW92ZU1lID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7UElYSS5HcmFwaGljc31cclxuICAgICAqL1xyXG4gICAgdGhpcy5fY29sbGlzaW9uUmVjdEdyYXBoaWMgPSBudWxsO1xyXG5cclxuXHRQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsZXJPYmplY3Q7XHJcblNjcm9sbGVyT2JqZWN0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUElYSS5Db250YWluZXIucHJvdG90eXBlKTtcclxuU2Nyb2xsZXJPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2Nyb2xsZXJPYmplY3Q7XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUFVCTElDIE1FVEhPRFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKi9cclxuU2Nyb2xsZXJPYmplY3QucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpXHJcbntcclxuXHJcbn07XHJcblxyXG4vKipcclxuICovXHJcblNjcm9sbGVyT2JqZWN0LnByb3RvdHlwZS50ZW1wbGF0ZSA9IGZ1bmN0aW9uKClcclxue1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKi9cclxuU2Nyb2xsZXJPYmplY3QucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgXHJcbn07XHJcblxyXG4vKipcclxuICovXHJcblNjcm9sbGVyT2JqZWN0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIHRoaXMueCArPSB0aGlzLnhTcGVlZDtcclxuICAgIHRoaXMueSArPSB0aGlzLnlTcGVlZDtcclxufTtcclxuXHJcbi8qKlxyXG4gKi9cclxuU2Nyb2xsZXJPYmplY3QucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oKVxyXG57XHJcblx0dGhpcy54ID0gMDtcclxuXHR0aGlzLnkgPSAwO1xyXG4gICAgdGhpcy5yZW1vdmVNZSA9IGZhbHNlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5TY3JvbGxlck9iamVjdC5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKClcclxue1xyXG5cdHRoaXMuc2lnbmFscy5kaXNwb3NlZC5kaXNwYXRjaCh0aGlzKTtcclxufVxyXG5cclxuLyoqXHJcbiAqL1xyXG5TY3JvbGxlck9iamVjdC5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIFxyXG59XHJcblxyXG4vKipcclxuICovXHJcblNjcm9sbGVyT2JqZWN0LnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbigpXHJcbntcclxuICAgIFxyXG59XHJcblxyXG4vKipcclxuICovXHJcblNjcm9sbGVyT2JqZWN0LnByb3RvdHlwZS5kcmF3Q29sbGlzaW9uUmVjdCA9IGZ1bmN0aW9uKClcclxue1xyXG4gICAgaWYodGhpcy5fY29sbGlzaW9uUmVjdEdyYXBoaWMgPT0gbnVsbClcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9jb2xsaXNpb25SZWN0R3JhcGhpYyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmFkZENoaWxkKHRoaXMuX2NvbGxpc2lvblJlY3RHcmFwaGljKTtcclxuICAgIHRoaXMuX2NvbGxpc2lvblJlY3RHcmFwaGljLmNsZWFyKCk7XHJcbiAgICB0aGlzLl9jb2xsaXNpb25SZWN0R3JhcGhpYy5saW5lU3R5bGUoMSwgMHhGNzExMUQpO1xyXG4gICAgdGhpcy5fY29sbGlzaW9uUmVjdEdyYXBoaWMuZHJhd1JlY3QodGhpcy5jb2xsaXNpb25SZWN0LngsIHRoaXMuY29sbGlzaW9uUmVjdC55LCB0aGlzLmNvbGxpc2lvblJlY3Qud2lkdGgsIHRoaXMuY29sbGlzaW9uUmVjdC5oZWlnaHQpO1xyXG59XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gUFJJVkFURSBNRVRIT0RTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gRVZFTlRTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICogQHR5cGUgeyFTdHJpbmd9IHNpZGUgKGxlZnQsIHJpZ2h0LCB1cHBlciBvciBsZWZ0KVxyXG4gKi9cclxuU2Nyb2xsZXJPYmplY3QucHJvdG90eXBlLm9uRXhpdFBlcnNpc3RlbnRSZWN0YW5nbGUgPSBmdW5jdGlvbihzaWRlKVxyXG57XHJcblx0XHJcbn07XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBHRVRURVJTL1NFVFRFUlNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShTY3JvbGxlck9iamVjdC5wcm90b3R5cGUsIFwidHlwZVwiLCB7XHJcblxyXG5cdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fdHlwZTtcclxuXHR9XHJcbn0pO1xyXG5cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuIiwidmFyIENvbW1vbiAgICAgICAgICA9IHJlcXVpcmUoXCIuLi9Db21tb25cIik7XHJcbnZhciBTY3JvbGxlck9iamVjdFx0PSByZXF1aXJlKFwiLi9TY3JvbGxlck9iamVjdFwiKTtcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIENPTlNUUlVDVE9SXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSB7IUFycmF5PE9iamVjdD59IGJhc2U6KiwgYXJnczpBcnJheVxyXG4gKiBAcGFyYW0geyFBcnJheTwqPn0gYXJnc1xyXG4gKi9cclxuZnVuY3Rpb24gU2Nyb2xsZXJPYmplY3RHZW5lcmF0b3IocG9vbHMpXHJcbntcclxuXHQvKipcclxuICAgICAqIEB0eXBlIHtzaWduYWxzLlNpZ25hbH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5zaWduYWxzID0ge307XHJcblx0dGhpcy5zaWduYWxzLmdlbmVyYXRlT2JqZWN0cyA9IG5ldyBzaWduYWxzLlNpZ25hbCgpO1xyXG5cdHRoaXMuc2lnbmFscy5vYmplY3REaXNwb3NlZCA9IG5ldyBzaWduYWxzLlNpZ25hbCgpO1xyXG5cclxuXHQvKipcclxuICAgICAqIEB0eXBlIHtBcnJheTxPYmplY3Q+fVxyXG4gICAgICovXHJcblx0dGhpcy5fcG9vbERhdGEgPSBwb29scztcclxuXHJcblx0LyoqXHJcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxyXG4gICAgICovXHJcblx0dGhpcy5fcG9vbHMgPSBudWxsO1xyXG5cclxuXHQvKipcclxuICAgICAqIEB0eXBlIHtPYmplY3R9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuX3BhdHRlcm5zID0gbnVsbDtcclxuXHJcblx0LyoqXHJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICovXHRcclxuXHR0aGlzLl9jdXJyZW50Q291bnQgPSAwO1xyXG5cclxuXHQvKipcclxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XHJcbiAgICAgKi9cdFxyXG5cdHRoaXMuX2NvdW50VGFyZ2V0ID0gbnVsbDtcclxuXHJcblx0LyoqXHJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICovXHJcblx0dGhpcy5fbWluRnJlcXVlbmN5ID0gbnVsbDtcclxuXHJcblx0LyoqXHJcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxyXG4gICAgICovXHJcblx0dGhpcy5fbWF4RnJlcXVlbmN5ID0gbnVsbDtcclxuXHJcblx0LyoqXHJcbiAgICAgKiBAdHlwZSB7QXJyYXl9XHJcbiAgICAgKi9cclxuXHR0aGlzLl9wcmVkZWZpbmVkUGF0dGVybnMgPSBudWxsO1xyXG5cclxuXHRQSVhJLkNvbnRhaW5lci5jYWxsKHRoaXMpO1xyXG5cclxuXHR0aGlzLmluaXQoKTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjcm9sbGVyT2JqZWN0R2VuZXJhdG9yO1xyXG5TY3JvbGxlck9iamVjdEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBJWEkuQ29udGFpbmVyLnByb3RvdHlwZSk7XHJcblNjcm9sbGVyT2JqZWN0R2VuZXJhdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNjcm9sbGVyT2JqZWN0R2VuZXJhdG9yO1xyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFBVQkxJQyBNRVRIT0RTXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICovXHJcblNjcm9sbGVyT2JqZWN0R2VuZXJhdG9yLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKVxyXG57XHJcblx0dGhpcy5fcG9vbHMgPSB7fTtcdFxyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLl9wb29sRGF0YS5sZW5ndGg7IGkrKylcclxuXHR7XHJcblx0XHR0aGlzLl9wb29sc1t0aGlzLl9wb29sRGF0YVtpXS5pZF0gPSBuZXcgcDMuT2JqZWN0UG9vbCh0aGlzLl9wb29sRGF0YVtpXS5iYXNlLCAyLCB0aGlzLl9wb29sRGF0YVtpXS5hcmdzKTtcclxuXHR9XHJcblx0dGhpcy5fcGF0dGVybnMgPSB7fTtcclxuXHR0aGlzLl9wcmVkZWZpbmVkUGF0dGVybnMgPSBbXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKi9cclxuU2Nyb2xsZXJPYmplY3RHZW5lcmF0b3IucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKClcclxue1xyXG5cdGlmKHRoaXMuX2NvdW50VGFyZ2V0ICE9IG51bGwpXHJcblx0e1x0XHJcblx0XHR0aGlzLl9jdXJyZW50Q291bnQrKztcclxuXHRcdGlmKHRoaXMuX2N1cnJlbnRDb3VudCA+PSB0aGlzLl9jb3VudFRhcmdldClcclxuXHRcdHtcclxuXHRcdFx0dGhpcy5nZW5lcmF0ZSgpO1xyXG5cdFx0XHR0aGlzLnNldFJhbmRvbUZyZXF1ZW5jeSgpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IG9ianMgLSB7eCwgeSwgcG9vbElkfVxyXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0dGVybklkXHJcbiAqL1xyXG5TY3JvbGxlck9iamVjdEdlbmVyYXRvci5wcm90b3R5cGUuYWRkUGF0dGVybiA9IGZ1bmN0aW9uKG9ianMsIHBhdHRlcm5JZClcclxue1xyXG5cdGlmKHRoaXMuX3BhdHRlcm5zW3BhdHRlcm5JZF0gPT0gdW5kZWZpbmVkKVxyXG5cdFx0dGhpcy5fcGF0dGVybnNbcGF0dGVybklkXSA9IG9ianM7XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtTdHJpbmd9IGlkXHJcbiAqL1xyXG5TY3JvbGxlck9iamVjdEdlbmVyYXRvci5wcm90b3R5cGUucmVtb3ZlUGF0dGVybiA9IGZ1bmN0aW9uKHBhdHRlcm5JZClcclxue1xyXG5cdGRlbGV0ZSB0aGlzLl9wYXR0ZXJuc1twYXR0ZXJuSWRdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZFxyXG4gKi9cclxuU2Nyb2xsZXJPYmplY3RHZW5lcmF0b3IucHJvdG90eXBlLmdldFBhdHRlcm4gPSBmdW5jdGlvbihwYXR0ZXJuSWQpXHJcbntcclxuXHRyZXR1cm4gdGhpcy5fcGF0dGVybnNbcGF0dGVybklkXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0dGVybklkXHJcbiAqL1xyXG5TY3JvbGxlck9iamVjdEdlbmVyYXRvci5wcm90b3R5cGUuYWRkUHJlZGVmaW5lZFBhdHRlcm4gPSBmdW5jdGlvbihwYXR0ZXJuSWQpXHJcbntcclxuXHRpZih0aGlzLl9wYXR0ZXJuc1twYXR0ZXJuSWRdICE9IHVuZGVmaW5lZClcclxuXHRcdHRoaXMuX3ByZWRlZmluZWRQYXR0ZXJucy5wdXNoKHBhdHRlcm5JZCk7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7IU51bWJlcn0gbWluXHJcbiAqIEBwYXJhbSB7IU51bWJlcn0gbWF4XHJcbiAqIEBwYXJhbSB7IUJvb2xlYW59IHNldFxyXG4gKi9cclxuU2Nyb2xsZXJPYmplY3RHZW5lcmF0b3IucHJvdG90eXBlLnNldEZyZXF1ZW5jaWVzID0gZnVuY3Rpb24obWluLCBtYXgsIHNldClcclxue1xyXG5cdHRoaXMuX21pbkZyZXF1ZW5jeSA9IG1pbjtcclxuXHR0aGlzLl9tYXhGcmVxdWVuY3kgPSBtYXg7XHJcblxyXG5cdGlmKHNldCA9PSB1bmRlZmluZWQpXHJcblx0XHRzZXQgPSB0cnVlO1xyXG5cclxuXHRpZihzZXQpXHJcblx0XHR0aGlzLnNldFJhbmRvbUZyZXF1ZW5jeSgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5TY3JvbGxlck9iamVjdEdlbmVyYXRvci5wcm90b3R5cGUuc2V0UmFuZG9tRnJlcXVlbmN5ID0gZnVuY3Rpb24oKVxyXG57XHJcblx0dGhpcy5fY291bnRUYXJnZXQgPSBNYXRoLnJvdW5kKHRoaXMuX21pbkZyZXF1ZW5jeSArIChNYXRoLnJhbmRvbSgpICogKHRoaXMuX21heEZyZXF1ZW5jeSAtIHRoaXMuX21pbkZyZXF1ZW5jeSkpICk7XHJcblx0dGhpcy5fY3VycmVudENvdW50ID0gMDtcclxufVxyXG5cclxuLyoqXHJcbiAqL1xyXG5TY3JvbGxlck9iamVjdEdlbmVyYXRvci5wcm90b3R5cGUuc2V0U3BlY2lmaWNGcmVxdWVuY3kgPSBmdW5jdGlvbihmcmVxKVxyXG57XHJcblx0dGhpcy5fY291bnRUYXJnZXQgPSBmcmVxO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5TY3JvbGxlck9iamVjdEdlbmVyYXRvci5wcm90b3R5cGUuZ2VuZXJhdGUgPSBmdW5jdGlvbigpXHJcbntcclxuXHR2YXIgcGF0dGVybnMgPSBbXTtcclxuXHJcblx0Zm9yKHZhciBpIGluIHRoaXMuX3BhdHRlcm5zKVxyXG5cdHtcclxuXHRcdHBhdHRlcm5zLnB1c2goaSk7XHJcblx0fVxyXG5cclxuXHR2YXIgY2hvc2VuUGF0dGVybiA9IG51bGw7XHJcblxyXG5cdGlmKHBhdHRlcm5zLmxlbmd0aCA9PSAwKVxyXG5cdHtcclxuXHRcdGNvbnNvbGUubG9nKCdObyBwYXR0ZXJuIHNldCEnKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblx0ZWxzZVxyXG5cdHtcclxuXHRcdGlmKHRoaXMuX3ByZWRlZmluZWRQYXR0ZXJucy5sZW5ndGggPiAwKVxyXG5cdFx0e1xyXG5cdFx0XHRjaG9zZW5QYXR0ZXJuID0gdGhpcy5fcGF0dGVybnNbdGhpcy5fcHJlZGVmaW5lZFBhdHRlcm5zWzBdXTtcclxuXHRcdFx0dGhpcy5fcHJlZGVmaW5lZFBhdHRlcm5zLnNwbGljZSgwLCAxKTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0Y2hvc2VuUGF0dGVybiA9IHRoaXMuX3BhdHRlcm5zW3BhdHRlcm5zW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBhdHRlcm5zLmxlbmd0aCldXTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciByZXR1cm5BcnJheSA9IFtdO1xyXG5cclxuXHRmb3IodmFyIGkgPSAwOyBpIDwgY2hvc2VuUGF0dGVybi5sZW5ndGg7IGkrKylcclxuXHR7XHJcblx0XHR2YXIgcG9vbCA9IHRoaXMuX3Bvb2xzW2Nob3NlblBhdHRlcm5baV0ucG9vbElkXTtcclxuXHRcdHZhciBvYmogPSBwb29sLmNyZWF0ZSgpO1xyXG5cclxuXHRcdGlmKG9iaiA9PSBudWxsKVxyXG5cdFx0e1xyXG5cdFx0XHRwb29sLmV4cGFuZCgyKTtcclxuXHRcdFx0b2JqID0gcG9vbC5jcmVhdGUoKTtcclxuXHRcdH1cclxuXHRcdG9iai5zaWduYWxzLmRpc3Bvc2VkLmFkZCh0aGlzLm9uT2JqZWN0RGlzcG9zZWQsIHRoaXMpO1xyXG5cdFx0cmV0dXJuQXJyYXkucHVzaCh7b2JqOm9iaiwgb2Zmc2V0Ont4OmNob3NlblBhdHRlcm5baV0ueCwgeTpjaG9zZW5QYXR0ZXJuW2ldLnl9fSk7XHJcblx0fVxyXG5cclxuXHR0aGlzLnNpZ25hbHMuZ2VuZXJhdGVPYmplY3RzLmRpc3BhdGNoKHJldHVybkFycmF5KTtcclxufTtcclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBQUklWQVRFIE1FVEhPRFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBFVkVOVFNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblNjcm9sbGVyT2JqZWN0R2VuZXJhdG9yLnByb3RvdHlwZS5vbk9iamVjdERpc3Bvc2VkID0gZnVuY3Rpb24ob2JqKVxyXG57XHJcbiAgICBvYmouc2lnbmFscy5kaXNwb3NlZC5yZW1vdmUodGhpcy5vbk9iamVjdERpc3Bvc2VkLCB0aGlzKTtcclxuICAgIHRoaXMuc2lnbmFscy5vYmplY3REaXNwb3NlZC5kaXNwYXRjaChvYmopO1xyXG5cclxuICAgIGZvcih2YXIgaSBpbiB0aGlzLl9wb29scylcclxuICAgIHtcclxuICAgIFx0aWYodGhpcy5fcG9vbHNbaV0uX3VzZWQuaW5kZXhPZihvYmopID4gLTEpXHJcbiAgICBcdHtcdFxyXG4gICAgXHRcdHRoaXMuX3Bvb2xzW2ldLmZyZWUob2JqKTtcclxuICAgIFx0fVxyXG5cdH1cclxufTtcclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEdFVFRFUlMvU0VUVEVSU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4iLCJ2YXIgQ29tbW9uICAgICAgICAgID0gcmVxdWlyZShcIi4uL0NvbW1vblwiKTtcclxudmFyIFNjcm9sbGVyT2JqZWN0XHQ9IHJlcXVpcmUoXCIuL1Njcm9sbGVyT2JqZWN0XCIpO1xyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gQ09OU1RSVUNUT1JcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKlxyXG4gKiBAY29uc3RydWN0b3JcclxuICogQHBhcmFtIHshU3RyaW5nfSB0eXBlXHJcbiAqIEBwYXJhbSB7IUJvb2xlYW59IHJlbW92ZUlmT3V0c2lkZUJvdW5kYXJ5XHJcbiAqIEBwYXJhbSB7IVBJWEkuVGV4dHVyZX0gdGV4dHVyZVxyXG4gKiBAcGFyYW0ge1BJWEkuUG9pbnQ9fSBhbmNob3JcclxuICovXHJcbmZ1bmN0aW9uIFNjcm9sbGVyT2JqZWN0SW1hZ2UodHlwZSwgcmVtb3ZlSWZPdXRzaWRlQm91bmRhcnksIHRleHR1cmUsIGFuY2hvcilcclxue1xyXG5cdHRoaXMuX3RleHR1cmUgPSB0ZXh0dXJlO1xyXG5cdHRoaXMuX2FuY2hvciA9IGFuY2hvciB8fCBuZXcgUElYSS5Qb2ludCgwLCAwKTtcclxuXHR0aGlzLl9pbWFnZSA9IG51bGw7XHJcblxyXG5cdFNjcm9sbGVyT2JqZWN0LmNhbGwodGhpcywgdHlwZSwgcmVtb3ZlSWZPdXRzaWRlQm91bmRhcnkpO1xyXG5cclxuXHR0aGlzLmNyZWF0ZSgpO1xyXG5cdHRoaXMuaW5pdCgpO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsZXJPYmplY3RJbWFnZTtcclxuU2Nyb2xsZXJPYmplY3RJbWFnZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFNjcm9sbGVyT2JqZWN0LnByb3RvdHlwZSk7XHJcblNjcm9sbGVyT2JqZWN0SW1hZ2UucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2Nyb2xsZXJPYmplY3RJbWFnZTtcclxuXHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBQVUJMSUMgTUVUSE9EU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLyoqXHJcbiAqL1xyXG5TY3JvbGxlck9iamVjdEltYWdlLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbigpXHJcbntcclxuXHR0aGlzLl9pbWFnZSA9IG5ldyBQSVhJLlNwcml0ZSh0aGlzLl90ZXh0dXJlKTtcclxuXHR0aGlzLl9pbWFnZS5hbmNob3IgPSB0aGlzLl9hbmNob3I7XHJcblx0dGhpcy5hZGRDaGlsZCh0aGlzLl9pbWFnZSk7XHJcbn07XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKi9cclxuU2Nyb2xsZXJPYmplY3RJbWFnZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKClcclxue1xyXG5cdFxyXG59O1xyXG5cclxuLyoqXHJcbiAqL1xyXG5TY3JvbGxlck9iamVjdEltYWdlLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKClcclxue1xyXG5cdFNjcm9sbGVyT2JqZWN0LnByb3RvdHlwZS5yZXNldC5jYWxsKHRoaXMpO1xyXG59O1xyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIFBSSVZBVEUgTUVUSE9EU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEVWRU5UU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEdFVFRFUlMvU0VUVEVSU1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4iXX0=
