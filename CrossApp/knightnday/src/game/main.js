BasicGame.Boot = function (game) {
};


BasicGame.Boot.prototype = {

    preload: function () {
        if (global.webFontArr != undefined && global.webFontArr.length > 0) {
            game.load.script('webfont', './webfont.js');
        } 
        game.load.enableParallel = true;
        game.load.useXDomainRequest = true;
        /*if (this.isCorrectOrientation() == false)
            return;*/

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        Asset.atlaspng("global");
        csound.start();
        Asset.png('loading_bar');
    },

    isCorrectOrientation: function() {

        if (Phaser.Device.desktop || global.forceWidth)
            return true;

        if (window.innerWidth > window.innerHeight && global.landscape == false) {
            return false
        } else if (window.innerWidth < window.innerHeight && global.landscape == true) {
            return false
        }

        return true;
    },

    create: function () {
       /* if (this.isCorrectOrientation() == false)
           return;*/
        Branding.init();
        csound.init();
        global.phaserDevice = Phaser.Device;
        
        global.localization.language = game_config.lang;
        global.localization.oldLanguage = "en";
        global.localization.json = game_language;

	    this.input.maxPointers = 1;
        global.scaleStage = this.scaleStage;
        //global.onResize = this.onResize;
        this.stage.disableVisibilityChange = false;

        //helper.constraintResponsive();

        global.scaleStage();
        
        this.onResize2CallCounter = 0;
        this.onSizeChangeCallCounter = 0;
        //if (global.astrid && global.forceWidth == false) {
            game.scale.setResizeCallback(this.onResize2, this)
            game.scale.onSizeChange.add(this.onSizeChange, this)
       // }


       
        // create singleton
        // this.btnSound = new csound(this.game, 100,100);
        // trace("BTNSOUND",this.btnSound);

        //this.state.start('Preloader');
    },

    update: function(){
        if (this.scaleReady == 1) {
            this.scaleReady = 2;
            this.state.start('Preloader');
        }
    },

    onResize2:function(scale, parentBounds) {
        if (Branding)
            if (Branding.isCorrectOrientation == false)
                return;

        this.onResize2CallCounter++;
        if (this.onResize2CallCounter >= 400) {
            //this.onResize2CallCounter = 1;
        }
       // if (this.onResize2CallCounter > 1 && helper.isInIFrameIos) 
       //     return

        this.onResize2CallCounter++;

        if (global.skeletonMode)
          console.log("@boot ----------------------------->>>>>>>>>>> onResize2 inner " + global.deviceWidth + "-" + global.deviceHeight 
           +", game.scale.w/h : "+ scale.width + " - " + game.scale.height 
            + ", game.w/h : " + game.width + "-" + game.height
            + ", scaleFactor x/y " + scale.scaleFactor.x + "-" + game.scale.scaleFactor.y
            + ", old inner w/h " + MyScaleManager.oldInnerW
            + "-" + MyScaleManager.oldInnerH
        )

       if (MyScaleManager.oldInnerW == global.deviceWidth && MyScaleManager.oldInnerH == global.deviceHeight) {
            return
        } 
        MyScaleManager.oldInnerH = global.deviceHeight
        MyScaleManager.oldInnerW = global.deviceWidth

        
       MyScaleManager.setNoBorder2();
    },

    onSizeChange:function(scale, parentBounds) {
        if (Branding)
            if (Branding.isCorrectOrientation == false)
                return;

        this.onSizeChangeCallCounter++;
        if (this.onSizeChangeCallCounter >= 400) {
            //this.onSizeChangeCallCounter = 1;
        }
       // if (this.onSizeChangeCallCounter > 1 && helper.isInIFrameIos) 
       //    return


      if (global.skeletonMode) 
          console.log("@boot ***********************>>> onSizeChange ------- inner " + global.deviceWidth + "-" + global.deviceHeight 
           +", game.scale.w/h : "+ game.scale.width + " - " + game.scale.height 
            + ", game.w/h : " + game.width + "-" + game.height
            + ", scaleFactor x/y " + scale.scaleFactor.x + "-" + game.scale.scaleFactor.y
            + ", game.scale.game.canvas.style.marginLeft/top " + game.canvas.style.marginLeft 
            + "-" + game.canvas.style.marginTop
           )
      MyScaleManager.onSizeChange();
      this.scaleReady = 1;
    },
    
    scaleStage:function(){

        game.scale.setMinMax(BasicGame.gameWidth/30, BasicGame.gameHeight/30, BasicGame.gameWidth*2, BasicGame.gameWidth*2)
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        // hack debug
        if (
            (Phaser.Device.desktop == true && (global.astrid == false && global.simulatedMobile == false)) 
            || (Phaser.Device.desktop == true && (global.astrid == true && global.landscape == false)) 
            || (global.forceWidth)
        )
        {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; 
            //game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT; 
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
            //game.scale.setShowAll();
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVeritcally = true;
            game.scale.refresh();
            if (global.skeletonMode) 
                console.log("SET SCALE MODE TO SHOW_ALL")
        }
        else
        {
            if (global.skeletonMode) 
                console.log("ENTUT @boot.scaleStage scale.min : " + game.scale.minWidth + " - " + game.scale.minHeight
                    + ", scale.max : " + game.scale.maxWidth + "-" + game.scale.maxHeight
                    + ", scale.w/h : " + game.scale.width  + "-" + game.scale.height
                )              

            console.log("------------------------------> Platform name : " + platform.name)  
            game.scale.pageAlignHorizontally = false;
            game.scale.pageAlignVertically = false;
            game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE

            if (global.respMode == undefined || global.respMode == 0) {
                //console.log("@@@@@@@@@@@@ KUCING MIBER")
                if (global.landscape == true)
                    game.scale.forceOrientation(true, false);
                else 
                    game.scale.forceOrientation(false, true);
            }

            MyScaleManager.setNoBorder();
            //MyScaleManager.setScreenSize(true);
            //MyScaleManager.onSizeChange();

            // console.log("#1 scale.min : " + game.scale.minWidth + " - " + game.scale.minHeight
            // + ", scale.max : " + game.scale.maxWidth + "-" + game.scale.maxHeight
            // + ", scale.w/h : " + game.scale.width  + "-" + game.scale.height
            //  )
        }
        

        // console.log("#2 scale.min : " + game.scale.minWidth + " - " + game.scale.minHeight
        //     + ", scale.max : " + game.scale.maxWidth + "-" + game.scale.maxHeight
        //     + ", scale.w/h : " + game.scale.width  + "-" + game.scale.height
        // )
        
        
       // document.getElementById("game").style.width = global.deviceWidth+"px";
       // document.getElementById("game").style.height = global.deviceHeight-1+"px";//The css for body includes 1px top margin, I believe this is the cause for this -1
       // document.getElementById("game").style.overflow = "hidden";

        // console.log("scale.min : " + game.scale.minWidth + " - " + game.scale.minHeight
        //     + ", scale.max : " + game.scale.maxWidth + "-" + game.scale.maxHeight
        //     + ", scale.w/h : " + game.scale.width  + "-" + game.scale.height
        //     + ", viewWidth/height : " + BasicGame.viewWidth + "-" + BasicGame.viewHeight
        // )

    },

    gameResized: function (width, height) {

        //  This could be handy if you need to do any extra processing if the game resizes.
        //  A resize could happen if for example swapping orientation on a device.
        //console.log("gameResized event : scale.width/height " + this.scale.width + " - " + this.scale.height)
        //this.scaleStage();
    },

    enterIncorrectOrientation: function () {
        //console.log("incorrect")
        BasicGame.orientated = false;
        //if (Phaser.Device.desktop == false)
        //    document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function () {
        BasicGame.orientated = true;
        //document.getElementById('orientation').style.display = 'none';
        //this.scaleStage();
       //= console.log("correct")
    }

};



window.addEventListener("load", function() {

    // Phaser.Device.whenReady(function() {
        helper.init();

        global.logicWidth = 640;
        global.logicHeight = 1020;
        global.landscape = false;
        global.simulatedMobile = false;
        global.forceWidth =  false;
        global.astrid = true;
        global.webFontArr = [game_config.font1+"::latin", game_config.font2+"::latin"]
        global.skeletonMode = false;
        // global.webFontArr = ["Revalia::latin", "Alegreya Sans::latin"]

        window.createPhaser = function() {
            //By default we set 
            // device canvas size 
            //  Add the States your game has.
            //  You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
            game.state.add('Boot', BasicGame.Boot);
            game.state.add('Preloader', BasicGame.Preloader);
            game.state.add('cmainmenu', cmainmenu);
            game.state.add('cstage', cstage);
            game.state.add('cgame', cgame);
            game.state.add('cupgrade', cupgrade);
            //  Now start the Boot state.
            game.state.start('Boot');
        }

        helper.initOnLoad();
    // });
});
