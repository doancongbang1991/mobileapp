define('skytte.entities.turret', ['skytte.entity', 'skytte.entities.ship'], function(Entity, ShipEntity) {

    function TurretEntity(game, x, y, kwargs) {
        ShipEntity.apply(this, arguments);
    }

    TurretEntity.prototype = Object.create(ShipEntity.prototype);

    TurretEntity.prototype.logic = function(timeDelta) {
        this.regenerationDelay -= timeDelta * 1000;

        if (this.regenerationDelay<= 0 && this.shieldPerSecond && this.maxShield)
            this.shield = Math.min(this.maxShield, this.shield + this.shieldPerSecond * timeDelta);
        if (this.regenerationDelay<= 0 && this.healthPerSecond && this.maxShield)
            this.health = Math.min(this.maxHealth, this.health + this.healthPerSecond * timeDelta);

        Entity.prototype.logic.apply(this, arguments);

        this.hit.logic(timeDelta);
        if (this.hit.hasEnded && this.health > 0) {
            this.hit.begin = this.hit.change = 0;
            this.hit.toEnd();
        }

        for (var i = 0; i < this.weapons.length; i++)
            this.weapons[i].logic(timeDelta);
    };

    TurretEntity.prototype.draw = function(context, scale, x, y) {
        var dx = Math.floor(this.position.x * scale + x);
        var dy = Math.floor(this.position.y * scale + y);
        context.save();
        if (this.invincibleTime > 0)
            context.globalAlpha = (Math.floor(this.invincibleTime * .015) % 2) ? .4 : .8;
        this.drawShield(context, dx, dy);
        this.drawWeapons(context, scale, this.position.x + x, this.position.y + y);
        this.drawShip(context, dx, dy);
        this.drawHit(context, dx, dy);
        Entity.prototype.draw.apply(this, arguments);
        context.restore();
    };

    return TurretEntity;
});
