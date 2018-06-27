/**
 * Created by pawel on 09.10.2014.
 */
var ScreenSummary =
{
    s_container: createjs.Container,

    Init: function()
    {
        var me = this;

        this.s_container = new createjs.Container();
        Main.s_scene.addChild(this.s_container);

        this.s_bg = new createjs.Bitmap(Main.GetImage("interface_bg"));
        this.s_gumball = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        this.s_gumball.gotoAndStop("gumball_yay");

        //
        this.s_panel = new createjs.Container();
        var panel = this.s_gumball.clone();
        panel.gotoAndStop("panel_big");
        this.s_panel.addChild(panel);
        for (var i = 0; i < 5; i++)
        {
            var a = Status.s_customers[i].amount;
            var p = Status.s_customers[i].points;
            var points = new SummaryScore(a, a * p);
            points.x = 120 + (i % 2) * 250;
            points.y = -20 + (i / 2 | 0) * 100;
            this.s_panel.addChild(points);
        }

        //
        this.s_title = new createjs.Container();
        var tfTitle = new createjs.Text();
        tfTitle.textAlign = "center";
        tfTitle.color = "#ffffff";
        tfTitle.font = getFontStyle(".well_done");
        tfTitle.text = Main.COPY.getCopy("well_done");
        FixText(tfTitle);

        var shadow = tfTitle.clone();
        shadow.color = "#000000";
        shadow.x -= 6;
        shadow.y += 6;
        this.s_title.addChild(shadow, tfTitle);

        //
        this.s_btnContinue = new BtnContinue();

        //
        this.s_container.addChild(this.s_bg, this.s_gumball, this.s_panel, this.s_title, this.s_btnContinue);

        //
        var size = Main.GetCanvasSize();
        this.UpdateCanvasSize(size.width, size.height);

        //
        if (Main.IsMobile())
        {
            createjs.Touch.enable(Main.s_stage);
        }
        else
        {
            document.onkeydown = function(e){me.HandleKeyDown(e);};

            Main.s_stage.enableMouseOver(10);
        }
        this.s_btnContinue.addEventListener("click", function(e){me.OnClickContinue(e);});

        //
        SoundsManager.PlaySound("twinkles");

        //
        //createjs.Ticker.addEventListener("tick", Update);

        //
        return this;
    },


    Remove: function()
    {
        this.s_container.removeAllChildren();
        Main.s_scene.removeChild(this.s_container);

        createjs.Ticker.removeEventListener("tick", Update);

        SoundsManager.StopAll();

        this.s_bg = null;
        this.s_btnContinue = null;
        this.s_gumball = null;
        this.s_panel.removeAllChildren();
        this.s_panel = null;
        this.s_title.removeAllChildren();
        this.s_title = null;
    },


    UpdateCanvasSize: function(width, height)
    {
        if (width > height)
        {
            var bb;

            var s = Math.max(Main.SCALE, height / 640);
            bb = this.s_bg.getBounds();
            this.s_bg.scaleX = this.s_bg.scaleY = s;
            this.s_bg.x = width - bb.width * s >> 1;
            this.s_bg.y = height - bb.height * s >> 1;

            s = Math.min(Main.SCALE, height / 600);
            bb = this.s_panel.getBounds();
            this.s_panel.scaleX = this.s_panel.scaleY = s;
            this.s_panel.x = 0.302 * width - (bb.width * s >> 1) | 0;
            this.s_panel.y = 0.510 * height - (bb.height * s >> 1) | 0;

            bb = this.s_btnContinue.getBounds();
            this.s_btnContinue.scaleX = this.s_btnContinue.scaleY = s;
            this.s_btnContinue.x = 0.302 * width - (bb.width * s >> 1) | 0;
            this.s_btnContinue.y = 0.805 * height | 0;

            bb = this.s_title.getBounds();
            this.s_title.scaleX = this.s_title.scaleY = s;
            this.s_title.x = 0.302 * width | 0;
            this.s_title.y = 0.020 * height | 0;

            bb = this.s_gumball.getBounds();
            s = Math.min(height / 640, Math.max(s, height / 640));
            this.s_gumball.scaleX = this.s_gumball.scaleY = s;
            this.s_gumball.x = 0.845 * width - (bb.width * s >> 1);
            this.s_gumball.y = 0;

        }

        Main.s_stage.update();
    },


    OnClickContinue: function(e)
    {
//        WiseTrack.track("Game Started");
        if (Main.IsMobile())
        {
            createjs.Touch.disable(Main.s_stage);
        }
        else
        {
            document.onkeydown = null;
        }
        this.s_btnContinue.removeAllEventListeners("click");


        if (Status.s_level < 10)
        {
            Navigation.ShowScreen(Navigation.SCREEN_GAME);
        }
        else
        {
            Navigation.ShowScreen(Navigation.SCREEN_WIN);
        }
    },


    HandleKeyDown: function(e)
    {
        //cross browser issues exist
        if(!e)
        {
            e = window.event;
        }
        e.preventDefault();

        //
        switch(e.keyCode)
        {
            case ControllerKeyboard.KEYCODE_SPACE:
                this.OnClickContinue();
                break;
        }
    }
};


function Update()
{
    Main.s_stage.update();
}