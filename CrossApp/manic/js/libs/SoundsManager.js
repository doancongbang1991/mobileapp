/**
 * Created by pawel on 05.02.2014.
 */

var SoundsManager =
{
    queue: null,
    handler: null,
    loaded: false,

    Init: function(manifest, handler)
    {
        var me = this;

        this.handler = handler;

        createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]);

        this.queue = new createjs.LoadQueue(false);
        createjs.Sound.alternateExtensions = ["ogg"];	// add other extensions to try loading if the src file extension is not supported
        this.queue.installPlugin(createjs.Sound);
        this.queue.addEventListener("complete", function(e){me.OnLoad(e);});
        this.queue.addEventListener("progress", function(e){me.OnProgress(e);});
        this.queue.setMaxConnections(10);
        this.queue.loadManifest(manifest);
    },


    OnLoad: function(e)
    {
        if (!this.loaded)
        {
            this.queue.removeAllEventListeners("complete");
            this.queue.removeAllEventListeners("progress");

            this.loaded = true;
            this.handler.OnLoadSounds(e);
        }
    },


    OnProgress: function(e)
    {
        this.handler.OnProgressSounds(e);
    },


    PlaySound: function(name, options)
    {
        // Play the sound using the ID from manifest
        if (!$("body").hasClass("no_sound"))
        {
            if (!options)
            {
                options = {};
            }
            return createjs.Sound.play(name, options);
        }
    },


    StopAll: function()
    {
        createjs.Sound.stop();
    },


    Mute: function(value)
    {
        createjs.Sound.setMute(value);
    },


    GetMute: function()
    {
        return createjs.Sound.getMute();
    },


    ToggleMute: function()
    {
        this.Mute(!createjs.Sound.getMute());
    }
};