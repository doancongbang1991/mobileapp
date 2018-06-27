function CGame(oData){
    var _iScore = 0;
    var _iBroken = 0;
    var _iRowsOn = 0;
    var _iPlatformsDistance;
    var _iGAPFromFloorOnStart = 275;
    var _iPosInTypeSelectArray = 0;
    var _iPosition;
    var _iNumFree = 0;
    var _iNumRow = 0;
    var _iVelocityObject;
    var _iVelocityBg = 0;
    var _iObjectSpawnedForSpring = 0;
    var _iPlayerSpeedAdder = 0;
    var _iCoinUsed = 0;
    var _iForceDirection = 0;
    var _iPlayerAcceleration = 0;
    
    var _oPlayer;
    var _oBonus = null;
    var _aCoin = new Array();
    
    var _oGameContainer;
    var _oWaitClickContainer;
    var _oCloudsContainer;
    var _oPlayerContainer;
    var _oPlatformContainer;
    
    //Platform types {0: Normal, 1: Moving, 2: Breakable (Go through), 3: Vanishable}
    var _aTypeToSelect = [[0], [0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2], [1, 1, 1, 2, 2, 2, 2, 2],
                          [1, 1, 1, 2, 2, 2, 3, 3, 3, 3],[1, 2, 2, 2, 3, 3, 3, 3], [2, 2, 2, 3, 3, 3] ];
    var _aHeightBetweenObjectsValues;
    
    var _aPlatform0Unused  = new Array();
    var _aPlatform1Unused  = new Array();
    var _aPlatform2Unused  = new Array();
    var _aPlatform3Unused  = new Array();
    
    var _aPlatformInGame   = new Array();
    
    var _bUpdate = false;
    var _bIncrement = false;
    var _bDecrement = false;
    var _bControlCollision = true;
    var _bPlayerGoingDown = false;
    var _bIsGameOver = false;
    var _bPlayerAnimation = false;
    var _bBonusTaken = false;
    var _bPlayerIsAGod = false;
        
    var _oInterface;
    var _oEndPanel = null;
    var _oParent = this;
    var _oScrollingBg;
    var _oGodCloud;
    var _oCloudsInOverlay = null;
    
    //INIT
    this._init = function(){
        _aHeightBetweenObjectsValues = HEIGHT_BETWEEN_OBJECT;
        
        _iPosition = CANVAS_HEIGHT-_iGAPFromFloorOnStart;
        _iVelocityObject = OBJECT_SPD;
        
        _iPlatformsDistance = _aHeightBetweenObjectsValues[0];
        
        $(s_oMain).trigger("start_level", 1);
        _iNumRow = Math.floor((CANVAS_HEIGHT+_iPlatformsDistance)/_iPlatformsDistance)+5;
        
        _oGameContainer = new createjs.Container();
        s_oStage.addChild(_oGameContainer);
        
        _oScrollingBg = new CScrollingBg(_oGameContainer);
        
        _oCloudsContainer = new createjs.Container();
        _oGameContainer.addChild(_oCloudsContainer);
        
        _oPlatformContainer = new createjs.Container();
        _oGameContainer.addChild(_oPlatformContainer);
        
        for(var i=0; i<MAX_PLATFORM_FOR_TYPE; i++){
            _aPlatform0Unused.push(new CPlatform(-150, CANVAS_HEIGHT+150, 0, _oPlatformContainer));
            _aPlatform1Unused.push(new CPlatform(-150, CANVAS_HEIGHT+150, 1, _oPlatformContainer));
            _aPlatform2Unused.push(new CPlatform(-150, CANVAS_HEIGHT+150, 2, _oPlatformContainer));
            _aPlatform3Unused.push(new CPlatform(-150, CANVAS_HEIGHT+150, 3, _oPlatformContainer));
            _aCoin.push(new CBonus(-150, CANVAS_HEIGHT+150, COIN, _oPlatformContainer));
        }
        
        this._controlIfAllReady();
        _oPlayerContainer = new createjs.Container();
        _oGameContainer.addChild(_oPlayerContainer);
        
        _oPlayer = new CPlayer(_oPlayerContainer);
        
        _oInterface = new CInterface();
       
        _oWaitClickContainer = new createjs.Container();
        s_oStage.addChild(_oWaitClickContainer);
        
        var oSprite = createBitmap(s_oSpriteLibrary.getSprite('help_touch'));
        oSprite.x = CANVAS_WIDTH/2-30;
        oSprite.y = CANVAS_HEIGHT/2-70;
        
        var oMsgTextStroke = new createjs.Text(TEXT_START_GAME," 40px "+FONT, "#410701");
        oMsgTextStroke.x = (CANVAS_WIDTH/2)+2;
        oMsgTextStroke.y = (CANVAS_HEIGHT/2)-140;
        oMsgTextStroke.textAlign = "center";
        oMsgTextStroke.textBaseline = "alphabetic";
        oMsgTextStroke.lineWidth = 500; 
        
        var oMsgText = new createjs.Text(TEXT_START_GAME," 40px "+FONT, "#ffb400");
        oMsgText.x = CANVAS_WIDTH/2;
        oMsgText.y = (CANVAS_HEIGHT/2)-142;
        oMsgText.textAlign = "center";
        oMsgText.textBaseline = "alphabetic";
        oMsgText.lineWidth = 500;  
        
        _oWaitClickContainer.addChild(oSprite, oMsgTextStroke, oMsgText);
        
        this.startSpeedIncrement();
        
        _oGameContainer.on("mousedown", this.setUpdateTrue);
        this._initMouseMove();
    };
    
    this._controlIfAllReady = function(){
        if(_aPlatform0Unused.length === MAX_PLATFORM_FOR_TYPE){
            _iNumFree += _aPlatform0Unused.length;
        }
        if(_aPlatform1Unused.length === MAX_PLATFORM_FOR_TYPE){
            _iNumFree += _aPlatform1Unused.length;
        }
        if(_aPlatform2Unused.length === MAX_PLATFORM_FOR_TYPE){
            _iNumFree += _aPlatform2Unused.length;
        }
        if(_aPlatform3Unused.length === MAX_PLATFORM_FOR_TYPE){
            _iNumFree += _aPlatform3Unused.length;
        }
        if(_aCoin.length === MAX_PLATFORM_FOR_TYPE){
            _iNumFree += _aCoin.length;
        }
        
        if(_iNumFree >= MAX_PLATFORM_FOR_TYPE*(NUM_ELEMENTS-1)){
            for(var i=0; i<_iNumRow; i++){
                this._createRow();
            }
        }
        
        _iNumFree = 0;
    };
    
    //CREATE ROW
    this._createRow = function(){ 
        var iTypeSelected;
        var iLastElement;
        
        //Setting the probability of which type of platforms should be shown at what score
        if (_iScore >= 7000){ 
            if(_iPosInTypeSelectArray === 5){
                _oGodCloud = new CCloud(_iPosition, 2, _oCloudsContainer);
            }else{
                var iValue = Math.floor((Math.random()* 300)+1);
                if(iValue === 1){
                    var iType = Math.floor(Math.random()* 2);
                    _oBonus = new CCloud(_iPosition, iType, _oCloudsContainer);
                }
            }
            _iPosInTypeSelectArray = 6;
            _iPlatformsDistance = _aHeightBetweenObjectsValues[3];
        }else if (_iScore >= 5000 && _iScore < 7000){ 
            if(_iPosInTypeSelectArray === 4){
                _oGodCloud = new CCloud(_iPosition, 1, _oCloudsContainer);
            }
            _iPosInTypeSelectArray = 5;
        }else if (_iScore >= 2500 && _iScore < 5000){ 
            if(_iPosInTypeSelectArray === 3){
                _oGodCloud = new CCloud(_iPosition, 0, _oCloudsContainer);
            }
            _iPosInTypeSelectArray = 4;
            _iPlatformsDistance = _aHeightBetweenObjectsValues[2];
        }else if (_iScore >= 1500 && _iScore < 2500){ 
            _iPosInTypeSelectArray = 3;
            _iPlatformsDistance = _aHeightBetweenObjectsValues[1];
        }else if (_iScore >= 1000 && _iScore < 1500){ 
            _iPosInTypeSelectArray = 2;
        }else if (_iScore >= 500 && _iScore < 1000){ 
            _iPosInTypeSelectArray = 1;
        }else{
            _iPosInTypeSelectArray = 0;
        }
        
        if(_iScore >= 1500 && _oCloudsInOverlay === null){
            var iValue = Math.floor((Math.random()* 300)+1);
            if(iValue === 1){
                _oCloudsInOverlay = new CCloud(_iPosition, 3, _oCloudsContainer);
            }
        }
        
        //here I'm going to spawn platforms and bonusses
        _iPosition -= _iPlatformsDistance;
        
        var iX = Math.random() * (CANVAS_WIDTH - PLATFORM_WIDTH);
        var iY = _iPosition;
        iTypeSelected = _aTypeToSelect[_iPosInTypeSelectArray][Math.floor(Math.random() * _aTypeToSelect[_iPosInTypeSelectArray].length)];
        
        //We can't have two consecutive breakable platforms otherwise it will be impossible to reach another platform sometimes!
        if (iTypeSelected === 2 && _iBroken < 1) {
            _iBroken++;
        }else if (iTypeSelected === 2 && _iBroken >= 1) {
            iTypeSelected = 1;
            _iBroken = 0;
        }
        
        _aPlatformInGame.push( this.getFirstAvailableObstacle(iTypeSelected));
        iLastElement = _aPlatformInGame.length-1;
        if( _aPlatformInGame[iLastElement] !== null){
            _aPlatformInGame[iLastElement].changeStatusOn(iX, iY);
        }else{
            _aPlatformInGame.pop();
        }
        
        _iObjectSpawnedForSpring++;
        if(_iObjectSpawnedForSpring >= NUM_PLATFORM_CREATED_FOR_SPRING){
            _aPlatformInGame[iLastElement].spawnSpring();
            _iObjectSpawnedForSpring = 0;
        }        
       
        //HERE I'M GOING TO SPAWN COIN OR WINGS
        var iValue = Math.floor((Math.random()* 100)+1);
        if(iValue > 1 && iValue <= COIN_OCCUR){
            var iCoinX = (Math.random()*(CANVAS_WIDTH-COIN_WIDTH))+COIN_WIDTH;
            var iCoinY = _iPosition-(COIN_HEIGHT*2);
            _aCoin[_iCoinUsed].changeStatusOn(iCoinX, iCoinY);
            _iCoinUsed++;
        }else if(iValue <= BONUS_OCCUR && (!_oBonus && !_bPlayerIsAGod)){
            var iWingsX = (Math.random()*(CANVAS_WIDTH-WINGS_WIDTH))+WINGS_WIDTH;
            var iWingsY = _iPosition-WINGS_HEIGHT;
            _oBonus = new CBonus(iWingsX, iWingsY, WINGS, _oPlatformContainer );
        }
    };
    
    this.getFirstAvailableObstacle = function(iType){
        var oApp;
        var iLastElement;
        switch (iType){
            case 0:
                if(_aPlatform0Unused.length > 0){
                    iLastElement = _aPlatform0Unused.length-1;
                    oApp = _aPlatform0Unused[iLastElement];
                    _aPlatform0Unused.pop();
                    return oApp;
                }else{
                    return null;
                }
            case 1:
                if(_aPlatform1Unused.length > 0){
                    iLastElement = _aPlatform1Unused.length-1;
                    oApp = _aPlatform1Unused[iLastElement];
                    _aPlatform1Unused.pop();
                    return oApp;
                }else{
                    return null;
                }
            case 2:
                if(_aPlatform2Unused.length > 0){
                    iLastElement = _aPlatform2Unused.length-1;
                    oApp = _aPlatform2Unused[iLastElement];
                    _aPlatform2Unused.pop();
                    return oApp;
                }else{
                    return null;
                }
            case 3:
                if(_aPlatform3Unused.length > 0){
                    iLastElement = _aPlatform3Unused.length-1;
                    oApp = _aPlatform3Unused[iLastElement];
                    _aPlatform3Unused.pop();
                    return oApp;
                }else{
                    return null;
                }
        }
    };
    
    //DETECTIONG MOUSE MOVE
    this._initMouseMove = function(){
        if(!s_bCanOrientate){
            s_oStage.on("stagemousemove", function(evt) {
                _iForceDirection = (evt.stageX-(CANVAS_HALF_WIDTH)) / (CANVAS_HALF_WIDTH-CANVAS_WIDTH_RANGE_ACCEPTED);
                if(Math.abs(_iForceDirection) > 1 ){
                    _iForceDirection = 1;
                }
                if(evt.stageX < CANVAS_HALF_WIDTH){
                    _iForceDirection = -1*Math.abs(_iForceDirection);
                }
                _iPlayerAcceleration = PLAYER_ACCELERATION_NO_GIROSCOPE;
            });
        }else{
            window.addEventListener('deviceorientation', function(eventData) {
                if(eventData.gamma < GAMMA_RANGE_ACCEPTED && eventData.gamma > -GAMMA_RANGE_ACCEPTED){
                    _iForceDirection = eventData.gamma / GAMMA_RANGE_ACCEPTED;
                }else{
                    if(eventData.gamma < 0){
                        _iForceDirection = -1;
                    }else{
                        _iForceDirection = 1;
                    }
                    _iPlayerAcceleration = PLAYER_ACCELERATION_GIROSCOPE;
                }
            }, false);
        }
    };
    
    //START GAME
    this.setUpdateTrue = function(){
        if(_bUpdate || _bIsGameOver){
            return;
        }
        createjs.Tween.get(_oWaitClickContainer).to({alpha:0 }, 500).call(function() {s_oStage.removeChild(_oWaitClickContainer);});
        
        _oGameContainer.off("mousedown", this.setUpdateTrue);
        _bPlayerAnimation = true;
        _bUpdate = true;
        _oPlayer.showJumpingAnimation();
        _oPlayer.moveUp();
    };
    
    //MOVE OBJECT AND CONTROLS IF OVER CANVAS
    this.moveObject = function(){
        var iPlatformHitted = 0;                    //0:Not Hitted, 1: Platform Hitted, 2: Spring Hitted
        var oApp = null;
        var oAppCoin;
        _oScrollingBg.move(_iVelocityBg, _bIsGameOver);
        if(_oGodCloud){
            var bHaveToDelete = _oGodCloud.move(_iVelocityBg);
            if(bHaveToDelete){
                _oGodCloud = null;
            }
        }
        if(_oCloudsInOverlay){
            var bHaveToDelete = _oCloudsInOverlay.move(_iVelocityBg);
            if(bHaveToDelete){
                _oCloudsInOverlay = null;
            }
        }
        for(var i=0; i < _aPlatformInGame.length; i++){
            _aPlatformInGame[i].move(_iVelocityObject);
            if(_bControlCollision && _bPlayerGoingDown){
                iPlatformHitted = _aPlatformInGame[i].controlCollision(_oPlayer.getRectangle());
                if(iPlatformHitted > 0){
                    _bControlCollision = false;
                    _oPlayer.showReJumpAnimation();
                    _bPlayerAnimation = false;
                }
            }
            oApp = this._controlIfPlatformOverCanvas(i);
            
            if(oApp !== null){
                switch(oApp.getType()){
                    case 0:
                        _aPlatform0Unused.push(oApp);
                        break;
                    case 1:
                        _aPlatform1Unused.push(oApp);
                        break;
                    case 2:
                        _aPlatform2Unused.push(oApp);
                        break;
                    case 3:
                        _aPlatform3Unused.push(oApp);
                        break;
                } 
                i--;
            }
        }
        
        for(var i=0; i < _iCoinUsed; i++){
            _aCoin[i].move(_iVelocityObject);
            if(_aCoin[i].controlCollision(_oPlayer.getRectangle()) || this._controlIfCoinOverCanvas(i)){
                oAppCoin = _aCoin[i];
                if(this._controlIfCoinOverCanvas(i)){
                    _aCoin[i].changeStatusOff();
                }
                _aCoin.splice(i, 1);
                _iCoinUsed--;
                _aCoin.push(oAppCoin);
                if(_aCoin[i].controlCollision(_oPlayer.getRectangle())){
                    _iScore += 10;
                }
            }
        }
        
        if(_oBonus !== null){
            _oBonus.move(_iVelocityObject);
            if(_oBonus.controlCollision(_oPlayer.getRectangle())){
                _bBonusTaken = true;
            }
            this._controlIfBonusOverCanvas();
        }
        
        if(iPlatformHitted > 0){
            this.startSpeedIncrement(iPlatformHitted);
        }
    };
    
    this._controlIfPlatformOverCanvas = function(i){
        var oApp;
        
        if(_aPlatformInGame[i].getY() >= CANVAS_HEIGHT){
            if(i < _aPlatformInGame.length-1){
                _aPlatformInGame[i].changeStatusOff();
                oApp = _aPlatformInGame[i];
                _aPlatformInGame.splice(i, 1);
                _iRowsOn--;
                this._createRow();
                return oApp;
            }else{
                return null;
            }
        }else{
            return null;
        }
    };
    
    this._controlIfCoinOverCanvas = function(i){
        if(_aCoin[i].getY() >= CANVAS_HEIGHT){
            if(i < _aCoin.length-1){
                return true;
            }
        }else{
            return false;
        }
    };
    
    this._controlIfBonusOverCanvas = function(){
        if(_oBonus.getY() >= CANVAS_HEIGHT){
            _oBonus.unload();
            _oBonus = null;
        }
    };
    
    //INCREASES SPEED BASED ON THE OBJECT HITTED
    this.startSpeedIncrement = function(iType){
        _bIncrement = true;
        _bDecrement = false;
        _bPlayerGoingDown = false;
        _iVelocityObject = OBJECT_SPD;
        switch(iType){
            case PLATFORM:
                var iValue = Math.floor(Math.random()*2)+1;
                playSound("voice_jump_"+iValue,1,0);
                _iPlayerSpeedAdder = 0;
                _bControlCollision = false;
                break;
            case SPRING:
                _iPlayerSpeedAdder += 30;
                _bControlCollision = false;
                break;   
            case WINGS:
                _iPlayerSpeedAdder += 50;
                _bControlCollision = false;
                _bPlayerIsAGod = true;
                _oPlayer.beGod();
        }
    };
    //GOING UP
    this.incrementSpeedObject = function(){
        _iVelocityObject += ACCELERATION;
        _iVelocityBg = Math.round(_iVelocityObject/7);
        if(!_bPlayerAnimation && _iVelocityObject >= 0){
            _oPlayer.showJumpingAnimation();
        }
        if(_iVelocityObject >= OBJECT_SPD_MAX+_iPlayerSpeedAdder){
            _iPlayerSpeedAdder = 0;
            _bIncrement = false;
            _bDecrement = true;
            _bPlayerAnimation = false;
            _bPlayerGoingDown = true;
        }
    };
    
    //GOING DOWN
    this.decrementSpeedObject = function(){
        _iVelocityObject -= DECELERATION;
        if(!_bIsGameOver){
            _iVelocityBg = _iVelocityObject/3;
        }else{
            _iVelocityBg -= DECELERATION_BG_GAME_OVER;
        }
        if(_iVelocityObject <= 0){
            if(!_bPlayerIsAGod){
                if(!_bPlayerAnimation){
                    _oPlayer.showFallingAnimation();
                    _bPlayerAnimation = true;
                }
                _bControlCollision = true;
            }else{
                _oPlayer.returnHero();
                _bBonusTaken = false;
            }
        }
        if(this.controlIfGameOver() && !_bIsGameOver){
            _oPlayer.playFallingAnimation();
            _oPlayer.moveDown();
            playSound("voice_falling",1,0);
            _bIsGameOver = true;
        }
    };
    //POWER UP
    this.beGod = function(){
        _oBonus.unload();
        _oBonus = null;
        
        if(!_bPlayerIsAGod){
            this.startSpeedIncrement(WINGS);
        }
    };
    
    this.playerIsNoLongerGod = function(){
        _bPlayerIsAGod = false;
    };
    
    //PLAYER STUNNED
    this.playerStunnedAnimation = function(){
        if(_bBonusTaken){
            return;
        }
        
        if(_bIsGameOver !== true){
            setTimeout(function(){
                s_oSoundPlayerDead = playSound("death",1,0);
                _oPlayer.playStunnedAnimation();
                var xShifting = 10;
                var yShifting = 30;

                createjs.Tween.get(s_oStage).to({x: Math.round(Math.random()*xShifting), y: Math.round(Math.random()*yShifting) }, 50).call(function() {
                    createjs.Tween.get(s_oStage).to({x: Math.round(Math.random()*xShifting*0.8), y:-Math.round(Math.random()*yShifting*0.8) }, 50).call(function() {
                        createjs.Tween.get(s_oStage).to({x: Math.round(Math.random()*xShifting*0.6), y:Math.round(Math.random()*yShifting*0.6) }, 50).call(function() {
                            createjs.Tween.get(s_oStage).to({x: Math.round(Math.random()*xShifting*0.4), y:-Math.round(Math.random()*yShifting*0.4) }, 50).call(function() {
                                createjs.Tween.get(s_oStage).to({x: Math.round(Math.random()*xShifting*0.2), y:Math.round(Math.random()*yShifting*0.2) }, 50).call(function() {
                                    createjs.Tween.get(s_oStage).to({x: Math.round(Math.random()*xShifting), y:-Math.round(Math.random()*yShifting) }, 50).call(function() {
                                        createjs.Tween.get(s_oStage).to({y:0, x:0 }, 50).call(function() {
                                            _oParent.gameOver();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
            ,400);
            _oPlayer.moveDownWithoutAnimation();
            
        }else{
            playSound("death",1,0);
            _oPlayer.playStunnedAnimation();
            var xShifting = 10;
            var yShifting = 30;

            createjs.Tween.get(s_oStage).to({x: Math.round(Math.random()*xShifting), y: Math.round(Math.random()*yShifting) }, 50).call(function() {
                createjs.Tween.get(s_oStage).to({x: Math.round(Math.random()*xShifting*0.8), y:-Math.round(Math.random()*yShifting*0.8) }, 50).call(function() {
                    createjs.Tween.get(s_oStage).to({x: Math.round(Math.random()*xShifting*0.6), y:Math.round(Math.random()*yShifting*0.6) }, 50).call(function() {
                        createjs.Tween.get(s_oStage).to({x: Math.round(Math.random()*xShifting*0.4), y:-Math.round(Math.random()*yShifting*0.4) }, 50).call(function() {
                            createjs.Tween.get(s_oStage).to({x: Math.round(Math.random()*xShifting*0.2), y:Math.round(Math.random()*yShifting*0.2) }, 50).call(function() {
                                createjs.Tween.get(s_oStage).to({x: Math.round(Math.random()*xShifting), y:-Math.round(Math.random()*yShifting) }, 50).call(function() {
                                    createjs.Tween.get(s_oStage).to({y:0, x:0 }, 50).call(function() {
                                        _oParent.gameOver();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
        
        _bUpdate = false;
        _bIsGameOver = true;
        
    };
    
    
    this.controlIfGameOver = function(){
        if(_aPlatformInGame[0].getY()+_iGAPFromFloorOnStart < _oPlayer.getY()){
            return true;
        }
        return false;
    };
    
    this.unload = function(){
        _oInterface.unload();
        if(_oEndPanel !== null){
            _oEndPanel.unload();
        }
        
        _aPlatformInGame = [];

        _aPlatform0Unused = [];
        _aPlatform1Unused = [];
        _aPlatform2Unused = [];
        _aPlatform3Unused = [];

        _aCoin = [];
        
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren(); 
    };
 
    this.onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
        
        $(s_oMain).trigger("end_level", 1);
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
    };
 
    this.onRestart = function(){
        this.unload();
        
        $(s_oMain).trigger("end_level", 1);
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
        
        s_oMain.gotoGame();
    };
    
    this.gameOver = function(){  
        _oEndPanel = CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        _oEndPanel.show(_iScore);
    };
    
    //UPDATE
    this.update = function(){
        if(_bUpdate){
            
            _oPlayer._movePlayer(_iForceDirection, _iPlayerAcceleration);
            
            if(_bIncrement){
                this.incrementSpeedObject();
            }
            if(_bDecrement){
                this.decrementSpeedObject();
            }
            
            this.moveObject();
            
            _iPosition = _aPlatformInGame[_aPlatformInGame.length-1].getY();
            
            if(!_bIsGameOver && (_iScore + _iVelocityBg) >0){
                _iScore += Math.floor(_iVelocityBg);
                _oInterface.refreshScore(_iScore);
            }
        }
    };

    s_oGame=this;
    
    _oParent=this;
    
    
    PLAYER_SPD_MAX                   = oData.player_spd_max;
    PLAYER_SPD_MIN                   = oData.player_spd_min;
    PLAYER_ACCELERATION_NO_GIROSCOPE = oData.player_acceleration_no_giroscope;
    PLAYER_ACCELERATION_GIROSCOPE    = oData.player_acceleration_giroscope;
    PLAYER_DECELERATION              = oData.player_deceleration;
    OBJECT_SPD                       = oData.object_spd;
    OBJECT_SPD_ORIZZONTAL            = oData.object_spd_orizzontal;
    ACCELERATION                     = oData.acceleration;
    DECELERATION                     = oData.deceleration;
    DECELERATION_BG_GAME_OVER        = oData.deceleration_bg_game_over;
    OBJECT_SPD_MAX                   = oData.object_spd_max;
    OBJECT_SPD_MIN                   = oData.object_spd_min;
    HEIGHT_BETWEEN_OBJECT            = oData.height_between_object;
    GAMMA_RANGE_ACCEPTED             = oData.gamma_range_accepted;
    CANVAS_WIDTH_RANGE_ACCEPTED      = oData.canvas_half_width_range_accepted;
    NUM_PLATFORM_CREATED_FOR_SPRING  = oData.num_platform_created_for_spring;
	BONUS_OCCUR                      = oData.bonus_occurrence;
	COIN_OCCUR 						 = oData.coin_occurrence;
    
    this._init();
}

var s_oGame;
