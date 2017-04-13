/**
 * Created by pawel on 09.10.2014.
 */
var ScreenInstructions =
{
    s_container: createjs.Container,
    s_page: 0,

    Init: function(inGame)
    {
        var me = this;

        this.s_inGame = inGame;
        this.s_page = 0;

        this.s_container = new createjs.Container();
        Main.s_scene.addChild(this.s_container);

        this.s_bg = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        this.s_bg.gotoAndStop("rotate_bg");

        this.s_imagesContainer = new createjs.Container();
        this.s_images = [];
        this.s_images[0] = new createjs.Bitmap(Main.GetImage("instr_1"));
        this.s_images[1] = new createjs.Bitmap(Main.GetImage("instr_2"));
        this.s_images[2] = new createjs.Bitmap(Main.GetImage("instr_3"));
        this.s_imagesContainer.addChild(this.s_images[0], this.s_images[1], this.s_images[2]);

        //
        this.s_copy = new createjs.Text();
        this.s_copy.textAlign = "center";
        this.s_copy.color = "#ffffff";
        this.s_copy.font = getFontStyle(".instr");

        //
        this.s_btnNext = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        this.s_btnNext.gotoAndStop("btn_next");
        this.s_btnNext.cursor = "pointer";

        this.s_btnPrev = new createjs.Sprite(Main.GetSpriteSheet("interface"));
        this.s_btnPrev.gotoAndStop("btn_prev");
        this.s_btnPrev.cursor = "pointer";

        //
        this.s_container.addChild(this.s_bg, this.s_imagesContainer, this.s_copy, this.s_btnNext, this.s_btnPrev);

        //add close button
        if (this.s_inGame)
        {
            this.s_btnClose = new createjs.Container();
            var icon = new createjs.Sprite(Main.GetSpriteSheet("interface"));
            icon.gotoAndStop("btn_close");
            var copy = new createjs.Text();
            copy.textAlign = "center";
            copy.color = "#ffffff";
            copy.font = getFontStyle(".close");
            copy.text = Main.COPY.getCopy("close");
            copy.x = 42;
            copy.y = 90;
            FixText(copy);
            this.s_btnClose.addChild(icon, copy);
            this.s_btnClose.cursor = "pointer";
            this.s_btnClose.addEventListener("click", this.OnClickClose.bind(this));
            this.s_container.addChild(this.s_btnClose);
        }

        //
        var size = Main.GetCanvasSize();
        this.UpdateCanvasSize(size.width, size.height);

        //
        if (Main.IsMobile())
        {
            createjs.Touch.enable(Main.s_stage);
            if (!this.s_inGame)
            {
                Main.s_music = SoundsManager.PlaySound("theme", {loop: -1, volume: 1});
            }
        }
        else
        {
            document.onkeydown = function(e){me.HandleKeyDown(e);};

            Main.s_stage.enableMouseOver(10);
        }
        this.s_btnPrev.addEventListener("click", function(e){me.OnClickPrev(e);});
        this.s_btnNext.addEventListener("click", function(e){me.OnClickNext(e);});


        //
        this.ShowPage();

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

        //SoundsManager.StopAll();
        document.onkeydown = null

        this.s_btnPrev.removeAllEventListeners("click");
        this.s_btnNext.removeAllEventListeners("click");
        if (this.s_btnClose)
        {
            this.s_btnClose.removeAllEventListeners("click");
            this.s_btnClose = null;
        }


        this.s_bg = null;
        this.s_btnNext = null;
        this.s_btnPrev = null;
        this.s_imagesContainer.removeAllChildren();
        this.s_imagesContainer = null;
        this.s_images = null;
    },


    ShowPage: function()
    {
        this.s_images[0].visible = false;
        this.s_images[1].visible = false;
        this.s_images[2].visible = false;
        this.s_images[this.s_page].visible = true;

        if (this.s_page == 0)
        {
            this.s_btnPrev.visible = false;
        }
        else
        {
            this.s_btnPrev.visible = true;
        }

        this.s_copy.text = Main.COPY.getCopy("instr_" + (this.s_page + 1) + "_" + (Main.IsMobile() ? "m" : "d"));
    },


    UpdateCanvasSize: function(width, height)
    {
        if (width > height)
        {
            var bb, s;

            bb = this.s_bg.getBounds();
            this.s_bg.scaleX = width / bb.width;
            this.s_bg.scaleY = height / bb.height;

            s = Math.min(Main.SCALE, height / 640);
            bb = this.s_imagesContainer.getBounds();
            this.s_imagesContainer.scaleX = this.s_imagesContainer.scaleY = s;
            this.s_imagesContainer.x = width - bb.width * s >> 1 | 0;
            this.s_imagesContainer.y = 0.036 * height;

            this.s_copy.scaleX = this.s_copy.scaleY = s;
            this.s_copy.x = width >> 1;
            this.s_copy.y = 0.835 * height;
            FixText(this.s_copy);

            bb = this.s_btnNext.getBounds();
            this.s_btnNext.scaleX = this.s_btnNext.scaleY = s;
            this.s_btnNext.x = width - (15 + bb.width) * s;
            this.s_btnNext.y = height - (10 + bb.height) * s;

            bb = this.s_btnPrev.getBounds();
            this.s_btnPrev.scaleX = this.s_btnPrev.scaleY = s;
            this.s_btnPrev.x = 15 * s;
            this.s_btnPrev.y = height - (10 + bb.height) * s;

            if (this.s_btnClose)
            {
                bb = this.s_btnClose.getBounds();
                this.s_btnClose.scaleX = this.s_btnClose.scaleY = s;
                this.s_btnClose.x = width - (15 + bb.width) * s;
                this.s_btnClose.y = this.s_imagesContainer.y;
            }
        }

        Main.s_stage.update();
    },


    OnClickPrev: function(e)
    {
        //e.preventDefault();

        if (this.s_page > 0)
        {
            this.s_page--;
            this.ShowPage();
        }
    },


    OnClickNext: function(e)
    {
        //e.preventDefault();

        if (this.s_page < 2)
        {
            this.s_page++;
            this.ShowPage();
        }
        else
        {
            if (this.s_inGame)
            {
                ScreenGame.OnCloseHelp();
            }
            else
            {
                Navigation.ShowScreen(Navigation.SCREEN_GAME);
            }
        }
    },


    OnClickClose: function(e)
    {
        e.preventDefault();
        ScreenGame.OnCloseHelp();
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
            case ControllerKeyboard.KEYCODE_RIGHT:
                this.OnClickNext();
                break;

            case ControllerKeyboard.KEYCODE_LEFT:
                this.OnClickPrev();
                break;
        }
    }
};


function Update()
{
    Main.s_stage.update();
}