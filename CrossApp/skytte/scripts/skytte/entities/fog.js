define('skytte.entities.fog', ['skytte.numbers', 'skytte.entity'], function(numbers, Entity) {

    function FogEntity(game, kwargs) {
        Entity.apply(this, [game, 'FogEntity', 0, 0, kwargs]);
        this.sprite = this.game.getResource(kwargs.sprite);
        this.killWhenOffScreen = false;
        this.velocity.x = -140;
        this.reset(true);
    }

    FogEntity.prototype = Object.create(Entity.prototype);

    FogEntity.prototype.reset = function(firstTime) {
        if (firstTime)
            this.position.x = this.game.WORLD.WIDTH * (Math.random() - .5) * 2;
        else
            this.position.x = this.game.WORLD.WIDTH + this.game.WORLD.WIDTH * Math.random();
        this.position.y = this.game.WORLD.HEIGHT - this.sprite.height / this.game.SCREEN.SCALE / 2;
        this.angle = Math.random() * 360;
    };

    FogEntity.prototype.logic = function(timeDelta) {
        this.angle += 45 * timeDelta;
        this.velocity.y = Math.cos(numbers.radians(this.angle)) * 40;
        Entity.prototype.logic.apply(this, arguments);
        if (this.position.x + this.sprite.width < 0)
            this.reset();
    };

    FogEntity.prototype.draw = function(context, scale, x, y) {
        this.sprite.draw(context, scale * this.position.x + x, scale * this.position.y + y);
        Entity.prototype.draw.apply(this, arguments);
    };

    return FogEntity;
});
