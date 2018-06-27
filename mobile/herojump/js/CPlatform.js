function CPlatform(iX,iY,iType, oPlatformContainer){
    var _iX;
    var _iY;
    var _iType = iType; 
    
    var _bCanBeHitten = true;    //only for the vanishable Platform
    var _bDirection = false;     //false: right, true: left
    var _bHaveSpring = false;
    var _bCanMove = false;
    
    var _oPlatform;
    var _oContainerPlatform = oPlatformContainer;
    var _oRectangleMeasures;
    var _oRectangle;
    var _oBonus;
    
    var _oShape;
    
    this._init = function(){
        _iX = iX;
        _iY = iY;
        
        var oPlatformSprite = s_oSpriteLibrary.getSprite('platform_'+_iType);
                        
        var framerate = 28+(Math.floor((Math.random() * 2) + 1));
        
        //******************************************************************** TYPE 0 AND 1
        if(_iType === 0 || _iType === 1){
            var oData = {   
                images: [oPlatformSprite], 
                framerate: framerate,
                // width, height & registration point of each sprite
                frames: {width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT, regX: 0, regY: 0}, 
                animations: {idle:[0, 7, "idle"]}
            };
            var oSpriteSheet = new createjs.SpriteSheet(oData);

            _oPlatform = createSprite(oSpriteSheet, "idle", 0, 0, PLATFORM_WIDTH, PLATFORM_HEIGHT);
            _oPlatform.x = _iX;
            _oPlatform.y = _iY;

            _oRectangleMeasures = {x: _oPlatform.x+30, y: _oPlatform.y+10, width: PLATFORM_WIDTH-75, height: PLATFORM_HEIGHT-35};
        }else if(_iType === 2){
            //*****************************************************************TYPE 2
            var oData = {   
                images: [oPlatformSprite], 
                framerate: framerate,
                // width, height & registration point of each sprite
                frames: {width: PLATFORM2_WIDTH, height: PLATFORM2_HEIGHT, regX: 0, regY: 0}, 
                animations: {idle:[0, 8, "idle"], breaking:[9, 15,"disable"], disable:[16]}
            };
            var oSpriteSheet = new createjs.SpriteSheet(oData);

            _oPlatform = createSprite(oSpriteSheet, "idle", 0, 0, PLATFORM2_WIDTH, PLATFORM2_HEIGHT);
            _oPlatform.x = _iX;
            _oPlatform.y = _iY;

            _oRectangleMeasures = {x: _oPlatform.x+45, y: _oPlatform.y+10, width: PLATFORM_WIDTH-75, height: PLATFORM_HEIGHT-35};
        }else if(_iType === 3){
            //*****************************************************************TYPE 3
            var oData = {   
                images: [oPlatformSprite], 
                framerate: framerate,
                // width, height & registration point of each sprite
                frames: {width: PLATFORM3_WIDTH, height: PLATFORM3_HEIGHT, regX: 0, regY: 0}, 
                animations: {idle:[0, 10, "idle"], vanishing:[11, 23]}
            };
            var oSpriteSheet = new createjs.SpriteSheet(oData);

            _oPlatform = createSprite(oSpriteSheet, "idle", 0, 0, PLATFORM3_WIDTH, PLATFORM3_HEIGHT);
            _oPlatform.x = _iX;
            _oPlatform.y = _iY;

            _oRectangleMeasures = {x: _oPlatform.x+20, y: _oPlatform.y, width: PLATFORM_WIDTH-75, height: PLATFORM_HEIGHT-35};
        }
        _oContainerPlatform.addChild(_oPlatform);
            
        _oPlatform.stop();
		_oPlatform.visible = false;
        
        _oRectangle = new createjs.Rectangle(_oRectangleMeasures.x, _oRectangleMeasures.y, _oRectangleMeasures.width, _oRectangleMeasures.height);
        
        
        //*********************************************************************SPRING
        if(_iType < 2){
            _oBonus = new CSpring(iX+PLATFORM_WIDTH/2, _iY, _iType, _oContainerPlatform, SPRING);
            _oBonus.setVisibleFalse();
        }        
    };
        
    this.controlCollision = function(oPlayerRectangle){
        
        if(_bHaveSpring && _bCanBeHitten){
            if(_oBonus.controlCollision(oPlayerRectangle)){ 
                createjs.Tween.get( _oPlatform ).wait(400).call(function() {_bCanBeHitten = true;});
                return SPRING;           
            }else if(_oRectangle.intersection ( oPlayerRectangle )){
                createjs.Tween.get( _oPlatform ).wait(400).call(function() {_bCanBeHitten = true;});
                return PLATFORM;  
            }
        }else if(_oRectangle.intersects ( oPlayerRectangle ) && _iType < 2 && _bCanBeHitten){
            _bCanBeHitten = false;
            createjs.Tween.get( _oPlatform ).wait(400).call(function() {_bCanBeHitten = true;});
            return PLATFORM;
        }else if(_oRectangle.intersects ( oPlayerRectangle ) && _iType === 2 && _bCanBeHitten){
            playSound("platform_2_broken",1,0);
            _oPlatform.gotoAndPlay("breaking")
            _bCanBeHitten = false;
        }else if(_oRectangle.intersects ( oPlayerRectangle ) && _iType === 3 && _bCanBeHitten){
            playSound("platform_3_wind",1,0);
            _oPlatform.gotoAndPlay("vanishing")
            createjs.Tween.get( _oPlatform ).to({alpha: 0 }, (400)).call(function() {});
            _bCanBeHitten = false;
            return PLATFORM;
        }
    };
    
    this.setInvisible = function(){
        _oPlatform.visible = false;
    };
    
    this.move = function(iVelocity){
        _oPlatform.y+=iVelocity;
        if(_iType === 1){
            this.moveOrizzontal();
        }
        if(_bHaveSpring){
            _oBonus.move(iVelocity);
        }
        this.refreshRectangle();
    };
   
    this.moveOrizzontal = function(){
        if(_bCanMove){
            if(_oPlatform.x < CANVAS_WIDTH-100-(PLATFORM_WIDTH/2) && !_bDirection){
                if(_bHaveSpring){
                    _oBonus.moveOrizzontal(OBJECT_SPD_ORIZZONTAL);
                }
                _oPlatform.x+=OBJECT_SPD_ORIZZONTAL;
            }else if(_oPlatform.x >= CANVAS_WIDTH-100-(PLATFORM_WIDTH/2)){
                _bDirection = true;
            }

            if(_oPlatform.x > 100-(PLATFORM_WIDTH/2) && _bDirection){
                if(_bHaveSpring){
                    _oBonus.moveOrizzontal(-OBJECT_SPD_ORIZZONTAL);
                }
                _oPlatform.x-=OBJECT_SPD_ORIZZONTAL;
            }else if(_oPlatform.x <= 100-(PLATFORM_WIDTH/2)){
                _bDirection = false;
            }
        }
        
    };
    
    this.refreshRectangle = function(){
        switch(_iType){
            case 0:
            case 1:
                _oRectangleMeasures = {x: _oPlatform.x+33, y: _oPlatform.y+10, width: PLATFORM_WIDTH-75, height: PLATFORM_HEIGHT-35};
                break;
            case 2:
                _oRectangleMeasures = {x: _oPlatform.x+45, y: _oPlatform.y+10, width: PLATFORM_WIDTH-75, height: PLATFORM_HEIGHT-35};
                break;
            case 3:
                _oRectangleMeasures = {x: _oPlatform.x+20, y: _oPlatform.y,    width: PLATFORM_WIDTH-75, height: PLATFORM_HEIGHT-35};
                break;
        }
        _oRectangle.setValues (_oRectangleMeasures.x, _oRectangleMeasures.y, _oRectangleMeasures.width, _oRectangleMeasures.height);/*
        s_oStage.removeChild(_oShape)
        _oShape = new createjs.Shape();
        _oShape.graphics.beginFill("#00ff00").drawRect(_oRectangleMeasures.x, _oRectangleMeasures.y, _oRectangleMeasures.width, _oRectangleMeasures.height);
        _oShape.alpha = 0.5;
        s_oStage.addChild(_oShape);*/
    };
    
    this.changeStatusOn = function(iX, iY){
        
        _oPlatform.x = iX;
        _oPlatform.y = iY;
        _oPlatform.visible = true;
        _oPlatform.alpha = 1;
        _oPlatform.play();
        _bCanMove = true;
        _bCanBeHitten = true;
    };
    
    this.changeStatusOff = function(){
        _oPlatform.x = -150;
        _oPlatform.y = CANVAS_HEIGHT+150;
        _oPlatform.gotoAndPlay("idle");
        _oPlatform.stop();
        _oPlatform.visible = false;
        _bCanMove = false;
        _bCanBeHitten = false;
        if(_bHaveSpring){
            _oBonus.setVisibleFalse(_oPlatform.x+PLATFORM_WIDTH/2, _oPlatform.y);
            _bHaveSpring = false;
        }
    };
    
    this.spawnSpring = function(){
        if(_iType < 2){
            var iValue = Math.round(Math.random() * (2))-1;
            if(iValue === 1){
                _oBonus.setVisibleTrue(_oPlatform.x+PLATFORM_WIDTH/2, _oPlatform.y);
                _bHaveSpring = true;
            }
        } 
    };
    
    this.getRectangle = function(){
        return _oRectangle;
    };
    
    this.getType = function(){
        return _iType;
    };
    
    this.getY = function(){
        return _oPlatform.y;
    };
    
    this.getX = function(){
        return _oPlatform.x;
    };
    
    this.unload = function(){
        _oContainerPlatform.removeChild(_oPlatform); 
        _oPlatform = null;
        _oBonus = null;
    };
    
    this._init();
    
}