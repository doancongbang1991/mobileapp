function CCloud(iY, iType, oGodCloudContainer){
    var _iX;
    var _iY;
    var _iType = iType; 
    var _iDirection = 0;
    var _iScaleValue = 0;
    
    var _oCloud;
    var _oContainerGodCloud = oGodCloudContainer;
    
    this._init = function(){
        _iX = Math.random() * (CANVAS_WIDTH);
        _iY = iY-600;
        
        _iScaleValue = (Math.random() * 1);
        
        if(iType < 3){
            _oCloud = createBitmap(s_oSpriteLibrary.getSprite('god_cloud_'+_iType));
            _oCloud.scaleX = _iScaleValue;
            _oCloud.scaleY = _iScaleValue;
            _oCloud.alpha = 0.7;
        }else{
            _oCloud = createBitmap(s_oSpriteLibrary.getSprite('clouds_in_overlay'));
            _oCloud.scaleX = 1;
            _oCloud.scaleY = 1;
            _oCloud.alpha  = 0.9;
        }
        
        _oCloud.x = _iX;
        _oCloud.y = _iY;
        _oContainerGodCloud.addChild(_oCloud);
        
        if(_oCloud.x <= CANVAS_WIDTH/2){
            _iDirection = GOING_LEFT;
            if(iType < 3){
                _oCloud.scaleX = -(_oCloud.scaleX);
            }
        }else{
            _iDirection = GOING_RIGHT;
        }
                      
    };
    
    this.move = function(iVelocity){
        _oCloud.y+=iVelocity;
        this.moveOrizzontal();
        if(_oCloud.y >= CANVAS_HEIGHT+50){
            this.unload();
            return true;
        }
        return false;
    };
   
    this.moveOrizzontal = function(){
        
        if(_iDirection === GOING_LEFT){
            _oCloud.x += _iScaleValue*1;
        }else{
            _oCloud.x -= _iScaleValue*1;
        }
    };
    
    this.getType = function(){
        return _iType;
    };
    
    this.getY = function(){
        return _oCloud.y;
    };
    
    this.getX = function(){
        return _oCloud.x;
    };
    
    this.unload = function(){
        _oContainerGodCloud.removeChild(_oCloud); 
        _oCloud = null;
    };
    
    this._init();
    
}