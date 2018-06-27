/**
 * Created by pawel on 13.05.2014.
 */
var ScreenPreload =
{
    s_tfProgress: createjs.Text,
    s_container: createjs.Container,

    Init: function()
    {

        this.s_container = new createjs.Container();
        Main.s_stage.addChild(this.s_container);

        //
        this.s_bg = new createjs.Shape();
        this.s_bg.graphics.beginFill("#72CFE9").drawRect(0, 0, 100, 100);
        this.s_bg.cache(0, 0, 100, 100);

        //
        this.s_loading = new createjs.Container();
        this.s_loadingInner = new createjs.Container();

        var tfLoading = new createjs.Text();
        tfLoading.textAlign = "center";
        tfLoading.textBaseline = "bottom";
        tfLoading.color = "#F856A2";
        tfLoading.font = getFontStyle(".loading");
        tfLoading.text = Main.COPY.getCopy("loading");
        FixText(tfLoading);

        var outline = tfLoading.clone();
        outline.color = "#991066";
        outline.outline = 2;
        this.s_loadingInner.addChild(tfLoading, outline);
        this.s_loading.addChild(this.s_loadingInner);
        createjs.Tween.get(this.s_loadingInner, {loop: true}).to({scaleX: 1.05, scaleY: 1.05}, 400).
            to({scaleX: 1, scaleY: 1}, 400);

        this.s_container.addChild(this.s_bg, this.s_loading);

        var size = Main.GetCanvasSize();
        this.UpdateCanvasSize(size.width, size.height);

        createjs.Ticker.addEventListener("tick", Update);

        return this;
    },


    Remove: function()
    {
        this.s_container.removeAllChildren();
        Main.s_scene.removeChild(this.s_container);

        createjs.Ticker.removeEventListener("tick", Update);
        createjs.Tween.removeAllTweens();

        this.s_bg = null;
        this.s_loading.removeAllChildren();
        this.s_loading = null;
        this.s_loadingInner.removeAllChildren();
        this.s_loadingInner = null;
        this.s_logo = null;
        this.s_rainbow.removeAllChildren();
        this.s_rainbow = null;
        this.s_rainbowL = null;
        this.s_rainbowR = null;
        this.s_maskL = null;
        this.s_maskR = null;
    },


    SetLogo: function()
    {
        this.s_logo = new createjs.Bitmap(Main.GetImage("logo_cn"));
        this.s_container.addChild(this.s_logo);

        var size = Main.GetCanvasSize();
        this.UpdateCanvasSize(size.width, size.height);
    },


    SetRainbow: function()
    {
        this.s_rainbow = new createjs.Container();
        var rainbow = new createjs.Bitmap(Main.GetImage("rainbow"));
        var bb = rainbow.getBounds();
        this.s_rainbowL = rainbow.clone();
        this.s_rainbowL.x = -bb.width >> 1;
        this.s_rainbowL.y = -bb.height;
        this.s_maskL = new createjs.Shape();
        this.s_maskL.graphics.beginFill("#f00").drawRect(-360, 0, 360, 360);
        this.s_rainbowL.mask = this.s_maskL;

        this.s_rainbowR = this.s_rainbowL.clone();
        this.s_maskR = new createjs.Shape();
        this.s_maskR.graphics.beginFill("#f00").drawRect(-360, -360, 360, 360);
        this.s_rainbowR.mask = this.s_maskR;

        this.s_rainbow.addChild(this.s_rainbowL, this.s_rainbowR);
        this.s_rainbowR.visible = false;

        this.s_container.addChild(this.s_rainbow);

        var size = Main.GetCanvasSize();
        this.UpdateCanvasSize(size.width, size.height);
    },


    SetProgress: function(progress)
    {
        if (this.s_rainbow)
        {
            if (progress < 0.5)
            {
                this.s_maskL.rotation = 90 * progress * 2;
            }
            else
            {
                this.s_maskL.rotation = 90;
                this.s_maskR.rotation = 90 * (progress - 0.5) * 2;
                this.s_rainbowR.visible = true;
            }

            Main.s_stage.update();
        }
    },


    UpdateCanvasSize: function(width, height)
    {
        var bb, s;

        bb = this.s_bg.getBounds();
        this.s_bg.scaleX = width / bb.width;
        this.s_bg.scaleY = height / bb.height;

        s = Math.min(Main.SCALE, height / 640);
        this.s_loading.scaleX = this.s_loading.scaleY = s;
        this.s_loading.x = width >> 1;
        this.s_loading.y = 0.990 * height;

        if (this.s_logo)
        {
            s = Math.min(Main.SCALE, height / 640);
            bb = this.s_logo.getBounds();
            this.s_logo.scaleX = this.s_logo.scaleY = s;
            this.s_logo.x = width - bb.width * s >> 1;
            this.s_logo.y = 0.100 * height;
        }

        if (this.s_rainbow)
        {
            s = Math.min(Main.SCALE, height / 640);
            this.s_rainbow.scaleX = this.s_rainbow.scaleY = s;
            this.s_rainbow.x = width >> 1;
            this.s_rainbow.y = 1.01 * height;
        }

        Main.s_stage.update();
    }
};