define('skytte.entities.sprite', ['skytte.entity'], function(Entity) {

    function SpriteEntity(game, x, y, kwargs) {
        Entity.apply(this, [game, 'SpriteEntity', x, y, kwargs]);
        this.sprite = this.game.getResource(kwargs.sprite);
    }

    SpriteEntity.prototype = Object.create(Entity.prototype);

    SpriteEntity.prototype.getCenter = function() {
        return {'x': this.position.x + this.sprite.width/2, 'y': this.position.y + this.sprite.height/2};
    };

    SpriteEntity.prototype.draw = function(context, scale, x, y) {
        this.sprite.draw(context, this.position.x * scale + x, this.position.y * scale + y);
    };

    return SpriteEntity;
});
