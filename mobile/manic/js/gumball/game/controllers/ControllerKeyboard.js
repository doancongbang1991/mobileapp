/**
 * Created by pawel on 08.05.2014.
 */
var ControllerKeyboard =
{
    KEYCODE_ENTER: 13,		//usefull keycode
    KEYCODE_SPACE: 32,		//usefull keycode
    KEYCODE_UP: 38,		//usefull keycode
    KEYCODE_DOWN: 40,		//usefull keycode
    KEYCODE_LEFT: 37,		//usefull keycode
    KEYCODE_RIGHT: 39,

    s_hero: Hero,



    Init: function(hero)
    {
        this.s_hero = hero;

        document.onkeydown = function(e){ControllerKeyboard.HandleKeyDown(e);};
        document.onkeyup = function(e){ControllerKeyboard.HandleKeyUp(e);};
    },


    Clear: function()
    {
        m_hero = null;

        document.onkeydown = null;
        document.onkeyup = null;
    },


    HandleKeyDown: function(e)
    {
        //cross browser issues exist
        if(!e)
        {
            e = window.event;
        }
        e.preventDefault();


        switch(e.keyCode)
        {
            case this.KEYCODE_SPACE:
                this.s_hero.serveVeg();
                break;

            case this.KEYCODE_LEFT:
                this.s_hero.startGoLeft();
                break;

            case this.KEYCODE_RIGHT:
                this.s_hero.startGoRight();
                break;

            case this.KEYCODE_UP:
                this.s_hero.startGoUp();
                break;

            case this.KEYCODE_DOWN:
                this.s_hero.startGoDown();
                break;
        }
    },


    HandleKeyUp: function(e)
    {
        //cross browser issues exist
        if(!e)
        {
            e = window.event;
        }
        e.preventDefault();


        switch(e.keyCode)
        {
            case this.KEYCODE_SPACE:
                this.s_hero.allowServNextVeg();
                break;

            case this.KEYCODE_LEFT:
                this.s_hero.stopGoLeft();
                break;

            case this.KEYCODE_RIGHT:
                this.s_hero.stopGoRight();
                break;

            case this.KEYCODE_UP:
                this.s_hero.stopGoUp();
                break;

            case this.KEYCODE_DOWN:
                this.s_hero.stopGoDown();
                break;
        }
    }
};