define('skytte.sprite', ['skytte.signal'], function(Signal) {

    function Sprite(url) {
        this.url = url;
        this.image = new Image();
        this.loaded = new Signal();
        this.hasLoaded = false;
    }

    Sprite.prototype.load = function() {
        this.image.addEventListener('load', this._onLoad.bind(this), false);
        this.image.addEventListener('error', this._onError.bind(this), false);
        this.image.src = this.url;
    };

    Sprite.prototype._onLoad = function() {
        this.hasLoaded = true;
        this.width = this.image.width;
        this.height = this.image.height;
        this.loaded.send(this);
    };

    Sprite.prototype._onError = function() {
        throw new Error("couldn't load resource '" + this.url + "'");
    };

    Sprite.prototype.draw = function(context, x, y) {
        context.drawImage(this.image, Math.floor(x), Math.floor(y));
    };

    return Sprite;
});
