define('skytte.entities.teleporter', ['skytte.entity', 'skytte.entities.ship'], function(Entity, ShipEntity) {

    function TeleporterEntity(game, x, y, kwargs) {
        ShipEntity.apply(this, arguments);
    }

    TeleporterEntity.prototype = Object.create(ShipEntity.prototype);

    TeleporterEntity.prototype.drawShield = function(context, x, y) {
        if (this.shield > 1 && this.maxShield > 1) {
            context.globalAlpha = this.shield / this.maxShield * this.alpha;
            this.shieldSprite.draw(context, x, y);
            context.globalAlpha = this.alpha;
        }
    };

    TeleporterEntity.prototype.draw = function(context, scale, x, y) {
        var dx = Math.floor(this.position.x * scale + x);
        var dy = Math.floor(this.position.y * scale + y);
        context.save();
        this.drawShield(context, dx, dy);
        context.globalAlpha = Math.ceil(this.alpha * 10) % 2 ? .1 : 1;
        this.drawEngines(context, scale, this.position.x + x, this.position.y + y);
        this.drawWeapons(context, scale, this.position.x + x, this.position.y + y);
        this.drawShip(context, dx, dy);
        this.drawHit(context, dx, dy);
        context.restore();
        Entity.prototype.draw.apply(this, arguments);
    };

    return TeleporterEntity;
});
