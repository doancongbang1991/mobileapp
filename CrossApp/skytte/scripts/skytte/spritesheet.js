define('skytte.spritesheet', ['skytte.sprite'], function(Sprite) {

    function SpritesheetSprite(spritesheet, x, y) {
        this.spritesheet = spritesheet;
        this.x = x;
        this.y = y;
        this.width = this.spritesheet.width;
        this.height = this.spritesheet.height;
    }

    SpritesheetSprite.prototype.draw = function(context, x, y) {
        this.spritesheet.drawSprite(context, this.x, this.y, x, y);
    };


    function Spritesheet(imageURL, spriteW, spriteH) {
        Sprite.apply(this, [imageURL]);
        this.width = spriteW;
        this.height = spriteH;
        this.sprites = {};
    }

    Spritesheet.prototype = Object.create(Sprite.prototype);

    Spritesheet.prototype._onLoad = function() {
        this.hasLoaded = true;
        this.loaded.send(this);
    };

    Spritesheet.prototype.getSprite = function(spriteX, spriteY) {
        var cacheKey = spriteX + ',' + spriteY;
        if (!this.sprites[cacheKey])
            this.sprites[cacheKey] = new SpritesheetSprite(this, spriteX, spriteY);
        return this.sprites[cacheKey];
    };

    Spritesheet.prototype.drawSprite = function(context, spriteX, spriteY, x, y) {
        context.drawImage(
            this.image, spriteX * this.width, spriteY * this.height,
            this.width, this.height, Math.floor(x), Math.floor(y), this.width, this.height);
    };

    return {'Spritesheet': Spritesheet, 'SpritesheetSprite': SpritesheetSprite};
});
