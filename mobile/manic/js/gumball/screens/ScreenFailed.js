/**
 * Created by pawel on 09.10.2014.
 */
var ScreenFailed =
{
    s_container: createjs.Container,

    Init: function()
    {
        var me = this;

        this.s_container = new createjs.Container();
        Main.s_scene.addChild(this.s_container);

        this.s_bg = new createjs.Bitmap(Main.GetImage("interface_bg"));
        this.s_gumball = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        this.s_gumball.gotoAndStop("gumball_boo");

        //
        this.s_panel = new createjs.Container();
        var panel = this.s_gumball.clone();
        panel.gotoAndStop("panel_small");
        var bb = panel.getBounds();

        var scoreLabel = new createjs.Text();
        scoreLabel.textAlign = "center";
        scoreLabel.color = "#C4EC12";
        scoreLabel.font = getFontStyle(".score");
        scoreLabel.text = Main.COPY.getCopy("score");
        scoreLabel.x = bb.width >> 1;
        scoreLabel.y = 21;
        FixText(scoreLabel);

        var score = new createjs.Text();
        score.textAlign = "center";
        score.color = "#FFFFFF";
        score.font = getFontStyle(".end_score");
        score.text = Utils.FormatScore(Status.s_points);
        score.x = bb.width >> 1;
        score.y = 45;
        FixText(score);

        var best = new createjs.Text();
        best.textAlign = "center";
        best.color = "#F858A2";
        best.font = getFontStyle(".best");
        best.text = Main.COPY.getCopy("best") + " " + Utils.FormatScore(Main.s_best);
        best.x = bb.width >> 1;
        best.y = 150;
        FixText(best);

        this.s_panel.addChild(panel, scoreLabel, score, best);

        //
        this.s_title = new createjs.Container();
        var tfTitle = new createjs.Text();
        tfTitle.textAlign = "center";
        tfTitle.color = "#ffffff";
        tfTitle.font = getFontStyle(".oh_dear");
        tfTitle.text = Main.COPY.getCopy("oh_dear");
        FixText(tfTitle);

        var shadow = tfTitle.clone();
        shadow.color = "#000000";
        shadow.x -= 6;
        shadow.y += 6;
        this.s_title.addChild(shadow, tfTitle);

        //
        this.s_btnPlay = new BtnPlayAgain();

        //
        this.s_container.addChild(this.s_bg, this.s_gumball, this.s_panel, this.s_title, this.s_btnPlay);

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
        this.s_btnPlay.addEventListener("click", function(e){me.OnClickPlay(e);});

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
        this.s_btnPlay = null;
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
            this.s_panel.x = 0.270 * width - (bb.width * s >> 1) | 0;
            this.s_panel.y = 0.453 * height - (bb.height * s >> 1) | 0;

            bb = this.s_btnPlay.getBounds();
            this.s_btnPlay.scaleX = this.s_btnPlay.scaleY = s;
            this.s_btnPlay.x = 0.270 * width - (bb.width * s >> 1) | 0;
            this.s_btnPlay.y = 0.805 * height | 0;

            this.s_title.scaleX = this.s_title.scaleY = s;
            this.s_title.x = 0.270 * width | 0;
            this.s_title.y = 0.020 * height | 0;

            bb = this.s_gumball.getBounds();
            s = Math.min(height / 640, Math.max(s, height / 640));
            this.s_gumball.scaleX = this.s_gumball.scaleY = s;
            this.s_gumball.x = 0.739 * width - (bb.width * s >> 1);
            this.s_gumball.y = 0.067 * height;

        }

        Main.s_stage.update();
    },


    OnClickPlay: function(e)
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
        this.s_btnPlay.removeAllEventListeners("click");

        Status.Reset();
        Navigation.ShowScreen(Navigation.SCREEN_GAME);
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
                this.OnClickPlay();
                break;
        }
    }
};


function Update()
{
    Main.s_stage.update();
}