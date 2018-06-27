/**
 * Created by pawel on 13.05.2014.
 */
var Navigation =
{
    SCREEN_PRELOAD: 0,
    SCREEN_FRONT: 1,
    SCREEN_INSTRUCTIONS: 2,
    SCREEN_GAME: 3,
    SCREEN_SUMMARY: 4,
    SCREEN_WIN: 5,
    SCREEN_FAILED: 6,

    s_screenId: -1,
    s_screenRef: null,

    ShowScreen: function(id)
    {
        this.s_screenId = id;

        this.RemoveCurrentScreen();

        switch(this.s_screenId)
        {
            case this.SCREEN_PRELOAD:
                this.s_screenRef = ScreenPreload.Init();
                break;

            case this.SCREEN_FRONT:
                this.s_screenRef = ScreenFront.Init();
                break;

            case this.SCREEN_INSTRUCTIONS:
                this.s_screenRef = ScreenInstructions.Init();
                break;

            case this.SCREEN_GAME:
                this.s_screenRef = ScreenGame.Init();
                break;

            case this.SCREEN_SUMMARY:
                this.s_screenRef = ScreenSummary.Init();
                break;

            case this.SCREEN_FAILED:
                this.s_screenRef = ScreenFailed.Init();
                break;

            case this.SCREEN_WIN:
                this.s_screenRef = ScreenWin.Init();
                break;
        }

        //refresh view
        Main.s_stage.update();
    },


    RemoveCurrentScreen: function()
    {
        if (this.s_screenRef)
        {
            this.s_screenRef.Remove();
            this.s_screenRef = null;
        }
    },


    ShowRotateScreen: function()
    {
        if (this.s_screenId == this.SCREEN_GAME)
        {
            this.s_screenRef.Pause();
        }

        this.s_rotateScreen = ScreenRotate.Init();
    },


    HideRotateScreen: function()
    {
        if (this.s_screenId == this.SCREEN_GAME)
        {
            this.s_screenRef.BackFromRotate();
        }
        ScreenRotate.Remove();
        this.s_rotateScreen = null;
    },


    UpdateCanvasSize: function(width, height)
    {
        if (this.s_screenRef)
        {
            this.s_screenRef.UpdateCanvasSize(width, height);

            if (this.s_rotateScreen)
            {
                this.s_rotateScreen.UpdateCanvasSize(width, height);
            }
        }
    }
};