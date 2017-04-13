var FidoAudio = (function()
{    
    var cSoundPool = {};
    var DEFAULT_FADE_OUT_TIME = 1;
    var DEFAULT_FADE_IN_TIME = 1;
    var MUTE_ALL = false;
    
    var Device = new Fido.Device();
    var LocalStorage = new Fido.LocalStorage();
    
    var aSounds = [
        {
            src : 'audio/mainLoop',
            volume: 0.6,
            maxVolume: 0.6,
            loop: true,
            autoPlay: false,
            type : 'music',
            name : 'gameMusic'
        },
        {
            src : 'audio/footLoopRegular',
            volume: 0.0,
            maxVolume: 0.6,
            loop: true,
            autoPlay: false,
            type : 'music',
            name : 'runRegular'
        },
        {
            src : 'audio/footLoopFast',
            volume: 0.0,
            maxVolume: 0.6,
            loop: true,
            autoPlay: false,
            type : 'music',
            name : 'runFast'
        },
        {
            src : 'audio/thrustLoop',
            volume: 0.0,
            maxVolume: 0.4,
            loop: true,
            autoPlay: true,
            type : 'music',
            name : 'thrusters'
        },
        {
            src : 'audio/pickupGrab',
            volume: 0.5,
            maxVolume: 0.5,
            loop: false,
            autoPlay: false,
            type : 'sfx',
            name : 'pickup'
        },
        {
            src : 'audio/blockHit',
            volume: 0.2,
            maxVolume: 0.2,
            loop: false,
            autoPlay: false,
            type : 'sfx',
            name : 'blockHit'
        },
        {
            src : 'audio/lavaSplosh',
            volume: 0.5,
            maxVolume: 0.5,
            loop: false,
            autoPlay: false,
            type : 'sfx',
            name : 'lavaSplosh'
        },
        {
            src : 'audio/fallThud',
            volume: 1.0,
            maxVolume: 1.0,
            loop: false,
            autoPlay: false,
            type : 'sfx',
            name : 'thudBounce'
        },
        {
            src : 'audio/DeathJingle',
            volume: 0.7,
            maxVolume: 0.7,
            loop: false,
            autoPlay: false,
            type : 'sfx',
            name : 'deathJingle'
        },
        {
            src : 'audio/hyperMode',
            volume: 0.2,
            maxVolume: 0.2,
            loop: false,
            autoPlay: false,
            type : 'sfx',
            name : 'hyperMode'
        }
    ];

    function init()
    {   
        if(Device.cocoonJS === true)
        {
            for(var i = 0; i < aSounds.length; i++)
            {
                var cSound = aSounds[i];
                
                switch(cSound.type)
                {
                    case 'music':
                        
                        CocoonJS.App.markAsMusic(cSound.src + ".ogg");

                        var music = document.createElement('audio');
                        music.src = cSound.src + ".ogg";
                        music.loop = cSound.loop;
                        
                        cSound.audio = new CocoonJS.Music().setAudio(music);
                        cSound.audio.volume(cSound.volume);
                        
                        cSoundPool[cSound.name] = cSound;
                  
                        if(cSound.autoPlay === true) cSoundPool[cSound.name].audio.play();
                        
                    break;
                    
                    case 'sfx':
                        
                        var sfx = new Audio();
                        sfx.src = cSound.src + ".ogg";
                        cSound.audio = new CocoonJS.Audio().setAudio(sfx);
                        cSound.audio.volume(cSound.volume);
                        
                        cSoundPool[cSound.name] = cSound;
                        
                    break;
                }
            } 
        }
        else
        {
            for(var i = 0; i < aSounds.length; i++)
            {
                var cSound = aSounds[i];
                 
                cSound.audio = new Howl({
                    urls: [cSound.src + ".mp3"],
                    autoplay: cSound.autoPlay,
                    loop: cSound.loop,
                    volume: cSound.volume,
                    onload: function()
                    {
                        //alert('loaded');
                    },
                    onend: function()
                    {
                        //alert('finished playing sound');
                    },
                    onloaderror: function()
                    {
                        alert('ERROR : Failed to load ' + cSound.src + ".m4a");
                    },
                    onplay: function()
                    {
                        //alert('playing');
                    }
                });
                 
                cSoundPool[cSound.name] = cSound;
            }
        }

        if(LocalStorage.get('gameMuted') === 'true') FidoAudio.muteAll();
    }
    
    function isMuted()
    {
        return MUTE_ALL;
    }
    
    function muteAll()
    {   
        MUTE_ALL = true;
        LocalStorage.store('gameMuted', true);
        
        if(Device.cocoonJS === true)
        {
            var sKey = false;
            
            for(sKey in cSoundPool)
            {   
                var cSound = cSoundPool[sKey];
                
                var holder = {
                    volume:  cSound.audio.getVolume()
                };
                
                muteOneSound(cSound, holder);  
            }
        }
        else
        {
            var cHolder = { 
                volume: 1
            };

            TweenLite.to(cHolder, 1, { volume: 0, onUpdate: function()
            {  
                Howler.volume(this.target.volume);
            }, onComplete : function()
            {
                Howler.mute();
            }});
        }
    }
    
    function muteOneSound(cSound, holder)
    {
        TweenLite.to(holder, 1, { volume: 0, onUpdate: function()
        {  
            cSound.audio.volume(this.target.volume);
        }});    
    }
    
    function unMuteOneSound(cSound, holder)
    {
        TweenLite.to(holder, 1, { volume: cSound.volume, onUpdate: function()
        {  
            cSound.audio.volume(this.target.volume);
        }}); 
    }
    
    function unMuteAll()
    {
        MUTE_ALL = false;
        LocalStorage.store('gameMuted', false)
        
        if(Device.cocoonJS === true)
        {
            var sKey = false;

            for(sKey in cSoundPool)
            {
                var cSound = cSoundPool[sKey];
                unMuteOneSound(cSound, { 
                    volume: 0 
                });
            }
        }
        else
        {
            var cHolder = { 
                volume: 0
            };
            
            Howler.unmute();
            
            TweenLite.to(cHolder, 1, { volume: 1, onUpdate: function(cObject, sProperty)
            {  
                Howler.volume(this.target.volume);
            }});
        }
    }
    
    function play(id)
    {
        if(cSoundPool.hasOwnProperty(id))
        {
            cSoundPool[id].audio.play();
            
        }
        else
        {
            console.log("WARNING :: Couldn't find sound '" + id + "'.");
        }
    }
    
    function fadeOut(sKey)
    {
        var cSound = cSoundPool[sKey];
                
        var holder = {
            volume:  0
        };

        muteOneSound(cSound, holder); 
    }
    
    function fadeIn(id, time)
    {
        if(!soundExists(id)) return;
        
        var cSound = cSoundPool[id];
        var nFadeInTime = time || DEFAULT_FADE_IN_TIME;
        
        var cHolder = { 
            volume: 0
        };
        
        TweenLite.to(cHolder, nFadeInTime, { volume: cSound.maxVolume, onUpdate: function(cObject, sProperty)
        {  
            setVolume(id, this.target.volume);
        }});
    }
    
    function soundExists(id)
    {
        return cSoundPool.hasOwnProperty(id);
    }
    
    function setVolume(id, volume)
    {
        if(!soundExists(id)) return;
        
        if(MUTE_ALL === true)
        {
            cSoundPool[id].volume = volume;    
        }
        else
        {
            cSoundPool[id].audio.volume(volume);
        }
    }
    
    function stop(id)
    {
        cSoundPool[id].audio.stop();
    }
    
    return {
        init: init,
        play: play,
        stop : stop,
        fadeOut : fadeOut,
        fadeIn : fadeIn,
        setVolume : setVolume,
        muteAll : muteAll,
        unMuteAll : unMuteAll,
        isMuted : isMuted
    }
    
})();