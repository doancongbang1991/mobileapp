define('skytte.weapons.projectile', ['skytte.numbers', 'skytte.entity'], function(numbers, Entity) {

    function Projectile(game, x, y, kwargs) {
        Entity.apply(this, [game, 'Projectile', x, y, kwargs]);
        this.weapon = kwargs.weapon;
        this.damage = kwargs.damage;
        this.sprite = kwargs.sprite;
        // Additional property to ease projectile scaling.
        this.size = typeof kwargs.size === 'undefined' ? 1 : kwargs.size;
        this.angle = typeof kwargs.angle === 'undefined' ? 0 : kwargs.angle;

        if (this.box) {
            // In case of projectiles, position is center of an object, not top left corner of it.
            this.box.x = -this.box.width / 2;
            this.box.y = -this.box.height / 2;
        }
    };

    Projectile.prototype = Object.create(Entity.prototype);

    Projectile.prototype.explode = function() {
        this.dead = true;
    };

    Projectile.prototype.collidesWith = function(other) {
        var ShipEntity = require('skytte.entities.ship');
        if (other instanceof ShipEntity && this.team !== other.team)
            this.explode();
    };

    Projectile.prototype.draw = function(context, scale, x, y) {
        if (this.sprite) {
            context.save();
            context.translate(this.position.x * scale + x, this.position.y * scale + y);
            if (this.angle)
                context.rotate(numbers.radians(this.angle));
            if (this.size !== 1)
                context.scale(this.size, this.size);
            this.sprite.draw(context, -this.sprite.width/2, -this.sprite.height/2);
            context.restore();
        }
        Entity.prototype.draw.apply(this, arguments);
    };

    return Projectile;
});
