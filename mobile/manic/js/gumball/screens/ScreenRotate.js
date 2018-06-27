/**
 * Created by pawel on 09.10.2014.
 */
var ScreenRotate =
{
    s_container: createjs.Container,


    Init: function()
    {
        this.s_container = new createjs.Container();
        Main.s_stage.addChild(this.s_container);

        this.s_bg = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        this.s_bg.gotoAndStop("rotate_bg");

        //frame and content
        this.s_panel = new createjs.Container();

        var frame = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        frame.gotoAndStop("rotate_frame");
        frame.x = -frame.getBounds().width >> 1;

        var logo = new createjs.Bitmap(Main.GetImage("gumball_logo"));
        logo.x = -logo.getBounds().width >> 1;
        logo.y = 48;

        //copy
        var title = new GameLogo();
        title.y = 280;

        var arrow = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        arrow.gotoAndStop("rotate_arrow");
        arrow.x = -arrow.getBounds().width >> 1;
        arrow.y = 521;

        var copy = new createjs.Text();
        copy.textAlign = "center";
        copy.lineWidth = 460;
        copy.lineHeight = 36;
        copy.color = "#F857A3";
        copy.font = getFontStyle(".rotate");
        copy.text = Main.COPY.getCopy("rotate");
        copy.y = 743;
        FixText(copy);

        var copyOutline = copy.clone();
        copyOutline.color = "#990066";
        copyOutline.outline = 2;

        this.s_panel.addChild(frame, logo, title, arrow, copy, copyOutline);

        //
        this.s_container.addChild(this.s_bg, this.s_panel);

        //
        Main.s_stage.mouseChildren = false;

        //
        var size = Main.GetCanvasSize();
        this.UpdateCanvasSize(size.width, size.height);

        return this;
    },


    Remove: function()
    {
        this.s_container.removeAllChildren();
        Main.s_stage.removeChild(this.s_container);

        this.s_panel.removeAllChildren();

        this.s_panel = null;
        this.s_container = null;
        this.s_bg = null;

        Main.s_stage.update();

        Main.s_stage.mouseChildren = true;
    },


    UpdateCanvasSize: function(width, height)
    {
        if (width < height)
        {
            var bb = this.s_bg.getBounds();
            var s = Math.max(Main.SCALE, Math.max(width / bb.width, height / bb.height));
            this.s_bg.scaleX = this.s_bg.scaleY = s;
            this.s_bg.x = (width - bb.width * s) >> 1;
            this.s_bg.y = (height - bb.height * s) >> 1;

            s = Math.min(Main.SCALE, height / 1000);
            this.s_panel.scaleX = this.s_panel.scaleY = s;
            this.s_panel.x = width >> 1
            this.s_panel.y = (height - this.s_panel.getBounds().height * s) >> 1;
        }

        Main.s_stage.update();
    }
};