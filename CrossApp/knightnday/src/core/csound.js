csound = function(game, x, y){ 

    if (!SoundData.atlasKey) {
        trace("create new sound object from sprite");
        if (csound.isPlaying == true)
            Phaser.Sprite.call(this, game, x, y, SoundData.soundOn);
        else
            Phaser.Sprite.call(this, game, x, y, SoundData.soundOff);
    }
    else{
        trace("create new sound object from sprite");
        Phaser.Sprite.call(this, game, x, y, SoundData.atlasKey);
        if (csound.isPlaying == true)
            this.frameName = SoundData.soundOn;
        else 
            this.frameName = SoundData.soundOff;
    }


    if (csound.isLocked) {
        game.input.onUp.addOnce(function() {
            trace("on global tap ");
            csound.isLocked = false;
            // game.sound.touchLocked = false;
            csound.mute(true);
        });
    }

    csound._instance = this;
    csound.initMain();
   

    this.inputEnabled = true;
    this.events.onInputDown.add(this.downSound, this);
    game.add.existing(this); 
    if (Branding) if (Branding.isSoundNeedDisabled() == true) this.visible = false;
    
};


// static variable
csound._instance = null;
csound.isPlaying = true;
csound.musicObj = [];
csound.sfxObj = [];
csound.idx = -1;
csound.ctrReady = 0;

csound.firstFlag = true;
csound.isLocked = false; // for android stock browser only
csound.ready = false;
csound._instance = null;
csound._buttons = [];

csound.start = function() {
    if (Branding) if (Branding.isSoundNeedDisabled() == true) return;
    for (var i = 0; i < SoundData.bgm.length; i++) {
        Asset.audio(SoundData.bgm[i]);
    }
    for (var i = 0; i < SoundData.sfx.length; i++) {
        Asset.audio(SoundData.sfx[i]);
    }
}

csound.checkTouchLock = function() {
    return (game.sound.touchLocked === true) || (csound.isLocked === true);
}

csound.isDecoded = function() {
    if (!csound.musicObj[0]) return false;
    return csound.musicObj[0].isDecoded;
}

csound.initMain = function() {
    if (csound.ready) return;
    if (!csound.firstFlag) return;
    if (game.input.touch.preventDefault == false) {
        if (csound._instance) csound._instance.inputEnabled = game.input.touch.preventDefault;
    }
}

csound.init =  function() {
    SoundData.init();
    if (Branding) if (Branding.isSoundNeedDisabled() == true) return;
    if (!csound.firstFlag) return;
    if (csound.ready) return;

    csound.musicObj = [];
    for (var i = 0; i < SoundData.bgm.length; i++) {
        var music = game.add.audio(SoundData.bgm[i], 1, true);
        csound.musicObj[i] = music;
    }

    
    csound.sfxObj = [];
    if (Phaser.Device.desktop || SoundData.mobileSFX) {
        for (var i = 0; i < SoundData.sfx.length; i++) {
            var music = game.add.audio(SoundData.sfx[i], 1, false);
            csound.sfxObj[SoundData.sfx[i]] = music;
        }
    }


    // check for device sound lock status
    csound.isLocked = 
        (game.device.isAndroidStockBrowser() && parseFloat(platform.os.version) < 4.4) ||
        (platform.os.family.toLowerCase() == 'ios' && parseInt(platform.os.version, 10) < 8 && platform.name.toLowerCase().indexOf("chrome")>=0);
        // (platform.os.family.toLowerCase() == 'ios' && parseInt(platform.os.version, 10) == 9);

    if (csound.checkTouchLock() && csound.firstFlag) {
        csound.isPlaying = false;
        game.input.touch.preventDefault = false;
    }
    else csound.onReady();

    csound.musicObj[0].play("",0,SoundData.bgmVolume,true,false);
    csound.idx = 0;
    // csound.play(0, true);
    // SoundData.init();
}

csound.onReady = function() {
    csound.ready = true;
    if (csound._instance) csound._instance.inputEnabled = game.input.touch.preventDefault;
    // game.input.touch.preventDefault = false;
    // if (csound._buttons) {
    //     for (var i = 0; i< csound._buttons.length; i++) {
    //         var o = csound._buttons[i];
    //         o.inputEnabled = game.input.touch.preventDefault;
    //     }
    // }
}

csound.debug = function() {
    if (!game_config.debug) return;

    game.debug.font = '20px Courier';
    if (csound.musicObj[csound.idx])
        game.debug.soundInfo(csound.musicObj[csound.idx], 100, 500, 'rgb(255,0,0)');
}


csound.first = true;

csound.play = function(idx, forcePlay) {
    if (Branding) if (Branding.isSoundNeedDisabled() == true) return;
    if( typeof idx == 'undefined' || idx == null) {
        idx = 0;
    }

    if( typeof forcePlay == 'undefined' || forcePlay == null) {
        forcePlay = false;
    }
    trace("csound.play", idx, forcePlay);

    // mute sound if not playing, but still set the active muaic object
    if (!csound.isPlaying) {
        csound.idx = idx;
        csound.mute();
        return;
    }

     if (idx != csound.idx || forcePlay) {
        if (csound.musicObj[idx])
            if (csound.musicObj[csound.idx].isPlaying)
                csound.musicObj[csound.idx].stop();

        csound.idx = idx;
        trace("play music " + csound.idx);

        csound.musicObj[csound.idx].play("",0,SoundData.bgmVolume,true,false);
        csound.isPlaying = true;
    }
}

csound.mute = function(force) {
    if (!csound.ready && !force) return;
    for (var i = 0; i < SoundData.bgm.length; i++) {
        if (csound.musicObj[i])
            // if (csound.musicObj[i].isPlaying)
                csound.musicObj[i].stop();
    }
}


csound.sfx = function(name, volume) {
    if (Branding) if (Branding.isSoundNeedDisabled() == true) return;
    if (!csound.ready) return;
    if (!csound.isPlaying) return;
    volume = volume || 1;

    if (!Phaser.Device.desktop && !SoundData.mobileSFX) {
        // csound.musicObj[csound.idx].pause();
        return;
    }

    csound.sfxObj[name].play("",0,SoundData.sfxVolume);

    // if (!Phaser.Device.desktop) {
    //     csound.sfxObj[name].onStop.addOnce(function(){
    //         csound.musicObj[csound.idx].resume();
    //     });
    // }
}









// public variable
csound.inherit({
    idxArray: null,
    r: null,
    c: null,
    status: false,
    maxStep: 5,
    ctrStep: 0,

    onStepping: function() {
        this.status = true;
    },

    downSound:function(something) {
        // if (!csound.ready) return;
        trace("downsound", csound.isPlaying, this.inputEnabled);
        if (csound.isPlaying == true) {
            csound.isPlaying = false;
            this.changeSprite(csound.isPlaying);
            if (csound.musicObj[csound.idx])
                csound.musicObj[csound.idx].stop();
        } else {
            csound.isPlaying = true;
            this.changeSprite(csound.isPlaying);
            csound.play(csound.idx, true);
        }
    },

    reset: function() {
        this.status = false;
        this.ctrStep = 0;
    },

    changeSprite: function(isON) {
        if (!SoundData.atlasKey) {
            if (isOn) 
                this.loadTexture(SoundData.soundOn);
            else 
                this.loadTexture(SoundData.soundOff);
        }
        else {
            if (isON) 
                this.frameName = SoundData.soundOn;
            else 
                this.frameName = SoundData.soundOff;
        }
    },

    update: function() {
        if (csound.ready == false && csound.firstFlag && csound.musicObj[0] && csound.checkTouchLock() === false) {
            if (csound.ctrReady-- < 0) {
                game.input.touch.preventDefault = true;
                csound.firstFlag = false;
                csound.isPlaying = true;
                this.changeSprite(csound.isPlaying);

                csound.onReady();
                
                // var state =  game.state.getCurrentState();
                // if (state.btnPlay) state.btnPlay.inputEnabled = game.input.touch.preventDefault;
                csound.play(0, true);
            }
        }
        // if (!csound.ready) trace("check csound update");
    }
}, Phaser.Sprite);