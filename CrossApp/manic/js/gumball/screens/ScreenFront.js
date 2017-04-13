/**
 * Created by pawel on 09.10.2014.
 */
var ScreenFront =
{
    s_container: createjs.Container,

    Init: function()
    {
        this.s_container = new createjs.Container();
        Main.s_scene.addChild(this.s_container);

        this.s_bg = new createjs.Bitmap(Main.GetImage("interface_bg"));
        this.s_logo = new createjs.Bitmap(Main.GetImage("gumball_logo"));
        this.s_gumball = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        this.s_gumball.gotoAndStop("gumball_front");

        this.s_title = new GameLogo();

        this.s_btnPlay = new BtnPlay();

        //
        this.s_container.addChild(this.s_bg, this.s_gumball, this.s_logo, this.s_title, this.s_btnPlay);

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
            document.onkeydown = function(e){ScreenFront.HandleKeyDown(e);};
            Main.s_music = SoundsManager.PlaySound("theme", {loop: -1, volume: 1});
        }
        this.s_btnPlay.addEventListener("click", function(e){ScreenFront.OnClickPlay(e);});

        //
        createjs.Ticker.addEventListener("tick", Update);

        //
        return this;
    },


    Remove: function()
    {
        this.s_container.removeAllChildren();
        Main.s_scene.removeChild(this.s_container);

        createjs.Ticker.removeEventListener("tick", Update);

        this.s_bg = null;
        this.s_btnPlay = null;
        this.s_gumball = null;
        this.s_logo = null;
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

            s = Math.min(Main.SCALE, height / 540);
            bb = this.s_logo.getBounds();
            this.s_logo.scaleX = this.s_logo.scaleY = s;
            this.s_logo.x = 0.205 * width - (bb.width * s >> 1);
            this.s_logo.y = 0.058 * height;

            bb = this.s_btnPlay.getBounds();
            this.s_btnPlay.scaleX = this.s_btnPlay.scaleY = s;
            this.s_btnPlay.x = 0.205 * width - (bb.width * s >> 1);
            this.s_btnPlay.y = 0.805 * height;

            this.s_title.scaleX = this.s_title.scaleY = s;
            this.s_title.x = 0.205 * width;
            this.s_title.y = 0.405 * height;

            bb = this.s_gumball.getBounds();
            s = Math.min(height / bb.height, Math.max(s, height / bb.height));
            this.s_gumball.scaleX = this.s_gumball.scaleY = s;
            this.s_gumball.x = 0.669 * width - (bb.width * s >> 1);
            this.s_gumball.y = 0;

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

        Navigation.ShowScreen(Navigation.SCREEN_INSTRUCTIONS);
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
                ScreenFront.OnClickPlay();
                break;
        }
    }
};


function Update()
{
    Main.s_stage.update();
}