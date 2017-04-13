function CScrollingBg(oContainer){
    var _oScrollingBg1 = null;
    var _oScrollingBg2 = null;
    var _oScrollingBg3 = null;
    var _oScrollingBg4 = null;
    
    var _iBgOn = 1;
    
    var _bHaveMovedForGameOver = false;
    
    var _oContainer = oContainer;
    this._init = function(){
        var oSpriteTile = s_oSpriteLibrary.getSprite('bg_scroll_1');
        
        _oScrollingBg1 = createBitmap(oSpriteTile);
        _oContainer.addChild(_oScrollingBg1);
        _oContainer.setChildIndex(_oScrollingBg1, BG_INDEX);
        
        oSpriteTile = s_oSpriteLibrary.getSprite('bg_scroll_2');
        _oScrollingBg2 = createBitmap(oSpriteTile);
        _oScrollingBg2.y = -CANVAS_HEIGHT;
        _oContainer.addChild(_oScrollingBg2); 
        _oContainer.setChildIndex(_oScrollingBg2, BG_INDEX);
        
        oSpriteTile = s_oSpriteLibrary.getSprite('bg_scroll_3');
        _oScrollingBg3 = createBitmap(oSpriteTile);
        _oScrollingBg3.y = -CANVAS_HEIGHT*2;
        _oContainer.addChild(_oScrollingBg3); 
        _oContainer.setChildIndex(_oScrollingBg3, BG_INDEX);
        
        oSpriteTile = s_oSpriteLibrary.getSprite('bg_scroll_3');
        _oScrollingBg4 = createBitmap(oSpriteTile);
        _oScrollingBg4.y = -CANVAS_HEIGHT*3;
        _oContainer.addChild(_oScrollingBg4); 
        _oContainer.setChildIndex(_oScrollingBg4, BG_INDEX);
        
    };
    
    this.move = function(iVelocityAngle, bIsGameOver){   
        //passed bg1
        if(_oScrollingBg1.y >= CANVAS_HEIGHT){
            _iBgOn = 2;
        } 
        
        //passed bg2
        if(_oScrollingBg2.y >= CANVAS_HEIGHT){
            _iBgOn = 3;
        } 
        
        //going back to bg3
        if(_oScrollingBg3.y <= -CANVAS_HEIGHT && _iBgOn >= 3){
            _iBgOn = 3;
            _oScrollingBg3.y = _oScrollingBg4.y + CANVAS_HEIGHT;
        } 
        //passed bg3
        if(_oScrollingBg3.y >= CANVAS_HEIGHT && _iBgOn >= 3){
            _iBgOn = 3;
            _oScrollingBg3.y = _oScrollingBg4.y - CANVAS_HEIGHT;
        } 
        
        //going back to bg4
        if(_oScrollingBg4.y <= -CANVAS_HEIGHT && _iBgOn >= 3){
            _iBgOn = 4;
            _oScrollingBg4.y = _oScrollingBg3.y + CANVAS_HEIGHT;
        } 
        //passed bg4
        if(_oScrollingBg4.y >= CANVAS_HEIGHT && _iBgOn >= 3){
            _iBgOn = 4;
            _oScrollingBg4.y = _oScrollingBg3.y - CANVAS_HEIGHT;
        } 
        
        _oScrollingBg1.y+=iVelocityAngle;
        _oScrollingBg2.y+=iVelocityAngle;
        _oScrollingBg3.y+=iVelocityAngle;
        _oScrollingBg4.y+=iVelocityAngle;
        
        if(bIsGameOver && !_bHaveMovedForGameOver && _iBgOn === 4){
            _oScrollingBg3.y = _oScrollingBg4.y+CANVAS_HEIGHT;
            _oScrollingBg2.y = _oScrollingBg3.y+CANVAS_HEIGHT;
            _oScrollingBg1.y = _oScrollingBg3.y+CANVAS_HEIGHT*2;
                
            _bHaveMovedForGameOver = true;
        }else if(bIsGameOver && !_bHaveMovedForGameOver && _iBgOn === 3){
            _oScrollingBg4.y = _oScrollingBg3.y+CANVAS_HEIGHT;
            _oScrollingBg2.y = _oScrollingBg4.y+CANVAS_HEIGHT;
            _oScrollingBg1.y = _oScrollingBg4.y+CANVAS_HEIGHT*2;
                
            _bHaveMovedForGameOver = true;
        }
        
        if(_oScrollingBg1.y <= 0){
            s_oGame.playerStunnedAnimation();
        }
        
    };
    
    this._init();
}