function CSpring(iX,iY,iType, oContainer, iBonusType){
    var _iX;
    var _iY;
    var _iType; 
    var _iBonusType = iBonusType;
    
    var _oRectangleMeasures;
    
    var _oContainer = oContainer;
    
    var _oObject;
    var _oRectangle;
    
    var _oShape;
    this._init = function(){
        _iX = iX;
        _iY = iY;
        _iType = iType;
        
        if(_iBonusType === SPRING){
            var oSourceImage = s_oSpriteLibrary.getSprite('spring');
                
            var oData = {   
                        images: [oSourceImage], 
                        // width, height & registration point of each sprite
                        frames: {width: SPRING_WIDTH, height: SPRING_HEIGHT, regX: SPRING_WIDTH/2, regY: SPRING_HEIGHT/2}, 
                        animations: {idle:[0], hitted:[1, 7]}
                    };
                    
            var oSpriteSheet = new createjs.SpriteSheet(oData);
            _oObject = createSprite(oSpriteSheet, "idle", 0, 0, SPRING_WIDTH, SPRING_HEIGHT);
            _oObject.x = iX;
            _oObject.y = iY;

            _oObject.rotation = 0;
            _oContainer.addChild(_oObject);
            
            _oRectangleMeasures = {x: _oObject.x-SPRING_WIDTH/2, y: _oObject.y-SPRING_HEIGHT/2, width: SPRING_WIDTH, height: SPRING_HEIGHT};
            
            _oRectangle = new createjs.Rectangle(_oRectangleMeasures.x, _oRectangleMeasures.y, _oRectangleMeasures.width, _oRectangleMeasures.height);/*
            _oShape = new createjs.Shape();
            _oShape.graphics.beginFill("#0f0f0f").drawRect(_oRectangleMeasures.x, _oRectangleMeasures.y, _oRectangleMeasures.width, _oRectangleMeasures.height);
            _oShape.alpha = 0.5;
            s_oStage.addChild(_oShape);*/
        }
    };
    
    this.controlCollision = function(oPlayerRectangle){
        if(_oRectangle.intersection ( oPlayerRectangle ) !== null){
            _oObject.gotoAndPlay("hitted");
            playSound("spring",1,0);
            return true;
        }
        return false;
    };
    
    this.setVisibleFalse = function(){
        _oObject.visible = false;
        _oObject.gotoAndStop(0);
    };
    
    this.setVisibleTrue = function(iX, iY){
        _oObject.visible = true;
        _oObject.x = iX;
        _oObject.y = iY;
    };
    
    this.move = function(iVelocity){
        _oObject.y+=iVelocity;
        this.refreshRectangle();
    };
    
    this.refreshRectangle = function(){
        _oRectangleMeasures = {x: _oObject.x-SPRING_WIDTH/2, y: _oObject.y-SPRING_HEIGHT/2, width: SPRING_WIDTH, height: SPRING_HEIGHT};
        _oRectangle.setValues(_oRectangleMeasures.x, _oRectangleMeasures.y, _oRectangleMeasures.width, _oRectangleMeasures.height);/*
        s_oStage.removeChild(_oShape);
        _oShape = new createjs.Shape();
        _oShape.graphics.beginFill("#0f0f0f").drawRect(_oRectangleMeasures.x, _oRectangleMeasures.y, _oRectangleMeasures.width, _oRectangleMeasures.height);
        _oShape.alpha = 0.5;
        s_oStage.addChild(_oShape);*/
    };
    
    this.moveOrizzontal = function(iVelocity){
        _oObject.x+=iVelocity;
    };
    
    this.getRectangle = function(){
        return _oRectangle;
    };
        
    this.getType = function(){
        return _iType;
    };
    
    this.getY = function(){
        return _oObject.y;
    };
    
    this.getX = function(){
        return _oObject.x;
    };
    
    this.unload = function(){
        
    };
    
    this._init();
    
}