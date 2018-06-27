(function() 
{
    CocoonJS.Music = function() 
    {
        return this;
    };

    CocoonJS.Music.prototype = 
    {
        audio : null,
        setAudio : function(audio) 
        {
            this.audio = audio;
            this.audio.load();
            this.audio.addEventListener(
                'ended',
                function(audioEvent) 
                {
                    audioEvent.target.playing= false;
                    console.log("Audio ends playing.");
                },
                false
            );
            return this;
        },

        loop : function() 
        {
            if (!this.audio) 
            {
                console.log("audio not present.");
                return;
            }

            this.audio.loop= !this.audio.loop;
            return this;
        },

        play : function() {

            if (!this.audio) {
                console.log("audio not present.");
                return;
            }

            if (this.audio.playing) {
                return;
            }
            
            this.audio.playing = true;
            this.audio.play();

            return this;
        },

        pause : function() 
        {
            if (!this.audio) 
            {
                console.log("audio not present.");
                return;
            }
            
            this.audio.pause();
            this.audio.playing = false;
            
            return this;
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
        },
        
        stop: function()
        {
            this.audio.pause();
            this.audio.currentTime = 0;
        },
    }
})();