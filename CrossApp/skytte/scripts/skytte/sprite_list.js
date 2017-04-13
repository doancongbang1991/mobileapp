define('skytte.sprite_list', ['skytte.signal', 'skytte.sprite'], function(Signal, Sprite) {

    function SpriteList(urlPattern, count) {
        this.urlPattern = urlPattern;
        this.count = count;
        this.loaded = new Signal();
        this.hasLoaded = false;
        this.sprites = [];
        this.toLoad = count;
        this._onSpriteLoadProxy = this._onSpriteLoad.bind(this);

        for (var i = 1; i <= count; i++) {
            var url = urlPattern.replace('%i', i);
            var sprite = new Sprite(url);
            this.sprites.push(sprite);
            sprite.loaded.connect(this._onSpriteLoadProxy);
        }
    }

    SpriteList.prototype._onSpriteLoad = function() {
        this.toLoad--;
        if (!this.toLoad) {
            this.hasLoaded = true;
            this.loaded.send(this);
        }
    };

    SpriteList.prototype.load = function() {
        this.toLoad = this.count;
        for (var i = 0; i < this.sprites.length; i++)
            this.sprites[i].load();
    };

    SpriteList.prototype.draw = function(context, x, y, i) {
        this.sprites[i].draw(context, x, y);
    };

    return SpriteList;
});
