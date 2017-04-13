function CBonus(iX,iY, iType, oContainer){
    var _iX;
    var _iY;
    var _iType = iType;
    
    var _bCanBeHitten = true;
    
    var _oRectangleMeasures;
    var _oContainerObject = oContainer;    
    var _oBonus;
    var _oRectangle;
    
    var _oShape;
    this._init = function(iX,iY){
        _iX = iX;
        _iY = iY;
        
        if(_iType === COIN){
            var oData = {   
                images: [s_oSpriteLibrary.getSprite("coin")], 
                framerate: 30,
                // width, height & registration point of each sprite
                frames: {width: COIN_WIDTH, height: COIN_HEIGHT, regX: 0, regY: 0}, 
                animations: {idle:[0, 19, "idle"]}
            };
            var oSpriteSheet = new createjs.SpriteSheet(oData);

            _oBonus = createSprite(oSpriteSheet, "idle", 0, 0, COIN_WIDTH, COIN_HEIGHT);
            if(_iX >= CANVAS_WIDTH/2){
                _oBonus.x = _iX-COIN_WIDTH;
            }else{
                _oBonus.x = _iX+COIN_WIDTH;
            }
            _oBonus.y = _iY;
            _oContainerObject.addChild(_oBonus);

            _oRectangleMeasures = {x: _oBonus.x, y: _oBonus.y, width: COIN_WIDTH, height: COIN_HEIGHT*2};

            _oRectangle = new createjs.Rectangle(_oRectangleMeasures.x, _oRectangleMeasures.y, _oRectangleMeasures.width, _oRectangleMeasures.height);
        }else if(_iType === WINGS){
            var oData = {   
                images: [s_oSpriteLibrary.getSprite("wings")], 
                framerate: 30,
                // width, height & registration point of each sprite
                frames: {width: WINGS_WIDTH, height: WINGS_HEIGHT, regX: 0, regY: 0}, 
                animations: {idle:[0, 23, "idle"]}
            };
            var oSpriteSheet = new createjs.SpriteSheet(oData);

            _oBonus = createSprite(oSpriteSheet, "idle", 0, 0, WINGS_WIDTH, WINGS_HEIGHT);
            if(_iX >= CANVAS_WIDTH/2){
                _oBonus.x = _iX-WINGS_WIDTH;
            }else{
                _oBonus.x = _iX+WINGS_WIDTH;
            }
            _oBonus.y = _iY;
            _oContainerObject.addChild(_oBonus);

            _oRectangleMeasures = {x: _oBonus.x, y: _oBonus.y, width: WINGS_WIDTH, height: WINGS_HEIGHT};

            _oRectangle = new createjs.Rectangle(_oRectangleMeasures.x, _oRectangleMeasures.y, _oRectangleMeasures.width, _oRectangleMeasures.height);
        }
        /*
        _oShape = new createjs.Shape();
        _oShape.graphics.beginFill("#00ff00").drawRect(_oRectangleMeasures.x, _oRectangleMeasures.y, _oRectangleMeasures.width, _oRectangleMeasures.height);
        _oShape.alpha = 0.5;
        s_oStage.addChild(_oShape);*/
    };
    
    this.controlCollision = function(oPlayerRectangle){
        var oParent = this;
        if(_oRectangle.intersection ( oPlayerRectangle ) !== null && _bCanBeHitten  && _iType === COIN){
            createjs.Tween.get( _oBonus ).to({x: CANVAS_WIDTH/2-200, y: 100, alpha: 0 }, (3000), createjs.Ease.elasticOut).call(function() {
                this.alpha = 0;
                oParent.changeStatusOff();
            });
            playSound("money",1,0);
            _bCanBeHitten = false;
            return true;
        }
        if(_oRectangle.intersection ( oPlayerRectangle ) !== null && _bCanBeHitten  && _iType === WINGS){
            playSound("power_up",1,0);
            createjs.Tween.get( _oBonus ).to({x: oPlayerRectangle.x, y: oPlayerRectangle.y-50 }, (400)).call(function() {
                this.alpha = 0;
                s_oGame.beGod();
            });
            _bCanBeHitten = false;
            return true
        }
        
    };
    
    this.changeStatusOn = function(iX, iY){
        _oBonus.x = iX;
        _oBonus.y = iY;
        _oBonus.visible = true;
        _oBonus.alpha = 1;
        _oBonus.play();
        this.refreshRectangle();
        _bCanBeHitten = true;
    };
    
    this.changeStatusOff = function(){
        _oBonus.x = -150;
        _oBonus.y = CANVAS_HEIGHT+150;
        _oBonus.visible = false;
        _oBonus.stop();
        this.refreshRectangle();
    };
    
    this.setInvisible = function(){
        _oBonus.visible = false;
    };
    
    this.move = function(iVelocity){
        _oBonus.y+=iVelocity;
        this.refreshRectangle();
    };   
    
    this.refreshRectangle = function(){
        switch(_iType){
            case COIN:
                _oRectangleMeasures = {x: _oBonus.x, y: _oBonus.y, width: COIN_WIDTH, height: COIN_HEIGHT*2};
                break;
            case WINGS:
                _oRectangleMeasures = {x: _oBonus.x, y: _oBonus.y, width: WINGS_WIDTH, height: WINGS_HEIGHT};
                break;
        }
        
        _oRectangle.setValues(_oRectangleMeasures.x, _oRectangleMeasures.y, _oRectangleMeasures.width, _oRectangleMeasures.height);/*
        s_oStage.removeChild(_oShape);
        _oShape = new createjs.Shape();
        _oShape.graphics.beginFill("#00ff00").drawRect(_oRectangleMeasures.x, _oRectangleMeasures.y, _oRectangleMeasures.width, _oRectangleMeasures.height);
        _oShape.alpha = 0.5;
        s_oStage.addChild(_oShape);*/
                
    };
    
    this.getRectangle = function(){
        return _oRectangle;
    };
    
    this.getY = function(){
        return _oBonus.y;
    };
    
    this.getX = function(){
        return _oBonus.x;
    };
    
    this.unload = function(){
        oContainer.removeChild(_oBonus); 
        _oBonus = null;
    };
    
    this._init(iX,iY);
    
}