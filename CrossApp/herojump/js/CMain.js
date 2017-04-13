function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        createjs.Touch.enable(s_oStage);
        
        s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
            $('body').on('contextmenu', '#canvas', function(e){ return false; });
        }
		
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.setFPS(30);
        
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
        
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
		
	
    };
    
    this.preloaderReady = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
        
        this._loadImages();
        _bUpdate = true;
    };
    
    this.soundLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);

         if(_iCurResource === RESOURCE_TO_LOAD){
             _oPreloader.unload();
            
            s_oSoundtrack = playSound("soundtrack",1,-1,s_oSoundtrack);
            
            this.gotoMenu();
         }
    };
    
    this._initSounds = function(){
         if (!createjs.Sound.initializeDefaultPlugins()) {
             return;
         }

        if(navigator.userAgent.indexOf("Opera")>0 || navigator.userAgent.indexOf("OPR")>0){
                createjs.Sound.alternateExtensions = ["mp3"];
                createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));

                createjs.Sound.registerSound("./sounds/death.ogg", "death");
                createjs.Sound.registerSound("./sounds/game_over.ogg", "game_over");
                createjs.Sound.registerSound("./sounds/money.ogg", "money");
                createjs.Sound.registerSound("./sounds/platform_2_broken.ogg", "platform_2_broken");
                createjs.Sound.registerSound("./sounds/platform_3_wind.ogg", "platform_3_wind");
                createjs.Sound.registerSound("./sounds/power_up.ogg", "power_up");
                createjs.Sound.registerSound("./sounds/press_button.ogg", "press_button");
                createjs.Sound.registerSound("./sounds/soundtrack.ogg", "soundtrack");
                createjs.Sound.registerSound("./sounds/spring.ogg", "spring");
                createjs.Sound.registerSound("./sounds/voice_falling.ogg", "voice_falling");
                createjs.Sound.registerSound("./sounds/voice_jump_1.ogg", "voice_jump_1");
                createjs.Sound.registerSound("./sounds/voice_jump_2.ogg", "voice_jump_2");
                createjs.Sound.registerSound("./sounds/wings.ogg", "wings");

        }else{
                createjs.Sound.alternateExtensions = ["ogg"];
                createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));

                createjs.Sound.registerSound("./sounds/death.mp3", "death");
                createjs.Sound.registerSound("./sounds/game_over.mp3", "game_over");
                createjs.Sound.registerSound("./sounds/money.mp3", "money");
                createjs.Sound.registerSound("./sounds/platform_2_broken.mp3", "platform_2_broken");
                createjs.Sound.registerSound("./sounds/platform_3_wind.mp3", "platform_3_wind");
                createjs.Sound.registerSound("./sounds/power_up.mp3", "power_up");
                createjs.Sound.registerSound("./sounds/press_button.mp3", "press_button");
                createjs.Sound.registerSound("./sounds/soundtrack.mp3", "soundtrack");
                createjs.Sound.registerSound("./sounds/spring.mp3", "spring");
                createjs.Sound.registerSound("./sounds/voice_falling.mp3", "voice_falling");
                createjs.Sound.registerSound("./sounds/voice_jump_1.mp3", "voice_jump_1");
                createjs.Sound.registerSound("./sounds/voice_jump_2.mp3", "voice_jump_2");
                createjs.Sound.registerSound("./sounds/wings.mp3", "wings");
        }
        
        RESOURCE_TO_LOAD += 13;
        
    };

    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_restart","./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_home","./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_scroll_1","./sprites/bg_scroll_1.jpg");
        s_oSpriteLibrary.addSprite("bg_scroll_2","./sprites/bg_scroll_2.jpg");
        s_oSpriteLibrary.addSprite("bg_scroll_3","./sprites/bg_scroll_3.jpg");
        
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_restart","./sprites/but_restart.png");
        
        s_oSpriteLibrary.addSprite("player","./sprites/player.png");
        s_oSpriteLibrary.addSprite("god","./sprites/player_god_power.png");
        s_oSpriteLibrary.addSprite("falling","./sprites/player_falling.png");
        s_oSpriteLibrary.addSprite("stunned","./sprites/player_stunned.png");
        
        s_oSpriteLibrary.addSprite("platform_0","./sprites/platform_0.png");
        s_oSpriteLibrary.addSprite("platform_1","./sprites/platform_1.png")
        s_oSpriteLibrary.addSprite("platform_2","./sprites/platform_2.png");
        s_oSpriteLibrary.addSprite("platform_3","./sprites/platform_3.png");
        
        s_oSpriteLibrary.addSprite("god_cloud_0","./sprites/cloud_cupido.png")
        s_oSpriteLibrary.addSprite("god_cloud_1","./sprites/cloud_mars.png");
        s_oSpriteLibrary.addSprite("god_cloud_2","./sprites/cloud_poseidon.png");
        s_oSpriteLibrary.addSprite("clouds_in_overlay","./sprites/clouds.png");
        
        s_oSpriteLibrary.addSprite("spring","./sprites/spring.png");
        s_oSpriteLibrary.addSprite("wings","./sprites/wings.png");
        s_oSpriteLibrary.addSprite("coin","./sprites/coin.png");
        
        s_oSpriteLibrary.addSprite("help_monitor","./sprites/help_monitor.png");
        s_oSpriteLibrary.addSprite("help_mouse","./sprites/help_mouse.png");
        s_oSpriteLibrary.addSprite("help_smartphone","./sprites/help_smartphone.png");
        s_oSpriteLibrary.addSprite("help_touch","./sprites/help_touch.png");
        s_oSpriteLibrary.addSprite("smartphone_rotation","./sprites/smartphone_rotation.png");
        s_oSpriteLibrary.addSprite("dividing_line","./sprites/dividing_line.png");
        s_oSpriteLibrary.addSprite("but_skip","./sprites/but_skip.png");
        s_oSpriteLibrary.addSprite("but_next","./sprites/but_next.png");
        

        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);
        
        if(_iCurResource === RESOURCE_TO_LOAD){
            _oPreloader.unload();
            
            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                s_oSoundtrack = createjs.Sound.play("soundtrack",{ loop:-1});
            }
            
            this.gotoMenu();
        }
    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this.onAllPreloaderImagesLoaded = function(){
        this._loadImages();
    };
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };    

    this.gotoGame = function(iLevel){        
        _oGame = new CGame(_oData, iLevel);   						
        _iState = STATE_GAME;
        
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
	
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
    };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
    };
    
    this._update = function(event){
		if(_bUpdate === false){
			return;
		}
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);

    };
    
    s_oMain = this;
    
    _oData = oData;
    
    this.initContainer();
}
var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_bCanOrientate = false;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundPlayerDead;
var s_oSoundtrack;
var s_oCanvas;
