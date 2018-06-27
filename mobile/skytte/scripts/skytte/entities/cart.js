define('skytte.entities.cart', ['skytte.entity', 'skytte.entities.turret'], function(Entity, TurretEntity) {

    function CartEntity(game, x, y, kwargs) {
        TurretEntity.apply(this, arguments);
        this.verticalSpeed = kwargs.verticalSpeed;
    }

    CartEntity.prototype = Object.create(TurretEntity.prototype);

    CartEntity.prototype.draw = function(context, scale, x, y) {
        var dx = Math.floor(this.position.x * scale + x);
        var dy = Math.floor(this.position.y * scale + y);
        this.drawShield(context, dx, dy);
        this.drawEngines(context, scale, this.position.x + x, this.position.y + y);
        this.drawWeapons(context, scale, this.position.x + x, this.position.y + y);
        this.drawShip(context, dx, dy);
        this.drawHit(context, dx, dy);
        Entity.prototype.draw.apply(this, arguments);
    };

    return CartEntity;
});
