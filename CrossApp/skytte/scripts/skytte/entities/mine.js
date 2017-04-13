define('skytte.entities.mine', ['settings', 'skytte.vector2', 'skytte.numbers', 'skytte.entities.ship'], function(settings, Vector2, numbers, ShipEntity) {

    function MineEntity(game, x, y, kwargs) {
        ShipEntity.apply(this, arguments);
        this.distanceSound = this.game.getResource(kwargs.distanceSound);
        //this._distanceSoundInstance = this.distanceSound.playLoop({'volume': 0});
        this.detonateDamage = kwargs.detonateDamage;
        this.detonateRadius = kwargs.detonateRadius;
        this.angle = Math.random() * 360;
    }

    MineEntity.prototype = Object.create(ShipEntity.prototype);

    MineEntity.prototype.logic = function() {
        ShipEntity.prototype.logic.apply(this, arguments);
        if (this.game.player) {
            var playerCenter = this.game.player.getCenter();
            var mineCenter = this.getCenter();
            var distance = new Vector2(playerCenter).distanceTo(mineCenter);
            var volume = numbers.clip(0, (this.game.WORLD.WIDTH/2 - distance) / (this.game.WORLD.WIDTH/2), 1) * settings('MINE_APPROACH_VOLUME', 1);
            var pan = numbers.clip(-1, (mineCenter.x - playerCenter.x) / this.game.WORLD.WIDTH, 1);
            //this._distanceSoundInstance.setVolume(settings('MINE_APPROACH_VOLUME'));
            //this._distanceSoundInstance.setPan(pan);
        } else
            ;//this._distanceSoundInstance.setVolume(0);
    };

    MineEntity.prototype.detonate = function() {
        if (!this.dead) {
            this.dead = true;
            var center = this.getCenter();
            this.game.addExplosion(center.x, center.y, this.detonateRadius, this.detonateDamage,
                                   this.game.ENEMY_TEAM);
            if (this.explosionSound)
                this.explosionSound.play({'volume': settings('SHIP_EXPLODE_VOLUME', 1)});
        }
    };

    MineEntity.prototype.onRemove = function() {
        //this._distanceSoundInstance.stop();
    };

    return MineEntity;
});
