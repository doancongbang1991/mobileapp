/**
 * Created by pawel on 19.05.2014.
 */
var Hud =
{
    s_container: createjs.Container,
    s_tfLives: createjs.Text,
    s_tfPoints: createjs.Text,
    s_timer: createjs.Bitmap,
    s_timerMask: createjs.Shape,
    s_btnSoundOn: createjs.Sprite,
    s_btnSoundOnHelper: createjs.ButtonHelper,
    s_btnSoundOff: createjs.Sprite,
    s_btnSoundOffHelper: createjs.ButtonHelper,


    Init: function()
    {
        this.s_container = new createjs.Container();
        Main.s_scene.addChild(this.s_container);

        //this.s_container.mouseEnabled = false;
        //this.mouseChildren = true;

        //top left
        this.s_topLeft = new createjs.Container();
        this.s_container.addChild(this.s_topLeft);

        var panel = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        panel.gotoAndStop("info_box");

        var icon = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        icon.gotoAndStop("gumball_head");
        icon.x = 20;
        icon.y = 20;

        this.s_tfLives = new createjs.Text();
        this.s_tfLives.textAlign = "left";
        this.s_tfLives.color = "#ffffff";
        this.s_tfLives.font = getFontStyle(".hud_lives");
        this.s_tfLives.x = 115;
        this.s_tfLives.y = 20;
        FixText(this.s_tfLives);
        this.s_topLeft.addChild(panel, icon, this.s_tfLives);

        //top right
        this.s_topRight = new createjs.Container();
        this.s_container.addChild(this.s_topRight);

        var panel = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        panel.gotoAndStop("info_box");
        panel.x = 130;
        var bb = panel.getBounds();

        this.s_tfPoints = new createjs.Text();
        this.s_tfPoints.textAlign = "center";
        this.s_tfPoints.color = "#ffffff";
        this.s_tfPoints.font = getFontStyle(".hud_score");
        this.s_tfPoints.x = panel.x + (bb.width >> 1);
        this.s_tfPoints.y = 20;
        FixText(this.s_tfPoints);

        this.s_btnHelp = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        this.s_btnHelp.gotoAndStop("btn_help");
        this.s_btnHelp.cursor = "pointer";
        this.s_btnHelp.x = 0;
        this.s_btnHelp.addEventListener("click", this.OnClickHelp.bind(this));

        this.s_topRight.addChild(panel, this.s_tfPoints, this.s_btnHelp);

        //timer
        this.s_bottomRight = new createjs.Container();
        this.s_container.addChild(this.s_bottomRight);

        this.s_timerMask = new createjs.Shape();
        this.s_timerMask.graphics.beginFill("#f00").drawRect(-200, -200, 200, 200);

        this.s_timerSmall = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        this.s_timerSmall.gotoAndStop("timer_small");
        bb = this.s_timerSmall.getBounds();
        this.s_timerSmall.x = -bb.width;
        this.s_timerSmall.y = -bb.height;

        this.s_timerBig = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        this.s_timerBig.gotoAndStop("timer_big");
        bb = this.s_timerBig.getBounds();
        this.s_timerBig.x = -bb.width;
        this.s_timerBig.y = -bb.height;
        this.s_timerBig.mask = this.s_timerMask;
        this.s_bottomRight.addChild(this.s_timerSmall, this.s_timerBig);

        //
        //sound buttons
        this.s_bottomLeft = new createjs.Container();
        this.s_container.addChild(this.s_bottomLeft);

        this.s_btnSoundOn = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        this.s_btnSoundOn.gotoAndStop("sound_on");
        bb = this.s_btnSoundOn.getBounds();
        this.s_btnSoundOn.y = -bb.height;
        this.s_btnSoundOn.cursor = "pointer";
        this.s_btnSoundOn.addEventListener("click", function(e){Hud.OnClickSoundOn(e);});

        this.s_btnSoundOff = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        this.s_btnSoundOff.gotoAndStop("sound_off");
        bb = this.s_btnSoundOff.getBounds();
        this.s_btnSoundOff.y = -bb.height;
        this.s_btnSoundOff.cursor = "pointer";
        this.s_btnSoundOff.addEventListener("click", function(e){Hud.OnClickSoundOff(e);});

        this.s_btnSoundOff.visible = SoundsManager.GetMute();
        this.s_btnSoundOn.visible = !SoundsManager.GetMute();

        this.s_bottomLeft.addChild(this.s_btnSoundOff, this.s_btnSoundOn);

        //
        Main.s_stage.enableMouseOver(10);
    },


    Remove: function()
    {
        Main.s_stage.removeChild(this.s_container);

        this.s_btnHelp.removeAllEventListeners("click");
        this.s_btnSoundOn.removeAllEventListeners("click");
        this.s_btnSoundOff.removeAllEventListeners("click");
        this.s_btnSoundOn = null;
        this.s_btnSoundOff = null;

        this.s_container.removeAllChildren();

        this.s_tfLives = null;

        Main.s_stage.enableMouseOver(0);
    },


    OnClickHelp: function(e)
    {
        ScreenGame.ShowHelp();
    },


    ShowLives: function(value)
    {
        this.s_tfLives.text = "X" + value;
    },


    ShowPoints: function(value)
    {

        this.s_tfPoints.text = Utils.FormatScore(value);
    },


    ShowTime: function(value)
    {
        this.s_timerMask.rotation = -90 * (1 - value);
    },


    OnClickSoundOn: function(e)
    {
        e.preventDefault();

        SoundsManager.Mute(true);
        this.s_btnSoundOn.visible = false;
        this.s_btnSoundOff.visible = true;
    },


    OnClickSoundOff: function(e)
    {
        e.preventDefault();

        SoundsManager.Mute(false);
        this.s_btnSoundOn.visible = true;
        this.s_btnSoundOff.visible = false;
    },


    UpdateCanvasSize: function(width, height)
    {
        var s = Main.SCALE;
        this.s_topLeft.scaleX = this.s_topLeft.scaleY = s;

        var bb = this.s_topRight.getBounds();
        this.s_topRight.scaleX = this.s_topRight.scaleY = s;
        this.s_topRight.x = width - bb.width * s;

        this.s_bottomRight.scaleX = this.s_bottomRight.scaleY = s;
        this.s_bottomRight.x = width;
        this.s_bottomRight.y = height;

        this.s_bottomLeft.scaleX = this.s_bottomLeft.scaleY = s;
        this.s_bottomLeft.y = height;
    },


    Lock: function()
    {
        this.s_container.mouseEnabled = false;
    },


    Unlock: function()
    {
        this.s_container.mouseEnabled = true;
    }
};