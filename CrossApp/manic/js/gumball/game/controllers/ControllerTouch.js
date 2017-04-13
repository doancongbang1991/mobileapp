/**
 * Created by pawel on 08.05.2014.
 */
var ControllerTouch =
{
    s_hero: Hero,


    Init: function(hero, scope)
    {
        this.s_hero = hero;
        this.s_scope = scope;

        createjs.Touch.enable(Main.s_stage, true);

        this.s_scope.addEventListener("mousedown", function(e){ControllerTouch.HandleMouseDown(e);});
        //App.s_stage.addEventListener("stagemouseup", function(e){App.HandleMouseUp(e);});
        //App.s_stage.addEventListener("mouseout", function(e){App.HandleMouseUp(e);});
    },


    HandleMouseDown: function(e)
    {
        e.preventDefault();

        this.s_hero.tryMoveTo(e.stageX, e.stageY);
    },


    Clear: function()
    {
        createjs.Touch.disable(Main.s_stage);

        this.s_scope.removeAllEventListeners("mousedown");
    }
};

