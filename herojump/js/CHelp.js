function CHelp(){
    
    var _oParent = this;
    
    var _oBg;
    var _oGroup1;
    var _oGroup2;

    var _oMsgTextOutline;
    var _oMsgText;
    var _oMsgTextPlatform0;
    var _oMsgTextPlatform1;
    var _oMsgTextPlatform2;
    var _oMsgTextPlatform3;
    var _oMsgTextSpring;
    var _oMsgTextCoin;
    
    var _oHelpSprite;
    var _oHelpSpriteCursor;
    var _oArrowLeft;
    var _oArrowRight;
    var _oButPlay;
    
    
    this._init = function(){
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_scroll_1'));
        s_oStage.addChild(_oBg);
        
        _oGroup1 = new createjs.Container();
        _oGroup1.alpha = 0;
        
        _oGroup2 = new createjs.Container();
        _oGroup2.alpha=0;
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        
        s_oStage.addChild(_oBg);
                
        _oMsgTextOutline = new createjs.Text(""," 25px "+FONT, "#410701");
        _oMsgTextOutline.x = CANVAS_WIDTH/2+1;
        _oMsgTextOutline.y = (CANVAS_HEIGHT/2)+71;
        _oMsgTextOutline.textAlign = "center";
        _oMsgTextOutline.textBaseline = "alphabetic";
        _oMsgTextOutline.lineWidth = 400;     
        _oGroup1.addChild(_oMsgTextOutline);
                
        _oMsgText = new createjs.Text(""," 25px "+FONT, "#ffb400");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2)+70;
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.lineWidth = 400;     
        _oGroup1.addChild(_oMsgText);
        
        
        if(!s_bMobile){
            //I'M ON A DESKTOP
            _oMsgTextOutline.text = TEXT_DESKTOP;
            _oMsgText.text = TEXT_DESKTOP;
            _oHelpSprite = createBitmap(s_oSpriteLibrary.getSprite('help_monitor'));
            _oHelpSprite.x = CANVAS_WIDTH/2-80;
            _oHelpSprite.y = CANVAS_HEIGHT/2-130;
            _oGroup1.addChild(_oHelpSprite);
            
            _oHelpSpriteCursor = createBitmap(s_oSpriteLibrary.getSprite('help_mouse'));
            _oHelpSpriteCursor.x = CANVAS_WIDTH/2-10;
            _oHelpSpriteCursor.y = CANVAS_HEIGHT/2-60;
            this.moveCursorRightDesktop(_oHelpSpriteCursor);
            _oGroup1.addChild(_oHelpSpriteCursor);
        }else if(s_bCanOrientate){
            //I'M ON A DEVICE WITH GIROSCOPE
            _oMsgTextOutline.text = TEXT_ORIENTATION;
            _oMsgText.text = TEXT_ORIENTATION;
            
            var oSprite = s_oSpriteLibrary.getSprite('smartphone_rotation');
            var oData = {   
                images: [oSprite], 
                framerate: 15,
                // width, height & registration point of each sprite
                frames: {width: 166, height: 166, regX: 0, regY: 0}, 
                animations: {idle:[0, 19, "idle"]}
            };
            var oSpriteSheet = new createjs.SpriteSheet(oData);

            _oHelpSprite = createSprite(oSpriteSheet, "idle", 0, 0, 166, 166);
            _oHelpSprite.x = CANVAS_WIDTH/2-80;
            _oHelpSprite.y = CANVAS_HEIGHT/2-130;
            _oGroup1.addChild(_oHelpSprite);
        }else{
            //I'M ON A DEVICE WITHOUT GIROSCOPE
            _oMsgTextOutline.text = TEXT_MOBILE;
            _oMsgText.text = TEXT_MOBILE;
            _oHelpSprite = createBitmap(s_oSpriteLibrary.getSprite('help_smartphone'));
            _oHelpSprite.x = CANVAS_WIDTH/2-50;
            _oHelpSprite.y = CANVAS_HEIGHT/2-130;
            _oGroup1.addChild(_oHelpSprite);
            
            _oHelpSpriteCursor = createBitmap(s_oSpriteLibrary.getSprite('help_touch'));
            _oHelpSpriteCursor.x = CANVAS_WIDTH/2-30;
            _oHelpSpriteCursor.y = CANVAS_HEIGHT/2-60;
            this.moveCursorRight(_oHelpSpriteCursor);
            _oGroup1.addChild(_oHelpSpriteCursor);
        }
        
        s_oStage.addChild(_oGroup1);
                
                
        //******************************************************************** PLATFORM 0
        _oMsgTextPlatform0 = new createjs.Text(TEXT_PLATFORM0," 20px "+FONT, "#410701");
        _oMsgTextPlatform0.x = CANVAS_WIDTH/2+51;
        _oMsgTextPlatform0.y = (CANVAS_HEIGHT/2)-129;
        _oMsgTextPlatform0.textAlign = "center";
        _oMsgTextPlatform0.textBaseline = "alphabetic";
        _oMsgTextPlatform0.lineWidth = 200;       
        _oGroup2.addChild(_oMsgTextPlatform0);
        
        _oMsgTextPlatform0 = new createjs.Text(TEXT_PLATFORM0," 20px "+FONT, "#ffb400");
        _oMsgTextPlatform0.x = CANVAS_WIDTH/2+50;
        _oMsgTextPlatform0.y = (CANVAS_HEIGHT/2)-130;
        _oMsgTextPlatform0.textAlign = "center";
        _oMsgTextPlatform0.textBaseline = "alphabetic";
        _oMsgTextPlatform0.lineWidth = 200;     
        _oGroup2.addChild(_oMsgTextPlatform0);
        
        var oSpritePlatform0 = s_oSpriteLibrary.getSprite('platform_0');
        
        var oData = {   
            images: [oSpritePlatform0], 
            framerate: 28,
            // width, height & registration point of each sprite
            frames: {width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT, regX: 0, regY: 0}, 
            animations: {idle:[0, 7, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        var oPlatform = createSprite(oSpriteSheet, "idle", 0, 0, PLATFORM_WIDTH, PLATFORM_HEIGHT);
        oPlatform.x = CANVAS_WIDTH/2-200;
        oPlatform.y = CANVAS_HEIGHT/2-170;
        _oGroup2.addChild(oPlatform);
        
        var oDividingLine = createBitmap(s_oSpriteLibrary.getSprite('dividing_line'));
        oDividingLine.x = CANVAS_WIDTH/2-170;
        oDividingLine.y = CANVAS_HEIGHT/2-115;
        _oGroup2.addChild(oDividingLine);
        
        //******************************************************************** PLATFORM 1
        _oMsgTextPlatform1 = new createjs.Text(TEXT_PLATFORM1," 20px "+FONT, "#410701");
        _oMsgTextPlatform1.x = CANVAS_WIDTH/2+51;
        _oMsgTextPlatform1.y = (CANVAS_HEIGHT/2)-69;
        _oMsgTextPlatform1.textAlign = "center";
        _oMsgTextPlatform1.textBaseline = "alphabetic";
        _oMsgTextPlatform1.lineWidth = 200;     
        _oGroup2.addChild(_oMsgTextPlatform1);
        
        _oMsgTextPlatform1 = new createjs.Text(TEXT_PLATFORM1," 20px "+FONT, "#ffb400");
        _oMsgTextPlatform1.x = CANVAS_WIDTH/2+50;
        _oMsgTextPlatform1.y = (CANVAS_HEIGHT/2)-70;
        _oMsgTextPlatform1.textAlign = "center";
        _oMsgTextPlatform1.textBaseline = "alphabetic";
        _oMsgTextPlatform1.lineWidth = 200;     
        _oGroup2.addChild(_oMsgTextPlatform1);
        
        var oSpritePlatform1 = s_oSpriteLibrary.getSprite('platform_1');
        
        var oData = {   
            images: [oSpritePlatform1], 
            framerate: 28,
            // width, height & registration point of each sprite
            frames: {width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT, regX: 0, regY: 0}, 
            animations: {idle:[0, 7, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        var oPlatform = createSprite(oSpriteSheet, "idle", 0, 0, PLATFORM_WIDTH, PLATFORM_HEIGHT);
        oPlatform.x = CANVAS_WIDTH/2-200;
        oPlatform.y = CANVAS_HEIGHT/2-110;
        _oGroup2.addChild(oPlatform);
        
        var oDividingLine = createBitmap(s_oSpriteLibrary.getSprite('dividing_line'));
        oDividingLine.x = CANVAS_WIDTH/2-170;
        oDividingLine.y = CANVAS_HEIGHT/2-55;
        _oGroup2.addChild(oDividingLine);
        
        //******************************************************************** PLATFORM 2
        _oMsgTextPlatform2 = new createjs.Text(TEXT_PLATFORM2," 20px "+FONT, "#410701");
        _oMsgTextPlatform2.x = CANVAS_WIDTH/2+51;
        _oMsgTextPlatform2.y = (CANVAS_HEIGHT/2)-9;
        _oMsgTextPlatform2.textAlign = "center";
        _oMsgTextPlatform2.textBaseline = "alphabetic";
        _oMsgTextPlatform2.lineWidth = 200;     
        _oGroup2.addChild(_oMsgTextPlatform2);
        
        _oMsgTextPlatform2 = new createjs.Text(TEXT_PLATFORM2," 20px "+FONT, "#ffb400");
        _oMsgTextPlatform2.x = CANVAS_WIDTH/2+50;
        _oMsgTextPlatform2.y = (CANVAS_HEIGHT/2)-10;
        _oMsgTextPlatform2.textAlign = "center";
        _oMsgTextPlatform2.textBaseline = "alphabetic";
        _oMsgTextPlatform2.lineWidth = 200;     
        _oGroup2.addChild(_oMsgTextPlatform2);
        
        var oSpritePlatform2 = s_oSpriteLibrary.getSprite('platform_2');
        
        var oData = {   
            images: [oSpritePlatform2], 
            framerate: 28,
            // width, height & registration point of each sprite
            frames: {width: PLATFORM2_WIDTH, height: PLATFORM2_HEIGHT, regX: 0, regY: 0}, 
            animations: {idle:[0, 8, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        var oPlatform = createSprite(oSpriteSheet, "idle", 0, 0, PLATFORM2_WIDTH, PLATFORM2_HEIGHT);
        oPlatform.x = CANVAS_WIDTH/2-213;
        oPlatform.y = CANVAS_HEIGHT/2-50;
        _oGroup2.addChild(oPlatform);
        
        var oDividingLine = createBitmap(s_oSpriteLibrary.getSprite('dividing_line'));
        oDividingLine.x = CANVAS_WIDTH/2-170;
        oDividingLine.y = CANVAS_HEIGHT/2+5;
        _oGroup2.addChild(oDividingLine);
        //******************************************************************** PLATFORM 3
        _oMsgTextPlatform3 = new createjs.Text(TEXT_PLATFORM3," 20px "+FONT, "#410701");
        _oMsgTextPlatform3.x = CANVAS_WIDTH/2+51;
        _oMsgTextPlatform3.y = (CANVAS_HEIGHT/2)+51;
        _oMsgTextPlatform3.textAlign = "center";
        _oMsgTextPlatform3.textBaseline = "alphabetic";
        _oMsgTextPlatform3.lineWidth = 200;     
        _oGroup2.addChild(_oMsgTextPlatform3);
        
        _oMsgTextPlatform3 = new createjs.Text(TEXT_PLATFORM3," 20px "+FONT, "#ffb400");
        _oMsgTextPlatform3.x = CANVAS_WIDTH/2+50;
        _oMsgTextPlatform3.y = (CANVAS_HEIGHT/2)+50;
        _oMsgTextPlatform3.textAlign = "center";
        _oMsgTextPlatform3.textBaseline = "alphabetic";
        _oMsgTextPlatform3.lineWidth = 200;     
        _oGroup2.addChild(_oMsgTextPlatform3);
        
        var oSpritePlatform3 = s_oSpriteLibrary.getSprite('platform_3');
        
        var oData = {   
            images: [oSpritePlatform3], 
            framerate: 28,
            // width, height & registration point of each sprite
            frames: {width: PLATFORM3_WIDTH, height: PLATFORM3_HEIGHT, regX: 0, regY: 0}, 
            animations: {idle:[0, 10, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        var oPlatform = createSprite(oSpriteSheet, "idle", 0, 0, PLATFORM3_WIDTH, PLATFORM3_HEIGHT);
        oPlatform.x = CANVAS_WIDTH/2-185;
        oPlatform.y = CANVAS_HEIGHT/2+20;
        _oGroup2.addChild(oPlatform);
        
        var oDividingLine = createBitmap(s_oSpriteLibrary.getSprite('dividing_line'));
        oDividingLine.x = CANVAS_WIDTH/2-170;
        oDividingLine.y = CANVAS_HEIGHT/2+65;
        _oGroup2.addChild(oDividingLine);
        
        //******************************************************************** SPRING
        _oMsgTextSpring = new createjs.Text(TEXT_SPRING," 20px "+FONT, "#410701");
        _oMsgTextSpring.x = CANVAS_WIDTH/2+51;
        _oMsgTextSpring.y = (CANVAS_HEIGHT/2)+96;
        _oMsgTextSpring.textAlign = "center";
        _oMsgTextSpring.textBaseline = "alphabetic";
        _oMsgTextSpring.lineWidth = 200;     
        _oGroup2.addChild(_oMsgTextSpring);
        
        _oMsgTextSpring = new createjs.Text(TEXT_SPRING," 20px "+FONT, "#ffb400");
        _oMsgTextSpring.x = CANVAS_WIDTH/2+50;
        _oMsgTextSpring.y = (CANVAS_HEIGHT/2)+95;
        _oMsgTextSpring.textAlign = "center";
        _oMsgTextSpring.textBaseline = "alphabetic";
        _oMsgTextSpring.lineWidth = 200;     
        _oGroup2.addChild(_oMsgTextSpring);
        
        var oSpriteSpring = s_oSpriteLibrary.getSprite('spring');
        
        var oData = {   
            images: [oSpriteSpring], 
            framerate: 10,
            // width, height & registration point of each sprite
            frames: {width: SPRING_WIDTH, height: SPRING_HEIGHT, regX: 0, regY: 0}, 
            animations: {idle:[1, 7, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        var oSpring = createSprite(oSpriteSheet, "idle", 0, 0, SPRING_WIDTH, SPRING_HEIGHT);
        oSpring.x = CANVAS_WIDTH/2-150;
        oSpring.y = CANVAS_HEIGHT/2+83;
        _oGroup2.addChild(oSpring);
        
        var oDividingLine = createBitmap(s_oSpriteLibrary.getSprite('dividing_line'));
        oDividingLine.x = CANVAS_WIDTH/2-170;
        oDividingLine.y = CANVAS_HEIGHT/2+125;
        _oGroup2.addChild(oDividingLine);
        
        //******************************************************************** COIN
        _oMsgTextCoin = new createjs.Text(TEXT_COIN," 20px "+FONT, "#410701");
        _oMsgTextCoin.x = CANVAS_WIDTH/2+51;
        _oMsgTextCoin.y = (CANVAS_HEIGHT/2)+168;
        _oMsgTextCoin.textAlign = "center";
        _oMsgTextCoin.textBaseline = "alphabetic";
        _oMsgTextCoin.lineWidth = 200;     
        _oGroup2.addChild(_oMsgTextCoin);
        
        _oMsgTextCoin = new createjs.Text(TEXT_COIN," 20px "+FONT, "#ffb400");
        _oMsgTextCoin.x = CANVAS_WIDTH/2+50;
        _oMsgTextCoin.y = (CANVAS_HEIGHT/2)+167;
        _oMsgTextCoin.textAlign = "center";
        _oMsgTextCoin.textBaseline = "alphabetic";
        _oMsgTextCoin.lineWidth = 200;     
        _oGroup2.addChild(_oMsgTextCoin);
        
        var oSpriteCoin = s_oSpriteLibrary.getSprite('coin');
        var oData = {   
            images: [oSpriteCoin], 
            framerate: 30,
            // width, height & registration point of each sprite
            frames: {width: COIN_WIDTH, height: COIN_HEIGHT, regX: 0, regY: 0}, 
            animations: {idle:[0, 19, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        var _oBonus = createSprite(oSpriteSheet, "idle", 0, 0, COIN_WIDTH, COIN_HEIGHT);
        _oBonus.x = CANVAS_WIDTH/2-145;
        _oBonus.y = CANVAS_HEIGHT/2+145;
        _oGroup2.addChild(_oBonus);
        
        var oDividingLine = createBitmap(s_oSpriteLibrary.getSprite('dividing_line'));
        oDividingLine.x = CANVAS_WIDTH/2-170;
        oDividingLine.y = CANVAS_HEIGHT/2+185;
        _oGroup2.addChild(oDividingLine);
        //******************************************************************** WINGS
        _oMsgTextCoin = new createjs.Text(TEXT_WINGS," 20px "+FONT, "#410701");
        _oMsgTextCoin.x = CANVAS_WIDTH/2+51;
        _oMsgTextCoin.y = (CANVAS_HEIGHT/2)+221;
        _oMsgTextCoin.textAlign = "center";
        _oMsgTextCoin.textBaseline = "alphabetic";
        _oMsgTextCoin.lineWidth = 200;     
        _oGroup2.addChild(_oMsgTextCoin);
        
        _oMsgTextCoin = new createjs.Text(TEXT_WINGS," 20px "+FONT, "#ffb400");
        _oMsgTextCoin.x = CANVAS_WIDTH/2+50;
        _oMsgTextCoin.y = (CANVAS_HEIGHT/2)+220;
        _oMsgTextCoin.textAlign = "center";
        _oMsgTextCoin.textBaseline = "alphabetic";
        _oMsgTextCoin.lineWidth = 200;     
        _oGroup2.addChild(_oMsgTextCoin);
        
        var oSpriteCoin = s_oSpriteLibrary.getSprite('wings');
        var oData = {   
            images: [oSpriteCoin], 
            framerate: 28,
            // width, height & registration point of each sprite
            frames: {width: WINGS_WIDTH, height: WINGS_HEIGHT, regX: 0, regY: 0}, 
            animations: {idle:[0, 23, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        var _oBonus = createSprite(oSpriteSheet, "idle", 0, 0, WINGS_WIDTH, WINGS_HEIGHT);
        _oBonus.x = CANVAS_WIDTH/2-195;
        _oBonus.y = CANVAS_HEIGHT/2+175;
        _oGroup2.addChild(_oBonus);
       
        //***************************************************************** OTHER THINGS
        s_oStage.addChild(_oGroup2);
        
        _oArrowLeft = createBitmap(s_oSpriteLibrary.getSprite('but_skip'));
        _oArrowLeft.x = CANVAS_WIDTH/2-200;
        _oArrowLeft.y = CANVAS_HEIGHT/2+270;
        _oArrowLeft.regX = 30;
        _oArrowLeft.regY = 43;
        _oArrowLeft.scaleX = -1;
        s_oStage.addChild(_oArrowLeft);
        
        _oArrowRight = createBitmap(s_oSpriteLibrary.getSprite('but_skip'));
        _oArrowRight.x = CANVAS_WIDTH/2+200;
        _oArrowRight.y = CANVAS_HEIGHT/2+270;
        _oArrowRight.regX = 30;
        _oArrowRight.regY = 43;
        s_oStage.addChild(_oArrowRight);
        
        _oButPlay = createBitmap(s_oSpriteLibrary.getSprite('but_next'));
        _oButPlay.x = CANVAS_WIDTH/2-45;
        _oButPlay.y = CANVAS_HEIGHT/2+250;
        s_oStage.addChild(_oButPlay);
        
        _oArrowLeft.alpha = 0;
        _oArrowRight.alpha= 1;
        this.show();
    };
    
    this.moveCursorRightDesktop = function(oSprite){
        var oParent = this;
        createjs.Tween.get(oSprite).to({x: CANVAS_WIDTH/2+70 }, 1000).call(function() {
            oParent.moveCursorLeftDesktop(oSprite);
        });
    }
    
    this.moveCursorLeftDesktop = function(oSprite){
        var oParent = this;
        createjs.Tween.get(oSprite).to({x: CANVAS_WIDTH/2-80 }, 1000).call(function() {
            oParent.moveCursorRightDesktop(oSprite);
        });
    }
    
    this.moveCursorRight = function(oSprite){
        var oParent = this;
        createjs.Tween.get(oSprite).to({x: CANVAS_WIDTH/2 }, 1000).call(function() {
            oParent.moveCursorLeft(oSprite);
        });
    }
    
    this.moveCursorLeft = function(oSprite){
        var oParent = this;
        createjs.Tween.get(oSprite).to({x: CANVAS_WIDTH/2-55 }, 1000).call(function() {
            oParent.moveCursorRight(oSprite);
        });
    }
    
    this._initListener = function(){
        _oArrowLeft.addEventListener("click",this._previousPage);
        _oArrowRight.addEventListener("click",this._nextPage);
        _oButPlay.addEventListener("click",this._onExit);
    };
    
    this._previousPage = function(){
        playSound("press_button",1,0);
        createjs.Tween.get(_oGroup1).to({alpha:1 }, 1000).call(function() {});
        createjs.Tween.get(_oGroup2).to({alpha:0 }, 500).call(function() { });
        createjs.Tween.get(_oArrowRight).to({alpha:1 }, 1000).call(function() {});
        createjs.Tween.get(_oArrowLeft).to({alpha:0 }, 500).call(function() {});
    };
    
    this._nextPage = function(){
        playSound("press_button",1,0);
        createjs.Tween.get(_oGroup1).to({alpha:0 }, 500).call(function() {});
        createjs.Tween.get(_oGroup2).to({alpha:1 }, 1000).call(function() {});
        createjs.Tween.get(_oArrowRight).to({alpha:0 }, 500).call(function() {});
        createjs.Tween.get(_oArrowLeft).to({alpha:1 }, 1000).call(function() {});
    };
    
    this.show = function(){
        
        createjs.Tween.get(_oGroup1).to({alpha:1 }, 500).call(function() {_oParent._initListener();});
    };
    
    this._onExit = function(){
        playSound("press_button",1,0);
        _oParent.unload();
        s_oMain.gotoGame();
    };
    
    this.unload = function(){
        _oArrowLeft.removeAllEventListeners ("click");
        _oArrowRight.removeAllEventListeners ("click");
        
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
        
    };
    
    this._init();
    
    return this;
}
