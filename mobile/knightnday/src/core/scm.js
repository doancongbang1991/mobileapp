function isRetina(){
    
    var b =  ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 2)) && /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

   // alert("isretina : " + b )
    return b;
}


 // ----------------------------------------------------------------------------------------------
 // DYNAMICALLY CHANGE VIEWPORT FOR SPECIFIC PLATFORM FIX
 // ----------------------------------------------------------------------------------------------
var mvp = document.getElementById('vpr');

if (mvp == null || mvp == undefined) {
    mvp = document.querySelector("meta[name=viewport]");
}

if (mvp == null || mvp == undefined) {
}
 
mvp.parentNode.removeChild(mvp);

viewport = document.createElement('meta');
viewport.name = 'viewport';

var content = "initial-scale=1.0, maximum-scale=1.01, minimum-scale=1.0, user-scalable=no,width=device-width, minimal-ui";

if (platform.name == "IE Mobile") {
   content = 'initial-scale=0.9, maximum-scale=0.9, minimum-scale=0.9, user-scalable=no,width=device-width,minimal-ui';
} 
// fix for android 4 stock browser
else if (platform.os.family == "Android" && platform.name == "Android Browser" && parseInt(platform.os.version,10) < 5){
    content = "initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no,width=device-width, minimal-ui";
    // content = 'width=device-width';
}

viewport.content = content;
document.head.appendChild(viewport);

// ----------------------------------------------------------------------------------------------
window.addEventListener("load", function() {
    function onTouchPreventDefault(event) { event.preventDefault(); };
        document.addEventListener("touchmove", onTouchPreventDefault, false);
        document.addEventListener("touchstart", onTouchPreventDefault, false);
    
}, false);
BasicGame = {
    score: 0,
    music: null,
    orientated: false
};

window.helper = {}
helper.init = function() {
    //global.printObj(platform)
    var ua = navigator.userAgent;
    var bAndroid = boolean = (/Android/.test(ua));
    var bChrome= boolean = (/Chrome/.test(ua));
    var bXiaomi = boolean = (/XiaoMi/.test(ua));
    if (bXiaomi) {
        helper.phaserMode = Phaser.CANVAS;
    }
    else if (platform.os.family == "Windows Phone" && platform.name == "IE Mobile") {
        helper.phaserMode = Phaser.CANVAS;
    } else if (bAndroid && !bChrome ) {
        helper.phaserMode = Phaser.CANVAS;
    } else {
        // helper.phaserMode = Phaser.AUTO;
        helper.phaserMode = Phaser.CANVAS;
    }
}


helper.preCreatePhaser = function() {
        global.webFontReady = false;
        if (global.webFontArr == undefined || global.webFontArr == null) {
            global.webFontReady = true;
        }
        //  The Google WebFont Loader will look for this object, so create it before loading the script.
        WebFontConfig = {
            
            active: function() { 
                setTimeout(function() {
                    global.webFontReady = true;
                }, 1000);
            },

            //  The Google Fonts we want to load (specify as many as you like in the array)
            google: {
              families: global.webFontArr
            }
        };

        
        global.deviceWidth = window.innerWidth;
        global.deviceHeight = window.innerHeight;
        deviceSizeCheckIntervalID = setInterval(deviceSizeCheck, 1);

        BasicGame.logicWidth = global.logicWidth;
        BasicGame.logicHeight = global.logicHeight;

        window.regainIncorrectOrientation = true;

        global.processScaling();
        
        window.game = null;
            console.log("pre createPhaser");

        Phaser.Device.onInitialized.add(function() {
            console.log("INITIALISESSDES");
            if (global.forceWidth || (global.astrid && global.landscape == false && Phaser.Device.desktop)) {
                window.addEventListener("resize", auto_resize_area, false);
                auto_resize_area();
                auto_resize_area_id = setInterval(initOnce, 3000);
                setInterval(auto_resize_area, 1000);
            } else if (global.simulatedMobile == true) {
                window.addEventListener("resize", init_refresh_page, false);
            } 

            if (global.astrid == true) {
                // if responsive mode
                if (Phaser.Device.desktop && global.landscape == true){
                    window.regainIncorrectOrientation = true;
                    //window.addEventListener("resize", resizeResponsive, false); 
                } else if (Phaser.Device.desktop == false) {
                    window.addEventListener("resize", init_refresh_page, false);
                }
                //document.getElementById('game').style.width =   (window.innerWidth-2) + 'px';
                //document.getElementById('game').style.height =  (window.innerHeight-2) + 'px';
                auto_refresh_page_id2 = setInterval(auto_refresh_page, 1000);
                if (Phaser.Device.desktop == true) {
                    document.getElementById('main-game').style.overflow = "hidden";
                }
            }
            
            window.addEventListener('orientationchange', orientationchange);
            window.addEventListener("resize", orientationchange, false);
            // (optional) Android doesn't always fire orientationChange on 180 degree turns
            setInterval(orientationchange, 1000);
            setInterval(forceScroll, 20);
        });

        window.game = new Phaser.Game(BasicGame.gameWidth,BasicGame.gameHeight, helper.phaserMode, window.brimCanvasElement);


        window.createPhaser();


      /*  if (
            (platform.os.family == 'iOS' && parseInt(platform.os.version, 10) >= 8)
            && (platform.name == "Safari")
            && ("standalone" in window.navigator) && !window.navigator.standalone
            && isRetina()
         ) {
            Phaser.DOM.getOffset = function (element, point) {

                    point = point || new Phaser.Point();

                    var box = element.getBoundingClientRect();

                    var scrollTop = Phaser.DOM.scrollY;
                    var scrollLeft = Phaser.DOM.scrollX;
                    var clientTop = document.documentElement.clientTop;
                    var clientLeft = document.documentElement.clientLeft;

                    point.x = box.left + scrollLeft - clientLeft;
                    point.y = box.top + scrollTop - clientTop;

                    point.x = Math.floor(point.x / 2);
                    point.y = Math.floor(point.y / 2);
                    return point;
            }
        }*/

}

// ====================================================================================================
// init var and functions right after window.onLoad event
helper.initOnLoad = function() {
    var scream;
    var brim;
    
    //IS ALREAD LOADED
    var firstTime = true;
    
    //APPEND CANVAS TO THIS ELEMENT
    var brimCanvasElement = 'game';
    
    //SET BASE SIZE
    var width = 640;
    var height = 960;

      //CHECK FOR IOS8 AND IF ITS NOT IN STANDALONE MODE
     /*if (
        (platform.os.family == 'iOS' && parseInt(platform.os.version, 10) > 8  || platform.ua.indexOf('like Mac OS X') != -1)
        && ("standalone" in window.navigator) &&!window.navigator.standalone
        && !global.landscape
        && 1 == 0
     ) 
     {
        scream = gajus.Scream({
            width: {
                portrait: 640,
                landscape: 1144
            }
        });
         
        brim = gajus.Brim({
            viewport: scream
        });
         
        //YOU ARE ON IOS SET FULL SCREEN SIZE 
        height = scream.getViewportHeight();
        width = scream.getViewportWidth();
 
        brim.on('viewchange', function (e) {
            document.body.className = e.viewName;
            
            //WRONG ORIENTATION SHOW IMAGE
            if(scream.getOrientation() == "landscape")
            {
                 //document.getElementById('orientation').style.display = 'block';
            }

            //alert("entut " + e.viewName)
            if(e.viewName != "minimal")
            {
                document.getElementById('brim-mask').style.display = 'block';
            }
            
            if(firstTime && e.viewName=="minimal")
            {
                //DO ONLY ONCE AT STARTUP
                firstTime = false;
                //SET THE RIGHT DOM ELEMENT
                
                window.brimCanvasElement = 'brim-main';
                //CREATE PHASER CANVAS
                helper.preCreatePhaser();
            };
        });

    } 
    else 
    {   */
        //ITS NOT IOS START STANDARD
        if(firstTime)
        {
            //alert("flag b")
            //DO ONLY ONCE AT STARTUP
            firstTime = false;
            //SET THE RIGHT DOM ELEMENT
            document.querySelector('#game').style.display = 'block';
            window.brimCanvasElement = 'game';
            //CREATE PHASER CANVAS
            helper.preCreatePhaser();
        }
    
}

// ====================================================================================================
// Generic vars and functions definitions

var temp_scroll_x = 10;
function forceScroll() {
    if (Phaser.Device.desktop || game.canvas == null || game.canvas == undefined || document.getElementById('game') == undefined || document.getElementById('game') == null) {
        return;
    }
    
    //window.scrollTo(8 , 8);
    //window.scrollTo(temp_scroll_x, temp_scroll_x);
    //document.getElementById('game').style.marginTop = (parseInt(document.getElementById('game').style.marginTop, 10)+temp_scroll_x) + 'px';
    //document.getElementById('orientation').style.display = 'block';
    if (temp_scroll_x == 10) {
        temp_scroll_x = -10;
        document.getElementById('orientation').innerHTML = '.';
        //document.getElementById('game').style.fontSize = "xx-small";
        //game.scale.setupScale(0.99, 0.99)
        //document.getElementById('game').style.width =   (window.innerWidth+10) + 'px';
        //document.getElementById('game').style.height =  (window.innerHeight+10) + 'px';
    } else {
        temp_scroll_x = 10;
        document.getElementById('orientation').innerHTML = '..';
        //document.getElementById('game').style.fontSize = "xx-large";
        //game.scale.setupScale(0.98, 0.98)
        //document.getElementById('game').style.width =   (window.innerWidth-10) + 'px';
    //document.getElementById('game').style.height =  (window.innerHeight-10) + 'px';
    }
    //window.scrollTo(temp_scroll_x, temp_scroll_x);
    //alert("aaa")
     //document.getElementById('game').style.height = (window.innerHeight+100) +"px";
    // document.getElementById('keple').style.height = (window.innerHeight+100) +"px";
    //game.canvas.style.marginTop = (parseInt(game.canvas.style.marginTop, 10)+temp_scroll_x) + "px"
    //var gl = game.canvas.getContext("experimental-webgl");
    //console.log(context);
    //gl.clearColor(1.0, 0.0, 0.0, 1.0);
    
    //orientation
    
    //game.scale.setShowAll();
    //game.scale.refresh();
}

helper.constraintResponsive = function() {
    if (window.deviceSizeCheckIntervalID)
        clearInterval(window.deviceSizeCheckIntervalID);

   /* if (window.innerWidth < 520) {
        global.deviceWidth = 520
    }
    if (window.innerHeight < 350) {
        global.deviceHeight = 350
    }*/

    //global.scaleStage();
    window.deviceSizeCheckIntervalID = setInterval(window.deviceSizeCheck, 1);
}
function resizeResponsive() {
    if (!game)
        return;

    if (!game.scale)
        return;

    if (!global.scaleStage)
        return;

    //helper.constraintResponsive();

    document.getElementById('game').style.width =   (window.innerWidth) + 'px';
    document.getElementById('game').style.height =  (window.innerHeight-2) + 'px';

    /*var curState = game.state.getCurrentState()
    if (curState.onResize){
        curState.onResize();
    }*/
   // deviceSizeCheckIntervalID = setInterval(deviceSizeCheck, 1);
}

function auto_resize_area() {
    var default_aspect_ratio = true;
            
    // PLEASE ENTER YOUR DEFAULT GAME'S SIZE
    //var original_width = window.innerWidth; var original_height = window.innerHeight;
    var original_width = game.width; var original_height = game.height;

    //var original_width = window.innerWidth; var original_height = window.innerHeight;
    

    var optimal_aspect_ratio = original_width / original_height; 
    var device_aspect_ratio = window.innerWidth  / window.innerHeight;
    var optimal_width = window.innerWidth; var optimal_height = window.innerHeight;
    
    if (default_aspect_ratio == true) {
        if (device_aspect_ratio > optimal_aspect_ratio) 
            optimal_width = window.innerHeight * optimal_aspect_ratio;
         else 
            optimal_height = window.innerWidth / optimal_aspect_ratio;
    } else {
        optimal_width = window.innerHeight / optimal_aspect_ratio;
        optimal_height = window.innerWidth * optimal_aspect_ratio;
    }

    if (Phaser.Device.desktop) {
        document.getElementById('game').style.width =   (window.innerWidth) + 'px';
        document.getElementById('game').style.height =  (window.innerHeight-1) + 'px';
    } else {
        document.getElementById('game').style.width =   (window.innerWidth) + 'px';
        document.getElementById('game').style.height =  (window.innerHeight+2) + 'px';
    }

    //document.documentElement.requestFullscreen();
    //document.getElementById('keple').style.width =   optimal_width + 'px';
    //document.getElementById('keple').style.height =  optimal_height + 'px';
    //window.scrollTo(0, 0);
    //alert("a")
    if (game.canvas) {
        game.canvas.style.width =   optimal_width + 'px';
        game.canvas.style.height =  optimal_height + 'px';
        document.getElementById('orientation').style.width = window.innerWidth + 'px';
        document.getElementById('orientation').style.height = window.innerHeight + 'px';
        game.canvas.style.marginLeft =    'auto';
        game.canvas.style.marginRight =    'auto';
    }

     //game.width = optimal_width;
     //game.height = optimal_height;
    // game.stage.bounds.width = width;
    // game.stage.bounds.height = height;
        
     if (game.renderType === Phaser.WEBGL)
     {
        //game.renderer.resize(optimal_width, optimal_height);
     }

     // console.log("AUTO RESIZE : window.innerWidth " + window.innerWidth + " - height : " + window.innerHeight
     //     + " - optimal_width : " + optimal_width + " - optimal_height : " + optimal_height
     //     + " - scale.w/h : " + game.scale.width + "-"+ game.scale.height
     // )
    init_refresh_page();
    
}

var oldInnerWidth = window.innerWidth;
var oldInnerHeight = window.innerHeight;
global.hasOrientationChanged = false;

var auto_refresh_page_id = -1;
var auto_refresh_page_id2 = -1;
global.forceReloadFlag = false;
function init_refresh_page () {
    // body...
    auto_refresh_page_id = setTimeout(auto_refresh_page, 1500);
}

function get_current_ori () {
    var currentOrientation = ""

    if (window.innerWidth > window.innerHeight) {
        return "landscape"
    } else {
        return "portrait"
    }
}

function auto_refresh_page() {
    if (Phaser.Device.desktop == true)
        return;
    
    var newInnerWidth = window.innerWidth;
    var newInnerHeight = window.innerHeight;
    var dw = Math.abs(oldInnerWidth - newInnerWidth);
    var dh = Math.abs(oldInnerHeight - newInnerHeight);

    global.dw = dw;
    global.dh = dh;
    //if (window.orientation == global.orientationKampret)
    //if ((window.orientation == 0 && global.landscape == true) || (window.orientation == Math.abs(90) && global.landscape == false))
    //if (global.hasOrientationChanged == false) 

    var currentOrientation = get_current_ori();

    // alert("cur " + currentOrientation + "; landscape " + global.landscape +"; isDesktop " + Phaser.Device.desktop 
    //      + "; force " + global.forceReloadFlag + "; dw/dh " + dw + "|" + dh
    //  )
    if ((
        (((currentOrientation == "portrait" && global.landscape == false) || (currentOrientation == "landscape" && global.landscape == true))
            )
        && (global.hasOrientationChanged)
    ) || (

        (((currentOrientation == "portrait" && global.landscape == false) || (currentOrientation == "landscape" && global.landscape == true))
            ) &&
        (global.forceReloadFlag == true)
      )
    )
    {
        //alert ("dw/dh : " + dw + "-" + dh + "; currentOrientation : " + currentOrientation + ";global.hasOrientationChanged : " + global.hasOrientationChanged)
        // console.log("ForceReloadFlag : " + global.forceReloadFlag 
        //  + ";dw/dh : " + dw + "-" + dh + "; orientation : " + window.orientation
        //  )
        
        /*
        alert("cur " + currentOrientation + "; landscape " + global.landscape +"; isDesktop " + Phaser.Device.desktop 
            + "; force " + global.forceReloadFlag + "; dw/dh " + dw + "|" + dh
        )
        */

        //document.getElementById('orientation').style.backgroundImage = "url('images/oritext.jpg')";
        //document.getElementById('orientation').innerHTML = 'Loading';
        //alert(document.getElementById('orientation').innerHTML)
        //alert("flag a")
        if (global.forceWidth == false && global.forceReloadFlag == true) {
            clearInterval(auto_refresh_page_id);
            clearInterval(auto_refresh_page_id2);
            location.reload();
            //alert("flag b")
        } else {
            console.log("CORRECT ORI")
            //alert("correct ori")
            document.getElementById('orientation').style.display = 'none';
        }
    }

    // alert("cur " + currentOrientation + "; landscape " + global.landscape +"; isDesktop " + Phaser.Device.desktop 
    //      + "; force " + global.forceReloadFlag + "; dw/dh " + dw + "|" + dh
    //  )

    if ((global.hasOrientationChanged && currentOrientation == "landscape" && global.landscape == true) 
        || (global.hasOrientationChanged && currentOrientation == "portrait" && global.landscape == false)
    ) {
        global.hasOrientationChanged = false;
    }

    if ((currentOrientation == "portrait" && global.landscape == false) || (currentOrientation == "landscape" && global.landscape == true)) {
        // alert("updating old size with the new one : oldSize : "  + oldInnerWidth + "/" + oldInnerHeight 
        //  + "; newSize : " + newInnerWidth + "/" + newInnerHeight)
        oldInnerWidth = newInnerWidth;
        oldInnerHeight = newInnerHeight

        //document.getElementById('orientation').style.display = 'none';
    }
    
    if ((currentOrientation == "portrait" && global.landscape == true) || (currentOrientation == "landscape" && global.landscape == false)) {
        // document.getElementById('orientation').style.display = 'block';
    }
}

function initOnce() {
    document.body.style.backgroundImage="url('assets/tile.png')";

    auto_resize_area();
    clearInterval(auto_resize_area_id)
}

var previousOrientation = get_current_ori();
function orientationchange() {
     var curOri = get_current_ori();
    if(curOri !== previousOrientation){
        previousOrientation = curOri;
        global.hasOrientationChanged = true;
        //alert("CHANGEEEDDD")
    }
}

var deviceSizeCheckIntervalID;
function deviceSizeCheck() {
    //var t = get_current_ori();
    //if ( (t == "portrait" && global.landscape == false) || (t == "landscape" && global.landscape == true)) {
        global.deviceWidth = window.innerWidth;
        global.deviceHeight = window.innerHeight;
    //}
}
























/**Injecting no border code for Phaser.ScaleManager*/


MyScaleManager = {};
//MyScaleManager.NO_BORDER = 3;
MyScaleManager.oldInnerW = -777
MyScaleManager.oldInnerH = -777

MyScaleManager.oldRatio = -777
MyScaleManager.setScreenSize = function (force) {
        if (typeof force == 'undefined')
        {
            force = true;
        }
        //window.scrollTo(0, 1);
        if (game.device.iPad === false && game.device.webApp === false && game.device.desktop === false)
        {
            if (game.device.android && game.device.chrome === false)
            {
                window.scrollTo(0, 1);
            }
            else
            {
                window.scrollTo(0, 0);
            }
        }

        if (global.forceWidth == true || (Phaser.Device.desktop == true && global.astrid == true && global.landscape == false)){
            //game.scale._iterations--;
        }


        // console.log("flag 22b force : " + force + " - global.deviceHeight : " + global.deviceHeight 
        //          + " - startHeight : " + game.scale._startHeight
        //          + " - game.scale._iterations : " + game.scale._iterations
        //     )

        if (    force )
        {
            //  console.log("flag b force : " + force + " - global.deviceHeight : " + global.deviceHeight 
            //      + " - startHeight : " + game.scale._startHeight
            //      + " - game.scale._iterations : " + game.scale._iterations
            // )
           
            if (
                (game.scale.incorrectOrientation === true && Phaser.Device.desktop === false)
                || (window.regainIncorrectOrientation == undefined && Phaser.Device.desktop === true && game.scale.incorrectOrientation === true)
            )
            {
                //game.scale.setMaximum();
            }
            else if (!game.scale.isFullScreen)
            {
                MyScaleManager.setNoBorder();//Don't call setSize
                //clearInterval(game.scale._check);
                //game.scale._check = null;
                return;
            }
            else
            {
                MyScaleManager.setNoBorder();//Don't call setSize
                //clearInterval(game.scale._check);
                //game.scale._check = null;
                return;
            }

           /* game.scale.setSize();
            clearInterval(game.scale._check);
            game.scale._check = null;*/
        }

}

MyScaleManager.setNoBorder = function(){
        //game.scale.setShowAll();
        //console.log("setNoBorder game.scale.w/h : "+ game.scale.width + " - " + game.scale.height)
        this.ow = parseInt(game.scale.width,10);
        this.oh = parseInt(game.scale.height,10);
        this.ratio = Math.max(global.deviceWidth/this.ow,global.deviceHeight/this.oh);
        game.scale.setUserScale(this.ratio, this.ratio, 0, 0)

        //game.scale.width = ow*r;
        //game.scale.height = oh*r;

        this.ow *= this.ratio;
        this.oh *= this.ratio

        this.reverseRatio = BasicGame.gameHeight/this.oh;
        if (global.skeletonMode) 
         console.log("@smanager.setNoBorder ow/h: " + this.ow + "-" + this.oh + ", inner " + global.deviceWidth + "-" + global.deviceHeight 
            + ", r : " + this.ratio + ", game.scale.w/h : "+ game.scale.width + " - " + game.scale.height)
}

MyScaleManager.setNoBorder2 = function(){
        //game.scale.setShowAll();
        //console.log("setNoBorder game.scale.w/h : "+ game.scale.width + " - " + game.scale.height)
        this.ow = parseInt(game.width,10);
        this.oh = parseInt(game.height,10);

        var tempRatio = Math.max(global.deviceWidth/this.ow,global.deviceHeight/this.oh);
       /* console.log("setNoBorder2 PRE ow/h: " + this.ow + "-" + this.oh + ", inner " + global.deviceWidth + "-" + global.deviceHeight 
            + ", r : " + this.ratio + ", game.scale.w/h : "+ game.scale.width + " - " + game.scale.height
            + ", tempRatio " + tempRatio
        )*/

        this.ratio = tempRatio;

        game.scale.setUserScale(this.ratio, this.ratio, 0, 0)

        //game.scale.width = ow*r;
        //game.scale.height = oh*r;

        this.ow *= this.ratio;
        this.oh *= this.ratio

        //this.reverseRatio = BasicGame.gameHeight/this.oh;
        this.reverseRatio = 1/this.ratio;

        if (global.skeletonMode) 
             console.log("@smanager.setNoBorder2 ow/h: " + this.ow + "-" + this.oh + ", inner " + global.deviceWidth + "-" + global.deviceHeight 
                + ", r : " + this.ratio + ", game.scale.w/h : "+ game.scale.width + " - " + game.scale.height)

         if (this.ratio == this.oldRatio) {
            this.onSizeChange();
         }

         this.oldRatio = this.ratio;
        //MyScaleManager.setSize2();
}


MyScaleManager.onSizeChange = function(){
    if (global.skeletonMode) 
        console.log("@sManager.onSizeChange inner " + global.deviceWidth + "-" + global.deviceHeight 
            + " game.scale.w/h : "+ game.scale.width + " - " + game.scale.height
            + " - game.w/h : " + game.scale.game.width + "-" + game.scale.game.height 
        )

        //console.log("KEPLE : " + game.scale.game.canvas.style.width + " - " + game.scale.game.canvas.style.height)
        //game.canvas.style.width = game.scale.width + 'px';
        //game.canvas.style.height = game.scale.height + 'px';

        //console.log("KEPLE 2 : " + game.scale.game.canvas.style.width + " - " + game.scale.game.canvas.style.height)

       // game.input.scale.setTo(game.width / game.scale.width, game.height / game.scale.height);

        //console.log("KEPLE 3 : " + game.scale.game.canvas.style.width + " - " + game.scale.game.canvas.style.height)
        if (((Phaser.Device.desktop === true && global.landscape == true && global.astrid)||(Phaser.Device.desktop ===  false && global.astrid)) && window.regainIncorrectOrientation)
        {
            var mx = Math.round((global.deviceWidth - this.ow) / 2);
            if (global.astrid) {
                /*console.log("------------ SAPI " + platform.os.family + "," +platform.os.version 
                    + "," + platform.name + "-" + window.navigator.standalone
                    )  */
               
                if (
                    (platform.os.family == 'iOS' && parseInt(platform.os.version, 10) >= 8)
                    && (platform.name == "Safari")
                    && ("standalone" in window.navigator) && !window.navigator.standalone
                    && isRetina()
                 ) {
                    //mx = Math.round(mx * 2);
                }
                document.getElementById('game').style.marginLeft =   mx + "px"
                document.getElementById('main-game').style.width =  (global.deviceWidth) + 'px';

                if (global.skeletonMode) 
                    console.log("MX " + mx + " - deviceWidth : " + global.deviceWidth + " - this ow " + this.ow)
            }
        }
        else
        {
            if (Phaser.Device.desktop && global.astrid)
                document.getElementById('game').style.marginLeft =   + "0px"
        }

        // _g.isRetina = isRetina();

        if (((Phaser.Device.desktop === true && global.landscape == true && global.astrid)||(Phaser.Device.desktop ===  false && global.astrid)) && window.regainIncorrectOrientation)
        {
           /* _g.v1 = global.deviceHeight;
            _g.v2 = this.oh;
            _g.v3 = global.deviceHeight - this.oh;
            _g.v4 = (global.deviceHeight - this.oh) / 2
            _g.v5 = my;

            _g.v6 = platform.os.family;
            _g.v7 = parseInt(platform.os.version, 10);
            _g.v8 = platform.name;
            _g.v9 = ("standalone" in window.navigator) ? "1":"0";
            _g.v10 = window.navigator.standalone;
            _g.v11 = false;*/
           //console.log("my " + my + " - deviceHeight : " + global.deviceHeight + " - this oh " + this.oh)
            var my = Math.round((global.deviceHeight - this.oh) / 2);
           if (
                    (platform.os.family == 'iOS' && parseInt(platform.os.version, 10) >= 8)
                    && (platform.name == "Safari")
                    && ("standalone" in window.navigator) && !window.navigator.standalone
                    && isRetina()
                 ) {
              /*  console.log("RETINA my before : " + my 
                    + "| oh : " + this.oh + " - deviceHeight : " + global.deviceHeight 
                )*/
                //my = Math.round(my * 2);
                console.log("RETINA my after : " + my)
               // _g.v11 = true;
               
           }

            document.getElementById('game').style.marginTop =   my + "px"

            if(Phaser.Device.desktop === true)
                document.getElementById('main-game').style.height =  (global.deviceHeight-2) + 'px';
            else
                document.getElementById('main-game').style.height =  (global.deviceHeight+2) + 'px';        
            

            //document.getElementById('game').style.marginBottom =   my + "px"
        }
        else
        {
           document.getElementById('game').style.marginTop =   "0px"
        }
             // game.scale.game.canvas.style.marginTop = '0px';

        //console.log("KEPLE 4 : " + game.scale.game.canvas.style.width + " - " + game.scale.game.canvas.style.height)

        //console.log("aaa2")
        if (global.forceWidth) {
            //console.log("aaa")
            /*game.canvas.style.marginLeft = '0px';
            game.canvas.style.marginTop = '0px';*/
        }

      /*  Phaser.Canvas.getOffset(game.scale.game.canvas, game.scale.game.stage.offset);
        game.scale.aspectRatio = game.scale.width / game.scale.height;
        game.scale.scaleFactor.x = game.scale.game.width / game.scale.width;
        game.scale.scaleFactor.y = game.scale.game.height / game.scale.height;
        game.scale.scaleFactorInversed.x = game.scale.width / game.scale.game.width;
        game.scale.scaleFactorInversed.y = game.scale.height / game.scale.game.height;*/

        //console.log("KEPLE 5 : " + game.scale.game.canvas.style.width + " - " + game.scale.game.canvas.style.height)

        var device =  global.phaserDevice;
        if(!(device.desktop && global.simulatedMobile) == true){
            //console.log("checkOrientationState")
           // game.scale.checkOrientationState();
        }

        

        //console.log("KEPLE 6 : " + game.scale.game.canvas.style.width + " - " + game.scale.game.canvas.style.height)
        if (global.skeletonMode) 
           console.log("@sManager.onSizeChange b  inner " + global.deviceWidth + "-" + global.deviceHeight 
               +", game.scale.w/h : "+ game.scale.width + " - " + game.scale.height 
                + ", game.w/h : " + game.width + "-" + game.height
                + ", scaleFactor x/y " + game.scale.scaleFactor.x + "-" + game.scale.scaleFactor.y
                + ", game DIV.marginLeft/top " + document.getElementById('game').style.marginLeft 
                + "-" +  document.getElementById('game').style.marginTop
           )

       if(game.scale.scaleMode==Phaser.ScaleManager.USER_SCALE){
            BasicGame.viewX = (MyScaleManager.ow/2 - global.deviceWidth/2)*MyScaleManager.reverseRatio;
            BasicGame.viewY = (MyScaleManager.oh/2 - global.deviceHeight/2 - 1)*MyScaleManager.reverseRatio;
            BasicGame.viewRight = BasicGame.gameWidth-BasicGame.viewX;
            
            BasicGame.viewBottom = BasicGame.gameHeight-BasicGame.viewY;
            BasicGame.viewWidth = BasicGame.viewRight - BasicGame.viewX; 
            BasicGame.viewHeight = BasicGame.viewBottom - BasicGame.viewY; 
            
            if (global.skeletonMode) 
                log("@smanager.onSizeChange c -------- init viewWidth, game height : " + BasicGame.gameHeight 
                    + ", viewY " + BasicGame.viewY
                    + ", viewHeight " + BasicGame.viewHeight
                    + ", viewBottom " + BasicGame.viewBottom
                     + ", scale h " + MyScaleManager.oh/2
                     + ", ratio h " + MyScaleManager.reverseRatio
                    + ", inner h " + global.deviceHeight/2
                )

           /* log("-------- init viewbottom, game width : " + BasicGame.gameWidth 
                + ", viewX " + BasicGame.viewX
                + ", viewWidth " + BasicGame.viewWidth
                + ", viewRight " + BasicGame.viewRight 
                + ", scale w " + game.scale.width
                + ", inner w " + global.deviceWidth
            )*/
            
        }else{
            BasicGame.viewX = 0;
            BasicGame.viewY = 0;
            BasicGame.viewRight = BasicGame.gameWidth;
            BasicGame.viewBottom = BasicGame.gameHeight;
            BasicGame.viewWidth = BasicGame.gameWidth;
            BasicGame.viewHeight = BasicGame.gameHeight;
        }
        global.init();
        var curState = game.state.getCurrentState()
        if (curState.onResize){
            curState.onResize();
        }
}