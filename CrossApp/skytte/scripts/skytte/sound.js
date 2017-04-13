define('skytte.sound', ['skytte.signal'], function(Signal) {

    function Sound(url, minDelay) {
        this.url = url;
        this.minDelay = minDelay || 0;
        this.loaded = new Signal();
        this.hasLoaded = false;
        this.toLoad = 0;
        this.lastPlay = null;
        this._onLoadProxy = this._onLoad.bind(this);
        createjs.Sound.addEventListener('fileload', this._onLoadProxy);
    }

    Sound.id = 0;

    Sound.prototype.load = function() {
        this._soundIds = [];
        var urls = this.url.split(' '), id;
        this.toLoad = urls.length;
        for (var i = 0; i < urls.length; i++) {
            var id = 'sound' + Sound.id;
            this._soundIds.push(id);
            Sound.id += 1;
            createjs.Sound.registerSound({'id': id, 'src': urls[i]});
        }
    };

    Sound.prototype._onLoad = function(event) {
        for (var i = 0; i < this._soundIds.length; i++)
            if (event.id === this._soundIds[i]) {
                this.toLoad -= 1;
                if (this.toLoad === 0) {
                    this.hasLoaded = true;
                    this.loaded.send(this);
                    createjs.Sound.removeEventListener('fileload', this._onLoadProxy);
                }
                break;
            }
    };

    Sound.prototype.getInstance = function() {
        var id = this._soundIds[Math.floor(Math.random() * this._soundIds.length)];
        return createjs.Sound.createInstance(id);
    };

    Sound.prototype.play = function(kwargs) {
        kwargs = kwargs || {};

        if (this.minDelay && this.lastPlay) {
            // Prevent comb filtering for some sounds.
            var time = new Date();
            if (time - this.lastPlay < this.minDelay)
                return createjs.Sound.defaultSoundInstance;
            this.lastPlay = time;
        } else if (this.minDelay)
            this.lastPlay = new Date();

        var id = this._soundIds[Math.floor(Math.random() * this._soundIds.length)];
        return createjs.Sound.play(id, kwargs);
    };

    Sound.prototype.playLoop = function(kwargs) {
        kwargs = kwargs || {};
        kwargs.loop = -1;
        return this.play(kwargs);
    };

    return Sound;
});
