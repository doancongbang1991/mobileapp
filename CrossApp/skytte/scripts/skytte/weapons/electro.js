define('skytte.weapons.electro', ['skytte.utils', 'skytte.numbers', 'skytte.vector2', 'skytte.per_second', 'skytte.bounding_box', 'skytte.polygon', 'skytte.beam', 'skytte.entity', 'skytte.weapons.weapon', 'skytte.weapons.projectile'],
    function(utils, numbers, Vector2, PerSecond, BoundingBox, Polygon, Beam, Entity, Weapon, Projectile) {

    function ElectroProjectile(game, x, y, kwargs) {
        Projectile.apply(this, arguments);

        this.damagePerSecond = this.damage;
        this.barrelOffset = kwargs.barrelOffset;
        this.damage = 0;
        this.hitSprite = kwargs.hitSprite;
        this.beam = new Beam(kwargs.beamColor, 15, 2);
        this.target = null;

        this.updateBeam = new PerSecond(15, this.beam.update.bind(this.beam));
    }

    ElectroProjectile.prototype = Object.create(Projectile.prototype);

    ElectroProjectile.prototype.setTarget = function(target) {
        this.target = target;
        this.updateBeamPosition();
        this.beam.update();
    };

    ElectroProjectile.prototype.updateBeamPosition = function() {
        if (this.target) {
            var targetCenter = this.target.getCenter(), barrel = this.weapon.getBarrel();
            this.beam.start.x = barrel.x;
            this.beam.start.y = barrel.y;
            this.position.x = this.beam.end.x = targetCenter.x;
            this.position.y = this.beam.end.y = targetCenter.y;
        }
    };

    ElectroProjectile.prototype.logic = function(timeDelta) {
        if (this.weapon.owner && this.weapon.owner.dead) {
            this.dead = true;
            this.target = null;
        }

        this.damage = this.damagePerSecond * timeDelta;
        if (this.target) {
            this.updateBeamPosition();
            this.updateBeam.logic(timeDelta);
        }

        Projectile.prototype.logic.apply(this, arguments);
    };

    ElectroProjectile.prototype.collidesWith = function(other) {};

    ElectroProjectile.prototype.draw = function(context, scale) {
        if (this.target) {
            this.beam.draw(context, scale);
            this.hitSprite.draw(context, scale * (this.beam.end.x - this.hitSprite.image.width/2),
                                scale * (this.beam.end.y - this.hitSprite.image.height/2));
        }
        Entity.prototype.draw.apply(this, arguments);
    };


    function ElectroWeapon(game, ownerOrTeam, x, y, kwargs) {
        Weapon.apply(this, arguments);
        this.radius = kwargs.radius;
        this.projectiles = [];

        var bulletPolygon = Polygon.fromString('-10,-10 10,-10 10,10 -10,10');
        var bulletBox = BoundingBox.fromPolygon(bulletPolygon);
        var config, i, projectile

        for (i = 0; i < kwargs.rayCount; i++) {
            config = {
                'box': bulletBox,
                'polygon': bulletPolygon,
                'hitSprite': this.game.getResource(kwargs.projectileHitSprite),
                'damage': kwargs.damage,
                'barrelOffset': this.barrelOffset,
                'team': this.team,
                'weapon': this,
                'beamColor': kwargs.beamColor};
            projectile = new ElectroProjectile(this.game, this.position.x, this.position.y, config);
            projectile.dead = true;
            this.projectiles.push(projectile);
        }

        this._fireSoundInstance = this.fireSound.getInstance();
    };

    ElectroWeapon.prototype = Object.create(Weapon.prototype);

    ElectroWeapon.prototype.spawnProjectile = function() {};

    ElectroWeapon.prototype.stopShooting = function() {
        Weapon.prototype.stopShooting.apply(this, arguments);
        for (var i = 0; i < this.projectiles.length; i++) {
            this.projectiles[i].dead = true;
            this.projectiles[i].target = null;
        }

        this._fireSoundInstance.stop();
    };

    ElectroWeapon.prototype.logic = function(timeDelta) {
        Weapon.prototype.logic.apply(this, arguments);

        var oneRayAtLeast = false;

        if (this.shooting) {
            var ShipEntity = require('skytte.entities.ship');
            var targets = [], result, weapon = this;
            var weaponX = this.position.x + this.owner.position.x + this.barrelOffset.x;
            var weaponY = this.position.y + this.owner.position.y + this.barrelOffset.y;

            for (var i = 0; i < this.projectiles.length; i++) {
                result = this.game.findClosest(weaponX, weaponY, ShipEntity, 0, function(target) {
                    return target.team && weapon.team !== target.team && !utils.inArray(target, targets);
                });

                this.projectiles[i].damagePerSecond = this.damage;

                if (result.target && result.distance <= this.radius) {
                    if (this.projectiles[i].target !== result.target) {
                        this.projectiles[i].setTarget(result.target);
                    }
                    if (this.projectiles[i].dead) {
                        this.game.addEntity(this.projectiles[i]);
                        this.projectiles[i].dead = false;
                    }
                    targets.push(result.target);
                    oneRayAtLeast = true;
                } else {
                    this.projectiles[i].dead = true;
                    this.projectiles[i].target = null;
                }
            }
        }

        if (oneRayAtLeast) {
            if (this._fireSoundInstance.playState !== createjs.Sound.PLAY_SUCCEEDED)
                this._fireSoundInstance.play({'loop': -1, 'volume': this.fireSoundVolume});
        } else
            this._fireSoundInstance.stop();

        if (this.owner.dead)
            for (var i = 0; i < this.projectiles.length; i++) {
                this.projectiles[i].dead = true;
                this.projectiles[i].target = null;
            }
    };

    return {'ElectroWeapon': ElectroWeapon, 'ElectroProjectile': ElectroProjectile};
});
