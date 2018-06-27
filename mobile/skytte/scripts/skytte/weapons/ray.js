define('skytte.weapons.ray', ['skytte.numbers', 'skytte.vector2', 'skytte.per_second', 'skytte.polygon', 'skytte.beam', 'skytte.entity', 'skytte.weapons.weapon', 'skytte.weapons.projectile'],
    function(numbers, Vector2, PerSecond, Polygon, Beam, Entity, Weapon, Projectile) {

    function RayProjectile(game, x, y, kwargs) {
        Projectile.apply(this, arguments);

        this.damagePerSecond = this.damage;
        this.damage = 0;
        this.beam = new Beam(kwargs.beamColor, 3, 2, 35);
        this.beam.start.x = 0;
        this.beam.start.y = 0;
        this.beam.end.x = this.game.WORLD.WIDTH;
        this.beam.end.y = 0;

        this.updateBeam = new PerSecond(15, this.beam.update.bind(this.beam));
    }

    RayProjectile.prototype = Object.create(Projectile.prototype);

    RayProjectile.prototype.logic = function(timeDelta) {
        if (this.weapon.owner && this.weapon.owner.dead)
            this.dead = true;
        else {
            this.damage = this.damagePerSecond * timeDelta;
            this.updateBeam.logic(timeDelta);
        }
    };

    RayProjectile.prototype.collidesWith = function(other) {};

    RayProjectile.prototype.draw = function(context, scale) {
        this.beam.draw(context, scale, this.position.x, this.position.y);
        Entity.prototype.draw.apply(this, arguments);
    };


    function RayWeapon(game, ownerOrTeam, x, y, kwargs) {
        Weapon.apply(this, arguments);
        this.projectile = new RayProjectile(this.game, 0, 0, {'damage': this.damage, 'box': '0,0 10,10',
                                            'team': this.team, 'weapon': this, 'beamColor': kwargs.beamColor});
        this.projectile.polygon = Polygon.fromBox(this.projectile.box);
        this.projectile.dead = true;
    };

    RayWeapon.prototype = Object.create(Weapon.prototype);

    RayWeapon.prototype.startShooting = function() {
        Weapon.prototype.startShooting.apply(this, arguments);
        this.projectile.dead = false;
        if (!this.game.isEntityInGame(this.projectile)) {
            this.game.prependEntity(this.projectile);
            if (!this._fireSoundInstance)
                this._fireSoundInstance = this.fireSound.playLoop({'volume': this.fireSoundVolume});
        }

        this._fireSoundInstance.play({'loop': -1, 'volume': this.fireSoundVolume});
    };

    RayWeapon.prototype.spawnProjectile = function() {};

    RayWeapon.prototype.stopShooting = function() {
        Weapon.prototype.stopShooting.apply(this, arguments);
        this.projectile.dead = true;
        this._fireSoundInstance.stop();
    };

    RayWeapon.prototype.logic = function() {
        Weapon.prototype.logic.apply(this, arguments);

        if (this.shooting) {
            var x = this.position.x + this.owner.position.x + this.barrelOffset.x;
            var y = this.position.y + this.owner.position.y + this.barrelOffset.y;
            var w = numbers.clip(30, this.game.WORLD.WIDTH - x + 4, this.game.WORLD.WIDTH);

            this.projectile.box.width = w;
            this.projectile.polygon.points[1].x = w;
            this.projectile.polygon.points[2].x = w;
            this.projectile.position.x = x;
            this.projectile.position.y = y;
            this.projectile.damagePerSecond = this.damage;
            if (!this.game.isEntityInGame(this.projectile))
                this.game.prependEntity(this.projectile);
        } else if (this._fireSoundInstance)
            this._fireSoundInstance.stop();
    };

    return {'RayWeapon': RayWeapon, 'RayProjectile': RayProjectile};
});
