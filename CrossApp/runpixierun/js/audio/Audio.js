(function() 
{
    CocoonJS.Audio = function() 
    {
        return this;
    };

    CocoonJS.Audio.prototype = 
    {
        audio : null,
        setAudio : function( audio ) 
        {
            this.audio = audio;
            this.audio.load();
            return this;
        },
                
        loop : function( loop ) {
            return this;
        },

        play : function() 
        {
            this.audio.play();
            return this;
        },

        pause : function() 
        {
            this.audio.pause();
            return this;
        },
                
        stop: function()
        {
            this.audio.pause();
            this.audio.currentTime = 0;
        },
        
        volume : function(volume)
        {
            if (!this.audio) 
            {
                console.log("audio not present.");
                return;
            }
            
            this.audio.volume = volume;
            return this;
        },
        
        getVolume : function()
        {
            return this.audio.volume;
        }
    }
})();