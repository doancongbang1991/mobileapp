define('skytte.ai.cart', ['skytte.ai.base'], function(BaseAI) {

    function CartAI(game, entity, kwargs) {
        BaseAI.apply(this, arguments);
        // -1 means move up, 1 means move down.
        this.direction = kwargs.direction || -1;
    }

    CartAI.prototype = Object.create(BaseAI.prototype);

    CartAI.prototype.logic = function(timeDelta) {
        var center = this.entity.getCenter();
        if ((center.y <= 0 && this.direction === -1) ||
            (center.y >= this.game.WORLD.HEIGHT && this.direction === 1))
            this.direction *= -1;

        this.entity.velocity.y = this.entity.verticalSpeed * this.direction;
        this.entity.velocity.x = -this.entity.speed;

        for (var i = 0; i < this.entity.weapons.length; i++)
            if (!this.entity.weapons[i].shooting)
                this.entity.weapons[i].startShooting();
    };

    return CartAI;
});
