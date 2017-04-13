function CPlayer(oParentContainer){
    var _iVelocity = 0;
    
    var _oPlayer;
    var _oPlayerWhenGod;
    var _oPlayerFalling;
    var _oPlayerStunned;
    var _oRectangleMeasure;
    var _oRectangle;
    var _szState;
    
    var _bPlayerIsGod = false;
    var _bPlayerFalling = false;
    var _bIsFlipped = false;
    
    var _oShape;
    this._init = function(oParentContainer){
        var oPlayerSprite = s_oSpriteLibrary.getSprite("player");
        oPlayerSprite.x = PLAYER_X_START;
        oPlayerSprite.y = PLAYER_Y_START;
        
        var oData = {   
            images: [oPlayerSprite], 
            framerate: 40,
            // width, height & registration point of each sprite
            frames: {width: PLAYER_WIDTH, height: PLAYER_HEIGHT, regX: 0, regY: 0}, 
            animations: {idle:[0], jumping:[1, 3, "inTheAir"], inTheAir:[4, 10, "inTheAir"],  falling:[11, 12, "falling_idle"], falling_idle:[13, 19,"falling_idle"], rejumping:[20, 23, "inTheAir"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        _oPlayer = createSprite(oSpriteSheet, "idle", 0, 0, PLAYER_WIDTH, PLAYER_HEIGHT);
        _oPlayer.x = PLAYER_X_START;
        _oPlayer.y = PLAYER_Y_START;
        _oPlayer.regX = PLAYER_WIDTH/2;
        _oPlayer.regY = PLAYER_HEIGHT/2;
        oParentContainer.addChild(_oPlayer);
        
        _oRectangleMeasure = {x: _oPlayer.x-_oPlayer.regX+20, y: _oPlayer.y+20, width: PLAYER_WIDTH-45, height: PLAYER_HEIGHT-(PLAYER_HEIGHT/2)-30};
        
        _oRectangle = new createjs.Rectangle(_oRectangleMeasure.x, _oRectangleMeasure.y, _oRectangleMeasure.width, _oRectangleMeasure.height);/*
        _oShape = new createjs.Shape();
        _oShape.graphics.beginFill("#0000ff").drawRect(_oRectangleMeasure.x, _oRectangleMeasure.y, _oRectangleMeasure.width, _oRectangleMeasure.height);
        _oShape.alpha = 0.5;
        s_oStage.addChild(_oShape);*/
    };
    
    this.flipSprite = function(iDir){
        if(iDir === GOING_LEFT){
            if(!_bPlayerIsGod){
                _oPlayer.scaleX -= 2; 
            }else{
                _oPlayerWhenGod.scaleX -= 2; 
            }
        }else if(iDir === GOING_RIGHT){
            if(!_bPlayerIsGod){
                _oPlayer.scaleX += 2; 
            }else{
                _oPlayerWhenGod.scaleX += 2; 
            }
        }
        //_oPlayerStunned
    };
    
    this.showJumpingAnimation = function(){
        _oPlayer.gotoAndPlay("jumping");
        _szState = "jumping";
    };
    
    this.showReJumpAnimation = function(){
        _oPlayer.gotoAndPlay("rejumping");
        _szState = "rejumping";
    };
    
    this.showFallingAnimation = function(){
        _oPlayer.gotoAndPlay("falling");
        _szState = "falling";
    };
    
    this.playStunnedAnimation = function(){
        if(_bPlayerFalling){
            _oPlayerFalling.visible = false;
        }else{
            _oPlayer.visible = false;
        }
        var oPlayerSprite = s_oSpriteLibrary.getSprite("stunned");
        
        var oData = {   
            images: [oPlayerSprite], 
            framerate: 40,
            // width, height & registration point of each sprite
            frames: {width: PLAYER_STUNNED_WIDTH, height: PLAYER_STUNNED_HEIGHT, regX: 0, regY: 0}, 
            animations: {falled:[0, 2, "idle"], idle:[3, 27, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        _oPlayerStunned = createSprite(oSpriteSheet, "falled", 0, 0, PLAYER_STUNNED_WIDTH, PLAYER_STUNNED_HEIGHT);
        if(_bPlayerFalling){
            _oPlayerStunned.x = _oPlayerFalling.x;
            _oPlayerStunned.y = _oPlayerFalling.y;
        }else{
            _oPlayerStunned.x = _oPlayer.x;
            _oPlayerStunned.y = _oPlayer.y;
        }
        _oPlayerStunned.regX = PLAYER_STUNNED_WIDTH/2;
        _oPlayerStunned.regY = PLAYER_STUNNED_HEIGHT/2;
        oParentContainer.addChild(_oPlayerStunned);
    };
    
    this.playFallingAnimation = function(){
        _oPlayer.visible = false;
        var oPlayerSprite = s_oSpriteLibrary.getSprite("falling");
        
        var oData = {   
            images: [oPlayerSprite], 
            framerate: 20,
            // width, height & registration point of each sprite
            frames: {width: PLAYER_FALLING_WIDTH, height: PLAYER_FALLING_HEIGHT, regX: 0, regY: 0}, 
            animations: {fear:[0, 1, "idle"], idle:[1, 4, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        _oPlayerFalling = createSprite(oSpriteSheet, "fear", 0, 0, PLAYER_FALLING_WIDTH, PLAYER_FALLING_HEIGHT);
        _oPlayerFalling.x = _oPlayer.x;
        _oPlayerFalling.y = _oPlayer.y;
        _oPlayerFalling.regX = PLAYER_FALLING_WIDTH/2;
        _oPlayerFalling.regY = PLAYER_FALLING_HEIGHT/2;
        oParentContainer.addChild(_oPlayerFalling);
        _bPlayerFalling = true;
    };
    
    this.refreshRectangle = function(){
        if(!_bPlayerIsGod && !_bPlayerFalling){
            _oRectangleMeasure = {x: _oPlayer.x-_oPlayer.regX+20, y: _oPlayer.y+20, width: PLAYER_WIDTH-45, height: PLAYER_HEIGHT-(PLAYER_HEIGHT/2)-30};
        }else if(_bPlayerFalling){
            _oRectangleMeasure = {x: _oPlayerFalling.x-_oPlayer.regX+20, y: _oPlayerFalling.y+20, width: PLAYER_WIDTH-45, height: PLAYER_HEIGHT-(PLAYER_HEIGHT/2)-30};
        }else if(_bPlayerIsGod){
            _oRectangleMeasure = {x: _oPlayerWhenGod.x-_oPlayer.regX+20, y: _oPlayerWhenGod.y+20, width: PLAYER_WIDTH-45, height: PLAYER_HEIGHT-(PLAYER_HEIGHT/2)-20};
        }
        _oRectangle.setValues(_oRectangleMeasure.x, _oRectangleMeasure.y, _oRectangleMeasure.width, _oRectangleMeasure.height);/*
        s_oStage.removeChild(_oShape);
        _oShape = new createjs.Shape();
        _oShape.graphics.beginFill("#0000ff").drawRect(_oRectangleMeasure.x, _oRectangleMeasure.y, _oRectangleMeasure.width, _oRectangleMeasure.height);
        _oShape.alpha = 0.5;
        s_oStage.addChild(_oShape);*/
    };
    
    this.beGod = function(){
        if(_bPlayerIsGod){
            return;
        }
        playSound("wings",1,2);
        _oPlayer.visible = false;
        var oPlayerSprite = s_oSpriteLibrary.getSprite("god");
        
        var oData = {   
            images: [oPlayerSprite], 
            framerate: 40,
            // width, height & registration point of each sprite
            frames: {width: PLAYER_GOD_WIDTH, height: PLAYER_GOD_HEIGHT, regX: 0, regY: 0}, 
            animations: {beingGod:[0, 7, "idle"], idle:[8, 15, "idle"], returningHero:[7, 6, 5, 4, 3, 2, 1, 0]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        _oPlayerWhenGod = createSprite(oSpriteSheet, "beingGod", 0, 0, PLAYER_GOD_WIDTH, PLAYER_GOD_HEIGHT);
        _oPlayerWhenGod.x = _oPlayer.x;
        _oPlayerWhenGod.y = _oPlayer.y;
        _oPlayerWhenGod.regX = PLAYER_GOD_WIDTH/2;
        _oPlayerWhenGod.regY = PLAYER_GOD_HEIGHT/2;
        oParentContainer.addChild(_oPlayerWhenGod);
        
        _oPlayerWhenGod.scaleX = _oPlayer.scaleX;
        
        _oRectangleMeasure = {x: _oPlayer.x-_oPlayer.regX+20, y: _oPlayer.y+20, width: PLAYER_WIDTH-45, height: PLAYER_HEIGHT-(PLAYER_HEIGHT/2)-20};
        
        _oRectangle = new createjs.Rectangle(_oRectangleMeasure.x, _oRectangleMeasure.y, _oRectangleMeasure.width, _oRectangleMeasure.height);
        _bPlayerIsGod = true;
    };
    
    this.returnHero = function(){
        _oPlayerWhenGod.gotoAndPlay("returningHero");
        createjs.Tween.get( _oPlayerWhenGod ).to({alpha: 0 }, (300)).call(function() {
            oParentContainer.removeChild(_oPlayerWhenGod);
            _oPlayerWhenGod = null;
            _bPlayerIsGod = false;
            s_oGame.playerIsNoLongerGod();
        });
        _oPlayer.scaleX = _oPlayerWhenGod.scaleX;
        _oPlayer.x = _oPlayerWhenGod.x;
        _oPlayer.visible = true;
        
    };
    
    //MOVE THE PLAYER
    this._movePlayer = function(iForceDirection, iAcceleration){
        _iVelocity += (iAcceleration*iForceDirection);
        
        if ( _iVelocity < 0 ){
            if(_iVelocity < -PLAYER_SPD_MAX){
                _iVelocity = -PLAYER_SPD_MAX;
            }
            if(!_bIsFlipped){
                _bIsFlipped = true;
                this.flipSprite(GOING_LEFT);
            }
            
        }else if ( _iVelocity > 0 ){
            if(_iVelocity > PLAYER_SPD_MAX){
                _iVelocity = PLAYER_SPD_MAX;
            }
            if(_bIsFlipped){
                _bIsFlipped = false;
                this.flipSprite(GOING_RIGHT);
            }
            
        }

        this.addSpeedToPlayer(_iVelocity);

        if(_iVelocity > 0){
            _iVelocity -= PLAYER_DECELERATION;
            if(_iVelocity < 0){
                _iVelocity = 0;
            }
        }else if(_iVelocity < 0){
            _iVelocity += PLAYER_DECELERATION;
            if(_iVelocity > 0){
                _iVelocity = 0;
            }
        }
        
        if(this.getX() > CANVAS_WIDTH){
            this.setPos(0);
        }else if(this.getX() < 0){
            this.setPos(CANVAS_WIDTH);
        }
        
    };
    
    this.addSpeedToPlayer = function(iXToAdd){
        if(!_bPlayerIsGod){
            _oPlayer.x += iXToAdd;
        }else if(_bPlayerFalling){
            _oPlayerFalling.x += iXToAdd;
        }else if(_bPlayerIsGod){
            if(_oPlayerWhenGod !== null){
                _oPlayerWhenGod.x += iXToAdd;
            }
        }
        this.refreshRectangle();
    };
    
    this.setPos = function(newX){
        if(!_bPlayerIsGod){
            _oPlayer.x = newX;
        }else{
            if(_oPlayerWhenGod !== null){
                _oPlayerWhenGod.x = newX;
            }
        }
        this.refreshRectangle();
    };
    
    this.moveUp = function(){
        createjs.Tween.get( _oPlayer ).to({y: PLAYER_Y_START-100 }, (1000)).call(function() { });
    };
    
    this.moveDown = function(){
        createjs.Tween.get( _oPlayerFalling ).to({y: PLAYER_Y_START }, (200)).call(function() { });
    };
    
    this.moveDownWithoutAnimation = function(){
        createjs.Tween.get( _oPlayer ).to({y: PLAYER_Y_START }, (300)).call(function() { });
    };
    
    this.returnState = function(){
        return _szState;
    };
    
    this.getRectangle = function(){
        return _oRectangle;
    };
    
    this.getSprite = function(){
        return _oPlayer;
    };
    
    this.getX = function(){
        if(!_bPlayerIsGod){
            return _oPlayer.x;
        }else{
            if(_oPlayerWhenGod !== null){
                return _oPlayerWhenGod.x;
            }
        }
    };
    
    this.getY = function(){
        return _oPlayer.y;
    };
    
    this._init(oParentContainer);
    
}