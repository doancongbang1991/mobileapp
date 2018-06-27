function CEndPanel(oSpriteBg){
    
    var _oBg;
    var _oGroup;
    
    var _oMsgTextStroke;
    var _oMsgText;
    var _oScoreTextStroke;
    var _oScoreText;
    var _oButRestart;
    var _oButHome;
    
    var _oGameOverSound;
    
    var _oParent = this;
    
    this._init = function(oSpriteBg){
        
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = 0;
        _oBg.y = 0;
        
        var oPlayerSprite = s_oSpriteLibrary.getSprite("stunned");
        
        var oData = {   
            images: [oPlayerSprite], 
            framerate: 40,
            // width, height & registration point of each sprite
            frames: {width: PLAYER_STUNNED_WIDTH, height: PLAYER_STUNNED_HEIGHT, regX: 0, regY: 0}, 
            animations: {falled:[0, 2, "idle"], idle:[3, 27, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        var _oPlayerStunned = createSprite(oSpriteSheet, "falled", 0, 0, PLAYER_STUNNED_WIDTH, PLAYER_STUNNED_HEIGHT);
        _oPlayerStunned.x = CANVAS_WIDTH/2;
        _oPlayerStunned.y = CANVAS_HEIGHT/2-10;
        _oPlayerStunned.regX = PLAYER_STUNNED_WIDTH/2;
        _oPlayerStunned.regY = PLAYER_STUNNED_HEIGHT/2;
        _oPlayerStunned.scaleX = 1.2;
        _oPlayerStunned.scaleY = 1.2;
        
        _oMsgTextStroke = new createjs.Text(""," 70px "+FONT, "#410701");
        _oMsgTextStroke.x = CANVAS_WIDTH/2+2;
        _oMsgTextStroke.y = (CANVAS_HEIGHT/2)-52;
        _oMsgTextStroke.textAlign = "center";
        _oMsgTextStroke.textBaseline = "alphabetic";
        _oMsgTextStroke.lineWidth = 500; 
        
        _oMsgText = new createjs.Text(""," 70px "+FONT, "#ffb400");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2)-52;
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.lineWidth = 500;      
        
        _oScoreTextStroke = new createjs.Text(""," 40px "+FONT, "#410701");
        _oScoreTextStroke.x = CANVAS_WIDTH/2+2;
        _oScoreTextStroke.y = (CANVAS_HEIGHT/2) + 112;
        _oScoreTextStroke.textAlign = "center";
        _oScoreTextStroke.textBaseline = "alphabetic";
        _oScoreTextStroke.lineWidth = 500;
        
        _oScoreText = new createjs.Text(""," 40px "+FONT, "#ffb400");
        _oScoreText.x = CANVAS_WIDTH/2;
        _oScoreText.y = (CANVAS_HEIGHT/2) + 112;
        _oScoreText.textAlign = "center";
        _oScoreText.textBaseline = "alphabetic";
        _oScoreText.lineWidth = 500;
        
        _oButRestart = createBitmap(s_oSpriteLibrary.getSprite('but_restart'));
        _oButRestart.x = CANVAS_WIDTH/2+15;
        _oButRestart.y = CANVAS_HEIGHT/2+160;
        
        _oButHome = createBitmap(s_oSpriteLibrary.getSprite('but_home'));
        _oButHome.x = CANVAS_WIDTH/2-105;
        _oButHome.y = CANVAS_HEIGHT/2+160;
        
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        _oGroup.addChild(_oBg, _oPlayerStunned, _oScoreTextStroke, _oScoreText, _oMsgTextStroke, _oMsgText, _oButRestart, _oButHome);

        s_oStage.addChild(_oGroup);
    };
    
    this.unload = function(){
        _oButHome.off("mousedown",this._onExit);
        _oButRestart.off("mousedown",this._onRestart);
    };
    
    this._initListener = function(){
        _oButHome.on("mousedown",this._onExit);
        _oButRestart.on("mousedown",this._onRestart);
    };
    
    this.show = function(iScore){
        setVolume(s_oSoundtrack, 0)
	_oGameOverSound = playSound("game_over",1,0);
        _oMsgTextStroke.text = TEXT_GAMEOVER;
        _oMsgText.text = TEXT_GAMEOVER;
        
        _oScoreTextStroke.text = TEXT_SCORE + iScore;
        _oScoreText.text = TEXT_SCORE + iScore;
        
        _oGroup.visible = true;
        
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {_oParent._initListener();});
        
        $(s_oMain).trigger("share_event",[iScore]);
        $(s_oMain).trigger("save_score",[iScore]);
    };
    
    this._onExit = function(){
        _oParent.unload();
        playSound("press_button",1,0);
        s_oStage.removeChild(_oGroup);
        
        s_oGame.onExit();
        stopSound(_oGameOverSound);
        if(s_oSoundPlayerDead){
            stopSound(s_oSoundPlayerDead);
        }
    };
    
    this._onRestart = function(){
        _oParent.unload();
        playSound("press_button",1,0);
        s_oStage.removeChild(_oGroup);
        
        s_oGame.onRestart();
        stopSound(_oGameOverSound);
        setVolume(s_oSoundtrack, 1)
        
        if(s_oSoundPlayerDead){
            stopSound(s_oSoundPlayerDead);
        }
    };
    
    this._init(oSpriteBg);
    
    return this;
}
